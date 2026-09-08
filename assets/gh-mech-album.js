/**
 * Mechanical System video album — stage + filmstrip.
 * v5 — mobile plays via blob URL (bypasses broken CDN byte-range on iOS).
 */
(function () {
  'use strict';

  var ROOT = 'assets/projects/maquettes/Mechanism/';
  var VER = '5';
  var FILMS = [
    {
      id: 'sweedy',
      src: ROOT + 'mech-sweedy-factory.mp4',
      mobile: ROOT + 'mech-sweedy-factory-m.mp4',
      mobileFallback: ROOT + 'mech-sweedy-factory-mobile.mp4',
      poster: ROOT + 'mech-sweedy-factory-poster.jpg',
      title: { ar: 'مصنع السويدي', en: 'Sweedy Factory' },
      tag: { ar: 'آلية صناعية', en: 'Industrial mechanism' },
    },
    {
      id: 'mall',
      src: ROOT + 'mech-mall.mp4',
      mobile: ROOT + 'mech-mall-m.mp4',
      mobileFallback: ROOT + 'mech-mall-mobile.mp4',
      poster: ROOT + 'mech-mall-poster.jpg',
      title: { ar: 'مجمع تجاري', en: 'Commercial Mall' },
      tag: { ar: 'حركة متعددة الطبقات', en: 'Multi-layer motion' },
    },
    {
      id: 'tower',
      src: ROOT + 'mech-tower.mp4',
      mobile: ROOT + 'mech-tower-m.mp4',
      mobileFallback: ROOT + 'mech-tower-mobile.mp4',
      poster: ROOT + 'mech-tower-poster.jpg',
      title: { ar: 'برج', en: 'Tower' },
      tag: { ar: 'كتلة رأسية متحركة', en: 'Vertical kinetic mass' },
    },
    {
      id: 'villa1',
      src: ROOT + 'mech-villa-01.mp4',
      mobile: ROOT + 'mech-villa-01-m.mp4',
      mobileFallback: ROOT + 'mech-villa-01-mobile.mp4',
      poster: ROOT + 'mech-villa-01-poster.jpg',
      title: { ar: 'فيلا 01', en: 'Villa 01' },
      tag: { ar: 'تفاصيل سكنية', en: 'Residential detail' },
    },
    {
      id: 'villa2',
      src: ROOT + 'mech-villa-02.mp4',
      mobile: ROOT + 'mech-villa-02-m.mp4',
      mobileFallback: ROOT + 'mech-villa-02-mobile.mp4',
      poster: ROOT + 'mech-villa-02-poster.jpg',
      title: { ar: 'فيلا 02', en: 'Villa 02' },
      tag: { ar: 'إيقاع الواجهة', en: 'Façade rhythm' },
    },
    {
      id: 'lighting',
      src: ROOT + 'lighting-action.mp4',
      mobile: ROOT + 'lighting-action-m.mp4',
      mobileFallback: ROOT + 'lighting-action-mobile.mp4',
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
  var wantPlay = true;
  var blobUrl = '';
  var isMobile = false;

  function detectMobile() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod|Android|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      return true;
    }
    if (navigator.maxTouchPoints > 1) return true;
    if (window.matchMedia('(max-width: 900px)').matches) return true;
    if (window.matchMedia('(pointer: coarse)').matches) return true;
    return false;
  }

  isMobile = detectMobile();

  function L(obj) {
    return (obj && (obj[lang] || obj.en)) || '';
  }

  function withVer(url) {
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + VER;
  }

  function revokeBlob() {
    if (blobUrl) {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch (e) {}
      blobUrl = '';
    }
  }

  function prepVideoEl() {
    video.muted = true;
    video.defaultMuted = true;
    try {
      video.volume = 0;
    } catch (e) {}
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.loop = true;
    video.setAttribute('loop', '');
    video.setAttribute('preload', 'auto');
    video.disablePictureInPicture = true;
    if (isMobile) {
      video.controls = true;
      video.setAttribute('controls', '');
      video.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    } else {
      video.controls = false;
      video.removeAttribute('controls');
    }
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

  function attachSrc(url, token, autoplay) {
    if (token !== loadToken) return;
    video.querySelectorAll('source').forEach(function (s) {
      s.remove();
    });
    video.src = url;
    video.load();

    function onReady() {
      if (token !== loadToken) return;
      if (autoplay) tryPlay();
      else {
        showTap(true);
        updatePlayUi();
      }
    }

    video.addEventListener('loadeddata', onReady, { once: true });
    video.addEventListener('canplay', onReady, { once: true });
    if (video.readyState >= 2) onReady();
    setTimeout(function () {
      if (token === loadToken && video.paused && wantPlay && autoplay) onReady();
    }, 700);
  }

  function fetchAsBlob(url) {
    return fetch(url, { credentials: 'same-origin', cache: 'force-cache' }).then(function (res) {
      if (!res.ok) throw new Error('fetch ' + res.status);
      return res.blob();
    });
  }

  function loadMobile(film, token, autoplay) {
    var primary = withVer(film.mobile);
    var fallback = withVer(film.mobileFallback || film.src);

    function useBlob(blob) {
      if (token !== loadToken) return;
      revokeBlob();
      blobUrl = URL.createObjectURL(blob);
      attachSrc(blobUrl, token, autoplay);
    }

    function useDirect(url) {
      attachSrc(url, token, autoplay);
    }

    // Blob playback avoids iOS needing HTTP 206 byte-range from CDN.
    fetchAsBlob(primary)
      .catch(function () {
        return fetchAsBlob(fallback);
      })
      .then(useBlob)
      .catch(function () {
        useDirect(fallback);
      });
  }

  function setFilm(index, autoplay) {
    var film = FILMS[index];
    if (!film) return;
    active = index;
    var token = ++loadToken;
    wantPlay = !!autoplay;

    try {
      video.pause();
    } catch (e) {}

    prepVideoEl();
    video.poster = film.poster;
    revokeBlob();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(function (s) {
      s.remove();
    });

    if (titleEl) titleEl.textContent = L(film.title);
    if (tagEl) tagEl.textContent = L(film.tag);

    strip.querySelectorAll('.gh-mech-thumb').forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === index);
      btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });

    showTap(true);

    if (isMobile) {
      loadMobile(film, token, autoplay);
    } else {
      attachSrc(withVer(film.src), token, autoplay);
    }
  }

  function togglePlay(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (video.paused) {
      wantPlay = true;
      tryPlay();
    } else {
      wantPlay = false;
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

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (tapHint) tapHint.addEventListener('click', togglePlay);

  video.addEventListener('play', updatePlayUi);
  video.addEventListener('pause', updatePlayUi);
  video.addEventListener('ended', updatePlayUi);
  video.addEventListener('playing', function () {
    showTap(false);
  });

  if (stage) {
    stage.addEventListener('click', function (e) {
      if (e.target.closest('.gh-mech-play') || e.target.closest('.gh-mech-tap')) return;
      if (e.target === video || e.target.closest('video')) return;
      togglePlay(e);
    });
  }

  function unlockOnce() {
    if (!wantPlay || !video.paused) return;
    tryPlay();
  }
  document.addEventListener('touchstart', unlockOnce, { once: true, passive: true });
  document.addEventListener('click', unlockOnce, { once: true });

  if (stage && isMobile) stage.classList.add('is-mobile');

  prepVideoEl();
  setFilm(0, true);
})();
