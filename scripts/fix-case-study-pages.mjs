#!/usr/bin/env node
/**
 * Repair case-study EN pages: broken reveal script, stray CSS braces,
 * non-responsive grids, and hero media markup.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  'case-study-mwl-en.html',
  'case-study-alrajhi-en.html',
  'case-study-anan-eskan-en.html',
];

const EXTRA_CSS = `
.cs-hero{position:relative;min-height:min(58vh,640px);display:flex;align-items:flex-end;padding:0;overflow:hidden}
.cs-hero > picture{position:absolute;inset:0;display:block;width:100%;height:100%;z-index:0}
.cs-hero > picture img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.45)}
.cs-hero-veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.35) 55%,transparent 100%);z-index:1}
.cs-hero-accent{position:absolute;top:0;left:0;bottom:0;width:4px;background:#C9A84C;z-index:2}
.cs-hero-copy{position:relative;z-index:3;padding:88px 0 48px;width:100%}
.cs-section{padding:72px 0}
.cs-overview-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,320px);gap:48px;align-items:start}
.cs-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:rgba(201,168,76,.12)}
.cs-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3px;max-width:100%}
.cs-gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;transition:transform .5s}
@media(max-width:900px){
  .cs-overview-grid{grid-template-columns:1fr;gap:24px}
  .cs-stats{grid-template-columns:1fr}
  .cs-gallery{grid-template-columns:1fr 1fr}
  .cs-hero{min-height:min(52vh,560px)}
  .cs-hero-copy{padding:72px 0 36px}
  .cs-section{padding:48px 0}
}
@media(max-width:560px){
  .cs-gallery{grid-template-columns:1fr}
}
@media(prefers-reduced-motion:reduce){
  .reveal{opacity:1;transform:none;transition:none}
}
`.trim();

const REVEAL_SCRIPT = `(function(){
  var els=document.querySelectorAll(".reveal");
  if(!els.length)return;
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    els.forEach(function(el){el.classList.add("visible")});
    return;
  }
  var ro=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        ro.unobserve(entry.target);
      }
    });
  },{threshold:0.01,rootMargin:"0px 0px -6% 0px"});
  els.forEach(function(el){
    var rect=el.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.92){
      el.classList.add("visible");
    } else {
      ro.observe(el);
    }
  });
})();`;

function fixCss(html) {
  // Replace existing case-study polish block, or inject after float styles
  if (html.includes('.cs-hero{')) {
    return html.replace(
      /\.cs-hero\{[\s\S]*?@media\(prefers-reduced-motion:reduce\)\{[\s\S]*?\}\s*\n/,
      EXTRA_CSS + '\n\n'
    );
  }
  html = html.replace(
    /\.gh-float-mail\{background:#C9A84C\}\s*(?:\}\s*)*\/\* Mega menu:/,
    '.gh-float-mail{background:#C9A84C}\n\n' + EXTRA_CSS + '\n\n/* Mega menu:'
  );
  return html;
}

function fixHero(html) {
  html = html.replace(
    /<!-- HERO -->\s*<section style="position:relative;min-height:65vh;display:flex;align-items:flex-end;padding:0;overflow:hidden">/,
    '<!-- HERO -->\n<section class="cs-hero">'
  );
  html = html.replace(
    /(<section class="cs-hero">[\s\S]*?<picture>)([\s\S]*?<\/picture>)\s*<div style="position:absolute;inset:0;background:linear-gradient[^"]+"><\/div>\s*<div style="position:absolute;top:0;left:0;bottom:0;width:4px;background:#C9A84C"><\/div>\s*<div class="wrap" style="position:relative;z-index:2;padding-bottom:60px;padding-top:140px">/,
    '$1$2\n  <div class="cs-hero-veil" aria-hidden="true"></div>\n  <div class="cs-hero-accent" aria-hidden="true"></div>\n  <div class="wrap cs-hero-copy">'
  );
  // Hero img: eager + keep cover styles via CSS class (strip redundant absolute if present)
  html = html.replace(
    /(<section class="cs-hero">[\s\S]*?<img)([^>]*?)(>)/,
    (m, open, attrs, close) => {
      let next = attrs
        .replace(/\sloading="[^"]*"/i, '')
        .replace(/\sstyle="[^"]*"/i, '');
      return `${open} loading="eager" fetchpriority="high"${next}${close}`;
    }
  );
  return html;
}

function fixGrids(html) {
  html = html.replace(
    /<div style="display:grid;grid-template-columns:1fr 320px;gap:64px;align-items:start">/,
    '<div class="cs-overview-grid">'
  );
  html = html.replace(
    /<div class="reveal r1" style="display:grid;grid-template-columns:repeat\(3,1fr\);gap:1px;background:rgba\(201,168,76,\.12\)">/,
    '<div class="reveal r1 cs-stats">'
  );
  html = html.replace(
    /<div style="display:grid;grid-template-columns:repeat\(3,1fr\);gap:3px;max-width:100%">/,
    '<div class="cs-gallery">'
  );
  // Tighten legacy section padding to shared class
  html = html.replace(
    /<section style="padding:80px 0;background:([^"]+)">/g,
    '<section class="cs-section" style="background:$1">'
  );
  return html;
}

function fixScript(html) {
  // Replace the whole broken inline script block that starts with reveal IIFE
  const re =
    /<script>\s*\(function\(\)\{var els=document\.querySelectorAll\("\.reveal"\)[\s\S]*?function toggleMenu\(\)\{document\.getElementById\("nav"\)\.classList\.toggle\("open"\)\}\s*function ghSubmit\(e\)\{[\s\S]*?\.catch\(function\(\)\{btn\.disabled=false;btn\.textContent='Submit →';alert\('Error\. WhatsApp: \+966502786513'\)\}\);\s*<\/script>/;

  const replacement = `<script>
${REVEAL_SCRIPT}
function toggleMenu(){document.getElementById("nav").classList.toggle("open")}
function ghSubmit(e){
  e.preventDefault();
  var btn=e.target.querySelector('button[type="submit"]');
  btn.disabled=true;
  btn.textContent='Sending…';
  fetch((window.GH_FORMS&&window.GH_FORMS.formEndpoint)||'https://3dgraphicshouse.com/api/form',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({
      subject: document.title || 'Project Inquiry',
      from_name:'Graphics House Website',
      name:document.getElementById('ghName').value,
      phone:document.getElementById('ghPhone').value,
      brief:document.getElementById('ghBrief').value,
      botcheck:''
    })
  }).then(function(r){return r.json()}).then(function(res){
    btn.disabled=false;
    btn.textContent='Submit →';
    if(res.success){
      document.querySelector('#ghPopup form').style.display='none';
      document.getElementById('ghThanks').style.display='block';
      setTimeout(function(){
        document.getElementById('ghPopup').style.display='none';
        document.querySelector('#ghPopup form').style.display='block';
        document.getElementById('ghThanks').style.display='none';
      },3000);
    } else {
      alert('Something went wrong.');
    }
  }).catch(function(){
    btn.disabled=false;
    btn.textContent='Submit →';
    alert('Error. WhatsApp: +966502786513');
  });
}
</script>`;

  if (!re.test(html)) {
    console.warn('  warn: script pattern not found');
    return html;
  }
  return html.replace(re, replacement);
}

for (const rel of FILES) {
  const full = path.join(ROOT, rel);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  html = fixCss(html);
  html = fixHero(html);
  html = fixGrids(html);
  html = fixScript(html);
  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    console.log('fixed', rel);
  } else {
    console.log('unchanged', rel);
  }
}
