#!/usr/bin/env node
/**
 * Premium editorial case study: Jeddah Real Estate Forum (AR + EN)
 * Run: node scripts/build-jeddah-forum-case-study.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';
import { getLayout } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'case-studies/data/jeddah-real-estate-forum.json'), 'utf8')
);
const OUT_DIR = path.join(ROOT, 'case-studies');
const P = '../';
const BASE = 'https://3dgraphicshouse.com';

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

const COPY = {
  ar: {
    title: 'ملتقى جدة للعقار | Case Study | Graphics House',
    description:
      'Case Study لمشروع ملتقى جدة للعقار: هوية بصرية، فيلم CGI سينمائي، محتوى، كتالوج ومواد مطبوعة من Graphics House في جدة.',
    heroEyebrow: 'Case Study · Graphics House',
    heroTitle: 'ملتقى جدة للعقار',
    heroEn: 'Jeddah Real Estate Forum',
    heroDek:
      'تطوير هوية بصرية متكاملة وكتالوج فاخر وتجربة بصرية وسينمائية لملتقى جدة للعقار، من الشعار والزخارف إلى الفيلم والمطبوعات.',
    metaLocation: 'جدة، المملكة العربية السعودية',
    metaScope: 'هوية بصرية · فيلم CGI · محتوى · إنتاج مطبوعات',
    metaAgency: 'Graphics House',
    scroll: 'Scroll',
    experienceTitle: 'عندما تصبح الهوية تجربة',
    experienceMeta: 'WHEN IDENTITY BECOMES AN EXPERIENCE',
    experienceP1:
      'لم يكن دور Graphics House في ملتقى جدة للعقار إنتاج مواد منفصلة. امتد العمل ليشمل بناء الهوية البصرية للمشروع، تطوير عالمه الإبداعي، ثم تحويل هذه الهوية إلى تجربة سينمائية ومنظومة متكاملة من المحتوى والعناصر الفنية والمطبوعات.',
    experienceP2:
      'كل مخرج يخدم نقطة تواصل واحدة: حضور الملتقى في جدة كحدث عقاري كبير يستحق لغة بصرية موحدة من الشعار حتى الشاشة والمطبوعة.',
    pipeline: ['IDENTITY', 'VISUAL LANGUAGE', 'CINEMATIC FILM', 'CONTENT', 'PRINT & ART DIRECTION'],
    challengeTitle: 'من فكرة إلى حضور',
    challengeMeta: 'FROM IDEA TO PRESENCE',
    challengeP:
      'كان التحدي خلق حضوراً بصرياً يليق بملتقى عقاري كبير في جدة، ويمنح المشروع شخصية واضحة قابلة للتطبيق عبر مختلف نقاط التواصل. عملنا على لغة بصرية موحدة تنتقل بسلاسة بين الهوية والفيلم والمحتوى والمطبوعات، مع الحفاظ على شخصية واحدة متماسكة.',
    words: ['IDENTITY', 'STORY', 'IMPACT'],
    identityTitle: 'بناء هوية المشروع',
    identityMeta: 'BRAND IDENTITY',
    identityP:
      'بدأ المشروع من الهوية. صممنا شعار ملتقى جدة للعقار وبنينا الثيم البصري الكامل: اللغة البصرية، الألوان، الزخارف الهندسية، والأسلوب الفني الذي حمله الكتالوج والفيلم والمحتوى والمطبوعات.',
    applicationTitle: 'الهوية خارج الشعار',
    applicationP:
      'قوة الهوية تظهر عندما تنتقل من الشعار إلى التجربة: خلفيات، لافتات، شاشات، مواد فعالية، وعناصر ترويجية تحمل نفس الإيقاع البصري.',
    filmTitle: 'رواية المشروع بالصورة',
    filmMeta: 'CINEMATIC CGI FILM',
    filmP:
      'بعد بناء الهوية، انتقلت اللغة البصرية إلى الفيلم. أنتجنا فيلماً ثلاثي الأبعاد تخيلياً بأسلوب سينمائي يحول فكرة الملتقى إلى عالم بصري متكامل، ويمنح المشروع حضوراً يتجاوز حدود التصميم الثابت.',
    watchFilm: 'WATCH THE FILM',
    watchSub: 'Jeddah Real Estate Forum · Cinematic CGI',
    framesTitle: 'من الفكرة إلى المشهد',
    contentTitle: 'بناء المنظومة البصرية',
    contentMeta: 'CONTENT & ART DIRECTION',
    contentP:
      'لم يتوقف العمل عند الهوية والفيلم. طوّرنا المحتوى الكامل للمشروع والعناصر الفنية والمواد البصرية اللازمة لتقديم الملتقى بصورة متماسكة عبر القنوات الرقمية والفعالية.',
    printTitle: 'عندما تصبح الفكرة مطبوعة',
    printMeta: 'CATALOGUE & PRINT',
    printP:
      'صممنا كتالوجاً من ٤٤ صفحة يحمل الهوية كاملة: الرؤية والرسالة والمحاور والمواد الترويجية، مع زخارف إسلامية هندسية وشعار «نعمل لغد أفضل» في الافتتاح والختام.',
    poetryMeta: 'BRAND MOTTO',
    poetryTitle: 'الشعار الذي يحمله الكتالوج',
    visionMeta: 'OUR VISION',
    visionTitle: 'رؤيتنا',
    missionMeta: 'OUR MISSION',
    missionTitle: 'رسالتنا',
    paletteTitle: 'لوحة الألوان',
    themesMeta: 'FORUM THEMES',
    themesTitle: 'محاور الملتقى',
    themesP: 'ستة محاور رئيسية صاغت لغة الكتالوج والحملة والمواد المرئية للملتقى.',
    catalogMeta: 'CATALOGUE SPREADS',
    catalogTitle: 'من داخل الكتالوج',
    catalogP: 'صفحات مختارة من الكتالوج الذي أنتجته Graphics House، تعكس الهوية والزخارف والمحتوى كما طُبعت.',
    systemTitle: 'نظام بصري واحد. تطبيقات متعددة.',
    systemP: 'صُممت جميع مخرجات المشروع كأجزاء من منظومة واحدة، لا كقطع منفصلة.',
    systemSteps: ['BRAND', 'CAMPAIGN', 'FILM', 'CONTENT', 'PRINT', 'EXPERIENCE'],
    behindTitle: 'خلف الكواليس',
    behindMeta: 'BEHIND THE CREATIVE',
    behindP:
      'من الموجز الأول إلى الإطار الأخير في الفيلم: مسار عمل واحد يربط الهوية بالإنتاج السينمائي ثم بالمحتوى والمطبوعات.',
    scopeTitle: 'نطاق العمل',
    scopeMeta: 'OUR SCOPE',
    statement1: 'أكثر من هوية.',
    statement2: 'تجربة متكاملة.',
    statementMeta: 'MORE THAN AN IDENTITY. A COMPLETE EXPERIENCE.',
    statementP:
      'في ملتقى جدة للعقار، جمعنا الهوية والتصميم والإنتاج السينمائي والمحتوى والمطبوعات ضمن لغة إبداعية واحدة، لتصبح كل نقطة تواصل جزءاً من قصة واحدة.',
    finalLine: 'JEDDAH REAL ESTATE FORUM',
    finalAgency: 'GRAPHICS HOUSE',
    prevLabel: 'المشروع السابق',
    allLabel: 'كل الأعمال',
    allHref: '../portfolio.html',
    nextLabel: 'المشروع التالي',
    ctaTitle: 'هل لديك مشروع يحتاج إلى أكثر من تصميم؟',
    ctaP:
      'من الهوية إلى الفيلم، ومن الفكرة إلى التجربة، نبني منظومات بصرية تجعل المشاريع أكثر حضوراً.',
    ctaPrimary: 'ابدأ مشروعك',
    ctaSecondary: 'استكشف أعمالنا',
    ctaPrimaryHref: '../contact-us.html',
    ctaSecondaryHref: '../portfolio.html',
  },
  en: {
    title: 'Jeddah Real Estate Forum | Case Study | Graphics House',
    description:
      'Case study for Jeddah Real Estate Forum: brand identity, cinematic CGI film, content, catalogue, and print production by Graphics House in Jeddah.',
    heroEyebrow: 'Case Study · Graphics House',
    heroTitle: 'Jeddah Real Estate Forum',
    heroEn: 'ملتقى جدة للعقار',
    heroDek:
      'Integrated brand identity, a premium 44-page catalogue, and a cinematic visual experience for Jeddah\'s flagship real estate forum, from logo and ornaments to film and print.',
    metaLocation: 'Jeddah, Saudi Arabia',
    metaScope: 'Brand Identity · CGI Film · Content · Print & Visual Production',
    metaAgency: 'Graphics House',
    scroll: 'Scroll',
    experienceTitle: 'When identity becomes an experience',
    experienceMeta: 'WHEN IDENTITY BECOMES AN EXPERIENCE',
    experienceP1:
      'Graphics House did not deliver disconnected assets for Jeddah Real Estate Forum. We built the project\'s visual identity, shaped its creative world, then translated that identity into a cinematic film and an integrated system of content, art direction, and print.',
    experienceP2:
      'Every deliverable served one communication goal: a major Jeddah real estate event with one visual language from logo to screen to print.',
    pipeline: ['IDENTITY', 'VISUAL LANGUAGE', 'CINEMATIC FILM', 'CONTENT', 'PRINT & ART DIRECTION'],
    challengeTitle: 'From idea to presence',
    challengeMeta: 'FROM IDEA TO PRESENCE',
    challengeP:
      'The challenge was a visual presence worthy of a major Jeddah real estate forum: a clear personality that could travel across every touchpoint. We built one visual language moving smoothly from identity to film, content, and print without losing coherence.',
    words: ['IDENTITY', 'STORY', 'IMPACT'],
    identityTitle: 'Building the project identity',
    identityMeta: 'BRAND IDENTITY',
    identityP:
      'The project began with identity. We designed the forum logo and full visual theme: graphic language, colour, geometric ornaments, and art direction carried through the catalogue, film, content, and print.',
    applicationTitle: 'Identity beyond the logo',
    applicationP:
      'Identity proves itself in application: backdrops, signage, screens, event materials, and promotional pieces sharing the same visual rhythm.',
    filmTitle: 'Telling the story in motion',
    filmMeta: 'CINEMATIC CGI FILM',
    filmP:
      'Once identity was set, the visual language moved into film. We produced a cinematic CGI piece that turns the forum idea into an integrated visual world and gives the project a presence beyond static design.',
    watchFilm: 'WATCH THE FILM',
    watchSub: 'Jeddah Real Estate Forum · Cinematic CGI',
    framesTitle: 'From idea to frame',
    contentTitle: 'Building the visual system',
    contentMeta: 'CONTENT & ART DIRECTION',
    contentP:
      'Work did not stop at identity and film. We developed the full content suite and art-directed assets needed to present the forum consistently across digital channels and the live event.',
    printTitle: 'When the idea becomes print',
    printMeta: 'CATALOGUE & PRINT',
    printP:
      'We designed a 44-page catalogue carrying the full identity: vision, mission, themes, and promotional materials, with Islamic geometric ornaments and the motto "Working for a better tomorrow" opening and closing the book.',
    poetryMeta: 'BRAND MOTTO',
    poetryTitle: 'The motto that carries the catalogue',
    visionMeta: 'OUR VISION',
    visionTitle: 'Our vision',
    missionMeta: 'OUR MISSION',
    missionTitle: 'Our mission',
    paletteTitle: 'Colour palette',
    themesMeta: 'FORUM THEMES',
    themesTitle: 'Forum themes',
    themesP: 'Six core themes that shaped the catalogue language, campaign, and visual materials for the forum.',
    catalogMeta: 'CATALOGUE SPREADS',
    catalogTitle: 'Inside the catalogue',
    catalogP: 'Selected spreads from the catalogue produced by Graphics House, reflecting identity, ornaments, and content as printed.',
    systemTitle: 'One visual system. Many applications.',
    systemP: 'Every output was designed as part of one system, not isolated pieces.',
    systemSteps: ['BRAND', 'CAMPAIGN', 'FILM', 'CONTENT', 'PRINT', 'EXPERIENCE'],
    behindTitle: 'Behind the creative',
    behindMeta: 'BEHIND THE CREATIVE',
    behindP:
      'From the first brief to the final film frame: one workflow linking identity, cinematic production, content, and print.',
    scopeTitle: 'Our scope',
    scopeMeta: 'OUR SCOPE',
    statement1: 'More than identity.',
    statement2: 'A complete experience.',
    statementMeta: 'MORE THAN AN IDENTITY. A COMPLETE EXPERIENCE.',
    statementP:
      'For Jeddah Real Estate Forum, we united identity, design, cinematic production, content, and print in one creative language so every touchpoint reads as part of the same story.',
    finalLine: 'JEDDAH REAL ESTATE FORUM',
    finalAgency: 'GRAPHICS HOUSE',
    prevLabel: 'Previous project',
    allLabel: 'All projects',
    allHref: '../portfolio-en.html',
    nextLabel: 'Next project',
    ctaTitle: 'Does your project need more than a single design?',
    ctaP:
      'From identity to film, from idea to experience, we build visual systems that give projects real presence.',
    ctaPrimary: 'Start your project',
    ctaSecondary: 'Explore our work',
    ctaPrimaryHref: '../contact-us-en.html',
    ctaSecondaryHref: '../portfolio-en.html',
  },
};

function figure(src, alt, caption, className = '', lazy = true) {
  const cap = caption ? `<figcaption>${esc(caption)}</figcaption>` : '';
  return `<figure class="jcs-figure ${className}" data-jcs-lightbox="${P}${src}">
    <img src="${P}${src}" alt="${esc(alt)}" loading="${lazy ? 'lazy' : 'eager'}" decoding="async">
    ${cap}
  </figure>`;
}

function galleryItems(items, lang) {
  return items
    .map((item) => {
      const cls =
        item.size === 'hero'
          ? 'jcs-figure--hero'
          : item.size === 'half'
            ? 'jcs-figure--half'
            : item.size === 'logo'
              ? 'jcs-figure--logo'
              : '';
      const cap = item.caption ? L(item.caption, lang) : '';
      return figure(item.src, L(item.alt, lang), cap, cls);
    })
    .join('');
}

function buildPage(lang) {
  const isEn = lang === 'en';
  const c = COPY[lang];
  const depth = 1;
  const { header, footer } = getLayout(lang, depth);
  const slug = isEn ? 'jeddah-real-estate-forum-en' : 'jeddah-real-estate-forum';
  const canonical = `${BASE}/case-studies/${slug}.html`;
  const altEn = `${BASE}/case-studies/jeddah-real-estate-forum-en.html`;
  const altAr = `${BASE}/case-studies/jeddah-real-estate-forum.html`;
  const prevHref = isEn ? DATA.nav.prev.hrefEn : DATA.nav.prev.href;
  const nextHref = isEn ? DATA.nav.next.hrefEn : DATA.nav.next.href;

  const pipelineHtml = c.pipeline
    .map((step, i) => {
      const arrow = i < c.pipeline.length - 1 ? '<span class="jcs-pipe-arrow">↓</span>' : '';
      return `<span>${esc(step)}</span>${arrow}`;
    })
    .join('');

  const framesHtml = DATA.frames
    .map((f) => {
      if (f.layout === 'full') {
        return `<div class="jcs-frame-full jcs-reveal">${figure(f.src, L(f.caption, lang), L(f.caption, lang))}</div>`;
      }
      return '';
    })
    .join('');

  const framePair = DATA.frames.filter((f) => f.layout !== 'full');
  const framePairHtml =
    framePair.length >= 2
      ? `<div class="jcs-frame-pair jcs-reveal">${framePair
          .slice(0, 2)
          .map((f) => figure(f.src, L(f.caption, lang), L(f.caption, lang)))
          .join('')}</div>`
      : '';

  const deliverablesHtml = DATA.deliverables
    .map(
      (d, i) => `<li class="jcs-reveal">
        <span class="jcs-scope-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="jcs-scope-text">${esc(L(d, lang))}</span>
      </li>`
    )
    .join('');

  const missionHtml = DATA.mission
    .map((m) => `<li>${esc(L(m, lang))}</li>`)
    .join('');

  const paletteHtml = DATA.palette
    .map(
      (sw) => `<div class="jcs-palette-swatch jcs-reveal">
        <span style="background:${esc(sw.hex)}"></span>
        <span>${esc(L(sw.name, lang))} · ${esc(sw.hex)}</span>
      </div>`
    )
    .join('');

  const themesHtml = DATA.themes
    .map((t) => {
      const lines = t.items[lang] || t.items.en || [];
      const items = lines.map((line) => `<li>${esc(line)}</li>`).join('');
      return `<article class="jcs-theme-card jcs-reveal">
        <span class="jcs-theme-num">${esc(t.num)}</span>
        <h3>${esc(L(t.title, lang))}</h3>
        <ul>${items}</ul>
      </article>`;
    })
    .join('');

  const catalogHtml = DATA.catalogSpreads
    .map(
      (sp) => `<figure class="jcs-catalog-item jcs-reveal" data-jcs-lightbox="${P}${sp.src}">
        <img src="${P}${sp.src}" alt="${esc(L(sp.label, lang))}" loading="lazy" decoding="async">
        <figcaption>${esc(L(sp.label, lang))}</figcaption>
      </figure>`
    )
    .join('');

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: c.heroTitle,
    alternateName: c.heroEn,
    description: c.description,
    image: `${BASE}/${DATA.heroImage}`,
    creator: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    locationCreated: { '@type': 'Place', name: c.metaLocation },
    inLanguage: isEn ? 'en' : 'ar',
    url: canonical,
  });

  return `<!DOCTYPE html>
<html dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="${P}assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags(P)}
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="ar" href="${altAr}">
<link rel="alternate" hreflang="x-default" href="${altEn}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.description)}"/>
<meta name="keywords" content="${esc(isEn ? 'Jeddah Real Estate Forum, brand identity, cinematic CGI, Graphics House case study' : 'ملتقى جدة للعقار, هوية بصرية, فيلم CGI, دراسة حالة Graphics House')}"/>
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:image" content="${BASE}/${DATA.heroImage}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="image" href="${P}${DATA.heroImage}">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="${P}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${P}assets/gh-tokens.css?v=1">
<link rel="stylesheet" href="${P}assets/site-header.css?v=35">
<link rel="stylesheet" href="${P}assets/gh-site-enhancements.css?v=28">
<link rel="stylesheet" href="${P}assets/gh-float-widgets.css?v=8">
<link rel="stylesheet" href="${P}assets/gh-jeddah-forum-cs.css?v=2">
<script defer src="${P}assets/site-header.js?v=16"></script>
<script defer src="${P}assets/gh-performance.js?v=10"></script>
<script defer src="${P}assets/lang-switch.js?v=2"></script>
<script type="application/ld+json">${schema}</script>
</head>
<body class="jcs-page" data-yt-id="${DATA.youtubeId}">
${header}
<div id="main-content" tabindex="-1"></div>

<section class="jcs-hero" aria-label="${esc(c.heroTitle)}">
  <div class="jcs-hero-bg">
    <img src="${P}${DATA.heroImage}" alt="${esc(c.heroTitle)}" width="1920" height="1080" fetchpriority="high">
  </div>
  <div class="jcs-hero-pattern" aria-hidden="true"></div>
  <div class="jcs-wrap jcs-hero-inner">
    <div class="jcs-hero-grid">
      <div>
        <img class="jcs-hero-logo" src="${P}${DATA.logo}" alt="${esc(c.heroTitle)} logo" width="200" height="280">
        <span class="jcs-meta">${esc(c.heroEyebrow)}</span>
        <h1>${esc(c.heroTitle)}</h1>
        <p class="jcs-hero-en">${esc(c.heroEn)}</p>
        <p class="jcs-hero-motto">${esc(L(DATA.motto, lang))}</p>
        <p class="jcs-hero-2030">${esc(L(DATA.vision2030, lang))}</p>
        <p class="jcs-hero-dek">${esc(c.heroDek)}</p>
      </div>
      <dl class="jcs-hero-meta">
        <div><dt>Location</dt><dd>${esc(c.metaLocation)}</dd></div>
        <div><dt>Scope</dt><dd>${esc(c.metaScope)}</dd></div>
        <div><dt>Agency</dt><dd>${esc(c.metaAgency)}</dd></div>
      </dl>
    </div>
  </div>
  <div class="jcs-scroll" aria-hidden="true">${esc(c.scroll)}<span></span></div>
</section>

<section class="jcs-poetry" aria-label="${esc(L(DATA.motto, lang))}">
  <div class="jcs-wrap jcs-poetry-inner jcs-reveal">
    <span class="jcs-meta">${esc(c.poetryMeta)}</span>
    <h2 class="jcs-section-head" style="margin:12px 0 0;border:none">${esc(c.poetryTitle)}</h2>
    <div class="jcs-poetry-grid">
      <img class="jcs-poetry-ornament" src="${P}assets/projects/jeddah-forum/motif-divider.svg" alt="" aria-hidden="true">
      <div>
        <p class="jcs-poetry-quote">${esc(L(DATA.motto, lang))}</p>
        <p class="jcs-poetry-sub">${esc(L(DATA.vision2030, lang))}</p>
        <div class="jcs-poetry-divider" aria-hidden="true"></div>
      </div>
      <img class="jcs-poetry-ornament" src="${P}assets/projects/jeddah-forum/motif-divider.svg" alt="" aria-hidden="true">
    </div>
  </div>
</section>

<section class="jcs-section jcs-section--paper">
  <div class="jcs-wrap jcs-reveal">
    <div class="jcs-vision-block">
      <h2 class="jcs-vision-title">${esc(c.visionTitle)}</h2>
      <div>
        <span class="jcs-meta jcs-meta-en">${esc(c.visionMeta)}</span>
        <p class="jcs-vision-text">${esc(L(DATA.vision, lang))}</p>
      </div>
    </div>
    <div class="jcs-vision-block" style="margin-top:64px">
      <h2 class="jcs-vision-title">${esc(c.missionTitle)}</h2>
      <div>
        <span class="jcs-meta jcs-meta-en">${esc(c.missionMeta)}</span>
        <ul class="jcs-mission-list">${missionHtml}</ul>
      </div>
    </div>
  </div>
</section>

<section class="jcs-section jcs-section--dark">
  <div class="jcs-wrap jcs-reveal">
    <div class="jcs-section-head">
      <span class="jcs-meta">${esc(c.experienceMeta)}</span>
      <h2>${esc(c.experienceTitle)}</h2>
    </div>
    <p class="jcs-lead">${esc(c.experienceP1)}</p>
    <p class="jcs-lead" style="margin-top:1.25rem">${esc(c.experienceP2)}</p>
    <div class="jcs-pipeline" aria-label="Process">${pipelineHtml}</div>
  </div>
</section>

<section class="jcs-section jcs-section--paper">
  <div class="jcs-wrap">
    <div class="jcs-split jcs-reveal">
      <div>
        <div class="jcs-section-head">
          <span class="jcs-meta jcs-meta-en">${esc(c.challengeMeta)}</span>
          <h2>${esc(c.challengeTitle)}</h2>
        </div>
        <p class="jcs-lead">${esc(c.challengeP)}</p>
        <div class="jcs-words-xl">${c.words.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
      </div>
      <div>${figure(DATA.heroImage, c.heroTitle, '', '', true)}</div>
    </div>
  </div>
</section>

<section class="jcs-section jcs-section--paper" id="identity">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <span class="jcs-meta">${esc(c.identityMeta)}</span>
      <h2>${esc(c.identityTitle)}</h2>
    </div>
    <p class="jcs-lead jcs-reveal">${esc(c.identityP)}</p>
    <div class="jcs-palette jcs-reveal" aria-label="${esc(c.paletteTitle)}">${paletteHtml}</div>
    <div class="jcs-grid-editorial jcs-reveal" style="margin-top:48px">${galleryItems(DATA.identityGallery, lang)}</div>
  </div>
</section>

<section class="jcs-section jcs-section--paper">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <span class="jcs-meta jcs-meta-en">${esc(c.themesMeta)}</span>
      <h2>${esc(c.themesTitle)}</h2>
    </div>
    <p class="jcs-lead jcs-reveal">${esc(c.themesP)}</p>
    <div class="jcs-themes">${themesHtml}</div>
  </div>
</section>

<section class="jcs-section jcs-section--paper" id="catalog">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <span class="jcs-meta jcs-meta-en">${esc(c.catalogMeta)}</span>
      <h2>${esc(c.catalogTitle)}</h2>
    </div>
    <p class="jcs-lead jcs-reveal">${esc(c.catalogP)}</p>
    <div class="jcs-catalog-scroll jcs-reveal" role="list">${catalogHtml}</div>
  </div>
</section>

<section class="jcs-section jcs-section--paper">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <h2>${esc(c.applicationTitle)}</h2>
    </div>
    <p class="jcs-lead jcs-reveal">${esc(c.applicationP)}</p>
    <div class="jcs-grid-masonry jcs-reveal" style="margin-top:40px">${DATA.applicationGallery
      .map((item) => figure(item.src, L(item.alt, lang), L(item.caption, lang)))
      .join('')}</div>
  </div>
</section>

<section class="jcs-section jcs-section--dark" id="film">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <span class="jcs-meta">${esc(c.filmMeta)}</span>
      <h2>${esc(c.filmTitle)}</h2>
    </div>
    <p class="jcs-lead jcs-reveal">${esc(c.filmP)}</p>
    <div class="jcs-video-block jcs-reveal" style="margin-top:48px">
      <div class="jcs-video-shell" data-jcs-play role="button" tabindex="0" aria-label="${esc(c.watchFilm)}">
        <img src="${P}${DATA.filmPoster}" alt="${esc(c.heroTitle)} film poster" loading="lazy">
        <button type="button" class="jcs-play" data-jcs-play aria-label="${esc(c.watchFilm)}">
          <span class="jcs-play-ring"><span class="material-symbols-outlined">play_arrow</span></span>
        </button>
      </div>
      <div class="jcs-video-label">
        <span class="jcs-meta">${esc(c.watchFilm)}</span>
        <p>${esc(c.watchSub)}</p>
      </div>
    </div>
  </div>
</section>

<section class="jcs-section jcs-section--dark">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal"><h2>${esc(c.framesTitle)}</h2></div>
    ${framesHtml}
    ${framePairHtml}
  </div>
</section>

<section class="jcs-section jcs-section--paper" id="content">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <span class="jcs-meta jcs-meta-en">${esc(c.contentMeta)}</span>
      <h2>${esc(c.contentTitle)}</h2>
    </div>
    <p class="jcs-lead jcs-reveal">${esc(c.contentP)}</p>
    <div class="jcs-print-trio jcs-reveal" style="margin-top:40px">${DATA.contentGallery
      .map((item) => figure(item.src, L(item.alt, lang), ''))
      .join('')}</div>
  </div>
</section>

<section class="jcs-section jcs-section--dark" id="print">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <span class="jcs-meta">${esc(c.printMeta)}</span>
      <h2>${esc(c.printTitle)}</h2>
    </div>
    <p class="jcs-lead jcs-reveal">${esc(c.printP)}</p>
    <div class="jcs-print-trio jcs-reveal" style="margin-top:40px">${DATA.printGallery
      .map((item) => figure(item.src, L(item.alt, lang), ''))
      .join('')}</div>
  </div>
</section>

<section class="jcs-section jcs-section--dark">
  <div class="jcs-wrap jcs-system jcs-reveal">
    <div>
      <div class="jcs-section-head"><h2>${esc(c.systemTitle)}</h2></div>
      <p class="jcs-lead">${esc(c.systemP)}</p>
      <div class="jcs-system-steps" style="margin-top:32px">${c.systemSteps
        .map((s) => `<div class="jcs-system-step">${esc(s)}</div>`)
        .join('')}</div>
    </div>
    <div class="jcs-system-grid">
      <img src="${P}${DATA.heroImage}" alt="" loading="lazy">
      <img src="${P}${DATA.filmPoster}" alt="" loading="lazy">
      <img src="${P}${DATA.heroImage}" alt="" loading="lazy">
    </div>
  </div>
</section>

<section class="jcs-section jcs-section--paper">
  <div class="jcs-wrap jcs-reveal">
    <div class="jcs-section-head">
      <span class="jcs-meta jcs-meta-en">${esc(c.behindMeta)}</span>
      <h2>${esc(c.behindTitle)}</h2>
    </div>
    <p class="jcs-lead">${esc(c.behindP)}</p>
    <div class="jcs-frame-pair" style="margin-top:40px">
      ${figure(DATA.filmPoster, c.behindTitle, '')}
      ${figure(DATA.heroImage, c.identityTitle, '')}
    </div>
  </div>
</section>

<section class="jcs-section jcs-section--paper">
  <div class="jcs-wrap">
    <div class="jcs-section-head jcs-reveal">
      <span class="jcs-meta jcs-meta-en">${esc(c.scopeMeta)}</span>
      <h2>${esc(c.scopeTitle)}</h2>
    </div>
    <ul class="jcs-scope-list">${deliverablesHtml}</ul>
  </div>
</section>

<section class="jcs-statement jcs-section--paper">
  <span class="jcs-meta jcs-meta-en">${esc(c.statementMeta)}</span>
  <h2 style="color:var(--jcs-burgundy)">${esc(c.statement1)}<br>${esc(c.statement2)}</h2>
  <p style="color:var(--jcs-muted)">${esc(c.statementP)}</p>
  <p class="jcs-poetry-quote" style="font-size:clamp(28px,4vw,48px);margin-top:48px">${esc(L(DATA.motto, lang))}</p>
</section>

<section class="jcs-final-visual" aria-hidden="true">
  <img src="${P}assets/projects/jeddah-forum/catalog/page-44.jpg" alt="" loading="lazy">
  <div class="jcs-wrap">
    <span class="jcs-meta">${esc(c.finalLine)}</span>
    <h2>${esc(c.finalAgency)}</h2>
  </div>
</section>

<nav class="jcs-wrap jcs-proj-nav" aria-label="Project navigation">
  <a href="${prevHref}" class="jcs-proj-nav-prev">
    <img src="${P}${DATA.nav.prev.image}" alt="">
    <div><span class="jcs-meta">${esc(c.prevLabel)}</span><strong>${esc(L(DATA.nav.prev.title, lang))}</strong></div>
  </a>
  <a href="${c.allHref}" class="jcs-proj-nav-center"><span class="jcs-meta">${esc(c.allLabel)}</span></a>
  <a href="${nextHref}" class="jcs-proj-nav-next">
    <div><span class="jcs-meta">${esc(c.nextLabel)}</span><strong>${esc(L(DATA.nav.next.title, lang))}</strong></div>
    <img src="${P}${DATA.nav.next.image}" alt="">
  </a>
</nav>

<section class="jcs-cta">
  <div class="jcs-wrap jcs-reveal">
    <h2>${esc(c.ctaTitle)}</h2>
    <p>${esc(c.ctaP)}</p>
    <div class="jcs-cta-btns">
      <a href="${c.ctaPrimaryHref}" class="jcs-btn jcs-btn--gold">${esc(c.ctaPrimary)}</a>
      <a href="${c.ctaSecondaryHref}" class="jcs-btn jcs-btn--outline">${esc(c.ctaSecondary)}</a>
    </div>
  </div>
</section>

<div class="jcs-lightbox" id="jcsLightbox" role="dialog" aria-modal="true" aria-label="Image">
  <button type="button" class="jcs-lightbox-close" id="jcsLightboxClose" aria-label="Close">&times;</button>
  <img id="jcsLightboxImg" src="" alt="">
</div>
<div class="jcs-video-modal" id="jcsVideoModal" role="dialog" aria-modal="true" aria-label="Video">
  <button type="button" class="jcs-video-modal-close" id="jcsVideoClose" aria-label="Close">&times;</button>
  <iframe id="jcsVideoIframe" title="Jeddah Real Estate Forum film" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
</div>

${footer}
<script defer src="${P}assets/gh-float-widgets.js?v=1"></script>
<script defer src="${P}assets/gh-jeddah-forum-cs.js?v=2"></script>
</body>
</html>`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const lang of ['ar', 'en']) {
  const name = lang === 'en' ? 'jeddah-real-estate-forum-en.html' : 'jeddah-real-estate-forum.html';
  fs.writeFileSync(path.join(OUT_DIR, name), buildPage(lang), 'utf8');
  console.log('  case study:', name);
}

// Sitemap entries
const smPath = path.join(ROOT, 'sitemap.xml');
if (fs.existsSync(smPath)) {
  let xml = fs.readFileSync(smPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  for (const suffix of ['', '-en']) {
    const loc = `${BASE}/case-studies/jeddah-real-estate-forum${suffix}.html`;
    if (!xml.includes(loc)) {
      xml = xml.replace(
        '</urlset>',
        `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.88</priority></url>\n</urlset>`
      );
    }
  }
  fs.writeFileSync(smPath, xml, 'utf8');
  console.log('  sitemap: case study URLs added');
}

console.log('Jeddah Forum case study built.');
