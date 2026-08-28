#!/usr/bin/env node
/** Inject hero launch-system pills into homepage AR/EN. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARKER_START = '<!-- GH_HERO_LAUNCH -->';
const MARKER_END = '<!-- /GH_HERO_LAUNCH -->';

function readPartial(name) {
  return fs.readFileSync(path.join(ROOT, 'partials', name), 'utf8').trim();
}

function inject(indexRel, partialName) {
  const indexPath = path.join(ROOT, indexRel);
  let html = fs.readFileSync(indexPath, 'utf8');
  const block = readPartial(partialName);
  const marked = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`);

  if (marked.test(html)) {
    html = html.replace(marked, block);
  } else {
    const anchor = /(<\/p>\s*\n\s*<!-- Buttons -->)/;
    if (!anchor.test(html)) {
      console.error('  no hero launch slot in', indexRel);
      process.exit(1);
    }
    html = html.replace(anchor, `</p>\n\n${block}\n\n      <!-- Buttons -->`);
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  hero launch:', indexRel);
}

console.log('Patching hero launch CTAs…');
inject('index.html', 'home-hero-launch-en.html');
inject('index-ar.html', 'home-hero-launch-ar.html');
console.log('Done.');
