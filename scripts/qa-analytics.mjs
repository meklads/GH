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
  // Ownership may already be verified in GSC via GA / DNS / HTML file — meta token is optional.
  console.log('OK: GSC HTML meta token not in repo (optional if property already verified in Search Console)');
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

const expectedEvents = [
  'video_play',
  'cta_click',
  'solution_view',
  'solution_finder_complete',
  'launch_checklist_complete',
  'organic_landing',
  'form_submit',
  'generate_lead',
  'whatsapp_click',
  'roi_calculator_view',
  'article_share',
  'article_mid_cta',
  'article_view',
  'article_footer_cta',
  'article_related_click',
  'article_toc_click',
  'article_sidebar_click',
  'article_solution_link',
  'newsletter_signup',
  'assistant_open',
  'assistant_close',
  'assistant_quick_reply',
  'assistant_message_sent',
  'assistant_lead_cta',
];
const assetSrc = [
  'assets/gh-performance.js',
  'assets/gh-cta-track.js',
  'assets/gh-solution-finder.js',
  'assets/gh-launch-checklist.js',
  'assets/gh-float-widgets.js',
  'assets/pl-lead-form.js',
  'assets/gh-roi-calculator.js',
  'assets/gh-insights-article.js',
  'assets/gh-newsletter.js',
  'assets/gh-chat-assistant.js',
]
  .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .join('\n');
for (const ev of expectedEvents) {
  if (!assetSrc.includes(`'${ev}'`) && !assetSrc.includes(`"${ev}"`)) {
    console.warn(`WARN: GA4 event "${ev}" not found in tracking scripts`);
  } else {
    console.log(`OK: event ${ev}`);
  }
}

process.exit(ok ? 0 : 1);
