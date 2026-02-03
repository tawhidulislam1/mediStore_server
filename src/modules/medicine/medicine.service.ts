import { object } from "better-auth";
import { Medicines, Prisma, User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { MedicinesWhereUniqueInput } from "../../../generated/prisma/models";
import { USERROLE } from "../../middlewere/auth";

const createMedicine = async (
  data: Omit<Medicines, "id" | "createdAt" | "updatedAt">,
) => {
  const medicineData = {
    ...data,
  };

  const res = await prisma.medicines.create({
    data: medicineData,
  });

  return res;
};

const getAllMedicine = async (payload: {
  search?: string | undefined;
  category?: string | undefined;
  status?: string | undefined;
}) => {
  const addCondition: Prisma.MedicinesWhereInput[] = [];
  if (payload.search) {
    addCondition.push({
      OR: [
        {
          name: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (payload.category) {
    addCondition.push({
      categoryId: Number(payload.category),
    });
  }
  if (payload.status) {
    addCondition.push({
      status: payload.status as any,
    });
  }

  const res = await prisma.medicines.findMany({
    where: {
      AND: addCondition,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: { name: true },
      },
      reviews: true,
      seller: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
      _count: {
        select: { orderItems: true, reviews: true },
      },
    },
  });
  return res;
};
const getMedicineById = async (medicineid: string) => {
  const res = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineid,
    },
    include: {
      category: {
        select: { name: true, id: true },
      },
      reviews: {
        select: {
          comment: true,
          createdAt: true,
          id: true,
          customer: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          role: true,
        },
      },
      _count: {
        select: { reviews: true, orderItems: true },
      },
    },
  });
  return res;
};
const getMedicineBySeller = async (sellerId: string) => {
  const medicineData = await prisma.medicines.findMany({
    where: {
      sellerId: sellerId,
    },
    include: {
      category: {
        select: { name: true },
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          role: true,
        },
      },
    },
  });
  return medicineData;
};

const updateMedicine = async (
  medicineId: string,
  data: Partial<Medicines>,
  userId: string,
) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    include: {
      seller: true,
    },
  });

  if (medicineData.sellerId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.medicines.update({
    where: {
      id: medicineData.id,
    },
    data,
  });
  return result;
};
const deleteMedicine = async (medicineId: string) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
  });

  return await prisma.medicines.delete({
    where: {
      id: medicineData.id,
    },
  });
};

export const medicineService = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  getMedicineBySeller,
  updateMedicine,
  deleteMedicine,
};
