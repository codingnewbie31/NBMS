import { cn } from "./cn";

// Status-driven color mapping, reused by tables, cards and headers
const VARIANTS = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/20",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

// Solid dot color per variant, used only when `dot` is set
const DOT_COLORS = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
};

const SIZES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

function Badge({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide uppercase ring-1 ring-inset",
        VARIANTS[variant] || VARIANTS.neutral,
        SIZES[size] || SIZES.sm,
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", DOT_COLORS[variant] || DOT_COLORS.neutral)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
export default Badge;
export {Badge};