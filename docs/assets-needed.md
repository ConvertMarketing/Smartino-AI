# Asset-uri necesare de la client

> Listă produsă din auditul Fazei 1. Ordonată aproximativ după cât de blocantă e lipsa.
> Nimic din ce urmează nu poate fi substituit prin cod.

- LOGO VECTORIAL DE GRUP (SVG + AI/EPS, contururi convertite) - blocantul numarul unu. Nu exista niciun vector real in tot patrimoniul: shop e PNG 200x50, md e PNG 255x80, iar 'SVG'-ul lui home incapsuleaza raster. Fara acest asset nu se poate produce nicio firma luminosa, niciun print si niciun material peste 300px.
- LOCKUP-URI DE SUB-BRAND, derivate din masterul de grup: Smartino Shop, Smartino Home, Smartino Supermarket, Smartino Moldova - fiecare in varianta orizontala si compacta, cu spatiu de garda si dimensiune minima definite.
- IDENTITATE COMPLETA PENTRU SMARTINO SUPERMARKET - nu exista absolut nimic: nici logo, nici site, nici fisier. Este brandul cu cea mai veche prezenta fizica (11 iulie 2025) si singurul fara niciun asset. Accentul propus #10BC98 este derivat tocmai pentru ca nu exista nicio sursa de extras.
- VARIANTA INVERSA / MONOCROMA A LOGO-ULUI (alb pe fundal inchis) pentru toate cele patru sub-branduri. Lipseste pe toate trei site-urile, desi home are footer #000000 si nav-menu-tab negru, unde logo-ul bicolor turcoaz+gri deschis are contrast slab. Shop are chiar tokenul --logo-color: #ffffff definit in setari, dar niciun fisier alb servit.
- ECHIVALENTE PANTONE + CMYK + VINIL/RAL pentru Smartino Teal #15B7C6 si pentru cele patru accente. Grupul are DOUA magazine fizice (Supermarket din iulie 2025, Home 1.200 m2 din iulie 2026, in Snagov Plaza) si zero specificatie de culoare pentru print, firma luminoasa, folie sau uniforma. Valorile din acest sistem sunt calibrate pentru ecran; conversia trebuie aprobata pe proof fizic, nu calculata.
- FOTOGRAFIE PROPRIE A CELOR DOUA MAGAZINE FIZICE - exterior cu semnalectica, interior pe raioane, fluxul de client, si o imagine care sa arate cele doua magazine vizavi in Snagov Plaza. Acesta este singurul asset care poate demonstra vizual arcul real (un magazin in 2025, 1.200 m2 un an mai tarziu). In acest moment grupul nu detine NICIO fotografie proprie, pe nicio proprietate.
- FOTOGRAFIE DE PRODUS SI DE LIFESTYLE PROPRIE - toate imaginile din patrimoniu sunt packshot-uri din feed de furnizor (nomenclatura 174683_DEB1, 220352B_PACK1 = cod SKU de furnizor), unele afisand branding tert vizibil (5five). Bannerele poarta identitatea furnizorului, nu a Smartino. Consecinta directa: turcoazul de grup nu apare in nicio imagine, deci sistemul cromatic nu are astazi nicio expresie fotografica.
- BRAND GUIDE OFICIAL - document care sa fixeze: paleta de mai jos cu toate perechile de contrast verificate, regula 'accentul nu poarta niciodata text' (cauza esecului AA din productie), rampa de hue a sub-brandurilor, spatiul de garda al logo-ului, si scara tipografica. Nu exista pe niciuna dintre cele trei proprietati.
- DECIZIE TIPOGRAFICA DE GRUP - azi sunt trei fonturi fara nicio suprapunere (Montserrat / Quicksand / Onest). Trebuie ales unul singur, plus definirea unei ierarhii reale titlu/text, care lipseste pe toate trei (fiecare site e mono-font, diferentiaza doar prin greutate). Quicksand e candidatul cu cel mai bun argument: auditul noteaza ca logo-ul home ii este foarte apropiat vizual, deci exista deja coerenta logo-tipografie pe brandul de varf.
- TEXT APROBAT JURIDIC DESPRE GRUP (boilerplate RO + RU/RO pentru Moldova) - obligatoriu inainte de orice material. Trebuie sa foloseasca formulare NEUTRA pentru smartino.md, care apare operat de RINCOM-GRUP SRL Chisinau: nu se afirma ca Smartino International SRL detine acel brand. Cifrele utilizabile sunt strict cele reale si verificate: 2 magazine fizice, 1.200 m2, 4 branduri, 2 tari. Nicio alta cifra nu se inventeaza.
- ACORD SCRIS CU OPERATORUL DIN MOLDOVA privind adoptarea sistemului. Accentul #0C94C0 este o propunere catre o entitate juridica terta, nu un standard impozabil. Fara acest acord, unificarea cromatica se opreste la granita si trebuie planificata ca atare.
- SET COMPLET DE FAVICON SI ICOANE - deficitar pe toate trei: shop are doar WEBP 32x32, home doar PNG 32x32, md un PNG 36x31 la dimensiune neconventionala. Lipsesc peste tot .ico, SVG, apple-touch-icon 180x180, 512px pentru PWA si site.webmanifest.
- IMAGINE DEDICATA DE OPEN GRAPH per proprietate, 1200x630, cu logo pe Smartino Teal. Azi: shop serveste un logo vechi pe http://, home nu are tag og:image deloc, md indica placeholderul no_image.png.
- FISIER DE TOKENI IMPLEMENTABIL, in trei formate, pentru ca cele trei platforme sunt incompatibile: (a) JSON/W3C design tokens ca sursa unica de adevar; (b) settings_data.json pentru cele doua instante Ella - obligatoriu si popularea --color-base-accent-1/2/text, care sunt VIDE pe ambele; (c) o foaie de variabile pentru md, care azi nu are nicio custom property si necesita find-replace pe hex in 18 fisiere, inclusiv in bootstrap.min.css editat manual.
- SPECIFICATIE DE STARI SEMANTICE - success, error, warning, info, coerente cu turcoazul. Azi shop foloseste default-urile Ella necorelate (#5A5A5A success, #D93333 error), iar home are un set --sm-ok/--sm-sale/--sm-warn nedocumentat si nefolosit consecvent. Sistemul propus rezolva doar Signal #D62828; restul starilor raman de definit.
- AUDIT DE ACCESIBILITATE DUPA IMPLEMENTARE, pe toate cele patru proprietati - inclusiv verificarea bordurilor de camp de formular, unde niciun site nu are azi un token conform WCAG 1.4.11 (de aceea sistemul introduce Line Strong #749499, absent peste tot).

## Revizie: fotografii reale pe cardurile din hero

Trei din patru carduri poartă acum imagini reale, obținute din surse publice
ale grupului:

- **Smartino Home** — cadru din filmul de campanie de pe smartinohome.ro
  (clădirea la amurg, vedere aeriană, firma aprinsă). Extras la 1 secundă din
  videoclipul de pe pagina principală.
- **Smartino Shop** — vitrina reală a smartinoshop.ro, capturată din site-ul
  live la raportul cardului, cu ferestrele de cookie-uri și notificări închise
  ca de către un vizitator obișnuit.
- **Smartino Moldova** — la fel, de pe smartino.md.

**Rămâne de la client:** fotografia exterioară a **Smartino Supermarket**
(clădirea la amurg, cu firma aprinsă). Nu există publicată nicăieri accesibil:
nu e pe smartinoshop.ro (nici pe pagina dedicată, nici în articolul de
deschidere), nu e pe smartinohome.ro, iar Google Business și Facebook nu sunt
accesibile din mediul de build. Până atunci cardul poartă câmpul desenat.
Fișierul se pune în `src/assets/photos/` și se leagă în `Hero.astro`.
