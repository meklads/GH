"""Shared parts of the landing page system (owner decision 2026-11-18).

Reference for fonts, sizes, layout and dimensions: beesmotion.com/lp/property-content-engine.
Every GH campaign page uses lp/system.css (+ lp/system.js). Only the brand (logo, name) changes per site.
"""
import os, subprocess
from urllib.parse import quote

WA = "966502786513"
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700'
         '&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n')
CSS = '<link rel="stylesheet" href="system.css?v=1">\n'
SYS_JS = '<script defer src="system.js?v=1"></script>\n'
LOGO_DARK = '<img src="../assets/logo-gold.png" alt="Graphics House" width="732" height="344">'
WA_PATH = ("M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z")
SYM = f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wa" viewBox="0 0 24 24"><path d="{WA_PATH}"/></symbol></svg>\n'
WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><use href="#i-wa"/></svg>'
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
CHECK = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'


def wa(t):
    return f"https://wa.me/{WA}?text={quote(t)}"


def dims(out, rel):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", os.path.join(out, rel)],
                       capture_output=True, text=True).stdout.strip()
    return r.split("x")[:2]


def header(ar, self_href, other_href, cta):
    lang = (f'<nav class="lang" aria-label="Language"><span aria-current="true">AR</span><a href="{other_href}" hreflang="en" lang="en">EN</a></nav>' if ar else
            f'<nav class="lang" aria-label="Language"><a href="{other_href}" hreflang="ar" lang="ar">AR</a><span aria-current="true">EN</span></nav>')
    skip = "تخطَّ إلى المحتوى" if ar else "Skip to content"
    return (f'<a class="skip" href="#main">{skip}</a>\n<header class="hdr"><div class="wrap"><span class="logo">{LOGO_DARK}</span>'
            f'<div class="hdr-r">{lang}<a class="btn btn-gold" href="#request" data-cta="header">{cta}</a></div></div></header>\n')


# Related services: three cards at the end of each GH page, GH pages only (one brand per page).
RELATED = {
    "production": dict(ar=("فيلم الإطلاق وCGI", "فيلم إطلاق ولقطات CGI لمشروعك قبل اكتماله، تعرضه على المشترين والمستثمرين.", "production.html"),
                       en=("Launch film and CGI", "A launch film and CGI shots of your project before it is complete, for buyers and investors.", "production-en.html"),
                       img="../assets/lp-v3/naseem-aerial-1200.webp",
                       alt=("نسيم الحرم، الراجحي · مكة المكرمة", "Naseem Al Haram, Al Rajhi · Makkah")),
    "exhibitions": dict(ar=("تجربة المعرض الذكية", "مجسم ذكي وشاشات تفاعلية وحائط صور تذكارية، من الهوية والتصميم إلى التنفيذ.", "exhibitions.html"),
                        en=("Smart exhibition experience", "A smart maquette, interactive screens and a photo wall, from identity and design to delivery.", "exhibitions-en.html"),
                        img="../assets/lp-exh-v2/mwl-maquette2-1200.webp",
                        alt=("المجسم الذكي للملتقى الرمضاني لرابطة العالم الإسلامي", "The smart maquette for the Muslim World League Ramadan Forum")),
    "rendering": dict(ar=("الإظهار المعماري وCGI", "رندرات خارجية وداخلية ولقطات جوية وأفلام CGI، مبنية على مخططاتك المعتمدة.", "rendering.html"),
                      en=("Renders and CGI", "Exterior and interior renders, aerials and CGI films, built from your approved drawings.", "rendering-en.html"),
                      img="../assets/lp-v3/albayan-01-1200.webp",
                      alt=("جامعة البيان · منظور جوي CGI", "Al-Bayan University · CGI aerial view")),
    "maquettes": dict(ar=("المجسمات المعمارية", "مجسمات معمارية للمطورين: كلاسيكي وذكي وحركي وفرش أدوار.", "../services/maquettes.html"),
                      en=("Architectural maquettes", "Architectural maquettes and scale models, from classic to smart.", "../services/maquettes-en.html"),
                      img="../assets/lp-exh-v2/mwl-maquette1-1200.webp",
                      alt=("مجسم معماري في الورشة", "An architectural maquette in the workshop")),
}


def related(out, ar, keys):
    k = "ar" if ar else "en"
    cards = ""
    for key in keys:
        r = RELATED[key]
        h, p, href = r[k]
        w, hh = dims(out, r["img"])
        cards += (f'<a class="rv" href="{href}" data-related="{key}"><span class="ri"><img src="{r["img"]}" alt="{r["alt"][0 if ar else 1]}" width="{w}" height="{hh}" loading="lazy" decoding="async"></span>'
                  f'<span class="rb"><h3>{h}</h3><p>{p}</p><span class="go">{"اعرف أكثر" if ar else "Learn more"}</span></span></a>')
    return (f'<section class="fog" id="more"><div class="wrap"><p class="k">{"خدمات إضافية" if ar else "More services"}</p>'
            f'<h2>{"قد يهمك أيضًا" if ar else "You may also need"}</h2><div class="rel">{cards}</div></div></section>\n')


def footer(ar, priv_href, wa_msg, cta, close):
    return (f'<footer><div class="wrap"><p>© 2026 Graphics House Co.</p><p><a href="{priv_href}" target="_blank" rel="noopener">{"سياسة الخصوصية" if ar else "Privacy Policy"}</a>'
            f' · {"واتساب" if ar else "WhatsApp"}: <bdi dir="ltr">+966 50 278 6513</bdi></p></div></footer>\n'
            f'<a class="wafloat" href="{wa(wa_msg)}" target="_blank" rel="noopener" aria-label="WhatsApp" data-cta="float-whatsapp">{WA_ICON}</a>\n'
            f'<div class="mbar"><a class="btn btn-gold" href="#request" data-cta="mbar-primary">{cta}</a>'
            f'<a class="btn btn-ghost" href="{wa(wa_msg)}" target="_blank" rel="noopener" data-cta="mbar-whatsapp">{WA_ICON} {"واتساب" if ar else "WhatsApp"}</a></div>\n'
            f'<div class="lb" id="lb" role="dialog" aria-modal="true"><button type="button" aria-label="{close}">&times;</button><img alt=""><div class="lb-v"></div><p></p></div>\n')


def thanks_body(c_dir, lang, title, h, lead, steps, wa_label, wa_msg, back, self_href, ga, page, store_key):
    lis = "".join(f'<li><span><b>{b}</b>{p}</span></li>' for b, p in steps)
    return (f'<!DOCTYPE html>\n<html lang="{lang}" dir="{c_dir}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            f'<title>{title}</title>\n<meta name="robots" content="noindex,nofollow">\n<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">\n'
            f'{FONTS}{ga}<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. Fire the lead/conversion pixel event here once the owner adds the IDs. -->\n{CSS}</head>\n<body>\n{SYM}'
            f'<main class="thanks"><div class="wrap"><div class="tick"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>'
            f'<h1>{h}</h1><p class="lead">{lead}</p><div class="after"><ol>{lis}</ol></div>'
            f'<a class="btn btn-gold" href="{wa(wa_msg)}" target="_blank" rel="noopener" data-cta="thanks-whatsapp">{WA_ICON} {wa_label}</a>'
            f'<a class="back" href="{self_href}">{back}</a></div></main>\n'
            "<script>\n(function(){\n  var KEYS=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','ttclid','ScCid'];\n"
            f"  var q=new URLSearchParams(location.search), p={{page:'{page}',lang:'{lang}'}};\n"
            "  KEYS.forEach(function(k){if(q.get(k))p[k]=q.get(k);});\n"
            f"  try{{ if(sessionStorage.getItem('{store_key}'))return; sessionStorage.setItem('{store_key}','1'); }}catch(e){{}}\n"
            "  try{ if(window.gtag)window.gtag('event','lp_thank_you',p); window.dataLayer=window.dataLayer||[]; window.dataLayer.push({event:'lp_conversion',lp:p}); }catch(e){}\n"
            "})();\n</script>\n</body>\n</html>\n")
