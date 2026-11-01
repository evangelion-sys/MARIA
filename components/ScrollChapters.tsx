'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { STARTER_STACKS } from '@/data/starter-stacks';
import { StarterStack, ResourceItem } from '@/types/resource';
import { MariaLogo } from '@/components/MariaLogo';
import { onScroll, isReducedMotion } from '@/lib/motion';
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react';

interface ScrollChaptersProps {
  allResources: ResourceItem[];
  onApplyPreset: (stack: StarterStack) => void;
  onInspect: (r: ResourceItem) => void;
}

const VERIFICATION_CRITERIA = [
  {
    num: '01',
    title: 'Zero Credit Card Gatekeeping',
    summary:
      'Immediate access or registration without demanding payment credentials upfront. You never risk accidental billing while prototyping.',
  },
  {
    num: '02',
    title: 'Authentic Free Tiers & Open Source',
    summary:
      'Genuine perpetual free allowance, self-hostable open source repository, or unexpiring license. Zero 7-day expiration trial traps.',
  },
  {
    num: '03',
    title: 'Commercial Creation Permissions',
    summary:
      'Permissive commercial reuse (MIT, Apache 2.0, CC0, or commercial-safe free quotas) across client products and production games.',
  },
  {
    num: '04',
    title: 'Sovereign Data Portability',
    summary:
      'Standardized open formats (SQL dumps, SVG vectors, open weights, FFmpeg codecs) guaranteeing absolute operational sovereignty.',
  },
];

const CATEGORY_MARQUEE = [
  'DEVELOPER RUNTIMES',
  '3D & WEBGL SHADERS',
  'SOVEREIGN AI WEIGHTS',
  'VIDEO COMPOSITING',
  'PUBLIC REST ENDPOINTS',
  'CREATIVE ASSET ARCHIVES',
  'ZERO-DOLLAR INVARIANTS',
  'PERPETUAL TIERS',
];

export function ScrollChapters({
  allResources,
  onApplyPreset,
  onInspect,
}: ScrollChaptersProps) {
  // Pinned Chapter 1 Active Criterion State
  const ch1ContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeCriterionIdx, setActiveCriterionIdx] = useState(0);

  // Chapter 2 Horizontal Rail Refs
  const ch2ContainerRef = useRef<HTMLDivElement | null>(null);
  const ch2TrackRef = useRef<HTMLDivElement | null>(null);

  // Chapter 3 Aizen Panel Refs & Mouse Interaction
  const ch3ContainerRef = useRef<HTMLDivElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [aizenCoverRadius, setAizenCoverRadius] = useState(100);

  // Map resources for each starter stack
  const stackWithItems = useMemo(() => {
    const resourceMap = new Map(allResources.map((r) => [r.id, r]));
    return STARTER_STACKS.map((stack) => ({
      stack,
      items: stack.resourceIds.map((id) => resourceMap.get(id)).filter(Boolean) as ResourceItem[],
    }));
  }, [allResources]);

  // Scroll Chapter 1: Pinned list progress
  useEffect(() => {
    if (isReducedMotion() || !ch1ContainerRef.current) return;

    const el = ch1ContainerRef.current;
    let observer: any;

    try {
      observer = onScroll({
        target: el,
        onUpdate: (self: { progress: number }) => {
          const idx = Math.min(3, Math.max(0, Math.floor(self.progress * 4)));
          setActiveCriterionIdx(idx);
        },
      });
    } catch {
      // Fallback
    }

    return () => {
      observer?.revert?.();
    };
  }, []);

  // Scroll Chapter 2: Desktop Horizontal Rail Translation
  useEffect(() => {
    if (isReducedMotion() || !ch2ContainerRef.current || !ch2TrackRef.current) return;

    const container = ch2ContainerRef.current;
    const track = ch2TrackRef.current;

    let observer: any;

    try {
      observer = onScroll({
        target: container,
        onUpdate: (self: { progress: number }) => {
          // Horizontal translation on desktop only
          if (window.innerWidth >= 768) {
            const maxScroll = track.scrollWidth - window.innerWidth + 80;
            const tx = self.progress * Math.max(maxScroll, 0);
            track.style.transform = `translateX(-${tx}px)`;
          }
        },
      });
    } catch {
      // Fallback
    }

    return () => {
      observer?.revert?.();
    };
  }, []);

  // Chapter 3 Cursor Tracking for Aizen Clip-Path
  const handleAizenMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion() || !ch3ContainerRef.current) return;
    const rect = ch3ContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x: Math.round(x), y: Math.round(y) });
  };

  const scrollToDirectory = () => {
    const el = document.getElementById('directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="chapters" className="w-full bg-ink text-bone relative select-none">
      {/* ------------------------------------------------------------------ */}
      {/* CHAPTER 一: How an entry is verified                               */}
      {/* Pinned section (sticky 220vh scroll length), 25% -> 100% opacity   */}
      {/* ------------------------------------------------------------------ */}
      <section
        ref={ch1ContainerRef}
        className="relative h-[220vh] w-full border-b border-line bg-ink"
      >
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] flex items-center px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full items-center">
            {/* Left Column: Pinned Header */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-jp text-3xl text-reishi">一</span>
                <span className="type-eyebrow text-ash-400">Verification Protocol</span>
              </div>
              <h2 className="type-section-title text-bone text-2xl sm:text-4xl">
                How an entry is verified.
              </h2>
              <p className="type-body text-ash-400 text-sm leading-relaxed max-w-md">
                Every candidate tool submitted or discovered is evaluated against four strict invariants before canonical admission into the MARIA index.
              </p>
              <div className="pt-2 font-mono text-xs text-ash-600">
                CRITERION {activeCriterionIdx + 1} OF 4 ACTIVE
              </div>
            </div>

            {/* Right Column: Dynamic Criterion Lines */}
            <div className="lg:col-span-7 space-y-6">
              {VERIFICATION_CRITERIA.map((criterion, idx) => {
                const isReduced = isReducedMotion();
                const isActive = isReduced || idx === activeCriterionIdx;

                return (
                  <div
                    key={criterion.num}
                    className={`transition-all duration-300 pb-4 ${
                      isActive
                        ? 'opacity-100 border-b border-reishi'
                        : 'opacity-25 border-b border-line'
                    }`}
                  >
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <span
                        className={`font-mono text-xs font-bold transition-colors ${
                          isActive ? 'text-reishi' : 'text-ash-600'
                        }`}
                      >
                        {criterion.num}
                      </span>
                      <h3
                        className={`font-serif text-lg sm:text-xl font-medium transition-colors ${
                          isActive ? 'text-bone' : 'text-ash-400'
                        }`}
                      >
                        {criterion.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-ash-400 leading-relaxed pl-7">
                      {criterion.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 1px Reishi Drawing Boundary Line */}
      <div className="h-[1px] w-full bg-reishi/30" />

      {/* ------------------------------------------------------------------ */}
      {/* CHAPTER 二: Starter Stacks Horizontal Rail                         */}
      {/* Pinned vertically; translates on X on desktop, vertical on touch   */}
      {/* ------------------------------------------------------------------ */}
      <section
        ref={ch2ContainerRef}
        className="relative md:h-[240vh] w-full border-b border-line bg-ink"
      >
        <div className="md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto w-full py-12 md:py-0 overflow-hidden">
          {/* Section Header */}
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-jp text-3xl text-reishi">二</span>
                <span className="type-eyebrow text-ash-400">Preconfigured Pipelines</span>
              </div>
              <h2 className="type-section-title text-bone text-2xl sm:text-4xl">
                Starter stacks.
              </h2>
            </div>
            <span className="hidden md:inline font-mono text-xs text-ash-600 uppercase tracking-widest">
              [ Scroll Vertically to Traverse ]
            </span>
          </div>

          {/* Track of alternating panels */}
          <div
            ref={ch2TrackRef}
            className="flex flex-col md:flex-row gap-6 md:gap-8 will-change-transform"
          >
            {stackWithItems.map(({ stack, items }, sIdx) => {
              const isEven = sIdx % 2 === 0;

              return (
                <div
                  key={stack.id}
                  className="w-full md:w-[480px] lg:w-[540px] shrink-0 p-6 sm:p-8 rounded-sm bg-surface border border-line flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative Background Sigil / Ring Segment */}
                  <div
                    aria-hidden="true"
                    className={`absolute pointer-events-none opacity-[0.04] text-reishi ${
                      isEven
                        ? '-right-16 -bottom-16 w-64 h-64'
                        : '-left-16 -top-16 w-64 h-64'
                    }`}
                  >
                    <MariaLogo variant="symbol" size={240} animated={false} />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono uppercase text-ash-600">
                      <span className="text-reishi font-bold">STACK 0{sIdx + 1}</span>
                      <span>{stack.category}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-bone">
                      {stack.title}
                    </h3>

                    <p className="type-body text-xs text-ash-400 line-clamp-2 leading-relaxed">
                      {stack.description}
                    </p>

                    {/* Resources List with Counts */}
                    <div className="pt-2 border-t border-line space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-ash-600 block">
                        Included Tools ({items.length})
                      </span>
                      <ul className="space-y-1 text-xs font-mono text-ash-400">
                        {items.slice(0, 5).map((tool) => (
                          <li
                            key={tool.id}
                            className="flex items-center justify-between hover:text-bone cursor-pointer"
                            onClick={() => onInspect(tool)}
                          >
                            <span className="truncate">{tool.name}</span>
                            <span className="text-[10px] text-ash-600 shrink-0 ml-2">
                              {tool.subcategory}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Apply Stack Button */}
                  <div className="pt-6 mt-4 border-t border-line relative z-10">
                    <button
                      type="button"
                      onClick={() => onApplyPreset(stack)}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-reishi hover:text-white transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Apply stack to workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1px Reishi Drawing Boundary Line */}
      <div className="h-[1px] w-full bg-reishi/30" />

      {/* ------------------------------------------------------------------ */}
      {/* CHAPTER 三: The Aizen Moment                                       */}
      {/* Full-bleed wine #541C42 panel, single Zodiak sentence, circle wipe */}
      {/* 40s CSS category marquee at bottom                                 */}
      {/* ------------------------------------------------------------------ */}
      <section
        ref={ch3ContainerRef}
        onMouseMove={handleAizenMouseMove}
        className="relative min-h-[85vh] w-full bg-[#541C42] text-bone flex flex-col justify-between py-16 px-6 sm:px-12 border-b border-line overflow-hidden"
        style={{
          clipPath: isReducedMotion()
            ? 'none'
            : `circle(120% at ${cursorPos.x}% ${cursorPos.y}%)`,
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="font-jp text-3xl text-bone/80">三</span>
            <span className="type-eyebrow text-bone/60">The Disillusionment Invariant</span>
          </div>
          <span className="font-mono text-xs text-bone/40 uppercase tracking-widest hidden sm:inline">
            Aizen Principle
          </span>
        </div>

        {/* Central Monumental Zodiak Sentence */}
        <div className="max-w-4xl mx-auto my-auto text-center space-y-8 py-12">
          <blockquote className="font-serif text-3xl sm:text-5xl md:text-6xl text-bone tracking-tight leading-[1.15] font-medium">
            &ldquo;Reason exists for those who cannot live without it.&rdquo;
          </blockquote>

          <p className="type-body text-bone/80 max-w-lg mx-auto text-sm leading-relaxed font-sans">
            Do not mistake marketing claims for verified utilities. Every artifact in this index is stripped of hyperbole and tested against raw execution.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={scrollToDirectory}
              className="px-6 py-3 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-[#541C42] font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-lg active:scale-[0.98] inline-flex items-center gap-2"
            >
              <span>Explore The Complete Catalog</span>
              <ArrowRight className="w-4 h-4 text-[#541C42]" />
            </button>
          </div>
        </div>

        {/* Bottom 40s Continuous CSS Category Marquee */}
        <div
          aria-hidden="true"
          className="w-full overflow-hidden border-t border-bone/20 pt-4 group select-none"
        >
          <div className="flex gap-8 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
            {[...CATEGORY_MARQUEE, ...CATEGORY_MARQUEE].map((cat, i) => (
              <span
                key={i}
                className="font-mono text-xs uppercase tracking-widest text-bone/60 flex items-center gap-6"
              >
                <span>{cat}</span>
                <span className="text-bone/30">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 1px Reishi Drawing Boundary Line */}
      <div className="h-[1px] w-full bg-reishi/30" />
    </div>
  );
}
