import type { Request, Response } from "express";
import { VendorService } from "./vendor.services.js";

export class VendorController {
  static async createVendor(req: Request, res: Response) {
    try {
      const { name, phone, address } = req.body;

      if (!name || !phone || !address) {
        return res.status(400).json({
          message: "Name, phone and address are required",
        });
      }

      const vendor = await VendorService.createVendor({
        name,
        phone,
        address,
      });

      return res.status(201).json(vendor);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getVendors(req: Request, res: Response) {
    try {
      const vendors = await VendorService.getVendors();
      return res.json(vendors);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getVendorById(req: Request, res: Response) {
    try {
      const vendor = await VendorService.getVendorById(req.params.id as string);
      return res.json({ data: vendor });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  static async updateVendor(req: Request, res: Response) {
    try {
      const vendor = await VendorService.updateVendor(
        req.params.id as string,
        req.body
      );

      return res.json({
        message: "Vendor updated successfully",
        data: vendor,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async deleteVendor(req: Request, res: Response) {
    try {
      await VendorService.deleteVendor(req.params.id as string);

      return res.json({
        message: "Vendor deleted successfully",
      });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}
