#!/usr/bin/env node
/**
 * Wrap <img> tags with <picture> when a matching .webp exists under assets/projects/.
 * Also flattens accidental nested <picture> wrappers from prior buggy runs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_RE = /<img([^>]*?)src="((?:\.\.\/)*assets\/projects\/[^"]+\.(?:jpe?g|png))"([^>]*)>/gi;
const NESTED_PICTURE_RE =
  /(?:<picture>\s*<source\b[^>]*>\s*)+(<img\b[^>]*>)(?:\s*<\/picture>)+/gi;

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

/** Collapse nested picture>source>picture…img…/picture chains into one picture. */
function flattenNestedPictures(html) {
  return html.replace(NESTED_PICTURE_RE, (match, imgTag) => {
    const srcset = match.match(/srcset="([^"]+)"/i);
    const src = imgTag.match(/\ssrc="([^"]+)"/i);
    const webp =
      (srcset && srcset[1]) ||
      (src ? src[1].replace(/\.(jpe?g|png)(\?[^"]*)?$/i, '.webp$2') : null);
    if (!webp) return imgTag;
    return `<picture><source srcset="${webp}" type="image/webp">${imgTag}</picture>`;
  });
}

function alreadyInsidePicture(html, offset) {
  const before = html.slice(0, offset);
  const open = before.lastIndexOf('<picture');
  const close = before.lastIndexOf('</picture>');
  return open > close;
}

function wrapProjectImages(html, rel) {
  return html.replace(IMG_RE, (full, pre, src, post, offset) => {
    if (alreadyInsidePicture(html, offset)) return full;
    const webp = webpForSrc(src, rel);
    if (!webp) return full;
    return `<picture><source srcset="${webp}" type="image/webp"><img${pre}src="${src}"${post}></picture>`;
  });
}

let flattened = 0;
let patched = 0;
for (const rel of collectHtml(ROOT)) {
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  html = flattenNestedPictures(html);
  if (html !== before) flattened++;
  const wrapped = wrapProjectImages(html, rel);
  if (wrapped !== html) {
    html = wrapped;
    patched++;
    console.log('  picture webp:', rel);
  } else if (html !== before) {
    console.log('  picture flatten:', rel);
  }
  if (html !== before) fs.writeFileSync(full, html, 'utf8');
}

console.log(`Done — flattened ${flattened} pages, picture/webp on ${patched} pages.`);
