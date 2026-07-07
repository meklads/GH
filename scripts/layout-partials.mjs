/**
 * Canonical header/footer partials for GH static pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PARTIALS = path.join(ROOT, 'partials');

export function renderPartial(name, depth, isEn) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const home = isEn
    ? depth > 0
      ? `${prefix}index.html`
      : '/'
    : depth > 0
      ? `${prefix}index-ar.html`
      : '/index-ar.html';
  return fs
    .readFileSync(path.join(PARTIALS, name), 'utf8')
    .replaceAll('{{PREFIX}}', prefix)
    .replaceAll('{{HOME}}', home);
}

export function renderFooter(depth, isEn) {
  return renderPartial(isEn ? 'footer-en.html' : 'footer-ar.html', depth, isEn);
}

export function renderHeader(depth, isEn) {
  return renderPartial(isEn ? 'header-en.html' : 'header-ar.html', depth, isEn);
}

export function getLayout(lang, depth = 0) {
  const isEn = lang === 'en';
  return {
    header: renderHeader(depth, isEn),
    footer: renderFooter(depth, isEn),
  };
}
