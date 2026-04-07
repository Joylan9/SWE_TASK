# 🗓 Wall Calendar — Interactive React Component

A production-grade, interactive Wall Calendar built as a React component. Inspired by physical wall calendars with spiral binding, hero imagery, and clean grid layouts — fully reimagined as an interactive digital experience.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?logo=vitest&logoColor=white)

---

## ✨ Features

### Core Calendar
- **Wall Calendar Aesthetic** — Decorative spiral binding, full-bleed hero images with diagonal chevron clip-path, Month+Year badge on a blue geometric polygon
- **Date Grid** — ISO week standard (Monday start), SAT/SUN weekend accents, overflow date rendering, today highlighting
- **Month Navigation** — Animated page-flip transitions via Framer Motion with hero image changes per month
- **Keyboard Navigation** — Full arrow-key navigation across the date grid

### Date Range Selection
- **Three-click state machine** — Click 1 sets start, Click 2 sets end (auto-swaps if before start), Click 3 resets
- **Visual states** — idle, range-start (left pill), range-end (right pill), range-middle (fill), single-day (circle)
- **Hover preview** — Ghost/preview range shown while hovering after start selection
- **Touch support** — Same selection logic works on touch devices

### Notes System
- **Range-tagged notes** — Notes attached to selected date ranges (or general monthly notes)
- **Ruled lines** — CSS `repeating-linear-gradient` simulates notebook paper
- **CRUD operations** — Add, view, and delete notes
- **localStorage persistence** — All notes saved under `wall-calendar-notes` key

### Theme System
- **Light & Dark modes** — Full theme switching with CSS custom properties
- **Persistent preference** — Theme saved to localStorage
- **Smooth transitions** — All theme changes animate smoothly

### Bonus Features
- **🇮🇳 Holiday Markers** — Indian public holidays marked with colored dots (Republic Day, Independence Day, Diwali, etc.)
- **🎨 Month Color Theming** — Pre-mapped accent colors per month matching seasonal hero imagery
- **🖨 Print Stylesheet** — Clean, ink-friendly `@media print` CSS (no shadows, hidden UI controls)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2 | UI framework (functional components + hooks) |
| TypeScript | 6.0 (strict mode) | Type safety |
| Tailwind CSS | 4.2 | Utility classes for layout/spacing |
| date-fns | 4.1 | Date manipulation (no native Date math) |
| Framer Motion | 12.x | Page-flip animations and transitions |
| lucide-react | 1.7 | Icon system (ChevronLeft/Right, Sun/Moon, Trash2, etc.) |
| Vite | 8.0 | Build tool and dev server |
| Vitest | 4.1 | Test runner |
| React Testing Library | 16.x | Component testing |

---

## 📁 Project Structure

```
src/
├── components/
│   └── WallCalendar/
│       ├── index.tsx                  # Public barrel export
│       ├── WallCalendar.tsx           # Root orchestrator component
│       ├── WallCalendar.test.tsx      # 10 test cases (Vitest + RTL)
│       ├── CalendarHeader.tsx         # Spiral binding + hero image + month badge
│       ├── CalendarGrid.tsx           # 7-column date grid with keyboard nav
│       ├── CalendarDay.tsx            # Atomic day cell (React.memo optimized)
│       ├── NotesPanel.tsx             # Notes textarea + saved notes list
│       ├── MonthNavigator.tsx         # Prev/Next month arrow controls
│       ├── ThemeToggle.tsx            # Light/Dark theme switcher
│       ├── hooks/
│       │   ├── useCalendar.ts         # Calendar state machine (useReducer)
│       │   ├── useDateRange.ts        # Hover preview range logic
│       │   └── useNotes.ts            # Notes CRUD + localStorage
│       ├── utils/
│       │   ├── calendarUtils.ts       # Pure date helper functions (date-fns)
│       │   └── imageUtils.ts          # Month-to-image mapping + preloading
│       ├── types/
│       │   └── calendar.types.ts      # All TypeScript interfaces/types
│       └── constants/
│           └── calendar.constants.ts  # Month images, holidays, colors
├── App.tsx                            # Application entry
├── main.tsx                           # React DOM mount
└── index.css                          # Design tokens + global styles
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/Joylan9/SWE_TASK.git
cd SWE_TASK
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Test Coverage (10 test cases)

| # | Test | Description |
|---|------|-------------|
| 1 | Renders current month/year | Component initializes with system date |
| 2 | Date selection as range start | Clicking a date sets `aria-selected=true` |
| 3 | Two-date range creation | Verifies start/middle/end states |
| 4 | Single-day selection | Same date clicked twice → `single` state |
| 5 | Third click resets range | State machine resets and starts new selection |
| 6 | Note creation + persistence | Adds note to list and calls localStorage |
| 7 | Note deletion | Removes note from DOM and storage |
| 8 | Month navigation | Next month button updates the label |
| 9 | Range auto-swap | End < Start → automatically swapped |
| 10 | Aria labels validation | Every day cell has a valid `aria-label` |

---

## 🎨 Design Decisions

### Why `useReducer` over `useState`?
The calendar has complex interdependent state (month, year, selected range, notes, theme). A reducer pattern gives us:
- A **pure function** that's easy to test
- A **single source of truth** for all calendar state
- A clear **action-based API** that documents all possible state transitions
- Prevents impossible state combinations (e.g., range end without start)

### Why `date-fns`?
- Tree-shakeable (import only what you use, unlike Moment.js)
- Pure functions (no mutating Date objects)
- Full TypeScript support
- ISO week standard support (week starts Monday)

### Why CSS Custom Properties for theming?
- Zero JS overhead for theme switching — just change a `data-theme` attribute
- All color values defined once, referenced everywhere
- Easy to add new themes (e.g., sepia, high-contrast)
- No flash of wrong theme on page load (works with SSR)

### Why `React.memo` with custom comparator?
The calendar grid has 42 cells. Without memoization, changing any parent state re-renders all 42 cells. The custom `areEqual` comparator ensures cells only re-render when their visual state actually changes (rangeState, isToday, notes count).

### Clip-path approach
The diagonal chevron cut on the hero image uses `clip-path: polygon()` for a crisp, performant, resolution-independent visual effect without image masking or SVG overlays.

---

## ♿ Accessibility (WCAG 2.1 AA)

- **Keyboard navigation** — Arrow keys traverse the date grid; Enter/Space selects dates
- **Focus visible** — All focusable elements have visible focus rings
- **Semantic roles** — `role="grid"` on calendar, `role="gridcell"` on each day, `role="columnheader"` on week headers
- **ARIA attributes** — `aria-selected` on selected dates, `aria-label` on icon-only buttons, `aria-live="polite"` for range announcements
- **Color contrast** — All text meets ≥ 4.5:1 ratio against backgrounds
- **Touch targets** — Minimum 44×44px on mobile (WCAG 2.5.5)

---

## 📱 Responsive Behavior

| Breakpoint | Layout |
|-----------|--------|
| ≥768px (Desktop) | Full card: hero on top, grid + notes side by side, max-width 480px centered |
| <768px (Mobile) | Notes stacks below grid, hero height reduced, 44×44px touch targets, swipe navigation |

---

## 🔮 Future Improvements

- **Event chips** — Single-day event labels rendered as colored chips on date cells
- **Drag-to-select range** — Click and drag across dates for faster range selection
- **Multi-month view** — Side-by-side current + next month on wide screens
- **Recurring notes** — Weekly/monthly repeating note support
- **Export to PNG** — Download calendar as image using `html-to-image`
- **i18n support** — Locale-aware month names, week start day, and RTL layout
- **Sync backend** — Optional REST/GraphQL sync for cross-device notes
- **Animation preferences** — Respect `prefers-reduced-motion` media query
- **Customizable holidays** — User-configurable holiday lists beyond Indian defaults

---

## 📄 License

MIT
