#!/usr/bin/env node
/**
 * Wrap homepage maquette JPEGs with <picture> when a matching .webp exists.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = ['index.html', 'index-ar.html'];

function hasWebp(src) {
  const rel = src.split('?')[0];
  const webp = rel.replace(/\.(jpe?g|png)$/i, '.webp');
  return fs.existsSync(path.join(ROOT, webp)) ? webp : null;
}

function wrapMaquetteImages(html) {
  return html.replace(
    /<img([^>]*?)src="(assets\/projects\/maquettes\/[^"]+\.(?:jpe?g|png))"([^>]*)>/gi,
    (full, pre, src, post) => {
      if (full.includes('<picture>')) return full;
      const webp = hasWebp(src);
      if (!webp) return full;
      const altM = full.match(/alt="([^"]*)"/i);
      const alt = altM ? ` alt="${altM[1]}"` : '';
      const loading = /loading=/.test(full) ? '' : ' loading="lazy"';
      const fetch = src.includes('mwl-humanity') ? ' fetchpriority="high"' : '';
      const styleM = full.match(/style="([^"]*)"/i);
      const style = styleM ? ` style="${styleM[1]}"` : '';
      return `<picture><source srcset="${webp}" type="image/webp"><img${pre}src="${src}"${alt}${loading}${fetch}${style}></picture>`;
    }
  );
}

for (const file of TARGETS) {
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  const after = wrapMaquetteImages(before);
  if (after !== before) {
    fs.writeFileSync(full, after, 'utf8');
    console.log('  picture webp:', file);
  }
}

console.log('Done — homepage picture/webp pass.');
