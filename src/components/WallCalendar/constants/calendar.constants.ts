// ── calendar.constants.ts ──────────────────────────────────────────

import type { HolidayDefinition, MonthImageConfig } from '../types/calendar.types';

/** Full month names */
export const MONTH_NAMES: readonly string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Short month names for compact display */
export const MONTH_NAMES_SHORT: readonly string[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** Week day headers starting from Monday (ISO standard) */
export const WEEK_HEADERS: readonly string[] = [
  'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN',
] as const;

/** Number of spiral coils displayed at the top of the calendar */
export const SPIRAL_COIL_COUNT = 15;

/** localStorage key for persisting notes */
export const NOTES_STORAGE_KEY = 'wall-calendar-notes';

/** localStorage key for persisting theme preference */
export const THEME_STORAGE_KEY = 'wall-calendar-theme';

/**
 * Indian public holidays (fixed-date holidays).
 * Approximate dates used for festivals with variable dates.
 */
export const HOLIDAYS: readonly HolidayDefinition[] = [
  { month: 1, day: 1, name: "New Year's Day" },
  { month: 1, day: 26, name: 'Republic Day' },
  { month: 3, day: 8, name: "Maha Shivaratri" },
  { month: 3, day: 25, name: 'Holi' },
  { month: 4, day: 6, name: 'Ugadi' },
  { month: 4, day: 10, name: 'Ram Navami' },
  { month: 4, day: 14, name: 'Ambedkar Jayanti' },
  { month: 4, day: 18, name: 'Good Friday' },
  { month: 5, day: 1, name: 'May Day' },
  { month: 5, day: 12, name: 'Buddha Purnima' },
  { month: 6, day: 27, name: 'Eid ul-Fitr' },
  { month: 7, day: 6, name: 'Rath Yatra' },
  { month: 8, day: 9, name: 'Muharram' },
  { month: 8, day: 15, name: 'Independence Day' },
  { month: 8, day: 16, name: 'Janmashtami' },
  { month: 9, day: 5, name: "Teachers' Day" },
  { month: 9, day: 17, name: 'Milad-un-Nabi' },
  { month: 10, day: 2, name: 'Gandhi Jayanti' },
  { month: 10, day: 2, name: 'Dussehra' },
  { month: 10, day: 20, name: 'Diwali' },
  { month: 10, day: 21, name: 'Diwali (Day 2)' },
  { month: 11, day: 1, name: 'Govardhan Puja' },
  { month: 11, day: 5, name: 'Guru Nanak Jayanti' },
  { month: 11, day: 15, name: "Children's Day" },
  { month: 12, day: 25, name: 'Christmas Day' },
] as const;

/**
 * Hero images for each month — high-quality Unsplash photos.
 * Each month features a nature/landscape theme appropriate to the season.
 * Accent colors are pre-mapped per month for the Month Color Theming bonus feature.
 */
export const MONTH_IMAGES: readonly MonthImageConfig[] = [
  {
    url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&w=800&q=80',
    alt: 'Snow-covered mountain landscape in winter',
    accentColor: '#4A90D9',
  },
  {
    url: 'https://images.unsplash.com/photo-1457269449834-928af64c684d?auto=format&w=800&q=80',
    alt: 'Frost-covered branches in late winter',
    accentColor: '#6B8FB5',
  },
  {
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?auto=format&w=800&q=80',
    alt: 'Cherry blossoms blooming in spring',
    accentColor: '#E8919A',
  },
  {
    url: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?auto=format&w=800&q=80',
    alt: 'Green meadow with wildflowers in April',
    accentColor: '#5DAE5F',
  },
  {
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&w=800&q=80',
    alt: 'Lush green forest canopy in spring',
    accentColor: '#4CAF50',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=800&q=80',
    alt: 'Tropical beach with turquoise water in summer',
    accentColor: '#29ABE2',
  },
  {
    url: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&w=800&q=80',
    alt: 'Golden sunset over lavender fields',
    accentColor: '#9B59B6',
  },
  {
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&w=800&q=80',
    alt: 'Sunflower field under blue summer sky',
    accentColor: '#F4A623',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&w=800&q=80',
    alt: 'Early autumn foliage with warm tones',
    accentColor: '#D4763C',
  },
  {
    url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&w=800&q=80',
    alt: 'Vibrant autumn leaves reflecting in a lake',
    accentColor: '#E67E22',
  },
  {
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&w=800&q=80',
    alt: 'Misty mountain path in late autumn',
    accentColor: '#8E6E53',
  },
  {
    url: 'https://images.unsplash.com/photo-1482003297000-b7f3a8c36a97?auto=format&w=800&q=80',
    alt: 'Cozy winter scene with snow-laden pines',
    accentColor: '#3498DB',
  },
] as const;

/** Number of rows in the calendar grid (always 6 to maintain consistent height) */
export const GRID_ROWS = 6;

/** Number of columns in the calendar grid */
export const GRID_COLS = 7;

/** Total cells in the calendar grid */
export const TOTAL_CELLS = GRID_ROWS * GRID_COLS;
