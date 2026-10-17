#!/usr/bin/env node
/**
 * Upgrade Services mega menu to case-study-style image cards sitewide.
 * Run: node scripts/upgrade-services-mega.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const SERVICES_AR = [
  {
    href: 'services/animation.html',
    img: 'assets/projects/animation/rafal-pavilions.jpg',
    name: 'أفلام CGI سينمائية',
    desc: 'أفلام إطلاق وجولات متحركة',
  },
  {
    href: 'services/maquettes.html',
    img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
    name: 'مجسمات ذكية',
    desc: 'صالات البيع ولقاءات المستثمرين',
  },
  {
    href: 'services/interactive-experiences.html',
    img: 'assets/projects/maquettes/interactive-showroom-01.jpeg',
    name: 'تجارب تفاعلية',
    desc: 'شاشات لمس وجولات VR',
  },
  {
    href: 'services/galleries.html',
    img: 'assets/projects/galleries/makkah-charter-04.jpg',
    name: 'معارض وصالات البيع',
    desc: 'معارض مطورين وصالات بيع',
  },
  {
    href: 'services/production.html',
    img: 'assets/projects/production/camera-monitor.jpg',
    name: 'إنتاج إعلامي',
    desc: 'تصوير ومونتاج ومحتوى الحملات',
  },
  {
    href: 'services/branding.html',
    img: 'assets/projects/branding/jeddah-forum-premium.png',
    name: 'الهوية البصرية',
    desc: 'شعار، كتالوج، نظام بصري واحد',
  },
];

const SERVICES_EN = [
  {
    href: 'services/animation-en.html',
    img: 'assets/projects/animation/rafal-pavilions.jpg',
    name: 'Cinematic CGI',
    desc: 'Launch films and walkthrough animations',
  },
  {
    href: 'services/maquettes-en.html',
    img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
    name: 'Smart Maquettes',
    desc: 'Sales centres and investor meetings',
  },
  {
    href: 'services/interactive-experiences-en.html',
    img: 'assets/projects/maquettes/interactive-showroom-01.jpeg',
    name: 'Interactive Experiences',
    desc: 'Touchscreens and VR walkthroughs',
  },
  {
    href: 'services/galleries-en.html',
    img: 'assets/projects/galleries/makkah-charter-04.jpg',
    name: 'Exhibitions & sales galleries',
    desc: 'Developer exhibitions and sales galleries',
  },
  {
    href: 'services/production-en.html',
    img: 'assets/projects/production/camera-monitor.jpg',
    name: 'Media Production',
    desc: 'Filming, editing, and campaign content',
  },
  {
    href: 'services/branding-en.html',
    img: 'assets/projects/branding/jeddah-forum-premium.png',
    name: 'Visual Identity',
    desc: 'Logo, catalogue, one visual system',
  },
];

function detectPrefix(html, fromIndex) {
  const slice = html.slice(Math.max(0, fromIndex - 800), fromIndex + 2400);
  const m = slice.match(/(?:\.\.\/)+assets\//) || slice.match(/((?:\.\.\/)*)assets\//);
  if (m) {
    const full = slice.match(/((?:\.\.\/)+)assets\//);
    if (full) return full[1];
  }
  if (slice.includes('{{PREFIX}}')) return '{{PREFIX}}';
  return '';
}

function isEnglishPage(file, html) {
  if (/header-en\.html$|-en\.html$|\/index\.html$/.test(file.replace(/\\/g, '/'))) {
    if (file.endsWith('index.html') && !file.includes('index-ar')) {
      return /lang=["']en["']|dir=["']ltr["']|Capabilities that power/.test(html.slice(0, 4000));
    }
    if (file.endsWith('header-en.html')) return true;
    if (/-en\.html$/.test(file)) return true;
  }
  return /mega-menu-services">\s*<div class="mm-panel">[\s\S]{0,200}Capabilities that power/.test(html)
    || /lang=["']en["']/.test(html.slice(0, 500));
}

function cardHtml(item, prefix) {
  return (
    `<a href="${prefix}${item.href}" class="mm-svc-card">` +
    `<span class="mm-svc-thumb"><img src="${prefix}${item.img}" alt="" loading="lazy" width="640" height="400" decoding="async"></span>` +
    `<span class="mm-svc-name">${item.name}</span>` +
    `<span class="mm-svc-caption">${item.desc}</span>` +
    `<span class="material-symbols-outlined mm-svc-arrow" aria-hidden="true">arrow_forward</span>` +
    `</a>`
  );
}

function buildPanel(lang, prefix) {
  const items = lang === 'en' ? SERVICES_EN : SERVICES_AR;
  const dir = lang === 'en' ? '' : ' dir="rtl"';
  const label =
    lang === 'en' ? 'Capabilities that power the products' : 'التخصصات التي تشغّل المنتجات';
  const desc =
    lang === 'en'
      ? 'Execution specialties behind BrandScale™, ProjectLaunch™, and GrowthLaunch™ — not standalone products'
      : 'قدرات التنفيذ خلف BrandScale™ وProjectLaunch™ وGrowthLaunch™ — ليست منتجات منفصلة';
  const allHref = lang === 'en' ? `${prefix}index.html#disciplines` : `${prefix}index-ar.html#disciplines`;
  const allLabel = lang === 'en' ? 'View all capabilities' : 'عرض كل التخصصات';
  // Prefer portfolio-adjacent home anchors; fall back to services cluster on home
  const all =
    lang === 'en'
      ? `<a href="${prefix}index.html" class="mm-svc-all">${allLabel} <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>`
      : `<a href="${prefix}index-ar.html" class="mm-svc-all">${allLabel} <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>`;

  const cards = items.map((item) => cardHtml(item, prefix)).join('\n');
  return (
    `<div class="mega-menu mega-menu-services"${dir}>\n` +
    `          <div class="mm-panel">\n` +
    `            <div class="mm-panel-head">\n` +
    `              <span class="mm-panel-label">${label}</span>\n` +
    `              <p class="mm-panel-desc">${desc}</p>\n` +
    `            </div>\n` +
    `            <div class="mm-svc-list">\n${cards}\n            </div>\n` +
    `            ${all}\n` +
    `          </div>\n` +
    `        </div>`
  );
}

function replaceServicesMega(html, lang) {
  const marker = 'mega-menu mega-menu-services';
  const startAttr = html.indexOf(marker);
  if (startAttr === -1) return { html, changed: false };

  const openStart = html.lastIndexOf('<div', startAttr);
  if (openStart === -1) return { html, changed: false };

  let depth = 0;
  let i = openStart;
  let end = -1;
  while (i < html.length) {
    if (html.startsWith('<div', i)) {
      depth += 1;
      i += 4;
      continue;
    }
    if (html.startsWith('</div>', i)) {
      depth -= 1;
      i += 6;
      if (depth === 0) {
        end = i;
        break;
      }
      continue;
    }
    i += 1;
  }
  if (end === -1) return { html, changed: false };

  const prefix = detectPrefix(html, openStart);
  const next = buildPanel(lang, prefix);
  const updated = html.slice(0, openStart) + next + html.slice(end);
  return { html: updated, changed: updated !== html };
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '_Archive') continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

let changed = 0;
let skipped = 0;
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('mega-menu-services')) {
    skipped += 1;
    continue;
  }
  const lang = isEnglishPage(rel, html) ? 'en' : 'ar';
  const result = replaceServicesMega(html, lang);
  if (result.changed) {
    fs.writeFileSync(file, result.html, 'utf8');
    changed += 1;
    console.log('updated', rel, `(${lang})`);
  }
}

console.log(`Done. Updated ${changed} files.`);
