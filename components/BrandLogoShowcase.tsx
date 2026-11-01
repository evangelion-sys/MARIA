'use client';

import React, { useState } from 'react';
import { MariaLogo, MariaLogoVariant } from '@/components/MariaLogo';
import { Copy, Download, Check, Sparkles, Eye, History } from 'lucide-react';

export function BrandLogoShowcase() {
  const [activeVariant, setActiveVariant] = useState<MariaLogoVariant>('horizontal');
  const [backgroundMode, setBackgroundMode] = useState<'dark' | 'light' | 'midnight'>('midnight');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Exact Raw SVG Strings for one-click developer/designer export
  const rawSvgs: Record<string, string> = {
    horizontal: `<svg viewBox="0 0 196 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MARIA Logo">
  <g transform="translate(24, 22) scale(0.125) translate(-200, -112)" fill="#F5F5F0">
    <path d="M196 99C169 42 91 17 54 43C22 65 44 119 82 132C115 144 157 121 190 113C160 133 137 160 150 181C165 204 191 168 198 137Z"/>
    <path d="M204 99C231 42 309 17 346 43C378 65 356 119 318 132C285 144 243 121 210 113C240 133 263 160 250 181C235 204 209 168 202 137Z"/>
    <path d="M195 103C180 72 147 65 126 78C111 88 126 111 150 117C169 122 184 114 195 110Z" opacity="0.4"/>
    <path d="M205 103C220 72 253 65 274 78C289 88 274 111 250 117C231 122 216 114 205 110Z" opacity="0.4"/>
    <path d="M197 94Q179 57 163 43Q181 46 198 76Z"/>
    <path d="M203 94Q221 57 237 43Q219 46 202 76Z"/>
    <ellipse cx="200" cy="120" rx="5" ry="30"/>
    <circle cx="200" cy="86" r="4.5"/>
  </g>
  <g transform="translate(54, 6) scale(0.82)" fill="#F5F5F0">
    <path d="M 0 36 L 0 4 L 6 4 L 14 21.5 L 22 4 L 28 4 L 28 36 L 22.5 36 L 22.5 13 L 15.5 27 L 12.5 27 L 5.5 13 L 5.5 36 Z"/>
    <path d="M 47 4 L 53 4 L 64 36 L 58 36 L 55.8 28.5 L 44.2 28.5 L 42 36 L 36 36 Z M 45.4 23.5 L 54.6 23.5 L 50 10.5 Z"/>
    <path d="M 72 36 L 72 4 L 86.5 4 C 92.5 4 95 7 95 12 C 95 16.5 92 19.5 86.5 20.2 L 95 36 L 88.5 36 L 80.8 21 L 77.5 21 L 77.5 36 Z M 77.5 16.2 L 85.5 16.2 C 88.5 16.2 89.5 14.5 89.5 12 C 89.5 9.5 88.5 8.2 L 77.5 8.2 Z"/>
    <path d="M 103 36 L 103 4 L 108.5 4 L 108.5 36 Z"/>
    <path d="M 127.5 4 L 133.5 4 L 144.5 36 L 138.5 36 L 136.3 28.5 L 124.7 28.5 L 122.5 36 L 116.5 36 Z M 125.9 23.5 L 135.1 23.5 L 130.5 10.5 Z"/>
  </g>
</svg>`,
    compact: `<svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MARIA Logo Compact">
  <g transform="translate(20, 18) scale(0.10) translate(-200, -112)" fill="#F5F5F0">
    <path d="M196 99C169 42 91 17 54 43C22 65 44 119 82 132C115 144 157 121 190 113C160 133 137 160 150 181C165 204 191 168 198 137Z"/>
    <path d="M204 99C231 42 309 17 346 43C378 65 356 119 318 132C285 144 243 121 210 113C240 133 263 160 250 181C235 204 209 168 202 137Z"/>
    <ellipse cx="200" cy="120" rx="5" ry="30"/>
    <circle cx="200" cy="86" r="4.5"/>
  </g>
  <g transform="translate(44, 5) scale(0.68)" fill="#F5F5F0">
    <path d="M 0 36 L 0 4 L 6 4 L 14 21.5 L 22 4 L 28 4 L 28 36 L 22.5 36 L 22.5 13 L 15.5 27 L 12.5 27 L 5.5 13 L 5.5 36 Z"/>
    <path d="M 47 4 L 53 4 L 64 36 L 58 36 L 55.8 28.5 L 44.2 28.5 L 42 36 L 36 36 Z M 45.4 23.5 L 54.6 23.5 L 50 10.5 Z"/>
    <path d="M 72 36 L 72 4 L 86.5 4 C 92.5 4 95 7 95 12 C 95 16.5 92 19.5 86.5 20.2 L 95 36 L 88.5 36 L 80.8 21 L 77.5 21 L 77.5 36 Z M 77.5 16.2 L 85.5 16.2 C 88.5 16.2 89.5 14.5 89.5 12 C 89.5 9.5 88.5 8.2 L 77.5 8.2 Z"/>
    <path d="M 103 36 L 103 4 L 108.5 4 L 108.5 36 Z"/>
    <path d="M 127.5 4 L 133.5 4 L 144.5 36 L 138.5 36 L 136.3 28.5 L 124.7 28.5 L 122.5 36 L 116.5 36 Z M 125.9 23.5 L 135.1 23.5 L 130.5 10.5 Z"/>
  </g>
</svg>`,
    symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <g transform="translate(100, 100) scale(0.52) translate(-200, -112)" fill="currentColor">
    <path d="M196 99C169 42 91 17 54 43C22 65 44 119 82 132C115 144 157 121 190 113C160 133 137 160 150 181C165 204 191 168 198 137Z"/>
    <path d="M204 99C231 42 309 17 346 43C378 65 356 119 318 132C285 144 243 121 210 113C240 133 263 160 250 181C235 204 209 168 202 137Z"/>
    <path d="M195 103C180 72 147 65 126 78C111 88 126 111 150 117C169 122 184 114 195 110Z" opacity="0.4"/>
    <path d="M205 103C220 72 253 65 274 78C289 88 274 111 250 117C231 122 216 114 205 110Z" opacity="0.4"/>
    <path d="M197 94Q179 57 163 43Q181 46 198 76Z"/>
    <path d="M203 94Q221 57 237 43Q219 46 202 76Z"/>
    <ellipse cx="200" cy="120" rx="5" ry="30"/>
    <circle cx="200" cy="86" r="4.5"/>
  </g>
</svg>`,
    monochrome: `<svg viewBox="0 0 196 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MARIA Logo Monochrome">
  <g transform="translate(24, 22) scale(0.125) translate(-200, -112)" fill="currentColor">
    <path d="M196 99C169 42 91 17 54 43C22 65 44 119 82 132C115 144 157 121 190 113C160 133 137 160 150 181C165 204 191 168 198 137Z"/>
    <path d="M204 99C231 42 309 17 346 43C378 65 356 119 318 132C285 144 243 121 210 113C240 133 263 160 250 181C235 204 209 168 202 137Z"/>
    <ellipse cx="200" cy="120" rx="5" ry="30"/>
    <circle cx="200" cy="86" r="4.5"/>
  </g>
  <g transform="translate(54, 6) scale(0.82)" fill="currentColor">
    <path d="M 0 36 L 0 4 L 6 4 L 14 21.5 L 22 4 L 28 4 L 28 36 L 22.5 36 L 22.5 13 L 15.5 27 L 12.5 27 L 5.5 13 L 5.5 36 Z"/>
    <path d="M 47 4 L 53 4 L 64 36 L 58 36 L 55.8 28.5 L 44.2 28.5 L 42 36 L 36 36 Z M 45.4 23.5 L 54.6 23.5 L 50 10.5 Z"/>
    <path d="M 72 36 L 72 4 L 86.5 4 C 92.5 4 95 7 95 12 C 95 16.5 92 19.5 86.5 20.2 L 95 36 L 88.5 36 L 80.8 21 L 77.5 21 L 77.5 36 Z M 77.5 16.2 L 85.5 16.2 C 88.5 16.2 89.5 14.5 89.5 12 C 89.5 9.5 88.5 8.2 L 77.5 8.2 Z"/>
    <path d="M 103 36 L 103 4 L 108.5 4 L 108.5 36 Z"/>
    <path d="M 127.5 4 L 133.5 4 L 144.5 36 L 138.5 36 L 136.3 28.5 L 124.7 28.5 L 122.5 36 L 116.5 36 Z M 125.9 23.5 L 135.1 23.5 L 130.5 10.5 Z"/>
  </g>
</svg>`,
    favicon: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="7" fill="#070709" />
  <g transform="translate(16, 16) scale(0.075) translate(-200, -112)" fill="#F5F5F0">
    <path d="M196 99C169 42 91 17 54 43C22 65 44 119 82 132C115 144 157 121 190 113C160 133 137 160 150 181C165 204 191 168 198 137Z"/>
    <path d="M204 99C231 42 309 17 346 43C378 65 356 119 318 132C285 144 243 121 210 113C240 133 263 160 250 181C235 204 209 168 202 137Z"/>
    <ellipse cx="200" cy="120" rx="5" ry="30"/>
    <circle cx="200" cy="86" r="4.5"/>
  </g>
</svg>`,
    footer: `<svg viewBox="0 0 196 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MARIA Footer Logo">
  <g transform="translate(24, 22) scale(0.125) translate(-200, -112)" fill="#F5F5F0">
    <path d="M196 99C169 42 91 17 54 43C22 65 44 119 82 132C115 144 157 121 190 113C160 133 137 160 150 181C165 204 191 168 198 137Z"/>
    <path d="M204 99C231 42 309 17 346 43C378 65 356 119 318 132C285 144 243 121 210 113C240 133 263 160 250 181C235 204 209 168 202 137Z"/>
    <ellipse cx="200" cy="120" rx="5" ry="30"/>
    <circle cx="200" cy="86" r="4.5"/>
  </g>
  <g transform="translate(54, 6) scale(0.82)" fill="#F5F5F0">
    <path d="M 0 36 L 0 4 L 6 4 L 14 21.5 L 22 4 L 28 4 L 28 36 L 22.5 36 L 22.5 13 L 15.5 27 L 12.5 27 L 5.5 13 L 5.5 36 Z"/>
    <path d="M 47 4 L 53 4 L 64 36 L 58 36 L 55.8 28.5 L 44.2 28.5 L 42 36 L 36 36 Z M 45.4 23.5 L 54.6 23.5 L 50 10.5 Z"/>
    <path d="M 72 36 L 72 4 L 86.5 4 C 92.5 4 95 7 95 12 C 95 16.5 92 19.5 86.5 20.2 L 95 36 L 88.5 36 L 80.8 21 L 77.5 21 L 77.5 36 Z M 77.5 16.2 L 85.5 16.2 C 88.5 16.2 89.5 14.5 89.5 12 C 89.5 9.5 88.5 8.2 L 77.5 8.2 Z"/>
    <path d="M 103 36 L 103 4 L 108.5 4 L 108.5 36 Z"/>
    <path d="M 127.5 4 L 133.5 4 L 144.5 36 L 138.5 36 L 136.3 28.5 L 124.7 28.5 L 122.5 36 L 116.5 36 Z M 125.9 23.5 L 135.1 23.5 L 130.5 10.5 Z"/>
  </g>
</svg>`,
  };

  const handleCopy = (key: string) => {
    const code = rawSvgs[key] || rawSvgs.horizontal;
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (key: string) => {
    const code = rawSvgs[key] || rawSvgs.horizontal;
    const blob = new Blob([code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maria-identity-${key}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="logo-identity" className="pt-8 border-t border-line space-y-10 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="max-w-2xl text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-surface border border-line text-bone text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-bone" />
            <span>Monochrome Butterfly Emblem &amp; Wordmark System</span>
          </div>
          <h2 className="type-section-title text-bone">MARIA Brand Identity System</h2>
          <p className="type-body text-ash-400 mt-2 text-sm leading-relaxed">
            Refined monochrome butterfly emblem paired with architectural M-A-R-I-A letterforms. Features bilateral wing geometry, delicate antennae, slender body symmetry, and mathematical uppercase typography with calibrated 8px optical kerning.
          </p>
        </div>

        {/* Canvas Background Controls */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-[2px] border border-line self-start sm:self-auto">
          <span className="text-[11px] font-mono text-ash-400 px-2 flex items-center gap-1">
            <Eye className="w-3 h-3" /> Canvas:
          </span>
          <button
            type="button"
            onClick={() => setBackgroundMode('midnight')}
            className={`px-2.5 py-1 rounded-[2px] text-xs font-mono transition-colors cursor-pointer ${
              backgroundMode === 'midnight'
                ? 'bg-ink text-bone border border-line font-bold'
                : 'text-ash-400 hover:text-bone'
            }`}
          >
            Ink #070709
          </button>
          <button
            type="button"
            onClick={() => setBackgroundMode('light')}
            className={`px-2.5 py-1 rounded-[2px] text-xs font-mono transition-colors cursor-pointer ${
              backgroundMode === 'light'
                ? 'bg-bone text-ink shadow-sm font-bold'
                : 'text-ash-400 hover:text-bone'
            }`}
          >
            Bone #F5F5F0
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`relative min-h-[340px] rounded-[6px] border transition-all duration-300 p-8 flex flex-col items-center justify-center overflow-hidden ${
              backgroundMode === 'light'
                ? 'bg-[#EAEAE5] border-ash-400 text-ink'
                : 'bg-ink border-line text-bone'
            }`}
          >
            {/* Subtle background hairline grid */}
            <div
              className={`absolute inset-0 opacity-[0.05] pointer-events-none ${
                backgroundMode === 'light' ? 'invert' : ''
              }`}
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Active Logo Variant Render */}
            <div className="relative z-10 transition-transform duration-300">
              <MariaLogo
                variant={activeVariant}
                size={activeVariant === 'symbol' ? 120 : activeVariant === 'favicon' ? 72 : 44}
                animated={true}
                glow={backgroundMode !== 'light'}
                className={backgroundMode === 'light' ? 'text-ink' : 'text-bone'}
              />
            </div>

            {/* Floating Action Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={() => handleCopy(activeVariant)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-mono backdrop-blur-md transition-all cursor-pointer ${
                  backgroundMode === 'light'
                    ? 'bg-ink/10 hover:bg-ink/20 text-ink'
                    : 'bg-surface/80 hover:bg-surface text-bone border border-line'
                }`}
                title="Copy raw SVG to clipboard"
              >
                {copiedKey === activeVariant ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied SVG</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SVG</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownload(activeVariant)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-mono backdrop-blur-md transition-all cursor-pointer ${
                  backgroundMode === 'light'
                    ? 'bg-ink/10 hover:bg-ink/20 text-ink'
                    : 'bg-surface/80 hover:bg-surface text-bone border border-line'
                }`}
                title="Download SVG file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Variant Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'horizontal' as MariaLogoVariant, label: 'A: Horizontal' },
              { id: 'compact' as MariaLogoVariant, label: 'B: Compact' },
              { id: 'symbol' as MariaLogoVariant, label: 'C: Symbol' },
              { id: 'monochrome' as MariaLogoVariant, label: 'D: Monochrome' },
              { id: 'footer' as MariaLogoVariant, label: 'E: Footer' },
              { id: 'favicon' as MariaLogoVariant, label: 'Favicon' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveVariant(tab.id)}
                className={`py-2 px-2.5 rounded-[2px] text-xs font-mono text-center border transition-all cursor-pointer ${
                  activeVariant === tab.id
                    ? 'bg-surface text-bone border-bone/40 font-bold'
                    : 'bg-ink text-ash-400 border-line hover:text-bone hover:bg-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Design Rationale */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="p-6 rounded-[6px] bg-surface border border-line space-y-4">
            <span className="type-eyebrow text-bone">Monochrome Precision &amp; Optical Balance</span>
            <h3 className="type-section-title text-bone text-base">Insignia Architecture</h3>
            <p className="type-body text-xs leading-relaxed text-ash-400">
              The monochrome butterfly emblem embodies transformation, speed, and creative clarity. Structured to scale effortlessly across miniature 16px favicons, mobile navigation bars, and large editorial displays.
            </p>

            <ul className="space-y-3 text-xs text-ash-400">
              <li className="flex items-start gap-2.5">
                <span className="text-bone font-mono text-[11px] mt-0.5 shrink-0 select-none" aria-hidden="true">01.</span>
                <div>
                  <strong className="text-bone block font-medium">Bilateral Wing Geometry:</strong>
                  Upper and lower wing curves balanced with subtle inner membrane translucent facets for depth without clutter.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bone font-mono text-[11px] mt-0.5 shrink-0 select-none" aria-hidden="true">02.</span>
                <div>
                  <strong className="text-bone block font-medium">Delicate Antennae &amp; Body:</strong>
                  Slender thorax and head silhouettes aligned to the vertical axis of symmetry.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bone font-mono text-[11px] mt-0.5 shrink-0 select-none" aria-hidden="true">03.</span>
                <div>
                  <strong className="text-bone block font-medium">Harmonized 8px Optical Kerning:</strong>
                  Every glyph spacing (M-A, A-R, R-I, I-A) is calibrated to 8px, eliminating uneven gaps and preserving rhythmic balance across scales.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bone font-mono text-[11px] mt-0.5 shrink-0 select-none" aria-hidden="true">04.</span>
                <div>
                  <strong className="text-bone block font-medium">Zero-Raster Scalability:</strong>
                  Pure mathematical vector geometry performing without distortion across all device pixel ratios.
                </div>
              </li>
            </ul>
          </div>

          {/* Size Scale Stress Test */}
          <div className="p-5 rounded-[6px] bg-surface border border-line space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-ash-600 block">
              Optical Scale Evaluation
            </span>
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-mono text-ash-600">44px (Display)</span>
                <MariaLogo variant="horizontal" height={44} animated={false} />
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-mono text-ash-600">32px (Navbar)</span>
                <MariaLogo variant="horizontal" height={32} animated={false} />
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-mono text-ash-600">26px (Compact)</span>
                <MariaLogo variant="compact" height={26} animated={false} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-ash-600">24px (Favicon)</span>
                <MariaLogo variant="favicon" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
