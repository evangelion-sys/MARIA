'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useMariaApp } from '@/components/AppShell';
import { RESOURCES } from '@/data/resources';
import { STARTER_STACKS } from '@/data/starter-stacks';
import { WORKFLOW_COLLECTIONS } from '@/data/workflow-collections';
import { ResourceCategory } from '@/types/resource';
import { Sidebar } from '@/components/Sidebar';
import { ResourceDirectory } from '@/components/ResourceDirectory';
import { DirectorySkeleton } from '@/components/DirectorySkeleton';
import { TransitionLink } from '@/components/TransitionLink';
import {
  Compass,
  Bot,
  Layers,
  Globe,
  ArrowLeft,
} from 'lucide-react';

// Dynamic lazy-loading for non-default workspace tabs to optimize initial bundle size & performance
const AiDirectory = dynamic(
  () => import('@/components/AiDirectory').then((mod) => mod.AiDirectory),
  {
    loading: () => <DirectorySkeleton count={6} />,
  }
);

const StarterStacksSection = dynamic(
  () => import('@/components/StarterStacksSection').then((mod) => mod.StarterStacksSection),
  {
    loading: () => <DirectorySkeleton count={4} />,
  }
);

const WorkflowCollectionsSection = dynamic(
  () => import('@/components/WorkflowCollectionsSection').then((mod) => mod.WorkflowCollectionsSection),
  {
    loading: () => <DirectorySkeleton count={4} />,
  }
);

const CategoryConstellation = dynamic(
  () => import('@/components/CategoryConstellation').then((mod) => mod.CategoryConstellation),
  {
    loading: () => <DirectorySkeleton count={6} />,
  }
);

function DiscoverWorkspaceContent() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get('cat');
  const rawSub = searchParams.get('sub');
  const rawTab = searchParams.get('tab');

  const normalizeCategory = (cat: string | null): ResourceCategory | 'all' => {
    if (!cat) return 'all';
    const val = cat.toLowerCase().trim();
    if (val === 'dev' || val === 'development') return 'dev';
    if (val === 'design') return 'design';
    if (val === 'asset' || val === 'creative-assets' || val === 'creative_assets') return 'asset';
    if (val === 'ai' || val === 'ai-ml' || val === 'ai_ml') return 'ai';
    if (val === 'api' || val === 'apis-data' || val === 'apis_data') return 'api';
    if (val === 'video' || val === 'video-audio' || val === 'video_audio') return 'video';
    return 'all';
  };

  const normalizeSubcategory = (cat: string | null, sub: string | null): string => {
    if (sub) return sub;
    const val = cat?.toLowerCase().trim();
    if (val === '3d-webgl' || val === '3d_webgl') return '3D & WebGL';
    if (val === 'motion-animation' || val === 'motion_animation') return 'Motion & Interaction';
    return 'all';
  };

  const normalizeTab = (tab: string | null): 'directory' | 'ai' | 'stacks' | 'constellation' => {
    if (!tab) return 'directory';
    const val = tab.toLowerCase().trim();
    if (val === 'ai' || val === 'neural') return 'ai';
    if (val === 'stacks' || val === 'workflows') return 'stacks';
    if (val === 'constellation' || val === 'galaxy' || val === 'metaphors') return 'constellation';
    return 'directory';
  };

  const initialCategory = normalizeCategory(rawCat);
  const initialSubcategory = normalizeSubcategory(rawCat, rawSub);
  const initialTab = normalizeTab(rawTab);

  // Directory & Navigation State
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [onlyOpenSource, setOnlyOpenSource] = useState<boolean>(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'directory' | 'ai' | 'stacks' | 'constellation'>(initialTab);

  // Responsive sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    savedIds,
    toggleSave,
    openInspect,
    openStackDrawer,
    openSubmitModal,
    applyPreset,
    setSidebarToggleHandler,
  } = useMariaApp();

  // Register mobile sidebar toggle handler with AppShell
  useEffect(() => {
    setSidebarToggleHandler(() => () => setIsMobileSidebarOpen(true));
    return () => setSidebarToggleHandler(undefined);
  }, [setSidebarToggleHandler]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setOnlyOpenSource(false);
  };

  const handleFilterOpenSource = () => {
    setOnlyOpenSource(true);
    setActiveWorkspaceTab('directory');
  };

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col bg-transparent">
      {/* Top Breadcrumb & Mobile Navigation Header */}
      <div className="w-full border-b border-line bg-surface/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TransitionLink
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-ash-400 hover:text-bone transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </TransitionLink>
          <span className="text-line">/</span>
          <span className="type-eyebrow text-bone">
            {activeWorkspaceTab === 'directory'
              ? 'Catalogue'
              : activeWorkspaceTab === 'ai'
              ? 'AI Tool Limits'
              : activeWorkspaceTab === 'stacks'
              ? 'Starter Stacks'
              : 'Category Guide'}
          </span>
        </div>

        {/* Action Bar Indicators */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-ink border border-line text-[11px] font-mono text-ash-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{RESOURCES.length} Tools Listed</span>
          </span>

          <button
            type="button"
            onClick={openStackDrawer}
            className="type-btn flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-surface hover:bg-ink border border-line text-xs font-mono text-bone transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-reishi" />
            <span>My Stack</span>
            {savedIds.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-reishi text-ink font-bold text-[10px]">
                {savedIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Sidebar Filter + Right Dynamic Content Pane */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row min-w-0">
        {/* Responsive Desktop + Mobile Flyout Filter Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedSubcategory('all');
            setActiveWorkspaceTab('directory');
          }}
          onlyOpenSource={onlyOpenSource}
          onToggleOpenSource={() => {
            setOnlyOpenSource((prev) => !prev);
            setActiveWorkspaceTab('directory');
          }}
          onResetFilters={handleResetFilters}
          savedCount={savedIds.length}
          onOpenStackDrawer={openStackDrawer}
          mobileOpen={isMobileSidebarOpen}
          setMobileOpen={setIsMobileSidebarOpen}
          activeTab={activeWorkspaceTab}
          setActiveTab={(tab) => {
            setActiveWorkspaceTab(tab);
          }}
        />

        <main className="flex-1 min-w-0 px-3 sm:px-6 md:px-8 py-5 sm:py-6 flex flex-col">
          {/* Workspace Tab Switcher */}
          <div
            role="tablist"
            aria-label="Workspace views"
            className="flex items-center gap-2 mb-6 border-b border-line pb-4 overflow-x-auto scrollbar-none"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === 'directory'}
              onClick={() => setActiveWorkspaceTab('directory')}
              className={`type-btn flex items-center gap-2 px-3.5 py-2 rounded-[2px] transition-all whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'directory'
                  ? 'bg-surface text-bone font-bold border border-reishi/50 shadow-sm'
                  : 'text-ash-400 hover:text-bone hover:bg-surface/50 border border-transparent'
              }`}
            >
              <Compass className="w-4 h-4 text-reishi" />
              <span>Catalogue ({RESOURCES.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === 'ai'}
              onClick={() => setActiveWorkspaceTab('ai')}
              className={`type-btn flex items-center gap-2 px-3.5 py-2 rounded-[2px] transition-all whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'ai'
                  ? 'bg-surface text-bone font-bold border border-reishi/50 shadow-sm'
                  : 'text-ash-400 hover:text-bone hover:bg-surface/50 border border-transparent'
              }`}
            >
              <Bot className="w-4 h-4 text-reishi" />
              <span>AI Tool Limits</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === 'stacks'}
              onClick={() => setActiveWorkspaceTab('stacks')}
              className={`type-btn flex items-center gap-2 px-3.5 py-2 rounded-[2px] transition-all whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'stacks'
                  ? 'bg-surface text-bone font-bold border border-reishi/50 shadow-sm'
                  : 'text-ash-400 hover:text-bone hover:bg-surface/50 border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4 text-reishi" />
              <span>Starter Stacks ({STARTER_STACKS.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === 'constellation'}
              onClick={() => setActiveWorkspaceTab('constellation')}
              className={`type-btn flex items-center gap-2 px-3.5 py-2 rounded-[2px] transition-all whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'constellation'
                  ? 'bg-surface text-bone font-bold border border-reishi/50 shadow-sm'
                  : 'text-ash-400 hover:text-bone hover:bg-surface/50 border border-transparent'
              }`}
            >
              <Globe className="w-4 h-4 text-reishi" />
              <span>Category Guide</span>
            </button>
          </div>

          {/* TAB 1: MAIN CATALOG DIRECTORY */}
          {activeWorkspaceTab === 'directory' && (
            <div className="space-y-6">
              <ResourceDirectory
                resources={RESOURCES}
                savedIds={savedIds}
                onToggleSave={toggleSave}
                onInspect={openInspect}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onlyOpenSource={onlyOpenSource}
                setOnlyOpenSource={setOnlyOpenSource}
                initialSubcategory={selectedSubcategory}
                onOpenSubmitModal={openSubmitModal}
              />
            </div>
          )}

          {/* TAB 2: AI ALLOWANCE GUIDE (Dynamically Loaded) */}
          {activeWorkspaceTab === 'ai' && (
            <div className="space-y-6">
              <AiDirectory />
            </div>
          )}

          {/* TAB 3: STARTER STACKS & WORKFLOWS (Dynamically Loaded) */}
          {activeWorkspaceTab === 'stacks' && (
            <div className="space-y-12">
              <StarterStacksSection
                starterStacks={STARTER_STACKS}
                allResources={RESOURCES}
                onApplyPreset={applyPreset}
                onInspect={openInspect}
              />
              <WorkflowCollectionsSection
                collections={WORKFLOW_COLLECTIONS}
                allResources={RESOURCES}
                onApplyCollection={(c) => {
                  applyPreset({
                    id: c.id,
                    title: c.title,
                    category: c.category === 'all' ? 'dev' : c.category,
                    targetAudience: c.subtitle || 'Production Teams',
                    description: c.description,
                    resourceIds: c.resourceIds,
                  });
                }}
                onInspect={openInspect}
              />
            </div>
          )}

          {/* TAB 4: CATEGORY VISUAL METAPHORS (Dynamically Loaded) */}
          {activeWorkspaceTab === 'constellation' && (
            <div className="space-y-6">
              <CategoryConstellation
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setActiveWorkspaceTab('directory');
                }}
                onFilterOpenSource={handleFilterOpenSource}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DirectorySkeleton />}>
      <DiscoverWorkspaceContent />
    </Suspense>
  );
}
