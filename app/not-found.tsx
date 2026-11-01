'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TransitionLink } from '@/components/TransitionLink';

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[calc(100svh-56px)] bg-ink text-bone flex flex-col items-center justify-center px-6 text-center select-none relative overflow-hidden"
    >
      {/* Quincy Sigil Star Stroke Drawn Behind at 10% Opacity */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 pointer-events-none text-bone opacity-10 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M100 30 L141.14 156.63 L33.43 78.37 L166.57 78.37 L58.86 156.63 Z"
            strokeWidth="3"
            strokeLinejoin="miter"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 space-y-5 max-w-md">
        {/* Giant '404' in Zodiak */}
        <h1 className="font-display text-8xl sm:text-9xl font-black text-bone tracking-tight leading-none">
          404
        </h1>

        {/* One sentence. No jokes. */}
        <p className="type-body text-ash-400 text-sm sm:text-base leading-relaxed">
          The requested coordinate does not exist in the archive.
        </p>

        {/* One button back to the directory */}
        <div className="pt-2 flex justify-center">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-ink" />
            <span>Return to directory</span>
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
