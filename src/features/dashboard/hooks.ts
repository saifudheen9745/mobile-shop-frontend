import { useQuery } from "@tanstack/react-query";
import { fetchDashboardOverview } from "./api";
import { DashboardOverviewResponse } from "@/app/types/dashboard.types";


export function useDashboardOverview() {
  return useQuery<DashboardOverviewResponse>({
    queryKey: ["dashboard-overview"],
    queryFn: fetchDashboardOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}