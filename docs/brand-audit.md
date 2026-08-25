# Audit de brand — surse live

> Generat în Faza 1 prin descărcarea și analiza efectivă a CSS-ului celor trei magazine.
> Fiecare culoare de mai jos vine dintr-un fișier real; coloana **Dovadă** indică variabila
> sau selectorul exact în care a fost găsită. Nimic nu este aproximat.

## https://smartinoshop.ro

**Platformă:** Shopify - tema Ella (Halo Themes) v6.5.2, instanta customizata denumita "SMARTINO SHOP - 2026" (theme id 160663666983, theme_store_id: null, role: main). Aplicatii terte detectate in CSS: Judge.me (recenzii), BOGOS/free-gifts, variant-swatch-king, Pandectes (GDPR).

**Încredere în audit:** `high`

### Culori

| Hex | Rol | Ocurențe | Dovadă |
|---|---|---|---|
| `#00bbc5` | brand-primary | 59 | --btn-1-bg, --btn-1-border, --btn-2-border, --btn-2-color, --footer-top-bg, --new-badge-bg, --search-icon-bg, --cart-bg-item, --product-title-color-hover, --product-action-bg, --color-background-layout-boxed, --bg-bubble (22 distinct variables in the theme-editor :root block, inline <style> #1 of shop.html); also hardcoded in css/base.css as #product-add-to-cart{background-color:#00bbc5!important} |
| `#232323` | text | 59 | --color-text, --color-global, --color-link, --color-link-hover, --product-title-color, --product-price-color, --product-vendor-color, --form-input-color, --arrow-color (theme :root) |
| `#ffffff` | surface | 92 | --color-background, --color-white, --btn-1-color, --btn-2-color-hover, --btn-2-bg, --cart-item-bg, --form-input-bg (theme :root) |
| `#2cc6d0` | accent-hover (turcoaz deschis) | 2 | --button-background-hover (section settings inline style attr) and --icon-color: #2cc6d0 on a footer-block__details element |
| `#38aebf` | accent-secondary (turcoaz mat, widget recenzii Judge.me) | 16 | --jdgm-primary-color, --jdgm-star-color, --jdgm-snippet-star-color, --jdgm-reviewer-name-color, --jdgm-write-review-bg-color, --jdgm-paginate-color; also JSON config keys widget_primary_color / review_form_star_color |
| `#e9514b` | accent-secondary (coral, Buton 3) | 4 | --btn-3-bg, --btn-3-bg-hover, --btn-3-border, --btn-3-border-hover (theme :root) |
| `#f42b23` | sale-price | 1 | --product-sale-price-color (theme :root) |
| `#ffa221` | badge-custom | 1 | --custom-badge-bg (theme :root) |
| `#ffb20d` | review-star-full | 1 | --product-review-full-color (theme :root) |
| `#969696` | text-secondary | 2 | --color-text2, --product-compare-price-color, --color-base-text2-rgb: 150,150,150 (theme :root) |
| `#e6e6e6` | border | 2 | --border-global, --product-review-empty-color (theme :root) |
| `#3c3c3c` | text-ui (paginare / cos) | 6 | --pagination-item-color, --pagination-arrow-color, --text-cart (theme :root) |
| `#e8e8e8` | border-subtle | 3 | --cart-item-border, --dots-border-color, --dots-color-active (theme :root) |
| `#202020` | black | 2 | --color-black, --color-info (theme :root) |

### Fonturi

- **Montserrat** — *heading + body + accent (familie unica pentru tot site-ul)* · Google Fonts - @import url('https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i&display=swap') in primul <style> inline din <head>. Setata pe --font-family-1, --font-family-2, --font-body-family (15px/400/24px), --font-heading-family (20px/500), --font-menu-lv1/lv2/lv3-family, --font-mega-menu-lv2/lv3-family, --font-page-title-family, --product-title-font, --product-vendor-font, --product-price-font, --badge-font, --blog-title-font, --btn-1/2/
- **Noto Serif Gurmukhi** — *NU e font de brand - font de accesibilitate (widget de tip dyslexia/readability toggle)* · https://fonts.cdnfonts.com/css/noto-serif-gurmukhi (link rel=stylesheet separat)
- **OpenDyslexic** — *NU e font de brand - font de accesibilitate (widget dyslexia toggle)* · https://fonts.cdnfonts.com/css/open-dyslexic (link rel=stylesheet separat)

### Logo

**Format:** PNG raster (200x50 px, transparent) + WEBP pentru og:image. NU exista varianta vectoriala (SVG) - nicio referinta catre un logo .svg in HTML.

Wordmark pur, fara simbol separat: cuvantul 'SMARTINO' cu majuscule, litere grase, foarte stranse (tracking negativ), taiate drept, intr-un singur ton de turcoaz pe fond transparent. Sub grupul de litere trece un accent grafic scurt, ca o subliniere/swoosh, iar litera finala 'O' este inchisa printr-o taietura oblica ce o leaga de acel accent, dand efectul unei semnaturi continue. Nu exista lockup cu tagline si nu exista varianta pe fundal inchis. Culoarea reala esantionata pixel cu pixel din LOGO_NOU_SMARTINO.png se grupeaza in jur de #0dbbca (cele mai frecvente valori: #0ebbcb, #0dbbca, #0cbccc) - deci ARTWORK-UL logo-ului NU este identic cu tokenul CSS de brand #00bbc5, diferenta fiind cel mai probabil artefact de compresie/antialiasing al PNG-ului, nu o a doua culoare intentionata. Fisierul principal are doar 200x50 px (11.6 KB), servit si in variantele _140x/_200x/_280x - rezolutie foarte mica pentru un logo. Al doilea fisier, logo-smartino-b-*.webp, este folosit exclusiv ca og:image si este referit pe http:// (nu https), fiind o versiune veche.

URL-uri:
- https://smartinoshop.ro/cdn/shop/files/LOGO_NOU_SMARTINO.png?v=1759681041
- https://smartinoshop.ro/cdn/shop/files/LOGO_NOU_SMARTINO_140x.png?v=1759681041
- https://smartinoshop.ro/cdn/shop/files/LOGO_NOU_SMARTINO_200x.png?v=1759681041
- https://smartinoshop.ro/cdn/shop/files/LOGO_NOU_SMARTINO_280x.png?v=1759681041
- http://smartinoshop.ro/cdn/shop/files/logo-smartino-b-36151236384203_1361d345-7c11-4c29-a61a-4aa71e642b21.webp
- https://smartinoshop.ro/cdn/shop/files/favicon7333_32x32.webp?v=1695821369

### Imagistică

Doua registre vizuale distincte, verificate prin descarcarea si inspectarea efectiva a fisierelor. (1) PACKSHOT DE PRODUS pe fundal alb pur, fara umbra de context, foarte frecvent randat ca multi-pack - acelasi ambalaj repetat/asezat in evantai de 3-4 ori in acelasi cadru pentru a sugera cantitatea (ex. 3X-2026-08-06T100729.892.png = 4 pungi Macromax Economic Cleaning Cloth suprapuse). Denumirile de fisier de tip '3X-2026-08-06T<ora>.png' arata export in lot, automatizat, dintr-o singura sesiune de procesare. Produsul este afisat prin ambalajul lui, nu prin utilizare. (2) BANNERE ORIZONTALE DE CAMPANIE (aprox. 1880x600) construite in stil lifestyle + text overlay puternic: fotografie cu persoane (mama si bebelus), produsul detasat pe un podium/apa, plus tipografie mare de beneficiu ('99,9% Apa Pura', 'delicat pentru bebelusi') si iconuri de garantie (Vegan, Cruelty-Free, Hipoalergenic). ATENTIE: bannerele preiau identitatea vizuala a FURNIZORULUI, nu a Smartino - bannerul Sleepy Aqua Care este albastru/alb, cel Papia si cel Parex au fiecare paleta lor. Turcoazul #00bbc5 al Smartino NU apare in imagini, ci doar in chrome-ul UI (butoane, header, footer, badge-uri). Imaginile sunt PNG grele, nesuprimate (0.4-1.2 MB per fisier la dimensiune completa), servite prin parametrul ?width= al CDN-ului Shopify.

> ⚠️ **Temporar.** URL-urile de mai jos sunt de pe CDN-ul magazinului, folosite ca placeholder
> în dezvoltare. Se înlocuiesc cu asset-uri primite de la client înainte de lansare.

- https://smartinoshop.ro/cdn/shop/files/3X-2026-08-06T100729.892.png
- https://smartinoshop.ro/cdn/shop/files/02_0a693f77-ba4e-46a5-a242-d047fcb5487c.png
- https://smartinoshop.ro/cdn/shop/files/Smartino_Banner_Aqua_Care_1.png
- https://smartinoshop.ro/cdn/shop/files/PAPIA_-_BANNER_SMARTINO.png
- https://smartinoshop.ro/cdn/shop/files/SMARTINO_-_Cosmetice_Coreene_Promo_3.png
- https://smartinoshop.ro/cdn/shop/files/smartino_sleepy_easy_clean_nou.png

### Voce

Romana, registru comercial direct si promotional, cu adresare informala la persoana a II-a singular ("tu"): "Ai cele mai bune preturi la SMARTINO", "Email-ul tau", "Cum alegi masca Luvum potrivita pentru tipul tau de ten?". Imperativul este forma dominanta a CTA-urilor - practic fiecare actiune este un ordin scurt: "Profita acum", "Adauga in cos", "Alege Optiunile", "Vezi mai multe", "Anunta-ma", "Cumparati aspectul", "ABONARE" (butoanele sunt uppercase prin --btn-1-text-transform: uppercase). Titlurile de sectiune sunt fragmente nominale foarte scurte, de 2-4 cuvinte, fara verb: "Cele mai iubite produse", "Produse Populare", "Categorii", "Cele mai vandute", "Cele mai recente", "Produse Coreene", "REDUCERI". Superlativul "cele mai" este tic de limbaj recurent. Comunicarea este condusa de pret si urgenta, cu cifre in clar si majuscule pentru presiune: "-50% la toate cosmeticele coreene . Profita acum" (bara de anunt), "Pana la 50% REDUCERE", "Livrare GRATUITA la comenzi de peste 200 LEI", "Nu rata cele mai noi oferte si promotii!". Fraza medie este foarte scurta in UI (sub 10 cuvinte). Registrul se schimba pe blog, unde tonul devine consultativ, explicativ si de tip ghid, cu fraze lungi si constructii "De ce / Cum / Tot ce trebuie sa stii": "Tot ce trebuie sa stii despre detergentii pudra automati REMAPLE", "De ce produsele Papia sunt alegerea ideala pentru confortul zilnic", "De ce sa alegi servetelele umede Sleepy Aqua pentru bebelusul tau?". Brandul se pozitioneaza ca revanzator multi-marca si numeste constant furnizorii in copy (Sleepy, Papia, Parex, Remaple, Scrub Daddy, Luvum, JTF, Macromax), nu produsele proprii. INCONSECVENTA REALA: diacriticele sunt folosite in interfata si in titluri ("Hartie igienica PAPIA" apare corect ca "Hârtie igienică PAPIA", "Șervețele umede pentru bebeluși"), dar lipsesc complet in meta description si in majoritatea titlurilor de blog ("Scuece copii" contine si o eroare de tipar in meta description, iar "curetenia casei" este scris gresit in loc de "curatenia"). Exista deci doua standarde de redactare pe acelasi site.

### Lipsuri constatate

- Logo vectorial (SVG) - exista doar raster PNG 200x50, prea mic pentru print sau ecrane mari
- Varianta de logo pe fundal inchis / inversata (alb) - tokenul --logo-color: #ffffff exista in setarile de sectiune, dar niciun fisier de logo alb nu e servit
- Tokenii de accent ai temei sunt LASATI GOI in :root: --color-base-accent-1, --color-base-accent-2, --color-base-accent-text nu au nicio valoare atribuita (--color-base-accent-1: ;) - deci nu exista un accent secundar definit oficial la nivel de tema
- --product-marquee-background-color este de asemenea gol in :root
- Favicon doar ca WEBP 32x32 (favicon7333_32x32.webp) - lipseste .ico si varianta SVG/512px pentru PWA si Apple touch icon
- Imagine dedicata de Open Graph / social share - og:image reutilizeaza logo-ul vechi logo-smartino-b-*.webp si este servit pe http:// in loc de https://
- Pagina publica de brand guidelines / style guide - inexistenta pe site
- Font de titlu distinct - nu exista ierarhie tipografica prin familie (Montserrat este folosit si pentru heading si pentru body); diferentierea se face doar prin greutate si dimensiune
- Culoare de brand pentru starile semantice - success/error/info folosesc default-urile Ella (#5A5A5A / #D93333 / #202020), necorelate cu turcoazul

### Note

METODA: am descarcat efectiv shop.html (1.49 MB), am extras cele 51 de blocuri <style> inline si am descarcat toate cele 42 de foi de stil linkuite. Fiecare culoare raportata are ca dovada un nume de variabila CSS real dintr-un fisier descarcat.

DISTINCTIA TEMA vs BRAND (am putut sa o fac clar, de aceea confidence: high):
Tema este Ella 6.5.2, instanta denumita 'SMARTINO SHOP - 2026' (Shopify.theme id 160663666983, theme_store_id: null). Am separat trei surse si le-am numarat independent:
(a) Blocul :root generat de theme editor (blocul inline #1, 14 KB) = ALEGERILE COMERCIANTULUI. Aici #00bbc5 apare de 16 ori si este singura culoare cromatica cu frecventa mare - restul sunt neutre (#ffffff 28, #232323 23). Acesta este turcoazul Smartino, luat din sursa.
(b) Fisierele CSS stock ale temei (css/*.css) = DEFAULT-URI ELLA. Acolo domina neutre (#303030, #e6e6e6, #616161) si #00bbc5 apare de doar 2 ori, ambele in base.css ca override custom evident (#product-add-to-cart{background-color:#00bbc5!important} si .nav-menu-tab). base.css are versiune v=...1770395954, mult mai noua decat restul fisierelor (v=...1695810104), ceea ce confirma ca a fost editat manual dupa instalarea temei.
(c) CSS de la aplicatii terte = ZGOMOT, exclus din paleta. Am identificat si eliminat explicit: gri-urile Shopify Polaris ale aplicatiei BOGOS free-gifts (#6a6a6a - 98 aparitii, #303030 - 74, #292929 - 54, #005bd3, #2332d5, #8051ff) si ale widgetului variant-swatch-king. Acestea aveau cele mai mari frecvente brute in HTML dar NU sunt culori de brand - o numaratoare naiva 'sort | uniq -c' pe tot documentul ar fi raportat gresit #6a6a6a drept culoare dominanta.

TOATE TURCOAZURILE GASITE, raportate cu frecventa, fara sa aleg eu unul:
- #00bbc5 (0,187,197) - 59 aparitii in HTML, 16 in :root-ul temei, 22 variabile distincte. Turcoazul de brand.
- #38aebf (56,174,191) - 16 aparitii. Configurat de comerciant, dar in aplicatia Judge.me (widget_primary_color), nu in tema. Este o potrivire aproximativa a turcoazului de brand, nu identica - deci exista o mica inconsecventa intre site si widgetul de recenzii.
- #2cc6d0 (44,198,208) - 2 aparitii. Turcoaz mai deschis, folosit ca --button-background-hover si ca --icon-color intr-un bloc de footer.
- #108474 (16,132,116) - 12 aparitii. NU este culoare Smartino: este default-ul Judge.me (cheia JSON se numeste literal 'judgeme_brand_color'), ramas neschimbat pe verified_count_badge_color si featured_carousel.
- ~#0dbbca - media pixelilor din artwork-ul logo-ului (vezi sectiunea logo).
Concluzie: brandul foloseste practic patru turcoazuri usor diferite (#00bbc5 in tema, #38aebf in recenzii, #2cc6d0 la hover, #108474 ramas default) - o inconsecventa reala de implementare, nu o alegere de design.

ALTE OBSERVATII: paleta este construita pe un singur accent cromatic (turcoaz) peste un sistem aproape complet neutru alb/#232323; rosurile (#e9514b buton 3, #f42b23 pret redus, #d62828 stoc limitat) si portocaliile (#ffa221 badge, #ff8b21 categorii multilevel) sunt culori functionale de urgenta comerciala, nefiind armonizate intre ele - sunt cinci rosii/portocalii apropiate dar distincte in acelasi :root.

---

## https://smartinohome.ro

**Platformă:** Shopify — tema Ella 6.7.6 (HaloThemes). Din `Shopify.theme` in HTML: {"name":"GIVEAWAY - Marea Deschidere","id":203740250451,"schema_name":"Ella","schema_version":"6.7.6","theme_store_id":null,"role":"main"}. Header `powered-by: Shopify`, `theme;desc="203740250451"`. Assets servite din /cdn/shop/t/10/assets/ (38 fisiere CSS, inclusiv halo-*.css specifice Ella).

**Încredere în audit:** `high`

### Culori

| Hex | Rol | Ocurențe | Dovadă |
|---|---|---|---|
| `#15b7c6` | brand-primary (turcoazul Smartino) | 36 | custom.css :root { --sm-accent: #15b7c6 } — token de brand dedicat, prefix --sm- (Smartino). Referit prin var(--sm-accent, #15b7c6) de 36 de ori. Apare si in inline <style> block 30: span.special-text {color: #15b7c6} |
| `#0e8c98` | brand-primary-deep (hover / capat de gradient) | 18 | custom.css :root { --sm-accent-deep: #0e8c98 }; folosit in linear-gradient(90deg, var(--sm-accent), var(--sm-accent-deep)), border si fill |
| `#0d8a96` | turcoaz inchis (literal, gradient end + text/stroke) | 13 | custom.css: linear-gradient(90deg, #15b7c6 0%, #0d8a96 100%); color: #0d8a96 !important; stroke: #0d8a96 |
| `#0a3a3f` | teal foarte inchis (text pe suprafete turcoaz) | 13 | custom.css: color: #0a3a3f !important; stroke: #0a3a3f |
| `#0a8a96` | turcoaz inchis, varianta de gradient | 2 | custom.css: background: linear-gradient(135deg, #0a8a96 0%, #14252a 100%) |
| `#0fb3c3` | turcoaz masurat DIN LOGO (raster) | 1610 | Masurat pe pixeli din logo_smartino_home_470x.png (300x50 RGBA): cluster dominant 56.2% din pixelii opaci, hue=185 sat=86 lum=41. Difera usor de tokenul CSS #15b7c6 (antialiasing/compresie PNG) |
| `#b8c9c8` | gri-teal secundar — cuvantul "home" din logo | 975 | Masurat pe pixeli din logo PNG: 34.0% din pixelii opaci, hue=176 sat=14 lum=75. NU apare niciodata in CSS (grep = 0 ocurente) — exista doar in fisierul de logo |
| `#c7eef1` | accent-soft (tenta turcoaz deschisa) | 1 | custom.css :root { --sm-accent-soft: #c7eef1 } |
| `#e5f7f9` | accent-light (fundal turcoaz foarte deschis) | 1 | custom.css :root { --sm-accent-light: #e5f7f9 } |
| `#0a0a0a` | text-primary | 64 | custom.css :root { --sm-text: #0a0a0a } |
| `#9a9a9a` | text secundar / muted | 21 | custom.css, folosit pe scara larga pentru text secundar (aproape de --sm-text-muted: #999) |
| `#5a5a5a` | text-2 | 2 | custom.css :root { --sm-text-2: #5a5a5a } |
| `#ececec` | border / linie separatoare | 12 | custom.css :root { --sm-line: #ececec } |
| `#f7f6f3` | surface soft (fundal cald off-white) | 1 | custom.css :root { --sm-bg-soft: #f7f6f3 } |
| `#a33a32` | semantic: sale/reducere | 1 | custom.css :root { --sm-sale: #a33a32 } |
| `#2d7a4a` | semantic: succes / in stoc | 1 | custom.css :root { --sm-ok: #2d7a4a } |
| `#c89a3e` | semantic: warning | 1 | custom.css :root { --sm-warn: #c89a3e } |
| `#d62828` | rosu de urgenta (stoc limitat) | 12 | block1 inline: --product-hot-stock-text-color: #d62828; folosit si in custom.css |
| `#f1f1f1` | fundal pagina (setare TEMA Ella, nu brand) | 15 | inline <style> block1 :root { --color-background: #f1f1f1; --color-background-rgb: 241, 241, 241 } |
| `#000000` | scaffolding TEMA Ella (text, butoane, footer bottom, nav tab) | 78 | block1 :root { --color-text/-link/-global/-black: #000000 } — 49 ocurente doar in block1; inline block 35 .footer__content-bottom{background:#000000} |
| `#ffffff` | scaffolding TEMA Ella (surface/contrast) | 91 | block1 :root { --color-white, --btn-1-color, --arrow-background-color: #FFFFFF } |

### Fonturi

- **Quicksand** — *heading* · Google Fonts — @import url('https://fonts.googleapis.com/css?family=Quicksand:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i&display=swap') in inline <style> block 1. Tokens: --font-family-1/2: Quicksand, --font-heading-family: Quicksand, --font-heading-size: 24px, --font-heading-weight: 500
- **Quicksand** — *body* · Google Fonts (acelasi @import). Tokens: --font-body-family: Quicksand, --font-body-size: 16px, --font-body-weight: 400, --body-line-height: 24px, --body-letter-spacing: 0.1px
- **Quicksand** — *accent — meniu, butoane, titluri produs, badge, footer* · Google Fonts (acelasi @import). --font-menu-lv1-family, --btn-1/2/3-font-family, --product-title-font, --badge-font, --blog-title-font, --footer-heading-font-family — TOATE sunt Quicksand. Site-ul e mono-font.
- **'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', monospace** — *accent (marginal, un singur element in custom.css)* · system stack — nu se incarca niciun webfont pentru el

### Logo

**Format:** SVG (dar cu raster PNG incapsulat — nu e vector adevarat) + PNG transparent 300x50 / 235x39; favicon PNG 32x32

Wordmark pur, fara simbol/pictograma separata. Text integral cu minuscule: "smartino home", intr-un sans-serif geometric rotunjit, cu terminatii circulare si contur uniform (foarte apropiat vizual de Quicksand, fontul site-ului — coerenta buna intre logo si tipografia web). Bicolor: cuvantul "smartino" in turcoaz (masurat #0fb3c3), cuvantul "home" in gri-teal deschis (masurat #b8c9c8), ceea ce creeaza o ierarhie in care numele de brand domina si categoria se retrage. Simbol ® in superscript intre cele doua cuvinte. Fundal transparent (PNG RGBA). Raport aprox. 6:1 (300x50 px la 1x). ATENTIE: fisierul .svg NU e vector real — are viewBox 0 0 224.88 37.5 dar incapsuleaza doua imagini raster `data:image/png` plus filtre feColorMatrix; 208 KB pentru un wordmark. Culorile #787fc5/#37be2f/#223a57/#0184d1 gasite prin grep in SVG sunt FALS POZITIVE — sunt fragmente din id-uri de filtre (ex. id="0184d1dcdb", referite ca url(#...)), nu fill-uri.

URL-uri:
- https://smartinohome.ro/cdn/shop/files/logo_smartino_home_1.svg?v=1779711018
- https://smartinohome.ro/cdn/shop/files/logo_smartino_home_1_150x.svg?v=1779711018
- https://smartinohome.ro/cdn/shop/files/logo_smartino_home_1_420x.svg?v=1779711018
- https://smartinohome.ro/cdn/shop/files/logo_smartino_home_470x.png?v=1776344204
- https://smartinohome.ro/cdn/shop/files/logo_smartino_home_235x.png?v=1776344204
- https://smartinohome.ro/cdn/shop/files/favicon_-_smartino_home_32x32.png?v=1779114245

### Imagistică

Fotografie de produs de catalog, izolata pe fundal alb pur, format patrat 600x600, lumina difuza neutra, fara umbre dramatice, fara props si fara context de interior. Am descarcat si inspectat vizual 4 imagini: covorase din diatomit (gri, verde salvie), cantar de baie — toate packshot-uri frontale/usor unghiulare pe alb. Nomenclatura fisierelor (174683_DEB1, 189966_DEB2, 206940_D1, 220352B_PACK1) e cod de furnizor/SKU cu sufixe de tip vedere (DEB/D/MAT/PACK), deci imaginile sunt preluate din feed-ul furnizorului, nu produse in-house. Unele sunt fotografii ale AMBALAJULUI de retail si contin branding tert vizibil (ex. 220352B_PACK1 arata cutia "5five Simply Smart"). Exceptia e banner-ul de hero (banner_6.png, 1254x1254, 3.3 MB) — creatie proprie de campanie cu text suprapus ("Colectia SUMMER 2026 / Acasa incepe aici"). Cardurile de produs sunt afisate cu border-radius 24px si fundal alb (inline block 38: .product-item .card {background:#fff; border-radius:24px}), deci rotunjimea vine din CSS, nu din imagini. Nu exista fotografie lifestyle proprie.

> ⚠️ **Temporar.** URL-urile de mai jos sunt de pe CDN-ul magazinului, folosite ca placeholder
> în dezvoltare. Se înlocuiesc cu asset-uri primite de la client înainte de lansare.

- https://smartinohome.ro/cdn/shop/files/banner_6.png?v=1779995034&width=1600
- https://smartinohome.ro/cdn/shop/files/174683_DEB1_7b4644a6-8b19-4450-9994-229c6060e5e7_600x.jpg
- https://smartinohome.ro/cdn/shop/files/189966_DEB1_bf6266b6-1b0f-4564-95ec-6f3bf148db28_600x.jpg
- https://smartinohome.ro/cdn/shop/files/206940_DEB1_62cd752e-5dec-4518-9a4a-90f3976c8447_600x.jpg
- https://smartinohome.ro/cdn/shop/files/160928_DEB1_920f2592-5936-4dd4-a4fe-d6e92ca385c7_600x.jpg
- https://smartinohome.ro/cdn/shop/files/220352B_PACK1_600x.jpg

### Voce

Romana, registru familiar-cald dar comercial, adresare la persoana a II-a singular (\"tu\"), ceea ce da un ton apropiat, de vecin priceput, nu corporatist. Fraze foarte scurte, adesea eliptice, de tip slogan. Tagline-ul central, repetat ca h1, meta description, og:description si in marquee-ul care se deruleaza continuu: \"Acasa incepe aici.\" — patru cuvinte, propozitie completa, emotionala, fara jargon. Imperativul e mecanismul dominant de CTA, mereu cu majuscule (--btn-1-text-transform: uppercase): \"DESCOPERA\", \"ALEGE MODELUL\", \"VEZI MAI MULTE\", \"Vezi produsele\", \"Descopera noutatile\", \"Aboneaza-te\". Titlurile de sectiune sunt scurte si functionale, substantivale: \"Cele mai cautate\", \"Cele mai vandute\", \"Categorii\", \"Noutati\", \"Relaxare in aer liber\". Blocul de incredere foloseste formula perechi \"eticheta majuscule + explicatie de 3-4 cuvinte\": \"LIVRARE 24-48H / Curier la nivel national\", \"RETUR 14 ZILE / Fara intrebari\", \"SUPORT 24/7 / WhatsApp & telefon\", \"PLATA SECURIZATA / Comanzi simplu si rapid\" — \"Fara intrebari\" e cel mai colocvial moment din tot copy-ul si arata apetit pentru limbaj natural, nu legalist. Continutul editorial (blog) muta registrul spre consultativ-didactic, cu titluri lungi construite ca intrebare implicita si promisiune de ghidaj: \"Mese si scaune pliabile pentru gradina, terasa si balcon: cum alegi setul potrivit\", \"Covoras de baie din diatomit: ce este, beneficii si cum il alegi\", \"Corpuri de iluminat pentru casa: cum alegi lustre, aplice si veioze\" — tiparul recurent e \"[produs]: cum alegi\", plus umbrela \"Sfaturi utile pentru casa & gradina\". Newsletter-ul e explicit tranzactional si fara exagerari: \"Fii la curent cu ofertele, noutatile si promotiile din magazin.\" Nu exista superlative agresive, nu exista limbaj de tip hard-sell cu semne de exclamare multiple, nu exista emoji in copy. Diacriticele sunt folosite consecvent si corect. Ampersandul (&) e preferat lui \"si\" in titluri scurte.

### Lipsuri constatate

- og:image — meta property og:image lipseste complet din <head> (exista doar og:title, og:description, og:site_name, og:type, og:url), deci share-urile pe social nu au imagine dedicata
- Logo vectorial real — fisierul .svg nu contine cai vectoriale, ci doua imagini PNG incapsulate ca data:image/png plus filtre feColorMatrix; nu exista un master scalabil, deci nu se poate reda curat la dimensiuni mari sau printuri
- Varianta de logo monocroma / pe fundal inchis — nu am gasit niciun fisier de tip logo-white, logo-dark sau logo-mono, desi footer-ul si nav-menu-tab au fundal #000000 (inline block 35 si block 4), unde logo-ul bicolor turcoaz+gri deschis are contrast slab
- Valoarea hex exacta a gri-ului din logo ca token CSS — #b8c9c8 (cuvantul "home") are 0 ocurente in tot CSS-ul; exista doar ca pixeli in fisierul de logo, deci nu e codificat nicaieri ca variabila de brand
- Accentul de tema Ella nesetat — --color-base-accent-1, --color-base-accent-2 si --color-base-accent-text sunt DEFINITE DAR GOALE in :root; brandul nu a fost configurat prin theme editor
- Fotografie lifestyle proprie / produse in context de interior — toate imaginile de produs sunt packshot-uri de furnizor pe alb, unele afisand ambalaj cu branding tert (5five)
- Font de brand licentiat — nu exista niciun @font-face si niciun font self-hosted sau de pe fonts.shopifycdn.com; totul depinde de un singur @import Google Fonts (Quicksand), fara fallback declarat in --font-family-1/2
- Favicon vectorial / multi-size — exista doar un PNG 32x32; nu am gasit .ico, favicon SVG, apple-touch-icon sau web app manifest
- Document de brand guidelines, paleta oficiala sau specimen tipografic — nu exista niciun asset de acest tip expus public pe CDN

### Note

SEPARAREA TEMA vs BRAND se poate face fara ambiguitate, de aceea confidence este high. Motivul: brandul si-a construit un sistem propriu de tokeni cu prefix dedicat --sm- (Smartino), izolat in custom.css (258 KB, cel mai mare asset de tema, v=...1786695039 — cel mai recent modificat dintre toate CSS-urile, restul au timestamp ...1784728342). Doua blocuri :root din custom.css contin intreaga identitate: --sm-accent #15b7c6, --sm-accent-deep #0e8c98, --sm-accent-soft #c7eef1, --sm-accent-light #e5f7f9, --sm-text #0a0a0a, --sm-text-2 #5a5a5a, --sm-text-muted #999, --sm-line #ececec, --sm-bg-soft #f7f6f3, --sm-sale #a33a32, --sm-ok #2d7a4a, --sm-warn #c89a3e, plus --sm-radius-card 16px, --sm-radius-pill 999px, --sm-ease cubic-bezier(0.25,0.46,0.45,0.94).

CULORI DE TEMA (default Ella, NU brand): tot :root-ul din inline <style> block 1 e practic alb/negru/gri — 49 ocurente #000000 si 29 #ffffff doar in acel bloc, plus --color-background #f1f1f1, --color-text #000000, --color-text2 #969696, --color-breadcrumb #999999, --color-error #D93333, --color-success #5A5A5A. Semnalul decisiv: --color-base-accent-1, --color-base-accent-2 si --color-base-accent-text sunt goale. Comerciantul NU a setat accentul prin theme editor; a suprascris totul prin custom.css cu !important (36 referinte var(--sm-accent...)). Deci scheletul negru/alb apartine temei, iar turcoazul apartine brandului.

CAPCANA DE TURCOAZ — de evitat: #4dd4c6 apare in :root ca --spinner-right-color. NU e culoare de brand; e default-ul Ella pentru spinner (alaturi de --spinner-bottom-color #f00, --spinner-top-color #fc0, --spinner-left-color #f6f6f6, tot default-uri). Are 0 ocurente in custom.css. La fel, #3e8cc4 / #31b1df / #4593d7 / #3e739d din inline block 34 sunt culorile oficiale ale retelelor sociale pentru iconite (.icon-facebook{background:#385a9a} etc.), nu brand.

FAMILIA DE TURCOAZURI, raportata integral cu frecvente, fara sa aleg eu unul: #15b7c6 (36) este primarul canonic si singurul definit ca token; #0e8c98 (18) e varianta deep, definita tot ca token; #0d8a96 (13) si #0a8a96 (2) sunt literale folosite in gradienti si text, foarte apropiate de deep dar NEtokenizate — inconsecventa reala in cod, nu eroare de masurare; #0a3a3f (13) e teal-ul foarte inchis pentru text. Toate cinci au hue 185-186, deci aceeasi familie cromatica. Separat, turcoazul MASURAT DIN LOGO este #0fb3c3 (56.2% din pixelii opaci) — difera de tokenul CSS #15b7c6 cu cca 6 unitati pe R. Nu am unificat cele doua valori: logo-ul si CSS-ul chiar nu folosesc exact acelasi turcoaz, iar diferenta poate proveni din antialiasing/profil de culoare al PNG-ului sau dintr-o derivare independenta a paletei web fata de logo. Daca e nevoie de o singura sursa de adevar pentru web, #15b7c6 este cea corecta (e declarata explicit ca --sm-accent).

METODA: toate valorile provin din fisiere descarcate efectiv — home.html (1.81 MB, HTTP 200), 38 fisiere CSS (961 KB agregat in ALL.css), logo SVG si PNG, 4 imagini de produs plus verificare HTTP 200 pe restul URL-urilor raportate. Culorile din logo au fost masurate pixel cu pixel din PNG cu Pillow (alpha>=200, clusterizare pe cuburi de 24), nu estimate vizual. Fisiere de lucru in /tmp/claude-0/-home-user-Smartino-AI/b0085215-90a9-5522-8943-48584556babb/scratchpad/brand/.

OBSERVATII SUPLIMENTARE UTILE: sistem de forme rotunjite consecvent — butoane pill (--btn-1/2/3-border-radius: 30px), badge-uri pill (--badge-border-radius: 50px), carduri 24px (inline block 38) dar --sm-radius-card 16px in custom.css (a doua inconsecventa). Tipografia e mono-font: Quicksand pe absolut toate rolurile, cu greutati 400 body / 500 heading / 600 butoane, iar meniul si butoanele sunt uppercase. Conturile sociale gasite in HTML: instagram.com/smartinohome, facebook.com/smartinohomeromania, tiktok.com/@smartinohome. Site-ul ruleaza si extensii terte care isi injecteaza propriul CSS (Pandectes cookie banner, GSC Instagram Feed) — culorile din gsc-instafeed-widget.css si accelerated-checkout-backwards-compat.css nu apartin brandului si le-am exclus din raport.

---

## https://smartino.md

**Platformă:** OpenCart (NU Shopify). Temă personalizată "coloring" — căile sunt catalog/view/theme/coloring/. Foaia de stil principală, evident întreținută manual, este catalog/view/theme/coloring/stylesheet/stylesheet2025.css (67 KB). Nu există niciun marker Shopify: zero /cdn/shop/, zero Shopify.theme, zero fonts.shopifycdn.com. Nu există NICIO variabilă CSS custom property în tot site-ul (grep pentru --*color* și --color-* → 0 rezultate); toate culorile sunt hex hardcodat.

**Încredere în audit:** `high`

### Culori

| Hex | Rol | Ocurențe | Dovadă |
|---|---|---|---|
| `#67bac4` | brand-primary (turcoaz UI) | 131 | stylesheet2025.css — #top .btn{background:#67bac4}, #cart > .btn, #menu .btn-menu{background-color:#67bac4}, #search{border:1px solid #67bac4}, .section-title h4:before. DOVADĂ DECISIVĂ: a fost injectat manual în bootstrap.min.css — a{color:#67bac4} și .btn-primary{background-color:#67bac4}, iar albastrul default Bootstrap #337ab7 are 0 ocurențe în acel fișier. Apare și în 4 blocuri <style> inline |
| `#00b0ba` | brand-primary (turcoaz din LOGO — diferit de cel din CSS) | 1 | Pixelii reali din https://smartino.md/image/catalog/logo.png (255x80 PNG RGBA): 100.00% din pixelii opaci sunt exact #00b0ba. NU apare nicăieri în CSS. Este un turcoaz mai saturat și mai închis decât #67bac4. |
| `#d5383d` | accent secundar / roșu de acțiune (hover pe linkuri, stickere de reducere, hover Adaugă în Coș) | 41 | stylesheet2025.css — a:hover,a:active,a:focus{color:#D5383D}, .red-link, i.required, .btn-addtocart:hover{background-color:#D5383D}, .box-product .product-item .image .sticker{background:#D5383D}. Injectat și în bootstrap.min.css (5 ocurențe), deși roșul default Bootstrap #d9534f încă există acolo — deci este o alegere deliberată de brand, nu un default. |
| `#f5f7f9` | surface / fundal pagină | 11 | stylesheet2025.css — body{background:#f5f7f9}, #top{background:#f5f7f9}, #menu #menu-list .child-box{background:#f5f7f9} |
| `#666666` | text body | 7 | stylesheet2025.css — body{font-family:"Onest",sans-serif; background:#f5f7f9; color:#666; ...} (scris în formă scurtă #666) |
| `#00757f` | stare hover/active pentru butonul primar (teal închis) | 6 | bootstrap.min.css hand-edited — .btn-primary:hover, .btn-primary:focus, .btn-primary:active {background-color:#00757F;border-color:#00757F}. A înlocuit #286090 (defaultul Bootstrap), deci este ales manual. |
| `#f6f6f6` | surface secundar (carduri produs, taburi) | 5 | stylesheet2025.css — .product-item-nocarousel, .livrare-tabs > li > a |
| `#e4003a` | accent zminy / crimson pentru evidențieri de preț | 4 | stylesheet2025.css (4 ocurențe) |
| `#e0e0e0` | border | 3 | stylesheet2025.css — .manufacturer_image, .grid-manufacturer-center |
| `#272727` | text ink pentru prețuri | 2 | stylesheet2025.css — .box-product .product-item .price, .product-layout .caption .price |
| `#292b31` | text ink pentru recenzii | 2 | stylesheet2025.css — .product-review-username, .product-review-text |
| `#ffd800` | accent galben (stele rating / evidențieri) | 2 | stylesheet2025.css (2 ocurențe) |
| `#ffffff` | surface alb / text pe fundal turcoaz | 100 | stylesheet2025.css, slsoffr.css, seocms.css; și color:#fff în .btn-primary din bootstrap editat |

### Fonturi

- **Onest** — *heading + body (singura familie a brandului — nu există font separat pentru titluri)* · Google Fonts, încărcat variabil: <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap">. CSS-ul returnat conține @font-face-uri pentru weight 100–900, fișiere .ttf servite de fonts.gstatic.com/s/onest/v9/. Declarat în stylesheet2025.css ca font-family:"Onest", sans-serif pe body, .section-title h4, .section-title-home h4, .widget-title, .tov .tov-img span, .tovd .tovd-img span, #footer-map .close-map. body{font-weight:400; line-height:1.5; font-size:1.5rem}; h1{f
- **sans-serif** — *fallback* · system stack (singurul fallback declarat, fără listă intermediară)

### Logo

**Format:** PNG raster cu transparență (255x80 @1x). Fără variantă vectorială, fără @2x, fără variantă inversă/albă.

Wordmark pur, fără simbol/pictogramă separată. logo.png (255x80, PNG RGBA cu fundal transparent, 7258 bytes) redă cuvântul „SMARTINO” cu majuscule grele, sans-serif condensat, italic ușor înclinat, tăiat de o linie/swoosh orizontală care traversează literele; simbolul ® în dreapta sus; sub wordmark, cuvântul „E S H O P” cu literspacing larg. Monocrom: 100.00% din pixelii opaci sunt #00b0ba — NU #67bac4. Marcat în HTML ca <a href="https://smartino.md/"><img src="https://smartino.md/image/catalog/logo.png" title="Smartino Eshop" alt="Smartino Eshop" class="img-responsive" width="255" height="80"></a> în div#logo. Faviconul image_ico.png este separat (36x31 px) și folosește #67bac4 pe alb — deci logo-ul și faviconul NU sunt aceeași nuanță. smartinorologo.jpg și rincomlogo.jpg sunt logo-uri ale entităților afiliate (Smartino Shop Romania, Rincom Grup) plasate în footer, nu variante ale mărcii principale. Nu există niciun <svg> în header (0 elemente svg) și niciun fișier .svg de logo — singurele SVG-uri de pe pagină sunt iconițe de plată (money.svg, credit-card.svg, bank-transfer.svg).

URL-uri:
- https://smartino.md/image/catalog/logo.png
- https://smartino.md/image/catalog/image_ico.png
- https://smartino.md/image/smartinorologo.jpg
- https://smartino.md/image/rincomlogo.jpg

### Imagistică

Exclusiv packshot de produs pe fundal alb pur, fără umbre de studio, fără context, fără oameni, fără fotografie lifestyle. Toate imaginile sunt vizual verificate: 8605 = flacon de șampon DOXA fotografiat frontal pe alb; 8580 = compoziție de multipack Sleepy Ecologic cu 6 pachete stivuite plus o etichetă gri-deschis cu colțuri rotunjite jos, care repetă cantitatea („6x40 bucăți / Sleepy Ecologic”) — acest tip de compozit este furnizat de producător, nu produs de Smartino. Servit de OpenCart prin /image/cache/ cu redimensionare în nume de fișier (-250x250, -120x90, -24x24). Categoriile au iconițe PNG proprii de 24x24 în /image/cache/catalog/ICON/ (scutecepng, serveteleumedepng, copiipng etc.), cu perechi peace-icon/hover-icon pentru starea de hover. Banerele de pe homepage (/image/catalog/banere/2024/) sunt creative de furnizor, nu de brand: 30102024.jpg este un baner Sleepy „bio natural” cu scris de mână alb pe fundal albastru-periwinkle — o culoare care nu apare nicăieri în paleta Smartino. Nu există format WebP, nu există srcset, nu există imagini retina. og:image este setat la placeholderul https://smartino.md/image/catalog/no_image.png (144px).

> ⚠️ **Temporar.** URL-urile de mai jos sunt de pe CDN-ul magazinului, folosite ca placeholder
> în dezvoltare. Se înlocuiesc cu asset-uri primite de la client înainte de lansare.

- https://smartino.md/image/cache/catalog/2026/03/8605-250x250.jpg
- https://smartino.md/image/cache/catalog/2025/08/4423-250x250.jpg
- https://smartino.md/image/cache/catalog/2025/05/8580-250x250.jpg
- https://smartino.md/image/cache/catalog/2024/10/8336-250x250.jpg
- https://smartino.md/image/cache/catalog/2018/01/AlezeIgieniceSleepySensitive9060cm30buc-250x250.jpg
- https://smartino.md/image/catalog/banere/2024/30102024.jpg

### Voce

Registru cald, familial și practic, în română cu diacritice complete, adresare la persoana a II-a singular („îți”, „bebelușul tău”). Singurul pasaj real de copy de brand de pe homepage (blocul de sub footer) este: „La Smartino.md știm că cele mai importante sunt momentele petrecute alături de familie. De aceea alegem produse de încredere pentru cei mici. Scutecele Sleepy oferă delicatețe pentru pielea sensibilă, absorbție eficientă și confort în fiecare etapă de creștere. Cu livrare rapidă în Chișinău și în toată Moldova, îți este ușor să ai mereu la îndemână produsele de care bebelușul tău are nevoie.” — patru fraze, 15–30 de cuvinte fiecare, construite pe „noi știm / noi alegem” (persoana I plural pentru autoritate) urmat de beneficiu concret pentru client. Vocabular emoțional restrâns și repetat: încredere, delicatețe, confort, momente, familie. În rest, restul site-ului NU este redacțional, ci pur funcțional: fraze scurte, declarative, fără adjective, în blocurile de livrare („Livrare gratuită în Chișinău pentru comenzile ce depășesc 300 Lei.” / „Taxa de livrare 90 lei.” / „Livrare 2-5 zile lucrătoare.” / „Achitare în numerar curierului la livrare.”), cu titluri de secțiune încadrate ornamental între liniuțe („- Livrare în Chișinău -”, „- Contacte -”). Microcopy-ul de interfață este consecvent imperativ la persoana a II-a singular: „Adaugă în Coş”, „Vezi Coșul”, „Continuă cumpărăturile”, „Autentifică-te”, „Înregistrează-te”, „Compară Produse”, „Vezi toate”. Titlurile de raft sunt substantive scurte, fără verbe: „Recomandate”, „Produse Noi”, „Promoții”, „Bestseller”, „Reduceri!” (singurul semn de exclamare din navigație). Denumirile de produs sunt dens tehnice și necosmetizate, cu marcă + variantă + gramaj/cantitate în același șir: „Scutece Sleepy BIO Natural Premium Plus+ Marime 4 Maxi, 7-16kg, 42 bucati”, „Hirtie igienica PERFEX Soft & Light 16 role, 3 straturi, 127 foi, Aloe Vera”. Inconsecvență reală de observat: diacriticele sunt aplicate riguros în navigație și în copy-ul editorial, dar lipsesc frecvent în titlurile de produs („Sapun”, „Hirtie igienica”, „bucati”), ceea ce sugerează că denumirile sunt importate din feed de furnizor fără normalizare.

### Lipsuri constatate

- Logo vectorial (SVG/AI/EPS) — nu există niciun fișier .svg de logo și zero elemente <svg> în header; singura sursă este un PNG de 255x80, insuficient pentru print sau scalare
- Variantă inversă/monocromă a logo-ului (alb pe fundal închis) — nu există; footerul și barele turcoaz nu au un logo dedicat
- Logo @2x / retina — nicio versiune peste 255x80
- Favicon în dimensiuni standard — există doar image_ico.png la 36x31 px, dimensiune neconvențională; lipsesc 16x16, 32x32, 180x180 apple-touch-icon, site.webmanifest
- og:image real — este setat la placeholderul https://smartino.md/image/catalog/no_image.png (144px), deci partajările pe rețele sociale nu afișează nicio imagine de brand
- Design tokens / CSS custom properties — zero variabile CSS în tot site-ul; paleta nu poate fi retematizată fără find-replace pe hex
- Sursa oficială a turcoazului de brand — logo-ul (#00b0ba) și CSS-ul/faviconul (#67bac4) folosesc nuanțe diferite, fără niciun document care să stabilească which is canonical
- Font pentru titluri distinct de cel de body — Onest este folosit uniform; nu există ierarhie tipografică definită dincolo de weight
- Fotografie lifestyle proprie — toate imaginile sunt packshot-uri și compozite furnizate de producători (Sleepy, DOXA, PERFEX); brandul nu deține imagini proprii
- Creative de baner propriu — banerele din /image/catalog/banere/ sunt materiale de furnizor, cu palete străine de brand (ex. albastru-periwinkle)
- Imagini moderne — nicio variantă WebP/AVIF, niciun srcset, nicio imagine retina
- Ghid de brand / brand book — nu există niciun document expus public pe site

### Note

CORECȚIE MAJORĂ FAȚĂ DE BRIEF: site-ul NU este Shopify. Este OpenCart cu tema personalizată „coloring”. Prin urmare pașii din metodă care presupuneau Shopify nu se aplică: nu există /cdn/shop/files/, nu există fonts.shopifycdn.com și — cel mai important — nu există CSS custom properties în <style> inline din <head>. Am verificat explicit: grep pentru `--[a-z-]*colou?r[a-z-]*` și `--color-*` returnează ZERO rezultate în toate cele 18 foi de stil descărcate plus cele 4 blocuri <style> inline (774 bytes în total). Toate culorile sunt hex hardcodat.

CUM AM DISTINS CULORILE DE BRAND DE DEFAULT-URILE TEMEI/BIBLIOTECILOR: am împărțit cele 18 fișiere CSS în „scrise pentru brand” (stylesheet2025.css, special_offer.css, slsoffr.css, seocms.css, sla_live_search.css + <style> inline) și „biblioteci vendor” (bootstrap.min.css, font-awesome, owl-carousel, nivo-slider, colorbox, fancybox, datetimepicker, cookieconsent, consent-themes, giftteaser, hover-carousel) și am numărat separat. Distincția este neobișnuit de sigură aici dintr-un motiv concret: dezvoltatorul a făcut find-replace pe bootstrap.min.css însuși. Albastrul default Bootstrap #337ab7 are 0 ocurențe în fișier, fiind înlocuit peste tot cu #67bac4 (a{color:#67bac4}, .btn-primary{background-color:#67bac4}), iar #286090 a fost înlocuit cu #00757F. Faptul că o culoare a fost injectată manual într-o bibliotecă terță este dovada cea mai puternică posibilă că este o alegere de brand, nu un default. Prin contrast, roșul default Bootstrap #d9534f a rămas neatins (3 ocurențe), la fel ca #5bc0de, #d9edf7, #31708f — pe acestea le-am tratat ca reziduu de bibliotecă și nu le-am raportat ca brand. Din același motiv am exclus #339965, #1f90bb, #fce374 (doar în slsoffr.css, modul de ofertă) și #4da1d6, #a9a9a9 (doar în seocms.css, modul SEO) — sunt culori de plugin, nu de brand.

DOUĂ TURCOAZURI REALE, RAPORTATE AMBELE CONFORM INSTRUCȚIUNII: nu am ales eu unul.
(1) #67bac4 — 131 ocurențe totale (82 în CSS-ul de brand + 49 injectate în vendor), plus 5 în <style> inline, plus 31.7% din pixelii faviconului. Aceasta guvernează întreaga interfață: bara de sus, coșul, meniul, chenarul căutării, butoanele primare.
(2) #00b0ba — 100.00% din pixelii opaci ai logo-ului header (logo.png), măsurat cu Pillow. Nu apare NICĂIERI în CSS.
Diferența nu este o eroare de eșantionare: #00b0ba este vizibil mai saturat și mai închis (hue ~186.8, sat 100%, lum 36%) față de #67bac4 (hue 186.5, sat 44%, lum 59%). Practic, logo-ul și interfața nu sunt pe aceeași nuanță. Cel mai probabil logo-ul este activul mai vechi, iar #67bac4 este o versiune deschisă aleasă la refacerea temei din 2025 (numele fișierului stylesheet2025.css). Aceasta trebuie clarificată cu clientul înainte de orice lucrare derivată — dacă produci materiale noi, alegerea greșită va face logo-ul să pară „murdar” lângă UI sau invers. Am căutat explicit alte turcoazuri apropiate (hue 150–215, sat >15%, în toate cele 18 fișiere) și nu mai există niciun al treilea candidat de brand: restul rezultatelor (#00757f, #00b5c4, #5bc0de, #bce8f1, #31708f) provin din biblioteci vendor sau sunt stări derivate de hover.

Culoarea declarată în <meta name="theme-color"> este #f5f5f5 (gri neutru), nu turcoazul — o scăpare, bara de browser pe mobil nu poartă culoarea brandului.

Restul paletei este coerent: un roșu de acțiune #d5383d (hover pe linkuri, stickere de reducere, hover pe „Adaugă în Coș”), un fundal rece foarte deschis #f5f7f9 pentru pagină, gri #666 pentru text. Există totuși zgomot: pe lângă #d5383d mai apar #e4003a, #fc191a, #ff4940 și #a60800 — patru roșuri suplimentare în fișierele de brand, semn că modulele de promoții au fost adăugate în timp fără disciplină de paletă.

Metodă și reproductibilitate: am descărcat homepage-ul (400 KB) și toate cele 18 foi de stil referite, plus logo-ul, faviconul și 6 imagini de pe CDN, toate verificate HTTP 200 cu content-type de imagine. Fișierele de lucru sunt în /tmp/claude-0/-home-user-Smartino-AI/b0085215-90a9-5522-8943-48584556babb/scratchpad/ (md.html, css2/, inline2.css, logo_v.png, fav.png). Fiecare hex raportat mai sus provine dintr-un fișier descărcat efectiv și are selectorul sau măsurătoarea de pixeli citată în câmpul evidence — nimic nu este aproximat.

---

## Contradicții între proprietăți

- BUTONUL PRIMAR PICA AA PE TOATE CELE TREI SITE-URI, SIMULTAN, IN PRODUCTIE. Text alb pe #00bbc5 (shop) = 2.36:1; alb pe #15b7c6 (home) = 2.44:1; alb pe #67bac4 (md, cu color:#fff injectat manual in .btn-primary din bootstrap.min.css) = 2.23:1. Pragul e 4.5:1. Cele trei echipe au ajuns independent la aceeasi eroare, pentru ca toate au presupus ca turcoazul de brand poate purta text alb. La L36-59 niciun turcoaz nu poate. Aceasta nu e o inconsecventa intre site-uri, e o eroare comuna - si e singurul element din audit care are consecinta juridica (accesibilitate) pe langa cea estetica.
- ARTWORK-UL LOGO-ULUI NU CORESPUNDE TOKENULUI CSS PE NICIUNA DINTRE CELE TREI PROPRIETATI. Shop: logo #0dbbca vs token #00bbc5. Home: logo #0fb3c3 vs token #15b7c6. Md: logo #00b0ba vs CSS #67bac4. Primele doua sunt neglijabile (dE76 = 1.6) si se explica prin antialiasing, cum noteaza corect si auditul. A TREIA NU: #00b0ba (S100 L36.5) fata de #67bac4 (S44 L58.6) este o diferenta reala si vizibila, nu artefact de compresie - logo-ul md este dublu saturat fata de interfata pe care sta. Practic, pe smartino.md, sigla si butoanele nu sunt aceeasi culoare, iar diferenta se vede cu ochiul liber.
- PE SMARTINO.MD, LOGO-UL SI FAVICONUL SUNT NUANTE DIFERITE. logo.png este 100,00% #00b0ba; image_ico.png foloseste #67bac4. Doua reprezentari ale aceleiasi marci, in acelasi tab de browser, pe doua turcoazuri distincte.
- SHOP FOLOSESTE PATRU TURCOAZURI IN ACELASI TIMP, DINTRE CARE UNUL NU E NICI MACAR AL LUI. #00bbc5 in tema, #38aebf in widgetul Judge.me (configurat de comerciant, deci alegere umana - o potrivire aproximativa esuata), #2cc6d0 pe hover, si #108474 ramas NESCHIMBAT pe verified_count_badge - acesta din urma e default-ul de fabrica Judge.me (cheia JSON se numeste literal judgeme_brand_color). Un vizitator vede pe aceeasi pagina de produs turcoazul brandului, o aproximare a lui si culoarea unui furnizor de software.
- CULOAREA DE BRAND A LUI HOME EXISTA IN LOGO DAR NU EXISTA IN COD. Gri-teal #b8c9c8, care formeaza cuvantul 'home' - 34% din pixelii opaci ai siglei, deci a doua culoare a marcii - are ZERO ocurente in tot CSS-ul. Jumatate din logotip nu e codificata nicaieri ca variabila. Nimeni nu o poate folosi corect pentru ca nimeni nu stie ca exista.
- TREI SITE-URI, TREI FONTURI, ZERO SUPRAPUNERE. Montserrat (shop), Quicksand (home), Onest (md). Nu exista niciun caracter tipografic comun intre proprietatile aceluiasi grup. Fiecare site e, in plus, mono-font (aceeasi familie pentru titlu si text), deci nu exista nici ierarhie tipografica in interiorul lor. Consolidarea cromatica va face aceasta contradictie MAI vizibila, nu mai putin: odata ce turcoazul e acelasi, singura diferenta ramasa intre site-uri devine fontul.
- NEUTRELE DIVERG MAI MULT DECAT TURCOAZUL, DESI OCUPA 90% DIN ECRAN. Text: #232323 / #000000 / #666666. Fundal: #ffffff / #f1f1f1 / #f5f7f9. Bordura: #e6e6e6 / #ececec / #e0e0e0. Turcoazul are 4,6 grade de variatie; textul are 40% diferenta de luminozitate intre shop si md. Perceptia de 'site-uri diferite' vine in mare parte de aici, nu din accent.
- NOUA ROSURI, FARA NICIO ARMONIZARE. #e9514b, #f42b23, #d62828, #ffa221 (shop); #a33a32, #d62828 (home); #d5383d, #e4003a, #fc191a, #ff4940, #a60800 (md). Auditul shop noteaza corect ca cinci dintre ele coexista in ACELASI bloc :root. Sase din cele noua pica AA. Singurul care apare pe doua site-uri este #d62828.
- SHOP SI HOME LASA AMBELE ACCENTUL DE TEMA GOL, IN MOD IDENTIC. --color-base-accent-1, --color-base-accent-2 si --color-base-accent-text sunt DEFINITE DAR VIDE in :root pe ambele instante Ella. Ambele echipe au ocolit theme editor-ul si au suprascris prin CSS custom cu !important. Consecinta practica pentru orice lucrare viitoare: culoarea de brand nu poate fi schimbata din interfata Shopify pe niciunul dintre site-uri - trebuie editat cod.
- HOME SE CONTRAZICE PE SINE IN ACELASI FISIER DE TEMA. Cardurile de produs au border-radius 24px in inline block 38, dar tokenul --sm-radius-card din custom.css spune 16px. Sistemul de forme e declarat intr-un loc si aplicat cu alta valoare in altul.
- MD NU POATE FI RETEMATIZAT DELOC. OpenCart, tema 'coloring', ZERO custom properties in toate cele 18 foi de stil. Mai grav: dezvoltatorul a facut find-replace direct in bootstrap.min.css (#337ab7 are 0 ocurente, inlocuit cu #67bac4). Orice schimbare de paleta inseamna editarea unei biblioteci terte - si se pierde la prima actualizare a Bootstrap. Cele trei site-uri nu sunt doar cromatic divergente, sunt tehnic incompatibile ca metoda de tematizare.
- TURCOAZUL DE BRAND NU APARE IN NICIO IMAGINE, PE NICIUNA DINTRE PROPRIETATI. Bannerele shop poarta identitatea FURNIZORULUI (Sleepy albastru/alb, Papia, Parex - fiecare cu paleta proprie); bannerul md e periwinkle, o culoare absenta din paleta Smartino; pana si packshot-urile home afiseaza ambalaj cu branding tert vizibil ('5five Simply Smart'). Culoarea de grup traieste exclusiv in chrome-ul de UI. Pe suprafata cea mai mare si mai vizibila a fiecarui site, brandul Smartino este invizibil, iar furnizorii sunt vizibili.
- VOCEA SE CONTRAZICE INTRE PROPRIETATI MAI TARE DECAT CULOAREA. Shop e hard-sell cu superlativ recurent ('cele mai', '-50%', 'Profita acum', majuscule de presiune); home e deliberat retinut (fara superlative, fara semne de exclamare, fara emoji, 'Acasa incepe aici'); md e cald-familial la persoana I plural ('La Smartino.md stim ca...'). Trei branduri de voce distincte. Un sistem cromatic unificat peste trei voci divergente va parea o vopsea aplicata peste, nu o identitate.
- DIACRITICELE AU DOUA STANDARDE PE ACELASI SITE, PE DOUA SITE-URI DIN TREI. Shop: corecte in UI, absente in meta description si in titlurile de blog, cu erori reale de tipar ('curetenia' in loc de 'curatenia', 'Scuece'). Md: riguroase in navigatie si copy editorial, absente in titlurile de produs importate din feed ('Sapun', 'Hirtie igienica', 'bucati'). Doar home e consecvent.
- OG:IMAGE E DEFECT PE TOATE TREI, IN TREI MODURI DIFERITE. Shop reutilizeaza un logo VECHI (logo-smartino-b-*.webp) si il serveste pe http:// nu https://. Home nu are deloc tag og:image. Md il are setat pe placeholderul no_image.png. Orice distribuire pe retele sociale a oricarei pagini a grupului afiseaza fie un logo depasit, fie nimic, fie un placeholder gol.
- NICIUNUL DINTRE CELE TREI LOGO-URI NU ARE VERSIUNE VECTORIALA REALA, DESI UNUL PRETINDE CA ARE. Shop: PNG 200x50. Md: PNG 255x80. Home: fisier .svg care NU contine cai vectoriale, ci doua imagini raster data:image/png plus filtre feColorMatrix, 208 KB pentru un wordmark. Auditul semnaleaza corect si capcana: hexurile #787fc5/#37be2f/#223a57/#0184d1 gasite prin grep in acel SVG sunt FALS POZITIVE, fragmente de id-uri de filtre, nu culori. Un grup cu doua magazine fizice nu poate produce nicio firma luminoasa din aceste fisiere.
- SMARTINO SUPERMARKET NU EXISTA VIZUAL. Primul magazin fizic al grupului, deschis din 11 iulie 2025, nu are site, nu are logo referit nicaieri in patrimoniu, nu are nicio culoare sursa. Brandul cu cea mai lunga prezenta fizica este singurul fara nicio urma digitala - de aceea accentul lui este declarat explicit ca derivat, nu extras.
- META THEME-COLOR PE MD E GRI, NU TURCOAZ. Setat la #f5f5f5. Bara de browser pe mobil, pe cel mai vizibil element de sistem, nu poarta culoarea marcii.

## Sistem cromatic propus pentru grup

CELE 3 AUDITURI SPUN, IMPREUNA, UN SINGUR LUCRU: GRUPUL ARE DEJA O CULOARE, DAR NU A SCRIS-O NICIODATA NICAIERI.

Am luat cele 10 turcoazuri reale extrase din cele 3 site-uri si le-am calculat HSL. Rezultatul e neasteptat de bun:
- shop --btn-1-bg #00bbc5 -> H183.0 S100 L38.6
- shop pixeli logo #0dbbca -> H184.8 S87.9 L42.2
- shop Judge.me #38aebf -> H187.6 S54.7 L48.4
- shop hover #2cc6d0 -> H183.7 S65.1 L49.4
- home --sm-accent #15b7c6 -> H185.1 S80.8 L42.9
- home --sm-accent-deep #0e8c98 -> H185.2 S83.1 L32.5
- home pixeli logo #0fb3c3 -> H185.3 S85.7 L41.2
- md CSS #67bac4 -> H186.5 S44.1 L58.6
- md pixeli logo #00b0ba -> H183.2 S100 L36.5
- md hover #00757f -> H184.7 S100 L24.9

TOATE cele zece cad in banda de hue 183.0-187.6. Un interval de 4,6 grade, pe trei site-uri, doua platforme (Shopify si OpenCart), doua tari si patru echipe care nu au vorbit intre ele. Nu exista divergenta de nuanta. Divergenta e pe saturatie (44 -> 100) si pe luminozitate (24.9 -> 58.6). Adica: nimeni nu a gresit CULOAREA, dar fiecare a ales alt TON al ei, pentru ca nu exista un token comun de la care sa porneasca.

Consecinta directa: consolidarea nu e o schimbare de identitate, e o codificare a uneia care exista deja de facto. Asta scade dramatic riscul proiectului.

CONFIRMARE INDEPENDENTA DIN ARTWORK: media aritmetica RGB a pixelilor celor TREI logo-uri masurate efectiv (#0dbbca shop, #0fb3c3 home, #00b0ba md) este #09b5c2 = H184.2 S91.1 L39.8. Aceasta valoare, care nu vine din niciun CSS ci exclusiv din fisierele de logo, cade la 0,9 grade de #15b7c6, singurul hex din tot patrimoniul care e scris explicit ca token de brand. Codul si artwork-ul, desi produse separat, converg. Asta e dovada ca ancora propusa nu e inventata.

DESCOPERIREA CEA MAI GRAVA, SI CEA MAI ACTIONABILA: butonul primar de pe TOATE CELE TREI site-uri pica AA in acest moment, in productie.
- smartinoshop.ro: text alb pe #00bbc5 = 2.36:1 (necesar 4.5:1)
- smartinohome.ro: text alb pe #15b7c6 = 2.44:1
- smartino.md: text alb (#fff in .btn-primary din bootstrap editat manual) pe #67bac4 = 2.23:1
Butonul "Adauga in cos" al intregului grup este ilizibil conform WCAG AA, pe toate proprietatile, simultan. Cauza e structurala, nu o eroare: turcoazul de brand are L 36-59, iar la aceasta luminozitate NICIUN turcoaz nu poate purta text alb la 4.5:1. Orice sistem de grup trebuie deci sa aiba obligatoriu doua trepte - turcoazul de marca (suprafete, grafica, semnalectica) si o varianta inchisa distincta pentru text si butoane. Aceasta e cerinta care structureaza intreaga propunere de mai jos.

AL DOILEA STRAT AL PROBLEMEI - NEUTRELE, care sunt de fapt mai divergente decat turcoazul:
- text primar: shop #232323, home #000000/#0a0a0a, md #666666
- fundal de pagina: shop #ffffff, home #f1f1f1, md #f5f7f9
- borduri: shop #e6e6e6, home #ececec, md #e0e0e0
Aici nu exista niciun acord. Paradoxal, culoarea "grea" (turcoazul) e aliniata, iar cele 90% din suprafata ecranului (neutrele) nu sunt. Un sistem de grup credibil trebuie sa rezolve neutrele, nu doar accentul - altfel cele trei site-uri vor continua sa "arate diferit" chiar dupa unificarea turcoazului.

AL TREILEA STRAT - rosurile: am numarat noua rosuri/portocalii distincte in patrimoniu (#e9514b, #f42b23, #d62828, #ffa221 pe shop; #a33a32, #d62828 pe home; #d5383d, #e4003a, #fc191a, #ff4940, #a60800 pe md). Un singur hex apare pe doua site-uri simultan: #d62828. E singurul candidat cu legitimitate reala si, verificat, trece AA in ambele sensuri (5.01:1). L-am pastrat ca atare, fara ajustare.

CE NU SPUN AUDITURILE, SI TREBUIE SPUS: niciunul dintre cele trei site-uri nu are turcoazul in IMAGINI. Auditul shop o zice explicit - bannerele preiau identitatea FURNIZORULUI (Sleepy albastru, Papia, Parex), iar md are un banner periwinkle. Turcoazul traieste exclusiv in chrome-ul de UI. Deci culoarea de grup nu are, in acest moment, nicio expresie fotografica. Sistemul cromatic singur nu rezolva asta; e nevoie de productie de imagine proprie (vezi assetsNeeded).

| Hex | Nume | Rol | Derivare |
|---|---|---|---|
| `#15B7C6` | Smartino Teal | Primara de GRUP. Suprafete de marca, semnalectica, banda de header, elemente grafice mari, ambalaj. NU se foloseste niciodata ca text si nu poarta niciodata text alb. | EXTRASA, nu derivata. Este singurul hex din tot patrimoniul scris explicit ca token de brand: --sm-accent in smartinohome.ro/cdn/shop/t/10/assets/custom.css, cu prefix dedicat --sm- (Smartino), referit de 36 de ori prin var(--sm-accent). Este si fisierul cel mai recent modificat din tot estate-ul (v=...1786695039). L-am ales in fata lui #00bbc5 (shop, 59 aparitii) pentru ca #00bbc5 e o valoare setata in theme editor-ul Ella, adica o preferinta de tema, in timp ce #15b7c6 e singurul loc unde cineva a scris efectiv 'aceasta este culoarea Smartino'. Confirmare independenta din artwork: media pixelilor celor trei logo-uri masurate (#0dbbca, #0fb3c3, #00b0ba) = #09b5c2, H184.2, la 0,9 grade de acest hex. Cod si artwork converg. |
| `#0E7D88` | Smartino Teal Deep | Perechea functionala obligatorie a lui Teal. Text turcoaz, linkuri, butoane pline cu eticheta alba, iconografie activa, stari focus. Aceasta este culoarea care rezolva esecul AA din productie. | Derivata direct din #15B7C6: hue si saturatie pastrate (H185.4 vs H185.1, S81.3 vs S80.8), coborata pe luminozitate de la L42.9 la L29.4 - prima treapta la care trece 4.5:1 SI pe alb SI pe Canvas. Nu e o culoare noua: coincide practic cu doua valori care exista deja in patrimoniu, home --sm-accent-deep #0e8c98 (dE76 = 6.0) si md .btn-primary:hover #00757f (dE76 = 3.2). Ambele site-uri inventasera deja, independent, aceasta treapta - sistemul doar o numeste si o unifica. |
| `#14252A` | Ink | Text primar pe toate proprietatile. Inlocuieste cele trei valori divergente de azi: #232323 (shop), #000000/#0a0a0a (home), #666666 (md). | EXTRASA din patrimoniu: este capatul intunecat al gradientului real din home custom.css, linear-gradient(135deg, #0a8a96 0%, #14252a 100%). Nu e un negru neutru inventat - are H193.6 S35.5, adica un cast turcoaz masurabil, deci textul apartine aceleiasi familii cromatice ca marca. Alegerea lui in locul unui #000000 e deliberata: negrul pur al lui home e mai dur decat cere brandul si intra in conflict cu tonul cald al lui Canvas. |
| `#5A6A6E` | Slate | Text secundar, metadate, pret taiat, legende, placeholder. | Derivata din home --sm-text-2 #5a5a5a (valoare reala), rotita la H192 cu S10 pentru a-i da acelasi cast turcoaz ca Ink, astfel incat neutrele sa nu para straine de marca. Costul deciziei e explicit: contrastul scade de la 6.90:1 (gri neutru real) la 5.64:1. Ramane confortabil peste prag, deci schimbul e acceptabil. |
| `#DDE5E6` | Line | STRICT decorativ: separatoare, linii de tabel, chenare de card. NU se foloseste pentru bordura de camp de formular. | Derivata prin medierea celor trei borduri reale existente (#e6e6e6 shop, #ececec home, #e0e0e0 md), cu acelasi cast turcoaz H186.7 S15.3 ca restul neutrelor. |
| `#749499` | Line Strong | Bordura de control interactiv: campuri de formular, select, checkbox, radio, chenar de stare inactiva. Tokenul care lipseste din toate cele trei site-uri de azi. | Derivata pe aceeasi axa cu Line (H188.1 S15.4), coborata la L52.7 - prima treapta care trece 3:1 SI pe alb SI pe Canvas. Niciunul dintre cele trei site-uri nu are acest token azi; toate folosesc bordura decorativa si pe campuri, ceea ce e o neconformitate 1.4.11 pe toata linia. |
| `#F7F6F3` | Canvas | Fundal cald de pagina si de sectiune, alternativa la alb pur. Da grupului un ton de retail fizic, nu de marketplace. | EXTRASA ca atare, fara modificare: home --sm-bg-soft #f7f6f3. Este singurul off-white cald din patrimoniu si singura decizie de suprafata care nu e alb/gri rece. L-am promovat la nivel de grup pentru ca leaga direct de cele doua magazine fizice si contrabalanseaza raceala turcoazului. |
| `#D62828` | Signal | Unica culoare de reducere, pret redus, stoc limitat si urgenta comerciala. Inlocuieste TOATE cele noua rosuri din patrimoniu. | EXTRASA, si e singura alegere cu legitimitate obiectiva: din cele noua rosuri gasite in estate, #d62828 este SINGURUL care apare pe doua site-uri simultan - shop (--product-hot-stock-text-color) si home (block1 inline + custom.css). Nu l-am ajustat deloc pentru ca, verificat, trecea deja AA: dE76 fata de valoarea reala = 0.0. Celelalte opt (#e9514b 3.66:1, #f42b23 4.03:1, #ff4940 3.34:1 etc.) pica AA si se elimina si pe criteriu de accesibilitate, nu doar de disciplina. |
| `#08B3C4` | Accent Smartino Shop | Accent de sub-brand pentru smartinoshop.ro (scutece Sleepy, igiena, curatenie, cosmetice). Cel mai pur cian din familie - registrul clinic-curat, potrivit categoriei de ingrijire. | Calibrata din turcoazul real al brandului: #00bbc5 (--btn-1-bg, 59 aparitii) si pixelii logo-ului #0dbbca. Asezata pe H185.4 S92.2 L40 pentru a intra in rampa comuna. Cost de migrare foarte mic: dE76 = 5.4 fata de tokenul CSS actual si dE76 = 3.3 fata de artwork-ul logo-ului - practic o renormalizare, nu o schimbare de culoare. |
| `#12BAB0` | Accent Smartino Home | Accent de sub-brand pentru smartinohome.ro si pentru magazinul fizic de 1.200 m2 (mobilier, gradina, textile, deco). Deplasat spre verde - registrul natural/domestic, potrivit categoriei de gradina si materiale naturale. | Derivata din turcoazul real al brandului (--sm-accent #15b7c6, H185.1) prin deplasare controlata de hue la H176.4, pastrand S82.4 si L40 identice cu restul rampei. ACEASTA ESTE DECIZIA CEA MAI CONTESTABILA DIN INTREG SISTEMUL si o semnalez ca atare: costa dE76 = 14.9 fata de tokenul actual si 15.7 fata de pixelii logo-ului, adica o schimbare vizibila, aplicata tocmai brandului care are cel mai bine construit sistem de azi. Justificarea e ca Home e singurul sub-brand cu catalog de exterior/gradina, unde virajul spre verde e semantic. OPTIUNEA B, pentru decizia clientului: Home ramane pe hue-ul lui real (#12AABA, dE76 = 5.0) si Shop preia deplasarea spre verde (#08C4B9, dE76 = 12.9). Costul total de migrare al optiunii B este chiar mai mic (17.9 vs 20.3). Nu iau eu decizia; ambele variante sunt sistemic valide si difera doar prin ce brand accepta deranjul. |
| `#10BC98` | Accent Smartino Supermarket | Accent de sub-brand pentru magazinul fizic deschis 11 iulie 2025 (nevoi zilnice ale familiei). Extremitatea verde a familiei - registrul proaspat/alimentar. | DERIVATA IN INTREGIME, NU EXTRASA - o spun explicit pentru ca Smartino Supermarket nu are site, nu are CSS si nu are niciun asset de culoare in patrimoniu. Nu exista nicio valoare sursa de citat. Constructie: am luat ancora de grup #15B7C6 si am aplicat aceeasi regula ca la celelalte - L fixat la 40, S mentinut in banda 82-92 (aici 84.3), hue deplasat la H167.4, capatul verde al rampei. Alegerea capatului verde e semantica (proaspat, alimentar) si oportunista: fiind singurul sub-brand fara mostenire de cod, poate absorbi pozitia cea mai indepartata din familie la cost zero de migrare. Orice alta valoare ar fi fost la fel de arbitrara; aceasta cel putin decurge din regula sistemului. |
| `#0C94C0` | Accent Smartino Moldova | Accent de sub-brand pentru smartino.md (curatenie, scutece Sleepy, igiena). Extremitatea rece a familiei - inrudit vizibil, dar identificabil ca teritoriu propriu. | Derivata din turcoazurile reale ale proprietatii - pixelii logo-ului #00b0ba (H183.2) si UI-ul #67bac4 (H186.5) - prin deplasare la H194.7, capatul albastru al rampei, cu S88.2 L40. Cost de migrare mare si asumat: dE76 = 24.6 fata de logo, 24.2 fata de CSS. Il accept din doua motive concrete: (a) site-ul e OpenCart cu ZERO variabile CSS, deci orice unificare cere oricum find-replace pe hex in 18 fisiere - costul marginal al unei nuante diferite este aproape nul; (b) proprietatea apare operata de RINCOM-GRUP SRL Chisinau, entitate juridica distincta, deci o pozitie usor diferentiata in familie reflecta corect relatia reala si evita sugestia vizuala de detinere. FORMULARE OBLIGATORIE: aceasta valoare este o PROPUNERE catre un operator tert, nu un standard impozabil - adoptarea ei se negociaza, nu se mandateaza. |

### Cum rămân cele patru branduri înrudite

MECANISMUL: o singura axa de variatie, doua constante absolute.

Cele patru accente difera EXCLUSIV prin hue si sunt asezate pe o rampa cu pas regulat de ~9 grade:
- Supermarket H167.4 (verde - proaspat, alimentar)
- Home H176.4 (verde-cian - natural, domestic)
- Shop H185.4 (cian pur - curat, ingrijire)
- Moldova H194.7 (cian-albastru - rece, teritoriu propriu)
Span total: 27,3 grade.

Constanta 1 - LUMINOZITATE IDENTICA: toate patru au L = 40.0, exact. Aceasta e piesa care face sistemul sa functioneze. Doua culori cu aceeasi luminozitate au aceeasi greutate optica: asezate una langa alta pe un raft, pe o punga sau intr-un footer de grup, citesc ca patru variante ale aceluiasi lucru, nu ca patru branduri. Este si motivul pentru care cele patru accente dau contrast aproape identic cu Ink (6.53 / 6.53 / 6.22 / 4.53), deci acelasi component functioneaza neschimbat pe toate patru.

Constanta 2 - SATURATIE IN BANDA INGUSTA: S intre 82.4 si 92.2, un interval de 10 puncte. Toate patru sunt la fel de "vii". Aceasta e constanta pe care patrimoniul actual o incalca cel mai grav - azi saturatiile reale merg de la 44 (md #67bac4) la 100 (shop #00bbc5), motiv pentru care md arata spalacit langa shop.

DE CE SE VAD CA O FAMILIE, NU CA 4 BRANDURI: distanta perceptuala dintre vecinii de pe rampa este dE76 = 15.1 (Supermarket-Home), 16.2 (Home-Shop) si 21.5 (Shop-Moldova). Peste 10 inseamna distinct - deci fiecare sub-brand e identificabil. Dar toate raman in acelasi cadran cromatic verde-cian-albastru, cu L si S blocate, iar extremele (Supermarket-Moldova, dE76 = 51.2) sunt cele mai indepartate doar pentru ca stau la capetele opuse ale ACELEIASI rampe. Este exact definitia unei variatii pe tema: un singur parametru se misca, doi raman inghetati.

ANCORA CADE IN MIJLOC: Smartino Teal #15B7C6 are H185.1, adica se plaseaza intre Home (H176.4) si Shop (H185.4). Culoarea de grup nu e a nimanui in particular si nu e in afara familiei - e centrul ei. Practic, pe orice material de grup (semnalectica Snagov Plaza, bon fiscal, uniforma, sac, comunicare corporate) se foloseste Smartino Teal, iar accentele apar doar cand vorbeste un sub-brand anume. Grupul are o voce, sub-brandurile au dialecte.

REGULA DE COEXISTENTA, valabila pentru toate patru: accentul e pentru suprafata si grafica si NU poarta niciodata text (toate patru pica pe alb: 2.42-3.49:1). Cand un accent trebuie sa poarte cuvinte, se trece automat pe varianta DEEP a aceluiasi sub-brand (#0B8068 / #0C7E78 / #067D89 / #0A799D), care e aceeasi culoare coborata in luminozitate, nu alta culoare. Acelasi hue, acelasi rol, doua trepte. Asta pastreaza inrudirea si in stratul functional, nu doar in cel decorativ.

NEUTRELE SUNT COMUNE SI POARTA ACELASI CAST: Ink, Slate, Line si Line Strong au toate hue 186-194 cu saturatie mica (10-35). Deci pana si textul si bordurile celor patru branduri sunt din aceeasi familie cromatica. Un utilizator care trece de pe Shop pe Home nu vede doar acelasi turcoaz, vede acelasi gri.
