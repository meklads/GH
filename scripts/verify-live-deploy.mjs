#!/usr/bin/env node
/**
 * Post-deploy smoke checks for 3dgraphicshouse.com
 * Run: node scripts/verify-live-deploy.mjs
 */
const BASE = process.env.GH_LIVE_URL || 'https://3dgraphicshouse.com';

const PATHS = [
  '/services/maquettes-en.html',
  '/services/rendering-en.html',
  '/services/ai-solutions-en.html',
  '/portfolio-en.html',
  '/insights/index-en.html',
];

async function check(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  return { path, status: res.status, ok: res.status === 200 };
}

const results = await Promise.all(PATHS.map(check));
const failed = results.filter((r) => !r.ok);

for (const r of results) {
  console.log(r.ok ? 'OK' : 'FAIL', r.status, r.path);
}

if (failed.length) {
  console.error(`\n${failed.length} path(s) not live — redeploy Coolify and purge Cloudflare cache.`);
  process.exit(1);
}

console.log('\nLive deploy verification passed.');
