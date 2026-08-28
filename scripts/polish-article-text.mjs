#!/usr/bin/env node
/**
 * Polish article JSON text: remove em/en dash punctuation, normalize ranges.
 * Usage: node scripts/polish-article-text.mjs [--write]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, '../insights/data/articles');
const WRITE = process.argv.includes('--write');

/** @param {string} text @param {'ar'|'en'|null} lang */
export function polishText(text, lang = null) {
  if (!text || typeof text !== 'string') return text;
  let s = text;

  // Numeric ranges: 6–4, 3–5, 60–90, 10–15
  s = s.replace(/(\d+)\s*[–—]\s*(\d+)/g, (_, a, b) => {
    if (lang === 'ar') return `من ${a} إلى ${b}`;
    return `${a} to ${b}`;
  });

  // Month labels
  s = s.replace(/الشهر\s+(\d+)\s*[–—]\s*(\d+)/g, 'الشهر من $1 إلى $2');
  s = s.replace(/Month\s+(\d+)\s*[–—]\s*(\d+)/gi, 'Month $1 to $2');

  // Em dash with spaces → sentence break or comma
  s = s.replace(/\s*—\s*/g, () => {
    if (lang === 'ar') return '، ';
    return ', ';
  });

  // Remaining en dashes used as punctuation (not in URLs)
  s = s.replace(/\s+–\s+/g, () => (lang === 'ar' ? '، ' : ', '));

  // Title-style compound dashes without spaces: Finishes–Spec
  s = s.replace(/([^\s])[–—]([^\s])/g, (_, a, b) => {
    if (lang === 'ar') return `${a} و${b}`;
    return `${a} and ${b}`;
  });

  // Cleanup double punctuation
  s = s.replace(/،\s*،/g, '،');
  s = s.replace(/,\s*,/g, ',');
  s = s.replace(/\s{2,}/g, ' ').trim();

  return s;
}

function polishValue(value, lang) {
  if (typeof value === 'string') return polishText(value, lang);
  if (Array.isArray(value)) return value.map((v) => polishValue(v, lang));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      let fieldLang = lang;
      if (k === 'ar') fieldLang = 'ar';
      else if (k === 'en') fieldLang = 'en';
      else if (k === 'items' && lang) fieldLang = lang;
      out[k] = polishValue(v, fieldLang);
    }
    return out;
  }
  return value;
}

function polishArticle(article) {
  const out = { ...article };
  for (const key of ['title', 'excerpt', 'metaDescription', 'imageCredit']) {
    if (out[key]) {
      out[key] = {
        ar: polishText(out[key].ar, 'ar'),
        en: polishText(out[key].en, 'en'),
      };
    }
  }
  if (out.body) {
    out.body = {
      ar: polishValue(out.body.ar, 'ar'),
      en: polishValue(out.body.en, 'en'),
    };
  }
  if (out.faq) {
    out.faq = out.faq.map((item) => ({
      ar: { q: polishText(item.ar?.q, 'ar'), a: polishText(item.ar?.a, 'ar') },
      en: { q: polishText(item.en?.q, 'en'), a: polishText(item.en?.a, 'en') },
    }));
  }
  if (out.keywords) {
    out.keywords = {
      ar: {
        short: (out.keywords.ar?.short || []).map((k) => polishText(k, 'ar')),
        long: (out.keywords.ar?.long || []).map((k) => polishText(k, 'ar')),
      },
      en: {
        short: (out.keywords.en?.short || []).map((k) => polishText(k, 'en')),
        long: (out.keywords.en?.long || []).map((k) => polishText(k, 'en')),
      },
    };
  }
  return out;
}

function countDashes(text) {
  if (!text) return 0;
  return (String(text).match(/[—–]/g) || []).length;
}

function walkDashes(obj) {
  let n = 0;
  if (typeof obj === 'string') n += countDashes(obj);
  else if (Array.isArray(obj)) obj.forEach((v) => { n += walkDashes(v); });
  else if (obj && typeof obj === 'object') Object.values(obj).forEach((v) => { n += walkDashes(v); });
  return n;
}

const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'));
let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const fp = path.join(ARTICLES_DIR, file);
  const raw = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const before = walkDashes(raw);
  const polished = polishArticle(raw);
  const after = walkDashes(polished);
  totalBefore += before;
  totalAfter += after;
  if (WRITE) {
    fs.writeFileSync(fp, `${JSON.stringify(polished, null, 2)}\n`, 'utf8');
  }
  console.log(`${file}: ${before} → ${after} dashes`);
}

console.log(`\nTotal: ${totalBefore} → ${totalAfter}${WRITE ? ' (written)' : ' (dry run)'}`);
