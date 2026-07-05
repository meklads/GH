(function () {
  'use strict';

  var CFG = window.GH_QUOTE_FORM || {};
  var FORMS = window.GH_FORMS || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileQueue = [];
  var isEn = (document.documentElement.lang || '').toLowerCase() === 'en'
    || document.documentElement.dir === 'ltr';

  var MSG = isEn ? {
    required: 'Please fill in the required fields (first name and email).',
    captcha: 'Please complete the security check before submitting.',
    sending: 'Sending…',
    success: 'Sent! We will contact you within 24 hours.',
    error: 'Error — please try again',
    network: 'Connection error — email us directly'
  } : {
    required: 'يرجى تعبئة الحقول المطلوبة (الاسم الأول والبريد الإلكتروني).',
    captcha: 'يرجى إكمال التحقق الأمني (أنا لست روبوتاً) قبل الإرسال.',
    sending: 'جارٍ الإرسال…',
    success: 'تم الإرسال! سنتواصل معك خلال 24 ساعة.',
    error: 'خطأ، يرجى المحاولة مجدداً',
    network: 'خطأ في الاتصال، راسلنا مباشرة على الإيميل'
  };

  var style = document.createElement('style');
  style.textContent = [
    '.gh-form-security{margin:0 0 18px}',
    '.gh-honeypot{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    '.gh-turnstile{min-height:65px;display:flex;align-items:center}',
    'html[dir="rtl"] .gh-turnstile{justify-content:flex-end}',
    'html[dir="ltr"] .gh-turnstile{justify-content:flex-start}'
  ].join('');
  document.head.appendChild(style);

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
      turnstileQueue.splice(0).forEach(function (fn) { fn(); });
    };
    document.head.appendChild(s);
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
      var anchor = form.querySelector('.fn, .bs, button[type="submit"]');
      if (anchor) form.insertBefore(wrap, anchor);
      else form.appendChild(wrap);
    }
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
        language: isEn ? 'en' : 'ar'
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

  function setBtn(btn, html, bg, color, disabled) {
    btn.innerHTML = html;
    if (bg) btn.style.background = bg;
    if (color) btn.style.color = color;
    btn.disabled = !!disabled;
  }

  function wireContactForm() {
    var form = document.getElementById('contactForm');
    if (!form || form.dataset.ghContactWired === '1') return;
    form.dataset.ghContactWired = '1';
    form.removeAttribute('onsubmit');

    ensureSecurityFields(form);
    renderTurnstile(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      var email = form.querySelector('[name="email"]').value.trim();
      var first = form.querySelector('[name="first_name"]').value.trim();
      var honey = form.querySelector('input[name="botcheck"]');
      if (honey && honey.value.trim()) return;

      if (!email || !first) {
        alert(MSG.required);
        return;
      }

      if (TURNSTILE_KEY && !turnstileToken(form)) {
        alert(MSG.captcha);
        return;
      }

      var spin = '<span class="material-symbols-outlined" style="font-size:16px;animation:spin 1s linear infinite">progress_activity</span> ';
      setBtn(btn, spin + MSG.sending, null, null, true);

      var payload = {
        subject: isEn ? 'New inquiry — Graphics House website' : 'استفسار جديد، موقع جرافيكس هاوس',
        from_name: 'Graphics House Website',
        name: first + ' ' + form.querySelector('[name="last_name"]').value.trim(),
        email: email,
        phone: form.querySelector('[name="phone"]').value.trim(),
        company: form.querySelector('[name="company"]').value.trim(),
        job_title: form.querySelector('[name="job_title"]').value.trim(),
        service: form.querySelector('[name="service"]').value,
        interest: form.querySelector('[name="interest"]').value,
        message: form.querySelector('[name="message"]').value.trim(),
        botcheck: ''
      };

      if (TURNSTILE_KEY) {
        payload['cf-turnstile-response'] = turnstileToken(form);
      }

      fetch(FORMS.formEndpoint || 'https://3dgraphicshouse.com/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            setBtn(
              btn,
              '<span class="material-symbols-outlined" style="font-size:16px">check_circle</span> ' + MSG.success,
              '#2D7D46',
              '#fff',
              true
            );
            form.reset();
            resetTurnstile(form);
          } else {
            setBtn(
              btn,
              '<span class="material-symbols-outlined" style="font-size:16px">error</span> ' + MSG.error,
              '#C0392B',
              '#fff',
              false
            );
            resetTurnstile(form);
          }
        })
        .catch(function () {
          setBtn(
            btn,
            '<span class="material-symbols-outlined" style="font-size:16px">error</span> ' + MSG.network,
            '#C0392B',
            '#fff',
            false
          );
          resetTurnstile(form);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireContactForm);
  } else {
    wireContactForm();
  }
})();
