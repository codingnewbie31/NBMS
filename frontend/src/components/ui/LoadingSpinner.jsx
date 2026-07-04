import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

// Size scale shared by all spinner instances
const SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
};

export default function LoadingSpinner({
  size = "md",
  label = "Loading...",
  fullScreen = false,
  className = "",
}) {
  // Spinner + optional status label, announced to assistive tech
  const spinner = (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <Loader2 className={cn(SIZES[size] || SIZES.md, "animate-spin text-emerald-600")} />
      {label && (
        <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
          {label}
        </span>
      )}
    </div>
  );

  // Full-viewport variant for route/page level loading states
  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}