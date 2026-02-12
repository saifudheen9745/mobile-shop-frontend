import { ExpenseModel } from "./expense.model.js";
import type { IExpense } from "./expense.types.js";

export class ExpenseService {
  static async createExpense(data: IExpense) {
    try {
      return await ExpenseModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async getExpenses(filters: any = {}) {
    try {
      return await ExpenseModel.find({ isActive: true, ...filters })
        .sort({ expenseDateTime: -1 });
    } catch (error) {
      throw error;
    }
  }

  static async getExpenseById(id: string) {
    try {
      const expense = await ExpenseModel.findById(id);
      if (!expense) {
        throw new Error("Expense not found");
      }
      return expense;
    } catch (error) {
      throw error;
    }
  }

  static async updateExpense(id: string, data: Partial<IExpense>) {
    try {
      const expense = await ExpenseModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!expense) {
        throw new Error("Expense not found");
      }

      return expense;
    } catch (error) {
      throw error;
    }
  }

  static async deleteExpense(id: string) {
    try {
      const expense = await ExpenseModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!expense) {
        throw new Error("Expense not found");
      }

      return expense;
    } catch (error) {
      throw error;
    }
  }
}
