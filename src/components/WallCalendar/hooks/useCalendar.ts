// ── useCalendar.ts ──────────────────────────────────────────────

import { useReducer, useMemo, useCallback, useEffect } from 'react';
import type {
  CalendarState,
  CalendarAction,
  CalendarDay,
  DateString,
} from '../types/calendar.types';
import { generateCalendarDays, fromDateString, toDateString } from '../utils/calendarUtils';
import { WEEK_HEADERS, NOTES_STORAGE_KEY, THEME_STORAGE_KEY } from '../constants/calendar.constants';
import { isBefore } from 'date-fns';

/**
 * Safely reads from localStorage, returning null on failure.
 * Handles SSR environments and storage errors gracefully.
 */
function safeGetStorage<T>(key: string): T | null {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Safely writes to localStorage.
 * Handles SSR environments and quota errors gracefully.
 */
function safeSetStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail — localStorage may be full or unavailable
  }
}

/**
 * Creates the initial state for the calendar reducer.
 * Derives current month/year from the system date.
 * Loads persisted notes and theme from localStorage.
 */
function createInitialState(): CalendarState {
  const now = new Date();
  const savedNotes = safeGetStorage<CalendarState['notes']>(NOTES_STORAGE_KEY);
  const savedTheme = safeGetStorage<'light' | 'dark'>(THEME_STORAGE_KEY);

  return {
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
    selectedRange: { start: null, end: null },
    notes: savedNotes ?? [],
    theme: savedTheme ?? 'light',
    activeNoteId: null,
  };
}

/**
 * Pure reducer function handling all CalendarAction types.
 * Follows the state machine pattern for date range selection:
 *   Click 1 → sets rangeStart
 *   Click 2 → sets rangeEnd (auto-swaps if end < start)
 *   Click 3 → resets and sets new rangeStart
 */
function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'NEXT_MONTH': {
      const nextMonth = state.currentMonth === 11 ? 0 : state.currentMonth + 1;
      const nextYear = state.currentMonth === 11 ? state.currentYear + 1 : state.currentYear;
      return {
        ...state,
        currentMonth: nextMonth,
        currentYear: nextYear,
        selectedRange: { start: null, end: null },
      };
    }

    case 'PREV_MONTH': {
      const prevMonth = state.currentMonth === 0 ? 11 : state.currentMonth - 1;
      const prevYear = state.currentMonth === 0 ? state.currentYear - 1 : state.currentYear;
      return {
        ...state,
        currentMonth: prevMonth,
        currentYear: prevYear,
        selectedRange: { start: null, end: null },
      };
    }

    case 'SELECT_DATE': {
      const { start, end } = state.selectedRange;
      const clickedDate = action.payload;

      // State machine: Click 1 → set start
      if (!start) {
        return {
          ...state,
          selectedRange: { start: clickedDate, end: null },
        };
      }

      // State machine: Click 2 → set end (or swap if needed)
      if (start && !end) {
        const startDate = fromDateString(start);
        const clickDate = fromDateString(clickedDate);

        // If same day clicked → single day selection
        if (start === clickedDate) {
          return {
            ...state,
            selectedRange: { start: clickedDate, end: clickedDate },
          };
        }

        // Auto-swap if clicked date is before start
        if (isBefore(clickDate, startDate)) {
          return {
            ...state,
            selectedRange: { start: clickedDate, end: start },
          };
        }

        return {
          ...state,
          selectedRange: { start, end: clickedDate },
        };
      }

      // State machine: Click 3 → reset and set new start
      return {
        ...state,
        selectedRange: { start: clickedDate, end: null },
      };
    }

    case 'ADD_NOTE': {
      const newNote = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const updatedNotes = [...state.notes, newNote];
      return {
        ...state,
        notes: updatedNotes,
      };
    }

    case 'DELETE_NOTE': {
      const filteredNotes = state.notes.filter((n) => n.id !== action.payload);
      return {
        ...state,
        notes: filteredNotes,
      };
    }

    case 'SET_THEME': {
      return {
        ...state,
        theme: action.payload,
      };
    }

    case 'RESET_RANGE': {
      return {
        ...state,
        selectedRange: { start: null, end: null },
      };
    }

    case 'SET_NOTES': {
      return {
        ...state,
        notes: action.payload,
      };
    }

    default:
      return state;
  }
}

/**
 * Main calendar state machine hook.
 * Manages all calendar state via useReducer and provides computed values.
 *
 * @returns Object containing state, dispatch, computed calendarDays, and weekHeaders
 */
export function useCalendar() {
  const [state, dispatch] = useReducer(calendarReducer, undefined, createInitialState);

  // Persist notes to localStorage whenever they change
  useEffect(() => {
    safeSetStorage(NOTES_STORAGE_KEY, state.notes);
  }, [state.notes]);

  // Persist theme to localStorage whenever it changes
  useEffect(() => {
    safeSetStorage(THEME_STORAGE_KEY, state.theme);
  }, [state.theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Memoized calendar days computation — only recalculates when dependencies change
  const calendarDays: CalendarDay[] = useMemo(
    () =>
      generateCalendarDays(
        state.currentMonth,
        state.currentYear,
        state.selectedRange,
        state.notes
      ),
    [state.currentMonth, state.currentYear, state.selectedRange, state.notes]
  );

  const weekHeaders = useMemo(() => [...WEEK_HEADERS], []);

  const selectDate = useCallback(
    (date: DateString) => {
      dispatch({ type: 'SELECT_DATE', payload: date });
    },
    [dispatch]
  );

  const nextMonth = useCallback(() => {
    dispatch({ type: 'NEXT_MONTH' });
  }, [dispatch]);

  const prevMonth = useCallback(() => {
    dispatch({ type: 'PREV_MONTH' });
  }, [dispatch]);

  const resetRange = useCallback(() => {
    dispatch({ type: 'RESET_RANGE' });
  }, [dispatch]);

  const toggleTheme = useCallback(() => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === 'light' ? 'dark' : 'light',
    });
  }, [state.theme, dispatch]);

  return {
    state,
    dispatch,
    calendarDays,
    weekHeaders,
    selectDate,
    nextMonth,
    prevMonth,
    resetRange,
    toggleTheme,
  };
}

export { toDateString };
