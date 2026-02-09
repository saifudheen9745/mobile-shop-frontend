import mongoose from "mongoose";
import type {
  CreatePurchaseInput,
  IPurchaseProduct,
} from "./purchase.types.js";
import productModel from "../products/product.model.js";
import { PurchaseModel } from "./purchase.models.js";
import { generateInvoiceNumber } from "./invoice.utils.js";


export const createPurchase = async (
  payload: CreatePurchaseInput
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!payload) throw new Error("Payload is missing");

    const { user, phone, products, paymentMethod } = payload;

    if (!user || !phone) {
      throw new Error("User and phone are required");
    }

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Products array is empty");
    }

    let grandTotal = 0;
    const purchaseProducts: IPurchaseProduct[] = [];

    for (const item of products) {
      if (
        !item.productId ||
        !mongoose.Types.ObjectId.isValid(item.productId)
      ) {
        throw new Error("Invalid product id");
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const product = await productModel
        .findById(item.productId)
        .session(session);

      if (!product) throw new Error("Product not found");
      if (product.quantity < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);

      const total = product.sellingPrice * item.quantity;
      grandTotal += total;

      purchaseProducts.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        sellingPrice: product.sellingPrice,
        total,
      });
    }

    const purchase = await PurchaseModel.create(
      [
        {
          invoiceNumber: generateInvoiceNumber(),
          user,
          phone,
          products: purchaseProducts,
          grandTotal,
          paymentMethod: paymentMethod || "CASH",
          status: "COMPLETED",
        },
      ],
      { session }
    );

    for (const item of products) {
      await productModel.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return purchase[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Purchase failed");
  }
};

export const getAllPurchases = async () => {
  return PurchaseModel.find().sort({ createdAt: -1 }).lean();
};

export const getPurchaseById = async (purchaseId: string) => {
  if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
    throw new Error("Invalid purchase id");
  }

  const purchase = await PurchaseModel.findById(purchaseId).lean();
  if (!purchase) throw new Error("Purchase not found");

  return purchase;
};
