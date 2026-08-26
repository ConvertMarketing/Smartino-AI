import { MOTION, prefersReducedMotion } from '../lib/motion';

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
    const t0 = performance.now();
    const dur = 1200;
    const tick = (t: number): void => {
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
 * The story stepper: each chapter, as it crosses mid-viewport, tells the
 * pinned visual which plate answers it.
 * ------------------------------------------------------------------------ */
function story(): void {
  const section = document.querySelector<HTMLElement>('[data-story]');
  if (!section || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        section.dataset.step = (e.target as HTMLElement).dataset.step;
      }
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  section.querySelectorAll<HTMLElement>('.story__step').forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------------------
 * The carousel: four store cards on a real CSS 3D ring.
 *
 * The ring itself is pure CSS (rotateY · translateZ); this drives exactly one
 * number, --rot, and one attribute, data-active. It turns by itself every few
 * seconds, yields to any human signal -- hover, focus inside, a drag -- and
 * snaps to the nearest quarter when the hand lets go. Keyboard focus brings
 * the focused card to the front by the short way round, so tabbing through
 * the four links is itself a tour of the group.
 *
 * The entry spin owns the stage's transition first; stepping (data-live) and
 * dragging (data-drag) only take over once it has landed or been cancelled.
 * Under reduced motion the ring never moves on its own and every jump is
 * instant, but the buttons, the drag and the focus behaviour all still work.
 * ------------------------------------------------------------------------ */
function carousel(): void {
  const car = document.querySelector<HTMLElement>('[data-carousel]');
  const stage = car?.querySelector<HTMLElement>('.car__stage');
  const persp = car?.querySelector<HTMLElement>('.car__persp');
  if (!car || !stage || !persp) return;

  const cards = car.querySelectorAll<HTMLAnchorElement>('.car__card');
  const step = 360 / cards.length;
  let rot = 0;
  let live = reduced;
  let auto: number | undefined;
  let dragged = false;

  const apply = (): void => {
    stage.style.setProperty('--rot', `${rot}deg`);
    car.dataset.active = String(((Math.round(-rot / step) % cards.length) + cards.length) % cards.length);
  };

  const go = (dir: number): void => {
    rot -= dir * step;
    apply();
  };

  const halt = (): void => window.clearInterval(auto);
  const rest = (): void => {
    halt();
    if (reduced || !live || car.hasAttribute('data-drag')) return;
    auto = window.setInterval(() => go(1), MOTION.carousel);
  };

  const armed = (): void => {
    if (live) return;
    live = true;
    car.setAttribute('data-live', '');
    rest();
  };
  if (!reduced) {
    const done = (e: TransitionEvent): void => {
      if (e.target === stage && e.propertyName === 'transform') armed();
    };
    stage.addEventListener('transitionend', done);
    stage.addEventListener('transitioncancel', done);
    // If the entry never fires (stage off-screen, tab in background), the
    // ring still has to come alive eventually.
    window.setTimeout(armed, 2400);
  }

  // Any human presence silences the self-turning; it resumes on leave.
  car.addEventListener('pointerenter', halt);
  car.addEventListener('pointerleave', rest);
  car.addEventListener('focusin', halt);
  car.addEventListener('focusout', (e) => {
    if (!car.contains(e.relatedTarget as Node)) rest();
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? halt() : rest()));

  car.querySelector('.car__prev')?.addEventListener('click', () => go(-1));
  car.querySelector('.car__next')?.addEventListener('click', () => go(1));

  cards.forEach((card, i) => {
    card.addEventListener('focusin', () => {
      const front = -i * step;
      rot = front + Math.round((rot - front) / 360) * 360;
      apply();
    });
  });

  // The drag: pointer capture on the perspective box, degrees per pixel.
  let x0 = 0;
  let r0 = 0;
  persp.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    halt();
    x0 = e.clientX;
    r0 = rot;
    dragged = false;
    persp.setPointerCapture(e.pointerId);
    car.setAttribute('data-drag', '');
  });
  persp.addEventListener('pointermove', (e) => {
    if (!persp.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 6) dragged = true;
    rot = r0 + dx * 0.35;
    apply();
  });
  const drop = (e: PointerEvent): void => {
    if (!persp.hasPointerCapture(e.pointerId)) return;
    persp.releasePointerCapture(e.pointerId);
    car.removeAttribute('data-drag');
    rot = Math.round(rot / step) * step;
    apply();
    rest();
  };
  persp.addEventListener('pointerup', drop);
  persp.addEventListener('pointercancel', drop);

  // A drag that ends on a card must not follow the link under it, and the
  // native image drag would steal the pointer mid-gesture.
  persp.addEventListener(
    'click',
    (e) => {
      if (!dragged) return;
      e.preventDefault();
      e.stopPropagation();
    },
    true
  );
  persp.addEventListener('dragstart', (e) => e.preventDefault());
}

/* ---------------------------------------------------------------------------
 * The index chips: a floating image follows the pointer along the giant list.
 * Pointer-only -- touch and reduced motion never see it.
 * ------------------------------------------------------------------------ */
function chips(): void {
  if (reduced || !matchMedia('(hover: hover)').matches) return;
  const list = document.querySelector<HTMLElement>('[data-chips]');
  if (!list) return;
  let raf = 0;
  list.addEventListener('pointermove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      list.style.setProperty('--cx', `${e.clientX}px`);
      list.style.setProperty('--cy', `${e.clientY}px`);
    });
  });
}

document.documentElement.setAttribute('data-ready', '');
story();
carousel();
chips();
reveals();
countUps();
scrollFx();
magnetics();
leaving();
schedule();
