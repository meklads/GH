/**
 * Private client hub — password gate + shareable resource list.
 * To add a new private item, append to GH_CLIENT_HUB_ITEMS below.
 */
window.GH_CLIENT_HUB_PASS =
  'f7b074395b6597bf02d3a9a66f11451bbc477e8482d281e3e697c5930f2f748f';

window.GH_CLIENT_HUB_ITEMS = [
  {
    id: 'folio',
    title: { ar: 'ملف الشركة', en: 'Company Profile' },
    desc: {
      ar: 'بروفايل جرافيكس هاوس — للنسخ الخاصة والمشاركات المحدودة.',
      en: 'Graphics House company folio — for private sharing only.',
    },
    href: 'assets/share/folio-private.pdf',
    icon: 'picture_as_pdf',
  },
  {
    id: 'viz3d',
    title: { ar: 'صور ثري دي', en: '3D Images' },
    desc: {
      ar: 'ملف خدمات إنتاج الصور ثلاثية الأبعاد والإظهار المعماري.',
      en: '3D image production & architectural visualization service PDF.',
    },
    href: 'assets/share/viz-3d-private.pdf',
    icon: 'picture_as_pdf',
  },
];

(async function () {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const gate = document.getElementById('ghHubGate');
  const app = document.getElementById('ghHubApp');
  const form = document.getElementById('ghHubForm');
  const input = document.getElementById('ghHubPass');
  const err = document.getElementById('ghHubErr');
  const list = document.getElementById('ghHubList');
  const KEY = 'gh_client_hub_ok_v1';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function unlock() {
    if (gate) gate.hidden = true;
    if (app) app.hidden = false;
    sessionStorage.setItem(KEY, '1');
  }

  function renderItems() {
    if (!list) return;
    const prefix = list.getAttribute('data-prefix') || '';
    list.innerHTML = (window.GH_CLIENT_HUB_ITEMS || [])
      .map((item) => {
        const title = item.title[lang] || item.title.en;
        const desc = item.desc[lang] || item.desc.en;
        const href = prefix + item.href;
        const open = lang === 'en' ? 'Open' : 'فتح';
        return `<article class="gh-hub-card">
          <div class="gh-hub-card__icon"><span class="material-symbols-outlined">${item.icon || 'lock'}</span></div>
          <div class="gh-hub-card__body">
            <h2>${title}</h2>
            <p>${desc}</p>
            <a class="gh-hub-card__btn" href="${href}" target="_blank" rel="noopener noreferrer">${open}</a>
          </div>
        </article>`;
      })
      .join('');
  }

  renderItems();

  if (sessionStorage.getItem(KEY) === '1') {
    unlock();
    return;
  }

  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const hash = await sha256((input.value || '').trim());
    if (hash === window.GH_CLIENT_HUB_PASS) {
      unlock();
      return;
    }
    err.hidden = false;
    input.value = '';
    input.focus();
  });
})();
