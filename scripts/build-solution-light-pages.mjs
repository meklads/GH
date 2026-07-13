#!/usr/bin/env node
/**
 * Premium light solution product pages — GrowthLaunch / ProjectLaunch / BrandScale
 * Three-stage narrative + curated site media. AR + EN.
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

const PRODUCTS = {
  growth: {
    slug: 'growth-launch',
    cssKey: 'growth',
    og: 'mm-growth.jpg',
    heroVideo: '../assets/videos/GH-Marketing-Media-Production.mp4',
    heroPoster: '../assets/mm-growth.jpg',
    en: {
      name: 'GrowthLaunch™',
      tag: 'Lead Generation & Sales System',
      title: 'GrowthLaunch™ | Lead Generation & Sales System | Graphics House',
      desc: 'A complete sales system — attract, convert, and scale qualified leads with tracking, CRM, and response automation.',
      headline: 'Stop buying campaigns.<br><em>Build a sales system.</em>',
      sub: 'From first click to closed deal — one integrated pipeline for developers and B2B teams across the GCC.',
      cardTitle: 'In 7 days',
      cardBody: 'A measurable lead journey: capture, qualify, respond, and convert — with visibility at every step.',
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
            type: 'video',
            src: '../assets/videos/GH-Marketing-Media-Production.mp4',
            poster: '../assets/mm-growth.jpg',
            caption: 'Marketing & media production — Graphics House',
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
            type: 'image',
            src: '../assets/projects/rendering/alrajhi3.jpeg',
            webp: '../assets/projects/rendering/alrajhi3.webp',
            caption: 'Sales-ready presentation environments',
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
            type: 'image',
            src: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg',
            webp: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp',
            caption: 'Systems built for landmark developments',
          },
        },
      ],
      proofEyebrow: 'Trusted by leading teams',
      proofLead: 'Client brands that rely on Graphics House for launch and growth systems.',
      bafTitle: 'Your situation — transformed',
      bafLead: 'Not just tools — a shift in how you capture and convert leads.',
      baf: [
        ['Ads without follow-up', 'Complete journey from click to call'],
        ['Slow manual responses', 'Instant WhatsApp & AI response'],
        ['Leads lost between staff', 'Organized CRM pipeline'],
        ['No conversion visibility', 'Full analytics & tracking'],
      ],
      ctaTitle: 'Ready to build a predictable pipeline?',
      ctaLead: 'Book a strategy session — we map your offer, channels, and conversion path in one workshop.',
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
      cardTitle: 'خلال 7 أيام',
      cardBody: 'رحلة عميل قابلة للقياس: جذب، تأهيل، رد، وتحويل — مع رؤية واضحة في كل خطوة.',
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
            type: 'video',
            src: '../assets/videos/GH-Marketing-Media-Production.mp4',
            poster: '../assets/mm-growth.jpg',
            caption: 'إنتاج تسويقي وإعلامي — جرافيكس هاوس',
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
            type: 'image',
            src: '../assets/projects/rendering/alrajhi3.jpeg',
            webp: '../assets/projects/rendering/alrajhi3.webp',
            caption: 'بيئات عرض جاهزة للمبيعات',
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
            type: 'image',
            src: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg',
            webp: '../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp',
            caption: 'أنظمة مبنية لمشاريع كبرى',
          },
        },
      ],
      proofEyebrow: 'يثق بنا قادة السوق',
      proofLead: 'علامات تعتمد على جرافيكس هاوس في أنظمة الإطلاق والنمو.',
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
    og: 'mm-project.jpg',
    heroVideo: '../assets/videos/GH-Real-estate-services.mp4',
    heroPoster: '../assets/mm-project.jpg',
    en: {
      name: 'ProjectLaunch™',
      tag: 'Real Estate Project Launch System',
      title: 'ProjectLaunch™ | Real Estate Project Launch | Graphics House',
      desc: 'Launch with confidence — cinematic CGI, smart maquettes, interactive experiences, and sales-ready collateral in one system.',
      headline: 'Launch the development<br><em>before it is built.</em>',
      sub: 'One studio for visualization, physical models, interactive sales tools, and launch collateral — aligned from day one.',
      cardTitle: 'One partner',
      cardBody: 'CGI film, maquettes, interactive screens, and booth systems — delivered as one coherent launch.',
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
              {
                src: '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg',
                webp: '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.webp',
                className: 'tall',
              },
              {
                src: '../assets/projects/rendering/Anan-Escan-Co.01.jpeg',
                webp: '../assets/projects/rendering/Anan-Escan-Co.01.webp',
              },
              {
                src: '../assets/projects/rendering/uae-e1745147961286.jpeg',
                webp: '../assets/projects/rendering/uae-e1745147961286.webp',
              },
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
              {
                src: '../assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
                className: 'tall',
              },
              { src: '../assets/projects/maquettes/alrajhi-maquette-01.jpeg' },
              { src: '../assets/news/makkah-charter-01.jpeg' },
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
            type: 'video',
            src: '../assets/videos/3D-Architectural-visualisation.mp4',
            poster: '../assets/mm-project.jpg',
            caption: 'Architectural visualization reel — Graphics House',
          },
        },
      ],
      proofEyebrow: 'Selected launch work',
      proofLead: 'From masterplans to sales galleries — assets that accelerate buyer confidence.',
      gallery: [
        '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg',
        '../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
        '../assets/projects/pavilion1.jpg',
        '../assets/projects/rendering/wahat-alsalam9-scaled.webp',
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
      ctaLead: 'We scope visualization, maquettes, interactive, and collateral as one coherent system.',
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
      cardTitle: 'شريك واحد',
      cardBody: 'فيلم CGI، مجسمات، شاشات تفاعلية، وأنظمة جناح — كإطلاق متماسك واحد.',
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
              {
                src: '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg',
                webp: '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.webp',
                className: 'tall',
              },
              {
                src: '../assets/projects/rendering/Anan-Escan-Co.01.jpeg',
                webp: '../assets/projects/rendering/Anan-Escan-Co.01.webp',
              },
              {
                src: '../assets/projects/rendering/uae-e1745147961286.jpeg',
                webp: '../assets/projects/rendering/uae-e1745147961286.webp',
              },
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
              {
                src: '../assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
                className: 'tall',
              },
              { src: '../assets/projects/maquettes/alrajhi-maquette-01.jpeg' },
              { src: '../assets/news/makkah-charter-01.jpeg' },
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
            type: 'video',
            src: '../assets/videos/3D-Architectural-visualisation.mp4',
            poster: '../assets/mm-project.jpg',
            caption: 'ريل التصور المعماري — جرافيكس هاوس',
          },
        },
      ],
      proofEyebrow: 'أعمال إطلاق مختارة',
      proofLead: 'من المخططات إلى صالات البيع — أصول تسرّع ثقة المشتري.',
      gallery: [
        '../assets/projects/rendering/Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg',
        '../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
        '../assets/projects/pavilion1.jpg',
        '../assets/projects/rendering/wahat-alsalam9-scaled.webp',
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
    og: 'mm-brand.jpg',
    heroVideo: '../assets/videos/GH-Marketing-Media-Production.mp4',
    heroPoster: '../assets/mm-brand.jpg',
    en: {
      name: 'BrandScale™',
      tag: 'Brand Growth System',
      title: 'BrandScale™ | Brand Growth System | Graphics House',
      desc: 'Build a brand that inspires trust — strategy, identity, and presence designed for developers and institutions.',
      headline: 'A brand that<br><em>commands trust.</em>',
      sub: 'From positioning to identity systems and market presence — built to scale across projects and channels.',
      cardTitle: 'Identity → Presence',
      cardBody: 'Strategy, visual system, guidelines, and digital presence — coherent enough to sell the next project.',
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
            src: '../assets/news/makkah-charter-04.jpeg',
            caption: 'Institutional environments — Muslim World League',
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
              { src: '../assets/news/makkah-charter-01.jpeg', className: 'tall' },
              { src: '../assets/news/makkah-charter-02.jpeg' },
              { src: '../assets/news/makkah-charter-07.jpeg' },
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
            type: 'video',
            src: '../assets/videos/GH-Marketing-Media-Production.mp4',
            poster: '../assets/mm-brand.jpg',
            caption: 'Brand & media production — Graphics House',
          },
        },
      ],
      proofEyebrow: 'Brand environments we shape',
      proofLead: 'Identity work delivered alongside visualization and interactive — one studio language.',
      gallery: [
        '../assets/news/makkah-charter-01.jpeg',
        '../assets/news/makkah-charter-03.jpeg',
        '../assets/news/makkah-charter-04.jpeg',
        '../assets/news/makkah-charter-08.jpeg',
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
      cardTitle: 'هوية ← حضور',
      cardBody: 'استراتيجية، نظام بصري، أدلة إرشادية، وحضور رقمي — متماسك بما يكفي لبيع المشروع التالي.',
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
            src: '../assets/news/makkah-charter-04.jpeg',
            caption: 'بيئات مؤسسية — رابطة العالم الإسلامي',
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
              { src: '../assets/news/makkah-charter-01.jpeg', className: 'tall' },
              { src: '../assets/news/makkah-charter-02.jpeg' },
              { src: '../assets/news/makkah-charter-07.jpeg' },
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
            type: 'video',
            src: '../assets/videos/GH-Marketing-Media-Production.mp4',
            poster: '../assets/mm-brand.jpg',
            caption: 'إنتاج العلامة والإعلام — جرافيكس هاوس',
          },
        },
      ],
      proofEyebrow: 'بيئات علامة نُشكّلها',
      proofLead: 'هوية تُسلَّم مع التصور والتفاعلي — لغة استوديو واحدة.',
      gallery: [
        '../assets/news/makkah-charter-01.jpeg',
        '../assets/news/makkah-charter-03.jpeg',
        '../assets/news/makkah-charter-04.jpeg',
        '../assets/news/makkah-charter-08.jpeg',
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

function pic(src, webp, alt, className) {
  const cls = className ? ` class="${className}"` : '';
  if (webp) {
    return `<picture><source srcset="${webp}" type="image/webp"><img${cls} src="${src}" alt="${alt}" loading="lazy"></picture>`;
  }
  return `<img${cls} src="${src}" alt="${alt}" loading="lazy">`;
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

function buildPage(productKey, lang) {
  const product = PRODUCTS[productKey];
  const isEn = lang === 'en';
  const t = isEn ? product.en : product.ar;
  const file = isEn ? `${product.slug}-en.html` : `${product.slug}.html`;
  const contact = isEn ? '../contact-us-en.html' : '../contact-us.html';
  const portfolio = isEn ? '../portfolio-en.html' : '../portfolio.html';
  const caseStudy = isEn ? '../case-study-mwl-en.html' : '../casestudy1.html';
  const secondaryHref =
    productKey === 'brand' ? caseStudy : portfolio;
  const canonical = `${BASE}/solutions/${file}`;
  const arUrl = `${BASE}/solutions/${product.slug}.html`;
  const enUrl = `${BASE}/solutions/${product.slug}-en.html`;
  const header = renderHeader(DEPTH, isEn);
  const footer = renderFooter(DEPTH, isEn);

  const stagesNav = t.stagesNav
    .map(
      (s) => `<a class="sol-stage-tab" href="#${s.id}"><span class="num">${s.num}</span><span class="label">${s.label}</span></a>`
    )
    .join('\n');

  const stagesHtml = t.stages
    .map((stage, i) => {
      const flip = stage.flip ? ' is-flip' : '';
      return `<section class="sol-stage" id="${stage.id}">
  <div class="sol-wrap">
    <div class="sol-stage-grid${flip}">
      <div>
        <div class="sol-stage-num">${stage.num}</div>
        <h2 class="sol-title">${stage.title}</h2>
        <p class="sol-lead">${stage.lead}</p>
        <ul class="sol-points">
          ${stage.points.map((p) => `<li><span class="material-symbols-outlined">check_circle</span><span>${p}</span></li>`).join('\n')}
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
    .map((src) => `<img src="${src}" alt="${t.name}" loading="lazy">`)
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
<link rel="stylesheet" href="../assets/gh-solution-light.css?v=1">
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
  <div class="sol-hero-media">
    <video autoplay muted loop playsinline poster="${product.heroPoster}">
      <source src="${product.heroVideo}" type="video/mp4">
    </video>
  </div>
  <div class="sol-hero-scrim"></div>
  <div class="sol-hero-inner">
    <div class="sol-wrap sol-hero-grid">
      <div>
        <div class="sol-eyebrow">${isEn ? 'Graphics House · Solutions' : 'جرافيكس هاوس · الحلول'}</div>
        <h1>${t.name.replace('™', '<span class="tm">™</span>')}</h1>
        <p class="sol-hero-tag">${t.tag}</p>
        <h2 class="sol-hero-headline">${t.headline}</h2>
        <p class="sol-hero-sub">${t.sub}</p>
        <div class="sol-actions">
          <a class="sol-btn sol-btn-gold" href="${contact}">${t.ctaPrimary}</a>
          <a class="sol-btn sol-btn-ghost" href="${secondaryHref}">${t.ctaSecondary}</a>
        </div>
      </div>
      <div class="sol-hero-card">
        <strong>${t.cardTitle}</strong>
        <p>${t.cardBody}</p>
      </div>
    </div>
  </div>
</section>

<nav class="sol-stages-nav" aria-label="${isEn ? 'Three stages' : 'ثلاث مراحل'}">
  <div class="sol-wrap sol-stages-nav-inner">
    ${stagesNav}
  </div>
</nav>

${stagesHtml}

<section class="sol-proof">
  <div class="sol-wrap">
    <div class="sol-proof-head">
      <div class="sol-eyebrow">${t.proofEyebrow}</div>
      <p class="sol-lead">${t.proofLead}</p>
    </div>
    <div class="sol-logos">${logos}</div>
    ${gallery ? `<div class="sol-gallery">${gallery}</div>` : ''}
  </div>
</section>

<section class="sol-baf-light">
  <div class="sol-wrap">
    <div class="sol-eyebrow">${isEn ? 'Before & After' : 'قبل وبعد'}</div>
    <h2 class="sol-title">${t.bafTitle}</h2>
    <p class="sol-lead">${t.bafLead}</p>
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

console.log('Building light solution product pages…');
for (const key of Object.keys(PRODUCTS)) {
  buildPage(key, 'en');
  buildPage(key, 'ar');
}
console.log('Done.');
