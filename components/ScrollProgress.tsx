'use client';

import React, { useEffect, useRef } from 'react';
import { scrollProgress, isReducedMotion } from '@/lib/motion';

/**
 * 2px Reishi Fixed Scroll Progress Bar
 * 
 * - Fixed to the very top edge of the viewport
 * - High z-index (z-[60]) positioned above navbar
 * - Scales along the X-axis without layout reads
 * - Hidden when reduced motion is preferred
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isReducedMotion() || !barRef.current) return;
    const cleanup = scrollProgress(barRef.current);
    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none overflow-hidden"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-reishi origin-left will-change-transform shadow-[0_0_12px_rgba(143,211,255,0.4)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
