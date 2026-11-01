'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { isReducedMotion } from '@/lib/motion';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

/**
 * Toast Notification (Part 12 specifications):
 * - Bottom-left placement (fixed bottom-6 left-6 z-50)
 * - 6px radius (rounded-[6px]), 1px line border, surface background
 * - Slides in from the left in 250 ms (instant under reduced motion)
 * - Auto-dismiss after 4 seconds (4000 ms)
 * - Pauses countdown on hover
 * - role="status"
 * - Full keyboard accessibility (Escape to dismiss, focusable close button)
 */
export function Toast({ message, onDismiss, duration = 4000 }: ToastProps) {
  const [, setIsHovered] = useState(false);
  const remainingTimeRef = useRef(duration);
  const timerStartRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (time: number) => {
      clearTimer();
      timerStartRef.current = Date.now();
      timeoutIdRef.current = setTimeout(() => {
        onDismiss();
      }, time);
    },
    [clearTimer, onDismiss]
  );

  useEffect(() => {
    if (!message) return;

    remainingTimeRef.current = duration;
    startTimer(duration);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimer();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [message, duration, startTimer, clearTimer, onDismiss]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    clearTimer();
    if (timerStartRef.current) {
      const elapsed = Date.now() - timerStartRef.current;
      remainingTimeRef.current = Math.max(500, remainingTimeRef.current - elapsed);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startTimer(remainingTimeRef.current);
  };

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-6 left-6 z-50 px-4 py-3 rounded-[6px] bg-surface border border-line text-bone text-xs font-mono shadow-2xl flex items-center gap-3 select-none will-change-transform ${
        isReducedMotion() ? '' : 'motion-safe:animate-[slideInLeft_250ms_cubic-bezier(0.16,1,0.3,1)]'
      }`}
    >
      <CheckCircle2 className="w-4 h-4 text-reishi shrink-0" />
      <span className="font-medium text-bone">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 text-ash-600 hover:text-bone p-1 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
