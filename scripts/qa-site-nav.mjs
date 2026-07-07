#!/usr/bin/env node
/**
 * QA: header nav consistency across GH static pages.
 * Run: node scripts/qa-site-nav.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const SKIP = new Set([
  'en-v2.html',
  'en-backup.html',
  'home-v2-backup.html',
  'gh-admin.html',
  'offer-lite.html',
]);

const EXPECT_CSS = 'site-header.css?v=19';
const EXPECT_JS = 'site-header.js?v=12';

function collectHtml(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'node_modules', 'assets', 'partials'].includes(ent.name)) continue;
      out.push(...collectHtml(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

function isEnglishPage(rel, html) {
  const dir = html.match(/<html[^>]*\sdir="(ltr|rtl)"/i);
  if (dir) return dir[1].toLowerCase() === 'ltr';
  return rel.endsWith('-en.html') || rel === 'index.html';
}

const issues = [];
let checked = 0;

for (const rel of collectHtml(ROOT)) {
  if (SKIP.has(rel)) continue;
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (!html.includes('<header class="header"')) continue;

  checked += 1;
  const en = isEnglishPage(rel, html);

  if (!html.includes('nav-mega-trigger')) {
    issues.push(`${rel}: missing .nav-mega-trigger`);
  }
  if (!html.includes(EXPECT_CSS)) {
    issues.push(`${rel}: expected ${EXPECT_CSS}`);
  }
  if (!html.includes(EXPECT_JS)) {
    issues.push(`${rel}: expected ${EXPECT_JS}`);
  }

  const contactPattern = en
    ? /href="[^"]*contact-us[^"]*"[^>]*>Contact Us</
    : /href="[^"]*contact-us[^"]*"[^>]*>(للاتصال بنا|تواصل معنا)</;
  if (!contactPattern.test(html)) {
    issues.push(`${rel}: missing contact nav link`);
  }

  const insightsPattern = en
    ? /href="[^"]*insights\/index-en\.html"[^>]*>Insights</
    : /href="[^"]*insights\/index\.html"[^>]*>رؤى</;
  if (!insightsPattern.test(html)) {
    issues.push(`${rel}: missing Insights / رؤى nav link`);
  }

  if (html.includes('<footer dir=')) {
    const footerOk = en
      ? html.includes('Quick Links') && !html.includes('Saudi Cities') && !html.includes('gh-lang-alt')
      : html.includes('روابط مهمة') && !html.includes('المدن السعودية') && !html.includes('gh-lang-alt');
    if (!footerOk) issues.push(`${rel}: outdated footer layout`);
  }
}

for (const rel of collectHtml(ROOT)) {
  if (SKIP.has(rel)) continue;
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (!html.includes('<footer dir=')) continue;

  const en = isEnglishPage(rel, html);
  const footerOk = en
    ? html.includes('Quick Links') && !html.includes('Saudi Cities') && !html.includes('gh-lang-alt')
    : html.includes('روابط مهمة') && !html.includes('المدن السعودية') && !html.includes('gh-lang-alt');
  if (!footerOk) issues.push(`${rel}: outdated footer layout`);
}

console.log(`Checked ${checked} pages with site header.`);

if (issues.length) {
  console.error(`\n${issues.length} issue(s):\n`);
  issues.forEach((line) => console.error(`  - ${line}`));
  process.exit(1);
}

console.log('All header/nav/footer checks passed.');
