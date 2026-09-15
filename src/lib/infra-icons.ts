/**
 * The six marks of the infrastructure section, drawn on one skeleton.
 *
 * Every icon is three strokes of five points, in the same order and with the
 * same meaning: the first is the body, the second the movement, the third the
 * detail. That is what makes them morphable -- point i of stroke k in one icon
 * has a partner in every other icon, so the shape can be interpolated instead
 * of swapped, and the mark that flies between two cards is the same object
 * changing rather than two objects trading places.
 *
 * The constraint is the price of the effect: a five-point polyline cannot draw
 * a true circle, so the marks are angular. Where a shape needs fewer than five
 * points the last one is repeated -- a zero-length segment draws nothing and
 * still gives the morph a partner.
 *
 * They are decoration. None of them says anything the word under it does not.
 */
export type Stroke = readonly (readonly [number, number])[];
export type Icon = readonly Stroke[];

/* 24x24, the same box every stroke is drawn in */
export const INFRA_ICONS: readonly Icon[] = [
  // 01 import direct: something dropping into an open crate
  [
    [[4, 11], [4, 20], [20, 20], [20, 11], [20, 11]],
    [[12, 2], [12, 6], [12, 10], [12, 14], [12, 14]],
    [[7, 9], [9.5, 11.5], [12, 14], [14.5, 11.5], [17, 9]],
  ],
  // 02 sourcing: a field searched, one thing picked out of it
  [
    [[12, 3], [21, 12], [12, 21], [3, 12], [12, 3]],
    [[15.5, 15.5], [17, 17], [18.5, 18.5], [20, 20], [20, 20]],
    [[12, 8], [16, 12], [12, 16], [8, 12], [12, 8]],
  ],
  // 03 depozitare: crates, stacked
  [
    [[3, 20], [3, 14], [21, 14], [21, 20], [3, 20]],
    [[7, 14], [7, 7], [17, 7], [17, 14], [7, 14]],
    [[12, 14], [12, 16], [12, 18], [12, 20], [12, 20]],
  ],
  // 04 logistică: a truck on the road
  [
    [[2, 18], [2, 8], [13, 8], [13, 18], [2, 18]],
    [[13, 18], [13, 12], [17, 12], [21, 16], [21, 18]],
    [[3, 21], [8, 21], [13, 21], [18, 21], [21, 21]],
  ],
  // 05 distribuție: one point, three directions
  [
    [[3, 12], [10, 12], [14, 8], [18, 4], [20, 3]],
    [[10, 12], [13, 12], [16, 12], [19, 12], [21, 12]],
    [[10, 12], [14, 16], [17, 19], [19, 21], [20, 21]],
  ],
  // 06 operațiuni comerciale: what the shelves come back as
  [
    [[3, 21], [8, 21], [13, 21], [18, 21], [21, 21]],
    [[4, 17], [9, 12], [13, 15], [17, 7], [21, 4]],
    [[21, 21], [21, 16], [21, 11], [21, 6], [21, 4]],
  ],
];

/** One stroke, as a path. */
export const strokeD = (s: Stroke): string =>
  s.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

/** Two strokes, k of the way from one to the other. */
export const morphD = (a: Stroke, b: Stroke, k: number): string =>
  a
    .map((p, i) => {
      const q = b[i] ?? p;
      return `${i ? 'L' : 'M'}${(p[0] + (q[0] - p[0]) * k).toFixed(2)} ${(p[1] + (q[1] - p[1]) * k).toFixed(2)}`;
    })
    .join(' ');
