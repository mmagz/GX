import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get initial theme
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme) return savedTheme;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Prevent flash on initial load
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    localStorage.setItem('theme', theme);
    root.classList.toggle('dark', theme === 'dark');
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  // Prevent FOUC (Flash of Unstyled Content)
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
