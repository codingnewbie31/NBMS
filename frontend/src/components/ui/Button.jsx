import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

// Visual variants mapped to the brand's control-room palette
const VARIANTS = {
  primary:
    "bg-emerald-600 text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-700 focus-visible:ring-emerald-300",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300",
  outline:
    "bg-transparent text-emerald-700 border border-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-300",
  danger:
    "bg-rose-600 text-white shadow-md shadow-rose-900/20 hover:bg-rose-700 focus-visible:ring-rose-300",
  ghost:
    "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-300",
};

// Size scale in line with the app's compact control density
const SIZES = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  className = "",
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold tracking-wide transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        "cursor-pointer",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {/* Loading state overrides any provided icon */}
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {!loading && Icon && iconPosition === "left" && (
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {children && <span>{children}</span>}
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}