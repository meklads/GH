(function () {
  'use strict';

  var STORAGE_KEY = 'ghChatSession';
  var CHAT_VERSION = 1;

  var isAr = (document.documentElement.lang || '').toLowerCase() === 'ar'
    || document.documentElement.dir === 'rtl';

  var motifSrc = (function () {
    var img = document.querySelector('.gh-chat-head-icon');
    if (img && img.getAttribute('src')) return img.getAttribute('src');
    var brand = document.querySelector('.gh-float-brand-logo');
    if (brand && brand.getAttribute('src')) return brand.getAttribute('src');
    return 'assets/chatbot-motif.png';
  })();

  function chatEndpoint() {
    return (window.GH_FORMS && window.GH_FORMS.chatEndpoint)
      || 'https://3dgraphicshouse.com/api/chat';
  }

  function track(event, params) {
    if (typeof window.ghTrack === 'function') {
      window.ghTrack(event, params || {});
    }
  }

  function getPanel() { return document.getElementById('ghChatPanel'); }
  function getMsgs() { return document.getElementById('ghChatMsgs'); }
  function getQuick() { return document.getElementById('ghChatQuick'); }
  function getField() { return document.getElementById('ghChatField'); }
  function getSendBtn() { return document.getElementById('ghChatSend'); }

  function loadSession() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { messages: [] };
    } catch (e) {
      return { messages: [] };
    }
  }

  function saveSession(session) {
    try {
      var trimmed = {
        messages: (session.messages || []).slice(-20),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) { /* ignore */ }
  }

  function renderQuickReplies(items) {
    var quick = getQuick();
    if (!quick) return;
    quick.innerHTML = '';
    (items || []).forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gh-q-btn';
      btn.setAttribute('data-q', item.id);
      btn.textContent = item.label;
      btn.addEventListener('click', function () {
        handleQuickReply(item.id, item.label);
      });
      quick.appendChild(btn);
    });
  }

  function defaultQuickReplies() {
    return isAr
      ? [
          { id: 'services', label: 'خدمات' },
          { id: 'quote', label: 'عرض سعر' },
          { id: 'contact', label: 'اتصال' },
          { id: 'maquette', label: 'مجسمات ذكية' },
          { id: 'launch', label: 'Launch™' },
          { id: 'location', label: 'الفروع' },
        ]
      : [
          { id: 'services', label: 'Services' },
          { id: 'quote', label: 'Get a Quote' },
          { id: 'contact', label: 'Contact' },
          { id: 'maquette', label: 'Smart Maquettes' },
          { id: 'launch', label: 'Launch™' },
          { id: 'location', label: 'Branches' },
        ];
  }

  function appendMessage(text, isUser, skipSave) {
    var msgs = getMsgs();
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'gh-msg' + (isUser ? ' gh-msg-user' : ' gh-msg-bot');
    var avatar = document.createElement('div');
    avatar.className = 'gh-msg-avatar';
    if (isUser) {
      avatar.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">person</span>';
    } else {
      avatar.innerHTML = '<img src="' + motifSrc + '" alt="" width="16" height="16">';
    }
    var bubble = document.createElement('div');
    bubble.className = 'gh-msg-bubble';
    bubble.innerHTML = text;
    div.appendChild(avatar);
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;

    wireChatActions(bubble);

    if (!skipSave) {
      var session = loadSession();
      session.messages.push({ role: isUser ? 'user' : 'assistant', text: text });
      saveSession(session);
    }
  }

  function wireChatActions(root) {
    if (!root) return;
    root.querySelectorAll('[data-gh-chat-action="open-form"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof window.ghOpenPopup === 'function') {
          window.ghOpenPopup();
          track('assistant_lead_cta', { action: 'open-form' });
        }
      });
    });
  }

  function showTyping() {
    var msgs = getMsgs();
    if (!msgs || msgs.querySelector('.gh-msg-typing')) return null;
    var div = document.createElement('div');
    div.className = 'gh-msg gh-msg-bot gh-msg-typing';
    div.innerHTML =
      '<div class="gh-msg-avatar"><img src="' + motifSrc + '" alt="" width="16" height="16"></div>' +
      '<div class="gh-msg-bubble"><span class="gh-typing-dot"></span><span class="gh-typing-dot"></span><span class="gh-typing-dot"></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function hideTyping(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function fetchReply(payload) {
    return fetch(chatEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (r) { return r.json(); });
  }

  function respondWith(payload, userLabel) {
    var typing = showTyping();
    var sendBtn = getSendBtn();
    if (sendBtn) sendBtn.disabled = true;

    return fetchReply(payload)
      .then(function (res) {
        hideTyping(typing);
        if (sendBtn) sendBtn.disabled = false;
        if (res && res.success && res.reply) {
          appendMessage(res.reply, false);
          if (res.quickReplies && res.quickReplies.length) {
            renderQuickReplies(res.quickReplies);
          }
          track('assistant_message_sent', {
            intent: res.intent || '',
            source: res.source || 'kb',
            page_path: location.pathname,
          });
          if (res.intent === 'quote') {
            track('assistant_lead_cta', { intent: 'quote' });
          }
          return;
        }
        appendMessage(localFallback(payload.message || userLabel || ''), false);
      })
      .catch(function () {
        hideTyping(typing);
        if (sendBtn) sendBtn.disabled = false;
        appendMessage(localReply(payload), false);
        track('assistant_message_sent', { intent: payload.intent || 'fallback', source: 'local', page_path: location.pathname });
      });
  }

  function localReply(payload) {
    var text = String(payload.message || '').toLowerCase();
    var intent = payload.intent;
    var page = String(payload.page || '');

    if (!intent) {
      var keys = isAr ? {
        services: ['خدمات', 'خدمة', 'cgi', 'سينمائي', 'إظهار'],
        quote: ['سعر', 'عرض', 'تكلفة', 'ميزانية'],
        contact: ['اتصال', 'تواصل', 'واتس', 'جوال', 'رقم'],
        maquette: ['مجسم', 'ماكيت', 'maquette'],
        clients: ['عميل', 'عملاء', 'portfolio'],
        location: ['فرع', 'جدة', 'مسقط', 'موقع'],
        launch: ['launch', 'إطلاق', 'projectlaunch'],
        partner: ['شريك', 'وكالة', 'partner'],
        insights: ['مقال', 'insights', 'تقرير'],
      } : {
        services: ['service', 'cgi', 'render', 'visualization'],
        quote: ['quote', 'price', 'cost', 'pricing'],
        contact: ['contact', 'phone', 'whatsapp', 'email'],
        maquette: ['maquette', 'model', 'scale'],
        clients: ['client', 'portfolio'],
        location: ['branch', 'jeddah', 'office', 'location'],
        launch: ['launch', 'projectlaunch', 'off-plan'],
        partner: ['partner', 'agency'],
        insights: ['article', 'insights', 'report'],
      };
      var best = 'fallback';
      var score = 0;
      Object.keys(keys).forEach(function (k) {
        keys[k].forEach(function (w) {
          if (text.indexOf(w) !== -1 && w.length >= score) {
            score = w.length;
            best = k;
          }
        });
      });
      if (best === 'fallback' && /project-launch|growth-launch|brand-scale/i.test(page)) best = 'launch';
      if (best === 'fallback' && /partner-network/i.test(page)) best = 'partner';
      if (best === 'fallback' && /insights\//i.test(page)) best = 'insights';
      intent = best;
    }

    var pack = isAr ? {
      services: 'نقدّم CGI سينمائي، مجسمات ذكية، تجارب تفاعلية، جاليريات، وميديا برودكشن. <a href="/services/rendering.html">استكشف الخدمات</a>',
      quote: 'لطلب عرض سعر، شاركنا نوع المشروع والجدول والموقع. <a href="#" data-gh-chat-action="open-form">افتح نموذج الاستفسار</a> أو اتصل: <a href="tel:+966502786513">+966 50 278 6513</a>',
      contact: 'تواصل عبر <a href="https://wa.me/966502786513">واتساب</a> أو <a href="mailto:info@3dgraphicshouse.com">info@3dgraphicshouse.com</a>',
      maquette: 'المجسمات الذكية متوفرة بجميع المقاييس مع إسقاط ضوئي وتفاعل. <a href="/services/maquettes.html">تفاصيل أكثر</a>',
      clients: 'عملاؤنا يشملون الراجحي، رافال، عنان إسكان، وغيرهم. <a href="/portfolio.html">الأعمال</a>',
      location: 'فروعنا: جدة، مسقط، المنامة، مصر — ونشحن عالمياً.',
      launch: 'Launch™: ProjectLaunch، GrowthLaunch، BrandScale، والفعاليات المؤسسية.',
      partner: 'شبكة شركاء الوكالات™ — <a href="/partner-network.html">تعرّف على الشراكة</a>',
      insights: 'مركز المعرفة: <a href="/insights/articles.html">مقالات</a> وأدوات مجانية.',
      fallback: 'اختر أحد الخيارات أدناه أو <a href="tel:+966502786513">اتصل بنا</a>.',
    } : {
      services: 'We offer cinematic CGI, smart maquettes, interactive experiences, galleries, and media production. <a href="/services/rendering-en.html">Explore services</a>',
      quote: 'For a quote, share project type, timeline, and location. <a href="#" data-gh-chat-action="open-form">Open enquiry form</a> or call <a href="tel:+966502786513">+966 50 278 6513</a>',
      contact: 'Reach us on <a href="https://wa.me/966502786513">WhatsApp</a> or <a href="mailto:info@3dgraphicshouse.com">info@3dgraphicshouse.com</a>',
      maquette: 'Smart maquettes at any scale with projection mapping. <a href="/services/maquettes-en.html">Learn more</a>',
      clients: 'Clients include Al Rajhi, Raffal, Anan Eskan, and more. <a href="/portfolio-en.html">Portfolio</a>',
      location: 'Branches: Jeddah, Muscat, Manama, Egypt — worldwide delivery.',
      launch: 'Launch™: ProjectLaunch, GrowthLaunch, BrandScale, and institutional events.',
      partner: 'Agency Partner Network™ — <a href="/partner-network-en.html">Partner with us</a>',
      insights: 'Knowledge Hub: <a href="/insights/articles.html">articles</a> and free tools.',
      fallback: 'Pick an option below or <a href="tel:+966502786513">call us</a>.',
    };
    return pack[intent] || pack.fallback;
  }

  function localFallback(text) {
    return localReply({ message: text, lang: isAr ? 'ar' : 'en', page: location.pathname });
  }

  function handleQuickReply(intent, label) {
    appendMessage(label, true);
    track('assistant_quick_reply', { intent: intent, page_path: location.pathname });
    respondWith({
      message: label,
      intent: intent,
      lang: isAr ? 'ar' : 'en',
      page: location.pathname,
      history: loadSession().messages.slice(-6),
    }, label);
  }

  function sendUserMessage() {
    var field = getField();
    if (!field) return;
    var text = field.value.trim();
    if (!text) return;
    field.value = '';
    appendMessage(text, true);
    respondWith({
      message: text,
      lang: isAr ? 'ar' : 'en',
      page: location.pathname,
      history: loadSession().messages.slice(-6),
    }, text);
  }

  function ensureWelcome() {
    var session = loadSession();
    var msgs = getMsgs();
    if (!msgs) return;
    msgs.innerHTML = '';
    if (session.messages.length) {
      session.messages.forEach(function (m) {
        appendMessage(m.text, m.role === 'user', true);
      });
    } else {
      var welcome = isAr
        ? 'مرحباً! 👋 أنا مساعد Graphics House. كيف يمكنني مساعدتك؟'
        : 'Hello! 👋 I\'m the Graphics House assistant. How can I help?';
      appendMessage(welcome, false, true);
      session.messages.push({ role: 'assistant', text: welcome });
      saveSession(session);
    }
    renderQuickReplies(defaultQuickReplies());
    fetchReply({
      message: '__init__',
      lang: isAr ? 'ar' : 'en',
      page: location.pathname,
    }).then(function (res) {
      if (res && res.quickReplies && res.quickReplies.length) {
        renderQuickReplies(res.quickReplies);
      }
    }).catch(function () { /* keep defaults */ });
  }

  function setOpen(open) {
    var panel = getPanel();
    if (!panel) return;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      track('assistant_open', { page_path: location.pathname });
      var field = getField();
      if (field) setTimeout(function () { field.focus(); }, 120);
    } else {
      track('assistant_close', { page_path: location.pathname });
    }
    if (typeof window.ghFloatBrandAction === 'undefined' && typeof syncBrandActiveState === 'function') {
      syncBrandActiveState();
    }
    document.dispatchEvent(new CustomEvent('gh-chat-toggle', { detail: { open: open } }));
  }

  window.toggleChat = function () {
    var panel = getPanel();
    if (!panel) return;
    setOpen(!panel.classList.contains('open'));
  };

  function init() {
    var panel = getPanel();
    if (!panel) return;

    ensureWelcome();

    document.querySelectorAll('[data-gh-chat-close]').forEach(function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });

    var sendBtn = getSendBtn();
    if (sendBtn) sendBtn.addEventListener('click', sendUserMessage);

    var field = getField();
    if (field) {
      field.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendUserMessage();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        setOpen(false);
      }
    });

    document.addEventListener('gh-chat-toggle', function () {
      var brandBtn = document.querySelector('.gh-float-brand[data-gh-brand-action]');
      if (!brandBtn) return;
      brandBtn.classList.toggle('is-active', panel.classList.contains('open'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
