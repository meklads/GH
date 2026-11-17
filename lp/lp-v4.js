/* Graphics House production LP v4: split hero video card with an A/B choice.
   A (default) = new launch film from real projects; B (?hero=b) = GH demo reel 2025.
   The card film starts muted after the page has loaded, never on reduced motion or data saver. */
(function () {
  'use strict';
  var card = document.querySelector('.vcard');
  if (!card) return;
  var q = new URLSearchParams(location.search);
  var v = (q.get('hero') || '').toLowerCase() === 'b' ? 'b' : 'a';
  var g = function (k) { return card.getAttribute('data-' + v + '-' + k); };
  var img = card.querySelector('.vposter');
  var vid = card.querySelector('.card-vid');
  var btn = card.querySelector('.vfull');
  var cap = card.querySelector('.vcap');

  card.setAttribute('data-variant', v);
  if (v === 'b') {
    img.src = g('poster'); img.alt = g('alt');
    cap.textContent = g('cap');
    btn.querySelector('b').textContent = g('btn');
  }
  btn.setAttribute('data-mp4', g('full'));
  document.body.setAttribute('data-hero', v);

  /* the language switch keeps ?hero=b through lp.js (it carries location.search) */

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
