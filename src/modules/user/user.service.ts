import { Category, User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAlluser = async () => {
  const res = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true, medicines: true, reviews: true },
      },
    },
  });
  return res;
};
const getAlluserById = async (userId: string) => {
  const res = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cartItems: true,
      _count: {
        select: { orders: true, medicines: true, reviews: true },
      },
    },
  });
  return res;
};

const updateUserData = async (userId: string, data: Partial<User>) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data,
  });
  return result;
};
const updateUser = async (
  userId: string,
  data: Partial<User>,
  isAdmin: boolean,
) => {
  const postData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });
  if (!isAdmin && postData.id !== userId) {
    throw new Error("your are not owner in this user");
  }
  if (!isAdmin) {
    delete data.role;
  }
  const result = await prisma.user.update({
    where: {
      id: postData.id,
    },
    data,
  });
  return result;
};

const deleteUser = async (userId: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  return await prisma.user.delete({
    where: {
      id: userData.id,
    },
  });
};

export const userService = {
  getAlluser,
  getAlluserById,
  updateUserData,
  updateUser,
  deleteUser,
};
