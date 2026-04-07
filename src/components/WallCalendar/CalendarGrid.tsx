// ── CalendarGrid.tsx ──────────────────────────────────────────────

import React, { useCallback } from 'react';
import type { CalendarDay as CalendarDayType, DateString } from './types/calendar.types';
import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
  /** Array of calendar day objects (42 items) */
  calendarDays: CalendarDayType[];
  /** Week header labels */
  weekHeaders: string[];
  /** Callback when a day is selected */
  onSelectDate: (date: DateString) => void;
  /** Callback to check if a date is in the hover preview range */
  isDateInHoverRange: (dateStr: DateString) => boolean;
  /** Callback when a day cell is hovered */
  onDateHover: (date: DateString) => void;
  /** Callback when mouse leaves the grid */
  onDateHoverEnd: () => void;
}

/**
 * Calendar date grid component.
 * Renders a 7-column grid with headers (MON–SUN) and 6 rows of day cells.
 * Uses role="grid" for accessibility compliance.
 */
export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  weekHeaders,
  onSelectDate,
  isDateInHoverRange,
  onDateHover,
  onDateHoverEnd,
}) => {
  // Split days into rows of 7 for semantically correct grid rows
  const rows: CalendarDayType[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const buttons = Array.from(
        (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button.cal-day')
      );
      const currentIndex = buttons.indexOf(target as HTMLButtonElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          nextIndex = Math.min(currentIndex + 1, buttons.length - 1);
          break;
        case 'ArrowLeft':
          nextIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          nextIndex = Math.min(currentIndex + 7, buttons.length - 1);
          break;
        case 'ArrowUp':
          nextIndex = Math.max(currentIndex - 7, 0);
          break;
        default:
          return;
      }

      e.preventDefault();
      buttons[nextIndex]?.focus();
    },
    []
  );

  return (
    <div
      className="cal-grid"
      role="grid"
      aria-label="Calendar dates"
      onMouseLeave={onDateHoverEnd}
      onKeyDown={handleKeyNavigation}
    >
      {/* Column Headers */}
      <div className="cal-grid__header" role="row">
        {weekHeaders.map((header) => (
          <div
            key={header}
            className={`cal-grid__header-cell ${
              header === 'SAT'
                ? 'cal-grid__header-cell--sat'
                : header === 'SUN'
                ? 'cal-grid__header-cell--sun'
                : ''
            }`}
            role="columnheader"
            aria-label={header}
          >
            {header}
          </div>
        ))}
      </div>

      {/* Date Rows */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="cal-grid__row" role="row">
          {row.map((day) => (
            <CalendarDay
              key={day.date}
              day={day}
              isInHoverRange={isDateInHoverRange(day.date)}
              onSelect={onSelectDate}
              onHover={onDateHover}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
