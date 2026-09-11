import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const DEFAULT_SETTINGS = {
  theme: "terracotta",
  darkMode: false,
  font: "outfit",
  radius: "squircle",
  glassmorphism: "glassy",
  backgroundPattern: "grids",
  animations: "smooth",
};

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("jobshield-settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          theme: parsed.theme || "terracotta",
          darkMode: parsed.darkMode !== undefined ? parsed.darkMode : false,
        };
      }
    } catch (e) {
      console.error("Failed to parse stored settings, using defaults.");
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", settings.theme || "terracotta");
    root.setAttribute("data-font", settings.font || "outfit");
    root.classList.remove("dark");
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value = {
    ...settings,
    updateSetting,
    resetSettings,
    isSettingsOpen,
    setIsSettingsOpen,
  };

  return (
    <ThemeContext.Provider value={value}>
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
