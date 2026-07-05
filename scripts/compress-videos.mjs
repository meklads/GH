#!/usr/bin/env node
/**
 * Compress site videos to optimized H.264 MP4 (faststart, no audio).
 * Requires ffmpeg. Run: node scripts/compress-videos.mjs
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const VIDEOS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'videos');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function compress(file) {
  const base = path.join(VIDEOS_DIR, file);
  const tmpMp4 = path.join(VIDEOS_DIR, `.tmp-${file}`);

  console.log(`\n▶ ${file}`);
  const before = fs.statSync(base).size;
  run(
    `ffmpeg -y -i "${base}" -c:v libx264 -crf 28 -preset slow -movflags +faststart -pix_fmt yuv420p -an "${tmpMp4}"`
  );
  fs.renameSync(tmpMp4, base);
  const after = fs.statSync(base).size;
  console.log(`  ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`);
}

const files = fs.readdirSync(VIDEOS_DIR).filter((f) => f.endsWith('.mp4'));
for (const f of files) compress(f);

console.log('\nDone.');
