import { VendorModel } from "./vendor.model.js";
import type { IVendor } from "./vendor.types.js";

export class VendorService {
  static async createVendor(data: IVendor) {
    try {
      const exists = await VendorModel.exists({ phone: data.phone });
      if (exists) {
        throw new Error("Vendor with this phone already exists");
      }

      return await VendorModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async getVendors() {
    try {
      return await VendorModel.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  static async getVendorById(id: string) {
    try {
      const vendor = await VendorModel.findById(id);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      return vendor;
    } catch (error) {
      throw error;
    }
  }

  static async updateVendor(id: string, data: Partial<IVendor>) {
    try {
      const vendor = await VendorModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      return vendor;
    } catch (error) {
      throw error;
    }
  }

  static async deleteVendor(id: string) {
    try {
      const vendor = await VendorModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      return vendor;
    } catch (error) {
      throw error;
    }
  }
}
