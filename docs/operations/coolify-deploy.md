# Coolify / Docker deploy notes (Graphics House)

## Deploy model (2026-08-28)

Coolify serves **pre-built static HTML** already committed to `main`.

The Dockerfile is nginx-only (no `npm run build` in the image). Run builds locally or in CI before push:

```bash
CI=true npm run build
git add -A && git commit && git push origin main
```

This avoids OOM/timeouts on Coolify hosts running Docker 29 + BuildKit.

## Menu icons showing as text (`expand_more`)

Pages must load Material Symbols CSS. `scripts/sync-layout.mjs` injects it when missing. After fixing headers, re-run `npm run sync`.

## If Coolify still fails on Docker 29 + BuildKit

Errors like `network mode "coolify" not supported by buildkit` are a Coolify host issue. Upgrade Coolify (includes [PR #9811](https://github.com/coollabsio/coolify/pull/9811)) or use Docker Engine 28.x.

## Redeploy

Trigger a fresh deploy of latest `main`. Prefer **Rebuild without cache** once after the Dockerfile change.
