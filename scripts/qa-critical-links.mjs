#!/usr/bin/env node
/**
 * QA: spot-check critical internal links resolve on disk.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

function check(pageRel, href, note) {
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return;
  }
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return;
  const pageDir = path.dirname(path.join(ROOT, pageRel));
  const target = path.normalize(path.join(pageDir, clean));
  if (!fs.existsSync(target)) {
    console.error(`FAIL: ${pageRel} → ${href} (${note || 'missing'})`);
    failed += 1;
  } else {
    console.log(`OK: ${pageRel} → ${href}`);
  }
}

function extractHrefs(html, selectorHint) {
  const re = /href="([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

// Insights hub downloads
for (const page of ['insights/index.html', 'insights/index-en.html']) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const dl = [...html.matchAll(/class="gh-ins-btn"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="gh-ins-btn"/g)];
  // simpler: any tools/ link in downloads section
  const tools = [...html.matchAll(/href="(tools\/[^"]+\.html)"/g)];
  if (!tools.length) {
    console.error(`FAIL: ${page} has no tools/*.html download links`);
    failed += 1;
  }
  for (const [, href] of tools) check(page, href, 'download');
}

// Service related links
const svc = 'services/ai-solutions.html';
const svcHtml = fs.readFileSync(path.join(ROOT, svc), 'utf8');
const row = svcHtml.match(/<div class="gh-svc-link-row">([\s\S]*?)<\/div>/);
if (!row) {
  console.error('FAIL: missing related links on', svc);
  failed += 1;
} else {
  const hrefs = [...row[1].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.includes('../../insights')) {
      console.error(`FAIL: ${svc} double-prefixed related link ${href}`);
      failed += 1;
    } else {
      check(svc, href, 'related');
    }
  }
}

// Homepage #services
for (const page of ['index.html', 'index-ar.html']) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  if (!html.includes('id="services"')) {
    console.error(`FAIL: ${page} missing id="services"`);
    failed += 1;
  } else {
    console.log(`OK: ${page} has #services`);
  }
  if (!/og:image" content="https:\/\//.test(html)) {
    console.error(`FAIL: ${page} og:image not absolute`);
    failed += 1;
  } else {
    console.log(`OK: ${page} absolute og:image`);
  }
}

// Insights skip target
for (const page of ['insights/index.html', 'insights/index-en.html']) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  if (!html.includes('id="main-content"')) {
    console.error(`FAIL: ${page} missing #main-content`);
    failed += 1;
  } else {
    console.log(`OK: ${page} #main-content`);
  }
}

if (failed) {
  console.error(`Link QA failed: ${failed} issue(s)`);
  process.exit(1);
}
console.log('Link QA passed');
