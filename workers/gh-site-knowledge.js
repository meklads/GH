/**
 * Structured site knowledge for GH assistant (single source of truth).
 * Worker imports directly; client bundle via scripts/build-chat-knowledge.mjs
 */

export const WHATSAPP = '966502786513';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP}`;
export const PHONE_DISPLAY = '+966 50 278 6513';
export const PHONES = {
  sa: { display: '+966 50 278 6513', wa: '966502786513', label: { ar: 'السعودية · جدة', en: 'Saudi · Jeddah' } },
  om: { display: '+968 9132 6735', wa: '96891326735', label: { ar: 'عُمان', en: 'Oman' } },
  bh: { display: '+973 3215 0369', wa: '97332150369', label: { ar: 'البحرين', en: 'Bahrain' } },
};
export const EMAIL = 'info@3dgraphicshouse.com';
export const RESPONSE_SLA = { ar: 'نرد خلال يوم عمل واحد', en: 'We reply within one business day' };

export const SITE = {
 company: {
 ar: 'Graphics House (جرافيكس هاوس): استوديو إطلاق بصري B2B للمطورين العقاريين والمؤسسات في السعودية والخليج. مجسمات ذكية، CGI سينمائي، تجارب تفاعلية، وأنظمة إطلاق متكاملة من جدة.',
 en: 'Graphics House is a B2B visual launch studio for real estate developers and institutions across the Gulf. Smart maquettes, cinematic CGI, interactive experiences, and connected launch systems from Jeddah.',
 },
 contact: {
 phone: PHONE_DISPLAY,
 whatsapp: WHATSAPP_LINK,
 email: EMAIL,
 hq: { ar: 'جدة، المملكة العربية السعودية', en: 'Jeddah, Saudi Arabia' },
 branches: [
 { ar: 'جدة: المركز الرئيسي', en: 'Jeddah: Head office' },
 { ar: 'مسقط، سلطنة عمان', en: 'Muscat, Oman' },
 { ar: 'المنامة، مملكة البحرين', en: 'Manama, Bahrain' },
 ],
 responseSla: RESPONSE_SLA,
 },
 packages: {
 name: { ar: 'باقات GH Direct', en: 'GH Direct Packages' },
 url: { ar: '/Packages.html', en: '/Packages-en.html' },
 lead: {
 ar: 'ثلاث باقات حسب مرحلة المشروع. التسعير بعرض سعر بعد الاجتماع، دون دفع إلكتروني.',
 en: 'Three packages by project stage. Pricing by quote after the meeting. No online checkout.',
 },
 tiers: [
 {
 id: 'basic',
 name: { ar: 'باقة التعريف', en: 'Basic Package' },
 stage: { ar: 'قبل الطرح', en: 'Pre-launch' },
 },
 {
 id: 'launch',
 name: { ar: 'باقة البيع المبكر', en: 'Early Sales Package' },
 stage: { ar: 'أثناء البناء', en: 'During construction' },
 },
 {
 id: 'growth',
 name: { ar: 'باقة الإطلاق الكامل', en: 'Full Launch Package' },
 stage: { ar: 'بعد الإنجاز', en: 'After completion' },
 },
 ],
 },
 products: [
 {
 id: 'brandscale',
 name: 'BrandScale™',
 desc: {
 ar: 'نظام نمو العلامة: يثبت الهوية والحضور البصري قبل الطرح.',
 en: 'Brand growth system: locks identity and market position before launch.',
 },
 url: { ar: '/solutions/brand-scale.html', en: '/solutions/brand-scale-en.html' },
 },
 {
 id: 'projectlaunch',
 name: 'ProjectLaunch™',
 desc: {
 ar: 'نظام إطلاق على الخارطة: رندرات، فيلم، صالة بيع، ومحتوى إطلاق من موجز واحد.',
 en: 'Off-plan launch system: renders, film, sales gallery, and launch content from one brief.',
 },
 url: { ar: '/solutions/project-launch.html', en: '/solutions/project-launch-en.html' },
 },
 {
 id: 'growthlaunch',
 name: 'GrowthLaunch™',
 desc: {
 ar: 'نظام تمكين البيع: صفحة هبوط، مسار استفسار، واتساب، وتتبع.',
 en: 'Sales enablement system: landing experience, inquiry path, WhatsApp, and tracking.',
 },
 url: { ar: '/solutions/growth-launch.html', en: '/solutions/growth-launch-en.html' },
 },
 {
 id: 'institutional',
 name: 'Institutional Events',
 desc: {
 ar: 'فعاليات ومعارض مؤسسية: مجسمات، أفلام، بيئات عرض، وتجارب تفاعلية للمنتديات والمؤسسات.',
 en: 'Institutional events and exhibitions: maquettes, films, display environments, and interactive experiences.',
 },
 url: { ar: '/solutions/institutional-events.html', en: '/solutions/institutional-events-en.html' },
 },
 {
 id: 'partner',
 name: 'Agency Partner Network™',
 desc: {
 ar: 'شراكة B2B للوكالات: CGI ومجسمات وتفاعلي كطبقة إنتاج white-label.',
 en: 'B2B agency partnership: CGI, maquettes, and interactive as a white-label production layer.',
 },
 url: { ar: '/partner-network.html', en: '/partner-network-en.html' },
 },
 ],
 services: [
 { id: 'cgi', name: { ar: 'سينمائي CGI', en: 'Cinematic CGI' }, url: { ar: '/services/cinematic-cgi.html', en: '/services/cinematic-cgi-en.html' } },
 { id: 'rendering', name: { ar: 'الإظهار المعماري', en: 'Architectural Rendering' }, url: { ar: '/services/rendering.html', en: '/services/rendering-en.html' } },
 { id: 'maquettes', name: { ar: 'مجسمات ذكية', en: 'Smart Maquettes' }, url: { ar: '/services/maquettes.html', en: '/services/maquettes-en.html' } },
 { id: 'scale', name: { ar: 'مجسمات معمارية', en: 'Scale Models' }, url: { ar: '/services/maquettes.html', en: '/services/maquettes-en.html' } },
 { id: 'interactive', name: { ar: 'تجارب تفاعلية', en: 'Interactive Experiences' }, url: { ar: '/services/interactive-experiences.html', en: '/services/interactive-experiences-en.html' } },
 { id: 'vr', name: { ar: 'VR / 360', en: 'VR / 360' }, url: { ar: '/services/vr-360.html', en: '/services/vr-360-en.html' } },
 { id: 'galleries', name: { ar: 'جاليريات وديكور مكاني', en: 'Galleries & Spatial Design' }, url: { ar: '/services/galleries.html', en: '/services/galleries-en.html' } },
 { id: 'production', name: { ar: 'ميديا برودكشن', en: 'Media Production' }, url: { ar: '/services/production.html', en: '/services/production-en.html' } },
 { id: 'photography', name: { ar: 'التصوير المعماري والإعلامي', en: 'Architectural Photography & Media' }, url: { ar: '/services/photography-media.html', en: '/services/photography-media-en.html' } },
 { id: 'branding', name: { ar: 'الهوية البصرية', en: 'Visual Identity & Branding' }, url: { ar: '/services/branding.html', en: '/services/branding-en.html' } },
 { id: 'animation', name: { ar: 'الأنيميشن والموشن', en: 'Animation & Motion' }, url: { ar: '/services/animation.html', en: '/services/animation-en.html' } },
 { id: 'digital', name: { ar: 'التسويق الرقمي', en: 'Digital Marketing' }, url: { ar: '/services/digital-marketing.html', en: '/services/digital-marketing-en.html' } },
 { id: 'ai', name: { ar: 'حلول AI', en: 'AI Solutions' }, url: { ar: '/services/ai-solutions.html', en: '/services/ai-solutions-en.html' } },
 { id: 'web', name: { ar: 'حلول ويب', en: 'Web Solutions' }, url: { ar: '/services/web-solutions.html', en: '/services/web-solutions-en.html' } },
 ],
 clients: [
 { ar: 'مصرف الراجحي', en: 'Al Rajhi Bank' },
 { ar: 'رفال للتطوير', en: 'Raffal Development' },
 { ar: 'عنان إسكان', en: 'Anan Eskan' },
 { ar: 'الأولى للتطوير', en: 'Al-Owla Development' },
 { ar: 'عقارات العيسائي', en: 'Al-Essai Real Estate' },
 { ar: 'العيوني', en: 'Al-Oyouni' },
 { ar: 'مكيون', en: 'Makioun' },
 { ar: 'تويوتا', en: 'Toyota' },
 { ar: 'المركز الطبي الدولي (IMC)', en: 'International Medical Center (IMC)' },
 { ar: 'هيئة المدن الصناعية (MODON)', en: 'MODON' },
 { ar: 'مجموعة بن زومة', en: 'Bin Zomah Group' },
 { ar: 'الخياط للطوب الأحمر', en: 'Al-Khayat Red Brick' },
 { ar: 'أوتيك', en: 'Oteck' },
 { ar: 'رابطة العالم الإسلامي', en: 'Muslim World League (MWL)' },
 ],
 projects: [
 { client: { ar: 'مصرف الراجحي', en: 'Al Rajhi Bank' }, title: { ar: 'مجسم ذكي وفيلم سينمائي لإطلاق مشروع نسيم الحرم — مكة', en: 'Smart maquette & cinematic film for the Naseem Al-Haram launch — Makkah' }, services: ['maquette', 'cgi', 'rendering', 'galleries'], url: { ar: '/insights/projects/naseem-al-haram-makkah.html', en: '/insights/projects/naseem-al-haram-makkah-en.html' } },
 { client: { ar: 'عنان إسكان', en: 'Anan Eskan' }, title: { ar: 'إظهار معماري ومجسم لمجمع سكني — الرياض', en: 'Archviz & maquette for residential community — Riyadh' }, services: ['rendering', 'cgi', 'maquette'], url: { ar: '/insights/projects/anan-eskan-riyadh.html', en: '/insights/projects/anan-eskan-riyadh-en.html' } },
 { client: { ar: 'رابطة العالم الإسلامي', en: 'Muslim World League' }, title: { ar: 'ميثاق مكة — مجسم ذكي وبيئة تفاعلية', en: 'Makkah Charter — smart maquette & interactive environment' }, services: ['maquette', 'interactive'], url: { ar: '/insights/projects/makkah-charter-mwl.html', en: '/insights/projects/makkah-charter-mwl-en.html' } },
 { client: { ar: 'ملتقى جدة للعقار', en: 'Jeddah Real Estate Forum' }, title: { ar: 'هوية بصرية وفيلم سينمائي ومنظومة محتوى', en: 'Brand identity, cinematic film & content system' }, services: ['branding', 'cgi', 'production'], url: { ar: '/case-studies/jeddah-real-estate-forum.html', en: '/case-studies/jeddah-real-estate-forum-en.html' } },
 { client: { ar: 'الأولى — النخيل', en: 'Al-Owla Nakheel' }, title: { ar: 'تصور سينمائي لوحدات سكنية', en: 'Cinematic visualization for residential units' }, services: ['cgi', 'rendering'], url: { ar: '/insights/projects/al-owla-nakheel.html', en: '/insights/projects/al-owla-nakheel-en.html' } },
 { client: { ar: 'أبراج الخير — مكة', en: 'Al Khair Heights — Makkah' }, title: { ar: 'إظهار معماري سكني باحترام السياق', en: 'Residential archviz with place sensitivity' }, services: ['rendering', 'cgi'], url: { ar: '/insights/projects/al-khair-makkah.html', en: '/insights/projects/al-khair-makkah-en.html' } },
 { client: { ar: 'كداء — مكة', en: 'Kuday — Makkah' }, title: { ar: 'إظهار واقعي لبرج سكني', en: 'Photorealistic tower archviz' }, services: ['rendering'], url: { ar: '/insights/projects/kuday-makkah.html', en: '/insights/projects/kuday-makkah-en.html' } },
 { client: { ar: 'عقارات العيسائي — واحة السلام', en: 'Al-Essai Real Estate — Wahat Al Salam' }, title: { ar: 'مخطط حي كامل وأفلام وكتالوج — بيع كل الوحدات', en: 'Living master plan, films & catalogue — full sell-out' }, services: ['rendering', 'cgi', 'branding', 'production'], url: { ar: '/insights/projects/wahat-al-salam.html', en: '/insights/projects/wahat-al-salam-en.html' } },
 ],
 insights: {
 articles: { ar: '/insights/articles.html', en: '/insights/articles.html' },
 reports: { ar: '/insights/reports.html', en: '/insights/reports.html' },
 tools: {
 brief: { ar: '/insights/tools/project-brief.html', en: '/insights/tools/project-brief-en.html' },
 checklist: { ar: '/insights/tools/launch-checklist.html', en: '/insights/tools/launch-checklist-en.html' },
 finder: { ar: '/insights/tools/solution-finder.html', en: '/insights/tools/solution-finder-en.html' },
 },
 },
 portfolio: { ar: '/portfolio.html', en: '/portfolio-en.html' },
};

export const GREETING_PHRASES = [
 'السلام عليكم',
 'عليكم السلام',
 'سلام عليكم',
 'سلام',
 'مرحباً',
 'مرحبا',
 'أهلاً',
 'أهلا',
 'اهلا',
 'هلا',
 'صباح الخير',
 'مساء الخير',
 'hello',
 'hi',
 'hey',
 'good morning',
 'good evening',
 'good afternoon',
 'howdy',
 'salam',
 'assalamu alaikum',
 'assalam',
];

export const HUMAN_KEYWORDS = {
 ar: [
 'انسان', 'إنسان', 'بشر', 'شخص', 'موظف', 'ممثل', 'مسؤول', 'مدير', 'مبيعات',
 'اتكلم مع', 'تكلم مع', 'تحدث مع', 'كلم', 'كلمني', 'تواصل مع شخص', 'موظف حقيقي',
 'بشري', 'م consultant', 'استشاري', 'فريق', 'مختص',
 ],
 en: [
 'human', 'person', 'agent', 'representative', 'rep', 'sales', 'manager',
 'speak to', 'talk to', 'real person', 'someone', 'team member', 'consultant',
 'call me', 'connect me', 'live chat', 'staff',
 ],
};

export const KEYWORDS = {
 ar: {
 human: HUMAN_KEYWORDS.ar,
 greeting: ['سلام', 'السلام', 'عليكم', 'مرحب', 'أهلا', 'اهلا', 'هلا', 'صباح', 'مساء', 'hello', 'hi', 'hey', 'good morning', 'good evening'],
 services: ['خدمات', 'خدمة', 'تقدمون', 'cgi', 'سينمائي', 'إظهار', 'تصور', 'ماذا تقدم'],
 quote: ['سعر', 'عرض سعر', 'تكلفة', 'بكم', 'ميزانية', 'تسعير', 'quotation', 'كم السعر'],
 packages: ['باقة', 'باقات', 'packages', 'package', 'gh direct', 'direct'],
 session: ['جلسة', 'احجز', 'موعد', 'book a session', 'meeting'],
 contact: ['اتصال', 'تواصل', 'رقم', 'جوال', 'ايميل', 'بريد'],
 whatsapp: ['واتس', 'whatsapp', 'واتساب'],
 maquette: ['مجسم', 'مقياس', 'ماكيت', 'maquette', 'model', 'مجسمات'],
 clients: ['عميل', 'عملاء', 'شركات', 'الراجحي', 'رفال', 'عنان', 'portfolio', 'أعمال', 'من عمل'],
 projects: ['مشاريع', 'case', 'دراسة', 'نجاح', 'سابق', 'نفذتم', 'عملتم'],
 location: ['فرع', 'موقع', 'عنوان', 'مكتب', 'جدة', 'مسقط', 'منامة', 'فروع'],
 launch: ['launch', 'إطلاق', 'projectlaunch', 'growthlaunch', 'brandscale', 'منتج', 'نظام'],
 partner: ['شريك', 'وكالة', 'agency', 'partner', 'white label'],
 insights: ['مقال', 'insights', 'تقرير', 'checklist', 'موجز', 'معرفة'],
 cgi: ['فيلم', 'فيديو', 'animation', 'أنيميشن', 'سينema', 'مونتاج', 'موشن'],
 interactive: ['تفاعلي', 'touch', 'شاشة', 'virtual', 'vr'],
 galleries: ['جاليري', 'معرض', 'صالة', 'ديكور', 'showroom'],
 },
 en: {
 human: HUMAN_KEYWORDS.en,
 greeting: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'salam', 'assalam', 'سلام', 'مرحب', 'أهلا', 'هلا'],
 services: ['service', 'cgi', 'render', 'visualization', 'visualisation', 'animation', 'what do you offer', 'capabilities'],
 quote: ['quote', 'price', 'cost', 'pricing', 'budget', 'estimate', 'how much', 'quotation'],
 packages: ['package', 'packages', 'gh direct', 'pricing package', 'stage package'],
 session: ['book a session', 'book session', 'meeting', 'schedule', 'appointment'],
 contact: ['contact', 'email', 'phone', 'call', 'reach'],
 whatsapp: ['whatsapp', 'wa.me'],
 maquette: ['maquette', 'model', 'physical', 'scale model', 'maquettes'],
 clients: ['client', 'clients', 'portfolio', 'al rajhi', 'raffal', 'anan', 'toyota', 'who do you work'],
 projects: ['projects', 'case study', 'past work', 'delivered', 'examples', 'reference'],
 location: ['branch', 'office', 'location', 'address', 'jeddah', 'muscat', 'manama', 'branches'],
 launch: ['launch', 'projectlaunch', 'growthlaunch', 'brandscale', 'off-plan', 'offplan', 'system'],
 partner: ['partner', 'agency', 'white-label', 'whitelabel'],
 insights: ['article', 'insights', 'report', 'checklist', 'brief', 'hub', 'knowledge'],
 cgi: ['film', 'cinematic', 'video', 'animation'],
 interactive: ['interactive', 'touchscreen', 'virtual', 'vr', '360'],
 galleries: ['gallery', 'showroom', 'sales center', 'decor'],
 },
};

export const PAGE_CONTEXT = [
 { match: /Packages(-en)?\.html/i, intent: 'packages', quick: ['packages', 'quote', 'session', 'human'] },
 { match: /project-launch|growth-launch|brand-scale|institutional-events/i, intent: 'launch', quick: ['launch', 'packages', 'quote', 'human'] },
 { match: /partner-network/i, intent: 'partner', quick: ['partner', 'quote', 'human'] },
 { match: /portfolio|case-study|casestudy/i, intent: 'projects', quick: ['projects', 'clients', 'quote'] },
 { match: /insights\//i, intent: 'insights', quick: ['insights', 'projects', 'quote'] },
 { match: /services\/maquettes|smart-maquettes|scale-models/i, intent: 'maquette', quick: ['maquette', 'projects', 'quote'] },
 { match: /contact-us/i, intent: 'session', quick: ['session', 'quote', 'packages', 'human'] },
 { match: /services\//i, intent: 'services', quick: ['services', 'packages', 'quote', 'human'] },
];

export function getSystemContext(lang) {
 const L = lang === 'ar' ? 'ar' : 'en';
 const pkg = SITE.packages;
 const lines = [
 SITE.company[L],
 '',
 'CONTACT:',
 `WhatsApp (primary): ${WHATSAPP_LINK}`,
 `Saudi: ${PHONES.sa.display}`,
 `Oman: ${PHONES.om.display}`,
 `Bahrain: ${PHONES.bh.display}`,
 `Email: ${EMAIL}`,
 `HQ: ${SITE.contact.hq[L]}`,
 `Response SLA: ${RESPONSE_SLA[L]}`,
 '',
 'GH DIRECT PACKAGES:',
 pkg.lead[L],
 ...pkg.tiers.map((t) => `- ${t.name[L]} (${t.stage[L]})`),
 `Page: ${pkg.url[L]}`,
 '',
 'LAUNCH PRODUCTS:',
 ...SITE.products.map((p) => `- ${p.name}: ${p.desc[L]} (${p.url[L]})`),
 '',
 'SERVICES:',
 ...SITE.services.map((s) => `- ${s.name[L]} (${s.url[L]})`),
 '',
 'KEY CLIENTS:',
 SITE.clients.map((c) => c[L]).join(', '),
 '',
 'REFERENCE PROJECTS:',
 ...SITE.projects.map((p) => `- ${p.client[L]}: ${p.title[L]}`),
 '',
 'RULES:',
 L === 'ar'
 ? [
     'أجب باختصار (3-6 جمل) بلغة بشرية مباشرة.',
     'لا تستخدم الشرطة الطويلة (—). استخدم نقطة أو فاصلة.',
     'لا تختلق أسعاراً أو أرقاماً. التسعير بعد الاجتماع فقط.',
     'إذا سأل عن الباقات: اشرح المراحل الثلاث ووجّه إلى /Packages.html.',
     'إذا طلب التحدث مع الفريق: اعرض واتساب + نموذج استفسار + اترك رقمك، ولا تفتح واتساب تلقائياً.',
     'شجّع حجز جلسة إطلاق عند الجاهزية.',
     'يمكنك استخدام HTML بسيط: <strong> <br> <a>.',
   ].join(' ')
 : [
     'Reply briefly (3-6 sentences) in clear, natural English.',
     'Never use em dashes. Prefer periods or commas.',
     'Never invent prices or metrics. Pricing is confirmed after the meeting only.',
     'If asked about packages: explain the three stages and link /Packages-en.html.',
     'If they want a human: offer WhatsApp, the enquiry form, and leave-your-number. Never auto-open WhatsApp.',
     'Encourage booking a launch session when they are ready.',
     'Simple HTML is allowed: <strong> <br> <a>.',
   ].join(' '),
 ];
 return lines.join('\n');
}

export function serializeForClient() {
 return {
 whatsapp: WHATSAPP,
 whatsappLink: WHATSAPP_LINK,
 phone: PHONE_DISPLAY,
 email: EMAIL,
 site: SITE,
 humanKeywords: HUMAN_KEYWORDS,
 greetingPhrases: GREETING_PHRASES,
 keywords: KEYWORDS,
 };
}
