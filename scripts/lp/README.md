# LP generators (Graphics House)

The campaign pages in `lp/` are generated from these scripts. Edit copy here, then regenerate. Never run the full `npm run build`.

```bash
python3 scripts/lp/gen_production.py lp     # lp/production.html, production-en.html, thanks.html, thanks-en.html, assets/lp/icons/*.svg
python3 scripts/lp/gen_exhibitions.py lp    # lp/exhibitions.html, exhibitions-en.html, thanks-exhibitions*.html
```

Requires `ffprobe` (image sizes). The icon set lives in `icons_lp.py` (12 thin gold line icons, also written to `assets/lp/icons/`).

## Illustrative images (production page)
Generated images go in `assets/projects/illustrative/` with these names (`.webp`, `.jpg` or `.png`). A slot appears only when its file exists, always with the visible label «تصور توضيحي» / "Illustrative". Never in the work section.

| File | Section |
|---|---|
| `01-sales-gallery` | Problem |
| `02-led-screen` | Offer (below the card) |
| `03-storyboard` | Steps |
| `04-life-after-build` | Comparison (the result) |
| `05-edit-suite` | Steps (one team) |
| `06-masterplan-night` | Offer, "best for" box (audience) |
| `07-ornament` | Form background (no label) |

After adding files, run the production generator and commit the regenerated pages.
