import { apiClient } from "./client";
import { BackendSchedule, BackendScheduleListResponse } from "../types/backend";

export interface ScheduleQueryParams {
  start_at?: string;
  end_at?: string;
  status?: string;
  task_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface ScheduleCreateInput {
  title: string;
  description?: string | null;
  task_id?: string | null;
  start_at: string;
  end_at: string;
  status?: string;
}

export interface ScheduleUpdateInput {
  title?: string;
  description?: string | null;
  task_id?: string | null;
  start_at?: string;
  end_at?: string;
  status?: string;
}

export const schedulesApi = {
  async getSchedules(params: ScheduleQueryParams = {}): Promise<BackendScheduleListResponse> {
    const query = new URLSearchParams();
    if (params.start_at) query.set("start_at", params.start_at);
    if (params.end_at) query.set("end_at", params.end_at);
    if (params.status) query.set("status", params.status);
    if (params.task_id) query.set("task_id", params.task_id);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendScheduleListResponse>(`/api/schedules${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getScheduleById(id: string): Promise<BackendSchedule> {
    return apiClient<BackendSchedule>(`/api/schedules/${id}`, {
      method: "GET",
    });
  },

  async createSchedule(payload: ScheduleCreateInput): Promise<BackendSchedule> {
    return apiClient<BackendSchedule>("/api/schedules", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateSchedule(id: string, updates: ScheduleUpdateInput): Promise<BackendSchedule> {
    return apiClient<BackendSchedule>(`/api/schedules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteSchedule(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/schedules/${id}`, {
      method: "DELETE",
    });
  },
};
