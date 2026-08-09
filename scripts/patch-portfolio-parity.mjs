#!/usr/bin/env node
/**
 * Sync portfolio AR/EN: shared CSS/JS, YouTube fixes, HQ thumbs.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const files = ['portfolio.html', 'portfolio-en.html'];

const HERO_CSS_START = /\/\* ══+ HERO ══+ \*\//;
const VID_CSS_END = /\.vid-x:hover\{color:#fff\}\s*\n/;

const MOTION_IDS = [
  'CtjHnqYOX3I',
  'hz3TtUd5-eo',
  'jNYuQoRHNfg',
  'wzUNAKqOE8Q',
  'heeNhPdB25E',
];

function stripPortfolioCss(html) {
  const start = html.search(HERO_CSS_START);
  if (start === -1) return html;
  const tail = html.slice(start);
  const endMatch = tail.match(VID_CSS_END);
  if (!endMatch) return html;
  const end = start + endMatch.index + endMatch[0].length;
  return html.slice(0, start) + html.slice(end);
}

function addAssets(html) {
  if (!html.includes('portfolio-page.css')) {
    html = html.replace(
      '<link rel="stylesheet" href="assets/gh-float-widgets.css?v=8">',
      `<link rel="stylesheet" href="assets/gh-float-widgets.css?v=8">
<link rel="preconnect" href="https://img.youtube.com">
<link rel="dns-prefetch" href="https://img.youtube.com">
<link rel="stylesheet" href="assets/portfolio-page.css?v=1">`
    );
  }
  if (!html.includes('portfolio-page.js')) {
    html = html.replace(
      '<script defer src="assets/lang-switch.js?v=2"></script>',
      `<script defer src="assets/lang-switch.js?v=2"></script>
<script defer src="assets/portfolio-page.js?v=1"></script>`
    );
  }
  return html;
}

function fixBrokenEmbeds(html) {
  let n = 0;
  return html.replace(
    /openVid\('https:\/\/www\.youtube\.com\/embed\/\?autoplay=1&vq=hd1080'\)/g,
    () => {
      n += 1;
      if (n === 1) return "openVidById('AYStF0c4Hgk')";
      if (n === 2) return "openVidById('vYbn-9ramsI')";
      return "openVidById('GlbvI0DRXE4')";
    }
  );
}

function fixMotionCards(html) {
  for (const id of MOTION_IDS) {
    html = html.replace(
      new RegExp(
        `onclick="openVid\\('https://www\\.youtube\\.com/embed/${id}\\?autoplay=1'\\)"`,
        'g'
      ),
      `onclick="openVidById('${id}')"`
    );
    html = html.replace(
      new RegExp(
        `<img src="https://img\\.youtube\\.com/vi/${id}/hqdefault\\.jpg"([^>]*)>`,
        'g'
      ),
      `<img data-yt-id="${id}" src="https://img.youtube.com/vi/${id}/maxresdefault.jpg"$1 decoding="async"/>`
    );
  }
  return html;
}

function stripInlinePortfolioJs(html) {
  return html.replace(
    /\/\/ Filter[\s\S]*?document\.addEventListener\('keydown',function\(e\)\{if\(e\.key==='Escape'\)\{closeLB\(\);closeVid\(\);\}\}\);\n/,
    ''
  );
}

function stripLightboxJs(html) {
  return html.replace(
    /function openImg\(s,c,t\)\{[\s\S]*?document\.addEventListener\('keydown',function\(e\)\{if\(e\.key==='Escape'\)\{closeLB\(\);closeVid\(\);\}\}\);\n/,
    ''
  );
}

function fixEnCopy(html, isEn) {
  if (!isEn) return html;
  html = html.replace(
    '<title>Our Work، Graphics House | Portfolio</title>',
    '<title>Our Work, Graphics House | Portfolio</title>'
  );
  html = html.replace(
    '<meta property="og:title" content="Our Work، Graphics House Portfolio"/>',
    '<meta property="og:title" content="Our Work, Graphics House Portfolio"/>'
  );
  html = html.replace(
    'interactive sales galleries، crafted',
    'interactive sales galleries, crafted'
  );
  return html;
}

function addImgQuality(html) {
  return html.replace(
    /<img src="(assets\/[^"]+)" alt="([^"]*)" loading="lazy"\/>/g,
    '<img src="$1" alt="$2" loading="lazy" decoding="async"/>'
  );
}

for (const file of files) {
  const path = join(root, file);
  let html = readFileSync(path, 'utf8');
  const isEn = file.includes('-en');

  html = stripPortfolioCss(html);
  html = addAssets(html);
  html = fixBrokenEmbeds(html);
  html = fixMotionCards(html);
  html = stripInlinePortfolioJs(html);
  html = stripLightboxJs(html);
  html = fixEnCopy(html, isEn);
  html = addImgQuality(html);

  writeFileSync(path, html);
  console.log('patched', file);
}
