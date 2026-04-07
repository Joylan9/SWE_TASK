// ── ThemeToggle.tsx ──────────────────────────────────────────────

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  /** Current theme */
  theme: 'light' | 'dark';
  /** Callback to toggle the theme */
  onToggle: () => void;
}

/**
 * Light/Dark theme toggle button.
 * Displays a Sun icon for dark mode and Moon icon for light mode.
 * Theme is persisted via the useCalendar hook.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      type="button"
      className="cal-theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={18} aria-hidden="true" />
      ) : (
        <Sun size={18} aria-hidden="true" />
      )}
    </button>
  );
};
