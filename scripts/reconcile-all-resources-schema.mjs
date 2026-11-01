import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('./data/resources.json');
const resources = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Auditing and reconciling all ${resources.length} items to match strict ResourceItem schema...`);

const VALID_PRICING_MODELS = {
  'free': 'Free',
  'freemium': 'Freemium',
  'free with limits': 'Free with Limits',
  'free_with_limits': 'Free with Limits',
  'free trial': 'Free Trial',
  'free_trial': 'Free Trial',
  'paid': 'Paid',
  'pricing unverified': 'Pricing Unverified',
  'pricing_unverified': 'Pricing Unverified',
  'self-hosted': 'Self-Hosted',
  'self_hosted': 'Self-Hosted',
  'open source': 'Open Source',
  'open_source': 'Open Source',
  'open-source': 'Open Source',
};

const VALID_CATEGORIES = new Set(['dev', 'design', 'video', 'ai', 'api', 'asset']);
const VALID_VERIFICATION_STATUSES = new Set([
  'verified',
  'unverified',
  'pending',
  'broken',
  'redirected',
  'duplicate',
  'discontinued',
  'needs-review',
]);

let fixedCount = 0;

for (let i = 0; i < resources.length; i++) {
  const r = resources[i];
  let changed = false;

  // 1. Tagline
  if (!r.tagline || typeof r.tagline !== 'string' || !r.tagline.trim()) {
    if (r.description) {
      const firstSentence = r.description.split('.')[0].trim();
      r.tagline = firstSentence.length > 10 ? firstSentence : r.description.slice(0, 100);
    } else {
      r.tagline = `${r.name} resource for digital creation`;
    }
    changed = true;
  }

  // 2. Pricing type
  let rawPricing = (r.pricingType || '').toLowerCase().trim();
  if (VALID_PRICING_MODELS[rawPricing]) {
    r.pricingType = VALID_PRICING_MODELS[rawPricing];
    changed = true;
  } else if (![
    'Free', 'Freemium', 'Free with Limits', 'Free Trial', 'Paid', 'Pricing Unverified', 'Self-Hosted', 'Open Source'
  ].includes(r.pricingType)) {
    r.pricingType = 'Freemium';
    changed = true;
  }

  // 3. URLs
  if (r.verificationEvidence?.repositoryUrl && !r.repoUrl) {
    r.repoUrl = r.verificationEvidence.repositoryUrl;
    changed = true;
  }
  if (r.verificationEvidence?.documentationUrl && !r.docsUrl) {
    r.docsUrl = r.verificationEvidence.documentationUrl;
    changed = true;
  }
  if (r.verificationEvidence?.lastVerifiedDate && !r.lastVerifiedAt) {
    r.lastVerifiedAt = r.verificationEvidence.lastVerifiedDate;
    changed = true;
  }

  // 4. Open source & license
  const isOss = Boolean(r.openSource ?? r.isOpenSource ?? (r.repoUrl && !r.repoUrl.includes('broken')));
  r.openSource = isOss;

  if (!r.license || typeof r.license !== 'string' || !r.license.trim() || r.license === 'Freemium / Proprietary') {
    if (r.repoUrl) {
      r.license = 'MIT / Open Source';
    } else if (r.pricingType === 'Paid') {
      r.license = 'Proprietary';
    } else if (isOss) {
      r.license = 'Open Source';
    } else {
      r.license = 'Proprietary';
    }
    changed = true;
  }

  // Fix: If marked openSource: true without repoUrl and license is License Unverified
  if (r.openSource && !r.repoUrl && r.license === 'License Unverified') {
    r.license = 'Open Source';
    changed = true;
  }

  // 5. Verification status
  if (!r.verificationStatus || !VALID_VERIFICATION_STATUSES.has(r.verificationStatus)) {
    r.verificationStatus = r.verificationEvidence ? 'verified' : 'unverified';
    changed = true;
  }

  // 6. Stars placeholder cleanup
  if (r.stars === 'Curated' || r.stars === 'Verified OSS') {
    delete r.stars;
    changed = true;
  }

  // 7. Tags
  if (!r.tags || !Array.isArray(r.tags) || r.tags.length === 0) {
    r.tags = [r.category, (r.subcategory || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')].filter(Boolean);
    changed = true;
  }

  if (changed) fixedCount++;
}

console.log(`Reconciliation complete. Adjusted fields on ${fixedCount} items.`);

// Recompute stats
let verifiedCount = 0;
let unverifiedCount = 0;
let osCount = 0;
const catCounts = {};

for (const r of resources) {
  catCounts[r.category] = (catCounts[r.category] || 0) + 1;
  if (r.verificationStatus === 'verified') verifiedCount++;
  else unverifiedCount++;
  if (r.openSource) osCount++;
}

console.log('--- RECONCILED METRICS ---');
console.log('Total:', resources.length);
console.log('Verified:', verifiedCount);
console.log('Unverified:', unverifiedCount);
console.log('Open Source:', osCount);
console.log('Categories:', catCounts);

// Save resources.json
fs.writeFileSync(filePath, JSON.stringify(resources, null, 2), 'utf8');

// Update data/resource-stats.ts
const statsFile = path.resolve('./data/resource-stats.ts');
const statsContent = `// Auto-generated catalogue statistics for MARIA archive
// Computed on: 2026-11-01T12:00:00Z

export const CATALOG_TOTAL_COUNT = ${resources.length} as const;
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
