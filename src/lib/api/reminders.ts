import { apiClient } from "./client";
import { BackendReminder, BackendReminderListResponse } from "../types/backend";

export interface ReminderQueryParams {
  status?: string;
  task_id?: string;
  schedule_id?: string;
  duty_id?: string;
  page?: number;
  page_size?: number;
}

export interface ReminderCreateInput {
  remind_at: string;
  task_id?: string | null;
  schedule_id?: string | null;
  duty_id?: string | null;
}

export interface ReminderUpdateInput {
  remind_at?: string;
  status?: string;
}

export const remindersApi = {
  async getReminders(params: ReminderQueryParams = {}): Promise<BackendReminderListResponse> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.task_id) query.set("task_id", params.task_id);
    if (params.schedule_id) query.set("schedule_id", params.schedule_id);
    if (params.duty_id) query.set("duty_id", params.duty_id);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendReminderListResponse>(`/api/reminders${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getReminderById(id: string): Promise<BackendReminder> {
    return apiClient<BackendReminder>(`/api/reminders/${id}`, {
      method: "GET",
    });
  },

  async createReminder(payload: ReminderCreateInput): Promise<BackendReminder> {
    return apiClient<BackendReminder>("/api/reminders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateReminder(id: string, updates: ReminderUpdateInput): Promise<BackendReminder> {
    return apiClient<BackendReminder>(`/api/reminders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteReminder(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/reminders/${id}`, {
      method: "DELETE",
    });
  },
};
