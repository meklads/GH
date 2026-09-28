#!/usr/bin/env node
/**
 * Site hygiene batch: redirects for duplicate case studies, legacy link rewrites.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function redirectWithResolvedCanonical(rel, targetHref, title) {
  const fromDir = path.posix.dirname(rel.replace(/\\/g, '/'));
  let resolved = targetHref;
  if (!targetHref.startsWith('http') && !targetHref.startsWith('/')) {
    const parts = (fromDir === '.' ? '' : fromDir + '/') + targetHref;
    const stack = [];
    for (const p of parts.split('/')) {
      if (!p || p === '.') continue;
      if (p === '..') stack.pop();
      else stack.push(p);
    }
    resolved = stack.join('/');
  } else if (targetHref.startsWith('/')) {
    resolved = targetHref.slice(1);
  }
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0;url=${targetHref}">
<link rel="canonical" href="https://3dgraphicshouse.com/${resolved}">
<title>${title}</title>
<script>location.replace(${JSON.stringify(targetHref)}+location.search+location.hash);</script>
</head>
<body><p><a href="${targetHref}">Continue</a></p></body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, rel), html);
  console.log('redirect', rel, '→', targetHref);
}

// Thinner insights duplicates → richer canonicals
redirectWithResolvedCanonical(
  'insights/projects/jeddah-forum.html',
  '../../case-studies/jeddah-real-estate-forum.html',
  'Jeddah Forum Case Study'
);
redirectWithResolvedCanonical(
  'insights/projects/jeddah-forum-en.html',
  '../../case-studies/jeddah-real-estate-forum-en.html',
  'Jeddah Forum Case Study'
);
redirectWithResolvedCanonical(
  'insights/projects/makkah-charter-mwl.html',
  '../../casestudy-mwl.html',
  'MWL Case Study'
);
redirectWithResolvedCanonical(
  'insights/projects/makkah-charter-mwl-en.html',
  '../../casestudy-mwl-en.html',
  'MWL Case Study'
);

// Overlapping interactive service
redirectWithResolvedCanonical(
  'services/interactive.html',
  'interactive-experiences.html',
  'Interactive Experiences'
);
if (fs.existsSync(path.join(ROOT, 'services/interactive-en.html'))) {
  redirectWithResolvedCanonical(
    'services/interactive-en.html',
    'interactive-experiences-en.html',
    'Interactive Experiences'
  );
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'assets', 'partials', 'scripts', '.trash'].includes(ent.name))
      continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function isArabicPage(rel, html) {
  if (/dir=["']rtl["']/i.test(html) || /\slang=["']ar["']/i.test(html)) return true;
  if (/-en\.html$/i.test(rel)) return false;
  if (/index\.html$/i.test(rel) && !/index-ar/.test(rel)) return false;
  return !/-en\.html$/i.test(rel);
}

const SHARED = [
  [/href="([^"]*?)3d-animation\.html"/g, 'href="$1services/animation.html"'],
  [/href="([^"]*?)3d-animation-en\.html"/g, 'href="$1services/animation-en.html"'],
  [/href="([^"]*?)smart-maquettes\.html"/g, 'href="$1services/maquettes.html"'],
  [/href="([^"]*?)smart-maquettes-en\.html"/g, 'href="$1services/maquettes-en.html"'],
  [/href="([^"]*?)media-production\.html"/g, 'href="$1services/production.html"'],
  [/href="([^"]*?)media-production-en\.html"/g, 'href="$1services/production-en.html"'],
  // Do NOT prefix interactive-experiences when already under services/
  [/href="((?:\.\.\/)*services\/)interactive\.html"/g, 'href="$1interactive-experiences.html"'],
  [/href="((?:\.\.\/)*services\/)interactive-en\.html"/g, 'href="$1interactive-experiences-en.html"'],
  // Prefer richer case-study URLs when linking to thin insights clones
  [/insights\/projects\/jeddah-forum\.html/g, 'case-studies/jeddah-real-estate-forum.html'],
  [/insights\/projects\/jeddah-forum-en\.html/g, 'case-studies/jeddah-real-estate-forum-en.html'],
  [/insights\/projects\/makkah-charter-mwl\.html/g, 'casestudy-mwl.html'],
  [/insights\/projects\/makkah-charter-mwl-en\.html/g, 'casestudy-mwl-en.html'],
];

let changed = 0;
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  let html = fs.readFileSync(file, 'utf8');
  if (html.length < 800 && /http-equiv="refresh"/i.test(html)) continue;
  const before = html;
  const ar = isArabicPage(rel, html);
  const inServices = rel.startsWith('services/');

  for (const [re, rep] of SHARED) html = html.replace(re, rep);

  // Outside services/: bare interactive-experiences → services/...
  if (!inServices) {
    html = html.replace(
      /href="((?:\.\.\/)*)interactive-experiences\.html"/g,
      'href="$1services/interactive-experiences.html"'
    );
    html = html.replace(
      /href="((?:\.\.\/)*)interactive-experiences-en\.html"/g,
      'href="$1services/interactive-experiences-en.html"'
    );
  } else {
    // Inside services/: drop accidental services/ prefix
    html = html.replace(/href="services\/interactive-experiences\.html"/g, 'href="interactive-experiences.html"');
    html = html.replace(/href="services\/interactive-experiences-en\.html"/g, 'href="interactive-experiences-en.html"');
  }

  if (ar) {
    html = html.replace(/case-study-anan-eskan-en\.html/g, 'insights/projects/anan-eskan-riyadh.html');
    html = html.replace(/case-study-alrajhi-en\.html/g, 'insights/projects/al-rajhi-riyadh.html');
    html = html.replace(/case-study-mwl-en\.html/g, 'casestudy-mwl.html');
  } else {
    html = html.replace(/case-study-anan-eskan-en\.html/g, 'insights/projects/anan-eskan-riyadh-en.html');
    html = html.replace(/case-study-alrajhi-en\.html/g, 'insights/projects/al-rajhi-riyadh-en.html');
    html = html.replace(/case-study-mwl-en\.html/g, 'casestudy-mwl-en.html');
  }

  // Fix double-prefixed paths from nested dirs
  html = html.replace(/insights\/projects\/insights\/projects\//g, 'insights/projects/');
  html = html.replace(/case-studies\/case-studies\//g, 'case-studies/');
  html = html.replace(/services\/services\//g, 'services/');

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed++;
    console.log('rewrote', rel);
  }
}
console.log('files changed', changed);
