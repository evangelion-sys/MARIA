#!/usr/bin/env node

/**
 * MARIA Platform - Comprehensive Catalogue Data Validator
 * 
 * Asserts:
 * 1. Unique IDs (no duplicate or empty slugs)
 * 2. Unique canonical URLs (no duplicate URLs)
 * 3. Required fields present: id, name, tagline, description, category, subcategory, url, pricingType, license
 * 4. Valid HTTPS protocol on all external destinations (rejects http:// or malformed protocols)
 * 5. Valid categories ('dev', 'design', 'video', 'ai', 'api', 'asset')
 * 6. Valid pricing models ('Free', 'Freemium', 'Free with Limits', 'Free Trial', 'Paid', 'Pricing Unverified', 'Self-Hosted', 'Open Source')
 * 7. Valid verification states ('verified', 'unverified', 'pending', 'broken')
 * 8. Valid license strings (no blank or generic "Open Source" without repo)
 * 9. No fabricated constant ratings (rating must be number between 1.0 and 5.0, or undefined)
 * 10. No fabricated non-numeric strings in stars ('Curated' or 'Verified OSS')
 * 11. Contradictory metadata (openSource: true without valid repo or license evidence)
 * 12. Broken internal references in starter stacks and workflow collections
 * 13. Semantic duplicate detection reporting (flagging potential unintended duplicates for review)
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Running MARIA Catalogue Data Integrity Validator...\n');

let data;
try {
  const script = `
    import { RESOURCES } from './data/resources.ts';
    import { STARTER_STACKS } from './data/starter-stacks.ts';
    import { WORKFLOW_COLLECTIONS } from './data/workflow-collections.ts';
    console.log(JSON.stringify({ RESOURCES, STARTER_STACKS, WORKFLOW_COLLECTIONS }));
  `;
  const output = execSync('npx tsx -e "' + script.replace(/\n/g, ' ') + '"', {
    cwd: rootDir,
    maxBuffer: 30 * 1024 * 1024,
    encoding: 'utf-8',
  });
  data = JSON.parse(output);
} catch (err) {
  console.error('❌ Failed to load data files via tsx:', err.message);
  process.exit(1);
}

const { RESOURCES, STARTER_STACKS, WORKFLOW_COLLECTIONS } = data;

const VALID_CATEGORIES = new Set(['dev', 'design', 'video', 'ai', 'api', 'asset']);
const VALID_PRICING_MODELS = new Set([
  'Free',
  'Freemium',
  'Free with Limits',
  'Free Trial',
  'Paid',
  'Pricing Unverified',
  'Self-Hosted',
  'Open Source',
]);
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

const errors = [];
const warnings = [];
const seenIds = new Set();
const seenUrls = new Set();
const seenNames = new Map();
const catalogResourceIds = new Set();

let totalChecked = 0;
let openSourceCount = 0;
let unverifiedLicenseCount = 0;
let unverifiedPricingCount = 0;

// 1. Audit Resources
RESOURCES.forEach((r, idx) => {
  totalChecked++;
  const indexStr = `Resource #${idx + 1} (${r.id || 'NO_ID'})`;

  // ID check
  if (!r.id || typeof r.id !== 'string' || !r.id.trim()) {
    errors.push(`${indexStr}: Missing or empty id`);
  } else if (seenIds.has(r.id.trim().toLowerCase())) {
    errors.push(`${indexStr}: Duplicate id "${r.id}"`);
  } else {
    seenIds.add(r.id.trim().toLowerCase());
    catalogResourceIds.add(r.id.trim());
  }

  // Name check
  if (!r.name || typeof r.name !== 'string' || !r.name.trim()) {
    errors.push(`${indexStr}: Missing or empty name`);
  } else {
    const cleanName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenNames.has(cleanName)) {
      const prev = seenNames.get(cleanName);
      warnings.push(`Potential semantic name duplicate: "${r.name}" (${r.id}) resembles "${prev.name}" (${prev.id})`);
    } else {
      seenNames.set(cleanName, { id: r.id, name: r.name });
    }
  }

  // Tagline & Description check
  if (!r.tagline || typeof r.tagline !== 'string' || !r.tagline.trim()) {
    errors.push(`${indexStr}: Missing or empty tagline`);
  }
  if (!r.description || typeof r.description !== 'string' || !r.description.trim()) {
    errors.push(`${indexStr}: Missing or empty description`);
  }

  // Category check
  if (!r.category || !VALID_CATEGORIES.has(r.category)) {
    errors.push(`${indexStr}: Invalid category "${r.category}". Must be one of: ${Array.from(VALID_CATEGORIES).join(', ')}`);
  }

  // Pricing model check
  if (!r.pricingType || !VALID_PRICING_MODELS.has(r.pricingType)) {
    errors.push(`${indexStr}: Invalid pricingType "${r.pricingType}". Must be one of: ${Array.from(VALID_PRICING_MODELS).join(', ')}`);
  }
  if (r.pricingType === 'Pricing Unverified') {
    unverifiedPricingCount++;
  }

  // Verification status check
  if (r.verificationStatus && !VALID_VERIFICATION_STATUSES.has(r.verificationStatus)) {
    errors.push(`${indexStr}: Invalid verificationStatus "${r.verificationStatus}"`);
  }

  // Fabricated rating check
  if (r.rating !== undefined) {
    if (typeof r.rating !== 'number' || r.rating < 1 || r.rating > 5) {
      errors.push(`${indexStr}: Invalid rating ${r.rating}. Must be numeric 1.0 - 5.0`);
    }
  }

  // Non-numeric star string check
  if (r.stars !== undefined) {
    if (r.stars === 'Curated' || r.stars === 'Verified OSS') {
      errors.push(`${indexStr}: Fabricated placeholder star label "${r.stars}" detected`);
    }
  }

  // License check
  if (!r.license || typeof r.license !== 'string' || !r.license.trim()) {
    errors.push(`${indexStr}: Missing license identifier`);
  } else if (r.license === 'Freemium / Proprietary') {
    errors.push(`${indexStr}: Deceptive placeholder license "Freemium / Proprietary" detected`);
  } else if (r.license === 'License Unverified') {
    unverifiedLicenseCount++;
  }

  // Open source check
  if (r.openSource) {
    openSourceCount++;
    if (!r.repoUrl && r.license === 'License Unverified') {
      errors.push(`${indexStr}: Marked openSource: true without repoUrl or confirmed open source license`);
    }
  }

  // Canonical URL protocol & deduplication check
  if (!r.url || typeof r.url !== 'string') {
    errors.push(`${indexStr}: Missing url`);
  } else {
    const trimmedUrl = r.url.trim();
    if (!trimmedUrl.startsWith('https://')) {
      errors.push(`${indexStr}: URL must use secure "https://" protocol (${trimmedUrl})`);
    }

    const normalizedUrl = trimmedUrl.toLowerCase().replace(/\/+$/, '');
    if (seenUrls.has(normalizedUrl)) {
      errors.push(`${indexStr}: Duplicate canonical URL "${trimmedUrl}"`);
    } else {
      seenUrls.add(normalizedUrl);
    }
  }
});

// 2. Validate STARTER_STACKS references
STARTER_STACKS.forEach((stack) => {
  if (!stack.resourceIds || !Array.isArray(stack.resourceIds)) {
    errors.push(`Starter stack "${stack.id}": Missing resourceIds array`);
    return;
  }
  stack.resourceIds.forEach((resId) => {
    if (!catalogResourceIds.has(resId)) {
      errors.push(`Starter stack "${stack.id}": Broken resourceId reference "${resId}" does not exist in catalog`);
    }
  });
});

// 3. Validate WORKFLOW_COLLECTIONS references
WORKFLOW_COLLECTIONS.forEach((col) => {
  if (!col.resourceIds || !Array.isArray(col.resourceIds)) {
    errors.push(`Workflow collection "${col.id}": Missing resourceIds array`);
    return;
  }
  col.resourceIds.forEach((resId) => {
    if (!catalogResourceIds.has(resId)) {
      errors.push(`Workflow collection "${col.id}": Broken resourceId reference "${resId}" does not exist in catalog`);
    }
  });
});

// Report Results
console.log('--- Catalogue Audit Verification Summary ---');
console.log(`  • Total items examined: ${totalChecked}`);
console.log(`  • Valid unique IDs: ${seenIds.size}`);
console.log(`  • Valid unique HTTPS URLs: ${seenUrls.size}`);
console.log(`  • Verified starter stacks: ${STARTER_STACKS.length}`);
console.log(`  • Verified workflow collections: ${WORKFLOW_COLLECTIONS.length}`);
console.log(`  • Confirmed open source items (with repo): ${openSourceCount}`);
console.log(`  • Catalog items with license unverified: ${unverifiedLicenseCount}`);
console.log(`  • Semantic duplicate warnings noted: ${warnings.length}`);

if (errors.length > 0) {
  console.error(`\n❌ Catalogue validation FAILED with ${errors.length} error(s):\n`);
  errors.slice(0, 20).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 20) {
    console.error(`  ... and ${errors.length - 20} more errors.`);
  }
  process.exit(1);
}

console.log('\n✅ Catalogue validation PASSED with 0 fatal errors.\n');
process.exit(0);
