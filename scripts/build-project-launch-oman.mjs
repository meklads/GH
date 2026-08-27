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
    title: 'ProjectLaunch™ Oman | Visual Launch System for Developers',
    description:
      'ProjectLaunch™ for Oman developers: Saudi launch expertise brought to Muscat — identity, CGI, smart maquettes, interactive sales, and gallery décor. Graphics House, Al Khod.',
    kicker: 'Flagship solution · Oman',
    h1: 'ProjectLaunch™ for Oman',
    lead: 'Saudi launch expertise. Local Muscat presence. One visual system that sells before concrete.',
    sub: 'From major Saudi developments to our office in Al Khod, Al Seeb — we bring ProjectLaunch™ to Omani developers who need investor-ready identity, films, maquettes, and a sales gallery that closes.',
    ctaPrimary: 'Book an Oman launch session',
    ctaSecondary: 'View Muscat office',
    ctaFull: 'See full ProjectLaunch™ system',
    bridgeTitle: 'From Saudi Arabia to Oman',
    bridgeBody:
      'We spent years building launch systems for developers and institutions across Saudi Arabia — Anan Eskan, Al Oula, Makkah Charter for the Muslim World League, and more. That same method now serves Oman: one studio, one visual language, local contact in Muscat.',
    proofTitle: 'Proof from markets that demand persuasion',
    includesTitle: 'What ProjectLaunch™ includes',
    includes: [
      ['Complete visual identity', 'Architectural language from first glance to the sales floor'],
      ['Photoreal renders & CGI films', 'Content that wins investors before concrete is poured'],
      ['Smart maquettes', 'Tangible presence with lighting and interaction when it matters'],
      ['Interactive experiences', 'Unit and plan selection that moves buyers toward a decision'],
      ['Sales-gallery décor', 'Spatial staging that presents every visual asset'],
      ['Photography, install & handover', 'On-site delivery with team readiness'],
    ],
    whyTitle: 'Why Oman developers choose this path',
    why: [
      ['Local office in Muscat', 'Al Khod, Al Seeb — CR 1460078 — direct Oman line'],
      ['Saudi-proven method', 'The same ProjectLaunch™ system used on major GCC launches'],
      ['One studio, no fragmentation', 'Render, film, maquette, and platform under one identity'],
      ['Built for off-plan', 'Assets designed for brokers, investors, and buyers before handover'],
    ],
    casesTitle: 'Selected proof',
    faqTitle: 'Questions before you book',
    faqs: [
      [
        'Is ProjectLaunch™ Oman different from the full system?',
        'Same system — scoped and prioritized for Oman projects, with local Muscat contact and GCC production support.',
      ],
      [
        'Do you install in Oman?',
        'Yes. Décor, screens, maquettes, and interactive systems can be installed and handed over with training.',
      ],
      [
        'We already have a marketing agency — do we still need this?',
        'Usually yes. Agencies move the message. ProjectLaunch™ builds the launch product itself — the visual language and sales experience.',
      ],
    ],
    finalTitle: 'Is your Oman project launch-ready?',
    finalBody: 'Tell us about the development. We respond within 24 hours — free assessment session, no obligation.',
    phoneLabel: 'Call Oman',
    waLabel: 'WhatsApp Oman',
  },
  ar: {
    title: 'ProjectLaunch™ عُمان | نظام الإطلاق البصري للمطورين',
    description:
      'ProjectLaunch™ للمطورين في عُمان: خبرة الإطلاق من السعودية إلى مسقط — هوية، CGI، مجسمات ذكية، مبيعات تفاعلية، وديكور صالة البيع. جرافيكس هاوس، الخوض.',
    kicker: 'الحل الرائد · عُمان',
    h1: 'ProjectLaunch™ لعُمان',
    lead: 'خبرة إطلاق سعودية. تواجد محلي في مسقط. نظام بصري واحد يبيع قبل الخرسانة.',
    sub: 'من مشاريع كبرى في السعودية إلى مكتبنا في الخوض، السيب — نقدّم ProjectLaunch™ للمطورين العمانيين الذين يحتاجون هوية جاهزة للمستثمر، أفلاماً، مجسمات، وصالة بيع تُقنع وتُغلق.',
    ctaPrimary: 'احجز جلسة إطلاق لعُمان',
    ctaSecondary: 'مكتب مسقط',
    ctaFull: 'شاهد نظام ProjectLaunch™ الكامل',
    bridgeTitle: 'من السعودية إلى عُمان',
    bridgeBody:
      'بنينا أنظمة إطلاق لمطورين ومؤسسات عبر السعودية — عنان إسكان، الأولى، ميثاق مكة لرابطة العالم الإسلامي وغيرها. نفس المنهج يخدم عُمان اليوم: استوديو واحد، لغة بصرية واحدة، وتواصل محلي في مسقط.',
    proofTitle: 'دليل من أسواق تطلب إقناعاً سريعاً',
    includesTitle: 'ماذا يشمل ProjectLaunch™',
    includes: [
      ['هوية بصرية كاملة', 'لغة معمارية من أول نظرة حتى صالة البيع'],
      ['رندر وأفلام CGI', 'محتوى يُقنع المستثمر قبل صب الخرسانة'],
      ['مجسمات ذكية', 'حضور ملموس مع إضاءة وتفاعل عند الحاجة'],
      ['تجارب تفاعلية', 'اختيار وحدات ومخططات يُقرّب من قرار الشراء'],
      ['ديكور صالة البيع', 'تجهيز مكاني يعرض كل أصل بصري'],
      ['تصوير وتركيب وتسليم', 'تنفيذ ميداني مع جاهزية الفريق'],
    ],
    whyTitle: 'لماذا يختار مطورو عُمان هذا المسار',
    why: [
      ['مكتب محلي في مسقط', 'الخوض، السيب — س.ت 1460078 — خط عُمان مباشر'],
      ['منهج مثبت في السعودية', 'نفس نظام ProjectLaunch™ في إطلاقات خليجية كبرى'],
      ['استوديو واحد بلا تشتت', 'رندر وفيلم ومجسم ومنصة بهوية واحدة'],
      ['مصمم لـ off-plan', 'أصول للوسيط والمستثمر والمشتري قبل التسليم'],
    ],
    casesTitle: 'نماذج إثبات',
    faqTitle: 'أسئلة قبل الحجز',
    faqs: [
      [
        'هل ProjectLaunch™ عُمان مختلف عن النظام الكامل؟',
        'نفس النظام — بإطار أولويات لمشاريع عُمان، وتواصل محلي في مسقط ودعم إنتاج خليجي.',
      ],
      [
        'هل تنفّذون التركيب في عُمان؟',
        'نعم. الديكور والشاشات والمجسمات والأنظمة التفاعلية يمكن تركيبها وتسليمها مع تدريب الفريق.',
      ],
      [
        'لدينا وكالة تسويق — هل ما زلنا نحتاج هذا؟',
        'غالباً نعم. الوكالة تحرّك الرسالة. ProjectLaunch™ يبني منتج الإطلاق نفسه — اللغة البصرية وتجربة البيع.',
      ],
    ],
    finalTitle: 'هل مشروعك في عُمان جاهز للإطلاق؟',
    finalBody: 'أخبرنا عن المشروع. نرد خلال 24 ساعة — جلسة تقييم مجانية بلا التزام.',
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
