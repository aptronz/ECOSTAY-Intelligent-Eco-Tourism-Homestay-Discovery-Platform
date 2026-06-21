const sizes = {
  sm: "h-4 w-4",
  md: "h-7 w-7",
  lg: "h-11 w-11",
};

/**
 * Loader Component
 *
 * @param {object} props
 * @param {"spinner"|"pulse"} [props.variant="spinner"] Visual loading style.
 * @param {"sm"|"md"|"lg"} [props.size="md"] Loader dimensions.
 * @param {string} [props.label="Loading"] Accessible loading label.
 * @param {string} [props.className] Additional Tailwind classes.
 * @returns {React.ReactElement}
 */
export default function Loader({
  variant = "spinner",
  size = "md",
  label = "Loading",
  className = "",
}) {
  const dimension = sizes[size] || sizes.md;

  if (variant === "pulse") {
    return (
      <span
        aria-label={label}
        role="status"
        className={`inline-block animate-pulse rounded-full bg-leaf/70 ${dimension} ${className}`}
      >
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <span
      aria-label={label}
      role="status"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${dimension} ${className}`}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
