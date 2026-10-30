#!/usr/bin/env node
/**
 * Guard for the full pipeline. The committed HTML carries hand-applied layers that
 * `npm run build` does not reproduce (it rewrites ~340 files and regresses the site).
 * CI runs it as a smoke test only (output is discarded). Locally, use:
 *   npm run article -- <slug>    to update one insights article safely
 * and only run the full build on purpose with GH_FULL_BUILD=1.
 */
if (process.env.GITHUB_ACTIONS === 'true' || process.env.GH_FULL_BUILD === '1') process.exit(0);
console.error(`
[blocked] Full build is disabled locally.
  It rewrites ~340 committed pages and removes hand-applied fixes.
  - Update one article:   npm run article -- <slug>
  - Force the full build: GH_FULL_BUILD=1 npm run build   (then review git diff before committing)
`);
process.exit(1);
