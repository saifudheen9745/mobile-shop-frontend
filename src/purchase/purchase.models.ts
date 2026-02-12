import mongoose, { Schema } from "mongoose";
import type { IPurchaseDocument } from "./purchase.types.js";

const PurchaseProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    imei: {type:String, requrired:false},
    sellingPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const PurchaseSchema = new Schema<IPurchaseDocument>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },

    products: {
      type: [PurchaseProductSchema],
      required: true,
      validate: {
        validator: (v: any[]) => v.length > 0,
        message: "Purchase must contain at least one product",
      },
    },

    grandTotal: { type: Number, required: true, min: 0 },

    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "CARD"],
      default: "CASH",
    },

    status: {
      type: String,
      enum: ["COMPLETED", "CANCELLED", "REFUNDED"],
      default: "COMPLETED",
    },
  },
  { timestamps: true, versionKey: false }
);

export const PurchaseModel = mongoose.model<IPurchaseDocument>(
  "Purchase",
  PurchaseSchema
);
