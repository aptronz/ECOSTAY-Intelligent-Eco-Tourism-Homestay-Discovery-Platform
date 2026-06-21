import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

const toastStyles = {
  success: { icon: CheckCircle2, className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100" },
  error: { icon: AlertCircle, className: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100" },
  warning: { icon: TriangleAlert, className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100" },
  info: { icon: Info, className: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100" },
};

/**
 * Toast Component
 *
 * @param {object} props
 * @param {boolean} props.isOpen Controls toast visibility.
 * @param {"success"|"error"|"warning"|"info"} [props.type="info"] Toast intent.
 * @param {string} props.message Toast message.
 * @param {function} props.onClose Dismiss handler.
 * @param {number} [props.duration=3000] Auto-dismiss delay in milliseconds.
 * @returns {React.ReactElement}
 */
export default function Toast({
  isOpen,
  type = "info",
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const timeout = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, isOpen, onClose]);

  const style = toastStyles[type] || toastStyles.info;
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role={type === "error" ? "alert" : "status"}
          aria-live={type === "error" ? "assertive" : "polite"}
          initial={{ opacity: 0, x: 24, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 24 }}
          className={`fixed right-4 top-20 z-[110] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-lg border p-4 shadow-xl ${style.className}`}
        >
          <Icon className="mt-0.5 shrink-0" size={20} />
          <p className="min-w-0 flex-1 text-sm font-semibold">{message}</p>
          <button type="button" onClick={onClose} aria-label="Dismiss notification" className="shrink-0 opacity-65 hover:opacity-100">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
