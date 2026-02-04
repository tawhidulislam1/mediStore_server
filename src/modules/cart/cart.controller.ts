import { NextFunction, Request, Response } from "express";

import { USERROLE } from "../../middlewere/auth";
import { CartService } from "./cart.service";
const createCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await CartService.createCart(req.body, user?.id as string);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart created failed",
      details: error,
    });
  }
};
const getMyCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await CartService.getMyCart(user?.id as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error,
    });
  }
};
const getCartById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CartService.getCartById(id as string);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error,
    });
  }
};

const deleteCartById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await CartService.deleteCartById(
      id as string,
      user?.id as string,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error,
    });
  }
};

export const cartController = {
  createCart,
  getCartById,
  getMyCart,
  deleteCartById,
};
