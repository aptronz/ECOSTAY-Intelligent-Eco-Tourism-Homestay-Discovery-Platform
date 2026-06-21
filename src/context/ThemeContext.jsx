import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

function getInitialTheme() {
  const savedTheme = localStorage.getItem("eco-theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Theme Provider
 *
 * Stores the selected theme, applies Tailwind's dark class, and persists
 * the preference between browser sessions.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Application content.
 * @returns {React.ReactElement}
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem("eco-theme", theme);
  }, [isDark, theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, isDark, setTheme, toggleTheme }),
    [isDark, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
