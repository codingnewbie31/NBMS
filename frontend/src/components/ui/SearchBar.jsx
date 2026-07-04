// src/components/ui/SearchBar.jsx
import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "./cn";

/**
 * SearchBar - Search input with clear button
 * 
 * Props:
 * - value: Current search value
 * - onChange: Change handler
 * - placeholder: Input placeholder
 * - className: Additional classes
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={cn("relative flex-1 sm:max-w-md", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100/50 transition-shadow"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}