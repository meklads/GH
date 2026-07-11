(function () {
  'use strict';

  var html = document.documentElement;
  var body = document.body;
  var langBtn = document.getElementById('lang-btn');
  var themeBtn = document.getElementById('theme-btn');

  function detectPageLang() {
    var file = (location.pathname.split('/').pop() || '').split('?')[0];
    if (/-en\.html$/i.test(file)) return 'en';
    if (file === 'index.html' || file === '' || file === '/') {
      if ((html.getAttribute('lang') || '') === 'en') return 'en';
    }
    if ((html.getAttribute('lang') || '') === 'en' && html.getAttribute('dir') === 'ltr') return 'en';
    if (body.classList.contains('is-en')) return 'en';
    if ((html.getAttribute('lang') || '') === 'ar' || html.getAttribute('dir') === 'rtl') return 'ar';
    return null;
  }

  // Dedicated AR/EN URLs are monolingual — never toggle content language in-page.
  var pageLang = detectPageLang();
  var currentLang = pageLang || localStorage.getItem('gh-lang') || 'ar';
  if (pageLang) localStorage.setItem('gh-lang', pageLang);

  // Always light brand theme (homepage #FAFAF8) — no dark mode on these pages.
  body.classList.remove('is-light');
  localStorage.setItem('gh-theme', 'light');
  if (themeBtn) themeBtn.style.display = 'none';
  if (langBtn) langBtn.style.display = 'none';

  function triggerHeroEntrance() {
    document.querySelectorAll('.hero-enter').forEach(function (el) { el.classList.add('in'); });
  }

  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loader-bar');
  if (loader && loaderBar) {
    body.style.overflow = 'hidden';
    setTimeout(function () { loaderBar.style.width = '100%'; }, 80);
    setTimeout(function () {
      loader.classList.add('out');
      body.style.overflow = '';
      triggerHeroEntrance();
    }, 1450);
  } else {
    triggerHeroEntrance();
  }

  var dot = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');
  if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
    var mx = 0;
    var my = 0;
    var rx = 0;
    var ry = 0;
    var moved = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      if (!moved) {
        rx = mx;
        ry = my;
        moved = true;
        dot.classList.add('visible');
        ring.classList.add('visible');
      }
    });

    (function animRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a,button,[role="button"],input,select,textarea').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hovered'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hovered'); });
    });
  }

  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  if ('IntersectionObserver' in window) {
    var cntObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.dataset.counter, 10);
        var suffix = el.dataset.suffix || '';
        var dur = 1800;
        var start = performance.now();
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
          el.textContent = v + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        })(start);
        cntObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(function (el) { cntObs.observe(el); });
  }

  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');
  var currentPage = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var linkFile = href.split('/').pop();
    if (linkFile === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('nav-active');
    }
  });

  function updateNav() {
    var cur = '';
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 160) cur = s.id;
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      a.classList.toggle('nav-active', href === '#' + cur);
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  var mainNav = document.getElementById('main-nav');
  if (mainNav) {
    window.addEventListener('scroll', function () {
      mainNav.classList.toggle('scrolled', scrollY > 10);
    }, { passive: true });
  }

  var heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      if (scrollY < innerHeight) heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
    }, { passive: true });
  }

  var mobLangBtn = document.getElementById('mob-lang-btn');
  var mobThemeBtn = document.getElementById('mob-theme-btn');
  if (mobLangBtn) {
    mobLangBtn.addEventListener('click', function () { setLang(currentLang === 'ar' ? 'en' : 'ar'); });
  }
  if (mobThemeBtn) {
    mobThemeBtn.addEventListener('click', function () {
      applyTheme(!isDark);
      var ms = mobThemeBtn.querySelectorAll('.material-symbols-outlined');
      ms.forEach(function (el) {
        el.style.display = el.classList.contains('icon-moon') ? (isDark ? 'block' : 'none') : (isDark ? 'none' : 'block');
      });
    });
  }

  var mobNav = document.getElementById('mob-nav');
  var mobOpen = document.getElementById('mob-open');
  var mobClose = document.getElementById('mob-close');
  function openMob() {
    if (!mobNav) return;
    mobNav.classList.add('open');
    body.style.overflow = 'hidden';
  }
  function closeMob() {
    if (!mobNav) return;
    mobNav.classList.remove('open');
    body.style.overflow = '';
  }
  if (mobOpen) mobOpen.addEventListener('click', openMob);
  if (mobClose) mobClose.addEventListener('click', closeMob);
  document.querySelectorAll('.mob-link').forEach(function (a) { a.addEventListener('click', closeMob); });

  var vidModal = document.getElementById('vid-modal');
  var vidClose = document.getElementById('vid-close');
  function closeVid() {
    if (!vidModal) return;
    vidModal.classList.remove('open');
    body.style.overflow = '';
  }
  // Legacy pages may still have a stub #vid-modal with no overlay CSS.
  // Never lock scroll for a non-functional modal — that freezes the page.
  if (vidModal) {
    vidModal.setAttribute('hidden', '');
    vidModal.style.display = 'none';
    document.querySelectorAll('.play-btn').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        // Prefer real YouTube links nearby; otherwise no-op
        var card = b.closest('a[href*="youtube.com"]');
        if (card && card.href) {
          window.open(card.href, '_blank', 'noopener');
          return;
        }
      });
    });
    if (vidClose) vidClose.addEventListener('click', closeVid);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeVid();
      closeMob();
    }
  });

  var backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('visible', scrollY > 600);
    }, { passive: true });
    backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();
