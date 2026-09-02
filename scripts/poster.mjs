/**
 * The maquette's poster: rendered from the live scene, not drawn by hand.
 *
 * Whoever has no WebGL, no JavaScript, or a slow connection sees this image
 * where the model would be, with the two labels at the very positions the
 * scene projects them to at the start of the flight. So the poster is taken
 * from the scene itself, under reduced motion (no intro, no drift, progress
 * zero), and the label positions are written next to it for the component to
 * inline. Re-run after any change to the model, the camera path or the copy.
 *
 *   npm run build && npm run preview &   then   node scripts/poster.mjs
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const URL = process.env.VERIFY_URL ?? 'http://localhost:4321/Smartino-AI/';

function findChromium() {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers', path.join(os.homedir(), '.cache', 'ms-playwright')].filter(Boolean);
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      if (!/^chromium/.test(dir)) continue;
      for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const c = path.join(root, dir, rel);
        if (fs.existsSync(c)) return c;
      }
    }
  }
  throw new Error('Chromium negasit; seteaza CHROMIUM.');
}

const browser = await chromium.launch({ executablePath: findChromium(), args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('[data-maquette]').scrollIntoView({ block: 'start' }));
await page.waitForSelector('[data-maquette][data-ready]', { timeout: 60000 });
// a few frames for the shadow map and the labels to settle, and the poster to fade
await page.waitForTimeout(1500);

const pins = await page.evaluate(() => {
  const host = document.querySelector('[data-mq-canvas]');
  const out = {};
  for (const el of document.querySelectorAll('[data-pin]')) {
    out[el.dataset.pin] = {
      x: +((parseFloat(el.style.left) / host.clientWidth) * 100).toFixed(2),
      y: +((parseFloat(el.style.top) / host.clientHeight) * 100).toFixed(2),
    };
  }
  return out;
});

// Only the model goes into the poster: the words, labels and hint are real
// DOM layered on top of it, and would otherwise appear twice.
await page.addStyleTag({ content: '.mq__copy, .mq__pin, .mq__hint { visibility: hidden !important; }' });
await page.waitForTimeout(200);
await page.locator('[data-mq-canvas]').screenshot({ path: 'src/assets/photos/snagov-plaza-macheta.png' });
fs.writeFileSync('src/data/maquette-pins.json', JSON.stringify(pins, null, 2) + '\n');
await browser.close();
console.log('poster scris; etichete:', JSON.stringify(pins));
