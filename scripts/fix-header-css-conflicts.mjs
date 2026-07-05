#!/usr/bin/env node
/** Remove duplicate inline header CSS; add cache-bust query to site-header assets. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HEADER_BLOCK =
  /\/\* ===== HEADER ===== \*\/[\s\S]*?(?=\/\* ===== HERO ===== \*\/)/;

const CACHE_VER = '6';

function walk(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'node_modules'].includes(ent.name)) continue;
      out.push(...walk(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

let changed = 0;
for (const rel of walk(ROOT)) {
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  let next = html;

  if (HEADER_BLOCK.test(next)) {
    next = next.replace(HEADER_BLOCK, '/* Header: assets/site-header.css */\n\n');
  }

  next = next.replace(
    /href="((?:\.\.\/)*assets\/site-header\.css)(?:\?v=[^"]*)?"/g,
    `href="$1?v=${CACHE_VER}"`
  );
  next = next.replace(
    /src="((?:\.\.\/)*assets\/site-header\.js)(?:\?v=[^"]*)?"/g,
    `src="$1?v=${CACHE_VER}"`
  );

  if (next !== html) {
    fs.writeFileSync(full, next, 'utf8');
    changed++;
    console.log('Updated', rel);
  }
}

console.log(`Done. ${changed} files updated.`);
