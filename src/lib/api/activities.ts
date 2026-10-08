import { Activity } from "../types";
import { INITIAL_ACTIVITIES } from "../mockData";

let activitiesStore = [...INITIAL_ACTIVITIES];

export const activitiesApi = {
  async getActivities(): Promise<Activity[]> {
    return Promise.resolve([...activitiesStore]);
  },

  async logActivity(item: Omit<Activity, "id" | "timestamp" | "date">): Promise<Activity> {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const act: Activity = {
      ...item,
      id: `act-${Date.now()}`,
      timestamp: `${hh}:${mm}`,
      date: now.toISOString().slice(0, 10),
    };
    activitiesStore = [act, ...activitiesStore];
    return Promise.resolve(act);
  },
};
