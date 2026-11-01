import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CATALOG_TOTAL_COUNT } from '@/data/resource-stats';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import {
  BookOpen,
  Code2,
  ShieldCheck,
  Compass,
  Layers,
  Database,
  ExternalLink,
  Lock,
  Sparkles,
  Command,
  FileCode,
  Terminal,
  Package,
  Paintbrush,
  Film,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation — MARIA',
  description:
    'Comprehensive documentation for the MARIA platform: catalog invariants, data schemas, stack manifest export, and local storage architecture.',
  openGraph: {
    title: 'Documentation — MARIA',
    description:
      'Comprehensive documentation for the MARIA platform: catalog invariants, data schemas, stack manifest export, and local storage architecture.',
  },
  twitter: {
    card: 'summary',
    title: 'Documentation — MARIA',
    description:
      'Comprehensive documentation for the MARIA platform: catalog invariants, data schemas, stack manifest export, and local storage architecture.',
  },
};

export default function DocsPage() {
  const sections = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'invariants', label: '2. Curatorial Invariants' },
    { id: 'disciplines', label: '3. Catalog Disciplines' },
    { id: 'stack-builder', label: '4. Stack Builder & Manifests' },
    { id: 'shortcuts', label: '5. Shortcuts & Navigation' },
    { id: 'storage', label: '6. Storage Architecture' },
    { id: 'contributing', label: '7. Submissions & Auditing' },
  ];

  return (
    <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-14 space-y-16 bg-transparent text-bone">
      {/* Header */}
      <div className="space-y-4 text-left border-b border-line pb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-reishi/10 border border-reishi/25 text-reishi text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Platform Documentation · Rev 2026.10</span>
        </div>
        <h1 className="type-page-title text-bone">
          Platform Architecture &amp; Reference Guide
        </h1>
        <p className="type-body-lg text-ash-300 leading-relaxed max-w-3xl">
          Everything you need to know about navigating MARIA&apos;s index of {CATALOG_TOTAL_COUNT.toLocaleString()} indexed tools, our evaluation invariants, browser-local data sovereignty, and the JSON stack export standard.
        </p>

        {/* Quick Jump Links */}
        <div className="flex flex-wrap gap-2 pt-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-3 py-1 rounded-[2px] bg-surface hover:bg-ink border border-line hover:border-reishi/50 text-ash-400 hover:text-bone text-xs font-mono transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* 1. Introduction */}
      <section id="introduction" className="space-y-5 text-left scroll-mt-24">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <Compass className="w-4 h-4 shrink-0" />
          <span>Section 01</span>
        </div>
        <h2 className="type-section-title text-bone">What is MARIA?</h2>
        <div className="space-y-4 text-sm text-ash-300 leading-relaxed max-w-3xl">
          <p>
            MARIA is an independent, non-commercial directory and developer workspace indexing <strong>{CATALOG_TOTAL_COUNT.toLocaleString()} resources</strong> spanning full-stack web development, generative AI, UI/UX design, 3D WebGL, video production, and scientific open data.
          </p>
          <p>
            Unlike search engines dominated by sponsored ranking or affiliate blogs pushing subscription software, MARIA operates on <em>strict factual verification</em>: every tool is cataloged with verified licensing terms, factual free tier quotas, and direct outbound canonical links.
          </p>
        </div>
      </section>

      {/* 2. Curatorial Invariants */}
      <section id="invariants" className="pt-10 border-t border-line space-y-6 text-left scroll-mt-24">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Section 02</span>
        </div>
        <h2 className="type-section-title text-bone">Curatorial Invariants</h2>
        <p className="type-body text-ash-400 max-w-3xl">
          Every resource admitted into the MARIA directory is checked against four unbreakable quality invariants:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Invariant 01: License Authenticity</span>
            </div>
            <h3 className="type-card-title text-bone">OSI Open Source or Perpetual Free Access</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              Software labeled as <strong>Open Source</strong> must be distributed under recognized OSI-compliant licenses (MIT, Apache 2.0, BSD, GPL, AGPL, MPL). Cloud services must provide a perpetually accessible developer tier rather than a temporary 14-day trial.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Invariant 02: Zero Deceptive Barriers</span>
            </div>
            <h3 className="type-card-title text-bone">No Mandatory Upfront Payment Details</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              Tools that require entering a credit card or debit card before revealing severe limits are rejected. Tools that permit local execution or account-free usage are explicitly tagged as <em>Free without Account</em>.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Invariant 03: Direct Canonical Links</span>
            </div>
            <h3 className="type-card-title text-bone">No Affiliate Redirects or URL Wrappers</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              Every outbound link points directly to the tool&apos;s official canonical website, official technical documentation, or public code repository. MARIA never uses affiliate tracking IDs, monetization redirects, or URL shorteners.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Invariant 04: Documented Quotas</span>
            </div>
            <h3 className="type-card-title text-bone">Transparent Limit Disclosures</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              For cloud services, exact monthly allotments are documented (e.g., Supabase: 500MB database, 50,000 monthly active users; Cloudflare Workers: 100,000 requests/day; Resend: 3,000 emails/month).
            </p>
          </div>
        </div>
      </section>

      {/* 3. Catalog Disciplines */}
      <section id="disciplines" className="pt-10 border-t border-line space-y-6 text-left scroll-mt-24">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <Layers className="w-4 h-4 shrink-0" />
          <span>Section 03</span>
        </div>
        <h2 className="type-section-title text-bone">Catalog Taxonomy &amp; Disciplines</h2>
        <p className="type-body text-ash-400 max-w-3xl">
          The index categorizes tools into six core disciplines, each optimized for cross-functional builders:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[
            {
              title: 'Developer Tools',
              icon: Code2,
              desc: 'Runtimes, edge frameworks, embedded databases, high-speed linters, authentication providers, and testing suites.',
              examples: 'Next.js, Bun, Supabase, SQLite, Biome, Vitest',
            },
            {
              title: 'Design & 3D WebGL',
              icon: Paintbrush,
              desc: 'Vector editors, 3D viewport canvas engines, Three.js toolkits, design token pipelines, and UI prototyping.',
              examples: 'Blender, Three.js, Penpot, Figma Free, GSAP',
            },
            {
              title: 'Video & Audio',
              icon: Film,
              desc: 'Non-linear video editors, WebAssembly transcoders, digital audio workstations, audio mastering, and Foley libraries.',
              examples: 'DaVinci Resolve, FFmpeg, Audacity, Shotcut',
            },
            {
              title: 'AI & Inference',
              icon: Bot,
              desc: 'Local model runtimes, quantized inference engines, ComfyUI visual workflows, speech synthesizers, and agent toolkits.',
              examples: 'Ollama, vLLM, ComfyUI, Whisper.cpp, Kokoro-TTS',
            },
            {
              title: 'Public REST APIs',
              icon: Terminal,
              desc: 'Free endpoints for meteorology, geospatial data, astronomy, economics, biology, literature, and developer mock services.',
              examples: 'Open-Meteo, Nominatim, OpenAQ, PubChem',
            },
            {
              title: 'Creative Assets',
              icon: Package,
              desc: 'CC0 3D meshes, procedural PBR texture maps, open-source type foundries, sound effect archives, and UI kits.',
              examples: 'AmbientCG, Fontshare, Poly Pizza, Freesound',
            },
          ].map((d) => (
            <div key={d.title} className="p-5 rounded-lg bg-surface border border-line space-y-2.5">
              <div className="flex items-center gap-2 text-bone font-medium text-sm">
                <d.icon className="w-4 h-4 text-reishi" />
                <span>{d.title}</span>
              </div>
              <p className="text-xs text-ash-400 leading-relaxed">{d.desc}</p>
              <div className="pt-1 text-[11px] font-mono text-ash-500">
                <span className="text-ash-400">Examples:</span> {d.examples}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Stack Builder & JSON Manifests */}
      <section id="stack-builder" className="pt-10 border-t border-line space-y-6 text-left scroll-mt-24">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <FileCode className="w-4 h-4 shrink-0" />
          <span>Section 04</span>
        </div>
        <h2 className="type-section-title text-bone">Stack Builder &amp; Manifest Standards</h2>
        <div className="space-y-4 text-sm text-ash-300 leading-relaxed max-w-3xl">
          <p>
            The <strong>My Stack</strong> workspace allows you to curate an architecture for a project, inspect the full dependency graph, and export a standardized, portable JSON manifest.
          </p>
          <p>
            Manifests are versioned and can be imported back into MARIA on any browser without needing an account:
          </p>
        </div>

        {/* JSON Schema Sample Block */}
        <div className="rounded-xl border border-line bg-ink overflow-hidden">
          <div className="bg-surface/80 px-4 py-2 border-b border-line flex items-center justify-between text-xs font-mono text-ash-400">
            <span>maria-stack-manifest.json</span>
            <span>Schema v1.0.0</span>
          </div>
          <pre className="p-4 text-xs font-mono text-ash-300 overflow-x-auto leading-relaxed">
{`{
  "$schema": "https://maria.dev/schemas/stack-manifest-v1.json",
  "version": "1.0.0",
  "exportedAt": "2026-10-31T14:57:30.000Z",
  "name": "Production Web & 3D Pipeline",
  "resourceCount": 3,
  "items": [
    {
      "id": "nextjs",
      "name": "Next.js",
      "category": "dev",
      "subcategory": "Frontend & Fullstack",
      "license": "MIT",
      "pricingType": "Open Source",
      "websiteUrl": "https://nextjs.org"
    },
    {
      "id": "three-js",
      "name": "Three.js",
      "category": "design",
      "subcategory": "3D & WebGL",
      "license": "MIT",
      "pricingType": "Open Source",
      "websiteUrl": "https://threejs.org"
    },
    {
      "id": "ollama",
      "name": "Ollama",
      "category": "ai",
      "subcategory": "Local LLMs",
      "license": "MIT",
      "pricingType": "Open Source",
      "websiteUrl": "https://ollama.ai"
    }
  ]
}`}
          </pre>
        </div>
      </section>

      {/* 5. Shortcuts & Navigation */}
      <section id="shortcuts" className="pt-10 border-t border-line space-y-6 text-left scroll-mt-24">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <Command className="w-4 h-4 shrink-0" />
          <span>Section 05</span>
        </div>
        <h2 className="type-section-title text-bone">Keyboard Shortcuts &amp; Power Navigation</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {[
            { key: '⌘ K  /  Ctrl K', label: 'Global Search Palette', desc: 'Instant search across all 2,500 curated tools from anywhere in the app.' },
            { key: 'Esc', label: 'Dismiss Modals & Drawers', desc: 'Closes active resource inspectors, the Stack Builder, and search.' },
            { key: 'Tab / Shift Tab', label: 'Focus Traversal', desc: 'Accessible tab loop within active dialogs and navigation menus.' },
            { key: 'Enter', label: 'Select / Inspect', desc: 'Opens the detailed factual modal for the selected resource.' },
            { key: 'Space', label: 'Bookmark / Save', desc: 'Toggles saving the resource to My Stack.' },
            { key: '↑ / ↓ Arrow Keys', label: 'Palette Navigation', desc: 'Step through search results or subcategory filters.' },
          ].map((item) => (
            <div key={item.key} className="p-4 rounded-lg bg-surface border border-line space-y-2">
              <kbd className="inline-block px-2 py-1 rounded bg-ink border border-line text-xs font-mono font-semibold text-reishi">
                {item.key}
              </kbd>
              <div className="text-xs font-semibold text-bone">{item.label}</div>
              <p className="text-[11px] text-ash-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Storage Architecture */}
      <section id="storage" className="pt-10 border-t border-line space-y-6 text-left scroll-mt-24">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <Database className="w-4 h-4 shrink-0" />
          <span>Section 06</span>
        </div>
        <h2 className="type-section-title text-bone">Browser Storage Architecture</h2>
        <p className="type-body text-ash-400 max-w-3xl">
          MARIA maintains an audited, strictly local storage policy. No telemetry, session recordings, or analytics scripts are ever executed:
        </p>

        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-xs text-bone">
            <thead className="bg-ink text-ash-400 font-mono text-[11px] border-b border-line">
              <tr>
                <th className="p-3.5">Storage Key</th>
                <th className="p-3.5">Data Type</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Lifespan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-sans">
              <tr>
                <td className="p-3.5 font-mono text-reishi whitespace-nowrap">{STORAGE_KEYS.SAVED_STACK}</td>
                <td className="p-3.5 font-mono text-ash-400">Array&lt;string&gt;</td>
                <td className="p-3.5 text-ash-300">Array of tool IDs currently saved in your My Stack drawer.</td>
                <td className="p-3.5 text-ash-400">Until cleared by user</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono text-reishi whitespace-nowrap">{STORAGE_KEYS.RECENTLY_VIEWED}</td>
                <td className="p-3.5 font-mono text-ash-400">Array&lt;string&gt;</td>
                <td className="p-3.5 text-ash-300">The last 15 tool IDs inspected in detail for fast backtracking.</td>
                <td className="p-3.5 text-ash-400">Until cleared by user</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono text-reishi whitespace-nowrap">{STORAGE_KEYS.CUSTOM_COLLECTIONS}</td>
                <td className="p-3.5 font-mono text-ash-400">Array&lt;CustomCollection&gt;</td>
                <td className="p-3.5 text-ash-300">Named custom project stacks with timestamps and assigned tool IDs.</td>
                <td className="p-3.5 text-ash-400">Until cleared by user</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono text-reishi whitespace-nowrap">{STORAGE_KEYS.EXTERNAL_LINK_PREF}</td>
                <td className="p-3.5 font-mono text-ash-400">boolean</td>
                <td className="p-3.5 text-ash-300">Whether outbound links open in a new tab (default: true).</td>
                <td className="p-3.5 text-ash-400">Until cleared by user</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono text-reishi whitespace-nowrap">{STORAGE_KEYS.USER_SUBMISSIONS}</td>
                <td className="p-3.5 font-mono text-ash-400">Array&lt;UserSubmission&gt;</td>
                <td className="p-3.5 text-ash-300">Locally saved drafts of user resource suggestions.</td>
                <td className="p-3.5 text-ash-400">Until cleared by user</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Submissions & Auditing */}
      <section id="contributing" className="pt-10 border-t border-line space-y-6 text-left scroll-mt-24">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Section 07</span>
        </div>
        <h2 className="type-section-title text-bone">Submitting Resources &amp; Suggesting Edits</h2>
        <div className="space-y-4 text-sm text-ash-300 leading-relaxed max-w-3xl">
          <p>
            We welcome community proposals for open-source projects, public APIs, and genuinely free developer tools. To submit a resource for audit:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-ash-400">
            <li>Ensure the tool meets all 4 curatorial invariants listed in Section 02.</li>
            <li>Click <strong>Suggest Resource</strong> in the workspace header or footer.</li>
            <li>Provide the official website URL, GitHub/GitLab repository (if open source), documentation link, and pricing structure.</li>
            <li>Submissions undergo human verification before inclusion in the catalog.</li>
          </ol>
        </div>

        {/* Action Link Box */}
        <div className="p-6 rounded-xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-bone">Have more questions?</h4>
            <p className="text-xs text-ash-400">Read our direct answers on data privacy, licensing, and workflow integration.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/faq"
              className="type-btn px-4 py-2 rounded bg-surface hover:bg-ink text-bone border border-line hover:border-reishi/50 text-xs font-mono transition-colors"
            >
              Read the FAQ
            </Link>
            <Link
              href="/discover"
              className="type-btn px-4 py-2 rounded bg-bone text-ink hover:bg-[#e8e8e1] text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
