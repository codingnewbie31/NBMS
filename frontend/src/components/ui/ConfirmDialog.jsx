// components/ui/ConfirmDialog.jsx
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger", // danger, warning, info
  onConfirm,
  onCancel,
  loading = false,
}) {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
      if (e.key === "Tab") {
        // Basic focus trap
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements?.length) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus confirm button on mount
    confirmButtonRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const variantStyles = {
    danger: {
      icon: "text-red-600",
      iconBg: "bg-red-100",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-200",
      title: "text-red-900",
    },
    warning: {
      icon: "text-amber-600",
      iconBg: "bg-amber-100",
      button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-200",
      title: "text-amber-900",
    },
    info: {
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-200",
      title: "text-blue-900",
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 transition-all"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
          <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3
            id="dialog-title"
            className={`text-lg font-semibold ${styles.title}`}
          >
            {title}
          </h3>
          <p
            id="dialog-description"
            className="mt-2 text-sm text-slate-600"
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 ${styles.button}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}