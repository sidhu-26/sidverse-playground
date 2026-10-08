"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Task,
  Project,
  Goal,
  Duty,
  Deadline,
  CalendarEvent,
  NotificationItem,
  Activity,
  DailyReview,
  WeeklyReview,
} from "../types";
import {
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_GOALS,
  INITIAL_DUTIES,
  INITIAL_DEADLINES,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_DAILY_REVIEW,
  INITIAL_WEEKLY_REVIEW,
} from "../mockData";
import { tasksApi } from "../api/tasks";
import { activitiesApi } from "../api/activities";

interface OSContextType {
  // Data stores
  tasks: Task[];
  projects: Project[];
  goals: Goal[];
  duties: Duty[];
  deadlines: Deadline[];
  events: CalendarEvent[];
  notifications: NotificationItem[];
  activities: Activity[];
  dailyReview: DailyReview;
  weeklyReview: WeeklyReview;

  // Task actions
  toggleTaskComplete: (taskId: string) => void;
  startTask: (taskId: string) => void;
  createTask: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  rescheduleTask: (taskId: string, newDate: string, newTime?: string) => void;

  // Other actions
  toggleDutyComplete: (dutyId: string) => void;
  createDuty: (duty: Omit<Duty, "id" | "completionStreak" | "history">) => void;
  createDeadline: (deadline: Omit<Deadline, "id">) => void;
  createEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  // UI state
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  selectedTaskForDrawer: Task | null;
  setSelectedTaskForDrawer: (task: Task | null) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
  quickAddModalType: "task" | "event" | "duty" | "deadline" | "goal" | "note" | null;
  setQuickAddModalType: (type: "task" | "event" | "duty" | "deadline" | "goal" | "note" | null) => void;

  // System time & metrics
  currentTime: string;
  currentDateFormatted: string;
  dayProgressPercent: number;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // State initialization with mock defaults
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [duties, setDuties] = useState<Duty[]>(INITIAL_DUTIES);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [dailyReview, setDailyReview] = useState<DailyReview>(INITIAL_DAILY_REVIEW);
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReview>(INITIAL_WEEKLY_REVIEW);

  // UI Shell states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<Task | null>(null);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [quickAddModalType, setQuickAddModalType] = useState<
    "task" | "event" | "duty" | "deadline" | "goal" | "note" | null
  >(null);

  // Real-time clock and progress
  const [currentTime, setCurrentTime] = useState("18:42");
  const [dayProgressPercent, setDayProgressPercent] = useState(62);
  const [currentDateFormatted, setCurrentDateFormatted] = useState("THURSDAY / OCT 08 / 2026");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Use 24h format HH:mm
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hh}:${mm}`);

      // Calculate percentage of day elapsed
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      const percent = Math.min(100, Math.round((totalMinutes / 1440) * 100));
      setDayProgressPercent(percent);

      const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const dateNum = String(now.getDate()).padStart(2, "0");
      const year = now.getFullYear();
      setCurrentDateFormatted(`${dayName} / ${monthName} ${dateNum} / ${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts (Section 47)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      // Escape always closes open modals/drawers
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setSelectedTaskForDrawer(null);
        setIsNotificationsDrawerOpen(false);
        setQuickAddModalType(null);
        return;
      }

      // Cmd/Ctrl + K opens Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // If user is typing in an input field, do not trigger single letter shortcuts
      if (isInput) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setQuickAddModalType("task");
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        setQuickAddModalType("event");
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        router.push("/today");
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        router.push("/schedule");
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        router.push("/tasks");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // Actions
  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextStatus = task.status === "completed" ? "pending" : "completed";
    const updated = await tasksApi.updateTask(taskId, { status: nextStatus });
    if (!updated) return;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));

    if (selectedTaskForDrawer?.id === taskId) {
      setSelectedTaskForDrawer(updated);
    }

    // Log Activity
    const action = nextStatus === "completed" ? "Completed" : "Rescheduled";
    const act = await activitiesApi.logActivity({
      action,
      targetTitle: task.title,
      targetType: "task",
      details: nextStatus === "completed" ? "Marked complete" : "Reopened task",
    });
    setActivities((prev) => [act, ...prev]);

    // Recalculate project completed count
    if (task.projectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== task.projectId) return p;
          const diff = nextStatus === "completed" ? 1 : -1;
          const newCompleted = Math.max(0, Math.min(p.totalTasks, p.completedTasks + diff));
          const newProgress = Math.round((newCompleted / p.totalTasks) * 100);
          return { ...p, completedTasks: newCompleted, progress: newProgress };
        })
      );
    }
  };

  const startTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updated = await tasksApi.updateTask(taskId, { status: "in_progress" });
    if (!updated) return;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    if (selectedTaskForDrawer?.id === taskId) {
      setSelectedTaskForDrawer(updated);
    }

    const act = await activitiesApi.logActivity({
      action: "Started",
      targetTitle: task.title,
      targetType: "task",
      details: "Set to In Progress",
    });
    setActivities((prev) => [act, ...prev]);
  };

  const createTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    const created = await tasksApi.createTask(data);
    setTasks((prev) => [created, ...prev]);

    const act = await activitiesApi.logActivity({
      action: "Created",
      targetTitle: created.title,
      targetType: "task",
      details: `Added to ${created.projectName || "General"}`,
    });
    setActivities((prev) => [act, ...prev]);

    // Update project total tasks
    if (created.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === created.projectId
            ? { ...p, totalTasks: p.totalTasks + 1, progress: Math.round((p.completedTasks / (p.totalTasks + 1)) * 100) }
            : p
        )
      );
    }

    return created;
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updated = await tasksApi.updateTask(taskId, updates);
    if (!updated) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    if (selectedTaskForDrawer?.id === taskId) {
      setSelectedTaskForDrawer(updated);
    }
  };

  const deleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    await tasksApi.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskForDrawer?.id === taskId) {
      setSelectedTaskForDrawer(null);
    }
    if (task) {
      const act = await activitiesApi.logActivity({
        action: "Snoozed",
        targetTitle: task.title,
        targetType: "task",
        details: "Removed from active queue",
      });
      setActivities((prev) => [act, ...prev]);
    }
  };

  const rescheduleTask = async (taskId: string, newDate: string, newTime?: string) => {
    const updated = await tasksApi.updateTask(taskId, { dueDate: newDate, dueTime: newTime });
    if (!updated) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    if (selectedTaskForDrawer?.id === taskId) {
      setSelectedTaskForDrawer(updated);
    }
    const act = await activitiesApi.logActivity({
      action: "Rescheduled",
      targetTitle: updated.title,
      targetType: "task",
      details: `Moved to ${newDate} ${newTime || ""}`,
    });
    setActivities((prev) => [act, ...prev]);
  };

  const toggleDutyComplete = (dutyId: string) => {
    setDuties((prev) =>
      prev.map((d) => {
        if (d.id !== dutyId) return d;
        const streak = d.completionStreak + 1;
        return {
          ...d,
          lastCompleted: "Today",
          completionStreak: streak,
          history: [{ date: "Oct 08", completed: true }, ...d.history],
        };
      })
    );
  };

  const createDuty = (dutyData: Omit<Duty, "id" | "completionStreak" | "history">) => {
    const newDuty: Duty = {
      ...dutyData,
      id: `DUTY-${Math.floor(10 + Math.random() * 90)}`,
      completionStreak: 1,
      history: [{ date: "Oct 08", completed: true }],
    };
    setDuties((prev) => [newDuty, ...prev]);
  };

  const createDeadline = (deadlineData: Omit<Deadline, "id">) => {
    const newDl: Deadline = {
      ...deadlineData,
      id: `DL-${Math.floor(10 + Math.random() * 90)}`,
    };
    setDeadlines((prev) => [newDl, ...prev]);
  };

  const createEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `EV-${Math.floor(10 + Math.random() * 90)}`,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)));
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const compCount = milestones.filter((m) => m.completed).length;
        const progress = Math.round((compCount / milestones.length) * 100);
        return { ...g, milestones, progress };
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <OSContext.Provider
      value={{
        tasks,
        projects,
        goals,
        duties,
        deadlines,
        events,
        notifications,
        activities,
        dailyReview,
        weeklyReview,
        toggleTaskComplete,
        startTask,
        createTask,
        updateTask,
        deleteTask,
        rescheduleTask,
        toggleDutyComplete,
        createDuty,
        createDeadline,
        createEvent,
        updateEvent,
        toggleGoalMilestone,
        markAllNotificationsRead,
        markNotificationRead,
        isSidebarCollapsed,
        toggleSidebar,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        selectedTaskForDrawer,
        setSelectedTaskForDrawer,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        quickAddModalType,
        setQuickAddModalType,
        currentTime,
        currentDateFormatted,
        dayProgressPercent,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within an OSProvider");
  return ctx;
}
