/** Unique key takeaways per insight article (not duplicates of TL;DR). */

export const ARTICLE_SLUGS = new Set([
  'ai-archviz-future',
  'choosing-archviz-studio-gcc',
  'cinematic-cgi-vs-static-renders',
  'completed-finishes-tour-visual-story',
  'finishes-spec-visualization-gap',
  'interactive-sales-gallery',
  'jeddah-red-sea-visual-launch',
  'makkah-b2b-workforce-housing-viz',
  'makkah-hospitality-near-haram-viz',
  'makkah-project-visual-sensitivity',
  'masterplan-community-visual-sales',
  'mixed-use-gate-visual-launch',
  'office-pavilion-visual-launch',
  'photorealistic-sells-before-construction',
  'project-launch-oman-developers',
  'project-launch-saudi-developers',
  'riyadh-north-villa-compound-viz',
  'riyadh-offplan-visual-sales',
  'roi-architectural-visualization',
  'saudi-offplan-visual-readiness',
  'saudi-vs-gulf-visual-launch',
  'smart-maquette-evolution',
  'visual-launch-checklist-guide',
  'visualization-brief-guide',
  'when-to-use-smart-maquette',
]);

/** @type {Record<string, { ar: string[], en: string[] }>} */
export const TAKEAWAYS = {
  'ai-archviz-future': {
    ar: [
      'وثّق سياسة جودة AI: ما يُنتج آلياً، ما يُراجع، وما يصل للمشتري.',
      'لا تطلق حملة off-plan على رندر AI دون اعتماد المعماري على التشطيب.',
      'الفائز: سير عمل هجين يسرّع الإنتاج دون المساس بمصداقية المبيعات.',
    ],
    en: [
      'Document an AI quality policy: auto-generated, reviewed, buyer-facing.',
      'Never launch off-plan campaigns on AI renders without architect finish sign-off.',
      'Winners use hybrid workflows that speed production without hurting sales trust.',
    ],
  },
  'choosing-archviz-studio-gcc': {
    ar: [
      'قارن 3-5 استوديوهات بمحفظة GCC, لا بسعر الصورة الواحدة.',
      'اسأل عن ملكية ملف 3D المصدر بعد الإطلاق قبل التوقيع.',
      'اختر شريكاً يربط المخرجات بمرحلة المبيعات لا بعدد اللقطات.',
    ],
    en: [
      'Compare 3-5 studios on GCC portfolio, not price per image.',
      'Ask who owns the source 3D file after launch before signing.',
      'Pick a partner that ties deliverables to sales stage, not shot count.',
    ],
  },
  'cinematic-cgi-vs-static-renders': {
    ar: [
      'إطلاق تنافسي: فيلم 60-90 ث + 5-8 رندرات بطولية, لا أحدهما وحده.',
      'تأكد أن الفيلم والرندرات من مشهد 3D واحد لتقليل إعادة الإنتاج.',
      'حدّد القرار في brief التصور وثبّته كتابياً قبل بدء الإنتاج.',
    ],
    en: [
      'Competitive launch: 60-90s film + 5-8 hero stills, not one alone.',
      'Ensure film and stills share one 3D scene to cut re-production cost.',
      'Lock the decision in your visualization brief before production starts.',
    ],
  },
  'completed-finishes-tour-visual-story': {
    ar: [
      'حوّل لوحة المواد المعتمدة إلى جولة بصرية يعيدها الوسيط للعميل.',
      'اربط كل مشهد رندر بتشطيب محدد في ملف المواصفات, لا «تقريب بصري».',
      'استخدم الجولة كمرجع موحّد للمبيعات والمعماري وصالة البيع.',
    ],
    en: [
      'Turn the approved materials board into a broker-ready visual tour.',
      'Tie every render scene to a spec-sheet finish, no visual guesswork.',
      'Use the tour as one reference for sales, architects, and the gallery.',
    ],
  },
  'finishes-spec-visualization-gap': {
    ar: [
      'أي اختلاف بين الرندر ولوحة التشطيب في الصالة يكسر ثقة المشتري.',
      'ثبّت «مشهد البطل» قبل الإعلان, لا تغيير واجهة بعد أول حملة.',
      'أدمج Turriva/المواصفات في مسار الاعتماد قبل الإنتاج البصري.',
    ],
    en: [
      'Any gap between render and gallery finish panel breaks buyer trust.',
      'Freeze the hero scene before advertising, no façade changes post-launch.',
      'Integrate finish specs into approval before visual production starts.',
    ],
  },
  'interactive-sales-gallery': {
    ar: [
      'صمّم الصالة حول أسئلة المشتري, لا حول التكنولogia المتاحة.',
      'قِس: زمن البقاء، الوحدات المستكشفة، وتحويل الزيارة إلى حجز.',
      'ابدأ بـ brief تجربة المشتري قبل اختيار الشاشات أو الـ VR.',
    ],
    en: [
      'Design the gallery around buyer questions, not available tech.',
      'Measure dwell time, units explored, and visit-to-booking conversion.',
      'Start with a buyer-experience brief before picking screens or VR.',
    ],
  },
  'jeddah-red-sea-visual-launch': {
    ar: [
      'مشاريع البحر الأحمر تحتاج هوية بصرية تخدم السياحة والإقامة معاً.',
      'وزّع الأصول بين حملة رقمية وجدة ومواد صالة في المنطقة الغربية.',
      'اربط الإطلاق بمواسم السفر والفعاليات الإقليمية في التقويم.',
    ],
    en: [
      'Red Sea schemes need visual identity that serves tourism and residential sales.',
      'Split assets between Jeddah digital campaigns and on-site gallery materials.',
      'Align launch timing with travel seasons and regional event calendars.',
    ],
  },
  'makkah-b2b-workforce-housing-viz': {
    ar: [
      'سكن القوى العاملة B2B يُباع بالوضوح الوظيفي, لا بالفخامة السكنية فقط.',
      'ركّز على الكثافة، الوصول للحرم/المرافق، ومعايير التشغيل في العرض.',
      'استخدم مواد بصرية مناسبة للعرض المؤسسي لا لصالة retail فاخرة.',
    ],
    en: [
      'B2B workforce housing sells on functional clarity, not luxury lifestyle alone.',
      'Lead visuals with density, Haram/access, and operational standards.',
      'Use assets suited for institutional pitches, not luxury retail galleries.',
    ],
  },
  'makkah-hospitality-near-haram-viz': {
    ar: [
      'القرب من الحرم يفرض حساسية بصرية أعلى في الزواia والإضاءة والسياق.',
      'تجنّب المبالغة في الارتفاع أو الكثافة غير المعتمدة في المخطط.',
      'نسّق الموافقات مع الجهات ذات الصلة قبل أي حملة عامة.',
    ],
    en: [
      'Proximity to the Haram demands higher visual sensitivity in angles and context.',
      'Avoid exaggerating height or density not approved in the master plan.',
      'Align approvals with relevant authorities before any public campaign.',
    ],
  },
  'makkah-project-visual-sensitivity': {
    ar: [
      'كل مشهد في مكة يُقرأ سياقاً دينياً وحضرياً, ليس «رندر جميل» فقط.',
      'راجع المحتوى مع فريق محلي قبل النشر داخل المملكة وخارجها.',
      'فضّل الدقة على الدراما في الإطلاقات قرب المناطق الحساسة.',
    ],
    en: [
      'Every Makkah scene is read in religious and urban context, not as generic beauty.',
      'Review content with a local team before publishing in KSA and abroad.',
      'Favour accuracy over drama for launches near sensitive zones.',
    ],
  },
  'masterplan-community-visual-sales': {
    ar: [
      'الـ masterplan يُباع بالمراحل, حدّد ما يُعرض في المرحلة 1 vs 2.',
      'استخدم منظوراً جوياً + شوارع + مرافق, لا لقطة واحدة للموقع.',
      'اربط كل مرحلة بجدول أرضي واضح في مواد المبيعات.',
    ],
    en: [
      'Masterplans sell in phases, define Phase 1 vs Phase 2 visual scope.',
      'Use aerial + street + amenity views, not one site hero only.',
      'Tie each phase to a clear land-release schedule in sales materials.',
    ],
  },
  'mixed-use-gate-visual-launch': {
    ar: [
      'المشاريع المختلطة تحتاج سرداً يفصل retail وoffice وresidential بوضوح.',
      'أبرز «بوابة» المشروع كرمز للهوية في كل قناة.',
      'زامن إطلاق البصري مع تفعيل الطرق والواجهات الفعلية إن أمكن.',
    ],
    en: [
      'Mixed-use schemes need narrative that separates retail, office, and residential.',
      'Make the project gate a brand symbol across every channel.',
      'Sync visual launch with road activation and actual frontage where possible.',
    ],
  },
  'office-pavilion-visual-launch': {
    ar: [
      'جناح المكتب/المعرض يحتاج deadline ثابتاً, لا scope creep بعد الطباعة.',
      'صمّم للمسافات الفعلية للجناح لا لشاشة لابتوب.',
      'حضّر نسخة رقمية + نسخة فيزيائية من نفس الأصول المعتمدة.',
    ],
    en: [
      'Office pavilions need a fixed deadline, no scope creep after print.',
      'Design for actual booth dimensions, not a laptop screen.',
      'Prepare digital and physical versions from the same approved assets.',
    ],
  },
  'photorealistic-sells-before-construction': {
    ar: [
      'الواقعية الفotorealistic ترفع سعر الوحدة المدرك, لكن ترفع أيضاً توقعات التسليم.',
      'طابق كل مادة ظاهرة في الرندر بجدول تشطيب معتمد.',
      'استخدم realism في نقاط القرار: الواجهة، الصالة، النموذج.',
    ],
    en: [
      'Photorealism raises perceived unit value, and delivery expectations.',
      'Match every visible material in renders to an approved finish schedule.',
      'Deploy realism at decision points: façade, lobby, show unit.',
    ],
  },
  'project-launch-oman-developers': {
    ar: [
      'عُمان: ركّز على lifestyle ساحلي + masterplan واضح للمستثمر الخليجي.',
      'تأقلم مع وتيرة الاعتمادات المحلية في جدول الإنتاج البصري.',
      'قدّم حزمة AR/EN من يوم الإطلاق للمشترين الإقليميين.',
    ],
    en: [
      'Oman: lead with coastal lifestyle + clear masterplan for GCC investors.',
      'Adapt visual production schedule to local approval pace.',
      'Ship AR/EN asset packs from day one for regional buyers.',
    ],
  },
  'project-launch-saudi-developers': {
    ar: [
      'السوق السعودي 2025-26: الإطلاق المرحلي الذكي أفضل من «كل شيء دفعة واحدة».',
      'ثبّت 8-12 أصلاً بطولياً قبل إعلان المبيعات.',
      'عيّن مالك إطلاق واحداً من التسويق, غيابه أغلى من أي استوديو.',
    ],
    en: [
      'KSA 2025-26: smart phased launch beats «everything at once».',
      'Lock 8-12 hero assets before the sales announcement.',
      'Assign one launch owner from marketing, absence costs more than any studio.',
    ],
  },
  'riyadh-north-villa-compound-viz': {
    ar: [
      'مجمعات الفلل شمال الرياض تُباع بالخصوصية والمساحات والواجهة, ركّز عليها.',
      'أنتج رندرات لأكثر 3 typologies مبيعاً, لا لكل فلة في الإطلاق الأول.',
      'اربط الصور بخطة مرافق المجمع (نادي، مسارات، أمن).',
    ],
    en: [
      'North Riyadh villa compounds sell on privacy, plot size, and façade, lead there.',
      'Render the top 3 selling typologies first, not every villa type at launch.',
      'Tie visuals to amenity plan: club, trails, security.',
    ],
  },
  'riyadh-offplan-visual-sales': {
    ar: [
      'مشتري الرياض يقارن مشروعين في نفس الأسبوع عبر الجوال, سرعة الإطلاق تهم.',
      'الصالة + الحملة الرقمية يجب أن تعرض نفس التشطيب المعتمد.',
      'درّب المبيعات على عرض 10 دقائق قبل أول زيارة عميل.',
    ],
    en: [
      'Riyadh buyers compare two schemes weekly on mobile, launch speed matters.',
      'Gallery and digital campaign must show the same approved finishes.',
      'Train sales on a 10-minute visual pitch before the first client visit.',
    ],
  },
  'roi-architectural-visualization': {
    ar: [
      'قِس ROI بالتحويل وسرعة البيع, لا بعدد الصور المُسلَّمة.',
      'اربط كل أصل بمرحلة funnel: awareness → visit → booking.',
      'احسب تكلفة التأخير: أسبوع تأخير إطلاق = X وحدة غير مباعة.',
    ],
    en: [
      'Measure ROI on conversion and sales velocity, not image count delivered.',
      'Map each asset to funnel stage: awareness → visit → booking.',
      'Price delay cost: one week late = X unsold units.',
    ],
  },
  'saudi-offplan-visual-readiness': {
    ar: [
      'جاهزية off-plan = أصول معتمدة + صالة + فريق مبيعات مدرب في نفس اليوم.',
      'راجع checklist الـ12 بند قبل أي إعلان, ليس بعده.',
      'لا تعلن مرحلة 2 بصرياً قبل بيع 30% من المرحلة 1 إن كان ذلك سياسة المشروع.',
    ],
    en: [
      'Off-plan readiness = approved assets + gallery + trained sales on the same day.',
      'Run the 12-point checklist before any announcement, not after.',
      'Do not tease Phase 2 visually before Phase 1 hits your sales policy threshold.',
    ],
  },
  'saudi-vs-gulf-visual-launch': {
    ar: [
      'السعودية: وتيرة أعلى + off-plan dominant, الإمارات/عُمان: nuances مختلفة في القنوات.',
      'لا تنسخ حملة الرياض حرفياً لمسقط أو دبي.',
      'خصّص اللغة والقنوات والوسيط لكل سوق خليجي.',
    ],
    en: [
      'KSA: faster pace + off-plan dominant, UAE/Oman differ in channels.',
      'Do not copy a Riyadh campaign verbatim to Muscat or Dubai.',
      'Localize language, channels, and broker tools per GCC market.',
    ],
  },
  'smart-maquette-evolution': {
    ar: [
      'المجسم الذكي يبرر نفسه في masterplan كبير + بيانات حية للمستثمر.',
      'قارن TCO: تحديث رقمي vs إعادة بناء مجسم فيزيائي.',
      'ادمج المجسم مع شاشات الصالة, لا تعرضه كقطعة منفصلة.',
    ],
    en: [
      'Smart maquettes justify cost on large masterplans + live investor data.',
      'Compare TCO: digital updates vs rebuilding a physical model.',
      'Integrate the model with gallery screens, not as a standalone piece.',
    ],
  },
  'visual-launch-checklist-guide': {
    ar: [
      'ابدأ قبل الحفر بـ6 أشهر, لا يوم إعلان المبيعات.',
      'جمّد «مشهد البطل» قبل أول إعلان؛ أي تغيير واجهة بعده يكلف ثقة السوق.',
      'حمّل [قائمة الجاهزية التفاعلية](https://3dgraphicshouse.com/insights/tools/launch-checklist.html) وتابع الـ12 بند.',
    ],
    en: [
      'Start 6 months before groundbreaking, not on sales announcement day.',
      'Freeze the hero scene before the first ad; post-launch façade changes cost trust.',
      'Use the [interactive launch checklist](https://3dgraphicshouse.com/insights/tools/launch-checklist-en.html) for all 12 items.',
    ],
  },
  'visualization-brief-guide': {
    ar: [
      'brief جيد يحدد: مرحلة المبيعات، القنوات، اللغات، ومسار الاعتماد.',
      'أرفق moodboard + مواصفات تشطيب + جدول إطلاق في مستند واحد.',
      'راجع brief مع المبيعات والمعماري قبل إرساله للاستوديو.',
    ],
    en: [
      'A strong brief defines sales stage, channels, languages, and approval path.',
      'Attach moodboard + finish specs + launch schedule in one document.',
      'Review the brief with sales and architect before sending to the studio.',
    ],
  },
  'when-to-use-smart-maquette': {
    ar: [
      'اختر مجسم ذكي عند masterplan معقد + حاجة لتحديث بيانات أثناء المبيعات.',
      'الرندر وحده يكفي للوحدات والتشطيب, المجسم للسياق المكاني والبروتوكول.',
      'احسب جدول التحديث: كم مرة يتغير المخطط خلال 12 شهر مبيعات؟',
    ],
    en: [
      'Choose smart maquette for complex masterplans + live data during sales.',
      'Renders suffice for units and finishes, models for spatial context and protocol.',
      'Plan update cadence: how often does the scheme change during 12 months of sales?',
    ],
  },
};

export function fixInsightsArticleLinks(value) {
  if (typeof value === 'string') {
    return value.replace(
      /https:\/\/3dgraphicshouse\.com\/insights\/([a-z0-9-]+)\.html/g,
      (match, slug) =>
        ARTICLE_SLUGS.has(slug)
          ? `https://3dgraphicshouse.com/insights/articles/${slug}.html`
          : match
    );
  }
  if (Array.isArray(value)) return value.map(fixInsightsArticleLinks);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = fixInsightsArticleLinks(v);
    return out;
  }
  return value;
}
