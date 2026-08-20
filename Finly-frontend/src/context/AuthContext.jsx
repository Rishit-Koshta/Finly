import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, logoutUser, getAllUsers } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const loadProfile = useCallback(async (id) => {
    if (!id) return;
    setLoadingProfile(true);
    try {
      const users = await getAllUsers();
      const me = users.find((u) => u.id === id);
      if (me) setProfile(me);
    } catch {
      // profile is a nice-to-have; a failed lookup shouldn't break the app
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (userId) loadProfile(userId);
  }, [userId, loadProfile]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userId", data.userId);
    setUserId(data.userId);
    return data;
  };

  const logout = async () => {
    try {
      if (userId) await logoutUser(userId);
    } catch {
      // proceed with local logout regardless
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setUserId(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ userId, profile, loadingProfile, isAuthenticated: Boolean(userId), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
