(function () {
  'use strict';

  var CFG = window.GH_QUOTE_FORM || {};
  var FORMS = window.GH_FORMS || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileQueue = [];
  var isEn =
    (document.documentElement.lang || '').toLowerCase() === 'en' ||
    document.documentElement.dir === 'ltr';

  var MSG = isEn
    ? {
        captcha: 'Please complete the security check before submitting.',
        sending: 'Sending…',
        success:
          '<strong>Request sent.</strong><br>Our team will contact you within 24 business hours.',
        error:
          'Could not send. Please try again or WhatsApp: <a href="https://wa.me/966502786513" target="_blank" rel="noopener">+966 50 278 6513</a>',
        network: 'Connection error. Check your network or contact us on WhatsApp.',
        companyEmail:
          'Please use a company email (not Gmail/Hotmail), with full name and mobile number.',
      }
    : {
        captcha: 'يرجى إكمال التحقق الأمني (أنا لست روبوتاً) قبل الإرسال.',
        sending: 'جاري الإرسال…',
        success:
          '<strong>تم إرسال طلبك بنجاح.</strong><br>سيتواصل معك فريقنا خلال 24 ساعة عمل.',
        error:
          'تعذّر إرسال الطلب. جرّب مرة أخرى أو تواصل عبر واتساب: <a href="https://wa.me/966502786513" target="_blank" rel="noopener">+966 50 278 6513</a>',
        network: 'تعذّر إرسال الطلب. تحقق من الاتصال بالإنترنت أو تواصل عبر واتساب.',
        companyEmail:
          'يرجى استخدام بريد الشركة (وليس Gmail أو Hotmail)، مع الاسم الكامل ورقم الجوال.',
      };

  var style = document.createElement('style');
  style.textContent = [
    '.form-feedback{display:none;margin-bottom:14px;padding:14px 16px;font-size:14px;line-height:1.75;border-radius:8px;font-family:Tajawal,Inter,sans-serif}',
    '.form-feedback.is-visible{display:block}',
    '.form-feedback.is-success{background:rgba(34,139,34,.08);border:1px solid rgba(34,139,34,.22);color:#1a5c1a}',
    '.form-feedback.is-error{background:rgba(180,0,0,.06);border:1px solid rgba(180,0,0,.18);color:#8b1a1a}',
    '.form-submit:disabled{opacity:.65;cursor:not-allowed}',
    '.gh-form-security{margin-bottom:14px}',
    '.gh-honeypot{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    '.gh-turnstile{min-height:65px;display:flex;align-items:center}',
    'html[dir="rtl"] .gh-turnstile{justify-content:flex-end}',
    'html[dir="ltr"] .gh-turnstile{justify-content:flex-start}',
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
        '<label>Leave blank</label>' +
        '<input type="text" name="botcheck" tabindex="-1" autocomplete="off">' +
        '</div>' +
        '<div class="gh-turnstile"></div>';
      var anchor = form.querySelector('.form-feedback, .form-submit, button[type="submit"]');
      if (anchor) form.insertBefore(wrap, anchor);
      else form.appendChild(wrap);
    }
    // Prefer Worker honeypot name
    var honey = form.querySelector('input[name="_honey"]');
    if (honey && !form.querySelector('input[name="botcheck"]')) {
      honey.setAttribute('name', 'botcheck');
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
      turnstileQueue.splice(0).forEach(function (fn) {
        fn();
      });
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
        language: isEn ? 'en' : 'ar',
      });
      box.dataset.rendered = '1';
      box.dataset.widgetId = id;
    });
  }

  function turnstileToken(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return '';
    return window.turnstile.getResponse(box.dataset.widgetId) || '';
  }

  function resetTurnstile(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return;
    window.turnstile.reset(box.dataset.widgetId);
  }

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || '').trim() : '';
  }

  function formSource(form) {
    if (form.classList.contains('pn-form') || /partner-network/i.test(location.pathname)) {
      return 'partner';
    }
    return form.getAttribute('data-gh-form-source') || 'quote';
  }

  function wireForm(form) {
    if (form.dataset.ghQuoteWired === '1') return;
    form.dataset.ghQuoteWired = '1';

    form.classList.add('gh-quote-form');
    form.removeAttribute('action');
    form.removeAttribute('target');
    form.setAttribute('method', 'POST');
    form.setAttribute('novalidate', '');

    // Drop FormSubmit-only fields
    form.querySelectorAll('input[name="_next"], input[name="_captcha"], input[name="_template"]').forEach(function (el) {
      el.remove();
    });

    ensureSecurityFields(form);
    renderTurnstile(form);

    var feedback = ensureFeedback(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var honey = form.querySelector('input[name="botcheck"], input[name="_honey"]');
      if (honey && honey.value.trim()) return;

      if (TURNSTILE_KEY && !turnstileToken(form)) {
        showFeedback(feedback, 'error', MSG.captcha);
        return;
      }

      var btn = form.querySelector('.form-submit, button[type="submit"]');
      var label = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = MSG.sending;
      }

      var subject = val(form, '_subject') || (isEn ? 'Quote request — Graphics House' : 'طلب عرض سعر — جرافيكس هاوس');
      var source = formSource(form);
      var payload = {
        subject: subject,
        from_name: 'Graphics House Website',
        name: val(form, 'name'),
        email: val(form, 'email'),
        phone: val(form, 'phone'),
        company: val(form, 'company') || val(form, 'agency_name'),
        service: val(form, 'service'),
        city: val(form, 'city'),
        job_title: val(form, 'job_title'),
        message: val(form, 'message'),
        page: location.pathname,
        source: source,
        language: isEn ? 'en' : 'ar',
        botcheck: '',
      };

      if (TURNSTILE_KEY) {
        payload['cf-turnstile-response'] = turnstileToken(form);
      }

      fetch(FORMS.formEndpoint || 'https://3dgraphicshouse.com/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          return r.json().then(function (data) {
            return { ok: r.ok, data: data };
          });
        })
        .then(function (res) {
          if (res.data && res.data.success) {
            if (window.ghTrack) {
              window.ghTrack('form_submit', {
                form_name: form.id || source + '_form',
                page_path: location.pathname,
              });
              window.ghTrack('generate_lead', { form_name: form.id || source + '_form' });
            }
            showFeedback(feedback, 'success', MSG.success);
            form.reset();
            resetTurnstile(form);
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
          }
          var apiMsg = (res.data && res.data.message) || '';
          if (/شركة|company email|Gmail|Hotmail/i.test(apiMsg)) {
            showFeedback(feedback, 'error', MSG.companyEmail);
          } else {
            showFeedback(feedback, 'error', apiMsg || MSG.error);
          }
          resetTurnstile(form);
        })
        .catch(function () {
          showFeedback(feedback, 'error', MSG.network);
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

  function init() {
    document
      .querySelectorAll('form.gh-quote-form')
      .forEach(wireForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
