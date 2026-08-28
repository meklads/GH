(function () {
  'use strict';

  /* FAQ accordion — native details, no JS required; enhance analytics if needed */

  /* TOC scroll spy */
  var tocLinks = document.querySelectorAll('.gh-art-sidebar-toc a[href^="#"]');
  if (tocLinks.length) {
    var headings = [];
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) headings.push({ el: el, link: a });
    });
    if (headings.length && 'IntersectionObserver' in window) {
      var activeId = '';
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) activeId = entry.target.id;
          });
          if (!activeId) return;
          headings.forEach(function (h) {
            h.link.classList.toggle('is-active', h.el.id === activeId);
          });
        },
        { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
      );
      headings.forEach(function (h) {
        obs.observe(h.el);
      });
    }
  }

  /* Reading progress bar */
  var progressBar = document.querySelector('.gh-art-progress span');
  var articleMain = document.querySelector('.gh-article-main');
  if (progressBar && articleMain) {
    function updateProgress() {
      var rect = articleMain.getBoundingClientRect();
      var total = articleMain.offsetHeight - window.innerHeight;
      if (total <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      var scrolled = -rect.top;
      var pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* Copy link button */
  document.querySelectorAll('[data-gh-copy-link]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = window.location.href.split('#')[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          var orig = btn.innerHTML;
          btn.setAttribute('aria-label', btn.dataset.copiedLabel || 'Copied');
          btn.classList.add('is-copied');
          setTimeout(function () {
            btn.innerHTML = orig;
            btn.classList.remove('is-copied');
          }, 2000);
        });
      }
    });
  });
})();
