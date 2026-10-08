export interface BackendUser {
  id: string;
  email: string;
  display_name: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BackendTaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type BackendTaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface BackendTask {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: BackendTaskStatus;
  priority: BackendTaskPriority;
  due_at: string | null;
  estimated_minutes: number | null;
  completed_at: string | null;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendTaskListResponse {
  items: BackendTask[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}


export type BackendScheduleStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface BackendSchedule {
  id: string;
  user_id: string;
  task_id: string | null;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  status: BackendScheduleStatus;
  created_at: string;
  updated_at: string;
}

export interface BackendScheduleListResponse {
  items: BackendSchedule[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type BackendReminderStatus = "PENDING" | "TRIGGERED" | "DISMISSED" | "CANCELLED";

export interface BackendReminder {
  id: string;
  user_id: string;
  task_id: string | null;
  schedule_id: string | null;
  duty_id: string | null;
  remind_at: string;
  status: BackendReminderStatus;
  created_at: string;
  updated_at: string;
}

export interface BackendReminderListResponse {
  items: BackendReminder[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type BackendNotificationType = "REMINDER" | "DEADLINE" | "DUTY" | "SYSTEM";

export interface BackendNotification {
  id: string;
  user_id: string;
  type: BackendNotificationType;
  title: string;
  message: string;
  scheduled_for: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
}

export interface BackendNotificationListResponse {
  items: BackendNotification[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  unread_count: number;
}

export type BackendProjectStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
export type BackendProjectPriority = "LOW" | "MEDIUM" | "HIGH";

export interface BackendProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: BackendProjectStatus;
  priority: BackendProjectPriority;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendProjectListResponse {
  items: BackendProject[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type BackendGoalStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export interface BackendGoalMilestone {
  id: string;
  goal_id: string;
  title: string;
  description: string | null;
  position: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendGoal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: BackendGoalStatus;
  target_date: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
  milestones: BackendGoalMilestone[];
}

export interface BackendGoalListResponse {
  items: BackendGoal[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BackendActivity {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface BackendActivityListResponse {
  items: BackendActivity[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BackendDailyReview {
  id: string;
  user_id: string;
  review_date: string;
  completed_tasks: number;
  incomplete_tasks: number;
  overdue_tasks: number;
  postponed_tasks: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendDailyReviewListResponse {
  items: BackendDailyReview[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BackendWeeklyReview {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  completed_tasks: number;
  incomplete_tasks: number;
  overdue_tasks: number;
  postponed_tasks: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendWeeklyReviewListResponse {
  items: BackendWeeklyReview[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
