// src/components/ui/FilterBar.jsx
import React from "react";
import { cn } from "./cn";

/**
 * FilterBar - Group of filter toggle buttons
 * 
 * Props:
 * - filters: Array of { value, label }
 * - activeFilter: Currently selected filter value
 * - onChange: Filter change handler
 * - label: ARIA label for the filter group
 * - className: Additional classes
 */
export default function FilterBar({
  filters = [],
  activeFilter,
  onChange,
  label = "Filter options",
  className = "",
}) {
  return (
    <div className={cn("flex gap-2", className)} role="group" aria-label={label}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "rounded-lg px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200",
            activeFilter === filter.value
              ? "bg-emerald-100 text-emerald-700 shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
          aria-pressed={activeFilter === filter.value}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}