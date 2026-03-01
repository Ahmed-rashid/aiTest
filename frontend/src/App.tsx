import { useEffect, useState } from "react";
import { Sidebar } from "./layout/Sidebar";
import { TopBar } from "./layout/TopBar";
import { OverviewPage } from "./pages/OverviewPage";

const THEME_KEY = "fitops-theme";

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme ? savedTheme === "dark" : false;
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <TopBar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode((prev: boolean) => !prev)} />
        <OverviewPage />
      </div>
    </div>
  );
}
