(function () {
  var START = 8;
  var END = 35;

  function init(id) {
    var v = document.getElementById(id);
    if (!v || v.dataset.heroReady === '1') return;
    v.dataset.heroReady = '1';

    var wrap = v.closest('.hero-video-bg');
    var started = false;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.removeAttribute('autoplay');
    v.removeAttribute('loop');

    function markPlaying() {
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

    function startFromSecondEight() {
      if (started) return;
      started = true;

      seekToStart(function () {
        markPlaying();
        v.play().catch(function () {
          started = false;
        });
      });
    }

    v.addEventListener('timeupdate', function () {
      if (v.currentTime >= END) {
        seekToStart(function () {
          if (v.paused) v.play().catch(function () {});
        });
      }
    });

    v.addEventListener('loadedmetadata', startFromSecondEight, { once: true });
    v.addEventListener('canplay', startFromSecondEight, { once: true });

    if (v.readyState >= 1) {
      startFromSecondEight();
    }
  }

  init('hero-vid');
  init('hero-vid-ar');
})();
