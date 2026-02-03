import { Orders, OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { USERROLE } from "../../middlewere/auth";
const createOrder = async (
  data: Omit<Orders, "id" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { customerId: userId },
      include: { medicines: true },
    });
    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.medicines.price,
      0,
    );
    // ✅ ONLY THIS PART ADDED (quantity decrement)
    for (const item of cartItems) {
      await prisma.medicines.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const order = await prisma.orders.create({
      data: {
        customerId: userId,
        totalPrice,
        shippingAddress: data.shippingAddress,
        paymentGateway: data.paymentGateway,
        orderItems: {
          create: cartItems.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.medicines.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
    await prisma.cartItem.deleteMany({ where: { customerId: userId } });
    return order;
    // const newOrder = await prisma.orders.create({ data });
    // await prisma.cart.deleteMany({ where: { id: data.cartId } });
    // return newOrder;
  } catch (err) {
    console.error("Checkout failed:", err);
    throw new Error("Could not complete order");
  }
};
const getAllOrders = async (user: { id: string; role: USERROLE }) => {
  let whereCondition: any = {};

  if (user.role === USERROLE.ADMIN) {
    whereCondition = {};
  } else if (user.role === USERROLE.CUSTOMER) {
    whereCondition = { customerId: user.id };
  } else if (user.role === USERROLE.SELLER) {
    whereCondition = {
      orderItems: {
        some: {
          medicines: {
            sellerId: user.id,
          },
        },
      },
    };
  }

  const orders = await prisma.orders.findMany({
    where: whereCondition,
    include: {
      customer: {
        select: {
          name: true,
          image: true,
          email: true,
          role: true,
          phone: true,
        },
      },

      orderItems: {
        where:
          user.role === USERROLE.SELLER
            ? { medicines: { sellerId: user.id } }
            : {},
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              price: true,
              manufacturer: true,
              seller: {
                select: { name: true, categories: { select: { name: true } } },
              },
            },
          },
        },
      },
    },

    orderBy: { orderDate: "desc" },
  });

  return orders;
};
const getOrderById = async (orderId: string, user: any) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          image: true,
          role: true,
          phone: true,
        },
      },
      orderItems: {
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              price: true,
              manufacturer: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  categories: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) throw new Error("Order not found");

  if (user.role === USERROLE.SELLER) {
    const sellerItems = order.orderItems.filter(
      (item) => item.medicines.seller.id === user.id,
    );

    if (sellerItems.length === 0)
      throw new Error("Not authorized to view this order");

    const sellerSubtotal = sellerItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    return {
      orderId: order.id,
      status: order.status,
      orderDate: order.orderDate,
      totalPrice: order.totalPrice,
      customer: order.customer,
      items: sellerItems,
      sellerSubtotal,
    };
  }

  if (user.role === USERROLE.CUSTOMER && order.customerId !== user.id) {
    throw new Error("You are not authorized to view this order");
  }

  return order;
};

const updateOrderStatus = async (
  orderId: string,
  userId: string,
  userRoles: string,
  newStatus: OrderStatus,
) => {
  // Fetch the order once for validation
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // --------------------------
  // CUSTOMER LOGIC
  // --------------------------
  if (userRoles.includes(USERROLE.CUSTOMER)) {
    // Customers can only CANCEL
    if (newStatus !== OrderStatus.CANCEL) {
      throw new Error("Customers can only cancel orders");
    }

    // Check if this order belongs to the customer
    if (order.customerId !== userId) {
      throw new Error("You cannot update this order");
    }

    return prisma.orders.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCEL,
        updatedAt: new Date(),
      },
    });
  }

  // --------------------------
  // SELLER LOGIC
  // --------------------------
  if (userRoles.includes(USERROLE.SELLER)) {
    // Check if the seller has items in this order
    const sellerItems = await prisma.orderItem.findMany({
      where: {
        orderId,
        medicines: {
          sellerId: userId,
        },
      },
    });

    if (sellerItems.length === 0) {
      throw new Error("You are not authorized to update this order");
    }

    // Seller can update status
    return prisma.orders.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });
  }

  throw new Error("You are not authorized to update orders");
};



export const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
