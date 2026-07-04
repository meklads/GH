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
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('autoplay', '');

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

    v.addEventListener('loadedmetadata', jumpToStart);
    v.addEventListener('loadeddata', jumpToStart);
    v.addEventListener('playing', markPlaying);
    v.addEventListener('timeupdate', function () {
      if (v.currentTime > START + 0.1) markPlaying();
      if (v.currentTime >= END) jumpToStart();
    });

    jumpToStart();
    v.play().catch(function () {});
  }

  init('hero-vid');
  init('hero-vid-ar');
})();
