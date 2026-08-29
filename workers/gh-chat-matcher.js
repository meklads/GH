/**
 * Smart intent matcher — understands partial phrases in AR + EN.
 */
import { KEYWORDS, PAGE_CONTEXT, HUMAN_KEYWORDS, GREETING_PHRASES } from './gh-site-knowledge.js';

/** @type {Record<string, { ar: string[], en: string[], weight?: number }>} */
export const LEXICON = {
  cgi: {
    weight: 1.2,
    ar: ['فيديو', 'فيديوه', 'فيلم', 'سينمائي', 'سينما', 'cgi', 'أنيميشن', 'انيميشن', 'animation', 'مونتاج', 'موشن', 'motion', 'إعلان', 'اعلان', 'تصوير', 'produc'],
    en: ['video', 'film', 'cinematic', 'cgi', 'animation', 'motion', 'commercial', 'footage', 'movie', 'promo'],
  },
  production: {
    weight: 1.1,
    ar: ['ميديا', 'إنتاج', 'انتاج', 'برودكشن', 'production', 'تصوير', 'photography', 'فoto'],
    en: ['media production', 'production', 'photography', 'shoot', 'filming'],
  },
  rendering: {
    weight: 1.1,
    ar: ['رندر', 'render', 'إظهار', 'اظهار', 'تصور', 'visualization', 'visualisation', '3d', 'ثلاثي', 'صورة', 'صور', 'perspective'],
    en: ['render', 'rendering', 'visualization', 'visualisation', '3d', 'still', 'perspective', 'photoreal'],
  },
  maquette: {
    weight: 1.15,
    ar: ['مجسم', 'مجسمات', 'ماكيت', 'maquette', 'scale model', 'مقياس', 'physical model', 'نموذج'],
    en: ['maquette', 'scale model', 'physical model', 'model making'],
  },
  interactive: {
    weight: 1.1,
    ar: ['تفاعلي', 'interactive', 'touch', 'شاشة', 'touchscreen', 'virtual', 'vr', '360', 'جولة'],
    en: ['interactive', 'touchscreen', 'touch screen', 'virtual tour', 'vr', '360'],
  },
  galleries: {
    weight: 1.05,
    ar: ['جاليري', 'معرض', 'صالة', 'showroom', 'sales gallery', 'ديكور', 'decor', 'spatial'],
    en: ['gallery', 'showroom', 'sales center', 'sales centre', 'decor', 'spatial'],
  },
  launch: {
    weight: 1.05,
    ar: ['launch', 'إطلاق', 'اطلاق', 'projectlaunch', 'growthlaunch', 'brandscale', 'off-plan', 'offplan', 'قبل البناء'],
    en: ['launch', 'projectlaunch', 'growthlaunch', 'brandscale', 'off-plan', 'offplan', 'pre-sale'],
  },
  partner: {
    weight: 1,
    ar: ['شريك', 'شراكة', 'وكالة', 'agency', 'partner', 'white label', 'white-label'],
    en: ['partner', 'agency', 'white-label', 'whitelabel', 'subcontract'],
  },
  quote: {
    weight: 1.3,
    ar: ['سعر', 'عرض سعر', 'تكلفة', 'كم', 'بكم', 'ميزانية', 'budget', 'quotation', 'quote', 'تسعير', 'offer'],
    en: ['quote', 'price', 'cost', 'pricing', 'budget', 'estimate', 'how much', 'quotation'],
  },
  contact: {
    weight: 1,
    ar: ['اتصال', 'تواصل', 'رقم', 'جوال', 'ايميل', 'بريد', 'email', 'phone', 'call'],
    en: ['contact', 'email', 'phone', 'call', 'reach', 'number'],
  },
  whatsapp: {
    weight: 1.2,
    ar: ['واتس', 'whatsapp', 'واتساب'],
    en: ['whatsapp', 'wa.me'],
  },
  clients: {
    weight: 0.9,
    ar: ['عميل', 'عملاء', 'clients', 'portfolio', 'أعمال', 'اعمال', 'من عمل', 'الراجحي', 'رفال', 'عنان'],
    en: ['client', 'clients', 'portfolio', 'who do you work', 'al rajhi', 'raffal', 'anan'],
  },
  projects: {
    weight: 0.85,
    ar: ['مشاريع', 'case study', 'دراسة حالة', 'نجاح', 'سابق', 'نفذتم', 'عملتم', 'أعمالكم', 'اعمالكم', 'portfolio work'],
    en: ['projects', 'case study', 'past work', 'delivered', 'examples', 'reference'],
  },
  location: {
    weight: 0.95,
    ar: ['فرع', 'فروع', 'موقع', 'عنوان', 'مكتب', 'جدة', 'مسقط', 'منامة', 'مصر', 'الرياض', 'مكة'],
    en: ['branch', 'branches', 'office', 'location', 'address', 'jeddah', 'muscat', 'manama', 'egypt', 'riyadh'],
  },
  insights: {
    weight: 0.85,
    ar: ['مقال', 'مقالات', 'insights', 'تقرير', 'تقارير', 'checklist', 'موجز', 'معرفة', 'guide'],
    en: ['article', 'articles', 'insights', 'report', 'reports', 'checklist', 'brief', 'guide', 'hub'],
  },
  services: {
    weight: 0.8,
    ar: ['خدمات', 'خدمة', 'تقدمون', 'ماذا تقدم', 'what do you offer', 'capabilities'],
    en: ['services', 'service', 'what do you offer', 'capabilities', 'solutions'],
  },
  branding: {
    weight: 1,
    ar: ['هوية', 'branding', 'brand', 'logo', 'شعار', 'visual identity'],
    en: ['branding', 'brand identity', 'logo', 'visual identity'],
  },
  residential: {
    weight: 0.9,
    ar: ['سكني', 'فيلا', 'فلل', 'compound', 'مجمع', 'شقة', 'وحدات', 'residential', 'villa'],
    en: ['residential', 'villa', 'compound', 'apartment', 'units', 'housing'],
  },
  commercial: {
    weight: 0.9,
    ar: ['تجاري', 'مكتبي', 'office', 'retail', 'mixed-use', 'متعدد'],
    en: ['commercial', 'office', 'retail', 'mixed-use', 'mixed use'],
  },
};

export const PROJECT_SIGNALS = {
  ar: ['عندي', 'لدي', 'عندنا', 'لدينا', 'أريد', 'اريد', 'ابغى', 'أبغى', 'abga', 'احتاج', 'نحتاج', 'مشروع', 'مشاريع', 'new project', 'looking for', 'need'],
  en: ['i have', 'we have', 'i need', 'we need', 'looking for', 'want to', 'new project', 'our project', 'my project'],
};

export function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\w\s\u0600-\u06FF-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeGreeting(text) {
  return normalizeText(text).replace(/[!.,؟?…]/g, '');
}

export function isGreeting(message) {
  const text = normalizeGreeting(message);
  if (!text || text.length > 48) return false;
  return GREETING_PHRASES.some((phrase) => {
    const p = normalizeGreeting(phrase);
    return text === p || text.startsWith(`${p} `);
  });
}

export function greetingReplyLang(message, pageLang) {
  const text = normalizeGreeting(message);
  const arPhrases = GREETING_PHRASES.filter((p) => /[\u0600-\u06FF]/.test(p));
  const enPhrases = GREETING_PHRASES.filter((p) => !/[\u0600-\u06FF]/.test(p));
  if (arPhrases.some((phrase) => {
    const p = normalizeGreeting(phrase);
    return text === p || text.startsWith(`${p} `);
  })) return 'ar';
  if (enPhrases.some((phrase) => {
    const p = normalizeGreeting(phrase);
    return text === p || text.startsWith(`${p} `);
  })) return 'en';
  return pageLang === 'ar' ? 'ar' : 'en';
}

function isHumanRequest(text, lang) {
  const words = [...(HUMAN_KEYWORDS[lang] || []), ...(HUMAN_KEYWORDS.en || [])];
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w.toLowerCase()));
}

function hasProjectSignal(text) {
  const n = normalizeText(text);
  return PROJECT_SIGNALS.ar.concat(PROJECT_SIGNALS.en).some((p) => {
    const k = normalizeText(p);
    return k.length >= 3 && n.includes(k);
  });
}

function scoreKeyword(text, keyword) {
  const k = normalizeText(keyword);
  if (!k || k.length < 2) return 0;
  if (!text.includes(k)) return 0;
  if (k.length <= 2) return 0.5;
  if (k.length <= 4) return 1;
  if (k.length <= 7) return 2;
  return 3;
}

function scoreIntent(text, intent, lexEntry) {
  let score = 0;
  const words = [...(lexEntry.ar || []), ...(lexEntry.en || [])];
  for (const w of words) score += scoreKeyword(text, w);
  if (score && lexEntry.weight) score *= lexEntry.weight;
  return score;
}

function scoreLegacyKeywords(text, lang) {
  const dict = KEYWORDS[lang] || KEYWORDS.en;
  const scores = {};
  for (const [intent, words] of Object.entries(dict)) {
    if (intent === 'human' || intent === 'greeting') continue;
    let s = 0;
    for (const w of words) s += scoreKeyword(text, w);
    if (s) scores[intent] = (scores[intent] || 0) + s;
  }
  return scores;
}

/** @returns {{ intent: string, scores: Record<string, number>, projectSignal: boolean }} */
export function analyzeMessage(message, lang, page) {
  const text = normalizeText(message);
  const scores = {};

  if (isGreeting(message)) {
    return { intent: 'greeting', scores: { greeting: 10 }, projectSignal: false };
  }

  if (isHumanRequest(text, lang)) {
    return { intent: 'human', scores: { human: 10 }, projectSignal: false };
  }

  for (const [intent, entry] of Object.entries(LEXICON)) {
    const s = scoreIntent(text, intent, entry);
    if (s) scores[intent] = (scores[intent] || 0) + s;
  }

  const legacy = scoreLegacyKeywords(text, lang);
  for (const [intent, s] of Object.entries(legacy)) {
    scores[intent] = (scores[intent] || 0) + s;
  }

  const projectSignal = hasProjectSignal(text);

  // Project inquiry + domain keyword → prioritize service intent
  if (projectSignal) {
    const serviceIntents = ['cgi', 'production', 'rendering', 'maquette', 'interactive', 'galleries', 'launch', 'branding'];
    let topService = null;
    let topScore = 0;
    for (const id of serviceIntents) {
      if ((scores[id] || 0) > topScore) {
        topScore = scores[id];
        topService = id;
      }
    }
    if (topService && topScore >= 1) {
      scores[`project_${topService}`] = topScore + 4;
    } else if (text.includes('مشروع') || text.includes('project')) {
      scores.project_inquiry = (scores.project_inquiry || 0) + 3;
    }
  }

  // Boost quote when price words appear
  if (scores.quote) scores.quote += 1;

  let best = null;
  let bestScore = 0;
  for (const [intent, s] of Object.entries(scores)) {
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }

  if (!best || bestScore < 1) {
    if (page) {
      for (const ctx of PAGE_CONTEXT) {
        if (ctx.match.test(page)) {
          best = ctx.intent;
          break;
        }
      }
    }
  }

  return {
    intent: best || 'fallback',
    scores,
    projectSignal,
  };
}

export function matchIntent(message, lang, page) {
  return analyzeMessage(message, lang, page).intent;
}

export function quickRepliesForIntent(intent, lang, page) {
  const isAr = lang === 'ar';
  const base = isAr
    ? [
        { id: 'services', label: 'خدمات' },
        { id: 'projects', label: 'مشاريع' },
        { id: 'quote', label: 'عرض سعر' },
        { id: 'launch', label: 'Launch™' },
        { id: 'human', label: '💬 تحدث مع فريقنا' },
      ]
    : [
        { id: 'services', label: 'Services' },
        { id: 'projects', label: 'Projects' },
        { id: 'quote', label: 'Get a Quote' },
        { id: 'launch', label: 'Launch™' },
        { id: 'human', label: '💬 Talk to our team' },
      ];

  const byIntent = {
    cgi: ['quote', 'cgi', 'projects', 'human'],
    project_cgi: ['quote', 'cgi', 'human'],
    production: ['quote', 'production', 'cgi', 'human'],
    project_production: ['quote', 'production', 'human'],
    rendering: ['quote', 'rendering', 'projects', 'human'],
    project_rendering: ['quote', 'rendering', 'human'],
    maquette: ['quote', 'maquette', 'projects', 'human'],
    project_maquette: ['quote', 'maquette', 'human'],
    interactive: ['quote', 'interactive', 'projects', 'human'],
    galleries: ['quote', 'galleries', 'human'],
    launch: ['launch', 'quote', 'projects', 'human'],
    quote: ['quote', 'human', 'services'],
    project_inquiry: ['quote', 'services', 'human'],
    human: ['human', 'quote', 'services'],
    fallback: ['services', 'quote', 'projects', 'human'],
  };

  const ids = byIntent[intent] || null;
  if (ids) {
    const labels = {
      ar: {
        services: 'خدمات', projects: 'مشاريع', quote: 'عرض سعر', launch: 'Launch™',
        human: '💬 تحدث مع فريقنا', cgi: 'فيديو / CGI', production: 'ميديا برودكشن',
        rendering: 'إظهار معماري', maquette: 'مجسمات', interactive: 'تفاعلي',
        galleries: 'جاليريات',
      },
      en: {
        services: 'Services', projects: 'Projects', quote: 'Get a Quote', launch: 'Launch™',
        human: '💬 Talk to our team', cgi: 'Video / CGI', production: 'Media production',
        rendering: 'Archviz', maquette: 'Maquettes', interactive: 'Interactive',
        galleries: 'Galleries',
      },
    };
    const L = isAr ? labels.ar : labels.en;
    return ids.map((id) => ({ id, label: L[id] || id })).slice(0, 5);
  }

  for (const ctx of PAGE_CONTEXT) {
    if (page && ctx.match.test(page)) {
      const set = new Set(ctx.quick);
      return base.filter((q) => set.has(q.id)).concat(base.filter((q) => !set.has(q.id))).slice(0, 6);
    }
  }
  return base.slice(0, 6);
}
