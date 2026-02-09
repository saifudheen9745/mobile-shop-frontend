
import { PurchaseModel } from "../purchase/purchase.models.js";
import type {
  DashboardOverviewResponse,
  WeeklyTrendItem,
} from "./dashboard.types.js";

function percentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export class DashboardService {
  static async getOverview(): Promise<DashboardOverviewResponse> {
    const now = new Date();

    /* -------- Date boundaries -------- */
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const startOfMonth = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth(),
      1
    );

    const startOfLastMonth = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth() - 1,
      1
    );

    const endOfLastMonth = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth(),
      0,
      23, 59, 59
    );

    const filter = { status: "COMPLETED" };

    /* -------- Parallel DB calls -------- */
    const [
      today,
      yesterday,
      thisWeek,
      lastWeek,
      thisMonth,
      lastMonth,
      totalRevenue,
      weeklyTrend,
    ] = await Promise.all([
      this.sumBetween(startOfToday, now, filter),
      this.sumBetween(startOfYesterday, startOfToday, filter),

      this.sumBetween(startOfWeek, now, filter),
      this.sumBetween(startOfLastWeek, startOfWeek, filter),

      this.sumBetween(startOfMonth, now, filter),
      this.sumBetween(startOfLastMonth, endOfLastMonth, filter),

      this.sumAll(filter),
      this.weeklyTrend(startOfWeek, filter),
    ]);

    return {
      summary: {
        today: {
          amount: today,
          percentage: percentageChange(today, yesterday),
        },
        week: {
          amount: thisWeek,
          percentage: percentageChange(thisWeek, lastWeek),
        },
        month: {
          amount: thisMonth,
          percentage: percentageChange(thisMonth, lastMonth),
        },
        totalRevenue,
      },
      weeklyTrend,
      meta: {
        currency: "INR",
        generatedAt: new Date(),
      },
    };
  }

  /* -------- Helpers -------- */

  private static async sumBetween(
    start: Date,
    end: Date,
    filter: any
  ): Promise<number> {
    const res = await PurchaseModel.aggregate([
      { $match: { ...filter, createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: null, amount: { $sum: "$grandTotal" } } },
    ]);
    return res[0]?.amount || 0;
  }

  private static async sumAll(filter: any): Promise<number> {
    const res = await PurchaseModel.aggregate([
      { $match: filter },
      { $group: { _id: null, amount: { $sum: "$grandTotal" } } },
    ]);
    return res[0]?.amount || 0;
  }

  private static async weeklyTrend(
    startOfWeek: Date,
    filter: any
  ): Promise<WeeklyTrendItem[]> {
    const raw = await PurchaseModel.aggregate([
      { $match: { ...filter, createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          amount: { $sum: "$grandTotal" },
        },
      },
    ]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days.map((day, i) => {
      const found = raw.find((r) => r._id === i + 1);
      return { day, amount: found?.amount || 0 };
    });
  }
}
