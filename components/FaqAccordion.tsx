'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'General' | 'Licensing & Pricing' | 'Workflows' | 'Verification & Standards';
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

const CATEGORIES = ['All', 'General', 'Licensing & Pricing', 'Workflows', 'Verification & Standards'];

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // Exactly one item open at a time
  const [openId, setOpenId] = useState<string | null>('what-is-maria');

  const toggleItem = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const filteredFaqs = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Search & Category Filter Controls */}
      <div className="space-y-4 pt-4 border-t border-line">
        <div className="relative">
          <Search className="w-4 h-4 text-ash-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by topic (e.g., license, submission, free tier, open source)..."
            className="w-full pl-10 pr-4 py-2.5 glass-control rounded-[4px] text-xs sm:text-sm text-bone placeholder-ash-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-ink text-reishi font-semibold border border-reishi/50 shadow-sm'
                  : 'bg-surface text-ash-400 border border-line hover:text-bone hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accessible Accordion List: 1 open at a time */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-[6px] border border-line bg-surface text-ash-400 text-sm">
            No questions found matching your search. Try a different keyword or reset filters.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const contentId = `faq-content-${faq.id}`;
            const buttonId = `faq-header-${faq.id}`;

            return (
              <div
                key={faq.id}
                className="rounded-lg bg-surface border border-line overflow-hidden transition-colors hover:border-line/80"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-reishi transition-colors cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                      <span className="text-xs font-mono text-reishi font-medium">
                        {faq.category}
                      </span>
                      <span className="text-line" aria-hidden="true">·</span>
                      <span className="font-sans font-semibold text-sm sm:text-base text-bone">
                        {faq.question}
                      </span>
                    </div>

                    {/* Single Plus that rotates 45 degrees to become a cross */}
                    <Plus
                      aria-hidden="true"
                      className={`w-4 h-4 shrink-0 transition-transform duration-350 ease-aizen ${
                        isOpen ? 'rotate-45 text-reishi' : 'text-ash-500'
                      }`}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.45, 0, 0.15, 1)' }}
                    />
                  </button>
                </h3>

                {/* Animated Height Container */}
                <div
                  className={`grid transition-[grid-template-rows] duration-350 ease-aizen ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.45, 0, 0.15, 1)' }}
                >
                  <div className="overflow-hidden">
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-5 pb-5 pt-2 text-sm text-ash-300 leading-relaxed border-t border-line/60"
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
