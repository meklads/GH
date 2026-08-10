#!/usr/bin/env node
/**
 * Light-theme the 9 AR service stub pages to match EN (#FAFAF8).
 * Run: node scripts/patch-service-stubs-light-theme.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const STUBS = [
  'ai-solutions.html',
  'branding.html',
  'cinematic-cgi.html',
  'digital-marketing.html',
  'interactive-experiences.html',
  'photography-media.html',
  'scale-models.html',
  'smart-visualization.html',
  'web-solutions.html',
];

const REPLACEMENTS = [
  [
    ':root{--gold:#C9A84C;--gold-light:#D9B860;--gold-dark:#A8883A;--text-primary:#FFFFFF;--text-secondary:rgba(255,255,255,0.7);--text-muted:rgba(255,255,255,0.35);--border-subtle:rgba(255,255,255,0.06);--border-medium:rgba(255,255,255,0.12);--heading-dark:#1A1A1A;--body-dark:#555555;--body-muted:#888888}',
    ':root{--gold:var(--gh-gold,#C9A84C);--gold-light:var(--gh-gold-light,#D9B860);--gold-dark:var(--gh-gold-dark,#A8883A);--text-primary:#1A1A1A;--text-secondary:rgba(26,26,26,0.65);--text-muted:rgba(26,26,26,0.4);--border-subtle:rgba(26,26,26,0.06);--border-medium:rgba(26,26,26,0.12);--heading-dark:#1A1A1A;--body-dark:#555555;--body-muted:#888888}',
  ],
  [
    'body{font-family:"Inter","Tajawal",-apple-system,BlinkMacSystemFont,sans-serif;background:#0A0A0A;color:var(--text-primary)',
    'body{font-family:"Inter","Tajawal",-apple-system,BlinkMacSystemFont,sans-serif;background:#FAFAF8;color:var(--text-primary)',
  ],
  [
    '.ud-card{max-width:720px;width:100%;text-align:center;padding:60px 40px;background:rgba(255,255,255,.02);border:1px solid var(--border-medium);border-radius:24px',
    '.ud-card{max-width:720px;width:100%;text-align:center;padding:60px 40px;background:#FFFFFF;border:1px solid rgba(26,26,26,0.08);border-radius:24px;box-shadow:0 12px 48px rgba(26,26,26,0.06)',
  ],
  [
    '.btn-pill-outline{background:transparent;color:#FAFAF8;border:2px solid rgba(255,255,255,.5)}',
    '.btn-pill-outline{background:transparent;color:#1A1A1A;border:2px solid rgba(26,26,26,0.22)}',
  ],
  [
    'background:#0A0A0A;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity .6s ease,visibility .6s ease',
    'background:#FAFAF8;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity .6s ease,visibility .6s ease',
  ],
  [
    '.footer{background:#0A0A0A;padding:60px 0 0;border-top:1px solid rgba(255,255,255,.04);margin-top:auto}',
    '.footer{display:none}',
  ],
];

const THEME_LINKS =
  '<link rel="stylesheet" href="../assets/gh-tokens.css?v=1">\n<link rel="stylesheet" href="../assets/gh-legacy-service-theme.css?v=4">\n';

for (const file of STUBS) {
  const path = join(ROOT, 'services', file);
  let html = readFileSync(path, 'utf8');
  for (const [from, to] of REPLACEMENTS) {
    html = html.split(from).join(to);
  }
  if (!html.includes('gh-legacy-service-theme.css')) {
    html = html.replace(
      /<link rel="stylesheet" href="\.\.\/assets\/site-header\.css[^"]*">/,
      `$&\n${THEME_LINKS}`
    );
  }
  writeFileSync(path, html);
  console.log('light-themed', file);
}
console.log(`Done — ${STUBS.length} AR service stubs.`);
