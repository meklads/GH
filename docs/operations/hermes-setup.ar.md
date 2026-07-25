# إعداد Hermes + OpenRouter — Graphics House

دليل خطوة بخطوة. Hermes هنا = **[Hermes Agent](https://hermes-agent.ai)** (Nous Research) متصل بـ OpenRouter. إن كنت تستخدم **Hermify** (استضافة)، نفس المنطق — المفتاح و الـ system prompt من لوحة Hermify.

---

## 1) OpenRouter (قبل Hermes)

1. حساب على [openrouter.ai](https://openrouter.ai).
2. **Settings → API Keys** → أنشئ مفتاحاً (`sk-or-...`) — **لا تشاركه ولا ترفعه على GitHub**.
3. **Credits:** ابدأ بـ **15–20 USD** (ضمن ميزانيتك 40–50 مع Cursor).
4. **Settings → Limits:** حدّ شهري **~25 USD** + تنبيه عند 80%.
5. احفظ المفتاح في مدير كلمات مرور.

---

## 2) تثبيت Hermes (على Mac)

```bash
# راجع التثبيت الرسمي إن تغيّر الأمر:
# https://hermes-agent.ai أو https://openrouter.ai/docs/cookbook/coding-agents/hermes-integration

hermes model
```

الأمر التفاعلي `hermes model` يختار Provider **OpenRouter** ويدخل المفتاح.

**يدوياً:**

```bash
mkdir -p ~/.hermes
```

**`~/.hermes/.env`** (صلاحيات خاصة — `chmod 600`):

```env
OPENROUTER_API_KEY=sk-or-ضع-مفتاحك-هنا
```

**`~/.hermes/config.yaml`** — انسخ من [`hermes-config.example.yaml`](hermes-config.example.yaml) في هذا المستودع وعدّل.

---

## 3) اختيار النموذج الافتراضي (مهم للتكلفة)

Hermes يستخدم **نموذجاً افتراضياً واحداً** في الجلسة. استراتيجية GH:

| الاستخدام | نموذج OpenRouter (slug) | متى |
|-----------|-------------------------|-----|
| **يومي — Hermes منسّق** | `deepseek/deepseek-v4-flash` | افتراضي 90% من المحادثات |
| **هيكل أقوى / reasoning** | `deepseek/deepseek-v4-pro` أو `deepseek/deepseek-chat` | `hermes model` مؤقتاً |
| **copy نهائي AR/EN** | `anthropic/claude-sonnet-4` أو `~anthropic/claude-sonnet-latest` | قبل LP/إعلان مهم |
| **ملف ضخم** | `moonshotai/kimi-k2` (تحقق من [openrouter.ai/models](https://openrouter.ai/models)) | RFP / PDF طويل |

> **تحقق دائماً** من slug الحالي على OpenRouter — الأسماء تتغير.

**تبديل النموذج:**

```bash
hermes model
# أو
hermes chat --provider openrouter --model 'deepseek/deepseek-v4-flash'
```

**لا تستخدم** `openrouter/auto` كافتراضي إن كان يختار Claude دائماً ويحرق الميزانية.

---

## 4) System prompt (قلب النظام)

1. افتح [`hermes-system-prompt.ar.md`](hermes-system-prompt.ar.md) في هذا الريpo.
2. انسخ من السطر «أنت **Hermes**» حتى نهاية الملف (بدون العناوين `#`).
3. ضعه في Hermes:
   - **محلي:** حسب وثائق Hermes — غالباً `~/.hermes/config.yaml` تحت `system_prompt` أو ملف `~/.hermes/SOUL.md` / `AGENTS.md` — راجع `hermes config` أو [OpenRouter cookbook](https://openrouter.ai/docs/cookbook/coding-agents/hermes-integration).
   - **Hermify:** Onboarding → System instructions.

4. أضف سطراً في ذاكرة Hermes (إن وُجدت):

   ```text
   مرجع الأقسام: GitHub meklads/GH → docs/operations/
   ```

---

## 5) ضبط سلوك «الأقسام الخمسة»

Hermes **لا يشغّل 5 bots** — يتصرف كمنسّق واحد ويذكر **Lead department** في كل رد (انظر system prompt).

| أنت تقول | Hermes يعلن |
|----------|-------------|
| لخص / منافسون | Research |
| LP / SEO / سوشيال | Marketing |
| نفّذ على الموقع | Software → **تذكرة Cursor** |
| script فيdeo / deck | Creative |
| WhatsApp / CRM | Automation |

---

## 6) ربط Cursor (Software)

Hermes **لا يفتح Cursor تلقائياً** (إلا إن ربطت Telegram + مهام لاحقاً).

**العادة:**

1. Hermes يخرج блок **«تذكرة Cursor»**.
2. تفتح مشروع `beestoon-live` في Cursor.
3. تلصق: «نفّذ تذكرة Hermes التالية: …»

قسم Software في Cursor يقرأ: `.cursor/rules/gh-software-department.mdc`

---

## 7) اختبار الإعداد (5 دقائق)

| # | أرسل لـ Hermes | النتيجة المتوقعة |
|---|----------------|------------------|
| 1 | «ما القسم المسؤول عن LP؟» | Marketing، بدون ذكر Claude |
| 2 | «هيكل LP مجسمات الرياض — مسودة فقط» | outline، Flash كافٍ |
| 3 | «النسخة النهائية للهيكل السابق» | يطلب تبديل لـ Claude **أو** ينتج copy — إن الجودة ضعيفة شغّل `hermes model` → Claude وأعد (3) |
| 4 | «جهّز تذكرة Cursor لصفحة تجريبية» | блок spec بدون HTML طويل |

---

## 8) قوالب أوامر سريعة (احفظها في Hermes / Notes)

```text
/departments — اذكر Lead + Helpers فقط
/cursor — أخرج تذكرة Cursor كاملة
/final — اعتبر المخرجات للنشر (استخدم أعلى جودة نص)
/draft — مسودة اقتصادية
```

*(إن Hermes لا يدعم slash commands، اكتب نفس المعنى بالعربي.)*

---

## 9) أخطاء شائعة

| المشكلة | الحل |
|---------|------|
| 401 OpenRouter | تحقق `~/.hermes/.env` و `hermes config set OPENROUTER_API_KEY` |
| Hermes بطيء/غالي | ارجع الافتراضي إلى `deepseek-v4-flash` |
| copy عربي ضعيف | جلسة قصيرة بـ Claude ثم عُد Flash |
| Hermes يكتب HTML pages | ذكّر في system prompt: **تذكرة Cursor فقط** |

---

## 10) Checklist — «جاهز للعمل»

- [ ] OpenRouter: مفتاح + حد ~25 USD  
- [ ] `~/.hermes/.env` فيه `OPENROUTER_API_KEY`  
- [ ] `config.yaml`: provider `openrouter`, default `deepseek/deepseek-v4-flash`  
- [ ] System prompt من `hermes-system-prompt.ar.md`  
- [ ] اختبار 1–4 ناجح  
- [ ] Cursor مفتوح على `beestoon-live` عند التنفيذ  

---

**الخطوة التالية:** أول مهمة حقيقية — «LP مجسمات السعودية — copy ثم تذكرة Cursor».
