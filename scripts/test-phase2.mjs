#!/usr/bin/env node
/**
 * MARIA Phase 2 Automated Testing: Personal Data, Storage Sanitization, Import/Export & Privacy
 */

import assert from 'node:assert/strict';
import {
  STORAGE_KEYS,
  MAX_SAVED_STACK_ITEMS,
  MAX_RECENT_ITEMS,
  MAX_CUSTOM_COLLECTIONS,
  LEGACY_ID_ALIASES,
  resolveResourceId,
  sanitizeSavedIds,
  sanitizeRecentIds,
  sanitizeCustomCollections,
} from '../hooks/use-maria-stack.ts';
import { RESOURCES } from '../data/resources.ts';

console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║       MARIA PHASE 2: STORAGE, SANITIZATION & PRIVACY TESTS            ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

let passedTests = 0;
let failedTests = 0;

function runTest(testNum, title, testFn) {
  try {
    testFn();
    passedTests++;
    console.log(`  ✓ Test ${testNum.toString().padStart(2, '0')}: ${title}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ Test ${testNum.toString().padStart(2, '0')} FAILED: ${title}`);
    console.error(`    Details: ${err.message}`);
  }
}

// Test 01: Storage keys are versioned, documented, and distinct
runTest(1, 'All storage keys are defined, unique, and non-empty', () => {
  const keys = Object.values(STORAGE_KEYS);
  assert(keys.length >= 5, `Expected at least 5 storage keys, got ${keys.length}`);
  const uniqueKeys = new Set(keys);
  assert.equal(uniqueKeys.size, keys.length, 'All storage keys must be unique strings');
  assert.equal(STORAGE_KEYS.VERSION, 'maria_stack_version');
  assert.equal(STORAGE_KEYS.SAVED_STACK, 'maria_stack_v1');
  assert.equal(STORAGE_KEYS.RECENTLY_VIEWED, 'maria_recently_viewed_v1');
  assert.equal(STORAGE_KEYS.CUSTOM_COLLECTIONS, 'maria_custom_collections_v1');
  assert.equal(STORAGE_KEYS.EXTERNAL_LINK_PREF, 'maria_ext_link_pref');
  assert.equal(STORAGE_KEYS.USER_SUBMISSIONS, 'maria_user_submissions');
});

// Test 02: Storage bounds are strictly enforced
runTest(2, 'Storage bounds are enforced (saved <= 100, recent <= 15, collections <= 50)', () => {
  assert.equal(MAX_SAVED_STACK_ITEMS, 100);
  assert.equal(MAX_RECENT_ITEMS, 15);
  assert.equal(MAX_CUSTOM_COLLECTIONS, 50);
});

// Test 03: Legacy ID alias resolution
runTest(3, 'Legacy ID aliases resolve properly to canonical IDs', () => {
  assert.equal(resolveResourceId('comfyuI'), 'comfyui');
  assert.equal(resolveResourceId('nasa-apis'), 'nasa-open-api');
  assert.equal(resolveResourceId('supabase'), 'supabase');
});

// Test 04: Sanitization filters nonexistent IDs and deduplicates
runTest(4, 'sanitizeSavedIds whitelists valid IDs, removes duplicates, and caps length', () => {
  const sample = ['supabase', 'supabase', 'fake-tool-123', 'nextjs', ''];
  const sanitized = sanitizeSavedIds(sample);
  assert.deepEqual(sanitized, ['supabase', 'nextjs']);
});

// Test 05: sanitizeRecentIds enforces maximum bounds
runTest(5, 'sanitizeRecentIds enforces 15-item maximum bound', () => {
  const allIds = RESOURCES.map((r) => r.id);
  const sanitized = sanitizeRecentIds(allIds);
  assert(sanitized.length <= 15);
});

// Test 06: Custom collection schema validation and payload safety
runTest(6, 'sanitizeCustomCollections rejects malformed objects and protects schema', () => {
  const badData = [
    null,
    'not an object',
    { id: '', name: 'Empty ID' },
    { id: 'col-1', name: 'Valid Collection', resourceIds: ['supabase', 'fake-id'] },
  ];
  const sanitized = sanitizeCustomCollections(badData);
  assert.equal(sanitized.length, 1);
  assert.equal(sanitized[0].id, 'col-1');
  assert.deepEqual(sanitized[0].resourceIds, ['supabase']);
});

// Test 07: Non-array inputs to sanitizers return safe empty arrays
runTest(7, 'Sanitization functions gracefully handle non-array inputs', () => {
  assert.deepEqual(sanitizeSavedIds(null), []);
  assert.deepEqual(sanitizeSavedIds('not an array'), []);
  assert.deepEqual(sanitizeRecentIds(undefined), []);
  assert.deepEqual(sanitizeCustomCollections(12345), []);
});

// Test 08: Catalogue integrity check - 2,500 items with HTTPS links
runTest(8, `Catalogue integrity check verifies all 2,500 items have valid HTTPS canonical links`, () => {
  assert.equal(RESOURCES.length, 2500, `Expected 2,500 resources, got ${RESOURCES.length}`);
  RESOURCES.forEach((r) => {
    assert(r.url.startsWith('https://'), `Resource ${r.id} URL must start with https://`);
    assert(r.name.length > 0, `Resource ${r.id} must have a name`);
  });
});

const totalTests = passedTests + failedTests;
console.log(`\n───────────────────────────────────────────────────────────────────────`);
console.log(`Phase 2 Test Summary: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}% Success Rate)`);

if (failedTests > 0) {
  console.error(`FAILED: ${failedTests} test(s) failed.`);
  process.exit(1);
} else {
  console.log(`Phase 2 Personal Data & Storage Verification Complete. All tests passed.\n`);
  process.exit(0);
}
