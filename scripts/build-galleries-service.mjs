#!/usr/bin/env node
/**
 * Build galleries / spatial décor service landings (AR + EN).
 * Canonical URLs live under /services/galleries*.html (avoids stale
 * browser cache of the old root redirect stub → branding).
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
    file: 'services/galleries.html',
    legacyFile: 'galleries-advertising.html',
    lang: 'ar',
    dir: 'rtl',
    title: 'جاليريات وديكور مكاني | Graphics House',
    description:
      'تصميم التجربة المكانية لصالات البيع والجاليريات والملتقيات: مسار الزائر، المخططات التنفيذية للديكور، ولغة بصرية واحدة مع المشروع — والتنفيذ عبر توريفا.',
    canonical: 'https://3dgraphicshouse.com/services/galleries.html',
    altEn: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altAr: 'https://3dgraphicshouse.com/services/galleries.html',
    kicker: 'خدماتنا · التجربة المكانية',
    h1: 'جاليريات <span>وديكور مكاني</span>',
    lead:
      'نحوّل صالة البيع والجناح والمعرض إلى تجربة مكانية متماسكة مع هوية المشروع: مسار الزائر، نقاط العرض، والمخططات اللازمة لتنفيذ الديكور. التنفيذ الميداني والتسليم عبر توريفا — شريك التسليم المكاني في المجموعة.',
    ctaPrimary: 'انتقل إلى توريفا للتنفيذ',
    ctaSecondary: 'تواصل مع Graphics House',
    contactHref: '../contact-us.html',
    brandingHref: 'branding.html',
    aboutTitle: 'ما نقدّمه في هذه الخدمة',
    aboutLead:
      'من قراءة المشروع والهوية إلى تصميم التجربة المكانية ومخططات التنفيذ، ثم تسليم البناء والتركيب لتوريفا حتى تكون المساحة جاهزة للزائر أو الافتتاح.',
    pillars: [
      {
        title: 'تصميم التجربة المكانية',
        body:
          'مسار الزائر، توزيع نقاط العرض، اللافتات والشاشات — مع تصميم المخططات اللازمة لتنفيذ الديكور: توزيع المساحة، الارتفاعات، وتفاصيل التركيب القابلة للتنفيذ.',
      },
      {
        title: 'لغة بصرية واحدة مع المشروع',
        body:
          'المواد المكانية تتحدث بنفس لغة الـ CGI والمجسم والمحتوى الرقمي، حتى يشعر الزائر أنه داخل المشروع لا أمام عرض منفصل.',
      },
      {
        title: 'تنفيذ عبر توريفا',
        body:
          'التصنيع، التركيب، وضبط الجودة في الموقع تحت مسؤولية توريفا من أول قطعة حتى التسليم والافتتاح.',
      },
    ],
    workTitle: 'لمحات من الأعمال المكانية',
    workLead: 'صالات وقاعات ومعارض بُنيت بمعايير العرض للمطورين والمؤسسات في المملكة والخليج.',
    caps: [
      { src: 'makkah-charter-04', label: 'قاعة عرض — ميثاق مكة' },
      { src: 'makkah-charter-01', label: 'بيئة عرض مؤسسية' },
      { src: 'showroom', label: 'صالة تفاعلية' },
      { src: 'rafal-lobby', label: 'ردهة بافيليونز' },
      { src: 'makkah-charter-08', label: 'ديكور مكاني للملتقى' },
      { src: 'turriva-brand', label: 'توريفا — التسليم المكاني' },
    ],
    handoffKicker: 'التنفيذ المكاني',
    handoffTitle: 'توريفا تتولى التنفيذ',
    handoffBody:
      'Graphics House يضع الرؤية البصرية وتصميم التجربة والمخططات. توريفا تتولى التطوير الفني، التصنيع، التركيب، والتسليم حتى تكون المساحة جاهزة للاستخدام أو الافتتاح.',
    handoffNoteBefore: 'للهوية البصرية والشعار والكتالوج راجع ',
    handoffNoteLink: 'صفحة الهوية البصرية',
    handoffNoteAfter: '. لهذه الخدمة المكانية ابدأ من توريفا.',
    finalTitle: 'جاهز لمناقشة صالة بيع أو ديكور مكاني؟',
    finalLead: 'أرسل المخطط أو الموعد المستهدف. توريفا ترد بخطوة تالية واضحة خلال يوم عمل.',
  },
  en: {
    file: 'services/galleries-en.html',
    legacyFile: 'galleries-advertising-en.html',
    lang: 'en',
    dir: 'ltr',
    title: 'Galleries & Spatial Décor | Graphics House',
    description:
      'Spatial experience design for sales galleries, exhibitions, and forums: visitor journey, build-ready décor drawings, and one visual language with the project — delivered through Turriva.',
    canonical: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altEn: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altAr: 'https://3dgraphicshouse.com/services/galleries.html',
    kicker: 'Our services · Spatial experience',
    h1: 'Galleries <span>&amp; spatial décor</span>',
    lead:
      'We turn the sales gallery, pavilion, and exhibition into a spatial experience aligned with the project: visitor flow, display points, and the drawings needed to build the décor. Physical delivery runs through Turriva — the group’s spatial partner.',
    ctaPrimary: 'Continue to Turriva for delivery',
    ctaSecondary: 'Contact Graphics House',
    contactHref: '../contact-us-en.html',
    brandingHref: 'branding-en.html',
    aboutTitle: 'What this service covers',
    aboutLead:
      'From project and brand reading to spatial experience design and build drawings, then handoff to Turriva for fabrication and install until the space is visitor-ready.',
    pillars: [
      {
        title: 'Spatial experience design',
        body:
          'Visitor journey, display points, signage, and screens — plus the décor drawings required for build: layouts, elevations, and install-ready details.',
      },
      {
        title: 'One visual language with the project',
        body:
          'Spatial assets speak the same language as CGI, maquettes, and digital content, so the visitor feels inside the project — not beside a separate display.',
      },
      {
        title: 'Delivery through Turriva',
        body:
          'Fabrication, installation, and on-site quality sit with Turriva from first piece through handover and opening.',
      },
    ],
    workTitle: 'Selected spatial work',
    workLead: 'Galleries, halls, and exhibitions built to developer and institutional standards across KSA and the GCC.',
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
      'Graphics House defines the visual intent, spatial experience, and drawings. Turriva owns technical development, fabrication, installation, and handover until the space is ready to use or open.',
    handoffNoteBefore: 'For logo, guidelines, and catalogue identity see ',
    handoffNoteLink: 'Visual Identity',
    handoffNoteAfter: '. For this spatial service, start with Turriva.',
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

function buildPage(t, isEn, depth) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const asset = `${prefix}assets/`;
  const header = renderPartial(isEn ? 'header-en.html' : 'header-ar.html', depth, isEn);
  const footer = renderPartial(isEn ? 'footer-en.html' : 'footer-ar.html', depth, isEn);
  const font = isEn
    ? 'family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700;800&display=swap'
    : 'family=Tajawal:wght@200;300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap';

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
  <source srcset="${asset}projects/galleries/${c.src}.webp" type="image/webp">
  <img src="${asset}projects/galleries/${c.src}.jpg" alt="${esc(c.label)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" width="1600" height="900">
 </picture>
 <figcaption class="gal-grid__cap">${esc(c.label)}</figcaption>
</figure>`;
    })
    .join('\n');

  const contactHref = depth === 0 ? t.contactHref.replace('../', '') : t.contactHref;
  const brandingHref = depth === 0 ? `services/${t.brandingHref}` : t.brandingHref;

  let html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="${t.dir}" lang="${t.lang}">
<head>
<script src="${asset}gh-forms-config.js?v=2"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y67JVE898Z"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js',new Date());
gtag('config','G-Y67JVE898Z');
</script>
<script src="${asset}gh-analytics.js?v=3"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="canonical" href="${t.canonical}">
<link rel="alternate" hreflang="en" href="${t.altEn}">
<link rel="alternate" hreflang="ar" href="${t.altAr}">
<link rel="alternate" hreflang="x-default" href="${t.altEn}">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${t.canonical}">
<meta property="og:image" content="https://3dgraphicshouse.com/assets/projects/galleries/makkah-charter-04.jpg">
<link rel="icon" type="image/png" sizes="32x32" href="${asset}favicon/favicon-32.png">
<link rel="apple-touch-icon" href="${asset}favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?${font}" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset}tailwind.min.css?v=1">
<link rel="stylesheet" href="${asset}gh-tokens.css?v=1">
<link rel="stylesheet" href="${asset}gh-site-enhancements.css?v=${SITE_ENHANCEMENTS_CSS_VER}">
<link rel="stylesheet" href="${asset}gh-galleries-service.css?v=3">
<link rel="stylesheet" href="${asset}gh-float-widgets.css?v=15">
<link rel="stylesheet" href="${asset}gh-chat-assistant.css?v=10">
<link rel="stylesheet" href="${asset}site-header.css?v=${SITE_HEADER_CSS_VER}" data-gh-header-css="1">
<link rel="stylesheet" href="${asset}gh-footer-lock.css?v=5" data-gh-footer-lock="1">
<script defer src="${asset}site-header.js?v=16"></script>
<script defer src="${asset}gh-performance.js?v=11"></script>
<script defer src="${asset}site-reveal.js?v=2"></script>
<script defer src="${asset}gh-cta-track.js?v=1"></script>
<script defer src="${asset}lang-switch.js?v=3"></script>
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
    <source srcset="${asset}projects/galleries/makkah-charter-04.webp" type="image/webp">
    <img src="${asset}projects/galleries/makkah-charter-04.jpg" alt="" width="1600" height="900" fetchpriority="high">
   </picture>
  </div>
  <div class="gal-hero__shade" aria-hidden="true"></div>
  <div class="gal-wrap gal-hero__inner">
   <span class="gal-kicker">${esc(t.kicker)}</span>
   <h1>${t.h1}</h1>
   <p class="gal-hero__lead">${esc(t.lead)}</p>
   <div class="gal-cta-row">
    <a class="gal-btn gal-btn--gold" href="${TURRIVA}" target="_blank" rel="noopener noreferrer" data-gh-cta="galleries_to_turriva">${esc(t.ctaPrimary)} <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">north_east</span></a>
    <a class="gal-btn gal-btn--ghost" href="${contactHref}" data-gh-cta="galleries_contact">${esc(t.ctaSecondary)}</a>
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
    <p class="gal-handoff__note">${esc(t.handoffNoteBefore)}<a href="${brandingHref}">${esc(t.handoffNoteLink)}</a>${esc(t.handoffNoteAfter)}</p>
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
    <a class="gal-btn gal-btn--outline" href="${contactHref}" data-gh-cta="galleries_contact_final">${esc(t.ctaSecondary)}</a>
   </div>
  </div>
 </section>
</main>
${footer}
<script defer src="${asset}gh-float-widgets.js?v=18"></script>
<script defer src="${asset}gh-chat-assistant.js?v=18"></script>
</body>
</html>
`;

  html = stripConflictingHeaderStyles(html);
  html = ensureHeaderCssLast(html, asset);
  html = ensureFooterLockCssLast(html, asset);
  return html;
}

function writeLegacyRedirect(fromFile, toPath, isEn) {
  const title = isEn ? 'Redirecting to Galleries…' : 'جارٍ التحويل إلى الجاليريات…';
  const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ar'}" dir="${isEn ? 'ltr' : 'rtl'}">
<head>
<meta charset="utf-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="refresh" content="0;url=${toPath}">
<link rel="canonical" href="https://3dgraphicshouse.com${toPath}">
<meta name="robots" content="noindex,follow">
<title>${title}</title>
<script>location.replace('${toPath}');</script>
</head>
<body><p><a href="${toPath}">${isEn ? 'Continue to Galleries & Spatial Décor' : 'متابعة إلى جاليريات وديكور مكاني'}</a></p></body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, fromFile), html, 'utf8');
}

for (const [key, t] of Object.entries(COPY)) {
  const isEn = key === 'en';
  fs.mkdirSync(path.join(ROOT, 'services'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, t.file), buildPage(t, isEn, 1), 'utf8');
  writeLegacyRedirect(t.legacyFile, `/${t.file}`, isEn);
  console.log('Wrote', t.file, '+ legacy', t.legacyFile);
}
