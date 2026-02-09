import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";

const router = Router();

router.get("/overview", DashboardController.getOverview);

export default router;
