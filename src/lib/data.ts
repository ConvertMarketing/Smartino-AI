/**
 * Every value here is taken from the client brief and cross-checked against the
 * Faza 1 audit of the live stores. Nothing is invented.
 *
 * Where a fact is genuinely unknown it is left absent and marked TODO rather
 * than filled with a plausible guess -- see docs/design-plan.md, "De clarificat
 * cu clientul".
 */

export type Unit = {
  /** Two-digit ordinal shown on the card; also the reading order of the page. */
  index: '01' | '02' | '03' | '04';
  name: string;
  /** Ordinal stem, kept for stable ids and ordering. The group uses ONE brand
   *  colour, so this no longer selects a palette. */
  token: 'u1' | 'u2' | 'u3' | 'u4';
  /** Absent for Smartino Supermarket, which has no site. That absence is the
   *  reason its card is drawn rather than filled -- it is not an oversight. */
  href?: string;
  domain?: string;
  presence: string;
  summary: string;
  slogan?: string;
  categories: string[];
  /** Free-text notes rendered under the categories, e.g. delivery terms. */
  notes?: string[];
};

export const COMPANY = {
  legalName: 'SMARTINO INTERNATIONAL SRL',
  vat: 'RO37843488',
  address: {
    venue: 'Snagov Plaza',
    street: 'Șoseaua București–Ploiești DN-1',
    locality: '075100 Tâncăbești, jud. Ilfov',
    /** Kept as one string for the fascia, where it must fit on a single line. */
    oneLine: 'Snagov Plaza · DN-1 · Tâncăbești, Ilfov',
  },
  phones: [
    { label: 'Grup', value: '+40 755 210 121', href: 'tel:+40755210121' },
    { label: 'Grup', value: '+40 775 673 495', href: 'tel:+40775673495' },
    { label: 'Smartino Shop', value: '0374 072 222', href: 'tel:0374072222' },
  ],
  email: 'contact@smartinohome.ro',
  values: ['accesibilitate', 'calitate', 'funcționalitate', 'grijă pentru oameni'],
} as const;

/** The two openings the whole page is built around. */
export const TIMELINE = {
  first: { date: '2025-07-11', label: '11 iulie 2025', unit: 'Smartino Supermarket' },
  second: { date: '2026-07-25', label: '25 iulie 2026', unit: 'Smartino Home' },
  /** 379 days between them; 1 px = 1 day on the measured segment in zone 2. */
  days: 379,
  /** The major mark on that segment: one year, 14 days before the second opening. */
  yearMark: 365,
} as const;

/** Only Smartino Supermarket's hours are known. Smartino Home's are not stated
 *  anywhere in the brief and must not be guessed -- it is the largest store in
 *  the group and a wrong time sends someone driving to Tâncăbești for nothing.
 *  TODO(client): opening hours for Smartino Home, plus public-holiday exceptions
 *  for both stores. */
export const SUPERMARKET_HOURS = [
  { days: 'Luni – Vineri', open: '07:00', close: '22:00' },
  { days: 'Sâmbătă – Duminică', open: '08:00', close: '21:00' },
] as const;

export const UNITS: Unit[] = [
  {
    index: '01',
    name: 'Smartino Supermarket',
    token: 'u1',
    presence: 'Magazin fizic',
    summary:
      'Primul magazin al grupului, deschis în Snagov Plaza. Produsele de care o familie are nevoie în fiecare zi, la îndemână.',
    categories: [
      'Igienă și îngrijire personală',
      'Curățenie pentru casă',
      'Produse utile pentru casă',
    ],
  },
  {
    index: '02',
    name: 'Smartino Home',
    token: 'u2',
    href: 'https://smartinohome.ro',
    domain: 'smartinohome.ro',
    presence: 'Magazin fizic și online',
    summary:
      'Peste 1.200 m² în Snagov Plaza, vizavi de Supermarket, plus catalogul online. Mobilier și decor pentru interior, grădină și terasă.',
    slogan: 'Acasă începe aici.',
    categories: [
      'Mobilier de interior și exterior',
      'Seturi lounge, șezlonguri, balansoare, hamace',
      'Umbrele de soare, pergole și foișoare',
      'Textile, iluminat, decorațiuni',
      'Bucătărie, baie, camera copiilor',
      'Camping și outdoor',
    ],
  },
  {
    index: '03',
    name: 'Smartino Shop',
    token: 'u3',
    href: 'https://smartinoshop.ro',
    domain: 'smartinoshop.ro',
    presence: 'Magazin online',
    summary:
      'Catalogul de îngrijire și curățenie al grupului, livrat în toată țara.',
    slogan: 'Tot ce ai nevoie, într-un singur loc.',
    categories: [
      'Scutece Sleepy, pentru copii și adulți',
      'Produse de incontinență',
      'Șervețele umede',
      'Igienă și îngrijire personală',
      'Curățenie pentru casă',
      'Cosmetice Unleashia',
    ],
  },
  {
    index: '04',
    name: 'Smartino Moldova',
    token: 'u4',
    href: 'https://smartino.md',
    domain: 'smartino.md',
    presence: 'Magazin online, Republica Moldova',
    summary:
      'Partenerul nostru din Republica Moldova, cu un catalog de curățenie și îngrijire pentru casă și birou.',
    categories: [
      'Curățenie pentru casă și birou',
      'Scutece Sleepy',
      'Șervețele umede',
      'Igienă și îngrijire',
    ],
    notes: [
      'Livrare gratuită în Chișinău la comenzi peste 300 lei.',
      'În restul Republicii Moldova prin Nova Poshta, 90 lei, 2–5 zile lucrătoare.',
    ],
  },
];

/**
 * Legal wording for smartino.md. The relationship between Smartino
 * International SRL and RINCOM-GRUP SRL is not established, so the site states
 * only what is verifiable -- who operates the store -- and claims no ownership.
 * TODO(client): confirm the exact legal relationship and replace this with
 * lawyer-approved wording before launch.
 */
export const MOLDOVA_OPERATOR = 'smartino.md este operat de RINCOM-GRUP SRL, Chișinău.';

/** Mandatory for a Romanian company selling online. Linked as text, with marks
 *  drawn in-system and hosted locally -- never as badges from another domain. */
export const CONSUMER_LINKS = [
  { label: 'ANPC — Soluționarea alternativă a litigiilor', href: 'https://anpc.ro/ce-este-sal/' },
  { label: 'Soluționarea online a litigiilor (SOL)', href: 'https://ec.europa.eu/consumers/odr' },
];

export const FACTS = [
  { value: '2', n: 2, suffix: '', label: 'magazine fizice' },
  { value: '1.200 m²', n: 1200, suffix: ' m²', label: 'Smartino Home' },
  { value: '4', n: 4, suffix: '', label: 'branduri' },
  { value: '2', n: 2, suffix: '', label: 'țări' },
];
