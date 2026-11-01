'use client';

import React from 'react';

/**
 * Loading Skeleton Grid matching the 6px radius, 1px line border ResourceCard grid.
 * Translates a 20% bone gradient across 1px lines and skeleton rows in 1.4s.
 * Under prefers-reduced-motion: static skeleton rows without translation.
 * No spinner is ever shown.
 */
export function DirectorySkeleton({ count = 6 }: { count?: number } = {}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading directory archive"
      className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 py-8 select-none"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="relative flex flex-col justify-between bg-surface border border-line rounded-[6px] p-5 sm:p-6 h-[260px] overflow-hidden"
          >
            {/* Shimmer translating a 20% bone gradient in 1.4s */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-bone/20 to-transparent motion-safe:animate-[shimmer_1.4s_infinite] motion-reduce:hidden pointer-events-none"
            />

            <div className="space-y-4">
              {/* Category & Badge Row */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 bg-white/[0.08] rounded-[2px]" />
                <div className="h-3 w-16 bg-white/[0.05] rounded-[2px]" />
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2 pt-1">
                <div className="h-5 w-44 bg-white/[0.12] rounded-[2px]" />
                <div className="h-3.5 w-60 max-w-full bg-white/[0.06] rounded-[2px]" />
              </div>

              {/* 1px Skeleton Lines & Description Rows */}
              <div className="space-y-2 pt-2">
                <div className="h-[1px] w-full bg-line" />
                <div className="h-2.5 w-full bg-white/[0.05] rounded-[2px]" />
                <div className="h-2.5 w-4/5 bg-white/[0.04] rounded-[2px]" />
              </div>
            </div>

            {/* Bottom Tier & Action Row with 1px Divider */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <div className="h-3 w-32 bg-white/[0.06] rounded-[2px]" />
              <div className="flex items-center gap-3">
                <div className="h-3.5 w-12 bg-white/[0.06] rounded-[2px]" />
                <div className="h-3.5 w-16 bg-white/[0.06] rounded-[2px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
