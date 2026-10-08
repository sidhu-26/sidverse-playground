import { apiClient } from "./client";
import { BackendActivity, BackendActivityListResponse } from "../types/backend";

export interface ActivityQueryParams {
  entity_type?: string;
  entity_id?: string;
  action?: string;
  start_at?: string;
  end_at?: string;
  page?: number;
  page_size?: number;
}

export const activitiesApi = {
  async getActivities(params: ActivityQueryParams = {}): Promise<BackendActivityListResponse> {
    const query = new URLSearchParams();
    if (params.entity_type) query.set("entity_type", params.entity_type);
    if (params.entity_id) query.set("entity_id", params.entity_id);
    if (params.action) query.set("action", params.action);
    if (params.start_at) query.set("start_at", params.start_at);
    if (params.end_at) query.set("end_at", params.end_at);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendActivityListResponse>(`/api/history${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getActivityById(id: string): Promise<BackendActivity> {
    return apiClient<BackendActivity>(`/api/history/${id}`, {
      method: "GET",
    });
  },
};
