#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CONFIG_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'gh-analytics-config.js');
const VERSION = 2;

let cached = null;

export function readAnalyticsConfig() {
  if (cached) return cached;
  if (!fs.existsSync(CONFIG_PATH)) {
    cached = { enabled: false, ga4MeasurementId: '', googleSiteVerification: '' };
    return cached;
  }
  const src = fs.readFileSync(CONFIG_PATH, 'utf8');
  const ga4 = (src.match(/ga4MeasurementId:\s*['"]([^'"]*)['"]/) || [])[1] || '';
  const gsc = (src.match(/googleSiteVerification:\s*['"]([^'"]*)['"]/) || [])[1] || '';
  const en = (src.match(/enabled:\s*(true|false)/) || [])[1];
  cached = {
    ga4MeasurementId: ga4,
    googleSiteVerification: gsc,
    enabled: en !== 'false' && !!ga4,
  };
  return cached;
}

export function analyticsHeadTags(prefix = '') {
  const cfg = readAnalyticsConfig();
  if (!cfg.enabled) return '';
  let out = '';
  if (cfg.googleSiteVerification) {
    out += `<meta name="google-site-verification" content="${cfg.googleSiteVerification}">\n`;
  }
  out += `<script src="${prefix}assets/gh-analytics-config.js?v=${VERSION}"></script>\n`;
  out += `<script src="${prefix}assets/gh-analytics.js?v=${VERSION}"></script>`;
  return out;
}

export function stripLegacyGa(html) {
  return html
    .replace(/<!--\s*Google Analytics\s*-->\s*/gi, '')
    .replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[^"]+"><\/script>\s*/gi, '')
    .replace(/<script>window\.dataLayer=window\.dataLayer\|\|\[\];function gtag\(\)\{dataLayer\.push\(arguments\)\}gtag\('js',new Date\(\)\);gtag\('config','G-[^']+'\);<\/script>\s*/gi, '')
    .replace(/<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js',\s*new Date\(\)\);\s*gtag\('config',\s*'G-[^']+'\);\s*<\/script>\s*/gi, '');
}

export function injectAnalytics(html, prefix) {
  if (html.includes('gh-analytics.js')) return html;
  const block = analyticsHeadTags(prefix);
  if (!block) return html;
  if (html.includes('gh-forms-config.js')) {
    return html.replace(
      /(<script src="[^"]*gh-forms-config\.js[^"]*"><\/script>)/,
      `$1\n${block}`
    );
  }
  return html.replace(/<head>/i, `<head>\n${block}`);
}
