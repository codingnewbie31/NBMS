// src/components/ui/TableSkeleton.jsx
import React from "react";

/**
 * TableSkeleton - Loading placeholder for data tables
 * 
 * Props:
 * - rows: Number of skeleton rows (default: 8)
 * - columns: Number of skeleton columns (default: 6)
 * - showHeader: Show header skeleton (default: true)
 */
export default function TableSkeleton({ rows = 8, columns = 6, showHeader = true }) {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading data">
      {showHeader && (
        <div className="bg-slate-50/80 px-6 py-3.5">
          <div className="flex gap-6">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className="h-3 rounded-sm bg-slate-200"
                style={{ width: `${Math.random() * 40 + 60}px` }}
              />
            ))}
          </div>
        </div>
      )}
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="border-t border-slate-100 px-6 py-3.5"
        >
          <div className="flex gap-6">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 rounded-sm bg-slate-100"
                style={{ width: `${Math.random() * 60 + 80}px` }}
              />
            ))}
          </div>
        </div>
      ))}
      
      <span className="sr-only">Loading data...</span>
    </div>
  );
}