#!/usr/bin/env node
/** Inject unified home ecosystem section (products + disciplines) into index AR/EN. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const MARKER_START = '<!-- GH_HOME_ECOSYSTEM -->';
const MARKER_END = '<!-- /GH_HOME_ECOSYSTEM -->';
const LEGACY_START = '<!-- ===== SERVICES SECTION';

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
    const legacy = /<!-- ===== SERVICES SECTION[\s\S]*?<\/section>\s*\n(?=<!-- ===== SERVICE DETAILS)/;
    if (!legacy.test(html)) {
      console.error('  no ecosystem slot in', indexRel);
      process.exit(1);
    }
    html = html.replace(legacy, `${block}\n\n`);
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  home ecosystem:', indexRel);
}

console.log('Patching home ecosystem sections…');
inject('index-ar.html', 'home-ecosystem-ar.html');
inject('index.html', 'home-ecosystem-en.html');
console.log('Done.');
