#!/usr/bin/env node
/**
 * Build galleries / spatial décor service landings (AR + EN).
 * Soft handoff to Turriva for physical execution.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderPartial } from './layout-partials.mjs';
import {
  SITE_HEADER_CSS_VER,
  SITE_ENHANCEMENTS_CSS_VER,
  ensureHeaderCssLast,
  ensureFooterLockCssLast,
  stripConflictingHeaderStyles,
} from './lib/header-css-guard.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TURRIVA = 'https://turriva.com';

const COPY = {
  ar: {
    file: 'galleries-advertising.html',
    lang: 'ar',
    dir: 'rtl',
    title: 'جاليريات وديكور مكاني | Graphics House',
    description:
      'صالات بيع وجاليريات وديكور مكاني للمشاريع العقارية والملتقيات. Graphics House يضع الرؤية البصرية، وتنفيذ المساحة عبر توريفا.',
    canonical: 'https://3dgraphicshouse.com/galleries-advertising.html',
    altEn: 'https://3dgraphicshouse.com/galleries-advertising-en.html',
    altAr: 'https://3dgraphicshouse.com/galleries-advertising.html',
    skip: 'تخطي إلى المحتوى الرئيسي',
    kicker: 'خدماتنا · الديكور المكاني',
    h1: 'جاليريات <span>وديكور مكاني</span>',
    lead:
      'نصمّم تجربة صالة البيع والجناح والمعرض بلغة بصرية واحدة مع المشروع. التنفيذ الميداني والتسليم المكاني يتم عبر توريفا — شريك التسليم المكاني في المجموعة.',
    ctaPrimary: 'انتقل إلى توريفا للتنفيذ',
    ctaSecondary: 'تواصل مع Graphics House',
    contactHref: 'contact-us.html',
    aboutTitle: 'ما نقدّمه في هذه الخدمة',
    aboutLead:
      'من فهم المشروع والهوية إلى تصور المساحة ومواد العرض، ثم تسليم التنفيذ لتوريفا حتى تصبح الصالة جاهزة للزائر.',
    pillars: [
      {
        title: 'تصميم التجربة المكانية',
        body: 'توزيع المسار، نقاط العرض، اللافتات، والشاشات بما يخدم قرار الشراء أو حضور الملتقى.',
      },
      {
        title: 'لغة بصرية متصلة',
        body: 'المواد المكانية تتحدث بنفس هوية المشروع مع الـ CGI والمجسم والمحتوى الرقمي.',
      },
      {
        title: 'تنفيذ عبر توريفا',
        body: 'التصنيع، التركيب، والجودة الميدانية تحت مسؤولية توريفا حتى التسليم والافتتاح.',
      },
    ],
    workTitle: 'لمحات من الأعمال المكانية',
    workLead: 'نماذج من صالات وقاعات ومعارض نُفّذت بمعايير العرض للمطورين والمؤسسات.',
    caps: [
      { src: 'makkah-charter-04', label: 'قاعة عرض — ميثاق مكة' },
      { src: 'makkah-charter-01', label: 'بيئة عرض مؤسسية' },
      { src: 'showroom', label: 'صالة تفاعلية' },
      { src: 'rafal-lobby', label: 'ردهة بافيليونز' },
      { src: 'makkah-charter-08', label: 'ديكور مكاني للملتقى' },
      { src: 'turriva-brand', label: 'توريفا — التسليم المكاني' },
    ],
    handoffKicker: 'التنفيذ المكاني',
    handoffTitle: 'توريفا مسؤولة عن التنفيذ',
    handoffBody:
      'Graphics House يحدد الرؤية البصرية والمسار. توريفا تتولى التطوير الفني، التصنيع، التركيب، والتسليم حتى تصبح المساحة جاهزة للاستخدام أو الافتتاح.',
    handoffNote:
      'للهوية البصرية والشعار والكتالوج راجع <a href="services/branding.html">صفحة الهوية البصرية</a>. لهذه الخدمة المكانية ابدأ من توريفا.',
    finalTitle: 'جاهز لمناقشة صالة بيع أو ديكور مكاني؟',
    finalLead: 'أرسل المخطط أو الموعد المستهدف. توريفا ترد بخطوة تالية واضحة خلال يوم عمل.',
  },
  en: {
    file: 'galleries-advertising-en.html',
    lang: 'en',
    dir: 'ltr',
    title: 'Galleries & Spatial Décor | Graphics House',
    description:
      'Sales galleries, exhibition spaces, and spatial décor for GCC developments. Graphics House sets the visual brief; Turriva delivers the physical space.',
    canonical: 'https://3dgraphicshouse.com/galleries-advertising-en.html',
    altEn: 'https://3dgraphicshouse.com/galleries-advertising-en.html',
    altAr: 'https://3dgraphicshouse.com/galleries-advertising.html',
    skip: 'Skip to main content',
    kicker: 'Our services · Spatial décor',
    h1: 'Galleries <span>&amp; spatial décor</span>',
    lead:
      'We design the sales gallery, pavilion, and exhibition experience in one visual language with the project. Physical build and handover run through Turriva — the group’s spatial delivery partner.',
    ctaPrimary: 'Continue to Turriva for delivery',
    ctaSecondary: 'Contact Graphics House',
    contactHref: 'contact-us-en.html',
    aboutTitle: 'What this service covers',
    aboutLead:
      'From project and brand intent to spatial concept and display materials, then handoff to Turriva for buildable delivery.',
    pillars: [
      {
        title: 'Spatial experience design',
        body: 'Visitor flow, display points, signage, and screens that support sales decisions or institutional presence.',
      },
      {
        title: 'Connected visual language',
        body: 'Spatial assets stay aligned with CGI, maquettes, and digital content for the same project.',
      },
      {
        title: 'Delivery through Turriva',
        body: 'Fabrication, installation, and site quality sit with Turriva through handover and opening readiness.',
      },
    ],
    workTitle: 'Selected spatial work',
    workLead: 'Moments from galleries, halls, and exhibitions built to developer and institutional standards.',
    caps: [
      { src: 'makkah-charter-04', label: 'Presentation hall — Makkah Charter' },
      { src: 'makkah-charter-01', label: 'Institutional display environment' },
      { src: 'showroom', label: 'Interactive sales gallery' },
      { src: 'rafal-lobby', label: 'Rafal pavilions lobby' },
      { src: 'makkah-charter-08', label: 'Forum spatial décor' },
      { src: 'turriva-brand', label: 'Turriva — spatial delivery' },
    ],
    handoffKicker: 'Physical delivery',
    handoffTitle: 'Turriva owns the build',
    handoffBody:
      'Graphics House defines the visual intent and journey. Turriva owns technical development, fabrication, installation, and handover until the space is ready to use or open.',
    handoffNote:
      'For logo, guidelines, and catalogue identity see <a href="services/branding-en.html">Visual Identity</a>. For this spatial service, start with Turriva.',
    finalTitle: 'Ready to discuss a sales gallery or spatial décor?',
    finalLead: 'Send drawings or the target date. Turriva replies within one business day with a clear next step.',
  },
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPage(t, isEn) {
  const header = renderPartial(isEn ? 'header-en.html' : 'header-ar.html', 0, isEn);
  const footer = renderPartial(isEn ? 'footer-en.html' : 'footer-ar.html', 0, isEn);
  const font =
    "family=Tajawal:wght@300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";

  const pillars = t.pillars
    .map(
      (p) => `<div class="gal-pillar">
 <strong>${esc(p.title)}</strong>
 <p>${esc(p.body)}</p>
</div>`
    )
    .join('\n');

  const grid = t.caps
    .map((c, i) => {
      const wide = i === 0 ? ' gal-grid__item--wide' : '';
      return `<figure class="gal-grid__item${wide}">
 <picture>
  <source srcset="assets/projects/galleries/${c.src}.webp" type="image/webp">
  <img src="assets/projects/galleries/${c.src}.jpg" alt="${esc(c.label)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" width="1600" height="900">
 </picture>
 <figcaption class="gal-grid__cap">${esc(c.label)}</figcaption>
</figure>`;
    })
    .join('\n');

  let html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="${t.dir}" lang="${t.lang}">
<head>
<script src="assets/gh-forms-config.js?v=2"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y67JVE898Z"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js',new Date());
gtag('config','G-Y67JVE898Z');
</script>
<script src="assets/gh-analytics.js?v=3"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="canonical" href="${t.canonical}">
<link rel="alternate" hreflang="en" href="${t.altEn}">
<link rel="alternate" hreflang="ar" href="${t.altAr}">
<link rel="alternate" hreflang="x-default" href="${t.altEn}">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${t.canonical}">
<meta property="og:image" content="https://3dgraphicshouse.com/assets/projects/galleries/makkah-charter-04.jpg">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png">
<link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?${font}" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="assets/gh-site-enhancements.css?v=${SITE_ENHANCEMENTS_CSS_VER}">
<link rel="stylesheet" href="assets/gh-galleries-service.css?v=1">
<link rel="stylesheet" href="assets/gh-float-widgets.css?v=15">
<link rel="stylesheet" href="assets/gh-chat-assistant.css?v=10">
<link rel="stylesheet" href="assets/site-header.css?v=${SITE_HEADER_CSS_VER}" data-gh-header-css="1">
<link rel="stylesheet" href="assets/gh-footer-lock.css?v=5" data-gh-footer-lock="1">
<script defer src="assets/site-header.js?v=16"></script>
<script defer src="assets/gh-performance.js?v=10"></script>
<script defer src="assets/site-reveal.js?v=2"></script>
<script defer src="assets/gh-cta-track.js?v=1"></script>
<script defer src="assets/lang-switch.js?v=3"></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isEn ? 'Galleries & Spatial Décor' : 'جاليريات وديكور مكاني',
    description: t.description,
    url: t.canonical,
    provider: {
      '@type': 'Organization',
      name: 'Graphics House',
      url: 'https://3dgraphicshouse.com',
      logo: 'https://3dgraphicshouse.com/assets/logo-gold.png',
    },
    areaServed: ['SA', 'AE', 'OM', 'BH'],
  })}</script>
</head>
<body class="gal-page" data-gh-service="galleries">
${header}
<main id="main-content">
 <section class="gal-hero">
  <div class="gal-hero__media" aria-hidden="true">
   <picture>
    <source srcset="assets/projects/galleries/makkah-charter-04.webp" type="image/webp">
    <img src="assets/projects/galleries/makkah-charter-04.jpg" alt="" width="1600" height="900" fetchpriority="high">
   </picture>
  </div>
  <div class="gal-hero__shade" aria-hidden="true"></div>
  <div class="gal-wrap gal-hero__inner">
   <span class="gal-kicker">${esc(t.kicker)}</span>
   <h1>${t.h1}</h1>
   <p class="gal-hero__lead">${esc(t.lead)}</p>
   <div class="gal-cta-row">
    <a class="gal-btn gal-btn--gold" href="${TURRIVA}" target="_blank" rel="noopener noreferrer" data-gh-cta="galleries_to_turriva">${esc(t.ctaPrimary)} <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">north_east</span></a>
    <a class="gal-btn gal-btn--ghost" href="${t.contactHref}" data-gh-cta="galleries_contact">${esc(t.ctaSecondary)}</a>
   </div>
  </div>
 </section>

 <section class="gal-section gal-section--paper">
  <div class="gal-wrap">
   <span class="gal-kicker">${esc(t.kicker)}</span>
   <h2>${esc(t.aboutTitle)}</h2>
   <p class="gal-section__lead">${esc(t.aboutLead)}</p>
   <div class="gal-pillars">${pillars}</div>
  </div>
 </section>

 <section class="gal-section">
  <div class="gal-wrap">
   <h2>${esc(t.workTitle)}</h2>
   <p class="gal-section__lead">${esc(t.workLead)}</p>
   <div class="gal-grid">${grid}</div>
  </div>
 </section>

 <section class="gal-section gal-section--paper">
  <div class="gal-wrap gal-handoff">
   <div>
    <p class="gal-handoff__note">${t.handoffNote}</p>
   </div>
   <div class="gal-handoff__card">
    <span class="gal-kicker">${esc(t.handoffKicker)}</span>
    <h2>${esc(t.handoffTitle)}</h2>
    <p>${esc(t.handoffBody)}</p>
    <a class="gal-btn gal-btn--gold" href="${TURRIVA}" target="_blank" rel="noopener noreferrer" data-gh-cta="galleries_turriva_mid">${esc(t.ctaPrimary)} <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">north_east</span></a>
   </div>
  </div>
 </section>

 <section class="gal-section">
  <div class="gal-wrap" style="text-align:center">
   <h2>${esc(t.finalTitle)}</h2>
   <p class="gal-section__lead" style="margin:12px auto 0">${esc(t.finalLead)}</p>
   <div class="gal-cta-row" style="justify-content:center;margin-top:28px">
    <a class="gal-btn gal-btn--dark" href="${TURRIVA}" target="_blank" rel="noopener noreferrer" data-gh-cta="galleries_turriva_final">${esc(t.ctaPrimary)} <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">north_east</span></a>
    <a class="gal-btn gal-btn--outline" href="${t.contactHref}" data-gh-cta="galleries_contact_final">${esc(t.ctaSecondary)}</a>
   </div>
  </div>
 </section>
</main>
${footer}
<script defer src="assets/gh-float-widgets.js?v=18"></script>
<script defer src="assets/gh-chat-assistant.js?v=18"></script>
</body>
</html>
`;

  html = stripConflictingHeaderStyles(html);
  html = ensureHeaderCssLast(html, 'assets/');
  html = ensureFooterLockCssLast(html, 'assets/');
  return html;
}

for (const [key, t] of Object.entries(COPY)) {
  const isEn = key === 'en';
  const html = buildPage(t, isEn);
  fs.writeFileSync(path.join(ROOT, t.file), html, 'utf8');
  console.log('Wrote', t.file);
}
