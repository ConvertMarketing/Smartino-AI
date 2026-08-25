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

**Faza 2 — schelet static.** Toate cele cinci zone, conținut real, responsive complet,
**zero animație și zero JavaScript livrat**. Mișcarea intră în Faza 3.

Reguli de sistem stabilite aici, valabile mai departe:

- **Banda nu primește niciodată conținut.** Este singura regulă pe care se sprijină
  întreaga semnătură. Verificată automat: niciun element de text nu o intersectează.
- **Culorile se declară în `:root`, nu în `@theme`.** Tailwind v4 elimină variabilele
  de temă pe care nu le vede referențiate static, iar accentele per unitate sunt
  construite în runtime — au fost eliminate în tăcere din CSS-ul compilat.
- **Contrastul se măsoară pe pixelii randați, nu pe paletă.** Fundalurile sunt tente
  `color-mix`, care se calculează la `oklab()`; verificarea paletei pe `Canvas` pur
  ratează exact cazurile care pică.
- **`latin-ext` este obligatoriu.** Este singurul subset care conține ș și ț cu
  virgulă dedesubt (U+0218–021B); subsetul `latin` are 0 din 4.
