import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCart = async (data: Prisma.CartCreateInput, userId: string) => {
  const cartData = await prisma.cart.findFirst({
    where: { userId: userId },
  });

  if (!cartData) {
    return prisma.cart.create({
      data: {
        ...data,
      },
    });
  }
  return cartData;
};
const getMyCart = async (userId: string) => {
  let cart = await prisma.cart.findMany({
    where: { userId },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          medicines: {
            select: {
              name: true,
              price: true,
              id: true,
              image: true,
              description:true
            },
          },
        },
      },
    },
  });

  return cart;
};
const getCartById = async (id: string) => {
  const cart = await prisma.cart.findFirst({
    where: { id },
    include: {
      items: true,
    },
  });

  return cart;
};

const deleteCartById = async (id: string, userId: string) => {
  const cartData = await prisma.cart.findFirst({
    where: { userId: userId },
  });
  if (cartData?.userId !== userId) {
    throw new Error("You are not authorized to delete this cart");
  }
  return await prisma.cart.delete({
    where: { id },
  });
};

export const CartService = {
  createCart,
  getCartById,
  getMyCart,
  deleteCartById,
};
