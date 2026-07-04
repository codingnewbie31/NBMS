// src/components/ui/DataTable.jsx
import React from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./cn";
import TableSkeleton from "./TableSkeleton";
import EmptyState from "./EmptyState";

/**
 * DataTable - Reusable data table with sorting, pagination, loading, and empty states
 * 
 * Props:
 * - columns: Array of { key, label, sortable?, hideOnMobile?, align?, render? }
 * - data: Array of data objects
 * - sortConfig: { key, direction }
 * - onSort: Sort handler
 * - loading: Show loading skeleton
 * - error: Error message
 * - emptyState: Props for EmptyState component
 * - pagination: { currentPage, totalPages, itemsPerPage, totalItems, onPageChange }
 * - rowActions: Function to render action buttons per row
 * - onRowClick: Optional row click handler
 * - zebraStripes: Enable zebra striping
 * - className: Additional classes
 */
export default function DataTable({
  columns = [],
  data = [],
  sortConfig,
  onSort,
  loading = false,
  error = null,
  emptyState,
  pagination,
  rowActions,
  onRowClick,
  zebraStripes = true,
  className = "",
}) {
  
  // Loading state
  if (loading) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
        <TableSkeleton columns={columns.length} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm", className)}>
        <div className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
        <div className="p-12">
          <EmptyState {...emptyState} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table">
          <thead>
            <tr className="border-b-2 border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase text-slate-500">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 sm:px-6 py-3.5",
                    column.hideOnMobile && "hidden sm:table-cell",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center"
                  )}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => onSort?.(column.key)}
                      className="inline-flex items-center gap-1.5 hover:text-slate-700 focus:outline-none"
                      aria-label={`Sort by ${column.label} ${
                        sortConfig?.key === column.key
                          ? `(${sortConfig.direction}ending)`
                          : ""
                      }`}
                    >
                      {column.label}
                      <ArrowUpDown
                        className={cn(
                          "h-3 w-3",
                          sortConfig?.key === column.key && "text-emerald-500"
                        )}
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {rowActions && (
                <th className="px-4 sm:px-6 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr
                key={item._id || index}
                className={cn(
                  "group transition-colors hover:bg-emerald-50/50 focus-within:bg-emerald-50/50",
                  zebraStripes && index % 2 === 1 && "bg-slate-50/30",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && onRowClick) onRowClick(item);
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 sm:px-6 py-3.5",
                      column.hideOnMobile && "hidden sm:table-cell",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center"
                    )}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      {rowActions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 sm:px-6 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {data.length === 0
                  ? 0
                  : (pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                -
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {pagination.totalItems}
              </span>{" "}
              items
            </p>

            <nav className="flex items-center gap-1" aria-label="Pagination">
              <button
                onClick={() =>
                  pagination.onPageChange(Math.max(1, pagination.currentPage - 1))
                }
                disabled={pagination.currentPage === 1}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => pagination.onPageChange(pageNum)}
                      className={cn(
                        "min-w-9 rounded-lg px-2 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-200",
                        pagination.currentPage === pageNum
                          ? "bg-emerald-100 text-emerald-700 shadow-sm"
                          : "text-slate-500 hover:bg-white hover:text-slate-700"
                      )}
                      aria-label={`Page ${pageNum}`}
                      aria-current={
                        pagination.currentPage === pageNum ? "page" : undefined
                      }
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  pagination.onPageChange(
                    Math.min(pagination.totalPages, pagination.currentPage + 1)
                  )
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-200"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}