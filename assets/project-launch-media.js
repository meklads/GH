/**
 * ProjectLaunch — interactive readiness assessment + ladder → form handoff.
 */
(function () {
  'use strict';

  function setReadiness(value) {
    var input = document.getElementById('pl-readiness');
    if (input) input.value = value || '';
  }

  document.addEventListener('click', function (e) {
    var tierBtn = e.target.closest('[data-pl-tier]');
    if (tierBtn) {
      setReadiness(tierBtn.getAttribute('data-pl-tier') || '');
    }
  });

  var root = document.querySelector('[data-pl-assess]');
  if (!root) return;

  var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'ar';
  var items = Array.prototype.slice.call(root.querySelectorAll('[data-gap]'));
  var result = root.querySelector('[data-pl-assess-result]');
  if (!items.length || !result) return;

  var answers = {}; // keyed by question index

  var copy = {
    ar: {
      titles: {
        ready: 'جاهزية عالية — نضبط التفاصيل',
        gallery: 'فجوة في تجربة الصالة',
        content: 'فجوة في المحتوى البصري',
        identity: 'فجوة في الهوية والرسالة',
        system: 'تحتاج منظومة إطلاق كاملة',
      },
      bodies: {
        ready:
          'أصولك قريبة من السوق. جلسة قصيرة تحدّد ما ينقص لإغلاق الإطلاق بثقة.',
        gallery:
          'المحتوى موجود جزئياً، لكن تجربة البيع داخل الصالة تحتاج حضوراً أقوى.',
        content:
          'المستثمر يحتاج قصة بصرية أوضح: رندرات/فيلم ومجسم يشرح المخطط بثوانٍ.',
        identity:
          'قبل الإنتاج الكثيف، نثبّت اللغة البصرية والرسالة حتى لا تتفرّق الأصول لاحقاً.',
        system:
          'عدة فجوات معاً. الأنسب مسار منظومة كاملة بدل قطع متفرقة.',
      },
      gapLabels: {
        identity: 'فجوة هوية',
        gallery: 'فجوة صالة',
        content: 'فجوة محتوى',
        system: 'فجوة منظومة',
      },
      cta: 'احجز جلسة إطلاق مشروعك',
    },
    en: {
      titles: {
        ready: 'High readiness — refine the last mile',
        gallery: 'Sales-gallery experience gap',
        content: 'Visual content gap',
        identity: 'Identity & message gap',
        system: 'You need a full launch system',
      },
      bodies: {
        ready:
          'Your assets are close to market. A short session clarifies what still blocks a confident launch.',
        gallery:
          'Content exists in parts, but the in-gallery sales experience needs a stronger presence.',
        content:
          'Investors need a clearer visual story: renders/film and a maquette that explain the plan in seconds.',
        identity:
          'Before heavy production, lock the visual language and message so assets do not fragment later.',
        system:
          'Several gaps at once. A full system path beats scattered pieces.',
      },
      gapLabels: {
        identity: 'Identity gap',
        gallery: 'Gallery gap',
        content: 'Content gap',
        system: 'System gap',
      },
      cta: 'Book a launch session',
    },
  }[lang];

  function score() {
    var nos = [];
    items.forEach(function (item, idx) {
      var gap = item.getAttribute('data-gap');
      if (answers[idx] === 'no') nos.push(gap);
    });
    return nos;
  }

  function pickOutcome(nos) {
    if (nos.length <= 1) return 'ready';
    if (nos.length >= 4) return 'system';
    if (nos.indexOf('identity') !== -1) return 'identity';
    if (nos.indexOf('gallery') !== -1) return 'gallery';
    if (nos.indexOf('content') !== -1) return 'content';
    return 'system';
  }

  function render() {
    if (Object.keys(answers).length < items.length) return;
    var nos = score();
    var key = pickOutcome(nos);
    var titleEl = result.querySelector('[data-pl-assess-title]');
    var bodyEl = result.querySelector('[data-pl-assess-body]');
    var gapsEl = result.querySelector('[data-pl-assess-gaps]');
    var ctaEl = result.querySelector('[data-pl-assess-cta]');
    if (titleEl) titleEl.textContent = copy.titles[key];
    if (bodyEl) bodyEl.textContent = copy.bodies[key];
    if (gapsEl) {
      gapsEl.innerHTML = '';
      var uniq = {};
      nos.forEach(function (g) {
        if (uniq[g]) return;
        uniq[g] = true;
        var li = document.createElement('li');
        li.textContent = copy.gapLabels[g] || g;
        gapsEl.appendChild(li);
      });
      if (!nos.length) {
        var ok = document.createElement('li');
        ok.textContent = lang === 'en' ? 'Nearly ready' : 'شبه جاهز';
        gapsEl.appendChild(ok);
      }
    }
    if (ctaEl) ctaEl.textContent = copy.cta;
    setReadiness('assess:' + key);
    result.hidden = false;
  }

  items.forEach(function (item, idx) {
    var buttons = item.querySelectorAll('button[data-ans]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        answers[idx] = btn.getAttribute('data-ans');
        buttons.forEach(function (b) {
          b.classList.toggle('is-on', b === btn);
        });
        render();
      });
    });
  });
})();
