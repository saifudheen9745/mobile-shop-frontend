import { Document, Types } from "mongoose";

/* -------- Line item snapshot -------- */
export interface IPurchaseProduct {
  productId: Types.ObjectId;
  name: string;
  quantity: number;
  sellingPrice: number;
  total: number;
}

/* -------- Stored purchase -------- */
export interface IPurchase {
  invoiceNumber: string;

  user: string;
  phone: string;

  products: IPurchaseProduct[];

  grandTotal: number;

  paymentMethod: "CASH" | "UPI" | "CARD";
  status: "COMPLETED" | "CANCELLED" | "REFUNDED";

  createdAt?: Date;
  updatedAt?: Date;
}

/* -------- Mongoose document -------- */
export interface IPurchaseDocument extends IPurchase, Document {}

/* -------- Input from frontend -------- */
export interface CreatePurchaseInput {
  user: string;
  phone: string;
  products: {
    productId: string;
    imei?:string;
    quantity: number;
  }[];
  paymentMethod?: "CASH" | "UPI" | "CARD";
}
