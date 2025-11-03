'use client';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  onClick?: () => void;
}

export default function ThemeToggle({ onClick }: ThemeToggleProps = {}) {
  const { theme, toggleTheme } = useTheme();
  const handleClick = onClick || toggleTheme;

  return (
    <button
      onClick={handleClick}
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
