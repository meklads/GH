#!/usr/bin/env node
/**
 * Add dialog semantics and form labels to homepage enquiry popup.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const PATCHES = {
  'index.html': {
    popupOpen:
      '<div id="ghPopup" role="dialog" aria-modal="true" aria-labelledby="ghPopupTitle" onclick="if(event.target===this)ghClosePopup()">',
    title: '<div class="gh-popup-title" id="ghPopupTitle">Register Your Interest</div>',
    closeBtn:
      '<button type="button" class="gh-popup-close" data-gh-popup-close aria-label="Close">✕</button>',
    mailBtn:
      '<button type="button" class="gh-float-btn gh-float-mail" data-gh-popup-open title="Register Your Interest">',
    fields: [
      ['ghName', 'Full Name *', 'text'],
      ['ghCompany', 'Company / Developer', 'text'],
      ['ghPhone', 'Phone / WhatsApp *', 'tel'],
      ['ghBrief', 'Brief about your project', 'textarea'],
    ],
    projectLabel: 'Project Type *',
  },
  'index-ar.html': {
    popupOpen:
      '<div id="ghPopup" role="dialog" aria-modal="true" aria-labelledby="ghPopupTitle" onclick="if(event.target===this)ghClosePopup()">',
    title: '<div class="gh-popup-title" id="ghPopupTitle">سجّل اهتمامك بمشروعك</div>',
    closeBtn:
      '<button type="button" class="gh-popup-close" data-gh-popup-close aria-label="إغلاق">✕</button>',
    mailBtn:
      '<button type="button" class="gh-float-btn gh-float-mail" data-gh-popup-open title="سجّل اهتمامك">',
    fields: [
      ['ghName', 'الاسم الكامل', 'text'],
      ['ghCompany', 'الشركة / المطوّر العقاري', 'text'],
      ['ghPhone', 'الجوال / واتساب', 'tel'],
      ['ghBrief', 'نبذة مختصرة عن مشروعك', 'textarea'],
    ],
    projectLabel: 'نوع المشروع',
  },
};

function labelFor(id, text) {
  return `<label class="gh-sr-only" for="${id}">${text}</label>`;
}

function patchFile(rel, cfg) {
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  html = html.replace(
    /<div id="ghPopup"[^>]*>/,
    cfg.popupOpen
  );
  html = html.replace(
    /<div class="gh-popup-title"[^>]*>[^<]*<\/div>/,
    cfg.title
  );
  html = html.replace(
    /<button class="gh-popup-close"[^>]*>✕<\/button>/,
    cfg.closeBtn
  );
  html = html.replace(
    /<button class="gh-float-btn gh-float-mail" onclick="document\.getElementById\('ghPopup'\)\.classList\.add\('open'\)"[^>]*>/,
    cfg.mailBtn
  );

  for (const [id, label, type] of cfg.fields) {
    if (type === 'textarea') {
      html = html.replace(
        new RegExp(`<textarea class="gh-field" id="${id}"`),
        `${labelFor(id, label)}\n      <textarea class="gh-field" id="${id}" aria-label="${label}"`
      );
    } else {
      html = html.replace(
        new RegExp(`<input class="gh-field" type="${type}" id="${id}"`),
        `${labelFor(id, label)}\n      <input class="gh-field" type="${type}" id="${id}" aria-label="${label}"`
      );
    }
  }

  html = html.replace(
    /<select class="gh-field" id="ghProject"/,
    `${labelFor('ghProject', cfg.projectLabel)}\n      <select class="gh-field" id="ghProject" aria-label="${cfg.projectLabel}"`
  );

  if (!html.includes('gh-float-widgets.js')) {
    html = html.replace(
      /<\/body>/i,
      '<script defer src="assets/gh-float-widgets.js?v=2"></script>\n</body>'
    );
  } else {
    html = html.replace(/gh-float-widgets\.js\?v=\d+/g, 'gh-float-widgets.js?v=2');
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    console.log('  popup a11y:', rel);
  }
}

console.log('Patching homepage popup a11y…');
for (const [rel, cfg] of Object.entries(PATCHES)) {
  patchFile(rel, cfg);
}
console.log('Done.');
