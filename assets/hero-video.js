(function () {
  var START = 8;
  var END = 35;

  function init(id) {
    var v = document.getElementById(id);
    if (!v || v.dataset.heroReady === '1') return;
    v.dataset.heroReady = '1';

    var wrap = v.closest('.hero-video-bg');
    var started = false;
    var revealed = false;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.removeAttribute('autoplay');
    v.removeAttribute('loop');

    function markPlaying() {
      if (revealed) return;
      if (v.currentTime < START - 0.1) return;
      revealed = true;
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
        if (typeof v.fastSeek === 'function') {
          v.fastSeek(START);
        } else {
          v.currentTime = START;
        }
      } catch (e) {
        if (done) done();
      }
    }

    function enforceStart() {
      if (v.currentTime > 0 && v.currentTime < START - 0.05) {
        try {
          v.currentTime = START;
        } catch (e) {}
      }
    }

    function startFromSecondEight() {
      if (started) return;
      started = true;

      seekToStart(function () {
        enforceStart();
        v.play()
          .then(function () {
            markPlaying();
          })
          .catch(function () {
            started = false;
          });
      });
    }

    v.addEventListener('timeupdate', function () {
      enforceStart();

      if (v.currentTime >= END - 0.15) {
        seekToStart(function () {
          if (v.paused) v.play().catch(function () {});
        });
        return;
      }

      if (v.currentTime >= START - 0.05 && !v.paused) {
        markPlaying();
      }
    });

    v.addEventListener('playing', markPlaying);
    v.addEventListener('loadedmetadata', startFromSecondEight, { once: true });
    v.addEventListener('canplay', startFromSecondEight, { once: true });

    if (v.readyState >= 1) {
      startFromSecondEight();
    }
  }

  init('hero-vid');
  init('hero-vid-ar');
})();
