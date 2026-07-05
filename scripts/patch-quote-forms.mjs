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

const CAPTCHA = '<input type="hidden" name="_captcha" value="false">';

for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('formsubmit.co')) continue;

  html = html.replace(
    /<form class="gh-quote-form" action="https:\/\/formsubmit\.co\/ajax\/([^"]+)" method="POST">/g,
    '<form class="gh-quote-form" action="https://formsubmit.co/$1" method="POST">'
  );
  html = html.replace(
    /<form action="https:\/\/formsubmit\.co\/ajax\/([^"]+)" method="POST">/g,
    '<form class="gh-quote-form" action="https://formsubmit.co/$1" method="POST">'
  );

  if (!html.includes('name="_captcha"')) {
    html = html.replace(
      /(<form class="gh-quote-form"[^>]*>\s*)/,
      `$1${CAPTCHA}\n          `
    );
  }

  html = html.replace(
    /name="_next" value="https:\/\/3dgraphicshouse\.com\/([^"#]+)(?:#booking)?"/g,
    'name="_next" value="https://3dgraphicshouse.com/$1?sent=1#booking"'
  );

  const depth = rel.split('/').length - 1;
  const prefix = depth ? '../'.repeat(depth) : '';
  const scriptTag = `<script defer src="${prefix}assets/quote-form.js?v=2"></script>`;
  html = html.replace(/<script defer src="[^"]*quote-form\.js[^"]*"><\/script>\n?/g, '');
  if (!html.includes('quote-form.js')) {
    html = html.replace('</body>', scriptTag + '\n</body>');
  } else {
    html = html.replace('</body>', scriptTag + '\n</body>');
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log('Patched:', rel);
}
