#!/usr/bin/env node
/**
 * Applies the SEO overrides in scripts/seo-overrides.json to the built HTML.
 *
 * Runs near the end of `npm run build`, after the generators, so hand-tuned
 * titles, descriptions, hidden H1s, schema links and internal links survive
 * every rebuild. Every operation is idempotent: running it twice changes nothing.
 *
 *   node scripts/apply-seo-overrides.mjs          apply
 *   node scripts/apply-seo-overrides.mjs --check  report what would change, write nothing
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/seo-overrides.json'), 'utf8'));

const SKIP_DIRS = new Set(['node_modules', 'scripts', 'docs', '.git', '.github', 'src', 'workers', '.trash', '.cursor']);
const HIDDEN_H1_STYLE = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html')) {
      out.push(path.relative(ROOT, path.join(dir, e.name)).split(path.sep).join('/'));
    }
  }
  return out;
}

const attr = (v) => String(v).replace(/"/g, '&quot;');

function setTag(html, re, build) {
  return re.test(html) ? html.replace(re, build) : html;
}

function applyPage(html, o) {
  if (o.title) html = setTag(html, /<title>[\s\S]*?<\/title>/, () => `<title>${o.title}</title>`);
  if (o.description) {
    html = setTag(html, /(<meta name="description" content=")[^"]*(")/, (_, a, b) => a + attr(o.description) + b);
  }
  const og = o.ogTitle || o.title;
  if (og) {
    html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, (_, a, b) => a + attr(og) + b);
    html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, (_, a, b) => a + attr(og) + b);
  }
  if (o.description) {
    html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, (_, a, b) => a + attr(o.description) + b);
    html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, (_, a, b) => a + attr(o.description) + b);
  }
  if (o.hiddenH1 && !/<h1[\s>]/i.test(html)) {
    html = html.replace(/<body[^>]*>/i, (m) => `${m}\n<h1 style="${HIDDEN_H1_STYLE}">${o.hiddenH1}</h1>`);
  }
  if (o.sameAs && !html.includes('"sameAs"')) {
    const list = o.sameAs.map((u) => `"${u}"`).join(', ');
    html = html.replace(/"@type":\s*"(ProfessionalService|LocalBusiness|Organization)",/, (m) => `${m} "sameAs": [${list}],`);
  }
  for (const ins of o.inserts || []) {
    if (ins.unless && html.includes(ins.unless)) continue;
    const re = new RegExp(ins.anchor);
    if (!re.test(html)) continue;
    html = html.replace(re, (m) => (ins.position === 'before' ? ins.html + m : m + ins.html));
  }
  return html;
}

function applyGlobal(html, rel) {
  for (const rule of cfg.footerLinks || []) {
    if (html.includes(rule.unless)) continue;
    const re = new RegExp(`([ \\t]*)<a href="([^"]*?)${rule.afterHref.replace(/[.]/g, '\\.')}">${rule.afterText}</a>\\n`);
    html = html.replace(re, (m, indent, prefix) => `${m}${indent}<a href="${prefix}${rule.href}">${rule.text}</a>\n`);
  }
  const t = cfg.trimLongTitles;
  if (t && new RegExp(t.pathPattern).test(rel)) {
    html = html.replace(/<title>([\s\S]*?)<\/title>/, (m, inner) =>
      inner.length > t.maxLength && inner.endsWith(t.suffix) ? `<title>${inner.slice(0, -t.suffix.length)}</title>` : m);
  }
  return html;
}

const files = walk(ROOT);
let changed = 0;
for (const rel of files) {
  const full = path.join(ROOT, rel);
  const before = fs.readFileSync(full, 'utf8');
  let html = before;
  if (/^partials\//.test(rel)) {
    html = applyGlobal(html, rel);
  } else {
    if (/name=["']robots["'][^>]*noindex/i.test(html) || /http-equiv=["']refresh["']/i.test(html)) continue;
    html = applyGlobal(html, rel);
    if (cfg.pages[rel]) html = applyPage(html, cfg.pages[rel]);
  }
  if (html !== before) {
    changed++;
    if (CHECK) console.log('would change', rel);
    else fs.writeFileSync(full, html);
  }
}
const missing = Object.keys(cfg.pages).filter((p) => !fs.existsSync(path.join(ROOT, p)));
if (missing.length) console.warn('apply-seo-overrides: pages not found:', missing.join(', '));
console.log(`apply-seo-overrides: ${changed} file(s) ${CHECK ? 'would change' : 'updated'}`);
