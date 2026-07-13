#!/usr/bin/env node
/**
 * ProjectLaunch™ flagship page — cloned from services/interactive layout
 * (hero / overview / process / portfolio / videos / FAQ / CTA).
 * AR + EN. Content = complete launch system; adds animation film section.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';
import { renderHeader, renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'solutions');
const BASE = 'https://3dgraphicshouse.com';
const DEPTH = 1;

const IMG = {
  hero: '../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
  heroW: '../assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
  overview: '../assets/news/makkah-charter-01.jpeg',
  card1: '../assets/news/makkah-charter-04.jpeg',
  card2: '../assets/news/makkah-charter-02.jpeg',
  card3: '../assets/news/makkah-charter-07.jpeg',
  animPoster1: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg',
  animPoster1W: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp',
  animPoster2: '../assets/projects/animation/architectural-visualisation.jpg',
  animPoster2W: '../assets/projects/animation/architectural-visualisation.webp',
  animPoster3: '../assets/projects/animation/real-estate-services.jpg',
  animPoster3W: '../assets/projects/animation/real-estate-services.webp',
  vidArch: '../assets/videos/3D-Architectural-visualisation.mp4',
  vidRe: '../assets/videos/GH-Real-estate-services.mp4',
  vidDemo: '../assets/videos/GH-demo-reel-2025.mp4',
};

const PAGE_CSS = `
  .ms-filled { font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:#FAFAF8; }
  ::-webkit-scrollbar-thumb { background:#C9A84C; }
  .reveal { transition:opacity .75s cubic-bezier(.4,0,.2,1),transform .75s cubic-bezier(.4,0,.2,1); }
  .reveal.visible { opacity:1 !important; transform:none !important; }
  .hero-enter { opacity:0; transform:translateY(18px); transition:opacity .8s cubic-bezier(.4,0,.2,1),transform .8s cubic-bezier(.4,0,.2,1); }
  .hero-enter.in { opacity:1; transform:none; }
  #back-top { transition:opacity .3s ease,transform .3s ease; opacity:0; pointer-events:none; transform:translateY(8px); }
  #back-top.visible { opacity:1; pointer-events:auto; transform:translateY(0); }
  #loader { position:fixed; inset:0; z-index:99999; background:#FAFAF8; display:flex; align-items:center; justify-content:center; flex-direction:column; transition:opacity .6s ease,visibility .6s ease; }
  #loader.out { opacity:0; visibility:hidden; }
  #loader-bar-track { width:180px; height:1px; background:rgba(201,168,76,.18); margin-top:20px; overflow:hidden; }
  #loader-bar { height:100%; width:0; background:#C9A84C; transition:width 1s cubic-bezier(.4,0,.2,1); }

  /* Hero: no full-bleed scrim — panel only under copy */
  .pl-hero .svc-hero-scrim {
    display: none !important;
  }
  .pl-hero .pl-hero-copy {
    position: relative;
    z-index: 2;
    max-width: 52rem;
    margin-inline: auto;
    padding: 28px 24px 32px;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .pl-hero h1 {
    color: #fff !important;
    text-shadow: 0 2px 20px rgba(0,0,0,.35);
  }
  .pl-hero .pl-hero-lead {
    color: rgba(255,255,255,.92) !important;
    opacity: 1 !important;
  }
  .pl-hero .pl-hero-eyebrow {
    color: #C9A84C !important;
  }
  .pl-hero .pl-btn-ghost {
    background: rgba(0,0,0,.25) !important;
    border-color: rgba(255,255,255,.55) !important;
    color: #fff !important;
  }
  .pl-hero .pl-btn-ghost:hover {
    background: rgba(201,168,76,.15) !important;
    border-color: rgba(201,168,76,.85) !important;
  }
`;

function copy(isEn) {
  if (isEn) {
    return {
      title: 'ProjectLaunch™ | Complete Real Estate Launch System | Graphics House',
      desc: 'Everything a development launch needs — architectural identity, CGI films, smart maquettes, interactive experiences, sales-gallery décor, photography and direction — one studio.',
      eyebrow: 'Flagship Solution',
      h1: 'ProjectLaunch™',
      heroLead:
        'From architectural identity to the sales hall that closes — visualization, cinema, maquettes, interactive tools, décor, photography and direction in one coherent system.',
      ctaPrimary: 'START YOUR PROJECT',
      ctaSecondary: 'VIEW PORTFOLIO',
      contact: '../contact-us-en.html',
      portfolio: '../portfolio-en.html',
      caseStudy: '../case-study-mwl-en.html',
      overviewTag: 'Flagship Solution',
      overviewTitle: 'The complete launch system',
      overviewLead:
        'ProjectLaunch™ gathers every capability required to open sales before concrete: identity, CGI, films, scale models, interactive experiences, gallery décor, and production — one visual language.',
      features: [
        'Architectural identity for the development',
        'Photoreal CGI and cinematic films',
        'Smart maquettes with lighting & digital layers',
        'Interactive experiences for unit selection',
        'Sales-gallery décor that stages every asset',
        'Photography, direction and on-site installation',
      ],
      processEyebrow: 'How we work',
      processTitle: 'Methodology',
      process: [
        'Identity, positioning and visual language',
        'CGI, films, maquettes and interactive tools',
        'Sales-hall décor and spatial staging',
        'Photography, direction, install and handover',
      ],
      portEyebrow: 'Work that proves the system',
      portTitle: 'Selected environments',
      portAll: 'FULL PORTFOLIO',
      cards: [
        { img: IMG.card1, title: 'Interactive exhibition environment', href: '../case-study-mwl-en.html' },
        { img: IMG.card2, title: 'Identity & touch experiences', href: '../case-study-mwl-en.html' },
        { img: IMG.card3, title: 'Sales hall & spatial staging', href: '../case-study-mwl-en.html' },
      ],
      ytEyebrow: 'Interactive & maquettes',
      ytTitle: 'Smart models and interactive shows',
      yt: [
        {
          id: 'e766WAUYgGQ',
          tag: 'i-MAQUETTE',
          title: 'Smart interactive maquette',
          lead: 'Architectural model fused with interactive display technology',
        },
        {
          id: 'SPz2Lh2H2FM',
          tag: 'SCALE MODEL',
          title: 'Architectural scale model',
          lead: 'Precision model with integrated LED lighting',
        },
      ],
      ytMore: 'ALL VIDEOS ON YOUTUBE',
      animEyebrow: 'Animation & CGI films',
      animTitle: 'Cinematic launch films',
      animLead: 'The missing piece — animation and CGI cinema that carry the same identity into investor days and campaigns.',
      anim: [
        {
          src: IMG.vidArch,
          poster: IMG.animPoster1,
          posterW: IMG.animPoster1W,
          tag: 'CGI FILM',
          title: 'Architectural visualization reel',
          lead: 'Photoreal sequences that sell the unbuilt',
        },
        {
          src: IMG.vidRe,
          poster: IMG.animPoster3,
          posterW: IMG.animPoster3W,
          tag: 'REAL ESTATE',
          title: 'Real-estate launch film',
          lead: 'Cinematic storytelling for development launches',
        },
        {
          src: IMG.vidDemo,
          poster: IMG.animPoster2,
          posterW: IMG.animPoster2W,
          tag: 'DEMO REEL',
          title: 'Graphics House demo reel 2025',
          lead: 'A cross-section of visualization and production craft',
        },
      ],
      faqEyebrow: 'FAQ',
      faqTitle: 'Answers to common questions',
      faq: [
        [
          'What does ProjectLaunch™ include?',
          'Architectural identity, CGI and films, smart maquettes, interactive experiences, sales-gallery décor, photography and creative direction — scoped as one system.',
        ],
        [
          'Can we start with only visualization or maquettes?',
          'Yes. We can phase delivery, but the flagship value is one coherent language across every surface.',
        ],
        [
          'Do you install on site?',
          'Yes — décor, screens, models and interactive systems are installed and handed over with training.',
        ],
      ],
      ctaTitle: 'Ready to launch the complete system?',
      ctaLead: 'Our team can scope ProjectLaunch™ and share a clear proposal within 48 hours.',
      ctaBtn: 'START YOUR PROJECT NOW',
      heroAlt: 'Integrated launch environment — Muslim World League',
      overviewAlt: 'Sales hall combining identity, models and interactive displays',
    };
  }
  return {
    title: 'ProjectLaunch™ | المنظومة الكاملة لإطلاق المشاريع العقارية | Graphics House',
    desc: 'كل ما يحتاجه إطلاق المشروع — هوية معمارية، أفلام CGI، مجسمات ذكية، عروض تفاعلية، ديكور صالة البيع، تصوير وإخراج — استوديو واحد.',
    eyebrow: 'الحل الرئيسي',
    h1: 'ProjectLaunch™',
    heroLead:
      'من الهوية المعمارية إلى صالة تُغلق الصفقة — تصور، سينما، مجسمات، تفاعلي، ديكور، تصوير وإخراج في منظومة بصرية واحدةحدة.',
    ctaPrimary: 'ابدأ مشروعك',
    ctaSecondary: 'استعرض أعمالنا',
    contact: '../contact-us.html',
    portfolio: '../portfolio.html',
    caseStudy: '../casestudy1.html',
    overviewTag: 'الحل الرئيسي',
    overviewTitle: 'المنظومة الكاملة للإطلاق',
    overviewLead:
      'ProjectLaunch™ يجمع كل ما يلزم لفتح المبيعات قبل الخرسانة: هوية، CGI، أفلام، مجسمات، تفاعلي، ديكور صالة البيع، وإنتاج — بلغة بصرية واحدة.',
    features: [
      'هوية معمارية للمشروع',
      'تصور فوتورياليستي وأفلام سينمائية',
      'مجسمات ذكية بإضاءة وطبقات رقمية',
      'عروض تفاعلية لاختيار الوحدات',
      'ديكور صالة البيع الذي يُخرج كل أصل',
      'تصوير وإخراج وتركيب في الموقع',
    ],
    processEyebrow: 'كيف نعمل',
    processTitle: 'المنهجية',
    process: [
      'الهوية والتموضع واللغة البصرية',
      'CGI والأفلام والمجسمات والأدوات التفاعلية',
      'ديكور صالة البيع والإخراج الفراغي',
      'التصوير والإخراج والتركيب والتسليم',
    ],
    portEyebrow: 'أعمال تُثبت المنظومة',
    portTitle: 'بيئات مختارة',
    portAll: 'كل الأعمال',
    cards: [
      { img: IMG.card1, title: 'بيئة معرض تفاعلية', href: '../casestudy1.html' },
      { img: IMG.card2, title: 'هوية وتجارب لمس', href: '../casestudy1.html' },
      { img: IMG.card3, title: 'صالة بيع وإخراج فراغي', href: '../casestudy1.html' },
    ],
    ytEyebrow: 'تفاعلي ومجسمات',
    ytTitle: 'مجسمات ذكية وعروض تفاعلية',
    yt: [
      {
        id: 'e766WAUYgGQ',
        tag: 'i-MAQUETTE',
        title: 'المجسم التفاعلي الذكي',
        lead: 'مجسم معماري مدمج مع تقنية العرض التفاعلي',
      },
      {
        id: 'SPz2Lh2H2FM',
        tag: 'SCALE MODEL',
        title: 'مجسم معماري',
        lead: 'مجسم معماري دقيق بإضاءة LED مدمجة',
      },
    ],
    ytMore: 'كل الفيديوهات على يوتيوب',
    animEyebrow: 'أفلام الأنيميشن والـ CGI',
    animTitle: 'أفلام إطلاق سينمائية',
    animLead: 'القطعة المكملة — أنيميشن وسينما CGI تحمل نفس الهوية إلى أيام المستثمرين والحملات.',
    anim: [
      {
        src: IMG.vidArch,
        poster: IMG.animPoster1,
        posterW: IMG.animPoster1W,
        tag: 'فيلم CGI',
        title: 'ريل التصور المعماري',
        lead: 'مشاهد فوتورياليستية تبيع ما لم يُبنَ بعد',
      },
      {
        src: IMG.vidRe,
        poster: IMG.animPoster3,
        posterW: IMG.animPoster3W,
        tag: 'عقاري',
        title: 'فيلم إطلاق عقاري',
        lead: 'سرد سينمائي لإطلاق المشاريع',
      },
      {
        src: IMG.vidDemo,
        poster: IMG.animPoster2,
        posterW: IMG.animPoster2W,
        tag: 'DEMO REEL',
        title: 'ريل جرافيكس هاوس 2025',
        lead: 'مقطع يعكس حرفة التصور والإنتاج',
      },
    ],
    faqEyebrow: 'الأسئلة الشائعة',
    faqTitle: 'أجوبة عن استفساراتكم',
    faq: [
      [
        'ماذا يشمل ProjectLaunch™؟',
        'هوية معمارية، CGI وأفلام، مجسمات ذكية، عروض تفاعلية، ديكور صالة البيع، تصوير وقيادة إبداعية — كنطاق واحد متماسك.',
      ],
      [
        'هل يمكن البدء بالتصور أو المجسمات فقط؟',
        'نعم، يمكن التنفيذ على مراحل، لكن قيمة الحل الرئيسي هي لغة واحدة عبر كل سطح.',
      ],
      [
        'هل تقومون بالتركيب في الموقع؟',
        'نعم — الديكور والشاشات والمجسمات والأنظمة التفاعلية تُركَّب وتُسلَّم مع التدريب.',
      ],
    ],
    ctaTitle: 'جاهز لإطلاق المنظومة الكاملة؟',
    ctaLead: 'فريقنا جاهز لتحديد نطاق ProjectLaunch™ وتقديم عرض واضح خلال ٤٨ ساعة.',
    ctaBtn: 'ابدأ مشروعك الآن',
    heroAlt: 'بيئة إطلاق متكاملة — رابطة العالم الإسلامي',
    overviewAlt: 'صالة تجمع الهوية والمجسمات والعروض التفاعلية',
  };
}

function pic(src, webp, alt, cls = 'w-full h-full object-cover') {
  if (webp) {
    return `<picture><source srcset="${webp}" type="image/webp"><img class="${cls}" src="${src}" alt="${alt}" loading="lazy"/></picture>`;
  }
  return `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy"/>`;
}

function build(isEn) {
  const t = copy(isEn);
  const file = isEn ? 'project-launch-en.html' : 'project-launch.html';
  const canonical = `${BASE}/solutions/${file}`;
  const arUrl = `${BASE}/solutions/project-launch.html`;
  const enUrl = `${BASE}/solutions/project-launch-en.html`;
  const header = renderHeader(DEPTH, isEn);
  const footer = renderFooter(DEPTH, isEn);
  const skip = isEn ? 'Skip to main content' : 'تخطي إلى المحتوى الرئيسي';

  const features = t.features
    .map(
      (f) =>
        `<div class="feat-row"><span class="material-symbols-outlined ms-filled">check_circle</span><div><p class="font-body-md text-secondary">${f}</p></div></div>`
    )
    .join('');

  const process = t.process
    .map(
      (p, i) => `<div class="reveal text-center" style="opacity:0;transform:translateY(24px);transition-delay:${(i * 0.12).toFixed(2)}s">
          <div class="w-12 h-12 border border-primary/40 flex items-center justify-center mx-auto mb-4 text-primary font-bold text-sm tracking-widest">${String(i + 1).padStart(2, '0')}</div>
          <p class="font-body-md text-secondary opacity-80 text-sm">${p}</p>
        </div>`
    )
    .join('');

  const cards = t.cards
    .map(
      (c, i) => `<div class="reveal group relative overflow-hidden border border-white/8 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1" style="opacity:0;transform:translateY(24px);transition-delay:${(0.05 + i * 0.07).toFixed(2)}s">
      <div class="aspect-[4/3] overflow-hidden"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${c.img}" alt="${c.title}" loading="lazy"/></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="absolute bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-400">
        <h3 class="font-headline-md text-white mb-1">${c.title}</h3>
        <a href="${c.href}" class="text-primary text-xs tracking-widest">Case Study →</a>
      </div>
    </div>`
    )
    .join('\n');

  const yt = t.yt
    .map(
      (v, i) => `<div class="reveal group relative overflow-hidden border border-white/8 hover:border-primary/40 transition-all duration-500" style="opacity:0;transform:translateY(24px);transition-delay:${(0.05 + i * 0.05).toFixed(2)}s">
      <div class="aspect-video overflow-hidden relative bg-black">
        <iframe
          class="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&playsinline=1&controls=0&modestbranding=1&rel=0&enablejsapi=1"
          title="${v.title}"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
      <div class="p-5 bg-surface-container">
        <span class="text-primary text-[9px] font-bold tracking-widest uppercase mb-2 block">${v.tag}</span>
        <h3 class="font-headline-md text-on-background mb-1">${v.title}</h3>
        <p class="text-secondary text-sm opacity-70">${v.lead}</p>
      </div>
    </div>`
    )
    .join('\n');

  const anim = t.anim
    .map(
      (v, i) => `<div class="reveal group relative overflow-hidden border border-white/8 hover:border-primary/40 transition-all duration-500" style="opacity:0;transform:translateY(24px);transition-delay:${(0.05 + i * 0.05).toFixed(2)}s">
      <div class="aspect-video overflow-hidden relative bg-black">
        <video class="w-full h-full object-cover" controls playsinline preload="metadata" poster="${v.poster}">
          <source src="${v.src}" type="video/mp4">
        </video>
      </div>
      <div class="p-5 bg-surface-container">
        <span class="text-primary text-[9px] font-bold tracking-widest uppercase mb-2 block">${v.tag}</span>
        <h3 class="font-headline-md text-on-background mb-1">${v.title}</h3>
        <p class="text-secondary text-sm opacity-70">${v.lead}</p>
      </div>
    </div>`
    )
    .join('\n');

  const faq = t.faq
    .map(
      ([q, a]) => `<div class="border-b border-white/5 py-6">
          <h4 class="font-headline-md text-on-background mb-3">${q}</h4>
          <p class="font-body-md text-secondary opacity-70 leading-relaxed">${a}</p>
        </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="../assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags('../')}
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${t.title}</title>
<meta name="description" content="${t.desc}"/>
<meta property="og:title" content="ProjectLaunch™ | Graphics House">
<meta property="og:description" content="${t.desc}">
<meta property="og:image" content="${BASE}/assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<style>${PAGE_CSS}</style>
<script defer src="../assets/site-header.js?v=14"></script>
<script defer src="../assets/gh-performance.js?v=2"></script>
<script defer src="../assets/lang-switch.js?v=2"></script>
<link rel="stylesheet" href="../assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="../assets/gh-site-enhancements.css?v=21">
<link rel="stylesheet" href="../assets/site-header.css?v=27">
<link rel="stylesheet" href="../assets/gh-legacy-service-theme.css?v=3">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'ProjectLaunch™',
    description: t.desc,
    url: canonical,
    brand: { '@type': 'Brand', name: 'Graphics House' },
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
<div id="loader" aria-hidden="true">
  <img src="../assets/logo-gold.png" alt="" width="120" height="40" style="height:40px;width:auto">
  <div id="loader-bar-track"><div id="loader-bar"></div></div>
</div>
<a class="gh-skip-link" href="#main-content">${skip}</a>
${header}
<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>

<section class="pl-hero relative h-screen flex items-center justify-center overflow-hidden">
  <div id="hero-bg" class="absolute inset-x-0 -top-[10%] h-[120%] z-0">
    ${pic(IMG.hero, IMG.heroW, t.heroAlt)}
    <div class="svc-hero-scrim absolute inset-0"></div>
  </div>
  <div class="relative z-10 text-center max-w-5xl px-6">
    <div class="pl-hero-copy">
      <span class="pl-hero-eyebrow hero-enter font-label-caps text-label-caps tracking-[0.3em] mb-6 block" style="transition-delay:0ms">${t.eyebrow}</span>
      <h1 class="hero-enter text-[52px] md:text-[82px] leading-tight mb-6" style="transition-delay:120ms">${t.h1}</h1>
      <p class="pl-hero-lead hero-enter font-body-lg max-w-2xl mx-auto mb-12" style="transition-delay:240ms">${t.heroLead}</p>
      <div class="hero-enter flex flex-wrap justify-center gap-4 md:gap-6" style="transition-delay:360ms">
        <a href="${t.contact}" class="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] shadow-[0_0_20px_rgba(201,168,76,0.3)]">${t.ctaPrimary}</a>
        <a href="${t.portfolio}" class="pl-btn-ghost border border-primary px-8 py-4 font-label-caps text-label-caps tracking-widest transition-all">${t.ctaSecondary}</a>
      </div>
    </div>
  </div>
</section>

<section class="py-[120px] px-8 md:px-12">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
    <div class="reveal w-full md:w-1/2" style="opacity:0;transform:translateY(24px)">
      <span class="svc-tag mb-8 block">${t.overviewTag}</span>
      <h2 class="font-headline-xl text-on-background mb-8">${t.overviewTitle}</h2>
      <p class="font-body-lg text-secondary mb-10 opacity-80 leading-relaxed">${t.overviewLead}</p>
      <div class="space-y-1">${features}</div>
      <div class="mt-10 flex gap-6">
        <a href="${t.contact}" class="bg-primary text-on-primary px-8 py-4 font-label-caps text-[11px] tracking-widest hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] transition-all">${t.ctaPrimary}</a>
      </div>
    </div>
    <div class="reveal w-full md:w-1/2 relative" style="opacity:0;transform:translateY(24px);transition-delay:.2s">
      <div class="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4 pointer-events-none"></div>
      <img class="relative z-10 w-full shadow-2xl" src="${IMG.overview}" alt="${t.overviewAlt}" loading="lazy"/>
    </div>
  </div>
</section>

<section class="py-[100px] bg-surface-container border-t border-white/5">
  <div class="px-8 md:px-12 max-w-container-max mx-auto">
    <div class="text-center mb-16 reveal" style="opacity:0;transform:translateY(24px)">
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.processEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${t.processTitle}</h2>
    </div>
    <div class="svc-process-grid grid grid-cols-2 md:grid-cols-4 gap-8 relative">${process}</div>
  </div>
</section>

<section class="py-[100px] px-8 md:px-12 max-w-container-max mx-auto">
  <div class="flex justify-between items-end mb-12 reveal" style="opacity:0;transform:translateY(24px)">
    <div>
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.portEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${t.portTitle}</h2>
    </div>
    <a href="${t.portfolio}" class="border-b border-primary text-primary pb-1 font-label-caps text-[11px] tracking-widest hover:text-white hover:border-white transition-colors hidden md:block">${t.portAll}</a>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${cards}</div>
</section>

<section class="py-[100px] px-8 md:px-12 max-w-container-max mx-auto border-t border-white/5">
  <div class="text-center mb-16 reveal" style="opacity:0;transform:translateY(24px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.ytEyebrow}</span>
    <h2 class="font-headline-xl text-on-background">${t.ytTitle}</h2>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${yt}</div>
  <div class="text-center mt-10 reveal" style="opacity:0;transform:translateY(24px)">
    <a href="https://www.youtube.com/@GraphicsHouse2" target="_blank" rel="noopener" class="border border-primary text-primary px-8 py-3 font-label-caps text-label-caps tracking-widest hover:bg-primary/10 transition-all inline-flex items-center gap-3">
      <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3.02 3.02 0 002.12 2.14C4.45 20.5 12 20.5 12 20.5s7.55 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
      ${t.ytMore}
    </a>
  </div>
</section>

<section class="py-[100px] px-8 md:px-12 max-w-container-max mx-auto border-t border-white/5 bg-surface-container">
  <div class="text-center mb-6 reveal" style="opacity:0;transform:translateY(24px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.animEyebrow}</span>
    <h2 class="font-headline-xl text-on-background mb-4">${t.animTitle}</h2>
    <p class="font-body-lg text-secondary opacity-70 max-w-2xl mx-auto">${t.animLead}</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">${anim}</div>
</section>

<section class="py-[100px] bg-surface-container-lowest border-t border-white/5">
  <div class="px-8 md:px-12 max-w-4xl mx-auto">
    <div class="text-center mb-16 reveal" style="opacity:0;transform:translateY(24px)">
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.faqEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${t.faqTitle}</h2>
    </div>
    <div class="reveal" style="opacity:0;transform:translateY(24px)">${faq}</div>
  </div>
</section>

<section class="py-24 text-center border-t border-white/5 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3"></div>
  <div class="relative z-10 max-w-2xl mx-auto px-8">
    <span class="material-symbols-outlined ms-filled text-primary text-4xl mb-6 block">rocket_launch</span>
    <h2 class="font-headline-xl text-on-background mb-6">${t.ctaTitle}</h2>
    <p class="font-body-lg text-secondary opacity-70 mb-10">${t.ctaLead}</p>
    <a href="${t.contact}" class="bg-primary text-on-primary px-12 py-5 font-label-caps text-label-caps tracking-[0.3em] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] transition-all inline-block">${t.ctaBtn}</a>
  </div>
</section>

${footer}
<button id="back-top" class="fixed bottom-8 ${isEn ? 'right-6' : 'left-6'} z-50 w-11 h-11 bg-surface-container-high border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" aria-label="Back to top"><span class="material-symbols-outlined text-xl">arrow_upward</span></button>
<script defer src="../assets/service-page.js?v=4"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(OUT, file), html, 'utf8');
  console.log('  wrote', file);
}

console.log('Building ProjectLaunch flagship (interactive layout)…');
build(false);
build(true);
console.log('Done.');
