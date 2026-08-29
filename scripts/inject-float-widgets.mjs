#!/usr/bin/env node
/**
 * Inject standardized float widgets (WhatsApp, email popup, brand) on all pages.
 * Run: node scripts/inject-float-widgets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripLegacyGa, injectAnalytics } from './analytics-snippet.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PARTIALS = path.join(ROOT, 'partials');

const SKIP = new Set([
  'gh-admin.html',
  'home-v2-backup.html',
  'en-backup.html',
  'en-v2.html',
  'offer-lite.html',
  'en.html',
  // Ads LP has its own WA float — skip site float chrome
  'solutions/project-launch-ads.html',
  'solutions/project-launch-ads-en.html',
]);

const FLOAT_VERSION = 11;

const HOMEPAGE_SKIP_REPLACE = new Set([]);

function collectHtmlFiles(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'partials', 'scripts', 'assets', 'node_modules', '.trash'].includes(ent.name)) continue;
      out.push(...collectHtmlFiles(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

function isEnglishPage(rel, html) {
  const dirMatch = html.match(/<html[^>]*\sdir="(ltr|rtl)"/i);
  if (dirMatch) return dirMatch[1].toLowerCase() === 'ltr';
  if (rel.endsWith('-en.html') || rel === 'index.html') return true;
  if (rel === 'index-ar.html') return false;
  return false;
}

function renderFloatPartial(rel, html) {
  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const en = isEnglishPage(rel, html);
  const name = en ? 'float-widgets-en.html' : 'float-widgets-ar.html';
  return fs.readFileSync(path.join(PARTIALS, name), 'utf8').replaceAll('{{PREFIX}}', prefix);
}

function stripLegacyFloat(html) {
  let out = html;
  out = out.replace(/<!-- GH FLOAT START -->[\s\S]*?<!-- GH FLOAT END -->\s*/g, '');
  out = out.replace(/<!--[^\n]*(?:float|عائمة|FLOAT|Contact|تواصل)[^\n]*-->\s*\n/gi, '');
  out = out.replace(/<!--[^\n]*(?:نموذج|popup|Popup)[^\n]*-->\s*\n/gi, '');

  const popupIdx = out.indexOf('<div id="ghPopup"');
  const floatIdx = out.lastIndexOf('<div class="gh-float"', popupIdx > -1 ? popupIdx : out.length);
  if (floatIdx !== -1) {
    const end = popupIdx > floatIdx ? popupIdx : out.indexOf('</body>', floatIdx);
    if (end > floatIdx) {
      out = out.slice(0, floatIdx) + out.slice(end);
    }
  }

  out = out.replace(/<div id="ghPopup"[\s\S]*?<\/div>\s*(?=\n*(?:<script|<\/body>))/gi, '');
  return out;
}

function injectAssets(html, prefix) {
  const css = `<link rel="stylesheet" href="${prefix}assets/gh-float-widgets.css?v=${FLOAT_VERSION}">`;
  const js = `<script defer src="${prefix}assets/gh-float-widgets.js?v=${FLOAT_VERSION}"></script>`;
  const forms = `<script src="${prefix}assets/gh-forms-config.js"></script>`;

  html = html.replace(/gh-float-widgets\.css\?v=\d+/g, `gh-float-widgets.css?v=${FLOAT_VERSION}`);
  html = html.replace(/gh-float-widgets\.js\?v=\d+/g, `gh-float-widgets.js?v=${FLOAT_VERSION}`);

  if (!html.includes('gh-float-widgets.css')) {
    html = html.replace(/<\/head>/i, `${css}\n</head>`);
  }
  if (!html.includes('gh-forms-config.js')) {
    html = html.replace(/<head>/i, `<head>\n${forms}`);
  }
  if (!html.includes('gh-float-widgets.js')) {
    html = html.replace(/<\/body>/i, `${js}\n</body>`);
  }
  return html;
}

function patchPage(rel) {
  if (SKIP.has(rel)) return null;
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  html = injectAssets(html, prefix);
  html = stripLegacyGa(html);
  html = injectAnalytics(html, prefix);

  if (!HOMEPAGE_SKIP_REPLACE.has(rel)) {
    html = stripLegacyFloat(html);
    const block = renderFloatPartial(rel, html);
    html = html.replace(/<\/body>/i, `${block}\n</body>`);
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    return rel;
  }
  return null;
}

const updated = collectHtmlFiles(ROOT).map(patchPage).filter(Boolean);
console.log(`Float widgets injected on ${updated.length} pages`);
