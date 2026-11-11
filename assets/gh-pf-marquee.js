/* Portfolio album marquee: repeat each section's items until they cover the screen,
   then duplicate the set once so the -50% CSS loop is seamless. */
(function () {
  'use strict';
  var SPEED = 55; // px per second

  function build(track) {
    if (track.getAttribute('data-pf-ready')) return;
    var frame = track.parentElement;
    // edge fades take the real background of the section the album sits in
    var n = frame, bg = '';
    while (n && n !== document.documentElement) {
      bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== 'transparent' && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(bg)) break;
      bg = '';
      n = n.parentElement;
    }
    if (bg) frame.style.setProperty('--pf-sec-bg', bg);
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;

    function cloneSet(list) {
      list.forEach(function (el) {
        var c = el.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.setAttribute('tabindex', '-1');
        c.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
        c.querySelectorAll('img').forEach(function (img) { img.setAttribute('alt', ''); });
        track.appendChild(c);
      });
    }

    var guard = 0;
    while (track.scrollWidth < frame.clientWidth * 1.05 && guard < 12) {
      cloneSet(originals);
      guard++;
    }
    var setWidth = track.scrollWidth;
    cloneSet(Array.prototype.slice.call(track.children));
    track.style.setProperty('--pf-marquee-dur', Math.max(25, Math.round(setWidth / SPEED)) + 's');
    track.setAttribute('data-pf-ready', '1');
  }

  function init() {
    document.querySelectorAll('[data-pf-marquee-track]').forEach(build);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
