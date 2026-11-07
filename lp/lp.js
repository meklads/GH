/* Graphics House campaign landing pages: header, lightbox, tracking, lead form. */
(function () {
  'use strict';
  var EN = document.documentElement.lang === 'en';
  var F = window.GH_FORMS || {};
  var KEY = (window.GH_QUOTE_FORM || {}).turnstileSiteKey || F.turnstileSiteKey || '';
  var PAGE = document.body.getAttribute('data-page') || 'lp';
  var SERVICE = document.body.getAttribute('data-service') || 'Rendering';

  function track(n, p) {
    try {
      if (window.ghTrack) window.ghTrack(n, p);
      else if (window.gtag) window.gtag('event', n, p);
    } catch (e) {}
  }

  /* header turns solid after the hero; mobile bar appears after scrolling */
  var hdr = document.querySelector('.hdr');
  var mbar = document.querySelector('.mbar');
  function onScroll() {
    var y = window.scrollY || 0;
    if (hdr) hdr.classList.toggle('solid', y > 60);
    if (mbar) mbar.classList.toggle('on', y > 520);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* keep UTM params when switching language */
  document.querySelectorAll('.lang a').forEach(function (a) { if (location.search) a.href += location.search; });

  /* click tracking */
  document.querySelectorAll('[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('lp_cta_click', { page: PAGE, cta: a.getAttribute('data-cta') });
    });
  });

  /* lightbox: images are shown complete, never cropped; films play from YouTube */
  var lb = document.getElementById('lb');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbVid = lb.querySelector('.lb-v');
    var lbCap = lb.querySelector('p');
    var open = function (cap) { lbCap.textContent = cap || ''; lb.classList.add('on'); };
    document.querySelectorAll('.gal figure').forEach(function (fig) {
      fig.addEventListener('click', function () {
        var img = fig.querySelector('img');
        lb.classList.remove('vid');
        lbImg.src = fig.getAttribute('data-full') || img.currentSrc || img.src;
        lbImg.alt = img.alt;
        open((fig.querySelector('figcaption') || {}).textContent);
        track('lp_gallery_open', { page: PAGE });
      });
    });
    document.querySelectorAll('[data-yt]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-yt');
        lb.classList.add('vid');
        if (lbVid) lbVid.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
        open((b.querySelector('b') || {}).textContent);
        track('lp_film_play', { page: PAGE, video: id });
      });
    });
    var close = function () { lb.classList.remove('on', 'vid'); lbImg.removeAttribute('src'); if (lbVid) lbVid.innerHTML = ''; };
    lb.addEventListener('click', function (e) { if (e.target !== lbImg && !(lbVid && lbVid.contains(e.target))) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* package buttons preselect the package in the form */
  document.querySelectorAll('[data-pkg]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('t');
      if (sel) { sel.value = a.getAttribute('data-pkg'); }
    });
  });

  /* lead form -> GH form proxy (same endpoint as the site forms) */
  var form = document.getElementById('lpForm');
  if (!form) return;
  var fb = document.getElementById('fb');
  var sb = document.getElementById('sb');
  var ts = document.getElementById('ts');
  var wid = null;
  var label = sb.textContent;
  var BD = document.body;
  var M = EN
    ? { fill: 'Please fill in all required fields.', sec: 'Please complete the security check before sending.', wait: 'Sending your request…', sending: 'Sending…', ok: 'Sent. We will contact you shortly to schedule your session.', done: 'Sent', fail: 'Could not send. Please try again or message us on WhatsApp.', sub: 'Graphics House: session request (Rendering and CGI)', msg: 'Session request from the Rendering and CGI page', t: 'Project type', w: 'Needed by', c: 'Company', s: 'Source', l: 'EN' }
    : { fill: 'يرجى تعبئة جميع الحقول المطلوبة.', sec: 'يرجى إكمال التحقق الأمني قبل الإرسال.', wait: 'جارٍ إرسال طلبك…', sending: 'جارٍ الإرسال…', ok: 'تم الإرسال. سنتواصل معك قريباً لتحديد موعد الجلسة.', done: 'تم الإرسال', fail: 'تعذّر الإرسال. حاول مرة أخرى أو راسلنا على واتساب.', sub: 'Graphics House: طلب جلسة (الإظهار وCGI)', msg: 'طلب جلسة من صفحة الإظهار وCGI', t: 'نوع المشروع', w: 'موعد الحاجة', c: 'الشركة', s: 'المصدر', l: 'AR' };

  if (BD.getAttribute('data-subject')) M.sub = BD.getAttribute('data-subject');
  if (BD.getAttribute('data-msg')) M.msg = BD.getAttribute('data-msg');
  if (BD.getAttribute('data-ptype')) M.t = BD.getAttribute('data-ptype');

  function say(t, m) { fb.className = t; fb.textContent = m; }
  function loadTs() {
    if (!KEY || !ts) return;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = function () {
      if (window.turnstile) wid = window.turnstile.render(ts, { sitekey: KEY, theme: 'light', language: EN ? 'en' : 'ar' });
    };
    document.head.appendChild(s);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { loadTs(); io.disconnect(); }
    }, { rootMargin: '500px' });
    io.observe(form);
  } else loadTs();

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (form.botcheck.value.trim()) return;
    var v = function (n) { return (form[n].value || '').trim(); };
    var d = { name: v('name'), company: v('company'), email: v('email'), phone: v('phone'), type: v('project_type'), when: v('timeline') };
    if (!d.name || !d.company || !d.email || !d.phone || !d.type) { say('err', M.fill); return; }
    var tok = KEY && wid !== null && window.turnstile ? window.turnstile.getResponse(wid) : '';
    if (KEY && !tok) { say('err', M.sec); return; }
    var q = new URLSearchParams(location.search);
    var src = ['utm_source', 'utm_medium', 'utm_campaign'].map(function (k) { return q.get(k) ? k + ': ' + q.get(k) : ''; }).filter(Boolean).join(' | ');
    say('wait', M.wait); sb.disabled = true; sb.textContent = M.sending;
    var payload = {
      subject: M.sub, from_name: 'LP ' + SERVICE + ' ' + M.l,
      name: d.name, email: d.email, phone: d.phone, company: d.company,
      service: SERVICE, interest: d.type,
      message: M.msg + '\n' + M.t + ': ' + d.type + (d.when ? '\n' + M.w + ': ' + d.when : '') + '\n' + M.c + ': ' + d.company + (src ? '\n' + M.s + ': ' + src : ''),
      page: location.href, botcheck: ''
    };
    if (tok) payload['cf-turnstile-response'] = tok;
    fetch(F.formEndpoint || 'https://3dgraphicshouse.com/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!(res && res.success)) throw new Error('x');
        say('ok', M.ok); form.reset(); sb.textContent = M.done;
        track('generate_lead', { form_name: 'lp_' + SERVICE.toLowerCase(), service: SERVICE, lang: EN ? 'en' : 'ar', source: q.get('utm_source') || 'direct' });
      })
      .catch(function () {
        say('err', M.fail); sb.disabled = false; sb.textContent = label;
        if (wid !== null && window.turnstile) window.turnstile.reset(wid);
      });
  });
})();
