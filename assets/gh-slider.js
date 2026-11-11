/**
 * Shared card/strip slider (Packages catalog behavior).
 * One visible slide: add class ghd-slider--one on .ghd-slider
 */
(function (global) {
  'use strict';

  function sliderItems(track) {
    var list = track.querySelectorAll('.ghd-svc-card, .ghd-proof-slide, .ghd-slider-item');
    if (list && list.length) return list;
    return track.children;
  }

  function sliderVisibleCount(viewport, mode, slider) {
    if (slider && slider.classList.contains('ghd-slider--one')) return 1;
    var w = viewport ? viewport.clientWidth : 1100;
    if (mode === 'strip') {
      if (w < 560) return 1;
      if (w < 900) return 2;
      return 3;
    }
    if (w < 560) return 1;
    if (w < 900) return 2;
    return 3;
  }

  function syncSlider(slider) {
    var viewport = slider.querySelector('.ghd-slider-viewport');
    var track = slider.querySelector('.ghd-slider-track');
    var prev = slider.querySelector('.ghd-slider-arrow--prev');
    var next = slider.querySelector('.ghd-slider-arrow--next');
    if (!viewport || !track) return;
    var mode = slider.getAttribute('data-ghd-slider-mode') || 'cards';
    var cards = sliderItems(track);
    var count = cards.length;
    var visible = sliderVisibleCount(viewport, mode, slider);
    var maxIndex = Math.max(0, count - visible);
    var index = parseInt(track.getAttribute('data-ghd-slider-index') || '0', 10) || 0;
    if (index > maxIndex) index = maxIndex;
    if (index < 0) index = 0;
    track.setAttribute('data-ghd-slider-index', String(index));

    var gap = 0;
    try {
      var cs = window.getComputedStyle(track);
      gap = parseFloat(cs.columnGap || cs.gap) || 0;
    } catch (e) {}
    var cardW = count ? cards[0].getBoundingClientRect().width : 0;
    if (!cardW && viewport.clientWidth) {
      cardW = (viewport.clientWidth - gap * Math.max(0, visible - 1)) / Math.max(1, visible);
    }
    var offset = index * (cardW + gap);
    var rtl =
      (document.documentElement.getAttribute('dir') || '').toLowerCase() === 'rtl' ||
      (document.body && (document.body.getAttribute('dir') || '').toLowerCase() === 'rtl') ||
      getComputedStyle(track).direction === 'rtl';
    track.style.transform = 'translate3d(' + (rtl ? offset : -offset) + 'px,0,0)';

    var staticMode = maxIndex === 0;
    slider.classList.toggle('is-static', staticMode);
    if (prev) prev.disabled = staticMode || (!slider.getAttribute('data-ghd-autoplay') && index <= 0);
    if (next) next.disabled = staticMode || (!slider.getAttribute('data-ghd-autoplay') && index >= maxIndex);
    if (slider.getAttribute('data-ghd-autoplay') === '1' && !staticMode) {
      if (prev) prev.disabled = false;
      if (next) next.disabled = false;
    }

    Array.prototype.forEach.call(cards, function (card, i) {
      var inView = i >= index && i < index + visible;
      card.classList.toggle('is-inview', inView);
      card.classList.toggle('is-peek-start', i === index - 1);
      card.classList.toggle('is-peek-end', i === index + visible);
      card.setAttribute('data-ghd-slide-i', String(i));
    });

    slider.dispatchEvent(
      new CustomEvent('gh-slider-change', {
        bubbles: true,
        detail: { index: index, count: count, visible: visible },
      })
    );
  }

  function moveSlider(slider, delta, opts) {
    opts = opts || {};
    var track = slider.querySelector('.ghd-slider-track');
    var viewport = slider.querySelector('.ghd-slider-viewport');
    if (!track || !viewport) return;
    var mode = slider.getAttribute('data-ghd-slider-mode') || 'cards';
    var cards = sliderItems(track);
    var visible = sliderVisibleCount(viewport, mode, slider);
    var maxIndex = Math.max(0, cards.length - visible);
    var index = parseInt(track.getAttribute('data-ghd-slider-index') || '0', 10) || 0;
    var next = index + delta;
    if (opts.loop) {
      if (next > maxIndex) next = 0;
      else if (next < 0) next = maxIndex;
    } else {
      if (next > maxIndex) next = maxIndex;
      if (next < 0) next = 0;
    }
    track.setAttribute('data-ghd-slider-index', String(next));
    syncSlider(slider);
  }

  function bindSliders(root) {
    if (!root) return;
    root.querySelectorAll('.ghd-slider').forEach(function (slider) {
      if (slider.getAttribute('data-ghd-bound') === '1') {
        syncSlider(slider);
        return;
      }
      slider.setAttribute('data-ghd-bound', '1');
      var track = slider.querySelector('.ghd-slider-track');
      var prev = slider.querySelector('.ghd-slider-arrow--prev');
      var next = slider.querySelector('.ghd-slider-arrow--next');
      if (!track) return;
      var autoplay = slider.getAttribute('data-ghd-autoplay') === '1';
      var timer = null;
      var paused = false;
      var edgeLock = false;

      function stopAuto() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }
      function startAuto() {
        stopAuto();
        if (!autoplay || paused) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        timer = setInterval(function () {
          if (paused || document.hidden) return;
          moveSlider(slider, 1, { loop: true });
        }, 4200);
      }

      if (prev) {
        prev.addEventListener('click', function (e) {
          e.preventDefault();
          moveSlider(slider, -1, { loop: autoplay });
          startAuto();
        });
      }
      if (next) {
        next.addEventListener('click', function (e) {
          e.preventDefault();
          moveSlider(slider, 1, { loop: autoplay });
          startAuto();
        });
      }

      slider.addEventListener('mouseenter', function () {
        paused = true;
        stopAuto();
      });
      slider.addEventListener('mouseleave', function () {
        paused = false;
        edgeLock = false;
        startAuto();
      });

      track.addEventListener('mouseover', function (e) {
        var item = e.target.closest('.ghd-slider-item, .ghd-proof-slide, .ghd-svc-card');
        if (!item || !track.contains(item) || edgeLock) return;
        if (item.classList.contains('is-peek-end')) {
          edgeLock = true;
          moveSlider(slider, 1, { loop: autoplay });
          setTimeout(function () {
            edgeLock = false;
          }, 500);
        } else if (item.classList.contains('is-peek-start')) {
          edgeLock = true;
          moveSlider(slider, -1, { loop: autoplay });
          setTimeout(function () {
            edgeLock = false;
          }, 500);
        }
      });

      var touching = false;
      var startX = 0;
      var startIndex = 0;
      track.addEventListener(
        'touchstart',
        function (e) {
          if (!e.touches || !e.touches.length) return;
          touching = true;
          paused = true;
          stopAuto();
          startX = e.touches[0].clientX;
          startIndex = parseInt(track.getAttribute('data-ghd-slider-index') || '0', 10) || 0;
        },
        { passive: true }
      );
      track.addEventListener(
        'touchend',
        function (e) {
          if (!touching) return;
          touching = false;
          paused = false;
          var endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX;
          var dx = endX - startX;
          var rtl =
            (document.documentElement.getAttribute('dir') || '').toLowerCase() === 'rtl' ||
            getComputedStyle(track).direction === 'rtl';
          if (Math.abs(dx) >= 40) {
            var delta = rtl ? (dx > 0 ? 1 : -1) : dx < 0 ? 1 : -1;
            track.setAttribute('data-ghd-slider-index', String(startIndex + delta));
            syncSlider(slider);
          }
          startAuto();
        },
        { passive: true }
      );

      syncSlider(slider);
      requestAnimationFrame(function () {
        syncSlider(slider);
        startAuto();
      });
      if (!global.__ghSliderResizeBound) {
        global.__ghSliderResizeBound = true;
        var t;
        global.addEventListener('resize', function () {
          clearTimeout(t);
          t = setTimeout(function () {
            document.querySelectorAll('.ghd-slider').forEach(syncSlider);
          }, 120);
        });
      }
    });
  }

  global.GHSlider = {
    bind: bindSliders,
    sync: syncSlider,
    move: moveSlider,
  };
})(typeof window !== 'undefined' ? window : globalThis);
