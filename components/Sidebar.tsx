'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  Compass,
  Code2,
  Paintbrush,
  Film,
  Bot,
  Terminal,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  ShieldCheck,
  Globe,
  Orbit,
  LucideIcon,
} from 'lucide-react';
import { ResourceCategory } from '@/types/resource';
import { MariaLogo } from '@/components/MariaLogo';
import { TransitionLink } from '@/components/TransitionLink';
import { CATALOG_CATEGORY_COUNTS, CATALOG_TOTAL_COUNT } from '@/data/resource-stats';
import { isReducedMotion } from '@/lib/motion';
import { animate } from 'animejs';

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  selectedCategory: ResourceCategory | 'all';
  onSelectCategory: (cat: ResourceCategory | 'all') => void;
  onlyOpenSource: boolean;
  onToggleOpenSource: () => void;
  onResetFilters: () => void;
  savedCount: number;
  recentCount?: number;
  onOpenStackDrawer: () => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  activeTab?: 'directory' | 'ai' | 'stacks' | 'constellation';
  setActiveTab?: (tab: 'directory' | 'ai' | 'stacks' | 'constellation') => void;
}

interface CategoryDefinition {
  id: ResourceCategory | 'all';
  label: string;
  icon: LucideIcon;
}

const CATEGORY_ITEMS: CategoryDefinition[] = [
  { id: 'all', label: 'All Resources', icon: Compass },
  { id: 'dev', label: 'Development & Engineering', icon: Code2 },
  { id: 'design', label: 'Design & UI/UX', icon: Paintbrush },
  { id: 'ai', label: 'AI & Machine Learning', icon: Bot },
  { id: 'asset', label: '3D & Creative Assets', icon: Package },
  { id: 'video', label: 'Video & Audio Production', icon: Film },
  { id: 'api', label: 'Public APIs & Open Data', icon: Terminal },
];

const WORKSPACE_VIEWS: {
  id: 'directory' | 'ai' | 'stacks' | 'constellation';
  label: string;
  icon: LucideIcon;
}[] = [
  { id: 'directory', label: 'Directory Catalog', icon: Compass },
  { id: 'ai', label: 'AI Tools & Quotas', icon: Bot },
  { id: 'stacks', label: 'Starter Stacks', icon: Layers },
  { id: 'constellation', label: 'Category Map', icon: Globe },
];

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  selectedCategory,
  onSelectCategory,
  onlyOpenSource,
  onToggleOpenSource,
  onResetFilters,
  savedCount,
  onOpenStackDrawer,
  mobileOpen,
  setMobileOpen,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const mobileSheetRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);

  // Exact counts precomputed at build time from the canonical archive stats
  const categoryCounts: Record<ResourceCategory | 'all', number> = useMemo(() => ({
    all: CATALOG_TOTAL_COUNT,
    dev: CATALOG_CATEGORY_COUNTS['dev'] || 0,
    design: CATALOG_CATEGORY_COUNTS['design'] || 0,
    video: CATALOG_CATEGORY_COUNTS['video'] || 0,
    ai: CATALOG_CATEGORY_COUNTS['ai'] || 0,
    api: CATALOG_CATEGORY_COUNTS['api'] || 0,
    asset: CATALOG_CATEGORY_COUNTS['asset'] || 0,
  }), []);

  // Sliding active 2px reishi bar calculation
  const activeIndex = useMemo(() => {
    return CATEGORY_ITEMS.findIndex((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  // Mobile Bottom Sheet Focus Trap and Esc listener
  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Anime.js 400ms clip-path inset reveal for bottom sheet
    if (mobileSheetRef.current && !isReducedMotion()) {
      animate(mobileSheetRef.current, {
        clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
        duration: 400,
        ease: 'outExpo',
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }

      if (e.key === 'Tab' && mobileSheetRef.current) {
        const focusable = mobileSheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href]'
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
  }, [mobileOpen, setMobileOpen]);

  // Content for both Desktop Rail and Mobile Bottom Sheet
  const renderDisciplinesList = (isSheet = false) => (
    <div className="relative space-y-0.5">
      {/* 2px Sliding Reishi Bar on Left Edge (Desktop Rail only) */}
      {!isSheet && activeIndex !== -1 && (
        <span
          aria-hidden="true"
          className="absolute left-0 w-[2px] h-9 bg-reishi shadow-[0_0_8px_#8FD3FF] transition-all duration-300 ease-[var(--ease-aizen)] pointer-events-none"
          style={{
            transform: `translateY(${activeIndex * 38}px)`,
          }}
        />
      )}

      {CATEGORY_ITEMS.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        const count = categoryCounts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              onSelectCategory(cat.id);
              if (isSheet) setMobileOpen(false);
            }}
            title={isCollapsed && !isSheet ? `${cat.label} (${count})` : undefined}
            className={`w-full h-9 flex items-center justify-between px-3 text-[13px] font-sans font-medium transition-colors text-left group relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi ${
              isSelected ? 'text-bone font-semibold' : 'text-ash-400 hover:text-bone'
            } ${isCollapsed && !isSheet ? 'justify-center px-0' : ''}`}
          >
            {/* Left Icon + Label */}
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isSelected ? 'text-reishi' : 'text-ash-600 group-hover:text-bone'
                }`}
              />
              {(!isCollapsed || isSheet) && (
                <span className="truncate group-hover:translate-x-1 transition-transform duration-200">
                  {cat.label}
                </span>
              )}
            </div>

            {/* Right Tabular Count */}
            {(!isCollapsed || isSheet) && (
              <span
                className={`type-meta ml-2 shrink-0 transition-colors ${
                  isSelected ? 'text-reishi font-bold' : 'text-ash-600 group-hover:text-bone'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderWorkspaceViews = (isSheet = false) => {
    if (!setActiveTab) return null;
    return (
      <div className="space-y-0.5">
        {WORKSPACE_VIEWS.map((view) => {
          const Icon = view.icon;
          const isSelected = activeTab === view.id;

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => {
                setActiveTab(view.id);
                if (isSheet) setMobileOpen(false);
              }}
              title={isCollapsed && !isSheet ? view.label : undefined}
              className={`w-full h-9 flex items-center justify-between px-3 text-[13px] font-sans font-medium transition-colors text-left group relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi ${
                isSelected
                  ? 'text-bone font-semibold bg-surface/80 border-l-2 border-reishi'
                  : 'text-ash-400 hover:text-bone hover:bg-surface/40'
              } ${isCollapsed && !isSheet ? 'justify-center px-0' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isSelected ? 'text-reishi' : 'text-ash-600 group-hover:text-bone'
                  }`}
                />
                {(!isCollapsed || isSheet) && (
                  <span className="truncate group-hover:translate-x-1 transition-transform duration-200">
                    {view.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. Desktop Persistent Sidebar Rail                                */}
      {/* 264px expanded / 64px collapsed with 350ms ease-aizen transition   */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className={`hidden lg:block shrink-0 border-r border-line bg-surface/50 transition-[width] duration-350 ease-[var(--ease-aizen)] overflow-hidden select-none ${
          isCollapsed ? 'w-16' : 'w-[264px]'
        }`}
      >
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col justify-between">
          <div>
            {/* Top Bar: Brand Sigil & Collapse Toggle */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-line">
              <TransitionLink
                href="/"
                className={`flex items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi p-0.5 rounded-sm ${
                  isCollapsed ? 'justify-center w-full' : ''
                }`}
                aria-label="MARIA Home"
              >
                {isCollapsed ? (
                  <MariaLogo variant="symbol" size={18} animated={false} />
                ) : (
                  <MariaLogo variant="full" height={26} animated={false} />
                )}
              </TransitionLink>

              {/* Desktop Collapse / Expand Toggle */}
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 rounded-sm text-ash-400 hover:text-bone hover:bg-surface border border-transparent hover:border-line transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                  title="Collapse sidebar (64px)"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* When collapsed, expand button */}
            {isCollapsed && (
              <div className="p-2 border-b border-line flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsCollapsed(false)}
                  className="p-1.5 rounded-sm text-ash-400 hover:text-bone hover:bg-surface border border-line transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                  title="Expand sidebar (264px)"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Middle Scrollable Section: Disciplines, Workspaces & Invariants */}
            <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
              {/* Section 1: Categories */}
              <div className="space-y-1">
                {!isCollapsed && (
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="type-eyebrow text-ash-400">
                      Categories
                    </span>
                    {(selectedCategory !== 'all' || onlyOpenSource) && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="text-[10px] text-reishi hover:underline flex items-center gap-1 font-mono transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                )}

                {renderDisciplinesList(false)}
              </div>

              {/* Section 2: Workspace Views */}
              {setActiveTab && (
                <div className="space-y-1 pt-4 border-t border-line">
                  {!isCollapsed && (
                    <div className="px-2 mb-2">
                      <span className="type-eyebrow text-ash-400">
                        Workspace Views
                      </span>
                    </div>
                  )}

                  {renderWorkspaceViews(false)}
                </div>
              )}

              {/* Section 3: Access Standards */}
              <div className="space-y-1 pt-4 border-t border-line">
                {!isCollapsed && (
                  <div className="px-2 mb-2">
                    <span className="type-eyebrow text-ash-400">
                      Access Filters
                    </span>
                  </div>
                )}

                {!isCollapsed ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={onlyOpenSource}
                    onClick={onToggleOpenSource}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-sans text-ash-400 hover:text-bone hover:bg-surface/60 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck
                        className={`w-4 h-4 transition-colors ${
                          onlyOpenSource ? 'text-reishi' : 'text-ash-600'
                        }`}
                      />
                      <span>Open Source Only</span>
                    </div>

                    {/* Sliding Real Switch Track and Thumb */}
                    <div
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 border ${
                        onlyOpenSource
                          ? 'bg-reishi/20 border-reishi'
                          : 'bg-ink border-line'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-bone transition-transform duration-200 ${
                          onlyOpenSource ? 'translate-x-4 bg-reishi' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </button>
                ) : (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={onlyOpenSource}
                      onClick={onToggleOpenSource}
                      title={`Open Source Only: ${onlyOpenSource ? 'Enabled' : 'Disabled'}`}
                      className={`p-2 rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi ${
                        onlyOpenSource
                          ? 'border-reishi text-reishi bg-surface'
                          : 'border-line text-ash-600 hover:text-bone'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Active Stack + Revision Info */}
          <div className="p-3 border-t border-line space-y-2">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={onOpenStackDrawer}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-sans text-ash-400 hover:text-bone hover:bg-surface rounded-sm border border-line transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-reishi" />
                  <span className="uppercase text-[11px] tracking-wider font-medium">Active Stack</span>
                </div>
                <span className="font-bold tabular-nums text-reishi font-mono">{savedCount}</span>
              </button>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={onOpenStackDrawer}
                  title={`Active Stack (${savedCount})`}
                  className="p-2 rounded-sm border border-line text-ash-400 hover:text-bone hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                >
                  <Layers className="w-4 h-4 text-reishi" />
                </button>
              </div>
            )}

            {!isCollapsed && (
              <div className="px-2 pt-1 text-[10px] font-sans text-ash-600 flex justify-between">
                <span>MARIA ARCHIVE</span>
                <span className="text-reishi font-mono">REV 2026.10</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Mobile Bottom Sheet with Inset Clip-Path Reveal (400ms)         */}
      {/* Closes on scrim tap and Esc, focus trapped, drag handle           */}
      {/* ------------------------------------------------------------------ */}
      {mobileOpen && (
        <>
          {/* Scrim Backdrop */}
          <div
            ref={scrimRef}
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm lg:hidden transition-opacity"
          />

          {/* Bottom Sheet */}
          <div
            ref={mobileSheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter Disciplines"
            tabIndex={-1}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] z-50 bg-surface border-t border-line rounded-t-xl lg:hidden flex flex-col overflow-hidden shadow-2xl select-none"
            style={{
              clipPath: isReducedMotion() ? 'none' : 'inset(0% 0% 0% 0%)',
            }}
          >
            {/* Drag Handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <div className="w-10 h-1 bg-ash-600 rounded-full" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-line">
              <div className="flex items-center gap-2.5">
                <MariaLogo variant="symbol" size={18} animated={false} />
                <span className="type-eyebrow text-bone">Disciplines & Filters</span>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-sm text-ash-400 hover:text-bone border border-line"
                aria-label="Close sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Section 1: Workspaces & Views (if available) */}
              {setActiveTab && (
                <div className="space-y-2">
                  <span className="type-eyebrow text-ash-400">
                    Workspace Views
                  </span>
                  {renderWorkspaceViews(true)}
                </div>
              )}

              {/* Section 2: Categories */}
              <div className={`space-y-1 ${setActiveTab ? 'pt-4 border-t border-line' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="type-eyebrow text-ash-400">
                    Categories
                  </span>
                  {(selectedCategory !== 'all' || onlyOpenSource) && (
                    <button
                      type="button"
                      onClick={() => {
                        onResetFilters();
                        setMobileOpen(false);
                      }}
                      className="text-[11px] text-reishi hover:underline font-sans font-medium"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {renderDisciplinesList(true)}
              </div>

              {/* Open Source Switch */}
              <div className="pt-4 border-t border-line">
                <button
                  type="button"
                  role="switch"
                  aria-checked={onlyOpenSource}
                  onClick={onToggleOpenSource}
                  className="w-full flex items-center justify-between py-2 text-xs font-sans text-bone"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      className={`w-4 h-4 ${onlyOpenSource ? 'text-reishi' : 'text-ash-600'}`}
                    />
                    <span>Open Source (OSI Only)</span>
                  </div>

                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 border ${
                      onlyOpenSource ? 'bg-reishi/20 border-reishi' : 'bg-ink border-line'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-bone transition-transform duration-200 ${
                        onlyOpenSource ? 'translate-x-4 bg-reishi' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Active Stack Button in Mobile Sheet */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenStackDrawer();
                  }}
                  className="w-full py-2.5 px-4 rounded-sm bg-bone text-ink type-btn flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>View Active Stack</span>
                  </div>
                  <span className="bg-ink text-reishi px-2 py-0.5 rounded-xs tabular-nums text-xs font-mono font-bold">
                    {savedCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
