import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api";
import type { IProduct, ProductPayload } from "@/app/types/product.types";

export function useFetchProducts() {
  return useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

export function useCreateProduct() {


  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    
  });
}

export function useUpdateProduct() {


  return useMutation({
    mutationFn: (data: { productId: string; payload: ProductPayload }) =>
      updateProduct(data.productId, data.payload),
    
  });
}

export function useDeleteProduct() {


  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    
  });
}
