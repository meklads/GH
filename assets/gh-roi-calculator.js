/**
 * GrowthLaunch™ — simple lead ROI estimator (no backend).
 */
(function () {
  'use strict';

  var root = document.getElementById('gl-roi-calculator');
  if (!root) return;

  var isEn = (document.documentElement.lang || '').toLowerCase() === 'en';
  var budget = root.querySelector('[data-roi="budget"]');
  var deal = root.querySelector('[data-roi="deal"]');
  var rate = root.querySelector('[data-roi="rate"]');
  var outSlow = root.querySelector('[data-roi="out-slow"]');
  var outFast = root.querySelector('[data-roi="out-fast"]');
  var outDelta = root.querySelector('[data-roi="out-delta"]');

  function num(el) {
    if (!el) return 0;
    var v = parseFloat(String(el.value || '').replace(/[^\d.]/g, ''));
    return isFinite(v) ? v : 0;
  }

  function fmt(n) {
    try {
      return new Intl.NumberFormat(isEn ? 'en-SA' : 'ar-SA', {
        maximumFractionDigits: 0,
      }).format(Math.round(n));
    } catch (e) {
      return String(Math.round(n));
    }
  }

  function calc() {
    var spend = num(budget);
    var avgDeal = num(deal);
    var closePct = num(rate) / 100;
    if (closePct <= 0) closePct = 0.03;

    var cpl = 450;
    var leads = spend > 0 ? spend / cpl : 0;
    var slowClose = closePct * 0.65;
    var fastClose = Math.min(closePct * 1.85, 0.35);
    var slowRev = leads * slowClose * avgDeal;
    var fastRev = leads * fastClose * avgDeal;
    var delta = fastRev - slowRev;

    if (outSlow) outSlow.textContent = fmt(slowRev);
    if (outFast) outFast.textContent = fmt(fastRev);
    if (outDelta) outDelta.textContent = (delta >= 0 ? '+' : '') + fmt(delta);

    if (window.ghTrack && root.dataset.roiTracked !== '1') {
      root.dataset.roiTracked = '1';
      window.ghTrack('roi_calculator_view', { page_path: location.pathname });
    }
  }

  [budget, deal, rate].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', calc);
    el.addEventListener('change', calc);
  });

  calc();
})();
