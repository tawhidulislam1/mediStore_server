import express, { Router } from "express";
import { reviewController } from "./review.controller";
import auth, { USERROLE } from "../../middlewere/auth";
const router = express.Router();

router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  reviewController.createReview,
);
router.get("/", reviewController.reviewAll);
router.get("/:id", reviewController.reviewById);
router.patch(
  "/:id",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  reviewController.reviewUpdate,
);
router.delete(
  "/:id",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  reviewController.reviewDelete,
);
export const ReviewRouter: Router = router;
