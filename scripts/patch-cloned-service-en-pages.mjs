#!/usr/bin/env node
/**
 * Fix cloned EN service pages (maquettes/animation/production):
 * - broken ghSubmit (missing }) kills reveal script → invisible body
 * - wrong assets/ paths in CSS (need ../assets/)
 * - inject site-reveal.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = [
  'services/maquettes-en.html',
  'services/animation-en.html',
  'services/production-en.html',
];

const SOURCE_MAP = {
  'services/maquettes-en.html': 'scripts/service-en-sources/smart-maquettes-en.html',
  'services/animation-en.html': 'scripts/service-en-sources/3d-animation-en.html',
  'services/production-en.html': 'scripts/service-en-sources/media-production-en.html',
};

function patchHtml(html, depth = 1) {
  const p = depth > 0 ? '../'.repeat(depth) : '';

  html = html.replace(/url\((['"])assets\//g, `url($1${p}assets/`);
  html = html.replace(/src="assets\//g, `src="${p}assets/`);

  html = html.replace(
    /\(function\(\)\{var els=document\.querySelectorAll\("\.reveal"\)[\s\S]*?\}\)\(\)\s*;?\s*/g,
    ''
  );
  html = html.replace(
    /\(\s*function\s*\(\)\s*\{\s*var els=document\.querySelectorAll\("\.reveal"\)[\s\S]*?\}\s*\)\s*\(\s*\)\s*;?/g,
    ''
  );

  html = html.replace(/\nfunction ghSubmit\(e\)\{[\s\S]*?(?=<\/script>)/g, '');
  html = html.replace(
    /<script>\s*function ghSubmit\(e\)\{[\s\S]*?<\/script>\s*/g,
    ''
  );
  html = html.replace(/<script>\s*;\s*\n/g, '<script>\n');

  if (!html.includes('site-reveal.js')) {
    const tag = `<script defer src="${p}assets/site-reveal.js"></script>\n`;
    html = html.replace(/<\/body>/i, `${tag}</body>`);
  }

  return html;
}

console.log('Patching cloned EN service pages…');
for (const rel of TARGETS) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  const before = fs.readFileSync(full, 'utf8');
  const after = patchHtml(before);
  if (after !== before) {
    fs.writeFileSync(full, after, 'utf8');
    console.log('  patched:', rel);
  }
  const srcRel = SOURCE_MAP[rel];
  if (srcRel) {
    const srcFull = path.join(ROOT, srcRel);
    if (fs.existsSync(srcFull)) {
      const srcBefore = fs.readFileSync(srcFull, 'utf8');
      const srcAfter = patchHtml(srcBefore, 0);
      if (srcAfter !== srcBefore) {
        fs.writeFileSync(srcFull, srcAfter, 'utf8');
        console.log('  source:', srcRel);
      }
    }
  }
}
console.log('Done.');
