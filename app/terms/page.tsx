import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck,
  FileText,
  ExternalLink,
  Scale,
  Database,
  AlertCircle,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use — MARIA Archive',
  description:
    'Terms of use, intellectual property boundaries, third-party disclaimers, and access conditions for the MARIA digital resource archive.',
  openGraph: {
    title: 'Terms of Use — MARIA Archive',
    description:
      'Terms of use, intellectual property boundaries, third-party disclaimers, and access conditions for the MARIA digital resource archive.',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Use — MARIA Archive',
    description:
      'Terms of use, intellectual property boundaries, third-party disclaimers, and access conditions for the MARIA digital resource archive.',
  },
};

export default function TermsPage() {
  return (
    <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-16 space-y-12 bg-transparent text-bone">
      {/* Page Header */}
      <div className="space-y-4 text-left">
        <span className="type-eyebrow text-reishi">Legal &amp; Governance</span>
        <h1 className="type-page-title text-bone">
          Terms of Use
        </h1>
        <p className="type-body-lg text-ash-400">
          Transparent guidelines governing use of the MARIA discovery archive, third-party resource links, intellectual property boundaries, and client-side data.
        </p>
        <div className="text-xs font-mono text-ash-600 pt-1">
          Effective Date: October 31, 2026 · Index Revision 2026.10
        </div>
      </div>

      {/* Section 1: Nature of the Service */}
      <section id="nature-of-service" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <FileText className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">1. Nature of the Service</h2>
        </div>
        <p className="type-body text-ash-400">
          MARIA is an independent, non-commercial digital directory and discovery platform. It indexes verified open-source software libraries, developer frameworks, creative suites, public REST APIs, and digital assets. MARIA provides descriptive summaries, access-model categorizations, and direct links to canonical destinations.
        </p>
        <p className="type-body text-ash-400">
          MARIA does not sell, host, mirror, or vend third-party software packages or cloud subscriptions. Any interaction, download, account creation, or financial transaction you enter into with a listed third-party provider is strictly between you and that third party.
        </p>
      </section>

      {/* Section 2: Intellectual Property & Third-Party Trademarks */}
      <section id="intellectual-property" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <Scale className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">2. Trademarks &amp; Intellectual Property</h2>
        </div>
        <p className="type-body text-ash-400">
          All product names, logos, brands, registered trademarks, and open-source project emblems mentioned or depicted in the MARIA catalogue remain the exclusive property of their respective creators, maintainers, and foundations. Reference to any specific commercial product, process, or service by trade name, trademark, manufacturer, or otherwise does not constitute an endorsement, sponsorship, or recommendation by MARIA.
        </p>
        <p className="type-body text-ash-400">
          The MARIA wordmark, original Quincy Kreuz vector emblem, and curatorial taxonomy are original assets created for this discovery interface.
        </p>
      </section>

      {/* Section 3: Catalog Accuracy & Third-Party Changes */}
      <section id="accuracy-disclaimer" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <AlertCircle className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">3. Catalog Information &amp; Third-Party Changes</h2>
        </div>
        <p className="type-body text-ash-400">
          We inspect and verify resource metadata—including license types (e.g., MIT, Apache 2.0, AGPL), free-tier quota limits, and API requirements—against official project documentation at the time of cataloguing.
        </p>
        <p className="type-body text-ash-400">
          However, independent third-party providers may alter their pricing models, terms of service, license terms, or API quotas at any time without notice. While we continuously audit listings, MARIA cannot guarantee that third-party terms will remain unchanged. Users are strongly advised to inspect the canonical license and pricing page of each tool before adopting it in commercial or production environments.
        </p>
      </section>

      {/* Section 4: External Outbound Links */}
      <section id="external-links" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <ExternalLink className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">4. External Links &amp; Outbound Navigation</h2>
        </div>
        <p className="type-body text-ash-400">
          The archive contains direct hyperlinks to external websites, documentation sites, and code repositories. MARIA does not operate or control these third-party destinations. We do not inject affiliate tracking tags, URL redirection middle-layers, or commercial interstitial wrappers. Clicking an external link connects your browser directly to the target domain, subject to that domain&apos;s independent privacy policy and terms.
        </p>
      </section>

      {/* Section 5: Client-Side Data & Browser Local Storage */}
      <section id="client-data" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <Database className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">5. Client-Side Data &amp; No User Accounts</h2>
        </div>
        <p className="type-body text-ash-400">
          MARIA does not maintain remote user databases or collect personal credentials. All workspace customization features—such as saved stacks in &ldquo;My Stack&rdquo;, recently inspected tools, and user-created custom workflow collections—are stored exclusively in your browser&apos;s client-side <code className="text-reishi bg-surface border border-line px-1.5 py-0.5 rounded font-mono text-xs">localStorage</code>.
        </p>
        <p className="type-body text-ash-400">
          You have full sovereignty over this data. You may inspect, export as JSON, or erase all stored entries at any time using the &ldquo;Clear All Data&rdquo; control on the <Link href="/privacy#storage" className="text-reishi hover:underline">Privacy Disclosures</Link> page.
        </p>
      </section>

      {/* Section 6: User Suggestions & Proposals */}
      <section id="user-proposals" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <ShieldCheck className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">6. Resource Suggestions &amp; Submissions</h2>
        </div>
        <p className="type-body text-ash-400">
          When you propose a resource through the &ldquo;Suggest a Resource&rdquo; interface, the proposal is stored in your browser client and queued for curatorial verification. By submitting a resource, you confirm that the tool meets MARIA invariants: it must possess an OSI-approved open-source license, a genuine perpetual free tier, or zero-cost public access without deceptive upfront billing traps.
        </p>
      </section>

      {/* Section 7: Acceptable Use */}
      <section id="acceptable-use" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <Scale className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">7. Acceptable Use</h2>
        </div>
        <p className="type-body text-ash-400">
          You are welcome to browse, search, filter, and export stack manifests for personal, academic, or commercial software engineering and creative work. You agree not to engage in malicious activities, such as distributed denial-of-service (DDoS) attempts, or abusive automated extraction that impairs service availability for other users.
        </p>
      </section>

      {/* Section 8: Disclaimer of Warranties */}
      <section id="warranty-disclaimer" className="space-y-4 pt-6 border-t border-line text-left">
        <div className="flex items-center gap-2.5 text-bone font-bold text-lg">
          <AlertCircle className="w-5 h-5 text-reishi" />
          <h2 className="type-section-title text-bone">8. Disclaimer of Warranties &amp; Limitation of Liability</h2>
        </div>
        <p className="type-body text-ash-400">
          MARIA IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. IN NO EVENT SHALL MARIA OR ITS CONTRIBUTORS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY ARISING FROM THE USE OF OR INABILITY TO USE THE SERVICE OR ANY THIRD-PARTY TOOLS DISCOVERED THROUGH IT.
        </p>
      </section>

      {/* Navigation Footer */}
      <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/privacy"
          className="text-xs font-mono text-ash-400 hover:text-bone transition-colors"
        >
          ← Privacy &amp; Data Governance
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/faq"
            className="text-xs font-mono text-ash-400 hover:text-bone transition-colors"
          >
            Frequently Asked Questions
          </Link>
          <Link
            href="/discover"
            className="type-btn px-4 py-2.5 rounded-[4px] bg-bone hover:bg-[#e8e8e1] text-ink text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open Discovery</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
