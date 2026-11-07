# Shared generator for Graphics House campaign landing pages (lp/*.html).
import html, os, urllib.parse
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
A = '../assets/'
WA_NUM = '966502786513'
WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'
WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="%s"/></svg>' % WA_PATH
PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
LOGOS = [('rafal','Rafal'),('al-owla','Al Oula'),('makyon','Makyon'),('bn-zooma','Bin Zoma'),('aqarat','Aqarat'),('khatib-alami','Khatib and Alami'),('hilton','Hilton')]
E = lambda s: html.escape(s, True)

def pic(base, alt, w, h, ext='jpg', lazy=True):
    """base is relative to assets/, without extension; a .webp sibling must exist."""
    b = A + base
    ld = ' loading="lazy" decoding="async"' if lazy else ' fetchpriority="high"'
    return ('<picture><source srcset="%s.webp" type="image/webp"><img src="%s.%s" alt="%s" width="%d" height="%d"%s></picture>'
            % (b, b, ext, E(alt), w, h, ld))

def page(c, P):
    """c = language dict, P = page-level settings shared by both languages."""
    L = c['lang']; slug = P['slug']
    ar_file, en_file = slug + '.html', slug + '-en.html'
    wa_link = 'https://wa.me/%s?text=%s' % (WA_NUM, urllib.parse.quote(c['wa_text']))
    wa_plain = 'https://wa.me/%s' % WA_NUM
    out = []; ap = out.append
    ap('<!DOCTYPE html>\n<html lang="%s" dir="%s">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">' % (L, 'rtl' if L == 'ar' else 'ltr'))
    ap('<title>%s</title>' % html.escape(c['title']))
    ap('<meta name="description" content="%s">' % E(c['desc']))
    ap('<meta name="robots" content="noindex,nofollow">')
    ap('<link rel="canonical" href="https://3dgraphicshouse.com/lp/%s">' % (ar_file if L == 'ar' else en_file))
    ap('<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/lp/%s">' % ar_file)
    ap('<link rel="alternate" hreflang="en" href="https://3dgraphicshouse.com/lp/%s">' % en_file)
    ap('<meta property="og:title" content="%s">' % E(c['title']))
    ap('<meta property="og:description" content="%s">' % E(c['desc']))
    ap('<meta property="og:image" content="https://3dgraphicshouse.com/assets/%s">' % P['og'])
    ap('<meta property="og:type" content="website">')
    ap('<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">')
    ap('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    ap('<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">')
    ap('<script src="../assets/gh-forms-config.js?v=2"></script>')
    ap('<script async src="https://www.googletagmanager.com/gtag/js?id=G-NKM4H1FFBL"></script>')
    ap("<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-NKM4H1FFBL');gtag('config','G-Y67JVE898Z');</script>")
    ap('<script defer src="../assets/gh-analytics.js?v=3"></script>')
    ap('<link rel="stylesheet" href="lp.css?v=%s">' % P['v'])
    ap('</head>\n<body data-page="lp_%s_%s" data-service="%s" data-subject="%s" data-msg="%s" data-ptype="%s">' % (slug, L, P['service'], E(c['mail_subject']), E(c['mail_msg']), E(c['f']['ptype'].rstrip(' *'))))

    lang_ar = '<a href="%s"%s>AR</a>' % (ar_file, ' class="on"' if L == 'ar' else '')
    lang_en = '<a href="%s"%s>EN</a>' % (en_file, ' class="on"' if L == 'en' else '')
    ap('<header class="hdr"><div class="wrap"><img src="../assets/logo-gold.png" alt="Graphics House" width="732" height="344">'
       '<div class="hdr-r"><div class="lang">%s<span>|</span>%s</div><a class="btn btn-gold btn-sm" href="#request" data-cta="header">%s</a></div></div></header>' % (lang_en, lang_ar, c['book']))
    ap('<main>')
    hb, hw, hh, hx = P['hero']
    ap('<section class="hero" style="padding:0">%s<div class="wrap"><p class="eyebrow">%s</p><h1>%s</h1><p class="lead">%s</p>'
       '<div class="cta-row"><a class="btn btn-gold" href="#request" data-cta="hero-primary">%s</a>'
       '<a class="btn btn-ghost" href="%s" target="_blank" rel="noopener" data-cta="hero-whatsapp">%s %s</a></div>'
       '<p class="micro">%s</p><div class="chips">%s</div></div></section>'
       % (pic(hb, c['hero_alt'], hw, hh, hx, lazy=False), c['hero_eyebrow'], c['h1'], c['lead'], c['cta'], wa_link, WA_SVG, c['wa'], c['micro'], ''.join('<span>%s</span>' % x for x in c['chips'])))
    ap('<div class="stats"><div class="wrap">%s</div></div>' % ''.join('<div class="stat"><b>%s</b><span>%s</span></div>' % s for s in c['stats']))
    ap('<div class="logos-band"><div class="wrap"><p>%s</p><div class="logos">%s</div></div></div>'
       % (c['logos_label'], ''.join('<img src="../assets/clients-logo/%s.png" alt="%s" loading="lazy">' % (f, n) for f, n in LOGOS)))

    def head(eye, h, l=None, cls='center'):
        return '<div class="sec-head %s"><p class="eyebrow">%s</p><h2>%s</h2>%s</div>' % (cls, eye, h, '<p class="lead">%s</p>' % l if l else '')

    for sec in P['order']:
        if sec == 'problems':
            cards = ''.join('<div class="card"><h3>%s</h3><p>%s</p><p class="fix"><b>%s</b> %s</p></div>' % (a, b, c['fix'], d) for a, b, d in c['probs'])
            ap('<section><div class="wrap">%s<div class="grid g3">%s</div></div></section>' % (head(c['prob_eye'], c['prob_h'], c['prob_l']), cards))
        elif sec == 'deliverables':
            cards = ''.join('<div class="card"><div class="num">%02d</div><h3>%s</h3><p>%s</p></div>' % (i + 1, a, b) for i, (a, b) in enumerate(c['dels']))
            ap('<section class="alt"><div class="wrap">%s<div class="grid g3">%s</div></div></section>' % (head(c['del_eye'], c['del_h'], c['del_l']), cards))
        elif sec == 'films':
            cards = ''.join('<button type="button" class="film" data-yt="%s" data-cta="film-%s"><span class="film-th"><img src="https://img.youtube.com/vi/%s/%s.jpg" alt="" loading="lazy" width="480" height="360"><i>%s</i></span><b>%s</b><small>%s</small></button>'
                            % (y, y, y, P.get('thumbs', {}).get(y, 'hqdefault'), PLAY_SVG, t, d) for y, t, d in c['films'])
            ap('<section class="dark"><div class="wrap">%s<div class="films">%s</div></div></section>' % (head(c['film_eye'], c['film_h'], c['film_l']), cards))
        elif sec == 'packages':
            cards = []
            for i, pk in enumerate(c['pkgs']):
                items = ''.join('<li>%s</li>' % x for x in pk['items'])
                cards.append('<div class="pk%s">%s<p class="pk-n">%02d</p><h3>%s</h3><p class="pk-for"><b>%s</b> %s</p><ul>%s</ul>'
                             '<a class="btn %s" href="#request" data-pkg="%s" data-cta="pkg-%d">%s</a></div>'
                             % (' feat' if pk.get('feat') else '', '<span class="pk-tag">%s</span>' % c['pkg_feat'] if pk.get('feat') else '',
                                i + 1, pk['name'], c['pkg_for'], pk['for'], items, 'btn-gold' if pk.get('feat') else 'btn-line', E(pk['name']), i + 1, c['pkg_btn']))
            ap('<section class="alt" id="packages"><div class="wrap">%s<div class="pkgs">%s</div><p class="pk-note">%s</p></div></section>'
               % (head(c['pkg_eye'], c['pkg_h'], c['pkg_l']), ''.join(cards), c['pkg_note']))
        elif sec == 'gallery':
            figs = []
            for base, w, h, ext, ar, en in P['gal']:
                cap = ar if L == 'ar' else en
                figs.append('<figure tabindex="0" data-full="%s%s.webp">%s<figcaption>%s</figcaption></figure>' % (A, base, pic(base, cap, w, h, ext), html.escape(cap)))
            suf = '.html' if L == 'ar' else '-en.html'
            links = ''.join('<a href="../insights/projects/%s%s" target="_blank" rel="noopener">%s</a>' % (s, suf, lab) for s, lab in c['projs'])
            ap('<section class="dark"><div class="wrap">%s<div class="gal%s">%s</div><div class="proj-links">%s</div></div></section>'
               % (head(c['gal_eye'], c['gal_h'], c['gal_l']), ' ' + P['gal_cls'] if P.get('gal_cls') else '', ''.join(figs), links))
        elif sec == 'why':
            cards = ''.join('<div class="card"><div class="num">%02d</div><h3>%s</h3><p>%s</p></div>' % (i + 1, a, b) for i, (a, b) in enumerate(c['whys']))
            ap('<section><div class="wrap">%s<div class="grid g4">%s</div></div></section>' % (head(c['why_eye'], c['why_h']), cards))
        elif sec == 'process':
            cards = ''.join('<div class="card"><div class="num">%d</div><h3>%s</h3><p>%s</p></div>' % (i + 1, a, b) for i, (a, b) in enumerate(c['procs']))
            prep = ''
            if c.get('prep'):
                prep = '<div class="prep"><b>%s</b><ul>%s</ul></div>' % (c['prep_h'], ''.join('<li>%s</li>' % x for x in c['prep']))
            ap('<section class="alt"><div class="wrap">%s<div class="steps">%s</div>%s</div></section>' % (head(c['proc_eye'], c['proc_h']), cards, prep))
        elif sec == 'audience':
            ap('<section><div class="wrap">%s<div class="aud">%s</div></div></section>'
               % (head(c['aud_eye'], c['aud_h']), ''.join('<div>%s<small>%s</small></div>' % a for a in c['auds'])))
        elif sec == 'form':
            f = c['f']
            opt = lambda items: ''.join('<option>%s</option>' % x for x in items)
            nxt = ''.join('<li><div class="num">%d</div><div><b>%s</b><p>%s</p></div></li>' % (i + 1, a, b) for i, (a, b) in enumerate(c['next']))
            ap('<section class="formsec" id="request"><div class="wrap fgrid"><div><p class="eyebrow">%s</p><h2>%s</h2><p class="lead">%s</p><ul class="next-list">%s</ul></div>'
               '<form id="lpForm" novalidate>'
               '<div class="f"><label for="n">%s</label><input id="n" name="name" autocomplete="name" required></div>'
               '<div class="f"><label for="c">%s</label><input id="c" name="company" autocomplete="organization" required></div>'
               '<div class="f"><label for="e">%s</label><input id="e" name="email" type="email" autocomplete="email" required></div>'
               '<div class="f"><label for="p">%s</label><input id="p" name="phone" type="tel" autocomplete="tel" required></div>'
               '<div class="f"><label for="t">%s</label><select id="t" name="project_type" required><option value="" selected disabled>%s</option>%s</select></div>'
               '<div class="f"><label for="w">%s</label><select id="w" name="timeline"><option value="" selected>%s</option>%s</select></div>'
               '<div class="hp" aria-hidden="true"><label>Leave blank</label><input type="text" name="botcheck" tabindex="-1" autocomplete="off"></div>'
               '<div class="f full"><div id="ts" style="min-height:65px"></div></div><div id="fb" aria-live="polite"></div>'
               '<div class="f full"><button class="btn btn-gold" type="submit" id="sb" data-cta="form-submit">%s</button></div><p class="note">%s</p></form></div></section>'
               % (c['form_eye'], c['form_h'], c['form_l'], nxt, f['name'], f['company'], f['email'], f['phone'], f['ptype'], f['choose'], opt(f['types']), f['timeline'], f['choose'], opt(f['times']), f['submit'], f['note']))
        elif sec == 'faq':
            faqs = ''.join('<details><summary>%s</summary><p>%s</p></details>' % (q, a) for q, a in c['faqs'])
            ap('<section class="alt"><div class="wrap">%s<div class="faqw">%s</div></div></section>' % (head(c['faq_eye'], c['faq_h']), faqs))

    ap('<section class="dark final"><div class="wrap"><h2>%s</h2><p class="lead">%s</p><div class="cta-row" style="margin-top:28px"><a class="btn btn-gold" href="#request" data-cta="final-primary">%s</a><a class="btn btn-ghost" href="%s" target="_blank" rel="noopener" data-cta="final-whatsapp">%s %s</a></div></div></section>'
       % (c['final_h'], c['final_l'], c['cta'], wa_plain, WA_SVG, c['wa']))
    ap('</main>')
    ap('<footer><div class="wrap">%s · <a href="../%s" target="_blank" rel="noopener">%s</a></div></footer>' % (c['foot'], 'privacy-policy.html' if L == 'ar' else 'privacy-policy-en.html', c['priv']))
    ap('<a class="wa" href="%s" target="_blank" rel="noopener" aria-label="WhatsApp" data-cta="float-whatsapp">%s</a>' % (wa_plain, WA_SVG))
    ap('<div class="mbar"><a class="btn btn-gold" href="#request" data-cta="mbar-primary">%s</a><a class="btn btn-ghost" href="%s" target="_blank" rel="noopener" data-cta="mbar-whatsapp">%s</a></div>' % (c['book'], wa_plain, c['wa']))
    ap('<div class="lb" id="lb" role="dialog" aria-modal="true"><button type="button" aria-label="%s">&times;</button><img alt=""><div class="lb-v"></div><p></p></div>' % c['close'])
    ap('<script src="lp.js?v=%s"></script>\n</body>\n</html>\n' % P['v'])
    return '\n'.join(out)

def build(T, P):
    for c in T.values():
        p = os.path.join(ROOT, 'lp', P['slug'] + ('.html' if c['lang'] == 'ar' else '-en.html'))
        open(p, 'w', encoding='utf-8').write(page(c, P))
        print('wrote', p, os.path.getsize(p))
