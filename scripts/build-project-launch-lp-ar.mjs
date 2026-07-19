#!/usr/bin/env node
/**
 * ProjectLaunch™ ads landing pages (nav-free, noindex).
 * Builds:
 *   solutions/project-launch-ads.html     ← from project-launch.html (AR)
 *   solutions/project-launch-ads-en.html  ← from project-launch-en.html (EN)
 *
 * Permanent site pages are never overwritten.
 *
 * Run: node scripts/build-project-launch-lp-ar.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const ADS_AR = 'https://3dgraphicshouse.com/solutions/project-launch-ads.html';
const ADS_EN = 'https://3dgraphicshouse.com/solutions/project-launch-ads-en.html';

const ADS_CSS = `
  /* Ads LP — no site header (DAMAC-style paid landing) */
  body.pl-ads-lp {
    padding-top: 0 !important;
  }
  body.pl-ads-lp .pl-ads-brand {
    position: absolute;
    top: max(20px, env(safe-area-inset-top));
    inset-inline-start: max(20px, env(safe-area-inset-left));
    z-index: 25;
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  body.pl-ads-lp .pl-ads-brand img {
    height: 44px;
    width: auto;
    display: block;
  }
  body.pl-ads-lp .pl-ads-lang.lang-switch {
    position: absolute;
    top: max(24px, env(safe-area-inset-top));
    inset-inline-end: max(20px, env(safe-area-inset-right));
    z-index: 25;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .08em;
    font-family: Inter, system-ui, sans-serif;
  }
  body.pl-ads-lp .pl-ads-lang .lang-switch-link {
    color: rgba(255,255,255,.55);
    text-decoration: none;
    padding: 4px 2px;
    transition: color .2s ease;
  }
  body.pl-ads-lp .pl-ads-lang .lang-switch-link:hover,
  body.pl-ads-lp .pl-ads-lang .lang-switch-link.is-active {
    color: #C9A84C;
  }
  body.pl-ads-lp .pl-ads-lang .lang-switch-sep {
    color: rgba(255,255,255,.28);
    user-select: none;
  }
  @media (max-width: 720px) {
    body.pl-ads-lp { padding-bottom: 84px; }
    body.pl-ads-lp .pl-ads-brand img { height: 36px; }
    body.pl-ads-lp .pl-ads-lang.lang-switch { font-size: 11px; top: max(22px, env(safe-area-inset-top)); }
  }
  /* Ads: full viewport hero (no site header offset) */
  body.pl-ads-lp .pl-hero {
    height: 100svh !important;
    min-height: 100svh !important;
    max-height: 100svh !important;
  }
  body.pl-ads-lp .pl-hero-bottom-panel {
    padding-bottom: calc(36px + env(safe-area-inset-bottom));
  }
  /* Ads mobile hero pad */
  @media (max-width:768px) {
    body.pl-ads-lp .pl-hero {
      padding-top: calc(72px + env(safe-area-inset-top)) !important;
    }
  }
`;

function buildAdsLp({ srcRel, outRel, pageUrl, lang, homeHref, ghostCtaFrom, ghostCtaTo, subjectFrom, subjectTo }) {
  const SRC = path.join(ROOT, srcRel);
  const OUT = path.join(ROOT, outRel);
  let html = fs.readFileSync(SRC, 'utf8');

  /* Ads meta */
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${pageUrl}">\n<meta name="robots" content="noindex,nofollow"/>`
  );
  html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\s*/g, '');
  html = html.replace(
    /(<meta name="robots" content="noindex,nofollow"\/>)/,
    `$1\n<link rel="alternate" hreflang="ar" href="${ADS_AR}">\n<link rel="alternate" hreflang="en" href="${ADS_EN}">\n<link rel="alternate" hreflang="x-default" href="${ADS_AR}">`
  );
  html = html.replace(
    /property="og:url" content="[^"]*"/,
    `property="og:url" content="${pageUrl}"`
  );
  html = html.replace(
    /"url":"https:\/\/3dgraphicshouse\.com\/solutions\/project-launch(?:-en)?\.html"/,
    `"url":"${pageUrl}"`
  );

  /* Strip site header chrome assets — keep lang-switch.js for AR/EN toggle */
  html = html.replace(/<link rel="stylesheet" href="\.\.\/assets\/site-header\.css[^"]*">\s*/g, '');
  html = html.replace(/<script defer src="\.\.\/assets\/site-header\.js[^"]*"><\/script>\s*/g, '');

  /* Ensure lang-switch.js is present */
  if (!html.includes('lang-switch.js')) {
    html = html.replace(
      /(<script defer src="\.\.\/assets\/gh-performance\.js[^"]*"><\/script>)/,
      `$1\n<script defer src="../assets/lang-switch.js?v=2"></script>`
    );
  }

  /* Remove skip link + site header */
  html = html.replace(/<a class="gh-skip-link"[\s\S]*?<\/a>\s*/g, '');
  html = html.replace(
    /(?:<!-- ===== SITE HEADER \(Arabic\) ===== -->\s*)?<header class="header"[\s\S]*?<\/header>\s*/g,
    ''
  );

  /* Ads body class */
  html = html.replace(
    /<body([^>]*)>/,
    '<body$1 data-pl-ads="1" class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden pl-ads-lp">'
  );
  html = html.replace(
    /class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden" data-pl-ads="1" class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden pl-ads-lp"/,
    'class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden pl-ads-lp" data-pl-ads="1"'
  );

  if (!html.includes('Ads LP — no site header')) {
    html = html.replace('</style>', `${ADS_CSS}\n</style>`);
  }

  const arActive = lang === 'ar' ? ' is-active' : '';
  const enActive = lang === 'en' ? ' is-active' : '';
  const langLabel = lang === 'ar' ? 'اختيار اللغة' : 'Language';
  const topChrome = `
  <a class="pl-ads-brand" href="${homeHref}" aria-label="Graphics House">
    <img src="../assets/logo-gold.png" alt="Graphics House" width="160" height="44">
  </a>
  <div class="lang-switch pl-ads-lang" role="group" aria-label="${langLabel}">
    <a href="project-launch-ads.html" class="lang-switch-link${arActive}" hreflang="ar">AR</a>
    <span class="lang-switch-sep" aria-hidden="true">|</span>
    <a href="project-launch-ads-en.html" class="lang-switch-link${enActive}" hreflang="en">EN</a>
  </div>`;

  /* Corner brand + language switch inside hero */
  if (html.includes('class="pl-ads-brand"')) {
    html = html.replace(
      /<a class="pl-ads-brand"[\s\S]*?<\/a>(?:\s*<div class="lang-switch pl-ads-lang"[\s\S]*?<\/div>)?/,
      topChrome.trim()
    );
  } else {
    html = html.replace(
      /(<section class="pl-hero relative[^"]*">)/,
      `$1\n${topChrome}`
    );
  }

  /* Track ads submissions in form subject */
  if (subjectFrom && subjectTo) {
    html = html.replace(subjectFrom, subjectTo);
  }

  /* Ads: personal email welcome (paid traffic often uses Gmail) */
  html = html.replace(
    /placeholder="you@yourcompany\.com"/g,
    'placeholder="you@email.com"'
  );
  html = html.replace(
    /placeholder="name@company\.com"/g,
    'placeholder="you@email.com"'
  );
  html = html.replace(
    /placeholder="name@company\.sa"/g,
    'placeholder="you@email.com"'
  );

  /* Secondary hero CTA: keep users on LP */
  if (ghostCtaFrom && ghostCtaTo) {
    html = html.replace(ghostCtaFrom, ghostCtaTo);
  }

  fs.writeFileSync(OUT, html);
  console.log(`Wrote ${outRel} (ProjectLaunch ads LP, ${lang.toUpperCase()}, no header, AR/EN switch)`);
}

buildAdsLp({
  srcRel: 'solutions/project-launch.html',
  outRel: 'solutions/project-launch-ads.html',
  pageUrl: ADS_AR,
  lang: 'ar',
  homeHref: '../index-ar.html',
  ghostCtaFrom:
    /<a href="\.\.\/portfolio\.html" class="pl-btn-pill pl-btn-pill-ghost">مشاهدة أعمالنا<\/a>/,
  ghostCtaTo: '<a href="#stories" class="pl-btn-pill pl-btn-pill-ghost">قصص النجاح</a>',
  subjectFrom: "subject:      'ProjectLaunch\\u2122: طلب جلسة إطلاق'",
  subjectTo: "subject:      'ProjectLaunch\\u2122 Ads: طلب جلسة إطلاق'",
});

buildAdsLp({
  srcRel: 'solutions/project-launch-en.html',
  outRel: 'solutions/project-launch-ads-en.html',
  pageUrl: ADS_EN,
  lang: 'en',
  homeHref: '../index.html',
  ghostCtaFrom:
    /<a href="\.\.\/portfolio-en\.html" class="pl-btn-pill pl-btn-pill-ghost">View our work<\/a>/,
  ghostCtaTo: '<a href="#stories" class="pl-btn-pill pl-btn-pill-ghost">Success stories</a>',
  subjectFrom: "subject:      'ProjectLaunch\\u2122: Launch session request'",
  subjectTo: "subject:      'ProjectLaunch\\u2122 Ads: Launch session request'",
});
