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

const SECURITY = `          <div class="gh-form-security">
            <div class="gh-honeypot" aria-hidden="true">
              <label>لا تملأ</label>
              <input type="text" name="_honey" tabindex="-1" autocomplete="off">
            </div>
            <div class="gh-turnstile"></div>
          </div>`;

for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('formsubmit.co')) continue;

  html = html.replace(/\s*<input type="hidden" name="_captcha" value="false">\s*/g, '\n');

  if (!html.includes('gh-form-security')) {
    html = html.replace(
      /(\s*<div class="form-feedback"[^>]*><\/div>)/,
      `\n${SECURITY}\n$1`
    );
  }

  const depth = rel.split('/').length - 1;
  const prefix = depth ? '../'.repeat(depth) : '';
  html = html.replace(/<script defer src="[^"]*quote-form[^"]*"><\/script>\n?/g, '');
  const scripts =
    `<script defer src="${prefix}assets/quote-form-config.js"></script>\n` +
    `<script defer src="${prefix}assets/quote-form.js?v=3"></script>\n`;
  html = html.replace('</body>', scripts + '</body>');

  fs.writeFileSync(file, html, 'utf8');
  console.log('Patched:', rel);
}
