import { NextFunction, Request, Response } from "express";

import { USERROLE } from "../../middlewere/auth";
import { CartItemService } from "./cartItem.service";
const createCartItem = async (req: Request, res: Response) => {
  try {
    const result = await CartItemService.createCartItem(req.body);
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
const getCartItem = async (req: Request, res: Response) => {
  try {
    const result = await CartItemService.getCartItem();
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
const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { cartItemId } = req.params;
    const result = await CartItemService.updateCartItem(
      cartItemId as string,
      req.body,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart update failed",
      details: error,
    });
  }
};
const deleteCartItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await CartItemService.deleteCartItemById(
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

export const cartItemController = {
  createCartItem,
  getCartItem,
  updateCartItem,
  deleteCartItemById,
};
