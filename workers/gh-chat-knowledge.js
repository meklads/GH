/**
 * Chat intent matching + HTML replies built from gh-site-knowledge.js
 */
import {
  SITE,
  WHATSAPP_LINK,
  PHONE_DISPLAY,
  EMAIL,
  KEYWORDS,
  PAGE_CONTEXT,
  HUMAN_KEYWORDS,
  getSystemContext,
} from './gh-site-knowledge.js';

export { getSystemContext, serializeForClient } from './gh-site-knowledge.js';

const WA_BTN = {
  ar: '<a href="#" data-gh-chat-action="whatsapp">💬 تحدث مع فريقنا على واتساب</a>',
  en: '<a href="#" data-gh-chat-action="whatsapp">💬 Chat with our team on WhatsApp</a>',
};

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
    .map((s, i) => `${i + 1}️⃣ <strong>${s.name[key]}</strong> — ${link(s.url[key], lang === 'ar' ? 'تفاصيل' : 'Details')}`)
    .join('<br>');
}

function productsList(lang) {
  const key = L(lang);
  return SITE.products
    .map((p) => `🚀 <strong>${p.name}</strong> — ${p.desc[key]} ${link(p.url[key], lang === 'ar' ? 'المزيد' : 'More')}`)
    .join('<br><br>');
}

function clientsList(lang) {
  const key = L(lang);
  return SITE.clients.map((c) => c[key]).join(' · ');
}

function projectsList(lang, limit = 6) {
  const key = L(lang);
  return SITE.projects
    .slice(0, limit)
    .map((p) => `🏗️ <strong>${p.client[key]}</strong> — ${p.title[key]} ${link(p.url[key], lang === 'ar' ? 'المشروع' : 'Project')}`)
    .join('<br><br>');
}

export const REPLIES = {
  ar: {
    welcome: `مرحباً! 👋 أنا مساعد <strong>Graphics House</strong>.<br><br>أسألني عن خدماتنا، منتجات Launch™، مشاريعنا، عملائنا، أو اطلب <strong>التحدث مع فريقنا</strong>.`,
    human: `بكل سرور! 👤<br><br>أحوّلك الآن لفريقنا للرد البشري المباشر على واتساب:<br><br>${WA_BTN.ar}<br><br>📞 أو اتصل: <a href="tel:+966502786513">${PHONE_DISPLAY}</a>`,
    services: `خدماتنا للمطورين والمؤسسات في الخليج:<br><br>${servicesList('ar')}<br><br>📎 ${link('/services/rendering.html', 'كل الخدمات')} · ${link(SITE.portfolio.ar, 'معرض الأعمال')}`,
    quote: `لعرض سعر دقيق، شاركنا:<br><br>📌 نوع المشروع والمقاس<br>📅 الجدول الزمني<br>📍 الموقع<br>📎 رسومات أولية إن وُجدت<br><br>⚠️ الأسعار تُحدَّد بعد دراسة المشروع.<br><br><a href="#" data-gh-chat-action="open-form">📝 نموذج استفسار</a> · ${WA_BTN.ar}`,
    contact: `تواصل معنا:<br><br>📞 ${WA_BTN.ar}<br>📧 <a href="mailto:${EMAIL}">${EMAIL}</a><br>📍 ${SITE.contact.hq.ar}<br><br>نفضّل التواصل المباشر — فريقنا جاهز.`,
    whatsapp: `اضغط للانتقال إلى واتساب:<br><br>${WA_BTN.ar}`,
    maquette: `المجسمات الذكية — حرفية + تقنية:<br><br>🏗️ فلل، أبراج، مدن سكنية، أراضي مخطط<br>✨ إسقاط ضوئي · بيانات حية · إضاءة وصوت<br>📐 توصيل وتركيب عالمياً<br><br>📎 ${link('/services/maquettes.html', 'مجسمات ذكية')} · ${link('/insights/projects/makkah-charter-mwl.html', 'مشروع MWL')}`,
    clients: `عملاؤنا يشملون كبرى الشركات والمؤسسات:<br><br>🏢 ${clientsList('ar')}<br><br>📎 ${link(SITE.portfolio.ar, 'استعرض الأعمال')}`,
    projects: `مشاريع مرجعية ناجحة:<br><br>${projectsList('ar')}<br><br>📎 ${link(SITE.portfolio.ar, 'كل الأعمال')} · ${link('/insights/projects/', 'مشاريع Insights')}`,
    location: `فروعنا:<br><br>${SITE.contact.branches.map((b) => `📍 ${b.ar}`).join('<br>')}<br><br>🌍 ننفّذ ونشحن لأي مكان.`,
    launch: `أنظمة <strong>Launch™</strong>:<br><br>${productsList('ar')}`,
    partner: `شبكة شركاء الوكالات™ — وسّع قدرات وكالتك:<br><br>✅ CGI · مجسمات · تفاعلي · ميديا<br>✅ White-label أو co-branded<br><br>📎 ${link('/partner-network.html', 'تفاصيل الشراكة')}`,
    insights: `مركز المعرفة:<br><br>📚 ${link(SITE.insights.articles.ar, 'مقالات')} · ${link(SITE.insights.reports.ar, 'تقارير')}<br>🛠️ ${link(SITE.insights.tools.brief.ar, 'موجز المشروع')} · ${link(SITE.insights.tools.checklist.ar, 'قائمة الإطلاق')} · ${link(SITE.insights.tools.finder.ar, 'Solution Finder')}`,
    cgi: `الإنتاج السينمائي CGI:<br><br>🎬 أفلام إطلاق · جولات سينمائية · سرد بصري عاطفي<br>📎 ${link('/services/cinematic-cgi.html', 'سينمائي CGI')} · ${link('/services/animation.html', 'أنيميشن')}`,
    interactive: `التجارب التفاعلية:<br><br>🖥️ شاشات لمس · جولات افتراضية · VR/360<br>📎 ${link('/services/interactive-experiences.html', 'تجارب تفاعلية')} · ${link('/services/vr-360.html', 'VR 360')}`,
    galleries: `جاليريات وديكور مبيعات:<br><br>🏛️ تصميم وتنفيذ صالات العرض حسب المساحة<br>📎 ${link('/galleries-advertising.html', 'جاليريات وديكور')}`,
    fallback: `لم أفهم سؤالك بالكامل. 😅<br><br>جرّب أحد الخيارات أو ${WA_BTN.ar}`,
  },
  en: {
    welcome: `Hello! 👋 I'm the <strong>Graphics House</strong> assistant.<br><br>Ask about our services, Launch™ products, projects, clients, or request to <strong>speak with our team</strong>.`,
    human: `Happy to connect you! 👤<br><br>I'll route you to our team for a direct reply on WhatsApp:<br><br>${WA_BTN.en}<br><br>📞 Or call: <a href="tel:+966502786513">${PHONE_DISPLAY}</a>`,
    services: `Our services for GCC developers &amp; institutions:<br><br>${servicesList('en')}<br><br>📎 ${link('/services/rendering-en.html', 'All services')} · ${link(SITE.portfolio.en, 'Portfolio')}`,
    quote: `For an accurate quote, please share:<br><br>📌 Project type &amp; scale<br>📅 Timeline<br>📍 Location<br>📎 Drawings if available<br><br>⚠️ Pricing confirmed after project review.<br><br><a href="#" data-gh-chat-action="open-form">📝 Enquiry form</a> · ${WA_BTN.en}`,
    contact: `Get in touch:<br><br>📞 ${WA_BTN.en}<br>📧 <a href="mailto:${EMAIL}">${EMAIL}</a><br>📍 ${SITE.contact.hq.en}<br><br>We prefer direct contact — our team is ready.`,
    whatsapp: `Tap to open WhatsApp:<br><br>${WA_BTN.en}`,
    maquette: `Smart Maquettes — craft + technology:<br><br>🏗️ Villas, towers, cities, land plots<br>✨ Projection mapping · live data · smart AV<br>📐 Worldwide delivery &amp; install<br><br>📎 ${link('/services/maquettes-en.html', 'Smart maquettes')} · ${link('/insights/projects/makkah-charter-mwl-en.html', 'MWL project')}`,
    clients: `Our clients include leading brands &amp; institutions:<br><br>🏢 ${clientsList('en')}<br><br>📎 ${link(SITE.portfolio.en, 'View portfolio')}`,
    projects: `Reference projects:<br><br>${projectsList('en')}<br><br>📎 ${link(SITE.portfolio.en, 'Full portfolio')} · ${link('/insights/projects/', 'Insights projects')}`,
    location: `Our branches:<br><br>${SITE.contact.branches.map((b) => `📍 ${b.en}`).join('<br>')}<br><br>🌍 We deliver worldwide.`,
    launch: `<strong>Launch™</strong> systems:<br><br>${productsList('en')}`,
    partner: `Agency Partner Network™ — expand your agency:<br><br>✅ CGI · maquettes · interactive · media<br>✅ White-label or co-branded<br><br>📎 ${link('/partner-network-en.html', 'Partnership details')}`,
    insights: `Knowledge Hub:<br><br>📚 ${link(SITE.insights.articles.en, 'Articles')} · ${link(SITE.insights.reports.en, 'Reports')}<br>🛠️ ${link(SITE.insights.tools.brief.en, 'Project brief')} · ${link(SITE.insights.tools.checklist.en, 'Launch checklist')} · ${link(SITE.insights.tools.finder.en, 'Solution Finder')}`,
    cgi: `Cinematic CGI production:<br><br>🎬 Launch films · cinematic tours · emotional storytelling<br>📎 ${link('/services/cinematic-cgi-en.html', 'Cinematic CGI')} · ${link('/services/animation-en.html', 'Animation')}`,
    interactive: `Interactive experiences:<br><br>🖥️ Touchscreens · virtual tours · VR/360<br>📎 ${link('/services/interactive-experiences-en.html', 'Interactive')} · ${link('/services/vr-360-en.html', 'VR 360')}`,
    galleries: `Sales galleries &amp; spatial design:<br><br>🏛️ Showroom design &amp; build tailored to space<br>📎 ${link('/galleries-advertising-en.html', 'Galleries')}`,
    fallback: `I didn't fully catch that. 😅<br><br>Try an option below or ${WA_BTN.en}`,
  },
};

export function defaultQuickReplies(lang) {
  const isAr = lang === 'ar';
  return isAr
    ? [
        { id: 'services', label: 'خدمات' },
        { id: 'projects', label: 'مشاريع' },
        { id: 'clients', label: 'عملاؤنا' },
        { id: 'quote', label: 'عرض سعر' },
        { id: 'launch', label: 'Launch™' },
        { id: 'human', label: '💬 تحدث مع فريقنا' },
      ]
    : [
        { id: 'services', label: 'Services' },
        { id: 'projects', label: 'Projects' },
        { id: 'clients', label: 'Our Clients' },
        { id: 'quote', label: 'Get a Quote' },
        { id: 'launch', label: 'Launch™' },
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

function isHumanRequest(text, lang) {
  const words = HUMAN_KEYWORDS[lang] || HUMAN_KEYWORDS.en;
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w.toLowerCase()));
}

export function matchIntent(message, lang, page) {
  const text = String(message || '').toLowerCase().trim();

  if (isHumanRequest(text, lang)) return 'human';

  const dict = KEYWORDS[lang] || KEYWORDS.en;
  let best = null;
  let bestScore = 0;

  for (const [intent, words] of Object.entries(dict)) {
    if (intent === 'human') continue;
    let score = 0;
    for (const word of words) {
      if (text.includes(word.toLowerCase())) score += word.length > 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (!best && page) {
    for (const ctx of PAGE_CONTEXT) {
      if (ctx.match.test(page)) {
        best = ctx.intent;
        break;
      }
    }
  }

  return best || 'fallback';
}

export function buildReply(intent, lang) {
  const pack = REPLIES[lang] || REPLIES.en;
  return pack[intent] || pack.fallback;
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
      source: 'kb',
    };
  }

  if (!message) {
    return { success: false, message: 'Empty message' };
  }

  const intent = body.intent && REPLIES[lang][body.intent] ? body.intent : matchIntent(message, lang, page);

  return {
    success: true,
    reply: buildReply(intent, lang),
    intent,
    quickReplies: quickRepliesForPage(page, lang),
    openWhatsApp: intent === 'human' || intent === 'whatsapp',
    source: 'kb',
  };
}
