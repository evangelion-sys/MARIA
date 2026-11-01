import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { PrivacyClearButton } from '@/components/PrivacyClearButton';
import {
  ShieldCheck,
  Database,
  Lock,
  ExternalLink,
  Compass,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy & Data Policy — MARIA',
  description:
    'A plain-English explanation of how MARIA handles data: zero tracking cookies, browser-local storage only, and complete user sovereignty.',
  openGraph: {
    title: 'Privacy & Data Policy — MARIA',
    description:
      'A plain-English explanation of how MARIA handles data: zero tracking cookies, browser-local storage only, and complete user sovereignty.',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy & Data Policy — MARIA',
    description:
      'A plain-English explanation of how MARIA handles data: zero tracking cookies, browser-local storage only, and complete user sovereignty.',
  },
};

export default function PrivacyPage() {
  return (
    <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-16 space-y-16 bg-transparent text-bone">
      {/* Page Header */}
      <div className="space-y-4 text-left">
        <span className="type-eyebrow text-reishi">Privacy &amp; Data Sovereignty</span>
        <h1 className="type-page-title text-bone">
          A simple, honest privacy policy.
        </h1>
        <p className="type-body-lg text-ash-300 leading-relaxed max-w-3xl">
          MARIA was built to be a calm, quiet reference tool. We don&apos;t track you across the web, we don&apos;t set advertising cookies, and we don&apos;t store your personal information on remote servers. Here is exactly what data is used and how you control it.
        </p>
        <div className="text-xs font-mono text-ash-500 pt-1">
          Effective: October 2026 · Index Revision 2026.10
        </div>
      </div>

      {/* Quick Summary Card */}
      <section className="p-6 sm:p-7 rounded-xl bg-surface border border-line space-y-4 text-left">
        <div className="flex items-center gap-2.5 text-reishi text-sm font-semibold">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>The Three Core Commitments</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="space-y-1.5">
            <span className="text-bone font-medium text-sm">1. Zero Tracking Cookies</span>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              We do not use advertising cookies, Google Analytics, tracking pixels, or third-party session replay scripts.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-bone font-medium text-sm">2. Browser-Local Storage</span>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              Your saved tool stack and custom collections stay right inside your browser. They are never sent to a database.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-bone font-medium text-sm">3. Instant One-Click Purge</span>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              You can wipe every saved item from your browser at any time using the control below or your browser settings.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Detailed Storage Key Disclosures */}
      <section id="storage" className="space-y-6 pt-6 border-t border-line text-left scroll-mt-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-bone text-lg font-semibold">
            <Database className="w-5 h-5 text-reishi" />
            <h2 className="type-section-title text-bone">1. What Data is Stored in Your Browser</h2>
          </div>
          <p className="type-body text-ash-400">
            To provide features like saving your favorite tools or keeping track of what you recently viewed, MARIA uses your browser&apos;s built-in <code className="text-reishi bg-surface border border-line px-1.5 py-0.5 rounded font-mono text-xs">localStorage</code>. This data never leaves your device. For developer schema details, view the <Link href="/docs#storage" className="text-reishi hover:underline font-medium">Technical Storage Documentation</Link>.
          </p>
        </div>

        {/* Storage Key Specifications Table */}
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-xs text-bone">
            <thead className="bg-ink text-ash-400 font-mono text-[11px] border-b border-line">
              <tr>
                <th className="p-3.5 font-medium">Storage Key</th>
                <th className="p-3.5 font-medium">What It Contains</th>
                <th className="p-3.5 font-medium">Why We Use It</th>
                <th className="p-3.5 font-medium">Sent to Server?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-sans">
              <tr>
                <td className="p-3.5 font-mono font-medium text-reishi whitespace-nowrap">
                  {STORAGE_KEYS.SAVED_STACK}
                </td>
                <td className="p-3.5 text-ash-300">
                  A simple list of resource IDs you have bookmarked (e.g., <code className="font-mono text-ash-400 text-[11px]">[&quot;nextjs&quot;, &quot;supabase&quot;]</code>).
                </td>
                <td className="p-3.5 text-ash-400">
                  Preserves your &ldquo;My Stack&rdquo; collection between visits so you don&apos;t have to re-select tools.
                </td>
                <td className="p-3.5 text-emerald-400 font-mono font-medium whitespace-nowrap">
                  Never
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-medium text-reishi whitespace-nowrap">
                  {STORAGE_KEYS.RECENTLY_VIEWED}
                </td>
                <td className="p-3.5 text-ash-300">
                  Up to 15 tool IDs you recently inspected in the detail modal.
                </td>
                <td className="p-3.5 text-ash-400">
                  Powers the &ldquo;Recent&rdquo; list in the workspace drawer for fast backtracking.
                </td>
                <td className="p-3.5 text-emerald-400 font-mono font-medium whitespace-nowrap">
                  Never
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-medium text-reishi whitespace-nowrap">
                  {STORAGE_KEYS.CUSTOM_COLLECTIONS}
                </td>
                <td className="p-3.5 text-ash-300">
                  Custom collections you create, including their name, creation timestamp, and assigned tool IDs.
                </td>
                <td className="p-3.5 text-ash-400">
                  Allows you to organize tools for separate projects (such as &ldquo;3D Web App&rdquo; or &ldquo;Static Blog&rdquo;).
                </td>
                <td className="p-3.5 text-emerald-400 font-mono font-medium whitespace-nowrap">
                  Never
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-medium text-reishi whitespace-nowrap">
                  {STORAGE_KEYS.USER_SUBMISSIONS}
                </td>
                <td className="p-3.5 text-ash-300">
                  Resource suggestions you have typed into the &ldquo;Suggest a Resource&rdquo; modal.
                </td>
                <td className="p-3.5 text-ash-400">
                  Retains your pending suggestions on your machine until you choose to copy or export them.
                </td>
                <td className="p-3.5 text-emerald-400 font-mono font-medium whitespace-nowrap">
                  Never
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-medium text-reishi whitespace-nowrap">
                  {STORAGE_KEYS.EXTERNAL_LINK_PREF}
                </td>
                <td className="p-3.5 text-ash-300">
                  A preference string: either &ldquo;new&rdquo; (open in new tab) or &ldquo;same&rdquo; (same window).
                </td>
                <td className="p-3.5 text-ash-400">
                  Remembers your outbound link browsing preference.
                </td>
                <td className="p-3.5 text-emerald-400 font-mono font-medium whitespace-nowrap">
                  Never
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Interactive Clear Control */}
        <div className="pt-2">
          <PrivacyClearButton />
        </div>
      </section>

      {/* Section 2: Cookies and Analytics */}
      <section className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone text-lg font-semibold">
          <Lock className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">2. Cookies, Tracking &amp; Analytics</h2>
        </div>
        <p className="type-body text-ash-400">
          MARIA does not use cookies for authentication, user tracking, or behavioral profiling:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-xl bg-surface border border-line space-y-2">
            <span className="font-semibold text-bone text-sm block">HTTP Cookies: None</span>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              We set no advertising cookies, no persistent session cookies, and no cross-site identification tokens. Your visits are completely anonymous.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-surface border border-line space-y-2">
            <span className="font-semibold text-bone text-sm block">Analytics Trackers: None</span>
            <p className="type-body-sm text-ash-400 leading-relaxed">
              We do not run Google Analytics, Meta Pixel, Hotjar, or similar telemetry software. We do not monitor mouse movements, keystrokes, or page view trails.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Third-Party Fonts & Outbound Links */}
      <section className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone text-lg font-semibold">
          <ExternalLink className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">3. Third-Party Services &amp; Outbound Links</h2>
        </div>
        <div className="space-y-3">
          <p className="type-body text-ash-400">
            MARIA connects to third parties in only two transparent ways:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-ash-400">
            <li className="flex items-start gap-2">
              <span className="text-reishi font-mono select-none mt-0.5">•</span>
              <span>
                <strong className="text-bone">Typography Delivery (Fontshare &amp; Google Fonts):</strong> We load typography via Fontshare (<code className="text-reishi font-mono text-xs">api.fontshare.com</code>, <code className="text-reishi font-mono text-xs">cdn.fontshare.com</code> for Cabinet Grotesk and Satoshi) and Google Fonts (<code className="text-reishi font-mono text-xs">fonts.googleapis.com</code>, <code className="text-reishi font-mono text-xs">fonts.gstatic.com</code> for JetBrains Mono). When your browser downloads these font files, standard network requests (including your IP address and user-agent) are handled by those content delivery networks to serve font assets.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reishi font-mono select-none mt-0.5">•</span>
              <span>
                <strong className="text-bone">Direct Canonical Outbound Links:</strong> When you click a link to visit an indexed tool, view documentation, or browse a GitHub repository, you connect directly to that external domain. MARIA does not append affiliate tracking tags, redirect through advertising bridges, or pass your saved stack data to external sites.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 4: Data Deletion & User Rights */}
      <section className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone text-lg font-semibold">
          <Trash2 className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">4. How to Manage and Delete Your Data</h2>
        </div>
        <p className="type-body text-ash-400">
          Because your data is stored entirely on your computer, you have total control over it at all times:
        </p>
        <div className="space-y-2 text-xs sm:text-sm text-ash-400">
          <p>
            • <strong className="text-bone">In the application:</strong> Click the &ldquo;Clear All Data&rdquo; button above to immediately delete all MARIA keys from your browser&apos;s localStorage.
          </p>
          <p>
            • <strong className="text-bone">In your browser settings:</strong> You can clear cookies and site data for this domain at any time through your browser&apos;s standard privacy settings.
          </p>
        </div>
      </section>

      {/* Section 5: Corrections & Contact */}
      <section className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone text-lg font-semibold">
          <AlertCircle className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">5. Questions and Corrections</h2>
        </div>
        <p className="type-body text-ash-400">
          MARIA is maintained as an open curatorial initiative. If you spot an inaccurate tier description, a deprecated link, or have questions about how the platform functions, please submit an issue or suggestion through our public repository or via the &ldquo;Suggest a Resource&rdquo; modal.
        </p>
        <p className="text-xs font-mono text-ash-500">
          Note: MARIA operates without commercial corporate headquarters or remote user databases. Direct inquiries and contributions are coordinated through public open-source channels.
        </p>
      </section>

      {/* Navigation Footer */}
      <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/about"
          className="text-xs font-mono text-ash-400 hover:text-bone transition-colors"
        >
          ← About the Archive
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/faq"
            className="text-xs font-mono text-ash-400 hover:text-bone transition-colors"
          >
            Read FAQ
          </Link>
          <Link
            href="/discover"
            className="type-btn px-4 py-2 rounded-[4px] bg-bone hover:bg-[#e8e8e1] text-ink text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open Discovery</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
