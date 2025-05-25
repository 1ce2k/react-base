"use client";

// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAuthHandlers } from "@/services/apiClient";

type AuthData = {
  jwt: string | null;
  refreshToken: string | null;
};

type AuthContextType = {
  auth: AuthData
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstname: string
    lastname: string
  }) => Promise<void>
  logout: () => void
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_JWT_KEY = "jwt";
const LOCAL_STORAGE_REFRESH_KEY = "refreshToken";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const [auth, setAuth] = useState<AuthData>({
  // jwt: localStorage.getItem(LOCAL_STORAGE_JWT_KEY),
  // refreshToken: localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY), })

  const [auth, setAuth] = useState<AuthData>({
    jwt: null,
    refreshToken: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem(LOCAL_STORAGE_JWT_KEY);
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);
    if (jwt && refreshToken) {
      setAuth({ jwt, refreshToken });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth.jwt && auth.refreshToken) {
      localStorage.setItem(LOCAL_STORAGE_JWT_KEY, auth.jwt);
      localStorage.setItem(LOCAL_STORAGE_REFRESH_KEY, auth.refreshToken);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_JWT_KEY);
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_KEY);
    }
  }, [auth]);

  // Setup API token getter & refresh handler
  useEffect(() => {
    setAuthHandlers({
      getJwt: () => auth.jwt,
      refresh: async () => {
        if (!auth.refreshToken) throw new Error("No refresh token");
        const res = await api.post("/account/refresh-token", {
          refreshToken: auth.refreshToken,
        });
        setAuth({ jwt: res.data.jwt, refreshToken: res.data.refreshToken });
      },
    });
    setLoading(false);
  }, [auth.jwt, auth.refreshToken]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/account/login", { email, password });
    setAuth({ jwt: res.data.jwt, refreshToken: res.data.refreshToken });
  };

  const register = async (data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }) => {
    const res = await api.post("/account/register", data);
    setAuth({ jwt: res.data.jwt, refreshToken: res.data.refreshToken });
  };

  const logout = async () => {
    await api.post("/account/logout", { refreshToken: auth.refreshToken });
    setAuth({ jwt: null, refreshToken: null });
  };

  const refresh = useCallback(async () => {
    if (!auth.refreshToken) throw new Error("No refresh token available");
    const res = await api.post("/account/renewRefreshToken", {
      jwt: auth.jwt,
      refreshToken: auth.refreshToken,
    });
    setAuth({ jwt: res.data.jwt, refreshToken: res.data.refreshToken });
  }, [auth.jwt, auth.refreshToken]);

  useEffect(() => {
    setAuthHandlers({
      getJwt: () => auth.jwt,
      refresh,
    });
  }, [auth.jwt, refresh]);

  return (
    <AuthContext.Provider value={{ auth, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
