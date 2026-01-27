import type { Request, Response } from "express";
import { productService } from "./product.service.js";


export const productController = {
  create: async (req:Request, res:Response) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  getAll: async (req:Request, res:Response) => {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req:Request, res:Response) => {
    try {
      const product = await productService.update(req.params.id as string, req.body);
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  remove: async (req:Request, res:Response) => {
    try {
      const product = await productService.remove(req.params.id as string);
      res.json({ message: "Product deleted" , product});
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  },
};
