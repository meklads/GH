/**
 * GH ambient video — reliable muted autoplay + loop (mobile + desktop).
 * v6: mobile src, lazy load, tap fallback, gesture unlock, hero eager load.
 */
(function () {
  'use strict';

  var VIDEO_SEL = [
    'video[autoplay]',
    'video.gh-autoplay',
    '#hero-vid',
    '#hero-vid-ar',
    '#s2VideoPlayer',
    '.hero-video-bg video',
    '.ar-media-frame video',
    '.ar-outcomes-media video',
    '.ar-img-frame video',
    '.gl-vid-frame video',
    '.pl-video-wrap video',
  ].join(', ');

  var PLAY_SVG =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="rgba(10,10,10,.55)" stroke="#C9A84C" stroke-width="1.5"/><path d="M26 20l22 12-22 12V20z" fill="#FAFAF8"/></svg>';

  function prefersMobileSrc() {
    if (window.matchMedia('(max-width: 768px)').matches) return true;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return true;
    return false;
  }

  function inferMobileSrc(desktop) {
    if (!desktop || /-mobile\.mp4/i.test(desktop)) return '';
    return desktop.replace(/\.mp4(\?.*)?$/i, '-mobile.mp4$1');
  }

  function pickSrc(v) {
    var mobile = v.getAttribute('data-pl-src-mobile') || v.getAttribute('data-gh-src-mobile');
    var desktop = v.getAttribute('data-pl-src') || v.getAttribute('data-gh-src');
    if (!desktop) {
      var source = v.querySelector('source[src]');
      if (source) desktop = source.getAttribute('src');
    }
    if (!desktop && v.getAttribute('src')) desktop = v.getAttribute('src');
    if (!mobile && desktop) mobile = inferMobileSrc(desktop);
    if (prefersMobileSrc() && mobile) return mobile;
    return desktop || mobile || '';
  }

  function isHero(v) {
    return (
      v.id === 'hero-vid' ||
      v.id === 'hero-vid-ar' ||
      v.id === 's2VideoPlayer' ||
      !!v.closest('.hero-video-bg')
    );
  }

  function isEager(v) {
    return isHero(v) || v.hasAttribute('data-gh-eager') || v.getAttribute('preload') === 'auto';
  }

  function isInView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < vh;
  }

  function prep(v) {
    if (v.dataset.ghUserUnmuted !== '1') {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute('muted', '');
    }
    v.playsInline = true;
    v.loop = true;
    v.setAttribute('autoplay', '');
    v.setAttribute('loop', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    if (!v.hasAttribute('disablepictureinpicture')) {
      v.setAttribute('disablepictureinpicture', '');
    }
  }

  function ensureLoaded(v) {
    if (v.getAttribute('data-gh-vid-loaded') === '1' && v.currentSrc) return true;
    var src = pickSrc(v);
    if (!src) return false;

    v.querySelectorAll('source').forEach(function (s) {
      s.removeAttribute('src');
    });
    if (v.getAttribute('src')) v.removeAttribute('src');

    v.src = src;
    v.setAttribute('data-gh-vid-loaded', '1');
    if (!v.getAttribute('data-pl-src')) v.setAttribute('data-pl-src', src.replace(/-mobile\.mp4/i, '.mp4'));
    try {
      v.load();
    } catch (e) {}
    return true;
  }

  function markPlaying(v) {
    var wrap = v.closest('.pl-video-wrap');
    if (wrap) wrap.classList.remove('pl-video-paused', 'is-loading');
  }

  function markPaused(v) {
    var wrap = v.closest('.pl-video-wrap');
    if (wrap && v.getAttribute('data-gh-vid-loaded') === '1' && isInView(v)) {
      wrap.classList.add('pl-video-paused');
    }
  }

  var retryCounts = new WeakMap();

  function tryPlay(v) {
    prep(v);
    if (!ensureLoaded(v)) {
      if (v.readyState === 0) {
        try {
          v.load();
        } catch (e) {}
      }
    }
    var p = v.play();
    if (p && typeof p.then === 'function') {
      return p
        .then(function () {
          retryCounts.delete(v);
          markPlaying(v);
        })
        .catch(function () {
          scheduleRetry(v);
          markPaused(v);
        });
    }
    return null;
  }

  function scheduleRetry(v) {
    var n = (retryCounts.get(v) || 0) + 1;
    retryCounts.set(v, n);
    if (n > 12) return;
    window.setTimeout(function () {
      if (isInView(v) || isHero(v)) tryPlay(v);
    }, Math.min(180 * n, 2400));
  }

  function ensureWrap(v) {
    if (!v || v.closest('.pl-video-wrap') || isHero(v)) return null;

    var host = v.parentElement;
    if (!host) return null;

    var wrap = document.createElement('div');
    wrap.className = 'pl-video-wrap';
    host.insertBefore(wrap, v);
    wrap.appendChild(v);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pl-video-fallback';
    btn.setAttribute(
      'aria-label',
      document.documentElement.lang === 'en' ? 'Play video' : 'تشغيل الفيديو'
    );
    btn.innerHTML = PLAY_SVG;
    wrap.appendChild(btn);

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      tryPlay(v);
    });

    v.addEventListener('waiting', function () {
      wrap.classList.add('is-loading');
    });
    v.addEventListener('canplay', function () {
      wrap.classList.remove('is-loading');
    });

    return wrap;
  }

  function initVideo(v) {
    if (!v || v.nodeName !== 'VIDEO' || v.dataset.ghVideoInit === '1') return;
    v.dataset.ghVideoInit = '1';

    prep(v);
    ensureWrap(v);

    if (!v.getAttribute('data-pl-src')) {
      var inlineSrc = pickSrc(v);
      if (inlineSrc) v.setAttribute('data-pl-src', inlineSrc.replace(/-mobile\.mp4/i, '.mp4'));
    }

    if (isEager(v)) {
      if (v.getAttribute('preload') === 'none') v.setAttribute('preload', 'metadata');
      ensureLoaded(v);
      tryPlay(v);
    } else if (v.getAttribute('preload') === 'none') {
      /* keep none until in view */
    } else if (v.getAttribute('preload') !== 'auto') {
      v.setAttribute('preload', 'metadata');
    }

    v.addEventListener('loadeddata', function () {
      if (isInView(v) || isHero(v)) tryPlay(v);
    });
    v.addEventListener('canplay', function () {
      if (isInView(v) || isHero(v)) tryPlay(v);
    });
    v.addEventListener('playing', markPlaying.bind(null, v));
    v.addEventListener('pause', function () {
      if (document.hidden) return;
      if ((isInView(v) || isHero(v)) && v.dataset.ghUserUnmuted !== '1') {
        window.setTimeout(function () {
          tryPlay(v);
        }, 120);
      }
      markPaused(v);
    });
    v.addEventListener('stalled', function () {
      window.setTimeout(function () {
        tryPlay(v);
      }, 400);
    });
    v.addEventListener('ended', function () {
      try {
        v.currentTime = 0;
      } catch (e) {}
      tryPlay(v);
    });

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            var vid = e.target;
            if (e.isIntersecting) {
              var wrap = vid.closest('.pl-video-wrap');
              if (wrap) wrap.classList.add('is-loading');
              ensureLoaded(vid);
              tryPlay(vid);
            } else if (!isHero(vid) && !vid.paused) {
              try {
                vid.pause();
              } catch (err) {}
            }
          });
        },
        { rootMargin: '160px 0px', threshold: [0, 0.01, 0.08, 0.2] }
      );
      obs.observe(v);
      if (isInView(v) || isHero(v)) {
        ensureLoaded(v);
        tryPlay(v);
      }
    } else {
      ensureLoaded(v);
      tryPlay(v);
    }
  }

  function allVideos() {
    return Array.prototype.slice.call(document.querySelectorAll(VIDEO_SEL));
  }

  function boot() {
    allVideos().forEach(initVideo);
  }

  function unlockAll() {
    allVideos().forEach(function (v) {
      ensureLoaded(v);
      if (isInView(v) || isHero(v)) tryPlay(v);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  ['touchstart', 'touchend', 'click', 'scroll', 'pointerdown'].forEach(function (evt) {
    document.addEventListener(evt, unlockAll, { passive: true });
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) unlockAll();
  });

  window.addEventListener('pageshow', unlockAll);

  window.setTimeout(unlockAll, 300);
  window.setTimeout(unlockAll, 900);
  window.setTimeout(unlockAll, 2000);
  window.setTimeout(unlockAll, 4000);

  window.GHVideo = {
    prep: prep,
    tryPlay: tryPlay,
    ensureLoaded: ensureLoaded,
    unlockAll: unlockAll,
  };
})();
