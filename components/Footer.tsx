'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  Compass,
  Layers,
  ShieldCheck,
  Plus,
  HelpCircle,
  FileText,
  Lock,
  ChevronDown,
  Info,
  Target,
  Sparkles,
  Zap,
  Github,
  Instagram,
} from 'lucide-react';
import { MariaLogo } from '@/components/MariaLogo';
import { TransitionLink } from '@/components/TransitionLink';
import { splitReveal, isReducedMotion, animate, stagger } from '@/lib/motion';
import { CATALOG_LAST_VERIFIED } from '@/data/resource-ids';
import { CATALOG_TOTAL_COUNT } from '@/data/resource-stats';

interface FooterProps {
  onOpenStackDrawer?: () => void;
  onOpenSubmitModal?: () => void;
}

/**
 * Reusable Footer Link with 1px underline that draws left-to-right on hover.
 */
function FooterLink({
  href,
  children,
  external = false,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  external?: boolean;
  onClick?: () => void;
}) {
  const innerContent = (
    <span className="group relative inline-flex items-center gap-1 text-ash-400 hover:text-bone transition-colors py-1 font-sans text-[13px] select-none">
      <span>{children}</span>
      {external && <ArrowUpRight className="w-3 h-3 text-reishi shrink-0" />}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-[1px] bg-reishi origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out pointer-events-none"
      />
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[2px]"
      >
        {innerContent}
      </button>
    );
  }

  if (external && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[2px]"
      >
        {innerContent}
      </a>
    );
  }

  if (href) {
    return (
      <TransitionLink
        href={href}
        className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[2px]"
      >
        {innerContent}
      </TransitionLink>
    );
  }

  return null;
}

export function Footer({ onOpenStackDrawer, onOpenSubmitModal }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const wordmarkRef = useRef<HTMLDivElement | null>(null);

  // Derive latest index revision from catalog constants
  const indexRevision = CATALOG_LAST_VERIFIED.slice(0, 7).replace('-', '.');

  // Mobile accordion state for informational cards
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'purpose' | 'vision' | 'why' | null>(null);

  // Trigger character-by-character split reveal when giant wordmark enters viewport
  useEffect(() => {
    if (!wordmarkRef.current || isReducedMotion()) return;

    const el = wordmarkRef.current;
    let observer: IntersectionObserver | null = null;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chars = el.querySelectorAll('.maria-footer-char');
            if (chars.length > 0) {
              animate(chars as any, {
                opacity: [0, 1],
                translateY: ['80%', '0%'],
                delay: stagger(60),
                duration: 750,
                ease: 'outExpo',
              });
            } else {
              splitReveal(el, { chars: true, stagger: 60, duration: 750 });
            }
            observer?.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer?.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    if (isReducedMotion()) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    if (typeof (window as any).__lenis?.scrollTo === 'function') {
      (window as any).__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleInfoSection = (section: 'about' | 'purpose' | 'vision' | 'why') => {
    setActiveInfoTab((curr) => (curr === section ? null : section));
  };

  return (
    <footer className="w-full bg-ink border-t border-line text-ash-400 text-xs pt-0 pb-0 relative overflow-hidden font-sans select-none">
      {/* Top 1px Reishi Boundary Hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-reishi/30 to-transparent" />

      {/* 1. Huge MARIA Wordmark in Zodiak Cropped by Bottom Edge */}
      <div className="w-full overflow-hidden pointer-events-none select-none flex justify-center border-b border-line pb-0 mb-10">
        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="font-display font-black tracking-tight text-bone opacity-[0.07] text-[clamp(4rem,20vw,17.5rem)] leading-[0.78] translate-y-[22%] will-change-transform flex justify-center whitespace-nowrap"
        >
          {['M', 'A', 'R', 'I', 'A'].map((char, idx) => (
            <span key={idx} className="inline-block maria-footer-char">
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* 2. Structured Information Architecture Panels: About, Purpose, Vision, Why MARIA */}
        <section
          aria-label="Platform Architecture and Purpose"
          className="rounded-xl border border-line bg-surface/60 backdrop-blur-md overflow-hidden"
        >
          {/* Header Strip */}
          <div className="px-6 py-4 border-b border-line flex flex-wrap items-center justify-between gap-4 bg-ink/40">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-reishi" aria-hidden="true" />
              <h2 className="font-display text-sm font-semibold text-bone">
                Platform Architecture &amp; Overview
              </h2>
            </div>
            <div className="text-[11px] font-mono text-ash-600">
              {CATALOG_TOTAL_COUNT.toLocaleString()} Listed Resources · 6 Disciplines
            </div>
          </div>

          {/* Desktop 4-Column Grid / Mobile Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line text-left">
            {/* Panel 1: About MARIA */}
            <div className="p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-reishi text-xs font-mono uppercase tracking-wider font-semibold">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>About MARIA</span>
                </div>
                <h3 className="font-display text-base font-semibold text-bone">
                  Independent Registry
                </h3>
                <p className="text-xs text-ash-400 leading-relaxed">
                  A curated digital catalogue of {CATALOG_TOTAL_COUNT.toLocaleString()} tools, open-source libraries, and APIs. Built to serve engineers, designers, 3D artists, video editors, and creative practitioners with direct official references.
                </p>
              </div>
              <div className="pt-3">
                <TransitionLink
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-reishi hover:text-white transition-colors"
                >
                  <span>Read Archive Story</span>
                  <ArrowUpRight className="w-3 h-3" />
                </TransitionLink>
              </div>
            </div>

            {/* Panel 2: Practical Purpose & Goal */}
            <div className="p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-reishi text-xs font-mono uppercase tracking-wider font-semibold">
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span>Purpose &amp; Goal</span>
                </div>
                <h3 className="font-display text-base font-semibold text-bone">
                  Focus Over Fragmentation
                </h3>
                <p className="text-xs text-ash-400 leading-relaxed">
                  Addresses the difficulty of locating genuine digital creation tools without sorting through affiliate blogs or trial traps. Our goal is to provide a reliable, structured index with verified tier quotas and official links.
                </p>
              </div>
              <div className="pt-3">
                <TransitionLink
                  href="/about#purpose"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-reishi hover:text-white transition-colors"
                >
                  <span>Operating Mission</span>
                  <ArrowUpRight className="w-3 h-3" />
                </TransitionLink>
              </div>
            </div>

            {/* Panel 3: Vision (Aspiration vs Reality) */}
            <div className="p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-reishi text-xs font-mono uppercase tracking-wider font-semibold">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Platform Vision</span>
                </div>
                <h3 className="font-display text-base font-semibold text-bone">
                  The Sovereign Companion
                </h3>
                <p className="text-xs text-ash-400 leading-relaxed">
                  Our aspiration is to map the connections between tools. Currently implemented: local stack building and catalog filtering. Planned for future phases: automated link validation and relational tool pairings.
                </p>
              </div>
              <div className="pt-3">
                <TransitionLink
                  href="/about#vision"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-reishi hover:text-white transition-colors"
                >
                  <span>Future Roadmap</span>
                  <ArrowUpRight className="w-3 h-3" />
                </TransitionLink>
              </div>
            </div>

            {/* Panel 4: Why MARIA? */}
            <div className="p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-reishi text-xs font-mono uppercase tracking-wider font-semibold">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Why MARIA?</span>
                </div>
                <h3 className="font-display text-base font-semibold text-bone">
                  Factual Access Terms
                </h3>
                <p className="text-xs text-ash-400 leading-relaxed">
                  Clear separation between OSI open source and free tiers, zero tracking cookies, client-side stack management with JSON export, and verified direct links to canonical documentation and source repositories.
                </p>
              </div>
              <div className="pt-3">
                <TransitionLink
                  href="/about#why"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-reishi hover:text-white transition-colors"
                >
                  <span>Discovery Standards</span>
                  <ArrowUpRight className="w-3 h-3" />
                </TransitionLink>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Main 12-Column Responsive Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-left">
          {/* Brand & Discovery Entry CTA (Col span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <TransitionLink
              href="/"
              className="group inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[2px]"
              aria-label="MARIA Archive Home"
            >
              <MariaLogo variant="horizontal" height={32} animated={false} glow={false} />
            </TransitionLink>

            <p className="type-body text-sm text-ash-400 leading-relaxed max-w-sm">
              An authoritative archive indexing {CATALOG_TOTAL_COUNT.toLocaleString()} open-source frameworks, zero-paywall APIs, 3D pipelines, and creative engineering tools.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <TransitionLink
                href="/discover"
                className="type-btn px-4 py-2.5 rounded-[4px] bg-bone hover:bg-[#e8e8e1] text-ink text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
              >
                <Compass className="w-3.5 h-3.5 text-ink" />
                <span>Open Discovery</span>
              </TransitionLink>

              {onOpenSubmitModal && (
                <button
                  type="button"
                  onClick={onOpenSubmitModal}
                  className="type-btn px-3.5 py-2.5 rounded-[4px] bg-surface hover:bg-ink text-bone text-xs font-medium transition-colors border border-line hover:border-reishi/50 inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                >
                  <Plus className="w-3.5 h-3.5 text-reishi" />
                  <span>Suggest Resource</span>
                </button>
              )}
            </div>
          </div>

          {/* Column 1: Discovery Workspace (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="type-eyebrow text-reishi block">
              DISCOVERY
            </span>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/discover">All Resources ({CATALOG_TOTAL_COUNT})</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?tab=stacks">Starter Stacks</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?tab=ai">AI Tools &amp; Quotas</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?tab=constellation">Category Guide</FooterLink>
              </li>
              {onOpenStackDrawer && (
                <li>
                  <FooterLink onClick={onOpenStackDrawer}>
                    Workspace Stack
                  </FooterLink>
                </li>
              )}
            </ul>
          </div>

          {/* Column 2: Catalog Disciplines (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="type-eyebrow text-reishi block">
              DISCIPLINES
            </span>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/discover?cat=dev">Development &amp; Engineering</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?cat=design">Design &amp; UI/UX</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?cat=ai">AI &amp; Machine Learning</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?cat=video">Video &amp; Audio Production</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?cat=asset">3D &amp; Creative Assets</FooterLink>
              </li>
              <li>
                <FooterLink href="/discover?cat=api">Public APIs &amp; Open Data</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Information & Principles (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="type-eyebrow text-reishi block">
              INFORMATION
            </span>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/about">About MARIA</FooterLink>
              </li>
              <li>
                <FooterLink href="/docs">Documentation</FooterLink>
              </li>
              <li>
                <FooterLink href="/about#purpose">Purpose &amp; Goal</FooterLink>
              </li>
              <li>
                <FooterLink href="/about#vision">Vision &amp; Ambition</FooterLink>
              </li>
              <li>
                <FooterLink href="/about#why">Why MARIA?</FooterLink>
              </li>
              <li>
                <FooterLink href="/faq">Frequently Asked</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Standards (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="type-eyebrow text-reishi block">
              GOVERNANCE
            </span>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink href="/privacy#storage">Storage Disclosures</FooterLink>
              </li>
              <li>
                <FooterLink href="/terms">Terms of Use</FooterLink>
              </li>
              <li>
                <FooterLink href="/about#licensing-standards">Licensing Taxonomy</FooterLink>
              </li>
              <li>
                <FooterLink href="/docs">Architecture &amp; Data</FooterLink>
              </li>
              <li>
                <FooterLink href="https://github.com/evangelion-sys" external>
                  Curator GitHub
                </FooterLink>
              </li>
              <li>
                <FooterLink href="https://www.instagram.com/kernel.bat?srtk=MWYxNXl4anBkeG5ucA==" external>
                  Curator Instagram
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Middle Authority Strip: Quincy Sigil + Curatorial Invariants */}
        <div className="pt-8 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 text-bone/80" aria-hidden="true">
              <MariaLogo variant="symbol" size={56} animated={true} glow={false} />
            </div>

            <div className="space-y-1 text-left">
              <div className="font-display text-sm font-semibold text-bone flex items-center gap-2">
                <span>MARIA · Curatorial Registry</span>
                <span className="text-line">·</span>
                <span className="text-[11px] font-mono text-reishi font-normal">Independent Index</span>
              </div>
              <p className="text-[11px] text-ash-400 max-w-xl leading-relaxed">
                Zero advertising trackers. Zero sponsored ranking. Curated and maintained by{' '}
                <a
                  href="https://github.com/evangelion-sys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone hover:text-reishi underline underline-offset-2 transition-colors font-medium"
                >
                  evangelion-sys
                </a>
                . All third-party trademarks and software remain the property of their respective creators and foundations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-ash-400">
            <a
              href="https://github.com/evangelion-sys"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bone transition-colors flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-[3px] bg-surface border border-line hover:border-reishi/50 text-ash-300"
              title="Curator GitHub profile (opens in new tab)"
              aria-label="evangelion-sys GitHub profile (opens in new tab)"
            >
              <Github className="w-3.5 h-3.5 text-reishi shrink-0" />
              <span>@evangelion-sys</span>
              <ArrowUpRight className="w-3 h-3 text-ash-600 shrink-0" />
            </a>

            <a
              href="https://www.instagram.com/kernel.bat?srtk=MWYxNXl4anBkeG5ucA=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bone transition-colors flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-[3px] bg-surface border border-line hover:border-reishi/50 text-ash-300"
              title="Curator Instagram profile (opens in new tab)"
              aria-label="kernel.bat Instagram profile (opens in new tab)"
            >
              <Instagram className="w-3.5 h-3.5 text-reishi shrink-0" />
              <span>@kernel.bat</span>
              <ArrowUpRight className="w-3 h-3 text-ash-600 shrink-0" />
            </a>

            <TransitionLink
              href="/faq"
              className="hover:text-bone transition-colors flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-[3px] border border-transparent hover:border-line"
            >
              <HelpCircle className="w-3.5 h-3.5 text-reishi shrink-0" />
              <span>FAQ</span>
            </TransitionLink>
          </div>
        </div>

        {/* 5. Bottom Utility Bar: Computed Year, Index Revision, Back to Top */}
        <div className="pb-8 pt-6 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-ash-600">
          <div>
            &copy; {currentYear} MARIA. SOURCED AND AUDITED FOR OPEN DISCOVERY.
          </div>

          <div className="flex items-center gap-2">
            <span>{CATALOG_TOTAL_COUNT.toLocaleString()} ARTIFACTS LISTED</span>
            <span aria-hidden="true" className="text-ash-600">·</span>
            <span>INDEX REVISION {indexRevision}</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-surface hover:bg-ink text-bone font-mono text-xs uppercase tracking-wider transition-colors border border-line hover:border-reishi/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer active:scale-95"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-reishi group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
