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

Faza 0 — schelă + pipeline de deploy. Pagina curentă este un **placeholder**
temporar, cu paletă neutră deliberat, ca să nu anticipeze direcția de design.
Se înlocuiește integral în Faza 2.
