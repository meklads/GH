#!/usr/bin/env node
/**
 * Repair broken headers, remove duplicate legacy nav, inject shared header assets.
 * Run: node scripts/repair-pages.mjs && node scripts/sync-layout.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const BROKEN_STYLE = /<style>\s*\/\* ===== STANDARD HEADER ===== \*\/[\s\S]*?<\/style>/;
const REVEAL_IN_STYLE = /(\n\}\s*\n)(\(function\(\)\{var els=document\.querySelectorAll\("\.reveal"\)[\s\S]*?\}\)\(\)\s*)/;

const LEGACY_MOB = /<!-- ── Left Contact Strip[\s\S]*?<nav id="main-nav"[\s\S]*?<\/nav>\s*/;
const LEGACY_AFTER_HEADER = /<\/header>(?=<img[\s\S]*?<\/div>\s*(?:<div id="cur-dot"|<nav id="main-nav"))|<\/header>\s*<div id="cur-dot"[\s\S]*?<nav id="main-nav"[\s\S]*?<\/nav>\s*/;

const HEADER_ASSETS = (depth) => {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return `\n<link rel="stylesheet" href="${p}assets/site-header.css">\n<script defer src="${p}assets/site-header.js"></script>\n`;
};

const REVEAL_ASSETS = (depth) => {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return `<script defer src="${p}assets/site-reveal.js"></script>\n`;
};

function hasRevealObserver(html) {
  return html.includes('site-reveal.js') || html.includes('IntersectionObserver');
}

function injectRevealAssets(html, depth) {
  const needsReveal =
    /\bclass="[^"]*\breveal\b/.test(html) ||
    /\bclass='[^']*\breveal\b/.test(html) ||
    html.includes('gallery-video');
  if (!needsReveal) return html;
  if (hasRevealObserver(html)) {
    return html.replace(/site-reveal\.js(\?v=\d+)?/g, 'site-reveal.js?v=2');
  }
  const tag = REVEAL_ASSETS(depth).replace('site-reveal.js', 'site-reveal.js?v=2');
  if (html.includes('</head>')) {
    return html.replace('</head>', `${tag}</head>`);
  }
  return html;
}

function depthOf(rel) {
  return rel.split('/').length - 1;
}

function hasHeaderAssets(html, depth) {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return html.includes(`${p}assets/site-header.css`);
}

function injectHeaderAssets(html, depth) {
  if (hasHeaderAssets(html, depth)) return html;
  const tag = HEADER_ASSETS(depth);
  if (html.includes('</head>')) {
    return html.replace('</head>', `${tag}</head>`);
  }
  return html;
}

function repairHead(html) {
  let out = html;
  if (BROKEN_STYLE.test(out)) {
    out = out.replace(BROKEN_STYLE, '');
  }
  if (REVEAL_IN_STYLE.test(out)) {
    out = out.replace(REVEAL_IN_STYLE, '$1');
    if (!out.includes('IntersectionObserver(function(entries)')) {
      out = out.replace(
        '</body>',
        `<script>(function(){var els=document.querySelectorAll(".reveal");if(!els.length)return;var ro=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add("visible");ro.unobserve(e.target)}})},{threshold:0.1});els.forEach(function(el){ro.observe(el)})})();</script>\n</body>`
      );
    }
  }
  // Move Google Analytics out of <style> blocks (corrupted markup)
  out = out.replace(
    /(\n)(<!-- Google Analytics -->[\s\S]*?<\/script>\s*\n)(<\/style>)/g,
    '\n</style>\n$2'
  );
  out = out.replace(/<style>\s*<!-- Google Analytics -->/g, '</style>\n<!-- Google Analytics -->');
  // Ensure open style block is closed before </head> if needed
  const head = out.match(/<head>[\s\S]*?<\/head>/);
  if (head && (head[0].match(/<style/g) || []).length > (head[0].match(/<\/style>/g) || []).length) {
    out = out.replace('</head>', '</style>\n</head>');
  }
  return out;
}

function removeLegacyNav(html) {
  let out = html;
  if (LEGACY_MOB.test(out)) {
    out = out.replace(LEGACY_MOB, '</header>\n');
  } else if (LEGACY_AFTER_HEADER.test(out)) {
    out = out.replace(LEGACY_AFTER_HEADER, '</header>\n');
  }
  out = out.replace(
    /<\/header>\s*<\/div><\/div>\s*<div id="cur-dot"[\s\S]*?<\/header>/g,
    '</header>'
  );
  out = out.replace(/<div id="cur-dot" aria-hidden="true"><\/div><div id="cur-ring" aria-hidden="true"><\/div>\s*/g, '');
  out = out.replace(/\n\)\(\);\s*\n<\/script>/g, '\n</script>');
  out = out.replace(
    /\nfunction toggleMenu\(\)\{var n=document\.getElementById\("nav"\);n\.classList\.toggle\("open"\)\}\n/g,
    '\n'
  );
  return out;
}

function fixHomeLinks(html, depth) {
  const home = depth > 0 ? '../'.repeat(depth).replace(/\/$/, '') || '..' : '/';
  return html
    .replace(/href="\.\."(?=[^>]*class="logo")/g, `href="${home}"`)
    .replace(/href="\.\.(?=" style="color:#fff[^"]*">EN<)/g, `href="${home}"`);
}

function collectHtmlFiles(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'partials', 'scripts', 'node_modules'].includes(ent.name)) continue;
      out.push(...collectHtmlFiles(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

const SKIP = new Set(['home-v2-backup.html', 'en-backup.html', 'en-v2.html', 'offer-lite.html', 'gh-admin.html']);

let fixed = 0;
for (const rel of collectHtmlFiles(ROOT)) {
  if (SKIP.has(rel)) continue;
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  if (!html.includes('<header class="header"')) continue;

  const before = html;
  const depth = depthOf(rel);
  html = repairHead(html);
  html = removeLegacyNav(html);
  html = fixHomeLinks(html, depth);
  html = injectHeaderAssets(html, depth);
  html = injectRevealAssets(html, depth);

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    fixed++;
    console.log('repaired:', rel);
  }
}

console.log(`Repaired ${fixed} files`);
