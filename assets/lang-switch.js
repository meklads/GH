/**
 * GH bilingual link resolver — header lang-switch + footer English/عربي
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
  };

  function parts() {
    var pathname = window.location.pathname || '/';
    var fileName = pathname.split('/').pop() || 'index.html';
    var dirPath = pathname.substring(0, pathname.length - fileName.length);
    return { fileName: fileName, dirPath: dirPath };
  }

  function alternateFileName(fileName) {
    if (EXPLICIT[fileName]) return EXPLICIT[fileName];
    if (fileName.endsWith('-en.html')) return fileName.replace(/-en\.html$/, '.html');
    if (HAS_EN[fileName]) return fileName.replace(/\.html$/, '-en.html');
    return null;
  }

  function alternateHref() {
    var p = parts();
    var altFile = alternateFileName(p.fileName);
    if (altFile) return p.dirPath + altFile;
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    return p.dirPath + (isRtl ? 'index.html' : 'index-ar.html');
  }

  function isAltLink(el) {
    var t = (el.textContent || '').trim();
    return t === 'English' || t === 'EN' || t === 'عربي' || t === 'AR' || el.classList.contains('gh-lang-alt');
  }

  function initLangSwitch() {
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    var alt = alternateHref();

    document.querySelectorAll('.lang-switch').forEach(function (group) {
      var links = group.querySelectorAll('a.lang-switch-link');
      if (links.length < 2) return;
      if (isRtl) links[1].href = alt;
      else links[0].href = alt;
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
