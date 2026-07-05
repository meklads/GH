#!/usr/bin/env node
/**
 * Update mega menu icons and service link markup in canonical headers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SOLUTIONS_BLOCK = `          <div class="mm-grid">
            <a href="{{G}}solutions/growth-launch.html" class="mm-card" data-solution="growth">
              <div class="mm-icon"><span class="material-symbols-outlined">query_stats</span></div>
              <div class="mm-title">GrowthLaunch&#8482;</div>
              <div class="mm-sub">{{G_SUB1}}</div>
              <div class="mm-desc">{{G_DESC}}</div>
              <div class="mm-cta">{{G_CTA}} <span class="material-symbols-outlined" style="font-size:12px">arrow_forward</span></div>
            </a>
            <a href="{{G}}solutions/project-launch.html" class="mm-card" data-solution="project">
              <div class="mm-icon"><span class="material-symbols-outlined">rocket_launch</span></div>
              <div class="mm-title">ProjectLaunch&#8482;</div>
              <div class="mm-sub">{{P_SUB}}</div>
              <div class="mm-desc">{{P_DESC}}</div>
              <div class="mm-cta">{{G_CTA}} <span class="material-symbols-outlined" style="font-size:12px">arrow_forward</span></div>
            </a>
            <a href="{{G}}solutions/brand-scale.html" class="mm-card" data-solution="brand">
              <div class="mm-icon"><span class="material-symbols-outlined">workspace_premium</span></div>
              <div class="mm-title">BrandScale&#8482;</div>
              <div class="mm-sub">{{B_SUB}}</div>
              <div class="mm-desc">{{B_DESC}}</div>
              <div class="mm-cta">{{G_CTA}} <span class="material-symbols-outlined" style="font-size:12px">arrow_forward</span></div>
            </a>
          </div>`;

const SERVICES_BLOCK = `          <div class="mm-grid">
            <div class="mm-col">
              <div class="mm-col-header">{{COL1}}</div>
              <a href="{{G}}services/rendering.html" class="mm-svc-link"><span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">imagesmode</span></span><span class="mm-svc-text">{{S1}}</span></a>
              <a href="{{G}}services/animation.html" class="mm-svc-link"><span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">slow_motion_video</span></span><span class="mm-svc-text">{{S2}}</span></a>
            </div>
            <div class="mm-col">
              <div class="mm-col-header">{{COL2}}</div>
              <a href="{{G}}services/maquettes.html" class="mm-svc-link"><span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">home_work</span></span><span class="mm-svc-text">{{S3}}</span></a>
              <a href="{{G}}services/interactive.html" class="mm-svc-link"><span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">smart_display</span></span><span class="mm-svc-text">{{S4}}</span></a>
              <a href="{{G}}services/production.html" class="mm-svc-link"><span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">videocam</span></span><span class="mm-svc-text">{{S5}}</span></a>
            </div>
          </div>`;

function solutionsHtml(vars) {
  return SOLUTIONS_BLOCK.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

function servicesHtml(vars) {
  return SERVICES_BLOCK.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

function replaceMmGrid(html, menuClass, newGridHtml) {
  const marker = `mega-menu-${menuClass}`;
  const menuStart = html.indexOf(marker);
  if (menuStart === -1) return html;
  const gridStart = html.indexOf('<div class="mm-grid">', menuStart);
  if (gridStart === -1) return html;

  let depth = 0;
  for (let i = gridStart; i < html.length; i++) {
    if (html.startsWith('<div', i)) depth++;
    else if (html.startsWith('</div>', i)) {
      depth--;
      if (depth === 0) {
        return html.slice(0, gridStart) + newGridHtml.trimEnd() + html.slice(i + 6);
      }
    }
  }
  return html;
}

function patchFile(file, solVars, svcVars) {
  let html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (!html.includes('mega-menu-solutions') || !html.includes('mega-menu-services')) {
    console.warn('Skip (no mega menu):', file);
    return;
  }
  html = replaceMmGrid(html, 'solutions', solutionsHtml(solVars));
  html = replaceMmGrid(html, 'services', servicesHtml(svcVars));
  fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
  console.log('Updated:', file);
}

const arVars = {
  G: '',
  G_SUB1: 'نظام توليد العملاء والمبيعات',
  G_DESC: 'توليد عملاء مؤهلين، أتمتة المتابعة، وتحسين معدلات التحويل.',
  P_SUB: 'نظام إطلاق المشاريع العقارية',
  P_DESC: 'حل متكامل لإطلاق المشاريع العقارية يشمل التصور، العلامة التجارية، التسويق ودعم المبيعات.',
  B_SUB: 'نظام نمو العلامات التجارية',
  B_DESC: 'بناء وتقوية وتنمية علامتك التجارية من خلال حلول إبداعية وتسويقية متكاملة.',
  G_CTA: 'اكتشف المزيد',
  COL1: 'الإبداع',
  COL2: 'الحلول المعمارية',
  S1: 'الإظهار المعماري',
  S2: 'التحريك ثلاثي الأبعاد',
  S3: 'المجسمات المعمارية',
  S4: 'العروض التفاعلية',
  S5: 'التصوير والإنتاج الإعلامي',
};

const enVars = {
  G: '',
  G_SUB1: 'Lead Generation & Sales System',
  G_DESC: 'Generate qualified leads, automate follow-up and improve sales conversion.',
  P_SUB: 'Real Estate Project Launch System',
  P_DESC: 'Complete launch solution for real estate projects including visualization, branding, marketing and sales support.',
  B_SUB: 'Brand Growth System',
  B_DESC: 'Build, strengthen and grow your brand through integrated creative and marketing solutions.',
  G_CTA: 'Explore Solution',
  COL1: 'Creative',
  COL2: 'Architectural Solutions',
  S1: 'Smart Visualization',
  S2: 'Cinematic CGI',
  S3: 'Architectural Scale Models',
  S4: 'Interactive Experiences',
  S5: 'Photography & Media Production',
};

const partialArVars = { ...arVars, G: '{{PREFIX}}' };
const partialEnVars = { ...enVars, G: '{{PREFIX}}' };

patchFile('index-ar.html', arVars, arVars);
patchFile('index.html', enVars, enVars);
patchFile('partials/header-ar.html', partialArVars, partialArVars);
patchFile('partials/header-en.html', partialEnVars, partialEnVars);
