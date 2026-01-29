import { Reviews } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: {
  medicineId: string;
  customerId: string;
  rating: number;
  comment: string;
}) => {
  return await prisma.reviews.create({
    data: payload,
  });
};

const reviewAll = async () => {
  return await prisma.reviews.findMany({
    include: {
      medicines: {
        select: {
          name: true,
          id: true,
        },
      },
      customer: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};
const reviewById = async (id: string) => {
  return await prisma.reviews.findUnique({
    where: {
      id,
    },
    include: {
      medicines: {
        select: {
          name: true,
          id: true,
        },
      },
      customer: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};
const reviewUpdate = async (
  reviewId: string,
  data: Partial<Reviews>,
  userId: string,
) => {
  const reviewData = await prisma.reviews.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
    include: {
      customer: true,
    },
  });

  if (reviewData.customerId !== userId) {
    throw new Error("your are not owner in this review");
  }
  const result = await prisma.reviews.update({
    where: {
      id: reviewData.id,
    },
    data,
  });
  return result;
};
const reviewDelete = async (
  reviewId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const reviewData = await prisma.reviews.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      customer: true,
    },
  });
  if (!reviewData) {
    throw new Error("Review not found");
  }

  if (!isAdmin && reviewData.customerId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.reviews.delete({
    where: {
      id: reviewId,
    },
  });

  return result;
};

export const reviewService = {
  createReview,
  reviewAll,
  reviewById,
  reviewUpdate,
  reviewDelete,
};
