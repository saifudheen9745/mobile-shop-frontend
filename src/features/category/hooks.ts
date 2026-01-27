import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "./api";
import { ICategory } from "@/app/types/category.types";

export function useFetchCategories() {
  const queryClient = useQueryClient();
  return useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: createCategory,
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: (data: {
      categoryId: string;
      payload: { name?: string; description?: string };
    }) => updateCategory(data.categoryId, data.payload),
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
  });
}
