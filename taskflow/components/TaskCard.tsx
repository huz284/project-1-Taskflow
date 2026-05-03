"use client";
import { useState } from "react";
import { Calendar, Trash2, Pencil, AlertCircle, Flag } from "lucide-react";
import { cn, PRIORITY_COLORS, formatDueDate, isDueSoon, isOverdue } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, status: "pending" | "completed") => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, delay = 0 }: TaskCardProps) {
  const [deleting, setDeleting] = useState(false);
  const pc = PRIORITY_COLORS[task.priority];
  const dueSoon = isDueSoon(task.dueDate);
  const overdue = isOverdue(task.dueDate) && task.status !== "completed";
  const completed = task.status === "completed";

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 150));
    onDelete(task._id);
  };

  return (
    <div
      className={cn(
        "glass-card glass-card-hover rounded-2xl p-5 animate-slide-up group relative overflow-hidden",
        completed && "opacity-60",
        deleting && "scale-95 opacity-0 transition-all duration-200"
      )}
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      {/* Priority accent line */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl",
        task.priority === "high" ? "bg-accent-rose" :
        task.priority === "medium" ? "bg-accent-gold" : "bg-accent-jade"
      )} />

      <div className="flex items-start gap-3.5 pl-1">
        {/* Checkbox */}
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(task._id, completed ? "pending" : "completed")}
            className="custom-checkbox"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-display font-semibold text-sm leading-snug",
              completed ? "line-through text-text-tertiary" : "text-text-primary"
            )}>
              {task.title}
            </h3>

            {/* Actions - shown on hover */}
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-tertiary text-text-tertiary hover:text-accent-gold hover:bg-accent-gold/10 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-tertiary text-text-tertiary hover:text-accent-rose hover:bg-accent-rose/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-text-tertiary text-xs font-body leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority badge */}
              <span className={cn(
                "inline-flex items-center gap-1.5 text-[11px] font-display font-semibold px-2.5 py-1 rounded-lg border",
                pc.bg, pc.text, pc.border
              )}>
                <Flag className={cn("w-2.5 h-2.5", pc.text)} />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              {/* Due date */}
              {task.dueDate && (
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-body px-2.5 py-1 rounded-lg",
                  overdue
                    ? "bg-accent-rose/10 text-accent-rose border border-accent-rose/20"
                    : dueSoon
                    ? "bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                    : "bg-bg-tertiary text-text-tertiary border border-border"
                )}>
                  {overdue ? <AlertCircle className="w-2.5 h-2.5" /> : <Calendar className="w-2.5 h-2.5" />}
                  {overdue ? "Overdue" : formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            {/* Status dot */}
            <div className={cn(
              "w-2 h-2 rounded-full shrink-0",
              completed ? "bg-accent-jade" : "bg-text-muted"
            )} />
          </div>
        </div>
      </div>
    </div>
  );
}
