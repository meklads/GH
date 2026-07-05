#!/usr/bin/env node
/**
 * Replace canonical EN/AR headers with upgraded nav markup.
 * Run: node scripts/upgrade-header-nav.mjs && node scripts/sync-layout.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const AR_HEADER = `<header class="header" id="header">
  <div class="container header-inner">
    <a href="/index-ar.html" class="logo">
      <img src="assets/logo-gold.png" alt="Graphics House" class="logo-img" width="auto" height="75">
    </a>
    <nav class="nav" id="nav" aria-label="التنقل الرئيسي">
      <a class="nav-link" href="who-we-are.html">من نحن</a>
      <div class="nav-mega-item" data-mega="solutions">
        <button type="button" class="nav-link nav-mega-trigger" aria-expanded="false" aria-haspopup="true">
          حلولنا
          <span class="material-symbols-outlined nav-chevron" aria-hidden="true">expand_more</span>
        </button>
        <div class="mega-menu mega-menu-solutions" dir="rtl">
          <div class="mm-panel">
            <div class="mm-panel-head">
              <span class="mm-panel-label">أنظمتنا المتكاملة</span>
              <p class="mm-panel-desc">حلول أعمال جاهزة للمطورين والمكاتب الهندسية</p>
            </div>
            <div class="mm-main">
              <div class="mm-grid">
                <a href="solutions/growth-launch.html" class="mm-card" data-solution="growth">
                  <div class="mm-icon"><span class="material-symbols-outlined">query_stats</span></div>
                  <div class="mm-title">GrowthLaunch&#8482;</div>
                  <div class="mm-sub">نظام توليد العملاء والمبيعات</div>
                  <div class="mm-desc">توليد عملاء مؤهلين، أتمتة المتابعة، وتحسين معدلات التحويل.</div>
                  <div class="mm-cta">اكتشف المزيد <span class="material-symbols-outlined">arrow_forward</span></div>
                </a>
                <a href="solutions/project-launch.html" class="mm-card" data-solution="project">
                  <div class="mm-icon"><span class="material-symbols-outlined">rocket_launch</span></div>
                  <div class="mm-title">ProjectLaunch&#8482;</div>
                  <div class="mm-sub">نظام إطلاق المشاريع العقارية</div>
                  <div class="mm-desc">حل متكامل لإطلاق المشاريع العقارية يشمل التصور، العلامة التجارية، التسويق ودعم المبيعات.</div>
                  <div class="mm-cta">اكتشف المزيد <span class="material-symbols-outlined">arrow_forward</span></div>
                </a>
                <a href="solutions/brand-scale.html" class="mm-card" data-solution="brand">
                  <div class="mm-icon"><span class="material-symbols-outlined">workspace_premium</span></div>
                  <div class="mm-title">BrandScale&#8482;</div>
                  <div class="mm-sub">نظام نمو العلامات التجارية</div>
                  <div class="mm-desc">بناء وتقوية وتنمية علامتك التجارية من خلال حلول إبداعية وتسويقية متكاملة.</div>
                  <div class="mm-cta">اكتشف المزيد <span class="material-symbols-outlined">arrow_forward</span></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nav-mega-item" data-mega="services">
        <button type="button" class="nav-link nav-mega-trigger" aria-expanded="false" aria-haspopup="true">
          خدماتنا
          <span class="material-symbols-outlined nav-chevron" aria-hidden="true">expand_more</span>
        </button>
        <div class="mega-menu mega-menu-services" dir="rtl">
          <div class="mm-panel">
            <div class="mm-panel-head">
              <span class="mm-panel-label">خدماتنا الإبداعية</span>
              <p class="mm-panel-desc">من التصور المعماري إلى الإنتاج الإعلامي المتكامل</p>
            </div>
            <div class="mm-main">
              <div class="mm-grid">
                <div class="mm-col mm-col-core">
                  <div class="mm-col-header">الخدمات الأساسية</div>
                  <a href="services/maquettes.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">home_work</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">المجسمات المعمارية</span>
                      <span class="mm-svc-desc">مجسمات دقيقة للمشاريع</span>
                    </span>
                  </a>
                  <a href="services/rendering.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">imagesmode</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">الإظهار المعماري</span>
                      <span class="mm-svc-desc">صور ثلاثية الأبعاد سينمائية</span>
                    </span>
                  </a>
                  <a href="services/interactive.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">smart_display</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">العروض التفاعلية</span>
                      <span class="mm-svc-desc">تجارب رقمية غامرة</span>
                    </span>
                  </a>
                </div>
                <div class="mm-col">
                  <div class="mm-col-header">الإبداع والإنتاج</div>
                  <a href="services/animation.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">slow_motion_video</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">التحريك ثلاثي الأبعاد</span>
                      <span class="mm-svc-desc">فيديوهات CGI احترافية</span>
                    </span>
                  </a>
                  <a href="services/production.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">videocam</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">التصوير والإنتاج الإعلامي</span>
                      <span class="mm-svc-desc">تصوير وإنتاج متكامل</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a class="nav-link nav-link-accent" href="portfolio.html">أعمالنا</a>
      <a class="nav-link" href="casestudy1.html">مشاريع ناجحة</a>
      <a class="nav-link" href="contact-us.html">تواصل معنا</a>
    </nav>
    <div class="nav-actions">
      <div class="lang-switch" role="group" aria-label="اختيار اللغة">
        <a href="index-ar.html" class="lang-switch-link is-active" hreflang="ar">AR</a>
        <span class="lang-switch-sep" aria-hidden="true">|</span>
        <a href="index.html" class="lang-switch-link" hreflang="en">EN</a>
      </div>
      <a href="contact-us.html" class="nav-cta btn-pill btn-pill-gold">احجز جلسة استراتيجية</a>
    </div>
    <button type="button" class="menu-toggle" id="menuToggle" aria-label="فتح القائمة" aria-expanded="false" aria-controls="nav">
      <span class="material-symbols-outlined">menu</span>
    </button>
  </div>
  <div class="nav-backdrop" id="navBackdrop" hidden></div>
</header>`;

const EN_HEADER = `<header class="header" id="header">
  <div class="container header-inner">
    <a href="/" class="logo">
      <img src="assets/logo-gold.png" alt="Graphics House" class="logo-img" width="auto" height="75">
    </a>
    <nav class="nav" id="nav" aria-label="Main navigation">
      <a class="nav-link" href="who-we-are-en.html">About Us</a>
      <div class="nav-mega-item" data-mega="solutions">
        <button type="button" class="nav-link nav-mega-trigger" aria-expanded="false" aria-haspopup="true">
          Solutions
          <span class="material-symbols-outlined nav-chevron" aria-hidden="true">expand_more</span>
        </button>
        <div class="mega-menu mega-menu-solutions">
          <div class="mm-panel">
            <div class="mm-panel-head">
              <span class="mm-panel-label">Integrated Business Systems</span>
              <p class="mm-panel-desc">Ready-made solutions for developers and engineering firms</p>
            </div>
            <div class="mm-main">
              <div class="mm-grid">
                <a href="solutions/growth-launch.html" class="mm-card" data-solution="growth">
                  <div class="mm-icon"><span class="material-symbols-outlined">query_stats</span></div>
                  <div class="mm-title">GrowthLaunch&#8482;</div>
                  <div class="mm-sub">Lead Generation & Sales System</div>
                  <div class="mm-desc">Generate qualified leads, automate follow-up and improve sales conversion.</div>
                  <div class="mm-cta">Explore Solution <span class="material-symbols-outlined">arrow_forward</span></div>
                </a>
                <a href="solutions/project-launch.html" class="mm-card" data-solution="project">
                  <div class="mm-icon"><span class="material-symbols-outlined">rocket_launch</span></div>
                  <div class="mm-title">ProjectLaunch&#8482;</div>
                  <div class="mm-sub">Real Estate Project Launch System</div>
                  <div class="mm-desc">Complete launch solution for real estate projects including visualization, branding, marketing and sales support.</div>
                  <div class="mm-cta">Explore Solution <span class="material-symbols-outlined">arrow_forward</span></div>
                </a>
                <a href="solutions/brand-scale.html" class="mm-card" data-solution="brand">
                  <div class="mm-icon"><span class="material-symbols-outlined">workspace_premium</span></div>
                  <div class="mm-title">BrandScale&#8482;</div>
                  <div class="mm-sub">Brand Growth System</div>
                  <div class="mm-desc">Build, strengthen and grow your brand through integrated creative and marketing solutions.</div>
                  <div class="mm-cta">Explore Solution <span class="material-symbols-outlined">arrow_forward</span></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nav-mega-item" data-mega="services">
        <button type="button" class="nav-link nav-mega-trigger" aria-expanded="false" aria-haspopup="true">
          Services
          <span class="material-symbols-outlined nav-chevron" aria-hidden="true">expand_more</span>
        </button>
        <div class="mega-menu mega-menu-services">
          <div class="mm-panel">
            <div class="mm-panel-head">
              <span class="mm-panel-label">Creative Services</span>
              <p class="mm-panel-desc">From architectural visualization to full media production</p>
            </div>
            <div class="mm-main">
              <div class="mm-grid">
                <div class="mm-col mm-col-core">
                  <div class="mm-col-header">Core Services</div>
                  <a href="services/maquettes.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">home_work</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">Architectural Scale Models</span>
                      <span class="mm-svc-desc">Precision project models</span>
                    </span>
                  </a>
                  <a href="services/rendering.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">imagesmode</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">Smart Visualization</span>
                      <span class="mm-svc-desc">Cinematic 3D renders</span>
                    </span>
                  </a>
                  <a href="services/interactive.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">smart_display</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">Interactive Experiences</span>
                      <span class="mm-svc-desc">Immersive digital showcases</span>
                    </span>
                  </a>
                </div>
                <div class="mm-col">
                  <div class="mm-col-header">Creative & Production</div>
                  <a href="services/animation.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">slow_motion_video</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">Cinematic CGI</span>
                      <span class="mm-svc-desc">Professional CGI films</span>
                    </span>
                  </a>
                  <a href="services/production.html" class="mm-svc-link">
                    <span class="mm-svc-icon-wrap"><span class="material-symbols-outlined">videocam</span></span>
                    <span class="mm-svc-body">
                      <span class="mm-svc-text">Photography & Media Production</span>
                      <span class="mm-svc-desc">Full photo & video production</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a class="nav-link nav-link-accent" href="portfolio-en.html">Our Work</a>
      <a class="nav-link" href="case-study-mwl-en.html">Case Studies</a>
      <a class="nav-link" href="contact-us-en.html">Contact Us</a>
    </nav>
    <div class="nav-actions">
      <div class="lang-switch" role="group" aria-label="Language">
        <a href="index-ar.html" class="lang-switch-link" hreflang="ar">AR</a>
        <span class="lang-switch-sep" aria-hidden="true">|</span>
        <a href="/" class="lang-switch-link is-active" hreflang="en">EN</a>
      </div>
      <a href="contact-us-en.html" class="nav-cta btn-pill btn-pill-gold">Book a Strategy Session</a>
    </div>
    <button type="button" class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
      <span class="material-symbols-outlined">menu</span>
    </button>
  </div>
  <div class="nav-backdrop" id="navBackdrop" hidden></div>
</header>`;

function replaceHeader(file, header) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  if (!html.includes('<header class="header"')) {
    console.warn(`Skip ${file}: no header`);
    return;
  }
  html = html.replace(/<header class="header"[\s\S]*?<\/header>/, header);
  fs.writeFileSync(full, html, 'utf8');
  console.log(`Updated ${file}`);
}

replaceHeader('index-ar.html', AR_HEADER);
replaceHeader('index.html', EN_HEADER);
