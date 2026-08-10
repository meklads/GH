#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');

const heroAr = `<!-- ══ HERO ══ -->
<section class="pf-hero">
  <div class="pf-hero-glow" aria-hidden="true"></div>
  <div class="container pf-hero-layout">
    <div class="pf-hero-copy">
      <div class="pf-eyebrow">معرض الأعمال</div>
      <h1>أعمال تتحدث<br><em>بصوت عالٍ</em></h1>
      <p>من الإظهار المعماري الواقعي إلى المجسمات الذكية والإنتاج السينمائي CGI وجاليريات المبيعات التفاعلية، مصممة لمشاريع التطوير الكبرى في الشرق الأوسط.</p>
      <a href="#filterBar" class="pf-hero-cta">استكشف الأعمال</a>
    </div>
    <div class="pf-hero-mosaic" aria-hidden="true">
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--a"><img src="assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg" alt="" loading="eager" decoding="async"/></div>
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--b"><img src="assets/projects/maquettes/alrajhi-maquette-01.jpeg" alt="" loading="eager" decoding="async"/></div>
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--c"><img src="assets/projects/maquettes/anan-eskan-maquette-01.jpeg" alt="" loading="eager" decoding="async"/></div>
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--d"><img src="https://img.youtube.com/vi/GlbvI0DRXE4/maxresdefault.jpg" alt="" loading="eager" decoding="async"/></div>
    </div>
  </div>
  <div class="pf-hero-stats">
    <div class="container pf-hero-stats__grid">
      <div class="pf-stat"><strong>25+</strong><span>مشروع منجز</span></div>
      <div class="pf-stat"><strong>6</strong><span>تخصصات إبداعية</span></div>
      <div class="pf-stat"><strong>4</strong><span>أسواق خليجية</span></div>
      <div class="pf-stat"><strong>CGI</strong><span>سينمائي · تفاعلي · مجسم</span></div>
    </div>
  </div>
</section>`;

const heroEn = `<!-- ══════ HERO ══════ -->
<section class="pf-hero">
  <div class="pf-hero-glow" aria-hidden="true"></div>
  <div class="container pf-hero-layout">
    <div class="pf-hero-copy">
      <div class="pf-eyebrow">Portfolio</div>
      <h1>Work That<br>Speaks <em>Volumes</em></h1>
      <p>From photorealistic visualization to smart maquettes, cinematic CGI, and interactive sales galleries, crafted for landmark developments across the Middle East.</p>
      <a href="#filterBar" class="pf-hero-cta">Explore the Work</a>
    </div>
    <div class="pf-hero-mosaic" aria-hidden="true">
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--a"><img src="assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg" alt="" loading="eager" decoding="async"/></div>
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--b"><img src="assets/projects/maquettes/alrajhi-maquette-01.jpeg" alt="" loading="eager" decoding="async"/></div>
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--c"><img src="assets/projects/maquettes/anan-eskan-maquette-01.jpeg" alt="" loading="eager" decoding="async"/></div>
      <div class="pf-hero-mosaic__cell pf-hero-mosaic__cell--d"><img src="https://img.youtube.com/vi/GlbvI0DRXE4/maxresdefault.jpg" alt="" loading="eager" decoding="async"/></div>
    </div>
  </div>
  <div class="pf-hero-stats">
    <div class="container pf-hero-stats__grid">
      <div class="pf-stat"><strong>25+</strong><span>Delivered Projects</span></div>
      <div class="pf-stat"><strong>6</strong><span>Creative Disciplines</span></div>
      <div class="pf-stat"><strong>4</strong><span>GCC Markets</span></div>
      <div class="pf-stat"><strong>CGI</strong><span>Cinematic · Interactive · Maquette</span></div>
    </div>
  </div>
</section>`;

function wrapSectionHeaders(html) {
  return html.replace(
    /<div class="section-header">\s*(<div class="section-label">[\s\S]*?<\/div>\s*<div class="section-title">[\s\S]*?<\/div>\s*<div class="section-desc">[\s\S]*?<\/div>)\s*<\/div>/g,
    '<div class="section-header"><div class="section-header__content">$1</div></div>'
  );
}

function patch(file, hero) {
  let h = readFileSync(join(root, file), 'utf8');

  h = h.replace(/<body>/, '<body class="pf-page">');

  h = h.replace(
    /<!-- ══+ HERO ══+ -->[\s\S]*?<\/section>\n\n<!-- ══+ FILTER/,
    hero + '\n\n<!-- ══ FILTER'
  );

  h = wrapSectionHeaders(h);

  h = h.replace(/portfolio-page\.css\?v=\d+/, 'portfolio-page.css?v=4');
  h = h.replace(/portfolio-page\.js\?v=\d+/, 'portfolio-page.js?v=4');

  writeFileSync(join(root, file), h);
  console.log('patched', file);
}

patch('portfolio.html', heroAr);
patch('portfolio-en.html', heroEn);
