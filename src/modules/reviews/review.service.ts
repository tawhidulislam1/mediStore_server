import { prisma } from "../../lib/prisma";

const createReview = async (payload: {
  medicineId: string;
  customerId: string;
  rating: number;
  comment: string;
}) => {
  const res = await prisma.reviews.create({
    data: payload,
  });
  console.log(res);
  return res
};

export const reviewService = {
  createReview,
};
