# Marketing services moved to Bees Motion (2026-10-29)

Decision: Graphics House focuses on visual production (CGI, maquettes, interactive, galleries, identity).
Marketing and lead generation (Pre-Launch / Launch / Growth Launch) live at Bees Motion → https://beesmotion.com/propmotion/
Bundled offers (Packages page, tenders where Graphics House is the registered vendor) still name Bees Motion as the marketing partner.

## What changed
- Mega menu + footer (partials and all pages): GrowthLaunch™ card replaced by "PropMotion™ · Bees Motion" (external link); BrandScale™ subtitle is now "Brand Identity & Visual System".
- `solutions/growth-launch(-en).html`, `services/digital-marketing(-en).html`, `marketing.html`: redirect stubs (noindex) + nginx 301s to Bees Motion. Removed from sitemap.
- In-page links/labels to GrowthLaunch™ and digital-marketing now point to Bees Motion PropMotion™.
- Solution finder: marketing result points to Bees Motion; fixed broken `../solutions/` links (now `../../solutions/`).
- Chat assistant knowledge (`assets/gh-chat-knowledge-data.js`, KB v5) updated.
- Web solutions: campaign landing pages / CRM routing reference Bees Motion; project websites stay at Graphics House.

## Before the next `npm run build`
These generators still contain GrowthLaunch™ and will re-create it if run unchanged:
`scripts/build-project-launch-page.mjs`, `scripts/build-solution-pages.mjs`, `scripts/build-enhanced-service-ar-stubs.mjs`,
`scripts/upgrade-header-nav.mjs`, `scripts/update-mega-menu.mjs`, `scripts/build-location-pages.mjs`, `scripts/build-insights.mjs`,
`scripts/seo-overrides.json`, `scripts/seo-blocks/*`, `scripts/verify-live-deploy.mjs`.
Note: `npm run sync` is also out of date vs. committed HTML (it downgrades header CSS/JS versions and rewrites language-switch links) — fix before using.

## Go-live
Merge together with opening beesmotion.com (preview gate off); otherwise these links land on the Bees Motion access-code page.
