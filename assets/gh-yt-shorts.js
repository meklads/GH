/** GrowthLaunch / solution pages — click-to-play YouTube Shorts */
(function () {
  'use strict';

  function play(btn) {
    var id = btn.getAttribute('data-yt-id');
    if (!id) return;
    var frame = btn.closest('.gl-vid-frame');
    if (!frame) return;
    var iframe = document.createElement('iframe');
    iframe.src =
      'https://www.youtube.com/embed/' +
      encodeURIComponent(id) +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    iframe.title = btn.getAttribute('aria-label') || 'YouTube video';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.innerHTML = '';
    frame.appendChild(iframe);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.gl-yt-play');
    if (!btn) return;
    e.preventDefault();
    play(btn);
  });
})();
