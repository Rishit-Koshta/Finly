import client from "./client";

export const getMonthlySummary = (userId, year, month) =>
  client
    .get("/api/analytics/monthly-summary", { params: { userId, year, month } })
    .then((r) => r.data);

export const getCategoryExpense = (userId, year, month) =>
  client
    .get("/api/analytics/category-expense", { params: { userId, year, month } })
    .then((r) => r.data);

export const getDailyExpenseTrend = (userId, year, month) =>
  client
    .get("/api/analytics/daily-expense-trend", { params: { userId, year, month } })
    .then((r) => r.data);
