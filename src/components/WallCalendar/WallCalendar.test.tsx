// ── WallCalendar.test.tsx ──────────────────────────────────────────

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WallCalendar } from './WallCalendar';
import { MONTH_NAMES } from './constants/calendar.constants';

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const filteredProps: Record<string, unknown> = {};
      for (const key of Object.keys(props)) {
        if (
          !['initial', 'animate', 'exit', 'variants', 'custom', 'transition', 'whileHover', 'whileTap'].includes(key)
        ) {
          filteredProps[key] = props[key];
        }
      }
      return <div {...filteredProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => `test-uuid-${Date.now()}-${Math.random()}`),
  },
});

describe('WallCalendar', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Renders current month name and year by default.
   * Verifies the component initializes with the system date.
   */
  it('renders current month name and year by default', () => {
    render(<WallCalendar />);
    const now = new Date();
    const expectedMonth = MONTH_NAMES[now.getMonth()];
    const expectedYear = now.getFullYear().toString();

    expect(screen.getByText(expectedMonth)).toBeInTheDocument();
    const yearElements = screen.getAllByText(expectedYear);
    expect(yearElements.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * TEST 2: Clicking a date selects it as range start.
   * Verifies the day cell receives aria-selected="true".
   */
  it('clicking a date selects it as range start', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    // Find a day button in the current month (e.g., "15")
    const dayButtons = screen.getAllByRole('gridcell');
    const day15 = dayButtons.find(
      (btn) => btn.textContent?.trim() === '15' && !btn.classList.contains('cal-day--overflow')
    );

    expect(day15).toBeDefined();
    if (day15) {
      await user.click(day15);
      expect(day15.getAttribute('aria-selected')).toBe('true');
    }
  });

  /**
   * TEST 3: Clicking a second date after start sets correct range.
   * Verifies middle cells exist between start and end.
   */
  it('clicking two dates creates a range with middle cells', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    const dayButtons = screen.getAllByRole('gridcell');
    const currentMonthDays = dayButtons.filter(
      (btn) => !btn.classList.contains('cal-day--overflow')
    );

    // Click day 5
    const day5 = currentMonthDays.find((btn) => btn.textContent?.trim() === '5');
    // Click day 10
    const day10 = currentMonthDays.find((btn) => btn.textContent?.trim() === '10');

    if (day5 && day10) {
      await user.click(day5);
      await user.click(day10);

      // Day 5 should be start, day 10 should be end
      expect(day5.classList.contains('cal-day--start')).toBe(true);
      expect(day10.classList.contains('cal-day--end')).toBe(true);

      // Days in between should be middle
      const day7 = currentMonthDays.find((btn) => btn.textContent?.trim() === '7');
      if (day7) {
        expect(day7.classList.contains('cal-day--middle')).toBe(true);
      }
    }
  });

  /**
   * TEST 4: Clicking same date twice results in single-day selection.
   */
  it('clicking same date twice results in single-day selection', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    const dayButtons = screen.getAllByRole('gridcell');
    const day15 = dayButtons.find(
      (btn) => btn.textContent?.trim() === '15' && !btn.classList.contains('cal-day--overflow')
    );

    if (day15) {
      await user.click(day15);
      await user.click(day15);
      expect(day15.classList.contains('cal-day--single')).toBe(true);
    }
  });

  /**
   * TEST 5: Clicking a third date resets range and sets new start.
   */
  it('clicking third date resets range and sets new start', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    const dayButtons = screen.getAllByRole('gridcell');
    const currentMonthDays = dayButtons.filter(
      (btn) => !btn.classList.contains('cal-day--overflow')
    );

    const day5 = currentMonthDays.find((btn) => btn.textContent?.trim() === '5');
    const day10 = currentMonthDays.find((btn) => btn.textContent?.trim() === '10');
    const day20 = currentMonthDays.find((btn) => btn.textContent?.trim() === '20');

    if (day5 && day10 && day20) {
      // Select range 5-10
      await user.click(day5);
      await user.click(day10);

      // Click 20 — should reset and make 20 the new start
      await user.click(day20);

      expect(day5.getAttribute('aria-selected')).toBe('false');
      expect(day10.getAttribute('aria-selected')).toBe('false');
      expect(day20.getAttribute('aria-selected')).toBe('true');
    }
  });

  /**
   * TEST 6: Adding a note saves to localStorage and renders in notes list.
   */
  it('adding a note saves and renders in notes list', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText(/write a note/i);
    const addBtn = screen.getByRole('button', { name: /add note/i });

    await user.type(textarea, 'Test note content');
    await user.click(addBtn);

    // Verify note appears in the list
    expect(screen.getByText('Test note content')).toBeInTheDocument();

    // Verify localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'wall-calendar-notes',
      expect.any(String)
    );
  });

  /**
   * TEST 7: Deleting a note removes it from rendered list.
   */
  it('deleting a note removes it from rendered list', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    // Add a note first
    const textarea = screen.getByPlaceholderText(/write a note/i);
    const addBtn = screen.getByRole('button', { name: /add note/i });

    await user.type(textarea, 'Note to delete');
    await user.click(addBtn);

    expect(screen.getByText('Note to delete')).toBeInTheDocument();

    // Find and click delete button
    const deleteBtn = screen.getByRole('button', { name: /delete note/i });
    await user.click(deleteBtn);

    // Note should be gone
    expect(screen.queryByText('Note to delete')).not.toBeInTheDocument();
  });

  /**
   * TEST 8: Navigating to next month updates month label.
   */
  it('navigating to next month updates month label', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    const now = new Date();
    const currentMonth = MONTH_NAMES[now.getMonth()];
    const nextMonthIndex = (now.getMonth() + 1) % 12;
    const nextMonthName = MONTH_NAMES[nextMonthIndex];

    // Verify current month is displayed
    expect(screen.getByText(currentMonth)).toBeInTheDocument();

    // Click next month button
    const nextBtn = screen.getByRole('button', { name: /next month/i });
    await user.click(nextBtn);

    // Verify next month is now displayed
    expect(screen.getByText(nextMonthName)).toBeInTheDocument();
  });

  /**
   * TEST 9: Range swaps correctly when end date < start date.
   */
  it('range swaps when end date is before start date', async () => {
    render(<WallCalendar />);
    const user = userEvent.setup();

    const dayButtons = screen.getAllByRole('gridcell');
    const currentMonthDays = dayButtons.filter(
      (btn) => !btn.classList.contains('cal-day--overflow')
    );

    const day20 = currentMonthDays.find((btn) => btn.textContent?.trim() === '20');
    const day10 = currentMonthDays.find((btn) => btn.textContent?.trim() === '10');

    if (day20 && day10) {
      // Click 20 first (start), then 10 (before start)
      await user.click(day20);
      await user.click(day10);

      // After swap: 10 should be start, 20 should be end
      expect(day10.classList.contains('cal-day--start')).toBe(true);
      expect(day20.classList.contains('cal-day--end')).toBe(true);
    }
  });

  /**
   * TEST 10: All day cells have valid aria-label attributes.
   */
  it('all day cells have valid aria-label attributes', () => {
    render(<WallCalendar />);

    const dayButtons = screen.getAllByRole('gridcell');

    dayButtons.forEach((btn) => {
      const ariaLabel = btn.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel!.length).toBeGreaterThan(0);
    });
  });
});
