'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Layers, Sparkles, Plus, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { MariaLogo } from '@/components/MariaLogo';
import { TransitionLink } from '@/components/TransitionLink';
import { CATALOG_TOTAL_COUNT } from '@/data/resource-stats';
import { isReducedMotion, splitReveal } from '@/lib/motion';
import { animate } from 'animejs';

interface NavbarProps {
  savedCount: number;
  onOpenStackDrawer: () => void;
  onOpenSubmitModal?: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const NAV_LINKS = [
  { href: '/', label: 'Home', numeral: '01' },
  { href: '/discover', label: 'Discover', numeral: '02' },
  { href: '/about', label: 'About', numeral: '03' },
  { href: '/faq', label: 'FAQ', numeral: '04' },
  { href: '/docs', label: 'Docs', numeral: '05' },
  { href: '/privacy', label: 'Privacy', numeral: '06' },
];

const CATEGORIES = [
  { href: '/discover', label: 'All Resources' },
  { href: '/discover?cat=dev', label: 'Development & Engineering' },
  { href: '/discover?cat=design', label: 'Design & UI/UX' },
  { href: '/discover?cat=ai', label: 'AI & Machine Learning' },
  { href: '/discover?cat=video', label: 'Video & Audio Production' },
  { href: '/discover?cat=asset', label: '3D & Creative Assets' },
  { href: '/discover?cat=api', label: 'Public APIs & Open Data' },
];

export function Navbar({
  savedCount,
  onOpenStackDrawer,
  onOpenSubmitModal,
  onToggleSidebar,
  showSidebarToggle,
}: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  // 1px sliding bone underline positioning
  const updateIndicator = useCallback(() => {
    const activeIndex = NAV_LINKS.findIndex((link) => {
      if (link.href === '/') return pathname === '/';
      return pathname.startsWith(link.href);
    });

    if (activeIndex !== -1 && linkRefs.current[activeIndex]) {
      const el = linkRefs.current[activeIndex];
      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      }
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [pathname]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  // Open / Close Menu Overlay with Yhwach Diagonal Wipe
  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  // Body scroll locking and Focus Trap inside Menu Overlay
  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Anime.js diagonal wipe entrance (600ms)
    if (overlayRef.current && !isReducedMotion()) {
      animate(overlayRef.current, {
        clipPath: [
          'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ],
        duration: 600,
        ease: 'outExpo',
      });

      // Split reveal on route items
      const items = overlayRef.current.querySelectorAll('.menu-route-item');
      items.forEach((item, idx) => {
        splitReveal(item as HTMLElement, { delay: 180 + idx * 80, duration: 650 });
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      {/* 56px High Header with 88% Ink, backdrop blur and subtle shadow */}
      <header className="sticky top-0 z-40 w-full h-14 bg-[#070709]/88 backdrop-blur-md border-b border-line/80 transition-colors shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-6 px-4 sm:px-6">
          {/* Left: Sigil + MARIA Lockup */}
          <div className="flex items-center shrink-0">
            <TransitionLink
              href="/"
              className="flex items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi p-0.5 rounded-[2px]"
              aria-label="MARIA Home"
            >
              {/* Responsive Logo System: Compact on mobile, Primary Horizontal on desktop */}
              <MariaLogo variant="compact" height={26} animated={false} className="sm:hidden" />
              <MariaLogo variant="horizontal" height={30} animated={false} className="hidden sm:inline-block" />
            </TransitionLink>
          </div>

          {/* Center (Desktop): Four Mono Links with Sliding 1px Bone Underline */}
          <nav
            className="hidden md:flex items-center relative h-full gap-8"
            aria-label="Primary Navigation"
          >
            {NAV_LINKS.map((link, idx) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[idx] = el;
                  }}
                  className={`type-nav transition-colors py-4 px-1 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi ${
                    isActive ? 'text-bone font-semibold' : 'text-ash-400 hover:text-bone font-medium'
                  }`}
                >
                  {link.label}
                </TransitionLink>
              );
            })}

            {/* Sliding 1px Bone Underline */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 h-[1px] bg-bone transition-all duration-400 ease-[var(--ease-aizen)] pointer-events-none"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
          </nav>

          {/* Right: Mobile Filter, My Stack, and Morphing Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Filter Disciplines Button (Rendered when directory is active on <lg) */}
            {showSidebarToggle && onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-sm text-ash-400 hover:text-bone hover:bg-surface border border-line transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                title="Filter Categories"
                aria-label="Filter Categories"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* My Stack Button */}
            <button
              type="button"
              onClick={onOpenStackDrawer}
              className="type-btn flex items-center gap-2 px-3 py-1.5 text-ink bg-bone hover:bg-[#E8E8E1] rounded-sm transition-all whitespace-nowrap shadow-sm border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi active:scale-[0.98]"
              aria-label={`Open My Stack (${savedCount} items)`}
            >
              <Layers className="w-3.5 h-3.5 text-ink" />
              <span className="hidden sm:inline">
                My Stack
              </span>
              {savedCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="px-1.5 py-0.2 rounded-xs bg-ink text-reishi type-meta font-bold"
                >
                  {savedCount}
                </span>
              )}
            </button>

            {/* Morphing 2-Line Menu Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={handleToggleMenu}
              aria-expanded={menuOpen}
              aria-controls="menu-overlay"
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-sm text-bone hover:bg-surface border border-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi"
            >
              {/* Top Line */}
              <span
                className={`w-4 h-[1.5px] bg-bone transition-transform duration-300 ease-[var(--ease-aizen)] ${
                  menuOpen ? 'translate-y-[4px] rotate-45' : ''
                }`}
              />
              {/* Bottom Line */}
              <span
                className={`w-4 h-[1.5px] bg-bone transition-transform duration-300 ease-[var(--ease-aizen)] ${
                  menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* MENU Overlay (All Breakpoints) */}
      {menuOpen && (
        <div
          id="menu-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 bg-ink text-bone flex flex-col justify-between overflow-y-auto p-6 sm:p-12 md:p-16 select-none"
          style={{
            clipPath: isReducedMotion()
              ? 'none'
              : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        >
          {/* Top Bar inside Menu */}
          <div className="flex items-center justify-between pb-6 border-b border-line">
            <TransitionLink
              href="/"
              onClick={closeMenu}
              className="flex items-center"
              aria-label="MARIA Home"
            >
              <MariaLogo variant="full" height={32} animated={false} />
            </TransitionLink>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close Menu"
              className="px-3 py-1.5 rounded-sm border border-line text-xs font-mono uppercase tracking-widest text-ash-400 hover:text-bone hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi"
            >
              [ Esc / Close ]
            </button>
          </div>

          {/* Main Menu Stage: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-10 my-auto items-center">
            {/* Left Column: Monumental Zodiak Routes with Shippori Mincho Numerals */}
            <div className="md:col-span-7 flex flex-col space-y-4 sm:space-y-6">
              {NAV_LINKS.map((link) => {
                const isHovered = hoveredRoute === link.href;
                const isAnyHovered = hoveredRoute !== null;
                const opacityClass =
                  isAnyHovered && !isHovered ? 'opacity-30' : 'opacity-100';

                return (
                  <div
                    key={link.href}
                    className="menu-route-item relative"
                    onMouseEnter={() => setHoveredRoute(link.href)}
                    onMouseLeave={() => setHoveredRoute(null)}
                  >
                    <TransitionLink
                      href={link.href}
                      onClick={closeMenu}
                      className={`group flex items-baseline transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi rounded-sm ${opacityClass}`}
                    >
                      {/* Route Number */}
                      <span
                        className={`font-mono text-base sm:text-xl mr-4 sm:mr-6 transition-colors duration-200 tabular-nums ${
                          isHovered ? 'text-reishi' : 'text-ash-600 group-hover:text-reishi'
                        }`}
                      >
                        {link.numeral}
                      </span>

                      {/* Cabinet Grotesk Monumental Route Type */}
                      <span className="font-display font-bold tracking-tight text-[clamp(2.5rem,6.5vw,5.25rem)] leading-none text-bone group-hover:text-bone">
                        {link.label}
                      </span>
                    </TransitionLink>

                    {/* 1px Drawing Hairline Underneath on Hover */}
                    <div
                      aria-hidden="true"
                      className={`h-[1px] bg-reishi transition-transform duration-300 origin-left mt-2 ${
                        isHovered ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Right Column (Desktop): Category List & Submit Resource */}
            <div className="hidden md:flex md:col-span-5 flex-col pl-8 border-l border-line space-y-8">
              <div className="space-y-3">
                <span className="type-eyebrow text-reishi flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Verified Disciplines</span>
                </span>
                <ul className="space-y-2 font-mono text-xs text-ash-400">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.href}>
                      <TransitionLink
                        href={cat.href}
                        onClick={closeMenu}
                        className="hover:text-bone transition-colors block py-1"
                      >
                        {cat.label}
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit Resource Callout */}
              <div className="pt-4 border-t border-line">
                {onOpenSubmitModal ? (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onOpenSubmitModal();
                    }}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-reishi hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Submit a Resource</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <TransitionLink
                    href="/about#standards"
                    onClick={closeMenu}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-reishi hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Submission Invariants</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </TransitionLink>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Index Revision + Slowly Rotating Sigil */}
          <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ash-600">
            <div>
              MARIA ARCHIVE · INDEX REV 2026.10 · {CATALOG_TOTAL_COUNT} ARTIFACTS LISTED
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-widest uppercase text-ash-400">
                Sovereign Knowledge
              </span>
              <MariaLogo variant="symbol" size={24} animated={true} glow={false} className="text-bone" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
