#!/usr/bin/env python3
"""Production LP v4 (owner direction 2026-11-17): split hero, real upgraded materials, zero generated images.

Generates lp/production.html, production-en.html, thanks.html, thanks-en.html.
Run: python3 scripts/lp/gen_production.py lp
Hero A/B: the page shows variant A (new launch film); add ?hero=b to show variant B (GH demo reel). See lp-v4.js.
"""
import sys, os, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icons_lp import sprite, ic, write_files
from urllib.parse import quote

OUT = sys.argv[1]  # .../GraphicsHouse/lp
WA = "966502786513"
V3 = "../assets/lp-v3/"
FILM = V3 + "gh-launch-film-720.mp4"      # hero card (desktop)
FILM_M = V3 + "gh-launch-film-360.mp4"    # hero card (mobile)
FILM_FULL = V3 + "gh-launch-film-1080.mp4" # full view in the lightbox
FILM_POSTER = V3 + "gh-launch-film-poster-1280.webp"
REEL = "../assets/videos/GH-demo-reel-2025.mp4"
REEL_M = "../assets/videos/GH-demo-reel-2025-mobile.mp4"
REEL_POSTER = "../assets/videos/GH-demo-reel-2025-poster.jpg"

WA_PATH = ("M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z")
WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><use href="#i-wa"/></svg>'
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
TODO = '<span class="todo">TODO-OWNER</span>'

def wa(text):
    return f"https://wa.me/{WA}?text={quote(text)}"

def dims(rel):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x",
                          os.path.join(OUT, rel)], capture_output=True, text=True).stdout.strip()
    w, h = out.split("x")[:2]
    return w, h

LOGOS = [("رابطة العالم الاسلامي.png", "Muslim World League"), ("al-owla.png", "Al Oula"), ("rafal.png", "Rafal"),
         ("makyon.png", "Makyon"), ("bn-zooma.png", "Bin Zoma"), ("aqarat.png", "Aqarat"),
         ("khatib-alami.png", "Khatib and Alami"), ("hilton.png", "Hilton")]
logos_html = "".join(f'<img src="../assets/clients-logo/{quote(f)}" alt="{a}" loading="lazy" decoding="async">' for f, a in LOGOS)

# six works: real, upscaled (assets/lp-v3), each captioned with project and client/city
WORKS = ["naseem-aerial", "wahat-cam-12", "albayan-01", "wahat-cam-30-1", "alowla-nakheel-03", "wahat-cam-21-shops"]

T = {
"ar": dict(
    lang="ar", dir="rtl", other="production-en.html", self="production.html", thanks="thanks.html",
    title="فيلم الإطلاق وCGI للمطورين العقاريين | Graphics House",
    desc="فيلم إطلاق ولقطات CGI لمشاريع المطورين العقاريين: قصة إطلاق واحدة تُعرض في صالة المبيعات والموقع وأمام المستثمرين. احصل على عرض خلال 24 ساعة.",
    og_alt="منظور جوي لمشروع نسيم الحرم في مكة المكرمة",
    subject="Graphics House: طلب عرض (فيلم إطلاق وإنتاج)", msg="طلب عرض من صفحة فيلم الإطلاق وCGI",
    cta="احصل على عرض خلال 24 ساعة", cta_short="احصل على عرض خلال 24 ساعة", wa_label="واتساب",
    wa_hero="السلام عليكم، أريد عرضًا لفيلم إطلاق مشروعي",
    wa_quick="السلام عليكم، أريد عرضًا لفيلم إطلاق مشروعي.",
    wa_small="أو راسلنا على واتساب",
    eyebrow="فيلم إطلاق وCGI للمطورين العقاريين",
    h1='أطلق مشروعك بفيلم <span class="gold">يبيع الوحدات</span>، لا يكتفي بعرضها',
    lead="فيلم إطلاق ولقطات CGI لمشروعك قبل اكتماله، من فريق واحد، لتعرضه على المشترين والمستثمرين من اليوم الأول.",
    micro="نرد على طلبك خلال 24 ساعة",
    vid_a="فيلم إطلاق من مشاريع حقيقية: نسيم الحرم وواحة السلام وجامعة البيان",
    vid_b="ريل أعمال Graphics House: مشاريع عقارية سعودية بتقنية CGI",
    btn_a="شاهد ريل الأعمال كاملًا", btn_b="شاهد فيلم الإطلاق",
    cap_a="من أعمالنا: نسيم الحرم، واحة السلام، جامعة البيان", cap_b="ريل أعمال Graphics House",
    logos_lead="يثق بنا مطورون ومؤسسات في السعودية والخليج",
    owner_claims_note="OWNER-UNVERIFIED: «+15 سنة» و«4 مكاتب». لا تُظهر حتى يؤكدها المالك.",
    prob_eyebrow="لماذا لا يبيع الإطلاق", prob_h="المشتري يقرر من أمام الشاشة والمجسم",
    prob_lead="في المشاريع على الخارطة يحكم المشتري والمستثمر على المشروع من المواد البصرية وحدها.",
    prob_img=("../assets/lp/exhibitions/booth-crowd-model.webp", "زوار حول المجسم الذكي في جناح رابطة العالم الإسلامي بهيلتون جدة",
              "من أعمالنا: المجسم الذكي في الملتقى الرمضاني لرابطة العالم الإسلامي، هيلتون جدة"),
    probs=[("مواد متفرقة بلا قصة", "فيلم من جهة وصور من أخرى ورندر من ثالثة. المشتري يرى مشروعًا عاديًا، حتى لو لم يكن كذلك.", "قصة إطلاق واحدة: فيلم رئيسي ولقطات CGI ومقاطع قصيرة بهوية موحدة."),
           ("المشروع لم يُبنَ بعد", "لا يوجد ما يُرى في الموقع، والمشتري يريد أن يرى النتيجة النهائية لا الأرض.", "لقطات CGI سينمائية للمشروع كاملًا، مع مشاهد حقيقية للموقع والمحيط."),
           ("مواد تصلح للعرض لا للبيع", "ما صُنع للتوثيق لا يخدم صالة المبيعات ولا اجتماع المستثمرين ولا الإعلان.", "نبني الفيلم حول مكان استخدامه: صالة المبيعات، عرض المستثمرين، الموقع، والسوشيال.")],
    fixlbl="ما نفعله:",
    svc_eyebrow="الخدمة والأعمال", offer_tag="خدمة الإطلاق", offer_h="فيلم الإطلاق وCGI",
    offer_sub="منظومة إطلاق بصرية لمشروعك: فيلم يبيع المشروع في صالة المبيعات والموقع والإعلان وعروض المستثمرين.",
    offer_items=["قصة الإطلاق: سيناريو وقائمة لقطات تعتمدها قبل الإنتاج", "فيلم رئيسي للإطلاق وصالة المبيعات والموقع", "لقطات CGI سينمائية للمشروع قبل اكتماله", "مقاطع قصيرة للريلز والستوري والإعلانات", "نصوص على الشاشة بالعربية والإنجليزية"],
    for_h="مناسب لـ", for_p="مطورين عقاريين لمشاريع متوسطة فأعلى: إطلاق مشروع، حملة إعلانية، عرض على المستثمرين.",
    prep_h="ما نحتاجه منك", prep_p="مخططات المشروع وهويته، وموعد الإطلاق، وأماكن استخدام المواد، وموقع المشروع للمشاهد الحقيقية.",
    price_note="شريط السعر (اختياري): يظهر بعد قرار المالك فقط.",
    work_h="أعمال أنتجناها لمطورين ومؤسسات سعودية", work_lead="اضغط على الصورة لعرضها كاملة.",
    works={"naseem-aerial": ("نسيم الحرم، الراجحي · مكة المكرمة", "نسيم الحرم في مكة المكرمة: منظور جوي CGI للمشروع"),
           "wahat-cam-12": ("واحة السلام، عقارات العيسائي · الحي السكني", "واحة السلام: منظور جوي CGI للحي السكني"),
           "albayan-01": ("جامعة البيان · الحرم الجامعي", "جامعة البيان: منظور جوي CGI للحرم الجامعي"),
           "wahat-cam-30-1": ("واحة السلام، عقارات العيسائي · القناة المائية", "واحة السلام: منظور CGI للقناة المائية والشارع الرئيسي"),
           "alowla-nakheel-03": ("الأولى لتطوير النخيل · مشروع النخيل السكني", "مشروع النخيل السكني للأولى: منظور جوي CGI"),
           "wahat-cam-21-shops": ("واحة السلام، عقارات العيسائي · الواجهة التجارية", "واحة السلام: منظور CGI للواجهة التجارية من مستوى الشارع")},
    cases_eyebrow="دراسات حالة", cases_h="مشروعان من البداية إلى يوم الإطلاق",
    cases=[("ميثاق مكة، رابطة العالم الإسلامي", "الملتقى الرمضاني لرابطة العالم الإسلامي في هيلتون جدة: تجربة متكاملة من التصميم إلى التنفيذ.",
            ["تصميم وتنفيذ ديكور الجناح", "مجسم معماري تفاعلي ذكي مع برنامج تشغيلي على شاشة اللمس", "برنامج تفاعلي لأخبار الرابطة حول العالم", "برنامج تصوير تذكاري على شاشة تفاعلية"],
            "../assets/lp/exhibitions/booth-projects-viewer.webp", "عارض المشاريع: المجسم الذكي وشاشة ميثاق مكة ولوحة التحكم",
            "../insights/projects/makkah-charter-mwl.html"),
           ("نسيم الحرم، الراجحي", "مشروع سكني للراجحي في مكة المكرمة على طريق الطائف: قصة واحدة من الجو إلى داخل الوحدة، جاهزة لصالة البيع والمستثمر.",
            ["فيلم CGI سينمائي للمشروع", "مجسم معماري للعرض الحضوري", "إظهار معماري خارجي وداخلي متسق", "مواد صالة البيع"],
            V3 + "naseem-int-living-1200.webp", "نسيم الحرم: إظهار داخلي لغرفة معيشة",
            "../insights/projects/naseem-al-haram-makkah.html")],
    gives="ما سلّمنا", case_link="اقرأ دراسة الحالة",
    steps_eyebrow="كيف نعمل", steps_h="أربع خطوات من الاستشارة إلى التسليم",
    steps=[("استشارة الإطلاق", "نحدد الهدف والجمهور وأماكن استخدام المواد والموعد."), ("خطة الإنتاج", "سيناريو وقائمة لقطات وجدول، تعتمدها قبل الإنتاج."),
           ("الإنتاج", "فريقنا في الموقع حسب الجدول المعتمد، وبناء لقطات CGI بالتوازي."), ("مونتاج وتسليم", "نسخة أولى لملاحظاتك، ثم الملفات النهائية بكل المقاسات.")],
    faq_h="أسئلة شائعة",
    faq=[("هل يمكن الإطلاق قبل اكتمال البناء؟", "نعم، هذا هو الأساس. نعتمد على لقطات CGI للمشروع كاملًا، ونضيف مشاهد حقيقية للموقع والمحيط.", ""),
         ("ما حجم المشاريع التي تعملون معها؟", "نعمل مع مطورين لمشاريع متوسطة فأعلى، ونحدد في المكالمة الأولى هل نحن الأنسب لمشروعك.", TODO + " تأكيد العتبة المعتمدة لحجم المشروع"),
         ("كم يستغرق التسليم؟", "تتحدد المدة في خطة الإنتاج حسب حجم العمل، وتعرفها قبل أن تعتمد العرض.", TODO + " المدة النموذجية لفيلم الإطلاق"),
         ("لمن حقوق استخدام المواد؟", "تُكتب حقوق الاستخدام بوضوح في العرض قبل البدء.", TODO + " نص الحقوق المعتمد"),
         ("كيف يُحدد السعر؟", "حسب نطاق المشروع ومدة الفيلم وعدد لقطات CGI والمخرجات المطلوبة. يصلك العرض بعد المكالمة القصيرة.", "")],
    form_eyebrow="ابدأ الآن", form_h="احصل على عرض خلال 24 ساعة", form_lead="أخبرنا بمشروعك، ونرد خلال 24 ساعة.",
    nexts=[("نرد خلال 24 ساعة", "نتواصل معك لتحديد موعد مكالمة قصيرة."), ("نفهم مشروعك", "عن الهدف والجمهور وأماكن استخدام المواد."), ("خطة اللقطات وعرض السعر", "تصلك بعد المكالمة، قبل أي التزام.")],
    quick_h="الأسرع: واتساب برسالة جاهزة",
    quick_stage="مرحلة المشروع", stages=["قبل الإطلاق", "قيد الإنشاء", "مكتمل"],
    quick_when="الموعد", whens=["خلال شهر", "من 1 إلى 3 أشهر", "لم يتحدد بعد"],
    quick_btn="أرسل على واتساب", or_txt="أو اترك بياناتك",
    f_name="الاسم *", f_phone="واتساب *", f_company="الشركة / الجهة *", f_sel="اختر",
    f_size="حجم المشروع (عدد الوحدات أو القيمة التقريبية) *",
    sizes=["أقل من 100 وحدة أو أقل من 100 مليون ريال", "من 100 إلى 300 وحدة أو من 100 إلى 300 مليون ريال", "أكثر من 300 وحدة أو أكثر من 300 مليون ريال", "لم يُحدد بعد"],
    size_todo="TODO-OWNER: العتبة الافتراضية 100 وحدة أو 100 مليون ريال (تقدير، يعدله المالك). الحقل للفرز الداخلي: لا يُرفض أحد تلقائيًا.",
    privacy='بإرسال النموذج توافق على <a href="../privacy-policy.html" target="_blank" rel="noopener">سياسة الخصوصية</a>. نستخدم بياناتك للرد على طلبك فقط.',
),
"en": dict(
    lang="en", dir="ltr", other="production.html", self="production-en.html", thanks="thanks-en.html",
    title="Launch Film and CGI for Real Estate Developers | Graphics House",
    desc="A launch film and cinematic CGI for developers' real estate projects: one launch story for the sales gallery, the site and investors. Get an offer within 24 hours.",
    og_alt="Aerial view of the Naseem Al Haram project in Makkah",
    subject="Graphics House: offer request (launch film and production)", msg="Offer request from the launch film and CGI page",
    cta="Get an offer within 24 hours", cta_short="Get an offer in 24 hours", wa_label="WhatsApp",
    wa_hero="Hello, I would like an offer for a launch film for my project",
    wa_quick="Hello, I would like an offer for a launch film for my project.",
    wa_small="or message us on WhatsApp",
    eyebrow="Launch film and CGI for real estate developers",
    h1='Launch your project with a film that <span class="gold">sells the units</span>, not just shows them',
    lead="A launch film and CGI shots of your project before it is complete, from one team, ready for buyers and investors from day one.",
    micro="We reply within 24 hours",
    vid_a="A launch film made from real projects: Naseem Al Haram, Wahat Al Salam and Al-Bayan University",
    vid_b="Graphics House showreel: Saudi real estate projects in CGI",
    btn_a="Watch the full showreel", btn_b="Watch the launch film",
    cap_a="From our work: Naseem Al Haram, Wahat Al Salam, Al-Bayan University", cap_b="Graphics House showreel",
    logos_lead="Trusted by developers and institutions across Saudi Arabia and the Gulf",
    owner_claims_note="OWNER-UNVERIFIED: '15+ years' and '4 offices'. Do not show until the owner confirms.",
    prob_eyebrow="Why launches fail to sell", prob_h="Buyers decide in front of the screen and the model",
    prob_lead="For off-plan projects, buyers and investors judge the project by the visuals alone.",
    prob_img=("../assets/lp/exhibitions/booth-crowd-model.webp", "Visitors around the smart maquette at the Muslim World League booth, Hilton Jeddah",
              "From our work: the smart maquette at the Muslim World League Ramadan Forum, Hilton Jeddah"),
    probs=[("Scattered materials with no story", "A film from one vendor, photos from another, a render from a third. The buyer sees an ordinary project, even when it is not.", "One launch story: a main film, CGI shots and short clips with one identity."),
           ("The project is not built yet", "There is nothing to see on site, and buyers want to see the final result, not the land.", "Cinematic CGI shots of the complete project, with real scenes of the site and surroundings."),
           ("Materials built to show, not to sell", "What was made to document does not serve the sales gallery, the investor meeting or the ad.", "We build the film around where it will be used: the sales gallery, investor pitch, site and social.")],
    fixlbl="What we do:",
    svc_eyebrow="Service and work", offer_tag="Launch service", offer_h="Launch Film and CGI",
    offer_sub="A visual launch system for your project: a film that sells it in the sales gallery, on site, in ads and in investor presentations.",
    offer_items=["The launch story: a script and shot list you approve before production", "A main film for the launch, the sales gallery and the site", "Cinematic CGI shots of the project before it is complete", "Short clips for reels, stories and ads", "On-screen text in Arabic and English"],
    for_h="Best for", for_p="Developers of mid-size projects and above: a project launch, an ad campaign, an investor pitch.",
    prep_h="What we need from you", prep_p="Project plans and identity, the launch date, where the materials will be used, and the project site for real scenes.",
    price_note="Price strip (optional): shown only after the owner decides.",
    work_h="Work we produced for Saudi developers and institutions", work_lead="Click an image to see it in full.",
    works={"naseem-aerial": ("Naseem Al Haram, Al Rajhi · Makkah", "Naseem Al Haram in Makkah: CGI aerial view of the project"),
           "wahat-cam-12": ("Wahat Al Salam, Al-Issai Real Estate · neighbourhood", "Wahat Al Salam: CGI aerial view of the residential neighbourhood"),
           "albayan-01": ("Al-Bayan University · campus", "Al-Bayan University: CGI aerial view of the campus"),
           "wahat-cam-30-1": ("Wahat Al Salam, Al-Issai Real Estate · water canal", "Wahat Al Salam: CGI view of the water canal and main street"),
           "alowla-nakheel-03": ("Al Oula Development · Al Nakheel residential", "Al Oula's Al Nakheel residential project: CGI aerial view"),
           "wahat-cam-21-shops": ("Wahat Al Salam, Al-Issai Real Estate · retail frontage", "Wahat Al Salam: street-level CGI view of the retail frontage")},
    cases_eyebrow="Case studies", cases_h="Two projects from the start to launch day",
    cases=[("Makkah Charter, Muslim World League", "The Muslim World League Ramadan Forum at Hilton Jeddah: a complete experience from design to delivery.",
            ["Design and fit-out of the booth", "An interactive smart maquette with an operating program on a touch screen", "An interactive program for League news around the world", "A commemorative photo program on an interactive screen"],
            "../assets/lp/exhibitions/booth-projects-viewer.webp", "Projects viewer: the smart maquette, the Makkah Charter screen and the control panel",
            "../insights/projects/makkah-charter-mwl-en.html"),
           ("Naseem Al Haram, Al Rajhi", "A residential project for Al Rajhi in Makkah on Taif Road: one story from the sky to inside the unit, ready for the sales gallery and investors.",
            ["A cinematic CGI film of the project", "An architectural maquette for in-person display", "Consistent exterior and interior visualisation", "Sales gallery materials"],
            V3 + "naseem-int-living-1200.webp", "Naseem Al Haram: interior visualisation of a living room",
            "../insights/projects/naseem-al-haram-makkah-en.html")],
    gives="What we delivered", case_link="Read the case study",
    steps_eyebrow="How we work", steps_h="Four steps from consultation to delivery",
    steps=[("Launch consultation", "We define the goal, audience, where the materials will be used, and the date."), ("Production plan", "Script, shot list and schedule, approved by you before production."),
           ("Production", "Our team on site per the approved schedule, with CGI shots built in parallel."), ("Edit and delivery", "A first cut for your notes, then final files in every size.")],
    faq_h="FAQ",
    faq=[("Can we launch before construction is complete?", "Yes, that is the core of it. We rely on CGI shots of the complete project and add real scenes of the site and surroundings.", ""),
         ("What size of projects do you work with?", "We work with developers on mid-size projects and above, and on the first call we decide whether we are the right fit for your project.", TODO + " confirm the approved project-size threshold"),
         ("How long does delivery take?", "The timeline is set in the production plan based on the size of the work, and you know it before you approve the offer.", TODO + " typical launch film timeline"),
         ("Who owns the usage rights?", "Usage rights are written clearly in the offer before we start.", TODO + " approved rights wording"),
         ("How is the price set?", "By the project scope, film length, number of CGI shots and the outputs you need. You receive the offer after the short call.", "")],
    form_eyebrow="Start now", form_h="Get an offer within 24 hours", form_lead="Tell us about your project and we reply within 24 hours.",
    nexts=[("We reply within 24 hours", "We contact you to set a short call."), ("We understand your project", "Goal, audience and where the materials will be used."), ("Shot plan and quote", "You receive them after the call, before any commitment.")],
    quick_h="Fastest: WhatsApp with a ready message",
    quick_stage="Project stage", stages=["Pre-launch", "Under construction", "Completed"],
    quick_when="Timing", whens=["Within a month", "1 to 3 months", "Not decided yet"],
    quick_btn="Send on WhatsApp", or_txt="Or leave your details",
    f_name="Name *", f_phone="WhatsApp *", f_company="Company / organisation *", f_sel="Select",
    f_size="Project size (units or approximate value) *",
    sizes=["Under 100 units or under SAR 100M", "100 to 300 units or SAR 100M to 300M", "Over 300 units or over SAR 300M", "Not decided yet"],
    size_todo="TODO-OWNER: default threshold 100 units or SAR 100M (an estimate, adjusted by the owner). The field is for internal sorting: nobody is rejected automatically.",
    privacy='By submitting you agree to the <a href="../privacy-policy-en.html" target="_blank" rel="noopener">Privacy Policy</a>. We use your details only to respond to your request.',
),
}

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">\n')
GA = ("<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-NKM4H1FFBL\"></script>\n"
      "<script>if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){window['ga-disable-G-NKM4H1FFBL']=true;window['ga-disable-G-Y67JVE898Z']=true;}"
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-NKM4H1FFBL');gtag('config','G-Y67JVE898Z');</script>\n")
CSS = ('<link rel="stylesheet" href="lp.css?v=3">\n<link rel="stylesheet" href="lp-v2.css?v=5">\n'
       '<link rel="stylesheet" href="lp-v3.css?v=3">\n<link rel="stylesheet" href="lp-v4.css?v=1">\n')


def build(c):
    L = c["lang"]; ar = L == "ar"
    head = (f'<!DOCTYPE html>\n<html lang="{L}" dir="{c["dir"]}">\n<head>\n<meta charset="utf-8">\n'
            f'<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>{c["title"]}</title>\n'
            f'<meta name="description" content="{c["desc"]}">\n<meta name="robots" content="noindex,nofollow">\n'
            f'<link rel="canonical" href="https://3dgraphicshouse.com/lp/{c["self"]}">\n'
            f'<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/lp/production.html">\n'
            f'<link rel="alternate" hreflang="en" href="https://3dgraphicshouse.com/lp/production-en.html">\n'
            f'<meta property="og:title" content="{c["title"]}">\n<meta property="og:description" content="{c["desc"]}">\n'
            f'<meta property="og:image" content="https://3dgraphicshouse.com/assets/lp-v3/gh-launch-film-poster.jpg">\n'
            f'<meta property="og:image:alt" content="{c["og_alt"]}">\n<meta property="og:type" content="website">\n'
            f'<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">\n'
            + FONTS + '<script src="../assets/gh-forms-config.js?v=2"></script>\n' + GA
            + '<script defer src="../assets/gh-analytics.js?v=3"></script>\n'
            '<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. IDs are added by the owner after approval; see lp-v2.js (GH_ADS). -->\n'
            + CSS + f'<link rel="preload" as="image" href="{FILM_POSTER}">\n</head>\n')

    body_open = (f'<body class="live v4" data-page="lp_production_{L}" data-service="Production" data-subject="{c["subject"]}" '
                 f'data-msg="{c["msg"]}" data-interest="{c["offer_h"]}">\n'
                 f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wa" viewBox="0 0 24 24"><path d="{WA_PATH}"/></symbol></svg>\n' + sprite())

    lang_sw = (f'<div class="lang"><a href="{c["other"]}">EN</a><span>|</span><a href="{c["self"]}" class="on">AR</a></div>' if ar else
               f'<div class="lang"><a href="{c["self"]}" class="on">EN</a><span>|</span><a href="{c["other"]}">AR</a></div>')
    header = (f'<header class="hdr"><div class="wrap"><img src="../assets/lp-v3/logo-on-white.png" alt="Graphics House" width="640" height="297">'
              f'<div class="hdr-r">{lang_sw}<a class="btn btn-gold btn-sm" href="#request" data-cta="header">{c["cta_short"]}</a></div></div></header>\n')

    # 1) split hero: text first (right in RTL), 16:9 video card second. Variant A = new launch film, B = demo reel.
    hero = (f'<main>\n<section class="split-hero"><div class="wrap">'
            f'<div class="sh-text"><p class="eyebrow">{c["eyebrow"]}</p><h1>{c["h1"]}</h1><p class="lead">{c["lead"]}</p>'
            f'<div class="sh-cta"><a class="btn btn-gold" href="#request" data-cta="hero-primary">{c["cta"]}</a>'
            f'<a class="sh-wa" href="{wa(c["wa_hero"])}" target="_blank" rel="noopener" data-cta="hero-whatsapp">{WA_ICON} {c["wa_small"]}</a></div>'
            f'<p class="micro">{ic("reply24", "ic ic-sm")} {c["micro"]}</p></div>'
            f'<figure class="vcard" data-variant="a"'
            f' data-a-src="{FILM}" data-a-src-m="{FILM_M}" data-a-poster="{FILM_POSTER}" data-a-alt="{c["vid_a"]}" data-a-btn="{c["btn_a"]}" data-a-cap="{c["cap_a"]}" data-a-full="{REEL}"'
            f' data-b-src="{REEL}" data-b-src-m="{REEL_M}" data-b-poster="{REEL_POSTER}" data-b-alt="{c["vid_b"]}" data-b-btn="{c["btn_b"]}" data-b-cap="{c["cap_b"]}" data-b-full="{FILM_FULL}">'
            f'<div class="vframe"><img class="vposter" src="{FILM_POSTER}" alt="{c["vid_a"]}" width="1280" height="720" fetchpriority="high">'
            f'<video class="card-vid" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video></div>'
            f'<figcaption><span class="vcap">{c["cap_a"]}</span>'
            f'<button type="button" class="vfull" data-mp4="{REEL}" data-cta="hero-film">{PLAY}<b>{c["btn_a"]}</b></button></figcaption></figure>'
            f'</div></section>\n')

    # 2) trust: client logos in black and white
    proof = (f'<div class="proof v4-logos"><div class="wrap"><p class="logos-lead">{c["logos_lead"]}</p>'
             f'<div class="marquee" aria-label="{c["logos_lead"]}"><div class="track">{logos_html}<span aria-hidden="true" class="dup">{logos_html}</span></div></div>'
             f'<!-- {c["owner_claims_note"]} --></div></div>\n')

    # 3) problem, with the real Makkah Charter exhibition photo
    src, alt, cap = c["prob_img"]; w, h = dims(src)
    probs = "".join(f'<li><h3>{a}</h3><p>{b}</p><p class="fix"><b>{c["fixlbl"]}</b> {f}</p></li>' for a, b, f in c["probs"])
    prob = (f'<section><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["prob_eyebrow"]}</p><h2>{c["prob_h"]}</h2>'
            f'<p class="lead">{c["prob_lead"]}</p></div><div class="prob-grid">'
            f'<figure class="real-shot"><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async"><figcaption>{cap}</figcaption></figure>'
            f'<ol class="prob-list">{probs}</ol></div></div></section>\n')

    # 4) service and six works
    items = "".join(f'<li class="has-ic">{ic(k)}<span>{x}</span></li>' for k, x in zip(["script", "film", "view3d", "reels", "bilingual"], c["offer_items"]))
    works = ""
    for k in WORKS:
        capw, altw = c["works"][k]
        s12, s24 = f"{V3}{k}-1200.webp", f"{V3}{k}-2400.webp"
        ww, hh = dims(s12)
        works += (f'<figure tabindex="0" data-full="{s24}"><span class="wk"><img src="{s12}" srcset="{s12} 1200w, {s24} 2400w" sizes="(max-width:640px) 100vw, (max-width:980px) 50vw, 400px" '
                  f'alt="{altw}" width="{ww}" height="{hh}" loading="lazy" decoding="async"></span><figcaption>{capw}</figcaption></figure>')
    svc = (f'<section class="alt" id="offer"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["svc_eyebrow"]}</p></div>'
           f'<div class="offer"><span class="pk-tag">{c["offer_tag"]}</span><div><h3>{c["offer_h"]}</h3><p class="sub">{c["offer_sub"]}</p><ul>{items}</ul>'
           f'<a class="btn btn-gold" href="#request" data-pkg="{c["offer_h"]}" data-cta="offer-primary">{c["cta"]}</a>'
           f'<div class="price-strip" hidden data-todo-owner="price">{c["price_note"]}</div></div>'
           f'<div class="for"><b>{c["for_h"]}</b><p>{c["for_p"]}</p><b>{c["prep_h"]}</b><p>{c["prep_p"]}</p></div></div>'
           f'<div class="sec-head center works-head" id="work"><h2>{c["work_h"]}</h2><p class="lead">{c["work_lead"]}</p></div>'
           f'<div class="gal works">{works}</div></div></section>\n')

    # 5) two case studies
    cases = ""
    for hname, p, lis, img, ialt, href in c["cases"]:
        iw, ih = dims(img)
        cases += (f'<article class="case v4c"><span class="cimg"><img src="{img}" alt="{ialt}" width="{iw}" height="{ih}" loading="lazy" decoding="async"></span>'
                  f'<div class="cbody"><h3>{hname}</h3><p>{p}</p><p class="gives">{c["gives"]}</p><ul>{"".join(f"<li>{x}</li>" for x in lis)}</ul>'
                  f'<a href="{href}" target="_blank" rel="noopener">{c["case_link"]}</a></div></article>')
    casesec = (f'<section class="dark"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["cases_eyebrow"]}</p><h2>{c["cases_h"]}</h2></div>'
               f'<div class="cases">{cases}</div>'
               f'<div class="center" style="margin-top:34px"><a class="btn btn-gold" href="#request" data-cta="cases">{c["cta"]}</a></div></div></section>\n')

    # 6) steps and FAQ
    steps = "".join(f'<div class="card"><div class="step-top"><div class="num">{i}</div>{ic(k, "ic ic-lg")}</div><h3>{h}</h3><p>{p}</p></div>'
                    for i, ((h, p), k) in enumerate(zip(c["steps"], ["consult", "script", "produce", "deliver"]), 1))
    faq = "".join(f"<details><summary>{q}</summary><p>{a} {t}</p></details>" for q, a, t in c["faq"])
    stepsec = (f'<section><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["steps_eyebrow"]}</p><h2>{c["steps_h"]}</h2></div>'
               f'<div class="steps">{steps}</div><div class="faqw v4-faq"><h3 class="faq-h">{c["faq_h"]}</h3>{faq}</div></div></section>\n')

    # 7) short form; a very faint real aerial of Wahat Al Salam behind it
    nexts = "".join(f'<li><div class="num num-ic">{ic(k)}</div><div><b>{b}</b><p>{p}</p></div></li>' for (b, p), k in zip(c["nexts"], ["reply24", "consult", "approved"]))
    stg = "".join(f'<label><input type="radio" name="qs" value="{s}"><span>{s}</span></label>' for s in c["stages"])
    whn = "".join(f'<label><input type="radio" name="qw" value="{s}"><span>{s}</span></label>' for s in c["whens"])
    quick = (f'<div class="quick" id="quick" data-msg="{c["wa_quick"]}"><b>{c["quick_h"]}</b>'
             f'<div class="qgrp"><span>{c["quick_stage"]}</span><div class="qchips">{stg}</div></div>'
             f'<div class="qgrp"><span>{c["quick_when"]}</span><div class="qchips">{whn}</div></div>'
             f'<a class="btn btn-gold" id="quickWa" href="{wa(c["wa_quick"])}" target="_blank" rel="noopener" data-cta="quick-whatsapp">{WA_ICON} {c["quick_btn"]}</a></div>'
             f'<p class="or">{c["or_txt"]}</p>')
    sizes = "".join(f"<option>{t}</option>" for t in c["sizes"])
    attrs = "".join(f'<input type="hidden" name="{k}" data-attr="{k}">' for k in ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ttclid", "ScCid"])
    form = (f'<section class="formsec v4-form" id="request">'
            f'<div class="wrap fgrid"><div><p class="eyebrow">{c["form_eyebrow"]}</p><h2>{c["form_h"]}</h2>'
            f'<p class="lead">{c["form_lead"]}</p><ul class="next-list">{nexts}</ul>{quick}</div>'
            f'<form id="lpFormV2" class="v2" novalidate>'
            f'<div class="f"><label for="n">{c["f_name"]}</label><input id="n" name="name" autocomplete="name" required></div>'
            f'<div class="f"><label for="p">{c["f_phone"]}</label><input id="p" name="phone" type="tel" inputmode="tel" autocomplete="tel" required></div>'
            f'<div class="f full"><label for="c">{c["f_company"]}</label><input id="c" name="company" autocomplete="organization" required></div>'
            f'<div class="f full"><label for="z">{c["f_size"]}</label>'
            f'<!-- {c["size_todo"]} -->\n<select id="z" name="project_size" required><option value="" selected disabled>{c["f_sel"]}</option>{sizes}</select></div>'
            f'{attrs}'
            f'<div class="hp" aria-hidden="true"><label>Leave blank</label><input type="text" name="botcheck" tabindex="-1" autocomplete="off"></div>'
            f'<div class="f full"><div id="ts" style="min-height:65px"></div></div><div id="fb" aria-live="polite"></div>'
            f'<div class="f full"><button class="btn btn-gold" type="submit" id="sb" data-cta="form-submit">{c["cta"]}</button></div>'
            f'<p class="note">{c["privacy"]}</p></form></div></section>\n</main>\n')

    priv = "../privacy-policy.html" if ar else "../privacy-policy-en.html"
    foot = (f'<footer><div class="wrap">© 2026 Graphics House Co. · <a href="{priv}" target="_blank" rel="noopener">{"سياسة الخصوصية" if ar else "Privacy Policy"}</a></div></footer>\n'
            f'<a class="wa" href="{wa(c["wa_hero"])}" target="_blank" rel="noopener" aria-label="WhatsApp" data-cta="float-whatsapp">{WA_ICON}</a>\n'
            f'<div class="mbar"><a class="btn btn-gold" href="#request" data-cta="mbar-primary">{c["cta_short"]}</a>'
            f'<a class="btn btn-ghost" href="{wa(c["wa_hero"])}" target="_blank" rel="noopener" data-cta="mbar-whatsapp">{c["wa_label"]}</a></div>\n'
            f'<div class="lb" id="lb" role="dialog" aria-modal="true"><button type="button" aria-label="{"إغلاق" if ar else "Close"}">&times;</button><img alt=""><div class="lb-v"></div><p></p></div>\n'
            f'<script src="lp-v4.js?v=1"></script>\n<script src="lp.js?v=3"></script>\n<script src="lp-v2.js?v=5"></script>\n</body>\n</html>\n')

    return head + body_open + header + hero + proof + prob + svc + casesec + stepsec + form + foot


def thanks(c):
    L = c["lang"]; ar = L == "ar"
    t = dict(
        title="تم استلام طلبك | Graphics House" if ar else "Request received | Graphics House",
        h="تم استلام طلبك" if ar else "Request received",
        lead="سنتواصل معك خلال 24 ساعة." if ar else "We will contact you within 24 hours.",
        steps=[("نراجع طلبك", "نقرأ بياناتك ونجهّز أسئلة مكالمة قصيرة."), ("نتواصل معك", "على واتساب أو الهاتف لتحديد موعد المكالمة."), ("خطة اللقطات وعرض السعر", "تصلك بعد المكالمة، قبل أي التزام.")] if ar else
              [("We review your request", "We read your details and prepare questions for a short call."), ("We contact you", "On WhatsApp or by phone to set the call."), ("Shot plan and quote", "You receive them after the call, before any commitment.")],
        wa="تواصل معنا الآن على واتساب" if ar else "Message us on WhatsApp now",
        wamsg="السلام عليكم، أرسلت طلبًا من صفحة الإنتاج وأرغب بالمتابعة" if ar else "Hello, I sent a request from the Production page and would like to follow up",
        back="العودة إلى الصفحة" if ar else "Back to the page",
    )
    nexts = "".join(f'<li><div class="num">{i}</div><div><b>{b}</b><p>{p}</p></div></li>' for i, (b, p) in enumerate(t["steps"], 1))
    return f'''<!DOCTYPE html>
<html lang="{L}" dir="{c['dir']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t['title']}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
{FONTS}{GA}<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. Fire the lead/conversion pixel event here once the owner adds the IDs. -->
{CSS}</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wa" viewBox="0 0 24 24"><path d="{WA_PATH}"/></symbol></svg>
<main class="thanks"><div class="wrap">
<div class="tick"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
<h1>{t['h']}</h1><p class="lead">{t['lead']}</p>
<ul class="next-list">{nexts}</ul>
<a class="btn btn-gold" href="{wa(t['wamsg'])}" target="_blank" rel="noopener" data-cta="thanks-whatsapp">{WA_ICON} {t['wa']}</a>
<a class="back" href="{c['self']}">{t['back']}</a>
</div></main>
<script>
(function(){{
  var KEYS=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','ttclid','ScCid'];
  var q=new URLSearchParams(location.search), p={{page:'lp_production_{L}',lang:'{L}'}};
  KEYS.forEach(function(k){{if(q.get(k))p[k]=q.get(k);}});
  try{{ if(sessionStorage.getItem('gh_lp_thanks'))return; sessionStorage.setItem('gh_lp_thanks','1'); }}catch(e){{}}
  try{{ if(window.gtag)window.gtag('event','lp_thank_you',p); window.dataLayer=window.dataLayer||[]; window.dataLayer.push({{event:'lp_conversion',lp:p}}); }}catch(e){{}}
}})();
</script>
</body>
</html>
'''


os.makedirs(OUT, exist_ok=True)
write_files(os.path.join(OUT, '..', 'assets', 'lp', 'icons'))
for key, name in (("ar", "production.html"), ("en", "production-en.html")):
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(build(T[key]))
for key, name in (("ar", "thanks.html"), ("en", "thanks-en.html")):
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(thanks(T[key]))
print("ok")
