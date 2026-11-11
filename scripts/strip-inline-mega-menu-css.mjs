#!/usr/bin/env node
/** Remove duplicate inline mega-menu CSS; canonical styles live in assets/site-header.css */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = '/* Mega Menu */';
const RE = /\n\/\* Mega Menu \*\/[\s\S]*?(?=\n<\/style>)/;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (!['node_modules', '.git', 'partials'].includes(name)) walk(p, out);
    } else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes(MARKER)) continue;
  const next = html.replace(RE, '\n/* Mega menu: assets/site-header.css */');
  if (next === html) continue;
  fs.writeFileSync(file, next, 'utf8');
  console.log('Stripped:', path.relative(ROOT, file));
  n++;
}
console.log(`Done. ${n} files updated.`);
