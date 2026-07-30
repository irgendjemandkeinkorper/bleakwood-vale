import { $, esc, shuffle, toneBadge, ACT_NAMES } from '../engine/utils.js';
import { TONES, SCENES } from '../data/index.js';
import { State } from '../engine/state.js';
import { show, renderTopbar } from './screens.js';
import { archCard, omenCard, playerPanel } from './cards.js';
import { actToneCounts } from '../engine/rules.js';
import { renderScenePlay } from './scene.js';
import { viewChronicle } from './renderChronicle.js';

/* ---------------- acts ---------------- */
export function startAct(act){
  const G = State.G;
  G.act = act;
  G.closeDone = false;
  G.discardTones = [];
  const np = G.players.length;
  G.sceneDeck = shuffle(SCENES[act].filter(s=>!s.hook || s.hook===G.hook.id).map(s=>({...s})));
  const handSize = np===1?5:3;
  G.players.forEach(p=>{
    p.hand = G.sceneDeck.splice(0, handSize);
    p.scenesLeft = np===1?3 : np===2?2 : 1;
  });
  renderHub();
  show('scr-hub');
}

export function renderHub(){
  const G = State.G;
  const np = G.players.length;
  const close = G.actClose[G.act];
  const remaining = G.players.reduce((s,p)=>s+p.scenesLeft,0);
  $('scr-hub').innerHTML = `
    <h2 class="center" style="margin-top:8px">${ACT_NAMES[G.act]}</h2>
    <p class="center muted" style="font-style:italic">${esc(G.hook.title)} · The Victim: ${esc(G.victim.name)}</p>
    <div class="ornament">✦ ❦ ✦</div>

    <div class="panel tight">
      <h3 style="color:var(--gold)">The Table</h3>
      <p class="small muted" style="font-style:italic">Whoever has an idea first begins the next scene. ${remaining} scene${remaining===1?'':'s'} remain${remaining===1?'s':''} before the Act closes.</p>
      <div class="btnrow">
        ${G.players.map((p,i)=>{
          if(p.scenesLeft<=0) return `<span class="pill" style="opacity:.5">${esc(p.name)} — done</span>`;
          if(p.hand.length===0 && (p.omens.length===0 || G.sceneDeck.length===0))
            return `<button class="blood" onclick="forfeitScene(${i})">${esc(p.name)} — forfeit scene (no cards)</button>`;
          if(p.hand.length===0)
            return `<span class="pill">${esc(p.name)} — must trade an omen for a scene card below</span>`;
          return `<button class="primary" onclick="startSceneFor(${i})">${esc(p.name)} begins a scene${p.scenesLeft>1?` (${p.scenesLeft} left)`:''}</button>`;
        }).join('')}
      </div>
    </div>

    <div class="panel tight">
      <h3 style="color:var(--blood-bright)">The Act Close — foreseen</h3>
      <p><span class="sc" style="color:#eddfba">${esc(close.title)}.</span> <em class="muted small">${esc(close.cond)}</em></p>
      <p class="small" style="font-style:italic;color:#cfc2a2">${esc(close.prompt)}</p>
      <p class="small muted">${TONES.map(t=>`${toneBadge(t)} <em>${esc(close.elements[t])}</em>`).join('<br>')}</p>
    </div>

    <h3 style="color:var(--gold);margin-top:18px">The Archetypes</h3>
    <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-top:8px">
      ${G.archetypes.map(a=>archCard(a)).join('')}
    </div>

    <h3 style="color:var(--gold);margin-top:18px">The Omen Row</h3>
    <p class="small muted" style="font-style:italic">Read them literally, metaphorically, or obliquely — as you see fit. They accrue meaning as they recur.</p>
    <div class="cardgrid compact">${G.omenRow.map(o=>omenCard(o)).join('')}</div>

    <h3 style="color:var(--gold);margin-top:18px">The Storytellers</h3>
    <div class="pgrid" style="margin-top:8px">
      ${G.players.map((p,i)=>playerPanel(p,i)).join('')}
    </div>
    <p class="small muted" style="margin-top:10px;font-style:italic">Scene deck: ${G.sceneDeck.length} card${G.sceneDeck.length===1?'':'s'} remaining · Omen deck: ${G.omenDeck.length}</p>`;
  renderTopbar();
}

export function tradeOmen(pi,oi){
  const G = State.G;
  const p = G.players[pi];
  if(!G.sceneDeck.length) return;
  const o = p.omens.splice(oi,1)[0];
  G.omenDeck.unshift(o);
  p.hand.push(G.sceneDeck.pop());
  renderHub();
}
export function forfeitScene(pi){
  const G = State.G;
  const p = G.players[pi];
  p.scenesLeft--;
  G.journal.push({type:'note', act:G.act, text:`${p.name} had neither scene card nor omen to trade, and lost their scene. The Vale went un-narrated a while.`, struck:false});
  afterSceneFlow();
}

/* ---------------- act close & flow ---------------- */
export function afterSceneFlow(){
  const G = State.G;
  if(G.closeDone){ advanceAct(); return; }
  const remaining = G.players.reduce((s,p)=>s+p.scenesLeft,0);
  if(remaining<=0){ renderCloseIntro(); show('scr-close'); }
  else { renderHub(); show('scr-hub'); }
}
export function renderCloseIntro(){
  const G = State.G;
  const close = G.actClose[G.act];
  const counts = actToneCounts();
  const max = Math.max(...TONES.map(t=>counts[t]));
  const tied = TONES.filter(t=>counts[t]===max);
  const elementHTML = tied.length===1
    ? `<p><strong style="color:var(--blood-bright)">The act’s dominant tone is ${toneBadge(tied[0])}</strong> — the close must <em>${esc(close.elements[tied[0]])}</em></p>
       <input type="hidden" id="close-el" value="${tied[0]}">`
    : `<p><strong style="color:var(--blood-bright)">The tones stand tied.</strong> The storyteller who begins may choose:</p>` +
      tied.map((t,i)=>`<p><label style="cursor:pointer"><input type="radio" name="close-el" value="${t}" style="width:auto" ${i===0?'checked':''}> ${toneBadge(t)} <em class="small">${esc(close.elements[t])}</em></label></p>`).join('');
  $('scr-close').innerHTML = `
    <h2 class="center" style="color:var(--blood-bright)">${ACT_NAMES[G.act]} draws to a close</h2>
    <div class="ornament">✦</div>
    <div style="max-width:720px;margin:0 auto">
      <div class="card">
        <div class="c-kicker">Act Close</div>
        <div class="c-title" style="font-size:1.4rem">${esc(close.title)}</div>
        <div class="c-prompt">${esc(close.prompt)}</div>
      </div>
      <div class="panel">
        <p class="small" style="font-style:italic;color:var(--gold)">${esc(close.cond)}</p>
        <p class="small muted">The tally of tones this act — from every card played and every archetype’s face — stands at:
        ${TONES.map(t=>`<span class="tone count ${t}">${counts[t]}</span>`).join(' ')}</p>
        ${elementHTML}
        <label class="fld">Who begins the close?</label>
        <select id="close-starter">${G.players.map((p,i)=>`<option value="${i}">${esc(p.name)}</option>`).join('')}</select>
        <label class="fld">Which archetype leads it?</label>
        <select id="close-arch">${G.archetypes.map((a,i)=>`<option value="${i}">${esc(a.name||a.role)} — ${esc(a.role)}</option>`).join('')}</select>
        <label class="fld">What the camera sees as the close opens</label>
        <textarea id="close-opening" placeholder="The camera rises above the Vale…"></textarea>
        <div class="btnrow">
          <button class="primary" onclick="beginClose()">Play the Act Close</button>
        </div>
      </div>
    </div>`;
}
export function beginClose(){
  const G = State.G;
  const close = G.actClose[G.act];
  let el;
  const hidden = $('close-el');
  if(hidden && hidden.type==='hidden') el = hidden.value;
  else el = (document.querySelector('input[name="close-el"]:checked')||{}).value || TONES[0];
  G.current = {
    type:'close', starter:+$('close-starter').value, archIdx:+$('close-arch').value,
    card:{title:close.title, prompt:close.prompt, tone:null},
    element: close.elements[el],
    opening:($('close-opening').value||'').trim(),
    contributions:[], happened:'', adding:null, phase:'play'
  };
  renderScenePlay();
  show('scr-scene');
}
export function advanceAct(){
  const G = State.G;
  if(G.act>=3){ G.act=4; viewChronicle(false); }
  else startAct(G.act+1);
}
