import express, { Router } from "express";
import auth, { USERROLE } from "../../middlewere/auth";
import { cartItemController } from "./cartItem.controller";

const router = express.Router();

router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartItemController.createCartItem,
);
router.get(
  "/",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartItemController.getCartItem,
);
router.patch(
  "/:cartItemId",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartItemController.updateCartItem,
);
router.delete(
  "/:id",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  cartItemController.deleteCartItemById,
);

export const CartItemRouter: Router = router;
