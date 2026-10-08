export type Priority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "pending" | "in_progress" | "completed" | "snoozed" | "cancelled";

export type EventStatus = "completed" | "current" | "upcoming" | "overdue";

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  durationMinutes?: number;
  tags?: string[];
  reminder?: string;
  repeat?: string;
  attachmentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  totalTasks: number;
  completedTasks: number;
  upcomingDeadline?: string;
  lastActivity: string;
  status: "active" | "planned" | "paused" | "completed";
  category: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  targetDate: string;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  relatedTaskIds?: string[];
  category: "engineering" | "fitness" | "learning" | "career" | "personal";
}

export interface Duty {
  id: string;
  title: string;
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly";
  recurrenceText: string; // e.g. "Every Friday", "Every Monday"
  nextOccurrence: string;
  lastCompleted?: string;
  completionStreak: number;
  history: {
    date: string;
    completed: boolean;
  }[];
  projectId?: string;
}

export interface Deadline {
  id: string;
  title: string;
  dueDate: string; // ISO string or YYYY-MM-DDTHH:mm:ss
  targetTimestamp: number; // unix ms
  projectId?: string;
  projectName?: string;
  priority: Priority;
  isOverdue: boolean;
  category: "OVERDUE" | "TODAY" | "THIS WEEK" | "UPCOMING";
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  date: string; // YYYY-MM-DD
  status: EventStatus;
  location?: string;
  projectId?: string;
  projectName?: string;
  description?: string;
  taskId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "reminder" | "deadline" | "system" | "task";
  category: "REMINDERS" | "DEADLINES" | "SYSTEM" | "ALL";
  read: boolean;
  link?: string;
}

export interface Activity {
  id: string;
  timestamp: string; // HH:mm
  date: string; // YYYY-MM-DD
  action: "Completed" | "Started" | "Rescheduled" | "Created" | "Snoozed";
  targetTitle: string;
  targetType: "task" | "project" | "duty" | "deadline" | "event";
  details?: string;
}

export interface DailyReview {
  date: string;
  completedTasks: number;
  incompleteTasks: number;
  postponedTasks: number;
  overdueTasks: number;
  wentWellNotes: string;
  remainsNotes: string;
  tomorrowNotes: string;
}

export interface WeeklyReview {
  weekRange: string;
  tasksCompleted: number;
  tasksPostponed: number;
  deadlinesMet: number;
  overdueTasks: number;
  mostActiveProjects: { name: string; taskCount: number }[];
  goalsProgress: { title: string; progress: number }[];
  upcomingCommitments: string[];
}
