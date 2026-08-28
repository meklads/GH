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
const CSS_V = 2;
const HERO = 'assets/projects/branding/jeddah-forum-premium.png';
const CASE_IMG = 'assets/projects/branding/jeddah-forum-premium.png';
const SHOWCASE = 'assets/projects/branding/portfolio-showcase.png';

const GALLERY = [
  {
    filter: 'forums',
    img: 'assets/projects/branding/jeddah-forum-premium.png',
    logo: false,
    light: false,
    titleAr: 'ملتقى جدة للعقار',
    titleEn: 'Jeddah Real Estate Forum',
    catAr: 'ملتقيات ومعارض',
    catEn: 'Forums & exhibitions',
    hrefAr: '../case-studies/jeddah-real-estate-forum.html',
    hrefEn: '../case-studies/jeddah-real-estate-forum-en.html',
  },
  {
    filter: 'forums',
    img: 'assets/projects/branding/jeddah-forum-lockup.png',
    logo: true,
    light: true,
    titleAr: 'ملتقى جدة — الهوية',
    titleEn: 'Jeddah Forum — identity lockup',
    catAr: 'هوية بصرية',
    catEn: 'Visual identity',
    hrefAr: '../case-studies/jeddah-real-estate-forum.html',
    hrefEn: '../case-studies/jeddah-real-estate-forum-en.html',
  },
  {
    filter: 'forums',
    img: 'assets/projects/branding/target-alhadaf.png',
    logo: true,
    light: true,
    titleAr: 'الهدف — تنظيم المعارض والمؤتمرات',
    titleEn: 'Target — exhibitions & conferences',
    catAr: 'ملتقيات ومعارض',
    catEn: 'Forums & exhibitions',
    hrefAr: '../contact-us.html',
    hrefEn: '../contact-us-en.html',
  },
  {
    filter: 'group',
    img: 'assets/projects/branding/graphicshouse-identity.png',
    logo: true,
    light: true,
    titleAr: 'Graphics House',
    titleEn: 'Graphics House',
    catAr: 'علامات المجموعة',
    catEn: 'Group brands',
    hrefAr: '../who-we-are.html',
    hrefEn: '../who-we-are-en.html',
  },
  {
    filter: 'group',
    img: 'assets/projects/branding/bees-motion.png',
    logo: true,
    light: true,
    titleAr: 'Bees Motion',
    titleEn: 'Bees Motion',
    catAr: 'إنتاج سينمائي',
    catEn: 'Cinematic production',
    hrefAr: 'https://beesmotion.com',
    hrefEn: 'https://beesmotion.com',
    external: true,
  },
  {
    filter: 'commercial',
    img: 'assets/projects/branding/scents-wave.png',
    logo: true,
    light: true,
    titleAr: 'Scents Wave — عطور وهدايا',
    titleEn: 'Scents Wave — perfume & gifts',
    catAr: 'تجزئة وعلامات تجارية',
    catEn: 'Retail & consumer brands',
    hrefAr: '../contact-us.html',
    hrefEn: '../contact-us-en.html',
  },
  {
    filter: 'group',
    img: 'assets/projects/rendering/c3.jpg',
    logo: false,
    light: false,
    titleAr: 'توريفا',
    titleEn: 'Turriva',
    catAr: 'علامات المجموعة',
    catEn: 'Group brands',
    hrefAr: 'https://turriva.com',
    hrefEn: 'https://turriva.com',
    external: true,
  },
  {
    filter: 'forums',
    img: 'assets/projects/branding/ruwaq-logo.png',
    logo: true,
    light: false,
    titleAr: 'رواق',
    titleEn: 'Ruwaq',
    catAr: 'معارض تفاعلية وجولات',
    catEn: 'Interactive exhibitions & tours',
    hrefAr: 'https://ruwaq.co/tours',
    hrefEn: 'https://ruwaq.co/tours',
    external: true,
  },
  {
    filter: 'catalogues',
    img: 'assets/projects/jeddah-forum/catalog/page-12.jpg',
    logo: false,
    light: false,
    titleAr: 'كتالوج ملتقى جدة',
    titleEn: 'Jeddah Forum catalogue',
    catAr: 'كتالوجات ومطبوعات',
    catEn: 'Catalogues & print',
    hrefAr: '../case-studies/jeddah-real-estate-forum.html',
    hrefEn: '../case-studies/jeddah-real-estate-forum-en.html',
  },
];

const COPY = {
  ar: {
    title: 'الهوية البصرية والأنظمة المكانية | Graphics House',
    description:
      'من الشعار إلى الكتالوج وجناح المعرض: نظام بصري واحد للمشاريع العقارية والملتقيات في السعودية والخليج. جزء من ProjectLaunch™ وBrandScale™.',
    kicker: 'خدماتنا · الهوية البصرية',
    h1: 'من الشعار إلى المعرض — نظام بصري واحد',
    lead:
      'الهوية ليست ملف شعار منفصل. هي العمود الذي يغذي الكتالوج والفيلم والمطبوعات وتطبيق المعرض. نبنيها كمنظومة متكاملة ضمن <a href="../solutions/project-launch.html">ProjectLaunch™</a> للإطلاقات، <a href="../solutions/brand-scale.html">BrandScale™</a> للمحافظ المتعددة، و<a href="../solutions/institutional-events.html">الفعاليات المؤسسية</a> للملتقيات.',
    ctaPrimary: 'ابدأ مشروع الهوية',
    ctaCase: 'دراسة ملتقى جدة',
    pillarsTitle: 'أربعة محاور — مخرج واحد',
    pillarsLead: 'كل محور يُصمَّم ليعمل مع الإظهار والفيلم والمجسم، لا كملف منفصل.',
    pipelineTitle: 'مسار العمل',
    pipelineLead: 'نفس اللغة البصرية من الموجز الأول حتى آخر مطبوعة في المعرض.',
    pipeline: ['هوية', 'كتالوج', 'تطبيق مكاني', 'فيلم CGI', 'مطبوعات'],
    caseTag: 'دراسة حالة مميزة',
    caseTitle: 'ملتقى جدة للعقار',
    caseBody:
      'شعار، لوحة ألوان، كتالوج ٤٤ صفحة، نموذج جدة سوبردوم ثلاثي الأبعاد، وفيلم CGI سينمائي — منظومة بصرية كاملة من استوديو واحد.',
    caseLink: 'اقرأ الدراسة الكاملة',
    galleryTitle: 'أعمال الهوية',
    galleryLead: 'معرض من هوياتنا: ملتقيات، علامات المجموعة، تجزئة، وكتالوجات — من الشعار إلى التطبيق الكامل.',
    filters: [
      { id: 'all', label: 'الكل' },
      { id: 'forums', label: 'ملتقيات ومعارض' },
      { id: 'group', label: 'علامات المجموعة' },
      { id: 'commercial', label: 'تجزئة وعلامات' },
      { id: 'catalogues', label: 'كتالوجات ومطبوعات' },
    ],
    showcaseTitle: 'محفظة الهوية البصرية',
    showcaseLead: 'نماذج من شعارات وهويات أنتجتها Graphics House عبر قطاعات متعددة.',
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
      'From logo to catalogue to exhibition pavilion: one visual system for developments and forums across KSA and the GCC. Part of ProjectLaunch™ and BrandScale™.',
    kicker: 'Our Services · Visual Identity',
    h1: 'From logo to exhibition — one visual system',
    lead:
      'Identity is not a standalone logo file. It is the spine that feeds catalogue, film, print, and spatial application. We build it as an integrated system within <a href="../solutions/project-launch-en.html">ProjectLaunch™</a> for launches, <a href="../solutions/brand-scale-en.html">BrandScale™</a> for multi-project portfolios, and <a href="../solutions/institutional-events-en.html">institutional events</a> for forums.',
    ctaPrimary: 'Start your identity project',
    ctaCase: 'Jeddah Forum case study',
    pillarsTitle: 'Four pillars — one deliverable system',
    pillarsLead: 'Each pillar is designed to work with visualization, film, and maquettes — not as a separate file.',
    pipelineTitle: 'How it connects',
    pipelineLead: 'The same visual language from first brief to the last print piece on the exhibition floor.',
    pipeline: ['BRAND', 'CATALOGUE', 'SPATIAL', 'CGI FILM', 'PRINT'],
    caseTag: 'Featured case study',
    caseTitle: 'Jeddah Real Estate Forum',
    caseBody:
      'Logo, colour system, 44-page catalogue, Jeddah Superdome 3D model, and cinematic CGI film — a complete visual system from one studio.',
    caseLink: 'Read the full case study',
    galleryTitle: 'Identity work',
    galleryLead: 'A portfolio of our identity systems: forums, group brands, retail, and catalogues — from logo to full application.',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'forums', label: 'Forums & exhibitions' },
      { id: 'group', label: 'Group brands' },
      { id: 'commercial', label: 'Retail & consumer' },
      { id: 'catalogues', label: 'Catalogues & print' },
    ],
    showcaseTitle: 'Visual identity portfolio',
    showcaseLead: 'Sample logos and identity systems produced by Graphics House across multiple sectors.',
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
  const caseHref = `${P}case-studies/jeddah-real-estate-forum${isEn ? '-en' : ''}.html`;
  const dir = isEn ? 'ltr' : 'rtl';
  const htmlLang = isEn ? 'en' : 'ar';

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

  const gallery = GALLERY.map((item) => {
    const finalHref = isEn ? item.hrefEn : item.hrefAr;
    const ext = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const imgClass = item.logo ? 'bid-gal-logo' : '';
    const lightClass = item.light ? ' bid-gal-img--light' : '';
    const title = isEn ? item.titleEn : item.titleAr;
    const cat = isEn ? item.catEn : item.catAr;
    return `<a href="${finalHref}" class="bid-gal-card reveal" data-bid-cat="${item.filter}"${ext}>
      <div class="bid-gal-img${lightClass}"><img class="${imgClass}" src="${P}${item.img}" alt="${esc(title)}" loading="lazy"></div>
      <div class="bid-gal-body">
        <span class="bid-gal-cat">${esc(cat)}</span>
        <h4>${esc(title)}</h4>
      </div>
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
<meta property="og:image" content="${BASE}/${HERO}">
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
    <div class="bid-hero-media" aria-hidden="true">
      <img src="${P}${HERO}" alt="" fetchpriority="high">
    </div>
    <div class="bid-hero-scrim" aria-hidden="true"></div>
    <div class="bid-hero-copy">
      <span class="bid-kicker">${esc(t.kicker)}</span>
      <h1>${esc(t.h1)}</h1>
      <p class="bid-lead">${t.lead}</p>
      <div class="bid-cta-row">
        <a class="bid-btn bid-btn--gold" href="${contact}" data-gh-cta="branding_primary">${esc(t.ctaPrimary)}</a>
        <a class="bid-btn bid-btn--ghost" href="${caseHref}" data-gh-cta="branding_case">${esc(t.ctaCase)}</a>
      </div>
    </div>
  </section>

  <section class="bid-section">
    <div class="bid-section-inner">
      <div class="bid-section-head reveal">
        <h2>${esc(t.pillarsTitle)}</h2>
        <p>${esc(t.pillarsLead)}</p>
      </div>
      <div class="bid-pillars">${pillars}</div>
    </div>
  </section>

  <section class="bid-section">
    <div class="bid-section-inner">
      <div class="bid-section-head reveal">
        <h2>${esc(t.pipelineTitle)}</h2>
        <p>${esc(t.pipelineLead)}</p>
        <div class="bid-pipeline">${pipeline}</div>
      </div>
    </div>
  </section>

  <section class="bid-section">
    <div class="bid-section-inner">
      <article class="bid-case reveal">
        <div class="bid-case-img">
          <img src="${P}${CASE_IMG}" alt="${esc(t.caseTitle)}" loading="lazy">
        </div>
        <div class="bid-case-body">
          <span class="bid-case-tag">${esc(t.caseTag)}</span>
          <h3>${esc(t.caseTitle)}</h3>
          <p>${esc(t.caseBody)}</p>
          <a class="bid-case-link" href="${caseHref}">${esc(t.caseLink)} <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
        </div>
      </article>
    </div>
  </section>

  <section class="bid-section" id="bid-gallery">
    <div class="bid-section-inner">
      <div class="bid-showcase reveal">
        <img src="${P}${SHOWCASE}" alt="${esc(t.showcaseTitle)}" loading="lazy" width="1200" height="675">
      </div>
      <div class="bid-section-head reveal">
        <h2>${esc(t.galleryTitle)}</h2>
        <p>${esc(t.galleryLead)}</p>
      </div>
      <div class="bid-filters reveal">${filters}</div>
      <div class="bid-gallery">${gallery}</div>
    </div>
  </section>

  <section class="bid-section">
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
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.style.opacity='1';en.target.style.transform='none';io.unobserve(en.target);}});},{threshold:0.1});
    els.forEach(function(e){e.style.opacity='0';e.style.transform='translateY(18px)';e.style.transition='opacity .5s ease, transform .5s ease';io.observe(e);});
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
