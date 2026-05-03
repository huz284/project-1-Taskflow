"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, SlidersHorizontal, CheckSquare, Clock, Zap,
  AlertCircle, PanelLeftClose, PanelLeftOpen, RefreshCw,
  LayoutGrid, List, ArrowUpDown
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/CreateTaskModal";
import { computeStats, cn } from "@/lib/utils";
import type { Task, User, FilterType } from "@/types";

type SortType = "createdAt" | "dueDate" | "priority" | "title";
type ViewMode = "grid" | "list";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortType>("createdAt");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    const userData = localStorage.getItem("taskflow_user");
    if (!token) { router.push("/auth/login"); return; }
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch {}
    }
  }, [router]);

  const getToken = () => localStorage.getItem("taskflow_token") || "";

  const fetchTasks = useCallback(async (showRefresh = false) => {
    const token = getToken();
    if (!token) return;
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`/api/tasks?sort=${sort}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { router.push("/auth/login"); return; }
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sort, router]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const stats = useMemo(() => computeStats(tasks), [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter
    if (filter === "pending") result = result.filter((t) => t.status === "pending");
    else if (filter === "completed") result = result.filter((t) => t.status === "completed");
    else if (filter === "high") result = result.filter((t) => t.priority === "high" && t.status === "pending");
    else if (filter === "medium") result = result.filter((t) => t.priority === "medium");
    else if (filter === "low") result = result.filter((t) => t.priority === "low");

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tasks, filter, search]);

  const handleToggle = async (id: string, newStatus: "pending" | "completed") => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => t._id === id ? { ...t, status: newStatus } : t));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(newStatus === "completed" ? "Task completed! 🎉" : "Task reopened");
    } catch {
      setTasks((prev) => prev.map((t) => t._id === id ? { ...t, status: newStatus === "completed" ? "pending" : "completed" } : t));
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Task deleted");
    } catch {
      fetchTasks();
      toast.error("Failed to delete task");
    }
  };

  const handleSave = async (data: Partial<Task>) => {
    const token = getToken();
    if (editingTask) {
      const res = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setTasks((prev) => prev.map((t) => t._id === editingTask._id ? { ...t, ...result.task } : t));
      toast.success("Task updated!");
    } else {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setTasks((prev) => [result.task, ...prev]);
      toast.success("Task created! 🚀");
    }
    setEditingTask(null);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const sidebarW = sidebarCollapsed ? "72px" : "256px";
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-accent-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-accent-jade/3 rounded-full blur-3xl" />
      </div>

      <Sidebar
        user={user}
        stats={stats}
        activeFilter={filter}
        onFilter={(f) => setFilter(f as FilterType)}
        onNewTask={() => { setEditingTask(null); setModalOpen(true); }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main content */}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarW, minHeight: "100vh" }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-4 px-6 h-16">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-all"
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="input-field pl-10 py-2.5 text-sm h-9"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="appearance-none bg-bg-secondary border border-border text-text-secondary text-xs font-body rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:border-border-hover cursor-pointer hover:bg-bg-tertiary transition-all h-9"
                >
                  <option value="createdAt">Latest</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">A → Z</option>
                </select>
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
                <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="flex items-center bg-bg-secondary border border-border rounded-xl p-1 gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-lg transition-all",
                    viewMode === "grid" ? "bg-accent-gold text-bg-primary" : "text-text-tertiary hover:text-text-primary"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-lg transition-all",
                    viewMode === "list" ? "bg-accent-gold text-bg-primary" : "text-text-tertiary hover:text-text-primary"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={() => fetchTasks(true)}
                disabled={refreshing}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-all"
              >
                <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="px-6 py-8 space-y-8 relative z-10">
          {/* Greeting */}
          <div className="animate-slide-up" style={{ animationFillMode: "both" }}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-text-tertiary text-sm font-body mb-1">
                  {greeting}, <span className="text-text-secondary">{user?.name?.split(" ")[0] || "there"}</span>
                </p>
                <h1 className="font-display text-3xl font-bold text-text-primary">
                  {filter === "all" ? "Your Tasks" :
                   filter === "pending" ? "Pending Tasks" :
                   filter === "completed" ? "Completed Tasks" :
                   filter === "high" ? "High Priority" : "Tasks"}
                </h1>
              </div>
              <button
                onClick={() => { setEditingTask(null); setModalOpen(true); }}
                className="btn-primary hidden sm:flex items-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Tasks" value={stats.total}
              icon={LayoutGrid} iconColor="text-accent-violet" iconBg="bg-accent-violet/10"
              delay={0.05}
            />
            <StatsCard
              label="Completed" value={stats.completed}
              icon={CheckSquare} iconColor="text-accent-jade" iconBg="bg-accent-jade/10"
              trend={stats.total > 0 ? `${stats.completionRate}%` : undefined} trendUp
              delay={0.1}
            />
            <StatsCard
              label="Pending" value={stats.pending}
              icon={Clock} iconColor="text-accent-gold" iconBg="bg-accent-gold/10"
              delay={0.15}
            />
            <StatsCard
              label="High Priority" value={stats.high}
              icon={AlertCircle} iconColor="text-accent-rose" iconBg="bg-accent-rose/10"
              delay={0.2}
            />
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.25s", animationFillMode: "both" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent-gold" />
                  <span className="font-display font-semibold text-text-primary text-sm">Overall Progress</span>
                </div>
                <span className="font-display font-bold text-accent-jade text-sm">{stats.completionRate}% complete</span>
              </div>
              <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-jade via-accent-jade to-accent-jade/60 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-text-muted text-xs font-body">{stats.completed} done</span>
                <span className="text-text-muted text-xs font-body">{stats.pending} remaining</span>
              </div>
            </div>
          )}

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-semibold text-text-primary">
                  {search ? `Results for "${search}"` : "Tasks"}
                </h2>
                <span className="text-xs font-display font-semibold bg-bg-tertiary text-text-tertiary px-2.5 py-1 rounded-lg border border-border">
                  {filteredTasks.length}
                </span>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl h-36 animate-pulse"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-bg-tertiary rounded-lg w-3/4" />
                      <div className="h-3 bg-bg-tertiary rounded-lg w-full" />
                      <div className="h-3 bg-bg-tertiary rounded-lg w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="glass-card rounded-2xl p-16 text-center animate-fade-in">
                <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="font-display font-bold text-text-primary mb-2">
                  {search ? "No tasks found" : filter === "completed" ? "Nothing completed yet" : "No tasks here"}
                </h3>
                <p className="text-text-secondary text-sm font-body mb-6 max-w-xs mx-auto">
                  {search
                    ? `No tasks match "${search}". Try a different keyword.`
                    : "Create your first task to get started on your productivity journey."}
                </p>
                {!search && (
                  <button
                    onClick={() => { setEditingTask(null); setModalOpen(true); }}
                    className="btn-primary text-sm"
                  >
                    Create First Task
                  </button>
                )}
              </div>
            ) : (
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredTasks.map((task, i) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={handleToggle}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
