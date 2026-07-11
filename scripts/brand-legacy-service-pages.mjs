#!/usr/bin/env node
/**
 * Brand-align legacy bilingual service pages:
 * - Homepage fonts (Inter/Playfair EN, Tajawal/IBM Plex AR)
 * - Light theme (#FAFAF8 / gold #C9A84C)
 * - Monolingual pages (no AR/EN span mixing)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const PAGES = [
  { file: 'services/interactive.html', lang: 'ar' },
  { file: 'services/interactive-en.html', lang: 'en' },
  { file: 'services/vr-360.html', lang: 'ar' },
  { file: 'services/vr-360-en.html', lang: 'en' },
  { file: 'shop.html', lang: 'ar' },
];

const FONTS_EN = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>`;

const FONTS_AR = `<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>`;

const LIGHT_PAGE_CSS = `
  /* Brand light page chrome — do NOT override .header / .nav-link (site-header.css owns those) */
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:#FAFAF8; }
  ::-webkit-scrollbar-thumb { background:#CCC; }
  ::-webkit-scrollbar-thumb:hover { background:#C9A84C; }
  #loader { background:#FAFAF8 !important; }
  #loader-bar-track { background:rgba(201,168,76,.18) !important; }
  #loader-bar { background:#C9A84C !important; }
  body::after { display:none !important; }
`;

function stripHeaderNavOverrides(html) {
  // Remove legacy Animatics nav rules that fight the shared fixed header
  html = html.replace(
    /\s*\/\* ── Nav states[\s\S]*?#main-nav\.scrolled #nav-pill \{[\s\S]*?\}\s*/g,
    '\n'
  );
  html = html.replace(
    /\s*\/\* ── Nav links[\s\S]*?\.nav-link\.nav-active::after \{ transform:scaleX\(1\); \}\s*/g,
    '\n'
  );
  // Remove bad brand chrome that forced black/grey menu text
  html = html.replace(
    /\s*\.nav-link \{ font-family:'Inter','Tajawal',sans-serif !important; color:#555 !important; \}[\s\S]*?#mob-nav \{ background:#FAFAF8 !important; \}\s*/g,
    '\n'
  );
  html = html.replace(
    /\s*html\[dir="rtl"\] \.nav-link \{ font-family:'Tajawal','IBM Plex Sans Arabic',sans-serif !important; \}[\s\S]*?#mob-nav \{ background:#FAFAF8 !important; \}\s*/g,
    '\n'
  );
  // Narrow leftover single-rule nav overrides
  html = html.replace(/\s*\.nav-link \{[^}]*color:#555[^}]*\}\s*/gi, '\n');
  html = html.replace(/\s*\.nav-link:hover \{ color:#1A1A1A !important; \}\s*/gi, '\n');
  html = html.replace(/\s*\.nav-link::after \{ background:#C9A84C !important; \}\s*/gi, '\n');
  html = html.replace(
    /\s*html\[dir="rtl"\] \.nav-link \{ font-family:'Tajawal','IBM Plex Sans Arabic',sans-serif !important; \}\s*/gi,
    '\n'
  );
  html = html.replace(
    /\s*#main-nav\.scrolled #nav-pill \{[\s\S]*?\}\s*/g,
    '\n'
  );
  // Ensure brand chrome comment still accurate if block remains
  if (html.includes('Brand light page chrome') && html.includes('color:#555 !important')) {
    html = html.replace(
      /\/\* Brand light page chrome[\s\S]*?#mob-nav \{ background:#FAFAF8 !important; \}/,
      `/* Brand light page chrome — do NOT override .header / .nav-link (site-header.css owns those) */
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:#FAFAF8; }
  ::-webkit-scrollbar-thumb { background:#CCC; }
  ::-webkit-scrollbar-thumb:hover { background:#C9A84C; }
  #loader { background:#FAFAF8 !important; }
  #loader-bar-track { background:rgba(201,168,76,.18) !important; }
  #loader-bar { background:#C9A84C !important; }
  body::after { display:none !important; }`
    );
  }
  return html;
}

function stripOppositeLang(html, keep) {
  const drop = keep === 'en' ? 'ar' : 'en';
  // Spans may be class="ar" or class="text-on-background ar" etc.
  const dropRe = new RegExp(
    `<span\\s+(?=[^>]*\\bclass=["'][^"']*\\b${drop}(?:-block)?\\b[^"']*["'])[^>]*>[\\s\\S]*?<\\/span>`,
    'gi'
  );
  const keepRe = new RegExp(
    `<span\\s+(?=[^>]*\\bclass=["'][^"']*\\b${keep}(?:-block)?\\b[^"']*["'])[^>]*>([\\s\\S]*?)<\\/span>`,
    'gi'
  );
  html = html.replace(dropRe, '');
  html = html.replace(keepRe, '$1');
  return html;
}

function replaceFonts(html, lang) {
  html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Noto[\s\S]*?rel="stylesheet"\s*\/>\s*/gi,
    ''
  );
  html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Amiri[\s\S]*?rel="stylesheet"\s*\/>\s*/gi,
    ''
  );
  html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols[\s\S]*?rel="stylesheet"\s*\/>\s*/gi,
    ''
  );
  // Also clear prior brand font blocks if re-run
  html = html.replace(
    /<!-- GH brand fonts -->[\s\S]*?<!-- \/GH brand fonts -->\s*/g,
    ''
  );

  const block = `<!-- GH brand fonts -->\n${lang === 'en' ? FONTS_EN : FONTS_AR}\n<!-- /GH brand fonts -->\n`;
  if (/<meta name="description"/i.test(html)) {
    html = html.replace(/(<meta name="description"[^>]*>)/i, `$1\n${block}`);
  } else {
    html = html.replace(/<\/title>/i, `</title>\n${block}`);
  }
  return html;
}

function injectLightChrome(html) {
  if (html.includes('Brand light page chrome')) return html;
  // Insert before closing </style> of the first large style block
  return html.replace(/<\/style>/i, `${LIGHT_PAGE_CSS}\n</style>`);
}

function bumpThemeLink(html) {
  return html.replace(
    /gh-legacy-service-theme\.css(\?v=\d+)?/g,
    'gh-legacy-service-theme.css?v=3'
  );
}

function cleanBodyClasses(html, lang) {
  html = html.replace(/<html([^>]*)>/i, (m, attrs) => {
    let a = attrs.replace(/\sclass="[^"]*"/i, '');
    if (lang === 'en') {
      return `<html class="scroll-smooth" dir="ltr" lang="en">`;
    }
    return `<html class="scroll-smooth" dir="rtl" lang="ar">`;
  });

  html = html.replace(/<body([^>]*)>/i, (m, attrs) => {
    let a = attrs
      .replace(/\bis-en\b/g, '')
      .replace(/\bis-light\b/g, '')
      .replace(/\bdark\b/g, '')
      .replace(/class="\s*"/, '')
      .replace(/\s{2,}/g, ' ');
    if (/class="/i.test(a)) {
      a = a.replace(/class="([^"]*)"/, (mm, cls) => {
        const cleaned = cls
          .split(/\s+/)
          .filter((c) => c && c !== 'is-en' && c !== 'is-light' && c !== 'dark')
          .join(' ');
        return `class="${cleaned}"`;
      });
    }
    return `<body${a}>`;
  });
  return html;
}

function fixInlineFontFamilies(html, lang) {
  if (lang === 'en') {
    html = html.replace(/font-family:\s*'Noto Serif'[^;"]*/gi, "font-family:'Playfair Display',Georgia,serif");
    html = html.replace(/font-family:\s*'Cairo'[^;"]*/gi, "font-family:'Inter','Tajawal',sans-serif");
    html = html.replace(/font-family:\s*'Manrope'[^;"]*/gi, "font-family:'Inter','Tajawal',sans-serif");
    html = html.replace(/font-family:\s*'Amiri'[^;"]*/gi, "font-family:'Playfair Display',Georgia,serif");
  } else {
    html = html.replace(/font-family:\s*'Noto Serif'[^;"]*/gi, "font-family:'Tajawal','IBM Plex Sans Arabic',sans-serif");
    html = html.replace(/font-family:\s*'Cairo'[^;"]*/gi, "font-family:'Tajawal','IBM Plex Sans Arabic',sans-serif");
    html = html.replace(/font-family:\s*'Manrope'[^;"]*/gi, "font-family:'Tajawal','IBM Plex Sans Arabic',sans-serif");
    html = html.replace(/font-family:\s*'Amiri'[^;"]*/gi, "font-family:'Tajawal','IBM Plex Sans Arabic',sans-serif");
  }
  // Brand gold instead of legacy bright gold
  html = html.replace(/#f2ca50/gi, '#C9A84C');
  html = html.replace(/rgba\(242,\s*202,\s*80/gi, 'rgba(201,168,76');
  // Neutralize leftover dark chrome in page-local CSS (theme CSS + light chrome win for UI)
  html = html.replace(/background:#0e0e0e/gi, 'background:#FAFAF8');
  html = html.replace(/background:#070605/gi, 'background:#FAFAF8');
  html = html.replace(/background:rgba\(8,8,8,\.97\)/gi, 'background:rgba(250,250,248,.97)');
  return html;
}

function fixEnContactLinks(html, lang) {
  if (lang !== 'en') return html;
  html = html.replace(/href="\.\.\/contact-us\.html"/g, 'href="../contact-us-en.html"');
  html = html.replace(/href="\.\.\/portfolio\.html"/g, 'href="../portfolio-en.html"');
  html = html.replace(/href="\.\.\/who-we-are\.html"/g, 'href="../who-we-are-en.html"');
  html = html.replace(/href="contact-us\.html"/g, 'href="contact-us-en.html"');
  return html;
}

function patchPage({ file, lang }) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    console.warn('  skip missing:', file);
    return;
  }
  let html = fs.readFileSync(full, 'utf8');
  html = stripOppositeLang(html, lang);
  html = replaceFonts(html, lang);
  html = injectLightChrome(html);
  html = stripHeaderNavOverrides(html);
  html = bumpThemeLink(html);
  html = cleanBodyClasses(html, lang);
  html = fixInlineFontFamilies(html, lang);
  html = fixEnContactLinks(html, lang);
  // service-page cache bump
  html = html.replace(/service-page\.js(\?v=\d+)?/g, 'service-page.js?v=3');
  fs.writeFileSync(full, html, 'utf8');
  console.log('  branded monolingual:', file, `(${lang})`);
}

console.log('Brand-aligning legacy service pages…');
for (const page of PAGES) patchPage(page);
console.log('Done.');
