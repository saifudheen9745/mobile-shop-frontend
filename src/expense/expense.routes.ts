import { Router } from "express";
import { ExpenseController } from "./expense.controllers.js";

const router = Router();

/**
 * POST /api/expenses
 */
router.post("/", ExpenseController.createExpense);

/**
 * GET /api/expenses
 */
router.get("/", ExpenseController.getExpenses);

/**
 * GET /api/expenses/:id
 */
router.get("/:id", ExpenseController.getExpenseById);

/**
 * PUT /api/expenses/:id
 */
router.put("/:id", ExpenseController.updateExpense);

/**
 * DELETE /api/expenses/:id
 */
router.delete("/:id", ExpenseController.deleteExpense);

export default router;
