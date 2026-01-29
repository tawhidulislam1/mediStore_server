import express, { Router } from "express";

import auth, { USERROLE } from "../../middlewere/auth";
import { medicineController } from "./medicineController";
const router = express.Router();

router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.SELLER),
  medicineController.createMedicine,
);
router.get("/", medicineController.getAllMedicine);
router.get("/:medicineid", medicineController.getMedicineById);
router.patch(
  "/:medicineId",
  auth(USERROLE.ADMIN, USERROLE.SELLER),
  medicineController.updateMedicine,
);
router.delete(
  "/:medicineId",
  auth(USERROLE.ADMIN, USERROLE.SELLER),
  medicineController.deleteMedicine,
);

export const MedicinesRouter: Router = router;
