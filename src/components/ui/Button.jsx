import Loader from "./Loader";

const variants = {
  primary: "bg-forest text-white hover:bg-[#1c4a39] dark:bg-lime dark:text-forest dark:hover:bg-[#cfea42]",
  secondary: "bg-lime text-forest hover:bg-[#cfea42]",
  outline: "border border-forest/25 bg-transparent text-forest hover:bg-forest/5 dark:border-white/25 dark:text-white dark:hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "min-h-9 px-3 py-1.5 text-xs",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

/**
 * Button Component
 *
 * @param {object} props
 * @param {"primary"|"secondary"|"outline"|"danger"} [props.variant="primary"] Visual style.
 * @param {"sm"|"md"|"lg"} [props.size="md"] Button dimensions.
 * @param {boolean} [props.disabled=false] Prevents interaction.
 * @param {boolean} [props.loading=false] Displays a loader and prevents interaction.
 * @param {function} [props.onClick] Click handler.
 * @param {React.ReactNode} props.children Button content.
 * @param {string} [props.className] Additional Tailwind classes.
 * @param {"button"|"submit"|"reset"} [props.type="button"] Native button type.
 * @returns {React.ReactElement}
 */
export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  children,
  className = "",
  type = "button",
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 dark:focus-visible:ring-offset-[#0f1d18] ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...rest}
    >
      {loading && <Loader size="sm" label="Processing" />}
      {children}
    </button>
  );
}
