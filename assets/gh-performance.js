/**
 * GH ambient video — tap-to-play once (poster + play button, no autoplay).
 * v9
 */
(function () {
  'use strict';

  var VIDEO_SEL = [
    'video[autoplay]',
    'video.gh-autoplay',
    '#s2VideoPlayer',
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
      !!v.closest('.hero-video-bg')
    );
  }

  function prepHero(v) {
    if (v.dataset.ghUserUnmuted !== '1') {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute('muted', '');
    }
    v.playsInline = true;
    v.loop = true;
    v.setAttribute('loop', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
  }

  function prepClickToPlay(v) {
    v.removeAttribute('autoplay');
    v.loop = false;
    v.removeAttribute('loop');
    if (v.dataset.ghUserUnmuted !== '1') {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute('muted', '');
    }
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    if (!v.hasAttribute('disablepictureinpicture')) {
      v.setAttribute('disablepictureinpicture', '');
    }
    if (!v.getAttribute('preload') || v.getAttribute('preload') === 'auto') {
      v.setAttribute('preload', 'metadata');
    }
    try {
      v.pause();
      v.currentTime = 0;
    } catch (e) {}
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
    if (!v.getAttribute('data-pl-src')) {
      v.setAttribute('data-pl-src', src.replace(/-mobile\.mp4/i, '.mp4'));
    }
    try {
      v.load();
    } catch (e) {}
    return true;
  }

  function hideDualPoster(v) {
    var dual = v.closest('.gh-ambient-dual');
    if (!dual) return;
    dual.querySelectorAll('.gh-ambient-poster-mobile').forEach(function (img) {
      img.style.display = 'none';
    });
  }

  function setPausedUI(wrap, v) {
    if (!wrap) return;
    wrap.classList.add('pl-video-paused');
    wrap.classList.remove('pl-video-playing', 'is-loading');
    var poster = v.getAttribute('poster');
    if (poster) {
      wrap.style.backgroundImage = 'url("' + poster.replace(/"/g, '\\"') + '")';
    }
    try {
      v.pause();
      v.currentTime = 0;
    } catch (e) {}
  }

  function setPlayingUI(wrap) {
    if (!wrap) return;
    wrap.classList.remove('pl-video-paused', 'is-loading');
    wrap.classList.add('pl-video-playing');
  }

  function playOnce(v, wrap) {
    ensureLoaded(v);
    hideDualPoster(v);

    if (wrap) wrap.classList.add('is-loading');

    function start() {
      var p = v.play();
      if (p && typeof p.then === 'function') {
        p.then(function () {
          setPlayingUI(wrap);
        }).catch(function () {
          setPausedUI(wrap, v);
        });
      } else if (!v.paused) {
        setPlayingUI(wrap);
      }
    }

    if (v.readyState >= 2) {
      start();
      return;
    }

    v.addEventListener(
      'canplay',
      function () {
        start();
      },
      { once: true }
    );
    try {
      v.load();
    } catch (e) {}
  }

  function ensureWrap(v) {
    if (!v || v.closest('.pl-video-wrap')) return v ? v.closest('.pl-video-wrap') : null;

    var host = v.parentElement;
    if (!host) return null;

    var wrap = document.createElement('div');
    wrap.className = 'pl-video-wrap pl-video-paused';
    host.insertBefore(wrap, v);
    wrap.appendChild(v);

    var poster = v.getAttribute('poster');
    if (poster) {
      wrap.style.backgroundImage = 'url("' + poster.replace(/"/g, '\\"') + '")';
      wrap.style.backgroundSize = 'cover';
      wrap.style.backgroundPosition = 'center';
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pl-video-fallback';
    btn.setAttribute(
      'aria-label',
      document.documentElement.lang === 'en' ? 'Play video' : 'تشغيل الفيديو'
    );
    btn.innerHTML = PLAY_SVG;
    wrap.appendChild(btn);

    function onPlayRequest(e) {
      if (wrap.classList.contains('pl-video-playing')) return;
      e.preventDefault();
      e.stopPropagation();
      playOnce(v, wrap);
    }

    btn.addEventListener('click', onPlayRequest);
    btn.addEventListener('touchend', function (e) {
      e.preventDefault();
      onPlayRequest(e);
    });
    wrap.addEventListener('click', function (e) {
      if (!wrap.classList.contains('pl-video-paused')) return;
      if (e.target === btn) return;
      onPlayRequest(e);
    });

    v.addEventListener('waiting', function () {
      wrap.classList.add('is-loading');
    });
    v.addEventListener('canplay', function () {
      if (wrap.classList.contains('pl-video-playing')) {
        wrap.classList.remove('is-loading');
      }
    });
    v.addEventListener('playing', function () {
      setPlayingUI(wrap);
      wrap.style.backgroundImage = '';
    });
    v.addEventListener('ended', function () {
      setPausedUI(wrap, v);
    });

    return wrap;
  }

  function initVideo(v) {
    if (!v || v.nodeName !== 'VIDEO' || v.dataset.ghVideoInit === '1') return;
    v.dataset.ghVideoInit = '1';

    if (isHero(v)) {
      prepHero(v);
      ensureLoaded(v);
      return;
    }

    prepClickToPlay(v);
    ensureWrap(v);

    if (!v.getAttribute('data-pl-src')) {
      var inlineSrc = pickSrc(v);
      if (inlineSrc) v.setAttribute('data-pl-src', inlineSrc.replace(/-mobile\.mp4/i, '.mp4'));
    }
  }

  function allVideos() {
    return Array.prototype.slice.call(document.querySelectorAll(VIDEO_SEL));
  }

  function boot() {
    allVideos().forEach(initVideo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.GHVideo = {
    prep: prepClickToPlay,
    prepHero: prepHero,
    ensureLoaded: ensureLoaded,
    playOnce: playOnce,
    playWithGesture: function (v) {
      playOnce(v, v.closest('.pl-video-wrap'));
    },
  };
})();
