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
    title: 'Institutional Event Visual Systems | ProjectLaunch™ | Graphics House',
    description:
      'Forums and protocol exhibitions need one visual briefing system, not scattered vendors. Graphics House owns concept and build: interactive maquettes, screens, spatial install. Saudi Arabia and GCC.',
    kicker: 'ProjectLaunch™ · Institutional events',
    h1: 'Your exhibition concept.<br>One studio from brief to VIP day.',
    lead: 'When the guest path includes a Secretary General and multinational press, the room is the briefing. Fragmented décor vendors lose the narrative before opening day.',
    sub: 'Graphics House authors the exhibition idea and builds it end to end: <a href="../services/maquettes-en.html">smart maquettes</a>, hero content via <a href="../services/cinematic-cgi-en.html">CGI</a>, screens, host programs, and on-site install, with acceptance rehearsal before the first guest. See the <a href="../insights/reports/mwl-ramadan-forum-visual-report-en.html">Ramadan Forum report</a>.',
    ctaPrimary: 'Book a readiness session',
    ctaSecondary: 'See ProjectLaunch™',
    ctaReport: 'Read the Ramadan Forum report',
    ctaCase: 'Open the MWL case study',
    ctaJeddahCase: 'Jeddah Forum case study',
    pressureTitle: 'A compressed calendar should not shrink the idea',
    pressureBody:
      'Institutional dates stack install, content lock, and protocol rehearsal into days, not months. Multiple vendors spend that window on handoffs. One studio spends it on the guest experience and what leadership sees on walkthrough day.',
    pointsTitle: 'What one accountable studio delivers',
    points: [
      ['Concept ownership', 'Décor, spatial design, and interactive narrative from one brief, not stitched subcontractor files'],
      ['Production under one roof', '<a href="../services/maquettes-en.html">Maquettes</a>, <a href="../services/cinematic-cgi-en.html">CGI films</a>, screens, and control programs in one handover pack. Campaign films can extend via <a href="https://beesmotion.com" target="_blank" rel="noopener noreferrer">Bees Motion</a> after assets lock'],
      ['Protocol-ready install', 'Guest path, lighting cues, and fallback scenes tested before the first VIP walkthrough'],
      ['Acceptance that closes the loop', 'A briefing environment leadership can praise, not a screen that merely turns on'],
    ],
    proofTitle: 'Proof: Muslim World League, Ramadan Forum, Jeddah',
    proofBody:
      'For the League side at the Ramadan Forum in <a href="../locations/jeddah-en.html">Jeddah</a>, we delivered an interactive maquette of global flagship projects, detail screens, lighting control, press interaction, and a commemorative photo program under severe time pressure, with personal praise from H.E. the Secretary General. Read the <a href="../insights/reports/mwl-ramadan-forum-visual-report-en.html">visual report</a> and <a href="../casestudy-mwl-en.html">Makkah Charter case study</a>. For brand, catalogue, and cinematic CGI at scale, see the <a href="../case-studies/jeddah-real-estate-forum-en.html">Jeddah Real Estate Forum case study</a>.',
    servicesTitle: 'Capabilities behind the delivery',
    services: [
      ['ProjectLaunch™', 'solutions/project-launch-en.html', 'Readiness frame: lock message, pack assets, rehearse acceptance'],
      ['Smart maquettes', 'services/maquettes-en.html', 'Interactive models as the briefing anchor'],
      ['Interactive experiences', 'services/interactive-experiences-en.html', 'Screens, unit tools, and host programs'],
      ['Branding & install', 'services/branding-en.html', 'Spatial décor with one visual language'],
      ['Makkah & Jeddah', 'locations/makkah-en.html', 'On-ground planning for host-city protocol events'],
    ],
    faqTitle: 'Before you book',
    faqs: [
      [
        'Is this only for real-estate launches?',
        'No. The same ProjectLaunch™ readiness logic fits institutional forums, association exhibitions, and protocol VIP tours, where the product is initiatives and documents, not units.',
      ],
      [
        'Can you work inside a compressed calendar?',
        'Yes, when concept and build sit with one studio. Split vendors burn the schedule on coordination; we spend it on quality and rehearsal.',
      ],
      [
        'Where do I see the delivery record?',
        'Start with the <a href="../insights/reports/mwl-ramadan-forum-visual-report-en.html">Ramadan Forum visual report</a>, <a href="../casestudy-mwl-en.html">Makkah Charter case study</a>, and <a href="../case-studies/jeddah-real-estate-forum-en.html">Jeddah Real Estate Forum case study</a>, then book a session for your next date.',
      ],
    ],
    finalTitle: 'Next institutional date on the calendar?',
    finalBody: 'Send the occasion, guest profile, and install window. We reply within 24 hours with a readiness path, no obligation.',
    waLabel: 'WhatsApp',
    phoneLabel: 'Call Jeddah',
  },
  ar: {
    title: 'أنظمة العرض للفعاليات المؤسسية | ProjectLaunch™ | Graphics House',
    description:
      'الملتقيات والمعارض البروتوكولية تحتاج نظام إحاطة بصري واحد لا مقاولين متفرّقين. Graphics House تملك الفكرة والتنفيذ: مجسمات تفاعلية، شاشات، تركيب مكاني. السعودية والخليج.',
    kicker: 'ProjectLaunch™ · فعاليات مؤسسية',
    h1: 'فكرة المعرض.<br>استوديو واحد من الموجز إلى يوم الضيف.',
    lead: 'عندما يضم مسار الضيف أميناً عاماً ووكالات أنباء متعددة، القاعة هي غرفة الإحاطة. تفتيت الديكور بين موردين يضيع السرد قبل يوم الافتتاح.',
    sub: 'Graphics House تصوغ مفهوم المعرض وتنفّذه من طرف واحد: <a href="../services/maquettes.html">مجسمات ذكية</a>، محتوى عبر <a href="../services/cinematic-cgi.html">CGI</a>، شاشات، برامج عرض، وتركيب ميداني، مع بروفة قبول قبل الضيف الأول. راجع <a href="../insights/reports/mwl-ramadan-forum-visual-report.html">تقرير الملتقى الرمضاني</a>.',
    ctaPrimary: 'احجز جلسة جاهزية',
    ctaSecondary: 'تعرّف على ProjectLaunch™',
    ctaReport: 'اقرأ تقرير الملتقى الرمضاني',
    ctaCase: 'افتح دراسة حالة الرابطة',
    ctaJeddahCase: 'دراسة ملتقى جدة للعقار',
    pressureTitle: 'الجدول المضغوط لا يبرّر اختصار الفكرة',
    pressureBody:
      'مواعيد الفعاليات المؤسسية تضغط التركيب وقفل المحتوى وبروفة البروتوكول في أيام لا أشهر. تعدد الموردين يستهلك هذا الوقت في التسليمات. استوديو واحد يصرفه على تجربة الضيف وما يراه القيادي يوم الجولة.',
    pointsTitle: 'ماذا يقدّم استوديو واحد مسؤول؟',
    points: [
      ['ملكية المفهوم', 'ديكور وتصميم مكاني وسرد تفاعلي من موجز واحد، لا ملفات مجمّعة من مقاولين'],
      ['إنتاج تحت سقف واحد', '<a href="../services/maquettes.html">مجسمات</a> و<a href="../services/cinematic-cgi.html">أفلام CGI</a> وشاشات وبرامج تحكم في حزمة تسليم واحدة. أفلام الحملة يمكن توسيعها عبر <a href="https://beesmotion.com" target="_blank" rel="noopener noreferrer">بيزموشن</a> بعد قفل الأصول'],
      ['جاهزية بروتوكول', 'مسار الضيف والإضاءة والنسخة الاحتياطية تُختبر قبل جولة VIP'],
      ['قبول يُغلق الحلقة', 'بيئة إحاطة تنال إشادة القيادة، لا شاشة تُشغَّل فقط'],
    ],
    proofTitle: 'دليل: رابطة العالم الإسلامي، الملتقى الرمضاني، جدة',
    proofBody:
      'في جانب الرابطة بالملتقى الرمضاني في <a href="../locations/jeddah.html">جدة</a>، نفّذنا مجسماً تفاعلياً لأبرز مشاريعها، شاشات تفاصيل، تحكم إضاءة، تفاعل صحفي، وتجربة صور تذكارية تحت ضغط زمني شديد، مع إشادة شخصية من معالي الأمين العام. اقرأ <a href="../insights/reports/mwl-ramadan-forum-visual-report.html">التقرير البصري</a> و<a href="../casestudy-mwl.html">دراسة ميثاق مكة</a>. وللهوية والكتالوج والفيلم السينمائي على نطاق الملتقى، راجع <a href="../case-studies/jeddah-real-estate-forum.html">دراسة ملتقى جدة للعقار</a>.',
    servicesTitle: 'القدرات وراء التسليم',
    services: [
      ['ProjectLaunch™', 'solutions/project-launch.html', 'إطار الجاهزية: قفل الرسالة، حزم الأصول، بروفة القبول'],
      ['مجسمات ذكية', 'services/maquettes.html', 'نماذج تفاعلية كنقطة شرح رئيسية'],
      ['تجارب تفاعلية', 'services/interactive-experiences.html', 'شاشات وأدوات عرض وبرامج مضيف'],
      ['هوية وتركيب', 'services/branding.html', 'ديكور مكاني بلغة بصرية واحدة'],
      ['مكة وجدة', 'locations/makkah.html', 'تخطيط ميداني لفعاليات مدن الاستضافة'],
    ],
    faqTitle: 'قبل الحجز',
    faqs: [
      [
        'هل هذا لإطلاقات عقارية فقط؟',
        'لا. نفس منطق جاهزية ProjectLaunch™ يناسب الملتقيات المؤسسية ومعارض الجمعيات وجولات VIP، حيث المنتج مبادرات ووثائق لا وحدات.',
      ],
      [
        'هل تعملون تحت جدول مضغوط؟',
        'نعم، عندما يكون المفهوم والتنفيذ عند استوديو واحد. تفتيت المسؤولية يحرق الزمن في التنسيق؛ نحن نصرفه على الجودة والبروفة.',
      ],
      [
        'أين أرى سجل التسليم؟',
        'ابدأ ب<a href="../insights/reports/mwl-ramadan-forum-visual-report.html">تقرير الملتقى الرمضاني</a> و<a href="../casestudy-mwl.html">دراسة ميثاق مكة</a> و<a href="../case-studies/jeddah-real-estate-forum.html">دراسة ملتقى جدة للعقار</a>، ثم احجز جلسة لموعدك القادم.',
      ],
    ],
    finalTitle: 'موعد مؤسسي قادم في الأجندة؟',
    finalBody: 'أرسل المناسبة وملف الضيف ونافذة التركيب. نرد خلال 24 ساعة بمسار جاهزية، بلا التزام.',
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
  const casestudy = `${P}casestudy-mwl${isEn ? '-en' : ''}.html`;
  const jeddahCase = `${P}case-studies/jeddah-real-estate-forum${isEn ? '-en' : ''}.html`;
  const phone = '+966502786513';
  const wa = `https://wa.me/966502786513?text=${encodeURIComponent(
    isEn
      ? 'Hello Graphics House, institutional event / ProjectLaunch readiness'
      : 'مرحباً Graphics House، فعالية مؤسسية / جاهزية ProjectLaunch'
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
    name: isEn ? 'Institutional Events, ProjectLaunch™' : 'فعاليات مؤسسية، ProjectLaunch™',
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
      <img src="${P}${PROOF}" alt="${isEn ? 'MWL interactive maquette, Graphics House' : 'مجسم تفاعلي لرابطة العالم الإسلامي، Graphics House'}" loading="lazy">
      <div>
        <div class="ie-proof-links">
          <a class="ie-btn ie-btn--ghost" href="${report}">${t.ctaReport}</a>
          <a class="ie-btn ie-btn--ghost" href="${casestudy}">${t.ctaCase}</a>
          <a class="ie-btn ie-btn--ghost" href="${jeddahCase}">${t.ctaJeddahCase}</a>
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
