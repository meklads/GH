/* GH shared video popup — YouTube + local MP4. Closes via ✕, Esc, or click outside. */
(function () {
  if (window.__ghVideoModal) return;
  window.__ghVideoModal = true;

  var css = '' +
    '#ghVm{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}' +
    '#ghVm.active{opacity:1;visibility:visible}' +
    '#ghVm .ghvm-close{position:absolute;top:20px;right:20px;width:46px;height:46px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:20px;line-height:1;cursor:pointer;z-index:2}' +
    '#ghVm .ghvm-close:hover{background:rgba(255,255,255,.25)}' +
    '#ghVm .ghvm-inner{width:92%;max-width:1100px}' +
    '#ghVm .ghvm-box{position:relative;padding-bottom:56.25%;background:#000;border-radius:6px;overflow:hidden}' +
    '#ghVm .ghvm-box iframe,#ghVm .ghvm-box video{position:absolute;inset:0;width:100%;height:100%;border:0;background:#000}';

  var modal, box;

  function build() {
    if (modal) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    modal = document.createElement('div');
    modal.id = 'ghVm';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = '<button type="button" class="ghvm-close" aria-label="Close / إغلاق">✕</button>' +
      '<div class="ghvm-inner"><div class="ghvm-box"></div></div>';
    box = modal.querySelector('.ghvm-box');
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('ghvm-inner') || e.target.classList.contains('ghvm-close')) closeVideo();
    });
    document.body.appendChild(modal);
  }

  function open(el) {
    build();
    box.innerHTML = '';
    box.appendChild(el);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function playVideo(id, start) {
    var src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    if (start) src += '&start=' + start;
    var f = document.createElement('iframe');
    f.src = src;
    f.title = 'YouTube video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    open(f);
  }

  function playLocalVideo(src) {
    var v = document.createElement('video');
    v.controls = true;
    v.autoplay = true;
    v.setAttribute('playsinline', '');
    v.src = src;
    open(v);
  }

  function closeVideo() {
    if (!modal) return;
    modal.classList.remove('active');
    box.innerHTML = '';
    document.body.style.overflow = '';
  }

  window.playVideo = playVideo;
  window.playLocalVideo = playLocalVideo;
  window.closeVideo = closeVideo;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeVideo();
  });

  function init() {
    document.querySelectorAll('.gallery-video').forEach(function (item) {
      var src = item.getAttribute('data-video');
      var v = item.querySelector('video');
      if (v && src && !v.querySelector('source')) {
        var s = document.createElement('source');
        s.src = src; s.type = 'video/mp4';
        v.appendChild(s);
      }
      if (v) {
        item.addEventListener('mouseenter', function () { v.setAttribute('preload', 'auto'); v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
        item.addEventListener('mouseleave', function () { v.pause(); });
      }
      if (src) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () { playLocalVideo(src); });
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
