import { tasksApi } from "./tasks";
import { Deadline } from "../types";

export const deadlinesApi = {
  async getDeadlines(): Promise<Deadline[]> {
    const res = await tasksApi.getTasks({ page_size: 100 });
    const nowMs = Date.now();

    return res.items
      .filter((t) => t.due_at)
      .map((t) => {
        const dueMs = new Date(t.due_at!).getTime();
        const isOverdue = t.is_overdue;
        const diffHours = (dueMs - nowMs) / (1000 * 60 * 60);

        let category: "OVERDUE" | "TODAY" | "THIS WEEK" | "UPCOMING" = "UPCOMING";
        if (isOverdue) {
          category = "OVERDUE";
        } else if (diffHours <= 24 && diffHours >= 0) {
          category = "TODAY";
        } else if (diffHours <= 168) {
          category = "THIS WEEK";
        }

        return {
          id: `DL-${t.id}`,
          title: t.title,
          dueDate: t.due_at!,
          targetTimestamp: dueMs,
          projectId: t.project_id || undefined,
          priority: t.priority.toLowerCase() as "low" | "medium" | "high" | "urgent",
          isOverdue,
          category,
        };
      });
  },

  async createDeadline(newDl: Omit<Deadline, "id">): Promise<Deadline> {
    const task = await tasksApi.createTask({
      title: newDl.title,
      due_at: newDl.dueDate,
      priority: newDl.priority.toUpperCase(),
      project_id: newDl.projectId || null,
    });

    return {
      id: `DL-${task.id}`,
      title: task.title,
      dueDate: task.due_at!,
      targetTimestamp: new Date(task.due_at!).getTime(),
      projectId: task.project_id || undefined,
      priority: task.priority.toLowerCase() as "low" | "medium" | "high" | "urgent",
      isOverdue: task.is_overdue,
      category: "UPCOMING",
    };
  },
};
