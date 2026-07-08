#!/usr/bin/env node
/**
 * Sync canonical EN/AR header & footer across GH static pages.
 * Run from repo root: node scripts/sync-layout.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderPartial } from './layout-partials.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PARTIALS = path.join(ROOT, 'partials');

const CORRUPT_CSS = `.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
[dir="rtl"] .logo { margin-inline-start: auto; }
[dir="ltr"] .logo { margin-inline-end: auto; }
@media (max-width: 900px) {
  .nav-actions { position: relative; z-index: 1002; }
}`;

const LOGO_CSS_FIX = `[dir="rtl"] .logo { margin-inline-start: auto; }`;
const LOGO_CSS_NEW = `[dir="rtl"] .logo { margin-inline-end: auto; }`;

function extract(html, pattern) {
  const m = html.match(pattern);
  return m ? m[1] : null;
}

function buildPartials() {
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const arPage = fs.readFileSync(path.join(ROOT, 'index-ar.html'), 'utf8');

  let enHeader = extract(idx, /(<header class="header" id="header">[\s\S]*?<\/header>)/);
  let arHeader = extract(arPage, /(<header class="header" id="header">[\s\S]*?<\/header>)/);

  // Reorder AR header: logo | nav | nav-actions | menu-toggle
  const logo = extract(arHeader, /(<a href="(?:\/|\/index-ar\.html)" class="logo">[\s\S]*?<\/a>)/);
  const nav = extract(arHeader, /(<nav class="nav" id="nav">[\s\S]*?<\/nav>)/);
  const actions = extract(arHeader, /(<div class="nav-actions">[\s\S]*?<\/div>)/);
  const toggle = extract(arHeader, /(<button class="menu-toggle"[\s\S]*?<\/button>)/);
  if (logo && nav && actions && toggle) {
    arHeader = `<header class="header" id="header">
  <div class="container header-inner">
    ${logo}
    ${nav}
    ${actions}
    ${toggle}
  </div>
</header>`;
  }

  enHeader = enHeader.replace(/href="who-we-are\.html"/g, 'href="index-ar.html"');
  arHeader = arHeader
    .replace(
      /(<a href=")(?:#|index-ar\.html)(" class="lang-switch-link is-active" hreflang="ar">AR<\/a>)/,
      '$1index-ar.html$2'
    )
    .replace(/href="who-we-are-en\.html"/g, 'href="/"');

  const toPartial = (s) =>
    s
      .replace(/src="assets\//g, 'src="{{PREFIX}}assets/')
      .replace(/href="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, 'href="{{PREFIX}}$1"')
      .replace(/href="\/"/g, 'href="{{HOME}}"');

  fs.mkdirSync(PARTIALS, { recursive: true });
  fs.writeFileSync(path.join(PARTIALS, 'header-en.html'), toPartial(enHeader));
  fs.writeFileSync(path.join(PARTIALS, 'header-ar.html'), toPartial(arHeader));
  // Footer partials are edited directly in partials/footer-*.html (not extracted from index pages).
}

function fixCorruption(html) {
  let out = html;
  out = out.replace(
    /<html class="scroll-smooth" dir="rtl" la[\s\S]*?ng="ar">/,
    '<html class="scroll-smooth" dir="rtl" lang="ar">'
  );
  out = out.replace(
    /<meta\s*\n\.nav-actions \{[\s\S]*?\}\s*charset="utf-8"\/>/,
    '<meta charset="utf-8"/>'
  );
  out = out.replace(CORRUPT_CSS, '');
  return out;
}

function normalizeNavTail(header, isEn) {
  const insightsLabel = isEn ? 'Insights' : 'رؤى';
  const contactLabel = isEn ? 'Contact Us' : 'للاتصال بنا';
  const insightsFile = isEn ? 'insights/index-en.html' : 'insights/index.html';
  const contactFile = isEn ? 'contact-us-en.html' : 'contact-us.html';

  let h = header.replace(/<a class="nav-link" href="[^"]*insights\/index[^"]*">[^<]*<\/a>\s*/gi, '');
  h = h.replace(/<a class="nav-link" href="[^"]*contact-us[^"]*">[^<]*<\/a>\s*/gi, '');

  const prefixMatch =
    h.match(/href="((?:\.\.\/)+)portfolio/) ||
    h.match(/href="((?:\.\.\/)+)casestudy/) ||
    h.match(/href="((?:\.\.\/)+)case-study/) ||
    h.match(/href="((?:\.\.\/)+)who-we-are/);
  const prefix = prefixMatch ? prefixMatch[1] : '';

  const insert = `      <a class="nav-link" href="${prefix}${insightsFile}">${insightsLabel}</a>\n      <a class="nav-link" href="${prefix}${contactFile}">${contactLabel}</a>\n    `;
  return h.replace(/\s*<\/nav>/, `\n${insert}</nav>`);
}

function fixLogoCss(html) {
  return html.replace(LOGO_CSS_FIX, LOGO_CSS_NEW);
}

function ensurePerformanceScript(html, prefix) {
  const tag = `<script defer src="${prefix}gh-performance.js?v=2"></script>`;
  if (html.includes('gh-performance.js')) {
    return html.replace(/gh-performance\.js\?v=\d+/g, 'gh-performance.js?v=2');
  }
  if (html.includes('site-header.js')) {
    return html.replace(
      /(<script defer src="[^"]*site-header\.js[^"]*"><\/script>)/,
      `$1\n${tag}`
    );
  }
  return html;
}

function ensureFontDisplaySwap(html) {
  return html.replace(
    /fonts\.googleapis\.com\/css2\?([^"']+)/g,
    (match, query) => {
      if (query.includes('display=swap')) return match;
      return `fonts.googleapis.com/css2?display=swap&${query}`;
    }
  );
}

function isEnglishPage(rel, html) {
  const dirMatch = html.match(/<html[^>]*\sdir="(ltr|rtl)"/i);
  if (dirMatch) return dirMatch[1].toLowerCase() === 'ltr';
  if (rel.endsWith('-en.html') || rel === 'index.html' || rel === 'en.html') return true;
  if (rel === 'index-ar.html') return false;
  return false;
}

function depthOf(rel) {
  return rel.split('/').length - 1;
}

function collectHtmlFiles(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'partials', 'scripts', 'assets', 'node_modules'].includes(ent.name)) continue;
      out.push(...collectHtmlFiles(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

const SKIP = new Set([
  'home-v2-backup.html', 'en-backup.html', 'en-v2.html', 'offer-lite.html', 'gh-admin.html',
]);

function syncFile(rel) {
  if (SKIP.has(rel)) return null;
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  if (!html.includes('<header class="header"')) return null;

  const en = isEnglishPage(rel, html);
  const depth = depthOf(rel);
  let header = normalizeNavTail(renderPartial(en ? 'header-en.html' : 'header-ar.html', depth, en), en);
  const footer = renderPartial(en ? 'footer-en.html' : 'footer-ar.html', depth, en);

  html = fixCorruption(html);
  html = fixLogoCss(html);
  html = ensureFontDisplaySwap(html);
  html = html.replace(/<header class="header"[\s\S]*?<\/header>/, header);
  html = html.replace(
    /(<\/header>)\s*<div class="mm-main">[\s\S]*?<\/header>/,
    '$1'
  );
  if (html.match(/<footer dir="(?:ltr|rtl)"[\s\S]*?<\/footer>/)) {
    html = html.replace(/<footer dir="(?:ltr|rtl)"[\s\S]*?<\/footer>/, footer);
  }

  const prefix = depth > 0 ? '../'.repeat(depth) + 'assets/' : 'assets/';
  const langTag = `<script defer src="${prefix}lang-switch.js?v=1"></script>`;
  if (html.includes('site-header.js') && !html.includes('lang-switch.js')) {
    html = html.replace(
      /(<script defer src="[^"]*site-header\.js[^"]*"><\/script>)/,
      `$1\n${langTag}`
    );
  }

  html = html.replace(/site-header\.js\?v=\d+/g, 'site-header.js?v=12');
  html = html.replace(/site-header\.css\?v=\d+/g, 'site-header.css?v=19');
  html = html.replace(/gh-insights\.css\?v=\d+/g, 'gh-insights.css?v=23');

  // Ensure footer layout CSS is always present, versioned, and after Tailwind
  // (unversioned or pre-Tailwind links caused a collapsed narrow footer on many pages).
  const enhHref = `${prefix}gh-site-enhancements.css?v=16`;
  const enhTag = `<link rel="stylesheet" href="${enhHref}">`;
  html = html.replace(
    /<link[^>]*href="[^"]*gh-site-enhancements\.css[^"]*"[^>]*>\s*/gi,
    ''
  );
  if (/tailwind\.min\.css/i.test(html)) {
    html = html.replace(
      /(<link[^>]*href="[^"]*tailwind\.min\.css[^"]*"[^>]*>)/i,
      `$1\n${enhTag}`
    );
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${enhTag}\n</head>`);
  }

  html = ensurePerformanceScript(html, prefix);

  fs.writeFileSync(full, html, 'utf8');
  return rel;
}

function syncFooterOnly(rel) {
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  if (!html.match(/<footer dir="(?:ltr|rtl)"/)) return null;

  const en = isEnglishPage(rel, html);
  const depth = depthOf(rel);
  const footer = renderPartial(en ? 'footer-en.html' : 'footer-ar.html', depth, en);
  html = html.replace(/<footer dir="(?:ltr|rtl)"[\s\S]*?<\/footer>/, footer);

  const prefix = depth > 0 ? '../'.repeat(depth) + 'assets/' : 'assets/';
  const enhHref = `${prefix}gh-site-enhancements.css?v=16`;
  const enhTag = `<link rel="stylesheet" href="${enhHref}">`;
  html = html.replace(
    /<link[^>]*href="[^"]*gh-site-enhancements\.css[^"]*"[^>]*>\s*/gi,
    ''
  );
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${enhTag}\n</head>`);
  }

  fs.writeFileSync(full, html, 'utf8');
  return rel;
}

buildPartials();
const updated = collectHtmlFiles(ROOT).map(syncFile).filter(Boolean);
const footerOnly = ['gh-admin.html'].map(syncFooterOnly).filter(Boolean);
console.log(`Synced ${updated.length} pages`);
if (footerOnly.length) console.log(`Footer-only sync: ${footerOnly.join(', ')}`);
