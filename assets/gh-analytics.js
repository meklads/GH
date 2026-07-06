(function () {
  'use strict';

  window.ghTrack = function (eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  };
})();
