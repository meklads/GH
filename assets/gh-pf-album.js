/** Viewer gallery (main + thumbs) + lightbox with corner GH mark. */
(function () {
  'use strict';

  var LOGO_SRC = '/assets/logo-gold.png';

  function watermarkHtml() {
    return (
      '<span class="gh-wm" aria-hidden="true">' +
      '<img src="' +
      LOGO_SRC +
      '" alt="" width="120" height="36" decoding="async">' +
      '</span>'
    );
  }

  function ensureLightbox() {
    var box = document.getElementById('ghAlbumLightbox');
    if (box) return box;
    box = document.createElement('div');
    box.id = 'ghAlbumLightbox';
    box.className = 'gh-album-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML =
      '<button type="button" class="gh-album-lightbox__close" data-gh-album-close aria-label="Close">&times;</button>' +
      '<div class="gh-album-lightbox__frame">' +
      '<img data-gh-lb-img src="" alt="">' +
      watermarkHtml() +
      '</div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.hasAttribute('data-gh-album-close')) closeLightbox();
    });
    return box;
  }

  function openLightbox(src, alt) {
    if (!src) return;
    var box = ensureLightbox();
    var img = box.querySelector('[data-gh-lb-img]');
    img.src = src;
    img.alt = alt || '';
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    var box = document.getElementById('ghAlbumLightbox');
    if (!box) return;
    box.classList.remove('is-open');
    var img = box.querySelector('[data-gh-lb-img]');
    if (img) img.removeAttribute('src');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  function pictureHtml(src, webp, alt) {
    var img =
      '<img src="' +
      src +
      '" alt="' +
      (alt || '') +
      '" decoding="async">';
    if (webp) {
      return '<picture><source srcset="' + webp + '" type="image/webp">' + img + '</picture>';
    }
    return img;
  }

  function ensureStageMark(stage) {
    if (!stage || stage.querySelector('.gh-wm')) return;
    stage.insertAdjacentHTML('beforeend', watermarkHtml());
  }

  function initViewer(root) {
    if (root.getAttribute('data-gh-vg-ready')) return;
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-gh-vg-thumb]'));
    var mainBtn = root.querySelector('[data-gh-vg-main]');
    var mainSlot = root.querySelector('[data-gh-vg-slot]');
    var stage = root.querySelector('.gh-vg__stage');
    if (!thumbs.length || !mainBtn || !mainSlot) return;

    ensureStageMark(stage);

    var index = Math.max(
      0,
      thumbs.findIndex(function (t) {
        return t.classList.contains('is-active');
      })
    );

    function show(i) {
      if (i < 0) i = thumbs.length - 1;
      if (i >= thumbs.length) i = 0;
      index = i;
      var thumb = thumbs[index];
      var full = thumb.getAttribute('data-full') || '';
      var webp = thumb.getAttribute('data-webp') || '';
      var alt = thumb.getAttribute('data-alt') || '';
      thumbs.forEach(function (t, n) {
        var on = n === index;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      mainSlot.innerHTML = pictureHtml(full, webp, alt);
      mainBtn.setAttribute('data-gh-album-full', full);
      mainBtn.setAttribute('data-gh-album-alt', alt);
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        show(i);
      });
    });

    var prev = root.querySelector('[data-gh-vg-prev]');
    var next = root.querySelector('[data-gh-vg-next]');
    if (prev) prev.addEventListener('click', function () { show(index - 1); });
    if (next) next.addEventListener('click', function () { show(index + 1); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        show(index + (document.documentElement.dir === 'rtl' ? 1 : -1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        show(index + (document.documentElement.dir === 'rtl' ? -1 : 1));
      }
    });

    show(index);
    root.setAttribute('data-gh-vg-ready', '1');
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-gh-album-full]');
    if (!btn) return;
    if (btn.hasAttribute('data-gh-vg-thumb')) return;
    e.preventDefault();
    openLightbox(btn.getAttribute('data-gh-album-full'), btn.getAttribute('data-gh-album-alt') || '');
  });

  document.querySelectorAll('[data-gh-viewer-gallery]').forEach(initViewer);

  document.querySelectorAll('[data-gh-album-track]').forEach(function (track) {
    if (track.getAttribute('data-gh-album-ready')) return;
    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;
    items.forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    track.setAttribute('data-gh-album-ready', '1');
  });
})();
