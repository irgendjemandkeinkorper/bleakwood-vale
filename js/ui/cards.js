import { esc, nl2br, toneBadge, ACT_NAMES } from '../engine/utils.js';
import { State } from '../engine/state.js';
import { archetypeArtHTML, omenArtHTML } from './art.js';

function archFaceHTML(a, sideIdx, turned){
  const s = a.sides[sideIdx];
  return `<div class="arch${turned?' flipped':''}">
    ${archetypeArtHTML(a,sideIdx,{className:'arch-card-art'})}
    <div class="arch-card-copy">
      <div class="a-side">SIDE ${sideIdx===0?'I':'II'}${turned?' — TURNED':''}</div>
      <div class="a-name">${esc(a.name||a.role)}</div>
      <div class="a-role">${esc(a.role)}</div>
      <div class="a-cond">${esc(s.cond)} <span style="white-space:nowrap">→ flip.</span></div>
      <div style="margin-top:5px">${toneBadge(s.tone)}</div>
    </div>
  </div>`;
}
/* Archetypes are the only two-sided cards — every side has real,
   different content (a different flip condition and Tone). The card
   shows whichever side is currently face-up per game state (the
   "front"), but a small flip control lets a player peek at the other
   side at any time without affecting play — a pure local DOM/CSS
   toggle (see flipArchCard below), not game state. */
export function archCard(a, selectable, idx){
  const frontIdx = a.flipped?1:0, backIdx = a.flipped?0:1;
  const pickAttrs = selectable ? `role="button" tabindex="0" aria-label="Choose ${esc(a.name||a.role)} as the lead archetype" aria-pressed="false" onclick="${selectable}(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${selectable}(${idx})}" id="arch-pick-${idx}"` : '';
  return `<div class="arch-flip${selectable?' selectable':''}" ${pickAttrs}>
    <button class="flip-btn" type="button" onclick="event.stopPropagation();flipArchCard(this)" onkeydown="event.stopPropagation()" aria-label="Peek at the other side" title="Peek at the other side">⟳</button>
    <div class="arch-flip-inner">
      <div class="arch-face arch-front">${archFaceHTML(a, frontIdx, a.flipped)}</div>
      <div class="arch-face arch-back">${archFaceHTML(a, backIdx, !a.flipped)}</div>
    </div>
  </div>`;
}
export function flipArchCard(btn){
  btn.closest('.arch-flip')?.classList.toggle('peeking');
}

/* The 4-step "Begin → Buy In → Narrate → Resolve" diagram. Shared by the
   Rules overlay (js/ui/renderChronicle.js showRules()) and the inline
   first-scene primer (js/ui/scene.js), so the two never drift apart. */
export function sceneAnatomyDiagramHTML(){
  return `<div class="turn-diagram">
    <div class="td-step">
      <div class="td-num">1</div>
      <div class="td-label">Begin</div>
      <div class="td-visual">
        <div class="card mini"><div class="c-kicker">Scene</div><div class="c-title">The Wake</div></div>
        <div class="arch mini"><div class="a-name">The Disgraced Alienist</div></div>
      </div>
      <div class="td-caption">Pick a scene card and the archetype who leads it.</div>
    </div>
    <div class="td-arrow">→</div>
    <div class="td-step">
      <div class="td-num">2</div>
      <div class="td-label">Buy In</div>
      <div class="td-visual">
        <div class="minicard omen">☽ A Tarnished Pocket Watch</div>
        <div class="minicard">A Letter, Unsent</div>
      </div>
      <div class="td-caption">Up to two others each play a card, describing how it manifests.</div>
    </div>
    <div class="td-arrow">→</div>
    <div class="td-step">
      <div class="td-num">3</div>
      <div class="td-label">Narrate</div>
      <div class="td-visual">
        <p class="small" style="font-style:italic;color:#cfc2a2">“The camera drifts through the fog toward a lit window…”</p>
      </div>
      <div class="td-caption">Play it out aloud, together, until the starter ends it.</div>
    </div>
    <div class="td-arrow">→</div>
    <div class="td-step">
      <div class="td-num">4</div>
      <div class="td-label">Resolve</div>
      <div class="td-visual">
        <div style="display:flex;gap:4px">${toneBadge('Guilt')}${toneBadge('Dread')}</div>
      </div>
      <div class="td-caption">Check every archetype for a flip, then count the scene's tones.</div>
    </div>
  </div>`;
}
export function omenCard(o, selectable, idx){
  const pickAttrs = selectable ? `role="button" tabindex="0" aria-label="Choose omen ${esc(o.title)}" aria-pressed="false" onclick="${selectable}(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${selectable}(${idx})}" id="omen-pick-${idx}"` : '';
  return `<div class="card omen${selectable?' selectable':''}" ${pickAttrs}>
    <div class="c-kicker">Omen</div>
    ${omenArtHTML(o,{className:'omen-card-art'})}
    <div class="glyph">${o.glyph}</div>
    <div class="c-title">${esc(o.title)}</div>
    <div class="c-prompt">${esc(o.line)}</div>
  </div>`;
}
export function sceneCardHTML(c, selectable, idx){
  const G = State.G;
  const pickAttrs = selectable ? `role="button" tabindex="0" aria-label="Choose scene card ${esc(c.title)}" aria-pressed="false" onclick="${selectable}(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${selectable}(${idx})}" id="scene-pick-${idx}"` : '';
  return `<div class="card${selectable?' selectable':''}" ${pickAttrs}>
    <div class="c-kicker">Scene · ${ACT_NAMES[G.act]}</div>
    <div class="c-title">${esc(c.title)}</div>
    <div class="c-prompt">${esc(c.prompt)}</div>
    <div style="margin-top:8px">${toneBadge(c.tone)}</div>
  </div>`;
}

/* A single source of truth for everything physically "on the table" while
   a scene is running. Both local and online play use this view, and local
   resolution keeps it visible while the group checks flip conditions. */
export function sceneTrackerHTML(G, opts={}){
  const c = G?.current;
  if(!c?.card) return '';

  const starter = G.players[c.starter];
  const lead = G.archetypes[c.archIdx];
  const leadFace = lead.sides[lead.flipped?1:0];
  const resolving = opts.phase === 'resolve';
  const happened = opts.happened ?? c.happened;
  const viewerSeat = Number.isInteger(opts.viewerSeat) ? opts.viewerSeat : null;
  const animateSlot = Number.isInteger(opts.animateSlot) ? opts.animateSlot : null;
  const cards = [
    {kind:c.type==='close'?'close':'scene', card:c.card, owner:starter.name, opening:true},
    ...c.contributions.map(x=>({kind:x.kind, card:x.card, owner:G.players[x.pi].name, how:x.how, pi:x.pi}))
  ];
  const cardCount = cards.length;
  const slotRoman = ['I','II','III'];

  const slotHTML = Array.from({length:3}, (_,i)=>{
    const played = cards[i];
    if(!played) return `<div class="scene-slot empty" aria-label="Open card slot">
      <div class="scene-slot-head"><span>${slotRoman[i]} · Buy-in</span><span>Open</span></div>
      <div class="scene-slot-empty-mark" aria-hidden="true">＋</div>
      <p>Another storyteller may add a scene card or an omen.</p>
    </div>`;

    const isOmen = played.kind === 'omen';
    const kicker = played.kind === 'close' ? 'Act Close' : isOmen ? 'Omen' : `Scene · ${ACT_NAMES[G.act]}`;
    return `<div class="scene-slot occupied${isOmen?' omen-slot':''}${i===animateSlot?' dealt-in':''}">
      <div class="scene-slot-head">
        <span>${slotRoman[i]} · ${i===0?'Opening':'Buy-in'}</span>
        <span>${esc(played.owner)}</span>
      </div>
      <div class="card scene-table-card${isOmen?' omen':''}">
        <div class="c-kicker">${kicker}</div>
        ${isOmen?omenArtHTML(played.card,{className:'scene-omen-art'}):''}
        ${isOmen?`<div class="glyph">${played.card.glyph}</div>`:''}
        <div class="c-title">${esc(played.card.title)}</div>
        <div class="c-prompt">${esc(played.card.prompt ?? played.card.line)}</div>
        ${played.card.tone?`<div class="scene-card-tone">${toneBadge(played.card.tone)}</div>`:''}
        ${played.opening && c.element?`<hr class="rule" style="border-color:rgba(60,45,25,.3)"><div class="small scene-close-element"><strong>Include:</strong> ${esc(c.element)}</div>`:''}
      </div>
      ${played.how!==undefined?`<div class="scene-manifest"><span>How it enters</span><p>${nl2br(played.how)||'<span class="muted">It manifests wordlessly.</span>'}</p></div>`:''}
    </div>`;
  }).join('');

  const toneSources = [];
  if(c.card.tone) toneSources.push({tone:c.card.tone, source:'opening card'});
  c.contributions.forEach(x=>{
    if(x.kind==='scene') toneSources.push({tone:x.card.tone, source:x.card.title});
  });
  toneSources.push({tone:leadFace.tone, source:`${lead.name||lead.role} · face-up`});
  const hasOmen = c.contributions.some(x=>x.kind==='omen');

  const contributed = new Map();
  c.contributions.forEach(x=>contributed.set(x.pi, (contributed.get(x.pi)||0)+1));
  const hasOpenSlot = cardCount < 3;
  const playerRail = G.players.map((p,i)=>{
    const mine = viewerSeat===i ? ' · you' : '';
    const played = contributed.get(i)||0;
    const handCount = Array.isArray(p.hand) ? p.hand.length : (p.handCount||0);
    const canBuyIn = hasOpenSlot && (G.players.length===1 || i!==c.starter) &&
      (G.players.length===1 || !played) && (handCount>0 || G.omenRow.length>0);
    let status, cls;
    if(i===c.starter && G.players.length===1){
      status = played ? `Directing · ${played} buy-in${played===1?'':'s'}` : canBuyIn ? 'Directing · may buy in' : 'Directing';
      cls = played ? 'played' : 'directing';
    }
    else if(i===c.starter){ status='Directing'; cls='directing'; }
    else if(played){ status=G.players.length===1 ? `${played} buy-in${played===1?'':'s'}` : 'Card played'; cls='played'; }
    else if(canBuyIn){ status='May buy in'; cls='ready'; }
    else if(hasOpenSlot){ status='At the table'; cls='watching'; }
    else { status='Scene full'; cls='watching'; }
    return `<span class="scene-player ${cls}"><strong>${esc(p.name)}</strong><small>${status}${mine}</small></span>`;
  }).join('');

  const context = [G.hook?.title, G.victim?.name ? `The Victim: ${G.victim.name}` : null].filter(Boolean).map(esc).join(' · ');
  const arrived = animateSlot!==null ? cards[animateSlot] : null;
  return `${arrived?`<div class="scene-arrival-callout" aria-live="polite"><span>${esc(arrived.owner)}</span> ${animateSlot===0?'opens the scene with':'adds'} <strong>${esc(arrived.card.title)}</strong></div>`:''}
  <section class="scene-tracker${resolving?' resolving':''}${arrived?' card-arrival':''}" aria-label="Current scene tracker">
    <div class="scene-tracker-head">
      <div>
        <p class="scene-tracker-kicker">${resolving?'Resolving':'Now Playing'} · ${ACT_NAMES[G.act]}</p>
        <h2>${esc(c.card.title)}</h2>
        ${context?`<p class="scene-context">${context}</p>`:''}
      </div>
      <div class="scene-card-meter" aria-label="${cardCount} of 3 cards in play">
        <span class="scene-meter-label">Cards in play</span>
        <span class="scene-meter-dots">${Array.from({length:3},(_,i)=>`<i class="${i<cardCount?'filled':''}"></i>`).join('')}</span>
        <strong>${cardCount} / 3</strong>
      </div>
    </div>

    <div class="scene-brief">
      <span><small>Directed by</small><strong>${esc(starter.name)}</strong></span>
      <span><small>Lead archetype</small><strong>${esc(lead.name||lead.role)}</strong></span>
    </div>
    ${c.opening?`<blockquote class="scene-opening"><span>The camera sees</span>${nl2br(c.opening)}</blockquote>`:''}

    <div class="scene-table">
      <div class="scene-slots">${slotHTML}</div>
      <aside class="scene-lead-card">
        <div class="scene-lead-label"><span>Lead in this scene</span>${toneBadge(leadFace.tone)}</div>
        ${archCard(lead)}
        <p>Check the face-up condition when the scene ends. Its tone is counted after any turn.</p>
      </aside>
    </div>

    <div class="scene-tone-tracker">
      <div class="scene-tone-copy">
        <span>Tones in play</span>
        <small>The lead’s tone may change when the scene resolves.</small>
      </div>
      <div class="scene-tone-sources">${toneSources.map(x=>`<span>${toneBadge(x.tone)}<small>${esc(x.source)}</small></span>`).join('')}</div>
      ${hasOmen?'<p class="scene-omen-note">Omens shape the fiction, but add no tone.</p>':''}
    </div>

    <div class="scene-player-rail" aria-label="Storyteller participation">${playerRail}</div>
    ${resolving && happened?`<div class="scene-record"><span>The Chronicle will remember</span><p>${nl2br(happened)}</p></div>`:''}
  </section>`;
}
/* Compact recap of one resolved journal entry — who led it, what was
   played into it, and by whom. Shared by the hub's "last scene" panel
   and (in fuller form) the Chronicle, so the two never drift apart. */
export function journalEntrySummaryHTML(entry, opts){
  const compact = opts?.compact;
  if(!entry) return '';
  if(entry.type==='note'){
    return `<div class="panel tight"><span class="small muted">${esc(entry.text)}</span></div>`;
  }
  if(entry.type==='secret'){
    return `<div class="panel tight" style="border-color:#8a63a8">
      <h3 style="color:#c9b3de">${compact?'Just revealed — ':''}A Hidden Sin: ${esc(entry.playerName)}</h3>
      <p class="small" style="color:#e0d4ec">“${esc(entry.question)}”</p>
      <p class="small muted">Shown through: ${entry.omens.map(o=>`${o.glyph} ${esc(o.title)}`).join(' · ')}</p>
    </div>`;
  }
  const contribHTML = entry.contributions.length
    ? entry.contributions.map(x=>`<p class="small" style="margin:3px 0"><span style="color:var(--gold)">${x.kind==='omen'?(x.glyph+' '):''}${esc(x.title)}</span> <span class="muted">(${esc(x.playerName)})</span>${(!compact && x.how)?` — ${nl2br(x.how)}`:''}</p>`).join('')
    : '<p class="small muted">No one else played into this scene.</p>';
  return `<div class="panel tight">
    <h3 style="color:var(--gold)">${entry.type==='close'?'Act Close — ':''}${esc(entry.cardTitle)}</h3>
    <p class="small">Led by <strong>${esc(entry.playerName)}</strong> as ${esc(entry.archName)} (${esc(entry.archRole)})</p>
    <p class="small" style="color:var(--gold);margin-top:6px">Cards &amp; characters played</p>
    ${contribHTML}
    <p class="small muted" style="margin-top:6px">Tones: ${entry.tones.map(toneBadge).join(' ')}</p>
    ${entry.flips.length?`<p class="small muted">${entry.flips.map(esc).join('; ')}.</p>`:''}
  </div>`;
}

export function playerPanel(p,i){
  const G = State.G;
  return `<div class="ppanel" id="player-panel-${i}">
    <h4>${esc(p.name)}</h4>
    <p class="hand-section-label">Scene cards · ${p.hand.length}</p>
    <div class="cardgrid hand-cardgrid">
      ${p.hand.map(c=>sceneCardHTML(c)).join('') || '<span class="small muted">No scene cards in hand.</span>'}
    </div>
    ${p.omens.length?`<p class="hand-section-label">Held omens · ${p.omens.length}</p><div class="cardgrid hand-cardgrid">${p.omens.map((o,oi)=>`
      <div class="held-card">${omenCard(o)}
      ${G.sceneDeck.length?`<button class="ghost" onclick="tradeOmen(${i},${oi})">Trade for a scene card</button>`:'<span class="small muted">Scene deck empty</span>'}</div>`).join('')}</div>`:''}
    ${p.secrets.map(s=>`
      <details class="secretbox"><summary>Hidden Sin ${s.used?'— revealed':'(theirs alone to read)'}</summary>
        <div class="small" style="margin-top:6px">${s.combo.map(toneBadge).join(' ')}<br>
        <span style="color:#c9b3de">${esc(s.q)}</span>
        ${s.used?'':'<br><span class="muted">Unlocks when a scene’s tones contain this combination.</span>'}</div>
      </details>`).join('')}
  </div>`;
}
