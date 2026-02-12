import type { Request, Response } from "express";
import { ExpenseService } from "./expense.services.js";

export class ExpenseController {
  static async createExpense(req: Request, res: Response) {
    try {
      const {
        amount,
        category,
        expenseDateTime,
        paymentMode,
      } = req.body;

      if (!amount || !category || !expenseDateTime || !paymentMode) {
        return res.status(400).json({
          message:
            "amount, category, expenseDateTime and paymentMode are required",
        });
      }

      // createdBy should come from auth middleware
      const createdBy = (req as any).user?.id;

      const expense = await ExpenseService.createExpense({
        ...req.body,
        createdBy,
      });

      return res.status(201).json(expense);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getExpenses(req: Request, res: Response) {
    try {
      const expenses = await ExpenseService.getExpenses(req.query);
      return res.json(expenses);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getExpenseById(req: Request, res: Response) {
    try {
      const expense = await ExpenseService.getExpenseById(req.params.id as string);
      return res.json(expense);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  static async updateExpense(req: Request, res: Response) {
    try {
      const expense = await ExpenseService.updateExpense(
        req.params.id as string,
        req.body
      );

      return res.json(expense);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async deleteExpense(req: Request, res: Response) {
    try {
      await ExpenseService.deleteExpense(req.params.id as string);
      return res.json({ message: "Expense deleted successfully" });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}
