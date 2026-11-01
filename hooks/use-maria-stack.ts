'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { ResourceItem, StarterStack, UserCustomCollection } from '@/types/resource';
import { RESOURCE_IDS } from '@/data/resource-ids';
import { STORAGE_KEYS, MAX_SAVED_STACK_ITEMS, MAX_RECENT_ITEMS, MAX_CUSTOM_COLLECTIONS } from '@/lib/storage-keys';

export { STORAGE_KEYS, MAX_SAVED_STACK_ITEMS, MAX_RECENT_ITEMS, MAX_CUSTOM_COLLECTIONS };

// Legacy ID aliases to preserve backward compatibility for user bookmarks
export const LEGACY_ID_ALIASES: Record<string, string> = {
  'comfyuI': 'comfyui',
  'nasa-apis': 'nasa-open-api',
  'kenney-assets': 'kenney',
  'font-share': 'fontshare',
};

// Valid resource ID lookup set (generated from lightweight 25KB ID catalog)
const VALID_RESOURCE_IDS = new Set<string>(RESOURCE_IDS);

export function resolveResourceId(rawId: string): string {
  const trimmed = rawId.trim();
  return LEGACY_ID_ALIASES[trimmed] || trimmed;
}

/**
 * Sanitizes untrusted saved stack IDs:
 * - Must be an array of non-empty strings
 * - Maps legacy aliases
 * - Whitelists against the catalogue (removes nonexistent IDs)
 * - Deduplicates
 * - Enforces maximum bound
 */
export function sanitizeSavedIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const result: string[] = [];
  const seen = new Set<string>();

  for (const item of raw) {
    if (typeof item !== 'string' || !item.trim()) continue;
    const resolved = resolveResourceId(item);
    if (VALID_RESOURCE_IDS.has(resolved) && !seen.has(resolved)) {
      seen.add(resolved);
      result.push(resolved);
      if (result.length >= MAX_SAVED_STACK_ITEMS) break;
    }
  }
  return result;
}

/**
 * Sanitizes untrusted recently viewed IDs:
 * - Must be an array of non-empty strings
 * - Maps legacy aliases
 * - Whitelists against the catalogue
 * - Deduplicates
 * - Enforces maximum bound (15 items)
 */
export function sanitizeRecentIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const result: string[] = [];
  const seen = new Set<string>();

  for (const item of raw) {
    if (typeof item !== 'string' || !item.trim()) continue;
    const resolved = resolveResourceId(item);
    if (VALID_RESOURCE_IDS.has(resolved) && !seen.has(resolved)) {
      seen.add(resolved);
      result.push(resolved);
      if (result.length >= MAX_RECENT_ITEMS) break;
    }
  }
  return result;
}

/**
 * Sanitizes untrusted custom collections:
 * - Must be an array of collection objects
 * - Validates schema (id, name, createdAt, resourceIds)
 * - Filters resourceIds against catalogue
 * - Limits counts
 */
export function sanitizeCustomCollections(raw: unknown): UserCustomCollection[] {
  if (!Array.isArray(raw)) return [];
  const result: UserCustomCollection[] = [];
  const seenIds = new Set<string>();

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const { id, name, description, createdAt, resourceIds } = item as any;

    if (typeof id !== 'string' || !id.trim() || id.length > 64) continue;
    if (typeof name !== 'string' || !name.trim() || name.length > 60) continue;
    if (seenIds.has(id.trim())) continue;

    const sanitizedResourceIds = sanitizeSavedIds(resourceIds);
    seenIds.add(id.trim());

    result.push({
      id: id.trim(),
      name: name.trim(),
      description: typeof description === 'string' ? description.slice(0, 200).trim() : undefined,
      createdAt: typeof createdAt === 'string' && createdAt.trim() ? createdAt.trim().slice(0, 40) : new Date().toLocaleDateString(),
      resourceIds: sanitizedResourceIds,
    });

    if (result.length >= MAX_CUSTOM_COLLECTIONS) break;
  }
  return result;
}

// Legacy mock placeholder stack to purge from user storage
const LEGACY_MOCK_STACK: readonly string[] = Object.freeze(['supabase', 'nextjs', 'davinci-resolve', 'ollama']);

function isLegacyMockStack(ids: readonly string[] | string[]): boolean {
  if (ids.length !== 4) return false;
  return ids[0] === 'supabase' && ids[1] === 'nextjs' && ids[2] === 'davinci-resolve' && ids[3] === 'ollama';
}

// Clean initial stack: starts completely empty with zero mock items
const DEFAULT_STACK: readonly string[] = Object.freeze([]);
const SERVER_SAVED_SNAPSHOT: string[] = [];
const SERVER_RECENT_SNAPSHOT: string[] = [];
const SERVER_COLLECTIONS_SNAPSHOT: UserCustomCollection[] = [];

// Storage migration helper (run once in client)
let hasMigrated = false;

export function migrateLegacyStorage(): void {
  if (typeof window === 'undefined' || hasMigrated) return;
  hasMigrated = true;
  try {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (!version) {
      // 1. Migrate saved stack (ignoring legacy mock items)
      const legacySaved = localStorage.getItem(STORAGE_KEYS.LEGACY_SAVED_STACK);
      if (legacySaved && !localStorage.getItem(STORAGE_KEYS.SAVED_STACK)) {
        try {
          const parsed = JSON.parse(legacySaved);
          const sanitized = sanitizeSavedIds(parsed);
          if (!isLegacyMockStack(sanitized) && sanitized.length > 0) {
            localStorage.setItem(STORAGE_KEYS.SAVED_STACK, JSON.stringify(sanitized));
          } else {
            localStorage.removeItem(STORAGE_KEYS.LEGACY_SAVED_STACK);
          }
        } catch {
          // ignore malformed legacy
        }
      }

      // 2. Migrate recently viewed
      const legacyRecent = localStorage.getItem(STORAGE_KEYS.LEGACY_RECENTLY_VIEWED);
      if (legacyRecent && !localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED)) {
        try {
          const parsed = JSON.parse(legacyRecent);
          const sanitized = sanitizeRecentIds(parsed);
          localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(sanitized));
        } catch {
          // ignore malformed legacy
        }
      }

      // 3. Migrate custom collections
      const legacyCollections = localStorage.getItem(STORAGE_KEYS.LEGACY_CUSTOM_COLLECTIONS);
      if (legacyCollections && !localStorage.getItem(STORAGE_KEYS.CUSTOM_COLLECTIONS)) {
        try {
          const parsed = JSON.parse(legacyCollections);
          const sanitized = sanitizeCustomCollections(parsed);
          localStorage.setItem(STORAGE_KEYS.CUSTOM_COLLECTIONS, JSON.stringify(sanitized));
        } catch {
          // ignore malformed legacy
        }
      }

      localStorage.setItem(STORAGE_KEYS.VERSION, '1');
    }
  } catch (e) {
    console.warn('Storage migration notice:', e);
  }
}

// ==========================================
// 1. Saved Stack Store
// ==========================================
let savedStackSnapshot: string[] = [];
let savedListeners: Array<() => void> = [];

export function emitSavedChange() {
  for (const listener of savedListeners) listener();
}

export function subscribeSaved(listener: () => void) {
  savedListeners.push(listener);
  return () => {
    savedListeners = savedListeners.filter((l) => l !== listener);
  };
}

export function getSavedSnapshot(): string[] {
  if (typeof window === 'undefined') return savedStackSnapshot;
  migrateLegacyStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED_STACK);
    if (!stored) {
      if (savedStackSnapshot.length === 0) {
        return savedStackSnapshot;
      }
      savedStackSnapshot = [];
      return savedStackSnapshot;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(stored);
    } catch {
      // Corrupt JSON payload: reset to empty clean stack
      savedStackSnapshot = [];
      return savedStackSnapshot;
    }
    const sanitized = sanitizeSavedIds(parsed);
    // If stored stack is the legacy mock placeholder, purge it so user has a clean empty stack
    if (isLegacyMockStack(sanitized)) {
      try {
        localStorage.removeItem(STORAGE_KEYS.SAVED_STACK);
      } catch {}
      savedStackSnapshot = [];
      return savedStackSnapshot;
    }
    if (
      sanitized.length === savedStackSnapshot.length &&
      sanitized.every((v, i) => v === savedStackSnapshot[i])
    ) {
      return savedStackSnapshot;
    }
    savedStackSnapshot = sanitized;
    return savedStackSnapshot;
  } catch {
    return savedStackSnapshot;
  }
}

export function getSavedServerSnapshot(): string[] {
  return SERVER_SAVED_SNAPSHOT;
}

// ==========================================
// 2. Recently Viewed Store
// ==========================================
let recentSnapshot: string[] = [];
let recentListeners: Array<() => void> = [];

export function emitRecentChange() {
  for (const listener of recentListeners) listener();
}

export function subscribeRecent(listener: () => void) {
  recentListeners.push(listener);
  return () => {
    recentListeners = recentListeners.filter((l) => l !== listener);
  };
}

export function getRecentSnapshot(): string[] {
  if (typeof window === 'undefined') return recentSnapshot;
  migrateLegacyStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    if (!stored) {
      if (recentSnapshot.length === 0) return recentSnapshot;
      recentSnapshot = [];
      return recentSnapshot;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(stored);
    } catch {
      recentSnapshot = [];
      return recentSnapshot;
    }
    const sanitized = sanitizeRecentIds(parsed);
    if (
      sanitized.length === recentSnapshot.length &&
      sanitized.every((v, i) => v === recentSnapshot[i])
    ) {
      return recentSnapshot;
    }
    recentSnapshot = sanitized;
    return recentSnapshot;
  } catch {
    return recentSnapshot;
  }
}

export function getRecentServerSnapshot(): string[] {
  return SERVER_RECENT_SNAPSHOT;
}

// ==========================================
// 3. Custom Collections Store
// ==========================================
let collectionsSnapshot: UserCustomCollection[] = [];
let collectionsListeners: Array<() => void> = [];

export function emitCollectionsChange() {
  for (const listener of collectionsListeners) listener();
}

export function subscribeCollections(listener: () => void) {
  collectionsListeners.push(listener);
  return () => {
    collectionsListeners = collectionsListeners.filter((l) => l !== listener);
  };
}

export function getCollectionsSnapshot(): UserCustomCollection[] {
  if (typeof window === 'undefined') return collectionsSnapshot;
  migrateLegacyStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_COLLECTIONS);
    if (!stored) {
      if (collectionsSnapshot.length === 0) return collectionsSnapshot;
      collectionsSnapshot = [];
      return collectionsSnapshot;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(stored);
    } catch {
      collectionsSnapshot = [];
      return collectionsSnapshot;
    }
    const sanitized = sanitizeCustomCollections(parsed);
    if (
      sanitized.length === collectionsSnapshot.length &&
      sanitized.every((c, idx) => c.id === collectionsSnapshot[idx]?.id)
    ) {
      return collectionsSnapshot;
    }
    collectionsSnapshot = sanitized;
    return collectionsSnapshot;
  } catch {
    return collectionsSnapshot;
  }
}

export function getCollectionsServerSnapshot(): UserCustomCollection[] {
  return SERVER_COLLECTIONS_SNAPSHOT;
}

// ==========================================
// Maria Stack Hook
// ==========================================
export function useMariaStack() {
  const savedIds = useSyncExternalStore(subscribeSaved, getSavedSnapshot, getSavedServerSnapshot);
  const recentlyViewedIds = useSyncExternalStore(subscribeRecent, getRecentSnapshot, getRecentServerSnapshot);
  const customCollections = useSyncExternalStore(subscribeCollections, getCollectionsSnapshot, getCollectionsServerSnapshot);

  const [inspectedResource, setInspectedResource] = useState<ResourceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStackDrawerOpen, setIsStackDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const setSavedIds = useCallback((updater: string[] | ((prev: string[]) => string[])) => {
    const nextRaw = typeof updater === 'function' ? updater(savedStackSnapshot) : updater;
    const sanitized = sanitizeSavedIds(nextRaw);
    savedStackSnapshot = sanitized;
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_STACK, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('LocalStorage error saving stack:', e);
    }
    emitSavedChange();
  }, []);

  const toggleSave = useCallback((id: string, name?: string) => {
    const resolvedId = resolveResourceId(id);
    const exists = savedStackSnapshot.includes(resolvedId);
    const nextRaw = exists
      ? savedStackSnapshot.filter((item) => item !== resolvedId)
      : [...savedStackSnapshot, resolvedId];
    const sanitized = sanitizeSavedIds(nextRaw);
    savedStackSnapshot = sanitized;
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_STACK, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('LocalStorage error toggling save:', e);
    }
    emitSavedChange();

    const label = name ? `"${name}"` : 'tool';
    showToast(exists ? `Removed ${label} from stack` : `Saved ${label} to your stack!`);
  }, [showToast]);

  const recordView = useCallback((id: string) => {
    const resolvedId = resolveResourceId(id);
    if (!VALID_RESOURCE_IDS.has(resolvedId)) return;
    const filtered = recentSnapshot.filter((item) => item !== resolvedId);
    const next = [resolvedId, ...filtered].slice(0, MAX_RECENT_ITEMS);
    recentSnapshot = next;
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(next));
    } catch (e) {
      console.warn('LocalStorage error recording view:', e);
    }
    emitRecentChange();
  }, []);

  const openInspect = useCallback((resource: ResourceItem) => {
    setInspectedResource(resource);
    setIsModalOpen(true);
    recordView(resource.id);
  }, [recordView]);

  const closeInspect = useCallback(() => {
    setIsModalOpen(false);
    setInspectedResource(null);
  }, []);

  // Clear active stack only (preserves recent and custom collections)
  const clearStack = useCallback(() => {
    savedStackSnapshot = [];
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_STACK);
    } catch (e) {
      console.warn('LocalStorage error clearing stack:', e);
    }
    emitSavedChange();
    showToast('Cleared your active stack');
  }, [showToast]);

  // Completely wipe all MARIA-owned local storage
  const clearAllMariaStorage = useCallback((): { success: boolean; error?: string } => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEYS.SAVED_STACK);
        localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_COLLECTIONS);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_SAVED_STACK);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_RECENTLY_VIEWED);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_CUSTOM_COLLECTIONS);
        localStorage.removeItem(STORAGE_KEYS.VERSION);
        localStorage.removeItem(STORAGE_KEYS.USER_SUBMISSIONS);
        localStorage.removeItem(STORAGE_KEYS.EXTERNAL_LINK_PREF);
      }

      // Reset all in-memory cache snapshots
      savedStackSnapshot = [];
      recentSnapshot = [];
      collectionsSnapshot = [];

      // Notify all subscribers immediately
      emitSavedChange();
      emitRecentChange();
      emitCollectionsChange();

      showToast('All MARIA local storage cleared successfully.');
      return { success: true };
    } catch (err: any) {
      console.error('Failed to clear MARIA local storage:', err);
      showToast('Could not clear local storage: ' + (err?.message || 'Access denied'));
      return { success: false, error: err?.message || 'Access denied' };
    }
  }, [showToast]);

  const applyPreset = useCallback((stack: StarterStack) => {
    const merged = sanitizeSavedIds([...savedStackSnapshot, ...stack.resourceIds]);
    savedStackSnapshot = merged;
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_STACK, JSON.stringify(merged));
    } catch (e) {
      console.warn('LocalStorage error applying preset:', e);
    }
    emitSavedChange();
    showToast(`Loaded "${stack.title}" into your active stack!`);
  }, [showToast]);

  // Import stack with ID filtering & sanitization
  const importStack = useCallback((ids: string[]): { importedCount: number; ignoredCount: number } => {
    const validFiltered: string[] = [];
    let ignored = 0;

    for (const rawId of ids) {
      if (typeof rawId !== 'string') {
        ignored++;
        continue;
      }
      const resolved = resolveResourceId(rawId);
      if (VALID_RESOURCE_IDS.has(resolved)) {
        if (!validFiltered.includes(resolved)) {
          validFiltered.push(resolved);
        }
      } else {
        ignored++;
      }
    }

    const capped = validFiltered.slice(0, MAX_SAVED_STACK_ITEMS);
    savedStackSnapshot = capped;
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_STACK, JSON.stringify(capped));
    } catch (e) {
      console.warn('LocalStorage error importing stack:', e);
    }
    emitSavedChange();

    if (ignored > 0) {
      showToast(`Imported ${capped.length} tools (${ignored} unknown tools skipped).`);
    } else {
      showToast(`Imported ${capped.length} tools into your active stack!`);
    }

    return { importedCount: capped.length, ignoredCount: ignored };
  }, [showToast]);

  // Custom collection helpers
  const createCustomCollection = useCallback((name: string, resourceIds?: string[]) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const idsToSave = sanitizeSavedIds(resourceIds || savedStackSnapshot);
    const newCol: UserCustomCollection = {
      id: 'col_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: trimmedName.slice(0, 60),
      createdAt: new Date().toLocaleDateString(),
      resourceIds: idsToSave,
    };

    const next = [newCol, ...collectionsSnapshot].slice(0, MAX_CUSTOM_COLLECTIONS);
    collectionsSnapshot = next;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_COLLECTIONS, JSON.stringify(next));
    } catch (e) {
      console.warn('LocalStorage error creating collection:', e);
    }
    emitCollectionsChange();
    showToast(`Collection "${newCol.name}" created!`);
  }, [showToast]);

  const deleteCustomCollection = useCallback((id: string) => {
    const next = collectionsSnapshot.filter((c) => c.id !== id);
    collectionsSnapshot = next;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_COLLECTIONS, JSON.stringify(next));
    } catch (e) {
      console.warn('LocalStorage error deleting collection:', e);
    }
    emitCollectionsChange();
    showToast('Collection deleted.');
  }, [showToast]);

  return {
    savedIds,
    setSavedIds,
    toggleSave,
    clearStack,
    clearAllMariaStorage,
    applyPreset,
    importStack,
    recentlyViewedIds,
    recordView,
    customCollections,
    createCustomCollection,
    deleteCustomCollection,
    inspectedResource,
    isModalOpen,
    openInspect,
    closeInspect,
    isStackDrawerOpen,
    setIsStackDrawerOpen,
    toastMessage,
    showToast,
    dismissToast,
  };
}
