#!/usr/bin/env node
/**
 * Partner Network landing — AR + EN (agency-first channel partner positioning).
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
      'وسّع قدرات وكالتك — Graphics House شريك إنتاج بصري وتجريبي متخصص لوكالات الإعلان والإبداع في المملكة ودول الخليج.',
    ogTitle: 'شبكة الشركاء — Graphics House',
    eye: 'Visual & Experiential Production Partner',
    h1: 'وسّع قدرات وكالتك',
    h1Gold: 'دون بناء فريق جديد',
    lead:
      'Graphics House شريككم المتخصص في تحويل المشاريع إلى تجارب بصرية ومادية — من 3D والأفلام السينمائية إلى المجسمات والتجارب التفاعلية وبيئات العرض.',
    heroYou: 'أنتم تملكون العميل والاستراتيجية.',
    heroUs: 'ونحن نضيف طبقة التنفيذ البصري والتجريبي — دون أن ننافسكم على العميل.',
    segmentsLabel: 'نوع جهتكم',
    segmentsNote: 'وكالات الإعلان والإبداع — شركاؤنا الأساسيون',
    segments: [
      { id: 'agency', icon: 'campaign', title: 'وكالات الدعاية والإعلان', desc: 'وسّعوا ما تقدمونه — نُنفّذ الطبقة البصرية والتجريبية بجانبكم.', featured: true },
      { id: 'engineering', icon: 'architecture', title: 'المكاتب الهندسية', desc: 'أكملوا العرض الهندسي بـ Project Launch™ — فيلم · مجسم · 3D · تفاعلي.' },
      { id: 'contracting', icon: 'construction', title: 'شركات المقاولات', desc: 'حوّلوا المشاريع قيد التنفيذ إلى تجربة عرض وإقناع للمالك والمستثمر.' },
      { id: 'other', icon: 'domain', title: 'أخرى', desc: 'جهة أخرى — حدّدوا التفاصيل في النموذج أدناه.' },
    ],
    whyTitle: 'ماذا تكسب الوكالة؟',
    whySub: 'شراكة تساعدكم على الفوز بمشاريع أكبر وتنفيذها — لا مجرد مورد.',
    benefits: [
      { title: 'وسّع خدماتك', desc: 'قدّم للعميل قدرات إضافية دون إضافة أقسام جديدة.' },
      { title: 'ارفع قيمة عروضك', desc: 'أدخل 3D والمجسمات والأفلام والتجارب التفاعلية في الـPitch والمشاريع.' },
      { title: 'اختصر وقت التنفيذ', desc: 'شريك متخصص بدل تنسيق عدة موردين مستقلين.' },
      { title: 'قلّل التكلفة الثابتة', desc: 'لا حاجة لبناء فريق إنتاج متخصص دائم داخل الوكالة.' },
      { title: 'ادخل مشاريع أكبر', desc: 'قدرات إضافية تتيح المنافسة على Briefs أكثر تعقيدًا.' },
    ],
    complementTitle: 'حل أقوى للعميل',
    complementYou: 'وكالتكم',
    complementYouItems: ['الاستراتيجية', 'العلامة', 'الحملة', 'التسويق', 'العلاقة مع العميل'],
    complementUs: 'Graphics House',
    complementUsItems: ['3D', 'أفلام', 'مجسمات', 'تفاعلي', 'تجارب'],
    complementResult: '= حل أقوى للعميل',
    pitchTitle: 'اربحوا المزيد من الـPitch',
    pitchLead: 'ادخلوا Graphics House في عرضكم القادم — وقوّوا الجانب الإنتاجي من مقترحكم.',
    pitchSub: 'وكالة لديها Pitch غدًا وتحتاج تجربة تفاعلية + مجسم + فيلم + 3D؟ نساعدكم في بناء الجزء البصري — وإذا فزتم بالمشروع، ننفّذه معكم.',
    plTitle: 'Project Launch™',
    plSub: 'Bring Your Project to Life Before It Is Built.',
    plItems: ['Masterplan Visualization', 'Cinematic Film', 'Architectural Maquette', 'Interactive Experience', 'Presentation Environment'],
    plNote: 'مثال على ما يمكننا بناؤه معكم — للمشاريع العقارية، تدمج الوكالة هذه القدرات ضمن استراتيجيتها بينما تتولى Graphics House طبقة الإنتاج المتخصصة.',
    plHref: 'solutions/project-launch.html',
    plCta: 'استكشف Project Launch™',
    capabilitiesTitle: 'قدرات الإنتاج',
    capabilitiesSub: 'Visual & Experiential Production — ليس وكالة تسويق متكاملة.',
    links: [
      { href: 'services/animation.html', label: 'أفلام CGI', sub: 'إنتاج سينمائي', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { href: 'services/maquettes.html', label: 'المجسمات', sub: 'مجسمات معمارية', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { href: 'services/rendering.html', label: 'الإظهار المعماري', sub: '3D · renders', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { href: 'services/interactive.html', label: 'التجارب التفاعلية', sub: 'شاشات · VR', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
    ],
    caseLabel: 'Selected Collaboration',
    caseTitle: 'Muslim World League Exhibition',
    caseDesc: 'تجارب تفاعلية + مجسمات معمارية + بيئة عرض',
    caseHref: 'casestudy1.html',
    caseCta: 'شاهد المشروع',
    caseImg: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
    caseWebp: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
    aboutText:
      'منذ 2004، بخبرة تتجاوز 20 عامًا في الإنتاج البصري والتجارب للمشاريع الكبرى في المملكة ودول الخليج. نُضيف طبقة إنتاج متخصصة إلى منظومة خدماتكم — **لا ننافسكم** على العميل أو الاستراتيجية.',
    ctaTitle: 'لنبني معًا',
    ctaLead: 'لديكم مشروع أو Pitch يحتاج قدرات بصرية أو تجريبية متقدمة؟ دعونا نبحث عن طريقة لبنائه معًا.',
    ctaBtn: 'ابدأ محادثة الشراكة',
    faqTitle: 'أسئلة شائعة',
    faqSub: 'إجابات مختصرة على ما يهم شركاءنا.',
    faq: [
      { q: 'هل Graphics House منافس لوكالتي؟', a: 'لا. نحن شريك إنتاج متخصص — أنتم تبقون على العميل والاستراتيجية، ونحن نُنفّذ الطبقة البصرية والتجريبية.' },
      { q: 'هل تقدمون White Label؟', a: 'نعم، يمكن تنظيم بعض المشاريع بصيغة White Label وفق طبيعة الشراكة واتفاق الطرفين، مع الالتزام الكامل بالسرية وحماية علاقة العميل. كما يمكن العمل بنموذج Co-Delivery أو شراكة إنتاجية مشتركة.' },
      { q: 'هل تحتاجون إلى تحويل العميل إليكم؟', a: 'لا. يمكن للوكالة أن تحتفظ بعلاقة العميل وإدارة الحساب، ونحدد نموذج العمل وفق طبيعة المشروع.' },
      { q: 'هل يمكن استخدام Graphics House في عروضنا وPitch Decks؟', a: 'نعم. يمكن التنسيق معنا لدعم العروض والمشاريع التي تتطلب قدراتنا المتخصصة — قبل ترسية المشروع.' },
      { q: 'كيف نبدأ؟', a: 'بجلسة تعارف (20–30 دقيقة)، ثم تحديد نطاق المشروع أو فرصة التعاون، يليه تنفيذ مشترك بإطار واضح.' },
      { q: 'ما مدة الرد على الطلب؟', a: 'يراجع فريق الشراكات كل طلب ويرد خلال 24 ساعة عمل.' },
    ],
    formTitle: 'محادثة الشراكة',
    formSub: 'يُراجع فريق الشراكات طلبكم ويتواصل معكم خلال 24 ساعة عمل.',
    formSubject: 'طلب شراكة — شبكة الشركاء AR',
    formNext: `${BASE}/partner-network.html?sent=1#inquiry`,
    fields: { segment: 'نوع الشركة', collab: 'كيف يمكن أن نتعاون؟', name: 'الاسم', role: 'المنصب', email: 'البريد الإلكتروني', phone: 'الجوال', message: 'نص الرسالة' },
    segmentOptions: [
      { v: '', l: 'اختر نوع الشركة' },
      { v: 'agency', l: 'وكالات الدعاية والإعلان' },
      { v: 'engineering', l: 'المكاتب الهندسية' },
      { v: 'contracting', l: 'شركات المقاولات' },
      { v: 'other', l: 'أخرى' },
    ],
    collabOptions: [
      { v: '', l: 'اختر نوع التعاون' },
      { v: 'production-partnership', l: 'شراكة إنتاجية' },
      { v: 'co-delivery', l: 'Co-Delivery — تسليم مشترك' },
      { v: 'referral', l: 'إحالة مشاريع' },
      { v: 'white-label', l: 'White Label — وفق الاتفاق' },
      { v: 'pitch-support', l: 'دعم Pitch / عروض تقديمية' },
      { v: 'active-project', l: 'مشروع قائم' },
      { v: 'strategic', l: 'شراكة استراتيجية' },
    ],
    messagePlaceholder: 'موعد مناسب للاجتماع، أو تفاصيل المشروع / الـPitch.',
    submit: 'إرسال الطلب',
    sentMsg: 'شكراً لتواصلكم. سيتواصل فريق الشراكات معكم خلال 24 ساعة عمل.',
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
      'Expand your agency capabilities — Graphics House is your specialist visual and experiential production partner across the GCC.',
    ogTitle: 'Partner Network — Graphics House',
    eye: 'Visual & Experiential Production Partner',
    h1: 'Expand your agency',
    h1Gold: 'without building a new team',
    lead:
      'Graphics House is your specialist partner in turning projects into visual and physical experiences — from 3D and cinematic film to maquettes, interactive experiences, and presentation environments.',
    heroYou: 'You own the client and the strategy.',
    heroUs: 'We add the visual and experiential production layer — without competing for the client.',
    segmentsLabel: 'Your organization type',
    segmentsNote: 'Advertising & creative agencies — our primary partners',
    segments: [
      { id: 'agency', icon: 'campaign', title: 'Advertising & creative agencies', desc: 'Extend what you deliver — we execute the visual and experiential layer beside you.', featured: true },
      { id: 'engineering', icon: 'architecture', title: 'Engineering firms', desc: 'Complete your design package with Project Launch™ — film · maquette · 3D · interactive.' },
      { id: 'contracting', icon: 'construction', title: 'Contracting companies', desc: 'Turn active projects into compelling presentation experiences for owners and investors.' },
      { id: 'other', icon: 'domain', title: 'Other', desc: 'Another organization — share details in the form below.' },
    ],
    whyTitle: 'What your agency gains',
    whySub: 'A partnership that helps you win and deliver bigger projects — not just another vendor.',
    benefits: [
      { title: 'Expand your services', desc: 'Offer clients additional capabilities without building new departments.' },
      { title: 'Raise proposal value', desc: 'Bring 3D, maquettes, film, and interactive into pitches and live projects.' },
      { title: 'Shorten delivery time', desc: 'One specialist partner instead of coordinating multiple vendors.' },
      { title: 'Reduce fixed cost', desc: 'No need for a permanent in-house production team.' },
      { title: 'Win bigger briefs', desc: 'Added capabilities to compete on more complex opportunities.' },
    ],
    complementTitle: 'A more powerful client solution',
    complementYou: 'Your agency',
    complementYouItems: ['Strategy', 'Brand', 'Campaign', 'Marketing', 'Client relationship'],
    complementUs: 'Graphics House',
    complementUsItems: ['3D', 'Films', 'Maquettes', 'Interactive', 'Experiences'],
    complementResult: '= A more powerful client solution',
    pitchTitle: 'Win more pitches',
    pitchLead: 'Bring Graphics House into your next complex pitch and strengthen the production side of your proposal.',
    pitchSub: 'Pitch tomorrow and need interactive + maquette + film + 3D? We help you build the visual layer — and if you win, we execute with you.',
    plTitle: 'Project Launch™',
    plSub: 'Bring Your Project to Life Before It Is Built.',
    plItems: ['Masterplan Visualization', 'Cinematic Film', 'Architectural Maquette', 'Interactive Experience', 'Presentation Environment'],
    plNote: 'An example of what we can build with you — for real estate projects, your agency integrates these capabilities into its strategy while Graphics House handles specialist production.',
    plHref: 'solutions/project-launch-en.html',
    plCta: 'Explore Project Launch™',
    capabilitiesTitle: 'Production capabilities',
    capabilitiesSub: 'Visual & experiential production — not a full-service marketing agency.',
    links: [
      { href: 'services/animation-en.html', label: 'CGI Films', sub: 'Cinematic production', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { href: 'services/maquettes-en.html', label: 'Scale Models', sub: 'Architectural maquettes', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { href: 'services/rendering-en.html', label: 'Visualization', sub: '3D · renders', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { href: 'services/interactive-en.html', label: 'Interactive', sub: 'Screens · VR', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
    ],
    caseLabel: 'Selected Collaboration',
    caseTitle: 'Muslim World League Exhibition',
    caseDesc: 'Interactive experiences + architectural maquettes + presentation environment',
    caseHref: 'case-study-mwl-en.html',
    caseCta: 'View the project',
    caseImg: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
    caseWebp: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
    aboutText:
      'Since 2004 — over 20 years of visual and experiential production for major projects across Saudi Arabia and the GCC. We add a specialist production layer to your offering. **We do not compete** for the client or the strategy.',
    ctaTitle: "Let's build together",
    ctaLead: "Have a project or pitch that needs advanced visual or experiential capabilities? Let's find a way to build it together.",
    ctaBtn: 'Start partnership conversation',
    faqTitle: 'Frequently asked questions',
    faqSub: 'Brief answers for potential partners.',
    faq: [
      { q: 'Is Graphics House a competitor to my agency?', a: 'No. We are a specialist production partner — you keep the client and strategy; we execute the visual and experiential layer.' },
      { q: 'Do you offer white label?', a: 'Yes. Some projects can be structured as white label according to the partnership and agreement, with full confidentiality and protection of your client relationship. Co-Delivery and joint production models are also available.' },
      { q: 'Do you need us to hand over the client?', a: 'No. Your agency can retain the client relationship and account management; we define the working model per project.' },
      { q: 'Can we use Graphics House in pitches and pitch decks?', a: 'Yes. We can support proposals that require our specialist capabilities — including before the project is awarded.' },
      { q: 'How do we start?', a: 'With a 20–30 minute introduction, then scope definition, followed by joint execution with a clear framework.' },
      { q: 'How quickly do you respond?', a: 'Our partnerships team reviews every request and responds within 24 business hours.' },
    ],
    formTitle: 'Partnership conversation',
    formSub: 'Our partnerships team will review your request and contact you within 24 business hours.',
    formSubject: 'Partnership inquiry — Partner Network EN',
    formNext: `${BASE}/partner-network-en.html?sent=1#inquiry`,
    fields: { segment: 'Company type', collab: 'How can we collaborate?', name: 'Name', role: 'Job title', email: 'Email', phone: 'Mobile', message: 'Message' },
    segmentOptions: [
      { v: '', l: 'Select company type' },
      { v: 'agency', l: 'Advertising & creative agencies' },
      { v: 'engineering', l: 'Engineering firms' },
      { v: 'contracting', l: 'Contracting companies' },
      { v: 'other', l: 'Other' },
    ],
    collabOptions: [
      { v: '', l: 'Select collaboration type' },
      { v: 'production-partnership', l: 'Production partnership' },
      { v: 'co-delivery', l: 'Co-Delivery — joint delivery' },
      { v: 'referral', l: 'Project referral' },
      { v: 'white-label', l: 'White label — by agreement' },
      { v: 'pitch-support', l: 'Pitch / proposal support' },
      { v: 'active-project', l: 'Active project' },
      { v: 'strategic', l: 'Strategic partnership' },
    ],
    messagePlaceholder: 'Preferred meeting time, or project / pitch details.',
    submit: 'Submit inquiry',
    sentMsg: 'Thank you. Our partnerships team will contact you within 24 business hours.',
    wa: 'WhatsApp',
    langSwitch: 'العربية',
    langHref: 'partner-network.html',
  },
};

function buildPage(c) {
  const isEn = c.lang === 'en';
  const header = renderHeader(0, isEn);
  const footer = renderFooter(0, isEn);
  const ff = isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif";

  const segmentOptions = c.segmentOptions.map((o) => `<option value="${o.v}">${o.l}</option>`).join('');
  const collabOptions = c.collabOptions.map((o) => `<option value="${o.v}">${o.l}</option>`).join('');

  const segmentCards = c.segments
    .map((s, i) => {
      const cls = ['pn-seg', i === 0 ? 'is-active' : '', s.featured ? 'pn-seg--featured' : ''].filter(Boolean).join(' ');
      return `
    <button type="button" class="${cls}" data-segment="${s.id}" aria-pressed="${i === 0 ? 'true' : 'false'}">
      <span class="material-symbols-outlined pn-seg-icon" aria-hidden="true">${s.icon}</span>
      <span class="pn-seg-title">${s.title}</span>
      <span class="pn-seg-desc">${s.desc}</span>
    </button>`;
    })
    .join('');

  const benefitsHtml = c.benefits
    .map((b) => `<div class="pn-benefit"><h3>${b.title}</h3><p>${b.desc}</p></div>`)
    .join('');

  const complementYou = c.complementYouItems.map((x) => `<span>${x}</span>`).join('');
  const complementUs = c.complementUsItems.map((x) => `<span>${x}</span>`).join('');
  const plItems = c.plItems.map((x) => `<li>${x}</li>`).join('');

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
    .map((item, i) => `
    <details class="pn-faq-item"${i === 0 ? ' open' : ''}>
      <summary class="pn-faq-q">${item.q}</summary>
      <p class="pn-faq-a">${item.a}</p>
    </details>`)
    .join('');

  const aboutHtml = c.aboutText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

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
:root{--gold:#C9A84C;--gold-soft:rgba(201,168,76,0.1);--ink:#141414;--muted:rgba(20,20,20,0.62);--line:rgba(20,20,20,0.09);--white:#FFF;--bg:#FAFAF8}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body.gh-partner-network{font-family:${isEn ? "'Inter','Tajawal','IBM Plex Sans Arabic'" : "'Tajawal','IBM Plex Sans Arabic',-apple-system,BlinkMacSystemFont"},sans-serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased}
.pn-wrap{max-width:1080px;margin:0 auto;padding:0 24px}
@media(min-width:768px){.pn-wrap{padding:0 40px}}
.pn-lang{position:fixed;top:calc(var(--gh-header-height,88px) + 12px);${isEn ? 'right' : 'left'}:20px;z-index:100;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.72);text-decoration:none;padding:7px 14px;background:rgba(8,12,10,.88);border:1px solid rgba(201,168,76,.22);border-radius:999px}
.pn-lang:hover{border-color:var(--gold);color:#fff}
.pn-hero{padding:calc(var(--gh-header-height,88px) + 56px) 0 40px;background:var(--white);border-bottom:1px solid var(--line);text-align:${isEn ? 'left' : 'right'}}
.pn-eye{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;font-family:${ff}}
.pn-h1{font-size:clamp(34px,5.2vw,54px);font-weight:300;line-height:1.15;letter-spacing:-.025em;margin-bottom:14px;font-family:${ff}}
.pn-h1 em{font-style:normal;color:var(--gold);font-weight:700}
.pn-lead{font-size:clamp(16px,1.8vw,18px);line-height:1.9;color:var(--muted);max-width:720px;font-family:${ff}}
.pn-hero-split{display:grid;grid-template-columns:1fr;gap:12px;margin-top:28px;max-width:720px}
@media(min-width:640px){.pn-hero-split{grid-template-columns:1fr 1fr}}
.pn-hero-box{padding:18px 20px;border-radius:12px;border:1px solid var(--line);background:var(--bg);font-size:15px;line-height:1.75;font-family:${ff}}
.pn-hero-box strong{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:6px;font-weight:700}
.pn-hero-box--us{background:var(--gold-soft);border-color:rgba(201,168,76,.24)}
.pn-segments{padding:48px 0 56px;background:var(--bg);border-bottom:1px solid var(--line)}
.pn-seg-label{display:block;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;font-family:${ff}}
.pn-seg-note{font-size:14px;color:var(--gold);margin-bottom:18px;font-weight:600;font-family:${ff}}
.pn-seg-grid{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:640px){.pn-seg-grid{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-seg-grid{grid-template-columns:repeat(4,1fr)}}
.pn-seg{text-align:${isEn ? 'left' : 'right'};padding:22px 20px;background:var(--white);border:1.5px solid var(--line);border-radius:12px;cursor:pointer;transition:.25s;font-family:inherit;color:inherit;width:100%}
.pn-seg:hover{border-color:rgba(201,168,76,.35);box-shadow:0 8px 32px rgba(0,0,0,.04)}
.pn-seg.is-active,.pn-seg--featured.is-active{border-color:var(--gold);background:linear-gradient(135deg,var(--white),rgba(201,168,76,.06));box-shadow:0 12px 40px rgba(201,168,76,.12)}
.pn-seg--featured{border-color:rgba(201,168,76,.28)}
.pn-seg-icon{font-size:28px;color:var(--gold);display:block;margin-bottom:12px}
.pn-seg-title{display:block;font-size:15px;font-weight:700;margin-bottom:6px;line-height:1.35}
.pn-seg-desc{display:block;font-size:13px;color:var(--muted);line-height:1.65}
.pn-section{padding:72px 0}
.pn-section--white{background:var(--white);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.pn-h2{font-size:clamp(28px,3.2vw,40px);font-weight:300;margin-bottom:12px;letter-spacing:-.02em;font-family:${ff}}
.pn-sub{font-size:16px;color:var(--muted);line-height:1.85;margin-bottom:28px;max-width:640px;font-family:${ff}}
.pn-benefits{display:grid;grid-template-columns:1fr;gap:14px}
@media(min-width:640px){.pn-benefits{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-benefits{grid-template-columns:repeat(3,1fr)}}
.pn-benefit{padding:22px 20px;background:var(--white);border:1px solid var(--line);border-radius:12px}
.pn-benefit h3{font-size:15px;font-weight:700;margin-bottom:8px;font-family:${ff}}
.pn-benefit p{font-size:14px;line-height:1.7;color:var(--muted);font-family:${ff}}
.pn-complement{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin-top:8px}
@media(max-width:767px){.pn-complement{grid-template-columns:1fr;gap:12px}}
.pn-complement-col{padding:24px 20px;border-radius:14px;border:1px solid var(--line);background:var(--bg);text-align:center}
.pn-complement-col--us{background:var(--gold-soft);border-color:rgba(201,168,76,.24)}
.pn-complement-col h3{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-family:${ff}}
.pn-complement-col span{display:inline-block;margin:4px 6px;padding:6px 12px;background:var(--white);border:1px solid var(--line);border-radius:999px;font-size:13px;font-weight:600;font-family:${ff}}
.pn-complement-eq{font-size:28px;font-weight:300;color:var(--gold);text-align:center}
.pn-complement-result{margin-top:20px;text-align:center;font-size:clamp(18px,2.5vw,24px);font-weight:700;color:var(--ink);font-family:${ff}}
.pn-pitch{padding:32px;border-radius:16px;background:#080c0a;color:#fff;margin-top:0}
.pn-pitch h2{color:#fff;margin-bottom:10px}
.pn-pitch .pn-sub{color:rgba(255,255,255,.72)}
.pn-pl{margin-top:0;padding:36px;border-radius:16px;border:1px solid var(--line);background:var(--white)}
.pn-pl-items{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0;list-style:none}
.pn-pl-items li{padding:8px 14px;background:var(--gold-soft);border:1px solid rgba(201,168,76,.22);border-radius:999px;font-size:13px;font-weight:600;font-family:${ff}}
.pn-pl-note{font-size:15px;line-height:1.85;color:var(--muted);margin-bottom:20px;font-family:${ff}}
.pn-pl-cta{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;background:#080c0a;color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:700;font-family:${ff}}
.pn-offers{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
@media(min-width:768px){.pn-offers{grid-template-columns:repeat(4,1fr)}}
.pn-offer-card{display:flex;flex-direction:column;text-decoration:none;color:inherit;background:var(--bg);border:1px solid var(--line);border-radius:14px;overflow:hidden;position:relative;transition:.25s}
.pn-offer-card:hover{border-color:rgba(201,168,76,.4);transform:translateY(-3px);box-shadow:0 14px 40px rgba(0,0,0,.07)}
.pn-offer-img{aspect-ratio:4/3;overflow:hidden;background:#eceae4}
.pn-offer-img img,.pn-offer-img picture{width:100%;height:100%;display:block}
.pn-offer-img img{object-fit:cover;transition:transform .45s}
.pn-offer-card:hover .pn-offer-img img{transform:scale(1.04)}
.pn-offer-label{display:block;padding:14px 16px 4px;font-size:14px;font-weight:700;font-family:${ff}}
.pn-offer-sub{display:block;padding:0 16px 16px;font-size:12px;color:var(--muted);font-family:${ff}}
.pn-offer-ext{position:absolute;top:10px;${isEn ? 'right' : 'left'}:10px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.92);border-radius:8px;font-size:15px;color:var(--gold);opacity:0;transition:.25s}
.pn-offer-card:hover .pn-offer-ext{opacity:1}
.pn-case{display:grid;grid-template-columns:1fr;gap:24px;align-items:center;padding:28px;border:1px solid var(--line);border-radius:16px;background:var(--bg)}
@media(min-width:768px){.pn-case{grid-template-columns:1.1fr 1fr}}
.pn-case-img{border-radius:12px;overflow:hidden;aspect-ratio:16/10}
.pn-case-img img{width:100%;height:100%;object-fit:cover;display:block}
.pn-case-label{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;font-family:${ff}}
.pn-case-title{font-size:clamp(20px,2.5vw,26px);font-weight:700;margin-bottom:8px;font-family:${ff}}
.pn-case-desc{font-size:15px;color:var(--muted);line-height:1.75;margin-bottom:16px;font-family:${ff}}
.pn-case-cta{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;background:var(--gold);color:#080c0a;text-decoration:none;border-radius:999px;font-size:13px;font-weight:700;font-family:${ff}}
.pn-about-text{font-size:17px;line-height:2;color:var(--muted);max-width:720px;font-family:${ff}}
.pn-about-text strong{color:var(--ink);font-weight:700}
.pn-cta-band{padding:56px 0;background:linear-gradient(135deg,#080c0a,#1a1f1c);color:#fff;text-align:${isEn ? 'left' : 'right'}}
.pn-cta-band h2{color:#fff;margin-bottom:12px}
.pn-cta-band p{color:rgba(255,255,255,.75);max-width:560px;margin-bottom:24px;line-height:1.85;font-family:${ff}}
.pn-cta-btn{display:inline-flex;align-items:center;gap:10px;padding:15px 28px;background:var(--gold);color:#080c0a;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;font-family:${ff}}
.pn-faq{display:flex;flex-direction:column;gap:10px;max-width:760px}
.pn-faq-item{background:var(--white);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.pn-faq-item[open]{border-color:rgba(201,168,76,.35)}
.pn-faq-q{padding:20px 24px;font-size:15px;font-weight:700;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:16px;font-family:${ff}}
.pn-faq-q::-webkit-details-marker{display:none}
.pn-faq-q::after{content:'+';color:var(--gold);font-size:18px}
.pn-faq-item[open] .pn-faq-q::after{content:'−'}
.pn-faq-a{padding:0 24px 20px;font-size:15px;line-height:1.85;color:var(--muted);font-family:${ff}}
.pn-form-section{padding:80px 0 110px;background:linear-gradient(180deg,var(--bg) 0%,var(--white) 50%)}
.pn-form-box{background:var(--white);border:1px solid var(--line);border-radius:20px;padding:44px 32px;box-shadow:0 24px 64px rgba(0,0,0,.06)}
@media(min-width:768px){.pn-form-box{padding:52px 48px}}
.pn-form-head{margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid var(--line)}
.pn-form-head h2{font-size:clamp(24px,3vw,30px);font-weight:700;margin-bottom:10px;font-family:${ff}}
.pn-form-head p{font-size:15px;color:var(--muted);line-height:1.8;font-family:${ff}}
.pn-form-grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:640px){.pn-form-grid{grid-template-columns:1fr 1fr}}
.pn-form-grid .pn-field--full{grid-column:1/-1}
.pn-field{display:flex;flex-direction:column;gap:7px}
.pn-field label{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:rgba(20,20,20,.52);font-family:${ff}}
.pn-field label .req{color:var(--gold);margin-${isEn ? 'left' : 'right'}:2px}
.pn-field input,.pn-field select,.pn-field textarea{padding:14px 16px;font-size:15px;font-family:inherit;border:1.5px solid var(--line);border-radius:10px;background:#F7F6F3;color:var(--ink);outline:none;${isEn ? '' : 'text-align:right'}}
.pn-field input:focus,.pn-field select:focus,.pn-field textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.12);background:var(--white)}
.pn-field input[type=email],.pn-field input[type=tel]{direction:ltr;text-align:left}
.pn-field textarea{min-height:120px;resize:vertical;line-height:1.7}
.pn-field select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:${isEn ? 'right' : 'left'} 12px center;padding-${isEn ? 'right' : 'left'}:36px}
.pn-submit{width:100%;margin-top:12px;padding:17px 28px;font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-family:inherit;cursor:pointer;background:#080c0a;color:var(--white);border:none;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:10px}
.pn-submit:hover{background:#1a1f1c;transform:translateY(-2px)}
.pn-alt-cta{margin-top:24px;padding-top:22px;border-top:1px solid var(--line)}
.pn-wa{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:#25D366;color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:600}
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
    <div class="pn-hero-split">
      <div class="pn-hero-box"><strong>${isEn ? 'You' : 'أنتم'}</strong>${c.heroYou}</div>
      <div class="pn-hero-box pn-hero-box--us"><strong>Graphics House</strong>${c.heroUs}</div>
    </div>
  </div>
</section>

<section class="pn-segments" aria-label="${c.segmentsLabel}">
  <div class="pn-wrap">
    <span class="pn-seg-label">${c.segmentsLabel}</span>
    <p class="pn-seg-note">${c.segmentsNote}</p>
    <div class="pn-seg-grid" role="group">${segmentCards}</div>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.whyTitle}</h2>
    <p class="pn-sub">${c.whySub}</p>
    <div class="pn-benefits">${benefitsHtml}</div>
  </div>
</section>

<section class="pn-section">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.complementTitle}</h2>
    <div class="pn-complement">
      <div class="pn-complement-col"><h3>${c.complementYou}</h3>${complementYou}</div>
      <div class="pn-complement-eq" aria-hidden="true">+</div>
      <div class="pn-complement-col pn-complement-col--us"><h3>${c.complementUs}</h3>${complementUs}</div>
    </div>
    <p class="pn-complement-result">${c.complementResult}</p>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap pn-pitch">
    <h2 class="pn-h2">${c.pitchTitle}</h2>
    <p class="pn-sub">${c.pitchLead}</p>
    <p style="font-size:15px;line-height:1.85;color:rgba(255,255,255,.68);font-family:${ff}">${c.pitchSub}</p>
  </div>
</section>

<section class="pn-section">
  <div class="pn-wrap">
    <div class="pn-pl">
      <h2 class="pn-h2">${c.plTitle}</h2>
      <p class="pn-sub" style="font-style:italic;margin-bottom:12px">${c.plSub}</p>
      <ul class="pn-pl-items">${plItems}</ul>
      <p class="pn-pl-note">${c.plNote}</p>
      <a href="${c.plHref}" class="pn-pl-cta" target="_blank" rel="noopener noreferrer">${c.plCta} <span class="material-symbols-outlined" style="font-size:16px">open_in_new</span></a>
    </div>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.capabilitiesTitle}</h2>
    <p class="pn-sub">${c.capabilitiesSub}</p>
    <div class="pn-offers">${exploreLinks}</div>
  </div>
</section>

<section class="pn-section">
  <div class="pn-wrap">
    <div class="pn-case">
      <div class="pn-case-img"><picture><source srcset="${c.caseWebp}" type="image/webp"><img src="${c.caseImg}" alt="${c.caseTitle}" loading="lazy"></picture></div>
      <div>
        <p class="pn-case-label">${c.caseLabel}</p>
        <h3 class="pn-case-title">${c.caseTitle}</h3>
        <p class="pn-case-desc">${c.caseDesc}</p>
        <a href="${c.caseHref}" class="pn-case-cta" target="_blank" rel="noopener noreferrer">${c.caseCta} <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span></a>
      </div>
    </div>
    <p class="pn-about-text" style="margin-top:40px">${aboutHtml}</p>
  </div>
</section>

<section class="pn-cta-band">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.ctaTitle}</h2>
    <p>${c.ctaLead}</p>
    <a href="#inquiry" class="pn-cta-btn">${c.ctaBtn} <span class="material-symbols-outlined" style="font-size:18px">arrow_downward</span></a>
  </div>
</section>

<section class="pn-section pn-section--white">
  <div class="pn-wrap">
    <h2 class="pn-h2">${c.faqTitle}</h2>
    <p class="pn-sub">${c.faqSub}</p>
    <div class="pn-faq">${faqItems}</div>
  </div>
</section>

<section class="pn-form-section" id="inquiry">
  <div class="pn-wrap">
    <div class="pn-form-box">
      <div class="pn-form-head"><h2>${c.formTitle}</h2><p>${c.formSub}</p></div>
      <form class="gh-quote-form pn-form" action="https://formsubmit.co/info@3dgraphicshouse.com" method="POST">
        <input type="hidden" name="_subject" value="${c.formSubject}">
        <input type="hidden" name="_next" value="${c.formNext}">
        <div class="pn-form-grid">
          <div class="pn-field pn-field--full">
            <label for="pnSegment">${c.fields.segment} <span class="req">*</span></label>
            <select name="organization_type" id="pnSegment" required>${segmentOptions}</select>
          </div>
          <div class="pn-field pn-field--full">
            <label for="pnCollab">${c.fields.collab} <span class="req">*</span></label>
            <select name="collaboration_type" id="pnCollab" required>${collabOptions}</select>
          </div>
          <div class="pn-field"><label for="pnName">${c.fields.name} <span class="req">*</span></label><input type="text" name="name" id="pnName" required autocomplete="name"></div>
          <div class="pn-field"><label for="pnRole">${c.fields.role} <span class="req">*</span></label><input type="text" name="job_title" id="pnRole" required autocomplete="organization-title"></div>
          <div class="pn-field"><label for="pnEmail">${c.fields.email} <span class="req">*</span></label><input type="email" name="email" id="pnEmail" required autocomplete="email" placeholder="name@company.com"></div>
          <div class="pn-field"><label for="pnPhone">${c.fields.phone} <span class="req">*</span></label><input type="tel" name="phone" id="pnPhone" required autocomplete="tel"></div>
          <div class="pn-field pn-field--full"><label for="pnMessage">${c.fields.message}</label><textarea name="message" id="pnMessage" placeholder="${c.messagePlaceholder}"></textarea></div>
          <div class="pn-field pn-field--full">
            <div class="gh-form-security"><div class="gh-honeypot" aria-hidden="true"><label>Leave blank</label><input type="text" name="_honey" tabindex="-1" autocomplete="off"></div><div class="gh-turnstile"></div></div>
            <div class="form-feedback" aria-live="polite"></div>
          </div>
        </div>
        <button type="submit" class="form-submit pn-submit">${c.submit} <span class="material-symbols-outlined" style="font-size:18px">send</span></button>
      </form>
      <div class="pn-alt-cta"><a href="https://wa.me/966502786513" class="pn-wa" target="_blank" rel="noopener">${c.wa}</a></div>
    </div>
  </div>
</section>

${footer}

<script defer src="assets/quote-form-config.js"></script>
<script defer src="assets/quote-form.js?v=3"></script>
<script defer src="assets/gh-float-widgets.js?v=8"></script>
<script>
(function(){
  var segBtns=document.querySelectorAll('.pn-seg');
  var segSelect=document.getElementById('pnSegment');
  function setSegment(id){
    segBtns.forEach(function(btn){
      var on=btn.getAttribute('data-segment')===id;
      btn.classList.toggle('is-active',on);
      btn.setAttribute('aria-pressed',on?'true':'false');
    });
    if(segSelect&&id)segSelect.value=id;
  }
  segBtns.forEach(function(btn){btn.addEventListener('click',function(){setSegment(btn.getAttribute('data-segment'));});});
  if(segSelect){
    segSelect.addEventListener('change',function(){setSegment(segSelect.value);});
    setSegment(segSelect.value||'agency');
  }
  var form=document.querySelector('.pn-form');
  if(form){
    form.addEventListener('submit',function(){
      var seg=document.getElementById('pnSegment');
      var collab=document.getElementById('pnCollab');
      if(typeof window.ghTrack==='function'){
        window.ghTrack('partner_network_inquiry',{organization_type:seg?seg.value:'',collaboration_type:collab?collab.value:'',page_language:'${c.lang}'});
      }
    });
  }
  if(new URLSearchParams(location.search).get('sent')==='1'){
    var box=document.querySelector('.form-feedback');
    if(box){box.className='form-feedback is-visible is-success';box.textContent=${JSON.stringify(c.sentMsg)};}
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
