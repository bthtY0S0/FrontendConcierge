// ✅ AuthContext.js updated with web-compatible storage fallback
import React, { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axiosClient from "../utils/axiosClient";
import { getItem, setItem, deleteItem } from "../utils/storage"; // Unified storage wrapper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load tokens on mount
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedToken = await getItem("token");
        const storedRefresh = await getItem("refreshToken");

        if (storedToken && storedRefresh) {
          setAuthToken(storedToken);
          setRefreshToken(storedRefresh);

          const decoded = jwtDecode(storedToken);
          setUser(decoded);
          console.log("🔄 Restored session from storage");
        }
      } catch (err) {
        console.error("Error loading tokens:", err);
      }
    };
    loadTokens();
  }, []);

  // Login function
  const login = async (token, refreshToken) => {
    try {
      setAuthToken(token);
      setRefreshToken(refreshToken);

      await setItem("token", token);
      await setItem("refreshToken", refreshToken);

      const decoded = jwtDecode(token);
      setUser(decoded);

      console.log("✅ Token after login:", token);
      console.log("🧬 Decoded user:", decoded);
    } catch (err) {
      console.error("Login error in context:", err);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      await deleteItem("token");
      await deleteItem("refreshToken");
      setAuthToken(null);
      setRefreshToken(null);
      setUser(null);
      console.log("🔓 Tokens removed from storage");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Token refresh logic (if needed for silent re-auth)
  const refreshAuthToken = async () => {
    try {
      if (!refreshToken) throw new Error("No refresh token");
      const res = await axiosClient.post("/auth/refresh", { refreshToken });
      const newToken = res.data.token;

      setAuthToken(newToken);
      await setItem("token", newToken);

      const decoded = jwtDecode(newToken);
      setUser(decoded);

      console.log("🔁 Token refreshed successfully");
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, refreshToken, user, login, logout, refreshAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
