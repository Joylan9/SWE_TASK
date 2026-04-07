// ── calendar.types.ts ──────────────────────────────────────────────

/** ISO format date string: "YYYY-MM-DD" */
export type DateString = string;

/** Represents the visual state of a day cell in the range selection */
export type RangeState = 'idle' | 'start' | 'end' | 'middle' | 'single';

/** Represents a single day cell in the calendar grid */
export interface CalendarDay {
  /** ISO date string for this day */
  date: DateString;
  /** The numeric day of the month (1-31) */
  dayOfMonth: number;
  /** Whether this day belongs to the currently displayed month */
  isCurrentMonth: boolean;
  /** Whether this day is today's date */
  isToday: boolean;
  /** Whether this day falls on a weekend (Saturday or Sunday) */
  isWeekend: boolean;
  /** Whether this day is a holiday */
  isHoliday: boolean;
  /** Name of the holiday, if applicable */
  holidayName?: string;
  /** Whether this day is a Saturday specifically */
  isSaturday: boolean;
  /** Whether this day is a Sunday specifically */
  isSunday: boolean;
  /** Current range selection state of this day */
  rangeState: RangeState;
  /** Notes associated with this day */
  notes: CalendarNote[];
}

/** Represents a saved note associated with a date range or month */
export interface CalendarNote {
  /** Unique identifier generated via crypto.randomUUID() */
  id: string;
  /** Start date of the range this note is for, null for monthly notes */
  rangeStart: DateString | null;
  /** End date of the range this note is for, null for monthly notes */
  rangeEnd: DateString | null;
  /** The note content text */
  content: string;
  /** ISO datetime string of when the note was created */
  createdAt: string;
  /** Month index (0-11) this note belongs to */
  month: number;
  /** Year this note belongs to */
  year: number;
}

/** Represents a selected date range */
export interface DateRange {
  /** Start date of the range, null if no start selected */
  start: DateString | null;
  /** End date of the range, null if no end selected */
  end: DateString | null;
}

/** Complete calendar state managed by useReducer */
export interface CalendarState {
  /** Currently displayed month (0-11) */
  currentMonth: number;
  /** Currently displayed year */
  currentYear: number;
  /** Currently selected date range */
  selectedRange: DateRange;
  /** All saved notes */
  notes: CalendarNote[];
  /** Current theme */
  theme: 'light' | 'dark';
  /** ID of the note currently being edited, null if none */
  activeNoteId: string | null;
}

/** All possible actions for the calendar reducer */
export type CalendarAction =
  | { type: 'NEXT_MONTH' }
  | { type: 'PREV_MONTH' }
  | { type: 'SELECT_DATE'; payload: DateString }
  | { type: 'ADD_NOTE'; payload: Omit<CalendarNote, 'id' | 'createdAt'> }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'RESET_RANGE' }
  | { type: 'SET_NOTES'; payload: CalendarNote[] };

/** Theme context value */
export interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

/** Holiday definition for constants */
export interface HolidayDefinition {
  /** Month (1-12) */
  month: number;
  /** Day of month (1-31) */
  day: number;
  /** Name of the holiday */
  name: string;
}

/** Month image configuration */
export interface MonthImageConfig {
  /** URL of the hero image */
  url: string;
  /** Alt text for the image */
  alt: string;
  /** Accent color for this month */
  accentColor: string;
}
