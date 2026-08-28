#!/usr/bin/env node
/**
 * QA: no FormSubmit leftovers; quote-form.js posts to Worker endpoint.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

const quoteJs = fs.readFileSync(path.join(ROOT, 'assets/quote-form.js'), 'utf8');
if (quoteJs.includes('formsubmit.co')) {
  console.error('FAIL: quote-form.js still references formsubmit.co');
  failed++;
} else {
  console.log('OK: quote-form.js has no FormSubmit');
}
if (!quoteJs.includes('formEndpoint') && !quoteJs.includes('/api/form')) {
  console.error('FAIL: quote-form.js missing /api/form');
  failed++;
} else {
  console.log('OK: quote-form.js uses /api/form');
}

const worker = fs.readFileSync(path.join(ROOT, 'workers/gh-form-proxy.js'), 'utf8');
if (!/handleForm[\s\S]*verifyTurnstile/.test(worker)) {
  console.error('FAIL: Worker handleForm missing Turnstile verify');
  failed++;
} else {
  console.log('OK: Worker verifies Turnstile on /api/form');
}

// Spot-check HTML pages for formsubmit
function walk(dir, base = '', out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'scripts' || ent.name === 'workers') continue;
    const rel = base ? `${base}/${ent.name}` : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, rel, out);
    else if (ent.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

const hits = [];
for (const rel of walk(ROOT)) {
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (/formsubmit\.co/i.test(html)) hits.push(rel);
}
if (hits.length) {
  console.error('FAIL: FormSubmit still in HTML:');
  hits.slice(0, 20).forEach((h) => console.error('  ', h));
  failed += hits.length;
} else {
  console.log('OK: no formsubmit.co in HTML pages');
}

// photography webp siblings for referenced slides
const slides = ['slide_image_2', 'slide_image_3', 'slide_image_12'];
for (const s of slides) {
  const webp = path.join(ROOT, 'assets/photography', `${s}.webp`);
  if (!fs.existsSync(webp)) {
    console.error('FAIL: missing', `assets/photography/${s}.webp`);
    failed++;
  } else {
    console.log('OK: webp', s);
  }
}

process.exit(failed ? 1 : 0);
