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
      h1b: { ar: 'إلى البيع.', en: 'To Sale.' },
      lead: {
        ar: 'نساعد المطوّرين على تحويل المشاريع غير المبنية إلى تجارب واضحة ومقنعة وجاهزة للسوق.',
        en: 'We help developers turn unbuilt projects into clear, compelling and market-ready experiences.',
      },
      leadArSecondary: {
        ar: 'من الرؤية الأولى، إلى المشروع القابل للفهم، إلى تجربة البيع.',
        en: '',
      },
      brandName: { ar: 'GRAPHICS HOUSE', en: 'GRAPHICS HOUSE' },
      brandTag: { ar: 'نُظهر ما سيأتي.', en: 'Visualizing what comes next.' },
      ctaPrimary: { ar: 'ابدأ مشروعك', en: 'Start your project' },
      ctaSecondary: { ar: 'ماذا نقدّم', en: 'See what we deliver' },
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
        ar: 'لسنا المقاول ولا المعماري. نحن الطبقة البصرية والتجريبية التي تربط المشروع بسوقه — وتزداد كثافتها عند الإطلاق والبيع.',
        en: 'We are not the contractor or the architect. We are the visual and experiential layer connecting the project to its market — densest at launch and sales.',
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
          { ar: 'إظهار المخطط الرئيسي', en: 'Masterplan Visualization' },
          { ar: 'CGI معماري', en: 'Architectural CGI' },
          { ar: 'إظهار داخلي', en: 'Interior Visualization' },
          { ar: 'دراسات خامات وأجواء', en: 'Material & Atmosphere Studies' },
          { ar: 'مشاهد رئيسية للمشروع', en: 'Key Project Views' },
          { ar: 'أصول بصرية جاهزة للبيع', en: 'Sales-Ready Visual Assets' },
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
          { ar: 'تحديثات البناء', en: 'Construction Updates' },
          { ar: 'أصول تسويقية', en: 'Marketing Visuals' },
          { ar: 'سرد المشروع', en: 'Project Storytelling' },
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
          { ar: 'عروض الوحدات والمشروع', en: 'Unit & Project Presentations' },
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

    deliver: {
      h2a: { ar: 'مبني حول طريقة', en: 'Built around the way' },
      h2b: { ar: 'عمل المطوّرين.', en: 'developers work.' },
      solutions: [
        {
          num: '01',
          name: { ar: 'تصوّر', en: 'Visualize' },
          line: { ar: 'اجعل المشروع مرئياً.', en: 'Make the project visible.' },
          tags: { ar: 'CGI · رندرات · مخطط رئيسي · داخلي', en: 'CGI · Renders · Masterplan · Interiors' },
        },
        {
          num: '02',
          name: { ar: 'اشرح', en: 'Explain' },
          line: { ar: 'اجعل المشروع سهل الفهم.', en: 'Make the project easy to understand.' },
          tags: { ar: 'أفلام · مخططات · قصص مشروع · عروض', en: 'Films · Diagrams · Project Stories · Presentations' },
        },
        {
          num: '03',
          name: { ar: 'جرّب', en: 'Experience' },
          line: { ar: 'اجعل المشروع ملموساً.', en: 'Make the project tangible.' },
          tags: {
            ar: 'مجسمات معمارية · مجسمات ذكية · تجارب تفاعلية',
            en: 'Architectural Models · Smart Models · Interactive Experiences',
          },
        },
        {
          num: '04',
          name: { ar: 'أطلق', en: 'Launch' },
          line: { ar: 'اجعل المشروع جاهزاً للسوق.', en: 'Make the project market-ready.' },
          tags: {
            ar: 'أصول حملات · محتوى رقمي · مواد مبيعات',
            en: 'Campaign Assets · Digital Content · Sales Materials',
          },
        },
        {
          num: '05',
          name: { ar: 'بِع', en: 'Sell' },
          line: { ar: 'قوِّ تجربة الشراء.', en: 'Make the buying experience stronger.' },
          tags: {
            ar: 'صالات بيع · اختيار تفاعلي · تجربة المشروع',
            en: 'Sales Centers · Interactive Selection · Project Experience',
          },
        },
      ],
    },

    why: {
      h2a: { ar: 'المشروع لا يُباع', en: 'A project is not sold' },
      h2b: { ar: 'بالمخططات وحدها.', en: 'by drawings alone.' },
      copy: {
        ar: 'المشتري لا يشتري رسماً.\nهو يشتري مكاناً يستطيع تخيّله.',
        en: 'The buyer is not purchasing a drawing.\nThey are purchasing a place they can imagine.',
      },
      pillars: [
        {
          name: { ar: 'وضوح', en: 'Clarity' },
          line: { ar: 'يفهم المشروع.', en: 'Understand the project.' },
        },
        {
          name: { ar: 'ثقة', en: 'Confidence' },
          line: { ar: 'يثق بما يراه.', en: 'Trust what they are seeing.' },
        },
        {
          name: { ar: 'رغبة', en: 'Desire' },
          line: { ar: 'يرغب في امتلاكه.', en: 'Want to own it.' },
        },
      ],
      closer: {
        ar: 'من المعلومة إلى الإحساس.\nومن الإحساس إلى القرار.',
        en: 'From information to emotion.\nFrom emotion to decision.',
      },
    },

    about: {
      h2a: { ar: 'أكثر من', en: 'More than a' },
      h2b: { ar: 'استوديو إظهار.', en: 'visualization studio.' },
      copy: {
        ar: 'تجمع Graphics House بين الإظهار المعماري والإنتاج السينمائي والنمذجة المادية والتقنية التفاعلية لصناعة تجارب مشروع كاملة للمطوّرين.',
        en: 'Graphics House combines architectural visualization, cinematic production, physical modeling and interactive technology to create complete project experiences for developers.',
      },
      pillars: [
        { ar: 'معماري', en: 'Architectural' },
        { ar: 'سينمائي', en: 'Cinematic' },
        { ar: 'مادي', en: 'Physical' },
        { ar: 'تفاعلي', en: 'Interactive' },
      ],
      closerA: { ar: 'شريك بصري واحد.', en: 'One visual partner.' },
      closerB: { ar: 'نقاط اتصال متعددة للمشروع.', en: 'Multiple project touchpoints.' },
    },

    workflow: {
      h2a: { ar: 'من المدخل', en: 'From input' },
      h2b: { ar: 'إلى الأثر.', en: 'to impact.' },
      steps: [
        {
          num: '01',
          name: { ar: 'فهم', en: 'Understand' },
          detail: { ar: 'موجز · تصميم · مخطط رئيسي', en: 'Brief · Design · Masterplan' },
        },
        {
          num: '02',
          name: { ar: 'ترجمة', en: 'Translate' },
          detail: { ar: 'لغة بصرية · قصة · تجربة', en: 'Visual Language · Story · Experience' },
        },
        {
          num: '03',
          name: { ar: 'إنتاج', en: 'Produce' },
          detail: { ar: 'CGI · فيلم · مجسم · تفاعلي', en: 'CGI · Film · Model · Interactive' },
        },
        {
          num: '04',
          name: { ar: 'نشر', en: 'Deploy' },
          detail: { ar: 'صالة بيع · حملة · رقمي · مبيعات', en: 'Sales Center · Campaign · Digital · Sales' },
        },
        {
          num: '05',
          name: { ar: 'إطلاق', en: 'Launch' },
          detail: { ar: 'مشروع جاهز لأن يُرى.', en: 'A project ready to be seen.' },
        },
      ],
    },

    advantage: {
      h2a: { ar: 'مشروع واحد.', en: 'One project.' },
      h2b: { ar: 'منظومة بصرية مترابطة.', en: 'One connected visual system.' },
      copy: {
        ar: 'بدل تنسيق مورّدين منفصلين للإظهار والفيلم والمجسمات والتجارب التفاعلية وبيئات البيع، يبني المطوّر تجربة مشروع متناسقة عبر شريك بصري واحد.',
        en: 'Instead of coordinating multiple disconnected suppliers for visualization, film, models, interactive experiences and sales environments, developers can build a coordinated project experience through one visual partner.',
      },
      pillars: [
        {
          name: { ar: 'اتساق', en: 'Consistency' },
          line: { ar: 'كل شيء يتحدث بلغة بصرية واحدة.', en: 'Everything speaks the same visual language.' },
        },
        {
          name: { ar: 'سيطرة', en: 'Control' },
          line: { ar: 'مخرجات مترابطة عبر المشروع.', en: 'Connected outputs across the project.' },
        },
        {
          name: { ar: 'سرعة', en: 'Speed' },
          line: { ar: 'مسار أوضح من التصميم إلى السوق.', en: 'A clearer path from design to market.' },
        },
        {
          name: { ar: 'أثر', en: 'Impact' },
          line: { ar: 'تجربة أقوى للمشتري.', en: 'A stronger experience for the buyer.' },
        },
      ],
    },

    projects: {
      h2a: { ar: 'مشاريع ساعدنا', en: 'Projects we helped' },
      h2b: { ar: 'على أن تُرى.', en: 'bring to life.' },
      lead: {
        ar: 'عيّنات من أعمال Graphics House — إظهار، فيلم، ومجسمات.',
        en: 'Selected Graphics House work — visualization, film, and models.',
      },
      items: [
        {
          name: { ar: 'واحة السلام', en: 'Wahat Al Salam' },
          role: { ar: 'إظهار جوي · قصة المخطط', en: 'Aerial visualization · masterplan story' },
          path: { ar: 'رؤية → إظهار → إطلاق', en: 'Vision → Visualization → Launch' },
          src: 'assets/projects/wahat-al-salam/hero-aerial.webp',
        },
        {
          name: { ar: 'الراجحي النسيم', en: 'Al Rajhi Naseem' },
          role: { ar: 'إظهار داخلي · مجسم', en: 'Interior visualization · maquette' },
          path: { ar: 'رؤية → إظهار → تجربة', en: 'Vision → Visualization → Experience' },
          src: 'assets/projects/al-rajhi-naseem/int-living.webp',
        },
        {
          name: { ar: 'رافال بافيليونز', en: 'Rafal Pavilions' },
          role: { ar: 'أفلام إطلاق · حضور سوقي', en: 'Launch films · market presence' },
          path: { ar: 'إظهار → تجربة → إطلاق', en: 'Visualization → Experience → Launch' },
          src: 'assets/projects/rafal-pavilions/film-still.webp',
        },
        {
          name: { ar: 'عنان إسكان', en: 'Anan Eskan' },
          role: { ar: 'مجسم معماري · جاهزية البيع', en: 'Architectural maquette · sales readiness' },
          path: { ar: 'رؤية → تجربة → إطلاق', en: 'Vision → Experience → Launch' },
          src: 'assets/projects/maquettes/anan-eskan-maquette-01.webp',
        },
      ],
    },

    qualify: {
      h2a: { ar: 'أين مشروعك', en: 'Where is your' },
      h2b: { ar: 'اليوم؟', en: 'project today?' },
      lead: {
        ar: 'اختر لحظتك — نوجّهك إلى ما تحتاجه الآن.',
        en: 'Choose your moment — we’ll point you to what you need now.',
      },
      choices: [
        {
          id: 'define',
          title: { ar: 'لديّ رؤية.', en: 'I have a vision.' },
          line: { ar: 'أحتاج أن أتصوّرها.', en: 'I need to visualize it.' },
          tag: { ar: 'تعريف', en: 'Define' },
          href: '#pkg-basic',
          packageId: 'basic',
        },
        {
          id: 'build',
          title: { ar: 'أنا أبني.', en: 'I am building.' },
          line: { ar: 'أحتاج أن أوصّلها.', en: 'I need to communicate it.' },
          tag: { ar: 'بناء', en: 'Build' },
          href: '#pkg-launch',
          packageId: 'launch',
        },
        {
          id: 'sell',
          title: { ar: 'أنا أُطلق.', en: 'I am launching.' },
          line: { ar: 'أحتاج أن أبيعها.', en: 'I need to sell it.' },
          tag: { ar: 'إطلاق وبيع', en: 'Launch & Sell' },
          href: '#pkg-growth',
          packageId: 'growth',
        },
      ],
    },

    commercial: {
      eyebrow: { ar: 'الخطوة التالية', en: 'Next step' },
      h2: { ar: 'الباقات حسب لحظتك', en: 'Packages by your moment' },
      lead: {
        ar: 'تقدير يبدأ من رقم واضح — النهائي بعد اجتماع قصير بلا التزام.',
        en: 'Estimates start from a clear figure — final pricing after a short meeting, no commitment.',
      },
    },

    finalCta: {
      h2a: { ar: 'لنبنِ التجربة', en: 'Let’s build' },
      h2b: { ar: 'قبل البناء.', en: 'the experience before the building.' },
      copy: {
        ar: 'أخبرنا أين يقف مشروعك اليوم.\nنساعد على تحديد ما يأتي بعد ذلك.',
        en: 'Tell us where your project is today.\nWe’ll help define what comes next.',
      },
      primary: { ar: 'ابدأ مشروعك', en: 'Start your project' },
      secondary: { ar: 'واتساب', en: 'WhatsApp' },
      brand: { ar: 'GRAPHICS HOUSE', en: 'GRAPHICS HOUSE' },
      tag: { ar: 'إظهار · تجربة · إطلاق', en: 'Visualization · Experience · Launch' },
    },
  };
})();
