# Campaign landing-page generator
Content lives in one file per page (rendering.py, production.py); layout in core.py.
Run from anywhere: `python3 scripts/lpgen/production.py` writes lp/production.html and lp/production-en.html.
Styles and behaviour: lp/lp.css and lp/lp.js. Pages are noindex and stay out of sitemap.xml.
