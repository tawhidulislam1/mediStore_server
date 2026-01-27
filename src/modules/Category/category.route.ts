import express, { Router } from "express";
import { categoryController } from "./category.controller";
import auth, { USERROLE } from "../../middlewere/auth";
const router = express.Router();

router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  categoryController.createCategory,
);

export const CategoryRouter: Router = router;
