import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-red hover:bg-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={24} className="group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun size={24} className="group-hover:rotate-180 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
