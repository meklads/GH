/* Graphics House exhibitions LP v2.
   Hero: A (split, default) or B (?hero=b, full-width photo). The choice is set on <html> before first paint by an inline
   script in <head>; here it is only reported to GA4.
   Case film: starts muted when the card scrolls into view, never on reduced motion or data saver. */
(function () {
  'use strict';
  var v = document.documentElement.getAttribute('data-hero') === 'b' ? 'b' : 'a';
  document.body.setAttribute('data-hero', v);
  if (v === 'b') {
    // B's photo is the first thing on screen: load it now, not when the lazy loader gets to it
    var bi = document.querySelector('.hero-b img');
    if (bi) { bi.decoding = 'sync'; bi.loading = 'eager'; bi.setAttribute('fetchpriority', 'high'); }
  }
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lp_hero_variant', hero_variant: v });
    if (window.gtag) window.gtag('event', 'lp_hero_variant', { page: document.body.getAttribute('data-page'), hero_variant: v });
  } catch (e) {}

  var card = document.querySelector('.fcard');
  if (!card) return;
  var vid = card.querySelector('.card-vid');
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var save = navigator.connection && navigator.connection.saveData;
  if (calm || save || !vid || !('IntersectionObserver' in window)) return;

  var started = false;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) { if (started) vid.pause(); return; }
      if (!started) {
        started = true;
        vid.src = window.innerWidth < 700 ? card.getAttribute('data-src-m') : card.getAttribute('data-src');
        vid.addEventListener('playing', function () { card.classList.add('on'); }, { once: true });
      }
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    });
  }, { threshold: 0.35 });
  io.observe(card);
})();
