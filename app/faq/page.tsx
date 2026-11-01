import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaqAccordion, FaqItem } from '@/components/FaqAccordion';
import { Compass, ShieldCheck, BookOpen, Layers } from 'lucide-react';
import { CATALOG_TOTAL_COUNT } from '@/data/resource-stats';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — MARIA',
  description:
    'Clear answers about how MARIA works, directory standards, open-source distinctions, free tier quotas, external links, and data privacy.',
  openGraph: {
    title: 'Frequently Asked Questions — MARIA',
    description:
      'Clear answers about how MARIA works, directory standards, open-source distinctions, free tier quotas, external links, and data privacy.',
  },
  twitter: {
    card: 'summary',
    title: 'Frequently Asked Questions — MARIA',
    description:
      'Clear answers about how MARIA works, directory standards, open-source distinctions, free tier quotas, external links, and data privacy.',
  },
};

const FAQ_DATA: FaqItem[] = [
  {
    id: 'what-is-maria',
    category: 'General',
    question: 'What is MARIA?',
    answer:
      `MARIA is a curated directory and developer workspace indexing ${CATALOG_TOTAL_COUNT.toLocaleString()} digital creation tools, open-source libraries, free APIs, and design foundations. It helps engineers, designers, 3D artists, video creators, and AI practitioners discover practical tools with direct canonical links and documented access models.`,
  },
  {
    id: 'who-is-maria-for',
    category: 'General',
    question: 'Who is MARIA designed for?',
    answer:
      'MARIA is built for independent software engineers, UI/UX designers, 3D artists, motion editors, AI builders, and students looking for high-quality, practical tools. Whether you are bootstrapping a new web app, setting up a local AI pipeline, or looking for royalty-free creative assets, MARIA provides verified options without promotional noise.',
  },
  {
    id: 'what-can-i-discover',
    category: 'General',
    question: 'What types of resources can I discover?',
    answer:
      'The directory spans six core disciplines: Developer Tools (edge frameworks, databases, linters), Design & 3D (vector editors, Three.js shaders, Blender pipelines), Video & Audio (video editors, WebAssembly transcoders, audio tools), AI & Inference (local LLM runtimes, model serving engines, ComfyUI workflows), Public REST APIs (free endpoints for weather, geoscience, open data), and Creative Assets (CC0 3D models, textures, and open-source type foundries).',
  },
  {
    id: 'how-are-resources-organized',
    category: 'Workflows',
    question: 'How are resources organized and filtered?',
    answer:
      'Resources are organized by discipline (such as Developer Tools or Design & 3D), subcategory (like Database & BaaS, Local LLM, or Vector & UI), tech stack tags, and access models (Open Source, Free Tier, Free without Account, and Self-Hosted). You can filter across any combination using the workspace sidebar.',
  },
  {
    id: 'how-does-it-differ-from-awesome-lists',
    category: 'General',
    question: 'How does MARIA differ from a GitHub Awesome list?',
    answer:
      'Static Markdown lists on GitHub easily suffer from bit rot, broken links, and outdated free-tier claims. MARIA provides an active, structured application with indexed tier limits, license specifications, interactive detail modals, browser-local stack bookmarking, JSON manifest exports, and global instant search.',
  },
  {
    id: 'does-maria-host-tools',
    category: 'General',
    question: 'Does MARIA host the tools directly or link to external sites?',
    answer:
      'MARIA is strictly an independent curatorial index. We do not host, mirror, or vend third-party software packages or cloud infrastructure. Every card and modal provides direct outbound links to the tool\'s official canonical site, official documentation, and upstream source code repository.',
  },
  {
    id: 'how-do-external-links-work',
    category: 'Workflows',
    question: 'Do external links open in a new tab or the same window?',
    answer:
      'By default, external links open directly in a new tab so you do not lose your spot in the directory. You can adjust this preference anytime in your workspace settings. Importantly, MARIA never uses affiliate redirect links, URL shorteners, or commercial intermediate pages—your connection to the tool is direct.',
  },
  {
    id: 'is-maria-free',
    category: 'Licensing & Pricing',
    question: 'Is MARIA free to use?',
    answer:
      `Yes, completely free. All features on MARIA—including browsing all ${CATALOG_TOTAL_COUNT.toLocaleString()} resources, global search, filtering, the modal inspector, the browser-local Stack Builder, and JSON manifest export—are 100% free with no paywalls or gated features.`,
  },
  {
    id: 'are-all-resources-free',
    category: 'Licensing & Pricing',
    question: 'Are all listed resources completely free forever?',
    answer:
      'Every tool indexed in MARIA has either an OSI-approved open-source license, an unmetered public tier, or a documented free tier. Open-source tools (like Blender, Ollama, and Bun) have no usage caps, while cloud services (like Supabase and Resend) offer free quotas. We clearly display these tier allowances on every card so there are no surprises.',
  },
  {
    id: 'what-happens-when-tiers-change',
    category: 'Licensing & Pricing',
    question: 'What happens if a tool changes or removes its free tier?',
    answer:
      'Upstream services evolve and modify pricing models over time. MARIA conducts periodic manual audits of catalog entries. Entries that have not yet undergone re-audit are clearly marked as Catalog Entry (Unverified). If you discover that a service has updated terms, deprecated a free quota, or changed licensing, you can use the Suggestion Workspace to draft and export updated resource details.',
  },
  {
    id: 'what-does-open-source-mean',
    category: 'Licensing & Pricing',
    question: 'What does "Open Source" mean in MARIA?',
    answer:
      'In MARIA, the Open Source label is strictly reserved for software licensed under recognized OSI-compliant licenses (such as MIT, Apache 2.0, BSD, or AGPL) where the complete source code is publicly accessible and auditable. We never label proprietary cloud services as open source, even if they offer a free tier.',
  },
  {
    id: 'do-i-need-an-account',
    category: 'General',
    question: 'Do I need an account to use MARIA or save my stack?',
    answer:
      'No. MARIA requires zero account registration, zero email submissions, and zero passwords. Personalization features—such as saving tools to "My Stack", recent inspection history, and custom collections—work strictly inside your browser\'s local storage. No user accounts exist on our servers.',
  },
  {
    id: 'can-i-use-maria-offline',
    category: 'Workflows',
    question: 'Can I browse MARIA or use the Stack Builder offline?',
    answer:
      `Yes. Once the page is loaded in your browser, the entire catalog of ${CATALOG_TOTAL_COUNT.toLocaleString()} resources is available client-side. You can search, filter, assemble stacks, and export JSON manifests even without an active internet connection. Only outbound links to external documentation and official sites require connectivity.`,
  },
  {
    id: 'how-stack-builder-works',
    category: 'Workflows',
    question: 'How does the Stack Builder work, and can I export my setup?',
    answer:
      'As you explore, click the bookmark icon on any tool card to add it to your active stack. You can open the Stack Builder drawer from the top bar or sidebar to inspect your chosen stack, organize tools into named collections, and export your entire setup as a clean JSON manifest to share with teammates or keep for future projects.',
  },
  {
    id: 'how-to-import-stack',
    category: 'Workflows',
    question: 'Can I import an existing stack manifest from another device or teammate?',
    answer:
      'Yes. Inside the Stack Builder drawer, click "Import Manifest" and select any valid MARIA JSON manifest file. The application validates the schema, resolves the tool IDs against our verified catalog, and merges them into your local workspace.',
  },
  {
    id: 'how-to-suggest-or-report',
    category: 'Verification & Standards',
    question: 'How can I suggest a new resource or report an outdated link?',
    answer:
      'You can draft a resource suggestion anytime using the "Suggest a Resource" button found in the navigation menu, sidebar, or footer. A structured modal allows you to specify the tool name, canonical link, discipline, and license, saving drafts locally to your browser and allowing direct JSON export.',
  },
  {
    id: 'what-data-is-collected',
    category: 'Verification & Standards',
    question: 'What information does MARIA collect about me?',
    answer:
      'MARIA sets zero tracking cookies, loads no third-party analytics scripts, and does not record personal user profiles or search histories. Note that fonts are loaded from Google Fonts and Fontshare CDNs, and visiting external resources opens their respective third-party sites. All local workspace data (saved stacks, collections, link preferences, submission drafts) is stored client-side in localStorage and can be purged at any time.',
  },
];

export default function FaqPage() {
  return (
    <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-16 space-y-12 bg-transparent text-bone">
      {/* Page Header */}
      <div className="space-y-4 text-left">
        <span className="type-eyebrow text-reishi">Help &amp; Answers</span>
        <h1 className="type-page-title text-bone">
          Frequently asked questions.
        </h1>
        <p className="type-body-lg text-ash-300 leading-relaxed max-w-2xl">
          Straightforward answers about our catalog standards, open-source distinctions, free tier quotas, external links, and privacy practices.
        </p>
      </div>

      {/* Interactive Search & Accordion */}
      <FaqAccordion items={FAQ_DATA} />

      {/* Directory Standards Commitment Card */}
      <div className="p-6 rounded-xl bg-surface border border-line space-y-3 text-left">
        <div className="flex items-center gap-2 text-reishi text-sm font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Our Invariant Policy</span>
        </div>
        <p className="type-body-sm text-ash-400 leading-relaxed">
          MARIA maintains a strict policy against trial traps and deceptive billing funnels. If an upstream service deprecates its perpetual free tier or begins requiring mandatory credit cards upfront, we re-audit and update or remove the listing to preserve directory integrity.
        </p>
      </div>

      {/* Quick Links to Docs and Discover */}
      <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-surface border border-line">
        <div>
          <h3 className="type-card-title text-bone">Need in-depth architectural details?</h3>
          <p className="type-body-sm text-ash-400 mt-1">
            Read our platform documentation for JSON schemas, storage keys, and review standards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="type-btn px-4 py-2.5 rounded-[4px] bg-surface hover:bg-ink text-bone border border-line transition-colors shrink-0 flex items-center gap-2 text-xs font-medium"
          >
            <BookOpen className="w-4 h-4 text-reishi" />
            <span>Read Docs</span>
          </Link>
          <Link
            href="/discover"
            className="type-btn px-4 py-2.5 rounded-[4px] bg-bone hover:bg-[#e8e8e1] text-ink transition-colors shrink-0 flex items-center gap-2 text-xs font-semibold"
          >
            <Compass className="w-4 h-4 text-ink" />
            <span>Open Discovery</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
