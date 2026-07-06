(function () {
  'use strict';

  var CFG = window.GH_ANALYTICS || {};
  if (CFG.enabled === false || !CFG.ga4MeasurementId) return;

  var id = CFG.ga4MeasurementId;
  window.dataLayer = window.dataLayer || [];

  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', id, {
    send_page_view: true,
    anonymize_ip: true
  });

  window.ghTrack = function (eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  };
})();
