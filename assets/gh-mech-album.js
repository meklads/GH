/**
 * Mechanical System video album — stage + filmstrip.
 */
(function () {
  'use strict';

  var ROOT = 'assets/projects/maquettes/Mechanism/';
  var FILMS = [
    {
      id: 'sweedy',
      src: ROOT + 'mech-sweedy-factory.mp4',
      poster: ROOT + 'mech-sweedy-factory-poster.jpg',
      title: { ar: 'مصنع السويدي', en: 'Sweedy Factory' },
      tag: { ar: 'آلية صناعية', en: 'Industrial mechanism' },
    },
    {
      id: 'mall',
      src: ROOT + 'mech-mall.mp4',
      poster: ROOT + 'mech-mall-poster.jpg',
      title: { ar: 'مجمع تجاري', en: 'Commercial Mall' },
      tag: { ar: 'حركة متعددة الطبقات', en: 'Multi-layer motion' },
    },
    {
      id: 'tower',
      src: ROOT + 'mech-tower.mp4',
      poster: ROOT + 'mech-tower-poster.jpg',
      title: { ar: 'برج', en: 'Tower' },
      tag: { ar: 'كتلة رأسية متحركة', en: 'Vertical kinetic mass' },
    },
    {
      id: 'villa1',
      src: ROOT + 'mech-villa-01.mp4',
      poster: ROOT + 'mech-villa-01-poster.jpg',
      title: { ar: 'فيلا 01', en: 'Villa 01' },
      tag: { ar: 'تفاصيل سكنية', en: 'Residential detail' },
    },
    {
      id: 'villa2',
      src: ROOT + 'mech-villa-02.mp4',
      poster: ROOT + 'mech-villa-02-poster.jpg',
      title: { ar: 'فيلا 02', en: 'Villa 02' },
      tag: { ar: 'إيقاع الواجهة', en: 'Façade rhythm' },
    },
    {
      id: 'lighting',
      src: ROOT + 'lighting-action.mp4',
      poster: ROOT + 'lighting-action-poster.jpg',
      title: { ar: 'إضاءة تفاعلية', en: 'Lighting Action' },
      tag: { ar: 'مشاهد ليلية ونهارية', en: 'Day / night cues' },
    },
  ];

  var lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  var stage = document.getElementById('ghMechStage');
  var video = document.getElementById('ghMechVideo');
  var titleEl = document.getElementById('ghMechTitle');
  var tagEl = document.getElementById('ghMechTag');
  var strip = document.getElementById('ghMechStrip');
  var playBtn = document.getElementById('ghMechPlay');
  if (!video || !strip) return;

  var active = 0;

  function L(obj) {
    return (obj && (obj[lang] || obj.en)) || '';
  }

  function setFilm(index, autoplay) {
    var film = FILMS[index];
    if (!film) return;
    active = index;
    video.pause();
    video.setAttribute('poster', film.poster);
    video.src = film.src;
    video.load();
    if (titleEl) titleEl.textContent = L(film.title);
    if (tagEl) tagEl.textContent = L(film.tag);
    strip.querySelectorAll('.gh-mech-thumb').forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === index);
      btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
    if (autoplay) {
      video.muted = true;
      video.play().catch(function () {});
    }
    updatePlayUi();
  }

  function updatePlayUi() {
    if (!playBtn) return;
    var playing = !video.paused && !video.ended;
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute(
      'aria-label',
      playing ? (lang === 'en' ? 'Pause' : 'إيقاف') : lang === 'en' ? 'Play' : 'تشغيل'
    );
  }

  strip.innerHTML = FILMS.map(function (film, i) {
    return (
      '<button type="button" class="gh-mech-thumb' +
      (i === 0 ? ' is-active' : '') +
      '" data-i="' +
      i +
      '" aria-pressed="' +
      (i === 0 ? 'true' : 'false') +
      '">' +
      '<span class="gh-mech-thumb__media"><img src="' +
      film.poster +
      '" alt="" loading="lazy" width="320" height="180"></span>' +
      '<span class="gh-mech-thumb__meta"><strong>' +
      L(film.title) +
      '</strong><em>' +
      L(film.tag) +
      '</em></span>' +
      '</button>'
    );
  }).join('');

  strip.addEventListener('click', function (e) {
    var btn = e.target.closest('.gh-mech-thumb');
    if (!btn) return;
    setFilm(Number(btn.getAttribute('data-i')), true);
  });

  if (playBtn) {
    playBtn.addEventListener('click', function () {
      if (video.paused) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
      updatePlayUi();
    });
  }

  video.addEventListener('play', updatePlayUi);
  video.addEventListener('pause', updatePlayUi);
  video.addEventListener('ended', updatePlayUi);

  if (stage) {
    stage.addEventListener('click', function (e) {
      if (e.target.closest('.gh-mech-thumb') || e.target.closest('.gh-mech-play')) return;
      if (video.paused) video.play().catch(function () {});
      else video.pause();
      updatePlayUi();
    });
  }

  // Default: Sweedy Factory
  setFilm(0, true);
})();
