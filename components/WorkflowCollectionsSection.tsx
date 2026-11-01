'use client';

import React, { useState } from 'react';
import { WorkflowCollection, ResourceItem } from '@/types/resource';
import {
  Globe,
  Palette,
  Film,
  Bot,
  Terminal,
  Layers,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { useScrollReveal } from '@/lib/motion';

interface WorkflowCollectionsSectionProps {
  collections: WorkflowCollection[];
  allResources: ResourceItem[];
  onApplyCollection: (c: WorkflowCollection) => void;
  onInspect: (r: ResourceItem) => void;
}

export function WorkflowCollectionsSection({
  collections,
  allResources,
  onApplyCollection,
  onInspect,
}: WorkflowCollectionsSectionProps) {
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>(0.1);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe':
        return Globe;
      case 'Palette':
        return Palette;
      case 'Film':
        return Film;
      case 'Bot':
        return Bot;
      case 'Terminal':
        return Terminal;
      default:
        return Layers;
    }
  };

  const handleApply = (c: WorkflowCollection) => {
    onApplyCollection(c);
    setLoadedId(c.id);
    setTimeout(() => setLoadedId(null), 2500);
  };

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="scroll-reveal py-12 px-2 sm:px-4 max-w-7xl mx-auto w-full border-t border-line select-none"
    >
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="type-eyebrow text-reishi block mb-1.5">
          Multi-Tool Disciplines
        </span>
        <h2 className="type-section-title text-bone">
          Curated Workflow Collections
        </h2>
        <p className="type-supporting text-ash-400 mt-2">
          End-to-end production pipelines assembled for complete creative objectives: full-stack web architectures, 3D WebGL scenes, generative AI pipelines, and sovereign data stores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const Icon = getIcon(col.iconName);
          const colResources = allResources.filter((r) => col.resourceIds.includes(r.id));
          const isLoaded = loadedId === col.id;

          return (
            <div
              key={col.id}
              className="group relative glass-card rounded-[6px] p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* 1px Hairline along the top edge */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[1px] bg-reishi transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none"
              />

              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2 rounded-[2px] bg-ink border border-line text-reishi">
                    <Icon className="w-4 h-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply(col)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] font-mono text-xs uppercase font-bold tracking-wider transition-all whitespace-nowrap focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none cursor-pointer ${
                      isLoaded
                        ? 'bg-reishi/20 text-reishi border border-reishi/50'
                        : 'bg-bone text-ink hover:bg-[#E8E8E1]'
                    }`}
                  >
                    {isLoaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-reishi" />
                        <span>Added to Stack</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5 text-ink" />
                        <span>Add Collection</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mb-2">
                  <h3 className="type-h4 text-bone group-hover:translate-x-[2px] transition-transform duration-200">
                    {col.title}
                  </h3>
                  <div className="type-caption font-mono text-xs text-reishi mt-0.5">
                    {col.subtitle}
                  </div>
                </div>

                <p className="type-body-sm text-ash-400 mb-5 leading-relaxed">
                  {col.description}
                </p>

                {/* Sub-tools Pill/List */}
                <div className="space-y-1.5 pt-3 border-t border-line">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-ash-600 block">
                    Pipeline Components ({colResources.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {colResources.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onInspect(r)}
                        className="px-2 py-1 rounded-[2px] bg-ink border border-line hover:border-reishi/40 text-[11px] font-mono text-ash-400 hover:text-bone flex items-center gap-1 transition-colors group/sub cursor-pointer"
                      >
                        <span>{r.name}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-ash-600 group-hover/sub:text-reishi" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between text-xs font-mono text-ash-600">
                <span>Monthly Overhead: <strong className="text-reishi font-bold">{col.estimatedCost}</strong></span>
                <span className="text-ash-600">Commercial Free</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
