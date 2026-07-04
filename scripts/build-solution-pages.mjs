#!/usr/bin/env node
/**
 * Rebuild solutions/*.html as clean coming-soon pages with shared layout hooks.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOLUTIONS = path.join(ROOT, 'solutions');

const PAGES = [
  {
    file: 'growth-launch.html',
    title: 'GrowthLaunch™',
    meta: 'Lead generation and sales system for real estate developers.',
    icon: 'trending_up',
    en: 'GrowthLaunch™ solution page is under construction. Coming soon.',
    ar: 'صفحة حل GrowthLaunch™ تحت الإنشاء. قريباً.',
  },
  {
    file: 'project-launch.html',
    title: 'ProjectLaunch™',
    meta: 'Real estate project launch system from pre-sales to handover.',
    icon: 'apartment',
    en: 'ProjectLaunch™ solution page is under construction. Coming soon.',
    ar: 'صفحة حل ProjectLaunch™ تحت الإنشاء. قريباً.',
  },
  {
    file: 'brand-scale.html',
    title: 'BrandScale™',
    meta: 'Brand growth system for companies scaling across the GCC.',
    icon: 'auto_awesome',
    en: 'BrandScale™ solution page is under construction. Coming soon.',
    ar: 'صفحة حل BrandScale™ تحت الإنشاء. قريباً.',
  },
];

function pageHtml(p) {
  return `<!DOCTYPE html>
<html class="scroll-smooth" dir="ltr" lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.title} | Graphics House (GH)</title>
<meta name="description" content="${p.meta}"/>
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="../assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="../assets/site-header.css">
<link rel="stylesheet" href="../assets/solution-soon.css">
<script defer src="../assets/site-header.js"></script>
</head>
<body style="min-height:100vh;display:flex;flex-direction:column;background:#0A0A0A;color:#fff;margin:0">

<header class="header" id="header">
  <div class="container header-inner">
    <a href="../index.html" class="logo"><img src="../assets/logo-gold.png" alt="Graphics House" style="height:86px;width:auto"></a>
  </div>
</header>

<main class="solution-soon">
  <div class="solution-soon-card">
    <span class="material-symbols-outlined solution-soon-icon">${p.icon}</span>
    <h1 class="solution-soon-title">${p.title}</h1>
    <p class="solution-soon-text">${p.en}</p>
    <p class="solution-soon-text solution-soon-text-ar">${p.ar}</p>
    <div class="solution-soon-badge"><span class="dot"></span> Coming Soon · قريباً</div>
    <div class="solution-soon-actions">
      <a href="../index.html" class="outline">Back to Home</a>
      <a href="../contact-us-en.html" class="gold">Contact Us</a>
    </div>
  </div>
</main>

<footer dir="ltr"><div style="padding:24px;text-align:center;font-size:12px;color:rgba(255,255,255,.3)">Graphics House</div></footer>

</body>
</html>
`;
}

for (const p of PAGES) {
  fs.writeFileSync(path.join(SOLUTIONS, p.file), pageHtml(p), 'utf8');
  console.log('built:', p.file);
}
