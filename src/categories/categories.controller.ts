import type { Request, Response } from "express";
import { categoryService } from "./categories.service.js";

export const categoriesController = {
  
  getAllCategories: async (req: Request, res: Response) => {
    try {
      const categories = await categoryService.getAll();
      return res.json(categories);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Failed to fetch categories" });
    }
  },

  createCategory: async (req: Request, res: Response) => {
    try {
      const created = await categoryService.create(req.body);
      return res.status(201).json(created);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Failed to create category" });
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await categoryService.update(id as string, req.body);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Failed to update category" });
    }
  },

  deleteCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await categoryService.remove(id as string);
      return res.json({ message: "Category deleted", category: deleted });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Failed to delete category" });
    }
  },
};
