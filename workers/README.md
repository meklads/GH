# Cloudflare Form Proxy

Hides the Web3Forms API key from the public site.

## One-time setup

```bash
cd workers
npm i -g wrangler   # or: npx wrangler
wrangler login
wrangler secret put WEB3FORMS_ACCESS_KEY   # paste key from Web3Forms dashboard
wrangler deploy
```

## Routes

- `POST https://3dgraphicshouse.com/api/form` — lead forms
- `POST https://3dgraphicshouse.com/api/subscribe` — newsletter
- `POST https://3dgraphicshouse.com/api/chat` — site assistant (knowledge base + optional OpenRouter)

Allowed origins: `3dgraphicshouse.com`, `www.3dgraphicshouse.com`

## Optional secrets (chat AI)

```bash
wrangler secret put OPENROUTER_API_KEY   # enables DeepSeek replies for free-text questions
# wrangler secret put OPENROUTER_CHAT_MODEL  # default: deepseek/deepseek-chat
```

Without `OPENROUTER_API_KEY`, `/api/chat` uses the built-in knowledge base only (no extra cost).

## Client

`assets/gh-forms-config.js` points forms to `/api/form` and chat to `/api/chat` — no keys in the browser.

The chat UI (`assets/gh-chat-assistant.js`) falls back to local keyword replies if the Worker is unreachable.

Until the worker is deployed, form submissions will return 503 from Cloudflare or fail at the edge. Deploy the worker before purging cache on production.
