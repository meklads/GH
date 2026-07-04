(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  function show(el) {
    el.classList.add('visible');
  }

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
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(function (el) {
    observer.observe(el);
  });

  // Ensure above-the-fold blocks appear without waiting for scroll
  requestAnimationFrame(function () {
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        show(el);
      }
    });
  });
})();
