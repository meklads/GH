(function () {
  var lb = document.getElementById('jcsLightbox');
  var lbImg = document.getElementById('jcsLightboxImg');
  var vm = document.getElementById('jcsVideoModal');
  var iframe = document.getElementById('jcsVideoIframe');
  var ytId = document.body.getAttribute('data-yt-id');

  document.querySelectorAll('[data-jcs-lightbox]').forEach(function (el) {
    el.addEventListener('click', function () {
      var src = el.getAttribute('data-jcs-lightbox') || el.querySelector('img')?.src;
      if (!src || !lb || !lbImg) return;
      lbImg.src = src;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.getElementById('jcsLightboxClose')?.addEventListener('click', closeLb);
  lb?.addEventListener('click', function (e) {
    if (e.target === lb) closeLb();
  });

  function openVideo() {
    if (!vm || !iframe || !ytId) return;
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + ytId + '?autoplay=1&rel=0';
    vm.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    if (!vm || !iframe) return;
    vm.classList.remove('is-open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-jcs-play]').forEach(function (btn) {
    btn.addEventListener('click', openVideo);
  });
  document.getElementById('jcsVideoClose')?.addEventListener('click', closeVideo);
  vm?.addEventListener('click', function (e) {
    if (e.target === vm) closeVideo();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLb();
      closeVideo();
    }
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.jcs-reveal').forEach(function (el) {
      obs.observe(el);
    });
  } else {
    document.querySelectorAll('.jcs-reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
