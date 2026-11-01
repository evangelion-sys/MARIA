'use client';

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { isReducedMotion } from '@/lib/cinematic-motion';

export type MariaLogoVariant =
  | 'horizontal'        // Variant A: Primary horizontal logo (Monochrome Butterfly + MARIA wordmark)
  | 'compact'           // Variant B: Compact logo for narrow navigation layouts
  | 'symbol'            // Variant C: Symbol-only logo (for favicon & compact application identity)
  | 'monochrome'        // Variant D: Pure monochrome logo (single color currentColor)
  | 'footer'            // Variant E: Footer logo (proportioned for architectural footer baseline)
  | 'full'              // Backward-compatible alias for 'horizontal'
  | 'stacked'           // Vertical: Butterfly centered above MARIA wordmark
  | 'monochrome-symbol' // Monochrome butterfly symbol-only
  | 'favicon'           // Square badge with monochrome butterfly
  | 'legacy-butterfly'; // Backward-compatible alias

export interface MariaLogoProps {
  variant?: MariaLogoVariant;
  className?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  glow?: boolean;
  animated?: boolean;
  title?: string;
}

/**
 * MARIA Brand Insignia & Vector Typography System
 * 
 * Aesthetic Foundation:
 * - Pure Monochrome Butterfly Emblem:
 *   Elegant, balanced bilateral wing geometry, delicate antennae, and slender body.
 * - Exact mathematically calibrated M-A-R-I-A letterforms with uniform optical kerning.
 * - 100% vector SVG, zero raster images, zero dependencies beyond existing Anime.js.
 * - Complete monochrome discipline (currentColor / #F5F5F0).
 */
export function MariaLogo({
  variant = 'horizontal',
  className = '',
  size,
  width,
  height,
  glow = false,
  animated = false,
  title = 'MARIA',
}: MariaLogoProps) {
  const butterflyGroupRef = useRef<SVGGElement | null>(null);

  // Normalize variant aliases
  const isFavicon = variant === 'favicon';
  const isSymbolOnly =
    variant === 'symbol' || variant === 'monochrome-symbol' || variant === 'legacy-butterfly';
  const isStacked = variant === 'stacked';
  const isCompact = variant === 'compact';
  const isFooter = variant === 'footer';

  // Subtle gentle breathing animation for animated butterfly prop
  useEffect(() => {
    if (!animated || isReducedMotion()) return;

    const el = butterflyGroupRef.current;
    if (!el) return;

    let anim: ReturnType<typeof animate> | null = null;
    try {
      anim = animate(el, {
        scale: [1, 1.05, 1],
        opacity: [0.92, 1, 0.92],
        duration: 3800,
        loop: true,
        ease: 'inOutSine',
      });
    } catch {
      // Graceful fallback
    }

    return () => {
      try {
        anim?.pause();
      } catch {
        // no-op
      }
    };
  }, [animated]);

  // Subtle CSS drop-shadow glow recipe (only if explicitly enabled via glow prop)
  const glowStyle: React.CSSProperties = glow
    ? { filter: 'drop-shadow(0 0 16px rgba(245, 245, 240, 0.28))' }
    : {};

  // --------------------------------------------------------------------------
  // Vector Definitions
  // --------------------------------------------------------------------------

  /**
   * Refined Monochrome Butterfly Paths (Native space: 400x220, centered at 200, 112)
   */
  const renderButterflyPaths = () => (
    <g ref={butterflyGroupRef} className="maria-butterfly-mark" fill="currentColor">
      {/* Left top & bottom wings */}
      <path d="M196 99C169 42 91 17 54 43C22 65 44 119 82 132C115 144 157 121 190 113C160 133 137 160 150 181C165 204 191 168 198 137Z" />
      {/* Right top & bottom wings */}
      <path d="M204 99C231 42 309 17 346 43C378 65 356 119 318 132C285 144 243 121 210 113C240 133 263 160 250 181C235 204 209 168 202 137Z" />
      {/* Left inner wing membrane facet (subtle tone) */}
      <path d="M195 103C180 72 147 65 126 78C111 88 126 111 150 117C169 122 184 114 195 110Z" opacity="0.4" />
      {/* Right inner wing membrane facet (subtle tone) */}
      <path d="M205 103C220 72 253 65 274 78C289 88 274 111 250 117C231 122 216 114 205 110Z" opacity="0.4" />
      {/* Left antenna */}
      <path d="M197 94Q179 57 163 43Q181 46 198 76Z" />
      {/* Right antenna */}
      <path d="M203 94Q221 57 237 43Q219 46 202 76Z" />
      {/* Slender body */}
      <ellipse cx="200" cy="120" rx="5" ry="30" />
      {/* Head */}
      <circle cx="200" cy="86" r="4.5" />
    </g>
  );

  /**
   * Refined MARIA Vector Wordmark Paths (ViewBox 0 0 145 40)
   * - Mathematical 8px optical kerning between all glyph pairs
   * - Authoritative stroke proportions (5.5px stem width)
   * - Cap height = 32px (y: 4 to 36)
   */
  const renderWordmarkPaths = () => (
    <g className="maria-wordmark-vector" fill="currentColor">
      {/* Letter M (x: 0 to 28, width 28) */}
      <path d="M 0 36 L 0 4 L 6 4 L 14 21.5 L 22 4 L 28 4 L 28 36 L 22.5 36 L 22.5 13 L 15.5 27 L 12.5 27 L 5.5 13 L 5.5 36 Z" />

      {/* Letter A (x: 36 to 64, width 28, gap = 8) */}
      <path d="M 47 4 L 53 4 L 64 36 L 58 36 L 55.8 28.5 L 44.2 28.5 L 42 36 L 36 36 Z M 45.4 23.5 L 54.6 23.5 L 50 10.5 Z" />

      {/* Letter R (x: 72 to 95, width 23, gap = 8) */}
      <path d="M 72 36 L 72 4 L 86.5 4 C 92.5 4 95 7 95 12 C 95 16.5 92 19.5 86.5 20.2 L 95 36 L 88.5 36 L 80.8 21 L 77.5 21 L 77.5 36 Z M 77.5 16.2 L 85.5 16.2 C 88.5 16.2 89.5 14.5 89.5 12 C 89.5 9.5 88.5 8.2 85.5 8.2 L 77.5 8.2 Z" />

      {/* Letter I (x: 103 to 108.5, width 5.5, gap = 8) */}
      <path d="M 103 36 L 103 4 L 108.5 4 L 108.5 36 Z" />

      {/* Letter A (x: 116.5 to 144.5, width 28, gap = 8) */}
      <path d="M 127.5 4 L 133.5 4 L 144.5 36 L 138.5 36 L 136.3 28.5 L 124.7 28.5 L 122.5 36 L 116.5 36 Z M 125.9 23.5 L 135.1 23.5 L 130.5 10.5 Z" />
    </g>
  );

  // --------------------------------------------------------------------------
  // Variant Renders
  // --------------------------------------------------------------------------

  // 1. Favicon Badge Variant
  if (isFavicon) {
    const inlineStyle: React.CSSProperties = {
      width: width || size || 32,
      height: height || size || 32,
      ...glowStyle,
    };

    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 select-none ${className}`}
        style={inlineStyle}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        <rect width="32" height="32" rx="7" fill="#070709" />
        <g transform="translate(16, 16) scale(0.075) translate(-200, -112)" fill="#F5F5F0">
          {renderButterflyPaths()}
        </g>
      </svg>
    );
  }

  // 2. Variant C: Symbol-Only Logo ('symbol' & 'monochrome-symbol')
  if (isSymbolOnly) {
    const defaultDim = width || height || size || 36;
    const inlineStyle: React.CSSProperties = {
      width: defaultDim,
      height: defaultDim,
      ...glowStyle,
    };

    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 transition-transform duration-200 select-none ${className}`}
        style={inlineStyle}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {/* Centered monochrome butterfly in 200x200 canvas */}
        <g transform="translate(100, 100) scale(0.52) translate(-200, -112)">
          {renderButterflyPaths()}
        </g>
      </svg>
    );
  }

  // 3. Variant B: Compact Logo (Designed for narrow navigation and mobile headers)
  if (isCompact) {
    const defaultHeight = height || size || 26;
    const defaultWidth = width || (size ? Number(size) * 4.0 : undefined);
    const inlineStyle: React.CSSProperties = {
      ...(defaultWidth || defaultHeight ? { width: defaultWidth, height: defaultHeight } : {}),
      ...glowStyle,
    };

    return (
      <svg
        viewBox="0 0 160 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 transition-transform duration-200 select-none ${className}`}
        style={inlineStyle}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {/* Compact Butterfly on left */}
        <g transform="translate(20, 18) scale(0.10) translate(-200, -112)">
          {renderButterflyPaths()}
        </g>
        {/* Compact Wordmark on right */}
        <g transform="translate(44, 5) scale(0.68)">
          {renderWordmarkPaths()}
        </g>
      </svg>
    );
  }

  // 4. Stacked Variant (Butterfly centered above MARIA wordmark)
  if (isStacked) {
    const inlineStyle: React.CSSProperties = {
      width: width || size || 160,
      height: height || 'auto',
      ...glowStyle,
    };

    return (
      <svg
        viewBox="0 0 160 132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 transition-opacity hover:opacity-95 select-none ${className}`}
        style={inlineStyle}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {/* Butterfly centered at top */}
        <g transform="translate(80, 42) scale(0.28) translate(-200, -112)">
          {renderButterflyPaths()}
        </g>
        {/* Wordmark centered at bottom */}
        <g transform="translate(19.5, 78) scale(0.84)">
          {renderWordmarkPaths()}
        </g>
      </svg>
    );
  }

  // 5. Variant E: Footer Logo (Appropriate size, spacing & tone)
  if (isFooter) {
    const defaultHeight = height || size || 28;
    const defaultWidth = width || (size ? Number(size) * 4.4 : undefined);
    const inlineStyle: React.CSSProperties = {
      ...(defaultWidth || defaultHeight ? { width: defaultWidth, height: defaultHeight } : {}),
      ...glowStyle,
    };

    return (
      <svg
        viewBox="0 0 196 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 transition-transform duration-200 select-none ${className}`}
        style={inlineStyle}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {/* Butterfly on left */}
        <g transform="translate(24, 22) scale(0.125) translate(-200, -112)">
          {renderButterflyPaths()}
        </g>
        {/* MARIA Wordmark with 14px optical spacing */}
        <g transform="translate(54, 6) scale(0.82)">
          {renderWordmarkPaths()}
        </g>
      </svg>
    );
  }

  // 6. Variant A & D: Primary Horizontal Logo ('horizontal', 'full', 'monochrome')
  const defaultHeight = height || size || 32;
  const defaultWidth = width || (size ? Number(size) * 4.4 : undefined);

  const inlineStyle: React.CSSProperties = {
    ...(defaultWidth || defaultHeight ? { width: defaultWidth, height: defaultHeight } : {}),
    ...glowStyle,
  };

  return (
    <svg
      viewBox="0 0 196 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 transition-transform duration-200 select-none ${className}`}
      style={inlineStyle}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Monochrome Butterfly on left */}
      <g transform="translate(24, 22) scale(0.125) translate(-200, -112)">
        {renderButterflyPaths()}
      </g>
      {/* MARIA Wordmark on right with calibrated optical spacing */}
      <g transform="translate(54, 6) scale(0.82)">
        {renderWordmarkPaths()}
      </g>
    </svg>
  );
}
