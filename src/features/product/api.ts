import { api } from "@/lib/api";
import type { ProductPayload } from "@/app/types/product.types";

// GET all products
export function fetchProducts() {
  return api("/products", { method: "GET" });
}

// CREATE product
export function createProduct(payload: ProductPayload) {
  return api("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// UPDATE product
export function updateProduct(productId: string, payload: ProductPayload) {
  return api(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE product
export function deleteProduct(productId: string) {
  return api(`/products/${productId}`, { method: "DELETE" });
}
