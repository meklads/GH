#!/usr/bin/env node
/**
 * Wrap <img> tags with <picture> when a matching .webp exists under assets/projects/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_RE = /<img([^>]*?)src="((?:\.\.\/)*assets\/projects\/[^"]+\.(?:jpe?g|png))"([^>]*)>/gi;

const SKIP_DIRS = new Set(['.git', 'node_modules', 'assets', 'partials', 'scripts', '.trash']);

function collectHtml(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      out.push(...collectHtml(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

function webpForSrc(src, htmlFile) {
  const clean = src.split('?')[0];
  let diskPath;
  if (clean.startsWith('assets/')) {
    diskPath = path.join(ROOT, clean);
  } else {
    const depth = htmlFile.split('/').length - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    if (!clean.startsWith(prefix)) return null;
    diskPath = path.join(ROOT, clean.slice(prefix.length));
  }
  const webpDisk = diskPath.replace(/\.(jpe?g|png)$/i, '.webp');
  if (!fs.existsSync(webpDisk)) return null;
  return clean.replace(/\.(jpe?g|png)$/i, '.webp');
}

function wrapProjectImages(html, rel) {
  return html.replace(IMG_RE, (full, pre, src, post, offset) => {
    const before = html.slice(Math.max(0, offset - 80), offset);
    if (before.includes('<picture>')) return full;
    const webp = webpForSrc(src, rel);
    if (!webp) return full;
    return `<picture><source srcset="${webp}" type="image/webp"><img${pre}src="${src}"${post}></picture>`;
  });
}

let patched = 0;
for (const rel of collectHtml(ROOT)) {
  const full = path.join(ROOT, rel);
  const before = fs.readFileSync(full, 'utf8');
  const after = wrapProjectImages(before, rel);
  if (after !== before) {
    fs.writeFileSync(full, after, 'utf8');
    patched++;
    console.log('  picture webp:', rel);
  }
}

console.log(`Done — picture/webp on ${patched} pages.`);
