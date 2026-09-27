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
    if (svc.priceTo != null && typeof svc.priceTo === 'number') {
      return (
        ui.from +
        ' ' +
        formatNum(svc.price) +
        ' – ' +
        formatNum(svc.priceTo) +
        ' ' +
        currency +
        unitSuffix(svc.unit)
      );
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
    var eye = document.getElementById('ghd-eyebrow');
    var title = document.getElementById('ghd-title');
    var brand = document.getElementById('ghd-brand');
    var lead = document.getElementById('ghd-lead');
    if (eye) eye.textContent = ui.pageEyebrow;
    if (brand) brand.textContent = ui.pageBrand;
    if (title) title.textContent = ui.pageTitle;
    if (lead) lead.textContent = ui.pageLead;
    var catH = document.getElementById('ghd-catalog-title');
    var catL = document.getElementById('ghd-catalog-lead');
    var pkgH = document.getElementById('ghd-packages-title');
    var pkgL = document.getElementById('ghd-packages-lead');
    var posH = document.getElementById('ghd-posture-title');
    var posL = document.getElementById('ghd-posture-lead');
    if (catH) catH.textContent = ui.catalogTitle;
    if (catL) catL.textContent = ui.catalogLead;
    if (pkgH) pkgH.textContent = ui.packagesTitle;
    if (pkgL) pkgL.textContent = ui.packagesLead;
    if (posH) posH.textContent = ui.postureTitle || '';
    if (posL) posL.textContent = ui.postureLead || '';
    renderPosture();
    renderNextSteps();
    renderClose();
  }

  function renderPosture() {
    var host = document.getElementById('ghd-posture');
    if (!host) return;
    var items = DATA.posture || [];
    if (!items.length) {
      host.innerHTML = '';
      return;
    }
    host.innerHTML = items
      .map(function (item) {
        return (
          '<article class="ghd-posture-card">' +
          '<span class="ghd-posture-n" aria-hidden="true">' +
          escapeHtml(item.n || '') +
          '</span>' +
          '<h3 class="ghd-posture-title">' +
          escapeHtml(t(item.title)) +
          '</h3>' +
          '<p class="ghd-posture-body">' +
          escapeHtml(t(item.body)) +
          '</p></article>'
        );
      })
      .join('');
  }

  function renderClose() {
    var host = document.getElementById('ghd-close');
    if (!host) return;
    var waHref =
      'https://wa.me/' +
      waPhone() +
      '?text=' +
      encodeURIComponent(
        lang === 'ar'
          ? 'مرحباً، أرغب في تأكيد باقة من GH Direct لمشروعي.'
          : 'Hello — I would like to confirm a GH Direct package for my project.'
      );
    host.innerHTML =
      '<div class="ghd-close-inner">' +
      '<div class="ghd-close-copy">' +
      '<h2 id="ghd-close-title">' +
      escapeHtml(ui.closeTitle || '') +
      '</h2>' +
      '<p>' +
      escapeHtml(ui.closeLead || '') +
      '</p></div>' +
      '<div class="ghd-close-ctas">' +
      '<a class="ghd-cta ghd-cta--primary" href="#packages">' +
      escapeHtml(ui.closeCtaPkg || '') +
      '</a>' +
      '<a class="ghd-cta ghd-cta--link" href="' +
      escapeAttr(waHref) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(ui.closeCtaWa || ui.wa || '') +
      '</a></div></div>';
  }

  function renderPaths() {
    /* Removed: path pills — keep the page simple. */
  }

  function renderWhoFor() {}

  function renderFitGuide() {
    var host = document.getElementById('ghd-fit-guide');
    if (!host) return;
    host.innerHTML = '';
    return;
    var items = DATA.fitGuide || [];
    if (!items.length) {
      host.innerHTML = '';
      return;
    }
    host.innerHTML =
      '<p class="ghd-fit-guide-title">' +
      escapeHtml(ui.fitGuideTitle || '') +
      '</p><div class="ghd-fit-guide-row">' +
      items
        .map(function (item) {
          return (
            '<a class="ghd-fit-chip" href="#pkg-' +
            escapeAttr(item.packageId) +
            '"><strong>' +
            escapeHtml(t(item.label)) +
            '</strong><span>' +
            escapeHtml(t(item.blurb)) +
            '</span></a>'
          );
        })
        .join('') +
      '</div>';
  }

  function renderProof() {
    var host = document.getElementById('ghd-proof');
    if (!host) return;
    var items = DATA.proof || [];
    if (!items.length) {
      host.innerHTML = '';
      return;
    }
    var prefix = assetPrefix || '';
    var portfolioHref = prefix + (lang === 'ar' ? 'portfolio.html' : 'portfolio-en.html');
    var casesHref = prefix + (lang === 'ar' ? 'casestudy1.html' : 'casestudy1-en.html');
    var slideHtml = items
      .map(function (item) {
        return (
          '<figure class="ghd-proof-slide">' +
          '<img src="' +
          escapeAttr(mediaUrl(item.src)) +
          '" alt="' +
          escapeAttr(t(item.caption)) +
          '" loading="lazy" decoding="async" width="320" height="180">' +
          '<figcaption>' +
          escapeHtml(t(item.caption)) +
          '</figcaption></figure>'
        );
      })
      .join('');
    host.innerHTML =
      '<div class="ghd-proof-head"><h3 class="ghd-proof-title">' +
      escapeHtml(ui.proofTitle || '') +
      '</h3><p class="ghd-proof-lead">' +
      escapeHtml(ui.proofLead || '') +
      '</p></div>' +
      '<div class="ghd-proof-album" aria-label="' +
      escapeAttr(ui.proofTitle || '') +
      '">' +
      '<div class="ghd-proof-frame">' +
      '<div class="ghd-proof-track" id="ghd-proof-track">' +
      slideHtml +
      '</div></div></div>' +
      '<div class="ghd-proof-actions">' +
      '<a class="ghd-proof-btn ghd-proof-btn--solid" href="' +
      escapeAttr(portfolioHref) +
      '">' +
      escapeHtml(ui.proofBrowse || '') +
      ' <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>' +
      '<a class="ghd-proof-btn ghd-proof-btn--ghost" href="' +
      escapeAttr(casesHref) +
      '">' +
      escapeHtml(ui.proofCases || '') +
      ' <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></a>' +
      '</div>';
  }

  function renderAtelierEntry() {
    var host = document.getElementById('ghd-atelier-entry');
    if (!host) return;
    host.innerHTML = '';
    return;
    host.innerHTML =
      '<div class="ghd-atelier-entry-inner">' +
      '<div><p class="ghd-atelier-entry-title">' +
      escapeHtml(ui.atelierEntryTitle || '') +
      '</p><p class="ghd-atelier-entry-lead">' +
      escapeHtml(ui.atelierEntryLead || '') +
      '</p></div>' +
      '<a class="ghd-cta ghd-cta--primary" href="#atelier-workshop" data-open-atelier="1">' +
      escapeHtml(ui.atelierEntryCta || ui.openAtelier || '') +
      '</a></div>';
    host.querySelectorAll('[data-open-atelier]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var workshop = document.getElementById('atelier-workshop');
        if (workshop) {
          workshop.classList.add('is-open');
          try {
            workshop.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (e) {}
        }
      });
    });
  }

  function bindAtelierControls(root) {
    if (!root) return;
    root.querySelectorAll('.ghd-addon').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pkgId = btn.getAttribute('data-pkg');
        var id = btn.getAttribute('data-addon');
        if (!pkgId || !id) return;
        var set = addonState[pkgId];
        if (set.has(id)) set.delete(id);
        else set.add(id);
        updatePackageUI(pkgId);
        refreshPkgWaLinks();
      });
    });
    root.querySelectorAll('.ghd-compose-family').forEach(function (panel) {
      panel.addEventListener('toggle', function () {
        if (!panel.open) return;
        root.querySelectorAll('.ghd-compose-family').forEach(function (other) {
          if (other !== panel) other.open = false;
        });
      });
    });
    root.querySelectorAll('[data-lead-pkg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLeadModal(btn.getAttribute('data-lead-pkg'));
      });
    });
  }

  function renderAtelierWorkshop() {
    var host = document.getElementById('ghd-atelier-inner');
    if (!host) return;
    var pkg = DATA.packages.find(function (p) {
      return isBuilder(p);
    });
    if (!pkg) {
      host.innerHTML = '';
      return;
    }
    var tot = computeTotal(pkg);
    var selCount = addonState[pkg.id] ? addonState[pkg.id].size : 0;
    host.innerHTML =
      '<header class="ghd-atelier-head">' +
      '<div class="ghd-atelier-head-copy">' +
      '<p class="ghd-atelier-kicker">' +
      escapeHtml(ui.builderBadge || '') +
      '</p>' +
      '<h3 id="ghd-atelier-title">' +
      escapeHtml(ui.atelierTitle || t(pkg.name)) +
      '</h3>' +
      '<p class="ghd-atelier-lead">' +
      escapeHtml(ui.atelierLead || t(pkg.tagline)) +
      '</p></div>' +
      '<div class="ghd-atelier-mark" aria-hidden="true"></div>' +
      '</header>' +
      '<aside class="ghd-price-drivers" aria-label="' +
      escapeAttr(ui.priceDriversTitle || '') +
      '"><strong>' +
      escapeHtml(ui.priceDriversTitle || '') +
      '</strong><p>' +
      escapeHtml(ui.priceDrivers || '') +
      '</p></aside>' +
      '<div class="ghd-atelier-stage">' +
      composeGroupsHtml(pkg) +
      '</div>' +
      totalBoxHtml(pkg, tot) +
      '<div class="ghd-atelier-ctas">' +
      '<button type="button" class="ghd-cta ghd-cta--primary ghd-atelier-cta" data-lead-pkg="' +
      escapeAttr(pkg.id) +
      '">' +
      escapeHtml(ui.confirmPlan || ui.cta) +
      '</button>' +
      '<a class="ghd-cta ghd-cta--outline ghd-atelier-cta" data-pkg-wa="' +
      escapeAttr(pkg.id) +
      '" href="#" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(ui.wa) +
      '</a>' +
      (selCount
        ? '<span class="ghd-atelier-selcount">' +
          selCount +
          ' ' +
          escapeHtml(ui.selectedCount || '') +
          '</span>'
        : '') +
      '</div>';
    bindAtelierControls(host);
  }

  function renderPackages() {
    var host = document.getElementById('ghd-packages');
    if (!host) return;
    host.innerHTML = '';
    DATA.packages.forEach(function (pkg) {
      if (isBuilder(pkg)) return;
      var card = document.createElement('article');
      var featured = !!pkg.featured;
      card.className =
        'ghd-pkg ghd-pkg--bundle' + (featured ? ' ghd-pkg--featured' : '');
      card.id = 'pkg-' + pkg.id;
      card.setAttribute('data-package-id', pkg.id);

      var ribbon = featured
        ? '<div class="ghd-pkg-ribbon" aria-hidden="true">' +
          escapeHtml(ui.mostPopular) +
          '</div>'
        : '';

      var namePill =
        '<span class="ghd-pkg-namepill">' + escapeHtml(t(pkg.name)) + '</span>';

      var stage =
        pkg.stage
          ? '<p class="ghd-pkg-stage"><span>' +
            escapeHtml(ui.stageLabel || '') +
            '</span><strong>' +
            escapeHtml(t(pkg.stage)) +
            '</strong></p>'
          : '';

      var priceBlock =
        '<div class="ghd-pkg-priceblock">' +
        '<span class="ghd-pkg-price-from">' +
        escapeHtml(ui.from) +
        '</span>' +
        '<span class="ghd-pkg-price-main">' +
        escapeHtml(formatNum(pkg.price)) +
        '</span>' +
        '<span class="ghd-pkg-price-suffix">' +
        escapeHtml(currency) +
        '</span></div>';

      var tagline = pkg.tagline
        ? '<p class="ghd-pkg-tagline">' + escapeHtml(t(pkg.tagline)) + '</p>'
        : '';

      var fit =
        pkg.fit
          ? '<p class="ghd-pkg-fit"><span class="material-symbols-outlined" aria-hidden="true">person</span><span><em>' +
            escapeHtml(ui.fitLabel || '') +
            '</em> ' +
            escapeHtml(t(pkg.fit)) +
            '</span></p>'
          : '';
      var delivery =
        pkg.delivery
          ? '<p class="ghd-pkg-delivery"><span class="material-symbols-outlined" aria-hidden="true">schedule</span><span><em>' +
            escapeHtml(ui.deliveryLabel || '') +
            '</em> ' +
            escapeHtml(t(pkg.delivery)) +
            '</span></p>'
          : '';

      var lines = '';
      if (pkg.includedLines && pkg.includedLines.length) {
        lines =
          '<ul class="ghd-list" aria-label="' +
          escapeAttr(ui.included) +
          '">' +
          pkg.includedLines
            .map(function (line) {
              return '<li><span>' + escapeHtml(t(line)) + '</span></li>';
            })
            .join('') +
          '</ul>';
      }

      var foot =
        '<p class="ghd-pkg-foot">' +
        escapeHtml(
          ui.packagesFoot ||
            (lang === 'ar'
              ? 'تقدير ابتدائي · تأكيد خلال يوم عمل · بلا دفع أونلاين'
              : 'Starting estimate · confirm in one business day · no online checkout')
        ) +
        '</p>';

      var ctaClass = featured ? 'ghd-cta ghd-cta--on-dark' : 'ghd-cta ghd-cta--primary';
      var primaryCta =
        '<button type="button" class="' +
        ctaClass +
        '" data-lead-pkg="' +
        escapeAttr(pkg.id) +
        '">' +
        escapeHtml(ui.choosePlan || ui.cta) +
        '</button>';

      card.innerHTML =
        ribbon +
        '<div class="ghd-pkg-top">' +
        namePill +
        stage +
        priceBlock +
        tagline +
        '</div>' +
        fit +
        delivery +
        lines +
        '<div class="ghd-pkg-ctas">' +
        primaryCta +
        '<a class="ghd-cta ghd-cta--link" data-pkg-wa="' +
        escapeAttr(pkg.id) +
        '" href="#" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(ui.wa) +
        '</a></div>' +
        foot;

      host.appendChild(card);
    });

    host.querySelectorAll('[data-lead-pkg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLeadModal(btn.getAttribute('data-lead-pkg'));
      });
    });

    refreshPkgWaLinks();
    renderAtelierWorkshop();
    renderProof();
  }

  function renderNextSteps() {
    var host = document.getElementById('ghd-next-steps');
    if (!host || !ui.nextSteps || !ui.nextSteps.length) return;
    host.innerHTML =
      '<h3 class="ghd-next-title">' +
      escapeHtml(ui.nextTitle || '') +
      '</h3><ol class="ghd-next-list">' +
      ui.nextSteps
        .map(function (step, i) {
          return (
            '<li><span class="ghd-next-num">' +
            (i + 1) +
            '</span><div><strong>' +
            escapeHtml(step.title) +
            '</strong><p>' +
            escapeHtml(step.body) +
            '</p></div></li>'
          );
        })
        .join('') +
      '</ol>';
  }

  /* ---------- Catalog ---------- */
  var FAMILY_ORDER = ['viz', 'cgi', 'immersive', 'maquettes', 'brand', 'sales'];

  function familyLabel(id, short) {
    var map = short ? ui.familyShort : ui.families;
    if (map && map[id]) return map[id];
    return id;
  }

  function serviceFamily(svc) {
    if (svc && svc.family) return svc.family;
    var id = (svc && svc.id) || '';
    if (/^render-/.test(id)) return 'viz';
    if (id === 'cinematic') return 'cgi';
    if (/vr360|interactive|touchscreen/.test(id)) return 'immersive';
    if (/^maquette-/.test(id)) return 'maquettes';
    if (/identity|catalogue|microsite|waitlist/.test(id)) return 'brand';
    return 'sales';
  }

  var catalogFilter = 'viz';

  function filteredServices() {
    if (catalogFilter === 'all') return DATA.services.slice();
    return DATA.services.filter(function (s) {
      return serviceFamily(s) === catalogFilter;
    });
  }

  function renderCatalogFilters() {
    var host = document.getElementById('ghd-catalog-filters');
    if (!host) return;
    var items = FAMILY_ORDER.map(function (id) {
      return { id: id, label: familyLabel(id, false) };
    }).concat([{ id: 'all', label: ui.filterAll || (lang === 'ar' ? 'الكل' : 'All') }]);
    host.innerHTML = items
      .map(function (item) {
        return (
          '<button type="button" class="ghd-filter' +
          (catalogFilter === item.id ? ' is-active' : '') +
          (item.id === 'all' ? ' ghd-filter--all' : '') +
          '" role="tab" aria-selected="' +
          (catalogFilter === item.id ? 'true' : 'false') +
          '" data-ghd-filter="' +
          escapeAttr(item.id) +
          '">' +
          escapeHtml(item.label) +
          '</button>'
        );
      })
      .join('');
    host.querySelectorAll('[data-ghd-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        catalogFilter = btn.getAttribute('data-ghd-filter') || 'viz';
        renderCatalogFilters();
        renderCatalog();
        var section = document.getElementById('catalog');
        if (section && catalogFilter !== 'all') {
          try {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (e) {}
        }
      });
    });
  }

  function svcCardHtml(svc, idx) {
    var num = String(idx + 1).padStart(2, '0');
    var unpriced = svc.price == null || svc.priceLabel === 'contact';
    var fam = serviceFamily(svc);
    return (
      '<button type="button" class="ghd-svc-card" data-service-id="' +
      escapeAttr(svc.id) +
      '" data-family="' +
      escapeAttr(fam) +
      '" aria-haspopup="dialog">' +
      '<div class="ghd-svc-media">' +
      mediaMarkup(svc, { autoplay: true }) +
      '<span class="ghd-svc-num" aria-hidden="true">' +
      num +
      '</span>' +
      '<span class="ghd-svc-chip">' +
      escapeHtml(familyLabel(fam, true)) +
      '</span></div>' +
      '<div class="ghd-svc-body">' +
      '<h3>' +
      escapeHtml(t(svc.name)) +
      '</h3>' +
      '<p class="ghd-svc-blurb">' +
      escapeHtml(t(svc.description)) +
      '</p>' +
      '<div class="ghd-price' +
      (unpriced ? ' ghd-price-contact' : '') +
      '">' +
      escapeHtml(priceText(svc)) +
      '</div></div></button>'
    );
  }

  function bindCatalogCards(root) {
    if (!root) return;
    root.querySelectorAll('.ghd-svc-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openServiceModal(btn.getAttribute('data-service-id'));
      });
    });
  }

  function renderCatalog() {
    var grid = document.getElementById('ghd-catalog');
    var empty = document.getElementById('ghd-catalog-empty');
    if (!grid) return;
    grid.innerHTML = '';
    grid.className = 'ghd-catalog' + (catalogFilter === 'all' ? ' ghd-catalog--grouped' : ' ghd-catalog--flat');
    var list = filteredServices();
    if (empty) {
      empty.hidden = list.length > 0;
      empty.textContent = ui.filterEmpty || '';
    }
    if (!list.length) return;

    if (catalogFilter === 'all') {
      var html = '';
      var globalIdx = 0;
      FAMILY_ORDER.forEach(function (fam) {
        var items = list.filter(function (s) {
          return serviceFamily(s) === fam;
        });
        if (!items.length) return;
        html +=
          '<section class="ghd-family-block" data-family="' +
          escapeAttr(fam) +
          '">' +
          '<header class="ghd-family-head">' +
          '<span class="ghd-family-index" aria-hidden="true">' +
          String(FAMILY_ORDER.indexOf(fam) + 1).padStart(2, '0') +
          '</span>' +
          '<div><h3 class="ghd-family-title">' +
          escapeHtml(familyLabel(fam, false)) +
          '</h3>' +
          '<p class="ghd-family-count">' +
          escapeHtml(
            lang === 'ar'
              ? items.length + ' بنود'
              : items.length + (items.length === 1 ? ' item' : ' items')
          ) +
          '</p></div></header>' +
          '<div class="ghd-family-grid">';
        items.forEach(function (svc) {
          globalIdx += 1;
          html += svcCardHtml(svc, globalIdx - 1);
        });
        html += '</div></section>';
      });
      grid.innerHTML = html;
    } else {
      grid.innerHTML =
        '<header class="ghd-family-head ghd-family-head--active">' +
        '<span class="ghd-family-index" aria-hidden="true">' +
        String(FAMILY_ORDER.indexOf(catalogFilter) + 1).padStart(2, '0') +
        '</span>' +
        '<div><h3 class="ghd-family-title">' +
        escapeHtml(familyLabel(catalogFilter, false)) +
        '</h3>' +
        '<p class="ghd-family-count">' +
        escapeHtml(
          lang === 'ar'
            ? list.length + ' بنود في هذه العائلة'
            : list.length + (list.length === 1 ? ' item in this family' : ' items in this family')
        ) +
        '</p></div></header>' +
        '<div class="ghd-family-grid">' +
        list
          .map(function (svc, idx) {
            return svcCardHtml(svc, idx);
          })
          .join('') +
        '</div>';
    }
    bindCatalogCards(grid);
  }

  /* ---------- Packages ---------- */
  function serviceCategory(svc) {
    return serviceFamily(svc);
  }

  var COMPOSE_ORDER = FAMILY_ORDER.slice();

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
    var hasRange = false;
    var selected = addonState[pkg.id];
    selected.forEach(function (id) {
      var svc = serviceById[id];
      if (!svc) return;
      if (svc.price == null || typeof svc.price !== 'number' || isNaN(svc.price) || svc.priceLabel === 'contact') {
        unpriced.push(svc);
      } else {
        priced += svc.price;
        if (svc.priceTo != null && typeof svc.priceTo === 'number') hasRange = true;
      }
    });
    return { priced: priced, unpriced: unpriced, hasRange: hasRange };
  }

  function addonRowHtml(pkg, id) {
    var svc = serviceById[id];
    if (!svc) return '';
    var on = addonState[pkg.id].has(id);
    var unpriced = svc.price == null || svc.priceLabel === 'contact';
    var meta = unpriced
      ? ui.unpricedNote
      : svc.priceTo != null && typeof svc.priceTo === 'number'
        ? formatNum(svc.price) + '–' + formatNum(svc.priceTo) + ' ' + currency
        : formatNum(svc.price) + ' ' + currency;
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
      '<span class="ghd-addon-foot">' +
      '<span class="ghd-addon-meta">' +
      escapeHtml(meta) +
      '</span>' +
      '<span class="ghd-addon-toggle">' +
      escapeHtml(on ? ui.added : ui.add) +
      '</span></span></button>'
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
    var hintText = tot.hasRange
      ? (ui.rangeInTotal || '') + ' · ' + (ui.totalNote || '')
      : ui.totalNote || '';
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
      escapeHtml(hintText) +
      '</p></div>'
    );
  }

  function composeGroupsHtml(pkg) {
    var groups = {};
    COMPOSE_ORDER.forEach(function (key) {
      groups[key] = [];
    });
    addonIdsFor(pkg).forEach(function (id) {
      var svc = serviceById[id];
      if (!svc) return;
      var cat = serviceCategory(svc);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(id);
    });
    var labels = ui.composeGroups || {};
    var famIdx = 0;
    var openFirst = true;
    return (
      '<p class="ghd-compose-hint">' +
      escapeHtml(ui.composeHint || '') +
      '</p>' +
      '<div class="ghd-compose-groups ghd-compose-groups--accordion">' +
      COMPOSE_ORDER.map(function (key) {
        var ids = groups[key] || [];
        if (!ids.length) return '';
        famIdx += 1;
        var openAttr = openFirst ? ' open' : '';
        openFirst = false;
        return (
          '<details class="ghd-compose-family"' +
          openAttr +
          ' data-family="' +
          escapeAttr(key) +
          '">' +
          '<summary class="ghd-compose-family-head">' +
          '<span class="ghd-compose-family-idx" aria-hidden="true">' +
          String(famIdx).padStart(2, '0') +
          '</span>' +
          '<h4 class="ghd-compose-family-name">' +
          escapeHtml(labels[key] || key) +
          '</h4>' +
          '<span class="ghd-compose-family-count">' +
          ids.length +
          '</span></summary>' +
          '<div class="ghd-addons ghd-addons--grid" data-addons-for="' +
          escapeAttr(pkg.id) +
          '">' +
          ids
            .map(function (id) {
              return addonRowHtml(pkg, id);
            })
            .join('') +
          '</div></details>'
        );
      }).join('') +
      '</div>'
    );
  }

  function refreshPkgWaLinks() {
    document.querySelectorAll('[data-pkg-wa]').forEach(function (a) {
      var pkgId = a.getAttribute('data-pkg-wa');
      var summary = selectionSummary(pkgId);
      var prefix =
        lang === 'ar'
          ? 'مرحباً، أود تأكيد باقة من GH Direct:\n\n'
          : 'Hello — I want to confirm a GH Direct package:\n\n';
      a.href =
        'https://wa.me/' +
        waPhone() +
        '?text=' +
        encodeURIComponent(prefix + (summary.text || ''));
    });
  }

  function addServiceToCompose(serviceId) {
    if (!addonState.custom) return;
    addonState.custom.add(serviceId);
    updatePackageUI('custom');
    refreshPkgWaLinks();
    var roots = [
      document.getElementById('ghd-atelier-inner'),
      document.getElementById('pkg-custom'),
    ];
    roots.forEach(function (root) {
      if (!root) return;
      var btn = root.querySelector('[data-addon="' + serviceId + '"]');
      if (btn) {
        try {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) {}
        btn.classList.add('is-pulse-add');
        setTimeout(function () {
          btn.classList.remove('is-pulse-add');
        }, 900);
      }
    });
  }

  function updatePackageUI(pkgId) {
    var pkg = DATA.packages.find(function (p) {
      return p.id === pkgId;
    });
    if (!pkg) return;
    var card =
      document.querySelector('#ghd-atelier-inner[data-package-id="' + pkgId + '"]') ||
      document.querySelector('.ghd-pkg[data-package-id="' + pkgId + '"]');
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
    var hintEl = box.querySelector('.ghd-total-hint');
    if (hintEl) {
      hintEl.textContent = tot.hasRange
        ? (ui.rangeInTotal || '') + ' · ' + (ui.totalNote || '')
        : ui.totalNote || '';
    }
    var ctas = card.querySelector('.ghd-atelier-ctas');
    if (ctas && isBuilder(pkg)) {
      var countEl = ctas.querySelector('.ghd-atelier-selcount');
      var n = addonState[pkgId].size;
      if (n) {
        if (!countEl) {
          countEl = document.createElement('span');
          countEl.className = 'ghd-atelier-selcount';
          ctas.appendChild(countEl);
        }
        countEl.textContent = n + ' ' + (ui.selectedCount || '');
      } else if (countEl) {
        countEl.remove();
      }
    }
  }

  /* ---------- FAQ ---------- */
  function renderFaq() {
    var title = document.getElementById('ghd-faq-title');
    var host = document.getElementById('ghd-faq');
    var trust = document.getElementById('ghd-trust-line');
    if (title) title.textContent = ui.faqTitle || (lang === 'ar' ? 'أسئلة شائعة' : 'FAQs');
    if (trust && ui.trustLine) {
      trust.hidden = false;
      trust.textContent = ui.trustLine;
    }
    if (!host || !ui.faq || !ui.faq.length) return;
    host.innerHTML = ui.faq
      .map(function (item, i) {
        var id = 'ghd-faq-' + i;
        return (
          '<div class="ghd-faq-item">' +
          '<button type="button" class="ghd-faq-q" aria-expanded="false" aria-controls="' +
          id +
          '" id="' +
          id +
          '-btn">' +
          '<span>' +
          escapeHtml(item.q) +
          '</span>' +
          '<span class="ghd-faq-icon" aria-hidden="true">+</span>' +
          '</button>' +
          '<div class="ghd-faq-a" id="' +
          id +
          '" role="region" aria-labelledby="' +
          id +
          '-btn" hidden>' +
          '<p>' +
          escapeHtml(item.a) +
          '</p></div></div>'
        );
      })
      .join('');

    host.querySelectorAll('.ghd-faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        host.querySelectorAll('.ghd-faq-q').forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-expanded', 'false');
          other.classList.remove('is-open');
          var op = document.getElementById(other.getAttribute('aria-controls'));
          if (op) op.hidden = true;
        });
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        btn.classList.toggle('is-open', !open);
        if (panel) panel.hidden = open;
      });
    });
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
      escapeHtml(lang === 'ar' ? 'مهرب سريع' : 'Quick escape') +
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
    var actions = serviceModal.querySelector('[data-ghd-svc-actions]');
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
    if (actions) {
      var waText =
        (lang === 'ar'
          ? 'مرحباً، أود الاستفسار عن خدمة من GH Direct:\n\n'
          : 'Hello — I want to ask about a GH Direct service:\n\n') +
        t(svc.name) +
        ' — ' +
        priceText(svc);
      var inCompose = addonState.custom && addonState.custom.has(id);
      actions.innerHTML =
        '<button type="button" class="ghd-cta ghd-cta--solid" data-svc-request="' +
        escapeAttr(id) +
        '">' +
        escapeHtml(ui.svcRequest || ui.cta) +
        '</button>' +
        '<a class="ghd-cta ghd-cta--wa" href="https://wa.me/' +
        waPhone() +
        '?text=' +
        encodeURIComponent(waText) +
        '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(ui.svcWhatsApp || ui.wa) +
        '</a>' +
        '<button type="button" class="ghd-cta ghd-cta--ghost" data-svc-compose="' +
        escapeAttr(id) +
        '">' +
        escapeHtml(inCompose ? ui.svcAddedCompose : ui.svcAddCompose) +
        '</button>';
      var req = actions.querySelector('[data-svc-request]');
      if (req) {
        req.addEventListener('click', function () {
          closeServiceModal();
          openLeadModal('service:' + id);
        });
      }
      var addBtn = actions.querySelector('[data-svc-compose]');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          addServiceToCompose(id);
          addBtn.textContent = ui.svcAddedCompose || ui.added;
          closeServiceModal();
          var card = document.getElementById('pkg-custom');
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
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
    if (pkgId && String(pkgId).indexOf('service:') === 0) {
      var sid = String(pkgId).slice('service:'.length);
      var svc = serviceById[sid];
      if (!svc) return { text: '', tot: null, addons: [], kind: 'service' };
      var priced =
        svc.price != null && typeof svc.price === 'number' && svc.priceLabel !== 'contact'
          ? svc.price
          : 0;
      var unpriced = priced ? [] : [svc];
      var lines = [
        t(svc.name) + ' — ' + priceText(svc),
        ui.total + ': ' + (priced ? formatNum(priced) + ' ' + currency : ui.contactPrice),
      ];
      return {
        text: lines.join('\n'),
        tot: { priced: priced, unpriced: unpriced },
        addons: [],
        pkg: { name: svc.name, price: priced },
        kind: 'service',
        serviceId: sid,
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
    } else if (summary.kind === 'service') {
      if (titleEl) titleEl.textContent = ui.svcRequest || ui.formTitle;
      if (leadP) leadP.textContent = ui.formLead;
    } else {
      if (titleEl) titleEl.textContent = ui.formTitle;
      if (leadP) leadP.textContent = ui.formLead;
    }
    var sumEl = leadModal.querySelector('[data-ghd-summary]');
    if (sumEl) sumEl.textContent = summary.text;
    var nextEl = leadModal.querySelector('[data-ghd-form-next]');
    if (nextEl && ui.nextSteps && ui.nextSteps.length) {
      nextEl.innerHTML = ui.nextSteps
        .map(function (step) {
          return '<li><strong>' + escapeHtml(step.title) + '</strong> — ' + escapeHtml(step.body) + '</li>';
        })
        .join('');
    }
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
    var prefix;
    if (summary && summary.kind === 'meeting') {
      prefix = ui.meetingWaText + '\n\n';
    } else if (summary && summary.kind === 'service') {
      prefix =
        lang === 'ar'
          ? 'مرحباً، أود تأكيد خدمة من GH Direct:\n\n'
          : 'Hello — I want to confirm a GH Direct service:\n\n';
    } else {
      prefix =
        lang === 'ar'
          ? 'مرحباً، أود تأكيد باقة من GH Direct:\n\n'
          : 'Hello — I want to confirm a GH Direct package:\n\n';
    }
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
      source: pkgId === 'meeting' ? 'gh-direct-meeting' : (pkgId && String(pkgId).indexOf('service:') === 0 ? 'gh-direct-service' : 'gh-direct'),
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
    renderPackages();
    renderCatalogFilters();
    renderCatalog();
    renderFaq();
    renderMeeting();
    var trust = document.getElementById('ghd-trust-line');
    if (trust && ui.trustLine) {
      trust.hidden = false;
      trust.textContent = ui.trustLine;
    }
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
