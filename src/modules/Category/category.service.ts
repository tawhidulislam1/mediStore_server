import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (
  data: Omit<Category, "id" | "createdAt" | "updatedAt" | "userId">,
  userId: string,
) => {
  const res = await prisma.category.create({
    data: {
      ...data,
      userId: userId,
    },
  });
  return res;
};

const getAllCategory = async () => {
  const res = await prisma.category.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
      _count: {
        select: {
          Medicines: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res;
};
const getCategoryById = async (id: number) => {
  const res = await prisma.category.findMany({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
      _count: {
        select: {
          Medicines: true,
        },
      },
    },
  });
  return res;
};

const updateCategory = async (
  categoryId: number,
  data: Partial<Category>,
  userId: string,
  isAdmin: Boolean,
) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
    include: {
      user: true,
    },
  });

  if (!isAdmin && categoryData.userId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.category.update({
    where: {
      id: categoryData.id,
    },
    data,
  });
  return result;
};
const deleteCategory = async (categoryId: number) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  return await prisma.category.delete({
    where: {
      id: categoryData.id,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
