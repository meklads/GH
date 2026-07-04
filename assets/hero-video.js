(function () {
  var START = 8;
  var END = 35;

  function init(id) {
    var v = document.getElementById(id);
    if (!v || v.dataset.heroInit === '1') return;
    v.dataset.heroInit = '1';

    var wrap = v.closest('.hero-video-bg');
    v.muted = true;
    v.playsInline = true;
    v.removeAttribute('autoplay');
    v.removeAttribute('loop');

    function markPlaying() {
      if (wrap) wrap.classList.add('is-playing');
    }

    function jumpToStart(done) {
      function seekAndContinue() {
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
        v.currentTime = START;
      }

      if (v.readyState >= 1) {
        seekAndContinue();
      } else {
        v.addEventListener('loadedmetadata', seekAndContinue, { once: true });
      }
    }

    function startPlayback() {
      jumpToStart(function () {
        var playPromise = v.play();
        if (playPromise && playPromise.then) {
          playPromise.then(markPlaying).catch(function () {});
        } else {
          markPlaying();
        }
      });
    }

    v.addEventListener('playing', markPlaying);

    v.addEventListener('timeupdate', function () {
      if (v.currentTime >= END) {
        v.currentTime = START;
      }
    });

    if (v.readyState >= 2) {
      startPlayback();
    } else {
      v.addEventListener('canplay', startPlayback, { once: true });
    }
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
