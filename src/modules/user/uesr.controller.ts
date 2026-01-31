import { NextFunction, Request, Response } from "express";
import { USERROLE } from "../../middlewere/auth";
import { userService } from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAlluser();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "User Find failed",
      details: error,
    });
  }
};

const getAlluserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await userService.getAlluserById(userId as string);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "User Find failed",
      details: error,
    });
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }

    const isAdmin = user?.role === USERROLE.ADMIN;
    const result = await userService.updateUser(
      userId as string,
      req.body,
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const result = await userService.deleteUser(userId as string);
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "user delete failed",
      details: error,
    });
  }
};
export const userController = {
  getAllUser,
  getAlluserById,
  updateUser,
  deleteUser,
};
