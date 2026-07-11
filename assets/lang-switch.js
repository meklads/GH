/**
 * GH bilingual link resolver — header lang-switch + footer English/عربي
 * Prefers <link rel="alternate" hreflang> when present, then path pairing.
 */
(function () {
  var EXPLICIT = {
    'index.html': 'index-ar.html',
    'index-ar.html': 'index.html',
    'en.html': 'index-ar.html',
    'contact.html': 'contact-us-en.html',
    'contact-us-en.html': 'contact-us.html',
    'case-study-alrajhi-en.html': 'casestudy1.html',
    'case-study-anan-eskan-en.html': 'casestudy1.html',
    'case-study-mwl-en.html': 'casestudy1.html',
    'careers-en.html': 'index-ar.html',
    'smart-maquettes-en.html': 'services/maquettes.html',
    '3d-animation-en.html': 'services/animation.html',
    'media-production-en.html': 'services/production.html',
    'interactive-experiences-en.html': 'services/interactive-experiences.html',
  };

  var HAS_EN = {
    'who-we-are.html': true,
    'workspace.html': true,
    'smart-maquettes.html': true,
    'privacy-policy.html': true,
    'portfolio.html': true,
    'offer.html': true,
    'media-production.html': true,
    'interactive-experiences.html': true,
    'galleries-advertising.html': true,
    'faq.html': true,
    'contact-us.html': true,
    'casestudy1.html': true,
    '3d-animation.html': true,
    'growth-launch.html': true,
    'project-launch.html': true,
    'brand-scale.html': true,
    'interactive.html': true,
    'vr-360.html': true,
    'maquettes.html': true,
    'animation.html': true,
    'production.html': true,
    'rendering.html': true,
  };

  function parts() {
    var pathname = window.location.pathname || '/';
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    var segments = pathname.split('/');
    var fileName = segments.pop() || '';
    if (!fileName) fileName = 'index.html';
    // nginx try_files serves /services/foo → foo.html
    if (fileName !== 'index.html' && fileName.indexOf('.') === -1) {
      fileName += '.html';
    }
    var dirPath = segments.join('/') + '/';
    if (dirPath.charAt(0) !== '/') dirPath = '/' + dirPath;
    return { fileName: fileName, dirPath: dirPath };
  }

  function isPairedSection(dirPath) {
    return (
      /\/insights(\/|$)/.test(dirPath) ||
      /\/locations(\/|$)/.test(dirPath) ||
      /\/services(\/|$)/.test(dirPath) ||
      /\/solutions(\/|$)/.test(dirPath)
    );
  }

  function alternateFileName(fileName, dirPath) {
    if (EXPLICIT[fileName] && !isPairedSection(dirPath)) return EXPLICIT[fileName];

    if (isPairedSection(dirPath)) {
      if (fileName === 'index.html') return 'index-en.html';
      if (fileName === 'index-en.html') return 'index.html';
      if (fileName === 'index-ar.html') return 'index.html';
      if (fileName.endsWith('-en.html')) return fileName.replace(/-en\.html$/, '.html');
      if (fileName.endsWith('.html')) return fileName.replace(/\.html$/, '-en.html');
    }

    if (fileName.endsWith('-en.html')) return fileName.replace(/-en\.html$/, '.html');
    if (HAS_EN[fileName]) return fileName.replace(/\.html$/, '-en.html');
    return null;
  }

  function fromAlternateLink(wantLang) {
    var link = document.querySelector('link[rel="alternate"][hreflang="' + wantLang + '"]');
    if (!link) return null;
    var href = link.getAttribute('href');
    if (!href) return null;
    try {
      var u = new URL(href, window.location.origin);
      if (u.origin === window.location.origin) {
        return u.pathname + u.search + u.hash;
      }
    } catch (e) {}
    return href;
  }

  function alternateHref() {
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    var want = isRtl ? 'en' : 'ar';
    var fromLink = fromAlternateLink(want);
    if (fromLink) return fromLink;

    var p = parts();
    var altFile = alternateFileName(p.fileName, p.dirPath);
    if (altFile) {
      if (altFile.indexOf('/') === 0 || altFile.indexOf('services/') === 0) {
        return altFile.charAt(0) === '/' ? altFile : '/' + altFile;
      }
      return p.dirPath + altFile;
    }
    return isRtl ? '/index.html' : '/index-ar.html';
  }

  function currentHref() {
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    var fromLink = fromAlternateLink(isRtl ? 'ar' : 'en');
    if (fromLink) return fromLink;
    var p = parts();
    return p.dirPath + p.fileName;
  }

  function isAltLink(el) {
    var t = (el.textContent || '').trim();
    return t === 'English' || t === 'EN' || t === 'عربي' || t === 'AR' || el.classList.contains('gh-lang-alt');
  }

  function initLangSwitch() {
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    var alt = alternateHref();
    var cur = currentHref();

    document.querySelectorAll('.lang-switch').forEach(function (group) {
      var links = group.querySelectorAll('a.lang-switch-link');
      if (links.length < 2) return;
      var arLink = group.querySelector('a[hreflang="ar"]');
      var enLink = group.querySelector('a[hreflang="en"]');
      if (!arLink || !enLink) return;
      if (isRtl) {
        arLink.href = cur;
        enLink.href = alt;
      } else {
        arLink.href = alt;
        enLink.href = cur;
      }
      links.forEach(function (a) {
        a.classList.remove('is-active');
      });
      if (isRtl) arLink.classList.add('is-active');
      else enLink.classList.add('is-active');
    });

    document.querySelectorAll('footer a').forEach(function (a) {
      if (!isAltLink(a)) return;
      if ((a.textContent.trim() === 'English' || a.textContent.trim() === 'EN') && isRtl) a.href = alt;
      if ((a.textContent.trim() === 'عربي' || a.textContent.trim() === 'AR') && !isRtl) a.href = alt;
      if (a.classList.contains('gh-lang-alt')) a.href = alt;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangSwitch);
  } else {
    initLangSwitch();
  }
})();
