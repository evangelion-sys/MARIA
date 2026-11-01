'use client';

import {
  animate,
  createTimeline,
  stagger,
  isReducedMotion,
  MOTION_TOKENS,
  animateCardGrid,
} from '@/lib/motion';

export { isReducedMotion, animateCardGrid, MOTION_TOKENS };

/**
 * Orchestrates an authoritative, monumental entrance sequence for hero headings and metadata.
 * Bleach TYBW aesthetic: Yhwach's monumental scale and Aizen's surgical timing.
 */
export function animateEditorialEntrance(
  containerEl: HTMLElement | null,
  options?: { delay?: number }
) {
  if (!containerEl || isReducedMotion()) return null;

  const titleLines = containerEl.querySelectorAll('.editorial-reveal-line');
  const metadataElements = containerEl.querySelectorAll('.editorial-reveal-meta');
  const dividerLine = containerEl.querySelector('.editorial-hairline');

  const tl = createTimeline({
    duration: MOTION_TOKENS.duration.cinematic,
  });

  if (metadataElements.length > 0) {
    tl.add(metadataElements, {
      opacity: [0, 1],
      translateY: [MOTION_TOKENS.displacement.subtle, 0],
      delay: stagger(MOTION_TOKENS.stagger.text, { start: options?.delay ?? 40 }),
      duration: MOTION_TOKENS.duration.deliberate,
      ease: 'outQuad',
    });
  }

  if (titleLines.length > 0) {
    tl.add(titleLines, {
      opacity: [0, 1],
      translateY: [MOTION_TOKENS.displacement.monumental, 0],
      delay: stagger(MOTION_TOKENS.stagger.text),
      duration: MOTION_TOKENS.duration.cinematic,
      ease: 'outCubic',
    }, '-=350');
  }

  if (dividerLine) {
    tl.add(dividerLine, {
      scaleX: [0, 1],
      opacity: [0, 1],
      duration: MOTION_TOKENS.duration.deliberate,
      ease: 'outQuad',
    }, '-=400');
  }

  return tl;
}

/**
 * Surgical pulse for active reishi indicators without garish neon animation.
 */
export function animateImperialPulse(element: HTMLElement | null) {
  if (!element || isReducedMotion()) return null;

  return animate(element, {
    opacity: [0.65, 1],
    duration: 2000,
    alternate: true,
    loop: true,
    ease: 'inOutSine',
  });
}
