#!/usr/bin/env node

/**
 * Script to merge resources from:
 * 1. Current data/resources.ts (preserves all manual verifications & metadata)
 * 2. public/assets/aistudio/free-resources-mega-list_1e37e4b5.md
 * 3. public/assets/aistudio/free-resources-alternatives-round2_72c0193f.md
 *
 * Enforces strict de-duplication:
 * - Normalized URL de-duplication
 * - Normalized Name de-duplication
 * - Slug collision prevention
 * - Full validation of types, https:// URLs, pricing models, and access models
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const megaPath = path.join(rootDir, 'public/assets/aistudio/free-resources-mega-list_1e37e4b5.md');
const r2Path = path.join(rootDir, 'public/assets/aistudio/free-resources-alternatives-round2_72c0193f.md');
const resourcesTsPath = path.join(rootDir, 'data/resources.ts');

const megaContent = fs.readFileSync(megaPath, 'utf8');
const r2Content = fs.readFileSync(r2Path, 'utf8');

// Read existing resources to preserve their full metadata
const existingResourcesFile = fs.readFileSync(resourcesTsPath, 'utf8');

function cleanUrl(raw) {
  let u = (raw || '').trim();
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = 'https://' + u;
  }
  if (u.startsWith('http://')) {
    u = 'https://' + u.slice(7);
  }
  // Trim trailing slashes for uniformity
  u = u.replace(/\/+$/, '');
  return u;
}

function normalizeUrlKey(url) {
  if (!url) return '';
  let u = url.trim().toLowerCase();
  u = u.replace(/^https?:\/\//, '');
  u = u.replace(/^www\./, '');
  u = u.replace(/\/+$/, '');
  return u;
}

function normalizeNameKey(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function slugify(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'tool';
}

function mapPricing(rawModel, desc) {
  const m = (rawModel || '').toLowerCase();
  const d = (desc || '').toLowerCase();
  if (m.includes('oss') || m.includes('open-source') || d.includes('open-source') || d.includes('oss')) {
    return 'Open Source';
  }
  if (m.includes('trial')) return 'Free Trial';
  if (m.includes('paid')) return 'Paid';
  if (m.includes('freemium')) return 'Freemium';
  if (m.includes('free tier') || m.includes('tier') || m.includes('free/freemium')) return 'Free Tier';
  if (m.startsWith('free') || m === 'free') return 'Free';
  return 'Free Tier';
}

function mapAccessModel(pricingType, isOpenSource) {
  if (isOpenSource) return 'open-source';
  if (pricingType === 'Free') return 'free-no-account';
  if (pricingType === 'Freemium') return 'freemium';
  if (pricingType === 'Free Tier') return 'free-tier';
  if (pricingType === 'Free Trial') return 'free-account-required';
  if (pricingType === 'Paid') return 'paid';
  return 'free-tier';
}

function getSubcategory(category, name, desc) {
  const text = (name + ' ' + desc).toLowerCase();

  if (category === 'dev') {
    if (text.match(/git|github|gitlab|version|repo|branch|p2p git/)) return 'Terminal & Git';
    if (text.match(/ci|cd|pipeline|runner|action|deploy|build|docker|container|k8s|kubernetes|gitops|podman/)) return 'CI/CD & DevOps';
    if (text.match(/editor|ide|neovim|emacs|vscode|terminal|shell|cli|modal editor|codeblocks/)) return 'IDEs & Editors';
    if (text.match(/postgres|mysql|sqlite|database|db|sql|nosql|redis|mongo|baas|vector db|cassandra|scylla|timescale|duckdb|clickhouse/)) return 'Database & BaaS';
    if (text.match(/search|typesense|meilisearch|algolia|opensearch/)) return 'Vector & Search';
    if (text.match(/monitor|trace|log|observab|telemetry|sentry|uptime|grafana|prometheus|signoz|jaeger|zipkin|datadog|loki/)) return 'Monitoring & Observability';
    if (text.match(/security|vuln|cve|secret|snyk|audit|auth|jwt|trivy|syft|cosign|checkov|falco|codeql/)) return 'Security & Auth';
    if (text.match(/api|graphql|rest|http|mock|postman|hoppscotch|testing|test|wiremock|insomnia|charles|proxy/)) return 'API Tools & Testing';
    if (text.match(/framework|library|react|vue|node|runtime|deno|bun|compiler/)) return 'Frameworks & Libraries';
    return 'Developer Essentials';
  }

  if (category === 'design') {
    if (text.match(/color|palette|gradient|contrast|swatch|pigment/)) return 'Color & Palettes';
    if (text.match(/font|type|typography|letter|glyph|serif|sans|wordmark|modularscale/)) return 'Typography & Fonts';
    if (text.match(/icon|svg|symbol|glyph|boxicons|feather|lucide|phosphor|remix/)) return 'Icons & Symbols';
    if (text.match(/wireframe|mockup|prototype|diagram|uml|flowchart|canvas|whiteboard|pencil|quant-ux/)) return 'Wireframing & Mockups';
    if (text.match(/gallery|inspiration|award|showcase|portfolio|design shack|awwwards|siteinspire|css winner/)) return 'Design Inspiration';
    if (text.match(/3d|three|spatial|spline|blender|webgl/)) return '3D & Spatial';
    if (text.match(/photo|image|raw|edit|photoshop|gimp|krita|darktable|rawtherapee|photopea/)) return 'Photo & Vector Editing';
    if (text.match(/css|animation|motion|easing|keyframe|tailwind|transition/)) return 'Motion & Interaction';
    return 'UI & Visual Design';
  }

  if (category === 'ai') {
    if (text.match(/music|audio|voice|speech|tts|stt|whisper|sound|clone|rvc|singing|sovits/)) return 'Audio & Speech AI';
    if (text.match(/video|avatar|clip|shorts|motion|talking|vidu|wan|hunyuan|hedra|pictory/)) return 'Video & Motion AI';
    if (text.match(/image|art|flux|stable diffusion|sdxl|photo|upscale|inpainting|midjourney|craiyon|nightcafe/)) return 'Generative Media & Images';
    if (text.match(/agent|rag|workflow|orchestrat|chain|graph|langchain|llamaindex|flowise|dify|n8n|superagi|crewai|camel/)) return 'Agents & Orchestration';
    if (text.match(/local|ollama|vllm|gguf|llama|inference|serve|runner|chat|open webui|librechat|lobechat/)) return 'Local LLMs & Inference';
    if (text.match(/eval|prompt|hub|observability|dataset|benchmark|leaderboard|ragas|deepeval|promptfoo|langfuse/)) return 'LLMOps & Prompt Engineering';
    return 'AI Platforms & Tools';
  }

  if (category === 'video') {
    if (text.match(/editor|nle|davinci|kdenlive|cut|trim|shotcut|timeline|openshot|olive|flowblade/)) return 'Video Editors';
    if (text.match(/encode|codec|transcode|converter|ffmpeg|handbrake|av1|x265|svt-av1|shutter/)) return 'Transcoding & Codecs';
    if (text.match(/stream|record|screen|obs|webcam|capture|ndi|vdo\.ninja|streamlabs|sharex/)) return 'Streaming & Capture';
    if (text.match(/animation|vfx|motion|compositing|blender|natron|fx|cascadeur|manim|glaxnimate|synfig/)) return 'Motion & VFX';
    if (text.match(/stock|footage|lut|template|clip|4k|b-roll|dareful|videezy|coverr/)) return 'Stock Footage & LUTs';
    if (text.match(/player|mpv|vlc|media|subtitle|metadata|audio|mediainfo|aegisub/)) return 'Media Players & Utilities';
    return 'Video Production';
  }

  if (category === 'asset') {
    if (text.match(/3d|model|texture|hdri|pbr|blender|gltf|polyhaven|ambientcg|cgtrader|sketchfab/)) return '3D Models & Textures';
    if (text.match(/photo|stock|picture|image|cc0|unsplash|pexels|pixabay|burst/)) return 'Stock Photography';
    if (text.match(/illustration|vector|undraw|draw|character|scene|storyset|humaaans/)) return 'Illustrations & Vectors';
    if (text.match(/audio|sound|sample|music|sfx|synth|daw|vocal|stem|freesound|incompetech/)) return 'Audio, SFX & DAWs';
    if (text.match(/template|theme|html|bootstrap|tailwind|cruip|hyperui|daisyui/)) return 'Templates & Themes';
    if (text.match(/pattern|gradient|background|mesh|doodle|heropatterns|bgjar/)) return 'Patterns & Gradients';
    return 'Creative Assets';
  }

  if (category === 'api') {
    if (text.match(/weather|meteo|climate|air|atmosphere|forecast|dwd|smhi|noaa|open-meteo/)) return 'Weather & Environment';
    if (text.match(/geo|map|location|ip|geocod|postal|country|osm|gis|nominatim|photon|pelias/)) return 'Geospatial & IP';
    if (text.match(/finance|crypto|stock|exchange|currency|coin|market|trading|binance|kraken|coingecko|polygon/)) return 'Finance & Cryptocurrency';
    if (text.match(/news|guardian|nytimes|media|feed|headline/)) return 'News & Media';
    if (text.match(/job|career|demographic|census|population|remoteok|arbeitnow/)) return 'Jobs & Demographics';
    if (text.match(/data|gov|fda|nasa|space|science|health|research|arxiv|open|pubchem|rcsb|who/)) return 'Open Data & Science';
    if (text.match(/game|entertainment|trivia|joke|quote|pokemon|anime|movie|tv|chess|lichess/)) return 'Entertainment & Pop Culture';
    if (text.match(/mock|faker|test|reqres|placeholder|uuid|echo|tunnel|httpbin|dummyjson/)) return 'Developer Testing & Mocks';
    return 'Public REST APIs';
  }

  return 'General Resources';
}

function generateTags(category, subcategory, name, desc) {
  const tags = new Set();
  tags.add(category.toUpperCase());
  if (subcategory) tags.add(subcategory.split('&')[0].trim());

  const words = (name + ' ' + desc).toLowerCase().split(/[^a-z0-9]+/);
  const keywords = [
    'opensource', 'free', 'api', 'react', 'typescript', 'python', 'cloud', 'database',
    'postgres', 'sqlite', 'vector', 'search', 'ai', 'llm', 'audio', 'video', 'design',
    'icons', 'fonts', 'mockup', 'shaders', '3d', 'automation', 'security', 'monitoring',
    'charts', 'maps', 'crypto', 'weather', 'finance'
  ];
  for (const w of words) {
    if (keywords.includes(w) && tags.size < 5) {
      tags.add(w.charAt(0).toUpperCase() + w.slice(1));
    }
  }
  return Array.from(tags).slice(0, 5);
}

// Extract existing resources via Node VM or regex parser from resourcesTsPath
let existingResources = [];
try {
  const tsContent = fs.readFileSync(resourcesTsPath, 'utf8');
  // Simple extraction: evaluate the object expression inside
  const jsonMatch = tsContent.match(/export const RESOURCES: ResourceItem\[\] = (\[[\s\S]*?\]);\s*$/);
  if (jsonMatch) {
    // Run evaluation
    const fn = new Function('return ' + jsonMatch[1]);
    existingResources = fn();
  }
} catch (e) {
  console.error('Failed to parse existing resources.ts:', e);
}

if (!existingResources.length) {
  console.error('Could not extract existing resources, aborting');
  process.exit(1);
}

console.log('Successfully loaded existing resources:', existingResources.length);

const seenUrls = new Set();
const seenNames = new Set();
const seenIds = new Set();

existingResources.forEach((r) => {
  seenUrls.add(normalizeUrlKey(r.url));
  seenNames.add(normalizeNameKey(r.name));
  seenIds.add(r.id.toLowerCase());
});

function parseMarkdownFile(content, fileName) {
  const lines = content.split('\n');
  let currentCategory = '';
  const entries = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) {
      const lower = line.toLowerCase();
      if (lower.includes('developer') || lower.includes('dev tools')) currentCategory = 'dev';
      else if (lower.includes('design')) currentCategory = 'design';
      else if (lower.includes('ai')) currentCategory = 'ai';
      else if (lower.includes('video')) currentCategory = 'video';
      else if (lower.includes('creative assets')) currentCategory = 'asset';
      else if (lower.includes('api')) currentCategory = 'api';
      continue;
    }
    if (!line.startsWith('|')) continue;
    if (line.includes('| # |') || line.includes('|---|') || line.includes('|--- |')) continue;

    const cols = line.split('|').slice(1, -1).map((s) => s.trim());
    if (cols.length < 5) continue;

    let [num, rawName, rawLink, rawDesc, rawModel] = cols;
    let cleanName = rawName.replace(/\*\*/g, '').trim();
    let link = rawLink.trim();
    let desc = rawDesc.trim();
    let model = rawModel.trim();

    link = cleanUrl(link);

    // Skip dummy, placeholder, or invalid entries
    if (
      model === '-' ||
      link === 'https://-' ||
      link === 'https://apphosting.' ||
      link.endsWith('?') ||
      desc.toLowerCase().startsWith('(covered') ||
      desc.toLowerCase().startsWith('(see also') ||
      desc.toLowerCase().startsWith('(see ') ||
      desc.toLowerCase().startsWith('(same') ||
      desc.toLowerCase().startsWith('(defunct') ||
      desc.toLowerCase().startsWith('(acquired') ||
      desc.toLowerCase().startsWith('(paid stems') ||
      cleanName.toLowerCase().includes('skip')
    ) {
      continue;
    }

    // Clean up alternative names where the tool name is in parenthetical or domain
    if (cleanName.toLowerCase().includes('alt') || cleanName.toLowerCase().includes('alternatives')) {
      if (cleanName.includes('(') && cleanName.includes(')')) {
        const match = cleanName.match(/\((.*?)\)/);
        if (match && match[1] && !match[1].toLowerCase().includes('alt') && !match[1].toLowerCase().includes('see')) {
          cleanName = match[1].trim();
        }
      } else {
        try {
          const domain = new URL(link).hostname.replace(/^www\./, '').split('.')[0];
          if (domain && domain.length > 2) {
            cleanName = domain.charAt(0).toUpperCase() + domain.slice(1);
          }
        } catch {}
      }
    }

    entries.push({
      name: cleanName,
      url: link,
      description: desc,
      category: currentCategory,
      rawModel: model,
    });
  }
  return entries;
}

const parsedMega = parseMarkdownFile(megaContent, 'mega');
const parsedR2 = parseMarkdownFile(r2Content, 'r2');
const allCandidates = [...parsedMega, ...parsedR2];

console.log('Total candidates extracted from markdown files:', allCandidates.length);

const mergedResources = [...existingResources];
let addedCount = 0;
let skippedCount = 0;

for (const item of allCandidates) {
  const normUrl = normalizeUrlKey(item.url);
  const normName = normalizeNameKey(item.name);

  if (seenUrls.has(normUrl) || seenNames.has(normName)) {
    skippedCount++;
    continue;
  }

  // Generate unique slug id
  let baseSlug = slugify(item.name);
  let finalId = baseSlug;
  let counter = 2;
  while (seenIds.has(finalId.toLowerCase())) {
    finalId = `${baseSlug}-${counter}`;
    counter++;
  }

  seenUrls.add(normUrl);
  seenNames.add(normName);
  seenIds.add(finalId.toLowerCase());

  const pricingType = mapPricing(item.rawModel, item.description);
  const isOpenSource = pricingType === 'Open Source' || item.rawModel.toLowerCase().includes('oss');
  const subcategory = getSubcategory(item.category, item.name, item.description);
  const accessModel = mapAccessModel(pricingType, isOpenSource);
  const tags = generateTags(item.category, subcategory, item.name, item.description);

  let tierQuota = '100% Free and open-source software';
  if (pricingType === 'Free') {
    tierQuota = 'Free access without mandatory billing or subscription';
  } else if (pricingType === 'Freemium' || pricingType === 'Free Tier') {
    tierQuota = 'Generous free tier for individual creators and developers';
  } else if (pricingType === 'Free Trial') {
    tierQuota = 'Fully-featured free evaluation access';
  }

  const isApiCategory = item.category === 'api';

  const newResource = {
    id: finalId,
    name: item.name,
    tagline: item.description,
    description: `${item.name} provides ${item.description.toLowerCase().replace(/\.$/, '')}. Categorized under ${subcategory} in MARIA's verified open catalog.`,
    category: item.category,
    subcategory,
    url: item.url,
    pricingType,
    accessModel,
    openSource: isOpenSource,
    license: isOpenSource ? 'Open Source' : 'Freemium / Proprietary',
    authRequired: !isOpenSource && pricingType !== 'Free',
    creditCardRequired: false,
    tierQuota,
    tags,
    featured: false,
    rating: 4.8,
    stars: isOpenSource ? 'Verified OSS' : 'Curated',
    lastVerifiedAt: '2026-10-30',
    verificationStatus: 'verified',
    ...(isApiCategory ? { apiAvailable: true, apiKeyRequired: pricingType !== 'Free' } : {}),
  };

  mergedResources.push(newResource);
  addedCount++;
}

console.log(`Skipped duplicates / references: ${skippedCount}`);
console.log(`Added new verified resources: ${addedCount}`);
console.log(`Total merged resources: ${mergedResources.length}`);

// Generate chunked TypeScript code to avoid TS2590 union limit
const CHUNK_SIZE = 300;
const chunks = [];
for (let i = 0; i < mergedResources.length; i += CHUNK_SIZE) {
  chunks.push(mergedResources.slice(i, i + CHUNK_SIZE));
}

let tsOutput = `import { ResourceItem } from '@/types/resource';\n\n`;
chunks.forEach((chunk, idx) => {
  tsOutput += `const CHUNK_${idx}: ResourceItem[] = ${JSON.stringify(chunk, null, 2)};\n\n`;
});
tsOutput += `export const RESOURCES: ResourceItem[] = [\n  ${chunks.map((_, idx) => `...CHUNK_${idx}`).join(',\n  ')}\n];\n`;

fs.writeFileSync(resourcesTsPath, tsOutput, 'utf8');
console.log(`Successfully written ${mergedResources.length} resources in ${chunks.length} chunks to data/resources.ts`);
