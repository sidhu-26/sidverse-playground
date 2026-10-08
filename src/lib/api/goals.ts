import { Goal } from "../types";
import { INITIAL_GOALS } from "../mockData";

let goalsStore = [...INITIAL_GOALS];

export const goalsApi = {
  async getGoals(): Promise<Goal[]> {
    return Promise.resolve([...goalsStore]);
  },

  async getGoalById(id: string): Promise<Goal | null> {
    const goal = goalsStore.find((g) => g.id === id);
    return Promise.resolve(goal || null);
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
    const idx = goalsStore.findIndex((g) => g.id === id);
    if (idx === -1) return Promise.resolve(null);
    goalsStore[idx] = { ...goalsStore[idx], ...updates };
    return Promise.resolve(goalsStore[idx]);
  },

  async createGoal(newGoal: Omit<Goal, "id">): Promise<Goal> {
    const g: Goal = {
      ...newGoal,
      id: `GOAL-${Math.floor(10 + Math.random() * 90)}`,
    };
    goalsStore.push(g);
    return Promise.resolve(g);
  },
};
