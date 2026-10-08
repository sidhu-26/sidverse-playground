import { apiClient } from "./client";
import {
  BackendDailyReview,
  BackendDailyReviewListResponse,
  BackendWeeklyReview,
  BackendWeeklyReviewListResponse,
} from "../types/backend";

export interface DailyReviewCreateInput {
  review_date?: string;
  notes?: string;
}

export interface DailyReviewUpdateInput {
  notes?: string;
  recalculate?: boolean;
}

export interface WeeklyReviewCreateInput {
  week_start?: string;
  notes?: string;
}

export interface WeeklyReviewUpdateInput {
  notes?: string;
  recalculate?: boolean;
}

export const reviewsApi = {
  // Daily Reviews
  async getDailyReviews(params: { page?: number; page_size?: number } = {}): Promise<BackendDailyReviewListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendDailyReviewListResponse>(`/api/reviews/daily${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getDailyReviewByDate(reviewDate: string): Promise<BackendDailyReview> {
    return apiClient<BackendDailyReview>(`/api/reviews/daily/${reviewDate}`, {
      method: "GET",
    });
  },

  async createOrUpsertDailyReview(payload: DailyReviewCreateInput): Promise<BackendDailyReview> {
    return apiClient<BackendDailyReview>("/api/reviews/daily", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateDailyReview(reviewDate: string, payload: DailyReviewUpdateInput): Promise<BackendDailyReview> {
    return apiClient<BackendDailyReview>(`/api/reviews/daily/${reviewDate}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // Weekly Reviews
  async getWeeklyReviews(params: { page?: number; page_size?: number } = {}): Promise<BackendWeeklyReviewListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendWeeklyReviewListResponse>(`/api/reviews/weekly${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getWeeklyReviewByWeekStart(weekStart: string): Promise<BackendWeeklyReview> {
    return apiClient<BackendWeeklyReview>(`/api/reviews/weekly/${weekStart}`, {
      method: "GET",
    });
  },

  async createOrUpsertWeeklyReview(payload: WeeklyReviewCreateInput): Promise<BackendWeeklyReview> {
    return apiClient<BackendWeeklyReview>("/api/reviews/weekly", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateWeeklyReview(weekStart: string, payload: WeeklyReviewUpdateInput): Promise<BackendWeeklyReview> {
    return apiClient<BackendWeeklyReview>(`/api/reviews/weekly/${weekStart}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
