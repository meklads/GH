/**
 * Hand-crafted page guard.
 *
 * Some pages (for example services/interactive-experiences*.html) are written by hand and
 * carry <body data-gh-handcrafted="1">. The page generators and rewriters in the build
 * chain used to regenerate them on every build and wipe the hand-made layout.
 *
 * Import this module FIRST in any generator that rewrites service pages:
 *     import './lib/handcrafted-guard.mjs';
 * It makes fs.writeFileSync refuse to overwrite an existing .html file that carries the marker.
 * Site-wide transforms (sync-layout, site-hardening, …) do not import it, so header/footer sync
 * and SEO hardening still reach those pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';

const MARKER = 'data-gh-handcrafted="1"';
const original = fs.writeFileSync;

fs.writeFileSync = function guardedWriteFileSync(file, ...rest) {
  try {
    if (typeof file === 'string' && file.endsWith('.html') && fs.existsSync(file)) {
      if (fs.readFileSync(file, 'utf8').includes(MARKER)) {
        console.log(`  [hand-crafted] kept ${path.relative(process.cwd(), file)}`);
        return undefined;
      }
    }
  } catch {
    /* fall through to a normal write */
  }
  return original.call(this, file, ...rest);
};

syncBuiltinESMExports();
