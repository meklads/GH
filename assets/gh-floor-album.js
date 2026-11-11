/**
 * Floor furnish photo album — stage + strip (client hub).
 */
(function () {
  'use strict';

  var ROOT = 'assets/projects/maquettes/floor-furnish/';
  var VER = '1';
  var SHOTS = [
    {
      id: 'ma1',
      src: ROOT + 'ma1.webp',
      fallback: ROOT + 'ma1.jpg',
      title: { ar: 'فرش الدور 01', en: 'Floor furnish 01' },
      tag: { ar: 'مجسم معماري', en: 'Architectural maquette' },
    },
    {
      id: 'ma2',
      src: ROOT + 'ma2.webp',
      fallback: ROOT + 'ma2.jpg',
      title: { ar: 'فرش الدور 02', en: 'Floor furnish 02' },
      tag: { ar: 'تفاصيل داخلية', en: 'Interior detail' },
    },
    {
      id: 'ma3',
      src: ROOT + 'ma3.webp',
      fallback: ROOT + 'ma3.jpg',
      title: { ar: 'فرش الدور 03', en: 'Floor furnish 03' },
      tag: { ar: 'طبقات الأدوار', en: 'Floor layers' },
    },
    {
      id: 'ma4',
      src: ROOT + 'ma4.webp',
      fallback: ROOT + 'ma4.jpg',
      title: { ar: 'فرش الدور 04', en: 'Floor furnish 04' },
      tag: { ar: 'مقياس وصالة', en: 'Scale & gallery' },
    },
    {
      id: 'ma5',
      src: ROOT + 'ma5.webp',
      fallback: ROOT + 'ma5.jpg',
      title: { ar: 'فرش الدور 05', en: 'Floor furnish 05' },
      tag: { ar: 'تشطيبات الوحدة', en: 'Unit finishes' },
    },
    {
      id: 'ma6',
      src: ROOT + 'ma6.webp',
      fallback: ROOT + 'ma6.jpg',
      title: { ar: 'فرش الدور 06', en: 'Floor furnish 06' },
      tag: { ar: 'عرض كامل', en: 'Full presentation' },
    },
  ];

  var lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  var img = document.getElementById('ghFloorImage');
  var titleEl = document.getElementById('ghFloorTitle');
  var tagEl = document.getElementById('ghFloorTag');
  var strip = document.getElementById('ghFloorStrip');
  var prevBtn = document.getElementById('ghFloorPrev');
  var nextBtn = document.getElementById('ghFloorNext');
  if (!img || !strip) return;

  var active = 0;

  function L(obj) {
    return (obj && (obj[lang] || obj.en)) || '';
  }

  function withVer(url) {
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + VER;
  }

  function setShot(index) {
    var shot = SHOTS[index];
    if (!shot) return;
    active = index;
    if (titleEl) titleEl.textContent = L(shot.title);
    if (tagEl) tagEl.textContent = L(shot.tag);
    img.src = withVer(shot.src);
    img.onerror = function () {
      img.onerror = null;
      img.src = withVer(shot.fallback);
    };
    img.alt = L(shot.title) + ' — ' + L(shot.tag);
    strip.querySelectorAll('.gh-mech-thumb').forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === index);
      btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
  }

  function renderStrip() {
    strip.innerHTML = SHOTS.map(function (shot, i) {
      return (
        '<button type="button" class="gh-mech-thumb' +
        (i === 0 ? ' is-active' : '') +
        '" role="option" aria-pressed="' +
        (i === 0 ? 'true' : 'false') +
        '" data-index="' +
        i +
        '">' +
        '<span class="gh-mech-thumb__media">' +
        '<img src="' +
        withVer(shot.src) +
        '" alt="" loading="lazy" decoding="async" width="320" height="240">' +
        '</span>' +
        '<span class="gh-mech-thumb__meta">' +
        '<strong>' +
        L(shot.title) +
        '</strong>' +
        '<em>' +
        L(shot.tag) +
        '</em></span></button>'
      );
    }).join('');

    strip.querySelectorAll('.gh-mech-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setShot(Number(btn.getAttribute('data-index')) || 0);
      });
    });
  }

  function step(delta) {
    var next = (active + delta + SHOTS.length) % SHOTS.length;
    setShot(next);
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(lang === 'ar' ? 1 : -1);
    if (e.key === 'ArrowRight') step(lang === 'ar' ? -1 : 1);
  });

  renderStrip();
  setShot(0);
})();
