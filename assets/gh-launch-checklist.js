(function () {
  'use strict';

  var list = document.getElementById('ghLaunchChecklist');
  if (!list) return;

  var bar = document.querySelector('.gh-progress-bar span');
  var items = list.querySelectorAll('li');

  function update() {
    var done = 0;
    items.forEach(function (li) {
      var cb = li.querySelector('input[type="checkbox"]');
      if (cb && cb.checked) {
        li.classList.add('done');
        done += 1;
      } else {
        li.classList.remove('done');
      }
    });
    if (bar) bar.style.width = Math.round((done / items.length) * 100) + '%';
    if (done === items.length && items.length && window.ghTrack && list.dataset.ghChecklistTracked !== '1') {
      list.dataset.ghChecklistTracked = '1';
      window.ghTrack('launch_checklist_complete', { page_path: location.pathname });
    }
  }

  items.forEach(function (li) {
    var cb = li.querySelector('input[type="checkbox"]');
    if (cb) cb.addEventListener('change', update);
    li.addEventListener('click', function (e) {
      if (e.target.tagName === 'INPUT') return;
      var c = li.querySelector('input[type="checkbox"]');
      if (c) { c.checked = !c.checked; update(); }
    });
  });

  var printBtn = document.getElementById('ghPrintChecklist');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
})();
