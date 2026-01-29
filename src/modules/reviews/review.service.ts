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

export const reviewService = {
  createReview,
};
