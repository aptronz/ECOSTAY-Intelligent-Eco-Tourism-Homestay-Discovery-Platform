import { useId } from "react";
import { Search } from "lucide-react";

/**
 * Input Component
 *
 * @param {object} props
 * @param {string} [props.label] Visible field label.
 * @param {"text"|"email"|"password"|"search"} [props.type="text"] Native input type.
 * @param {string} [props.placeholder] Placeholder text.
 * @param {string} [props.error] Validation error message.
 * @param {string} [props.helperText] Supporting field text.
 * @param {boolean} [props.required=false] Marks the field as required.
 * @param {string} [props.id] Custom input id.
 * @param {string} [props.className] Additional input classes.
 * @returns {React.ReactElement}
 */
export default function Input({
  label,
  type = "text",
  placeholder,
  error,
  helperText,
  required = false,
  id,
  className = "",
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;
  const isSearch = type === "search";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-ink dark:text-white">
          {label}
          {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {isSearch && (
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? messageId : undefined}
          className={`min-h-11 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-leaf focus:ring-2 focus:ring-leaf/20 dark:bg-[#172721] dark:text-white ${isSearch ? "pl-10" : ""} ${error ? "border-red-500" : "border-black/15 dark:border-white/15"} ${className}`}
          {...rest}
        />
      </div>
      {(error || helperText) && (
        <p id={messageId} className={`mt-1.5 text-xs ${error ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
