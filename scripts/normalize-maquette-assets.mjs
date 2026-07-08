#!/usr/bin/env node
/**
 * Rename WhatsApp maquette filenames to professional aliases and update references.
 * Keeps original files for backward compatibility.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAQ_DIR = path.join(ROOT, 'assets/projects/maquettes');

const RENAME_MAP = {
  'mwl-humanity-exhibition-hero.jpeg': 'mwl-humanity-exhibition-hero.jpeg',
  'interactive-showroom-01.jpeg': 'interactive-showroom-01.jpeg',
  'anan-eskan-maquette-01.jpeg': 'anan-eskan-maquette-01.jpeg',
  'maquette-detail-02.jpeg': 'maquette-detail-02.jpeg',
  'maquette-detail-03.jpeg': 'maquette-detail-03.jpeg',
  'maquette-detail-04.jpeg': 'maquette-detail-04.jpeg',
  'anan-eskan-maquette-02.jpeg': 'anan-eskan-maquette-02.jpeg',
  'anan-eskan-maquette-03.jpeg': 'anan-eskan-maquette-03.jpeg',
  'anan-eskan-maquette-04.jpeg': 'anan-eskan-maquette-04.jpeg',
  'alrajhi-maquette-01.jpeg': 'alrajhi-maquette-01.jpeg',
  'alrajhi-maquette-02.jpeg': 'alrajhi-maquette-02.jpeg',
  'alrajhi-maquette-03.jpeg': 'alrajhi-maquette-03.jpeg',
};

function hasCwebp() {
  try {
    execSync('which cwebp', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function collectTextFiles(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'node_modules', '.trash'].includes(ent.name)) continue;
      out.push(...collectTextFiles(path.join(dir, ent.name), rel));
    } else if (/\.(html|mjs|js|css|json|md)$/i.test(ent.name)) {
      out.push(rel);
    }
  }
  return out;
}

let copied = 0;
let webp = 0;
const useWebp = hasCwebp();

for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
  const oldPath = path.join(MAQ_DIR, oldName);
  const newPath = path.join(MAQ_DIR, newName);
  if (!fs.existsSync(oldPath)) continue;
  if (!fs.existsSync(newPath)) {
    fs.copyFileSync(oldPath, newPath);
    copied++;
  }
  if (useWebp) {
    const webpPath = newPath.replace(/\.jpe?g$/i, '.webp');
    if (!fs.existsSync(webpPath)) {
      try {
        execSync(`cwebp -q 82 "${newPath}" -o "${webpPath}"`, { stdio: 'ignore' });
        webp++;
      } catch {
        /* skip */
      }
    }
  }
}

let filesPatched = 0;
for (const rel of collectTextFiles(ROOT)) {
  const full = path.join(ROOT, rel);
  let text = fs.readFileSync(full, 'utf8');
  let changed = false;
  for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
    if (!text.includes(oldName)) continue;
    text = text.split(oldName).join(newName);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(full, text, 'utf8');
    filesPatched++;
  }
}

console.log(
  `Maquette assets: ${copied} aliases, ${webp} webp, ${filesPatched} files updated`
);
