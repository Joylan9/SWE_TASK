// ── MonthNavigator.tsx ──────────────────────────────────────────────

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from './constants/calendar.constants';

interface MonthNavigatorProps {
  /** Current month index (0-11) */
  month: number;
  /** Current year */
  year: number;
  /** Callback to navigate to previous month */
  onPrevMonth: () => void;
  /** Callback to navigate to next month */
  onNextMonth: () => void;
}

/**
 * Month navigation component with left/right arrow controls.
 * Displays the current month and year between navigation buttons.
 * Uses aria-live to announce month changes to screen readers.
 */
export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  month,
  year,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <nav className="cal-nav" aria-label="Month navigation">
      <button
        type="button"
        className="cal-nav__btn"
        onClick={onPrevMonth}
        aria-label="Previous month"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <div className="cal-nav__label" aria-live="polite" aria-atomic="true">
        <span className="cal-nav__month">{MONTH_NAMES[month]}</span>
        <span className="cal-nav__year">{year}</span>
      </div>

      <button
        type="button"
        className="cal-nav__btn"
        onClick={onNextMonth}
        aria-label="Next month"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </nav>
  );
};
