# LP generators (Graphics House)

The campaign pages in `lp/` are generated from these scripts. Edit copy here, then regenerate. Never run the full `npm run build`.

```bash
python3 scripts/lp/gen_production.py lp     # lp/production.html, production-en.html, thanks.html, thanks-en.html, assets/lp/icons/*.svg
python3 scripts/lp/gen_exhibitions.py lp    # lp/exhibitions.html, exhibitions-en.html, thanks-exhibitions*.html
```

Requires `ffprobe` (image sizes). The icon set lives in `icons_lp.py` (12 thin gold line icons, also written to `assets/lp/icons/`).

## Illustrative images (production page, v3 direction 2026-11-17)
Only two generated images, both realistic daylight, each with the visible label «تصور توضيحي» / "Illustrative". None in the launch service, work or case studies.

| File (in `assets/projects/illustrative/`) | Section |
|---|---|
| `01-sales-gallery-v3.webp` | Problem |
| `04-life-after-build-v3.webp` | Closing form section |

A slot appears only when its file exists. The older files there (`01`–`07` without `-v3`) are the superseded first set and are not used. The form section uses a CSS Islamic geometric pattern instead of a generated ornament.

After adding files, run the production generator and commit the regenerated pages.
