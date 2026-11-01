#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const resourcesTsPath = path.join(rootDir, 'data/resources.ts');
const resourceIdsPath = path.join(rootDir, 'data/resource-ids.ts');
const resourceStatsPath = path.join(rootDir, 'data/resource-stats.ts');

// Import current resources using tsx
import { execSync } from 'child_process';
const script = `
  import { RESOURCES } from './data/resources.ts';
  console.log(JSON.stringify(RESOURCES));
`;
const output = execSync('npx tsx -e "' + script.replace(/\n/g, ' ') + '"', {
  cwd: rootDir,
  maxBuffer: 30 * 1024 * 1024,
  encoding: 'utf-8',
});
const resources = JSON.parse(output);

console.log(`Loaded ${resources.length} resources for remediation...`);

const genericQuotas = new Set([
  'Generous free tier for individual creators and developers',
  'Verified perpetual free access',
  'Fully-featured free evaluation access',
  'Free access without mandatory billing or subscription',
  'Free access without mandatory billing or subscription.',
  'Generous free tier for individual creators and developers.',
]);

let fakeRatingsRemoved = 0;
let fakeStarsRemoved = 0;
let fakeDatesRemoved = 0;
let unverifiedLicensesCleaned = 0;
let unverifiedQuotasCleaned = 0;
let creditCardUpdated = 0;

const remediated = resources.map((item) => {
  const r = { ...item };

  // 1. Remove fabricated 4.8 ratings
  if (r.rating !== undefined) {
    delete r.rating;
    fakeRatingsRemoved++;
  }

  // 2. Remove fabricated star placeholders ('Curated', 'Verified OSS')
  if (r.stars === 'Curated' || r.stars === 'Verified OSS') {
    delete r.stars;
    fakeStarsRemoved++;
  }

  // 3. Truthful pricing classification (Section 3)
  if (r.pricingType === 'Free Tier') {
    r.pricingType = 'Freemium';
  }

  // 4. Truthful verification status
  if (!r.verificationEvidence) {
    r.verificationStatus = 'unverified';
    if (r.lastVerifiedAt === '2026-10-30') {
      delete r.lastVerifiedAt;
      fakeDatesRemoved++;
    }
  } else {
    r.verificationStatus = 'verified';
  }

  // 4. Truthful licensing
  if (r.license === 'Freemium / Proprietary') {
    r.license = 'License Unverified';
    unverifiedLicensesCleaned++;
  } else if (r.license === 'Open Source') {
    if (!r.repoUrl) {
      r.license = 'License Unverified';
      r.openSource = false;
      unverifiedLicensesCleaned++;
    }
  }

  // 5. Truthful pricing quotas
  if (r.tierQuota && genericQuotas.has(r.tierQuota)) {
    r.tierQuota = 'Tier limits unverified';
    unverifiedQuotasCleaned++;
  }

  // 6. Truthful creditCardRequired
  // Blank false should not be asserted for unresearched services
  if (r.openSource) {
    r.creditCardRequired = false;
  } else if (!r.authRequired && r.pricingType === 'Free') {
    r.creditCardRequired = false;
  } else if (r.creditCardRequired === false && !r.verificationEvidence) {
    r.creditCardRequired = 'unverified';
    creditCardUpdated++;
  }

  // 7. Clarify semantic duplicates
  if (r.id === 'gemini-api') {
    r.name = 'Gemini Crypto Exchange API';
    r.tagline = 'REST and WebSocket API for the Gemini cryptocurrency exchange';
    r.description = 'Public market data and private trading endpoints for Gemini Trust Company cryptocurrency platform. Note: Not affiliated with Google Gemini AI.';
  } else if (r.id === 'google-gemini-api') {
    r.name = 'Google Gemini API';
    r.tagline = 'Multimodal generative AI developer API via Google AI Studio';
    r.description = 'Official developer endpoints for Google Gemini multimodal models, function calling, structured outputs, and embeddings.';
  } else if (r.id === 'open-food-facts-2') {
    r.name = 'Open Food Facts (Web Portal)';
    r.tagline = 'Open collaborative food database web portal';
    r.description = 'Community web portal interface for searching food ingredients, allergens, and nutrition facts from around the world.';
  } else if (r.id === 'open-food-facts') {
    r.name = 'Open Food Facts API';
    r.tagline = 'JSON/REST API for global food products database';
    r.description = 'Programmatic REST API for querying food product barcodes, nutrition grades, and ingredient data.';
  } else if (r.id === 'nominatim-osm') {
    r.name = 'Nominatim (OSM Hosted API)';
    r.tagline = 'Public hosted geocoding API by OpenStreetMap';
    r.description = 'Hosted Nominatim search and reverse geocoding API running on OpenStreetMap foundation infrastructure under fair-use limits.';
  } else if (r.id === 'nominatim') {
    r.name = 'Nominatim Geocoding Engine';
    r.tagline = 'Open-source geocoding engine for OpenStreetMap data';
    r.description = 'Self-hostable open-source search engine that indexes OpenStreetMap geographical data for forward and reverse geocoding.';
  } else if (r.id === 'world-bank') {
    r.name = 'World Bank Open Data Portal';
    r.tagline = 'Global economic and development data web portal';
    r.description = 'Interactive web directory providing free and open access to global development statistics and publications.';
  } else if (r.id === 'world-bank-api') {
    r.name = 'World Bank Open Data API';
    r.tagline = 'REST API for World Bank global development indicators';
    r.description = 'Programmatic API offering access to World Bank historical indicators, country datasets, and financial project data.';
  } else if (r.id === 'open-library') {
    r.name = 'Open Library Book Catalog';
    r.tagline = 'Open, editable library catalog of millions of book records';
    r.description = 'Open Library web portal initiative by the Internet Archive to create a webpage for every book ever published.';
  } else if (r.id === 'open-library-api') {
    r.name = 'Open Library REST APIs';
    r.tagline = 'Programmatic book data and covers API';
    r.description = 'Free JSON endpoints to search for books by ISBN, OCLC, or title, and retrieve high-resolution book cover images.';
  } else if (r.id === 'playcanvas') {
    r.name = 'PlayCanvas WebGL Engine';
    r.category = 'design';
    r.subcategory = '3D & WebGL';
    r.tagline = 'Open-source WebGL/WebGPU 3D graphics and game engine';
  } else if (r.id === 'playcanvas-2') {
    r.name = 'PlayCanvas Cloud Studio';
    r.category = 'design';
    r.subcategory = '3D & WebGL';
    r.tagline = 'Collaborative browser-based 3D visual editor and development environment';
    r.description = 'Web-based visual workspace for building WebGL/WebGPU interactive 3D experiences with real-time multi-user editing.';
  } else if (r.id === 'coder') {
    r.name = 'Coder Enterprise';
    r.tagline = 'Self-hosted developer workspace platform for enterprise engineering teams';
  } else if (r.id === 'coder-oss') {
    r.name = 'Coder OSS';
    r.tagline = 'Open-source core for remote developer workspaces on Linux servers';
  } else if (r.id === 'sentry') {
    r.name = 'Sentry Cloud';
    r.tagline = 'Application error monitoring and performance tracking cloud platform';
  } else if (r.id === 'sentry-oss') {
    r.name = 'Sentry OSS';
    r.tagline = 'Self-hostable open-source error tracking and performance monitoring codebase';
  } else if (r.id === 'tenor') {
    r.name = 'Tenor GIF Platform';
    r.tagline = 'Search engine and directory for animated GIFs and short video clips';
  } else if (r.id === 'tenor-api') {
    r.name = 'Tenor API';
    r.tagline = 'Developer API for integrating GIF search into web and mobile applications';
  }

  return r;
});

console.log('Remediation Statistics:');
console.log(`  - Fake ratings removed: ${fakeRatingsRemoved}`);
console.log(`  - Fake star placeholders removed: ${fakeStarsRemoved}`);
console.log(`  - Fake verification dates removed: ${fakeDatesRemoved}`);
console.log(`  - Unverified licenses labeled: ${unverifiedLicensesCleaned}`);
console.log(`  - Generic quotas labeled unverified: ${unverifiedQuotasCleaned}`);
console.log(`  - Credit card blanket false updated to unverified: ${creditCardUpdated}`);

// Generate chunked data/resources.ts
const CHUNK_SIZE = 300;
const chunks = [];
for (let i = 0; i < remediated.length; i += CHUNK_SIZE) {
  chunks.push(remediated.slice(i, i + CHUNK_SIZE));
}

let tsOutput = `import { ResourceItem } from '@/types/resource';\n\n`;
chunks.forEach((chunk, idx) => {
  tsOutput += `const CHUNK_${idx}: ResourceItem[] = ${JSON.stringify(chunk, null, 2)};\n\n`;
});
tsOutput += `export const RESOURCES: ResourceItem[] = [\n  ${chunks.map((_, idx) => `...CHUNK_${idx}`).join(',\n  ')}\n];\n`;

fs.writeFileSync(resourcesTsPath, tsOutput, 'utf8');
console.log(`Updated data/resources.ts (${remediated.length} items)`);

// Generate data/resource-ids.ts
const idsContent = `export const TOTAL_CATALOG_RESOURCES = ${remediated.length};\nexport const RESOURCE_IDS: string[] = ${JSON.stringify(remediated.map(r => r.id))};\n`;
fs.writeFileSync(resourceIdsPath, idsContent, 'utf8');
console.log(`Updated data/resource-ids.ts`);

// Generate lightweight data/resource-stats.ts for fast imports without loading 1.5MB resources.ts
const openSourceCount = remediated.filter(r => r.openSource).length;
const categoriesCount = new Set(remediated.map(r => r.category)).size;
const statsContent = `export const CATALOG_TOTAL_COUNT = ${remediated.length};\nexport const CATALOG_CATEGORIES_COUNT = ${categoriesCount};\nexport const CATALOG_OPEN_SOURCE_COUNT = ${openSourceCount};\nexport const CATALOG_LAST_AUDITED = "2026-10-31";\n`;
fs.writeFileSync(resourceStatsPath, statsContent, 'utf8');
console.log(`Generated data/resource-stats.ts`);
