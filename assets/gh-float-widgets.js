(function () {
  'use strict';

  var isEn = (document.documentElement.lang || '').toLowerCase() === 'en'
    || document.documentElement.dir === 'ltr';

  function openPopup() {
    var popup = document.getElementById('ghPopup');
    if (popup) popup.classList.add('open');
  }

  function closePopup() {
    var popup = document.getElementById('ghPopup');
    if (popup) popup.classList.remove('open');
  }

  function brandAction() {
    if (typeof window.toggleChat === 'function') {
      window.toggleChat();
      return;
    }
    var link = document.querySelector('.gh-float-brand[data-contact-href]');
    if (link) {
      window.location.href = link.getAttribute('data-contact-href');
    }
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

    btn.disabled = true;
    btn.textContent = isEn ? 'Sending…' : 'جارٍ الإرسال…';

    var payload = {
      subject: isEn ? 'New enquiry — Graphics House website' : 'استفسار جديد، موقع جرافيكس هاوس',
      from_name: 'Graphics House Website',
      name: document.getElementById('ghName').value,
      company: document.getElementById('ghCompany').value,
      project_type: document.getElementById('ghProject').value,
      phone: document.getElementById('ghPhone').value,
      brief: document.getElementById('ghBrief').value,
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
          form.style.display = 'none';
          if (thanks) thanks.style.display = 'block';
          setTimeout(function () {
            closePopup();
            form.style.display = 'block';
            form.reset();
            if (thanks) thanks.style.display = 'none';
          }, 3000);
        } else {
          alert(isEn ? 'Something went wrong. Please try again.' : 'حدث خطأ، يرجى المحاولة مرة أخرى.');
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

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-gh-popup-open]').forEach(function (el) {
      el.addEventListener('click', openPopup);
    });
    document.querySelectorAll('[data-gh-popup-close]').forEach(function (el) {
      el.addEventListener('click', closePopup);
    });
    document.querySelectorAll('[data-gh-brand-action]').forEach(function (el) {
      el.addEventListener('click', brandAction);
    });
  });
})();
