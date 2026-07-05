(function () {
  'use strict';

  var CFG = window.GH_QUOTE_FORM || {};
  var FORMS = window.GH_FORMS || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileQueue = [];
  var STORAGE_KEY = 'gh_checklist_unlocked';

  function isEn() {
    return (document.documentElement.lang || '').toLowerCase() === 'en'
      || document.documentElement.dir === 'ltr';
  }

  var MSG = isEn() ? {
    email: 'Please enter a valid email address.',
    captcha: 'Please complete the security check.',
    sending: 'Sending…',
    success: 'Your download is ready!',
    error: 'Something went wrong. Please try again.',
    network: 'Connection error — please try later.'
  } : {
    email: 'يرجى إدخال بريد إلكتروني صحيح.',
    captcha: 'يرجى إكمال التحقق الأمني.',
    sending: 'جارٍ الإرسال…',
    success: 'ملفك جاهز للتحميل!',
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
    loadTurnstile(function () {
      if (!window.turnstile || box.dataset.rendered === '1') return;
      var id = window.turnstile.render(box, {
        sitekey: TURNSTILE_KEY,
        theme: 'light',
        language: isEn() ? 'en' : 'ar',
        size: 'compact'
      });
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

  function showUnlock(downloadUrl) {
    var gate = document.getElementById('ghLeadGate');
    var unlock = document.getElementById('ghLeadUnlock');
    var link = document.getElementById('ghDownloadLink');
    if (gate) gate.style.display = 'none';
    if (unlock) unlock.hidden = false;
    if (link) link.href = downloadUrl;
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  }

  function wireForm(form) {
    if (!form || form.dataset.ghLeadWired === '1') return;
    form.dataset.ghLeadWired = '1';

    var msgEl = form.querySelector('.gh-lead-msg');
    var turnstileBox = form.querySelector('.gh-turnstile');
    var downloadUrl = form.dataset.download || '';
    if (turnstileBox) renderTurnstile(turnstileBox);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var btn = form.querySelector('button[type="submit"]');
      var email = (emailInput && emailInput.value || '').trim();
      var honey = form.querySelector('input[name="botcheck"]');
      if (honey && honey.value.trim()) return;

      if (!validEmail(email)) {
        if (msgEl) { msgEl.className = 'gh-lead-msg err'; msgEl.textContent = MSG.email; }
        return;
      }

      if (TURNSTILE_KEY && turnstileBox && !token(turnstileBox)) {
        if (msgEl) { msgEl.className = 'gh-lead-msg err'; msgEl.textContent = MSG.captcha; }
        return;
      }

      var origText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = MSG.sending; }
      if (msgEl) { msgEl.className = 'gh-lead-msg'; msgEl.textContent = ''; }

      var payload = {
        subject: isEn() ? 'Checklist PDF download — Graphics House' : 'تحميل قائمة الإطلاق PDF — جرافيكس هاوس',
        from_name: 'Graphics House Lead Magnet',
        email: email,
        language: isEn() ? 'en' : 'ar',
        source: 'checklist-pdf',
        list: (FORMS.mailingListName || 'gh-journal'),
        message: isEn()
          ? 'User requested Visual Launch Readiness Checklist PDF.'
          : 'طلب المستخدم تحميل قائمة جاهزية الإطلاق البصري PDF.',
        botcheck: ''
      };
      if (TURNSTILE_KEY && turnstileBox) {
        payload['cf-turnstile-response'] = token(turnstileBox);
      }

      fetch(FORMS.subscribeEndpoint || FORMS.formEndpoint || 'https://3dgraphicshouse.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            if (msgEl) { msgEl.className = 'gh-lead-msg ok'; msgEl.textContent = MSG.success; }
            showUnlock(downloadUrl);
          } else {
            if (msgEl) { msgEl.className = 'gh-lead-msg err'; msgEl.textContent = MSG.error; }
            reset(turnstileBox);
          }
        })
        .catch(function () {
          if (msgEl) { msgEl.className = 'gh-lead-msg err'; msgEl.textContent = MSG.network; }
          reset(turnstileBox);
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = origText; }
        });
    });
  }

  function init() {
    var form = document.querySelector('[data-gh-lead-magnet]');
    var downloadUrl = form && form.dataset.download;
    var unlocked = false;
    try { unlocked = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {}
    if (unlocked && downloadUrl) showUnlock(downloadUrl);
    if (form) wireForm(form);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
