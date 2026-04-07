// ── CalendarHeader.tsx ──────────────────────────────────────────────

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONTH_NAMES, SPIRAL_COIL_COUNT } from './constants/calendar.constants';
import { getMonthImage, preloadImage } from './utils/imageUtils';

interface CalendarHeaderProps {
  /** Current month index (0-11) */
  month: number;
  /** Current year */
  year: number;
  /** Direction of navigation for animation: 1 = forward, -1 = backward */
  direction: number;
}

/**
 * Calendar header component featuring:
 * - Decorative spiral binding (CSS circles simulating metal coils)
 * - Full-bleed hero image with diagonal chevron clip-path
 * - Month + Year badge overlaid on a blue geometric polygon
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  month,
  year,
  direction,
}) => {
  const monthImage = getMonthImage(month);
  const monthName = MONTH_NAMES[month];

  // Preload adjacent month images for smoother transitions
  useMemo(() => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    preloadImage(getMonthImage(prevMonth).url).catch(() => {});
    preloadImage(getMonthImage(nextMonth).url).catch(() => {});
  }, [month]);

  // Generate spiral coils
  const spiralCoils = useMemo(
    () =>
      Array.from({ length: SPIRAL_COIL_COUNT }, (_, i) => (
        <div key={i} className="cal-spiral__coil" aria-hidden="true" />
      )),
    []
  );

  const variants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="cal-header">
      {/* Spiral Binding */}
      <div className="cal-spiral" aria-hidden="true">
        {spiralCoils}
      </div>

      {/* Hero Image with Chevron Clip */}
      <div className="cal-header__hero-wrapper">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${month}-${year}`}
            className="cal-header__hero"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ perspective: '1200px' }}
          >
            <img
              src={monthImage.url}
              alt={monthImage.alt}
              className="cal-header__hero-image"
              loading="lazy"
              width={480}
              height={260}
            />

            {/* Month + Year Badge */}
            <div className="cal-header__badge">
              <span className="cal-header__badge-year">{year}</span>
              <span className="cal-header__badge-month">{monthName.toUpperCase()}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
