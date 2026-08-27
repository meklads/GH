#!/usr/bin/env node
/**
 * Build full English architectural visualization page from AR rendering template.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHeader, renderFooter } from './layout-partials.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const AR_PATH = path.join(ROOT, 'services/rendering.html');
const OUT_PATH = path.join(ROOT, 'services/rendering-en.html');
const BASE = 'https://3dgraphicshouse.com';
const P = '../';

function extractPageCss(arHtml) {
  const m = arHtml.match(/<style>([\s\S]*?)<\/style>/);
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

function bodyContent() {
  return `<!-- GALLERY STRIP HERO -->
<section style="background:#0A0A0A;overflow:hidden;padding-top:96px">
  <div class="gallery-strip">
    <div class="gallery-strip-item gallery-video" data-video="${P}assets/videos/3D-Architectural-visualisation.mp4">
      <img loading="lazy" src="${P}assets/projects/rendering/jeddah-forum.jpg" alt="Exterior architectural rendering">
      <video preload="none" muted loop playsinline poster="${P}assets/projects/rendering/jeddah-forum.jpg"></video>
      <div class="gallery-strip-label">Exterior Rendering</div>
    </div>
    <div class="gallery-strip-item">
      <img loading="lazy" src="${P}assets/projects/rendering/0.jpg" alt="Interior rendering">
      <div class="gallery-strip-label">Interior Rendering</div>
    </div>
    <div class="gallery-strip-item">
      <img loading="lazy" src="${P}assets/projects/rendering/c3.jpg" alt="Project catalog design">
      <div class="gallery-strip-label">Project Catalogs</div>
    </div>
    <div class="gallery-strip-item">
      <img loading="lazy" src="${P}assets/projects/rendering/uae-e1745147961286.jpeg" alt="Brand identity">
      <div class="gallery-strip-label">Brand Identity</div>
    </div>
    <div class="gallery-strip-item">
      <img loading="lazy" src="${P}assets/projects/rendering/pavilion3-1.jpg" alt="CGI animation">
      <div class="gallery-strip-label">CGI Animation</div>
    </div>
    <div class="gallery-strip-item">
      <img loading="lazy" src="${P}assets/projects/rendering/wahat-alsalam9-scaled.jpg" alt="Integrated design">
      <div class="gallery-strip-label">Integrated Design</div>
    </div>
  </div>
</section>

<section style="background:var(--bg-white)">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">Our Services</span>
      <h2 class="section-title">Architectural Visualization <span class="gold">&amp; Brand Identity</span></h2>
      <p class="section-sub" style="margin:0 auto">We turn concepts into cinematic imagery and cohesive visual identities that tell your project's story.</p>
    </div>
    <div class="feature-grid reveal r1">
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">landscape</span></div>
        <h3>Exterior Rendering</h3>
        <p>Cinematic exterior stills and animations for villas, towers, and mixed-use developments from every angle.</p>
      </div>
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">meeting_room</span></div>
        <h3>Interior Rendering</h3>
        <p>Photorealistic interiors showcasing materials, lighting, and spatial quality across lobbies, units, and amenities.</p>
      </div>
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">menu_book</span></div>
        <h3>Project Catalogs</h3>
        <p>Print and digital sales catalogs designed to present your units and masterplan with premium clarity.</p>
      </div>
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">brand_awareness</span></div>
        <h3>Project Branding</h3>
        <p>Integrated visual identity — logo, palette, typography, and marketing collateral for launch-ready developments.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-d" style="background:#1A1A1A">
  <div class="cta-d-inner">
    <h2 style="color:#FAFAF8">Bring Your <span class="gold">Development</span> to Life</h2>
    <p style="color:rgba(255,255,255,0.6)">3D visuals, catalogs, and brand identity — delivered by one integrated studio.</p>
    <div class="btns">
      <a href="#booking" class="btn-p">Request a Quote <span class="material-symbols-outlined" style="font-size:16px">request_quote</span></a>
      <a href="${P}assets/downloads/GH-3d-images.pdf" target="_blank" rel="noopener noreferrer" class="btn-o-light">Download 3D Images PDF <span class="material-symbols-outlined" style="font-size:16px">picture_as_pdf</span></a>
      <a href="https://wa.me/966502786513" target="_blank" rel="noopener" class="btn-o-light">WhatsApp Us <span class="material-symbols-outlined" style="font-size:16px">phone_in_talk</span></a>
    </div>
  </div>
</section>

<section style="background:#F5F4F0">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">Portfolio</span>
      <h2 class="section-title">Selected <span class="gold">Visualization</span> Work</h2>
      <p class="section-sub" style="margin:0 auto">Exterior, interior, and branded collateral for leading developers across the GCC.</p>
    </div>
    <div class="portfolio-grid reveal r1">
      <div class="portfolio-item" onclick="openLightbox(this)"><img loading="lazy" src="${P}assets/projects/rendering/jeddah-forum.jpg" alt="Jeddah Forum"><div class="portfolio-item-overlay"><span class="portfolio-item-category">Exterior</span><span class="portfolio-item-title">Jeddah Forum International Exhibition</span></div></div>
      <div class="portfolio-item" onclick="openLightbox(this)"><img loading="lazy" src="${P}assets/projects/rendering/alrajhi2.jpeg" alt="Al Rajhi"><div class="portfolio-item-overlay"><span class="portfolio-item-category">Exterior</span><span class="portfolio-item-title">Al Rajhi Development, Riyadh</span></div></div>
      <div class="portfolio-item" onclick="openLightbox(this)"><img loading="lazy" src="${P}assets/projects/rendering/0.jpg" alt="Interior showroom"><div class="portfolio-item-overlay"><span class="portfolio-item-category">Interior</span><span class="portfolio-item-title">Sales Gallery Interior</span></div></div>
      <div class="portfolio-item" onclick="openLightbox(this)"><img loading="lazy" src="${P}assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg" alt="Al Oula"><div class="portfolio-item-overlay"><span class="portfolio-item-category">Exterior</span><span class="portfolio-item-title">Al Oula Real Estate, Al Nakheel</span></div></div>
      <div class="portfolio-item" onclick="openLightbox(this)"><img loading="lazy" src="${P}assets/projects/rendering/uae-e1745147961286.jpeg" alt="UAE commercial"><div class="portfolio-item-overlay"><span class="portfolio-item-category">Architectural</span><span class="portfolio-item-title">Commercial Development, UAE</span></div></div>
      <div class="portfolio-item" onclick="openLightbox(this)"><img loading="lazy" src="${P}assets/projects/rendering/The-Meteorological-Building.jpeg" alt="Meteorological building"><div class="portfolio-item-overlay"><span class="portfolio-item-category">Architectural</span><span class="portfolio-item-title">Meteorological Authority Building</span></div></div>
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
      <h2 class="section-title">15 Years in <span class="gold">Architectural Visualization</span></h2>
      <p class="section-sub" style="margin:0 auto">Experience, technology, and creative direction — imagery built to sell.</p>
    </div>
    <div class="why-grid reveal r1">
      <div class="why-card"><div class="num">15</div><h4>Years of Experience</h4><p>Deep GCC market knowledge serving developers and engineering firms.</p></div>
      <div class="why-card"><div class="num">500+</div><h4>Projects Delivered</h4><p>Residential, commercial, hospitality, and government mega-developments.</p></div>
      <div class="why-card"><div class="num">4</div><h4>Regional Offices</h4><p>Saudi Arabia, Oman, Bahrain, and Egypt — teams where you need them.</p></div>
      <div class="why-card"><div class="num">1</div><h4>Integrated Studio</h4><p>Artists, designers, and directors under one roof — zero fragmentation.</p></div>
    </div>
  </div>
</section>

<section class="cta-d" style="background:#1A1A1A">
  <div class="cta-d-inner">
    <h2 style="color:#FAFAF8">Trusted by Leading <span class="gold">Engineering Firms</span> in the Gulf</h2>
    <p style="color:rgba(255,255,255,0.6)">Discover why developers and architects choose Graphics House for launch-ready visuals.</p>
    <div class="btns"><a href="#booking" class="btn-p">Book a Consultation <span class="material-symbols-outlined" style="font-size:16px">lightbulb</span></a></div>
  </div>
</section>

<section style="background:#F5F4F0;padding:90px 0">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">Related Services</span>
      <h2 class="section-title">Everything Your <span class="gold">Project</span> Needs</h2>
      <p class="section-sub" style="margin:0 auto">Integrated visual and marketing systems from a single studio.</p>
    </div>
    <div class="rel-grid reveal r1">
      <a href="production-en.html" class="rel-card"><div class="icon"><span class="material-symbols-outlined">photo_camera</span></div><h4>Photography &amp; Media</h4><p>Architectural photography, aerial filming, and launch campaign content.</p></a>
      <a href="maquettes-en.html" class="rel-card"><div class="icon"><span class="material-symbols-outlined">view_in_ar</span></div><h4>Smart Maquettes</h4><p>Physical-digital models with projection mapping and live data integration.</p></a>
      <a href="digital-marketing-en.html" class="rel-card"><div class="icon"><span class="material-symbols-outlined">trending_up</span></div><h4>Digital Marketing</h4><p>Performance marketing and lead generation for real estate launches.</p></a>
      <a href="interactive-en.html" class="rel-card"><div class="icon"><span class="material-symbols-outlined">touch_app</span></div><h4>Interactive Experiences</h4><p>Touchscreens, VR tours, and interactive sales environments.</p></a>
    </div>
  </div>
</section>

<section class="cta-d" style="background:#1A1A1A">
  <div class="cta-d-inner">
    <h2 style="color:#FAFAF8">Ready to <span class="gold">Launch</span> Your Project?</h2>
    <p style="color:rgba(255,255,255,0.6)">Request a quote today — our team responds within 24 hours.</p>
    <div class="btns">
      <a href="#booking" class="btn-p">Request a Quote <span class="material-symbols-outlined" style="font-size:16px">request_quote</span></a>
      <a href="https://wa.me/966502786513" target="_blank" rel="noopener" class="btn-o-light">WhatsApp <span class="material-symbols-outlined" style="font-size:16px">chat</span></a>
    </div>
  </div>
</section>

<section id="booking" class="contact-s">
  <div class="contact-inner">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.2em;color:var(--gold);margin-bottom:12px;text-transform:uppercase">Contact Us</span>
      <h2 style="font-size:clamp(26px,3.8vw,42px);font-weight:500;margin-bottom:12px">Request a Quote for <span style="color:var(--gold)">Your Project</span></h2>
      <p style="font-size:16px;color:var(--text-secondary);max-width:500px;margin:0 auto">Fill in the form and our visualization team will contact you within 24 hours.</p>
    </div>
    <div class="contact-grid reveal r1">
      <div class="contact-info">
        <h3>Let's Build Your Project's Visual Identity</h3>
        <p>Whether you need 3D stills, a sales catalog, or a complete brand system — our specialists are ready.</p>
        <div class="contact-info-item"><span class="material-symbols-outlined">phone_in_talk</span> +966 50 278 6513</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">mail</span> info@3dgraphicshouse.com</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">location_on</span> Jeddah, Saudi Arabia — 4 regional offices</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">schedule</span> Response within 24 business hours</div>
      </div>
      <div class="form-card">
        <h3>Quote Request</h3>
        <form class="gh-quote-form" action="https://formsubmit.co/info@3dgraphicshouse.com" method="POST">
          <input type="hidden" name="_subject" value="Quote request - Architectural Visualization EN">
          <input type="hidden" name="_next" value="${BASE}/services/rendering-en.html?sent=1#booking">
          <div class="form-group"><label>Full Name</label><input type="text" name="name" required placeholder="Your name"></div>
          <div class="form-group"><label>Company</label><input type="text" name="company" placeholder="Company name"></div>
          <div class="form-group"><label>Phone</label><input type="tel" name="phone" required placeholder="+966..."></div>
          <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="you@company.com"></div>
          <div class="form-group"><label>Service Type</label>
            <select name="service" required>
              <option value="">Select service</option>
              <option value="exterior">Exterior 3D Rendering</option>
              <option value="interior">Interior 3D Rendering</option>
              <option value="catalog">Project Catalog Design</option>
              <option value="branding">Project Brand Identity</option>
              <option value="animation">Cinematic CGI Film</option>
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

function build() {
  const arHtml = fs.readFileSync(AR_PATH, 'utf8');
  const css = extractPageCss(arHtml);
  const header = renderHeader(1, true);
  const footer = renderFooter(1, true);
  const canonical = `${BASE}/services/rendering-en.html`;
  const arUrl = `${BASE}/services/rendering.html`;

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
<title>Architectural Visualization &amp; Brand Identity | Graphics House</title>
<meta name="description" content="Premium architectural visualization, 3D rendering, project catalogs, and visual identity for mega developments across Saudi Arabia and the GCC."/>
<meta property="og:title" content="Architectural Visualization | Graphics House">
<meta property="og:description" content="Photorealistic 3D renders and branded sales collateral for developers and architects in the GCC.">
<meta property="og:image" content="${BASE}/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${P}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${P}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?display=swap&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" rel="stylesheet" />
<link rel="stylesheet" href="${P}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${P}assets/gh-site-enhancements.css?v=28">
<link rel="stylesheet" href="${P}assets/site-header.css?v=31">
<style>
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
${css}
</style>
<script defer src="${P}assets/site-header.js?v=16"></script>
<script defer src="${P}assets/gh-performance.js?v=2"></script>
<script defer src="${P}assets/lang-switch.js?v=1"></script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Architectural Visualization',
    description: 'Premium architectural visualization and 3D rendering for developers and architects in Saudi Arabia and the GCC.',
    url: canonical,
    provider: { '@type': 'Organization', name: 'Graphics House', url: BASE },
    areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
  })}</script>
</head>
<body>
${header}
<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>
${bodyContent()}
${footer}
${pageScripts()}
</body>
</html>
`;

  fs.writeFileSync(OUT_PATH, html, 'utf8');
  console.log('Built services/rendering-en.html');
}

build();
