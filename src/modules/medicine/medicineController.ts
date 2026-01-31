import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { categoryService } from "../Category/category.service";
import { USERROLE } from "../../middlewere/auth";

const createMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user?.role !== USERROLE.ADMIN && user?.role !== USERROLE.SELLER) {
      return res.status(403).json({
        success: false,
        details: "You are not authorized to create medicine",
      });
    }
    const result = await medicineService.createMedicine(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Created failed",
      details: error,
    });
  }
};
const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const category = req.query.category as string | undefined;
    const result = await medicineService.getAllMedicine({
      search: searchString,
      category,
    });
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error,
    });
  }
};
const getMedicineById = async (req: Request, res: Response) => {
  try {
    const { medicineid } = req.params;
    if (!medicineid) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required",
      });
    }

    const result = await medicineService.getMedicineById(medicineid as string);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error,
    });
  }
};
const getMedicineBySeller = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const user = req.user;
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required",
      });
    }

    if (user?.id !== sellerId && user?.role !== USERROLE.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }
    const result = await medicineService.getMedicineBySeller(
      sellerId as string,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error,
    });
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;
    const user = req.user;

    const isAdmin = user?.role === USERROLE.ADMIN;
    console.log(isAdmin);
    if (!user?.role.includes(USERROLE.ADMIN || USERROLE.SELLER)) {
      return res.status(400).json({
        success: false,
        details: "Your are not able to create",
      });
    }
    const result = await medicineService.updateMedicine(
      medicineId as string,
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

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;
    const user = req.user;
    if (!user?.role.includes(USERROLE.ADMIN || USERROLE.SELLER)) {
      return res.status(400).json({
        success: false,
        details: "Your are not able to delete",
      });
    }

    const result = await medicineService.deleteMedicine(medicineId as string);
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
export const medicineController = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  getMedicineBySeller,
  updateMedicine,
  deleteMedicine,
};
