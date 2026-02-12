import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./api";
import type { IExpense } from "@/app/types/expense.types";

/**
 * Fetch expenses
 */
export function useFetchExpenses(filters?: {
  category?: string;
  month?: string;
}) {
  return useQuery<IExpense[]>({
    queryKey: ["expenses", filters],
    queryFn: () => fetchExpenses(filters),
  });
}

/**
 * Create expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

/**
 * Update expense
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      expenseId: string;
      payload: Partial<IExpense>;
    }) => updateExpense(data.expenseId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

/**
 * Delete expense
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
