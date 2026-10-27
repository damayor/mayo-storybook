// Renders the Berlin fly-through background to a scroll-scrubbable MP4 (+ WebM + poster).
//
// Usage:  pnpm dev            (in another terminal)
//         pnpm render:bg      [--width 720 --height 1280 --fps 24 --duration 24 --url http://localhost:5173]
//
// Output: public/assets/video/bg-mobile.mp4 / .webm / bg-mobile-poster.jpg
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const width = +arg('width', 720);
const height = +arg('height', 1280);
const fps = +arg('fps', 24);
const duration = +arg('duration', 24); // must match SEQUENCE_DURATION in CameraPath.tsx
const crf = arg('crf', 28);
const gop = arg('gop', 1); // 1 = every frame is a keyframe (best scrub, biggest file)
const base = arg('url', 'http://localhost:5173');
const outDir = 'public/assets/video';
const framesDir = join(process.env.TMPDIR ?? '/tmp', 'bg-frames');

rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

// GPU by default (WSL2: Mesa d3d12 → NVIDIA via ANGLE/GL, ~10x faster than SwiftShader).
// Pass --software to force CPU rendering.
const software = process.argv.includes('--software');
const browser = await chromium.launch({
  args: software
    ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
    : ['--use-gl=angle', '--use-angle=gl', '--ignore-gpu-blocklist', '--enable-gpu'],
  env: software
    ? process.env
    : {
        ...process.env,
        GALLIUM_DRIVER: 'd3d12',
        MESA_LOADER_DRIVER_OVERRIDE: 'd3d12',
        LD_LIBRARY_PATH: `/usr/lib/wsl/lib:${process.env.LD_LIBRARY_PATH ?? ''}`,
      },
});
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const renderer = await page.evaluate(() => {
  const gl = document.createElement('canvas').getContext('webgl2');
  return gl?.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
});
console.log('Renderer:', renderer);
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(`${base}/render-bg.html`);
console.log('Loading point clouds…');
await page.waitForFunction(() => window.__bgReady === true, null, { timeout: 300_000 });

const total = Math.round(duration * fps);
for (let i = 0; i < total; i++) {
  const t = Math.min(duration, i / fps);
  await page.evaluate(
    (t) =>
      new Promise((resolve) => {
        window.__bgSetTime(t);
        // two rAFs so r3f renders the new position before we capture
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    t
  );
  await page.screenshot({
    path: join(framesDir, `f_${String(i).padStart(4, '0')}.jpg`),
    type: 'jpeg',
    quality: 95,
  });
  if (i % 24 === 0) console.log(`frame ${i}/${total}`);
}
await browser.close();

const ffmpeg = (args) =>
  new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
    p.on('exit', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exit ${c}`))));
  });
const input = ['-framerate', String(fps), '-i', join(framesDir, 'f_%04d.jpg')];

// All-intra (-g 1): every frame is a keyframe, so currentTime scrubbing is instant on iOS/Android.
await ffmpeg([
  ...input,
  '-c:v',
  'libx264',
  '-g',
  '1',
  '-crf',
  '26',
  '-preset',
  'slow',
  '-pix_fmt',
  'yuv420p',
  '-an',
  '-movflags',
  '+faststart',
  join(outDir, 'bg-mobile.mp4'),
]);
// WebM is optional (it came out ~2.5x bigger than the MP4): pass --webm to generate it.
if (process.argv.includes('--webm')) {
  await ffmpeg([
    ...input,
    '-c:v',
    'libvpx-vp9',
    '-g',
    '1',
    '-crf',
    '38',
    '-b:v',
    '0',
    '-an',
    join(outDir, 'bg-mobile.webm'),
  ]);
}
await ffmpeg([...input, '-frames:v', '1', join(outDir, 'bg-mobile-poster.jpg')]);

rmSync(framesDir, { recursive: true, force: true });
console.log(`Done → ${outDir}`);
