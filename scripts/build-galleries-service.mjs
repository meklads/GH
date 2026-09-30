#!/usr/bin/env node
/**
 * Build galleries / spatial décor service landings (AR + EN).
 * Canonical URLs live under /services/galleries*.html (avoids stale
 * browser cache of the old root redirect stub → branding).
 * Positioning: developer sales galleries & exhibitions are the flagship;
 * palace/hotel décor is a secondary capability via Turriva design-and-build.
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
    title: 'معارض المطورين وصالات البيع | توريفا عبر Graphics House',
    description:
      'توريفا تصمّم وتنفّذ معارض المطورين وصلات البيع في المملكة والخليج — من الفكرة والتصميم إلى التصنيع والتركيب والتسليم.',
    canonical: 'https://3dgraphicshouse.com/services/galleries.html',
    altEn: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altAr: 'https://3dgraphicshouse.com/services/galleries.html',
    kicker: 'توريفا · متخصصون في بيئات البيع العقاري',
    h1: 'معارض المطورين <span>وصالات البيع</span>',
    lead:
      'نصمّم ونُنفّذ معارض المشاريع وصلات البيع للمطورين في المملكة والخليج. توريفا تتولّى المسار كاملًا: الفكرة، التصميم، التصنيع، التركيب، والتسليم.',
    ctaPrimary: 'ابدأ مشروعك مع توريفا',
    ctaSecondary: 'تواصل مع Graphics House',
    contactHref: '../contact-us.html',
    brandingHref: 'branding.html',
    scopeKicker: 'مجالات عملنا',
    aboutTitle: 'معارض المطورين أولًا… ثم نتوسّع عند الحاجة',
    aboutLead:
      'يحتاج المطوّر إلى معرض يعرض مشروعه بوضوح ويُقنع الزائر، وهذا جوهر عمل توريفا. ونمتد إلى صالات البيع وديكورات القصور والفنادق بمعايير التصميم والتنفيذ نفسها، دون أن يؤثر ذلك على تخصصنا الأساسي.',
    pillars: [
      {
        badge: 'التخصص الأساسي',
        title: 'معارض وقاعات عرض المشاريع',
        body:
          'معارض مؤسسية بمعايير المطوّر والمؤسسة، تُدار من اعتماد الفكرة إلى التصنيع والتركيب والتسليم، وتكون جاهزة قبل موعد الافتتاح.',
        featured: true,
      },
      {
        badge: 'تخصص مكمّل',
        title: 'صالات البيع للمطورين',
        body:
          'مسار زائر مدروس ونقاط عرض ومجسمات وشاشات ولافتات، تُبرز المشروع وتدعم قرار الشراء، وتُسلَّم جاهزة للتشغيل.',
      },
      {
        badge: 'خدمة إضافية',
        title: 'ديكور القصور والفنادق',
        body:
          'تنفيذ ديكورات الاستقبال والقاعات الخاصة ولوبيات الضيافة بالمنهجية نفسها، عندما يناسب ذلك نطاق المشروع.',
        secondary: true,
      },
    ],
    processKicker: 'منهجية العمل',
    processTitle: 'من قرار العرض إلى معرض جاهز للافتتاح',
    processLead:
      'أربع مراحل متسلسلة يقودها فريق توريفا، بحيث يصل المعرض إلى التصنيع وهو معتمد بالكامل، دون اجتهادات في الموقع ولا مفاجآت قبل الافتتاح.',
    steps: [
      {
        num: '01',
        title: 'فهم المشروع والجمهور',
        body: 'نحدد الجمهور المستهدف وهوية المشروع وقصته التسويقية، ليخدم التصميم قرار الشراء ويُبرز المشروع بدل أن يقتصر على الزخرفة.',
        featured: true,
      },
      {
        num: '02',
        title: 'تصميم التجربة وعرض الفكرة',
        body: 'نطوّر مفهوم المعرض ومسار الزائر ونقاط الجذب، ونعرضها بصريًا لتحصل على موافقة أصحاب القرار مبكرًا.',
      },
      {
        num: '03',
        title: 'رسومات تنفيذية معتمدة',
        body: 'مخططات دقيقة للتوزيع والارتفاعات والمواد وتسلسل التركيب، تُسلَّم للمصنع وفريق الموقع كحزمة واحدة متكاملة.',
      },
      {
        num: '04',
        title: 'تصنيع وتركيب وتسليم',
        body: 'يتابع الفريق نفسه التنفيذ حتى التسليم والافتتاح، بالجودة والهوية البصرية المعتمدة.',
      },
    ],
    workTitle: 'أعمال من صالات ومعارض منفَّذة',
    workLead:
      'معظم الأعمال هنا من بيئات البيع والعرض للمطورين والمؤسسات — مع لمحات من ديكور داخلي عند اتساع النطاق.',
    caps: [
      { src: 'turriva/mwl-hero', label: 'معرض مؤسسي — رابطة العالم الإسلامي' },
      { src: 'makkah-charter-04', label: 'قاعة عرض — ميثاق مكة' },
      { src: 'turriva/anan-eskan-gallery', label: 'صالة بيع — عنان إسكان' },
      { src: 'turriva/rafal-pavilions', label: 'بافيليونات عرض — رافال' },
      { src: 'turriva/project-joinery-b2b', label: 'نجارة وتركيب ميداني' },
      { src: 'turriva/hero-interior', label: 'ديكور داخلي — توسعة النطاق' },
    ],
    proofKicker: 'إثبات ميداني',
    proofTitle: 'معرض رابطة العالم الإسلامي',
    proofLead:
      'معرض كبير بأدوات عرض وديكور مكاني بمعايير مؤسسية: من الفكرة البصرية إلى التسليم الميداني — نفس منطق صالات المطورين على مقياس مؤسسي.',
    proofWatch: 'شاهد بالصوت',
    proofTag: 'تصميم · رسومات · تنفيذ ميداني',
    ytId: 'H66KNP1sQCk',
    handoffKicker: 'توريفا',
    handoffTitle: 'تصميم وتنفيذ صالات البيع… في مسار واحد',
    handoffBody:
      'توريفا متخصصة في بيئات البيع والعرض للمطورين: تصميم التجربة، الرسومات، التصنيع، التركيب، والتسليم. Graphics House يوجّهك إلى الفريق — وأنت تبدأ مع من سيصمّم وينفّذ الصالة أو المعرض.',
    handoffNoteBefore: 'للهوية البصرية والشعار والكتالوج راجع ',
    handoffNoteLink: 'صفحة الهوية البصرية',
    handoffNoteAfter: '. لصالات البيع ومعارض المطورين — مع إمكانية ديكور القصور والفنادق: توريفا تصمّم وتنفّذ.',
    finalTitle: 'جاهز لمناقشة معرض مطور أو صالة بيع؟',
    finalLead:
      'أرسل الموقع أو الموعد أو مخططاً أولياً. توريفا تبدأ بقراءة المشروع وتصميم تجربة الزائر — ثم تنتقل للتنفيذ بخطوة تالية واضحة خلال يوم عمل.',
  },
  en: {
    file: 'services/galleries-en.html',
    legacyFile: 'galleries-advertising-en.html',
    lang: 'en',
    dir: 'ltr',
    title: 'Developer Exhibitions & Sales Galleries | Turriva via Graphics House',
    description:
      'Turriva designs and builds developer exhibitions and sales galleries across KSA and the GCC — from concept and design to fabrication, installation, and handover.',
    canonical: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altEn: 'https://3dgraphicshouse.com/services/galleries-en.html',
    altAr: 'https://3dgraphicshouse.com/services/galleries.html',
    kicker: 'Turriva · Specialists in real-estate sales environments',
    h1: 'Developer exhibitions <span>&amp; sales galleries</span>',
    lead:
      'We design and build project exhibitions and sales galleries for developers across KSA and the GCC. Turriva owns the full path: concept, design, fabrication, installation, and handover.',
    ctaPrimary: 'Start your project with Turriva',
    ctaSecondary: 'Contact Graphics House',
    contactHref: '../contact-us-en.html',
    brandingHref: 'branding-en.html',
    scopeKicker: 'What we do',
    aboutTitle: 'Developer exhibitions first… then we expand when needed',
    aboutLead:
      'Developers need an exhibition that presents the project clearly and persuades the visitor — that is Turriva’s core. We also extend to sales galleries and palace or hotel décor at the same design-and-build standard, without diluting the flagship focus.',
    pillars: [
      {
        badge: 'Core specialty',
        title: 'Project exhibitions & presentation halls',
        body:
          'Institutional exhibitions to developer and institution standards — managed from concept approval through fabrication, install, and handover, ready before opening day.',
        featured: true,
      },
      {
        badge: 'Complementary',
        title: 'Developer sales galleries',
        body:
          'A considered visitor path with display points, maquettes, screens, and signage — presenting the project, supporting the purchase decision, and handed over ready to operate.',
      },
      {
        badge: 'Additional service',
        title: 'Palace & hotel décor',
        body:
          'Reception décor, private halls, and hospitality lobbies on the same methodology — when that fits the project scope.',
        secondary: true,
      },
    ],
    processKicker: 'How we work',
    processTitle: 'From the exhibition decision to an opening-ready hall',
    processLead:
      'Four sequential stages led by the Turriva team — so the exhibition reaches fabrication fully approved, without on-site improvisation or pre-opening surprises.',
    steps: [
      {
        num: '01',
        title: 'Understand the project and audience',
        body: 'We define the target audience, project identity, and marketing story — so design serves the purchase decision and elevates the project instead of stopping at decoration.',
        featured: true,
      },
      {
        num: '02',
        title: 'Design the experience and present the idea',
        body: 'We develop the exhibition concept, visitor path, and attraction points — shown visually for early stakeholder approval.',
      },
      {
        num: '03',
        title: 'Approved execution drawings',
        body: 'Precise layouts for distribution, elevations, materials, and install sequence — handed to factory and site teams as one complete package.',
      },
      {
        num: '04',
        title: 'Fabricate, install, and hand over',
        body: 'The same team follows execution through handover and opening — at the approved quality and visual identity.',
      },
    ],
    workTitle: 'Selected sales & exhibition work',
    workLead:
      'Most work here is developer and institutional sales or exhibition environments — with a few interior glimpses when scope expands.',
    caps: [
      { src: 'turriva/mwl-hero', label: 'Institutional exhibition — Muslim World League' },
      { src: 'makkah-charter-04', label: 'Presentation hall — Makkah Charter' },
      { src: 'turriva/anan-eskan-gallery', label: 'Sales gallery — Anan Eskan' },
      { src: 'turriva/rafal-pavilions', label: 'Display pavilions — Rafal' },
      { src: 'turriva/project-joinery-b2b', label: 'Joinery & field install' },
      { src: 'turriva/hero-interior', label: 'Interior décor — scope extension' },
    ],
    proofKicker: 'Field proof',
    proofTitle: 'Muslim World League exhibition',
    proofLead:
      'A large exhibition with display tools and spatial décor at institutional standard: from visual concept to field handover — the same logic as developer galleries, at institutional scale.',
    proofWatch: 'Watch with sound',
    proofTag: 'Design · drawings · field install',
    ytId: 'H66KNP1sQCk',
    handoffKicker: 'Turriva',
    handoffTitle: 'Sales-gallery design and build — on one path',
    handoffBody:
      'Turriva specializes in developer sales and exhibition environments: experience design, drawings, fabrication, install, and handover. Graphics House routes you to the team — you start with the people who will design and build the gallery or exhibition.',
    handoffNoteBefore: 'For logo, guidelines, and catalogue identity see ',
    handoffNoteLink: 'Visual Identity',
    handoffNoteAfter: '. For sales galleries and developer exhibitions — with palace and hotel décor when needed: Turriva designs and builds.',
    finalTitle: 'Ready to discuss a developer exhibition or sales gallery?',
    finalLead:
      'Send the site, target date, or an early plan. Turriva starts by reading the project and designing the visitor experience — then moves to delivery with a clear next step within one business day.',
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
    .map((p, i) => {
      const tone = p.featured
        ? ' gal-scope--featured'
        : p.secondary
          ? ' gal-scope--secondary'
          : ' gal-scope--core';
      return `<div class="gal-scope${tone} reveal${i ? ` r${i}` : ''}">
 <span class="gal-scope__badge">${esc(p.badge)}</span>
 <strong>${esc(p.title)}</strong>
 <p>${esc(p.body)}</p>
</div>`;
    })
    .join('\n');

  const steps = t.steps
    .map(
      (s, i) => `<div class="gal-step${s.featured ? ' gal-step--featured' : ''} reveal${i ? ` r${Math.min(i, 3)}` : ''}">
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
<link rel="stylesheet" href="${asset}gh-galleries-service.css?v=13">
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
    name: isEn ? 'Developer Exhibitions & Sales Galleries' : 'معارض المطورين وصالات البيع',
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
<body><p><a href="${toPath}">${isEn ? 'Continue to Developer Exhibitions & Sales Galleries' : 'متابعة إلى معارض المطورين وصالات البيع'}</a></p></body>
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
