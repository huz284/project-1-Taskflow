export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";
export type FilterType = "all" | "pending" | "completed" | "high" | "medium" | "low";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  high: number;
  completionRate: number;
}
