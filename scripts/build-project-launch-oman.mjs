#!/usr/bin/env node
/**
 * ProjectLaunch™ Oman — geo commercial LP (AR + EN)
 * Narrative: Saudi launch track record → Oman expansion.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';
import { getLayout } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'solutions');
const BASE = 'https://3dgraphicshouse.com';
const DEPTH = 1;
const P = '../';

const COPY = {
  en: {
    title: 'ProjectLaunch™ Oman | Off-Plan Visual Launch for Developers',
    description:
      'Oman developers need investor-ready launch assets without vendor fragmentation. ProjectLaunch™ from Graphics House: identity, archviz, smart maquettes, sales gallery, and install. Al Khod, Muscat.',
    kicker: 'Flagship solution · Oman',
    h1: 'Sell the masterplan before concrete',
    lead: 'Saudi launch track record. Muscat team on the ground. One visual system for brokers, investors, and buyers.',
    sub: 'From <a href="../insights/projects/anan-eskan-riyadh-en.html">Anan Eskan</a> and <a href="../insights/projects/al-owla-nakheel-en.html">Al Oula</a> in Saudi Arabia to our office in Al Khod, Al Seeb, we bring ProjectLaunch™ to Omani developers who need identity, films, maquettes, and a sales gallery that holds up in the room.',
    ctaPrimary: 'Book an Oman launch session',
    ctaSecondary: 'View Muscat office',
    ctaFull: 'See full ProjectLaunch™ system',
    bridgeTitle: 'The problem: strong land, weak launch pack',
    bridgeBody:
      'Many Oman projects reach sales with scattered renders, no gallery story, and different vendors for film, model, and fit-out. We built launch systems across Saudi Arabia for developers and institutions, including <a href="../insights/projects/makkah-charter-mwl-en.html">MWL Makkah Charter</a>. The same method now runs from <a href="../locations/oman-en.html">Muscat</a>: one studio, one visual language, local contact.',
    proofTitle: 'Proof from markets that demand fast persuasion',
    includesTitle: 'What you take to market',
    includes: [
      ['Architectural identity', 'Positioning and visual language from first glance to the sales floor'],
      ['Photoreal renders and CGI films', '<a href="../services/rendering-en.html">Archviz</a> and <a href="../services/cinematic-cgi-en.html">cinematic content</a> that explains the masterplan before handover'],
      ['Smart maquettes', '<a href="../services/maquettes-en.html">Tangible models</a> with lighting and interaction for investor days'],
      ['Interactive sales tools', '<a href="../services/interactive-experiences-en.html">Unit and plan selection</a> that moves buyers toward a decision'],
      ['Sales-gallery décor', '<a href="../services/branding-en.html">Spatial staging</a> that presents every visual asset. Gallery finishes can align with <a href="https://turriva.com" target="_blank" rel="noopener noreferrer">Turriva</a> when specs lock'],
      ['Photography, install, and handover', 'On-site delivery via <a href="../services/production-en.html">Dot4Life production</a> with team training'],
    ],
    whyTitle: 'Why Oman developers choose one launch studio',
    why: [
      ['Local office in Muscat', '<a href="../locations/oman-en.html">Al Khod, Al Seeb</a>, CR 1460078, direct Oman line'],
      ['Saudi-proven method', 'The same ProjectLaunch™ system used on major GCC masterplan launches'],
      ['One studio, no fragmentation', 'Render, film, maquette, and interactive under one identity'],
      ['Built for off-plan', 'Assets for brokers, investors, and buyers before handover. Market tours on <a href="https://ruwaq.co/tours" target="_blank" rel="noopener noreferrer">Ruwaq</a> show the bar buyers expect'],
    ],
    casesTitle: 'Selected proof',
    faqTitle: 'Questions before you book',
    faqs: [
      [
        'Is ProjectLaunch™ Oman different from the full system?',
        'Same system, scoped for Oman projects with Muscat contact and GCC production support. See the full <a href="../solutions/project-launch-en.html">ProjectLaunch™ page</a>.',
      ],
      [
        'Do you install in Oman?',
        'Yes. Décor, screens, maquettes, and interactive systems are installed and handed over with sales-team training.',
      ],
      [
        'We already have a marketing agency. Do we still need this?',
        'Usually yes. Agencies move the message. ProjectLaunch™ builds the launch product: visual language, gallery, and sales experience. Campaign films can extend via <a href="https://beesmotion.com" target="_blank" rel="noopener noreferrer">Bees Motion</a> after assets lock.',
      ],
    ],
    finalTitle: 'Is your Oman project launch-ready?',
    finalBody: 'Tell us about the development. We respond within 24 hours with a free assessment session, no obligation.',
    phoneLabel: 'Call Oman',
    waLabel: 'WhatsApp Oman',
  },
  ar: {
    title: 'ProjectLaunch™ عُمان | إطلاق بصري للمشاريع على الخارطة',
    description:
      'مطورو عُمان يحتاجون أصول إطلاق جاهزة للمستثمر بلا تفتيت بين موردين. ProjectLaunch™ من Graphics House: هوية، تصور، مجسمات ذكية، صالة بيع، وتركيب. الخوض، مسقط.',
    kicker: 'الحل الرائد · عُمان',
    h1: 'بِع المخطط الرئيسي قبل الخرسانة',
    lead: 'سجل إطلاق في السعودية. فريق في مسقط. نظام بصري واحد للوسيط والمستثمر والمشتري.',
    sub: 'من <a href="../insights/projects/anan-eskan-riyadh.html">عنان إسكان</a> و<a href="../insights/projects/al-owla-nakheel.html">الأولى</a> في السعودية إلى مكتبنا في الخوض، السيب، نقدّم ProjectLaunch™ للمطورين العمانيين الذين يحتاجون هوية وأفلاماً ومجسمات وصالة بيع تثبت في الغرفة.',
    ctaPrimary: 'احجز جلسة إطلاق لعُمان',
    ctaSecondary: 'مكتب مسقط',
    ctaFull: 'شاهد نظام ProjectLaunch™ الكامل',
    bridgeTitle: 'المشكلة: أرض قوية، حزمة إطلاق ضعيفة',
    bridgeBody:
      'كثير من مشاريع عُمان تصل للمبيعات برندرات متفرقة، بلا سرد للصالة، وموردين مختلفين للفيلم والمجسم والتشطيب. بنينا أنظمة إطلاق عبر السعودية، منها <a href="../insights/projects/makkah-charter-mwl.html">ميثاق مكة للرابطة</a>. نفس المنهج يعمل من <a href="../locations/oman.html">مسقط</a>: استوديو واحد، لغة بصرية واحدة، تواصل محلي.',
    proofTitle: 'دليل من أسواق تطلب إقناعاً سريعاً',
    includesTitle: 'ماذا تأخذ إلى السوق',
    includes: [
      ['هوية معمارية', 'تموضع ولغة بصرية من أول نظرة حتى صالة البيع'],
      ['رندر وأفلام CGI', '<a href="../services/rendering.html">تصور معماري</a> و<a href="../services/cinematic-cgi.html">محتوى سينمائي</a> يشرح المخطط قبل التسليم'],
      ['مجسمات ذكية', '<a href="../services/maquettes.html">نماذج ملموسة</a> بإضاءة وتفاعل لأيام المستثمر'],
      ['أدوات مبيعات تفاعلية', '<a href="../services/interactive-experiences.html">اختيار وحدات ومخططات</a> يقرّب من قرار الشراء'],
      ['ديكور صالة البيع', '<a href="../services/branding.html">تجهيز مكاني</a> يعرض كل أصل بصري. تشطيب الصالة يمكن مواءمته مع <a href="https://turriva.com" target="_blank" rel="noopener noreferrer">توريفا</a> بعد قفل المواصفات'],
      ['تصوير وتركيب وتسليم', 'تنفيذ ميداني عبر <a href="../services/production.html">إنتاج Dot4Life</a> مع تدريب الفريق'],
    ],
    whyTitle: 'لماذا يختار مطورو عُمان استوديو إطلاق واحد',
    why: [
      ['مكتب محلي في مسقط', '<a href="../locations/oman.html">الخوض، السيب</a>، س.ت 1460078، خط عُمان مباشر'],
      ['منهج مثبت في السعودية', 'نفس نظام ProjectLaunch™ في إطلاقات مخططات خليجية كبرى'],
      ['استوديو واحد بلا تشتت', 'رندر وفيلم ومجسم وتفاعلي بهوية واحدة'],
      ['مصمم لـ off-plan', 'أصول للوسيط والمستثمر والمشتري قبل التسليم. جولات <a href="https://ruwaq.co/tours" target="_blank" rel="noopener noreferrer">Ruwaq</a> تُظهر مستوى توقع المشتري'],
    ],
    casesTitle: 'نماذج إثبات',
    faqTitle: 'أسئلة قبل الحجز',
    faqs: [
      [
        'هل ProjectLaunch™ عُمان مختلف عن النظام الكامل؟',
        'نفس النظام، بإطار أولويات لمشاريع عُمان وتواصل محلي في مسقط. راجع <a href="../solutions/project-launch.html">صفحة ProjectLaunch™</a>.',
      ],
      [
        'هل تنفّذون التركيب في عُمان؟',
        'نعم. الديكور والشاشات والمجسمات والأنظمة التفاعلية تُركَّب وتُسلَّم مع تدريب فريق المبيعات.',
      ],
      [
        'لدينا وكالة تسويق. هل ما زلنا نحتاج هذا؟',
        'غالباً نعم. الوكالة تحرّك الرسالة. ProjectLaunch™ يبني منتج الإطلاق: اللغة البصرية والصالة وتجربة البيع. أفلام الحملة يمكن توسيعها عبر <a href="https://beesmotion.com" target="_blank" rel="noopener noreferrer">بيزموشن</a> بعد قفل الأصول.',
      ],
    ],
    finalTitle: 'هل مشروعك في عُمان جاهز للإطلاق؟',
    finalBody: 'أخبرنا عن المشروع. نرد خلال 24 ساعة بجلسة تقييم مجانية، بلا التزام.',
    phoneLabel: 'اتصل بعُمان',
    waLabel: 'واتساب عُمان',
  },
};

function page(lang) {
  const isEn = lang === 'en';
  const t = COPY[lang];
  const { header, footer } = getLayout(lang, DEPTH);
  const slug = isEn ? 'project-launch-oman-en' : 'project-launch-oman';
  const canonical = `${BASE}/solutions/${slug}.html`;
  const altEn = `${BASE}/solutions/project-launch-oman-en.html`;
  const altAr = `${BASE}/solutions/project-launch-oman.html`;
  const contact = `${P}contact-us${isEn ? '-en' : ''}.html`;
  const omanLoc = `${P}locations/oman${isEn ? '-en' : ''}.html`;
  const fullPl = `${P}solutions/project-launch${isEn ? '-en' : ''}.html`;
  const phone = '+96891326735';
  const wa = 'https://wa.me/96891326735';

  const includes = t.includes
    .map(
      ([h, d]) => `<li class="pl-oman-item"><strong>${h}</strong><span>${d}</span></li>`
    )
    .join('');
  const why = t.why
    .map(([h, d]) => `<div class="pl-oman-why"><h3>${h}</h3><p>${d}</p></div>`)
    .join('');
  const faqs = t.faqs
    .map(
      ([q, a]) => `<details class="pl-oman-faq"><summary>${q}</summary><p>${a}</p></details>`
    )
    .join('');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'ProjectLaunch™ Oman',
    provider: {
      '@type': 'Organization',
      name: 'Graphics House',
      url: BASE,
    },
    areaServed: { '@type': 'Country', name: 'Oman' },
    url: canonical,
    description: t.description,
  };

  return `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${lang}">
<head>
<script src="${P}assets/gh-forms-config.js"></script>
${analyticsHeadTags(P)}
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="ar" href="${altAr}">
<link rel="alternate" hreflang="x-default" href="${altEn}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t.title}</title>
<meta name="description" content="${t.description}">
<meta property="og:title" content="${t.title}">
<meta property="og:description" content="${t.description}">
<meta property="og:image" content="${BASE}/assets/news/makkah-charter-04.jpeg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link rel="apple-touch-icon" href="${P}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="${P}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${P}assets/site-header.css?v=35">
<link rel="stylesheet" href="${P}assets/gh-site-enhancements.css?v=28">
<link rel="stylesheet" href="${P}assets/gh-solution-light.css?v=12">
<link rel="stylesheet" href="${P}assets/gh-float-widgets.css?v=8">
<style>
.pl-oman{--gold:#C9A84C;--ink:#0A0A0A;--muted:rgba(250,250,248,.62);background:#0A0A0A;color:#FAFAF8}
.pl-oman-hero{padding:clamp(72px,12vw,120px) 24px 64px;max-width:1100px;margin:0 auto}
.pl-oman-kicker{display:inline-block;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;font-weight:700}
.pl-oman-hero h1{font-family:'Playfair Display',serif;font-size:clamp(34px,5vw,56px);line-height:1.12;margin:0 0 16px;font-weight:700}
.pl-oman-lead{font-size:clamp(18px,2.2vw,22px);color:rgba(255,255,255,.88);margin:0 0 12px;max-width:720px}
.pl-oman-sub{font-size:16px;line-height:1.75;color:var(--muted);margin:0 0 28px;max-width:720px}
.pl-oman-cta{display:flex;flex-wrap:wrap;gap:12px}
.pl-oman-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;transition:.25s}
.pl-oman-btn--gold{background:var(--gold);color:#0A0A0A}
.pl-oman-btn--gold:hover{background:#d9b860}
.pl-oman-btn--ghost{border:1px solid rgba(201,168,76,.45);color:#FAFAF8}
.pl-oman-btn--ghost:hover{border-color:var(--gold);color:var(--gold)}
.pl-oman-section{padding:72px 24px;max-width:1100px;margin:0 auto;border-top:1px solid rgba(201,168,76,.18)}
.pl-oman-section h2{font-family:'Playfair Display',serif;font-size:clamp(26px,3.5vw,38px);margin:0 0 18px}
.pl-oman-section p{color:var(--muted);line-height:1.8;font-size:16px;max-width:760px}
.pl-oman-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:28px}
.pl-oman-card{border:1px solid rgba(201,168,76,.2);border-radius:16px;overflow:hidden;background:rgba(255,255,255,.02)}
.pl-oman-card img{width:100%;height:180px;object-fit:cover;display:block}
.pl-oman-card figcaption{padding:14px 16px;font-size:13px;color:rgba(255,255,255,.75)}
.pl-oman-list{list-style:none;padding:0;margin:24px 0 0;display:grid;gap:14px}
.pl-oman-item{display:grid;gap:4px;padding:16px 18px;border:1px solid rgba(201,168,76,.18);border-radius:12px;background:rgba(201,168,76,.04)}
.pl-oman-item strong{color:#FAFAF8;font-size:15px}
.pl-oman-item span{color:var(--muted);font-size:14px;line-height:1.6}
.pl-oman-why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.pl-oman-why{padding:20px;border-radius:14px;border:1px solid rgba(201,168,76,.2);background:rgba(255,255,255,.02)}
.pl-oman-why h3{margin:0 0 8px;font-size:16px;color:#FAFAF8}
.pl-oman-why p{margin:0;font-size:14px;color:var(--muted);line-height:1.65}
.pl-oman-faq{border-bottom:1px solid rgba(201,168,76,.2);padding:14px 0}
.pl-oman-faq summary{cursor:pointer;font-weight:600;color:#FAFAF8}
.pl-oman-faq p{margin:10px 0 0;color:var(--muted)}
.pl-oman-final{text-align:center}
.pl-oman-final .pl-oman-cta{justify-content:center}
@media(max-width:640px){.pl-oman-hero{padding-top:88px}}
</style>
<script defer src="${P}assets/site-header.js?v=16"></script>
<script defer src="${P}assets/gh-cta-track.js?v=1"></script>
<script defer src="${P}assets/lang-switch.js?v=3"></script>
<script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body class="pl-oman">
${header}
<main>
  <section class="pl-oman-hero">
    <span class="pl-oman-kicker">${t.kicker}</span>
    <h1>${t.h1}</h1>
    <p class="pl-oman-lead">${t.lead}</p>
    <p class="pl-oman-sub">${t.sub}</p>
    <div class="pl-oman-cta">
      <a class="pl-oman-btn pl-oman-btn--gold" href="${contact}">${t.ctaPrimary}</a>
      <a class="pl-oman-btn pl-oman-btn--ghost" href="${omanLoc}">${t.ctaSecondary}</a>
      <a class="pl-oman-btn pl-oman-btn--ghost" href="${fullPl}">${t.ctaFull}</a>
    </div>
  </section>

  <section class="pl-oman-section">
    <h2>${t.bridgeTitle}</h2>
    <p>${t.bridgeBody}</p>
  </section>

  <section class="pl-oman-section">
    <h2>${t.proofTitle}</h2>
    <div class="pl-oman-grid">
      <figure class="pl-oman-card"><img src="${P}assets/projects/rendering/Anan-Escan-Co.01.jpeg" alt="Anan Eskan" loading="lazy"><figcaption>Anan Eskan · ${isEn ? 'Residential launch' : 'إطلاق سكني'}</figcaption></figure>
      <figure class="pl-oman-card"><img src="${P}assets/news/makkah-charter-04.jpeg" alt="Makkah Charter" loading="lazy"><figcaption>MWL · ${isEn ? 'Smart maquette & interactive' : 'مجسم ذكي وتفاعلي'}</figcaption></figure>
      <figure class="pl-oman-card"><img src="${P}assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg" alt="Al Oula" loading="lazy"><figcaption>Al Oula · ${isEn ? 'Archviz that sells the unbuilt' : 'إظهار يبيع ما لم يُبنَ'}</figcaption></figure>
    </div>
  </section>

  <section class="pl-oman-section">
    <h2>${t.includesTitle}</h2>
    <ul class="pl-oman-list">${includes}</ul>
  </section>

  <section class="pl-oman-section">
    <h2>${t.whyTitle}</h2>
    <div class="pl-oman-why-grid">${why}</div>
  </section>

  <section class="pl-oman-section">
    <h2>${t.faqTitle}</h2>
    ${faqs}
  </section>

  <section class="pl-oman-section pl-oman-final">
    <h2>${t.finalTitle}</h2>
    <p style="margin:0 auto 24px">${t.finalBody}</p>
    <div class="pl-oman-cta">
      <a class="pl-oman-btn pl-oman-btn--gold" href="${contact}">${t.ctaPrimary}</a>
      <a class="pl-oman-btn pl-oman-btn--ghost" href="tel:${phone}">${t.phoneLabel}</a>
      <a class="pl-oman-btn pl-oman-btn--ghost" href="${wa}" target="_blank" rel="noopener noreferrer">${t.waLabel}</a>
    </div>
  </section>
</main>
${footer}
<script defer src="${P}assets/gh-float-widgets.js?v=8"></script>
</body>
</html>`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const lang of ['ar', 'en']) {
  const name = lang === 'en' ? 'project-launch-oman-en.html' : 'project-launch-oman.html';
  fs.writeFileSync(path.join(OUT, name), page(lang), 'utf8');
  console.log('Wrote solutions/' + name);
}

// Append to sitemap if missing
const smPath = path.join(ROOT, 'sitemap.xml');
if (fs.existsSync(smPath)) {
  let xml = fs.readFileSync(smPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  for (const suffix of ['', '-en']) {
    const loc = `${BASE}/solutions/project-launch-oman${suffix}.html`;
    if (!xml.includes(loc)) {
      xml = xml.replace(
        '</urlset>',
        `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n</urlset>`
      );
    }
  }
  fs.writeFileSync(smPath, xml, 'utf8');
  console.log('Sitemap: ProjectLaunch Oman URLs ensured');
}
