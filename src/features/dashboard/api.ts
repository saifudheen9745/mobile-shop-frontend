import { api } from "@/lib/api";

// GET all products
export function fetchDashboardOverview() {
  return api("/dashboard/overview", { method: "GET" });
}
