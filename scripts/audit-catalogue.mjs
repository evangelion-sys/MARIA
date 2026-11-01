import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const rootDir = process.cwd();
const tsRunner = path.join(rootDir, 'scripts/runner.ts');

const tsScript = `
import { RESOURCES } from '../data/resources.ts';
import { STARTER_STACKS } from '../data/starter-stacks.ts';
import { WORKFLOW_COLLECTIONS } from '../data/workflow-collections.ts';

const byCat = {};
const bySub = {};
const byPricing = {};
const byStatus = {};
const byLicense = {};
const placeholderDescriptions = [];

const byDomain = {};

RESOURCES.forEach((r) => {
  byCat[r.category] = (byCat[r.category] || 0) + 1;
  const sub = r.subcategory || 'Unassigned';
  bySub[sub] = (bySub[sub] || 0) + 1;
  byPricing[r.pricingType] = (byPricing[r.pricingType] || 0) + 1;
  const status = r.verificationStatus || 'unspecified';
  byStatus[status] = (byStatus[status] || 0) + 1;
  byLicense[r.license] = (byLicense[r.license] || 0) + 1;

  if (r.description && r.description.includes('Categorized under')) {
    placeholderDescriptions.push(r.id);
  }

  try {
    const d = new URL(r.url).hostname.replace(/^www\\./, '');
    if (!byDomain[d]) byDomain[d] = [];
    byDomain[d].push({ id: r.id, name: r.name, url: r.url });
  } catch (e) {}
});

// Semantic duplicates on non-github domains
const semanticDuplicates = [];
const multi = Object.entries(byDomain).filter(([d, arr]) => arr.length > 1 && d !== 'github.com');

for (const [d, arr] of multi) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i];
      const b = arr[j];
      const normA = a.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normB = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const stripA = normA.replace(/api|engine|portal|platform|cloud|oss|free|freebies|studio|catalog|webportal/, '');
      const stripB = normB.replace(/api|engine|portal|platform|cloud|oss|free|freebies|studio|catalog|webportal/, '');
      if (normA.includes(normB) || normB.includes(normA) || (stripA && stripA === stripB)) {
        semanticDuplicates.push({ domain: d, primary: a, duplicate: b });
      }
    }
  }
}

console.log(JSON.stringify({
  rawCount: RESOURCES.length,
  byCategory: byCat,
  byPricing: byPricing,
  byStatus: byStatus,
  placeholderDescriptionsCount: placeholderDescriptions.length,
  semanticDuplicatesCount: semanticDuplicates.length,
  semanticDuplicates,
  openSourceWithRepo: RESOURCES.filter(r => r.openSource && r.repoUrl).length,
  licenseUnverifiedCount: RESOURCES.filter(r => r.license === 'License Unverified').length,
}, null, 2));
`;

fs.writeFileSync(tsRunner, tsScript);
try {
  const res = execSync('npx tsx scripts/runner.ts', {
    cwd: rootDir,
    maxBuffer: 30 * 1024 * 1024,
    encoding: 'utf-8',
  });
  console.log(res);
} catch (e) {
  console.error('Execution error:', e.message);
} finally {
  if (fs.existsSync(tsRunner)) fs.unlinkSync(tsRunner);
}
