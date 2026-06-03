/**
 * Validates that all platform CSP headers match the centralized source.
 * Run as: pnpm validate:csp
 */

import { readFileSync } from 'node:fs';

import { CSP_VALUE } from '../src/lib/constants/security-headers.ts';

const root = new URL('../', import.meta.url);

function readJson(path: string) {
  return JSON.parse(readFileSync(new URL(path, root), 'utf-8'));
}

function readToml(path: string) {
  return readFileSync(new URL(path, root), 'utf-8');
}

let valid = true;

// Check vercel.json
const vercel = readJson('vercel.json');
const vercelCsp = vercel.headers[0].headers.find(
  (h: { key: string }) => h.key === 'Content-Security-Policy'
).value;

if (vercelCsp !== CSP_VALUE) {
  console.error('❌ vercel.json CSP does not match source of truth');
  console.error('  Expected:', CSP_VALUE);
  console.error('  Got:     ', vercelCsp);
  valid = false;
}

// Check netlify.toml
const netlify = readToml('netlify.toml');
const netlifyCspMatch = netlify.match(/Content-Security-Policy = "(.+)"/);
if (!netlifyCspMatch) {
  console.error('❌ netlify.toml CSP not found');
  valid = false;
} else if (netlifyCspMatch[1] !== CSP_VALUE) {
  console.error('❌ netlify.toml CSP does not match source of truth');
  console.error('  Expected:', CSP_VALUE);
  console.error('  Got:     ', netlifyCspMatch[1]);
  valid = false;
}

if (valid) {
  console.log('✅ All platform CSP headers match the centralized source');
} else {
  console.log(
    '\n📝 To fix: update vercel.json and netlify.toml to match src/lib/constants/security-headers.ts'
  );
  process.exit(1);
}
