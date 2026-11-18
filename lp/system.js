/* Landing page system: quiet section reveal and the related-services click event.
   Loaded with defer. Forms, tracking and films stay in the page scripts. */
(function () {
  'use strict';
  var d = document.documentElement;
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm && 'IntersectionObserver' in window) {
    d.classList.add('js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  }
  /* GA4: click_related_service with source and target */
  var page = document.body.getAttribute('data-page') || 'lp';
  document.querySelectorAll('[data-related]').forEach(function (a) {
    a.addEventListener('click', function () {
      try {
        var p = { source: page, target: a.getAttribute('data-related') };
        if (window.ghTrack) window.ghTrack('click_related_service', p);
        else if (window.gtag) window.gtag('event', 'click_related_service', p);
      } catch (e) {}
    });
  });
})();
