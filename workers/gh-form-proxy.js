import { handleChatMessage, getSystemContext } from './gh-chat-knowledge.js';

/**
 * Cloudflare Worker — form proxy + mailing list subscriptions.
 *
 * Secrets:
 *   npx wrangler secret put WEB3FORMS_ACCESS_KEY
 *   npx wrangler secret put BREVO_API_KEY        (optional)
 *   npx wrangler secret put BREVO_LIST_ID        (optional, numeric)
 *   npx wrangler secret put TURNSTILE_SECRET_KEY  (optional, Cloudflare Turnstile secret)
 *   npx wrangler secret put CALLMEBOT_APIKEY       (optional, WhatsApp lead alerts)
 *
 * Form notifications always CC: imeklad@gmail.com
 * WhatsApp contact: +966502786513 (float widgets + optional CallMeBot alerts)
 * KV (optional): create namespace "gh-subscribers" and bind as SUBSCRIBERS
 * Note: Web3Forms free plan does not accept cf-turnstile-response — verify in Worker instead.
 */
const ALLOWED_ORIGINS = [
  'https://3dgraphicshouse.com',
  'https://www.3dgraphicshouse.com',
];

/** All form notifications also go here (Web3Forms CC). */
const NOTIFY_EMAIL = 'imeklad@gmail.com';
const NOTIFY_WHATSAPP = '966502786513';
const NOTIFY_WHATSAPP_DISPLAY = '+966 50 278 6513';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.fr',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me',
  'mail.com', 'gmx.com', 'gmx.net', 'yandex.com', 'yandex.ru', 'zoho.com',
  'mail.ru', 'inbox.com', 'fastmail.com', 'tutanota.com', 'hey.com',
  'qq.com', '163.com', '126.com', 'rediffmail.com',
  'outlook.sa', 'hotmail.sa', 'live.sa',
]);

function isCompanyEmail(email) {
  const m = String(email || '').trim().toLowerCase().match(/^[^@\s]+@([^@\s]+\.[^@\s]+)$/);
  if (!m) return false;
  const domain = m[1];
  if (FREE_EMAIL_DOMAINS.has(domain)) return false;
  const parts = domain.split('.');
  if (parts.length >= 3) {
    const base = parts.slice(-2).join('.');
    if (FREE_EMAIL_DOMAINS.has(base)) return false;
  }
  return true;
}

async function forwardWeb3Forms(body, key, env) {
  const payload = { ...body };
  delete payload.access_key;
  /* Web3Forms Turnstile is Pro-only — never forward the token */
  delete payload['cf-turnstile-response'];
  /* Always CC owner inbox so every site form reaches imeklad@gmail.com */
  payload.ccemail = NOTIFY_EMAIL;
  const notice = `\nNotify: ${NOTIFY_EMAIL}\nWhatsApp: ${NOTIFY_WHATSAPP_DISPLAY} (wa.me/${NOTIFY_WHATSAPP})`;
  if (payload.message) {
    if (!String(payload.message).includes(NOTIFY_EMAIL)) {
      payload.message = String(payload.message) + notice;
    }
  } else {
    payload.message = notice.trim();
  }
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...payload, access_key: key }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { success: res.ok, message: text };
  }
  if (res.ok && data?.success) {
    notifyWhatsAppLead(env, payload).catch(() => {});
  }
  return { ok: res.ok, data };
}

/** Optional lead ping to WhatsApp via CallMeBot (secret CALLMEBOT_APIKEY). */
async function notifyWhatsAppLead(env, payload) {
  const apiKey = env?.CALLMEBOT_APIKEY;
  if (!apiKey) return false;
  const phone = env.NOTIFY_WHATSAPP || NOTIFY_WHATSAPP;
  const lines = [
    'GH lead',
    payload.subject && `Subject: ${payload.subject}`,
    payload.name && `Name: ${payload.name}`,
    payload.phone && `Phone: ${payload.phone}`,
    payload.email && `Email: ${payload.email}`,
    payload.city && `City: ${payload.city}`,
    payload.source && `Source: ${payload.source}`,
  ].filter(Boolean);
  const text = lines.join('\n').slice(0, 900);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  return res.ok;
}

async function storeSubscriber(env, record) {
  if (!env.SUBSCRIBERS) return;
  const key = `sub:${record.email.toLowerCase()}`;
  await env.SUBSCRIBERS.put(key, JSON.stringify(record));
}

async function verifyTurnstile(token, secret, ip) {
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (ip) form.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  return data.success === true;
}

async function addBrevoContact(env, email, lang) {
  const apiKey = env.BREVO_API_KEY;
  const listId = parseInt(env.BREVO_LIST_ID || '0', 10);
  if (!apiKey || !listId) return false;

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: email.toLowerCase(),
      listIds: [listId],
      updateEnabled: true,
      attributes: { LANGUAGE: lang || 'en', SOURCE: 'gh-website' },
    }),
  });

  if (res.ok || res.status === 204) return true;

  const detail = await res.text();
  console.error('Brevo contact error', res.status, detail);
  return false;
}

async function handleSubscribe(body, env, cors, request) {
  const key = env.WEB3FORMS_ACCESS_KEY;
  if (!key) return json({ success: false, message: 'Form proxy not configured' }, 503, cors);

  const email = (body.email || '').trim().toLowerCase();
  if (!validEmail(email)) return json({ success: false, message: 'Invalid email' }, 400, cors);

  const turnstileToken = body['cf-turnstile-response'] || '';
  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP') || ''
  );
  if (env.TURNSTILE_SECRET_KEY && !turnstileOk) {
    return json({ success: false, message: 'Captcha verification failed' }, 403, cors);
  }

  const lang = body.language || body.lang || 'en';
  const source = body.source || 'newsletter';
  const now = new Date().toISOString();

  const record = { email, lang, source, subscribedAt: now };

  let brevoOk = false;
  try {
    await storeSubscriber(env, record);
    brevoOk = await addBrevoContact(env, email, lang);
  } catch (e) {
    console.error('Mailing list storage error', e);
  }

  const w3Body = {
    subject: `Newsletter subscribe — ${email}`,
    from_name: 'Graphics House Mailing List',
    email,
    message: `New subscriber\nEmail: ${email}\nLanguage: ${lang}\nSource: ${source}\nList: gh-journal`,
    botcheck: body.botcheck || '',
  };

  const { ok, data } = await forwardWeb3Forms(w3Body, key, env);
  const notifyOk = ok && data.success;

  const brevoConfigured = !!(env.BREVO_API_KEY && parseInt(env.BREVO_LIST_ID || '0', 10));
  if (brevoConfigured) {
    if (brevoOk) {
      return json({ success: true, message: 'Subscribed' }, 200, cors);
    }
    return json(
      {
        success: false,
        message: notifyOk
          ? 'Notification sent but mailing list sync failed. Please try again.'
          : 'Mailing list sync failed. Please try again.',
      },
      502,
      cors
    );
  }

  if (notifyOk) {
    return json({ success: true, message: 'Subscribed' }, 200, cors);
  }

  return json(
    { success: false, message: data.message || 'Subscription failed' },
    502,
    cors
  );
}

function b64urlEncode(bytes) {
  let bin = '';
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSign(secret, payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return b64urlEncode(sig);
}

async function hmacVerify(secret, payload, signature) {
  const expected = await hmacSign(secret, payload);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

function isCollaboratorBody(body) {
  return (
    body?.form_type === 'collaborator' ||
    body?.source === 'collaborator' ||
    /Collaborator profile|ملف متعاون/i.test(String(body?.subject || ''))
  );
}

async function sendBrevoTransactional(env, { to, subject, html, text }) {
  if (!env.BREVO_API_KEY) return false;
  const senderEmail = env.BREVO_SENDER_EMAIL || 'info@3dgraphicshouse.com';
  const senderName = env.BREVO_SENDER_NAME || 'Graphics House';
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });
  if (!res.ok) {
    console.error('Brevo transactional error', res.status, await res.text());
    return false;
  }
  return true;
}

function collaboratorConfirmEmail(lang, name, confirmUrl) {
  const isAr = lang === 'ar';
  if (isAr) {
    return {
      subject: 'تأكيد بريدك — سجل متعاوني جرافيكس هاوس',
      text: `مرحباً ${name},\n\nشكراً لاهتمامك بالانضمام إلى سجل متعاوني جرافيكس هاوس.\nلتأكيد بريدك وإكمال الطلب، افتح الرابط التالي خلال 24 ساعة:\n${confirmUrl}\n\nإذا لم تُرسل أنت هذا الطلب، تجاهل الرسالة.\n\nجرافيكس هاوس — مجموعة تسامي`,
      html: `<p>مرحباً <strong>${name}</strong>،</p><p>شكراً لاهتمامك بالانضمام إلى سجل متعاوني جرافيكس هاوس.</p><p>لتأكيد بريدك وإكمال الطلب، اضغط الرابط التالي خلال <strong>24 ساعة</strong>:</p><p><a href="${confirmUrl}" style="display:inline-block;padding:12px 22px;background:#C9A84C;color:#0a0a0a;text-decoration:none;border-radius:999px;font-weight:700">تأكيد البريد وإرسال الملف</a></p><p style="color:#666;font-size:13px">أو انسخ الرابط:<br>${confirmUrl}</p><p style="color:#888;font-size:12px">إذا لم تُرسل أنت هذا الطلب، تجاهل الرسالة.</p><p>جرافيكس هاوس — مجموعة تسامي</p>`,
    };
  }
  return {
    subject: 'Confirm your email — Graphics House Collaborators',
    text: `Hello ${name},\n\nThank you for your interest in the Graphics House collaborator roster.\nTo confirm your email and complete your submission, open this link within 24 hours:\n${confirmUrl}\n\nIf you did not submit this form, ignore this message.\n\nGraphics House — Tasami Group`,
    html: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for your interest in the Graphics House collaborator roster.</p><p>To confirm your email and complete your submission, open this link within <strong>24 hours</strong>:</p><p><a href="${confirmUrl}" style="display:inline-block;padding:12px 22px;background:#C9A84C;color:#0a0a0a;text-decoration:none;border-radius:999px;font-weight:700">Confirm email &amp; send profile</a></p><p style="color:#666;font-size:13px">Or copy the link:<br>${confirmUrl}</p><p style="color:#888;font-size:12px">If you did not submit this form, ignore this message.</p><p>Graphics House — Tasami Group</p>`,
  };
}

function collaboratorThanksEmail(lang, name) {
  const isAr = lang === 'ar';
  if (isAr) {
    return {
      subject: 'شكراً لك — استلمنا ملفك',
      text: `مرحباً ${name},\n\nشكراً لثقتك وتقديرنا لك.\nتم تأكيد بريدك واستلام ملفك بنجاح. سنراجعه ونتواصل معك في أقرب فرصة.\n\nمع التقدير،\nفريق جرافيكس هاوس — مجموعة تسامي`,
      html: `<p>مرحباً <strong>${name}</strong>،</p><p>شكراً لثقتك وتقديرنا لك.</p><p>تم تأكيد بريدك واستلام ملفك بنجاح. سنراجعه ونتواصل معك في أقرب فرصة.</p><p>مع التقدير،<br>فريق جرافيكس هاوس — مجموعة تسامي</p>`,
    };
  }
  return {
    subject: 'Thank you — we received your profile',
    text: `Hello ${name},\n\nThank you for your trust and interest in Graphics House.\nYour email is confirmed and your profile has been received. We will review it and contact you at the earliest opportunity.\n\nWith appreciation,\nGraphics House — Tasami Group`,
    html: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for your trust and interest in Graphics House.</p><p>Your email is confirmed and your profile has been received. We will review it and contact you at the earliest opportunity.</p><p>With appreciation,<br>Graphics House — Tasami Group</p>`,
  };
}

async function createCollaboratorToken(env, payload) {
  const secret = env.COLLAB_HMAC_SECRET || env.WEB3FORMS_ACCESS_KEY || '';
  if (!secret) throw new Error('No signing secret');
  const body = {
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  const jsonStr = JSON.stringify(body);
  const dataPart = b64urlEncode(new TextEncoder().encode(jsonStr));
  const sig = await hmacSign(secret, dataPart);
  return `${dataPart}.${sig}`;
}

async function readCollaboratorToken(env, token) {
  const secret = env.COLLAB_HMAC_SECRET || env.WEB3FORMS_ACCESS_KEY || '';
  if (!secret || !token || !token.includes('.')) return null;
  const [dataPart, sig] = token.split('.');
  if (!(await hmacVerify(secret, dataPart, sig))) return null;
  try {
    const jsonStr = new TextDecoder().decode(b64urlDecode(dataPart));
    const payload = JSON.parse(jsonStr);
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

async function finalizeCollaborator(payload, env, cors) {
  const key = env.WEB3FORMS_ACCESS_KEY;
  if (!key) return json({ success: false, message: 'Form proxy not configured' }, 503, cors);

  const lang = payload.lang === 'ar' ? 'ar' : 'en';
  const name = payload.name || 'Collaborator';
  const email = payload.email;

  const w3Body = {
    subject: payload.subject || 'Collaborator profile — Graphics House (verified)',
    from_name: 'Graphics House Collaborators',
    name,
    email,
    phone: payload.phone || undefined,
    city: payload.city,
    source: 'collaborator',
    form_type: 'collaborator',
    discipline: payload.discipline,
    portfolio_url: payload.portfolio_url,
    cv_url: payload.cv_url,
    message: (payload.message || '') + '\nEmail verified: yes',
    ccemail: NOTIFY_EMAIL,
    botcheck: '',
  };

  const { ok, data } = await forwardWeb3Forms(w3Body, key, env);
  if (!ok || !data?.success) {
    return json(data || { success: false, message: 'Submit failed' }, 502, cors);
  }

  const thanks = collaboratorThanksEmail(lang, name);
  await sendBrevoTransactional(env, {
    to: email,
    subject: thanks.subject,
    html: thanks.html,
    text: thanks.text,
  });

  return json(
    {
      success: true,
      verified: true,
      message:
        lang === 'ar'
          ? 'تم تأكيد بريدك واستلام ملفك. شكراً لك — سنتواصل عند الحاجة.'
          : 'Email confirmed and profile received. Thank you — we will be in touch when needed.',
    },
    200,
    cors
  );
}

async function handleCollaboratorRequest(body, env, cors, request) {
  const key = env.WEB3FORMS_ACCESS_KEY;
  if (!key) return json({ success: false, message: 'Form proxy not configured' }, 503, cors);

  const turnstileToken = body['cf-turnstile-response'] || '';
  if (env.TURNSTILE_SECRET_KEY) {
    const turnstileOk = await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request?.headers?.get('CF-Connecting-IP') || ''
    );
    if (!turnstileOk) {
      return json({ success: false, message: 'Captcha verification failed' }, 403, cors);
    }
  }

  const email = String(body.email || '').trim().toLowerCase();
  const emailConfirm = String(body.email_confirm || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  const lang = body.lang === 'ar' ? 'ar' : 'en';

  if (!validEmail(email) || !name) {
    return json(
      {
        success: false,
        message: lang === 'ar' ? 'يرجى إدخال الاسم والبريد بشكل صحيح.' : 'Please enter a valid name and email.',
      },
      400,
      cors
    );
  }
  if (email !== emailConfirm) {
    return json(
      {
        success: false,
        message:
          lang === 'ar'
            ? 'البريد وتأكيد البريد غير متطابقين.'
            : 'Email and confirmation email do not match.',
      },
      400,
      cors
    );
  }

  const origin = 'https://3dgraphicshouse.com';
  const payload = {
    name,
    email,
    phone: String(body.phone || '').trim(),
    city: String(body.city || '').trim(),
    discipline: String(body.discipline || '').trim(),
    portfolio_url: String(body.portfolio_url || '').trim(),
    cv_url: String(body.cv_url || '').trim(),
    message: String(body.message || '').trim(),
    subject: String(body.subject || '').trim(),
    lang,
  };

  let token;
  try {
    token = await createCollaboratorToken(env, payload);
  } catch (e) {
    console.error('token error', e);
    return json({ success: false, message: 'Could not start verification.' }, 500, cors);
  }

  const confirmUrl = `${origin}/api/collaborator/confirm?token=${encodeURIComponent(token)}`;
  const mail = collaboratorConfirmEmail(lang, name, confirmUrl);
  const sent = await sendBrevoTransactional(env, {
    to: email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  if (sent) {
    return json(
      {
        success: true,
        pending: true,
        message:
          lang === 'ar'
            ? 'أرسلنا رابط تأكيد إلى بريدك. افتحه خلال 24 ساعة لإكمال الطلب.'
            : 'We sent a confirmation link to your email. Open it within 24 hours to complete your submission.',
      },
      200,
      cors
    );
  }

  /* Fallback when transactional email is unavailable: accept after match + notify admin, thank on page */
  const finalize = await finalizeCollaborator(
    { ...payload, subject: (payload.subject || 'Collaborator profile') + ' (email-matched)' },
    env,
    cors
  );
  return finalize;
}

async function handleCollaboratorConfirm(token, env, cors) {
  const payload = await readCollaboratorToken(env, token);
  if (!payload) {
    return json(
      { success: false, message: 'Invalid or expired confirmation link.' },
      400,
      cors
    );
  }
  return finalizeCollaborator(payload, env, cors);
}

async function handleForm(body, env, cors, request) {
  const key = env.WEB3FORMS_ACCESS_KEY;
  if (!key) return json({ success: false, message: 'Form proxy not configured' }, 503, cors);

  /* Collaborator roster: email confirm first */
  if (isCollaboratorBody(body) && body.action !== 'collaborator_finalize') {
    return handleCollaboratorRequest(body, env, cors, request);
  }

  const turnstileToken = body['cf-turnstile-response'] || '';
  if (env.TURNSTILE_SECRET_KEY) {
    const turnstileOk = await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request?.headers?.get('CF-Connecting-IP') || ''
    );
    if (!turnstileOk) {
      return json({ success: false, message: 'Captcha verification failed' }, 403, cors);
    }
  }

  const allowPersonalEmail =
    body?.source === 'ads' ||
    body?.source === 'float' ||
    body?.source === 'partner' ||
    body?.source === 'collaborator' ||
    /Ads/i.test(String(body?.subject || ''));

  const isCollaborator = body?.source === 'collaborator' || body?.form_type === 'collaborator';

  /* Lead forms that include email: prefer company domain, except ads/float/partner/collaborator */
  if (body && typeof body.email === 'string' && body.email.trim()) {
    const email = body.email.trim();
    if (!validEmail(email)) {
      return json({ success: false, message: 'Invalid email address.' }, 400, cors);
    }
    if (!allowPersonalEmail && !isCompanyEmail(email)) {
      return json(
        {
          success: false,
          message:
            'يرجى استخدام بريد الشركة (وليس Gmail أو Hotmail أو ما شابه)، مع الاسم الكامل ورقم الجوال.',
        },
        400,
        cors
      );
    }
  }
  if (body && (body.name !== undefined || body.phone !== undefined)) {
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').replace(/\D/g, '');
    if (isCollaborator) {
      if (!name) {
        return json(
          {
            success: false,
            message: 'Please enter your full name.',
          },
          400,
          cors
        );
      }
      if (phone && phone.length < 8) {
        return json(
          {
            success: false,
            message: 'Please enter a valid phone number, or leave it blank.',
          },
          400,
          cors
        );
      }
    } else if (!name || phone.length < 8) {
      return json(
        {
          success: false,
          message: 'يرجى إدخال الاسم الكامل ورقم الجوال وبريد الشركة.',
        },
        400,
        cors
      );
    }
  }

  /* Ensure Web3Forms gets a readable message body */
  if (body && !body.message) {
    const lines = [
      body.company && `Company: ${body.company}`,
      body.project_type && `Project type: ${body.project_type}`,
      body.city && `City: ${body.city}`,
      body.phone && `Phone: ${body.phone}`,
      body.email && `Email: ${body.email}`,
      body.brief && `Brief: ${body.brief}`,
      body.page && `Page: ${body.page}`,
      body.source && `Source: ${body.source}`,
    ].filter(Boolean);
    if (lines.length) body.message = lines.join('\n');
  }

  if (isCollaboratorBody(body)) {
    body.source = 'collaborator';
  }

  const { ok, data } = await forwardWeb3Forms(body, key, env);
  return json(data, ok ? 200 : 502, cors);
}

async function handleChat(body, env, cors) {
  const result = handleChatMessage(body || {});

  const skipAi = !body.message || body.message === '__init__' || result.intent === 'human' || result.intent === 'whatsapp';

  if (env.OPENROUTER_API_KEY && !skipAi) {
    try {
      const aiReply = await callOpenRouterChat(body, env);
      if (aiReply) {
        return json(
          {
            success: true,
            reply: aiReply,
            intent: result.intent,
            quickReplies: result.quickReplies,
            source: 'ai',
          },
          200,
          cors
        );
      }
    } catch (e) {
      console.error('OpenRouter chat error', e);
    }
  }

  if (!result.success) {
    return json(result, 400, cors);
  }
  return json(result, 200, cors);
}

async function callOpenRouterChat(body, env) {
  const lang = body.lang === 'ar' ? 'ar' : 'en';
  const system = getSystemContext(lang);

  const messages = [{ role: 'system', content: system }];
  (body.history || []).slice(-4).forEach((m) => {
    messages.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.text || '').replace(/<[^>]+>/g, ' '),
    });
  });
  messages.push({ role: 'user', content: String(body.message) });

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://3dgraphicshouse.com',
      'X-Title': 'Graphics House Assistant',
    },
    body: JSON.stringify({
      model: env.OPENROUTER_CHAT_MODEL || 'deepseek/deepseek-chat',
      messages,
      max_tokens: 280,
      temperature: 0.4,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? String(text).trim() : null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    /* Collaborator email confirmation (magic link) */
    if (
      request.method === 'GET' &&
      (url.pathname === '/api/collaborator/confirm' || url.pathname === '/api/form/collaborator-confirm')
    ) {
      const token = url.searchParams.get('token') || '';
      const peek = await readCollaboratorToken(env, token);
      const lang = peek?.lang === 'ar' ? 'ar' : 'en';
      const result = await handleCollaboratorConfirm(token, env, cors);
      const data = await result.clone().json().catch(() => ({}));
      const dest =
        lang === 'ar'
          ? `https://3dgraphicshouse.com/collaborators.html?verified=${data.success ? '1' : '0'}`
          : `https://3dgraphicshouse.com/collaborators-en.html?verified=${data.success ? '1' : '0'}`;
      const accept = request.headers.get('Accept') || '';
      if (accept.includes('application/json')) {
        return result;
      }
      return Response.redirect(dest, 302);
    }

    if (request.method !== 'POST') {
      return json({ success: false, message: 'Method not allowed' }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ success: false, message: 'Invalid JSON' }, 400, cors);
    }

    if (body.botcheck) {
      return json({ success: true, message: 'OK' }, 200, cors);
    }

    if (url.pathname === '/api/subscribe') {
      return handleSubscribe(body, env, cors, request);
    }

    if (url.pathname === '/api/form') {
      return handleForm(body, env, cors, request);
    }

    if (url.pathname === '/api/collaborator/confirm' && body.token) {
      return handleCollaboratorConfirm(body.token, env, cors);
    }

    if (url.pathname === '/api/chat') {
      return handleChat(body, env, cors);
    }

    return json({ success: false, message: 'Not found' }, 404, cors);
  },
};
