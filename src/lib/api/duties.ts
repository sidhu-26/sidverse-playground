import { Duty } from "../types";
import { INITIAL_DUTIES } from "../mockData";

const dutiesStore = [...INITIAL_DUTIES];


export const dutiesApi = {
  async getDuties(): Promise<Duty[]> {
    return Promise.resolve([...dutiesStore]);
  },

  async toggleCompleteDuty(id: string): Promise<Duty | null> {
    const idx = dutiesStore.findIndex((d) => d.id === id);
    if (idx === -1) return Promise.resolve(null);
    const d = dutiesStore[idx];
    const todayStr = "Oct 08";
    const updated: Duty = {
      ...d,
      lastCompleted: "Today, Oct 08",
      completionStreak: d.completionStreak + 1,
      history: [{ date: todayStr, completed: true }, ...d.history.slice(0, 5)],
    };
    dutiesStore[idx] = updated;
    return Promise.resolve(updated);
  },

  async createDuty(newDuty: Omit<Duty, "id" | "completionStreak" | "history">): Promise<Duty> {
    const duty: Duty = {
      ...newDuty,
      id: `DUTY-${Math.floor(10 + Math.random() * 90)}`,
      completionStreak: 1,
      history: [{ date: "Oct 08", completed: true }],
    };
    dutiesStore.push(duty);
    return Promise.resolve(duty);
  },
};
