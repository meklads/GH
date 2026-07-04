(function () {
  var START = 8;
  var END = 35;

  function init(id) {
    var v = document.getElementById(id);
    if (!v || v.dataset.heroReady === '1') return;
    v.dataset.heroReady = '1';

    var wrap = v.closest('.hero-video-bg');
    var isPlaying = false;
    var isStarting = false;

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.removeAttribute('autoplay');
    v.removeAttribute('loop');
    v.pause();

    function markPlaying() {
      isPlaying = true;
      if (wrap) wrap.classList.add('is-playing');
    }

    function seekToStart(done) {
      if (Math.abs(v.currentTime - START) < 0.05) {
        if (done) done();
        return;
      }
      v.addEventListener(
        'seeked',
        function () {
          if (done) done();
        },
        { once: true }
      );
      try {
        v.currentTime = START;
      } catch (e) {
        if (done) done();
      }
    }

    function startClip() {
      if (isPlaying || isStarting || v.readyState < 2) return;
      isStarting = true;

      seekToStart(function () {
        var playPromise = v.play();
        if (playPromise && playPromise.then) {
          playPromise
            .then(function () {
              isStarting = false;
              markPlaying();
            })
            .catch(function () {
              isStarting = false;
            });
        } else {
          isStarting = false;
          markPlaying();
        }
      });
    }

    v.addEventListener('playing', markPlaying);
    v.addEventListener('timeupdate', function () {
      if (v.currentTime > START + 0.12) {
        markPlaying();
      }
      if (v.currentTime >= END) {
        seekToStart(function () {
          if (v.paused) {
            v.play().catch(function () {});
          }
        });
      }
    });

    v.addEventListener('loadeddata', startClip, { once: true });
    v.addEventListener('canplay', startClip, { once: true });
    v.addEventListener('canplaythrough', startClip, { once: true });

    if (v.readyState >= 2) {
      startClip();
    }

    setTimeout(startClip, 2000);
    setTimeout(startClip, 5000);
  }

  function boot() {
    init('hero-vid');
    init('hero-vid-ar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
