#!/usr/bin/env node
/**
 * Apply Google Search Console HTML-tag verification token.
 * Usage: npm run gsc:apply -- YOUR_TOKEN
 *    or: GSC_VERIFICATION=YOUR_TOKEN npm run gsc:apply
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = path.join(__dirname, '..', 'assets', 'gh-analytics-config.js');

const token = (process.argv[2] || process.env.GSC_VERIFICATION || '').trim();

if (!token) {
  console.error('Missing GSC verification token.');
  console.error('');
  console.error('1. Open https://search.google.com/search-console');
  console.error('2. Add property: https://3dgraphicshouse.com');
  console.error('3. Choose HTML tag → copy content= value only');
  console.error('4. Run: npm run gsc:apply -- YOUR_TOKEN');
  process.exit(1);
}

if (!/^[a-zA-Z0-9_-]+$/.test(token)) {
  console.error('Token looks invalid. Paste only the content= value from the meta tag.');
  process.exit(1);
}

let src = fs.readFileSync(CONFIG, 'utf8');
if (!src.includes('googleSiteVerification')) {
  console.error('gh-analytics-config.js missing googleSiteVerification field.');
  process.exit(1);
}

src = src.replace(
  /googleSiteVerification:\s*['"][^'"]*['"]/,
  `googleSiteVerification: '${token}'`
);
fs.writeFileSync(CONFIG, src, 'utf8');
console.log('GSC token saved to assets/gh-analytics-config.js');
console.log('Next: npm run build → redeploy → Purge Cloudflare → Verify in Search Console');
