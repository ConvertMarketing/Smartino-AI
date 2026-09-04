/**
 * The brands the group imports and puts on the shelf.
 *
 * Source: the logo pack the client sent (22 PNG files). Nothing here is
 * inferred -- each name is read off its own logo, and no claim is made about
 * category, exclusivity or volume, because none of that is documented
 * anywhere we can check. The one framing that is the client's own statement:
 * these are brands Smartino imports.
 *
 * Four of the files are Sleepy lockups (the master mark plus Easy Clean,
 * Natural and Bio Natural) and two are Remaple in its two colourways. They
 * are not six brands, so they share one tile each and the tile cycles through
 * its marks -- every file the client sent is on the wall, and nobody counts
 * the same brand twice.
 */
export type Brand = {
  /** file base name in src/assets/brands, first entry is the resting mark */
  marks: string[];
  name: string;
};

/** Three rows, six tiles each: the wall is built row by row. */
export const BRAND_ROWS: Brand[][] = [
  [
    { name: 'Sleepy', marks: ['sleepy', 'sleepy-easy-clean', 'sleepy-natural', 'sleepy-bio-natural'] },
    { name: 'Papia', marks: ['papia'] },
    { name: 'Scrub Daddy', marks: ['scrub-daddy'] },
    { name: 'Pasta del Capitano', marks: ['pasta-del-capitano'] },
    { name: 'Parex', marks: ['parex'] },
    { name: 'Cotton Box', marks: ['cotton-box'] },
  ],
  [
    { name: 'Unleashia', marks: ['unleashia'] },
    { name: 'Pyunkang Yul', marks: ['pyunkang-yul'] },
    { name: 'NARD', marks: ['nard'] },
    { name: 'JTF Oral Care', marks: ['jtf-oral-care'] },
    { name: 'Macromax', marks: ['macromax'] },
    { name: 'Luvum', marks: ['luvum'] },
  ],
  [
    { name: 'Hespéride', marks: ['hesperide'] },
    { name: 'Atmosphera', marks: ['atmosphera'] },
    { name: '5five', marks: ['5five'] },
    { name: 'Remaple', marks: ['remaple', 'remaple-verde'] },
    { name: 'TEMS', marks: ['tems'] },
    { name: 'Doy Fresh', marks: ['doy-fresh'] },
  ],
];

export const BRAND_COUNT = BRAND_ROWS.flat().length;
