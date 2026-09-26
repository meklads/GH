/**
 * GH Direct — catalog + package configurator
 */
(function () {
  'use strict';

  var DATA = window.GH_DIRECT;
  if (!DATA) return;

  /* Soft gate when hosted under Client Hub draft URLs */
  var hubGate = document.body && document.body.getAttribute('data-ghd-hub-gate') === '1';
  if (hubGate && sessionStorage.getItem('gh_client_hub_ok_v1') !== '1') {
    var hubUrl = document.body.getAttribute('data-ghd-hub-url') || 'client-hub.html';
    location.replace(hubUrl);
    return;
  }

  var FORMS = window.GH_FORMS || {};
  var CFG = window.GH_QUOTE_FORM || {};
  var TURNSTILE_KEY = CFG.turnstileSiteKey || '';
  var turnstileQueue = [];

  var root = document.documentElement;
  var lang = (root.getAttribute('lang') || 'ar').slice(0, 2) === 'en' ? 'en' : 'ar';
  var dir = root.getAttribute('dir') || (lang === 'ar' ? 'rtl' : 'ltr');
  var ui = DATA.ui[lang];
  var currency = DATA.currency[lang];
  var assetPrefix = document.body.getAttribute('data-ghd-prefix') || '';

  function loadTurnstile(cb) {
    if (window.turnstile) {
      cb();
      return;
    }
    turnstileQueue.push(cb);
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) return;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = function () {
      turnstileQueue.splice(0).forEach(function (fn) {
        fn();
      });
    };
    document.head.appendChild(s);
  }

  function ensureLeadSecurity(form) {
    if (!form || form.querySelector('.gh-form-security')) return;
    var wrap = document.createElement('div');
    wrap.className = 'gh-form-security';
    wrap.innerHTML =
      '<div class="gh-honeypot" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0">' +
      '<label>Leave blank</label>' +
      '<input type="text" name="botcheck" tabindex="-1" autocomplete="off">' +
      '</div>' +
      '<div class="gh-turnstile" style="min-height:65px;margin:8px 0"></div>';
    var actions = form.querySelector('.ghd-form-actions');
    if (actions) form.insertBefore(wrap, actions);
    else form.appendChild(wrap);
  }

  function renderLeadTurnstile(form) {
    if (!TURNSTILE_KEY || !form) return;
    var box = form.querySelector('.gh-turnstile');
    if (!box || box.dataset.rendered === '1') return;
    loadTurnstile(function () {
      if (!window.turnstile || box.dataset.rendered === '1') return;
      var id = window.turnstile.render(box, {
        sitekey: TURNSTILE_KEY,
        theme: 'light',
        language: lang === 'ar' ? 'ar' : 'en',
      });
      box.dataset.rendered = '1';
      box.dataset.widgetId = String(id);
    });
  }

  function turnstileToken(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return '';
    try {
      return window.turnstile.getResponse(box.dataset.widgetId) || '';
    } catch (e) {
      return '';
    }
  }

  function resetTurnstile(form) {
    var box = form.querySelector('.gh-turnstile');
    if (!box || !box.dataset.widgetId || !window.turnstile) return;
    try {
      window.turnstile.reset(box.dataset.widgetId);
    } catch (e) {}
  }

  /** @type {Record<string, Set<string>>} */
  var addonState = {};
  DATA.packages.forEach(function (pkg) {
    addonState[pkg.id] = new Set();
  });

  var serviceById = {};
  DATA.services.forEach(function (s) {
    serviceById[s.id] = s;
  });

  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.ar || obj.en || '';
  }

  function formatNum(n) {
    try {
      return new Intl.NumberFormat('en-US', { numberingSystem: 'latn' }).format(n);
    } catch (e) {
      try {
        return new Intl.NumberFormat('en-US').format(n);
      } catch (e2) {
        return String(n);
      }
    }
  }

  function mediaMarkup(svc, opts) {
    opts = opts || {};
    var m = svc && svc.media;
    var src = mediaUrl(m && m.src);
    var poster = mediaUrl(m && m.poster);
    var ph =
      m && m.placeholder
        ? '<span class="ghd-ph-badge">[PLACEHOLDER]</span>'
        : '';
    if (m && m.type === 'video' && src) {
      return (
        ph +
        '<video class="ghd-media-el" src="' +
        escapeAttr(src) +
        '"' +
        (poster ? ' poster="' + escapeAttr(poster) + '"' : '') +
        ' muted loop playsinline preload="metadata"' +
        (opts.autoplay ? ' autoplay' : '') +
        '></video>'
      );
    }
    return (
      ph +
      '<img class="ghd-media-el" src="' +
      escapeAttr(src) +
      '" alt="" loading="lazy" decoding="async" width="640" height="400">'
    );
  }

  function unitSuffix(unit) {
    if (unit === 'image') return ' ' + ui.perImage;
    if (unit === 'month') return ' ' + ui.perMonth;
    if (unit === 'day') return ' ' + ui.perDay;
    if (unit === 'area') return ' ' + ui.byArea;
    return '';
  }

  function priceText(svc) {
    if (svc.price == null || svc.priceLabel === 'contact') {
      return ui.contactPrice;
    }
    var base = ui.from + ' ' + formatNum(svc.price) + ' ' + currency;
    return base + unitSuffix(svc.unit);
  }

  function mediaUrl(src) {
    if (!src) return '';
    if (/^https?:\/\//i.test(src) || src.charAt(0) === '/') return src;
    return assetPrefix + src;
  }

  /* ---------- Enterprise strip ---------- */
  function renderEnterprise() {
    var el = document.getElementById('ghd-enterprise');
    if (!el) return;
    var e = DATA.enterprise[lang];
    el.innerHTML =
      '<div class="ghd-wrap ghd-enterprise-inner">' +
      '<div><p class="ghd-enterprise-label">' +
      escapeHtml(e.label) +
      '</p><p>' +
      escapeHtml(e.text) +
      '</p></div>' +
      '<a class="ghd-enterprise-cta" href="' +
      escapeAttr(assetPrefix + e.href) +
      '">' +
      escapeHtml(e.cta) +
      ' <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">arrow_forward</span></a>' +
      '</div>';
  }

  /* ---------- Hero copy ---------- */
  function renderHero() {
    var h1 = document.getElementById('ghd-title');
    var brand = document.getElementById('ghd-brand');
    var lead = document.getElementById('ghd-lead');
    var eye = document.getElementById('ghd-eyebrow');
    if (eye) eye.textContent = ui.pageEyebrow;
    if (h1) h1.textContent = ui.pageTitle;
    if (brand) brand.textContent = ui.pageBrand;
    if (lead) lead.textContent = ui.pageLead;
    var catH = document.getElementById('ghd-catalog-title');
    var catL = document.getElementById('ghd-catalog-lead');
    var pkgH = document.getElementById('ghd-packages-title');
    var pkgL = document.getElementById('ghd-packages-lead');
    if (catH) catH.textContent = ui.catalogTitle;
    if (catL) catL.textContent = ui.catalogLead;
    if (pkgH) pkgH.textContent = ui.packagesTitle;
    if (pkgL) pkgL.textContent = ui.packagesLead;
  }

  /* ---------- Catalog ---------- */
  function renderCatalog() {
    var grid = document.getElementById('ghd-catalog');
    if (!grid) return;
    grid.innerHTML = '';
    DATA.services.forEach(function (svc, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ghd-svc-card';
      btn.setAttribute('data-service-id', svc.id);
      btn.setAttribute('aria-haspopup', 'dialog');
      var num = String(idx + 1).padStart(2, '0');
      var unpriced = svc.price == null || svc.priceLabel === 'contact';
      btn.innerHTML =
        '<div class="ghd-svc-media">' +
        mediaMarkup(svc, { autoplay: true }) +
        '<span class="ghd-svc-num" aria-hidden="true">' +
        num +
        '</span></div>' +
        '<div class="ghd-svc-body">' +
        '<h3>' +
        escapeHtml(t(svc.name)) +
        '</h3>' +
        '<div class="ghd-price' +
        (unpriced ? ' ghd-price-contact' : '') +
        '">' +
        escapeHtml(priceText(svc)) +
        '</div></div>';
      btn.addEventListener('click', function () {
        openServiceModal(svc.id);
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Packages ---------- */
  function isBuilder(pkg) {
    return pkg && pkg.mode === 'builder';
  }

  function addonIdsFor(pkg) {
    if (isBuilder(pkg)) {
      return DATA.services.map(function (s) {
        return s.id;
      });
    }
    var excluded = new Set(pkg.includedServiceIds || []);
    return DATA.services
      .filter(function (s) {
        return !excluded.has(s.id);
      })
      .map(function (s) {
        return s.id;
      });
  }

  function computeTotal(pkg) {
    var priced = isBuilder(pkg) ? 0 : Number(pkg.price) || 0;
    var unpriced = [];
    var selected = addonState[pkg.id];
    selected.forEach(function (id) {
      var svc = serviceById[id];
      if (!svc) return;
      if (svc.price == null || typeof svc.price !== 'number' || isNaN(svc.price) || svc.priceLabel === 'contact') {
        unpriced.push(svc);
      } else {
        priced += svc.price;
      }
    });
    return { priced: priced, unpriced: unpriced };
  }

  function addonRowHtml(pkg, id) {
    var svc = serviceById[id];
    if (!svc) return '';
    var on = addonState[pkg.id].has(id);
    var unpriced = svc.price == null || svc.priceLabel === 'contact';
    var meta = unpriced ? ui.unpricedNote : formatNum(svc.price) + ' ' + currency;
    return (
      '<button type="button" class="ghd-addon' +
      (on ? ' is-on' : '') +
      (unpriced ? ' ghd-addon--contact' : '') +
      '" data-addon="' +
      escapeAttr(id) +
      '" data-pkg="' +
      escapeAttr(pkg.id) +
      '" aria-pressed="' +
      (on ? 'true' : 'false') +
      '">' +
      '<span class="ghd-addon-name">' +
      escapeHtml(t(svc.name)) +
      '</span>' +
      '<span class="ghd-addon-meta">' +
      escapeHtml(meta) +
      '</span>' +
      '<span class="ghd-addon-toggle">' +
      escapeHtml(on ? ui.added : ui.add) +
      '</span></button>'
    );
  }

  function totalBoxHtml(pkg, tot) {
    var empty =
      isBuilder(pkg) && addonState[pkg.id].size === 0
        ? '<p class="ghd-total-empty">' + escapeHtml(ui.emptyBuilder) + '</p>'
        : '';
    var extraLis = tot.unpriced
      .map(function (s) {
        return (
          '<li>+ ' +
          escapeHtml(t(s.name)) +
          ' — ' +
          escapeHtml(ui.unpricedLine) +
          '</li>'
        );
      })
      .join('');
    var value =
      isBuilder(pkg) && addonState[pkg.id].size === 0
        ? '—'
        : formatNum(tot.priced) + ' ' + currency;
    return (
      '<div class="ghd-total-box" data-total-for="' +
      escapeAttr(pkg.id) +
      '">' +
      '<p class="ghd-total-label">' +
      escapeHtml(ui.total) +
      '</p>' +
      '<p class="ghd-total-value">' +
      escapeHtml(value) +
      '</p>' +
      empty +
      (extraLis ? '<ul class="ghd-total-extra">' + extraLis + '</ul>' : '') +
      '<p class="ghd-total-hint">' +
      escapeHtml(ui.totalNote) +
      '</p></div>'
    );
  }

  function renderPackages() {
    var host = document.getElementById('ghd-packages');
    if (!host) return;
    host.innerHTML = '';
    DATA.packages.forEach(function (pkg) {
      var card = document.createElement('article');
      var builder = isBuilder(pkg);
      card.className =
        'ghd-pkg' +
        (pkg.featured ? ' ghd-pkg--featured' : '') +
        (builder ? ' ghd-pkg--builder' : ' ghd-pkg--bundle');
      card.setAttribute('data-package-id', pkg.id);

      var badge = builder
        ? '<span class="ghd-pkg-badge">' + escapeHtml(ui.builderBadge) + '</span>'
        : pkg.featured
          ? '<span class="ghd-pkg-badge">' + escapeHtml(ui.mostPopular) + '</span>'
          : '';

      var tagline = pkg.tagline
        ? '<p class="ghd-pkg-tagline">' + escapeHtml(t(pkg.tagline)) + '</p>'
        : '';

      var lines = '';
      if (!builder && pkg.includedLines && pkg.includedLines.length) {
        lines =
          '<p class="ghd-pkg-note">' +
          escapeHtml(ui.included) +
          '</p><ul class="ghd-list" aria-label="' +
          escapeAttr(ui.included) +
          '">' +
          pkg.includedLines
            .map(function (line) {
              return (
                '<li><span class="material-symbols-outlined ghd-check" aria-hidden="true">check</span><span>' +
                escapeHtml(t(line)) +
                '</span></li>'
              );
            })
            .join('') +
          '</ul>';
      }

      var basePrice = builder
        ? '<p class="ghd-pkg-base ghd-pkg-base--live">' +
          escapeHtml(lang === 'ar' ? 'سعّر حسب اختيارك' : 'Priced by your picks') +
          '</p>'
        : '<p class="ghd-pkg-base">' +
          escapeHtml(ui.from + ' ' + formatNum(pkg.price) + ' ' + currency) +
          '</p>';

      var addonHtml = addonIdsFor(pkg)
        .map(function (id) {
          return addonRowHtml(pkg, id);
        })
        .join('');

      var tot = computeTotal(pkg);
      var addonsLabel = builder ? ui.buildLabel : ui.add;

      card.innerHTML =
        badge +
        '<header class="ghd-pkg-head">' +
        '<h3>' +
        escapeHtml(t(pkg.name)) +
        '</h3>' +
        tagline +
        basePrice +
        '</header>' +
        lines +
        '<p class="ghd-addons-label">' +
        escapeHtml(addonsLabel) +
        '</p>' +
        '<div class="ghd-addons' +
        (builder ? ' ghd-addons--grid' : '') +
        '" data-addons-for="' +
        escapeAttr(pkg.id) +
        '">' +
        addonHtml +
        '</div>' +
        totalBoxHtml(pkg, tot) +
        '<button type="button" class="ghd-cta" data-lead-pkg="' +
        escapeAttr(pkg.id) +
        '">' +
        escapeHtml(ui.cta) +
        '</button>';

      host.appendChild(card);
    });

    host.querySelectorAll('.ghd-addon').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pkgId = btn.getAttribute('data-pkg');
        var id = btn.getAttribute('data-addon');
        if (!pkgId || !id) return;
        var set = addonState[pkgId];
        if (set.has(id)) set.delete(id);
        else set.add(id);
        updatePackageUI(pkgId);
      });
    });

    host.querySelectorAll('[data-lead-pkg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLeadModal(btn.getAttribute('data-lead-pkg'));
      });
    });
  }

  function updatePackageUI(pkgId) {
    var pkg = DATA.packages.find(function (p) {
      return p.id === pkgId;
    });
    if (!pkg) return;
    var card = document.querySelector('.ghd-pkg[data-package-id="' + pkgId + '"]');
    if (!card) return;

    card.querySelectorAll('.ghd-addon').forEach(function (btn) {
      var id = btn.getAttribute('data-addon');
      var on = addonState[pkgId].has(id);
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var toggle = btn.querySelector('.ghd-addon-toggle');
      if (toggle) toggle.textContent = on ? ui.added : ui.add;
    });

    var tot = computeTotal(pkg);
    var box = card.querySelector('[data-total-for="' + pkgId + '"]');
    if (!box) return;
    var val = box.querySelector('.ghd-total-value');
    if (val) {
      val.textContent =
        isBuilder(pkg) && addonState[pkgId].size === 0
          ? '—'
          : formatNum(tot.priced) + ' ' + currency;
    }
    var emptyEl = box.querySelector('.ghd-total-empty');
    if (isBuilder(pkg) && addonState[pkgId].size === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('p');
        emptyEl.className = 'ghd-total-empty';
        emptyEl.textContent = ui.emptyBuilder;
        var hint0 = box.querySelector('.ghd-total-hint');
        box.insertBefore(emptyEl, hint0);
      }
    } else if (emptyEl) {
      emptyEl.remove();
    }
    var extra = box.querySelector('.ghd-total-extra');
    if (tot.unpriced.length) {
      if (!extra) {
        extra = document.createElement('ul');
        extra.className = 'ghd-total-extra';
        var hint = box.querySelector('.ghd-total-hint');
        box.insertBefore(extra, hint);
      }
      extra.innerHTML = tot.unpriced
        .map(function (s) {
          return (
            '<li>+ ' +
            escapeHtml(t(s.name)) +
            ' — ' +
            escapeHtml(ui.unpricedLine) +
            '</li>'
          );
        })
        .join('');
    } else if (extra) {
      extra.remove();
    }
  }

  /* ---------- Meeting ---------- */
  function waPhone() {
    var phone =
      FORMS.notifyWhatsApp ||
      (window.GH_FLOAT_CONFIG && window.GH_FLOAT_CONFIG.whatsapp) ||
      '966502786513';
    return String(phone).replace(/\D/g, '');
  }

  function renderMeeting() {
    var host = document.getElementById('ghd-meeting-inner');
    if (!host) return;
    var waHref =
      'https://wa.me/' + waPhone() + '?text=' + encodeURIComponent(ui.meetingWaText);
    host.innerHTML =
      '<div class="ghd-meeting-copy">' +
      '<p class="ghd-meeting-kicker">' +
      escapeHtml(lang === 'ar' ? 'مسار بديل' : 'Alternate path') +
      '</p>' +
      '<h2 id="ghd-meeting-title">' +
      escapeHtml(ui.meetingTitle) +
      '</h2>' +
      '<p class="ghd-meeting-lead">' +
      escapeHtml(ui.meetingLead) +
      '</p></div>' +
      '<div class="ghd-meeting-actions">' +
      '<a class="ghd-meeting-wa" href="' +
      escapeAttr(waHref) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(ui.meetingCtaWa) +
      '</a>' +
      '<button type="button" class="ghd-meeting-form" data-ghd-meeting-form>' +
      escapeHtml(ui.meetingCtaForm) +
      '</button></div>';
    var formBtn = host.querySelector('[data-ghd-meeting-form]');
    if (formBtn) {
      formBtn.addEventListener('click', function () {
        openMeetingLead();
      });
    }
  }

  /* ---------- Modals ---------- */
  var serviceModal = document.getElementById('ghd-service-modal');
  var leadModal = document.getElementById('ghd-lead-modal');
  var lastFocus = null;

  function lockScroll(on) {
    document.body.classList.toggle('ghd-modal-open', !!on);
  }

  function openServiceModal(id) {
    var svc = serviceById[id];
    if (!svc || !serviceModal) return;
    lastFocus = document.activeElement;
    var mediaHost = serviceModal.querySelector('.ghd-modal-media');
    var title = serviceModal.querySelector('[data-ghd-title]');
    var desc = serviceModal.querySelector('[data-ghd-desc]');
    var price = serviceModal.querySelector('[data-ghd-price]');
    var ph = serviceModal.querySelector('[data-ghd-ph]');
    if (mediaHost) {
      mediaHost.innerHTML = mediaMarkup(svc, { autoplay: true });
      var el = mediaHost.querySelector('.ghd-media-el');
      if (el && el.tagName === 'IMG') el.alt = t(svc.name);
      if (el && el.tagName === 'VIDEO') {
        try {
          el.play();
        } catch (e) {}
      }
    }
    if (title) title.textContent = t(svc.name);
    if (desc) desc.textContent = t(svc.description);
    if (price) {
      price.textContent = priceText(svc);
      price.className = 'ghd-price' + (svc.price == null || svc.priceLabel === 'contact' ? ' ghd-price-contact' : '');
    }
    if (ph) {
      ph.textContent = svc.media && svc.media.placeholder ? ui.placeholder : '';
      ph.hidden = !(svc.media && svc.media.placeholder);
    }
    serviceModal.hidden = false;
    lockScroll(true);
    var closeBtn = serviceModal.querySelector('.ghd-modal-close');
    if (closeBtn) closeBtn.focus();
    if (window.ghTrack) {
      try {
        window.ghTrack('gh_direct_service_open', { service_id: id });
      } catch (e) {}
    }
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    var mediaHost = serviceModal.querySelector('.ghd-modal-media');
    if (mediaHost) {
      mediaHost.querySelectorAll('video').forEach(function (v) {
        try {
          v.pause();
        } catch (e) {}
      });
    }
    serviceModal.hidden = true;
    if (!leadModal || leadModal.hidden) lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function selectionSummary(pkgId) {
    if (pkgId === 'meeting') {
      return {
        text: ui.meetingFormTitle + '\n' + ui.meetingFormLead,
        tot: { priced: 0, unpriced: [] },
        addons: [],
        pkg: { name: { ar: ui.meetingFormTitle, en: ui.meetingFormTitle }, price: 0 },
        kind: 'meeting',
      };
    }
    var pkg = DATA.packages.find(function (p) {
      return p.id === pkgId;
    });
    if (!pkg) return { text: '', tot: null, addons: [], kind: 'package' };
    var tot = computeTotal(pkg);
    var names = [];
    addonState[pkgId].forEach(function (id) {
      var s = serviceById[id];
      if (s) names.push(t(s.name));
    });
    var lines = [];
    if (isBuilder(pkg)) {
      lines.push(t(pkg.name));
      if (names.length) {
        lines.push((lang === 'ar' ? 'الخدمات: ' : 'Services: ') + names.join(' · '));
      } else {
        lines.push(ui.emptyBuilder);
      }
    } else {
      lines.push(t(pkg.name) + ' — ' + ui.from + ' ' + formatNum(pkg.price) + ' ' + currency);
      if (names.length) lines.push((lang === 'ar' ? 'إضافات: ' : 'Add-ons: ') + names.join(' · '));
    }
    if (!(isBuilder(pkg) && addonState[pkgId].size === 0)) {
      lines.push(ui.total + ': ' + formatNum(tot.priced) + ' ' + currency);
    }
    tot.unpriced.forEach(function (s) {
      lines.push('+ ' + t(s.name) + ' — ' + ui.unpricedLine);
    });
    return { text: lines.join('\n'), tot: tot, addons: names, pkg: pkg, kind: 'package' };
  }

  function openMeetingLead() {
    openLeadModal('meeting');
  }

  function openLeadModal(pkgId) {
    if (!leadModal) return;
    lastFocus = document.activeElement;
    var summary = selectionSummary(pkgId);
    leadModal.setAttribute('data-lead-pkg', pkgId || '');
    var titleEl = document.getElementById('ghd-lead-title');
    var leadP = leadModal.querySelector('[data-ghd-form-lead]');
    if (summary.kind === 'meeting') {
      if (titleEl) titleEl.textContent = ui.meetingFormTitle;
      if (leadP) leadP.textContent = ui.meetingFormLead;
    } else {
      if (titleEl) titleEl.textContent = ui.formTitle;
      if (leadP) leadP.textContent = ui.formLead;
    }
    var sumEl = leadModal.querySelector('[data-ghd-summary]');
    if (sumEl) sumEl.textContent = summary.text;
    var msg = leadModal.querySelector('[data-ghd-form-msg]');
    if (msg) {
      msg.textContent = '';
      msg.className = 'ghd-form-msg';
    }
    var form = leadModal.querySelector('form');
    if (form) form.reset();
    var hiddenPkg = leadModal.querySelector('[name="package"]');
    var hiddenAddons = leadModal.querySelector('[name="addons"]');
    var hiddenTotal = leadModal.querySelector('[name="estimated_total"]');
    if (hiddenPkg && summary.pkg) hiddenPkg.value = t(summary.pkg.name);
    if (hiddenAddons) hiddenAddons.value = summary.addons.join(', ');
    if (hiddenTotal) {
      if (summary.kind === 'meeting') hiddenTotal.value = '';
      else if (summary.tot) hiddenTotal.value = formatNum(summary.tot.priced) + ' ' + currency;
    }
    updateWaLink(summary);
    ensureLeadSecurity(form);
    renderLeadTurnstile(form);
    leadModal.hidden = false;
    lockScroll(true);
    var first = leadModal.querySelector('input[name="name"]');
    if (first) first.focus();
  }

  function closeLeadModal() {
    if (!leadModal) return;
    leadModal.hidden = true;
    if (!serviceModal || serviceModal.hidden) lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function updateWaLink(summary) {
    var a = leadModal && leadModal.querySelector('[data-ghd-wa]');
    if (!a) return;
    var phone = waPhone();
    var prefix =
      summary && summary.kind === 'meeting'
        ? ui.meetingWaText + '\n\n'
        : lang === 'ar'
          ? 'مرحباً، أود تأكيد باقة من GH Direct:\n\n'
          : 'Hello — I want to confirm a GH Direct package:\n\n';
    a.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(prefix + (summary.text || ''));
  }

  function wireModals() {
    document.querySelectorAll('[data-ghd-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        var which = el.getAttribute('data-ghd-close');
        if (which === 'service') closeServiceModal();
        else if (which === 'lead') closeLeadModal();
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (leadModal && !leadModal.hidden) closeLeadModal();
      else if (serviceModal && !serviceModal.hidden) closeServiceModal();
    });

    var form = leadModal && leadModal.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitLead(form);
      });
    }
  }

  function submitLead(form) {
    var msg = leadModal.querySelector('[data-ghd-form-msg]');
    var btn = form.querySelector('[type="submit"]');
    var pkgId = leadModal.getAttribute('data-lead-pkg');
    var summary = selectionSummary(pkgId);
    var honey = form.querySelector('input[name="botcheck"]');
    if (honey && honey.value.trim()) return;

    var fd = new FormData(form);
    var name = String(fd.get('name') || '').trim();
    var phone = String(fd.get('phone') || '').trim();
    var email = String(fd.get('email') || '').trim();
    var project = String(fd.get('project') || '').trim();
    var phoneDigits = phone.replace(/\D/g, '');
    if (!name || phoneDigits.length < 8) {
      if (msg) {
        msg.textContent = ui.error;
        msg.className = 'ghd-form-msg is-err';
      }
      return;
    }
    if (TURNSTILE_KEY && !turnstileToken(form)) {
      if (msg) {
        msg.textContent =
          lang === 'ar'
            ? 'يرجى إكمال التحقق الأمني قبل الإرسال.'
            : 'Please complete the security check before sending.';
        msg.className = 'ghd-form-msg is-err';
      }
      return;
    }

    var pkgName = summary.pkg ? t(summary.pkg.name) : '';
    var totalStr = summary.tot ? formatNum(summary.tot.priced) + ' ' + currency : '';
    var messageLines = [
      summary.text,
      project ? (lang === 'ar' ? 'المشروع: ' : 'Project: ') + project : '',
      phone ? 'Phone: ' + phone : '',
      email ? 'Email: ' + email : '',
    ].filter(Boolean);

    var payload = {
      source: pkgId === 'meeting' ? 'gh-direct-meeting' : 'gh-direct',
      page: location.pathname,
      lang: lang,
      name: name,
      phone: phone,
      email: email,
      project: project,
      package: pkgName,
      addons: summary.addons.join(', '),
      estimated_total: totalStr,
      message: messageLines.join('\n'),
      subject: 'GH Direct — ' + (pkgName || 'lead') + (project ? ' — ' + project : ''),
      from_name: name || 'GH Direct',
      botcheck: honey ? honey.value : '',
      dir: dir,
    };
    if (TURNSTILE_KEY) payload['cf-turnstile-response'] = turnstileToken(form);

    if (btn) {
      btn.disabled = true;
      btn.textContent = ui.sending;
    }
    if (msg) {
      msg.textContent = '';
      msg.className = 'ghd-form-msg';
    }

    var endpoint = FORMS.formEndpoint || '/api/form';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        }).then(function (data) {
          if (!res.ok || data.success === false) {
            var err = new Error((data && data.message) || 'bad status');
            err.payload = data;
            throw err;
          }
          return data;
        });
      })
      .then(function () {
        if (msg) {
          msg.textContent = ui.success;
          msg.className = 'ghd-form-msg is-ok';
        }
        form.reset();
        resetTurnstile(form);
        if (window.ghTrack) {
          try {
            window.ghTrack('gh_direct_lead_submit', {
              package_id: pkgId,
              addons_count: summary.addons.length,
            });
          } catch (e) {}
        }
      })
      .catch(function (err) {
        if (msg) {
          msg.textContent =
            (err && err.payload && err.payload.message) || ui.error;
          msg.className = 'ghd-form-msg is-err';
        }
        resetTurnstile(form);
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = ui.send;
        }
      });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  /* ---------- Init ---------- */
  function init() {
    renderEnterprise();
    renderHero();
    renderCatalog();
    renderPackages();
    renderMeeting();
    wireModals();
    document.title =
      (lang === 'ar'
        ? 'الباقات والأسعار | GH Direct | Graphics House'
        : 'GH Direct | Packages & Pricing | Graphics House');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
