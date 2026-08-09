#!/usr/bin/env node
/**
 * Deduplicate sitemap.xml and drop redirect / noindex stubs.
 * Run last in the build pipeline after all sitemap patchers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://3dgraphicshouse.com';
const smPath = path.join(ROOT, 'sitemap.xml');

if (!fs.existsSync(smPath)) {
  console.warn('finalize-sitemap: sitemap.xml missing');
  process.exit(0);
}

const xml = fs.readFileSync(smPath, 'utf8');
const entryRe = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]*)<\/lastmod>\s*<priority>([^<]+)<\/priority>\s*<\/url>/g;

const byLoc = new Map();
let m;
while ((m = entryRe.exec(xml)) !== null) {
  const [, loc, lastmod, priority] = m;
  const prev = byLoc.get(loc);
  if (!prev || parseFloat(priority) > parseFloat(prev.priority)) {
    byLoc.set(loc, { lastmod, priority });
  }
}

function isRedirectOrNoindex(loc) {
  const rel = loc.replace(`${BASE}/`, '').replace(/\/$/, 'index.html');
  const file = rel === '' ? 'index.html' : rel;
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return false;
  const html = fs.readFileSync(full, 'utf8');
  if (/http-equiv=["']refresh["']/i.test(html)) return true;
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) return true;
  return false;
}

const today = new Date().toISOString().slice(0, 10);
const urls = [...byLoc.entries()]
  .filter(([loc]) => !isRedirectOrNoindex(loc))
  .filter(([loc]) => !loc.includes('/insights/downloads/files/'))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([loc, { priority }]) =>
    `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`
  );

const out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(smPath, out, 'utf8');
console.log(`Sitemap finalized: ${urls.length} URLs (${byLoc.size - urls.length} removed/deduped)`);
