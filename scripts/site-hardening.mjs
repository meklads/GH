#!/usr/bin/env node
/**
 * Site hardening: SEO, performance patches, security cleanup, sitemap.
 * Run: node scripts/site-hardening.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripLegacyGa, injectAnalytics } from './analytics-snippet.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://3dgraphicshouse.com';

const SKIP = new Set([
  'gh-admin.html',
  'home-v2-backup.html',
  'en-backup.html',
  'en-v2.html',
  'offer-lite.html',
]);

const SITEMAP_SKIP = new Set([
  ...SKIP,
  'en.html',
  'blog.html',
  '3d-animation.html',
  '3d-animation-en.html',
  'media-production.html',
  'media-production-en.html',
  'smart-maquettes.html',
  'smart-maquettes-en.html',
  'interactive-experiences.html',
  'interactive-experiences-en.html',
  'galleries-advertising.html',
  'galleries-advertising-en.html',
  'contact.html',
  'case-study-alrajhi-en.html',
  'case-study-anan-eskan-en.html',
  'case-study-mwl-en.html',
  'offer-en.html',
  'vr360.html',
  'insights/news.html',
  'insights/articles.html',
  'insights/case-studies.html',
]);

/** Folder index.html stubs that only redirect — exclude from sitemap */
const SITEMAP_REDIRECT_STUBS = new Set([
  'who-we-are/index.html',
  'folio/index.html',
  'privacy-policy/index.html',
  'portfolio/index.html',
  'motion-graphic/index.html',
  'media-production/index.html',
  'interactive-presentation/index.html',
  'contact/index.html',
  'contact-us-2/index.html',
  'clients/index.html',
  'career/index.html',
  'blog/index.html',
  '3d-animation/index.html',
  'scale-models/index.html',
  'faq/index.html',
]);

/** Legacy landings superseded by current IA — keep URLs but de-index */
const LEGACY_NOINDEX = new Set([
  'about.html',
  'gh-visualization.html',
  'gh-maquettes.html',
  'gh-medical.html',
  'gh-photography.html',
  'offer.html',
  'offer-lite.html',
  'marketing.html',
  'real-estate.html',
  'shop.html',
  'boyslove.html',
  'en.html',
]);

const EXPLICIT_PAIRS = {
  'index.html': 'index-ar.html',
  'index-ar.html': 'index.html',
  'en.html': 'index-ar.html',
  'contact.html': 'contact-us-en.html',
  'contact-us-en.html': 'contact-us.html',
  'case-study-alrajhi-en.html': 'insights/projects/al-rajhi-riyadh.html',
  'case-study-anan-eskan-en.html': 'insights/projects/anan-eskan-riyadh.html',
  'case-study-mwl-en.html': 'insights/projects/makkah-charter-mwl.html',
  'careers-en.html': 'index.html',
  'offer-en.html': 'contact-us-en.html',
};

/** services/foo.html ↔ services/foo-en.html */
function isServicesRel(rel) {
  return rel.startsWith('services/');
}

const HAS_EN = new Set([
  'who-we-are.html', 'workspace.html', 'smart-maquettes.html', 'privacy-policy.html',
  'portfolio.html', 'offer.html', 'media-production.html', 'interactive-experiences.html',
  'galleries-advertising.html', 'faq.html', 'contact-us.html', 'casestudy1.html',
  '3d-animation.html', 'growth-launch.html', 'project-launch.html', 'brand-scale.html',
]);

function collectHtmlFiles(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'partials', 'scripts', 'assets', 'node_modules', '.trash'].includes(ent.name)) continue;
      out.push(...collectHtmlFiles(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

function alternateFile(fileName, rel = '') {
  if (EXPLICIT_PAIRS[fileName]) return EXPLICIT_PAIRS[fileName];
  if (isServicesRel(rel)) {
    if (fileName.endsWith('-en.html')) return fileName.replace(/-en\.html$/, '.html');
    if (fileName.endsWith('.html')) return fileName.replace(/\.html$/, '-en.html');
  }
  if (fileName.endsWith('-en.html')) return fileName.replace(/-en\.html$/, '.html');
  if (HAS_EN.has(fileName)) return fileName.replace(/\.html$/, '-en.html');
  return null;
}

function seoTags(rel) {
  const fileName = path.basename(rel);
  const legacyServiceCanon = {
    '3d-animation.html': `${BASE}/services/animation.html`,
    'media-production.html': `${BASE}/services/production.html`,
    'smart-maquettes.html': `${BASE}/services/maquettes.html`,
    'interactive-experiences.html': `${BASE}/services/interactive-experiences.html`,
    'galleries-advertising.html': `${BASE}/services/branding.html`,
    'contact.html': `${BASE}/contact-us.html`,
  };
  if (legacyServiceCanon[rel]) {
    const canonical = legacyServiceCanon[rel];
    const enUrl = canonical.replace(/\.html$/, '-en.html');
    return { canonical, enUrl, arUrl: canonical };
  }

  const urlPath = rel === 'index.html' ? '' : rel;
  const canonical = `${BASE}/${urlPath}`.replace(/\/$/, '') || BASE + '/';
  const altFile = alternateFile(fileName, rel);
  const dir = path.posix.dirname(rel);
  const altRel = altFile ? (dir === '.' ? altFile : `${dir}/${altFile}`) : null;
  const isEn = fileName.endsWith('-en.html') || fileName === 'index.html' || (fileName.endsWith('.html') && !fileName.includes('-ar') && fileName !== 'index-ar.html' && dir.startsWith('services'));

  let enUrl = canonical;
  let arUrl = `${BASE}/index-ar.html`;

  if (rel.startsWith('services/')) {
    const enFile = fileName.endsWith('-en.html')
      ? fileName
      : fileName.replace(/\.html$/, '-en.html');
    const arFile = fileName.endsWith('-en.html')
      ? fileName.replace(/-en\.html$/, '.html')
      : fileName;
    const enUrl = `${BASE}/services/${enFile}`;
    const arUrl = `${BASE}/services/${arFile}`;
    if (fileName.endsWith('-en.html')) {
      return { canonical, enUrl: canonical, arUrl };
    }
    return { canonical, arUrl: canonical, enUrl };
  }

  if (altRel) {
    const altUrl = `${BASE}/${altRel}`;
    if (fileName.endsWith('-en.html') || fileName === 'index.html') {
      enUrl = canonical;
      arUrl = altUrl;
    } else {
      arUrl = canonical;
      enUrl = altUrl;
    }
  } else if (fileName === 'index-ar.html') {
    enUrl = `${BASE}/`;
    arUrl = canonical;
  } else if (isEn) {
    arUrl = `${BASE}/index-ar.html`;
  } else {
    enUrl = `${BASE}/`;
  }

  return { canonical, enUrl, arUrl };
}

function injectSeo(html, rel) {
  if (SKIP.has(rel)) return html;
  const { canonical, enUrl, arUrl } = seoTags(rel);
  const block = `<!-- GH SEO -->
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">`;

  if (html.includes('rel="canonical"')) {
    html = html.replace(/<!-- GH SEO -->[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*>/, block);
    if (!html.includes('hreflang="en"')) {
      html = html.replace(/(<link rel="canonical"[^>]*>)/i, `$1\n${block.replace('<!-- GH SEO -->\n', '')}`);
    }
    return html;
  }
  return html.replace(/<head>/i, `<head>\n${block}`);
}

const PERF_HINTS = `<!-- GH perf -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">`;

function injectPerformanceHints(html) {
  if (html.includes('<!-- GH perf -->')) {
    return html.replace(/<!-- GH perf -->[\s\S]*?<link rel="dns-prefetch" href="https:\/\/www\.googletagmanager\.com">/, PERF_HINTS);
  }
  if (html.includes('<!-- GH SEO -->')) {
    return html.replace(/<!-- GH SEO -->/, `${PERF_HINTS}\n<!-- GH SEO -->`);
  }
  return html.replace(/<head>/i, `<head>\n${PERF_HINTS}`);
}

function injectMainContentAnchor(html) {
  if (!html.includes('<header class="header"') || html.includes('id="main-content"')) {
    return html;
  }
  return html.replace(
    /<\/header>/i,
    '</header>\n<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>'
  );
}

function injectNoindex(html, rel) {
  if (!LEGACY_NOINDEX.has(rel)) return html;
  if (/name="robots"[^>]*noindex/i.test(html)) return html;
  return html.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex,follow">');
}

function injectLcpPreload(html, rel) {
  const preloads = [];
  if (rel === 'index.html' || rel === 'index-ar.html') {
    preloads.push('<link rel="preload" as="image" href="assets/hero-demo-poster.jpg" fetchpriority="high">');
  }
  if (rel === 'portfolio.html' || rel === 'portfolio-en.html') {
    preloads.push(
      '<link rel="preload" as="image" href="assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg" fetchpriority="high">'
    );
  }
  if (!preloads.length) return html;
  if (preloads.every((tag) => html.includes(tag))) return html;
  const block = preloads.filter((tag) => !html.includes(tag)).join('\n');
  if (!block) return html;
  return html.replace(/<head>/i, `<head>\n${block}`);
}

/** @deprecated use injectLcpPreload */
function injectHomeLcpPreload(html, rel) {
  return injectLcpPreload(html, rel);
}

function jsonLdForPage(rel, html) {
  if (SKIP.has(rel)) return null;
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);
  const name = titleMatch ? titleMatch[1].split('|')[0].trim() : 'Graphics House';
  const description = descMatch ? descMatch[1] : 'Graphics House creative and business solutions';
  const urlPath = rel === 'index.html' ? '' : rel;
  const url = `${BASE}/${urlPath}`.replace(/\/$/, '') || `${BASE}/`;

  const base = {
    '@context': 'https://schema.org',
    '@type': rel.startsWith('solutions/') ? 'Product' : 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'Graphics House',
      url: BASE,
      logo: `${BASE}/assets/logo-gold.png`,
    },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  };

  if (rel.startsWith('solutions/')) {
    base.brand = { '@type': 'Brand', name: 'Graphics House' };
    base.category = 'Business Solutions';
  }

  return JSON.stringify(base, null, 0);
}

function injectJsonLd(html, rel) {
  const ld = jsonLdForPage(rel, html);
  if (!ld) return html;
  const block = `<script type="application/ld+json">${ld}</script>`;
  if (html.includes('application/ld+json') && html.includes('"@type":"Product"')) return html;
  if (html.includes('application/ld+json') && !rel.startsWith('solutions/') && !rel.startsWith('services/')) {
    return html;
  }
  if (html.includes('application/ld+json') && (rel.startsWith('solutions/') || rel.startsWith('services/'))) {
    return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, block);
  }
  if (!rel.startsWith('solutions/') && !rel.startsWith('services/') && html.includes('application/ld+json')) {
    return html;
  }
  if (rel.startsWith('solutions/') || rel.startsWith('services/')) {
    return html.replace(/<\/head>/i, `${block}\n</head>`);
  }
  return html;
}

function replaceTailwindCdn(html, prefix) {
  const link = `<link rel="stylesheet" href="${prefix}assets/tailwind.min.css?v=1">`;
  if (!html.includes('cdn.tailwindcss.com') && html.includes('tailwind.min.css')) return html;

  html = html.replace(
    /<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>\s*<script>[\s\S]*?<\/script>\s*/gi,
    ''
  );
  html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>\s*/gi, '');

  if (!html.includes('tailwind.min.css')) {
    html = html.replace(/<\/head>/i, `${link}\n</head>`);
  }
  return html;
}

function secureFormSubmits(html) {
  html = html.replace(/var W3F_KEY = '[^']+';[^\n]*\n/g, '');
  html = html.replace(/access_key: W3F_KEY,\s*/g, '');
  html = html.replace(
    /fetch\(['"]https:\/\/api\.web3forms\.com\/submit['"]/g,
    "fetch((window.GH_FORMS&&window.GH_FORMS.formEndpoint)||'https://3dgraphicshouse.com/api/form'"
  );
  html = html.replace(/access_key:\(window\.GH_FORMS&&window\.GH_FORMS\.web3formsAccessKey\)\|\|['"]{2},?\s*/g, '');
  html = html.replace(/access_key:\(window\.GH_FORMS&&window\.GH_FORMS\.web3formsAccessKey\)\|\|""?,?\s*/g, '');
  html = html.replace(/access_key:'cd3e4509-7942-4ad3-a888-2af2910f5f6d',?\s*/g, '');
  return html;
}

function injectPerformanceScript(html, prefix) {
  const tag = `<script defer src="${prefix}assets/gh-performance.js?v=10"></script>`;
  if (html.includes('gh-performance.js')) return html;
  if (html.includes('site-header.js')) {
    return html.replace(
      /(<script defer src="[^"]*site-header\.js[^"]*"><\/script>)/,
      `$1\n${tag}`
    );
  }
  if (html.includes('lang-switch.js')) {
    return html.replace(
      /(<script defer src="[^"]*lang-switch\.js[^"]*"><\/script>)/,
      `$1\n${tag}`
    );
  }
  return html.replace(/<\/body>/i, `${tag}\n</body>`);
}

function ensureHeaderCssOrder(html, assetsPrefix) {
  const headerHref = `${assetsPrefix}site-header.css?v=35`;
  const headerTag = `<link rel="stylesheet" href="${headerHref}">`;
  html = html.replace(/<link[^>]*href="[^"]*site-header\.css[^"]*"[^>]*>\s*/gi, '');
  if (/gh-site-enhancements\.css/i.test(html)) {
    return html.replace(
      /(<link[^>]*href="[^"]*gh-site-enhancements\.css[^"]*"[^>]*>)/i,
      `$1\n${headerTag}`
    );
  }
  if (/tailwind\.min\.css/i.test(html)) {
    return html.replace(
      /(<link[^>]*href="[^"]*tailwind\.min\.css[^"]*"[^>]*>)/i,
      `$1\n${headerTag}`
    );
  }
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${headerTag}\n</head>`);
  }
  return html;
}

function stripConflictingHeaderStyles(html) {
  html = html.replace(/body\s*\{\s*padding-top:\s*0\s*!important;\s*\}/g, '');
  html = html.replace(/\.header-inner\s*\{[^}]*display\s*:\s*flex[^}]*\}/gi, '');
  html = html.replace(/\.header\.scrolled\s*\{[^}]*padding\s*:[^}]*\}/gi, '');
  html = html.replace(/\.header\s*\{[^}]*position\s*:\s*fixed[^}]*\}/gi, '');
  html = html.replace(/html\[dir="ltr"\]\s*\.nav-link\s*\{[^}]*\}/gi, '');
  html = html.replace(/\.nav a\{[^}]*font-size[^}]*\}/gi, '');
  html = html.replace(
    /window\.addEventListener\(["']scroll["'],\s*function\s*\(\)\s*\{document\.getElementById\(["']header["']\)\.classList\.toggle\(["']scrolled["'],\s*window\.scrollY>\d+\)\};?\)/g,
    ''
  );
  html = html.replace(
    /window\.addEventListener\(["']scroll["'],\s*function\s*\(\)\s*\{var\s+h=document\.getElementById\(["']header["']\);if\(h\)h\.classList\.toggle\(["']scrolled["'],\s*window\.scrollY>\d+\)\};?\)/g,
    ''
  );
  return html;
}

const PLAYFAIR_FONT =
  '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500&display=swap" rel="stylesheet">';

function injectArPlayfairFont(html, rel) {
  if (rel !== 'index-ar.html') return html;
  if (html.includes('Playfair+Display')) return html;
  return html.replace(
    /(<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Tajawal[^"]+" rel="stylesheet">)/,
    `$1\n${PLAYFAIR_FONT}`
  );
}

function injectServiceEnTypography(html, rel) {
  if (!rel.startsWith('services/') || !rel.endsWith('-en.html')) return html;
  const link = '<link rel="stylesheet" href="../assets/gh-en-typography.css?v=1">';
  if (html.includes('gh-en-typography.css')) return html;
  if (html.includes('site-header.css')) {
    return html.replace(
      /(<link rel="stylesheet" href="\.\.\/assets\/site-header\.css[^"]*">)/i,
      `$1\n${link}`
    );
  }
  return html.replace(/<\/head>/i, `${link}\n</head>`);
}

function wrapPortfolioHeroWebp(html, rel) {
  if (rel !== 'portfolio.html' && rel !== 'portfolio-en.html') return html;
  const pairs = [
    ['alrajhi-maquette-01.jpeg', 'alrajhi-maquette-01.webp'],
    ['anan-eskan-maquette-01.jpeg', 'anan-eskan-maquette-01.webp'],
  ];
  let out = html;
  for (const [jpeg, webp] of pairs) {
    if (out.includes(`pf-hero-mosaic__cell`) && out.includes(`<picture><source srcset="assets/projects/maquettes/${webp}"`)) {
      continue;
    }
    const re = new RegExp(
      `(<div class="pf-hero-mosaic__cell[^"]*">)<img src="assets/projects/maquettes/${jpeg.replace('.', '\\.')}"([^>]*)>`,
      'g'
    );
    out = out.replace(
      re,
      `$1<picture><source srcset="assets/projects/maquettes/${webp}" type="image/webp"><img src="assets/projects/maquettes/${jpeg}"$2></picture>`
    );
  }
  return out;
}

function fixServiceLinks(html, rel) {
  if (!rel.startsWith('services/')) return html;
  let out = html.replace(/href="galleries-advertising-en\.html"/g, 'href="branding-en.html"');
  if (rel.endsWith('-en.html')) {
    out = out.replace(/href="\.\.\/contact\.html"/g, 'href="../contact-us-en.html"');
  } else if (rel === 'services/vr-360.html' || rel === 'services/interactive.html') {
    out = out.replace(/href="\.\.\/contact\.html"/g, 'href="../contact-us.html"');
  }
  return out;
}

function patchHtml(html, rel) {
  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  html = injectSeo(html, rel);
  html = injectPerformanceHints(html);
  html = injectLcpPreload(html, rel);
  html = injectNoindex(html, rel);
  html = injectMainContentAnchor(html);
  html = injectArPlayfairFont(html, rel);
  html = injectServiceEnTypography(html, rel);
  html = wrapPortfolioHeroWebp(html, rel);
  html = fixServiceLinks(html, rel);
  html = replaceTailwindCdn(html, prefix);
  html = injectJsonLd(html, rel);
  html = stripLegacyGa(html);
  html = injectAnalytics(html, prefix);
  const ctaTrack = `<script defer src="${prefix}assets/gh-cta-track.js?v=1"></script>`;
  if (!html.includes('gh-cta-track.js')) {
    html = html.replace(/<\/body>/i, `${ctaTrack}\n</body>`);
  }
  html = injectPerformanceScript(html, prefix);
  html = secureFormSubmits(html);
  html = stripConflictingHeaderStyles(html);

  const assetsPrefix = depth > 0 ? '../'.repeat(depth) + 'assets/' : 'assets/';
  if (html.includes('site-header.css') || html.includes('<header class="header"')) {
    html = ensureHeaderCssOrder(html, assetsPrefix);
  }

  if (rel === 'index-ar.html' && !html.includes('<meta name="description"')) {
    html = html.replace(
      /<meta name="viewport"[^>]*>/,
      `$&\n<meta name="description" content="Graphics House: هوية بصرية, مجسمات ذكية, إعلانات, وتجارب تفاعلية للمشاريع التجارية والسكنية في السعودية والخليج.">`
    );
  }

  if ((rel === 'workspace.html' || rel === 'workspace-en.html') && !html.includes('<meta name="description"')) {
    const desc = rel.endsWith('-en.html')
      ? 'Interactive project workspace demo — explore Graphics House visualization deliverables.'
      : 'مساحة عمل تفاعلية لعرض مخرجات التصور المعماري من Graphics House.';
    html = html.replace(/<meta name="viewport"[^>]*>/, `$&\n<meta name="description" content="${desc}">`);
  }

  html = html.replace(/preload="auto"/g, (match, offset, str) => {
    const start = Math.max(0, offset - 400);
    const chunk = str.slice(start, offset + 80);
    const videoIdx = chunk.lastIndexOf('<video');
    if (videoIdx === -1) return 'preload="metadata"';
    const tag = chunk.slice(videoIdx);
    if (/\bid=["'](hero-vid|hero-vid-ar|s2VideoPlayer)["']/i.test(tag) || /\bhero-video-bg\b/.test(chunk)) {
      return match;
    }
    if (/\b(autoplay|gh-autoplay|gh-ambient)\b/i.test(tag)) return 'preload="none"';
    return 'preload="metadata"';
  });

  html = html.replace(/dot4life\.team@gmail\.com/g, 'info@3dgraphicshouse.com');

  if (rel === 'index.html' || rel === 'index-ar.html') {
    html = html.replace(
      /(<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"WebSite"[\s\S]*?)(,\s*"potentialAction"\s*:\s*\{[\s\S]*?\})([\s\S]*?\}\s*<\/script>)/,
      '$1$3'
    );
  }

  if (html.includes('web3forms.com') && !html.includes('gh-forms-config.js')) {
    html = html.replace(/<head>/i, `<head>\n<script src="${prefix}assets/gh-forms-config.js"></script>`);
  }
  if (html.includes('formsubmit.co') && !html.includes('gh-forms-config.js')) {
    html = html.replace(/<head>/i, `<head>\n<script src="${prefix}assets/gh-forms-config.js"></script>`);
  }

  const enhanceCss = `<link rel="stylesheet" href="${prefix}assets/gh-site-enhancements.css?v=28">`;
  if (!html.includes('gh-site-enhancements.css')) {
    html = html.replace(/<\/head>/i, `${enhanceCss}\n</head>`);
  } else {
    html = html.replace(
      /gh-site-enhancements\.css(?:\?v=\d+)?/g,
      'gh-site-enhancements.css?v=28'
    );
  }

  html = html.replace(/<img(?![^>]*loading=)([^>]*?)>/gi, (m, rest) => {
    if (/hero|logo|gh-popup|favicon/i.test(m)) return m;
    return `<img loading="lazy"${rest}>`;
  });

  return html;
}

function buildSitemap(files) {
  const urls = files
    .filter((f) => !SITEMAP_SKIP.has(f) && !SITEMAP_REDIRECT_STUBS.has(f) && !LEGACY_NOINDEX.has(f))
    .map((f) => {
      const loc = f === 'index.html' ? `${BASE}/` : `${BASE}/${f}`;
      let priority = '0.6';
      if (f === 'index.html' || f === 'index-ar.html') priority = '1.0';
      else if (f.startsWith('solutions/')) priority = '0.9';
      else if (f.includes('portfolio') || f.includes('who-we-are')) priority = '0.85';
      else if (f.startsWith('services/')) priority = '0.75';
      const lastmod = new Date().toISOString().slice(0, 10);
      return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
    })
    .sort((a, b) => a.localeCompare(b));

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

// Process all HTML
const files = collectHtmlFiles(ROOT);
let patched = 0;
for (const rel of files) {
  if (SKIP.has(rel)) continue;
  const full = path.join(ROOT, rel);
  const before = fs.readFileSync(full, 'utf8');
  const after = patchHtml(before, rel);
  if (after !== before) {
    fs.writeFileSync(full, after, 'utf8');
    patched++;
  }
}

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(files));

fs.writeFileSync(
  path.join(ROOT, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /wp-content/
Disallow: /wp-includes/
Disallow: /wp-admin/
Disallow: /wp-*.php
Disallow: /goods/
Disallow: /shopdetail/
Disallow: /product/
Disallow: /pcmypage
Disallow: /us-store_
Disallow: /search
Disallow: /recruit
Disallow: /events/
Disallow: /feature/
Disallow: /lander
Disallow: /gh-admin.html
Disallow: /home-v2-backup.html
Disallow: /en-backup.html
Disallow: /en-v2.html
Disallow: /offer-lite.html
Disallow: /assets/projects/maquettes/WhatsApp-

Sitemap: ${BASE}/sitemap.xml
`
);

// en.html → redirect to /
const enPath = path.join(ROOT, 'en.html');
if (fs.existsSync(enPath)) {
  fs.writeFileSync(
    enPath,
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0;url=/">
<link rel="canonical" href="${BASE}/">
<title>Redirecting…</title>
<script>location.replace('/');</script>
</head>
<body><p><a href="/">Continue to Graphics House</a></p></body>
</html>
`,
    'utf8'
  );
}

function writeDirRedirect(fromDir, toPath) {
  const dirPath = path.join(ROOT, fromDir);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(
    path.join(dirPath, 'index.html'),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/${toPath}">
  <link rel="canonical" href="${BASE}/${toPath}">
  <meta name="robots" content="noindex,follow">
  <title>Redirecting…</title>
  <script>location.replace('/${toPath}');</script>
</head>
<body><p><a href="/${toPath}">Continue</a></p></body>
</html>
`,
    'utf8'
  );
}

function writeFileRedirect(fromFile, toPath) {
  fs.writeFileSync(
    path.join(ROOT, fromFile),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/${toPath}">
  <link rel="canonical" href="${BASE}/${toPath}">
  <meta name="robots" content="noindex,follow">
  <title>Redirecting…</title>
  <script>location.replace('/${toPath}');</script>
</head>
<body><p><a href="/${toPath}">Continue</a></p></body>
</html>
`,
    'utf8'
  );
}

// Legacy trailing-slash URLs seen in GSC → current pages
writeDirRedirect('privacy-policy', 'privacy-policy.html');
writeDirRedirect('folio', 'portfolio.html');
writeDirRedirect('interactive-presentation', 'services/interactive.html');
writeDirRedirect('contact', 'contact-us.html');
writeDirRedirect('portfolio', 'portfolio.html');
writeDirRedirect('who-we-are', 'who-we-are.html');
writeDirRedirect('faq', 'faq.html');
writeDirRedirect('media-production', 'media-production.html');
writeDirRedirect('blog', 'insights/index.html');
writeDirRedirect('scale-models', 'services/maquettes.html');
writeDirRedirect('3d-animation', 'services/animation.html');
writeDirRedirect('motion-graphic', 'services/animation.html');
writeDirRedirect('clients', 'who-we-are.html');
writeDirRedirect('career', 'index-ar.html');
writeDirRedirect('contact-us-2', 'contact-us.html');

// One-off spam slug
writeFileRedirect('boyslove.html', 'index-ar.html');

const LEGACY_SERVICE_ROOT = {
  '3d-animation.html': 'services/animation.html',
  'media-production.html': 'services/production.html',
  'smart-maquettes.html': 'services/maquettes.html',
  'interactive-experiences.html': 'services/interactive-experiences.html',
  'galleries-advertising.html': 'services/branding.html',
  'contact.html': 'contact-us.html',
  'blog.html': 'insights/index.html',
  'offer-en.html': 'contact-us-en.html',
  'vr360.html': 'vr360/index.html',
};

for (const [from, to] of Object.entries(LEGACY_SERVICE_ROOT)) {
  writeFileRedirect(from, to);
}

const CASE_STUDY_REDIRECTS = {
  'case-study-alrajhi-en.html': 'insights/projects/al-rajhi-riyadh-en.html',
  'case-study-anan-eskan-en.html': 'insights/projects/anan-eskan-riyadh-en.html',
  'case-study-mwl-en.html': 'insights/projects/makkah-charter-mwl-en.html',
};

for (const [from, to] of Object.entries(CASE_STUDY_REDIRECTS)) {
  writeFileRedirect(from, to);
}

// Disable gh-admin client password
const adminPath = path.join(ROOT, 'gh-admin.html');
if (fs.existsSync(adminPath)) {
  let admin = fs.readFileSync(adminPath, 'utf8');
  admin = admin.replace(
    /if\(pw === '[^']+'\)/,
    "if(false /* disabled — use server-side auth */)"
  );
  if (!admin.includes('noindex')) {
    admin = admin.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex,nofollow">');
  }
  fs.writeFileSync(adminPath, admin, 'utf8');
}

console.log(`Hardened ${patched} pages. Sitemap: ${files.filter((f) => !SITEMAP_SKIP.has(f)).length} URLs.`);
