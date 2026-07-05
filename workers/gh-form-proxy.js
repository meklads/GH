/**
 * Cloudflare Worker — form proxy + mailing list subscriptions.
 *
 * Secrets:
 *   npx wrangler secret put WEB3FORMS_ACCESS_KEY
 *   npx wrangler secret put BREVO_API_KEY        (optional)
 *   npx wrangler secret put BREVO_LIST_ID        (optional, numeric)
 *
 * KV (optional): create namespace "gh-subscribers" and bind as SUBSCRIBERS
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

async function addBrevoContact(env, email, lang) {
  const apiKey = env.BREVO_API_KEY;
  const listId = parseInt(env.BREVO_LIST_ID || '0', 10);
  if (!apiKey || !listId) return;

  await fetch('https://api.brevo.com/v3/contacts', {
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
}

async function handleSubscribe(body, env, cors) {
  const key = env.WEB3FORMS_ACCESS_KEY;
  if (!key) return json({ success: false, message: 'Form proxy not configured' }, 503, cors);

  const email = (body.email || '').trim().toLowerCase();
  if (!validEmail(email)) return json({ success: false, message: 'Invalid email' }, 400, cors);

  const lang = body.language || body.lang || 'en';
  const source = body.source || 'newsletter';
  const now = new Date().toISOString();

  const record = { email, lang, source, subscribedAt: now };

  const w3Body = {
    subject: `Newsletter subscribe — ${email}`,
    from_name: 'Graphics House Mailing List',
    email,
    message: `New subscriber\nEmail: ${email}\nLanguage: ${lang}\nSource: ${source}\nList: gh-journal`,
    botcheck: body.botcheck || '',
    'cf-turnstile-response': body['cf-turnstile-response'] || '',
  };

  const { ok, data } = await forwardWeb3Forms(w3Body, key);
  if (!ok || !data.success) {
    return json(data, 502, cors);
  }

  try {
    await storeSubscriber(env, record);
    await addBrevoContact(env, email, lang);
  } catch (e) {
    console.error('Mailing list storage error', e);
  }

  return json({ success: true, message: 'Subscribed' }, 200, cors);
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
      return handleSubscribe(body, env, cors);
    }

    if (url.pathname === '/api/form') {
      return handleForm(body, env, cors);
    }

    return json({ success: false, message: 'Not found' }, 404, cors);
  },
};
