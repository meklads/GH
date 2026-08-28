#!/usr/bin/env node
/**
 * Generate WebP siblings for project, photography, and branding rasters (idempotent).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOTS = [
  path.join(ROOT, 'assets/projects'),
  path.join(ROOT, 'assets/photography'),
  path.join(ROOT, 'assets/branding'),
];

function hasCwebp() {
  try {
    execSync('which cwebp', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function walkImages(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkImages(full, out);
    else if (/\.(jpe?g|png)$/i.test(ent.name)) out.push(full);
  }
  return out;
}

if (!hasCwebp()) {
  console.warn('generate-project-webp: cwebp not found — skip WebP generation');
  process.exit(0);
}

let created = 0;
let skipped = 0;

for (const rootDir of ROOTS) {
  for (const srcPath of walkImages(rootDir)) {
    const webpPath = srcPath.replace(/\.(jpe?g|png)$/i, '.webp');
    if (fs.existsSync(webpPath) && fs.statSync(webpPath).mtimeMs >= fs.statSync(srcPath).mtimeMs) {
      skipped++;
      continue;
    }
    try {
      execSync(`cwebp -q 80 "${srcPath}" -o "${webpPath}"`, { stdio: 'ignore' });
      created++;
      console.log('  webp:', path.relative(ROOT, webpPath));
    } catch {
      console.warn('  skip:', path.relative(ROOT, srcPath));
    }
  }
}

console.log(`Asset WebP: ${created} created, ${skipped} up-to-date`);
