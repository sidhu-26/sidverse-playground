import { apiClient } from "./client";
import { BackendTask, BackendTaskListResponse } from "../types/backend";

export interface TaskQueryParams {
  status?: string;
  priority?: string;
  project_id?: string;
  overdue?: boolean;
  due_before?: string;
  due_after?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface TaskCreateInput {
  title: string;
  description?: string | null;
  project_id?: string | null;
  priority?: string;
  due_at?: string | null;
  estimated_minutes?: number | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  project_id?: string | null;
  priority?: string;
  status?: string;
  due_at?: string | null;
  estimated_minutes?: number | null;
}

export const tasksApi = {
  async getTasks(params: TaskQueryParams = {}): Promise<BackendTaskListResponse> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.priority) query.set("priority", params.priority);
    if (params.project_id) query.set("project_id", params.project_id);
    if (params.overdue !== undefined) query.set("overdue", String(params.overdue));
    if (params.due_before) query.set("due_before", params.due_before);
    if (params.due_after) query.set("due_after", params.due_after);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendTaskListResponse>(`/api/tasks${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getTaskById(id: string): Promise<BackendTask> {
    return apiClient<BackendTask>(`/api/tasks/${id}`, {
      method: "GET",
    });
  },

  async createTask(payload: TaskCreateInput): Promise<BackendTask> {
    return apiClient<BackendTask>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateTask(id: string, updates: TaskUpdateInput): Promise<BackendTask> {
    return apiClient<BackendTask>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
