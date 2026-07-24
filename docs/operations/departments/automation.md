# Automation

## المسؤولية

تقليل العمل اليدوي المتكرر: WhatsApp، CRM، webhooks، n8n — **بعد** stabilizing النص/العملية.

## مهام نموذجية

- تصميم flow: form → notify → CRM stage
- Workers (`gh-form-proxy`, subscribe API)
- n8n scenarios (lead routing, reminders)
- runbooks و kill switches

## المدخلات

- process موثّق (حتى brief من Marketing)
- APIs keys — **secrets فقط** في Wrangler/env، لا Git

## المخرجات

- diagram flow (Pro)
- spec للـ Software
- runbook (Flash)
- كود في Cursor (Software/Automation)

## النماذج

- Pro — design flow, edge cases
- Flash — runbooks, template variables
- Claude — فقط إن policy نص حساس للعملاء

## الأدوات

- Cursor + Workers
- n8n (self-host or cloud)
- CRM (حسب ما تستخدم)
- WhatsApp Business API

## قاعدة

**لا automation client-facing ON** حتى موافقة صريحة + shadow mode.

## يمرّر إلى

- **Software** — كل production code
- **Marketing** — message templates
- **Research** — rarely, integration docs

## Cursor

نعم — Implementation بعد spec.
