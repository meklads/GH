#!/usr/bin/env node
/**
 * Solution flagship pages — GrowthLaunch / ProjectLaunch / BrandScale
 * Same simple Interactive-style layout. Shared hero hierarchy:
 * English name™ → Arabic product title → headline → services line
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

const PAGE_CSS = `
  .ms-filled { font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:#FAFAF8; }
  ::-webkit-scrollbar-thumb { background:#C9A84C; }
  .reveal { transition:opacity .75s cubic-bezier(.4,0,.2,1),transform .75s cubic-bezier(.4,0,.2,1); }
  .reveal.visible { opacity:1 !important; transform:none !important; }
  .hero-enter { opacity:0; transform:translateY(18px); transition:opacity .8s cubic-bezier(.4,0,.2,1),transform .8s cubic-bezier(.4,0,.2,1); }
  .hero-enter.in { opacity:1; transform:none; }
  #back-top { transition:opacity .3s ease,transform .3s ease; opacity:0; pointer-events:none; transform:translateY(8px); }
  #back-top.visible { opacity:1; pointer-events:auto; transform:translateY(0); }
  #loader { position:fixed; inset:0; z-index:99999; background:#FAFAF8; display:flex; align-items:center; justify-content:center; flex-direction:column; transition:opacity .6s ease,visibility .6s ease; }
  #loader.out { opacity:0; visibility:hidden; }
  #loader-bar-track { width:180px; height:1px; background:rgba(201,168,76,.18); margin-top:20px; overflow:hidden; }
  #loader-bar { height:100%; width:0; background:#C9A84C; transition:width 1s cubic-bezier(.4,0,.2,1); }
  .pl-hero .svc-hero-scrim { display: none !important; }
  .pl-hero .pl-hero-copy {
    position: relative; z-index: 2; max-width: 52rem; margin-inline: auto;
    padding: 28px 24px 32px; border-radius: 2px;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .pl-hero h1 {
    color: #fff !important; text-shadow: 0 2px 20px rgba(0,0,0,.35);
    direction: ltr; unicode-bidi: isolate;
  }
  .pl-hero .pl-hero-ar {
    color: #C9A84C !important; font-size: clamp(18px, 2.4vw, 26px);
    font-weight: 700; margin: -8px 0 14px; line-height: 1.4;
  }
  .pl-hero .pl-hero-headline {
    color: #fff !important; font-size: clamp(20px, 2.6vw, 30px);
    font-weight: 700; line-height: 1.45; max-width: 36em;
    margin: 0 auto 14px; text-shadow: 0 2px 16px rgba(0,0,0,.35);
  }
  .pl-hero .pl-hero-lead {
    color: rgba(255,255,255,.92) !important; opacity: 1 !important;
    margin-bottom: 28px !important;
  }
  .pl-hero .pl-hero-eyebrow { color: #C9A84C !important; }
  .pl-hero .pl-btn-ghost {
    background: rgba(0,0,0,.25) !important;
    border-color: rgba(255,255,255,.55) !important; color: #fff !important;
  }
  .pl-hero .pl-btn-ghost:hover {
    background: rgba(201,168,76,.15) !important;
    border-color: rgba(201,168,76,.85) !important;
  }
`;

const PRODUCTS = [
  {
    key: 'growth',
    slug: 'growth-launch',
    brandEn: 'GrowthLaunch',
    icon: 'query_stats',
    premium: true,
    og: 'projects/animation/rafal-pavilions.jpg',
    hero: {
      src: '../assets/projects/animation/rafal-pavilions.jpg',
      webp: '../assets/projects/animation/rafal-pavilions.webp',
      altAr: 'جناح عرض يحفّز الطلب والمبيعات',
      altEn: 'Pavilion experience built to drive demand',
    },
    overviewImg: '../assets/projects/pavilion2.jpg',
    cards: [
      { img: '../assets/projects/pavilion1.jpg', titleAr: 'بيئة عرض للمبيعات', titleEn: 'Sales presentation environment' },
      { img: '../assets/projects/animation/market-center.jpg', titleAr: 'مواد حملة عالية النية', titleEn: 'High-intent campaign creative' },
      { img: '../assets/projects/cinematic/video-2.jpg', titleAr: 'محتوى يفتح مسار التحويل', titleEn: 'Content that opens conversion' },
    ],
    youtube: [],
    videos: [
      {
        src: '../assets/videos/GH-Marketing-Media-Production.mp4',
        mobileSrc: '../assets/videos/GH-Marketing-Media-Production-mobile.mp4',
        poster: '../assets/projects/cinematic/video-1.jpg',
        tagAr: 'تسويق',
        tagEn: 'MARKETING',
        titleAr: 'إنتاج تسويقي وإعلامي',
        titleEn: 'Marketing & media production',
        leadAr: 'محتوى يفتح مسار التحويل من أول نقرة',
        leadEn: 'Creative that opens the path from first click',
      },
      {
        src: '../assets/videos/GH-Real-estate-services.mp4',
        mobileSrc: '../assets/videos/GH-Real-estate-services-mobile.mp4',
        poster: '../assets/projects/animation/real-estate-services.jpg',
        tagAr: 'مبيعات',
        tagEn: 'SALES',
        titleAr: 'فيلم يربط العرض بالصفقة',
        titleEn: 'Film that links offer to deal',
        leadAr: 'سرد يحوّل الاهتمام إلى فرصة مبيعات',
        leadEn: 'Storytelling that turns interest into a sales opportunity',
      },
    ],
    proofStats: [
      { value: '7', labelAr: 'أيام لإطلاق المسار', labelEn: 'Days to live pipeline', subAr: 'نطاق واضح من البداية', subEn: 'Clear scope from day one' },
      { value: '24h', labelAr: 'رد على الطلبات', labelEn: 'Lead response SLA', subAr: 'قبل أن يبرد الاهتمام', subEn: 'Before intent cools off' },
      { value: '+200', labelAr: 'مشروع مُنجز', labelEn: 'Projects delivered', subAr: 'خبرة B2B في المنطقة', subEn: 'B2B experience across the region' },
    ],
    ar: {
      title: 'GrowthLaunch™ | نظام توليد العملاء والمبيعات | Graphics House',
      desc: 'منظومة مبيعات متكاملة — جذب مؤهل، رد فوري، ومتابعة آلية مع تتبع وCRM قابل للقياس.',
      eyebrow: 'الحل المتكامل',
      h1Ar: 'نظام توليد العملاء والمبيعات',
      heroHeadline: 'من أول نقرة إلى صفقة مغلقة — منظومة مبيعات، لا حملة منفصلة',
      heroLead: 'جذب مؤهل، رد خلال دقائق، ومتابعة آلية في مسار واحد قابل للقياس.',
      gapTitle: 'لماذا تضيع الفرص بعد الحملة؟',
      gapLead: 'الإعلان يجلب زيارات — لكن بدون رد سريع ومسار CRM واضح، يبرد العميل قبل أن يلمسه فريق المبيعات.',
      gapItems: ['رد متأخر بعد الإعلان', 'بيانات مشتتة بين واتساب وجداول', 'لا رؤية لمصدر كل صفقة'],
      outcomesTitle: 'ماذا يبني GrowthLaunch™؟',
      outcomesLead: 'أصول مبيعات جاهزة للتشغيل — من العرض إلى الإغلاق.',
      outcomes: [
        ['عرض عالي النية', 'صفحات ومواد تميّز من يصلح ومن لا يصلح'],
        ['رد خلال دقائق', 'واتساب وذكاء اصطناعي قبل أن يبرد الاهتمام'],
        ['مسار CRM', 'ملكية واضحة لكل lead من المصدر إلى الإغلاق'],
        ['تحسين مستمر', 'أرقام حقيقية — لا vanity metrics'],
      ],
      overviewTag: 'المنظومة',
      overviewTitle: 'مسار مبيعات قابل للقياس',
      overviewLead: 'GrowthLaunch™ يربط الحملات بالرد والمتابعة والتحويل — حتى لا تضيع الفرص بين القنوات والفريق.',
      features: [
        'صفحات هبوط وعروض عالية النية',
        'تتبع وتحليلات من اليوم الأول',
        'رد فوري عبر واتساب والذكاء الاصطناعي',
        'مسار CRM بملكية واضحة',
        'تحسين مستمر للأداء',
      ],
      process: ['تصميم العرض والقنوات', 'تفعيل التتبع والجذب', 'أتمتة الرد والتأهيل', 'قياس وتحسين التحويل'],
      processEyebrow: 'كيف نعمل',
      processTitle: 'المنهجية',
      portEyebrow: 'أعمال ذات صلة',
      portTitle: 'بيئات ومواد تدعم التحويل',
      vidEyebrow: 'أفلام وتسويق',
      vidTitle: 'محتوى يفتح المسار',
      vidLead: 'أفلام ومواد تسويقية تدعم الجذب والتحويل — مكمّلة لبيئة البيع، لا بديلاً عنها.',
      faq: [
        ['ماذا يشمل GrowthLaunch™؟', 'هيكلة العرض، الحملات، التتبع، الرد الآلي، ومسار CRM قابل للقياس.'],
        ['هل يناسب المطوّرين العقاريين؟', 'نعم — مصمم للمطورين وفرق B2B في الخليج.'],
        ['كم يستغرق الإطلاق؟', 'نحدد نطاقاً واضحاً ونبدأ بمسار قابل للقياس خلال أيام عمل قليلة.'],
        ['هل يتكامل مع ProjectLaunch™؟', 'نعم — مسار النمو يكمّل إطلاق المشروع: حملات بعد جاهزية العرض والبيع.'],
      ],
      ecosystemEyebrow: 'منظومة Graphics House',
      ecosystemTitle: 'GrowthLaunch™ — مسار الطلب بعد جاهزية العرض',
      ecosystemLead: 'BrandScale™ يثبت الهوية، وProjectLaunch™ يبني بيئة البيع — ثم GrowthLaunch™ يحوّل الاهتمام إلى صفقات.',
      ecosystem: [
        { slug: 'growth-launch', icon: 'query_stats', active: true, name: 'GrowthLaunch™', roleAr: 'توليد العملاء والمبيعات', roleEn: 'Lead generation & sales' },
        { slug: 'project-launch', icon: 'rocket_launch', active: false, name: 'ProjectLaunch™', roleAr: 'إطلاق المشروع وبيئة البيع', roleEn: 'Project launch & sales environment' },
        { slug: 'brand-scale', icon: 'workspace_premium', active: false, name: 'BrandScale™', roleAr: 'نظام العلامة والتموضع', roleEn: 'Brand & positioning system' },
      ],
      ctaTitle: 'جاهز لبناء مسار مبيعات متوقع؟',
      ctaLead: 'جلسة واحدة لرسم العرض والقنوات ومسار التحويل — بدون التزام في الخطوة الأولى.',
      ctaPrimary: 'جلسة مسار المبيعات',
      ctaSecondary: 'استعراض الأعمال',
      ctaFinal: 'احجز جلسة مسار المبيعات',
    },
    en: {
      title: 'GrowthLaunch™ | Lead Generation & Sales System | Graphics House',
      desc: 'An integrated sales system — qualified demand, instant response, and automated follow-up with measurable tracking and CRM.',
      eyebrow: 'Flagship solution',
      h1Ar: '',
      heroHeadline: 'From first click to closed deal — a sales system, not a standalone campaign',
      heroLead: 'Qualified demand, response within minutes, and automated follow-up in one measurable path.',
      gapTitle: 'Why do leads go cold after the campaign?',
      gapLead: 'Ads bring traffic — but without fast response and a clear CRM path, intent fades before sales touches the lead.',
      gapItems: ['Slow response after the ad', 'Data scattered across WhatsApp and spreadsheets', 'No view of each deal’s source'],
      outcomesTitle: 'What GrowthLaunch™ builds',
      outcomesLead: 'Sales assets ready to run — from offer to close.',
      outcomes: [
        ['High-intent offer', 'Pages and assets that filter fit from noise'],
        ['Response in minutes', 'WhatsApp and AI before intent cools'],
        ['CRM pipeline', 'Clear ownership from source to close'],
        ['Continuous optimization', 'Real numbers — not vanity metrics'],
      ],
      overviewTag: 'The system',
      overviewTitle: 'A measurable sales path',
      overviewLead: 'GrowthLaunch™ connects campaigns, response, and CRM — so opportunities are not lost between channels and teams.',
      features: [
        'High-intent offers and landing pages',
        'Tracking and analytics from day one',
        'Instant WhatsApp and AI-assisted response',
        'CRM pipeline with clear ownership',
        'Continuous performance optimization',
      ],
      process: ['Offer and channel design', 'Tracking and demand activation', 'Response automation and qualification', 'Measure and improve conversion'],
      processEyebrow: 'How we work',
      processTitle: 'Methodology',
      portEyebrow: 'Related work',
      portTitle: 'Assets and spaces that support conversion',
      ytEyebrow: '',
      ytTitle: '',
      vidEyebrow: 'Films & marketing',
      vidTitle: 'Content that opens the path',
      vidLead: 'Marketing films and assets for demand and conversion — complementary to the sales environment, not a replacement.',
      faq: [
        ['What does GrowthLaunch™ include?', 'Offer architecture, campaigns, tracking, automated response, and a measurable CRM path.'],
        ['Is it built for real-estate developers?', 'Yes — designed for developers and B2B teams across the GCC.'],
        ['How fast can we launch?', 'We scope clearly and start a measurable path within a few working days.'],
        ['Does it connect with ProjectLaunch™?', 'Yes — growth paths complement project launch once offer and sales assets are ready.'],
      ],
      ecosystemEyebrow: 'Graphics House ecosystem',
      ecosystemTitle: 'GrowthLaunch™ — demand after the offer is ready',
      ecosystemLead: 'BrandScale™ sets identity, ProjectLaunch™ builds the sales environment — then GrowthLaunch™ turns interest into deals.',
      ecosystem: [
        { slug: 'growth-launch', icon: 'query_stats', active: true, name: 'GrowthLaunch™', roleAr: 'توليد العملاء والمبيعات', roleEn: 'Lead generation & sales' },
        { slug: 'project-launch', icon: 'rocket_launch', active: false, name: 'ProjectLaunch™', roleAr: 'إطلاق المشروع وبيئة البيع', roleEn: 'Project launch & sales environment' },
        { slug: 'brand-scale', icon: 'workspace_premium', active: false, name: 'BrandScale™', roleAr: 'نظام العلامة والتموضع', roleEn: 'Brand & positioning system' },
      ],
      ctaTitle: 'Ready to build a predictable pipeline?',
      ctaLead: 'One session to map offer, channels, and conversion — no commitment in the first step.',
      ctaPrimary: 'Sales path session',
      ctaSecondary: 'View portfolio',
      ctaFinal: 'Book your sales path session',
    },
  },
  {
    key: 'project',
    slug: 'project-launch',
    brandEn: 'ProjectLaunch',
    icon: 'rocket_launch',
    og: 'projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
    hero: {
      src: '../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
      webp: '../assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
      altAr: 'بيئة إطلاق متكاملة — رابطة العالم الإسلامي',
      altEn: 'Integrated launch environment — Muslim World League',
    },
    overviewImg: '../assets/news/makkah-charter-01.jpeg',
    cards: [
      { img: '../assets/news/makkah-charter-04.jpeg', titleAr: 'بيئة معرض تفاعلية', titleEn: 'Interactive exhibition environment' },
      { img: '../assets/news/makkah-charter-02.jpeg', titleAr: 'هوية وتجارب لمس', titleEn: 'Identity & touch experiences' },
      { img: '../assets/news/makkah-charter-07.jpeg', titleAr: 'صالة بيع وإخراج فراغي', titleEn: 'Sales hall & spatial staging' },
    ],
    youtube: [
      {
        id: 'e766WAUYgGQ',
        tagEn: 'i-MAQUETTE',
        tagAr: 'i-MAQUETTE',
        titleEn: 'Smart interactive maquette',
        titleAr: 'المجسم التفاعلي الذكي',
        leadEn: 'Architectural model fused with interactive display technology',
        leadAr: 'مجسم معماري مدمج مع تقنية العرض التفاعلي',
      },
      {
        id: 'SPz2Lh2H2FM',
        tagEn: 'SCALE MODEL',
        tagAr: 'SCALE MODEL',
        titleEn: 'Architectural scale model',
        titleAr: 'مجسم معماري',
        leadEn: 'Precision model with integrated LED lighting',
        leadAr: 'مجسم معماري دقيق بإضاءة LED مدمجة',
      },
    ],
    videos: [
      {
        src: '../assets/videos/3D-Architectural-visualisation.mp4',
        poster: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg',
        tagAr: 'فيلم CGI',
        tagEn: 'CGI FILM',
        titleAr: 'ريل التصور المعماري',
        titleEn: 'Architectural visualization reel',
        leadAr: 'مشاهد فوتورياليستية تبيع ما لم يُبنَ بعد',
        leadEn: 'Photoreal sequences that sell the unbuilt',
      },
      {
        src: '../assets/videos/GH-Real-estate-services.mp4',
        poster: '../assets/projects/animation/real-estate-services.jpg',
        tagAr: 'عقاري',
        tagEn: 'REAL ESTATE',
        titleAr: 'فيلم إطلاق عقاري',
        titleEn: 'Real-estate launch film',
        leadAr: 'سرد سينمائي لإطلاق المشاريع',
        leadEn: 'Cinematic storytelling for development launches',
      },
      {
        src: '../assets/videos/GH-demo-reel-2025.mp4',
        poster: '../assets/projects/animation/architectural-visualisation.jpg',
        tagAr: 'DEMO REEL',
        tagEn: 'DEMO REEL',
        titleAr: 'ريل جرافيكس هاوس 2025',
        titleEn: 'Graphics House demo reel 2025',
        leadAr: 'مقطع يعكس حرفة التصور والإنتاج',
        leadEn: 'A cross-section of visualization and production craft',
      },
    ],
    ar: {
      title: 'ProjectLaunch™ | المنظومة الكاملة لإطلاق المشاريع العقارية | Graphics House',
      desc: 'كل ما يحتاجه إطلاق المشروع — هوية معمارية، أفلام CGI، مجسمات ذكية، عروض تفاعلية، ديكور صالة البيع، تصوير وإخراج — استوديو واحد.',
      eyebrow: 'الحل الرئيسي',
      h1Ar: 'نظام إطلاق المشاريع العقارية',
      heroHeadline: 'من الهوية المعمارية إلى صالة عرض تفاعلية تُغلق الصفقات',
      heroLead: 'مجسمات تفاعلية، أفلام سينمائية، عروض تفاعلية، ديكور، تصوير وإخراج في منظومة بصرية واحدة.',
      overviewTag: 'الحل الرئيسي',
      overviewTitle: 'المنظومة الكاملة للإطلاق',
      overviewLead: 'ProjectLaunch™ يجمع كل ما يلزم لفتح المبيعات قبل الخرسانة: هوية، CGI، أفلام، مجسمات، تفاعلي، ديكور صالة البيع، وإنتاج — بلغة بصرية واحدة.',
      features: [
        'هوية معمارية للمشروع',
        'تصور فوتورياليستي وأفلام سينمائية',
        'مجسمات ذكية بإضاءة وطبقات رقمية',
        'عروض تفاعلية لاختيار الوحدات',
        'ديكور صالة البيع الذي يُخرج كل أصل',
        'تصوير وإخراج وتركيب في الموقع',
      ],
      process: ['الهوية والتموضع واللغة البصرية', 'CGI والأفلام والمجسمات والأدوات التفاعلية', 'ديكور صالة البيع والإخراج الفراغي', 'التصوير والإخراج والتركيب والتسليم'],
      processEyebrow: 'كيف نعمل',
      processTitle: 'المنهجية',
      portEyebrow: 'أعمال تُثبت المنظومة',
      portTitle: 'بيئات مختارة',
      ytEyebrow: 'تفاعلي ومجسمات',
      ytTitle: 'مجسمات ذكية وعروض تفاعلية',
      vidEyebrow: 'أفلام الأنيميشن والـ CGI',
      vidTitle: 'أفلام إطلاق سينمائية',
      vidLead: 'أنيميشن وسينما CGI تحمل نفس الهوية إلى أيام المستثمرين والحملات.',
      faq: [
        ['ماذا يشمل ProjectLaunch™؟', 'هوية معمارية، CGI وأفلام، مجسمات ذكية، عروض تفاعلية، ديكور صالة البيع، تصوير وقيادة إبداعية — كنطاق واحد.'],
        ['هل يمكن البدء بالتصور أو المجسمات فقط؟', 'نعم، يمكن التنفيذ على مراحل، لكن قيمة الحل هي لغة واحدة عبر كل سطح.'],
        ['هل تقومون بالتركيب في الموقع؟', 'نعم — الديكور والشاشات والمجسمات والأنظمة التفاعلية تُركَّب وتُسلَّم مع التدريب.'],
      ],
      ecosystemEyebrow: 'منظومة Graphics House',
      ecosystemTitle: 'ProjectLaunch™ — قلب الإطلاق البصري',
      ecosystemLead: 'الهوية من BrandScale™، والطلب من GrowthLaunch™ — وProjectLaunch™ يربطهما ببيئة بيع متكاملة.',
      ecosystem: [
        { slug: 'project-launch', icon: 'rocket_launch', active: true, name: 'ProjectLaunch™', roleAr: 'إطلاق المشروع وبيئة البيع', roleEn: 'Project launch & sales environment' },
        { slug: 'brand-scale', icon: 'workspace_premium', active: false, name: 'BrandScale™', roleAr: 'نظام العلامة والتموضع', roleEn: 'Brand & positioning system' },
        { slug: 'growth-launch', icon: 'query_stats', active: false, name: 'GrowthLaunch™', roleAr: 'توليد العملاء والمبيعات', roleEn: 'Lead generation & sales' },
      ],
      ctaTitle: 'جاهز لإطلاق المنظومة الكاملة؟',
      ctaLead: 'فريقنا جاهز لتحديد نطاق ProjectLaunch™ وتقديم عرض واضح خلال ٤٨ ساعة.',
    },
    en: {
      title: 'ProjectLaunch™ | Complete Real Estate Launch System | Graphics House',
      desc: 'Everything a development launch needs — architectural identity, CGI films, smart maquettes, interactive experiences, sales-gallery décor, photography and direction — one studio.',
      eyebrow: 'Flagship Solution',
      h1Ar: '',
      heroHeadline: 'From architectural identity to an interactive sales hall that closes deals',
      heroLead: 'Interactive maquettes, cinematic films, interactive experiences, décor, photography and direction — one visual system.',
      overviewTag: 'Flagship Solution',
      overviewTitle: 'The complete launch system',
      overviewLead: 'ProjectLaunch™ gathers every capability required to open sales before concrete — one visual language.',
      features: [
        'Architectural identity for the development',
        'Photoreal CGI and cinematic films',
        'Smart maquettes with lighting & digital layers',
        'Interactive experiences for unit selection',
        'Sales-gallery décor that stages every asset',
        'Photography, direction and on-site installation',
      ],
      process: ['Identity, positioning and visual language', 'CGI, films, maquettes and interactive tools', 'Sales-hall décor and spatial staging', 'Photography, direction, install and handover'],
      processEyebrow: 'How we work',
      processTitle: 'Methodology',
      portEyebrow: 'Work that proves the system',
      portTitle: 'Selected environments',
      ytEyebrow: 'Interactive & maquettes',
      ytTitle: 'Smart models and interactive shows',
      vidEyebrow: 'Animation & CGI films',
      vidTitle: 'Cinematic launch films',
      vidLead: 'Animation and CGI cinema that carry the same identity into investor days and campaigns.',
      faq: [
        ['What does ProjectLaunch™ include?', 'Architectural identity, CGI and films, smart maquettes, interactive experiences, sales-gallery décor, photography and creative direction — one system.'],
        ['Can we start with only visualization or maquettes?', 'Yes. We can phase delivery, but the flagship value is one coherent language across every surface.'],
        ['Do you install on site?', 'Yes — décor, screens, models and interactive systems are installed and handed over with training.'],
      ],
      ecosystemEyebrow: 'Graphics House ecosystem',
      ecosystemTitle: 'ProjectLaunch™ — the visual launch core',
      ecosystemLead: 'Identity from BrandScale™, demand from GrowthLaunch™ — ProjectLaunch™ connects both in one sales environment.',
      ecosystem: [
        { slug: 'project-launch', icon: 'rocket_launch', active: true, name: 'ProjectLaunch™', roleAr: 'إطلاق المشروع وبيئة البيع', roleEn: 'Project launch & sales environment' },
        { slug: 'brand-scale', icon: 'workspace_premium', active: false, name: 'BrandScale™', roleAr: 'نظام العلامة والتموضع', roleEn: 'Brand & positioning system' },
        { slug: 'growth-launch', icon: 'query_stats', active: false, name: 'GrowthLaunch™', roleAr: 'توليد العملاء والمبيعات', roleEn: 'Lead generation & sales' },
      ],
      ctaTitle: 'Ready to launch the complete system?',
      ctaLead: 'Our team can scope ProjectLaunch™ and share a clear proposal within 48 hours.',
    },
  },
  {
    key: 'brand',
    slug: 'brand-scale',
    brandEn: 'BrandScale',
    icon: 'workspace_premium',
    premium: true,
    og: 'projects/rendering/The-Financial-Center-of-King-Abdullah-City.jpeg',
    hero: {
      src: '../assets/projects/rendering/The-Financial-Center-of-King-Abdullah-City.jpeg',
      webp: '../assets/projects/rendering/The-Financial-Center-of-King-Abdullah-City.webp',
      altAr: 'حضور مؤسسي يفرض الثقة',
      altEn: 'Institutional presence that commands trust',
    },
    overviewImg: '../assets/news/makkah-charter-02.jpeg',
    overviewAltAr: 'هوية علامة في بيئة معرض — لغة بصرية متسقة',
    overviewAltEn: 'Brand identity in an exhibition environment — consistent visual language',
    cards: [
      { img: '../assets/news/makkah-charter-08.jpeg', titleAr: 'هوية في الفضاء', titleEn: 'Identity in space' },
      { img: '../assets/news/makkah-charter-10.jpeg', titleAr: 'لغة علامة متسقة', titleEn: 'Consistent brand language' },
      { img: '../assets/projects/rendering/jeddah-forum.jpg', titleAr: 'حضور يُشعر قبل أن يُقال', titleEn: 'Presence felt before it is spoken' },
    ],
    youtube: [],
    videos: [
      {
        src: '../assets/videos/GH-Marketing-Media-Production.mp4',
        mobileSrc: '../assets/videos/GH-Marketing-Media-Production-mobile.mp4',
        poster: '../assets/projects/cinematic/video-3.jpg',
        tagAr: 'هوية وإعلام',
        tagEn: 'BRAND & MEDIA',
        titleAr: 'إنتاج يحمل نظام العلامة',
        titleEn: 'Production that carries the brand system',
        leadAr: 'محتوى يحافظ على لغة الهوية عبر القنوات',
        leadEn: 'Content that keeps identity language across channels',
      },
      {
        src: '../assets/videos/GH-demo-reel-2025.mp4',
        poster: '../assets/news/makkah-charter-05.jpeg',
        tagAr: 'حضور',
        tagEn: 'PRESENCE',
        titleAr: 'ريل يعكس حرفة الهوية',
        titleEn: 'Reel reflecting brand craft',
        leadAr: 'مقطع يظهر كيف تُترجم الهوية إلى تجارب بصرية',
        leadEn: 'How identity translates into visual experiences',
      },
    ],
    proofStats: [
      { value: '4', labelAr: 'مراحل منهجية', labelEn: 'Structured phases', subAr: 'من الاستكشاف إلى الإطلاق', subEn: 'Discovery through launch' },
      { value: '48h', labelAr: 'عرض أولي', labelEn: 'Initial proposal', subAr: 'نطاق واضح بعد الجلسة', subEn: 'Clear scope after the session' },
      { value: '+200', labelAr: 'مشروع مُنجز', labelEn: 'Projects delivered', subAr: 'ثقة B2B في المنطقة', subEn: 'B2B trust across the region' },
    ],
    ar: {
      title: 'BrandScale™ | نظام نمو العلامات التجارية | Graphics House',
      desc: 'منظومة علامة متكاملة — تموضع، هوية، أدلة استخدام، وحضور رقمي يبني ثقة السوق ويتوسع مع كل مشروع.',
      eyebrow: 'نظام العلامة',
      h1Ar: 'نظام نمو العلامات التجارية',
      heroHeadline: 'من التموضع إلى حضور يفرض الثقة — نظام علامة، لا شعار منفصل',
      heroLead: 'تموضع، هوية بصرية، أدلة للفريق، وحضور رقمي في لغة واحدة — حتى يراك السوق كمؤسسة واحدة مهما تعدّدت مشاريعك.',
      gapTitle: 'لماذا تضعف العلامة مع توسّع المشاريع؟',
      gapLead: 'كل مشروع جديد يُضاف بلغة مختلفة — فيختلط التموضع، يتشتت الفريق، وتضعف ثقة السوق قبل أن تبدأ المبيعات.',
      gapItems: [
        'هوية متفرقة بين المشاريع والحملات',
        'فريق بدون دليل استخدام واضح',
        'حضور رقمي لا يعكس قيمة المؤسسة',
        'حملات ومواد تبدو كأنها من جهات مختلفة',
      ],
      pillarsEyebrow: 'لماذا نظام وليس شعاراً؟',
      pillarsTitle: 'ثلاثة أركان تبني ثقة السوق',
      pillarsLead: 'BrandScale™ لا يبدأ بالألوان — يبدأ بمن أنتم، ثم يترجم ذلك إلى كل سطح يلمسه العميل.',
      pillars: [
        { icon: 'psychology', title: 'تموضع يفرق', desc: 'قبل أي لون: من تخدمون، لماذا أنتم، وكيف تُقال الرسالة — رسالة واحدة تميّزكم في سوق مزدحم.' },
        { icon: 'layers', title: 'نظام قابل للتوسع', desc: 'هوية تعمل على المشروع الخامس كما على الأول — بدون إعادة اختراع أو تضارب بين الفرق والوكالات.' },
        { icon: 'touch_app', title: 'حضور يُترجم', desc: 'من الموقع إلى صالة العرض إلى الحملة: لغة واحدة في كل نقطة لمس — حضور يُشعر قبل أن يُقال.' },
      ],
      outcomesTitle: 'ماذا يبني BrandScale™؟',
      outcomesLead: 'أصول علامة جاهزة للتطبيق — من الرسالة إلى كل سطح يلمسه العميل.',
      outcomes: [
        ['تموضع واضح', 'رسالة واحدة تميّز المؤسسة في السوق'],
        ['نظام هوية', 'شعار وألوان وطباعة قابلة للتوسع'],
        ['أدلة استخدام', 'فريقك يطبّق بنفس اللغة — بدون تفسيرات'],
        ['حضور رقمي', 'موقع ومواد تتوافق مع الإطلاق ومسارات النمو'],
        ['مواد جاهزة', 'قوالب للحملات والعروض والمطبوعات'],
        ['اتساق تراكمي', 'ثقة تتراكم مع كل مشروع — لا تُعاد من الصفر'],
      ],
      overviewTag: 'المنظومة',
      overviewTitle: 'هوية تصمد وتتوسع',
      overviewLead: 'BrandScale™ يبني نظام علامة واضح — من التموضع إلى التطبيقات — حتى تتراكم الثقة مع كل مشروع وحملة، لا تُعاد من الصفر.',
      features: [
        'تموضع وهندسة رسائل للمطورين والمؤسسات',
        'نظام شعار وهوية بصرية قابل للتوسع',
        'أدلة استخدام عملية للفريق والوكالات',
        'حضور ويب ورقمي متسق',
        'مواد متوافقة مع ProjectLaunch™ وGrowthLaunch™',
      ],
      process: [
        ['استكشاف وتموضع', 'جلسة لفهم السوق والجمهور ورسالة التميّز'],
        ['بناء نظام الهوية', 'شعار، ألوان، طباعة، وقواعد الاستخدام'],
        ['تطبيقات رقمية ومطبوعة', 'موقع، قوالب، ومواد جاهزة للفريق'],
        ['إطلاق ومتابعة الاتساق', 'تسليم للفريق مع مراجعة بعد الإطلاق'],
      ],
      processEyebrow: 'كيف نعمل',
      processTitle: 'المنهجية',
      portEyebrow: 'بيئات علامة',
      portTitle: 'حضور يُشعر قبل أن يُقال',
      vidEyebrow: 'هوية في الحركة',
      vidTitle: 'محتوى يحافظ على اللغة',
      vidLead: 'إنتاج يحمل نظام العلامة — مكمّل للإطلاق ومسارات النمو، لا بديلاً عنهما.',
      compareTitle: 'بدون نظام — أم مع BrandScale™؟',
      compareLead: 'الفرق ليس في جمال الشعار — بل في اتساق الثقة عبر كل مشروع.',
      compareWithout: [
        'شعار جديد أو متغيّر مع كل مشروع',
        'فريق يخمّن الألوان والخطوط',
        'موقع لا يطابق صالة البيع',
        'حملات تبدو من وكالات مختلفة',
      ],
      compareWith: [
        'رسالة وتموضع واحد عبر المحفظة',
        'دليل استخدام واضح للفريق والوكالات',
        'مواد رقمية ومطبوعة متوافقة',
        'ثقة تراكمية مع كل إطلاق',
      ],
      deliverablesEyebrow: 'ماذا تستلم؟',
      deliverablesTitle: 'حزمة علامة جاهزة للتطبيق',
      deliverablesLead: 'ليس ملفاً واحداً — منظومة أصول يعمل بها فريقك من اليوم الأول.',
      deliverables: [
        { icon: 'description', title: 'وثيقة التموضع', desc: 'من تخدمون، رسالة التميّز، ونبرة الصوت' },
        { icon: 'palette', title: 'نظام الهوية البصرية', desc: 'شعار، ألوان، خطوط، وقواعد الاستخدام' },
        { icon: 'menu_book', title: 'دليل العلامة', desc: 'Brand Guidelines عملية للفريق والوكالات' },
        { icon: 'web', title: 'حضور رقمي', desc: 'موقع وقوالب رقمية متسقة' },
        { icon: 'print', title: 'قوالب مطبوعة', desc: 'بطاقات، عروض، ومواد جاهزة للطباعة' },
        { icon: 'rocket_launch', title: 'حزمة الإطلاق', desc: 'مواد جاهزة لأول حملة أو مشروع' },
      ],
      audienceEyebrow: 'لمن صُمّم؟',
      audienceTitle: 'علامات تحتاج ثقة قبل الحجم',
      audience: [
        { title: 'مطوّرون متعدّدو المشاريع', desc: 'محفظة مشاريع تحتاج لغة واحدة — لا هوية جديدة مع كل إطلاق.' },
        { title: 'مؤسسات رسمية', desc: 'حضور يفرض الثقة أمام المستثمرين والشركاء والجهات الحكومية.' },
        { title: 'فرق تطلق مشروعاً جديداً', desc: 'تحتاج لغة بصرية واضحة قبل الإعلان — لا وقت لإعادة الاختراع.' },
      ],
      ecosystemEyebrow: 'منظومة Graphics House',
      ecosystemTitle: 'BrandScale™ — الأساس قبل الإطلاق والنمو',
      ecosystemLead: 'الهوية تسبق كل شيء. ثم يبني ProjectLaunch™ بيئة البيع، وGrowthLaunch™ مسار الطلب.',
      ecosystem: [
        { slug: 'brand-scale', icon: 'workspace_premium', active: true, name: 'BrandScale™', roleAr: 'نظام العلامة والتموضع', roleEn: 'Brand & positioning system' },
        { slug: 'project-launch', icon: 'rocket_launch', active: false, name: 'ProjectLaunch™', roleAr: 'إطلاق المشروع وبيئة البيع', roleEn: 'Project launch & sales environment' },
        { slug: 'growth-launch', icon: 'query_stats', active: false, name: 'GrowthLaunch™', roleAr: 'توليد العملاء والمبيعات', roleEn: 'Lead generation & sales' },
      ],
      faq: [
        ['ماذا يشمل BrandScale™؟', 'تموضع، نظام هوية، أدلة استخدام، حضور رقمي، وقوالب جاهزة — كنظام واحد قابل للتطبيق.'],
        ['هل يناسب المطوّرين والمؤسسات؟', 'نعم — مصمم للعلامات التي تحتاج ثقة السوق والاستمرارية عبر مشاريع متعددة.'],
        ['كم يستغرق البناء؟', 'نحدد نطاقاً واضحاً في جلسة واحدة ونقدّم عرضاً أولياً خلال ٤٨ ساعة.'],
        ['هل يتكامل مع ProjectLaunch وGrowthLaunch؟', 'نعم — الهوية تُسلَّم بلغة متوافقة مع الإطلاق ومسارات النمو، حتى لا تتعارض القنوات.'],
        ['هل يمكن البدء بمرحلة التموضع فقط؟', 'نعم — يمكن التنفيذ على مراحل، لكن قيمة النظام في اللغة الموحدة عبر كل سطح.'],
        ['ماذا يحدث بعد التسليم؟', 'نسلّم أصولاً جاهزة للفريق مع جلسة توجيه — ويمكن متابعة الاتساق عند إطلاق مشاريع جديدة.'],
      ],
      ctaTitle: 'جاهز لبناء نظام علامة يصمد؟',
      ctaLead: 'جلسة واحدة لرسم التموضع ونطاق الهوية — بدون التزام في الخطوة الأولى.',
      ctaPrimary: 'جلسة نظام العلامة',
      ctaSecondary: 'استعراض الأعمال',
      ctaFinal: 'احجز جلسة نظام العلامة',
    },
    en: {
      title: 'BrandScale™ | Brand Growth System | Graphics House',
      desc: 'An integrated brand system — positioning, identity, guidelines, and digital presence that builds market trust and scales with every project.',
      eyebrow: 'Brand system',
      h1Ar: '',
      heroHeadline: 'From positioning to a presence that commands trust — a brand system, not a standalone logo',
      heroLead: 'Positioning, visual identity, team guidelines, and digital presence in one language — so the market sees one institution, however many projects you launch.',
      gapTitle: 'Why does the brand weaken as projects multiply?',
      gapLead: 'Each new project arrives with a different visual language — positioning blurs, teams drift, and market trust erodes before sales begin.',
      gapItems: [
        'Identity scattered across projects and campaigns',
        'Teams without practical usage guidelines',
        'Digital presence that undersells the institution',
        'Campaigns that look like they came from different agencies',
      ],
      pillarsEyebrow: 'Why a system, not a logo?',
      pillarsTitle: 'Three pillars that build market trust',
      pillarsLead: 'BrandScale™ does not start with colour — it starts with who you are, then translates that to every surface the client touches.',
      pillars: [
        { icon: 'psychology', title: 'Positioning that matters', desc: 'Before any colour: who you serve, why you, and how the message is said — one message that distinguishes you in a crowded market.' },
        { icon: 'layers', title: 'A scalable system', desc: 'Identity that works on project five as well as project one — no reinvention or conflict between teams and agencies.' },
        { icon: 'touch_app', title: 'Presence that translates', desc: 'From website to sales hall to campaign: one language at every touchpoint — presence felt before it is spoken.' },
      ],
      outcomesTitle: 'What BrandScale™ builds',
      outcomesLead: 'Brand assets ready to deploy — from message to every surface the client touches.',
      outcomes: [
        ['Clear positioning', 'One message that distinguishes you in market'],
        ['Identity system', 'Logo, colour and print that scale'],
        ['Usage guidelines', 'Your team applies the same language — no guesswork'],
        ['Digital presence', 'Web and collateral aligned with launch and growth'],
        ['Ready collateral', 'Templates for campaigns, decks and print'],
        ['Compounding consistency', 'Trust builds with every project — not rebuilt from scratch'],
      ],
      overviewTag: 'The system',
      overviewTitle: 'Identity that endures and scales',
      overviewLead: 'BrandScale™ builds a clear brand system — from positioning to applications — so trust compounds with every project and campaign, not rebuilt from scratch.',
      features: [
        'Positioning and messaging for developers and institutions',
        'Scalable logo and visual identity system',
        'Practical guidelines for teams and agencies',
        'Consistent web and digital presence',
        'Collateral aligned with ProjectLaunch™ and GrowthLaunch™',
      ],
      process: [
        ['Discovery & positioning', 'A session to understand market, audience and differentiation'],
        ['Identity system design', 'Logo, colour, typography and usage rules'],
        ['Digital & print applications', 'Website, templates and team-ready assets'],
        ['Launch & consistency follow-through', 'Handover with post-launch consistency review'],
      ],
      processEyebrow: 'How we work',
      processTitle: 'Methodology',
      portEyebrow: 'Brand environments',
      portTitle: 'Presence felt before it is spoken',
      vidEyebrow: 'Brand in motion',
      vidTitle: 'Content that keeps the language',
      vidLead: 'Media that carries the brand system — complementary to launch and growth, not a replacement.',
      compareTitle: 'Without a system — or with BrandScale™?',
      compareLead: 'The difference is not logo beauty — it is consistent trust across every project.',
      compareWithout: [
        'A new or shifting logo with every project',
        'Teams guessing colours and typography',
        'Website that does not match the sales hall',
        'Campaigns that look like different agencies',
      ],
      compareWith: [
        'One message and positioning across the portfolio',
        'Clear guidelines for teams and agencies',
        'Aligned digital and print collateral',
        'Trust that compounds with every launch',
      ],
      deliverablesEyebrow: 'What you receive',
      deliverablesTitle: 'A brand pack ready to deploy',
      deliverablesLead: 'Not a single file — a system of assets your team can use from day one.',
      deliverables: [
        { icon: 'description', title: 'Positioning document', desc: 'Who you serve, differentiation and tone of voice' },
        { icon: 'palette', title: 'Visual identity system', desc: 'Logo, colour, typography and usage rules' },
        { icon: 'menu_book', title: 'Brand guidelines', desc: 'Practical guidelines for teams and agencies' },
        { icon: 'web', title: 'Digital presence', desc: 'Website and consistent digital templates' },
        { icon: 'print', title: 'Print templates', desc: 'Cards, decks and print-ready collateral' },
        { icon: 'rocket_launch', title: 'Launch pack', desc: 'Assets ready for the first campaign or project' },
      ],
      audienceEyebrow: 'Built for',
      audienceTitle: 'Brands that need trust before scale',
      audience: [
        { title: 'Multi-project developers', desc: 'A portfolio that needs one language — not a new identity with every launch.' },
        { title: 'Institutional brands', desc: 'A presence that commands trust with investors, partners and authorities.' },
        { title: 'Teams launching something new', desc: 'Clear visual language before advertising — no time to reinvent.' },
      ],
      ecosystemEyebrow: 'Graphics House ecosystem',
      ecosystemTitle: 'BrandScale™ — the foundation before launch and growth',
      ecosystemLead: 'Identity comes first. Then ProjectLaunch™ builds the sales environment, and GrowthLaunch™ drives demand.',
      ecosystem: [
        { slug: 'brand-scale', icon: 'workspace_premium', active: true, name: 'BrandScale™', roleAr: 'نظام العلامة والتموضع', roleEn: 'Brand & positioning system' },
        { slug: 'project-launch', icon: 'rocket_launch', active: false, name: 'ProjectLaunch™', roleAr: 'إطلاق المشروع وبيئة البيع', roleEn: 'Project launch & sales environment' },
        { slug: 'growth-launch', icon: 'query_stats', active: false, name: 'GrowthLaunch™', roleAr: 'توليد العملاء والمبيعات', roleEn: 'Lead generation & sales' },
      ],
      faq: [
        ['What does BrandScale™ include?', 'Positioning, identity system, guidelines, digital presence and ready templates — as one deployable system.'],
        ['Is it for developers and institutions?', 'Yes — built for brands that need market trust and continuity across multiple projects.'],
        ['How long does it take?', 'We scope clearly in one session and share an initial proposal within 48 hours.'],
        ['Does it connect with ProjectLaunch and GrowthLaunch?', 'Yes — identity is delivered in a language compatible with launch and growth paths.'],
        ['Can we start with positioning only?', 'Yes — delivery can be phased, but the system value is one language across every surface.'],
        ['What happens after handover?', 'Team-ready assets with a briefing session — plus consistency support when new projects launch.'],
      ],
      ctaTitle: 'Ready to build a brand system that holds?',
      ctaLead: 'One session to map positioning and identity scope — no commitment in the first step.',
      ctaPrimary: 'Brand system session',
      ctaSecondary: 'View portfolio',
      ctaFinal: 'Book your brand system session',
    },
  },
];

function pic(src, webp, alt, cls = 'w-full h-full object-cover') {
  if (webp) {
    return `<picture><source srcset="${webp}" type="image/webp"><img class="${cls}" src="${src}" alt="${alt}" loading="lazy"/></picture>`;
  }
  return `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy"/>`;
}

function buildPremiumExtras(t, isEn, contact, ctaSlug) {
  const out = { pillars: '', compare: '', deliverables: '', audience: '', ecosystem: '' };

  if (t.pillars?.length) {
    const items = t.pillars
      .map(
        (p, i) => `<article class="gl-pillar reveal" style="opacity:0;transform:translateY(20px);transition-delay:${(i * 0.07).toFixed(2)}s">
        <span class="material-symbols-outlined ms-filled gl-pillar-icon">${p.icon}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </article>`
      )
      .join('');
    out.pillars = `<section class="gl-pillars">
  <div class="gl-pillars-head reveal" style="opacity:0;transform:translateY(20px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.pillarsEyebrow || ''}</span>
    <h2>${t.pillarsTitle || ''}</h2>
    <p>${t.pillarsLead || ''}</p>
  </div>
  <div class="gl-pillars-grid">${items}</div>
</section>`;
  }

  if (t.compareWithout?.length && t.compareWith?.length) {
    const without = t.compareWithout.map((item) => `<li>${item}</li>`).join('');
    const withItems = t.compareWith.map((item) => `<li>${item}</li>`).join('');
    out.compare = `<section class="gl-compare">
  <div class="gl-compare-head reveal" style="opacity:0;transform:translateY(20px)">
    <h2>${t.compareTitle || ''}</h2>
    <p>${t.compareLead || ''}</p>
  </div>
  <div class="gl-compare-grid">
    <article class="gl-compare-col gl-compare-without reveal" style="opacity:0;transform:translateY(20px)">
      <span class="gl-compare-label">${isEn ? 'Without a system' : 'بدون نظام'}</span>
      <ul>${without}</ul>
    </article>
    <article class="gl-compare-col gl-compare-with reveal" style="opacity:0;transform:translateY(20px);transition-delay:.1s">
      <span class="gl-compare-label">${isEn ? 'With BrandScale™' : 'مع BrandScale™'}</span>
      <ul>${withItems}</ul>
    </article>
  </div>
</section>`;
  }

  if (t.deliverables?.length) {
    const items = t.deliverables
      .map(
        (d, i) => `<article class="gl-deliverable reveal" style="opacity:0;transform:translateY(20px);transition-delay:${(i * 0.05).toFixed(2)}s">
        <span class="material-symbols-outlined ms-filled">${d.icon}</span>
        <strong>${d.title}</strong>
        <span>${d.desc}</span>
      </article>`
      )
      .join('');
    out.deliverables = `<section class="gl-deliverables">
  <div class="gl-deliverables-head reveal" style="opacity:0;transform:translateY(20px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.deliverablesEyebrow || ''}</span>
    <h2>${t.deliverablesTitle || ''}</h2>
    <p>${t.deliverablesLead || ''}</p>
  </div>
  <div class="gl-deliverables-grid">${items}</div>
</section>`;
  }

  if (t.audience?.length) {
    const items = t.audience
      .map(
        (a, i) => `<article class="gl-audience-card reveal" style="opacity:0;transform:translateY(20px);transition-delay:${(i * 0.07).toFixed(2)}s">
        <h3>${a.title}</h3>
        <p>${a.desc}</p>
      </article>`
      )
      .join('');
    out.audience = `<section class="gl-audience">
  <div class="gl-audience-head reveal" style="opacity:0;transform:translateY(20px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.audienceEyebrow || ''}</span>
    <h2>${t.audienceTitle || ''}</h2>
  </div>
  <div class="gl-audience-grid">${items}</div>
</section>`;
  }

  if (t.ecosystem?.length) {
    const suffix = isEn ? '-en.html' : '.html';
    const items = t.ecosystem
      .map((e) => {
        const href = e.active ? contact : `../solutions/${e.slug}${suffix}`;
        const role = isEn ? e.roleEn : e.roleAr;
        const cls = e.active ? 'gl-eco-card gl-eco-card-active' : 'gl-eco-card';
        const cta = e.active
          ? isEn
            ? 'Book session →'
            : 'احجز جلسة ←'
          : isEn
            ? 'Explore →'
            : 'اكتشف ←';
        return `<a href="${href}" class="${cls} reveal" style="opacity:0;transform:translateY(20px)" data-cta="${ctaSlug}-eco-${e.slug}">
        <span class="material-symbols-outlined ms-filled gl-eco-icon">${e.icon}</span>
        <strong dir="ltr">${e.name}</strong>
        <span>${role}</span>
        <em>${cta}</em>
      </a>`;
      })
      .join('');
    out.ecosystem = `<section class="gl-ecosystem">
  <div class="gl-ecosystem-head reveal" style="opacity:0;transform:translateY(20px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.ecosystemEyebrow || ''}</span>
    <h2>${t.ecosystemTitle || ''}</h2>
    <p>${t.ecosystemLead || ''}</p>
  </div>
  <div class="gl-ecosystem-grid">${items}</div>
</section>`;
  }

  return out;
}

function buildPremiumPage(product, isEn) {
  const file = isEn ? `${product.slug}-en.html` : `${product.slug}.html`;
  const t = isEn ? product.en : product.ar;
  const canonical = isEn ? `${BASE}/solutions/${product.slug}-en.html` : `${BASE}/solutions/${product.slug}.html`;
  const arUrl = `${BASE}/solutions/${product.slug}.html`;
  const enUrl = `${BASE}/solutions/${product.slug}-en.html`;
  const header = renderHeader(DEPTH, isEn);
  const footer = renderFooter(DEPTH, isEn);
  const contact = isEn ? '../contact-us-en.html' : '../contact-us.html';
  const portfolio = isEn ? '../portfolio-en.html' : '../portfolio.html';
  const heroAlt = isEn ? product.hero.altEn : product.hero.altAr;
  const brandName = product.brandEn;
  const ctaPrimary = t.ctaPrimary || (isEn ? 'START YOUR PROJECT' : 'ابدأ مشروعك');
  const ctaSecondary = t.ctaSecondary || (isEn ? 'VIEW PORTFOLIO' : 'استعرض أعمالنا');
  const ctaFinal = t.ctaFinal || ctaPrimary;
  const portAll = isEn ? 'Full portfolio' : 'كل الأعمال';
  const cardLinkLabel = isEn ? 'View portfolio →' : 'استعرض الأعمال ←';
  const faqEyebrow = isEn ? 'FAQ' : 'الأسئلة الشائعة';
  const faqTitle = isEn ? 'Answers to common questions' : 'أجوبة عن استفساراتكم';
  const ctaSlug = product.key || 'sol';
  const extras = buildPremiumExtras(t, isEn, contact, ctaSlug);
  const overviewAlt = isEn ? product.overviewAltEn || '' : product.overviewAltAr || '';

  const proofHtml = (product.proofStats || [])
    .map(
      (s) => `<article class="gl-proof-stat reveal" style="opacity:0;transform:translateY(16px)">
        <strong>${s.value}</strong>
        <span>${isEn ? s.labelEn : s.labelAr}<br><small style="opacity:.65;font-size:11px">${isEn ? s.subEn : s.subAr}</small></span>
      </article>`
    )
    .join('');

  const gapItems = (t.gapItems || [])
    .map((item) => `<li class="reveal" style="opacity:0;transform:translateY(16px)">${item}</li>`)
    .join('');

  const outcomesHtml = (t.outcomes || [])
    .map(
      ([title, desc], i) => `<article class="gl-outcome-card reveal" style="opacity:0;transform:translateY(20px);transition-delay:${(i * 0.06).toFixed(2)}s">
        <strong>${title}</strong><span>${desc}</span>
      </article>`
    )
    .join('');

  const features = t.features
    .map(
      (f) =>
        `<div class="ar-feat-row"><span class="material-symbols-outlined ms-filled">check</span><p>${f}</p></div>`
    )
    .join('');

  const process = t.process
    .map((p, i) => {
      const title = Array.isArray(p) ? p[0] : p;
      const desc = Array.isArray(p) ? p[1] : '';
      const body = desc
        ? `<strong class="gl-step-title">${title}</strong><p>${desc}</p>`
        : `<p>${title}</p>`;
      return `<article class="gl-step reveal" style="opacity:0;transform:translateY(20px);transition-delay:${(i * 0.08).toFixed(2)}s">
        <div class="gl-step-num">${String(i + 1).padStart(2, '0')}</div>
        ${body}
      </article>`;
    })
    .join('');

  const cards = product.cards
    .map(
      (c, i) => `<article class="gl-port-card reveal" style="opacity:0;transform:translateY(20px);transition-delay:${(0.05 + i * 0.07).toFixed(2)}s">
        <img src="${c.img}" alt="${isEn ? c.titleEn : c.titleAr}" loading="lazy"/>
        <div class="gl-port-card-copy">
          <h3>${isEn ? c.titleEn : c.titleAr}</h3>
          <a href="${portfolio}">${cardLinkLabel}</a>
        </div>
      </article>`
    )
    .join('');

  const renderVidFrame = (v, isEn) => {
    const title = isEn ? v.titleEn : v.titleAr;
    const mobileAttr = v.mobileSrc ? ` data-pl-src-mobile="${v.mobileSrc}"` : '';
    const video = `<video class="gh-autoplay gh-ambient-video" autoplay muted loop playsinline webkit-playsinline disablepictureinpicture disableremoteplayback preload="none" poster="${v.poster}" data-pl-src="${v.src}"${mobileAttr} title="${title}"></video>`;
    if (/GH-Real-estate-services/i.test(v.src)) {
      return `<div class="gl-vid-frame gh-ambient-dual">${video}<img class="gh-ambient-poster-mobile" src="${v.poster}" alt="${title}" loading="eager" decoding="async"></div>`;
    }
    return `<div class="gl-vid-frame">${video}</div>`;
  };

  const videos = product.videos
    .map(
      (v, i) => `<article class="gl-vid-card reveal" style="opacity:0;transform:translateY(20px);transition-delay:${(0.05 + i * 0.06).toFixed(2)}s">
      ${renderVidFrame(v, isEn)}
      <div class="gl-vid-body">
        <span class="text-primary text-[9px] font-bold tracking-widest uppercase mb-2 block">${isEn ? v.tagEn : v.tagAr}</span>
        <h3 class="font-headline-md text-on-background mb-1">${isEn ? v.titleEn : v.titleAr}</h3>
        <p class="text-secondary text-sm opacity-70">${isEn ? v.leadEn : v.leadAr}</p>
      </div>
    </article>`
    )
    .join('');

  const faq = t.faq
    .map(
      ([q, a]) => `<div class="gl-faq-item">
          <h4>${q}</h4>
          <p>${a}</p>
        </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="../assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags('../')}
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${t.title}</title>
<meta name="description" content="${t.desc}"/>
<meta property="og:title" content="${brandName}™ | Graphics House">
<meta property="og:description" content="${t.desc}">
<meta property="og:image" content="${BASE}/assets/${product.og}">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<style>${PAGE_CSS}
  .ar-feat-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(10,10,10,.06)}
  .ar-feat-row .ms{color:#C9A84C;font-size:20px}
  .ar-feat-row p{margin:0;font-size:14px;color:#1A1A1A;line-height:1.55}
</style>
<script defer src="../assets/site-header.js?v=16"></script>
<script defer src="../assets/gh-performance.js?v=8"></script>
<script defer src="../assets/lang-switch.js?v=2"></script>
<script defer src="../assets/project-launch-media.js?v=3"></script>
<link rel="stylesheet" href="../assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="../assets/gh-site-enhancements.css?v=23">
<link rel="stylesheet" href="../assets/site-header.css?v=33">
<link rel="stylesheet" href="../assets/gh-legacy-service-theme.css?v=3">
<link rel="stylesheet" href="../assets/solution-premium.css?v=2">
<link rel="stylesheet" href="../assets/gh-float-widgets.css?v=8">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${brandName}™`,
    description: t.desc,
    url: canonical,
    brand: { '@type': 'Brand', name: 'Graphics House' },
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body class="bg-background gl-premium selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
<div id="loader" aria-hidden="true">
  <img src="../assets/logo-gold.png" alt="" width="120" height="40" style="height:40px;width:auto">
  <div id="loader-bar-track"><div id="loader-bar"></div></div>
</div>
${header}
<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>

<section class="pl-hero relative overflow-hidden">
  <div class="pl-hero-media">${pic(product.hero.src, product.hero.webp, heroAlt)}</div>
  <div class="pl-hero-vignette" aria-hidden="true"></div>
  <div class="pl-hero-bottom-glow" aria-hidden="true"></div>
  <div class="pl-hero-bottom-panel">
    <div class="pl-hero-copy-card">
      <span class="pl-hero-eyebrow-ar hero-enter" style="transition-delay:0ms">${t.eyebrow}</span>
      <h1 class="hero-enter" style="transition-delay:120ms" dir="ltr">${brandName}<span class="tm">™</span></h1>
      ${t.h1Ar ? `<p class="pl-hero-tagline hero-enter" style="transition-delay:160ms">${t.h1Ar}</p>` : ''}
      <p class="pl-hero-tagline hero-enter" style="transition-delay:200ms">${t.heroHeadline}</p>
      <p class="pl-hero-sub hero-enter" style="transition-delay:240ms">${t.heroLead}</p>
      <div class="hero-enter flex flex-wrap justify-center gap-4" style="transition-delay:360ms">
        <a href="${contact}" class="pl-btn-pill pl-btn-pill-white" data-cta="${ctaSlug}-hero-primary">${ctaPrimary}</a>
        <a href="${portfolio}" class="pl-btn-pill pl-btn-pill-ghost">${ctaSecondary}</a>
      </div>
    </div>
  </div>
</section>

<section class="gl-proof" aria-label="${isEn ? 'Proof points' : 'أرقام المنظومة'}">
  <div class="gl-proof-grid">${proofHtml}</div>
</section>

<section class="gl-gap">
  <div class="gl-gap-inner reveal" style="opacity:0;transform:translateY(20px)">
    <h2>${t.gapTitle}</h2>
    <p class="gl-gap-lead">${t.gapLead}</p>
    <ul class="gl-gap-list">${gapItems}</ul>
  </div>
</section>

${extras.pillars}

<section class="py-[100px] px-8 md:px-12">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
    <div class="reveal w-full md:w-1/2" style="opacity:0;transform:translateY(24px)">
      <span class="svc-tag mb-6 block">${t.overviewTag}</span>
      <h2 class="font-headline-xl text-on-background mb-6">${t.overviewTitle}</h2>
      <p class="font-body-lg text-secondary mb-8 opacity-80 leading-relaxed">${t.overviewLead}</p>
      <div>${features}</div>
      <div class="mt-10">
        <a href="${contact}" class="pl-btn-pill pl-btn-pill-white inline-flex" style="background:#0A0A0A;color:#fff;border:1.5px solid #0A0A0A" data-cta="${ctaSlug}-overview">${ctaPrimary}</a>
      </div>
    </div>
    <div class="reveal w-full md:w-1/2 relative" style="opacity:0;transform:translateY(24px);transition-delay:.15s">
      <div class="absolute -inset-3 border border-primary/20 pointer-events-none" style="transform:translate(12px,12px)"></div>
      <img class="relative z-10 w-full rounded-sm shadow-2xl" src="${product.overviewImg}" alt="${overviewAlt}" loading="lazy"/>
    </div>
  </div>
</section>

<section class="gl-outcomes">
  <div class="gl-outcomes-head reveal" style="opacity:0;transform:translateY(20px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${isEn ? 'Outcomes' : 'النتائج'}</span>
    <h2>${t.outcomesTitle}</h2>
    <p>${t.outcomesLead}</p>
  </div>
  <div class="gl-outcomes-grid">${outcomesHtml}</div>
</section>

${extras.compare}
${extras.deliverables}

<section class="gl-process-sec">
  <div class="text-center mb-12 reveal" style="opacity:0;transform:translateY(20px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.processEyebrow}</span>
    <h2 class="font-headline-xl text-on-background">${t.processTitle}</h2>
  </div>
  <div class="gl-steps">${process}</div>
</section>

${extras.audience}

<section class="py-[100px] px-8 md:px-12 max-w-container-max mx-auto">
  <div class="flex justify-between items-end mb-12 reveal" style="opacity:0;transform:translateY(20px)">
    <div>
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.portEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${t.portTitle}</h2>
    </div>
    <a href="${portfolio}" class="border-b border-primary text-primary pb-1 font-label-caps text-[11px] tracking-widest hidden md:block">${portAll}</a>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${cards}</div>
</section>

<section class="gl-vid-sec">
  <div class="text-center mb-10 px-8 reveal" style="opacity:0;transform:translateY(20px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.vidEyebrow}</span>
    <h2 class="font-headline-xl text-on-background mb-4">${t.vidTitle}</h2>
    <p class="font-body-lg text-secondary opacity-70 max-w-2xl mx-auto">${t.vidLead}</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-8 md:px-12">${videos}</div>
</section>

${extras.ecosystem}

<section class="gl-faq-sec">
  <div class="px-8 md:px-12 max-w-3xl mx-auto">
    <div class="text-center mb-12 reveal" style="opacity:0;transform:translateY(20px)">
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${faqEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${faqTitle}</h2>
    </div>
    <div class="reveal" style="opacity:0;transform:translateY(20px)">${faq}</div>
  </div>
</section>

<section class="gl-final">
  <div class="gl-final-inner reveal" style="opacity:0;transform:translateY(20px)">
    <span class="material-symbols-outlined ms-filled text-primary text-4xl mb-5 block">${product.icon}</span>
    <h2>${t.ctaTitle}</h2>
    <p>${t.ctaLead}</p>
    <a href="${contact}" class="pl-btn-pill pl-btn-pill-white" data-cta="${ctaSlug}-final">${ctaFinal}</a>
  </div>
</section>

${footer}
<button id="back-top" class="fixed bottom-8 right-6 z-50 w-11 h-11 bg-white border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" aria-label="${isEn ? 'Back to top' : 'العودة للأعلى'}"><span class="material-symbols-outlined text-xl">arrow_upward</span></button>
<script defer src="../assets/service-page.js?v=4"></script>
<script defer src="../assets/gh-float-widgets.js?v=8"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT, file), html, 'utf8');
  console.log('  wrote', file, '(premium)');
}

function buildPage(product, isEn) {
  if (product.premium) {
    buildPremiumPage(product, isEn);
    return;
  }
  const t = isEn ? product.en : product.ar;
  const file = isEn ? `${product.slug}-en.html` : `${product.slug}.html`;
  const canonical = `${BASE}/solutions/${file}`;
  const arUrl = `${BASE}/solutions/${product.slug}.html`;
  const enUrl = `${BASE}/solutions/${product.slug}-en.html`;
  const header = renderHeader(DEPTH, isEn);
  const footer = renderFooter(DEPTH, isEn);
  const contact = isEn ? '../contact-us-en.html' : '../contact-us.html';
  const portfolio = isEn ? '../portfolio-en.html' : '../portfolio.html';
  const cardLink = portfolio;
  const cardLinkLabel = isEn ? 'View portfolio →' : 'استعرض الأعمال ←';
  const skip = isEn ? 'Skip to main content' : 'تخطي إلى المحتوى الرئيسي';
  const ctaPrimary = isEn ? 'START YOUR PROJECT' : 'ابدأ مشروعك';
  const ctaSecondary = isEn ? 'VIEW PORTFOLIO' : 'استعرض أعمالنا';
  const portAll = isEn ? 'FULL PORTFOLIO' : 'كل الأعمال';
  const ytMore = isEn ? 'ALL VIDEOS ON YOUTUBE' : 'كل الفيديوهات على يوتيوب';
  const faqEyebrow = isEn ? 'FAQ' : 'الأسئلة الشائعة';
  const faqTitle = isEn ? 'Answers to common questions' : 'أجوبة عن استفساراتكم';
  const heroAlt = isEn ? product.hero.altEn : product.hero.altAr;
  const brandName = product.brandEn;
  const youtubeItems = product.youtube || [];

  const features = t.features
    .map(
      (f) =>
        `<div class="feat-row"><span class="material-symbols-outlined ms-filled">check_circle</span><div><p class="font-body-md text-secondary">${f}</p></div></div>`
    )
    .join('');

  const process = t.process
    .map(
      (p, i) => `<div class="reveal text-center" style="opacity:0;transform:translateY(24px);transition-delay:${(i * 0.12).toFixed(2)}s">
          <div class="w-12 h-12 border border-primary/40 flex items-center justify-center mx-auto mb-4 text-primary font-bold text-sm tracking-widest">${String(i + 1).padStart(2, '0')}</div>
          <p class="font-body-md text-secondary opacity-80 text-sm">${p}</p>
        </div>`
    )
    .join('');

  const cards = product.cards
    .map(
      (c, i) => `<div class="reveal group relative overflow-hidden border border-white/8 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1" style="opacity:0;transform:translateY(24px);transition-delay:${(0.05 + i * 0.07).toFixed(2)}s">
      <div class="aspect-[4/3] overflow-hidden"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${c.img}" alt="${isEn ? c.titleEn : c.titleAr}" loading="lazy"/></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="absolute bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-400">
        <h3 class="font-headline-md text-white mb-1">${isEn ? c.titleEn : c.titleAr}</h3>
        <a href="${cardLink}" class="text-primary text-xs tracking-widest">${cardLinkLabel}</a>
      </div>
    </div>`
    )
    .join('\n');

  const yt = youtubeItems
    .map(
      (v, i) => `<div class="reveal group relative overflow-hidden border border-white/8 hover:border-primary/40 transition-all duration-500" style="opacity:0;transform:translateY(24px);transition-delay:${(0.05 + i * 0.05).toFixed(2)}s">
      <div class="aspect-video overflow-hidden relative bg-black">
        <iframe
          class="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&playsinline=1&controls=0&modestbranding=1&rel=0&enablejsapi=1"
          title="${isEn ? v.titleEn : v.titleAr}"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
      <div class="p-5 bg-surface-container">
        <span class="text-primary text-[9px] font-bold tracking-widest uppercase mb-2 block">${isEn ? v.tagEn : v.tagAr}</span>
        <h3 class="font-headline-md text-on-background mb-1">${isEn ? v.titleEn : v.titleAr}</h3>
        <p class="text-secondary text-sm opacity-70">${isEn ? v.leadEn : v.leadAr}</p>
      </div>
    </div>`
    )
    .join('\n');

  const ytSection =
    youtubeItems.length === 0
      ? ''
      : `
<section class="py-[100px] px-8 md:px-12 max-w-container-max mx-auto border-t border-white/5">
  <div class="text-center mb-16 reveal" style="opacity:0;transform:translateY(24px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.ytEyebrow}</span>
    <h2 class="font-headline-xl text-on-background">${t.ytTitle}</h2>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${yt}</div>
  <div class="text-center mt-10 reveal" style="opacity:0;transform:translateY(24px)">
    <a href="https://www.youtube.com/@GraphicsHouse2" target="_blank" rel="noopener" class="border border-primary text-primary px-8 py-3 font-label-caps text-label-caps tracking-widest hover:bg-primary/10 transition-all inline-flex items-center gap-3">
      <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3.02 3.02 0 002.12 2.14C4.45 20.5 12 20.5 12 20.5s7.55 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
      ${ytMore}
    </a>
  </div>
</section>`;
  const vidGrid =
    product.videos.length === 1
      ? 'grid-cols-1 md:grid-cols-1 max-w-3xl mx-auto'
      : product.videos.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-3';

  const videos = product.videos
    .map(
      (v, i) => `<div class="reveal group relative overflow-hidden border border-white/8 hover:border-primary/40 transition-all duration-500" style="opacity:0;transform:translateY(24px);transition-delay:${(0.05 + i * 0.05).toFixed(2)}s">
      <div class="aspect-video overflow-hidden relative bg-black">
        <video class="w-full h-full object-cover gh-autoplay" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="${v.poster}">
          <source src="${v.src}" type="video/mp4">
        </video>
      </div>
      <div class="p-5 bg-surface-container">
        <span class="text-primary text-[9px] font-bold tracking-widest uppercase mb-2 block">${isEn ? v.tagEn : v.tagAr}</span>
        <h3 class="font-headline-md text-on-background mb-1">${isEn ? v.titleEn : v.titleAr}</h3>
        <p class="text-secondary text-sm opacity-70">${isEn ? v.leadEn : v.leadAr}</p>
      </div>
    </div>`
    )
    .join('\n');

  const faq = t.faq
    .map(
      ([q, a]) => `<div class="border-b border-white/5 py-6">
          <h4 class="font-headline-md text-on-background mb-3">${q}</h4>
          <p class="font-body-md text-secondary opacity-70 leading-relaxed">${a}</p>
        </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="../assets/gh-forms-config.js?v=2"></script>
${analyticsHeadTags('../')}
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${t.title}</title>
<meta name="description" content="${t.desc}"/>
<meta property="og:title" content="${brandName}™ | Graphics House">
<meta property="og:description" content="${t.desc}">
<meta property="og:image" content="${BASE}/assets/${product.og}">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<style>${PAGE_CSS}</style>
<script defer src="../assets/site-header.js?v=16"></script>
<script defer src="../assets/gh-performance.js?v=2"></script>
<script defer src="../assets/lang-switch.js?v=2"></script>
<link rel="stylesheet" href="../assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="../assets/gh-site-enhancements.css?v=23">
<link rel="stylesheet" href="../assets/site-header.css?v=31">
<link rel="stylesheet" href="../assets/gh-legacy-service-theme.css?v=3">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${brandName}™`,
    description: t.desc,
    url: canonical,
    brand: { '@type': 'Brand', name: 'Graphics House' },
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body class="bg-background selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
<div id="loader" aria-hidden="true">
  <img src="../assets/logo-gold.png" alt="" width="120" height="40" style="height:40px;width:auto">
  <div id="loader-bar-track"><div id="loader-bar"></div></div>
</div>
<a class="gh-skip-link" href="#main-content">${skip}</a>
${header}
<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>

<section class="pl-hero relative h-screen flex items-center justify-center overflow-hidden">
  <div id="hero-bg" class="absolute inset-x-0 -top-[10%] h-[120%] z-0">
    ${pic(product.hero.src, product.hero.webp, heroAlt)}
    <div class="svc-hero-scrim absolute inset-0"></div>
  </div>
  <div class="relative z-10 text-center max-w-5xl px-6">
    <div class="pl-hero-copy">
      <span class="pl-hero-eyebrow hero-enter font-label-caps text-label-caps tracking-[0.3em] mb-6 block" style="transition-delay:0ms">${t.eyebrow}</span>
      <h1 class="hero-enter text-[52px] md:text-[82px] leading-tight mb-6" style="transition-delay:120ms" dir="ltr">${brandName}<span class="tm">™</span></h1>
      ${t.h1Ar ? `<p class="pl-hero-ar hero-enter" style="transition-delay:160ms">${t.h1Ar}</p>` : ''}
      <p class="pl-hero-headline hero-enter" style="transition-delay:200ms">${t.heroHeadline}</p>
      <p class="pl-hero-lead hero-enter font-body-lg max-w-2xl mx-auto mb-12" style="transition-delay:240ms">${t.heroLead}</p>
      <div class="hero-enter flex flex-wrap justify-center gap-4 md:gap-6" style="transition-delay:360ms">
        <a href="${contact}" class="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] shadow-[0_0_20px_rgba(201,168,76,0.3)]">${ctaPrimary}</a>
        <a href="${portfolio}" class="pl-btn-ghost border border-primary px-8 py-4 font-label-caps text-label-caps tracking-widest transition-all">${ctaSecondary}</a>
      </div>
    </div>
  </div>
</section>

<section class="py-[120px] px-8 md:px-12">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
    <div class="reveal w-full md:w-1/2" style="opacity:0;transform:translateY(24px)">
      <span class="svc-tag mb-8 block">${t.overviewTag}</span>
      <h2 class="font-headline-xl text-on-background mb-8">${t.overviewTitle}</h2>
      <p class="font-body-lg text-secondary mb-10 opacity-80 leading-relaxed">${t.overviewLead}</p>
      <div class="space-y-1">${features}</div>
      <div class="mt-10 flex gap-6">
        <a href="${contact}" class="bg-primary text-on-primary px-8 py-4 font-label-caps text-[11px] tracking-widest hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] transition-all">${ctaPrimary}</a>
      </div>
    </div>
    <div class="reveal w-full md:w-1/2 relative" style="opacity:0;transform:translateY(24px);transition-delay:.2s">
      <div class="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4 pointer-events-none"></div>
      <img class="relative z-10 w-full shadow-2xl" src="${product.overviewImg}" alt="" loading="lazy"/>
    </div>
  </div>
</section>

<section class="py-[100px] bg-surface-container border-t border-white/5">
  <div class="px-8 md:px-12 max-w-container-max mx-auto">
    <div class="text-center mb-16 reveal" style="opacity:0;transform:translateY(24px)">
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.processEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${t.processTitle}</h2>
    </div>
    <div class="svc-process-grid grid grid-cols-2 md:grid-cols-4 gap-8 relative">${process}</div>
  </div>
</section>

<section class="py-[100px] px-8 md:px-12 max-w-container-max mx-auto">
  <div class="flex justify-between items-end mb-12 reveal" style="opacity:0;transform:translateY(24px)">
    <div>
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.portEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${t.portTitle}</h2>
    </div>
    <a href="${portfolio}" class="border-b border-primary text-primary pb-1 font-label-caps text-[11px] tracking-widest hover:text-white hover:border-white transition-colors hidden md:block">${portAll}</a>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">${cards}</div>
</section>

${ytSection}

<section class="py-[100px] px-8 md:px-12 max-w-container-max mx-auto border-t border-white/5 bg-surface-container">
  <div class="text-center mb-6 reveal" style="opacity:0;transform:translateY(24px)">
    <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${t.vidEyebrow}</span>
    <h2 class="font-headline-xl text-on-background mb-4">${t.vidTitle}</h2>
    <p class="font-body-lg text-secondary opacity-70 max-w-2xl mx-auto">${t.vidLead}</p>
  </div>
  <div class="grid ${vidGrid} gap-6 mt-12">${videos}</div>
</section>

<section class="py-[100px] bg-surface-container-lowest border-t border-white/5">
  <div class="px-8 md:px-12 max-w-4xl mx-auto">
    <div class="text-center mb-16 reveal" style="opacity:0;transform:translateY(24px)">
      <span class="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block">${faqEyebrow}</span>
      <h2 class="font-headline-xl text-on-background">${faqTitle}</h2>
    </div>
    <div class="reveal" style="opacity:0;transform:translateY(24px)">${faq}</div>
  </div>
</section>

<section class="py-24 text-center border-t border-white/5 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3"></div>
  <div class="relative z-10 max-w-2xl mx-auto px-8">
    <span class="material-symbols-outlined ms-filled text-primary text-4xl mb-6 block">${product.icon}</span>
    <h2 class="font-headline-xl text-on-background mb-6">${t.ctaTitle}</h2>
    <p class="font-body-lg text-secondary opacity-70 mb-10">${t.ctaLead}</p>
    <a href="${contact}" class="bg-primary text-on-primary px-12 py-5 font-label-caps text-label-caps tracking-[0.3em] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] transition-all inline-block">${isEn ? 'START YOUR PROJECT NOW' : 'ابدأ مشروعك الآن'}</a>
  </div>
</section>

${footer}
<button id="back-top" class="fixed bottom-8 right-6 z-50 w-11 h-11 bg-surface-container-high border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all" aria-label="Back to top"><span class="material-symbols-outlined text-xl">arrow_upward</span></button>
<script defer src="../assets/service-page.js?v=4"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(OUT, file), html, 'utf8');
  console.log('  wrote', file);
}

console.log('Building solution flagship pages…');
for (const product of PRODUCTS) {
  // ProjectLaunch AR + EN are hand-crafted peers (same design, bilingual copy).
  // Do not regenerate them here. Ads LP: build-project-launch-lp-ar.mjs
  // EN rebuild from AR (optional): build-project-launch-en-from-ar.mjs
  if (product.slug === 'project-launch') {
    console.log('  skip project-launch (hand-crafted AR + EN)');
    continue;
  }
  buildPage(product, false);
  buildPage(product, true);
}
console.log('Done.');
