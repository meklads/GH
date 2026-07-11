#!/usr/bin/env node
/**
 * Patch legacy bilingual service pages: inject theme CSS, fix bilingual rules,
 * disable custom cursor, strengthen hero contrast.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = [
  'services/interactive.html',
  'services/interactive-en.html',
  'services/vr-360.html',
  'services/vr-360-en.html',
  'shop.html',
];

const EN_META = {
  'services/interactive-en.html': {
    title: 'Interactive Presentations | Graphics House',
    description:
      'Touch-enabled interactive environments with Unreal Engine — walkthroughs, material switching, and unit selection in real time.',
    name: 'Interactive Presentations',
  },
  'services/vr-360-en.html': {
    title: 'VR & 360° Tours | Graphics House',
    description:
      'Immersive VR and panoramic 360° tours for real estate projects across Saudi Arabia and the GCC.',
    name: 'VR & 360° Tours',
  },
};

const THEME_LINK_ROOT = '<link rel="stylesheet" href="assets/gh-legacy-service-theme.css?v=3">\n';
const THEME_LINK_NESTED = '<link rel="stylesheet" href="../assets/gh-legacy-service-theme.css?v=3">\n';

function patch(html, rel) {
  const depth = rel.includes('/') ? 1 : 0;
  const themeLink = depth ? THEME_LINK_NESTED : THEME_LINK_ROOT;

  // Inject theme stylesheet once
  if (!html.includes('gh-legacy-service-theme.css')) {
    if (html.includes('gh-site-enhancements.css')) {
      html = html.replace(
        /(<link rel="stylesheet" href="(?:\.\.\/)?assets\/gh-site-enhancements\.css[^"]*">)/,
        `$1\n${themeLink}`
      );
    } else {
      html = html.replace('</head>', `${themeLink}</head>`);
    }
  }

  // Replace broken bilingual block with a short note (rules live in theme CSS)
  html = html.replace(
    /\/\* ═+[\s\S]*?BILINGUAL[\s\S]*?body\.is-en \.ar-block \{ display:none\s*!important; \}\s*/i,
    `/* Bilingual visibility: see assets/gh-legacy-service-theme.css */\n`
  );

  // Soft-disable custom cursor (causes broken UX / invisible pointer)
  html = html.replace(
    /@media \(pointer:fine\) \{ \*,\*::before,\*::after \{ cursor:none !important; \} \}/,
    '/* custom cursor disabled — site-wide pointer restored */'
  );

  // Stronger hero darkening for text contrast
  html = html.replace(
    '<div class="absolute inset-0 bg-black/30"></div>',
    '<div class="absolute inset-0 bg-black/55"></div>'
  );
  html = html.replace(
    'via-background/50 to-transparent',
    'via-background/80 to-background/40'
  );

  // EN meta
  const meta = EN_META[rel];
  if (meta) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
    html = html.replace(
      /<meta name="description" content="[^"]*"\/>/,
      `<meta name="description" content="${meta.description}"/>`
    );
    html = html.replace(
      /("name":")[^"]+(")/,
      `$1${meta.name}$2`
    );
    // JSON-LD description if present as Arabic
    html = html.replace(
      /("description":")[^"]+(")/,
      `$1${meta.description.replace(/"/g, '\\"')}$2`
    );
  }

  return html;
}

console.log('Patching legacy bilingual service pages…');
for (const rel of TARGETS) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  const before = fs.readFileSync(full, 'utf8');
  const after = patch(before, rel);
  if (after !== before) {
    fs.writeFileSync(full, after, 'utf8');
    console.log('  patched:', rel);
  } else {
    console.log('  unchanged:', rel);
  }
}
console.log('Done.');
