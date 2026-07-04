// src/components/ui/PageHero.jsx
import React from "react";
import { cn } from "./cn";

/**
 * PageHero - Reusable hero header for all pages
 * 
 * Props:
 * - eyebrow: Date or small text above title
 * - title: Main page heading
 * - subtitle: Description text below title
 * - stats: Array of { label, value, highlight? } for quick stats
 * - actions: Right-aligned action buttons (e.g., "New Order")
 * - variant: Gradient variant (emerald, blue, slate)
 */
const VARIANTS = {
  emerald: "from-emerald-600 via-emerald-700 to-teal-700",
  blue: "from-blue-600 via-blue-700 to-indigo-700",
  slate: "from-slate-700 via-slate-800 to-slate-900",
};

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  stats,
  actions,
  variant = "emerald",
  className = "",
}) {
  const gradient = VARIANTS[variant] || VARIANTS.emerald;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 sm:p-8 shadow-lg",
        "bg-linear-to-br",
        gradient,
        variant === "emerald" && "shadow-emerald-900/5",
        variant === "blue" && "shadow-blue-900/5",
        variant === "slate" && "shadow-slate-900/5",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE4YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptLTIgMzBjMC0xLjEtLjktMi0yLTJzLTIgLjktMiAyIC45IDIgMiAyIDItLjkgMi0yem0xOC04YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
      
      <div className="relative">
        {/* Top row: Title + Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {eyebrow && (
              <p className="text-sm font-medium text-white/80">{eyebrow}</p>
            )}
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-white/70">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
              {actions}
            </div>
          )}
        </div>

        {/* Bottom row: Quick Stats */}
        {stats && stats.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/10 p-3 sm:p-4 backdrop-blur-sm"
              >
                <p className="text-xs font-medium text-white/70">
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "mt-1 text-lg sm:text-xl font-bold text-white truncate",
                    stat.highlight && "text-amber-200"
                  )}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}