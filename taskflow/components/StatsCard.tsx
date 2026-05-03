"use client";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
  suffix?: string;
  delay?: number;
}

export default function StatsCard({
  label, value, icon: Icon, iconColor, iconBg, trend, trendUp, suffix, delay = 0
}: StatsCardProps) {
  return (
    <div
      className="glass-card glass-card-hover rounded-2xl p-5 animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <span className={`text-xs font-display font-semibold px-2 py-1 rounded-lg ${
            trendUp
              ? "bg-accent-jade/10 text-accent-jade"
              : "bg-accent-rose/10 text-accent-rose"
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-3xl font-bold text-text-primary">{value}</span>
          {suffix && <span className="text-text-tertiary text-sm font-body">{suffix}</span>}
        </div>
        <p className="text-text-secondary text-sm font-body mt-0.5">{label}</p>
      </div>
    </div>
  );
}
