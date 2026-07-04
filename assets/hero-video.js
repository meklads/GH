(function () {
  var START = 8;
  var END = 35;

  function init(id) {
    var v = document.getElementById(id);
    if (!v || v.dataset.heroInit === '1') return;
    v.dataset.heroInit = '1';

    v.removeAttribute('autoplay');
    v.removeAttribute('loop');
    v.style.opacity = '0';

    function seekStart() {
      if (Math.abs(v.currentTime - START) > 0.05) {
        v.currentTime = START;
      }
    }

    function revealAndPlay() {
      seekStart();
      var playPromise = v.play();
      if (playPromise && playPromise.then) {
        playPromise
          .then(function () {
            v.style.opacity = '1';
          })
          .catch(function () {
            v.style.opacity = '1';
          });
      } else {
        v.style.opacity = '1';
      }
    }

    function onReady() {
      seekStart();
      revealAndPlay();
    }

    if (v.readyState >= 1) {
      onReady();
    } else {
      v.addEventListener('loadedmetadata', onReady, { once: true });
    }

    v.addEventListener('timeupdate', function () {
      if (v.currentTime >= END) {
        seekStart();
        v.play();
      } else if (v.currentTime > 0 && v.currentTime < START - 0.05) {
        seekStart();
      }
    });

    v.addEventListener('seeked', function () {
      if (v.currentTime < START - 0.05) {
        seekStart();
      }
    });
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
