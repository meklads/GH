#!/usr/bin/env node
/**
 * Add tldr + directAnswer fields to insight articles (from excerpt / first paragraph).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'insights/data/articles');

const CUSTOM = {
  'visual-launch-checklist-guide': {
    tldr: {
      ar: 'ابدأ الإطلاق البصري قبل الحفر بـ6 أشهر: اعتمد المخطط، أنتج 8-12 أصلاً بطولياً، درّب المبيعات، وأطلق بصالة بيع ومنصة رقمية متسقة, لا تنتظر يوم إعلان المبيعات.',
      en: 'Start visual launch 6 months before groundbreaking: approve the master plan, produce 8-12 hero assets, train sales, and launch with a consistent gallery and digital platform, do not wait for sales announcement day.',
    },
    directAnswer: {
      ar: 'المطور في السعودية والخليج يحتاج قبل إطلاق مبيعات off-plan: جدول إنتاج بصري من 6 أشهر، 8-12 أصلاً معتمدة (واجهات، داخلية، فيلم، مواد صالة)، مالك إطلاق واحد من التسويق، وصالة بيع جاهزة يوم الإعلان.',
      en: 'GCC developers launching off-plan sales need: a 6-month visual production timeline, 8-12 approved hero assets (facades, interiors, film, gallery materials), one marketing launch owner, and a sales gallery ready on announcement day.',
    },
  },
};

function firstParagraph(body, lang) {
  const blocks = body?.[lang] || body?.en || [];
  for (const b of blocks) {
    if (b.type === 'p' && b.text) return b.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  }
  return '';
}

function truncate(s, max = 280) {
  const t = String(s || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

let updated = 0;
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const full = path.join(DIR, file);
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  const slug = data.slug || file.replace('.json', '');
  const custom = CUSTOM[slug];
  let changed = false;

  if (!data.tldr) {
    data.tldr = custom?.tldr || {
      ar: data.excerpt?.ar || '',
      en: data.excerpt?.en || '',
    };
    changed = true;
  }

  if (!data.directAnswer) {
    data.directAnswer = custom?.directAnswer || {
      ar: truncate(firstParagraph(data.body, 'ar') || data.excerpt?.ar),
      en: truncate(firstParagraph(data.body, 'en') || data.excerpt?.en),
    };
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    updated += 1;
    console.log('  patched:', file);
  }
}

console.log(`Patched ${updated} article JSON files.`);
