#!/usr/bin/env node
/**
 * Migrate FormSubmit quote forms → Worker /api/form + ensure quote-form.js v4.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules', 'assets', 'partials', 'scripts', 'workers', '.trash']);

function collectHtml(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (SKIP.has(ent.name)) continue;
      out.push(...collectHtml(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

function prefixFor(rel) {
  const depth = rel.split('/').length - 1;
  return depth > 0 ? '../'.repeat(depth) : '';
}

function migrate(html, rel) {
  if (!html.includes('formsubmit.co') && !html.includes('gh-quote-form') && !html.includes('quote-form.js')) {
    return null;
  }

  let out = html;
  const p = prefixFor(rel);

  out = out.replace(/\s*action="https:\/\/formsubmit\.co\/[^"]*"/gi, '');
  out = out.replace(/\s*<input type="hidden" name="_next" value="[^"]*"\s*\/?>\s*/gi, '\n');
  out = out.replace(/\s*<input type="hidden" name="_captcha" value="[^"]*"\s*\/?>\s*/gi, '\n');
  out = out.replace(/name="_honey"/g, 'name="botcheck"');

  out = out.replace(/<form\b([^>]*)>/gi, (full, attrs) => {
    // Never touch float popup forms handled by gh-float-widgets.js
    if (/ghSubmit/i.test(attrs) || /id="ghPopup"/i.test(html.slice(Math.max(0, html.indexOf(full) - 400), html.indexOf(full)))) {
      return full;
    }
    const isQuote =
      /\bgh-quote-form\b/.test(attrs) ||
      /\bpn-form\b/.test(attrs);
    if (!isQuote) return full;
    let a = attrs;
    if (!/\bmethod=/i.test(a)) a += ' method="POST"';
    if (!/\bnovalidate\b/i.test(a)) a += ' novalidate';
    a = a.replace(/\s*target="_blank"/i, '');
    return `<form${a}>`;
  });

  const touchesQuotes =
    out.includes('gh-quote-form') ||
    html.includes('formsubmit.co') ||
    html.includes('quote-form.js');

  if (touchesQuotes) {
    if (!out.includes('gh-forms-config.js')) {
      out = out.replace(/<head([^>]*)>/i, `<head$1>\n<script src="${p}assets/gh-forms-config.js?v=2"></script>`);
    }
    if (!out.includes('quote-form-config.js')) {
      out = out.replace(/<\/body>/i, `<script src="${p}assets/quote-form-config.js"></script>\n</body>`);
    }
    if (!out.includes('quote-form.js')) {
      out = out.replace(
        /<\/body>/i,
        `<script defer src="${p}assets/quote-form.js?v=4"></script>\n</body>`
      );
    } else {
      out = out.replace(/quote-form\.js(?:\?v=\d+)?/g, 'quote-form.js?v=4');
    }
  }

  return out === html ? null : out;
}

let n = 0;
for (const rel of collectHtml(ROOT)) {
  const full = path.join(ROOT, rel);
  const before = fs.readFileSync(full, 'utf8');
  if (!before.includes('formsubmit.co') && !before.includes('quote-form.js') && !before.includes('gh-quote-form')) {
    continue;
  }
  const next = migrate(before, rel);
  if (!next) continue;
  fs.writeFileSync(full, next, 'utf8');
  console.log('  migrated:', rel);
  n += 1;
}
console.log(`Done — migrated ${n} page(s).`);
