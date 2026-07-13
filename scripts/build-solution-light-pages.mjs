#!/usr/bin/env node
/**
 * Premium light solution product pages — GrowthLaunch / ProjectLaunch / BrandScale
 * Split hero + three-stage narrative + curated real site media. AR + EN.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';
import { renderHeader, renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'solutions');
const BASE = 'https://3dgraphicshouse.com';
const DEPTH = 1;

const LOGOS = [
  'rafal.png',
  'anan-eskan.png',
  'al-owla.png',
  'toyota.png',
  'imc-150x150.png',
  'رابطة العالم الاسلامي.png',
].map((f) => `../assets/clients-logo/${f}`);

const A = {
  marketingVid: '../assets/videos/GH-Marketing-Media-Production.mp4',
  reVid: '../assets/videos/GH-Real-estate-services.mp4',
  archVid: '../assets/videos/3D-Architectural-visualisation.mp4',
  demoVid: '../assets/videos/GH-demo-reel-2025.mp4',
  interactive: '../assets/projects/interactive-01.jpg',
  interactiveW: '../assets/projects/interactive-01.webp',
  aloula: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg',
  aloulaW: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp',
  anan: '../assets/projects/rendering/Anan-Escan-Co.01.jpeg',
  ananW: '../assets/projects/rendering/Anan-Escan-Co.01.webp',
  anan2: '../assets/projects/rendering/anan-escan2.jpeg',
  anan2W: '../assets/projects/rendering/anan-escan2.webp',
  alrajhi: '../assets/projects/rendering/alrajhi3.jpeg',
  alrajhiW: '../assets/projects/rendering/alrajhi3.webp',
  alKhair: '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg',
  alKhairW: '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.webp',
  wahat: '../assets/projects/rendering/wahat-alsalam9-scaled.webp',
  uae: '../assets/projects/rendering/uae-e1745147961286.jpeg',
  uaeW: '../assets/projects/rendering/uae-e1745147961286.webp',
  financial: '../assets/projects/rendering/The-Financial-Center-of-King-Abdullah-City.jpeg',
  financialW: '../assets/projects/rendering/The-Financial-Center-of-King-Abdullah-City.webp',
  jeddah: '../assets/projects/rendering/jeddah-forum.jpg',
  jeddahW: '../assets/projects/rendering/jeddah-forum.webp',
  pavilion1: '../assets/projects/pavilion1.jpg',
  pavilion1W: '../assets/projects/pavilion1.webp',
  pavilion2: '../assets/projects/pavilion2.jpg',
  pavilion2W: '../assets/projects/pavilion2.webp',
  booth: '../assets/projects/animation/real-estate-services.jpg',
  boothW: '../assets/projects/animation/real-estate-services.webp',
  maqAnan: '../assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
  maqAlrajhi: '../assets/projects/maquettes/alrajhi-maquette-01.jpeg',
  maqMwl: '../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
  maqMwlW: '../assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
  mc01: '../assets/news/makkah-charter-01.jpeg',
  mc02: '../assets/news/makkah-charter-02.jpeg',
  mc03: '../assets/news/makkah-charter-03.jpeg',
  mc04: '../assets/news/makkah-charter-04.jpeg',
  mc05: '../assets/news/makkah-charter-05.jpeg',
  mc07: '../assets/news/makkah-charter-07.jpeg',
  mc08: '../assets/news/makkah-charter-08.jpeg',
  mc10: '../assets/news/makkah-charter-10.jpeg',
};

const PRODUCTS = {
  growth: {
    slug: 'growth-launch',
    cssKey: 'growth',
    og: 'projects/interactive-01.jpg',
    heroType: 'image',
    heroSrc: A.interactive,
    heroPoster: A.interactive,
    heroLabelEn: 'Demand-ready visualization',
    heroLabelAr: 'تصور جاهز لتحفيز الطلب',
    showcaseType: 'video',
    showcaseSrc: A.marketingVid,
    showcasePoster: A.interactive,
    en: {
      name: 'GrowthLaunch™',
      tag: 'Lead Generation & Sales System',
      title: 'GrowthLaunch™ | Lead Generation & Sales System | Graphics House',
      desc: 'A complete sales system — attract, convert, and scale qualified leads with tracking, CRM, and response automation.',
      headline: 'Stop buying campaigns.<br><em>Build a sales system.</em>',
      sub: 'From first click to closed deal — one integrated pipeline for developers and B2B teams across the GCC.',
      promiseTitle: 'In 7 days',
      promiseBody:
        'A measurable lead journey: capture, qualify, respond, and convert — with visibility at every step.',
      stagesNav: [
        { id: 'stage-1', num: '01', label: 'Attract' },
        { id: 'stage-2', num: '02', label: 'Convert' },
        { id: 'stage-3', num: '03', label: 'Scale' },
      ],
      stages: [
        {
          id: 'stage-1',
          num: 'Stage 01',
          title: 'Attract the right demand',
          lead: 'Campaigns, landing pages, and tracking that bring qualified interest — not noise.',
          points: [
            'Offer architecture & high-intent landing pages',
            'Pixel / GA4 / GTM tracking from day one',
            'Creative systems built for real estate & B2B',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.interactive, webp: A.interactiveW, className: 'tall' },
              { src: A.anan, webp: A.ananW },
              { src: A.jeddah, webp: A.jeddahW },
            ],
          },
        },
        {
          id: 'stage-2',
          num: 'Stage 02',
          title: 'Convert with speed',
          lead: 'Instant response, structured qualification, and a CRM path that never drops a lead.',
          points: [
            'WhatsApp & AI-assisted first response',
            'CRM pipeline with clear ownership',
            'Qualification scripts your team can run',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.pavilion1, webp: A.pavilion1W, className: 'tall' },
              { src: A.mc05 },
              { src: A.booth, webp: A.boothW },
            ],
          },
          flip: true,
        },
        {
          id: 'stage-3',
          num: 'Stage 03',
          title: 'Scale what works',
          lead: 'Dashboards, training, and iteration — so growth compounds after launch week.',
          points: [
            'Live performance dashboards',
            'Team enablement & playbooks',
            'Continuous optimization cycles',
          ],
          media: {
            type: 'video',
            src: A.marketingVid,
            poster: A.interactive,
            caption: 'Creative systems that earn attention',
          },
        },
      ],
      showcaseEyebrow: 'In market',
      showcaseTitle: 'Where demand meets a sales-ready experience',
      showcaseLead:
        'GrowthLaunch connects campaigns to the environments buyers actually walk into — galleries, booths, and digital journeys.',
      proofEyebrow: 'Trusted by leading teams',
      proofLead: 'Client brands that rely on Graphics House for launch and growth systems.',
      gallery: [
        { src: A.interactive, webp: A.interactiveW },
        { src: A.anan, webp: A.ananW },
        { src: A.pavilion2, webp: A.pavilion2W },
        { src: A.jeddah, webp: A.jeddahW },
        { src: A.alrajhi, webp: A.alrajhiW },
      ],
      bafTitle: 'Your situation — transformed',
      bafLead: 'Not just tools — a shift in how you capture and convert leads.',
      baf: [
        ['Ads without follow-up', 'Complete journey from click to call'],
        ['Slow manual responses', 'Instant WhatsApp & AI response'],
        ['Leads lost between staff', 'Organized CRM pipeline'],
        ['No conversion visibility', 'Full analytics & tracking'],
      ],
      ctaTitle: 'Ready to build a predictable pipeline?',
      ctaLead:
        'Book a strategy session — we map your offer, channels, and conversion path in one workshop.',
      ctaPrimary: 'Book strategy session',
      ctaSecondary: 'View our work',
      crossTitle: 'Continue the system',
      cross: [
        {
          href: 'project-launch-en.html',
          name: 'ProjectLaunch™',
          desc: 'Launch the development with CGI, maquettes, and sales-ready assets.',
        },
        {
          href: 'brand-scale-en.html',
          name: 'BrandScale™',
          desc: 'Strengthen identity so every campaign compounds trust.',
        },
      ],
    },
    ar: {
      name: 'GrowthLaunch™',
      tag: 'نظام توليد العملاء والمبيعات',
      title: 'GrowthLaunch™ | نظام توليد العملاء والمبيعات | Graphics House',
      desc: 'نظام مبيعات متكامل — جذب، تحويل، وتوسيع العملاء المؤهلين مع التتبع وCRM وأتمتة الرد.',
      headline: 'توقف عن شراء الحملات.<br><em>وابنِ نظام مبيعات.</em>',
      sub: 'من أول نقرة إلى إغلاق الصفقة — مسار متكامل للمطورين وفرق B2B في الخليج.',
      promiseTitle: 'خلال 7 أيام',
      promiseBody:
        'رحلة عميل قابلة للقياس: جذب، تأهيل، رد، وتحويل — مع رؤية واضحة في كل خطوة.',
      stagesNav: [
        { id: 'stage-1', num: '01', label: 'الجذب' },
        { id: 'stage-2', num: '02', label: 'التحويل' },
        { id: 'stage-3', num: '03', label: 'التوسع' },
      ],
      stages: [
        {
          id: 'stage-1',
          num: 'المرحلة 01',
          title: 'اجذب الطلب الصحيح',
          lead: 'حملات وصفحات هبوط وتتبع يجلب اهتماماً مؤهلاً — لا ضوضاء.',
          points: [
            'هيكلة العرض وصفحات هبوط عالية النية',
            'تتبع Pixel / GA4 / GTM من اليوم الأول',
            'منظومة إبداعية للعقار وB2B',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.interactive, webp: A.interactiveW, className: 'tall' },
              { src: A.anan, webp: A.ananW },
              { src: A.jeddah, webp: A.jeddahW },
            ],
          },
        },
        {
          id: 'stage-2',
          num: 'المرحلة 02',
          title: 'حوّل بسرعة',
          lead: 'رد فوري، تأهيل منظم، ومسار CRM لا يُسقط أي عميل.',
          points: [
            'رد أولي عبر واتساب والذكاء الاصطناعي',
            'مسار CRM بملكية واضحة',
            'سكربتات تأهيل يطبقها فريقك',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.pavilion1, webp: A.pavilion1W, className: 'tall' },
              { src: A.mc05 },
              { src: A.booth, webp: A.boothW },
            ],
          },
          flip: true,
        },
        {
          id: 'stage-3',
          num: 'المرحلة 03',
          title: 'وسّع ما ينجح',
          lead: 'لوحات قياس، تدريب، وتحسين مستمر — لينمو الأداء بعد أسبوع الإطلاق.',
          points: [
            'لوحات أداء مباشرة',
            'تمكين الفريق وخطط عمل',
            'دورات تحسين مستمرة',
          ],
          media: {
            type: 'video',
            src: A.marketingVid,
            poster: A.interactive,
            caption: 'منظومات إبداعية تكتسب الانتباه',
          },
        },
      ],
      showcaseEyebrow: 'في السوق',
      showcaseTitle: 'حيث يلتقي الطلب بتجربة جاهزة للبيع',
      showcaseLead:
        'GrowthLaunch يربط الحملات بالبيئات التي يدخلها المشتري فعلياً — صالات، أجنحة، ومسارات رقمية.',
      proofEyebrow: 'يثق بنا قادة السوق',
      proofLead: 'علامات تعتمد على جرافيكس هاوس في أنظمة الإطلاق والنمو.',
      gallery: [
        { src: A.interactive, webp: A.interactiveW },
        { src: A.anan, webp: A.ananW },
        { src: A.pavilion2, webp: A.pavilion2W },
        { src: A.jeddah, webp: A.jeddahW },
        { src: A.alrajhi, webp: A.alrajhiW },
      ],
      bafTitle: 'وضعك الحالي — بعد التحول',
      bafLead: 'ليس أدوات فقط — بل تحول في طريقة استقبال العملاء وتحويلهم.',
      baf: [
        ['إعلانات بلا متابعة', 'رحلة كاملة من النقرة إلى الاتصال'],
        ['ردود يدوية بطيئة', 'رد فوري عبر واتساب والذكاء الاصطناعي'],
        ['عملاء يضيعون بين الموظفين', 'مسار منظم عبر CRM'],
        ['لا رؤية للتحويل', 'تحليلات وتتبع كامل'],
      ],
      ctaTitle: 'جاهز لبناء مسار مبيعات متوقع؟',
      ctaLead: 'احجز جلسة استراتيجية — نرسم العرض والقنوات ومسار التحويل في ورشة واحدة.',
      ctaPrimary: 'احجز جلسة استراتيجية',
      ctaSecondary: 'استعرض أعمالنا',
      crossTitle: 'أكمل المنظومة',
      cross: [
        {
          href: 'project-launch.html',
          name: 'ProjectLaunch™',
          desc: 'أطلق المشروع بـ CGI والمجسمات وأصول جاهزة للمبيعات.',
        },
        {
          href: 'brand-scale.html',
          name: 'BrandScale™',
          desc: 'قوّي الهوية حتى تتراكم الثقة مع كل حملة.',
        },
      ],
    },
  },

  project: {
    slug: 'project-launch',
    cssKey: 'project',
    og: 'projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg',
    heroType: 'image',
    heroSrc: A.aloula,
    heroPoster: A.aloula,
    heroLabelEn: 'Photoreal architectural CGI',
    heroLabelAr: 'تصور معماري فوتورياليستي',
    showcaseType: 'video',
    showcaseSrc: A.archVid,
    showcasePoster: A.aloula,
    en: {
      name: 'ProjectLaunch™',
      tag: 'Real Estate Project Launch System',
      title: 'ProjectLaunch™ | Real Estate Project Launch | Graphics House',
      desc: 'Launch with confidence — cinematic CGI, smart maquettes, interactive experiences, and sales-ready collateral in one system.',
      headline: 'Launch the development<br><em>before it is built.</em>',
      sub: 'One studio for visualization, physical models, interactive sales tools, and launch collateral — aligned from day one.',
      promiseTitle: 'One partner',
      promiseBody:
        'CGI film, maquettes, interactive screens, and booth systems — delivered as one coherent launch.',
      stagesNav: [
        { id: 'stage-1', num: '01', label: 'Visualize' },
        { id: 'stage-2', num: '02', label: 'Materialize' },
        { id: 'stage-3', num: '03', label: 'Launch' },
      ],
      stages: [
        {
          id: 'stage-1',
          num: 'Stage 01',
          title: 'Visualize the future',
          lead: 'Photoreal CGI and cinematic film that make investors feel the project before groundbreaking.',
          points: [
            'Architectural visualization & aerial sequences',
            'Cinematic CGI for launches and investor days',
            'Asset library ready for ads and sales centers',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.aloula, webp: A.aloulaW, className: 'tall' },
              { src: A.anan, webp: A.ananW },
              { src: A.financial, webp: A.financialW },
            ],
          },
        },
        {
          id: 'stage-2',
          num: 'Stage 02',
          title: 'Materialize the experience',
          lead: 'Precision maquettes and interactive environments that turn the showroom into a closing room.',
          points: [
            'Handcrafted architectural scale models',
            'Interactive lighting & digital layers',
            'Touch experiences for unit selection',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.maqAnan, className: 'tall' },
              { src: A.maqAlrajhi },
              { src: A.alKhair, webp: A.alKhairW },
            ],
          },
          flip: true,
        },
        {
          id: 'stage-3',
          num: 'Stage 03',
          title: 'Launch to market',
          lead: 'Booths, galleries, and sales collateral that carry the same visual system to the floor.',
          points: [
            'Exhibition & sales-center environments',
            'Print & digital launch kits',
            'On-site installation support',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.booth, webp: A.boothW, className: 'tall' },
              { src: A.pavilion1, webp: A.pavilion1W },
              { src: A.maqMwl, webp: A.maqMwlW },
            ],
          },
        },
      ],
      showcaseEyebrow: 'Launch film',
      showcaseTitle: 'Cinematic proof before concrete',
      showcaseLead:
        'ProjectLaunch packages visualization, models, and market presence so the story buyers see is one system — not three vendors.',
      proofEyebrow: 'Selected launch work',
      proofLead: 'From masterplans to sales galleries — assets that accelerate buyer confidence.',
      gallery: [
        { src: A.aloula, webp: A.aloulaW },
        { src: A.maqAnan },
        { src: A.uae, webp: A.uaeW },
        { src: A.wahat },
        { src: A.anan2, webp: A.anan2W },
      ],
      bafTitle: 'Your situation — transformed',
      bafLead: 'From fragmented vendors to one launch system that sells.',
      baf: [
        ['Multiple vendors to manage', 'One launch partner — end to end'],
        ['Concept without marketing assets', 'Sales-ready launch package'],
        ['Weak visual presentation', 'Cinematic CGI & scale models'],
        ['No structured launch plan', 'Clear three-stage launch system'],
      ],
      ctaTitle: 'Ready to launch with confidence?',
      ctaLead:
        'We scope visualization, maquettes, interactive, and collateral as one coherent system.',
      ctaPrimary: 'Book strategy session',
      ctaSecondary: 'View portfolio',
      crossTitle: 'Complete the stack',
      cross: [
        {
          href: 'growth-launch-en.html',
          name: 'GrowthLaunch™',
          desc: 'Turn launch attention into a measurable sales pipeline.',
        },
        {
          href: 'brand-scale-en.html',
          name: 'BrandScale™',
          desc: 'Anchor the project in a brand buyers trust.',
        },
      ],
    },
    ar: {
      name: 'ProjectLaunch™',
      tag: 'نظام إطلاق المشاريع العقارية',
      title: 'ProjectLaunch™ | نظام إطلاق المشاريع العقارية | Graphics House',
      desc: 'أطلق بثقة — CGI سينمائي، مجسمات ذكية، تجارب تفاعلية، ومواد بيعية في منظومة واحدةحدة.',
      headline: 'أطلق المشروع<br><em>قبل أن يُبنى.</em>',
      sub: 'استوديو واحد للتصور والمجسمات والأدوات التفاعلية ومواد الإطلاق — متناسقة من اليوم الأول.',
      promiseTitle: 'شريك واحد',
      promiseBody: 'فيلم CGI، مجسمات، شاشات تفاعلية، وأنظمة جناح — كإطلاق متماسك واحد.',
      stagesNav: [
        { id: 'stage-1', num: '01', label: 'التصور' },
        { id: 'stage-2', num: '02', label: 'التجسيد' },
        { id: 'stage-3', num: '03', label: 'الإطلاق' },
      ],
      stages: [
        {
          id: 'stage-1',
          num: 'المرحلة 01',
          title: 'تصوّر المستقبل',
          lead: 'CGI فوتورياليستي وأفلام سينمائية تجعل المستثمر يعيش المشروع قبل وضع الحجر.',
          points: [
            'تصور معماري ومشاهد جوية',
            'أفلام CGI للإطلاق وأيام المستثمرين',
            'مكتبة أصول جاهزة للإعلان ومراكز البيع',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.aloula, webp: A.aloulaW, className: 'tall' },
              { src: A.anan, webp: A.ananW },
              { src: A.financial, webp: A.financialW },
            ],
          },
        },
        {
          id: 'stage-2',
          num: 'المرحلة 02',
          title: 'جسّد التجربة',
          lead: 'مجسمات دقيقة وبيئات تفاعلية تحول صالة العرض إلى غرفة إغلاق.',
          points: [
            'مجسمات معمارية حرفية',
            'إضاءة تفاعلية وطبقات رقمية',
            'تجارب لمس لاختيار الوحدات',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.maqAnan, className: 'tall' },
              { src: A.maqAlrajhi },
              { src: A.alKhair, webp: A.alKhairW },
            ],
          },
          flip: true,
        },
        {
          id: 'stage-3',
          num: 'المرحلة 03',
          title: 'أطلق إلى السوق',
          lead: 'أجنحة ومعارض ومواد بيعية تحمل نفس النظام البصري إلى أرض الواقع.',
          points: [
            'بيئات معارض ومراكز بيع',
            'حزم إطلاق مطبوعة ورقمية',
            'دعم التركيب في الموقع',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.booth, webp: A.boothW, className: 'tall' },
              { src: A.pavilion1, webp: A.pavilion1W },
              { src: A.maqMwl, webp: A.maqMwlW },
            ],
          },
        },
      ],
      showcaseEyebrow: 'فيلم الإطلاق',
      showcaseTitle: 'إثبات سينمائي قبل الخرسانة',
      showcaseLead:
        'ProjectLaunch يجمع التصور والمجسمات والحضور السوقي في قصة واحدة — لا ثلاثة مورّدين.',
      proofEyebrow: 'أعمال إطلاق مختارة',
      proofLead: 'من المخططات إلى صالات البيع — أصول تسرّع ثقة المشتري.',
      gallery: [
        { src: A.aloula, webp: A.aloulaW },
        { src: A.maqAnan },
        { src: A.uae, webp: A.uaeW },
        { src: A.wahat },
        { src: A.anan2, webp: A.anan2W },
      ],
      bafTitle: 'وضعك الحالي — بعد التحول',
      bafLead: 'من مورّدين متفرقين إلى منظومة إطلاق واحدة تبيع.',
      baf: [
        ['التعامل مع عدة مورّدين', 'شريك إطلاق واحد من البداية للنهاية'],
        ['فكرة بلا مواد تسويقية', 'حزمة إطلاق جاهزة للمبيعات'],
        ['عرض بصري ضعيف', 'CGI سينمائي ومجسمات'],
        ['لا خطة إطلاق واضحة', 'نظام إطلاق من ثلاث مراحل'],
      ],
      ctaTitle: 'جاهز للإطلاق بثقة؟',
      ctaLead: 'نحدد نطاق التصور والمجسمات والتفاعلي والمواد كمنظومة واحدةحدة.',
      ctaPrimary: 'احجز جلسة استراتيجية',
      ctaSecondary: 'استعرض الأعمال',
      crossTitle: 'أكمل المنظومة',
      cross: [
        {
          href: 'growth-launch.html',
          name: 'GrowthLaunch™',
          desc: 'حوّل انتباه الإطلاق إلى مسار مبيعات قابل للقياس.',
        },
        {
          href: 'brand-scale.html',
          name: 'BrandScale™',
          desc: 'اربط المشروع بهوية يثق بها المشتري.',
        },
      ],
    },
  },

  brand: {
    slug: 'brand-scale',
    cssKey: 'brand',
    og: 'news/makkah-charter-01.jpeg',
    heroType: 'image',
    heroSrc: A.mc01,
    heroPoster: A.mc01,
    heroLabelEn: 'Institutional brand environments',
    heroLabelAr: 'بيئات علامة مؤسسية',
    showcaseType: 'image',
    showcaseSrc: A.mc05,
    showcasePoster: A.mc05,
    en: {
      name: 'BrandScale™',
      tag: 'Brand Growth System',
      title: 'BrandScale™ | Brand Growth System | Graphics House',
      desc: 'Build a brand that inspires trust — strategy, identity, and presence designed for developers and institutions.',
      headline: 'A brand that<br><em>commands trust.</em>',
      sub: 'From positioning to identity systems and market presence — built to scale across projects and channels.',
      promiseTitle: 'Identity → Presence',
      promiseBody:
        'Strategy, visual system, guidelines, and digital presence — coherent enough to sell the next project.',
      stagesNav: [
        { id: 'stage-1', num: '01', label: 'Strategy' },
        { id: 'stage-2', num: '02', label: 'Identity' },
        { id: 'stage-3', num: '03', label: 'Presence' },
      ],
      stages: [
        {
          id: 'stage-1',
          num: 'Stage 01',
          title: 'Strategy that positions',
          lead: 'Clarify audience, promise, and voice — so every asset speaks with one authority.',
          points: [
            'Brand positioning & messaging architecture',
            'Competitive framing for GCC markets',
            'Narrative for investors and buyers',
          ],
          media: {
            type: 'image',
            src: A.mc04,
            caption: 'Muslim World League — strategic environments',
          },
        },
        {
          id: 'stage-2',
          num: 'Stage 02',
          title: 'Identity that endures',
          lead: 'A visual system worthy of landmark developments — guidelines teams can actually use.',
          points: [
            'Logo system & brand marks',
            'Typography, color, and application rules',
            'Presentation & profile templates',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.mc02, className: 'tall' },
              { src: A.mc07 },
              { src: A.mc10 },
            ],
          },
          flip: true,
        },
        {
          id: 'stage-3',
          num: 'Stage 03',
          title: 'Presence that converts',
          lead: 'Website, social kits, and collateral that carry the brand into campaigns and launches.',
          points: [
            'Web & digital brand presence',
            'Social and content system starters',
            'Collateral aligned with ProjectLaunch & GrowthLaunch',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.mc08, className: 'tall' },
              { src: A.mc03 },
              { src: A.pavilion1, webp: A.pavilion1W },
            ],
          },
        },
      ],
      showcaseEyebrow: 'Case in point',
      showcaseTitle: 'Identity you can walk through',
      showcaseLead:
        'BrandScale turns positioning into spaces, screens, and systems — so trust is felt before a word is spoken.',
      proofEyebrow: 'Brand environments we shape',
      proofLead: 'Identity work delivered alongside visualization and interactive — one studio language.',
      gallery: [
        { src: A.mc01 },
        { src: A.mc03 },
        { src: A.mc04 },
        { src: A.mc08 },
        { src: A.mc05 },
      ],
      bafTitle: 'Your situation — transformed',
      bafLead: 'From looking small to commanding market trust.',
      baf: [
        ['Inconsistent identity', 'Unified professional brand system'],
        ['Outdated website', 'Modern conversion-focused presence'],
        ['Weak presentations', 'Investor-grade decks'],
        ['Scattered materials', 'Integrated marketing system'],
      ],
      ctaTitle: 'Ready to scale your brand?',
      ctaLead: 'We design identity systems that hold across projects, launches, and campaigns.',
      ctaPrimary: 'Book strategy session',
      ctaSecondary: 'View case study',
      crossTitle: 'Pair brand with launch',
      cross: [
        {
          href: 'project-launch-en.html',
          name: 'ProjectLaunch™',
          desc: 'Express the brand through CGI, maquettes, and sales spaces.',
        },
        {
          href: 'growth-launch-en.html',
          name: 'GrowthLaunch™',
          desc: 'Turn brand equity into a measurable demand engine.',
        },
      ],
    },
    ar: {
      name: 'BrandScale™',
      tag: 'نظام نمو العلامات التجارية',
      title: 'BrandScale™ | نظام نمو العلامات التجارية | Graphics House',
      desc: 'ابنِ علامة تلهم الثقة — استراتيجية، هوية، وحضور مصمم للمطورين والمؤسسات.',
      headline: 'علامة<br><em>تفرض الثقة.</em>',
      sub: 'من التموضع إلى أنظمة الهوية والحضور السوقي — مصممة لتتوسع عبر المشاريع والقنوات.',
      promiseTitle: 'هوية ← حضور',
      promiseBody:
        'استراتيجية، نظام بصري، أدلة إرشادية، وحضور رقمي — متماسك بما يكفي لبيع المشروع التالي.',
      stagesNav: [
        { id: 'stage-1', num: '01', label: 'الاستراتيجية' },
        { id: 'stage-2', num: '02', label: 'الهوية' },
        { id: 'stage-3', num: '03', label: 'الحضور' },
      ],
      stages: [
        {
          id: 'stage-1',
          num: 'المرحلة 01',
          title: 'استراتيجية تموضع',
          lead: 'وضوح الجمهور والوعد والصوت — حتى يتحدث كل أصل بسلطة واحدة.',
          points: [
            'تموضع العلامة وهندسة الرسائل',
            'إطار تنافسي لأسواق الخليج',
            'سرد للمستثمرين والمشترين',
          ],
          media: {
            type: 'image',
            src: A.mc04,
            caption: 'رابطة العالم الإسلامي — بيئات استراتيجية',
          },
        },
        {
          id: 'stage-2',
          num: 'المرحلة 02',
          title: 'هوية تدوم',
          lead: 'نظام بصري يليق بالمشاريع الكبرى — أدلة يستطيع الفريق استخدامها فعلياً.',
          points: [
            'نظام الشعار والعلامات',
            'قواعد الخط واللون والتطبيق',
            'قوالب عروض وملفات تعريف',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.mc02, className: 'tall' },
              { src: A.mc07 },
              { src: A.mc10 },
            ],
          },
          flip: true,
        },
        {
          id: 'stage-3',
          num: 'المرحلة 03',
          title: 'حضور يحوّل',
          lead: 'موقع وحزم محتوى ومواد تحمل العلامة إلى الحملات والإطلاقات.',
          points: [
            'حضور ويب ورقمي',
            'بدايات نظام محتوى وسوشيال',
            'مواد متوافقة مع ProjectLaunch وGrowthLaunch',
          ],
          media: {
            type: 'grid',
            images: [
              { src: A.mc08, className: 'tall' },
              { src: A.mc03 },
              { src: A.pavilion1, webp: A.pavilion1W },
            ],
          },
        },
      ],
      showcaseEyebrow: 'نموذج حي',
      showcaseTitle: 'هوية تمشي فيها',
      showcaseLead:
        'BrandScale يحوّل التموضع إلى فضاءات وشاشات وأنظمة — فتُشعر بالثقة قبل أن تُقال كلمة.',
      proofEyebrow: 'بيئات علامة نُشكّلها',
      proofLead: 'هوية تُسلَّم مع التصور والتفاعلي — لغة استوديو واحدة.',
      gallery: [
        { src: A.mc01 },
        { src: A.mc03 },
        { src: A.mc04 },
        { src: A.mc08 },
        { src: A.mc05 },
      ],
      bafTitle: 'وضعك الحالي — بعد التحول',
      bafLead: 'من حضور ضعيف إلى ثقة سوقية قوية.',
      baf: [
        ['هوية غير متسقة', 'نظام علامة احترافي موحّد'],
        ['موقع قديم', 'حضور حديث يركز على التحويل'],
        ['عروض ضعيفة', 'عروض بمستوى المستثمرين'],
        ['مواد متفرقة', 'نظام تسويقي متكامل'],
      ],
      ctaTitle: 'جاهز لتوسيع علامتك؟',
      ctaLead: 'نصمم أنظمة هوية تصمد عبر المشاريع والإطلاقات والحملات.',
      ctaPrimary: 'احجز جلسة استراتيجية',
      ctaSecondary: 'استعرض دراسة الحالة',
      crossTitle: 'اربط العلامة بالإطلاق',
      cross: [
        {
          href: 'project-launch.html',
          name: 'ProjectLaunch™',
          desc: 'عبّر عن العلامة عبر CGI والمجسمات وفضاءات البيع.',
        },
        {
          href: 'growth-launch.html',
          name: 'GrowthLaunch™',
          desc: 'حوّل رصيد العلامة إلى محرك طلب قابل للقياس.',
        },
      ],
    },
  },
};

function pic(src, webp, alt, className, eager = false) {
  const cls = className ? ` class="${className}"` : '';
  const load = eager ? ' fetchpriority="high"' : ' loading="lazy"';
  if (webp) {
    return `<picture><source srcset="${webp}" type="image/webp"><img${cls} src="${src}" alt="${alt}"${load}></picture>`;
  }
  return `<img${cls} src="${src}" alt="${alt}"${load}>`;
}

function renderMedia(media, alt) {
  if (!media) return '';
  if (media.type === 'video') {
    return `<div class="sol-media">
      <video autoplay muted loop playsinline poster="${media.poster || ''}">
        <source src="${media.src}" type="video/mp4">
      </video>
      ${media.caption ? `<div class="sol-media-caption">${media.caption}</div>` : ''}
    </div>`;
  }
  if (media.type === 'grid') {
    const imgs = media.images
      .map((img) => pic(img.src, img.webp, alt, img.className || ''))
      .join('\n');
    return `<div class="sol-media-grid">${imgs}</div>`;
  }
  return `<div class="sol-media">
    ${pic(media.src, media.webp, alt)}
    ${media.caption ? `<div class="sol-media-caption">${media.caption}</div>` : ''}
  </div>`;
}

function renderHeroVisual(product, isEn) {
  const label = isEn ? product.heroLabelEn : product.heroLabelAr;
  if (product.heroType === 'image') {
    let webpPath = null;
    if (product.heroSrc.includes('interactive-01')) webpPath = A.interactiveW;
    else if (product.heroSrc.includes('Aloula')) webpPath = A.aloulaW;
    return `<div class="sol-hero-visual">
      ${pic(product.heroSrc, webpPath, product.en.name, '', true)}
      <div class="sol-hero-media-label">${label}</div>
    </div>`;
  }
  return `<div class="sol-hero-visual">
    <video autoplay muted loop playsinline poster="${product.heroPoster}">
      <source src="${product.heroSrc}" type="video/mp4">
    </video>
    <div class="sol-hero-media-label">${label}</div>
  </div>`;
}

function renderShowcase(product, t) {
  const media =
    product.showcaseType === 'video'
      ? `<video autoplay muted loop playsinline poster="${product.showcasePoster}">
        <source src="${product.showcaseSrc}" type="video/mp4">
      </video>`
      : `<img src="${product.showcaseSrc}" alt="" loading="lazy">`;
  return `<section class="sol-showcase">
  <div class="sol-showcase-media">${media}</div>
  <div class="sol-showcase-scrim"></div>
  <div class="sol-wrap">
    <div class="sol-showcase-copy">
      <div class="sol-eyebrow">${t.showcaseEyebrow}</div>
      <h2>${t.showcaseTitle}</h2>
      <p>${t.showcaseLead}</p>
    </div>
  </div>
</section>`;
}

function buildPage(productKey, lang) {
  const product = PRODUCTS[productKey];
  const isEn = lang === 'en';
  const t = isEn ? product.en : product.ar;
  const file = isEn ? `${product.slug}-en.html` : `${product.slug}.html`;
  const contact = isEn ? '../contact-us-en.html' : '../contact-us.html';
  const portfolio = isEn ? '../portfolio-en.html' : '../portfolio.html';
  const caseStudy = isEn ? '../case-study-mwl-en.html' : '../casestudy1.html';
  const secondaryHref = productKey === 'brand' ? caseStudy : portfolio;
  const canonical = `${BASE}/solutions/${file}`;
  const arUrl = `${BASE}/solutions/${product.slug}.html`;
  const enUrl = `${BASE}/solutions/${product.slug}-en.html`;
  const header = renderHeader(DEPTH, isEn);
  const footer = renderFooter(DEPTH, isEn);

  const stagesNav = t.stagesNav
    .map(
      (s) =>
        `<a class="sol-stage-tab" href="#${s.id}"><span class="num">${s.num}</span><span class="label">${s.label}</span></a>`
    )
    .join('\n');

  const stagesHtml = t.stages
    .map((stage) => {
      const flip = stage.flip ? ' is-flip' : '';
      return `<section class="sol-stage" id="${stage.id}">
  <div class="sol-wrap">
    <div class="sol-stage-grid${flip}">
      <div>
        <div class="sol-stage-num">${stage.num}</div>
        <h2 class="sol-title">${stage.title}</h2>
        <p class="sol-lead">${stage.lead}</p>
        <ul class="sol-points">
          ${stage.points
            .map(
              (p) =>
                `<li><span class="material-symbols-outlined">check_circle</span><span>${p}</span></li>`
            )
            .join('\n')}
        </ul>
      </div>
      ${renderMedia(stage.media, t.name)}
    </div>
  </div>
</section>`;
    })
    .join('\n');

  const logos = LOGOS.map((src) => `<img src="${src}" alt="" loading="lazy">`).join('\n');

  const gallery = (t.gallery || [])
    .map(
      (item) =>
        `<figure>${pic(item.src, item.webp, t.name)}</figure>`
    )
    .join('\n');

  const bafRows = t.baf
    .map(
      ([b, a]) => `<div class="sol-baf-row">
      <div class="sol-baf-before">${b}</div>
      <div class="sol-baf-mid"><span class="material-symbols-outlined">arrow_forward</span></div>
      <div class="sol-baf-after">${a}</div>
    </div>`
    )
    .join('\n');

  const cross = t.cross
    .map(
      (c) => `<a class="sol-cross-card" href="${c.href}">
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <span>${isEn ? 'Explore' : 'استكشف'} <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span></span>
    </a>`
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="../assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags('../')}
<!-- GH SEO -->
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t.title}</title>
<meta name="description" content="${t.desc}"/>
<meta property="og:title" content="${t.name} | Graphics House">
<meta property="og:description" content="${t.desc}">
<meta property="og:image" content="${BASE}/assets/${product.og}">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="../assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&family=Tajawal:wght@400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" />
<link rel="stylesheet" href="../assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="../assets/gh-site-enhancements.css?v=21">
<link rel="stylesheet" href="../assets/site-header.css?v=27">
<link rel="stylesheet" href="../assets/gh-solution-light.css?v=2">
<script defer src="../assets/site-header.js?v=14"></script>
<script defer src="../assets/gh-performance.js?v=2"></script>
<script defer src="../assets/lang-switch.js?v=2"></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t.name,
    description: t.desc,
    url: canonical,
    brand: { '@type': 'Brand', name: 'Graphics House' },
    provider: {
      '@type': 'Organization',
      name: 'Graphics House',
      url: BASE,
    },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body class="sol-page sol-${product.cssKey}">
${header}
<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>

<section class="sol-hero">
  <div class="sol-hero-copy">
    <div class="sol-eyebrow">${isEn ? 'Graphics House · Solutions' : 'جرافيكس هاوس · الحلول'}</div>
    <h1>${t.name.replace('™', '<span class="tm">™</span>')}</h1>
    <p class="sol-hero-tag">${t.tag}</p>
    <h2 class="sol-hero-headline">${t.headline}</h2>
    <p class="sol-hero-sub">${t.sub}</p>
    <div class="sol-actions">
      <a class="sol-btn sol-btn-gold" href="${contact}">${t.ctaPrimary}</a>
      <a class="sol-btn sol-btn-outline" href="${secondaryHref}">${t.ctaSecondary}</a>
    </div>
  </div>
  ${renderHeroVisual(product, isEn)}
</section>

<section class="sol-promise">
  <div class="sol-wrap sol-promise-inner">
    <div class="sol-promise-kicker">${t.promiseTitle}</div>
    <p>${t.promiseBody}</p>
  </div>
</section>

<nav class="sol-stages-nav" aria-label="${isEn ? 'Three stages' : 'ثلاث مراحل'}">
  <div class="sol-wrap sol-stages-nav-inner">
    ${stagesNav}
  </div>
</nav>

${stagesHtml}

${renderShowcase(product, t)}

<section class="sol-proof">
  <div class="sol-wrap">
    <div class="sol-proof-head">
      <div>
        <div class="sol-eyebrow">${t.proofEyebrow}</div>
        <h2 class="sol-title" style="margin:0">${isEn ? 'Proof in the portfolio' : 'الدليل في الأعمال'}</h2>
      </div>
      <p class="sol-lead">${t.proofLead}</p>
    </div>
    <div class="sol-logos">${logos}</div>
    ${gallery ? `<div class="sol-gallery">${gallery}</div>` : ''}
  </div>
</section>

<section class="sol-baf-light">
  <div class="sol-wrap">
    <div class="sol-baf-head">
      <div class="sol-eyebrow">${isEn ? 'Before & After' : 'قبل وبعد'}</div>
      <h2 class="sol-title">${t.bafTitle}</h2>
      <p class="sol-lead">${t.bafLead}</p>
    </div>
    <div class="sol-baf-table">
      <div class="sol-baf-cols">
        <div class="sol-baf-col-head before">${isEn ? `Before ${t.name}` : `قبل ${t.name}`}</div>
        <div></div>
        <div class="sol-baf-col-head after">${isEn ? `After ${t.name}` : `بعد ${t.name}`}</div>
      </div>
      ${bafRows}
    </div>
  </div>
</section>

<section class="sol-cross">
  <div class="sol-wrap">
    <div class="sol-eyebrow">${t.crossTitle}</div>
    <div class="sol-cross-grid">${cross}</div>
  </div>
</section>

<section class="sol-cta">
  <div class="sol-wrap">
    <h2>${t.ctaTitle}</h2>
    <p>${t.ctaLead}</p>
    <div class="sol-actions">
      <a class="sol-btn sol-btn-gold" href="${contact}">${t.ctaPrimary}</a>
      <a class="sol-btn sol-btn-ghost" href="${secondaryHref}">${t.ctaSecondary}</a>
    </div>
  </div>
</section>

${footer}
</body>
</html>
`;

  fs.writeFileSync(path.join(OUT, file), html, 'utf8');
  console.log('  wrote', file);
}

console.log('Building premium light solution pages…');
for (const key of Object.keys(PRODUCTS)) {
  buildPage(key, 'en');
  buildPage(key, 'ar');
}
console.log('Done.');
