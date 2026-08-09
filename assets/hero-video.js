(function () {
  var START = 8;
  var END = 35;

  function setup(v) {
    if (!v || v.dataset.heroOk) return;
    v.dataset.heroOk = '1';

    var wrap = v.closest('.hero-video-bg');
    if (window.GHVideo) {
      window.GHVideo.ensureLoaded(v);
      if (window.GHVideo.prepHero) {
        window.GHVideo.prepHero(v);
      }
    }

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.loop = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('loop', '');

    function reveal() {
      if (wrap) wrap.classList.add('is-playing');
    }

    function atStart() {
      try {
        if (v.currentTime < START - 0.05 || v.currentTime >= END) {
          v.currentTime = START;
        }
      } catch (e) {}
    }

    function tryPlay() {
      atStart();
      if (window.GHVideo) {
        window.GHVideo.tryPlay(v);
        return;
      }
      var p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () {});
      }
    }

    v.addEventListener('loadedmetadata', function () {
      atStart();
      tryPlay();
    });
    v.addEventListener('seeked', function () {
      if (v.currentTime >= START - 0.1) reveal();
    });
    v.addEventListener('playing', function () {
      if (v.currentTime >= START - 0.1) reveal();
    });
    v.addEventListener('timeupdate', function () {
      if (v.currentTime >= START - 0.05) reveal();
      if (v.currentTime >= END) atStart();
      else if (v.currentTime > 0 && v.currentTime < START - 0.05) atStart();
    });
    v.addEventListener('pause', function () {
      if (document.visibilityState === 'visible' && !v.ended) {
        window.setTimeout(tryPlay, 120);
      }
    });

    atStart();
    tryPlay();
    window.setTimeout(tryPlay, 300);
    window.setTimeout(tryPlay, 1000);
    window.setTimeout(tryPlay, 2500);

    ['touchstart', 'click', 'scroll'].forEach(function (evt) {
      document.addEventListener(evt, tryPlay, { passive: true });
    });
  }

  function boot() {
    setup(document.getElementById('hero-vid'));
    setup(document.getElementById('hero-vid-ar'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
