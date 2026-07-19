/**
 * ProjectLaunch™ AR — nav-free ads landing page.
 * Clones solutions/project-launch.html design (DAMAC-style LP for paid campaigns):
 *   - full page content + footer + floats
 *   - NO site header / mega nav
 *   - noindex for ads traffic
 *
 * Permanent site page (solutions/project-launch.html) is never overwritten here.
 *
 * Run: node scripts/build-project-launch-lp-ar.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'solutions', 'project-launch.html');
const OUT = path.join(ROOT, 'solutions', 'project-launch-ads.html');
const PAGE_URL = 'https://3dgraphicshouse.com/solutions/project-launch-ads.html';

let html = fs.readFileSync(SRC, 'utf8');

/* Ads meta */
html = html.replace(
  /<link rel="canonical" href="[^"]*">/,
  `<link rel="canonical" href="${PAGE_URL}">\n<meta name="robots" content="noindex,nofollow"/>`
);
html = html.replace(
  /<link rel="alternate" hreflang="[^"]*" href="[^"]*">\s*/g,
  ''
);
html = html.replace(
  /property="og:url" content="[^"]*"/,
  `property="og:url" content="${PAGE_URL}"`
);
html = html.replace(
  /"url":"https:\/\/3dgraphicshouse\.com\/solutions\/project-launch\.html"/,
  `"url":"${PAGE_URL}"`
);

/* Strip site header assets */
html = html.replace(/<link rel="stylesheet" href="\.\.\/assets\/site-header\.css[^"]*">\s*/g, '');
html = html.replace(/<script defer src="\.\.\/assets\/site-header\.js[^"]*"><\/script>\s*/g, '');
html = html.replace(/<script defer src="\.\.\/assets\/lang-switch\.js[^"]*"><\/script>\s*/g, '');

/* Remove full site header chrome */
html = html.replace(
  /<!-- ===== SITE HEADER \(Arabic\) ===== -->[\s\S]*?<\/header>\s*/,
  ''
);

/* Ads body class + no header offset + DAMAC-style corner brand on hero */
html = html.replace(
  /<body([^>]*)>/,
  '<body$1 data-pl-ads="1" class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden pl-ads-lp">'
);
/* Avoid duplicate class attributes if body already has class */
html = html.replace(
  /class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden" data-pl-ads="1" class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden pl-ads-lp"/,
  'class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden pl-ads-lp" data-pl-ads="1"'
);

const adsCss = `
  /* Ads LP — no site header (DAMAC-style paid landing) */
  body.pl-ads-lp {
    padding-top: 0 !important;
  }
  body.pl-ads-lp .pl-ads-brand {
    position: absolute;
    top: max(20px, env(safe-area-inset-top));
    inset-inline-start: max(20px, env(safe-area-inset-left));
    z-index: 20;
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
  @media (max-width: 720px) {
    body.pl-ads-lp { padding-bottom: 84px; }
    body.pl-ads-lp .pl-ads-brand img { height: 36px; }
  }
`;

if (!html.includes('Ads LP — no site header')) {
  html = html.replace('</style>', `${adsCss}\n</style>`);
}

/* Corner brand logo inside hero (like DAMAC promotions — not a nav) */
if (!html.includes('class="pl-ads-brand"')) {
  html = html.replace(
    /(<section class="pl-hero relative h-screen flex items-center justify-center overflow-hidden">)/,
    `$1\n  <a class="pl-ads-brand" href="../index-ar.html" aria-label="Graphics House">\n    <img src="../assets/logo-gold.png" alt="Graphics House" width="160" height="44">\n  </a>`
  );
}

/* Track ads submissions in form subject */
html = html.replace(
  "subject:      'ProjectLaunch\\u2122: طلب جلسة إطلاق'",
  "subject:      'ProjectLaunch\\u2122 Ads: طلب جلسة إطلاق'"
);

/* Secondary hero CTA: keep users on LP — scroll to work section instead of leaving */
html = html.replace(
  /<a href="\.\.\/portfolio\.html" class="pl-btn-pill pl-btn-pill-ghost">مشاهدة أعمالنا<\/a>/,
  '<a href="#stories" class="pl-btn-pill pl-btn-pill-ghost">قصص النجاح</a>'
);

fs.writeFileSync(OUT, html);
console.log('Wrote solutions/project-launch-ads.html (full ProjectLaunch design, no header, footer kept)');
