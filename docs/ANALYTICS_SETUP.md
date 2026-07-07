# التحليلات — Google Analytics 4 و Search Console

> Graphics House · `3dgraphicshouse.com`  
> Measurement ID الحالي: **G-Y67JVE898Z**

---

## ما تم في الكود

| المكوّن | الملف | الوظيفة |
|---------|-------|---------|
| الإعداد | `assets/gh-analytics-config.js` | معرّف GA4 + تحقق GSC |
| التحميل | `assets/gh-analytics.js` | gtag.js موحّد لكل الصفحات |
| البناء | `scripts/analytics-snippet.mjs` | حقن تلقائي عبر `site-hardening` و `inject-float-widgets` |
| أحداث التحويل | `gh-newsletter.js`, `gh-lead-magnet.js`, `gh-float-widgets.js` | اشتراك، PDF، نموذج عائم |

### أحداث GA4 المخصّصة

| الحدث | متى يُطلق |
|-------|-----------|
| `newsletter_signup` | اشتراك ناجح في النشرة |
| `lead_magnet_download` | بوابة إيميل لـ PDF |
| `generate_lead` | نموذج الاستفسار العائم |

في GA4: **Admin → Events → Mark as conversion** للأحداث التي تهمك.

---

## 1) Google Analytics 4

### التحقق من التتبع

1. افتح [analytics.google.com](https://analytics.google.com) → خاصية Graphics House.
2. **Reports → Realtime** — افتح الموقع في تبويب آخر وتأكد من ظهور زيارة.
3. أو استخدم **Tag Assistant** (إضافة Chrome).

### ربط Search Console بـ GA4

1. GA4 → **Admin → Product links → Search Console links**.
2. اختر `3dgraphicshouse.com` بعد التحقق (الخطوة 2 أدناه).

---

## 2) Google Search Console

### أ) التحقق عبر Meta tag (موصى به)

1. [search.google.com/search-console](https://search.google.com/search-console) → **Add property** → `https://3dgraphicshouse.com`.
2. اختر **HTML tag** وانسخ قيمة `content=` فقط (مثال: `abc123XYZ...`).
3. الصقها عبر الأمر:

```bash
npm run gsc:apply -- abc123XYZ...
```

أو عدّل `assets/gh-analytics-config.js` يدوياً:

```js
googleSiteVerification: 'abc123XYZ...'
```

4. `npm run build` ثم نشر الموقع (Coolify Redeploy + Purge Cache في Cloudflare).
5. ارجع لـ GSC واضغط **Verify**.
6. تحقق محلياً: `npm run qa:analytics`

### ب) التحقق عبر DNS (بديل)

في Cloudflare → DNS → TXT:

- Name: `@`
- Content: قيمة التحقق من GSC

لا حاجة لتعديل الكود.

### إرسال Sitemap

بعد التحقق:

1. GSC → **Sitemaps** → أضف: `https://3dgraphicshouse.com/sitemap.xml`
2. الملف يُحدَّث تلقائياً عند `npm run build` (`scripts/site-hardening.mjs`).

---

## 3) بعد النشر

| الخطوة | أين |
|--------|-----|
| Redeploy | Coolify |
| مسح الكاش | Cloudflare → Caching → Purge Everything |
| Realtime | GA4 |
| Coverage / Pages | GSC (قد يستغرق أياماً) |

---

## 4) اختياري لاحقاً

- **Google Tag Manager** — إذا احتجت pixels متعددة (Meta, LinkedIn) دون تعديل HTML.
- **Consent mode** — إذا أضفت banner موافقة GDPR/قانوني.
- **Looker Studio** — لوحة تجمع GA4 + GSC + Brevo.

---

## تغيير معرّف GA4

عدّل `ga4MeasurementId` في `gh-analytics-config.js` فقط، ثم `npm run build`.
