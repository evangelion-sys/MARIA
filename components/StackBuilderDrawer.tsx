'use client';

import React, { useState, useRef, useSyncExternalStore, useEffect, useCallback } from 'react';
import { ResourceItem, StarterStack, UserCustomCollection } from '@/types/resource';
import {
  subscribeCollections,
  getCollectionsSnapshot,
  getCollectionsServerSnapshot,
  resolveResourceId,
  useMariaStack,
  STORAGE_KEYS,
  MAX_SAVED_STACK_ITEMS,
  MAX_CUSTOM_COLLECTIONS,
  sanitizeSavedIds,
  emitCollectionsChange,
} from '@/hooks/use-maria-stack';
import { MariaLogo } from '@/components/MariaLogo';
import {
  X,
  Trash2,
  Download,
  Upload,
  Copy,
  Check,
  Layers,
  BookOpen,
  FolderPlus,
  Clock,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { isReducedMotion } from '@/lib/motion';
import { animate } from 'animejs';
import { RESOURCES } from '@/data/resources';

interface StackBuilderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  allResources?: ResourceItem[];
  starterStacks?: StarterStack[];
  onToggleSave: (id: string) => void;
  onClearStack: () => void;
  onClearAllStorage?: () => void;
  onApplyPreset: (stack: StarterStack) => void;
  onInspect: (r: ResourceItem) => void;
  recentlyViewedIds: string[];
  onImportStack: (ids: string[]) => void;
}

export function StackBuilderDrawer({
  isOpen,
  onClose,
  savedIds,
  allResources,
  starterStacks,
  onToggleSave,
  onClearStack,
  onClearAllStorage,
  onApplyPreset,
  onInspect,
  recentlyViewedIds,
  onImportStack,
}: StackBuilderDrawerProps) {
  const [activeTab, setActiveTab] = useState<'stack' | 'recent' | 'collections'>('stack');
  const [copied, setCopied] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const customCollections = useSyncExternalStore(subscribeCollections, getCollectionsSnapshot, getCollectionsServerSnapshot);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const { clearAllMariaStorage } = useMariaStack();

  const handleClose = useCallback(() => {
    if (isClosing || isReducedMotion()) {
      onClose();
      return;
    }
    setIsClosing(true);

    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [1, 0],
        duration: 200,
        ease: 'outQuad',
      });
    }

    if (drawerRef.current) {
      animate(drawerRef.current, {
        translateX: ['0%', '100%'],
        opacity: [1, 0],
        duration: 220,
        ease: 'cubicBezier(0.4, 0, 1, 1)',
        onComplete: () => {
          setIsClosing(false);
          onClose();
        },
      });
    } else {
      setIsClosing(false);
      onClose();
    }
  }, [isClosing, onClose]);

  // Slide-in animation from right: 380ms ease-yhwach
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      return;
    }

    if (backdropRef.current && !isReducedMotion()) {
      animate(backdropRef.current, {
        opacity: [0, 1],
        duration: 250,
        ease: 'outQuad',
      });
    }

    if (drawerRef.current && !isReducedMotion()) {
      animate(drawerRef.current, {
        translateX: ['100%', '0%'],
        opacity: [0.6, 1],
        duration: 380,
        ease: 'cubicBezier(0.16, 1, 0.3, 1)', // ease-yhwach
      });
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showClearAllConfirm) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose, showClearAllConfirm]);

  const resourcesList = allResources && allResources.length > 0 ? allResources : RESOURCES;
  const validIdSet = new Set<string>(resourcesList.map((r) => r.id));
  const savedResources = resourcesList.filter((r) => savedIds.includes(r.id));
  const recentResources = resourcesList.filter((r) => recentlyViewedIds.includes(r.id));

  // Export as Markdown
  const handleExportMarkdown = () => {
    let md = `# My Creative & Tech Stack\n\n`;
    md += `*Generated via MARIA — Digital Resource Archive*\n\n`;

    savedResources.forEach((r, idx) => {
      md += `### ${idx + 1}. [${r.name}](${r.url}) — ${r.subcategory}\n`;
      md += `- **Role:** ${r.tagline}\n`;
      md += `- **License:** ${r.license} (${r.pricingType})\n`;
      md += `- **Free Quota:** ${r.tierQuota}\n`;
      if (r.docsUrl) md += `- **Docs:** [Official Documentation](${r.docsUrl})\n`;
      if (r.repoUrl) md += `- **Source:** [GitHub Repository](${r.repoUrl})\n`;
      md += `\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maria-stack-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export as JSON
  const handleExportJSON = () => {
    const data = {
      generator: 'MARIA Digital Resource Platform',
      format: 'maria-stack',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      itemCount: savedResources.length,
      resourceIds: savedIds,
      resources: savedResources.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        url: r.url,
        pricingType: r.pricingType,
        tierQuota: r.tierQuota,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maria-collection-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON with bounds validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 512 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setImportError(`File exceeds maximum allowed size of 512KB (${Math.round(file.size / 1024)}KB).`);
      e.target.value = '';
      return;
    }

    const isJsonExt = file.name.toLowerCase().endsWith('.json');
    if (!isJsonExt && file.type && file.type !== 'application/json') {
      setImportError('Invalid file type. Please upload a .json file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || !text.trim()) {
          throw new Error('File is empty.');
        }

        let parsed: any;
        try {
          parsed = JSON.parse(text);
        } catch {
          throw new Error('Malformed JSON syntax. Ensure file contains valid JSON.');
        }

        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Invalid collection format: root must be a JSON object.');
        }

        let rawCandidates: unknown[] = [];
        if (Array.isArray(parsed.resourceIds)) {
          rawCandidates = parsed.resourceIds;
        } else if (Array.isArray(parsed.resources)) {
          rawCandidates = parsed.resources.map((r: any) => (r && typeof r === 'object' ? r.id : undefined));
        } else {
          throw new Error('JSON missing valid "resourceIds" or "resources" array.');
        }

        const acceptedIds: string[] = [];
        let ignoredCount = 0;

        for (const candidate of rawCandidates) {
          if (typeof candidate !== 'string' || !candidate.trim()) {
            ignoredCount++;
            continue;
          }
          const resolved = resolveResourceId(candidate);
          if (validIdSet.has(resolved)) {
            if (!acceptedIds.includes(resolved)) {
              acceptedIds.push(resolved);
            }
          } else {
            ignoredCount++;
          }
        }

        if (acceptedIds.length === 0) {
          throw new Error(`No recognized catalogue tools found in file (${ignoredCount} unknown items skipped).`);
        }

        const cappedIds = acceptedIds.slice(0, MAX_SAVED_STACK_ITEMS);
        onImportStack(cappedIds);

        const feedback = ignoredCount > 0
          ? `Imported ${cappedIds.length} tool(s). (${ignoredCount} unknown tool(s) ignored).`
          : `Imported ${cappedIds.length} tool(s) successfully into your stack.`;
        setImportSuccess(feedback);
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON collection file.');
      }
    };
    reader.onerror = () => {
      setImportError('Error reading uploaded file.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || savedIds.length === 0) return;

    const newCol: UserCustomCollection = {
      id: 'col_' + Date.now(),
      name: newCollectionName.trim().slice(0, 60),
      createdAt: new Date().toLocaleDateString(),
      resourceIds: sanitizeSavedIds(savedIds),
    };

    const next = [newCol, ...customCollections].slice(0, MAX_CUSTOM_COLLECTIONS);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_COLLECTIONS, JSON.stringify(next));
    } catch (e) {
      console.warn('LocalStorage error saving collection', e);
    }
    emitCollectionsChange();
    setNewCollectionName('');
  };

  const handleDeleteCollection = (id: string) => {
    const next = customCollections.filter((c) => c.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_COLLECTIONS, JSON.stringify(next));
    } catch (e) {
      console.warn('LocalStorage error deleting collection', e);
    }
    emitCollectionsChange();
  };

  const handleCopyClipboard = () => {
    let summary = `MARIA Curated Stack:\n`;
    savedResources.forEach((r) => {
      summary += `• ${r.name} (${r.subcategory}) - ${r.url} | ${r.tierQuota}\n`;
    });
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteClearAll = () => {
    if (onClearAllStorage) {
      onClearAllStorage();
    } else {
      clearAllMariaStorage();
    }
    setShowClearAllConfirm(false);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex justify-end bg-ink/75 backdrop-blur-sm select-none will-change-opacity"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-workspace-title"
    >
      {/* Clear All Confirmation Modal */}
      {showClearAllConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md glass-modal border border-wine/80 rounded-[6px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-wine">
              <AlertTriangle className="w-6 h-6 shrink-0 text-wine" />
              <h3 className="type-h3 text-bone">Clear All Local Storage?</h3>
            </div>
            <p className="type-caption text-ash-400 leading-relaxed">
              This will permanently remove your active saved stack, recently viewed history, and all custom collections from this browser.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllConfirm(false)}
                className="px-4 py-2 rounded-[2px] type-btn text-ash-400 hover:text-bone bg-ink border border-line transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteClearAll}
                className="px-4 py-2 rounded-[2px] type-btn text-bone bg-wine hover:bg-wine/80 transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Container (Slides from right in 380ms ease-yhwach) */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-lg h-full glass-panel border-l border-line/80 p-6 flex flex-col justify-between shadow-2xl text-bone overflow-y-auto will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-reishi" />
              <h2 id="drawer-workspace-title" className="type-h3 text-bone">
                Active Workspace Stack
              </h2>
              <span className="type-code text-xs tabular-nums text-reishi px-2 py-0.5 rounded-[2px] bg-ink border border-line">
                {savedResources.length} items
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-[2px] text-ash-600 hover:text-bone hover:bg-ink transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 my-4 p-1 bg-ink rounded-[4px] border border-line">
            <button
              type="button"
              onClick={() => setActiveTab('stack')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-[3px] transition-colors cursor-pointer ${
                activeTab === 'stack'
                  ? 'bg-surface text-reishi font-semibold border border-reishi/40 shadow-sm'
                  : 'text-ash-400 hover:text-bone'
              }`}
            >
              Active ({savedResources.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('recent')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-[3px] transition-colors cursor-pointer ${
                activeTab === 'recent'
                  ? 'bg-surface text-reishi font-semibold border border-reishi/40 shadow-sm'
                  : 'text-ash-400 hover:text-bone'
              }`}
            >
              Recent ({recentResources.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('collections')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-[3px] transition-colors cursor-pointer ${
                activeTab === 'collections'
                  ? 'bg-surface text-reishi font-semibold border border-reishi/40 shadow-sm'
                  : 'text-ash-400 hover:text-bone'
              }`}
            >
              Saved ({customCollections.length})
            </button>
          </div>

          {/* User Feedback Messages */}
          {importError && (
            <div className="mb-4 p-3 rounded-[4px] bg-ink border border-wine flex items-start gap-2 text-xs text-bone">
              <AlertCircle className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <div className="flex-1">{importError}</div>
              <button
                type="button"
                onClick={() => setImportError(null)}
                className="text-ash-400 hover:text-bone"
              >
                ×
              </button>
            </div>
          )}

          {importSuccess && (
            <div className="mb-4 p-3 rounded-[4px] bg-ink border border-reishi flex items-start gap-2 text-xs text-bone">
              <Check className="w-4 h-4 text-reishi shrink-0 mt-0.5" />
              <div className="flex-1">{importSuccess}</div>
              <button
                type="button"
                onClick={() => setImportSuccess(null)}
                className="text-ash-400 hover:text-bone"
              >
                ×
              </button>
            </div>
          )}

          {/* TAB 1: ACTIVE STACK */}
          {activeTab === 'stack' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-ash-400 font-mono">
                <span>Tools in active workflow</span>
                <div className="flex items-center gap-2">
                  {savedResources.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearStack}
                      className="text-ash-600 hover:text-bone transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Active</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowClearAllConfirm(true)}
                    className="text-ash-600 hover:text-wine transition-colors flex items-center gap-1"
                    title="Clear all browser local data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Storage</span>
                  </button>
                </div>
              </div>

              {/* Empty State */}
              {savedResources.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="flex justify-center text-ash-600 opacity-40">
                    <MariaLogo variant="symbol" size={48} animated={false} glow={false} />
                  </div>
                  <div className="space-y-1.5 px-4">
                    <p className="text-xs font-mono text-ash-400 uppercase tracking-wider">
                      Your active stack is empty
                    </p>
                    <p className="text-xs text-ash-500 max-w-xs mx-auto leading-relaxed">
                      Bookmark tools across the directory to assemble your custom workspace stack.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                  {savedResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-3 rounded-[4px] bg-ink border border-line hover:border-reishi/50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-semibold text-bone truncate">
                            {resource.name}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] bg-surface border border-line text-ash-400">
                            {resource.category}
                          </span>
                        </div>
                        <p className="text-xs text-ash-400 truncate mt-0.5">
                          {resource.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-[2px] text-ash-600 hover:text-reishi hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                            title={`Open ${resource.name} website in new tab`}
                            aria-label={`Open ${resource.name} website in new tab`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="sr-only">(opens in new tab)</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onInspect(resource)}
                          className="p-1.5 rounded-[2px] text-ash-600 hover:text-reishi hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
                          title="Inspect Details"
                          aria-label={`Inspect ${resource.name} details`}
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleSave(resource.id)}
                          className="p-1.5 rounded-[2px] text-ash-600 hover:text-bone hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
                          title="Remove from Stack"
                          aria-label={`Remove ${resource.name} from stack`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RECENTLY VIEWED */}
          {activeTab === 'recent' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-ash-600">
                Recent inspection session (max 15)
              </div>

              {recentResources.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="flex justify-center text-ash-600 opacity-40">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-mono text-ash-400 uppercase tracking-wider">
                    No recently inspected tools in this session.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
                  {recentResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-3 rounded-[4px] bg-ink border border-line hover:border-reishi/50 transition-all flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-semibold text-bone truncate">
                            {resource.name}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-[2px] bg-surface border border-line text-ash-400">
                            {resource.category}
                          </span>
                        </div>
                        <p className="text-xs text-ash-400 truncate mt-0.5">
                          {resource.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-[2px] text-ash-600 hover:text-reishi hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
                            title={`Open ${resource.name} website in new tab`}
                            aria-label={`Open ${resource.name} website in new tab`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="sr-only">(opens in new tab)</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onInspect(resource)}
                          className="p-1.5 rounded-[2px] text-ash-600 hover:text-reishi hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
                          title="Inspect Details"
                          aria-label={`Inspect ${resource.name} details`}
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleSave(resource.id)}
                          className={`p-1.5 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer ${
                            savedIds.includes(resource.id)
                              ? 'text-reishi bg-surface border border-reishi/50'
                              : 'text-ash-600 hover:text-bone hover:bg-surface'
                          }`}
                          title={savedIds.includes(resource.id) ? 'In active stack' : 'Save to Stack'}
                          aria-label={savedIds.includes(resource.id) ? `Remove ${resource.name} from stack` : `Save ${resource.name} to stack`}
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM COLLECTIONS */}
          {activeTab === 'collections' && (
            <div className="space-y-4">
              <form onSubmit={handleCreateCollection} className="space-y-2">
                <span className="text-xs font-mono text-ash-400">
                  Save current stack ({savedResources.length}) as named collection:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g. 3D WebGL Portfolio, Edge API..."
                    maxLength={60}
                    className="flex-1 px-3 py-2 rounded-[2px] bg-ink border border-line text-xs font-mono text-bone placeholder-ash-600 focus:outline-none focus:border-reishi transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newCollectionName.trim() || savedResources.length === 0}
                    className="px-3 py-2 rounded-[2px] bg-bone hover:bg-[#E8E8E1] disabled:opacity-40 text-ink text-xs font-mono font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </form>

              {customCollections.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="flex justify-center text-ash-600 opacity-40">
                    <FolderPlus className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-mono text-ash-400 uppercase tracking-wider">
                    No custom collections stored.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {customCollections.map((col) => (
                    <div
                      key={col.id}
                      className="p-3 rounded-[4px] bg-ink border border-line hover:border-reishi/50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="text-xs font-serif font-semibold text-bone truncate">
                          {col.name}
                        </div>
                        <div className="text-[10px] font-mono text-ash-600 mt-0.5">
                          {col.resourceIds.length} tools • Saved {col.createdAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onImportStack(col.resourceIds);
                            setActiveTab('stack');
                          }}
                          className="px-2.5 py-1 rounded-[2px] bg-surface hover:bg-ink text-xs font-mono font-semibold text-reishi transition-colors border border-line"
                          title="Load into Active Stack"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCollection(col.id)}
                          className="p-1.5 rounded-[2px] text-ash-600 hover:text-bone hover:bg-surface transition-colors"
                          title="Delete Collection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions: Import / Export / Copy */}
        <div className="pt-4 mt-4 border-t border-line space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              disabled={savedResources.length === 0}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-[2px] bg-ink border border-line hover:bg-surface disabled:opacity-40 text-bone text-xs font-mono font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-reishi" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-[2px] bg-ink border border-line hover:bg-surface text-bone text-xs font-mono font-semibold transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-reishi" />
              <span>Import JSON</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportMarkdown}
            disabled={savedResources.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-[2px] bg-ink border border-line hover:bg-surface text-ash-400 hover:text-bone text-xs font-mono font-semibold transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-reishi" />
            <span>Export Stack as Markdown</span>
          </button>

          <button
            type="button"
            onClick={handleCopyClipboard}
            disabled={savedResources.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] disabled:opacity-40 text-ink text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-ink" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Summary Link List</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
