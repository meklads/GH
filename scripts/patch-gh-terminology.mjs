#!/usr/bin/env node
/**
 * Week 1 — unify GH brand terminology across HTML + build scripts.
 * Run: node scripts/patch-gh-terminology.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');

/** Longest-first AR replacements (customer-facing copy) */
const AR_REPLACEMENTS = [
  ['\u0641\u0648\u062a\u0648\u0648\u0648\u0627\u0642\u0639\u064a', '\u0627\u0644\u0648\u0627\u0642\u0639\u064a'],
  [
    '\u0645\u0646 \u0627\u0644\u062a\u0635\u0648\u0631 \u0627\u0644\u0641\u0648\u062a\u0648\u0648\u0627\u0642\u0639\u064a',
    '\u0645\u0646 \u0627\u0644\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0645\u0639\u0645\u0627\u0631\u064a \u0627\u0644\u0648\u0627\u0642\u0639\u064a',
  ],
  [
    '\u0627\u0644\u0625\u0646\u062a\u0627\u062c \u0627\u0644\u0633\u064a\u0646\u0645\u0627\u0626\u064a\u060c \u0627\u0644\u0645\u0627\u0643\u064a\u062a\u0627\u062a \u0627\u0644\u0630\u0643\u064a\u0629',
    '\u0627\u0644\u0625\u0646\u062a\u0627\u062c \u0627\u0644\u0633\u064a\u0646\u0645\u0627\u0626\u064a CGI\u060c \u0627\u0644\u0645\u062c\u0633\u0645\u0627\u062a \u0627\u0644\u0630\u0643\u064a\u0629',
  ],
  ['\u0627\u0644\u0645\u0627\u0643\u064a\u062a\u0627\u062a \u0627\u0644\u0630\u0643\u064a\u0629', '\u0627\u0644\u0645\u062c\u0633\u0645\u0627\u062a \u0627\u0644\u0630\u0643\u064a\u0629'],
  ['\u0627\u0644\u0645\u0627\u0643\u064a\u062a\u0627\u062a', '\u0627\u0644\u0645\u062c\u0633\u0645\u0627\u062a'],
  ['\u0645\u0627\u0643\u064a\u062a\u0627\u062a \u0630\u0643\u064a\u0629', '\u0645\u062c\u0633\u0645\u0627\u062a \u0630\u0643\u064a\u0629'],
  ['\u0627\u0644\u0645\u0627\u0643\u064a\u062a \u0627\u0644\u0645\u0639\u0645\u0627\u0631\u064a', '\u0627\u0644\u0645\u062c\u0633\u0645 \u0627\u0644\u0645\u0639\u0645\u0627\u0631\u064a'],
  ['\u0645\u0627\u0643\u064a\u062a \u0645\u0639\u0645\u0627\u0631\u064a', '\u0645\u062c\u0633\u0645 \u0645\u0639\u0645\u0627\u0631\u064a'],
  ['\u0645\u0627\u0643\u064a\u062a\u0627\u062a', '\u0645\u062c\u0633\u0645\u0627\u062a'],
  [' \u00b7 \u0645\u0627\u0643\u064a\u062a', ' \u00b7 \u0645\u062c\u0633\u0645'],
  [
    '\u0623\u0639\u0645\u0627\u0644\u0646\u0627\u060c \u0628\u0648\u0631\u062a\u0641\u0648\u0644\u064a\u0648 \u062c\u0631\u0627\u0641\u064a\u0643\u0633 \u0647\u0627\u0648\u0633',
    '\u0623\u0639\u0645\u0627\u0644\u0646\u0627 | \u062c\u0631\u0627\u0641\u064a\u0643\u0633 \u0647\u0627\u0648\u0633',
  ],
  ['\u0628\u0648\u0631\u062a\u0641\u0648\u0644\u064a\u0648', '\u0645\u0639\u0631\u0636 \u0627\u0644\u0623\u0639\u0645\u0627\u0644'],
  ['\u062c\u0627\u0644\u064a\u0631\u064a\u0627\u062a \u0648\u062f\u064a\u0643\u0648\u0631 \u0625\u0639\u0644\u0627\u0646\u064a', '\u062c\u0627\u0644\u064a\u0631\u064a\u0627\u062a \u0648\u062f\u064a\u0643\u0648\u0631'],
  ['\u0644\u0644\u062d\u0642\u0646 \u0628\u0623\u0646\u0648\u0627\u0639\u0647\u0627', '\u0644\u0644\u0645\u0628\u0627\u0646\u064a \u0628\u0623\u0646\u0648\u0627\u0639\u0647\u0627'],
  [
    '\u062a\u0635\u0645\u064a\u0645 \u0648\u062a\u0646\u0641\u064a\u0630 \u0635\u0627\u0644\u0627\u062a \u0639\u0631\u0636 \u0648\u062f\u064a\u0643\u0648\u0631 \u0625\u0639\u0644\u0627\u0646\u064a \u0627\u062d\u062a\u0631\u0627\u0641\u064a',
    '\u062a\u0635\u0645\u064a\u0645 \u0648\u062a\u0646\u0641\u064a\u0630 \u0635\u0627\u0644\u0627\u062a \u0639\u0631\u0636 \u0648\u062c\u0627\u0644\u064a\u0631\u064a \u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a (\u062f\u064a\u0643\u0648\u0631 \u062a\u0635\u0645\u064a\u0645 \u0648\u062a\u0646\u0641\u064a\u0630)',
  ],
];

const EN_REPLACEMENTS = [
  ['Anan Eskan\u060c ', 'Anan Eskan \u2014 '],
  ['Al Rajhi\u060c ', 'Al Rajhi \u2014 '],
  ['Jeddah Forum\u060c ', 'Jeddah Forum \u2014 '],
  ['Rafal Pavilions\u060c ', 'Rafal Pavilions \u2014 '],
  ['Al Khair Heights\u060c ', 'Al Khair Heights \u2014 '],
  ['Makkah Charter\u060c ', 'Makkah Charter \u2014 '],
  ['Maquette\u060c ', 'Maquette \u2014 '],
  ['Cinematic Film\u060c ', 'Cinematic Film \u2014 '],
  ['Humanity Exhibition\u060c ', 'Humanity Exhibition \u2014 '],
  ['Financial Center\u060c ', 'Financial Center \u2014 '],
  ['\u060c ', ', '],
  ['interactive sales galleries', 'sales galleries (decor design & build)'],
  ['Galleries & Display Decoration', 'Galleries & Decor'],
  [
    '\u062a\u0635\u0645\u064a\u0645 \u0648\u062a\u0646\u0641\u064a\u0630 \u0635\u0627\u0644\u0627\u062a \u0639\u0631\u0636 \u0648\u062f\u064a\u0643\u0648\u0631 \u0625\u0639\u0644\u0627\u0646\u064a \u0627\u062d\u062a\u0631\u0627\u0641\u064a',
    'Design and build of showrooms and sales galleries (decor design & build)',
  ],
  ['\u062c\u0627\u0644\u064a\u0631\u064a\u0627\u062a \u0648\u062f\u064a\u0643\u0648\u0631 \u0625\u0639\u0644\u0627\u0646\u064a', 'Galleries & Decor'],
  [
    '4\ufe0f\u20e3 <strong>\u062c\u0627\u0644\u064a\u0631\u064a\u0627\u062a \u0648\u062f\u064a\u0643\u0648\u0631 \u0625\u0639\u0644\u0627\u0646\u064a</strong>\u060c',
    '4\ufe0f\u20e3 <strong>Galleries & Decor</strong>,',
  ],
];

const EXT = new Set(['.html', '.mjs', '.json']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'partials') continue;
      walk(full, out);
    } else if ([...EXT].some((e) => name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

function isEnPage(rel, text) {
  if (rel.endsWith('-en.html')) return true;
  const tag = text.match(/<html[^>]*>/i)?.[0] || '';
  return /lang=["']en["']/i.test(tag) && !/lang=["']ar["']/i.test(tag);
}

function applyReplacements(text, pairs) {
  let out = text;
  for (const [from, to] of pairs) {
    if (!from || from === to || !out.includes(from)) continue;
    out = out
      .split('\n')
      .map((line) => {
        if (line.includes('"ماكيت": "maquette"') && from.includes('\u0645\u0627\u0643\u064a\u062a')) {
          return line;
        }
        return line.split(from).join(to);
      })
      .join('\n');
  }
  return out;
}

function patchFile(abs) {
  const rel = relative(ROOT, abs);
  let text = readFileSync(abs, 'utf8');
  const before = text;
  text = applyReplacements(text, AR_REPLACEMENTS);
  if (isEnPage(rel, text)) text = applyReplacements(text, EN_REPLACEMENTS);
  if (text !== before) {
    writeFileSync(abs, text, 'utf8');
    return true;
  }
  return false;
}

const files = walk(ROOT).filter((f) => !f.includes('patch-gh-terminology.mjs'));
let changed = 0;
for (const f of files) {
  if (patchFile(f)) {
    changed++;
    console.log('patched', relative(ROOT, f));
  }
}
console.log(`\nDone: ${changed} file(s) updated.`);
