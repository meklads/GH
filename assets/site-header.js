(function () {
  function toggleMenu() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('menuToggle');
    if (!nav || !toggle) return;
    nav.classList.toggle('open');
    toggle.innerHTML = nav.classList.contains('open')
      ? '<span class="material-symbols-outlined">close</span>'
      : '<span class="material-symbols-outlined">menu</span>';
  }
  window.toggleMenu = toggleMenu;

  window.addEventListener('scroll', function () {
    var header = document.getElementById('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 80);
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav a, .nav .nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var nav = document.getElementById('nav');
        var toggle = document.getElementById('menuToggle');
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          if (toggle) {
            toggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';
          }
        }
      });
    });
  });
})();
