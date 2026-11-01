'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SmoothScroll } from './SmoothScroll';
import { ScrollProgress } from './ScrollProgress';
import { CustomCursor } from './CustomCursor';
import { Toast } from './Toast';
import { PageTransitionProvider } from './TransitionLink';
import { useMariaStack } from '@/hooks/use-maria-stack';
import { ResourceItem, StarterStack } from '@/types/resource';

// Lazy-load interactive modals and drawer on demand (zero initial JS overhead)
const ResourceModal = dynamic(
  () => import('./ResourceModal').then((m) => m.ResourceModal),
  { ssr: false }
);
const ResourceSubmissionModal = dynamic(
  () => import('./ResourceSubmissionModal').then((m) => m.ResourceSubmissionModal),
  { ssr: false }
);
const StackBuilderDrawer = dynamic(
  () => import('./StackBuilderDrawer').then((m) => m.StackBuilderDrawer),
  { ssr: false }
);

interface MariaAppContextType {
  savedIds: string[];
  toggleSave: (id: string) => void;
  clearStack: () => void;
  clearAllMariaStorage: () => { success: boolean; error?: string };
  applyPreset: (stack: StarterStack) => void;
  importStack: (ids: string[]) => { importedCount: number; ignoredCount: number };
  recentlyViewedIds: string[];
  openInspect: (resource: ResourceItem) => void;
  closeInspect: () => void;
  openStackDrawer: () => void;
  openSubmitModal: () => void;
  closeSubmitModal: () => void;
  showToast: (msg: string) => void;
  onToggleSidebar?: () => void;
  setSidebarToggleHandler: (fn?: () => void) => void;
}

const MariaAppContext = createContext<MariaAppContextType | null>(null);

export function useMariaApp() {
  const ctx = useContext(MariaAppContext);
  if (!ctx) {
    throw new Error('useMariaApp must be used within an AppShell');
  }
  return ctx;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    savedIds,
    toggleSave,
    clearStack,
    clearAllMariaStorage,
    applyPreset,
    importStack,
    recentlyViewedIds,
    inspectedResource,
    isModalOpen,
    openInspect,
    closeInspect,
    isStackDrawerOpen,
    setIsStackDrawerOpen,
    toastMessage,
    showToast,
    dismissToast,
  } = useMariaStack();

  const [sidebarToggleHandler, setSidebarToggleHandler] = useState<(() => void) | undefined>(undefined);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const contextValue: MariaAppContextType = {
    savedIds,
    toggleSave,
    clearStack,
    clearAllMariaStorage,
    applyPreset,
    importStack,
    recentlyViewedIds,
    openInspect,
    closeInspect,
    openStackDrawer: () => setIsStackDrawerOpen(true),
    openSubmitModal: () => setIsSubmitModalOpen(true),
    closeSubmitModal: () => setIsSubmitModalOpen(false),
    showToast,
    onToggleSidebar: sidebarToggleHandler,
    setSidebarToggleHandler,
  };

  return (
    <PageTransitionProvider>
      <SmoothScroll>
        <MariaAppContext.Provider value={contextValue}>
          {/* Accessible Skip to Content Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-bone focus:text-ink focus:type-btn focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-reishi rounded-[2px]"
          >
            Skip to content
          </a>

          {/* Fixed 2px Reishi Scroll Progress Bar */}
          <ScrollProgress />

          {/* Precision Custom Cursor Overlay (Fine-pointer only, Aizen & Yhwach visual language) */}
          <CustomCursor />

          <div className="min-h-screen bg-[#070709] text-bone flex flex-col font-sans relative">
            {/* Global Toast Notification (bottom-left, 6px radius, line border, 4s auto-dismiss, pause on hover) */}
            <Toast message={toastMessage} onDismiss={dismissToast} />

            {/* Global Application Navbar (56px high, sliding underline, morphing menu) */}
            <Navbar
              savedCount={savedIds.length}
              onOpenStackDrawer={() => setIsStackDrawerOpen(true)}
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
              showSidebarToggle={Boolean(sidebarToggleHandler)}
              onToggleSidebar={sidebarToggleHandler}
            />

            {/* Page Content Landmark with TabIndex for Accessible Route Transitions */}
            <main
              id="main-content"
              tabIndex={-1}
              className="relative z-10 flex-1 flex flex-col w-full focus:outline-none"
            >
              {children}
            </main>

            {/* Global Application Footer with TransitionLinks */}
            <Footer
              onOpenStackDrawer={() => setIsStackDrawerOpen(true)}
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            />

            {/* Global Resource Modal Inspector (Lazily mounted on inspection) */}
            {isModalOpen && inspectedResource && (
              <ResourceModal
                resource={inspectedResource}
                isOpen={isModalOpen}
                onClose={closeInspect}
                isSaved={savedIds.includes(inspectedResource.id)}
                onToggleSave={toggleSave}
                onSelectRelated={openInspect}
              />
            )}

            {/* Global Resource Submission Modal (Lazily mounted on submission trigger) */}
            {isSubmitModalOpen && (
              <ResourceSubmissionModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
              />
            )}

            {/* Global Stack Builder Drawer (Lazily mounted on drawer open) */}
            {isStackDrawerOpen && (
              <StackBuilderDrawer
                isOpen={isStackDrawerOpen}
                onClose={() => setIsStackDrawerOpen(false)}
                savedIds={savedIds}
                onToggleSave={toggleSave}
                onClearStack={clearStack}
                onClearAllStorage={clearAllMariaStorage}
                onApplyPreset={applyPreset}
                onInspect={openInspect}
                recentlyViewedIds={recentlyViewedIds}
                onImportStack={importStack}
              />
            )}
          </div>
        </MariaAppContext.Provider>
      </SmoothScroll>
    </PageTransitionProvider>
  );
}
