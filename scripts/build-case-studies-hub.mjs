#!/usr/bin/env node
/**
 * Case studies hub (casestudy1.html / casestudy1-en.html) + nav mega menu.
 * Run: node scripts/build-case-studies-hub.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';
import { getLayout } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'case-studies/data/hub.json'), 'utf8'));
const BASE = 'https://3dgraphicshouse.com';
const CSS_V = 1;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function L(obj, lang) {
  return obj[lang] || obj.en || '';
}

function renderMegaMenu(lang) {
  const isEn = lang === 'en';
  const dir = isEn ? 'ltr' : 'rtl';
  const hubFile = isEn ? 'casestudy1-en.html' : 'casestudy1.html';
  const h = DATA.hub[lang];
  const items = DATA.items
    .filter((item) => item.mega !== false && (item.shortTitle || item.mega))
    .sort((a, b) => (a.megaOrder || 99) - (b.megaOrder || 99));

  const cards = items
    .map((item) => {
      const name = L(item.shortTitle || item.title, lang);
      return `<a href="{{PREFIX}}${item.href[lang]}" class="mm-cs-row">
      <span class="mm-cs-thumb"><img src="{{PREFIX}}${item.image}" alt="" loading="lazy" width="96" height="72"></span>
      <span class="mm-cs-name">${esc(name)}</span>
      <span class="material-symbols-outlined mm-cs-arrow" aria-hidden="true">arrow_forward</span>
    </a>`;
    })
    .join('\n');

  const label = isEn ? 'Case Studies' : 'مشاريع ناجحة';
  const viewAll = h.megaViewAll || (isEn ? 'View all case studies' : 'عرض كل المشاريع');

  return `<div class="nav-mega-item" data-mega="casestudies">
        <button type="button" class="nav-link nav-mega-trigger" aria-expanded="false" aria-haspopup="true">
          ${label}
          <span class="material-symbols-outlined nav-chevron" aria-hidden="true">expand_more</span>
        </button>
        <div class="mega-menu mega-menu-casestudies" dir="${dir}">
          <div class="mm-panel">
            <div class="mm-panel-head">
              <span class="mm-panel-label">${esc(h.h1)}</span>
              <p class="mm-panel-desc">${esc(h.megaLead || h.lead)}</p>
            </div>
            <div class="mm-cs-list">${cards}</div>
            <a href="{{PREFIX}}${hubFile}" class="mm-cs-all">${viewAll} <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
          </div>
        </div>
      </div>`;
}

function patchHeaderPartial(name) {
  const file = path.join(ROOT, 'partials', name);
  let html = fs.readFileSync(file, 'utf8');
  const isEn = name.includes('-en');
  const lang = isEn ? 'en' : 'ar';
  const mega = renderMegaMenu(lang);

  const simpleLink = isEn
    ? /<a class="nav-link" href="\{\{PREFIX\}\}casestudy1-en\.html">Case Studies<\/a>/
    : /<a class="nav-link" href="\{\{PREFIX\}\}casestudy1\.html">مشاريع ناجحة<\/a>/;

  const megaBlock =
    /<!-- GH_CS_MEGA_START -->[\s\S]*?<!-- GH_CS_MEGA_END -->/;

  if (megaBlock.test(html)) {
    html = html.replace(megaBlock, `<!-- GH_CS_MEGA_START -->\n${mega}\n      <!-- GH_CS_MEGA_END -->`);
  } else if (simpleLink.test(html)) {
    html = html.replace(simpleLink, `<!-- GH_CS_MEGA_START -->\n${mega}\n      <!-- GH_CS_MEGA_END -->`);
  } else if (!html.includes('data-mega="casestudies"')) {
    console.warn(`[case-studies-hub] Could not patch ${name}`);
  }
  fs.writeFileSync(file, html);
}

function renderHubCard(item, lang, i) {
  const h = DATA.hub[lang];
  const featured = item.featured
    ? `<span class="csh-badge">${esc(h.featured)}</span>`
    : '';
  const delay = (i * 0.06).toFixed(2);
  return `<a href="${item.href[lang]}" class="csh-card${item.featured ? ' csh-card--featured' : ''} reveal" style="opacity:0;transform:translateY(20px);transition-delay:${delay}s" data-cta="case-hub-${item.href[lang].replace(/[^\w]+/g, '-')}">
  <div class="csh-card-img">
    <img src="${item.image}" alt="${esc(L(item.title, lang))}" loading="lazy" width="640" height="400">
    ${featured}
  </div>
  <div class="csh-card-body">
    <span class="csh-location">${esc(L(item.location, lang))}</span>
    <h2>${esc(L(item.title, lang))}</h2>
    <p class="csh-tag">${esc(L(item.tag, lang))}</p>
    <span class="csh-link">${esc(h.viewAll)} <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></span>
  </div>
</a>`;
}

function buildPage(lang) {
  const isEn = lang === 'en';
  const h = DATA.hub[lang];
  const { header, footer } = getLayout(lang, 0);
  const file = isEn ? 'casestudy1-en.html' : 'casestudy1.html';
  const canonical = `${BASE}/${file}`;
  const altEn = `${BASE}/casestudy1-en.html`;
  const altAr = `${BASE}/casestudy1.html`;
  const dir = isEn ? 'ltr' : 'rtl';
  const htmlLang = isEn ? 'en' : 'ar';
  const home = isEn ? '/' : '/index-ar.html';
  const langSwitch = isEn
    ? `<a href="index-ar.html" class="lang-switch-link" hreflang="ar">AR</a><span class="lang-switch-sep">|</span><a href="index.html" class="lang-switch-link is-active" hreflang="en">EN</a>`
    : `<a href="index-ar.html" class="lang-switch-link is-active" hreflang="ar">AR</a><span class="lang-switch-sep">|</span><a href="index.html" class="lang-switch-link" hreflang="en">EN</a>`;

  const cards = DATA.items.map((item, i) => renderHubCard(item, lang, i)).join('\n');

  const schemaItems = DATA.items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: L(item.title, lang),
    url: `${BASE}/${item.href[lang]}`,
  }));

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h.h1,
    description: h.description,
    url: canonical,
    inLanguage: lang,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: schemaItems,
    },
  });

  return `<!DOCTYPE html>
<html class="dark scroll-smooth" dir="${dir}" lang="${htmlLang}">
<head>
<script src="assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags('')}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="ar" href="${altAr}">
<link rel="alternate" hreflang="x-default" href="${altEn}">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(h.title)}</title>
<meta name="description" content="${esc(h.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(h.title)}">
<meta property="og:description" content="${esc(h.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BASE}/${DATA.items[0].image}">
<link rel="stylesheet" href="assets/site-header.css?v=8">
<link rel="stylesheet" href="assets/gh-float-widgets.css?v=8">
<link rel="stylesheet" href="assets/gh-case-studies-hub.css?v=${CSS_V}">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
<script type="application/ld+json">${schema}</script>
</head>
<body class="csh-page">
${header}
<main id="main-content">
  <section class="csh-hero">
    <div class="container">
      <span class="csh-eyebrow">${esc(h.eyebrow)}</span>
      <h1>${esc(h.h1)}</h1>
      <p class="csh-lead">${esc(h.lead)}</p>
    </div>
  </section>
  <section class="csh-grid-section">
    <div class="container">
      <div class="csh-grid">${cards}</div>
    </div>
  </section>
</main>
${footer}
<script defer src="assets/gh-float-widgets.js?v=8"></script>
<script defer src="assets/site-header.js?v=8"></script>
<script>
(function(){
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.style.opacity='1';e.style.transform='none';});return;}
  var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.style.opacity='1';en.target.style.transform='none';io.unobserve(en.target);}});},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(e){io.observe(e);});
})();
</script>
</body>
</html>`;
}

patchHeaderPartial('header-ar.html');
patchHeaderPartial('header-en.html');

fs.writeFileSync(path.join(ROOT, 'casestudy1.html'), buildPage('ar'));
fs.writeFileSync(path.join(ROOT, 'casestudy1-en.html'), buildPage('en'));

console.log('Built case studies hub: casestudy1.html, casestudy1-en.html');
console.log('Patched header mega menus (AR + EN)');
