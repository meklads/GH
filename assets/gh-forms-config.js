/**
 * Form endpoint — key lives server-side in Cloudflare Worker (workers/gh-form-proxy.js).
 * Deploy worker + set WEB3FORMS_ACCESS_KEY secret before going live.
 * All submissions are CC'd to imeklad@gmail.com by the Worker.
 */
window.GH_FORMS = {
  formEndpoint: 'https://3dgraphicshouse.com/api/form',
  subscribeEndpoint: 'https://3dgraphicshouse.com/api/subscribe',
  chatEndpoint: 'https://3dgraphicshouse.com/api/chat',
  quoteFormEmail: 'imeklad@gmail.com',
  notifyEmail: 'imeklad@gmail.com',
  notifyWhatsApp: '966502786513',
  mailingListName: 'gh-journal',
};
