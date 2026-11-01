'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  animate,
  createScope,
  createTimeline,
  stagger,
  splitText,
  scrambleText,
  spring,
  createSpring,
  onScroll,
  Scope,
} from 'animejs';

/**
 * MARIA Centralized Motion Design System Tokens
 * 
 * Aesthetic Principles:
 * - Composure & Precision (Aizen surgical composure)
 * - Controlled Authority (Yhwach monumental scale)
 * - Restraint & Editorial Sophistication
 * - 60fps/120fps Compositor-Only Transitions (transform & opacity exclusively)
 * - Zero artificial layout shifts, zero invasive character-by-character animations
 */
export const MOTION_TOKENS = {
  duration: {
    instant: 120, // Instant feedback: micro-interactions, toggles, button active
    fast: 200, // Fast feedback: hover outlines, tooltips, tags, pill switches
    standard: 350, // Standard transitions: tabs, search dropdowns, filters, grid shifts
    deliberate: 550, // Deliberate reveals: modal overlays, drawer panels, criteria rows
    cinematic: 850, // Cinematic sequences: hero entrance, monumental masthead
  },
  ease: {
    standard: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth balanced interface curve
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)', // Immediate acceleration into smooth deceleration
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)', // Controlled exit curve
    entrance: 'cubic-bezier(0.16, 1, 0.3, 1)', // Yhwach curve: monumental, authoritative deceleration
    yhwach: 'cubic-bezier(0.16, 1, 0.3, 1)', // Alias for monumental entrance
    composed: 'cubic-bezier(0.45, 0, 0.15, 1)', // Aizen curve: surgical, composed transition
    aizen: 'cubic-bezier(0.45, 0, 0.15, 1)', // Alias for surgical composure
    overshoot: 'cubic-bezier(0.34, 1.4, 0.64, 1)', // Subtle elastic recovery only when justified
  },
  displacement: {
    micro: 2, // 2px: title hover shift, hairline tick
    subtle: 6, // 6px: metadata badge, chip indicator
    standard: 16, // 16px: card grid reveal, section row entrance
    monumental: 24, // 24px: major section title reveal
    cinematic: 36, // 36px: full-screen transition displacement
  },
  stagger: {
    text: 25, // Line reveals (ms per line)
    card: 25, // Card batch reveal (ms per card)
    nav: 35, // Navigation links sequence
    section: 80, // Section-level cascade
  },
  intensity: {
    minimal: 0.5,
    standard: 1.0,
    cinematic: 1.4,
  },
} as const;

/**
 * Checks if user prefers reduced motion or if running on server.
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scopes anime.js animations to a DOM subtree and automatically
 * reverts all animations on component unmount or Next.js route change.
 */
export function useMotionScope<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null> | React.MutableRefObject<T | null>
): React.MutableRefObject<Scope | null> {
  const scopeRef = useRef<Scope | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isReducedMotion()) return;

    if (ref.current) {
      scopeRef.current = createScope({ root: ref.current });
    }

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, [pathname, ref]);

  return scopeRef;
}

/**
 * Line-based reveal for editorial headings and block titles.
 * Preserves accessible HTML text and avoids letter fragmentation.
 */
export function splitReveal(
  el: HTMLElement | null,
  opts?: { delay?: number; duration?: number; stagger?: number; chars?: boolean }
) {
  if (!el || isReducedMotion()) return null;

  try {
    if (opts?.chars) {
      const splitter = splitText(el, { chars: true });
      const targets = splitter.chars && splitter.chars.length > 0 ? splitter.chars : [el];
      return animate(targets, {
        opacity: [0, 1],
        translateY: ['80%', '0%'],
        delay: stagger(opts?.stagger ?? MOTION_TOKENS.stagger.nav, { start: opts?.delay ?? 0 }),
        duration: opts?.duration ?? MOTION_TOKENS.duration.deliberate,
        ease: 'outExpo',
      });
    }
    const splitter = splitText(el, { lines: true });
    const targets = splitter.lines && splitter.lines.length > 0 ? splitter.lines : [el];
    return animate(targets, {
      opacity: [0, 1],
      translateY: [MOTION_TOKENS.displacement.monumental, 0],
      delay: stagger(opts?.stagger ?? MOTION_TOKENS.stagger.text, { start: opts?.delay ?? 0 }),
      duration: opts?.duration ?? MOTION_TOKENS.duration.deliberate,
      ease: 'outCubic',
    });
  } catch {
    return animate(el, {
      opacity: [0, 1],
      translateY: [MOTION_TOKENS.displacement.standard, 0],
      duration: opts?.duration ?? MOTION_TOKENS.duration.deliberate,
      ease: 'outQuad',
    });
  }
}

/**
 * Scramble text reveal on monospace labels (default duration 550ms).
 */
export function scrambleIn(el: HTMLElement | null, text?: string, duration = 550) {
  if (!el || isReducedMotion()) return null;

  const targetText = text ?? el.textContent ?? '';
  try {
    return animate(el, {
      textContent: scrambleText({ text: targetText, duration }),
      duration,
      ease: 'linear',
    });
  } catch {
    el.textContent = targetText;
    return null;
  }
}

/**
 * Magnetic button / cursor tracking with spring physics recovery.
 */
export function magnetic(el: HTMLElement | null, strength = 0.2): () => void {
  if (!el || isReducedMotion()) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    animate(el, {
      translateX: relX * strength,
      translateY: relY * strength,
      duration: MOTION_TOKENS.duration.fast,
      ease: 'outQuad',
    });
  };

  const handleMouseLeave = () => {
    animate(el, {
      translateX: 0,
      translateY: 0,
      duration: 600,
      ease: spring ? spring({ bounce: 0.25, duration: 600 }) : 'outElastic(1, .5)',
    });
  };

  el.addEventListener('mousemove', handleMouseMove);
  el.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    el.removeEventListener('mousemove', handleMouseMove);
    el.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Scales a 2px reishi progress bar on the X axis via onScroll without layout reads.
 */
export function scrollProgress(el: HTMLElement | null): () => void {
  if (!el || isReducedMotion()) return () => {};

  try {
    const observer = onScroll({
      onUpdate: (self: { progress: number }) => {
        el.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => {
      observer?.revert?.();
    };
  } catch {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const docEl = document.documentElement;
        const total = docEl.scrollHeight - docEl.clientHeight;
        const progress = total > 0 ? docEl.scrollTop / total : 0;
        el.style.transform = `scaleX(${progress})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }
}

/**
 * Native IntersectionObserver-based scroll reveal hook for components.
 * Automatically adds the `.is-revealed` class on first intersection.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.15
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isReducedMotion()) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return ref;
}

/**
 * Precision staggered reveal for grid cards (Resource Cards, Starter Stacks, Disciplines).
 * Uses compositor-only properties (opacity, translateY).
 */
export function animateCardGrid(
  elements: HTMLElement[] | NodeListOf<HTMLElement> | string,
  options?: { delay?: number; stagger?: number }
) {
  if (isReducedMotion()) return null;

  return animate(elements as any, {
    opacity: [0, 1],
    translateY: [MOTION_TOKENS.displacement.standard, 0],
    delay: stagger(options?.stagger ?? MOTION_TOKENS.stagger.card, { start: options?.delay ?? 30 }),
    duration: MOTION_TOKENS.duration.standard,
    ease: 'outQuad',
  });
}

/**
 * Modal Entrance Transition: Controlled scale & opacity reveal with ease-yhwach.
 */
export function animateModalEntrance(
  element: HTMLElement | null,
  onComplete?: () => void
) {
  if (!element || isReducedMotion()) {
    onComplete?.();
    return null;
  }

  return animate(element, {
    opacity: [0, 1],
    scale: [0.97, 1],
    translateY: [12, 0],
    duration: MOTION_TOKENS.duration.standard,
    ease: 'cubicBezier(0.16, 1, 0.3, 1)',
    onComplete: () => {
      onComplete?.();
    },
  });
}

/**
 * Modal Exit Transition: Smooth fade and subtle drop before unmount.
 */
export function animateModalExit(
  element: HTMLElement | null,
  onComplete?: () => void
) {
  if (!element || isReducedMotion()) {
    onComplete?.();
    return null;
  }

  return animate(element, {
    opacity: [1, 0],
    scale: [1, 0.97],
    translateY: [0, 8],
    duration: MOTION_TOKENS.duration.fast,
    ease: 'cubicBezier(0.4, 0, 1, 1)',
    onComplete: () => {
      onComplete?.();
    },
  });
}

/**
 * Drawer Entrance Transition: Controlled slide-in from right edge with ease-aizen.
 */
export function animateDrawerEntrance(
  element: HTMLElement | null,
  onComplete?: () => void
) {
  if (!element || isReducedMotion()) {
    onComplete?.();
    return null;
  }

  return animate(element, {
    translateX: ['100%', '0%'],
    opacity: [0.6, 1],
    duration: MOTION_TOKENS.duration.deliberate,
    ease: 'cubicBezier(0.25, 1, 0.5, 1)',
    onComplete: () => {
      onComplete?.();
    },
  });
}

/**
 * Drawer Exit Transition: Controlled slide-out to right edge before unmount.
 */
export function animateDrawerExit(
  element: HTMLElement | null,
  onComplete?: () => void
) {
  if (!element || isReducedMotion()) {
    onComplete?.();
    return null;
  }

  return animate(element, {
    translateX: ['0%', '100%'],
    opacity: [1, 0],
    duration: MOTION_TOKENS.duration.fast,
    ease: 'cubicBezier(0.4, 0, 1, 1)',
    onComplete: () => {
      onComplete?.();
    },
  });
}

export {
  animate,
  createScope,
  createTimeline,
  stagger,
  splitText,
  scrambleText,
  spring,
  createSpring,
  onScroll,
};
