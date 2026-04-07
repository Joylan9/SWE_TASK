// ── CalendarDay.tsx ──────────────────────────────────────────────

import React, { useCallback } from 'react';
import type { CalendarDay as CalendarDayType, DateString } from './types/calendar.types';

interface CalendarDayProps {
  /** The day data object */
  day: CalendarDayType;
  /** Whether this date is in the hover preview range */
  isInHoverRange: boolean;
  /** Callback when this day is clicked/selected */
  onSelect: (date: DateString) => void;
  /** Callback when mouse enters this day cell */
  onHover: (date: DateString) => void;
}

/**
 * Determines if two CalendarDay renders are equivalent, preventing unnecessary re-renders.
 * Only re-renders if visual state changes: rangeState, isToday, notes count, or hover state.
 */
function areEqual(prevProps: CalendarDayProps, nextProps: CalendarDayProps): boolean {
  return (
    prevProps.day.date === nextProps.day.date &&
    prevProps.day.rangeState === nextProps.day.rangeState &&
    prevProps.day.isToday === nextProps.day.isToday &&
    prevProps.day.notes.length === nextProps.day.notes.length &&
    prevProps.isInHoverRange === nextProps.isInHoverRange &&
    prevProps.day.isCurrentMonth === nextProps.day.isCurrentMonth
  );
}

/**
 * Individual day cell component (atomic).
 * Renders as a <button> element for keyboard accessibility.
 * Displays range selection states, holiday markers, and note indicators.
 *
 * Wrapped in React.memo with a custom comparator for performance.
 */
const CalendarDayComponent: React.FC<CalendarDayProps> = ({
  day,
  isInHoverRange,
  onSelect,
  onHover,
}) => {
  const handleClick = useCallback(() => {
    onSelect(day.date);
  }, [onSelect, day.date]);

  const handleMouseEnter = useCallback(() => {
    onHover(day.date);
  }, [onHover, day.date]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(day.date);
      }
    },
    [onSelect, day.date]
  );

  // Build CSS class list
  const rangeClass = `cal-day--${day.rangeState}`;
  const classes = [
    'cal-day',
    rangeClass,
    !day.isCurrentMonth ? 'cal-day--overflow' : '',
    day.isToday ? 'cal-day--today' : '',
    day.isSaturday ? 'cal-day--saturday' : '',
    day.isSunday ? 'cal-day--sunday' : '',
    isInHoverRange ? 'cal-day--hover-preview' : '',
    day.isHoliday ? 'cal-day--holiday' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Construct accessible label
  let ariaLabel = `${day.dayOfMonth}`;
  if (day.isToday) ariaLabel += ', today';
  if (day.isHoliday && day.holidayName) ariaLabel += `, ${day.holidayName}`;
  if (day.notes.length > 0) ariaLabel += `, ${day.notes.length} note${day.notes.length > 1 ? 's' : ''}`;
  if (!day.isCurrentMonth) ariaLabel += ', outside current month';

  const isSelected = day.rangeState !== 'idle';

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-selected={isSelected}
      role="gridcell"
      tabIndex={day.isCurrentMonth ? 0 : -1}
      title={day.holidayName ?? undefined}
    >
      <span className="cal-day__number">{day.dayOfMonth}</span>
      {day.isHoliday && <span className="cal-day__holiday-dot" aria-hidden="true" />}
      {day.notes.length > 0 && (
        <span className="cal-day__note-indicator" aria-hidden="true">
          {day.notes.length > 1 ? day.notes.length : ''}
        </span>
      )}
    </button>
  );
};

CalendarDayComponent.displayName = 'CalendarDay';

export const CalendarDay = React.memo(CalendarDayComponent, areEqual);
