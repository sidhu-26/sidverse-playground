import { apiClient } from "./client";
import { BackendNotification, BackendNotificationListResponse } from "../types/backend";

export interface NotificationQueryParams {
  unread_only?: boolean;
  type?: string;
  page?: number;
  page_size?: number;
}

export const notificationsApi = {
  async getNotifications(params: NotificationQueryParams = {}): Promise<BackendNotificationListResponse> {
    const query = new URLSearchParams();
    if (params.unread_only !== undefined) query.set("unread_only", String(params.unread_only));
    if (params.type) query.set("type", params.type);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendNotificationListResponse>(`/api/notifications${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getNotificationById(id: string): Promise<BackendNotification> {
    return apiClient<BackendNotification>(`/api/notifications/${id}`, {
      method: "GET",
    });
  },

  async markNotificationRead(id: string): Promise<BackendNotification> {
    return apiClient<BackendNotification>(`/api/notifications/${id}/read`, {
      method: "POST",
    });
  },

  async markAllAsRead(): Promise<{ message: string; marked_read_count: number }> {
    return apiClient<{ message: string; marked_read_count: number }>("/api/notifications/read-all", {
      method: "POST",
    });
  },
};
