"use client";
import { useState, useEffect, useRef } from "react";
import { X, Loader2, CalendarDays, AlignLeft, Flag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, Priority } from "@/types";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Task>) => Promise<void>;
  task?: Task | null;
}

const PRIORITIES: { value: Priority; label: string; color: string; bg: string }[] = [
  { value: "low", label: "Low", color: "text-accent-jade", bg: "bg-accent-jade/10 border-accent-jade/30" },
  { value: "medium", label: "Medium", color: "text-accent-gold", bg: "bg-accent-gold/10 border-accent-gold/30" },
  { value: "high", label: "High", color: "text-accent-rose", bg: "bg-accent-rose/10 border-accent-rose/30" },
];

export default function TaskModal({ open, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
      }
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [open, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSave({ title, description, priority, dueDate: dueDate || undefined });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg animate-slide-up">
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent-gold/10 border border-accent-gold/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-gold" />
              </div>
              <h2 className="font-display font-bold text-text-primary">
                {task ? "Edit Task" : "Create Task"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">
                Task Title <span className="text-accent-rose">*</span>
              </label>
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="input-field font-display font-semibold text-base"
                maxLength={200}
                required
              />
              <div className="flex justify-end">
                <span className="text-text-muted text-[10px] font-mono">{title.length}/200</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">
                <AlignLeft className="w-3 h-3" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more context (optional)..."
                rows={3}
                className="input-field resize-none leading-relaxed"
                maxLength={1000}
              />
            </div>

            {/* Priority + Due Date row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">
                  <Flag className="w-3 h-3" />
                  Priority
                </label>
                <div className="flex flex-col gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all duration-200",
                        priority === p.value
                          ? `${p.bg} ${p.color} scale-[1.02]`
                          : "border-border bg-bg-secondary text-text-secondary hover:border-border-hover hover:bg-bg-tertiary"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        p.value === "low" ? "bg-accent-jade" :
                        p.value === "medium" ? "bg-accent-gold" : "bg-accent-rose"
                      )} />
                      <span className="text-xs font-display font-semibold">{p.label}</span>
                      {priority === p.value && (
                        <span className="ml-auto text-[10px] font-mono opacity-60">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-text-secondary text-xs font-display font-semibold uppercase tracking-wider">
                  <CalendarDays className="w-3 h-3" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="input-field font-mono text-sm [color-scheme:dark]"
                />
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate("")}
                    className="text-text-tertiary text-[11px] font-body hover:text-accent-rose transition-colors"
                  >
                    Clear date
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  task ? "Save Changes" : "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
