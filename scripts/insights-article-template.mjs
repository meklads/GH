/**
 * Viral B2B article template helpers for build-insights.mjs
 */

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function richText(s) {
  const str = String(s || '');
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out += esc(str.slice(last, m.index));
    const label = esc(m[1]);
    const href = m[2];
    const isAbsolute = /^https?:\/\//i.test(href);
    const isSameSite = /^https?:\/\/(www\.)?3dgraphicshouse\.com(\/|$)/i.test(href);
    const attrs = isAbsolute && !isSameSite ? ' target="_blank" rel="noopener noreferrer"' : '';
    out += `<a href="${esc(href)}"${attrs}>${label}</a>`;
    last = m.index + m[0].length;
  }
  if (last < str.length) out += esc(str.slice(last));
  return out;
}

function renderBodyBlock(block) {
  if (typeof block === 'string') return `<p>${richText(block)}</p>`;
  const text = block.text || '';
  switch (block.type) {
    case 'p':
      return `<p>${richText(text)}</p>`;
    case 'h2':
      return `<h2>${richText(text)}</h2>`;
    case 'h3':
      return `<h3>${richText(text)}</h3>`;
    case 'ul':
      return `<ul>${(block.items || []).map((i) => `<li>${richText(i)}</li>`).join('')}</ul>`;
    case 'ol':
      return `<ol>${(block.items || []).map((i) => `<li>${richText(i)}</li>`).join('')}</ol>`;
    case 'callout':
      return `<div class="gh-art-callout" role="note"><p>${richText(text)}</p></div>`;
    case 'table': {
      const headers = block.headers || [];
      const rows = block.rows || [];
      const cap = block.caption ? `<caption>${richText(block.caption)}</caption>` : '';
      const head = headers.length
        ? `<thead><tr>${headers.map((h) => `<th scope="col">${richText(h)}</th>`).join('')}</tr></thead>`
        : '';
      const body = rows.length
        ? `<tbody>${rows.map((row) => `<tr>${row.map((c) => `<td>${richText(c)}</td>`).join('')}</tr>`).join('')}</tbody>`
        : '';
      return `<div class="gh-art-table-wrap"><table class="gh-art-table">${cap}${head}${body}</table></div>`;
    }
    case 'cta':
      return `<div class="gh-art-mid-cta">
        <h3>${richText(block.title || '')}</h3>
        <p>${richText(block.text || '')}</p>
        <div class="gh-art-mid-cta-actions">
          <a href="${esc(block.href || '#')}" class="gh-btn-editorial">${richText(block.btn || 'Learn more')}</a>
        </div>
      </div>`;
    default:
      return text ? `<p>${richText(text)}</p>` : '';
  }
}

/** Render body with h2 ids + TOC entries; inject default mid-CTA after 4th h2 if none in body. */
export function renderArticleBody(body, { isEn, depthPrefix, midCtaHtml }) {
  const toc = [];
  let h2Index = 0;
  let h2Seen = 0;
  let midCtaInserted = false;
  const hasCtaBlock = (body || []).some((b) => b.type === 'cta');
  const parts = [];

  for (const block of body || []) {
    if (block.type === 'h2') {
      h2Index += 1;
      h2Seen += 1;
      const id = `gh-toc-${h2Index}`;
      toc.push({ id, text: block.text || '' });
      parts.push(`<h2 id="${id}">${richText(block.text || '')}</h2>`);
      if (!hasCtaBlock && !midCtaInserted && h2Seen === 4 && midCtaHtml) {
        parts.push(midCtaHtml);
        midCtaInserted = true;
      }
      continue;
    }
    parts.push(renderBodyBlock(block));
  }

  if (!hasCtaBlock && !midCtaInserted && midCtaHtml && h2Seen >= 2) {
    parts.push(midCtaHtml);
  }

  return { html: parts.join('\n'), toc };
}

export function tldrBlock(tldr, isEn) {
  if (!tldr) return '';
  const text = isEn ? tldr.en : tldr.ar;
  if (!text) return '';
  const label = isEn ? 'TL;DR' : 'ملخص سريع';
  return `<div class="gh-art-tldr">
    <p class="gh-art-tldr-label"><span class="material-symbols-outlined" aria-hidden="true">bolt</span> ${label}</p>
    <p>${richText(text)}</p>
  </div>`;
}

export function directAnswerBlock(direct, isEn) {
  if (!direct) return '';
  const text = isEn ? direct.en : direct.ar;
  if (!text) return '';
  const label = isEn ? 'Quick answer' : 'إجابة مباشرة';
  return `<div class="gh-art-direct">
    <p class="gh-art-direct-label"><span class="material-symbols-outlined" aria-hidden="true">check_circle</span> ${label}</p>
    <p>${richText(text)}</p>
  </div>`;
}

export function tocHtml(toc, isEn, { mobile = false } = {}) {
  if (!toc.length) return '';
  const label = isEn ? 'In this article' : 'في هذا المقال';
  const items = toc
    .map((t) => `<li><a href="#${esc(t.id)}">${richText(t.text)}</a></li>`)
    .join('');
  if (mobile) {
    return `<details class="gh-art-toc-mobile">
      <summary><span class="material-symbols-outlined" aria-hidden="true">format_list_bulleted</span> ${label}</summary>
      <ol>${items}</ol>
    </details>`;
  }
  return `<nav class="gh-art-sidebar-block" aria-label="${esc(label)}">
    <p class="gh-art-sidebar-title"><span class="material-symbols-outlined" aria-hidden="true">format_list_bulleted</span> ${label}</p>
    <ol class="gh-art-sidebar-toc">${items}</ol>
  </nav>`;
}

export function shareBarHtml(pageUrl, title, isEn) {
  const encUrl = encodeURIComponent(pageUrl);
  const encTitle = encodeURIComponent(title);
  const wa = `https://wa.me/?text=${encTitle}%20${encUrl}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
  const tw = `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`;
  const label = isEn ? 'Share' : 'شارك';
  const copyLabel = isEn ? 'Copy link' : 'نسخ الرابط';
  const copied = isEn ? 'Link copied' : 'تم نسخ الرابط';
  const waLabel = isEn ? 'WhatsApp' : 'واتساب';
  const liLabel = 'LinkedIn';
  const xLabel = 'X';
  return `<div class="gh-art-share" role="group" aria-label="${esc(label)}">
    <span class="gh-art-share-label">${label}</span>
    <a class="gh-art-share-btn" href="${li}" target="_blank" rel="noopener noreferrer" aria-label="${liLabel}">
      <span class="material-symbols-outlined" aria-hidden="true">share</span><span>${liLabel}</span>
    </a>
    <a class="gh-art-share-btn" href="${tw}" target="_blank" rel="noopener noreferrer" aria-label="${xLabel}">
      <span class="material-symbols-outlined" aria-hidden="true">tag</span><span>${xLabel}</span>
    </a>
    <a class="gh-art-share-btn" href="${wa}" target="_blank" rel="noopener noreferrer" aria-label="${waLabel}">
      <span class="material-symbols-outlined" aria-hidden="true">chat</span><span>${waLabel}</span>
    </a>
    <button type="button" class="gh-art-share-btn" data-gh-copy-link data-copied-label="${esc(copied)}" aria-label="${esc(copyLabel)}">
      <span class="material-symbols-outlined" aria-hidden="true">link</span><span>${copyLabel}</span>
    </button>
  </div>`;
}

const SIDEBAR_SERVICES = [
  {
    icon: 'rocket_launch',
    title: { ar: 'ProjectLaunch™', en: 'ProjectLaunch™' },
    desc: {
      ar: 'نظام إطلاق off-plan متكامل — رندرات، فيلم، صالة بيع.',
      en: 'Integrated off-plan launch — renders, film, sales gallery.',
    },
    href: 'solutions/project-launch',
  },
  {
    icon: 'imagesmode',
    title: { ar: 'الإظهار المعماري', en: 'Archviz & Renders' },
    desc: {
      ar: 'رندرات خارجية وداخلية وفق مواصفات المشروع.',
      en: 'Exterior and interior renders to spec.',
    },
    href: 'services/rendering',
  },
  {
    icon: 'home_work',
    title: { ar: 'المجسمات المعمارية', en: 'Scale Models' },
    desc: {
      ar: 'مجسمات لصالات البيع ولقاءات المستثمرين.',
      en: 'Models for galleries and investor meetings.',
    },
    href: 'services/maquettes',
  },
  {
    icon: 'slow_motion_video',
    title: { ar: 'أفلام CGI سينمائية', en: 'Cinematic CGI' },
    desc: {
      ar: 'أفلام إطلاق وجولات متحركة للمشاريع الكبرى.',
      en: 'Launch films and walkthroughs for major schemes.',
    },
    href: 'services/animation',
  },
];

export function sidebarServicesHtml(isEn, depthPrefix) {
  const suffix = isEn ? '-en.html' : '.html';
  const label = isEn ? 'Our services' : 'خدماتنا';
  const promos = SIDEBAR_SERVICES.map(
    (s) => `<a href="${depthPrefix}${s.href}${suffix}" class="gh-art-sidebar-promo">
      <span class="gh-art-sidebar-promo-icon"><span class="material-symbols-outlined" aria-hidden="true">${s.icon}</span></span>
      <span class="gh-art-sidebar-promo-body">
        <strong>${isEn ? s.title.en : s.title.ar}</strong>
        <span>${isEn ? s.desc.en : s.desc.ar}</span>
      </span>
    </a>`
  ).join('');
  return `<div class="gh-art-sidebar-block">
    <p class="gh-art-sidebar-title"><span class="material-symbols-outlined" aria-hidden="true">design_services</span> ${label}</p>
    ${promos}
  </div>`;
}

export function sidebarToolHtml(isEn, depthPrefix) {
  const suffix = isEn ? '-en.html' : '.html';
  const title = isEn ? 'Launch readiness checklist' : 'قائمة جاهزية الإطلاق';
  const sub = isEn ? 'Free interactive tool — 12 essentials' : 'أداة تفاعلية مجانية — 12 بنداً';
  return `<a href="${depthPrefix}insights/tools/launch-checklist${suffix}" class="gh-art-sidebar-block gh-art-sidebar-tool">
    <span class="material-symbols-outlined" aria-hidden="true">checklist</span>
    <strong>${title}</strong>
    <span>${sub}</span>
  </a>`;
}

export function sidebarContactHtml(isEn, depthPrefix) {
  const suffix = isEn ? '-en.html' : '.html';
  const text = isEn
    ? 'Planning a GCC launch? Talk to our team.'
    : 'تخطط لإطلاق في الخليج؟ تحدث مع فريقنا.';
  const btn = isEn ? 'Book a consultation' : 'احجز استشارة';
  return `<div class="gh-art-sidebar-block gh-art-sidebar-contact">
    <p>${text}</p>
    <a href="${depthPrefix}contact-us${suffix}" class="gh-btn-editorial">${btn}</a>
  </div>`;
}

export function pickRelatedArticles(current, allArticles, count = 3) {
  const others = allArticles.filter((a) => a.slug !== current.slug);
  const sameCat = others.filter(
    (a) => a.category?.en === current.category?.en || a.category?.ar === current.category?.ar
  );
  const pool = sameCat.length >= count ? sameCat : others;
  return pool.slice(0, count);
}

export function relatedArticlesMainHtml(related, lang, depthPrefix) {
  const isEn = lang === 'en';
  if (!related.length) return '';
  const L = (key) => (isEn ? key.en : key.ar);
  const title = isEn ? 'Continue reading' : 'تابع القراءة';
  const cards = related
    .map((a) => {
      const href = `${depthPrefix}insights/articles/${a.slug}${isEn ? '-en' : ''}.html`;
      return `<a href="${href}" class="gh-art-related-card">
        <img src="${depthPrefix}${a.image}" alt="" loading="lazy">
        <div class="gh-art-related-card-body">
          <span class="gh-ins-cat">${esc(L(a.category))}</span>
          <h3>${esc(L(a.title))}</h3>
        </div>
      </a>`;
    })
    .join('');
  return `<section class="gh-art-related" aria-label="${esc(title)}">
    <h2>${title}</h2>
    <div class="gh-art-related-grid">${cards}</div>
  </section>`;
}

export function sidebarRelatedHtml(related, lang, depthPrefix) {
  const isEn = lang === 'en';
  if (!related.length) return '';
  const L = (key) => (isEn ? key.en : key.ar);
  const label = isEn ? 'Related articles' : 'مقالات ذات صلة';
  const links = related
    .map((a) => {
      const href = `${depthPrefix}insights/articles/${a.slug}${isEn ? '-en' : ''}.html`;
      return `<li><a href="${href}">${esc(L(a.title))}</a></li>`;
    })
    .join('');
  return `<nav class="gh-art-sidebar-block" aria-label="${esc(label)}">
    <p class="gh-art-sidebar-title"><span class="material-symbols-outlined" aria-hidden="true">auto_stories</span> ${label}</p>
    <ol class="gh-art-sidebar-toc">${links}</ol>
  </nav>`;
}

export function defaultMidCta(isEn, depthPrefix) {
  const suffix = isEn ? '-en.html' : '.html';
  if (isEn) {
    return `<div class="gh-art-mid-cta">
      <h3>Launching in the next 6 months?</h3>
      <p>Map your visual assets to your sales timeline with ProjectLaunch™ — renders, film, gallery, and launch content from one GCC team.</p>
      <div class="gh-art-mid-cta-actions">
        <a href="${depthPrefix}solutions/project-launch-en.html" class="gh-btn-editorial">Explore ProjectLaunch™</a>
        <a href="${depthPrefix}contact-us-en.html" class="gh-btn-editorial gh-btn-editorial--outline">Discuss your project</a>
      </div>
    </div>`;
  }
  return `<div class="gh-art-mid-cta">
    <h3>تطلق خلال الستة أشهر القادمة؟</h3>
    <p>اربط أصولك البصرية بجدول المبيعات عبر ProjectLaunch™ — رندرات، فيلم، صالة بيع، ومحتوى إطلاق من فريق واحد في الخليج.</p>
    <div class="gh-art-mid-cta-actions">
      <a href="${depthPrefix}solutions/project-launch.html" class="gh-btn-editorial">اكتشف ProjectLaunch™</a>
      <a href="${depthPrefix}contact-us.html" class="gh-btn-editorial gh-btn-editorial--outline">ناقش مشروعك</a>
    </div>
  </div>`;
}

export function midCtaFromArticle(article, isEn, depthPrefix) {
  const cta = article.midCta;
  if (!cta) return defaultMidCta(isEn, depthPrefix);
  const L = (k) => (isEn ? k.en : k.ar);
  const title = L(cta.title || {});
  const text = L(cta.text || {});
  const btn = L(cta.btn || {});
  const href = cta.href?.[isEn ? 'en' : 'ar'] || cta.href || '#';
  const prefix = href.startsWith('http') ? '' : depthPrefix;
  const btn2 = cta.btn2 ? L(cta.btn2) : '';
  const href2Raw = cta.href2?.[isEn ? 'en' : 'ar'] || cta.href2 || '';
  const href2Prefix = href2Raw.startsWith('http') ? '' : depthPrefix;
  const btn2Html = btn2 && href2Raw
    ? `<a href="${href2Prefix}${href2Raw}" class="gh-btn-editorial gh-btn-editorial--outline">${richText(btn2)}</a>`
    : '';
  return `<div class="gh-art-mid-cta">
    <h3>${richText(title)}</h3>
    <p>${richText(text)}</p>
    <div class="gh-art-mid-cta-actions">
      <a href="${prefix}${href}" class="gh-btn-editorial">${richText(btn)}</a>
      ${btn2Html}
    </div>
  </div>`;
}

export function breadcrumbHtml(article, isEn, depthPrefix) {
  const hub = isEn ? 'Insights' : 'الرؤى';
  const hubHref = `${depthPrefix}insights/${isEn ? 'index-en' : 'index'}.html`;
  const cat = isEn ? article.category.en : article.category.ar;
  const title = isEn ? article.title.en : article.title.ar;
  const sep = isEn ? '/' : '◂';
  return `<nav class="gh-art-breadcrumb" aria-label="${isEn ? 'Breadcrumb' : 'مسار التنقل'}">
    <a href="${hubHref}">${hub}</a>
    <span aria-hidden="true">${sep}</span>
    <span class="gh-art-breadcrumb-cat">${esc(cat)}</span>
    <span aria-hidden="true">${sep}</span>
    <span class="gh-art-breadcrumb-current" aria-current="page">${esc(title.length > 48 ? `${title.slice(0, 45)}…` : title)}</span>
  </nav>`;
}

export function authorBylineHtml(isEn) {
  const name = isEn ? 'Graphics House Insights' : 'فريق رؤى Graphics House';
  const role = isEn ? 'GCC architectural visualization & launch strategy' : 'إظهار معماري واستراتيجية إطلاق في الخليج';
  return `<div class="gh-art-author">
    <div class="gh-art-author-avatar" aria-hidden="true">GH</div>
    <div class="gh-art-author-meta">
      <strong>${name}</strong>
      <span>${role}</span>
    </div>
  </div>`;
}

export function socialProofStrip(isEn) {
  if (isEn) {
    return `<div class="gh-art-proof" role="note">
      <span><strong>15+ years</strong> in GCC archviz</span>
      <span><strong>500+</strong> projects delivered</span>
      <span><strong>4</strong> regional studios</span>
    </div>`;
  }
  return `<div class="gh-art-proof" role="note">
    <span><strong>+15 سنة</strong> في الإظهار بالخليج</span>
    <span><strong>500+</strong> مشروع</span>
    <span><strong>4</strong> مكاتب إقليمية</span>
  </div>`;
}

export function takeawaysBlock(takeaways, isEn) {
  if (!takeaways) return '';
  const items = isEn ? takeaways.en : takeaways.ar;
  if (!items?.length) return '';
  const label = isEn ? 'Key takeaways' : 'أبرز النقاط';
  const lis = items.map((i) => `<li>${richText(i)}</li>`).join('');
  return `<div class="gh-art-takeaways">
    <p class="gh-art-takeaways-label"><span class="material-symbols-outlined" aria-hidden="true">stars</span> ${label}</p>
    <ul>${lis}</ul>
  </div>`;
}

export function sidebarNewsletterHtml(isEn) {
  const title = isEn ? 'Launch insights' : 'رؤى الإطلاق';
  const sub = isEn ? 'Monthly GCC archviz & sales tips — no spam.' : 'نصائح شهرية للإطلاق البصري — بدون إزعاج.';
  const ph = isEn ? 'Your email' : 'بريدك';
  const btn = isEn ? 'Subscribe' : 'اشترك';
  return `<div class="gh-art-sidebar-block gh-art-sidebar-newsletter">
    <p class="gh-art-sidebar-title"><span class="material-symbols-outlined" aria-hidden="true">mail</span> ${title}</p>
    <p class="gh-art-sidebar-newsletter-sub">${sub}</p>
    <form class="gh-art-newsletter-form" data-gh-newsletter novalidate>
      <input type="email" name="email" placeholder="${ph}" required autocomplete="email" aria-label="${ph}">
      <button type="submit">${btn}</button>
    </form>
  </div>`;
}

export function articleProgressBar() {
  return '<div class="gh-art-progress" aria-hidden="true"><span></span></div>';
}

export function articleGraphSchema(article, lang, pageUrl) {
  const isEn = lang === 'en';
  const L = (key) => (isEn ? key.en : key.ar);
  const articleNode = {
    '@type': 'Article',
    headline: L(article.title),
    description: L(article.metaDescription || article.excerpt),
    image: `https://3dgraphicshouse.com/${article.image}`,
    datePublished: `${article.date}-01`,
    dateModified: `${article.date}-15`,
    author: {
      '@type': 'Person',
      name: isEn ? 'Graphics House Insights Team' : 'فريق رؤى Graphics House',
      jobTitle: isEn ? 'Architectural Visualization Strategists' : 'استراتيجيون الإظهار المعماري',
      worksFor: { '@type': 'Organization', name: 'Graphics House', url: 'https://3dgraphicshouse.com' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Graphics House',
      logo: { '@type': 'ImageObject', url: 'https://3dgraphicshouse.com/assets/favicon/og-image.png' },
    },
    mainEntityOfPage: pageUrl,
    inLanguage: isEn ? 'en' : 'ar',
  };
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'الرئيسية', item: 'https://3dgraphicshouse.com/' },
      { '@type': 'ListItem', position: 2, name: isEn ? 'Insights' : 'الرؤى', item: `https://3dgraphicshouse.com/insights/${isEn ? 'index-en.html' : 'index.html'}` },
      { '@type': 'ListItem', position: 3, name: L(article.title), item: pageUrl },
    ],
  };
  const nodes = [articleNode, breadcrumb];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}

export function faqAccordionHtml(faq, isEn) {
  if (!faq || !faq.length) return '';
  const L = (key) => (isEn ? key.en : key.ar);
  const items = faq
    .map((item) => {
      const q = L(item.q || item.question || {});
      const a = L(item.a || item.answer || {});
      if (!q || !a) return '';
      return `<details class="gh-ins-faq-item">
        <summary class="gh-ins-faq-q">${esc(q)}</summary>
        <p class="gh-ins-faq-a">${richText(a)}</p>
      </details>`;
    })
    .filter(Boolean)
    .join('');
  if (!items) return '';
  const label = isEn ? 'FAQ' : 'أسئلة شائعة';
  return `<section class="gh-ins-faq gh-ins-faq--accordion" aria-label="${esc(label)}">
    <h2>${label}</h2>
    ${items}
  </section>`;
}

export function articleSidebarHtml({ toc, related, isEn, depthPrefix }) {
  return `<aside class="gh-article-sidebar" aria-label="${isEn ? 'Article sidebar' : 'الشريط الجانبي'}">
    <div class="gh-art-sidebar-inner">
      ${tocHtml(toc, isEn)}
      ${sidebarServicesHtml(isEn, depthPrefix)}
      ${sidebarRelatedHtml(related, isEn, depthPrefix)}
      ${sidebarToolHtml(isEn, depthPrefix)}
      ${sidebarNewsletterHtml(isEn)}
      ${sidebarContactHtml(isEn, depthPrefix)}
    </div>
  </aside>`;
}
