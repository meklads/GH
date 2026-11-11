/**
 * Graphics House — سجل المتعاونين (Google Apps Script)
 *
 * يستقبل الملفات المؤكدة من workers/gh-form-proxy.js ويضيفها صفاً جديداً
 * في أول ورقة من شيت "سجل المتعاونين".
 *
 * الإعداد (مرة واحدة):
 *  1) افتح الشيت من حساب 3dgraphicshouse@gmail.com
 *     ثم Extensions ← Apps Script، والصق هذا الملف كاملاً.
 *  2) غيّر SECRET أدناه إلى نص عشوائي طويل (مثلاً 40 حرفاً).
 *     نفس القيمة تُوضع في الـ Worker باسم SHEET_WEBHOOK_TOKEN.
 *  3) Deploy ← New deployment ← Web app
 *     Execute as: Me — Who has access: Anyone ← Deploy
 *  4) انسخ رابط /exec وضعه في الـ Worker باسم SHEET_WEBHOOK_URL.
 */

const SECRET = 'REPLACE_WITH_LONG_RANDOM_TOKEN';

const DISCIPLINES = {
  architect: 'معماري',
  interior: 'مصمم ديكور',
  graphic: 'مصمم جرافيك',
  '3d': 'مصمم ثلاثي الأبعاد',
  developer: 'مبرمج',
  'ai-video': 'إنتاج فيديو بالذكاء الاصطناعي',
  editor: 'مونتير',
  'physical-model': 'صانع مجسمات فيزيائية',
  'digital-marketing': 'مدير تسويق إلكتروني',
  'sales-manager': 'مدير مبيعات متخصص',
  other: 'أخرى',
};

const AVAILABILITY = {
  project: 'حسب المشروع',
  freelance: 'عمل حر / جزئي',
  'full-time-interest': 'مفتوح لمناقشة دوام كامل',
};

function doGet() {
  return out({ success: true, message: 'collaborators sheet endpoint is up' });
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.token !== SECRET) {
      return out({ success: false, message: 'unauthorized' });
    }
    const r = data.row || {};
    const parts = String(r.name || '').trim().split(/\s+/);
    const first = parts.shift() || '';
    const last = parts.join(' ');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HH:mm'), // التاريخ
      first,                                                              // الاسم الأول
      last,                                                               // اسم العائلة
      r.email || '',                                                      // البريد
      'مؤكد',                                                             // تأكيد البريد
      r.phone || '',                                                      // الهاتف
      r.city || '',                                                       // المدينة
      r.country || '',                                                    // الدولة
      DISCIPLINES[r.discipline] || r.discipline || '',                    // التخصص
      r.years_experience || '',                                           // سنوات الخبرة
      AVAILABILITY[r.availability] || r.availability || '',               // التوفّر
      r.portfolio_url || '',                                              // رابط المعرض
      r.cv_url || '',                                                     // رابط السيرة
      r.linkedin_url || '',                                               // LinkedIn
      r.note || '',                                                       // ملاحظة
      r.lang || '',                                                       // اللغة
      'جديد',                                                             // الحالة
      '',                                                                 // ملاحظات داخلية
    ]);
    try {
      sendThanks(r);
    } catch (mailErr) {
      Logger.log('thanks mail failed: ' + mailErr);
    }
    return out({ success: true });
  } catch (err) {
    return out({ success: false, message: String(err) });
  }
}

/** رسالة الشكر للمتعاون من Gmail الخاص بالشركة */
function sendThanks(r) {
  if (!r.email) return;
  const first = String(r.name || '').trim().split(/\s+/)[0] || '';
  const ar = (r.lang || 'ar') !== 'en';
  const subject = ar ? 'شكراً لتقديم طلبك — جرافيكس هاوس' : 'Thank you — Graphics House';
  const body = ar
    ? 'مرحباً ' + first + '،\n\nشكراً لاهتمامك بالانضمام إلى سجل متعاوني جرافيكس هاوس. تم استلام ملفك بنجاح، وسنراجعه ونتواصل معك عند وجود احتياج مناسب.\n\nمع خالص التقدير،\nفريق Graphics House — مجموعة تسامي'
    : 'Hello ' + first + ',\n\nThank you for joining the Graphics House collaborator roster. Your profile has been received; we will review it and contact you when a suitable opportunity arises.\n\nWith appreciation,\nGraphics House — Tasami Group';
  MailApp.sendEmail({ to: r.email, subject: subject, body: body, name: 'Graphics House' });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
