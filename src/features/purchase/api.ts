import { CreatePurchaseInput } from "@/app/types/purchase.types";
import { api } from "@/lib/api";

/* -------- CREATE purchase -------- */
export function createPurchase(payload: CreatePurchaseInput) {
  return api("/purchase", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* -------- GET all purchases -------- */
export function fetchPurchases() {
  return api("/purchase", { method: "GET" });
}

/* -------- GET single purchase -------- */
export function fetchPurchaseById(purchaseId: string) {
  return api(`/purchase/${purchaseId}`, { method: "GET" });
}

/* -------- DOWNLOAD PDF BILL -------- */
export async function downloadPurchaseBill(purchaseId: string) {
  const res = await fetch(
    `http://localhost:5000/purchase/${purchaseId}/bill`
  );

  if (!res.ok) {
    throw new Error("Failed to download bill");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  window.open(url, "_blank");

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `invoice-${purchaseId}.pdf`;
//   a.click();

//   window.URL.revokeObjectURL(url);
}
