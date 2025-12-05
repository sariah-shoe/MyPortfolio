// src/apiHandling/logInActions.ts
import { fetchJson, loginRequest } from "./http";

export type LoginResponse = {
  ok: boolean;
  role: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string): Promise<LoginResponse> {
  return loginRequest(`${apiUrl}api/auth/login`, email, password);
}

export async function logout() {
  return fetchJson(`${apiUrl}api/auth/logout`, { method: "POST", credentials: "include" });
}

export async function checkLogin(): Promise<boolean> {
  try {
    const data = await fetchJson(`${apiUrl}api/auth/me`, {
      method: "GET",
      credentials: "include"
    });

    return data?.authenticated === true;
  } catch {
    return false;
  }
}
