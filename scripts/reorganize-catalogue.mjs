#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const resourcesTsPath = path.join(rootDir, 'data/resources.ts');

// 1. Read existing resources
console.log('Reading current resources from data/resources.ts...');
const script = `
  import { RESOURCES } from './data/resources.ts';
  console.log(JSON.stringify(RESOURCES));
`;
const output = execSync('npx tsx -e "' + script.replace(/\n/g, ' ') + '"', {
  cwd: rootDir,
  maxBuffer: 40 * 1024 * 1024,
  encoding: 'utf-8',
});
const resources = JSON.parse(output);
console.log(`Loaded ${resources.length} resources.`);

// 2. Canonical Subcategory Mapping Table
const SUBCATEGORY_MAP = {
  // dev consolidation
  'Frameworks': 'Frameworks & Libraries',
  'UI Libraries': 'Frameworks & Libraries',
  'Compilers & Linters': 'Developer Essentials',
  'Build Systems': 'Developer Essentials',
  'Package Managers': 'Developer Essentials',
  'Runtimes': 'Hosting & Edge',
  'Desktop Runtimes': 'Developer Essentials',
  'Validation & Schemas': 'Developer Essentials',
  'Communication & APIs': 'API Tools & Testing',
  'Self-Hosted & Analytics': 'CI/CD & DevOps',
  'Self-Hosted & Automation': 'CI/CD & DevOps',
  'Self-Hosted & Database': 'Database & BaaS',
  'Self-Hosted & DevOps': 'CI/CD & DevOps',

  // design consolidation
  'Vector & UI Design': 'UI & Visual Design',
  'Wireframing & Diagrams': 'Wireframing & Mockups',
  '3D & WebGL': '3D & Spatial',
  'Motion & Sequencing': 'Motion & Interaction',

  // video consolidation
  'Video Editing & VFX': 'Motion & VFX',
  'Transcoding & Tools': 'Transcoding & Codecs',
  'Audio & Music': 'Media Players & Utilities',

  // ai consolidation
  'Local Inference': 'Local LLMs & Inference',
  'Generative Media & UI': 'Generative Media & Images',
  'Cloud Inference': 'AI Platforms & Tools',
  'Model Serving': 'AI Platforms & Tools',
  'Model Hubs': 'AI Platforms & Tools',

  // api consolidation
  'Developer Testing': 'Developer Testing & Mocks',
  'Science & Astronomy': 'Open Data & Science',
  'Open Data & Health': 'Open Data & Science',
  'Civic & Geospatial': 'Geospatial & IP',
  'Weather & Geospatial': 'Weather & Environment',
  'Financial & Civic Data': 'Finance & Cryptocurrency',
  'Gaming & Educational': 'Entertainment & Pop Culture',
  'Media & Literature': 'Entertainment & Pop Culture',

  // asset consolidation
  '3D Textures & HDRIs': '3D Models & Textures',
  'Audio & Sound Effects': 'Audio, SFX & DAWs',
  'Video & Audio Templates': 'Templates & Themes',
  'Stock Footage': 'Stock Photography',
  'Patterns & Textures': 'Patterns & Gradients',
  'Game & UI Assets': 'Creative Assets',
};

// 3. Subcategory Priority Hierarchy per Category
const SUBCAT_ORDER = {
  dev: [
    'Frameworks & Libraries',
    'Database & BaaS',
    'Developer Essentials',
    'IDEs & Editors',
    'Hosting & Edge',
    'API Tools & Testing',
    'CI/CD & DevOps',
    'Terminal & Git',
    'Security & Auth',
    'Monitoring & Observability',
    'Vector & Search',
  ],
  design: [
    'UI & Visual Design',
    'Design Systems & Tokens',
    'Icons & Symbols',
    'Typography & Fonts',
    'Wireframing & Mockups',
    'Color & Palettes',
    'Motion & Interaction',
    '3D & Spatial',
    'Shaders & Creative Coding',
    'Photo & Vector Editing',
    'Design Inspiration',
  ],
  ai: [
    'Local LLMs & Inference',
    'AI Platforms & Tools',
    'Agents & Orchestration',
    'Generative Media & Images',
    'Audio & Speech AI',
    'Video & Motion AI',
    'LLMOps & Prompt Engineering',
  ],
  video: [
    'Video Editors',
    'Motion & VFX',
    'Transcoding & Codecs',
    'Video Production',
    'Media Players & Utilities',
    'Stock Footage & LUTs',
    'Streaming & Capture',
  ],
  asset: [
    '3D Models & Textures',
    'Creative Assets',
    'Typography & Fonts',
    'Audio, SFX & DAWs',
    'Stock Photography',
    'Illustrations & Vectors',
    'Patterns & Gradients',
    'Templates & Themes',
  ],
  api: [
    'Developer Testing & Mocks',
    'Public REST APIs',
    'Weather & Environment',
    'Open Data & Science',
    'Geospatial & IP',
    'Finance & Cryptocurrency',
    'News & Media',
    'Jobs & Demographics',
    'Entertainment & Pop Culture',
  ],
};

// Foundational Core Tools to prioritize within their subcategories
const FOUNDATIONAL_TOOLS = new Set([
  // dev
  'nextjs', 'react', 'vue', 'svelte', 'astro', 'hono', 'shadcn-ui', 'tailwind',
  'supabase', 'pocketbase', 'sqlite', 'postgres', 'drizzle-orm', 'prisma',
  'bun', 'nodejs', 'vite', 'typescript', 'biome', 'vitest',
  'vscode', 'cursor', 'neovim', 'zed',
  'cloudflare-workers', 'vercel', 'netlify',
  'hoppscotch', 'postman', 'bruno',
  'docker', 'coolify', 'portainer',
  'ghostty', 'alacritty', 'warp', 'starship', 'lazygit',
  'lucia', 'nextauth', 'supertokens',
  'sentry', 'prometheus', 'grafana',
  'chromadb', 'meilisearch', 'typesense',

  // design
  'penpot', 'figma-free', 'svgomg', 'inkscape',
  'open-props', 'radix-colors',
  'lucide-icons', 'svgl', 'tabler-icons',
  'fontshare', 'google-fonts', 'velvetyne',
  'excalidraw', 'tldraw',
  'coolors', 'huemint', 'realtime-colors',
  'gsap', 'framer-motion', 'lottie',
  'blender', 'threejs', 'spline',
  'shadertoy', 'p5js',
  'gimp', 'photopea', 'vectorpea',

  // ai
  'ollama', 'lm-studio', 'vllm', 'open-webui', 'llama-cpp',
  'huggingface', 'groq-api', 'together-ai', 'replicate',
  'langchain', 'llamaindex', 'crewai', 'autogen',
  'comfyui', 'automatic1111', 'fooocus',
  'whisper-cpp', 'kokoro-tts', 'bark',
  'animatediff', 'stable-video',
  'litellm', 'promptfoo', 'langfuse',

  // video
  'davinci-resolve', 'kdenlive', 'shotcut', 'capcut-free',
  'natron', 'blender-vfx',
  'ffmpeg-wasm', 'handbrake', 'lossless-cut',
  'obs-studio', 'lightworks',
  'vlc', 'mpv', 'iina',
  'pexels-video', 'pixabay-video', 'mixkit',
  'sharex', 'kap', 'screentogif',

  // asset
  'poly-haven', 'ambientcg', 'kenney-assets',
  'openverse', 'public-domain-review',
  'freesound', 'bbc-sound-effects',
  'unsplash-free', 'pexels-photos', 'pixabay-photos',
  'undraw', 'open-peeps', 'humaaans',
  'hero-patterns', 'mesh-gradients',
  'html5up', 'start-bootstrap',

  // api
  'dummyjson', 'jsonplaceholder', 'httpbin', 'reqres',
  'rest-countries', 'open-library-api', 'pokeapi',
  'open-meteo', 'noaa-open-data',
  'nasa-open-api', 'usgs-earthquake-api',
  'nominatim', 'ip-api',
  'frankfurter-api', 'coingecko-free',
  'hacker-news-api', 'wikipedia-api',
]);

// 4. Clean and normalize each resource
const cleaned = resources.map((item) => {
  const r = { ...item };
  if (r.category === 'asset' && r.subcategory === 'Color & Palettes') {
    r.subcategory = 'Patterns & Gradients';
  } else if (SUBCATEGORY_MAP[r.subcategory]) {
    r.subcategory = SUBCATEGORY_MAP[r.subcategory];
  }
  return r;
});

// 5. Deliberate static editorial ordering
const categoryOrder = ['dev', 'design', 'ai', 'video', 'asset', 'api'];

const sortedResources = [];

for (const cat of categoryOrder) {
  const catItems = cleaned.filter((r) => r.category === cat);
  const subcatList = SUBCAT_ORDER[cat] || [];

  catItems.sort((a, b) => {
    // 1. Subcategory workflow sequence
    const subIdxA = subcatList.indexOf(a.subcategory);
    const subIdxB = subcatList.indexOf(b.subcategory);
    const orderA = subIdxA === -1 ? 999 : subIdxA;
    const orderB = subIdxB === -1 ? 999 : subIdxB;

    if (orderA !== orderB) return orderA - orderB;

    // 2. Foundational standard tools first within subcategory
    const isFoundationalA = FOUNDATIONAL_TOOLS.has(a.id) || a.featured;
    const isFoundationalB = FOUNDATIONAL_TOOLS.has(b.id) || b.featured;
    if (isFoundationalA && !isFoundationalB) return -1;
    if (!isFoundationalA && isFoundationalB) return 1;

    // 3. Open source tools before proprietary within the same tier
    if (a.openSource && !b.openSource) return -1;
    if (!a.openSource && b.openSource) return 1;

    // 4. Stable alphabetical secondary ordering
    return a.name.localeCompare(b.name);
  });

  sortedResources.push(...catItems);
}

console.log(`Sorted ${sortedResources.length} resources.`);
if (sortedResources.length !== resources.length) {
  console.error('ERROR: Resource count mismatch!');
  process.exit(1);
}

// 6. Split into clean chunks and write to data/resources.ts
const CHUNK_SIZE = 300;
const chunks = [];
for (let i = 0; i < sortedResources.length; i += CHUNK_SIZE) {
  chunks.push(sortedResources.slice(i, i + CHUNK_SIZE));
}

let fileContent = `import { ResourceItem } from '@/types/resource';\n\n`;

chunks.forEach((chunk, idx) => {
  fileContent += `const CHUNK_${idx}: ResourceItem[] = ${JSON.stringify(chunk, null, 2)};\n\n`;
});

fileContent += `export const RESOURCES: ResourceItem[] = [\n`;
chunks.forEach((_, idx) => {
  fileContent += `  ...CHUNK_${idx},\n`;
});
fileContent += `];\n`;

fs.writeFileSync(resourcesTsPath, fileContent, 'utf-8');
console.log('✅ Successfully wrote updated data/resources.ts!');
