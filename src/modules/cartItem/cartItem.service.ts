import { CartItemUpdateInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
const createCartItem = async (payload: {
  medicineId: string;
  customerId: string;
  cartId?: string; 
  quantity: number;
}) => {
  let cart = null;
  if (payload.cartId) {
    cart = await prisma.cart.findUnique({
      where: { id: payload.cartId },
      include: { items: true },
    });
  } else {
    cart = await prisma.cart.findFirst({
      where: { userId: payload.customerId },
      include: { items: true },
    });
  }

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: payload.customerId },
    });
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      customerId: payload.customerId,
      medicineId: payload.medicineId,
      quantity: payload.quantity,
    },
  });

  return cartItem;
};

const getCartItem = async () => {
  const cart = await prisma.cartItem.findMany({
    include: {
      medicines: {
        select: {
          id: true,
          name: true,
          description: true,
          stock: true,
          price: true,
          sellerId: true,
          categoryId: true,
          image: true,
        },
      },
    },
  });

  const cartWithTotal = cart.map((item) => {
    const totalPrice = item.quantity * item.medicines.price;
    return {
      ...item,
      totalPrice,
    };
  });

  return cartWithTotal;
};

const updateCartItem = async (
  cartItemId: string,
  quantity: CartItemUpdateInput,
) => {
  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: quantity,
    include: { medicines: true },
  });

  return updatedCartItem;
};

const deleteCartItemById = async (id: string, userId: string) => {
  const cartData = await prisma.cartItem.findFirst({
    where: { customerId: userId },
  });
  if (cartData?.customerId !== userId) {
    throw new Error("You are not authorized to delete this cart");
  }
  return await prisma.cartItem.delete({
    where: { id },
  });
};

export const CartItemService = {
  createCartItem,
  getCartItem,
  updateCartItem,
  deleteCartItemById,
};
