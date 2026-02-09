export interface DashboardSummaryItem {
  amount: number;
  percentage: number;
}

export interface WeeklyTrendItem {
  day: string;
  amount: number;
}

export interface DashboardOverviewResponse {
  summary: {
    today: DashboardSummaryItem;
    week: DashboardSummaryItem;
    month: DashboardSummaryItem;
    totalRevenue: number;
  };
  weeklyTrend: WeeklyTrendItem[];
  meta: {
    currency: "INR";
    generatedAt: string;
  };
}
