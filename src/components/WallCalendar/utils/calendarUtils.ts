// ── calendarUtils.ts ──────────────────────────────────────────────

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday as isTodayFn,
  isSameDay,
  isWithinInterval,
  isBefore,
  getDay,
  isSameMonth,
  parseISO,
  addMonths,
  subMonths,
} from 'date-fns';
import type { CalendarDay, CalendarNote, DateRange, DateString, RangeState } from '../types/calendar.types';
import { HOLIDAYS, TOTAL_CELLS } from '../constants/calendar.constants';

/**
 * Formats a Date object to ISO date string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns ISO date string
 */
export function toDateString(date: Date): DateString {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parses an ISO date string to a Date object
 * @param dateString - ISO date string
 * @returns Date object
 */
export function fromDateString(dateString: DateString): Date {
  return parseISO(dateString);
}

/**
 * Gets the day of the week as ISO index (Monday=0, Sunday=6)
 * @param date - The date to check
 * @returns ISO day index (0=Monday, 6=Sunday)
 */
export function getISODayIndex(date: Date): number {
  const day = getDay(date);
  return day === 0 ? 6 : day - 1;
}

/**
 * Checks if a given date is a Saturday
 * @param date - The date to check
 * @returns true if Saturday
 */
export function isSaturday(date: Date): boolean {
  return getDay(date) === 6;
}

/**
 * Checks if a given date is a Sunday
 * @param date - The date to check
 * @returns true if Sunday
 */
export function isSunday(date: Date): boolean {
  return getDay(date) === 0;
}

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 * @param date - The date to check
 * @returns true if weekend
 */
export function isWeekend(date: Date): boolean {
  return isSaturday(date) || isSunday(date);
}

/**
 * Finds a holiday for a given date from the holidays list
 * @param date - The date to check
 * @returns Holiday name if found, undefined otherwise
 */
export function getHolidayForDate(date: Date): string | undefined {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const holiday = HOLIDAYS.find((h) => h.month === month && h.day === day);
  return holiday?.name;
}

/**
 * Determines the range state of a date cell based on the current selection
 * @param dateStr - The date string to evaluate
 * @param range - The current selected range
 * @returns The appropriate RangeState
 */
export function getRangeState(dateStr: DateString, range: DateRange): RangeState {
  if (!range.start) return 'idle';

  const date = fromDateString(dateStr);
  const start = fromDateString(range.start);

  if (!range.end) {
    return isSameDay(date, start) ? 'single' : 'idle';
  }

  const end = fromDateString(range.end);

  if (isSameDay(start, end) && isSameDay(date, start)) {
    return 'single';
  }

  if (isSameDay(date, start)) return 'start';
  if (isSameDay(date, end)) return 'end';

  if (isWithinInterval(date, { start, end })) {
    return 'middle';
  }

  return 'idle';
}

/**
 * Determines if a date falls within a preview hover range
 * @param dateStr - The date to check
 * @param rangeStart - The selected start date
 * @param hoverDate - The currently hovered date
 * @returns true if the date is in the hover preview range
 */
export function isInHoverRange(
  dateStr: DateString,
  rangeStart: DateString,
  hoverDate: DateString
): boolean {
  const date = fromDateString(dateStr);
  const start = fromDateString(rangeStart);
  const hover = fromDateString(hoverDate);

  const effectiveStart = isBefore(hover, start) ? hover : start;
  const effectiveEnd = isBefore(hover, start) ? start : hover;

  return (
    isWithinInterval(date, { start: effectiveStart, end: effectiveEnd }) ||
    isSameDay(date, effectiveStart) ||
    isSameDay(date, effectiveEnd)
  );
}

/**
 * Generates an array of CalendarDay objects for a given month/year.
 * Always produces 42 cells (6 rows × 7 columns) for consistent grid layout.
 * Includes overflow days from previous and next months.
 *
 * @param month - Month index (0-11)
 * @param year - Full year number
 * @param range - Current selected date range
 * @param notes - All saved notes
 * @returns Array of 42 CalendarDay objects
 */
export function generateCalendarDays(
  month: number,
  year: number,
  range: DateRange,
  notes: CalendarNote[]
): CalendarDay[] {
  const monthDate = new Date(year, month, 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  // Start from Monday (weekStartsOn: 1 for ISO standard)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Ensure we always have exactly 42 cells (6 rows)
  while (allDays.length < TOTAL_CELLS) {
    const lastDay = allDays[allDays.length - 1];
    const nextDay = new Date(lastDay);
    nextDay.setDate(nextDay.getDate() + 1);
    allDays.push(nextDay);
  }

  return allDays.slice(0, TOTAL_CELLS).map((date): CalendarDay => {
    const dateStr = toDateString(date);
    const holidayName = getHolidayForDate(date);

    // Find notes that include this date in their range
    const dayNotes = notes.filter((note) => {
      if (note.rangeStart && note.rangeEnd) {
        const noteStart = fromDateString(note.rangeStart);
        const noteEnd = fromDateString(note.rangeEnd);
        return (
          isWithinInterval(date, { start: noteStart, end: noteEnd }) ||
          isSameDay(date, noteStart) ||
          isSameDay(date, noteEnd)
        );
      }
      if (note.rangeStart && !note.rangeEnd) {
        return isSameDay(date, fromDateString(note.rangeStart));
      }
      // Monthly notes: match month and year
      return note.month === month && note.year === year && !note.rangeStart;
    });

    return {
      date: dateStr,
      dayOfMonth: date.getDate(),
      isCurrentMonth: isSameMonth(date, monthDate),
      isToday: isTodayFn(date),
      isWeekend: isWeekend(date),
      isHoliday: !!holidayName,
      holidayName,
      isSaturday: isSaturday(date),
      isSunday: isSunday(date),
      rangeState: getRangeState(dateStr, range),
      notes: dayNotes,
    };
  });
}

/**
 * Gets the next month/year tuple
 * @param month - Current month (0-11)
 * @param year - Current year
 * @returns Tuple of [nextMonth, nextYear]
 */
export function getNextMonth(month: number, year: number): [number, number] {
  const next = addMonths(new Date(year, month, 1), 1);
  return [next.getMonth(), next.getFullYear()];
}

/**
 * Gets the previous month/year tuple
 * @param month - Current month (0-11)
 * @param year - Current year
 * @returns Tuple of [prevMonth, prevYear]
 */
export function getPrevMonth(month: number, year: number): [number, number] {
  const prev = subMonths(new Date(year, month, 1), 1);
  return [prev.getMonth(), prev.getFullYear()];
}

/**
 * Formats a date range for display
 * @param start - Start date string
 * @param end - End date string (optional)
 * @returns Formatted range string like "Jan 5 – Jan 10"
 */
export function formatDateRange(start: DateString | null, end: DateString | null): string {
  if (!start) return '';
  const startDate = fromDateString(start);
  const startFormatted = format(startDate, 'MMM d');

  if (!end || start === end) {
    return startFormatted;
  }

  const endDate = fromDateString(end);
  const endFormatted = format(endDate, 'MMM d');
  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Formats a single date for aria-label
 * @param dateStr - ISO date string
 * @returns Full date string like "Monday, January 5, 2026"
 */
export function formatDateForAria(dateStr: DateString): string {
  return format(fromDateString(dateStr), 'EEEE, MMMM d, yyyy');
}
