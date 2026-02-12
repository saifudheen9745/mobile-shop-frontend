import { Router } from "express";
import { VendorController } from "./vendor.controllers.js";

const router = Router();

router.post("/", VendorController.createVendor);
router.get("/", VendorController.getVendors);
router.get("/:id", VendorController.getVendorById);
router.put("/:id", VendorController.updateVendor);
router.delete("/:id", VendorController.deleteVendor);

export default router;
