#!/usr/bin/env node
/**
 * Unify Arabic typography across all AR pages — matches index-ar.html font stack.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const CANONICAL_FONTS =
  '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>';
const TYPO_VERSION = 'v=2';

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'partials') continue;
      walkHtml(full, out);
    } else if (name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function isArabicPage(rel, html) {
  if (rel.includes('partials/')) return false;
  const tag = html.match(/<html[^>]*>/i)?.[0] || '';
  if (/lang=["']en["']/i.test(tag)) return false;
  if (/lang=["']ar["']/i.test(tag)) return true;
  if (rel.endsWith('-en.html')) return false;
  if (/dir=["']rtl["']/i.test(tag)) return true;
  return false;
}

function assetPrefix(rel) {
  const depth = rel.split('/').length - 1;
  return depth ? '../'.repeat(depth) : '';
}

function normalizeFontLinks(html) {
  const materialLinks = [];
  html = html.replace(
    /<link[^>]*href="https:\/\/fonts\.googleapis\.com\/css2[^"]*"[^>]*>/gi,
    (match) => {
      if (/Material\+Symbols/i.test(match)) {
        materialLinks.push(match);
        return '';
      }
      return '';
    }
  );

  const needsPlayfair = /Playfair Display/i.test(html);
  const hasCanonical = html.includes('IBM+Plex+Sans+Arabic');

  if (!hasCanonical) {
    const anchor =
      html.match(/<link rel="apple-touch-icon"[^>]*>/i)?.[0] ||
      html.match(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>/i)?.[0] ||
      '<meta charset';
    const block =
      anchor === '<meta charset'
        ? `${CANONICAL_FONTS}\n<meta charset`
        : `${anchor}\n${CANONICAL_FONTS}`;
    html = html.replace(anchor, block);
  }

  if (needsPlayfair && !html.includes('Playfair+Display')) {
    html = html.replace(
      CANONICAL_FONTS,
      `${CANONICAL_FONTS}\n<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>`
    );
  }

  if (materialLinks.length) {
    const insertAfter = html.match(CANONICAL_FONTS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))?.[0] || CANONICAL_FONTS;
    html = html.replace(insertAfter, `${insertAfter}\n${materialLinks[0]}`);
  }

  return html;
}

function injectTypographyCss(html, prefix) {
  const href = `${prefix}assets/gh-ar-typography.css?${TYPO_VERSION}`;
  if (html.includes('gh-ar-typography.css')) {
    return html.replace(/gh-ar-typography\.css\?v=\d+/, `gh-ar-typography.css?${TYPO_VERSION}`);
  }
  const link = `<link rel="stylesheet" href="${href}">`;
  return html.replace('</head>', `${link}\n</head>`);
}

let patched = 0;
for (const file of walkHtml(ROOT)) {
  const rel = relative(ROOT, file);
  let html = readFileSync(file, 'utf8');
  if (!isArabicPage(rel, html)) continue;
  const normalized = normalizeFontLinks(html);
  const next = injectTypographyCss(normalized, assetPrefix(rel));
  if (next !== html) {
    writeFileSync(file, next);
    patched += 1;
    console.log('patched', rel);
  }
}
console.log(`Done — ${patched} Arabic page(s) updated.`);
