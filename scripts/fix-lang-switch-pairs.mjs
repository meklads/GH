#!/usr/bin/env node
/**
 * Point AR/EN lang-switch links at sibling pages (not home).
 * Run: node scripts/fix-lang-switch-pairs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '_Archive' || name === 'scripts') continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function relHref(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function findPair(file) {
  const base = path.basename(file);
  const dir = path.dirname(file);
  if (base === 'index.html') {
    const ar = path.join(dir, 'index-ar.html');
    if (fs.existsSync(ar)) return { en: file, ar };
    // insights/index.html ↔ insights/index-en.html
    const enAlt = path.join(dir, 'index-en.html');
    if (fs.existsSync(enAlt) && dir.endsWith('insights')) return { en: enAlt, ar: file };
    return null;
  }
  if (base === 'index-ar.html') {
    const en = path.join(dir, 'index.html');
    if (fs.existsSync(en)) return { en, ar: file };
    return null;
  }
  if (base === 'index-en.html') {
    const ar = path.join(dir, 'index.html');
    if (fs.existsSync(ar)) return { en: file, ar };
    return null;
  }
  if (base.endsWith('-en.html')) {
    const arName = base.replace(/-en\.html$/, '.html');
    const ar = path.join(dir, arName);
    if (fs.existsSync(ar)) return { en: file, ar };
    return null;
  }
  const en = path.join(dir, base.replace(/\.html$/, '-en.html'));
  if (fs.existsSync(en)) return { en, ar: file };
  return null;
}

function isEnglishFile(file, html) {
  const base = path.basename(file);
  if (base.endsWith('-en.html') || base === 'index.html') {
    if (base === 'index.html' && /lang=["']ar["']|dir=["']rtl["']/.test(html.slice(0, 800))) return false;
    if (base === 'index.html') return /lang=["']en["']|dir=["']ltr["']/.test(html.slice(0, 800));
    return true;
  }
  if (base === 'index-en.html') return true;
  return /lang=["']en["']/.test(html.slice(0, 500));
}

const reBlock =
  /(<div class="lang-switch"[^>]*>)([\s\S]*?)(<\/div>)/;

let changed = 0;
for (const file of walk(ROOT)) {
  const pair = findPair(file);
  if (!pair) continue;

  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('lang-switch')) continue;

  const m = html.match(reBlock);
  if (!m) continue;

  const enHref = relHref(file, pair.en);
  const arHref = relHref(file, pair.ar);
  const enActive = isEnglishFile(file, html);
  const nextInner =
    `\n        <a href="${arHref}" class="lang-switch-link${enActive ? '' : ' is-active'}" hreflang="ar">AR</a>\n` +
    `        <span class="lang-switch-sep" aria-hidden="true">|</span>\n` +
    `        <a href="${enHref}" class="lang-switch-link${enActive ? ' is-active' : ''}" hreflang="en">EN</a>\n      `;

  const next = m[1] + nextInner + m[3];
  if (next === m[0]) continue;

  html = html.replace(reBlock, next);
  fs.writeFileSync(file, html, 'utf8');
  changed += 1;
  console.log('fixed', path.relative(ROOT, file));
}

console.log(`Done. Updated ${changed} lang-switch blocks.`);
