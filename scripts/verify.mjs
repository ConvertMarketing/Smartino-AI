/**
 * Whole-page verification against a running preview.
 *
 * This exists because a released build shipped a zone-2 layout that collapsed
 * on every breakpoint: two `style` attributes on one element meant HTML kept
 * only the first, the measurement custom properties were dropped, and an
 * absolutely-positioned block landed on top of the section heading.
 *
 * Nothing in the checks at the time could see it. Contrast and horizontal
 * overflow were both clean, and the only visual proof was a full-page
 * screenshot scaled down far enough to hide it. So the rule here is: assert
 * geometry, not just colour and width.
 *
 *   npm run build && npm run preview &   then   node scripts/verify.mjs
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const URL = process.env.VERIFY_URL ?? 'http://localhost:4321/Smartino-AI/';
/**
 * Resolve a Chromium binary wherever this happens to run.
 *
 * A hardcoded path worked locally and failed on the CI runner, which installs
 * browsers into a different root -- so the gate that was meant to catch layout
 * regressions became the thing that blocked the deploy.
 */
function findChromium() {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    '/opt/pw-browsers',
    path.join(os.homedir(), '.cache', 'ms-playwright'),
    path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright'),
  ].filter(Boolean);

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      if (!/^chromium/.test(dir)) continue;
      for (const rel of [
        // Chrome-for-Testing layout (playwright >= 1.6x downloads)
        'chrome-linux64/chrome',
        'chrome-headless-shell-linux64/chrome-headless-shell',
        // older playwright build layout (the /opt/pw-browsers preinstall)
        'chrome-linux/chrome',
        'chrome-linux/headless_shell',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
      ]) {
        const candidate = path.join(root, dir, rel);
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }
  throw new Error(
    'Chromium negasit. Cauta in: ' + roots.join(', ') +
    '. Ruleaza `npx playwright install chromium` sau seteaza CHROMIUM.'
  );
}

const EXE = findChromium();
const VIEWPORTS = [
  ['390', 390, 844],
  ['768', 768, 1024],
  ['1024', 1024, 900],
  ['1440', 1440, 900],
];

const failures = [];
const record = (ok, label, detail = '') => {
  if (!ok) failures.push(label + (detail ? ` — ${detail}` : ''));
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? `  — ${detail}` : ''}`);
};

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });

/* -- Duplicate attributes -------------------------------------------------
 * The failure that started this file. A second style attribute is silently
 * discarded by every parser, so the values simply vanish. */
{
  const p = await browser.newPage();
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  const html = await p.content();
  const dupes = [...html.matchAll(/<[a-z0-9]+[^>]*\bstyle=("[^"]*"|'[^']*')[^>]*\bstyle=/gi)];
  record(dupes.length === 0, 'niciun element cu atribut style duplicat', `${dupes.length} gasite`);
  await p.close();
}

for (const [label, width, height] of VIEWPORTS) {
  console.log(`\n[${label}px]`);
  const page = await browser.newPage({ viewport: { width, height } });
  // The entrance curtain plays once per tab and locks scroll while it runs;
  // geometry checks skip it (it has its own dedicated behaviour test).
  await page.addInitScript(() => sessionStorage.setItem('smartino-intro', '1'));
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  page.on('requestfailed', (r) => consoleErrors.push(`request: ${r.url()}`));
  await page.goto(URL, { waitUntil: 'networkidle' });
  // Reveal everything: a check that only sees what happens to be on screen is
  // not a check. Then wait for the longest entry transition (staggered word
  // masks, the hero ring's spin-up) to land, so geometry is measured at rest
  // rather than mid-flight.
  await page.evaluate(() =>
    document.querySelectorAll('[data-reveal], [data-animate]').forEach((e) => e.setAttribute('data-in', '')));
  await page.waitForTimeout(2600);

  const m = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;

    // Overlap: leaf text boxes only, since a parent legitimately contains its
    // children. aria-hidden decoration is exempt -- the response mechanism is
    // specified to sit in the band.
    const leaves = [...document.querySelectorAll('h1,h2,h3,p,li,td,th,span,dt,dd,a,caption,address,figcaption')]
      .filter((e) => {
        if (!e.textContent.trim()) return false;
        if ([...e.children].some((c) => c.textContent.trim())) return false;
        if (e.closest('[aria-hidden="true"]')) return false;
        // Closed-details content keeps real layout boxes in modern Chromium
        // (hidden via the ::details-content pseudo's content-visibility, which
        // children's own computed style does not reflect) -- it never paints,
        // so it cannot overlap anything a person sees.
        const det = e.closest('details:not([open])');
        if (det && !e.closest('summary')) return false;
        const cs = getComputedStyle(e);
        if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return false;
        const r = e.getBoundingClientRect();
        return r.width > 2 && r.height > 2;
      });
    const boxes = leaves.map((e) => {
      const r = e.getBoundingClientRect();
      return { l: r.left, t: r.top + scrollY, r: r.right, b: r.bottom + scrollY, e, ring: e.closest('[data-3d]') };
    });
    const overlaps = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const A = boxes[i], B = boxes[j];
        if (A.e.contains(B.e) || B.e.contains(A.e)) continue;
        // Cards on the same 3D ring project onto overlapping 2D rects by
        // design; depth separates them, which flat geometry cannot see.
        if (A.ring && A.ring === B.ring) continue;
        const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l);
        const oy = Math.min(A.b, B.b) - Math.max(A.t, B.t);
        if (ox <= 2 || oy <= 2) continue;
        const smaller = Math.min((A.r - A.l) * (A.b - A.t), (B.r - B.l) * (B.b - B.t));
        if ((ox * oy) / smaller < 0.12) continue;
        overlaps.push(`"${A.e.textContent.trim().slice(0, 24)}" x "${B.e.textContent.trim().slice(0, 24)}"`);
      }
    }

    // Zero-height containers whose children are positioned against them: the
    // exact shape of the original bug.
    const collapsed = [...document.querySelectorAll('*')]
      .filter((e) => {
        if (e.getBoundingClientRect().height > 0) return false;
        return [...e.children].some((c) => {
          const pos = getComputedStyle(c).position;
          return pos === 'absolute' && c.getBoundingClientRect().height > 0;
        });
      })
      .map((e) => e.className || e.tagName);

    // Contrast on solid grounds; gradient-backed text is checked separately.
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const toRGB = (css) => {
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
    const ratio = (a, b) => {
      const x = L(a), y = L(b), hi = Math.max(x, y), lo = Math.min(x, y);
      return (hi + 0.05) / (lo + 0.05);
    };
    const rgba = (css) => { const n = css.match(/[\d.]+/g); if (!n) return null;
      const [r, g, b, a] = n.map(Number); return [r, g, b, a === undefined ? 1 : a]; };
    const over = (fg, bg) => fg.map((c, i) => Math.round(c * fg[3] + bg[i] * (1 - fg[3])));
    const bgOf = (el) => {
      const layers = []; let n = el, gradient = false;
      while (n) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') gradient = true;
        const c = rgba(cs.backgroundColor);
        if (c && c[3] > 0) { layers.push(c); if (c[3] === 1) break; }
        n = n.parentElement;
      }
      let base = [255, 255, 255];
      for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
      return { rgb: base.slice(0, 3), gradient };
    };
    const lowContrast = [];
    for (const el of leaves) {
      const bg = bgOf(el);
      if (bg.gradient) continue;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && (parseInt(cs.fontWeight) || 400) >= 700);
      const min = large ? 3 : 4.5;
      const r = ratio(toRGB(cs.color), bg.rgb);
      if (r < min) lowContrast.push(`${r.toFixed(2)}:1 (min ${min}) "${el.textContent.trim().slice(0, 24)}"`);
    }

    const text = document.body.innerText;
    return {
      overflow, overlaps, collapsed, lowContrast,
      cedillas: (text.match(/[şţŞŢ]/g) ?? []).length,
      commaBelow: (text.match(/[șțȘȚ]/g) ?? []).length,
    };
  });

  record(m.overflow === 0, 'zero overflow orizontal', `${m.overflow}px`);
  record(m.overlaps.length === 0, 'niciun text suprapus', m.overlaps.slice(0, 4).join(' | '));
  record(m.collapsed.length === 0, 'niciun container colapsat cu copii absoluti', m.collapsed.slice(0, 3).join(' | '));
  record(m.lowContrast.length === 0, 'contrast AA pe fundal solid', m.lowContrast.slice(0, 4).join(' | '));
  record(m.cedillas === 0 && m.commaBelow > 0, 'diacritice cu virgula, zero sedile', `${m.commaBelow} / ${m.cedillas}`);
  record(consoleErrors.length === 0, 'zero erori de consola', consoleErrors.slice(0, 2).join(' | '));
  await page.close();
}

/* -- Rendered contrast -----------------------------------------------------
 * The composited-ancestors check above walks background COLOURS up the tree.
 * It is blind to a decorative layer that sits behind text without being its
 * ancestor: the hero's pools of turquoise light, the maquette's live 3D
 * render under its heading. Brightening either could sink a line of text and
 * every earlier check would still pass.
 *
 * So this pass measures the pixels that were actually behind each line: it
 * makes the glyphs transparent (layout untouched), photographs the section,
 * and takes the worst contrast across a grid of samples inside every text
 * box. Sampled at four moments, because the light moves.
 */
async function renderedContrast(page, sectionSel, label) {
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), sectionSel);
  await page.waitForTimeout(1200);

  const count = await page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return 0;
    const leaves = [...root.querySelectorAll('h1,h2,h3,p,li,span,a,dt,dd,address,figcaption')].filter((e) => {
      if (!e.textContent.trim()) return false;
      if ([...e.children].some((c) => c.textContent.trim())) return false;
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.5) return false;
      const r = e.getBoundingClientRect();
      return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight;
    });
    // the ink each line is painted with, recorded BEFORE the glyphs are made
    // transparent -- read afterwards it would be rgba(0,0,0,0) and every line
    // would measure as black against black
    leaves.forEach((e) => {
      e.setAttribute('data-rc', '');
      e.setAttribute('data-rc-ink', getComputedStyle(e).color);
    });
    return leaves.length;
  }, sectionSel);
  if (!count) return [];

  // glyphs off, boxes untouched -- including text painted through
  // background-clip, which a plain transparent colour would leave visible
  await page.addStyleTag({
    content: `[data-rc]{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}
              [data-rc][data-rc-clip]{background-image:none!important}`,
  });
  await page.evaluate(() => {
    for (const e of document.querySelectorAll('[data-rc]')) {
      const cs = getComputedStyle(e);
      if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') e.setAttribute('data-rc-clip', '');
    }
  });

  const worst = new Map();
  for (let frame = 0; frame < 4; frame++) {
    const b64 = (await page.screenshot()).toString('base64');
    const found = await page.evaluate(async (png) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + png;
      await img.decode();
      const cv = document.createElement('canvas');
      cv.width = img.width;
      cv.height = img.height;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const k = img.width / innerWidth;
      const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
      const ratio = (a, b) => { const x = L(a), y = L(b), hi = Math.max(x, y), lo = Math.min(x, y); return (hi + 0.05) / (lo + 0.05); };
      const parse = (css) => { const n = (css.match(/[\d.]+/g) ?? []).map(Number); return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0]; };

      // The glyph runs, not the element box: a rounded pill's corners are
      // transparent and a paragraph's last line ends early, so sampling the
      // box reads the photo behind the padding and calls it a failure.
      const runs = (el) => {
        const rg = document.createRange();
        rg.selectNodeContents(el);
        return [...rg.getClientRects()].filter((r) => r.width > 3 && r.height > 3);
      };

      const out = [];
      for (const el of document.querySelectorAll('[data-rc]')) {
        const r = el.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= innerHeight) continue;
        const cs = getComputedStyle(el);
        // the ink the glyphs are painted with: the element's own colour, or
        // the mid stop of the gradient when the text is painted through one
        // text painted through a gradient keeps its plain colour as the base
        // stop, and the gradient only ever brightens it, so the base is the
        // honest worst case
        const ink = parse(el.dataset.rcInk || cs.color);
        const size = parseFloat(cs.fontSize);
        const large = size >= 24 || (size >= 18.66 && (parseInt(cs.fontWeight) || 400) >= 700);
        let low = Infinity;
        for (const run of runs(el)) {
          // inset, so a sample never lands on the very edge of a glyph run
          const x0 = run.left + run.width * 0.12;
          const w = run.width * 0.76;
          const y0 = run.top + run.height * 0.2;
          const h = run.height * 0.6;
          for (let gx = 0; gx <= 8; gx++) {
            for (let gy = 0; gy <= 2; gy++) {
              const yy = y0 + (h * gy) / 2;
              if (yy < 0 || yy >= innerHeight) continue;
              const x = Math.round((x0 + (w * gx) / 8) * k);
              const y = Math.round(yy * k);
              if (x < 0 || y < 0 || x >= img.width || y >= img.height) continue;
              const d = ctx.getImageData(x, y, 1, 1).data;
              low = Math.min(low, ratio(ink, [d[0], d[1], d[2]]));
            }
          }
        }
        if (low < Infinity) out.push({ text: el.textContent.trim().slice(0, 22), min: +low.toFixed(2), need: large ? 3 : 4.5 });
      }
      return out;
    }, b64);
    for (const f of found) {
      const prev = worst.get(f.text);
      if (!prev || f.min < prev.min) worst.set(f.text, f);
    }
    if (frame < 3) await page.waitForTimeout(2200);
  }

  const bad = [...worst.values()].filter((f) => f.min < f.need);
  record(bad.length === 0, `contrast pe fundalul randat (${label})`,
    bad.length ? bad.slice(0, 4).map((f) => `${f.min}:1 <${f.need} "${f.text}"`).join(' | ')
               : `${worst.size} linii, minim ${Math.min(...[...worst.values()].map((f) => f.min)).toFixed(2)}:1`);
  return bad;
}

console.log('\n[contrast pe fundal randat]');
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal], [data-animate]').forEach((e) => e.setAttribute('data-in', '')));
  await page.waitForTimeout(2600);
  await renderedContrast(page, '.hero', `hero ${w}px`);
  await page.close();
}

/* -- Degradations --------------------------------------------------------- */
console.log('\n[degradari]');
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.goto(URL, { waitUntil: 'networkidle' });
  const hidden = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.5).length);
  record(hidden === 0, 'reduced-motion: nimic nu ramane ascuns', `${hidden} ascunse`);
  await p.close();
}
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  const hidden = await p.locator('[data-reveal]').evaluateAll((els) =>
    els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.5).length);
  record(hidden === 0, 'fara JS: tot continutul e vizibil', `${hidden} ascunse`);
  await ctx.close();
}

await browser.close();
console.log(`\n${failures.length ? `${failures.length} ESUATE:\n  - ${failures.join('\n  - ')}` : 'toate verificarile trec'}`);
process.exit(failures.length ? 1 : 0);
