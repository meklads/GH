/**
 * Cloudflare Worker — form proxy + mailing list subscriptions.
 *
 * Secrets:
 *   npx wrangler secret put WEB3FORMS_ACCESS_KEY
 *   npx wrangler secret put BREVO_API_KEY        (optional)
 *   npx wrangler secret put BREVO_LIST_ID        (optional, numeric)
 *   npx wrangler secret put TURNSTILE_SECRET_KEY  (optional, Cloudflare Turnstile secret)
 *
 * KV (optional): create namespace "gh-subscribers" and bind as SUBSCRIBERS
 * Note: Web3Forms free plan does not accept cf-turnstile-response — verify in Worker instead.
 */
const ALLOWED_ORIGINS = [
  'https://3dgraphicshouse.com',
  'https://www.3dgraphicshouse.com',
];

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

async function forwardWeb3Forms(body, key) {
  const payload = { ...body };
  delete payload.access_key;
  /* Web3Forms Turnstile is Pro-only — never forward the token */
  delete payload['cf-turnstile-response'];
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
  return { ok: res.ok, data };
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

  const { ok, data } = await forwardWeb3Forms(w3Body, key);
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

async function handleForm(body, env, cors) {
  const key = env.WEB3FORMS_ACCESS_KEY;
  if (!key) return json({ success: false, message: 'Form proxy not configured' }, 503, cors);

  const { ok, data } = await forwardWeb3Forms(body, key);
  return json(data, ok ? 200 : 502, cors);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
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
      return handleForm(body, env, cors);
    }

    return json({ success: false, message: 'Not found' }, 404, cors);
  },
};
