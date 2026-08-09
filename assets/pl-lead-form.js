/**
 * ProjectLaunch™ landing lead form → GH form proxy.
 */
(function () {
  'use strict';

  var FORMS = window.GH_FORMS || {};
  var CFG = window.GH_QUOTE_FORM || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileQueue = [];

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

  function ensureSecurity(form) {
    if (form.querySelector('.gh-form-security')) return;
    var wrap = document.createElement('div');
    wrap.className = 'gh-form-security pl-span-2';
    wrap.innerHTML =
      '<div class="gh-honeypot" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0">' +
      '<label>Leave blank</label>' +
      '<input type="text" name="botcheck" tabindex="-1" autocomplete="off">' +
      '</div>' +
      '<div class="gh-turnstile" style="min-height:65px"></div>';
    var btnWrap = form.querySelector('button[type="submit"]');
    if (btnWrap && btnWrap.parentElement) {
      form.insertBefore(wrap, btnWrap.parentElement);
    } else {
      form.appendChild(wrap);
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
        theme: 'dark',
        language: 'ar',
      });
      box.dataset.rendered = '1';
      box.dataset.widgetId = id;
    });
  }

  function token(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return '';
    return window.turnstile.getResponse(box.dataset.widgetId) || '';
  }

  function resetTs(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return;
    window.turnstile.reset(box.dataset.widgetId);
  }

  function show(fb, type, msg) {
    fb.className = 'pl-span-2 pl-form-feedback is-visible is-' + type;
    fb.textContent = msg;
  }

  function wire() {
    var form = document.getElementById('plLeadForm');
    if (!form || form.dataset.wired === '1') return;
    form.dataset.wired = '1';

    ensureSecurity(form);
    renderTurnstile(form);

    var fb = document.getElementById('plFormFeedback');
    var btn = document.getElementById('plSubmitBtn');
    var defaultLabel = btn ? btn.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var honey = form.querySelector('input[name="botcheck"]');
      if (honey && honey.value.trim()) return;

      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var phone = (form.querySelector('[name="phone"]') || {}).value || '';
      var company = (form.querySelector('[name="company"]') || {}).value || '';
      var projectType = (form.querySelector('[name="project_type"]') || {}).value || '';
      var city = (form.querySelector('[name="city"]') || {}).value || '';

      name = name.trim();
      email = email.trim();
      phone = phone.trim();
      company = company.trim();
      city = city.trim();

      if (!name || !email || !phone || !company || !projectType || !city) {
        show(fb, 'error', 'يرجى تعبئة جميع الحقول المطلوبة.');
        return;
      }

      if (TURNSTILE_KEY && !token(form)) {
        show(fb, 'error', 'يرجى إكمال التحقق الأمني قبل الإرسال.');
        return;
      }

      show(fb, 'pending', 'جارٍ إرسال طلبك…');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'جارٍ الإرسال…';
      }

      var payload = {
        subject: 'ProjectLaunch™ — طلب تقييم جاهزية إطلاق',
        from_name: 'ProjectLaunch Landing',
        name: name,
        email: email,
        phone: phone,
        company: company,
        service: 'ProjectLaunch',
        interest: projectType,
        message:
          'طلب تقييم جاهزية إطلاق مشروع عبر صفحة ProjectLaunch™\n' +
          'نوع المشروع: ' +
          projectType +
          '\n' +
          'مدينة المشروع: ' +
          city +
          '\n' +
          'الشركة: ' +
          company,
        page: typeof location !== 'undefined' ? location.href : '',
        botcheck: '',
      };

      if (TURNSTILE_KEY) {
        payload['cf-turnstile-response'] = token(form);
      }

      fetch(FORMS.formEndpoint || 'https://3dgraphicshouse.com/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          return r.json();
        })
        .then(function (res) {
          if (res && res.success) {
            show(fb, 'success', 'تم الإرسال بنجاح. سنتواصل معك قريبًا لتقييم جاهزية إطلاق مشروعك.');
            form.reset();
            resetTs(form);
            if (btn) {
              btn.disabled = true;
              btn.textContent = 'تم الإرسال';
            }
            if (window.ghTrack) {
              window.ghTrack('form_submit', {
                form_name: 'project_launch_lead',
                page_path: location.pathname,
              });
              window.ghTrack('generate_lead', {
                form_name: 'project_launch_lead',
                event_category: 'ProjectLaunch',
              });
            } else if (window.gtag) {
              window.gtag('event', 'generate_lead', {
                event_category: 'ProjectLaunch',
                event_label: 'launch_readiness_form',
              });
            }
          } else {
            show(fb, 'error', 'تعذّر الإرسال. حاول مرة أخرى أو راسلنا على واتساب.');
            resetTs(form);
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = defaultLabel;
            }
          }
        })
        .catch(function () {
          show(fb, 'error', 'خطأ في الاتصال. حاول مرة أخرى أو تواصل عبر واتساب.');
          resetTs(form);
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = defaultLabel;
          }
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
