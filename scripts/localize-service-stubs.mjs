#!/usr/bin/env node
/**
 * Convert EN-only service stub pages to bilingual AR-first (RTL) pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SERVICES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'services');

const STUBS = {
  'ai-solutions.html': {
    icon: 'psychology',
    en: {
      title: 'AI Solutions',
      subtitle:
        'AI-powered visualization, automation, and creative workflows for real estate and engineering teams in the GCC. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'حلول الذكاء الاصطناعي',
      subtitle:
        'تصور وإنتاج وأتمتة مدعومة بالذكاء الاصطناعي لفرق العقار والهندسة في الخليج. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'AI-powered creative and visualization solutions for the GCC.',
    metaAr: 'حلول إبداعية وتصور مدعومة بالذكاء الاصطناعي لسوق الخليج.',
  },
  'branding.html': {
    icon: 'brush',
    en: {
      title: 'Branding',
      subtitle:
        'Comprehensive branding solutions, from identity design to brand strategy and positioning for the GCC market. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'الهوية والعلامة التجارية',
      subtitle:
        'حلول هوية متكاملة, من تصميم الهوية إلى استراتيجية العلامة وموقعها في سوق الخليج. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Strategic brand identity and brand development services.',
    metaAr: 'هوية بصرية واستراتيجية علامة تجارية للسوق الخليجي.',
  },
  'cinematic-cgi.html': {
    icon: 'movie',
    en: {
      title: 'Cinematic CGI',
      subtitle:
        'High-end cinematic CGI films for project launches, sales centers, and investor presentations. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'أفلام CGI سينمائية',
      subtitle:
        'أفلام CGI سينمائية عالية الجودة لإطلاق المشاريع ومراكز المبيعات والعروض الاستثمارية. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Cinematic CGI films for real estate and architectural launches.',
    metaAr: 'أفلام CGI سينمائية لإطلاق المشاريع العقارية والمعمارية.',
  },
  'digital-marketing.html': {
    icon: 'campaign',
    en: {
      title: 'Digital Marketing',
      subtitle:
        'Performance marketing, content, and lead generation for developers and engineering firms in Saudi Arabia and the GCC. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'التسويق الرقمي',
      subtitle:
        'تسويق أداء ومحتوى وتوليد عملاء للمطورين والمكاتب الهندسية في السعودية والخليج. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Digital marketing and lead generation for the GCC real estate sector.',
    metaAr: 'تسويق رقمي وتوليد عملاء لقطاع العقار في الخليج.',
  },
  'interactive-experiences.html': {
    icon: 'touch_app',
    en: {
      title: 'Interactive Experiences',
      subtitle:
        'Touchscreen kiosks, sales-center interactives, and immersive project showcases. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'التجارب التفاعلية',
      subtitle:
        'شاشات لمس وكيوسك تفاعلي وعروض غامرة للمشاريع في مراكز المبيعات. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Interactive sales-center and kiosk experiences for real estate.',
    metaAr: 'تجارب تفاعلية وكيوسك لعروض المشاريع العقارية.',
  },
  'photography-media.html': {
    icon: 'photo_camera',
    en: {
      title: 'Photography & Media',
      subtitle:
        'Architectural photography, drone, and media production for project marketing in the GCC. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'التصوير والإنتاج الإعلامي',
      subtitle:
        'تصوير معماري ودرون وإنتاج إعلامي لتسويق المشاريع في الخليج. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Architectural photography and media production for developers.',
    metaAr: 'تصوير معماري وإنتاج إعلامي للمطورين العقاريين.',
  },
  'scale-models.html': {
    icon: 'domain',
    en: {
      title: 'Scale Models',
      subtitle:
        'Physical and smart architectural scale models for exhibitions and sales galleries. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'المجسمات المعمارية',
      subtitle:
        'مجسمات معمارية تقليدية وذكية للمعارض وصالات العرض. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Architectural scale models for exhibitions and sales centers.',
    metaAr: 'مجسمات معمارية للمعارض ومراكز المبيعات.',
  },
  'smart-visualization.html': {
    icon: 'view_in_ar',
    en: {
      title: 'Smart Visualization',
      subtitle:
        'Real-time 3D visualization, configurators, and smart sales tools for real estate projects. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'التصور الذكي',
      subtitle:
        'تصور ثلاثي الأبعاد لحظي ومتغيرات وأدوات بيع ذكية للمشاريع العقارية. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Smart 3D visualization and configurators for real estate sales.',
    metaAr: 'تصور ثلاثي الأبعاد ذكي وأدوات بيع للمشاريع العقارية.',
  },
  'web-solutions.html': {
    icon: 'language',
    en: {
      title: 'Web Solutions',
      subtitle:
        'Project websites, landing pages, and digital sales platforms for developers in the GCC. This page is under development.',
      status: 'Coming Soon',
      back: 'Back to Home',
      cta: 'Get in Touch',
    },
    ar: {
      title: 'الحلول الرقمية والمواقع',
      subtitle:
        'مواقع مشاريع وصفحات هبوط ومنصات بيع رقمية للمطورين في الخليج. هذه الصفحة قيد التطوير.',
      status: 'قريباً',
      back: 'العودة للرئيسية',
      cta: 'تواصل معنا',
    },
    metaEn: 'Websites and digital platforms for real estate project launches.',
    metaAr: 'مواقع ومنصات رقمية لإطلاق المشاريع العقارية.',
  },
};

const BILINGUAL_CSS = `
  .en.en-block { display: none !important; }
  body.is-en .en { display: inline !important; }
  body.is-en .ar, body.is-en .ar-block { display: none !important; }
  body.is-en .en-block { display: block !important; }
  .ar-block { display: block; }
`;

function patchStub(file, data) {
  const full = path.join(SERVICES, file);
  let html = fs.readFileSync(full, 'utf8');

  html = html.replace(/<html[^>]*>/, '<html class="scroll-smooth" dir="rtl" lang="ar">');

  if (!html.includes('Bilingual visibility')) {
    html = html.replace(/<style>/, `<style>\n${BILINGUAL_CSS}`);
  }

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${data.ar.title} | Graphics House</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\/?>/,
    `<meta name="description" content="${data.metaAr}"/>`
  );
  html = html.replace(
    /<link rel="alternate" hreflang="ar" href="[^"]*">/,
    `<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/services/${file}">`
  );

  const section = `<section class="ud-section">
  <div class="ud-card reveal">
    <span class="material-symbols-outlined ud-icon">${data.icon}</span>
    <h1 class="ud-title"><span class="ar">${data.ar.title}</span><span class="en">${data.en.title}</span></h1>
    <p class="ud-subtitle"><span class="ar-block">${data.ar.subtitle}</span><span class="en-block">${data.en.subtitle}</span></p>
    <div class="ud-status">
      <span class="dot"></span>
      <span class="ar">${data.ar.status}</span><span class="en">${data.en.status}</span>
    </div>
    <div class="ud-cta">
      <a href="../index-ar.html" class="btn-pill btn-pill-outline ar-block">
        <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
        ${data.ar.back}
      </a>
      <a href="../index.html" class="btn-pill btn-pill-outline en-block">
        <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span>
        ${data.en.back}
      </a>
      <a href="../contact-us.html" class="btn-pill btn-pill-gold ar-block">
        ${data.ar.cta}
        <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span>
      </a>
      <a href="../contact-us-en.html" class="btn-pill btn-pill-gold en-block">
        ${data.en.cta}
        <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span>
      </a>
    </div>
  </div>
</section>`;

  html = html.replace(/<section class="ud-section">[\s\S]*?<\/section>/, section);

  if (!html.includes('service-lang-toggle')) {
    const toggle = `<script>
(function(){
  var key='gh-svc-lang';
  function apply(en){document.body.classList.toggle('is-en',en);localStorage.setItem(key,en?'en':'ar');}
  var saved=localStorage.getItem(key);
  if(saved==='en')apply(true);
  document.querySelectorAll('.lang-switch-link').forEach(function(a){
    a.addEventListener('click',function(e){
      if(a.getAttribute('hreflang')==='en'){e.preventDefault();apply(true);}
      if(a.getAttribute('hreflang')==='ar'){e.preventDefault();apply(false);}
    });
  });
})();
</script>`;
    html = html.replace(/<\/body>/i, `${toggle}\n</body>`);
  }

  fs.writeFileSync(full, html, 'utf8');
  console.log('Localized:', file);
}

for (const [file, data] of Object.entries(STUBS)) {
  patchStub(file, data);
}

console.log(`Done, ${Object.keys(STUBS).length} service stubs localized.`);
