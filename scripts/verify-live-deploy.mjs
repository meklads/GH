#!/usr/bin/env node
/**
 * Post-deploy smoke checks for 3dgraphicshouse.com
 * Run: node scripts/verify-live-deploy.mjs
 */
const BASE = process.env.GH_LIVE_URL || 'https://3dgraphicshouse.com';

const PATHS = [
  '/',
  '/index-ar.html',
  '/solutions/project-launch.html',
  '/solutions/project-launch-en.html',
  '/services/maquettes-en.html',
  '/solutions/growth-launch-en.html',
  '/insights/index-en.html',
];

async function fetchText(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  return { path, status: res.status, ok: res.status === 200, body: res.ok ? await res.text() : '' };
}

const results = await Promise.all(PATHS.map(fetchText));
const failed = results.filter((r) => !r.ok);

for (const r of results) {
  console.log(r.ok ? 'OK' : 'FAIL', r.status, r.path);
}

const home = results.find((r) => r.path === '/');
const pl = results.find((r) => r.path === '/solutions/project-launch.html');
const requiredAssets = [
  ['gh-performance.js?v=10', home?.body],
  ['gh-cta-track.js?v=1', home?.body],
  ['gh-site-enhancements.css?v=', home?.body],
  ['gl-ecosystem', pl?.body],
  ['gh-performance.js?v=10', pl?.body],
];
let assetWarnings = 0;
for (const [asset, body] of requiredAssets) {
  if (!body) continue;
  if (body.includes(asset)) {
    console.log('OK', asset, asset.startsWith('gh-') || asset.startsWith('gl-') ? 'on live' : '');
  } else {
    console.log('WARN missing', asset, '— redeploy Coolify + purge Cloudflare');
    assetWarnings += 1;
  }
}
if (assetWarnings) {
  console.log(`\n${assetWarnings} asset(s) stale on live — push is on GitHub but CDN/server may need refresh.`);
}

if (failed.length) {
  console.error(`\n${failed.length} path(s) not live — redeploy Coolify and purge Cloudflare cache.`);
  process.exit(1);
}

console.log('\nLive deploy verification passed.');
