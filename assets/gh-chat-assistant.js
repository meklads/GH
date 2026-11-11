(function () {
  'use strict';

  var STORAGE_KEY = 'ghChatSession';
  var CHAT_VERSION = 2;

  var isAr = (document.documentElement.lang || '').toLowerCase() === 'ar'
    || document.documentElement.dir === 'rtl';

  var motifSrc = (function () {
    var img = document.querySelector('.gh-chat-head-icon');
    if (img && img.getAttribute('src')) return img.getAttribute('src');
    var brand = document.querySelector('.gh-float-brand-logo');
    if (brand && brand.getAttribute('src')) return brand.getAttribute('src');
    return 'assets/chatbot-motif.png';
  })();

  var leadWidgetId = null;
  var lastIntent = '';

  function chatEndpoint() {
    return (window.GH_FORMS && window.GH_FORMS.chatEndpoint)
      || 'https://3dgraphicshouse.com/api/chat';
  }

  function formEndpoint() {
    return (window.GH_FORMS && window.GH_FORMS.formEndpoint)
      || 'https://3dgraphicshouse.com/api/form';
  }

  function turnstileKey() {
    return (window.GH_FORMS && window.GH_FORMS.turnstileSiteKey)
      || (window.GH_QUOTE_FORM && window.GH_QUOTE_FORM.turnstileSiteKey)
      || '';
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
  function getLeadSlot() {
    var panel = getPanel();
    return panel ? panel.querySelector('#ghChatLead') : null;
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

  function conversationPrefill() {
    var session = loadSession();
    var bits = [];
    (session.messages || []).slice(-6).forEach(function (m) {
      var t = String(m.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (t) bits.push((m.role === 'user' ? 'Visitor' : 'Assistant') + ': ' + t.slice(0, 120));
    });
    if (lastIntent) bits.push('Intent: ' + lastIntent);
    bits.push('Page: ' + location.pathname);
    return bits.join('\n');
  }

  function openWhatsApp() {
    var base =
      isAr
        ? 'مرحباً، أود التحدث مع أحد ممثلي Graphics House حول مشروعي.'
        : 'Hello, I would like to speak with a Graphics House representative about my project.';
    var ctx = conversationPrefill();
    var msg = encodeURIComponent(base + (ctx ? '\n\n---\n' + ctx.slice(0, 800) : ''));
    var url = (window.GH_CHAT_KB && window.GH_CHAT_KB.whatsappLink) || 'https://wa.me/966502786513';
    window.open(url + '?text=' + msg, '_blank', 'noopener,noreferrer');
    track('assistant_lead_cta', { action: 'whatsapp' });
  }

  function defaultQuickReplies() {
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
    root.querySelectorAll('[data-gh-chat-action="lead-capture"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showLeadForm(true);
        track('assistant_lead_cta', { action: 'lead-capture' });
      });
    });
  }

  function loadTurnstile(cb) {
    if (window.turnstile) {
      cb();
      return;
    }
    var existing = document.querySelector('script[data-gh-turnstile]');
    if (existing) {
      existing.addEventListener('load', cb);
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.dataset.ghTurnstile = '1';
    s.addEventListener('load', cb);
    document.head.appendChild(s);
  }

  function ensureLeadSlot() {
    var panel = getPanel();
    if (!panel) return null;
    var slot = getLeadSlot();
    if (slot) return slot;
    slot = document.createElement('div');
    slot.id = 'ghChatLead';
    slot.className = 'gh-chat-lead';
    slot.hidden = true;
    var quick = getQuick();
    if (quick && quick.parentNode) {
      quick.parentNode.insertBefore(slot, quick);
    } else {
      var input = panel.querySelector('#ghChatInput');
      if (input) panel.insertBefore(slot, input);
      else panel.appendChild(slot);
    }
    return slot;
  }

  function hideLeadForm() {
    var slot = getLeadSlot();
    if (slot) {
      slot.hidden = true;
      slot.innerHTML = '';
    }
    leadWidgetId = null;
  }

  function showLeadForm(force) {
    var slot = ensureLeadSlot();
    if (!slot) return;
    if (!force && !slot.hidden && slot.querySelector('form')) return;

    slot.hidden = false;
    slot.innerHTML =
      '<form class="gh-chat-lead-form" novalidate>' +
      '<p class="gh-chat-lead-title">' +
      (isAr ? 'اترك رقمك وسنعاود الاتصال خلال يوم عمل' : 'Leave your number — we reply within one business day') +
      '</p>' +
      '<label class="gh-sr-only" for="ghChatLeadName">' +
      (isAr ? 'الاسم' : 'Name') +
      '</label>' +
      '<input id="ghChatLeadName" name="name" type="text" autocomplete="name" required placeholder="' +
      (isAr ? 'الاسم الكامل' : 'Full name') +
      '">' +
      '<label class="gh-sr-only" for="ghChatLeadPhone">' +
      (isAr ? 'الجوال' : 'Phone') +
      '</label>' +
      '<input id="ghChatLeadPhone" name="phone" type="tel" autocomplete="tel" required placeholder="' +
      (isAr ? 'رقم الجوال' : 'Mobile number') +
      '">' +
      '<input type="text" name="botcheck" tabindex="-1" autocomplete="off" class="gh-chat-honey" aria-hidden="true">' +
      '<div class="gh-chat-turnstile" aria-hidden="true"></div>' +
      '<div class="gh-chat-lead-actions">' +
      '<button type="submit" class="gh-chat-lead-submit">' +
      (isAr ? 'أرسل' : 'Send') +
      '</button>' +
      '<button type="button" class="gh-chat-lead-cancel">' +
      (isAr ? 'إلغاء' : 'Cancel') +
      '</button>' +
      '</div>' +
      '<p class="gh-chat-lead-status" hidden></p>' +
      '</form>';

    var form = slot.querySelector('form');
    var cancel = slot.querySelector('.gh-chat-lead-cancel');
    if (cancel) cancel.addEventListener('click', hideLeadForm);
    if (form) form.addEventListener('submit', submitLeadForm);

    var key = turnstileKey();
    var box = slot.querySelector('.gh-chat-turnstile');
    if (key && box) {
      loadTurnstile(function () {
        if (!window.turnstile || !box || box.dataset.rendered === '1') return;
        try {
          leadWidgetId = window.turnstile.render(box, {
            sitekey: key,
            theme: 'dark',
            size: 'compact',
            language: isAr ? 'ar' : 'en',
          });
          box.dataset.rendered = '1';
        } catch (e) { /* ignore */ }
      });
    }

    var msgs = getMsgs();
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function leadTurnstileToken() {
    var key = turnstileKey();
    if (!key || !window.turnstile || leadWidgetId == null) return '';
    try {
      return window.turnstile.getResponse(leadWidgetId) || '';
    } catch (e) {
      return '';
    }
  }

  function submitLeadForm(e) {
    e.preventDefault();
    var form = e.target;
    var status = form.querySelector('.gh-chat-lead-status');
    var btn = form.querySelector('.gh-chat-lead-submit');
    var honey = form.querySelector('input[name="botcheck"]');
    if (honey && honey.value.trim()) return;

    var name = String(form.querySelector('[name="name"]').value || '').trim();
    var phone = String(form.querySelector('[name="phone"]').value || '').trim();
    if (!name || phone.replace(/\D/g, '').length < 8) {
      if (status) {
        status.hidden = false;
        status.textContent = isAr
          ? 'يرجى إدخال الاسم ورقم جوال صحيح.'
          : 'Please enter your name and a valid mobile number.';
      }
      return;
    }

    var key = turnstileKey();
    if (key && !leadTurnstileToken()) {
      if (status) {
        status.hidden = false;
        status.textContent = isAr
          ? 'يرجى إكمال التحقق الأمني.'
          : 'Please complete the security check.';
      }
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = isAr ? 'جارٍ الإرسال…' : 'Sending…';
    }

    var ctx = conversationPrefill();
    var payload = {
      subject: isAr
        ? 'طلب اتصال من مساعد الموقع — Graphics House'
        : 'Callback request from site assistant — Graphics House',
      from_name: 'Graphics House Chat Assistant',
      name: name,
      phone: phone,
      // Placeholder for Web3Forms (visitor left phone only)
      email: 'chat-callback@3dgraphicshouse.com',
      source: 'chat',
      page: location.href,
      intent: lastIntent || '',
      message:
        (isAr ? 'طلب معاودة اتصال من المساعد الشخصي.\n\n' : 'Callback request from the personal assistant.\n\n') +
        'Name: ' + name + '\nPhone: ' + phone + '\nIntent: ' + (lastIntent || '—') +
        '\nNote: visitor left phone for callback (no personal email).\n\n' + ctx.slice(0, 1200),
      botcheck: '',
    };
    if (key) payload['cf-turnstile-response'] = leadTurnstileToken();

    fetch(formEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = isAr ? 'أرسل' : 'Send';
        }
        if (res && res.success) {
          track('form_submit', { form_name: 'chat_lead', page_path: location.pathname });
          track('generate_lead', { form_name: 'chat_lead' });
          hideLeadForm();
          appendMessage(
            isAr
              ? 'شكراً لك. استلمنا رقمك وسيتواصل معك الفريق خلال يوم عمل.'
              : 'Thank you. We received your number and the team will call within one business day.',
            false
          );
          return;
        }
        if (status) {
          status.hidden = false;
          status.textContent =
            (res && res.message) ||
            (isAr ? 'تعذر الإرسال. جرّب واتساب أو النموذج.' : 'Could not send. Try WhatsApp or the form.');
        }
      })
      .catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = isAr ? 'أرسل' : 'Send';
        }
        if (status) {
          status.hidden = false;
          status.textContent = isAr
            ? 'تعذر الإرسال. جرّب واتساب.'
            : 'Could not send. Try WhatsApp.';
        }
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

  function handleReplyResult(res) {
    if (!res || !res.success || !res.reply) return false;
    lastIntent = res.intent || '';
    appendMessage(res.reply, false);
    if (res.quickReplies && res.quickReplies.length) {
      renderQuickReplies(res.quickReplies);
    }
    track('assistant_message_sent', {
      intent: res.intent || '',
      source: res.source || 'kb',
      page_path: location.pathname,
    });
    if (res.intent === 'quote' || res.intent === 'session' || res.intent === 'packages') {
      track('assistant_lead_cta', { intent: res.intent });
    }
    // Never auto-open WhatsApp — visitor chooses the CTA
    if (res.askLead) {
      showLeadForm(false);
    }
    return true;
  }

  function respondWith(payload) {
    var typing = showTyping();
    var sendBtn = getSendBtn();
    if (sendBtn) sendBtn.disabled = true;

    return fetchReply(payload)
      .then(function (res) {
        hideTyping(typing);
        if (sendBtn) sendBtn.disabled = false;
        if (handleReplyResult(res)) return;
        applyLocalResponse(localRespond(payload));
      })
      .catch(function () {
        hideTyping(typing);
        if (sendBtn) sendBtn.disabled = false;
        applyLocalResponse(localRespond(payload));
      });
  }

  function applyLocalResponse(res) {
    lastIntent = res.intent || '';
    appendMessage(res.reply, false);
    if (res.quickReplies && res.quickReplies.length) {
      renderQuickReplies(res.quickReplies);
    }
    track('assistant_message_sent', {
      intent: res.intent || 'fallback',
      source: 'local',
      page_path: location.pathname,
    });
    if (res.intent === 'quote' || res.intent === 'session' || res.intent === 'packages') {
      track('assistant_lead_cta', { intent: res.intent });
    }
    if (res.askLead) {
      showLeadForm(false);
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
    var analysis = null;

    if (!intent || intent === 'fallback') {
      if (matcher && typeof matcher.analyzeMessage === 'function') {
        analysis = matcher.analyzeMessage(payload.message || '', lang, page);
        intent = analysis.intent;
      } else if (matcher) {
        intent = matcher.matchIntent(payload.message || '', lang, page);
      } else {
        intent = 'fallback';
      }
    }

    var replyLang = lang;
    if (intent === 'greeting' && matcher) {
      replyLang = matcher.greetingReplyLang(payload.message || '', lang);
    }

    var quickReplies = matcher
      ? matcher.quickRepliesForIntent(intent, lang, page)
      : defaultQuickReplies();

    var askLead = ['quote', 'session', 'human', 'project_inquiry', 'packages'].indexOf(intent) !== -1
      || String(intent).indexOf('project_') === 0;

    return {
      reply: buildLocalReply(intent, replyLang),
      intent: intent,
      quickReplies: quickReplies,
      askLead: askLead,
      openWhatsApp: false,
      bestScore: analysis && analysis.bestScore != null ? analysis.bestScore : 0,
    };
  }

  function handleQuickReply(intent, label) {
    appendMessage(label, true);
    track('assistant_quick_reply', { intent: intent, page_path: location.pathname });
    if (intent === 'human' || intent === 'whatsapp') {
      applyLocalResponse(localRespond({ intent: intent, page: location.pathname }));
      return;
    }
    respondWith({
      message: label,
      intent: intent,
      lang: isAr ? 'ar' : 'en',
      page: location.pathname,
      history: loadSession().messages.slice(-6),
    });
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
    });
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
        ? 'مرحباً! 👋 أنا مساعد Graphics House. اسأل عن الباقات، الخدمات، أو احجز جلسة إطلاق.'
        : 'Hello! 👋 I\'m the Graphics House assistant. Ask about packages, services, or book a launch session.';
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
      if (res && res.reply && !session.messages.length) {
        /* welcome already shown locally */
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
      hideLeadForm();
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
