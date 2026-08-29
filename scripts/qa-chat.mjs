#!/usr/bin/env node
/**
 * QA: chat assistant present and structurally valid on representative pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const SAMPLES = [
  'index.html',
  'index-ar.html',
  'contact-us.html',
  'contact-us-en.html',
  'services/rendering.html',
  'solutions/project-launch.html',
  'insights/index.html',
];

function countMatches(html, re) {
  return (html.match(re) || []).length;
}

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
    ['gh-chat-root', html.includes('id="gh-chat-root"')],
    ['ghChatPanel', countMatches(html, /id="ghChatPanel"/g) === 1],
    ['ghChatField unique', countMatches(html, /id="ghChatField"/g) === 1],
    ['ghChatMsgs unique', countMatches(html, /id="ghChatMsgs"/g) === 1],
    ['gh-chat-assistant.css v7+', /gh-chat-assistant\.css\?v=([7-9]|\d{2,})/.test(html)],
    ['gh-chat-assistant.js v7+', /gh-chat-assistant\.js\?v=([7-9]|\d{2,})/.test(html)],
    ['kb before assistant js', (() => {
      const kb = html.search(/gh-chat-knowledge-data\.js/);
      const chat = html.search(/gh-chat-assistant\.js/);
      return kb !== -1 && chat !== -1 && kb < chat;
    })()],
    ['toggleChat via brand', html.includes('data-gh-brand-action')],
    ['no legacy ghQAs', !html.includes('var ghQAs')],
    ['no orphan sendChatMsg', !html.includes('sendChatMsg()')],
    ['motif asset', html.includes('chatbot-motif.png')],
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

if (!fs.existsSync(path.join(ROOT, 'assets/chatbot-motif.png'))) {
  console.error('FAIL: assets/chatbot-motif.png missing');
  ok = false;
}

process.exit(ok ? 0 : 1);
