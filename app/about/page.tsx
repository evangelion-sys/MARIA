import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BrandLogoShowcase } from '@/components/BrandLogoShowcase';
import { CATALOG_TOTAL_COUNT } from '@/data/resource-stats';
import {
  Compass,
  Layers,
  Sparkles,
  ShieldCheck,
  Code2,
  Paintbrush,
  Film,
  Bot,
  Terminal,
  Package,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Clock,
  Check,
  Github,
  Instagram,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About the Archive — MARIA',
  description:
    'An independent curatorial directory of 2,500 digital creation resources across development, design, 3D, video, and AI.',
  openGraph: {
    title: 'About the Archive — MARIA',
    description:
      'An independent curatorial directory of 2,500 digital creation resources across development, design, 3D, video, and AI.',
  },
  twitter: {
    card: 'summary',
    title: 'About the Archive — MARIA',
    description:
      'An independent curatorial directory of 2,500 digital creation resources across development, design, 3D, video, and AI.',
  },
};

export default function AboutPage() {
  const principles = [
    {
      number: '01',
      title: 'Practical Utility Over Marketing Hype',
      description:
        'We evaluate every tool on actual developer workflows, quality of documentation, and technical stability rather than venture-backed promotional claims.',
    },
    {
      number: '02',
      title: 'Strict Invariant Integrity',
      description:
        'Every listed tool must meet clear requirements: an OSI-approved open-source license, a genuine perpetual free tier, or zero-cost public access without upfront credit card demands.',
    },
    {
      number: '03',
      title: 'Transparent Licensing & Access Terms',
      description:
        'We clearly distinguish true open-source software (MIT, Apache 2.0, BSD, GPL) from proprietary cloud free tiers and self-hostable options. No trial traps or deceptive subscription funnels.',
    },
    {
      number: '04',
      title: 'Cross-Disciplinary Discovery',
      description:
        'Modern creators frequently work across full-stack engineering, 3D WebGL, generative AI, motion graphics, and audio mastering. MARIA bridges these disciplines under one cohesive catalog.',
    },
    {
      number: '05',
      title: 'Direct Canonical Links',
      description:
        'We link directly to official project sites, canonical documentation, and source code repositories. MARIA never uses affiliate links, intermediate redirect wrappers, or tracking bridges.',
    },
    {
      number: '06',
      title: 'Factual Descriptions & Verified Quotas',
      description:
        'No manufactured star ratings, fake review scores, or exaggerated adjectives. We describe what each tool actually does, its known tier limits, and how to access it.',
    },
    {
      number: '07',
      title: 'Calm, Sovereign Workspace',
      description:
        'Fast, distraction-free discovery with zero advertising cookies, no persistent cloud tracking, and all personal stack data stored client-side in your own browser.',
    },
  ];

  const disciplines = [
    {
      name: 'Developer Tools',
      desc: 'Edge frameworks, serverless runtimes, embedded databases, high-speed linters, and full-stack web platforms.',
      icon: Code2,
    },
    {
      name: 'Design & 3D WebGL',
      desc: 'Vector design suites, Blender pipelines, design token tools, Three.js extensions, and procedural shaders.',
      icon: Paintbrush,
    },
    {
      name: 'Video & Audio',
      desc: 'Non-linear video editors, WebAssembly transcoders, digital audio workstations, and Foley sound libraries.',
      icon: Film,
    },
    {
      name: 'AI & Inference',
      desc: 'Local model runtimes (Ollama, vLLM), model serving engines, offline desktop interfaces, and ComfyUI pipelines.',
      icon: Bot,
    },
    {
      name: 'Public REST APIs',
      desc: 'Verified public endpoints for weather, geoscience, open data, literature, and economics with zero paywalls.',
      icon: Terminal,
    },
    {
      name: 'Creative Assets',
      desc: 'CC0 3D models, PBR textures, open-source type foundries, and royalty-free UI pattern systems.',
      icon: Package,
    },
  ];

  const acronymProposals = [
    {
      name: 'Modern Archive of Resources, Interfaces & Assets',
      isRecommended: true,
      tag: 'Recommended Proposal',
      rationale:
        'Accurately captures the full scope of what builders discover here: modern tooling, curated software resources, user-interface systems, and creative digital assets. Every word corresponds directly to a live catalog category.',
    },
    {
      name: 'Modular Architecture & Resource Index Archive',
      isRecommended: false,
      tag: 'Alternative Proposal',
      rationale:
        'Focuses on the engineering and architectural foundation of the directory, highlighting how developers piece together modular components into robust software stacks.',
    },
    {
      name: 'Makers’ Archive of Resources, Intelligence & Applications',
      isRecommended: false,
      tag: 'Alternative Proposal',
      rationale:
        'Emphasizes the diverse community of independent creators (makers), local AI intelligence engines, and production-ready applications indexed throughout the site.',
    },
    {
      name: 'Multidisciplinary Archive for Research, Innovation & Art',
      isRecommended: false,
      tag: 'Alternative Proposal',
      rationale:
        'Celebrates the intersection of technical programming, experimental research, and visual creative art that defines modern digital craftsmanship.',
    },
  ];

  const roadmapPhases = [
    {
      phase: 'Current Reality',
      title: 'Operational Catalog & Workspace',
      status: 'Live Today',
      statusColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      description: 'Fully functioning, verified index and client-side discovery workspace.',
      items: [
        `Curated catalog of ${CATALOG_TOTAL_COUNT.toLocaleString()} tools across 6 core disciplines`,
        'Granular category, subcategory, and license-type filtering (Open Source, Free Tier, Free without Account, Self-Hosted)',
        'Inspector modals with verified documentation links, tier quotas, and API key specifications',
        'Browser-local Stack Builder with instant JSON manifest export and import',
        'Custom user collections, search palette, and responsive mobile-first navigation',
        'Zero tracking cookies, zero remote user profiles, and one-click local storage purge controls',
      ],
    },
    {
      phase: 'Near-Term Aspiration',
      title: 'Resource Health Intelligence',
      status: 'Planned',
      statusColor: 'bg-reishi/15 text-reishi border-reishi/30',
      description: 'Aspirational capabilities under design to keep the catalog fresh and dependable.',
      items: [
        'Automated background link-health verification to catch upstream broken links or migrations early',
        'Upstream pricing changes and free-tier policy monitoring with community notification badges',
        'Transparent open-source maintenance signals (recent release cadence, active commit history)',
        'Public revision changelog detailing when each tool was last re-verified',
      ],
    },
    {
      phase: 'Future Exploration',
      title: 'Relational Tool Pairing & Ecosystem Guides',
      status: 'Under Evaluation',
      statusColor: 'bg-white/[0.04] text-ash-400 border-white/10',
      description: 'Long-term explorations for deeper architectural utility.',
      items: [
        'Contextual tool recommendations (e.g., pairing a static site generator with embedded SQLite and transactional email)',
        'Architectural workflow walk-throughs demonstrating real-world integration between indexed tools',
        'Peer-reviewed community proposal pipeline for submitting and reviewing new resources',
        'Optional public dataset export under permissive open-data licenses for researchers and educators',
      ],
    },
  ];

  return (
    <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-16 space-y-20 bg-transparent text-bone">
      {/* 1. Page Hero: What is MARIA? */}
      <section id="about" className="space-y-5 text-left scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-reishi/10 border border-reishi/25 text-reishi text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent Digital Resource Archive</span>
        </div>

        <h1 className="type-page-title text-bone text-balance">
          A dependable, quiet index for digital creators.
        </h1>

        <p className="type-body-lg text-ash-300 leading-relaxed max-w-3xl">
          MARIA is a curated directory of {CATALOG_TOTAL_COUNT.toLocaleString()} digital creation tools, open-source software libraries, zero-paywall APIs, and design foundations. It exists to help software engineers, UI/UX designers, 3D artists, video editors, and AI builders discover useful tools without wading through sponsored listicles, affiliate wrappers, or deceptive trial traps.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-ash-400">
          <span className="text-reishi font-semibold tabular-nums">{CATALOG_TOTAL_COUNT.toLocaleString()}</span>
          <span>Resources Listed</span>
          <span className="text-line">·</span>
          <span>6 Creative Disciplines</span>
          <span className="text-line">·</span>
          <span>Zero Tracking Cookies</span>
          <span className="text-line">·</span>
          <span>Index Rev 2026.10</span>
        </div>
      </section>

      {/* 2. Practical Purpose & Goal */}
      <section id="purpose" className="pt-10 border-t border-line space-y-8 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Purpose &amp; Practical Goal</span>
          <h2 className="type-section-title text-bone">Why MARIA Exists</h2>
          <p className="type-body text-ash-400">
            Finding high-quality, practical tools has become surprisingly frustrating. Here is the problem we set out to resolve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>The Practical Problem</span>
            </div>
            <h3 className="type-card-title text-bone">Fragmentation and Sponsored Noise</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              When searching for a tool, builders routinely encounter dozens of affiliate-driven blog posts, outdated GitHub lists, or "free" cloud services that demand a credit card before revealing severe usage limits. The time spent sorting through hype distracts from actual creative engineering.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
              <Compass className="w-4 h-4 shrink-0" />
              <span>The Practical Goal</span>
            </div>
            <h3 className="type-card-title text-bone">Calm, Factual Discovery</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              MARIA replaces promotional fluff with verified factual summaries. We test links, check whether sign-up is required, confirm licensing terms, and document real free tier quotas so you know exactly what is included before adopting a tool.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Platform Vision: Reality vs Aspiration */}
      <section id="vision" className="pt-10 border-t border-line space-y-8 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Vision &amp; Ambition</span>
          <h2 className="type-section-title text-bone">Where MARIA is Headed</h2>
          <p className="type-body text-ash-400">
            We believe in complete transparency about what the platform does today and what remains an aspiration for tomorrow.
          </p>
        </div>

        <div className="p-7 rounded-xl bg-surface border border-line space-y-6">
          <div className="space-y-3">
            <h3 className="type-card-title text-bone text-base sm:text-lg">The Long-Term Idea</h3>
            <p className="type-body text-ash-300 leading-relaxed">
              We envision MARIA as a lasting, sovereign reference for modern software builders—a place where you can quickly find not just single tools, but understand how different tools fit together into clean, sustainable architectures. We are building this incrementally, without outside investor pressures or commercial ad networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-line text-sm">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
                ✓ Implemented Today
              </span>
              <p className="text-xs text-ash-400 leading-relaxed">
                Full searchable catalog of {CATALOG_TOTAL_COUNT.toLocaleString()} tools, modal inspector with direct official links, browser-local Stack Builder, JSON manifest export/import, category filtering, and zero-cookie privacy architecture.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-reishi font-semibold block">
                ○ Future Aspirations (Under Evaluation)
              </span>
              <p className="text-xs text-ash-400 leading-relaxed">
                Automated link verification, community proposal review workflows, upstream pricing alerts, and contextual tool pairing graphs to explain why specific tools complement each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why MARIA? */}
      <section id="why" className="pt-10 border-t border-line space-y-8 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Platform Value</span>
          <h2 className="type-section-title text-bone">Why Choose MARIA?</h2>
          <p className="type-body text-ash-400">
            Five concrete product characteristics that make MARIA a dependable companion in your daily workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-line space-y-2.5">
            <div className="w-8 h-8 rounded bg-reishi/10 border border-reishi/25 flex items-center justify-center text-reishi mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="type-card-title text-bone text-base">Verified Invariants</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              Every tool is inspected for genuine accessibility: an OSI-approved open-source license, an un-metered public tier, or a clear free quota without upfront credit card requirements.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-line space-y-2.5">
            <div className="w-8 h-8 rounded bg-reishi/10 border border-reishi/25 flex items-center justify-center text-reishi mb-1">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="type-card-title text-bone text-base">Multi-Discipline Breadth</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              Modern digital projects rarely stay in one lane. MARIA unifies web development, 3D graphics, local AI inference, video transcoders, and free APIs into one clean ontology.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-line space-y-2.5">
            <div className="w-8 h-8 rounded bg-reishi/10 border border-reishi/25 flex items-center justify-center text-reishi mb-1">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="type-card-title text-bone text-base">Client-Side Sovereignty</h3>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              No login prompts, no email gates, no analytics tracking. Your saved stacks and custom collections live strictly in your browser&apos;s localStorage and can be exported as JSON anytime.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Brand Identity & The MARIA Acronym (PART 3) */}
      <section id="acronym" className="pt-10 border-t border-line space-y-8 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Brand Identity &amp; Name Exploration</span>
          <h2 className="type-section-title text-bone">The Meaning of MARIA</h2>
          <p className="type-body text-ash-400">
            MARIA was born as a standalone name representing clarity, sovereignty, and curatorial care. Because many creators naturally inquire if MARIA is an acronym, we have developed four thoughtful proposals that align directly with our mission.
          </p>
        </div>

        {/* Acronym Proposals Table / Cards */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface/70 border border-line/70 text-xs text-ash-300 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-reishi shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-bone">Proposal Notice:</strong> None of these expansions are currently declared official. They are community proposals presented for consideration and community feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {acronymProposals.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all ${
                  item.isRecommended
                    ? 'bg-surface border-reishi/40 shadow-sm'
                    : 'bg-surface/50 border-line'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-reishi font-mono text-xs font-bold">
                      {idx + 1}.
                    </span>
                    <h3 className="type-card-title text-bone text-base">
                      {item.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded self-start sm:self-auto ${
                      item.isRecommended
                        ? 'bg-reishi/20 text-reishi font-semibold border border-reishi/40'
                        : 'bg-white/[0.04] text-ash-400 border border-line'
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="type-body-sm text-ash-400 leading-relaxed mt-1">
                  {item.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Insignia & Vector Mark Details */}
        <BrandLogoShowcase />
      </section>

      {/* 6. Guiding Principles */}
      <section id="principles" className="pt-10 border-t border-line space-y-8 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Editorial Standards</span>
          <h2 className="type-section-title text-bone">Guiding Principles</h2>
          <p className="type-body text-ash-400">
            Every entry in the directory is held to these standards to maintain builder trust.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {principles.map((p) => (
            <div key={p.number} className="p-6 rounded-xl bg-surface border border-line space-y-2">
              <span className="text-reishi font-mono text-xs font-bold">{p.number}.</span>
              <h3 className="type-card-title text-bone text-base">{p.title}</h3>
              <p className="type-body-sm text-ash-400 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Covered Disciplines */}
      <section id="disciplines" className="pt-10 border-t border-line space-y-8 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Catalog Scope</span>
          <h2 className="type-section-title text-bone">What MARIA Indexes</h2>
          <p className="type-body text-ash-400">
            Six distinct fields covering modern engineering, visual design, and creative media.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {disciplines.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.name} className="p-5 rounded-xl bg-surface border border-line space-y-2">
                <div className="flex items-center gap-2.5 text-reishi">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-sm text-bone">{d.name}</span>
                </div>
                <p className="type-body-sm text-ash-400 leading-relaxed">{d.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Roadmap & Phased Capabilities */}
      <section id="roadmap" className="pt-10 border-t border-line space-y-8 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Transparent Roadmap</span>
          <h2 className="type-section-title text-bone">Capabilities &amp; Timeline</h2>
          <p className="type-body text-ash-400">
            We clearly separate our operational software from future development goals.
          </p>
        </div>

        <div className="space-y-6">
          {roadmapPhases.map((phase) => (
            <div key={phase.phase} className="p-6 sm:p-7 rounded-xl bg-surface border border-line space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-reishi uppercase tracking-wider">
                    {phase.phase}
                  </span>
                  <span className="text-line">·</span>
                  <h3 className="type-card-title text-bone text-base sm:text-lg">
                    {phase.title}
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-mono font-semibold border ${phase.statusColor} self-start sm:self-auto`}
                >
                  {phase.status}
                </span>
              </div>

              <p className="type-body-sm text-ash-400">
                {phase.description}
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                {phase.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 type-body-sm text-ash-400">
                    <Check className="w-3.5 h-3.5 text-reishi shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Authorship & Curatorial Leadership */}
      <section id="curator" className="pt-10 border-t border-line space-y-6 text-left scroll-mt-20">
        <div className="space-y-2 max-w-2xl">
          <span className="type-eyebrow text-reishi">Curation &amp; Authorship</span>
          <h2 className="type-section-title text-bone">Engineered for Sovereign Builders</h2>
          <p className="type-body text-ash-400">
            MARIA is an independently researched and curated registry, operating without venture capital, sponsored rankings, or marketing telemetry.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-surface border border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-semibold text-bone text-base sm:text-lg">evangelion-sys</span>
              <span className="text-line">·</span>
              <span className="text-xs font-mono text-reishi uppercase tracking-wider">Independent Curator &amp; Architect</span>
            </div>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              Researched, audited, and maintained for creators, indie hackers, and engineers. Every resource in the catalog is indexed against direct repository health, licensing authenticity, and practical utility.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://github.com/evangelion-sys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-ink hover:bg-surface text-bone border border-line hover:border-reishi/50 text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
              aria-label="GitHub profile of evangelion-sys (opens in new tab)"
            >
              <Github className="w-4 h-4 text-reishi shrink-0" />
              <span>@evangelion-sys</span>
              <ExternalLink className="w-3 h-3 text-ash-600 shrink-0" />
            </a>

            <a
              href="https://www.instagram.com/kernel.bat?srtk=MWYxNXl4anBkeG5ucA=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-ink hover:bg-surface text-bone border border-line hover:border-reishi/50 text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-reishi"
              aria-label="Instagram profile of kernel.bat (opens in new tab)"
            >
              <Instagram className="w-4 h-4 text-reishi shrink-0" />
              <span>@kernel.bat</span>
              <ExternalLink className="w-3 h-3 text-ash-600 shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* 10. Next Steps / Outbound CTA */}
      <section className="pt-10 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-xl bg-surface border border-line">
        <div className="space-y-1 text-left">
          <h3 className="type-card-title text-bone text-base sm:text-lg">Ready to start discovering?</h3>
          <p className="type-body-sm text-ash-400 max-w-xl">
            Explore {CATALOG_TOTAL_COUNT.toLocaleString()} listed tools, inspect tier allowances, or build and export your personalized tool stack.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/faq"
            className="type-btn px-4 py-2.5 rounded-[4px] bg-surface hover:bg-ink text-bone transition-colors border border-line focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none text-xs font-medium"
          >
            Read FAQ
          </Link>
          <Link
            href="/discover"
            className="type-btn px-5 py-2.5 rounded-[4px] bg-bone hover:bg-[#e8e8e1] text-ink transition-colors inline-flex items-center gap-2 shadow-sm focus-visible:ring-1 focus-visible:ring-reishi focus-visible:outline-none text-xs font-semibold"
          >
            <Compass className="w-4 h-4 text-ink" />
            <span>Open Discovery</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
