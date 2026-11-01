'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMariaApp } from '@/components/AppShell';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export function PrivacyClearButton() {
  const { clearAllMariaStorage } = useMariaApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClearAllData = () => {
    clearAllMariaStorage();
    setShowClearConfirm(false);
    triggerButtonRef.current?.focus();
  };

  const handleCancel = useCallback(() => {
    setShowClearConfirm(false);
    triggerButtonRef.current?.focus();
  }, []);

  // Keyboard accessibility: Escape to close and focus trap
  useEffect(() => {
    if (!showClearConfirm) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showClearConfirm, handleCancel]);

  return (
    <>
      <div className="p-5 sm:p-6 rounded-xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-bone text-sm">Purge All Local Browser Data</div>
          <div className="text-xs text-ash-400 mt-1 leading-relaxed">
            Instantly remove all active stack bookmarks, inspection history, custom collections, draft submissions, and local link preferences.
          </div>
        </div>
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Data</span>
        </button>
      </div>

      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={handleCancel}
        >
          <div
            ref={modalRef}
            className="w-full max-w-md bg-surface border border-line rounded-xl p-6 shadow-2xl space-y-4 text-left text-bone"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 id="clear-modal-title" className="text-base font-bold text-bone">
                  Clear All Local MARIA Data?
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 text-ash-400 hover:text-bone rounded transition-colors focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ash-300 leading-relaxed">
              This action permanently deletes all MARIA-owned keys from your browser&apos;s localStorage:
            </p>

            <div className="p-3.5 rounded-lg bg-ink border border-line text-[11px] text-ash-400 space-y-1.5 font-mono">
              <div>• <span className="text-reishi">{STORAGE_KEYS.SAVED_STACK}</span>: Active stack bookmarks</div>
              <div>• <span className="text-reishi">{STORAGE_KEYS.RECENTLY_VIEWED}</span>: Recent inspection history</div>
              <div>• <span className="text-reishi">{STORAGE_KEYS.CUSTOM_COLLECTIONS}</span>: Named custom stacks</div>
              <div>• <span className="text-reishi">{STORAGE_KEYS.USER_SUBMISSIONS}</span>: Locally drafted tool proposals</div>
              <div>• <span className="text-reishi">{STORAGE_KEYS.EXTERNAL_LINK_PREF}</span>: External link warning preference</div>
            </div>

            <p className="text-[11px] text-ash-500">
              Browser cookies and storage belonging to other websites will NOT be modified or affected.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-line">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-[4px] text-xs font-medium text-ash-400 hover:text-bone bg-ink border border-line hover:border-ash-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllData}
                className="px-4 py-2 rounded-[4px] text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-sm focus-visible:ring-1 focus-visible:ring-red-400 cursor-pointer"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
