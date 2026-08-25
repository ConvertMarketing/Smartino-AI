# smartino.ai

Site-ul-umbrelă al grupului **Smartino International SRL**.

## Stack

| | |
|---|---|
| Framework | Astro 7 (static output) |
| Limbaj | TypeScript (strict) |
| Stiluri | Tailwind CSS v4 (`@theme` tokens) |
| Animație | GSAP 3 + ScrollTrigger, Lenis |
| Hosting | GitHub Pages |

## Comenzi

```bash
npm install       # instalează dependințele
npm run dev       # server local, http://localhost:4321/Smartino-AI/
npm run check     # type check (rulează și în CI)
npm run build     # build static în ./dist
npm run preview   # servește ./dist local
```

> Notă: în dev, site-ul e la `/Smartino-AI/`, nu la `/`. Este intenționat —
> reproduce exact calea de pe GitHub Pages, ca să nu apară surprize la deploy.

## Deploy

Push pe `main` sau pe branch-ul de dezvoltare declanșează
`.github/workflows/deploy-pages.yml`, care face build și publică pe GitHub Pages.

**Live:** https://convertmarketing.github.io/Smartino-AI/

### Base path

Pages servește un *project site* dintr-un sub-director, deci toate căile interne
trebuie prefixate. Regula, fără excepții:

```astro
import { withBase } from '../lib/paths';
<a href={withBase('/contact')}>…</a>   <!-- corect -->
<a href="/contact">…</a>               <!-- 404 pe Pages -->
```

Link-urile externe (`https:`, `mailto:`, `tel:`) **nu** trec prin `withBase`.

### Trecerea pe domeniu propriu

Trei modificări, toate mecanice:

1. `public/CNAME` cu domeniul (ex. `smartino.ai`)
2. în workflow, sub pasul de build:
   `env: { SITE_URL: 'https://smartino.ai', BASE_PATH: '/' }`
3. la registrar: `A` către IP-urile GitHub Pages, sau `CNAME` către
   `convertmarketing.github.io`

`withBase` continuă să funcționeze fără schimbări în cod.

## Structură

```
src/
  pages/      rutele Astro
  styles/     global.css — tokens Tailwind în @theme
  lib/        helpers (paths.ts, motion.ts)
docs/         audit de brand, asset-uri lipsă, plan de design
public/       fișiere servite ca atare
```

## Stare

**Faza 3 — mișcare.** Reveal-uri la scroll, interacțiunea de răspuns dintre cele două
magazine fizice, tenta de ieșire, starea live a programului. **1.370 bytes gzip de
JavaScript, în total** — 0,9% din bugetul de 150 KB.

Fără GSAP, fără ScrollTrigger, fără Lenis: măsurate pe fișierele reale din acest repo,
însumau 50.625 bytes gzip, adică 33% din tot bugetul, pentru mișcări pe care le fac un
IntersectionObserver și tranziții CSS. Lenis a ieșit și dintr-un al doilea motiv — scroll
hijacking e cel mai agresiv element vestibular pe care îl poate livra o pagină, iar
absența lui rezolvă problema prin construcție, nu prin media query.

Reguli de sistem, valabile mai departe:

- **Banda nu primește niciodată conținut.** Singura excepție e mecanismul de răspuns
  însuși — riglă, marcaj de poziție, etichetă de direcție — toate `aria-hidden`.
  Verificat automat, cu excepția explicită în verificator.
- **Timing-ul se ia din `src/lib/motion.ts`.** Nimic nu-și inventează propria durată.
- **Reveal-urile sunt scoped pe `[data-js]`**, setat de un script inline înainte de
  primul paint, cu un timeout de siguranță: dacă modulul nu se încarcă, flag-ul cade și
  totul devine vizibil. Un bundle eșuat degradează la o pagină lizibilă, nu la una albă.
- **Navigarea nu e niciodată întârziată.** Tenta de ieșire rulează în paralel cu o
  navigare deja pornită: fără `preventDefault`, deci middle-click, cmd-click și
  ctrl-click își păstrează comportamentul nativ. Guard pe `pageshow.persisted` pentru
  întoarcerea din bfcache.
- **Starea programului se calculează doar după hidratare.** Workflow-ul de deploy nu are
  trigger de tip `schedule`, deci orice stare coaptă la build ar îngheța la ultimul deploy
  și ar fi indexată așa. În zi de sărbătoare legală pagina spune că programul e special,
  nu calculează un răspuns de zi normală.
- **Culorile se declară în `:root`, nu în `@theme`.** Tailwind v4 elimină variabilele de
  temă pe care nu le vede referențiate static.
- **Contrastul se măsoară pe pixelii randați**, compunând transparențele peste părintele
  real. Fundalurile sunt `color-mix`, care se calculează la `oklab()`.
- **`latin-ext` este obligatoriu** — singurul subset cu ș și ț cu virgulă dedesubt.
