/* -------- Purchase line item (UI) -------- */
export interface IPurchaseProduct {
  productId: string;        // ObjectId as string
  name: string;
  quantity: number;
  sellingPrice: number;
  total: number;
}

/* -------- Purchase (API response) -------- */
export interface IPurchase {
  _id: string;
  invoiceNumber: string;
  user: string;
  phone: string;
  products: IPurchaseProduct[];
  grandTotal: number;
  paymentMethod: "CASH" | "UPI" | "CARD";
  status: "COMPLETED" | "CANCELLED" | "REFUNDED";
  createdAt: string;        // ISO string
  updatedAt?: string;
}

/* -------- Payload to create purchase -------- */
export interface CreatePurchaseInput {
  user: string;
  phone: string;
  products: {
    productId: string;
    quantity: number;
    imei?:string
  }[];
  paymentMethod?: "CASH" | "UPI" | "CARD";
}
