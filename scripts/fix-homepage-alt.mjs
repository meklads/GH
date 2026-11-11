#!/usr/bin/env node
/**
 * Fill empty alt text on homepage portfolio / hero icons.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const ICON_ALTS = {
  en: {
    'assets/icons/tech.png': 'Architectural visualization',
    'assets/icons/gallery.png': 'Galleries and spatial design',
    'assets/icons/models.png': 'Smart maquettes',
    'assets/icons/interactive.png': 'Interactive experiences',
    'assets/icons/cinematic.png': 'Cinematic CGI',
  },
  ar: {
    'assets/icons/tech.png': 'الإظهار المعماري',
    'assets/icons/gallery.png': 'المعارض والتصميم المكاني',
    'assets/icons/models.png': 'المجسمات الذكية',
    'assets/icons/interactive.png': 'التجارب التفاعلية',
    'assets/icons/cinematic.png': 'أفلام CGI سينمائية',
  },
};

function patchFile(rel) {
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const lang = rel === 'index-ar.html' ? 'ar' : 'en';
  const alts = ICON_ALTS[lang];

  for (const [src, alt] of Object.entries(alts)) {
    const re = new RegExp(
      `(<img[^>]*src="${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*)alt=""`,
      'g'
    );
    html = html.replace(re, `$1alt="${alt}"`);
  }

  html = html.replace(
    /<div class="pf-item[^"]*"[\s\S]*?<img([^>]*?)alt=""([\s\S]*?<span class="pf-item-title">)([^<]+)(<\/span>[\s\S]*?<\/div>)/g,
    (block) => {
      const titleMatch = block.match(/<span class="pf-item-title">([^<]+)<\/span>/);
      if (!titleMatch) return block;
      const safe = titleMatch[1].replace(/"/g, '&quot;').trim();
      return block.replace(/alt=""/, `alt="${safe}"`);
    }
  );

  const galleryLabel = lang === 'ar' ? 'معرض ميثاق مكة' : 'Humanity Exhibition gallery';
  for (let i = 1; i <= 12; i += 1) {
    const num = String(i).padStart(2, '0');
    html = html.replace(
      `assets/news/makkah-charter-${num}.jpeg" alt=""`,
      `assets/news/makkah-charter-${num}.jpeg" alt="${galleryLabel} ${i}"`
    );
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    console.log('  alt text:', rel);
  }
}

console.log('Fixing homepage alt text…');
for (const rel of ['index.html', 'index-ar.html']) {
  patchFile(rel);
}
console.log('Done.');
