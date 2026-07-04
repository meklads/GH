#!/usr/bin/env node
/**
 * Copy a root landing page into a services/*.html path with depth-aware links.
 * Usage: node scripts/copy-landing-to-service.mjs <source.html> <dest.html>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const [srcRel, destRel] = process.argv.slice(2);
if (!srcRel || !destRel) {
  console.error('Usage: node scripts/copy-landing-to-service.mjs <source.html> <dest.html>');
  process.exit(1);
}

const src = path.join(ROOT, srcRel);
const dest = path.join(ROOT, destRel);
const depth = destRel.split('/').length - 1;
const prefix = depth > 0 ? '../'.repeat(depth) : '';

let html = fs.readFileSync(src, 'utf8');

// Fix missing mob-nav wrapper in gh-visualization
if (!html.includes('id="mob-nav"') && html.includes('id="mob-close"')) {
  html = html.replace(
    /(<\/header>\s*\n\s*\n\s*\n\s*\n)(\s*<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px)/,
    '$1<div id="mob-nav">\n$2'
  );
}

html = html.replace(/href="assets\//g, `href="${prefix}assets/`);
html = html.replace(/src="assets\//g, `src="${prefix}assets/`);
html = html.replace(/data-video="assets\//g, `data-video="${prefix}assets/`);
html = html.replace(/poster="assets\//g, `poster="${prefix}assets/`);

html = html.replace(/href="solutions\//g, `href="${prefix}solutions/`);
html = html.replace(/href="services\//g, `href="${prefix}services/`);

const rootPages = [
  'who-we-are.html', 'portfolio.html', 'casestudy1.html', 'contact-us.html',
  'privacy-policy.html', 'faq.html', 'index-ar.html', 'index.html',
  'gh-photography.html', 'gh-maquettes.html', 'gh-visualization.html',
  'marketing.html', 'interactive-experiences.html',
];
for (const page of rootPages) {
  html = html.replace(new RegExp(`href="${page.replace('.', '\\.')}"`, 'g'), `href="${prefix}${page}"`);
}

html = html.replace(/href="\/index-ar\.html"/g, `href="${prefix}index-ar.html"`);
html = html.replace(/href="\/"/g, `href="${prefix}index-ar.html"`);

// Same-folder service links (e.g. services/rendering.html -> maquettes.html)
const destDir = path.dirname(destRel);
if (destDir.startsWith('services')) {
  html = html.replace(new RegExp(`href="${prefix}services/([^"]+)"`, 'g'), (m, file) => {
    return `href="${file}"`;
  });
}

fs.writeFileSync(dest, html, 'utf8');
console.log(`Copied ${srcRel} -> ${destRel} (prefix: "${prefix}")`);
