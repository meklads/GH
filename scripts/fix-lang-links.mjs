#!/usr/bin/env node
/**
 * Fix AR/EN footer links and inject lang-switch.js sitewide.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const OLD_SCRIPT = /<script>\s*\/\/ Smart language switcher[\s\S]*?<\/script>\s*/g;

function collectHtmlFiles(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'partials', 'scripts', 'assets', 'node_modules'].includes(ent.name)) continue;
      out.push(...collectHtmlFiles(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

function assetPrefix(rel) {
  const depth = rel.split('/').length - 1;
  return depth > 0 ? '../'.repeat(depth) + 'assets/' : 'assets/';
}

// Partials
const footerArPath = path.join(ROOT, 'partials/footer-ar.html');
fs.writeFileSync(
  footerArPath,
  fs
    .readFileSync(footerArPath, 'utf8')
    .replace(
      /<a href="\/index-ar\.html"([^>]*>)English<\/a>/,
      '<a href="#" class="gh-lang-alt"$1English</a>'
    )
);

const footerEnPath = path.join(ROOT, 'partials/footer-en.html');
fs.writeFileSync(
  footerEnPath,
  fs
    .readFileSync(footerEnPath, 'utf8')
    .replace(
      /<a href="\{\{PREFIX\}\}index-ar\.html"([^>]*>)عربي<\/a>/,
      '<a href="#" class="gh-lang-alt"$1عربي</a>'
    )
);

let count = 0;
for (const rel of collectHtmlFiles(ROOT)) {
  if (rel === 'gh-admin.html') continue;
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  html = html.replace(OLD_SCRIPT, '');
  html = html.replace(
    /<a href="(?:\/|\.\.\/)*(?:index-ar\.html)"([^>]*>)English<\/a>/g,
    '<a href="#" class="gh-lang-alt"$1English</a>'
  );
  html = html.replace(
    /<a href="(?:\/|\.\.\/)*(?:index-ar\.html)"([^>]*>)عربي<\/a>/g,
    '<a href="#" class="gh-lang-alt"$1عربي</a>'
  );

  const prefix = assetPrefix(rel);
  const langTag = `<script defer src="${prefix}lang-switch.js?v=1"></script>`;
  if (html.includes('site-header.js') && !html.includes('lang-switch.js')) {
    html = html.replace(
      /(<script defer src="[^"]*site-header\.js[^"]*"><\/script>)/,
      `$1\n${langTag}`
    );
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    count++;
  }
}

console.log(`Patched ${count} HTML files`);
