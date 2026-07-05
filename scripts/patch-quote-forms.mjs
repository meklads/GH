#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  'services/animation.html',
  'services/rendering.html',
  'services/production.html',
  'services/maquettes.html',
  'gh-visualization.html',
  'gh-photography.html',
  'gh-medical.html',
  'gh-maquettes.html',
];

for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('formsubmit.co')) continue;

  html = html.replace(
    /<form action="https:\/\/formsubmit\.co\/([^"]+)" method="POST"(?: target="_blank")?>/g,
    '<form class="gh-quote-form" action="https://formsubmit.co/ajax/$1" method="POST">'
  );
  html = html.replace(/<input type="email" name="email" placeholder="/g,
    '<input type="email" name="email" required placeholder="');
  if (!html.includes('class="form-feedback"')) {
    html = html.replace(
      /(<button type="submit" class="form-submit">)/,
      '<div class="form-feedback" aria-live="polite"></div>\n          $1'
    );
  }
  const depth = rel.split('/').length - 1;
  const prefix = depth ? '../'.repeat(depth) : '';
  const scriptTag = `<script defer src="${prefix}assets/quote-form.js"></script>`;
  if (!html.includes('quote-form.js')) {
    html = html.replace('</body>', scriptTag + '\n</body>');
  }
  fs.writeFileSync(file, html, 'utf8');
  console.log('Patched:', rel);
}
