import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "./cn";

// In-page section header, distinct from the fixed app TopBar
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  actions,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        {/* Optional breadcrumb trail */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1.5 flex items-center gap-1 text-xs text-slate-400">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
                <span className={i === breadcrumb.length - 1 ? "font-semibold text-slate-600" : ""}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold tracking-widest text-emerald-700 uppercase">
            {eyebrow}
          </p>
        )}

        <h1 className="text-xl font-black tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      {/* Right-aligned action buttons, e.g. "New Order" */}
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}