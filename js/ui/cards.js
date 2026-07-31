import { esc, nl2br, toneBadge, ACT_NAMES } from '../engine/utils.js';
import { State } from '../engine/state.js';

function archFaceHTML(a, sideIdx, turned){
  const s = a.sides[sideIdx];
  return `<div class="arch${turned?' flipped':''}">
    <div class="a-side">SIDE ${sideIdx===0?'I':'II'}${turned?' — TURNED':''}</div>
    <div class="a-name">${esc(a.name||a.role)}</div>
    <div class="a-role">${esc(a.role)}</div>
    <div class="a-cond">${esc(s.cond)} <span style="white-space:nowrap">→ flip.</span></div>
    <div style="margin-top:5px">${toneBadge(s.tone)}</div>
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
  return `<div class="arch-flip${selectable?' selectable':''}" ${selectable?`onclick="${selectable}(${idx})" id="arch-pick-${idx}"`:''}>
    <button class="flip-btn" type="button" onclick="event.stopPropagation();flipArchCard(this)" aria-label="Peek at the other side" title="Peek at the other side">⟳</button>
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
  return `<div class="card omen${selectable?' selectable':''}" ${selectable?`onclick="${selectable}(${idx})" id="omen-pick-${idx}"`:''}>
    <div class="c-kicker">Omen</div>
    <div class="glyph">${o.glyph}</div>
    <div class="c-title">${esc(o.title)}</div>
    <div class="c-prompt">${esc(o.line)}</div>
  </div>`;
}
export function sceneCardHTML(c, selectable, idx){
  const G = State.G;
  return `<div class="card${selectable?' selectable':''}" ${selectable?`onclick="${selectable}(${idx})" id="scene-pick-${idx}"`:''}>
    <div class="c-kicker">Scene · ${ACT_NAMES[G.act]}</div>
    <div class="c-title">${esc(c.title)}</div>
    <div class="c-prompt">${esc(c.prompt)}</div>
    <div style="margin-top:8px">${toneBadge(c.tone)}</div>
  </div>`;
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
  return `<div class="ppanel">
    <h4>${esc(p.name)}</h4>
    <div class="handrow">
      ${p.hand.map(c=>`<div class="minicard"><div class="mc-t">${esc(c.title)}</div><span class="tone ${c.tone}" style="font-size:.6rem">${c.tone}</span></div>`).join('') || '<span class="small muted"><span>No scene cards in hand.</span></span>'}
    </div>
    ${p.omens.length?`<div class="handrow">${p.omens.map((o,oi)=>`
      <div class="minicard omen"><div class="mc-t">${o.glyph} ${esc(o.title)}</div>
      ${G.sceneDeck.length?`<button class="ghost" style="margin-top:4px;font-size:.7rem;padding:2px 8px" onclick="tradeOmen(${i},${oi})">trade for a scene card</button>`:'<span class="small muted">deck empty</span>'}</div>`).join('')}</div>`:''}
    ${p.secrets.map(s=>`
      <details class="secretbox"><summary>Hidden Sin ${s.used?'— revealed':'(theirs alone to read)'}</summary>
        <div class="small" style="margin-top:6px">${s.combo.map(toneBadge).join(' ')}<br>
        <span style="color:#c9b3de">${esc(s.q)}</span>
        ${s.used?'':'<br><span class="muted">Unlocks when a scene’s tones contain this combination.</span>'}</div>
      </details>`).join('')}
  </div>`;
}
