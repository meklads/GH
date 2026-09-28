#!/usr/bin/env node
/**
 * Inject ProjectLaunch-grade sales-room layers (early proof · ladder · assess)
 * into flagship pages that still read as catalogs.
 *
 * Idempotent via <!-- GH_SALES_ROOM_START --> markers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARK_START = '<!-- GH_SALES_ROOM_START -->';
const MARK_END = '<!-- GH_SALES_ROOM_END -->';
const CSS_HREF = 'assets/gh-sales-room.css?v=1';
const JS_SRC = 'assets/gh-sales-room.js?v=1';

function prefixFor(rel) {
  const depth = rel.split('/').length - 1;
  return depth ? '../'.repeat(depth) : '';
}

function stripBlock(html) {
  const re = new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}\\n?`, 'g');
  return html.replace(re, '');
}

function ensureAssets(html, prefix) {
  const cssTag = `<link rel="stylesheet" href="${prefix}${CSS_HREF}">`;
  const jsTag = `<script defer src="${prefix}${JS_SRC}"></script>`;
  let out = html;
  if (!out.includes(CSS_HREF)) {
    if (out.includes('</head>')) out = out.replace('</head>', `${cssTag}\n</head>`);
    else out = cssTag + out;
  }
  if (!out.includes(JS_SRC)) {
    if (out.includes('</body>')) out = out.replace('</body>', `${jsTag}\n</body>`);
    else out += jsTag;
  }
  return out;
}

function ladderCard({ num, title, fit, outs, time, cta, href, tier, featured }) {
  return `<article class="pl-ladder-card${featured ? ' is-featured' : ''} reveal" style="opacity:0;transform:translateY(24px)">
 <span class="pl-ladder-num">${num}</span>
 <h3>${title}</h3>
 <p class="pl-ladder-fit">${fit}</p>
 <ul class="pl-ladder-outs">${outs.map((o) => `<li>${o}</li>`).join('')}</ul>
 <p class="pl-ladder-time">${time}</p>
 <a href="${href}" class="pl-btn-pill pl-btn-on-light" data-cta="ladder-${tier}" data-pl-tier="${tier}">${cta}</a>
</article>`;
}

function assessBlock({ lang, title, lead, questions, ctaHref, ctaLabel }) {
  const yes = lang === 'en' ? 'Yes' : 'نعم';
  const no = lang === 'en' ? 'No' : 'لا';
  const items = questions
    .map(
      (q, i) => `<li class="pl-assess-item" data-gap="${q.gap}">
 <div class="pl-assess-item-row"><span class="q">${i + 1}</span><div><p class="pl-assess-qtext">${q.text}</p></div></div>
 <div class="pl-assess-btns"><button type="button" data-ans="yes">${yes}</button><button type="button" data-ans="no">${no}</button></div>
</li>`
    )
    .join('');
  return `<section class="pl-assess-host" id="assess" aria-label="${lang === 'en' ? 'Readiness check' : 'تقييم الجاهزية'}">
 <div class="pl-assess-host-inner">
 <div class="pl-assess-head reveal" style="opacity:0;transform:translateY(24px)">
 <h2>${title}</h2>
 <p>${lead}</p>
 </div>
 <div class="pl-assess reveal" style="opacity:0;transform:translateY(24px)" data-pl-assess data-lang="${lang}">
 <ul class="pl-assess-list">${items}</ul>
 <div class="pl-assess-result" data-pl-assess-result hidden>
 <h3 data-pl-assess-title></h3>
 <p data-pl-assess-body></p>
 <ul class="pl-assess-gaps" data-pl-assess-gaps></ul>
 <a href="${ctaHref}" class="pl-btn-pill pl-btn-on-light inline-flex" data-cta="assess-book" data-pl-assess-cta data-pl-tier="assess">${ctaLabel}</a>
 </div>
 </div>
 </div>
</section>`;
}

function proofBlock({ eyebrow, title, body, meta, linkHref, linkLabel, img, imgAlt }) {
  return `<section class="pl-proof-early" id="proof-early" aria-label="${eyebrow}">
 <div class="pl-proof-early-inner reveal" style="opacity:0;transform:translateY(24px)">
 <div class="pl-proof-early-media">
 <img src="${img}" alt="${imgAlt}" loading="lazy" width="960" height="720">
 </div>
 <div>
 <span class="pl-proof-early-eyebrow">${eyebrow}</span>
 <h2>${title}</h2>
 <p>${body}</p>
 <div class="pl-proof-early-meta">${meta.map((m) => `<span>${m}</span>`).join('')}</div>
 <a class="pl-proof-early-link" href="${linkHref}">${linkLabel}</a>
 </div>
 </div>
</section>`;
}

function salesRoomHtml(cfg) {
  const ladder = `<section class="pl-ladder-sec" id="readiness" aria-label="${cfg.ladderAria}">
 <div class="pl-ladder-head reveal" style="opacity:0;transform:translateY(24px)">
 <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block" style="display:block;font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:rgba(20,20,20,.45);margin-bottom:12px">${cfg.ladderEyebrow}</span>
 <h2>${cfg.ladderTitle}</h2>
 <p>${cfg.ladderLead}</p>
 </div>
 <div class="pl-ladder-grid">${cfg.ladder.map(ladderCard).join('')}</div>
</section>`;
  return `${MARK_START}
${proofBlock(cfg.proof)}
${ladder}
${assessBlock(cfg.assess)}
${MARK_END}
`;
}

const PAGES = {
  'real-estate.html': (p) => ({
    lang: 'ar',
    insertBefore: '<section class="revs-section" aria-labelledby="revs-problem-title">',
    fallbackBefore: '</main>',
    proof: {
      eyebrow: 'من أعمالنا',
      title: 'عنان إسكان: منظومة بصرية جعلت المخطط قابلاً للبيع',
      body: 'رندرات ومجسم ولغة واحدة — حتى يفهم المشتري المشروع قبل الخرسانة، لا كمجموعة صور متناثرة.',
      meta: ['الرياض', 'رندرات + مجسم', 'جاهزية بيع'],
      linkHref: 'insights/projects/anan-eskan-riyadh.html',
      linkLabel: 'اقرأ دراسة الحالة',
      img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
      imgAlt: 'مجسم عنان إسكان',
    },
    ladderAria: 'سلّم جاهزية الإطلاق العقاري',
    ladderEyebrow: 'اختر مستوى الجاهزية',
    ladderTitle: 'ثلاث درجات — حسب مرحلة مشروعك',
    ladderLead: 'لا حاجة لكل الطبقات دفعة واحدة. نضبط النطاق في الجلسة الأولى حسب جدول الإطلاق.',
    ladder: [
      {
        num: '01',
        title: 'حضور بصري للبيع',
        fit: 'عندما تحتاج تعريفاً مقنعاً قبل الترخيص أو الإطلاق.',
        outs: ['هوية/رسالة مختصرة', 'حزمة رندرات أساسية', 'أصول رقمية للحملة الأولى'],
        time: 'أسابيع قليلة حسب النطاق',
        cta: 'ابدأ من هنا',
        href: `${p}contact-us.html`,
        tier: 'visual-ready',
      },
      {
        num: '02',
        title: 'نظام إطلاق المبيعات',
        fit: 'عندما يكون الفريق بحاجة لأدوات تُقنع داخل الصالة والقنوات.',
        outs: ['فيلم + مجسم', 'مواد بيع مترابطة', 'تأهيل فراغ العرض'],
        time: 'وفق موعد الافتتاح',
        cta: 'احجز جلسة صالة',
        href: `${p}contact-us.html`,
        tier: 'sales-gallery',
        featured: true,
      },
      {
        num: '03',
        title: 'منظومة ProjectLaunch™',
        fit: 'لإطلاق مؤسسي على الخارطة: قصة واحدة من المخطط حتى يوم البيع.',
        outs: ['هوية + محتوى + مجسم + صالة', 'جدول تسليم موحّد', 'تنسيق طبقات المكان والسوق'],
        time: 'يُحدَّد بعد تقييم الجاهزية',
        cta: 'استكشف المنظومة',
        href: `${p}solutions/project-launch.html`,
        tier: 'full-system',
      },
    ],
    assess: {
      lang: 'ar',
      title: 'هل مشروعك جاهز للسوق؟',
      lead: 'خمس إجابات سريعة تكشف الفجوة — ثم نوجّهك لمسار الجلسة.',
      ctaHref: `${p}contact-us.html`,
      ctaLabel: 'احجز جلسة إطلاق بصري',
      questions: [
        { gap: 'identity', text: 'هل لديك لغة بصرية واحدة لكل قنوات الإطلاق؟' },
        { gap: 'content', text: 'هل الرندرات/الفيلم كافية لشرح المخطط في دقائق؟' },
        { gap: 'gallery', text: 'هل صالة البيع أو العرض تملك أدوات إقناع جاهزة؟' },
        { gap: 'system', text: 'هل أصول الحملة والمبيعات مترابطة أم ملفات منفصلة؟' },
        { gap: 'system', text: 'هل جدول الإطلاق مربوط بتسليم بصري واضح؟' },
      ],
    },
  }),
  'real-estate/index.html': (p) => ({
    lang: 'en',
    insertBefore: '<section class="revs-section" aria-labelledby="revs-problem-title">',
    fallbackBefore: '</main>',
    proof: {
      eyebrow: 'From our work',
      title: 'Anan Eskan: a visual system that made the plan sellable',
      body: 'Renders, maquette, and one language — so buyers understand the project before concrete, not as a scatter of images.',
      meta: ['Riyadh', 'Renders + maquette', 'Sales-ready'],
      linkHref: `${p}insights/projects/anan-eskan-riyadh-en.html`,
      linkLabel: 'Read the case study',
      img: `${p}assets/projects/maquettes/anan-eskan-maquette-01.jpeg`,
      imgAlt: 'Anan Eskan maquette',
    },
    ladderAria: 'Real-estate launch readiness ladder',
    ladderEyebrow: 'Pick a readiness level',
    ladderTitle: 'Three levels — matched to your stage',
    ladderLead: 'You do not need every layer at once. We size scope in the first session against your launch date.',
    ladder: [
      {
        num: '01',
        title: 'Sales-ready visuals',
        fit: 'When you need a convincing definition before licensing or launch.',
        outs: ['Short identity / message lock', 'Core render pack', 'Digital assets for first campaign'],
        time: 'A few weeks depending on scope',
        cta: 'Start here',
        href: `${p}contact-us-en.html`,
        tier: 'visual-ready',
      },
      {
        num: '02',
        title: 'Sales launch system',
        fit: 'When the team needs tools that persuade in gallery and channels.',
        outs: ['Film + maquette', 'Linked sales materials', 'Gallery space readiness'],
        time: 'Aligned to opening date',
        cta: 'Book a gallery session',
        href: `${p}contact-us-en.html`,
        tier: 'sales-gallery',
        featured: true,
      },
      {
        num: '03',
        title: 'Full ProjectLaunch™',
        fit: 'Institutional off-plan launch: one story from masterplan to sales day.',
        outs: ['Identity + content + maquette + gallery', 'Unified delivery calendar', 'Place and market layers when needed'],
        time: 'Set after readiness review',
        cta: 'Explore the system',
        href: `${p}solutions/project-launch-en.html`,
        tier: 'full-system',
      },
    ],
    assess: {
      lang: 'en',
      title: 'Is your project market-ready?',
      lead: 'Five quick answers reveal the gap — then we route you to the right session.',
      ctaHref: `${p}contact-us-en.html`,
      ctaLabel: 'Book a visual launch session',
      questions: [
        { gap: 'identity', text: 'Do you have one visual language across every launch channel?' },
        { gap: 'content', text: 'Can renders/film explain the plan in minutes?' },
        { gap: 'gallery', text: 'Does the sales gallery have persuasion tools ready?' },
        { gap: 'system', text: 'Are campaign and sales assets linked — or separate files?' },
        { gap: 'system', text: 'Is the launch calendar tied to a clear visual delivery plan?' },
      ],
    },
  }),
  'solutions/growth-launch.html': (p) => ({
    lang: 'ar',
    insertBefore: '<section class="gl-gap">',
    fallbackBefore: '<section class="gl-faq-sec">',
    proof: {
      eyebrow: 'من أعمالنا',
      title: 'ملتقى جدة: هوية وفيلم وكتالوج في مسار واحد',
      body: 'عندما تترابط الرسالة والأصول، يصبح التحويل من الاهتمام إلى طلب أسرع — وهذا ما يكمّله GrowthLaunch™ بعد جاهزية العرض.',
      meta: ['هوية', 'كتالوج', 'CGI'],
      linkHref: `${p}case-studies/jeddah-real-estate-forum.html`,
      linkLabel: 'اقرأ دراسة الحالة',
      img: `${p}assets/projects/jeddah-forum/catalog/page-01.jpg`,
      imgAlt: 'ملتقى جدة للعقار',
    },
    ladderAria: 'سلّم جاهزية مسار المبيعات',
    ladderEyebrow: 'اختر عمق المسار',
    ladderTitle: 'ثلاث درجات لمسار المبيعات',
    ladderLead: 'من رد سريع بعد الحملة إلى منظومة CRM قابلة للقياس.',
    ladder: [
      {
        num: '01',
        title: 'رد خلال دقائق',
        fit: 'للحملات التي تجلب زيارات دون متابعة منظمة.',
        outs: ['صفحات هبوط عالية النية', 'واتساب / رد فوري', 'تتبّع مصدر أساسي'],
        time: 'أيام معدودة بعد قفل العرض',
        cta: 'ابدأ مسار الرد',
        href: `${p}contact-us.html`,
        tier: 'response',
      },
      {
        num: '02',
        title: 'مسار مبيعات متصل',
        fit: 'عندما تحتاج رؤية من النقرة إلى الموعد.',
        outs: ['CRM بملكية واضحة', 'تأهيل ليذر', 'تقارير أسبوعية'],
        time: 'حسب قنواتكم الحالية',
        cta: 'احجز جلسة المسار',
        href: `${p}contact-us.html`,
        tier: 'pipeline',
        featured: true,
      },
      {
        num: '03',
        title: 'GrowthLaunch™ كامل',
        fit: 'بعد BrandScale™ وProjectLaunch™ — تشغيل سوق مستمر.',
        outs: ['حملات + صالة + متابعة', 'تحسين أداء مستمر', 'تنسيق مع بيزموشن عند الحاجة'],
        time: 'يُحدَّد بعد تقييم الفجوة',
        cta: 'جلسة المنظومة',
        href: `${p}contact-us.html`,
        tier: 'full-growth',
      },
    ],
    assess: {
      lang: 'ar',
      title: 'أين يتسرب عملاؤك بعد الحملة؟',
      lead: 'أجب بنعم/لا — نحدد إن كانت الفجوة في الرد، التتبع، أو المسار الكامل.',
      ctaHref: `${p}contact-us.html`,
      ctaLabel: 'احجز جلسة مسار المبيعات',
      questions: [
        { gap: 'gallery', text: 'هل يُرد على الاستفسارات خلال ساعة في أيام الإطلاق؟' },
        { gap: 'content', text: 'هل صفحة الهبوط تطابق رسالة الصالة والعرض؟' },
        { gap: 'identity', text: 'هل تعرف مصدر كل موعد مبيعات؟' },
        { gap: 'system', text: 'هل بيانات واتساب والجداول في نظام واحد؟' },
        { gap: 'system', text: 'هل لديكم تحسين أسبوعي مبني على أرقام؟' },
      ],
    },
  }),
  'solutions/growth-launch-en.html': (p) => ({
    lang: 'en',
    insertBefore: '<section class="gl-gap">',
    fallbackBefore: '<section class="gl-faq-sec">',
    proof: {
      eyebrow: 'From our work',
      title: 'Jeddah Forum: identity, film, and catalogue in one path',
      body: 'When message and assets stay linked, interest converts faster — GrowthLaunch™ extends that after the gallery is ready.',
      meta: ['Identity', 'Catalogue', 'CGI'],
      linkHref: `${p}case-studies/jeddah-real-estate-forum-en.html`,
      linkLabel: 'Read the case study',
      img: `${p}assets/projects/jeddah-forum/catalog/page-01.jpg`,
      imgAlt: 'Jeddah Real Estate Forum',
    },
    ladderAria: 'Sales-path readiness ladder',
    ladderEyebrow: 'Pick path depth',
    ladderTitle: 'Three levels for the sales path',
    ladderLead: 'From fast response after ads to a measurable CRM system.',
    ladder: [
      {
        num: '01',
        title: 'Minutes-to-reply',
        fit: 'When campaigns bring traffic without structured follow-up.',
        outs: ['High-intent landing pages', 'WhatsApp / instant reply', 'Basic source tracking'],
        time: 'Days after offer lock',
        cta: 'Start response path',
        href: `${p}contact-us-en.html`,
        tier: 'response',
      },
      {
        num: '02',
        title: 'Connected sales path',
        fit: 'When you need visibility from click to appointment.',
        outs: ['CRM with clear ownership', 'Lead qualification', 'Weekly reporting'],
        time: 'Based on your channels',
        cta: 'Book a path session',
        href: `${p}contact-us-en.html`,
        tier: 'pipeline',
        featured: true,
      },
      {
        num: '03',
        title: 'Full GrowthLaunch™',
        fit: 'After BrandScale™ and ProjectLaunch™ — continuous market run.',
        outs: ['Campaigns + gallery + follow-up', 'Ongoing performance loops', 'BeesMotion coordination when needed'],
        time: 'Set after gap review',
        cta: 'Book the system session',
        href: `${p}contact-us-en.html`,
        tier: 'full-growth',
      },
    ],
    assess: {
      lang: 'en',
      title: 'Where do leads leak after the campaign?',
      lead: 'Yes/no answers show whether the gap is reply speed, tracking, or the full path.',
      ctaHref: `${p}contact-us-en.html`,
      ctaLabel: 'Book a sales-path session',
      questions: [
        { gap: 'gallery', text: 'Do inquiries get a reply within an hour on launch days?' },
        { gap: 'content', text: 'Does the landing page match gallery and offer messaging?' },
        { gap: 'identity', text: 'Do you know the source of every sales appointment?' },
        { gap: 'system', text: 'Are WhatsApp and spreadsheets in one system?' },
        { gap: 'system', text: 'Do you run a weekly improvement loop from numbers?' },
      ],
    },
  }),
  'solutions/brand-scale.html': (p) => ({
    lang: 'ar',
    insertBefore: '<section class="gl-gap">',
    fallbackBefore: '<section class="gl-faq-sec">',
    proof: {
      eyebrow: 'من أعمالنا',
      title: 'ميثاق مكة: لغة علامة واحدة عبر المجسم والفضاء',
      body: 'عندما تتعدد المشاريع دون نظام علامة، يتشتت الفريق. BrandScale™ يثبّت التموضع قبل أي إطلاق.',
      meta: ['هوية', 'معرض', 'اتساق'],
      linkHref: `${p}casestudy-mwl.html`,
      linkLabel: 'اقرأ دراسة الحالة',
      img: `${p}assets/news/makkah-charter-01.jpeg`,
      imgAlt: 'ميثاق مكة',
    },
    ladderAria: 'سلّم جاهزية نظام العلامة',
    ladderEyebrow: 'اختر عمق النظام',
    ladderTitle: 'ثلاث درجات لنمو العلامة',
    ladderLead: 'من قفل التموضع إلى دليل تشغيل يوحّد كل مشروع جديد.',
    ladder: [
      {
        num: '01',
        title: 'قفل التموضع',
        fit: 'عندما تختلف لغة كل إطلاق عن الآخر.',
        outs: ['تموضع ورسالة أساسية', 'اتجاه بصري أولي', 'قواعد استخدام سريعة'],
        time: 'أيام بعد الورشة',
        cta: 'ابدأ بالتموضع',
        href: `${p}contact-us.html`,
        tier: 'positioning',
      },
      {
        num: '02',
        title: 'نظام هوية قابل للتوسع',
        fit: 'للمطورين متعددي المشاريع.',
        outs: ['هوية بصرية كاملة', 'دليل فريق', 'قوالب رقمية'],
        time: 'وفق نطاق المحفظة',
        cta: 'جلسة نظام العلامة',
        href: `${p}contact-us.html`,
        tier: 'identity-system',
        featured: true,
      },
      {
        num: '03',
        title: 'BrandScale™ → إطلاق',
        fit: 'الجسر إلى ProjectLaunch™ وGrowthLaunch™.',
        outs: ['لغة واحدة لكل مشروع', 'جاهزية للعرض والصالة', 'تسليم لمجموعة تسامي عند الحاجة'],
        time: 'يُحدَّد بعد التقييم',
        cta: 'احجز الجلسة الكاملة',
        href: `${p}contact-us.html`,
        tier: 'full-brand',
      },
    ],
    assess: {
      lang: 'ar',
      title: 'هل علامتكم نظام أم شعارات متفرقة؟',
      lead: 'خمس إجابات تكشف إن كنتم جاهزين للإطلاق أم تحتاجون قفل التموضع أولاً.',
      ctaHref: `${p}contact-us.html`,
      ctaLabel: 'احجز جلسة نظام العلامة',
      questions: [
        { gap: 'identity', text: 'هل كل مشاريعكم تُقرأ كمؤسسة واحدة؟' },
        { gap: 'content', text: 'هل لديكم دليل استخدام للهوية يلتزم به الفريق؟' },
        { gap: 'gallery', text: 'هل الحضور الرقمي يعكس قيمة محفظتكم؟' },
        { gap: 'system', text: 'هل الحملات تبدو من جهة واحدة أم من مصادر مختلفة؟' },
        { gap: 'system', text: 'هل المشروع الجديد يبدأ من نظامكم أم من الصفر؟' },
      ],
    },
  }),
  'solutions/brand-scale-en.html': (p) => ({
    lang: 'en',
    insertBefore: '<section class="gl-gap">',
    fallbackBefore: '<section class="gl-faq-sec">',
    proof: {
      eyebrow: 'From our work',
      title: 'Makkah Charter: one brand language across maquette and space',
      body: 'When projects multiply without a brand system, teams fragment. BrandScale™ locks positioning before any launch.',
      meta: ['Identity', 'Exhibition', 'Consistency'],
      linkHref: `${p}casestudy-mwl-en.html`,
      linkLabel: 'Read the case study',
      img: `${p}assets/news/makkah-charter-01.jpeg`,
      imgAlt: 'Makkah Charter',
    },
    ladderAria: 'Brand-system readiness ladder',
    ladderEyebrow: 'Pick system depth',
    ladderTitle: 'Three levels for brand growth',
    ladderLead: 'From positioning lock to an operating kit that unifies every new project.',
    ladder: [
      {
        num: '01',
        title: 'Positioning lock',
        fit: 'When every launch speaks a different language.',
        outs: ['Core positioning & message', 'Initial visual direction', 'Quick usage rules'],
        time: 'Days after the workshop',
        cta: 'Start with positioning',
        href: `${p}contact-us-en.html`,
        tier: 'positioning',
      },
      {
        num: '02',
        title: 'Scalable identity system',
        fit: 'For multi-project developers.',
        outs: ['Full visual identity', 'Team playbook', 'Digital templates'],
        time: 'Based on portfolio scope',
        cta: 'Book brand-system session',
        href: `${p}contact-us-en.html`,
        tier: 'identity-system',
        featured: true,
      },
      {
        num: '03',
        title: 'BrandScale™ → launch',
        fit: 'The bridge into ProjectLaunch™ and GrowthLaunch™.',
        outs: ['One language per project', 'Gallery-ready foundations', 'Tasami Group handoff when needed'],
        time: 'Set after assessment',
        cta: 'Book the full session',
        href: `${p}contact-us-en.html`,
        tier: 'full-brand',
      },
    ],
    assess: {
      lang: 'en',
      title: 'Is your brand a system — or scattered logos?',
      lead: 'Five answers show whether you are launch-ready or need positioning lock first.',
      ctaHref: `${p}contact-us-en.html`,
      ctaLabel: 'Book a brand-system session',
      questions: [
        { gap: 'identity', text: 'Do all your projects read as one institution?' },
        { gap: 'content', text: 'Do you have an identity playbook the team follows?' },
        { gap: 'gallery', text: 'Does digital presence reflect portfolio value?' },
        { gap: 'system', text: 'Do campaigns feel like one source — or many?' },
        { gap: 'system', text: 'Does each new project start from your system, not from scratch?' },
      ],
    },
  }),
  'services/interactive-experiences.html': (p) => ({
    lang: 'ar',
    insertBefore: '<section class="gh-svc-links">',
    fallbackBefore: '<section class="gh-svc-cta',
    proof: {
      eyebrow: 'من أعمالنا',
      title: 'ميثاق مكة: مجسم تفاعلي يشرح المبادرات في دقائق',
      body: 'شاشات ومسار ضيف ولغة واحدة — حتى تصبح الصالة أو المعرض أداة إقناع، لا ديكوراً يُشغَّل فقط.',
      meta: ['تفاعلي', 'صالة / معرض', 'بروتوكول'],
      linkHref: `${p}casestudy-mwl.html`,
      linkLabel: 'اقرأ دراسة الحالة',
      img: `${p}assets/news/makkah-charter-02.jpeg`,
      imgAlt: 'تجربة تفاعلية — ميثاق مكة',
    },
    ladderAria: 'سلّم جاهزية التجارب التفاعلية',
    ladderEyebrow: 'اختر عمق التجربة',
    ladderTitle: 'ثلاث درجات — من كيوسك إلى منظومة صالة',
    ladderLead: 'لا حاجة لكل الطبقات دفعة واحدة. نضبط النطاق حسب صالتكم وجدول الإطلاق.',
    ladder: [
      {
        num: '01',
        title: 'كيوسك بيع',
        fit: 'عندما تحتاج استكشاف وحدات ومخططات على الشاشة.',
        outs: ['واجهة لمس للوحدات', 'فلاتر ومفضلة', 'ربط بيانات التوفر'],
        time: 'أسابيع حسب تعقيد البيانات',
        cta: 'ابدأ بالكيوسك',
        href: `${p}contact-us.html`,
        tier: 'kiosk',
      },
      {
        num: '02',
        title: 'صالة تفاعلية',
        fit: 'عندما يحتاج فريق المبيعات أدوات إقناع داخل الفراغ.',
        outs: ['شاشات عرض + مقارنة وحدات', 'تكامل مع المجسم', 'تدريب الفريق'],
        time: 'وفق موعد افتتاح الصالة',
        cta: 'احجز جلسة صالة',
        href: `${p}contact-us.html`,
        tier: 'gallery-interactive',
        featured: true,
      },
      {
        num: '03',
        title: 'منظومة تجربة كاملة',
        fit: 'إطلاق مؤسسي أو معرض بروتوكول: قصة واحدة من المدخل حتى الشاشة.',
        outs: ['كيوسك + VR/360 + لوحات', 'مسار ضيف وبروفة قبول', 'ربط مع ProjectLaunch™'],
        time: 'يُحدَّد بعد تقييم الجاهزية',
        cta: 'استكشف المنظومة',
        href: `${p}solutions/project-launch.html`,
        tier: 'full-interactive',
      },
    ],
    assess: {
      lang: 'ar',
      title: 'هل صالتكم تُقنع أم تعرض فقط؟',
      lead: 'خمس إجابات تكشف إن كانت الفجوة في الشاشة، البيانات، أو تجربة الضيف كاملة.',
      ctaHref: `${p}contact-us.html`,
      ctaLabel: 'احجز جلسة تجربة تفاعلية',
      questions: [
        { gap: 'content', text: 'هل يستطيع الزائر استكشاف الوحدات على الشاشة دون انتظار الاستشاري؟' },
        { gap: 'gallery', text: 'هل المجسم والشاشات يعملان كلغة واحدة داخل الصالة؟' },
        { gap: 'identity', text: 'هل بيانات التوفر والمخططات محدّثة ومترابطة؟' },
        { gap: 'system', text: 'هل لديكم VR/360 أو جولة عن بُعد للمشترين الدوليين؟' },
        { gap: 'system', text: 'هل دُرّب فريق المبيعات على تشغيل التجربة يوم الإطلاق؟' },
      ],
    },
  }),
  'services/interactive-experiences-en.html': (p) => ({
    lang: 'en',
    insertBefore:
      '<section class="cta-d" style="background:#1A1A1A">\n <div class="cta-d-inner">\n <h2 style="color:#FAFAF8">Upgrade Your <span class="gold">Sales Gallery</span></h2>',
    fallbackBefore: '<section style="background:#F5F4F0">\n <div style="max-width:1320px;margin:0 auto;padding:0 48px">\n <div class="reveal" style="text-align:center;margin-bottom:48px">\n <span class="section-label">Portfolio</span>',
    proof: {
      eyebrow: 'From our work',
      title: 'Makkah Charter: an interactive maquette that briefed initiatives in minutes',
      body: 'Screens, guest path, and one language — so the gallery or exhibition becomes a persuasion tool, not décor that merely turns on.',
      meta: ['Interactive', 'Gallery / exhibition', 'Protocol'],
      linkHref: `${p}casestudy-mwl-en.html`,
      linkLabel: 'Read the case study',
      img: `${p}assets/news/makkah-charter-02.jpeg`,
      imgAlt: 'Interactive experience — Makkah Charter',
    },
    ladderAria: 'Interactive experience readiness ladder',
    ladderEyebrow: 'Pick experience depth',
    ladderTitle: 'Three levels — from kiosk to full gallery system',
    ladderLead: 'You do not need every layer at once. We size scope to your gallery and launch date.',
    ladder: [
      {
        num: '01',
        title: 'Sales kiosk',
        fit: 'When buyers need unit and plan exploration on screen.',
        outs: ['Touch UI for units', 'Filters and favorites', 'Availability data link'],
        time: 'Weeks depending on data complexity',
        cta: 'Start with the kiosk',
        href: `${p}contact-us-en.html`,
        tier: 'kiosk',
      },
      {
        num: '02',
        title: 'Interactive gallery',
        fit: 'When the sales team needs persuasion tools inside the space.',
        outs: ['Display screens + unit compare', 'Maquette integration', 'Team training'],
        time: 'Aligned to gallery opening',
        cta: 'Book a gallery session',
        href: `${p}contact-us-en.html`,
        tier: 'gallery-interactive',
        featured: true,
      },
      {
        num: '03',
        title: 'Full experience system',
        fit: 'Institutional launch or protocol exhibition: one story from entry to screen.',
        outs: ['Kiosk + VR/360 + dashboards', 'Guest path and acceptance rehearsal', 'Link to ProjectLaunch™'],
        time: 'Set after readiness review',
        cta: 'Explore the system',
        href: `${p}solutions/project-launch-en.html`,
        tier: 'full-interactive',
      },
    ],
    assess: {
      lang: 'en',
      title: 'Does your gallery persuade — or only display?',
      lead: 'Five answers show whether the gap is the screen, the data, or the full guest experience.',
      ctaHref: `${p}contact-us-en.html`,
      ctaLabel: 'Book an interactive session',
      questions: [
        { gap: 'content', text: 'Can a visitor explore units on screen without waiting for a consultant?' },
        { gap: 'gallery', text: 'Do maquette and screens speak one language inside the gallery?' },
        { gap: 'identity', text: 'Are availability and plans live and connected?' },
        { gap: 'system', text: 'Do you offer VR/360 or remote tours for international buyers?' },
        { gap: 'system', text: 'Was the sales team trained to run the experience on launch day?' },
      ],
    },
  }),
};

function patchFile(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    console.warn('skip missing', rel);
    return false;
  }
  const prefix = prefixFor(rel);
  const factory = PAGES[rel];
  if (!factory) return false;
  const cfg = factory(prefix);
  let html = fs.readFileSync(file, 'utf8');
  html = stripBlock(html);
  html = ensureAssets(html, prefix);
  const block = salesRoomHtml(cfg);
  if (html.includes(cfg.insertBefore)) {
    html = html.replace(cfg.insertBefore, block + cfg.insertBefore);
  } else if (html.includes(cfg.fallbackBefore)) {
    html = html.replace(cfg.fallbackBefore, block + cfg.fallbackBefore);
  } else {
    console.warn('no insert point', rel);
    return false;
  }
  fs.writeFileSync(file, html);
  console.log('patched', rel);
  return true;
}

let n = 0;
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const targets = only.length ? only : Object.keys(PAGES);
for (const rel of targets) {
  if (!PAGES[rel]) {
    console.warn('unknown page', rel);
    continue;
  }
  if (patchFile(rel)) n += 1;
}
console.log(`sales-room patched ${n} pages`);
