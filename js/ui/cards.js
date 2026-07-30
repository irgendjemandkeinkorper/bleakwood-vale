import { esc, toneBadge, ACT_NAMES } from '../engine/utils.js';
import { faceUp } from '../engine/rules.js';
import { State } from '../engine/state.js';

export function archCard(a, selectable, idx){
  const s = faceUp(a);
  return `<div class="arch${a.flipped?' flipped':''}${selectable?' selectable':''}" ${selectable?`onclick="${selectable}(${idx})" id="arch-pick-${idx}"`:''}>
    <div class="a-side">SIDE ${a.flipped?'II':'I'}${a.flipped?' — TURNED':''}</div>
    <div class="a-name">${esc(a.name||a.role)}</div>
    <div class="a-role">${esc(a.role)}</div>
    <div class="a-cond">${esc(s.cond)} <span style="white-space:nowrap">→ flip.</span></div>
    <div style="margin-top:5px">${toneBadge(s.tone)}</div>
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
export function playerPanel(p,i){
  const G = State.G;
  return `<div class="ppanel">
    <h4>${esc(p.name)}</h4>
    <div class="handrow">
      ${p.hand.map(c=>`<div class="minicard"><div class="mc-t">${esc(c.title)}</div><span class="tone ${c.tone}" style="font-size:.6rem">${c.tone}</span></div>`).join('') || '<span class="small muted"><em>No scene cards in hand.</em></span>'}
    </div>
    ${p.omens.length?`<div class="handrow">${p.omens.map((o,oi)=>`
      <div class="minicard omen"><div class="mc-t">${o.glyph} ${esc(o.title)}</div>
      ${G.sceneDeck.length?`<button class="ghost" style="margin-top:4px;font-size:.7rem;padding:2px 8px" onclick="tradeOmen(${i},${oi})">trade for a scene card</button>`:'<span class="small muted">deck empty</span>'}</div>`).join('')}</div>`:''}
    ${p.secrets.map(s=>`
      <details class="secretbox"><summary>Hidden Sin ${s.used?'— revealed':'(theirs alone to read)'}</summary>
        <div class="small" style="margin-top:6px">${s.combo.map(toneBadge).join(' ')}<br>
        <em style="color:#c9b3de">${esc(s.q)}</em>
        ${s.used?'':'<br><span class="muted">Unlocks when a scene’s tones contain this combination.</span>'}</div>
      </details>`).join('')}
  </div>`;
}
