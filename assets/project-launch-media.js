/**
 * ProjectLaunch / solution pages — compatibility shim.
 * Core logic lives in gh-performance.js v6+.
 */
(function () {
  'use strict';
  if (window.GHVideo && typeof window.GHVideo.unlockAll === 'function') {
    document.addEventListener('DOMContentLoaded', function () {
      window.GHVideo.unlockAll();
    });
  }
})();
