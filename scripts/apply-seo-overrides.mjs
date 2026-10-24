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

const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** Builds FAQPage JSON-LD from the visible <details><summary>Q</summary><p>A</p></details> items of a block. */
function faqSchemaFrom(block, rel) {
  const items = [...block.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
    .map(([, q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } }));
  if (!items.length) return '';
  const url = `https://3dgraphicshouse.com/${rel}`;
  return `\n<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', url, mainEntity: items })}</script>\n`;
}

function applyPage(html, o, rel) {
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
    let block = ins.file ? fs.readFileSync(path.join(ROOT, ins.file), 'utf8') : ins.html;
    if (ins.faqSchema && !html.includes('"FAQPage"')) block += faqSchemaFrom(block, rel);
    html = html.replace(re, (m) => (ins.position === 'before' ? block + m : m + block));
  }
  if (o.canonical) {
    html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, (_, a, b) => a + o.canonical + b);
  }
  for (const [lang, href] of Object.entries(o.hreflang || {})) {
    const re = new RegExp(`(<link rel="alternate" hreflang="${lang}" href=")[^"]*(")`);
    html = setTag(html, re, (_, a, b) => a + href + b);
  }
  if (o.schemaType) {
    const { from, to } = o.schemaType;
    html = html.replace(new RegExp(`("@type":\\s*)"${from}"`, 'g'), `$1"${to}"`);
  }
  if (o.localBusinessToService) html = localBusinessToService(html);
  if (o.orgSchema) {
    let done = false;
    html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (m, json) => {
      if (done) return m;
      let d;
      try { d = JSON.parse(json); } catch { return m; }
      if (!d || !['ProfessionalService', 'LocalBusiness', 'Organization'].includes(d['@type'])) return m;
      done = true;
      return `<script type="application/ld+json">${JSON.stringify(o.orgSchema)}</script>`;
    });
  }
  return html;
}

/**
 * City pages without a physical office must not claim a LocalBusiness there.
 * Rewrites that block to a Service offered in the city by the Jeddah-based organization.
 */
function localBusinessToService(html) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (m, json) => {
    let d;
    try { d = JSON.parse(json); } catch { return m; }
    if (!d || d['@type'] !== 'LocalBusiness') return m;
    const city = d.address && d.address.addressLocality;
    const org = d.parentOrganization || { '@type': 'Organization', name: 'Graphics House', url: 'https://3dgraphicshouse.com' };
    const out = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: d.name,
      serviceType: 'Architectural visualization',
      description: d.description,
      url: d.url,
      provider: { ...org, ...(d.telephone ? { telephone: d.telephone } : {}) },
      ...(city ? { areaServed: { '@type': 'City', name: city } } : {}),
    };
    return `<script type="application/ld+json">${JSON.stringify(out)}</script>`;
  });
}

function subsetMaterialIcons(html) {
  const icons = cfg.materialIcons;
  if (!icons || !icons.length) return html;
  const list = [...icons].sort().join(',');
  return html.replace(/href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]*family=Material\+Symbols\+Outlined[^"]*)"/g, (m, url) => {
    if (url.includes('icon_names=')) return m;
    return `href="${url.replace(/(family=Material\+Symbols\+Outlined:[^&"]*)/, `$1&icon_names=${list}`)}"`;
  });
}

function addGa4Ids(html) {
  const { primary, extra } = cfg.ga4 || {};
  if (!primary || !extra || !extra.length) return html;
  const re = new RegExp(`gtag\\(\\s*'config'\\s*,\\s*'${primary}'[^;]*\\);`);
  if (!re.test(html)) return html;
  const missing = extra.filter((id) => !html.includes(`'config','${id}'`));
  if (!missing.length) return html;
  return html.replace(re, (m) => m + missing.map((id) => `gtag('config','${id}');`).join(''));
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

/** Applies to every HTML page, indexable or not. */
function applyEverywhere(html) {
  return addGa4Ids(subsetMaterialIcons(html));
}

/** Warns when a page uses an icon missing from the subset (it would render as plain text). */
function checkIcons(html, rel, missingIcons) {
  if (!cfg.materialIcons) return;
  const known = new Set(cfg.materialIcons);
  for (const m of html.matchAll(/material-symbols-outlined[^>]*>\s*([a-z0-9_]+)\s*</g)) {
    if (!known.has(m[1])) missingIcons.add(`${m[1]} (${rel})`);
  }
}

const files = walk(ROOT);
let changed = 0;
const missingIcons = new Set();
for (const rel of files) {
  const full = path.join(ROOT, rel);
  const before = fs.readFileSync(full, 'utf8');
  let html = applyEverywhere(before);
  checkIcons(html, rel, missingIcons);
  if (/^partials\//.test(rel)) {
    html = applyGlobal(html, rel);
  } else if (!/name=["']robots["'][^>]*noindex/i.test(html) && !/http-equiv=["']refresh["']/i.test(html)) {
    html = applyGlobal(html, rel);
    if (cfg.pages[rel]) html = applyPage(html, cfg.pages[rel], rel);
  }
  if (html !== before) {
    changed++;
    if (CHECK) console.log('would change', rel);
    else fs.writeFileSync(full, html);
  }
}
const missing = Object.keys(cfg.pages).filter((p) => !fs.existsSync(path.join(ROOT, p)));
if (missing.length) console.warn('apply-seo-overrides: pages not found:', missing.join(', '));
if (missingIcons.size) {
  console.warn('apply-seo-overrides: WARN icons not in materialIcons (add them to scripts/seo-overrides.json):');
  for (const i of [...missingIcons].slice(0, 30)) console.warn('  -', i);
}
console.log(`apply-seo-overrides: ${changed} file(s) ${CHECK ? 'would change' : 'updated'}`);
