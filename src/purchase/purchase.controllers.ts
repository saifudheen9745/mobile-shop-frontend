import type { Request, Response } from "express";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
} from "./purchase.services.js";
import { generatePurchaseBillPDF } from "./purchase.bill.service.js";

export const createPurchaseController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(req.body);
    
    const purchase = await createPurchase(req.body);
    res.status(201).json(purchase);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const listPurchases = async (_req: Request, res: Response) => {
  const purchases = await getAllPurchases();
  res.json(purchases);
};

export const getPurchase = async (req: Request, res: Response) => {
  try {
    const purchase = await getPurchaseById(req.params.id as string);
    res.json(purchase);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/* -------- PDF DOWNLOAD -------- */
export const downloadPurchaseBill = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(req.params.id)
    const purchase = await getPurchaseById(req.params.id as string);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${purchase.invoiceNumber}.pdf`
    );

    const doc = generatePurchaseBillPDF(purchase as any);
    doc.pipe(res);
    doc.end();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
