#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');

const beesAr = `    <div class="pf-motion-partner">
      <div class="pf-motion-partner__inner">
        <div class="pf-motion-partner__copy">
          <span class="pf-motion-partner__badge">Bees Motion</span>
          <p>الذراع التسويقي لـ <strong>Graphics House</strong> في الموشن جرافيك والمحتوى المرئي.</p>
        </div>
        <a href="https://www.beesmotion.com/" target="_blank" rel="noopener noreferrer" class="pf-motion-partner__link">
          beesmotion.com
          <span class="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
        </a>
      </div>
    </div>`;

const beesEn = `    <div class="pf-motion-partner">
      <div class="pf-motion-partner__inner">
        <div class="pf-motion-partner__copy">
          <span class="pf-motion-partner__badge">Bees Motion</span>
          <p>The dedicated motion graphics and visual content arm of <strong>Graphics House</strong>.</p>
        </div>
        <a href="https://www.beesmotion.com/" target="_blank" rel="noopener noreferrer" class="pf-motion-partner__link">
          beesmotion.com
          <span class="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
        </a>
      </div>
    </div>`;

function patch(file, beesBlock) {
  let h = readFileSync(join(root, file), 'utf8');

  h = h.replace(/<style>[\s\S]*?<\/style>\n/, '');

  h = h.replace(/portfolio-page\.css\?v=\d+/, 'portfolio-page.css?v=3');

  h = h.replace(
    /(<section class="pf-section" data-section="cinematic">[\s\S]*?<div class="section-desc">[^<]*<\/div>\s*<\/div>\s*)<div class="pf-grid">/,
    '$1<div class="pf-grid pf-grid--feature-5">'
  );

  h = h.replace(
    /(<section class="pf-section" data-section="media">[\s\S]*?<div class="section-desc">[^<]*<\/div>\s*<\/div>\s*)<div class="pf-grid">/,
    '$1<div class="pf-grid pf-grid--duo">'
  );

  h = h.replace(
    /<div class="pf-motion-partner">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
    `${beesBlock}\n  </div>\n</section>`
  );

  if (file === 'portfolio.html') {
    h = h.replace(
      '<div class="filter-wrap">',
      '<div class="filter-wrap" id="filterBar">'
    );
  }

  writeFileSync(join(root, file), h);
  console.log('patched', file);
}

patch('portfolio.html', beesAr);
patch('portfolio-en.html', beesEn);
