import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Accesses ECOSTAY's global theme state.
 *
 * @returns {{theme: string, isDark: boolean, setTheme: function, toggleTheme: function}}
 */
export default function useDarkMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useDarkMode must be used within ThemeProvider");
  }

  return context;
}
