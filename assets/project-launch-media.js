/**
 * ProjectLaunch™ — lazy mobile-aware video load + tap-to-play fallback.
 */
(function () {
  'use strict';

  var PLAY_SVG =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="rgba(10,10,10,.55)" stroke="#C9A84C" stroke-width="1.5"/><path d="M26 20l22 12-22 12V20z" fill="#FAFAF8"/></svg>';

  function prefersMobileSrc() {
    if (window.matchMedia('(max-width: 768px)').matches) return true;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return true;
    return false;
  }

  function pickSrc(v) {
    var mobile = v.getAttribute('data-pl-src-mobile');
    var desktop = v.getAttribute('data-pl-src');
    if (prefersMobileSrc() && mobile) return mobile;
    return desktop || mobile || '';
  }

  function isInView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < vh;
  }

  function prepVideo(v) {
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.loop = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
  }

  function ensureSource(v) {
    if (v.getAttribute('data-pl-loaded') === '1') return true;
    var src = pickSrc(v);
    if (!src) return false;

    v.src = src;
    v.setAttribute('data-pl-loaded', '1');
    try {
      v.load();
    } catch (e) {}
    return true;
  }

  function wrapVideo(v) {
    if (!v || v.closest('.pl-video-wrap')) return;

    var host = v.parentElement;
    if (!host) return;

    var wrap = document.createElement('div');
    wrap.className = 'pl-video-wrap';
    host.insertBefore(wrap, v);
    wrap.appendChild(v);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pl-video-fallback';
    btn.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Play video' : 'تشغيل الفيديو');
    btn.innerHTML = PLAY_SVG;
    wrap.appendChild(btn);

    prepVideo(v);
    v.setAttribute('preload', 'none');

    /* Migrate inline <source src> to data-pl-src if needed */
    if (!v.getAttribute('data-pl-src')) {
      var source = v.querySelector('source[src]');
      if (source) {
        v.setAttribute('data-pl-src', source.getAttribute('src'));
        source.removeAttribute('src');
      }
    }
    if (v.getAttribute('src')) {
      v.setAttribute('data-pl-src', v.getAttribute('src'));
      v.removeAttribute('src');
    }

    v.classList.add('pl-lazy-video');

    function markPlaying() {
      wrap.classList.remove('pl-video-paused', 'is-loading');
    }

    function markPaused() {
      if (v.getAttribute('data-pl-loaded') === '1' && v.readyState >= 2 && isInView(v)) {
        wrap.classList.add('pl-video-paused');
      }
    }

    function tryPlay() {
      if (!ensureSource(v)) return;
      prepVideo(v);
      var p = v.play();
      if (p && typeof p.then === 'function') {
        p.then(markPlaying).catch(markPaused);
      }
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      tryPlay();
    });

    v.addEventListener('playing', markPlaying);
    v.addEventListener('pause', function () {
      if (!document.hidden) markPaused();
    });
    v.addEventListener('waiting', function () {
      wrap.classList.add('is-loading');
    });
    v.addEventListener('canplay', function () {
      wrap.classList.remove('is-loading');
    });

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              wrap.classList.add('is-loading');
              if (ensureSource(v)) tryPlay();
            } else {
              wrap.classList.remove('pl-video-paused', 'is-loading');
              if (!v.paused) {
                try {
                  v.pause();
                } catch (err) {}
              }
            }
          });
        },
        { rootMargin: '80px 0px', threshold: 0.12 }
      );
      obs.observe(v);
    } else if (isInView(v)) {
      tryPlay();
    }
  }

  function init() {
    document
      .querySelectorAll('video.gh-autoplay, .ar-media-frame video, .ar-outcomes-media video, .ar-img-frame video')
      .forEach(wrapVideo);

    window.setTimeout(function () {
      document.querySelectorAll('.pl-video-wrap video').forEach(function (v) {
        var wrap = v.closest('.pl-video-wrap');
        if (wrap && v.paused && v.getAttribute('data-pl-loaded') === '1' && v.readyState >= 2 && isInView(v)) {
          wrap.classList.add('pl-video-paused');
        }
      });
    }, 3200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
