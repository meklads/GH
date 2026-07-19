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
        poster: '../assets/projects/animation/real-estate-services.jpg',
        tagAr: 'مبيعات',
        tagEn: 'SALES',
        titleAr: 'فيلم يربط العرض بالصفقة',
        titleEn: 'Film that links offer to deal',
        leadAr: 'سرد يحوّل الاهتمام إلى فرصة مبيعات',
        leadEn: 'Storytelling that turns interest into a sales opportunity',
      },
    ],
    ar: {
      title: 'GrowthLaunch™ | نظام توليد العملاء والمبيعات | Graphics House',
      desc: 'نظام مبيعات متكامل — جذب، تحويل، وتوسيع العملاء المؤهلين مع التتبع وCRM وأتمتة الرد.',
      eyebrow: 'الحل',
      h1Ar: 'نظام توليد العملاء والمبيعات',
      heroHeadline: 'من أول نقرة إلى صفقة مغلقة — ابنِ نظام مبيعات لا حملة فقط',
      heroLead: 'جذب مؤهل، تحويل سريع، ومتابعة آلية في منظومة واحدةحدة.',
      overviewTag: 'الحل',
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
      ytEyebrow: '',
      ytTitle: '',
      vidEyebrow: 'أفلام وتسويق',
      vidTitle: 'محتوى يفتح المسار',
      vidLead: 'أفلام ومواد تسويقية تدعم الجذب والتحويل — لا مجسمات ولا إطلاق مشروع.',
      faq: [
        ['ماذا يشمل GrowthLaunch™؟', 'هيكلة العرض، الحملات، التتبع، الرد الآلي، ومسار CRM قابل للقياس.'],
        ['هل يناسب المطوّرين العقاريين؟', 'نعم — مصمم للمطورين وفرق B2B في الخليج.'],
        ['كم يستغرق الإطلاق؟', 'نحدد نطاقاً واضحاً ونبدأ بمسار قابل للقياس خلال أيام عمل قليلة.'],
      ],
      ctaTitle: 'جاهز لبناء مسار مبيعات متوقع؟',
      ctaLead: 'نرسم العرض والقنوات ومسار التحويل في جلسة واحدة.',
    },
    en: {
      title: 'GrowthLaunch™ | Lead Generation & Sales System | Graphics House',
      desc: 'A complete sales system — attract, convert, and scale qualified leads with tracking, CRM, and response automation.',
      eyebrow: 'Solution',
      h1Ar: '',
      heroHeadline: 'From first click to closed deal — build a sales system, not a campaign',
      heroLead: 'Qualified demand, fast conversion, and automated follow-up in one system.',
      overviewTag: 'Solution',
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
      vidLead: 'Marketing films and assets for demand and conversion — not launch models or exhibition systems.',
      faq: [
        ['What does GrowthLaunch™ include?', 'Offer architecture, campaigns, tracking, automated response, and a measurable CRM path.'],
        ['Is it built for real-estate developers?', 'Yes — designed for developers and B2B teams across the GCC.'],
        ['How fast can we launch?', 'We scope clearly and start a measurable path within a few working days.'],
      ],
      ctaTitle: 'Ready to build a predictable pipeline?',
      ctaLead: 'We map your offer, channels, and conversion path in one session.',
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
      ctaTitle: 'Ready to launch the complete system?',
      ctaLead: 'Our team can scope ProjectLaunch™ and share a clear proposal within 48 hours.',
    },
  },
  {
    key: 'brand',
    slug: 'brand-scale',
    brandEn: 'BrandScale',
    icon: 'workspace_premium',
    og: 'projects/rendering/The-Financial-Center-of-King-Abdullah-City.jpeg',
    hero: {
      src: '../assets/projects/rendering/The-Financial-Center-of-King-Abdullah-City.jpeg',
      webp: '../assets/projects/rendering/The-Financial-Center-of-King-Abdullah-City.webp',
      altAr: 'حضور مؤسسي يفرض الثقة',
      altEn: 'Institutional presence that commands trust',
    },
    overviewImg: '../assets/projects/rendering/The-Meteorological-Building.jpeg',
    cards: [
      { img: '../assets/news/makkah-charter-08.jpeg', titleAr: 'هوية في الفضاء', titleEn: 'Identity in space' },
      { img: '../assets/news/makkah-charter-10.jpeg', titleAr: 'لغة علامة متسقة', titleEn: 'Consistent brand language' },
      { img: '../assets/projects/rendering/jeddah-forum.jpg', titleAr: 'حضور يُشعر قبل أن يُقال', titleEn: 'Presence felt before it is spoken' },
    ],
    youtube: [],
    videos: [
      {
        src: '../assets/videos/GH-Marketing-Media-Production.mp4',
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
    ar: {
      title: 'BrandScale™ | نظام نمو العلامات التجارية | Graphics House',
      desc: 'ابنِ علامة تلهم الثقة — استراتيجية، هوية، وحضور مصمم للمطورين والمؤسسات.',
      eyebrow: 'الحل',
      h1Ar: 'نظام نمو العلامات التجارية',
      heroHeadline: 'من الاستراتيجية إلى حضور يفرض الثقة',
      heroLead: 'تموضع، هوية بصرية، وحضور رقمي في منظومة بصرية واحدة.',
      overviewTag: 'الحل',
      overviewTitle: 'هوية تصمد وتتوسع',
      overviewLead: 'BrandScale™ يبني نظام علامة واضح — من التموضع إلى التطبيقات — حتى تتراكم الثقة مع كل مشروع وحملة.',
      features: [
        'تموضع وهندسة رسائل',
        'نظام شعار وهوية بصرية',
        'أدلة استخدام واضحة للفريق',
        'حضور ويب ورقمي',
        'مواد متوافقة مع الإطلاق والنمو',
      ],
      process: ['استكشاف وتموضع', 'بناء نظام الهوية', 'تطبيقات رقمية ومطبوعة', 'إطلاق ومتابعة الاتساق'],
      processEyebrow: 'كيف نعمل',
      processTitle: 'المنهجية',
      portEyebrow: 'بيئات علامة',
      portTitle: 'حضور يُشعر قبل أن يُقال',
      ytEyebrow: '',
      ytTitle: '',
      vidEyebrow: 'هوية في الحركة',
      vidTitle: 'محتوى يحافظ على اللغة',
      vidLead: 'إنتاج يحمل نظام العلامة — لا مجسمات إطلاق ولا مسار مبيعات.',
      faq: [
        ['ماذا يشمل BrandScale™؟', 'تموضع، نظام هوية، أدلة استخدام، وحضور رقمي متماسك.'],
        ['هل يناسب المطوّرين والمؤسسات؟', 'نعم — مصمم للعلامات التي تحتاج ثقة السوق والاستمرارية.'],
        ['هل يرتبط مع ProjectLaunch وGrowthLaunch؟', 'نعم — الهوية تُسلَّم بلغة متوافقة مع الإطلاق ومسارات النمو.'],
      ],
      ctaTitle: 'جاهز لتوسيع علامتك؟',
      ctaLead: 'نصمم نظام هوية يصمد عبر المشاريع والحملات.',
    },
    en: {
      title: 'BrandScale™ | Brand Growth System | Graphics House',
      desc: 'Build a brand that inspires trust — strategy, identity, and presence designed for developers and institutions.',
      eyebrow: 'Solution',
      h1Ar: '',
      heroHeadline: 'From strategy to a presence that commands trust',
      heroLead: 'Positioning, visual identity, and digital presence in one coherent system.',
      overviewTag: 'Solution',
      overviewTitle: 'Identity that endures and scales',
      overviewLead: 'BrandScale™ builds a clear brand system — from positioning to applications — so trust compounds with every project and campaign.',
      features: [
        'Positioning and messaging architecture',
        'Logo system and visual identity',
        'Practical guidelines teams can use',
        'Web and digital presence',
        'Collateral aligned with launch and growth',
      ],
      process: ['Discovery and positioning', 'Identity system design', 'Digital and print applications', 'Launch and consistency follow-through'],
      processEyebrow: 'How we work',
      processTitle: 'Methodology',
      portEyebrow: 'Brand environments',
      portTitle: 'Presence felt before it is spoken',
      ytEyebrow: '',
      ytTitle: '',
      vidEyebrow: 'Brand in motion',
      vidTitle: 'Content that keeps the language',
      vidLead: 'Media that carries the brand system — not launch maquettes or sales funnels.',
      faq: [
        ['What does BrandScale™ include?', 'Positioning, identity system, guidelines, and a coherent digital presence.'],
        ['Is it for developers and institutions?', 'Yes — built for brands that need market trust and continuity.'],
        ['Does it connect with ProjectLaunch and GrowthLaunch?', 'Yes — identity is delivered in a language compatible with launch and growth systems.'],
      ],
      ctaTitle: 'Ready to scale your brand?',
      ctaLead: 'We design identity systems that hold across projects and campaigns.',
    },
  },
];

function pic(src, webp, alt, cls = 'w-full h-full object-cover') {
  if (webp) {
    return `<picture><source srcset="${webp}" type="image/webp"><img class="${cls}" src="${src}" alt="${alt}" loading="lazy"/></picture>`;
  }
  return `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy"/>`;
}

function buildPage(product, isEn) {
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
<link rel="stylesheet" href="../assets/gh-site-enhancements.css?v=21">
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
  // Arabic ProjectLaunch site page is hand-crafted (EN visuals + AR conversion);
  // EN still built here. Ads LP: build-project-launch-lp-ar.mjs
  if (product.slug === 'project-launch') {
    buildPage(product, true);
    continue;
  }
  buildPage(product, false);
  buildPage(product, true);
}
console.log('Done.');
