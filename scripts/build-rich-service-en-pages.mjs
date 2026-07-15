#!/usr/bin/env node
/**
 * Build full English service pages for the 8 former stub services.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHeader, renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSS_SOURCE = path.join(ROOT, 'services/rendering.html');
const SERVICES = path.join(ROOT, 'services');
const BASE = 'https://3dgraphicshouse.com';
const P = '../';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function extractPageCss() {
  const html = fs.readFileSync(CSS_SOURCE, 'utf8');
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1].trim() : '';
}

function pageScripts() {
  return `<script>
var ro=new IntersectionObserver(function(e){e.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible')}})},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(function(el){ro.observe(el)});
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(this.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});
function openLightbox(el){var img=el.querySelector('img');document.getElementById('lightbox-img').src=img.src;document.getElementById('lightbox').style.display='flex';document.body.style.overflow='hidden'}
function closeLightbox(){document.getElementById('lightbox').style.display='none';document.body.style.overflow=''}
document.getElementById('lightbox').addEventListener('click',function(e){if(e.target===this)closeLightbox()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLightbox()});
document.querySelectorAll('.gallery-video').forEach(function(item){
  var video = item.querySelector('video');
  if(!video) return;
  var src = item.getAttribute('data-video');
  if(src) { var source = document.createElement('source'); source.setAttribute('src', src); source.setAttribute('type', 'video/mp4'); video.appendChild(source); }
  item.addEventListener('mouseenter', function(){ video.setAttribute('preload', 'auto'); video.currentTime = 0; video.play().catch(function(){}); });
  item.addEventListener('mouseleave', function(){ video.pause(); });
});
</script>
<script defer src="${P}assets/quote-form-config.js"></script>
<script defer src="${P}assets/quote-form.js?v=3"></script>`;
}

function galleryHtml(items) {
  return items
    .map((item) => {
      if (item.video) {
        return `<div class="gallery-strip-item gallery-video" data-video="${P}${item.video}">
      <img loading="lazy" src="${P}${item.img}" alt="${esc(item.label)}">
      <video preload="none" muted loop playsinline poster="${P}${item.img}"></video>
      <div class="gallery-strip-label">${esc(item.label)}</div>
    </div>`;
      }
      return `<div class="gallery-strip-item">
      <img loading="lazy" src="${P}${item.img}" alt="${esc(item.label)}">
      <div class="gallery-strip-label">${esc(item.label)}</div>
    </div>`;
    })
    .join('\n    ');
}

function featuresHtml(items) {
  return items
    .map(
      (f) => `<div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">${f.icon}</span></div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.desc)}</p>
      </div>`
    )
    .join('\n      ');
}

function portfolioHtml(items) {
  return items
    .map(
      (p) => `<div class="portfolio-item" onclick="openLightbox(this)"><img loading="lazy" src="${P}${p.img}" alt="${esc(p.title)}"><div class="portfolio-item-overlay"><span class="portfolio-item-category">${esc(p.cat)}</span><span class="portfolio-item-title">${esc(p.title)}</span></div></div>`
    )
    .join('\n      ');
}

function relatedHtml(items) {
  return items
    .map(
      (r) => `<a href="${r.href}" class="rel-card"><div class="icon"><span class="material-symbols-outlined">${r.icon}</span></div><h4>${esc(r.title)}</h4><p>${esc(r.desc)}</p></a>`
    )
    .join('\n      ');
}

function ctaBlock({ title, gold, sub, primary = 'Request a Quote', secondary }) {
  const secondaryBtn = secondary
    ? `<a href="https://wa.me/966502786513" target="_blank" rel="noopener" class="btn-o-light">WhatsApp Us <span class="material-symbols-outlined" style="font-size:16px">phone_in_talk</span></a>`
    : '';
  return `<section class="cta-d" style="background:#1A1A1A">
  <div class="cta-d-inner">
    <h2 style="color:#FAFAF8">${title} <span class="gold">${gold}</span></h2>
    <p style="color:rgba(255,255,255,0.6)">${esc(sub)}</p>
    <div class="btns">
      <a href="#booking" class="btn-p">${primary} <span class="material-symbols-outlined" style="font-size:16px">request_quote</span></a>
      ${secondaryBtn}
    </div>
  </div>
</section>`;
}

function bodyContent(cfg) {
  const formOptions = cfg.formOptions
    .map((o) => `<option value="${esc(o.toLowerCase().replace(/\s+/g, '-'))}">${esc(o)}</option>`)
    .join('\n              ');

  return `<!-- GALLERY STRIP HERO -->
<section style="background:#0A0A0A;overflow:hidden;padding-top:96px">
  <div class="gallery-strip">
    ${galleryHtml(cfg.gallery)}
  </div>
</section>

<section style="background:var(--bg-white)">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">Our Services</span>
      <h2 class="section-title">${cfg.heroTitle} <span class="gold">${cfg.heroGold}</span></h2>
      <p class="section-sub" style="margin:0 auto">${esc(cfg.heroSub)}</p>
    </div>
    <div class="feature-grid reveal r1">
      ${featuresHtml(cfg.features)}
    </div>
  </div>
</section>

${ctaBlock(cfg.cta1)}

<section style="background:#F5F4F0">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">Portfolio</span>
      <h2 class="section-title">Selected <span class="gold">Work</span></h2>
      <p class="section-sub" style="margin:0 auto">${esc(cfg.portfolioSub)}</p>
    </div>
    <div class="portfolio-grid reveal r1">
      ${portfolioHtml(cfg.portfolio)}
    </div>
    <div class="reveal r2" style="text-align:center;margin-top:36px">
      <a href="${P}portfolio-en.html" class="btn-o">View Full Portfolio <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span></a>
    </div>
  </div>
</section>

<section style="background:var(--bg-white)">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">Why Graphics House</span>
      <h2 class="section-title">${cfg.whyTitle} <span class="gold">${cfg.whyGold}</span></h2>
      <p class="section-sub" style="margin:0 auto">${esc(cfg.whySub)}</p>
    </div>
    <div class="why-grid reveal r1">
      <div class="why-card"><div class="num">15</div><h4>Years of Experience</h4><p>Deep GCC market knowledge serving developers and engineering firms.</p></div>
      <div class="why-card"><div class="num">500+</div><h4>Projects Delivered</h4><p>Residential, commercial, hospitality, and government mega-developments.</p></div>
      <div class="why-card"><div class="num">4</div><h4>Regional Offices</h4><p>Saudi Arabia, Oman, Bahrain, and Egypt — teams where you need them.</p></div>
      <div class="why-card"><div class="num">1</div><h4>Integrated Studio</h4><p>Creative, technical, and production talent under one roof.</p></div>
    </div>
  </div>
</section>

${ctaBlock(cfg.cta2)}

<section style="background:#F5F4F0;padding:90px 0">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">Related Services</span>
      <h2 class="section-title">Everything Your <span class="gold">Project</span> Needs</h2>
      <p class="section-sub" style="margin:0 auto">Integrated visual and marketing systems from a single studio.</p>
    </div>
    <div class="rel-grid reveal r1">
      ${relatedHtml(cfg.related)}
    </div>
  </div>
</section>

${ctaBlock({ ...cfg.cta3, secondary: true })}

<section id="booking" class="contact-s">
  <div class="contact-inner">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.2em;color:var(--gold);margin-bottom:12px;text-transform:uppercase">Contact Us</span>
      <h2 style="font-size:clamp(26px,3.8vw,42px);font-weight:500;margin-bottom:12px">Request a Quote for <span style="color:var(--gold)">${esc(cfg.serviceName)}</span></h2>
      <p style="font-size:16px;color:var(--text-secondary);max-width:500px;margin:0 auto">Fill in the form and our team will contact you within 24 hours.</p>
    </div>
    <div class="contact-grid reveal r1">
      <div class="contact-info">
        <h3>${esc(cfg.bookingTitle)}</h3>
        <p>${esc(cfg.bookingText)}</p>
        <div class="contact-info-item"><span class="material-symbols-outlined">phone_in_talk</span> +966 50 278 6513</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">mail</span> info@3dgraphicshouse.com</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">location_on</span> Jeddah, Saudi Arabia — 4 regional offices</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">schedule</span> Response within 24 business hours</div>
      </div>
      <div class="form-card">
        <h3>Quote Request</h3>
        <form class="gh-quote-form" action="https://formsubmit.co/info@3dgraphicshouse.com" method="POST">
          <input type="hidden" name="_subject" value="${esc(cfg.formSubject)}">
          <input type="hidden" name="_next" value="${BASE}/services/${cfg.slug}-en.html?sent=1#booking">
          <div class="form-group"><label>Full Name</label><input type="text" name="name" required placeholder="Your name"></div>
          <div class="form-group"><label>Company</label><input type="text" name="company" placeholder="Company name"></div>
          <div class="form-group"><label>Phone</label><input type="tel" name="phone" required placeholder="+966..."></div>
          <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="you@company.com"></div>
          <div class="form-group"><label>Service Type</label>
            <select name="service" required>
              <option value="">Select service</option>
              ${formOptions}
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group"><label>City</label>
            <select name="city">
              <option value="">Select city</option>
              <option value="riyadh">Riyadh</option>
              <option value="jeddah">Jeddah</option>
              <option value="dammam">Dammam</option>
              <option value="mecca">Makkah</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group"><label>Project Details</label><textarea name="message" placeholder="Tell us about your project, timeline, and scope..."></textarea></div>
          <div class="gh-form-security">
            <div class="gh-honeypot" aria-hidden="true"><label>Leave blank</label><input type="text" name="_honey" tabindex="-1" autocomplete="off"></div>
            <div class="gh-turnstile"></div>
          </div>
          <div class="form-feedback" aria-live="polite"></div>
          <button type="submit" class="form-submit">Send Request <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle">send</span></button>
        </form>
      </div>
    </div>
  </div>
</section>

<div id="lightbox"><button type="button" onclick="closeLightbox()" aria-label="Close" style="position:absolute;top:24px;right:24px;width:44px;height:44px;background:rgba(255,255,255,.08);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%">✕</button><img loading="lazy" id="lightbox-img" src="" alt=""></div>`;
}

const SHARED_RELATED = {
  rendering: { href: 'rendering-en.html', icon: 'landscape', title: 'Architectural Visualization', desc: 'Photorealistic renders, catalogs, and project brand identity.' },
  maquettes: { href: 'maquettes-en.html', icon: 'view_in_ar', title: 'Smart Maquettes', desc: 'Physical-digital models with projection mapping and live data.' },
  animation: { href: 'animation-en.html', icon: 'movie', title: 'Cinematic CGI', desc: 'Ultra-high-fidelity films for launches and investor events.' },
  production: { href: 'production-en.html', icon: 'photo_camera', title: 'Media Production', desc: 'Filming, editing, and multimedia content for real estate.' },
  interactive: { href: 'interactive-en.html', icon: 'touch_app', title: 'Interactive Experiences', desc: 'Touchscreens, VR tours, and digital sales platforms.' },
  marketing: { href: 'digital-marketing-en.html', icon: 'campaign', title: 'Digital Marketing', desc: 'Performance campaigns and lead generation for launches.' },
  web: { href: 'web-solutions-en.html', icon: 'language', title: 'Web Solutions', desc: 'Project websites, landing pages, and digital sales funnels.' },
  branding: { href: 'branding-en.html', icon: 'brush', title: 'Branding', desc: 'Identity systems and positioning for mega developments.' },
  ai: { href: 'ai-solutions-en.html', icon: 'psychology', title: 'AI Solutions', desc: 'AI-assisted visualization and creative workflow automation.' },
};

const PAGES = [
  {
    slug: 'ai-solutions',
    serviceName: 'AI Solutions',
    pageTitle: 'AI Solutions for Real Estate Visualization | Graphics House',
    meta: 'AI-powered visualization, automation, and creative workflows for real estate and engineering teams across Saudi Arabia and the GCC.',
    ogDescription: 'AI-assisted archviz, content automation, and smart production pipelines for developers.',
    heroTitle: 'AI-Powered Creative',
    heroGold: 'Workflows',
    heroSub: 'We integrate AI into visualization, content production, and sales enablement — accelerating delivery without sacrificing quality.',
    portfolioSub: 'Smart production pipelines and next-generation visualization for GCC developers.',
    whyTitle: 'Future-Ready',
    whyGold: 'Visualization',
    whySub: 'Practical AI tools embedded in real studio workflows — not experiments.',
    gallery: [
      { img: 'assets/projects/rendering/jeddah-forum.jpg', label: 'AI-Assisted Rendering' },
      { img: 'assets/projects/rendering/alrajhi2.jpeg', label: 'Generative Variants' },
      { img: 'assets/projects/animation/architectural-visualisation.jpg', label: 'Automated Pipelines' },
      { img: 'assets/news/makkah-charter-02.jpeg', label: 'Interactive Intelligence' },
      { img: 'assets/projects/rendering/0.jpg', label: 'Spatial Analysis' },
    ],
    features: [
      { icon: 'auto_awesome', title: 'AI Render Assist', desc: 'Faster iteration on materials, lighting, and camera angles for large masterplans.' },
      { icon: 'hub', title: 'Workflow Automation', desc: 'Automate repetitive production steps from brief intake to asset delivery.' },
      { icon: 'insights', title: 'Data-Driven Viz', desc: 'Layer live project data onto renders, maquettes, and interactive presentations.' },
      { icon: 'smart_toy', title: 'Sales Enablement', desc: 'AI chat and guided discovery for showrooms, websites, and launch events.' },
    ],
    portfolio: [
      { img: 'assets/projects/rendering/jeddah-forum.jpg', cat: 'Visualization', title: 'Jeddah Forum — Rapid Iteration' },
      { img: 'assets/projects/rendering/alrajhi2.jpeg', cat: 'Visualization', title: 'Al Rajhi Development, Riyadh' },
      { img: 'assets/projects/animation/jeddah-forum.jpg', cat: 'CGI', title: 'Cinematic Launch Film' },
      { img: 'assets/news/makkah-charter-03.jpeg', cat: 'Interactive', title: 'MWL Interactive Environment' },
      { img: 'assets/projects/rendering/uae-e1745147961286.jpeg', cat: 'Visualization', title: 'Commercial Tower, UAE' },
      { img: 'assets/projects/maquettes/alrajhi3.jpeg', cat: 'Maquette', title: 'Smart Maquette Integration' },
    ],
    cta1: { title: 'Accelerate Your', gold: 'Creative Pipeline', sub: 'AI tools that fit your studio workflow — from concept to sales-ready assets.' },
    cta2: { title: 'Built for', gold: 'Mega-Developments', sub: 'Scale production across phases, towers, and launch campaigns with confidence.' },
    cta3: { title: 'Ready to Explore', gold: 'AI Solutions?', sub: 'Tell us about your project and we will recommend the right AI-enabled workflow.' },
    related: [SHARED_RELATED.rendering, SHARED_RELATED.interactive, SHARED_RELATED.web, SHARED_RELATED.marketing],
    bookingTitle: 'Integrate AI Into Your Visual System',
    bookingText: 'From render acceleration to interactive sales tools — we scope practical AI that delivers ROI.',
    formSubject: 'Quote request - AI Solutions EN',
    formOptions: ['AI Render Assist', 'Workflow Automation', 'Interactive AI Assistant', 'Data Layer Integration'],
  },
  {
    slug: 'branding',
    serviceName: 'Branding',
    pageTitle: 'Real Estate Branding & Visual Identity | Graphics House',
    meta: 'Strategic brand identity, positioning, and launch-ready collateral for real estate developers across the GCC.',
    ogDescription: 'Brand strategy, visual identity, and sales collateral for property launches.',
    heroTitle: 'Brand Identity for',
    heroGold: 'Mega Developments',
    heroSub: 'We build cohesive visual identities that unify masterplans, sales galleries, and launch campaigns under one premium story.',
    portfolioSub: 'Identity systems and branded collateral for leading developers in Saudi Arabia and the Gulf.',
    whyTitle: 'Brands That',
    whyGold: 'Sell at Scale',
    whySub: 'Identity work engineered for pre-sales — not just aesthetics.',
    gallery: [
      { img: 'assets/projects/rendering/c3.jpg', label: 'Project Identity' },
      { img: 'assets/projects/rendering/uae-e1745147961286.jpeg', label: 'Launch Collateral' },
      { img: 'assets/projects/rendering/pavilion3-1.jpg', label: 'Sales Gallery Branding' },
      { img: 'assets/projects/rendering/0.jpg', label: 'Unit Catalogs' },
      { img: 'assets/projects/rendering/wahat-alsalam9-scaled.jpg', label: 'Environmental Graphics' },
    ],
    features: [
      { icon: 'brush', title: 'Visual Identity', desc: 'Logo systems, color palettes, typography, and brand guidelines for your development.' },
      { icon: 'menu_book', title: 'Sales Collateral', desc: 'Brochures, unit sheets, investor decks, and launch kits aligned to your positioning.' },
      { icon: 'storefront', title: 'Gallery Branding', desc: 'Environmental graphics and spatial storytelling for premium sales environments.' },
      { icon: 'strategy', title: 'Brand Strategy', desc: 'Naming, messaging, and market positioning tailored to GCC buyers and investors.' },
    ],
    portfolio: [
      { img: 'assets/projects/rendering/c3.jpg', cat: 'Branding', title: 'Project Catalog Design' },
      { img: 'assets/projects/rendering/uae-e1745147961286.jpeg', cat: 'Branding', title: 'Commercial Launch Identity' },
      { img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', cat: 'Branding', title: 'Al Oula Real Estate' },
      { img: 'assets/projects/rendering/jeddah-forum.jpg', cat: 'Branding', title: 'Jeddah Forum Exhibition' },
      { img: 'assets/projects/rendering/alrajhi2.jpeg', cat: 'Branding', title: 'Al Rajhi Development' },
      { img: 'assets/projects/rendering/The-Meteorological-Building.jpeg', cat: 'Branding', title: 'Institutional Identity' },
    ],
    cta1: { title: 'Launch With a', gold: 'Distinct Identity', sub: 'Brand systems that elevate perception and support premium pricing.' },
    cta2: { title: 'Trusted by', gold: 'Leading Developers', sub: 'Identity work delivered alongside visualization, film, and interactive — one studio.' },
    cta3: { title: 'Start Your', gold: 'Brand Project', sub: 'Request a branding consultation — response within 24 hours.' },
    related: [SHARED_RELATED.rendering, SHARED_RELATED.marketing, SHARED_RELATED.web, SHARED_RELATED.production],
    bookingTitle: 'Build a Launch-Ready Brand System',
    bookingText: 'Whether you need a full identity or sales collateral for an upcoming launch — our brand team is ready.',
    formSubject: 'Quote request - Branding EN',
    formOptions: ['Visual Identity System', 'Sales Collateral', 'Gallery Branding', 'Brand Strategy Workshop'],
  },
  {
    slug: 'cinematic-cgi',
    serviceName: 'Cinematic CGI',
    pageTitle: 'Cinematic CGI Films for Real Estate | Graphics House',
    meta: 'Ultra-high-fidelity architectural CGI films, flyovers, and launch films for developers and sales centers in the GCC.',
    ogDescription: 'Cinematic CGI films that translate masterplans into emotional investor narratives.',
    heroTitle: 'Cinematic CGI',
    heroGold: 'Films',
    heroSub: 'We produce architectural films that communicate scale, lifestyle, and investment value — built for launch events, sales centers, and digital campaigns.',
    portfolioSub: 'Launch films and cinematic walkthroughs for mega projects across the Gulf.',
    whyTitle: 'Films That',
    whyGold: 'Move Markets',
    whySub: 'Cinematic storytelling engineered for pre-sales and investor confidence.',
    gallery: [
      { img: 'assets/projects/animation/jeddah-forum.jpg', label: 'Launch Films', video: 'assets/videos/3D-Architectural-visualisation.mp4' },
      { img: 'assets/projects/animation/rafal-pavilions.jpg', label: 'Aerial Flyovers' },
      { img: 'assets/projects/cinematic/video-1.jpg', label: 'Investor Presentations' },
      { img: 'assets/projects/animation/alrajhi.jpg', label: 'Sales Center Films' },
      { img: 'assets/projects/animation/market-center.jpg', label: 'Lifestyle Sequences' },
    ],
    features: [
      { icon: 'flight', title: 'Aerial Flyovers', desc: 'Sweeping masterplan films that reveal scale, context, and connectivity.' },
      { icon: 'directions_walk', title: 'Walkthrough Films', desc: 'Immersive unit and amenity tours with cinematic pacing and sound design.' },
      { icon: 'theaters', title: 'Launch Event Films', desc: 'Hero films for unveiling ceremonies, investor roadshows, and press events.' },
      { icon: 'movie_edit', title: 'Post-Production', desc: 'Editing, grading, motion graphics, and multilingual versions for regional rollout.' },
    ],
    portfolio: [
      { img: 'assets/projects/animation/jeddah-forum.jpg', cat: 'Cinematic', title: 'Jeddah Forum Launch Film' },
      { img: 'assets/projects/animation/rafal-pavilions.jpg', cat: 'Cinematic', title: 'Rafal Pavilions' },
      { img: 'assets/projects/cinematic/video-1.jpg', cat: 'Cinematic', title: 'GH Production Reel' },
      { img: 'assets/projects/animation/alrajhi.jpg', cat: 'Cinematic', title: 'Al Rajhi Cinematic Film' },
      { img: 'assets/projects/animation/market-center.jpg', cat: 'Cinematic', title: 'Market Center Film' },
      { img: 'assets/projects/rendering/pavilion3-1.jpg', cat: 'CGI', title: 'Pavilion Visualization' },
    ],
    cta1: { title: 'Tell Your Project\'s', gold: 'Cinematic Story', sub: 'From storyboard to final master — one team, Gulf-wide delivery.' },
    cta2: { title: 'Trusted for', gold: 'Giga-Project Launches', sub: 'Films produced for royal commissions, government entities, and top developers.' },
    cta3: { title: 'Book a', gold: 'Film Consultation', sub: 'Share your timeline and launch goals — we will propose the right film package.' },
    related: [SHARED_RELATED.rendering, SHARED_RELATED.production, SHARED_RELATED.marketing, SHARED_RELATED.interactive],
    bookingTitle: 'Plan Your Cinematic Launch Film',
    bookingText: 'Hero films, cutdowns for social, and sales-center loops — scoped to your launch calendar.',
    formSubject: 'Quote request - Cinematic CGI EN',
    formOptions: ['Launch Hero Film', 'Aerial Flyover', 'Walkthrough Film', 'Social Cutdowns'],
  },
  {
    slug: 'digital-marketing',
    serviceName: 'Digital Marketing',
    pageTitle: 'Digital Marketing for Real Estate Developers | Graphics House',
    meta: 'Performance marketing, content, and lead generation for real estate launches across Saudi Arabia and the GCC.',
    ogDescription: 'Paid media, content, and funnel strategy for property developers.',
    heroTitle: 'Digital Marketing for',
    heroGold: 'Property Launches',
    heroSub: 'We connect cinematic visuals with performance campaigns — driving qualified leads for pre-sales and launch phases.',
    portfolioSub: 'Campaign creative and launch marketing for developers across the Gulf.',
    whyTitle: 'Marketing That',
    whyGold: 'Converts',
    whySub: 'Creative and media strategy built around real estate sales cycles.',
    gallery: [
      { img: 'assets/projects/rendering/alrajhi2.jpeg', label: 'Launch Campaigns' },
      { img: 'assets/projects/animation/jeddah-forum.jpg', label: 'Video Ads' },
      { img: 'assets/projects/rendering/jeddah-forum.jpg', label: 'Social Content' },
      { img: 'assets/projects/rendering/0.jpg', label: 'Landing Pages' },
      { img: 'assets/projects/maquettes/anan-escan3.jpeg', label: 'Lead Funnels' },
    ],
    features: [
      { icon: 'ads_click', title: 'Performance Ads', desc: 'Meta, Google, and programmatic campaigns optimized for qualified property leads.' },
      { icon: 'edit_note', title: 'Content Production', desc: 'Short-form video, carousels, and launch copy aligned to your visual identity.' },
      { icon: 'filter_alt', title: 'Funnel Strategy', desc: 'Landing pages, CRM integration, and nurture flows for sales teams.' },
      { icon: 'monitoring', title: 'Analytics & ROI', desc: 'Dashboards and reporting tied to cost-per-lead and sales conversion.' },
    ],
    portfolio: [
      { img: 'assets/projects/rendering/alrajhi2.jpeg', cat: 'Campaign', title: 'Al Rajhi Launch Creative' },
      { img: 'assets/projects/animation/jeddah-forum.jpg', cat: 'Video Ads', title: 'Jeddah Forum Campaign' },
      { img: 'assets/projects/rendering/jeddah-forum.jpg', cat: 'Social', title: 'Exhibition Launch Content' },
      { img: 'assets/projects/maquettes/alrajhi3.jpeg', cat: 'Lead Gen', title: 'Maquette Launch Funnel' },
      { img: 'assets/projects/rendering/anan-escan3.jpeg', cat: 'Campaign', title: 'Anan Eskan Pre-Sales' },
      { img: 'assets/projects/rendering/uae-e1745147961286.jpeg', cat: 'Campaign', title: 'Regional Rollout' },
    ],
    cta1: { title: 'Turn Visuals Into', gold: 'Qualified Leads', sub: 'Campaigns powered by studio-grade creative — not stock templates.' },
    cta2: { title: 'Packages From', gold: 'SAR 1,200', sub: 'Flexible retainers and launch bursts for developers at every scale.' },
    cta3: { title: 'Grow Your', gold: 'Pipeline', sub: 'Request a marketing audit and launch plan for your next project.' },
    related: [SHARED_RELATED.branding, SHARED_RELATED.web, SHARED_RELATED.production, SHARED_RELATED.rendering],
    bookingTitle: 'Build a Launch Marketing System',
    bookingText: 'Paid media, content, and landing experiences — integrated with your visual assets.',
    formSubject: 'Quote request - Digital Marketing EN',
    formOptions: ['Performance Ad Campaign', 'Content Retainer', 'Launch Funnel Setup', 'Marketing Audit'],
  },
  {
    slug: 'interactive-experiences',
    serviceName: 'Interactive Experiences',
    pageTitle: 'Interactive Real Estate Sales Experiences | Graphics House',
    meta: 'Touchscreen kiosks, VR tours, unit comparison tools, and interactive sales platforms for GCC showrooms.',
    ogDescription: 'Interactive sales environments that accelerate investment decisions.',
    heroTitle: 'Interactive Sales',
    heroGold: 'Experiences',
    heroSub: 'We design and build touchscreen platforms, virtual tours, and data-rich presentation systems for sales galleries and launch events.',
    portfolioSub: 'Interactive environments for exhibitions, headquarters, and sales centers.',
    whyTitle: 'Experiences That',
    whyGold: 'Engage & Convert',
    whySub: 'Physical and digital touchpoints designed for high-value property sales.',
    gallery: [
      { img: 'assets/news/makkah-charter-02.jpeg', label: 'Touchscreen Kiosks' },
      { img: 'assets/news/makkah-charter-05.jpeg', label: 'Interactive Maquettes' },
      { img: 'assets/projects/rendering/0.jpg', label: 'Virtual Tours' },
      { img: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg', label: 'Exhibition Systems' },
      { img: 'assets/news/makkah-charter-08.jpeg', label: 'Live Data Displays' },
    ],
    features: [
      { icon: 'touch_app', title: 'Sales Kiosks', desc: 'Custom touchscreen apps for unit exploration, floor plans, and availability.' },
      { icon: 'view_in_ar', title: 'VR & 360 Tours', desc: 'Immersive walkthroughs for remote buyers and international roadshows.' },
      { icon: 'compare', title: 'Unit Comparison', desc: 'Side-by-side views, filters, and favorites for sales consultants.' },
      { icon: 'dashboard', title: 'Live Dashboards', desc: 'Real-time project data, news feeds, and analytics on presentation screens.' },
    ],
    portfolio: [
      { img: 'assets/news/makkah-charter-02.jpeg', cat: 'Interactive', title: 'MWL Humanity Exhibition' },
      { img: 'assets/news/makkah-charter-06.jpeg', cat: 'Interactive', title: 'Interactive News System' },
      { img: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg', cat: 'Maquette', title: 'Smart Maquette + Screens' },
      { img: 'assets/news/makkah-charter-10.jpeg', cat: 'Interactive', title: 'Photo Experience Station' },
      { img: 'assets/projects/rendering/0.jpg', cat: 'VR', title: 'Sales Gallery Tour' },
      { img: 'assets/projects/maquettes/alrajhi3.jpeg', cat: 'Interactive', title: 'Maquette Control System' },
    ],
    cta1: { title: 'Upgrade Your', gold: 'Sales Gallery', sub: 'Interactive systems that keep buyers engaged and consultants empowered.' },
    cta2: { title: 'From Concept to', gold: 'On-Site Support', sub: 'Hardware, software, content, and training — delivered by one team.' },
    cta3: { title: 'Design Your', gold: 'Interactive System', sub: 'Tell us about your showroom or exhibition — we will scope the right platform.' },
    related: [SHARED_RELATED.maquettes, SHARED_RELATED.rendering, SHARED_RELATED.web, SHARED_RELATED.ai],
    bookingTitle: 'Plan an Interactive Sales Environment',
    bookingText: 'Kiosks, VR, maquette integration, and custom software for your sales journey.',
    formSubject: 'Quote request - Interactive Experiences EN',
    formOptions: ['Touchscreen Kiosk', 'VR / 360 Tour', 'Maquette Integration', 'Custom Sales App'],
  },
  {
    slug: 'photography-media',
    serviceName: 'Photography & Media',
    pageTitle: 'Architectural Photography & Media Production | Graphics House',
    meta: 'Architectural photography, aerial filming, and content production for real estate marketing in Saudi Arabia and the GCC.',
    ogDescription: 'Professional photography and media for property marketing campaigns.',
    heroTitle: 'Photography &',
    heroGold: 'Media Production',
    heroSub: 'We capture developments, showrooms, and launch events with editorial-quality photography and film — ready for campaigns and press.',
    portfolioSub: 'Photography and film content for developers, exhibitions, and sales environments.',
    whyTitle: 'Content That',
    whyGold: 'Elevates Perception',
    whySub: 'On-brand media assets produced alongside your visualization pipeline.',
    gallery: [
      { img: 'assets/projects/cinematic/video-2.jpg', label: 'Architectural Photography' },
      { img: 'assets/projects/cinematic/video-3.jpg', label: 'Aerial Filming' },
      { img: 'assets/projects/animation/real-estate-services.jpg', label: 'Event Coverage' },
      { img: 'assets/projects/rendering/0.jpg', label: 'Showroom Shoots' },
      { img: 'assets/news/makkah-charter-04.jpeg', label: 'Documentary Style' },
    ],
    features: [
      { icon: 'photo_camera', title: 'Architectural Photography', desc: 'Exterior, interior, and amenity photography for catalogs and campaigns.' },
      { icon: 'flight', title: 'Aerial & Drone', desc: 'Drone filming and photography for masterplans and construction progress.' },
      { icon: 'videocam', title: 'Event Filming', desc: 'Launch ceremonies, VIP visits, and exhibition coverage.' },
      { icon: 'movie_edit', title: 'Post & Delivery', desc: 'Retouching, color grading, and asset packages for web and print.' },
    ],
    portfolio: [
      { img: 'assets/projects/cinematic/video-2.jpg', cat: 'Photography', title: 'Development Photography' },
      { img: 'assets/projects/cinematic/video-3.jpg', cat: 'Aerial', title: 'Aerial Masterplan Film' },
      { img: 'assets/projects/animation/real-estate-services.jpg', cat: 'Media', title: 'Real Estate Services Film' },
      { img: 'assets/news/makkah-charter-04.jpeg', cat: 'Event', title: 'MWL Exhibition Coverage' },
      { img: 'assets/projects/rendering/jeddah-forum.jpg', cat: 'Photography', title: 'Jeddah Forum' },
      { img: 'assets/projects/maquettes/anan-escan3.jpeg', cat: 'Photography', title: 'Maquette Documentation' },
    ],
    cta1: { title: 'Capture Your', gold: 'Project Story', sub: 'Photography and film teams across KSA, Oman, Bahrain, and Egypt.' },
    cta2: { title: 'Integrated With', gold: 'CGI & Film', sub: 'One studio for stills, motion, and visualization — consistent quality.' },
    cta3: { title: 'Book a', gold: 'Shoot', sub: 'Share your locations and deliverables — we will propose a production plan.' },
    related: [SHARED_RELATED.production, SHARED_RELATED.rendering, SHARED_RELATED.marketing, SHARED_RELATED.branding],
    bookingTitle: 'Plan Your Photography & Media Package',
    bookingText: 'From single-day shoots to full launch content libraries — scoped to your campaign.',
    formSubject: 'Quote request - Photography & Media EN',
    formOptions: ['Architectural Photography', 'Aerial / Drone', 'Event Filming', 'Content Retainer'],
  },
  {
    slug: 'smart-visualization',
    serviceName: 'Smart Visualization',
    pageTitle: 'Smart Visualization Systems | Graphics House',
    meta: 'Integrated visualization combining CGI, data layers, interactive tools, and sales presentation systems for large developments.',
    ogDescription: 'Smart visualization ecosystems for mega real estate projects.',
    heroTitle: 'Smart Visualization',
    heroGold: 'Systems',
    heroSub: 'We unify CGI, interactive layers, and presentation technology into one coherent visual system — built for complex masterplans and phased launches.',
    portfolioSub: 'Integrated visual systems for giga-projects and multi-phase developments.',
    whyTitle: 'One System,',
    whyGold: 'Every Touchpoint',
    whySub: 'Visualization architecture that scales from investor deck to sales floor.',
    gallery: [
      { img: 'assets/projects/rendering/jeddah-forum.jpg', label: 'CGI Layer' },
      { img: 'assets/projects/maquettes/alrajhi3.jpeg', label: 'Physical Layer' },
      { img: 'assets/news/makkah-charter-02.jpeg', label: 'Interactive Layer' },
      { img: 'assets/projects/rendering/pavilion3-1.jpg', label: 'Presentation Layer' },
      { img: 'assets/projects/animation/architectural-visualisation.jpg', label: 'Film Layer' },
    ],
    features: [
      { icon: 'layers', title: 'Unified Asset Library', desc: 'One source of truth for renders, films, and interactive content across phases.' },
      { icon: 'sync', title: 'Live Data Integration', desc: 'Connect sales data, availability, and news feeds to screens and maquettes.' },
      { icon: 'devices', title: 'Multi-Channel Delivery', desc: 'Showrooms, web, mobile, and event installations from the same system.' },
      { icon: 'tune', title: 'Phased Rollouts', desc: 'Update towers, districts, and amenities as construction progresses.' },
    ],
    portfolio: [
      { img: 'assets/projects/rendering/jeddah-forum.jpg', cat: 'System', title: 'Jeddah Forum Visual System' },
      { img: 'assets/projects/maquettes/alrajhi3.jpeg', cat: 'System', title: 'Al Rajhi Integrated Presentation' },
      { img: 'assets/news/makkah-charter-02.jpeg', cat: 'System', title: 'MWL Interactive HQ' },
      { img: 'assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg', cat: 'CGI', title: 'Al Oula Masterplan' },
      { img: 'assets/projects/animation/jeddah-forum.jpg', cat: 'Film', title: 'Launch Film Integration' },
      { img: 'assets/projects/rendering/uae-e1745147961286.jpeg', cat: 'CGI', title: 'Tower Visualization' },
    ],
    cta1: { title: 'Unify Your', gold: 'Visual Stack', sub: 'Stop juggling vendors — one integrated visualization partner.' },
    cta2: { title: 'Built for', gold: 'Phased Mega-Projects', sub: 'Systems that evolve with your masterplan and sales calendar.' },
    cta3: { title: 'Architect Your', gold: 'Visual System', sub: 'Request a consultation for multi-phase visualization strategy.' },
    related: [SHARED_RELATED.rendering, SHARED_RELATED.maquettes, SHARED_RELATED.interactive, SHARED_RELATED.ai],
    bookingTitle: 'Design a Smart Visualization Roadmap',
    bookingText: 'We map CGI, interactive, maquette, and film layers into one coherent sales system.',
    formSubject: 'Quote request - Smart Visualization EN',
    formOptions: ['Visualization Audit', 'Integrated System Design', 'Phased Rollout Plan', 'Data Integration'],
  },
  {
    slug: 'web-solutions',
    serviceName: 'Web Solutions',
    pageTitle: 'Real Estate Websites & Digital Platforms | Graphics House',
    meta: 'Project websites, landing pages, and digital sales platforms for real estate launches in Saudi Arabia and the GCC.',
    ogDescription: 'High-converting project websites and digital sales funnels for developers.',
    heroTitle: 'Web Solutions for',
    heroGold: 'Property Launches',
    heroSub: 'We design and build project websites, landing pages, and digital sales platforms — optimized for lead capture and bilingual GCC audiences.',
    portfolioSub: 'Digital platforms and launch sites for developers across the region.',
    whyTitle: 'Websites That',
    whyGold: 'Sell Units',
    whySub: 'Fast, bilingual, conversion-focused sites backed by studio-grade visuals.',
    gallery: [
      { img: 'assets/projects/rendering/jeddah-forum.jpg', label: 'Project Websites' },
      { img: 'assets/projects/rendering/alrajhi2.jpeg', label: 'Landing Pages' },
      { img: 'assets/projects/maquettes/anan-escan3.jpeg', label: 'Lead Capture' },
      { img: 'assets/projects/rendering/0.jpg', label: 'Bilingual UX' },
      { img: 'assets/projects/rendering/c3.jpg', label: 'Investor Portals' },
    ],
    features: [
      { icon: 'language', title: 'Project Websites', desc: 'Bilingual sites with unit finders, galleries, and CRM-ready lead forms.' },
      { icon: 'web', title: 'Launch Landing Pages', desc: 'Campaign-specific pages optimized for paid media and event QR flows.' },
      { icon: 'speed', title: 'Performance & SEO', desc: 'Fast loading, structured data, and hreflang for GCC search visibility.' },
      { icon: 'integration_instructions', title: 'CRM Integration', desc: 'Connect forms and chat to your sales stack and analytics tools.' },
    ],
    portfolio: [
      { img: 'assets/projects/rendering/jeddah-forum.jpg', cat: 'Web', title: 'Exhibition Launch Site' },
      { img: 'assets/projects/rendering/alrajhi2.jpeg', cat: 'Web', title: 'Development Microsite' },
      { img: 'assets/projects/maquettes/anan-escan3.jpeg', cat: 'Web', title: 'Pre-Sales Landing Page' },
      { img: 'assets/projects/rendering/anan-escan3.jpeg', cat: 'Web', title: 'Anan Eskan Digital Presence' },
      { img: 'assets/projects/rendering/uae-e1745147961286.jpeg', cat: 'Web', title: 'Commercial Project Site' },
      { img: 'assets/projects/rendering/c3.jpg', cat: 'Web', title: 'Catalog + Web Bundle' },
    ],
    cta1: { title: 'Launch a', gold: 'Conversion-Ready Site', sub: 'Visuals, copy, and development — delivered by one integrated team.' },
    cta2: { title: 'Arabic & English', gold: 'Out of the Box', sub: 'RTL/LTR experiences built for Saudi and Gulf buyers.' },
    cta3: { title: 'Start Your', gold: 'Web Project', sub: 'Share your launch timeline — we will propose architecture and scope.' },
    related: [SHARED_RELATED.marketing, SHARED_RELATED.branding, SHARED_RELATED.interactive, SHARED_RELATED.rendering],
    bookingTitle: 'Build Your Project Digital Platform',
    bookingText: 'Websites, landing pages, and integrations — aligned to your visual launch system.',
    formSubject: 'Quote request - Web Solutions EN',
    formOptions: ['Project Website', 'Launch Landing Page', 'Investor Portal', 'CRM Integration'],
  },
  {
    slug: 'scale-models',
    serviceName: 'Scale Models',
    pageTitle: 'Architectural Scale Models | Graphics House',
    meta: 'Precision architectural scale models for presentations, exhibitions, and investor meetings across Saudi Arabia and the GCC.',
    ogDescription: 'Handcrafted architectural scale models for real estate presentations.',
    heroTitle: 'Architectural',
    heroGold: 'Scale Models',
    heroSub: 'We craft precision physical models for boardrooms, exhibitions, and sales galleries — combining traditional craftsmanship with optional digital integration.',
    portfolioSub: 'Scale models for developers, government projects, and international exhibitions.',
    whyTitle: 'Models That',
    whyGold: 'Command Attention',
    whySub: 'Tactile presentation tools for high-stakes investor and VIP meetings.',
    gallery: [
      { img: 'assets/projects/maquettes/alrajhi3.jpeg', label: 'Residential Models' },
      { img: 'assets/projects/maquettes/anan-escan3.jpeg', label: 'Masterplan Models' },
      { img: 'assets/projects/maquettes/Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg', label: 'Tower Models' },
      { img: 'assets/projects/maquettes/maquette-detail-02.jpeg', label: 'Detail Craftsmanship' },
      { img: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg', label: 'Exhibition Models' },
    ],
    features: [
      { icon: 'domain', title: 'Masterplan Models', desc: 'Large-scale site models showing phasing, landscaping, and infrastructure.' },
      { icon: 'apartment', title: 'Tower & Unit Models', desc: 'Detailed high-rise and villa models for sales presentations.' },
      { icon: 'precision_manufacturing', title: 'Premium Finishing', desc: 'Hand-painted facades, lighting, and landscape detailing.' },
      { icon: 'view_in_ar', title: 'Smart Integration', desc: 'Optional projection mapping and interactive lighting on select models.' },
    ],
    portfolio: [
      { img: 'assets/projects/maquettes/alrajhi3.jpeg', cat: 'Maquette', title: 'Al Rajhi Development' },
      { img: 'assets/projects/maquettes/anan-escan3.jpeg', cat: 'Maquette', title: 'Anan Eskan, Riyadh' },
      { img: 'assets/projects/maquettes/Al-Khair-Heights-in-Makkah1-e1745148056352.jpeg', cat: 'Maquette', title: 'Al Khair Heights, Makkah' },
      { img: 'assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg', cat: 'Maquette', title: 'MWL Exhibition Model' },
      { img: 'assets/projects/maquettes/maquette-detail-02.jpeg', cat: 'Maquette', title: 'Detail Close-Up' },
      { img: 'assets/projects/maquettes/The-Financial-Center-of-King-Abdullah-City.jpeg', cat: 'Maquette', title: 'King Abdullah Financial District' },
    ],
    cta1: { title: 'Present at', gold: 'Boardroom Scale', sub: 'Physical models that anchor conversations with investors and government stakeholders.' },
    cta2: { title: 'Pair With', gold: 'Smart Maquettes', sub: 'Upgrade to projection mapping and live data when your presentation demands it.' },
    cta3: { title: 'Commission a', gold: 'Scale Model', sub: 'Share your drawings and deadline — we will propose specifications and timeline.' },
    related: [SHARED_RELATED.maquettes, SHARED_RELATED.rendering, SHARED_RELATED.interactive, SHARED_RELATED.production],
    bookingTitle: 'Plan Your Architectural Scale Model',
    bookingText: 'From compact tabletop models to full exhibition builds — scoped to your venue and audience.',
    formSubject: 'Quote request - Scale Models EN',
    formOptions: ['Masterplan Model', 'Tower Model', 'Exhibition Build', 'Smart Model Upgrade'],
  },
];

function buildPage(cfg, css) {
  const enFile = `${cfg.slug}-en.html`;
  const arFile = `${cfg.slug}.html`;
  const canonical = `${BASE}/services/${enFile}`;
  const arUrl = `${BASE}/services/${arFile}`;
  const header = renderHeader(1, true);
  const footer = renderFooter(1, true);

  const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<script src="${P}assets/gh-forms-config.js?v=2"></script>
<!-- GH perf -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<!-- GH SEO -->
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${canonical}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="x-default" href="${canonical}">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(cfg.pageTitle)}</title>
<meta name="description" content="${esc(cfg.meta)}"/>
<meta property="og:title" content="${esc(cfg.serviceName)} | Graphics House">
<meta property="og:description" content="${esc(cfg.ogDescription)}">
<meta property="og:image" content="${BASE}/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${P}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${P}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?display=swap&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" rel="stylesheet" />
<link rel="stylesheet" href="${P}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${P}assets/gh-site-enhancements.css?v=21">
<link rel="stylesheet" href="${P}assets/site-header.css?v=28">
<style>
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
${css}
</style>
<script defer src="${P}assets/site-header.js?v=14"></script>
<script defer src="${P}assets/gh-performance.js?v=2"></script>
<script defer src="${P}assets/lang-switch.js?v=1"></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: cfg.serviceName,
    description: cfg.meta,
    url: canonical,
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body>
${header}
<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>
${bodyContent(cfg)}
${footer}
${pageScripts()}
</body>
</html>
`;

  fs.writeFileSync(path.join(SERVICES, enFile), html, 'utf8');
  console.log('  rich EN:', enFile, `(${html.split('\n').length} lines)`);
}

console.log('Building rich English service pages…');
const css = extractPageCss();
for (const cfg of PAGES) {
  buildPage(cfg, css);
}
console.log(`Done — ${PAGES.length} rich service pages built.`);
