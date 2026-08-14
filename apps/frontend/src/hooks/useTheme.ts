import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored;
    }
    return "dark";
  });

  const [actualTheme, setActualTheme] = useState<"light" | "dark">(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Determine actual theme to apply
    let themeToApply: "light" | "dark";
    if (theme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      themeToApply = theme;
    }

    setActualTheme(themeToApply);

    // Update document class
    const root = document.documentElement;
    root.classList.toggle("dark", themeToApply === "dark");
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setActualTheme(newTheme);

      const root = document.documentElement;
      root.classList.toggle("dark", newTheme === "dark");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return { theme, setTheme, actualTheme };
};
