/**
 * ProjectLaunch™ AR conversion landing page.
 * Writes solutions/project-launch.html — sales LP (not a service brochure).
 * Run: node scripts/build-project-launch-lp-ar.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'solutions', 'project-launch.html');
const BASE = 'https://3dgraphicshouse.com';
const PHONE = '+966502786513';
const PHONE_DISPLAY = '+966 50 278 6513';
const WA = 'https://wa.me/966502786513';
const CTA = 'احجز جلسة إطلاق مشروعك';
const FORM_CTA = 'احصل على تقييم جاهزية إطلاق مشروعك';

const css = `
  :root {
    --pl-gold: #C9A84C;
    --pl-ink: #0A0A0A;
    --pl-muted: #555;
    --pl-soft: #777;
    --pl-bg: #FAFAF8;
    --pl-surface: #F3F1EB;
    --pl-line: rgba(10,10,10,.08);
  }
  html { scroll-behavior: smooth; }
  body.pl-lp {
    margin: 0; background: var(--pl-bg); color: var(--pl-ink);
    font-family: 'Tajawal', 'IBM Plex Sans Arabic', sans-serif;
    overflow-x: hidden;
  }
  .pl-lp * { box-sizing: border-box; }
  .pl-wrap { width: min(1120px, calc(100% - 40px)); margin-inline: auto; }
  .pl-wrap-wide { width: min(1280px, calc(100% - 40px)); margin-inline: auto; }
  .pl-eyebrow {
    display: block; color: var(--pl-gold); font-size: 12px; font-weight: 700;
    letter-spacing: .18em; text-transform: uppercase; margin-bottom: 14px;
    direction: ltr; unicode-bidi: isolate; text-align: start;
  }
  .pl-h2 {
    font-size: clamp(28px, 4vw, 44px); font-weight: 800; line-height: 1.25;
    margin: 0 0 18px; letter-spacing: -0.02em;
  }
  .pl-lead { font-size: clamp(16px, 1.6vw, 19px); font-weight: 400; line-height: 1.75; color: var(--pl-muted); margin: 0; }
  .pl-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--pl-gold); color: var(--pl-ink); text-decoration: none;
    font-weight: 800; font-size: 14px; padding: 16px 28px; border: none; cursor: pointer;
    transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
  }
  .pl-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(201,168,76,.35); background: #d4b45a; }
  .pl-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px; color: #fff; text-decoration: none;
    border: 1px solid rgba(255,255,255,.45); padding: 12px 16px; font-weight: 700; font-size: 13px;
    background: rgba(0,0,0,.2); transition: border-color .2s, background .2s;
  }
  .pl-btn-ghost:hover { border-color: var(--pl-gold); background: rgba(201,168,76,.12); }
  .pl-section { padding: clamp(72px, 10vw, 120px) 0; }
  .pl-section-alt { background: var(--pl-surface); }
  .pl-reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
  .pl-reveal.is-in { opacity: 1; transform: none; }

  /* Landing header */
  .pl-lp-header {
    position: fixed; inset-inline: 0; top: 0; z-index: 1000;
    background: rgba(250,250,248,.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--pl-line);
  }
  .pl-lp-header-inner {
    width: min(1280px, calc(100% - 32px)); margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    min-height: 72px;
  }
  .pl-lp-logo img { height: 48px; width: auto; display: block; }
  .pl-lp-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
  .pl-lp-actions .pl-btn { padding: 12px 18px; font-size: 13px; }
  .pl-lp-icon {
    width: 42px; height: 42px; display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--pl-line); color: var(--pl-ink); text-decoration: none; background: #fff;
  }
  .pl-lp-icon:hover { border-color: var(--pl-gold); color: var(--pl-gold); }
  @media (max-width: 720px) {
    .pl-lp-actions .pl-btn-label { display: none; }
    .pl-lp-actions .pl-btn { padding: 12px 14px; }
  }

  /* Hero */
  .pl-hero {
    position: relative; min-height: 100vh; min-height: 100svh;
    display: flex; align-items: flex-end; justify-content: center;
    padding: 120px 0 72px; color: #fff; overflow: hidden;
  }
  .pl-hero-media, .pl-hero-media video, .pl-hero-media img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  }
  .pl-hero-scrim {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.78) 100%);
  }
  .pl-hero-copy { position: relative; z-index: 2; width: min(820px, calc(100% - 40px)); padding-bottom: 8px; }
  .pl-hero-copy .pl-eyebrow { color: var(--pl-gold); }
  .pl-hero h1 {
    font-size: clamp(32px, 5.2vw, 56px); font-weight: 800; line-height: 1.2;
    margin: 0 0 20px; text-shadow: 0 2px 24px rgba(0,0,0,.35);
  }
  .pl-hero-lead {
    font-size: clamp(17px, 2vw, 22px); font-weight: 400; line-height: 1.7;
    color: rgba(255,255,255,.92); margin: 0 0 28px; max-width: 36em;
    white-space: pre-line;
  }

  /* Problem / fail / etc */
  .pl-grid-2 {
    display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(28px, 5vw, 64px); align-items: center;
  }
  @media (max-width: 900px) { .pl-grid-2 { grid-template-columns: 1fr; } }
  .pl-media-frame {
    overflow: hidden; background: #111; aspect-ratio: 4/3;
  }
  .pl-media-frame img, .pl-media-frame video { width: 100%; height: 100%; object-fit: cover; display: block; }

  .pl-pain-list { list-style: none; padding: 0; margin: 28px 0 0; display: grid; gap: 14px; }
  .pl-pain-list li {
    padding: 16px 18px; background: #fff; border: 1px solid var(--pl-line);
    font-size: 16px; line-height: 1.6; color: var(--pl-ink);
  }
  .pl-punch {
    margin-top: 28px; font-size: clamp(20px, 2.4vw, 28px); font-weight: 800; line-height: 1.4;
    color: var(--pl-ink);
  }

  .pl-trust-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 36px;
  }
  @media (max-width: 900px) { .pl-trust-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 520px) { .pl-trust-grid { grid-template-columns: 1fr; } }
  .pl-trust-card {
    background: #fff; border: 1px solid var(--pl-line); padding: 24px 22px; min-height: 160px;
  }
  .pl-trust-card h3 { margin: 0 0 10px; font-size: 18px; font-weight: 800; }
  .pl-trust-card p { margin: 0; color: var(--pl-muted); line-height: 1.65; font-size: 15px; }

  .pl-product-box {
    background: var(--pl-ink); color: #fff; padding: clamp(40px, 6vw, 64px);
  }
  .pl-product-box .pl-eyebrow { color: var(--pl-gold); }
  .pl-product-box .pl-h2 { color: #fff; }
  .pl-product-box .pl-lead { color: rgba(255,255,255,.78); }

  .pl-day-list { list-style: none; padding: 0; margin: 32px 0 0; display: grid; gap: 12px; }
  .pl-day-list li {
    display: flex; gap: 14px; align-items: flex-start;
    padding: 18px 20px; background: #fff; border: 1px solid var(--pl-line);
    font-size: 17px; font-weight: 600; line-height: 1.5;
  }
  .pl-day-list .ck { color: var(--pl-gold); flex-shrink: 0; margin-top: 2px; }

  .pl-timeline { margin-top: 36px; display: grid; gap: 0; max-width: 640px; }
  .pl-tl-step { display: grid; grid-template-columns: 28px 1fr; gap: 16px; }
  .pl-tl-rail { display: flex; flex-direction: column; align-items: center; }
  .pl-tl-dot {
    width: 14px; height: 14px; border-radius: 50%; background: var(--pl-gold);
    box-shadow: 0 0 0 4px rgba(201,168,76,.18); margin-top: 6px;
  }
  .pl-tl-line { flex: 1; width: 1px; background: rgba(201,168,76,.35); min-height: 28px; }
  .pl-tl-body { padding-bottom: 28px; }
  .pl-tl-body h3 { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
  .pl-tl-body p { margin: 0; color: var(--pl-muted); line-height: 1.65; font-size: 15px; }

  .pl-story {
    background: #fff; border: 1px solid var(--pl-line); padding: clamp(28px, 4vw, 48px);
  }
  .pl-story-meta { color: var(--pl-gold); font-size: 12px; font-weight: 800; letter-spacing: .14em; margin-bottom: 12px; }
  .pl-story h3 { font-size: clamp(22px, 3vw, 32px); margin: 0 0 20px; line-height: 1.35; font-weight: 800; }
  .pl-story-flow { display: grid; gap: 18px; }
  .pl-story-flow strong { display: block; color: var(--pl-gold); font-size: 13px; margin-bottom: 4px; letter-spacing: .06em; }
  .pl-story-flow p { margin: 0; color: var(--pl-muted); line-height: 1.7; }
  .pl-strip {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 28px;
  }
  @media (max-width: 800px) { .pl-strip { grid-template-columns: 1fr; } }
  .pl-strip-item {
    position: relative; overflow: hidden; aspect-ratio: 16/10; background: #111;
  }
  .pl-strip-item img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: .88; }
  .pl-strip-cap {
    position: absolute; inset-inline: 0; bottom: 0; padding: 14px 14px 12px;
    background: linear-gradient(transparent, rgba(0,0,0,.75)); color: #fff; font-size: 13px; font-weight: 700;
  }

  .pl-fit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
  @media (max-width: 800px) { .pl-fit-grid { grid-template-columns: 1fr; } }
  .pl-fit {
    padding: 28px 24px; border: 1px solid var(--pl-line); background: #fff;
  }
  .pl-fit h3 { margin: 0 0 16px; font-size: 20px; font-weight: 800; }
  .pl-fit ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
  .pl-fit li { line-height: 1.55; color: var(--pl-muted); padding-inline-start: 22px; position: relative; }
  .pl-fit-yes li::before { content: '✓'; position: absolute; inset-inline-start: 0; color: #2D7D46; font-weight: 800; }
  .pl-fit-no li::before { content: '×'; position: absolute; inset-inline-start: 0; color: #A33; font-weight: 800; }

  .pl-faq { display: grid; gap: 10px; margin-top: 28px; }
  .pl-faq details {
    background: #fff; border: 1px solid var(--pl-line); padding: 18px 20px;
  }
  .pl-faq summary {
    cursor: pointer; font-weight: 800; font-size: 16px; line-height: 1.45; list-style: none;
  }
  .pl-faq summary::-webkit-details-marker { display: none; }
  .pl-faq details[open] summary { color: var(--pl-ink); margin-bottom: 10px; }
  .pl-faq p { margin: 0; color: var(--pl-muted); line-height: 1.7; font-size: 15px; }

  .pl-form-section { background: var(--pl-ink); color: #fff; }
  .pl-form-section .pl-h2 { color: #fff; }
  .pl-form-section .pl-lead { color: rgba(255,255,255,.75); }
  .pl-form {
    margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
    padding: clamp(22px, 3vw, 32px);
  }
  @media (max-width: 700px) { .pl-form { grid-template-columns: 1fr; } }
  .pl-form label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; color: rgba(255,255,255,.7); }
  .pl-form input, .pl-form select {
    width: 100%; padding: 14px 14px; border: 1px solid rgba(255,255,255,.18);
    background: rgba(0,0,0,.35); color: #fff; font-family: inherit; font-size: 15px;
  }
  .pl-form input:focus, .pl-form select:focus { outline: 1px solid var(--pl-gold); border-color: var(--pl-gold); }
  .pl-form .pl-span-2 { grid-column: 1 / -1; }
  .pl-form .pl-btn { width: 100%; padding: 18px; font-size: 15px; }
  .pl-form-note { margin: 14px 0 0; font-size: 13px; color: rgba(255,255,255,.55); line-height: 1.6; }
  .pl-form-feedback {
    display: none; grid-column: 1 / -1; padding: 14px 16px; font-size: 14px; line-height: 1.7;
  }
  .pl-form-feedback.is-visible { display: block; }
  .pl-form-feedback.is-success { background: rgba(45,125,70,.2); border: 1px solid rgba(45,125,70,.45); color: #c8f0d2; }
  .pl-form-feedback.is-error { background: rgba(180,40,40,.18); border: 1px solid rgba(180,40,40,.4); color: #ffd0d0; }
  .pl-form-feedback.is-pending { background: rgba(201,168,76,.12); border: 1px solid rgba(201,168,76,.35); color: #f0e2b0; }

  .pl-lp-footer {
    padding: 28px 0; border-top: 1px solid var(--pl-line); background: var(--pl-bg);
  }
  .pl-lp-footer-inner {
    width: min(1120px, calc(100% - 40px)); margin: 0 auto;
    display: flex; flex-wrap: wrap; gap: 12px 24px; justify-content: space-between; align-items: center;
    color: var(--pl-soft); font-size: 13px;
  }
  .pl-lp-footer a { color: var(--pl-ink); text-decoration: none; font-weight: 700; }
  .pl-lp-footer a:hover { color: var(--pl-gold); }

  .pl-cta-row { margin-top: 28px; }
`;

function btn(href = '#lead-form', label = CTA, extraClass = '') {
  return `<a class="pl-btn ${extraClass}" href="${href}">${label}</a>`;
}

const html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="rtl" lang="ar">
<head>
<script src="../assets/gh-forms-config.js?v=2"></script>
<script src="../assets/quote-form-config.js"></script>
${analyticsHeadTags('../')}
<link rel="canonical" href="${BASE}/solutions/project-launch.html">
<link rel="alternate" hreflang="en" href="${BASE}/solutions/project-launch-en.html">
<link rel="alternate" hreflang="ar" href="${BASE}/solutions/project-launch.html">
<link rel="alternate" hreflang="x-default" href="${BASE}/solutions/project-launch-en.html">
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ProjectLaunch™ | منظومة إطلاق المشاريع العقارية | Graphics House</title>
<meta name="description" content="تخيّل أن يرى المستثمر مشروعك قبل أن يُبنى — وأن يفهمه العميل في دقائق داخل صالة البيع. ProjectLaunch™ منظومة إطلاق متكاملة من Graphics House."/>
<meta property="og:title" content="ProjectLaunch™ | Graphics House">
<meta property="og:description" content="منظومة إطلاق تجعل مشروعك جاهزًا للسوق: إقناع المستثمر، تجربة البيع، وحضور قوي يوم الإطلاق.">
<meta property="og:image" content="${BASE}/assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../assets/gh-site-enhancements.css?v=21">
<link rel="stylesheet" href="../assets/gh-float-widgets.css?v=5">
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'ProjectLaunch™',
  description:
    'منظومة متكاملة لإطلاق المشاريع العقارية — من إقناع المستثمر إلى تجربة صالة البيع.',
  url: `${BASE}/solutions/project-launch.html`,
  brand: { '@type': 'Brand', name: 'Graphics House' },
  provider: {
    '@type': 'Organization',
    name: 'Graphics House',
    url: BASE,
    telephone: PHONE,
  },
  areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
})}</script>
</head>
<body class="pl-lp">
<a class="gh-skip-link" href="#main-content">تخطي إلى المحتوى الرئيسي</a>

<header class="pl-lp-header" id="pl-lp-header">
  <div class="pl-lp-header-inner">
    <a class="pl-lp-logo" href="../index-ar.html" aria-label="Graphics House">
      <img src="../assets/logo-gold.png" alt="Graphics House" width="140" height="48">
    </a>
    <div class="pl-lp-actions">
      <a class="pl-lp-icon" href="tel:${PHONE}" aria-label="اتصال" title="${PHONE_DISPLAY}">
        <span class="material-symbols-outlined" style="font-size:20px">call</span>
      </a>
      <a class="pl-lp-icon" href="${WA}" target="_blank" rel="noopener" aria-label="واتساب" title="واتساب">
        <span class="material-symbols-outlined" style="font-size:20px">chat</span>
      </a>
      <a class="pl-btn" href="#lead-form"><span class="pl-btn-label">${CTA}</span><span class="material-symbols-outlined" style="font-size:18px">arrow_downward</span></a>
    </div>
  </div>
</header>

<main id="main-content">

  <!-- 01 Hero — H15 -->
  <section class="pl-hero" id="hero" aria-label="ProjectLaunch">
    <div class="pl-hero-media" aria-hidden="true">
      <video class="gh-autoplay" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg">
        <source src="../assets/videos/GH-Real-estate-services.mp4" type="video/mp4">
      </video>
    </div>
    <div class="pl-hero-scrim" aria-hidden="true"></div>
    <div class="pl-hero-copy pl-reveal">
      <span class="pl-eyebrow">ProjectLaunch™</span>
      <h1>تخيّل أن يرى المستثمر مشروعك… قبل أن يُبنى.</h1>
      <p class="pl-hero-lead">وتخيّل أن يدخل العميل صالة البيع… فيفهم المشروع خلال دقائق.

هذه ليست أحلامًا…
بل نتيجة منظومة إطلاق احترافية.</p>
      ${btn()}
    </div>
  </section>

  <!-- 02 المشكلة -->
  <section class="pl-section" id="problem">
    <div class="pl-wrap pl-grid-2">
      <div class="pl-reveal">
        <span class="pl-eyebrow">المشكلة</span>
        <h2 class="pl-h2">المخططات جاهزة. الرخص تمضي. والبيع ما زال بطيئًا.</h2>
        <p class="pl-lead">كثير من المشاريع تصل لمرحلة الإطلاق وهي قوية على الورق… ثم تتعثر في إقناع المستثمر أو العميل لأنها تُقدَّم كقطع منفصلة: رندر هنا، فيلم هناك، مجسم في زاوية، وصالة بيع بلا قصة.</p>
        <p class="pl-lead" style="margin-top:16px">النتيجة ليست «نقص إبداع». النتيجة تأخير في الإغلاق، وضعف في الثقة، وفرص تُترك على الطاولة.</p>
        <div class="pl-cta-row">${btn()}</div>
      </div>
      <div class="pl-media-frame pl-reveal">
        <img src="../assets/news/makkah-charter-07.jpeg" alt="بيئة عرض وإطلاق مشروع" loading="lazy" width="800" height="600">
      </div>
    </div>
  </section>

  <!-- 03 لماذا لا تحقق بعض المشاريع تأثيرًا قويًا -->
  <section class="pl-section pl-section-alt" id="why-weak-launch">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px">
        <span class="pl-eyebrow">قبل الحل</span>
        <h2 class="pl-h2">لماذا لا تحقق بعض المشاريع تأثيرًا قويًا عند الإطلاق؟</h2>
        <p class="pl-lead">الإطلاق يضعف غالبًا قبل أن يبدأ البيع — في طريقة تقديم المشروع للسوق.</p>
      </div>
      <ul class="pl-pain-list pl-reveal">
        <li><strong>تعدد الموردين:</strong> كل جهة تتكلم بلغة بصرية مختلفة عن الأخرى.</li>
        <li><strong>غياب لغة بصرية موحّدة:</strong> المشروع يبدو مجموعة أعمال… لا منتجًا جاهزًا.</li>
        <li><strong>ضعف أدوات البيع:</strong> لا مسار واضح من الانطباع الأول إلى قرار الشراء.</li>
        <li><strong>غياب تجربة المستثمر:</strong> العرض يشرح المواصفات… ولا يبني الثقة.</li>
      </ul>
      <p class="pl-punch pl-reveal">المشكلة ليست في المشروع…<br>بل في طريقة تقديمه للسوق.</p>
      <div class="pl-cta-row pl-reveal">${btn()}</div>
    </div>
  </section>

  <!-- 04 لماذا يثق المطورون -->
  <section class="pl-section" id="why-gh">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px">
        <span class="pl-eyebrow">الثقة</span>
        <h2 class="pl-h2">لماذا يثق المطورون بـ Graphics House؟</h2>
        <p class="pl-lead">أربع أسباب فقط — بلا كلام إنشائي.</p>
      </div>
      <div class="pl-trust-grid">
        <article class="pl-trust-card pl-reveal">
          <h3>خبرة طويلة في الإطلاق</h3>
          <p>نعمل مع مطورين ومستثمرين ومقاولين على مشاريع تحتاج إقناعًا قبل الخرسانة.</p>
        </article>
        <article class="pl-trust-card pl-reveal">
          <h3>مشاريع منفذة تثبت المنهجية</h3>
          <p>بيئات بيع، مجسمات ذكية، أفلام إطلاق، وصالات عرض — كمنظومات مكتملة لا تجارب منفصلة.</p>
        </article>
        <article class="pl-trust-card pl-reveal">
          <h3>فريق متعدد التخصصات</h3>
          <p>هوية، تصور، إنتاج، مجسمات، تفاعلي، وتركيب في الموقع — تحت سقف واحد.</p>
        </article>
        <article class="pl-trust-card pl-reveal">
          <h3>منظومة متكاملة</h3>
          <p>لغة واحدة من أول إطار إلى آخر شاشة في صالة البيع — لتقليل إعادة العمل وتسريع الإطلاق.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- 05 تقديم المنتج -->
  <section class="pl-section pl-section-alt" id="product">
    <div class="pl-wrap">
      <div class="pl-product-box pl-reveal">
        <span class="pl-eyebrow">المنهجية</span>
        <h2 class="pl-h2">ProjectLaunch™ — منظومة إطلاق تجعل مشروعك جاهزًا للسوق.</h2>
        <p class="pl-lead">ليست قائمة خدمات. ليست «رندر + أنيميشن + موقع».</p>
        <p class="pl-lead" style="margin-top:14px">هي منهجية متكاملة تحوّل مشروعك إلى قصة قابلة للبيع: هوية واضحة، أصول بصرية تُقنع، وأدوات إغلاق داخل بيئة البيع — بلغة واحدة.</p>
        <p class="pl-lead" style="margin-top:14px">الهدف بسيط: أن يخرج زائر جلسة الإطلاق وهو يعرف ماذا يحتاج — وأن يخرج عميلك من صالة البيع وهو أقرب للقرار.</p>
        <div class="pl-cta-row">${btn()}</div>
      </div>
    </div>
  </section>

  <!-- 06 يوم الإطلاق -->
  <section class="pl-section" id="launch-day">
    <div class="pl-wrap pl-grid-2">
      <div class="pl-reveal">
        <span class="pl-eyebrow">ماذا سيكون لديك</span>
        <h2 class="pl-h2">ماذا سيكون لديك يوم الإطلاق؟</h2>
        <p class="pl-lead">تخيّل صباح الإطلاق… وكل ما يحتاجه السوق جاهز في مكانه.</p>
        <ul class="pl-day-list">
          <li><span class="ck material-symbols-outlined">check_circle</span> هوية بصرية متكاملة للمشروع</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> فيلم إطلاق احترافي</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> رندرات عالية الجودة</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> مجسم معماري (ذكي عند الحاجة)</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> أدوات عرض للمستثمرين</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> تجربة تفاعلية للمبيعات</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> مواد تسويقية جاهزة للاستخدام</li>
        </ul>
        <div class="pl-cta-row">${btn()}</div>
      </div>
      <div class="pl-reveal">
        <div class="pl-media-frame" style="margin-bottom:14px">
          <video class="gh-autoplay" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="../assets/projects/animation/architectural-visualisation.jpg">
            <source src="../assets/videos/3D-Architectural-visualisation.mp4" type="video/mp4">
          </video>
        </div>
        <div class="pl-media-frame" style="aspect-ratio:16/10">
          <picture>
            <source srcset="../assets/projects/maquettes/anan-eskan-maquette-01.webp" type="image/webp">
            <img src="../assets/projects/maquettes/anan-eskan-maquette-01.jpeg?v=2" alt="مجسم معماري لمشروع عقاري" loading="lazy" width="800" height="500">
          </picture>
        </div>
      </div>
    </div>
  </section>

  <!-- 07 بعد التوقيع -->
  <section class="pl-section pl-section-alt" id="after-signing">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px">
        <span class="pl-eyebrow">التنفيذ</span>
        <h2 class="pl-h2">ماذا يحدث بعد توقيع الاتفاقية؟</h2>
        <p class="pl-lead">مسار واضح يزيل الغموض — من أول يوم حتى الإطلاق.</p>
      </div>
      <div class="pl-timeline pl-reveal">
        <div class="pl-tl-step">
          <div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div>
          <div class="pl-tl-body"><h3>اليوم الأول</h3><p>جلسة قصيرة لفهم المشروع، الجمهور، ومرحلة الإطلاق.</p></div>
        </div>
        <div class="pl-tl-step">
          <div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div>
          <div class="pl-tl-body"><h3>خلال أسبوع</h3><p>تحليل فجوات الجاهزية ورسم نطاق المنظومة بلغة واحدة.</p></div>
        </div>
        <div class="pl-tl-step">
          <div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div>
          <div class="pl-tl-body"><h3>مرحلة الإنتاج</h3><p>تنفيذ الأصول والتجارب وبيئة البيع بتنسيق واحد.</p></div>
        </div>
        <div class="pl-tl-step">
          <div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div>
          <div class="pl-tl-body"><h3>المراجعة</h3><p>ضبط الجودة مع فريقك حتى تصبح الرسالة جاهزة للسوق.</p></div>
        </div>
        <div class="pl-tl-step">
          <div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div>
          <div class="pl-tl-body"><h3>التسليم</h3><p>تركيب، ضبط، وتدريب الفريق على استخدام المنظومة في الموقع.</p></div>
        </div>
        <div class="pl-tl-step">
          <div class="pl-tl-rail"><span class="pl-tl-dot"></span></div>
          <div class="pl-tl-body"><h3>الإطلاق</h3><p>مشروعك يُقدَّم للسوق كمنتج مكتمل — لا كمجموعة ملفات.</p></div>
        </div>
      </div>
      <div class="pl-cta-row pl-reveal">${btn()}</div>
    </div>
  </section>

  <!-- 08 قصص نجاح -->
  <section class="pl-section" id="stories">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px;margin-bottom:28px">
        <span class="pl-eyebrow">قصص النجاح</span>
        <h2 class="pl-h2">حين تصبح المنهجية مرئية في السوق</h2>
        <p class="pl-lead">ليست معرض صور. هذه قصص تُظهر أن الإطلاق الناجح يتكرر.</p>
      </div>

      <article class="pl-story pl-reveal">
        <div class="pl-story-meta">قصة رئيسية · الرياض</div>
        <h3>عندما أراد مطوّر عنان إسكان تقديم مشروعه السكني… كان يحتاج أكثر من صور جميلة.</h3>
        <div class="pl-story-flow">
          <div>
            <strong>التحدي</strong>
            <p>إظهار مجمع سكني بطريقة تُقنع قبل اكتمال التنفيذ — بلغة بصرية تبني الثقة لدى العملاء وصنّاع القرار.</p>
          </div>
          <div>
            <strong>ما قررناه معًا</strong>
            <p>ألا يكون العرض «ملفات متفرقة»، بل منظومة إظهار متماسكة: تصور سينمائي + مجسم يرسّخ الحضور في الغرفة.</p>
          </div>
          <div>
            <strong>ما قمنا به</strong>
            <p>بنينا أصول إطلاق مترابطة: مشاهد معمارية عالية الجودة ومجسمًا يعكس روح المشروع — ليُفهم بسرعة ويُناقش بثقة.</p>
          </div>
          <div>
            <strong>الأثر</strong>
            <p>أصبح المشروع يُقدَّم كمنتج واضح للسوق: أسهل في الشرح، أقوى في الانطباع، وأقرب لقرار الشراء أو الشراكة.</p>
          </div>
        </div>
        <div class="pl-media-frame" style="margin-top:24px;aspect-ratio:21/9">
          <img src="../assets/projects/rendering/Anan-Escan-Co.01.jpeg" alt="تصور معماري — عنان إسكان" loading="lazy" width="1200" height="514">
        </div>
      </article>

      <div class="pl-strip pl-reveal" aria-label="مشاريع أخرى تثبت المنهجية">
        <div class="pl-strip-item">
          <img src="../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg" alt="بيئة عرض تفاعلية" loading="lazy">
          <div class="pl-strip-cap">بيئة إطلاق وتجربة عرض مكتملة</div>
        </div>
        <div class="pl-strip-item">
          <img src="../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg" alt="مشروع الأولى النخيل" loading="lazy">
          <div class="pl-strip-cap">إظهار عقاري يبيع ما لم يُبنَ بعد</div>
        </div>
        <div class="pl-strip-item">
          <img src="../assets/projects/rendering/kuday-makkah1.jpeg" alt="مشروع قدّي مكة" loading="lazy">
          <div class="pl-strip-cap">حضور بصري يرفع ثقة الإطلاق</div>
        </div>
      </div>
      <div class="pl-cta-row pl-reveal" style="margin-top:28px">${btn()}</div>
    </div>
  </section>

  <!-- 09 FAQ -->
  <section class="pl-section pl-section-alt" id="faq">
    <div class="pl-wrap" style="max-width:800px">
      <div class="pl-reveal">
        <span class="pl-eyebrow">أسئلة شائعة</span>
        <h2 class="pl-h2">أسئلة يطرحها صنّاع القرار قبل الحجز</h2>
      </div>
      <div class="pl-faq pl-reveal">
        <details open>
          <summary>لدينا وكالة تسويق. هل نحتاجكم؟</summary>
          <p>غالبًا نعم. الوكالة تحرّك الرسالة والقنوات. ProjectLaunch™ يجهّز «منتج الإطلاق» نفسه: اللغة البصرية، أصول الإقناع، وتجربة البيع. كثير من الحملات تضعف لأن المنتج البصري غير جاهز أصلًا.</p>
        </details>
        <details>
          <summary>هل يجب تنفيذ جميع عناصر ProjectLaunch™ دفعة واحدة؟</summary>
          <p>ليس بالضرورة. نساعدك في تحديد الأولويات حسب مرحلة مشروعك وميزانيتك، مع الحفاظ على وجود خطة متكاملة للإطلاق.</p>
        </details>
        <details>
          <summary>هل يمكن تنفيذ جزء من المنظومة فقط؟</summary>
          <p>نعم يمكن البدء بنطاق مرحلي. القيمة الحقيقية تظهر عندما تبقى اللغة واحدة عبر كل مرحلة — حتى لو نُفّذت على دفعات.</p>
        </details>
        <details>
          <summary>هل يمكن البدء بالرندرات فقط ثم استكمال بقية المراحل؟</summary>
          <p>نعم. نبدأ بما يفتح البيع مبكرًا، ثم نكمّل المجسمات، التفاعلي، وبيئة الصالة وفق جاهزية المشروع والميزانية.</p>
        </details>
        <details>
          <summary>كم تستغرق جلسة التقييم؟</summary>
          <p>جلسة قصيرة ومركّزة: نفهم المشروع، نحدد فجوات الجاهزية، ونقترح نطاقًا واضحًا للخطوة التالية.</p>
        </details>
        <details>
          <summary>هل تعملون خارج الرياض؟</summary>
          <p>نعم — نخدم مشاريع في مدن المملكة والخليج، مع إنتاج وتركيب حسب نطاق كل مشروع.</p>
        </details>
      </div>
    </div>
  </section>

  <!-- 09b هل يناسبك -->
  <section class="pl-section" id="fit">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px">
        <span class="pl-eyebrow">تأهيل سريع</span>
        <h2 class="pl-h2">هل ProjectLaunch™ مناسب لمشروعك؟</h2>
        <p class="pl-lead">نفضّل العميل المناسب على البيع للجميع — لأن الإطلاق الناجح يبدأ بصراحة.</p>
      </div>
      <div class="pl-fit-grid">
        <div class="pl-fit pl-fit-yes pl-reveal">
          <h3>يناسبك إذا</h3>
          <ul>
            <li>لديك مشروع جديد</li>
            <li>تستعد للإطلاق</li>
            <li>تبحث عن مستثمر أو شريك</li>
            <li>تريد تجهيز مركز / صالة البيع</li>
            <li>تريد رفع جودة تقديم المشروع للسوق</li>
          </ul>
        </div>
        <div class="pl-fit pl-fit-no pl-reveal">
          <h3>قد لا يناسبك إذا</h3>
          <ul>
            <li>المشروع أُطلق بالكامل وانتهت حاجته لمنظومة إطلاق</li>
            <li>تبحث عن خدمة Render فقط بدون رؤية إطلاق</li>
            <li>تريد تنفيذًا جزئيًا دون أي خطة متكاملة</li>
          </ul>
        </div>
      </div>
      <div class="pl-cta-row pl-reveal">${btn()}</div>
    </div>
  </section>

  <!-- 10 النموذج -->
  <section class="pl-section pl-form-section" id="lead-form">
    <div class="pl-wrap" style="max-width:720px">
      <div class="pl-reveal">
        <span class="pl-eyebrow">الخطوة التالية</span>
        <h2 class="pl-h2">هل مشروعك جاهز فعلاً للإطلاق؟</h2>
        <p class="pl-lead">دعنا نخبرك خلال جلسة قصيرة.</p>
      </div>
      <form class="pl-form pl-reveal" id="plLeadForm" novalidate>
        <div>
          <label for="pl-name">الاسم</label>
          <input id="pl-name" name="name" type="text" autocomplete="name" required placeholder="الاسم الكامل">
        </div>
        <div>
          <label for="pl-company">الشركة</label>
          <input id="pl-company" name="company" type="text" autocomplete="organization" required placeholder="اسم الشركة / الجهة">
        </div>
        <div>
          <label for="pl-phone">رقم الجوال</label>
          <input id="pl-phone" name="phone" type="tel" autocomplete="tel" required placeholder="05XXXXXXXX" dir="ltr">
        </div>
        <div>
          <label for="pl-email">البريد الإلكتروني</label>
          <input id="pl-email" name="email" type="email" autocomplete="email" required placeholder="name@company.com" dir="ltr">
        </div>
        <div>
          <label for="pl-type">نوع المشروع</label>
          <select id="pl-type" name="project_type" required>
            <option value="">اختر…</option>
            <option>سكني</option>
            <option>تجاري</option>
            <option>مختلط</option>
            <option>ضيافة / فندقي</option>
            <option>مؤسسي / معرض</option>
            <option>أخرى</option>
          </select>
        </div>
        <div>
          <label for="pl-city">مدينة المشروع</label>
          <input id="pl-city" name="city" type="text" required placeholder="الرياض، جدة، …">
        </div>
        <div class="pl-span-2 pl-form-feedback" id="plFormFeedback" aria-live="polite"></div>
        <div class="pl-span-2">
          <button class="pl-btn" type="submit" id="plSubmitBtn">${FORM_CTA}</button>
          <p class="pl-form-note">رد واضح بعد استلام طلبك — بدون التزام شراء في الجلسة الأولى.</p>
        </div>
      </form>
    </div>
  </section>

</main>

<footer class="pl-lp-footer">
  <div class="pl-lp-footer-inner">
    <span>© Graphics House · ProjectLaunch™</span>
    <span>
      <a href="tel:${PHONE}">${PHONE_DISPLAY}</a>
      ·
      <a href="${WA}" target="_blank" rel="noopener">واتساب</a>
      ·
      <a href="../solutions/project-launch-en.html">English</a>
    </span>
  </div>
</footer>

<script defer src="../assets/gh-performance.js?v=3"></script>
<script defer src="../assets/pl-lead-form.js?v=1"></script>
<script>
(function () {
  var nodes = document.querySelectorAll('.pl-reveal');
  if (!('IntersectionObserver' in window)) {
    nodes.forEach(function (n) { n.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  nodes.forEach(function (n) { io.observe(n); });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Wrote solutions/project-launch.html (AR conversion LP)');
