'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ResourceItem, ResourceCategory } from '@/types/resource';
import { ResourceCard } from './ResourceCard';
import { animateCardGrid } from '@/lib/cinematic-motion';
import {
  CANONICAL_CATEGORIES,
  normalizeSubcategory,
} from '@/lib/category-taxonomy';
import {
  X,
  Code2,
  Paintbrush,
  Film,
  Bot,
  Terminal,
  Package,
  Sparkles,
  LayoutGrid,
  List,
  Check,
  ExternalLink,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Lock,
} from 'lucide-react';

interface ResourceDirectoryProps {
  resources: ResourceItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onInspect: (resource: ResourceItem) => void;
  selectedCategory: ResourceCategory | 'all';
  setSelectedCategory: (c: ResourceCategory | 'all') => void;
  onlyOpenSource: boolean;
  setOnlyOpenSource: (oss: boolean) => void;
  initialSubcategory?: string;
  onOpenSubmitModal?: () => void;
}

const CATEGORY_TABS: {
  id: ResourceCategory | 'all';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'all', label: 'All Resources', icon: Sparkles },
  { id: 'dev', label: 'Development & Engineering', icon: Code2 },
  { id: 'design', label: 'Design & UI/UX', icon: Paintbrush },
  { id: 'ai', label: 'AI & Machine Learning', icon: Bot },
  { id: 'asset', label: '3D & Creative Assets', icon: Package },
  { id: 'video', label: 'Video & Audio Production', icon: Film },
  { id: 'api', label: 'Public APIs & Open Data', icon: Terminal },
];

export function ResourceDirectory({
  resources,
  savedIds,
  onToggleSave,
  onInspect,
  selectedCategory,
  setSelectedCategory,
  onlyOpenSource,
  setOnlyOpenSource,
  initialSubcategory,
  onOpenSubmitModal,
}: ResourceDirectoryProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    initialSubcategory ? normalizeSubcategory(initialSubcategory) : 'all'
  );
  const [prevSubcategory, setPrevSubcategory] = useState<string | undefined>(initialSubcategory);

  if (initialSubcategory !== prevSubcategory) {
    setPrevSubcategory(initialSubcategory);
    setSelectedSubcategory(initialSubcategory ? normalizeSubcategory(initialSubcategory) : 'all');
  }

  const [selectedAccessModel, setSelectedAccessModel] = useState<string>('all');
  const [onlyNoAuth, setOnlyNoAuth] = useState(false);
  const [only100Free, setOnly100Free] = useState(false);
  const [onlyNoCard, setOnlyNoCard] = useState(false);
  const [sortBy, setSortBy] = useState<'curated' | 'name' | 'name-desc' | 'subcategory'>('curated');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [displayCount, setDisplayCount] = useState<number>(48);
  const [isMobileFiltersExpanded, setIsMobileFiltersExpanded] = useState<boolean>(false);

  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Compute exact counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: resources.length };
    for (const r of resources) {
      counts[r.category] = (counts[r.category] || 0) + 1;
    }
    return counts;
  }, [resources]);

  // Compute consolidated subcategories and counts for current category
  const { availableSubcategories, subcategoryCounts } = useMemo(() => {
    const pool =
      selectedCategory === 'all'
        ? resources
        : resources.filter((r) => r.category === selectedCategory);

    const counts: Record<string, number> = { all: pool.length };
    const subcatsSet = new Set<string>();

    for (const r of pool) {
      const norm = normalizeSubcategory(r.subcategory, r.category);
      subcatsSet.add(norm);
      counts[norm] = (counts[norm] || 0) + 1;
    }

    // When a specific category is selected, respect its workflow order
    let sortedSubcats: string[];
    if (selectedCategory !== 'all' && CANONICAL_CATEGORIES[selectedCategory]?.subcategories) {
      const canonicalOrder = CANONICAL_CATEGORIES[selectedCategory].subcategories;
      sortedSubcats = Array.from(subcatsSet).sort((a, b) => {
        const idxA = canonicalOrder.indexOf(a);
        const idxB = canonicalOrder.indexOf(b);
        const rankA = idxA === -1 ? 999 : idxA;
        const rankB = idxB === -1 ? 999 : idxB;
        if (rankA !== rankB) return rankA - rankB;
        return a.localeCompare(b);
      });
    } else {
      // For all resources, sort by count descending then alphabetically
      sortedSubcats = Array.from(subcatsSet).sort((a, b) => {
        const countDiff = (counts[b] || 0) - (counts[a] || 0);
        if (countDiff !== 0) return countDiff;
        return a.localeCompare(b);
      });
    }

    return {
      availableSubcategories: ['all', ...sortedSubcats],
      subcategoryCounts: counts,
    };
  }, [resources, selectedCategory]);

  // Filter and sorting logic with normalized subcategories (pure browsing, no search)
  const filteredResources = useMemo(() => {
    return resources
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Consolidated Subcategory filter
        const itemSubcategory = normalizeSubcategory(item.subcategory, item.category);
        if (selectedSubcategory !== 'all' && itemSubcategory !== selectedSubcategory) {
          return false;
        }

        // Access Model filter
        if (selectedAccessModel !== 'all') {
          if (selectedAccessModel === 'open-source' && !item.openSource) return false;
          if (selectedAccessModel === 'free-no-account' && item.authRequired) return false;
          if (selectedAccessModel === 'free-tier' && item.pricingType !== 'Freemium' && item.pricingType !== 'Free with Limits') return false;
          if (selectedAccessModel === 'self-hosted' && item.accessModel !== 'self-hosted' && !item.tags.includes('Self-Hosted')) return false;
        }

        // Open Source filter
        if (onlyOpenSource && !item.openSource) {
          return false;
        }

        // No Auth / Anonymous filter
        if (onlyNoAuth && item.authRequired) {
          return false;
        }

        // 100% Free / CC0 filter
        if (only100Free && item.pricingType !== 'Free' && item.pricingType !== 'Open Source') {
          return false;
        }

        // No Credit Card required
        if (onlyNoCard && item.creditCardRequired) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'subcategory') {
          const subA = normalizeSubcategory(a.subcategory, a.category);
          const subB = normalizeSubcategory(b.subcategory, b.category);
          return subA.localeCompare(subB) || a.name.localeCompare(b.name);
        }
        // Curated default order: preserves the deliberate static editorial order of the catalogue
        return 0;
      });
  }, [
    resources,
    selectedCategory,
    selectedSubcategory,
    selectedAccessModel,
    onlyOpenSource,
    onlyNoAuth,
    only100Free,
    onlyNoCard,
    sortBy,
  ]);

  // Reset pagination on filter change
  useEffect(() => {
    setDisplayCount(48);
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedAccessModel,
    onlyOpenSource,
    onlyNoAuth,
    only100Free,
    onlyNoCard,
    sortBy,
  ]);

  const displayedResources = useMemo(() => {
    return filteredResources.slice(0, displayCount);
  }, [filteredResources, displayCount]);

  // Animate cards on category or viewMode change
  const prevFilterKeyRef = useRef<string>('');
  useEffect(() => {
    const currentFilterKey = `${selectedCategory}:${selectedSubcategory}:${selectedAccessModel}:${onlyOpenSource}:${onlyNoAuth}:${only100Free}:${onlyNoCard}:${viewMode}`;
    const isMajorFilterChange = prevFilterKeyRef.current !== currentFilterKey;
    prevFilterKeyRef.current = currentFilterKey;

    if (isMajorFilterChange && gridContainerRef.current) {
      const cards = gridContainerRef.current.querySelectorAll('article');
      if (cards.length > 0) {
        animateCardGrid(cards, { stagger: 15 });
      }
    }
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedAccessModel,
    onlyOpenSource,
    onlyNoAuth,
    only100Free,
    onlyNoCard,
    viewMode,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedAccessModel('all');
    setOnlyOpenSource(false);
    setOnlyNoAuth(false);
    setOnly100Free(false);
    setOnlyNoCard(false);
    setSortBy('curated');
    setDisplayCount(48);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    selectedAccessModel !== 'all' ||
    onlyOpenSource ||
    onlyNoAuth ||
    only100Free ||
    onlyNoCard ||
    sortBy !== 'curated';

  return (
    <section id="directory" className="py-4 max-w-7xl mx-auto w-full select-none">
      {/* 1. Clear Discovery Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-line">
        <div>
          <span className="type-eyebrow block mb-1 text-reishi">
            Directory
          </span>
          <h2 className="type-section-title text-bone">
            {selectedCategory === 'all'
              ? 'All Resources'
              : CANONICAL_CATEGORIES[selectedCategory]?.name || 'Resources'}
          </h2>
          <p className="type-supporting text-ash-400 mt-1 max-w-2xl text-xs sm:text-sm">
            {selectedCategory === 'all'
              ? `Browse ${resources.length.toLocaleString()} tools across development, design, audio, video, 3D, and APIs. Select a category below to narrow your selection.`
              : CANONICAL_CATEGORIES[selectedCategory]?.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="type-meta text-ash-400">
            Showing <strong className="text-bone">{displayedResources.length}</strong> of {filteredResources.length}
            {filteredResources.length !== resources.length && (
              <span className="text-ash-400"> ({resources.length} total)</span>
            )}
          </span>

          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 bg-ink border border-line rounded-[4px]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[2px] transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-surface text-reishi'
                  : 'text-ash-400 hover:text-bone'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-[2px] transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-surface text-reishi'
                  : 'text-ash-400 hover:text-bone'
              }`}
              title="Compact list view"
              aria-label="Compact list view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenSubmitModal && (
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="type-btn flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-surface hover:bg-ink border border-reishi/40 text-reishi transition-colors shadow-sm focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none cursor-pointer text-xs"
            >
              <span>Suggest Tool</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Primary Category Navigation with Live Counts */}
      <div
        className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none pb-2 -mx-2 px-2 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="Resource categories"
      >
        {CATEGORY_TABS.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubcategory('all');
              }}
              className={`type-btn flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-[2px] transition-all whitespace-nowrap focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none cursor-pointer ${
                isSelected
                  ? 'bg-surface text-bone border border-reishi/60 shadow-sm font-bold'
                  : 'bg-ink/80 text-ash-400 border border-line hover:text-bone hover:border-ash-400/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-reishi' : 'text-ash-400'}`} />
              <span>{cat.label}</span>
              <span className={`type-meta ml-0.5 ${isSelected ? 'text-reishi font-semibold' : 'text-ash-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Refinement, Subcategory Navigation & Access Filters */}
      <div className="glass-panel rounded-[6px] p-4 sm:p-5 mb-6 space-y-3.5">
        {/* Top Control Bar: Access Model & Sort Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Access Model Selector */}
            <div className="flex items-center gap-2">
              <span className="type-eyebrow text-ash-400 whitespace-nowrap">Access type:</span>
              <select
                value={selectedAccessModel}
                onChange={(e) => setSelectedAccessModel(e.target.value)}
                className="px-3 py-1.5 bg-ink border border-line rounded-[4px] type-input text-xs text-bone focus:outline-none focus:border-reishi"
              >
                <option value="all">All Access Types</option>
                <option value="open-source">Open Source Only</option>
                <option value="free-no-account">No Sign-up Required</option>
                <option value="free-tier">Free Tier Allowance</option>
                <option value="self-hosted">Self-Hostable</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="type-eyebrow text-ash-400 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-ink border border-line rounded-[4px] type-input text-xs text-bone focus:outline-none focus:border-reishi"
              >
                <option value="curated">Default Order</option>
                <option value="name">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="subcategory">By Subcategory</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileFiltersExpanded(!isMobileFiltersExpanded)}
            className="sm:hidden flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-ink border border-line rounded type-btn text-ash-400 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-reishi" />
            <span>{isMobileFiltersExpanded ? 'Hide filters' : 'Refine filters'}</span>
          </button>
        </div>

        {/* Subcategories & Invariant Toggles */}
        <div className={`space-y-3 pt-3 border-t border-line text-xs ${isMobileFiltersExpanded ? 'block' : 'hidden sm:block'}`}>
          {/* Subcategory interactive buttons with accurate counts */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="type-eyebrow text-ash-400 mr-1">Subcategory:</span>
            {availableSubcategories.map((sub) => {
              const count = subcategoryCounts[sub] ?? 0;
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-2.5 py-1 rounded-[2px] font-sans text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-ink text-reishi border border-reishi/50 font-semibold'
                      : 'text-ash-400 hover:text-bone hover:bg-ink/50'
                  }`}
                >
                  {sub === 'all' ? 'All Subcategories' : sub}
                  <span className={`type-meta ml-1 ${isSelected ? 'text-reishi font-semibold' : 'text-ash-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Checkboxes */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line/50">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyOpenSource(!onlyOpenSource)}
                className={`type-btn flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border transition-colors whitespace-nowrap cursor-pointer ${
                  onlyOpenSource
                    ? 'bg-reishi/15 text-reishi border-reishi/50 font-medium'
                    : 'bg-ink text-ash-400 border-line hover:text-bone'
                }`}
              >
                <Check className={`w-3 h-3 ${onlyOpenSource ? 'opacity-100' : 'opacity-30'}`} />
                <ShieldCheck className="w-3 h-3 text-reishi" />
                <span>Open Source</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyNoAuth(!onlyNoAuth)}
                className={`type-btn flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border transition-colors whitespace-nowrap cursor-pointer ${
                  onlyNoAuth
                    ? 'bg-reishi/15 text-reishi border-reishi/50 font-medium'
                    : 'bg-ink text-ash-400 border-line hover:text-bone'
                }`}
              >
                <Check className={`w-3 h-3 ${onlyNoAuth ? 'opacity-100' : 'opacity-30'}`} />
                <Lock className="w-3 h-3 text-reishi" />
                <span>No Account Needed</span>
              </button>

              <button
                type="button"
                onClick={() => setOnly100Free(!only100Free)}
                className={`type-btn flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border transition-colors whitespace-nowrap cursor-pointer ${
                  only100Free
                    ? 'bg-reishi/15 text-reishi border-reishi/50 font-medium'
                    : 'bg-ink text-ash-400 border-line hover:text-bone'
                }`}
              >
                <Check className={`w-3 h-3 ${only100Free ? 'opacity-100' : 'opacity-30'}`} />
                <span>100% Free Forever</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyNoCard(!onlyNoCard)}
                className={`type-btn flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border transition-colors whitespace-nowrap cursor-pointer ${
                  onlyNoCard
                    ? 'bg-reishi/15 text-reishi border-reishi/50 font-medium'
                    : 'bg-ink text-ash-400 border-line hover:text-bone'
                }`}
              >
                <Check className={`w-3 h-3 ${onlyNoCard ? 'opacity-100' : 'opacity-30'}`} />
                <CreditCard className="w-3 h-3 text-reishi" />
                <span>No Credit Card</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-ash-400 hover:text-reishi transition-colors font-sans text-xs cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-line text-xs font-sans">
            <span className="type-eyebrow text-ash-400 text-[10px]">Active Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-ink border border-line text-bone text-[11px]">
                Category: {CANONICAL_CATEGORIES[selectedCategory]?.shortName || selectedCategory}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  }}
                  className="text-ash-400 hover:text-reishi ml-0.5 cursor-pointer"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-ink border border-line text-bone text-[11px]">
                Subcategory: {selectedSubcategory}
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className="text-ash-400 hover:text-reishi ml-0.5 cursor-pointer"
                  aria-label="Remove subcategory filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedAccessModel !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-ink border border-line text-bone text-[11px]">
                Access: {selectedAccessModel}
                <button
                  type="button"
                  onClick={() => setSelectedAccessModel('all')}
                  className="text-ash-400 hover:text-reishi ml-0.5 cursor-pointer"
                  aria-label="Remove access model filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyOpenSource && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-reishi/10 border border-reishi/30 text-reishi text-[11px]">
                Open Source
                <button
                  type="button"
                  onClick={() => setOnlyOpenSource(false)}
                  className="hover:text-bone ml-0.5 cursor-pointer"
                  aria-label="Remove open source filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyNoAuth && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-reishi/10 border border-reishi/30 text-reishi text-[11px]">
                No Sign-up
                <button
                  type="button"
                  onClick={() => setOnlyNoAuth(false)}
                  className="hover:text-bone ml-0.5 cursor-pointer"
                  aria-label="Remove no auth filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {only100Free && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-reishi/10 border border-reishi/30 text-reishi text-[11px]">
                100% Free
                <button
                  type="button"
                  onClick={() => setOnly100Free(false)}
                  className="hover:text-bone ml-0.5 cursor-pointer"
                  aria-label="Remove 100% free filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyNoCard && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-reishi/10 border border-reishi/30 text-reishi text-[11px]">
                No Credit Card
                <button
                  type="button"
                  onClick={() => setOnlyNoCard(false)}
                  className="hover:text-bone ml-0.5 cursor-pointer"
                  aria-label="Remove no card filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sortBy !== 'curated' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-ink border border-line text-ash-400 text-[11px]">
                Sorted by {sortBy}
                <button
                  type="button"
                  onClick={() => setSortBy('curated')}
                  className="text-ash-400 hover:text-reishi ml-0.5 cursor-pointer"
                  aria-label="Reset sorting"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. Directory Content Results */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-[6px] border border-line bg-surface/90 space-y-5">
          <div className="w-10 h-10 mx-auto rounded-full bg-ink border border-line flex items-center justify-center text-ash-400">
            <SlidersHorizontal className="w-5 h-5 text-reishi" />
          </div>

          <div>
            <h3 className="type-h3 text-bone">No Matching Resources</h3>
            <p className="type-body-sm text-ash-400 mt-1 max-w-md mx-auto text-xs sm:text-sm">
              No tools match your current filter combination. Try clearing some filters or choosing a different subcategory.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {selectedCategory !== 'all' && (selectedSubcategory !== 'all' || selectedAccessModel !== 'all' || onlyOpenSource || onlyNoAuth || only100Free || onlyNoCard) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSubcategory('all');
                  setSelectedAccessModel('all');
                  setOnlyOpenSource(false);
                  setOnlyNoAuth(false);
                  setOnly100Free(false);
                  setOnlyNoCard(false);
                }}
                className="type-btn px-4 py-2 bg-surface hover:bg-ink text-reishi border border-reishi/40 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
              >
                Clear filters in {CANONICAL_CATEGORIES[selectedCategory]?.shortName || 'this category'}
              </button>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="type-btn px-5 py-2 bg-ink hover:bg-surface text-bone border border-line hover:border-reishi/50 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
            >
              Reset all filters ({resources.length} resources)
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <>
          <div ref={gridContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
            {displayedResources.map((item) => (
              <ResourceCard
                key={item.id}
                resource={item}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={onToggleSave}
                onInspect={onInspect}
              />
            ))}
          </div>

          {displayCount < filteredResources.length && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => Math.min(prev + 48, filteredResources.length))}
                className="type-btn w-full sm:w-auto px-6 py-2.5 rounded-[2px] bg-surface border border-reishi/40 hover:border-reishi text-reishi transition-all shadow-lg hover:shadow-reishi/10 cursor-pointer"
              >
                Load more resources ({displayedResources.length} of {filteredResources.length})
              </button>
              <button
                type="button"
                onClick={() => setDisplayCount(filteredResources.length)}
                className="type-btn w-full sm:w-auto px-4 py-2.5 rounded-[2px] bg-transparent border border-line hover:border-ash-400 text-ash-400 hover:text-bone transition-colors cursor-pointer"
              >
                Show all ({filteredResources.length})
              </button>
            </div>
          )}
        </>
      ) : (
        /* Compact Table List View */
        <div className="border border-line rounded-[6px] overflow-hidden bg-surface/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-bone">
              <thead className="bg-ink border-b border-line text-[11px] font-sans font-semibold text-ash-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Resource Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Subcategory</th>
                  <th className="p-3">License</th>
                  <th className="p-3">Pricing Type</th>
                  <th className="p-3">Free Allowance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 font-sans">
                {displayedResources.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-ink/50 transition-colors cursor-pointer"
                    onClick={() => onInspect(item)}
                  >
                    <td className="p-3 font-semibold text-bone whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="p-3 text-[11px] text-ash-400 uppercase font-sans">
                      {item.category}
                    </td>
                    <td className="p-3 text-[11px] text-reishi font-sans font-medium">
                      {normalizeSubcategory(item.subcategory, item.category)}
                    </td>
                    <td className="p-3 type-meta text-ash-400">
                      {item.license}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-[2px] bg-ink border border-line text-[10px] font-sans">
                        {item.pricingType}
                      </span>
                    </td>
                    <td className="p-3 text-ash-400 max-w-xs truncate" title={item.tierQuota}>
                      {item.tierQuota}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onInspect(item)}
                          className="type-btn px-2 py-1 text-ash-300 hover:text-bone hover:underline cursor-pointer"
                        >
                          Details
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-[3px] bg-reishi/10 hover:bg-reishi/20 border border-reishi/30 hover:border-reishi/60 text-reishi text-[11px] font-medium transition-colors"
                          title={`Visit ${item.name} official website (opens in new tab)`}
                          aria-label={`Open ${item.name} in a new tab`}
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                          <span className="sr-only">(opens in new tab)</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {displayCount < filteredResources.length && (
            <div className="p-4 border-t border-line flex items-center justify-between">
              <span className="type-meta text-ash-400">
                Showing {displayedResources.length} of {filteredResources.length}
              </span>
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => Math.min(prev + 48, filteredResources.length))}
                className="type-btn px-4 py-1.5 rounded-[2px] bg-ink border border-line hover:border-reishi/50 text-bone cursor-pointer"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
