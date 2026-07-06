#!/usr/bin/env node
/**
 * Build lead-magnet download gates + printable checklist files
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'insights/downloads');
const FILES = path.join(OUT, 'files');

const CHECKLIST_AR = [
  'تحديد تموضع المشروع وشخصية المشتري المستهدف',
  'مواءمة جدول المبيعات مع خطة الإنتاج البصري',
  'اعتماد المخطط الرئيسي والزوايا الأساسية للإظهار',
  'جاهزية دليل الهوية أو التوجيه البصري',
  'تخطيط صور البطل (hero) لحملة الإطلاق',
  'وضوح متطلبات صالة البيع أو المنصة الرقمية',
  'تحديد نطاق الفيديو / الفيلم السينمائي (المدة، اللغة، القنوات)',
  'تحديد نطاق التجربة التفاعلية (إن وُجدت)',
  'قرار المجسم الفيزيائي أو النموذج الذكي',
  'مسار اعتماد المحتوى مع أصحاب المصلحة',
  'مشاركة قائمة الإطلاق مع فريق المبيعات',
  'خطة تحديث الأصول بعد الإطلاق',
];

const CHECKLIST_EN = [
  'Project positioning and target buyer persona defined',
  'Sales timeline aligned with visual production schedule',
  'Master plan and key views approved for visualization',
  'Brand guidelines or visual direction document ready',
  'Hero renders planned for launch campaign',
  'Sales gallery or digital platform requirements clear',
  'Video / CGI film scope defined (length, language, channels)',
  'Interactive experience scope defined (if applicable)',
  'Maquette or physical model decision made',
  'Content approval workflow with stakeholders',
  'Launch checklist shared with sales team',
  'Post-launch asset update plan in place',
];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extract(html, pattern) {
  const m = html.match(pattern);
  return m ? m[1] : '';
}

function getLayout(lang) {
  const file = lang === 'en' ? 'index.html' : 'index-ar.html';
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const header = extract(html, /(<header class="header" id="header">[\s\S]*?<\/header>)/);
  const footer = extract(
    html,
    lang === 'en'
      ? /(<footer dir="ltr"[\s\S]*?<\/footer>)/
      : /(<footer dir="rtl"[\s\S]*?<\/footer>)/
  );
  return { header, footer };
}

function lightFooter(lang, depth) {
  const isEn = lang === 'en';
  const p = depth > 0 ? '../'.repeat(depth) : '';
  const dir = isEn ? 'ltr' : 'rtl';
  const year = new Date().getFullYear();
  const contact = `${p}contact-us${isEn ? '-en' : ''}.html`;
  const portfolio = `${p}portfolio${isEn ? '-en' : ''}.html`;
  const insights = `${p}insights/${isEn ? 'index-en' : 'index'}.html`;
  const jeddah = `${p}locations/jeddah${isEn ? '-en' : ''}.html`;
  const riyadh = `${p}locations/riyadh${isEn ? '-en' : ''}.html`;

  return `<footer class="gh-loc-footer" dir="${dir}">
  <div class="gh-loc-footer-inner">
    <img src="${p}assets/logo-gold.png" alt="Graphics House" class="gh-loc-footer-logo" loading="lazy">
    <nav class="gh-loc-footer-nav" aria-label="${isEn ? 'Footer navigation' : 'روابط التذييل'}">
      <a href="${insights}">Insights</a>
      <a href="${contact}">${isEn ? 'Contact' : 'تواصل معنا'}</a>
      <a href="${portfolio}">${isEn ? 'Portfolio' : 'معرض الأعمال'}</a>
      <a href="${jeddah}">${isEn ? 'Jeddah' : 'جدة'}</a>
      <a href="${riyadh}">${isEn ? 'Riyadh' : 'الرياض'}</a>
    </nav>
    <p class="gh-loc-footer-contact"><a href="tel:+966502786513">+966 50 278 6513</a> · <a href="mailto:info@3dgraphicshouse.com">info@3dgraphicshouse.com</a></p>
    <p class="gh-loc-footer-copy">© ${year} Graphics House. ${isEn ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}</p>
  </div>
</footer>`;
}

function prefixPaths(html, depth) {
  const p = depth > 0 ? '../'.repeat(depth) : '';
  return html
    .replace(/src="assets\//g, `src="${p}assets/`)
    .replace(/href="(?!https?:|\/|#|mailto:|tel:)([^"]*)"/g, `href="${p}$1"`);
}

function buildPrintFile(lang) {
  const isEn = lang === 'en';
  const items = isEn ? CHECKLIST_EN : CHECKLIST_AR;
  const listHtml = items.map((t, i) => `<li><span class="num">${i + 1}</span><span>${esc(t)}</span></li>`).join('\n');

  const html = `<!DOCTYPE html>
<html dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<meta charset="UTF-8">
<title>${isEn ? 'Visual Launch Readiness Checklist' : 'قائمة جاهزية الإطلاق البصري'} | Graphics House</title>
<style>
@page { margin: 18mm 16mm; size: A4; }
* { box-sizing: border-box; }
body {
  font-family: ${isEn ? 'Inter, Helvetica, Arial, sans-serif' : 'Tajawal, Arial, sans-serif'};
  color: #1a1a1a;
  margin: 0;
  padding: 24px;
  line-height: 1.5;
}
.header {
  border-bottom: 2px solid #c9a84c;
  padding-bottom: 16px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}
.brand { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #a8883a; }
h1 { font-size: 22px; margin: 8px 0 0; line-height: 1.25; }
.intro { font-size: 13px; color: #555; margin: 0 0 20px; max-width: 520px; }
ol { list-style: none; margin: 0; padding: 0; }
li {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  align-items: flex-start;
}
.num {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #c9a84c;
  color: #0a0a0a;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer {
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
  font-size: 11px;
  color: #888;
}
.print-btn {
  position: fixed;
  top: 16px;
  ${isEn ? 'right' : 'left'}: 16px;
  background: #c9a84c;
  color: #0a0a0a;
  border: none;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
}
@media print { .print-btn { display: none; } }
</style>
</head>
<body>
<button type="button" class="print-btn" onclick="window.print()">${isEn ? 'Save as PDF / Print' : 'حفظ PDF / طباعة'}</button>
<div class="header">
  <div>
    <div class="brand">Graphics House</div>
    <h1>${isEn ? 'Visual Launch Readiness Checklist' : 'قائمة جاهزية الإطلاق البصري'}</h1>
  </div>
  <div style="font-size:11px;color:#888;text-align:${isEn ? 'right' : 'left'}">3dgraphicshouse.com</div>
</div>
<p class="intro">${isEn
    ? '12 essentials to verify before announcing off-plan sales. Use with your marketing, sales, and visualization partners.'
    : '12 بنداً للتحقق قبل إعلان مبيعات المخطط. استخدمها مع التسويق والمبيعات وشريك الإظهار المعماري.'}</p>
<ol>${listHtml}</ol>
<div class="footer">
  © Graphics House · ${isEn ? 'Jeddah HQ' : 'المقر الرئيسي جدة'} · ${isEn ? 'Book a session:' : 'احجز جلسة:'} 3dgraphicshouse.com/contact-us${isEn ? '-en' : ''}.html
</div>
</body>
</html>`;

  const name = `visual-launch-checklist${isEn ? '-en' : '-ar'}.html`;
  fs.writeFileSync(path.join(FILES, name), html, 'utf8');
  console.log('  print file:', name);
  return `files/${name}`;
}

function buildGatePage(lang, downloadPath) {
  const isEn = lang === 'en';
  const { header } = getLayout(lang);
  const depth = 2;
  const p = '../../';
  const outName = `visual-launch-checklist${isEn ? '-en' : ''}.html`;

  const html = `<!DOCTYPE html>
<html class="scroll-smooth" dir="${isEn ? 'ltr' : 'rtl'}" lang="${isEn ? 'en' : 'ar'}">
<head>
<script src="${p}assets/gh-forms-config.js"></script>
<script src="${p}assets/quote-form-config.js"></script>
<link rel="canonical" href="https://3dgraphicshouse.com/insights/downloads/${outName}">
<link rel="alternate" hreflang="en" href="https://3dgraphicshouse.com/insights/downloads/visual-launch-checklist-en.html">
<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/insights/downloads/visual-launch-checklist.html">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${isEn ? 'Free Visual Launch Checklist PDF' : 'تحميل قائمة الإطلاق البصري مجاناً'} | Graphics House</title>
<meta name="description" content="${isEn
    ? 'Download the free 12-point Visual Launch Readiness Checklist for real estate developers — PDF by Graphics House.'
    : 'حمّل مجاناً قائمة جاهزية الإطلاق البصري — 12 بنداً للمطورين العقاريين من جرافيكس هاوس.'}"/>
<link rel="icon" type="image/png" sizes="32x32" href="${p}assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}assets/site-header.css?v=12">
<link rel="stylesheet" href="${p}assets/gh-site-enhancements.css?v=9">
<link rel="stylesheet" href="${p}assets/gh-insights.css?v=13">
<link rel="stylesheet" href="${p}assets/gh-float-widgets.css?v=2">
<script defer src="${p}assets/site-header.js?v=7"></script>
<script defer src="${p}assets/lang-switch.js?v=3"></script>
<style>
body.gh-insights{min-height:100vh;display:flex;flex-direction:column;background:#f7f5f0}
.gh-lead-page{flex:1;padding:120px 24px 80px;max-width:560px;margin:0 auto;width:100%}
.gh-lead-card{background:#ffffff;border:1px solid #e8e4dc;box-shadow:0 16px 40px rgba(0,0,0,0.06);padding:40px 36px}
.gh-lead-card h1{font-family:"Playfair Display","Tajawal",serif;font-size:1.75rem;margin:0 0 12px;line-height:1.25;color:#0a0a0a}
.gh-lead-card .lead{font-size:16px;color:#555555;line-height:1.7;margin:0 0 24px}
.gh-lead-form input[type=email]{width:100%;padding:12px 14px;border:1px solid #ddd8ce;border-radius:4px;font-size:15px;margin-bottom:10px;background:#fff;color:#1a1a1a}
.gh-lead-form button{width:100%;padding:14px;background:#c9a84c;color:#0a0a0a;border:none;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-radius:4px}
.gh-lead-form button:hover{background:#d9b860}
.gh-lead-form .gh-turnstile{margin:12px 0;display:flex;justify-content:center;overflow:hidden}
.gh-lead-msg{font-size:13px;margin-top:10px}
.gh-lead-msg.ok{color:#2d7a2d}.gh-lead-msg.err{color:#c44}
.gh-lead-unlock{text-align:center;padding:20px 0}
.gh-lead-unlock .material-symbols-outlined{font-size:48px;color:#2d7a2d;margin-bottom:12px}
.gh-lead-features{margin:20px 0 0;padding:0;list-style:none;font-size:14px;color:#666666}
.gh-lead-features li{padding:6px 0;border-bottom:1px solid #e8e4dc}
.gh-lead-features li::before{content:"✓ ";color:#c9a84c;font-weight:700}
</style>
</head>
<body class="gh-insights">
${prefixPaths(header, depth)}
<main class="gh-lead-page">
  <a href="../${isEn ? 'index-en' : 'index'}.html" style="font-size:12px;color:#888888;text-decoration:none;display:inline-flex;align-items:center;gap:4px;margin-bottom:20px">
    <span class="material-symbols-outlined" style="font-size:16px">${isEn ? 'arrow_back' : 'arrow_forward'}</span>
    ${isEn ? 'Back to Insights' : 'العودة إلى Insights'}
  </a>
  <div class="gh-lead-card">
    <div id="ghLeadGate">
      <h1>${isEn ? 'Visual Launch Readiness Checklist' : 'قائمة جاهزية الإطلاق البصري'}</h1>
      <p class="lead">${isEn
    ? 'Free PDF — 12 essentials every developer should verify before announcing off-plan sales. Enter your email to download.'
    : 'PDF مجاني — 12 بنداً يجب على كل مطوّر التحقق منها قبل إعلان مبيعات المخطط. أدخل بريدك للتحميل.'}</p>
      <ul class="gh-lead-features">
        <li>${isEn ? '12 actionable checkpoints' : '12 بنداً عملياً قابلاً للتطبيق'}</li>
        <li>${isEn ? 'Aligned with GCC off-plan launches' : 'متوافق مع إطلاقات المخطط في الخليج'}</li>
        <li>${isEn ? 'Share with sales & marketing teams' : 'قابل للمشاركة مع فريق المبيعات والتسويق'}</li>
      </ul>
      <form class="gh-lead-form" data-gh-lead-magnet data-download="${downloadPath}" novalidate style="margin-top:24px">
        <input type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
        <input type="email" name="email" placeholder="${isEn ? 'Work email address' : 'البريد الإلكتروني'}" required autocomplete="email">
        <button type="submit">${isEn ? 'Download Free PDF' : 'تحميل PDF مجاناً'}</button>
        <div class="gh-turnstile"></div>
        <div class="gh-lead-msg" role="status"></div>
      </form>
    </div>
    <div id="ghLeadUnlock" class="gh-lead-unlock" hidden>
      <span class="material-symbols-outlined">check_circle</span>
      <h2 style="font-size:1.25rem;margin:0 0 8px">${isEn ? 'Your checklist is ready' : 'قائمتك جاهزة'}</h2>
      <p style="color:#666;font-size:15px;margin:0 0 20px">${isEn
    ? 'Open the file and use Print → Save as PDF, or print for your team.'
    : 'افتح الملف واستخدم طباعة ← حفظ كـ PDF، أو اطبعها لفريقك.'}</p>
      <a id="ghDownloadLink" href="${downloadPath}" target="_blank" rel="noopener" class="gh-btn-editorial" style="display:inline-flex">${isEn ? 'Open Checklist' : 'فتح القائمة'}</a>
    </div>
  </div>
</main>
${lightFooter(lang, depth)}
<script defer src="${p}assets/gh-lead-magnet.js?v=1"></script>
<script defer src="${p}assets/gh-float-widgets.js?v=1"></script>
</body></html>`;

  fs.writeFileSync(path.join(OUT, outName), html, 'utf8');
  console.log('  gate:', outName);
}

function updateSitemap() {
  const smPath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(smPath)) return;
  let xml = fs.readFileSync(smPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    'https://3dgraphicshouse.com/insights/downloads/visual-launch-checklist.html',
    'https://3dgraphicshouse.com/insights/downloads/visual-launch-checklist-en.html',
  ];
  for (const loc of urls) {
    if (xml.includes(loc)) continue;
    xml = xml.replace(
      '</urlset>',
      `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>0.78</priority></url>\n</urlset>`
    );
  }
  fs.writeFileSync(smPath, xml, 'utf8');
}

console.log('Building lead magnets…');
fs.mkdirSync(FILES, { recursive: true });
const arFile = buildPrintFile('ar');
const enFile = buildPrintFile('en');
buildGatePage('ar', arFile);
buildGatePage('en', enFile);
updateSitemap();
console.log('Done.');
