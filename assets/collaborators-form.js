(function () {
  'use strict';

  var CFG = window.GH_QUOTE_FORM || {};
  var FORMS = window.GH_FORMS || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileQueue = [];
  var isEn =
    (document.documentElement.lang || '').toLowerCase() === 'en' ||
    document.documentElement.dir === 'ltr';

  var NOTIFY_EMAIL = 'imeklad@gmail.com';

  var MSG = isEn
    ? {
        required: 'Please complete the required fields.',
        emailMatch: 'Email and confirmation email must match.',
        url: 'Please add a valid portfolio or CV link (https://…).',
        captcha: 'Please complete the security check before submitting.',
        sending: 'Sending…',
        pending:
          '<strong>Thank you.</strong><br>We sent a confirmation link to your email. Open it within 24 hours to complete your submission — this protects us from spam.',
        success:
          '<strong>Thank you for your trust.</strong><br>Your profile was received. We appreciate your interest and will contact you at the earliest opportunity.',
        verified:
          '<strong>Email confirmed — thank you.</strong><br>Your profile is now with us. We will review it and contact you as soon as a matching opportunity arises.',
        verifyFail:
          'This confirmation link is invalid or expired. Please submit the form again.',
        error: 'Could not send. Please try again, or email ' + NOTIFY_EMAIL + '.',
        network: 'Connection error. Check your network and try again.',
      }
    : {
        required: 'يرجى تعبئة الحقول المطلوبة.',
        emailMatch: 'البريد وتأكيد البريد غير متطابقين.',
        url: 'يرجى إضافة رابط صحيح للمعرض أو السيرة (يبدأ بـ https://).',
        captcha: 'يرجى إكمال التحقق الأمني قبل الإرسال.',
        sending: 'جارٍ الإرسال…',
        pending:
          '<strong>شكراً لك.</strong><br>أرسلنا رابط تأكيد إلى بريدك. افتحه خلال 24 ساعة لإكمال الطلب — هذا يحمينا من الرسائل المزعجة.',
        success:
          '<strong>شكراً لثقتك وتقديرنا لك.</strong><br>تم استلام بياناتك. سنراجعها ونتواصل معك في أقرب فرصة.',
        verified:
          '<strong>تم تأكيد بريدك — شكراً لك.</strong><br>استلمنا ملفك بنجاح. سنراجعه ونتواصل معك في أقرب فرصة عند وجود احتياج مناسب.',
        verifyFail: 'رابط التأكيد غير صالح أو منتهي. يرجى إرسال النموذج مجدداً.',
        error: 'تعذّر الإرسال. حاول مجدداً أو راسلنا على ' + NOTIFY_EMAIL + '.',
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
    var host = form.querySelector('.gh-turnstile');
    if (!host || host.dataset.rendered === '1') return;
    loadTurnstile(function () {
      if (!window.turnstile || host.dataset.rendered === '1') return;
      host.dataset.rendered = '1';
      window.turnstile.render(host, {
        sitekey: TURNSTILE_KEY,
        theme: 'light',
      });
    });
  }

  function turnstileToken(form) {
    var host = form.querySelector('.gh-turnstile');
    if (!host || !window.turnstile) return '';
    try {
      return window.turnstile.getResponse(host) || '';
    } catch (e) {
      return '';
    }
  }

  function resetTurnstile(form) {
    var host = form.querySelector('.gh-turnstile');
    if (!host || !window.turnstile) return;
    try {
      window.turnstile.reset(host);
    } catch (e) {}
  }

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || '').trim() : '';
  }

  function looksLikeUrl(s) {
    return /^https?:\/\/.+/i.test(s || '');
  }

  function wireDisciplinePickers(form) {
    var select = form.querySelector('[name="discipline"]');
    if (!select) return;
    document.querySelectorAll('[data-discipline]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-discipline') || '';
        select.value = v;
        document.querySelectorAll('[data-discipline]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
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

  function scrollToFormFeedback(form) {
    var box = form.querySelector('.form-feedback');
    if (box && box.scrollIntoView) {
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function handleVerifiedQuery(form) {
    var params = new URLSearchParams(location.search);
    var verified = params.get('verified');
    if (verified !== '1' && verified !== '0') return;
    var feedback = ensureFeedback(form);
    if (verified === '1') {
      showFeedback(feedback, 'success', MSG.verified);
      if (window.ghTrack) {
        window.ghTrack('generate_lead', { form_name: 'collaborator_form', verified: true });
      }
    } else {
      showFeedback(feedback, 'error', MSG.verifyFail);
    }
    scrollToFormFeedback(form);
    if (history.replaceState) {
      var clean = location.pathname + location.hash;
      history.replaceState({}, '', clean);
    }
  }

  function wireForm() {
    var form = document.getElementById('collaboratorForm');
    if (!form || form.dataset.wired === '1') return;
    form.dataset.wired = '1';

    ensureSecurityFields(form);
    renderTurnstile(form);
    wireDisciplinePickers(form);
    handleVerifiedQuery(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var feedback = ensureFeedback(form);
      var btn = form.querySelector('button[type="submit"]');
      var honey = form.querySelector('input[name="botcheck"]');
      if (honey && honey.value.trim()) return;

      var first = val(form, 'first_name');
      var last = val(form, 'last_name');
      var email = val(form, 'email').toLowerCase();
      var emailConfirm = val(form, 'email_confirm').toLowerCase();
      var city = val(form, 'city');
      var discipline = val(form, 'discipline');
      var portfolio = val(form, 'portfolio_url');
      var cv = val(form, 'cv_url');
      var phone = val(form, 'phone');
      var consent = form.querySelector('[name="consent"]');

      if (!first || !last || !email || !emailConfirm || !city || !discipline) {
        showFeedback(feedback, 'error', MSG.required);
        return;
      }
      if (email !== emailConfirm) {
        showFeedback(feedback, 'error', MSG.emailMatch);
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
          ? 'Collaborator profile — Graphics House → ' + NOTIFY_EMAIL
          : 'ملف متعاون — جرافيكس هاوس → ' + NOTIFY_EMAIL,
        from_name: 'Graphics House Collaborators',
        name: fullName,
        email: email,
        email_confirm: emailConfirm,
        city: city,
        lang: isEn ? 'en' : 'ar',
        source: 'collaborator',
        form_type: 'collaborator',
        discipline: discipline,
        portfolio_url: portfolio,
        cv_url: cv,
        ccemail: NOTIFY_EMAIL,
        message: lines.join('\n') + '\nNotify: ' + NOTIFY_EMAIL,
        botcheck: '',
      };
      if (phone.replace(/\D/g, '').length >= 8) {
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
            var html = res.data.pending ? MSG.pending : MSG.success;
            if (res.data.message && res.data.pending) {
              html =
                '<strong>' +
                (isEn ? 'Thank you.' : 'شكراً لك.') +
                '</strong><br>' +
                res.data.message;
            }
            showFeedback(feedback, 'success', html);
            form.reset();
            document.querySelectorAll('[data-discipline]').forEach(function (b) {
              b.classList.remove('is-active');
            });
            resetTurnstile(form);
            if (window.ghTrack && !res.data.pending) {
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
