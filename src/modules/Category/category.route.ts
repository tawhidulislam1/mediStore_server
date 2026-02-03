import express, { Router } from "express";
import { categoryController } from "./category.controller";
import auth, { USERROLE } from "../../middlewere/auth";
const router = express.Router();

router.post("/", auth(USERROLE.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.get(
  "/:categoryId",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  categoryController.getCategoryById,
);
router.patch(
  "/:categoryId",
  auth(USERROLE.ADMIN),
  categoryController.updateCategory,
);
router.delete(
  "/:categoryId",
  auth(USERROLE.ADMIN),
  categoryController.deleteCategory,
);

export const CategoryRouter: Router = router;
