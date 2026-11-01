'use client';

import React, { useEffect } from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { TransitionLink } from '@/components/TransitionLink';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Isolated log to console only; never render stack trace on screen
    console.error('Captured execution boundary fault:', error);
  }, [error]);

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

      <div className="relative z-10 space-y-5 max-w-md">
        {/* Giant 'Fault' in Zodiak */}
        <h1 className="font-display text-7xl sm:text-8xl font-black text-bone tracking-tight leading-none">
          Fault
        </h1>

        {/* One sentence */}
        <p className="type-body text-ash-400 text-sm sm:text-base leading-relaxed">
          An unexpected error interrupted interface execution.
        </p>

        {/* Error Digest in Monospace (never stack traces) */}
        {error.digest && (
          <div>
            <span className="py-1.5 px-3 rounded-[2px] bg-surface border border-line text-xs font-mono text-ash-600 inline-block">
              DIGEST: {error.digest}
            </span>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink uppercase font-bold tracking-wider transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ink" />
            <span>Try again</span>
          </button>

          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] bg-surface hover:bg-ink text-ash-400 hover:text-bone border border-line uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-ash-400" />
            <span>Return to directory</span>
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
