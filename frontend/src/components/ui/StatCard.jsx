// src/components/ui/StatCard.jsx - Only 1 line changed
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "./cn";
import LoadingSpinner from "./LoadingSpinner";

const ACCENTS = {
  emerald: { chip: "bg-emerald-50 text-emerald-700", value: "text-slate-900" },
  amber: { chip: "bg-amber-50 text-amber-700", value: "text-slate-900" },
  rose: { chip: "bg-rose-50 text-rose-700", value: "text-slate-900" },
  sky: { chip: "bg-sky-50 text-sky-700", value: "text-slate-900" },
  slate: { chip: "bg-slate-100 text-slate-600", value: "text-slate-900" },
};

const TREND_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus };
const TREND_COLOR = {
  up: "text-emerald-600",
  down: "text-rose-600",
  flat: "text-slate-400",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "emerald",
  trend,
  loading = false,
  className = "",
}) {
  const tone = ACCENTS[accent] || ACCENTS.emerald;
  const TrendIcon = trend ? TREND_ICON[trend.direction] || Minus : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm", // Changed: rounded-lg → rounded-xl
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
          {label}
        </p>
        {Icon && (
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone.chip)}>
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <LoadingSpinner size="sm" label="" />
        ) : (
          <p className={cn("text-2xl font-black tracking-tight", tone.value)}>{value}</p>
        )}
      </div>

      {trend && !loading && (
        <div className={cn("mt-2 flex items-center gap-1 text-xs font-semibold", TREND_COLOR[trend.direction])}>
          <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{trend.value}</span>
          {trend.label && <span className="font-medium text-slate-400">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}