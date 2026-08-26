/**
 * The motion system, defined once.
 *
 * Inconsistent timing is the single thing that most reliably makes a site feel
 * cheap, so every animated property on this page draws from these values and
 * nothing invents its own.
 *
 * Mirrored as custom properties in global.css; this module is the source of
 * truth for anything JavaScript needs to time.
 *
 * There is no animation library. GSAP + ScrollTrigger + Lenis measured 50.625
 * bytes gzipped in this repo -- 33% of the whole 150 KB budget -- to move a
 * handful of properties an IntersectionObserver and CSS transitions already do.
 * Lenis went for a second reason: hijacked scrolling is the most aggressive
 * vestibular offender a page can ship, and not shipping it removes the problem
 * by construction rather than by media query.
 */
export const MOTION = {
  /** Entrances. One dominant curve for everything that arrives. */
  easeOut: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  /** State changes that go and come back. */
  easeInOut: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

  /** Micro-interactions: the response rule crossing the gap. */
  micro: 220,
  /** Reveals on scroll. */
  reveal: 900,
  /** Page-level state, e.g. the ambient tint following the active unit. */
  state: 400,
  /** The exit tint. Runs ALONGSIDE a navigation that has already started, so
   *  it must never be long enough to be perceived as a delay. */
  exit: 160,
  /** Between staggered siblings. */
  stagger: 70,
  /** The hero ring's own tempo between self-advances. */
  carousel: 4500,
} as const;

/** Honoured everywhere. Not a nice-to-have. */
export const prefersReducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
