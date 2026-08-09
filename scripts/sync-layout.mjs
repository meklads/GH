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
  // Header partials are edited directly in partials/header-*.html (not extracted from index pages).
  // Footer partials are edited directly in partials/footer-*.html (not extracted from index pages).
  fs.mkdirSync(PARTIALS, { recursive: true });
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
  const ctaLabel = isEn ? 'Book Session' : 'احجز جلسة استراتيجية';
  const insightsFile = isEn ? 'insights/index-en.html' : 'insights/index.html';
  const contactFile = isEn ? 'contact-us-en.html' : 'contact-us.html';

  let h = header.replace(/<a class="nav-link[^"]*" href="[^"]*insights\/index[^"]*">[^<]*<\/a>\s*/gi, '');
  h = h.replace(/<a class="nav-link[^"]*" href="[^"]*contact-us[^"]*">[^<]*<\/a>\s*/gi, '');

  const prefixMatch =
    h.match(/href="((?:\.\.\/)+)portfolio/) ||
    h.match(/href="((?:\.\.\/)+)casestudy/) ||
    h.match(/href="((?:\.\.\/)+)case-study/) ||
    h.match(/href="((?:\.\.\/)+)who-we-are/);
  const prefix = prefixMatch ? prefixMatch[1] : '';

  const insert = `      <a class="nav-link" href="${prefix}${contactFile}">${contactLabel}</a>\n      <a class="nav-link nav-link-accent" href="${prefix}${insightsFile}">${insightsLabel}</a>\n      <a class="nav-link nav-mobile-cta" href="${prefix}${contactFile}">${ctaLabel}</a>\n    `;
  return h.replace(/\s*<\/nav>/, `\n${insert}</nav>`);
}

function fixLogoCss(html) {
  return html.replace(LOGO_CSS_FIX, LOGO_CSS_NEW);
}

function ensurePerformanceScript(html, prefix) {
  const perfTag = `<script defer src="${prefix}gh-performance.js?v=10"></script>`;
  const ctaTag = `<script defer src="${prefix}gh-cta-track.js?v=1"></script>`;
  if (html.includes('gh-performance.js')) {
    html = html.replace(/gh-performance\.js\?v=\d+/g, 'gh-performance.js?v=10');
  } else if (html.includes('site-header.js')) {
    html = html.replace(
      /(<script defer src="[^"]*site-header\.js[^"]*"><\/script>)/,
      `$1\n${perfTag}`
    );
  }
  if (!html.includes('gh-cta-track.js')) {
    if (html.includes('gh-performance.js')) {
      html = html.replace(
        /(<script defer src="[^"]*gh-performance\.js[^"]*"><\/script>)/,
        `$1\n${ctaTag}`
      );
    } else if (html.includes('site-header.js')) {
      html = html.replace(
        /(<script defer src="[^"]*site-header\.js[^"]*"><\/script>)/,
        `$1\n${ctaTag}`
      );
    }
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

function ensureHeaderCssOrder(html, prefix) {
  const headerHref = `${prefix}site-header.css?v=33`;
  const headerTag = `<link rel="stylesheet" href="${headerHref}">`;
  html = html.replace(/<link[^>]*href="[^"]*site-header\.css[^"]*"[^>]*>\s*/gi, '');
  if (/gh-site-enhancements\.css/i.test(html)) {
    return html.replace(
      /(<link[^>]*href="[^"]*gh-site-enhancements\.css[^"]*"[^>]*>)/i,
      `$1\n${headerTag}`
    );
  }
  if (/tailwind\.min\.css/i.test(html)) {
    return html.replace(
      /(<link[^>]*href="[^"]*tailwind\.min\.css[^"]*"[^>]*>)/i,
      `$1\n${headerTag}`
    );
  }
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${headerTag}\n</head>`);
  }
  return html;
}

const SKIP = new Set([
  'home-v2-backup.html', 'en-backup.html', 'en-v2.html', 'offer-lite.html', 'gh-admin.html',
  // ProjectLaunch AR site page keeps custom #lead-form header CTAs (not contact-us)
  'solutions/project-launch.html',
  // Ads LP — nav-free landing header
  'solutions/project-launch-ads.html',
  'solutions/project-launch-ads-en.html',
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
  html = html.replace(/<a class="gh-skip-link"[\s\S]*?<\/a>\s*/g, '');
  html = html.replace(/<header class="header"[\s\S]*?<\/header>/, header);
  html = html.replace(
    /(<\/header>)\s*<div class="mm-main">[\s\S]*?<\/header>/,
    '$1'
  );
  if (html.match(/<footer dir="(?:ltr|rtl)"[\s\S]*?<\/footer>/)) {
    html = html.replace(/<footer dir="(?:ltr|rtl)"[\s\S]*?<\/footer>/, footer);
  }

  const prefix = depth > 0 ? '../'.repeat(depth) + 'assets/' : 'assets/';
  const langTag = `<script defer src="${prefix}lang-switch.js?v=2"></script>`;
  if (html.includes('site-header.js') && !html.includes('lang-switch.js')) {
    html = html.replace(
      /(<script defer src="[^"]*site-header\.js[^"]*"><\/script>)/,
      `$1\n${langTag}`
    );
  }
  html = html.replace(/lang-switch\.js(\?v=\d+)?/g, 'lang-switch.js?v=2');

  html = html.replace(/site-header\.js\?v=\d+/g, 'site-header.js?v=16');
  html = html.replace(/gh-site-enhancements\.css\?v=\d+/g, 'gh-site-enhancements.css?v=23');

  // Ensure footer layout CSS is always present, versioned, and after Tailwind
  // (unversioned or pre-Tailwind links caused a collapsed narrow footer on many pages).
  const enhHref = `${prefix}gh-site-enhancements.css?v=23`;
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

  html = ensureHeaderCssOrder(html, prefix);

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
  const enhHref = `${prefix}gh-site-enhancements.css?v=23`;
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
