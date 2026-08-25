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
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
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
 * The response
 *
 * Activating one of the two physical units makes the other answer across the
 * gap. This is the signature, and it is the only place on the page where one
 * element's state changes another's.
 *
 * Pointer, keyboard and touch all drive the same state. On touch there is no
 * hover, so the first tap activates and the link still fires -- the response is
 * a side effect of navigating, never a gate in front of it.
 * ------------------------------------------------------------------------ */
function response(): void {
  const rows = document.querySelector<HTMLElement>('[data-rows]');
  if (!rows) return;

  const cards = rows.querySelectorAll<HTMLElement>('[data-unit]');
  let timer: number | undefined;

  const activate = (unit: string): void => {
    if (rows.dataset.active === unit) return;
    window.clearTimeout(timer);
    rows.dataset.active = unit;
    // The rule crosses, then the responding edge lands. Under reduced motion
    // both are instant and this timeout is simply zero.
    timer = window.setTimeout(
      () => rows.setAttribute('data-landed', ''),
      reduced ? 0 : MOTION.micro
    );
  };

  const clear = (): void => {
    window.clearTimeout(timer);
    delete rows.dataset.active;
    rows.removeAttribute('data-landed');
  };

  for (const card of cards) {
    const unit = card.dataset.unit!;
    card.addEventListener('pointerenter', () => activate(unit));
    card.addEventListener('focusin', () => activate(unit));
    card.addEventListener('touchstart', () => activate(unit), { passive: true });
  }
  rows.addEventListener('pointerleave', clear);
  rows.addEventListener('focusout', (e) => {
    if (!rows.contains(e.relatedTarget as Node)) clear();
  });
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
document.documentElement.setAttribute('data-ready', '');
reveals();
response();
leaving();
schedule();
