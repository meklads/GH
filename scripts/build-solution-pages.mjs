#!/usr/bin/env node
/**
 * Generate GH solution product pages (GrowthLaunch, ProjectLaunch, BrandScale)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';
import { renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOLUTIONS = path.join(ROOT, 'solutions');

const OG_IMAGES = {
  'growth-launch': 'mm-growth',
  'project-launch': 'mm-project',
  'brand-scale': 'mm-brand',
};

const BODY_CLASSES = {
  'growth-launch': 'gl-page',
  'project-launch': 'pl-page',
  'brand-scale': 'bs-page',
};

function head({ title, desc, ogTitle, css, dir, lang }) {
  return `<!DOCTYPE html>
<html class="scroll-smooth" dir="${dir}" lang="${lang}">
<head>
${analyticsHeadTags('../')}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://3dgraphicshouse.com/assets/${OG_IMAGES[css] || 'mm-growth'}.jpg">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="../assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="../assets/site-header.css?v=31">
<link rel="stylesheet" href="../assets/${css}.css">
<link rel="stylesheet" href="../assets/solution-before-after.css">
<script defer src="../assets/site-header.js?v=16"></script>
<script defer src="../assets/lang-switch.js?v=1"></script>
</head>
<body class="${BODY_CLASSES[css] || 'gl-page'}" style="margin:0">
`;
}

function beforeAfterSection(product, lang) {
  const isEn = lang === 'en';
  const data = {
    growth: {
      name: 'GrowthLaunch™',
      lead: isEn
        ? 'Not just tools — a shift in how you capture and convert leads.'
        : 'ليس أدوات فقط — بل تحول في طريقة استقبال العملاء وتحويلهم.',
      rows: isEn
        ? [
            ['Ads without follow-up', 'Complete lead journey from click to call'],
            ['Slow manual responses', 'Instant WhatsApp & AI responses'],
            ['Leads lost between staff', 'Organized CRM pipeline'],
            ['No conversion visibility', 'Full analytics & tracking'],
            ['Scattered marketing tools', 'One integrated sales system'],
          ]
        : [
            ['إعلانات بلا متابعة', 'رحلة عميل متكاملة من النقرة إلى الاتصال'],
            ['ردود يدوية بطيئة', 'رد فوري عبر WhatsApp والذكاء الاصطناعي'],
            ['عملاء يضيعون بين الموظفين', 'مسار منظم عبر CRM'],
            ['لا رؤية لمعدلات التحويل', 'تحليلات وتتبع كامل'],
            ['أدوات تسويق متفرقة', 'نظام مبيعات متكامل واحد'],
          ],
    },
    project: {
      name: 'ProjectLaunch™',
      lead: isEn
        ? 'From fragmented efforts to a unified launch that sells.'
        : 'من جهود متفرقة إلى إطلاق موحّد يبيع المشروع.',
      rows: isEn
        ? [
            ['Multiple vendors to manage', 'One launch partner — end to end'],
            ['Concept without marketing assets', 'Sales-ready launch package'],
            ['Weak visual presentation', 'Cinematic CGI & scale models'],
            ['No structured launch plan', 'Clear 6-phase launch system'],
            ['Slow market confidence', 'Accelerated investor & buyer trust'],
          ]
        : [
            ['التعامل مع عدة مورّدين', 'شريك إطلاق واحد — من البداية للنهاية'],
            ['فكرة بلا مواد تسويقية', 'حزمة إطلاق جاهزة للمبيعات'],
            ['عرض بصري ضعيف', 'CGI سينمائي ومجسمات'],
            ['لا خطة إطلاق واضحة', 'نظام إطلاق من 6 مراحل'],
            ['بطء في ثقة السوق', 'تسريع ثقة المستثمرين والمشترين'],
          ],
    },
    brand: {
      name: 'BrandScale™',
      lead: isEn
        ? 'The shift from looking small to commanding market trust.'
        : 'التحول من حضور ضعيف إلى ثقة سوقية قوية.',
      rows: isEn
        ? [
            ['Inconsistent identity', 'Unified professional brand identity'],
            ['Outdated website', 'Modern conversion-focused website'],
            ['Weak presentations', 'Investor-grade professional decks'],
            ['Modest digital presence', 'Strong presence reflecting company value'],
            ['Scattered marketing materials', 'Integrated marketing system'],
          ]
        : [
            ['هوية غير متسقة', 'هوية احترافية موحدة'],
            ['موقع قديم', 'موقع حديث يركز على التحويل'],
            ['عروض تقديمية ضعيفة', 'عروض احترافية تقنع المستثمرين'],
            ['حضور رقمي متواضع', 'حضور قوي يعكس قيمة الشركة'],
            ['مواد تسويقية متفرقة', 'نظام تسويقي متكامل'],
          ],
    },
  };
  const d = data[product];
  const beforeLbl = isEn ? `Before ${d.name}` : `قبل ${d.name}`;
  const afterLbl = isEn ? `After ${d.name}` : `بعد ${d.name}`;
  const title = isEn ? 'Before & After' : 'قبل وبعد';
  const rowsHtml = d.rows
    .map(
      ([b, a]) => `<div class="sol-baf-row">
        <div class="sol-baf-before">${b}</div>
        <div class="sol-baf-mid"><span class="material-symbols-outlined">arrow_forward</span></div>
        <div class="sol-baf-after">${a}</div>
      </div>`
    )
    .join('\n');
  return `<section class="sol-baf">
    <div class="sol-baf-inner">
      <div class="sol-baf-head">
        <div class="sol-baf-eyebrow">${title}</div>
        <h2 class="sol-baf-title">${isEn ? 'Your situation — transformed' : 'وضعك الحالي — بعد التحول'}</h2>
        <p class="sol-baf-lead">${d.lead}</p>
      </div>
      <div class="sol-baf-table">
        <div class="sol-baf-cols">
          <div class="sol-baf-col-head before">${beforeLbl}</div>
          <div class="sol-baf-col-head after">${afterLbl}</div>
        </div>
        ${rowsHtml}
      </div>
    </div>
  </section>`;
}

function headerPlaceholder(isEn) {
  const home = isEn ? '../index.html' : '/index-ar.html';
  const about = isEn ? '../who-we-are-en.html' : '../who-we-are.html';
  const contact = isEn ? '../contact-us-en.html' : '../contact-us.html';
  const gl = isEn ? 'growth-launch-en.html' : 'growth-launch.html';
  const pl = isEn ? 'project-launch-en.html' : 'project-launch.html';
  const dir = isEn ? '' : ' dir="rtl"';
  const label = isEn ? 'Main navigation' : 'التنقل الرئيسي';
  const aboutTxt = isEn ? 'About Us' : 'من نحن';
  const solTxt = isEn ? 'Solutions' : 'حلولنا';
  const ctaTxt = isEn ? 'Book Strategy Session' : 'احجز جلسة استراتيجية';
  return `<header class="header" id="header">
  <div class="container header-inner">
    <a href="${home}" class="logo">
      <img src="../assets/logo-gold.png" alt="Graphics House" class="logo-img" width="auto" height="75">
    </a>
    <nav class="nav" id="nav" aria-label="${label}">
      <a class="nav-link" href="${about}">${aboutTxt}</a>
      <a class="nav-link" href="${gl}">GrowthLaunch</a>
      <a class="nav-link" href="${pl}">ProjectLaunch</a>
      <a href="${contact}" class="nav-cta btn-pill btn-pill-gold">${ctaTxt}</a>
    </nav>
    <button class="menu-toggle" id="menuToggle" aria-label="Menu" aria-expanded="false">
      <span class="material-symbols-outlined">menu</span>
    </button>
  </div>
  <div class="nav-backdrop" id="navBackdrop" hidden></div>
</header>
`;
}

function growthLaunchEnMain() {
  const contact = '../contact-us-en.html';
  const arrow = 'arrow_forward';
  return `<main>
  <section class="gl-hero">
    <div class="gl-hero-bg">
      <video autoplay muted loop playsinline poster="../assets/mm-growth.jpg">
        <source src="../assets/videos/GH-Real-estate-services.mp4" type="video/mp4">
      </video>
      <img src="../assets/mm-growth.jpg" alt="" aria-hidden="true" style="position:absolute;inset:0;object-fit:cover;width:100%;height:100%">
    </div>
    <div class="gl-hero-overlay"></div>
    <div class="gl-container gl-hero-inner">
      <div class="gl-hero-grid">
        <div>
          <div class="gl-eyebrow"><span class="num">01</span> GRAPHICS HOUSE · Business Solutions Portfolio</div>
          <p class="gl-hero-en">Stop Buying Marketing...<br><span>Start Building a Predictable Sales Pipeline.</span></p>
          <h1>GrowthLaunch<span class="tm">™</span></h1>
          <p style="font-size:15px;color:#C9A84C;font-weight:600;margin:0 0 12px">Lead Generation &amp; Sales System</p>
          <p class="gl-hero-sub">A complete system that builds a machine generating qualified leads continuously — and helps your sales team convert them into contracts. Deployed in <strong style="color:#C9A84C">7 business days</strong> — your company's primary cash-flow engine.</p>
          <div class="gl-btn-row">
            <a href="${contact}" class="gl-btn gl-btn-gold">
              <span class="material-symbols-outlined">calendar_month</span>
              Book Your Free Strategy Session
            </a>
            <a href="#components" class="gl-btn gl-btn-outline">Explore System Components</a>
          </div>
        </div>
        <div class="gl-hero-card">
          <p><strong style="color:#fff">Goal:</strong> An integrated system that helps companies attract qualified leads, manage the customer journey, and increase conversion through smart digital solutions.</p>
          <div class="gl-hero-stats">
            <div class="gl-stat"><strong>7</strong><span>Days to launch</span></div>
            <div class="gl-stat"><strong>15+</strong><span>Technical components</span></div>
            <div class="gl-stat"><strong>360°</strong><span>Customer journey</span></div>
            <div class="gl-stat"><strong>GH</strong><span>LeadFlow™</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="gl-problem">
    <div class="gl-container">
      <div class="gl-eyebrow">The Problem</div>
      <h2 class="gl-section-title">Most companies don't suffer from weak marketing...<br><em>They suffer from an incomplete customer journey.</em></h2>
      <p class="gl-problem-lead">Ads work. Visitors land on your site. But...</p>
      <div class="gl-pain-grid">
        <div class="gl-pain-item">They don't reach out</div>
        <div class="gl-pain-item">They leave without sharing details</div>
        <div class="gl-pain-item">Response is too slow</div>
        <div class="gl-pain-item">Leads get lost between staff</div>
        <div class="gl-pain-item">Follow-up never happens</div>
        <div class="gl-pain-item">Management can't see where deals die</div>
      </div>
      <div class="gl-problem-close">The result: money spent... and sales opportunities lost every day.</div>
    </div>
  </section>

  <section class="gl-solution" id="solution">
    <div class="gl-container">
      <div class="gl-solution-grid">
        <div class="gl-solution-visual">
          <video autoplay muted loop playsinline poster="../assets/projects/rendering/alrajhi3.jpeg">
            <source src="../assets/videos/GH-Marketing-Media-Production.mp4" type="video/mp4">
          </video>
          <div class="gl-solution-badge">GH LeadFlow™</div>
        </div>
        <div>
          <div class="gl-eyebrow">The Solution</div>
          <h2>Not a campaign...<br>A <span class="brand">complete sales system</span></h2>
          <ul class="gl-not-list">
            <li><span class="material-symbols-outlined">close</span> Not an <strong>ad campaign</strong></li>
            <li><span class="material-symbols-outlined">close</span> Not just a <strong>website</strong></li>
            <li><span class="material-symbols-outlined">close</span> Not a <strong>landing page</strong></li>
          </ul>
          <p style="font-size:17px;line-height:1.85;color:rgba(255,255,255,.78)">A system from first visit to professional handoff to sales. We don't just design pages — we build infrastructure that turns traffic into real revenue.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="gl-outcomes">
    <div class="gl-container">
      <div class="gl-eyebrow">What You Get</div>
      <h2 class="gl-section-title">Six engines for sales growth</h2>
      <div class="gl-bento">
        <div class="gl-bento-card"><div class="gl-bento-icon"><span class="material-symbols-outlined">person_add</span></div><h3>Capture</h3><p>Make it effortless for prospects to take the next step — smart forms and clear paths.</p></div>
        <div class="gl-bento-card"><div class="gl-bento-icon"><span class="material-symbols-outlined">verified</span></div><h3>Qualify</h3><p>Qualify leads before they reach sales — less noise, higher quality.</p></div>
        <div class="gl-bento-card"><div class="gl-bento-icon"><span class="material-symbols-outlined">route</span></div><h3>Track</h3><p>Know where leads came from, what they did, and where they dropped off.</p></div>
        <div class="gl-bento-card"><div class="gl-bento-icon"><span class="material-symbols-outlined">bolt</span></div><h3>Respond</h3><p>Instant, professional replies via WhatsApp &amp; AI — no waiting.</p></div>
        <div class="gl-bento-card"><div class="gl-bento-icon"><span class="material-symbols-outlined">trending_up</span></div><h3>Convert</h3><p>Help your sales team close more deals with organized handoffs.</p></div>
        <div class="gl-bento-card"><div class="gl-bento-icon"><span class="material-symbols-outlined">monitoring</span></div><h3>Measure</h3><p>Decisions based on real data — not guesswork.</p></div>
      </div>
    </div>
  </section>

  <section class="gl-audience">
    <div class="gl-container">
      <div class="gl-eyebrow">Built For</div>
      <h2 class="gl-section-title">Sales-driven businesses</h2>
      <div class="gl-audience-grid">
        <div class="gl-audience-item"><span class="material-symbols-outlined">apartment</span><p>Real Estate Developers</p></div>
        <div class="gl-audience-item"><span class="material-symbols-outlined">engineering</span><p>Contracting Companies</p></div>
        <div class="gl-audience-item"><span class="material-symbols-outlined">architecture</span><p>Engineering Firms</p></div>
        <div class="gl-audience-item"><span class="material-symbols-outlined">handshake</span><p>Service Companies</p></div>
        <div class="gl-audience-item"><span class="material-symbols-outlined">corporate_fare</span><p>B2B Companies</p></div>
      </div>
      <div class="gl-audience-grid" style="margin-top:12px;grid-template-columns:repeat(2,1fr);max-width:480px;margin-inline:auto">
        <div class="gl-audience-item"><span class="material-symbols-outlined">storefront</span><p>SMEs</p></div>
        <div class="gl-audience-item"><span class="material-symbols-outlined">medical_services</span><p>Clinics &amp; Medical Centers</p></div>
      </div>
    </div>
  </section>

  <section class="gl-results">
    <div class="gl-container">
      <h2 class="gl-section-title">Expected Outcomes</h2>
      <div class="gl-check-grid">
        <div class="gl-check-item"><span class="material-symbols-outlined">check_circle</span> More qualified leads</div>
        <div class="gl-check-item"><span class="material-symbols-outlined">check_circle</span> Faster response times</div>
        <div class="gl-check-item"><span class="material-symbols-outlined">check_circle</span> Less lead leakage</div>
        <div class="gl-check-item"><span class="material-symbols-outlined">check_circle</span> Organized sales journey</div>
        <div class="gl-check-item"><span class="material-symbols-outlined">check_circle</span> Higher conversion rates</div>
        <div class="gl-check-item"><span class="material-symbols-outlined">check_circle</span> Professional brand presence</div>
      </div>
    </div>
  </section>

  <section class="gl-components" id="components">
    <div class="gl-container">
      <div class="gl-eyebrow">System Components</div>
      <h2 class="gl-section-title">Everything in one integrated stack</h2>
      <p style="color:var(--gl-muted);max-width:640px;line-height:1.8">From offer strategy to tracking and integrations — not scattered pieces, but one system working as a unit.</p>
      <div class="gl-comp-grid">
        <div class="gl-comp-chip"><span class="material-symbols-outlined">strategy</span>Business Offer Strategy</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">edit_note</span>Sales Copywriting</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">web</span>Landing Pages</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">language</span>Website Development</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">smartphone</span>Mobile Optimization</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">analytics</span>Google Analytics 4</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">tag</span>Google Tag Manager</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">ads_click</span>Meta Pixel</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">conversion_path</span>Conversion Tracking</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">hub</span>CRM Integration</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">chat</span>WhatsApp Integration</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">smart_toy</span>AI WhatsApp Assistant</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">dashboard</span>Lead Dashboard</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">school</span>Team Training</div>
        <div class="gl-comp-chip"><span class="material-symbols-outlined">cloud_upload</span>Hosting &amp; Deployment</div>
      </div>
    </div>
  </section>

  <section class="gl-process">
    <div class="gl-container">
      <div class="gl-eyebrow">How We Work</div>
      <h2 class="gl-section-title">From discovery to launch in 6 phases</h2>
      <div class="gl-timeline">
        <div class="gl-step"><div class="gl-step-num">01</div><p>Understand your business</p></div>
        <div class="gl-step"><div class="gl-step-num">02</div><p>Design the customer journey</p></div>
        <div class="gl-step"><div class="gl-step-num">03</div><p>Build the full system</p></div>
        <div class="gl-step"><div class="gl-step-num">04</div><p>Launch</p></div>
        <div class="gl-step"><div class="gl-step-num">05</div><p>Train your team</p></div>
        <div class="gl-step"><div class="gl-step-num">06</div><p>Receive leads professionally</p></div>
      </div>
    </div>
  </section>

  <section class="gl-why">
    <div class="gl-container">
      <div class="gl-why-grid">
        <div class="gl-why-img">
          <img src="../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg" alt="Graphics House projects" loading="lazy">
        </div>
        <div>
          <div class="gl-eyebrow">Why Graphics House?</div>
          <p class="gl-quote">We don't sell tools — we build systems where marketing and sales work as one.</p>
          <div class="gl-quote-lines">
            <p>We don't just design beautiful pages.</p>
            <p>We don't build websites disconnected from sales.</p>
            <p>We build one ecosystem — from first click to first call.</p>
          </div>
        </div>
      </div>
      <div class="gl-clients">
        <img src="../assets/clients-logo/rafal.png" alt="Rafal">
        <img src="../assets/clients-logo/anan-eskan.png" alt="Anan Eskan">
        <img src="../assets/clients-logo/al-owla.png" alt="Al Oula">
        <img src="../assets/clients-logo/toyota.png" alt="Toyota">
      </div>
    </div>
  </section>

  <section class="gl-fit">
    <div class="gl-container" style="text-align:center">
      <p style="font-size:14px;color:var(--gl-gold);font-weight:700;margin-bottom:8px">Right for you if</p>
      <div class="gl-fit-list">
        <span class="gl-fit-tag">You invest in ads</span>
        <span class="gl-fit-tag">You have a sales team</span>
        <span class="gl-fit-tag">You want qualified leads</span>
        <span class="gl-fit-tag">You need a system, not just design</span>
      </div>
    </div>
  </section>

  ${beforeAfterSection('growth', 'en')}

  <section class="gl-cta" id="book">
    <div class="gl-container">
      <div class="gl-days-badge">
        <span class="material-symbols-outlined">schedule</span>
        Delivery: 7 business days
      </div>
      <div class="gl-cta-box">
        <h2>Is this system right for you?</h2>
        <p>Book a free 30-minute strategy session. We'll analyze how you capture leads today and show how to build a more efficient system for your business.</p>
        <a href="${contact}" class="gl-btn gl-btn-gold" style="font-size:15px;padding:16px 36px">
          Book Your Free Strategy Session
          <span class="material-symbols-outlined">${arrow}</span>
        </a>
      </div>
    </div>
  </section>
</main>`;
}

function projectLaunchMain(lang) {
  const isEn = lang === 'en';
  const contact = isEn ? '../contact-us-en.html' : '../contact-us.html';
  const portfolio = isEn ? '../portfolio-en.html' : '../portfolio.html';
  const t = isEn
    ? {
        title: 'Launch Your Real Estate Project with Confidence.',
        sub: 'ProjectLaunch™ is a complete creative launch system designed for real estate developers, helping transform architectural concepts into powerful marketing experiences that attract investors and accelerate sales.',
        tag: 'Complete Launch System for Real Estate Projects',
        cta1: 'Book Strategy Session',
        cta2: 'View Our Work',
        whyTitle: 'Why ProjectLaunch™?',
        whyLead: 'Instead of dealing with five different vendors... we deliver everything you need to launch your project — from one place.',
        offerTitle: 'What We Deliver',
        offerLead: 'A structured launch journey from concept to sales-ready assets.',
        svcTitle: 'Included Services',
        delTitle: 'What You Receive',
        delLead: 'Not a list of services — a complete package of launch-ready deliverables.',
        statsTitle: 'Why Graphics House?',
        portTitle: 'Selected Work',
        journeyTitle: 'Our Process',
        faqTitle: 'FAQ',
        ctaH: 'Ready to Launch Your Next Landmark Project?',
        ctaP: "Let's turn your vision into a project that commands attention and delivers results.",
        viewCase: 'View Case Study',
        eyebrow: '02 · GRAPHICS HOUSE · Business Solutions',
        heroAr: 'From concept to launch — and your first sale.',
      }
    : {
        title: 'أطلق مشروعك العقاري باحترافية... من أول انطباع إلى أول عملية بيع.',
        sub: 'ProjectLaunch™ هو نظام متكامل لإطلاق المشاريع العقارية، يجمع بين التصميم الإبداعي، والمحتوى البصري، والمواد التسويقية، ليحول مشروعك إلى تجربة تسويقية متكاملة تزيد الثقة وتسرّع المبيعات.',
        tag: 'نظام إطلاق المشاريع العقارية',
        cta1: 'احجز جلسة استراتيجية',
        cta2: 'استعرض أعمالنا',
        whyTitle: 'لماذا ProjectLaunch™؟',
        whyLead: 'بدلاً من التعامل مع خمس شركات مختلفة... نوفر لك كل ما تحتاجه لإطلاق مشروعك من مكان واحد.',
        offerTitle: 'ماذا نقدّم؟',
        offerLead: 'رحلة إطلاق منظمة من الفكرة إلى أصول جاهزة للمبيعات.',
        svcTitle: 'الخدمات المشمولة',
        delTitle: 'ما الذي تستلمه',
        delLead: 'ليس قائمة خدمات فقط — بل حزمة مخرجات جاهزة لإطلاق مشروعك.',
        statsTitle: 'لماذا Graphics House؟',
        portTitle: 'نماذج من أعمالنا',
        journeyTitle: 'رحلة العمل',
        faqTitle: 'الأسئلة الشائعة',
        ctaH: 'هل أنت مستعد لإطلاق مشروعك القادم؟',
        ctaP: 'دعنا نحول فكرتك إلى مشروع يلفت الأنظار ويحقق نتائج.',
        viewCase: 'عرض دراسة الحالة',
        eyebrow: '02 · GRAPHICS HOUSE · حلول الأعمال',
        heroAr: 'من الفكرة... إلى إطلاق المشروع وبدء المبيعات.',
      };

  const whyCards = isEn
    ? [
        ['🏗', 'Architectural Visualization', 'High-quality architectural visualizations.'],
        ['🎬', 'CGI Animation', 'Cinematic films for your project.'],
        ['📱', 'Interactive Presentation', 'Investor and sales presentations.'],
        ['📷', 'Photography & Video', 'Professional photo and video production.'],
        ['🖨', 'Marketing Collateral', null, ['Brochures', 'Folders', 'Signage', 'Print materials']],
        ['🏢', 'Exhibition & Booth Design', 'Exhibition stands and advertising décor.'],
      ]
    : [
        ['🏗', 'Architectural Visualization', 'مجسمات معمارية عالية الجودة.'],
        ['🎬', 'CGI Animation', 'أفلام سينمائية للمشروع.'],
        ['📱', 'Interactive Presentation', 'عروض تفاعلية للمستثمرين والمبيعات.'],
        ['📷', 'Photography & Video Production', 'تصوير احترافي وإنتاج مرئي.'],
        ['🖨', 'Marketing Collateral', null, ['بروشورات', 'فولدرات', 'لوحات', 'مطبوعات']],
        ['🏢', 'Exhibition & Advertising Booth Design', 'تصميم وتنفيذ أجنحة المعارض والديكور الإعلاني.'],
      ];

  const timeline = isEn
    ? [
        ['01', 'Project Discovery', 'Understanding vision & goals'],
        ['02', 'Creative Direction', 'Brand & visual strategy'],
        ['03', 'Visualization', 'CGI, models & renders'],
        ['04', 'Marketing Assets', 'Collateral & content'],
        ['05', 'Launch Campaign', 'Go-to-market rollout'],
        ['06', 'Sales Support', 'Tools for your sales team'],
      ]
    : [
        ['01', 'Project Discovery', 'فهم الرؤية والأهداف'],
        ['02', 'Creative Direction', 'استراتيجية العلامة والبصريات'],
        ['03', 'Visualization', 'تصورات ومجسمات'],
        ['04', 'Marketing Assets', 'مواد تسويقية ومحتوى'],
        ['05', 'Launch Campaign', 'إطلاق الحملة'],
        ['06', 'Sales Support', 'أدوات لفريق المبيعات'],
      ];

  const services = [
    ['movie', 'Cinematic CGI'],
    ['view_in_ar', 'Smart Architectural Visualization'],
    ['touch_app', 'Interactive Experiences'],
    ['domain', 'Scale Models'],
    ['videocam', 'Media Production'],
    ['flight', 'Drone Photography'],
    ['palette', 'Branding'],
    ['menu_book', 'Brochures'],
    ['badge', 'Company Profile'],
    ['store', 'Sales Center Design'],
    ['festival', 'Exhibition Booths'],
    ['billboard', 'Outdoor Advertising'],
    ['signpost', 'Wayfinding System'],
  ];

  const deliverables = [
    ['photo_camera', 'Photorealistic CGI Images'],
    ['movie', 'Cinematic Animation Film'],
    ['devices', 'Interactive Presentation'],
    ['domain', 'Architectural Scale Model'],
    ['menu_book', 'Sales Brochure'],
    ['language', 'Project Website / Landing Page'],
    ['share', 'Social Media Launch Kit'],
    ['festival', 'Exhibition Booth Design'],
    ['billboard', 'Outdoor Advertising Artwork'],
    ['storefront', 'Sales Center Visual Assets'],
  ];

  const stats = isEn
    ? [
        ['50+', 'Real Estate Projects'],
        ['12+', 'Years Experience'],
        ['4', 'Countries'],
        ['Millions', 'Views Generated'],
      ]
    : [
        ['50+', 'مشروع عقاري'],
        ['12+', 'سنة خبرة'],
        ['4', 'دول'],
        ['ملايين', 'مشاهدة'],
      ];

  const industries = isEn
    ? ['Developer', 'Government', 'Hospitality', 'Mixed Use', 'Residential', 'Commercial', 'Industrial', 'Master Plans']
    : ['مطور عقاري', 'حكومي', 'ضيافة', 'متعدد الاستخدام', 'سكني', 'تجاري', 'صناعي', 'مخططات رئيسية'];

  const projects = [
    {
      img: 'Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg',
      name: isEn ? 'Al Khair Heights' : 'الخير هايتس',
      country: isEn ? 'Saudi Arabia' : 'السعودية',
      svc: isEn ? 'Cinematic CGI' : 'سينمائي CGI',
    },
    {
      img: 'Anan-Escan-Co.01.jpeg',
      name: isEn ? 'Anan Eskan' : 'عنان إسكان للتطوير',
      country: isEn ? 'Saudi Arabia' : 'السعودية',
      svc: isEn ? 'Visualization' : 'إظهار معماري',
    },
    {
      img: 'Aloula-co-alnakheel-view02-scaled.jpg',
      name: isEn ? 'Al Oula Al Nakheel' : 'الأولى النخيل',
      country: isEn ? 'Saudi Arabia' : 'السعودية',
      svc: isEn ? 'Master Plan CGI' : 'مخطط رئيسي',
    },
    {
      img: 'uae-e1745147961286.jpeg',
      name: isEn ? 'Mixed-Use Tower' : 'برج متعدد الاستخدامات',
      country: isEn ? 'UAE' : 'الإمارات',
      svc: isEn ? 'Cinematic CGI' : 'سينمائي CGI',
    },
    {
      img: 'wahat-alsalam9-scaled.jpg',
      name: isEn ? 'Wahat Al Salam' : 'واحة السلام',
      country: isEn ? 'Saudi Arabia' : 'السعودية',
      svc: isEn ? 'Visualization' : 'إظهار معماري',
    },
    {
      img: 'anan-eskan-maquette-01.jpeg',
      path: 'maquettes',
      name: isEn ? 'Architectural Scale Model' : 'مجسم معماري',
      country: isEn ? 'GCC' : 'الخليج',
      svc: isEn ? 'Scale Model' : 'مجسمات',
    },
  ];

  const journey = isEn
    ? ['Discovery', 'Proposal', 'Planning', 'Production', 'Delivery', 'Launch']
    : ['اكتشاف', 'عرض', 'تخطيط', 'إنتاج', 'تسليم', 'إطلاق'];

  const faqs = isEn
    ? [
        ['How long does a project take?', 'Timeline depends on scope — from 4 weeks for focused deliverables to 12+ weeks for full launch packages. We define a clear schedule in the proposal phase.'],
        ['Can we order part of the services only?', 'Yes. ProjectLaunch is modular. You can start with visualization, add animation later, or commission a full launch package.'],
        ['Do you work outside Saudi Arabia?', 'Absolutely. We serve clients across Saudi Arabia, UAE, Oman, Bahrain, Egypt, and internationally.'],
        ['Do you provide on-site supervision?', 'Yes — for exhibitions, sales centers, and on-ground installations we offer supervision and coordination.'],
        ['Do you offer updates after delivery?', 'We provide revision rounds during production and optional maintenance packages for digital assets after launch.'],
      ]
    : [
        ['كم يستغرق المشروع؟', 'يعتمد على نطاق العمل — من 4 أسابيع للمخرجات المحددة إلى 12+ أسبوعاً لحزمة الإطلاق الكاملة. نحدد جدولاً واضحاً في مرحلة العرض.'],
        ['هل يمكن تنفيذ جزء من الخدمات فقط؟', 'نعم. ProjectLaunch مرن — يمكنك البدء بالتصور المعماري وإضافة الأنيميشن لاحقاً أو طلب حزمة إطلاق متكاملة.'],
        ['هل يمكن تنفيذ المشروع خارج السعودية؟', 'بالتأكيد. نخدم عملاء في السعودية والإمارات وعُمان والبحرين ومصر ودولياً.'],
        ['هل توفرون الإشراف؟', 'نعم — للمعارض ومراكز المبيعات والتركيبات الميدانية نوفر إشرافاً وتنسيقاً كاملاً.'],
        ['هل تقدمون تحديثات بعد التسليم؟', 'نوفر جولات مراجعة أثناء الإنتاج وحزم صيانة اختيارية للأصول الرقمية بعد الإطلاق.'],
      ];

  const whyHtml = whyCards
    .map(([icon, title, desc, list]) => {
      const listHtml = list
        ? `<ul>${list.map((i) => `<li>${i}</li>`).join('')}</ul>`
        : `<p>${desc}</p>`;
      return `<div class="pl-why-card"><div class="pl-why-icon">${icon}</div><h3>${title}</h3>${listHtml}</div>`;
    })
    .join('\n');

  const tlHtml = timeline
    .map(([n, h, p]) => `<div class="pl-tl-step"><div class="pl-tl-num">${n}</div><h3>${h}</h3><p>${p}</p></div>`)
    .join('\n');

  const svcHtml = services
    .map(([icon, label]) => `<div class="pl-svc-item"><span class="material-symbols-outlined">${icon}</span>${label}</div>`)
    .join('\n');

  const delHtml = deliverables
    .map(([icon, label]) => `<div class="pl-del-card"><div class="pl-del-icon"><span class="material-symbols-outlined">${icon}</span></div><h3>${label}</h3></div>`)
    .join('\n');

  const statsHtml = stats.map(([n, l]) => `<div class="pl-stat"><strong>${n}</strong><span>${l}</span></div>`).join('\n');

  const indHtml = industries.map((i) => `<div class="pl-ind-item">${i}</div>`).join('\n');

  const slidesHtml = projects
    .map((p) => {
      const folder = p.path || 'rendering';
      return `<article class="pl-slide">
        <div class="pl-slide-img"><img src="../assets/projects/${folder}/${p.img}" alt="${p.name}" loading="lazy"></div>
        <div class="pl-slide-body">
          <h3>${p.name}</h3>
          <div class="pl-slide-meta"><span>${p.country}</span><span>${p.svc}</span></div>
          <a href="${portfolio}" class="pl-slide-link">${t.viewCase} <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span></a>
        </div>
      </article>`;
    })
    .join('\n');

  const journeyHtml = journey
    .map((step, i) => {
      const arrow = i < journey.length - 1 ? '<span class="pl-journey-arrow">↓</span>' : '';
      return `<span class="pl-journey-step">${step}</span>${arrow}`;
    })
    .join('\n');

  const faqHtml = faqs
    .map(([q, a]) => `<details class="pl-faq-item"><summary>${q}</summary><p>${a}</p></details>`)
    .join('\n');

  const heroEnLine = isEn
    ? 'Launch Your Real Estate Project with Confidence.'
    : '';

  const heroH1 = isEn
    ? 'ProjectLaunch<span class="tm">™</span>'
    : 'أطلق مشروعك العقاري باحترافية...<br><span style="font-size:0.55em;font-weight:600;color:rgba(255,255,255,.75)">من أول انطباع إلى أول عملية بيع.</span>';

  return `<main>
  <section class="pl-hero">
    <div class="pl-hero-bg">
      <video autoplay muted loop playsinline poster="../assets/mm-project.jpg">
        <source src="../assets/videos/GH-Real-estate-services.mp4" type="video/mp4">
      </video>
      <img src="../assets/mm-project.jpg" alt="" aria-hidden="true" style="position:absolute;inset:0;object-fit:cover;width:100%;height:100%">
    </div>
    <div class="pl-hero-overlay"></div>
    <div class="pl-container pl-hero-inner">
      <div class="pl-eyebrow"><span class="num">02</span> ${t.eyebrow}</div>
      ${isEn ? `<p class="pl-hero-en">${heroEnLine}</p><h1>${heroH1}</h1>` : `<h1>${heroH1}</h1><p style="font-size:14px;color:var(--pl-gold);font-weight:700;margin:12px 0 0">ProjectLaunch<span class="tm">™</span></p>`}
      <p class="pl-hero-tag">${t.tag}</p>
      <p class="pl-hero-sub">${t.sub}</p>
      <p style="font-size:16px;color:rgba(255,255,255,.7);margin:-16px 0 28px;font-weight:500">${t.heroAr}</p>
      <div class="pl-btn-row">
        <a href="${contact}" class="pl-btn pl-btn-gold"><span class="material-symbols-outlined">calendar_month</span> ${t.cta1}</a>
        <a href="#portfolio" class="pl-btn pl-btn-outline"><span class="material-symbols-outlined">collections</span> ${t.cta2}</a>
      </div>
    </div>
  </section>

  <section class="pl-why">
    <div class="pl-container">
      <div class="pl-why-intro">
        <div class="pl-eyebrow">${isEn ? 'Why' : 'لماذا'}</div>
        <h2 class="pl-section-title">${t.whyTitle}</h2>
        <p class="pl-section-lead" style="margin:0 auto">${t.whyLead}</p>
      </div>
      <div class="pl-why-grid">${whyHtml}</div>
    </div>
  </section>

  <section class="pl-timeline-sec" id="process">
    <div class="pl-container">
      <div class="pl-eyebrow">${t.offerTitle}</div>
      <h2 class="pl-section-title">${isEn ? 'Your Launch Journey' : 'رحلة الإطلاق'}</h2>
      <p class="pl-section-lead">${t.offerLead}</p>
      <div class="pl-timeline-wrap"><div class="pl-timeline">${tlHtml}</div></div>
    </div>
  </section>

  <section class="pl-services">
    <div class="pl-container">
      <h2 class="pl-section-title">${t.svcTitle}</h2>
      <div class="pl-svc-grid">${svcHtml}</div>
    </div>
  </section>

  <section class="pl-deliverables" id="deliverables">
    <div class="pl-container">
      <div class="pl-eyebrow">${isEn ? 'Deliverables' : 'المخرجات'}</div>
      <h2 class="pl-section-title">${t.delTitle}</h2>
      <p class="pl-section-lead">${t.delLead}</p>
      <div class="pl-del-grid">${delHtml}</div>
    </div>
  </section>

  <section class="pl-stats pl-why-gh">
    <div class="pl-container">
      <h2 class="pl-section-title">${t.statsTitle}</h2>
      <div class="pl-stats-grid">${statsHtml}</div>
    </div>
  </section>

  <section class="pl-industries">
    <div class="pl-container">
      <h2 class="pl-section-title">${isEn ? 'Industries We Serve' : 'الصناعات التي نخدمها'}</h2>
      <div class="pl-ind-grid">${indHtml}</div>
    </div>
  </section>

  <section class="pl-portfolio" id="portfolio">
    <div class="pl-container">
      <div class="pl-slider-head">
        <div>
          <div class="pl-eyebrow">${isEn ? 'Portfolio' : 'أعمالنا'}</div>
          <h2 class="pl-section-title" style="margin:0">${t.portTitle}</h2>
        </div>
        <div class="pl-slider-nav">
          <button type="button" class="pl-slider-btn" id="plPrev" aria-label="Previous"><span class="material-symbols-outlined">chevron_left</span></button>
          <button type="button" class="pl-slider-btn" id="plNext" aria-label="Next"><span class="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
      <div class="pl-slider-track" id="plTrack">${slidesHtml}</div>
    </div>
  </section>

  <section class="pl-journey">
    <div class="pl-container" style="text-align:center">
      <h2 class="pl-section-title">${t.journeyTitle}</h2>
      <div class="pl-journey-flow">${journeyHtml}</div>
    </div>
  </section>

  <section class="pl-faq">
    <div class="pl-container">
      <h2 class="pl-section-title" style="text-align:center">${t.faqTitle}</h2>
      <div class="pl-faq-list">${faqHtml}</div>
    </div>
  </section>

  ${beforeAfterSection('project', lang)}

  <section class="pl-cta">
    <div class="pl-container">
      <div class="pl-cta-box">
        <h2>${t.ctaH}</h2>
        <p>${t.ctaP}</p>
        <a href="${contact}" class="pl-btn pl-btn-gold" style="font-size:15px;padding:16px 36px">
          ${t.cta1}
          <span class="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </div>
  </section>
</main>
<script>
(function(){
  var track=document.getElementById('plTrack');
  var prev=document.getElementById('plPrev');
  var next=document.getElementById('plNext');
  if(!track||!prev||!next) return;
  var step=function(dir){track.scrollBy({left:dir*400,behavior:'smooth'});};
  prev.addEventListener('click',function(){step(-1);});
  next.addEventListener('click',function(){step(1);});
})();
</script>`;
}

// GrowthLaunch EN
const glEn = head({
  title: 'GrowthLaunch™ | Lead Generation & Sales System | Graphics House',
  desc: 'GrowthLaunch™ — integrated lead generation and predictable sales pipeline in 7 business days.',
  ogTitle: 'GrowthLaunch™ | Graphics House',
  css: 'growth-launch',
  dir: 'ltr',
  lang: 'en',
}) + headerPlaceholder(true) + growthLaunchEnMain() + renderFooter(1, true) + '\n</body>\n</html>\n';

fs.writeFileSync(path.join(SOLUTIONS, 'growth-launch-en.html'), glEn);

// ProjectLaunch AR
const plAr = head({
  title: 'ProjectLaunch™ | نظام إطلاق المشاريع العقارية | Graphics House',
  desc: 'ProjectLaunch™ — نظام متكامل لإطلاق المشاريع العقارية من التصور إلى المبيعات.',
  ogTitle: 'ProjectLaunch™ | Graphics House',
  css: 'project-launch',
  dir: 'rtl',
  lang: 'ar',
}) + headerPlaceholder(false) + projectLaunchMain('ar') + renderFooter(1, false) + '\n</body>\n</html>\n';

fs.writeFileSync(path.join(SOLUTIONS, 'project-launch.html'), plAr);

// ProjectLaunch EN
const plEn = head({
  title: 'ProjectLaunch™ | Real Estate Launch System | Graphics House',
  desc: 'ProjectLaunch™ — complete creative launch system for real estate developers.',
  ogTitle: 'ProjectLaunch™ | Graphics House',
  css: 'project-launch',
  dir: 'ltr',
  lang: 'en',
}) + headerPlaceholder(true) + projectLaunchMain('en') + renderFooter(1, true) + '\n</body>\n</html>\n';

fs.writeFileSync(path.join(SOLUTIONS, 'project-launch-en.html'), plEn);

function brandScaleMain(lang) {
  const isEn = lang === 'en';
  const contact = isEn ? '../contact-us-en.html' : '../contact-us.html';
  const portfolio = isEn ? '../portfolio-en.html' : '../portfolio.html';
  const glLink = isEn ? 'growth-launch-en.html' : 'growth-launch.html';
  const plLink = isEn ? 'project-launch-en.html' : 'project-launch.html';

  const t = isEn
    ? {
        tag: 'Business Growth System',
        sub: 'BrandScale™ is a complete branding and digital growth system that helps companies build a premium identity, strengthen market positioning, and create a consistent customer experience across every touchpoint.',
        cta1: 'Book Strategy Session',
        cta2: 'View Our Work',
        whyTitle: 'Why BrandScale™?',
        whyQ1: 'Most companies buy a logo.',
        whyQ2: 'They don\'t build a brand.',
        whyQ3: 'We build a complete system.',
        getTitle: 'What You Get',
        processTitle: 'How We Work',
        indTitle: 'Industries',
        credTitle: 'Why Graphics House?',
        credLead: 'Beyond numbers — a track record of trust.',
        workTitle: 'Selected Work',
        idealTitle: 'Ideal For',
        faqTitle: 'Frequently Asked Questions',
        journeyTitle: 'Continue Your Growth Journey',
        journeyLead: 'After building your brand — how do you start attracting clients?',
        ctaH: 'Ready to Scale Your Brand?',
        ctaP: "Let's turn your brand into a strategic asset that supports business growth for years.",
        eyebrow: '03 · GRAPHICS HOUSE · Business Solutions',
      }
    : {
        tag: 'نظام نمو العلامة التجارية',
        sub: 'BrandScale™ هو نظام متكامل لبناء العلامة التجارية والنمو الرقمي، يساعد الشركات على تأسيس حضور احترافي، وتعزيز الثقة، وتحقيق نمو مستدام من خلال هوية قوية وتجربة متسقة.',
        cta1: 'احجز جلسة استراتيجية',
        cta2: 'شاهد نماذج الأعمال',
        whyTitle: 'لماذا BrandScale™؟',
        whyQ1: 'معظم الشركات تشتري شعارًا.',
        whyQ2: 'لكنها لا تبني علامة.',
        whyQ3: 'ونحن نبني نظامًا كاملاً.',
        getTitle: 'ماذا ستحصل؟',
        processTitle: 'كيف نعمل؟',
        indTitle: 'الصناعات',
        credTitle: 'لماذا نحن؟',
        credLead: 'بدلاً من أرقام فقط... قصة نجاح متواصلة.',
        workTitle: 'أعمال مختارة',
        idealTitle: 'مناسب لـ',
        faqTitle: 'الأسئلة الشائعة',
        journeyTitle: 'واصل رحلة النمو',
        journeyLead: 'بعد بناء العلامة... كيف تبدأ في جذب العملاء؟',
        ctaH: 'هل أنت مستعد لتوسيع علامتك؟',
        ctaP: 'لنحوّل علامتك التجارية إلى أصل استراتيجي يدعم نمو أعمالك لسنوات.',
        eyebrow: '03 · GRAPHICS HOUSE · حلول الأعمال',
      };

  const whyCards = isEn
    ? [
        ['🎯', 'Brand Strategy', 'Positioning, messaging & market differentiation.'],
        ['🎨', 'Visual Identity', 'Logo system, colors, typography & brand language.'],
        ['🌐', 'Corporate Website', 'Professional, conversion-focused web presence.'],
        ['📄', 'Company Profile', 'Investor-ready company documentation.'],
        ['📱', 'Social Media System', 'Content framework & visual templates.'],
        ['📈', 'Marketing Assets', 'All collateral for sales and marketing teams.'],
      ]
    : [
        ['🎯', 'Brand Strategy', 'استراتيجية العلامة والتموضع في السوق.'],
        ['🎨', 'Visual Identity', 'الهوية البصرية الكاملة.'],
        ['🌐', 'Corporate Website', 'الموقع الاحترافي للشركة.'],
        ['📄', 'Company Profile', 'بروفايل الشركة الاحترافي.'],
        ['📱', 'Social Media System', 'نظام المحتوى والقوالب البصرية.'],
        ['📈', 'Marketing Assets', 'جميع المواد التسويقية.'],
      ];

  const deliverables = [
    ['strategy', 'Brand Strategy'],
    ['token', 'Logo System'],
    ['palette', 'Visual Identity'],
    ['menu_book', 'Brand Guidelines'],
    ['language', 'Corporate Website'],
    ['description', 'Company Profile'],
    ['slideshow', 'Presentation Template'],
    ['mail', 'Email Signature'],
    ['badge', 'Business Cards'],
    ['share', 'Social Media Kit'],
    ['print', 'Marketing Collateral'],
    ['sell', 'Sales Materials'],
  ];

  const process = isEn
    ? ['Discovery', 'Research', 'Strategy', 'Identity', 'Digital Assets', 'Launch']
    : ['اكتشاف', 'بحث', 'استراتيجية', 'هوية', 'أصول رقمية', 'إطلاق'];

  const industries = isEn
    ? ['Real Estate', 'Healthcare', 'Engineering', 'Construction', 'Corporate', 'Government', 'Hospitality', 'Education']
    : ['عقاري', 'صحي', 'هندسي', 'مقاولات', 'شركات', 'حكومي', 'ضيافة', 'تعليم'];

  const credSteps = isEn
    ? [
        ['12+ Years', 'Creative & branding expertise'],
        ['Hundreds of Brands', 'Built across the region'],
        ['Millions', 'Audience reach generated'],
        ['Regional Experience', 'Saudi, GCC & beyond'],
        ['Long-Term Partnerships', 'Clients who grow with us'],
      ]
    : [
        ['12+ سنة', 'خبرة في العلامة والإبداع'],
        ['مئات العلامات', 'في المنطقة'],
        ['ملايين', 'وصول للجمهور'],
        ['خبرة إقليمية', 'السعودية والخليج وخارجها'],
        ['شراكات طويلة', 'عملاء ينمون معنا'],
      ];

  const workSlides = [
    {
      before: '../assets/projects/rendering/alrajhi3.jpeg',
      after: '../assets/projects/rendering/Anan-Escan-Co.01.jpeg',
      title: isEn ? 'Corporate Rebrand' : 'إعادة بناء هوية',
      desc: isEn ? 'Project → Brand → Market confidence' : 'مشروع → علامة → ثقة السوق',
    },
    {
      before: '../assets/projects/rendering/The-Meteorological-Building.jpeg',
      after: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg',
      title: isEn ? 'Developer Identity' : 'هوية مطور عقاري',
      desc: isEn ? 'Weak presence → Premium positioning' : 'حضور ضعيف → تموضع فاخر',
    },
    {
      before: '../assets/mm-brand.jpg',
      after: '../assets/projects/rendering/uae-e1745147961286.jpeg',
      title: isEn ? 'Launch Brand System' : 'نظام علامة للإطلاق',
      desc: isEn ? 'Concept → Brand → Sales traction' : 'فكرة → علامة → زخم مبيعات',
    },
  ];

  const ideal = isEn
    ? ['New company', 'Brand rebuild', 'Entering Saudi market', 'New service launch', 'Digital transformation', 'Regional expansion']
    : ['شركة جديدة', 'إعادة بناء الهوية', 'دخول السوق السعودي', 'إطلاق خدمة جديدة', 'التحول الرقمي', 'التوسع الإقليمي'];

  const faqs = isEn
    ? [
        ['Can you evolve our existing identity?', 'Yes. We audit your current brand, keep what works, and elevate the system without losing recognition.'],
        ['Can the website be built later?', 'Absolutely. BrandScale is modular — start with strategy & identity, add website and digital assets when ready.'],
        ['How long does the process take?', 'Typically 4–8 weeks depending on scope. We provide a clear timeline in the proposal.'],
        ['Do you include Brand Strategy?', 'Yes. Strategy is the foundation — positioning, audience, messaging, and competitive differentiation.'],
        ['Is a brand guidelines manual included?', 'Yes. Every package includes brand guidelines for consistent application across all touchpoints.'],
      ]
    : [
        ['هل يمكن تطوير الهوية الحالية؟', 'نعم. نراجع علامتك الحالية، نحتفظ بما يعمل، ونرتقي بالنظام دون فقدان التعرّف.'],
        ['هل يمكن تنفيذ الموقع لاحقًا؟', 'بالتأكيد. BrandScale مرن — ابدأ بالاستراتيجية والهوية وأضف الموقع عند الجاهزية.'],
        ['كم تستغرق العملية؟', 'عادة 4–8 أسابيع حسب النطاق. نحدد جدولاً واضحاً في العرض.'],
        ['هل تقدمون Brand Strategy؟', 'نعم. الاستراتيجية هي الأساس — التموضع والجمهور والرسائل والتمييز.'],
        ['هل تشمل الخدمة دليل الهوية؟', 'نعم. كل حزمة تتضمن دليل هوية لضمان الاتساق في كل نقاط التواصل.'],
      ];

  const whyHtml = whyCards
    .map(([icon, title, desc]) => `<div class="bs-why-card"><div class="bs-why-icon">${icon}</div><h3>${title}</h3><p>${desc}</p></div>`)
    .join('\n');

  const getHtml = deliverables
    .map(([icon, label]) => `<div class="bs-get-item"><span class="material-symbols-outlined">${icon}</span>${label}</div>`)
    .join('\n');

  const flowHtml = process
    .map((step, i) => {
      const arrow = i < process.length - 1 ? '<span class="bs-flow-arrow">↓</span>' : '';
      return `<span class="bs-flow-step">${step}</span>${arrow}`;
    })
    .join('\n');

  const indHtml = industries.map((i) => `<div class="bs-ind-item">${i}</div>`).join('\n');

  const credHtml = credSteps
    .map(([strong, span], i) => {
      const arrow = i < credSteps.length - 1 ? '<span class="bs-cred-arrow">↓</span>' : '';
      return `<div class="bs-cred-step"><strong>${strong}</strong><span>${span}</span></div>${arrow}`;
    })
    .join('\n');

  const slidesHtml = workSlides
    .map(
      (s) => `<article class="bs-slide">
        <div class="bs-slide-visual">
          <div class="bs-slide-side"><img src="${s.before}" alt="" loading="lazy"><label>${isEn ? 'Before' : 'قبل'}</label></div>
          <div class="bs-slide-mid"><span class="material-symbols-outlined">arrow_forward</span></div>
          <div class="bs-slide-side"><img src="${s.after}" alt="" loading="lazy"><label>${isEn ? 'After' : 'بعد'}</label></div>
        </div>
        <div class="bs-slide-body"><h3>${s.title}</h3><p>${s.desc}</p></div>
      </article>`
    )
    .join('\n');

  const idealHtml = ideal
    .map((item, i) => {
      const arrow = i < ideal.length - 1 ? '<span class="bs-ideal-arrow">↓</span>' : '';
      return `<span class="bs-ideal-card">${item}</span>${arrow}`;
    })
    .join('\n');

  const faqHtml = faqs
    .map(([q, a]) => `<details class="bs-faq-item"><summary>${q}</summary><p>${a}</p></details>`)
    .join('\n');

  const heroEn = isEn ? 'Build a Brand That Inspires Trust and Drives Growth.' : '';
  const heroH1 = isEn
    ? 'BrandScale<span class="tm">™</span>'
    : 'ابنِ علامة تجارية تترك انطباعًا...<br><span style="font-size:0.55em;font-weight:600;color:rgba(255,255,255,.75)">وتحقق نموًا مستدامًا.</span>';

  return `<main>
  <section class="bs-hero">
    <div class="bs-hero-bg">
      <video autoplay muted loop playsinline poster="../assets/mm-brand.jpg">
        <source src="../assets/videos/GH-Marketing-Media-Production.mp4" type="video/mp4">
      </video>
      <img src="../assets/mm-brand.jpg" alt="" aria-hidden="true" style="position:absolute;inset:0;object-fit:cover;width:100%;height:100%">
    </div>
    <div class="bs-hero-overlay"></div>
    <div class="bs-container bs-hero-inner">
      <div class="bs-eyebrow"><span class="num">03</span> ${t.eyebrow}</div>
      ${isEn ? `<p class="bs-hero-en">${heroEn}</p><h1>${heroH1}</h1>` : `<h1>${heroH1}</h1><p style="font-size:14px;color:var(--bs-gold);font-weight:700;margin:12px 0 0">BrandScale<span class="tm">™</span></p>`}
      <p class="bs-hero-tag">${t.tag}</p>
      <p class="bs-hero-sub">${t.sub}</p>
      <div class="bs-btn-row">
        <a href="${contact}" class="bs-btn bs-btn-gold"><span class="material-symbols-outlined">calendar_month</span> ${t.cta1}</a>
        <a href="${portfolio}" class="bs-btn bs-btn-outline"><span class="material-symbols-outlined">collections</span> ${t.cta2}</a>
      </div>
    </div>
  </section>

  <section class="bs-why">
    <div class="bs-container">
      <div class="bs-why-intro">
        <h2 class="bs-section-title">${t.whyTitle}</h2>
      </div>
      <p class="bs-why-quote">${t.whyQ1}<br>${t.whyQ2}<br><em>${t.whyQ3}</em></p>
      <div class="bs-why-grid">${whyHtml}</div>
    </div>
  </section>

  <section class="bs-get">
    <div class="bs-container">
      <h2 class="bs-section-title">${t.getTitle}</h2>
      <div class="bs-get-grid">${getHtml}</div>
    </div>
  </section>

  <section class="bs-process">
    <div class="bs-container">
      <h2 class="bs-section-title">${t.processTitle}</h2>
      <div class="bs-flow">${flowHtml}</div>
    </div>
  </section>

  <section class="bs-ind">
    <div class="bs-container">
      <h2 class="bs-section-title">${t.indTitle}</h2>
      <div class="bs-ind-grid">${indHtml}</div>
    </div>
  </section>

  <section class="bs-cred">
    <div class="bs-container">
      <h2 class="bs-section-title" style="text-align:center">${t.credTitle}</h2>
      <p class="bs-cred-intro">${t.credLead}</p>
      <div class="bs-cred-chain">${credHtml}</div>
    </div>
  </section>

  <section class="bs-work">
    <div class="bs-container">
      <div class="bs-slider-head">
        <h2 class="bs-section-title" style="margin:0">${t.workTitle}</h2>
        <div class="bs-slider-nav">
          <button type="button" class="bs-slider-btn" id="bsPrev" aria-label="Previous"><span class="material-symbols-outlined">chevron_left</span></button>
          <button type="button" class="bs-slider-btn" id="bsNext" aria-label="Next"><span class="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
      <div class="bs-slider-track" id="bsTrack">${slidesHtml}</div>
    </div>
  </section>

  <section class="bs-ideal">
    <div class="bs-container">
      <h2 class="bs-section-title">${t.idealTitle}</h2>
      <div class="bs-ideal-grid">${idealHtml}</div>
    </div>
  </section>

  <section class="bs-faq">
    <div class="bs-container">
      <h2 class="bs-section-title" style="text-align:center">${t.faqTitle}</h2>
      <div class="bs-faq-list">${faqHtml}</div>
    </div>
  </section>

  ${beforeAfterSection('brand', lang)}

  <section class="bs-journey">
    <div class="bs-container">
      <h2 class="bs-section-title">${t.journeyTitle}</h2>
      <p class="bs-section-lead" style="margin:0 auto;text-align:center">${t.journeyLead}</p>
      <div class="bs-journey-cards">
        <a href="${glLink}" class="bs-journey-card">
          <div class="icon">🚀</div>
          <h3>GrowthLaunch™</h3>
          <p>${isEn ? 'Generate Qualified Leads' : 'توليد عملاء مؤهلين'}</p>
        </a>
        <a href="${plLink}" class="bs-journey-card">
          <div class="icon">🏗</div>
          <h3>ProjectLaunch™</h3>
          <p>${isEn ? 'Launch Real Estate Projects' : 'إطلاق المشاريع العقارية'}</p>
        </a>
      </div>
    </div>
  </section>

  <section class="bs-cta">
    <div class="bs-container">
      <div class="bs-cta-box">
        <h2>${t.ctaH}</h2>
        <p>${t.ctaP}</p>
        <a href="${contact}" class="bs-btn bs-btn-gold" style="font-size:15px;padding:16px 36px">
          ${t.cta1}
          <span class="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </div>
  </section>
</main>
<script>
(function(){
  var track=document.getElementById('bsTrack');
  var prev=document.getElementById('bsPrev');
  var next=document.getElementById('bsNext');
  if(!track||!prev||!next) return;
  var step=function(dir){track.scrollBy({left:dir*360,behavior:'smooth'});};
  prev.addEventListener('click',function(){step(-1);});
  next.addEventListener('click',function(){step(1);});
})();
</script>`;
}

// BrandScale AR
const bsAr = head({
  title: 'BrandScale™ | نظام نمو العلامة التجارية | Graphics House',
  desc: 'BrandScale™ — نظام متكامل لبناء العلامة التجارية والنمو الرقمي.',
  ogTitle: 'BrandScale™ | Graphics House',
  css: 'brand-scale',
  dir: 'rtl',
  lang: 'ar',
}) + headerPlaceholder(false) + brandScaleMain('ar') + renderFooter(1, false) + '\n</body>\n</html>\n';

fs.writeFileSync(path.join(SOLUTIONS, 'brand-scale.html'), bsAr);

// BrandScale EN
const bsEn = head({
  title: 'BrandScale™ | Brand Growth System | Graphics House',
  desc: 'BrandScale™ — complete branding and digital growth system for premium market positioning.',
  ogTitle: 'BrandScale™ | Graphics House',
  css: 'brand-scale',
  dir: 'ltr',
  lang: 'en',
}) + headerPlaceholder(true) + brandScaleMain('en') + renderFooter(1, true) + '\n</body>\n</html>\n';

fs.writeFileSync(path.join(SOLUTIONS, 'brand-scale-en.html'), bsEn);

console.log('Generated: growth-launch-en, project-launch (AR/EN), brand-scale (AR/EN)');
