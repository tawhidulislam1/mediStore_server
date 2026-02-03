import express, { Router } from "express";
import auth, { USERROLE } from "../../middlewere/auth";
import { userController } from "./uesr.controller";
const router = express.Router();

router.get("/", auth(USERROLE.ADMIN), userController.getAllUser);
router.get(
  "/me",
  auth(USERROLE.ADMIN, USERROLE.CUSTOMER, USERROLE.SELLER),
  userController.getAlluserById,
);
router.get("/:userId", auth(USERROLE.ADMIN), userController.getAlluserById);

router.patch("/:userId", auth(USERROLE.ADMIN), userController.updateUser);

router.delete("/:userId", auth(USERROLE.ADMIN), userController.deleteUser);

export const UserRouter: Router = router;
