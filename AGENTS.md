# Hermes — Graphics House (beestoon-live)

This repo is **Software** execution for [Graphics House](https://3dgraphicshouse.com).

## Operations (departments, routing, models)

Read `docs/operations/README.md` first.

- Routing: `docs/operations/routing-table.md`
- Models / budget: `docs/operations/model-policy.md`
- Global Hermes persona: `docs/operations/gh-system-prompt.txt` (also `~/.hermes/SOUL.md`)

## Software rules

- Implement HTML/LP/build/Workers in **Cursor**; do not dump long HTML in chat.
- Match AR/EN patterns.
- **Do not run the full `npm run build` locally.** The committed HTML has hand-applied layers the pipeline does not reproduce; a full build rewrites ~340 pages and regresses the live site. It is blocked unless `GH_FULL_BUILD=1` (CI runs it as a smoke test only).
- Insights articles: edit `insights/data/articles/<slug>.json`, then `npm run article -- <slug>` (renders one article, splices it into the committed page, updates hub card, sitemap lastmod and OG images). Set `"editorialLock": true` on hand-written articles so `patch-article-viral-content.mjs` never overwrites them.
- See `.cursor/rules/gh-software-department.mdc`

## Company focus

Architectural scale models, archviz, CGI, interactive, KSA/GCC B2B developers.
