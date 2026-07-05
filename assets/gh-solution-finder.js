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
        { t: 'Yes — we need interactive experiences', scores: { growth: 0, project: 3, brand: 1 } },
        { t: 'Planning one for launch', scores: { growth: 1, project: 3, brand: 0 } },
        { t: 'No — digital channels only', scores: { growth: 3, project: 1, brand: 1 } }
      ]
    },
    {
      q: 'What assets do you already have?',
      options: [
        { t: 'Basic renders or outdated visuals', scores: { growth: 1, project: 2, brand: 1 } },
        { t: 'Strong visuals but weak sales system', scores: { growth: 3, project: 2, brand: 0 } },
        { t: 'Brand guidelines need refresh', scores: { growth: 0, project: 1, brand: 3 } }
      ]
    },
    {
      q: 'Team size handling marketing/sales?',
      options: [
        { t: 'Small team — need automation & tools', scores: { growth: 3, project: 1, brand: 0 } },
        { t: 'Dedicated launch team', scores: { growth: 1, project: 3, brand: 1 } },
        { t: 'Corporate marketing department', scores: { growth: 0, project: 1, brand: 3 } }
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
        { t: 'نعم — نحتاج تجارب تفاعلية', scores: { growth: 0, project: 3, brand: 1 } },
        { t: 'نخطط لصالة عند الإطلاق', scores: { growth: 1, project: 3, brand: 0 } },
        { t: 'لا — قنوات رقمية فقط', scores: { growth: 3, project: 1, brand: 1 } }
      ]
    },
    {
      q: 'ما الأصول البصرية المتوفرة لديك؟',
      options: [
        { t: 'رندر أساسي أو مواد قديمة', scores: { growth: 1, project: 2, brand: 1 } },
        { t: 'مواد قوية لكن نظام مبيعات ضعيف', scores: { growth: 3, project: 2, brand: 0 } },
        { t: 'هوية تحتاج تجديداً', scores: { growth: 0, project: 1, brand: 3 } }
      ]
    },
    {
      q: 'حجم فريق التسويق/المبيعات؟',
      options: [
        { t: 'فريق صغير — نحتاج أتمتة وأدوات', scores: { growth: 3, project: 1, brand: 0 } },
        { t: 'فريق إطلاق مخصص', scores: { growth: 1, project: 3, brand: 1 } },
        { t: 'قسم تسويق مؤسسي', scores: { growth: 0, project: 1, brand: 3 } }
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

  var scores = { growth: 0, project: 0, brand: 0 };
  var step = 0;
  var root = document.getElementById('ghSolutionFinder');
  if (!root) return;

  var stepsEl = root.querySelector('.gh-quiz-steps');
  var resultEl = root.querySelector('.gh-quiz-result');
  var progressEl = root.querySelector('.gh-quiz-progress');

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
      '<h3 style="font-size:20px;margin-bottom:8px">' + q.q + '</h3>' +
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
        step += 1;
        renderStep();
      });
    });
  }

  function showResult() {
    stepsEl.innerHTML = '';
    var winner = 'growth';
    if (scores.project >= scores.growth && scores.project >= scores.brand) winner = 'project';
    else if (scores.brand >= scores.growth && scores.brand >= scores.project) winner = 'brand';
    var r = RESULTS[winner];
    if (progressEl) progressEl.textContent = isEn ? 'Your recommendation' : 'توصيتنا';
    resultEl.style.display = 'block';
    resultEl.innerHTML =
      '<h3>' + r.title + '</h3>' +
      '<p style="margin-bottom:20px;line-height:1.7;color:#555">' + r.desc + '</p>' +
      '<a href="' + r.href + '" class="gh-btn-editorial">' +
      (isEn ? 'Explore Solution' : 'اكتشف الحل') +
      ' <span class="material-symbols-outlined" style="font-size:16px">arrow_forward</span></a> ' +
      '<a href="../contact-us' + (isEn ? '-en' : '') + '.html" class="gh-btn-editorial gh-btn-editorial--outline" style="margin-inline-start:12px">' +
      (isEn ? 'Book a Session' : 'احجز جلسة') + '</a>';
  }

  renderStep();
})();
