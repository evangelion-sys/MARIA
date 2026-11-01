import React from 'react';
import { DirectorySkeleton } from '@/components/DirectorySkeleton';

export default function Loading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-ink text-bone flex flex-col items-center justify-start pt-8 pb-24"
    >
      {/* Header controls skeleton bar */}
      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-8 space-y-3 mb-4">
        <div className="h-4 w-36 bg-line/80 rounded-[2px]" />
        <div className="h-10 w-full max-w-xl bg-surface border border-line rounded-[2px]" />
      </div>

      {/* 1px line skeleton card grid matching resource cards */}
      <DirectorySkeleton />
    </main>
  );
}
