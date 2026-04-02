'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  // Убираем mounted, используем флаг клиента
  const [isClient, setIsClient] = useState(false);

  // Инициализация на клиенте
  useEffect(() => {
    setIsClient(true);
    
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setThemeState(savedTheme);

    const updateDarkMode = () => {
      if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      } else {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(isDarkMode);
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    updateDarkMode();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (savedTheme === 'system') {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(isDarkMode);
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Всегда рендерим провайдер, но с дефолтными значениями на сервере
  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
}