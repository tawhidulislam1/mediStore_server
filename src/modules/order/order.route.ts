import express, { Router } from "express";
import { orderController } from "./order.controller";
import auth, { USERROLE } from "../../middlewere/auth";
const router = express.Router();

router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  orderController.createOrder,
);
router.get(
  "/",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  orderController.getAllOrders,
);
router.get(
  "/:orderId",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  orderController.getOrdersById,
);
router.patch(
  "/:orderId",
  auth(USERROLE.SELLER),
  orderController.updateOrderStatusBySeller,
);

export const orderRouter: Router = router;
