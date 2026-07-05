#!/usr/bin/env node
/**
 * Build services/production.html from gh-photography landing content (reorganized).
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const P = '../';

const photo = fs.readFileSync(path.join(ROOT, 'gh-photography.html'), 'utf8');
const styleMatch = photo.match(/<style>([\s\S]*?)<\/style>/);
const extraStyles = fs.readFileSync(path.join(ROOT, 'gh-visualization.html'), 'utf8')
  .match(/\/\* SECTIONS \*\/[\s\S]*?\/\* CTA DIVIDERS \*\//)?.[0] || '';

const EXTRA = `
/* Solid site header on light landing body */
.header {
  background: rgba(10, 10, 10, 0.98);
  border-bottom: 1px solid rgba(201, 168, 76, 0.12);
}
body { padding-top: 0 !important; }
.hero-sec { padding-top: 96px; }
.hero-image { position: relative; }
.hero-overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  text-align: center; padding: 48px 32px 56px;
  background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.2) 100%);
  color: #fff;
}
.hero-kicker {
  font-size: 12px; font-weight: 700; letter-spacing: 0.18em;
  color: var(--gold); margin-bottom: 12px;
  font-family: 'Inter', sans-serif; text-transform: uppercase;
}
html[dir="rtl"] .hero-kicker { letter-spacing: 0.06em; text-transform: none; font-family: 'Tajawal', sans-serif; font-size: 13px; }
.hero-overlay h1 {
  font-size: clamp(30px, 4.2vw, 54px); font-weight: 500; line-height: 1.15;
  margin-bottom: 14px; max-width: 900px;
}
.hero-overlay p {
  font-size: clamp(16px, 1.6vw, 19px); line-height: 1.75;
  color: rgba(255,255,255,0.88); max-width: 680px; margin-bottom: 0;
}
.production-section { padding: 90px 0; }
@media (max-width: 768px) { .production-section { padding: 56px 0; } }
.reveal { opacity: 0; transform: translateY(24px); transition: all .7s cubic-bezier(.25,.1,.1,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.r1 { transition-delay: .1s; } .r2 { transition-delay: .2s; } .r3 { transition-delay: .3s; }
`;

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>التصوير والإنتاج الإعلامي | Graphics House</title>
<meta name="description" content="تصوير احترافي، أفلام ترويجية، وتغطية فعاليات للمطورين العقاريين والعلامات التجارية في السعودية والخليج.">
<meta property="og:title" content="التصوير والإنتاج الإعلامي | Graphics House">
<meta property="og:description" content="إنتاج فني متكامل: تصوير، فيديو، ومحتوى بصري بجودة سينمائية.">
<meta property="og:image" content="https://3dgraphicshouse.com/assets/favicon/og-image.png">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="${P}assets/favicon/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${P}assets/favicon/favicon-16.png">
<link rel="apple-touch-icon" href="${P}assets/favicon/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0,0" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{gold:"#C9A84C"},borderRadius:{DEFAULT:"0px"}}}}</script>
<style>
${styleMatch[1]}
${extraStyles}
${EXTRA}
</style>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MKD9QVYNWF"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-MKD9QVYNWF');</script>
<link rel="stylesheet" href="${P}assets/site-header.css">
<script defer src="${P}assets/site-header.js"></script>
</head>
<body>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="${P}index-ar.html" class="logo">
      <img src="${P}assets/logo-gold.png" alt="Graphics House" style="height:86px;width:auto">
    </a>
  </div>
</header>

<div class="video-modal" id="videoModal">
  <button class="vm-close" onclick="closeVideo()">✕</button>
  <div class="vm-inner">
    <div class="vm-aspect"><div id="vmPlayer"></div></div>
  </div>
</div>

<!-- HERO -->
<section class="hero-sec">
  <div class="hero-inner">
    <div class="hero-image">
      <img src="${P}assets/photography/slide_image_12.png" alt="التصوير والإنتاج الإعلامي — Graphics House" loading="eager">
      <div class="hero-overlay reveal">
        <span class="hero-kicker">Photography &amp; Media Production</span>
        <h1>التصوير والإنتاج الإعلامي<br><span style="color:var(--gold)">بجودة سينمائية</span></h1>
        <p>نصنع محتوى بصرياً يبيع مشروعك — من جلسات التصوير الاحترافية إلى الأفلام الترويجية وتغطية الفعاليات، بفريق إنتاج يفهم السوق السعودي والخليجي.</p>
      </div>
    </div>
    <div class="hero-btns">
      <a href="#booking" class="btn-p">احجز جلسة تصوير <span class="material-symbols-outlined" style="font-size:16px">calendar_month</span></a>
      <a href="${P}portfolio.html" class="btn-o-light">استعرض أعمالنا <span class="material-symbols-outlined" style="font-size:16px">photo_library</span></a>
      <a href="https://wa.me/966502786513" target="_blank" rel="noopener" class="btn-o-light">تواصل واتساب <span class="material-symbols-outlined" style="font-size:16px">phone_in_talk</span></a>
    </div>
  </div>
</section>

<!-- SERVICES -->
<section class="production-section" style="background:#FAFAF8">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">خدمات الإنتاج</span>
      <h2 class="section-title">كل ما تحتاجه <span class="gold">لإنتاجك البصري</span></h2>
      <p class="section-sub" style="margin:0 auto">حلول متكاملة للتصوير والفيديو — من الفكرة إلى التسليم النهائي، بمعايير احترافية تناسب العقار والضيافة والعلامات التجارية.</p>
    </div>
    <div class="feature-grid reveal r1">
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">photo_camera</span></div>
        <h3>تصوير تجاري وعقاري</h3>
        <p>جلسات تصوير للمنتجات، المشاريع العقارية، الفنادق والمطاعم — بإضاءة واحترافية تعكس قيمة العلامة.</p>
      </div>
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">movie</span></div>
        <h3>أفلام ترويجية</h3>
        <p>فيديوهات سينمائية للحملات الإعلانية وإطلاق المشاريع — سرد بصري يجذب المستثمرين ويشجّع على الشراء.</p>
      </div>
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">event</span></div>
        <h3>تغطية فعاليات</h3>
        <p>تصوير وإنتاج فوري للمعارض، المؤتمرات، وافتتاح المشاريع — محتوى جاهز للنشر على المنصات.</p>
      </div>
      <div class="feature-card">
        <div class="icon"><span class="material-symbols-outlined">slideshow</span></div>
        <h3>عروض تقديمية</h3>
        <p>عروض بصرية احترافية لاجتماعات العملاء والمستثمرين — تصميم وتصوير وإخراج متكامل.</p>
      </div>
    </div>
  </div>
</section>

<!-- TRUST -->
<section class="cta-d reveal" style="background:#1A1A1A">
  <div class="cta-d-inner">
    <h2 style="color:#FAFAF8">أكثر من <span class="gold">15 سنة</span> في السوق السعودي</h2>
    <p style="color:rgba(255,255,255,0.6)">نفهم السوق المحلي ونساعدك توصل لجمهورك المستهدف بمحتوى بصري احترافي يبني الثقة ويُسرّع قرار الشراء.</p>
    <div class="btns">
      <a href="#booking" class="btn-p">اطلب عرض سعر <span class="material-symbols-outlined">request_quote</span></a>
    </div>
  </div>
</section>

<!-- PORTFOLIO SLIDER -->
<div class="slider-section reveal" style="padding:90px 0;background:#FAFAF8">
  <div class="slider-container" style="max-width:1320px;margin:0 auto;padding:0 48px;position:relative">
    <div style="text-align:center;margin-bottom:36px">
      <span class="section-label">أعمالنا</span>
      <h2 class="section-title">مشاريع <span class="gold">الإنتاج البصري</span></h2>
      <p class="section-sub" style="margin:0 auto">نماذج من أعمال التصوير والإنتاج الفني لعملائنا في العقار والضيافة والعلامات التجارية.</p>
    </div>
    <div style="position:relative;overflow:hidden;border-radius:4px" dir="ltr">
      <div class="slider-track" id="projectSlider" style="display:flex;transition:transform 0.7s cubic-bezier(0.25,0.1,0.1,1)">
        <div class="slider-item" style="flex:0 0 100%;width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;padding:10px 0"><img src="${P}assets/photography/slide_image_2.png" alt="مشروع تصوير" loading="lazy"></div>
        <div class="slider-item" style="flex:0 0 100%;width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;padding:10px 0"><img src="${P}assets/photography/slide_image_7.png" alt="مشروع تصوير" loading="lazy"></div>
        <div class="slider-item" style="flex:0 0 100%;width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;padding:10px 0"><img src="${P}assets/photography/slide_image_8.png" alt="مشروع تصوير" loading="lazy"></div>
        <div class="slider-item" style="flex:0 0 100%;width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;padding:10px 0"><img src="${P}assets/photography/slide_image_3.png" alt="مشروع تصوير" loading="lazy"></div>
        <div class="slider-item" style="flex:0 0 100%;width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;padding:10px 0"><img src="${P}assets/photography/slide_image_6.png" alt="مشروع تصوير" loading="lazy"></div>
        <div class="slider-item" style="flex:0 0 100%;width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;padding:10px 0"><img src="${P}assets/photography/slide_image_9.png" alt="مشروع تصوير" loading="lazy"></div>
      </div>
    </div>
    <button onclick="slideProject(-1)" style="position:absolute;top:55%;right:-6px;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.95);border:none;box-shadow:0 4px 20px rgba(0,0,0,0.12);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;color:var(--text-primary);transition:all 0.3s" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='rgba(255,255,255,0.95)'" aria-label="السابق">
      <span class="material-symbols-outlined" style="font-size:24px">chevron_left</span>
    </button>
    <button onclick="slideProject(1)" style="position:absolute;top:55%;left:-6px;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.95);border:none;box-shadow:0 4px 20px rgba(0,0,0,0.12);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;color:var(--text-primary);transition:all 0.3s" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='rgba(255,255,255,0.95)'" aria-label="التالي">
      <span class="material-symbols-outlined" style="font-size:24px">chevron_right</span>
    </button>
    <div style="display:flex;justify-content:center;gap:10px;margin-top:24px;direction:ltr" id="projectDots"></div>
    <div style="text-align:center;margin-top:28px">
      <a href="${P}portfolio.html" class="btn-o">شاهد جميع الأعمال <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span></a>
    </div>
  </div>
</div>

<!-- FEATURED SHOWCASE -->
<div class="slide-sec reveal" style="background:#d0d0d0;padding:48px 0">
  <div class="slide-sec-inner">
    <div style="text-align:center;margin-bottom:28px;padding:0 20px">
      <span class="section-label">إنتاج مميز</span>
      <h2 class="section-title" style="margin-bottom:8px">محتوى <span class="gold">يُبرز مشروعك</span></h2>
    </div>
    <img src="${P}assets/photography/slide_image_11.png" alt="مشروع إنتاج بصري" loading="lazy">
  </div>
</div>

<!-- PRESENTATIONS CTA -->
<section class="cta-d reveal" style="background:#FAFAF8">
  <div class="cta-d-inner">
    <h2>عروض تقديمية <span class="gold">تبهر عملاءك</span></h2>
    <p>نصمم عروضاً تقديمية احترافية تناسب اجتماعاتك مع العملاء والمستثمرين — تصوير، مونتاج، وإخراج بصري متكامل.</p>
    <div class="btns">
      <a href="#booking" class="btn-p">اطلب عرضاً <span class="material-symbols-outlined">slideshow</span></a>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="cta-d reveal" style="background:#1A1A1A">
  <div class="cta-d-inner">
    <h2 style="color:#FAFAF8">الآن دورك</h2>
    <p style="color:rgba(255,255,255,0.6)">املأ النموذج وسنتواصل معك خلال 24 ساعة لمناقشة احتياجك البصري وتقديم عرض سعر مناسب.</p>
    <div class="btns">
      <a href="#booking" class="btn-p">احجز جلسة تصوير <span class="material-symbols-outlined">calendar_month</span></a>
      <a href="https://wa.me/966502786513" target="_blank" rel="noopener" class="btn-o" style="border-color:rgba(255,255,255,0.25);color:#FAFAF8">واتساب <span class="material-symbols-outlined">chat</span></a>
    </div>
  </div>
</section>

<!-- RELATED SERVICES -->
<section class="production-section" style="background:#F5F4F0">
  <div style="max-width:1320px;margin:0 auto;padding:0 48px">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">خدمات إضافية</span>
      <h2 class="section-title">كل ما تحتاجه <span class="gold">لمشروعك</span> في مكان واحد</h2>
      <p class="section-sub" style="margin:0 auto">نقدم مجموعة متكاملة من الخدمات البصرية والتسويقية، اختر ما يناسب مشروعك.</p>
    </div>
    <div class="rel-grid reveal r1">
      <a href="rendering.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">landscape</span></div>
        <h4>الإظهار المعماري</h4>
        <p>صور ثري دي، كتالوجات عقارية، وهوية بصرية للمشاريع الكبرى.</p>
      </a>
      <a href="maquettes.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">view_in_ar</span></div>
        <h4>المجسمات الذكية</h4>
        <p>مجسمات معمارية هجينة بتقنيات الإضاءة التفاعلية والبيانات الحية.</p>
      </a>
      <a href="animation.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">movie</span></div>
        <h4>التحريك ثلاثي الأبعاد</h4>
        <p>جولات سينمائية CGI تُحيّي مشاريعك قبل البناء.</p>
      </a>
      <a href="interactive.html" class="rel-card">
        <div class="icon"><span class="material-symbols-outlined">touch_app</span></div>
        <h4>التجارب التفاعلية</h4>
        <p>شاشات تفاعلية، VR، وجولات افتراضية لصالات البيع.</p>
      </a>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="booking" class="contact-s">
  <div class="contact-inner">
    <div class="reveal" style="text-align:center;margin-bottom:48px">
      <span class="section-label">تواصل معنا</span>
      <h2 class="section-title">احجز جلسة <span class="gold">إنتاج</span></h2>
      <p class="section-sub" style="margin:0 auto">املأ النموذج وسنتواصل معك خلال 24 ساعة لمناقشة احتياجك البصري.</p>
    </div>
    <div class="contact-grid reveal r1">
      <div class="contact-info">
        <h3>لنصنع معاً محتواك البصري</h3>
        <p>سواء كنت تريد جلسة تصوير لمنتجاتك، تغطية فعالية، أو فيديو ترويجي — فريق الإنتاج جاهز لخدمتك.</p>
        <div class="contact-info-item"><span class="material-symbols-outlined">phone_in_talk</span> +966 50 278 6513</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">mail</span> dot4life.team@gmail.com</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">location_on</span> جدة، السعودية — مكاتبنا في 4 دول</div>
        <div class="contact-info-item"><span class="material-symbols-outlined">schedule</span> نرد خلال 24 ساعة عمل</div>
      </div>
      <div class="form-card">
        <h3>طلب جلسة تصوير / إنتاج</h3>
        <form action="https://formsubmit.co/dot4life.team@gmail.com" method="POST" target="_blank">
          <input type="hidden" name="_subject" value="طلب إنتاج إعلامي - services/production">
          <input type="hidden" name="_next" value="https://3dgraphicshouse.com/services/production.html#booking">
          <div class="form-group"><label>الاسم الكامل</label><input type="text" name="name" required placeholder="أدخل اسمك"></div>
          <div class="form-group"><label>رقم الجوال</label><input type="tel" name="phone" required placeholder="05xxxxxxxx"></div>
          <div class="form-group"><label>البريد الإلكتروني</label><input type="email" name="email" placeholder="example@domain.com"></div>
          <div class="form-group"><label>الخدمة المطلوبة</label>
            <select name="service" required>
              <option value="">اختر الخدمة</option>
              <option value="product-photography">تصوير منتجات</option>
              <option value="real-estate-photography">تصوير عقاري</option>
              <option value="event-coverage">تغطية فعاليات</option>
              <option value="promotional-video">فيديو ترويجي</option>
              <option value="commercial-shoot">تصوير تجاري</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          <div class="form-group"><label>المدينة</label>
            <select name="city">
              <option value="">اختر المدينة</option>
              <option value="riyadh">الرياض</option>
              <option value="jeddah">جدة</option>
              <option value="dammam">الدمام</option>
              <option value="mecca">مكة المكرمة</option>
              <option value="madinah">المدينة المنورة</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          <div class="form-group"><label>تفاصيل الطلب</label><textarea name="message" placeholder="حدثنا عن مشروعك، نوع التصوير، الموقع، الميزانية التقريبية..."></textarea></div>
          <button type="submit" class="form-submit">إرسال الطلب <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle">send</span></button>
        </form>
      </div>
    </div>
  </div>
</section>

<footer dir="rtl"><div style="padding:24px;text-align:center;font-size:12px;color:rgba(255,255,255,.3)">Graphics House</div></footer>

<div class="gh-float">
  <a href="https://wa.me/966502786513" target="_blank" rel="noopener" class="gh-float-btn gh-float-wa" aria-label="واتساب">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>
  <a href="mailto:info@3dgraphicshouse.com" class="gh-float-btn gh-float-mail" aria-label="بريد">
    <span class="material-symbols-outlined" style="font-size:22px">mail</span>
  </a>
</div>

<script>
var ro=new IntersectionObserver(function(e){
  e.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible')}});
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(function(el){ro.observe(el)});
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});
var projectIndex=0;
var projectItems=document.querySelectorAll('#projectSlider .slider-item');
var projectTotal=projectItems.length;
var projectTimer;
var dotsContainer=document.getElementById('projectDots');
if(dotsContainer){
  for(var i=0;i<projectTotal;i++){
    var d=document.createElement('button');
    d.className='project-dot';
    d.style.cssText='width:10px;height:10px;border-radius:50%;border:none;background:'+(i===0?'var(--gold)':'rgba(26,26,26,0.15)')+';cursor:pointer;transition:all 0.3s;padding:0';
    d.setAttribute('aria-label','مشروع '+(i+1));
    d.onclick=function(idx){return function(){goToProject(idx)}}(i);
    dotsContainer.appendChild(d);
  }
}
function goToProject(idx){
  projectIndex=idx;
  var track=document.getElementById('projectSlider');
  if(track){track.style.transform='translateX(-'+(projectIndex*100)+'%)'}
  document.querySelectorAll('.project-dot').forEach(function(d,i){
    d.style.background=(i===projectIndex?'var(--gold)':'rgba(26,26,26,0.15)');
  });
  resetProjectTimer();
}
function slideProject(dir){goToProject((projectIndex+dir+projectTotal)%projectTotal)}
function resetProjectTimer(){
  clearInterval(projectTimer);
  projectTimer=setInterval(function(){slideProject(1)},4000);
}
resetProjectTimer();
var sliderTrack=document.getElementById('projectSlider');
if(sliderTrack){
  sliderTrack.parentElement.addEventListener('mouseenter',function(){clearInterval(projectTimer)});
  sliderTrack.parentElement.addEventListener('mouseleave',function(){resetProjectTimer()});
}
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
</body>
</html>`;

const out = path.join(ROOT, 'services/production.html');
fs.writeFileSync(out, html, 'utf8');
console.log('Built services/production.html');

execSync('node scripts/sync-layout.mjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Synced header/footer');
