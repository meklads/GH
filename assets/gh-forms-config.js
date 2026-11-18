/**
 * Form endpoint — key lives server-side in Cloudflare Worker (workers/gh-form-proxy.js).
 * Deploy worker + set WEB3FORMS_ACCESS_KEY secret before going live.
 * All submissions are CC'd to imeklad@gmail.com by the Worker.
 */
window.GH_FORMS = {
  formEndpoint: 'https://3dgraphicshouse.com/api/form',
  subscribeEndpoint: 'https://3dgraphicshouse.com/api/subscribe',
  chatEndpoint: 'https://3dgraphicshouse.com/api/chat',
  turnstileSiteKey: '0x4AAAAAADv7uKaQhHuTHq7h',
  /* Web3Forms public form key (safe in client code per Web3Forms). Used by lp/lp-v2.js only
     as a fallback when the Worker fails. Owner pastes it here; recipient: sales@3dgraphicshouse.com */
  web3formsKey: '',
  quoteFormEmail: 'imeklad@gmail.com',
  notifyEmail: 'imeklad@gmail.com',
  notifyWhatsApp: '966502786513',
  mailingListName: 'gh-journal',
};

window.GH_QUOTE_FORM = window.GH_QUOTE_FORM || {};
if (!window.GH_QUOTE_FORM.turnstileSiteKey) {
  window.GH_QUOTE_FORM.turnstileSiteKey = '0x4AAAAAADv7uKaQhHuTHq7h';
}
