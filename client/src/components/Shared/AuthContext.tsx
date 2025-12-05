import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType } from "./types";
import { checkLogin } from "../../apiHandling/authActions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    async function verify() {
      const loggedIn = await checkLogin(); // returns boolean
      setAuth(loggedIn);
    }

    verify();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}