// ── index.tsx ──────────────────────────────────────────────

/**
 * Public barrel export for the WallCalendar component.
 * Re-exports the root component and theme hook.
 */
export { WallCalendar } from './WallCalendar';
export { useTheme } from './WallCalendar';
export type {
  CalendarDay,
  CalendarNote,
  CalendarState,
  CalendarAction,
  DateRange,
  DateString,
  ThemeContextValue,
} from './types/calendar.types';
