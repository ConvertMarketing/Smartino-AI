import { prefersReducedMotion } from '../lib/motion';
import { INFRA_ICONS, morphD } from '../lib/infra-icons';

const reduced = prefersReducedMotion();

/* ---------------------------------------------------------------------------
 * Reveals
 *
 * One observer for the whole page. Elements unobserve themselves once shown:
 * a reveal is a one-way door, and re-animating on the way back up is the kind
 * of motion that reads as a tic.
 * ------------------------------------------------------------------------ */
function reveals(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-animate]');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.setAttribute('data-in', ''));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute('data-in', '');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );
  targets.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------------------
 * Leaving
 *
 * The tint is painted alongside a navigation that has already been allowed to
 * start. No preventDefault, so modified clicks keep their native behaviour and
 * nothing is ever delayed on the site's own conversion action.
 * ------------------------------------------------------------------------ */
function leaving(): void {
  const root = document.documentElement;
  const externals = document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]');
  const warmed = new Set<string>();

  for (const a of externals) {
    let origin: string;
    try {
      origin = new URL(a.href).origin;
    } catch {
      continue;
    }
    if (origin === location.origin) continue;

    a.addEventListener('pointerenter', () => {
      if (warmed.has(origin)) return;
      warmed.add(origin);
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      document.head.appendChild(link);
    });

    a.addEventListener('click', (e) => {
      // A modified click opens a tab and leaves this page visible; tinting it
      // would strand the user looking at a coloured screen.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      root.setAttribute('data-exiting', '');
    });
  }

  // Coming back through bfcache restores the DOM exactly as it was left,
  // tint included.
  window.addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted) root.removeAttribute('data-exiting');
  });
  window.addEventListener('pagehide', () => root.removeAttribute('data-exiting'));
}

/* ---------------------------------------------------------------------------
 * Live opening state
 *
 * Rendered only after hydration. The HTML ships the NEUTRAL hours string,
 * because the deploy workflow has no schedule trigger: any state baked at build
 * time would freeze at the last deploy and be indexed that way.
 *
 * On a public holiday the page says the hours are different rather than
 * computing a normal-day answer. Telling someone the shop is open when it is
 * not sends them driving to Tâncăbești for nothing.
 * ------------------------------------------------------------------------ */
const FIXED_HOLIDAYS = [
  '01-01', '01-02', '01-06', '01-07', '01-24',
  '05-01', '06-01', '08-15', '11-30', '12-01', '12-25', '12-26',
];
// TODO(client): movable feasts (Vinerea Mare, Paște, Rusalii) shift every year
// and are not hardcoded here rather than risk a wrong date. Confirm the store's
// actual holiday closures and add them as explicit dates.

function schedule(): void {
  const el = document.querySelector<HTMLElement>('[data-schedule]');
  if (!el) return;

  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    weekday: 'short',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (t: string): string => parts.find((p) => p.type === t)?.value ?? '';
  const md = `${get('month')}-${get('day')}`;
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const weekend = get('weekday') === 'Sat' || get('weekday') === 'Sun';

  if (FIXED_HOLIDAYS.includes(md)) {
    el.textContent = 'Program special de sărbători — sună înainte să vii';
    el.dataset.state = 'holiday';
    return;
  }

  const open = weekend ? 8 * 60 : 7 * 60;
  const close = weekend ? 21 * 60 : 22 * 60;
  const isOpen = minutes >= open && minutes < close;
  const hh = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  el.textContent = isOpen
    ? `Deschis acum · până la ${hh(close)}`
    : `Închis acum · deschide la ${hh(open)}`;
  el.dataset.state = isOpen ? 'open' : 'closed';
}

// data-js is already set by the inline head script; this marks the module as
// actually having run, which cancels that script's safety timeout.
/* ---------------------------------------------------------------------------
 * Count-ups
 *
 * The HTML always ships the FINAL value, so no-JS and reduced-motion simply
 * read it. With motion allowed, the number counts up once, on first sight.
 * ------------------------------------------------------------------------ */
function countUps(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length || reduced || !('IntersectionObserver' in window)) return;

  const run = (el: HTMLElement): void => {
    const target = parseInt(el.dataset.count!, 10);
    const suffix = el.dataset.suffix ?? '';
    let t0 = 0;
    const dur = 1200;
    const tick = (t: number): void => {
      if (!t0) t0 = t; // the clock starts at the first frame, not at the request
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ro-RO') + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        run(e.target as HTMLElement);
      }
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------------------
 * Scroll-linked motion: one shared rAF loop.
 *
 * - every band gets --p (0..1): where the viewport centre sits inside its
 *   section, driving the glowing position marker down the spine
 * - every [data-depth] gets --py: differential parallax, so the big panel
 *   numbers drift at a different rate than the page
 * ------------------------------------------------------------------------ */
function scrollFx(): void {
  if (reduced) return;
  const bands = [...document.querySelectorAll<HTMLElement>('.band')].map((el) => ({
    el,
    host: el.parentElement as HTMLElement,
  }));
  const deep = [...document.querySelectorAll<HTMLElement>('[data-depth]')].map((el) => ({
    el,
    host: (el.closest('section') ?? el.parentElement) as HTMLElement,
    d: parseFloat(el.dataset.depth ?? '0'),
  }));
  if (!bands.length && !deep.length) return;

  let ticking = false;
  let lastY = window.scrollY;
  let vel = 0;
  const root = document.documentElement;
  const update = (): void => {
    ticking = false;
    // shear from scroll velocity, decaying back to rest between events
    const y = window.scrollY;
    vel = Math.max(-8, Math.min(8, vel * 0.82 + (y - lastY) * 0.05));
    lastY = y;
    root.style.setProperty('--vel', vel.toFixed(2));
    if (Math.abs(vel) > 0.08 && !ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
    const centre = window.scrollY + window.innerHeight / 2;
    for (const b of bands) {
      const r = b.host.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const p = Math.min(1, Math.max(0, (centre - top) / r.height));
      b.el.style.setProperty('--p', p.toFixed(4));
    }
    for (const x of deep) {
      const r = x.host.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      x.el.style.setProperty('--py', (p * x.d).toFixed(1));
    }
  };
  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------------------------------------------------------------------------
 * Magnetic CTAs: within reach, the button leans toward the pointer.
 * ------------------------------------------------------------------------ */
function magnetics(): void {
  if (reduced || !matchMedia('(hover: hover)').matches) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-magnet]')) {
    el.style.transition = 'transform 200ms cubic-bezier(0.165, 0.84, 0.44, 1)';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  }
}

/* ---------------------------------------------------------------------------
 * The tilt: each hero card leans toward the pointer while the hand is on it.
 * Two custom properties, read by the card's own transform. Pointer-only --
 * touch and reduced motion never see it, and without it the card is simply a
 * card.
 * ------------------------------------------------------------------------ */
function tilt(): void {
  if (reduced || !matchMedia('(hover: hover)').matches) return;
  for (const card of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`);
      });
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  }
}

/* ---------------------------------------------------------------------------
 * The hero ground leans toward the pointer and drifts with the scroll. Two
 * numbers on the section, read by one transform; pointer-only for the lean,
 * and nothing at all under reduced motion.
 * ------------------------------------------------------------------------ */
function ground(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || reduced) return;
  let raf = 0;
  if (matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        hero.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--mx', '0');
      hero.style.setProperty('--my', '0');
    });
  }
  let sraf = 0;
  const onScroll = (): void => {
    if (sraf) return;
    sraf = requestAnimationFrame(() => {
      sraf = 0;
      hero.style.setProperty('--sy', String(Math.min(window.scrollY, window.innerHeight * 1.5) * 0.28));
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------------------------------------------------------------------
 * The maquette: three.js and the model are a separate chunk, fetched only once
 * the section is within a screen of the viewport. Until then -- and forever,
 * without WebGL -- the section is its pre-rendered poster and two links.
 * ------------------------------------------------------------------------ */
function maquette(): void {
  if (!('IntersectionObserver' in window)) return;
  // one observer per section: the page carries two scenes now, and each has to
  // wait for its own approach rather than for the first one's
  for (const section of document.querySelectorAll<HTMLElement>('[data-maquette]')) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        import('./maquette')
          .then((m) => m.mount(section))
          .catch(() => {
            /* the poster stays */
          });
      },
      { rootMargin: '100% 0px' }
    );
    io.observe(section);
  }
}

/* ---------------------------------------------------------------------------
 * The map of the two countries: the same deal as the maquette -- three.js and
 * 92 KB of outlines are a separate chunk, fetched only once the section is
 * within a screen. Under reduced motion it is never fetched at all: the whole
 * section is a lit plate that rocks, rises and fires light across a country,
 * and there is no version of that which stands still. The poster stays, and it
 * is a frame of the very same scene.
 * ------------------------------------------------------------------------ */
function roMap(): void {
  const section = document.querySelector<HTMLElement>('[data-romap]');
  if (!section || reduced || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      import('./romap')
        .then((m) => m.mount(section))
        .catch(() => {
          /* the poster stays */
        });
    },
    { rootMargin: '100% 0px' }
  );
  io.observe(section);
}

/* ---------------------------------------------------------------------------
 * The pinned rail
 *
 * A section that holds the screen while a short list is walked past. Two things
 * are written on the section and nothing else: --p, how far through the pin the
 * scroll has got, and data-step, which card is in front. The CSS does the belt.
 *
 * The one thing CSS cannot do here is the mark. It is a single object that
 * rides in the card it belongs to, lifts when the belt hands over, flies to the
 * next card and BENDS on the way -- every one of the six is drawn on the same
 * skeleton, so one shape can be interpolated into the next point by point
 * rather than swapped for it.
 *
 * It also writes data-live, which is what switches the section out of its
 * static layout -- so a page with no JavaScript, a failed chunk, or a reader
 * who asked for no motion gets the plain grid, never a half-built pin.
 * ------------------------------------------------------------------------ */
function rails(): void {
  if (reduced) return;
  for (const rail of document.querySelectorAll<HTMLElement>('[data-rail]')) {
    const cards = [...rail.querySelectorAll<HTMLElement>('[data-rail-step]')];
    const n = cards.length;
    if (!n) continue;
    rail.setAttribute('data-live', '');

    const ico = rail.querySelector<SVGSVGElement>('[data-rail-ico]');
    const paths = ico ? [...ico.querySelectorAll('path')] : [];
    const belt = ico?.parentElement ?? null;
    const ghosts = cards.map((c) => c.querySelector<HTMLElement>('[data-rail-ghost]'));
    const aimable = !!ico && !!belt && n > 1 && ghosts.every((g) => g !== null);

    /* The mark is not aimed at a model of the belt any more -- it is aimed at
     * the belt. Every card keeps a ghost of its own mark, and wherever that
     * ghost has ended up on screen, after the lean and the lift and the
     * perspective its card is under, is exactly where the mark has to be. So
     * read it. Two rects a frame, and nothing in here has to agree with a
     * number in the stylesheet: the lean, the lens and the push toward the
     * viewer can all be retuned over there without moving the mark off its
     * ghost over here, which is what went wrong the last time they were. */
    let size = 0;
    const measure = (): void => {
      const g = ghosts[0];
      // computed, not offsetWidth: the slot is a vh size and lands on a half
      // pixel, and offsetWidth rounds it away
      size = g ? parseFloat(getComputedStyle(g).width) || g.offsetWidth : 0;
    };

    /* Held, thrown, held: the mark stands still for the first third of a
     * hand-over and the last seventh of it, and crosses in between. */
    const ease = (x: number): number => x * x * (3 - 2 * x);
    const flight = (f: number): number =>
      f <= 0.3 ? 0 : f >= 0.86 ? 1 : ease((f - 0.3) / 0.56);

    /** Where card j's ghost is this frame, in the mark's own coordinates. */
    const place = (j: number, o: DOMRect): { x: number; y: number; s: number } => {
      const r = ghosts[j]!.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - o.left,
        y: r.top + r.height / 2 - o.top,
        /* height, not width: a card turning on its vertical axis loses width
           and keeps height, so height carries the perspective and nothing
           else -- which is the one thing the mark should copy. */
        s: size > 0 ? r.height / size : 1,
      };
    };

    let raf = 0;
    const update = (): void => {
      raf = 0;
      const r = rail.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / travel));
      rail.style.setProperty('--p', p.toFixed(4));
      rail.dataset.step = String(Math.min(n - 1, Math.round(p * (n - 1))));

      if (!aimable || !size) return;
      /* read after the write above on purpose: the cards have to be where this
         frame puts them before the mark is told where to land, or it trails
         them by a frame on every flick of the wheel */
      const origin = belt!.getBoundingClientRect();
      const t = p * (n - 1);
      const i = Math.min(n - 2, Math.floor(t));
      const e = flight(Math.min(1, Math.max(0, t - i)));
      const lift = Math.sin(e * Math.PI);
      const a = place(i, origin);
      const b = place(i + 1, origin);
      const half = size / 2;
      const x = a.x + (b.x - a.x) * e - half;
      const y = a.y + (b.y - a.y) * e - lift * 52 - half;
      const s = (a.s + (b.s - a.s) * e) * (1 + lift * 0.14);
      ico.style.transform =
        `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)` +
        ` rotate(${(lift * 18).toFixed(1)}deg) scale(${s.toFixed(4)})`;
      // the shape bends across the same crossing, so it lands already changed
      for (let k = 0; k < paths.length; k++) {
        paths[k].setAttribute('d', morphD(INFRA_ICONS[i][k], INFRA_ICONS[i + 1][k], e));
      }
    };

    const onScroll = (): void => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = (): void => {
      measure();
      onScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onResize();
    /* Measure again once the display face has landed. One of the six names is
     * long enough to take a second line in it and not in the fallback, and the
     * card that happens to is the one whose slot then sits a line higher --
     * so without this the mark flies to where that slot used to be. */
    void document.fonts?.ready.then(onResize);
  }
}

/* ---------------------------------------------------------------------------
 * "Deschis acum"
 *
 * The one line on the page that answers a question about this minute. It is
 * computed in the reader's browser, against Bucharest time rather than their
 * own clock, and the element ships hidden: without JavaScript the page says
 * nothing about whether the door is open instead of saying something wrong.
 * ------------------------------------------------------------------------ */
function openNow(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-open-now]')) tellHours(el);
}

function tellHours(el: HTMLElement): void {
  let spec: { dow: number[]; open: string; close: string }[];
  try {
    spec = JSON.parse(el.dataset.hours ?? '[]');
  } catch {
    return;
  }
  if (!spec.length) return;

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const read = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(read('weekday'));
  if (day < 0) return;

  const today = spec.find((s) => s.dow.includes(day));
  if (!today) return;

  const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const now = Number(read('hour')) * 60 + Number(read('minute'));
  const open = now >= minutes(today.open) && now < minutes(today.close);

  el.textContent = open ? `Deschis acum, până la ${today.close}` : `Închis acum, deschide la ${today.open}`;
  el.dataset.state = open ? 'open' : 'closed';
  el.hidden = false;
}

document.documentElement.setAttribute('data-ready', '');
tilt();
ground();
maquette();
roMap();
rails();
openNow();
reveals();
countUps();
scrollFx();
magnetics();
leaving();
schedule();
