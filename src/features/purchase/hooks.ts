import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPurchase,
  fetchPurchases,
  fetchPurchaseById,
  downloadPurchaseBill,
} from "./api";
import { CreatePurchaseInput, IPurchase } from "@/app/types/purchase.types";


/* -------- GET all purchases -------- */
export function useFetchPurchases() {
  return useQuery<IPurchase[]>({
    queryKey: ["purchases"],
    queryFn: fetchPurchases,
  });
}

/* -------- GET single purchase -------- */
export function useFetchPurchaseById(purchaseId: string) {
  return useQuery<IPurchase>({
    queryKey: ["purchases", purchaseId],
    queryFn: () => fetchPurchaseById(purchaseId),
    enabled: !!purchaseId,
  });
}

/* -------- CREATE purchase -------- */
export function useCreatePurchase() {
  return useMutation({
    mutationFn: (payload: CreatePurchaseInput) =>
      createPurchase(payload),
  });
}

/* -------- DOWNLOAD BILL -------- */
export function useDownloadPurchaseBill() {
  return useMutation({
    mutationFn: (purchaseId: string) =>
      downloadPurchaseBill(purchaseId),
  });
}
