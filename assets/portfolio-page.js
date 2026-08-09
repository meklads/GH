(function () {
  'use strict';

  var YT_EMBED =
    'https://www.youtube.com/embed/{id}?autoplay=1&rel=0&modestbranding=1&playsinline=1';

  function ytEmbedUrl(id, start) {
    var url = YT_EMBED.replace('{id}', id);
    if (start) url += '&start=' + start;
    return url;
  }

  window.openVidById = function (id, start) {
    openVid(ytEmbedUrl(id, start));
  };

  window.openVid = function (src) {
    var m = document.getElementById('vidModal');
    var frame = document.getElementById('vidFrame');
    if (!m || !frame) return;
    frame.src = src;
    m.style.display = 'flex';
    setTimeout(function () {
      m.style.opacity = '1';
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  window.closeVid = function (e) {
    var m = document.getElementById('vidModal');
    var frame = document.getElementById('vidFrame');
    if (!m || !frame) return;
    if (!e || e.target === m || e.target.classList.contains('vid-x')) {
      m.style.opacity = '0';
      frame.src = '';
      setTimeout(function () {
        m.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    }
  };

  window.openImg = function (s, c, t) {
    var m = document.getElementById('imgLB');
    var img = document.getElementById('imgLBimg');
    if (!m || !img) return;
    img.src = s;
    document.getElementById('lbCat').textContent = c || '';
    document.getElementById('lbTitle').textContent = t || '';
    m.style.display = 'flex';
    setTimeout(function () {
      m.style.opacity = '1';
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  window.closeLB = function (e) {
    var m = document.getElementById('imgLB');
    if (!m) return;
    if (!e || e.target === m || e.target.classList.contains('lb-x')) {
      m.style.opacity = '0';
      setTimeout(function () {
        m.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    }
  };

  function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        var f = btn.dataset.filter;
        if (f === 'all') {
          document.querySelectorAll('.pf-section').forEach(function (s) {
            s.style.display = '';
          });
        } else {
          document.querySelectorAll('.pf-section').forEach(function (s) {
            s.style.display = s.dataset.section === f ? '' : 'none';
          });
        }
      });
    });
  }

  function initYtThumbs() {
    document.querySelectorAll('img[data-yt-id]').forEach(function (img) {
      var id = img.getAttribute('data-yt-id');
      if (!id) return;
      img.src =
        'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
      img.onerror = function () {
        img.onerror = null;
        img.src = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
      };
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLB();
      closeVid();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initFilters();
      initYtThumbs();
    });
  } else {
    initFilters();
    initYtThumbs();
  }
})();
