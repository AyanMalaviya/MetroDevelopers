import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'metro-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    // Ignore storage access errors and fall back to system preference.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDocument = (theme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage access errors (private browsing, strict settings, etc.).
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasSavedPreference = false;
    try {
      hasSavedPreference = !!window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      hasSavedPreference = false;
    }

    if (hasSavedPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (event) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
