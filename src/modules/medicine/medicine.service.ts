import { Medicines, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMedicine = async (
  data: Omit<Medicines, "id" | "createdAt" | "updatedAt">,
) => {
  const res = await prisma.medicines.create({
    data,
  });
  console.log(res, data);
  return res;
};

const getAllMedicine = async (payload: {
  search: string | undefined;
  category: string;
  price: number;
  manufacturer: string;
}) => {
  const addCondition: Prisma.PostWhereInput[] = [];
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
  
  const res = await prisma.medicines.findMany({
    include: {
      _count: {
        select: { orders: true, reviews: true },
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
      _count: {
        select: { orders: true, reviews: true },
      },
    },
  });
  return res;
};

const updateMedicine = async (medicineId: string, data: Partial<Medicines>) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
  });
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
  updateMedicine,
  deleteMedicine,
};
