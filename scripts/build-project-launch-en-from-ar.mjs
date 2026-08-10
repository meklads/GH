/**
 * Build ProjectLaunch EN from the polished Arabic page.
 * Preserves design/CSS/JS; translates copy; swaps EN header/footer.
 *
 * Run: node scripts/build-project-launch-en-from-ar.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_AR = path.join(ROOT, 'solutions', 'project-launch.html');
const OUT_EN = path.join(ROOT, 'solutions', 'project-launch-en.html');
const BAK_EN = '/tmp/project-launch-en.backup.html';

const header = fs.readFileSync('/tmp/pl-en-header.html', 'utf8');
const footer = fs.readFileSync('/tmp/pl-en-footer.html', 'utf8');

let html = fs.readFileSync(SRC_AR, 'utf8');

/* Document / SEO */
html = html.replace('dir="rtl" lang="ar"', 'dir="ltr" lang="en"');
html = html.replace(
  /<link rel="canonical" href="[^"]*">/,
  '<link rel="canonical" href="https://3dgraphicshouse.com/solutions/project-launch-en.html">'
);
html = html.replace(
  /hreflang="en" href="[^"]*"/,
  'hreflang="en" href="https://3dgraphicshouse.com/solutions/project-launch-en.html"'
);
html = html.replace(
  /hreflang="ar" href="[^"]*"/,
  'hreflang="ar" href="https://3dgraphicshouse.com/solutions/project-launch.html"'
);
html = html.replace(
  /hreflang="x-default" href="[^"]*"/,
  'hreflang="x-default" href="https://3dgraphicshouse.com/solutions/project-launch-en.html"'
);
html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>ProjectLaunch™ | Real Estate Launch System | Graphics House</title>'
);
html = html.replace(
  /<meta name="description" content="[^"]*"/,
  '<meta name="description" content="Imagine investors experiencing your development before concrete is poured — and buyers grasping it in minutes inside the sales gallery. ProjectLaunch™ is Graphics House’s complete launch system."'
);
html = html.replace(
  /property="og:title" content="[^"]*"/,
  'property="og:title" content="ProjectLaunch™ | Graphics House"'
);
html = html.replace(
  /property="og:description" content="[^"]*"/,
  'property="og:description" content="A launch system built for the market: investor conviction, sales experience, and presence on launch day — one visual language."'
);
html = html.replace(
  /property="og:url" content="[^"]*"/,
  'property="og:url" content="https://3dgraphicshouse.com/solutions/project-launch-en.html"'
);
html = html.replace(
  /"url":"https:\/\/3dgraphicshouse\.com\/solutions\/project-launch\.html"/,
  '"url":"https://3dgraphicshouse.com/solutions/project-launch-en.html"'
);
html = html.replace(
  /"description":"[^"]*"/,
  '"description":"An integrated system for real estate project launches — from investor persuasion to the sales gallery experience."'
);

/* Header / footer */
html = html.replace(/<!-- ===== SITE HEADER \(Arabic\) ===== -->[\s\S]*?<\/header>/, header);
html = html.replace(/<footer dir="rtl" class="gh-footer"[\s\S]*?<\/footer>/, footer);

/* LTR body tweaks for AR-oriented CSS */
const ltrCss = `
  /* EN LTR adaptations of AR design tokens */
  html[dir='ltr'] .ar-outcomes,
  html[dir='ltr'] .ar-system,
  html[dir='ltr'] .ar-form-sec,
  html[dir='ltr'] .ar-story { direction: ltr; }
  html[dir='ltr'] .pl-s3-thumbs { direction: ltr; }
  html[dir='ltr'] .ar-env-card a { color: #fff !important; }
  html[dir='ltr'] body {
    font-family: Inter, 'Helvetica Neue', Arial, sans-serif !important;
  }
  html[dir='ltr'] .font-headline-xl,
  html[dir='ltr'] .font-headline-md,
  html[dir='ltr'] h1, html[dir='ltr'] h2, html[dir='ltr'] h3, html[dir='ltr'] h4,
  html[dir='ltr'] .pl-hero-tagline,
  html[dir='ltr'] .ar-outcome-card strong,
  html[dir='ltr'] .ar-form-box h2 {
    font-family: Inter, 'Helvetica Neue', Arial, sans-serif !important;
  }
  html[dir='ltr'] .pl-hero-tagline { color: #fff !important; }
`;
if (!html.includes('EN LTR adaptations')) {
  html = html.replace('</style>', `${ltrCss}\n</style>`);
}

/* Prefer Inter weights already linked; ensure Inter is present */
if (!html.includes('family=Inter')) {
  html = html.replace(
    "family=Tajawal:wght@200;300;400;500;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700",
    "family=Inter:wght@300;400;500;600;700&family=Tajawal:wght@200;300;400;500;700"
  );
}

/* Float / contact targets EN */
html = html.replace(
  'data-contact-href="../contact-us.html"',
  'data-contact-href="../contact-us-en.html"'
);

/* Content translations — longest / most specific first */
const T = [
  /* Meta / a11y */
  ['تخطي إلى المحتوى الرئيسي', 'Skip to main content'],
  ['عرض الصورة', 'View image'],
  ['إغلاق', 'Close'],
  ['العودة للأعلى', 'Back to top'],

  /* Hero */
  ['الحل الرائد', 'Flagship solution'],
  ['من الهوية المعمارية إلى صالة بيع تُغلق الصفقات', 'From architectural identity to a sales gallery that closes deals'],
  ['مجسمات ذكية، أفلام سينمائية، تجارب تفاعلية، ديكور، تصوير وإخراج في منظومة بصرية واحدة.', 'Smart maquettes, cinematic films, interactive experiences, décor, photography and direction — one visual system.'],
  ['احجز جلسة إطلاق مشروعك', 'Book your launch session'],
  ['مشاهدة أعمالنا', 'View our work'],
  ['هوية بصرية', 'Visual identity'],
  ['ميديا برودكشن', 'Media Production'],
  ['جاليريات وديكور', 'Galleries &amp; Decor'],
  ['تجارب تفاعلية', 'Interactive Experiences'],
  ['سينمائي CGI', 'Cinematic CGI'],
  ['قدرات المنظومة', 'System capabilities'],
  ['أفلام CGI', 'CGI films'],
  ['صالة بيع', 'Sales gallery'],
  ['أفلام CGI', 'CGI films'],
  ['مجسمات ذكية', 'Smart maquettes'],
  ['صالة بيع', 'Sales gallery'],
  ['بيئة إطلاق متكاملة، رابطة العالم الإسلامي', 'Integrated launch environment, Muslim World League'],

  /* System */
  ['المنظومة الكاملة لإطلاق مشروعك', 'The complete system to launch your project'],
  ['تجمع كل قدرة تحتاجها لفتح المبيعات قبل الخرسانة، لغة بصرية واحدة.', 'brings together every capability you need to open sales before concrete — one visual language.'],
  ['هوية بصرية متكاملة للمشروع العقاري', 'Complete visual identity for the real estate project'],
  ['رندرات فوتوريالستك وأفلام CGI سينمائية', 'Photoreal renders and cinematic CGI films'],
  ['مجسمات ذكية بطبقات إضاءة وإظهار رقمي', 'Smart maquettes with lighting layers and digital display'],
  ['تجارب تفاعلية لاختيار الوحدات والمخططات', 'Interactive experiences for unit and plan selection'],
  ['ديكور صالة البيع وتأثيث كل أصل بصري', 'Sales-gallery décor that stages every visual asset'],
  ['تصوير وإخراج وتركيب في الموقع', 'Photography, direction and on-site installation'],
  ['المجسم المعماري المُدرَّج', 'Architectural scale model'],

  /* Methodology */
  ['كيف نعمل', 'How we work'],
  ['المنهجية', 'Methodology'],
  ['الهوية، التموضع، واللغة البصرية', 'Identity, positioning and visual language'],
  ['الرندر، الأفلام، المجسمات، والتفاعلي', 'Renders, films, maquettes and interactive'],
  ['ديكور صالة البيع والتأهيل المكاني', 'Sales-gallery décor and spatial staging'],
  ['التصوير، الإخراج، التركيب، والتسليم', 'Photography, direction, install and handover'],

  /* Outcomes */
  ['ما سيحصل عليه العميل', 'What the client receives'],
  ['ماذا سيحصل عليه مشروعك؟', 'What will your project receive?'],
  ['أصول إطلاق جاهزة للسوق… هوية، أفلام، مجسمات، وتجربة بيع في منظومة واحدةحدة تجعل المستثمر يفهم المشروع خلال دقائق.', 'Market-ready launch assets… identity, films, maquettes and a sales experience in one system — so investors understand the project in minutes.'],
  ['لغة معمارية متماسكة للمشروع من أول انطباع حتى صالة البيع', 'A coherent architectural language from first impression to the sales gallery'],
  ['أفلام ورندرات', 'Films & renders'],
  ['محتوى سينمائي يقنع المستثمر قبل أن تُصب الخرسانة', 'Cinematic content that convinces investors before concrete is poured'],
  ['حضور ملموس في غرفة العرض بطبقات إضاءة وتفاعل عند الحاجة', 'A tangible presence in the showroom — with lighting layers and interaction when needed'],
  ['تجربة البيع', 'Sales experience'],
  ['صالة عرض وأدوات تفاعلية تقرّب العميل من قرار الشراء', 'A showroom and interactive tools that move the buyer toward a decision'],
  ['* تُحدَّد الأولويات حسب مرحلة مشروعك وميزانية الإطلاق', '* Priorities are set to your project stage and launch budget'],
  ['خدمات العقارات — Graphics House', 'Real estate services — Graphics House'],

  /* Metrics */
  ['أرقام النجاح', 'Proof in numbers'],
  ['مشروع مُنجز', 'Projects delivered'],
  ['قيمة مشاريع مُصوَّرة', 'Value of visualized projects'],
  ['سنة خبرة في السوق', 'Years in market'],

  /* Environments */
  ['ما يثبت المنظومة', 'What proves the system'],
  ['بيئات مختارة', 'Selected environments'],
  ['كامل الأعمال', 'Full portfolio'],
  ['بيئة معرض تفاعلية', 'Interactive exhibition environment'],
  ['مشاهدة الأعمال ←', 'View work →'],
  ['هوية وتجارب لمسية', 'Identity & touch experiences'],
  ['صالة بيع وتأهيل مكاني', 'Sales gallery & spatial staging'],

  /* Maquettes */
  ['المجسمات والتفاعلي', 'Maquettes & interactive'],
  ['نماذج ذكية وعروض تفاعلية', 'Smart models and interactive displays'],
  ['مشروع ميثاق مكة، رابطة العالم الإسلامي', 'Makkah Charter project, Muslim World League'],
  ['معرض ميثاق مكة', 'Makkah Charter gallery'],
  ['المجسم التفاعلي الذكي', 'Smart interactive maquette'],
  ['نموذج معماري مدمج بتقنية العرض التفاعلي', 'An architectural model fused with interactive display technology'],
  ['كل الفيديوهات على يوتيوب', 'All videos on YouTube'],

  /* Films */
  ['الأنيميشن وأفلام CGI', 'Animation & CGI films'],
  ['أفلام الإطلاق السينمائية', 'Cinematic launch films'],
  ['أفلام سينمائية تحمل نفس الهوية إلى أيام المستثمرين والحملات.', 'Cinematic films that carry the same identity into investor days and campaigns.'],
  ['ريل التصور المعماري', 'Architectural visualization reel'],
  ['مشاهد فوتوريالستك تبيع ما لم يُبنَ', 'Photoreal sequences that sell what is not yet built'],
  ['فيلم إطلاق عقاري', 'Real estate launch film'],
  ['سرد سينمائي لإطلاق المشاريع التطويرية', 'Cinematic storytelling for development launches'],
  ['ريل Graphics House 2025', 'Graphics House reel 2025'],
  ['مقطع عرضي من أعمال التصور والإنتاج', 'A cross-section of visualization and production craft'],

  /* Stories */
  ['قصص نجاح', 'Success stories'],
  ['كيف حوّلنا عرض المشروع إلى تجربة إقناع', 'How we turned project presentation into persuasion'],
  ['معرض رابطة العالم الإسلامي', 'Muslim World League exhibition'],
  ['رابطة العالم الإسلامي · معرض الإنسانية', 'Muslim World League · Humanity Exhibition'],
  ['شعار رابطة العالم الإسلامي', 'Muslim World League logo'],
  ['رابطة العالم الإسلامي', 'Muslim World League'],
  ['معرض الإنسانية', 'Humanity Exhibition'],
  ['معرض رابطة العالم الإسلامي: منظومة إطلاق متكاملة في أقل من ثلاثة أسابيع.', 'Muslim World League exhibition: a complete launch system in under three weeks.'],
  ['التحدي', 'The challenge'],
  ['إنتاج بيئة معرض مؤسسية تليق بمكانة الرابطة، وتعرض أهم المشاريع حول العالم بطريقة تُقنع الزائر خلال دقائق.', 'Build an institutional exhibition environment worthy of the League — presenting landmark projects worldwide in a way that persuades visitors within minutes.'],
  ['كيف تعاملنا معه', 'How we approached it'],
  ['عملنا بمنظومة واحدة: مجسم معماري كبير، برامج تفاعلية على شاشات العرض، وهوية تصميمية مع ديكور مناسب للمعرض.', 'We worked as one system: a large architectural maquette, interactive programs on display screens, and a design identity with exhibition-ready décor.'],
  ['ما الذي قمنا بتنفيذه', 'What we delivered'],
  ['مجسم معماري ضخم يضم أهم المشاريع حول العالم، تجارب تفاعلية على الشاشات، وهوية بصرية وديكور متكامل للمعرض.', 'A monumental architectural maquette of key projects worldwide, interactive screen experiences, and a complete visual identity and décor for the exhibition.'],
  ['النتيجة', 'The outcome'],
  ['تسليم كامل خلال فترة لم تتجاوز ثلاثة أسابيع، بتجربة عرض تعكس المكانة الرفيعة لرابطة العالم الإسلامي.', 'Full delivery in under three weeks — with a presentation experience that reflects the League’s global stature.'],
  ['أقل من 3 أسابيع', 'Under 3 weeks'],
  ['مجسم + تفاعلي', 'Maquette + interactive'],
  ['هوية وديكور', 'Identity & décor'],
  ['عنان إسكان للتطوير · الرياض', 'Anan Eskan Development · Riyadh'],
  ['شعار عنان إسكان', 'Anan Eskan logo'],
  ['عنان إسكان للتطوير', 'Anan Eskan Development'],
  ['الرياض', 'Riyadh'],
  ['عندما أراد مطوّر عنان إسكان إطلاق مشروعه السكني… كان يواجه فجوة بين جاهزية المخططات وجاهزية البيع.', 'When Anan Eskan set out to launch its residential project… plans were ready, but the sales story was not.'],
  ['إقناع العملاء وصنّاع القرار قبل اكتمال التنفيذ، دون الاعتماد على صور متفرقة لا تبني قصة.', 'Persuade buyers and decision-makers before completion — without relying on scattered images that never form a story.'],
  ['وضعنا هدفًا واحدًا: أن يُفهم المشروع خلال دقائق، وأن يبدو كمنتج جاهز للسوق.', 'We set one goal: the project must be understood in minutes — and feel market-ready.'],
  ['منظومة إظهار مترابطة: تصور معماري سينمائي + مجسم يرسّخ الحضور داخل غرفة العرض، بلغة بصرية واحدة.', 'A connected display system: cinematic architectural visualization + a maquette that anchors presence in the showroom — one visual language.'],
  ['أصبح المشروع أسهل في الشرح، أوضح في الانطباع الأول، وأقرب لقرار الشراء أو الشراكة.', 'The project became easier to explain, clearer at first glance, and closer to a purchase or partnership decision.'],
  ['تسليم في الموعد', 'On-time delivery'],
  ['منظومة متكاملة', 'Integrated system'],
  ['عميل عاد مجدداً', 'Client returned'],
  ['الأولى النخيل، إظهار يبيع ما لم يُبنَ', 'AlOula Al Nakheel — visualization that sells the unbuilt'],
  ['رفال بافيليونز، أفلام إطلاق وحضور سوقي', 'Rafal Pavilions — launch films and market presence'],
  ['عنان إسكان', 'Anan Eskan'],

  /* Assessment */
  ['تقييم سريع', 'Quick assessment'],
  ['هل مشروعك جاهز للإطلاق؟', 'Is your project ready to launch?'],
  ['أجب بصراحة، هذه الأسئلة تكشف فجوة الجاهزية قبل يوم الإطلاق.', 'Answer honestly — these questions reveal readiness gaps before launch day.'],
  ['هل لديك هوية بصرية متكاملة للمشروع؟', 'Do you have a complete visual identity for the project?'],
  ['هل يمتلك فريق المبيعات أدوات عرض احترافية؟', 'Does your sales team have professional presentation tools?'],
  ['هل لديك فيلم ورندرات جاهزة للبيع؟', 'Do you have a film and renders ready to sell with?'],
  ['هل يستطيع المستثمر فهم المشروع خلال أول خمس دقائق؟', 'Can an investor understand the project in the first five minutes?'],
  ['هل جميع مواد الإطلاق جاهزة قبل موعد الإطلاق؟', 'Are all launch materials ready before launch day?'],
  ['إذا كانت إجابتك «لا» على أكثر من سؤال… فقد يكون', 'If you answered “no” to more than one question…'],
  ['إذا كانت إجابتك <span>«لا»</span> على أكثر من سؤال… فقد يكون', 'If you answered <span>“no”</span> to more than one question…'],
  ['١', '1'],
  ['٢', '2'],
  ['٣', '3'],
  ['٤', '4'],
  ['٥', '5'],

  /* FAQ */
  ['الأسئلة الشائعة', 'FAQ'],
  ['أسئلة يطرحها صنّاع القرار قبل الحجز', 'Questions decision-makers ask before booking'],
  ['ماذا تشمل منظومة', 'What does'],
  ['هوية بصرية، رندرات وأفلام CGI، مجسمات ذكية، تجارب تفاعلية، ديكور صالة البيع، تصوير وإخراج، منظومة واحدة.', 'Visual identity, CGI renders and films, smart maquettes, interactive experiences, sales-gallery décor, photography and direction — one system.'],
  ['هل يجب تنفيذ جميع العناصر دفعة واحدة؟', 'Do all elements have to ship at once?'],
  ['ليس بالضرورة. نساعدك في تحديد الأولويات حسب مرحلة مشروعك وميزانيتك. القيمة الحقيقية تظهر حين يكون كل شيء بلغة بصرية واحدة.', 'Not necessarily. We help you prioritize by stage and budget. The real value appears when everything speaks one visual language.'],
  ['لدينا وكالة تسويق، هل نحتاج', 'We already have a marketing agency — do we still need'],
  ['غالبًا نعم. الوكالة تُحرّك الرسالة.', 'Usually yes. The agency moves the message.'],
  ['يجهّز «منتج الإطلاق» نفسه، اللغة البصرية، أصول الإقناع، وتجربة البيع. كثير من الحملات تضعف لأن المنتج البصري غير جاهز.', 'prepares the launch product itself — the visual language, persuasion assets, and sales experience. Many campaigns underperform because the visual product is not ready.'],
  ['هل تنفذون التركيب في الموقع؟', 'Do you install on site?'],
  ['نعم، الديكور، الشاشات، المجسمات، والأنظمة التفاعلية تُنفَّذ وتُسلَّم مع تدريب الفريق على الاستخدام.', 'Yes — décor, screens, maquettes and interactive systems are installed and handed over with team training.'],
  ['هل تخدمون مشاريع خارج الرياض؟', 'Do you serve projects outside Riyadh?'],
  ['نعم، نخدم مشاريع في جميع مدن المملكة والخليج (الإمارات، عُمان، البحرين، مصر)، مع إنتاج وتركيب ميداني.', 'Yes — across Saudi cities and the Gulf (UAE, Oman, Bahrain, Egypt), with production and on-site installation.'],

  /* Collaborations */
  ['شراكات ومشاريع مختارة', 'Selected partnerships & projects'],
  ['نعمل مع مطورين ومؤسسات رائدة في المملكة لتحويل المشاريع إلى تجارب إطلاق تُقنع المستثمر وتُغلق البيع.', 'We work with leading developers and institutions across the Kingdom to turn projects into launch experiences that persuade investors and close sales.'],
  ['مشروع الراجحي بمكة', 'Al Rajhi project in Makkah'],
  ['مصرف الراجحي', 'Al Rajhi Bank'],
  ['تصور معماري ومجسمات لإطلاق مشروع حضري بجوار المشاعر المقدسة', 'Architectural visualization and maquettes for an urban launch beside the Holy Sites'],
  ['مشروع مكيون برج التلال', 'Makkiyoon — Al Telal Tower'],
  ['مكيون · برج التلال', 'Makkiyoon · Al Telal Tower'],
  ['إظهار سينمائي وهوية بصرية لبرج سكني بمعايير إطلاق راقية', 'Cinematic visualization and identity for a residential tower with premium launch standards'],
  ['مشروع رفال بافيليونز', 'Rafal Pavilions project'],
  ['رفال بافيليونز', 'Rafal Pavilions'],
  ['أفلام إطلاق وتجارب عرض تبني حضور المشروع في السوق', 'Launch films and presentation experiences that build market presence'],
  ['مشروع السوق المركزي', 'Central Market project'],
  ['السوق المركزي', 'Central Market'],
  ['منظومة بصرية متكاملة لبيئة تجارية قابلة للبيع قبل الافتتاح', 'A complete visual system for a commercial environment sellable before opening'],
  ['مشروع عنان إسكان', 'Anan Eskan project'],
  ['تصور ومجسمات ذكية حوّلت عرض المشروع إلى تجربة إقناع', 'Visualization and smart maquettes that turned presentation into persuasion'],
  ['مشروع رابطة العالم الإسلامي', 'Muslim World League project'],
  ['بيئة إطلاق تفاعلية بمعايير مؤسسية عالمية المستوى', 'An interactive launch environment at institutional world-class standard'],
  ['الجلسات المتاحة هذا الشهر: 4 جلسات فقط، احجز مكانك قبل اكتمالها', 'Sessions available this month: only 4 left — reserve yours before they fill'],

  /* Form */
  ['هل مشروعك جاهز فعلاً للإطلاق؟', 'Is your project truly ready to launch?'],
  ['أخبرنا عن مشروعك، جلسة التقييم مجانية بالكامل', 'Tell us about your project — the assessment session is completely free'],
  ['الاسم الكامل', 'Full name'],
  ['اسم الشركة / الجهة', 'Company / organization'],
  ['رقم الجوال', 'Mobile number'],
  ['البريد الإلكتروني', 'Email'],
  ['نوع المشروع', 'Project type'],
  ['اختر…', 'Select…'],
  ['سكني', 'Residential'],
  ['تجاري', 'Commercial'],
  ['مختلط', 'Mixed-use'],
  ['ضيافة / فندقي', 'Hospitality / hotel'],
  ['مؤسسي / معرض', 'Institutional / exhibition'],
  ['أخرى', 'Other'],
  ['مدينة المشروع', 'Project city'],
  ['الرياض، جدة، …', 'Riyadh, Jeddah, …'],
  ['احصل على تقييم جاهزية إطلاق مشروعك ←', 'Get your launch readiness assessment →'],
  ['رد واضح خلال 24 ساعة، بدون التزام شراء في الجلسة الأولى', 'A clear response within 24 hours — no purchase commitment in the first session'],
  ['جلسة مجانية 100%', '100% free session'],
  ['بدون عقد أو التزام', 'No contract or obligation'],
  ['رد خلال 24 ساعة', 'Reply within 24 hours'],
  ['متاح للمشاريع في جميع مدن المملكة والخليج', 'Available for projects across Saudi Arabia and the Gulf'],
  ['قدّمت جرافيكس هاوس تجربة عالمية المستوى تعكس المكانة الرفيعة لرابطة العالم الإسلامي', 'Graphics House delivered a world-class experience that reflects the League’s distinguished stature'],
  ['مسؤول رفيع، رابطة العالم الإسلامي', 'Senior official, Muslim World League'],
  ['الاسم', 'Name'],
  ['الشركة', 'Company'],

  /* Final CTA */
  ['جاهز لإطلاق المنظومة الكاملة؟', 'Ready to launch the complete system?'],
  ['فريقنا يستطيع تحديد نطاق', 'Our team can scope'],
  ['ومشاركتك عرضًا واضحًا خلال 48 ساعة.', 'and share a clear proposal within 48 hours.'],
  ['احجز جلسة إطلاق مشروعك الآن', 'Book your launch session now'],

  /* Float popup */
  ['سجّل اهتمامك', 'Register your interest'],
  ['تواصل معنا', 'Contact us'],
  ['سجّل اهتمامك بالمشروع', 'Register your interest'],
  ['أخبرنا عن مشروعك وسنتواصل معك خلال 24 ساعة.', 'Tell us about your project — we’ll respond within 24 hours.'],
  ['الشركة / المطوّر', 'Company / developer'],
  ['الشركة أو المطوّر', 'Company or developer'],
  ['نوع المشروع *', 'Project type *'],
  ['مشروع سكني', 'Residential project'],
  ['مشروع تجاري', 'Commercial project'],
  ['حكومي / عام', 'Government / public'],
  ['الهاتف / واتساب', 'Phone / WhatsApp'],
  ['الهاتف أو واتساب', 'Phone or WhatsApp'],
  ['نبذة عن المشروع', 'Project brief'],
  ['نبذة مختصرة عن مشروعك...', 'A short brief about your project…'],
  ['نبذة مختصرة عن المشروع', 'Short project brief'],
  ['إرسال الطلب ←', 'Submit request →'],
  ['شكرًا لك!', 'Thank you!'],
  ['سنتواصل معك قريبًا.', 'We’ll be in touch shortly.'],
  ['واتساب', 'WhatsApp'],

  /* Form JS strings */
  ['يرجى إدخال الاسم الكامل ورقم الجوال وبريد الشركة.', 'Please enter your full name, mobile number, and company email.'],
  ['يرجى استخدام بريد الشركة (وليس Gmail أو Hotmail أو ما شابه)، مع الاسم الكامل ورقم الجوال.', 'Please use a company email (not Gmail, Hotmail, or similar), along with your full name and mobile number.'],
  ['يرجى إكمال بيانات الشركة ونوع المشروع والمدينة.', 'Please complete company, project type, and city.'],
  ['يرجى إدخال رقم جوال صحيح مع الاسم وبريد الشركة.', 'Please enter a valid mobile number with your name and company email.'],
  ['جارٍ الإرسال…', 'Sending…'],
  ['تم إرسال طلبك بنجاح! سنتواصل معك خلال 24 ساعة.', 'Your request was sent successfully! We’ll contact you within 24 hours.'],
  ['حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.', 'Something went wrong. Please try again or reach us on WhatsApp.'],
  ["'ProjectLaunch\\u2122: طلب جلسة إطلاق'", "'ProjectLaunch\\u2122: Launch session request'"],

  /* Gallery aria / alts remaining */
  ['معرض ميثاق مكة 1', 'Makkah Charter gallery 1'],
  ['معرض ميثاق مكة 2', 'Makkah Charter gallery 2'],
  ['معرض ميثاق مكة 3', 'Makkah Charter gallery 3'],
  ['معرض ميثاق مكة 4', 'Makkah Charter gallery 4'],
  ['معرض ميثاق مكة 5', 'Makkah Charter gallery 5'],
  ['معرض ميثاق مكة 6', 'Makkah Charter gallery 6'],
  ['معرض ميثاق مكة 7', 'Makkah Charter gallery 7'],
  ['معرض ميثاق مكة 8', 'Makkah Charter gallery 8'],
  ['معرض ميثاق مكة 9', 'Makkah Charter gallery 9'],
  ['معرض ميثاق مكة 10', 'Makkah Charter gallery 10'],
  ['معرض ميثاق مكة 11', 'Makkah Charter gallery 11'],
  ['معرض ميثاق مكة 12', 'Makkah Charter gallery 12'],
  ['الأولى النخيل', 'AlOula Al Nakheel'],
  ['رفال', 'Rafal'],
  ['مكيون', 'Makkiyoon'],
];

/* Sort by Arabic length desc so longer phrases win */
T.sort((a, b) => b[0].length - a[0].length);
for (const [ar, en] of T) {
  if (!ar) continue;
  html = html.split(ar).join(en);
}

/* Fix FAQ title fragments that wrap ProjectLaunch™ */
html = html.replace(
  /What does\s*<span class="pl-mark">ProjectLaunch<span class="tm">&#8482;<\/span><\/span>\s*\؟?/,
  'What does <span class="pl-mark">ProjectLaunch<span class="tm">&#8482;</span></span> include?'
);
html = html.replace(
  /We already have a marketing agency — do we still need\s*<span class="pl-mark">ProjectLaunch<span class="tm">&#8482;<\/span><\/span>\s*\؟?/,
  'We already have a marketing agency — do we still need <span class="pl-mark">ProjectLaunch<span class="tm">&#8482;</span></span>?'
);
html = html.replace(
  /If you answered “no” to more than one question…\s*<span class="pl-mark">ProjectLaunch<span class="tm">&#8482;<\/span><\/span>\s*may be exactly what your project needs\./,
  'If you answered “no” to more than one question… <span class="pl-mark">ProjectLaunch<span class="tm">&#8482;</span></span> may be exactly what your project needs.'
);
html = html.replace(
  /Our team can scope\s*<span class="pl-mark">ProjectLaunch<span class="tm">&#8482;<\/span><\/span>\s*and share a clear proposal within 48 hours\./,
  'Our team can scope <span class="pl-mark">ProjectLaunch<span class="tm">&#8482;</span></span> and share a clear proposal within 48 hours.'
);

/* Sticky + nav CTAs → in-page lead form */
html = html.replace(
  /data-cta="sticky-book">[^<]+</,
  'data-cta="sticky-book">Book a launch session<'
);
html = html.replace(
  /class="nav-link nav-mobile-cta" href="[^"]*"/,
  'class="nav-link nav-mobile-cta" href="#lead-form"'
);
html = html.replace(
  /href="[^"]*" class="nav-cta btn-pill btn-pill-gold">Book Session</,
  'href="#lead-form" class="nav-cta btn-pill btn-pill-gold">Book Session<'
);

/* EN portfolio peer links */
html = html.replaceAll('href="../portfolio.html"', 'href="../portfolio-en.html"');
html = html.replaceAll('Book your launch session', 'Book a launch session');

/* Assessment note + Arabic digits if any remain */
html = html.replace(/«لا»|“لا”/g, '“no”');
html = html.replace(/>١</g, '>1<').replace(/>٢</g, '>2<').replace(/>٣</g, '>3<').replace(/>٤</g, '>4<').replace(/>٥</g, '>5<');

/* Polished headline overrides (applied after bulk map) */
const polish = [
  ['The complete system to launch your project', 'The complete launch system for your project'],
  ['What will your project receive?', 'What you take to market'],
  ['What your project walks away with', 'What you take to market'],
  ['Smart models and interactive displays', 'Smart models. Interactive presence.'],
  ['How we turned project presentation into persuasion', 'Where presentation became persuasion'],
  ['How we turned presentation into persuasion', 'Where presentation became persuasion'],
  ['Is your project truly ready to launch?', 'Is your project actually launch-ready?'],
  ['>Methodology<', '>The launch method<'],
  ['Questions decision-makers ask before booking', 'What decision-makers ask before they book'],
];
for (const [a, b] of polish) html = html.split(a).join(b);

/* Float widgets cache bump */
html = html.replace('gh-float-widgets.js?v=6', 'gh-float-widgets.js?v=7');

/* Form labels that may remain as Arabic attribute leftovers */
html = html.replace(/aria-label="الاسم الكامل"/g, 'aria-label="Full name"');
html = html.replace(/placeholder="الاسم الكامل"/g, 'placeholder="Full name"');

/* Float subject already handled; ensure popup titles EN */
html = html.replace(/title="واتساب"/g, 'title="WhatsApp"');
html = html.replace(/title="سجّل اهتمامك"/g, 'title="Register your interest"');
html = html.replace(/title="تواصل معنا"/g, 'title="Contact us"');

/* Sweep remaining Arabic in visible content (report) */
const leftover = [...html.matchAll(/[\u0600-\u06FF]+/g)].map((m) => m[0]);
const uniq = [...new Set(leftover)].filter((w) => w.length > 1);

fs.writeFileSync(OUT_EN, html);
console.log('Wrote', path.relative(ROOT, OUT_EN));
console.log('Remaining Arabic tokens:', uniq.length);
if (uniq.length) console.log(uniq.slice(0, 80).join(' | '));
