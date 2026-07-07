#!/usr/bin/env node
/**
 * Build Knowledge Hub pages from insights/data/content.json
 * Run: node scripts/build-insights.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'insights/data/content.json'), 'utf8'));
const ARTICLES_DIR = path.join(ROOT, 'insights/data/articles');
const PROJECTS_DIR = path.join(ROOT, 'insights/data/projects');

function loadArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return DATA.articles || [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'));
  if (!files.length) return DATA.articles || [];
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

const ARTICLES = loadArticles();

function loadProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf8')))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

const PROJECTS = loadProjects();

function extract(html, pattern) {
  const m = html.match(pattern);
  return m ? m[1] : '';
}

function getLayout(lang) {
  const file = lang === 'en' ? 'index.html' : 'index-ar.html';
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const header = extract(html, /(<header class="header" id="header">[\s\S]*?<\/header>)/);
  const footer = extract(
    html,
    lang === 'en'
      ? /(<footer dir="ltr"[\s\S]*?<\/footer>)/
      : /(<footer dir="rtl"[\s\S]*?<\/footer>)/
  );
  return { header, footer };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBodyBlock(block) {
  if (typeof block === 'string') return `<p>${esc(block)}</p>`;
  const text = block.text || '';
  switch (block.type) {
    case 'p':
      return `<p>${esc(text)}</p>`;
    case 'h2':
      return `<h2>${esc(text)}</h2>`;
    case 'h3':
      return `<h3>${esc(text)}</h3>`;
    case 'ul':
      return `<ul>${(block.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    case 'ol':
      return `<ol>${(block.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`;
    default:
      return text ? `<p>${esc(text)}</p>` : '';
  }
}

function renderBody(body) {
  return (body || []).map(renderBodyBlock).join('\n');
}

function articleDescription(article, lang) {
  const isEn = lang === 'en';
  const meta = article.metaDescription;
  if (meta) return isEn ? meta.en : meta.ar;
  return isEn ? article.excerpt.en : article.excerpt.ar;
}

function articleSchema(article, lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const slug = `${article.slug}${isEn ? '-en' : ''}.html`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: L(article.title),
    description: articleDescription(article, lang),
    image: `https://3dgraphicshouse.com/${article.image}`,
    datePublished: `${article.date}-01`,
    author: { '@type': 'Organization', name: 'Graphics House' },
    publisher: {
      '@type': 'Organization',
      name: 'Graphics House',
      logo: { '@type': 'ImageObject', url: 'https://3dgraphicshouse.com/assets/favicon/og-image.png' },
    },
    mainEntityOfPage: `https://3dgraphicshouse.com/insights/articles/${slug}`,
    inLanguage: isEn ? 'en' : 'ar',
  });
}

function prefixPaths(html, depth) {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return html
    .replace(/src="assets\//g, `src="${p}assets/`)
    .replace(/href="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, `href="${p}$1"`);
}

function headBlock(lang, meta) {
  const isEn = lang === 'en';
  const depth = meta.depth || 1;
  const p = depth > 0 ? '../'.repeat(depth) : '';
  const base = 'https://3dgraphicshouse.com';
  const canonical = meta.canonical || `${base}/insights/${isEn ? 'index-en.html' : 'index.html'}`;
  const altEn = meta.altEn || `${base}/insights/index-en.html`;
  const altAr = meta.altAr || `${base}/insights/index.html`;

  return `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="${p}assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags(p)}
<script src="${p}assets/quote-form-config.js"></script>
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="ar" href="${altAr}">
<link rel="alternate" hreflang="x-default" href="${altEn}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(meta.title)} | Graphics House</title>
<meta name="description" content="${esc(meta.description)}"/>
<meta property="og:title" content="${esc(meta.title)} | Graphics House">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:image" content="${base}/assets/favicon/og-image.png">
<meta property="og:type" content="${meta.ogType || 'website'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${p}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${p}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${p}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="${p}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${p}assets/site-header.css?v=14">
<link rel="stylesheet" href="${p}assets/gh-site-enhancements.css?v=12">
<link rel="stylesheet" href="${p}assets/gh-insights.css?v=20">
<link rel="stylesheet" href="${p}assets/gh-float-widgets.css?v=2">
<script defer src="${p}assets/site-header.js?v=9"></script>
<script defer src="${p}assets/gh-performance.js?v=1"></script>
<script defer src="${p}assets/lang-switch.js?v=3"></script>
</head>
<body class="gh-insights">`;
}

function tailScripts(depth) {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return `
<script defer src="${p}assets/gh-float-widgets.js?v=1"></script>
</body></html>`;
}

function readingMinutes(article, lang) {
  const isEn = lang === 'en';
  const body = article.body?.[isEn ? 'en' : 'ar'] || article.body?.en || [];
  let words = 0;
  for (const block of body) {
    if (block.text) words += block.text.split(/\s+/).filter(Boolean).length;
    if (block.items) words += block.items.join(' ').split(/\s+/).filter(Boolean).length;
  }
  const mins = Math.max(4, Math.ceil(words / 200));
  return isEn ? `${mins} min read` : `${mins} دقائق`;
}

function hubSubNav(lang) {
  const isEn = lang === 'en';
  const items = [
    { id: 'articles', label: isEn ? 'Featured Articles' : 'مقالات مميزة', icon: 'article' },
    { id: 'cities', label: isEn ? 'Cities' : 'المدن', icon: 'location_city' },
    { id: 'projects', label: isEn ? 'Featured Projects' : 'مشاريع مميزة', icon: 'apartment' },
    { id: 'ai-tools', label: isEn ? 'AI Tools' : 'أدوات الذكاء الاصطناعي', icon: 'smart_toy' },
    { id: 'downloads', label: isEn ? 'Downloads' : 'التحميلات', icon: 'download' },
    { id: 'newsletter', label: isEn ? 'Newsletter' : 'النشرة', icon: 'mail' },
  ];
  const links = items
    .map(
      (item, i) => `
    <a href="#${item.id}" class="gh-ins-subnav-link${i === 0 ? ' is-active' : ''}" data-gh-ins-tab="${item.id}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}">
      <span class="material-symbols-outlined" aria-hidden="true">${item.icon}</span>
      ${item.label}
    </a>`
    )
    .join('');
  return `
<div class="gh-ins-subnav-wrap">
  <nav class="gh-ins-subnav" aria-label="${isEn ? 'Insights sections' : 'أقسام الرؤى'}" role="tablist">
    ${links}
  </nav>
</div>`;
}

function hubTabScript() {
  return `<script>
(function(){
  var nav=document.querySelector(".gh-ins-subnav");
  if(!nav)return;
  var links=nav.querySelectorAll("[data-gh-ins-tab]");
  var panels=document.querySelectorAll("[data-gh-ins-panel]");
  function show(id,updateHash){
    links.forEach(function(l){
      var on=l.getAttribute("data-gh-ins-tab")===id;
      l.classList.toggle("is-active",on);
      l.setAttribute("aria-selected",on?"true":"false");
    });
    panels.forEach(function(p){
      p.classList.toggle("is-active",p.getAttribute("data-gh-ins-panel")===id);
    });
    if(updateHash!==false&&history.replaceState)history.replaceState(null,"","#"+id);
  }
  links.forEach(function(l){
    l.addEventListener("click",function(e){e.preventDefault();show(l.getAttribute("data-gh-ins-tab"));});
  });
  var h=(location.hash||"").slice(1);
  if(h&&document.querySelector('[data-gh-ins-panel="'+h+'"]')){show(h);}else{
    show("articles",false);
    if(history.replaceState)history.replaceState(null,"",location.pathname+location.search);
  }
  window.addEventListener("hashchange",function(){
    var id=(location.hash||"").slice(1);
    if(id&&document.querySelector('[data-gh-ins-panel="'+id+'"]'))show(id);
  });
})();
</script>`;
}

function newsletterSection(lang) {
  const isEn = lang === 'en';
  return `
<section class="gh-ins-section gh-ins-panel gh-ins-newsletter" id="newsletter" data-gh-ins-panel="newsletter">
  <div class="gh-ins-newsletter-inner">
    <h2>${isEn ? 'Stay Ahead in Architectural Visualization' : 'ابقَ في الصدارة في الإظهار المعماري'}</h2>
    <p class="gh-ins-newsletter-desc">${isEn
    ? 'Receive exclusive insights, AI resources, presentation strategies, and industry knowledge designed for real estate developers.'
    : 'احصل على رؤى حصرية، موارد الذكاء الاصطناعي، استراتيجيات العروض، ومعرفة صناعية مصممة لمطوري العقار.'}</p>
    <form class="gh-ins-newsletter-form" data-gh-newsletter novalidate>
      <input type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
      <input type="email" name="email" placeholder="${isEn ? 'Your email address' : 'بريدك الإلكتروني'}" required autocomplete="email">
      <button type="submit">${isEn ? 'Subscribe' : 'اشترك'}</button>
      <div class="gh-turnstile"></div>
    </form>
    <div class="gh-ins-newsletter-msg gh-newsletter-msg" role="status"></div>
  </div>
</section>
<script defer src="../assets/gh-newsletter.js?v=4"></script>`;
}

function articleCard(article, lang, p, featured) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const href = `articles/${article.slug}${isEn ? '-en' : ''}.html`;
  const readLabel = isEn ? 'Read More' : 'اقرأ المزيد';
  const arrow = isEn ? 'arrow_forward' : 'arrow_back';
  return `
<article class="gh-ins-card${featured ? ' gh-ins-card--featured' : ''}">
  <a href="${href}" class="gh-ins-card-link">
    <figure class="gh-ins-card-media"><img src="${p}${article.image}" alt="${esc(L(article.title))}" loading="lazy"></figure>
    <div class="gh-ins-card-body">
      <div class="gh-ins-card-meta">
        <span class="gh-ins-cat">${esc(L(article.category))}</span>
        <span class="gh-ins-read-time">${readingMinutes(article, lang)}</span>
      </div>
      <h3>${esc(L(article.title))}</h3>
      <p class="gh-ins-card-excerpt">${esc(hubExcerpt(article, lang))}</p>
      <span class="gh-ins-read-more">${readLabel} <span class="material-symbols-outlined" style="font-size:14px">${arrow}</span></span>
    </div>
  </a>
</article>`;
}

function aiToolsSection(lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const tools = DATA.aiTools || [];
  const cards = tools
    .map(
      (t) => `
<article class="gh-ins-tool-card">
  ${t.comingSoon ? `<span class="gh-ins-badge">${isEn ? 'Coming Soon' : 'قريباً'}</span>` : ''}
  <span class="material-symbols-outlined">${esc(t.icon)}</span>
  <h3>${esc(L(t.title))}</h3>
  <p>${esc(L(t.description))}</p>
  <button type="button" class="gh-ins-btn" disabled>${isEn ? 'Explore' : 'استكشف'}</button>
</article>`
    )
    .join('');
  return `
<section class="gh-ins-section gh-ins-panel" id="ai-tools" data-gh-ins-panel="ai-tools">
  <div class="gh-ins-section-head">
    <h2>${isEn ? 'AI Tools' : 'أدوات الذكاء الاصطناعي'}</h2>
    <p>${isEn
    ? 'Intelligent assistants for developers — more tools launching soon.'
    : 'مساعدات ذكية للمطورين — المزيد من الأدوات قريباً.'}</p>
  </div>
  <div class="gh-ins-tools-grid">${cards}</div>
</section>`;
}

function projectDescription(project, lang) {
  const isEn = lang === 'en';
  const meta = project.metaDescription;
  if (meta) return isEn ? meta.en : meta.ar;
  return isEn ? project.excerpt.en : project.excerpt.ar;
}

function projectSchema(project, lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const slug = `${project.slug}${isEn ? '-en' : ''}.html`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: L(project.title),
    description: projectDescription(project, lang),
    image: `https://3dgraphicshouse.com/${project.image}`,
    datePublished: `${project.date}-01`,
    author: { '@type': 'Organization', name: 'Graphics House' },
    publisher: {
      '@type': 'Organization',
      name: 'Graphics House',
      logo: { '@type': 'ImageObject', url: 'https://3dgraphicshouse.com/assets/favicon/og-image.png' },
    },
    mainEntityOfPage: `https://3dgraphicshouse.com/insights/projects/${slug}`,
    inLanguage: isEn ? 'en' : 'ar',
  });
}

function projectCard(project, lang, p) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const href = `projects/${project.slug}${isEn ? '-en' : ''}.html`;
  const readLabel = isEn ? 'View Project' : 'عرض المشروع';
  const arrow = isEn ? 'arrow_forward' : 'arrow_back';
  return `
<article class="gh-ins-proj-card" data-gh-proj-card>
  <a href="${href}" class="gh-ins-proj-link">
    <figure class="gh-ins-proj-media"><img src="${p}${project.image}" alt="${esc(L(project.projectName))}" loading="lazy"></figure>
    <div class="gh-ins-proj-body">
      <div class="gh-ins-proj-meta">
        <span class="gh-ins-proj-dev">${esc(L(project.developer))}</span>
        <span class="gh-ins-proj-city">${esc(L(project.city))}</span>
      </div>
      <h3>${esc(L(project.title))}</h3>
      <p class="gh-ins-proj-cat">${esc(L(project.category))}</p>
      <p class="gh-ins-proj-excerpt">${esc(L(project.excerpt))}</p>
      <span class="gh-ins-read-more">${readLabel} <span class="material-symbols-outlined" style="font-size:14px">${arrow}</span></span>
    </div>
  </a>
</article>`;
}

function featuredProjectsSection(lang) {
  const isEn = lang === 'en';
  const p = '../';
  const cards = PROJECTS.map((proj) => projectCard(proj, lang, p)).join('');
  return `
<section class="gh-ins-section gh-ins-panel" id="projects" data-gh-ins-panel="projects">
  <div class="gh-ins-section-head">
    <h2>${isEn ? 'Featured Projects' : 'مشاريع مميزة'}</h2>
    <p>${isEn
    ? 'Major developers and landmark launches across the Kingdom — archviz, smart maquettes, CGI films, and interactive sales systems. Order refreshes on each visit.'
    : 'مطورون كبار ومشاريع بارزة في المملكة — إظهار معماري، مجسمات ذكية، أفلام CGI، ومنصات مبيعات. الترتيب يتغيّر عند كل زيارة.'}</p>
  </div>
  <div class="gh-ins-proj-grid" id="ghInsProjGrid">${cards}</div>
</section>
<script defer src="../assets/gh-insights-projects.js?v=1"></script>`;
}

function citiesSection(lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const p = '../';
  const items = DATA.cities || [];
  const cards = items
    .map((c) => {
      const href = `${p}locations/${c.slug}${isEn ? '-en' : ''}.html`;
      const img = c.image ? `${p}${c.image}` : '';
      const explore = isEn ? 'Explore' : 'استكشف';
      const arrow = isEn ? 'arrow_forward' : 'arrow_back';
      return `
<article class="gh-ins-city-card">
  <a href="${href}" class="gh-ins-city-link">
    ${img ? `<figure class="gh-ins-city-media"><img src="${img}" alt="${esc(L(c.title))}" loading="lazy"></figure>` : ''}
    <div class="gh-ins-city-body">
      <span class="material-symbols-outlined gh-ins-city-icon">${esc(c.icon || 'location_on')}</span>
      <h3>${esc(L(c.title))}</h3>
      <p>${esc(L(c.description))}</p>
      <span class="gh-ins-read-more">${explore} <span class="material-symbols-outlined" style="font-size:14px">${arrow}</span></span>
    </div>
  </a>
</article>`;
    })
    .join('');
  return `
<section class="gh-ins-section gh-ins-panel" id="cities" data-gh-ins-panel="cities">
  <div class="gh-ins-section-head">
    <h2>${isEn ? 'Archviz by City' : 'الإظهار المعماري حسب المدينة'}</h2>
    <p>${isEn
    ? 'Landing pages for developers in Jeddah, Riyadh, Makkah, and Madinah — services, portfolio highlights, and local expertise.'
    : 'صفحات مخصصة للمطورين في جدة والرياض ومكة والمدينة — خدمات، أعمال مميزة، وخبرة محلية.'}</p>
  </div>
  <div class="gh-ins-cities-grid">${cards}</div>
</section>`;
}

function downloadsSection(lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const p = '../';
  const items = DATA.downloads || [];
  const cards = items
    .map((d) => {
      const href = d.href ? `${p}${d.href}${isEn ? '-en' : ''}.html` : '#';
      const btn = d.comingSoon
        ? `<button type="button" class="gh-ins-btn gh-ins-btn--muted" disabled>${isEn ? 'Coming Soon' : 'قريباً'}</button>`
        : `<a href="${href}" class="gh-ins-btn">${isEn ? 'Download' : 'تحميل'}</a>`;
      return `
<article class="gh-ins-dl-card">
  <div class="gh-ins-dl-icon"><span class="material-symbols-outlined">${esc(d.icon)}</span></div>
  <div class="gh-ins-dl-body">
    <span class="gh-ins-dl-type">${esc(L(d.fileType))}</span>
    <h3>${esc(L(d.title))}</h3>
    <p>${esc(L(d.description))}</p>
    ${btn}
  </div>
</article>`;
    })
    .join('');
  return `
<section class="gh-ins-section gh-ins-panel" id="downloads" data-gh-ins-panel="downloads">
  <div class="gh-ins-section-head">
    <h2>${isEn ? 'Downloads' : 'التحميلات'}</h2>
    <p>${isEn
    ? 'Premium resource library for project planning and visual launch readiness.'
    : 'مكتبة موارد متميزة لتخطيط المشاريع وجاهزية الإطلاق البصري.'}</p>
  </div>
  <div class="gh-ins-downloads-grid">${cards}</div>
</section>`;
}

function backToInsights(isEn) {
  return isEn ? 'Back to Insights' : 'العودة إلى الرؤى';
}

function hubExcerpt(article, lang) {
  const L = (key) => (lang === 'en' ? key.en : key.ar);
  const ex = L(article.excerpt) || '';
  if (ex.length >= 90) return ex;
  const meta = article.metaDescription ? L(article.metaDescription) : '';
  if (meta.length > ex.length) {
    return meta.length > 220 ? `${meta.slice(0, 217)}…` : meta;
  }
  return ex;
}

function buildHub(lang) {
  const isEn = lang === 'en';
  const { header, footer } = getLayout(lang);
  const featured = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.slug !== featured.slug);
  const p = '../';

  const articlesHtml = [
    articleCard(featured, lang, p, true),
    ...rest.map((a) => articleCard(a, lang, p, false)),
  ].join('');

  const html = `${headBlock(lang, {
    depth: 1,
    title: isEn ? 'Insights' : 'رؤى',
    description: isEn
      ? 'Premium knowledge hub for architectural visualization, cinematic CGI, interactive experiences, and real estate marketing — by Graphics House.'
      : 'مركز معرفة متميز للإظهار المعماري، الـ CGI السينمائي، التجارب التفاعلية، وتسويق العقار — من Graphics House.',
    canonical: `https://3dgraphicshouse.com/insights/${isEn ? 'index-en.html' : 'index.html'}`,
  })}
${prefixPaths(header, 1)}
<main class="gh-insights-page">
  <header class="gh-ins-hero">
    <span class="gh-kicker">Graphics House · Insights</span>
    <h1>Insights</h1>
    <p>${isEn
    ? 'Strategic knowledge for developers shaping major projects — architectural visualization, immersive sales systems, and digital transformation across Saudi Arabia and the GCC.'
    : 'معرفة استراتيجية للمطورين في المشاريع الكبرى — الإظهار المعماري، أنظمة المبيعات الغامرة، والتحول الرقمي في السعودية والخليج.'}</p>
  </header>
  ${hubSubNav(lang)}
  <div class="gh-ins-wrap">
    <div class="gh-ins-panels">
    <section class="gh-ins-section gh-ins-panel is-active" id="articles" data-gh-ins-panel="articles">
      <div class="gh-ins-section-head">
        <h2>${isEn ? 'Featured Articles' : 'مقالات مميزة'}</h2>
        <p>${isEn
    ? 'Expert guides on archviz, CGI, smart maquettes, and visual launch strategy.'
    : 'أدلة متخصصة في الإظهار المعماري والمجسمات الذكية واستراتيجية الإطلاق البصري.'}</p>
      </div>
      <div class="gh-ins-articles-grid">${articlesHtml}</div>
    </section>
    ${citiesSection(lang)}
    ${featuredProjectsSection(lang)}
    ${aiToolsSection(lang)}
    ${downloadsSection(lang)}
    ${newsletterSection(lang)}
    </div>
  </div>
</main>
${prefixPaths(footer, 1)}
${hubTabScript()}
${tailScripts(1)}`;

  const out = isEn ? 'insights/index-en.html' : 'insights/index.html';
  fs.writeFileSync(path.join(ROOT, out), html, 'utf8');
  console.log('  hub:', out);
}

function buildArticle(article, lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const { header, footer } = getLayout(lang);
  const depth = 2;
  const p = '../../';
  const slug = `${article.slug}${isEn ? '-en' : ''}.html`;
  const bodyHtml = renderBody(L(article.body));
  const description = articleDescription(article, lang);

  const html = `${headBlock(lang, {
    depth: 2,
    title: L(article.title),
    description,
    canonical: `https://3dgraphicshouse.com/insights/articles/${slug}`,
    altEn: `https://3dgraphicshouse.com/insights/articles/${article.slug}-en.html`,
    altAr: `https://3dgraphicshouse.com/insights/articles/${article.slug}.html`,
    ogType: 'article',
  })}
<script type="application/ld+json">${articleSchema(article, lang)}</script>
${prefixPaths(header, depth)}
<main class="gh-article-page-wrap">
  <div class="gh-ins-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${backToInsights(isEn)}
    </a>
    <article>
      <header class="gh-article-header">
        <span class="gh-ins-cat">${L(article.category)}</span>
        <h1>${L(article.title)}</h1>
        <p class="gh-dek">${L(article.excerpt)}</p>
        <div class="gh-ins-card-meta" style="margin:0">
          <time class="gh-byline" datetime="${article.date}">${L(article.dateLabel)}</time>
          <span class="gh-ins-read-time">${readingMinutes(article, lang)}</span>
        </div>
      </header>
      <img class="gh-article-hero-img" src="${p}${article.image}" alt="${esc(L(article.title))}" loading="lazy">
      <div class="gh-article-body-wrap">
        ${bodyHtml}
        <div class="gh-article-footer-cta">
          <a href="${p}contact-us${isEn ? '-en' : ''}.html" class="gh-btn-editorial">${isEn ? 'Discuss Your Project' : 'ناقش مشروعك'}</a>
        </div>
      </div>
    </article>
  </div>
</main>
${prefixPaths(footer, depth)}
${tailScripts(depth)}`;

  fs.writeFileSync(path.join(ROOT, 'insights/articles', slug), html, 'utf8');
  console.log('  article:', slug);
}

function buildProject(project, lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const { header, footer } = getLayout(lang);
  const depth = 2;
  const p = '../../';
  const slug = `${project.slug}${isEn ? '-en' : ''}.html`;
  const body = project.body?.[isEn ? 'en' : 'ar'] || project.body?.en || [];
  const bodyHtml = renderBody(body);
  const description = projectDescription(project, lang);
  const services = (project.services?.[isEn ? 'en' : 'ar'] || project.services?.en || [])
    .map((s) => `<span class="gh-ins-proj-tag">${esc(s)}</span>`)
    .join('');
  const gallery = (project.gallery || [])
    .map(
      (src) =>
        `<figure class="gh-ins-proj-gal-item"><img src="${p}${src}" alt="" loading="lazy"></figure>`
    )
    .join('');
  const portfolioHref = project.portfolioHref
    ? `${p}${project.portfolioHref}`
    : `${p}portfolio${isEn ? '-en' : ''}.html`;

  const html = `${headBlock(lang, {
    depth: 2,
    title: L(project.title),
    description,
    canonical: `https://3dgraphicshouse.com/insights/projects/${slug}`,
    altEn: `https://3dgraphicshouse.com/insights/projects/${project.slug}-en.html`,
    altAr: `https://3dgraphicshouse.com/insights/projects/${project.slug}.html`,
    ogType: 'article',
  })}
<script type="application/ld+json">${projectSchema(project, lang)}</script>
${prefixPaths(header, depth)}
<main class="gh-article-page-wrap">
  <div class="gh-ins-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html#projects" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${isEn ? 'Back to Featured Projects' : 'العودة إلى المشاريع المميزة'}
    </a>
    <article>
      <header class="gh-article-header">
        <div class="gh-ins-proj-meta gh-ins-proj-meta--page">
          <span class="gh-ins-proj-dev">${esc(L(project.developer))}</span>
          <span class="gh-ins-proj-city">${esc(L(project.city))}</span>
        </div>
        <span class="gh-ins-cat">${esc(L(project.category))}</span>
        <h1>${L(project.title)}</h1>
        <p class="gh-dek">${L(project.excerpt)}</p>
        <p class="gh-ins-proj-name"><strong>${isEn ? 'Project' : 'المشروع'}:</strong> ${esc(L(project.projectName))}</p>
      </header>
      <img class="gh-article-hero-img" src="${p}${project.image}" alt="${esc(L(project.projectName))}" loading="lazy">
      ${services ? `<div class="gh-ins-proj-tags">${services}</div>` : ''}
      <div class="gh-article-body-wrap">
        ${bodyHtml}
        ${gallery ? `<div class="gh-ins-proj-gallery">${gallery}</div>` : ''}
        <div class="gh-article-footer-cta">
          <a href="${portfolioHref}" class="gh-btn-editorial gh-btn-editorial--outline">${isEn ? 'View in Portfolio' : 'في معرض الأعمال'}</a>
          <a href="${p}contact-us${isEn ? '-en' : ''}.html" class="gh-btn-editorial">${isEn ? 'Discuss Your Project' : 'ناقش مشروعك'}</a>
        </div>
      </div>
    </article>
  </div>
</main>
${prefixPaths(footer, depth)}
${tailScripts(depth)}`;

  fs.mkdirSync(path.join(ROOT, 'insights/projects'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'insights/projects', slug), html, 'utf8');
  console.log('  project:', slug);
}

function buildLaunchChecklist(lang) {
  const isEn = lang === 'en';
  const { header, footer } = getLayout(lang);
  const depth = 2;
  const items = isEn
    ? [
        'Project positioning and target buyer persona defined',
        'Sales timeline aligned with visual production schedule',
        'Master plan and key views approved for visualization',
        'Brand guidelines or visual direction document ready',
        'Hero renders planned for launch campaign',
        'Sales gallery or digital platform requirements clear',
        'Video / CGI film scope defined (length, language, channels)',
        'Interactive experience scope defined (if applicable)',
        'Maquette or physical model decision made',
        'Content approval workflow with stakeholders',
        'Launch checklist shared with sales team',
        'Post-launch asset update plan in place'
      ]
    : [
        'تحديد تموضع المشروع وشخصية المشتري المستهدف',
        'مواءمة جدول المبيعات مع خطة الإنتاج البصري',
        'اعتماد المخطط الرئيسي والزوايا الأساسية للإظهار',
        'جاهزية دليل الهوية أو التوجيه البصري',
        'تخطيط صور البطل (hero) لحملة الإطلاق',
        'وضوح متطلبات صالة البيع أو المنصة الرقمية',
        'تحديد نطاق الفيديو / الفيلم السينمائي (المدة، اللغة، القنوات)',
        'تحديد نطاق التجربة التفاعلية (إن وُجدت)',
        'قرار المجسم الفيزيائي أو النموذج الذكي',
        'مسار اعتماد المحتوى مع أصحاب المصلحة',
        'مشاركة قائمة الإطلاق مع فريق المبيعات',
        'خطة تحديث الأصول بعد الإطلاق'
      ];

  const listHtml = items
    .map(
      (t, i) =>
        `<li><input type="checkbox" id="c${i}"><label for="c${i}">${esc(t)}</label></li>`
    )
    .join('');

  const html = `${headBlock(lang, {
    depth: 2,
    title: isEn ? 'Visual Launch Readiness Checklist' : 'قائمة جاهزية الإطلاق البصري',
    description: isEn
      ? '12 essentials before your real estate visual launch.'
      : '12 بنداً أساسياً قبل الإطلاق البصري لمشروعك العقاري.',
    canonical: `https://3dgraphicshouse.com/insights/tools/launch-checklist${isEn ? '-en' : ''}.html`,
  })}
${prefixPaths(header, depth)}
<main class="gh-tool-page-wrap">
  <div class="gh-ins-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${backToInsights(isEn)}
    </a>
    <div class="gh-tool-main">
        <h1>${isEn ? 'Visual Launch Readiness Checklist' : 'قائمة جاهزية الإطلاق البصري'}</h1>
        <p class="gh-tool-intro">${isEn
    ? 'Use this checklist before your launch. Track progress, then print or share with your team.'
    : 'استخدم هذه القائمة قبل الإطلاق. تتبّع التقدم ثم اطبعها أو شاركها مع فريقك.'}</p>
        <div class="gh-progress-bar"><span></span></div>
        <ul class="gh-checklist" id="ghLaunchChecklist">${listHtml}</ul>
        <div class="gh-tool-actions gh-no-print">
          <button type="button" id="ghPrintChecklist" class="gh-btn-editorial gh-btn-editorial--outline">${isEn ? 'Print' : 'طباعة'}</button>
          <a href="../downloads/visual-launch-checklist${isEn ? '-en' : ''}.html" class="gh-btn-editorial">${isEn ? 'Download PDF' : 'تحميل PDF'}</a>
        </div>
    </div>
  </div>
</main>
${prefixPaths(footer, depth)}
<script defer src="../../assets/gh-launch-checklist.js?v=1"></script>
${tailScripts(depth)}`;

  const out = `insights/tools/launch-checklist${isEn ? '-en' : ''}.html`;
  fs.mkdirSync(path.join(ROOT, 'insights/tools'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, out), html, 'utf8');
  console.log('  tool:', out);
}

function buildSolutionFinder(lang) {
  const isEn = lang === 'en';
  const { header, footer } = getLayout(lang);

  const html = `${headBlock(lang, {
    depth: 2,
    title: isEn ? 'Which Solution Fits Your Project?' : 'أي حل يناسب مشروعك؟',
    description: isEn
      ? '7 questions to recommend GrowthLaunch, ProjectLaunch, or BrandScale — with service links.'
      : '7 أسئلة للتوصية بين GrowthLaunch وProjectLaunch وBrandScale — مع روابط للخدمات.',
    canonical: `https://3dgraphicshouse.com/insights/tools/solution-finder${isEn ? '-en' : ''}.html`,
  })}
${prefixPaths(header, 2)}
<main class="gh-tool-page-wrap">
  <div class="gh-ins-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${backToInsights(isEn)}
    </a>
    <div class="gh-tool-main">
        <h1>${isEn ? 'Which Solution Fits Your Project?' : 'أي حل يناسب مشروعك؟'}</h1>
        <p class="gh-tool-intro">${isEn
    ? 'Answer 7 quick questions. We will recommend the Graphics House solution that best matches your stage, goals, and visual needs.'
    : 'أجب على 7 أسئلة سريعة. سنقترح حل Graphics House الأنسب لمرحلتك وأهدافك واحتياجاتك البصرية.'}</p>
        <div id="ghSolutionFinder">
          <p class="gh-quiz-progress"></p>
          <div class="gh-quiz-steps"></div>
          <div class="gh-quiz-result" style="display:none"></div>
        </div>
    </div>
  </div>
</main>
${prefixPaths(footer, 2)}
<script defer src="../../assets/gh-solution-finder.js?v=2"></script>
${tailScripts(2)}`;

  const out = `insights/tools/solution-finder${isEn ? '-en' : ''}.html`;
  fs.writeFileSync(path.join(ROOT, out), html, 'utf8');
  console.log('  tool:', out);
}

function buildBriefTemplate(lang) {
  const isEn = lang === 'en';
  const { header, footer } = getLayout(lang);
  const fields = isEn
    ? [
        ['Project name', 'text', 'project_name'],
        ['Developer / company', 'text', 'company'],
        ['Project location', 'text', 'location'],
        ['Project type', 'select', 'type', ['Residential', 'Commercial', 'Mixed-use', 'Hospitality', 'Government', 'Other']],
        ['Sales stage', 'select', 'stage', ['Pre-launch', 'Active sales', 'Repositioning']],
        ['Target audience', 'textarea', 'audience'],
        ['Key deliverables needed', 'textarea', 'deliverables'],
        ['Launch date (if known)', 'text', 'launch_date'],
        ['Budget range (optional)', 'text', 'budget'],
        ['Additional notes', 'textarea', 'notes']
      ]
    : [
        ['اسم المشروع', 'text', 'project_name'],
        ['المطور / الشركة', 'text', 'company'],
        ['موقع المشروع', 'text', 'location'],
        ['نوع المشروع', 'select', 'type', ['سكني', 'تجاري', 'متعدد الاستخدام', 'ضيافة', 'حكومي', 'أخرى']],
        ['مرحلة البيع', 'select', 'stage', ['ما قبل الإطلاق', 'مبيعات نشطة', 'إعادة تموضع']],
        ['الجمهور المستهدف', 'textarea', 'audience'],
        ['المخرجات المطلوبة', 'textarea', 'deliverables'],
        ['تاريخ الإطلاق (إن وُجد)', 'text', 'launch_date'],
        ['نطاق الميزانية (اختياري)', 'text', 'budget'],
        ['ملاحظات إضافية', 'textarea', 'notes']
      ];

  const fieldsHtml = fields
    .map(([label, type, name, opts]) => {
      if (type === 'select') {
        return `<div class="gh-field"><label>${esc(label)}</label><select name="${name}"><option value="">—</option>${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>`;
      }
      if (type === 'textarea') {
        return `<div class="gh-field"><label>${esc(label)}</label><textarea name="${name}"></textarea></div>`;
      }
      return `<div class="gh-field"><label>${esc(label)}</label><input type="text" name="${name}"></div>`;
    })
    .join('');

  const html = `${headBlock(lang, {
    depth: 2,
    title: isEn ? 'Visual Project Brief Template' : 'نموذج Brief للمشروع البصري',
    description: isEn
      ? 'Fill this brief before your first meeting with Graphics House.'
      : 'عبّئ هذا النموذج قبل أول اجتماع مع فريق جرافيكس هاوس.',
    canonical: `https://3dgraphicshouse.com/insights/tools/project-brief${isEn ? '-en' : ''}.html`,
  })}
${prefixPaths(header, 2)}
<main class="gh-tool-page-wrap">
  <div class="gh-ins-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${backToInsights(isEn)}
    </a>
    <div class="gh-tool-main">
        <h1>${isEn ? 'Visual Project Brief Template' : 'نموذج Brief للمشروع البصري'}</h1>
        <p class="gh-tool-intro">${isEn
    ? 'Complete this form before your strategy session. Print it or copy the details into your enquiry.'
    : 'أكمل هذا النموذج قبل جلسة الاستراتيجية. اطبعه أو انسخ التفاصيل في استفسارك.'}</p>
        <form class="gh-brief-form" onsubmit="return false;">
          ${fieldsHtml}
        </form>
        <div class="gh-tool-actions gh-no-print">
          <button type="button" onclick="window.print()" class="gh-btn-editorial gh-btn-editorial--outline">${isEn ? 'Print' : 'طباعة'}</button>
          <a href="../downloads/visual-project-brief${isEn ? '-en' : ''}.html" class="gh-btn-editorial gh-btn-editorial--outline">${isEn ? 'Download PDF' : 'تحميل PDF'}</a>
          <a href="../../contact-us${isEn ? '-en' : ''}.html" class="gh-btn-editorial">${isEn ? 'Submit enquiry' : 'أرسل استفساراً'}</a>
        </div>
    </div>
  </div>
</main>
${prefixPaths(footer, 2)}
${tailScripts(2)}`;

  const out = `insights/tools/project-brief${isEn ? '-en' : ''}.html`;
  fs.writeFileSync(path.join(ROOT, out), html, 'utf8');
  console.log('  tool:', out);
}

function buildRedirects() {
  const pages = [
    ['insights/articles.html', 'index.html'],
    ['insights/news.html', 'index.html'],
    ['insights/case-studies.html', 'index.html'],
  ];
  for (const [file, target] of pages) {
    const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=${target}">
<link rel="canonical" href="https://3dgraphicshouse.com/insights/${target}">
<script>location.replace('${target}');</script>
</head><body><p><a href="${target}">Insights / رؤى</a></p></body></html>`;
    fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
    console.log('  redirect:', file, '→', target);
  }
}

function updateSitemap() {
  const smPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(smPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    'https://3dgraphicshouse.com/insights/index.html',
    'https://3dgraphicshouse.com/insights/index-en.html',
  ];
  for (const a of ARTICLES) {
    urls.push(`https://3dgraphicshouse.com/insights/articles/${a.slug}.html`);
    urls.push(`https://3dgraphicshouse.com/insights/articles/${a.slug}-en.html`);
  }
  for (const proj of PROJECTS) {
    urls.push(`https://3dgraphicshouse.com/insights/projects/${proj.slug}.html`);
    urls.push(`https://3dgraphicshouse.com/insights/projects/${proj.slug}-en.html`);
  }
  for (const t of DATA.tools) {
    urls.push(`https://3dgraphicshouse.com/insights/tools/${t.slug}.html`);
    urls.push(`https://3dgraphicshouse.com/insights/tools/${t.slug}-en.html`);
  }
  for (const loc of urls) {
    if (xml.includes(loc)) continue;
    xml = xml.replace(
      '</urlset>',
      `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.7</priority></url>\n</urlset>`
    );
  }
  xml = xml.replace(
    /<url><loc>https:\/\/3dgraphicshouse\.com\/blog\.html<\/loc>[\s\S]*?<\/url>/,
    `<url><loc>https://3dgraphicshouse.com/insights/index.html</loc><lastmod>${today}</lastmod><priority>0.75</priority></url>\n  <url><loc>https://3dgraphicshouse.com/blog.html</loc><lastmod>${today}</lastmod><priority>0.5</priority></url>`
  );
  fs.writeFileSync(smPath, xml, 'utf8');
  console.log('  sitemap updated');
}

console.log('Building Insights…');
fs.mkdirSync(path.join(ROOT, 'insights/articles'), { recursive: true });
['ar', 'en'].forEach((lang) => buildHub(lang));
ARTICLES.forEach((a) => {
  buildArticle(a, 'ar');
  buildArticle(a, 'en');
});
PROJECTS.forEach((proj) => {
  buildProject(proj, 'ar');
  buildProject(proj, 'en');
});
['ar', 'en'].forEach((lang) => {
  buildLaunchChecklist(lang);
  buildSolutionFinder(lang);
  buildBriefTemplate(lang);
});
buildRedirects();
updateSitemap();
console.log('Done.');
