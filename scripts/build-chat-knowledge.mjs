#!/usr/bin/env node
/** Sync worker site knowledge to browser fallback bundle. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { serializeForClient, REPLIES } from '../workers/gh-chat-knowledge.js';
import { LEXICON, PROJECT_SIGNALS } from '../workers/gh-chat-matcher.js';
import { PAGE_CONTEXT } from '../workers/gh-site-knowledge.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(ROOT, 'assets/gh-chat-knowledge-data.js');

const payload = {
  ...serializeForClient(),
  replies: REPLIES,
  lexicon: LEXICON,
  projectSignals: PROJECT_SIGNALS,
  pageContext: PAGE_CONTEXT.map((c) => ({
    match: c.match.source,
    flags: c.match.flags,
    intent: c.intent,
    quick: c.quick,
  })),
};

fs.writeFileSync(
  out,
  `/** Auto-generated, run: node scripts/build-chat-knowledge.mjs */\nwindow.GH_CHAT_KB = ${JSON.stringify(payload, null, 0)};\n`,
  'utf8'
);
console.log('Wrote', out);
