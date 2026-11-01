'use client';

import React from 'react';
import { ResourceItem } from '@/types/resource';
import { Bookmark, BookmarkCheck, ArrowUpRight, Github, FileText, CheckCircle2, Star } from 'lucide-react';
import { normalizeSubcategory } from '@/lib/category-taxonomy';
import { useGitHubStars } from '@/hooks/use-github-stars';

interface ResourceCardProps {
  resource: ResourceItem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onInspect: (resource: ResourceItem) => void;
}

/**
 * Resource Item Card
 *
 * Requirements:
 * - 6px radius, subtle line border, clean typography.
 * - Displays factual resource information: name, tagline, description, category, license, free tier quota.
 * - Displays real-time GitHub star count for tools with verified public repositories.
 * - Direct links to official website, documentation, and source code.
 */
export const ResourceCard = React.memo(function ResourceCard({
  resource,
  isSaved,
  onToggleSave,
  onInspect,
}: ResourceCardProps) {
  const displaySubcategory = normalizeSubcategory(resource.subcategory, resource.category);
  const { formatted: starCount } = useGitHubStars(resource.repoUrl);

  return (
    <article
      className="group relative flex flex-col justify-between glass-card rounded-[6px] p-5 sm:p-6 overflow-hidden select-none"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '280px' }}
    >
      {/* Subtle top edge accent hairline on hover */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[1px] bg-reishi transition-transform duration-200 origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none"
      />

      <div>
        {/* Top Header Row: Subcategory + Pricing Type + Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 type-meta text-ash-400">
            <span className="text-reishi font-semibold uppercase tracking-wider">{displaySubcategory}</span>
            <span aria-hidden="true" className="text-line">·</span>
            <span className="text-bone/80">{resource.pricingType}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(resource.id);
              }}
              className={`p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-[4px] border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer ${
                isSaved
                  ? 'bg-reishi/15 border-reishi/50 text-reishi'
                  : 'bg-ink border-line text-ash-400 hover:text-bone hover:border-line'
              }`}
              title={isSaved ? 'Remove from stack' : 'Save to stack'}
              aria-label={isSaved ? `Remove ${resource.name} from stack` : `Save ${resource.name} to stack`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-reishi" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Title and Tagline */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onInspect(resource)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onInspect(resource);
            }
          }}
          className="text-left group/title block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[2px]"
        >
          <h3 className="type-h4 text-bone group-hover/title:text-reishi transition-colors tracking-tight">
            {resource.name}
          </h3>
          <p className="type-caption font-medium text-ash-400 mt-1 line-clamp-1">
            {resource.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="type-card-desc mt-2.5 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Free Tier Quota Highlight (if documented) */}
        {resource.tierQuota && (
          <div className="mt-4 pt-3 border-t border-line/60 type-body-sm text-ash-400 flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-reishi shrink-0 mt-0.5" />
            <span className="line-clamp-2 text-xs">
              <strong className="text-bone font-medium">Tier notes:</strong> {resource.tierQuota}
            </span>
          </div>
        )}

        {/* Factual Metadata Specifications (Zero-Pill Typographic Hierarchy) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 type-meta text-ash-400 mt-3">
          <span>License: {resource.license}</span>
          <span aria-hidden="true" className="text-line">·</span>
          <span>{resource.authRequired === true ? 'Sign-up required' : resource.authRequired === false ? 'No sign-up' : 'Account unverified'}</span>
          {resource.category === 'api' ? (
            <>
              <span aria-hidden="true" className="text-line">·</span>
              <span className={resource.apiKeyRequired ? 'text-reishi' : 'text-emerald-400'}>
                {resource.apiKeyRequired ? 'Key required' : 'Public endpoints'}
              </span>
            </>
          ) : (
            <>
              <span aria-hidden="true" className="text-line">·</span>
              <span>Card: {resource.creditCardRequired === true ? 'Required' : resource.creditCardRequired === false ? 'None' : 'Unverified'}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-line/60 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onInspect(resource)}
          className="type-btn text-ash-300 hover:text-bone hover:underline transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[2px] py-1.5 px-2 -ml-2 flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <span>View details</span>
          <span aria-hidden="true">→</span>
        </button>

        <div className="flex items-center gap-1.5">
          {typeof resource.repoUrl === 'string' && resource.repoUrl.startsWith('https://') && (
            <a
              href={resource.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`min-h-[36px] flex items-center gap-1.5 text-ash-400 hover:text-bone hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[3px] ${
                starCount ? 'px-2.5 bg-ink/80 border border-line/60 hover:border-line' : 'p-2 min-w-[36px] justify-center'
              }`}
              title={`GitHub repository${starCount ? ` (${starCount} stars)` : ''} (opens in new tab)`}
              aria-label={`${resource.name} source code repository${starCount ? ` with ${starCount} stars` : ''} (opens in new tab)`}
            >
              <Github className="w-3.5 h-3.5 shrink-0" />
              {starCount && (
                <span className="text-[11px] font-mono font-medium text-ash-300 group-hover:text-bone inline-flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400/40 shrink-0" />
                  <span>{starCount}</span>
                </span>
              )}
            </a>
          )}
          {typeof resource.docsUrl === 'string' && resource.docsUrl.startsWith('https://') && (
            <a
              href={resource.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-ash-400 hover:text-bone hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi rounded-[3px]"
              title="Documentation (opens in new tab)"
              aria-label={`${resource.name} official documentation (opens in new tab)`}
            >
              <FileText className="w-3.5 h-3.5" />
            </a>
          )}
          {typeof resource.url === 'string' && resource.url.startsWith('https://') && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-[4px] bg-reishi/10 hover:bg-reishi/20 border border-reishi/30 hover:border-reishi/60 text-reishi text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
              title={`Visit ${resource.name} official website (opens in new tab)`}
              aria-label={`Open ${resource.name} in a new tab`}
            >
              <span>Visit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
});
