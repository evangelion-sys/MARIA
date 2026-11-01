'use client';

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/storage-keys';

/**
 * Hook for managing external resource navigation preference:
 * - Default: true (always open external resource websites in a new browser tab)
 * - Persisted in browser localStorage under STORAGE_KEYS.EXTERNAL_LINK_PREF
 * - Accessible across ResourceCard, ResourceModal, StackBuilderDrawer, and ResourceDirectory
 */
export function useExternalLinkPref() {
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXTERNAL_LINK_PREF);
      if (stored !== null) {
        setOpenInNewTab(stored === 'true');
      }
    } catch {}
  }, []);

  const setPreference = useCallback((value: boolean) => {
    setOpenInNewTab(value);
    try {
      localStorage.setItem(STORAGE_KEYS.EXTERNAL_LINK_PREF, String(value));
    } catch {}
  }, []);

  const togglePreference = useCallback(() => {
    setPreference(!openInNewTab);
  }, [openInNewTab, setPreference]);

  return {
    openInNewTab,
    setPreference,
    togglePreference,
  };
}
