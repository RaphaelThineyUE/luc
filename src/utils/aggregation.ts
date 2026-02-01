import type { AllowanceRule, Completion } from "../models/chores";

type TotalsByKey = Record<string, Record<string, number>>;

const asDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }
  return date;
};

const toDateKey = (value: string) => {
  const date = asDate(value);
  return date.toISOString().slice(0, 10);
};

const toWeekKey = (value: string) => {
  const date = asDate(value);
  const day = date.getUTCDay();
  const diff = (day + 6) % 7;
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - diff);
  return monday.toISOString().slice(0, 10);
};

const addToTotals = (totals: TotalsByKey, outerKey: string, innerKey: string, amount: number) => {
  if (!totals[outerKey]) {
    totals[outerKey] = {};
  }
  totals[outerKey][innerKey] = (totals[outerKey][innerKey] ?? 0) + amount;
};

const completionCount = (completion: Completion) => completion.count ?? 1;

export type DailyTotals = {
  perPerson: TotalsByKey;
  perChore: TotalsByKey;
};

export type WeeklyTotals = {
  perPerson: TotalsByKey;
  perChore: TotalsByKey;
};

export type WeeklyAllowanceTotals = Record<string, Record<string, number>>;

export const computeDailyTotals = (completions: Completion[]): DailyTotals => {
  const perPerson: TotalsByKey = {};
  const perChore: TotalsByKey = {};

  completions.forEach((completion) => {
    const dateKey = toDateKey(completion.completedAt);
    const count = completionCount(completion);
    addToTotals(perPerson, dateKey, completion.personId, count);
    addToTotals(perChore, dateKey, completion.choreId, count);
  });

  return { perPerson, perChore };
};

export const computeWeeklyTotals = (completions: Completion[]): WeeklyTotals => {
  const perPerson: TotalsByKey = {};
  const perChore: TotalsByKey = {};

  completions.forEach((completion) => {
    const weekKey = toWeekKey(completion.completedAt);
    const count = completionCount(completion);
    addToTotals(perPerson, weekKey, completion.personId, count);
    addToTotals(perChore, weekKey, completion.choreId, count);
  });

  return { perPerson, perChore };
};

export const computeWeeklyAllowanceTotals = (
  completions: Completion[],
  rules: AllowanceRule[],
): WeeklyAllowanceTotals => {
  const rateByChore = new Map(rules.map((rule) => [rule.choreId, rule.rate]));
  const totals: WeeklyAllowanceTotals = {};

  completions.forEach((completion) => {
    const rate = rateByChore.get(completion.choreId);
    if (rate === undefined) {
      return;
    }
    const weekKey = toWeekKey(completion.completedAt);
    const amount = completionCount(completion) * rate;
    addToTotals(totals, weekKey, completion.personId, amount);
  });

  return totals;
};
