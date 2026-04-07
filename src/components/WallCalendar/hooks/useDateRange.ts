// ── useDateRange.ts ──────────────────────────────────────────────

import { useState, useCallback } from 'react';
import type { DateString } from '../types/calendar.types';
import { isInHoverRange } from '../utils/calendarUtils';

/**
 * Hook for managing hover preview state during range selection.
 * When range start is selected but end is not, hovering over dates
 * shows a ghost/preview of what the range would look like.
 *
 * @param rangeStart - Currently selected range start
 * @param rangeEnd - Currently selected range end
 * @returns Object with hoverDate state and utilities
 */
export function useDateRange(rangeStart: DateString | null, rangeEnd: DateString | null) {
  const [hoverDate, setHoverDate] = useState<DateString | null>(null);

  /**
   * Checks if a given date should show the hover preview highlight.
   * Only active when start is selected but end is not yet selected.
   */
  const isDateInHoverRange = useCallback(
    (dateStr: DateString): boolean => {
      if (!rangeStart || rangeEnd || !hoverDate) return false;
      return isInHoverRange(dateStr, rangeStart, hoverDate);
    },
    [rangeStart, rangeEnd, hoverDate]
  );

  /** Sets the hover date when mouse enters a day cell */
  const onDateHover = useCallback(
    (dateStr: DateString) => {
      if (rangeStart && !rangeEnd) {
        setHoverDate(dateStr);
      }
    },
    [rangeStart, rangeEnd]
  );

  /** Clears the hover date when mouse leaves the grid */
  const onDateHoverEnd = useCallback(() => {
    setHoverDate(null);
  }, []);

  return {
    hoverDate,
    isDateInHoverRange,
    onDateHover,
    onDateHoverEnd,
  };
}
