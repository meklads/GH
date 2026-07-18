/**
 * ProjectLaunch™ AR — paid-ads conversion landing page (nav-free).
 * Writes:
 *   - solutions/project-launch.html
 *   - solutions/project-launch-ads.html  (Meta/Google ads destination)
 * Run: node scripts/build-project-launch-lp-ar.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyticsHeadTags } from './analytics-snippet.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_MAIN = path.join(ROOT, 'solutions', 'project-launch.html');
const OUT_ADS = path.join(ROOT, 'solutions', 'project-launch-ads.html');
const BASE = 'https://3dgraphicshouse.com';
const PHONE = '+966502786513';
const PHONE_DISPLAY = '+966 50 278 6513';
const WA = 'https://wa.me/966502786513';
const CTA = 'احجز جلسة إطلاق مشروعك';
const FORM_CTA = 'احصل على تقييم جاهزية إطلاق مشروعك';

const css = `
  :root {
    --gold: #C9A84C;
    --gold-hover: #D9B860;
    --dark-green: #071810;
    --near-black: #0A0A0A;
    --card-bg: #111111;
    --card-hover: #161616;
    --text: rgba(255,255,255,.92);
    --muted: rgba(255,255,255,.65);
    --faint: rgba(255,255,255,.4);
    --line: rgba(255,255,255,.06);
    --gold-line: rgba(201,168,76,.15);
    --wa: #25D366;
    --max: 1100px;
    --pad: clamp(20px, 4vw, 48px);
    --sec: clamp(60px, 9vw, 100px);
  }
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body.pl-lp {
    margin: 0; background: var(--near-black); color: var(--text);
    font-family: 'Tajawal', 'IBM Plex Sans Arabic', sans-serif;
    overflow-x: hidden; -webkit-font-smoothing: antialiased;
    padding-bottom: 0;
  }
  @media (max-width: 720px) { body.pl-lp { padding-bottom: 72px; } }
  a { color: inherit; }
  img, video { max-width: 100%; display: block; }
  .pl-wrap { width: min(var(--max), calc(100% - var(--pad) * 2)); margin-inline: auto; }
  .pl-label {
    display: block; font-size: 11px; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 14px;
    direction: ltr; unicode-bidi: isolate; text-align: start;
  }
  .pl-h2 {
    font-size: clamp(24px, 3.5vw, 42px); font-weight: 700; line-height: 1.3;
    margin: 0 0 16px; color: #fff; max-width: 18em;
  }
  .pl-body {
    font-size: 16px; line-height: 1.9; color: var(--muted); margin: 0; max-width: 38em;
  }
  .pl-section { padding: var(--sec) 0; }
  .pl-reveal { opacity: 0; transform: translateY(20px); transition: opacity .6s ease, transform .6s ease; }
  .pl-reveal.visible { opacity: 1; transform: none; }

  /* Buttons */
  .pl-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--gold); color: #000; text-decoration: none; border: none; cursor: pointer;
    font-family: inherit; font-size: 14px; font-weight: 700; border-radius: 50px;
    padding: 16px 36px; min-height: 52px; transition: background .2s, transform .2s;
  }
  .pl-btn:hover { background: var(--gold-hover); transform: translateY(-2px); }
  .pl-btn-wa {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--wa); color: #fff; text-decoration: none;
    font-family: inherit; font-size: 14px; font-weight: 700; border-radius: 50px;
    padding: 16px 36px; min-height: 52px; transition: filter .2s, transform .2s;
  }
  .pl-btn-wa:hover { filter: brightness(1.06); transform: translateY(-2px); }
  .pl-btn-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  @media (max-width: 720px) {
    .pl-btn, .pl-btn-wa { width: 100%; }
  }

  /* Header — nav free */
  .pl-head {
    position: fixed; inset-inline: 0; top: 0; z-index: 1000;
    background: rgba(7,24,16,.97); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--gold-line); padding: 14px 0;
  }
  .pl-head-inner {
    width: min(var(--max), calc(100% - var(--pad) * 2)); margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .pl-head img { height: 56px; width: auto; }
  @media (min-width: 900px) { .pl-head img { height: 72px; } }
  .pl-head-actions { display: flex; align-items: center; gap: 12px; }
  .pl-head-tel {
    display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,.7);
    font-size: 13px; text-decoration: none; direction: ltr;
  }
  .pl-head-wa {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px;
    background: var(--wa); color: #fff; font-size: 12px; font-weight: 700;
    border-radius: 50px; text-decoration: none;
  }
  @media (max-width: 560px) {
    .pl-head-tel span { display: none; }
    .pl-head img { height: 44px; }
  }

  /* Hero 2-col */
  .pl-hero {
    position: relative; padding: calc(88px + var(--sec) * .35) 0 var(--sec);
    background: var(--dark-green); overflow: hidden;
  }
  .pl-hero::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 70% 60% at 20% 40%, rgba(201,168,76,.12), transparent 60%);
  }
  .pl-hero-grid {
    position: relative; z-index: 1;
    display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(28px, 5vw, 56px); align-items: center;
  }
  @media (max-width: 900px) { .pl-hero-grid { grid-template-columns: 1fr; } }
  .pl-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 50px; margin-bottom: 18px;
    border: 1px solid var(--gold-line); background: rgba(201,168,76,.08);
    font-size: 12px; font-weight: 700; color: var(--gold);
  }
  .pl-hero h1 {
    font-size: clamp(30px, 5vw, 56px); font-weight: 800; line-height: 1.22;
    margin: 0 0 18px; color: #fff; max-width: 14em;
  }
  .pl-hero-lead {
    font-size: clamp(15px, 1.6vw, 18px); line-height: 1.85; color: var(--muted);
    margin: 0; white-space: pre-line; max-width: 34em;
  }
  .pl-hero-clients {
    display: flex; flex-wrap: wrap; gap: 8px 10px; margin-top: 22px;
    font-size: 13px; font-weight: 700; color: var(--faint);
  }
  .pl-hero-clients span { color: rgba(201,168,76,.55); }
  .pl-trust-line {
    margin-top: 16px; font-size: 13px; color: rgba(255,255,255,.45); font-weight: 600;
  }
  .pl-hero-visual { display: grid; gap: 14px; }
  .pl-hero-video {
    overflow: hidden; border-radius: 12px; border: 1px solid var(--gold-line);
    background: #000; aspect-ratio: 16/10;
  }
  .pl-hero-video video { width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 900px) {
    .pl-hero-video { max-height: 240px; aspect-ratio: auto; }
    .pl-hero-video video { max-height: 240px; }
  }
  .pl-stat-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .pl-stat-pill {
    flex: 1; min-width: 110px; text-align: center; padding: 12px 10px;
    background: rgba(255,255,255,.03); border: 1px solid var(--line); border-radius: 10px;
  }
  .pl-stat-pill strong { display: block; color: var(--gold); font-size: 18px; font-weight: 800; margin-bottom: 4px; }
  .pl-stat-pill span { font-size: 11px; color: var(--faint); font-weight: 600; }

  /* Trust band */
  .pl-trust-band {
    background: var(--near-black);
    border-top: 1px solid var(--gold-line); border-bottom: 1px solid var(--gold-line);
    padding: 28px 0;
  }
  .pl-trust-band .pl-band-label {
    text-align: center; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(255,255,255,.35); margin: 0 0 16px; font-weight: 700;
  }
  .pl-names {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 6px;
    font-size: 15px; font-weight: 700; color: var(--faint);
  }
  .pl-names a, .pl-names span.name {
    color: var(--faint); text-decoration: none; padding: 4px 8px; transition: color .2s;
  }
  .pl-names a:hover, .pl-names span.name:hover { color: var(--gold); }
  .pl-names .dot { color: var(--gold); opacity: .7; padding: 0 4px; }
  @media (max-width: 720px) {
    .pl-names {
      flex-wrap: nowrap; overflow-x: auto; white-space: nowrap; justify-content: flex-start;
      padding-bottom: 6px; -webkit-overflow-scrolling: touch;
    }
  }

  /* Content sections on dark */
  .pl-card-surface { background: var(--card-bg); border: 1px solid var(--line); border-radius: 12px; padding: clamp(22px, 3vw, 32px); }
  .pl-grid-2 { display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(24px, 4vw, 48px); align-items: center; }
  @media (max-width: 900px) { .pl-grid-2 { grid-template-columns: 1fr; } }
  .pl-media {
    overflow: hidden; border-radius: 12px; border: 1px solid var(--line); background: #000; aspect-ratio: 4/3;
  }
  .pl-media img, .pl-media video { width: 100%; height: 100%; object-fit: cover; }

  .pl-list { list-style: none; margin: 24px 0 0; padding: 0; border-top: 1px solid var(--line); }
  .pl-list li {
    padding: 16px 0; border-bottom: 1px solid var(--line);
    font-size: 15px; line-height: 1.7; color: var(--muted);
  }
  .pl-list strong { color: #fff; font-weight: 700; }
  .pl-punch {
    margin-top: 28px; font-size: clamp(20px, 2.4vw, 28px); font-weight: 800; line-height: 1.4;
    color: #fff; border-inline-start: 3px solid var(--gold); padding-inline-start: 16px;
  }

  .pl-trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 32px; }
  @media (max-width: 900px) { .pl-trust-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 520px) { .pl-trust-grid { grid-template-columns: 1fr; } }
  .pl-trust-card {
    background: var(--card-bg); border: 1px solid var(--line); border-radius: 12px;
    padding: 24px 20px; transition: border-color .2s, background .2s;
  }
  .pl-trust-card:hover { border-color: rgba(201,168,76,.2); background: var(--card-hover); }
  .pl-trust-card h3 { margin: 0 0 10px; font-size: 16px; font-weight: 800; color: #fff; }
  .pl-trust-card p { margin: 0; font-size: 14px; line-height: 1.75; color: var(--muted); }

  .pl-product {
    background: var(--dark-green); border: 1px solid var(--gold-line); border-radius: 14px;
    padding: clamp(28px, 4vw, 48px); border-inline-start: 3px solid var(--gold);
  }
  .pl-product .pl-body { color: rgba(255,255,255,.7); }

  .pl-checks { list-style: none; margin: 24px 0 0; padding: 0; }
  .pl-checks li {
    display: flex; gap: 10px; align-items: flex-start; padding: 12px 0;
    border-bottom: 1px solid var(--line); font-size: 15px; font-weight: 600; color: #fff;
  }
  .pl-checks .ck { color: var(--gold); flex-shrink: 0; }

  /* Results metrics */
  .pl-metrics {
    background: var(--dark-green); border-top: 1px solid var(--gold-line); border-bottom: 1px solid var(--gold-line);
    padding: clamp(40px, 6vw, 64px) 0;
  }
  .pl-metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
  @media (max-width: 720px) { .pl-metrics-grid { grid-template-columns: 1fr; } }
  .pl-metric {
    text-align: center; padding: 24px 16px;
    border-inline-end: 1px solid var(--gold-line);
  }
  .pl-metrics-grid .pl-metric:last-child { border-inline-end: none; }
  @media (max-width: 720px) {
    .pl-metric { border-inline-end: none; border-bottom: 1px solid var(--gold-line); }
    .pl-metrics-grid .pl-metric:last-child { border-bottom: none; }
  }
  .pl-metric strong {
    display: block; font-size: clamp(40px, 6vw, 56px); font-weight: 800; color: var(--gold); line-height: 1.1;
  }
  .pl-metric span { display: block; margin-top: 10px; font-size: 13px; color: rgba(255,255,255,.5); font-weight: 600; }

  /* Timeline */
  .pl-timeline { margin-top: 36px; max-width: 560px; }
  .pl-tl { display: grid; grid-template-columns: 20px 1fr; gap: 16px; }
  .pl-tl-rail { display: flex; flex-direction: column; align-items: center; }
  .pl-tl-dot {
    width: 10px; height: 10px; border-radius: 50%; background: var(--gold);
    box-shadow: 0 0 0 4px rgba(201,168,76,.15); margin-top: 6px;
  }
  .pl-tl-line { flex: 1; width: 1px; background: rgba(201,168,76,.25); min-height: 28px; }
  .pl-tl-body { padding-bottom: 28px; }
  .pl-tl:last-child .pl-tl-body { padding-bottom: 0; }
  .pl-tl-body h3 { margin: 0 0 6px; font-size: 16px; font-weight: 800; color: #fff; }
  .pl-tl-body p { margin: 0; font-size: 14px; line-height: 1.75; color: var(--muted); }

  /* Story */
  .pl-story {
    display: grid; grid-template-columns: 1fr 1.1fr; gap: 0;
    background: var(--card-bg); border: 1px solid var(--line); border-radius: 14px; overflow: hidden;
  }
  @media (max-width: 900px) { .pl-story { grid-template-columns: 1fr; } }
  .pl-story-img { position: relative; min-height: 280px; background: #000; }
  .pl-story-img img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .pl-story-img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,.75));
  }
  .pl-story-badge {
    position: absolute; z-index: 1; inset-inline-start: 16px; bottom: 16px;
    background: rgba(7,24,16,.9); border: 1px solid var(--gold-line); color: var(--gold);
    font-size: 12px; font-weight: 800; padding: 8px 12px; border-radius: 50px;
  }
  .pl-story-copy { padding: clamp(24px, 3vw, 40px); }
  .pl-story-copy h3 { font-size: clamp(20px, 2.4vw, 26px); margin: 0 0 18px; color: #fff; line-height: 1.4; }
  .pl-story-steps { display: grid; gap: 14px; }
  .pl-story-steps strong { display: block; color: var(--gold); font-size: 12px; letter-spacing: .08em; margin-bottom: 4px; }
  .pl-story-steps p { margin: 0; font-size: 14px; line-height: 1.75; color: var(--muted); }
  .pl-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
  .pl-pill {
    padding: 8px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; color: var(--gold);
    border: 1px solid var(--gold-line); background: rgba(201,168,76,.08);
  }
  .pl-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
  @media (max-width: 720px) { .pl-mini-grid { grid-template-columns: 1fr; } }
  .pl-mini {
    position: relative; overflow: hidden; border-radius: 12px; border: 1px solid var(--line);
    aspect-ratio: 16/10; background: #000;
  }
  .pl-mini img { width: 100%; height: 100%; object-fit: cover; opacity: .9; }
  .pl-mini span {
    position: absolute; inset-inline: 0; bottom: 0; padding: 24px 12px 12px;
    background: linear-gradient(transparent, rgba(0,0,0,.8));
    font-size: 13px; font-weight: 700; color: #fff;
  }

  /* WhatsApp mid CTA */
  .pl-wa-band {
    background: var(--dark-green); border-top: 1px solid var(--gold-line); border-bottom: 1px solid var(--gold-line);
    padding: clamp(40px, 6vw, 64px) 0; text-align: center;
  }
  .pl-wa-band h2 { margin: 0 0 20px; font-size: clamp(22px, 3vw, 32px); color: #fff; font-weight: 800; }
  .pl-wa-band .hint { margin-top: 14px; font-size: 14px; color: var(--faint); }

  /* FAQ */
  .pl-faq { margin-top: 24px; border-top: 1px solid var(--line); }
  .pl-faq details { border-bottom: 1px solid var(--line); }
  .pl-faq summary {
    cursor: pointer; list-style: none; padding: 18px 0; font-weight: 800; font-size: 16px; color: #fff;
    display: flex; justify-content: space-between; gap: 12px; align-items: center;
  }
  .pl-faq summary::-webkit-details-marker { display: none; }
  .pl-faq summary::after { content: '+'; color: var(--gold); font-size: 20px; }
  .pl-faq details[open] summary::after { content: '−'; }
  .pl-faq p { margin: 0; padding: 0 0 18px; color: var(--muted); font-size: 15px; line-height: 1.8; max-width: 38em; }

  /* Assess */
  .pl-assess { list-style: none; margin: 24px 0 0; padding: 0; border-top: 1px solid var(--line); }
  .pl-assess li {
    display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--line);
    font-size: 15px; font-weight: 600; color: #fff; line-height: 1.55;
  }
  .pl-assess .q { color: var(--gold); font-weight: 800; width: 1.4em; flex-shrink: 0; }
  .pl-assess-note {
    margin-top: 22px; padding: 20px 22px; border-radius: 12px;
    background: rgba(201,168,76,.08); border: 1px solid var(--gold-line);
    font-size: 16px; font-weight: 700; line-height: 1.6; color: #fff;
  }
  .pl-assess-note span { color: var(--gold); }

  /* Urgency */
  .pl-urgency {
    background: rgba(201,168,76,.08); border: 1px solid rgba(201,168,76,.25);
    border-radius: 12px; padding: 16px 24px; margin-bottom: 28px;
    display: flex; align-items: center; justify-content: center; gap: 10px; text-align: center;
    font-size: 15px; font-weight: 700; color: #fff; line-height: 1.5;
  }
  .pl-urgency .ico { color: var(--gold); font-size: 18px; flex-shrink: 0; }

  /* Form */
  .pl-form-sec { background: var(--dark-green); padding: var(--sec) 0; border-top: 1px solid var(--gold-line); }
  .pl-form-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 24px; align-items: start; }
  @media (max-width: 900px) { .pl-form-grid { grid-template-columns: 1fr; } }
  .pl-form-box {
    background: rgba(255,255,255,.03); border: 1px solid var(--line); border-radius: 14px;
    padding: clamp(22px, 3vw, 32px);
  }
  .pl-form {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 24px;
  }
  @media (max-width: 700px) { .pl-form { grid-template-columns: 1fr; } }
  .pl-form label {
    display: block; font-size: 11px; font-weight: 700; letter-spacing: .06em;
    color: rgba(255,255,255,.55); margin-bottom: 8px;
  }
  .pl-form input, .pl-form select {
    width: 100%; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12);
    background: rgba(0,0,0,.35); color: #fff; font-family: inherit; font-size: 15px;
  }
  .pl-form select option { color: #111; }
  .pl-form input:focus, .pl-form select:focus { outline: none; border-color: var(--gold); }
  .pl-span-2 { grid-column: 1 / -1; }
  .pl-form .pl-btn { width: 100%; border-radius: 50px; }
  .pl-form-note { margin: 12px 0 0; font-size: 12px; color: rgba(255,255,255,.45); line-height: 1.6; }
  .pl-form-feedback { display: none; padding: 12px 14px; border-radius: 8px; font-size: 14px; line-height: 1.6; }
  .pl-form-feedback.is-visible { display: block; }
  .pl-form-feedback.is-success { background: rgba(45,125,70,.25); color: #c8f0d2; }
  .pl-form-feedback.is-error { background: rgba(180,40,40,.2); color: #ffd0d0; }
  .pl-form-feedback.is-pending { background: rgba(201,168,76,.12); color: #f0e2b0; }
  .pl-reassure {
    background: rgba(201,168,76,.06); border: 1px solid var(--gold-line); border-radius: 14px;
    padding: clamp(22px, 3vw, 32px);
  }
  .pl-reassure ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
  .pl-reassure li { font-size: 15px; font-weight: 700; color: #fff; display: flex; gap: 10px; }
  .pl-reassure li::before { content: '✓'; color: var(--gold); font-weight: 800; }
  .pl-quote {
    margin-top: 28px; padding-top: 22px; border-top: 1px solid var(--gold-line);
    font-size: 14px; line-height: 1.8; color: var(--muted); font-style: normal;
  }
  .pl-quote cite { display: block; margin-top: 12px; color: var(--gold); font-style: normal; font-size: 12px; font-weight: 700; }

  /* Footer */
  .pl-foot {
    background: var(--dark-green); border-top: 1px solid var(--gold-line);
    padding: 48px 0 32px; text-align: center;
  }
  .pl-foot-brand { font-size: 18px; font-weight: 800; color: #fff; margin: 0 0 20px; direction: ltr; unicode-bidi: isolate; }
  .pl-foot-meta { margin-top: 22px; font-size: 13px; color: var(--faint); direction: ltr; }
  .pl-foot-meta a { color: var(--gold); text-decoration: none; }
  .pl-foot-copy { margin-top: 18px; font-size: 12px; color: rgba(255,255,255,.3); }
  .pl-foot-copy a { color: rgba(255,255,255,.55); }

  /* Float WA + sticky book */
  .pl-float-wa {
    position: fixed; z-index: 900; left: max(14px, env(safe-area-inset-left));
    bottom: max(18px, env(safe-area-inset-bottom));
    width: 52px; height: 52px; border-radius: 50%; background: var(--wa); color: #fff;
    display: flex; align-items: center; justify-content: center; text-decoration: none;
    box-shadow: 0 8px 24px rgba(0,0,0,.35);
  }
  .pl-float-wa svg { width: 26px; height: 26px; fill: currentColor; }
  .pl-float-book {
    position: fixed; z-index: 900; right: max(14px, env(safe-area-inset-right));
    bottom: max(18px, env(safe-area-inset-bottom));
    display: none; align-items: center; padding: 12px 18px; border-radius: 50px;
    background: var(--gold); color: #000; font-size: 13px; font-weight: 800; text-decoration: none;
    box-shadow: 0 8px 24px rgba(0,0,0,.35);
  }
  .pl-float-book.is-on { display: inline-flex; }
  @media (max-width: 720px) {
    .pl-float-wa { bottom: calc(78px + env(safe-area-inset-bottom)); }
    .pl-float-book { display: none !important; }
  }
  .pl-sticky {
    display: none; position: fixed; inset-inline: 0; bottom: 0; z-index: 950;
    padding: 10px var(--pad) calc(10px + env(safe-area-inset-bottom));
    background: rgba(7,24,16,.96); border-top: 1px solid var(--gold-line);
  }
  .pl-sticky .pl-btn { width: 100%; }
  @media (max-width: 720px) { .pl-sticky { display: block; } }
  .pl-sticky.is-hidden { display: none !important; }
`;

function ctaBook(extra = '') {
  return `<a class="pl-btn ${extra}" href="#lead-form" data-cta="book-session">${CTA}</a>`;
}
function ctaWa(label = 'واتساب', extra = '') {
  return `<a class="pl-btn-wa ${extra}" href="${WA}" target="_blank" rel="noopener" data-cta="whatsapp">${label}</a>`;
}

function buildHtml({ pagePath, noindex = false }) {
  const pageUrl = `${BASE}${pagePath}`;
  const robots = noindex
    ? '<meta name="robots" content="noindex,nofollow"/>\n'
    : '';
  const hreflang = noindex
    ? ''
    : `<link rel="alternate" hreflang="en" href="${BASE}/solutions/project-launch-en.html">
<link rel="alternate" hreflang="ar" href="${BASE}/solutions/project-launch.html">
<link rel="alternate" hreflang="x-default" href="${BASE}/solutions/project-launch-en.html">
`;
  return `<!DOCTYPE html>
<html class="scroll-smooth" dir="rtl" lang="ar">
<head>
<script src="../assets/gh-forms-config.js?v=2"></script>
<script src="../assets/quote-form-config.js"></script>
${analyticsHeadTags('../')}
<link rel="canonical" href="${pageUrl}">
${hreflang}${robots}<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ProjectLaunch™ | منظومة إطلاق المشاريع العقارية | Graphics House</title>
<meta name="description" content="تخيّل أن يرى المستثمر مشروعك قبل أن يُبنى — وأن يفهمه العميل في دقائق داخل صالة البيع. ProjectLaunch™ منظومة إطلاق متكاملة من Graphics House."/>
<meta property="og:title" content="ProjectLaunch™ | Graphics House">
<meta property="og:description" content="منظومة إطلاق تجعل مشروعك جاهزًا للسوق: إقناع المستثمر، تجربة البيع، وحضور قوي يوم الإطلاق.">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${BASE}/assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'ProjectLaunch™',
  description: 'منظومة متكاملة لإطلاق المشاريع العقارية — من إقناع المستثمر إلى تجربة صالة البيع.',
  url: pageUrl,
  brand: { '@type': 'Brand', name: 'Graphics House' },
  provider: { '@type': 'Organization', name: 'Graphics House', url: BASE, telephone: PHONE },
  areaServed: ['SA', 'AE', 'OM', 'BH', 'EG'],
})}</script>
</head>
<body class="pl-lp">
<a class="gh-skip-link" href="#main-content" style="position:absolute;inset-inline-start:-9999px">تخطي إلى المحتوى الرئيسي</a>

<header class="pl-head" id="pl-lp-header">
  <div class="pl-head-inner">
    <img src="../assets/logo-gold.png" alt="Graphics House" width="180" height="72">
    <div class="pl-head-actions">
      <a class="pl-head-tel" href="tel:${PHONE}" data-cta="book-session"><span class="material-symbols-outlined" style="font-size:18px">call</span><span>${PHONE_DISPLAY}</span></a>
      <a class="pl-head-wa" href="${WA}" target="_blank" rel="noopener" data-cta="whatsapp">واتساب</a>
    </div>
  </div>
</header>

<main id="main-content">

  <!-- Hero -->
  <section class="pl-hero" id="hero">
    <div class="pl-wrap pl-hero-grid">
      <div class="pl-reveal">
        <div class="pl-badge">ProjectLaunch™ — منظومة إطلاق المشاريع العقارية</div>
        <h1>تخيّل أن يرى المستثمر مشروعك… قبل أن يُبنى.</h1>
        <p class="pl-hero-lead">وتخيّل أن يدخل العميل صالة البيع… فيفهم المشروع خلال دقائق.

هذه ليست أحلامًا…
بل نتيجة منظومة إطلاق احترافية.</p>
        <div class="pl-hero-clients">
          رفال <span>·</span> أنان إسكان <span>·</span> الأولى <span>·</span> رابطة العالم الإسلامي
        </div>
        <div class="pl-btn-row">
          ${ctaBook()}
          ${ctaWa('واتساب')}
        </div>
        <p class="pl-trust-line">جلسة التقييم مجانية — بدون التزام شراء</p>
      </div>
      <div class="pl-hero-visual pl-reveal">
        <div class="pl-hero-video">
          <video id="pl-hero-vid" class="gh-autoplay" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg" controlslist="nodownload nofullscreen noremoteplayback" disablePictureInPicture>
            <source src="../assets/videos/GH-Real-estate-services.mp4" type="video/mp4">
          </video>
        </div>
        <div class="pl-stat-pills">
          <div class="pl-stat-pill"><strong>+200</strong><span>مشروع</span></div>
          <div class="pl-stat-pill"><strong>+15</strong><span>سنة</span></div>
          <div class="pl-stat-pill"><strong>SAR 2B+</strong><span>مشاريع مُصوَّرة</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Trust band -->
  <section class="pl-trust-band" id="proof" aria-label="عملاء Graphics House">
    <div class="pl-wrap">
      <p class="pl-band-label">موثوق به من كبار المطورين في السعودية والخليج</p>
      <div class="pl-names">
        <span class="name">رفال</span><span class="dot">·</span>
        <span class="name">أنان إسكان</span><span class="dot">·</span>
        <span class="name">رابطة العالم الإسلامي</span><span class="dot">·</span>
        <span class="name">الأولى</span><span class="dot">·</span>
        <span class="name">الراجحي</span><span class="dot">·</span>
        <span class="name">تويوتا</span>
      </div>
    </div>
  </section>

  <!-- Problem -->
  <section class="pl-section" id="problem">
    <div class="pl-wrap pl-grid-2">
      <div class="pl-reveal">
        <span class="pl-label">المشكلة</span>
        <h2 class="pl-h2">المخططات جاهزة. الرخص تمضي. والبيع ما زال بطيئًا.</h2>
        <p class="pl-body">كثير من المشاريع تصل لمرحلة الإطلاق وهي قوية على الورق… ثم تتعثر في إقناع المستثمر أو العميل لأنها تُقدَّم كقطع منفصلة: رندر هنا، فيلم هناك، مجسم في زاوية، وصالة بيع بلا قصة.</p>
        <p class="pl-body" style="margin-top:14px">النتيجة ليست «نقص إبداع». النتيجة تأخير في الإغلاق، وضعف في الثقة، وفرص تُترك على الطاولة.</p>
        <div class="pl-btn-row">${ctaBook()}</div>
      </div>
      <div class="pl-media pl-reveal">
        <img src="../assets/news/makkah-charter-07.jpeg" alt="بيئة عرض وإطلاق مشروع" loading="lazy" width="800" height="600">
      </div>
    </div>
  </section>

  <!-- Inline WhatsApp -->
  <section class="pl-wa-band" id="whatsapp-cta">
    <div class="pl-wrap pl-reveal">
      <h2>يفضّل التحدث مباشرة؟</h2>
      ${ctaWa('ابدأ محادثة الآن ←')}
      <p class="hint">أو أكمل للأسفل لملء نموذج الجلسة</p>
    </div>
  </section>

  <!-- Why weak launch -->
  <section class="pl-section" id="why-weak-launch" style="background:#0d1210">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px">
        <span class="pl-label">قبل الحل</span>
        <h2 class="pl-h2">لماذا لا تحقق بعض المشاريع تأثيرًا قويًا عند الإطلاق؟</h2>
        <p class="pl-body">الإطلاق يضعف غالبًا قبل أن يبدأ البيع — في طريقة تقديم المشروع للسوق.</p>
      </div>
      <ul class="pl-list pl-reveal">
        <li><strong>تعدد الموردين:</strong> كل جهة تتكلم بلغة بصرية مختلفة عن الأخرى.</li>
        <li><strong>غياب لغة بصرية موحّدة:</strong> المشروع يبدو مجموعة أعمال… لا منتجًا جاهزًا.</li>
        <li><strong>ضعف أدوات البيع:</strong> لا مسار واضح من الانطباع الأول إلى قرار الشراء.</li>
        <li><strong>غياب تجربة المستثمر:</strong> العرض يشرح المواصفات… ولا يبني الثقة.</li>
      </ul>
      <p class="pl-punch pl-reveal">المشكلة ليست في المشروع…<br>بل في طريقة تقديمه للسوق.</p>
      <div class="pl-btn-row pl-reveal">${ctaBook()}</div>
    </div>
  </section>

  <!-- Why GH -->
  <section class="pl-section" id="why-gh">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px">
        <span class="pl-label">الثقة</span>
        <h2 class="pl-h2">لماذا يثق المطورون بـ Graphics House؟</h2>
        <p class="pl-body">أربع أسباب فقط — بلا كلام إنشائي.</p>
      </div>
      <div class="pl-trust-grid">
        <article class="pl-trust-card pl-reveal"><h3>خبرة طويلة في الإطلاق</h3><p>نعمل مع مطورين ومستثمرين ومقاولين على مشاريع تحتاج إقناعًا قبل الخرسانة.</p></article>
        <article class="pl-trust-card pl-reveal"><h3>مشاريع منفذة تثبت المنهجية</h3><p>بيئات بيع، مجسمات ذكية، أفلام إطلاق، وصالات عرض — كمنظومات مكتملة لا تجارب منفصلة.</p></article>
        <article class="pl-trust-card pl-reveal"><h3>فريق متعدد التخصصات</h3><p>هوية، تصور، إنتاج، مجسمات، تفاعلي، وتركيب في الموقع — تحت سقف واحد.</p></article>
        <article class="pl-trust-card pl-reveal"><h3>منظومة متكاملة</h3><p>لغة واحدة من أول إطار إلى آخر شاشة في صالة البيع — لتقليل إعادة العمل وتسريع الإطلاق.</p></article>
      </div>
    </div>
  </section>

  <!-- Product -->
  <section class="pl-section" id="product" style="background:#0d1210">
    <div class="pl-wrap">
      <div class="pl-product pl-reveal">
        <span class="pl-label">المنهجية</span>
        <h2 class="pl-h2">ProjectLaunch™ — منظومة إطلاق تجعل مشروعك جاهزًا للسوق.</h2>
        <p class="pl-body">ليست قائمة خدمات. ليست «رندر + أنيميشن + موقع».</p>
        <p class="pl-body" style="margin-top:12px">هي منهجية متكاملة تحوّل مشروعك إلى قصة قابلة للبيع: هوية واضحة، أصول بصرية تُقنع، وأدوات إغلاق داخل بيئة البيع — بلغة واحدة.</p>
        <p class="pl-body" style="margin-top:12px">الهدف بسيط: أن يخرج زائر جلسة الإطلاق وهو يعرف ماذا يحتاج — وأن يخرج عميلك من صالة البيع وهو أقرب للقرار.</p>
        <div class="pl-btn-row">${ctaBook()}</div>
      </div>
    </div>
  </section>

  <!-- Launch day -->
  <section class="pl-section" id="launch-day">
    <div class="pl-wrap pl-grid-2">
      <div class="pl-reveal">
        <span class="pl-label">ماذا سيكون لديك</span>
        <h2 class="pl-h2">ماذا سيكون لديك يوم الإطلاق؟</h2>
        <p class="pl-body">تخيّل صباح الإطلاق… وكل ما يحتاجه السوق جاهز في مكانه.</p>
        <ul class="pl-checks">
          <li><span class="ck material-symbols-outlined">check_circle</span> هوية بصرية متكاملة للمشروع</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> فيلم إطلاق احترافي</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> رندرات عالية الجودة</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> مجسم معماري (ذكي عند الحاجة)</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> أدوات عرض للمستثمرين</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> تجربة تفاعلية للمبيعات</li>
          <li><span class="ck material-symbols-outlined">check_circle</span> مواد تسويقية جاهزة للاستخدام</li>
        </ul>
        <div class="pl-btn-row">${ctaBook()}</div>
      </div>
      <div class="pl-reveal" style="display:grid;gap:12px">
        <div class="pl-media" style="aspect-ratio:16/10">
          <video class="gh-autoplay" autoplay muted loop playsinline webkit-playsinline preload="metadata" poster="../assets/projects/animation/architectural-visualisation.jpg">
            <source src="../assets/videos/3D-Architectural-visualisation.mp4" type="video/mp4">
          </video>
        </div>
        <div class="pl-media" style="aspect-ratio:16/10">
          <img src="../assets/projects/maquettes/anan-eskan-maquette-01.jpeg?v=2" alt="مجسم معماري لمشروع عقاري" loading="lazy" width="800" height="500">
        </div>
      </div>
    </div>
  </section>

  <!-- Results strip -->
  <section class="pl-metrics" id="results">
    <div class="pl-wrap">
      <div class="pl-metrics-grid pl-reveal">
        <div class="pl-metric"><strong>+200</strong><span>مشروع مُنجز</span></div>
        <div class="pl-metric"><strong>SAR 2B+</strong><span>قيمة مشاريع مُصوَّرة</span></div>
        <div class="pl-metric"><strong>100%</strong><span>معدل التسليم في الموعد</span></div>
      </div>
    </div>
  </section>

  <!-- Timeline -->
  <section class="pl-section" id="after-signing">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px">
        <span class="pl-label">التنفيذ</span>
        <h2 class="pl-h2">ماذا يحدث بعد توقيع الاتفاقية؟</h2>
        <p class="pl-body">مسار واضح يزيل الغموض — من أول يوم حتى الإطلاق.</p>
      </div>
      <div class="pl-timeline pl-reveal">
        <div class="pl-tl"><div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div><div class="pl-tl-body"><h3>اليوم الأول</h3><p>بدء التواصل وتحديد أهداف الإطلاق والجمهور.</p></div></div>
        <div class="pl-tl"><div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div><div class="pl-tl-body"><h3>ورشة فهم المشروع</h3><p>جلسة مركّزة لفهم المنتج، مرحلة البيع، ونقاط الإقناع المطلوبة.</p></div></div>
        <div class="pl-tl"><div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div><div class="pl-tl-body"><h3>إعداد نطاق العمل</h3><p>خطة واضحة للأولويات والميزانية ومراحل التنفيذ.</p></div></div>
        <div class="pl-tl"><div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div><div class="pl-tl-body"><h3>الإنتاج</h3><p>تنفيذ الأصول والتجارب وبيئة البيع بلغة بصرية واحدة.</p></div></div>
        <div class="pl-tl"><div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div><div class="pl-tl-body"><h3>المراجعات</h3><p>ضبط الجودة مع فريقك حتى تصبح الرسالة جاهزة للسوق.</p></div></div>
        <div class="pl-tl"><div class="pl-tl-rail"><span class="pl-tl-dot"></span><span class="pl-tl-line"></span></div><div class="pl-tl-body"><h3>التسليم</h3><p>تركيب، ضبط، وتدريب الفريق على استخدام المنظومة في الموقع.</p></div></div>
        <div class="pl-tl"><div class="pl-tl-rail"><span class="pl-tl-dot"></span></div><div class="pl-tl-body"><h3>جاهز للإطلاق</h3><p>مشروعك يُقدَّم للسوق كمنتج مكتمل — لا كمجموعة ملفات.</p></div></div>
      </div>
      <div class="pl-btn-row pl-reveal">${ctaBook()}</div>
    </div>
  </section>

  <!-- Stories -->
  <section class="pl-section" id="stories" style="background:#0d1210">
    <div class="pl-wrap">
      <div class="pl-reveal" style="max-width:720px;margin-bottom:28px">
        <span class="pl-label">قصة نجاح</span>
        <h2 class="pl-h2">كيف حوّلنا عرض المشروع إلى تجربة إقناع</h2>
        <p class="pl-body">قصة واحدة مكتملة — لا معرض صور.</p>
      </div>
      <article class="pl-story pl-reveal">
        <div class="pl-story-img">
          <img src="../assets/projects/rendering/Anan-Escan-Co.01.jpeg" alt="عنان إسكان" loading="lazy">
          <div class="pl-story-badge">عنان إسكان للتطوير · الرياض</div>
        </div>
        <div class="pl-story-copy">
          <h3>عندما أراد مطوّر عنان إسكان إطلاق مشروعه السكني… كان يواجه فجوة بين جاهزية المخططات وجاهزية البيع.</h3>
          <div class="pl-story-steps">
            <div><strong>التحدي</strong><p>إقناع العملاء وصنّاع القرار قبل اكتمال التنفيذ — دون الاعتماد على صور متفرقة لا تبني قصة واحدة.</p></div>
            <div><strong>كيف تعاملنا معه</strong><p>وضعنا هدفًا واحدًا: أن يُفهم المشروع خلال دقائق، وأن يبدو كمنتج جاهز للسوق لا كحزمة ملفات.</p></div>
            <div><strong>ما الذي قمنا بتنفيذه</strong><p>منظومة إظهار مترابطة: تصور معماري سينمائي + مجسم يرسّخ الحضور داخل غرفة العرض — بلغة بصرية واحدة.</p></div>
            <div><strong>النتيجة</strong><p>أصبح المشروع أسهل في الشرح، أوضح في الانطباع الأول، وأقرب لقرار الشراء أو الشراكة — دون ادعاء أرقام غير موثقة.</p></div>
          </div>
          <div class="pl-pills">
            <span class="pl-pill">تسليم في الموعد</span>
            <span class="pl-pill">منظومة متكاملة</span>
            <span class="pl-pill">عميل عاد مجدداً</span>
          </div>
        </div>
      </article>
      <div class="pl-mini-grid pl-reveal">
        <div class="pl-mini">
          <img src="../assets/projects/maquettes/mwl-humanity-exhibition-hero.jpeg" alt="رابطة العالم الإسلامي" loading="lazy">
          <span>رابطة العالم الإسلامي — بيئة إطلاق مكتملة</span>
        </div>
        <div class="pl-mini">
          <img src="../assets/projects/rendering/Aloula-co-alnakheel-view02-scaled.jpg" alt="الأولى النخيل" loading="lazy">
          <span>الأولى النخيل — إظهار يبيع ما لم يُبنَ</span>
        </div>
      </div>
      <div class="pl-btn-row pl-reveal" style="margin-top:28px">${ctaBook()}</div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="pl-section" id="faq">
    <div class="pl-wrap" style="max-width:800px">
      <div class="pl-reveal">
        <span class="pl-label">أسئلة شائعة</span>
        <h2 class="pl-h2">أسئلة يطرحها صنّاع القرار قبل الحجز</h2>
      </div>
      <div class="pl-faq pl-reveal">
        <details open><summary>هل يجب تنفيذ جميع عناصر ProjectLaunch™؟</summary><p>ليس بالضرورة. نساعدك في تحديد الأولويات حسب مرحلة مشروعك وميزانيتك، مع الحفاظ على وجود خطة متكاملة للإطلاق.</p></details>
        <details><summary>هل يمكن تنفيذ المشروع على مراحل؟</summary><p>نعم. يمكن البدء بما يفتح البيع مبكرًا ثم استكمال بقية المنظومة — مع الإبقاء على لغة بصرية واحدة عبر كل مرحلة.</p></details>
        <details><summary>لدينا وكالة تسويق بالفعل، هل نحتاجكم؟</summary><p>غالبًا نعم. الوكالة تحرّك الرسالة والقنوات. ProjectLaunch™ يجهّز «منتج الإطلاق» نفسه: اللغة البصرية، أصول الإقناع، وتجربة البيع. كثير من الحملات تضعف لأن المنتج البصري غير جاهز أصلًا.</p></details>
        <details><summary>كم تستغرق المنظومة؟</summary><p>تعتمد على نطاق المشروع ومرحلة الإطلاق. بعد جلسة التقييم نحدد جدولًا واضحًا للمراحل والتسليم — بدون وعود عامة غير مربوطة بنطاقك.</p></details>
        <details><summary>هل تنفذون في جميع مدن المملكة؟</summary><p>نعم — نخدم مشاريع في مدن المملكة والخليج، مع إنتاج وتركيب حسب نطاق كل مشروع.</p></details>
      </div>
    </div>
  </section>

  <!-- Self assessment -->
  <section class="pl-section" id="assess" style="background:#0d1210">
    <div class="pl-wrap" style="max-width:800px">
      <div class="pl-reveal">
        <span class="pl-label">تقييم سريع</span>
        <h2 class="pl-h2">هل مشروعك جاهز للإطلاق؟</h2>
        <p class="pl-body">أجب بصراحة — هذه الأسئلة تكشف فجوة الجاهزية قبل يوم الإطلاق.</p>
      </div>
      <ul class="pl-assess pl-reveal">
        <li><span class="q">١</span> هل لديك هوية بصرية متكاملة للمشروع؟</li>
        <li><span class="q">٢</span> هل يمتلك فريق المبيعات أدوات عرض احترافية؟</li>
        <li><span class="q">٣</span> هل لديك فيلم ورندرات جاهزة للبيع؟</li>
        <li><span class="q">٤</span> هل يستطيع المستثمر فهم المشروع خلال أول خمس دقائق؟</li>
        <li><span class="q">٥</span> هل جميع مواد الإطلاق جاهزة قبل موعد الإطلاق؟</li>
      </ul>
      <div class="pl-assess-note pl-reveal">إذا كانت إجابتك <span>«لا»</span> على أكثر من سؤال… فقد يكون ProjectLaunch™ هو ما يحتاجه مشروعك.</div>
      <div class="pl-btn-row pl-reveal">${ctaBook()}</div>
    </div>
  </section>

  <!-- Lead form -->
  <section class="pl-form-sec" id="lead-form">
    <div class="pl-wrap">
      <div class="pl-urgency pl-reveal">
        <span class="ico material-symbols-outlined">schedule</span>
        <span>الجلسات المتاحة هذا الشهر: 4 جلسات فقط — احجز مكانك قبل اكتمالها</span>
      </div>
      <div class="pl-form-grid">
        <div class="pl-form-box pl-reveal">
          <h2 class="pl-h2">هل مشروعك جاهز فعلاً للإطلاق؟</h2>
          <p class="pl-body">أخبرنا عن مشروعك — جلسة التقييم مجانية بالكامل</p>
          <form class="pl-form" id="plLeadForm" novalidate>
            <div>
              <label for="pl-name">الاسم</label>
              <input id="pl-name" name="name" type="text" autocomplete="name" required placeholder="الاسم الكامل">
            </div>
            <div>
              <label for="pl-company">الشركة</label>
              <input id="pl-company" name="company" type="text" autocomplete="organization" required placeholder="اسم الشركة / الجهة">
            </div>
            <div>
              <label for="pl-phone">رقم الجوال</label>
              <input id="pl-phone" name="phone" type="tel" autocomplete="tel" required placeholder="05XXXXXXXX" dir="ltr">
            </div>
            <div>
              <label for="pl-email">البريد الإلكتروني</label>
              <input id="pl-email" name="email" type="email" autocomplete="email" required placeholder="name@company.com" dir="ltr">
            </div>
            <div>
              <label for="pl-type">نوع المشروع</label>
              <select id="pl-type" name="project_type" required>
                <option value="">اختر…</option>
                <option>سكني</option>
                <option>تجاري</option>
                <option>مختلط</option>
                <option>ضيافة / فندقي</option>
                <option>مؤسسي / معرض</option>
                <option>أخرى</option>
              </select>
            </div>
            <div>
              <label for="pl-city">مدينة المشروع</label>
              <input id="pl-city" name="city" type="text" required placeholder="الرياض، جدة، …">
            </div>
            <div class="pl-span-2 pl-form-feedback" id="plFormFeedback" aria-live="polite"></div>
            <div class="pl-span-2">
              <button class="pl-btn" type="submit" id="plSubmitBtn" data-cta="form-submit">${FORM_CTA} ←</button>
              <p class="pl-form-note">رد واضح خلال 24 ساعة — بدون التزام شراء في الجلسة الأولى</p>
            </div>
          </form>
        </div>
        <aside class="pl-reassure pl-reveal">
          <ul>
            <li>جلسة مجانية 100%</li>
            <li>بدون عقد أو التزام</li>
            <li>رد خلال 24 ساعة</li>
            <li>متاح للمشاريع في جميع مدن المملكة والخليج</li>
          </ul>
          <blockquote class="pl-quote">
            "قدّمت جرافيكس هاوس تجربة عالمية المستوى تعكس المكانة الرفيعة لرابطة العالم الإسلامي"
            <cite>— مسؤول رفيع، رابطة العالم الإسلامي</cite>
          </blockquote>
        </aside>
      </div>
    </div>
  </section>

</main>

<footer class="pl-foot">
  <div class="pl-wrap">
    <p class="pl-foot-brand">ProjectLaunch™ by Graphics House</p>
    <div class="pl-btn-row" style="justify-content:center">
      ${ctaBook()}
      ${ctaWa('واتساب')}
    </div>
    <p class="pl-foot-meta">
      <a href="tel:${PHONE}">${PHONE_DISPLAY}</a>
      &nbsp;|&nbsp;
      <a href="mailto:info@3dgraphicshouse.com">info@3dgraphicshouse.com</a>
    </p>
    <p class="pl-foot-copy">© 2026 Graphics House · جميع الحقوق محفوظة<br>
      <a href="../solutions/project-launch-en.html">English</a>
    </p>
  </div>
</footer>

<a class="pl-float-wa" href="${WA}" target="_blank" rel="noopener" aria-label="واتساب" data-cta="whatsapp">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
</a>
<a class="pl-float-book" id="plFloatBook" href="#lead-form" data-cta="book-session">${CTA}</a>
<div class="pl-sticky" id="plStickyCta">${ctaBook()}</div>

<script defer src="../assets/gh-performance.js?v=3"></script>
<script defer src="../assets/pl-lead-form.js?v=1"></script>
<script>
(function () {
  var v = document.getElementById('pl-hero-vid');
  if (v) {
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    v.removeAttribute('controls');
    function kick() {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    v.addEventListener('loadedmetadata', kick);
    kick();
    ['touchstart', 'scroll', 'click'].forEach(function (e) {
      document.addEventListener(e, kick, { passive: true, once: true });
    });
  }

  var nodes = document.querySelectorAll('.pl-reveal');
  if (!('IntersectionObserver' in window)) {
    nodes.forEach(function (n) { n.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  var sticky = document.getElementById('plStickyCta');
  var form = document.getElementById('lead-form');
  var floatBook = document.getElementById('plFloatBook');
  if (sticky && form && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        sticky.classList.toggle('is-hidden', e.isIntersecting);
      });
    }, { threshold: 0.12 }).observe(form);
  }
  function onScroll() {
    if (!floatBook) return;
    if (window.innerWidth <= 720) { floatBook.classList.remove('is-on'); return; }
    floatBook.classList.toggle('is-on', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
</script>
</body>
</html>
`;
}

const htmlMain = buildHtml({ pagePath: '/solutions/project-launch.html', noindex: false });
const htmlAds = buildHtml({ pagePath: '/solutions/project-launch-ads.html', noindex: true });

fs.writeFileSync(OUT_MAIN, htmlMain, 'utf8');
fs.writeFileSync(OUT_ADS, htmlAds, 'utf8');
console.log('Wrote solutions/project-launch.html + solutions/project-launch-ads.html (dark ad LP)');
