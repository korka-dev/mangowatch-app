import { apiClient } from "./client";
import { User } from "./types";

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await apiClient.post<User>("/auth/register", payload);
  return data;
}

export async function login(email: string, password: string): Promise<string> {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const { data } = await apiClient.post<{ access_token: string }>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data.access_token;
}

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
}
