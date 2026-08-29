/** Scrolling album strip + lightbox (homepage pf-album pattern). */
(function () {
  'use strict';

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
      '<img src="" alt="">';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.hasAttribute('data-gh-album-close')) closeLightbox();
    });
    return box;
  }

  function openLightbox(src, alt) {
    if (!src) return;
    var box = ensureLightbox();
    var img = box.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    var box = document.getElementById('ghAlbumLightbox');
    if (!box) return;
    box.classList.remove('is-open');
    var img = box.querySelector('img');
    if (img) img.removeAttribute('src');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-gh-album-full]');
    if (!btn) return;
    e.preventDefault();
    openLightbox(btn.getAttribute('data-gh-album-full'), btn.getAttribute('data-gh-album-alt') || '');
  });

  document.querySelectorAll('[data-gh-album-track]').forEach(function (track) {
    if (track.getAttribute('data-gh-album-ready')) return;
    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;
    items.forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('[id]').forEach(function (el) {
        el.removeAttribute('id');
      });
      track.appendChild(clone);
    });
    track.setAttribute('data-gh-album-ready', '1');
  });
})();
