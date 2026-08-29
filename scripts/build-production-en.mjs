#!/usr/bin/env node
/**
 * Build services/production-en.html to match production.html LP layout (EN copy).
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const P = '../';

const ar = fs.readFileSync(path.join(ROOT, 'services/production.html'), 'utf8');
const styleMatch = ar.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) throw new Error('Could not extract styles from production.html');
const styles = styleMatch[1].replace(
  /font-family: 'Tajawal', 'IBM Plex Sans Arabic', 'Inter', sans-serif;/,
  "font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;"
);

const html = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
${analyticsHeadTags(P)}
<link rel="canonical" href="https://3dgraphicshouse.com/services/production-en.html">
<link rel="alternate" hreflang="en" href="https://3dgraphicshouse.com/services/production-en.html">
<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/services/production.html">
<link rel="alternate" hreflang="x-default" href="https://3dgraphicshouse.com/services/production-en.html">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Photography &amp; Media Production | Graphics House</title>
<meta name="description" content="Architectural photography, promotional films, and event coverage for developers in Saudi Arabia and the GCC. Media production from the same team behind your maquettes and CGI.">
<meta property="og:title" content="Photography &amp; Media Production | Graphics House">
<meta property="og:description" content="Integrated production: photography, video, and visual content at cinematic standards.">
<meta property="og:image" content="https://3dgraphicshouse.com/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${P}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${P}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?display=swap&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" rel="stylesheet" />
<link rel="stylesheet" href="${P}assets/tailwind.min.css?v=1">
<link rel="stylesheet" href="${P}assets/gh-site-enhancements.css?v=28">
<link rel="stylesheet" href="${P}assets/site-header.css?v=36">
<link rel="stylesheet" href="${P}assets/gh-en-typography.css?v=1">
<style>
${styles}
</style>
<script defer src="${P}assets/site-header.js?v=16"></script>
<script defer src="${P}assets/gh-performance.js?v=10"></script>
<script defer src="${P}assets/lang-switch.js?v=2"></script>
<script defer src="${P}assets/site-reveal.js"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Service","name":"Photography & Media Production","description":"Architectural photography, promotional films, and event coverage for GCC developers. Media production from Graphics House.","url":"https://3dgraphicshouse.com/services/production-en.html","provider":{"@type":"Organization","name":"Graphics House","url":"https://3dgraphicshouse.com","logo":"https://3dgraphicshouse.com/assets/logo-gold.png"},"areaServed":["SA","AE","OM","BH","EG"]}</script>
<link rel="stylesheet" href="${P}assets/gh-float-widgets.css?v=9">
</head>
<body>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="${P}index.html" class="logo">
      <img src="${P}assets/logo-gold.png" alt="Graphics House" style="height:86px;width:auto">
    </a>
  </div>
</header>

<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>

<div class="video-modal" id="videoModal">
  <button class="vm-close" onclick="closeVideo()">✕</button>
  <div class="vm-inner">
    <div class="vm-aspect"><div id="vmPlayer"></div></div>
  </div>
</div>

<section class="lp-hero">
  <div class="lp-hero-glow" aria-hidden="true"></div>
  <div class="lp-wrap lp-hero-grid">
    <div class="lp-hero-copy reveal">
      <p class="lp-kicker">Media Production</p>
      <p class="lp-brand">Graphics House</p>
      <h1 class="lp-hero-lead">
        Visual content that supports
        <strong>your project launch</strong>
      </h1>
      <p class="lp-hero-sub">Architectural photography, promotional films, and event coverage. Integrated production for developers and brands in Saudi Arabia and the GCC, from the same team that builds your maquettes and CGI films.</p>
      <div class="lp-hero-ctas">
        <a href="#booking" class="btn-p">Book a production session</a>
        <a href="#gallery" class="btn-o">View our work</a>
      </div>
    </div>
    <div class="lp-proof reveal r1">
      <div class="lp-proof-visual">
        <img loading="lazy" src="${P}assets/photography/slide_image_12.png" alt="Media production, Graphics House" width="1672" height="941" fetchpriority="high" decoding="async">
      </div>
      <div class="lp-proof-meta">
        <span class="lp-proof-label">Service</span>
        <strong>Photography &amp; Media Production</strong>
        <span>Photography &amp; Media Production</span>
        <ul class="lp-proof-list">
          <li>4K/6K capture at cinematic standards</li>
          <li>Promotional films ready for campaigns and presentations</li>
          <li>Event coverage and project launch content</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="lp-impact reveal">
  <div class="lp-wrap">
    <div class="lp-impact-layout">
      <div>
        <p class="lp-kicker lp-kicker-light">Impact</p>
        <h2 class="lp-section-title lp-section-title-light">Content that builds trust before the signature</h2>
      </div>
      <p class="lp-impact-copy">Strong video and photography explain the project and build investor confidence. We produce for real estate, hospitality, and brands, at standards suited to GCC launch campaigns.</p>
    </div>
    <div class="lp-metrics">
      <div>
        <strong>15+ years</strong>
        <span>Production experience in Saudi Arabia and the GCC</span>
      </div>
      <div>
        <strong>Concept to delivery</strong>
        <span>Integrated team: capture, direction, and post-production</span>
      </div>
      <div>
        <strong>Publish-ready</strong>
        <span>Outputs for platforms, presentations, and sales</span>
      </div>
    </div>
  </div>
</section>

<section class="lp-film" id="reel">
  <div class="lp-wrap lp-film-grid">
    <div class="lp-film-copy reveal">
      <p class="lp-kicker">Production film</p>
      <h2 class="lp-section-title">See how we build visual presence</h2>
      <p>From architectural photography to promotional films, production that serves sales, platforms, and campaigns, from a team that understands real estate launch context.</p>
      <div class="lp-film-chips">
        <span>Real estate photography</span>
        <span>Promotional films</span>
        <span>Event coverage</span>
        <span>Platform content</span>
      </div>
    </div>
    <div class="lp-film-frame reveal r1">
      <video
        controls
        playsinline
        preload="metadata"
        poster="${P}assets/photography/slide_image_7.png"
        aria-label="Graphics House media production showreel">
        <source src="${P}assets/videos/GH-Marketing-Media-Production.mp4" type="video/mp4" media="(min-width: 768px)">
        <source src="${P}assets/videos/GH-Marketing-Media-Production-mobile.mp4" type="video/mp4">
      </video>
    </div>
  </div>
</section>

<section class="lp-services" id="services">
  <div class="lp-wrap">
    <header class="lp-head reveal">
      <p class="lp-kicker">Production services</p>
      <h2 class="lp-section-title">An integrated production system</h2>
      <p>Four pillars covering your visual needs from the first session to final deliverables.</p>
    </header>
    <div class="lp-svc-grid">
      <article class="lp-svc reveal">
        <div class="lp-svc-num">01</div>
        <h3>Commercial &amp; real estate photography</h3>
        <p>Sessions for products, residential projects, hotels, and restaurants, professional lighting that reflects brand value and shows detail accurately.</p>
      </article>
      <article class="lp-svc reveal r1">
        <div class="lp-svc-num">02</div>
        <h3>Promotional films</h3>
        <p>Cinematic videos for campaigns and project launches, visual storytelling that explains the project and supports purchase decisions.</p>
      </article>
      <article class="lp-svc reveal">
        <div class="lp-svc-num">03</div>
        <h3>Event coverage</h3>
        <p>Photography and production for exhibitions, conferences, and project openings, content ready to publish on your channels.</p>
      </article>
      <article class="lp-svc reveal r1">
        <div class="lp-svc-num">04</div>
        <h3>Presentations</h3>
        <p>Visual presentations for client and investor meetings, integrated design, capture, and direction that serves project narrative.</p>
      </article>
    </div>
  </div>
</section>

<section class="lp-gallery" id="gallery">
  <div class="lp-wrap">
    <header class="lp-head reveal">
      <p class="lp-kicker">Gallery</p>
      <h2 class="lp-section-title">Production that proves quality</h2>
      <p>Samples from photography and production work for developers and brands in real estate, hospitality, and retail.</p>
    </header>
    <div class="lp-gallery-grid reveal">
      <figure class="lp-shot"><img src="${P}assets/photography/slide_image_2.png" alt="Media production project" loading="lazy" decoding="async"></figure>
      <figure class="lp-shot"><img src="${P}assets/photography/slide_image_7.png" alt="Media production project" loading="lazy" decoding="async"></figure>
      <figure class="lp-shot"><img src="${P}assets/photography/slide_image_8.png" alt="Media production project" loading="lazy" decoding="async"></figure>
      <figure class="lp-shot"><img src="${P}assets/photography/slide_image_3.png" alt="Media production project" loading="lazy" decoding="async"></figure>
      <figure class="lp-shot"><img src="${P}assets/photography/slide_image_6.png" alt="Media production project" loading="lazy" decoding="async"></figure>
      <figure class="lp-shot"><img src="${P}assets/photography/slide_image_9.png" alt="Media production project" loading="lazy" decoding="async"></figure>
    </div>
    <div class="lp-gallery-foot reveal">
      <a href="${P}portfolio-en.html" class="btn-o">Explore the full portfolio</a>
    </div>
  </div>
</section>

<section class="lp-method">
  <div class="lp-wrap">
    <header class="lp-head reveal">
      <p class="lp-kicker">How we work</p>
      <h2 class="lp-section-title">From brief to delivery</h2>
      <p>A clear path that keeps quality controlled at every stage.</p>
    </header>
    <div class="lp-steps reveal">
      <div class="lp-step">
        <strong>01</strong>
        <h3>Understand the goal</h3>
        <p>Define audience, message, and how content will be used.</p>
      </div>
      <div class="lp-step">
        <strong>02</strong>
        <h3>Production plan</h3>
        <p>Script, locations, equipment, and schedule.</p>
      </div>
      <div class="lp-step">
        <strong>03</strong>
        <h3>Capture</h3>
        <p>On-site execution at cinematic standards.</p>
      </div>
      <div class="lp-step">
        <strong>04</strong>
        <h3>Edit &amp; delivery</h3>
        <p>Final output in formats ready to publish and present.</p>
      </div>
    </div>
  </div>
</section>

<section class="lp-close reveal">
  <div class="lp-wrap">
    <h2>Turn your project into a compelling visual story</h2>
    <p>A short session is enough for us to propose a production system suited to your brand and audience, with the same rigour we apply to major launch projects.</p>
    <div class="lp-close-actions">
      <a href="#booking" class="btn-p">Book a production session</a>
      <a href="https://wa.me/966502786513" target="_blank" rel="noopener" class="btn-o-light">WhatsApp</a>
    </div>
  </div>
</section>

<section class="lp-related">
  <div class="lp-wrap">
    <header class="lp-head reveal">
      <p class="lp-kicker">Related services</p>
      <h2 class="lp-section-title">An integrated visual system</h2>
    </header>
    <div class="rel-grid reveal">
      <a href="rendering-en.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">landscape</span></div>
        <h4>Architectural visualization</h4>
        <p>3D imagery and catalogs for major projects.</p>
      </a>
      <a href="maquettes-en.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">view_in_ar</span></div>
        <h4>Scale models</h4>
        <p>Architectural models with interactive technology.</p>
      </a>
      <a href="animation-en.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">movie</span></div>
        <h4>CGI films</h4>
        <p>Cinematic walkthroughs that bring projects to life before build.</p>
      </a>
      <a href="interactive-en.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">touch_app</span></div>
        <h4>Interactive experiences</h4>
        <p>Touchscreens and VR for sales galleries.</p>
      </a>
    </div>
  </div>
</section>

<section id="booking" class="contact-s">
  <div class="contact-inner">
    <header class="lp-head reveal">
      <p class="lp-kicker">Contact</p>
      <h2 class="lp-section-title">Book a production session</h2>
      <p>Fill in the form and we will respond within 24 hours to discuss your visual needs.</p>
    </header>
    <div class="contact-grid reveal r1">
      <div class="contact-info">
        <h3>Let us build your visual content together</h3>
        <p>Whether you need a photography session, event coverage, or a promotional film, our production team is ready to serve you at agency standards.</p>
        <div class="contact-info-item"><span class="material-symbols-outlined">phone_in_talk</span> +966 50 278 6513</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">mail</span> info@3dgraphicshouse.com</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">location_on</span> Jeddah, Saudi Arabia, offices in 4 countries</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">schedule</span> We reply within 24 business hours</div>
      </div>
      <div class="form-card">
        <h3>Photography / production request</h3>
        <form class="gh-quote-form" method="POST" novalidate>
          <input type="hidden" name="_subject" value="Media production request - services/production-en">
          <div class="form-group"><label>Full name</label><input type="text" name="name" required placeholder="Your name"></div>
          <div class="form-group"><label>Mobile number</label><input type="tel" name="phone" required placeholder="+966 5x xxx xxxx"></div>
          <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="you@company.com"></div>
          <div class="form-group"><label>Service required</label>
            <select name="service" required>
              <option value="">Select service</option>
              <option value="product-photography">Product photography</option>
              <option value="real-estate-photography">Real estate photography</option>
              <option value="event-coverage">Event coverage</option>
              <option value="promotional-video">Promotional video</option>
              <option value="commercial-shoot">Commercial shoot</option>
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
              <option value="madinah">Madinah</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group"><label>Project details</label><textarea name="message" placeholder="Tell us about your project, shoot type, location, approximate budget..."></textarea></div>
          <div class="gh-form-security">
            <div class="gh-honeypot" aria-hidden="true">
              <label>Do not fill</label>
              <input type="text" name="botcheck" tabindex="-1" autocomplete="off">
            </div>
            <div class="gh-turnstile"></div>
          </div>
          <div class="form-feedback" aria-live="polite"></div>
          <button type="submit" class="form-submit">Send request <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle">send</span></button>
        </form>
      </div>
    </div>
  </div>
</section>

<footer dir="ltr"><div style="padding:24px;text-align:center;font-size:12px;color:rgba(255,255,255,.3)">Graphics House</div></footer>

<script>
function closeVideo(){
  document.getElementById('videoModal').classList.remove('active');
  document.getElementById('vmPlayer').innerHTML='';
  document.body.style.overflow='';
}
document.addEventListener('click',function(e){
  if(e.target===document.getElementById('videoModal')) closeVideo();
});
document.addEventListener('keydown',function(e){if(e.key==='Escape') closeVideo()});
</script>
<script src="${P}assets/gh-forms-config.js?v=2"></script>
<script src="${P}assets/quote-form-config.js"></script>
<script defer src="${P}assets/quote-form.js?v=4"></script>
</body>
</html>`;

const out = path.join(ROOT, 'services/production-en.html');
fs.writeFileSync(out, html, 'utf8');
console.log('Built services/production-en.html');

execSync('node scripts/sync-layout.mjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/inject-float-widgets.mjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Synced layout and float widgets');
