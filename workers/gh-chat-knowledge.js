/**
 * Chat intent matching + HTML replies built from gh-site-knowledge.js
 */
import {
  SITE,
  WHATSAPP_LINK,
  PHONE_DISPLAY,
  PHONES,
  EMAIL,
  RESPONSE_SLA,
  PAGE_CONTEXT,
  getSystemContext,
} from './gh-site-knowledge.js';
import {
  greetingReplyLang,
  quickRepliesForIntent,
  matchIntent,
  analyzeMessage,
} from './gh-chat-matcher.js';

export { getSystemContext, serializeForClient } from './gh-site-knowledge.js';
export { analyzeMessage, matchIntent, isGreeting, greetingReplyLang, quickRepliesForIntent } from './gh-chat-matcher.js';

const WA_BTN = {
  ar: '<a href="#" data-gh-chat-action="whatsapp">💬 واتساب مع الفريق</a>',
  en: '<a href="#" data-gh-chat-action="whatsapp">💬 WhatsApp our team</a>',
};
const FORM_BTN = {
  ar: '<a href="#" data-gh-chat-action="open-form">📝 نموذج استفسار</a>',
  en: '<a href="#" data-gh-chat-action="open-form">📝 Enquiry form</a>',
};
const LEAD_BTN = {
  ar: '<a href="#" data-gh-chat-action="lead-capture">📞 اترك رقمك لنعاود الاتصال</a>',
  en: '<a href="#" data-gh-chat-action="lead-capture">📞 Leave your number for a callback</a>',
};

function connectCtas(lang) {
  const k = L(lang);
  return `${FORM_BTN[k]} · ${WA_BTN[k]} · ${LEAD_BTN[k]}<br><span style="opacity:.75;font-size:12px">${RESPONSE_SLA[k]}</span>`;
}

function L(lang) {
  return lang === 'ar' ? 'ar' : 'en';
}

function link(url, label) {
  return `<a href="${url}">${label}</a>`;
}

function servicesList(lang) {
  const key = L(lang);
  return SITE.services
    .slice(0, 8)
    .map((s, i) => `${i + 1}️⃣ <strong>${s.name[key]}</strong>: ${link(s.url[key], lang === 'ar' ? 'تفاصيل' : 'Details')}`)
    .join('<br>');
}

function productsList(lang) {
  const key = L(lang);
  return SITE.products
    .filter((p) => ['brandscale', 'projectlaunch', 'growthlaunch'].includes(p.id))
    .map((p) => `🚀 <strong>${p.name}</strong>: ${p.desc[key]} ${link(p.url[key], lang === 'ar' ? 'المزيد' : 'More')}`)
    .join('<br><br>');
}

function packagesList(lang) {
  const key = L(lang);
  const pkg = SITE.packages;
  const tiers = pkg.tiers
    .map((t, i) => `${i + 1}️⃣ <strong>${t.name[key]}</strong> (${t.stage[key]})`)
    .join('<br>');
  return `${pkg.lead[key]}<br><br>${tiers}<br><br>📎 ${link(pkg.url[key], lang === 'ar' ? 'صفحة الباقات' : 'Packages page')}`;
}

function clientsList(lang) {
  const key = L(lang);
  return SITE.clients.map((c) => c[key]).join(' · ');
}

function projectsList(lang, limit = 6) {
  const key = L(lang);
  return SITE.projects
    .slice(0, limit)
    .map((p) => `🏗️ <strong>${p.client[key]}</strong>: ${p.title[key]} ${link(p.url[key], lang === 'ar' ? 'المشروع' : 'Project')}`)
    .join('<br><br>');
}

export const REPLIES = {
  ar: {
    welcome: `مرحباً! 👋 أنا مساعد <strong>Graphics House</strong>.<br><br>أسألني عن <strong>الباقات</strong>، أنظمة Launch™، الخدمات، المشاريع، أو احجز <strong>جلسة إطلاق</strong>. ${RESPONSE_SLA.ar}.`,
    greeting: `أهلاً بك! 👋<br><br>كيف أقدر أساعدك اليوم: باقات، خدمات، مشروع، أو تواصل مع الفريق؟`,
    human: `تمام. تقدر تتواصل مع الفريق مباشرة:<br><br>${connectCtas('ar')}<br><br>📞 السعودية: <a href="tel:${PHONES.sa.display.replace(/ /g,'')}">${PHONES.sa.display}</a><br>📞 عُمان: <a href="tel:${PHONES.om.display.replace(/ /g,'')}">${PHONES.om.display}</a><br>📞 البحرين: <a href="tel:${PHONES.bh.display.replace(/ /g,'')}">${PHONES.bh.display}</a>`,
    services: `خدماتنا للمطورين والمؤسسات في الخليج:<br><br>${servicesList('ar')}<br><br>📎 ${link('/Packages.html', 'الباقات')} · ${link(SITE.portfolio.ar, 'معرض الأعمال')}<br><br>${connectCtas('ar')}`,
    packages: `باقات <strong>GH Direct</strong>:<br><br>${packagesList('ar')}<br><br>الأنسب؟ احجز جلسة وسنرشّح الباقة حسب مرحلة مشروعك.<br><br>${connectCtas('ar')}`,
    session: `جلسة الإطلاق توضح مرحلتك والباقة الأنسب خلال اجتماع قصير.<br><br>📎 ${link('/contact-us.html?intent=session', 'احجز جلسة')}<br><br>${connectCtas('ar')}`,
    quote: `للتسعير نحتاج موجزاً سريعاً:<br><br>📌 نوع المشروع والمقاس<br>📅 الجدول<br>📍 الموقع<br>📎 رسومات إن وُجدت<br><br>⚠️ لا أسعار جاهزة على الموقع. التسعير بعد الاجتماع حسب النطاق.<br><br>${connectCtas('ar')}`,
    contact: `تواصل معنا:<br><br>${connectCtas('ar')}<br><br>📧 <a href="mailto:${EMAIL}">${EMAIL}</a><br>📍 ${SITE.contact.hq.ar}`,
    whatsapp: `افتح واتساب مع الفريق:<br><br>${WA_BTN.ar}<br><br>${RESPONSE_SLA.ar}.`,
    maquette: `المجسمات الذكية: حرفية + تقنية.<br><br>🏗️ فلل، أبراج، مدن سكنية، أراضي مخطط<br>✨ إسقاط ضوئي · بيانات حية · إضاءة وصوت<br>📐 توصيل وتركيب<br><br>📎 ${link('/services/maquettes.html', 'مجسمات ذكية')}<br><br>${connectCtas('ar')}`,
    clients: `من عملائنا:<br><br>🏢 ${clientsList('ar')}<br><br>📎 ${link(SITE.portfolio.ar, 'استعرض الأعمال')}`,
    projects: `مشاريع مرجعية:<br><br>${projectsList('ar')}<br><br>📎 ${link(SITE.portfolio.ar, 'كل الأعمال')}`,
    location: `فروعنا:<br><br>${SITE.contact.branches.map((b) => `📍 ${b.ar}`).join('<br>')}<br><br>📞 ${PHONES.sa.display} · ${PHONES.om.display} · ${PHONES.bh.display}`,
    launch: `أنظمة <strong>Launch™</strong>:<br><br>${productsList('ar')}<br><br>📎 ${link('/Packages.html', 'أو ابدأ من الباقات')}`,
    partner: `شبكة شركاء الوكالات™:<br><br>✅ CGI · مجسمات · تفاعلي · ميديا<br>✅ White-label أو co-branded<br><br>📎 ${link('/partner-network.html', 'تفاصيل الشراكة')}`,
    insights: `مركز المعرفة:<br><br>📚 ${link(SITE.insights.articles.ar, 'مقالات')} · ${link(SITE.insights.reports.ar, 'تقارير')}<br>🛠️ ${link(SITE.insights.tools.brief.ar, 'موجز المشروع')} · ${link(SITE.insights.tools.checklist.ar, 'قائمة الإطلاق')} · ${link(SITE.insights.tools.finder.ar, 'Solution Finder')}`,
    cgi: `الإنتاج السينمائي CGI:<br><br>🎬 أفلام إطلاق · جولات سينمائية · سرد بصري<br>📎 ${link('/services/cinematic-cgi.html', 'سينمائي CGI')} · ${link('/services/animation.html', 'أنيميشن')}<br><br>${connectCtas('ar')}`,
    interactive: `التجارب التفاعلية:<br><br>🖥️ شاشات لمس · جولات افتراضية · VR/360<br>📎 ${link('/services/interactive-experiences.html', 'تجارب تفاعلية')}<br><br>${connectCtas('ar')}`,
    galleries: `جاليريات وديكور مكاني:<br><br>🏛️ تصميم تجربة صالة البيع والمعرض<br>🏗️ التنفيذ الميداني عبر <a href="https://turriva.com" target="_blank" rel="noopener">توريفا</a><br>📎 ${link('/services/galleries.html', 'جاليريات وديكور')}`,
    rendering: `الإظهار المعماري: صور واقعية عالية الجودة.<br><br>🏙️ خارجي · داخلي · masterplan · مواد وإضاءة<br>📎 ${link('/services/rendering.html', 'إظهار معماري')}<br><br>${connectCtas('ar')}`,
    production: `ميديا برودكشن: تصوير وإنتاج متكامل.<br><br>🎥 تصوير · مونتاج · موشن · محتوى حملات<br>📎 ${link('/services/production.html', 'ميديا برودكشن')}`,
    branding: `الهوية البصرية: من الشعار إلى التطبيق المكاني.<br><br>🎨 هوية · guidelines · كتالوج · لافتات<br>📎 ${link('/services/branding.html', 'هوية بصرية')}`,
    project_inquiry: `ممتاز. يسعدنا سماع مشروعك.<br><br>شاركنا: النوع · المدينة · الجدول · أي رسومات.<br><br>${connectCtas('ar')}`,
    project_cgi: `ممتاز. فيديو/CGI من تخصصنا.<br><br>📎 ${link('/services/cinematic-cgi.html', 'سينمائي CGI')}<br><br>${connectCtas('ar')}`,
    project_production: `ممتاز. مشروع ميديا/إنتاج.<br><br>📎 ${link('/services/production.html', 'ميديا برودكشن')}<br><br>${connectCtas('ar')}`,
    project_rendering: `ممتاز. مشروع إظهار معماري.<br><br>📎 ${link('/services/rendering.html', 'إظهار معماري')}<br><br>${connectCtas('ar')}`,
    project_maquette: `ممتاز. مشروع مجسم ذكي.<br><br>📎 ${link('/services/maquettes.html', 'مجسمات ذكية')}<br><br>${connectCtas('ar')}`,
    fallback: `لم ألتقط السؤال بالكامل.<br><br>جرّب: الباقات · الخدمات · جلسة · أو تواصل مع الفريق.<br><br>${connectCtas('ar')}`,
  },
  en: {
    welcome: `Hello! 👋 I'm the <strong>Graphics House</strong> assistant.<br><br>Ask about <strong>packages</strong>, Launch™ systems, services, projects, or <strong>book a launch session</strong>. ${RESPONSE_SLA.en}.`,
    greeting: `Hello! 👋<br><br>How can I help: packages, services, a project, or talk to the team?`,
    human: `Of course. Reach the team directly:<br><br>${connectCtas('en')}<br><br>📞 Saudi: <a href="tel:${PHONES.sa.display.replace(/ /g,'')}">${PHONES.sa.display}</a><br>📞 Oman: <a href="tel:${PHONES.om.display.replace(/ /g,'')}">${PHONES.om.display}</a><br>📞 Bahrain: <a href="tel:${PHONES.bh.display.replace(/ /g,'')}">${PHONES.bh.display}</a>`,
    services: `Our services for Gulf developers and institutions:<br><br>${servicesList('en')}<br><br>📎 ${link('/Packages-en.html', 'Packages')} · ${link(SITE.portfolio.en, 'Portfolio')}<br><br>${connectCtas('en')}`,
    packages: `<strong>GH Direct</strong> packages:<br><br>${packagesList('en')}<br><br>Not sure which fits? Book a session and we will recommend by project stage.<br><br>${connectCtas('en')}`,
    session: `A launch session maps your stage and the right package in a short meeting.<br><br>📎 ${link('/contact-us-en.html?intent=session', 'Book a session')}<br><br>${connectCtas('en')}`,
    quote: `For pricing, share a short brief:<br><br>📌 Project type and scale<br>📅 Timeline<br>📍 Location<br>📎 Drawings if available<br><br>⚠️ No fixed prices on the site. Scope is confirmed after the meeting.<br><br>${connectCtas('en')}`,
    contact: `Get in touch:<br><br>${connectCtas('en')}<br><br>📧 <a href="mailto:${EMAIL}">${EMAIL}</a><br>📍 ${SITE.contact.hq.en}`,
    whatsapp: `Open WhatsApp with our team:<br><br>${WA_BTN.en}<br><br>${RESPONSE_SLA.en}.`,
    maquette: `Smart maquettes: craft plus technology.<br><br>🏗️ Villas, towers, communities, land plots<br>✨ Projection · live data · smart AV<br>📐 Delivery and install<br><br>📎 ${link('/services/maquettes-en.html', 'Smart maquettes')}<br><br>${connectCtas('en')}`,
    clients: `Selected clients:<br><br>🏢 ${clientsList('en')}<br><br>📎 ${link(SITE.portfolio.en, 'View portfolio')}`,
    projects: `Reference projects:<br><br>${projectsList('en')}<br><br>📎 ${link(SITE.portfolio.en, 'Full portfolio')}`,
    location: `Our branches:<br><br>${SITE.contact.branches.map((b) => `📍 ${b.en}`).join('<br>')}<br><br>📞 ${PHONES.sa.display} · ${PHONES.om.display} · ${PHONES.bh.display}`,
    launch: `<strong>Launch™</strong> systems:<br><br>${productsList('en')}<br><br>📎 ${link('/Packages-en.html', 'Or start with packages')}`,
    partner: `Agency Partner Network™:<br><br>✅ CGI · maquettes · interactive · media<br>✅ White-label or co-branded<br><br>📎 ${link('/partner-network-en.html', 'Partnership details')}`,
    insights: `Knowledge Hub:<br><br>📚 ${link(SITE.insights.articles.en, 'Articles')} · ${link(SITE.insights.reports.en, 'Reports')}<br>🛠️ ${link(SITE.insights.tools.brief.en, 'Project brief')} · ${link(SITE.insights.tools.checklist.en, 'Launch checklist')} · ${link(SITE.insights.tools.finder.en, 'Solution Finder')}`,
    cgi: `Cinematic CGI:<br><br>🎬 Launch films · cinematic tours · visual storytelling<br>📎 ${link('/services/cinematic-cgi-en.html', 'Cinematic CGI')} · ${link('/services/animation-en.html', 'Animation')}<br><br>${connectCtas('en')}`,
    interactive: `Interactive experiences:<br><br>🖥️ Touchscreens · virtual tours · VR/360<br>📎 ${link('/services/interactive-experiences-en.html', 'Interactive')}<br><br>${connectCtas('en')}`,
    galleries: `Sales galleries and spatial décor:<br><br>🏛️ Experience design for sales environments<br>🏗️ Physical delivery via <a href="https://turriva.com" target="_blank" rel="noopener">Turriva</a><br>📎 ${link('/services/galleries-en.html', 'Galleries')}`,
    rendering: `Architectural rendering: photoreal stills and masterplans.<br><br>🏙️ Exterior · interior · materials · lighting<br>📎 ${link('/services/rendering-en.html', 'Rendering')}<br><br>${connectCtas('en')}`,
    production: `Media production: photo, film, and motion.<br><br>🎥 Filming · editing · motion · campaign content<br>📎 ${link('/services/production-en.html', 'Media production')}`,
    branding: `Visual identity: logo to spatial application.<br><br>🎨 Brand systems · guidelines · catalogues<br>📎 ${link('/services/branding-en.html', 'Branding')}`,
    project_inquiry: `Great. Tell us about the project.<br><br>Share: type · city · timeline · any drawings.<br><br>${connectCtas('en')}`,
    project_cgi: `Excellent. Video/CGI is a core specialty.<br><br>📎 ${link('/services/cinematic-cgi-en.html', 'Cinematic CGI')}<br><br>${connectCtas('en')}`,
    project_production: `Great. Media/production project.<br><br>📎 ${link('/services/production-en.html', 'Media production')}<br><br>${connectCtas('en')}`,
    project_rendering: `Excellent. Archviz project.<br><br>📎 ${link('/services/rendering-en.html', 'Rendering')}<br><br>${connectCtas('en')}`,
    project_maquette: `Excellent. Smart maquette project.<br><br>📎 ${link('/services/maquettes-en.html', 'Smart maquettes')}<br><br>${connectCtas('en')}`,
    fallback: `I did not fully catch that.<br><br>Try: Packages · Services · Book a session · or Talk to the team.<br><br>${connectCtas('en')}`,
  },
};

export function defaultQuickReplies(lang) {
  const isAr = lang === 'ar';
  return isAr
    ? [
        { id: 'packages', label: 'الباقات' },
        { id: 'services', label: 'خدمات' },
        { id: 'session', label: 'احجز جلسة' },
        { id: 'quote', label: 'عرض سعر' },
        { id: 'projects', label: 'مشاريع' },
        { id: 'human', label: '💬 تحدث مع فريقنا' },
      ]
    : [
        { id: 'packages', label: 'Packages' },
        { id: 'services', label: 'Services' },
        { id: 'session', label: 'Book a session' },
        { id: 'quote', label: 'Get a quote' },
        { id: 'projects', label: 'Projects' },
        { id: 'human', label: '💬 Talk to our team' },
      ];
}

export function quickRepliesForPage(page, lang) {
  const base = defaultQuickReplies(lang);
  const path = String(page || '');
  for (const ctx of PAGE_CONTEXT) {
    if (ctx.match.test(path)) {
      const ids = new Set(ctx.quick);
      const prioritized = base.filter((q) => ids.has(q.id));
      const rest = base.filter((q) => !ids.has(q.id));
      return [...prioritized, ...rest].slice(0, 6);
    }
  }
  return base;
}

export function buildReply(intent, lang) {
  const pack = REPLIES[lang] || REPLIES.en;
  if (pack[intent]) return pack[intent];
  if (intent.startsWith('project_')) {
    const sub = intent.replace('project_', '');
    if (pack[sub]) return pack[sub];
    if (pack.project_inquiry) return pack.project_inquiry;
  }
  return pack.fallback;
}

function intentHasReply(intent, lang) {
  const pack = REPLIES[lang] || REPLIES.en;
  if (pack[intent]) return true;
  if (intent.startsWith('project_') && pack[intent.replace('project_', '')]) return true;
  return false;
}

export function handleChatMessage(body) {
  const lang = body.lang === 'ar' ? 'ar' : 'en';
  const message = String(body.message || '').trim();
  const page = String(body.page || '');

  if (message === '__init__') {
    return {
      success: true,
      reply: REPLIES[lang].welcome,
      intent: 'welcome',
      quickReplies: quickRepliesForPage(page, lang),
      askLead: false,
      openWhatsApp: false,
      source: 'kb',
      bestScore: 10,
    };
  }

  if (!message) {
    return { success: false, message: 'Empty message' };
  }

  let intent;
  let bestScore = 0;
  if (body.intent && intentHasReply(body.intent, lang)) {
    intent = body.intent;
    bestScore = 10;
  } else {
    const analysis = analyzeMessage(message, lang, page);
    intent = analysis.intent;
    bestScore = analysis.bestScore || 0;
  }

  const replyLang = intent === 'greeting' ? greetingReplyLang(message, lang) : lang;
  const askLead = ['quote', 'session', 'human', 'project_inquiry', 'packages'].includes(intent)
    || String(intent).startsWith('project_');

  return {
    success: true,
    reply: buildReply(intent, replyLang),
    intent,
    quickReplies: quickRepliesForIntent(intent, lang, page),
    askLead,
    openWhatsApp: false,
    source: 'kb',
    bestScore,
  };
}
