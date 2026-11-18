# TJ Slovan Krušovce – návrh webu

Návrh nového webu futbalového klubu TJ Slovan Krušovce. **Nie je to oficiálna stránka klubu.** Ukážka má v hlavičke pás s týmto upozornením a vyhľadávače ju neindexujú (`noindex`).

Ukážka: https://matuslenicky.github.io/tj-slovan-krusovce/ · administrácia (ukážka bez ukladania): https://matuslenicky.github.io/tj-slovan-krusovce/admin/

## Vzhľad

**„Doma a vonku“ (dizajn v2, 18. 11. 2026).** Teplá biela, nebeská modrá z erbu len pre stĺpec Doma a akcenty. Písmo Epilogue (titulky, čísla) a Piazzolla (text).

- úvod: meno klubu a najbližší zápas, pod tým sezóna áčka v dvoch stĺpcoch, doma a vonku; každý stĺpec má bilanciu (výhry, remízy, prehry, skóre), výsledky a program,
- pod tým dorast a žiaci a tabuľka VI. ligy Severovýchod,
- ročníky áčka od 2013/14, úspechy, ihrisko a obec sú na stránke Klub,
- menu na telefóne je svetlá plocha cez celú obrazovku.

Web sa skladá zo spoločného jadra v2 (`kluby-siet/engine`: `python assemble.py <web>`), vlastný je `src/site.js` (úvod, Klub, nastavenia) a `src/css/skin.css`.

## Obsah a zdroje

- Zápasy, výsledky, strelci, karty, počty divákov, zostavy dospelých, tabuľky a súpisky 4 tímov (áčko, U19, U13, U11) zo Sportnetu (Futbalnet), verejné API súťaží (`scripts/sportnet.mjs` → `data/sportnet.json`). Tím bez súťaže a hráčov sa nezobrazuje. Vek hráčov sa neukladá, zostavy len pri dospelých.
- Ročníky áčka 2013/14 – 2025/26 z konečných tabuliek na Sportnete, titul vo VII. lige ObFZ Topoľčany 2023/24 (`data/klub.json`).
- Predseda klubu a obec (prvá zmienka 1235, kostol, kaštieľ, rodáci) podľa webu obce Krušovce. Históriu a rok založenia klubu sme vo verejných zdrojoch nenašli, doplní klub.
- E-mail zo Sportnetu. Odkaz na stránku klubu na Facebooku je zo Sportnetu; jej obsah ani fotky sme nepoužili.
- Erb klubu a erby súperov zo Sportnetu (`scripts/logos.py`). Patria príslušným klubom.
- Písmo Epilogue a Piazzolla, licencia SIL Open Font License 1.1 (`scripts/fonts.py`, rovné číslice sú zapečené do písma).

## Zostavenie

Statický generátor bez závislostí (Node 20+, Python 3 s Pillow na erby a fontTools na písmo):

```
python C:\Users\lenic\kluby-siet\engine\assemble.py .   # zloží build.js a site.css zo spoločného jadra
node scripts/sportnet.mjs        # zápasy, tabuľky a súpisky (FULL=1 stiahne znova aj detaily zápasov)
python -I scripts/logos.py       # erby súperov a náš erb do src/img (FORCE=1 stiahne znova)
node build.js                    # data/ + src/ -> dist/ (TODAY=2026-11-18 prepíše dnešný dátum)
node scripts/serve.mjs dist 5456 # náhľad na http://127.0.0.1:5456/ (?nolr = bez obnovovania, s CSP)
node scripts/deploy.mjs          # nasadenie dist/ na vetvu gh-pages (GitHub Pages)
```

Výsledky sa po zápasoch aktualizujú samé cez GitHub Actions (`.github/workflows/sportnet.yml`). Ročníky v `data/klub.json` treba po sezóne doplniť ručne.
