"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap, LayoutDashboard, CheckSquare, Clock, AlertCircle,
  BarChart2, Settings, LogOut, ChevronRight, Plus
} from "lucide-react";
import toast from "react-hot-toast";
import type { User, TaskStats } from "@/types";

interface SidebarProps {
  user: User | null;
  stats: TaskStats;
  activeFilter: string;
  onFilter: (f: string) => void;
  onNewTask: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { id: "all", label: "All Tasks", icon: LayoutDashboard, count: (s: TaskStats) => s.total },
  { id: "pending", label: "Pending", icon: Clock, count: (s: TaskStats) => s.pending },
  { id: "completed", label: "Completed", icon: CheckSquare, count: (s: TaskStats) => s.completed },
  { id: "high", label: "High Priority", icon: AlertCircle, count: (s: TaskStats) => s.high },
];

export default function Sidebar({ user, stats, activeFilter, onFilter, onNewTask, collapsed }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    toast.success("Signed out successfully");
    router.push("/auth/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        bg-bg-secondary border-r border-border
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-border px-4 gap-3 overflow-hidden`}>
        <div className="w-8 h-8 bg-accent-gold rounded-lg flex items-center justify-center shrink-0 shadow-gold-sm">
          <Zap className="w-4 h-4 text-bg-primary" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-lg text-text-primary whitespace-nowrap">TaskFlow</span>
        )}
      </div>

      {/* New task button */}
      <div className={`px-3 py-4 border-b border-border`}>
        <button
          onClick={onNewTask}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
            bg-accent-gold text-bg-primary font-display font-semibold text-sm
            hover:bg-accent-gold-dim transition-all duration-200
            ${collapsed ? "justify-center" : ""}
          `}
          title="New Task"
        >
          <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
          {!collapsed && <span>New Task</span>}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-text-muted text-[10px] font-display font-semibold uppercase tracking-widest px-3 mb-3">
            Views
          </p>
        )}
        {NAV_ITEMS.map(({ id, label, icon: Icon, count }) => {
          const c = count(stats);
          const active = activeFilter === id;
          return (
            <button
              key={id}
              onClick={() => onFilter(id)}
              title={collapsed ? label : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body
                transition-all duration-200 group relative
                ${collapsed ? "justify-center" : ""}
                ${active
                  ? "bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? "text-accent-gold" : ""}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {c > 0 && (
                    <span className={`
                      text-xs font-display font-semibold px-1.5 py-0.5 rounded-md min-w-[22px] text-center
                      ${active ? "bg-accent-gold/20 text-accent-gold" : "bg-bg-tertiary text-text-tertiary"}
                    `}>
                      {c}
                    </span>
                  )}
                </>
              )}
              {active && !collapsed && (
                <ChevronRight className="w-3 h-3 text-accent-gold/60" />
              )}
            </button>
          );
        })}

        {!collapsed && (
          <div className="pt-4">
            <p className="text-text-muted text-[10px] font-display font-semibold uppercase tracking-widest px-3 mb-3">
              Progress
            </p>
            <div className="mx-3 p-3 bg-bg-tertiary rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5 text-accent-jade" />
                  <span className="text-text-secondary text-xs font-body">Completion</span>
                </div>
                <span className="text-accent-jade text-xs font-display font-bold">{stats.completionRate}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-jade to-accent-jade/60 rounded-full transition-all duration-700"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <p className="text-text-muted text-xs font-body mt-2">
                {stats.completed} of {stats.total} tasks done
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3 space-y-1">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-text-tertiary hover:text-text-secondary hover:bg-bg-hover transition-all text-sm ${collapsed ? "justify-center" : ""}`}
          title="Settings"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-body">Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-text-tertiary hover:text-accent-rose hover:bg-accent-rose/10 transition-all text-sm ${collapsed ? "justify-center" : ""}`}
          title="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-body">Sign out</span>}
        </button>

        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mt-1">
            <div className="w-7 h-7 bg-accent-gold/20 border border-accent-gold/30 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-accent-gold text-xs font-display font-bold">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-xs font-display font-semibold truncate">{user.name}</p>
              <p className="text-text-muted text-[10px] font-body truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
