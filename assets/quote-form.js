(function () {
  'use strict';

  var style = document.createElement('style');
  style.textContent = [
    '.form-feedback{display:none;margin-bottom:14px;padding:14px 16px;font-size:14px;line-height:1.75;border-radius:8px;font-family:Tajawal,sans-serif}',
    '.form-feedback.is-visible{display:block}',
    '.form-feedback.is-success{background:rgba(34,139,34,.08);border:1px solid rgba(34,139,34,.22);color:#1a5c1a}',
    '.form-feedback.is-pending{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.35);color:#5c4a18}',
    '.form-feedback.is-error{background:rgba(180,0,0,.06);border:1px solid rgba(180,0,0,.18);color:#8b1a1a}',
    '.form-submit:disabled{opacity:.65;cursor:not-allowed}'
  ].join('');
  document.head.appendChild(style);

  function ensureFeedback(form) {
    var box = form.querySelector('.form-feedback');
    if (box) return box;
    box = document.createElement('div');
    box.className = 'form-feedback';
    box.setAttribute('aria-live', 'polite');
    var submit = form.querySelector('.form-submit, button[type="submit"]');
    if (submit) form.insertBefore(box, submit);
    else form.appendChild(box);
    return box;
  }

  function showFeedback(box, type, html) {
    box.className = 'form-feedback is-visible is-' + type;
    box.innerHTML = html;
  }

  function wireForm(form) {
    if (form.dataset.ghQuoteWired === '1') return;
    form.dataset.ghQuoteWired = '1';

    var action = form.getAttribute('action') || '';
    if (!action.includes('formsubmit.co')) return;

    if (!action.includes('/ajax/')) {
      form.setAttribute('action', action.replace('formsubmit.co/', 'formsubmit.co/ajax/'));
    }
    form.removeAttribute('target');

    if (!form.querySelector('input[name="_captcha"]')) {
      var cap = document.createElement('input');
      cap.type = 'hidden';
      cap.name = '_captcha';
      cap.value = 'false';
      form.appendChild(cap);
    }

    var feedback = ensureFeedback(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit, button[type="submit"]');
      var label = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'جاري الإرسال…';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          return res.json().catch(function () {
            return { success: res.ok, message: '' };
          });
        })
        .then(function (data) {
          var msg = (data && data.message) ? String(data.message) : '';
          if (data && (data.success === true || data.success === 'true')) {
            showFeedback(
              feedback,
              'success',
              '<strong>تم إرسال طلبك بنجاح.</strong><br>سيتواصل معك فريقنا خلال 24 ساعة عمل.'
            );
            form.reset();
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
          }
          if (/activation|activate/i.test(msg)) {
            showFeedback(
              feedback,
              'pending',
              '<strong>تفعيل لمرة واحدة مطلوب.</strong><br>تم إرسال رابط تفعيل إلى <strong>dot4life.team@gmail.com</strong>. افتح البريد واضغط «Activate Form»، ثم أعد إرسال الطلب.'
            );
            return;
          }
          showFeedback(
            feedback,
            'error',
            'تعذّر إرسال الطلب. جرّب مرة أخرى أو تواصل عبر واتساب: <a href="https://wa.me/966502786513" target="_blank" rel="noopener">+966 50 278 6513</a>'
          );
        })
        .catch(function () {
          showFeedback(
            feedback,
            'error',
            'تعذّر إرسال الطلب. تحقق من الاتصال بالإنترنت أو تواصل عبر واتساب.'
          );
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = label;
          }
        });
    });
  }

  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(wireForm);
})();
