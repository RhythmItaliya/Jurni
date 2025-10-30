'use client';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg width="20" height="20">
          <use href="/icons.svg#icon-moon" />
        </svg>
      ) : (
        <svg width="20" height="20">
          <use href="/icons.svg#icon-sun" />
        </svg>
      )}
    </button>
  );
}
