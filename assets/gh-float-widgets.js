(function () {
  'use strict';

  var isEn = (document.documentElement.lang || '').toLowerCase() === 'en'
    || document.documentElement.dir === 'ltr';
  var lastFocus = null;

  function getFocusable(popup) {
    return popup.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  function openPopup() {
    var popup = document.getElementById('ghPopup');
    if (!popup) return;
    lastFocus = document.activeElement;
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    var closeBtn = popup.querySelector('[data-gh-popup-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closePopup() {
    var popup = document.getElementById('ghPopup');
    if (!popup) return;
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function onPopupKeydown(e) {
    var popup = document.getElementById('ghPopup');
    if (!popup || !popup.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closePopup();
      return;
    }
    if (e.key !== 'Tab') return;
    var nodes = getFocusable(popup);
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function brandAction() {
    var brandBtn = document.querySelector('.gh-float-brand[data-gh-brand-action]');
    if (typeof window.toggleChat === 'function') {
      window.toggleChat();
      syncBrandActiveState();
      return;
    }
    if (brandBtn) {
      var href = brandBtn.getAttribute('data-contact-href');
      if (href) window.location.href = href;
    }
  }

  function syncBrandActiveState() {
    var brandBtn = document.querySelector('.gh-float-brand[data-gh-brand-action]');
    var panel = document.getElementById('ghChatPanel');
    if (!brandBtn || !panel) return;
    var open = panel.classList.contains('open') || panel.style.display === 'flex' || panel.style.display === 'block';
    brandBtn.classList.toggle('is-active', !!open);
  }

  function nudgeBrandButton() {
    var brandBtn = document.querySelector('.gh-float-brand[data-gh-brand-action]');
    if (!brandBtn || sessionStorage.getItem('ghFloatNudged')) return;
    setTimeout(function () {
      brandBtn.classList.add('gh-float-brand--nudge');
      sessionStorage.setItem('ghFloatNudged', '1');
      setTimeout(function () { brandBtn.classList.remove('gh-float-brand--nudge'); }, 600);
    }, 4000);
  }

  window.ghOpenPopup = openPopup;
  window.ghClosePopup = closePopup;
  window.ghFloatBrandAction = brandAction;

  window.ghSubmit = function (e) {
    e.preventDefault();
    var popup = document.getElementById('ghPopup');
    if (!popup) return;

    var btn = popup.querySelector('.gh-submit');
    var form = popup.querySelector('form');
    var thanks = document.getElementById('ghThanks');
    if (!btn || !form) return;

    var nameEl = document.getElementById('ghName');
    var companyEl = document.getElementById('ghCompany');
    var projectEl = document.getElementById('ghProject');
    var phoneEl = document.getElementById('ghPhone');
    var emailEl = document.getElementById('ghEmail');
    var briefEl = document.getElementById('ghBrief');

    var name = nameEl ? String(nameEl.value || '').trim() : '';
    var phone = phoneEl ? String(phoneEl.value || '').trim() : '';
    var email = emailEl ? String(emailEl.value || '').trim() : '';
    var company = companyEl ? String(companyEl.value || '').trim() : '';
    var projectType = projectEl ? String(projectEl.value || '').trim() : '';
    var brief = briefEl ? String(briefEl.value || '').trim() : '';

    if (!name || phone.replace(/\D/g, '').length < 8) {
      alert(isEn ? 'Please enter your full name and a valid phone number.' : 'يرجى إدخال الاسم الكامل ورقم جوال صحيح.');
      return;
    }
    if (!email || email.indexOf('@') < 1) {
      alert(isEn ? 'Please enter a valid email address.' : 'يرجى إدخال بريد إلكتروني صحيح.');
      if (emailEl) emailEl.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = isEn ? 'Sending…' : 'جارٍ الإرسال…';

    var payload = {
      subject: isEn ? 'New enquiry — Graphics House website' : 'استفسار جديد، موقع جرافيكس هاوس',
      from_name: 'Graphics House Website',
      name: name,
      company: company,
      project_type: projectType,
      phone: phone,
      email: email,
      brief: brief,
      source: 'float',
      page: typeof location !== 'undefined' ? location.href : '',
      message:
        (brief ? brief + '\n\n' : '') +
        'Company: ' + (company || '—') + '\n' +
        'Project type: ' + (projectType || '—') + '\n' +
        'Phone: ' + phone + '\n' +
        'Email: ' + email,
      botcheck: ''
    };

    fetch((window.GH_FORMS && window.GH_FORMS.formEndpoint) || 'https://3dgraphicshouse.com/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        btn.disabled = false;
        btn.textContent = isEn ? 'Submit Enquiry →' : 'إرسال الطلب ←';
        if (res.success) {
          if (window.ghTrack) {
            window.ghTrack('form_submit', { form_name: 'float_popup', page_path: location.pathname });
            window.ghTrack('generate_lead', { form_name: 'float_popup' });
          }
          form.style.display = 'none';
          if (thanks) thanks.style.display = 'block';
          setTimeout(function () {
            closePopup();
            form.style.display = 'block';
            form.reset();
            if (thanks) thanks.style.display = 'none';
          }, 3000);
        } else {
          alert((res && res.message) || (isEn ? 'Something went wrong. Please try again.' : 'حدث خطأ، يرجى المحاولة مرة أخرى.'));
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = isEn ? 'Submit Enquiry →' : 'إرسال الطلب ←';
        alert(isEn ? 'Connection error. Please try again.' : 'خطأ في الاتصال، يرجى المحاولة مرة أخرى.');
      });
  };

  document.addEventListener('click', function (e) {
    var popup = document.getElementById('ghPopup');
    if (popup && e.target === popup) closePopup();
  });

  document.addEventListener('keydown', onPopupKeydown);

  document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('ghPopup');
    if (popup && !popup.hasAttribute('aria-hidden')) {
      popup.setAttribute('aria-hidden', popup.classList.contains('open') ? 'false' : 'true');
    }
    document.querySelectorAll('[data-gh-popup-open]').forEach(function (el) {
      el.addEventListener('click', openPopup);
    });
    document.querySelectorAll('[data-gh-popup-close]').forEach(function (el) {
      el.addEventListener('click', closePopup);
    });
    document.querySelectorAll('[data-gh-brand-action]').forEach(function (el) {
      el.addEventListener('click', brandAction);
    });

    syncBrandActiveState();
    nudgeBrandButton();

    var chatPanel = document.getElementById('ghChatPanel');
    if (chatPanel && typeof MutationObserver !== 'undefined') {
      new MutationObserver(syncBrandActiveState).observe(chatPanel, {
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    document.addEventListener('click', function (e) {
      if (e.target.closest('[onclick*="toggleChat"]') || e.target.closest('#ghChatBtn')) {
        setTimeout(syncBrandActiveState, 50);
      }
    });
  });
})();
