# جدول التوجيه — مهمة → قسم → نموذج → Cursor؟

| نوع المهمة | Lead | مساعد | نموذج (typical) | Cursor |
|------------|------|--------|-----------------|--------|
| لخص ملف / PDF | Research | — | Kimi → Flash | لا |
| منافسون / سوق KSA | Research | Marketing | Pro → Claude (صفحة واحدة) | لا |
| هيكل Landing Page | Marketing | Research | Pro | لا |
| copy LP AR/EN نهائي | Marketing | — | Claude | بعد الموافقة |
| تنفيذ LP على الموقع | Software | Marketing | — | **نعم** |
| مقال SEO / Insights | Marketing | Research | Pro → Claude | **نعم** (build) |
| meta / schema / links | Marketing | Software | Flash / Pro | أحياناً |
| منشور LinkedIn / IG | Marketing | Creative | Flash → Claude | لا |
| نص إعلان Meta/LinkedIn | Marketing | — | Pro → Claude | لا |
| script فيdeo 30–60ث | Creative | Marketing | Pro → Claude | لا |
| brief تصميم / deck | Creative | Marketing | Claude | لا |
| إصلاح bug / form / Worker | Software | — | — | **نعم** |
| refactor / feature موقع | Software | Marketing? | Kimi (scan) → Cursor | **نعم** |
| `npm run build` / deploy QA | Software | — | Flash checklist | **نعم** |
| ربط WhatsApp / CRM / n8n | Automation | Software | Pro → Cursor | **نعم** |
| Webhook / gh-form-proxy | Automation | Software | Pro | **نعم** |
| رد عميل (مسودة) | Marketing | Automation | Claude / Flash | لا |
| قالب follow-up CRM | Automation | Marketing | Pro | أحياناً |

## تسلسل شائع: Landing Page

```
Marketing (Pro: outline)
  → Marketing (Claude: copy + SEO)
  → [موافقة المستخدم]
  → Software (Cursor: HTML, forms, analytics, build)
  → Marketing (Flash: QA copy على live)
```

## تسلسل شائع: منشور + إعلان

```
Creative (Flash: زاوية + visual من أصول المشروع)
  → Marketing (Claude: نص نهائي)
  → (CapCut يدوي للفيديو)
```

## تسلسل شائع: أتمتة lead

```
Automation (Pro: flow)
  → Software (Cursor: Worker/API)
  → Automation (Flash: runbook)
```
