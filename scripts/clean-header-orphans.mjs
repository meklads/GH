#!/usr/bin/env node
/** Remove duplicate mega-menu fragments left after a bad header sync on index pages. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const ORPHAN_RE =
  /(<\/header>)\s*<div class="mm-main">[\s\S]*?<\/header>\s*(<!-- ===== HERO ===== -->)/;

for (const file of ['index.html', 'index-ar.html']) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  if (!ORPHAN_RE.test(html)) {
    console.log(`OK ${file}`);
    continue;
  }
  html = html.replace(ORPHAN_RE, '$1\n\n\n\n\n$2');
  fs.writeFileSync(full, html, 'utf8');
  console.log(`Cleaned ${file}`);
}
