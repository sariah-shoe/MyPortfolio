import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType } from "./types";
import { checkLogin } from "../../apiHandling/authActions";

// Context for whether or not we're authorized
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // States for current auth and whether or not we're loading it
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Every refresh we want to verify if we're logged in
  useEffect(() => {
    async function verify() {
      try {
        const loggedIn = await checkLogin();
        setAuth(loggedIn);
      } catch {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, []);

  // Return the context and its children
  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Check auth context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
