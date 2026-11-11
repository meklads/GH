(function () {
  'use strict';

  var pagePath = window.location.pathname;

  function track(name, params) {
    if (typeof window.ghTrack === 'function') {
      window.ghTrack(name, params || {});
    }
  }

  /* Page view for article template */
  if (document.querySelector('.gh-article-page-wrap')) {
    track('article_view', {
      page: pagePath,
      lang: (document.documentElement.lang || '').toLowerCase(),
    });
  }

  /* TOC scroll spy */
  var tocLinks = document.querySelectorAll('.gh-art-sidebar-toc a[href^="#"], .gh-art-toc-mobile a[href^="#"]');
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

    tocLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        track('article_toc_click', {
          section: a.getAttribute('href') || '',
          page: pagePath,
        });
      });
    });
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

  /* Share + copy analytics */
  document.querySelectorAll('.gh-art-share-btn[href]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      track('article_share', {
        method: btn.getAttribute('aria-label') || 'share',
        page: pagePath,
      });
    });
  });

  document.querySelectorAll('.gh-art-mid-cta a').forEach(function (a) {
    a.addEventListener('click', function () {
      track('article_mid_cta', {
        label: (a.textContent || '').trim(),
        page: pagePath,
      });
    });
  });

  document.querySelectorAll('[data-gh-copy-link]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      track('article_share', { method: 'copy_link', page: pagePath });
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

  /* Footer + solution links */
  document.querySelectorAll('.gh-article-footer-cta a').forEach(function (a) {
    a.addEventListener('click', function () {
      track('article_footer_cta', {
        label: (a.textContent || '').trim(),
        href: a.getAttribute('href') || '',
        page: pagePath,
      });
    });
  });

  document.querySelectorAll('.gh-article-solutions-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      track('article_solution_link', {
        solution: (a.textContent || '').trim(),
        page: pagePath,
      });
    });
  });

  /* Related articles */
  document.querySelectorAll('.gh-art-related-card, .gh-art-sidebar-block--related a').forEach(function (a) {
    a.addEventListener('click', function () {
      track('article_related_click', {
        href: a.getAttribute('href') || '',
        page: pagePath,
      });
    });
  });

  /* Sidebar service promos + contact */
  document.querySelectorAll('.gh-art-sidebar-promo, .gh-art-sidebar-contact a').forEach(function (a) {
    a.addEventListener('click', function () {
      track('article_sidebar_click', {
        label: (a.textContent || '').trim().slice(0, 80),
        href: a.getAttribute('href') || '',
        page: pagePath,
      });
    });
  });

  document.querySelectorAll('.gh-art-sidebar-tool').forEach(function (a) {
    a.addEventListener('click', function () {
      track('article_sidebar_click', {
        label: 'launch_checklist_tool',
        href: a.getAttribute('href') || '',
        page: pagePath,
      });
    });
  });
})();
