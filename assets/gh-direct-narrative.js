/**
 * GH Direct — sales narrative (From Vision to Sale).
 * Extends window.GH_DIRECT after gh-direct-data.js.
 */
(function () {
  'use strict';
  if (!window.GH_DIRECT) return;

  window.GH_DIRECT.narrative = {
    hero: {
      eyebrow: { ar: 'رحلة المطوّر', en: 'The Developer Journey' },
      h1a: { ar: 'من الرؤية', en: 'From Vision' },
      h1b: { ar: 'إلى تجربة البيع.', en: 'To Sales Experience.' },
      lead: {
        ar: 'نساعد المطوّرين على تحويل المشاريع غير المبنية إلى تجارب واضحة ومقنعة وجاهزة للسوق.',
        en: 'We help developers turn unbuilt projects into clear, compelling and market-ready experiences.',
      },
      leadArSecondary: {
        ar: 'رؤية → فهم → تجربة → مبيعات',
        en: 'Vision → Understanding → Experience → Sales',
      },
      brandName: { ar: 'GRAPHICS HOUSE', en: 'GRAPHICS HOUSE' },
      brandTag: {
        ar: 'نُجسّد المشاريع بصريًا، ونصنع تجارب تبقى.',
        en: 'Visualizing Projects. Creating Experiences.',
      },
      ctaPrimary: { ar: 'ابدأ مشروعك', en: 'Start your project' },
      ctaSecondary: { ar: 'ماذا نقدّم', en: 'See what we deliver' },
      ctaSecondaryHref: '#capability',
      media: 'assets/projects/wahat-al-salam/hero-aerial.webp',
    },

    problem: {
      h2a: { ar: 'مشروعك موجود.', en: 'Your project exists.' },
      h2b: { ar: 'عميلك لا يراه بعد.', en: 'Your customer can’t see it yet.' },
      body: {
        ar: 'المخططات موجودة.\nالتصميم يتطوّر.\nوالبناء قد يكون جارياً.\n\nلكن العميل يحتاج أن يرى المشروع ويفهمه ويشعر به قبل اكتماله.',
        en: 'The plans exist.\nThe design is evolving.\nConstruction may still be underway.\n\nBut the customer needs to see, understand and feel the project before it is complete.',
      },
      closer: { ar: 'هنا ندخل نحن.', en: 'That is where we come in.' },
      chain: [
        { ar: 'مخططات', en: 'Plans' },
        { ar: 'صور', en: 'Images' },
        { ar: 'تجربة', en: 'Experience' },
        { ar: 'قرار', en: 'Decision' },
      ],
    },

    journeyHead: {
      h2a: { ar: 'ثلاث لحظات.', en: 'Three moments.' },
      h2b: { ar: 'رحلة تطوير واحدة.', en: 'One development journey.' },
      lead: {
        ar: 'نحن الطبقة البصرية والتجريبية التي تربط المشروع بسوقه — من الرؤية إلى الإطلاق وتجربة البيع.',
        en: 'We are the visual and experiential layer connecting the project to its market — from vision through launch and the sales experience.',
      },
    },

    moments: [
      {
        id: 'define',
        num: '01',
        name: { ar: 'تعريف', en: 'Define' },
        headline: { ar: 'اجعل الرؤية واضحة.', en: 'Make the vision clear.' },
        copy: {
          ar: 'نحوّل القصد المعماري إلى وضوح بصري.',
          en: 'We turn architectural intent into visual clarity.',
        },
        items: [
          { ar: 'CGI معماري', en: 'Architectural CGI' },
          { ar: 'إظهار المخطط الرئيسي', en: 'Masterplan Visualization' },
          { ar: 'إظهار داخلي', en: 'Interior Visualization' },
          { ar: 'دراسات خامات وأجواء', en: 'Material / Atmosphere Studies' },
          { ar: 'مشاهد رئيسية للمشروع', en: 'Key Project Views' },
        ],
        image: 'assets/projects/wahat-al-salam/hero-aerial.webp',
        packageId: 'basic',
      },
      {
        id: 'build',
        num: '02',
        name: { ar: 'بناء', en: 'Build' },
        headline: { ar: 'أبقِ الرؤية حيّة.', en: 'Keep the vision alive.' },
        copy: {
          ar: 'مع تطوّر المشروع، نُبقي قصته البصرية واضحة ومتسقة ومترابطة — دون أن نكون جهة التنفيذ الإنشائي.',
          en: 'As the project evolves, we help keep its visual story clear, consistent and aligned — without claiming construction.',
        },
        items: [
          { ar: 'CGI محدّث', en: 'Updated CGI' },
          { ar: 'إظهار التقدّم', en: 'Progress Visualization' },
          { ar: 'تواصل المراحل', en: 'Phase Communication' },
          { ar: 'سرد المشروع', en: 'Project Storytelling' },
          { ar: 'أصول تسويقية', en: 'Marketing Visuals' },
        ],
        image: 'assets/projects/al-rajhi-naseem/cam-1.webp',
        packageId: 'launch',
      },
      {
        id: 'sell',
        num: '03',
        name: { ar: 'إطلاق وبيع', en: 'Launch & Sell' },
        headline: { ar: 'حوّل المشروع إلى تجربة بيع.', en: 'Turn the project into a sales experience.' },
        copy: {
          ar: 'نصنع الأدوات البصرية والمادية والتفاعلية التي تساعد العميل على فهم القيمة قبل اكتمال البناء.',
          en: 'We create the visual, physical and interactive tools that help customers understand the value before the building is complete.',
        },
        items: [
          { ar: 'أفلام CGI', en: 'CGI Films' },
          { ar: 'مجسمات معمارية', en: 'Architectural Models' },
          { ar: 'مجسمات ذكية', en: 'Smart Models' },
          { ar: 'تجارب تفاعلية', en: 'Interactive Experiences' },
          { ar: 'مرئيات صالة البيع', en: 'Sales Center Visuals' },
          { ar: 'أصول الإطلاق الرقمي', en: 'Digital Launch Assets' },
          { ar: 'مواد المبيعات / الوسطاء', en: 'Sales / Broker Materials' },
        ],
        image: 'assets/projects/rafal-pavilions/film-still.webp',
        packageId: 'growth',
        peak: true,
        mantra: [
          { ar: 'شاهده.', en: 'See it.' },
          { ar: 'افهمه.', en: 'Understand it.' },
          { ar: 'جرّبه.', en: 'Experience it.' },
          { ar: 'اشترِه.', en: 'Buy it.' },
        ],
      },
    ],

    capability: {
      h2a: { ar: 'منظومة قدرات Graphics House', en: 'The Graphics House' },
      h2b: { ar: '', en: 'Capability' },
      lead: {
        ar: 'منظومة القدرات البصرية والتجريبية حول مشروعك.',
        en: 'The visual and experiential capability system around your project.',
      },
      families: [
        {
          num: '01',
          name: { ar: 'تصوّر', en: 'Visualize' },
          line: { ar: 'اجعل المشروع مرئياً.', en: 'Make the project visible.' },
          items: [
            { ar: 'CGI معماري', en: 'Architectural CGI' },
            { ar: 'إظهار المخطط الرئيسي', en: 'Masterplan Visualization' },
            { ar: 'إظهار داخلي', en: 'Interior Visualization' },
            { ar: 'مشاهد رئيسية', en: 'Key Project Views' },
            { ar: 'إظهار خامات وأجواء', en: 'Material / Atmosphere Visualization' },
          ],
        },
        {
          num: '02',
          name: { ar: 'اشرح', en: 'Explain' },
          line: { ar: 'اجعل المشروع سهل الفهم.', en: 'Make the project easy to understand.' },
          items: [
            { ar: 'أفلام CGI', en: 'CGI Films' },
            { ar: 'تحريك', en: 'Animation' },
            { ar: 'سرد المشروع', en: 'Project Storytelling' },
            { ar: 'أصول العروض', en: 'Presentation Assets' },
          ],
        },
        {
          num: '03',
          name: { ar: 'جرّب', en: 'Experience' },
          line: { ar: 'اجعل المشروع ملموساً.', en: 'Make the project tangible.' },
          items: [
            { ar: 'مجسمات معمارية', en: 'Architectural Models' },
            { ar: 'مجسمات بمقياس', en: 'Scale Models' },
            { ar: 'مجسمات ذكية', en: 'Smart Models' },
            { ar: 'تجارب تفاعلية', en: 'Interactive Experiences' },
          ],
        },
        {
          num: '04',
          name: { ar: 'أطلق', en: 'Launch' },
          line: { ar: 'اجعل المشروع جاهزاً للسوق.', en: 'Make the project market-ready.' },
          items: [
            { ar: 'أصول الإطلاق الرقمي', en: 'Digital Launch Assets' },
            { ar: 'مرئيات الحملات', en: 'Campaign Visuals' },
            { ar: 'محتوى المشروع', en: 'Project Content' },
            { ar: 'مواد تسويقية', en: 'Marketing Materials' },
          ],
        },
        {
          num: '05',
          name: { ar: 'بِع', en: 'Sell' },
          line: { ar: 'قوِّ تجربة الشراء.', en: 'Make the buying experience stronger.' },
          items: [
            { ar: 'مرئيات صالة البيع', en: 'Sales Center Visuals' },
            { ar: 'تجارب بيع تفاعلية', en: 'Interactive Sales Experiences' },
            { ar: 'عرض الوحدة / المشروع', en: 'Unit / Project Presentation' },
            { ar: 'مواد المبيعات / الوسطاء', en: 'Sales / Broker Materials' },
          ],
        },
      ],
    },

    ghDirect: {
      kicker: { ar: 'GH Direct', en: 'GH Direct' },
      title: { ar: 'تقدير مباشر. اختيار واضح. بدون تعقيد.', en: 'Direct estimate. Clear choice. No friction.' },
      lead: {
        ar: 'بعد أن تحدد لحظة مشروعك، يمكنك اختيار باقة مناسبة أو بناء نطاقك بنفسك من خلال الأتيليه.',
        en: 'Transparent starting points for developers who want to explore scope and budget directly.',
      },
    },

    projects: {
      h2a: { ar: 'مشاريع جعلناها تُرى.', en: 'Projects we made visible.' },
      h2b: { ar: '', en: '' },
      lead: {
        ar: 'عيّنات من أعمال Graphics House الموثّقة — إظهار، فيلم، ومجسمات.',
        en: 'Selected verified Graphics House work — visualization, film, and models.',
      },
      items: [
        {
          name: { ar: 'واحة السلام', en: 'Wahat Al Salam' },
          role: {
            ar: 'عقارات العيسائي · مخطط رئيسي · CGI · كتالوج',
            en: 'Al-Essai Real Estate · master plan · CGI · catalogue',
          },
          path: { ar: 'رؤية → إظهار → إطلاق', en: 'Vision → Visualization → Launch' },
          src: 'assets/projects/wahat-al-salam/hero-aerial.webp',
        },
        {
          name: { ar: 'نسيم الحرم', en: 'Naseem Al-Haram' },
          role: {
            ar: 'الراجحي · فيلم CGI · مجسم · إظهار داخلي وخارجي',
            en: 'Al Rajhi · CGI film · maquette · interior & exterior viz',
          },
          path: { ar: 'رؤية → إظهار → تجربة', en: 'Vision → Visualization → Experience' },
          src: 'assets/projects/al-rajhi-naseem/aerial-bird.webp',
        },
        {
          name: { ar: 'بافيليونز', en: 'Pavilions' },
          role: {
            ar: 'رفال للتطوير · فيلم CGI · مجسم · مكاتب VIP',
            en: 'Rafal Development · CGI film · maquette · VIP offices',
          },
          path: { ar: 'إظهار → تجربة → إطلاق', en: 'Visualization → Experience → Launch' },
          src: 'assets/projects/rafal-pavilions/lobby.webp',
        },
        {
          name: { ar: 'مجمع سكني، الرياض', en: 'Residential Community, Riyadh' },
          role: {
            ar: 'عنان إسكان للتطوير · CGI سينمائي · مجسم',
            en: 'Anan Eskan · cinematic CGI · maquette',
          },
          path: { ar: 'رؤية → تجربة → إطلاق', en: 'Vision → Experience → Launch' },
          src: 'assets/projects/rendering/Anan-Escan-Co.01.webp',
        },
      ],
    },

    qualify: {
      h2a: { ar: 'أين مشروعك', en: 'Where is your' },
      h2b: { ar: 'اليوم؟', en: 'project today?' },
      lead: {
        ar: 'اختر لحظتك — ثم ابدأ الحوار. التقديرات اختيارية بعد ذلك.',
        en: 'Choose your moment — then start the conversation. Estimates are optional after that.',
      },
      goLabel: { ar: 'إلى اللحظة ←', en: 'Go to moment →' },
      choices: [
        {
          id: 'define',
          title: { ar: 'لديّ رؤية.', en: 'I have a vision.' },
          line: { ar: 'أحتاج أن أتصوّرها.', en: 'I need to visualize it.' },
          tag: { ar: 'تعريف', en: 'Define' },
          href: '#moment-define',
          packageId: 'basic',
        },
        {
          id: 'build',
          title: { ar: 'أنا أبني.', en: 'I am building.' },
          line: { ar: 'أحتاج أن أوصّلها.', en: 'I need to communicate it.' },
          tag: { ar: 'بناء', en: 'Build' },
          href: '#moment-build',
          packageId: 'launch',
        },
        {
          id: 'sell',
          title: { ar: 'أنا أُطلق.', en: 'I am launching.' },
          line: { ar: 'أحتاج أن أبيعها.', en: 'I need to sell it.' },
          tag: { ar: 'إطلاق وبيع', en: 'Launch & Sell' },
          href: '#moment-sell',
          packageId: 'growth',
        },
      ],
    },

    commercial: {
      eyebrow: { ar: 'تقدير حسب اللحظة', en: 'Estimate by moment' },
      h2: { ar: 'الباقات حسب لحظتك', en: 'Packages by your moment' },
      lead: {
        ar: 'تقدير يبدأ من رقم واضح — النهائي بعد اجتماع قصير بلا التزام.',
        en: 'Estimates start from a clear figure — final pricing after a short meeting, no commitment.',
      },
    },

    finalCta: {
      h2a: { ar: 'لنبنِ تجربة المشروع', en: 'Let’s build the project experience' },
      h2b: { ar: 'قبل أن يكتمل.', en: 'before it is complete.' },
      copy: {
        ar: 'أخبرنا أين يقف مشروعك اليوم.\nنساعدك على تحديد ما يأتي بعد ذلك.',
        en: 'Tell us where your project is today.\nWe’ll help define what comes next.',
      },
      primary: { ar: 'ابدأ مشروعك', en: 'Start your project' },
      secondary: { ar: 'واتساب', en: 'WhatsApp' },
      brand: { ar: 'GRAPHICS HOUSE', en: 'GRAPHICS HOUSE' },
      tag: {
        ar: 'إظهار · تجربة · إطلاق',
        en: 'Visualization · Experience · Launch',
      },
    },
  };
})();
