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

  function getPanel() {
    return document.querySelector('#ghChatPanel.gh-chat-panel');
  }

  function ensureOverlayRoot() {
    var panel = getPanel();
    if (!panel) return;
    var root = document.getElementById('gh-chat-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'gh-chat-root';
      document.body.appendChild(root);
      root.appendChild(panel);
    } else if (panel.parentElement !== root) {
      root.appendChild(panel);
    }
    if (root.parentElement !== document.body) {
      document.body.appendChild(root);
    }
  }

  function focusChatField() {
    var field = getField();
    if (!field) return;
    try {
      field.focus({ preventScroll: true });
    } catch (e) {
      field.focus();
    }
  }
  function getMsgs() {
    var panel = getPanel();
    return panel ? panel.querySelector('#ghChatMsgs') : null;
  }
  function getQuick() {
    var panel = getPanel();
    return panel ? panel.querySelector('#ghChatQuick') : null;
  }
  function getField() {
    var panel = getPanel();
    return panel ? panel.querySelector('#ghChatField') : null;
  }
  function getSendBtn() {
    var panel = getPanel();
    return panel ? panel.querySelector('#ghChatSend') : null;
  }

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

  function openWhatsApp() {
    var msg = encodeURIComponent(
      isAr
        ? 'مرحباً، أود التحدث مع أحد ممثلي Graphics House'
        : 'Hello, I would like to speak with a Graphics House representative'
    );
    var url = (window.GH_CHAT_KB && window.GH_CHAT_KB.whatsappLink) || 'https://wa.me/966502786513';
    window.open(url + '?text=' + msg, '_blank', 'noopener,noreferrer');
    track('assistant_lead_cta', { action: 'whatsapp' });
  }

  function defaultQuickReplies() {
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
    root.querySelectorAll('[data-gh-chat-action="whatsapp"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openWhatsApp();
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
          if (res.openWhatsApp || res.intent === 'human') {
            setTimeout(openWhatsApp, 600);
          }
          return;
        }
        applyLocalResponse(localRespond(payload));
      })
      .catch(function () {
        hideTyping(typing);
        if (sendBtn) sendBtn.disabled = false;
        applyLocalResponse(localRespond(payload));
      });
  }

  function applyLocalResponse(res) {
    appendMessage(res.reply, false);
    if (res.quickReplies && res.quickReplies.length) {
      renderQuickReplies(res.quickReplies);
    }
    track('assistant_message_sent', {
      intent: res.intent || 'fallback',
      source: 'local',
      page_path: location.pathname,
    });
    if (res.intent === 'quote') {
      track('assistant_lead_cta', { intent: 'quote' });
    }
    if (res.openWhatsApp || res.intent === 'human') {
      setTimeout(openWhatsApp, 600);
    }
  }

  function buildLocalReply(intent, lang) {
    var replies = window.GH_CHAT_KB && window.GH_CHAT_KB.replies;
    if (!replies || !replies[lang]) {
      return lang === 'ar'
        ? 'اختر أحد الخيارات أو <a href="#" data-gh-chat-action="whatsapp">تحدث معنا على واتساب</a>.'
        : 'Pick an option or <a href="#" data-gh-chat-action="whatsapp">chat with us on WhatsApp</a>.';
    }
    if (replies[lang][intent]) return replies[lang][intent];
    if (intent.indexOf('project_') === 0 && replies[lang][intent.replace('project_', '')]) {
      return replies[lang][intent.replace('project_', '')];
    }
    return replies[lang].fallback;
  }

  function localRespond(payload) {
    var lang = isAr ? 'ar' : 'en';
    var page = payload.page || location.pathname;
    var matcher = window.GH_CHAT_MATCHER;
    var intent = payload.intent;

    if (!intent || intent === 'fallback') {
      intent = matcher
        ? matcher.matchIntent(payload.message || '', lang, page)
        : 'fallback';
    }

    var replyLang = lang;
    if (intent === 'greeting' && matcher) {
      replyLang = matcher.greetingReplyLang(payload.message || '', lang);
    }

    var quickReplies = matcher
      ? matcher.quickRepliesForIntent(intent, lang, page)
      : defaultQuickReplies();

    return {
      reply: buildLocalReply(intent, replyLang),
      intent: intent,
      quickReplies: quickReplies,
      openWhatsApp: intent === 'human' || intent === 'whatsapp',
    };
  }

  function localReply(payload) {
    return localRespond(payload).reply;
  }

  function handleQuickReply(intent, label) {
    appendMessage(label, true);
    track('assistant_quick_reply', { intent: intent, page_path: location.pathname });
    if (intent === 'human') {
      applyLocalResponse(localRespond({ intent: 'human', page: location.pathname }));
      return;
    }
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
    document.body.classList.toggle('gh-chat-open', open);
    if (open) {
      track('assistant_open', { page_path: location.pathname });
      setTimeout(focusChatField, 120);
    } else {
      track('assistant_close', { page_path: location.pathname });
    }
    if (typeof window.ghFloatBrandAction === 'undefined' && typeof syncBrandActiveState === 'function') {
      syncBrandActiveState();
    }
    document.dispatchEvent(new CustomEvent('gh-chat-toggle', { detail: { open: open } }));
  }

  window.toggleChat = function () {
    ensureOverlayRoot();
    var panel = getPanel();
    if (!panel) return;
    setOpen(!panel.classList.contains('open'));
  };

  function init() {
    ensureOverlayRoot();
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
