#!/usr/bin/env node
/**
 * Polish insights project/report JSON: remove em/en dashes, ensure keywords + faq.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function polishText(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/(\d)\s*-\s*(\d)/g, '$1 to $2')
    .replace(/-/g, ', ')
    .replace(/, /g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s+/g, ', ')
    .trim();
}

function walk(obj) {
  if (Array.isArray(obj)) return obj.map(walk);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = walk(v);
    return out;
  }
  return polishText(obj);
}

const REPORT_META = {
  'abraj-omar-makkah-visual-report': {
    keywords: {
      ar: {
        short: ['أبراج عمر', 'ضيافة مكة', 'M Gallery', 'حساسية المكان'],
        long: [
          'تقرير بصري أبراج عمر M Gallery مكة',
          'ضيافة قرب الحرم إظهار معماري',
          'مسار ضيف مستثمر حاج',
          'قراءة سوق Ruwaq Tours مكة'
        ]
      },
      en: {
        short: ['Abraj Omar', 'Makkah hospitality', 'M Gallery', 'place sensitivity'],
        long: [
          'Abraj Omar M Gallery Makkah visual report',
          'near-Haram hospitality archviz',
          'guest path investor pilgrim',
          'Ruwaq Tours Makkah market reading'
        ]
      }
    },
    faq: [
      {
        q: { ar: 'هل هذا تقرير تسليم Graphics House؟', en: 'Is this a Graphics House delivery report?' },
        a: {
          ar: 'لا. قراءة سوقية لسياق أبراج عمر (M Gallery) من مصادر عامة، لا ادعاء عمل من Graphics House.',
          en: 'No. A market reading of Abraj Omar (M Gallery) from public sources, not a Graphics House delivery claim.'
        }
      },
      {
        q: { ar: 'ما أهم معيار بصري لضيافة قرب الحرم؟', en: 'What is the top visual criterion for near-Haram hospitality?' },
        a: {
          ar: 'مسار ضيف موثوق ووضوح جودة الإقامة دون مبالغة في القرب أو الإطلالة.',
          en: 'A credible guest path and clear lodging quality without exaggerating proximity or views.'
        }
      },
      {
        q: { ar: 'أين أقرأ إطار حساسية مكة؟', en: 'Where is the Makkah sensitivity frame?' },
        a: {
          ar: '[حساسية الإظهار في مكة](https://3dgraphicshouse.com/insights/articles/makkah-project-visual-sensitivity.html) و[ضيافة قرب الحرم](https://3dgraphicshouse.com/insights/articles/makkah-hospitality-near-haram-viz.html).',
          en: '[Makkah visualization sensitivity](https://3dgraphicshouse.com/insights/articles/makkah-project-visual-sensitivity-en.html) and [near-Haram hospitality](https://3dgraphicshouse.com/insights/articles/makkah-hospitality-near-haram-viz-en.html).'
        }
      },
      {
        q: { ar: 'أين أعمال Graphics House الموثقة في مكة؟', en: 'Where is documented Graphics House work in Makkah?' },
        a: {
          ar: '[أبراج الخير](https://3dgraphicshouse.com/insights/projects/al-khair-makkah.html) و[ميثاق مكة](https://3dgraphicshouse.com/insights/projects/makkah-charter-mwl.html).',
          en: '[Al Khair Heights](https://3dgraphicshouse.com/insights/projects/al-khair-makkah-en.html) and [Makkah Charter](https://3dgraphicshouse.com/insights/projects/makkah-charter-mwl-en.html).'
        }
      }
    ]
  },
  'jeddah-gate-visual-report': {
    keywords: {
      ar: {
        short: ['باب جدة', 'مختلط الاستخدام', 'إطلاق بصري', 'جدة'],
        long: [
          'تقرير بصري باب جدة جدة جيت',
          'بوابة مختلطة مستثمر مشتري',
          'واجهات نهار ليل تفاعل بلوك',
          'Ruwaq Tours قراءة سوق محلية'
        ]
      },
      en: {
        short: ['Jeddah Gate', 'mixed use', 'visual launch', 'Jeddah'],
        long: [
          'Jeddah Gate visual report mixed use',
          'investor buyer pack gate launch',
          'day night façade block interaction',
          'Ruwaq Tours local market reading'
        ]
      }
    },
    faq: [
      {
        q: { ar: 'هل Graphics House نفّذت باب جدة؟', en: 'Did Graphics House deliver Jeddah Gate?' },
        a: {
          ar: 'لا. هذا تقرير سوق تحت الإعداد يصف احتياجات الإطلاق البصري، لا شهادة تسليم.',
          en: 'No. This under-prep market report describes visual launch needs, not a delivery certificate.'
        }
      },
      {
        q: { ar: 'لماذا يهم فصل حزمة المستثمر عن المشتري؟', en: 'Why separate investor and buyer packs?' },
        a: {
          ar: 'المستثمر يقرأ المخطط والمزيج؛ المشتري يقرأ الوحدة والتشطيب. ملف واحد يضعف الاثنين.',
          en: 'Investors read plan and mix; buyers read unit and finishes. One file weakens both.'
        }
      },
      {
        q: { ar: 'أين الإطار المرجعي للبوابة المختلطة؟', en: 'Where is the mixed-use gate reference frame?' },
        a: {
          ar: '[إطلاق بصري لبوابة مختلطة](https://3dgraphicshouse.com/insights/articles/mixed-use-gate-visual-launch.html) و[جدة](https://3dgraphicshouse.com/locations/jeddah.html).',
          en: '[Mixed-use gate visual launch](https://3dgraphicshouse.com/insights/articles/mixed-use-gate-visual-launch-en.html) and [Jeddah](https://3dgraphicshouse.com/locations/jeddah-en.html).'
        }
      },
      {
        q: { ar: 'ما دور Ruwaq Tours هنا؟', en: 'What is Ruwaq Tours role here?' },
        a: {
          ar: 'مصدر سوقي عام لقراءة أنماط المشاريع عبر [Ruwaq Tours](https://ruwaq.co/tours)، لا دليل تسليم Graphics House.',
          en: 'A general market source for project patterns via [Ruwaq Tours](https://ruwaq.co/tours), not Graphics House delivery proof.'
        }
      }
    ]
  },
  'oman-coastal-community-visual-report': {
    keywords: {
      ar: {
        short: ['مسقط ساحلي', 'مجتمع مخطط', 'عُمان', 'EN-first'],
        long: [
          'تقرير بصري مجتمعات مسقط الساحلية',
          'إطلاق بصري خليجي مقابل سعودي',
          'ProjectLaunch عُمان مخططات بحرية',
          'قراءة نوع AIDA Al Mouj'
        ]
      },
      en: {
        short: ['Muscat coastal', 'masterplan', 'Oman', 'EN-first'],
        long: [
          'Muscat coastal community visual report',
          'Gulf vs Saudi visual launch',
          'ProjectLaunch Oman waterfront masterplan',
          'AIDA Al Mouj type reading'
        ]
      }
    },
    faq: [
      {
        q: { ar: 'هل هذا تقرير عن عميل Graphics House؟', en: 'Is this a Graphics House client report?' },
        a: {
          ar: 'لا. قراءة نوع لسوق مسقط الساحلي؛ الأسماء أمثلة نمطية لا عملاء.',
          en: 'No. A type reading of Muscat coastal market; names are pattern examples, not clients.'
        }
      },
      {
        q: { ar: 'كيف يختلف الإطلاق الخليجي عن السعودي؟', en: 'How does Gulf launch differ from Saudi?' },
        a: {
          ar: 'غالباً EN-first، رسائل تملك دولية، ومخططات بحرية. راجع [سعودي مقابل خليجي](https://3dgraphicshouse.com/insights/articles/saudi-vs-gulf-visual-launch.html).',
          en: 'Often EN-first, international ownership messages, waterfront masterplans. See [Saudi vs Gulf visual launch](https://3dgraphicshouse.com/insights/articles/saudi-vs-gulf-visual-launch-en.html).'
        }
      },
      {
        q: { ar: 'ما إطار Graphics House لعُمان؟', en: 'What is the Graphics House Oman frame?' },
        a: {
          ar: '[ProjectLaunch™ عُمان](https://3dgraphicshouse.com/solutions/project-launch-oman.html) وصفحة [عُمان](https://3dgraphicshouse.com/locations/oman.html).',
          en: '[ProjectLaunch™ Oman](https://3dgraphicshouse.com/solutions/project-launch-oman.html) and the [Oman location page](https://3dgraphicshouse.com/locations/oman-en.html).'
        }
      },
      {
        q: { ar: 'كيف تُدار لوجستيات التركيب من جدة؟', en: 'How are install logistics managed from Jeddah?' },
        a: {
          ar: 'جدولة إصدار مبكرة للمجسم والشاشات؛ التركيب جزء من تخطيط [ProjectLaunch](https://3dgraphicshouse.com/solutions/project-launch-oman.html).',
          en: 'Early version lock for maquette and screens; install is part of [ProjectLaunch](https://3dgraphicshouse.com/solutions/project-launch-oman.html) planning.'
        }
      }
    ]
  },
  'sedra-roshn-visual-report': {
    keywords: {
      ar: {
        short: ['سدرة', 'ROSHN', 'مجتمع مخطط', 'الرياض'],
        long: [
          'تقرير بصري سدرة شمال الرياض',
          'مبيعات مجتمع مراحل مزيج منتجات',
          'SEDRA Residence وسيط تفاعلي',
          'Ruwaq Tours قراءة سوق ROSHN'
        ]
      },
      en: {
        short: ['Sedra', 'ROSHN', 'masterplan community', 'Riyadh'],
        long: [
          'Sedra north Riyadh visual report',
          'community sales phasing product mix',
          'SEDRA Residence broker interaction',
          'Ruwaq Tours ROSHN market reading'
        ]
      }
    },
    faq: [
      {
        q: { ar: 'هل Graphics House نفّذت سدرة؟', en: 'Did Graphics House deliver Sedra?' },
        a: {
          ar: 'لا. قراءة سوقية لسدرة كمجتمع مخطط، لا ادعاء تسليم.',
          en: 'No. A market reading of Sedra as a masterplan community, not a delivery claim.'
        }
      },
      {
        q: { ar: 'ما الذي يبيع المجتمع المخطط بصرياً؟', en: 'What does a masterplan community sell visually?' },
        a: {
          ar: 'مسار يومي ومرافق ومراحل، لا واجهة فيلا وحدها. راجع [مبيعات المجتمع المخطط](https://3dgraphicshouse.com/insights/articles/masterplan-community-visual-sales.html).',
          en: 'Daily path, amenities, and phasing, not villa façade alone. See [masterplan community visual sales](https://3dgraphicshouse.com/insights/articles/masterplan-community-visual-sales-en.html).'
        }
      },
      {
        q: { ar: 'كيف يُقارن الوسيط بين منتجات سدرة؟', en: 'How do brokers compare Sedra products?' },
        a: {
          ar: 'بطاقة منتج لكل فئة (فيلا، دوبلكس، تاون هاوس، شقة، Residence) مع حالة المرحلة الحالية.',
          en: 'A product card per class (villa, duplex, townhouse, apartment, Residence) with current phase status.'
        }
      },
      {
        q: { ar: 'أين إطار الإطلاق السعودي العام؟', en: 'Where is the general Saudi launch frame?' },
        a: {
          ar: '[إطلاق المشاريع للمطورين السعوديين](https://3dgraphicshouse.com/insights/articles/project-launch-saudi-developers.html) و[ProjectLaunch™](https://3dgraphicshouse.com/solutions/project-launch.html).',
          en: '[Project launch for Saudi developers](https://3dgraphicshouse.com/insights/articles/project-launch-saudi-developers-en.html) and [ProjectLaunch™](https://3dgraphicshouse.com/solutions/project-launch-en.html).'
        }
      }
    ]
  }
};

const REPORT_TITLE_FIXES = {
  'abraj-omar-makkah-visual-report': {
    title: {
      ar: 'أبراج عمر M Gallery: جاهزية بصرية لضيافة قرب الحرم دون ادعاء مضلل',
      en: 'Abraj Omar M Gallery: near-Haram hospitality visual readiness without misleading claims'
    }
  },
  'sedra-roshn-visual-report': {
    title: {
      ar: 'سدرة ROSHN: مبيعات بصرية لنمط حياة المجتمع والمراحل ومزيج المنتجات',
      en: 'Sedra ROSHN: community lifestyle visual sales, phasing and product mix'
    }
  }
};

function polishReport(file) {
  const slug = file.replace('.json', '');
  const fp = path.join(ROOT, 'insights/data/reports', file);
  let data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  data = walk(data);

  if (REPORT_TITLE_FIXES[slug]) {
    data.title = { ...data.title...REPORT_TITLE_FIXES[slug].title };
  }

  const meta = REPORT_META[slug];
  if (meta) {
    if (!data.keywords) data.keywords = meta.keywords;
    if (!data.faq || data.faq.length < 3) data.faq = meta.faq;
  }

  // Expand anan-eskan faq to 4 if only 2
  if (slug === 'anan-eskan-restatex-visual-report' && data.faq?.length < 4) {
    data.faq.push({
      q: {
        ar: 'كيف أستخدم التقرير قبل المعرض القادم؟',
        en: 'How do I use this report before the next exhibition?'
      },
      a: {
        ar: 'قائمة قبول للإعلام المعرضي: مجسم، فيلم حلقة، تدريب CEO، ونسخة وسيط معتمدة. راجع [دراسة عنان إسكان](https://3dgraphicshouse.com/insights/projects/anan-eskan-riyadh.html).',
        en: 'Exhibition media acceptance checklist: maquette, loop film, CEO rehearsal, approved broker pack. See [Anan Eskan case study](https://3dgraphicshouse.com/insights/projects/anan-eskan-riyadh-en.html).'
      }
    });
    data.faq.push({
      q: {
        ar: 'ما علاقة التقرير بإسكان القوى العاملة؟',
        en: 'How does the report relate to workforce housing?'
      },
      a: {
        ar: 'الجناح يتحدث لغة B2B: سعة وتشغيل. للسياق النوعي راجع [سكن عمالة B2B في مكة](https://3dgraphicshouse.com/insights/articles/makkah-b2b-workforce-housing-viz.html) كقراءة منفصلة.',
        en: 'The booth speaks B2B: capacity and operations. For type context see [Makkah B2B workforce housing](https://3dgraphicshouse.com/insights/articles/makkah-b2b-workforce-housing-viz-en.html) as a separate reading.'
      }
    });
  }

  if (slug === 'mwl-ramadan-forum-visual-report') {
    if (!data.keywords) {
      data.keywords = {
        ar: {
          short: ['الملتقى الرمضاني', 'رابطة العالم الإسلامي', 'مجسم تفاعلي', 'تسليم'],
          long: [
            'تقرير تسليم معرض رابطة العالم الإسلامي',
            'Graphics House مجسم تفاعلي جدة',
            'ProjectLaunch فعاليات مؤسسية',
            'ميثاق مكة دراسة حالة'
          ]
        },
        en: {
          short: ['Ramadan Forum', 'Muslim World League', 'interactive maquette', 'delivery'],
          long: [
            'MWL exhibition delivery report Graphics House',
            'interactive maquette Jeddah Ramadan Forum',
            'ProjectLaunch institutional events',
            'Makkah Charter case study'
          ]
        }
      };
    }
    if (data.faq?.length < 4) {
      data.faq.push({
        q: {
          ar: 'ما علاقة التقرير بميثاق مكة؟',
          en: 'How does the report relate to Makkah Charter?'
        },
        a: {
          ar: 'نفس النهج في [ميثاق مكة](https://3dgraphicshouse.com/insights/projects/makkah-charter-mwl.html): فكرة وتنفيذ من استوديو واحد.',
          en: 'Same approach in [Makkah Charter](https://3dgraphicshouse.com/insights/projects/makkah-charter-mwl-en.html): idea and build from one studio.'
        }
      });
    }
    // polish faq dashes
    data.faq = walk(data.faq);
  }

  if (slug === 'anan-eskan-restatex-visual-report' && !data.keywords) {
    data.keywords = {
      ar: {
        short: ['عنان إسكان', 'Restatex', 'مقابلة أملاك', 'مجسم معرضي'],
        long: [
          'تقرير بصري عنان إسكان Restatex',
          'حضور معرضي مقابلة CEO Graphics House',
          'ProjectLaunch رندر مجسم الرياض',
          'جاهزية إعلام معرضي B2B'
        ]
      },
      en: {
        short: ['Anan Eskan', 'Restatex', 'Amlak interview', 'exhibition maquette'],
        long: [
          'Anan Eskan Restatex visual report',
          'exhibition CEO interview Graphics House',
          'ProjectLaunch Riyadh render maquette',
          'B2B exhibition media readiness'
        ]
      }
    };
  }

  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('polished report:', file);
}

const reports = fs.readdirSync(path.join(ROOT, 'insights/data/reports')).filter((f) => f.endsWith('.json'));
for (const f of reports) polishReport(f);

console.log('Done.');
