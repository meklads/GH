# GA4 conversions — Graphics House

Events are sent via `assets/gh-analytics.js` (`window.ghTrack`).

## Mark as conversions (GA4 Admin)

1. Open [GA4](https://analytics.google.com/) → property `G-Y67JVE898Z`
2. **Admin → Events** — wait 24–48h after deploy for custom events to appear
3. Toggle **Mark as conversion** for:

| Event | Source | Notes |
|-------|--------|-------|
| `generate_lead` | Float popup, quote form, ProjectLaunch form | Primary lead |
| `form_submit` | All wired forms | Funnel step |
| `cta_click` | `[data-cta]` buttons | Solution CTAs |
| `solution_view` | Solutions pages | Intent |
| `solution_finder_complete` | Solution finder tool | Qualified intent |
| `launch_checklist_complete` | Launch checklist | Engagement |
| `video_play` | Tap-to-play videos | Content engagement |
| `whatsapp_click` | WhatsApp links | Off-site lead |
| `roi_calculator_view` | GrowthLaunch ROI tool | High intent |
| `newsletter_signup` | Insights newsletter | Nurture |
| `lead_magnet_download` | Download gates | Nurture |

## Search Console

```bash
npm run gsc:apply -- YOUR_VERIFICATION_TOKEN
npm run build
```

Then verify ownership in [Google Search Console](https://search.google.com/search-console).

## Deploy secrets (GitHub)

Repository **Settings → Secrets → Actions**:

- `COOLIFY_DEPLOY_WEBHOOK` — auto redeploy on push to `main`
- `CLOUDFLARE_ZONE_ID` + `CLOUDFLARE_API_TOKEN` — cache purge after deploy

See also `docs/operations/deploy-checklist.md`.
