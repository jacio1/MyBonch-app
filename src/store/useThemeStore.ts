import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const getIsDarkFromTheme = (theme: Theme): boolean => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyThemeToDOM = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,

      setTheme: (newTheme: Theme) => {
        const newIsDark = getIsDarkFromTheme(newTheme);
        
        set({ theme: newTheme, isDark: newIsDark });
        applyThemeToDOM(newIsDark);
      },

      initializeTheme: () => {
        const { theme } = get();
        const isDark = getIsDarkFromTheme(theme);
        
        set({ isDark });
        applyThemeToDOM(isDark);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          const { theme: currentTheme } = get();
          if (currentTheme === 'system') {
            const newIsDark = e.matches;
            set({ isDark: newIsDark });
            applyThemeToDOM(newIsDark);
          }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        return () => {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
      },
    }),
    {
      name: 'theme-storage', 
      partialize: (state) => ({ theme: state.theme }), 
    }
  )
);