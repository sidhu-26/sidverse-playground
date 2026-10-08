import { schedulesApi } from "./schedules";
import { CalendarEvent } from "../types";
import { BackendSchedule } from "../types/backend";

function toCalendarEvent(s: BackendSchedule): CalendarEvent {
  const start = new Date(s.start_at);
  const end = new Date(s.end_at);
  const dateStr = s.start_at.slice(0, 10);
  const startTime = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
  const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;

  let status: "completed" | "current" | "upcoming" | "overdue" = "upcoming";
  const now = new Date();
  if (s.status === "COMPLETED") {
    status = "completed";
  } else if (now >= start && now <= end) {
    status = "current";
  } else if (now > end) {
    status = "overdue";
  }

  return {
    id: s.id,
    title: s.title,
    description: s.description || undefined,
    taskId: s.task_id || undefined,
    startTime,
    endTime,
    date: dateStr,
    status,
  };
}

export const eventsApi = {
  async getEvents(): Promise<CalendarEvent[]> {
    const res = await schedulesApi.getSchedules({ page_size: 100 });
    return res.items.map(toCalendarEvent);
  },

  async createEvent(newEvent: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
    const startIso = new Date(`${newEvent.date}T${newEvent.startTime}:00`).toISOString();
    const endIso = new Date(`${newEvent.date}T${newEvent.endTime}:00`).toISOString();

    const created = await schedulesApi.createSchedule({
      title: newEvent.title,
      description: newEvent.description || null,
      task_id: newEvent.taskId || null,
      start_at: startIso,
      end_at: endIso,
    });

    return toCalendarEvent(created);
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const payload: { title?: string; description?: string | null; start_at?: string; end_at?: string } = {};
    if (updates.title) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description || null;
    if (updates.date && updates.startTime) {
      payload.start_at = new Date(`${updates.date}T${updates.startTime}:00`).toISOString();
    }
    if (updates.date && updates.endTime) {
      payload.end_at = new Date(`${updates.date}T${updates.endTime}:00`).toISOString();
    }

    const updated = await schedulesApi.updateSchedule(id, payload);
    return toCalendarEvent(updated);
  },
};
