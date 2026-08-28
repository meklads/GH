#!/usr/bin/env node
/**
 * Replace "Coming Soon" AR service stubs with hero + main sections (outcome-led GCC copy).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SERVICES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'services');

const STUBS = {
  'ai-solutions.html': {
    icon: 'psychology',
    metaAr:
      'حلول ذكاء اصطناعي عملية لتسريع الإظهار المعماري وإنتاج المحتوى ودعم المبيعات للمطورين في السعودية والخليج.',
    metaEn: 'Practical AI workflows for archviz, content production, and sales enablement across the GCC.',
    ar: {
      label: 'خدماتنا',
      title: 'حلول الذكاء الاصطناعي',
      gold: 'للمطورين',
      hero:
        'ندمج الذكاء الاصطناعي في خطوط الإظهار والإنتاج وصالات البيع لتسريع التسليم دون التضحية بجودة المخرجات. جزء من <a href="../solutions/project-launch.html">ProjectLaunch™</a> و<a href="../solutions/growth-launch.html">GrowthLaunch™</a>.',
      features: [
        { icon: 'auto_awesome', title: 'تسريع الرندر', desc: 'تكرار أسرع على المواد والإضاءة والزوايا في المخططات الكبرى.' },
        { icon: 'hub', title: 'أتمتة سير العمل', desc: 'ربط مراحل الإنتاج من استلام الموجز إلى تسليم الأصول.' },
        { icon: 'insights', title: 'طبقة بيانات حية', desc: 'ربط بيانات المبيعات والتوفر بالرندر والمجسمات والعروض التفاعلية.' },
        { icon: 'smart_toy', title: 'دعم المبيعات', desc: 'مساعد ذكي للاستكشاف في الموقع وصالة العرض والفعاليات.' },
      ],
      related: [
        { href: 'rendering.html', label: 'الإظهار المعماري' },
        { href: 'interactive-experiences.html', label: 'التجارب التفاعلية' },
        { href: '../insights/tools/solution-finder.html', label: 'أي حل يناسب مشروعك؟' },
      ],
      cta: 'ناقش سير عمل الذكاء الاصطناعي مع فريقنا',
    },
    en: {
      label: 'Our Services',
      title: 'AI Solutions',
      gold: 'for Developers',
      hero:
        'We embed AI in visualization, production, and sales enablement to accelerate delivery without sacrificing output quality. Part of <a href="../solutions/project-launch-en.html">ProjectLaunch™</a> and <a href="../solutions/growth-launch-en.html">GrowthLaunch™</a>.',
      features: [
        { icon: 'auto_awesome', title: 'Render acceleration', desc: 'Faster iteration on materials, light, and camera angles across large masterplans.' },
        { icon: 'hub', title: 'Workflow automation', desc: 'Connect production steps from brief intake through asset delivery.' },
        { icon: 'insights', title: 'Live data layers', desc: 'Link sales data and availability to renders, maquettes, and interactive screens.' },
        { icon: 'smart_toy', title: 'Sales enablement', desc: 'Guided discovery for websites, showrooms, and launch events.' },
      ],
      related: [
        { href: 'rendering-en.html', label: 'Architectural visualization' },
        { href: 'interactive-experiences-en.html', label: 'Interactive experiences' },
        { href: '../insights/tools/solution-finder-en.html', label: 'Which solution fits?' },
      ],
      cta: 'Discuss AI workflows with our team',
    },
    heroImg: 'assets/projects/rendering/jeddah-forum.jpg',
  },
  'branding.html': {
    icon: 'brush',
    metaAr:
      'هوية بصرية واستراتيجية علامة للمشاريع العقارية الكبرى في الخليج. كتالوجات وصالات بيع ضمن BrandScale™.',
    metaEn: 'Brand identity and launch collateral for mega developments across the GCC, aligned with BrandScale™.',
    ar: {
      label: 'خدماتنا',
      title: 'الهوية والعلامة',
      gold: 'للمشاريع الكبرى',
      hero:
        'نبني هوية بصرية موحدة للمخطط الرئيسي وصالة البيع وحملة الإطلاق. يتكامل مع <a href="rendering.html">الإظهار المعماري</a> و<a href="../solutions/brand-scale.html">BrandScale™</a>.',
      features: [
        { icon: 'brush', title: 'الهوية البصرية', desc: 'شعار، ألوان، خطوط، ودليل استخدام للمشروع.' },
        { icon: 'menu_book', title: 'مواد المبيعات', desc: 'كتالوجات، بطاقات الوحدات، وعروض للمستثمرين.' },
        { icon: 'storefront', title: 'صالة البيع', desc: 'رسومات بيئية وسرد مكاني لبيئات العرض المميزة.' },
        { icon: 'strategy', title: 'تموضع العلامة', desc: 'رسائل وموقع في السوق يخاطب مشتري الخليج.' },
      ],
      related: [
        { href: 'rendering.html', label: 'الإظهار المعماري' },
        { href: 'digital-marketing.html', label: 'التسويق الرقمي' },
        { href: '../partner-network.html', label: 'شبكة شركاء الوكالات' },
      ],
      cta: 'ابدأ مشروع الهوية',
    },
    en: {
      label: 'Our Services',
      title: 'Branding',
      gold: 'for Mega Developments',
      hero:
        'We build one visual identity across masterplan, sales gallery, and launch campaign. Integrated with <a href="rendering-en.html">architectural visualization</a> and <a href="../solutions/brand-scale-en.html">BrandScale™</a>.',
      features: [
        { icon: 'brush', title: 'Visual identity', desc: 'Logo system, palette, typography, and usage guidelines.' },
        { icon: 'menu_book', title: 'Sales collateral', desc: 'Brochures, unit sheets, and investor decks.' },
        { icon: 'storefront', title: 'Gallery branding', desc: 'Environmental graphics for premium sales environments.' },
        { icon: 'strategy', title: 'Brand positioning', desc: 'Messaging tailored to GCC buyers and investors.' },
      ],
      related: [
        { href: 'rendering-en.html', label: 'Architectural visualization' },
        { href: 'digital-marketing-en.html', label: 'Digital marketing' },
        { href: '../partner-network-en.html', label: 'Agency partner network' },
      ],
      cta: 'Start your brand project',
    },
    heroImg: 'assets/projects/rendering/c3.jpg',
  },
  'cinematic-cgi.html': {
    icon: 'movie',
    metaAr: 'أفلام CGI سينمائية لإطلاق المشاريع ومراكز المبيعات والعروض الاستثمارية في السعودية والخليج.',
    metaEn: 'Cinematic CGI films for launches, sales centers, and investor roadshows across the GCC.',
    ar: {
      label: 'خدماتنا',
      title: 'أفلام CGI',
      gold: 'سينمائية',
      hero:
        'ننتج أفلاماً معمارية تشرح الحجم ونمط الحياة وقيمة الاستثمار قبل البناء. مخرجات أساسية في <a href="../solutions/project-launch.html">ProjectLaunch™</a> و<a href="../insights/projects/jeddah-forum.html">ملتقى جدة للعقار</a>.',
      features: [
        { icon: 'flight', title: 'طيران جوي', desc: 'لقطات جوية للمخطط الرئيسي والمرافق والربط.' },
        { icon: 'directions_walk', title: 'جولة داخلية', desc: 'تجوال في الوحدات والمرافق بإيقاع سينمائي.' },
        { icon: 'theaters', title: 'فيلم الإطلاق', desc: 'فيلم بطل لحفلات الكشف والجولات الاستثمارية.' },
        { icon: 'movie_edit', title: 'ما بعد الإنتاج', desc: 'مونتاج وتصحيح ألوان ونسخ متعددة اللغات.' },
      ],
      related: [
        { href: 'rendering.html', label: 'الإظهار المعماري' },
        { href: 'animation.html', label: 'الأفلام ثلاثية الأبعاد' },
        { href: '../portfolio.html', label: 'معرض الأعمال' },
      ],
      cta: 'خطط لفيلم الإطلاق',
    },
    en: {
      label: 'Our Services',
      title: 'Cinematic CGI',
      gold: 'Films',
      hero:
        'Architectural films that communicate scale, lifestyle, and investment value before ground breaks. Core to <a href="../solutions/project-launch-en.html">ProjectLaunch™</a> and landmark work like the <a href="../insights/projects/jeddah-forum-en.html">Jeddah Real Estate Forum</a>.',
      features: [
        { icon: 'flight', title: 'Aerial flyovers', desc: 'Masterplan films showing scale, amenities, and connectivity.' },
        { icon: 'directions_walk', title: 'Walkthrough films', desc: 'Unit and amenity tours with cinematic pacing.' },
        { icon: 'theaters', title: 'Launch hero films', desc: 'Films for unveilings, investor roadshows, and press.' },
        { icon: 'movie_edit', title: 'Post-production', desc: 'Edit, grade, and multilingual versions for regional rollout.' },
      ],
      related: [
        { href: 'rendering-en.html', label: 'Architectural visualization' },
        { href: 'animation-en.html', label: 'CGI animation' },
        { href: '../portfolio-en.html', label: 'Portfolio' },
      ],
      cta: 'Plan your launch film',
    },
    heroImg: 'assets/projects/animation/jeddah-forum.jpg',
  },
  'digital-marketing.html': {
    icon: 'campaign',
    metaAr: 'تسويق أداء ومحتوى وتوليد عملاء مؤهلين لإطلاقات المشاريع العقارية في السعودية والخليج.',
    metaEn: 'Performance marketing, content, and qualified lead generation for GCC property launches.',
    ar: {
      label: 'خدماتنا',
      title: 'التسويق الرقمي',
      gold: 'للإطلاقات',
      hero:
        'نربط المخرجات البصرية بحملات أداء تخدم مرحلة ما قبل البيع. ضمن <a href="../solutions/growth-launch.html">GrowthLaunch™</a> مع <a href="web-solutions.html">الحلول الرقمية</a>.',
      features: [
        { icon: 'ads_click', title: 'حملات الأداء', desc: 'Meta وGoogle وحملات برمجية لعملاء عقاريين مؤهلين.' },
        { icon: 'edit_note', title: 'إنتاج المحتوى', desc: 'فيديو قصير ومنشورات متسقة مع الهوية البصرية.' },
        { icon: 'filter_alt', title: 'مسار التحويل', desc: 'صفحات هبوط وربط CRM لفريق المبيعات.' },
        { icon: 'monitoring', title: 'قياس العائد', desc: 'تقارير مرتبطة بتكلفة العميل والتحويل.' },
      ],
      related: [
        { href: 'branding.html', label: 'الهوية والعلامة' },
        { href: 'web-solutions.html', label: 'الحلول الرقمية' },
        { href: '../insights/tools/launch-checklist.html', label: 'قائمة جاهزية الإطلاق' },
      ],
      cta: 'اطلب خطة تسويق الإطلاق',
    },
    en: {
      label: 'Our Services',
      title: 'Digital Marketing',
      gold: 'for Launches',
      hero:
        'Studio-grade visuals connected to performance campaigns for pre-sales and launch phases. Part of <a href="../solutions/growth-launch-en.html">GrowthLaunch™</a> with <a href="web-solutions-en.html">web solutions</a>.',
      features: [
        { icon: 'ads_click', title: 'Performance ads', desc: 'Meta, Google, and programmatic campaigns for qualified property leads.' },
        { icon: 'edit_note', title: 'Content production', desc: 'Short-form video and launch copy aligned to your identity.' },
        { icon: 'filter_alt', title: 'Funnel strategy', desc: 'Landing pages and CRM flows for sales teams.' },
        { icon: 'monitoring', title: 'ROI reporting', desc: 'Dashboards tied to cost-per-lead and conversion.' },
      ],
      related: [
        { href: 'branding-en.html', label: 'Branding' },
        { href: 'web-solutions-en.html', label: 'Web solutions' },
        { href: '../insights/tools/launch-checklist-en.html', label: 'Launch readiness checklist' },
      ],
      cta: 'Request a launch marketing plan',
    },
    heroImg: 'assets/projects/rendering/alrajhi2.jpeg',
  },
  'interactive-experiences.html': {
    icon: 'touch_app',
    metaAr: 'شاشات لمس وجولات VR ومنصات بيع تفاعلية لصالات العرض والمعارض في الخليج.',
    metaEn: 'Touchscreen kiosks, VR tours, and interactive sales platforms for GCC showrooms.',
    ar: {
      label: 'خدماتنا',
      title: 'التجارب التفاعلية',
      gold: 'لصالات البيع',
      hero:
        'نصمم منصات لمس وجولات افتراضية وأنظمة عرض غنية بالبيانات لقرارات استثمار أسرع. يتكامل مع <a href="maquettes.html">المجسمات الذكية</a> و<a href="interactive.html">العروض التفاعلية</a>.',
      features: [
        { icon: 'touch_app', title: 'كيوسك المبيعات', desc: 'استكشاف الوحدات والمخططات والتوفر على الشاشة.' },
        { icon: 'view_in_ar', title: 'VR و360°', desc: 'جولات للمشترين عن بُعد والجولات الدولية.' },
        { icon: 'compare', title: 'مقارنة الوحدات', desc: 'فلاتر ومفضلة لاستشاري المبيعات.' },
        { icon: 'dashboard', title: 'لوحات حية', desc: 'بيانات المشروع والأخبار على شاشات العرض.' },
      ],
      related: [
        { href: 'maquettes.html', label: 'المجسمات الذكية' },
        { href: 'vr-360.html', label: 'جولات VR و360°' },
        { href: '../insights/projects/makkah-charter-mwl.html', label: 'مشروع ميثاق مكة' },
      ],
      cta: 'صمم بيئة البيع التفاعلية',
    },
    en: {
      label: 'Our Services',
      title: 'Interactive Experiences',
      gold: 'for Sales Galleries',
      hero:
        'Touchscreen platforms, virtual tours, and data-rich presentation systems for faster investment decisions. Pairs with <a href="maquettes-en.html">smart maquettes</a> and <a href="interactive-en.html">interactive presentations</a>.',
      features: [
        { icon: 'touch_app', title: 'Sales kiosks', desc: 'Unit exploration, floor plans, and availability on screen.' },
        { icon: 'view_in_ar', title: 'VR and 360°', desc: 'Tours for remote buyers and international roadshows.' },
        { icon: 'compare', title: 'Unit comparison', desc: 'Filters and favorites for sales consultants.' },
        { icon: 'dashboard', title: 'Live dashboards', desc: 'Project data and news on presentation screens.' },
      ],
      related: [
        { href: 'maquettes-en.html', label: 'Smart maquettes' },
        { href: 'vr-360-en.html', label: 'VR and 360° tours' },
        { href: '../insights/projects/makkah-charter-mwl-en.html', label: 'MWL Makkah Charter project' },
      ],
      cta: 'Design your interactive sales system',
    },
    heroImg: 'assets/news/makkah-charter-02.jpeg',
  },
  'photography-media.html': {
    icon: 'photo_camera',
    metaAr: 'تصوير معماري وطائر وإنتاج إعلامي لتسويق المشاريع وفعاليات الإطلاق في الخليج.',
    metaEn: 'Architectural photography, aerial filming, and media production for GCC project marketing.',
    ar: {
      label: 'خدماتنا',
      title: 'التصوير والإنتاج',
      gold: 'الإعلامي',
      hero:
        'نصوّر المشاريع وصالات البيع وفعاليات الإطلاق بجودة تحريرية جاهزة للحملات والصحافة. يكمّل <a href="production.html">الإنتاج الإعلامي</a> و<a href="cinematic-cgi.html">أفلام CGI</a>.',
      features: [
        { icon: 'photo_camera', title: 'تصوير معماري', desc: 'خارجي وداخلي ومرافق للكتالوجات والحملات.' },
        { icon: 'flight', title: 'تصوير جوي', desc: 'درون للمخطط الرئيسي وتقدم البناء.' },
        { icon: 'videocam', title: 'تغطية الفعاليات', desc: 'حفلات الإطلاق والزيارات والمعارض.' },
        { icon: 'movie_edit', title: 'معالجة وتسليم', desc: 'retouch وتصحيح ألوان وحزم للويب والطباعة.' },
      ],
      related: [
        { href: 'production.html', label: 'الإنتاج الإعلامي' },
        { href: 'digital-marketing.html', label: 'التسويق الرقمي' },
        { href: '../portfolio.html', label: 'معرض الأعمال' },
      ],
      cta: 'احجز جلسة تصوير',
    },
    en: {
      label: 'Our Services',
      title: 'Photography and Media',
      gold: 'Production',
      hero:
        'Editorial-quality photography and film for developments, showrooms, and launch events. Complements <a href="production-en.html">media production</a> and <a href="cinematic-cgi-en.html">cinematic CGI</a>.',
      features: [
        { icon: 'photo_camera', title: 'Architectural photography', desc: 'Exterior, interior, and amenity shoots for catalogs.' },
        { icon: 'flight', title: 'Aerial and drone', desc: 'Filming for masterplans and construction progress.' },
        { icon: 'videocam', title: 'Event coverage', desc: 'Launch ceremonies, VIP visits, and exhibitions.' },
        { icon: 'movie_edit', title: 'Post and delivery', desc: 'Retouching, grading, and asset packages.' },
      ],
      related: [
        { href: 'production-en.html', label: 'Media production' },
        { href: 'digital-marketing-en.html', label: 'Digital marketing' },
        { href: '../portfolio-en.html', label: 'Portfolio' },
      ],
      cta: 'Book a shoot',
    },
    heroImg: 'assets/projects/cinematic/video-2.jpg',
  },
  'scale-models.html': {
    icon: 'domain',
    metaAr: 'مجسمات معمارية دقيقة للاجتماعات الاستثمارية والمعارض وصالات البيع في السعودية والخليج.',
    metaEn: 'Precision architectural scale models for investor meetings, exhibitions, and sales galleries.',
    ar: {
      label: 'خدماتنا',
      title: 'المجسمات',
      gold: 'المعمارية',
      hero:
        'نصنع مجسمات فيزيائية دقيقة للعرض على المكاتب التنفيذية والمعارض. يمكن ترقيتها إلى <a href="maquettes.html">مجسم ذكي</a> مع عرض تفاعلي.',
      features: [
        { icon: 'domain', title: 'مخطط رئيسي', desc: 'نموذج الموقع مع المراحل والتنسيقات.' },
        { icon: 'apartment', title: 'أبراج ووحدات', desc: 'مجسمات تفصيلية لعروض المبيعات.' },
        { icon: 'precision_manufacturing', title: 'تشطيب فاخر', desc: 'واجهات مرسومة يدوياً وإضاءة وتنسيق.' },
        { icon: 'view_in_ar', title: 'تكامل ذكي', desc: 'عرض تفاعلي اختياري على المجسم.' },
      ],
      related: [
        { href: 'maquettes.html', label: 'المجسمات الذكية' },
        { href: 'rendering.html', label: 'الإظهار المعماري' },
        { href: '../insights/projects/al-rajhi-riyadh.html', label: 'مشروع الراجحي' },
      ],
      cta: 'اطلب مجسمك',
    },
    en: {
      label: 'Our Services',
      title: 'Scale Models',
      gold: 'Architectural',
      hero:
        'Precision physical models for boardrooms, exhibitions, and sales galleries. Upgrade to a <a href="maquettes-en.html">smart maquette</a> with projection mapping when the brief demands it.',
      features: [
        { icon: 'domain', title: 'Masterplan models', desc: 'Site models showing phasing and landscaping.' },
        { icon: 'apartment', title: 'Tower and unit models', desc: 'Detailed models for sales presentations.' },
        { icon: 'precision_manufacturing', title: 'Premium finishing', desc: 'Hand-painted facades, lighting, and landscape detail.' },
        { icon: 'view_in_ar', title: 'Smart integration', desc: 'Optional projection mapping on select builds.' },
      ],
      related: [
        { href: 'maquettes-en.html', label: 'Smart maquettes' },
        { href: 'rendering-en.html', label: 'Architectural visualization' },
        { href: '../insights/projects/al-rajhi-riyadh-en.html', label: 'Al Rajhi project' },
      ],
      cta: 'Commission a scale model',
    },
    heroImg: 'assets/projects/maquettes/alrajhi3.jpeg',
  },
  'smart-visualization.html': {
    icon: 'layers',
    metaAr: 'منظومة تصور متكاملة تجمع CGI والتفاعل والمجسمات والعروض للمشاريع متعددة المراحل.',
    metaEn: 'Integrated visualization systems combining CGI, interactive layers, maquettes, and presentation tech.',
    ar: {
      label: 'خدماتنا',
      title: 'التصور الذكي',
      gold: 'المتكامل',
      hero:
        'نوحد الرندر والفيلم والتفاعل والمجسم في مكتبة أصول واحدة تخدم كل نقاط اللمس. أساس <a href="../solutions/project-launch.html">ProjectLaunch™</a> للمشاريع الكبرى.',
      features: [
        { icon: 'layers', title: 'مكتبة موحدة', desc: 'مصدر واحد للمخرجات عبر المراحل والقنوات.' },
        { icon: 'sync', title: 'بيانات حية', desc: 'ربط المبيعات والتوفر بالشاشات والمجسمات.' },
        { icon: 'devices', title: 'قنوات متعددة', desc: 'صالة، موقع، جوال، وفعاليات من نفس النظام.' },
        { icon: 'tune', title: 'طرح مرحلي', desc: 'تحديث الأبراج والأحياء مع تقدم البناء.' },
      ],
      related: [
        { href: 'rendering.html', label: 'الإظهار المعماري' },
        { href: 'interactive-experiences.html', label: 'التجارب التفاعلية' },
        { href: '../insights/articles/visual-launch-checklist-guide.html', label: 'دليل الإطلاق البصري' },
      ],
      cta: 'خطط لمنظومة التصور',
    },
    en: {
      label: 'Our Services',
      title: 'Smart Visualization',
      gold: 'Systems',
      hero:
        'One asset library for CGI, film, interactive, and maquette layers across every touchpoint. The foundation of <a href="../solutions/project-launch-en.html">ProjectLaunch™</a> for phased mega-projects.',
      features: [
        { icon: 'layers', title: 'Unified library', desc: 'Single source of truth across phases and channels.' },
        { icon: 'sync', title: 'Live data', desc: 'Sales and availability linked to screens and models.' },
        { icon: 'devices', title: 'Multi-channel', desc: 'Showroom, web, mobile, and events from one system.' },
        { icon: 'tune', title: 'Phased rollouts', desc: 'Update towers and districts as construction progresses.' },
      ],
      related: [
        { href: 'rendering-en.html', label: 'Architectural visualization' },
        { href: 'interactive-experiences-en.html', label: 'Interactive experiences' },
        { href: '../insights/articles/visual-launch-checklist-guide-en.html', label: 'Visual launch guide' },
      ],
      cta: 'Architect your visual system',
    },
    heroImg: 'assets/projects/rendering/jeddah-forum.jpg',
  },
  'web-solutions.html': {
    icon: 'language',
    metaAr: 'مواقع مشاريع وصفحات هبوط ومنصات بيع رقمية ثنائية اللغة للمطورين في السعودية والخليج.',
    metaEn: 'Project websites, landing pages, and bilingual digital sales platforms for GCC developers.',
    ar: {
      label: 'خدماتنا',
      title: 'الحلول الرقمية',
      gold: 'والمواقع',
      hero:
        'نبني مواقع مشاريع وصفحات إطلاق محسّنة للتحويل وربط CRM. جزء من <a href="../solutions/growth-launch.html">GrowthLaunch™</a> مع <a href="digital-marketing.html">التسويق الرقمي</a>.',
      features: [
        { icon: 'language', title: 'موقع المشروع', desc: 'عربي وإنجليزي مع مستكشف الوحدات ونماذج العملاء.' },
        { icon: 'web', title: 'صفحات الإطلاق', desc: 'صفحات حملات مدفوعة وQR للفعاليات.' },
        { icon: 'speed', title: 'أداء وSEO', desc: 'تحميل سريع وبيانات منظمة للبحث في الخليج.' },
        { icon: 'integration_instructions', title: 'ربط CRM', desc: 'نماذج ودردشة متصلة بفريق المبيعات.' },
      ],
      related: [
        { href: 'digital-marketing.html', label: 'التسويق الرقمي' },
        { href: 'branding.html', label: 'الهوية والعلامة' },
        { href: '../insights/tools/project-brief.html', label: 'نموذج Brief المشروع' },
      ],
      cta: 'ابدأ موقع مشروعك',
    },
    en: {
      label: 'Our Services',
      title: 'Web Solutions',
      gold: 'and Platforms',
      hero:
        'Conversion-focused project sites and launch landing pages with CRM-ready forms. Part of <a href="../solutions/growth-launch-en.html">GrowthLaunch™</a> with <a href="digital-marketing-en.html">digital marketing</a>.',
      features: [
        { icon: 'language', title: 'Project websites', desc: 'Bilingual sites with unit finders and lead forms.' },
        { icon: 'web', title: 'Launch landing pages', desc: 'Campaign pages for paid media and event QR flows.' },
        { icon: 'speed', title: 'Performance and SEO', desc: 'Fast loading and structured data for GCC search.' },
        { icon: 'integration_instructions', title: 'CRM integration', desc: 'Forms and chat connected to your sales stack.' },
      ],
      related: [
        { href: 'digital-marketing-en.html', label: 'Digital marketing' },
        { href: 'branding-en.html', label: 'Branding' },
        { href: '../insights/tools/project-brief-en.html', label: 'Project brief template' },
      ],
      cta: 'Start your web project',
    },
    heroImg: 'assets/projects/rendering/alrajhi2.jpeg',
  },
};

const STUB_CSS = `
.gh-svc-hero{padding:140px 24px 72px;background:#0A0A0A;text-align:center;position:relative;overflow:hidden}
.gh-svc-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.35));pointer-events:none}
.gh-svc-hero-inner{position:relative;z-index:2;max-width:820px;margin:0 auto}
.gh-svc-hero .gh-label{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.2em;color:#C9A84C;margin-bottom:16px;text-transform:uppercase}
.gh-svc-hero h1{font-size:clamp(32px,5vw,52px);font-weight:700;color:#FAFAF8;line-height:1.15;margin-bottom:16px}
.gh-svc-hero h1 .gold{color:#C9A84C}
.gh-svc-hero .gh-lead{font-size:17px;line-height:1.85;color:rgba(255,255,255,.72);margin-bottom:28px}
.gh-svc-hero .gh-lead a{color:#C9A84C;text-decoration:underline;text-underline-offset:3px}
.gh-svc-hero .gh-btns{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.gh-svc-body{padding:80px 24px;background:#FAFAF8}
.gh-svc-body-inner{max-width:1100px;margin:0 auto}
.gh-svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:32px}
.gh-svc-feat{background:#FFF;border:1px solid rgba(26,26,26,.08);padding:28px 24px;text-align:center}
.gh-svc-feat .icon{color:#C9A84C;font-size:32px;margin-bottom:12px}
.gh-svc-feat h3{font-size:16px;font-weight:700;color:#1A1A1A;margin-bottom:8px}
.gh-svc-feat p{font-size:14px;line-height:1.75;color:rgba(26,26,26,.65);margin:0}
.gh-svc-links{padding:56px 24px;background:#F5F4F0;text-align:center}
.gh-svc-links-inner{max-width:900px;margin:0 auto}
.gh-svc-links h2{font-size:22px;font-weight:700;margin-bottom:20px;color:#1A1A1A}
.gh-svc-link-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.gh-svc-link-row a{padding:10px 18px;border:1px solid rgba(201,168,76,.35);color:#1A1A1A;font-size:13px;font-weight:600;text-decoration:none;transition:all .25s}
.gh-svc-link-row a:hover{background:#C9A84C;border-color:#C9A84C;color:#0A0A0A}
.gh-svc-cta{padding:72px 24px;background:#1A1A1A;text-align:center}
.gh-svc-cta h2{color:#FAFAF8;font-size:clamp(22px,3vw,32px);font-weight:600;margin-bottom:12px}
.gh-svc-cta p{color:rgba(255,255,255,.6);font-size:15px;margin-bottom:24px;max-width:480px;margin-left:auto;margin-right:auto}
@media(max-width:768px){.gh-svc-hero{padding:120px 20px 56px}}
`;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function featuresHtml(arItems, enItems) {
  return arItems
    .map(
      (f, i) => `<div class="gh-svc-feat reveal">
      <span class="material-symbols-outlined icon">${f.icon}</span>
      <h3><span class="ar">${esc(f.title)}</span><span class="en">${esc(enItems[i].title)}</span></h3>
      <p><span class="ar-block">${esc(f.desc)}</span><span class="en-block">${esc(enItems[i].desc)}</span></p>
    </div>`
    )
    .join('\n');
}

function relatedHtml(arItems, enItems) {
  return arItems
    .map(
      (r, i) =>
        `<a href="../${r.href}"><span class="ar">${esc(r.label)}</span><span class="en">${esc(enItems[i].label)}</span></a>`
    )
    .join('\n');
}

function bodyHtml(cfg) {
  const ar = cfg.ar;
  const en = cfg.en;
  return `<section class="gh-svc-hero" style="background-image:url(../${cfg.heroImg});background-size:cover;background-position:center">
  <div class="gh-svc-hero-inner reveal">
    <span class="gh-label"><span class="ar">${esc(ar.label)}</span><span class="en">${esc(en.label)}</span></span>
    <h1><span class="ar">${esc(ar.title)} <span class="gold">${esc(ar.gold)}</span></span><span class="en">${esc(en.title)} <span class="gold">${esc(en.gold)}</span></span></h1>
    <p class="gh-lead"><span class="ar-block">${ar.hero}</span><span class="en-block">${en.hero}</span></p>
    <div class="gh-btns">
      <a href="../contact-us.html" class="btn-pill btn-pill-gold ar-block">${esc(ar.cta)}</a>
      <a href="../contact-us-en.html" class="btn-pill btn-pill-gold en-block">${esc(en.cta)}</a>
      <a href="../portfolio.html" class="btn-pill btn-pill-outline ar-block">معرض الأعمال</a>
      <a href="../portfolio-en.html" class="btn-pill btn-pill-outline en-block">View portfolio</a>
    </div>
  </div>
</section>
<section class="gh-svc-body">
  <div class="gh-svc-body-inner">
    <div class="gh-svc-grid">${featuresHtml(ar.features, en.features)}</div>
  </div>
</section>
<section class="gh-svc-links">
  <div class="gh-svc-links-inner reveal">
    <h2><span class="ar">روابط ذات صلة</span><span class="en">Related links</span></h2>
    <div class="gh-svc-link-row">${relatedHtml(ar.related, en.related)}</div>
  </div>
</section>
<section class="gh-svc-cta reveal">
  <h2><span class="ar">جاهز لمناقشة مشروعك؟</span><span class="en">Ready to discuss your project?</span></h2>
  <p><span class="ar">فريقنا يرد خلال 24 ساعة عمل. شاركنا الموجز أو <a href="../insights/tools/project-brief.html" style="color:#C9A84C">عبّئ نموذج Brief</a>.</span><span class="en">Our team responds within 24 business hours. Share your brief or <a href="../insights/tools/project-brief-en.html" style="color:#C9A84C">use the project brief template</a>.</span></p>
  <a href="../contact-us.html" class="btn-pill btn-pill-gold ar-block">احجز جلسة استراتيجية</a>
  <a href="../contact-us-en.html" class="btn-pill btn-pill-gold en-block">Book a strategy session</a>
</section>`;
}

function patch(file, cfg) {
  const full = path.join(SERVICES, file);
  let html = fs.readFileSync(full, 'utf8');

  html = html.replace(/<meta name="description" content="[^"]*"\/?>/, `<meta name="description" content="${esc(cfg.metaAr)}"/>`);

  if (!html.includes('gh-svc-hero')) {
    if (!html.includes('.gh-svc-hero{')) {
      html = html.replace('</style>', `${STUB_CSS}\n</style>`);
    }
    html = html.replace(
      /<div id="main-content" tabindex="-1" class="gh-main-anchor"><\/div>[\s\S]*?(?=<footer)/,
      `<div id="main-content" tabindex="-1" class="gh-main-anchor"></div>\n${bodyHtml(cfg)}\n`
    );
  }

  fs.writeFileSync(full, html, 'utf8');
  console.log('  enhanced AR stub:', file);
}

console.log('Enhancing AR service stub pages…');
for (const [file, cfg] of Object.entries(STUBS)) {
  patch(file, cfg);
}
console.log(`Done — ${Object.keys(STUBS).length} enhanced AR stubs.`);
