#!/usr/bin/env node
/**
 * Build assets/case-study.css from casestudy1.html inline styles (shared AR/EN).
 * Run: node scripts/build-case-study-css.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const src = readFileSync(join(ROOT, 'casestudy1.html'), 'utf8');
const lines = src.split('\n');
const block = lines.slice(38, 721).join('\n'); // inside <style>, L39–721

const css = `/**
 * Graphics House — case study page styles (casestudy1 AR/EN)
 * Directional layout via [dir=rtl] / [dir=ltr]
 */
${block
  .replace(
    /body \{\n  font-family:[^}]+\}/,
    'body.case-page {\n  background: #0A0A0A;\n  color: #FAFAF8;\n  overflow-x: hidden;\n  -webkit-font-smoothing: antialiased;\n}'
  )
  .replace(
    /\.s2-hero-wrap \{\n  position: relative;\n  min-height: 100vh;\n  min-height: 100dvh;\n  overflow: hidden;\n  direction: rtl;\n\}/,
    `.s2-hero-wrap {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
}
html[dir="rtl"] .s2-hero-wrap { direction: rtl; }
html[dir="ltr"] .s2-hero-wrap { direction: ltr; }`
  )
  .replace(
    /\.s2-hero-inner \{\n  position: absolute;\n  top: 64%;\n  right: 40px;\n  z-index: 5;\n  text-align: right;\n  max-width: 620px;\n  padding: 20px 60px 20px 48px;\n  pointer-events: none;\n\}/,
    `.s2-hero-inner {
  position: absolute;
  top: 64%;
  z-index: 5;
  max-width: 620px;
  pointer-events: none;
}
html[dir="rtl"] .s2-hero-inner {
  inset-inline-end: 40px;
  text-align: right;
  padding: 20px 60px 20px 48px;
}
html[dir="ltr"] .s2-hero-inner {
  inset-inline-start: 40px;
  text-align: left;
  padding: 20px 48px 20px 60px;
}`
  )
  .replace(
    /\.s2-hero-inner::before \{\n  content: '';\n  position: absolute;\n  right: 0;\n  top: 50%;\n  transform: translateY\(-50%\);\n  width: 2px;\n  height: 55%;\n  background: rgba\(201,168,76,0\.4\);\n  border-radius: 1px;\n\}/,
    `.s2-hero-inner::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 55%;
  background: rgba(201,168,76,0.4);
  border-radius: 1px;
}`
  )
  .replace(
    /\.s2-watch-btn \{\n  position: absolute;\n  left: 60px;\n  top: 55%;/,
    `.s2-watch-btn {
  position: absolute;
  inset-inline-end: 60px;
  top: 55%;`
  )
  .replace(
    /\.s2-hero-gallery \{\n  position: absolute;\n  left: 60px;\n  top: 68%;/,
    `.s2-hero-gallery {
  position: absolute;
  inset-inline-end: 60px;
  top: 68%;`
  )
  .replace(
    /\.s2-hero-gallery-grid \{\n  display: grid;\n  grid-template-columns: repeat\(4, 1fr\);\n  gap: 8px;\n  padding: 8px;\n  background: transparent;\n  border: none;\n  direction: rtl;\n\}/,
    `.s2-hero-gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px;
  background: transparent;
  border: none;
}
html[dir="rtl"] .s2-hero-gallery-grid { direction: rtl; }`
  )
  .replace(
    /\.case-content \{\n  padding: 80px 0;\n  background: #FAFAF8;\n  direction: rtl;\n\}/,
    `.case-content {
  padding: 80px 0;
  background: #FAFAF8;
}
html[dir="rtl"] .case-content { direction: rtl; }
html[dir="ltr"] .case-content { direction: ltr; }`
  )
  .replace(
    /border-right: 3px solid var\(--gold\);/,
    'border-inline-start: 3px solid var(--gold);'
  )
  .replace(
    /\.s2-watch-btn \{\n  position: absolute;\n  inset-inline-end: 60px;\n  top: 55%;\n  transform: translateY\(-50%\);\n  z-index: 5;\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  padding: 14px 30px;\n  background: rgba\(255,255,255,0\.08\);\n  backdrop-filter: blur\(16px\);\n  border: 1px solid rgba\(255,255,255,0\.15\);\n  border-radius: 50px;\n  color: #fff;\n  font-family: 'Tajawal', sans-serif;/,
    `.s2-watch-btn {
  position: absolute;
  inset-inline-end: 60px;
  top: 55%;
  transform: translateY(-50%);
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 30px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50px;
  color: #fff;
  font-family: inherit;`
  )
  .replace(
    /  \.s2-hero-inner \{\n    top: 56%;\n    right: 16px;\n    padding: 16px 20px;\n    max-width: 85%;\n  \}/,
    `  html[dir="rtl"] .s2-hero-inner {
    top: 56%;
    inset-inline-end: 16px;
    inset-inline-start: auto;
    padding: 16px 20px;
    max-width: 85%;
  }
  html[dir="ltr"] .s2-hero-inner {
    top: 56%;
    inset-inline-start: 16px;
    inset-inline-end: auto;
    padding: 16px 20px;
    max-width: 85%;
  }`
  )
  .replace(
    /  \.s2-watch-btn \{\n    inset-inline-start: 50%;\n    top: auto;\n    bottom: 100px;\n    transform: translateX\(-50%\);\n  \}/,
    `  .s2-watch-btn {
    inset-inline-start: 50%;
    inset-inline-end: auto;
    top: auto;
    bottom: 100px;
    transform: translateX(-50%);
  }`
  )
  .replace(
    /  \.s2-hero-gallery \{\n    inset-inline-start: 50%;\n    top: auto;\n    bottom: 160px;\n    transform: translateX\(-50%\);\n    max-height: 20vh;\n  \}/,
    `  .s2-hero-gallery {
    inset-inline-start: 50%;
    inset-inline-end: auto;
    top: auto;
    bottom: 160px;
    transform: translateX(-50%);
    max-height: 20vh;
  }`
  )
  .replace(/  \.header \{ padding: 8px 0; \}\n  \.logo img \{ height: 60px; \}\n/, '  ')}`;

writeFileSync(join(ROOT, 'assets/case-study.css'), css);
console.log('Wrote assets/case-study.css', css.length, 'bytes');
