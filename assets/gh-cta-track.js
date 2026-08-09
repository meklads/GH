(function () {
  'use strict';

  function track(name, params) {
    if (typeof window.ghTrack === 'function') {
      window.ghTrack(name, params || {});
    }
  }

  document.addEventListener(
    'click',
    function (e) {
      var el = e.target.closest('[data-cta]');
      if (el) {
        track('cta_click', {
          cta_id: el.getAttribute('data-cta') || '',
          page_path: location.pathname,
        });
        return;
      }

      var wa = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"], .gh-wa, .float-wa');
      if (wa) {
        track('whatsapp_click', {
          link_url: wa.getAttribute('href') || '',
          page_path: location.pathname,
        });
      }
    },
    true
  );

  document.addEventListener('DOMContentLoaded', function () {
    if (/^\/solutions\//.test(location.pathname) || /\/solutions\//.test(location.pathname)) {
      var slug = location.pathname.split('/').pop() || '';
      slug = slug.replace(/\.html$/, '');
      if (slug) {
        track('solution_view', { solution: slug, page_path: location.pathname });
      }
    }

    var ref = document.referrer || '';
    if (/google\.|bing\.|yahoo\.|duckduckgo\./i.test(ref)) {
      track('organic_landing', { referrer: ref, page_path: location.pathname });
    }
  });
})();
