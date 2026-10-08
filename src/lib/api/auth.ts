import { apiClient } from "./client";
import { BackendUser } from "../types/backend";

export interface RegisterPayload {
  email: string;
  password: string;
  display_name?: string;
  timezone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<BackendUser> {
    return apiClient<BackendUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async login(payload: LoginPayload): Promise<BackendUser> {
    return apiClient<BackendUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async logout(): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  async getMe(): Promise<BackendUser> {
    return apiClient<BackendUser>("/api/auth/me", {
      method: "GET",
    });
  },
};
