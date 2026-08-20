import client from "./client";

export const createTransaction = (payload) =>
  client.post("/api/transactions", payload).then((r) => r.data);

export const getTransactionsByUser = (userId) =>
  client.get(`/api/transactions/user/${userId}`).then((r) => r.data);

export const getTransactionById = (id) =>
  client.get(`/api/transactions/${id}`).then((r) => r.data);

export const updateTransaction = (id, payload) =>
  client.put(`/api/transactions/${id}`, payload).then((r) => r.data);

export const deleteTransaction = (id) =>
  client.delete(`/api/transactions/${id}`).then((r) => r.data);
