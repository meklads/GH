#!/usr/bin/env node
/**
 * Institutional events conversion LP (AR + EN)
 * Angle: idea ownership + full execution under time pressure → ProjectLaunch™
 * Proof: MWL Ramadan Forum / Makkah Charter delivery.
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
const HERO = 'assets/insights/reports/mwl-ramadan-forum-maquette-full.jpg';
const PROOF = 'assets/news/mwl-ramadan-forum-maquette-vip.jpeg';

const COPY = {
  en: {
    title: 'Institutional Events Under Time Pressure | ProjectLaunch™ | Graphics House',
    description:
      'Graphics House owns décor and interactive display ideas — and executes them fully under severe timelines. ProjectLaunch™ for forums, exhibitions, and protocol VIP walkthroughs in Saudi Arabia.',
    kicker: 'ProjectLaunch™ · Institutional events',
    h1: 'We own the idea.<br>We ship it under pressure.',
    lead: 'When the guest path includes a Secretary General and multinational media, décor is not decoration — it is the briefing system.',
    sub: 'Graphics House designs the exhibition concept and executes it end to end: interactive maquette, screens, control programs, and spatial install — with acceptance before first-guest day.',
    ctaPrimary: 'Book a readiness session',
    ctaSecondary: 'See ProjectLaunch™',
    ctaReport: 'Read the Ramadan Forum report',
    ctaCase: 'Open the MWL case study',
    pressureTitle: 'Time pressure is not an excuse for a weaker vision',
    pressureBody:
      'High-level institutional calendars compress install, content lock, and protocol rehearsal into days — not months. The easy path shrinks the idea. Our path keeps design ambition and accelerates disciplined execution from one studio.',
    pointsTitle: 'What “behind the success” means',
    points: [
      ['Idea ownership', 'Décor, design, and interactive experience authored — not subcontracted into fragments'],
      ['Full execution', 'Maquette, large displays, control tablets, press and photo programs — one handover'],
      ['Protocol readiness', 'Guest path, lighting, and fallback tested before VIP walkthrough'],
      ['Acceptance that closes', 'Vision that earns high-level praise — not just a installed screen'],
    ],
    proofTitle: 'Proof: Muslim World League — Ramadan Forum, Jeddah',
    proofBody:
      'We delivered the exhibition system for the League’s side: interactive maquette of flagship projects worldwide, detail screen, lighting control, world-press interactive program, and commemorative photo experience — under severe time pressure, with personal praise from H.E. the Secretary General.',
    servicesTitle: 'The services that make this repeatable',
    services: [
      ['ProjectLaunch™', 'solutions/project-launch-en.html', 'Readiness frame: lock message, pack assets, rehearse acceptance'],
      ['Maquettes', 'services/maquettes-en.html', 'Smart interactive models as the briefing point'],
      ['Interactive experiences', 'services/interactive-experiences-en.html', 'Screens and host/control programs'],
      ['Branding & install', 'services/branding-en.html', 'Spatial décor with visual consistency'],
      ['Jeddah', 'locations/jeddah-en.html', 'On-ground planning for Gulf host-city events'],
    ],
    faqTitle: 'Before you book',
    faqs: [
      [
        'Is this only for real-estate launches?',
        'No. The same ProjectLaunch™ readiness logic fits institutional forums, association exhibitions, and protocol VIP tours — where the “product” is initiatives and documents, not units.',
      ],
      [
        'Can you work inside a compressed calendar?',
        'Yes — when idea and build sit with one studio. Split vendors burn the schedule on coordination; we spend it on quality.',
      ],
      [
        'Where do I see the delivery record?',
        'Start with the Ramadan Forum visual report and the Makkah Charter / MWL case study — then book a session for your next event.',
      ],
    ],
    finalTitle: 'Next institutional date on the calendar?',
    finalBody: 'Send the occasion, guest profile, and install window. We reply within 24 hours with a readiness path — no obligation.',
    waLabel: 'WhatsApp',
    phoneLabel: 'Call Jeddah',
  },
  ar: {
    title: 'فعاليات مؤسسية تحت ضغط الزمن | ProjectLaunch™ | Graphics House',
    description:
      'Graphics House تملك أفكار الديكور والعرض التفاعلي وتنفّذها بالكامل تحت جداول زمنية ضاغطة. ProjectLaunch™ للملتقيات والمعارض وجولات VIP في السعودية.',
    kicker: 'ProjectLaunch™ · فعاليات مؤسسية',
    h1: 'نملك الفكرة.<br>ونسلّمها تحت الضغط.',
    lead: 'عندما يضم مسار الضيف أميناً عاماً ووكالات أنباء متعددة الجنسيات، الديكور ليس زينة — هو نظام الإحاطة.',
    sub: 'Graphics House تصوغ مفهوم المعرض وتنفّذه من طرف واحد: مجسم تفاعلي، شاشات، برامج تحكم، وتركيب مكاني — مع بروفة قبول قبل يوم الضيف الأول.',
    ctaPrimary: 'احجز جلسة جاهزية',
    ctaSecondary: 'تعرّف على ProjectLaunch™',
    ctaReport: 'اقرأ تقرير الملتقى الرمضاني',
    ctaCase: 'افتح دراسة حالة الرابطة',
    pressureTitle: 'ضغط الزمن لا يبرّر ضعفاً في الرؤية',
    pressureBody:
      'جداول الفعاليات المؤسسية الرفيعة تضغط التركيب وقفل المحتوى وبروفة البروتوكول في أيام لا أشهر. السهل اختصار الفكرة. مسارنا الإبقاء على طموح التصميم مع تسريع تنفيذ منضبط من استوديو واحد.',
    pointsTitle: 'ماذا يعني «وراء النجاح»؟',
    points: [
      ['ملكية الفكرة', 'ديكور وتصميم وتجربة تفاعلية من مصدر واحد — لا تفتت بين مقاولين'],
      ['تنفيذ كامل', 'مجسم، شاشات عرض، تابلت تحكم، برامج صحافة وصور — تسليم واحد'],
      ['جاهزية بروتوكول', 'مسار الضيف والإضاءة والنسخة الاحتياطية تُختبر قبل جولة VIP'],
      ['قبول يُغلق الحلقة', 'رؤية تنال إشادة رفيعة — لا مجرد شاشة مركّبة'],
    ],
    proofTitle: 'دليل: رابطة العالم الإسلامي — الملتقى الرمضاني، جدة',
    proofBody:
      'نفّذنا نظام العرض لجانب الرابطة: مجسم تفاعلي لأبرز مشاريعها حول العالم، شاشة تفاصيل، تحكم إضاءة، برنامج صحافة عالمية، وتجربة صور تذكارية — تحت ضغط زمني شديد، مع إشادة شخصية من معالي الأمين العام.',
    servicesTitle: 'الخدمات التي تجعل التسليم قابلاً للتكرار',
    services: [
      ['ProjectLaunch™', 'solutions/project-launch.html', 'إطار الجاهزية: قفل الرسالة، حزم الأصول، بروفة القبول'],
      ['المجسمات', 'services/maquettes.html', 'مجسمات ذكية تفاعلية كنقطة شرح'],
      ['التجارب التفاعلية', 'services/interactive-experiences.html', 'شاشات وبرامج تحكم وعرض'],
      ['الهوية والتركيب', 'services/branding.html', 'ديكور واتساق بصري للمكان'],
      ['جدة', 'locations/jeddah.html', 'تخطيط ميداني لفعاليات مدينة الاستضافة'],
    ],
    faqTitle: 'قبل الحجز',
    faqs: [
      [
        'هل هذا لإطلاقات عقارية فقط؟',
        'لا. نفس منطق جاهزية ProjectLaunch™ يناسب الملتقيات المؤسسية ومعارض الجمعيات وجولات VIP — حيث «المنتج» مبادرات ووثائق لا وحدات.',
      ],
      [
        'هل تعملون تحت جدول مضغوط؟',
        'نعم — عندما تكون الفكرة والتنفيذ عند استوديو واحد. تفتيت المسؤولية يحرق الزمن في التنسيق؛ نحن نصرفه على الجودة.',
      ],
      [
        'أين أرى سجل التسليم؟',
        'ابدأ بتقرير الملتقى الرمضاني ودراسة حالة ميثاق مكة / الرابطة — ثم احجز جلسة لفعاليتك القادمة.',
      ],
    ],
    finalTitle: 'موعد مؤسسي قادم في الأجندة؟',
    finalBody: 'أرسل المناسبة وملف الضيف ونافذة التركيب. نرد خلال 24 ساعة بمسار جاهزية — بلا التزام.',
    waLabel: 'واتساب',
    phoneLabel: 'اتصل بجدة',
  },
};

function page(lang) {
  const isEn = lang === 'en';
  const t = COPY[lang];
  const { header, footer } = getLayout(lang, DEPTH);
  const slug = isEn ? 'institutional-events-en.html' : 'institutional-events.html';
  const canonical = `${BASE}/solutions/${slug}`;
  const altEn = `${BASE}/solutions/institutional-events-en.html`;
  const altAr = `${BASE}/solutions/institutional-events.html`;
  const contact = `${P}contact-us${isEn ? '-en' : ''}.html`;
  const fullPl = `${P}solutions/project-launch${isEn ? '-en' : ''}.html`;
  const report = `${P}insights/reports/mwl-ramadan-forum-visual-report${isEn ? '-en' : ''}.html`;
  const casestudy = `${P}insights/projects/makkah-charter-mwl${isEn ? '-en' : ''}.html`;
  const phone = '+966502786513';
  const wa = `https://wa.me/966502786513?text=${encodeURIComponent(
    isEn
      ? 'Hello Graphics House — institutional event / ProjectLaunch readiness'
      : 'مرحباً Graphics House — فعالية مؤسسية / جاهزية ProjectLaunch'
  )}`;

  const points = t.points
    .map(
      ([title, body]) =>
        `<article class="ie-card"><h3>${title}</h3><p>${body}</p></article>`
    )
    .join('');
  const services = t.services
    .map(
      ([name, href, body]) =>
        `<a class="ie-svc" href="${P}${href}"><strong>${name}</strong><span>${body}</span></a>`
    )
    .join('');
  const faqs = t.faqs
    .map(
      ([q, a]) =>
        `<details class="ie-faq"><summary>${q}</summary><p>${a}</p></details>`
    )
    .join('');

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isEn ? 'Institutional Events — ProjectLaunch™' : 'فعاليات مؤسسية — ProjectLaunch™',
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: 'SA',
    url: canonical,
    description: t.description,
    image: `${BASE}/${HERO}`,
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'ar'}" dir="${isEn ? 'ltr' : 'rtl'}">
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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
<meta property="og:image" content="${BASE}/${HERO}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="${P}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${P}assets/site-header.css?v=35">
<link rel="stylesheet" href="${P}assets/gh-site-enhancements.css?v=28">
<link rel="stylesheet" href="${P}assets/gh-float-widgets.css?v=8">
<style>
.ie{--gold:#C9A84C;--ink:#0A0A0A;--paper:#FAFAF8;--muted:rgba(250,250,248,.68);background:#0A0A0A;color:var(--paper)}
.ie-hero{position:relative;min-height:100svh;display:flex;align-items:flex-end;isolation:isolate}
.ie-hero-media{position:absolute;inset:0;z-index:0}
.ie-hero-media img{width:100%;height:100%;object-fit:cover;object-position:center 70%;display:block}
.ie-hero-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.35) 0%,rgba(10,10,10,.78) 55%,rgba(10,10,10,.94) 100%);z-index:1}
.ie-hero-copy{position:relative;z-index:2;width:100%;max-width:1100px;margin:0 auto;padding:clamp(100px,14vw,140px) 24px 56px}
.ie-kicker{display:inline-block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:14px}
.ie-hero h1{font-family:'Playfair Display',serif;font-size:clamp(34px,5.4vw,58px);line-height:1.12;margin:0 0 16px;font-weight:700;max-width:16ch}
.ie-lead{font-size:clamp(17px,2.1vw,21px);color:rgba(255,255,255,.92);margin:0 0 12px;max-width:38rem;line-height:1.55}
.ie-sub{font-size:15px;line-height:1.75;color:var(--muted);margin:0 0 28px;max-width:40rem}
.ie-cta{display:flex;flex-wrap:wrap;gap:12px}
.ie-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;transition:.25s}
.ie-btn--gold{background:var(--gold);color:#0A0A0A}
.ie-btn--gold:hover{background:#d9b860}
.ie-btn--ghost{border:1px solid rgba(201,168,76,.5);color:#FAFAF8}
.ie-btn--ghost:hover{border-color:var(--gold);color:var(--gold)}
.ie-section{padding:72px 24px;max-width:1100px;margin:0 auto;border-top:1px solid rgba(201,168,76,.16)}
.ie-section h2{font-family:'Playfair Display',serif;font-size:clamp(26px,3.4vw,38px);margin:0 0 16px}
.ie-section>p{color:var(--muted);line-height:1.8;font-size:16px;max-width:760px;margin:0}
.ie-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:28px}
.ie-card{padding:20px;border-radius:14px;border:1px solid rgba(201,168,76,.2);background:rgba(255,255,255,.02)}
.ie-card h3{margin:0 0 8px;font-size:16px;color:#FAFAF8}
.ie-card p{margin:0;font-size:14px;color:var(--muted);line-height:1.65}
.ie-proof{display:grid;gap:24px;margin-top:28px}
@media(min-width:860px){.ie-proof{grid-template-columns:1.1fr .9fr;align-items:center}}
.ie-proof img{width:100%;height:auto;border-radius:4px;border:1px solid rgba(201,168,76,.2);display:block;background:#111}
.ie-proof-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.ie-svc-grid{display:grid;gap:12px;margin-top:24px}
.ie-svc{display:grid;gap:4px;padding:16px 18px;border:1px solid rgba(201,168,76,.18);border-radius:12px;text-decoration:none;background:rgba(201,168,76,.04);transition:.2s}
.ie-svc:hover{border-color:var(--gold)}
.ie-svc strong{color:#FAFAF8;font-size:15px}
.ie-svc span{color:var(--muted);font-size:14px;line-height:1.55}
.ie-faq{border-bottom:1px solid rgba(201,168,76,.2);padding:14px 0}
.ie-faq summary{cursor:pointer;font-weight:600;color:#FAFAF8}
.ie-faq p{margin:10px 0 0;color:var(--muted);line-height:1.7}
.ie-final{text-align:center}
.ie-final .ie-cta{justify-content:center}
.ie-final p{margin:0 auto 24px}
</style>
<script defer src="${P}assets/site-header.js?v=16"></script>
<script defer src="${P}assets/gh-cta-track.js?v=1"></script>
<script defer src="${P}assets/lang-switch.js?v=3"></script>
<script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body class="ie" data-gh-solution="institutional-events">
${header}
<main>
  <section class="ie-hero">
    <div class="ie-hero-media" aria-hidden="true">
      <img src="${P}${HERO}" alt="" fetchpriority="high">
    </div>
    <div class="ie-hero-scrim" aria-hidden="true"></div>
    <div class="ie-hero-copy">
      <span class="ie-kicker">${t.kicker}</span>
      <h1>${t.h1}</h1>
      <p class="ie-lead">${t.lead}</p>
      <p class="ie-sub">${t.sub}</p>
      <div class="ie-cta">
        <a class="ie-btn ie-btn--gold" href="${contact}" data-gh-cta="institutional_events_primary">${t.ctaPrimary}</a>
        <a class="ie-btn ie-btn--ghost" href="${fullPl}" data-gh-cta="institutional_events_pl">${t.ctaSecondary}</a>
      </div>
    </div>
  </section>

  <section class="ie-section">
    <h2>${t.pressureTitle}</h2>
    <p>${t.pressureBody}</p>
  </section>

  <section class="ie-section">
    <h2>${t.pointsTitle}</h2>
    <div class="ie-grid">${points}</div>
  </section>

  <section class="ie-section">
    <h2>${t.proofTitle}</h2>
    <p>${t.proofBody}</p>
    <div class="ie-proof">
      <img src="${P}${PROOF}" alt="${isEn ? 'MWL interactive maquette — Graphics House' : 'مجسم تفاعلي لرابطة العالم الإسلامي — Graphics House'}" loading="lazy">
      <div>
        <div class="ie-proof-links">
          <a class="ie-btn ie-btn--ghost" href="${report}">${t.ctaReport}</a>
          <a class="ie-btn ie-btn--ghost" href="${casestudy}">${t.ctaCase}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="ie-section">
    <h2>${t.servicesTitle}</h2>
    <div class="ie-svc-grid">${services}</div>
  </section>

  <section class="ie-section">
    <h2>${t.faqTitle}</h2>
    ${faqs}
  </section>

  <section class="ie-section ie-final">
    <h2>${t.finalTitle}</h2>
    <p>${t.finalBody}</p>
    <div class="ie-cta">
      <a class="ie-btn ie-btn--gold" href="${contact}" data-gh-cta="institutional_events_final">${t.ctaPrimary}</a>
      <a class="ie-btn ie-btn--ghost" href="tel:${phone}">${t.phoneLabel}</a>
      <a class="ie-btn ie-btn--ghost" href="${wa}" target="_blank" rel="noopener noreferrer" data-gh-cta="institutional_events_wa">${t.waLabel}</a>
    </div>
  </section>
</main>
${footer}
<script defer src="${P}assets/gh-float-widgets.js?v=8"></script>
<script>
if(window.gtag){gtag('event','solution_view',{solution_id:'institutional-events',page_path:location.pathname});}
</script>
</body>
</html>`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const lang of ['ar', 'en']) {
  const name = lang === 'en' ? 'institutional-events-en.html' : 'institutional-events.html';
  fs.writeFileSync(path.join(OUT, name), page(lang), 'utf8');
  console.log('Wrote solutions/' + name);
}

const smPath = path.join(ROOT, 'sitemap.xml');
if (fs.existsSync(smPath)) {
  let xml = fs.readFileSync(smPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  for (const suffix of ['', '-en']) {
    const loc = `${BASE}/solutions/institutional-events${suffix}.html`;
    if (!xml.includes(loc)) {
      xml = xml.replace(
        '</urlset>',
        `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n</urlset>`
      );
    }
  }
  fs.writeFileSync(smPath, xml, 'utf8');
  console.log('Sitemap: institutional-events URLs ensured');
}
