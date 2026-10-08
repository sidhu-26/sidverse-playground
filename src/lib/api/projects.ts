import { apiClient } from "./client";
import { BackendProject, BackendProjectListResponse } from "../types/backend";

export interface ProjectQueryParams {
  status?: string;
  priority?: string;
  search?: string;
  target_before?: string;
  target_after?: string;
  page?: number;
  page_size?: number;
}

export interface ProjectCreateInput {
  name: string;
  description?: string | null;
  status?: string;
  priority?: string;
  target_date?: string | null;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  target_date?: string | null;
}

export const projectsApi = {
  async getProjects(params: ProjectQueryParams = {}): Promise<BackendProjectListResponse> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.priority) query.set("priority", params.priority);
    if (params.search) query.set("search", params.search);
    if (params.target_before) query.set("target_before", params.target_before);
    if (params.target_after) query.set("target_after", params.target_after);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendProjectListResponse>(`/api/projects${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getProjectById(id: string): Promise<BackendProject> {
    return apiClient<BackendProject>(`/api/projects/${id}`, {
      method: "GET",
    });
  },

  async createProject(payload: ProjectCreateInput): Promise<BackendProject> {
    return apiClient<BackendProject>("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateProject(id: string, updates: ProjectUpdateInput): Promise<BackendProject> {
    return apiClient<BackendProject>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteProject(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/projects/${id}`, {
      method: "DELETE",
    });
  },
};
