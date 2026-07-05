(function () {
  var HOVER_DELAY = 180;
  var closeTimer = null;

  function getNav() {
    return document.getElementById('nav');
  }

  function getToggle() {
    return document.getElementById('menuToggle');
  }

  function getBackdrop() {
    return document.getElementById('navBackdrop');
  }

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function isRtl() {
    return document.documentElement.getAttribute('dir') === 'rtl';
  }

  function setMenuOpen(open) {
    var nav = getNav();
    var toggle = getToggle();
    var backdrop = getBackdrop();
    if (!nav || !toggle) return;

    nav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open
      ? (isRtl() ? 'إغلاق القائمة' : 'Close menu')
      : (isRtl() ? 'فتح القائمة' : 'Open menu'));
    toggle.innerHTML = open
      ? '<span class="material-symbols-outlined">close</span>'
      : '<span class="material-symbols-outlined">menu</span>';

    if (backdrop) backdrop.hidden = !open;
    if (!open) closeAllMega();
  }

  function toggleMenu() {
    var nav = getNav();
    if (!nav) return;
    setMenuOpen(!nav.classList.contains('open'));
  }

  window.toggleMenu = toggleMenu;

  function closeAllMega() {
    document.querySelectorAll('.nav-mega-item.is-open').forEach(function (item) {
      item.classList.remove('is-open');
      var trigger = item.querySelector('.nav-mega-trigger');
      var menu = item.querySelector('.mega-menu');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (menu) menu.classList.remove('open');
    });
  }

  function openMega(item) {
    var trigger = item.querySelector('.nav-mega-trigger');
    var menu = item.querySelector('.mega-menu');
    item.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (menu && isMobile()) menu.classList.add('open');
  }

  function initMegaItems() {
    document.querySelectorAll('.nav-mega-item').forEach(function (item) {
      var trigger = item.querySelector('.nav-mega-trigger');
      var menu = item.querySelector('.mega-menu');
      if (!trigger || !menu) return;

      item.addEventListener('mouseenter', function () {
        if (isMobile()) return;
        clearTimeout(closeTimer);
        closeAllMega();
        openMega(item);
      });

      item.addEventListener('mouseleave', function () {
        if (isMobile()) return;
        var self = item;
        var trig = trigger;
        closeTimer = setTimeout(function () {
          self.classList.remove('is-open');
          trig.setAttribute('aria-expanded', 'false');
        }, HOVER_DELAY);
      });

      menu.addEventListener('mouseenter', function () {
        if (isMobile()) return;
        clearTimeout(closeTimer);
      });

      trigger.addEventListener('click', function (e) {
        if (!isMobile()) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        var wasOpen = item.classList.contains('is-open');
        closeAllMega();
        if (!wasOpen) openMega(item);
      });
    });
  }

  window.addEventListener('scroll', function () {
    var header = document.getElementById('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  });

  document.addEventListener('DOMContentLoaded', function () {
    initMegaItems();

    var backdrop = getBackdrop();
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setMenuOpen(false);
      });
    }

    document.querySelectorAll('.nav a:not(.nav-mega-trigger), .nav .mm-card, .nav .mm-svc-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var nav = getNav();
        if (nav && nav.classList.contains('open')) setMenuOpen(false);
      });
    });

    var toggle = getToggle();
    if (toggle) {
      toggle.addEventListener('click', toggleMenu);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenuOpen(false);
    });

    window.addEventListener('resize', function () {
      if (!isMobile()) {
        document.querySelectorAll('.mega-menu.open').forEach(function (m) {
          m.classList.remove('open');
        });
      }
    });
  });
})();
