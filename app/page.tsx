'use client';

import React from 'react';
import { Hero } from '@/components/Hero';

/**
 * MARIA Homepage (/)
 *
 * Strict Architectural Purpose:
 * - Pure welcome and conversion entry point.
 * - Welcoming, cinematic hero with lightweight Yhwach — The Almighty responsive background.
 * - Concise explanation of the sovereign directory and 2,500 curated tools.
 * - Dominant CTA: "Explore Resources" navigating directly to /discover.
 * - Contains NO search bars, NO category grids, NO tool showcases, NO filters.
 */
export default function HomePage() {
  return (
    <div className="w-full bg-transparent text-bone flex flex-col">
      <Hero />
    </div>
  );
}
