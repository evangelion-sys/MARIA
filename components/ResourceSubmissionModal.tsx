'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle2, ShieldAlert, Copy, Check, Info } from 'lucide-react';
import { ResourceCategory } from '@/types/resource';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { isReducedMotion } from '@/lib/motion';
import { animate } from 'animejs';

interface ResourceSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  url?: string;
}

export function ResourceSubmissionModal({ isOpen, onClose }: ResourceSubmissionModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('dev');
  const [subcategory, setSubcategory] = useState('');
  const [license, setLicense] = useState('');
  const [tierQuota, setTierQuota] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isClosing, setIsClosing] = useState(false);

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    if (isClosing) {
      onClose();
      return;
    }

    if (isReducedMotion()) {
      onClose();
      return;
    }

    setIsClosing(true);
    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [1, 0],
        duration: 180,
        ease: 'outQuad',
      });
    }

    if (modalContentRef.current) {
      animate(modalContentRef.current, {
        opacity: [1, 0],
        scale: [1, 0.97],
        translateY: [0, 8],
        duration: 180,
        ease: 'outQuad',
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

  // Entrance animation, focus trap, and body scroll lock
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (!isReducedMotion()) {
      if (backdropRef.current) {
        animate(backdropRef.current, {
          opacity: [0, 1],
          duration: 220,
          ease: 'outQuad',
        });
      }
      if (modalContentRef.current) {
        animate(modalContentRef.current, {
          opacity: [0, 1],
          scale: [0.97, 1],
          translateY: [12, 0],
          duration: 320,
          ease: 'cubicBezier(0.16, 1, 0.3, 1)',
        });
      }
    }

    // Escape listener and focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'Tab' && modalContentRef.current) {
        const focusables = modalContentRef.current.querySelectorAll<HTMLElement>(
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

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Tool or resource name is required.';
    }

    if (!url.trim()) {
      newErrors.url = 'Canonical URL is required.';
    } else {
      try {
        const parsed = new URL(url.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.url = 'URL must begin with https:// or http://';
        }
      } catch {
        newErrors.url = 'Please enter a valid URL (e.g. https://github.com/owner/repo or https://tool.dev).';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save draft locally to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SUBMISSIONS) || '[]');
      const newSubmission = {
        id: `draft-${Date.now()}`,
        name: name.trim(),
        url: url.trim(),
        category,
        subcategory: subcategory.trim() || 'General',
        license: license.trim() || 'Unspecified',
        tierQuota: tierQuota.trim() || 'Unspecified',
        createdAt: new Date().toISOString(),
      };
      existing.unshift(newSubmission);
      localStorage.setItem(STORAGE_KEYS.USER_SUBMISSIONS, JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    setErrors({});
    setSubmitted(true);
  };

  const copyCurrentDraftAsJson = () => {
    const payload = {
      name: name.trim(),
      url: url.trim(),
      category,
      subcategory: subcategory.trim() || 'General',
      license: license.trim() || 'Unspecified',
      tierQuota: tierQuota.trim() || 'Unspecified',
      savedLocallyAt: new Date().toISOString(),
    };
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    });
  };

  const resetForm = () => {
    setName('');
    setUrl('');
    setCategory('dev');
    setSubcategory('');
    setLicense('');
    setTierQuota('');
    setSubmitted(false);
    setCopiedDraft(false);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md select-none will-change-opacity"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-modal-title"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-lg bg-surface border border-line rounded-[6px] p-6 sm:p-8 shadow-2xl text-bone will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hairline accent at top */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-reishi/40 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-[2px] bg-white/[0.04] text-ash-400 hover:text-bone hover:bg-white/[0.08] transition-colors focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none cursor-pointer"
          title="Close dialog (Escape)"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="type-h2 text-bone">
              Draft Saved Locally in Browser
            </h2>
            <div className="p-3.5 rounded bg-ink border border-line text-xs text-ash-300 leading-relaxed text-left space-y-2">
              <p>
                Your draft for <strong className="text-bone">&ldquo;{name}&rdquo;</strong> has been saved to your browser&apos;s <code className="font-mono text-reishi text-[11px]">{STORAGE_KEYS.USER_SUBMISSIONS}</code>.
              </p>
              <p className="text-ash-400">
                Notice: MARIA runs strictly client-side with zero remote collection servers. Drafts are not sent over the network. You can copy the draft JSON below to save or submit elsewhere.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={copyCurrentDraftAsJson}
                className="type-btn px-4 py-2 rounded-[2px] bg-ink hover:bg-surface text-bone border border-line transition-colors flex items-center gap-2 text-xs cursor-pointer"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-reishi" />}
                <span>{copiedDraft ? 'Draft JSON Copied' : 'Copy Draft JSON'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="type-btn px-4 py-2 rounded-[2px] bg-surface hover:bg-ink text-ash-400 hover:text-bone border border-line transition-colors text-xs cursor-pointer"
              >
                Create Another Draft
              </button>
              <button
                type="button"
                onClick={onClose}
                className="type-btn px-5 py-2 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-bold transition-colors shadow-sm text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <div className="flex items-center gap-2 type-eyebrow text-reishi">
                <Info className="w-4 h-4" />
                <span>Local Draft Workspace</span>
              </div>
              <h2 id="submission-modal-title" className="type-h2 text-bone tracking-tight">
                Save a Resource Draft
              </h2>
              <p className="type-caption text-ash-400">
                Drafts are stored client-side in your browser storage. No data is sent to external servers.
              </p>
            </div>

            {/* Tool Name */}
            <div>
              <label htmlFor="tool-name" className="block type-caption text-bone mb-1 font-medium">
                Resource Name <span className="text-red-400">*</span>
              </label>
              <input
                id="tool-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bun, Penpot, vLLM..."
                className={`w-full px-3.5 py-2 rounded-[4px] bg-ink border text-bone text-xs placeholder:text-ash-600 focus:outline-none focus:ring-1 focus:ring-reishi ${
                  errors.name ? 'border-red-500/60' : 'border-line'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Official Website URL */}
            <div>
              <label htmlFor="tool-url" className="block type-caption text-bone mb-1 font-medium">
                Canonical URL <span className="text-red-400">*</span>
              </label>
              <input
                id="tool-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo or https://tool.dev"
                className={`w-full px-3.5 py-2 rounded-[4px] bg-ink border text-bone text-xs placeholder:text-ash-600 focus:outline-none focus:ring-1 focus:ring-reishi ${
                  errors.url ? 'border-red-500/60' : 'border-line'
                }`}
              />
              {errors.url && <p className="mt-1 text-xs text-red-400">{errors.url}</p>}
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="tool-category" className="block type-caption text-bone mb-1 font-medium">
                  Discipline
                </label>
                <select
                  id="tool-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                  className="w-full px-3.5 py-2 rounded-[4px] bg-ink border border-line text-bone text-xs focus:outline-none focus:ring-1 focus:ring-reishi"
                >
                  <option value="dev">Developer Tools</option>
                  <option value="design">Design &amp; 3D</option>
                  <option value="video">Video &amp; Audio</option>
                  <option value="ai">AI &amp; Inference</option>
                  <option value="api">Public APIs</option>
                  <option value="asset">Creative Assets</option>
                </select>
              </div>

              <div>
                <label htmlFor="tool-subcategory" className="block type-caption text-bone mb-1 font-medium">
                  Subcategory
                </label>
                <input
                  id="tool-subcategory"
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Database, Shaders, Local LLM"
                  className="w-full px-3.5 py-2 rounded-[4px] bg-ink border border-line text-bone text-xs placeholder:text-ash-600 focus:outline-none focus:ring-1 focus:ring-reishi"
                />
              </div>
            </div>

            {/* License & Known Quota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="tool-license" className="block type-caption text-bone mb-1 font-medium">
                  License (Optional)
                </label>
                <input
                  id="tool-license"
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="e.g. MIT, Apache 2.0, Proprietary"
                  className="w-full px-3.5 py-2 rounded-[4px] bg-ink border border-line text-bone text-xs placeholder:text-ash-600 focus:outline-none focus:ring-1 focus:ring-reishi"
                />
              </div>

              <div>
                <label htmlFor="tool-quota" className="block type-caption text-bone mb-1 font-medium">
                  Tier Limits (Optional)
                </label>
                <input
                  id="tool-quota"
                  type="text"
                  value={tierQuota}
                  onChange={(e) => setTierQuota(e.target.value)}
                  placeholder="e.g. 500MB DB, 10k requests/mo"
                  className="w-full px-3.5 py-2 rounded-[4px] bg-ink border border-line text-bone text-xs placeholder:text-ash-600 focus:outline-none focus:ring-1 focus:ring-reishi"
                />
              </div>
            </div>

            {/* Client-Side Disclosure Banner */}
            <div className="p-3 rounded bg-ink border border-line text-[11px] text-ash-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-reishi shrink-0 mt-0.5" />
              <span>
                Saved proposals remain exclusively in your browser storage. MARIA maintains zero remote databases or collection endpoints.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-line">
              <button
                type="button"
                onClick={handleClose}
                className="type-btn px-4 py-2 rounded-[4px] bg-ink hover:bg-surface text-ash-400 hover:text-bone border border-line transition-colors text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="type-btn px-5 py-2 rounded-[4px] bg-bone hover:bg-[#E8E8E1] text-ink font-semibold transition-colors shadow-sm text-xs cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
