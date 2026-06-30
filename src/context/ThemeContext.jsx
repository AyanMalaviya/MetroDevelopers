'use client';

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

  const browserThemeColor = theme === 'dark' ? '#0b0b0d' : '#f4f5f7';
  const themeColorMeta = document.querySelector("meta[name='theme-color']");
  const tileColorMeta = document.querySelector("meta[name='msapplication-TileColor']");
  if (themeColorMeta) themeColorMeta.setAttribute('content', browserThemeColor);
  if (tileColorMeta) tileColorMeta.setAttribute('content', browserThemeColor);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors.
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let hasSaved = false;
    try { hasSaved = !!window.localStorage.getItem(THEME_STORAGE_KEY); } catch { hasSaved = false; }
    if (hasSaved) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
