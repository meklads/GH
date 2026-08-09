(function () {
  'use strict';

  var CFG = window.GH_QUOTE_FORM || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileReady = false;
  var turnstileQueue = [];

  var style = document.createElement('style');
  style.textContent = [
    '.form-feedback{display:none;margin-bottom:14px;padding:14px 16px;font-size:14px;line-height:1.75;border-radius:8px;font-family:Tajawal,sans-serif}',
    '.form-feedback.is-visible{display:block}',
    '.form-feedback.is-success{background:rgba(34,139,34,.08);border:1px solid rgba(34,139,34,.22);color:#1a5c1a}',
    '.form-feedback.is-pending{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.35);color:#5c4a18}',
    '.form-feedback.is-error{background:rgba(180,0,0,.06);border:1px solid rgba(180,0,0,.18);color:#8b1a1a}',
    '.form-submit:disabled{opacity:.65;cursor:not-allowed}',
    '.gh-form-security{margin-bottom:14px}',
    '.gh-honeypot{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    '.gh-turnstile{min-height:65px;display:flex;align-items:center}',
    'html[dir="rtl"] .gh-turnstile{justify-content:flex-end}',
    'html[dir="ltr"] .gh-turnstile{justify-content:flex-start}'
  ].join('');
  document.head.appendChild(style);

  function ensureFeedback(form) {
    var box = form.querySelector('.form-feedback');
    if (box) return box;
    box = document.createElement('div');
    box.className = 'form-feedback';
    box.setAttribute('aria-live', 'polite');
    var submit = form.querySelector('.form-submit, button[type="submit"]');
    if (submit) form.insertBefore(box, submit);
    else form.appendChild(box);
    return box;
  }

  function showFeedback(box, type, html) {
    box.className = 'form-feedback is-visible is-' + type;
    box.innerHTML = html;
  }

  function ensureSecurityFields(form) {
    if (!form.querySelector('.gh-form-security')) {
      var wrap = document.createElement('div');
      wrap.className = 'gh-form-security';
      wrap.innerHTML =
        '<div class="gh-honeypot" aria-hidden="true">' +
        '<label for="">لا تملأ</label>' +
        '<input type="text" name="_honey" tabindex="-1" autocomplete="off">' +
        '</div>' +
        '<div class="gh-turnstile"></div>';
      var anchor = form.querySelector('.form-feedback, .form-submit, button[type="submit"]');
      if (anchor) form.insertBefore(wrap, anchor);
      else form.appendChild(wrap);
    }
    if (!form.querySelector('input[name="_captcha"]')) {
      var cap = document.createElement('input');
      cap.type = 'hidden';
      cap.name = '_captcha';
      cap.value = 'false';
      form.appendChild(cap);
    }
  }

  function loadTurnstile(cb) {
    if (window.turnstile) {
      cb();
      return;
    }
    turnstileQueue.push(cb);
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) return;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = function () {
      turnstileReady = true;
      turnstileQueue.splice(0).forEach(function (fn) { fn(); });
    };
    document.head.appendChild(s);
  }

  function renderTurnstile(form) {
    if (!TURNSTILE_KEY) return;
    var box = form.querySelector('.gh-turnstile');
    if (!box || box.dataset.rendered === '1') return;

    loadTurnstile(function () {
      if (!window.turnstile || box.dataset.rendered === '1') return;
      var id = window.turnstile.render(box, {
        sitekey: TURNSTILE_KEY,
        theme: 'light',
        language: document.documentElement.lang === 'en' ? 'en' : 'ar',
        callback: function () { form.dataset.tsVerified = '1'; },
        'expired-callback': function () { form.dataset.tsVerified = '0'; },
        'error-callback': function () { form.dataset.tsVerified = '0'; }
      });
      box.dataset.rendered = '1';
      box.dataset.widgetId = id;
    });
  }

  function resetTurnstile(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return;
    window.turnstile.reset(box.dataset.widgetId);
    form.dataset.tsVerified = '0';
  }

  function turnstileToken(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return '';
    return window.turnstile.getResponse(box.dataset.widgetId) || '';
  }

  function wireForm(form) {
    if (form.dataset.ghQuoteWired === '1') return;
    form.dataset.ghQuoteWired = '1';

    var action = form.getAttribute('action') || '';
    if (!action.includes('formsubmit.co')) return;

    var ajaxAction = action.includes('/ajax/')
      ? action
      : action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

    form.removeAttribute('target');
    ensureSecurityFields(form);
    renderTurnstile(form);

    var feedback = ensureFeedback(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value.trim()) return;

      if (TURNSTILE_KEY) {
        var token = turnstileToken(form);
        if (!token) {
          showFeedback(feedback, 'error', 'يرجى إكمال التحقق الأمني (أنا لست روبوتاً) قبل الإرسال.');
          return;
        }
      }

      var btn = form.querySelector('.form-submit, button[type="submit"]');
      var label = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'جاري الإرسال…';
      }

      var data = new FormData(form);
      data.set('_captcha', 'false');
      if (TURNSTILE_KEY) {
        data.set('cf-turnstile-response', turnstileToken(form));
      }

      fetch(ajaxAction, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          return res.json().catch(function () {
            return { success: res.ok, message: '' };
          });
        })
        .then(function (payload) {
          var msg = (payload && payload.message) ? String(payload.message) : '';
          if (payload && (payload.success === true || payload.success === 'true')) {
            if (window.ghTrack) {
              window.ghTrack('form_submit', {
                form_name: form.id || 'quote_form',
                page_path: location.pathname,
              });
              window.ghTrack('generate_lead', { form_name: form.id || 'quote_form' });
            }
            showFeedback(
              feedback,
              'success',
              '<strong>تم إرسال طلبك بنجاح.</strong><br>سيتواصل معك فريقنا خلال 24 ساعة عمل.'
            );
            form.reset();
            resetTurnstile(form);
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
          }
          if (/activation|activate/i.test(msg)) {
            showFeedback(
              feedback,
              'pending',
              '<strong>تفعيل لمرة واحدة مطلوب.</strong><br>تم إرسال رابط تفعيل إلى <strong>dot4life.team@gmail.com</strong>. افتح البريد واضغط «Activate Form»، ثم أعد الإرسال.'
            );
            resetTurnstile(form);
            return;
          }
          showFeedback(
            feedback,
            'error',
            'تعذّر إرسال الطلب. جرّب مرة أخرى أو تواصل عبر واتساب: <a href="https://wa.me/966502786513" target="_blank" rel="noopener">+966 50 278 6513</a>'
          );
          resetTurnstile(form);
        })
        .catch(function () {
          showFeedback(
            feedback,
            'error',
            'تعذّر إرسال الطلب. تحقق من الاتصال بالإنترنت أو تواصل عبر واتساب.'
          );
          resetTurnstile(form);
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = label;
          }
        });
    });
  }

  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(wireForm);

  if (/[?&]sent=1/.test(location.search)) {
    document.querySelectorAll('form[action*="formsubmit.co"]').forEach(function (form) {
      var feedback = ensureFeedback(form);
      showFeedback(
        feedback,
        'success',
        '<strong>تم إرسال طلبك بنجاح.</strong><br>سيتواصل معك فريقنا خلال 24 ساعة عمل.'
      );
      if (form.closest('#booking')) {
        form.closest('#booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      history.replaceState(null, '', location.pathname + location.hash);
    });
  }
})();
