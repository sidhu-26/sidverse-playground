"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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
  BackendTask,
  BackendProject,
  BackendGoal,
  BackendSchedule,
  BackendNotification,
  BackendActivity,
  BackendUser,
} from "../types/backend";

import { authApi, LoginPayload, RegisterPayload } from "../api/auth";
import { tasksApi } from "../api/tasks";
import { projectsApi } from "../api/projects";
import { goalsApi } from "../api/goals";
import { schedulesApi } from "../api/schedules";
import { notificationsApi } from "../api/notifications";
import { activitiesApi } from "../api/activities";
import { reviewsApi } from "../api/reviews";
import { INITIAL_DUTIES } from "../mockData";

// Adapter mappers
function backendTaskToUi(t: BackendTask, projectMap: Map<string, string>): Task {
  const dateStr = t.due_at ? t.due_at.slice(0, 10) : "";
  const timeStr = t.due_at && t.due_at.length >= 16 ? t.due_at.slice(11, 16) : undefined;

  let uiStatus: "pending" | "in_progress" | "completed" | "snoozed" | "cancelled" = "pending";
  if (t.status === "COMPLETED") uiStatus = "completed";
  else if (t.status === "IN_PROGRESS") uiStatus = "in_progress";
  else if (t.status === "CANCELLED") uiStatus = "cancelled";

  return {
    id: t.id,
    title: t.title,
    description: t.description || undefined,
    projectId: t.project_id || "",
    projectName: t.project_id ? projectMap.get(t.project_id) || "General" : undefined,
    priority: (t.priority.toLowerCase() as "low" | "medium" | "high" | "urgent") || "medium",
    status: uiStatus,
    dueDate: dateStr,
    dueTime: timeStr,
    durationMinutes: t.estimated_minutes || undefined,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

function backendProjectToUi(p: BackendProject, taskCountMap: { total: number; completed: number }): Project {
  let uiStatus: "active" | "planned" | "paused" | "completed" = "active";
  if (p.status === "COMPLETED") uiStatus = "completed";
  else if (p.status === "PAUSED") uiStatus = "paused";
  else if (p.status === "ARCHIVED") uiStatus = "paused";

  const total = taskCountMap.total || 0;
  const completed = taskCountMap.completed || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    progress,
    totalTasks: total,
    completedTasks: completed,
    upcomingDeadline: p.target_date || undefined,
    lastActivity: p.updated_at ? p.updated_at.slice(0, 10) : "Today",
    status: uiStatus,
    category: "System Core",
  };
}

function backendGoalToUi(g: BackendGoal): Goal {
  return {
    id: g.id,
    title: g.title,
    description: g.description || "",
    progress: g.progress,
    targetDate: g.target_date || "",
    milestones: (g.milestones || []).map((m) => ({
      id: m.id,
      title: m.title,
      completed: m.is_completed,
    })),
    category: "engineering",
  };
}

function backendScheduleToUi(s: BackendSchedule): CalendarEvent {
  const start = new Date(s.start_at);
  const end = new Date(s.end_at);
  const dateStr = s.start_at.slice(0, 10);
  const startTime = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
  const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;

  let status: "completed" | "current" | "upcoming" | "overdue" = "upcoming";
  const now = new Date();
  if (s.status === "COMPLETED") status = "completed";
  else if (now >= start && now <= end) status = "current";
  else if (now > end) status = "overdue";

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

function backendNotificationToUi(n: BackendNotification): NotificationItem {
  const time = n.created_at ? n.created_at.slice(11, 16) : "Just now";
  let type: "reminder" | "deadline" | "system" | "task" = "system";
  if (n.type === "REMINDER") type = "reminder";
  else if (n.type === "DEADLINE") type = "deadline";
  else if (n.type === "DUTY") type = "task";

  return {
    id: n.id,
    title: n.title,
    message: n.message,
    timestamp: time,
    type,
    category: "ALL",
    read: n.read_at !== null,
  };
}

function backendActivityToUi(a: BackendActivity): Activity {
  const date = a.created_at ? a.created_at.slice(0, 10) : "Today";
  const timestamp = a.created_at ? a.created_at.slice(11, 16) : "12:00";

  let action: "Completed" | "Started" | "Rescheduled" | "Created" | "Snoozed" = "Created";
  if (a.action.includes("COMPLETED")) action = "Completed";
  else if (a.action.includes("RESCHEDULED")) action = "Rescheduled";
  else if (a.action.includes("DELETED")) action = "Snoozed";

  return {
    id: a.id,
    timestamp,
    date,
    action,
    targetTitle: (a.metadata?.title as string) || a.entity_type,
    targetType: (a.entity_type.toLowerCase() as "task" | "project" | "duty" | "deadline" | "event") || "task",
    details: a.action,
  };
}

interface OSContextType {
  // Auth state
  currentUser: BackendUser | null;
  authState: "loading" | "authenticated" | "unauthenticated";
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;

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
  toggleTaskComplete: (taskId: string) => Promise<void>;
  startTask: (taskId: string) => Promise<void>;
  createTask: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  rescheduleTask: (taskId: string, newDate: string, newTime?: string) => Promise<void>;

  // Other actions
  toggleDutyComplete: (dutyId: string) => void;
  createDuty: (duty: Omit<Duty, "id" | "completionStreak" | "history">) => void;
  createDeadline: (deadline: Omit<Deadline, "id">) => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, "id">) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  createProject: (project: { name: string; description?: string; priority?: string; target_date?: string }) => Promise<Project>;
  createGoal: (goal: { title: string; description?: string; target_date?: string; progress?: number }) => Promise<Goal>;
  createMilestone: (goalId: string, title: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;

  // Reviews
  saveDailyReview: (notes: string, dateStr?: string) => Promise<void>;
  saveWeeklyReview: (notes: string, weekStart?: string) => Promise<void>;

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

  // Refresh
  refetchData: () => Promise<void>;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Auth State
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  // Server data stores
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [duties, setDuties] = useState<Duty[]>(INITIAL_DUTIES);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dailyReview, setDailyReview] = useState<DailyReview>({
    date: new Date().toISOString().slice(0, 10),
    completedTasks: 0,
    incompleteTasks: 0,
    postponedTasks: 0,
    overdueTasks: 0,
    wentWellNotes: "",
    remainsNotes: "",
    tomorrowNotes: "",
  });
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReview>({
    weekRange: "Current Week",
    tasksCompleted: 0,
    tasksPostponed: 0,
    deadlinesMet: 0,
    overdueTasks: 0,
    mostActiveProjects: [],
    goalsProgress: [],
    upcomingCommitments: [],
  });

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

  // Clock runner
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hh}:${mm}`);

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

  // Fetch all live server state
  const refetchData = useCallback(async () => {
    try {
      const [
        tasksRes,
        projectsRes,
        goalsRes,
        schedulesRes,
        notifsRes,
        actsRes,
        dailyRes,
        weeklyRes,
      ] = await Promise.all([
        tasksApi.getTasks({ page_size: 100 }).catch(() => ({ items: [], total: 0 })),
        projectsApi.getProjects({ page_size: 100 }).catch(() => ({ items: [], total: 0 })),
        goalsApi.getGoals({ page_size: 100 }).catch(() => ({ items: [], total: 0 })),
        schedulesApi.getSchedules({ page_size: 100 }).catch(() => ({ items: [], total: 0 })),
        notificationsApi.getNotifications({ page_size: 50 }).catch(() => ({ items: [], total: 0 })),
        activitiesApi.getActivities({ page_size: 50 }).catch(() => ({ items: [], total: 0 })),
        reviewsApi.getDailyReviews({ page_size: 1 }).catch(() => ({ items: [], total: 0 })),
        reviewsApi.getWeeklyReviews({ page_size: 1 }).catch(() => ({ items: [], total: 0 })),
      ]);

      const projectMap = new Map<string, string>();
      projectsRes.items.forEach((p) => projectMap.set(p.id, p.name));

      const taskCountMap = new Map<string, { total: number; completed: number }>();
      tasksRes.items.forEach((t) => {
        if (t.project_id) {
          const cur = taskCountMap.get(t.project_id) || { total: 0, completed: 0 };
          cur.total += 1;
          if (t.status === "COMPLETED") cur.completed += 1;
          taskCountMap.set(t.project_id, cur);
        }
      });

      const mappedTasks = tasksRes.items.map((t) => backendTaskToUi(t, projectMap));
      const mappedProjects = projectsRes.items.map((p) =>
        backendProjectToUi(p, taskCountMap.get(p.id) || { total: 0, completed: 0 })
      );
      const mappedGoals = goalsRes.items.map(backendGoalToUi);
      const mappedSchedules = schedulesRes.items.map(backendScheduleToUi);
      const mappedNotifs = notifsRes.items.map(backendNotificationToUi);
      const mappedActs = actsRes.items.map(backendActivityToUi);

      const nowMs = Date.now();
      const mappedDeadlines: Deadline[] = mappedTasks
        .filter((t) => t.dueDate)
        .map((t) => {
          const dueMs = new Date(`${t.dueDate}T${t.dueTime || "23:59"}:00`).getTime();
          const isOverdue = t.status !== "completed" && dueMs < nowMs;
          const diffHours = (dueMs - nowMs) / (1000 * 60 * 60);

          let category: "OVERDUE" | "TODAY" | "THIS WEEK" | "UPCOMING" = "UPCOMING";
          if (isOverdue) category = "OVERDUE";
          else if (diffHours <= 24 && diffHours >= 0) category = "TODAY";
          else if (diffHours <= 168) category = "THIS WEEK";

          return {
            id: `DL-${t.id}`,
            title: t.title,
            dueDate: t.dueDate,
            targetTimestamp: dueMs,
            projectId: t.projectId || undefined,
            projectName: t.projectName,
            priority: t.priority,
            isOverdue,
            category,
          };
        });

      setTasks(mappedTasks);
      setDeadlines(mappedDeadlines);
      setProjects(mappedProjects);
      setGoals(mappedGoals);
      setEvents(mappedSchedules);
      setNotifications(mappedNotifs);
      setActivities(mappedActs);


      if (dailyRes.items.length > 0) {
        const d = dailyRes.items[0];
        setDailyReview({
          date: d.review_date,
          completedTasks: d.completed_tasks,
          incompleteTasks: d.incomplete_tasks,
          overdueTasks: d.overdue_tasks,
          postponedTasks: d.postponed_tasks,
          wentWellNotes: d.notes || "",
          remainsNotes: "",
          tomorrowNotes: "",
        });
      }

      if (weeklyRes.items.length > 0) {
        const w = weeklyRes.items[0];
        setWeeklyReview({
          weekRange: `${w.week_start} → ${w.week_end}`,
          tasksCompleted: w.completed_tasks,
          tasksPostponed: w.postponed_tasks,
          deadlinesMet: 0,
          overdueTasks: w.overdue_tasks,
          mostActiveProjects: [],
          goalsProgress: mappedGoals.map((g) => ({ title: g.title, progress: g.progress })),
          upcomingCommitments: [],
        });
      }
    } catch (e) {
      console.error("Failed to fetch SID//OS server state:", e);
    }
  }, []);

  // Initial Auth Check
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const user = await authApi.getMe();
        if (isMounted) {
          setCurrentUser(user);
          setAuthState("authenticated");
          await refetchData();
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
          setAuthState("unauthenticated");
        }
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [refetchData]);

  // Auth actions
  const login = async (credentials: LoginPayload) => {
    const user = await authApi.login(credentials);
    setCurrentUser(user);
    setAuthState("authenticated");
    await refetchData();
  };

  const register = async (payload: RegisterPayload) => {
    const user = await authApi.register(payload);
    setCurrentUser(user);
    setAuthState("authenticated");
    await refetchData();
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});
    setCurrentUser(null);
    setAuthState("unauthenticated");
    setTasks([]);
    setProjects([]);
    setGoals([]);
    setEvents([]);
    setNotifications([]);
    setActivities([]);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setSelectedTaskForDrawer(null);
        setIsNotificationsDrawerOpen(false);
        setQuickAddModalType(null);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

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

  // =========================================================================
  // Task Operations
  // =========================================================================

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextStatus = task.status === "completed" ? "TODO" : "COMPLETED";
    await tasksApi.updateTask(taskId, { status: nextStatus });
    await refetchData();
  };

  const startTask = async (taskId: string) => {
    await tasksApi.updateTask(taskId, { status: "IN_PROGRESS" });
    await refetchData();
  };

  const createTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    let dueAtIso: string | null = null;
    if (data.dueDate) {
      dueAtIso = data.dueTime
        ? new Date(`${data.dueDate}T${data.dueTime}:00`).toISOString()
        : new Date(`${data.dueDate}T23:59:59`).toISOString();
    }

    const created = await tasksApi.createTask({
      title: data.title,
      description: data.description || null,
      project_id: data.projectId || null,
      priority: data.priority ? data.priority.toUpperCase() : "MEDIUM",
      due_at: dueAtIso,
      estimated_minutes: data.durationMinutes || null,
    });

    await refetchData();
    const projectMap = new Map<string, string>();
    projects.forEach((p) => projectMap.set(p.id, p.name));
    return backendTaskToUi(created, projectMap);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const payload: {
      title?: string;
      description?: string | null;
      project_id?: string | null;
      priority?: string;
      status?: string;
      due_at?: string | null;
      estimated_minutes?: number | null;
    } = {};

    if (updates.title) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description || null;
    if (updates.projectId !== undefined) payload.project_id = updates.projectId || null;
    if (updates.priority) payload.priority = updates.priority.toUpperCase();
    if (updates.status) {
      if (updates.status === "completed") payload.status = "COMPLETED";
      else if (updates.status === "in_progress") payload.status = "IN_PROGRESS";
      else if (updates.status === "pending") payload.status = "TODO";
      else if (updates.status === "cancelled") payload.status = "CANCELLED";
    }
    if (updates.dueDate) {
      payload.due_at = updates.dueTime
        ? new Date(`${updates.dueDate}T${updates.dueTime}:00`).toISOString()
        : new Date(`${updates.dueDate}T23:59:59`).toISOString();
    }
    if (updates.durationMinutes !== undefined) payload.estimated_minutes = updates.durationMinutes || null;

    await tasksApi.updateTask(taskId, payload);
    await refetchData();
  };

  const deleteTask = async (taskId: string) => {
    await tasksApi.deleteTask(taskId);
    if (selectedTaskForDrawer?.id === taskId) {
      setSelectedTaskForDrawer(null);
    }
    await refetchData();
  };

  const rescheduleTask = async (taskId: string, newDate: string, newTime?: string) => {
    const dueAtIso = newTime
      ? new Date(`${newDate}T${newTime}:00`).toISOString()
      : new Date(`${newDate}T23:59:59`).toISOString();
    await tasksApi.updateTask(taskId, { due_at: dueAtIso });
    await refetchData();
  };

  // =========================================================================
  // Project & Goal Operations
  // =========================================================================

  const createProject = async (projData: { name: string; description?: string; priority?: string; target_date?: string }): Promise<Project> => {
    const p = await projectsApi.createProject({
      name: projData.name,
      description: projData.description || null,
      priority: projData.priority ? projData.priority.toUpperCase() : "MEDIUM",
      target_date: projData.target_date || null,
    });
    await refetchData();
    return backendProjectToUi(p, { total: 0, completed: 0 });
  };

  const createGoal = async (goalData: { title: string; description?: string; target_date?: string; progress?: number }): Promise<Goal> => {
    const g = await goalsApi.createGoal({
      title: goalData.title,
      description: goalData.description || null,
      target_date: goalData.target_date || null,
      progress: goalData.progress || 0,
    });
    await refetchData();
    return backendGoalToUi(g);
  };

  const createMilestone = async (goalId: string, title: string) => {
    await goalsApi.createMilestone(goalId, { title });
    await refetchData();
  };

  const toggleGoalMilestone = async (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const ms = goal.milestones.find((m) => m.id === milestoneId);
    if (!ms) return;

    await goalsApi.updateMilestone(goalId, milestoneId, { is_completed: !ms.completed });
    await refetchData();
  };

  // =========================================================================
  // Schedules / Events Operations
  // =========================================================================

  const createEvent = async (eventData: Omit<CalendarEvent, "id">) => {
    const startIso = new Date(`${eventData.date}T${eventData.startTime}:00`).toISOString();
    const endIso = new Date(`${eventData.date}T${eventData.endTime}:00`).toISOString();

    await schedulesApi.createSchedule({
      title: eventData.title,
      description: eventData.description || null,
      task_id: eventData.taskId || null,
      start_at: startIso,
      end_at: endIso,
    });
    await refetchData();
  };

  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    const payload: { title?: string; description?: string | null; start_at?: string; end_at?: string } = {};
    if (updates.title) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description || null;
    if (updates.date && updates.startTime) {
      payload.start_at = new Date(`${updates.date}T${updates.startTime}:00`).toISOString();
    }
    if (updates.date && updates.endTime) {
      payload.end_at = new Date(`${updates.date}T${updates.endTime}:00`).toISOString();
    }

    await schedulesApi.updateSchedule(eventId, payload);
    await refetchData();
  };

  // =========================================================================
  // Deadlines & Duties
  // =========================================================================

  const createDeadline = async (deadlineData: Omit<Deadline, "id">) => {
    await tasksApi.createTask({
      title: deadlineData.title,
      due_at: deadlineData.dueDate,
      priority: deadlineData.priority.toUpperCase(),
      project_id: deadlineData.projectId || null,
    });
    await refetchData();
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

  // =========================================================================
  // Notifications
  // =========================================================================

  const markAllNotificationsRead = async () => {
    await notificationsApi.markAllAsRead();
    await refetchData();
  };

  const markNotificationRead = async (id: string) => {
    await notificationsApi.markNotificationRead(id);
    await refetchData();
  };

  // =========================================================================
  // Reviews
  // =========================================================================

  const saveDailyReview = async (notes: string, dateStr?: string) => {
    await reviewsApi.createOrUpsertDailyReview({
      review_date: dateStr || new Date().toISOString().slice(0, 10),
      notes,
    });
    await refetchData();
  };

  const saveWeeklyReview = async (notes: string, weekStart?: string) => {
    await reviewsApi.createOrUpsertWeeklyReview({
      week_start: weekStart || new Date().toISOString().slice(0, 10),
      notes,
    });
    await refetchData();
  };

  return (

    <OSContext.Provider
      value={{
        currentUser,
        authState,
        login,
        register,
        logout,
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
        createProject,
        createGoal,
        createMilestone,
        toggleDutyComplete,
        createDuty,
        createDeadline,
        createEvent,
        updateEvent,
        toggleGoalMilestone,
        markAllNotificationsRead,
        markNotificationRead,
        saveDailyReview,
        saveWeeklyReview,
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
        refetchData,
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
