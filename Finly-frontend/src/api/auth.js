import client from "./client";

export const registerUser = (payload) => client.post("/auth/register", payload).then((r) => r.data);

export const loginUser = (payload) => client.post("/auth/login", payload).then((r) => r.data);

export const logoutUser = (userId) =>
  client.post(`/auth/logout`, null, { params: { userId } }).then((r) => r.data);

export const getAllUsers = () => client.get("/api/users").then((r) => r.data);
