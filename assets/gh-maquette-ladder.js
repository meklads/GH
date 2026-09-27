/**
 * Maquette ladder — type picker + proof stage on services/maquettes.
 */
(function () {
  'use strict';

  var root = document.getElementById('ghMqLadder');
  if (!root) return;

  var lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  var PREFIX = root.getAttribute('data-prefix') || '../';

  var TYPES = [
    {
      id: 'classic',
      formValue: 'classic',
      num: '01',
      name: { ar: 'كلاسيكي', en: 'Classic' },
      fit: {
        ar: 'للاعتمادات واجتماعات المستثمرين — مجسم دقيق بدون أنظمة رقمية.',
        en: 'For approvals and investor meetings — precise model without digital systems.',
      },
      proof: {
        title: { ar: 'مجسم عرض دقيق', en: 'Precision display model' },
        tag: { ar: 'كلاسيكي · صالة واجتماعات', en: 'Classic · gallery & meetings' },
        src: PREFIX + 'assets/projects/maquettes/anan-eskan-maquette-01.webp',
        fallback: PREFIX + 'assets/projects/maquettes/anan-eskan-maquette-01.jpeg',
        kind: 'image',
      },
    },
    {
      id: 'smart',
      formValue: 'smart-maquette',
      num: '02',
      name: { ar: 'ذكي', en: 'Smart' },
      fit: {
        ar: 'لصالة البيع — إضاءة وبيانات وشاشات تعمل مع فريق المبيعات.',
        en: 'For the sales gallery — lighting, data, and screens for the sales team.',
      },
      proof: {
        title: { ar: 'مجسم ذكي لصالة البيع', en: 'Smart maquette for the sales gallery' },
        tag: { ar: 'ذكي · حضور كامل', en: 'Smart · full presence' },
        src: PREFIX + 'assets/videos/scale-model-maquette-mobile.mp4',
        poster: PREFIX + 'assets/videos/scale-model-maquette-poster.jpg',
        kind: 'video',
      },
    },
    {
      id: 'kinetic',
      formValue: 'kinetic',
      num: '03',
      name: { ar: 'حركي', en: 'Kinetic' },
      fit: {
        ar: 'للإطلاق والقصة — طبقات وآليات تتحرك مع مراحل المشروع.',
        en: 'For launch storytelling — layers and mechanisms that move with the project.',
      },
      proof: {
        title: { ar: 'آلية صناعية متحركة', en: 'Moving industrial mechanism' },
        tag: { ar: 'حركي · قصة الإطلاق', en: 'Kinetic · launch story' },
        src: PREFIX + 'assets/projects/maquettes/Mechanism/mech-sweedy-factory-mobile.mp4',
        poster: PREFIX + 'assets/projects/maquettes/Mechanism/mech-sweedy-factory-poster.jpg',
        kind: 'video',
      },
    },
    {
      id: 'floor',
      formValue: 'floor-furnish',
      num: '04',
      name: { ar: 'فرش أدوار', en: 'Floor furnish' },
      fit: {
        ar: 'لإقناع المشتري بالوحدة والتشطيب — تفاصيل داخل الأدوار.',
        en: 'To sell the unit and finishes — interior detail by floor.',
      },
      proof: {
        title: { ar: 'فرش الدور داخل المجسم', en: 'Floor furnish inside the model' },
        tag: { ar: 'فرش · مقياس حي', en: 'Furnish · living scale' },
        src: PREFIX + 'assets/projects/maquettes/floor-furnish/ma2.webp',
        fallback: PREFIX + 'assets/projects/maquettes/floor-furnish/ma2.jpg',
        kind: 'image',
      },
    },
  ];

  function t(obj) {
    return (obj && (obj[lang] || obj.en || obj.ar)) || '';
  }

  var cardsHost = root.querySelector('[data-mq-cards]');
  var stage = root.querySelector('[data-mq-stage]');
  var stageTitle = root.querySelector('[data-mq-stage-title]');
  var stageTag = root.querySelector('[data-mq-stage-tag]');
  var chipsHost = root.querySelector('[data-mq-chips]');
  var quoteBtn = root.querySelector('[data-mq-quote]');
  var waBtn = root.querySelector('[data-mq-wa]');
  var formSelect = document.querySelector('#booking select[name="service"]');
  var active = 'smart';

  function setProof(type) {
    var p = type.proof;
    if (!stage || !p) return;
    if (p.kind === 'video') {
      stage.innerHTML =
        '<video class="gh-mq-media" autoplay muted playsinline loop preload="metadata" poster="' +
        (p.poster || '') +
        '"><source src="' +
        p.src +
        '" type="video/mp4"></video>';
    } else {
      stage.innerHTML =
        '<img class="gh-mq-media" src="' +
        p.src +
        '" alt="' +
        t(p.title) +
        '" width="960" height="600" decoding="async" onerror="this.onerror=null;this.src=\'' +
        (p.fallback || p.src) +
        '\'">';
    }
    if (stageTitle) stageTitle.textContent = t(p.title);
    if (stageTag) stageTag.textContent = t(p.tag);
  }

  function waHref(type) {
    var phone = '966502786513';
    var text =
      lang === 'ar'
        ? 'مرحباً، أود عرض سعر لمجسم معماري من نوع: ' + t(type.name) + '\n' + t(type.fit)
        : 'Hello — I would like a quote for an architectural maquette type: ' +
          t(type.name) +
          '\n' +
          t(type.fit);
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
  }

  function selectType(id, scrollForm) {
    var type = TYPES.find(function (x) {
      return x.id === id;
    });
    if (!type) return;
    active = id;
    root.querySelectorAll('.gh-mq-card').forEach(function (btn) {
      btn.classList.toggle('is-on', btn.getAttribute('data-mq-type') === id);
    });
    root.querySelectorAll('.gh-mq-chip').forEach(function (btn) {
      btn.classList.toggle('is-on', btn.getAttribute('data-mq-type') === id);
    });
    setProof(type);
    if (waBtn) waBtn.href = waHref(type);
    if (formSelect) {
      formSelect.value = type.formValue;
      if (!formSelect.value) {
        var opt = document.createElement('option');
        opt.value = type.formValue;
        opt.textContent = t(type.name);
        formSelect.appendChild(opt);
        formSelect.value = type.formValue;
      }
    }
    if (scrollForm) {
      var booking = document.getElementById('booking');
      if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (window.ghTrack) {
      try {
        window.ghTrack('maquette_type_select', { type: id });
      } catch (e) {}
    }
  }

  if (cardsHost) {
    cardsHost.innerHTML = TYPES.map(function (type) {
      return (
        '<button type="button" class="gh-mq-card" data-mq-type="' +
        type.id +
        '" aria-pressed="false">' +
        '<span class="gh-mq-card__num">' +
        type.num +
        '</span>' +
        '<h3 class="gh-mq-card__name">' +
        t(type.name) +
        '</h3>' +
        '<p class="gh-mq-card__fit">' +
        t(type.fit) +
        '</p>' +
        '<span class="gh-mq-card__cta">' +
        (lang === 'ar' ? 'اختر هذا النوع ←' : 'Choose this type →') +
        '</span></button>'
      );
    }).join('');
    cardsHost.querySelectorAll('.gh-mq-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectType(btn.getAttribute('data-mq-type'), false);
      });
    });
  }

  if (chipsHost) {
    chipsHost.innerHTML = TYPES.map(function (type) {
      return (
        '<button type="button" class="gh-mq-chip" data-mq-type="' +
        type.id +
        '">' +
        t(type.name) +
        '</button>'
      );
    }).join('');
    chipsHost.querySelectorAll('.gh-mq-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectType(btn.getAttribute('data-mq-type'), false);
      });
    });
  }

  if (quoteBtn) {
    quoteBtn.addEventListener('click', function (e) {
      e.preventDefault();
      selectType(active, true);
    });
  }

  // Ensure form options include ladder values
  if (formSelect) {
    var needed = [
      { v: 'classic', ar: 'مجسم كلاسيكي', en: 'Classic maquette' },
      { v: 'smart-maquette', ar: 'مجسم ذكي', en: 'Smart maquette' },
      { v: 'kinetic', ar: 'مجسم حركي / ميكانيكي', en: 'Kinetic / mechanical' },
      { v: 'floor-furnish', ar: 'فرش أدوار', en: 'Floor furnish' },
      { v: 'unsure', ar: 'لست متأكداً — رشّحوني', en: 'Not sure — recommend for me' },
    ];
    var existing = {};
    Array.prototype.forEach.call(formSelect.options, function (o) {
      existing[o.value] = true;
    });
    // Replace options cleanly
    formSelect.innerHTML =
      '<option value="">' +
      (lang === 'ar' ? 'اختر النوع' : 'Select type') +
      '</option>' +
      needed
        .map(function (o) {
          return (
            '<option value="' +
            o.v +
            '">' +
            (lang === 'ar' ? o.ar : o.en) +
            '</option>'
          );
        })
        .join('');
  }

  selectType('smart', false);
})();
