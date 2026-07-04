(function () {
  var START = 8;
  var END = 35;

  function setup(v) {
    if (!v || v.dataset.heroOk) return;
    v.dataset.heroOk = '1';

    var wrap = v.closest('.hero-video-bg');
    v.muted = true;
    v.defaultMuted = true;

    function atStart() {
      try {
        if (v.currentTime < START - 0.05 || v.currentTime >= END) {
          v.currentTime = START;
        }
      } catch (e) {}
    }

    function reveal() {
      if (wrap) wrap.classList.add('is-playing');
    }

    v.addEventListener('loadedmetadata', atStart);
    v.addEventListener('seeked', function () {
      if (v.currentTime >= START - 0.1) reveal();
    });
    v.addEventListener('timeupdate', function () {
      if (v.currentTime >= END) atStart();
      else if (v.currentTime > 0 && v.currentTime < START - 0.05) atStart();
    });

    atStart();
    v.play().catch(function () {});
  }

  setup(document.getElementById('hero-vid'));
  setup(document.getElementById('hero-vid-ar'));
})();
