/**
 * Play autoplay videos only when visible; pause when off-screen.
 */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio > 0.1) {
          if (v.paused) v.play().catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    },
    { rootMargin: '80px 0px', threshold: [0, 0.1, 0.25] }
  );

  function observe() {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      observer.observe(v);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();
