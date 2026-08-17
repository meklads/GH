#!/usr/bin/env node
/**
 * Build project teaser gallery on case-study-mwl-en.html
 * and stub "Under Construction" pages for each project.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const PROJECTS = [
  {
    slug: 'al-rajhi',
    nameEn: 'Al Rajhi',
    nameAr: 'الراجحي',
    img: 'assets/projects/maquettes/alrajhi-maquette-01.jpeg',
    webp: 'assets/projects/maquettes/alrajhi-maquette-01.webp',
  },
  {
    slug: 'rafal',
    nameEn: 'Rafal',
    nameAr: 'رفال',
    img: 'assets/projects/animation/rafal-pavilions.jpg',
    webp: 'assets/projects/animation/rafal-pavilions.webp',
  },
  {
    slug: 'alissa',
    nameEn: 'Alissa',
    nameAr: 'العيسائي',
    img: 'assets/projects/rendering/pavilion3-1.jpg',
    webp: 'assets/projects/rendering/pavilion3-1.webp',
  },
  {
    slug: 'anan-eskan',
    nameEn: 'Anan Eskan',
    nameAr: 'عنان إسكان',
    img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
    webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp',
  },
  {
    slug: 'mwl',
    nameEn: 'Muslim World League',
    nameAr: 'رابطة العالم الإسلامي',
    img: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
    webp: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
  },
];

const GALLERY_CSS = `
.cs-projects{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
.cs-project{position:relative;display:block;overflow:hidden;background:#111;isolation:isolate;text-decoration:none;color:#fff}
.cs-project picture,.cs-project img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;transition:transform .55s ease}
.cs-project:hover img{transform:scale(1.04)}
.cs-project-veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.15) 55%,transparent 100%);pointer-events:none;z-index:1}
.cs-project-name{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:18px 16px;font-family:'Playfair Display',Georgia,serif;font-size:clamp(15px,1.3vw,20px);font-weight:700;letter-spacing:-.01em;line-height:1.25}
.cs-project-name small{display:block;margin-top:6px;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(201,168,76,.85)}
@media(max-width:1100px){.cs-projects{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:900px){
  .cs-overview-grid{grid-template-columns:1fr;gap:24px}
  .cs-stats{grid-template-columns:1fr}
  .cs-hero{min-height:min(52vh,560px)}
  .cs-hero-copy{padding:72px 0 36px}
  .cs-section{padding:48px 0}
}
@media(max-width:700px){.cs-projects{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.cs-project-name{padding:14px 12px}}
@media(max-width:420px){.cs-projects{grid-template-columns:1fr}}
`.trim();

function underConstructionHtml(project) {
  const title = `${project.nameEn} · Under Construction`;
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title} · Graphics House</title>
<meta name="robots" content="noindex,nofollow"/>
<meta name="description" content="${project.nameEn} case study is under construction."/>
<link rel="canonical" href="https://3dgraphicshouse.com/project-${project.slug}-en.html"/>
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="assets/site-header.css?v=35">
<link rel="stylesheet" href="assets/gh-site-enhancements.css?v=27">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#0A0A0A;color:#fff;min-height:100vh;display:flex;flex-direction:column}
.uc{flex:1;display:flex;align-items:center;justify-content:center;padding:120px 24px 80px;text-align:center}
.uc-inner{max-width:520px}
.uc-label{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A84C;margin-bottom:18px}
.uc h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(28px,4vw,44px);font-weight:800;line-height:1.15;margin-bottom:14px}
.uc p{font-size:16px;color:rgba(255,255,255,.55);line-height:1.7;margin-bottom:32px}
.uc a{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:#C9A84C;color:#000;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:50px;text-decoration:none}
.uc a:hover{background:#D9B860}
.uc-ar{display:block;margin-top:10px;font-size:18px;color:rgba(255,255,255,.35);font-family:'Playfair Display',Georgia,serif}
</style>
</head>
<body>
<a class="gh-skip-link" href="#main-content">Skip to main content</a>
<header class="header" id="header">
  <div class="container header-inner">
    <a href="/" class="logo">
      <img src="assets/logo-gold.png" alt="Graphics House" class="logo-img" width="auto" height="75">
    </a>
    <nav class="nav" id="nav" aria-label="Main navigation">
      <a class="nav-link" href="who-we-are-en.html">About Us</a>
      <a class="nav-link" href="portfolio-en.html">Our Work</a>
      <a class="nav-link" href="case-study-mwl-en.html">Case Studies</a>
      <a class="nav-link" href="contact-us-en.html">Contact Us</a>
    </nav>
    <div class="header-actions">
      <div class="lang-switch" role="group" aria-label="Language">
        <a href="index-ar.html" class="lang-switch-link" hreflang="ar">AR</a>
        <a href="index.html" class="lang-switch-link is-active" hreflang="en">EN</a>
      </div>
      <a href="contact-us-en.html" class="nav-cta btn-pill btn-pill-gold">Book Session</a>
    </div>
  </div>
</header>
<main id="main-content" class="uc" tabindex="-1">
  <div class="uc-inner">
    <div class="uc-label">Case Study</div>
    <h1>${project.nameEn}<span class="uc-ar">${project.nameAr}</span></h1>
    <p>Under Construction<br>تحت الإنشاء</p>
    <a href="case-study-mwl-en.html">← Back to Case Studies</a>
  </div>
</main>
<script defer src="assets/site-header.js?v=16"></script>
</body>
</html>
`;
}

function galleryHtml() {
  const cards = PROJECTS.map((p) => {
    const href = `project-${p.slug}-en.html`;
    const source = fs.existsSync(path.join(ROOT, p.webp))
      ? `<source srcset="${p.webp}" type="image/webp">`
      : '';
    return `    <a class="cs-project" href="${href}">
      <picture>${source}<img loading="lazy" src="${p.img}" alt="${p.nameEn}"></picture>
      <span class="cs-project-veil" aria-hidden="true"></span>
      <span class="cs-project-name">${p.nameEn}<small>${p.nameAr}</small></span>
    </a>`;
  }).join('\n');

  return `<!-- PROJECTS -->
<section class="cs-section" style="background:#0A0A0A;padding-bottom:48px">
  <div class="wrap" style="padding-bottom:8px">
    <div class="reveal" style="margin-bottom:28px">
      <span style="font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:12px">Selected Work</span>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(24px,3vw,36px);font-weight:700;color:#fff;line-height:1.2">Projects</h2>
    </div>
    <div class="cs-projects">
${cards}
    </div>
  </div>
</section>`;
}

// Write stub pages
for (const p of PROJECTS) {
  const rel = `project-${p.slug}-en.html`;
  fs.writeFileSync(path.join(ROOT, rel), underConstructionHtml(p), 'utf8');
  console.log('wrote', rel);
}

// Patch case-study-mwl-en.html gallery + CSS
const casePath = path.join(ROOT, 'case-study-mwl-en.html');
let html = fs.readFileSync(casePath, 'utf8');

// Ensure gallery CSS exists (replace old .cs-gallery rules block or inject)
if (html.includes('.cs-projects{')) {
  html = html.replace(
    /\.cs-projects\{[\s\S]*?@media\(max-width:420px\)\{\.cs-projects\{grid-template-columns:1fr\}\}/,
    GALLERY_CSS
  );
} else if (html.includes('.cs-gallery{')) {
  html = html.replace(
    /\.cs-gallery\{display:grid;[\s\S]*?@media\(max-width:560px\)\{\s*\.cs-gallery\{grid-template-columns:1fr\}\s*\}/,
    GALLERY_CSS
  );
} else {
  html = html.replace(
    /@media\(prefers-reduced-motion:reduce\)/,
    `${GALLERY_CSS}\n@media(prefers-reduced-motion:reduce)`
  );
}

// Remove stray orphan braces before mega-menu comment if present
html = html.replace(/\n\}\s*\n\/\* Mega menu:/, '\n\n/* Mega menu:');

const galleryBlock = galleryHtml();
if (/<!-- GALLERY -->[\s\S]*?<!-- BOTTOM CTA -->/.test(html)) {
  html = html.replace(/<!-- GALLERY -->[\s\S]*?<!-- BOTTOM CTA -->/, `${galleryBlock}\n\n<!-- BOTTOM CTA -->`);
} else if (/<!-- PROJECTS -->[\s\S]*?<!-- BOTTOM CTA -->/.test(html)) {
  html = html.replace(/<!-- PROJECTS -->[\s\S]*?<!-- BOTTOM CTA -->/, `${galleryBlock}\n\n<!-- BOTTOM CTA -->`);
} else {
  throw new Error('Could not find gallery/projects section to replace');
}

fs.writeFileSync(casePath, html, 'utf8');
console.log('updated case-study-mwl-en.html gallery');
