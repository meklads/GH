#!/usr/bin/env node
/**
 * Generate WebP siblings for assets/projects raster images (idempotent).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = path.join(ROOT, 'assets/projects');

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

for (const srcPath of walkImages(PROJECTS)) {
  const webpPath = srcPath.replace(/\.(jpe?g|png)$/i, '.webp');
  if (fs.existsSync(webpPath) && fs.statSync(webpPath).mtimeMs >= fs.statSync(srcPath).mtimeMs) {
    skipped++;
    continue;
  }
  try {
    execSync(`cwebp -q 82 "${srcPath}" -o "${webpPath}"`, { stdio: 'ignore' });
    created++;
  } catch {
    console.warn('  skip:', path.relative(ROOT, srcPath));
  }
}

console.log(`Project WebP: ${created} created, ${skipped} up-to-date`);
