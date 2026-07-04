import React from "react";
import { cn } from "./cn";

// Padding scale kept on the 4/8/12/16/24/32px spacing system
const PADDING = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  title,
  subtitle,
  icon: Icon,
  actions,
  footer,
  padding = "md",
  className = "",
  children,
}) {
  const hasHeader = title || subtitle || Icon || actions;

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-xs",
        className
      )}
    >
      {/* Optional header row: title/subtitle on the left, actions on the right */}
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={PADDING[padding] || PADDING.md}>{children}</div>

      {/* Optional footer strip, e.g. summary totals or form actions */}
      {footer && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}