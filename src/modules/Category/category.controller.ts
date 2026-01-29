import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import { USERROLE } from "../../middlewere/auth";

const createCategory = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        details: "Your are to able to create",
      });
    }
    const result = await categoryService.createCategory(
      req.body,
      user.id as string,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Category Created failed",
      details: error,
    });
  }
};
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategory();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Category Find failed",
      details: error,
    });
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { categoryId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const id = Number(categoryId);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const isAdmin = user?.role === USERROLE.ADMIN;
    const result = await categoryService.updateCategory(
      id,
      req.body,
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

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { categoryId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const id = Number(categoryId);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }
    const result = await categoryService.deleteCategory(id);
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "post delete failed",
      details: error,
    });
  }
};
export const categoryController = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
