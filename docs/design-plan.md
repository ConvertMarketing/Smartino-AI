# Plan de design — smartino.ai

> Produs în Faza 1 de patru direcții independente, evaluate fiecare de două lentile de juriu
> (distincție și fezabilitate), apoi sintetizate. **Necesită aprobare înainte de Faza 2.**

## Clasament

| Direcție | Scor | Verdicte |
|---|---|---|
| culoarul | 13/20 | Distincție și adevăr de brand: **contender** · fezabilitate tehnica + conformitate cu brief-ul (buget perf, touch, a11y AA, reduced-motion, incadrare wireframe): **rework** |
| dir-cota-379 | 12/20 | distincție și adevăr de brand: **rework** · fezabilitate + conformitate cu brief-ul (perf budget, touch, AA, reduced-motion, fold, legal): **rework** |
| facing | 13/20 | DISTINCTIE + ADEVAR DE BRAND (judecata dura, default = nu e distincta): **rework** · Fezabilitate tehnica + conformitate cu brief-ul (buget perf, AA, touch, wireframe, constrangeri juridice): **contender** |
| prag | 12/20 | Distinctie si adevar de brand: **rework** · Fezabilitate tehnica + conformitate cu brief-ul (buget JS/LCP, touch, diferentiere card 01, contrast AA, reduced-motion, incadrare wireframe 1440x900). Am masurat efectiv: gzip pe node_modules, contrast WCAG si OKLCH pe toata paleta, aritmetica grilei si a wireframe-ului.: **rework** |

## Direcția aleasă

CULOARUL — repoziționată și redenumită „VIZAVI". Păstrez mecanismul central (o bandă verticală goală care ține axul paginii și prin care un brand îi răspunde celui din față), dar îi tai premisa neverificată (culoar interior de plaza, pardoseală de terazzo, vitrine care se luminează reciproc) și o re-ancorez în singurul fapt confirmat de brief: cele două magazine fizice sunt vizavi, la 379 de zile distanță.

### De ce a câștigat

Culoarul e singura direcție din cele patru care a luat verdict de „contender" pe lentila de DISTINCȚIE (7/10, cel mai mare scor pe cea mai dură lentilă din tot juriul). Asta contează mai mult decât egalitatea la total cu „facing", pentru că defectele celor două sunt de naturi diferite: culoarul pică pe inginerie (tokenuri de contrast, încadrare verticală, ARIA, bfcache, aritmetică de buget) — tot lucruri care se repară cu calcul și cu o zi de muncă, ceea ce am și făcut mai jos, cu numere. Facing pică pe concept: metafora raftului e luată de la Supermarket (singurul sub-brand fără site) și impusă unui showroom de mobilier de 1.200 m², „facing" e jargon de negociere retailer-furnizor pe care clientul nu l-a rostit niciodată, iar gutter 0 în hero — chiar premisa semnăturii — face exact afirmația juridică interzisă despre smartino.md, sub un H1 care scrie „PATRU BRANDURI PE ACELAȘI RAFT". Nu poți repara asta fără să demontezi semnătura. Distincția e scumpă, ingineria e ieftină; alegi direcția care are distincția și îi cumperi ingineria. În plus, cele patru direcții au convergent independent spre aceeași idee (cardul Supermarket trebuie să fie structural diferit) — semn că ideea e adevărată, nu ingenioasă; culoarul e cadrul în care ea se așază cel mai natural, pentru că e singura direcție în care Supermarketul are deja un partener fizic în față.

### Idei grefate de la direcțiile învinse

- RUPTURA LA MOLDOVA (de la «facing»). Obiectul continuu al paginii — banda — se întrerupe vizibil exact o dată, pe 96 px, înainte de unitatea 04. Am grefat-o pentru că rezolvă simultan două fatalFlaws ale câștigătorului: (a) acuzația că «jumătate din geografia reală e analogie», pentru că 03 și 04 nu mai sunt puse pe pereți opuși prin metaforă, ci pe un registru propriu care TRAVERSEAZĂ banda, și (b) riscul juridic, pentru că statutul distinct al smartino.md devine un fapt spațial, nu o notă de subsol. E singura idee din tot juriul care e adevărată exclusiv despre Smartino.
- CARDUL SUPERMARKET CARE NU POATE FI UMPLUT (convergență între toate cele patru direcții: «vitrina» din culoarul, «mat și înfundat» din facing, «desenat, nu umplut» din cota, «gol de ușă» din prag). Am luat versiunea cota — contur, nu umplere, pentru că e singurul sub-brand fără site, fără logo și fără niciun asset în patrimoniu, deci singurul care nu are cu ce fi umplut — și i-am reparat cele două defecte semnalate: conturul urcă de la #10BC98 (2,27:1, pică 1.4.11) la Line Strong #6E8F94 (3,23:1 pe Canvas), iar controlul devine <a href="#snagov-plaza">, nu <button aria-expanded>, ceea ce repară ARIA greșit, merge fără JS, suportă middle-click și rezolvă focusul gratis.
- PLANUL SVG STATIC TRASAT DIN OSM (de la «prag»), în locul iframe-ului OSM la click propus de culoarul. E strict mai bun: ~8 KB, zero terți, zero consimțământ de cookie, control total al culorii, atribuire ODbL în text. Iframe-ul rămâne neapelat; legătura către hărți e un simplu link text deschis de utilizator.
- TEAL DEEP CA PERECHE FUNCȚIONALĂ OBLIGATORIE (numit independent de «prag» și de «cota»). Îl adopt ca regulă de sistem — accentul nu poartă niciodată cuvinte, cuvintele stau pe treapta DEEP — pentru că e singurul lucru din tot exercițiul care repară o eroare aflată ACUM în producție, simultan pe toate cele trei site-uri (buton primar alb pe turcoaz, 2,23–2,44:1).
- HERO FĂRĂ FOTOGRAFIE, CA DECIZIE ARGUMENTATĂ (de la «cota» și «facing»). Grupul nu deține nicio fotografie proprie, iar toate imaginile din patrimoniu poartă identitatea furnizorului (Sleepy, Papia, Parex, 5five). Un hero cu imagine ar fi literalmente brandul altcuiva pe pagina de grup. Consecință tehnică directă: elementul LCP e text pe fundal solid, deci site-ul e livrabil azi, nu după o sesiune foto.
- CTA CONTURAT, NU PLIN, PENTRU MOLDOVA (de la «prag»). Diferența juridică exprimată ca variantă de componentă, nu ca disclaimer. Se adaugă la ruptura benzii ca al doilea semnal independent.
- MĂSURĂTOAREA REALĂ A ARCULUI (de la «cota», cu eroarea ei reparată). Cota calibra banda în 379 de zile — corect — dar desena marcajul «azi · ziua 410» ÎN interiorul unei benzi de 379 de zile, adică acul ieșea din riglă, și trata Home ca deschidere viitoare deși s-a deschis acum o lună. Păstrez unitatea, arunc marcajul live: segmentul din zona 2 are exact 379 px la ≥1280 (1 px = 1 zi), cu un marcaj major la 365 («un an») și capătul la 379. Se vede cu ochiul liber că al doilea magazin a venit la 14 zile după prima aniversare. Arcul e închis, la timpul trecut, fără contor.

## Paletă finală

| Hex | Nume | Rol | Derivare | Contrast |
|---|---|---|---|---|
| `#F7F6F3` | Canvas | Fundalul implicit al paginii și PARDOSEALA benzii. Off-white cald, singura valoare caldă din sistem. | EXTRASĂ ca atare, fără modificare: --sm-bg-soft din smartinohome.ro/cdn/shop/t/10/assets/custom.css. Singurul off-white cald din tot patrimoniul; celelalte două site-uri folosesc alb pur (#ffffff shop) sau gri rece (#f5f7f9 md). | Ink pe ea 14,63:1 AAA · Slate 5,22:1 AA · Teal Deep 4,69:1 AA · Signal 4,63:1 AA · Line Strong 3,23:1 (prag non-text 3:1) PASS |
| `#14252A` | Ink | Text primar pe toate suprafețele deschise + fundal integral al zonelor 4 și 5. Înlocuiește cele trei valori divergente din patrimoniu (#232323 shop, #000000 home, #666666 md). | EXTRASĂ: capătul închis al gradientului real din home custom.css, linear-gradient(135deg,#0a8a96 0%,#14252a 100%). Nu e negru inventat — are H193,6 S35,5, deci cast turcoaz măsurabil, aceeași familie cromatică cu marca. | Pe Canvas 14,63:1 AAA · pe alb 15,82:1 AAA · pe cele patru tente 14,40–14,67:1 AAA · pe Smartino Teal 6,49:1 AA · alb pe Ink 15,82:1 AAA |
| `#08747E` | Fascia Deep | Capătul deschis al gradientului de fascia (banda de 72 px din capul paginii). Singura suprafață cu gradient din tot site-ul. Poartă EXCLUSIV text alb, un singur nivel tipografic. | DERIVATĂ prin închidere din capătul deschis real al gradientului din home custom.css (#0A8A96, H185,1): hue și saturație păstrate (H185,1 S88,1), L coborât de la 32,2 la 26,3. Motiv nenegociabil: pe valoarea originală #0A8A96 albul dă 4,13:1, adică juriul a avut dreptate — direcția reproducea exact eroarea AA din producție pe care pretindea că o repară. | Alb pe ea 5,51:1 AA PASS (era 4,13:1 EȘEC) · Canvas pe ea 5,10:1 AA PASS. REGULĂ: Slate Inversat dă 2,39:1 pe ea, deci fascia nu are al doilea nivel de text; orice metadată coboară pe Canvas. |
| `#5A6A6E` | Slate | Text secundar pe suprafețe deschise: adrese, program, etichete de bandă, note juridice, legende. | DERIVATĂ din home --sm-text-2 #5a5a5a (valoare reală), rotită la H192 S10 ca să poarte același cast turcoaz ca Ink. Costul e explicit: contrastul scade de la 6,90:1 (gri neutru real) la 5,64:1, rămâne confortabil peste prag. | Pe alb 5,64:1 AA · pe Canvas 5,22:1 AA · pe cele patru tente 5,14–5,23:1 AA. NU se folosește pe Ink (2,80:1 EȘEC) — acolo se trece pe Slate Inversat. |
| `#9BAEB2` | Slate Inversat | Text secundar pe fundal Ink (zonele 4 și 5). Tokenul care lipsește din sistemul de grup și fără de care jumătate din footer ar folosi alb la 60% opacitate, care nu e un token, e o scuză. | DERIVATĂ pe aceeași axă cu Slate (H190,4 S13,0), ridicată la L65,3. Grefată din direcția «prag», care a identificat corect golul. | Pe Ink 6,85:1 AA PASS. NU se folosește pe Fascia Deep (2,39:1 EȘEC) și nici pe suprafețe deschise (2,14:1 pe Canvas). |
| `#DDE5E6` | Line | STRICT decorativ: separatoare de listă, linii în tabelul de program, rosturi de card. Nu atinge niciodată un control sau un câmp de formular. | DERIVATĂ prin medierea celor trei borduri reale existente (#e6e6e6 shop, #ececec home, #e0e0e0 md), cu același cast turcoaz H186,7 S15,3. | Pe Canvas 1,18:1 — sub 3:1 INTENȚIONAT. WCAG 1.4.11 cere 3:1 doar pentru borduri care comunică un control sau o stare. Regula de sistem: orice control folosește Line Strong, niciodată Line. |
| `#6E8F94` | Line Strong | Bordura oricărui control (cardurile-unitate, conturul cardului Supermarket, câmpuri, comutatoare), inelul de focus 2 px offset 2 px, ȘI marcajele de măsură de pe bandă. | DERIVATĂ pe axa neutrelor (H187,9 S15,1), coborâtă la L50,6. Am închis-o deliberat față de #749499 propus de sistemul de grup: la valoarea aceea dădea 3,02:1 pe Canvas și 2,79:1 pe suprafața pe care juriul a demonstrat că e chiar folosită — marjă zero sau eșec. Niciunul dintre cele trei site-uri nu are azi acest token, deci toate au formulare neconforme 1.4.11. | Pe Canvas 3,23:1 PASS · pe alb 3,49:1 PASS · pe cele patru tente 3,18–3,23:1 PASS · pe Ink 4,53:1 PASS. Verificat pe TOATE suprafețele pe care apare efectiv, nu doar pe alb. |
| `#15B7C6` | Smartino Teal | Culoarea GRUPULUI, nu a unui sub-brand: banda de fascia, marcajul de poziție de pe bandă, semnalectica. NU poartă niciodată text și nu e niciodată text pe suprafață deschisă. | EXTRASĂ. Singurul hex din tot patrimoniul scris explicit ca token de brand: --sm-accent în home custom.css, cu prefix dedicat --sm-, referit de 36 de ori. Confirmare independentă din artwork: media pixelilor celor trei logo-uri (#0dbbca, #0fb3c3, #00b0ba) = #09b5c2, H184,2 — la 0,9 grade de această valoare. Codul și artwork-ul converg. | Ink pe ea 6,49:1 AA PASS · ea pe Ink 6,49:1 AA PASS. Ca text pe alb 2,44:1 EȘEC și alb pe ea 2,44:1 EȘEC — exact eroarea live acum pe toate cele trei site-uri, interzisă explicit de sistem. |
| `#0E7A85` | Teal Deep | Perechea funcțională obligatorie a lui Teal: linkuri de grup, butoane pline cu etichetă albă, text turcoaz, inel de focus pe suprafețe deschise. | DERIVATĂ din #15B7C6 (H185,5 S81,0 păstrate, L coborât la 28,8). Coincide practic cu două valori care există deja independent în patrimoniu: home --sm-accent-deep #0e8c98 și md .btn-primary:hover #00757f — două echipe inventaseră deja această treaptă. Am închis-o cu 0,6 puncte L față de #0E7D88 propus de sistemul de grup, pentru că verificarea a arătat că acela pică pe două dintre cele patru tente (4,49:1 pe tenta Shop, 4,44:1 pe tenta Moldova). | Pe alb 5,07:1 AA · pe Canvas 4,69:1 AA · pe cele patru tente 4,62–4,70:1 AA PASS pe toate · alb pe ea 5,07:1 AA. Aceasta e culoarea care repară eșecul AA din producție. |
| `#10BC98` | Accent Smartino Supermarket | Unitatea 01. Exclusiv suprafață și grafică: muchia de răspuns de 3 px, tenta de pagină, marcajul unității în planul din zona 4. Nu poartă niciodată cuvinte. | DERIVATĂ ÎN ÎNTREGIME, nu extrasă — o spun explicit: Smartino Supermarket nu are site, nu are CSS, nu are logo și niciun asset de culoare în patrimoniu, deci nu există nicio valoare sursă de citat. Construcție: ancora de grup #15B7C6, L fixat la 40, S în banda 82–92, hue deplasat la capătul verde H167,4 (proaspăt, alimentar). Fiind singurul sub-brand fără moștenire de cod, absoarbe poziția cea mai îndepărtată la cost zero de migrare. | Ink pe el 6,53:1 AA · el pe Ink 6,53:1 AA · ca text pe alb 2,42:1 EȘEC, deci strict suprafață. |
| `#0A7861` | Deep Supermarket | Treapta care poartă cuvintele unității 01: numele brandului, linkul intern, eticheta din bandă. | DERIVATĂ din #10BC98 (H167,5 S84,6 păstrate, L 40→25,5). Am închis-o cu 3 puncte L față de #0B8068 din sistemul de grup, pentru că acela stătea la 4,52:1 pe tenta proprie — marjă zero prin construcție, exact defectul pe care juriul l-a demonstrat că face semnătura să pice AA. | Pe alb 5,42:1 AA · pe Canvas 5,02:1 AA · pe tenta proprie #ECF9F6 5,02:1 AA · alb pe ea 5,42:1 AA |
| `#12BAB0` | Accent Smartino Home | Unitatea 02. Aceleași reguli ca 01: suprafață, muchie de răspuns, tentă de pagină, marcaj în plan. | DERIVATĂ din turcoazul real al brandului (--sm-accent #15b7c6, H185,1) prin deplasare controlată la H176,4, cu S82,4 și L40 blocate. E decizia cea mai contestabilă din sistemul cromatic și o semnalez ca atare: costă dE76 ≈ 14,9 față de tokenul actual, aplicat tocmai brandului cu cel mai bine construit sistem de azi. Justificare: Home e singurul sub-brand cu catalog de exterior/grădină, unde virajul spre verde e semantic. Opțiunea B din audit (Home rămâne pe hue-ul real, Shop preia deplasarea) e sistemic validă și mai ieftină la migrare — decizia e a clientului, vezi openQuestions. | Ink pe el 6,53:1 AA · el pe Ink 6,53:1 AA · ca text pe alb 2,42:1 EȘEC, deci strict suprafață. |
| `#0B7670` | Deep Home | Treapta care poartă cuvintele unității 02. | DERIVATĂ din #12BAB0 (H176,6 S82,9 păstrate, L 40→25,3). Închisă față de #0C7E78 din sistemul de grup din același motiv ca la 01: acela stătea la 4,56:1 pe tenta proprie. | Pe alb 5,47:1 AA · pe Canvas 5,06:1 AA · pe tenta proprie #ECF9F8 5,07:1 AA · alb pe ea 5,47:1 AA |
| `#08B3C4` | Accent Smartino Shop | Unitatea 03. Cianul pur al familiei — registrul clinic-curat, potrivit categoriei de îngrijire. | CALIBRATĂ din turcoazul real al proprietății: --btn-1-bg #00bbc5 (59 apariții în tema Ella) și pixelii logo-ului #0dbbca. Așezată pe H185,4 S92,2 L40 ca să intre în rampa comună. Cost de migrare foarte mic: dE76 ≈ 5,4 față de tokenul CSS actual și 3,3 față de artwork — practic o renormalizare, nu o schimbare de culoare. | Ink pe el 6,22:1 AA · el pe Ink 6,22:1 AA · ca text pe alb 2,54:1 EȘEC, deci strict suprafață. |
| `#057580` | Deep Shop | Treapta care poartă cuvintele unității 03. | DERIVATĂ din #08B3C4 (H185,4 S92,5 păstrate, L 40→26,1). Închisă față de #067D89 din sistemul de grup, care stătea la 4,50:1 pe tenta proprie — cea mai subțire marjă din tot setul DEEP. | Pe alb 5,44:1 AA · pe Canvas 5,03:1 AA · pe tenta proprie #ECF8F9 5,01:1 AA · alb pe ea 5,44:1 AA |
| `#0C94C0` | Accent Smartino Moldova | Unitatea 04, capătul rece al rampei. Suprafață și marcaj. PROPUNERE către un operator terț, nu standard impozabil. | DERIVATĂ din turcoazurile reale ale proprietății — pixelii logo-ului #00b0ba (H183,2) și UI-ul #67bac4 (H186,5) — prin deplasare la H194,7, S88,2, L40. Cost de migrare mare și asumat (dE76 ≈ 24,6 față de logo), acceptat din două motive: (a) site-ul e OpenCart cu ZERO custom properties, deci orice unificare cere oricum find-replace pe hex în 18 fișiere, inclusiv într-un bootstrap.min.css editat manual — costul marginal al unei nuanțe diferite e aproape nul; (b) proprietatea apare operată de RINCOM-GRUP SRL Chișinău, entitate juridică distinctă, deci o poziție ușor diferențiată reflectă corect relația reală și evită sugestia vizuală de deținere. | Ink pe el 4,53:1 AA PASS dar cu marjă minimă — singurul accent la limită, deci NU se folosește sub 16 px. El pe Ink 4,53:1, aceeași regulă. Ca text pe alb 3,49:1 EȘEC pentru text normal. |
| `#097193` | Deep Moldova | Treapta care poartă cuvintele unității 04, inclusiv CTA-ul conturat (singurul CTA neplin din pagină). | DERIVATĂ din #0C94C0 (H194,8 S88,5 păstrate, L 40→30,6). Închisă față de #0A799D din sistemul de grup, care stătea la 4,51:1 pe tenta proprie. | Pe alb 5,53:1 AA · pe Canvas 5,12:1 AA · pe tenta proprie #ECF6F9 5,04:1 AA · alb pe ea 5,53:1 AA |
| `#D62828` | Signal | Singurul roșu din tot site-ul. O singură apariție posibilă: starea calculată «ÎNCHIS ACUM» a Supermarketului. Nu decorează, nu marchează reduceri (nu se vinde nimic pe pagina asta), nu se folosește preventiv. | EXTRASĂ, cu legitimitate obiectivă: din cele nouă roșuri găsite în patrimoniu (#e9514b, #f42b23, #ffa221, #a33a32, #d5383d, #e4003a, #fc191a, #ff4940, #a60800), #d62828 e SINGURUL care apare pe două site-uri simultan — shop (--product-hot-stock-text-color) și home (block1 inline + custom.css). Nu l-am ajustat deloc: verificat, trecea deja AA. Celelalte opt pică și pe criteriu de accesibilitate, nu doar de disciplină. | Pe Canvas 4,63:1 AA · pe alb 5,01:1 AA · alb pe el 5,01:1 AA, deci merge și ca text, și ca pastilă plină. REGULĂ DE PLASARE: pastila de stare stă pe Canvas, NU pe fascia — pe Fascia Deep muchia ei ar da 1,10:1, sub pragul non-text. Pe Ink dă 3,16:1, deci în zonele 4–5 starea închisă se afișează ca pastilă plină cu etichetă albă, nu ca text roșu. |

## Tipografie

- **Display:** Archivo Variable (Omnibus-Type, Argentina, OFL) — axe wght 100–900 și wdth 62–125, folosită la wdth 100 / wght 600–700 pentru titluri și la wdth 88 / wght 600 EXCLUSIV pentru etichetele de pe bandă, unde lățimea utilă e 120 px. Un singur fișier woff2 variabil, self-host, subset latin + latin-ext.
- **Text:** Onest Variable (OFL) — wght 300–700, self-host woff2, subset latin + latin-ext + cyrillic. Cifre tabulare activate global pe program, CUI, m², date și pe segmentul măsurat din zona 2, prin font-variant-numeric: tabular-nums.

**Justificare:**

Archivo e o grotescă de SEMNALECTICĂ ȘI DE ZIAR, desenată să funcționeze simultan la corp mare și la corp mic — adică exact cele două dimensiuni la care firma asta tipărește efectiv: firma luminoasă de pe fațada din Snagov Plaza și plăcuța de program de pe ușă. O folosesc la wdth 100, NU expandată: juriul a avut dreptate că grotesca extinsă la display e moda curentă a webului, exact ce direcția jura că evită, iar argumentul «literă tăiabilă în vinil» nu cere lățire, cere robustețe și aperturi deschise. Axa wdth rămâne în sistem, dar cu un rol strict funcțional și static — condensare la 88 pentru etichetele din banda de 120 px — nu ca efect animat: juriul a demonstrat corect că animarea axei wdth e layout la fiecare cadru și, în plus, rupe orice aliniere metrică pe care s-ar sprijini compoziția. Onest la text e singura piesă de patrimoniu tipografic care supraviețuiește consolidării: e deja fontul live pe smartino.md, e umanist-cald la 16 px fără să fie infantil, și poartă chirilice — ceea ce contează pentru un grup care operează în două țări și pentru care o versiune RU a proprietății din Chișinău e o posibilitate reală. Consolidarea nu aruncă tot; păstrează piesa care funcționează. Ierarhia se face pe DOUĂ FAMILII cu roluri diferite (semnalectică vs. text curent), nu pe două greutăți ale aceleiași familii — greșeala pe care o fac azi simultan toate cele trei site-uri, fiecare fiind mono-font (Montserrat / Quicksand / Onest, zero suprapunere). Am respins Quicksand deși auditul îi dădea un argument (asemănare cu logo-ul home): e prea moale și prea rotundă pentru un grup care vinde în același catalog cameră de copii ȘI incontinență pentru adulți, are x-height mic și se prăbușește la 14 px pe listele de categorii; iar argumentul cade oricum, pentru că logo-ul trebuie redesenat — nu există niciun vector real în tot patrimoniul. Inter și Poppins sunt interzise explicit și nu folosesc nici substitute mascate (nu Figtree, nu Geist, nu Plus Jakarta, nu Outfit). CORECȚIE DE FOND FAȚĂ DE DIRECȚIA INIȚIALĂ: aceasta afirma că Signika e Omnibus-Type (fals — e Anna Giedryś) și că alegerea fontului e «răspuns direct la haosul de diacritice» din audit. A doua e o eroare de categorie și o repar explicit: «curetenia», «Scuece», «Hirtie igienica» sunt greșeli de copy și de feed de furnizor, pe care niciun font din lume nu le repară — ele se rezolvă printr-o poartă de QA de conținut, nu prin tipografie. Sarcina fontului e strict să randeze ș/ț cu VIRGULĂ dedesubt (U+0218–021B), nu cu sedilă turcească. Asta e o poartă de build obligatorie, verificată pe woff2-ul subsetat efectiv, nu presupusă din documentație; dacă subsetul livrează sedilă, se înlocuiește textul cu Source Sans 3, care are formele corecte garantat.

**Pachete self-host:**

- @fontsource-variable/archivo
- @fontsource-variable/onest
- (rezervă, doar dacă poarta de diacritice pică la verificare) @fontsource-variable/source-sans-3

## Layout

GEOMETRIA. La ≥1280 px: margini 92, conținut 1256, bandă centrală 120 px, două coloane de 568 px (568 + 120 + 568 = 1256, verificat). Banda e clamp(72px, 8.3vw, 136px). Raze: 16 px carduri și amprente, 20 px panouri, 999 px pastile. Fără chenar de pagină, fără coloane editoriale, fără hairline structurale — singurele linii subțiri din tot site-ul sunt marcajele de măsură de pe bandă, în Line Strong la 3,23:1, și ele POARTĂ informație (sunt scara pe care se măsoară cele 379 de zile din zona 2).

CUM SE CITEȘTE BANDA CA GOL — reparație directă a unui fatalFlaw. Direcția inițială făcea culoarul să se citească prin diferența de 4% luminozitate între «pardoseală» #F7F6F3 și «pereți» #EFEDE7, adică 1,083:1, iar rosturile la 1,080:1. Am verificat: pe panouri slabe și în lumină de zi acelea nu se văd deloc, deci conceptul se sprijinea pe ceva sub pragul de percepție. Am eliminat complet pereții. Banda se citește prin TREI semnale toate peste prag: (1) e goală — nu primește niciodată conținut; (2) e flancată de două blocuri cu bordură Line Strong la 3,23:1; (3) poartă marcaje de măsură la 3,23:1. Diferența de umplere între carduri și fundal e 1,00:1 și nu are voie să facă nicio muncă — o spun explicit ca regulă de sistem.

CELE PATRU BREAKPOINT-URI (direcția inițială sărea de la 1440 direct la 390, lăsând nespecificat exact intervalul în care conceptul e cel mai fragil). ≥1280: bandă 120, două coloane 568. 900–1279: bandă 96, coloane 1fr, margini 48. 600–899: banda se rotește — cardurile 01 și 02 se stivuiesc cu un gol ORIZONTAL de 56 px între ele, iar răspunsul traversează pe verticală. <600: identic cu 600–899, gol 44 px, marcaje păstrate. Banda nu devine niciodată o dungă decorativă de 28 px pe margine.

ZONA 1 — HERO. Fascia de 72 px pe gradientul real #08747E→#14252A: sigla grupului la stânga, adresa (SNAGOV PLAZA · DN-1 · TÂNCĂBEȘTI, ILFOV) la dreapta, ambele în alb la 5,51:1, un singur nivel tipografic (Slate Inversat dă 2,39:1 pe fascia, deci nu există al doilea nivel acolo).
H1, Archivo 56 px / lh 1,06, pe două rânduri, la stânga, TRAVERSÂND banda: «Un grup crescut dintr-un singur magazin.» Asta repară fatalFlaw-ul cel mai greu al direcției: arcul real din brief e creștere în TIMP, iar H1-ul inițial («Două magazine, față în față.») făcea titlul grupului despre o geometrie și retrograda propoziția adevărată la subtitlu. Acum faptul e în titlu. Deck-ul de dedesubt, în Slate, poartă geometria: «Primul magazin s-a deschis pe 11 iulie 2025, în Snagov Plaza. Al doilea, 379 de zile mai târziu, vizavi.» Sub el, pe Canvas, pastila de program a Supermarketului.
RÂNDUL A — perechea FIZICĂ, singura care are voie să stea de-o parte și de alta a golului, pentru că e singura care chiar stă așa: 01 Supermarket (stânga, conținut aliniat la dreapta) și 02 Home (dreapta, conținut aliniat la stânga), 568 × 288 fiecare. Ambele umplute cu tenta proprie, bordură Line Strong.
RÂNDUL B — perechea ONLINE, care NU straddle-uiește golul, ci îl TRAVERSEAZĂ: o fâșie de 88 px pe toată lățimea de 1256, conținând 03 Smartino Shop (580) — RUPTURĂ DE 96 px — 04 Smartino Moldova (580). Asta repară al doilea fatalFlaw major: în direcția inițială, 03 și 04 erau puse pe pereți opuși prin ANALOGIE («aceeași relație mutată pe web»), într-o direcție care își revendica legitimitatea din faptul fizic. smartinoshop.ro și smartino.md nu stau față în față nicăieri. Acum nu mai pretind că o fac: sunt cataloage online, nu au adresă, deci golul nu li se aplică și trec peste el. Iar cele 96 px de ruptură — grefate din «facing» — cad exact înainte de 04, și pe toată înălțimea secțiunii Moldova din zona 3 banda nu are marcaje. Statutul juridic distinct devine un fapt spațial.
CARDUL 01, DIFERIT PRIN STRUCTURĂ, NU PRIN STIL. Cele trei branduri cu site au o UȘĂ: casetă cu domeniul și săgeată de ieșire, <a> real către exterior. Supermarketul nu are cu ce fi umplut — e singurul sub-brand fără site, fără logo și fără niciun asset în tot patrimoniul, și totuși primul magazin fizic al grupului. Deci e singurul card DESENAT, nu umplut: fără tentă, contur 2 px Line Strong la 3,23:1 (nu conturul în accent la 2,27:1 propus de «cota», care pica 1.4.11 pe chiar elementul-vedetă), podea hașurată în Line, iar în locul domeniului poartă programul viu. Și e <a href="#snagov-plaza">, nu <button aria-expanded>: aria-expanded înseamnă disclosure care se deschide pe loc, deci era ARIA greșit; ancora merge fără JS, suportă middle-click și copy-link, și rezolvă focusul gratis. Trei uși duc afară din site, a patra duce mai adânc în el.

ZONA 2 — TIMPUL, PE O SINGURĂ AXĂ. Aici repar fatalFlaw-ul de clișeu: direcția inițială se apăra explicit de linia de timp ORIZONTALĂ și intra direct în cea verticală — conținut alternând stânga/dreapta față de o axă centrală ESTE pattern-ul de timeline alternat. Nu mai alternez nimic. Cele două evenimente stau pe ACEEAȘI axă, unul sub altul, pentru că în TIMP relația lor e de descendență, nu de opoziție — față în față e o relație de SPAȚIU și trăiește în zona 1 și în zona 4. Banda devine un segment măsurat de exact 379 px la ≥1280 (1 px = 1 zi, mapare reală și verificabilă): 11.07.2025 sus, marcaj minor la fiecare ~30,4 px (o lună), marcaj MAJOR la 365 px etichetat «un an», capăt la 379 px, 25.07.2026. Se vede cu ochiul liber că al doilea magazin a venit la 14 zile după prima aniversare. Arcul e ÎNCHIS și la timpul trecut — azi e 25 august 2026, Home s-a deschis acum o lună; direcția inițială îl trata ca deschidere viitoare, iar «cota» desena marcajul «azi · ziua 410» în interiorul unei benzi de 379 de zile, adică acul ieșea din riglă. Fără contor, fără cifre care urcă. Sub segment, cele patru cifre verificate, gravate: 2 magazine fizice · 1.200 m² · 4 branduri · 2 țări. Imediat sub ele, pe același obiect, nu în subsol: «smartino.md este operat de RINCOM-GRUP SRL, Chișinău.»

ZONA 3 — PATRU UNITĂȚI. Câte o secțiune, în ordinea 01→02→03→04, care e simultan cronologia reală (fizic 2025, fizic 2026, online, altă țară) și ordinea crescătoare a rampei de hue (167,4→176,4→185,4→194,7). Fundalul paginii ia tenta unității curente. Fiecare: nume, ce vinde, sloganul propriu unde există («Tot ce ai nevoie, într-un singur loc» la Shop, «Acasă începe aici.» la Home), 3–5 categorii reale, o singură ieșire. Supermarket: fără link extern, tabel de program și ancoră la zona 4. Moldova: banda nu are marcaje pe toată înălțimea secțiunii, CTA-ul e CONTURAT, nu plin — singurul din pagină — și poartă formularea neutră; nicio afirmație de deținere.

ZONA 4 — SNAGOV PLAZA. Fundal Ink. Banda se deschide la lățime totală și devine ce a fost tot timpul: spațiul măsurat dintre două amprente. Plan vectorial SVG static, ~8 KB, trasat din date OSM cu atribuire ODbL în Slate Inversat (6,85:1) — grefat din «prag», strict mai bun decât iframe-ul la click: zero terți, zero consimțământ, control total al culorii. Două amprente PLINE cu raza 16 px, în accentele proprii, față în față, DN-1 ca fâșie lată pe o latură. Doar DOUĂ amprente — nu patru: direcția inițială desena un plan cu unitățile 01–04, sugerând spațial patru unități ale grupului, inclusiv cea asupra căreia nu se poate afirma posesie. Sub plan: adresa completă, cele două date de deschidere la timpul trecut, tabelul de program cu cifre tabulare, starea live, și un link text «Deschide în hărți».

ZONA 5 — FOOTER. Continuu cu zona 4, tot pe Ink. SMARTINO INTERNATIONAL SRL, CUI RO37843488, Snagov Plaza, Șos. București-Ploiești DN-1, 075100 Tâncăbești, jud. Ilfov. Cele patru domenii, Moldova marcat ca operat de terț. ANPC-SAL și SOL ca linkuri text pe URL-urile oficiale, cu marcaje desenate în sistem și găzduite local — nu badge-uri de pe alt domeniu. Banda iese din cadru în jos, netăiată.

## Hero — wireframe

```
1440 × 780 px VIEWPORT REAL (nu 900 — pe un ecran de 1440×900 viewportul de browser e ~780;
direcția inițială bugeta pe 900 și nu încăpea nici acolo: ~914 px de conținut. Aici totul e calculat.)

y=0   ╔══════════════════════════════════════════════════════════════════════════════════════╗
      ║▓▓ SMARTINO                              SNAGOV PLAZA · DN-1 · TÂNCĂBEȘTI, ILFOV   ▓▓║ h=72
 y=72 ╠══════════════════════════════════════════════════════════════════════════════════════╣
      ║   gradient REAL #08747E→#14252A · alb 5,51:1 · UN SINGUR nivel de text pe fascia     ║
y=100 ║                                    ┆                                                  ║
      ║  Un grup crescut                   ┆                                                  ║ H1 56px
      ║  dintr-un singur magazin.          ┆    ← H1 TRAVERSEAZĂ banda. Titlul e despre        ║ lh 1.06
y=219 ║                                    ┆      CREȘTERE, nu despre geometrie.               ║ h=119
y=245 ║  Primul magazin s-a deschis pe 11 i┆ulie 2025, în Snagov Plaza.                        ║ deck
      ║  Al doilea, 379 de zile mai târziu,┆vizavi.                                            ║ 2×26
y=311 ║  ( ● DESCHIS ACUM · până la 22:00 ) ┆   pastila stă pe CANVAS, nu pe fascia:            ║ h=32
y=343 ║                                    ┆   pe fascia muchia ei dă 1,10:1                   ║
      ║                                    ┆                                                  ║
y=373 ║ ┌────────────────────────────────┐ ┆ ┌────────────────────────────────┐                ║
      ║ │ 01              SUPERMARKET  │ ┆ │  HOME                      02  │                ║
      ║ │      nevoi zilnice · fizic   │ ┆ │  1.200 m² · online + fizic     │                ║
      ║ │                              │ ┆ │  deschis pe 25 iulie 2026      │                ║
      ║ │  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐  │ ┆ │                                │                ║
      ║ │  ╎ ● DESCHIS · L-V 07-22 ╎  │ ┆ │   ┌──────────────────────┐     │                ║ h=288
      ║ │  ╎   S-D 08-21           ╎  │ ┆ │   │ smartinohome.ro   ↗  │     │                ║
      ║ │  ╎ ///// fără site ///// ╎  │ ┆ │   └──────────────────────┘     │                ║
      ║ │  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘  │ ┆ │        ▲ UȘĂ — <a> spre exterior│                ║
      ║ │   ▲ DESENAT, nu umplut.      │ ┆ │                                │                ║
      ║ │     contur 2px Line Strong   │◀┆▶│  ◀── muchia de RĂSPUNS 3px      │                ║
      ║ │     3,23:1 (NU accent 2,27:1)│ ┆ │      în DEEP-ul EXPEDITORULUI   │                ║
y=661 ║ └────────────────────────────────┘ ┆ └────────────────────────────────┘                ║
      ║   <a href="#snagov-plaza">        ┆    banda arată direcția + eticheta „01 →"        ║
y=681 ║ ┌──────────────────────────┐▪▪▪▪▪▪▪┆▪▪▪▪▪▪▪┌──────────────────────────┐                 ║
      ║ │ 03  SHOP   scutece ·     │       ┆ RUP-  │ 04  MOLDOVA  curățenie · │                 ║ h=88
      ║ │     igienă · curățenie   │       ┆ TURĂ  │     operat de RINCOM-GRUP│                 ║
      ║ │     smartinoshop.ro   ↗  │       ┆ 96 px │     smartino.md       ↗  │                 ║
y=769 ║ └──────────────────────────┘       ┆       └──────────────────────────┘                 ║
y=780 ╚══════════════════════════════════════════════════════════════════════════════════════╝

   coloana STÂNGĂ 568 px     │ GOLUL 120 px │     coloana DREAPTĂ 568 px      (568+120+568=1256)

   RÂNDUL A = perechea FIZICĂ. Singura care stă de-o parte și de alta a golului,
              pentru că e singura care chiar stă așa în Snagov Plaza.
   RÂNDUL B = perechea ONLINE. NU straddle-uiește golul — îl TRAVERSEAZĂ.
              Shop și Moldova nu stau față în față nicăieri; nu pretind că o fac.
              Ruptura de 96 px cade înainte de 04 și continuă pe toată secțiunea Moldova.

   BUGET VERTICAL VERIFICAT: 72 + 28 + 119 + 18 + 52 + 14 + 32 + 30 + 288 + 20 + 88 = 761 ≤ 780
   19 px slack real. La viewport 900: +139 px, intră și banda de stare de jos.


390 × 844 — GOLUL SE ROTEȘTE (semnătura NU dispare pe mobil)
┌────────────────────────────────────┐
│▓ SMARTINO          SNAGOV PLAZA ▓  │ 56
├────────────────────────────────────┤
│ Un grup crescut                    │ H1 34px
│ dintr-un singur magazin.           │
│ 379 de zile între ele.             │
│ ( ● DESCHIS · până la 22:00 )      │
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ 01 SUPERMARKET  ● DESCHIS      │ │ desenat, contur 3,23:1
│ │    ///// fără site /////       │ │
│ └────────────────────────────────┘ │
│ ▪▪▪▪▪▪▪▪ GOL 56px ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪ │ ← golul, ORIZONTAL
│ ┌────────────────────────────────┐ │   răspunsul traversează
│ │ 02 HOME  1.200 m²              │ │   pe VERTICALĂ, în jos
│ │    smartinohome.ro          ↗  │ │
│ └────────────────────────────────┘ │
│ ┌──────────────┐▪▪▪┌─────────────┐ │ rândul B, ruptura păstrată
│ │ 03 SHOP    ↗ │RUP│ 04 MOLDOVA ↗│ │
│ └──────────────┘TUR└─────────────┘ │
└────────────────────────────────────┘
  Fără hover pe touch: starea e condusă de tap (activare) și de
  IntersectionObserver la scroll. Nu e o degradare — e același mecanism,
  rotit 90°. Golul rămâne gol, marcajele rămân la 3,23:1.
```

## Element signature — VIZAVI — golul care răspunde

O singură bandă verticală goală, prezentă de la primul până la ultimul pixel al scroll-ului, pe care se sprijină tot layout-ul și care nu primește niciodată conținut. Poartă trei lucruri și numai trei: (1) MĂSURA — marcaje în Line Strong la 3,23:1, care în zona 2 devin scara reală pe care se măsoară cele 379 de zile, cu un marcaj major la 365 și capătul la 379; (2) POZIȚIA — un marcaj care coboară cu scroll-ul și trece prin dreptul fiecărei unități; (3) RĂSPUNSUL — când activezi unul dintre cele două magazine fizice, celălalt răspunde: o riglă de 2 px traversează golul dinspre expeditor spre destinatar în 220 ms, iar cardul din față primește o muchie de 3 px în culoarea DEEP a EXPEDITORULUI, plus o etichetă în bandă («01 →»). Hover pe Supermarket și Home răspunde; hover pe Home și răspunsul se întoarce. Și banda SE RUPE exact o dată, pe 96 px, înainte de unitatea 04, și rămâne fără marcaje pe toată secțiunea Moldova. La final, în zona 4, aceeași bandă se deschide la lățime totală și se dovedește a fi spațiul dintre cele două amprente din Snagov Plaza. Ai mers pe el toată pagina.

### Tehnică

CSS pur, ZERO bibliotecă de animație. Am scos GSAP, ScrollTrigger și Lenis din direcție complet, și am măsurat de ce: în node_modules-ul acestui repo, gzip -9 dă gsap.min 28.268 B, ScrollTrigger.min 17.998 B, Flip.min 9.706 B, lenis.min 5.431 B. Direcția inițială cita «~28 KB» pentru GSAP+ScrollTrigger — subestimare de 55% — și plătea 18 KB de ScrollTrigger ca să facă un translateY pe un punct, adică 30% din tot JS-ul paginii pentru o singură proprietate. Un IntersectionObserver de 20 de linii face același lucru. Lenis iese și el pentru un al doilea motiv: e cel mai mare ofensator vestibular de pe pagină (hijack de scroll) și direcția inițială nu îl trata deloc sub prefers-reduced-motion. Implementare: fiecare card setează două custom properties pe container (--from-deep, --dir) la pointerenter/focusin/tap; rigla de traversare și muchia de răspuns sunt elemente absolute animate EXCLUSIV prin transform: scaleX/translate3d și opacity — compozitate, fără repaint, fără filter, fără box-shadow animat. Fundalul de pagină NU își animă background-color (asta ar fi repaint pe tot viewportul): sunt patru straturi position:fixed pre-randate cu tentele, se schimbă doar opacitatea. Marcajele de măsură sunt un singur repeating-linear-gradient. Poziția e un IntersectionObserver pe cele patru secțiuni. Programul: un singur Intl.DateTimeFormat cu timeZone Europe/Bucharest. NU folosesc WebGL și nici canvas 2D, și n-ar avea ce căuta: nu e nimic fluid, organic sau generativ de simulat — un gol între două volume e o geometrie ortogonală, iar un shader ar adăuga ~120 KB, un context GPU și o regresie de LCP ca să deseneze ce desenează două gradiente. Regula din brief (fără WebGL sub 768 px sau hardwareConcurrency≤4) devine irelevantă prin construcție, nu prin ramificare. NAVIGAREA NU MAI E ÎNTÂRZIATĂ: direcția inițială punea 480–620 ms de preventDefault înainte de fiecare click de ieșire, pe chiar acțiunea de conversie a site-ului. Am scos-o. Linkurile sunt <a> reale, navigarea pleacă imediat, iar tenta de ieșire de 160 ms rulează în paralel cu navigarea deja pornită, declanșată pe pointerdown, fără preventDefault — deci zero latență adăugată, zero bug de cmd/ctrl/middle-click, zero risc de ecran colorat blocat la revenirea din bfcache (plus guard pe pageshow.persisted). preconnect către domeniul țintă la pointerenter.

### Buget de performanță

~4,5 KB gzip JS propriu, TOTAL pe pagină — nu 40, nu 61. Defalcare: controller de răspuns 1,2 KB (pointerenter/focusin/tap setează două variabile CSS), IntersectionObserver pentru poziție și tente 1,1 KB, stare de program cu Europe/Bucharest și listă de sărbători legale 1,4 KB, tentă de ieșire + preconnect 0,8 KB. Plus ~2,6 KB gzip CSS de gradiente și tranziții. Fonturi: două variabile subsetate, ~72 KB în două fișiere woff2, preîncărcate, cu fallback size-adjust pe Arimo (metric-compatibil pentru Archivo la wdth 100 — și de asta NU animez axa de lățime: pentru un display expandat la wdth 125 nu există fallback metric-compatibil, iar H1-ul pe două rânduri ar face rewrap la swap, adică CLS pe chiar elementul LCP). Total ≈ 3% din bugetul de 150 KB, față de 41% în direcția inițială. Impact pe LCP: zero-negativ. Elementul LCP e H1-ul, text pe fundal solid, fără nicio imagine deasupra pliului — grupul nu deține oricum nicio fotografie proprie, deci direcția e livrabilă azi. Pastila de program are min-width rezervat în ch cu cifre tabulare, iar în HTML se randează șirul NEUTRU («L–V 07:00–22:00 · S–D 08:00–21:00»), nu starea calculată: nu există trigger de tip schedule în .github/workflows, doar push și workflow_dispatch, deci orice stare coaptă la build ar fi înghețată la ultimul deploy și Google ar indexa «DESCHIS» pentru totdeauna. Starea live apare doar după hidratare, cu tratare de sărbători legale — altfel pe 25 decembrie site-ul afirmă public ceva fals unui om care conduce până la Tâncăbești. Harta e SVG inline ~8 KB, zero terți, deci zero cost de terță parte în măsurătoarea Lighthouse.

### prefers-reduced-motion

Complet, nu parțial — direcția inițială acoperea lumina, wipe-ul și punctul, dar tăcea exact pe Lenis și pe scrub, care erau cei mai agresivi. Aici: nu există Lenis și nu există scrub, deci problema dispare din construcție. Sub prefers-reduced-motion: reduce — răspunsul apare INSTANT, fără riglă care traversează (muchia și eticheta comută în 0 ms); tenta de pagină comută în 0 ms în loc de 400 ms; marcajul de poziție sare între unități în loc să gliseze; tenta de ieșire nu se randează deloc; nu există nicio animație infinită nicăieri în pagină (fără puls pe pastila de stare, fără segment care alunecă pe bandă) — le-am eliminat din spec, nu doar le opresc sub media query, pentru că o animație infinită pe o pagină de grup nu are ce comunica. Sensul se transmite integral: cine e activ se vede din muchie și din etichetă, nu din mișcare.

## Sistem de mișcare

- **durations:** Patru valori, atât. 0 ms — comutări sub reduced-motion și toate schimbările de stare de la tastatură. 160 ms — muchia de răspuns, stările de focus/hover pe controale, tenta de ieșire (care rulează în paralel cu navigarea deja pornită, deci nu adaugă latență). 220 ms — traversarea riglei prin gol, singura mișcare care parcurge distanță. 400 ms — crossfade-ul tentei de pagină, pe opacitate între straturi fixed pre-randate. Nicio durată peste 400 ms în tot site-ul, și niciun ms de întârziere artificială înaintea unei navigări: direcția inițială avea 500 ms de wipe + navigare la 480 ms pe acțiunea de conversie, iar «facing» avea 620 ms. Ambele plăteau taxă exact pe clasa de device majoritară.
- **easing:** cubic-bezier(.22,.61,.36,1) pentru traversare — decelerare, pentru că rigla ajunge undeva anume și se oprește acolo. cubic-bezier(.4,0,.2,1) pentru schimbările de stare (muchii, focus, borduri). linear pentru crossfade-urile de opacitate ale tentelor, pentru că orice curbă pe un crossfade de fundal produce o pată vizibilă la mijloc. Zero easing elastic, zero overshoot, zero bounce.
- **stagger:** Practic inexistent, și e o decizie. La încărcare nu se animează nimic — nici carduri care intră, nici text care se scrie, nici cifre care urcă: cele patru cifre din zona 2 sunt fapte verificate, stau gravate și nemișcate. Singurul decalaj din tot site-ul e cel de 60 ms dintre sosirea riglei în golul dintre carduri și aprinderea muchiei pe cardul din față — și nu e stilistic, e timpul de traversare: dacă muchia s-ar aprinde simultan cu plecarea riglei, n-ar mai exista un «de la» și un «către», adică s-ar pierde exact singurul lucru pe care semnătura îl comunică. Marcajele de măsură de pe bandă nu se animează niciodată.

## Riscuri

- RAMPA DE 27,3° NU E FIABIL DISTINGIBILĂ, ȘI NU O POT REPARA FĂRĂ SĂ DEMONTEZ SISTEMUL CROMATIC EXTRAS. Cele patru accente sunt patru turcoazuri la L=40 exact, separate de ~9° de hue. Juriul a avut dreptate pe ambele lentile: la orice opacitate, reflexul lui 01 și al lui 02 arată la fel, iar cele patru tente de pagină sunt la 1,00–1,02:1 între ele, adică perceptual identice. MITIGARE STRUCTURALĂ, nu cosmetică: culoarea nu poartă niciodată singură informație (conform WCAG 1.4.1). Identificarea e făcută de POZIȚIE (care card are muchia), de TEXT (eticheta «01 →» din bandă) și de DIRECȚIE (dinspre unde vine rigla); culoarea doar confirmă. RISCUL RĂMAS: un client care se așteaptă la «patru culori de brand vizibil diferite» nu va primi asta, și nu are cum, pentru că L identic e chiar mecanismul care face cele patru să citească drept familie, iar valorile sunt extrase din CSS-ul și din pixelii logo-urilor reale. A le depărta cromatic ca să pară mai originale ar rupe legătura cu patrimoniul. Trebuie spus clientului înainte de execuție, nu după.
- PREMISA SPAȚIALĂ E VERIFICATĂ DOAR CA «VIZAVI». Am tăiat tot ce era escaladare (culoar interior de plaza, pardoseală de terazzo, vitrine care se luminează reciproc, lumină care traversează) și am păstrat exclusiv faptul din brief: cele două magazine se privesc, la 379 de zile distanță. Dar zona 4 desenează o geometrie concretă — două amprente față în față cu DN-1 pe o latură — și aceea NU e verificată. Dacă planul de amplasament arată altceva (unitățile nu sunt direct una în fața celeilalte, sau sunt despărțite de parcare și nu de un gol propriu-zis), desenul din zona 4 se schimbă. E o poartă de build, nu o presupunere: nu se desenează planul până nu vine planul de amplasament sau o fotografie proprie. Restul site-ului supraviețuiește neatins, pentru că nicăieri altundeva nu afirm o geometrie anume.
- SEMNĂTURA CERE DOUĂ MAGAZINE FIZICE ȘI NU SCALEAZĂ LA TREI. Răspunsul prin gol funcționează exact pentru că sunt DOUĂ unități fizice și stau față în față. Dacă grupul deschide un al treilea magazin fizic, mecanismul nu se extinde — nu există «în față» pentru trei. Rândul B (online, care traversează golul) scalează la 5–6 branduri fără să se strice, dar rândul A nu. Asta e legat direct de openQuestions despre sub-branduri noi în 12 luni, și e o decizie de arhitectură care trebuie luată ÎNAINTE de execuție, nu după.
- SMARTINO SUPERMARKET NU ARE NICIO SURSĂ VIZUALĂ. Accentul #10BC98 e derivat integral, nu extras — nu există CSS, nu există logo, nu există niciun fișier. Cardul lui e cea mai bună piesă din tot exercițiul tocmai pentru că exprimă această absență, dar în momentul în care brandul primește o identitate reală, valoarea trebuie renegociată. Riscul e că am proiectat în jurul unui gol care se va umple.
- ACCENTUL MOLDOVA E O PROPUNERE CĂTRE O ENTITATE TERȚĂ, NU UN STANDARD IMPOZABIL. Dacă RINCOM-GRUP nu adoptă #0C94C0, cardul 04 și secțiunea Moldova trebuie să funcționeze cu un tratament neutru (Slate + Line Strong, fără accent). Design-ul tolerează asta prin construcție — ruptura benzii și CTA-ul conturat nu depind de culoare — dar trebuie construit de la început cu acest fallback, nu adăugat ulterior.
- GRUPUL NU DEȚINE NICIO FOTOGRAFIE PROPRIE. Direcția e construită special ca să fie livrabilă azi fără imagini, și asta e o forță tehnică reală (LCP = text pe fundal solid). Dar un grup de retail fără nicio fotografie a propriilor magazine va arăta abstract lângă orice concurent, iar cele două magazine fizice sunt chiar argumentul central al paginii. Nu e un defect de design, e un blocant de conținut — dar nu se rezolvă din design.
- VERIFICĂRILE TIPOGRAFICE SUNT PORȚI DE BUILD, NU AFIRMAȚII. Trei lucruri trebuie confirmate pe woff2-ul subsetat efectiv, înainte de orice livrare, nu presupuse din documentație: ș/ț cu virgulă dedesubt (U+0218–021B), nu sedilă; cifre tabulare reale în Onest pentru program, CUI și segmentul măsurat; și acoperirea chirilică dacă versiunea RU devine reală. Direcția inițială a pierdut puncte de credibilitate afirmând o proveniență falsă (Signika ca Omnibus-Type); nu repet greșeala — dacă o poartă pică, se schimbă fontul, nu specificația.
- AUDITUL NU E VERIFICABIL ÎN REPO. Am confirmat: docs/ e gol. Toate valorile pe care se sprijină paleta — --sm-accent, --sm-bg-soft, gradientul din home custom.css, cele 59 de apariții ale lui #00bbc5, eșecurile AA din producție — provin din documentul de audit, nu dintr-un artefact prezent aici. Am recalculat eu toate raporturile de contrast din paletă (și am găsit trei eșecuri reale pe care le-am reparat), dar PROVENIENȚA hexurilor rămâne pe încrederea în audit. Prima sarcină de execuție e să se depună auditul în docs/ și să se re-verifice cele trei hexuri-cheie direct pe site-urile live.

## De clarificat cu clientul

> Acestea NU se rezolvă intern. Necesită răspuns de la client.

- RELAȚIA JURIDICĂ CU SMARTINO.MD / RINCOM-GRUP SRL — întrebarea numărul unu, și blochează copy-ul, nu doar designul. Ce este exact: licență de marcă, franciză, distribuție, parteneriat, sau doar o coincidență de nume tolerată? Formularea exactă, aprobată de un avocat, care poate apărea pe smartino.ai despre această proprietate? Are voie smartino.md să apară în numărătoarea «4 branduri» a grupului, sau numărătoarea trebuie calificată? Are Smartino International dreptul să impună sau măcar să propună sistemul cromatic acestui operator, și există un acord scris? Design-ul livrează trei semnale independente de distincție (ruptura de 96 px a benzii, CTA conturat, formulare neutră) și un fallback complet fără accent — dar nu pot decide eu care e adevărul juridic, și e singurul loc din proiect unde o greșeală are consecință dincolo de estetică.
- VERSIUNE EN — și, separat, RU. Site-ul e RO-only în această propunere. Grupul operează în două țări; există intenție de expansiune, investitori, sau furnizori internaționali care ar cere EN? Și, distinct: proprietatea din Chișinău ar putea avea nevoie de RU — am ales Onest la text tocmai pentru că poartă chirilice, deci decizia e reversibilă ieftin ACUM și scumpă mai târziu. Dacă răspunsul e da la oricare, se schimbă structura de rutare (Astro i18n), bugetul de subset al fonturilor și lungimile de linie din hero, unde H1-ul e calculat pe metrica propoziției românești.
- SUB-BRANDURI NOI ÎN URMĂTOARELE 12 LUNI — întrebare de arhitectură, nu de gust, și trebuie răspunsă înainte de execuție. Arhitectura propusă e asimetrică deliberat: rândul A (fizic, față în față) suportă exact DOUĂ unități și nu scalează, rândul B (online, traversează golul) suportă 5–6 fără să se strice. Deci: se deschid magazine FIZICE noi? Câte, și când? Se lansează cataloage ONLINE noi? Dacă vine un al treilea magazin fizic, semnătura trebuie regândită, nu extinsă — și e mult mai ieftin să știm asta acum decât după livrare. Legat: rampa de hue are pas de ~9° pe 27,3°; un al cincilea și al șaselea brand ar întinde-o la ~45°, ceea ce e de fapt o îmbunătățire perceptuală, dar schimbă valorile deja aprobate.
- FORMULAR DE CONTACT ȘI PAGINĂ DE CARIERE. Propunerea e o pagină unică, fără formulare — deci fără backend, fără GDPR, fără consimțământ de cookie, ceea ce e o parte reală din motivul pentru care bugetul de performanță ține atât de lejer. Dacă e nevoie de contact sau de recrutare (plauzibil: două magazine fizice, unul de 1.200 m² deschis acum o lună, angajează), atunci apar: un endpoint, o politică de confidențialitate, tratarea datelor candidaților, și tokenul Line Strong devine obligatoriu pe câmpuri (e deja în sistem, la 3,23:1, tocmai pentru asta). Ar putea fi și o simplă adresă de e-mail plus un link către un ATS extern — dar e decizia clientului, nu a mea.
- PLANUL DE AMPLASAMENT SNAGOV PLAZA. Îmi trebuie planul real sau o fotografie proprie de sus, ca să desenez zona 4 corect. «Vizavi» din brief îmi spune că se privesc; nu îmi spune la ce distanță, cu ce între ele, sau cum se raportează la DN-1. Nu desenez o geometrie pe care n-o pot verifica.
- PROGRAMUL ÎN ZILE DE SĂRBĂTOARE LEGALĂ, pentru ambele magazine. Am nevoie de lista exactă de excepții (Crăciun, Paște, 1 Decembrie, 1 Mai) ca să nu afișez public o afirmație falsă unui om care conduce până la Tâncăbești. — Programul obișnuit al magazinului Home a fost primit între timp: zilnic, 10:00–21:00.
- ECHIVALENTE PANTONE / CMYK / VINIL PENTRU CELE ȘASE VALORI DE MARCĂ. Grupul are două magazine fizice și zero specificație de culoare pentru print, firmă luminoasă, folie sau uniformă. Valorile din acest sistem sunt calibrate pentru ecran; conversia trebuie aprobată pe proof fizic, nu calculată — și cineva trebuie să decidă cine plătește proof-ul și cine semnează.
- LOGO VECTORIAL — blocantul tăcut al întregului proiect. Nu există niciun vector real în patrimoniu: shop e PNG 200×50, md e PNG 255×80, iar «SVG»-ul lui home încapsulează două imagini raster plus filtre, 208 KB pentru un wordmark. Site-ul funcționează cu un wordmark tipografic în Archivo, deci nu e blocat — dar în momentul în care apare sigla reală, fascia și footerul se refac. Se redesenează logo-ul în acest proiect sau într-unul separat?

---

## Verificare independentă a planului

Afirmațiile numerice de mai sus au fost recalculate din surse, nu preluate pe încredere.

### Contrast — întreaga paletă finală

| Pereche | Calculat | Prag | |
|---|---|---|---|
| Ink pe Canvas | 14,63:1 | 4,5 | ✅ |
| Slate pe Canvas | 5,22:1 | 4,5 | ✅ |
| Teal Deep pe Canvas | 4,69:1 | 4,5 | ✅ |
| Alb pe Teal Deep | 5,07:1 | 4,5 | ✅ |
| Alb pe Fascia Deep `#08747E` | 5,51:1 | 4,5 | ✅ |
| **Line Strong `#6E8F94` pe Canvas** | **3,23:1** | 3,0 | ✅ |
| Slate Inversat pe Ink | 6,85:1 | 4,5 | ✅ |
| Alb pe Ink | 15,82:1 | 4,5 | ✅ |
| Deep Supermarket pe Canvas | 5,02:1 | 4,5 | ✅ |
| Deep Home pe Canvas | 5,06:1 | 4,5 | ✅ |
| Deep Shop pe Canvas | 5,03:1 | 4,5 | ✅ |
| Deep Moldova pe Canvas | 5,12:1 | 4,5 | ✅ |
| Signal pe Canvas | 4,63:1 | 4,5 | ✅ |

**Toată paleta trece.** Cea mai strânsă marjă e Signal, la 4,63:1 — rezervă de 0,13.

### Alte afirmații

| Afirmație | Recalculat | |
|---|---|---|
| Buton alb pe `#00bbc5` (shop, în producție) = 2,36:1 | 2,36:1 | ✅ |
| Buton alb pe `#15b7c6` (home, în producție) = 2,44:1 | 2,44:1 | ✅ |
| Buton alb pe `#67bac4` (md, în producție) = 2,23:1 | 2,23:1 | ✅ |
| GSAP + ScrollTrigger + Lenis = 49,4 KB gzip | 50.625 B | ✅ |
| 11 iul 2025 → 25 iul 2026 = 379 zile | 379 | ✅ |
| Buget vertical hero = 761 px ≤ 780 | 761 (slack 19 px) | ✅ |

### Notă despre tokenul `Line Strong`

O versiune anterioară a acestui document semnala o eroare de contrast la `Line Strong`.
Semnalarea era greșită și a fost retrasă: se referea la `#749499`, valoarea propusă în
sinteza cromatică intermediară, care într-adevăr dă doar 3,02:1 pe Canvas. Planul final
folosește `#6E8F94`, care dă 3,23:1 și trece confortabil. **Valoarea corectă de
implementat este `#6E8F94`.**

---

## Revizuire de client — paletă mono (25 august 2026)

Clientul a cerut **o singură culoare de brand, `#13B4C6`**, cu alb, gradienturi, negru
și gri închis. Rampa de patru accente pe hue descrisă mai sus **nu se mai aplică**.

### Ce a dispărut și ce ia locul

Mecanismul prin care sub-brandurile rămâneau înrudite era rampa de hue la luminozitate
constantă. Cu o singură culoare, diferențierea cromatică per unitate nu mai există.
Ea se face acum prin **structură**: numerotare, alternanță de fundal, și tratamentul
distinct al cardului Supermarket — desenat, nu umplut.

### Măsurători care au decis sistemul

| Pereche | Contrast | Consecință |
|---|---|---|
| `#13B4C6` + text alb | **2,51:1** | interzis — e chiar defectul din magazinele live |
| `#13B4C6` + text negru | **8,37:1** | turcoazul poartă negru, niciodată alb |
| `#13B4C6` ca text pe fond închis | **7,68:1** | turcoazul aparține întunericului |

De aici rezultă regula: **turcoazul este suprafață.** Unde trebuie să fie text pe fundal
deschis, coboară la `--t-deep #0C7985` (5,14:1 pe alb, 4,74:1 pe `paper`).

### Două capcane găsite prin măsurare

1. **Stopul închis al gradientului nu poate purta text.** Negru pe `#0A5B65` dă 2,47:1.
   Panourile se opresc la `--t-floor #0F8998`, ultima treaptă care mai poartă negru (4,63:1).
2. **`--t-deep` trecea pe alb dar pica pe `paper`.** 4,80:1 față de 4,43:1. Coborât la `#0C7985`.

### Risc de clișeu, asumat explicit

Brief-ul interzice „negru cu un singur accent acid", iar o paletă mono pe fond închis
trece foarte aproape de asta. Se evită prin două decizii: turcoazul ocupă **suprafețe
mari** — panouri întregi, câmpuri de gradient — nu accente subțiri; și pagina alternează
zone închise cu zone luminoase, deci are ritm, nu un singur fundal negru.

### Impact vizual

Clientul a semnalat că scheletul static nu are suficient impact. Planul alesese deliberat
„un singur moment wow, restul disciplinat". Registrul s-a schimbat: hero pe gradient
închis cu H1 la 80 px, panouri de turcoaz cu umbre stratificate, tipografie mult mai mare.
Impactul static trebuie să existe **înainte** de animație.

## Revizie: macheta 3D (secțiunea a doua)

Clientul a construit în Claude Design o machetă 3D a ansamblului Snagov Plaza
și a cerut, în cuvinte simple, „o a doua secțiune HERO … ceva WOW cu ajutorul
acestei machete", trecând explicit peste bugetul de JavaScript din brief.

**Ce s-a construit.** `Maquette.astro` + `src/scripts/maquette.ts`: modelul,
viu, într-o secțiune pinată de 260vh. Camera zboară pe trei chei conduse de
scroll (ansamblu → trecere joasă pe lângă supermarket → sosire deasupra
inelului Home), mâna poate roti oricând, modelul derivă lent singur când e
lăsat în pace, iar cele două clădiri răspund la hover — în scenă și pe
etichetele HTML, care sunt linkuri reale proiectate din ancore 3D la fiecare
cadru.

**Modelul.** Sursa (exportul brut three.js din Claude Design, 2,3 MB, 2.964
de noduri — fiecare copac, mașină și linie de parcare un nod propriu; o primă
predare Draco cuantizase detaliile) trece prin `scripts/model.mjs`:
instanțiere GPU pentru copii (`EXT_mesh_gpu_instancing`), unire pe materiale
pentru restul, cuantizare pe 16 biți, texturi WebP, meshopt. Rezultat: 432 KB,
60 de noduri, ~204k de triunghiuri randate, 16 noduri adresabile cu nume. Materialul `turcoaz` e mutat pe
turcoazul de brand, singurul permis de paletă.

**Bugetul, măsurat.** three.js + încărcător + decodor meshopt: chunk separat
de ~160 KB gzip, cerut abia când secțiunea e la un ecran de viewport; bundle-ul
principal rămâne ~2,7 KB gzip. Modelul: 432 KB (≈188 KB gzip). Posterul
pre-randat acoperă LCP-ul secțiunii până sosesc ambele.

**Degradări.** Fără WebGL sau la eșec de încărcare rămâne posterul
(`scripts/poster.mjs` îl randează din aceeași scenă, sub reduced-motion, și
scrie pozițiile etichetelor lângă el). Fără JavaScript: poster + etichete la
pozițiile posterului + fără indiciul „trage ca să rotești". Cu reduced-motion:
nimic nu se mișcă singur — nici zborul, nici deriva — dar drag-ul rămâne,
fiind persoana cea care mișcă.

**De clarificat cu clientul.** Macheta e o ilustrație, etichetată ca atare pe
pagină („nu un plan tehnic"). Amprentele clădirilor și traseul drumurilor
trebuie confirmate față de terenul real înainte de lansare.


## Revizie: titlul paginii

«Un grup crescut dintr-un singur magazin.» a fost înlocuit, la cererea
clientului, fiindcă arcul „am crescut dintr-unul singur" e un clișeu de
comunicare corporate. Prima variantă („Pe drumul spre casă…") a mers pe loc;
clientul a cerut, în schimb, amploarea grupului. H1-ul actual — «Patru
magazine. Peste zece nișe. Un singur grup.» — o spune în
cifre care există în src/lib/data.ts: patru unități (Supermarket, Home, Shop,
Moldova) și șaisprezece categorii distincte declarate de ele, adică peste zece
nișe reale. Nicio cifră nu e rotunjită în sus.

Clientul a propus „10 branduri". Cifra nu e verificată nicăieri: datele
documentează patru unități Smartino și două branduri de produs (Sleepy,
Unleashia). Rândul se schimbă în secunda în care clientul confirmă ce
numără acel 10.

Tot atunci s-a reparat un defect vechi al titlului: cozile literelor lipseau
pe rândul turcoaz. Cauza nu era masca de animație, cum părea, ci faptul că
rândul e pictat printr-un gradient decupat pe litere — iar gradientul există
doar în cutia de fundal a elementului, care la line-height 1 se oprește la
linia de bază. Cutia a fost prelungită sub linia de bază și trasă înapoi cu
aceeași valoare, iar masca a fost adâncită ca să nu taie ce pictează acum
gradientul. `scripts/verify.mjs` are de-atunci o verificare care fotografiază
secțiunea de două ori — cu și fără gradient, cu și fără măști — și compară
banda unde stau cozile; pe valorile vechi cade.


## Peretele de branduri

Clientul a trimis 22 de logo-uri PNG, toate 300×200 pe plăcuță albă opacă, și
a cerut o secțiune „super vizuală" pentru mărcile pe care le importă. Cele 22
de fișiere nu sunt 22 de branduri: patru sunt lockup-uri Sleepy (marca-mamă
plus Easy Clean, Natural și Bio Natural) și două sunt Remaple în cele două
culori. Rezultă **18 branduri**, iar plăcile care poartă mai multe lockup-uri
le rotesc pe loc — fiecare fișier primit e pe perete, dar niciun brand nu se
numără de două ori.

Secțiunea stă între marchiza de text și poveste, pe același negru ca hero-ul,
și e complet CSS: trei rânduri care aleargă în direcții alternante și cu
viteze diferite (78s / 62s / 86s, deci nimic nu se sincronizează niciodată),
peretele se înclină după scroll (`animation-timeline: view()`), iar o bară de
lumină turcoaz îl traversează. Rândurile se opresc la hover și la focus, ca
un logo să poată fi citit. Sub `prefers-reduced-motion` peretele devine o
grilă statică, iar sub JS oprit nu se schimbă nimic — nicio mișcare de aici
nu depinde de JavaScript.

Două decizii de performanță, ambele măsurate: plăcuța albă a logo-urilor e
exact 255,255,255 în toate cele 22 de fișiere, deci placa albă a cardului o
ascunde singură — `mix-blend-mode: multiply` pe 36 de imagini ar fi costat
compunere pentru exact aceeași imagine. Iar schimbarea lockup-urilor e o
clipire, nu un cross-fade: două logo-uri care se dizolvă unul prin altul se
citesc ca o singură marcă neclară.

Ce lipsește, pentru client: dacă „zeci de branduri" din hero trebuie susținut
literal, mai sunt necesare logo-uri — pe perete se văd 18. Și rămâne
neconfirmat dacă toate cele 18 sunt importate direct de grup sau doar
distribuite; kicker-ul spune „Import direct" pe baza formulării clientului.
