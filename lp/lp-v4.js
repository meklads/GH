/* Graphics House production LP v4: split hero video card.
   Variant A, chosen by the owner 2026-11-17: the new launch film from real projects; the button opens the GH demo reel.
   The card film starts muted after the page has loaded, never on reduced motion or data saver. */
(function () {
  'use strict';
  var card = document.querySelector('.vcard');
  if (!card) return;
  var v = 'a';
  var g = function (k) { return card.getAttribute('data-' + v + '-' + k); };
  var vid = card.querySelector('.card-vid');
  card.querySelector('.vfull').setAttribute('data-mp4', g('full'));
  document.body.setAttribute('data-hero', v);

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lp_hero_variant', hero_variant: v });
    if (window.gtag) window.gtag('event', 'lp_hero_variant', { page: document.body.getAttribute('data-page'), hero_variant: v });
  } catch (e) {}

  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var save = navigator.connection && navigator.connection.saveData;
  if (calm || save || !vid) return;
  window.addEventListener('load', function () {
    vid.poster = g('poster');
    vid.src = window.innerWidth < 700 ? g('src-m') : g('src');
    vid.addEventListener('playing', function () { card.classList.add('on'); }, { once: true });
    var p = vid.play(); if (p && p.catch) p.catch(function () {});
  });
})();
