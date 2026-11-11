#!/usr/bin/env node
/**
 * Week 2, normalize legacy gold hex drift to canonical #C9A84C.
 * Run: node scripts/patch-gh-gold-tokens.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const CANONICAL = '#C9A84C';
const DRIFT = [
  ['#C9A84C', CANONICAL],
  ['#c9a84c', CANONICAL.toLowerCase()],
  ['#C9A84C', CANONICAL],
  ['#c9a84c', CANONICAL.toLowerCase()],
];

const SKIP_DIRS = new Set(['node_modules', '.git', 'assets/favicon']);
const EXT = new Set(['.html', '.css', '.mjs', '.js']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const rel = relative(ROOT, p);
    if (SKIP_DIRS.has(name) || rel.startsWith('node_modules')) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXT.has(name.slice(name.lastIndexOf('.')))) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let src = readFileSync(file, 'utf8');
  let next = src;
  for (const [from, to] of DRIFT) next = next.split(from).join(to);
  if (next !== src) {
    writeFileSync(file, next);
    changed++;
    console.log('patched', relative(ROOT, file));
  }
}
console.log(`Done. ${changed} file(s) updated.`);
