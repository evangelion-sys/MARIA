'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ResourceItem } from '@/types/resource';
import {
  X,
  Github,
  FileText,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
  Zap,
  Lock,
  CreditCard,
  ArrowUpRight,
  Star,
} from 'lucide-react';
import { animate, stagger } from 'animejs';
import { isReducedMotion } from '@/lib/motion';
import { RESOURCES } from '@/data/resources';
import { useGitHubStars } from '@/hooks/use-github-stars';

interface ResourceModalProps {
  resource: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string, name?: string) => void;
  onSelectRelated: (r: ResourceItem) => void;
  allResources?: ResourceItem[];
}

export function ResourceModal({
  resource,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onSelectRelated,
  allResources,
}: ResourceModalProps) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { formatted: starCount, stars: rawStars } = useGitHubStars(resource?.repoUrl);

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

  // Focus trap, body scroll lock, and entrance animation
  useEffect(() => {
    if (!isOpen || !resource) {
      setIsClosing(false);
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Coordinated modal reveal animation
    if (!isReducedMotion()) {
      if (backdropRef.current) {
        animate(backdropRef.current, {
          opacity: [0, 1],
          duration: 250,
          ease: 'outQuad',
        });
      }

      if (modalContentRef.current) {
        animate(modalContentRef.current, {
          opacity: [0, 1],
          scale: [0.97, 1],
          translateY: [12, 0],
          duration: 350,
          ease: 'cubicBezier(0.16, 1, 0.3, 1)', // ease-yhwach
        });

        const revealItems = modalContentRef.current.querySelectorAll('.modal-reveal-item');
        if (revealItems.length > 0) {
          animate(revealItems, {
            opacity: [0, 1],
            translateY: [10, 0],
            delay: stagger(30, { start: 80 }),
            duration: 350,
            ease: 'outCubic',
          });
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalContentRef.current) {
        const focusable = modalContentRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, resource, handleClose]);

  if (!isOpen || !resource) return null;

  // Filter complementary related artifacts using catalog fallback
  const catalog = allResources && allResources.length > 0 ? allResources : RESOURCES;
  const related = catalog
    .filter((r) => r.id !== resource.id)
    .map((r) => {
      let score = 0;
      if (r.category === resource.category) score += 3;
      if (r.subcategory === resource.subcategory) score += 4;
      const sharedTags = r.tags.filter((t) => resource.tags.includes(t));
      score += sharedTags.length * 2;
      return { resource: r, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.resource);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/85 backdrop-blur-md select-none will-change-opacity"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-resource-title"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-modal rounded-[6px] p-6 sm:p-8 shadow-2xl text-bone will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 1px Reishi Hairline */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-reishi/40 to-transparent" />

        {/* Visible Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-sm bg-ink border border-line text-ash-400 hover:text-bone hover:border-reishi/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer"
          title="Close inspector"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Block */}
        <div className="pr-10 modal-reveal-item">
          <div className="flex flex-wrap items-center gap-2 type-eyebrow text-ash-600 mb-2">
            <span className="text-reishi">{resource.category.toUpperCase()}</span>
            <span aria-hidden="true" className="text-line">·</span>
            <span>{resource.subcategory}</span>
            <span aria-hidden="true" className="text-line">·</span>
            <span className="text-bone">{resource.pricingType}</span>
            {resource.accessModel && (
              <>
                <span aria-hidden="true" className="text-line">·</span>
                <span className="text-ash-400 capitalize">{resource.accessModel.replace('-', ' ')}</span>
              </>
            )}
          </div>

          <h2 id="modal-resource-title" className="type-h2 text-bone tracking-tight">
            {resource.name}
          </h2>
          <p className="type-body-sm text-ash-400 mt-1">
            {resource.tagline}
          </p>
        </div>

        {/* Primary CTA Row */}
        <div className="modal-reveal-item flex flex-wrap items-center gap-3 mt-6 pb-6 border-b border-line">
          {typeof resource.url === 'string' && resource.url.startsWith('https://') && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink type-btn transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reishi"
              aria-label={`Open ${resource.name} website in a new tab`}
            >
              <span>Open Resource</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-ink shrink-0" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}

          {typeof resource.docsUrl === 'string' && resource.docsUrl.startsWith('https://') && (
            <a
              href={resource.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-ink hover:bg-surface text-bone type-btn transition-colors border border-line hover:border-reishi/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
              aria-label={`Open ${resource.name} documentation in a new tab`}
            >
              <FileText className="w-3.5 h-3.5 text-reishi shrink-0" />
              <span>Documentation</span>
              <ArrowUpRight className="w-3 h-3 text-ash-600 shrink-0" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}

          {typeof resource.repoUrl === 'string' && resource.repoUrl.startsWith('https://') && (
            <a
              href={resource.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-ink hover:bg-surface text-bone type-btn transition-colors border border-line hover:border-reishi/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
              aria-label={`Open ${resource.name} source code repository on GitHub${starCount ? ` with ${starCount} stars` : ''} in a new tab`}
            >
              <Github className="w-3.5 h-3.5 text-reishi shrink-0" />
              <span>Source Code</span>
              {starCount && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-surface text-ash-300 font-mono text-[11px] border border-line">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400/40 shrink-0" />
                  <span>{starCount}</span>
                </span>
              )}
              <ArrowUpRight className="w-3 h-3 text-ash-600 shrink-0" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onToggleSave(resource.id, resource.name)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[2px] type-btn transition-colors border cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi ${
              isSaved
                ? 'bg-reishi/15 border-reishi/50 text-reishi'
                : 'bg-ink border-line text-ash-400 hover:text-bone'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-reishi" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'In Active Stack' : 'Save to Stack'}</span>
          </button>
        </div>

        {/* Detailed Sections */}
        <div className="py-6 space-y-6">
          {/* Architectural Overview */}
          <div className="modal-reveal-item">
            <h3 className="type-eyebrow text-ash-600 mb-2">
              Resource Overview
            </h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Access & Verification Grid */}
          <div className="modal-reveal-item grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-[4px] bg-ink border border-line space-y-1.5">
              <div className="flex items-center gap-2 type-eyebrow text-ash-600">
                <ShieldCheck className="w-3.5 h-3.5 text-reishi" />
                <span>License Terms</span>
              </div>
              <div className="type-code text-sm font-bold text-bone">
                {resource.license}
              </div>
              <div className="type-caption text-ash-400">
                {resource.openSource && resource.repoUrl
                  ? 'Open source software with public repository.'
                  : resource.openSource
                  ? 'Open source license declared.'
                  : 'Proprietary product, API, or service terms.'}
              </div>
            </div>

            <div className="p-4 rounded-[4px] bg-ink border border-line space-y-1.5">
              <div className="flex items-center gap-2 type-eyebrow text-ash-600">
                <CreditCard className="w-3.5 h-3.5 text-reishi" />
                <span>Credit Card Requirement</span>
              </div>
              <div className="type-code text-sm font-bold text-bone">
                {resource.creditCardRequired === true
                  ? 'Credit Card Required'
                  : resource.creditCardRequired === false
                  ? 'No Credit Card Required'
                  : 'Credit Card Policy Unverified'}
              </div>
              <div className="type-caption text-ash-400">
                {resource.creditCardRequired === true
                  ? 'Payment method required for account verification or provisioning.'
                  : resource.creditCardRequired === false
                  ? 'Can be accessed without submitting credit card details.'
                  : 'Upfront credit card policy has not been verified.'}
              </div>
            </div>

            <div className="p-4 rounded-[4px] bg-ink border border-line space-y-1.5">
              <div className="flex items-center gap-2 type-eyebrow text-ash-600">
                <Lock className="w-3.5 h-3.5 text-reishi" />
                <span>Authentication Requirements</span>
              </div>
              <div className="type-code text-sm font-bold text-bone">
                {resource.authRequired === true
                  ? 'Account Sign-up Required'
                  : resource.authRequired === false
                  ? 'No Account / Direct Access'
                  : 'Authentication Policy Unverified'}
              </div>
              <div className="type-caption text-ash-400">
                {resource.authRequired === true
                  ? 'User registration required to access services, API tokens, or cloud features.'
                  : resource.authRequired === false
                  ? 'Usable directly in browser or terminal with no registration.'
                  : 'Account requirement conditions have not been verified.'}
              </div>
            </div>

            <div className="p-4 rounded-[4px] bg-ink border border-line space-y-1.5">
              <div className="flex items-center gap-2 type-eyebrow text-ash-600">
                <Zap className="w-3.5 h-3.5 text-reishi" />
                <span>Tier Allowance</span>
              </div>
              <div className="type-caption text-bone line-clamp-2">
                {resource.tierQuota || 'Specific tier limits have not been documented for this entry.'}
              </div>
            </div>

            {typeof resource.repoUrl === 'string' && resource.repoUrl.startsWith('https://') && (
              <div className="p-4 rounded-[4px] bg-ink border border-line space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 type-eyebrow text-ash-600">
                    <Github className="w-3.5 h-3.5 text-reishi" />
                    <span>Repository Health &amp; Community Adoption</span>
                  </div>
                  {starCount && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-[2px] border border-amber-400/30">
                      <Star className="w-3 h-3 fill-amber-400/40 text-amber-400" />
                      <strong className="text-bone">{starCount}</strong> stars
                    </span>
                  )}
                </div>
                <div className="type-code text-sm font-bold text-bone">
                  {rawStars !== null ? `${rawStars.toLocaleString()} GitHub Stargazers` : starCount ? `${starCount} GitHub Stars` : 'Verified Public Repository'}
                </div>
                <div className="type-caption text-ash-400">
                  {rawStars !== null
                    ? `Live metric retrieved directly from GitHub REST API to assess open-source ecosystem activity, adoption, and maintenance health.`
                    : 'Official source code repository hosted publicly on GitHub.'}
                </div>
              </div>
            )}
          </div>

          {/* Verification Status & Integrity */}
          <div className="modal-reveal-item p-4 rounded-[4px] bg-ink border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[2px] bg-reishi/10 border border-reishi/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-reishi" />
              </div>
              <div>
                <div className="type-eyebrow text-reishi flex items-center gap-2">
                  <span>
                    {resource.verificationStatus === 'verified'
                      ? 'VERIFIED RESOURCE'
                      : resource.verificationStatus === 'broken'
                      ? 'REPORTED BROKEN'
                      : 'CATALOG ENTRY (UNVERIFIED)'}
                  </span>
                  <span className="text-ash-600 font-mono text-[10px]">· {resource.verificationStatus || 'unverified'}</span>
                </div>
                <div className="type-caption text-ash-400 text-xs mt-0.5">
                  {resource.verificationStatus === 'verified'
                    ? 'Terms, canonical link, and tier quota verified with documented evidence.'
                    : 'Community-indexed resource. Tier limits, pricing, and licensing terms have not been independently audited.'}
                </div>
              </div>
            </div>
            {resource.lastVerifiedAt && (
              <div className="type-meta text-ash-600 font-mono text-xs whitespace-nowrap sm:text-right">
                <span>Audited: </span>
                <span className="text-bone">{resource.lastVerifiedAt}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="modal-reveal-item">
              <h3 className="type-eyebrow text-ash-600 mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 type-code text-ash-400">
                {resource.tags.map((tag, idx) => (
                  <span key={tag}>
                    #{tag}
                    {idx < resource.tags.length - 1 && <span className="ml-2 text-line">·</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Resources */}
          {related.length > 0 && (
            <div className="modal-reveal-item pt-4 border-t border-line">
              <h3 className="type-eyebrow text-reishi mb-3">
                Related Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectRelated(item)}
                    className="p-3 rounded-[4px] bg-ink border border-line hover:border-reishi/50 text-left transition-colors group"
                  >
                    <div className="type-h4 text-xs text-bone group-hover:text-reishi truncate">
                      {item.name}
                    </div>
                    <div className="type-meta text-ash-600 truncate mt-0.5">
                      {item.subcategory}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
