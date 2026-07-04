import React, { forwardRef, useId } from "react";
import { cn } from "./cn";

// Text input with label, icon, helper and error states
const Input = forwardRef(function Input(
  {
    label,
    icon: Icon,
    error,
    helperText,
    required = false,
    className = "",
    containerClassName = "",
    id,
    ...rest
  },
  ref
) {
  // Stable id fallback so label/input stay linked without caller effort
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold tracking-wide text-slate-700"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-600">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? helperId : undefined}
          className={cn(
            "w-full rounded-md border bg-white py-2 text-sm text-slate-800 outline-none transition",
            "placeholder:text-slate-400",
            Icon ? "pl-9 pr-3" : "px-3",
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            className
          )}
          {...rest}
        />
      </div>

      {/* Error takes priority over generic helper copy */}
      {(error || helperText) && (
        <p
          id={helperId}
          className={cn(
            "text-xs",
            error ? "font-medium text-rose-600" : "text-slate-400"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;