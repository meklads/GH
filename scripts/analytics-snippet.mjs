#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CONFIG_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'gh-analytics-config.js');
const VERSION = 3;

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
  const id = cfg.ga4MeasurementId;
  let out = '';
  if (cfg.googleSiteVerification) {
    out += `<meta name="google-site-verification" content="${cfg.googleSiteVerification}">\n`;
  }
  out += `<!-- Google tag (gtag.js) -->\n`;
  out += `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>\n`;
  out += `<script>\nwindow.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}\nwindow.gtag=gtag;\ngtag('js',new Date());\ngtag('config','${id}');\n</script>\n`;
  out += `<script src="${prefix}assets/gh-analytics.js?v=${VERSION}"></script>`;
  return out;
}

export function stripAnalytics(html) {
  html = html.replace(/<!--\s*Google Analytics\s*-->\s*/gi, '');
  html = html.replace(/<!--\s*Google tag \(gtag\.js\)\s*-->\s*/gi, '');
  html = html.replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[^"]+"><\/script>\s*/gi, '');
  html = html.replace(/<script>window\.dataLayer=window\.dataLayer\|\|\[\];function gtag\(\)\{dataLayer\.push\(arguments\)\}gtag\('js',new Date\(\)\);gtag\('config','G-[^']+'\);<\/script>\s*/gi, '');
  html = html.replace(/<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js',\s*new Date\(\)\);\s*gtag\('config',\s*'G-[^']+'\);\s*<\/script>\s*/gi, '');
  html = html.replace(/<script>\s*window\.dataLayer=window\.dataLayer\|\|\[\];function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*window\.gtag=gtag;\s*gtag\('js',new Date\(\)\);\s*gtag\('config','G-[^']+'\);\s*<\/script>\s*/gi, '');
  html = html.replace(/<script src="[^"]*gh-analytics-config\.js[^"]*"><\/script>\s*/gi, '');
  html = html.replace(/<script src="[^"]*gh-analytics\.js[^"]*"><\/script>\s*/gi, '');
  return html;
}

export function stripLegacyGa(html) {
  return stripAnalytics(html);
}

export function injectAnalytics(html, prefix) {
  const block = analyticsHeadTags(prefix);
  if (!block) return html;
  html = stripAnalytics(html);
  if (html.includes('gh-forms-config.js')) {
    return html.replace(
      /(<script src="[^"]*gh-forms-config\.js[^"]*"><\/script>)/,
      `$1\n${block}`
    );
  }
  return html.replace(/<head>/i, `<head>\n${block}`);
}
