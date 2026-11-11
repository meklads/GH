#!/usr/bin/env node
/**
 * Legacy helper, quote forms now use Worker /api/form via quote-form.js v4.
 * Prefer: node scripts/migrate-quote-forms-to-api.mjs
 */
console.log('patch-quote-forms.mjs is deprecated. Use migrate-quote-forms-to-api.mjs + quote-form.js?v=4.');
process.exit(0);
