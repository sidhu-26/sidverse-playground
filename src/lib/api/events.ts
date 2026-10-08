import { CalendarEvent } from "../types";
import { INITIAL_EVENTS } from "../mockData";

let eventsStore = [...INITIAL_EVENTS];

export const eventsApi = {
  async getEvents(): Promise<CalendarEvent[]> {
    return Promise.resolve([...eventsStore]);
  },

  async createEvent(newEvent: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
    const ev: CalendarEvent = {
      ...newEvent,
      id: `EV-${Math.floor(10 + Math.random() * 90)}`,
    };
    eventsStore.push(ev);
    return Promise.resolve(ev);
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const idx = eventsStore.findIndex((e) => e.id === id);
    if (idx === -1) return Promise.resolve(null);
    eventsStore[idx] = { ...eventsStore[idx], ...updates };
    return Promise.resolve(eventsStore[idx]);
  },
};
