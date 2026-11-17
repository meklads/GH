#!/usr/bin/env python3
"""Generates lp/production-v2.html, production-v2-en.html, thanks.html, thanks-en.html (preview only)."""
import sys, subprocess, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icons_lp import sprite, ic, write_files
from urllib.parse import quote

OUT = sys.argv[1]  # .../GraphicsHouse/lp
WA = "966502786513"

WA_PATH = ("M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z")
WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><use href="#i-wa"/></svg>'
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'

def wa(text):
    return f"https://wa.me/{WA}?text={quote(text)}"

def fig(full, alt, cap, w=1672, h=941, jpg=None):
    base = full.rsplit(".", 1)[0]
    fallback = jpg or (base + ".png")
    return (f'<figure tabindex="0" data-full="{full}"><picture><source srcset="{full}" type="image/webp">'
            f'<img src="{fallback}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async"></picture>'
            f'<figcaption>{cap}</figcaption></figure>')

LOGOS = [("rafal.png", "Rafal"), ("al-owla.png", "Al Oula"), ("makyon.png", "Makyon"), ("bn-zooma.png", "Bin Zoma"),
         ("aqarat.png", "Aqarat"), ("khatib-alami.png", "Khatib and Alami"), ("hilton.png", "Hilton")]
logos_html = "".join(f'<img src="../assets/clients-logo/{f}" alt="{a}" loading="lazy">' for f, a in LOGOS)

TODO = '<span class="todo">TODO-OWNER</span>'

T = {
"ar": dict(
    lang="ar", dir="rtl", other="production-en.html", self="production.html", thanks="thanks.html",
    title="فيلم إطلاق وتصوير عقاري للمطورين | Graphics House",
    desc="فيلم إطلاق لمشروعك العقاري: نخطط ونصوّر ونُخرج، ونُكمل ما لم يُبنَ بلقطات CGI من فريق واحد. احصل على عرض خلال 24 ساعة.",
    og_alt="فعالية ميثاق مكة لرابطة العالم الإسلامي",
    hero_alt="لقطة من فيلم معماري سينمائي أنتجته Graphics House",
    reel_t="ريل أعمال Graphics House", reel_d="مقتطفات من أفلامنا المعمارية والعقارية: لقطات CGI ومشاريع وواجهات وداخليات.",
    reel_alt="ريل أعمال Graphics House: لقطة من فيلم معماري",
    cmp_eyebrow="الفرق", cmp_h="ما الذي تحصل عليه ولا يقدمه المورّد المنفرد", cmp_a="مصور أو مونتير منفرد",
    cmp=[("التخطيط", "يصوّر ثم يختار ما يصلح", "قائمة لقطات مبنية على خطة البيع، تعتمدها قبل التصوير"),
         ("ما لم يُبنَ بعد", "لا يمكن تصويره", "نكمله بلقطات CGI من الفريق نفسه"),
         ("التنسيق", "مصور واستوديو رندر ومونتير منفصلون", "فريق واحد: تصوير وإخراج ومونتاج وCGI"),
         ("اللغة", "نسخة واحدة غالبًا", "نصوص على الشاشة بالعربية والإنجليزية"),
         ("الاستخدام", "ملفات عامة", "مقاسات الموقع والسوشيال والمطبوعات وشاشة المعرض")],
    subject="Graphics House: طلب عرض (فيلم إطلاق وإنتاج)",
    msg="طلب عرض من صفحة الإنتاج (فيلم إطلاق وتصوير وفعاليات)",
    cta="احصل على عرض خلال 24 ساعة", cta_short="احصل على عرض خلال 24 ساعة", wa_label="واتساب",
    wa_hero="السلام عليكم، أريد عرضًا لفيلم إطلاق مشروعي",
    wa_quick="السلام عليكم، أريد عرضًا لفيلم إطلاق مشروعي.",
    eyebrow="أفلام إطلاق للمطورين العقاريين · جدة",
    h1='صور وأفلام <span class="gold">تبيع مشروعك</span>، لا تكتفي بتوثيقه',
    lead="فيلم إطلاق لمشروعك العقاري: نخطط ونصوّر ونُخرج، ونُكمل ما لم يُبنَ بلقطات CGI من الفريق نفسه. لمطورين عقاريين وفرق مبيعات.",
    micro="نرد على طلبك خلال 24 ساعة",
    chips=["فيلم الإطلاق", "تصوير المشروع", "تغطية الفعاليات"],
    stats=[("1", "فريق: تصوير وإخراج ومونتاج وCGI"), ("AR · EN", "مواد بلغتين من فريق واحد")],
    logos_lead="يثق بنا مطورون ومؤسسات في السعودية والخليج",
    owner_claims_note="OWNER-UNVERIFIED: «+15 سنة» و«4 مكاتب (السعودية والبحرين وعُمان ومصر)». لا تُظهر حتى يؤكدها المالك. لإظهارها أزل hidden من الكتلة.",
    owner_claims=[("+15", "سنة في السوق السعودي"), ("4", "مكاتب: السعودية والبحرين وعُمان ومصر")],
    prob_eyebrow="لماذا لا تبيع الصور", prob_h="ثلاثة أسباب تجعل صور المشروع تخسر المشتري",
    prob_lead="كل يوم تبقى فيه صورة ضعيفة منشورة، يمر عليها مشترٍ ولا يتوقف.",
    probs=[("صورة الجوال تخفّض قيمة المشروع", "المشتري يحكم على جودة البناء من أول صورة. صورة باهتة أو مائلة تقول له إن المشروع عادي، حتى لو لم يكن كذلك.", "إضاءة مدروسة، وتوقيت تصوير مختار، ومعالجة احترافية لكل صورة."),
           ("مصور لا يعرف ما الذي يبيع", "مئات اللقطات، ولا توجد بينها اللقطة التي يحتاجها الإعلان أو الكتالوج أو شاشة المعرض.", "قائمة لقطات مبنية على خطة البيع وأماكن الاستخدام، تعتمدها قبل يوم التصوير."),
           ("المشروع لم يكتمل بعد", "الموقع تحت الإنشاء، والمشتري يريد أن يرى النتيجة لا الرافعات.", "نصوّر الموقع والمحيط الحقيقي، ونُكمل ما لم يُبنَ بلقطات CGI من فريقنا.")],
    fixlbl="ما نفعله:",
    offer_eyebrow="العرض الرئيسي", offer_tag="الأنسب للإطلاق", offer_h="فيلم الإطلاق",
    offer_sub="فيلم يبيع المشروع في الموقع الإلكتروني وشاشة المعرض والإعلان، من فريق واحد.",
    offer_items=["سيناريو وقائمة لقطات تعتمدها قبل التصوير", "فيلم رئيسي للإطلاق والموقع وشاشة المعرض", "مقاطع عمودية قصيرة للريلز والستوري", "نصوص على الشاشة بالعربية والإنجليزية", "لقطات CGI للأجزاء التي لم تُبنَ بعد"],
    offer_pkg="فيلم الإطلاق",
    for_h="مناسب لـ", for_p="إطلاق مشروع، معرض، صفحة المشروع، حملة إعلانية.",
    prep_h="ما نحتاجه منك قبل يوم التصوير", prep_p="موعد دخول الموقع، ووحدة أو مساحة جاهزة، ومعلومات المشروع ورسالته، والشعار والهوية البصرية.",
    price_note="شريط السعر (اختياري): يظهر بعد قرار المالك فقط.",
    minor=[("تصوير المشروع", "مشروع مكتمل، وحدة نموذجية، صالة عرض، فندق، مطعم.", "تصوير خارجي وداخلي بخطة لقطات تعتمدها قبل التصوير، ومعالجة احترافية وتسليم بمقاسات الموقع والسوشيال والمطبوعات.", "تصوير المشروع"),
           ("تغطية الفعالية", "معرض، مؤتمر، افتتاح، حفل توقيع.", "تصوير فوتوغرافي وفيديو طوال الفعالية، وفيلم ملخص، ومقاطع قصيرة جاهزة للسوشيال، وصور مختارة ومعالجة.", "تغطية الفعالية")],
    minor_cta="اطلب هذه الخدمة",
    work_eyebrow="أعمال", work_h="أعمال أنتجناها لجهات سعودية", work_lead="اضغط على الفيلم لتشغيله، وعلى الصورة لتكبيرها.",
    films=[("NM60mClJNwg", "hqdefault", "النادي الأهلي السعودي", "توثيق احترافي لفعاليات رياضية، بإيقاع يناسب جمهور المنصات.", "فيلم النادي الأهلي السعودي: توثيق فعاليات رياضية"),
           ("AYStF0c4Hgk", "maxresdefault", "مصنع الخياط", "فيلم صناعي يعرض خط الإنتاج والجودة والمكان بلغة سينمائية.", "فيلم مصنع الخياط الصناعي")],
    gal=[("../assets/photography/slide_image_3.webp", "وقف الراجحي: لقطة من الفيلم السينمائي", "وقف الراجحي: فيلم سينمائي"),
         ("../assets/photography/slide_image_7.webp", "رابطة العالم الإسلامي: إنتاج وإدارة الفعالية", "رابطة العالم الإسلامي: إنتاج وإدارة فعالية"),
         ("../assets/projects/galleries/makkah-charter-01.webp", "ميثاق مكة، رابطة العالم الإسلامي، لقطة 1 من 3", "ميثاق مكة (1 من 3)"),
         ("../assets/photography/slide_image_6.webp", "النادي الأهلي السعودي: توثيق فعاليات رياضية", "النادي الأهلي: توثيق فعاليات رياضية"),
         ("../assets/photography/slide_image_8.webp", "مصنع الخياط: لقطة من الفيلم الصناعي", "مصنع الخياط: فيلم صناعي"),
         ("../assets/photography/slide_image_9.webp", "ملتقى جدة العقاري: الهوية والفيلم", "ملتقى جدة العقاري: هوية وفيلم"),
         ("../assets/projects/galleries/makkah-charter-04.webp", "ميثاق مكة، رابطة العالم الإسلامي، لقطة 2 من 3", "ميثاق مكة (2 من 3)"),
         ("../assets/projects/galleries/makkah-charter-08.webp", "ميثاق مكة، رابطة العالم الإسلامي، لقطة 3 من 3", "ميثاق مكة (3 من 3)")],
    cases=[("دراسة حالة", "ميثاق مكة، رابطة العالم الإسلامي", "معرض الإنسانية لرابطة العالم الإسلامي في هيلتون جدة: تجربة متكاملة من التصميم إلى التنفيذ.", "ما سلّمنا",
            ["تصميم وتنفيذ الديكور الداخلي للمقر", "مجسم معماري تفاعلي ذكي مع برنامج تشغيلي على شاشة اللمس", "برنامج تفاعلي لأخبار الرابطة حول العالم", "برنامج تصوير تذكاري على شاشة تفاعلية"],
            "../insights/projects/makkah-charter-mwl.html", "اقرأ دراسة الحالة", "TODO-OWNER: مدة المشروع"),
           ("دراسة حالة", "ملتقى جدة العقاري", "منظومة بصرية كاملة للملتقى: هوية وكتالوج ونموذج ثلاثي الأبعاد وفيلم سينمائي يحملها جميعًا.", "ما سلّمنا",
            ["شعار ونظام الهوية البصرية الكامل", "كتالوج فاخر من 44 صفحة", "نموذج ثلاثي الأبعاد لجدة سوبردوم", "فيلم CGI سينمائي تخيلي"],
            "../insights/projects/jeddah-forum.html", "اقرأ دراسة الحالة", "TODO-OWNER: مدة المشروع")],
    steps_eyebrow="كيف نعمل", steps_h="أربع خطوات من الطلب إلى التسليم",
    steps=[("مكالمة قصيرة", "نحدد الهدف والجمهور وأماكن استخدام المواد والموعد."), ("خطة إنتاج", "سيناريو وقائمة لقطات وجدول تصوير، تعتمدها قبل يوم التصوير."),
           ("يوم التصوير", "فريق التصوير في الموقع حسب الجدول المعتمد."), ("مونتاج وتسليم", "نسخة أولى لملاحظاتك، ثم الملفات النهائية بكل المقاسات.")],
    faq_eyebrow="أسئلة شائعة", faq_h="قبل أن تبدأ",
    faq=[("هل تصوّرون مشروعاً لم يكتمل بعد؟", "نعم. نصوّر الموقع والمحيط الحقيقي، ونضيف لقطات CGI من فريقنا للأجزاء التي لم تُبنَ، ليرى المشتري النتيجة النهائية.", ""),
         ("كم يستغرق التسليم؟", "تتحدد المدة في خطة الإنتاج حسب حجم العمل، وتعرفها قبل أن تعتمد العرض.", TODO + " المدة النموذجية لفيلم الإطلاق"),
         ("كم جولة تعديل تشمل؟", "نرسل نسخة أولى لملاحظاتك قبل الملفات النهائية.", TODO + " عدد جولات التعديل المشمولة"),
         ("لمن حقوق استخدام المواد؟", "تُكتب حقوق الاستخدام بوضوح في العرض قبل البدء.", TODO + " نص الحقوق المعتمد"),
         ("متى يُدفع؟", "يُكتب جدول الدفعات في العرض قبل البدء.", TODO + " جدول الدفعات"),
         ("كيف يُحدد السعر؟", "حسب عدد المواقع وأيام التصوير ومدة الفيلم والمخرجات المطلوبة. يصلك العرض بعد المكالمة القصيرة.", ""),
         ("هل تغطون فعاليات في مدن مختلفة؟", "نعم. لدينا أعمال إنتاج في جدة ومكة، ونحدد فريق التغطية حسب مدينة الفعالية.", "")],
    form_eyebrow="ابدأ الآن", form_h="احصل على عرض خلال 24 ساعة",
    form_lead="أخبرنا بمشروعك في أربعة حقول، ونرد خلال 24 ساعة.",
    nexts=[("نرد خلال 24 ساعة", "نتواصل معك لتحديد موعد مكالمة قصيرة."), ("نفهم مشروعك", "عن الهدف والجمهور وأماكن استخدام المواد."), ("خطة اللقطات وعرض السعر", "تصلك بعد المكالمة، قبل أي التزام.")],
    quick_h="الأسرع: واتساب برسالة جاهزة",
    quick_stage="مرحلة المشروع", stages=["قبل الإطلاق", "قيد الإنشاء", "مكتمل"],
    quick_when="الموعد", whens=["خلال شهر", "من 1 إلى 3 أشهر", "لم يتحدد بعد"],
    quick_btn="أرسل على واتساب", or_txt="أو اترك بياناتك",
    f_name="الاسم *", f_phone="واتساب *", f_company="الشركة / الجهة *", f_type="نوع المشروع *", f_sel="اختر",
    types=["فيلم إطلاق مشروع", "تصوير المشروع", "تغطية فعالية", "لست متأكداً"],
    f_budget="الميزانية التقريبية", f_opt="(اختياري)",
    budgets=["أقل من 30 ألف ريال", "من 30 إلى 80 ألف ريال", "من 80 إلى 200 ألف ريال", "أكثر من 200 ألف ريال", "أفضّل مناقشتها في المكالمة"],
    budget_todo="TODO-OWNER: يؤكد المالك حدود النطاقات قبل التفعيل. النطاقات للتأهيل الداخلي فقط ولا تُنشر كأسعار.",
    privacy='بإرسال النموذج توافق على <a href="../privacy-policy.html" target="_blank" rel="noopener">سياسة الخصوصية</a>. نستخدم بياناتك للرد على طلبك فقط.',
    wa_float="واتساب", lbl_lang="AR",
),
"en": dict(
    lang="en", dir="ltr", other="production.html", self="production-en.html", thanks="thanks-en.html",
    title="Launch Films and Real Estate Photography for Developers | Graphics House",
    desc="A launch film for your real estate project: we plan, shoot and direct it, and complete what is not built yet with CGI, from one team. Get an offer within 24 hours.",
    og_alt="Makkah Charter event for the Muslim World League",
    hero_alt="Frame from a cinematic architectural film produced by Graphics House",
    reel_t="Graphics House showreel", reel_d="Highlights from our architectural and real estate films: CGI shots, masterplans, facades and interiors.",
    reel_alt="Graphics House showreel: frame from an architectural film",
    cmp_eyebrow="The difference", cmp_h="What you get that a single vendor does not give you", cmp_a="A single photographer or editor",
    cmp=[("Planning", "Shoots first, then picks what works", "A shot list built on your sales plan, approved before the shoot"),
         ("What is not built yet", "Cannot be filmed", "Completed with CGI shots from the same team"),
         ("Coordination", "Separate photographer, render studio and editor", "One team: shoot, direction, editing, CGI"),
         ("Language", "Usually one version", "On-screen text in Arabic and English"),
         ("Usage", "Generic files", "Sizes for web, social, print and the exhibition screen")],
    subject="Graphics House: offer request (launch film and production)",
    msg="Offer request from the Production page (launch film, photography, events)",
    cta="Get an offer within 24 hours", cta_short="Get an offer in 24 hours", wa_label="WhatsApp",
    wa_hero="Hello, I would like an offer for a launch film for my project",
    wa_quick="Hello, I would like an offer for a launch film for my project.",
    eyebrow="Launch films for real estate developers · Jeddah",
    h1='Photos and films that <span class="gold">sell your project</span>, not just record it',
    lead="A launch film for your real estate project: we plan, shoot and direct it, and complete what is not built yet with CGI shots from the same team. For developers and sales teams.",
    micro="We reply within 24 hours",
    chips=["Launch film", "Project photography", "Event coverage"],
    stats=[("1", "team: shoot, direction, editing, CGI"), ("AR · EN", "materials in both languages")],
    logos_lead="Trusted by developers and institutions across Saudi Arabia and the Gulf",
    owner_claims_note="OWNER-UNVERIFIED: '15+ years' and '4 offices (Saudi Arabia, Bahrain, Oman, Egypt)'. Do not show until the owner confirms. Remove hidden to show.",
    owner_claims=[("15+", "years in the Saudi market"), ("4", "offices: Saudi Arabia, Bahrain, Oman, Egypt")],
    prob_eyebrow="Why images fail to sell", prob_h="Three reasons project images lose the buyer",
    prob_lead="Every day a weak image stays online, a buyer scrolls past it.",
    probs=[("A phone photo lowers the project value", "Buyers judge build quality from the first image. A flat or tilted photo tells them the project is ordinary, even when it is not.", "Planned lighting, chosen shoot timing and professional grading for every image."),
           ("A photographer who does not know what sells", "Hundreds of shots, and none of them is the one the ad, the brochure or the exhibition screen needs.", "A shot list built on your sales plan and where each asset will be used, approved before shoot day."),
           ("The project is not finished yet", "The site is under construction, and buyers want to see the result, not the cranes.", "We film the real site and surroundings and complete what is not built with CGI shots from our team.")],
    fixlbl="What we do:",
    offer_eyebrow="Main offer", offer_tag="Best for launches", offer_h="Launch Film",
    offer_sub="A film that sells the project on your website, exhibition screen and ads, from one team.",
    offer_items=["A script and shot list you approve before the shoot", "A main film for the launch, website and exhibition screen", "Short vertical clips for reels and stories", "On-screen text in Arabic and English", "CGI shots for the parts not built yet"],
    offer_pkg="Launch Film",
    for_h="Best for", for_p="Project launches, exhibitions, project pages, ad campaigns.",
    prep_h="What we need from you before shoot day", prep_p="Site access time, a unit or space ready to shoot, project information and key message, and your logo and brand identity.",
    price_note="Price strip (optional): shown only after the owner decides.",
    minor=[("Project Photography", "Completed projects, show units, sales galleries, hotels, restaurants.", "Exterior and interior photography with a shot list you approve before the shoot, professional grading, and delivery in web, social and print sizes.", "Project Photography"),
           ("Event Coverage", "Exhibitions, conferences, openings, signing ceremonies.", "Photo and video coverage throughout the event, a highlight film, short clips ready for social, and selected graded photos.", "Event Coverage")],
    minor_cta="Request this service",
    work_eyebrow="Our work", work_h="Work we produced for Saudi clients", work_lead="Click a film to play it, or an image to enlarge it.",
    films=[("NM60mClJNwg", "hqdefault", "Al Ahli Saudi Club", "Professional coverage of sports events, paced for social audiences.", "Al Ahli Saudi Club film: sports event coverage"),
           ("AYStF0c4Hgk", "maxresdefault", "Al Khayyat Factory", "An industrial film that shows the production line, quality and place in cinematic language.", "Al Khayyat Factory industrial film")],
    gal=[("../assets/photography/slide_image_3.webp", "Al Rajhi Waqf: frame from the cinematic film", "Al Rajhi Waqf: cinematic film"),
         ("../assets/photography/slide_image_7.webp", "Muslim World League: event production and management", "Muslim World League: event production"),
         ("../assets/projects/galleries/makkah-charter-01.webp", "Makkah Charter, Muslim World League, shot 1 of 3", "Makkah Charter (1 of 3)"),
         ("../assets/photography/slide_image_6.webp", "Al Ahli Saudi Club: sports event coverage", "Al Ahli Club: sports event coverage"),
         ("../assets/photography/slide_image_8.webp", "Al Khayyat Factory: frame from the industrial film", "Al Khayyat Factory: industrial film"),
         ("../assets/photography/slide_image_9.webp", "Jeddah Real Estate Forum: identity and film", "Jeddah Real Estate Forum: identity and film"),
         ("../assets/projects/galleries/makkah-charter-04.webp", "Makkah Charter, Muslim World League, shot 2 of 3", "Makkah Charter (2 of 3)"),
         ("../assets/projects/galleries/makkah-charter-08.webp", "Makkah Charter, Muslim World League, shot 3 of 3", "Makkah Charter (3 of 3)")],
    cases=[("Case study", "Makkah Charter, Muslim World League", "The Humanity Exhibition of the Muslim World League at Hilton Jeddah: a complete experience from design to delivery.", "What we delivered",
            ["Interior design and fit-out of the headquarters", "An interactive smart maquette with an operating program on a touch screen", "An interactive program for League news around the world", "A commemorative photo program on an interactive screen"],
            "../insights/projects/makkah-charter-mwl.html", "Read the case study", "TODO-OWNER: project duration"),
           ("Case study", "Jeddah Real Estate Forum", "A complete visual system for the forum: identity, catalogue, a 3D model and a cinematic film that carries them all.", "What we delivered",
            ["The logo and full visual identity system", "A 44-page premium catalogue", "A 3D model of Jeddah Superdome", "A cinematic CGI film"],
            "../insights/projects/jeddah-forum.html", "Read the case study", "TODO-OWNER: project duration")],
    steps_eyebrow="How we work", steps_h="Four steps from request to delivery",
    steps=[("Short call", "We define the goal, audience, where the materials will be used, and the date."), ("Production plan", "Script, shot list and shoot schedule, approved by you before shoot day."),
           ("Shoot day", "Our crew on site according to the approved schedule."), ("Edit and delivery", "A first cut for your notes, then final files in every size.")],
    faq_eyebrow="FAQ", faq_h="Before you start",
    faq=[("Do you film a project that is not finished yet?", "Yes. We film the real site and surroundings and add CGI shots from our team for the parts not built yet, so the buyer sees the final result.", ""),
         ("How long does delivery take?", "The timeline is set in the production plan based on the size of the work, and you know it before you approve the offer.", TODO + " typical launch film timeline"),
         ("How many revision rounds are included?", "We send a first cut for your notes before the final files.", TODO + " included revision rounds"),
         ("Who owns the usage rights?", "Usage rights are written clearly in the offer before we start.", TODO + " approved rights wording"),
         ("When do I pay?", "The payment schedule is written in the offer before we start.", TODO + " payment schedule"),
         ("How is the price set?", "By the number of locations, shoot days, film length and the outputs you need. You receive the offer after the short call.", ""),
         ("Do you cover events in different cities?", "Yes. We have production work in Jeddah and Makkah, and we assign the coverage team by the event city.", "")],
    form_eyebrow="Start now", form_h="Get an offer within 24 hours",
    form_lead="Tell us about your project in four fields and we reply within 24 hours.",
    nexts=[("We reply within 24 hours", "We contact you to set a short call."), ("We understand your project", "Goal, audience and where the materials will be used."), ("Shot plan and quote", "You receive them after the call, before any commitment.")],
    quick_h="Fastest: WhatsApp with a ready message",
    quick_stage="Project stage", stages=["Pre-launch", "Under construction", "Completed"],
    quick_when="Timing", whens=["Within a month", "1 to 3 months", "Not decided yet"],
    quick_btn="Send on WhatsApp", or_txt="Or leave your details",
    f_name="Name *", f_phone="WhatsApp *", f_company="Company / organisation *", f_type="Project type *", f_sel="Select",
    types=["Project launch film", "Project photography", "Event coverage", "Not sure yet"],
    f_budget="Approximate budget", f_opt="(optional)",
    budgets=["Under SAR 30k", "SAR 30k to 80k", "SAR 80k to 200k", "Over SAR 200k", "I prefer to discuss it on the call"],
    budget_todo="TODO-OWNER: the owner confirms the range limits before activation. Ranges are for internal qualification only and are never published as prices.",
    privacy='By submitting you agree to the <a href="../privacy-policy-en.html" target="_blank" rel="noopener">Privacy Policy</a>. We use your details only to respond to your request.',
    wa_float="WhatsApp", lbl_lang="EN",
),
}

T["ar"].update(dict(
    title="فيلم الإطلاق وCGI للمطورين العقاريين | Graphics House",
    desc="فيلم إطلاق ولقطات CGI لمشاريع المطورين العقاريين: قصة إطلاق واحدة تُعرض في صالة المبيعات والموقع وأمام المستثمرين. احصل على عرض خلال 24 ساعة.",
    eyebrow="إطلاق المشاريع العقارية · فيلم وCGI · جدة",
    h1='أطلق مشروعك بفيلم <span class="gold">يبيع الوحدات</span>، لا يكتفي بعرضها',
    lead="نبني قصة إطلاق مشروعك: فيلم رئيسي ولقطات CGI سينمائية لما لم يُبنَ بعد، من فريق واحد، لتعرضها على المشترين والمستثمرين من اليوم الأول. لمطورين عقاريين لمشاريع متوسطة فأعلى.",
    chips=["فيلم الإطلاق", "لقطات CGI للمشروع", "مواد المبيعات والمستثمرين"],
    stats=[("1", "فريق واحد من القصة إلى الفيلم النهائي"), ("AR · EN", "مواد بلغتين من فريق واحد")],
    prob_eyebrow="لماذا لا يبيع الإطلاق", prob_h="ثلاثة أسباب تجعل إطلاق مشروعك لا يبيع",
    prob_lead="في المشاريع على الخارطة يحكم المشتري والمستثمر على المشروع من المواد البصرية وحدها.",
    probs=[("مواد متفرقة بلا قصة", "فيلم من جهة وصور من أخرى ورندر من ثالثة. المشتري يرى مشروعًا عاديًا، حتى لو لم يكن كذلك.", "قصة إطلاق واحدة: فيلم رئيسي ولقطات CGI ومقاطع قصيرة بهوية موحدة."),
           ("المشروع لم يُبنَ بعد", "لا يوجد ما يُرى في الموقع، والمشتري يريد أن يرى النتيجة النهائية لا الأرض.", "لقطات CGI سينمائية للمشروع كاملًا، مع مشاهد حقيقية للموقع والمحيط."),
           ("مواد تصلح للعرض لا للبيع", "ما صُنع للتوثيق لا يخدم صالة المبيعات ولا اجتماع المستثمرين ولا الإعلان.", "نبني الفيلم حول مكان استخدامه: صالة المبيعات، عرض المستثمرين، الموقع، والسوشيال.")],
    offer_eyebrow="الخدمة", offer_tag="خدمة الإطلاق", offer_h="فيلم الإطلاق وCGI",
    offer_sub="منظومة إطلاق بصرية لمشروعك: فيلم يبيع المشروع في صالة المبيعات والموقع والإعلان وعروض المستثمرين.",
    offer_items=["قصة الإطلاق: سيناريو وقائمة لقطات تعتمدها قبل الإنتاج", "فيلم رئيسي للإطلاق وصالة المبيعات والموقع", "لقطات CGI سينمائية للمشروع قبل اكتماله", "مقاطع قصيرة للريلز والستوري والإعلانات", "نصوص على الشاشة بالعربية والإنجليزية"],
    for_h="مناسب لـ", for_p="مطورين عقاريين لمشاريع متوسطة فأعلى: إطلاق مشروع، حملة إعلانية، عرض على المستثمرين.",
    prep_h="ما نحتاجه منك", prep_p="مخططات المشروع وهويته، وموعد الإطلاق، وأماكن استخدام المواد، وموقع المشروع للمشاهد الحقيقية.",
    minor=[], work_eyebrow="أعمال", work_h="أعمال أنتجناها لمطورين ومؤسسات", work_lead="اضغط على الفيلم لتشغيله، وعلى الصورة لتكبيرها.",
    films=[("../assets/videos/GH-demo-reel-2025.mp4", "../assets/videos/GH-demo-reel-2025-poster.jpg", "ريل أعمال Graphics House", "مقتطفات من أفلامنا المعمارية والعقارية: لقطات CGI ومشاريع وواجهات.", "ريل أعمال Graphics House: لقطة من فيلم معماري", 1280, 720, False),
           ("../assets/videos/GH-Real-estate-services.mp4", "../assets/videos/GH-Real-estate-services-poster.jpg", "ريل خدمات الإطلاق العقاري", "الإظهار المعماري والأفلام السينمائية، والمجسمات، والعروض التفاعلية.", "ريل الخدمات العقارية: لقطات من مشروع وكتالوج ومجسم", 720, 1280, True)],
    gal=[("../assets/projects/al-rajhi-naseem/aerial-ultra-01.webp", "مشروع الراجحي: لقطة جوية للمشروع بتقنية CGI", "مشروع الراجحي: لقطة جوية"),
         ("../assets/projects/wahat-al-salam/cam-03.webp", "واحة السلام، العيسائي: لقطة جوية للمخطط العام", "واحة السلام، العيسائي: المخطط العام"),
         ("../assets/projects/jeddah-forum/superdome/render-01.webp", "ملتقى جدة العقاري: جدة سوبردوم، نموذج ثلاثي الأبعاد", "ملتقى جدة العقاري: جدة سوبردوم"),
         ("../assets/projects/albayan-university/albayan-university-01.webp", "جامعة البيان: لقطة جوية للحرم الجامعي بتقنية CGI", "جامعة البيان"),
         ("../assets/projects/hilton-access-bridge/hilton-access-bridge-01.webp", "جسر هيلتون مكة: واجهة ومسار الوصول بتقنية CGI", "جسر هيلتون مكة"),
         ("../assets/projects/wahat-al-salam/cam-12.webp", "واحة السلام، العيسائي: الحي السكني", "واحة السلام، العيسائي: الحي السكني"),
         ("../assets/projects/rafal-pavilions/film-still.webp", "أجنحة رفال: لقطة من الفيلم", "أجنحة رفال: لقطة من الفيلم"),
         ("../assets/projects/al-rajhi-naseem/cam-0.webp", "مشروع الراجحي: منظور للمشروع بتقنية CGI", "مشروع الراجحي: منظور")],
    cmp_a="مورّد منفرد (مصور أو استوديو رندر أو مونتير)",
    cmp=[("التخطيط", "يصوّر ثم يختار ما يصلح", "قائمة لقطات مبنية على خطة البيع، تعتمدها قبل الإنتاج"),
         ("ما لم يُبنَ بعد", "لا يمكن تصويره", "نكمله بلقطات CGI من الفريق نفسه"),
         ("التنسيق", "أكثر من جهة ومسؤولية موزعة", "فريق واحد من القصة إلى الفيلم النهائي"),
         ("اللغة", "نسخة واحدة غالبًا", "نصوص على الشاشة بالعربية والإنجليزية"),
         ("الاستخدام", "ملفات عامة", "صالة المبيعات والموقع والسوشيال وعروض المستثمرين")],
    steps_h="أربع خطوات من الاستشارة إلى التسليم",
    steps=[("استشارة الإطلاق", "نحدد الهدف والجمهور وأماكن استخدام المواد والموعد."), ("خطة الإنتاج", "سيناريو وقائمة لقطات وجدول، تعتمدها قبل الإنتاج."),
           ("الإنتاج", "فريقنا في الموقع حسب الجدول المعتمد، وبناء لقطات CGI بالتوازي."), ("مونتاج وتسليم", "نسخة أولى لملاحظاتك، ثم الملفات النهائية بكل المقاسات.")],
    faq=[("هل يمكن الإطلاق قبل اكتمال البناء؟", "نعم، هذا هو الأساس. نعتمد على لقطات CGI للمشروع كاملًا، ونضيف مشاهد حقيقية للموقع والمحيط.", ""),
         ("ما حجم المشاريع التي تعملون معها؟", "نعمل مع مطورين لمشاريع متوسطة فأعلى، ونحدد في المكالمة الأولى هل نحن الأنسب لمشروعك.", TODO + " تأكيد العتبة المعتمدة لحجم المشروع"),
         ("كم يستغرق التسليم؟", "تتحدد المدة في خطة الإنتاج حسب حجم العمل، وتعرفها قبل أن تعتمد العرض.", TODO + " المدة النموذجية لفيلم الإطلاق"),
         ("كم جولة تعديل تشمل؟", "نرسل نسخة أولى لملاحظاتك قبل الملفات النهائية.", TODO + " عدد جولات التعديل المشمولة"),
         ("لمن حقوق استخدام المواد؟", "تُكتب حقوق الاستخدام بوضوح في العرض قبل البدء.", TODO + " نص الحقوق المعتمد"),
         ("متى يُدفع؟", "يُكتب جدول الدفعات في العرض قبل البدء.", TODO + " جدول الدفعات"),
         ("كيف يُحدد السعر؟", "حسب نطاق المشروع ومدة الفيلم وعدد لقطات CGI والمخرجات المطلوبة. يصلك العرض بعد المكالمة القصيرة.", "")],
    form_lead="أخبرنا بمشروعك، ونرد خلال 24 ساعة.",
    outs_h="المخرجات", outs=["فيلم رئيسي", "ريلز عمودية", "منظور ثلاثي الأبعاد", "لقطات جوية", "عربي وإنجليزي"],
    il_tag="تصور توضيحي",
    il_alt=["تصور توضيحي: صالة مبيعات عقارية وشاشة كبيرة تعرض فيلم مشروع، ومستشار مبيعات مع مشترٍ",
            "تصور توضيحي: شاشة عرض كبيرة في صالة مبيعات تعرض منظورًا لمشروع عقاري",
            "تصور توضيحي: لوحة قصة مصوّرة من ستة إطارات لفيلم إطلاق",
            "تصور توضيحي: أسرة في ساحة مشروع سكني عند الغروب، من بعيد",
            "تصور توضيحي: غرفة مونتاج بشاشات ومجسم",
            "تصور توضيحي: مخطط عام لمشروع كبير بإضاءة ليلية"],
    types=["فيلم إطلاق لمشروع قائم", "فيلم إطلاق وCGI لمشروع على الخارطة", "لست متأكداً"],
    f_size="حجم المشروع (عدد الوحدات أو القيمة التقريبية) *",
    sizes=["أقل من 100 وحدة أو أقل من 100 مليون ريال", "من 100 إلى 300 وحدة أو من 100 إلى 300 مليون ريال", "أكثر من 300 وحدة أو أكثر من 300 مليون ريال", "لم يُحدد بعد"],
    size_todo="TODO-OWNER: العتبة الافتراضية 100 وحدة أو 100 مليون ريال (تقدير، يعدله المالك). الحقل للفرز الداخلي: لا يُرفض أحد تلقائيًا.",
    og_alt="فعالية ميثاق مكة لرابطة العالم الإسلامي",
))
T["en"].update(dict(
    title="Launch Film and CGI for Real Estate Developers | Graphics House",
    desc="A launch film and cinematic CGI for developers' real estate projects: one launch story for the sales gallery, the site and investors. Get an offer within 24 hours.",
    eyebrow="Real estate project launches · film and CGI · Jeddah",
    h1='Launch your project with a film that <span class="gold">sells the units</span>, not just shows them',
    lead="We build the launch story of your project: a main film and cinematic CGI for what is not built yet, from one team, ready for buyers and investors from day one. For developers of mid-size projects and above.",
    chips=["Launch film", "Project CGI", "Sales and investor materials"],
    stats=[("1", "team from story to final film"), ("AR · EN", "materials in both languages")],
    prob_eyebrow="Why launches fail to sell", prob_h="Three reasons your project launch does not sell",
    prob_lead="For off-plan projects, buyers and investors judge the project by the visuals alone.",
    probs=[("Scattered materials with no story", "A film from one vendor, photos from another, a render from a third. The buyer sees an ordinary project, even when it is not.", "One launch story: a main film, CGI shots and short clips with one identity."),
           ("The project is not built yet", "There is nothing to see on site, and buyers want to see the final result, not the land.", "Cinematic CGI shots of the complete project, with real scenes of the site and surroundings."),
           ("Materials built to show, not to sell", "What was made to document does not serve the sales gallery, the investor meeting or the ad.", "We build the film around where it will be used: the sales gallery, investor pitch, site and social.")],
    offer_eyebrow="The service", offer_tag="Launch service", offer_h="Launch Film and CGI",
    offer_sub="A visual launch system for your project: a film that sells it in the sales gallery, on site, in ads and in investor presentations.",
    offer_items=["The launch story: a script and shot list you approve before production", "A main film for the launch, the sales gallery and the site", "Cinematic CGI shots of the project before it is complete", "Short clips for reels, stories and ads", "On-screen text in Arabic and English"],
    for_h="Best for", for_p="Developers of mid-size projects and above: a project launch, an ad campaign, an investor pitch.",
    prep_h="What we need from you", prep_p="Project plans and identity, the launch date, where the materials will be used, and the project site for real scenes.",
    minor=[], work_eyebrow="Our work", work_h="Work we produced for developers and institutions", work_lead="Click a film to play it, or an image to enlarge it.",
    films=[("../assets/videos/GH-demo-reel-2025.mp4", "../assets/videos/GH-demo-reel-2025-poster.jpg", "Graphics House showreel", "Highlights from our architectural and real estate films: CGI shots, masterplans and facades.", "Graphics House showreel: frame from an architectural film", 1280, 720, False),
           ("../assets/videos/GH-Real-estate-services.mp4", "../assets/videos/GH-Real-estate-services-poster.jpg", "Real estate launch showreel", "Architectural visualisation, cinematic films, scale models and interactive presentations.", "Real estate showreel: frames of a project, a model and a presentation", 720, 1280, True)],
    gal=[("../assets/projects/al-rajhi-naseem/aerial-ultra-01.webp", "Al Rajhi project: CGI aerial view", "Al Rajhi project: aerial view"),
         ("../assets/projects/wahat-al-salam/cam-03.webp", "Wahat Al Salam, Al-Issai: aerial view of the masterplan", "Wahat Al Salam, Al-Issai: masterplan"),
         ("../assets/projects/jeddah-forum/superdome/render-01.webp", "Jeddah Real Estate Forum: Jeddah Superdome 3D model", "Jeddah Real Estate Forum: Jeddah Superdome"),
         ("../assets/projects/albayan-university/albayan-university-01.webp", "Al-Bayan University: CGI aerial view of the campus", "Al-Bayan University"),
         ("../assets/projects/hilton-access-bridge/hilton-access-bridge-01.webp", "Hilton Makkah Bridge: CGI facade and access route", "Hilton Makkah Bridge"),
         ("../assets/projects/wahat-al-salam/cam-12.webp", "Wahat Al Salam, Al-Issai: residential neighbourhood", "Wahat Al Salam, Al-Issai: neighbourhood"),
         ("../assets/projects/rafal-pavilions/film-still.webp", "Rafal Pavilions: frame from the film", "Rafal Pavilions: film frame"),
         ("../assets/projects/al-rajhi-naseem/cam-0.webp", "Al Rajhi project: CGI view of the project", "Al Rajhi project: view")],
    cmp_a="A single vendor (photographer, render studio or editor)",
    cmp=[("Planning", "Shoots first, then picks what works", "A shot list built on your sales plan, approved before production"),
         ("What is not built yet", "Cannot be filmed", "Completed with CGI shots from the same team"),
         ("Coordination", "Several vendors, split responsibility", "One team from story to final film"),
         ("Language", "Usually one version", "On-screen text in Arabic and English"),
         ("Usage", "Generic files", "Sales gallery, site, social and investor presentations")],
    steps_h="Four steps from consultation to delivery",
    steps=[("Launch consultation", "We define the goal, audience, where the materials will be used, and the date."), ("Production plan", "Script, shot list and schedule, approved by you before production."),
           ("Production", "Our team on site per the approved schedule, with CGI shots built in parallel."), ("Edit and delivery", "A first cut for your notes, then final files in every size.")],
    faq=[("Can we launch before construction is complete?", "Yes, that is the core of it. We rely on CGI shots of the complete project and add real scenes of the site and surroundings.", ""),
         ("What size of projects do you work with?", "We work with developers on mid-size projects and above, and on the first call we decide whether we are the right fit for your project.", TODO + " confirm the approved project-size threshold"),
         ("How long does delivery take?", "The timeline is set in the production plan based on the size of the work, and you know it before you approve the offer.", TODO + " typical launch film timeline"),
         ("How many revision rounds are included?", "We send a first cut for your notes before the final files.", TODO + " included revision rounds"),
         ("Who owns the usage rights?", "Usage rights are written clearly in the offer before we start.", TODO + " approved rights wording"),
         ("When do I pay?", "The payment schedule is written in the offer before we start.", TODO + " payment schedule"),
         ("How is the price set?", "By the project scope, film length, number of CGI shots and the outputs you need. You receive the offer after the short call.", "")],
    form_lead="Tell us about your project and we reply within 24 hours.",
    outs_h="Outputs", outs=["Main film", "Vertical reels", "3D views", "Aerial shots", "Arabic and English"],
    il_tag="Illustrative",
    il_alt=["Illustrative: a real estate sales gallery with a large screen showing a project film, a sales advisor and a buyer",
            "Illustrative: a large display screen in a sales gallery showing a view of a real estate project",
            "Illustrative: a six-frame storyboard for a launch film",
            "Illustrative: a family in a residential project plaza at sunset, seen from afar",
            "Illustrative: an edit suite with screens and a maquette",
            "Illustrative: a large project masterplan with night lighting"],
    types=["Launch film for a completed project", "Launch film and CGI for an off-plan project", "Not sure yet"],
    f_size="Project size (units or approximate value) *",
    sizes=["Under 100 units or under SAR 100M", "100 to 300 units or SAR 100M to 300M", "Over 300 units or over SAR 300M", "Not decided yet"],
    size_todo="TODO-OWNER: default threshold 100 units or SAR 100M (an estimate, adjusted by the owner). The field is for internal sorting: nobody is rejected automatically.",
    og_alt="Makkah Charter event for the Muslim World League",
))

ILLUS_DIR = "../assets/projects/illustrative/"
def illus(name, alt, tag, cls="illus"):
    for ext in ("webp", "jpg", "png"):
        rel = f"{ILLUS_DIR}{name}.{ext}"
        if os.path.exists(os.path.join(OUT, rel)):
            out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", os.path.join(OUT, rel)], capture_output=True, text=True).stdout.strip()
            w, h = (out.split("x") + ["", ""])[:2]
            tagh = f'<span class="illus-tag">{tag}</span>' if tag else ""
            return f'<figure class="{cls}"><img src="{rel}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async">{tagh}</figure>'
    return ""
def illus_bg(name):
    for ext in ("webp", "jpg", "png"):
        rel = f"{ILLUS_DIR}{name}.{ext}"
        if os.path.exists(os.path.join(OUT, rel)):
            return rel
    return ""

def build(c):
    L = c["lang"]
    ar = L == "ar"
    todo_html = lambda s: s  # already contains span
    # --- head
    head = f'''<!DOCTYPE html>
<html lang="{L}" dir="{c['dir']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{c['title']}</title>
<meta name="description" content="{c['desc']}">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://3dgraphicshouse.com/lp/{c['self']}">
<link rel="alternate" hreflang="ar" href="https://3dgraphicshouse.com/lp/production.html">
<link rel="alternate" hreflang="en" href="https://3dgraphicshouse.com/lp/production-en.html">
<meta property="og:title" content="{c['title']}">
<meta property="og:description" content="{c['desc']}">
<meta property="og:image" content="https://3dgraphicshouse.com/assets/projects/galleries/makkah-charter-01.jpg">
<meta property="og:image:alt" content="{c['og_alt']}">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
<script src="../assets/gh-forms-config.js?v=2"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NKM4H1FFBL"></script>
<script>if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){{window['ga-disable-G-NKM4H1FFBL']=true;window['ga-disable-G-Y67JVE898Z']=true;}}window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}window.gtag=gtag;gtag('js',new Date());gtag('config','G-NKM4H1FFBL');gtag('config','G-Y67JVE898Z');</script>
<script defer src="../assets/gh-analytics.js?v=3"></script>
<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. IDs are added by the owner after approval; see lp-v2.js (GH_ADS). -->
<link rel="stylesheet" href="lp.css?v=3">
<link rel="stylesheet" href="lp-v2.css?v=5">
<link rel="preload" as="image" href="../assets/videos/GH-Epic-cinematic-arch-hero-poster.jpg">
</head>
'''

    body_open = (f'<body class="live" data-page="lp_production_{L}" data-service="Production" data-subject="{c["subject"]}" '
                 f'data-msg="{c["msg"]}" data-ptype="{c["f_type"].rstrip(" *")}">\n'
                 f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wa" viewBox="0 0 24 24"><path d="{WA_PATH}"/></symbol></svg>\n' + sprite())

    lang_sw = (f'<div class="lang"><a href="{c["other"]}">{"EN" if ar else "AR"}</a><span>|</span><a href="{c["self"]}" class="on">{"AR" if ar else "EN"}</a></div>'
               if ar else
               f'<div class="lang"><a href="{c["self"]}" class="on">EN</a><span>|</span><a href="{c["other"]}">AR</a></div>')
    header = (f'<header class="hdr"><div class="wrap"><img src="../assets/logo-gold.png" alt="Graphics House" width="732" height="344">'
              f'<div class="hdr-r">{lang_sw}<a class="btn btn-gold btn-sm" href="#request" data-cta="header">{c["cta_short"]}</a></div></div></header>\n')

    chips = "".join(f"<span>{x}</span>" for x in c["chips"])
    hero = (f'<main>\n<section class="hero v2" style="padding:0"><picture>'
            f'<img src="../assets/videos/GH-Epic-cinematic-arch-hero-poster.jpg" alt="{c["hero_alt"]}" width="1280" height="720" fetchpriority="high"></picture>'
            f'<video class="hero-vid" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" '
            f'data-src="../assets/videos/GH-Epic-cinematic-arch-hero-1280.mp4" data-src-m="../assets/videos/GH-Epic-cinematic-arch-hero-mobile.mp4"></video>'
            f'<div class="wrap"><p class="eyebrow">{c["eyebrow"]}</p><h1>{c["h1"]}</h1><p class="lead">{c["lead"]}</p>'
            f'<div class="cta-row"><a class="btn btn-gold" href="#request" data-cta="hero-primary">{c["cta"]}</a>'
            f'<a class="btn btn-ghost" href="{wa(c["wa_hero"])}" target="_blank" rel="noopener" data-cta="hero-whatsapp">{WA_ICON} {c["wa_label"]}</a></div>'
            f'<p class="micro">{ic("reply24", "ic ic-sm")} {c["micro"]}</p><div class="chips">{chips}</div></div></section>\n')

    stats = "".join(f"<div><b>{n}</b>{t}</div>" for n, t in c["stats"])
    oc = "".join(f"<div><b>{n}</b>{t}</div>" for n, t in c["owner_claims"])
    proof = (f'<div class="proof"><div class="wrap"><div class="proof-top">{stats}</div>'
             f'<!-- {c["owner_claims_note"]} -->\n<div class="proof-top owner-claims" hidden>{oc}</div>\n'
             f'<div><p class="logos-lead">{c["logos_lead"]}</p><div class="marquee" aria-label="{c["logos_lead"]}"><div class="track">{logos_html}<span aria-hidden="true" class="dup">{logos_html}</span></div></div></div></div></div>\n')

    cards = "".join(f'<div class="card"><h3>{h}</h3><p>{p}</p><p class="fix"><b>{c["fixlbl"]}</b> {f}</p></div>' for h, p, f in c["probs"])
    prob = (f'<section><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["prob_eyebrow"]}</p><h2>{c["prob_h"]}</h2>'
            f'<p class="lead">{c["prob_lead"]}</p></div>' + illus("01-sales-gallery", c["il_alt"][0], c["il_tag"], "illus illus-wide") + f'<div class="grid g3">{cards}</div></div></section>\n')

    items = "".join(f'<li class="has-ic">{ic(k)}<span>{x}</span></li>' for k, x in zip(["script", "film", "view3d", "reels", "bilingual"], c["offer_items"]))
    outs = "".join(f'<div>{ic(k, "ic ic-lg")}<span>{t}</span></div>' for k, t in zip(["film", "reels", "view3d", "aerial", "bilingual"], c["outs"]))
    minor = "".join(
        f'<div class="card"><h3>{h}</h3><p><b>{"مناسبة لـ" if ar else "Best for"}:</b> {f}</p><p>{d}</p>'
        f'<a class="btn btn-line" href="#request" data-pkg="{pk}" data-cta="minor-{i}">{c["minor_cta"]}</a></div>'
        for i, (h, f, d, pk) in enumerate(c["minor"], 1))
    offer = (f'<section class="alt" id="offer"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["offer_eyebrow"]}</p></div>'
             f'<div class="offer"><span class="pk-tag">{c["offer_tag"]}</span><div><h3>{c["offer_h"]}</h3><p class="sub">{c["offer_sub"]}</p><ul>{items}</ul>'
             f'<a class="btn btn-gold" href="#request" data-pkg="{c["offer_pkg"]}" data-cta="offer-primary">{c["cta"]}</a>'
             f'<div class="price-strip" hidden data-todo-owner="price">{c["price_note"]}</div></div>'
             f'<div class="for">' + illus("06-masterplan-night", c["il_alt"][5], c["il_tag"]) + f'<b>{c["for_h"]}</b><p>{c["for_p"]}</p><b>{c["prep_h"]}</b><p>{c["prep_p"]}</p></div>'
             + f'<div class="outs" aria-label="{c["outs_h"]}">{outs}</div></div>'
             + illus("02-led-screen", c["il_alt"][1], c["il_tag"], "illus illus-wide")
             + (f'<div class="minor">{minor}</div>' if minor else '') + '</div></section>\n')

    films = "".join(
        f'<button type="button" class="film" data-mp4="{mp4}" data-cta="film-{i}"><span class="film-th{" is-local" if contain else ""}">'
        f'<img src="{poster}" alt="{alt}" loading="lazy" width="{w}" height="{h}"><i>{PLAY}</i></span><b>{t}</b><small>{d}</small></button>'
        for i, (mp4, poster, t, d, alt, w, h, contain) in enumerate(c["films"], 1))
    def dims(rel):
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", os.path.join(OUT, rel)], capture_output=True, text=True).stdout.strip()
        w, h = out.split("x")[:2]
        return w, h
    def fig2(src, alt, cap):
        w, h = dims(src)
        return (f'<figure tabindex="0" data-full="{src}"><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async">'
                f'<figcaption>{cap}</figcaption></figure>')
    gal = "".join(fig2(f, a, cap) for f, a, cap in c["gal"])
    cases = "".join(
        f'<div class="case"><span class="tag">{tag}</span><h3>{h}</h3><p>{p}</p><p class="gives">{g}</p><ul>{"".join(f"<li>{x}</li>" for x in lis)}</ul>'
        f'<a href="{href}" target="_blank" rel="noopener">{lbl}</a> {TODO.replace("TODO-OWNER", todo)}</div>'
        for tag, h, p, g, lis, href, lbl, todo in c["cases"])
    work = (f'<section class="dark" id="work"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["work_eyebrow"]}</p><h2>{c["work_h"]}</h2>'
            f'<p class="lead">{c["work_lead"]}</p></div>'
            f'<div class="films">{films}</div>'
            f'<div class="gal g2c" style="margin-top:44px">{gal}</div><div class="cases">{cases}</div></div></section>\n')

    rows = "".join(f'<tr><th scope="row">{a}</th><td data-l="{c["cmp_a"]}">{b}</td><td data-l="Graphics House">{g}</td></tr>' for a, b, g in c["cmp"])
    cmpsec = (f'<section><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["cmp_eyebrow"]}</p><h2>{c["cmp_h"]}</h2></div>'
              + illus("04-life-after-build", c["il_alt"][3], c["il_tag"], "illus illus-wide") + f'<div class="cmp-wrap"><table class="cmp"><thead><tr><th scope="col"></th><th scope="col">{c["cmp_a"]}</th><th scope="col" class="gh">Graphics House</th></tr></thead>'
              f'<tbody>{rows}</tbody></table></div>'
              f'<div class="center" style="margin-top:30px"><a class="btn btn-gold" href="#request" data-cta="compare">{c["cta"]}</a></div></div></section>\n')
    steps = "".join(f'<div class="card"><div class="step-top"><div class="num">{i}</div>{ic(k, "ic ic-lg")}</div><h3>{h}</h3><p>{p}</p></div>' for i, ((h, p), k) in enumerate(zip(c["steps"], ["consult", "script", "produce", "deliver"]), 1))
    il35 = illus("03-storyboard", c["il_alt"][2], c["il_tag"]) + illus("05-edit-suite", c["il_alt"][4], c["il_tag"])
    stepsec = (f'<section class="alt"><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["steps_eyebrow"]}</p><h2>{c["steps_h"]}</h2></div>'
               f'<div class="steps">{steps}</div>' + (f'<div class="illus-pair">{il35}</div>' if il35 else '') + '</div></section>\n')

    faq = "".join(f"<details><summary>{q}</summary><p>{a} {t}</p></details>" for q, a, t in c["faq"])
    faqsec = (f'<section><div class="wrap"><div class="sec-head center"><p class="eyebrow">{c["faq_eyebrow"]}</p><h2>{c["faq_h"]}</h2></div>'
              f'<div class="faqw">{faq}</div></div></section>\n')

    nexts = "".join(f'<li><div class="num num-ic">{ic(k)}</div><div><b>{b}</b><p>{p}</p></div></li>' for (b, p), k in zip(c["nexts"], ["reply24", "consult", "approved"]))
    stg = "".join(f'<label><input type="radio" name="qs" value="{s}"><span>{s}</span></label>' for s in c["stages"])
    whn = "".join(f'<label><input type="radio" name="qw" value="{s}"><span>{s}</span></label>' for s in c["whens"])
    quick = (f'<div class="quick" id="quick" data-msg="{c["wa_quick"]}"><b>{c["quick_h"]}</b>'
             f'<div class="qgrp"><span>{c["quick_stage"]}</span><div class="qchips">{stg}</div></div>'
             f'<div class="qgrp"><span>{c["quick_when"]}</span><div class="qchips">{whn}</div></div>'
             f'<a class="btn btn-gold" id="quickWa" href="{wa(c["wa_quick"])}" target="_blank" rel="noopener" data-cta="quick-whatsapp">{WA_ICON} {c["quick_btn"]}</a></div>'
             f'<p class="or">{c["or_txt"]}</p>')
    types = "".join(f"<option>{t}</option>" for t in c["types"])
    sizes = "".join(f"<option>{t}</option>" for t in c["sizes"])
    attrs = "".join(f'<input type="hidden" name="{k}" data-attr="{k}">' for k in ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ttclid", "ScCid"])
    bg7 = illus_bg("07-ornament")
    form = (f'<section class="formsec{" has-orn" if bg7 else ""}" id="request"' + (f' style="--orn:url({bg7})"' if bg7 else '') + '>'
            f'<div class="wrap fgrid"><div><p class="eyebrow">{c["form_eyebrow"]}</p><h2>{c["form_h"]}</h2>'
            f'<p class="lead">{c["form_lead"]}</p><ul class="next-list">{nexts}</ul>{quick}</div>'
            f'<form id="lpFormV2" class="v2" novalidate>'
            f'<div class="f"><label for="n">{c["f_name"]}</label><input id="n" name="name" autocomplete="name" required></div>'
            f'<div class="f"><label for="p">{c["f_phone"]}</label><input id="p" name="phone" type="tel" inputmode="tel" autocomplete="tel" required></div>'
            f'<div class="f"><label for="c">{c["f_company"]}</label><input id="c" name="company" autocomplete="organization" required></div>'
            f'<div class="f"><label for="t">{c["f_type"]}</label><select id="t" name="project_type" required><option value="" selected disabled>{c["f_sel"]}</option>{types}</select></div>'
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
            f'<script src="lp.js?v=3"></script>\n<script src="lp-v2.js?v=5"></script>\n</body>\n</html>\n')

    return head + body_open + header + hero + proof + prob + offer + work + cmpsec + stepsec + faqsec + form + foot


def thanks(c):
    L = c["lang"]; ar = L == "ar"
    t = dict(
        title="تم استلام طلبك | Graphics House" if ar else "Request received | Graphics House",
        h="تم استلام طلبك" if ar else "Request received",
        lead="سنتواصل معك خلال 24 ساعة." if ar else "We will contact you within 24 hours.",
        steps=[("نراجع طلبك", "نقرأ بياناتك ونجهّز أسئلة مكالمة قصيرة.") , ("نتواصل معك", "على واتساب أو الهاتف لتحديد موعد المكالمة."), ("خطة اللقطات وعرض السعر", "تصلك بعد المكالمة، قبل أي التزام.")] if ar else
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NKM4H1FFBL"></script>
<script>if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){{window['ga-disable-G-NKM4H1FFBL']=true;window['ga-disable-G-Y67JVE898Z']=true;}}window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}window.gtag=gtag;gtag('js',new Date());gtag('config','G-NKM4H1FFBL');gtag('config','G-Y67JVE898Z');</script>
<!-- Ad pixels (Meta, Snap, TikTok): EMPTY slots. Fire the lead/conversion pixel event here once the owner adds the IDs. -->
<link rel="stylesheet" href="lp.css?v=3">
<link rel="stylesheet" href="lp-v2.css?v=5">
</head>
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


import os
os.makedirs(OUT, exist_ok=True)
write_files(os.path.join(OUT, '..', 'assets', 'lp', 'icons'))
for key, name in (("ar", "production.html"), ("en", "production-en.html")):
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(build(T[key]))
for key, name in (("ar", "thanks.html"), ("en", "thanks-en.html")):
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(thanks(T[key]))
print("ok")
