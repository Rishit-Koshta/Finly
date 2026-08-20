import client from "./client";

export const askFinanceAI = (userId, question) =>
  client.post("/api/ai/ask", { userId, question }).then((r) => r.data);

export const getTrendInsight = (userId, category) =>
  client.get("/api/insights/trend", { params: { userId, category } }).then((r) => r.data);

export const getPredictionInsight = (userId) =>
  client.get("/api/insights/prediction", { params: { userId } }).then((r) => r.data);

export const getBudgetSuggestion = (userId, category) =>
  client
    .get("/api/insights/budget-suggestion", { params: { userId, category } })
    .then((r) => r.data);
