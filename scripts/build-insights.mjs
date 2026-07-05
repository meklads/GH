#!/usr/bin/env node
/**
 * Build Knowledge Hub pages from insights/data/content.json
 * Run: node scripts/build-insights.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'insights/data/content.json'), 'utf8'));
const ARTICLES_DIR = path.join(ROOT, 'insights/data/articles');

function loadArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return DATA.articles || [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'));
  if (!files.length) return DATA.articles || [];
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

const ARTICLES = loadArticles();

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
<script src="${p}assets/gh-forms-config.js"></script>
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
<link rel="stylesheet" href="${p}assets/site-header.css?v=11">
<link rel="stylesheet" href="${p}assets/gh-site-enhancements.css?v=8">
<link rel="stylesheet" href="${p}assets/gh-insights.css?v=5">
<link rel="stylesheet" href="${p}assets/gh-float-widgets.css?v=2">
<script defer src="${p}assets/site-header.js?v=7"></script>
<script defer src="${p}assets/gh-performance.js?v=1"></script>
<script defer src="${p}assets/lang-switch.js?v=3"></script>
<style>
body.gh-insights{min-height:100vh;display:flex;flex-direction:column}
.gh-blog-wrap,.gh-article-page-wrap .gh-blog-wrap,.gh-tool-page-wrap .gh-blog-wrap{max-width:1180px;margin:0 auto;padding:0 24px}
</style>
</head>
<body class="gh-insights">`;
}

function tailScripts(depth) {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return `
<script defer src="${p}assets/gh-float-widgets.js?v=1"></script>
<script>
window.addEventListener("scroll",function(){var h=document.getElementById("header");if(h)h.classList.toggle("scrolled",window.scrollY>80)});
</script>
</body></html>`;
}

function newsletterBlock(lang, compact) {
  const isEn = lang === 'en';
  if (compact) {
    return `
<div class="gh-sidebar-block gh-sidebar-newsletter gh-no-print">
  <h3>${isEn ? 'Newsletter' : 'النشرة البريدية'}</h3>
  <p>${isEn ? 'Articles and tools in your inbox.' : 'مقالات وأدوات في بريدك.'}</p>
  <form class="gh-newsletter-form" data-gh-newsletter novalidate>
    <input type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
    <input type="email" name="email" placeholder="${isEn ? 'Email address' : 'البريد الإلكتروني'}" required autocomplete="email">
    <button type="submit">${isEn ? 'Subscribe' : 'اشترك'}</button>
    <div class="gh-turnstile"></div>
    <div class="gh-newsletter-msg" role="status"></div>
  </form>
</div>`;
  }
  return newsletterBlock(lang, true);
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

function sidebarBlock(lang, depth, activeTool) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const p = depth > 0 ? '../'.repeat(depth) : '';
  const prefix = depth === 2 ? '../' : '';

  const toolsHtml = DATA.tools
    .map((t) => {
      const href = `${prefix}tools/${t.slug}${isEn ? '-en' : ''}.html`;
      const active = activeTool === t.slug ? ' is-active' : '';
      return `<li><a href="${href}"${active ? ' class="is-active"' : ''}>
        <span class="material-symbols-outlined">${t.icon}</span>
        <span>
          <span class="gh-st-title">${L(t.title)}</span>
          <span class="gh-st-desc">${L(t.description)}</span>
        </span>
      </a></li>`;
    })
    .join('');

  const resources = DATA.resources || [];
  const resourcesHtml = resources.length
    ? `<div class="gh-sidebar-block">
    <h3>${isEn ? 'Free Resources' : 'موارد مجانية'}</h3>
    <ul class="gh-sidebar-tools">${resources
      .map((r) => {
        const href = `${p}${r.path}${isEn ? '-en' : ''}.html`;
        return `<li><a href="${href}">
        <span class="material-symbols-outlined">${r.icon}</span>
        <span>
          <span class="gh-st-title">${L(r.title)}</span>
          <span class="gh-st-desc">${L(r.description)}</span>
        </span>
      </a></li>`;
      })
      .join('')}</ul>
  </div>`
    : '';

  const nl = newsletterBlock(lang, true);

  return `
<aside class="gh-blog-sidebar gh-no-print">
  <div class="gh-sidebar-block">
    <h3>${isEn ? 'Practical Tools' : 'أدوات عملية'}</h3>
    <ul class="gh-sidebar-tools">${toolsHtml}</ul>
  </div>
  ${resourcesHtml}
  ${nl}
  <div class="gh-sidebar-block gh-sidebar-cta">
    <h3>${isEn ? 'Your Project' : 'مشروعك'}</h3>
    <p>${isEn ? 'Book a strategy session with our team.' : 'احجز جلسة استراتيجية مع فريقنا.'}</p>
    <a href="${p}contact-us${isEn ? '-en' : ''}.html" class="gh-btn-editorial gh-btn-editorial--light">${isEn ? 'Get in Touch' : 'تواصل معنا'}</a>
  </div>
</aside>
<script defer src="${p}assets/gh-newsletter.js?v=3"></script>`;
}

function buildHub(lang) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const { header, footer } = getLayout(lang);
  const featured = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.slug !== featured.slug);
  const p = '../';

  const featuredHtml = `
<article class="gh-editorial-featured">
  <a href="articles/${featured.slug}${isEn ? '-en' : ''}.html">
    <figure><img src="${p}${featured.image}" alt="${esc(L(featured.title))}" loading="lazy"></figure>
    <div class="gh-featured-copy">
      <span class="gh-eyebrow">${L(featured.category)} · ${isEn ? 'Featured' : 'مقال مميز'}</span>
      <h2>${L(featured.title)}</h2>
      <p class="gh-dek">${hubExcerpt(featured, lang)}</p>
      <span class="gh-byline">${L(featured.dateLabel)}</span>
      <span class="gh-read-link">${isEn ? 'Read Story' : 'اقرأ المقال'} <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span></span>
    </div>
  </a>
</article>`;

  const articlesHtml = rest
    .map(
      (a) => `
<article class="gh-post-row">
  <a href="articles/${a.slug}${isEn ? '-en' : ''}.html" class="gh-post-row-link">
    <img class="gh-post-thumb" src="${p}${a.image}" alt="${esc(L(a.title))}" loading="lazy">
    <div>
      <span class="gh-eyebrow">${L(a.category)}</span>
      <h3>${L(a.title)}</h3>
      <p>${hubExcerpt(a, lang)}</p>
      <time datetime="${a.date}">${L(a.dateLabel)}</time>
    </div>
  </a>
</article>`
    )
    .join('');

  const sidebar = sidebarBlock(lang, 1, null);

  const html = `${headBlock(lang, {
    depth: 1,
    title: isEn ? 'Journal' : 'مدونة',
    description: isEn
      ? 'Editorial articles on architectural visualization and real estate marketing in the GCC.'
      : 'مقالات تحريرية في الإظهار المعماري وتسويق المشاريع العقارية في الخليج.',
    canonical: `https://3dgraphicshouse.com/insights/${isEn ? 'index-en.html' : 'index.html'}`,
  })}
${prefixPaths(header, 1)}
<main class="gh-insights-page">
  <header class="gh-masthead">
    <span class="gh-kicker">Graphics House · ${isEn ? 'Insights' : 'رؤى ومعرفة'}</span>
    <h1>${isEn ? 'The GH Journal' : 'مدونة جرافيكس هاوس'}</h1>
    <p>${isEn
    ? 'Stories, guides, and practical tools for developers and marketing teams shaping major projects across Saudi Arabia and the GCC.'
    : 'قصص وأدلة وأدوات عملية للمطورين وفرق التسويق في المشاريع الكبرى بالسعودية والخليج.'}</p>
  </header>
  <div class="gh-blog-wrap">
    <div class="gh-blog-layout">
      <div class="gh-blog-main">
        ${featuredHtml}
        <section class="gh-latest">
          <h2 class="gh-section-label">${isEn ? 'Latest Articles' : 'أحدث المقالات'}</h2>
          ${articlesHtml}
        </section>
      </div>
      ${sidebar}
    </div>
  </div>
</main>
${prefixPaths(footer, 1)}
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

  const sidebar = sidebarBlock(lang, 2, null);

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
  <div class="gh-blog-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${isEn ? 'Back to Journal' : 'العودة للمدونة'}
    </a>
    <div class="gh-blog-layout">
      <article class="gh-blog-main">
        <header class="gh-article-header" style="padding:0;text-align:${isEn ? 'left' : 'right'};margin:0 0 28px">
          <span class="gh-eyebrow">${L(article.category)}</span>
          <h1>${L(article.title)}</h1>
          <p class="gh-dek" style="text-align:${isEn ? 'left' : 'right'}">${L(article.excerpt)}</p>
          <time class="gh-byline" datetime="${article.date}">${L(article.dateLabel)}</time>
        </header>
        <img class="gh-article-hero-img" src="${p}${article.image}" alt="${esc(L(article.title))}" loading="lazy">
        <div class="gh-article-body-wrap">
          ${bodyHtml}
          <div class="gh-article-footer-cta">
            <a href="${p}contact-us${isEn ? '-en' : ''}.html" class="gh-btn-editorial">${isEn ? 'Discuss Your Project' : 'ناقش مشروعك'}</a>
          </div>
        </div>
      </article>
      ${sidebar}
    </div>
  </div>
</main>
${prefixPaths(footer, depth)}
${tailScripts(depth)}`;

  fs.writeFileSync(path.join(ROOT, 'insights/articles', slug), html, 'utf8');
  console.log('  article:', slug);
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

  const sidebar = sidebarBlock(lang, 2, 'launch-checklist');

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
  <div class="gh-blog-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${isEn ? 'Back to Journal' : 'العودة للمدونة'}
    </a>
    <div class="gh-blog-layout">
      <div class="gh-blog-main gh-tool-main">
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
      ${sidebar}
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

  const sidebar = sidebarBlock(lang, 2, 'solution-finder');

  const html = `${headBlock(lang, {
    depth: 2,
    title: isEn ? 'Which Solution Fits Your Project?' : 'أي حل يناسب مشروعك؟',
    description: isEn
      ? '5 quick questions to recommend GrowthLaunch, ProjectLaunch, or BrandScale.'
      : '5 أسئلة سريعة للتوصية بين GrowthLaunch وProjectLaunch وBrandScale.',
    canonical: `https://3dgraphicshouse.com/insights/tools/solution-finder${isEn ? '-en' : ''}.html`,
  })}
${prefixPaths(header, 2)}
<main class="gh-tool-page-wrap">
  <div class="gh-blog-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${isEn ? 'Back to Journal' : 'العودة للمدونة'}
    </a>
    <div class="gh-blog-layout">
      <div class="gh-blog-main gh-tool-main">
        <h1>${isEn ? 'Which Solution Fits Your Project?' : 'أي حل يناسب مشروعك؟'}</h1>
        <p class="gh-tool-intro">${isEn
    ? 'Answer 5 quick questions. We will recommend the Graphics House solution that best matches your stage and goals.'
    : 'أجب على 5 أسئلة سريعة. سنقترح حل Graphics House الأنسب لمرحلتك وأهدافك.'}</p>
        <div id="ghSolutionFinder">
          <p class="gh-quiz-progress"></p>
          <div class="gh-quiz-steps"></div>
          <div class="gh-quiz-result" style="display:none"></div>
        </div>
      </div>
      ${sidebar}
    </div>
  </div>
</main>
${prefixPaths(footer, 2)}
<script defer src="../../assets/gh-solution-finder.js?v=1"></script>
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

  const sidebar = sidebarBlock(lang, 2, 'project-brief');

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
  <div class="gh-blog-wrap">
    <a href="../${isEn ? 'index-en' : 'index'}.html" class="gh-back-link">
      <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
      ${isEn ? 'Back to Journal' : 'العودة للمدونة'}
    </a>
    <div class="gh-blog-layout">
      <div class="gh-blog-main gh-tool-main">
        <h1>${isEn ? 'Visual Project Brief Template' : 'نموذج Brief للمشروع البصري'}</h1>
        <p class="gh-tool-intro">${isEn
    ? 'Complete this form before your strategy session. Print it or copy the details into your enquiry.'
    : 'أكمل هذا النموذج قبل جلسة الاستراتيجية. اطبعه أو انسخ التفاصيل في استفسارك.'}</p>
        <form class="gh-brief-form" onsubmit="return false;">
          ${fieldsHtml}
        </form>
        <div class="gh-tool-actions gh-no-print">
          <button type="button" onclick="window.print()" class="gh-btn-editorial gh-btn-editorial--outline">${isEn ? 'Print' : 'طباعة'}</button>
          <a href="../../contact-us${isEn ? '-en' : ''}.html" class="gh-btn-editorial">${isEn ? 'Submit enquiry' : 'أرسل استفساراً'}</a>
        </div>
      </div>
      ${sidebar}
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
</head><body><p><a href="${target}">مركز المعرفة / Knowledge Hub</a></p></body></html>`;
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

console.log('Building Knowledge Hub…');
fs.mkdirSync(path.join(ROOT, 'insights/articles'), { recursive: true });
['ar', 'en'].forEach((lang) => buildHub(lang));
ARTICLES.forEach((a) => {
  buildArticle(a, 'ar');
  buildArticle(a, 'en');
});
['ar', 'en'].forEach((lang) => {
  buildLaunchChecklist(lang);
  buildSolutionFinder(lang);
  buildBriefTemplate(lang);
});
buildRedirects();
updateSitemap();
console.log('Done.');
