// Expense APIs

import { api } from "@/lib/api";
import type { IExpense } from "@/app/types/expense.types";

/**
 * Fetch all expenses
 */
export function fetchExpenses(params?: {
  category?: string;
  month?: string;
}) {
  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";

  return api(`/expenses${query}`, {
    method: "GET",
  });
}

/**
 * Create expense
 */
export function createExpense(payload: IExpense) {
  return api("/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update expense
 */
export function updateExpense(
  expenseId: string,
  payload: Partial<IExpense>
) {
  return api(`/expenses/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete expense (soft delete)
 */
export function deleteExpense(expenseId: string) {
  return api(`/expenses/${expenseId}`, {
    method: "DELETE",
  });
}
