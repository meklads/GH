#!/usr/bin/env node
/**
 * QA: chat assistant present on representative pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const SAMPLES = [
  'index.html',
  'index-ar.html',
  'contact-us.html',
  'services/rendering.html',
  'solutions/project-launch.html',
  'insights/index.html',
];

let ok = true;

for (const rel of SAMPLES) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    console.error('FAIL: missing sample', rel);
    ok = false;
    continue;
  }
  const html = fs.readFileSync(full, 'utf8');
  const checks = [
    ['ghChatPanel', html.includes('id="ghChatPanel"')],
    ['gh-chat-assistant.css', /gh-chat-assistant\.css\?v=\d+/.test(html)],
    ['gh-chat-assistant.js', /gh-chat-assistant\.js\?v=\d+/.test(html)],
    ['toggleChat via brand', html.includes('data-gh-brand-action')],
    ['no legacy ghQAs', !html.includes('var ghQAs')],
  ];
  for (const [label, pass] of checks) {
    if (!pass) {
      console.error(`FAIL: ${rel} — ${label}`);
      ok = false;
    }
  }
  if (checks.every((c) => c[1])) {
    console.log('OK:', rel);
  }
}

if (!fs.existsSync(path.join(ROOT, 'assets/gh-chat-assistant.js'))) {
  console.error('FAIL: assets/gh-chat-assistant.js missing');
  ok = false;
}

if (!fs.existsSync(path.join(ROOT, 'workers/gh-chat-knowledge.js'))) {
  console.error('FAIL: workers/gh-chat-knowledge.js missing');
  ok = false;
}

process.exit(ok ? 0 : 1);
