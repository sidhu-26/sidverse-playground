import { Task } from "../types";
import { INITIAL_TASKS } from "../mockData";

let tasksStore = [...INITIAL_TASKS];

export const tasksApi = {
  async getTasks(): Promise<Task[]> {
    return Promise.resolve([...tasksStore]);
  },

  async getTaskById(id: string): Promise<Task | null> {
    const task = tasksStore.find((t) => t.id === id);
    return Promise.resolve(task || null);
  },

  async createTask(newTask: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    const task: Task = {
      ...newTask,
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasksStore = [task, ...tasksStore];
    return Promise.resolve(task);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const index = tasksStore.findIndex((t) => t.id === id);
    if (index === -1) return Promise.resolve(null);
    const updated: Task = {
      ...tasksStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    tasksStore[index] = updated;
    return Promise.resolve(updated);
  },

  async deleteTask(id: string): Promise<boolean> {
    const prevLen = tasksStore.length;
    tasksStore = tasksStore.filter((t) => t.id !== id);
    return Promise.resolve(tasksStore.length < prevLen);
  },
};
