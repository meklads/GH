#!/usr/bin/env node
/**
 * Partner Network landing — AR + EN (light, formal B2B inquiry).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHeader, renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://3dgraphicshouse.com';

const COPY = {
  ar: {
    lang: 'ar',
    dir: 'rtl',
    canonical: `${BASE}/partner-network.html`,
    altEn: `${BASE}/partner-network-en.html`,
    altAr: `${BASE}/partner-network.html`,
    title: 'شبكة الشركاء | Graphics House',
    description:
      'شراكات استراتيجية في الإنتاج البصري والتجريبي مع وكالات الدعاية والمكاتب الهندسية وشركات المقاولات في المملكة ودول الخليج.',
    ogTitle: 'شبكة الشركاء — Graphics House',
    eye: 'شبكة الشركاء',
    h1: 'يشرفنا',
    h1Gold: 'التعاون معكم',
    lead:
      'جرافيكس هاوس — استوديو متخصص في الإظهار المعماري، الأفلام السينمائية، المجسمات، والتجارب التفاعلية.',
    aboutTitle: 'من نحن',
    aboutText:
      'منذ أكثر من 15 عاماً، نُنتج محتوى بصرياً وتجريبياً للمشاريع الكبرى في المملكة ودول الخليج. نعمل مع جهات رائدة في التطوير والتصميم والإعلان — نُضيف طبقة إنتاج متخصصة إلى منظومة خدماتكم، لا نُنافسكم.',
    offerTitle: 'ماذا نقدم',
    offerSub: 'قدرات إنتاج متكاملة تُضاف إلى مشاريعكم وعروضكم الحالية.',
    inviteText:
      'يسعدنا التنسيق للتعرف بشكل أكبر على جهتكم، ومناقشة إمكانية التعاون بين شركتينا في المشاريع الحالية والمستقبلية، بما يحقق المصالح المشتركة.',
    faqTitle: 'أسئلة شائعة',
    faqSub: 'إجابات مختصرة على ما يهم شركاءنا المحتملين.',
    faq: [
      {
        q: 'مع من نتعاون؟',
        a: 'مع وكالات الدعاية والإعلان، المكاتب الهندسية، شركات المقاولات، والجهات الرائدة في التطوير والتصميم — في المملكة ودول الخليج.',
      },
      {
        q: 'كيف يتم التعاون؟',
        a: 'عبر نموذج Co-Delivery بأدوار واضحة وشفافية كاملة. نُكمّل ما تقدمونه — علاقة العميل، الاستراتيجية، الهندسة — بقدراتنا في الإظهار والأفلام والمجسمات والتجارب التفاعلية.',
      },
      {
        q: 'هل تقدمون white label؟',
        a: 'لا. نؤمن بكيانين واضحين أمام العميل — شفافية واحترافية دون إخفاء الهوية.',
      },
      {
        q: 'كيف نبدأ؟',
        a: 'بجلسة تعارف عبر Zoom (20–30 دقيقة)، ثم تحديد نطاق المشروع أو فرصة التعاون، يليه تنفيذ مشترك بإطار واضح.',
      },
      {
        q: 'ما مدة الرد على الطلب؟',
        a: 'يراجع فريق الشراكات كل طلب ويرد خلال 24 ساعة عمل.',
      },
    ],
    zoomTitle: 'طلب اجتماع تعارف',
    zoomSub:
      'نود التنسيق لعقد اجتماع في الوقت الذي يناسبكم — للتعرف على خدماتنا وأعمالنا، ومناقشة إمكانية التعاون.',
    zoomDuration: 'مدة الاجتماع: 20–30 دقيقة · عبر Zoom',
    zoomNote: 'نأمل التكرم بإفادتنا بالموعد المناسب لكم في النموذج أدناه، وسيسعدنا التنسيق بما يتوافق مع جدولكم.',
    zoomCta: 'تعبئة طلب الاجتماع',
    links: [
      { href: 'solutions/project-launch.html', label: 'Project Launch™', sub: 'منظومة إطلاق المشروع', img: 'assets/mm-project.jpg' },
      { href: 'services/animation.html', label: 'أفلام CGI', sub: 'إنتاج سينمائي', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { href: 'services/maquettes.html', label: 'المجسمات', sub: 'مجسمات معمارية', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { href: 'services/rendering.html', label: 'الإظهار المعماري', sub: '3D · renders', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { href: 'services/interactive.html', label: 'التجارب التفاعلية', sub: 'شاشات · VR', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
      { href: 'portfolio.html', label: 'معرض الأعمال', sub: 'نماذج مختارة', img: 'assets/projects/pavilion1.jpg', webp: 'assets/projects/pavilion1.webp' },
    ],
    siteTour: 'استكشف الموقع',
    siteTourHref: 'index-ar.html',
    formTitle: 'نموذج طلب التعاون',
    formSub: 'يُراجع فريق الشراكات طلبكم ويتواصل معكم لتنسيق الاجتماع.',
    formSubject: 'طلب شراكة — شبكة الشركاء AR',
    formNext: `${BASE}/partner-network.html?sent=1#inquiry`,
    formOrgHeading: 'بيانات الجهة',
    formContactHeading: 'بيانات المسؤول',
    formMeetingHeading: 'تنسيق الاجتماع',
    fields: {
      segment: 'تصنيف الجهة',
      company: 'اسم الشركة',
      companyEmail: 'البريد الإلكتروني الرسمي للشركة',
      name: 'اسم المسؤول',
      role: 'المسمى الوظيفي',
      phone: 'رقم التواصل',
      website: 'موقع الشركة',
      collab: 'نوع التعاون المطلوب',
      meetingTimes: 'الأوقات المناسبة لكم للاجتماع',
      brief: 'نبذة عن الفرصة أو المشروع',
    },
    segmentOptions: [
      { v: '', l: 'اختر تصنيف الجهة' },
      { v: 'agency', l: 'وكالات الدعاية والإعلان' },
      { v: 'engineering', l: 'المكاتب الهندسية' },
      { v: 'contracting', l: 'شركات المقاولات' },
      { v: 'other', l: 'أخرى — يرجى ذكر اسم الشركة' },
    ],
    collabOptions: [
      { v: '', l: 'اختر نوع التعاون' },
      { v: 'zoom-intro', l: 'اجتماع تعارف — Zoom' },
      { v: 'co-delivery', l: 'تسليم مشترك — Co-Delivery' },
      { v: 'referral', l: 'تعارف بفرصة مشروع محددة' },
      { v: 'strategic', l: 'شراكة استراتيجية طويلة المدى' },
    ],
    meetingPlaceholder: 'مثال: الأحد–الثلاثاء، 10 ص – 2 م · أو أي ملاحظات للتنسيق',
    briefPlaceholder: 'صفّوا بإيجاز طبيعة التعاون المقترح أو نوع المشاريع التي تهمكم.',
    submit: 'إرسال الطلب',
    sentMsg: 'شكراً لتواصلكم. سيتواصل فريق الشراكات معكم خلال 24 ساعة عمل لتنسيق الموعد.',
    wa: 'واتساب',
    langSwitch: 'English',
    langHref: 'partner-network-en.html',
  },
  en: {
    lang: 'en',
    dir: 'ltr',
    canonical: `${BASE}/partner-network-en.html`,
    altEn: `${BASE}/partner-network-en.html`,
    altAr: `${BASE}/partner-network.html`,
    title: 'Partner Network | Graphics House',
    description:
      'Strategic partnerships in visual and experiential production with agencies, engineering firms, and contractors across the GCC.',
    ogTitle: 'Partner Network — Graphics House',
    eye: 'Partner Network',
    h1: 'We would be honored',
    h1Gold: 'to collaborate with you',
    lead:
      'Graphics House — a specialist studio in architectural visualization, cinematic film, scale models, and interactive experiences.',
    aboutTitle: 'Who we are',
    aboutText:
      'For over 15 years, we have produced visual and experiential content for major projects across Saudi Arabia and the GCC. We work with leading developers, designers, and agencies — adding a specialist production layer to your offering, not competing with it.',
    offerTitle: 'What we deliver',
    offerSub: 'Integrated production capabilities that extend your current projects and proposals.',
    inviteText:
      'We would be pleased to learn more about your organization and discuss the possibility of cooperation on current and future projects — in a way that serves mutual interests.',
    faqTitle: 'Common questions',
    faqSub: 'Brief answers to what our potential partners ask most.',
    faq: [
      {
        q: 'Who do you partner with?',
        a: 'Advertising and creative agencies, engineering firms, contracting companies, and leading organizations in development and design — across Saudi Arabia and the GCC.',
      },
      {
        q: 'How does collaboration work?',
        a: 'Through a Co-Delivery model with clear roles and full transparency. We complement what you bring — client relationships, strategy, engineering — with visualization, film, maquettes, and interactive experiences.',
      },
      {
        q: 'Do you offer white label?',
        a: 'No. We believe in two clear entities in front of the client — transparency and professionalism without hidden identity.',
      },
      {
        q: 'How do we start?',
        a: 'With an introductory Zoom session (20–30 minutes), then scope definition for a project or partnership opportunity, followed by joint execution with a clear framework.',
      },
      {
        q: 'How quickly do you respond?',
        a: 'Our partnerships team reviews every request and responds within 24 business hours.',
      },
    ],
    zoomTitle: 'Request an introductory meeting',
    zoomSub:
      'We would like to coordinate a meeting at a time that suits you — to learn about our services and discuss the possibility of collaboration.',
    zoomDuration: 'Duration: 20–30 minutes · via Zoom',
    zoomNote: 'Please share your preferred times in the form below — we will coordinate according to your schedule.',
    zoomCta: 'Complete meeting request',
    links: [
      { href: 'solutions/project-launch-en.html', label: 'Project Launch™', sub: 'Project launch system', img: 'assets/mm-project.jpg' },
      { href: 'services/animation-en.html', label: 'CGI Films', sub: 'Cinematic production', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { href: 'services/maquettes-en.html', label: 'Scale Models', sub: 'Architectural maquettes', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { href: 'services/rendering-en.html', label: 'Visualization', sub: '3D · renders', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { href: 'services/interactive-en.html', label: 'Interactive', sub: 'Screens · VR', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
      { href: 'portfolio-en.html', label: 'Portfolio', sub: 'Selected work', img: 'assets/projects/pavilion1.jpg', webp: 'assets/projects/pavilion1.webp' },
    ],
    siteTour: 'Explore the site',
    siteTourHref: 'index.html',
    formTitle: 'Partnership inquiry form',
    formSub: 'Our partnerships team will review your request and contact you to schedule the meeting.',
    formSubject: 'Partnership inquiry — Partner Network EN',
    formNext: `${BASE}/partner-network-en.html?sent=1#inquiry`,
    formOrgHeading: 'Organization details',
    formContactHeading: 'Contact details',
    formMeetingHeading: 'Meeting coordination',
    fields: {
      segment: 'Organization category',
      company: 'Company name',
      companyEmail: 'Official company email',
      name: 'Contact name',
      role: 'Job title',
      phone: 'Phone',
      website: 'Company website',
      collab: 'Collaboration type',
      meetingTimes: 'Preferred meeting times',
      brief: 'Brief about the opportunity or project',
    },
    segmentOptions: [
      { v: '', l: 'Select organization category' },
      { v: 'agency', l: 'Advertising & creative agencies' },
      { v: 'engineering', l: 'Engineering firms' },
      { v: 'contracting', l: 'Contracting companies' },
      { v: 'other', l: 'Other — please specify company name' },
    ],
    collabOptions: [
      { v: '', l: 'Select collaboration type' },
      { v: 'zoom-intro', l: 'Introductory meeting — Zoom' },
      { v: 'co-delivery', l: 'Co-Delivery — joint project delivery' },
      { v: 'referral', l: 'Project-specific introduction' },
      { v: 'strategic', l: 'Long-term strategic partnership' },
    ],
    meetingPlaceholder: 'e.g. Sun–Wed, 10am–2pm · or any scheduling notes',
    briefPlaceholder: 'Briefly describe the proposed collaboration or project types of interest.',
    submit: 'Submit inquiry',
    sentMsg: 'Thank you. Our partnerships team will contact you within 24 business hours to schedule the meeting.',
    wa: 'WhatsApp',
    langSwitch: 'العربية',
    langHref: 'partner-network.html',
  },
};

function buildPage(c) {
  const isEn = c.lang === 'en';
  const header = renderHeader(0, isEn);
  const footer = renderFooter(0, isEn);

  const segmentOptions = c.segmentOptions.map((o) => `<option value="${o.v}">${o.l}</option>`).join('');
  const collabOptions = c.collabOptions.map((o) => `<option value="${o.v}">${o.l}</option>`).join('');

  const exploreLinks = c.links
    .map((l) => {
      const imgHtml = l.webp
        ? `<picture><source srcset="${l.webp}" type="image/webp"><img src="${l.img}" alt="${l.label}" loading="lazy"></picture>`
        : `<img src="${l.img}" alt="${l.label}" loading="lazy">`;
      return `
    <a href="${l.href}" class="pn-offer-card" target="_blank" rel="noopener noreferrer">
      <div class="pn-offer-img">${imgHtml}</div>
      <span class="pn-offer-label">${l.label}</span>
      <span class="pn-offer-sub">${l.sub}</span>
      <span class="material-symbols-outlined pn-offer-ext" aria-hidden="true">open_in_new</span>
    </a>`;
    })
    .join('');

  const faqItems = c.faq
    .map(
      (item, i) => `
    <details class="pn-faq-item"${i === 0 ? ' open' : ''}>
      <summary class="pn-faq-q">${item.q}</summary>
      <p class="pn-faq-a">${item.a}</p>
    </details>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${c.lang}" dir="${c.dir}" class="scroll-smooth">
<head>
<script src="assets/gh-forms-config.js?v=2"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y67JVE898Z"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;gtag('js',new Date());gtag('config','G-Y67JVE898Z');
</script>
<script src="assets/gh-analytics.js?v=3"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="canonical" href="${c.canonical}">
<link rel="alternate" hreflang="en" href="${c.altEn}">
<link rel="alternate" hreflang="ar" href="${c.altAr}">
<link rel="alternate" hreflang="x-default" href="${c.altEn}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.title}</title>
<meta name="description" content="${c.description}">
<meta property="og:title" content="${c.ogTitle}">
<meta property="og:description" content="${c.description}">
<meta property="og:image" content="${BASE}/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="assets/gh-site-enhancements.css?v=21">
<link rel="stylesheet" href="assets/site-header.css?v=33">
<link rel="stylesheet" href="assets/gh-float-widgets.css?v=8">
<style>
:root {
  --gold: #C9A84C;
  --gold-soft: rgba(201,168,76,0.1);
  --ink: #141414;
  --muted: rgba(20,20,20,0.62);
  --line: rgba(20,20,20,0.09);
  --white: #FFFFFF;
  --bg: #FAFAF8;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body.gh-partner-network {
  font-family: ${isEn ? "'Inter', 'Tajawal', 'IBM Plex Sans Arabic'" : "'Tajawal', 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont"}, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.pn-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
@media(min-width:768px){ .pn-wrap { padding: 0 40px; } }

.pn-lang {
  position: fixed; top: calc(var(--gh-header-height, 88px) + 12px); ${isEn ? 'right' : 'left'}: 20px; z-index: 100;
  font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.72); text-decoration: none; padding: 7px 14px;
  background: rgba(8,12,10,0.88); border: 1px solid rgba(201,168,76,0.22); border-radius: 999px;
  transition: border-color 0.25s, color 0.25s;
}
.pn-lang:hover { border-color: var(--gold); color: #fff; }

.pn-hero {
  padding: calc(var(--gh-header-height, 88px) + 56px) 0 48px;
  background: var(--white);
  border-bottom: 1px solid var(--line);
  text-align: ${isEn ? 'left' : 'right'};
}
.pn-eye {
  display: inline-block; font-size: 11px; font-weight: 500; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 18px;
  font-family: ${isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-h1 {
  font-size: clamp(34px, 5.2vw, 54px); font-weight: 300; line-height: 1.18;
  letter-spacing: -0.025em; margin-bottom: 16px; color: var(--ink);
  font-family: ${isEn ? "'Inter', 'Tajawal', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-h1 em { font-style: normal; color: var(--gold); font-weight: 700; }
.pn-lead {
  font-size: clamp(16px, 1.8vw, 18px); line-height: 1.9; color: var(--muted);
  max-width: 640px; font-weight: 400;
  font-family: ${isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}

.pn-section { padding: 72px 0; }
.pn-section--white { background: var(--white); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.pn-h2 {
  font-size: clamp(28px, 3.2vw, 40px); font-weight: 300; margin-bottom: 12px;
  letter-spacing: -0.02em; color: var(--ink);
  font-family: ${isEn ? "'Inter', 'Tajawal', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-h3 {
  font-size: clamp(20px, 2.4vw, 26px); font-weight: 700; margin: 40px 0 12px;
  letter-spacing: -0.01em; color: var(--ink);
  font-family: ${isEn ? "'Inter', 'Tajawal', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-h3:first-of-type { margin-top: 0; }
.pn-sub {
  font-size: 16px; color: var(--muted); line-height: 1.85; margin-bottom: 28px; max-width: 600px;
  font-family: ${isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-about-text {
  font-size: 17px; line-height: 2; color: var(--muted); max-width: 720px;
  font-family: ${isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-invite {
  margin-top: 40px; padding: 28px 32px;
  background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03));
  border: 1px solid rgba(201,168,76,0.22); border-radius: 14px;
  font-size: 17px; line-height: 1.95; color: var(--ink);
  font-family: ${isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}

.pn-offers {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
}
@media(min-width:768px){ .pn-offers { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
.pn-offer-card {
  display: flex; flex-direction: column; gap: 0; text-decoration: none; color: inherit;
  background: var(--bg); border: 1px solid var(--line); border-radius: 14px;
  overflow: hidden; position: relative;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.25s;
}
.pn-offer-card:hover {
  border-color: rgba(201,168,76,0.4); box-shadow: 0 14px 40px rgba(0,0,0,0.07);
  transform: translateY(-3px);
}
.pn-offer-img {
  aspect-ratio: 4 / 3; overflow: hidden; background: #eceae4;
}
.pn-offer-img img, .pn-offer-img picture { width: 100%; height: 100%; display: block; }
.pn-offer-img img { object-fit: cover; transition: transform 0.45s ease; }
.pn-offer-card:hover .pn-offer-img img { transform: scale(1.04); }
.pn-offer-label {
  display: block; padding: 16px 18px 4px; font-size: 15px; font-weight: 700; color: var(--ink);
  font-family: ${isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-offer-sub {
  display: block; padding: 0 18px 18px; font-size: 13px; color: var(--muted); line-height: 1.5;
  font-family: ${isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif"};
}
.pn-offer-ext {
  position: absolute; top: 12px; ${isEn ? 'right' : 'left'}: 12px;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.92); border-radius: 8px; font-size: 16px; color: var(--gold);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); opacity: 0; transition: opacity 0.25s;
}
.pn-offer-card:hover .pn-offer-ext { opacity: 1; }

.pn-tour {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 24px;
  font-size: 13px; font-weight: 600; color: var(--ink); text-decoration: none;
  padding: 13px 24px; border: 1.5px solid var(--line); border-radius: 999px;
  background: var(--white); transition: all 0.25s;
}
.pn-tour:hover { border-color: var(--gold); color: var(--gold); }

.pn-faq { display: flex; flex-direction: column; gap: 10px; max-width: 760px; }
.pn-faq-item {
  background: var(--white); border: 1px solid var(--line); border-radius: 12px;
  overflow: hidden; transition: border-color 0.25s;
}
.pn-faq-item[open] { border-color: rgba(201,168,76,0.35); }
.pn-faq-q {
  padding: 20px 24px; font-size: 15px; font-weight: 700; cursor: pointer;
  list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.pn-faq-q::-webkit-details-marker { display: none; }
.pn-faq-q::after {
  content: '+'; font-size: 18px; font-weight: 400; color: var(--gold); flex-shrink: 0;
  transition: transform 0.25s;
}
.pn-faq-item[open] .pn-faq-q::after { content: '−'; }
.pn-faq-a {
  padding: 0 24px 20px; font-size: 15px; line-height: 1.85; color: var(--muted);
}

.pn-zoom {
  background: #080c0a; color: #fff; border-radius: 20px;
  padding: 48px 36px; text-align: ${isEn ? 'left' : 'right'};
}
@media(min-width:768px){ .pn-zoom { padding: 56px 52px; } }
.pn-zoom-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 52px; height: 52px; border-radius: 14px;
  background: rgba(201,168,76,0.15); color: var(--gold); margin-bottom: 20px;
}
.pn-zoom-icon .material-symbols-outlined { font-size: 28px; }
.pn-zoom h2 { color: #fff; margin-bottom: 12px; }
.pn-zoom .pn-sub { color: rgba(255,255,255,0.72); margin-bottom: 16px; }
.pn-zoom-duration {
  font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 12px;
}
.pn-zoom-note {
  font-size: 15px; line-height: 1.85; color: rgba(255,255,255,0.68);
  margin-bottom: 28px; max-width: 560px;
}
.pn-zoom-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 15px 28px; font-size: 14px; font-weight: 700; letter-spacing: 0.04em;
  font-family: inherit; text-decoration: none; color: #080c0a;
  background: var(--gold); border-radius: 999px; transition: transform 0.25s, box-shadow 0.25s;
}
.pn-zoom-cta:hover {
  transform: translateY(-2px); box-shadow: 0 12px 36px rgba(201,168,76,0.35);
}

.pn-form-section {
  padding: 80px 0 110px;
  background: linear-gradient(180deg, var(--bg) 0%, var(--white) 50%);
}
.pn-form-box {
  background: var(--white); border: 1px solid var(--line); border-radius: 20px;
  padding: 44px 32px; box-shadow: 0 24px 64px rgba(0,0,0,0.06);
}
@media(min-width:768px){ .pn-form-box { padding: 52px 48px; } }
.pn-form-head { margin-bottom: 36px; padding-bottom: 28px; border-bottom: 1px solid var(--line); }
.pn-form-head h2 { font-size: clamp(24px, 3vw, 30px); font-weight: 700; margin-bottom: 10px; letter-spacing: -0.02em; }
.pn-form-head p { font-size: 15px; color: var(--muted); line-height: 1.8; }

.pn-form-group { margin-bottom: 28px; }
.pn-form-group-title {
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 16px; padding-bottom: 10px;
  border-bottom: 1px solid rgba(201,168,76,0.18);
}

.pn-form-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
@media(min-width:640px){ .pn-form-grid { grid-template-columns: 1fr 1fr; } }
.pn-form-grid .pn-field--full { grid-column: 1 / -1; }

.pn-field { display: flex; flex-direction: column; gap: 7px; }
.pn-field label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  color: rgba(20,20,20,0.52);
}
.pn-field label .req { color: var(--gold); margin-${isEn ? 'left' : 'right'}: 2px; }
.pn-field input, .pn-field select, .pn-field textarea {
  padding: 14px 16px; font-size: 15px; font-family: inherit;
  border: 1.5px solid var(--line); border-radius: 10px; background: #F7F6F3;
  color: var(--ink); outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  ${isEn ? '' : 'text-align: right;'}
}
.pn-field input:focus, .pn-field select:focus, .pn-field textarea:focus {
  border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.12); background: var(--white);
}
.pn-field input[type="email"], .pn-field input[type="url"], .pn-field input[type="tel"] { direction: ltr; text-align: left; }
.pn-field textarea { min-height: 132px; resize: vertical; line-height: 1.7; }
.pn-field select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: ${isEn ? 'right' : 'left'} 12px center; padding-${isEn ? 'right' : 'left'}: 36px; }

.pn-submit {
  width: 100%; margin-top: 12px; padding: 17px 28px; font-size: 14px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; font-family: inherit; cursor: pointer;
  background: #080c0a; color: var(--white); border: none; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  transition: background 0.3s, transform 0.25s, box-shadow 0.25s;
}
.pn-submit:hover { background: #1a1f1c; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(0,0,0,0.14); }
.pn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.pn-alt-cta {
  margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--line);
  display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 13px; color: var(--muted);
}
.pn-wa {
  display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
  background: #25D366; color: #fff; text-decoration: none; border-radius: 999px;
  font-size: 13px; font-weight: 600; transition: transform 0.2s;
}
.pn-wa:hover { transform: scale(1.03); }
</style>
<script defer src="assets/site-header.js?v=16"></script>
<script defer src="assets/gh-performance.js?v=3"></script>
<script defer src="assets/lang-switch.js?v=2"></script>
</head>
<body class="gh-partner-network">
${header}
<a class="pn-lang" href="${c.langHref}" hreflang="${isEn ? 'ar' : 'en'}">${c.langSwitch}</a>

<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>

<section class="pn-hero">
  <div class="pn-wrap">
    <span class="pn-eye">${c.eye}</span>
    <h1 class="pn-h1">${c.h1} <em>${c.h1Gold}</em></h1>
    <p class="pn-lead">${c.lead}</p>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap">
    <h3 class="pn-h3">${c.aboutTitle}</h3>
    <p class="pn-about-text">${c.aboutText}</p>
    <h3 class="pn-h3">${c.offerTitle}</h3>
    <p class="pn-sub">${c.offerSub}</p>
    <div class="pn-offers">${exploreLinks}</div>
    <a href="${c.siteTourHref}" class="pn-tour" target="_blank" rel="noopener noreferrer">
      <span class="material-symbols-outlined" aria-hidden="true">travel_explore</span>
      ${c.siteTour}
    </a>
    <p class="pn-invite">${c.inviteText}</p>
  </div>
</section>

<section class="pn-section">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.faqTitle}</h2>
    <p class="pn-sub">${c.faqSub}</p>
    <div class="pn-faq">${faqItems}</div>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap">
    <div class="pn-zoom" id="zoom">
      <div class="pn-zoom-icon" aria-hidden="true">
        <span class="material-symbols-outlined">videocam</span>
      </div>
      <h2 class="pn-h2">${c.zoomTitle}</h2>
      <p class="pn-sub">${c.zoomSub}</p>
      <p class="pn-zoom-duration">${c.zoomDuration}</p>
      <p class="pn-zoom-note">${c.zoomNote}</p>
      <a href="#inquiry" class="pn-zoom-cta">
        ${c.zoomCta}
        <span class="material-symbols-outlined" style="font-size:18px">arrow_downward</span>
      </a>
    </div>
  </div>
</section>

<section class="pn-form-section" id="inquiry">
  <div class="pn-wrap">
    <div class="pn-form-box">
      <div class="pn-form-head">
        <h2>${c.formTitle}</h2>
        <p>${c.formSub}</p>
      </div>
      <form class="gh-quote-form pn-form" action="https://formsubmit.co/info@3dgraphicshouse.com" method="POST">
        <input type="hidden" name="_subject" value="${c.formSubject}">
        <input type="hidden" name="_next" value="${c.formNext}">
        <div class="pn-form-group">
          <div class="pn-form-group-title">${c.formOrgHeading}</div>
          <div class="pn-form-grid">
            <div class="pn-field pn-field--full">
              <label for="pnSegment">${c.fields.segment} <span class="req">*</span></label>
              <select name="organization_type" id="pnSegment" required>${segmentOptions}</select>
            </div>
            <div class="pn-field">
              <label for="pnCompany">${c.fields.company} <span class="req">*</span></label>
              <input type="text" name="company" id="pnCompany" required autocomplete="organization">
            </div>
            <div class="pn-field">
              <label for="pnCompanyEmail">${c.fields.companyEmail} <span class="req">*</span></label>
              <input type="email" name="company_email" id="pnCompanyEmail" required autocomplete="work email" placeholder="info@company.com">
            </div>
            <div class="pn-field pn-field--full">
              <label for="pnWeb">${c.fields.website}</label>
              <input type="url" name="website" id="pnWeb" placeholder="https://" dir="ltr" style="text-align:left">
            </div>
            <div class="pn-field pn-field--full">
              <label for="pnCollab">${c.fields.collab} <span class="req">*</span></label>
              <select name="collaboration_type" id="pnCollab" required>${collabOptions}</select>
            </div>
          </div>
        </div>
        <div class="pn-form-group">
          <div class="pn-form-group-title">${c.formContactHeading}</div>
          <div class="pn-form-grid">
            <div class="pn-field">
              <label for="pnName">${c.fields.name} <span class="req">*</span></label>
              <input type="text" name="name" id="pnName" required autocomplete="name">
            </div>
            <div class="pn-field">
              <label for="pnRole">${c.fields.role} <span class="req">*</span></label>
              <input type="text" name="job_title" id="pnRole" required autocomplete="organization-title">
            </div>
            <div class="pn-field pn-field--full">
              <label for="pnPhone">${c.fields.phone} <span class="req">*</span></label>
              <input type="tel" name="phone" id="pnPhone" required autocomplete="tel">
            </div>
          </div>
        </div>
        <div class="pn-form-group">
          <div class="pn-form-group-title">${c.formMeetingHeading}</div>
          <div class="pn-form-grid">
            <div class="pn-field pn-field--full">
              <label for="pnMeeting">${c.fields.meetingTimes} <span class="req">*</span></label>
              <input type="text" name="meeting_times" id="pnMeeting" required placeholder="${c.meetingPlaceholder}">
            </div>
            <div class="pn-field pn-field--full">
              <label for="pnBrief">${c.fields.brief}</label>
              <textarea name="message" id="pnBrief" placeholder="${c.briefPlaceholder}"></textarea>
            </div>
            <div class="pn-field pn-field--full">
              <div class="gh-form-security">
                <div class="gh-honeypot" aria-hidden="true">
                  <label>Leave blank</label>
                  <input type="text" name="_honey" tabindex="-1" autocomplete="off">
                </div>
                <div class="gh-turnstile"></div>
              </div>
              <div class="form-feedback" aria-live="polite"></div>
            </div>
          </div>
        </div>
        <button type="submit" class="form-submit pn-submit">
          ${c.submit}
          <span class="material-symbols-outlined" style="font-size:18px">send</span>
        </button>
      </form>
      <div class="pn-alt-cta">
        <a href="https://wa.me/966502786513" class="pn-wa" target="_blank" rel="noopener">${c.wa}</a>
      </div>
    </div>
  </div>
</section>

${footer}

<script defer src="assets/quote-form-config.js"></script>
<script defer src="assets/quote-form.js?v=3"></script>
<script defer src="assets/gh-float-widgets.js?v=8"></script>
<script>
(function(){
  var collab = document.getElementById('pnCollab');
  if (location.hash === '#inquiry' || location.hash === '#zoom') {
    if (collab && !collab.value) collab.value = 'zoom-intro';
  }
  document.querySelector('.pn-zoom-cta')?.addEventListener('click', function() {
    if (collab) collab.value = 'zoom-intro';
  });
  var form = document.querySelector('.pn-form');
  if (form) {
    form.addEventListener('submit', function() {
      var seg = document.getElementById('pnSegment');
      if (typeof window.ghTrack === 'function') {
        window.ghTrack('partner_network_inquiry', {
          organization_type: seg ? seg.value : '',
          page_language: '${c.lang}'
        });
      }
    });
  }
  if (new URLSearchParams(location.search).get('sent') === '1') {
    var box = document.querySelector('.form-feedback');
    if (box) {
      box.className = 'form-feedback is-visible is-success';
      box.textContent = ${JSON.stringify(c.sentMsg)};
    }
  }
})();
</script>
</body>
</html>`;
}

console.log('Building Partner Network pages…');
fs.writeFileSync(path.join(ROOT, 'partner-network.html'), buildPage(COPY.ar), 'utf8');
fs.writeFileSync(path.join(ROOT, 'partner-network-en.html'), buildPage(COPY.en), 'utf8');
console.log('  partner-network.html');
console.log('  partner-network-en.html');
console.log('Done.');
