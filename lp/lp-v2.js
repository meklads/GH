/* Graphics House: production LP (rebuilt 2026-11). Loaded after lp.js (header, lightbox, CTA tracking stay there).
   Adds: attribution capture (UTM, gclid, fbclid, ttclid, ScCid), 4-field lead form, WhatsApp qualifier,
   redirect to the thank-you page, empty ad-pixel slots. Preview only until the owner approves. */
(function () {
  'use strict';
  var EN = document.documentElement.lang === 'en';
  var F = window.GH_FORMS || {};
  var KEY = (window.GH_QUOTE_FORM || {}).turnstileSiteKey || F.turnstileSiteKey || '';
  var PAGE = document.body.getAttribute('data-page') || 'lp_production';
  var WA = '966502786513';

  /* Ad pixel slots. Left EMPTY on purpose: the owner adds the IDs after approval.
     When an ID is empty nothing is loaded and no third-party request is made. */
  window.GH_ADS = window.GH_ADS || { metaPixelId: '', snapPixelId: '', tiktokPixelId: '' };
  /* PIXEL-SLOT meta:   paste the Meta pixel base code here after the owner provides the ID */
  /* PIXEL-SLOT snap:   paste the Snap pixel base code here after the owner provides the ID */
  /* PIXEL-SLOT tiktok: paste the TikTok pixel base code here after the owner provides the ID */

  function track(n, p) {
    try {
      if (window.ghTrack) window.ghTrack(n, p);
      else if (window.gtag) window.gtag('event', n, p);
    } catch (e) {}
  }

  /* hero film: starts after the page has loaded, never on reduced motion or data saver */
  var hv = document.querySelector('.hero-vid');
  if (hv) {
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var save = navigator.connection && navigator.connection.saveData;
    if (!calm && !save) {
      window.addEventListener('load', function () {
        hv.src = window.innerWidth < 700 ? hv.getAttribute('data-src-m') : hv.getAttribute('data-src');
        hv.addEventListener('playing', function () { hv.classList.add('on'); }, { once: true });
        var p = hv.play(); if (p && p.catch) p.catch(function () {});
      });
    }
  }

  /* attribution: query string wins, otherwise the first-touch values kept for this session */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'ttclid', 'ScCid'];
  var attr = {};
  try { attr = JSON.parse(sessionStorage.getItem('gh_lp_attr') || '{}') || {}; } catch (e) { attr = {}; }
  var q = new URLSearchParams(location.search);
  KEYS.forEach(function (k) { if (q.get(k)) attr[k] = q.get(k); });
  try { sessionStorage.setItem('gh_lp_attr', JSON.stringify(attr)); } catch (e) {}
  function attrString() {
    return KEYS.map(function (k) { return attr[k] ? k + ': ' + attr[k] : ''; }).filter(Boolean).join(' | ');
  }
  function attrQuery() {
    var p = new URLSearchParams();
    KEYS.forEach(function (k) { if (attr[k]) p.set(k, attr[k]); });
    var s = p.toString();
    return s ? '?' + s : '';
  }
  document.querySelectorAll('input[data-attr]').forEach(function (i) { i.value = attr[i.getAttribute('data-attr')] || ''; });

  /* WhatsApp tracking (kept alongside the per-CTA lp_cta_click event) */
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('click_whatsapp', { page: PAGE, cta: a.getAttribute('data-cta') || 'whatsapp', lang: EN ? 'en' : 'ar' });
    });
  });

  /* WhatsApp qualifier: builds a ready message from the chosen stage and timing */
  var quick = document.getElementById('quick');
  if (quick) {
    var qbtn = document.getElementById('quickWa');
    var base = quick.getAttribute('data-msg') || '';
    var lbl = EN ? { stage: 'Project stage', when: 'Timing' } : { stage: 'مرحلة المشروع', when: 'الموعد' };
    var build = function () {
      var st = quick.querySelector('input[name="qs"]:checked');
      var wn = quick.querySelector('input[name="qw"]:checked');
      var t = base + (st ? '\n' + lbl.stage + ': ' + st.value : '') + (wn ? '\n' + lbl.when + ': ' + wn.value : '');
      qbtn.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t);
    };
    quick.addEventListener('change', build);
    build();
  }

  /* lead form: 4 fields, no email, honeypot kept */
  var form = document.getElementById('lpFormV2');
  if (!form) return;
  var fb = document.getElementById('fb');
  var sb = document.getElementById('sb');
  var ts = document.getElementById('ts');
  var wid = null;
  var label = sb.textContent;
  var BD = document.body;
  var M = EN
    ? { fill: 'Please fill in your name, WhatsApp, company, project type and size.', sec: 'Please complete the security check before sending.', wait: 'Sending your request…', sending: 'Sending…', fail: 'Could not send. Please try again or message us on WhatsApp.', l: 'EN', t: 'Request', w: 'Project size', c: 'Company', s: 'Source' }
    : { fill: 'يرجى تعبئة الاسم وواتساب والشركة ونوع المشروع وحجمه.', sec: 'يرجى إكمال التحقق الأمني قبل الإرسال.', wait: 'جارٍ إرسال طلبك…', sending: 'جارٍ الإرسال…', fail: 'تعذّر الإرسال. حاول مرة أخرى أو راسلنا على واتساب.', l: 'AR', t: 'الطلب', w: 'حجم المشروع', c: 'الشركة', s: 'المصدر' };

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
    var d = { name: v('name'), phone: v('phone'), company: v('company'), type: v('project_type'), size: v('project_size') };
    if (!d.name || !d.phone || !d.company || !d.type || !d.size) { say('err', M.fill); return; }
    var tok = KEY && wid !== null && window.turnstile ? window.turnstile.getResponse(wid) : '';
    if (KEY && !tok) { say('err', M.sec); return; }
    say('wait', M.wait); sb.disabled = true; sb.textContent = M.sending;
    var a = attrString();
    var payload = {
      subject: BD.getAttribute('data-subject') || 'Graphics House: LP production',
      from_name: 'LP Production ' + M.l,
      name: d.name, phone: d.phone, company: d.company,
      service: 'Production', interest: d.type, project_size: d.size,
      message: (BD.getAttribute('data-msg') || '') + '\n' + M.t + ': ' + d.type +
        '\n' + M.w + ': ' + d.size +
        '\n' + M.c + ': ' + d.company + (a ? '\n' + M.s + ': ' + a : ''),
      page: location.href, botcheck: ''
    };
    KEYS.forEach(function (k) { if (attr[k]) payload[k] = attr[k]; });
    if (tok) payload['cf-turnstile-response'] = tok;
    fetch(F.formEndpoint || 'https://3dgraphicshouse.com/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!(res && res.success)) throw new Error('x');
        track('generate_lead', { form_name: 'lp_production', service: 'Production', lang: EN ? 'en' : 'ar', source: attr.utm_source || 'direct' });
        var go = (EN ? 'thanks-en.html' : 'thanks.html') + attrQuery();
        setTimeout(function () { location.href = go; }, 350);
      })
      .catch(function () {
        say('err', M.fail); sb.disabled = false; sb.textContent = label;
        if (wid !== null && window.turnstile) window.turnstile.reset(wid);
      });
  });
})();
