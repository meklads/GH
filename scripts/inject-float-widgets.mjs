#!/usr/bin/env node
/**
 * Inject standardized float widgets + chat assistant on all pages.
 * Run: node scripts/inject-float-widgets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripLegacyGa, injectAnalytics } from './analytics-snippet.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PARTIALS = path.join(ROOT, 'partials');

const SKIP = new Set([
  'gh-admin.html',
  'home-v2-backup.html',
  'en-backup.html',
  'en-v2.html',
  'offer-lite.html',
  'en.html',
  'solutions/project-launch-ads.html',
  'solutions/project-launch-ads-en.html',
]);

const FLOAT_VERSION = 15;
const CHAT_VERSION = 7;
const KB_VERSION = 1;

const HOMEPAGE_SKIP_REPLACE = new Set([]);

function collectHtmlFiles(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (['.git', 'partials', 'scripts', 'assets', 'node_modules', '.trash'].includes(ent.name)) continue;
      out.push(...collectHtmlFiles(path.join(dir, ent.name), rel));
    } else if (ent.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

function isEnglishPage(rel, html) {
  const dirMatch = html.match(/<html[^>]*\sdir="(ltr|rtl)"/i);
  if (dirMatch) return dirMatch[1].toLowerCase() === 'ltr';
  if (rel.endsWith('-en.html') || rel === 'index.html') return true;
  if (rel === 'index-ar.html') return false;
  return false;
}

function renderFloatPartial(rel, html) {
  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const en = isEnglishPage(rel, html);
  const name = en ? 'float-widgets-en.html' : 'float-widgets-ar.html';
  return fs.readFileSync(path.join(PARTIALS, name), 'utf8').replaceAll('{{PREFIX}}', prefix);
}

function renderChatPartial(rel, html) {
  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const en = isEnglishPage(rel, html);
  const name = en ? 'chat-assistant-en.html' : 'chat-assistant-ar.html';
  return fs.readFileSync(path.join(PARTIALS, name), 'utf8').replaceAll('{{PREFIX}}', prefix);
}

function stripLegacyFloat(html) {
  let out = html;
  out = out.replace(/<!-- GH FLOAT START -->[\s\S]*?<!-- GH FLOAT END -->\s*/g, '');
  out = out.replace(/<!--[^\n]*(?:float|عائمة|FLOAT|Contact|تواصل)[^\n]*-->\s*\n/gi, '');
  out = out.replace(/<!--[^\n]*(?:نموذج|popup|Popup)[^\n]*-->\s*\n/gi, '');

  const popupIdx = out.indexOf('<div id="ghPopup"');
  const floatIdx = out.lastIndexOf('<div class="gh-float"', popupIdx > -1 ? popupIdx : out.length);
  if (floatIdx !== -1) {
    const end = popupIdx > floatIdx ? popupIdx : out.indexOf('</body>', floatIdx);
    if (end > floatIdx) {
      out = out.slice(0, floatIdx) + out.slice(end);
    }
  }

  out = out.replace(/<div id="ghPopup"[\s\S]*?<\/div>\s*(?=\n*(?:<script|<\/body>))/gi, '');
  return out;
}

function stripLegacyChat(html) {
  let out = html;
  out = out.replace(/<!-- GH CHAT START -->[\s\S]*?<!-- GH CHAT END -->\s*/g, '');
  out = out.replace(/<!-- ===== CHAT BOT ===== -->[\s\S]*?<!-- GH CHAT END -->\s*/gi, '');
  out = out.replace(/<!-- ===== CHAT BOT ===== -->[\s\S]*?<\/div>\s*\n\s*<div id="ghChatPanel"[\s\S]*?<\/div>\s*/gi, '');
  out = out.replace(/<div id="ghChatBtn"[\s\S]*?<\/div>\s*/gi, '');
  out = out.replace(/<div id="gh-chat-root"[\s\S]*?<\/div>\s*(?=\n*(?:<!--|<script|<\/body>))/gi, '');
  out = out.replace(/<div id="ghChatPanel"[\s\S]*?<div id="ghChatInput"[\s\S]*?<\/div>\s*\n<\/div>\s*/gi, '');
  // Orphaned inner chat nodes when panel wrapper was removed (homepage residue)
  out = out.replace(/<div id="ghChatMsgs"[\s\S]*?<div id="ghChatInput"[\s\S]*?<\/div>\s*\n<\/div>\s*/gi, '');
  out = out.replace(/<script>\s*var ghLang[\s\S]*?<\/script>\s*/gi, '');
  out = out.replace(/<script>\s*function toggleChat[\s\S]*?ghChatField[\s\S]*?<\/script>\s*/gi, '');
  return out;
}

function ensureChatCssLast(html, prefix) {
  const chatCss = `<link rel="stylesheet" href="${prefix}assets/gh-chat-assistant.css?v=${CHAT_VERSION}">`;
  let out = html.replace(/<link rel="stylesheet" href="[^"]*gh-chat-assistant\.css\?v=\d+">\s*/g, '');
  return out.replace(/<\/head>/i, `${chatCss}\n</head>`);
}

function fixChatScriptOrder(html) {
  const chatRe = /<script defer src="[^"]*gh-chat-assistant\.js[^"]*"><\/script>\s*/;
  const kbRe = /<script src="[^"]*gh-chat-knowledge-data\.js[^"]*"><\/script>\s*/;
  const chatMatch = html.match(chatRe);
  const kbMatch = html.match(kbRe);
  if (!chatMatch || !kbMatch) return html;
  if (html.indexOf(chatMatch[0]) < html.indexOf(kbMatch[0])) {
    let out = html.replace(chatMatch[0], '');
    out = out.replace(kbRe, `${kbMatch[0]}${chatMatch[0]}`);
    return out;
  }
  return html;
}

function injectAssets(html, prefix) {
  const floatCss = `<link rel="stylesheet" href="${prefix}assets/gh-float-widgets.css?v=${FLOAT_VERSION}">`;
  const chatCss = `<link rel="stylesheet" href="${prefix}assets/gh-chat-assistant.css?v=${CHAT_VERSION}">`;
  const floatJs = `<script defer src="${prefix}assets/gh-float-widgets.js?v=${FLOAT_VERSION}"></script>`;
  const kbJs = `<script src="${prefix}assets/gh-chat-knowledge-data.js?v=${KB_VERSION}"></script>`;
  const chatJs = `<script defer src="${prefix}assets/gh-chat-assistant.js?v=${CHAT_VERSION}"></script>`;
  const forms = `<script src="${prefix}assets/gh-forms-config.js"></script>`;

  html = html.replace(/gh-float-widgets\.css\?v=\d+/g, `gh-float-widgets.css?v=${FLOAT_VERSION}`);
  html = html.replace(/gh-float-widgets\.js\?v=\d+/g, `gh-float-widgets.js?v=${FLOAT_VERSION}`);
  html = html.replace(/gh-chat-assistant\.css\?v=\d+/g, `gh-chat-assistant.css?v=${CHAT_VERSION}`);
  html = html.replace(/gh-chat-assistant\.js\?v=\d+/g, `gh-chat-assistant.js?v=${CHAT_VERSION}`);
  html = html.replace(/gh-chat-knowledge-data\.js\?v=\d+/g, `gh-chat-knowledge-data.js?v=${KB_VERSION}`);

  if (!html.includes('gh-float-widgets.css')) {
    html = html.replace(/<\/head>/i, `${floatCss}\n</head>`);
  }
  if (!html.includes('gh-chat-assistant.css')) {
    html = html.replace(/<\/head>/i, `${chatCss}\n</head>`);
  }
  if (!html.includes('gh-forms-config.js')) {
    html = html.replace(/<head>/i, `<head>\n${forms}`);
  }
  if (!html.includes('gh-float-widgets.js')) {
    html = html.replace(/<\/body>/i, `${floatJs}\n</body>`);
  }
  if (!html.includes('gh-chat-knowledge-data.js')) {
    html = html.replace(/<\/body>/i, `${kbJs}\n</body>`);
  }
  if (!html.includes('gh-chat-assistant.js')) {
    html = html.replace(/<\/body>/i, `${chatJs}\n</body>`);
  }
  return html;
}

function patchPage(rel) {
  if (SKIP.has(rel)) return null;
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  html = injectAssets(html, prefix);
  html = ensureChatCssLast(html, prefix);
  html = fixChatScriptOrder(html);
  html = stripLegacyGa(html);
  html = injectAnalytics(html, prefix);
  html = stripLegacyChat(html);

  if (!HOMEPAGE_SKIP_REPLACE.has(rel)) {
    html = stripLegacyFloat(html);
    const floatBlock = renderFloatPartial(rel, html);
    const chatBlock = renderChatPartial(rel, html);
    html = html.replace(/<\/body>/i, `${floatBlock}\n${chatBlock}\n</body>`);
  } else if (!html.includes('id="ghChatPanel"')) {
    const chatBlock = renderChatPartial(rel, html);
    html = html.replace(/<\/body>/i, `${chatBlock}\n</body>`);
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    return rel;
  }
  return null;
}

const updated = collectHtmlFiles(ROOT).map(patchPage).filter(Boolean);
console.log(`Float + chat assistant injected on ${updated.length} pages`);
