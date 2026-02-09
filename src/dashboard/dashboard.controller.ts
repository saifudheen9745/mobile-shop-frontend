import type { Request, Response } from "express";
import { DashboardService } from "./dashboard.service.js";

export class DashboardController {
  static async getOverview(_req: Request, res: Response) {
    const data = await DashboardService.getOverview();
    res.json(data);
  }
}
