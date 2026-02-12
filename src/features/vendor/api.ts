// Vendor APIs

import { IVendor } from "@/app/types/vendor.types";
import { api } from "@/lib/api";


export function fetchVendors() {
  return api("/vendors", {
    method: "GET",
  });
}

export function createVendor(payload: IVendor) {
  return api("/vendors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateVendor(
  vendorId: string,
  payload: Partial<IVendor>
) {
  return api(`/vendors/${vendorId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteVendor(vendorId: string) {
  return api(`/vendors/${vendorId}`, {
    method: "DELETE",
  });
}
