/**
 * ProjectLaunch™ — mobile video wrappers, loading state, tap-to-play fallback.
 */
(function () {
  'use strict';

  var PLAY_SVG =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="rgba(10,10,10,.55)" stroke="#C9A84C" stroke-width="1.5"/><path d="M26 20l22 12-22 12V20z" fill="#FAFAF8"/></svg>';

  function isInView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < vh;
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

    function markPlaying() {
      wrap.classList.remove('pl-video-paused', 'is-loading');
    }

    function markPaused() {
      if (v.readyState >= 2 && isInView(v)) wrap.classList.add('pl-video-paused');
    }

    function tryPlay() {
      v.muted = true;
      v.playsInline = true;
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

    if (v.readyState < 2) wrap.classList.add('is-loading');

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) {
            wrap.classList.remove('pl-video-paused');
            return;
          }
          if (v.paused && v.readyState >= 2) markPaused();
        });
      }, { threshold: 0.2 });
      obs.observe(v);
    }
  }

  function init() {
    document.querySelectorAll('video.gh-autoplay, .ar-media-frame video, .ar-outcomes-media video, .ar-img-frame video').forEach(wrapVideo);

    window.setTimeout(function () {
      document.querySelectorAll('.pl-video-wrap video').forEach(function (v) {
        var wrap = v.closest('.pl-video-wrap');
        if (wrap && v.paused && v.readyState >= 2) wrap.classList.add('pl-video-paused');
      });
    }, 2800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
