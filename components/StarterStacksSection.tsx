'use client';

import React, { useState } from 'react';
import { StarterStack, ResourceItem } from '@/types/resource';
import { Layers, ArrowUpRight, Check } from 'lucide-react';
import { useScrollReveal } from '@/lib/motion';

interface StarterStacksSectionProps {
  starterStacks: StarterStack[];
  allResources: ResourceItem[];
  onApplyPreset: (stack: StarterStack) => void;
  onInspect: (r: ResourceItem) => void;
}

export function StarterStacksSection({
  starterStacks,
  allResources,
  onApplyPreset,
  onInspect,
}: StarterStacksSectionProps) {
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>(0.1);

  const handleApply = (stack: StarterStack) => {
    onApplyPreset(stack);
    setAppliedId(stack.id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  return (
    <section
      id="starter-stacks"
      ref={sectionRef}
      className="scroll-reveal py-12 px-2 sm:px-4 max-w-7xl mx-auto w-full select-none"
    >
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="type-eyebrow text-reishi block mb-1.5">
          Curated Architectural Blueprints
        </span>
        <h2 className="type-section-title text-bone">
          Battle-Tested Starter Stacks
        </h2>
        <p className="type-supporting text-ash-400 mt-2">
          Cohesive combinations of verified open-source and free-tier tools engineered for rapid production. Load complete pipelines into your workspace with single-action execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {starterStacks.map((stack) => {
          const stackTools = allResources.filter((r) => stack.resourceIds.includes(r.id));
          const isApplied = appliedId === stack.id;

          return (
            <div
              key={stack.id}
              className="group relative glass-card rounded-[6px] p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* 1px Hairline along the top edge */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[1px] bg-reishi transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none"
              />

              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="type-eyebrow text-reishi">
                      {stack.targetAudience}
                    </span>
                    <h3 className="type-h4 text-bone mt-1 group-hover:translate-x-[2px] transition-transform duration-200">
                      {stack.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(stack)}
                    className={`type-btn flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] transition-all whitespace-nowrap shrink-0 focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none cursor-pointer ${
                      isApplied
                        ? 'bg-reishi/20 text-reishi border border-reishi/50'
                        : 'bg-bone text-ink hover:bg-[#E8E8E1]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-reishi" />
                        <span>Loaded to Stack</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5 text-ink" />
                        <span>Load Blueprint</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="type-body-sm text-ash-400 leading-relaxed mb-5">
                  {stack.description}
                </p>

                {/* Component Tools Breakdown */}
                <div className="space-y-2">
                  <span className="type-eyebrow-muted block">
                    Integrated Toolchain ({stackTools.length}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {stackTools.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onInspect(t)}
                        className="p-2.5 rounded-[2px] bg-ink border border-line hover:border-reishi/40 text-left transition-colors group/item cursor-pointer"
                      >
                        <div className="font-sans font-semibold text-xs text-bone group-hover/item:text-reishi flex items-center justify-between">
                          <span className="truncate">{t.name}</span>
                          <ArrowUpRight className="w-3 h-3 text-ash-600 group-hover/item:text-reishi shrink-0 ml-1" />
                        </div>
                        <div className="type-caption text-ash-600 truncate mt-0.5">
                          {t.subcategory}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs text-ash-600 font-sans">
                <span>Infrastructure: <strong className="text-reishi font-bold font-mono tabular-nums">$0.00 / month</strong></span>
                <span className="text-ash-600">Verified Invariant</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
