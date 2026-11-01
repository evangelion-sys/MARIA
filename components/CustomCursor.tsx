'use client';

import React, { useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '@/lib/motion';

/**
 * Custom Precision Cursor Overlay (Bleach TYBW Aizen & Yhwach aesthetic)
 * 
 * - 6px bone dot follows the pointer instantly.
 * - 14px reishi ring lags smoothly behind with transform-only interpolation.
 * - Over interactive elements (a, button, [role="button"]), the ring expands to 40px with mix-blend difference.
 * - Hidden on touch devices, hidden in modal text inputs, disabled under prefers-reduced-motion.
 * - System cursor stays visible (never cursor: none).
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only enabled for desktop fine pointers and when reduced motion is not preferred
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer || isReducedMotion()) return;

    setEnabled(true);

    let isRunning = false;

    // Smooth lag loop for the outer reishi ring, pauses when settled
    const renderLoop = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        ringPos.current.x += dx * 0.22;
        ringPos.current.y += dy * 0.22;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
        }

        rafId.current = requestAnimationFrame(renderLoop);
      } else {
        isRunning = false;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId.current = requestAnimationFrame(renderLoop);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }

      startLoop();

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, [role="button"], summary, [role="switch"]')
        );
        setIsHovered(isInteractive);

        // Hide cursor ring when typing inside inputs
        const isTextInput = Boolean(
          target.closest('input[type="text"], input[type="search"], textarea')
        );
        setIsHidden(isTextInput);
      }
    };

    const onMouseLeave = () => {
      setIsHidden(true);
    };

    const onMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    startLoop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* 6px Bone Dot (Instant pointer tracking) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-bone pointer-events-none z-[110] will-change-transform transition-opacity duration-150 ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Lagging Reishi Ring (14px default -> 40px on interactive elements with mix-blend-difference) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[110] will-change-transform rounded-full border transition-all duration-200 ease-out ${
          isHovered
            ? 'w-10 h-10 border-reishi bg-reishi/10 mix-blend-difference'
            : 'w-3.5 h-3.5 border-reishi/70 bg-transparent'
        } ${isHidden ? 'opacity-0' : 'opacity-100'}`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </>
  );
}
