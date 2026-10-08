import { NotificationItem } from "../types";
import { INITIAL_NOTIFICATIONS } from "../mockData";

let notificationsStore = [...INITIAL_NOTIFICATIONS];

export const notificationsApi = {
  async getNotifications(): Promise<NotificationItem[]> {
    return Promise.resolve([...notificationsStore]);
  },

  async markAllAsRead(): Promise<void> {
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    return Promise.resolve();
  },

  async markAsRead(id: string): Promise<void> {
    notificationsStore = notificationsStore.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return Promise.resolve();
  },

  async addNotification(item: Omit<NotificationItem, "id" | "timestamp">): Promise<NotificationItem> {
    const notif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
    };
    notificationsStore = [notif, ...notificationsStore];
    return Promise.resolve(notif);
  },
};
