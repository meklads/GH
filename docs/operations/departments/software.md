# Software

## المسؤولية

كل ما **يُشحن** على الموقع والريpo: HTML، assets، Workers، build، QA scripts.

## مهام نموذجية

- تنفيذ Landing Pages (AR/EN)
- Insights pipeline (`scripts/build-insights.mjs`, JSON)
- Forms, `gh-form-proxy`, analytics events
- Tailwind/build, sitemap, hreflang
- إصلاحات، features، performance

## المدخلات

- تذكرة من Hermes/Marketing: copy، URLs، acceptance criteria
- UX section order (من Marketing/UX notes)

## المخرجات

- commits على `beestoon-live`
- `npm run build` ناجح
- QA: `npm run qa:nav`, `qa:analytics` عند اللزوم

## النماذج

- **التنفيذ:** Cursor (Composer / Agent) — ليس OpenRouter للHTML bulk
- **Kimi:** scan impact عبر Hermes قبل refactor كبير
- **Flash:** checklist بعد التنفيذ

## الأدوات

- **Cursor** (primary)
- GitHub, npm scripts, Cloudflare Workers (`workers/`)

## يمرّر إلى

- **Marketing** — copy QA على live
- **Verify** — same department: QA checklist

## OpenRouter

لا للكود الروتيني — Software = Cursor.

## مراجع تقنية

- `package.json` → `npm run build`
- `docs/ANALYTICS_SETUP.md`
- `.cursor/rules/` — قواعد هذا القسم
