/**
 * Reliable muted autoplay + loop for homepage / ambient videos on mobile + desktop.
 * iOS/Android require muted + playsInline and often a JS play() retry after gesture.
 */
(function () {
  var SELECTOR =
    'video[autoplay], video.gh-autoplay, #hero-vid, #hero-vid-ar, #s2VideoPlayer, .ar-media-frame video, .ar-outcomes-media video, .ar-img-frame video';

  function prep(v) {
    if (!v || v.nodeName !== 'VIDEO') return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.loop = true;
    v.setAttribute('muted', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('loop', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    if (v.getAttribute('preload') === 'none') {
      v.setAttribute('preload', 'metadata');
    }
  }

  function tryPlay(v) {
    prep(v);
    if (v.classList && v.classList.contains('pl-lazy-video') && v.getAttribute('data-pl-loaded') !== '1') {
      return;
    }
    if (v.readyState === 0) {
      try {
        v.load();
      } catch (e) {}
    }
    var p = v.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {});
    }
  }

  function allVideos() {
    return Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
  }

  function kickVisible() {
    allVideos().forEach(function (v) {
      var rect = v.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var visible = rect.bottom > 0 && rect.top < vh;
      if (visible || v.id === 'hero-vid' || v.id === 'hero-vid-ar') {
        tryPlay(v);
      }
    });
  }

  function kickAll() {
    allVideos().forEach(tryPlay);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) {
            tryPlay(v);
          } else if (!v.paused && v.id !== 'hero-vid' && v.id !== 'hero-vid-ar') {
            v.pause();
          }
        });
      },
      { rootMargin: '120px 0px', threshold: [0, 0.01, 0.15] }
    );

    function observe() {
      allVideos().forEach(function (v) {
        prep(v);
        observer.observe(v);
        tryPlay(v);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observe);
    } else {
      observe();
    }
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', kickAll);
    } else {
      kickAll();
    }
  }

  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    kickVisible();
    window.setTimeout(kickVisible, 250);
  }

  ['touchstart', 'touchend', 'click', 'scroll', 'pointerdown'].forEach(function (evt) {
    document.addEventListener(evt, unlock, { passive: true, once: false });
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) kickVisible();
  });

  window.addEventListener('pageshow', function () {
    kickVisible();
  });

  window.setTimeout(kickVisible, 400);
  window.setTimeout(kickVisible, 1200);
  window.setTimeout(kickVisible, 2500);
})();
