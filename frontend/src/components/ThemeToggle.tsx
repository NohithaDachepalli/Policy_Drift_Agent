import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme, className = '' }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDark
          ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 shadow-sm'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
