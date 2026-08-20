import client from "./client";

export const getBudgets = (userId) =>
  client.get(`/api/budgets/user/${userId}`).then((r) => r.data);

export const getBudgetByCategory = (userId, category) =>
  client.get(`/api/budgets/user/${userId}/category/${category}`).then((r) => r.data);

export const saveBudget = (payload) => client.post("/api/budgets", payload).then((r) => r.data);

export const deleteBudget = (userId, category) =>
  client.delete(`/api/budgets/user/${userId}/category/${category}`).then((r) => r.data);
