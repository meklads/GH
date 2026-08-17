#!/usr/bin/env node
/**
 * Generate services/*-en.html pages and consolidate EN service URLs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHeader, renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SERVICES = path.join(ROOT, 'services');
const SOURCES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'service-en-sources');
const BASE = 'https://3dgraphicshouse.com';
const DEPTH = 1;
const PREFIX = '../';

const ROOT_EN_COPY = {
  'animation-en.html': '3d-animation-en.html',
  'production-en.html': 'media-production-en.html',
};

const BILINGUAL_CLONE = ['interactive.html', 'vr-360.html'];

const RICH_EN_PAGES = new Set([
  'ai-solutions-en.html',
  'branding-en.html',
  'cinematic-cgi-en.html',
  'digital-marketing-en.html',
  'interactive-experiences-en.html',
  'photography-media-en.html',
  'smart-visualization-en.html',
  'web-solutions-en.html',
  'scale-models-en.html',
]);

const EN_STUBS = {
  'ai-solutions-en.html': {
    icon: 'psychology',
    title: 'AI Solutions',
    subtitle:
      'AI-powered visualization, automation, and creative workflows for real estate and engineering teams in the GCC.',
    meta: 'AI-powered creative and visualization solutions for the GCC.',
  },
  'branding-en.html': {
    icon: 'brush',
    title: 'Branding',
    subtitle:
      'Comprehensive branding — identity design, brand strategy, and positioning for developers across the GCC.',
    meta: 'Strategic brand identity and brand development services.',
  },
  'cinematic-cgi-en.html': {
    icon: 'movie',
    title: 'Cinematic CGI',
    subtitle:
      'High-end cinematic CGI films for project launches, sales centers, and investor presentations.',
    meta: 'Cinematic CGI films for real estate and architectural launches.',
  },
  'digital-marketing-en.html': {
    icon: 'campaign',
    title: 'Digital Marketing',
    subtitle:
      'Performance marketing, content, and lead generation for developers and engineering firms in Saudi Arabia and the GCC.',
    meta: 'Digital marketing and lead generation for the GCC real estate sector.',
  },
  'interactive-experiences-en.html': {
    icon: 'touch_app',
    title: 'Interactive Experiences',
    subtitle:
      'Touchscreen kiosks, VR tours, and interactive sales platforms for real estate showrooms and launch events.',
    meta: 'Interactive sales experiences and digital showrooms for real estate.',
  },
  'photography-media-en.html': {
    icon: 'photo_camera',
    title: 'Photography & Media',
    subtitle:
      'Architectural photography, aerial filming, and content production for real estate marketing campaigns.',
    meta: 'Photography and media production for real estate and commercial projects.',
  },
  'scale-models-en.html': {
    icon: 'domain',
    title: 'Scale Models',
    subtitle:
      'Precision architectural scale models for presentations, exhibitions, and investor meetings.',
    meta: 'Architectural scale models for real estate presentations.',
  },
  'smart-visualization-en.html': {
    icon: 'auto_awesome',
    title: 'Smart Visualization',
    subtitle:
      'Integrated visualization systems combining CGI, data layers, and interactive presentation tools.',
    meta: 'Smart visualization systems for large-scale real estate developments.',
  },
  'web-solutions-en.html': {
    icon: 'language',
    title: 'Web Solutions',
    subtitle:
      'Project websites, landing pages, and digital sales platforms for developers in the GCC.',
    meta: 'Websites and digital platforms for real estate project launches.',
  },
};

const ROOT_EN_REDIRECTS = {
  'smart-maquettes-en.html': 'services/maquettes-en.html',
  '3d-animation-en.html': 'services/animation-en.html',
  'media-production-en.html': 'services/production-en.html',
  'interactive-experiences-en.html': 'services/interactive-experiences-en.html',
};

const LEGACY_SERVICE_REDIRECTS = {
  'gh-visualization.html': 'services/rendering.html',
  'gh-maquettes.html': 'services/maquettes.html',
  'gh-photography.html': 'services/production.html',
  'gh-medical.html': 'services/rendering.html',
};

function rewriteRootHtmlToServices(html, enFileName) {
  html = html.replace(/<html[^>]*>/i, '<html class="scroll-smooth" dir="ltr" lang="en">');
  html = html.replace(/(href|src)="assets\//g, '$1="../assets/');
  html = html.replace(/data-video="assets\//g, 'data-video="../assets/');
  html = html.replace(/poster="assets\//g, 'poster="../assets/');
  html = html.replace(/srcset="assets\//g, 'srcset="../assets/');
  html = html.replace(/playLocalVideo\('assets\//g, "playLocalVideo('../assets/");
  html = html.replace(/href="index\.html"/g, 'href="../index.html"');
  html = html.replace(/href="index-ar\.html"/g, 'href="../index-ar.html"');
  html = html.replace(/href="who-we-are-en\.html"/g, 'href="../who-we-are-en.html"');
  html = html.replace(/href="who-we-are\.html"/g, 'href="../who-we-are.html"');
  html = html.replace(/href="contact-us-en\.html"/g, 'href="../contact-us-en.html"');
  html = html.replace(/href="contact-us\.html"/g, 'href="../contact-us.html"');
  html = html.replace(/href="portfolio-en\.html"/g, 'href="../portfolio-en.html"');
  html = html.replace(/href="portfolio\.html"/g, 'href="../portfolio.html"');
  html = html.replace(/href="casestudy1-en\.html"/g, 'href="../casestudy1-en.html"');
  html = html.replace(/href="casestudy1\.html"/g, 'href="../casestudy1.html"');
  html = html.replace(/href="faq-en\.html"/g, 'href="../faq-en.html"');
  html = html.replace(/href="solutions\//g, 'href="../solutions/');
  html = html.replace(/href="insights\//g, 'href="../insights/');
  html = html.replace(/href="locations\//g, 'href="../locations/');
  html = html.replace(/href="3d-animation-en\.html"/g, 'href="animation-en.html"');
  html = html.replace(/href="smart-maquettes-en\.html"/g, 'href="maquettes-en.html"');
  html = html.replace(/href="media-production-en\.html"/g, 'href="production-en.html"');
  html = html.replace(/href="interactive-experiences-en\.html"/g, 'href="interactive-experiences-en.html"');
  html = html.replace(/href="services\/maquettes\.html"/g, 'href="maquettes.html"');
  html = html.replace(/href="services\/animation\.html"/g, 'href="animation.html"');
  html = html.replace(/href="services\/rendering\.html"/g, 'href="rendering.html"');
  html = html.replace(/href="services\/production\.html"/g, 'href="production.html"');
  html = html.replace(/href="services\/interactive\.html"/g, 'href="interactive.html"');
  html = html.replace(/url\((['"])assets\//g, `url($1../assets/`);
  html = html.replace(/src="assets\//g, 'src="../assets/');

  const arFile = enFileName.replace('-en.html', '.html');
  const canonical = `${BASE}/services/${enFileName}`;
  const arUrl = `${BASE}/services/${arFile}`;
  const seo = `<!-- GH SEO -->
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${canonical}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${canonical}">`;
  if (html.includes('<!-- GH SEO -->')) {
    html = html.replace(/<!-- GH SEO -->[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*>/, seo);
  } else {
    html = html.replace(/<link rel="canonical" href="[^"]*"[^>]*>/i, '');
    html = html.replace(/<head>/i, `<head>\n${seo}`);
  }
  return html;
}

function cloneBilingualEn(arFile, enFile) {
  // EN pages are maintained as dedicated monolingual brand pages
  // (see scripts/brand-legacy-service-pages.mjs). Do not overwrite them
  // with bilingual AR clones.
  const enPath = path.join(SERVICES, enFile);
  if (fs.existsSync(enPath)) {
    console.log('  keep monolingual EN:', enFile);
    return;
  }
  console.warn('  missing EN page (skipped clone):', enFile);
}

function buildEnStub(enFileName, data) {
  const header = renderHeader(DEPTH, true);
  const footer = renderFooter(DEPTH, true);
  const canonical = `${BASE}/services/${enFileName}`;
  const arFile = enFileName.replace('-en.html', '.html');
  const arUrl = `${BASE}/services/${arFile}`;

  const html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="ltr" lang="en">
<head>
<script src="${PREFIX}assets/gh-forms-config.js?v=2"></script>
<!-- GH perf -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<!-- GH SEO -->
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${canonical}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${canonical}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${data.title} | Graphics House</title>
<meta name="description" content="${data.meta}"/>
<meta property="og:title" content="${data.title} | Graphics House">
<meta property="og:description" content="${data.meta}">
<meta property="og:image" content="${BASE}/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="${PREFIX}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${PREFIX}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${PREFIX}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="${PREFIX}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${PREFIX}assets/gh-site-enhancements.css?v=25">
<link rel="stylesheet" href="${PREFIX}assets/site-header.css?v=31">
<style>
:root{--gold:#C9A84C;--text-primary:#FAFAF8;--text-secondary:rgba(255,255,255,.7);--border-medium:rgba(255,255,255,.12)}
body{font-family:'Inter',sans-serif;background:#0A0A0A;color:var(--text-primary);min-height:100vh;display:flex;flex-direction:column}
.svc-en-hero{flex:1;display:flex;align-items:center;justify-content:center;padding:140px 24px 80px}
.svc-en-card{max-width:760px;width:100%;text-align:center;padding:56px 40px;background:rgba(255,255,255,.02);border:1px solid var(--border-medium);border-radius:20px}
.svc-en-icon{font-size:56px;color:var(--gold);margin-bottom:24px}
.svc-en-title{font-family:'Playfair Display',Georgia,serif;font-size:clamp(28px,3.5vw,44px);font-weight:700;margin-bottom:16px}
.svc-en-sub{font-size:clamp(16px,1.4vw,19px);color:var(--text-secondary);line-height:1.75;margin-bottom:32px}
.svc-en-cta{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:32px}
.svc-en-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;transition:all .3s}
.svc-en-btn-gold{background:#C9A84C;color:#0A0A0A}
.svc-en-btn-gold:hover{background:#A8883A}
.svc-en-btn-outline{border:1px solid rgba(255,255,255,.35);color:#FAFAF8}
.svc-en-btn-outline:hover{border-color:#C9A84C;color:#C9A84C}
</style>
<script defer src="${PREFIX}assets/site-header.js?v=16"></script>
<script defer src="${PREFIX}assets/gh-performance.js?v=2"></script>
<script defer src="${PREFIX}assets/lang-switch.js?v=1"></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: data.meta,
    url: canonical,
    provider: {
      '@type': 'Organization',
      name: 'Graphics House',
      url: BASE,
    },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body>
${header}
<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>
<section class="svc-en-hero">
  <div class="svc-en-card">
    <span class="material-symbols-outlined svc-en-icon">${data.icon}</span>
    <h1 class="svc-en-title">${data.title}</h1>
    <p class="svc-en-sub">${data.subtitle}</p>
    <div class="svc-en-cta">
      <a href="${PREFIX}portfolio-en.html" class="svc-en-btn svc-en-btn-outline">View Portfolio</a>
      <a href="${PREFIX}contact-us-en.html" class="svc-en-btn svc-en-btn-gold">Book a Session</a>
    </div>
  </div>
</section>
${footer}
</body>
</html>
`;
  fs.writeFileSync(path.join(SERVICES, enFileName), html, 'utf8');
  console.log('  stub EN:', enFileName);
}

function writeRedirect(fromFile, toPath) {
  const full = path.join(ROOT, fromFile);
  const target = toPath.startsWith('http') ? toPath : `${BASE}/${toPath}`;
  const rel = toPath.replace(/^\//, '');
  fs.writeFileSync(
    full,
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=/${rel}">
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex,follow">
<title>Redirecting…</title>
<script>location.replace('/${rel}');</script>
</head>
<body><p><a href="/${rel}">Continue to Graphics House</a></p></body>
</html>
`,
    'utf8'
  );
  console.log('  redirect:', fromFile, '→', toPath);
}

console.log('Building English service pages…');

for (const [enFile, source] of Object.entries(ROOT_EN_COPY)) {
  const dest = path.join(SERVICES, enFile);
  const srcPath = path.join(SOURCES_DIR, source);
  if (!fs.existsSync(srcPath)) {
    console.warn('  skip missing canonical source:', source);
    continue;
  }
  let html = rewriteRootHtmlToServices(fs.readFileSync(srcPath, 'utf8'), enFile);
  fs.writeFileSync(dest, html, 'utf8');
  console.log('  copied EN:', enFile, '←', `service-en-sources/${source}`);
}

for (const arFile of BILINGUAL_CLONE) {
  cloneBilingualEn(arFile, arFile.replace('.html', '-en.html'));
}

for (const [enFile, data] of Object.entries(EN_STUBS)) {
  if (ROOT_EN_COPY[enFile] || enFile === 'rendering-en.html' || RICH_EN_PAGES.has(enFile)) continue;
  buildEnStub(enFile, data);
}

for (const [from, to] of Object.entries(ROOT_EN_REDIRECTS)) {
  if (fs.existsSync(path.join(ROOT, from))) writeRedirect(from, to);
}

for (const [from, to] of Object.entries(LEGACY_SERVICE_REDIRECTS)) {
  if (fs.existsSync(path.join(ROOT, from))) writeRedirect(from, to);
}

console.log('Done — English service pages built.');
