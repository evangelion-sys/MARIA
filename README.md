# MARIA — Curated Archive of Digital Creation Resources

An independent, high-utility directory and developer workspace indexing **2,500 digital creation tools**, open-source libraries, free APIs, and creative foundations across modern development, design, 3D WebGL, video production, and AI workflows.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Zero Trackers](https://img.shields.io/badge/Tracking-Zero_Cookies-success)](https://maria.dev/privacy)

---

## Overview

Finding high-quality software without navigating sponsored listicles, affiliate wrappers, or deceptive trial traps has become increasingly difficult. MARIA was engineered to restore calm, factual discovery:

1. **2,500 Listed Resources**: Evaluated across 6 creative disciplines with zero duplicate entries.
2. **Strict Invariant Auditing**: Evaluates tools for OSI-approved open-source licenses, unmetered public API tiers, or perpetual developer free tiers without upfront credit card requirements.
3. **Monochrome Butterfly Brand System**: Clean, scalable vector insignia and calibrated M-A-R-I-A letterforms.
4. **Client-Side Data Sovereignty**: "My Stack" bookmarking, custom collections, and recent inspection history run entirely in `localStorage`. Zero tracking cookies or remote profiling.
5. **Portable Manifest Standards**: One-click JSON export/import of curated stacks for team onboarding and project scaffolding.

---

## Creative Disciplines

| Discipline | Core Coverage | Examples |
|---|---|---|
| **Developer Tools** | Edge frameworks, embedded databases, high-speed linters, authentication providers, and testing frameworks. | Next.js, Bun, Supabase, SQLite, Biome, Vitest |
| **Design & 3D WebGL** | Vector suites, Blender pipelines, Three.js toolkits, design token managers, and UI prototyping. | Blender, Three.js, Penpot, Figma Free, GSAP |
| **Video & Audio** | Non-linear editors, WebAssembly transcoders, digital audio workstations, and Foley libraries. | DaVinci Resolve, FFmpeg, Audacity, Shotcut |
| **AI & Inference** | Local model runtimes, quantized inference engines, ComfyUI workflows, and text-to-speech models. | Ollama, vLLM, ComfyUI, Whisper.cpp, Kokoro-TTS |
| **Public REST APIs** | Public endpoints for meteorology, geodata, astronomy, economics, biology, and open government. | Open-Meteo, Nominatim, OpenAQ, PubChem |
| **Creative Assets** | CC0 3D models, procedural PBR textures, open-source type foundries, and UI pattern kits. | AmbientCG, Fontshare, Poly Pizza, Freesound |

---

## Quick Start

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm or bun

### Local Installation
```bash
# Install dependencies
npm install

# Run automated integrity test suite
npm test

# Start development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Production Build & Verification

```bash
# Run ESLint validation
npm run lint

# Compile and create optimized production build
npm run build

# Start production server
npm run start
```

---

## Project Structure

```
├── app/
│   ├── about/                # Curatorial methodology, roadmap & principles
│   ├── discover/             # Filterable catalog directory, AI guide & stacks
│   ├── docs/                 # Platform architecture, manifest schemas & invariants
│   ├── faq/                  # Direct answers on licensing, data & quotas
│   ├── privacy/              # Plain-English zero-tracking privacy policy
│   ├── terms/                # Terms of use & catalog attribution
│   ├── globals.css           # Centralized typography & Tailwind 4 design system
│   ├── layout.tsx            # Root layout, Fontshare CDN & Schema.org JSON-LD
│   ├── icon.svg              # Monochrome butterfly vector favicon
│   ├── page.tsx              # Monumental editorial landing experience
│   ├── robots.ts             # Search engine robots.txt configuration
│   └── sitemap.ts            # Dynamic XML sitemap generator
├── components/               # Modular UI components
│   ├── AppShell.tsx          # Client state provider for stacks & modals
│   ├── BrandLogoShowcase.tsx # Monochrome butterfly brand identity system
│   ├── CinematicBackground.tsx# Async-decoded animated background aura
│   ├── FaqAccordion.tsx      # Fast search & accordion FAQ system
│   ├── MariaLogo.tsx         # Scalable monochrome butterfly vector logo
│   ├── Navbar.tsx            # Accessible navigation with sliding indicator
│   ├── ResourceCard.tsx      # Content-visibility optimized resource card
│   ├── ResourceDirectory.tsx # Filterable catalog with responsive grid
│   ├── ResourceModal.tsx     # Factual detail inspector dialog
│   └── StackBuilderDrawer.tsx# JSON stack manifest exporter/importer
├── data/
│   ├── resources.ts          # 2,500 verified tools dataset
│   ├── resources.json        # Fast raw dataset for production builds
│   ├── resource-ids.ts       # Canonical ID registry and counts
│   ├── starter-stacks.ts     # Pre-assembled architectural pairings
│   └── workflow-collections.ts# Curated discipline workflows
├── hooks/                    # Reusable React hooks
│   └── use-maria-stack.ts    # Browser-local stack persistence hook
├── lib/
│   ├── category-taxonomy.ts  # Canonical category & subcategory taxonomy
│   ├── cinematic-motion.ts   # Anime.js animations & reduced-motion safeguards
│   └── storage-keys.ts       # Centralized browser localStorage keys
└── types/
    └── resource.ts           # TypeScript interfaces for resources & stacks
```

---

## Privacy & Storage Disclosures

MARIA operates on strict client-side data sovereignty:
- **`maria_saved_stack`**: Array of bookmarked resource IDs.
- **`maria_recent_inspected`**: Up to 15 recently viewed tool IDs.
- **`maria_custom_collections`**: Named project stacks created by the user.
- **`maria_external_link_pref`**: Outbound link behavior preference.
- **`maria_user_submissions`**: Local drafts of user resource proposals.

No telemetry, remote user profiles, or third-party tracking cookies are used. Outbound links connect directly to third-party providers. Users can purge all local data anytime via the one-click control on `/privacy`.

---

## Attribution & Legal

- Third-party product names, logos, documentation, and trademarks belong to their respective creators and foundations. All listings include direct outbound canonical links.
- See `/terms` and `/privacy` for full platform operating terms.
