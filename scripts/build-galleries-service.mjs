#!/usr/bin/env node
/**
 * Build galleries / spatial décor service landings (AR + EN).
 * Canonical URLs live under /services/galleries*.html (avoids stale
 * browser cache of the old root redirect stub → branding).
 * Positions Turriva as design + build for exhibitions, palaces, hotels.
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
    title: 'ديكور المعارض والقصور والفنادق | توريفا عبر Graphics House',
    description:
      'توريفا تصمّم وتنفّذ ديكور المعارض والقصور والفنادق — من الفكرة والرسومات إلى التصنيع والتركيب والتسليم. مسار تصميم وبناء واحد.',
    canonical: 'https://3dgraphicshouse.com/services/galleries.html',
    altEn: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altAr: 'https://3dgraphicshouse.com/services/galleries.html',
    kicker: 'توريفا · تصميم وتنفيذ',
    h1: 'ديكور المعارض <span>والقصور والفنادق</span>',
    lead:
      'توريفا تصمّم التجربة المكانية وتنفّذها ميدانياً: الفكرة، الرسومات، التصنيع، التركيب، والتسليم — حتى تكون المساحة جاهزة للزائر أو الضيف أو الافتتاح.',
    ctaPrimary: 'ابدأ مع توريفا',
    ctaSecondary: 'تواصل مع Graphics House',
    contactHref: '../contact-us.html',
    brandingHref: 'branding.html',
    scopeKicker: 'نطاق العمل',
    aboutTitle: 'ثلاث بيئات… فريق واحد يصمّم وينفّذ',
    aboutLead:
      'سواء كان معرضاً مؤسسياً، صالة بيع، قصراً خاصاً، أو لوبي فندق — توريفا تملك القرار البصري والتنفيذ الميداني معاً، بمعايير تليق بالمملكة والخليج.',
    pillars: [
      {
        title: 'ديكور المعارض وصالات العرض',
        body:
          'مسار الزائر، نقاط العرض، الشاشات، واللافتات — تصميم يعرض المشروع بوضوح، ثم تنفيذ ميداني يسلّم المساحة جاهزة للحضور والافتتاح.',
      },
      {
        title: 'ديكور القصور والإقامات الخاصة',
        body:
          'فراغات استقبال وقاعات خاصة بتفاصيل دقيقة: مواد، نجارة، وإضاءة متناسقة — من المفهوم المعتمد إلى تركيب نظيف وتسليم راقٍ.',
      },
      {
        title: 'ديكور الفنادق والضيافة',
        body:
          'لوبيات، ممرات، ومناطق ضيافة تتحدث بلغة العلامة: تصميم يخدم التشغيل اليومي، وتنفيذ يحافظ على الجودة بعد الافتتاح.',
      },
    ],
    processKicker: 'طريقة العمل',
    processTitle: 'من الفكرة إلى التسليم… دون فصل بين التصميم والتنفيذ',
    processLead:
      'توريفا تغلق كل مرحلة قبل التالية — حتى لا يتحوّل الموقع إلى تعديلات مكلفة بعد اعتماد الفكرة.',
    steps: [
      {
        num: '01',
        title: 'قراءة المكان والهدف',
        body: 'نفهم الجمهور، الاستخدام، والهوية — حتى يكون الديكور في خدمة التجربة لا الزخرفة.',
      },
      {
        num: '02',
        title: 'تصميم وعرض الفكرة',
        body: 'مفهوم المساحة ومسار الحركة ونقاط القوة — معروض بصرياً لموافقة أصحاب القرار مبكراً.',
      },
      {
        num: '03',
        title: 'رسومات قابلة للتنفيذ',
        body: 'توزيع، ارتفاعات، مواد، وتسلسل تركيب — حزمة يدخل بها المصنع والموقع دون اجتهاد.',
      },
      {
        num: '04',
        title: 'تصنيع · تركيب · تسليم',
        body: 'نفس الفريق يتابع الجودة حتى التسليم والافتتاح — بنفس اللغة البصرية المعتمدة.',
      },
    ],
    workTitle: 'أعمال مكانية من التنفيذ',
    workLead:
      'معارض وقاعات وبيئات داخلية بُنيت بعد تصميم واضح ورسومات تنفيذية — عبر توريفا في المملكة والخليج.',
    caps: [
      { src: 'turriva/mwl-hero', label: 'معرض رابطة العالم الإسلامي — تصميم وتنفيذ' },
      { src: 'turriva/anan-eskan-gallery', label: 'صالة بيع عنان إسكان' },
      { src: 'makkah-charter-04', label: 'قاعة عرض مؤسسية — ميثاق مكة' },
      { src: 'turriva/rafal-pavilions', label: 'بافيليونات وضيافة — رافال' },
      { src: 'turriva/living-walnut-interior', label: 'فراغ استقبال وإقامة خاصة' },
      { src: 'turriva/hero-interior', label: 'بيئة فندقية جاهزة للتسليم' },
    ],
    proofKicker: 'إثبات ميداني',
    proofTitle: 'معرض رابطة العالم الإسلامي',
    proofLead:
      'ديكور مكاني وأدوات عرض بمعايير مؤسسية: من الفكرة البصرية إلى التسليم الميداني. هذا ما تفعله توريفا — تصميم وتنفيذ في مسار واحد.',
    proofWatch: 'شاهد بالصوت',
    proofTag: 'تصميم · رسومات · تنفيذ ميداني',
    ytId: 'H66KNP1sQCk',
    handoffKicker: 'توريفا',
    handoffTitle: 'تصميم الديكور وتنفيذه… في يد واحدة',
    handoffBody:
      'توريفا هي مسار التصميم والبناء للديكور المكاني: المعارض، القصور، والفنادق. Graphics House يوجّهك إلى الفريق الصحيح — وأنت تبدأ مباشرة مع من سيصمّم وينفّذ ويسلّم.',
    handoffNoteBefore: 'للهوية البصرية والشعار والكتالوج راجع ',
    handoffNoteLink: 'صفحة الهوية البصرية',
    handoffNoteAfter: '. لديكور المعارض والقصور والفنادق: توريفا تصمّم وتنفّذ.',
    finalTitle: 'جاهز لمناقشة معرض أو قصر أو فندق؟',
    finalLead:
      'أرسل الموقع أو الموعد أو مخططاً أولياً. توريفا تبدأ بقراءة المكان وتصميم الفكرة — ثم تنتقل للتنفيذ بخطوة تالية واضحة خلال يوم عمل.',
  },
  en: {
    file: 'services/galleries-en.html',
    legacyFile: 'galleries-advertising-en.html',
    lang: 'en',
    dir: 'ltr',
    title: 'Exhibition, Palace & Hotel Décor | Turriva via Graphics House',
    description:
      'Turriva designs and builds décor for exhibitions, palaces, and hotels — from concept and drawings to fabrication, install, and handover. One design-and-build path.',
    canonical: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altEn: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altAr: 'https://3dgraphicshouse.com/services/galleries.html',
    kicker: 'Turriva · Design & build',
    h1: 'Exhibition, palace <span>&amp; hotel décor</span>',
    lead:
      'Turriva designs the spatial experience and delivers it on site: concept, drawings, fabrication, installation, and handover — until the space is ready for visitors, guests, or opening day.',
    ctaPrimary: 'Start with Turriva',
    ctaSecondary: 'Contact Graphics House',
    contactHref: '../contact-us-en.html',
    brandingHref: 'branding-en.html',
    scopeKicker: 'What we cover',
    aboutTitle: 'Three environments. One team that designs and builds.',
    aboutLead:
      'Institutional exhibition, sales gallery, private palace, or hotel lobby — Turriva owns the visual decision and the field delivery together, to KSA and GCC standards.',
    pillars: [
      {
        title: 'Exhibition & showroom décor',
        body:
          'Visitor path, display points, screens, and signage — designed to present the project clearly, then built and handed over ready for guests and opening.',
      },
      {
        title: 'Palace & private residence décor',
        body:
          'Reception halls and private rooms with precise detail: materials, joinery, and lighting — from approved concept to clean install and refined handover.',
      },
      {
        title: 'Hotel & hospitality décor',
        body:
          'Lobbies, corridors, and guest zones in the brand’s language — designed for daily operations, built to hold quality after opening.',
      },
    ],
    processKicker: 'How it works',
    processTitle: 'From idea to handover — without splitting design from build',
    processLead:
      'Turriva closes each stage before the next — so the site does not become costly revisions after concept approval.',
    steps: [
      {
        num: '01',
        title: 'Read the place and the goal',
        body: 'Audience, use, and brand language — so décor serves the experience, not decoration for its own sake.',
      },
      {
        num: '02',
        title: 'Design and present the idea',
        body: 'Spatial concept, circulation, and priorities — shown visually for early stakeholder approval.',
      },
      {
        num: '03',
        title: 'Build-ready drawings',
        body: 'Layouts, elevations, materials, and install sequence — the package factory and site teams build from.',
      },
      {
        num: '04',
        title: 'Fabricate · install · hand over',
        body: 'The same team follows quality through handover and opening — in the approved visual language.',
      },
    ],
    workTitle: 'Selected delivered work',
    workLead:
      'Exhibitions, halls, and interiors built after clear design and execution drawings — through Turriva across KSA and the GCC.',
    caps: [
      { src: 'turriva/mwl-hero', label: 'Muslim World League exhibition — design & build' },
      { src: 'turriva/anan-eskan-gallery', label: 'Anan Eskan sales gallery' },
      { src: 'makkah-charter-04', label: 'Institutional hall — Makkah Charter' },
      { src: 'turriva/rafal-pavilions', label: 'Pavilions & hospitality — Rafal' },
      { src: 'turriva/living-walnut-interior', label: 'Private reception interior' },
      { src: 'turriva/hero-interior', label: 'Hospitality interior ready for handover' },
    ],
    proofKicker: 'Field proof',
    proofTitle: 'Muslim World League exhibition',
    proofLead:
      'Spatial décor and display tools at institutional standard: from visual concept to field handover. This is what Turriva does — design and build on one path.',
    proofWatch: 'Watch with sound',
    proofTag: 'Design · drawings · field install',
    ytId: 'H66KNP1sQCk',
    handoffKicker: 'Turriva',
    handoffTitle: 'Décor design and build — in one hand',
    handoffBody:
      'Turriva is the design-and-build path for spatial décor: exhibitions, palaces, and hotels. Graphics House routes you to the right team — you start with the people who will design, build, and hand over.',
    handoffNoteBefore: 'For logo, guidelines, and catalogue identity see ',
    handoffNoteLink: 'Visual Identity',
    handoffNoteAfter: '. For exhibition, palace, and hotel décor: Turriva designs and builds.',
    finalTitle: 'Ready to discuss an exhibition, palace, or hotel?',
    finalLead:
      'Send the site, target date, or an early plan. Turriva starts by reading the place and designing the idea — then moves to delivery with a clear next step within one business day.',
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
      (p, i) => `<div class="gal-scope reveal${i ? ` r${i}` : ''}">
 <span class="gal-scope__idx">${String(i + 1).padStart(2, '0')}</span>
 <strong>${esc(p.title)}</strong>
 <p>${esc(p.body)}</p>
</div>`
    )
    .join('\n');

  const steps = t.steps
    .map(
      (s) => `<div class="gal-step reveal">
 <span class="gal-step__num">${esc(s.num)}</span>
 <strong>${esc(s.title)}</strong>
 <p>${esc(s.body)}</p>
</div>`
    )
    .join('\n');

  const grid = t.caps
    .map((c, i) => {
      return `<figure class="gal-grid__item">
 <picture>
  <source srcset="${asset}projects/galleries/${c.src}.webp" type="image/webp">
  <img src="${asset}projects/galleries/${c.src}.jpg" alt="${esc(c.label)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" width="1600" height="1200">
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
<link rel="stylesheet" href="${asset}gh-galleries-service.css?v=9">
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
    name: isEn ? 'Exhibition, Palace & Hotel Décor' : 'ديكور المعارض والقصور والفنادق',
    description: t.description,
    url: t.canonical,
    provider: {
      '@type': 'Organization',
      name: 'Turriva',
      url: 'https://turriva.com',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Graphics House',
        url: 'https://3dgraphicshouse.com',
      },
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

 <section class="gal-section gal-section--paper" id="scope">
  <div class="gal-wrap">
   <span class="gal-kicker">${esc(t.scopeKicker)}</span>
   <h2>${esc(t.aboutTitle)}</h2>
   <p class="gal-section__lead">${esc(t.aboutLead)}</p>
   <div class="gal-scopes">${pillars}</div>
  </div>
 </section>

 <section class="gal-proof" id="proof">
  <div class="gal-wrap gal-proof__grid">
   <div class="gal-proof__copy reveal">
    <span class="gal-kicker">${esc(t.proofKicker)}</span>
    <h2>${esc(t.proofTitle)}</h2>
    <p>${esc(t.proofLead)}</p>
    <p class="gal-proof__tag">${esc(t.proofTag)}</p>
    <button type="button" class="gal-btn gal-btn--gold gal-proof__sound" onclick="playVideo('${t.ytId}')" data-gh-cta="galleries_yt_mwl_sound" aria-label="${esc(t.proofWatch)}">${esc(t.proofWatch)}</button>
   </div>
   <div class="gal-proof__card reveal r1" aria-label="${esc(t.proofTitle)}">
    <div class="gal-proof__media gal-proof__media--live">
     <iframe
      class="gal-proof__yt"
      src="https://www.youtube.com/embed/${t.ytId}?autoplay=1&amp;mute=1&amp;controls=0&amp;loop=1&amp;playlist=${t.ytId}&amp;modestbranding=1&amp;playsinline=1&amp;rel=0&amp;vq=hd1080"
      title="${esc(t.proofTitle)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      loading="lazy"
     ></iframe>
    </div>
   </div>
  </div>
 </section>

 <section class="gal-section" id="process">
  <div class="gal-wrap">
   <span class="gal-kicker">${esc(t.processKicker)}</span>
   <h2>${esc(t.processTitle)}</h2>
   <p class="gal-section__lead">${esc(t.processLead)}</p>
   <div class="gal-steps">${steps}</div>
  </div>
 </section>

 <section class="gal-section gal-section--paper" id="work">
  <div class="gal-wrap">
   <h2>${esc(t.workTitle)}</h2>
   <p class="gal-section__lead">${esc(t.workLead)}</p>
   <div class="gal-grid">${grid}</div>
  </div>
 </section>

 <section class="gal-section">
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

 <section class="gal-final">
  <div class="gal-wrap gal-final__inner">
   <h2>${esc(t.finalTitle)}</h2>
   <p class="gal-final__lead">${esc(t.finalLead)}</p>
   <div class="gal-cta-row gal-final__cta">
    <a class="gal-btn gal-btn--gold" href="${TURRIVA}" target="_blank" rel="noopener noreferrer" data-gh-cta="galleries_turriva_final">${esc(t.ctaPrimary)} <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">north_east</span></a>
    <a class="gal-btn gal-btn--ghost" href="${contactHref}" data-gh-cta="galleries_contact_final">${esc(t.ctaSecondary)}</a>
   </div>
  </div>
 </section>
</main>
<div class="gal-video-modal" id="videoModal" hidden>
 <button type="button" class="gal-video-modal__close" onclick="closeVideo()" aria-label="${isEn ? 'Close' : 'إغلاق'}">✕</button>
 <div class="gal-video-modal__inner">
  <div class="gal-video-modal__frame" id="vmPlayer"></div>
 </div>
</div>
${footer}
<script>
function playVideo(videoId) {
  var modal = document.getElementById('videoModal');
  var container = document.getElementById('vmPlayer');
  if (!modal || !container || !videoId) return;
  var src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1';
  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', src);
  iframe.setAttribute('title', ${isEn ? "'Exhibition film'" : "'فيلم المعرض'"});
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  container.innerHTML = '';
  container.appendChild(iframe);
  modal.hidden = false;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (window.ghTrack) window.ghTrack('video_play', { video_src: videoId, page_path: location.pathname });
}
function closeVideo() {
  var modal = document.getElementById('videoModal');
  var container = document.getElementById('vmPlayer');
  if (modal) { modal.classList.remove('is-open'); modal.hidden = true; }
  if (container) container.innerHTML = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });
document.getElementById('videoModal')?.addEventListener('click', function (e) {
  if (e.target === e.currentTarget) closeVideo();
});
</script>
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
<body><p><a href="${toPath}">${isEn ? 'Continue to Exhibition, Palace & Hotel Décor' : 'متابعة إلى ديكور المعارض والقصور والفنادق'}</a></p></body>
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
