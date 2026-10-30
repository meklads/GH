#!/usr/bin/env node
/**
 * Safe single-article update.
 *
 *   npm run article -- <slug>
 *
 * Why: the committed HTML has hand-applied layers (perf hints, header version,
 * icon subset, Bees Motion footer links, etc.) that the full `npm run build`
 * does not reproduce. Running the full build rewrites ~340 files and regresses
 * the live site. This script renders ONE article from insights/data/articles/<slug>.json
 * and splices only the parts that belong to the article into the committed pages:
 *   - <title>, description, keywords, og/twitter text, article:* meta
 *   - JSON-LD
 *   - <main> (keeping the committed "solutions" footer block)
 * It also refreshes the insights hub card, the sitemap lastmod and the article OG images.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
if (!slug) {
  console.error('Usage: npm run article -- <slug>');
  process.exit(1);
}
const dataPath = path.join(ROOT, 'insights/data/articles', `${slug}.json`);
if (!fs.existsSync(dataPath)) {
  console.error(`No article data: ${dataPath}`);
  process.exit(1);
}
const article = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-article-'));
execFileSync('node', [path.join(ROOT, 'scripts/build-insights.mjs')], {
  stdio: 'inherit',
  env: { ...process.env, INSIGHTS_ARTICLE_ONLY: slug, INSIGHTS_OUT_DIR: tmp },
});

function replaceOnce(src, re, replacement, label, file) {
  const m = src.match(re);
  if (!m) {
    console.warn(`  ! ${label} not found in ${file}`);
    return src;
  }
  return src.slice(0, m.index) + replacement + src.slice(m.index + m[0].length);
}

function solutionsRange(html) {
  const i = html.indexOf('<div class="gh-article-solutions">');
  if (i < 0) return null;
  const j = html.indexOf('<div class="gh-article-footer-cta">', i);
  if (j < 0) return null;
  const k = html.indexOf('</div>', j) + 6;
  return [i, k];
}

const META_KEYS = [
  'name="description"',
  'name="keywords"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image:alt"',
  'name="twitter:title"',
  'name="twitter:description"',
];

for (const suffix of ['', '-en']) {
  const file = `insights/articles/${slug}${suffix}.html`;
  const committedPath = path.join(ROOT, file);
  const generated = fs.readFileSync(path.join(tmp, `${slug}${suffix}.html`), 'utf8');
  if (!fs.existsSync(committedPath)) {
    fs.writeFileSync(committedPath, generated, 'utf8');
    console.log(`  new page written: ${file} (no committed copy existed)`);
    continue;
  }
  let html = fs.readFileSync(committedPath, 'utf8');

  // <main>: take the generated one, keep the committed solutions footer block
  const cm = [html.indexOf('<main'), html.indexOf('</main>')];
  const gm = [generated.indexOf('<main'), generated.indexOf('</main>')];
  let newMain = generated.slice(gm[0], gm[1]);
  const oldMain = html.slice(cm[0], cm[1]);
  const cr = solutionsRange(oldMain);
  const gr = solutionsRange(newMain);
  if (cr && gr) newMain = newMain.slice(0, gr[0]) + oldMain.slice(cr[0], cr[1]) + newMain.slice(gr[1]);
  html = html.slice(0, cm[0]) + newMain + html.slice(cm[1]);

  // JSON-LD
  const ld = generated.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/);
  html = replaceOnce(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, ld[0], 'JSON-LD', file);

  // title
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, generated.match(/<title>[\s\S]*?<\/title>/)[0], 'title', file);

  // meta tags
  for (const key of META_KEYS) {
    const re = new RegExp(`<meta ${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} content="[^"]*"\\s*/?>`);
    const g = generated.match(re);
    if (g) html = replaceOnce(html, re, g[0], key, file);
  }
  const artRe = /<meta property="article:published_time"[\s\S]*?<meta property="article:section"[^>]*>/;
  const ga = generated.match(artRe);
  if (ga) html = replaceOnce(html, artRe, ga[0], 'article meta', file);

  fs.writeFileSync(committedPath, html, 'utf8');
  console.log(`  spliced: ${file}`);
}

// Insights hub card (title, excerpt, image, read time)
for (const [hub, lang, suffix] of [
  ['insights/index.html', 'ar', ''],
  ['insights/index-en.html', 'en', '-en'],
]) {
  const hubPath = path.join(ROOT, hub);
  let html = fs.readFileSync(hubPath, 'utf8');
  const href = `articles/${slug}${suffix}.html`;
  const linkIdx = html.indexOf(`href="${href}" class="gh-ins-card-link"`);
  if (linkIdx < 0) continue;
  const start = html.lastIndexOf('<article', linkIdx);
  const end = html.indexOf('</article>', linkIdx);
  let card = html.slice(start, end);
  const title = article.title[lang];
  const excerpt = article.excerpt[lang];
  const page = fs.readFileSync(path.join(ROOT, `insights/articles/${slug}${suffix}.html`), 'utf8');
  const readTime = (page.match(/gh-ins-read-time">([^<]*)</) || [])[1];
  card = card
    .replace(/(<figure class="gh-ins-card-media"><img src=")[^"]*(" alt=")[^"]*(")/, `$1../${article.image}$2${title}$3`)
    .replace(/<h3>[\s\S]*?<\/h3>/, `<h3>${title}</h3>`)
    .replace(/(<p class="gh-ins-card-excerpt">)[\s\S]*?(<\/p>)/, `$1${excerpt}$2`);
  if (readTime) card = card.replace(/(<span class="gh-ins-read-time">)[^<]*(<\/span>)/, `$1${readTime}$2`);
  html = html.slice(0, start) + card + html.slice(end);
  fs.writeFileSync(hubPath, html, 'utf8');
  console.log(`  hub card: ${hub}`);
}

// Sitemap lastmod
const smPath = path.join(ROOT, 'sitemap.xml');
const lastmod = article.dateModified || new Date().toISOString().slice(0, 10);
let sm = fs.readFileSync(smPath, 'utf8');
for (const suffix of ['', '-en']) {
  const loc = `https://3dgraphicshouse.com/insights/articles/${slug}${suffix}.html`;
  sm = sm.replace(
    new RegExp(`(<loc>${loc.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}</loc><lastmod>)[^<]*(</lastmod>)`),
    `$1${lastmod}$2`
  );
}
fs.writeFileSync(smPath, sm, 'utf8');
console.log(`  sitemap lastmod: ${lastmod}`);

// OG images for this article only
execFileSync('node', [path.join(ROOT, 'scripts/build-article-og-images.mjs')], {
  stdio: 'inherit',
  env: { ...process.env, OG_ONLY: slug },
});

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Done: ${slug}. Review, commit, push, then Redeploy in Coolify.`);
