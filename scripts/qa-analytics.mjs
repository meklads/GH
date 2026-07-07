#!/usr/bin/env node
/**
 * QA: GA4 + Google Search Console config
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readAnalyticsConfig } from './analytics-snippet.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = readAnalyticsConfig();
let ok = true;

if (!cfg.enabled || !cfg.ga4MeasurementId) {
  console.error('FAIL: GA4 not configured in assets/gh-analytics-config.js');
  ok = false;
} else {
  console.log('OK: GA4', cfg.ga4MeasurementId);
}

if (!cfg.googleSiteVerification) {
  console.warn('WARN: googleSiteVerification is empty — run npm run gsc:apply -- TOKEN');
} else {
  console.log('OK: GSC verification token set');
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  if (!index.includes(`content="${cfg.googleSiteVerification}"`)) {
    console.warn('WARN: index.html missing GSC meta — run npm run build');
  } else {
    console.log('OK: GSC meta tag present on homepage');
  }
}

const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const urlCount = (sm.match(/<loc>/g) || []).length;
console.log(`OK: sitemap.xml — ${urlCount} URLs`);

process.exit(ok ? 0 : 1);
