# Deploy checklist (Coolify + Cloudflare)

After every push to `main`, production updates require **both** steps below unless GitHub secrets are configured.

## 1. Coolify redeploy

1. Open Coolify → application for `3dgraphicshouse.com`
2. **Redeploy** / **Deploy** (pull latest `main`)
3. Confirm build exit code **0**

## 2. Cloudflare purge

1. [dash.cloudflare.com](https://dash.cloudflare.com) → `3dgraphicshouse.com`
2. **Caching** → **Configuration** → **Purge Everything**
3. Hard refresh on mobile (private window)

## 3. Verify live

```bash
npm run verify:live
```

Expect:

- `gh-performance.js?v=10` (or current version in `sync-layout.mjs`)
- `gh-site-enhancements.css?v=` (current cache version)
- `gh-cta-track.js?v=1`

## Optional: auto-deploy (GitHub Secrets)

| Secret | Purpose |
|--------|---------|
| `COOLIFY_DEPLOY_WEBHOOK` | POST on push → Coolify rebuild |
| `CLOUDFLARE_ZONE_ID` | Zone ID from Cloudflare Overview |
| `CLOUDFLARE_API_TOKEN` | Token with **Cache Purge** permission |

Workflow: `.github/workflows/deploy.yml`

## Staging (recommended)

Add a second Coolify app (e.g. `staging.3dgraphicshouse.com`) on branch `staging` for QA before purging production cache.
