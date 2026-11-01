'use client';

import React, { useMemo } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { MariaLogo } from '@/components/MariaLogo';
import { TransitionLink } from '@/components/TransitionLink';
import {
  CATALOG_TOTAL_COUNT,
  CATALOG_CATEGORIES_COUNT,
} from '@/data/resource-stats';

/**
 * Homepage Hero with Lightweight Yhwach — The Almighty Background
 *
 * Core Concept & Brand Metaphor:
 * - The Almighty represents seeing everything and sovereign vision.
 * - MARIA represents having direct access to the tools, libraries, and knowledge creators need.
 * - Brand message: "Everything you need. One place."
 * - Replaced heavy 1.1 MB animated GIF with lightweight responsive WebP assets (21–42 KB),
 *   achieving a 96%+ reduction in bandwidth with zero continuous GPU battery drain.
 * - Responsive picture elements deliver tailored mobile portrait and desktop compositions.
 * - Purely static, accessible, restrained dark burgundy and obsidian cinematic palette.
 */
export function Hero() {
  const metrics = useMemo(() => {
    return {
      total: CATALOG_TOTAL_COUNT,
      categoriesCount: CATALOG_CATEGORIES_COUNT,
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[calc(100svh-56px)] px-4 sm:px-8 py-16 sm:py-24 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 1. The Almighty-Inspired Background (Homepage Only) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#070709]"
      >
        {/* Coherent CSS atmospheric fallback in case image load is delayed */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 75% 65% at 75% 30%, rgba(84, 28, 66, 0.45) 0%, transparent 70%),
              #070709
            `,
          }}
        />

        {/* Responsive Performance-First Picture: Tailored WebP variants with explicit aspect ratios */}
        <picture>
          {/* Mobile vertical portrait view: dedicated vertical framing */}
          <source
            media="(max-width: 640px) and (orientation: portrait)"
            srcSet="/assets/almighty/yhwach-almighty-mobile.webp"
            width={640}
            height={1138}
            type="image/webp"
          />
          {/* Tablet viewport */}
          <source
            media="(max-width: 1024px)"
            srcSet="/assets/almighty/yhwach-almighty-tablet.webp"
            width={1024}
            height={572}
            type="image/webp"
          />
          {/* Desktop widescreen default */}
          <img
            src="/assets/almighty/yhwach-almighty-desktop.webp"
            alt="Yhwach The Almighty representing comprehensive oversight of digital creation resources"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={1376}
            height={768}
            className="w-full h-full object-cover object-[70%_25%] sm:object-[68%_25%] md:object-[65%_22%] select-none pointer-events-none"
          />
        </picture>

        {/* Restrained Contrast Scrim: Leaves subject and Almighty eyes vivid while ensuring crisp text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to right, rgba(7, 7, 9, 0.92) 0%, rgba(7, 7, 9, 0.72) 38%, rgba(7, 7, 9, 0.25) 70%, transparent 100%),
              linear-gradient(to top, rgba(7, 7, 9, 0.98) 0%, rgba(7, 7, 9, 0.4) 25%, transparent 60%)
            `,
          }}
        />

        {/* Mobile-specific vertical scrim to prevent bottom text overlap */}
        <div
          className="sm:hidden absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to top, rgba(7, 7, 9, 0.98) 0%, rgba(7, 7, 9, 0.75) 45%, rgba(7, 7, 9, 0.2) 75%, transparent 100%)
            `,
          }}
        />
      </div>

      {/* 2. Main Welcome & Brand Presentation (relative z-10) */}
      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-7 text-left my-auto">
        {/* Brand Identity & Eyebrow */}
        <div className="inline-flex items-center gap-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          <MariaLogo variant="symbol" size={26} glow={true} animated={false} />
          <span className="font-mono text-xs uppercase tracking-wider text-reishi font-semibold">
            MARIA · Digital Resource Archive
          </span>
        </div>

        {/* Core Brand Message Headline */}
        <h1 className="type-display-xl text-bone tracking-tight max-w-3xl text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          Everything you need. One place.
        </h1>

        {/* Natural, Factual Brand Explanation */}
        <p className="type-body-lg text-[#F0F0E8] max-w-2xl leading-relaxed text-balance text-base sm:text-lg drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
          Explore a curated directory of {metrics.total.toLocaleString()} digital tools, creative resources, and developer utilities, organized to help you find what you need without searching across countless disconnected places.
        </p>

        {/* Dominant Primary Call to Action leading to /discover */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <TransitionLink
            href="/discover"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-[4px] bg-bone hover:bg-[#E8E8E1] text-ink type-btn font-semibold transition-all duration-200 shadow-2xl hover:shadow-[0_0_35px_rgba(143,211,255,0.35)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>Explore Resources</span>
            <ArrowRight className="w-4 h-4 text-ink transition-transform duration-200 group-hover:translate-x-1" />
          </TransitionLink>

          {/* Discreet Secondary Link to About */}
          <TransitionLink
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[4px] type-btn font-medium text-ash-400 hover:text-bone hover:bg-surface/60 border border-line/60 bg-ink/50 backdrop-blur-sm transition-colors"
          >
            <span>About the Archive</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-reishi" />
          </TransitionLink>
        </div>

        {/* Factual Value Metrics Strip */}
        <div className="pt-8 border-t border-line/70 grid grid-cols-3 gap-4 sm:gap-10 max-w-xl backdrop-blur-xs">
          <div className="space-y-1">
            <div className="type-h3 sm:type-h2 font-semibold text-bone tabular-nums drop-shadow-md">
              {metrics.total.toLocaleString()}
            </div>
            <div className="text-xs text-ash-400 font-sans font-medium">
              Curated Tools
            </div>
          </div>

          <div className="border-l border-line pl-4 sm:pl-10 space-y-1">
            <div className="type-h3 sm:type-h2 font-semibold text-reishi tabular-nums drop-shadow-md">
              {metrics.categoriesCount}
            </div>
            <div className="text-xs text-ash-400 font-sans font-medium">
              Disciplines
            </div>
          </div>

          <div className="border-l border-line pl-4 sm:pl-10 space-y-1">
            <div className="type-h3 sm:type-h2 font-semibold text-bone tabular-nums drop-shadow-md">
              100%
            </div>
            <div className="text-xs text-ash-400 font-sans font-medium">
              Direct Links
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Status Orientation */}
      <div className="max-w-7xl mx-auto w-full pt-8 relative z-10 flex flex-col gap-3">
        <div className="editorial-hairline h-[1px] w-full bg-gradient-to-r from-[#8FD3FF]/50 via-line to-transparent origin-left" />

        <div className="flex items-center justify-between text-xs font-mono text-ash-400">
          <span>MARIA · Comprehensive Digital Resource Directory</span>

          <TransitionLink
            href="/discover"
            className="cursor-pointer hover:text-bone transition-colors flex items-center gap-2"
            aria-label="Open directory catalogue"
          >
            <span>Explore the catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 text-reishi" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
