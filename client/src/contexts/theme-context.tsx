import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // 로컬 스토리지에서 테마 불러오기
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme as "light" | "dark";
    }
    // 시스템 테마 감지
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    // HTML element에 dark 클래스 토글
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // 로컬 스토리지에 저장
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}