/**
 * Form endpoint — key lives server-side in Cloudflare Worker (workers/gh-form-proxy.js).
 * Deploy worker + set WEB3FORMS_ACCESS_KEY secret before going live.
 */
window.GH_FORMS = {
  formEndpoint: 'https://3dgraphicshouse.com/api/form',
  subscribeEndpoint: 'https://3dgraphicshouse.com/api/subscribe',
  quoteFormEmail: 'info@3dgraphicshouse.com',
  mailingListName: 'gh-journal',
};
