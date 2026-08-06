#!/usr/bin/env node
/**
 * Agency Partner Network™ — premium B2B partnership landing (AR + EN).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHeader, renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://3dgraphicshouse.com';
const MWL_VIDEO = 'H66KNP1sQCk';

const COPY = {
  ar: {
    lang: 'ar',
    dir: 'rtl',
    canonical: `${BASE}/partner-network.html`,
    altEn: `${BASE}/partner-network-en.html`,
    altAr: `${BASE}/partner-network.html`,
    title: 'شبكة شركاء الوكالات™ | جرافيكس هاوس',
    description:
      'وسّع قدرات وكالتك من دون بناء فريق جديد — جرافيكس هاوس شريككم في الإنتاج البصري والتجريبي، لوكالات الإعلان والإبداع.',
    ogTitle: 'شبكة شركاء الوكالات™ — جرافيكس هاوس',
    brand: 'شبكة شركاء الوكالات™',
    heroH1: 'وسّع قدرات وكالتك.',
    heroH2: 'من دون أن تبني فريقًا جديدًا.',
    heroLead:
      'جرافيكس هاوس شريككم في تحويل المشاريع إلى تجارب بصرية ومادية — من الإظهار ثلاثي الأبعاد والأفلام السينمائية إلى المجسمات المعمارية والتجارب التفاعلية وبيئات العرض.',
    heroSupport: 'أنتم تحملون العلاقة مع العميل ورسالة المشروع.<br>ونحن نُضيف طبقة التنفيذ البصري والتجريبي.',
    heroCtaPrimary: 'ابدأوا محادثة شراكة',
    heroCtaSecondary: 'استكشفوا قدراتنا',
    heroImgAlt: 'إنتاج بصري وتجريبي — جرافيكس هاوس',
    heroImg: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
    heroWebp: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
    ideaTitle: 'امتداد لقدراتكم، لا بديلًا عنها.',
    ideaSub: 'شريك متخصص يُكمل ما تبنونه.',
    ideaBody:
      'جرافيكس هاوس لا تأتي لتنافس، بل لتعمل كامتداد متخصص لفريقكم، وتوفّر القدرات الإنتاجية التي قد لا ترغب وكالتكم في بنائها داخليًا.',
    ideaList: ['الإظهار ثلاثي الأبعاد', 'الأفلام السينمائية', 'المجسمات المعمارية', 'التجارب التفاعلية', 'العروض الرقمية', 'البيئات التجريبية'],
    ideaTail: 'يمكننا الانضمام في المرحلة التي تستدعي فيها وكالتكم هذه القدرات.',
    ideaHighlight: 'قدرات أوسع. فرص أرقى. من دون بنية جديدة.',
    fitTitle: 'فريقان. منظومة واحدة.',
    fitSub: 'تقسيم أدوار واضح — كل طرف في نطاق تخصصه.',
    fitAgency: {
      roleTitle: 'دور وكالة الدعاية والإعلان',
      headline: 'الاستراتيجية والتسويق والإبداع وإدارة العميل',
      items: ['الهوية', 'الحملات', 'الرسائل', 'المحتوى', 'تخطيط الإعلام', 'التسويق', 'إدارة العلاقة مع العميل'],
      icon: 'campaign',
    },
    fitGh: {
      roleTitle: 'دور جرافيكس هاوس',
      headline: 'التنفيذ البصري والتجريبي المتخصص',
      items: ['الإظهار ثلاثي الأبعاد', 'الأفلام', 'المجسمات', 'التجارب التفاعلية', 'الشاشات', 'المعارض', 'بيئات العرض'],
      icon: 'view_in_ar',
    },
    fitTogether: 'معًا',
    fitResult: 'حلّ أثرى لعملائكم.',
    valueTitle: 'ما الذي تضيفه الشراكة لوكالتكم؟',
    benefits: [
      { n: '01', title: 'وسّعوا عرضكم', desc: 'قدّموا لعملائكم قدرات بصرية وتجريبية متقدمة، من دون الحاجة إلى بناء قسم متخصص داخل الوكالة.' },
      { n: '02', title: 'ارفعوا قيمة مشاريعكم', desc: 'ادمجوا الإظهار ثلاثي الأبعاد والمجسمات والأفلام والتجارب التفاعلية في العروض والمشاريع ذات القيمة العالية.' },
      { n: '03', title: 'استجيبوا للموجزات المعقدة', desc: 'حين يتجاوز المشروع إطار الحملة إلى تجربة متكاملة، يكون لديكم شريك متخصص قادر على الانضمام بسرعة.' },
      { n: '04', title: 'خفّفوا التعقيد', desc: 'بدل تنسيق عدة موردين، شريك واحد يتولى طبقة الإنتاج بانسجام ووضوح.' },
      { n: '05', title: 'عزّزوا فرص الفوز', desc: 'ندعم العروض التقديمية التي تستحق تصورًا بصريًا ومنهجًا إنتاجيًا أكثر حضورًا.' },
      { n: '06', title: 'حافظوا على مرونتكم', desc: 'تعاونوا مع جرافيكس هاوس حسب الحاجة، من دون التزامات فريق دائم أو بنية إنتاج جديدة.' },
    ],
    capTitle: 'قدرات متخصصة.',
    capSub: 'تتكامل في خدمة مشروع واحد.',
    capFootH: 'شريك واحد متخصص.',
    capFootP: 'قدرات إنتاج متعددة.',
    capLearnMore: 'اكتشف المزيد',
    capabilities: [
      { tag: 'تصوّر', title: 'الإظهار المعماري ثلاثي الأبعاد', desc: 'تحويل المخططات والأفكار إلى تجارب بصرية واضحة ذات حضور.', href: 'services/rendering.html', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { tag: 'سرد', title: 'الأفلام السينمائية والرسوم المتحركة', desc: 'سرد بصري يمنح فكرة المشروع بعدًا عاطفيًا ومقنعًا.', href: 'services/animation.html', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { tag: 'بناء', title: 'المجسمات المعمارية', desc: 'مجسمات دقيقة ونماذج تقديمية تُقرّب المشروع من الواقع.', href: 'services/maquettes.html', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { tag: 'تفاعل', title: 'التجارب التفاعلية', desc: 'شاشات تفاعلية وتجارب لمس ورقمية تُشرك الجمهور.', href: 'services/interactive.html', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
      { tag: 'تجربة', title: 'البيئات المادية والتجريبية', desc: 'معارض وصالات عرض وتجارب مكانية تُكمل حضور المشروع.', href: 'services/interactive.html', img: 'assets/projects/pavilion1.jpg', webp: 'assets/projects/pavilion1.webp' },
    ],
    plEyebrow: 'نموذج على ما يمكننا بناؤه معًا',
    plTitle: 'Project Launch™',
    plSub: 'أحيوا مشروعكم قبل أن يُبنى.',
    plBody: 'Project Launch™ منظومة جرافيكس هاوس المتكاملة؛ تُمكّن المطورين وأصحاب المشاريع من رؤية مشاريعهم وفهمها وتجربتها قبل البناء.',
    plItems: ['الإظهار ثلاثي الأبعاد', 'الأفلام السينمائية', 'المجسمات المعمارية', 'التجارب التفاعلية', 'الشاشات الرقمية', 'بيئات العرض'],
    plQuote: 'تقود وكالتكم الاستراتيجية والتسويق والعلاقة مع العميل، بينما تتولى جرافيكس هاوس الطبقة البصرية والتجريبية المتخصصة.',
    plHref: 'solutions/project-launch.html',
    plCta: 'استكشفوا Project Launch™',
    pitchTitle: 'قبل أن يُرسى المشروع.',
    pitchSub: 'عزّزوا فرص الفوز منذ مرحلة العرض.',
    pitchBody: 'كثير من المشاريع تُحسم قبل التوقيع. وحين يتطلّب العرض التقديمي أو المقترح تجربة بصرية أقوى — مجسمًا، فيلمًا، أو بيئة تفاعلية — يمكن لجرافيكس هاوس أن تنضم مبكرًا لتعزيز الجانب الإنتاجي من العرض.',
    pitchList: ['مفاهيم إبداعية', 'توجهات بصرية ثلاثية الأبعاد', 'مفاهيم مجسمات', 'مفاهيم تجربة', 'مناهج إنتاج', 'أصول العرض البصري'],
    pitchHighlight: 'انضموا إلينا في عرضكم القادم — حيث تتطلّب الفرصة أكثر من كلمات.',
    pitchCta: 'ناقشوا عرضًا تقديميًا',
    modelsTitle: 'آليات التعاون',
    models: [
      { n: '01', tag: 'إحالة', title: 'فرصة تناسب قدراتنا.', desc: 'تُعرّفوننا بالمشروع، ونحدّد معًا أنسب صيغة للتعاون.' },
      { n: '02', tag: 'تسليم مشترك', title: 'قيادتكم للعميل. تخصصنا في الإنتاج.', desc: 'نعمل ضمن فريق المشروع، بأدوار واضحة ومسؤوليات محددة.' },
      { n: '03', tag: 'علامة بيضاء', title: 'إنتاج خلف الكواليس عند الحاجة.', desc: 'يمكن تنظيم بعض المشاريع بصيغة العلامة البيضاء، وفق طبيعة المشروع والاتفاق، مع التزام كامل بالسرية وحماية علاقة العميل.' },
      { n: '04', tag: 'شريك مفضّل', title: 'شراكة مستمرة، لا مشروعًا واحدًا.', desc: 'للوكالات ذات الاحتياج المتكرر، نبني إطارًا طويل الأمد يشمل آلية العمل والأولوية والاستجابة.' },
    ],
    processTitle: 'من الموجز إلى التسليم',
    process: [
      { n: '01', title: 'تشاركونا الموجز', desc: 'احتياج العميل، السياق، والمخرجات المطلوبة.' },
      { n: '02', title: 'نحدّد الفرصة', desc: 'نبيّن أين تضيف جرافيكس هاوس أكبر قيمة للمشروع.' },
      { n: '03', title: 'نرسم نطاق الإنتاج', desc: 'المنهج، المخرجات، الجدول الزمني، والتكلفة.' },
      { n: '04', title: 'نُنتج', desc: 'فريق جرافيكس هاوس ينفّذ ويدير النطاق المتفق عليه.' },
      { n: '05', title: 'تُقدّمون الحل المتكامل', desc: 'تعود المخرجات إلى منظومة مشروعكم، جزءًا من الحل النهائي للعميل.' },
    ],
    caseEyebrow: 'خبرة مُنجزة.',
    caseTitle: 'لا وعودًا على الورق.',
    caseName: 'معرض رابطة العالم الإسلامي',
    caseTags: 'تجارب تفاعلية · مجسمات معمارية · بيئة عرض',
    caseBody: 'في مشروع معرض رابطة العالم الإسلامي، طوّرت جرافيكس هاوس ونفّذت عناصر بصرية وتجريبية جمعت المجسمات المعمارية والتجارب التفاعلية وبيئات العرض — لتحويل محتوى المؤسسة إلى تجربة يرى فيها الجمهور المشاريع ويفهمها ويتفاعل معها.',
    caseVideoCta: 'شاهدوا فيلم المشروع',
    caseHref: 'casestudy1.html',
    whyTitle: 'لماذا جرافيكس هاوس؟',
    whyItems: [
      { title: 'أكثر من 20 عامًا من الخبرة', sub: 'منذ 2004' },
      { title: 'مقرّنا في السعودية', sub: 'معرفة عميقة بالسوق السعودي والمنطقة.' },
      { title: 'تخصصات متعددة', sub: 'قدرات إنتاجية متنوعة تحت مظلة شريك واحد.' },
      { title: 'قابلية للتوسع', sub: 'فريق متخصص وشبكة قدرات تتسع مع حجم المشروع.' },
      { title: 'خبرة مشاريع متنوعة', sub: 'عقارية ومؤسسية وثقافية — معارض وتجارب.' },
      { title: 'نقطة اتصال واحدة', sub: 'تواصل واضح لإدارة نطاق جرافيكس هاوس.' },
    ],
    principlesTitle: 'شراكة قائمة على الثقة.',
    principles: [
      { title: 'حماية العميل', desc: 'علاقة العميل محفوظة وفق نموذج الشراكة المتفق عليه.' },
      { title: 'السرية', desc: 'اتفاقيات عدم الإفصاح متاحة للمشاريع التي تستدعي ذلك.' },
      { title: 'مسؤوليات واضحة', desc: 'تُحدَّد الأدوار والمخرجات قبل بدء التنفيذ.' },
      { title: 'إطار للتواصل', desc: 'يُدار التواصل مع عميل الشريك وفق الاتفاق بين الطرفين.' },
      { title: 'تسليم بمعايير عالية', desc: 'جرافيكس هاوس ملتزمة بجودة وتنفيذ نطاقها المتفق عليه.' },
    ],
    whoTitle: 'هل تناسب وكالتكم هذه الشراكة؟',
    whoItems: [
      { title: 'وكالات الدعاية والإعلان', desc: 'وكالات الحملات المتكاملة والاتصال الإبداعي.' },
      { title: 'الوكالات الإبداعية والعلامات', desc: 'استوديوهات إبداعية ووكالات بناء العلامات.' },
      { title: 'وكالات التسويق العقاري', desc: 'متخصصة في تسويق وعرض المشاريع العقارية.' },
      { title: 'وكالات التجارب والفعاليات', desc: 'تجارب مكانية وفعاليات وتنشيط.' },
      { title: 'مكاتب الهندسة والتصميم', desc: 'ترفع من مستوى تقديم المشاريع أمام العملاء.' },
      { title: 'الاتصال الحكومي والمؤسسي', desc: 'تحويل المبادرات والمشاريع إلى تجارب بصرية.' },
    ],
    finalCtaTitle: 'لنبنِ معًا ما هو أكبر.',
    finalCtaLead: 'مشروع، عرض تقديمي، أو عميل يستحق قدرات بصرية وتجريبية متقدمة؟',
    finalCtaSub: 'لنستكشف كيف يمكن لجرافيكس هاوس أن تكون امتدادًا متخصصًا لفريقكم.',
    finalCtaPrimary: 'ابدأوا محادثة الشراكة',
    finalCtaSecondary: 'أرسلوا موجز مشروع',
    formTitle: 'طلب شراكة وكالة',
    formSub: 'شاركونا نبذة عن وكالتكم وفرصة التعاون، وسيتواصل معكم فريق جرافيكس هاوس لاستكمال الخطوة التالية.',
    formSubject: 'طلب شراكة وكالة — AR',
    formNext: `${BASE}/partner-network.html?sent=1#inquiry`,
    fields: {
      name: 'الاسم الكامل',
      agency: 'اسم الوكالة',
      role: 'المنصب',
      email: 'البريد الإلكتروني',
      phone: 'الجوال',
      website: 'موقع الوكالة',
      partnership: 'ما نوع الشراكة التي تهمكم؟',
      clients: 'ما نوع عملائكم الرئيسي؟',
      message: 'أخبرونا عن فرصة التعاون',
    },
    partnershipOpts: [
      { id: 'referral', label: 'إحالة' },
      { id: 'co-delivery', label: 'تسليم مشترك' },
      { id: 'white-label', label: 'علامة بيضاء' },
      { id: 'preferred-partner', label: 'شريك مفضّل' },
      { id: 'pitch-support', label: 'دعم مشروع / عرض تقديمي' },
    ],
    clientOpts: [
      { id: 'real-estate', label: 'عقاري' },
      { id: 'government', label: 'حكومي' },
      { id: 'corporate', label: 'شركات' },
      { id: 'culture', label: 'ثقافة ومتاحف' },
      { id: 'hospitality', label: 'ضيافة' },
      { id: 'experiential', label: 'فعاليات وتجارب' },
      { id: 'other', label: 'أخرى' },
    ],
    messagePlaceholder: 'موجز المشروع، العرض التقديمي، أو تفاصيل فرصة التعاون…',
    submit: 'إرسال طلب الشراكة',
    sentMsg: 'شكرًا لتواصلكم. سيتواصل فريق الشراكات معكم خلال 24 ساعة عمل.',
    pageFootBrand: 'جرافيكس هاوس',
    pageFootTagline: 'نُجسّد المشاريع بصريًا، ونصنع تجارب تبقى.',
    pageFootLinks: 'Project Launch™ · الإظهار ثلاثي الأبعاد · أفلام · مجسمات · تفاعلي · إنتاج تجريبي',
    langSwitch: 'English',
    langHref: 'partner-network-en.html',
  },
  en: {
    lang: 'en',
    dir: 'ltr',
    canonical: `${BASE}/partner-network-en.html`,
    altEn: `${BASE}/partner-network-en.html`,
    altAr: `${BASE}/partner-network.html`,
    title: 'Agency Partner Network™ | Graphics House',
    description:
      'Expand your agency without building a new team — Graphics House is your specialist visual and experiential production partner.',
    ogTitle: 'Agency Partner Network™ — Graphics House',
    brand: 'Agency Partner Network™',
    heroH1: 'Expand your agency.',
    heroH2: 'Without building a new team.',
    heroLead:
      'Graphics House is your specialist visual and experiential production partner — adding to your agency the 3D, cinematic film, architectural maquette, interactive, and presentation capabilities your clients need.',
    heroSupport: 'You own the client and the strategy.<br>We add the visual and experiential production layer.',
    heroCtaPrimary: 'Start partnership conversation',
    heroCtaSecondary: 'Explore our capabilities',
    heroImgAlt: 'Visual and experiential production — Graphics House',
    heroImg: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
    heroWebp: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
    ideaTitle: "You don't need another agency.",
    ideaSub: 'You need a specialist partner.',
    ideaBody:
      'Graphics House does not compete for your client, strategy, or campaign. We work as a specialist extension of your team — providing production capabilities your agency may not need to build in-house.',
    ideaList: ['3D Visualization', 'Cinematic Films', 'Architectural Maquettes', 'Interactive Experiences', 'Digital Presentations', 'Experiential Environments'],
    ideaTail: 'We can join at the stage where your agency needs these capabilities.',
    ideaHighlight: 'More capabilities. More opportunities. No new department required.',
    fitTitle: 'Two teams. One system.',
    fitSub: 'Clear roles — each partner in their lane.',
    fitAgency: {
      roleTitle: "Advertising Agency's Role",
      headline: 'Strategy, marketing, creative direction, and client management',
      items: ['Branding', 'Campaigns', 'Messaging', 'Content', 'Media planning', 'Marketing', 'Client relationship management'],
      icon: 'campaign',
    },
    fitGh: {
      roleTitle: "Graphics House's Role",
      headline: 'Specialized visual and experiential production',
      items: ['3D', 'Films', 'Maquettes', 'Interactive experiences', 'Digital displays', 'Exhibitions', 'Presentation environments'],
      icon: 'view_in_ar',
    },
    fitTogether: 'Together',
    fitResult: 'A More Powerful Client Solution.',
    valueTitle: 'What your agency gains',
    benefits: [
      { n: '01', title: 'Expand your offering', desc: 'Deliver advanced visual and experiential capabilities without building a specialist department.' },
      { n: '02', title: 'Raise project value', desc: 'Bring 3D, maquettes, film, and interactive into high-value proposals and live projects.' },
      { n: '03', title: 'Respond to complex briefs', desc: 'When a project moves from campaign to integrated experience, you have a specialist who can move fast.' },
      { n: '04', title: 'Reduce complexity', desc: 'One partner managing our production layer instead of coordinating multiple vendors.' },
      { n: '05', title: 'Strengthen win rates', desc: 'We support pitches that need stronger visual direction or production approach.' },
      { n: '06', title: 'Stay flexible', desc: 'Use Graphics House when you need us — without permanent headcount or new infrastructure.' },
    ],
    capTitle: 'Specialist capabilities.',
    capSub: 'Connected around one project.',
    capFootH: 'One specialist partner.',
    capFootP: 'Multiple production capabilities.',
    capLearnMore: 'Learn more',
    capabilities: [
      { tag: 'VISUALIZE', title: '3D & Architectural Visualization', desc: 'Turn plans and ideas into clear, compelling visual experiences.', href: 'services/rendering-en.html', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { tag: 'TELL', title: 'Cinematic Films & Animation', desc: 'Cinematic film, CGI, animation, and motion graphics to tell the project story.', href: 'services/animation-en.html', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { tag: 'BUILD', title: 'Architectural Maquettes', desc: 'Precise architectural models, presentation models, and signature project maquettes.', href: 'services/maquettes-en.html', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { tag: 'INTERACT', title: 'Interactive Experiences', desc: 'Interactive screens, touch experiences, VR, and digital presentations.', href: 'services/interactive-en.html', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
      { tag: 'EXPERIENCE', title: 'Physical & Experiential Environments', desc: 'Exhibition environments, sales galleries, spatial experiences, and physical project elements.', href: 'services/interactive-en.html', img: 'assets/projects/pavilion1.jpg', webp: 'assets/projects/pavilion1.webp' },
    ],
    plEyebrow: 'An example of what we can build together',
    plTitle: 'Project Launch™',
    plSub: 'Bring Your Project to Life Before It Is Built.',
    plBody: 'Project Launch™ is Graphics House\'s integrated system helping developers and project owners see, understand, and experience their projects before they are built.',
    plItems: ['3D Visualization', 'Cinematic Films', 'Architectural Maquettes', 'Interactive Experiences', 'Digital Displays', 'Presentation Environments'],
    plQuote: 'Your agency leads strategy, marketing, and the client relationship — while Graphics House handles the specialist visual and experiential layer.',
    plHref: 'solutions/project-launch-en.html',
    plCta: 'Explore Project Launch™',
    pitchTitle: "Don't wait for the project.",
    pitchSub: 'Help your agency win it.',
    pitchBody: 'Some projects are decided before the contract is signed. When your pitch or proposal needs a stronger visual experience, maquette, film, or interactive environment, Graphics House can join early to strengthen the production side.',
    pitchList: ['Creative Concepts', '3D Visual Directions', 'Maquette Concepts', 'Experience Concepts', 'Production Approaches', 'Visual Presentation Assets'],
    pitchHighlight: 'Bring us into your next complex pitch.',
    pitchCta: 'Discuss a Pitch',
    modelsTitle: 'How we work together',
    models: [
      { n: '01', tag: 'REFERRAL', title: 'You have an opportunity that fits our capabilities.', desc: 'Introduce the project and we define the best way to collaborate.' },
      { n: '02', tag: 'CO-DELIVERY', title: 'You lead the client. We lead our specialty.', desc: 'We work as part of the project team with clear roles and responsibilities.' },
      { n: '03', tag: 'WHITE LABEL', title: 'Production support behind the scenes when needed.', desc: 'Some projects can be structured as white label per project nature and agreement, with full confidentiality and client relationship protection.' },
      { n: '04', tag: 'PREFERRED PARTNER', title: 'Ongoing partnership — not a one-off project.', desc: 'For agencies with recurring needs, we can build a long-term framework covering workflow, priority, pricing, and response.' },
    ],
    processTitle: 'From brief to delivery',
    process: [
      { n: '01', title: 'You Share the Brief', desc: 'You share the client need, context, and required outputs.' },
      { n: '02', title: 'We Define the Opportunity', desc: 'We identify where Graphics House adds the most value.' },
      { n: '03', title: 'We Build the Production Scope', desc: 'We define approach, deliverables, timeline, and cost.' },
      { n: '04', title: 'We Produce', desc: 'The Graphics House team executes and manages the agreed scope.' },
      { n: '05', title: 'You Deliver the Bigger Solution', desc: 'Outputs return to your project system as part of the final client solution.' },
    ],
    caseEyebrow: 'Real experience.',
    caseTitle: 'Not capabilities on paper alone.',
    caseName: 'Muslim World League Exhibition',
    caseTags: 'Interactive Experiences + Architectural Maquettes + Presentation Environment',
    caseBody: 'For the Muslim World League exhibition, Graphics House developed and delivered visual and experiential elements combining architectural maquettes, interactive experiences, and presentation environments — turning institutional content into something audiences could see, understand, and engage with.',
    caseVideoCta: 'Watch the Project Film',
    caseHref: 'case-study-mwl-en.html',
    whyTitle: 'Why Graphics House?',
    whyItems: [
      { title: 'Over 20 years of experience', sub: 'Since 2004' },
      { title: 'Saudi-Based', sub: 'Deep experience in Saudi Arabia and the region.' },
      { title: 'Multi-Disciplinary', sub: 'Multiple production disciplines under one partner.' },
      { title: 'Scalable', sub: 'Specialist team and expandable capability network by project size.' },
      { title: 'Project Experience', sub: 'Real estate, institutional, cultural, exhibition, and experiential projects.' },
      { title: 'One Point of Contact', sub: 'Clear contact for managing the Graphics House scope.' },
    ],
    principlesTitle: 'Partnership built on trust.',
    principles: [
      { title: 'Client Protection', desc: 'Client relationships are protected per the agreed partnership model.' },
      { title: 'Confidentiality', desc: 'NDA and confidentiality available for projects that require it.' },
      { title: 'Clear Responsibilities', desc: 'Roles and deliverables are defined before production starts.' },
      { title: 'No Unapproved Direct Contact', desc: 'No direct contact with the partner\'s client outside the agreed framework.' },
      { title: 'Professional Delivery', desc: 'Graphics House is accountable for quality and delivery of its agreed scope.' },
    ],
    whoTitle: 'Is this right for your agency?',
    whoItems: [
      { title: 'Advertising Agencies', desc: 'Advertising and integrated campaign agencies.' },
      { title: 'Creative & Branding Agencies', desc: 'Creative studios and brand-building agencies.' },
      { title: 'Real Estate Marketing Agencies', desc: 'Agencies focused on real estate marketing.' },
      { title: 'Experiential Agencies', desc: 'Experiential, events, and activation agencies.' },
      { title: 'Architecture & Design Firms', desc: 'Firms that need to elevate project presentation.' },
      { title: 'Government & Institutional Communications', desc: 'Organizations turning initiatives into visual experiences.' },
    ],
    finalCtaTitle: "Let's Build Something Bigger Together.",
    finalCtaLead: 'Have a project, pitch, or client that needs advanced visual and experiential capabilities?',
    finalCtaSub: 'Let\'s explore how Graphics House can become a specialist extension of your team.',
    finalCtaPrimary: 'Start partnership conversation',
    finalCtaSecondary: 'Send a project brief',
    formTitle: 'Agency Partnership Inquiry',
    formSub: 'Share a brief about your agency and the collaboration opportunity. Our team will reach out to discuss next steps.',
    formSubject: 'Agency Partnership Inquiry — EN',
    formNext: `${BASE}/partner-network-en.html?sent=1#inquiry`,
    fields: {
      name: 'Full Name',
      agency: 'Agency Name',
      role: 'Position',
      email: 'Email',
      phone: 'Phone',
      website: 'Agency Website',
      partnership: 'What type of partnership are you interested in?',
      clients: 'What type of clients do you mainly serve?',
      message: 'Tell us about the opportunity',
    },
    partnershipOpts: [
      { id: 'referral', label: 'Referral' },
      { id: 'co-delivery', label: 'Co-Delivery' },
      { id: 'white-label', label: 'White Label' },
      { id: 'preferred-partner', label: 'Preferred Partner' },
      { id: 'pitch-support', label: 'Project / Pitch Support' },
    ],
    clientOpts: [
      { id: 'real-estate', label: 'Real Estate' },
      { id: 'government', label: 'Government' },
      { id: 'corporate', label: 'Corporate' },
      { id: 'culture', label: 'Culture & Museums' },
      { id: 'hospitality', label: 'Hospitality' },
      { id: 'experiential', label: 'Events & Experiential' },
      { id: 'other', label: 'Other' },
    ],
    messagePlaceholder: 'Brief, pitch, or collaboration details…',
    submit: 'Submit Partnership Inquiry',
    sentMsg: 'Thank you. Our partnerships team will contact you within 24 business hours.',
    pageFootBrand: 'Graphics House',
    pageFootTagline: 'Visualizing Projects. Creating Experiences.',
    pageFootLinks: 'Project Launch™ · 3D Visualization · Films · Maquettes · Interactive · Experiential Production',
    langSwitch: 'العربية',
    langHref: 'partner-network.html',
  },
};

function li(items) {
  return items.map((x) => `<li>${x}</li>`).join('');
}

function chips(items) {
  return items.map((x) => `<span class="pn-chip">${x}</span>`).join('');
}

function roleChips(items) {
  return items.map((x) => `<span class="pn-role-chip">${x}</span>`).join('');
}

function renderRoleCard(role, variant) {
  return `
    <article class="pn-role pn-role--${variant}">
      <div class="pn-role-top">
        <span class="pn-role-icon material-symbols-outlined" aria-hidden="true">${role.icon}</span>
        <span class="pn-role-tag">${role.roleTitle}</span>
      </div>
      <h3 class="pn-role-head">${role.headline}</h3>
      <div class="pn-role-chips">${roleChips(role.items)}</div>
    </article>`;
}

function checkGroup(opts, prefix) {
  return opts
    .map(
      (o) => `
    <label class="pn-check">
      <input type="checkbox" name="${prefix}_${o.id}" value="Yes">
      <span>${o.label}</span>
    </label>`
    )
    .join('');
}

function buildPage(c) {
  const isEn = c.lang === 'en';
  const header = renderHeader(0, isEn);
  const footer = renderFooter(0, isEn);
  const ff = isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif";
  const ffH = isEn ? "'Inter', 'Tajawal', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif";

  const capHtml = c.capabilities
    .map((cap) => {
      const img = cap.webp
        ? `<picture><source srcset="${cap.webp}" type="image/webp"><img src="${cap.img}" alt="" loading="lazy"></picture>`
        : `<img src="${cap.img}" alt="" loading="lazy">`;
      return `
    <article class="pn-cap">
      <div class="pn-cap-media">${img}</div>
      <div class="pn-cap-body">
        <span class="pn-cap-tag">${cap.tag}</span>
        <h3>${cap.title}</h3>
        <p>${cap.desc}</p>
        <a href="${cap.href}" class="pn-cap-link" target="_blank" rel="noopener noreferrer">${c.capLearnMore} →</a>
      </div>
    </article>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="${c.lang}" dir="${c.dir}" class="scroll-smooth">
<head>
<script src="assets/gh-forms-config.js?v=2"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y67JVE898Z"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-Y67JVE898Z');</script>
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
<meta property="og:image" content="${BASE}/${c.heroImg}">
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
:root{--gold:#C9A84C;--gold-soft:rgba(201,168,76,.08);--ink:#141414;--muted:rgba(20,20,20,.58);--line:rgba(20,20,20,.08);--white:#FFF;--ivory:#FAFAF8}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body.gh-partner-network{font-family:${isEn ? "'Inter','Tajawal','IBM Plex Sans Arabic'" : "'Tajawal','IBM Plex Sans Arabic',-apple-system,BlinkMacSystemFont"},sans-serif;background:var(--ivory);color:var(--ink);-webkit-font-smoothing:antialiased;line-height:1.6}
.pn-wrap{max-width:1120px;margin:0 auto;padding:0 24px}
@media(min-width:768px){.pn-wrap{padding:0 48px}}
.pn-lang{position:fixed;top:calc(var(--gh-header-height,88px) + 12px);${isEn ? 'right' : 'left'}:20px;z-index:100;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.72);text-decoration:none;padding:7px 14px;background:rgba(8,12,10,.88);border:1px solid rgba(201,168,76,.22);border-radius:999px}
.pn-lang:hover{border-color:var(--gold);color:#fff}
.pn-sec{padding:88px 0}
.pn-sec--white{background:var(--white)}
.pn-sec--tight{padding:64px 0}
.pn-eye{display:block;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;font-family:${ff}}
.pn-h1{font-size:clamp(36px,5.5vw,58px);font-weight:300;line-height:1.12;letter-spacing:-.03em;font-family:${ffH}}
.pn-h2{font-size:clamp(28px,3.8vw,44px);font-weight:300;line-height:1.18;letter-spacing:-.025em;margin-bottom:14px;font-family:${ffH}}
.pn-h3{font-size:clamp(18px,2.2vw,22px);font-weight:700;line-height:1.35;font-family:${ffH}}
.pn-lead{font-size:clamp(17px,1.9vw,19px);line-height:1.85;color:var(--muted);max-width:640px;font-family:${ff}}
.pn-support{margin-top:22px;font-size:16px;line-height:1.9;font-weight:600;max-width:520px;font-family:${ff}}
.pn-hero{padding:calc(var(--gh-header-height,88px) + 48px) 0 72px;background:var(--white);border-bottom:1px solid var(--line)}
.pn-hero-grid{display:grid;grid-template-columns:1fr;gap:40px;align-items:center}
@media(min-width:960px){.pn-hero-grid{grid-template-columns:1.05fr .95fr;gap:56px}}
.pn-hero-copy{text-align:${isEn ? 'left' : 'right'}}
.pn-hero-sub{font-size:clamp(22px,3vw,32px);font-weight:300;margin-top:8px;color:var(--ink);font-family:${ffH}}
.pn-hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.pn-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:.04em;text-decoration:none;font-family:${ff};transition:.25s;border:1.5px solid transparent}
.pn-btn--primary{background:#080c0a;color:#fff}
.pn-btn--primary:hover{background:#1a1f1c;transform:translateY(-1px)}
.pn-btn--ghost{background:transparent;color:var(--ink);border-color:var(--line)}
.pn-btn--ghost:hover{border-color:var(--gold);color:var(--gold)}
.pn-hero-media{border-radius:20px;overflow:hidden;aspect-ratio:4/3;background:#eceae4;box-shadow:0 28px 72px rgba(0,0,0,.08),0 0 0 1px rgba(20,20,20,.04)}
.pn-hero-media img{width:100%;height:100%;object-fit:cover;display:block}
.pn-idea{text-align:${isEn ? 'left' : 'right'}}
.pn-idea-body{font-size:17px;line-height:1.95;color:var(--muted);max-width:720px;margin:20px 0;font-family:${ff}}
.pn-chips{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}
.pn-chip{padding:8px 14px;border:1px solid var(--line);border-radius:999px;font-size:12px;font-weight:600;background:var(--white);font-family:${ff}}
.pn-quote{margin-top:32px;padding:24px 28px;border-${isEn ? 'left' : 'right'}:3px solid var(--gold);background:var(--gold-soft);font-size:17px;font-weight:600;line-height:1.6;font-family:${ff}}
.pn-roles-sec{padding:96px 0;background:linear-gradient(180deg,var(--ivory) 0%,var(--white) 42%,var(--ivory) 100%);border-top:1px solid var(--line);border-bottom:1px solid var(--line);text-align:${isEn ? 'left' : 'right'}}
.pn-roles{display:grid;grid-template-columns:1fr;gap:20px;margin-top:44px;align-items:stretch}
@media(min-width:960px){.pn-roles{grid-template-columns:1fr 72px 1fr;gap:28px}}
.pn-role{position:relative;padding:40px 32px;border-radius:20px;background:var(--white);border:1px solid var(--line);box-shadow:0 18px 48px rgba(0,0,0,.04);display:flex;flex-direction:column;gap:18px;min-height:100%}
@media(min-width:768px){.pn-role{padding:44px 36px}}
.pn-role--agency{border-top:3px solid rgba(20,20,20,.12)}
.pn-role--gh{border-top:3px solid var(--gold);background:linear-gradient(165deg,var(--white) 0%,rgba(201,168,76,.07) 100%);box-shadow:0 22px 56px rgba(201,168,76,.1)}
.pn-role-top{display:flex;align-items:center;gap:12px}
.pn-role-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:var(--ivory);border:1px solid var(--line);font-size:22px;color:var(--gold);flex-shrink:0}
.pn-role--gh .pn-role-icon{background:rgba(201,168,76,.12);border-color:rgba(201,168,76,.22)}
.pn-role-tag{font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);line-height:1.45;font-family:${ff}}
.pn-role-head{font-size:clamp(19px,2.3vw,24px);font-weight:700;line-height:1.45;letter-spacing:-.02em;color:var(--ink);font-family:${ffH}}
.pn-role-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.pn-role-chip{padding:9px 14px;border-radius:999px;font-size:12px;font-weight:600;line-height:1.3;color:var(--ink);background:var(--ivory);border:1px solid var(--line);font-family:${ff}}
.pn-role--gh .pn-role-chip{background:rgba(255,255,255,.88);border-color:rgba(201,168,76,.18)}
.pn-roles-bridge{display:flex;align-items:center;justify-content:center;gap:0;padding:8px 0}
@media(min-width:960px){.pn-roles-bridge{flex-direction:column;padding:0;align-self:center}}
.pn-roles-bridge-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.45),transparent);max-width:80px}
@media(min-width:960px){.pn-roles-bridge-line{width:1px;height:48px;max-width:none;background:linear-gradient(180deg,transparent,rgba(201,168,76,.45),transparent)}}
.pn-roles-bridge-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:var(--white);border:1.5px solid rgba(201,168,76,.35);color:var(--gold);font-size:22px;font-weight:300;box-shadow:0 8px 24px rgba(201,168,76,.12);flex-shrink:0}
.pn-roles-result{margin-top:44px;padding:28px 32px;border-radius:16px;text-align:center;background:#080c0a;color:#fff}
.pn-roles-result em{display:block;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;font-family:${ff}}
.pn-roles-result strong{display:block;font-size:clamp(20px,2.8vw,28px);font-weight:700;line-height:1.35;font-family:${ffH}}
.pn-benefits{display:grid;grid-template-columns:1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-top:36px}
@media(min-width:640px){.pn-benefits{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-benefits{grid-template-columns:repeat(3,1fr)}}
.pn-benefit{padding:28px 24px;background:var(--white)}
.pn-benefit-n{font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--gold);margin-bottom:10px;font-family:${ff}}
.pn-benefit h3{font-size:16px;margin-bottom:8px}
.pn-benefit p{font-size:14px;line-height:1.75;color:var(--muted);font-family:${ff}}
.pn-cap{display:grid;grid-template-columns:1fr;gap:0;border-bottom:1px solid var(--line);padding:40px 0}
@media(min-width:768px){.pn-cap{grid-template-columns:280px 1fr;gap:40px;align-items:center}}
.pn-cap:last-child{border-bottom:none;padding-bottom:0}
.pn-cap-media{border-radius:12px;overflow:hidden;aspect-ratio:4/3;background:#eceae4}
.pn-cap-media img{width:100%;height:100%;object-fit:cover;display:block}
.pn-cap-tag{font-size:10px;font-weight:700;letter-spacing:.18em;color:var(--gold);margin-bottom:8px;display:block;font-family:${ff}}
.pn-cap-body h3{font-size:clamp(18px,2.2vw,22px);margin-bottom:10px}
.pn-cap-body p{font-size:15px;line-height:1.8;color:var(--muted);margin-bottom:12px;font-family:${ff}}
.pn-cap-link{font-size:13px;font-weight:700;color:var(--ink);text-decoration:none;font-family:${ff}}
.pn-cap-link:hover{color:var(--gold)}
.pn-cap-foot{margin-top:48px;text-align:center;padding-top:40px;border-top:1px solid var(--line)}
.pn-cap-foot h3{font-size:clamp(22px,3vw,30px);font-weight:700;margin-bottom:6px}
.pn-cap-foot p{font-size:16px;color:var(--muted);font-family:${ff}}
.pn-pl{padding:48px;border:1px solid var(--line);border-radius:20px;background:var(--white)}
.pn-pl-items{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0;list-style:none}
.pn-pl-items li{padding:8px 14px;background:var(--gold-soft);border-radius:999px;font-size:12px;font-weight:600;font-family:${ff}}
.pn-pl-quote{margin:24px 0;padding:20px 24px;background:var(--ivory);border-radius:12px;font-size:15px;line-height:1.85;color:var(--muted);font-family:${ff}}
.pn-pitch{padding:48px;border-radius:20px;background:#080c0a;color:#fff}
.pn-pitch .pn-h2,.pn-pitch .pn-h3{color:#fff}
.pn-pitch .pn-lead{color:rgba(255,255,255,.68)}
.pn-pitch-list{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0;list-style:none}
.pn-pitch-list li{padding:8px 14px;border:1px solid rgba(255,255,255,.18);border-radius:999px;font-size:12px;font-weight:600;font-family:${ff}}
.pn-pitch-highlight{font-size:clamp(22px,3vw,32px);font-weight:700;margin:28px 0 20px;line-height:1.25;font-family:${ffH}}
.pn-models{display:grid;grid-template-columns:1fr;gap:16px;margin-top:32px}
@media(min-width:640px){.pn-models{grid-template-columns:repeat(2,1fr)}}
.pn-model{padding:28px 24px;border:1px solid var(--line);border-radius:16px;background:var(--white)}
.pn-model-tag{font-size:10px;font-weight:700;letter-spacing:.14em;color:var(--gold);margin-bottom:8px;display:block;font-family:${ff}}
.pn-model h3{font-size:16px;margin-bottom:10px;line-height:1.45}
.pn-model p{font-size:14px;line-height:1.75;color:var(--muted);font-family:${ff}}
.pn-process{display:grid;grid-template-columns:1fr;gap:0;margin-top:32px;border:1px solid var(--line);border-radius:16px;overflow:hidden}
@media(min-width:768px){.pn-process{grid-template-columns:repeat(5,1fr)}}
.pn-step{padding:24px 20px;background:var(--white);border-bottom:1px solid var(--line)}
@media(min-width:768px){.pn-step{border-bottom:none;border-${isEn ? 'right' : 'left'}:1px solid var(--line)}.pn-step:first-child{border-${isEn ? 'left' : 'right'}:none}}
.pn-step:last-child{border:none}
.pn-step-n{font-size:11px;font-weight:700;color:var(--gold);margin-bottom:10px;font-family:${ff}}
.pn-step h3{font-size:14px;margin-bottom:8px;line-height:1.4}
.pn-step p{font-size:13px;line-height:1.65;color:var(--muted);font-family:${ff}}
.pn-case{display:grid;grid-template-columns:1fr;gap:32px;margin-top:36px}
@media(min-width:960px){.pn-case{grid-template-columns:1.1fr .9fr;align-items:start}}
.pn-case-media{border-radius:16px;overflow:hidden;background:#000;aspect-ratio:16/9}
.pn-case-media iframe{width:100%;height:100%;border:0;display:block}
.pn-case-img{margin-top:16px;border-radius:12px;overflow:hidden;aspect-ratio:16/10}
.pn-case-img img{width:100%;height:100%;object-fit:cover;display:block}
.pn-case-name{font-size:clamp(20px,2.6vw,26px);font-weight:700;margin:12px 0 6px;font-family:${ffH}}
.pn-case-tags{font-size:13px;font-weight:600;color:var(--gold);margin-bottom:14px;font-family:${ff}}
.pn-case-body{font-size:15px;line-height:1.9;color:var(--muted);margin-bottom:20px;font-family:${ff}}
.pn-case-link{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--ink);text-decoration:none;font-family:${ff}}
.pn-trust-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:32px}
@media(min-width:640px){.pn-trust-grid{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-trust-grid{grid-template-columns:repeat(3,1fr)}}
.pn-trust{padding:24px;border:1px solid var(--line);border-radius:14px;background:var(--white)}
.pn-trust h3{font-size:15px;margin-bottom:6px}
.pn-trust p{font-size:13px;line-height:1.65;color:var(--muted);font-family:${ff}}
.pn-principles{display:flex;flex-direction:column;gap:0;margin-top:32px;border:1px solid var(--line);border-radius:16px;overflow:hidden}
.pn-principle{padding:22px 28px;background:var(--white);border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr;gap:8px}
@media(min-width:640px){.pn-principle{grid-template-columns:220px 1fr;gap:24px;align-items:baseline}}
.pn-principle:last-child{border-bottom:none}
.pn-principle h3{font-size:14px;font-weight:700;font-family:${ff}}
.pn-principle p{font-size:14px;line-height:1.75;color:var(--muted);font-family:${ff}}
.pn-who{display:grid;grid-template-columns:1fr;gap:12px;margin-top:32px}
@media(min-width:640px){.pn-who{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-who{grid-template-columns:repeat(3,1fr)}}
.pn-who-item{padding:22px 20px;border:1px solid var(--line);border-radius:14px;background:var(--white)}
.pn-who-item h3{font-size:14px;margin-bottom:6px}
.pn-who-item p{font-size:13px;line-height:1.65;color:var(--muted);font-family:${ff}}
.pn-final{text-align:center;padding:96px 0;background:var(--white);border-top:1px solid var(--line)}
.pn-final .pn-h2{margin-bottom:16px}
.pn-final .pn-lead{margin:0 auto 8px;max-width:560px}
.pn-final-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:32px}
.pn-form-sec{padding:80px 0 100px;background:var(--ivory)}
.pn-form-box{max-width:720px;margin:0 auto;background:var(--white);border:1px solid var(--line);border-radius:20px;padding:44px 32px;box-shadow:0 20px 60px rgba(0,0,0,.04)}
@media(min-width:768px){.pn-form-box{padding:52px 48px}}
.pn-form-head{margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--line);text-align:${isEn ? 'left' : 'right'}}
.pn-form-head h2{font-size:clamp(24px,3vw,32px);font-weight:700;margin-bottom:10px;font-family:${ffH}}
.pn-form-head p{font-size:15px;color:var(--muted);line-height:1.8;font-family:${ff}}
.pn-form-grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:640px){.pn-form-grid{grid-template-columns:1fr 1fr}}
.pn-form-grid .pn-field--full{grid-column:1/-1}
.pn-field{display:flex;flex-direction:column;gap:7px;text-align:${isEn ? 'left' : 'right'}}
.pn-field label{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:rgba(20,20,20,.52);font-family:${ff}}
.pn-field label .req{color:var(--gold)}
.pn-field input,.pn-field textarea{padding:14px 16px;font-size:15px;font-family:inherit;border:1.5px solid var(--line);border-radius:10px;background:#F7F6F3;color:var(--ink);outline:none;${isEn ? '' : 'text-align:right'}}
.pn-field input:focus,.pn-field textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.12);background:var(--white)}
.pn-field input[type=email],.pn-field input[type=tel],.pn-field input[type=url]{direction:ltr;text-align:left}
.pn-field textarea{min-height:140px;resize:vertical;line-height:1.7}
.pn-checks{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.pn-check{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid var(--line);border-radius:999px;font-size:13px;cursor:pointer;background:var(--ivory);font-family:${ff}}
.pn-check input{accent-color:var(--gold);width:16px;height:16px}
.pn-submit{width:100%;margin-top:8px;padding:17px 28px;font-size:14px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-family:inherit;cursor:pointer;background:#080c0a;color:#fff;border:none;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:10px}
.pn-submit:hover{background:#1a1f1c}
.pn-page-foot{padding:40px 0 48px;background:#080c0a;color:rgba(255,255,255,.72);text-align:center;border-top:1px solid rgba(255,255,255,.06)}
.pn-page-foot strong{display:block;color:#fff;font-size:15px;margin-bottom:8px;font-family:${ff}}
.pn-page-foot p{font-size:13px;line-height:1.7;font-family:${ff}}
.pn-page-foot-links{margin-top:12px;font-size:11px;letter-spacing:.06em;color:rgba(255,255,255,.48);font-family:${ff}}
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
    <div class="pn-hero-grid">
      <div class="pn-hero-copy">
        <span class="pn-eye">${c.brand}</span>
        <h1 class="pn-h1">${c.heroH1}</h1>
        <p class="pn-hero-sub">${c.heroH2}</p>
        <p class="pn-lead" style="margin-top:24px">${c.heroLead}</p>
        <p class="pn-support">${c.heroSupport}</p>
        <div class="pn-hero-actions">
          <a href="#inquiry" class="pn-btn pn-btn--primary">${c.heroCtaPrimary} <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_forward' : 'arrow_back'}</span></a>
          <a href="#capabilities" class="pn-btn pn-btn--ghost">${c.heroCtaSecondary} ↓</a>
        </div>
      </div>
      <div class="pn-hero-media"><picture><source srcset="${c.heroWebp}" type="image/webp"><img src="${c.heroImg}" alt="${c.heroImgAlt}" loading="eager"></picture></div>
    </div>
  </div>
</section>

<section class="pn-sec pn-idea">
  <div class="pn-wrap">
    <span class="pn-eye">02</span>
    <h2 class="pn-h2">${c.ideaTitle}</h2>
    <p class="pn-h3" style="font-weight:400;color:var(--muted);margin-bottom:0">${c.ideaSub}</p>
    <p class="pn-idea-body">${c.ideaBody}</p>
    <div class="pn-chips">${chips(c.ideaList)}</div>
    <p class="pn-idea-body" style="margin-top:0">${c.ideaTail}</p>
    <blockquote class="pn-quote">${c.ideaHighlight}</blockquote>
  </div>
</section>

<section class="pn-sec pn-roles-sec">
  <div class="pn-wrap">
    <span class="pn-eye">03</span>
    <h2 class="pn-h2">${c.fitTitle}</h2>
    <p class="pn-sub" style="margin-bottom:0">${c.fitSub}</p>
    <div class="pn-roles">
      ${renderRoleCard(c.fitAgency, 'agency')}
      <div class="pn-roles-bridge" aria-hidden="true">
        <span class="pn-roles-bridge-line"></span>
        <span class="pn-roles-bridge-icon">+</span>
        <span class="pn-roles-bridge-line"></span>
      </div>
      ${renderRoleCard(c.fitGh, 'gh')}
    </div>
    <div class="pn-roles-result"><em>${c.fitTogether}</em><strong>${c.fitResult}</strong></div>
  </div>
</section>

<section class="pn-sec">
  <div class="pn-wrap">
    <span class="pn-eye">04</span>
    <h2 class="pn-h2">${c.valueTitle}</h2>
    <div class="pn-benefits">${c.benefits.map((b) => `<article class="pn-benefit"><div class="pn-benefit-n">${b.n}</div><h3>${b.title}</h3><p>${b.desc}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-sec pn-sec--white" id="capabilities">
  <div class="pn-wrap">
    <span class="pn-eye">05</span>
    <h2 class="pn-h2">${c.capTitle}</h2>
    <p class="pn-h3" style="font-weight:400;color:var(--muted)">${c.capSub}</p>
    <div style="margin-top:36px">${capHtml}</div>
    <div class="pn-cap-foot"><h3>${c.capFootH}</h3><p>${c.capFootP}</p></div>
  </div>
</section>

<section class="pn-sec">
  <div class="pn-wrap">
    <span class="pn-eye">06</span>
    <p class="pn-eye" style="margin-bottom:12px">${c.plEyebrow}</p>
    <div class="pn-pl">
      <h2 class="pn-h2">${c.plTitle}</h2>
      <p class="pn-h3" style="font-weight:400;font-style:italic;color:var(--muted);margin:8px 0 0">${c.plSub}</p>
      <p class="pn-idea-body" style="margin-top:20px">${c.plBody}</p>
      <ul class="pn-pl-items">${li(c.plItems)}</ul>
      <p class="pn-pl-quote">${c.plQuote}</p>
      <a href="${c.plHref}" class="pn-btn pn-btn--primary" target="_blank" rel="noopener noreferrer">${c.plCta} →</a>
    </div>
  </div>
</section>

<section class="pn-sec pn-sec--white">
  <div class="pn-wrap">
    <span class="pn-eye">10</span>
    <p class="pn-eye" style="margin-bottom:8px">${c.caseEyebrow}</p>
    <h2 class="pn-h2">${c.caseTitle}</h2>
    <div class="pn-case">
      <div>
        <div class="pn-case-media"><iframe src="https://www.youtube.com/embed/${MWL_VIDEO}?rel=0&modestbranding=1" title="${c.caseName}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
        <div class="pn-case-img"><picture><source srcset="${c.heroWebp}" type="image/webp"><img src="${c.heroImg}" alt="${c.caseName}" loading="lazy"></picture></div>
      </div>
      <div>
        <h3 class="pn-case-name">${c.caseName}</h3>
        <p class="pn-case-tags">${c.caseTags}</p>
        <p class="pn-case-body">${c.caseBody}</p>
        <a href="${c.caseHref}" class="pn-case-link" target="_blank" rel="noopener noreferrer">${c.caseVideoCta} →</a>
      </div>
    </div>
  </div>
</section>

<section class="pn-sec">
  <div class="pn-wrap">
    <span class="pn-eye">07</span>
    <div class="pn-pitch">
      <h2 class="pn-h2">${c.pitchTitle}</h2>
      <p class="pn-h3" style="color:rgba(255,255,255,.85);font-weight:400;margin-bottom:16px">${c.pitchSub}</p>
      <p class="pn-lead">${c.pitchBody}</p>
      <ul class="pn-pitch-list">${li(c.pitchList)}</ul>
      <p class="pn-pitch-highlight">${c.pitchHighlight}</p>
      <a href="#inquiry" class="pn-btn pn-btn--primary">${c.pitchCta} →</a>
    </div>
  </div>
</section>

<section class="pn-sec pn-sec--white">
  <div class="pn-wrap">
    <span class="pn-eye">08</span>
    <h2 class="pn-h2">${c.modelsTitle}</h2>
    <div class="pn-models">${c.models.map((m) => `<article class="pn-model"><span class="pn-model-tag">${m.tag}</span><h3>${m.title}</h3><p>${m.desc}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-sec pn-sec--tight">
  <div class="pn-wrap">
    <span class="pn-eye">09</span>
    <h2 class="pn-h2">${c.processTitle}</h2>
    <div class="pn-process">${c.process.map((s) => `<article class="pn-step"><div class="pn-step-n">${s.n}</div><h3>${s.title}</h3><p>${s.desc}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-sec pn-sec--white">
  <div class="pn-wrap">
    <span class="pn-eye">11</span>
    <h2 class="pn-h2">${c.whyTitle}</h2>
    <div class="pn-trust-grid">${c.whyItems.map((w) => `<article class="pn-trust"><h3>${w.title}</h3><p>${w.sub}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-sec">
  <div class="pn-wrap">
    <span class="pn-eye">12</span>
    <h2 class="pn-h2">${c.principlesTitle}</h2>
    <div class="pn-principles">${c.principles.map((p) => `<article class="pn-principle"><h3>${p.title}</h3><p>${p.desc}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-sec pn-sec--white">
  <div class="pn-wrap">
    <span class="pn-eye">13</span>
    <h2 class="pn-h2">${c.whoTitle}</h2>
    <div class="pn-who">${c.whoItems.map((w) => `<article class="pn-who-item"><h3>${w.title}</h3><p>${w.desc}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-final">
  <div class="pn-wrap">
    <span class="pn-eye">14</span>
    <h2 class="pn-h2">${c.finalCtaTitle}</h2>
    <p class="pn-lead">${c.finalCtaLead}</p>
    <p class="pn-lead">${c.finalCtaSub}</p>
    <div class="pn-final-actions">
      <a href="#inquiry" class="pn-btn pn-btn--primary">${c.finalCtaPrimary} →</a>
      <a href="#inquiry" class="pn-btn pn-btn--ghost">${c.finalCtaSecondary} →</a>
    </div>
  </div>
</section>

<section class="pn-form-sec" id="inquiry">
  <div class="pn-wrap">
    <div class="pn-form-box">
      <div class="pn-form-head">
        <span class="pn-eye">15</span>
        <h2>${c.formTitle}</h2>
        <p>${c.formSub}</p>
      </div>
      <form class="gh-quote-form pn-form" action="https://formsubmit.co/info@3dgraphicshouse.com" method="POST">
        <input type="hidden" name="_subject" value="${c.formSubject}">
        <input type="hidden" name="_next" value="${c.formNext}">
        <div class="pn-form-grid">
          <div class="pn-field"><label for="pnName">${c.fields.name} <span class="req">*</span></label><input type="text" name="name" id="pnName" required autocomplete="name"></div>
          <div class="pn-field"><label for="pnAgency">${c.fields.agency} <span class="req">*</span></label><input type="text" name="agency_name" id="pnAgency" required autocomplete="organization"></div>
          <div class="pn-field"><label for="pnRole">${c.fields.role} <span class="req">*</span></label><input type="text" name="job_title" id="pnRole" required autocomplete="organization-title"></div>
          <div class="pn-field"><label for="pnEmail">${c.fields.email} <span class="req">*</span></label><input type="email" name="email" id="pnEmail" required autocomplete="email" placeholder="name@agency.com"></div>
          <div class="pn-field"><label for="pnPhone">${c.fields.phone} <span class="req">*</span></label><input type="tel" name="phone" id="pnPhone" required autocomplete="tel"></div>
          <div class="pn-field"><label for="pnWeb">${c.fields.website}</label><input type="url" name="agency_website" id="pnWeb" autocomplete="url" placeholder="https://"></div>
          <div class="pn-field pn-field--full">
            <label>${c.fields.partnership}</label>
            <div class="pn-checks">${checkGroup(c.partnershipOpts, 'partnership')}</div>
          </div>
          <div class="pn-field pn-field--full">
            <label>${c.fields.clients}</label>
            <div class="pn-checks">${checkGroup(c.clientOpts, 'clients')}</div>
          </div>
          <div class="pn-field pn-field--full">
            <label for="pnMessage">${c.fields.message}</label>
            <textarea name="message" id="pnMessage" placeholder="${c.messagePlaceholder}"></textarea>
          </div>
          <div class="pn-field pn-field--full">
            <div class="gh-form-security"><div class="gh-honeypot" aria-hidden="true"><label>Leave blank</label><input type="text" name="_honey" tabindex="-1" autocomplete="off"></div><div class="gh-turnstile"></div></div>
            <div class="form-feedback" aria-live="polite"></div>
          </div>
        </div>
        <button type="submit" class="form-submit pn-submit">${c.submit} →</button>
      </form>
    </div>
  </div>
</section>

<div class="pn-page-foot">
  <div class="pn-wrap">
    <strong>${c.pageFootBrand}</strong>
    <p>${c.pageFootTagline}</p>
    <p class="pn-page-foot-links">${c.pageFootLinks}</p>
  </div>
</div>

${footer}

<script defer src="assets/quote-form-config.js"></script>
<script defer src="assets/quote-form.js?v=3"></script>
<script defer src="assets/gh-float-widgets.js?v=8"></script>
<script>
(function(){
  var form=document.querySelector('.pn-form');
  if(form){
    form.addEventListener('submit',function(){
      if(typeof window.ghTrack==='function'){
        var checked=[].slice.call(form.querySelectorAll('input[type=checkbox]:checked')).map(function(el){return el.name;});
        window.ghTrack('partner_network_inquiry',{partnership_fields:checked.join(','),page_language:'${c.lang}'});
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
