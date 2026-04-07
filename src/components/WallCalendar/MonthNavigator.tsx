// ── MonthNavigator.tsx ──────────────────────────────────────────────

import React, { useCallback, useMemo } from 'react';
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
  /** Callback to set a specific year */
  onSetYear: (year: number) => void;
}

/** Range of years available in the dropdown: current year ± 50 */
const YEAR_RANGE = 50;

/**
 * Month navigation component with left/right arrow controls
 * and a year selector dropdown.
 * Displays the current month and year between navigation buttons.
 * Uses aria-live to announce month changes to screen readers.
 */
export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onSetYear,
}) => {
  const currentSystemYear = new Date().getFullYear();

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentSystemYear - YEAR_RANGE; y <= currentSystemYear + YEAR_RANGE; y++) {
      years.push(y);
    }
    return years;
  }, [currentSystemYear]);

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSetYear(Number(e.target.value));
    },
    [onSetYear]
  );

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
        <select
          className="cal-nav__year-select"
          value={year}
          onChange={handleYearChange}
          aria-label="Select year"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
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
