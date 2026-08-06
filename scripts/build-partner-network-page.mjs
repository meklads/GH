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
      'شراكة Co-Delivery مع وكالات الدعاية والمكاتب الهندسية وشركات المقاولات — طبقة إنتاج بصري وتجريبي من Graphics House.',
    ogTitle: 'شبكة الشركاء — Graphics House',
    eye: 'Partner Network',
    h1: 'نعمل معاً',
    h1Gold: 'أمام العميل',
    lead: 'جرافيكس هاوس — Visualizing Projects. Creating Experiences. شريك إنتاج متخصص في 3D والأفلام والمجسمات والتجارب التفاعلية. بدون white label — كيانان واضحان.',
    segmentsLabel: 'نوع جهتكم',
    segments: [
      { id: 'agency', icon: 'campaign', title: 'وكالات الدعاية والإعلان', desc: 'وسّعوا ما تقدمونه — نُنفّذ الطبقة البصرية والتجريبية بجانبكم.' },
      { id: 'engineering', icon: 'architecture', title: 'المكاتب الهندسية', desc: 'أكملوا العرض الهندسي بـ Project Launch™ — فيلم · مجسم · 3D · تفاعلي.' },
      { id: 'contracting', icon: 'construction', title: 'شركات المقاولات', desc: 'حوّلوا المشاريع قيد التنفيذ إلى تجربة عرض وإقناع للمالك والمستثمر.' },
      { id: 'other', icon: 'domain', title: 'أخرى', desc: 'جهة أخرى — حدّدوا اسم الشركة في النموذج أدناه.' },
    ],
    fitTitle: 'أين نكمل بعضنا',
    fitYou: 'ما تملكونه',
    fitUs: 'ما نضيفه',
    fitRows: [
      ['العميل والعلاقة', '3D · CGI · مجسمات'],
      ['الاستراتيجية · الحملة · الهندسة', 'أفلام · تفاعلي · بيئات عرض'],
    ],
    fitNote: 'تعارف متبادل عند الحاجة — Co-Delivery ظاهر — لا وسيط ثالث.',
    exploreTitle: 'استكشفوا قدراتنا',
    exploreSub: 'تعرّفوا على خدماتنا في الموقع — ثم لنحدد موعداً للاجتماع.',
    links: [
      { href: 'solutions/project-launch.html', label: 'Project Launch™', sub: 'حزمة إطلاق المشروع' },
      { href: 'services/animation.html', label: 'أفلام CGI', sub: 'تحريك سينمائي' },
      { href: 'services/maquettes.html', label: 'المجسمات', sub: 'مجسمات معمارية' },
      { href: 'services/rendering.html', label: 'الإظهار المعماري', sub: '3D · renders' },
      { href: 'services/interactive.html', label: 'التجارب التفاعلية', sub: 'شاشات · VR' },
      { href: 'portfolio.html', label: 'معرض الأعمال', sub: 'عند الرغبة' },
    ],
    siteTour: 'تجول في الموقع',
    siteTourHref: 'index-ar.html',
    stepsTitle: 'كيف نبدأ',
    steps: ['اجتماع تعارف 20–30 دقيقة', 'brief أو مشروع محدد', 'Co-Delivery أمام العميل'],
    formTitle: 'طلب شراكة / اجتماع',
    formSub: 'نموذج رسمي لطلبات الشراكة والتعاون — نرد خلال 24 ساعة عمل.',
    formSubject: 'طلب شراكة — شبكة الشركاء AR',
    formNext: `${BASE}/partner-network.html?sent=1#inquiry`,
    fields: {
      segment: 'نوع الجهة',
      company: 'اسم الشركة',
      companyEmail: 'البريد الإلكتروني الرسمي للشركة',
      name: 'اسم المسؤول',
      role: 'المسمى الوظيفي',
      phone: 'رقم التواصل',
      website: 'موقع الشركة',
      collab: 'نوع التعاون المطلوب',
      brief: 'نبذة عن الفرصة أو المشروع',
    },
    collabOptions: [
      { v: '', l: 'اختر نوع التعاون' },
      { v: 'co-delivery', l: 'Co-Delivery — تسليم مشترك أمام العميل' },
      { v: 'referral', l: 'تعارف بمشروع محدد' },
      { v: 'capabilities', l: 'استكشاف القدرات — اجتماع أول' },
      { v: 'strategic', l: 'شراكة استراتيجية' },
    ],
    submit: 'إرسال الطلب الرسمي',
    wa: 'واتساب',
    meeting: 'أو احجز اجتماعاً عبر النموذج',
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
      'Co-Delivery partnerships with agencies, engineering firms, and contractors — visual and experiential production by Graphics House.',
    ogTitle: 'Partner Network — Graphics House',
    eye: 'Partner Network',
    h1: 'Work together',
    h1Gold: 'in front of the client',
    lead: 'Graphics House — Visualizing Projects. Creating Experiences. Specialist production in 3D, film, maquettes, and interactive experiences. No white label — two clear entities.',
    segmentsLabel: 'Your organization type',
    segments: [
      { id: 'agency', icon: 'campaign', title: 'Advertising & Creative Agencies', desc: 'Extend what you deliver — we execute the visual and experiential layer beside you.' },
      { id: 'engineering', icon: 'architecture', title: 'Engineering Firms', desc: 'Complete your design package with Project Launch™ — film · maquette · 3D · interactive.' },
      { id: 'contracting', icon: 'construction', title: 'Contracting Companies', desc: 'Turn active projects into compelling presentation experiences for owners and investors.' },
      { id: 'other', icon: 'domain', title: 'Other', desc: 'Another organization — specify your company name in the form below.' },
    ],
    fitTitle: 'Where we complement each other',
    fitYou: 'You bring',
    fitUs: 'We add',
    fitRows: [
      ['Client relationship', '3D · CGI · maquettes'],
      ['Strategy · campaign · engineering', 'Films · interactive · presentation environments'],
    ],
    fitNote: 'Mutual introductions when needed — visible Co-Delivery — no third-party intermediary.',
    exploreTitle: 'Explore our capabilities',
    exploreSub: 'Review our services on the site — then let\'s schedule a meeting.',
    links: [
      { href: 'solutions/project-launch-en.html', label: 'Project Launch™', sub: 'Launch system' },
      { href: 'services/animation-en.html', label: 'CGI Films', sub: 'Cinematic animation' },
      { href: 'services/maquettes-en.html', label: 'Scale Models', sub: 'Architectural maquettes' },
      { href: 'services/rendering-en.html', label: 'Visualization', sub: '3D · renders' },
      { href: 'services/interactive-en.html', label: 'Interactive', sub: 'Screens · VR' },
      { href: 'portfolio-en.html', label: 'Portfolio', sub: 'If you wish' },
    ],
    siteTour: 'Browse the site',
    siteTourHref: 'index.html',
    stepsTitle: 'How we start',
    steps: ['20–30 minute introduction call', 'Specific brief or project', 'Co-Delivery in front of the client'],
    formTitle: 'Partnership / Meeting Request',
    formSub: 'Formal inquiry for partnership and collaboration — we respond within 24 business hours.',
    formSubject: 'Partnership inquiry — Partner Network EN',
    formNext: `${BASE}/partner-network-en.html?sent=1#inquiry`,
    fields: {
      segment: 'Organization type',
      company: 'Company name',
      companyEmail: 'Official company email',
      name: 'Contact name',
      role: 'Job title',
      phone: 'Phone',
      website: 'Company website',
      collab: 'Collaboration type',
      brief: 'Brief about the opportunity or project',
    },
    collabOptions: [
      { v: '', l: 'Select collaboration type' },
      { v: 'co-delivery', l: 'Co-Delivery — joint delivery to client' },
      { v: 'referral', l: 'Project-specific introduction' },
      { v: 'capabilities', l: 'Explore capabilities — first meeting' },
      { v: 'strategic', l: 'Strategic partnership' },
    ],
    submit: 'Submit formal request',
    wa: 'WhatsApp',
    meeting: 'Or request a meeting via the form',
    langSwitch: 'العربية',
    langHref: 'partner-network.html',
  },
};

function buildPage(c) {
  const isEn = c.lang === 'en';
  const P = '';
  const header = renderHeader(0, isEn);
  const footer = renderFooter(0, isEn);

  const segmentCards = c.segments
    .map(
      (s, i) => `
    <button type="button" class="pn-seg${i === 0 ? ' is-active' : ''}" data-segment="${s.id}" aria-pressed="${i === 0 ? 'true' : 'false'}">
      <span class="material-symbols-outlined pn-seg-icon" aria-hidden="true">${s.icon}</span>
      <span class="pn-seg-title">${s.title}</span>
      <span class="pn-seg-desc">${s.desc}</span>
    </button>`
    )
    .join('');

  const segmentOptions = c.segments
    .map((s) => `<option value="${s.id}"${s.id === 'agency' ? ' selected' : ''}>${s.title}</option>`)
    .join('');

  const collabOptions = c.collabOptions.map((o) => `<option value="${o.v}">${o.l}</option>`).join('');

  const exploreLinks = c.links
    .map(
      (l) => `
    <a href="${l.href}" class="pn-link-card">
      <span class="pn-link-label">${l.label}</span>
      <span class="pn-link-sub">${l.sub}</span>
      <span class="material-symbols-outlined pn-link-arrow" aria-hidden="true">arrow_forward</span>
    </a>`
    )
    .join('');

  const fitRows = c.fitRows
    .map(
      ([you, us]) => `
    <div class="pn-fit-row">
      <div class="pn-fit-cell pn-fit-you"><span class="pn-fit-tag">${c.fitYou}</span>${you}</div>
      <div class="pn-fit-cell pn-fit-us"><span class="pn-fit-tag">${c.fitUs}</span>${us}</div>
    </div>`
    )
    .join('');

  const steps = c.steps.map((s) => `<li>${s}</li>`).join('');

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
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="assets/gh-site-enhancements.css?v=21">
<link rel="stylesheet" href="assets/site-header.css?v=33">
<link rel="stylesheet" href="assets/gh-float-widgets.css?v=8">
<style>
:root {
  --gold: #C9A84C;
  --gold-soft: rgba(201,168,76,0.12);
  --ink: #1A1A1A;
  --muted: rgba(26,26,26,0.58);
  --line: rgba(26,26,26,0.08);
  --white: #FFFFFF;
  --bg: #FAFAF8;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body {
  font-family: ${isEn ? "'Inter','Tajawal'" : "'Tajawal','Inter'"}, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.pn-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
@media(min-width:768px){ .pn-wrap { padding: 0 40px; } }

.pn-lang {
  position: fixed; top: 96px; ${isEn ? 'right' : 'left'}: 20px; z-index: 100;
  font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--muted); text-decoration: none; padding: 8px 14px;
  background: var(--white); border: 1px solid var(--line); border-radius: 999px;
  transition: border-color 0.25s, color 0.25s;
}
.pn-lang:hover { border-color: var(--gold); color: var(--ink); }

.pn-hero {
  padding: 140px 0 56px;
  background: linear-gradient(180deg, var(--white) 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--line);
}
.pn-eye {
  display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 16px;
}
.pn-h1 {
  font-size: clamp(32px, 5vw, 52px); font-weight: 700; line-height: 1.15;
  letter-spacing: -0.02em; margin-bottom: 16px; color: var(--ink);
}
.pn-h1 em { font-style: normal; color: var(--gold); }
.pn-lead {
  font-size: clamp(16px, 1.8vw, 18px); line-height: 1.85; color: var(--muted);
  max-width: 640px; font-weight: 400;
}

.pn-segments { padding: 48px 0 32px; }
.pn-seg-label {
  font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 16px; display: block;
}
.pn-seg-grid {
  display: grid; grid-template-columns: 1fr; gap: 10px;
}
@media(min-width:640px){ .pn-seg-grid { grid-template-columns: repeat(2, 1fr); } }
@media(min-width:960px){ .pn-seg-grid { grid-template-columns: repeat(4, 1fr); } }
.pn-seg {
  text-align: ${isEn ? 'left' : 'right'}; padding: 22px 20px; background: var(--white);
  border: 1.5px solid var(--line); border-radius: 12px; cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.25s;
  font-family: inherit; color: inherit; width: 100%;
}
.pn-seg:hover { border-color: rgba(201,168,76,0.35); box-shadow: 0 8px 32px rgba(0,0,0,0.04); }
.pn-seg.is-active {
  border-color: var(--gold); background: linear-gradient(135deg, var(--white), rgba(201,168,76,0.06));
  box-shadow: 0 12px 40px rgba(201,168,76,0.12);
}
.pn-seg-icon { font-size: 28px; color: var(--gold); display: block; margin-bottom: 12px; }
.pn-seg-title { display: block; font-size: 15px; font-weight: 700; margin-bottom: 6px; line-height: 1.35; }
.pn-seg-desc { display: block; font-size: 13px; color: var(--muted); line-height: 1.65; font-weight: 400; }

.pn-section { padding: 56px 0; }
.pn-section--white { background: var(--white); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.pn-h2 { font-size: clamp(22px, 3vw, 30px); font-weight: 700; margin-bottom: 10px; letter-spacing: -0.02em; }
.pn-sub { font-size: 15px; color: var(--muted); line-height: 1.75; margin-bottom: 28px; max-width: 560px; }

.pn-fit { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.pn-fit-row { display: grid; grid-template-columns: 1fr; gap: 8px; }
@media(min-width:768px){ .pn-fit-row { grid-template-columns: 1fr 1fr; } }
.pn-fit-cell {
  padding: 18px 20px; background: var(--bg); border: 1px solid var(--line); border-radius: 10px;
  font-size: 14px; line-height: 1.6;
}
.pn-fit-us { background: var(--gold-soft); border-color: rgba(201,168,76,0.22); }
.pn-fit-tag {
  display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 6px;
}
.pn-fit-note { font-size: 13px; color: var(--muted); line-height: 1.7; }

.pn-links {
  display: grid; grid-template-columns: 1fr; gap: 10px;
}
@media(min-width:640px){ .pn-links { grid-template-columns: repeat(2, 1fr); } }
@media(min-width:960px){ .pn-links { grid-template-columns: repeat(3, 1fr); } }
.pn-link-card {
  display: flex; flex-direction: column; gap: 4px; padding: 20px 18px;
  background: var(--white); border: 1px solid var(--line); border-radius: 10px;
  text-decoration: none; color: inherit; position: relative; min-height: 88px;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.pn-link-card:hover { border-color: var(--gold); box-shadow: 0 8px 28px rgba(0,0,0,0.05); }
.pn-link-label { font-size: 14px; font-weight: 700; color: var(--ink); }
.pn-link-sub { font-size: 12px; color: var(--muted); }
.pn-link-arrow {
  position: absolute; bottom: 16px; ${isEn ? 'right' : 'left'}: 16px;
  font-size: 18px; color: var(--gold); opacity: 0.7;
}
html[dir="rtl"] .pn-link-arrow { transform: scaleX(-1); }

.pn-tour {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 24px;
  font-size: 13px; font-weight: 600; color: var(--ink); text-decoration: none;
  padding: 12px 22px; border: 1.5px solid var(--line); border-radius: 999px;
  background: var(--white); transition: all 0.25s;
}
.pn-tour:hover { border-color: var(--gold); color: var(--gold); }

.pn-steps { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.pn-steps li {
  display: flex; align-items: flex-start; gap: 14px; font-size: 15px; line-height: 1.6;
  padding: 16px 18px; background: var(--white); border: 1px solid var(--line); border-radius: 10px;
}
.pn-steps li::before {
  content: counter(step); counter-increment: step;
  width: 28px; height: 28px; min-width: 28px; border-radius: 50%;
  background: var(--gold-soft); color: var(--gold); font-size: 12px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.pn-steps { counter-reset: step; }

.pn-form-section {
  padding: 64px 0 100px;
  background: linear-gradient(180deg, var(--bg) 0%, var(--white) 40%);
}
.pn-form-box {
  background: var(--white); border: 1px solid var(--line); border-radius: 16px;
  padding: 40px 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.05);
}
@media(min-width:768px){ .pn-form-box { padding: 48px 44px; } }
.pn-form-head { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--line); }
.pn-form-head h2 { font-size: clamp(22px, 3vw, 28px); font-weight: 700; margin-bottom: 8px; }
.pn-form-head p { font-size: 14px; color: var(--muted); line-height: 1.75; }

.pn-form-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media(min-width:640px){ .pn-form-grid { grid-template-columns: 1fr 1fr; } }
.pn-form-grid .pn-field--full { grid-column: 1 / -1; }

.pn-field { display: flex; flex-direction: column; gap: 6px; }
.pn-field label {
  font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: rgba(26,26,26,0.55);
}
.pn-field label .req { color: var(--gold); margin-${isEn ? 'left' : 'right'}: 2px; }
.pn-field input, .pn-field select, .pn-field textarea {
  padding: 13px 16px; font-size: 14px; font-family: inherit;
  border: 1.5px solid var(--line); border-radius: 8px; background: var(--bg);
  color: var(--ink); outline: none; transition: border-color 0.25s, box-shadow 0.25s;
  ${isEn ? '' : 'text-align: right;'}
}
.pn-field input:focus, .pn-field select:focus, .pn-field textarea:focus {
  border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.14); background: var(--white);
}
.pn-field input[type="email"] { direction: ltr; text-align: left; }
.pn-field textarea { min-height: 120px; resize: vertical; }
.pn-field select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: ${isEn ? 'right' : 'left'} 12px center; padding-${isEn ? 'right' : 'left'}: 36px; }

.pn-submit {
  width: 100%; margin-top: 8px; padding: 16px 28px; font-size: 14px; font-weight: 700;
  letter-spacing: 0.04em; font-family: inherit; cursor: pointer;
  background: var(--ink); color: var(--white); border: none; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  transition: background 0.3s, transform 0.25s, box-shadow 0.25s;
}
.pn-submit:hover { background: #333; transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0,0,0,0.12); }
.pn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.pn-alt-cta {
  margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--line);
  display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 13px; color: var(--muted);
}
.pn-wa {
  display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
  background: #25D366; color: #fff; text-decoration: none; border-radius: 999px;
  font-size: 13px; font-weight: 600; transition: transform 0.2s;
}
.pn-wa:hover { transform: scale(1.03); }

.header { background: rgba(255,255,255,0.92) !important; border-bottom: 1px solid var(--line) !important; }
</style>
<script defer src="assets/site-header.js?v=16"></script>
<script defer src="assets/gh-performance.js?v=3"></script>
<script defer src="assets/lang-switch.js?v=2"></script>
</head>
<body>
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

<section class="pn-segments" aria-label="${c.segmentsLabel}">
  <div class="pn-wrap">
    <span class="pn-seg-label">${c.segmentsLabel}</span>
    <div class="pn-seg-grid" role="group">${segmentCards}</div>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.fitTitle}</h2>
    <div class="pn-fit">${fitRows}</div>
    <p class="pn-fit-note">${c.fitNote}</p>
  </div>
</section>

<section class="pn-section">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.exploreTitle}</h2>
    <p class="pn-sub">${c.exploreSub}</p>
    <div class="pn-links">${exploreLinks}</div>
    <a href="${c.siteTourHref}" class="pn-tour">
      <span class="material-symbols-outlined" aria-hidden="true">travel_explore</span>
      ${c.siteTour}
    </a>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.stepsTitle}</h2>
    <ol class="pn-steps">${steps}</ol>
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
        <input type="hidden" name="segment_type" id="pnSegmentHidden" value="agency">
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
          <div class="pn-field">
            <label for="pnName">${c.fields.name} <span class="req">*</span></label>
            <input type="text" name="name" id="pnName" required autocomplete="name">
          </div>
          <div class="pn-field">
            <label for="pnRole">${c.fields.role} <span class="req">*</span></label>
            <input type="text" name="job_title" id="pnRole" required autocomplete="organization-title">
          </div>
          <div class="pn-field">
            <label for="pnPhone">${c.fields.phone} <span class="req">*</span></label>
            <input type="tel" name="phone" id="pnPhone" required autocomplete="tel">
          </div>
          <div class="pn-field">
            <label for="pnWeb">${c.fields.website}</label>
            <input type="url" name="website" id="pnWeb" placeholder="https://" dir="ltr" style="text-align:left">
          </div>
          <div class="pn-field pn-field--full">
            <label for="pnCollab">${c.fields.collab} <span class="req">*</span></label>
            <select name="collaboration_type" id="pnCollab" required>${collabOptions}</select>
          </div>
          <div class="pn-field pn-field--full">
            <label for="pnBrief">${c.fields.brief}</label>
            <textarea name="message" id="pnBrief" placeholder=""></textarea>
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
        <button type="submit" class="form-submit pn-submit">
          ${c.submit}
          <span class="material-symbols-outlined" style="font-size:18px">send</span>
        </button>
      </form>
      <div class="pn-alt-cta">
        <span>${c.meeting}</span>
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
  var segBtns = document.querySelectorAll('.pn-seg');
  var segSelect = document.getElementById('pnSegment');
  var segHidden = document.getElementById('pnSegmentHidden');
  function setSegment(id) {
    segBtns.forEach(function(btn) {
      var on = btn.getAttribute('data-segment') === id;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (segSelect) segSelect.value = id;
    if (segHidden) segHidden.value = id;
  }
  segBtns.forEach(function(btn) {
    btn.addEventListener('click', function() { setSegment(btn.getAttribute('data-segment')); });
  });
  if (segSelect) {
    segSelect.addEventListener('change', function() { setSegment(segSelect.value); });
  }
  var form = document.querySelector('.pn-form');
  if (form) {
    form.addEventListener('submit', function() {
      if (typeof window.ghTrack === 'function') {
        window.ghTrack('partner_network_inquiry', {
          organization_type: segHidden ? segHidden.value : '',
          page_language: '${c.lang}'
        });
      }
    });
  }
  if (new URLSearchParams(location.search).get('sent') === '1') {
    var box = document.querySelector('.form-feedback');
    if (box) {
      box.className = 'form-feedback is-visible is-success';
      box.textContent = ${isEn ? "'Thank you. We will respond within 24 business hours.'" : "'شكراً. سنتواصل معكم خلال 24 ساعة عمل.'"};
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
