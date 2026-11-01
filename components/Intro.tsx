'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, svg } from 'animejs';
import { CATALOG_TOTAL_COUNT } from '@/data/resource-stats';
import { isReducedMotion } from '@/lib/motion';

const SESSION_KEY = 'maria-intro-v1';

/**
 * First-Visit Cinematic Intro Sequence
 * 
 * Bleach TYBW Aesthetic:
 * - 0.00–0.9s: Quincy sigil draws at 160px centered.
 * - 0.6–1.4s: Geist Mono counter 000 to CATALOG_TOTAL_COUNT bottom-left; label 'ARTIFACTS INDEXED'.
 * - 1.2–1.6s: Wordmark MARIA fades in under sigil; vertical Japanese 滅却師 in Shippori Mincho at right edge.
 * - 1.6–2.4s: Monumental diagonal split clip-path reveals the underlying page and unmounts.
 * - Skippable instantly on click or any keypress.
 * - Locks body scroll during playback; restores scroll & focus on finish.
 * - Runs once per browser session.
 */
export function Intro() {
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const outerRingRef = useRef<SVGCircleElement | null>(null);
  const innerRingRef = useRef<SVGCircleElement | null>(null);
  const starPathRef = useRef<SVGPathElement | null>(null);
  const centerDotRef = useRef<SVGCircleElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const kanjiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check session storage and reduced-motion preference
    if (typeof window === 'undefined') return;
    if (isReducedMotion()) return;

    try {
      const hasSeen = sessionStorage.getItem(SESSION_KEY);
      if (hasSeen) return;
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // In private browsing mode where sessionStorage may throw
      return;
    }

    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finishIntro = () => {
      document.body.style.overflow = prevOverflow;
      setIsVisible(false);
      previousActiveElement?.focus?.();
    };

    // Keyboard and click to skip
    const handleKeyDown = () => finishIntro();
    window.addEventListener('keydown', handleKeyDown, { once: true });

    // Run anime.js sequence
    const outerEl = outerRingRef.current;
    const innerEl = innerRingRef.current;
    const starEl = starPathRef.current;
    const containerEl = containerRef.current;

    if (!outerEl || !innerEl || !starEl || !containerEl) {
      finishIntro();
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    let tl: ReturnType<typeof createTimeline> | null = null;

    try {
      const [outerDrawable] = svg.createDrawable(outerEl);
      const [innerDrawable] = svg.createDrawable(innerEl);
      const [starDrawable] = svg.createDrawable(starEl);

      tl = createTimeline({
        defaults: { ease: 'outExpo' },
        onComplete: finishIntro,
      });

      // 0.00–0.9s: Sigil stroke drawing
      tl.add(outerDrawable, { draw: ['0 0', '0 1'], duration: 600 }, 0)
        .add(innerDrawable, { draw: ['0 0', '0 1'], duration: 800 }, 120)
        .add(starDrawable, { draw: ['0 0', '0 1'], duration: 900 }, 240);

      // Center reishi dot fade in at 0.8s
      if (centerDotRef.current) {
        tl.add(
          centerDotRef.current,
          {
            opacity: [0, 1],
            scale: [0, 1],
            duration: 300,
            ease: 'outBack',
          },
          800
        );
      }

      // 0.6–1.4s: Geist Mono Counter 000 -> CATALOG_TOTAL_COUNT
      const counterTarget = { count: 0 };
      const totalArtifacts = CATALOG_TOTAL_COUNT;
      tl.add(
        counterTarget,
        {
          count: totalArtifacts,
          duration: 800,
          ease: 'outQuad',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                Math.round(counterTarget.count)
              ).padStart(3, '0');
            }
          },
        },
        600
      );

      // 1.2–1.6s: Wordmark MARIA + Vertical Kanji fade in
      if (wordmarkRef.current) {
        tl.add(
          wordmarkRef.current,
          {
            opacity: [0, 1],
            translateY: [12, 0],
            duration: 400,
            ease: 'outCubic',
          },
          1200
        );
      }

      if (kanjiRef.current) {
        tl.add(
          kanjiRef.current,
          {
            opacity: [0, 0.4],
            translateY: [-10, 0],
            duration: 400,
            ease: 'outQuad',
          },
          1200
        );
      }

      // 1.6–2.4s: Diagonal split clip-path reveals the underlying page
      tl.add(
        containerEl,
        {
          clipPath: [
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            'polygon(100% 0%, 100% 0%, 0% 100%, 0% 100%)',
          ],
          duration: 800,
          ease: 'outExpo',
        },
        1600
      );
    } catch {
      finishIntro();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      tl?.revert?.();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      onClick={() => setIsVisible(false)}
      role="dialog"
      aria-modal="true"
      aria-label="MARIA Archive Introduction"
      tabIndex={0}
      className="fixed inset-0 z-[100] bg-ink text-bone flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      {/* Central Sigil and Wordmark */}
      <div className="flex flex-col items-center gap-6">
        <svg
          viewBox="0 0 200 200"
          className="w-40 h-40 text-bone overflow-visible"
          style={{ filter: 'drop-shadow(0 0 32px rgba(143,211,255,0.22))' }}
        >
          {/* Cardinal Orientation Ticks */}
          <line x1="100" y1="2" x2="100" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="100" y1="190" x2="100" y2="198" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="2" y1="100" x2="10" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="190" y1="100" x2="198" y2="100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          {/* Outer Hairline Ring */}
          <circle
            ref={outerRingRef}
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Inner Authority Ring */}
          <circle
            ref={innerRingRef}
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          {/* Traditional 4-Pointed Quincy Kreuz (Cross) */}
          <path
            ref={starPathRef}
            d="M 100 14 L 114 62 L 110 90 L 138 86 L 186 100 L 138 114 L 110 110 L 114 138 L 100 186 L 86 138 L 90 110 L 62 114 L 14 100 L 62 86 L 90 90 L 86 62 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="miter"
          />
          {/* Spines */}
          <line x1="100" y1="14" x2="100" y2="186" stroke="currentColor" strokeWidth="1.2" />
          <line x1="14" y1="100" x2="186" y2="100" stroke="currentColor" strokeWidth="1.2" />
          {/* Cold Reishi Center Node */}
          <circle
            ref={centerDotRef}
            cx="100"
            cy="100"
            r="4"
            fill="#8FD3FF"
            className="opacity-0"
          />
        </svg>

        {/* Wordmark MARIA */}
        <div
          ref={wordmarkRef}
          className="opacity-0 flex flex-col items-center tracking-[0.35em] text-sm uppercase font-mono text-bone"
        >
          <span>M A R I A</span>
          <span className="text-[10px] tracking-[0.25em] text-ash-400 mt-1">
            DIGITAL RESOURCE ARCHIVE
          </span>
        </div>
      </div>

      {/* Bottom-Left Counter */}
      <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 flex flex-col font-mono">
        <div className="flex items-baseline gap-2">
          <span
            ref={counterRef}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-bone"
          >
            000
          </span>
          <span className="text-xs text-reishi">/ {CATALOG_TOTAL_COUNT}</span>
        </div>
        <span className="text-[10px] tracking-widest text-ash-600 uppercase mt-0.5">
          Artifacts Indexed
        </span>
      </div>

      {/* Bottom-Right Skip Hint */}
      <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-[10px] font-mono text-ash-600 uppercase tracking-widest">
        [ Press Any Key to Skip ]
      </div>
    </div>
  );
}
