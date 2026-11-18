#!/usr/bin/env python3
"""Exhibitions LP v2 (owner direction 2026-11-17): same approach as production v4, one level higher.

Generates lp/exhibitions.html, exhibitions-en.html, thanks-exhibitions.html, thanks-exhibitions-en.html.
Run: python3 scripts/lp/gen_exhibitions.py lp
Identity phase 1 (2026-11-18): rendered with the group LP system (lp/system.css, scripts/lp/lp_system.py).
Hero: split hero A, chosen by the owner 2026-11-17 (option B, the full-width photo, was removed).
Materials: real exhibition photos only (assets/lp-exh-v2/, from 3200px sources) and the 21s film made from them.
Never use mwl-vip*: the upscaler changed the faces of official guests (DESIGN_STANDARD.md).
"""
import sys, os, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icons_lp import sprite, ic
from lp_system import FONTS, CSS, SYS_JS, SYM, CHECK, header, related, footer, thanks_body
from urllib.parse import quote

OUT = sys.argv[1]  # .../GraphicsHouse/lp
WA = "966502786513"
YT = "H66KNP1sQCk"
WA_PATH = ("M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z")
WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><use href="#i-wa"/></svg>'
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'

V2 = "../assets/lp-exh-v2/"
OLD = "../assets/lp/exhibitions/"
FILM = V2 + "gh-exhibition-film-720.mp4"
FILM_M = V2 + "gh-exhibition-film-360.mp4"
FILM_FULL = V2 + "gh-exhibition-film-1080.mp4"
POSTER = V2 + "gh-exhibition-film-poster-1280.webp"
HERO = "mwl-maquette2"


def wa(t): return f"https://wa.me/{WA}?text={quote(t)}"


def dims(rel):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", os.path.join(OUT, rel)],
                         capture_output=True, text=True).stdout.strip()
    return out.split("x")[:2]


def pic(name, alt, sizes, lazy=True, high=False):
    """A v2 photo with its 1200/2400 WebP pair, shown complete (never cropped)."""
    s12, s24 = f"{V2}{name}-1200.webp", f"{V2}{name}-2400.webp"
    w, h = dims(s12)
    extra = (' loading="lazy"' if lazy else '') + (' fetchpriority="high"' if high else '')
    return (f'<img src="{s12}" srcset="{s12} 1200w, {s24} 2400w" sizes="{sizes}" alt="{alt}" width="{w}" height="{h}"{extra}{'' if high else ' decoding="async"'}>')


def old(name, alt):
    w, h = dims(OLD + name)
    return f'<img src="{OLD}{name}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async">'


T = {
"ar": dict(
    lang="ar", dir="rtl", self="exhibitions.html", other="exhibitions-en.html", thanks="thanks-exhibitions.html",
    title="تجربة المعرض الذكية: جناح يجذب الزائر ويُريه المشروع | Graphics House",
    desc="تجربة معرض ذكية للمطورين والجهات: مجسم ذكي وشاشات تفاعلية وحائط صور تذكارية، من الهوية والتصميم إلى التنفيذ. احجز مفهوم جناحك.",
    subject="Graphics House: طلب مفهوم جناح (تجربة المعرض الذكية)", msg="طلب من صفحة تجربة المعرض الذكية",
    interest="تجربة المعرض الذكية",
    cta="احجز مفهوم جناحك", wa_label="واتساب", wa_small="أو راسلنا على واتساب", wa_msg="السلام عليكم، أريد مفهوم جناح لمعرض قادم",
    eyebrow="تجربة المعرض الذكية · للمطورين والجهات",
    h1='جناح <span class="gold">يجذب الزائر</span> ويُريه المشروع',
    lead="مجسم ذكي وشاشات تفاعلية وحائط صور تذكارية، يمكن ربطه بجمع البيانات في جناحك، من الهوية والتصميم إلى التنفيذ، من فريق واحد.",
    micro="نرد على طلبك خلال 24 ساعة", watch="شاهد الفيلم", watch_full="الفيلم الكامل",
    hero_alt="مجسم ذكي دائري مضاء أنتجته Graphics House للملتقى الرمضاني لرابطة العالم الإسلامي",
    hero_cap="المجسم الذكي للملتقى الرمضاني لرابطة العالم الإسلامي، هيلتون جدة",
    proof=[("<bdi dir=\"ltr\">+5,000</bdi>", "زائر للجناح"), ("4", "وحدات تفاعلية في جناح واحد"), ("1", "فريق من الهوية إلى التشغيل")],
    proof_logo_lead="من أعمالنا", mwl="رابطة العالم الإسلامي",
    why_eyebrow="المشكلة", why_h="معظم الأجنحة تعرض، ثم ينتهي المعرض بلا شيء",
    why_img=("mwl-hall2", "زوار الملتقى الرمضاني حول المجسم الذكي وشاشة التحكم", "زوار الملتقى الرمضاني حول المجسم الذكي، هيلتون جدة"),
    why=[("زوار كثيرون، بيانات قليلة", "يمر آلاف الزوار ويغادرون دون أثر. لا أسماء ولا أرقام ولا متابعة بعد المعرض."),
         ("وقت إقناع طويل", "المندوب يشرح المشروع شفهيًا لكل زائر، والمشروع لم يُبنَ بعد."),
         ("لا قياس للنتيجة", "ينتهي المعرض ولا تعرف ما الذي نجح وما الذي يستحق الاستثمار في المعرض القادم.")],
    path_eyebrow="المسار الكامل", path_h="من الهوية إلى تقرير ما بعد المعرض",
    path=[("الهوية", "هوية الجناح ورسالته."), ("التصميم", "تصور الجناح وتجربة الزائر."), ("الديكور والتنفيذ", "تنفيذ الجناح في الموقع."),
          ("المجسم الذكي والشاشات", "مجسم مضاء تتحكم به شاشة لمس."), ("أدوات التسويق", "مواد الجناح ومحتواه."), ("بيانات الزوار والتقرير", "بموافقة الزائر، وتقرير بعد المعرض.")],
    mods_eyebrow="الوحدات", mods_h="أربع وحدات تجذب الزائر، ويمكن ربطها بجمع بياناته",
    mods=[("المجسم الذكي", "مجسم معماري لمشاريعك بإضاءة متحركة، يجذب الزائر إلى الجناح ويريه المشروع قبل أن يُبنى.", ("v2", "mwl-maquette1", "المجسم الذكي في الورشة بتفاصيل مبانيه وشاشة التحكم")),
          ("عارض المشاريع", "شاشة لمس تتحكم في المجسم وتعرض تفاصيل كل مشروع. يختصر وقت الإقناع: الزائر يرى ويختار بنفسه.", ("v2", "mwl-screen-maquette", "زائر يتحكم في المجسم من شاشة اللمس وخلفه شاشة ميثاق مكة المكرمة")),
          ("عارض الأخبار والإنجازات", "شاشة تفاعلية تعرض أخبار الجهة ومبادراتها وإنجازاتها، يتصفحها الزائر بنفسه.", ("old", "booth-news-screen.webp", "زوار حول المجسم الذكي أمام شاشة رابطة العالم الإسلامي في الملتقى الرمضاني")),
          ("حائط الصور التذكارية", "شاشة تصوير بإطارات مخصصة للمعرض، يلتقط الزائر صورته ويشاركها فورًا. في جناحك يمكن ربطه برمز QR ونموذج موافقة لالتقاط بيانات الزائر.", ("old", "booth-photo-wall.webp", "زوار الملتقى الرمضاني في القاعة، وخلفهم شاشات الجناح ومنها شاشة الصور التذكارية"))],
    case_eyebrow="دراسة الحالة", case_h="الملتقى الرمضاني لرابطة العالم الإسلامي في هيلتون جدة",
    case_p="تجربة تفاعلية متكاملة من التصميم إلى التنفيذ.",
    film_alt="فيلم قصير من صور الملتقى: الورشة، ثم المجسم مضاءً، ثم الزوار والشاشات",
    film_cap="21 ثانية من الورشة إلى يوم الملتقى",
    case_gives="ما سلّمنا",
    case_items=["صمّمت Graphics House الجناح وشغّلته", "مجسم معماري تفاعلي ذكي لمشاريع الرابطة حول العالم، بإضاءة متحركة", "برنامج تشغيلي على شاشة اللمس يتحكم في المجسم ويعرض تفاصيل المشاريع", "برنامج تفاعلي لأخبار الرابطة حول العالم", "برنامج تصوير تذكاري بإطارات مخصصة للفعالية"],
    case_link="اقرأ دراسة الحالة كاملة",
    journey_h="من الورشة إلى المعرض",
    journey=[("mwl-maquette1", "في الورشة", "المجسم في الورشة قبل التركيب"),
             ("mwl-maquette2", "المجسم مضاءً", "المجسم الذكي مضاءً بكامل تفاصيله"),
             ("mwl-screens", "في الجناح", "المجسم والشاشات في جناح الملتقى"),
             ("mwl-hall", "يوم الملتقى", "زوار الملتقى الرمضاني في القاعة")],
    tiers_eyebrow="المستويات", tiers_h="ثلاثة مستويات، والسعر بعد الجلسة",
    tiers=[("مفهوم جناح", "تبدأ به قبل أي التزام.", ["تصور الجناح وتجربة الزائر", "الوحدات التفاعلية المقترحة لجناحك", "خطة التنفيذ والجدول الزمني"]),
           ("جناح كامل", "جناح جاهز من التصميم إلى التشغيل.", ["كل ما في مفهوم الجناح", "تصميم الجناح وتشغيله", "مجسم ذكي وشاشات تفاعلية", "حائط الصور التذكارية"]),
           ("إطلاق متكامل", "للمشاريع التي تُطلق في المعرض.", ["كل ما في الجناح الكامل", "هوية المشروع وأدوات التسويق", "بيانات الزوار بموافقتهم", "تقرير ما بعد المعرض"])],
    tier_tag="الأنسب للمعارض الكبرى",
    steps_eyebrow="الخطوات", steps_h="من الجلسة إلى يوم الافتتاح",
    steps=[("جلسة المفهوم", "نفهم المعرض والمساحة والهدف."), ("التصميم", "تصور الجناح والوحدات، تعتمده قبل الإنتاج."), ("الإنتاج", "المجسم والبرمجيات والديكور بالتوازي."), ("التركيب والتشغيل", "نركّب ونشغّل ونختبر قبل الافتتاح.")],
    deadline_h="تستعد لسيتي سكيب؟",
    deadline_p="قرارات الأجنحة تُتخذ الآن. احجز جلسة المفهوم مبكرًا لنضمن وقت الإنتاج.",
    faq_h="قبل أن تبدأ",
    faq=[("كيف تتعاملون مع خصوصية الزوار؟", "لا تُجمع بيانات الزائر إلا بموافقته الصريحة على الشاشة أو النموذج، ولا تُنشر صور الزوار إلا بموافقتهم."),
         ("ماذا تحتاجون منا؟", "مساحة الجناح ومخططه من المنظم، وهوية الجهة، والمشاريع أو المحتوى الذي تريد عرضه، وموعد المعرض."),
         ("كيف يُحدد السعر؟", "حسب مساحة الجناح والوحدات المختارة. يصلك العرض بعد جلسة المفهوم، قبل أي التزام.")],
    form_eyebrow="ابدأ الآن", form_h="احجز مفهوم جناحك", form_lead="أخبرنا بالمعرض والمساحة، ونرد خلال 24 ساعة.",
    nexts=[("نرد خلال 24 ساعة", "نتواصل معك لتحديد جلسة المفهوم."), ("جلسة المفهوم", "نفهم المعرض والمساحة والهدف."), ("المفهوم والعرض", "يصلانك قبل أي التزام.")],
    f_name="الاسم *", f_company="الشركة / الجهة *", f_phone="واتساب *", f_exh="اسم المعرض وتاريخه *", f_exh_ph="مثال: سيتي سكيب",
    f_area="مساحة الجناح التقريبية *", f_sel="اختر",
    areas=["أقل من 50 م²", "من 50 إلى 150 م²", "من 150 إلى 300 م²", "أكثر من 300 م²", "لم تتحدد بعد"],
    area_todo="TODO-OWNER: يؤكد المالك نطاقات المساحة. الحقل للتأهيل الداخلي.",
    privacy='بإرسال النموذج توافق على <a href="../privacy-policy.html" target="_blank" rel="noopener">سياسة الخصوصية</a>. نستخدم بياناتك للرد على طلبك فقط.',
    priv_href="../privacy-policy.html", priv_txt="سياسة الخصوصية", close="إغلاق",
    th_title="تم استلام طلبك | Graphics House", th_h="تم استلام طلبك", th_lead="سنتواصل معك خلال 24 ساعة لتحديد جلسة المفهوم.",
    th_steps=[("نراجع طلبك", "نقرأ تفاصيل المعرض والمساحة."), ("نتواصل معك", "على واتساب أو الهاتف لتحديد الجلسة."), ("المفهوم والعرض", "يصلانك بعد الجلسة، قبل أي التزام.")],
    th_wa="تواصل معنا الآن على واتساب", th_wamsg="السلام عليكم، أرسلت طلب مفهوم جناح وأرغب بالمتابعة", th_back="العودة إلى الصفحة",
),
"en": dict(
    lang="en", dir="ltr", self="exhibitions-en.html", other="exhibitions.html", thanks="thanks-exhibitions-en.html",
    title="Smart Exhibition Experience: a booth that draws visitors in | Graphics House",
    desc="A smart exhibition experience for developers and institutions: a smart maquette, interactive screens and a photo wall, from identity and design to delivery. Book your booth concept.",
    subject="Graphics House: booth concept request (smart exhibition experience)", msg="Request from the smart exhibition experience page",
    interest="Smart exhibition experience",
    cta="Book your booth concept", wa_label="WhatsApp", wa_small="or message us on WhatsApp", wa_msg="Hello, I would like a booth concept for an upcoming exhibition",
    eyebrow="Smart exhibition experience · for developers and institutions",
    h1='A booth that <span class="gold">draws visitors in</span> and shows them the project',
    lead="A smart maquette, interactive screens and a photo wall that can be linked to data capture in your booth, from identity and design to delivery, by one team.",
    micro="We reply within 24 hours", watch="Watch the film", watch_full="Full film",
    hero_alt="Lit circular smart maquette produced by Graphics House for the Muslim World League Ramadan Forum",
    hero_cap="The smart maquette for the Muslim World League Ramadan Forum, Hilton Jeddah",
    proof=[("5,000+", "booth visitors"), ("4", "interactive units in one booth"), ("1", "team from identity to operation")],
    proof_logo_lead="From our work", mwl="Muslim World League",
    why_eyebrow="The problem", why_h="Most booths show, then the exhibition ends with nothing",
    why_img=("mwl-hall2", "Ramadan Forum visitors around the smart maquette and its control screen", "Ramadan Forum visitors around the smart maquette, Hilton Jeddah"),
    why=[("Many visitors, little data", "Thousands walk by and leave without a trace. No names, no numbers, no follow-up."),
         ("Long time to persuade", "Sales staff explain the project verbally to every visitor, and it is not built yet."),
         ("No way to measure results", "The exhibition ends and you do not know what worked or what deserves budget next time.")],
    path_eyebrow="The full path", path_h="From identity to the post-exhibition report",
    path=[("Identity", "Booth identity and message."), ("Design", "Booth concept and visitor journey."), ("Fit-out and build", "Building the booth on site."),
          ("Smart maquette and screens", "A lit maquette driven by a touch screen."), ("Marketing tools", "Booth materials and content."), ("Visitor data and report", "With visitor consent, plus a post-show report.")],
    mods_eyebrow="The units", mods_h="Four units that draw visitors in and can capture their data",
    mods=[("Smart maquette", "An architectural maquette of your projects with dynamic lighting. It draws visitors to the booth and shows the project before it is built.", ("v2", "mwl-maquette1", "The smart maquette in the workshop with its building details and control screen")),
          ("Project viewer", "A touch screen that drives the maquette and shows each project's details. It shortens persuasion: visitors see and choose for themselves.", ("v2", "mwl-screen-maquette", "A visitor drives the maquette from the touch screen, with the Makkah Charter screen behind")),
          ("News and achievements viewer", "An interactive screen with the organisation's news, initiatives and achievements, browsed by the visitor.", ("old", "booth-news-screen.webp", "Visitors around the smart maquette in front of the Muslim World League screen at the Ramadan Forum")),
          ("Commemorative photo wall", "A photo screen with custom exhibition frames; visitors take their photo and share it instantly. In your booth it can be linked to a QR code and consent form to capture visitor data.", ("old", "booth-photo-wall.webp", "Ramadan Forum visitors in the hall, with the booth screens behind them, including the photo wall screen"))],
    case_eyebrow="Case study", case_h="Muslim World League Ramadan Forum at Hilton Jeddah",
    case_p="A complete interactive experience from design to delivery.",
    film_alt="A short film from the forum photos: the workshop, the lit maquette, then visitors and screens",
    film_cap="21 seconds from the workshop to forum day",
    case_gives="What we delivered",
    case_items=["Graphics House designed and ran the booth", "An interactive smart maquette of the League's projects worldwide, with dynamic lighting", "An operating program on a touch screen that drives the maquette and shows project details", "An interactive program for League news around the world", "A commemorative photo program with custom event frames"],
    case_link="Read the full case study",
    journey_h="From the workshop to the exhibition",
    journey=[("mwl-maquette1", "In the workshop", "The maquette in the workshop before installation"),
             ("mwl-maquette2", "The maquette lit", "The smart maquette lit in full detail"),
             ("mwl-screens", "In the booth", "The maquette and screens in the forum booth"),
             ("mwl-hall", "Forum day", "Ramadan Forum visitors in the hall")],
    tiers_eyebrow="Levels", tiers_h="Three levels, priced after the session",
    tiers=[("Booth concept", "Start here before any commitment.", ["Booth concept and visitor journey", "Interactive units proposed for your booth", "Delivery plan and timeline"]),
           ("Full booth", "A ready booth from design to operation.", ["Everything in the booth concept", "Booth design and operation", "Smart maquette and interactive screens", "Commemorative photo wall"]),
           ("Full launch", "For projects launched at the exhibition.", ["Everything in the full booth", "Project identity and marketing tools", "Visitor data with consent", "Post-exhibition report"])],
    tier_tag="Best for major exhibitions",
    steps_eyebrow="The steps", steps_h="From the session to opening day",
    steps=[("Concept session", "We understand the exhibition, space and goal."), ("Design", "Booth and units concept, approved before production."), ("Production", "Maquette, software and fit-out in parallel."), ("Install and run", "We install, run and test before opening.")],
    deadline_h="Preparing for Cityscape?",
    deadline_p="Booth decisions are being made now. Book the concept session early to secure production time.",
    faq_h="Before you start",
    faq=[("How do you handle visitor privacy?", "Visitor data is collected only with explicit consent on the screen or form, and visitor photos are not published without consent."),
         ("What do you need from us?", "The booth space and plan from the organiser, your identity, the projects or content to show, and the exhibition date."),
         ("How is the price set?", "By booth size and the units you choose. You receive the offer after the concept session, before any commitment.")],
    form_eyebrow="Start now", form_h="Book your booth concept", form_lead="Tell us the exhibition and space, and we reply within 24 hours.",
    nexts=[("We reply within 24 hours", "We contact you to set the concept session."), ("Concept session", "We understand the exhibition, space and goal."), ("Concept and offer", "Both reach you before any commitment.")],
    f_name="Name *", f_company="Company / organisation *", f_phone="WhatsApp *", f_exh="Exhibition name and date *", f_exh_ph="e.g. Cityscape",
    f_area="Approximate booth size *", f_sel="Select",
    areas=["Under 50 m²", "50 to 150 m²", "150 to 300 m²", "Over 300 m²", "Not decided yet"],
    area_todo="TODO-OWNER: the owner confirms the size ranges. The field is for internal qualification.",
    privacy='By submitting you agree to the <a href="../privacy-policy-en.html" target="_blank" rel="noopener">Privacy Policy</a>. We use your details only to respond to your request.',
    priv_href="../privacy-policy-en.html", priv_txt="Privacy Policy", close="Close",
    th_title="Request received | Graphics House", th_h="Request received", th_lead="We will contact you within 24 hours to set the concept session.",
    th_steps=[("We review your request", "We read the exhibition and space details."), ("We contact you", "On WhatsApp or by phone to set the session."), ("Concept and offer", "Both reach you after the session, before any commitment.")],
    th_wa="Message us on WhatsApp now", th_wamsg="Hello, I sent a booth concept request and would like to follow up", th_back="Back to the page",
),
}

# --- 2026-11-18: identity phase 1. Layout, fonts and sizes follow the group LP system (lp/system.css),
# reference beesmotion.com/lp/property-content-engine. Copy above is unchanged.
T["ar"].update(work_k="الوحدات", faq_k="أسئلة شائعة", after_h="ماذا يحدث بعد الإرسال", req="مطلوب", price_note="شريط «يبدأ من»: يظهر بعد قرار المالك فقط.")
T["en"].update(work_k="The units", faq_k="FAQ", after_h="What happens after you send", req="required", price_note="'Starts from' line: shown only after the owner decides.")

GA = ("<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-NKM4H1FFBL\"></script>\n"
      "<script>if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){window['ga-disable-G-NKM4H1FFBL']=true;window['ga-disable-G-Y67JVE898Z']=true;}"
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-NKM4H1FFBL');gtag('config','G-Y67JVE898Z');</script>\n")


def build(c):
    L = c["lang"]; ar = L == "ar"
    head = (f'<!DOCTYPE html>\n<html lang="{L}" dir="{c["dir"]}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<meta name="theme-color" content="#0a0a0b">\n<title>{c["title"]}</title>\n<meta name="description" content="{c["desc"]}">\n<meta name="robots" content="noindex,nofollow">\n'
            f'<link rel="canonical" href="https://3dgraphicshouse.com/lp/{c["self"]}">\n'
            f'<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/lp/exhibitions.html">\n<link rel="alternate" hreflang="en" href="https://3dgraphicshouse.com/lp/exhibitions-en.html">\n'
            f'<meta property="og:title" content="{c["title"]}">\n<meta property="og:description" content="{c["desc"]}">\n'
            f'<meta property="og:image" content="https://3dgraphicshouse.com/assets/lp-exh-v2/gh-exhibition-film-poster.jpg">\n<meta property="og:type" content="website">\n'
            f'<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">\n{FONTS}'
            f'<script src="../assets/gh-forms-config.js?v=3"></script>\n{GA}<script defer src="../assets/gh-analytics.js?v=3"></script>\n'
            f'<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. IDs are added by the owner after approval; see lp-v2.js (GH_ADS). -->\n'
            f'{CSS}{SYS_JS}<link rel="preload" as="image" href="{V2}{HERO}-1200.webp" imagesrcset="{V2}{HERO}-1200.webp 1200w, {V2}{HERO}-2400.webp 2400w" imagesizes="(max-width:992px) 100vw, 640px">\n</head>\n')
    body = (f'<body data-page="lp_exhibitions_{L}" data-service="Exhibitions" data-form="lp_exhibitions" data-thanks="{c["thanks"]}" '
            f'data-subject="{c["subject"]}" data-msg="{c["msg"]}" data-interest="{c["interest"]}">\n{SYM}{sprite()}')
    hdr = header(ar, c["self"], c["other"], c["cta"])

    film_btn = lambda cta: f'<button type="button" class="vfull" data-mp4="{FILM_FULL}" data-cta="{cta}">{PLAY}<b>{c["watch"]}</b></button>'

    # 1) split hero A (owner choice): text and one call to action, the lit maquette photo in a card. No video background.
    hero = (f'<main id="main">\n<section class="hero"><div class="wrap">'
            f'<div><p class="k">{c["eyebrow"]}</p><h1>{c["h1"]}</h1><p class="sub">{c["lead"]}</p>'
            f'<div class="ctas"><a class="btn btn-gold" href="#request" data-cta="hero-primary">{c["cta"]}</a>'
            f'<a class="walink" href="{wa(c["wa_msg"])}" target="_blank" rel="noopener" data-cta="hero-whatsapp">{WA_ICON} {c["wa_small"]}</a></div>'
            f'<p class="micro">{ic("reply24")} {c["micro"]}</p></div>'
            f'<figure class="mcard"><div class="vframe nat">{pic(HERO, c["hero_alt"], "(max-width:992px) 100vw, 640px", lazy=False, high=True)}</div>'
            f'<figcaption><span class="vcap">{c["hero_cap"]}</span>{film_btn("hero-film")}</figcaption></figure>'
            f'</div></section>\n')

    # 2) proof: the approved numbers and the client logo
    stats = "".join(f'<div class="stat"><b>{n}</b><span>{t}</span></div>' for n, t in c["proof"])
    proof = (f'<div class="proof"><div class="wrap"><div><p class="proof-l">{c["proof_logo_lead"]}</p><div class="logos">'
             f'<img src="../assets/clients-logo/{quote("رابطة العالم الاسلامي.png")}" alt="{c["mwl"]}" loading="lazy" decoding="async"></div></div>'
             f'<div class="stats">{stats}</div></div></div>\n')

    # 3) problem (dark) with a real photo of visitors around the maquette
    nm, alt, cap = c["why_img"]
    probs = "".join(f'<li class="prob rv"><span class="n">0{i}</span><h3>{a}</h3><p>{b}</p></li>' for i, (a, b) in enumerate(c["why"], 1))
    whysec = (f'<section class="dark"><div class="wrap"><p class="k">{c["why_eyebrow"]}</p><h2>{c["why_h"]}</h2>'
              f'<div class="pgrid"><figure class="shot rv">{pic(nm, alt, "(max-width:992px) 100vw, 600px")}<figcaption>{cap}</figcaption></figure>'
              f'<ol class="probs">{probs}</ol></div></div></section>\n')

    # 4) the full path, then four units, one real photo and one sentence each
    path = "".join(f'<li class="rv"><b>{h}</b><small>{p}</small></li>' for h, p in c["path"])
    mods = ""
    for i, (h, p, (kind, f, a)) in enumerate(c["mods"], 1):
        media = pic(f, a, "(max-width:992px) 100vw, 600px") if kind == "v2" else old(f, a)
        mods += f'<article class="mod rv"><figure class="mod-media">{media}<figcaption>{a}</figcaption></figure><div class="mod-b"><span class="n">0{i}</span><h3>{h}</h3><p>{p}</p></div></article>'
    modsec = (f'<section id="units"><div class="wrap"><p class="k">{c["path_eyebrow"]}</p><h2>{c["path_h"]}</h2><ol class="path">{path}</ol></div></section>\n'
              f'<section class="fog"><div class="wrap"><p class="k">{c["mods_eyebrow"]}</p><h2>{c["mods_h"]}</h2><div class="mods">{mods}</div></div></section>\n')

    # 5) case study: the film muted in a card, what we delivered, then "from the workshop to the exhibition"
    items = "".join(f"<li>{x}</li>" for x in c["case_items"])
    jr = ""
    for i, (f, cap, a) in enumerate(c["journey"], 1):
        jr += (f'<figure class="rv" tabindex="0" data-full="{V2}{f}-2400.webp"><span class="wk">{pic(f, a, "(max-width:640px) 100vw, (max-width:992px) 50vw, 300px")}</span>'
               f'<figcaption><span class="jn">{i}</span>{cap}</figcaption></figure>')
    case = (f'<section id="case"><div class="wrap"><p class="k">{c["case_eyebrow"]}</p><h2>{c["case_h"]}</h2><p class="lead">{c["case_p"]}</p>'
            f'<div class="case-grid"><figure class="mcard vcard fcard" data-src="{FILM}" data-src-m="{FILM_M}">'
            f'<div class="vframe"><img class="vposter" src="{POSTER}" alt="{c["film_alt"]}" width="1280" height="720" loading="lazy" decoding="async">'
            f'<video class="card-vid" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video></div>'
            f'<figcaption><span class="vcap">{c["film_cap"]}</span>'
            f'<button type="button" class="vfull" data-yt="{YT}" data-cta="case-film">{PLAY}<b>{c["watch_full"]}</b></button></figcaption></figure>'
            f'<div class="case"><p class="gives">{c["case_gives"]}</p><ul class="ticks">{items}</ul><a class="more" href="../casestudy-mwl.html" target="_blank" rel="noopener">{c["case_link"]}</a></div></div>'
            f'<h3 class="journey-h">{c["journey_h"]}</h3><div class="gal four">{jr}</div></div></section>\n')

    # 6) levels (dark), no prices; the "starts from" line is empty and hidden until the owner decides
    tiers = ""
    for i, (h, sub, lis) in enumerate(c["tiers"]):
        feat = i == 1
        tag = f'<span class="badge">{c["tier_tag"]}</span>' if feat else ""
        tiers += (f'<article class="pack rv{" hot" if feat else ""}">{tag}<p class="pn">0{i+1}</p><h3>{h}</h3><p class="for">{sub}</p>'
                  f'<p class="from" hidden data-todo-owner="price"><!-- {c["price_note"]} --></p>'
                  f'<ul>{"".join(f"<li>{CHECK}<span>{x}</span></li>" for x in lis)}</ul>'
                  f'<a class="btn btn-gold" href="#request" data-cta="tier-{i+1}">{c["cta"]}</a></article>')
    tiersec = (f'<section class="dark" id="packages"><div class="wrap"><p class="k">{c["tiers_eyebrow"]}</p><h2>{c["tiers_h"]}</h2>'
               f'<div class="packs">{tiers}</div></div></section>\n')

    # 7) steps and the Cityscape deadline
    steps = "".join(f'<li class="rv"><h3>{h}</h3><p>{p}</p></li>' for h, p in c["steps"])
    stepsec = (f'<section><div class="wrap"><p class="k">{c["steps_eyebrow"]}</p><h2>{c["steps_h"]}</h2><ol class="steps">{steps}</ol>'
               f'<div class="honest rv"><div><h3>{c["deadline_h"]}</h3><p>{c["deadline_p"]}</p></div>'
               f'<a class="btn btn-gold" href="#request" data-cta="deadline">{c["cta"]}</a></div></div></section>\n')

    # 8) form (dark), the exhibition fields stay
    nexts = "".join(f'<li><span><b>{b}</b>{p}</span></li>' for b, p in c["nexts"])
    areas = "".join(f"<option>{t}</option>" for t in c["areas"])
    attrs = "".join(f'<input type="hidden" name="{k}" data-attr="{k}">' for k in ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ttclid", "ScCid"])
    star = f' <i aria-label="{c["req"]}">*</i>'
    lab = lambda s: s.replace(" *", star)
    form = (f'<section class="dark" id="request"><div class="wrap"><p class="k">{c["form_eyebrow"]}</p><h2>{c["form_h"]}</h2><p class="lead">{c["form_lead"]}</p>'
            f'<div class="fgrid"><form id="lpFormV2" novalidate>'
            f'<div class="two"><label for="n">{lab(c["f_name"])}<input id="n" name="name" autocomplete="name" required></label>'
            f'<label for="c">{lab(c["f_company"])}<input id="c" name="company" autocomplete="organization" required></label></div>'
            f'<label for="p">{lab(c["f_phone"])}<input id="p" name="phone" type="tel" inputmode="tel" autocomplete="tel" required dir="ltr"></label>'
            f'<label for="x">{lab(c["f_exh"])}<input id="x" name="exhibition" data-label="{c["f_exh"].rstrip(" *")}" placeholder="{c["f_exh_ph"]}" required></label>'
            f'<label for="a">{lab(c["f_area"])}<!-- {c["area_todo"]} -->\n'
            f'<select id="a" name="booth_size" data-label="{c["f_area"].rstrip(" *")}" required><option value="" selected disabled>{c["f_sel"]}</option>{areas}</select></label>'
            f'{attrs}<div class="hp" aria-hidden="true"><label>Leave blank<input type="text" name="botcheck" tabindex="-1" autocomplete="off"></label></div>'
            f'<div id="ts"></div><div id="fb" role="status" aria-live="polite"></div>'
            f'<button class="btn btn-gold" type="submit" id="sb" data-cta="form-submit">{c["cta"]}</button>'
            f'<p class="fnote">{c["privacy"]}</p></form>'
            f'<aside><div class="after"><h3>{c["after_h"]}</h3><ol>{nexts}</ol>'
            f'<a class="btn btn-ghost" href="{wa(c["wa_msg"])}" target="_blank" rel="noopener" data-cta="form-whatsapp">{WA_ICON} {c["wa_label"]}</a></div></aside></div></div></section>\n')

    # 9) FAQ
    faq = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in c["faq"])
    faqsec = f'<section><div class="wrap faqg"><div><p class="k">{c["faq_k"]}</p><h2>{c["faq_h"]}</h2></div><div>{faq}</div></div></section>\n'

    # 10) related services (GH pages only)
    rel = related(OUT, ar, ["production", "rendering", "maquettes"]) + '</main>\n'

    foot = (footer(ar, c["priv_href"], c["wa_msg"], c["cta"], c["close"])
            + '<script src="lp-exh-v2.js?v=2"></script>\n<script src="lp.js?v=3"></script>\n<script src="lp-v2.js?v=6"></script>\n</body>\n</html>\n')
    return head + body + hdr + hero + proof + whysec + modsec + case + tiersec + stepsec + form + faqsec + rel + foot


def thanks(c):
    return thanks_body(c["dir"], c["lang"], c["th_title"], c["th_h"], c["th_lead"], c["th_steps"], c["th_wa"], c["th_wamsg"], c["th_back"],
                       c["self"], GA, f'lp_exhibitions_{c["lang"]}', "gh_lp_thanks_exh")


for key in ("ar", "en"):
    c = T[key]
    open(os.path.join(OUT, c["self"]), "w", encoding="utf-8").write(build(c))
    open(os.path.join(OUT, c["thanks"]), "w", encoding="utf-8").write(thanks(c))
print("ok")
