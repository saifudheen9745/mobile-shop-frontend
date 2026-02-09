import { Router } from "express";
import {
  createPurchaseController,
  listPurchases,
  getPurchase,
  downloadPurchaseBill,
} from "./purchase.controllers.js";

const router = Router();

router.post("/", createPurchaseController);
router.get("/", listPurchases);
router.get("/:id", getPurchase);
router.get("/:id/bill", downloadPurchaseBill);

export default router;
