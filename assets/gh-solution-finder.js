(function () {
  'use strict';

  var isEn = (document.documentElement.lang || '').toLowerCase() === 'en'
    || document.documentElement.dir === 'ltr';

  var QUESTIONS = isEn ? [
    {
      q: 'What is your primary goal right now?',
      options: [
        { t: 'Generate more qualified leads for my projects', scores: { growth: 3, project: 1, brand: 0 } },
        { t: 'Launch a new real estate development', scores: { growth: 0, project: 3, brand: 1 } },
        { t: 'Strengthen or reposition our brand', scores: { growth: 1, project: 0, brand: 3 } }
      ]
    },
    {
      q: 'What stage is your project in?',
      options: [
        { t: 'Pre-launch / off-plan sales', scores: { growth: 1, project: 3, brand: 1 } },
        { t: 'Active sales — need better conversion', scores: { growth: 3, project: 2, brand: 0 } },
        { t: 'Established brand — scaling presence', scores: { growth: 1, project: 0, brand: 3 } }
      ]
    },
    {
      q: 'Do you have a sales gallery or exhibition space?',
      options: [
        { t: 'Yes — we need interactive experiences', scores: { growth: 0, project: 3, brand: 1 }, services: { interactive: 3, rendering: 1 } },
        { t: 'Planning one for launch', scores: { growth: 1, project: 3, brand: 0 }, services: { rendering: 2, maquette: 2 } },
        { t: 'No — digital channels only', scores: { growth: 3, project: 1, brand: 1 }, services: { rendering: 2, animation: 1 } }
      ]
    },
    {
      q: 'What assets do you already have?',
      options: [
        { t: 'Basic renders or outdated visuals', scores: { growth: 1, project: 2, brand: 1 }, services: { rendering: 3 } },
        { t: 'Strong visuals but weak sales system', scores: { growth: 3, project: 2, brand: 0 }, services: { interactive: 2, production: 2 } },
        { t: 'Brand guidelines need refresh', scores: { growth: 0, project: 1, brand: 3 }, services: { production: 2 } }
      ]
    },
    {
      q: 'Team size handling marketing/sales?',
      options: [
        { t: 'Small team — need automation & tools', scores: { growth: 3, project: 1, brand: 0 } },
        { t: 'Dedicated launch team', scores: { growth: 1, project: 3, brand: 1 } },
        { t: 'Corporate marketing department', scores: { growth: 0, project: 1, brand: 3 } }
      ]
    },
    {
      q: 'When do you need key visual assets ready?',
      options: [
        { t: 'Within 4–8 weeks', scores: { growth: 2, project: 2, brand: 0 } },
        { t: '3–6 months (aligned with launch)', scores: { growth: 1, project: 3, brand: 1 } },
        { t: '6+ months — still in planning', scores: { growth: 0, project: 1, brand: 3 } }
      ]
    },
    {
      q: 'Which visual output matters most for your next milestone?',
      options: [
        { t: 'Photoreal renders & masterplan views', scores: { growth: 1, project: 2, brand: 1 }, services: { rendering: 4 } },
        { t: 'Cinematic CGI launch film', scores: { growth: 1, project: 3, brand: 1 }, services: { animation: 4 } },
        { t: 'Physical maquette or smart model', scores: { growth: 0, project: 3, brand: 1 }, services: { maquette: 4 } },
        { t: 'Interactive sales platform / tour', scores: { growth: 2, project: 3, brand: 0 }, services: { interactive: 4 } }
      ]
    }
  ] : [
    {
      q: 'ما هدفك الرئيسي الآن؟',
      options: [
        { t: 'توليد عملاء مؤهلين لمشاريعي', scores: { growth: 3, project: 1, brand: 0 } },
        { t: 'إطلاق مشروع عقاري جديد', scores: { growth: 0, project: 3, brand: 1 } },
        { t: 'تعزيز أو إعادة تموضع العلامة التجارية', scores: { growth: 1, project: 0, brand: 3 } }
      ]
    },
    {
      q: 'في أي مرحلة مشروعك؟',
      options: [
        { t: 'ما قبل الإطلاق / بيع على الخارطة', scores: { growth: 1, project: 3, brand: 1 } },
        { t: 'مبيعات نشطة — نحتاج تحسين التحويل', scores: { growth: 3, project: 2, brand: 0 } },
        { t: 'علامة راسخة — توسيع الحضور', scores: { growth: 1, project: 0, brand: 3 } }
      ]
    },
    {
      q: 'هل لديك صالة بيع أو معرض؟',
      options: [
        { t: 'نعم — نحتاج تجارب تفاعلية', scores: { growth: 0, project: 3, brand: 1 }, services: { interactive: 3, rendering: 1 } },
        { t: 'نخطط لصالة عند الإطلاق', scores: { growth: 1, project: 3, brand: 0 }, services: { rendering: 2, maquette: 2 } },
        { t: 'لا — قنوات رقمية فقط', scores: { growth: 3, project: 1, brand: 1 }, services: { rendering: 2, animation: 1 } }
      ]
    },
    {
      q: 'ما الأصول البصرية المتوفرة لديك؟',
      options: [
        { t: 'رندر أساسي أو مواد قديمة', scores: { growth: 1, project: 2, brand: 1 }, services: { rendering: 3 } },
        { t: 'مواد قوية لكن نظام مبيعات ضعيف', scores: { growth: 3, project: 2, brand: 0 }, services: { interactive: 2, production: 2 } },
        { t: 'هوية تحتاج تجديداً', scores: { growth: 0, project: 1, brand: 3 }, services: { production: 2 } }
      ]
    },
    {
      q: 'حجم فريق التسويق/المبيعات؟',
      options: [
        { t: 'فريق صغير — نحتاج أتمتة وأدوات', scores: { growth: 3, project: 1, brand: 0 } },
        { t: 'فريق إطلاق مخصص', scores: { growth: 1, project: 3, brand: 1 } },
        { t: 'قسم تسويق مؤسسي', scores: { growth: 0, project: 1, brand: 3 } }
      ]
    },
    {
      q: 'متى تحتاج الأصول البصرية الرئيسية؟',
      options: [
        { t: 'خلال 4–8 أسابيع', scores: { growth: 2, project: 2, brand: 0 } },
        { t: '3–6 أشهر (متزامن مع الإطلاق)', scores: { growth: 1, project: 3, brand: 1 } },
        { t: 'أكثر من 6 أشهر — مرحلة تخطيط', scores: { growth: 0, project: 1, brand: 3 } }
      ]
    },
    {
      q: 'أي مخرج بصري هو الأهم لمرحلتك القادمة؟',
      options: [
        { t: 'رندر فوتوري ومشاهد المخطط الرئيسي', scores: { growth: 1, project: 2, brand: 1 }, services: { rendering: 4 } },
        { t: 'فيلم CGI سينمائي للإطلاق', scores: { growth: 1, project: 3, brand: 1 }, services: { animation: 4 } },
        { t: 'مجسم فيزيائي أو نموذج ذكي', scores: { growth: 0, project: 3, brand: 1 }, services: { maquette: 4 } },
        { t: 'منصة مبيعات تفاعلية / جولة افتراضية', scores: { growth: 2, project: 3, brand: 0 }, services: { interactive: 4 } }
      ]
    }
  ];

  var RESULTS = isEn ? {
    growth: {
      title: 'GrowthLaunch™',
      desc: 'Best fit for lead generation, sales automation, and improving conversion with a visual sales system.',
      href: '../solutions/growth-launch-en.html'
    },
    project: {
      title: 'ProjectLaunch™',
      desc: 'Best fit for a full real estate launch: visualization, branding, marketing, and sales gallery support.',
      href: '../solutions/project-launch-en.html'
    },
    brand: {
      title: 'BrandScale™',
      desc: 'Best fit for building and scaling your brand through integrated creative and marketing solutions.',
      href: '../solutions/brand-scale-en.html'
    }
  } : {
    growth: {
      title: 'GrowthLaunch™',
      desc: 'الأنسب لتوليد العملاء وأتمتة المتابعة وتحسين التحويل عبر نظام مبيعات بصري.',
      href: '../solutions/growth-launch.html'
    },
    project: {
      title: 'ProjectLaunch™',
      desc: 'الأنسب لإطلاق مشروع عقاري متكامل: تصور، هوية، تسويق، ودعم صالة البيع.',
      href: '../solutions/project-launch.html'
    },
    brand: {
      title: 'BrandScale™',
      desc: 'الأنسب لبناء وتعزيز العلامة التجارية عبر حلول إبداعية وتسويقية متكاملة.',
      href: '../solutions/brand-scale.html'
    }
  };

  var SERVICES = isEn ? {
    rendering: { title: 'Architectural Rendering', href: '../../services/rendering.html' },
    animation: { title: 'Cinematic CGI & Animation', href: '../../services/animation.html' },
    maquette: { title: 'Maquettes & Scale Models', href: '../../services/maquettes.html' },
    interactive: { title: 'Interactive Experiences', href: '../../services/interactive.html' },
    production: { title: 'Visual Production', href: '../../services/production.html' }
  } : {
    rendering: { title: 'الإظهار المعماري', href: '../../services/rendering.html' },
    animation: { title: 'الـ CGI السينمائي والأنيميشن', href: '../../services/animation.html' },
    maquette: { title: 'المجسمات والنماذج', href: '../../services/maquettes.html' },
    interactive: { title: 'التجارب التفاعلية', href: '../../services/interactive.html' },
    production: { title: 'الإنتاج البصري', href: '../../services/production.html' }
  };

  var SCORE_LABELS = isEn
    ? { growth: 'GrowthLaunch', project: 'ProjectLaunch', brand: 'BrandScale' }
    : { growth: 'GrowthLaunch', project: 'ProjectLaunch', brand: 'BrandScale' };

  var scores = { growth: 0, project: 0, brand: 0 };
  var serviceScores = { rendering: 0, animation: 0, maquette: 0, interactive: 0, production: 0 };
  var step = 0;
  var root = document.getElementById('ghSolutionFinder');
  if (!root) return;

  var stepsEl = root.querySelector('.gh-quiz-steps');
  var resultEl = root.querySelector('.gh-quiz-result');
  var progressEl = root.querySelector('.gh-quiz-progress');

  function addServiceScores(svc) {
    if (!svc) return;
    Object.keys(svc).forEach(function (k) {
      if (serviceScores[k] !== undefined) serviceScores[k] += svc[k];
    });
  }

  function rankedSolutions() {
    return ['growth', 'project', 'brand']
      .map(function (key) { return { key: key, score: scores[key] }; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  function topServices(limit) {
    return Object.keys(serviceScores)
      .map(function (key) { return { key: key, score: serviceScores[key] }; })
      .filter(function (s) { return s.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit || 3);
  }

  function renderStep() {
    if (step >= QUESTIONS.length) {
      showResult();
      return;
    }
    var q = QUESTIONS[step];
    if (progressEl) {
      progressEl.textContent = (isEn ? 'Question ' : 'السؤال ') + (step + 1) + ' / ' + QUESTIONS.length;
    }
    stepsEl.innerHTML =
      '<div class="gh-quiz-step active">' +
      '<h3>' + q.q + '</h3>' +
      '<div class="gh-quiz-options">' +
      q.options.map(function (opt, i) {
        return '<button type="button" class="gh-quiz-opt" data-i="' + i + '">' + opt.t + '</button>';
      }).join('') +
      '</div></div>';

    stepsEl.querySelectorAll('.gh-quiz-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var opt = q.options[parseInt(btn.dataset.i, 10)];
        scores.growth += opt.scores.growth;
        scores.project += opt.scores.project;
        scores.brand += opt.scores.brand;
        addServiceScores(opt.services);
        step += 1;
        renderStep();
      });
    });
  }

  function scoreBarsHtml() {
    var total = scores.growth + scores.project + scores.brand || 1;
    return ['growth', 'project', 'brand'].map(function (key) {
      var pct = Math.round((scores[key] / total) * 100);
      return (
        '<div class="gh-quiz-bar-row">' +
        '<span class="gh-quiz-bar-label">' + SCORE_LABELS[key] + '</span>' +
        '<div class="gh-quiz-bar-track"><div class="gh-quiz-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="gh-quiz-bar-pct">' + pct + '%</span>' +
        '</div>'
      );
    }).join('');
  }

  function showResult() {
    stepsEl.innerHTML = '';
    var ranked = rankedSolutions();
    var primary = ranked[0];
    var secondary = ranked[1];
    var r = RESULTS[primary.key];
    var r2 = RESULTS[secondary.key];
    var services = topServices(3);

    if (progressEl) progressEl.textContent = isEn ? 'Your recommendation' : 'توصيتنا';

    var servicesHtml = '';
    if (services.length) {
      servicesHtml =
        '<div class="gh-quiz-services">' +
        '<h4>' + (isEn ? 'Recommended services' : 'خدمات مقترحة') + '</h4>' +
        '<div class="gh-quiz-service-links">' +
        services.map(function (s) {
          var svc = SERVICES[s.key];
          return '<a href="' + svc.href + '" class="gh-quiz-svc-link">' + svc.title + '</a>';
        }).join('') +
        '</div></div>';
    }

    resultEl.style.display = 'block';
    resultEl.innerHTML =
      '<p class="gh-quiz-result-kicker">' + (isEn ? 'Primary match' : 'التوصية الرئيسية') + '</p>' +
      '<h3>' + r.title + '</h3>' +
      '<p>' + r.desc + '</p>' +
      '<div class="gh-quiz-bars">' + scoreBarsHtml() + '</div>' +
      (secondary.score > 0
        ? '<div class="gh-quiz-secondary">' +
          '<h4>' + (isEn ? 'Also consider' : 'بديل مناسب أيضاً') + '</h4>' +
          '<p><strong>' + r2.title + '</strong> — ' + r2.desc + '</p>' +
          '<a href="' + r2.href + '" class="gh-quiz-svc-link">' +
          (isEn ? 'View ' : 'عرض ') + r2.title + '</a>' +
          '</div>'
        : '') +
      servicesHtml +
      '<div class="gh-quiz-actions">' +
      '<a href="' + r.href + '" class="gh-btn-editorial">' +
      (isEn ? 'Explore Solution' : 'اكتشف الحل') +
      ' <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span></a>' +
      '<a href="../contact-us' + (isEn ? '-en' : '') + '.html" class="gh-btn-editorial gh-btn-editorial--outline">' +
      (isEn ? 'Book a Session' : 'احجز جلسة') + '</a>' +
      '<button type="button" class="gh-btn-editorial gh-btn-editorial--outline gh-quiz-restart">' +
      (isEn ? 'Start over' : 'إعادة الاختبار') + '</button>' +
      '</div>';

    resultEl.querySelector('.gh-quiz-restart').addEventListener('click', function () {
      scores = { growth: 0, project: 0, brand: 0 };
      serviceScores = { rendering: 0, animation: 0, maquette: 0, interactive: 0, production: 0 };
      step = 0;
      resultEl.style.display = 'none';
      resultEl.innerHTML = '';
      renderStep();
    });
  }

  renderStep();
})();
