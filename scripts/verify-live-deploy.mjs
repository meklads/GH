#!/usr/bin/env node
/**
 * Post-deploy smoke checks for 3dgraphicshouse.com
 * Run: node scripts/verify-live-deploy.mjs
 */
const BASE = process.env.GH_LIVE_URL || 'https://3dgraphicshouse.com';

const PATHS = [
  '/',
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
if (home?.body) {
  for (const asset of ['gh-performance.js?v=10', 'gh-cta-track.js?v=1', 'gh-site-enhancements.css?v=23']) {
    console.log(home.body.includes(asset) ? 'OK' : 'WARN missing', asset, 'on homepage');
  }
}

if (failed.length) {
  console.error(`\n${failed.length} path(s) not live — redeploy Coolify and purge Cloudflare cache.`);
  process.exit(1);
}

console.log('\nLive deploy verification passed.');
