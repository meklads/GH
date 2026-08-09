#!/usr/bin/env node
/**
 * Patch hand-crafted pages skipped by sync-layout (ProjectLaunch AR, etc.)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function patch(rel, transforms) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  for (const [re, rep] of transforms) {
    html = html.replace(re, rep);
  }
  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    console.log('  patched', rel);
  }
}

console.log('Patching hand-crafted pages…');

patch('solutions/project-launch.html', [
  [/site-header\.css\?v=\d+/g, 'site-header.css?v=35'],
  [/gh-performance\.js\?v=\d+/g, 'gh-performance.js?v=10'],
  [/project-launch-media\.js\?v=\d+/g, 'project-launch-media.js?v=4'],
  [/solution-premium\.css\?v=\d+/g, 'solution-premium.css?v=3'],
  [
    /<link rel="stylesheet" href="\.\.\/assets\/project-launch-premium\.css\?v=2">/,
    '<link rel="stylesheet" href="../assets/project-launch-premium.css?v=2">\n<link rel="stylesheet" href="../assets/solution-premium.css?v=2">',
  ],
]);

if (!fs.readFileSync(path.join(ROOT, 'solutions/project-launch.html'), 'utf8').includes('gh-cta-track.js')) {
  patch('solutions/project-launch.html', [
    [
      /(<script defer src="\.\.\/assets\/gh-performance\.js\?v=10"><\/script>)/,
      '$1\n<script defer src="../assets/gh-cta-track.js?v=1"></script>',
    ],
  ]);
}

patch('solutions/project-launch-en.html', [
  [/site-header\.css\?v=\d+/g, 'site-header.css?v=35'],
  [/gh-performance\.js\?v=\d+/g, 'gh-performance.js?v=10'],
  [/project-launch-media\.js\?v=\d+/g, 'project-launch-media.js?v=4'],
  [/solution-premium\.css\?v=\d+/g, 'solution-premium.css?v=3'],
  [
    /<link rel="stylesheet" href="\.\.\/assets\/project-launch-premium\.css\?v=2">/,
    '<link rel="stylesheet" href="../assets/project-launch-premium.css?v=2">\n<link rel="stylesheet" href="../assets/solution-premium.css?v=3">',
  ],
]);

console.log('Done.');
