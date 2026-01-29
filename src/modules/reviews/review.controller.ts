import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import { USERROLE } from "../../middlewere/auth";

const createReview = async (req: Request, res: Response) => {
  try {
    const result = await reviewService.createReview(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review created failed",
      details: error,
    });
  }
};
const reviewAll = async (req: Request, res: Response) => {
  try {
    const result = await reviewService.reviewAll();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review Finds failed",
      details: error,
    });
  }
};
const reviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await reviewService.reviewById(id as string);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review Find failed",
      details: error,
    });
  }
};
const reviewUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const result = await reviewService.reviewUpdate(
      id as string,
      req.body,
      user?.id as string,
    );
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};
const reviewDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const isAdmin = user?.role === USERROLE.ADMIN;

    const result = await reviewService.reviewDelete(
      id as string,
      user?.id as string,
      isAdmin,
    );
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};
export const reviewController = {
  createReview,
  reviewAll,
  reviewById,
  reviewUpdate,
  reviewDelete,
};
