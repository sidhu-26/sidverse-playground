import { Deadline } from "../types";
import { INITIAL_DEADLINES } from "../mockData";

let deadlinesStore = [...INITIAL_DEADLINES];

export const deadlinesApi = {
  async getDeadlines(): Promise<Deadline[]> {
    return Promise.resolve([...deadlinesStore]);
  },

  async createDeadline(newDl: Omit<Deadline, "id">): Promise<Deadline> {
    const dl: Deadline = {
      ...newDl,
      id: `DL-${Math.floor(10 + Math.random() * 90)}`,
    };
    deadlinesStore.push(dl);
    return Promise.resolve(dl);
  },
};
