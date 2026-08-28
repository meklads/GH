#!/usr/bin/env node
/**
 * Phase 2: custom viral TL;DR, direct answers, callouts, and key tables for all insight articles.
 * Run before build-insights.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'insights/data/articles');

/** @type {Record<string, { tldr: {ar:string,en:string}, directAnswer: {ar:string,en:string}, callout: {ar:string,en:string}, table?: { ar: TableBlock, en: TableBlock } }>} */
const HOOKS = {
  'ai-archviz-future': {
    tldr: {
      ar: 'الذكاء الاصطناعي يسرّع الإظهار — لا يستبدل الدقة المعمارية. الفائز في الخليج: سير عمل هجين (AI + فريق بشري + اعتمادات معمارية) قبل الإطلاق.',
      en: 'AI speeds archviz — it does not replace architectural accuracy. GCC winners use a hybrid workflow (AI + human QA + architect sign-off) before launch.',
    },
    directAnswer: {
      ar: 'مستقبل الإظهار المعماري في الخليج يعتمد على دمج AI في الإنتاج مع مراجعة بشرية ومواصفات معتمدة. المطور يحتاج سياسة جودة واضحة: ما يُنتج بالآلة، وما يُراجع، وما يُعرض للمشتري off-plan.',
      en: 'The future of GCC archviz is hybrid: AI accelerates production while human review and approved specs protect sales credibility. Developers need a clear quality policy for what AI generates, what gets reviewed, and what reaches off-plan buyers.',
    },
    callout: {
      ar: '💡 قبل أي حملة: لا تنشر رندر AI دون مطابقة ملف التشطيب والواجهة المعتمد — خطأ واحد يكلف أسبوعاً من ثقة المشتري.',
      en: '💡 Before any campaign: never publish AI renders without matching approved façade and finish specs — one mismatch costs a week of buyer trust.',
    },
  },
  'choosing-archviz-studio-gcc': {
    tldr: {
      ar: 'اختر استوديو الإظهار بثلاثة معايير: خبرة مشاريع GCC، مسار اعتماد واضح، وربط المخرجات بجدول المبيعات — لا بسعر الصورة الواحدة.',
      en: 'Choose an archviz studio on three criteria: GCC project experience, a clear approval path, and outputs tied to your sales timeline — not price per image.',
    },
    directAnswer: {
      ar: 'أفضل استوديو إظهار للمشاريع الكبرى في الخليج يفهم off-plan، يسلّم بصيغ متعددة (صالة بيع، سوشيال، طباعة)، ويعمل مع المعماري على التعديلات دون إعادة بناء كاملة.',
      en: 'The best GCC archviz studio for major projects understands off-plan sales, delivers multi-format assets (gallery, social, print), and handles design revisions without full rebuilds.',
    },
    callout: {
      ar: '🔍 اسأل دائماً: «من يملك ملف المصدر 3D بعد الإطلاق؟» — الإجابة الخاطئة تكلفك إعادة إنتاج عند تغيير التشطيب.',
      en: '🔍 Always ask: “Who owns the source 3D file after launch?” — the wrong answer means re-production when finishes change.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'معايير اختيار استوديو الإظهار — نقاط سريعة',
        headers: ['المعيار', 'سؤال للاستوديو', 'إشارة خضراء'],
        rows: [
          ['خبرة GCC', 'كم مشروع off-plan أطلقتموه؟', 'مراجع مبيعات + معرض'],
          ['الجودة', 'من يراجع الدقة المعمارية؟', 'مسار اعتماد مكتوب'],
          ['التسليم', 'ما الصيغ يوم الإطلاق؟', 'صالة + فيلم + سوشيال'],
        ],
      },
      en: {
        type: 'table',
        caption: 'Archviz studio selection — quick scorecard',
        headers: ['Criterion', 'Ask the studio', 'Green flag'],
        rows: [
          ['GCC experience', 'How many off-plan launches?', 'Sales + gallery references'],
          ['Quality', 'Who checks architectural accuracy?', 'Written approval path'],
          ['Delivery', 'What formats on launch day?', 'Gallery + film + social'],
        ],
      },
    },
  },
  'cinematic-cgi-vs-static-renders': {
    tldr: {
      ar: 'الرندر الثابت يبيع الزاوية — الفيلم السينمائي يبيع القرار. استخدم CGI عند الإطلاق والمنافسة العالية؛ الرندر للكتalog والموافقات السريعة.',
      en: 'Static renders sell the angle — cinematic film sells the decision. Use CGI for launch and competitive schemes; stills for catalogs and fast approvals.',
    },
    directAnswer: {
      ar: 'اختر CGI سينمائياً عند إطلاق off-plan تنافسي، حملات رقمية، أو شرح masterplan معقد. اختر رندرات ثابتة للكتalog، لوحات الصالة، والاعتمادات الداخلية — غالباً تحتاج الاثنين معاً.',
      en: 'Choose cinematic CGI for competitive off-plan launches, digital campaigns, or complex masterplans. Choose static renders for catalogs, gallery panels, and internal approvals — most launches need both.',
    },
    callout: {
      ar: '🎬 قاعدة عملية: فيلم 60–90 ثانية للإطلاق الرقمي + 5–8 رندرات بطولية للصالة — لا تختار واحداً على حساب الآخر.',
      en: '🎬 Practical rule: 60–90s film for digital launch + 5–8 hero stills for the gallery — do not pick one at the expense of the other.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'متى CGI سينمائي vs رندر ثابت',
        headers: ['الحالة', 'CGI سينمائي', 'رندر ثابت'],
        rows: [
          ['إطلاق off-plan تنافسي', '✓ أساسي', '✓ داعم'],
          ['كتalog / لوحات صالة', 'اختياري', '✓ أساسي'],
          ['اعتماد معماري سريع', '—', '✓'],
          ['حملة سوشيال / فيديو', '✓', 'قصاصات'],
        ],
      },
      en: {
        type: 'table',
        caption: 'When to use cinematic CGI vs static renders',
        headers: ['Scenario', 'Cinematic CGI', 'Static render'],
        rows: [
          ['Competitive off-plan launch', '✓ Core', '✓ Support'],
          ['Catalog / gallery panels', 'Optional', '✓ Core'],
          ['Fast architect approval', '—', '✓'],
          ['Social / video campaign', '✓', 'Cutdowns'],
        ],
      },
    },
  },
  'completed-finishes-tour-visual-story': {
    tldr: {
      ar: 'جولة التشطيبات المكتملة + رندر مطابق = ثقة الوسيط والمشتري. اربط لوحة المواد بالصورة قبل أي زيارة صالة.',
      en: 'Completed finishes tour + matched render = broker and buyer trust. Link the material board to the image before any gallery visit.',
    },
    directAnswer: {
      ar: 'لبيع التشطيبات قبل التسليم: صوّر أو اعرض مواد حقيقية مع رندر بنفس الكود والإضاءة، ثم درّب المبيعات على سرد «من اللوحة إلى الوحدة» في أقل من 3 دقائق.',
      en: 'To sell finishes before handover: show real materials alongside renders with matching codes and lighting, then train sales on a under-3-minute “board to unit” story.',
    },
    callout: {
      ar: '⚠️ الفجوة الأكثر تكلفة: رندر فاخر + عينة تشطيب مختلفة في الصالة — المشتري يلاحظ فوراً.',
      en: '⚠️ Costliest gap: luxury render + different finish sample in gallery — buyers notice immediately.',
    },
  },
  'finishes-spec-visualization-gap': {
    tldr: {
      ar: 'المواصفات والإظهار المنفصلان يقتلان التحويل. وحّد ملف التشطيب، الرندر، وعينة الصالة في مرجع واحد قبل الإطلاق.',
      en: 'Split specs and visualization kill conversion. Unify finish file, render, and gallery sample in one reference before launch.',
    },
    directAnswer: {
      ar: 'سبب فقدان الثقة في صالة البيع: رندر يعرض تشطيباً غير موجود في جدول BOQ أو العينة. الحل: مرجع تشطيب بصري واحد يعتمد من التسويق والمبيعات والمورد.',
      en: 'Why sales floors lose trust: renders show finishes not in the BOQ or sample board. Fix: one visual finish reference approved by marketing, sales, and procurement.',
    },
    callout: {
      ar: '📋 اختبار 30 ثانية: هل رقم كود التشطيب في الرندر = العينة في الصالة؟ إن لا — أوقف الإطلاق.',
      en: '📋 30-second test: Does the finish code in the render match the gallery sample? If not — pause launch.',
    },
  },
  'interactive-sales-gallery': {
    tldr: {
      ar: 'صالة البيع التفاعلية ليست شاشة — منظومة: masterplan + اختيار وحدة + فيلم + مجسم. ابدأ من رحلة المشتري، لا من قائمة الميزات.',
      en: 'An interactive sales gallery is not a screen — it is a system: masterplan + unit picker + film + model. Start from buyer journey, not feature lists.',
    },
    directAnswer: {
      ar: 'صالة مبيعات تفاعلية ناجحة تسمح للمشتري بفهم الموقع، مقارنة الوحدات، ورؤية التشطيب في جلسة واحدة 10–15 دقيقة — مع محتوى متسق مع الحملة الرقمية.',
      en: 'A successful interactive gallery lets buyers understand site context, compare units, and see finishes in one 10–15 minute session — with content consistent with digital campaigns.',
    },
    callout: {
      ar: '🖥️ خطأ شائع: شاشة 4K بمحتوى قديم — التفاعل بدون تحديث أسوأ من لوحة مطبوعة.',
      en: '🖥️ Common mistake: 4K screen with outdated content — interactivity without updates is worse than print.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'طبقات تجربة صالة البيع التفاعلية',
        headers: ['الطبقة', 'الهدف', 'مؤشر نجاح'],
        rows: [
          ['Masterplan', 'فهم الموقع', 'المشتري يشرح الموقع بنفسه'],
          ['اختيار وحدة', 'مقارنة', '≤3 دقائق للوحدة المفضلة'],
          ['تشطيب / فيلم', 'ثقة', 'أسئلة أقل عن «هل هذا حقيقي؟»'],
        ],
      },
      en: {
        type: 'table',
        caption: 'Interactive sales gallery layers',
        headers: ['Layer', 'Goal', 'Success signal'],
        rows: [
          ['Masterplan', 'Site context', 'Buyer explains location unprompted'],
          ['Unit picker', 'Comparison', '≤3 min to shortlist'],
          ['Finishes / film', 'Trust', 'Fewer “is this real?” questions'],
        ],
      },
    },
  },
  'jeddah-red-sea-visual-launch': {
    tldr: {
      ar: 'إطلاق جدة والبحر الأحمر يحتاج هوية ساحلية + إظهار يخدم السياحة والسكن — لا نسخ قالب الرياض حرفياً.',
      en: 'Jeddah and Red Sea launches need coastal identity + visuals for tourism and residential — do not copy Riyadh templates literally.',
    },
    directAnswer: {
      ar: 'مشاريع غرب المملكة والبحر الأحمر تبيع المناخ والوصول والأسلوب الحياتي. الإطلاق البصري يجب أن يظهر السياق الساحلي، البنية التحتية، والوعد المعيشي — مع مواد عربية وإنجليزية للمستثمر الخليجي.',
      en: 'Western Province and Red Sea projects sell climate, access, and lifestyle. Visual launch must show coastal context, infrastructure, and livability — with Arabic and English assets for Gulf investors.',
    },
    callout: {
      ar: '🌊 في جدة: زاوية «الوصول للبحر / المطار / الكورنيش» غالباً أقوى من صورة برج منفرد.',
      en: '🌊 In Jeddah: “sea / airport / corniche access” angles often outperform a standalone tower shot.',
    },
  },
  'makkah-b2b-workforce-housing-viz': {
    tldr: {
      ar: 'سكن workforce في مكة = سعة، امتثال، وكفاءة — لا lifestyle فاخر. الإظهار يجب أن يطمئن المستثمر B2B لا المشتري التجزئة.',
      en: 'Makkah workforce housing = capacity, compliance, efficiency — not luxury lifestyle. Visuals must reassure B2B investors, not retail buyers.',
    },
    directAnswer: {
      ar: 'تصور مشاريع سكن العمال في مكة يركز على الكثافة، المسارات، المرافق، والامتثال — بلغة بصرية محافظة وواضحة دون مبالغة تسويقية.',
      en: 'Visualizing Makkah workforce housing focuses on density, circulation, amenities, and compliance — with conservative, clear visuals and no misleading marketing hype.',
    },
    callout: {
      ar: '🏗️ للمستثمر B2B: مخطط طوابق + جدول سعة + فيلم قصير للمسارات — أسرع من رندر lobby فاخر.',
      en: '🏗️ For B2B investors: floor plates + capacity table + short circulation film beat a luxury lobby render.',
    },
  },
  'makkah-hospitality-near-haram-viz': {
    tldr: {
      ar: 'ضيافة قرب الحرم: بِع جودة الإقامة والخدمة — لا تقرباً مضللاً. كل إطار بصري يمر بمراجعة حساسية المكان.',
      en: 'Near-Haram hospitality: sell stay quality and service — not misleading proximity. Every frame passes place-sensitivity review.',
    },
    directAnswer: {
      ar: 'إظهار فنادق وضيافة قرب مكة يتطلب دقة في الزوايا والمسافات واللغة البصرية. الهدف: ثقة الضيف والمستثمر دون ادعاءات « على بعد X من الحرم » غير verifiable.',
      en: 'Visualizing near-Haram hospitality requires accuracy in angles, distances, and tone. Goal: guest and investor trust without unverifiable “X meters from Haram” claims.',
    },
    callout: {
      ar: '🕌 قاعدة ذهبية: لا زاوية كamera تُظهر minaret أو حرم إلا بموافقة written compliance.',
      en: '🕌 Golden rule: no camera angle showing minaret or Haram unless written compliance approval.',
    },
  },
  'makkah-project-visual-sensitivity': {
    tldr: {
      ar: 'مشاريع مكة تحتاج إظهاراً دقيقاً ومحترماً — الحساسية ليست قيداً إبداعياً، بل شرط ثقة المستثمر.',
      en: 'Makkah projects need accurate, respectful visualization — sensitivity is not a creative limit, it is investor trust.',
    },
    directAnswer: {
      ar: 'التصور المعماري في مكة يوازن بين متطلبات المبيعات و sensitivities دينية ومكانية. الفريق البصري يعمل مع compliance من اليوم الأول، قبل إنتاج أي أصل عام.',
      en: 'Archviz in Makkah balances sales needs with religious and place sensitivities. The visual team aligns with compliance from day one, before any public asset is produced.',
    },
    callout: {
      ar: '✅ checklist مكة: compliance → زوايا → نصوص → موافقة → نشر. لا عكس الترتيب.',
      en: '✅ Makkah checklist: compliance → angles → copy → approval → publish. Never reverse the order.',
    },
  },
  'masterplan-community-visual-sales': {
    tldr: {
      ar: 'بيع المجمعات المخططة = إيقاع حياة + مرافق + تدرج مراحل — لا واجهة واحدة hero. المشتري يشتري «يومه» في الحي.',
      en: 'Master-planned community sales = lifestyle rhythm + amenities + phasing — not one hero façade. Buyers purchase their day in the neighborhood.',
    },
    directAnswer: {
      ar: 'مبيعات المخططات الرئيسية تنجح عندما يفهم المشتري: أين يمشي، أين يأكل أطفاله، وكيف تتدرج المراحل. الإظهار يخدم خريطة الحياة لا صورة برج.',
      en: 'Masterplan sales succeed when buyers understand where they walk, where their kids play, and how phases roll out. Visuals serve a life map, not a tower shot.',
    },
    callout: {
      ar: '🗺️ أقوى أصل: فيلم masterplan 90 ث + خريطة مرافق تفاعلية — قبل أي interior فاخر.',
      en: '🗺️ Strongest asset: 90s masterplan film + interactive amenities map — before luxury interiors.',
    },
  },
  'mixed-use-gate-visual-launch': {
    tldr: {
      ar: 'mixed-use: بِع المزيج (تجاري + سكن + مكاتب) في سرد واحد — المشتري يريد فهم التدفق لا أقساماً منفصلة.',
      en: 'Mixed-use gate: sell the blend (retail + residential + office) in one narrative — buyers need flow and payoff, not silos.',
    },
    directAnswer: {
      ar: 'إطلاق بوابة متعددة الاستخدام يتطلب إظهار masterplan، واجهة مشتركة، وmix واضح للوحدات. كل أصل يجيب: «من يسكن، من يعمل، من يتسوق؟»',
      en: 'Mixed-use gate launch requires masterplan, shared frontage, and clear product mix visuals. Every asset answers: “Who lives, works, and shops here?”',
    },
    callout: {
      ar: '🏙️ خطأ: فيلم سكني فقط لمشروع 40% تجاري — يضلل المستثمر والمستأجر.',
      en: '🏙️ Mistake: residential-only film for a 40% retail scheme — misleads investors and tenants.',
    },
  },
  'office-pavilion-visual-launch': {
    tldr: {
      ar: 'pavilion مكاتب: بِع إنتاجية المكان ومرونة المساحة — لا أسلوب حياة سكني. العميل مؤسسي أو مستثمر CRE.',
      en: 'Office pavilion: sell workplace productivity and space flexibility — not residential lifestyle. The buyer is corporate or CRE investor.',
    },
    directAnswer: {
      ar: 'إطلاق pavilion مكاتب يحتاج رenders للobby، typical floor، وcoworking + فيلم قصير للتدفق اليومي. اللغة البصرية corporate نظيفة — بعيدة عن warm residential staging.',
      en: 'Office pavilion launch needs lobby, typical floor, and coworking renders + short daily-flow film. Visual language is clean corporate — away from warm residential staging.',
    },
    callout: {
      ar: '💼 للـ CRE: NLA، typical floor، parking ratio على لوحة واحدة بجانب الفيلم.',
      en: '💼 For CRE: NLA, typical floor, parking ratio on one panel beside the film.',
    },
  },
  'photorealistic-sells-before-construction': {
    tldr: {
      ar: 'الفوتوريализم يبيع لأنه يقلّل مخاطر قرار off-plan — المشتري يرى «منتجاً» لا «وعداً». الجودة = سرعة حجز.',
      en: 'Photorealism sells because it reduces off-plan decision risk — buyers see a product, not a promise. Quality = faster booking.',
    },
    directAnswer: {
      ar: 'صور فوتorealistic دقيقة ترفع التحويل في مبيعات ما قبل البناء لأنها تختصر فجوة الخيال. في الخليج، المشتري يقارن 3 مشاريع في أسبوع — الأضعف بصرياً يُستبعد أولاً.',
      en: 'Accurate photorealistic imagery raises off-plan conversion by closing the imagination gap. In the GCC, buyers compare three schemes per week — the weakest visual is eliminated first.',
    },
    callout: {
      ar: '📈 مطورون في الرياض: تحسين hero render واحد قبل الحملة often يظهر في leads الأسبوع الأول.',
      en: '📈 Riyadh developers: upgrading one hero render before the campaign often shows in week-one leads.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'تأثير الفوتوريализм على قرار الشراء',
        headers: ['العامل', 'ضعيف', 'قوي'],
        rows: [
          ['ثقة off-plan', 'شك', 'حجز أسرع'],
          ['مقارنة المنافس', 'يُستبعد', 'في القائمة المختصرة'],
          ['سعر perceived', 'ضغط خصم', 'premium محتمل'],
        ],
      },
      en: {
        type: 'table',
        caption: 'Photorealism impact on purchase decision',
        headers: ['Factor', 'Weak visual', 'Strong visual'],
        rows: [
          ['Off-plan trust', 'Doubt', 'Faster booking'],
          ['Competitor compare', 'Eliminated', 'Shortlisted'],
          ['Perceived value', 'Discount pressure', 'Premium potential'],
        ],
      },
    },
  },
  'project-launch-oman-developers': {
    tldr: {
      ar: 'عُمان: إطلاق بصري يراعي السوق المحلي + المستثمر الخليجي — توقيت أهدأ، جودة أعلى، قنوات relationship-heavy.',
      en: 'Oman: visual launch for local market + Gulf investor — slower timing, higher quality, relationship-heavy channels.',
    },
    directAnswer: {
      ar: 'مطور عُمان يحتاج منظومة إطلاق: هوية، رenders، فيلم، ومواد صالة — مع لمسة محلية (Muscat / Salalah / Sohar) ومحتوى EN للمستثمر الإقليمي.',
      en: 'Oman developers need a launch system: identity, renders, film, gallery materials — with local context (Muscat / Salalah / Sohar) and EN content for regional investors.',
    },
    callout: {
      ar: '🇴🇲 في عُمان: جودة few assets > حجم many assets — السوق يكافئ الدقة.',
      en: '🇴🇲 In Oman: quality of few assets beats volume — the market rewards precision.',
    },
  },
  'project-launch-saudi-developers': {
    tldr: {
      ar: 'المطور السعودي: ProjectLaunch = رenders + فيلم + صالة + حملة — قبل يوم المبيعات بـ6 أشهر، ليس قبلها بـ6 أسابيع.',
      en: 'Saudi developers: ProjectLaunch = renders + film + gallery + campaign — 6 months before sales day, not 6 weeks.',
    },
    directAnswer: {
      ar: 'قبل إطلاق المبيعات في السعودية: masterplan معتمد، 8–12 أصل بطولي، فيلم 60–90 ث، صالة أو منصة رقمية، وتدريب مبيعات 10 دقائق — مع مالك إطلاق واحد من التسويق.',
      en: 'Before Saudi sales launch: approved masterplan, 8–12 hero assets, 60–90s film, gallery or digital platform, and 10-minute sales training — with one marketing launch owner.',
    },
    callout: {
      ar: '🇸🇦 ROSHN وغيرهم raised the bar — «جيد» لم يعد كافياً في الرياض وجدة.',
      en: '🇸🇦 ROSHN and peers raised the bar — “good enough” no longer works in Riyadh and Jeddah.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'ماذا يحتاج المطور السعودي قبل يوم الإطلاق',
        headers: ['البند', 'الحد الأدنى', 'م competitive'],
        rows: [
          ['أصول بطولية', '5', '8–12'],
          ['فيلم', '30 ث', '60–90 ث'],
          ['صالة / رقمي', 'لوحات', 'تفاعلي + مجسم'],
        ],
      },
      en: {
        type: 'table',
        caption: 'What Saudi developers need before launch day',
        headers: ['Item', 'Minimum', 'Competitive'],
        rows: [
          ['Hero assets', '5', '8–12'],
          ['Film', '30s', '60–90s'],
          ['Gallery / digital', 'Panels', 'Interactive + model'],
        ],
      },
    },
  },
  'riyadh-north-villa-compound-viz': {
    tldr: {
      ar: 'مجمعات فلل شمال الرياض: بِع الخصوصية ومقارنة النماذج — لا صورة فیلا واحدة. المشتري يختار بين A/B/C.',
      en: 'North Riyadh villa compounds: sell privacy and model comparison — not one villa hero. Buyers choose between A/B/C.',
    },
    directAnswer: {
      ar: 'تصور مجمعات الفلل في شمال الرياض يحتاج: masterplan للخصوصية، renders لـ3 نماذج على الأقل، وinteriors للنموذج الأكثر مبيعاً — مع مسارات واضحة في الصالة.',
      en: 'North Riyadh villa compound viz needs: privacy masterplan, renders for at least three typologies, and interiors for the best-selling model — with clear gallery flows.',
    },
    callout: {
      ar: '🏡 مقارنة side-by-side للنماذج على شاشة one-page ترفع conversion vs slider عشوائي.',
      en: '🏡 Side-by-side typology comparison on one screen beats random sliders for conversion.',
    },
  },
  'riyadh-offplan-visual-sales': {
    tldr: {
      ar: 'مبيعات off-plan الرياض: السرعة + الفوتوريализم + تجربة صالة = trio لا يُفصل. المنافسة on-plan raised expectations.',
      en: 'Riyadh off-plan sales: speed + photorealism + gallery experience = inseparable trio. On-plan competition raised expectations.',
    },
    directAnswer: {
      ar: 'إقناع المشتري في الرياض قبل اكتمال البناء يتطلب أصولاً تشرح الوحدة، التشطيب، والحي — متسقة online وoffline. التأخير البصري = leads تبرد في 48 ساعة.',
      en: 'Convincing Riyadh buyers before build completes requires assets explaining unit, finishes, and neighborhood — consistent online and offline. Visual delay = leads cool within 48 hours.',
    },
    callout: {
      ar: '📍 north vs central Riyadh: persona مختلف — عدّل hero scene لا copy فقط.',
      en: '📍 North vs central Riyadh: different persona — adjust hero scene, not copy alone.',
    },
  },
  'roi-architectural-visualization': {
    tldr: {
      ar: 'ROI الإظهار = تحويل صالة + سرعة بيع + سعر perceived — لا «عدد الصور». قِس من أسبوع الإطلاق.',
      en: 'Archviz ROI = gallery conversion + sell-through speed + perceived price — not “number of images.” Measure from launch week.',
    },
    directAnswer: {
      ar: 'لقياس عائد التصور المعماري: حدّد baseline مبيعات، تتبع visit-to-booking، dwell time، وأسئلة العملاء المتكررة — ثم اربط كل أصل بمرحلة funnel.',
      en: 'To measure archviz ROI: set a sales baseline, track visit-to-booking, dwell time, and recurring buyer questions — then map each asset to a funnel stage.',
    },
    callout: {
      ar: '💰 وحدة واحدة إضافية مبكراً في مشروع كبير often تغطي النظام البصري بالكامل.',
      en: '💰 One additional early unit on a major scheme often covers the full visual system.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'مؤشرات ROI الإظهار المعماري',
        headers: ['المؤشر', 'كيف تقيس', 'إشارة +'],
        rows: [
          ['تحويل الصالة', 'زيارة → حجز', '↑ بعد refresh بصري'],
          ['زمن البقاء', 'دقائق في المعرض', '>12 min'],
          ['Lead quality', 'أسئلة spec vs سعر فقط', 'أسئلة أعمق'],
        ],
      },
      en: {
        type: 'table',
        caption: 'Archviz ROI KPIs',
        headers: ['KPI', 'How to measure', 'Positive signal'],
        rows: [
          ['Gallery conversion', 'Visit → booking', '↑ after visual refresh'],
          ['Dwell time', 'Minutes on floor', '>12 min'],
          ['Lead quality', 'Spec vs price-only questions', 'Deeper questions'],
        ],
      },
    },
  },
  'saudi-offplan-visual-readiness': {
    tldr: {
      ar: 'pipeline off-plan السعودي 2025–26: من يملك نظاماً بصرياً جاهزاً يفوز بالنافذة — من ي delay يخسر broker attention.',
      en: 'Saudi off-plan pipeline 2025–26: schemes with ready visual systems win the window — delays lose broker attention.',
    },
    directAnswer: {
      ar: '«جاهزية بصرية» تعني: أصول معتمدة، صالة أو رقمي، فريق مبيعات مدرب، وحملة متزامنة — ليس «لدينا 3 renders». راجع checklist قبل إعلان التاريخ.',
      en: '“Visual readiness” means approved assets, gallery or digital, trained sales, and synchronized campaign — not “we have 3 renders.” Review the checklist before announcing date.',
    },
    callout: {
      ar: '📊 سؤال لل board: هل visual system جاهز 100%؟ إن <80% — لا تعلن التاريخ.',
      en: '📊 Board question: Is visual system 100% ready? If <80% — do not announce date.',
    },
  },
  'saudi-vs-gulf-visual-launch': {
    tldr: {
      ar: 'إطلاق سعودي vs خليجي: نفس الم principles — اختلاف persona، channels، وسرعة. لا copy-paste Dubai assets إلى Riyadh.',
      en: 'Saudi vs Gulf launch: same principles — different persona, channels, and pace. Do not copy-paste Dubai assets into Riyadh.',
    },
    directAnswer: {
      ar: 'ما يبقى ثابتاً: فوتوريализم، اتساق، فيlm، صالة. ما يتغير: اللغة، sensitivity، broker network، وexpectations luxury vs value.',
      en: 'What stays constant: photorealism, consistency, film, gallery. What changes: language, sensitivity, broker network, and luxury vs value expectations.',
    },
    callout: {
      ar: '🌍 localise hero scene + casting — لا ت sufficiency بترجمة caption فقط.',
      en: '🌍 Localise hero scene + casting — translation alone is not enough.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'سعودي vs خليج — ما يتغير في الإطلاق البصري',
        headers: ['العنصر', 'السعودية', 'خليج (UAE/BH/OM)'],
        rows: [
          ['السرعة', 'سريع جداً', 'moderate'],
          ['اللغة', 'AR أساسي + EN', 'EN + AR حسب المشروع'],
          ['Sensitivity', 'مكة/المدina rules', 'ساحلي / urban'],
        ],
      },
      en: {
        type: 'table',
        caption: 'Saudi vs Gulf — what changes in visual launch',
        headers: ['Element', 'Saudi Arabia', 'Gulf (UAE/BH/OM)'],
        rows: [
          ['Pace', 'Very fast', 'Moderate'],
          ['Language', 'AR primary + EN', 'EN + AR by project'],
          ['Sensitivity', 'Makkah/Madinah rules', 'Coastal / urban'],
        ],
      },
    },
  },
  'smart-maquette-evolution': {
    tldr: {
      ar: 'من مجسم تقليدي إلى smart maquette: الإضاءة، البيانات، والتفاعل — ما يزال يبيع في صالة 2026 حيث الشاشة وحدها لا تكفي.',
      en: 'Traditional to smart maquette: lighting, data, interaction — still sells in 2026 galleries where screens alone are not enough.',
    },
    directAnswer: {
      ar: 'المجسم الذكي يجمع حضوراً físicoاً + طبقات رقمية (مناطق إضاءة، بيانات مبيعات، تمييز الوحدات). الأفضل للمخططات الكبيرة وصالات المستثمرين.',
      en: 'Smart maquettes combine physical presence + digital layers (lighting zones, sales data, unit highlight). Best for large masterplans and investor-heavy galleries.',
    },
    callout: {
      ar: '✨ smart ≠ gimmick: كل layer يجب أن يجيب سؤال مبيعات محدد.',
      en: '✨ Smart ≠ gimmick: every layer must answer a specific sales question.',
    },
  },
  'visual-launch-checklist-guide': {
    tldr: {
      ar: 'ابدأ الإطلاق البصري قبل الحفر بـ6 أشهر: اعتمد المخطط، أنتج 8–12 أصلاً بطولياً، درّب المبيعات، وأطلق بصالة بيع ومنصة رقمية متسقة — لا تنتظر يوم إعلان المبيعات.',
      en: 'Start visual launch 6 months before groundbreaking: approve the master plan, produce 8–12 hero assets, train sales, and launch with a consistent gallery and digital platform — do not wait for sales announcement day.',
    },
    directAnswer: {
      ar: 'المطور في السعودية والخليج يحتاج قبل إطلاق مبيعات off-plan: جدول إنتاج بصري من 6 أشهر، 8–12 أصلاً معتمدة (واجهات، داخلية، فيلم، مواد صالة)، مالك إطلاق واحد من التسويق، وصالة بيع جاهزة يوم الإعلان.',
      en: 'GCC developers launching off-plan sales need: a 6-month visual production timeline, 8–12 approved hero assets (facades, interiors, film, gallery materials), one marketing launch owner, and a sales gallery ready on announcement day.',
    },
    callout: {
      ar: '✅ حمّل [قائمة الجاهزية التفاعلية](https://3dgraphicshouse.com/insights/tools/launch-checklist.html) وتابع الـ12 بند قبل أي إعلان.',
      en: '✅ Use the [interactive readiness checklist](https://3dgraphicshouse.com/insights/tools/launch-checklist-en.html) and track all 12 items before any announcement.',
    },
  },
  'visualization-brief-guide': {
    tldr: {
      ar: 'brief الإظهار الجيد = scope + زواia + تشطيب + جدول + موافقات — يوفر 30% rework. اكتبه قبل أول meeting مع الاستوديو.',
      en: 'A strong viz brief = scope + angles + finishes + schedule + approvals — saves 30% rework. Write it before the first studio meeting.',
    },
    directAnswer: {
      ar: 'نموذج brief المشروع البصري يجب أن يحدد: persona المشتري، قائمة deliverables، مرجع تشطيب، deadlines متوافقة مع المبيعات، ومسار اعتماد (marketing + architect).',
      en: 'A visual project brief must define: buyer persona, deliverables list, finish reference, sales-aligned deadlines, and approval path (marketing + architect).',
    },
    callout: {
      ar: '📝 brief ناقص = 3 rounds revision إضافية — almost always.',
      en: '📝 Incomplete brief = 3 extra revision rounds — almost always.',
    },
  },
  'when-to-use-smart-maquette': {
    tldr: {
      ar: 'مجسم ذكي عندما: مخطط كبير، يوم مستثمرين، أو صالة دورة بيع طويلة — الرenders وحدها لا تكفي لعرض المشروع.',
      en: 'Choose smart maquette when: large masterplan, investor day, or long-cycle gallery — renders alone undersell the scheme.',
    },
    directAnswer: {
      ar: 'تحتاج مجسمًا ذكياً بدل الرenders فقط إذا: تبيع مخططاً متعدد المراحل، تحتاج تأثيراً لمسياً في الصالة، أو تريد بيانات حية (التوفر، الإضاءة). للبرج الواحد قد يكفي رenders + فيلم.',
      en: 'You need a smart maquette instead of renders alone if: selling a multi-phase masterplan, needing tactile wow in gallery, or wanting live data layers (availability, lighting). Single towers may need renders + film only.',
    },
    callout: {
      ar: '🎯 قرار سريع: هل المشتري يحتاج أن «يلمس» المشروع؟ نعم → مجسم. لا → رenders + رقمي.',
      en: '🎯 Quick rule: Must the buyer “touch” the scheme? Yes → maquette. No → renders + digital.',
    },
    table: {
      ar: {
        type: 'table',
        caption: 'رenders vs مجsm vs smart maquette',
        headers: ['الأداة', 'الأفضل لـ', 'الحد'],
        rows: [
          ['رenders', 'وحدات، تشطيب', 'لا مخطط لمسي'],
          ['مجسم تقليدي', 'تأثير، بروتوكول', 'بيانات ثابتة'],
          ['مجسم ذكي', 'مخطط + بيانات', 'ميزانية + جدول'],
        ],
      },
      en: {
        type: 'table',
        caption: 'Renders vs maquette vs smart maquette',
        headers: ['Tool', 'Best for', 'Limit'],
        rows: [
          ['Renders', 'Units, finishes', 'No tactile masterplan'],
          ['Traditional maquette', 'Wow, protocol', 'Static data'],
          ['Smart maquette', 'Masterplan + data', 'Budget + timeline'],
        ],
      },
    },
  },
};

function hasBlockType(body, type) {
  return (body || []).some((b) => b.type === type);
}

function findFirstH2Index(body) {
  return (body || []).findIndex((b) => b.type === 'h2');
}

function injectAfterH2(body, blocksToInsert) {
  if (!body?.length || !blocksToInsert.length) return body;
  const idx = findFirstH2Index(body);
  if (idx < 0) return body;
  const insertAt = idx + 1;
  const next = [...body];
  next.splice(insertAt, 0, ...blocksToInsert);
  return next;
}

let updated = 0;
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const full = path.join(DIR, file);
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  const slug = data.slug || file.replace('.json', '');
  const hook = HOOKS[slug];
  if (!hook) {
    console.warn('  missing hooks:', slug);
    continue;
  }

  let changed = false;

  if (JSON.stringify(data.tldr) !== JSON.stringify(hook.tldr)) {
    data.tldr = hook.tldr;
    changed = true;
  }
  if (JSON.stringify(data.directAnswer) !== JSON.stringify(hook.directAnswer)) {
    data.directAnswer = hook.directAnswer;
    changed = true;
  }

  for (const lang of ['ar', 'en']) {
    const key = lang === 'ar' ? 'ar' : 'en';
    let body = data.body?.[key] || data.body?.en || [];
    const toInsert = [];

    if (hook.callout && !hasBlockType(body, 'callout')) {
      toInsert.push({ type: 'callout', text: hook.callout[key] });
    }
    if (hook.table && !hasBlockType(body, 'table')) {
      toInsert.push(hook.table[key]);
    }

    if (toInsert.length) {
      const newBody = injectAfterH2(body, toInsert);
      if (JSON.stringify(newBody) !== JSON.stringify(body)) {
        if (!data.body) data.body = {};
        data.body[key] = newBody;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    updated += 1;
    console.log('  viral:', file);
  }
}

console.log(`Viral content applied to ${updated} articles (${Object.keys(HOOKS).length} hooks defined).`);
