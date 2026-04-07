// ── WallCalendar.tsx ──────────────────────────────────────────────

import React, { useState, useCallback, createContext, useContext, useRef } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';
import { MonthNavigator } from './MonthNavigator';
import { ThemeToggle } from './ThemeToggle';
import { useCalendar } from './hooks/useCalendar';
import { useDateRange } from './hooks/useDateRange';
import { useNotes } from './hooks/useNotes';
import type { ThemeContextValue, DateString } from './types/calendar.types';
import { formatDateRange } from './utils/calendarUtils';

/** Theme context for propagating theme to child components */
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

/** Hook to access the theme context */
export const useTheme = (): ThemeContextValue => useContext(ThemeContext);

/**
 * Root orchestrator component for the Wall Calendar.
 *
 * Composes all sub-components:
 * - CalendarHeader (spiral + hero + month badge)
 * - MonthNavigator (prev/next controls)
 * - CalendarGrid (date grid with range selection)
 * - NotesPanel (notes textarea + saved notes)
 * - ThemeToggle (light/dark switch)
 *
 * Manages global calendar state via useCalendar hook (useReducer pattern).
 * Provides ThemeContext for child components.
 */
export const WallCalendar: React.FC = () => {
  const {
    state,
    dispatch,
    calendarDays,
    weekHeaders,
    selectDate,
    nextMonth,
    prevMonth,
    toggleTheme,
  } = useCalendar();

  const { isDateInHoverRange, onDateHover, onDateHoverEnd } = useDateRange(
    state.selectedRange.start,
    state.selectedRange.end
  );

  const { addNote, deleteNote, monthNotes, notesLabel } = useNotes(
    dispatch,
    state.notes,
    state.selectedRange,
    state.currentMonth,
    state.currentYear
  );

  // Track navigation direction for page-flip animation
  const [direction, setDirection] = useState(0);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    nextMonth();
  }, [nextMonth]);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    prevMonth();
  }, [prevMonth]);

  // Touch/swipe handling for mobile month navigation
  const touchStartX = useRef<number>(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      // Minimum swipe distance: 50px
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNextMonth();
        } else {
          handlePrevMonth();
        }
      }
    },
    [handleNextMonth, handlePrevMonth]
  );

  const handleSelectDate = useCallback(
    (date: DateString) => {
      selectDate(date);
    },
    [selectDate]
  );

  // Format selected range for screen reader announcements
  const rangeAnnouncement = state.selectedRange.start
    ? `Selected range: ${formatDateRange(state.selectedRange.start, state.selectedRange.end)}`
    : 'No date range selected';

  return (
    <ThemeContext.Provider value={{ theme: state.theme, toggleTheme }}>
      <div className="cal-page" data-theme={state.theme}>
        <div className="cal-card">
          {/* Theme Toggle — top right corner */}
          <div className="cal-card__toolbar">
            <ThemeToggle theme={state.theme} onToggle={toggleTheme} />
          </div>

          {/* Header: Spiral + Hero + Badge */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <CalendarHeader
              month={state.currentMonth}
              year={state.currentYear}
              direction={direction}
            />
          </div>

          {/* Month Navigation */}
          <MonthNavigator
            month={state.currentMonth}
            year={state.currentYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* Main Content: Notes + Grid side by side on desktop, stacked on mobile */}
          <div className="cal-card__body">
            {/* Notes Panel */}
            <NotesPanel
              label={notesLabel}
              notes={monthNotes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />

            {/* Date Grid */}
            <CalendarGrid
              calendarDays={calendarDays}
              weekHeaders={weekHeaders}
              onSelectDate={handleSelectDate}
              isDateInHoverRange={isDateInHoverRange}
              onDateHover={onDateHover}
              onDateHoverEnd={onDateHoverEnd}
            />
          </div>

          {/* Screen reader announcements */}
          <div
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
            role="status"
          >
            {rangeAnnouncement}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
