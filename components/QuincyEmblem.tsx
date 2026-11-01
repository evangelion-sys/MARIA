'use client';

import React from 'react';

export type QuincyEmblemVariant =
  | 'default'
  | 'standalone'
  | 'badge'
  | 'minimal'
  | 'monochrome';

export interface QuincyEmblemProps {
  variant?: QuincyEmblemVariant;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  glow?: boolean;
  animated?: boolean;
  title?: string;
}

/**
 * MARIA Monochrome Butterfly Brand Emblem
 * 
 * Scalable monochrome butterfly vector mark for badges, headers, and UI elements.
 */
export function QuincyEmblem({
  variant = 'default',
  size = 32,
  width,
  height,
  className = '',
  glow = false,
  animated = false,
  title = 'MARIA Butterfly Emblem',
}: QuincyEmblemProps) {
  const dim = width || height || size;
  const isBadge = variant === 'badge';

  const glowStyle: React.CSSProperties = glow
    ? { filter: 'drop-shadow(0 0 14px rgba(245, 245, 240, 0.35))' }
    : {};

  return (
    <svg
      viewBox="0 0 200 200"
      width={dim}
      height={dim}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${animated ? 'animate-pulse' : ''} ${className}`}
      style={glowStyle}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>

      {/* Optional Badge Shield Background */}
      {isBadge && (
        <rect
          x="12"
          y="12"
          width="176"
          height="176"
          rx="24"
          fill="#070709"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
      )}

      {/* Centered Monochrome Butterfly */}
      <g transform="translate(100, 100) scale(0.52) translate(-200, -112)" fill="currentColor">
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
    </svg>
  );
}
