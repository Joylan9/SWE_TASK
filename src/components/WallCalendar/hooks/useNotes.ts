// ── useNotes.ts ──────────────────────────────────────────────

import { useCallback } from 'react';
import type { CalendarAction, CalendarNote, DateRange } from '../types/calendar.types';
import { formatDateRange } from '../utils/calendarUtils';

/**
 * Hook for notes CRUD operations.
 * Wraps dispatch actions for adding and deleting notes,
 * and provides computed label text for the notes panel.
 *
 * @param dispatch - Calendar reducer dispatch function
 * @param notes - Current array of all notes
 * @param selectedRange - Currently selected date range
 * @param currentMonth - Currently displayed month (0-11)
 * @param currentYear - Currently displayed year
 * @returns Object with CRUD functions and computed values
 */
export function useNotes(
  dispatch: React.Dispatch<CalendarAction>,
  notes: CalendarNote[],
  selectedRange: DateRange,
  currentMonth: number,
  currentYear: number
) {
  /**
   * Adds a new note. If a range is selected, the note is tagged to that range.
   * Otherwise, it's a general monthly note.
   */
  const addNote = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      dispatch({
        type: 'ADD_NOTE',
        payload: {
          rangeStart: selectedRange.start,
          rangeEnd: selectedRange.end,
          content: content.trim(),
          month: currentMonth,
          year: currentYear,
        },
      });
    },
    [dispatch, selectedRange.start, selectedRange.end, currentMonth, currentYear]
  );

  /** Deletes a note by its ID */
  const deleteNote = useCallback(
    (noteId: string) => {
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
    },
    [dispatch]
  );

  /** Notes filtered to the current month */
  const monthNotes = notes.filter(
    (note) => note.month === currentMonth && note.year === currentYear
  );

  /** Label text for the notes textarea */
  const notesLabel: string = selectedRange.start
    ? `Note for ${formatDateRange(selectedRange.start, selectedRange.end)}`
    : 'Notes';

  return {
    addNote,
    deleteNote,
    monthNotes,
    notesLabel,
  };
}
