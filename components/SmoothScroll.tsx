'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { isReducedMotion } from '@/lib/motion';

interface SmoothScrollContextType {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: Parameters<Lenis['scrollTo']>[1]
  ) => void;
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  scrollTo: () => {},
  lenis: null,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/**
 * Lenis Smooth Scroll Provider
 * 
 * - lerp: 0.1, wheelMultiplier: 1, autoRaf: true
 * - Disabled on reduced motion or coarse pointer (touch devices)
 * - Exposes scrollTo(target) helper context
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disabled on reduced motion or touch pointers
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isReducedMotion() || isTouch) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      autoRaf: true,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: Parameters<Lenis['scrollTo']>[1]
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, lenis: lenisRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
