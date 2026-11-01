'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { animate } from 'animejs';
import { isReducedMotion } from '@/lib/motion';
import { MariaLogo } from '@/components/MariaLogo';

interface PageTransitionContextType {
  navigateWithTransition: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSigil, setShowSigil] = useState(false);
  const [announcedTitle, setAnnouncedTitle] = useState('');

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const edgeLineRef = useRef<HTMLDivElement | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const activeAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const sigilTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCoveredRef = useRef(false);

  // Cleanly cancel any running transition
  const cancelTransition = useCallback(() => {
    if (activeAnimationRef.current) {
      activeAnimationRef.current.revert?.();
      activeAnimationRef.current = null;
    }
    if (sigilTimeoutRef.current) {
      clearTimeout(sigilTimeoutRef.current);
      sigilTimeoutRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
    isCoveredRef.current = false;
    pendingHrefRef.current = null;
    setIsTransitioning(false);
    setShowSigil(false);
  }, []);

  // Listen to popstate (browser back/forward) to prevent stuck overlay
  useEffect(() => {
    const handlePopState = () => cancelTransition();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [cancelTransition]);

  // Reveal animation once new route has mounted
  const triggerReveal = useCallback(() => {
    const overlay = overlayRef.current;
    const edgeLine = edgeLineRef.current;

    if (!overlay || isReducedMotion()) {
      cancelTransition();
      window.scrollTo(0, 0);
      const mainEl = document.querySelector('main') as HTMLElement | null;
      if (mainEl) {
        mainEl.tabIndex = -1;
        mainEl.focus({ preventScroll: true });
      }
      setAnnouncedTitle(document.title);
      return;
    }

    // Wipe out the opposite way: polygon(0 0, 100% 0, 100% 100%, 0 100%) -> polygon(0 0, 0 0, 0 100%, 0 100%)
    activeAnimationRef.current = animate(overlay, {
      clipPath: [
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      ],
      duration: 450,
      ease: 'outExpo',
      onComplete: () => {
        // Reset scroll position to top after reveal
        window.scrollTo(0, 0);

        // Move focus to the main landmark and announce document title
        const mainEl = document.querySelector('main') as HTMLElement | null;
        if (mainEl) {
          mainEl.tabIndex = -1;
          mainEl.focus({ preventScroll: true });
        }
        setAnnouncedTitle(document.title);

        cancelTransition();
      },
    });

    if (edgeLine) {
      animate(edgeLine, {
        translateX: ['0vw', '-140vw'],
        duration: 450,
        ease: 'outExpo',
      });
    }
  }, [cancelTransition]);

  // When pathname updates to the pending destination, trigger the reveal
  useEffect(() => {
    if (isCoveredRef.current || isTransitioning) {
      isCoveredRef.current = false;
      triggerReveal();
    }
  }, [pathname, triggerReveal, isTransitioning]);

  const navigateWithTransition = useCallback(
    (href: string) => {
      // Reduced motion: instant route push
      if (isReducedMotion()) {
        router.push(href);
        return;
      }

      // Check if same pathname (hash or query only)
      try {
        const targetUrl = new URL(href, window.location.href);
        if (targetUrl.pathname === window.location.pathname) {
          router.push(href);
          return;
        }
      } catch {
        if (href.startsWith('#') || href.startsWith('?')) {
          router.push(href);
          return;
        }
      }

      // Guard: Cancel any running transition first
      cancelTransition();

      setIsTransitioning(true);
      setShowSigil(false);
      pendingHrefRef.current = href;

      // Show the 48px sigil in center only if navigation takes > 600ms
      sigilTimeoutRef.current = setTimeout(() => {
        setShowSigil(true);
      }, 600);

      // Failsafe timeout to prevent frozen overlay
      fallbackTimeoutRef.current = setTimeout(() => {
        cancelTransition();
      }, 1200);

      // Execute Yhwach cut cover animation
      requestAnimationFrame(() => {
        const overlay = overlayRef.current;
        const edgeLine = edgeLineRef.current;

        if (!overlay) {
          router.push(href);
          return;
        }

        activeAnimationRef.current = animate(overlay, {
          clipPath: [
            'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          ],
          duration: 450,
          ease: 'outExpo',
          onComplete: () => {
            isCoveredRef.current = true;
            router.push(href);
          },
        });

        if (edgeLine) {
          animate(edgeLine, {
            translateX: ['140vw', '0vw'],
            duration: 450,
            ease: 'outExpo',
          });
        }
      });
    },
    [cancelTransition, router, triggerReveal]
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}

      {/* Screen reader live region for announcing route change */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcedTitle}
      </div>

      {/* Yhwach Cut Transition Overlay */}
      {isTransitioning && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="fixed inset-0 z-[90] bg-ink pointer-events-auto flex items-center justify-center overflow-hidden"
          style={{
            clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          }}
        >
          {/* Traveling 2px Reishi Cutting Edge Line */}
          <div
            ref={edgeLineRef}
            className="absolute top-[-50vh] left-[-20vw] w-[2px] h-[200vh] bg-reishi shadow-[0_0_20px_#8FD3FF] pointer-events-none transform -rotate-45 origin-center"
            style={{ transform: 'translateX(140vw) rotate(-45deg)' }}
          />

          {/* 48px Sigil appears only if navigation takes longer than 600ms */}
          {showSigil && (
            <div className="relative z-10 animate-fade-in flex flex-col items-center gap-3">
              <MariaLogo variant="symbol" size={48} animated={true} glow={true} className="text-bone" />
              <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase">
                Loading...
              </span>
            </div>
          )}
        </div>
      )}
    </PageTransitionContext.Provider>
  );
}

export interface TransitionLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    Omit<LinkProps, 'as' | 'href'> {
  href: string;
}

/**
 * Drop-in wrapper around next/link providing Yhwach diagonal route transition wipes.
 * - Preserves prefetching, middle-click, and Cmd/Ctrl new-tab shortcuts.
 * - Skips transitions for hash and query-only links (/?cat=dev, #standards).
 * - Instant navigation under prefers-reduced-motion.
 */
export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, onClick, children, ...props }, ref) {
    const { navigateWithTransition } = usePageTransition();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);

      // Check modifier keys or new tab targets (middle-click, cmd/ctrl, shift, alt)
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        props.target === '_blank'
      ) {
        return;
      }

      // Skip transition if hash or query-only on the same pathname
      const hrefStr = href.toString();
      if (hrefStr.startsWith('#')) return;

      try {
        const targetUrl = new URL(hrefStr, window.location.href);
        if (targetUrl.pathname === pathname) {
          return;
        }
      } catch {
        if (hrefStr.startsWith('?')) return;
      }

      e.preventDefault();
      navigateWithTransition(hrefStr);
    };

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }
);
