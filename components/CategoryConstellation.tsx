'use client';

import React, { useState } from 'react';
import {
  Code2,
  Paintbrush,
  Film,
  Bot,
  Terminal,
  GitBranch,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { ResourceCategory } from '@/types/resource';
import { useScrollReveal } from '@/lib/motion';

interface CategoryConstellationProps {
  onSelectCategory: (cat: ResourceCategory | 'all') => void;
  onFilterOpenSource: () => void;
}

export function CategoryConstellation({
  onSelectCategory,
  onFilterOpenSource,
}: CategoryConstellationProps) {
  const [activeDomain, setActiveDomain] = useState<
    'dev' | 'design' | 'video' | 'ai' | 'api' | 'oss'
  >('dev');
  const sectionRef = useScrollReveal<HTMLElement>(0.1);

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal py-12 px-2 sm:px-4 max-w-7xl mx-auto w-full select-none"
    >
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="type-eyebrow text-reishi block mb-1.5">
          Discipline Architecture &amp; Workflows
        </span>
        <h2 className="type-section-title text-bone">
          The 6 Core Disciplines of MARIA
        </h2>
        <p className="type-supporting text-ash-400 mt-2">
          Explore the six foundational areas of the directory: software engineering, interface design, video production, artificial intelligence, public APIs, and open-source foundations.
        </p>
      </div>

      {/* Domain Navigation Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-ink border border-line p-1.5 rounded-[6px] max-w-3xl mx-auto">
        {[
          { id: 'dev', label: 'Developer', icon: Code2 },
          { id: 'design', label: 'Design & 3D', icon: Paintbrush },
          { id: 'video', label: 'Video & Motion', icon: Film },
          { id: 'ai', label: 'AI & Inference', icon: Bot },
          { id: 'api', label: 'Connected APIs', icon: Terminal },
          { id: 'oss', label: 'Open Source', icon: GitBranch },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveDomain(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi ${
                isActive
                  ? 'bg-surface text-reishi font-bold border border-reishi/50 shadow-sm'
                  : 'text-ash-600 hover:text-bone hover:bg-surface/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Visual Canvas Container */}
      <div className="bg-surface border border-line rounded-[6px] p-6 sm:p-10 max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* 1. DEVELOPER METAPHOR: Syntax Structure & Modular Edge Diagram */}
        {activeDomain === 'dev' && (
          <div className="space-y-6 animate-fade-in relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="type-h4 text-bone flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-reishi" />
                  <span>Developer Universe & Serverless Topology</span>
                </h3>
                <p className="type-body-sm text-ash-400 mt-1">
                  Full-stack TypeScript architecture: Server Components, Edge Workers, and PostgreSQL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectCategory('dev')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                <span>Browse Dev Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Code Node Graph Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-[4px] bg-ink border border-line font-mono text-xs">
                <div className="text-ash-600 text-[10px] uppercase font-semibold mb-2">
                  Client Runtime
                </div>
                <div className="text-reishi font-bold">Next.js App Router</div>
                <div className="text-ash-400 text-[11px] mt-1">
                  SSR + React Server Components with Zero Client JS overhead
                </div>
              </div>

              <div className="p-4 rounded-[4px] bg-ink border border-reishi/40 font-mono text-xs shadow-[0_0_15px_rgba(143,211,255,0.08)]">
                <div className="text-reishi text-[10px] uppercase font-semibold mb-2 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>Edge Routing</span>
                </div>
                <div className="text-bone font-bold">Cloudflare / Hono</div>
                <div className="text-ash-400 text-[11px] mt-1">
                  Global sub-10ms request handling with zero cold starts
                </div>
              </div>

              <div className="p-4 rounded-[4px] bg-ink border border-line font-mono text-xs">
                <div className="text-ash-600 text-[10px] uppercase font-semibold mb-2">
                  Database & Auth
                </div>
                <div className="text-bone font-bold">Supabase Postgres</div>
                <div className="text-ash-400 text-[11px] mt-1">
                  Row-level security, real-time websockets, and scale-to-zero compute
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DESIGN METAPHOR: Typography Hierarchy & Dynamic Color Tokens */}
        {activeDomain === 'design' && (
          <div className="space-y-6 animate-fade-in relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="type-h4 text-bone flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-reishi" />
                  <span>Design Systems & Spatial Composition</span>
                </h3>
                <p className="type-body-sm text-ash-400 mt-1">
                  Free-license variable typography, vector prototyping in Penpot, and 3D modeling in Blender.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectCategory('design')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                <span>Browse Design Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Specimen and Color Swatch Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-[4px] bg-ink border border-line space-y-3">
                <span className="text-[11px] font-mono text-ash-600 uppercase font-semibold">
                  Type Scale Specimen
                </span>
                <div className="type-h3 text-bone tracking-tight">
                  Zodiak &amp; Satoshi
                </div>
                <div className="text-sm font-semibold text-reishi">
                  Subheading Variable · 600 SemiBold
                </div>
                <div className="text-xs text-ash-400 leading-relaxed font-mono">
                  Body prose with optical legibility compensation and tabular figures.
                </div>
              </div>

              <div className="p-5 rounded-[4px] bg-ink border border-line space-y-3">
                <span className="text-[11px] font-mono text-ash-600 uppercase font-semibold">
                  Curated Design Tokens
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Reishi Blue', hex: '#8FD3FF', bg: 'bg-[#8FD3FF]' },
                    { name: 'Wine Velvet', hex: '#541C42', bg: 'bg-[#541C42]' },
                    { name: 'Bone White', hex: '#F5F5F0', bg: 'bg-[#F5F5F0]' },
                    { name: 'Obsidian', hex: '#070709', bg: 'bg-[#070709] border border-line' },
                  ].map((s) => (
                    <div key={s.name} className="space-y-1 text-center">
                      <div className={`h-10 rounded-[2px] ${s.bg}`} />
                      <div className="text-[10px] font-mono text-ash-600">{s.hex}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. VIDEO METAPHOR: Multi-Track Timeline & Waveform Motif */}
        {activeDomain === 'video' && (
          <div className="space-y-6 animate-fade-in relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="type-h4 text-bone flex items-center gap-2">
                  <Film className="w-5 h-5 text-reishi" />
                  <span>Video &amp; Motion Timeline Architecture</span>
                </h3>
                <p className="type-body-sm text-ash-400 mt-1">
                  Hollywood color grading in DaVinci Resolve, zero-loss trimming with FFmpeg, and CC0 audio stems.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectCategory('video')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                <span>Browse Video Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulated Multi-Track Timeline */}
            <div className="p-4 rounded-[4px] bg-ink border border-line space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-ash-600 pb-2 border-b border-line">
                <span>00:00:00:00</span>
                <span>00:01:15:12</span>
                <span>00:02:30:24</span>
                <span className="text-reishi font-semibold">4K UHD 60fps</span>
              </div>

              {/* Video Track 1 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-8 font-mono text-ash-600 text-[10px]">V1</span>
                <div className="flex-1 h-7 rounded-[2px] bg-[#12161f] border border-reishi/40 flex items-center px-3 text-[11px] font-mono text-bone">
                  A-Roll: Master 4K Cinema Shot (DaVinci Resolve)
                </div>
              </div>

              {/* Video Track 2 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-8 font-mono text-ash-600 text-[10px]">V2</span>
                <div className="w-1/3 h-7 rounded-[2px] bg-surface border border-line flex items-center px-3 text-[11px] font-mono text-ash-400 ml-24">
                  B-Roll: Drone Aerial (Pexels 4K)
                </div>
              </div>

              {/* Audio Track 1 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-8 font-mono text-ash-600 text-[10px]">A1</span>
                <div className="flex-1 h-7 rounded-[2px] bg-ink border border-emerald-500/30 flex items-center px-3 text-[11px] font-mono text-emerald-200">
                  Dialogue Track (Fairlight Audio Compression)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. AI METAPHOR: Neural Node Propagation */}
        {activeDomain === 'ai' && (
          <div className="space-y-6 animate-fade-in relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="type-h4 text-bone flex items-center gap-2">
                  <Bot className="w-5 h-5 text-reishi" />
                  <span>Neural Networks &amp; Local Inference</span>
                </h3>
                <p className="type-body-sm text-ash-400 mt-1">
                  Run Llama 3 locally via Ollama or stream 500 tok/sec through Groq Cloud serverless API.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectCategory('ai')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                <span>Browse AI Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Neural Topology Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-[4px] bg-ink border border-line font-mono text-xs">
                <span className="text-[10px] text-ash-600 uppercase block mb-1">
                  Input Tokens
                </span>
                <div className="text-reishi font-bold">Prompt Embeddings</div>
                <div className="text-[11px] text-ash-400 mt-1">
                  ChromaDB vector search & semantic chunking
                </div>
              </div>

              <div className="p-4 rounded-[4px] bg-ink border border-reishi/40 font-mono text-xs">
                <span className="text-[10px] text-reishi uppercase block mb-1">
                  Inference Layer
                </span>
                <div className="text-bone font-bold">Ollama / Groq LPU</div>
                <div className="text-[11px] text-ash-400 mt-1">
                  Quantized GGUF execution with GPU offloading
                </div>
              </div>

              <div className="p-4 rounded-[4px] bg-ink border border-line font-mono text-xs">
                <span className="text-[10px] text-ash-600 uppercase block mb-1">
                  Generated Output
                </span>
                <div className="text-bone font-bold">Streamed Tokens</div>
                <div className="text-[11px] text-ash-400 mt-1">
                  Low-latency JSON response or TTS audio waveform
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. API METAPHOR: Client-to-Edge Request Flow */}
        {activeDomain === 'api' && (
          <div className="space-y-6 animate-fade-in relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="type-h4 text-bone flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-reishi" />
                  <span>Public API Mesh &amp; Endpoints</span>
                </h3>
                <p className="type-body-sm text-ash-400 mt-1">
                  Global weather forecasting, geospatial reverse-geocoding, and civic data with no API key needed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectCategory('api')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                <span>Browse APIs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-[4px] bg-ink border border-line font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-ash-400 pb-2 border-b border-line">
                <span className="text-reishi">GET /v1/forecast</span>
                <span className="text-emerald-400">200 OK · 24ms</span>
              </div>
              <pre className="text-[11px] text-bone overflow-x-auto whitespace-pre">
{`{
  "latitude": 52.52,
  "longitude": 13.41,
  "current": {
    "temperature_2m": 18.4,
    "wind_speed_10m": 9.2
  },
  "auth_required": false
}`}
              </pre>
            </div>
          </div>
        )}

        {/* 6. OPEN SOURCE METAPHOR: Branching Graph */}
        {activeDomain === 'oss' && (
          <div className="space-y-6 animate-fade-in relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h3 className="type-h4 text-bone flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-reishi" />
                  <span>The Open Source Frontier</span>
                </h3>
                <p className="type-body-sm text-ash-400 mt-1">
                  Permissively licensed codebases with direct links to verified GitHub repositories.
                </p>
              </div>
              <button
                type="button"
                onClick={onFilterOpenSource}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-bone hover:bg-[#E8E8E1] text-ink font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                <span>Filter Open Source</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-[4px] bg-ink border border-line">
                <div className="text-reishi text-[10px] font-bold">MIT LICENSE</div>
                <div className="text-bone font-bold mt-1">Next.js &amp; Hono</div>
                <div className="text-ash-600 text-[11px] mt-1">Unrestricted commercial & personal use</div>
              </div>
              <div className="p-4 rounded-[4px] bg-ink border border-line">
                <div className="text-reishi text-[10px] font-bold">APACHE 2.0</div>
                <div className="text-bone font-bold mt-1">Supabase &amp; Playwright</div>
                <div className="text-ash-600 text-[11px] mt-1">Patent grants & open collaboration</div>
              </div>
              <div className="p-4 rounded-[4px] bg-ink border border-line">
                <div className="text-reishi text-[10px] font-bold">GNU GPL V3</div>
                <div className="text-bone font-bold mt-1">Blender &amp; Kdenlive</div>
                <div className="text-ash-600 text-[11px] mt-1">Perpetually free community software</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
