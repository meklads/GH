# Coolify / Docker deploy notes (Graphics House)

## Root cause fixed in repo (2026-08-28)

Debian **bookworm has no package `fonts-noto-arabic`**.  
Older Dockerfile `apt-get install … fonts-noto-arabic` made the builder stage exit **1** on Coolify.

Fix: use `fonts-noto-core` (+ `fonts-dejavu-core`). Arabic coverage is in Noto Core.

## If deploy still fails on Docker 29 + BuildKit

Coolify logs like:

```text
Docker 29.x with BuildKit and Buildx detected
Deployment failed … bash /artifacts/build.sh
network mode "coolify" not supported by buildkit
```

are a **Coolify host bug**, not an app bug. Upgrade Coolify to a release that includes [PR #9811](https://github.com/coollabsio/coolify/pull/9811) (`--network host` for Dockerfile builds), or temporarily use Docker Engine 28.x on the server.

## Redeploy

After pulling latest `main`, trigger a fresh Coolify deployment (do not reuse a failed build cache for the old apt layer if possible — “Rebuild without cache”).
