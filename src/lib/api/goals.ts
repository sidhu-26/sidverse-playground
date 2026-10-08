import { apiClient } from "./client";
import { BackendGoal, BackendGoalListResponse, BackendGoalMilestone } from "../types/backend";

export interface GoalQueryParams {
  status?: string;
  search?: string;
  target_before?: string;
  target_after?: string;
  page?: number;
  page_size?: number;
}

export interface GoalCreateInput {
  title: string;
  description?: string | null;
  status?: string;
  target_date?: string | null;
  progress?: number;
}

export interface GoalUpdateInput {
  title?: string;
  description?: string | null;
  status?: string;
  target_date?: string | null;
  progress?: number;
}

export interface MilestoneCreateInput {
  title: string;
  description?: string | null;
  position?: number;
}

export interface MilestoneUpdateInput {
  title?: string;
  description?: string | null;
  position?: number;
  is_completed?: boolean;
}

export const goalsApi = {
  async getGoals(params: GoalQueryParams = {}): Promise<BackendGoalListResponse> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.target_before) query.set("target_before", params.target_before);
    if (params.target_after) query.set("target_after", params.target_after);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const qs = query.toString();
    return apiClient<BackendGoalListResponse>(`/api/goals${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  async getGoalById(id: string): Promise<BackendGoal> {
    return apiClient<BackendGoal>(`/api/goals/${id}`, {
      method: "GET",
    });
  },

  async createGoal(payload: GoalCreateInput): Promise<BackendGoal> {
    return apiClient<BackendGoal>("/api/goals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateGoal(id: string, updates: GoalUpdateInput): Promise<BackendGoal> {
    return apiClient<BackendGoal>(`/api/goals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteGoal(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/goals/${id}`, {
      method: "DELETE",
    });
  },

  // Milestones
  async listMilestones(goalId: string): Promise<BackendGoalMilestone[]> {
    return apiClient<BackendGoalMilestone[]>(`/api/goals/${goalId}/milestones`, {
      method: "GET",
    });
  },

  async createMilestone(goalId: string, payload: MilestoneCreateInput): Promise<BackendGoalMilestone> {
    return apiClient<BackendGoalMilestone>(`/api/goals/${goalId}/milestones`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateMilestone(
    goalId: string,
    milestoneId: string,
    updates: MilestoneUpdateInput
  ): Promise<BackendGoalMilestone> {
    return apiClient<BackendGoalMilestone>(`/api/goals/${goalId}/milestones/${milestoneId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteMilestone(goalId: string, milestoneId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/goals/${goalId}/milestones/${milestoneId}`, {
      method: "DELETE",
    });
  },
};
