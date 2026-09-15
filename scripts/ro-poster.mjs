/**
 * The map's poster: one frame of the live scene, on transparency.
 *
 * It is what the section is before the 3D chunk arrives, what it stays without
 * WebGL or JavaScript, and what it stays for good under reduced motion -- that
 * map rocks, rises and fires light across a country, and there is no version of
 * it that holds still, so the honest reduced-motion answer is a picture.
 *
 * Taken at 2.8s: the plate is up, both beacons are lit, and the first arc has
 * not launched yet. A frozen arc would be motion pinned to the page.
 *
 * The background is not in the shot -- the ground and the glow are CSS and are
 * painted live behind it, so the poster drops onto the same room at any size
 * and the join never shows.
 *
 *   npm run build && npm run preview &   then   node scripts/ro-poster.mjs
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

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
// 1600x800: the stage shape exactly, so object-fit lines the poster up; the image is scaled down from there
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle' });

await page.addStyleTag({
  content: `
    html, body, .zone, .romap { background: transparent !important; }
    /* everything the page draws behind and over the plate stays out of the shot:
       the ground, the room light, the bed, the white front and the dither are
       all painted live around this picture at whatever size it lands on */
    .romap__light, .romap__bed, .romap__dawn, .romap__dither,
    .romap__labels, .romap__poster { visibility: hidden !important; }
    /* exactly the shape the stage has in the page, so object-fit lines the
       poster up with the live camera instead of scaling it by a few percent */
    .romap__stage { width: 1600px !important; max-width: none !important; height: 800px !important; aspect-ratio: auto !important; }
  `,
});
await page.evaluate(() => document.querySelector('[data-romap-stage]').scrollIntoView({ block: 'center' }));
await page.waitForSelector('.romap[data-ready]', { timeout: 60000 });
await page.waitForTimeout(2800);

const out = 'src/assets/photos/harta-smartino.png';
await page.locator('[data-romap-stage]').screenshot({ path: out, omitBackground: true });
console.log(`${out} scris:`, (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
await browser.close();
