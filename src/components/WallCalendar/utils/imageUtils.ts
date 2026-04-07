// ── imageUtils.ts ──────────────────────────────────────────────

import { MONTH_IMAGES } from '../constants/calendar.constants';
import type { MonthImageConfig } from '../types/calendar.types';

/**
 * Returns the image configuration for a given month.
 * @param monthIndex - Month index (0-11)
 * @returns The MonthImageConfig for the specified month
 */
export function getMonthImage(monthIndex: number): MonthImageConfig {
  const safeIndex = ((monthIndex % 12) + 12) % 12;
  return MONTH_IMAGES[safeIndex];
}

/**
 * Returns the accent color for a given month.
 * Used for the Month Color Theming bonus feature.
 * @param monthIndex - Month index (0-11)
 * @returns Hex color string
 */
export function getMonthAccentColor(monthIndex: number): string {
  return getMonthImage(monthIndex).accentColor;
}

/**
 * Preloads an image by creating an Image element.
 * Useful for preloading adjacent month images for smoother transitions.
 * @param url - URL of the image to preload
 * @returns Promise that resolves when the image loads
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}
