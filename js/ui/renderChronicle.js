import { $, esc, nl2br, toneBadge, ACT_NAMES } from '../engine/utils.js';
import { TONES, TONE_GLOSS, EPILOGUE_QUESTIONS } from '../data/index.js';
import { State } from '../engine/state.js';
import { show } from './screens.js';
import { faceUp } from '../engine/rules.js';
import { liveToggleStrike } from '../sync/liveActions.js';

/* ---------------- the chronicle ---------------- */
export function viewChronicle(interim){
  if(!State.G) return;
  if(interim){
    const active = document.querySelector('.screen.active');
    State.chronReturn = active ? active.id : 'scr-hub';
    if(State.chronReturn==='scr-chronicle') { return; }
  } else State.chronReturn = null;
  renderChronicle(interim);
  show('scr-chronicle');
}
export function returnFromChronicle(){ show(State.chronReturn||'scr-hub'); }

export function renderChronicle(interim){
  const G = State.G;
  const over = G.act>3;
  const entriesByAct = [1,2,3].map(act=>G.journal.filter(e=>e.act===act));
  const entryHTML = (e,gi)=>{
    const strike = `<button class="ghost" style="float:right;font-size:.7rem" onclick="toggleStrike(${gi},${interim?'true':'false'})">${e.struck?'restore':'☒ strike'}</button>`;
    if(e.type==='note') return `<div class="chron-entry${e.struck?' struck':''}">${strike}<em class="small muted">${esc(e.text)}</em></div>`;
    if(e.type==='secret') return `
      <div class="chron-entry secret${e.struck?' struck':''}">${strike}
        <div class="ce-head"><span class="ce-title" style="color:#c9b3de">A Hidden Sin Revealed</span>
          <span class="ce-meta">${esc(e.playerName)} · ${e.combo.map(toneBadge).join(' ')}</span></div>
        <p class="ce-q">“${esc(e.question)}”</p>
        <p class="small muted">Answered through the omens: ${e.omens.map(o=>`${o.glyph} ${esc(o.title)}`).join(' · ')}</p>
        ${e.answer?`<blockquote>${nl2br(e.answer)}</blockquote>`:''}
      </div>`;
    return `
      <div class="chron-entry ${e.type==='close'?'close':''}${e.struck?' struck':''}">${strike}
        <div class="ce-head">
          <span class="ce-title">${e.type==='close'?'ACT CLOSE — ':''}${esc(e.cardTitle)}</span>
          <span class="ce-meta">led by ${esc(e.playerName)} as ${esc(e.archName)} (${esc(e.archRole)})</span>
        </div>
        <span class="ce-meta">Tones: ${e.tones.map(toneBadge).join(' ')}</span>
        ${e.element?`<p class="small" style="color:var(--blood-bright);font-style:italic">Commanded to include: ${esc(e.element)}</p>`:''}
        ${e.opening?`<blockquote>${nl2br(e.opening)}</blockquote>`:''}
        ${e.contributions.map(x=>`<p class="small"><span style="color:var(--gold)">${x.kind==='omen'?(x.glyph+' '):''}${esc(x.title)}</span> <span class="muted">(${esc(x.playerName)})</span>${x.how?` — <em>${esc(x.how)}</em>`:''}</p>`).join('')}
        ${e.happened?`<p style="color:#e3d7b8">${nl2br(e.happened)}</p>`:''}
        ${e.flips.length?`<p class="small muted" style="font-style:italic">${e.flips.map(esc).join('; ')}.</p>`:''}
      </div>`;
  };
  let gi=-1;
  const acts = entriesByAct.map((list,ai)=> list.length ? `
    <h3 class="sc" style="color:var(--gold);margin-top:22px">${ACT_NAMES[ai+1]}</h3>
    ${list.map(e=>{gi=G.journal.indexOf(e);return entryHTML(e,gi);}).join('')}` : '').join('');

  $('scr-chronicle').innerHTML = `
    <div class="masthead" style="padding-top:16px">
      <div class="m-over">${over?'The Tale Is Told':'The Record, So Far'}</div>
      <h1 style="font-size:2.4rem">THE BLACKWOOD VALE CHRONICLE</h1>
      <div class="m-sub">${esc(G.hook.title)} · being a true &amp; faithful account of the death of ${esc(G.victim.name)}</div>
    </div>
    <div class="panel tight">
      <h3 style="color:var(--gold)">Concerning the Victim</h3>
      ${G.victim.facts.map(f=>`<p class="small" style="margin:5px 0"><span style="color:var(--gold)">${esc(f.who)}, ${esc(f.role)}</span> — <em class="muted">“${esc(f.q)}”</em><br>${esc(f.a)}</p>`).join('')}
    </div>
    <div class="panel tight">
      <h3 style="color:var(--gold)">Dramatis Personae</h3>
      ${G.archetypes.map(a=>`<p class="small" style="margin:4px 0"><span class="sc" style="color:#eddfba">${esc(a.name||a.role)}</span> — ${esc(a.role)}${a.flipped?' <span style="color:var(--blood-bright)">(turned)</span>':''} ${toneBadge(faceUp(a).tone)}</p>`).join('')}
    </div>
    ${acts || '<p class="center muted" style="font-style:italic;margin-top:20px">Nothing is yet written. The candles are still tall.</p>'}
    ${over?`
      <div class="ornament">❦ ✦ ❦</div>
      <div class="panel">
        <h3 style="color:var(--gold)">Questions for the Survivors</h3>
        ${EPILOGUE_QUESTIONS.map(q=>`<p class="small" style="font-style:italic;color:#cfc2a2;margin:8px 0">— ${esc(q)}</p>`).join('')}
      </div>`:''}
    <div class="btnrow" style="justify-content:center;margin-top:20px">
      ${interim?`<button class="primary" onclick="returnFromChronicle()">Return to the Tale</button>`:''}
      <button onclick="copyChronicle()" id="btn-copy">Copy as Markdown</button>
      <button onclick="downloadChronicle()">Download the Chronicle</button>
      ${over?`<button class="blood" onclick="location.reload()">Begin Another Tale</button>`:''}
    </div>
    <p class="small muted center" style="margin-top:8px;font-style:italic">Anything stricken from the record never was. No questions asked; no reasons owed.</p>`;
}
export function toggleStrike(gi, interim){
  if(State.onlineRoomCode){
    liveToggleStrike(State.onlineRoomCode, gi).catch(err=>alert(err.message));
    return; // the onSnapshot listener re-renders once the write lands
  }
  State.G.journal[gi].struck = !State.G.journal[gi].struck;
  renderChronicle(interim);
}

/* ---------------- rules overlay ---------------- */
export function showRules(){
  $('overlay-content').innerHTML = `
    <h2 style="color:var(--gold)">How the Tale Is Told</h2>
    <div class="panel tight small" style="line-height:1.7">
      <p><strong style="color:var(--gold)">The shape of it.</strong> One sitting, three acts, one death. You will establish the Victim by answering questions, then take turns beginning scenes — each storyteller begins one scene per act (more in small groups; three in solo). After everyone's scenes, the Act Close plays, and a new act begins. After the third close, the Chronicle is complete.</p>
      <p><strong style="color:var(--gold)">Beginning a scene.</strong> Choose a scene card from your hand and an archetype to lead it. Describe what the camera sees as the scene opens, then narrate freely — as director, as actor, or both. Cast the others in roles; no one owns any character. The prompt on the card is a door, not a cage.</p>
      <p><strong style="color:var(--gold)">Buying in.</strong> Any other storyteller may play one card into your scene — a scene card from their hand, or an omen from the row — and describe how it manifests. Three cards at most may enter a scene, counting the first. The one who began the scene decides when it ends.</p>
      <p><strong style="color:var(--gold)">Omens.</strong> Interpret them literally, metaphorically, or obliquely. They accrue meaning with each recurrence. After a scene, an omen you played returns to you; trade it back to the omen deck at the table any time to draw a fresh scene card. If you must begin a scene with no scene card and no omen to trade, you lose your scene for the act.</p>
      <p><strong style="color:var(--gold)">Turning the archetypes.</strong> When a scene ends, check every archetype's face-up condition — if it was met, the card turns, and its tone changes with it.</p>
      <p><strong style="color:var(--gold)">The tones.</strong> ${TONES.map(t=>`<em>${t}</em> — ${TONE_GLOSS[t]}`).join(' ')}</p>
      <p><strong style="color:var(--gold)">Hidden Sins.</strong> Each storyteller holds one secret keyed to a combination of tones. When a scene's counted tones contain that combination, the sin comes to light at once: a bonus vignette told through three omens, answering the secret's question. Each sin is revealed but once.</p>
      <p><strong style="color:var(--gold)">The Act Close.</strong> Its condition names who begins it; the act's most numerous tone commands an element it must include. Others may buy in as usual.</p>
      <p><strong style="color:var(--blood-bright)">The Strike.</strong> Anyone may strike anything from the story at any moment — no questions asked, no reasons owed. Use the ☒ in the Record, or simply say so aloud. The stricken thing never was. Care for the people at your table above all else.</p>
    </div>
    <div class="btnrow"><button class="primary" onclick="closeOverlay()">Return</button></div>`;
  $('overlay').style.display='block';
}
export function closeOverlay(){ $('overlay').style.display='none'; }

export function initOverlayDismiss(){
  $('overlay').addEventListener('click', e=>{ if(e.target.id==='overlay') closeOverlay(); });
}
