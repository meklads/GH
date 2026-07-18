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

/** Real JPEG sources for aliases that were previously saved as HTML 404 pages. */
const REPAIR_FROM = {
  'anan-eskan-maquette-01.jpeg': 'anan-escan3.jpeg',
  'anan-eskan-maquette-02.jpeg': 'anan-escan4.jpeg',
  'anan-eskan-maquette-03.jpeg': 'Anan_Eskan_ryadh5-scaled-e1745137604161.jpg',
  'anan-eskan-maquette-04.jpeg': 'anan-escan3.jpeg',
  'alrajhi-maquette-01.jpeg': 'alrajhi2.jpeg',
  'alrajhi-maquette-02.jpeg': 'alrajhi3.jpeg',
  'alrajhi-maquette-03.jpeg': 'alrajhi2.jpeg',
  'maquette-detail-02.jpeg': 'WhatsApp-Image-1447-09-13-at-19.23.23.jpeg',
  'maquette-detail-03.jpeg': 'WhatsApp-Image-1447-09-13-at-19.18.51-1.jpeg',
  'maquette-detail-04.jpeg': 'WhatsApp-Image-1447-09-13-at-19.18.45-2.jpeg',
  'interactive-showroom-01.jpeg': 'mwl-humanity-exhibition-hero.jpeg',
};

function isCorruptImage(filePath) {
  if (!fs.existsSync(filePath)) return true;
  const buf = fs.readFileSync(filePath);
  if (buf.length < 100) return true;
  if (buf[0] === 0xff && buf[1] === 0xd8) return false; // JPEG
  if (buf[0] === 0x89 && buf[1] === 0x50) return false; // PNG
  const head = buf.subarray(0, 64).toString('utf8').toLowerCase();
  return head.includes('<!doctype') || head.includes('<html') || head.includes('<head');
}

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
let repaired = 0;
let webp = 0;
const useWebp = hasCwebp();

for (const [alias, source] of Object.entries(REPAIR_FROM)) {
  const aliasPath = path.join(MAQ_DIR, alias);
  const sourcePath = path.join(MAQ_DIR, source);
  if (!fs.existsSync(sourcePath)) continue;
  if (isCorruptImage(aliasPath)) {
    fs.copyFileSync(sourcePath, aliasPath);
    repaired++;
  }
}

for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
  const oldPath = path.join(MAQ_DIR, oldName);
  const newPath = path.join(MAQ_DIR, newName);
  if (!fs.existsSync(oldPath) || isCorruptImage(oldPath)) continue;
  if (!fs.existsSync(newPath) || isCorruptImage(newPath)) {
    fs.copyFileSync(oldPath, newPath);
    copied++;
  }
  if (useWebp) {
    const webpPath = newPath.replace(/\.jpe?g$/i, '.webp');
    if (!fs.existsSync(webpPath) || isCorruptImage(newPath)) {
      try {
        execSync(`cwebp -q 82 "${newPath}" -o "${webpPath}"`, { stdio: 'ignore' });
        webp++;
      } catch {
        /* skip */
      }
    }
  }
}

const EXTRA_WEBP = [
  'anan-escan3.jpeg',
  'alrajhi3.jpeg',
  'Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg',
];

// Ensure WebP exists for all renamed aliases (idempotent)
const ALIAS_WEBP = [...new Set([...Object.values(RENAME_MAP), ...EXTRA_WEBP])];
for (const file of ALIAS_WEBP) {
  const jpegPath = path.join(MAQ_DIR, file);
  if (!fs.existsSync(jpegPath) || !useWebp) continue;
  const webpPath = jpegPath.replace(/\.jpe?g$/i, '.webp');
  if (!fs.existsSync(webpPath)) {
    try {
      execSync(`cwebp -q 82 "${jpegPath}" -o "${webpPath}"`, { stdio: 'ignore' });
      webp++;
    } catch {
      /* skip */
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
  `Maquette assets: ${repaired} repaired, ${copied} aliases, ${webp} webp, ${filesPatched} files updated`
);
