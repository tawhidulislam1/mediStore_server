import express, { Router } from "express";
import auth, { USERROLE } from "../../middlewere/auth";
import { cartController } from "./cart.controller";
const router = express.Router();

router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartController.createCart,
);
router.get(
  "/myCart",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartController.getMyCart,
);
router.get(
  "/:id",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartController.getCartById,
);

router.delete(
  "/:id",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartController.deleteCartById,
);

export const CartRouter: Router = router;
