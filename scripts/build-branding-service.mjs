#!/usr/bin/env node
/**
 * Visual identity & spatial brand systems service (AR + EN)
 * Run: node scripts/build-branding-service.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';
import { getLayout } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'services');
const BASE = 'https://3dgraphicshouse.com';
const DEPTH = 1;
const P = '../';
const CSS_V = 6;
const BRAND = 'assets/branding';
const OG_IMG = `${BRAND}/jeddah-forum-mockup.png`;

/** Hero carousel — architectural half of each split mockup */
const HERO_SLIDES = [
  { img: `${BRAND}/jeddah-forum-mockup.png`, altAr: 'ملتقى جدة — تطبيق الهوية على واجهة معمارية', altEn: 'Jeddah Forum — identity on architectural facade' },
  { img: `${BRAND}/ruwaq-mockup.png`, altAr: 'رواق — لافتة ثلاثية الأبعاد', altEn: 'Ruwaq — 3D signage application' },
  { img: `${BRAND}/graphics-house-mockup.png`, altAr: 'Graphics House — تطبيق مكاني للهوية', altEn: 'Graphics House — spatial brand application' },
];

/** Large mockup showcase — full split-screen brand presentations */
const SHOWCASE = [
  {
    id: 'jeddah-forum',
    filter: 'forums',
    size: 'feature',
    featured: true,
    img: `${BRAND}/jeddah-forum-mockup.png`,
    titleAr: 'ملتقى جدة للعقار',
    titleEn: 'Jeddah Real Estate Forum',
    subAr: 'شعار، كتالوج ٤٤ صفحة، مجسم، وفيلم CGI — منظومة بصرية كاملة',
    subEn: 'Logo, 44-page catalogue, maquette & CGI film — complete visual system',
    catAr: 'دراسة حالة مميزة',
    catEn: 'Featured case study',
    hrefAr: '../case-studies/jeddah-real-estate-forum.html',
    hrefEn: '../case-studies/jeddah-real-estate-forum-en.html',
  },
  {
    id: 'ruwaq',
    filter: 'forums',
    size: 'half',
    img: `${BRAND}/ruwaq-mockup.png`,
    titleAr: 'رواق',
    titleEn: 'Ruwaq',
    subAr: 'هوية ذهبية لمعارض تفاعلية وجولات ثلاثية الأبعاد',
    subEn: 'Gold identity for interactive exhibitions & 3D tours',
    catAr: 'معارض تفاعلية',
    catEn: 'Interactive exhibitions',
    hrefAr: 'https://ruwaq.co/tours',
    hrefEn: 'https://ruwaq.co/tours',
    external: true,
  },
  {
    id: 'turriva',
    filter: 'group',
    size: 'half',
    img: `${BRAND}/turriva-mockup.png`,
    titleAr: 'توريفا',
    titleEn: 'Turriva',
    subAr: 'عمارة · تصميم داخلي · تشييد — هوية معمارية متكاملة',
    subEn: 'Architecture · interior · construction — integrated brand',
    catAr: 'علامات المجموعة',
    catEn: 'Group brands',
    hrefAr: 'https://turriva.com',
    hrefEn: 'https://turriva.com',
    external: true,
  },
  {
    id: 'graphics-house',
    filter: 'group',
    size: 'wide',
    img: `${BRAND}/graphics-house-mockup.png`,
    titleAr: 'Graphics House',
    titleEn: 'Graphics House',
    subAr: 'من الشعار إلى اللافتة المضيئة — استوديو الإظهار والهوية',
    subEn: 'From logo to illuminated signage — visualization & identity studio',
    catAr: 'علامات المجموعة',
    catEn: 'Group brands',
    hrefAr: '../who-we-are.html',
    hrefEn: '../who-we-are-en.html',
  },
  {
    id: 'bees-motion',
    filter: 'group',
    size: 'half',
    img: `${BRAND}/bees-motion-mockup.png`,
    titleAr: 'Bees Motion',
    titleEn: 'Bees Motion',
    subAr: 'إنتاج سينمائي وحركة — هوية ديناميكية',
    subEn: 'Cinematic & motion production — dynamic identity',
    catAr: 'إنتاج سينمائي',
    catEn: 'Cinematic production',
    hrefAr: 'https://beesmotion.com',
    hrefEn: 'https://beesmotion.com',
    external: true,
  },
  {
    id: 'scents-wave',
    filter: 'commercial',
    size: 'half',
    img: `${BRAND}/scents-wave-mockup.png`,
    titleAr: 'Scents Wave · موجة عطر',
    titleEn: 'Scents Wave',
    subAr: 'هوية فاخرة ذهبية على أسود — عطور وهدايا',
    subEn: 'Luxury gold-on-black identity — perfume & gifts',
    catAr: 'تجزئة وعلامات',
    catEn: 'Retail & consumer',
    hrefAr: '../contact-us.html',
    hrefEn: '../contact-us-en.html',
  },
  {
    id: 'highly-chic',
    filter: 'commercial',
    size: 'wide',
    img: `${BRAND}/highly-chic-mockup.png`,
    titleAr: 'Highly CHIC',
    titleEn: 'Highly CHIC',
    subAr: 'هوية بوتيك فاخرة — من الشعار إلى واجهة المتجر',
    subEn: 'Luxury boutique identity — from logo to storefront',
    catAr: 'تجزئة وعلامات',
    catEn: 'Retail & consumer',
    hrefAr: '../contact-us.html',
    hrefEn: '../contact-us-en.html',
  },
];

const COPY = {
  ar: {
    title: 'الهوية البصرية والأنظمة المكانية | Graphics House',
    description:
      'من الشعار إلى اللافتة المضيئة والكتالوج وجناح المعرض: نظام بصري واحد للمشاريع العقارية والملتقيات في السعودية والخليج. جزء من ProjectLaunch™ وBrandScale™.',
    kicker: 'خدماتنا · الهوية البصرية',
    h1: 'من الشعار إلى الواجهة — هوية تُرى وتُلمَس',
    lead:
      'نصمّم الهوية كمنظومة متكاملة: شعار، ألوان، كتالوج، وتطبيق مكاني على اللافتات والمعارض. ضمن <a href="../solutions/project-launch.html">ProjectLaunch™</a> للإطلاقات، <a href="../solutions/brand-scale.html">BrandScale™</a> للمحافظ، و<a href="../solutions/institutional-events.html">الفعاليات المؤسسية</a> للملتقيات.',
    ctaPrimary: 'ابدأ مشروع الهوية',
    ctaCase: 'استكشف الأعمال',
    scrollHint: 'استكشف',
    stats: [
      { n: '7+', label: 'علامات وهويات منجزة' },
      { n: '44', label: 'صفحة كتالوج — ملتقى جدة' },
      { n: '3D', label: 'تطبيق مكاني على اللافتات' },
      { n: '1', label: 'نظام بصري متصل' },
    ],
    pillarsTitle: 'أربعة محاور — مخرج واحد',
    pillarsLead: 'كل محور يُصمَّم ليعمل مع الإظهار والفيلم والمجسم، لا كملف منفصل.',
    pipelineTitle: 'مسار العمل',
    pipelineLead: 'نفس اللغة البصرية من الموجز الأول حتى آخر مطبوعة في المعرض.',
    pipeline: ['هوية', 'كتالوج', 'تطبيق مكاني', 'فيلم CGI', 'مطبوعات'],
    galleryTitle: 'أعمال الهوية',
    galleryLead: 'من التصميم المسطح إلى اللافتة المضيئة — شاهد كيف تتحول الهوية في الفضاء الحقيقي.',
    filters: [
      { id: 'all', label: 'الكل' },
      { id: 'forums', label: 'ملتقيات ومعارض' },
      { id: 'group', label: 'علامات المجموعة' },
      { id: 'commercial', label: 'تجزئة وعلامات' },
    ],
    pathsTitle: 'أين تناسب الهوية في حلولنا؟',
    paths: [
      {
        title: 'ProjectLaunch™',
        desc: 'الهوية المعمارية للمشروع ضمن حزمة الإطلاق على الخارطة.',
        href: 'solutions/project-launch.html',
      },
      {
        title: 'BrandScale™',
        desc: 'نظام علامة قابل للتوسع عبر محفظة مشاريع المطور.',
        href: 'solutions/brand-scale.html',
      },
      {
        title: 'الفعاليات المؤسسية',
        desc: 'هوية الملتقى والمعرض من الجناح إلى المواد المطبوعة.',
        href: 'solutions/institutional-events.html',
      },
    ],
    finalTitle: 'جاهز لبناء نظام بصري لمشروعك؟',
    finalBody: 'أرسل الموجز أو احجز جلسة. نرد خلال ٢٤ ساعة بمسار واضح للهوية والمخرجات.',
  },
  en: {
    title: 'Visual Identity & Spatial Brand Systems | Graphics House',
    description:
      'From logo to illuminated signage, catalogue, and exhibition pavilion: one visual system for developments and forums across KSA and the GCC. Part of ProjectLaunch™ and BrandScale™.',
    kicker: 'Our Services · Visual Identity',
    h1: 'From logo to facade — identity you see and feel',
    lead:
      'We design identity as an integrated system: logo, palette, catalogue, and spatial application on signage and exhibitions. Within <a href="../solutions/project-launch-en.html">ProjectLaunch™</a> for launches, <a href="../solutions/brand-scale-en.html">BrandScale™</a> for portfolios, and <a href="../solutions/institutional-events-en.html">institutional events</a> for forums.',
    ctaPrimary: 'Start your identity project',
    ctaCase: 'Explore the work',
    scrollHint: 'Explore',
    stats: [
      { n: '7+', label: 'Brands & identities delivered' },
      { n: '44', label: 'Catalogue pages — Jeddah Forum' },
      { n: '3D', label: 'Spatial signage application' },
      { n: '1', label: 'Connected visual system' },
    ],
    pillarsTitle: 'Four pillars — one deliverable system',
    pillarsLead: 'Each pillar is designed to work with visualization, film, and maquettes — not as a separate file.',
    pipelineTitle: 'How it connects',
    pipelineLead: 'The same visual language from first brief to the last print piece on the exhibition floor.',
    pipeline: ['BRAND', 'CATALOGUE', 'SPATIAL', 'CGI FILM', 'PRINT'],
    galleryTitle: 'Identity work',
    galleryLead: 'From flat design to illuminated signage — see how identity transforms in real space.',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'forums', label: 'Forums & exhibitions' },
      { id: 'group', label: 'Group brands' },
      { id: 'commercial', label: 'Retail & consumer' },
    ],
    pathsTitle: 'Where identity fits in our solutions',
    paths: [
      {
        title: 'ProjectLaunch™',
        desc: 'Architectural project identity inside the off-plan launch pack.',
        href: 'solutions/project-launch-en.html',
      },
      {
        title: 'BrandScale™',
        desc: 'Scalable brand system across a developer portfolio.',
        href: 'solutions/brand-scale-en.html',
      },
      {
        title: 'Institutional events',
        desc: 'Forum and exhibition identity from pavilion to print.',
        href: 'solutions/institutional-events-en.html',
      },
    ],
    finalTitle: 'Ready to build a visual system for your project?',
    finalBody: 'Send your brief or book a session. We reply within 24 hours with a clear identity path.',
  },
};

const PILLARS = {
  ar: [
    { icon: 'brush', title: 'الهوية البصرية', desc: 'شعار، ألوان، خطوط، زخارف، ودليل استخدام للمشروع أو الملتقى.' },
    { icon: 'menu_book', title: 'كتالوجات ومطبوعات', desc: 'كتالوجات فاخرة، بطاقات وحدات، ومواد مستثمرين بنفس اللغة البصرية.' },
    { icon: 'museum', title: 'تطبيق مكاني ومعارض', desc: 'جناح المعرض، صالة البيع، والرسومات البيئية في الفضاء.' },
    { icon: 'account_tree', title: 'نظام متصل', desc: 'الهوية تغذي <a href="cinematic-cgi.html">الفيلم</a> و<a href="rendering.html">الإظهار</a> و<a href="maquettes.html">المجسم</a> من مصدر واحد.' },
  ],
  en: [
    { icon: 'brush', title: 'Visual identity', desc: 'Logo, palette, typography, motifs, and usage guidelines for project or forum.' },
    { icon: 'menu_book', title: 'Catalogues & print', desc: 'Premium catalogues, unit sheets, and investor materials in one visual language.' },
    { icon: 'museum', title: 'Spatial & exhibition', desc: 'Pavilion, sales gallery, and environmental graphics in the space.' },
    { icon: 'account_tree', title: 'Connected system', desc: 'Identity feeds <a href="cinematic-cgi-en.html">film</a>, <a href="rendering-en.html">visualization</a>, and <a href="maquettes-en.html">maquettes</a> from one source.' },
  ],
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function page(lang) {
  const isEn = lang === 'en';
  const t = COPY[lang];
  const { header, footer } = getLayout(lang, DEPTH);
  const file = isEn ? 'branding-en.html' : 'branding.html';
  const canonical = `${BASE}/services/${file}`;
  const altEn = `${BASE}/services/branding-en.html`;
  const altAr = `${BASE}/services/branding.html`;
  const contact = `${P}contact-us${isEn ? '-en' : ''}.html`;
  const dir = isEn ? 'ltr' : 'rtl';
  const htmlLang = isEn ? 'en' : 'ar';

  const heroSlides = HERO_SLIDES.map((slide, i) => {
    const alt = isEn ? slide.altEn : slide.altAr;
    return `<div class="bid-hero-slide${i === 0 ? ' is-active' : ''}" data-bid-slide="${i}">
      <img src="${P}${slide.img}" alt="${esc(alt)}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>
    </div>`;
  }).join('\n');

  const heroDots = HERO_SLIDES.map(
    (_, i) => `<button type="button" class="bid-hero-dot${i === 0 ? ' is-active' : ''}" data-bid-dot="${i}" aria-label="Slide ${i + 1}"></button>`
  ).join('');

  const stats = t.stats
    .map((s) => `<div class="bid-stat reveal"><strong>${esc(s.n)}</strong><span>${esc(s.label)}</span></div>`)
    .join('');

  const pillars = PILLARS[lang]
    .map(
      (p) => `<article class="bid-pillar reveal">
      <span class="material-symbols-outlined" aria-hidden="true">${p.icon}</span>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    </article>`
    )
    .join('');

  const pipeline = t.pipeline
    .map((step, i) => {
      const arrow = i < t.pipeline.length - 1 ? `<span class="bid-pipe-arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span>` : '';
      return `<span class="bid-pipe-step">${esc(step)}</span>${arrow}`;
    })
    .join('\n');

  const filters = t.filters
    .map(
      (f, i) =>
        `<button type="button" class="bid-filter${i === 0 ? ' is-active' : ''}" data-bid-filter="${f.id}">${esc(f.label)}</button>`
    )
    .join('');

  const showcase = SHOWCASE.map((item) => {
    const finalHref = isEn ? item.hrefEn : item.hrefAr;
    const ext = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const title = isEn ? item.titleEn : item.titleAr;
    const sub = isEn ? item.subEn : item.subAr;
    const cat = isEn ? item.catEn : item.catAr;
    const sizeClass = item.size ? ` bid-showcase-item--${item.size}` : '';
    const tagClass = item.featured ? ' bid-showcase-tag--feat' : '';
    return `<a href="${finalHref}" class="bid-showcase-item${sizeClass} reveal" data-bid-cat="${item.filter}"${ext}>
      <figure class="bid-showcase-fig">
        <img src="${P}${item.img}" alt="${esc(title)}" loading="lazy">
        <figcaption class="bid-showcase-cap">
          <div class="bid-showcase-meta">
            <span class="bid-showcase-tag${tagClass}">${esc(cat)}</span>
            <h3>${esc(title)}</h3>
            <p class="bid-showcase-sub">${esc(sub)}</p>
          </div>
          <span class="bid-showcase-go material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </figcaption>
      </figure>
    </a>`;
  }).join('\n');

  const paths = t.paths
    .map(
      (p) => `<a href="${P}${p.href}" class="bid-path reveal">
      <strong>${esc(p.title)}</strong>
      <span>${esc(p.desc)}</span>
    </a>`
    )
    .join('');

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isEn ? 'Visual Identity & Spatial Brand Systems' : 'الهوية البصرية والأنظمة المكانية',
    description: t.description,
    url: canonical,
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  });

  return `<!DOCTYPE html>
<html class="dark scroll-smooth" dir="${dir}" lang="${htmlLang}">
<head>
<script src="${P}assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags(P)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="ar" href="${altAr}">
<link rel="alternate" hreflang="x-default" href="${altEn}">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BASE}/${OG_IMG}">
<link rel="stylesheet" href="${P}assets/site-header.css?v=8">
<link rel="stylesheet" href="${P}assets/gh-float-widgets.css?v=8">
<link rel="stylesheet" href="${P}assets/gh-branding-service.css?v=${CSS_V}">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
<script type="application/ld+json">${schema}</script>
</head>
<body class="bid-page" data-gh-service="branding">
${header}
<main id="main-content">
  <section class="bid-hero">
    <div class="bid-hero-slides" aria-hidden="true">
      ${heroSlides}
    </div>
    <div class="bid-hero-scrim" aria-hidden="true"></div>
    <div class="bid-hero-copy">
      <div class="bid-hero-copy-inner">
        <span class="bid-kicker">${esc(t.kicker)}</span>
        <h1>${esc(t.h1)}</h1>
        <p class="bid-lead">${t.lead}</p>
        <div class="bid-cta-row">
          <a class="bid-btn bid-btn--gold" href="${contact}" data-gh-cta="branding_primary">${esc(t.ctaPrimary)}</a>
          <a class="bid-btn bid-btn--ghost" href="#bid-gallery" data-gh-cta="branding_gallery">${esc(t.ctaCase)}</a>
        </div>
        <div class="bid-hero-dots">${heroDots}</div>
      </div>
    </div>
    <div class="bid-hero-scroll" aria-hidden="true">${esc(t.scrollHint)}<span></span></div>
  </section>

  <div class="bid-stats">
    <div class="bid-stats-inner">${stats}</div>
  </div>

  <section class="bid-section bid-section--lift" id="bid-gallery">
    <div class="bid-section-inner">
      <div class="bid-section-head bid-section-head--center reveal">
        <span class="bid-section-eyebrow">${isEn ? 'Portfolio' : 'معرض الأعمال'}</span>
        <h2>${esc(t.galleryTitle)}</h2>
        <p>${esc(t.galleryLead)}</p>
      </div>
      <div class="bid-filters reveal">${filters}</div>
      <div class="bid-showcase">${showcase}</div>
    </div>
  </section>

  <section class="bid-section bid-section--dark">
    <div class="bid-section-inner">
      <div class="bid-section-head reveal">
        <h2>${esc(t.pillarsTitle)}</h2>
        <p>${esc(t.pillarsLead)}</p>
      </div>
      <div class="bid-pillars">${pillars}</div>
    </div>
  </section>

  <section class="bid-section bid-section--dark">
    <div class="bid-section-inner">
      <div class="bid-section-head reveal">
        <h2>${esc(t.pipelineTitle)}</h2>
        <p>${esc(t.pipelineLead)}</p>
        <div class="bid-pipeline">${pipeline}</div>
      </div>
    </div>
  </section>

  <section class="bid-section bid-section--dark">
    <div class="bid-section-inner">
      <div class="bid-section-head reveal">
        <h2>${esc(t.pathsTitle)}</h2>
      </div>
      <div class="bid-paths">${paths}</div>
    </div>
  </section>

  <section class="bid-final">
    <h2>${esc(t.finalTitle)}</h2>
    <p>${esc(t.finalBody)}</p>
    <a class="bid-btn bid-btn--gold" href="${contact}" data-gh-cta="branding_final">${esc(t.ctaPrimary)}</a>
  </section>
</main>
${footer}
<script defer src="${P}assets/gh-float-widgets.js?v=8"></script>
<script defer src="${P}assets/site-header.js?v=8"></script>
<script>
(function(){
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.style.opacity='1';en.target.style.transform='none';io.unobserve(en.target);}});},{threshold:0.08});
    els.forEach(function(e){e.style.opacity='0';e.style.transform='translateY(24px)';io.observe(e);});
  }
  document.querySelectorAll('[data-bid-filter]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var f=btn.getAttribute('data-bid-filter');
      document.querySelectorAll('[data-bid-filter]').forEach(function(b){b.classList.toggle('is-active',b===btn);});
      document.querySelectorAll('[data-bid-cat]').forEach(function(card){
        card.classList.toggle('is-hidden',f!=='all'&&card.getAttribute('data-bid-cat')!==f);
      });
    });
  });
  var slides=document.querySelectorAll('[data-bid-slide]');
  var dots=document.querySelectorAll('[data-bid-dot]');
  var cur=0,timer;
  function go(n){
    if(!slides.length)return;
    cur=(n+slides.length)%slides.length;
    slides.forEach(function(s,i){s.classList.toggle('is-active',i===cur);});
    dots.forEach(function(d,i){d.classList.toggle('is-active',i===cur);});
  }
  function auto(){timer=setInterval(function(){go(cur+1);},6000);}
  dots.forEach(function(d){d.addEventListener('click',function(){clearInterval(timer);go(+d.getAttribute('data-bid-dot'));auto();});});
  if(slides.length>1)auto();
  if(window.gtag){gtag('event','service_view',{service_id:'branding',page_path:location.pathname});}
})();
</script>
</body>
</html>`;
}

function patchHeaderNav() {
  const brandingLink = {
    ar: `<a href="{{PREFIX}}services/branding.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">brush</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">الهوية البصرية</span>
                      <span class="mm-svc-desc">شعار، كتالوج، معارض — نظام بصري واحد</span>
                    </span>
                  </a>`,
    en: `<a href="{{PREFIX}}services/branding-en.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">brush</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">Visual identity</span>
                      <span class="mm-svc-desc">Logo, catalogue, exhibitions — one system</span>
                    </span>
                  </a>`,
  };

  for (const [lang, file] of [
    ['ar', 'header-ar.html'],
    ['en', 'header-en.html'],
  ]) {
    const fp = path.join(ROOT, 'partials', file);
    let html = fs.readFileSync(fp, 'utf8');
    const marker = '<!-- GH_BRANDING_NAV -->';
    if (html.includes(marker)) {
      html = html.replace(
        new RegExp(`${marker}[\\s\\S]*?${marker}`, 'm'),
        `${marker}\n${brandingLink[lang]}\n                  ${marker}`
      );
    } else {
      const anchor = lang === 'ar' ? 'services/rendering.html' : 'services/rendering-en.html';
      const needle = `<a href="{{PREFIX}}${anchor}" class="mm-svc-link">`;
      if (html.includes(needle) && !html.includes('services/branding')) {
        html = html.replace(needle, `${marker}\n${brandingLink[lang]}\n                  ${marker}\n                  ${needle}`);
      }
    }
    fs.writeFileSync(fp, html);
  }
}

for (const lang of ['ar', 'en']) {
  const name = lang === 'en' ? 'branding-en.html' : 'branding.html';
  fs.writeFileSync(path.join(OUT, name), page(lang), 'utf8');
  console.log('Wrote services/' + name);
}

patchHeaderNav();
console.log('Patched branding links in header partials');
