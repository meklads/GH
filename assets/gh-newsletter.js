(function () {
  'use strict';

  var CFG = window.GH_QUOTE_FORM || {};
  var FORMS = window.GH_FORMS || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileQueue = [];

  function isEn() {
    return (document.documentElement.lang || '').toLowerCase() === 'en'
      || document.documentElement.dir === 'ltr';
  }

  var MSG = isEn() ? {
    email: 'Please enter a valid email address.',
    captcha: 'Please complete the security check.',
    sending: 'Subscribing…',
    success: 'Thank you! You are subscribed to our newsletter.',
    error: 'Something went wrong. Please try again.',
    network: 'Connection error — please try later.'
  } : {
    email: 'يرجى إدخال بريد إلكتروني صحيح.',
    captcha: 'يرجى إكمال التحقق الأمني.',
    sending: 'جارٍ الاشتراك…',
    success: 'شكراً! تم اشتراكك في النشرة البريدية.',
    error: 'حدث خطأ، يرجى المحاولة مجدداً.',
    network: 'خطأ في الاتصال، حاول لاحقاً.'
  };

  function loadTurnstile(cb) {
    if (window.turnstile) { cb(); return; }
    turnstileQueue.push(cb);
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) return;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = function () { turnstileQueue.splice(0).forEach(function (fn) { fn(); }); };
    document.head.appendChild(s);
  }

  function renderTurnstile(box) {
    if (!TURNSTILE_KEY || !box || box.dataset.rendered === '1') return;
    var isSidebar = box.closest('.gh-sidebar-newsletter');
    loadTurnstile(function () {
      if (!window.turnstile || box.dataset.rendered === '1') return;
      var opts = {
        sitekey: TURNSTILE_KEY,
        theme: document.body.classList.contains('gh-insights') ? 'light' : 'dark',
        language: isEn() ? 'en' : 'ar'
      };
      if (isSidebar) opts.size = 'compact';
      var id = window.turnstile.render(box, opts);
      box.dataset.rendered = '1';
      box.dataset.widgetId = id;
    });
  }

  function token(box) {
    if (!box || !box.dataset.widgetId || !window.turnstile) return '';
    return window.turnstile.getResponse(box.dataset.widgetId) || '';
  }

  function reset(box) {
    if (!box || !box.dataset.widgetId || !window.turnstile) return;
    window.turnstile.reset(box.dataset.widgetId);
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function wireForm(form) {
    if (!form || form.dataset.ghNewsletterWired === '1') return;
    form.dataset.ghNewsletterWired = '1';

    var msgEl = form.querySelector('.gh-newsletter-msg');
    var turnstileBox = form.querySelector('.gh-turnstile');
    if (turnstileBox) renderTurnstile(turnstileBox);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var btn = form.querySelector('button[type="submit"]');
      var email = (emailInput && emailInput.value || '').trim();
      var honey = form.querySelector('input[name="botcheck"]');
      if (honey && honey.value.trim()) return;

      if (!validEmail(email)) {
        if (msgEl) { msgEl.className = 'gh-newsletter-msg err'; msgEl.textContent = MSG.email; }
        return;
      }

      if (TURNSTILE_KEY && turnstileBox && !token(turnstileBox)) {
        if (msgEl) { msgEl.className = 'gh-newsletter-msg err'; msgEl.textContent = MSG.captcha; }
        return;
      }

      var origText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = MSG.sending; }
      if (msgEl) { msgEl.className = 'gh-newsletter-msg'; msgEl.textContent = ''; }

      var payload = {
        subject: isEn() ? 'Newsletter subscription — Graphics House' : 'اشتراك في النشرة — جرافيكس هاوس',
        from_name: 'Graphics House Newsletter',
        email: email,
        language: isEn() ? 'en' : 'ar',
        source: 'insights-newsletter',
        list: (FORMS.mailingListName || 'gh-journal'),
        message: isEn()
          ? 'New newsletter subscriber from Knowledge Hub.'
          : 'مشترك جديد في النشرة من مركز المعرفة.',
        botcheck: ''
      };
      if (TURNSTILE_KEY && turnstileBox) {
        payload['cf-turnstile-response'] = token(turnstileBox);
      }

      fetch(FORMS.subscribeEndpoint || 'https://3dgraphicshouse.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            if (msgEl) { msgEl.className = 'gh-newsletter-msg ok'; msgEl.textContent = MSG.success; }
            form.reset();
            reset(turnstileBox);
          } else {
            if (msgEl) { msgEl.className = 'gh-newsletter-msg err'; msgEl.textContent = MSG.error; }
            reset(turnstileBox);
          }
        })
        .catch(function () {
          if (msgEl) { msgEl.className = 'gh-newsletter-msg err'; msgEl.textContent = MSG.network; }
          reset(turnstileBox);
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = origText; }
        });
    });
  }

  function init() {
    document.querySelectorAll('[data-gh-newsletter]').forEach(wireForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
