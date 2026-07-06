#!/usr/bin/env node
/**
 * Build city/location landing pages from locations/data/*.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'locations/data');
const OUT_DIR = path.join(ROOT, 'locations');

function extract(html, pattern) {
  const m = html.match(pattern);
  return m ? m[1] : '';
}

function getLayout(lang) {
  const file = lang === 'en' ? 'index.html' : 'index-ar.html';
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const header = extract(html, /(<header class="header" id="header">[\s\S]*?<\/header>)/);
  const footer = extract(
    html,
    lang === 'en'
      ? /(<footer dir="ltr"[\s\S]*?<\/footer>)/
      : /(<footer dir="rtl"[\s\S]*?<\/footer>)/
  );
  return { header, footer };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function prefixPaths(html, depth) {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return html
    .replace(/src="assets\//g, `src="${p}assets/`)
    .replace(/href="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, `href="${p}$1"`);
}

function headBlock(lang, meta) {
  const isEn = lang === 'en';
  const depth = 1;
  const p = '../';
  const base = 'https://3dgraphicshouse.com';
  const slug = meta.slug;
  const canonical = `${base}/locations/${slug}${isEn ? '-en' : ''}.html`;

  return `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="${p}assets/gh-forms-config.js"></script>
${analyticsHeadTags(p)}
<script src="${p}assets/quote-form-config.js"></script>
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${base}/locations/${slug}-en.html">
<link rel="alternate" hreflang="ar" href="${base}/locations/${slug}.html">
<link rel="alternate" hreflang="x-default" href="${base}/locations/${slug}-en.html">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(meta.title)} | Graphics House</title>
<meta name="description" content="${esc(meta.description)}"/>
<meta property="og:title" content="${esc(meta.title)} | Graphics House">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:image" content="${base}/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${p}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${p}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${p}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="${p}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${p}assets/site-header.css?v=12">
<link rel="stylesheet" href="${p}assets/gh-site-enhancements.css?v=8">
<link rel="stylesheet" href="${p}assets/gh-location.css?v=6">
<link rel="stylesheet" href="${p}assets/gh-float-widgets.css?v=2">
<script defer src="${p}assets/site-header.js?v=7"></script>
<script defer src="${p}assets/gh-performance.js?v=1"></script>
<script defer src="${p}assets/lang-switch.js?v=3"></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Graphics House — ' + meta.city,
    description: meta.description,
    url: canonical,
    telephone: meta.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: meta.city,
      addressCountry: 'SA',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Graphics House',
      url: base,
    },
  })}</script>
</head>
<body class="gh-location">`;
}

const CLIENT_LOGOS = [
  { file: 'al-oyonypng.png', alt: { ar: 'العيوني', en: 'Al-Oyony' } },
  { file: 'anan-eskan.png', alt: { ar: 'أنان إسكان', en: 'Anan Eskan' } },
  { file: 'toyota.png', alt: { ar: 'تويوتا', en: 'Toyota' } },
  { file: 'imc-150x150.png', alt: { ar: 'المركز الطبي الدولي', en: 'IMC' } },
  { file: 'rafal.png', alt: { ar: 'رفال', en: 'Rafal' } },
  { file: 'al-owla.png', alt: { ar: 'الأولى', en: 'Al-Owla' } },
  { file: 'makyon.png', alt: { ar: 'مكيون', en: 'Makyon' } },
  { file: 'bn-zooma.png', alt: { ar: 'بن زومة', en: 'Bn Zooma' } },
  { file: 'aqarat.png', alt: { ar: 'عقارات', en: 'Aqarat' } },
  { file: 'oteck.png', alt: { ar: 'أوتك', en: 'Oteck' } },
  { file: 'رابطة العالم الاسلامي.png', alt: { ar: 'رابطة العالم الإسلامي', en: 'Muslim World League' } },
];

function clientLogosStrip(lang, depth) {
  const isEn = lang === 'en';
  const p = depth > 0 ? '../'.repeat(depth) : '';
  const items = [];
  for (let set = 0; set < 3; set += 1) {
    for (const logo of CLIENT_LOGOS) {
      const src = `${p}assets/clients-logo/${encodeURIComponent(logo.file)}`;
      items.push(
        `<div class="gh-loc-cli-item"><img src="${src}" alt="${esc(L(logo.alt, lang))}" loading="lazy"></div>`
      );
    }
  }
  return `<section class="gh-loc-clients" aria-label="${isEn ? 'Trusted clients' : 'عملاؤنا'}">
  <p class="gh-loc-clients-label">${isEn ? 'Trusted By' : 'يثق بنا'}</p>
  <div class="gh-loc-cli-wrap">
    <div class="gh-loc-cli-track">${items.join('')}</div>
  </div>
</section>`;
}

function tailScripts() {
  return `
<script defer src="../assets/gh-float-widgets.js?v=1"></script>
<script>
window.addEventListener("scroll",function(){var h=document.getElementById("header");if(h)h.classList.toggle("scrolled",window.scrollY>80)});
(function(){
  var t=document.querySelector(".gh-loc-cli-track");
  if(!t)return;
  var oneSet=t.scrollWidth/3,pos=0,speed=0.7,paused=false;
  function run(){if(!paused){pos-=speed;if(pos<=-oneSet)pos+=oneSet;t.style.transform="translateX("+pos+"px)";}requestAnimationFrame(run);}
  t.addEventListener("mouseenter",function(){paused=true});
  t.addEventListener("mouseleave",function(){paused=false});
  run();
})();
</script>
</body></html>`;
}

function L(obj, lang) {
  return lang === 'en' ? obj.en : obj.ar;
}

function cardsHtml(items, p, lang) {
  return items
    .map((s) => {
      const href = s.href.startsWith('http') ? s.href : `${p}${s.href}`;
      return `<a href="${href}" class="gh-loc-card">
        <span class="material-symbols-outlined">${esc(s.icon)}</span>
        <h3>${esc(L(s.title, lang))}</h3>
        <p>${esc(L(s.desc, lang))}</p>
      </a>`;
    })
    .join('');
}

function buildPage(data, lang) {
  const isEn = lang === 'en';
  const { header, footer } = getLayout(lang);
  const depth = 1;
  const p = '../';
  const slug = data.slug;
  const outName = `${slug}${isEn ? '-en' : ''}.html`;

  const coreServices = data.coreServices || (data.services || []).slice(0, 3);
  const products = data.products || (data.services || []).slice(3, 6);

  const coreServicesHtml = cardsHtml(coreServices, p, lang);
  const productsHtml = cardsHtml(products, p, lang);
  const clientsHtml = clientLogosStrip(lang, depth);

  const whyHtml = data.why.items
    .map(
      (w) => `<div class="gh-loc-why-item">
        <h3>${esc(L(w.title, lang))}</h3>
        <p>${esc(L(w.desc, lang))}</p>
      </div>`
    )
    .join('');

  const checklistHref = `${p}insights/downloads/visual-launch-checklist${isEn ? '-en' : ''}.html`;
  const contactHref = `${p}contact-us${isEn ? '-en' : ''}.html`;
  const portfolioHref = `${p}portfolio${isEn ? '-en' : ''}.html`;

  const cityName = L(data.city, lang);
  const servicesLead = data.servicesLead
    ? L(data.servicesLead, lang)
    : (isEn
      ? 'End-to-end visual production for developers launching residential towers, gated communities, and mixed-use destinations.'
      : 'إنتاج بصري متكامل للمطورين الذين يطلقون أبراجاً سكنية ومجمعات ومشاريع مختلطة.');
  const officeHeading = data.office.heading
    ? L(data.office.heading, lang)
    : (isEn ? `${cityName} office` : `مكتب ${cityName}`);

  const html = `${headBlock(lang, {
    slug,
    title: L(data.title, lang),
    description: L(data.metaDescription, lang),
    city: L(data.city, lang),
    phone: data.office.phone,
  })}
${prefixPaths(header.replace('class="header"', 'class="header scrolled"'), depth)}
<main>
  <section class="gh-loc-hero">
    <div class="gh-loc-hero-inner">
      <div class="gh-loc-hero-copy">
        <span class="gh-loc-kicker">${isEn ? 'Graphics House · Saudi Arabia' : 'جرافيكس هاوس · المملكة العربية السعودية'}</span>
        <h1>${esc(L(data.title, lang))}</h1>
        <p>${esc(L(data.subtitle, lang))}</p>
        <div class="gh-loc-hero-cta">
          <a href="${contactHref}" class="gh-loc-btn gh-loc-btn--gold">${isEn ? 'Book Strategy Session' : 'احجز جلسة استراتيجية'}</a>
          <a href="${checklistHref}" class="gh-loc-btn gh-loc-btn--outline">${isEn ? 'Free Launch Checklist PDF' : 'تحميل قائمة الإطلاق مجاناً'}</a>
        </div>
      </div>
      <figure class="gh-loc-hero-media">
        <img src="${p}${data.heroImage}" alt="${esc(L(data.city, lang))}" loading="eager">
      </figure>
    </div>
  </section>
  ${clientsHtml}
  <section class="gh-loc-section">
    <h2>${isEn ? `What we deliver in ${cityName}` : `ماذا نقدّم في ${cityName}`}</h2>
    <p class="gh-loc-section-lead">${esc(servicesLead)}</p>
    <h3 class="gh-loc-subhead">${isEn ? 'Core Services' : 'الخدمات الرئيسية'}</h3>
    <div class="gh-loc-grid gh-loc-grid--3">${coreServicesHtml}</div>
    <h3 class="gh-loc-subhead">${isEn ? 'Main Products' : 'المنتجات الرئيسية'}</h3>
    <div class="gh-loc-grid gh-loc-grid--3">${productsHtml}</div>
  </section>
  <section class="gh-loc-section" style="padding-top:0">
    <h2>${esc(L(data.why.title, lang))}</h2>
    <div class="gh-loc-why-grid">${whyHtml}</div>
  </section>
  <section class="gh-loc-cta-band">
    <h2>${isEn ? 'See our work' : 'شاهد أعمالنا'}</h2>
    <p>${isEn
    ? 'Explore portfolio projects across the GCC — renders, films, smart maquettes, and interactive sales systems.'
    : 'استعرض مشاريعنا في الخليج — رندرات، أفلام، مجسمات ذكية، ومنصات مبيعات تفاعلية.'}</p>
    <a href="${portfolioHref}" class="gh-loc-btn gh-loc-btn--outline">${isEn ? 'View Portfolio' : 'معرض الأعمال'}</a>
  </section>
  <section class="gh-loc-section">
    <h2>${esc(officeHeading)}</h2>
    <div class="gh-loc-office">
      <span>${esc(L(data.office.address, lang))}</span>
      <span>${isEn ? 'CR' : 'س.ت'}: ${esc(data.office.cr)}</span>
      <a href="tel:${data.office.phone.replace(/\s/g, '')}">${esc(data.office.phone)}</a>
    </div>
  </section>
</main>
${prefixPaths(footer, depth)}
${tailScripts()}`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, outName), html, 'utf8');
  console.log('  location:', outName);
}

function updateSitemap(locations) {
  const smPath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(smPath)) return;
  let xml = fs.readFileSync(smPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  for (const data of locations) {
    for (const suffix of ['', '-en']) {
      const loc = `https://3dgraphicshouse.com/locations/${data.slug}${suffix}.html`;
      if (xml.includes(loc)) continue;
      xml = xml.replace(
        '</urlset>',
        `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.82</priority></url>\n</urlset>`
      );
    }
  }
  fs.writeFileSync(smPath, xml, 'utf8');
  console.log('  sitemap: locations added');
}

console.log('Building location pages…');
const locations = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')));

for (const data of locations) {
  buildPage(data, 'ar');
  buildPage(data, 'en');
}
updateSitemap(locations);
console.log('Done.');
