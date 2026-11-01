import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'MARIA — Curated Archive of Digital Creation Resources',
  description: 'An independent directory indexing 2,500 open-source software libraries, developer APIs, 3D pipelines, and creative tools. Real utility, zero tracking, and direct canonical links.',
  metadataBase: new URL(process.env.APP_URL || 'https://maria.dev'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'MARIA — Curated Archive of Digital Creation Resources',
    description: 'An independent directory indexing 2,500 open-source software libraries, developer APIs, 3D pipelines, and creative tools. Real utility, zero tracking, and direct canonical links.',
    type: 'website',
    siteName: 'MARIA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MARIA — Curated Archive of Digital Creation Resources',
    description: 'An independent directory indexing 2,500 open-source software libraries, developer APIs, 3D pipelines, and creative tools. Real utility, zero tracking, and direct canonical links.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MARIA',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    description:
      'An independent directory indexing 2,500 open-source software libraries, developer APIs, 3D pipelines, and creative tools. Real utility, zero tracking, and direct canonical links.',
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Preconnect for Fontshare and Google Fonts CDNs */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload primary Satoshi regular (400) font to eliminate Cumulative Layout Shift (CLS) */}
        <link
          rel="preload"
          href="https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Fontshare Display & Body System with font-display: swap */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@600,700,800&f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />

        {/* Google Fonts Technical Monospace with font-display: swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="bg-ink text-bone antialiased font-sans min-h-screen"
        suppressHydrationWarning
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
