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
        required: 'Please complete the required fields.',
        url: 'Please add a valid portfolio or CV link (https://…).',
        captcha: 'Please complete the security check before submitting.',
        sending: 'Sending…',
        success:
          '<strong>Profile received.</strong><br>We review submissions as the roster grows. If your profile matches an opening, we will follow up.',
        error: 'Could not send. Please try again, or email info@3dgraphicshouse.com.',
        network: 'Connection error. Check your network and try again.',
      }
    : {
        required: 'يرجى تعبئة الحقول المطلوبة.',
        url: 'يرجى إضافة رابط صحيح للمعرض أو السيرة (يبدأ بـ https://).',
        captcha: 'يرجى إكمال التحقق الأمني قبل الإرسال.',
        sending: 'جارٍ الإرسال…',
        success:
          '<strong>تم استلام ملفك.</strong><br>نراجع الطلبات مع نمو الشبكة. إن تطابق ملفك مع فرصة مناسبة، سنتواصل معك.',
        error: 'تعذّر الإرسال. حاول مجدداً أو راسلنا على info@3dgraphicshouse.com.',
        network: 'خطأ في الاتصال. تحقق من الشبكة وحاول مجدداً.',
      };

  var style = document.createElement('style');
  style.textContent = [
    '.form-feedback{display:none;margin-bottom:14px;padding:14px 16px;font-size:14px;line-height:1.75;border-radius:8px}',
    '.form-feedback.is-visible{display:block}',
    '.form-feedback.is-success{background:rgba(34,139,34,.08);border:1px solid rgba(34,139,34,.22);color:#1a5c1a}',
    '.form-feedback.is-error{background:rgba(180,0,0,.06);border:1px solid rgba(180,0,0,.18);color:#8b1a1a}',
    '.col-form-actions .col-btn--primary:disabled{opacity:.65;cursor:not-allowed}',
    '.gh-form-security{margin:4px 0 8px}',
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
    var actions = form.querySelector('.col-form-actions');
    if (actions) form.insertBefore(box, actions);
    else form.appendChild(box);
    return box;
  }

  function showFeedback(box, type, html) {
    box.className = 'form-feedback is-visible is-' + type;
    box.innerHTML = html;
  }

  function ensureSecurityFields(form) {
    if (form.querySelector('.gh-form-security')) return;
    var wrap = document.createElement('div');
    wrap.className = 'gh-form-security';
    wrap.innerHTML =
      '<div class="gh-honeypot" aria-hidden="true">' +
      '<label>Leave blank</label>' +
      '<input type="text" name="botcheck" tabindex="-1" autocomplete="off">' +
      '</div>' +
      '<div class="gh-turnstile"></div>';
    var actions = form.querySelector('.col-form-actions');
    if (actions) form.insertBefore(wrap, actions);
    else form.appendChild(wrap);
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

  function looksLikeUrl(v) {
    return /^https?:\/\/\S+/i.test(String(v || '').trim());
  }

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || '').trim() : '';
  }

  function wireDisciplinePickers(form) {
    var select = form.querySelector('[name="discipline"]');
    if (!select) return;
    document.querySelectorAll('[data-discipline]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.getAttribute('data-discipline');
        if (!code) return;
        select.value = code;
        document.querySelectorAll('[data-discipline]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        var formSec = document.getElementById('apply');
        if (formSec) formSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        select.focus({ preventScroll: true });
      });
    });
  }

  function wireReveal() {
    var nodes = document.querySelectorAll('.col-reveal');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) {
        n.classList.add('is-visible');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function wireForm() {
    var form = document.getElementById('collaboratorForm');
    if (!form || form.dataset.wired === '1') return;
    form.dataset.wired = '1';

    ensureSecurityFields(form);
    renderTurnstile(form);
    wireDisciplinePickers(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var feedback = ensureFeedback(form);
      var btn = form.querySelector('button[type="submit"]');
      var honey = form.querySelector('input[name="botcheck"]');
      if (honey && honey.value.trim()) return;

      var first = val(form, 'first_name');
      var last = val(form, 'last_name');
      var email = val(form, 'email');
      var city = val(form, 'city');
      var discipline = val(form, 'discipline');
      var portfolio = val(form, 'portfolio_url');
      var cv = val(form, 'cv_url');
      var phone = val(form, 'phone');
      var consent = form.querySelector('[name="consent"]');

      if (!first || !last || !email || !city || !discipline) {
        showFeedback(feedback, 'error', MSG.required);
        return;
      }
      if (!looksLikeUrl(portfolio) && !looksLikeUrl(cv)) {
        showFeedback(feedback, 'error', MSG.url);
        return;
      }
      if (consent && !consent.checked) {
        showFeedback(feedback, 'error', MSG.required);
        return;
      }
      if (TURNSTILE_KEY && !turnstileToken(form)) {
        showFeedback(feedback, 'error', MSG.captcha);
        return;
      }

      var fullName = first + ' ' + last;
      var lines = [
        'Form: collaborator roster',
        'Name: ' + fullName,
        'Discipline: ' + discipline,
        'City: ' + city,
        val(form, 'country') && 'Country: ' + val(form, 'country'),
        phone && 'Phone: ' + phone,
        val(form, 'years_experience') && 'Experience: ' + val(form, 'years_experience'),
        val(form, 'availability') && 'Availability: ' + val(form, 'availability'),
        portfolio && 'Portfolio: ' + portfolio,
        cv && 'CV: ' + cv,
        val(form, 'linkedin_url') && 'LinkedIn: ' + val(form, 'linkedin_url'),
        val(form, 'note') && 'Note: ' + val(form, 'note'),
        'Page: ' + location.pathname,
      ].filter(Boolean);

      var payload = {
        subject: isEn
          ? 'Collaborator profile — Graphics House'
          : 'ملف متعاون — جرافيكس هاوس',
        from_name: 'Graphics House Collaborators',
        email: email,
        city: city,
        source: 'partner',
        form_type: 'collaborator',
        discipline: discipline,
        portfolio_url: portfolio,
        cv_url: cv,
        message: lines.join('\n'),
        botcheck: '',
      };
      /* Include name/phone only when phone is provided (Worker requires both together).
         Name is always in the message body above. */
      if (phone.replace(/\D/g, '').length >= 8) {
        payload.name = fullName;
        payload.phone = phone;
      }
      if (TURNSTILE_KEY) {
        payload['cf-turnstile-response'] = turnstileToken(form);
      }

      var prev = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = MSG.sending;
      }
      showFeedback(feedback, 'success', '');
      feedback.classList.remove('is-visible');

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
            showFeedback(feedback, 'success', MSG.success);
            form.reset();
            document.querySelectorAll('[data-discipline]').forEach(function (b) {
              b.classList.remove('is-active');
            });
            resetTurnstile(form);
            if (window.ghTrack) {
              window.ghTrack('generate_lead', { form_name: 'collaborator_form' });
            }
          } else {
            showFeedback(
              feedback,
              'error',
              (res.data && res.data.message) || MSG.error
            );
            resetTurnstile(form);
          }
        })
        .catch(function () {
          showFeedback(feedback, 'error', MSG.network);
          resetTurnstile(form);
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = prev;
          }
        });
    });
  }

  function init() {
    wireReveal();
    wireForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
