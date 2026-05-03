import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import type { TaskStats, Task } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDueDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d, yyyy");
}

export function isDueSoon(dateStr?: string): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  const diffMs = date.getTime() - Date.now();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 2;
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return isPast(date) && !isToday(date);
}

export function computeStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const high = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, high, completionRate };
}

export const PRIORITY_COLORS = {
  low: { bg: "bg-accent-jade/10", text: "text-accent-jade", border: "border-accent-jade/30", dot: "bg-accent-jade" },
  medium: { bg: "bg-accent-gold/10", text: "text-accent-gold", border: "border-accent-gold/30", dot: "bg-accent-gold" },
  high: { bg: "bg-accent-rose/10", text: "text-accent-rose", border: "border-accent-rose/30", dot: "bg-accent-rose" },
} as const;

export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;
