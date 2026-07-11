#!/usr/bin/env node
/**
 * Fix interactive service pages:
 * - Remove broken #vid-modal (leaked under footer)
 * - Remove play button that locks body scroll
 * - Swap imagery to Muslim World League interactive ceremony photos
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const PAGES = [
  {
    file: 'services/interactive-en.html',
    lang: 'en',
    caseStudy: '../case-study-mwl-en.html',
    portfolioHref: '../case-study-mwl-en.html',
    titles: {
      p1: 'MWL Interactive Maquette',
      p2: 'Makkah Charter Experience',
      p3: 'Interactive Exhibition Hall',
      overviewAlt: 'Muslim World League interactive maquette — Makkah Charter',
      heroAlt: 'Muslim World League interactive exhibition',
    },
  },
  {
    file: 'services/interactive.html',
    lang: 'ar',
    caseStudy: '../case-study-mwl.html',
    portfolioHref: '../case-study-mwl.html',
    titles: {
      p1: 'مجسم رابطة العالم الإسلامي التفاعلي',
      p2: 'تجربة ميثاق مكة',
      p3: 'قاعة المعرض التفاعلي',
      overviewAlt: 'مجسم تفاعلي لرابطة العالم الإسلامي — ميثاق مكة',
      heroAlt: 'المعرض التفاعلي لرابطة العالم الإسلامي',
    },
  },
];

function pic(src, alt, className) {
  const cls = className ? ` class="${className}"` : '';
  // Prefer webp when available (MWL hero has webp; news jpegs do not)
  if (src.endsWith('.webp') || src.includes('mwl-humanity')) {
    const jpeg = src.replace(/\.webp$/, '.jpeg');
    const webp = src.endsWith('.webp') ? src : src.replace(/\.jpeg$/, '.webp');
    return `<picture><source srcset="${webp}" type="image/webp"><img${cls} src="${jpeg}" alt="${alt}" loading="lazy"/></picture>`;
  }
  return `<img${cls} src="${src}" alt="${alt}" loading="lazy"/>`;
}

function fix(html, cfg) {
  // 1) Remove broken video modal (was visible under footer)
  html = html.replace(/<div id="vid-modal"[\s\S]*?<\/div>\s*/i, '');

  // 2) Remove overview play button (locks body.overflow without a real player)
  html = html.replace(
    /\s*<button class="play-btn[\s\S]*?<\/button>\s*/i,
    '\n'
  );

  // 3) Collapse nested <picture> spam → keep innermost img, then we replace srcs
  // Safer: replace known image blocks wholesale.

  const heroSrc = '../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg';
  const overviewSrc = '../assets/news/makkah-charter-01.jpeg';
  const p1 = '../assets/news/makkah-charter-04.jpeg';
  const p2 = '../assets/news/makkah-charter-02.jpeg';
  const p3 = '../assets/news/makkah-charter-07.jpeg';

  // Hero background image block (overlays live inside #hero-bg)
  html = html.replace(
    /<div id="hero-bg"[\s\S]*?<\/div>\s*(?=<div class="relative z-10)/,
    `<div id="hero-bg" class="absolute inset-x-0 -top-[10%] h-[120%] z-0">
    ${pic(heroSrc, cfg.titles.heroAlt, 'w-full h-full object-cover')}
    <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40"></div>
    <div class="absolute inset-0 bg-black/55"></div>
  </div>
  `
  );

  // Overview media (border frame + image + optional play)
  html = html.replace(
    /<div class="reveal w-full md:w-1\/2 relative" style="opacity:0;transform:translateY\(24px\);transition-delay:\.2s">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*\n\s*<!-- ── Process/,
    `<div class="reveal w-full md:w-1/2 relative" style="opacity:0;transform:translateY(24px);transition-delay:.2s">
      <div class="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4 pointer-events-none"></div>
      ${pic(overviewSrc, cfg.titles.overviewAlt, 'relative z-10 w-full shadow-2xl')}
    </div>
  </div>
</section>

<!-- ── Process`
  );

  // Portfolio grid — replace entire 3-card block
  const cards = [
    { src: p1, title: cfg.titles.p1, delay: '.05s' },
    { src: p2, title: cfg.titles.p2, delay: '.12s' },
    { src: p3, title: cfg.titles.p3, delay: '.2s' },
  ];
  const grid = cards
    .map(
      (c) => `    <div class="reveal group relative overflow-hidden border border-white/8 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1" style="opacity:0;transform:translateY(24px);transition-delay:${c.delay}">
      <div class="aspect-[4/3] overflow-hidden">${pic(c.src, c.title, 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110')}</div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="absolute bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-400">
        <h3 class="font-headline-md text-white mb-1">${c.title}</h3>
        <a href="${cfg.portfolioHref}" class="text-primary text-xs tracking-widest">Case Study →</a>
      </div>
    </div>`
    )
    .join('\n');

  html = html.replace(
    /<div class="grid grid-cols-1 md:grid-cols-3 gap-6">[\s\S]*?<\/div>\s*<\/section>\s*\n\s*<!-- ── YouTube/,
    `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">\n${grid}\n  </div>
</section>

<!-- ── YouTube`
  );

  // Bump service-page cache
  html = html.replace(/service-page\.js(\?v=\d+)?/g, 'service-page.js?v=4');

  return html;
}

console.log('Fixing interactive pages (MWL imagery + modal)…');
for (const cfg of PAGES) {
  const full = path.join(ROOT, cfg.file);
  if (!fs.existsSync(full)) {
    console.warn('  skip missing:', cfg.file);
    continue;
  }
  // Prefer AR case study URL that exists
  if (cfg.lang === 'ar') {
    const arCs = path.join(ROOT, 'case-study-mwl.html');
    if (!fs.existsSync(arCs)) {
      cfg.caseStudy = '../case-study-mwl-en.html';
      cfg.portfolioHref = '../case-study-mwl-en.html';
    }
  }
  const before = fs.readFileSync(full, 'utf8');
  const after = fix(before, cfg);
  fs.writeFileSync(full, after, 'utf8');
  console.log('  fixed:', cfg.file);
}
console.log('Done.');
