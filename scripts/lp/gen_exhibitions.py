#!/usr/bin/env python3
"""Generates lp/exhibitions.html, exhibitions-en.html, thanks-exhibitions.html, thanks-exhibitions-en.html (preview)."""
import sys, os, subprocess
from urllib.parse import quote

OUT = sys.argv[1]  # .../GraphicsHouse/lp
WA = "966502786513"
YT = "H66KNP1sQCk"
WA_PATH = ("M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z")
WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><use href="#i-wa"/></svg>'
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
TODO = lambda s: f'<span class="todo">TODO-OWNER: {s}</span>'
IMG = "../assets/lp/exhibitions/"

def wa(t): return f"https://wa.me/{WA}?text={quote(t)}"
def dims(rel):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", os.path.join(OUT, rel)], capture_output=True, text=True).stdout.strip()
    return out.split("x")[:2]
def img(rel, alt, lazy=True, high=False):
    w, h = dims(rel)
    extra = ' loading="lazy"' if lazy else ''
    if high:
        extra += ' fetchpriority="high"'
    return f'<img src="{rel}" alt="{alt}" width="{w}" height="{h}"{extra} decoding="async">'

T = {
"ar": dict(
    lang="ar", dir="rtl", self="exhibitions.html", other="exhibitions-en.html", thanks="thanks-exhibitions.html",
    title="تجربة المعرض الذكية: جناح يبيع، لا يعرض فقط | Graphics House",
    desc="تجربة معرض ذكية للمطورين والجهات: مجسم ذكي وشاشات تفاعلية وحائط صور تذكارية، من الهوية والتصميم إلى التنفيذ. احجز مفهوم جناحك.",
    subject="Graphics House: طلب مفهوم جناح (تجربة المعرض الذكية)", msg="طلب من صفحة تجربة المعرض الذكية",
    cta="احجز مفهوم جناحك", wa_label="واتساب", wa_msg="السلام عليكم، أريد مفهوم جناح لمعرض قادم",
    eyebrow="تجربة المعرض الذكية · للمطورين والجهات",
    h1='جناح <span class="gold">يبيع</span>، لا يعرض فقط',
    lead="حوّل زوار جناحك إلى بيانات ومبيعات: مجسم ذكي وشاشات تفاعلية وحائط صور تذكارية، من الهوية والتصميم إلى التنفيذ، من فريق واحد.",
    micro="نرد على طلبك خلال 24 ساعة", watch="شاهد الفيلم",
    hero_alt="مجسم ذكي دائري مضاء أنتجته Graphics House للملتقى الرمضاني لرابطة العالم الإسلامي",
    proof=[("<bdi dir=\"ltr\">+5,000</bdi>", "زائر للجناح"), ("4", "وحدات تفاعلية في جناح واحد"), ("1", "فريق من الهوية إلى التشغيل")],
    proof_todo=[],
    proof_logo_lead="من أعمالنا",
    why_eyebrow="المشكلة", why_h="معظم الأجنحة تعرض، ثم ينتهي المعرض بلا شيء",
    why=[("زوار كثيرون، بيانات قليلة", "يمر آلاف الزوار ويغادرون دون أثر. لا أسماء ولا أرقام ولا متابعة بعد المعرض."),
         ("وقت إقناع طويل", "المندوب يشرح المشروع شفهيًا لكل زائر، والمشروع لم يُبنَ بعد."),
         ("لا قياس للنتيجة", "تنتهي الأيام الأربعة ولا تعرف ما الذي نجح وما الذي يستحق الاستثمار في المعرض القادم.")],
    path_eyebrow="المسار الكامل", path_h="من الهوية إلى تقرير ما بعد المعرض",
    path=[("الهوية", "هوية الجناح ورسالته."), ("التصميم", "تصور الجناح وتجربة الزائر."), ("الديكور والتنفيذ", "تنفيذ الجناح في الموقع."),
          ("المجسم الذكي والشاشات", "مجسم مضاء تتحكم به شاشة لمس."), ("أدوات التسويق", "مواد الجناح ومحتواه."), ("بيانات الزوار والتقرير", "بموافقة الزائر، وتقرير بعد المعرض.")],
    path_todo="",
    mods_eyebrow="الوحدات", mods_h="ثلاث وحدات تحوّل الزائر إلى عميل محتمل",
    mods=[("عارض المشاريع", "مجسم معماري ذكي بإضاءة متحركة، تتحكم به شاشة لمس تعرض تفاصيل كل مشروع. يختصر وقت الإقناع: الزائر يرى ويختار بنفسه.", "booth-projects-viewer.webp", "عارض المشاريع في الملتقى الرمضاني: المجسم الذكي وشاشة العرض ولوحة التحكم"),
          ("عارض الأخبار والإنجازات", "شاشة تفاعلية تعرض أخبار الجهة ومبادراتها وإنجازاتها، يتصفحها الزائر بنفسه.", "booth-news-screen.webp", "شاشة الأخبار والإنجازات في الملتقى الرمضاني والزوار يتصفحونها"),
          ("حائط الصور التذكارية", "شاشة تصوير بإطارات مخصصة للمعرض، يلتقط الزائر صورته ويشاركها فورًا. في جناحك يمكن ربطه برمز QR ونموذج موافقة لالتقاط بيانات الزائر.", "booth-photo-wall.webp", "زوار الملتقى الرمضاني أمام شاشات الجناح، ومنها شاشة الصور التذكارية")],
    mods_todo="",
    case_eyebrow="دراسة الحالة", case_h="الملتقى الرمضاني لرابطة العالم الإسلامي في هيلتون جدة",
    case_name_todo="الاسم الرسمي للمعرض (الصفحة تقول «معرض الإنسانية» ويوتيوب يقول «المعرض الرمضاني»)",
    case_p="تجربة تفاعلية متكاملة من التصميم إلى التنفيذ.",
    case_gives="ما سلّمنا",
    case_items=["تصميم وتنفيذ الديكور الداخلي", "مجسم معماري تفاعلي ذكي لمشاريع الرابطة حول العالم، بإضاءة متحركة", "برنامج تشغيلي على شاشة اللمس يتحكم في المجسم ويعرض تفاصيل المشاريع", "برنامج تفاعلي لأخبار الرابطة حول العالم", "برنامج تصوير تذكاري بإطارات مخصصة للفعالية"],
    case_link="اقرأ دراسة الحالة كاملة",
    crowd_alt="زوار الملتقى الرمضاني حول المجسم الذكي",
    gal=[("forum-crowd-01.webp", "زوار الملتقى الرمضاني في الجناح", "زوار الملتقى في الجناح"), ("forum-crowd-02.webp", "الجناح وشاشاته أثناء الملتقى الرمضاني", "الجناح أثناء الملتقى"), ("smart-model-night.webp", "المجسم الذكي مضاءً", "المجسم الذكي مضاءً"), ("smart-model-workshop.webp", "المجسم في الورشة قبل التركيب", "في الورشة قبل التركيب"),
         ("model-detail-01.webp", "تفاصيل مبنى في المجسم", "تفاصيل المجسم (1)"), ("model-detail-02.webp", "تفاصيل مسجد في المجسم", "تفاصيل المجسم (2)")],
    tiers_eyebrow="المستويات", tiers_h="ثلاثة مستويات، والسعر بعد الجلسة",
    tiers=[("مفهوم جناح", "تبدأ به قبل أي التزام.", ["تصور الجناح وتجربة الزائر", "الوحدات التفاعلية المقترحة لجناحك", "خطة التنفيذ والجدول الزمني"]),
           ("جناح كامل", "جناح جاهز من التصميم إلى التشغيل.", ["كل ما في مفهوم الجناح", "تصميم وتنفيذ الديكور", "مجسم ذكي وشاشات تفاعلية", "حائط الصور التذكارية"]),
           ("إطلاق متكامل", "للمشاريع التي تُطلق في المعرض.", ["كل ما في الجناح الكامل", "هوية المشروع وأدوات التسويق", "بيانات الزوار بموافقتهم", "تقرير ما بعد المعرض"])],
    tier_tag="الأنسب للمعارض الكبرى",
    steps_eyebrow="الخطوات", steps_h="من الجلسة إلى يوم الافتتاح",
    steps=[("جلسة المفهوم", "نفهم المعرض والمساحة والهدف."), ("التصميم", "تصور الجناح والوحدات، تعتمده قبل الإنتاج."), ("الإنتاج", "المجسم والبرمجيات والديكور بالتوازي."), ("التركيب والتشغيل", "نركّب ونشغّل ونختبر قبل الافتتاح.")],
    deadline_h="تستعد لسيتي سكيب (فبراير 2027)؟",
    deadline_p="قرارات الأجنحة تُتخذ الآن. احجز جلسة المفهوم مبكرًا لنضمن وقت الإنتاج.",
    deadline_todo="",
    faq_eyebrow="أسئلة شائعة", faq_h="قبل أن تبدأ",
    faq=[("كيف تتعاملون مع خصوصية الزوار؟", "لا تُجمع بيانات الزائر إلا بموافقته الصريحة على الشاشة أو النموذج، ولا تُنشر صور الزوار إلا بموافقتهم.", ""),
         ("ماذا تحتاجون منا؟", "مساحة الجناح ومخططه من المنظم، وهوية الجهة، والمشاريع أو المحتوى الذي تريد عرضه، وموعد المعرض.", ""),
         ("كيف يُحدد السعر؟", "حسب مساحة الجناح والوحدات المختارة. يصلك العرض بعد جلسة المفهوم، قبل أي التزام.", "")],
    form_eyebrow="ابدأ الآن", form_h="احجز مفهوم جناحك", form_lead="أخبرنا بالمعرض والمساحة، ونرد خلال 24 ساعة.",
    nexts=[("نرد خلال 24 ساعة", "نتواصل معك لتحديد جلسة المفهوم."), ("جلسة المفهوم", "نفهم المعرض والمساحة والهدف."), ("المفهوم والعرض", "يصلانك قبل أي التزام.")],
    f_name="الاسم *", f_company="الشركة / الجهة *", f_phone="واتساب *", f_exh="اسم المعرض وتاريخه *", f_exh_ph="مثال: سيتي سكيب، فبراير 2027",
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
    title="Smart Exhibition Experience: a booth that sells | Graphics House",
    desc="A smart exhibition experience for developers and institutions: a smart maquette, interactive screens and a photo wall, from identity and design to delivery. Book your booth concept.",
    subject="Graphics House: booth concept request (smart exhibition experience)", msg="Request from the smart exhibition experience page",
    cta="Book your booth concept", wa_label="WhatsApp", wa_msg="Hello, I would like a booth concept for an upcoming exhibition",
    eyebrow="Smart exhibition experience · for developers and institutions",
    h1='A booth that <span class="gold">sells</span>, not just shows',
    lead="Turn your booth visitors into data and sales: a smart maquette, interactive screens and a photo wall, from identity and design to delivery, by one team.",
    micro="We reply within 24 hours", watch="Watch the film",
    hero_alt="Lit circular smart maquette produced by Graphics House for the Muslim World League Ramadan Forum",
    proof=[("5,000+", "booth visitors"), ("4", "interactive units in one booth"), ("1", "team from identity to operation")],
    proof_todo=[],
    proof_logo_lead="From our work",
    why_eyebrow="The problem", why_h="Most booths show, then the exhibition ends with nothing",
    why=[("Many visitors, little data", "Thousands walk by and leave without a trace. No names, no numbers, no follow-up."),
         ("Long time to persuade", "Sales staff explain the project verbally to every visitor, and it is not built yet."),
         ("No way to measure results", "The four days end and you do not know what worked or what deserves budget next time.")],
    path_eyebrow="The full path", path_h="From identity to the post-exhibition report",
    path=[("Identity", "Booth identity and message."), ("Design", "Booth concept and visitor journey."), ("Fit-out and build", "Building the booth on site."),
          ("Smart maquette and screens", "A lit maquette driven by a touch screen."), ("Marketing tools", "Booth materials and content."), ("Visitor data and report", "With visitor consent, plus a post-show report.")],
    path_todo="",
    mods_eyebrow="The units", mods_h="Three units that turn a visitor into a lead",
    mods=[("Project viewer", "A smart architectural maquette with dynamic lighting, driven by a touch screen that shows each project's details. It shortens persuasion: visitors see and choose for themselves.", "booth-projects-viewer.webp", "Project viewer at the Ramadan Forum: the smart maquette, display screen and control panel"),
          ("News and achievements viewer", "An interactive screen with the organisation's news, initiatives and achievements, browsed by the visitor.", "booth-news-screen.webp", "News and achievements screen at the Ramadan Forum, browsed by visitors"),
          ("Commemorative photo wall", "A photo screen with custom exhibition frames; visitors take their photo and share it instantly. In your booth it can be linked to a QR code and consent form to capture visitor data.", "booth-photo-wall.webp", "Ramadan Forum visitors in front of the booth screens, including the photo wall screen")],
    mods_todo="",
    case_eyebrow="Case study", case_h="Muslim World League Ramadan Forum at Hilton Jeddah",
    case_name_todo="official exhibition name (the page says 'Humanity Exhibition', YouTube says 'Ramadan Exhibition')",
    case_p="A complete interactive experience from design to delivery.",
    case_gives="What we delivered",
    case_items=["Interior design and fit-out", "An interactive smart maquette of the League's projects worldwide, with dynamic lighting", "An operating program on a touch screen that drives the maquette and shows project details", "An interactive program for League news around the world", "A commemorative photo program with custom event frames"],
    case_link="Read the full case study",
    crowd_alt="Ramadan Forum visitors around the smart maquette",
    gal=[("forum-crowd-01.webp", "Ramadan Forum visitors at the booth", "Visitors at the booth"), ("forum-crowd-02.webp", "The booth and its screens during the Ramadan Forum", "The booth during the forum"), ("smart-model-night.webp", "The smart maquette lit", "The smart maquette lit"), ("smart-model-workshop.webp", "The maquette in the workshop before installation", "In the workshop"),
         ("model-detail-01.webp", "Building detail in the maquette", "Maquette detail (1)"), ("model-detail-02.webp", "Mosque detail in the maquette", "Maquette detail (2)")],
    tiers_eyebrow="Levels", tiers_h="Three levels, priced after the session",
    tiers=[("Booth concept", "Start here before any commitment.", ["Booth concept and visitor journey", "Interactive units proposed for your booth", "Delivery plan and timeline"]),
           ("Full booth", "A ready booth from design to operation.", ["Everything in the booth concept", "Fit-out design and build", "Smart maquette and interactive screens", "Commemorative photo wall"]),
           ("Full launch", "For projects launched at the exhibition.", ["Everything in the full booth", "Project identity and marketing tools", "Visitor data with consent", "Post-exhibition report"])],
    tier_tag="Best for major exhibitions",
    steps_eyebrow="The steps", steps_h="From the session to opening day",
    steps=[("Concept session", "We understand the exhibition, space and goal."), ("Design", "Booth and units concept, approved before production."), ("Production", "Maquette, software and fit-out in parallel."), ("Install and run", "We install, run and test before opening.")],
    deadline_h="Preparing for Cityscape (February 2027)?",
    deadline_p="Booth decisions are being made now. Book the concept session early to secure production time.",
    deadline_todo="",
    faq_eyebrow="FAQ", faq_h="Before you start",
    faq=[("How do you handle visitor privacy?", "Visitor data is collected only with explicit consent on the screen or form, and visitor photos are not published without consent.", ""),
         ("What do you need from us?", "The booth space and plan from the organiser, your identity, the projects or content to show, and the exhibition date.", ""),
         ("How is the price set?", "By booth size and the units you choose. You receive the offer after the concept session, before any commitment.", "")],
    form_eyebrow="Start now", form_h="Book your booth concept", form_lead="Tell us the exhibition and space, and we reply within 24 hours.",
    nexts=[("We reply within 24 hours", "We contact you to set the concept session."), ("Concept session", "We understand the exhibition, space and goal."), ("Concept and offer", "Both reach you before any commitment.")],
    f_name="Name *", f_company="Company / organisation *", f_phone="WhatsApp *", f_exh="Exhibition name and date *", f_exh_ph="e.g. Cityscape, February 2027",
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

GA = ("<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-NKM4H1FFBL\"></script>\n"
      "<script>if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){window['ga-disable-G-NKM4H1FFBL']=true;window['ga-disable-G-Y67JVE898Z']=true;}"
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-NKM4H1FFBL');gtag('config','G-Y67JVE898Z');</script>\n")
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">\n')
CSS = '<link rel="stylesheet" href="lp.css?v=3">\n<link rel="stylesheet" href="lp-v2.css?v=4">\n<link rel="stylesheet" href="lp-exh.css?v=4">\n'
SYM = f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wa" viewBox="0 0 24 24"><path d="{WA_PATH}"/></symbol></svg>\n'


def build(c):
    L = c["lang"]; ar = L == "ar"
    head = (f'<!DOCTYPE html>\n<html lang="{L}" dir="{c["dir"]}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            f'<title>{c["title"]}</title>\n<meta name="description" content="{c["desc"]}">\n<meta name="robots" content="noindex,nofollow">\n'
            f'<link rel="canonical" href="https://3dgraphicshouse.com/lp/{c["self"]}">\n'
            f'<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/lp/exhibitions.html">\n<link rel="alternate" hreflang="en" href="https://3dgraphicshouse.com/lp/exhibitions-en.html">\n'
            f'<meta property="og:title" content="{c["title"]}">\n<meta property="og:description" content="{c["desc"]}">\n'
            f'<meta property="og:image" content="https://3dgraphicshouse.com/assets/lp/exhibitions/smart-model-night.webp">\n<meta property="og:type" content="website">\n'
            f'<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">\n{FONTS}'
            f'<script src="../assets/gh-forms-config.js?v=2"></script>\n{GA}<script defer src="../assets/gh-analytics.js?v=3"></script>\n'
            f'<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. IDs are added by the owner after approval; see lp-v2.js (GH_ADS). -->\n'
            f'{CSS}<link rel="preload" as="image" href="{IMG}smart-model-night.webp">\n</head>\n')
    body = (f'<body data-page="lp_exhibitions_{L}" data-service="Exhibitions" data-form="lp_exhibitions" data-thanks="{c["thanks"]}" '
            f'data-subject="{c["subject"]}" data-msg="{c["msg"]}" data-interest="{"تجربة المعرض الذكية" if ar else "Smart exhibition experience"}">\n{SYM}')
    lang_sw = (f'<div class="lang"><a href="{c["other"]}">EN</a><span>|</span><a href="{c["self"]}" class="on">AR</a></div>' if ar else
               f'<div class="lang"><a href="{c["self"]}" class="on">EN</a><span>|</span><a href="{c["other"]}">AR</a></div>')
    header = (f'<header class="hdr"><div class="wrap"><img src="../assets/logo-gold.png" alt="Graphics House" width="732" height="344">'
              f'<div class="hdr-r">{lang_sw}<a class="btn btn-gold btn-sm" href="#request" data-cta="header">{c["cta"]}</a></div></div></header>\n<main>\n')

    hero_img = img(IMG + "smart-model-night.webp", c["hero_alt"], lazy=False, high=True)
    hero = (f'<section class="hero v2 exh-hero" style="padding:0"><picture>{hero_img}</picture>'
            f'<div class="wrap"><p class="eyebrow">{c["eyebrow"]}</p><h1>{c["h1"]}</h1><p class="lead">{c["lead"]}</p>'
            f'<div class="cta-row"><a class="btn btn-gold" href="#request" data-cta="hero-primary">{c["cta"]}</a>'
            f'<button type="button" class="btn btn-ghost film-btn" data-yt="{YT}" data-cta="hero-film"><b hidden>{c["case_h"]}</b>{PLAY} {c["watch"]}</button></div>'
            f'<p class="micro">{c["micro"]} · <a href="{wa(c["wa_msg"])}" target="_blank" rel="noopener" data-cta="hero-whatsapp">{c["wa_label"]}</a></p></div></section>\n')

    stats = "".join(f"<div><b>{n}</b>{t}</div>" for n, t in c["proof"])
    stats_todo = "".join(f'<div><b>{n}</b>{t} {TODO(k)}</div>' for n, t, k in c["proof_todo"])
    proof = (f'<div class="proof"><div class="wrap"><div class="proof-top">{stats}{stats_todo}</div>'
             f'<div class="exh-logo"><span>{c["proof_logo_lead"]}</span><img src="../assets/clients-logo/رابطة العالم الاسلامي.png" alt="{"رابطة العالم الإسلامي" if ar else "Muslim World League"}" loading="lazy"></div></div></div>\n')

    why = "".join(f'<div class="card"><div class="num">{i}</div><h3>{h}</h3><p>{p}</p></div>' for i, (h, p) in enumerate(c["why"], 1))
    whysec = (f'<section><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["why_eyebrow"]}</p><h2>{c["why_h"]}</h2></div>'
              f'<div class="grid g3">{why}</div></div></section>\n')

    path = "".join(f'<li><span class="pn">{i}</span><b>{h}</b><small>{p}</small></li>' for i, (h, p) in enumerate(c["path"], 1))
    pathsec = (f'<section class="dark"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["path_eyebrow"]}</p><h2>{c["path_h"]}</h2></div>'
               f'<ol class="path">{path}</ol>' + (f'<p class="center" style="margin-top:18px">{TODO(c["path_todo"])}</p>' if c["path_todo"] else '') + '</div></section>\n')

    mods = ""
    for i, (h, p, im, alt) in enumerate(c["mods"], 1):
        media = (f'<div class="mod-media">{img(IMG + im, alt)}</div>' if im else
                 '<div class="mod-media mod-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
                 '<rect x="7" y="9" width="34" height="26" rx="3"/><circle cx="24" cy="22" r="7"/><path d="M17 41h14M24 35v6"/><path d="M33 14h3"/></svg></div>')
        extra = f' {TODO(c["mods_todo"])}' if (not im and c["mods_todo"]) else ""
        mods += f'<div class="mod">{media}<div class="mod-b"><span class="mod-n">0{i}</span><h3>{h}</h3><p>{p}{extra}</p></div></div>'
    modsec = (f'<section class="alt" id="units"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["mods_eyebrow"]}</p><h2>{c["mods_h"]}</h2></div>'
              f'<div class="mods">{mods}</div></div></section>\n')

    items = "".join(f"<li>{x}</li>" for x in c["case_items"])
    gal = "".join(f'<figure tabindex="0" data-full="{IMG}{f}">{img(IMG + f, a)}<figcaption>{cap}</figcaption></figure>' for f, a, cap in c["gal"])
    case = (f'<section class="dark" id="case"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["case_eyebrow"]}</p><h2>{c["case_h"]}</h2>'
            f'<p class="lead">{c["case_p"]}</p></div>'
            f'<div class="case-grid"><button type="button" class="film" data-yt="{YT}" data-cta="case-film"><span class="film-th">{img(IMG + "booth-crowd-model.webp", c["crowd_alt"])}<i>{PLAY}</i></span><b>{c["case_h"]}</b><small>{c["watch"]}</small></button>'
            f'<div class="case"><p class="gives">{c["case_gives"]}</p><ul>{items}</ul><a href="../casestudy-mwl.html" target="_blank" rel="noopener">{c["case_link"]}</a></div></div>'
            f'<div class="gal g2c" style="margin-top:36px">{gal}</div></div></section>\n')

    tiers = ""
    for i, (h, sub, lis) in enumerate(c["tiers"]):
        feat = i == 1
        tag = f'<span class="pk-tag">{c["tier_tag"]}</span>' if feat else ""
        cls = "pk feat" if feat else "pk"
        tiers += (f'<div class="{cls}">{tag}'
                  f'<p class="pk-n">0{i+1}</p><h3>{h}</h3><p class="pk-for">{sub}</p><ul>{"".join(f"<li>{x}</li>" for x in lis)}</ul>'
                  f'<a class="btn {"btn-gold" if feat else "btn-line"}" href="#request" data-cta="tier-{i+1}">{c["cta"]}</a></div>')
    tiersec = (f'<section id="levels"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["tiers_eyebrow"]}</p><h2>{c["tiers_h"]}</h2></div>'
               f'<div class="pkgs">{tiers}</div></div></section>\n')

    steps = "".join(f'<div class="card"><div class="num">{i}</div><h3>{h}</h3><p>{p}</p></div>' for i, (h, p) in enumerate(c["steps"], 1))
    stepsec = (f'<section class="alt"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["steps_eyebrow"]}</p><h2>{c["steps_h"]}</h2></div>'
               f'<div class="steps">{steps}</div>'
               f'<div class="deadline"><div><h3>{c["deadline_h"]}</h3><p>{c["deadline_p"]}{(" " + TODO(c["deadline_todo"])) if c["deadline_todo"] else ""}</p></div>'
               f'<a class="btn btn-gold" href="#request" data-cta="deadline">{c["cta"]}</a></div></div></section>\n')

    faq = "".join(f"<details><summary>{q}</summary><p>{a} {t}</p></details>" for q, a, t in c["faq"])
    faqsec = (f'<section><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["faq_eyebrow"]}</p><h2>{c["faq_h"]}</h2></div>'
              f'<div class="faqw">{faq}</div></div></section>\n')

    nexts = "".join(f'<li><div class="num">{i}</div><div><b>{b}</b><p>{p}</p></div></li>' for i, (b, p) in enumerate(c["nexts"], 1))
    areas = "".join(f"<option>{t}</option>" for t in c["areas"])
    attrs = "".join(f'<input type="hidden" name="{k}" data-attr="{k}">' for k in ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ttclid", "ScCid"])
    form = (f'<section class="formsec" id="request"><div class="wrap fgrid"><div><p class="eyebrow">{c["form_eyebrow"]}</p><h2>{c["form_h"]}</h2>'
            f'<p class="lead">{c["form_lead"]}</p><ul class="next-list">{nexts}</ul>'
            f'<a class="btn btn-ghost" style="margin-top:22px" href="{wa(c["wa_msg"])}" target="_blank" rel="noopener" data-cta="form-whatsapp">{WA_ICON} {c["wa_label"]}</a></div>'
            f'<form id="lpFormV2" class="v2" novalidate>'
            f'<div class="f"><label for="n">{c["f_name"]}</label><input id="n" name="name" autocomplete="name" required></div>'
            f'<div class="f"><label for="c">{c["f_company"]}</label><input id="c" name="company" autocomplete="organization" required></div>'
            f'<div class="f full"><label for="p">{c["f_phone"]}</label><input id="p" name="phone" type="tel" inputmode="tel" autocomplete="tel" required></div>'
            f'<div class="f full"><label for="x">{c["f_exh"]}</label><input id="x" name="exhibition" data-label="{c["f_exh"].rstrip(" *")}" placeholder="{c["f_exh_ph"]}" required></div>'
            f'<div class="f full"><label for="a">{c["f_area"]}</label><!-- {c["area_todo"]} -->\n'
            f'<select id="a" name="booth_size" data-label="{c["f_area"].rstrip(" *")}" required><option value="" selected disabled>{c["f_sel"]}</option>{areas}</select></div>'
            f'{attrs}<div class="hp" aria-hidden="true"><label>Leave blank</label><input type="text" name="botcheck" tabindex="-1" autocomplete="off"></div>'
            f'<div class="f full"><div id="ts" style="min-height:65px"></div></div><div id="fb" aria-live="polite"></div>'
            f'<div class="f full"><button class="btn btn-gold" type="submit" id="sb" data-cta="form-submit">{c["cta"]}</button></div>'
            f'<p class="note">{c["privacy"]}</p></form></div></section>\n</main>\n')

    foot = (f'<footer><div class="wrap">© 2026 Graphics House Co. · <a href="{c["priv_href"]}" target="_blank" rel="noopener">{c["priv_txt"]}</a></div></footer>\n'
            f'<a class="wa" href="{wa(c["wa_msg"])}" target="_blank" rel="noopener" aria-label="WhatsApp" data-cta="float-whatsapp">{WA_ICON}</a>\n'
            f'<div class="mbar"><a class="btn btn-gold" href="#request" data-cta="mbar-primary">{c["cta"]}</a>'
            f'<a class="btn btn-ghost" href="{wa(c["wa_msg"])}" target="_blank" rel="noopener" data-cta="mbar-whatsapp">{c["wa_label"]}</a></div>\n'
            f'<div class="lb" id="lb" role="dialog" aria-modal="true"><button type="button" aria-label="{c["close"]}">&times;</button><img alt=""><div class="lb-v"></div><p></p></div>\n'
            f'<script src="lp.js?v=3"></script>\n<script src="lp-v2.js?v=4"></script>\n</body>\n</html>\n')
    return head + body + header + hero + proof + whysec + pathsec + modsec + case + tiersec + stepsec + faqsec + form + foot


def thanks(c):
    L = c["lang"]
    nexts = "".join(f'<li><div class="num">{i}</div><div><b>{b}</b><p>{p}</p></div></li>' for i, (b, p) in enumerate(c["th_steps"], 1))
    return (f'<!DOCTYPE html>\n<html lang="{L}" dir="{c["dir"]}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            f'<title>{c["th_title"]}</title>\n<meta name="robots" content="noindex,nofollow">\n<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">\n'
            f'{FONTS}{GA}<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. Fire the lead event here once the owner adds the IDs. -->\n{CSS}</head>\n<body>\n{SYM}'
            f'<main class="thanks"><div class="wrap"><div class="tick"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>'
            f'<h1>{c["th_h"]}</h1><p class="lead">{c["th_lead"]}</p><ul class="next-list">{nexts}</ul>'
            f'<a class="btn btn-gold" href="{wa(c["th_wamsg"])}" target="_blank" rel="noopener" data-cta="thanks-whatsapp">{WA_ICON} {c["th_wa"]}</a>'
            f'<a class="back" href="{c["self"]}">{c["th_back"]}</a></div></main>\n'
            "<script>\n(function(){\n  var KEYS=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','ttclid','ScCid'];\n"
            f"  var q=new URLSearchParams(location.search), p={{page:'lp_exhibitions_{L}',lang:'{L}'}};\n"
            "  KEYS.forEach(function(k){if(q.get(k))p[k]=q.get(k);});\n"
            "  try{ if(sessionStorage.getItem('gh_lp_thanks_exh'))return; sessionStorage.setItem('gh_lp_thanks_exh','1'); }catch(e){}\n"
            "  try{ if(window.gtag)window.gtag('event','lp_thank_you',p); window.dataLayer=window.dataLayer||[]; window.dataLayer.push({event:'lp_conversion',lp:p}); }catch(e){}\n"
            "})();\n</script>\n</body>\n</html>\n")


for key in ("ar", "en"):
    c = T[key]
    open(os.path.join(OUT, c["self"]), "w", encoding="utf-8").write(build(c))
    open(os.path.join(OUT, c["thanks"]), "w", encoding="utf-8").write(thanks(c))
print("ok")
