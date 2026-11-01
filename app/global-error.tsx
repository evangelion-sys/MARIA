'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ink text-bone min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans antialiased select-none relative overflow-hidden">
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
          <p className="type-body text-ash-400 text-sm leading-relaxed">
            A critical fault halted the application interface.
          </p>

          {/* Error Digest in Monospace (never stack traces) */}
          {error.digest && (
            <div>
              <span className="py-1.5 px-3 rounded-[2px] bg-surface border border-line text-xs font-mono text-ash-600 inline-block">
                DIGEST: {error.digest}
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-ink" />
              <span>Try again</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
