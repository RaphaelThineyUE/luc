import type { AllowanceRule, Completion } from "./models/chores";
import {
  computeDailyTotals,
  computeWeeklyAllowanceTotals,
  computeWeeklyTotals,
} from "./utils/aggregation";

type ChartPoint = { x: string; y: number };
type ChartSeries = { label: string; data: ChartPoint[] };

const toSeries = (totals: Record<string, Record<string, number>>): ChartSeries[] => {
  const allKeys = new Set<string>();
  Object.values(totals).forEach((inner) => {
    Object.keys(inner).forEach((key) => allKeys.add(key));
  });

  const labels = Array.from(allKeys).sort();
  const outerKeys = Object.keys(totals).sort();

  return labels.map((label) => ({
    label,
    data: outerKeys.map((outerKey) => ({
      x: outerKey,
      y: totals[outerKey]?.[label] ?? 0,
    })),
  }));
};

export const buildDashboardChartData = (
  completions: Completion[],
  rules: AllowanceRule[],
) => {
  const dailyTotals = computeDailyTotals(completions);
  const weeklyTotals = computeWeeklyTotals(completions);
  const weeklyAllowanceTotals = computeWeeklyAllowanceTotals(completions, rules);

  return {
    dailyPerPerson: toSeries(dailyTotals.perPerson),
    dailyPerChore: toSeries(dailyTotals.perChore),
    weeklyPerPerson: toSeries(weeklyTotals.perPerson),
    weeklyPerChore: toSeries(weeklyTotals.perChore),
    weeklyAllowancePerPerson: toSeries(weeklyAllowanceTotals),
  };
};
