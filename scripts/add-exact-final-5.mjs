import fs from 'node:fs';
import path from 'node:path';

const resourcesPath = path.resolve('./data/resources.json');
const raw = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));

console.log(`Current length: ${raw.length}`);

const existingIds = new Set(raw.map(r => r.id));
const existingUrls = new Set(raw.map(r => r.url.toLowerCase().replace(/\/+$/, '')));

const candidates = [
  {
    name: 'uv',
    url: 'https://astral.sh/uv',
    description: 'An extremely fast Python package and project manager written in Rust, designed as a drop-in replacement for pip and virtualenv.',
    category: 'dev',
    subcategory: 'Developer Tools',
    pricingType: 'free',
    accessModel: 'open_access',
    platforms: ['cli', 'linux', 'macos', 'windows'],
    isOpenSource: true,
    verificationEvidence: {
      documentationUrl: 'https://docs.astral.sh/uv/',
      repositoryUrl: 'https://github.com/astral-sh/uv',
      lastVerifiedDate: '2026-11-01',
      notes: 'Cargo-like package and environment manager for Python by Astral.'
    }
  },
  {
    name: 'Ruff',
    url: 'https://astral.sh/ruff',
    description: 'An extremely fast Python linter and code formatter written in Rust, 10-100x faster than Flake8 and Black.',
    category: 'dev',
    subcategory: 'Developer Tools',
    pricingType: 'free',
    accessModel: 'open_access',
    platforms: ['cli', 'linux', 'macos', 'windows'],
    isOpenSource: true,
    verificationEvidence: {
      documentationUrl: 'https://docs.astral.sh/ruff/',
      repositoryUrl: 'https://github.com/astral-sh/ruff',
      lastVerifiedDate: '2026-11-01',
      notes: 'Industry-standard Python linter and formatter by Astral.'
    }
  },
  {
    name: 'Pydantic',
    url: 'https://docs.pydantic.dev',
    description: 'Data validation and settings management using Python type annotations with core validation logic written in Rust.',
    category: 'dev',
    subcategory: 'Developer Tools',
    pricingType: 'free',
    accessModel: 'open_access',
    platforms: ['linux', 'macos', 'windows'],
    isOpenSource: true,
    verificationEvidence: {
      documentationUrl: 'https://docs.pydantic.dev/latest/',
      repositoryUrl: 'https://github.com/pydantic/pydantic',
      lastVerifiedDate: '2026-11-01',
      notes: 'Most widely used data parsing and validation library in Python.'
    }
  },
  {
    name: 'Sanic',
    url: 'https://sanic.dev',
    description: 'Python 3.8+ web server and web framework that is written to go fast with non-blocking async request handling.',
    category: 'dev',
    subcategory: 'Frameworks',
    pricingType: 'free',
    accessModel: 'open_access',
    platforms: ['web', 'linux'],
    isOpenSource: true,
    verificationEvidence: {
      documentationUrl: 'https://sanic.dev/en/guide/',
      repositoryUrl: 'https://github.com/sanic-org/sanic',
      lastVerifiedDate: '2026-11-01',
      notes: 'Async Python web framework.'
    }
  },
  {
    name: 'ripgrep-all',
    url: 'https://github.com/phiresky/ripgrep-all',
    description: 'CLI search tool that wraps ripgrep to search text in PDFs, E-Books, Office documents, zip files, and tar archives.',
    category: 'dev',
    subcategory: 'Developer Tools',
    pricingType: 'free',
    accessModel: 'open_access',
    platforms: ['cli', 'linux', 'macos'],
    isOpenSource: true,
    verificationEvidence: {
      documentationUrl: 'https://github.com/phiresky/ripgrep-all#readme',
      repositoryUrl: 'https://github.com/phiresky/ripgrep-all',
      lastVerifiedDate: '2026-11-01',
      notes: 'Deep document search CLI tool.'
    }
  }
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

for (const cand of candidates) {
  let id = slugify(cand.name);
  if (existingIds.has(id)) {
    id = id + '-tool';
  }
  const normUrl = cand.url.toLowerCase().replace(/\/+$/, '');
  if (existingUrls.has(normUrl)) {
    console.error(`ERROR: candidate URL already exists: ${cand.url}`);
    process.exit(1);
  }

  const resource = {
    id,
    name: cand.name,
    url: cand.url,
    description: cand.description,
    category: cand.category,
    subcategory: cand.subcategory,
    pricingType: cand.pricingType,
    accessModel: cand.accessModel,
    platforms: cand.platforms,
    isOpenSource: cand.isOpenSource,
    verificationStatus: 'verified',
    verificationEvidence: cand.verificationEvidence,
    addedAt: '2026-11-01T12:00:00Z',
    updatedAt: '2026-11-01T12:00:00Z'
  };

  raw.push(resource);
  existingIds.add(id);
  existingUrls.add(normUrl);
}

console.log(`Final count is now: ${raw.length}`);
if (raw.length !== 2500) {
  console.error(`CRITICAL: Expected exactly 2500, but got ${raw.length}!`);
  process.exit(1);
}

// Compute accurate final stats
const catCounts = {};
let verifiedCount = 0;
let unverifiedCount = 0;
let osCount = 0;

for (const r of raw) {
  catCounts[r.category] = (catCounts[r.category] || 0) + 1;
  if (r.verificationStatus === 'verified') verifiedCount++;
  else unverifiedCount++;
  if (r.isOpenSource) osCount++;
}

console.log('================ FINAL EXACT 2,500 ARCHIVE METRICS ================');
console.log('Total Genuine Resources:', raw.length);
console.log('Verified Resources:', verifiedCount);
console.log('Unverified Resources:', unverifiedCount);
console.log('Open Source Resources:', osCount);
console.log('Category breakdown:', catCounts);

// Write to resources.json
fs.writeFileSync(resourcesPath, JSON.stringify(raw, null, 2), 'utf8');
console.log('✅ Updated data/resources.json');

// Update data/resource-stats.ts
const statsFile = path.resolve('./data/resource-stats.ts');
const statsContent = `// Auto-generated catalogue statistics for MARIA archive
// Computed on: 2026-11-01T12:00:00Z

export const CATALOG_TOTAL_COUNT = ${raw.length} as const;
export const CATALOG_VERIFIED_COUNT = ${verifiedCount} as const;
export const CATALOG_UNVERIFIED_COUNT = ${unverifiedCount} as const;
export const CATALOG_OPEN_SOURCE_COUNT = ${osCount} as const;

export const CATALOG_CATEGORY_COUNTS: Record<string, number> = {
  dev: ${catCounts['dev'] || 0},
  design: ${catCounts['design'] || 0},
  ai: ${catCounts['ai'] || 0},
  video: ${catCounts['video'] || 0},
  asset: ${catCounts['asset'] || 0},
  api: ${catCounts['api'] || 0},
};
`;
fs.writeFileSync(statsFile, statsContent, 'utf8');
console.log('✅ Updated data/resource-stats.ts');

// Update data/resource-ids.ts
const idsFile = path.resolve('./data/resource-ids.ts');
let curIdsContent = fs.readFileSync(idsFile, 'utf8');
const idArrayStr = raw.map(r => `  '${r.id}'`).join(',\n');
const newIdsExport = `export const RESOURCE_IDS = [\n${idArrayStr},\n] as const;`;

curIdsContent = curIdsContent.replace(
  /export const RESOURCE_IDS = \[\s*[\s\S]*?\] as const;/,
  newIdsExport
);
fs.writeFileSync(idsFile, curIdsContent, 'utf8');
console.log('✅ Updated data/resource-ids.ts');
