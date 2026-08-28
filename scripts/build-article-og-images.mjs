#!/usr/bin/env node
/** Generate 1200×630 OG images for all insight articles (AR + EN). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARTICLES_DIR = path.join(ROOT, 'insights/data/articles');
const OUT_DIR = path.join(ROOT, 'assets/insights/og');
const W = 1200;
const H = 630;

function escSvg(t) {
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapTitle(text, maxLen = 44, maxLines = 3) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxLen && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
    if (lines.length >= maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines) {
    const joined = lines.join(' ');
    if (joined.length < text.length) {
      lines[maxLines - 1] = `${lines[maxLines - 1].replace(/…$/, '').slice(0, maxLen - 2)}…`;
    }
  }
  return lines.length ? lines : [String(text).slice(0, maxLen)];
}

function overlaySvg({ title, category, isEn }) {
  const lines = wrapTitle(title);
  const x = isEn ? 64 : W - 64;
  const anchor = isEn ? 'start' : 'end';
  const titleFont = isEn ? 'Inter, Arial, sans-serif' : "'Noto Sans Arabic', 'Arial Unicode MS', Arial, sans-serif";
  const tspans = lines
    .map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : 42}">${escSvg(l)}</tspan>`)
    .join('');

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0A0A" stop-opacity="0.08"/>
      <stop offset="50%" stop-color="#0A0A0A" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#0A0A0A" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#ogGrad)"/>
  <rect x="${isEn ? 64 : W - 136}" y="${H - 210}" width="72" height="3" fill="#C9A84C"/>
  <text x="${x}" y="${H - 178}" fill="#C9A84C" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="2.5" text-anchor="${anchor}">${escSvg(String(category).toUpperCase())}</text>
  <text x="${x}" y="${H - 132}" fill="#FAFAF8" font-family="${titleFont}" font-size="34" font-weight="700" text-anchor="${anchor}" direction="${isEn ? 'ltr' : 'rtl'}">${tspans}</text>
  <text x="${x}" y="${H - 40}" fill="rgba(255,255,255,0.5)" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="500" text-anchor="${anchor}">Graphics House · 3dgraphicshouse.com</text>
</svg>`;
}

function loadArticles() {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')));
}

export function articleOgAssetPath(article, lang) {
  return `assets/insights/og/${article.slug}${lang === 'en' ? '-en' : ''}.jpg`;
}

async function generateOne(article, lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const srcPath = path.join(ROOT, article.image);
  const outPath = path.join(ROOT, articleOgAssetPath(article, lang));

  if (!fs.existsSync(srcPath)) {
    console.warn('  skip OG (missing hero):', article.slug, lang);
    return false;
  }

  const svg = Buffer.from(
    overlaySvg({
      title: L(article.title),
      category: L(article.category),
      isEn,
    })
  );

  await sharp(srcPath)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outPath);

  return true;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const articles = loadArticles();
  let count = 0;
  console.log('Generating article OG images…');
  for (const article of articles) {
    for (const lang of ['ar', 'en']) {
      if (await generateOne(article, lang)) {
        console.log('  og:', articleOgAssetPath(article, lang));
        count += 1;
      }
    }
  }
  console.log(`Done — ${count} OG image(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
