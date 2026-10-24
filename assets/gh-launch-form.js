/**
 * ProjectLaunch™ page — lead form (AR + EN) → GH form proxy.
 * Same endpoint, payload fields and company-email rule as the earlier inline handler.
 */
(function () {
  'use strict';

  var form = document.getElementById('plLeadForm');
  if (!form) return;

  var isEn = (document.documentElement.lang || '').toLowerCase() === 'en' || document.documentElement.dir === 'ltr';
  var FORMS = window.GH_FORMS || {};
  var KEY = (window.GH_QUOTE_FORM && window.GH_QUOTE_FORM.turnstileSiteKey) || '';
  var fb = document.getElementById('plFormFeedback');
  var btn = document.getElementById('plSubmitBtn');
  var box = document.getElementById('plTurnstile');
  var label = btn ? btn.innerHTML : '';
  var tsId = null;

  var T = isEn
    ? {
        fill: 'Please enter your full name, phone number and company email.',
        email: 'Please enter a valid email address.',
        corp: 'Please use a company email (not Gmail, Hotmail or similar), with your full name and phone number.',
        more: 'Please complete the company, project type and city fields.',
        phone: 'Please enter a valid phone number.',
        ts: 'Please complete the security check.',
        sending: 'Sending…',
        ok: 'Request sent. Our team will contact you within 24 hours.',
        err: 'Something went wrong. Please try again or WhatsApp us.',
        done: 'Sent',
      }
    : {
        fill: 'يرجى إدخال الاسم الكامل ورقم الجوال وبريد الشركة.',
        email: 'يرجى إدخال بريد إلكتروني صحيح.',
        corp: 'يرجى استخدام بريد الشركة (وليس Gmail أو Hotmail أو ما شابه)، مع الاسم الكامل ورقم الجوال.',
        more: 'يرجى إكمال بيانات الشركة ونوع المشروع والمدينة.',
        phone: 'يرجى إدخال رقم جوال صحيح.',
        ts: 'يرجى إكمال التحقق الأمني.',
        sending: 'جارٍ الإرسال…',
        ok: 'تم إرسال طلبك بنجاح! سنتواصل معك خلال 24 ساعة.',
        err: 'حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.',
        done: 'تم الإرسال',
      };

  var FREE = {
    'gmail.com': 1, 'googlemail.com': 1, 'yahoo.com': 1, 'yahoo.co.uk': 1, 'yahoo.fr': 1, 'hotmail.com': 1, 'hotmail.co.uk': 1,
    'outlook.com': 1, 'live.com': 1, 'msn.com': 1, 'icloud.com': 1, 'me.com': 1, 'mac.com': 1, 'aol.com': 1, 'protonmail.com': 1,
    'proton.me': 1, 'mail.com': 1, 'gmx.com': 1, 'gmx.net': 1, 'yandex.com': 1, 'yandex.ru': 1, 'zoho.com': 1, 'mail.ru': 1,
    'inbox.com': 1, 'fastmail.com': 1, 'tutanota.com': 1, 'hey.com': 1, 'qq.com': 1, '163.com': 1, '126.com': 1, 'rediffmail.com': 1,
    'outlook.sa': 1, 'hotmail.sa': 1, 'live.sa': 1,
  };

  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function companyEmail(e) {
    var m = e.toLowerCase().match(/^[^@\s]+@([^@\s]+\.[^@\s]+)$/);
    if (!m) return false;
    if (FREE[m[1]]) return false;
    var p = m[1].split('.');
    return !(p.length >= 3 && FREE[p.slice(-2).join('.')]);
  }
  function say(type, msg) { fb.className = 'lx-fb is-' + type; fb.textContent = msg; }
  function val(n) { var el = form.querySelector('[name="' + n + '"]'); return el ? (el.value || '').trim() : ''; }

  function renderTs() {
    if (!box || !KEY || box.dataset.rendered === '1' || !window.turnstile) return;
    tsId = window.turnstile.render(box, { sitekey: KEY, theme: 'light', language: isEn ? 'en' : 'ar' });
    box.dataset.rendered = '1';
  }
  function initTs() {
    if (!box || !KEY) return;
    if (window.turnstile) { renderTs(); return; }
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = renderTs;
    document.head.appendChild(s);
  }
  // Load the widget only when the form is near the viewport.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); initTs(); }
    }, { rootMargin: '600px 0px' });
    io.observe(form);
  } else {
    initTs();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bot = form.querySelector('[name="botcheck"]');
    if (bot && bot.value) return;

    var name = val('name'), company = val('company'), phone = val('phone'), email = val('email'), type = val('project_type'), city = val('city');
    [].forEach.call(form.querySelectorAll('[aria-invalid]'), function (el) { el.removeAttribute('aria-invalid'); });
    // Marks the first field that needs attention, moves focus to it and shows the message.
    function fail(names, msg) {
      var first = null;
      names.forEach(function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        if (el && !val(n)) { el.setAttribute('aria-invalid', 'true'); if (!first) first = el; }
      });
      if (!first && names.length) first = form.querySelector('[name="' + names[0] + '"]');
      if (first) { first.setAttribute('aria-invalid', 'true'); first.focus(); }
      say('error', msg);
    }
    if (!name || !phone || !email) return fail(['name', 'phone', 'email'], T.fill);
    if (!validEmail(email)) return fail(['email'], T.email);
    if (!companyEmail(email)) return fail(['email'], T.corp);
    if (!company || !type || !city) return fail(['company', 'project_type', 'city'], T.more);
    if (phone.replace(/\D/g, '').length < 8) return fail(['phone'], T.phone);

    var tok = tsId != null && window.turnstile ? window.turnstile.getResponse(tsId) || '' : '';
    if (KEY && !tok) return say('error', T.ts);

    var data = {
      subject: 'ProjectLaunch™: ' + (isEn ? 'launch session request' : 'طلب جلسة إطلاق'),
      from_name: 'Graphics House Site',
      name: name, company: company, phone: phone, email: email,
      project_type: type, readiness: val('readiness'), city: city,
      source: 'project-launch', page: location.href,
      message: 'Name: ' + name + '\nCompany: ' + company + '\nPhone: ' + phone + '\nEmail: ' + email +
        '\nProject type: ' + type + '\nCity: ' + city + '\nReadiness: ' + val('readiness') + '\nPage: ' + location.href,
      botcheck: '',
    };
    if (tok) data['cf-turnstile-response'] = tok;

    btn.disabled = true;
    btn.textContent = T.sending;
    say('pending', T.sending);

    fetch(FORMS.formEndpoint || 'https://3dgraphicshouse.com/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.success) {
          say('success', T.ok);
          form.reset();
          if (window.ghTrack) {
            window.ghTrack('form_submit', { form_name: 'project_launch_lead', page_path: location.pathname });
            window.ghTrack('generate_lead', { form_name: 'project_launch_lead', event_category: 'ProjectLaunch' });
          } else if (window.gtag) {
            window.gtag('event', 'generate_lead', { event_category: 'ProjectLaunch', event_label: 'launch_readiness_form' });
          }
          btn.textContent = T.done;
        } else {
          say('error', (res && res.message) || T.err);
          btn.disabled = false;
          btn.innerHTML = label;
        }
        if (tsId != null && window.turnstile) window.turnstile.reset(tsId);
      })
      .catch(function () {
        say('error', T.err);
        btn.disabled = false;
        btn.innerHTML = label;
        if (tsId != null && window.turnstile) window.turnstile.reset(tsId);
      });
  });
})();
