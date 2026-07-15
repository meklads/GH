#!/usr/bin/env node
/**
 * Build services/maquettes-en.html from AR template — same structure, translated text.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHeader, renderFooter } from './layout-partials.mjs';
import { MAQUETTES_EN_PAIRS } from './maquettes-en-translations.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const AR_PATH = path.join(ROOT, 'services/maquettes.html');
const OUT_PATH = path.join(ROOT, 'services/maquettes-en.html');
const BASE = 'https://3dgraphicshouse.com';
const P = '../';

function extractPageCss(arHtml) {
  const m = arHtml.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1].trim() : '';
}

function extractBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) return '';
  const end = html.indexOf(endMarker, start + startMarker.length);
  if (end === -1) return '';
  return html.slice(start, end);
}

function extractMainBody(arHtml) {
  const main = extractBetween(arHtml, '<div id="main-content"', '<!-- FOOTER -->');
  const modals = extractBetween(arHtml, '<!-- IMAGE LIGHTBOX -->', '<script>\nvar ro=');
  return main + '\n' + modals;
}

function extractPageScripts(arHtml) {
  const m = arHtml.match(/<script>\nvar ro=new IntersectionObserver[\s\S]*?<\/script>\s*\n\s*<script defer src="\.\.\/assets\/quote-form-config\.js"><\/script>[\s\S]*?<script defer src="\.\.\/assets\/quote-form\.js[^"]*"><\/script>/);
  return m ? m[0] : '';
}

function applyTranslations(html) {
  const pairs = [...MAQUETTES_EN_PAIRS].sort((a, b) => b[0].length - a[0].length);
  let out = html;
  for (const [ar, en] of pairs) {
    out = out.split(ar).join(en);
  }
  return out;
}

function fixEnBody(html) {
  let out = html;

  out = out.replace(/onclick="swapImage\('assets\//g, `onclick="swapImage('${P}assets/`);
  out = out.replace(/top:12px;right:40px/g, 'top:12px;left:40px');
  out = out.replace(/style="text-align:right"/g, 'style="text-align:left"');
  out = out.replace(/direction:rtl/g, 'direction:ltr');
  out = out.replace(/right:220px!important;left:0!important/g, 'left:220px!important;right:0!important');
  out = out.replace(/arrow_back/g, 'arrow_forward');
  out = out.replace(/href="\.\.\/contact-us\.html"/g, 'href="../contact-us-en.html"');
  out = out.replace(/href="\.\.\/portfolio\.html"/g, 'href="../portfolio-en.html"');
  out = out.replace(/href="rendering\.html"/g, 'href="rendering-en.html"');
  out = out.replace(/href="animation\.html"/g, 'href="animation-en.html"');
  out = out.replace(/href="digital-marketing\.html"/g, 'href="digital-marketing-en.html"');
  out = out.replace(/href="interactive\.html"/g, 'href="interactive-en.html"');
  out = out.replace(
    /value="https:\/\/3dgraphicshouse\.com\/gh-maquettes\.html\?sent=1#booking"/,
    `value="${BASE}/services/maquettes-en.html?sent=1#booking"`
  );
  out = out.replace(/<\/section>\s*<\/section>/, '</section>');

  out = out.replace(/alt="عنان إسكان"/g, 'alt="Anan Eskan"');
  out = out.replace(/alt="رفال"/g, 'alt="Rafal"');
  out = out.replace(/alt="رابطة العالم الإسلامي"/g, 'alt="Muslim World League"');
  out = out.replace(/alt="مكيون"/g, 'alt="Makyon"');
  out = out.replace(/alt="ابن زومة"/g, 'alt="Ibn Zoma"');
  out = out.replace(/alt="العلا"/g, 'alt="Al Oula"');
  out = out.replace(/alt="تويوتا"/g, 'alt="Toyota"');

  return out;
}

function build() {
  const arHtml = fs.readFileSync(AR_PATH, 'utf8');
  const css = extractPageCss(arHtml);
  const body = fixEnBody(applyTranslations(extractMainBody(arHtml)));
  const scripts = extractPageScripts(arHtml);
  const header = renderHeader(1, true);
  const footer = renderFooter(1, true);
  const canonical = `${BASE}/services/maquettes-en.html`;
  const arUrl = `${BASE}/services/maquettes.html`;

  const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<script src="${P}assets/gh-forms-config.js?v=2"></script>
<!-- GH perf -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<!-- GH SEO -->
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${canonical}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${canonical}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smart Architectural Maquettes | Graphics House</title>
<meta name="description" content="Smart architectural maquettes combining handcraft, projection mapping, and live data integration. The GCC's leading studio for physical-digital sales models."/>
<meta property="og:title" content="Smart Architectural Maquettes | Graphics House">
<meta property="og:description" content="Handcrafted smart maquettes with projection mapping and interactive systems for leading developers in Saudi Arabia and the GCC.">
<meta property="og:image" content="${BASE}/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${P}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${P}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?display=swap&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" rel="stylesheet" />
<link rel="stylesheet" href="${P}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${P}assets/gh-site-enhancements.css?v=21">
<link rel="stylesheet" href="${P}assets/site-header.css?v=28">
<style>
body { font-family: 'Inter', 'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif; }
${css}
</style>
<script defer src="${P}assets/site-header.js?v=14"></script>
<script defer src="${P}assets/gh-performance.js?v=2"></script>
<script defer src="${P}assets/lang-switch.js?v=1"></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Smart Architectural Maquettes',
    description: 'Smart architectural maquettes with projection mapping and live data for developers in Saudi Arabia and the GCC.',
    url: canonical,
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body>
${header}
${body}
${footer}
${scripts}
</body>
</html>
`;

  fs.writeFileSync(OUT_PATH, html, 'utf8');
  const hasGallery = html.includes('gallery-strip');
  const hasBooking = html.includes('id="booking"');
  console.log(`Built services/maquettes-en.html (gallery-strip: ${hasGallery}, booking: ${hasBooking})`);
}

build();
