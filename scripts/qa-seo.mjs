#!/usr/bin/env node
/**
 * QA: SEO hygiene, canonical, hreflang, noindex stubs, sitemap duplicates.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://3dgraphicshouse.com';

const QA_SKIP = new Set([
  'gh-admin.html',
  'home-v2-backup.html',
  'en-backup.html',
  'en-v2.html',
  'offer-lite.html',
  'en.html',
  'insights/downloads/files/visual-launch-checklist-ar.html',
  'insights/downloads/files/visual-launch-checklist-en.html',
  'insights/downloads/files/visual-project-brief-ar.html',
  'insights/downloads/files/visual-project-brief-en.html',
]);

function collectHtml(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'node_modules', 'partials', 'scripts', '.trash'].includes(ent.name)) continue;
      out.push(...collectHtml(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

const issues = [];
const canonicals = new Map();

for (const rel of collectHtml(ROOT)) {
  if (QA_SKIP.has(rel)) continue;
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/i);
  if (!canon) {
    if (!/noindex/i.test(html) && !rel.includes('gh-admin')) {
      issues.push(`${rel}: missing canonical`);
    }
    continue;
  }
  const url = canon[1];
  if (!canonicals.has(url)) canonicals.set(url, []);
  canonicals.get(url).push(rel);

  if (/http-equiv=["']refresh["']/i.test(html) && !/noindex/i.test(html)) {
    issues.push(`${rel}: redirect stub without noindex`);
  }

  if (html.includes('rel="canonical"') && !html.includes('hreflang="en"') && !/noindex/i.test(html)) {
    issues.push(`${rel}: canonical without hreflang en`);
  }
}

for (const [url, files] of canonicals.entries()) {
  if (files.length <= 1) continue;
  const indexable = files.filter((f) => {
    const h = fs.readFileSync(path.join(ROOT, f), 'utf8');
    return !/noindex/i.test(h) && !/http-equiv=["']refresh["']/i.test(h);
  });
  if (indexable.length > 1) {
    issues.push(`duplicate indexable canonical ${url}: ${indexable.join(', ')}`);
  }
}

const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const locSet = new Set(locs);
if (locs.length !== locSet.size) issues.push('sitemap.xml: duplicate loc entries');

for (const loc of locs) {
  if (loc.includes('/insights/downloads/files/')) {
    issues.push(`sitemap includes thin print file: ${loc}`);
  }
  const rel = loc.replace(`${BASE}/`, '').replace(/\/$/, 'index.html') || 'index.html';
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  const html = fs.readFileSync(full, 'utf8');
  if (/noindex/i.test(html) || /http-equiv=["']refresh["']/i.test(html)) {
    issues.push(`sitemap lists noindex/redirect page: ${rel}`);
  }
}

console.log(`SEO QA: ${locs.length} sitemap URLs, ${issues.length} issue(s)`);
if (issues.length) {
  issues.slice(0, 40).forEach((i) => console.warn('  WARN:', i));
  if (issues.length > 40) console.warn(`  … and ${issues.length - 40} more`);
  process.exit(1);
}
console.log('OK: SEO checks passed');
process.exit(0);
