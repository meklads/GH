/**
 * Shared guards so site-header.css owns the chrome on every page.
 */
export const SITE_HEADER_CSS_VER = 45;
export const SITE_ENHANCEMENTS_CSS_VER = 32;

export function stripConflictingHeaderStyles(html) {
  let out = html;

  // Global radius nuke breaks CTA / lang pills — scope away from header chrome
  out = out.replace(
    /\*\s*,\s*\*::before\s*,\s*\*::after\s*\{\s*border-radius\s*:\s*0\s*!important\s*;?\s*\}/gi,
    'main *, main *::before, main *::after, .gh-footer *, .gh-footer *::before, .gh-footer *::after, footer *:not(.header):not(.header *), footer *:not(.header):not(.header *)::before, footer *:not(.header):not(.header *)::after { border-radius: 0 !important; }'
  );

  // Entire legacy "STANDARD HEADER" blocks (desktop + wrong mobile drawer)
  out = out.replace(
    /\/\*\s*=+\s*STANDARD HEADER\s*=+\s*\*\/[\s\S]*?(?=\/\*\s*=+|\n<\/style>)/gi,
    '/* legacy STANDARD HEADER removed — owned by site-header.css */\n'
  );

  // Standalone legacy nav chrome definitions inside page <style>
  out = out.replace(/\.header-inner\s*\{[^}]*display\s*:\s*flex[^}]*\}/gi, '');
  out = out.replace(/\.header\.scrolled\s*\{[^}]*padding\s*:[^}]*\}/gi, '');
  out = out.replace(/\.header\s*\{[^}]*position\s*:\s*fixed[^}]*\}/gi, '');
  out = out.replace(/body\s*\{\s*padding-top:\s*0\s*!important;\s*\}/g, '');

  // Gray / light-theme nav links meant for old light headers
  out = out.replace(/\.nav-link\s*\{[^}]*color\s*:\s*#666[^}]*\}/gi, '');
  out = out.replace(/\.nav-link:hover\s*\{[^}]*color\s*:\s*#1A1A1A\s*!important[^}]*\}/gi, '');
  out = out.replace(/\.nav-link::after\s*\{[^}]*\}/gi, '');
  out = out.replace(/\.nav a::after\s*\{[^}]*\}/gi, '');
  out = out.replace(/\.nav a\{[^}]*font-size[^}]*\}/gi, '');

  // Direction-scoped page nav typography that fights site-header tuning
  out = out.replace(/html\[dir=["']ltr["']\]\s*\.nav-link\s*\{[^}]*\}/gi, '');
  out = out.replace(/html\[dir=["']rtl["']\]\s*\.nav-link\s*\{[^}]*\}/gi, '');
  out = out.replace(/html\[dir=["']ltr["']\]\s*\.nav-link:hover\s*\{[^}]*\}/gi, '');
  out = out.replace(/html\[dir=["']rtl["']\]\s*\.nav-link:hover\s*\{[^}]*\}/gi, '');
  out = out.replace(/html\[dir=["']ltr["']\]\s*\.nav-link::after\s*\{[^}]*\}/gi, '');
  out = out.replace(/html\[dir=["']rtl["']\]\s*\.nav-link::after\s*\{[^}]*\}/gi, '');

  // Legacy flex nav that blows spacing / layout
  out = out.replace(/\.nav\s*\{\s*display\s*:\s*flex\s*;\s*align-items\s*:\s*center\s*;\s*gap\s*:\s*28px\s*;\s*flex\s*:\s*1\s*;?\s*\}/gi, '');
  out = out.replace(
    /\.nav\s*\{\s*display\s*:\s*flex\s*;\s*align-items\s*:\s*center\s*;\s*justify-content\s*:\s*center\s*;\s*gap\s*:\s*28px\s*;\s*flex\s*:\s*1\s*;?\s*\}/gi,
    ''
  );
  out = out.replace(/\.logo\s*\{\s*display\s*:\s*flex\s*;\s*align-items\s*:\s*center\s*;\s*gap\s*:\s*14px\s*;\s*padding-top\s*:\s*4px\s*;?\s*\}/gi, '');
  out = out.replace(/\.logo\s*\{\s*display\s*:\s*flex\s*;\s*align-items\s*:\s*center\s*;?\s*\}/gi, '');

  // Mobile/tablet rules that hide .nav while site-header hides the hamburger (901–960 bug)
  out = out.replace(
    /@media\s*\(\s*max-width\s*:\s*960px\s*\)\s*\{\s*\.nav\s*\{\s*display\s*:\s*none\s*;?\s*\}[\s\S]*?\n\}/gi,
    '/* legacy max-width:960 nav hide removed */'
  );
  out = out.replace(
    /@media\s*\(\s*max-width\s*:\s*900px\s*\)\s*\{\s*\.nav\s*\{\s*display\s*:\s*none\s*;?\s*\}\s*\.menu-toggle\s*\{[^}]*\}[\s\S]*?\.nav\.open\s*\{[^}]*\}[\s\S]*?\}/gi,
    '/* legacy max-width:900 drawer removed — owned by site-header.css */'
  );

  // Duplicate scrolled listeners (site-header.js owns this)
  out = out.replace(
    /window\.addEventListener\(["']scroll["'],\s*function\s*\(\)\s*\{document\.getElementById\(["']header["']\)\.classList\.toggle\(["']scrolled["'],\s*window\.scrollY>\d+\)\};?\)/g,
    ''
  );
  out = out.replace(
    /window\.addEventListener\(["']scroll["'],\s*function\s*\(\)\s*\{var\s+h=document\.getElementById\(["']header["']\);if\(h\)h\.classList\.toggle\(["']scrolled["'],\s*window\.scrollY>\d+\)\};?\)/g,
    ''
  );

  return out;
}

/** Place site-header.css last in <head> so it wins over page <style> blocks. */
export function ensureHeaderCssLast(html, prefix) {
  const headerHref = `${prefix}site-header.css?v=${SITE_HEADER_CSS_VER}`;
  const headerTag = `<link rel="stylesheet" href="${headerHref}" data-gh-header-css="1">`;
  html = html.replace(/<link[^>]*href="[^"]*site-header\.css[^"]*"[^>]*>\s*/gi, '');
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${headerTag}\n</head>`);
  }
  return html + headerTag;
}
