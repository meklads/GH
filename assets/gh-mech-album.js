/**
 * Mechanical System video album — stage + filmstrip (desktop + mobile).
 * v2
 */
(function () {
  'use strict';

  var ROOT = 'assets/projects/maquettes/Mechanism/';
  var FILMS = [
    {
      id: 'sweedy',
      src: ROOT + 'mech-sweedy-factory.mp4',
      mobile: ROOT + 'mech-sweedy-factory-mobile.mp4',
      poster: ROOT + 'mech-sweedy-factory-poster.jpg',
      title: { ar: 'مصنع السويدي', en: 'Sweedy Factory' },
      tag: { ar: 'آلية صناعية', en: 'Industrial mechanism' },
    },
    {
      id: 'mall',
      src: ROOT + 'mech-mall.mp4',
      mobile: ROOT + 'mech-mall-mobile.mp4',
      poster: ROOT + 'mech-mall-poster.jpg',
      title: { ar: 'مجمع تجاري', en: 'Commercial Mall' },
      tag: { ar: 'حركة متعددة الطبقات', en: 'Multi-layer motion' },
    },
    {
      id: 'tower',
      src: ROOT + 'mech-tower.mp4',
      mobile: ROOT + 'mech-tower-mobile.mp4',
      poster: ROOT + 'mech-tower-poster.jpg',
      title: { ar: 'برج', en: 'Tower' },
      tag: { ar: 'كتلة رأسية متحركة', en: 'Vertical kinetic mass' },
    },
    {
      id: 'villa1',
      src: ROOT + 'mech-villa-01.mp4',
      mobile: ROOT + 'mech-villa-01-mobile.mp4',
      poster: ROOT + 'mech-villa-01-poster.jpg',
      title: { ar: 'فيلا 01', en: 'Villa 01' },
      tag: { ar: 'تفاصيل سكنية', en: 'Residential detail' },
    },
    {
      id: 'villa2',
      src: ROOT + 'mech-villa-02.mp4',
      mobile: ROOT + 'mech-villa-02-mobile.mp4',
      poster: ROOT + 'mech-villa-02-poster.jpg',
      title: { ar: 'فيلا 02', en: 'Villa 02' },
      tag: { ar: 'إيقاع الواجهة', en: 'Façade rhythm' },
    },
    {
      id: 'lighting',
      src: ROOT + 'lighting-action.mp4',
      mobile: ROOT + 'lighting-action-mobile.mp4',
      poster: ROOT + 'lighting-action-poster.jpg',
      title: { ar: 'إضاءة تفاعلية', en: 'Lighting Action' },
      tag: { ar: 'مشاهد ليلية ونهارية', en: 'Day / night cues' },
    },
  ];

  var lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  var stage = document.getElementById('ghMechStage');
  var video = document.getElementById('ghMechVideo');
  var titleEl = document.getElementById('ghMechTitle');
  var tagEl = document.getElementById('ghMechTag');
  var strip = document.getElementById('ghMechStrip');
  var playBtn = document.getElementById('ghMechPlay');
  var tapHint = document.getElementById('ghMechTap');
  if (!video || !strip) return;

  var active = 0;
  var loadToken = 0;

  function L(obj) {
    return (obj && (obj[lang] || obj.en)) || '';
  }

  function preferMobile() {
    if (window.matchMedia('(max-width: 900px)').matches) return true;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return true;
    return false;
  }

  function pickSrc(film) {
    if (preferMobile() && film.mobile) return film.mobile;
    return film.src;
  }

  function prepVideoEl() {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.loop = true;
    video.setAttribute('loop', '');
    video.setAttribute('preload', 'auto');
    video.disablePictureInPicture = true;
  }

  function showTap(needed) {
    if (!stage) return;
    stage.classList.toggle('needs-tap', !!needed);
    if (tapHint) tapHint.hidden = !needed;
  }

  function updatePlayUi() {
    if (!playBtn) return;
    var playing = !video.paused && !video.ended;
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute(
      'aria-label',
      playing ? (lang === 'en' ? 'Pause' : 'إيقاف') : lang === 'en' ? 'Play' : 'تشغيل'
    );
    if (playing) showTap(false);
  }

  function tryPlay() {
    prepVideoEl();
    var p = video.play();
    if (p && typeof p.then === 'function') {
      return p
        .then(function () {
          showTap(false);
          updatePlayUi();
        })
        .catch(function () {
          showTap(true);
          updatePlayUi();
        });
    }
    updatePlayUi();
    return Promise.resolve();
  }

  function setFilm(index, autoplay) {
    var film = FILMS[index];
    if (!film) return;
    active = index;
    var token = ++loadToken;

    try {
      video.pause();
    } catch (e) {}

    prepVideoEl();
    video.setAttribute('poster', film.poster);
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(function (s) {
      s.remove();
    });

    var source = document.createElement('source');
    source.src = pickSrc(film);
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();

    if (titleEl) titleEl.textContent = L(film.title);
    if (tagEl) tagEl.textContent = L(film.tag);

    strip.querySelectorAll('.gh-mech-thumb').forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === index);
      btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });

    if (!autoplay) {
      showTap(true);
      updatePlayUi();
      return;
    }

    function onReady() {
      if (token !== loadToken) return;
      tryPlay();
    }

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener('loadeddata', onReady, { once: true });
      video.addEventListener('canplay', onReady, { once: true });
      // Fallback if events never fire on some WebViews
      setTimeout(function () {
        if (token === loadToken && video.paused) onReady();
      }, 1200);
    }
  }

  function togglePlay(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (video.paused) tryPlay();
    else {
      video.pause();
      updatePlayUi();
    }
  }

  strip.innerHTML = FILMS.map(function (film, i) {
    return (
      '<button type="button" class="gh-mech-thumb' +
      (i === 0 ? ' is-active' : '') +
      '" data-i="' +
      i +
      '" aria-pressed="' +
      (i === 0 ? 'true' : 'false') +
      '">' +
      '<span class="gh-mech-thumb__media"><img src="' +
      film.poster +
      '" alt="" loading="lazy" width="320" height="180" decoding="async"></span>' +
      '<span class="gh-mech-thumb__meta"><strong>' +
      L(film.title) +
      '</strong><em>' +
      L(film.tag) +
      '</em></span>' +
      '</button>'
    );
  }).join('');

  strip.addEventListener('click', function (e) {
    var btn = e.target.closest('.gh-mech-thumb');
    if (!btn) return;
    setFilm(Number(btn.getAttribute('data-i')), true);
  });

  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
    playBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      togglePlay(e);
    });
  }

  if (tapHint) {
    tapHint.addEventListener('click', togglePlay);
    tapHint.addEventListener('touchend', function (e) {
      e.preventDefault();
      togglePlay(e);
    });
  }

  video.addEventListener('play', updatePlayUi);
  video.addEventListener('pause', updatePlayUi);
  video.addEventListener('ended', updatePlayUi);
  video.addEventListener('playing', function () {
    showTap(false);
  });

  if (stage) {
    stage.addEventListener('click', function (e) {
      if (e.target.closest('.gh-mech-play') || e.target.closest('.gh-mech-tap')) return;
      togglePlay(e);
    });
  }

  prepVideoEl();
  setFilm(0, true);
})();
