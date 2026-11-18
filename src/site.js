// Statický generátor webu TJ Slovan Krušovce: data/ + src/ -> dist/   (node build.js; TODAY=2026-11-18 prepíše dnešný dátum)
// Zostavuje ho kluby-siet/engine/assemble.py zo spoločného jadra v2 a tohto súboru (vzhľad, úvod, stránka Klub).
// Kostra „Doma a vonku“: úvod delí sezónu áčka na dva stĺpce – doma v Krušovciach a vonku. Každý má bilanciu
// (výhry, remízy, prehry, skóre), svoj program a výsledky. Nad nimi meno a najbližší zápas, pod nimi mládež a tabuľka.
// Teplá biela, modrá z erbu len pre stĺpec Doma a akcenty. Písmo Epilogue (titulky, čísla) a Piazzolla (text).
const SKIN = {
  nav: 'bar', theme: '#00679c', brand: 'TJ Slovan Krušovce', brandSub: 'futbal pri Topoľčanoch',
  fonts: ['epilogue-800.woff', 'piazzolla-400.woff', 'piazzolla-600.woff'],
  sources: 'Obec podľa webu obce Krušovce.',
  adminHero: 'Doma a vonku',
  adminFacts: club.uspechy.map((u) => ({ k: u.rok, t: u.text })),
  links: [[club.obecKlub, 'Klub na webe obce']],
};
const NAV = [['zapasy/', 'Zápasy'], ['tabulky/', 'Tabuľky'], ['timy/', 'Tímy'], ['klub/', 'Klub'], ['kontakt/', 'Kontakt']];
const DESC = `${club.nazov} – zápasy, výsledky, tabuľky a súpisky áčka (${A.leagueName}), dorastu a žiakov. Víťaz VII. ligy ObFZ Topoľčany 2023/24, osem sezón v V. lige Stred.`;

// bilancia áčka v tomto ročníku: doma alebo vonku
const aPlayed = teamMatches(A.slug).filter((m) => m.past && m.score);
function rec(home) {
  const l = aPlayed.filter((m) => m.home === home);
  const r = { n: l.length, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  for (const m of l) { r[m.res] += 1; r.gf += m.gf; r.ga += m.ga; }
  return r;
}
// v stĺpci Doma/Vonku je „· doma“ / „· vonku“ pri každom riadku zbytočné, nadpis stĺpca to už hovorí
const sideList = (l, R) => fxList(l, R, { showTeam: false }).replace(/ · (doma|vonku)<\/span><\/span>/g, '</span></span>');
function side(home, R) {
  const r = rec(home);
  const up = upcoming.filter((m) => m.team === A.slug && m.home === home && m !== nextA).slice(0, 3);
  const res = [...aPlayed].reverse().filter((m) => m.home === home).slice(0, 4);
  const id = home ? 'doma' : 'vonku';
  return `<section class="ks-side ks-side--${id}" aria-labelledby="${id}-h">
  <h2 class="ks-h2" id="${id}-h">${home ? 'Doma' : 'Vonku'}</h2>
  <p class="ks-sub">${home ? 'na ihrisku v Krušovciach' : 'na ihriskách súperov'}</p>
  ${r.n ? `<dl class="ks-rec">
    <div><dt>výhry</dt><dd>${r.w}</dd></div><div><dt>remízy</dt><dd>${r.d}</dd></div><div><dt>prehry</dt><dd>${r.l}</dd></div><div class="ks-rec-s"><dt>skóre</dt><dd>${r.gf}:${r.ga}</dd></div>
  </dl>` : ''}
  ${res.length ? `<h3 class="ks-h3">Výsledky</h3>${sideList(res, R)}` : ''}
  ${up.length ? `<h3 class="ks-h3">Program</h3>${sideList(up, R)}` : ''}
</section>`;
}

add('', {
  title: 'futbal v Krušovciach', active: '', bodyClass: 'home',
  body: (R) => {
    const n = nextA;
    const wl = winterLine();
    const youthRes = homeRes(8).filter((m) => m.teamObj !== A).slice(0, 4);
    const youthUp = homeUp(8).filter((m) => m.teamObj !== A).slice(0, 4);
    return `<section class="ks-top"><div class="wrap ks-top-in">
  <div>
    <h1 class="h1">TJ Slovan Krušovce</h1>
    <p class="ks-p">${esc(A.leagueName)}${A.pos ? `, ${A.pos}. miesto ${zo(A.of)}` : ''}. Víťaz VII. ligy ObFZ Topoľčany 2023/24.</p>
  </div>
  ${n ? `<div class="ks-next">
    <p class="ks-k">${wl ? 'Prvý zápas po zimnej prestávke' : 'Najbližší zápas'}</p>
    <p class="ks-next-o">${n.home ? 'doma proti' : 'vonku proti'} ${glueAbbr(esc(n.opponent))}</p>
    <p class="ks-next-d"><time datetime="${n.date}">${dLong(n.date)}</time>${n.time ? `, ${esc(n.time)}` : ''}${wl ? '' : ` <span class="cd" data-kickoff="${isoLocal(n.date, n.time)}" hidden></span>`}</p>
    <a class="btn" href="${R}kalendar/zapas-${n.id}.ics" download>${I.cal}Do kalendára</a>
  </div>` : ''}
</div></section>
<section class="sec sec--first" aria-label="Áčko doma a vonku"><div class="wrap ks-split">
  ${side(true, R)}
  ${side(false, R)}
</div>
<div class="wrap">${more(`${R}zapasy/`, 'Všetky zápasy')}</div></section>
<section class="sec sec--tint"><div class="wrap ks-low">
  ${youthRes.length || youthUp.length ? `<section aria-labelledby="y-h">
    <h2 class="ks-h2 ks-h2--s" id="y-h">Dorast a žiaci</h2>
    ${youthRes.length ? `<h3 class="ks-h3">Výsledky</h3>${fxList(youthRes, R)}` : ''}
    ${youthUp.length ? `<h3 class="ks-h3">Program</h3>${fxList(youthUp, R)}` : ''}
    ${more(`${R}timy/`, 'Tímy a súpisky')}
  </section>` : ''}
  ${A.table ? `<section aria-labelledby="t-h"><h2 class="ks-h2 ks-h2--s" id="t-h">${esc(A.leagueName)}</h2>${tableHtml(A.table, R)}${more(`${R}tabulky/`, 'Všetky tabuľky')}</section>` : ''}
</div></section>`;
  },
});

add('klub/', {
  title: 'Klub', active: 'klub/', desc: `${club.nazov}: ročníky áčka od 2013/14, titul vo VII. lige ObFZ Topoľčany 2023/24, osem sezón v V. lige Stred, ihrisko a obec Krušovce.`,
  body: (R) => `${pageHead({ title: 'Klub', sub: `${esc(club.pravnyNazov)}. Predseda ${esc(club.predseda)}. Klubové farby: ${esc(club.farby)}.`, R, crumbs: [[null, 'Klub']] })}
<section class="sec sec--first"><div class="wrap cols2">
  <div><h2 class="h2">Ročníky áčka</h2>${seasonsTable(club.rocniky.zoznam)}</div>
  <div><h2 class="h2">Úspechy</h2>${facts(club.uspechy.map((u) => ({ k: u.rok, t: u.text })))}
    <h2 class="h2 h2--gap">${esc(ST.nazov)}</h2><p>${club.adresa.map(esc).join(', ')}.</p>
    <p class="btns"><a class="btn btn--line" href="https://www.google.com/maps/dir/?api=1&amp;destination=${ST.geo.join(',')}" rel="noopener">Navigovať na ihrisko</a></p></div>
</div></section>
<section class="sec sec--tint"><div class="wrap ks-obec">
  <h2 class="h2">Krušovce</h2>${facts(club.obec.fakty)}
  <p class="note">Zdroje: Sportnet (ročníky, zápasy, tabuľky), web obce Krušovce (klub, História obce, Kultúrne pamiatky).</p>
</div></section>`,
});
