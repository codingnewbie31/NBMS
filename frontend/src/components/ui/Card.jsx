// src/components/ui/Card.jsx - Only 2 lines changed
import React from "react";
import { cn } from "./cn";

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
        "rounded-xl border border-slate-200 bg-white shadow-sm", 
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
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

      {footer && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}