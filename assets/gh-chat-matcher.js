/** Browser intent matcher — reads lexicon from window.GH_CHAT_KB (built via build-chat-knowledge.mjs) */
(function () {
  'use strict';

  function kb() {
    return window.GH_CHAT_KB || {};
  }

  function normalizeText(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[إأآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[^\w\s\u0600-\u06FF-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeGreeting(text) {
    return normalizeText(text).replace(/[!.,؟?…]/g, '');
  }

  function isGreeting(message) {
    var text = normalizeGreeting(message);
    if (!text || text.length > 48) return false;
    var phrases = kb().greetingPhrases || [];
    return phrases.some(function (phrase) {
      var p = normalizeGreeting(phrase);
      return text === p || text.indexOf(p + ' ') === 0;
    });
  }

  function greetingReplyLang(message, pageLang) {
    var text = normalizeGreeting(message);
    var phrases = kb().greetingPhrases || [];
    var arPhrases = phrases.filter(function (p) { return /[\u0600-\u06FF]/.test(p); });
    var enPhrases = phrases.filter(function (p) { return !/[\u0600-\u06FF]/.test(p); });
    if (arPhrases.some(function (phrase) {
      var p = normalizeGreeting(phrase);
      return text === p || text.indexOf(p + ' ') === 0;
    })) return 'ar';
    if (enPhrases.some(function (phrase) {
      var p = normalizeGreeting(phrase);
      return text === p || text.indexOf(p + ' ') === 0;
    })) return 'en';
    return pageLang === 'ar' ? 'ar' : 'en';
  }

  function isHumanRequest(text, lang) {
    var data = kb().humanKeywords || {};
    var words = (data[lang] || []).concat(data.en || []);
    var lower = text.toLowerCase();
    return words.some(function (w) { return lower.indexOf(String(w).toLowerCase()) !== -1; });
  }

  function hasProjectSignal(text) {
    var signals = kb().projectSignals || { ar: [], en: [] };
    var all = (signals.ar || []).concat(signals.en || []);
    return all.some(function (p) {
      var k = normalizeText(p);
      return k.length >= 3 && text.indexOf(k) !== -1;
    });
  }

  function scoreKeyword(text, keyword) {
    var k = normalizeText(keyword);
    if (!k || k.length < 2) return 0;
    if (text.indexOf(k) === -1) return 0;
    if (k.length <= 2) return 0.5;
    if (k.length <= 4) return 1;
    if (k.length <= 7) return 2;
    return 3;
  }

  function scoreIntent(text, entry) {
    var score = 0;
    var words = (entry.ar || []).concat(entry.en || []);
    for (var i = 0; i < words.length; i++) score += scoreKeyword(text, words[i]);
    if (score && entry.weight) score *= entry.weight;
    return score;
  }

  function scoreLegacyKeywords(text, lang) {
    var dict = (kb().keywords && kb().keywords[lang]) || (kb().keywords && kb().keywords.en) || {};
    var scores = {};
    Object.keys(dict).forEach(function (intent) {
      if (intent === 'human' || intent === 'greeting') return;
      var s = 0;
      (dict[intent] || []).forEach(function (w) { s += scoreKeyword(text, w); });
      if (s) scores[intent] = (scores[intent] || 0) + s;
    });
    return scores;
  }

  function pageContextMatch(page) {
    var ctxList = kb().pageContext || [];
    for (var i = 0; i < ctxList.length; i++) {
      var ctx = ctxList[i];
      try {
        if (new RegExp(ctx.match, ctx.flags || 'i').test(page)) return ctx;
      } catch (e) { /* ignore bad pattern */ }
    }
    return null;
  }

  function analyzeMessage(message, lang, page) {
    var text = normalizeText(message);
    var scores = {};

    if (isGreeting(message)) {
      return { intent: 'greeting', scores: { greeting: 10 }, bestScore: 10, projectSignal: false };
    }

    if (isHumanRequest(text, lang)) {
      return { intent: 'human', scores: { human: 10 }, bestScore: 10, projectSignal: false };
    }

    var lexicon = kb().lexicon || {};
    Object.keys(lexicon).forEach(function (intent) {
      var s = scoreIntent(text, lexicon[intent]);
      if (s) scores[intent] = (scores[intent] || 0) + s;
    });

    var legacy = scoreLegacyKeywords(text, lang);
    Object.keys(legacy).forEach(function (intent) {
      scores[intent] = (scores[intent] || 0) + legacy[intent];
    });

    var projectSignal = hasProjectSignal(text);
    if (projectSignal) {
      var serviceIntents = ['cgi', 'production', 'rendering', 'maquette', 'interactive', 'galleries', 'launch', 'branding'];
      var topService = null;
      var topScore = 0;
      serviceIntents.forEach(function (id) {
        if ((scores[id] || 0) > topScore) {
          topScore = scores[id];
          topService = id;
        }
      });
      if (topService && topScore >= 1) {
        scores['project_' + topService] = topScore + 4;
      } else if (text.indexOf('مشروع') !== -1 || text.indexOf('project') !== -1) {
        scores.project_inquiry = (scores.project_inquiry || 0) + 3;
      }
    }

    if (scores.quote) scores.quote += 1;

    // Packages beats generic quote/offer when package words are present
    if (scores.packages && scores.packages >= 2) {
      scores.packages += 2;
      if (scores.quote) scores.quote *= 0.6;
    }

    var best = null;
    var bestScore = 0;
    Object.keys(scores).forEach(function (intent) {
      if (scores[intent] > bestScore) {
        bestScore = scores[intent];
        best = intent;
      }
    });

    if (!best || bestScore < 1) {
      var ctx = page && pageContextMatch(page);
      if (ctx) {
        best = ctx.intent;
        bestScore = 1;
      }
    }

    return {
      intent: best || 'fallback',
      scores: scores,
      bestScore: bestScore,
      projectSignal: projectSignal,
    };
  }

  function matchIntent(message, lang, page) {
    return analyzeMessage(message, lang, page).intent;
  }

  function quickRepliesForIntent(intent, lang, page) {
    var isAr = lang === 'ar';
    var base = isAr
      ? [
          { id: 'packages', label: 'الباقات' },
          { id: 'services', label: 'خدمات' },
          { id: 'projects', label: 'مشاريع' },
          { id: 'session', label: 'احجز جلسة' },
          { id: 'quote', label: 'عرض سعر' },
          { id: 'human', label: '💬 تحدث مع فريقنا' },
        ]
      : [
          { id: 'packages', label: 'Packages' },
          { id: 'services', label: 'Services' },
          { id: 'projects', label: 'Projects' },
          { id: 'session', label: 'Book a session' },
          { id: 'quote', label: 'Get a quote' },
          { id: 'human', label: '💬 Talk to our team' },
        ];

    var byIntent = {
      cgi: ['quote', 'cgi', 'packages', 'human'],
      project_cgi: ['quote', 'cgi', 'session', 'human'],
      production: ['quote', 'production', 'cgi', 'human'],
      project_production: ['quote', 'production', 'session', 'human'],
      rendering: ['quote', 'rendering', 'packages', 'human'],
      project_rendering: ['quote', 'rendering', 'session', 'human'],
      maquette: ['quote', 'maquette', 'packages', 'human'],
      project_maquette: ['quote', 'maquette', 'session', 'human'],
      interactive: ['quote', 'interactive', 'packages', 'human'],
      galleries: ['quote', 'galleries', 'session', 'human'],
      launch: ['launch', 'packages', 'quote', 'session'],
      packages: ['packages', 'session', 'quote', 'human'],
      session: ['session', 'packages', 'quote', 'human'],
      quote: ['quote', 'session', 'packages', 'human'],
      project_inquiry: ['session', 'packages', 'quote', 'human'],
      human: ['human', 'session', 'packages', 'quote'],
      fallback: ['packages', 'services', 'session', 'human'],
    };

    var ids = byIntent[intent];
    if (ids) {
      var labels = {
        ar: {
          services: 'خدمات', projects: 'مشاريع', quote: 'عرض سعر', launch: 'Launch™',
          packages: 'الباقات', session: 'احجز جلسة',
          human: '💬 تحدث مع فريقنا', cgi: 'فيديو / CGI', production: 'ميديا برودكشن',
          rendering: 'إظهار معماري', maquette: 'مجسمات', interactive: 'تفاعلي',
          galleries: 'جاليريات',
        },
        en: {
          services: 'Services', projects: 'Projects', quote: 'Get a quote', launch: 'Launch™',
          packages: 'Packages', session: 'Book a session',
          human: '💬 Talk to our team', cgi: 'Video / CGI', production: 'Media production',
          rendering: 'Archviz', maquette: 'Maquettes', interactive: 'Interactive',
          galleries: 'Galleries',
        },
      };
      var L = isAr ? labels.ar : labels.en;
      return ids.map(function (id) { return { id: id, label: L[id] || id }; }).slice(0, 5);
    }

    var ctx = page && pageContextMatch(page);
    if (ctx && ctx.quick) {
      var set = {};
      ctx.quick.forEach(function (id) { set[id] = true; });
      return base.filter(function (q) { return set[q.id]; })
        .concat(base.filter(function (q) { return !set[q.id]; }))
        .slice(0, 6);
    }
    return base.slice(0, 6);
  }

  window.GH_CHAT_MATCHER = {
    normalizeText: normalizeText,
    isGreeting: isGreeting,
    greetingReplyLang: greetingReplyLang,
    analyzeMessage: analyzeMessage,
    matchIntent: matchIntent,
    quickRepliesForIntent: quickRepliesForIntent,
  };
})();
