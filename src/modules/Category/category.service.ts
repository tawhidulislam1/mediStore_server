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

export const categoryService = {
  createCategory,
};
