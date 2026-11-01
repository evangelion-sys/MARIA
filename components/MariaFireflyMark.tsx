'use client';

import React from 'react';
import { MariaLogo } from '@/components/MariaLogo';

export interface MariaFireflyMarkProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'compact' | 'glowing' | 'monochrome';
  glow?: boolean;
  animated?: boolean;
}

/**
 * MARIA Sigil Brand Mark
 * 
 * Bleach TYBW Quincy sigil mark with cold reishi center node.
 * Maintains all existing props for backward compatibility.
 */
export function MariaFireflyMark({
  className = 'w-5 h-5 text-reishi',
  size,
  variant = 'default',
  glow,
  animated = false,
}: MariaFireflyMarkProps) {
  const isMonochrome = variant === 'monochrome';
  const isGlowing = glow !== undefined ? glow : variant === 'glowing';

  return (
    <MariaLogo
      variant={isMonochrome ? 'monochrome-symbol' : 'symbol'}
      className={className}
      size={size}
      glow={isGlowing}
      animated={animated}
      title="MARIA Sigil"
    />
  );
}
