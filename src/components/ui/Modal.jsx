import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Modal Component
 *
 * @param {object} props
 * @param {boolean} props.isOpen Controls modal visibility.
 * @param {function} props.onClose Closes the modal.
 * @param {string} props.title Accessible modal title.
 * @param {React.ReactNode} props.children Modal body.
 * @param {React.ReactNode} [props.footer] Optional footer actions.
 * @returns {React.ReactElement}
 */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  const titleId = useId();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/55 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-lg border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#172721]"
          >
            <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <h2 id={titleId} className="text-lg font-extrabold text-forest dark:text-white">{title}</h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf dark:hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </header>
            <div className="px-5 py-5">{children}</div>
            {footer && <footer className="flex flex-wrap justify-end gap-3 border-t border-black/10 px-5 py-4 dark:border-white/10">{footer}</footer>}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
