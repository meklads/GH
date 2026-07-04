(function () {
  var START = 8;
  var END = 35;

  function init(id) {
    var v = document.getElementById(id);
    if (!v || v.dataset.heroReady === '1') return;
    v.dataset.heroReady = '1';

    var wrap = v.closest('.hero-video-bg');
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.removeAttribute('autoplay');
    v.removeAttribute('loop');
    v.pause();

    function markPlaying() {
      if (wrap) wrap.classList.add('is-playing');
    }

    function jumpToStart() {
      try {
        if (v.currentTime < START - 0.05 || v.currentTime >= END) {
          v.currentTime = START;
        }
      } catch (e) {}
    }

    function begin() {
      jumpToStart();
      v.play().catch(function () {});
    }

    v.addEventListener('timeupdate', function () {
      if (v.currentTime >= START + 0.12) {
        markPlaying();
      } else if (v.currentTime > 0 && v.currentTime < START - 0.05) {
        jumpToStart();
      }
      if (v.currentTime >= END) {
        jumpToStart();
      }
    });

    v.addEventListener('loadedmetadata', begin, { once: true });
    v.addEventListener('canplay', begin, { once: true });

    if (v.readyState >= 1) {
      begin();
    }
  }

  init('hero-vid');
  init('hero-vid-ar');
})();
