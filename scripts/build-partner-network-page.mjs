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

const CLIENT_LOGOS = [
  { src: 'assets/clients-logo/rafal.png', altAr: 'رفال', altEn: 'Rafal' },
  { src: 'assets/clients-logo/anan-eskan.png', altAr: 'عنان إسكان', altEn: 'Anan Iskan' },
  { src: 'assets/clients-logo/al-owla.png', altAr: 'الأولى', altEn: 'Al Oula' },
  { src: 'assets/clients-logo/aqarat.png', altAr: 'عقارات', altEn: 'Aqarat' },
  { src: 'assets/clients-logo/bn-zooma.png', altAr: 'بن زومة', altEn: 'Bin Zoma' },
  { src: 'assets/clients-logo/makyon.png', altAr: 'مكيون', altEn: 'Makklyoon' },
  { src: 'assets/clients-logo/oteck.png', altAr: 'أوتيك', altEn: 'Autek' },
  { src: 'assets/clients-logo/imc-150x150.png', altAr: 'IMC', altEn: 'IMC' },
];

const COPY = {
  ar: {
    lang: 'ar',
    dir: 'rtl',
    canonical: `${BASE}/partner-network.html`,
    altEn: `${BASE}/partner-network-en.html`,
    altAr: `${BASE}/partner-network.html`,
    title: 'شبكة شركاء الوكالات™ | جرافيكس هاوس',
    description:
      'توسيع قدرات الوكالة من دون بناء فريق جديد — جرافيكس هاوس شريك في الإنتاج البصري والتجريبي، لوكالات الإعلان والإبداع.',
    ogTitle: 'شبكة شركاء الوكالات™ — جرافيكس هاوس',
    brand: 'شبكة شركاء الوكالات™',
    heroH1: 'توسيع قدرات الوكالة.',
    heroH2: 'من دون بناء فريق جديد.',
    heroLead:
      'جرافيكس هاوس شريك في تحويل المشاريع إلى تجارب بصرية ومادية — من الإظهار ثلاثي الأبعاد والأفلام السينمائية إلى المجسمات المعمارية والتجارب التفاعلية وبيئات العرض.',
    heroSupport: 'الوكالة تحمل علاقة العميل ورسالة المشروع.<br>ونحن نُضيف طبقة التنفيذ البصري والتجريبي.',
    heroCtaPrimary: 'محادثة شراكة',
    heroCtaSecondary: 'القدرات المتخصصة',
    proofStats: [
      { value: '+20', label: 'عامًا من الخبرة', sub: 'منذ 2004' },
      { value: '5', label: 'تخصصات إنتاج', sub: 'شريك واحد — قدرات متعددة' },
      { value: '6', label: 'قطاعات رئيسية', sub: 'عقاري · حكومي · ثقافي · وغيرها' },
    ],
    proofLogosLabel: 'ثقة عملاء في المنطقة',
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
    valueTitle: 'ما تضيفه الشراكة لوكالتكم',
    valueSub: 'محاسن عملية — من دون التزامات بنية جديدة.',
    benefits: [
      { n: '01', title: 'توسيع العرض', desc: 'قدرة على تقديم حلول بصرية وتجريبية متقدمة لعملائكم، من دون الحاجة إلى بناء قسم متخصص داخل الوكالة.' },
      { n: '02', title: 'قيمة مضافة للمشاريع', desc: 'إدماج الإظهار ثلاثي الأبعاد والمجسمات والأفلام والتجارب التفاعلية في العروض والمشاريع ذات القيمة العالية.' },
      { n: '03', title: 'مواجهة الموجزات المعقدة', desc: 'حين يتجاوز المشروع إطار الحملة إلى تجربة متكاملة، يكون لديكم شريك متخصص قادر على الانضمام بسرعة.' },
      { n: '04', title: 'تخفيف التعقيد', desc: 'شريك واحد يتولى طبقة الإنتاج، بدل تنسيق عدة موردين متفرّقين.' },
      { n: '05', title: 'تعزيز فرص الفوز', desc: 'دعم العروض التقديمية التي تستحق تصورًا بصريًا ومنهجًا إنتاجيًا أكثر حضورًا.' },
      { n: '06', title: 'مرونة تشغيلية', desc: 'تعاون حسب الحاجة، من دون التزامات فريق دائم أو بنية إنتاج جديدة.' },
    ],
    capTitle: 'قدرات متخصصة.',
    capSub: 'تتكامل في خدمة مشروع واحد.',
    capFootH: 'شريك واحد متخصص.',
    capFootP: 'قدرات إنتاج متعددة.',
    capLearnMore: 'تفاصيل الخدمة',
    capabilities: [
      { tag: 'تصوّر', title: 'الإظهار المعماري ثلاثي الأبعاد', desc: 'تحويل المخططات والأفكار إلى تجارب بصرية واضحة ذات حضور.', href: 'services/rendering.html', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { tag: 'سرد', title: 'الأفلام السينمائية والرسوم المتحركة', desc: 'سرد بصري يمنح فكرة المشروع بعدًا عاطفيًا ومقنعًا.', href: 'services/animation.html', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { tag: 'بناء', title: 'المجسمات المعمارية', desc: 'مجسمات دقيقة ونماذج تقديمية تُقرّب المشروع من الواقع.', href: 'services/maquettes.html', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { tag: 'تفاعل', title: 'التجارب التفاعلية', desc: 'شاشات تفاعلية وتجارب لمس ورقمية تُشرك الجمهور.', href: 'services/interactive.html', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
      { tag: 'تجربة', title: 'البيئات المادية والتجريبية', desc: 'معارض وصالات عرض وتجارب مكانية تُكمل حضور المشروع.', href: 'services/interactive.html', img: 'assets/projects/pavilion1.jpg', webp: 'assets/projects/pavilion1.webp' },
    ],
    plEyebrow: 'مثال على مخرجات الشراكة',
    plTitle: 'Project Launch™',
    plSub: 'رؤية المشروع قبل البناء.',
    plBody: 'Project Launch™ منظومة متكاملة من جرافيكس هاوس؛ تمنح مشاريع عملائكم رؤيةً وفهمًا وتجربةً قبل مرحلة البناء.',
    plItems: ['الإظهار ثلاثي الأبعاد', 'الأفلام السينمائية', 'المجسمات المعمارية', 'التجارب التفاعلية', 'الشاشات الرقمية', 'بيئات العرض'],
    plQuote: 'الاستراتيجية والتسويق وعلاقة العميل في قيادة وكالتكم، والطبقة البصرية والتجريبية في نطاق جرافيكس هاوس.',
    plHref: 'solutions/project-launch.html',
    plCta: 'تعرّف على Project Launch™',
    pitchTitle: 'قبل أن يُرسى المشروع.',
    pitchSub: 'تعزيز فرص الفوز — منذ مرحلة العرض.',
    pitchBody: 'كثير من المشاريع تُحسم قبل التوقيع. وحين يتطلّب العرض أو المقترح تجربة بصرية أقوى — مجسمًا، فيلمًا، أو بيئة تفاعلية — يمكن لجرافيكس هاوس الانضمام مبكرًا لتعزيز الجانب الإنتاجي.',
    pitchList: ['مفاهيم إبداعية', 'توجهات بصرية ثلاثية الأبعاد', 'مفاهيم مجسمات', 'مفاهيم تجربة', 'مناهج إنتاج', 'أصول العرض البصري'],
    pitchHighlight: 'حين يتطلّب العرض أكثر من كلمات — دعم إنتاجي من مرحلة مبكرة.',
    pitchCta: 'طلب دعم عرض',
    modelsTitle: 'آليات التعاون',
    models: [
      { n: '01', tag: 'إحالة', title: 'فرصة تناسب قدراتنا.', desc: 'تعريف بالمشروع، وتحديد صيغة التعاون الأنسب.' },
      { n: '02', tag: 'تسليم مشترك', title: 'قيادتكم للعميل. تخصصنا في الإنتاج.', desc: 'نعمل ضمن فريق المشروع، بأدوار واضحة ومسؤوليات محددة.' },
      { n: '03', tag: 'علامة بيضاء', title: 'إنتاج خلف الكواليس عند الحاجة.', desc: 'يمكن تنظيم بعض المشاريع بصيغة العلامة البيضاء، وفق طبيعة المشروع والاتفاق، مع التزام كامل بالسرية وحماية علاقة العميل.' },
      { n: '04', tag: 'شريك مفضّل', title: 'شراكة مستمرة، لا مشروعًا واحدًا.', desc: 'للوكالات ذات الاحتياج المتكرر، نبني إطارًا طويل الأمد يشمل آلية العمل والأولوية والاستجابة.' },
    ],
    processTitle: 'من الموجز إلى التسليم',
    process: [
      { n: '01', title: 'مشاركة الموجز', desc: 'احتياج العميل، السياق، والمخرجات المطلوبة.' },
      { n: '02', title: 'تحديد الفرصة', desc: 'تحديد موضع أكبر قيمة في المشروع.' },
      { n: '03', title: 'نطاق الإنتاج', desc: 'المنهج، المخرجات، الجدول الزمني، والتكلفة.' },
      { n: '04', title: 'التنفيذ', desc: 'تنفيذ وإدارة النطاق المتفق عليه.' },
      { n: '05', title: 'تقديم الحل المتكامل', desc: 'عودة المخرجات إلى منظومة مشروعكم، جزءًا من الحل النهائي للعميل.' },
    ],
    caseEyebrow: 'خبرة مُنجزة.',
    caseTitle: 'لا وعودًا على الورق.',
    caseName: 'معرض رابطة العالم الإسلامي',
    caseTags: 'تجارب تفاعلية · مجسمات معمارية · بيئة عرض',
    caseBody: 'في مشروع معرض رابطة العالم الإسلامي، طوّرت جرافيكس هاوس ونفّذت عناصر بصرية وتجريبية جمعت المجسمات المعمارية والتجارب التفاعلية وبيئات العرض — لتحويل محتوى المؤسسة إلى تجربة يرى فيها الجمهور المشاريع ويفهمها ويتفاعل معها.',
    caseVideoCta: 'فيلم المشروع',
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
    finalCtaTitle: 'شراكة لما هو أكبر.',
    finalCtaLead: 'مشروع، عرض تقديمي، أو عميل يستحق قدرات بصرية وتجريبية متقدمة؟',
    finalCtaSub: 'جرافيكس هاوس — امتداد متخصص لفريقكم في المشاريع والعروض.',
    finalCtaPrimary: 'محادثة الشراكة',
    finalCtaSecondary: 'إرسال موجز مشروع',
    finalCtaDeck: 'ملخص الشراكة',
    formStepsTitle: 'ما الذي يحدث بعد الطلب؟',
    formSteps: [
      { n: '01', title: 'مراجعة أولية', desc: 'نراجع طلبكم خلال 24 ساعة عمل.' },
      { n: '02', title: 'محادثة تعارف', desc: 'مكالمة قصيرة لفهم الجهة وفرصة التعاون.' },
      { n: '03', title: 'تحديد المسار', desc: 'نقترح صيغة الشراكة أو الخطوة التالية المناسبة.' },
    ],
    deckCta: 'ملخص الشراكة',
    deckHref: 'partner-network-overview.html',
    deckNote: 'صفحة جاهزة للطباعة أو الحفظ كـ PDF — للمشاركة داخليًا.',
    formTitle: 'طلب شراكة وتعاون',
    formSub: 'نبذة عن جهتكم وفرصة التعاون — سيتواصل فريق الشراكات لاستكمال الخطوة التالية.',
    formSubject: 'طلب شراكة وتعاون — AR',
    formNext: `${BASE}/partner-network.html?sent=1#inquiry`,
    fields: {
      name: 'الاسم الكامل',
      agency: 'اسم الجهة',
      role: 'المنصب',
      email: 'البريد الإلكتروني',
      phone: 'الجوال',
      website: 'موقع الجهة',
      partnership: 'ما نوع الشراكة التي تهمكم؟',
      clients: 'ما نوع عملائكم الرئيسي؟',
      message: 'نبذة عن فرصة التعاون',
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
      'Expanding agency capabilities without building a new team — Graphics House is your specialist visual and experiential production partner.',
    ogTitle: 'Agency Partner Network™ — Graphics House',
    brand: 'Agency Partner Network™',
    heroH1: 'Expanding agency capabilities.',
    heroH2: 'Without building a new team.',
    heroLead:
      'Graphics House is your specialist visual and experiential production partner — adding to your agency the 3D, cinematic film, architectural maquette, interactive, and presentation capabilities your clients need.',
    heroSupport: 'You own the client and the strategy.<br>We add the visual and experiential production layer.',
    heroCtaPrimary: 'Partnership conversation',
    heroCtaSecondary: 'Specialist capabilities',
    proofStats: [
      { value: '20+', label: 'Years of experience', sub: 'Since 2004' },
      { value: '5', label: 'Production disciplines', sub: 'One partner — multiple capabilities' },
      { value: '6', label: 'Core sectors', sub: 'Real estate · Government · Culture · more' },
    ],
    proofLogosLabel: 'Trusted across the region',
    heroImgAlt: 'Visual and experiential production — Graphics House',
    heroImg: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg',
    heroWebp: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.webp',
    ideaTitle: 'An extension of your capabilities — not a replacement.',
    ideaSub: 'A specialist partner that completes what you build.',
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
    valueTitle: 'What the partnership adds to your agency',
    valueSub: 'Practical advantages — without new infrastructure.',
    benefits: [
      { n: '01', title: 'Expanding the offering', desc: 'The ability to deliver advanced visual and experiential solutions to your clients, without building a specialist department in-house.' },
      { n: '02', title: 'Added project value', desc: 'Integrating 3D, maquettes, film, and interactive into high-value proposals and live projects.' },
      { n: '03', title: 'Complex brief readiness', desc: 'When a project moves beyond campaign into integrated experience, a specialist partner ready to join quickly.' },
      { n: '04', title: 'Reduced complexity', desc: 'One partner for the production layer, instead of coordinating multiple vendors.' },
      { n: '05', title: 'Stronger win potential', desc: 'Support for pitches that deserve stronger visual direction and production approach.' },
      { n: '06', title: 'Operational flexibility', desc: 'Collaboration as needed — without permanent headcount or new production infrastructure.' },
    ],
    capTitle: 'Specialist capabilities.',
    capSub: 'Connected around one project.',
    capFootH: 'One specialist partner.',
    capFootP: 'Multiple production capabilities.',
    capLearnMore: 'Service details',
    capabilities: [
      { tag: 'VISUALIZE', title: '3D & Architectural Visualization', desc: 'Turn plans and ideas into clear, compelling visual experiences.', href: 'services/rendering-en.html', img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', webp: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.webp' },
      { tag: 'TELL', title: 'Cinematic Films & Animation', desc: 'Cinematic film, CGI, animation, and motion graphics to tell the project story.', href: 'services/animation-en.html', img: 'assets/projects/cinematic/video-1.jpg', webp: 'assets/projects/cinematic/video-1.webp' },
      { tag: 'BUILD', title: 'Architectural Maquettes', desc: 'Precise architectural models, presentation models, and signature project maquettes.', href: 'services/maquettes-en.html', img: 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg', webp: 'assets/projects/maquettes/anan-eskan-maquette-01.webp' },
      { tag: 'INTERACT', title: 'Interactive Experiences', desc: 'Interactive screens, touch experiences, VR, and digital presentations.', href: 'services/interactive-en.html', img: 'assets/projects/interactive-01.jpg', webp: 'assets/projects/interactive-01.webp' },
      { tag: 'EXPERIENCE', title: 'Physical & Experiential Environments', desc: 'Exhibition environments, sales galleries, spatial experiences, and physical project elements.', href: 'services/interactive-en.html', img: 'assets/projects/pavilion1.jpg', webp: 'assets/projects/pavilion1.webp' },
    ],
    plEyebrow: 'An example of what partnership can deliver',
    plTitle: 'Project Launch™',
    plSub: 'Project vision before construction.',
    plBody: 'Project Launch™ is Graphics House\'s integrated system — giving your clients vision, understanding, and experience of their projects before the build phase.',
    plItems: ['3D Visualization', 'Cinematic Films', 'Architectural Maquettes', 'Interactive Experiences', 'Digital Displays', 'Presentation Environments'],
    plQuote: 'Your agency leads strategy, marketing, and the client relationship — while Graphics House handles the specialist visual and experiential layer.',
    plHref: 'solutions/project-launch-en.html',
    plCta: 'Learn about Project Launch™',
    pitchTitle: 'Before the project is awarded.',
    pitchSub: 'Stronger win potential — from the pitch stage.',
    pitchBody: 'Many projects are decided before the contract is signed. When a pitch or proposal needs a stronger visual experience — maquette, film, or interactive environment — Graphics House can join early to strengthen the production layer.',
    pitchList: ['Creative Concepts', '3D Visual Directions', 'Maquette Concepts', 'Experience Concepts', 'Production Approaches', 'Visual Presentation Assets'],
    pitchHighlight: 'When the pitch demands more than words — early production support.',
    pitchCta: 'Pitch support inquiry',
    modelsTitle: 'How we work together',
    models: [
      { n: '01', tag: 'REFERRAL', title: 'An opportunity that fits our capabilities.', desc: 'Project introduction and defining the best collaboration model.' },
      { n: '02', tag: 'CO-DELIVERY', title: 'You lead the client. We lead our specialty.', desc: 'We work as part of the project team with clear roles and responsibilities.' },
      { n: '03', tag: 'WHITE LABEL', title: 'Production support behind the scenes when needed.', desc: 'Some projects can be structured as white label per project nature and agreement, with full confidentiality and client relationship protection.' },
      { n: '04', tag: 'PREFERRED PARTNER', title: 'Ongoing partnership — not a one-off project.', desc: 'For agencies with recurring needs, we can build a long-term framework covering workflow, priority, pricing, and response.' },
    ],
    processTitle: 'From brief to delivery',
    process: [
      { n: '01', title: 'Brief shared', desc: 'Client need, context, and required outputs.' },
      { n: '02', title: 'Opportunity defined', desc: 'Identifying where Graphics House adds the most value.' },
      { n: '03', title: 'Production scope', desc: 'Approach, deliverables, timeline, and cost.' },
      { n: '04', title: 'Production', desc: 'Execution and management of the agreed scope.' },
      { n: '05', title: 'Integrated delivery', desc: 'Outputs return to your project system as part of the final client solution.' },
    ],
    caseEyebrow: 'Real experience.',
    caseTitle: 'Not capabilities on paper alone.',
    caseName: 'Muslim World League Exhibition',
    caseTags: 'Interactive Experiences + Architectural Maquettes + Presentation Environment',
    caseBody: 'For the Muslim World League exhibition, Graphics House developed and delivered visual and experiential elements combining architectural maquettes, interactive experiences, and presentation environments — turning institutional content into something audiences could see, understand, and engage with.',
    caseVideoCta: 'Project film',
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
    finalCtaTitle: 'A partnership for something bigger.',
    finalCtaLead: 'A project, pitch, or client that needs advanced visual and experiential capabilities?',
    finalCtaSub: 'Graphics House — a specialist extension of your team for projects and pitches.',
    finalCtaPrimary: 'Partnership conversation',
    finalCtaSecondary: 'Send a project brief',
    finalCtaDeck: 'Partnership overview',
    formStepsTitle: 'What happens after you submit?',
    formSteps: [
      { n: '01', title: 'Initial review', desc: 'We review your inquiry within 24 business hours.' },
      { n: '02', title: 'Intro conversation', desc: 'A short call to understand your organization and the opportunity.' },
      { n: '03', title: 'Next step defined', desc: 'We propose the right partnership model or follow-up path.' },
    ],
    deckCta: 'Partnership overview',
    deckHref: 'partner-network-overview-en.html',
    deckNote: 'Print-ready page — save as PDF for internal sharing.',
    formTitle: 'Partnership & Collaboration Inquiry',
    formSub: 'A brief about your organization and the collaboration opportunity — our partnerships team will follow up with next steps.',
    formSubject: 'Partnership & Collaboration Inquiry — EN',
    formNext: `${BASE}/partner-network-en.html?sent=1#inquiry`,
    fields: {
      name: 'Full Name',
      agency: 'Organization Name',
      role: 'Position',
      email: 'Email',
      phone: 'Phone',
      website: 'Organization Website',
      partnership: 'What type of partnership are you interested in?',
      clients: 'What type of clients do you mainly serve?',
      message: 'Brief on the opportunity',
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

function renderProofStats(stats) {
  return stats
    .map(
      (s) => `
    <article class="pn-stat">
      <span class="pn-stat-value">${s.value}</span>
      <strong class="pn-stat-label">${s.label}</strong>
      <span class="pn-stat-sub">${s.sub}</span>
    </article>`
    )
    .join('');
}

function renderClientLogos(isEn) {
  const items = CLIENT_LOGOS.map(
    (l) => `<div class="pn-logo-item"><img src="${l.src}" alt="${isEn ? l.altEn : l.altAr}" loading="lazy"></div>`
  ).join('');
  return `<div class="pn-marquee" aria-hidden="false"><div class="pn-marquee-track"><div class="pn-marquee-set">${items}</div><div class="pn-marquee-set" aria-hidden="true">${items}</div></div></div>`;
}

function renderFormSteps(steps) {
  return steps
    .map(
      (s) => `
    <article class="pn-form-step">
      <span class="pn-form-step-n">${s.n}</span>
      <div><h3>${s.title}</h3><p>${s.desc}</p></div>
    </article>`
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
:root{--gold:#C9A84C;--gold-light:#E2C878;--gold-soft:rgba(201,168,76,.1);--gold-glow:rgba(201,168,76,.35);--ink:#141414;--dark:#080c0a;--muted:rgba(20,20,20,.58);--line:rgba(20,20,20,.08);--white:#FFF;--ivory:#FAFAF8;--radius:16px;--radius-lg:24px;--ease:cubic-bezier(.22,1,.36,1)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body.gh-partner-network{font-family:${isEn ? "'Inter','Tajawal','IBM Plex Sans Arabic'" : "'Tajawal','IBM Plex Sans Arabic',-apple-system,BlinkMacSystemFont"},sans-serif;background:var(--ivory);color:var(--ink);-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden}
body.gh-partner-network .gh-header{background:rgba(8,12,10,.72)!important;backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,168,76,.12)!important}
.pn-wrap{max-width:1180px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
@media(min-width:768px){.pn-wrap{padding:0 48px}}
.pn-lang{position:fixed;top:calc(var(--gh-header-height,88px) + 12px);${isEn ? 'right' : 'left'}:20px;z-index:100;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.82);text-decoration:none;padding:8px 16px;background:rgba(8,12,10,.78);backdrop-filter:blur(12px);border:1px solid rgba(201,168,76,.28);border-radius:999px;transition:border-color .25s var(--ease),color .25s var(--ease),box-shadow .25s var(--ease)}
.pn-lang:hover{border-color:var(--gold);color:#fff;box-shadow:0 0 24px rgba(201,168,76,.18)}
.pn-sec{padding:clamp(72px,10vw,112px) 0;position:relative}
.pn-sec--white{background:var(--white)}
.pn-sec--dark{background:var(--dark);color:#fff;border-top:1px solid rgba(201,168,76,.12);border-bottom:1px solid rgba(201,168,76,.08)}
.pn-sec--dark .pn-h2,.pn-sec--dark .pn-lead{color:#fff}
.pn-sec--dark .pn-lead{color:rgba(255,255,255,.68)}
.pn-sec--tight{padding:clamp(56px,8vw,80px) 0}
.pn-eye{display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:18px;font-family:${ff}}
.pn-eye::before{content:'';width:28px;height:1px;background:linear-gradient(90deg,transparent,var(--gold));opacity:.85}
.pn-sec--dark .pn-eye::before{background:linear-gradient(90deg,transparent,var(--gold-light))}
.pn-h1{font-size:clamp(38px,5.8vw,64px);font-weight:300;line-height:1.08;letter-spacing:-.035em;font-family:${ffH}}
.pn-h2{font-size:clamp(28px,3.8vw,46px);font-weight:300;line-height:1.16;letter-spacing:-.028em;margin-bottom:12px;font-family:${ffH}}
.pn-h3{font-size:clamp(18px,2.2vw,22px);font-weight:700;line-height:1.35;font-family:${ffH}}
.pn-sub{font-size:17px;line-height:1.85;color:var(--muted);max-width:620px;margin-top:8px;font-family:${ff}}
.pn-lead{font-size:clamp(17px,1.9vw,19px);line-height:1.88;color:var(--muted);max-width:640px;font-family:${ff}}
.pn-support{margin-top:22px;font-size:16px;line-height:1.9;font-weight:600;max-width:520px;font-family:${ff};color:rgba(255,255,255,.88)}
.pn-reveal{opacity:0;transform:translateY(28px);transition:opacity .85s var(--ease),transform .85s var(--ease)}
.pn-reveal.is-visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.pn-reveal{opacity:1;transform:none;transition:none}.pn-marquee-track{animation:none!important}}
.pn-hero{position:relative;padding:calc(var(--gh-header-height,88px) + 56px) 0 clamp(64px,8vw,96px);background:var(--dark);color:#fff;overflow:hidden;border-bottom:1px solid rgba(201,168,76,.14)}
.pn-hero-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 70% 20%,rgba(201,168,76,.14),transparent 55%),radial-gradient(ellipse 50% 40% at 10% 80%,rgba(201,168,76,.08),transparent 50%),linear-gradient(180deg,#0a0f0c 0%,#080c0a 100%)}
.pn-hero-bg::after{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 70% 60% at 50% 40%,#000 20%,transparent 75%)}
.pn-hero-grid{display:grid;grid-template-columns:1fr;gap:48px;align-items:center;position:relative;z-index:1}
@media(min-width:960px){.pn-hero-grid{grid-template-columns:1.02fr .98fr;gap:64px}}
.pn-hero-copy{text-align:${isEn ? 'left' : 'right'}}
.pn-hero .pn-eye{color:var(--gold-light)}
.pn-hero .pn-h1{color:#fff}
.pn-hero-sub{font-size:clamp(22px,3.2vw,34px);font-weight:300;margin-top:10px;color:var(--gold-light);font-family:${ffH}}
.pn-hero .pn-lead{color:rgba(255,255,255,.68);margin-top:24px}
.pn-hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
.pn-btn{display:inline-flex;align-items:center;gap:8px;padding:15px 28px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:.04em;text-decoration:none;font-family:${ff};transition:transform .3s var(--ease),box-shadow .3s var(--ease),background .3s var(--ease),border-color .3s var(--ease),color .3s var(--ease);border:1.5px solid transparent}
.pn-btn--primary{background:linear-gradient(135deg,var(--gold) 0%,#A8883A 100%);color:var(--dark);box-shadow:0 12px 32px rgba(201,168,76,.28)}
.pn-btn--primary:hover{transform:translateY(-2px);box-shadow:0 18px 40px rgba(201,168,76,.38)}
.pn-btn--ghost{background:rgba(255,255,255,.04);color:#fff;border-color:rgba(255,255,255,.18);backdrop-filter:blur(8px)}
.pn-btn--ghost:hover{border-color:var(--gold);color:var(--gold-light);background:rgba(201,168,76,.08)}
.pn-hero-media{position:relative}
.pn-hero-frame{position:relative;border-radius:var(--radius-lg);overflow:hidden;aspect-ratio:4/3;background:#1a1a18;box-shadow:0 32px 80px rgba(0,0,0,.45),0 0 0 1px rgba(201,168,76,.22)}
.pn-hero-frame::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(145deg,rgba(201,168,76,.55),transparent 40%,rgba(201,168,76,.25));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:2}
.pn-hero-frame img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s var(--ease)}
.pn-hero-frame:hover img{transform:scale(1.04)}
.pn-proof{padding:0;background:var(--white);border-bottom:1px solid var(--line);position:relative;margin-top:-1px}
.pn-proof-inner{padding:clamp(40px,6vw,56px) 0;border-top:1px solid rgba(201,168,76,.2);background:linear-gradient(180deg,#fff 0%,var(--ivory) 100%)}
.pn-stats{display:grid;grid-template-columns:1fr;gap:14px;margin-bottom:40px}
@media(min-width:640px){.pn-stats{grid-template-columns:repeat(3,1fr);gap:18px}}
.pn-stat{position:relative;padding:28px 24px;border-radius:var(--radius);background:var(--white);border:1px solid var(--line);text-align:${isEn ? 'left' : 'right'};overflow:hidden;transition:transform .35s var(--ease),box-shadow .35s var(--ease),border-color .35s var(--ease)}
.pn-stat::before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:linear-gradient(180deg,var(--gold),transparent);opacity:0;transition:opacity .35s var(--ease)}
html[dir=rtl] .pn-stat::before{inset:0 0 0 auto}
.pn-stat:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,.06);border-color:rgba(201,168,76,.28)}
.pn-stat:hover::before{opacity:1}
.pn-stat-value{display:block;font-size:clamp(34px,4.5vw,48px);font-weight:700;line-height:1;background:linear-gradient(135deg,var(--ink) 30%,#5a4a22);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-.04em;font-family:${ffH}}
.pn-stat-label{display:block;margin-top:10px;font-size:14px;font-weight:700;line-height:1.4;font-family:${ff}}
.pn-stat-sub{display:block;margin-top:4px;font-size:12px;line-height:1.65;color:var(--muted);font-family:${ff}}
.pn-logos-label{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);text-align:center;margin-bottom:22px;font-family:${ff}}
.pn-marquee{overflow:hidden;width:100%;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.pn-marquee-track{display:flex;width:max-content;align-items:center;direction:ltr;animation:pn-marquee 38s linear infinite;will-change:transform}
.pn-marquee-set{display:flex;align-items:center;flex-shrink:0}
.pn-logo-item{padding:0 32px;flex-shrink:0}
.pn-logo-item img{height:42px;width:auto;display:block;filter:grayscale(1);opacity:.48;transition:filter .35s ease,opacity .35s ease,transform .35s var(--ease)}
.pn-logo-item:hover img{filter:grayscale(0);opacity:1;transform:scale(1.06)}
.pn-marquee:hover .pn-marquee-track{animation-play-state:paused}
@keyframes pn-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
.pn-form-steps{margin:0 0 28px;padding:28px;border:1px solid var(--line);border-radius:var(--radius);background:linear-gradient(165deg,var(--ivory) 0%,var(--white) 100%);text-align:${isEn ? 'left' : 'right'};box-shadow:0 12px 40px rgba(0,0,0,.03)}
.pn-form-steps h3{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:18px;font-family:${ff}}
.pn-form-step{display:grid;grid-template-columns:48px 1fr;gap:16px;padding:16px 0;border-bottom:1px solid var(--line);align-items:start}
.pn-form-step:last-child{border-bottom:none;padding-bottom:0}
.pn-form-step-n{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:999px;font-size:11px;font-weight:700;color:var(--gold);background:var(--gold-soft);border:1px solid rgba(201,168,76,.22);font-family:${ff}}
.pn-form-step h3{font-size:14px;margin-bottom:4px;font-family:${ff}}
.pn-form-step p{font-size:13px;line-height:1.7;color:var(--muted);font-family:${ff}}
.pn-deck{margin-top:20px;padding-top:22px;border-top:1px solid var(--line);text-align:${isEn ? 'left' : 'right'}}
.pn-deck-note{margin-top:10px;font-size:12px;line-height:1.7;color:var(--muted);font-family:${ff}}
.pn-sec .pn-btn--primary{background:var(--dark);color:#fff;box-shadow:0 12px 32px rgba(0,0,0,.12)}
.pn-sec .pn-btn--primary:hover{background:#1a1f1c;box-shadow:0 16px 40px rgba(0,0,0,.16)}
.pn-sec .pn-btn--ghost{background:var(--white);color:var(--ink);border-color:var(--line)}
.pn-sec .pn-btn--ghost:hover{border-color:var(--gold);color:var(--gold);background:var(--gold-soft)}
.pn-idea{text-align:${isEn ? 'left' : 'right'}}
.pn-idea-body{font-size:17px;line-height:1.95;color:var(--muted);max-width:720px;margin:20px 0;font-family:${ff}}
.pn-chips{display:flex;flex-wrap:wrap;gap:10px;margin:28px 0}
.pn-chip{padding:10px 16px;border:1px solid var(--line);border-radius:999px;font-size:12px;font-weight:600;background:var(--white);font-family:${ff};transition:border-color .25s var(--ease),background .25s var(--ease),transform .25s var(--ease)}
.pn-chip:hover{border-color:rgba(201,168,76,.35);background:var(--gold-soft);transform:translateY(-1px)}
.pn-quote{margin-top:36px;padding:28px 32px;border-${isEn ? 'left' : 'right'}:3px solid var(--gold);background:linear-gradient(135deg,var(--gold-soft),rgba(255,255,255,.8));font-size:clamp(17px,2vw,20px);font-weight:600;line-height:1.65;font-family:${ff};border-radius:0 var(--radius) var(--radius) 0}
html[dir=rtl] .pn-quote{border-radius:var(--radius) 0 0 var(--radius)}
.pn-roles-sec{padding:clamp(80px,10vw,120px) 0;background:linear-gradient(180deg,var(--ivory) 0%,var(--white) 45%,var(--ivory) 100%);border-top:1px solid var(--line);border-bottom:1px solid var(--line);text-align:${isEn ? 'left' : 'right'}}
.pn-roles{display:grid;grid-template-columns:1fr;gap:20px;margin-top:48px;align-items:stretch}
@media(min-width:960px){.pn-roles{grid-template-columns:1fr 72px 1fr;gap:32px}}
.pn-role{position:relative;padding:40px 32px;border-radius:var(--radius-lg);background:var(--white);border:1px solid var(--line);box-shadow:0 20px 56px rgba(0,0,0,.04);display:flex;flex-direction:column;gap:18px;min-height:100%;transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.pn-role:hover{transform:translateY(-6px);box-shadow:0 28px 64px rgba(0,0,0,.08)}
@media(min-width:768px){.pn-role{padding:44px 36px}}
.pn-role--agency{border-top:3px solid rgba(20,20,20,.1)}
.pn-role--gh{border-top:3px solid var(--gold);background:linear-gradient(165deg,var(--white) 0%,rgba(201,168,76,.09) 100%);box-shadow:0 24px 64px rgba(201,168,76,.12)}
.pn-role--gh:hover{box-shadow:0 32px 72px rgba(201,168,76,.18)}
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
.pn-benefits{display:grid;grid-template-columns:1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;margin-top:40px;box-shadow:0 16px 48px rgba(0,0,0,.04)}
@media(min-width:640px){.pn-benefits{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-benefits{grid-template-columns:repeat(3,1fr)}}
.pn-benefit{padding:32px 26px;background:var(--white);transition:background .35s var(--ease)}
.pn-benefit:hover{background:linear-gradient(180deg,var(--white),var(--gold-soft))}
.pn-benefit-n{font-size:11px;font-weight:700;letter-spacing:.14em;color:var(--gold);margin-bottom:12px;font-family:${ff}}
.pn-benefit h3{font-size:16px;margin-bottom:10px;line-height:1.4}
.pn-benefit p{font-size:14px;line-height:1.78;color:var(--muted);font-family:${ff}}
.pn-cap{display:grid;grid-template-columns:1fr;gap:0;border-bottom:1px solid var(--line);padding:44px 0;transition:background .35s var(--ease)}
.pn-cap:hover{background:rgba(201,168,76,.03)}
@media(min-width:768px){.pn-cap{grid-template-columns:300px 1fr;gap:48px;align-items:center}}
.pn-cap:last-child{border-bottom:none;padding-bottom:0}
.pn-cap-media{border-radius:var(--radius);overflow:hidden;aspect-ratio:4/3;background:#eceae4;box-shadow:0 16px 40px rgba(0,0,0,.08)}
.pn-cap-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s var(--ease)}
.pn-cap:hover .pn-cap-media img{transform:scale(1.05)}
.pn-cap-tag{font-size:10px;font-weight:700;letter-spacing:.18em;color:var(--gold);margin-bottom:8px;display:block;font-family:${ff}}
.pn-cap-body h3{font-size:clamp(18px,2.2vw,22px);margin-bottom:10px}
.pn-cap-body p{font-size:15px;line-height:1.8;color:var(--muted);margin-bottom:12px;font-family:${ff}}
.pn-cap-link{font-size:13px;font-weight:700;color:var(--ink);text-decoration:none;font-family:${ff}}
.pn-cap-link:hover{color:var(--gold)}
.pn-cap-foot{margin-top:48px;text-align:center;padding-top:40px;border-top:1px solid var(--line)}
.pn-cap-foot h3{font-size:clamp(22px,3vw,30px);font-weight:700;margin-bottom:6px}
.pn-cap-foot p{font-size:16px;color:var(--muted);font-family:${ff}}
.pn-pl{position:relative;padding:clamp(36px,5vw,56px);border-radius:var(--radius-lg);background:var(--white);overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.06)}
.pn-pl::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(201,168,76,.45),transparent 50%,rgba(201,168,76,.2));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.pn-pl-items{display:flex;flex-wrap:wrap;gap:10px;margin:28px 0;list-style:none}
.pn-pl-items li{padding:10px 16px;background:var(--gold-soft);border:1px solid rgba(201,168,76,.15);border-radius:999px;font-size:12px;font-weight:600;font-family:${ff}}
.pn-pl-quote{margin:28px 0;padding:24px 28px;background:var(--ivory);border-radius:var(--radius);font-size:15px;line-height:1.88;color:var(--muted);font-family:${ff};border-${isEn ? 'left' : 'right'}:3px solid var(--gold)}
.pn-pitch-wrap{position:relative;border-radius:var(--radius-lg);overflow:hidden}
.pn-pitch{position:relative;padding:clamp(40px,6vw,64px);background:var(--dark);color:#fff;overflow:hidden}
.pn-pitch-glow{position:absolute;top:-20%;${isEn ? 'right' : 'left'}:-10%;width:55%;height:80%;background:radial-gradient(circle,rgba(201,168,76,.18),transparent 65%);pointer-events:none}
.pn-pitch .pn-h2,.pn-pitch .pn-h3{color:#fff;position:relative;z-index:1}
.pn-pitch .pn-lead{color:rgba(255,255,255,.68);position:relative;z-index:1}
.pn-pitch-list{display:flex;flex-wrap:wrap;gap:10px;margin:28px 0;list-style:none;position:relative;z-index:1}
.pn-pitch-list li{padding:10px 16px;border:1px solid rgba(255,255,255,.16);border-radius:999px;font-size:12px;font-weight:600;font-family:${ff};background:rgba(255,255,255,.04);backdrop-filter:blur(6px)}
.pn-pitch-highlight{font-size:clamp(22px,3.2vw,34px);font-weight:700;margin:32px 0 24px;line-height:1.28;font-family:${ffH};position:relative;z-index:1;color:var(--gold-light)}
.pn-pitch .pn-btn--primary{position:relative;z-index:1;background:linear-gradient(135deg,var(--gold),#A8883A);color:var(--dark);box-shadow:0 12px 32px rgba(201,168,76,.28)}
.pn-pitch .pn-btn--primary:hover{box-shadow:0 18px 40px rgba(201,168,76,.38)}
.pn-models{display:grid;grid-template-columns:1fr;gap:18px;margin-top:36px}
@media(min-width:640px){.pn-models{grid-template-columns:repeat(2,1fr)}}
.pn-model{padding:32px 28px;border:1px solid var(--line);border-radius:var(--radius);background:var(--white);transition:transform .35s var(--ease),box-shadow .35s var(--ease),border-color .35s var(--ease)}
.pn-model:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,.07);border-color:rgba(201,168,76,.28)}
.pn-model-tag{font-size:10px;font-weight:700;letter-spacing:.16em;color:var(--gold);margin-bottom:10px;display:block;font-family:${ff}}
.pn-model h3{font-size:16px;margin-bottom:10px;line-height:1.45}
.pn-model p{font-size:14px;line-height:1.78;color:var(--muted);font-family:${ff}}
.pn-process{display:grid;grid-template-columns:1fr;gap:0;margin-top:36px;border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.04)}
@media(min-width:768px){.pn-process{grid-template-columns:repeat(5,1fr)}}
.pn-step{position:relative;padding:28px 22px;background:var(--white);border-bottom:1px solid var(--line);transition:background .35s var(--ease)}
.pn-step:hover{background:var(--gold-soft)}
@media(min-width:768px){.pn-step{border-bottom:none;border-${isEn ? 'right' : 'left'}:1px solid var(--line)}.pn-step:first-child{border-${isEn ? 'left' : 'right'}:none}}
.pn-step:last-child{border:none}
.pn-step-n{font-size:11px;font-weight:700;color:var(--gold);margin-bottom:12px;font-family:${ff}}
.pn-step h3{font-size:14px;margin-bottom:8px;line-height:1.45;font-weight:700}
.pn-step p{font-size:13px;line-height:1.7;color:var(--muted);font-family:${ff}}
.pn-case{display:grid;grid-template-columns:1fr;gap:40px;margin-top:40px}
@media(min-width:960px){.pn-case{grid-template-columns:1.12fr .88fr;align-items:start}}
.pn-case-media{border-radius:var(--radius-lg);overflow:hidden;background:#000;aspect-ratio:16/9;box-shadow:0 28px 64px rgba(0,0,0,.18),0 0 0 1px rgba(201,168,76,.15)}
.pn-case-media iframe{width:100%;height:100%;border:0;display:block}
.pn-case-img{margin-top:18px;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/10;box-shadow:0 16px 40px rgba(0,0,0,.1)}
.pn-case-img img{width:100%;height:100%;object-fit:cover;display:block}
.pn-case-name{font-size:clamp(22px,2.8vw,28px);font-weight:700;margin:14px 0 8px;font-family:${ffH}}
.pn-case-tags{font-size:13px;font-weight:600;color:var(--gold);margin-bottom:16px;font-family:${ff}}
.pn-case-body{font-size:15px;line-height:1.92;color:var(--muted);margin-bottom:24px;font-family:${ff}}
.pn-case-link{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--ink);text-decoration:none;font-family:${ff};padding:12px 20px;border-radius:999px;border:1px solid var(--line);transition:border-color .25s var(--ease),color .25s var(--ease),background .25s var(--ease)}
.pn-case-link:hover{border-color:var(--gold);color:var(--gold);background:var(--gold-soft)}
.pn-trust-grid{display:grid;grid-template-columns:1fr;gap:18px;margin-top:36px}
@media(min-width:640px){.pn-trust-grid{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-trust-grid{grid-template-columns:repeat(3,1fr)}}
.pn-trust{padding:28px 24px;border:1px solid var(--line);border-radius:var(--radius);background:var(--white);transition:transform .35s var(--ease),border-color .35s var(--ease)}
.pn-trust:hover{transform:translateY(-3px);border-color:rgba(201,168,76,.25)}
.pn-trust h3{font-size:15px;margin-bottom:8px;line-height:1.4}
.pn-trust p{font-size:13px;line-height:1.7;color:var(--muted);font-family:${ff}}
.pn-principles{display:flex;flex-direction:column;gap:0;margin-top:36px;border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.03)}
.pn-principle{padding:24px 32px;background:var(--white);border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr;gap:8px;transition:background .3s var(--ease)}
.pn-principle:hover{background:var(--gold-soft)}
@media(min-width:640px){.pn-principle{grid-template-columns:220px 1fr;gap:28px;align-items:baseline}}
.pn-principle:last-child{border-bottom:none}
.pn-principle h3{font-size:14px;font-weight:700;font-family:${ff}}
.pn-principle p{font-size:14px;line-height:1.78;color:var(--muted);font-family:${ff}}
.pn-who{display:grid;grid-template-columns:1fr;gap:14px;margin-top:36px}
@media(min-width:640px){.pn-who{grid-template-columns:repeat(2,1fr)}}
@media(min-width:960px){.pn-who{grid-template-columns:repeat(3,1fr)}}
.pn-who-item{padding:26px 22px;border:1px solid var(--line);border-radius:var(--radius);background:var(--white);transition:transform .35s var(--ease),box-shadow .35s var(--ease),border-color .35s var(--ease)}
.pn-who-item:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.06);border-color:rgba(201,168,76,.22)}
.pn-who-item h3{font-size:14px;margin-bottom:8px;line-height:1.4}
.pn-who-item p{font-size:13px;line-height:1.68;color:var(--muted);font-family:${ff}}
.pn-final{position:relative;text-align:center;padding:clamp(80px,12vw,120px) 0;background:var(--dark);color:#fff;border-top:1px solid rgba(201,168,76,.14);overflow:hidden}
.pn-final-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 100%,rgba(201,168,76,.12),transparent 60%);pointer-events:none}
.pn-final .pn-h2{margin-bottom:16px;color:#fff}
.pn-final .pn-lead{margin:0 auto 10px;max-width:580px;color:rgba(255,255,255,.68)}
.pn-final-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:36px;position:relative;z-index:1}
.pn-final .pn-btn--primary{background:linear-gradient(135deg,var(--gold),#A8883A);color:var(--dark);box-shadow:0 14px 36px rgba(201,168,76,.28)}
.pn-final .pn-btn--ghost{color:#fff;border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.04)}
.pn-final .pn-btn--ghost:hover{border-color:var(--gold);color:var(--gold-light)}
.pn-form-sec{padding:clamp(72px,10vw,100px) 0 clamp(88px,12vw,120px);background:linear-gradient(180deg,var(--ivory) 0%,#f3f2ee 100%)}
.pn-form-box{max-width:760px;margin:0 auto;background:var(--white);border:1px solid var(--line);border-radius:var(--radius-lg);padding:clamp(36px,5vw,56px) clamp(28px,4vw,48px);box-shadow:0 28px 80px rgba(0,0,0,.07);position:relative;overflow:hidden}
.pn-form-box::before{content:'';position:absolute;top:0;${isEn ? 'left' : 'right'}:0;${isEn ? 'right' : 'left'}:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light),var(--gold))}
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
.pn-submit{width:100%;margin-top:12px;padding:18px 28px;font-size:14px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-family:inherit;cursor:pointer;background:linear-gradient(135deg,var(--dark),#1a1f1c);color:#fff;border:none;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:10px;transition:transform .3s var(--ease),box-shadow .3s var(--ease)}
.pn-submit:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(0,0,0,.18)}
.pn-page-foot{padding:48px 0 56px;background:var(--dark);color:rgba(255,255,255,.68);text-align:center;border-top:1px solid rgba(201,168,76,.1)}
.pn-page-foot strong{display:block;color:#fff;font-size:16px;margin-bottom:10px;font-family:${ff}}
.pn-page-foot p{font-size:13px;line-height:1.75;font-family:${ff}}
.pn-page-foot-links{margin-top:14px;font-size:11px;letter-spacing:.08em;color:rgba(255,255,255,.42);font-family:${ff}}
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
  <div class="pn-hero-bg" aria-hidden="true"></div>
  <div class="pn-wrap">
    <div class="pn-hero-grid pn-reveal">
      <div class="pn-hero-copy">
        <span class="pn-eye">${c.brand}</span>
        <h1 class="pn-h1">${c.heroH1}</h1>
        <p class="pn-hero-sub">${c.heroH2}</p>
        <p class="pn-lead">${c.heroLead}</p>
        <p class="pn-support">${c.heroSupport}</p>
        <div class="pn-hero-actions">
          <a href="#inquiry" class="pn-btn pn-btn--primary">${c.heroCtaPrimary} <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_forward' : 'arrow_back'}</span></a>
          <a href="#capabilities" class="pn-btn pn-btn--ghost">${c.heroCtaSecondary} ↓</a>
        </div>
      </div>
      <div class="pn-hero-media">
        <div class="pn-hero-frame"><picture><source srcset="${c.heroWebp}" type="image/webp"><img src="${c.heroImg}" alt="${c.heroImgAlt}" loading="eager"></picture></div>
      </div>
    </div>
  </div>
</section>

<section class="pn-proof" aria-label="${isEn ? 'Proof' : 'إثبات'}">
  <div class="pn-proof-inner">
    <div class="pn-wrap">
      <div class="pn-stats pn-reveal">${renderProofStats(c.proofStats)}</div>
      <p class="pn-logos-label pn-reveal">${c.proofLogosLabel}</p>
      <div class="pn-reveal">${renderClientLogos(isEn)}</div>
    </div>
  </div>
</section>

<section class="pn-sec pn-idea">
  <div class="pn-wrap pn-reveal">
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
  <div class="pn-wrap pn-reveal">
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
  <div class="pn-wrap pn-reveal">
    <span class="pn-eye">04</span>
    <h2 class="pn-h2">${c.valueTitle}</h2>
    ${c.valueSub ? `<p class="pn-sub" style="margin-bottom:0">${c.valueSub}</p>` : ''}
    <div class="pn-benefits">${c.benefits.map((b) => `<article class="pn-benefit"><div class="pn-benefit-n">${b.n}</div><h3>${b.title}</h3><p>${b.desc}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-sec pn-sec--white" id="capabilities">
  <div class="pn-wrap pn-reveal">
    <span class="pn-eye">05</span>
    <h2 class="pn-h2">${c.capTitle}</h2>
    <p class="pn-h3" style="font-weight:400;color:var(--muted)">${c.capSub}</p>
    <div style="margin-top:36px">${capHtml}</div>
    <div class="pn-cap-foot"><h3>${c.capFootH}</h3><p>${c.capFootP}</p></div>
  </div>
</section>

<section class="pn-sec">
  <div class="pn-wrap pn-reveal">
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
  <div class="pn-wrap pn-reveal">
    <span class="pn-eye">07</span>
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
  <div class="pn-wrap pn-reveal">
    <span class="pn-eye">08</span>
    <div class="pn-pitch-wrap">
    <div class="pn-pitch">
      <div class="pn-pitch-glow" aria-hidden="true"></div>
      <h2 class="pn-h2">${c.pitchTitle}</h2>
      <p class="pn-h3" style="color:rgba(255,255,255,.85);font-weight:400;margin-bottom:16px">${c.pitchSub}</p>
      <p class="pn-lead">${c.pitchBody}</p>
      <ul class="pn-pitch-list">${li(c.pitchList)}</ul>
      <p class="pn-pitch-highlight">${c.pitchHighlight}</p>
      <a href="#inquiry" class="pn-btn pn-btn--primary">${c.pitchCta} →</a>
    </div>
    </div>
  </div>
</section>

<section class="pn-sec pn-sec--white">
  <div class="pn-wrap">
    <span class="pn-eye">09</span>
    <h2 class="pn-h2">${c.modelsTitle}</h2>
    <div class="pn-models">${c.models.map((m) => `<article class="pn-model"><span class="pn-model-tag">${m.tag}</span><h3>${m.title}</h3><p>${m.desc}</p></article>`).join('')}</div>
  </div>
</section>

<section class="pn-sec pn-sec--tight">
  <div class="pn-wrap">
    <span class="pn-eye">10</span>
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
  <div class="pn-final-bg" aria-hidden="true"></div>
  <div class="pn-wrap pn-reveal">
    <span class="pn-eye">14</span>
    <h2 class="pn-h2">${c.finalCtaTitle}</h2>
    <p class="pn-lead">${c.finalCtaLead}</p>
    <p class="pn-lead">${c.finalCtaSub}</p>
    <div class="pn-final-actions">
      <a href="#inquiry" class="pn-btn pn-btn--primary">${c.finalCtaPrimary} →</a>
      <a href="#inquiry" class="pn-btn pn-btn--ghost">${c.finalCtaSecondary} →</a>
      <a href="${c.deckHref}" class="pn-btn pn-btn--ghost" target="_blank" rel="noopener noreferrer">${c.finalCtaDeck} ↗</a>
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
      <div class="pn-form-steps">
        <h3>${c.formStepsTitle}</h3>
        ${renderFormSteps(c.formSteps)}
      </div>
      <div class="pn-deck">
        <a href="${c.deckHref}" class="pn-btn pn-btn--ghost" target="_blank" rel="noopener noreferrer">${c.deckCta} ↗</a>
        <p class="pn-deck-note">${c.deckNote}</p>
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
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}});
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.pn-reveal').forEach(function(el){obs.observe(el);});
    document.querySelector('.pn-hero-grid')&&document.querySelector('.pn-hero-grid').classList.add('is-visible');
  }else{
    document.querySelectorAll('.pn-reveal').forEach(function(el){el.classList.add('is-visible');});
  }
})();
</script>
</body>
</html>`;
}

function buildOverview(c) {
  const isEn = c.lang === 'en';
  const ff = isEn ? "'Inter', sans-serif" : "'Tajawal', 'IBM Plex Sans Arabic', sans-serif";
  const pageName = isEn ? 'Partnership Overview' : 'ملخص الشراكة';
  const backHref = isEn ? 'partner-network-en.html' : 'partner-network.html';
  const modelsList = c.models
    .map((m) => `<li><strong>${m.tag}</strong> — ${m.title} ${m.desc}</li>`)
    .join('');
  const capsList = c.capabilities.map((cap) => `<li>${cap.title}</li>`).join('');
  const principlesList = c.principles
    .map((p) => `<li><strong>${p.title}</strong> — ${p.desc}</li>`)
    .join('');
  const statsHtml = c.proofStats
    .map((s) => `<article class="stat"><strong>${s.value}</strong><span>${s.label}</span></article>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="${c.lang}" dir="${c.dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageName} | ${c.pageFootBrand}</title>
<style>
@page{size:A4;margin:16mm}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:${ff};color:#141414;background:#fff;line-height:1.6;padding:32px;max-width:880px;margin:0 auto}
header{border-bottom:2px solid #C9A84C;padding-bottom:20px;margin-bottom:28px;text-align:${isEn ? 'left' : 'right'}}
.brand{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#C9A84C;font-weight:700}
h1{font-size:28px;font-weight:700;margin:10px 0 8px;line-height:1.25}
.lead{font-size:15px;color:rgba(20,20,20,.68);max-width:640px}
section{margin-bottom:24px;text-align:${isEn ? 'left' : 'right'}}
h2{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#C9A84C;margin-bottom:10px}
ul{padding-${isEn ? 'left' : 'right'}:18px}
li{font-size:13px;line-height:1.7;margin-bottom:6px;color:rgba(20,20,20,.78)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}
.stat{border:1px solid rgba(20,20,20,.08);border-radius:10px;padding:14px;text-align:center}
.stat strong{display:block;font-size:22px}
.stat span{display:block;font-size:11px;color:rgba(20,20,20,.58);margin-top:4px}
footer{margin-top:32px;padding-top:20px;border-top:1px solid rgba(20,20,20,.08);font-size:12px;color:rgba(20,20,20,.58);text-align:${isEn ? 'left' : 'right'}}
.actions{margin:20px 0 28px;display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;padding:10px 18px;border-radius:999px;font-size:12px;font-weight:700;text-decoration:none;border:1px solid #141414;color:#141414}
.btn--gold{background:#C9A84C;border-color:#C9A84C;color:#0A0A0A}
@media print{.actions{display:none}body{padding:0}}
@media(max-width:640px){.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
  <div class="brand">${c.brand}</div>
  <h1>${c.ideaTitle}</h1>
  <p class="lead">${c.heroLead}</p>
  <div class="actions">
    <a class="btn btn--gold" href="javascript:window.print()">${isEn ? 'Save as PDF' : 'حفظ كـ PDF'}</a>
    <a class="btn" href="${backHref}#inquiry">${isEn ? 'Partnership inquiry' : 'طلب شراكة وتعاون'}</a>
  </div>
</header>
<section>
  <h2>${isEn ? 'At a glance' : 'نظرة سريعة'}</h2>
  <div class="grid">${statsHtml}</div>
</section>
<section>
  <h2>${c.modelsTitle}</h2>
  <ul>${modelsList}</ul>
</section>
<section>
  <h2>${c.capTitle}</h2>
  <ul>${capsList}</ul>
</section>
<section>
  <h2>${c.principlesTitle}</h2>
  <ul>${principlesList}</ul>
</section>
<footer>
  <strong>${c.pageFootBrand}</strong> · ${c.pageFootTagline}<br>
  ${isEn ? 'Contact' : 'التواصل'}: info@3dgraphicshouse.com · 3dgraphicshouse.com<br>
  ${isEn ? 'Full page' : 'الصفحة الكاملة'}: ${BASE}/${backHref}
</footer>
</body>
</html>`;
}

console.log('Building Partner Network pages…');
fs.writeFileSync(path.join(ROOT, 'partner-network.html'), buildPage(COPY.ar), 'utf8');
fs.writeFileSync(path.join(ROOT, 'partner-network-en.html'), buildPage(COPY.en), 'utf8');
fs.writeFileSync(path.join(ROOT, 'partner-network-overview.html'), buildOverview(COPY.ar), 'utf8');
fs.writeFileSync(path.join(ROOT, 'partner-network-overview-en.html'), buildOverview(COPY.en), 'utf8');
console.log('  partner-network.html');
console.log('  partner-network-en.html');
console.log('  partner-network-overview.html');
console.log('  partner-network-overview-en.html');
console.log('Done.');
