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

## Route

- `POST https://3dgraphicshouse.com/api/form`
- Allowed origins: `3dgraphicshouse.com`, `www.3dgraphicshouse.com`

## Web3Forms dashboard

- Restrict submissions to domain `3dgraphicshouse.com`
- Rotate key if the old key was ever exposed in client JS

## Client

`assets/gh-forms-config.js` points forms to `/api/form` — no key in the browser.

Until the worker is deployed, form submissions will return 503 from Cloudflare or fail at the edge. Deploy the worker before purging cache on production.
