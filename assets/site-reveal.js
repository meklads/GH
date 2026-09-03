/**
 * GH reveal + gallery-strip hover video (sitewide).
 * v2 — ensures .reveal becomes .visible; wires .gallery-video hover play.
 */
(function () {
  'use strict';

  function show(el) {
    el.classList.add('visible');
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(show);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });

    // Above-the-fold (hero gallery strip) must show without waiting for scroll
    requestAnimationFrame(function () {
      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.05 && rect.bottom > 0) {
          show(el);
        }
      });
    });
  }

  function initGalleryVideo() {
    document.querySelectorAll('.gallery-video').forEach(function (item) {
      if (item.dataset.ghGalleryBound) return;
      var video = item.querySelector('video');
      if (!video) return;
      var src = item.getAttribute('data-video');
      if (src && !video.querySelector('source') && !video.getAttribute('src')) {
        var source = document.createElement('source');
        source.setAttribute('src', src);
        source.setAttribute('type', 'video/mp4');
        video.appendChild(source);
      }
      item.dataset.ghGalleryBound = '1';
      item.addEventListener('mouseenter', function () {
        video.setAttribute('preload', 'auto');
        try {
          video.currentTime = 0;
        } catch (e) {}
        video.play().catch(function () {});
      });
      item.addEventListener('mouseleave', function () {
        video.pause();
      });
    });
  }

  function boot() {
    initReveal();
    initGalleryVideo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
