#!/usr/bin/env node
/**
 * Fix bilingual service pages: replace crashing inline script, fix contact links.
 * Run: node scripts/fix-service-pages.mjs && node scripts/sync-layout.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const PAGES = [
  'services/rendering.html',
  'services/interactive.html',
  'services/production.html',
  'services/animation.html',
  'services/maquettes.html',
];

const INLINE_SCRIPT = /<script>\(function\(\)\{'use strict';[\s\S]*?\}\)\(\);<\/script>\s*/;
const SMART_LANG = /<script>\s*\/\/ Smart language switcher[\s\S]*?<\/script>\s*/;

const SERVICE_SCRIPT = '<script defer src="../assets/service-page.js"></script>\n';

for (const rel of PAGES) {
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');

  html = html.replace(INLINE_SCRIPT, SERVICE_SCRIPT);
  html = html.replace(SMART_LANG, '');

  html = html.replace(/href="\.\.\/contact\.html"/g, 'href="../contact-us.html"');

  if (!html.includes('service-page.js')) {
    console.warn('WARN: inline script not replaced in', rel);
  }

  fs.writeFileSync(full, html, 'utf8');
  console.log('fixed:', rel);
}
