import { $, esc, toneBadge, toneCountBadge, ACT_NAMES, ROMAN, progressDotsHTML, setupProgressHTML, actTrackHTML } from '../../engine/utils.js';
import { HOOKS, TONES, ARCHETYPES } from '../../data/index.js';
import { State } from '../../engine/state.js';
import { show } from '../screens.js';
import { archCard, omenCard, sceneCardHTML, journalEntrySummaryHTML, sceneAnatomyDiagramHTML, sceneTrackerHTML } from '../cards.js';
import { faceUp, maxContrib, actToneCounts } from '../../engine/rules.js';
import { renderChronicle } from '../renderChronicle.js';
import { hasSeenIntro, markIntroSeen } from '../../engine/firstrun.js';
import { ART_STYLES, artStylePickerHTML, archetypeArtHTML, currentArtStyle, hookArtHTML, victimArtHTML } from '../art.js';
import { createRoom, joinRoom, subscribeRoom, unsubscribeRoom, subscribeMyPrivate, unsubscribeMyPrivate, touchRoom } from '../../sync/liveRoom.js';
import { getUid, ensureSignedIn } from '../../sync/auth.js';
import { bleakifyButton } from '../bleakify.js';
import {
  liveBeginTale, liveSaveArchSetup, liveFinishVictim, liveBeginScene, liveBeginClose,
  liveContribute, liveEndSceneAndResolve, liveConfirmSecret, liveClaimSecret,
  liveAdvanceAfterClose, liveTradeOmen, liveForfeitScene
  , liveSetReady, liveSwapArchetype, liveVoteOmen
} from '../../sync/liveActions.js';
import { draft, myPrivate, resetDraft, setDraft, setMyPrivate, clearAdvanceTimer, clearRoomHeartbeat, mySeatIndex, fail } from './shared.js';
/* ---------------- hub ---------------- */
function onlineTurnSeatHTML(room,p,i,mySeat){
  const isMe = i===mySeat;
  const noWayToLead = p.handCount===0 && (p.omens.length===0 || room.sceneDeck.length===0);
  const needsTrade = p.handCount===0 && !noWayToLead;
  const state = p.scenesLeft<=0 ? 'done' : noWayToLead ? 'blocked' : needsTrade ? 'trade' : 'ready';
  const label = state==='done' ? 'Finished this act' : state==='blocked' ? 'No card to lead' : state==='trade' ? 'Trade first' : isMe ? 'You are ready' : 'Ready to lead';
  const readyLabel = p.readyRole==='lead' ? 'Ready to lead' : p.readyRole==='follow' ? 'Ready to follow' : p.readyRole==='watch' ? 'Ready to watch' : '';
  return `<div class="turn-seat ${state}${isMe?' mine':''}">
    <div class="turn-seat-head"><strong>${esc(p.name)}${isMe?' · you':''}</strong><span>${readyLabel?`<em class="ready-badge ready-badge-${p.readyRole}">${readyLabel}</em>`:label}</span></div>
    <p>${p.scenesLeft} scene${p.scenesLeft===1?'':'s'} left to lead · ${p.handCount} scene card${p.handCount===1?'':'s'} · ${p.omens.length} held omen${p.omens.length===1?'':'s'}</p>
    <div class="turn-seat-actions">
      ${state==='ready' && isMe?'<button class="primary" onclick="onlineStartScene()">Begin a scene</button>':''}
      ${state==='blocked' && p.scenesLeft>0?`<button class="blood" onclick="onlineForfeitScene(${i})">${isMe?'Forfeit my scene':`Forfeit for ${esc(p.name)}`}</button>`:''}
      ${isMe?`<button class="ghost" onclick="openOnlineHand()">View my cards (${myPrivate.hand.length+p.omens.length})</button>`:''}
      ${isMe?`<div class="ready-controls"><button class="ghost ready-role ready-role-lead${p.readyRole==='lead'?' selected':''}" aria-pressed="${p.readyRole==='lead'}" onclick="onlineSetReady('lead')">${p.readyRole==='lead'?'✓ ':''}Ready to lead</button><button class="ghost ready-role ready-role-follow${p.readyRole==='follow'?' selected':''}" aria-pressed="${p.readyRole==='follow'}" onclick="onlineSetReady('follow')">${p.readyRole==='follow'?'✓ ':''}Ready to follow</button><button class="ghost ready-role ready-role-watch${p.readyRole==='watch'?' selected':''}" aria-pressed="${p.readyRole==='watch'}" onclick="onlineSetReady('watch')">${p.readyRole==='watch'?'✓ ':''}Ready to watch</button></div>`:''}
    </div>
  </div>`;
}
export async function onlineSetReady(role){
  const me=State.G?.players[mySeatIndex(State.G)];
  try{ await liveSetReady(State.onlineRoomCode,me?.readyRole===role?null:role); }catch(err){fail(err);}
}
export async function onlineVoteOmen(index){ try{ await liveVoteOmen(State.onlineRoomCode,index); }catch(err){fail(err);} }

function onlineMyHandHTML(room,mySeat){
  const me = room.players[mySeat];
  if(!me) return '';
  return `<details class="disclose personal-hand" id="online-my-hand">
    <summary>My Hand <span class="small muted">${myPrivate.hand.length} scene card${myPrivate.hand.length===1?'':'s'} · ${me.omens.length} omen${me.omens.length===1?'':'s'} · private to this screen</span></summary>
    <div class="disclose-body">
      <p class="hand-section-label">Scene cards · ${myPrivate.hand.length}</p>
      <div class="cardgrid hand-cardgrid">${myPrivate.hand.map(c=>sceneCardHTML(c)).join('') || '<span class="small muted">No scene cards in hand.</span>'}</div>
      ${me.omens.length?`<p class="hand-section-label">Held omens · ${me.omens.length}</p><div class="cardgrid hand-cardgrid">${me.omens.map((o,oi)=>`
        <div class="held-card">${omenCard(o)}${room.sceneDeck.length?`<button class="ghost" onclick="onlineTradeOmen(${oi})">Trade for a scene card</button>`:''}</div>`).join('')}</div>`:''}
      ${myPrivate.secrets.map(s=>`<details class="secretbox"><summary>Hidden Sin ${s.used?'— revealed':'(yours alone to read)'}</summary>
        <div class="small" style="margin-top:6px">${s.combo.map(toneBadge).join(' ')}<br><span style="color:#c9b3de">${esc(s.q)}</span>
        ${s.used?'':'<br><span class="muted">Unlocks when a scene’s tones contain this combination.</span>'}</div></details>`).join('')}
    </div>
  </details>`;
}

export function renderOnlineHub(room){
  const mySeat = mySeatIndex(room);
  const me = room.players[mySeat];
  const close = room.actClose[room.act];
  const remaining = room.players.reduce((s,p)=>s+p.scenesLeft,0);
  const banner = room.pendingSecret ? `<div class="notice">A Hidden Sin is being revealed at the table right now…</div>` : '';
  const iCanLead = me && me.scenesLeft>0 && me.handCount>0;
  $('scr-hub').innerHTML = `
    <h2 class="center" style="margin-top:8px">${ACT_NAMES[room.act]}</h2>
    <p class="center muted">${esc(room.hook.title)} · The Victim: ${esc(room.victim.name)}</p>
    ${actTrackHTML(room.act)}
    <div class="ornament">✦ ❦ ✦</div>
    ${banner}
    <div class="panel spotlight turn-board">
      <div class="turn-board-head">
        <div><span class="turn-kicker">Who acts now?</span><h3>${iCanLead?'You may begin the next scene':'Any ready storyteller may begin'}</h3></div>
        <span class="pill">${remaining} scene${remaining===1?'':'s'} before the close</span>
      </div>
      <p class="turn-guidance">There is no fixed turn order. A storyteller marked ready may begin; once the scene opens, everyone else gets one chance to buy in.</p>
      <div class="turn-seats">${room.players.map((p,i)=>onlineTurnSeatHTML(room,p,i,mySeat)).join('')}</div>
    </div>
    ${onlineMyHandHTML(room,mySeat)}
    ${room.journal.length ? `<h3 style="color:var(--gold)">Last Scene</h3>${journalEntrySummaryHTML(room.journal[room.journal.length-1], {compact:true})}` : ''}
    <div class="panel tight">
      <h3 style="color:var(--blood-bright)">The Act Close — foreseen</h3>
      <p><span class="sc" style="color:#eddfba">${esc(close.title)}.</span> <span class="muted small">${esc(close.cond)}</span></p>
      <p class="small" style="color:#cfc2a2">${esc(close.prompt)}</p>
      <p class="small muted">${TONES.map(t=>`${toneBadge(t)} <span>${esc(close.elements[t])}</span>`).join('<br>')}</p>
    </div>
    <details class="disclose" open>
      <summary>The Archetypes <span class="small muted">(${room.archetypes.length})</span></summary>
      <div class="disclose-body">
        <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-top:8px">
          ${room.archetypes.map(a=>archCard(a)).join('')}
        </div>
      </div>
    </details>
    <details class="disclose" open>
      <summary>The Omen Row <span class="small muted">(${room.omenRow.length})</span></summary>
      <div class="disclose-body">
        <div class="cardgrid compact">${room.omenRow.map((o,i)=>`<div>${omenCard(o)}<button class="ghost" onclick="onlineVoteOmen(${i})">Vote to replace (${Object.values(room.omenVotes||{}).filter(v=>v===i).length}/${room.players.length})</button></div>`).join('')}</div>
      </div>
    </details>
    <details class="disclose">
      <summary>The Storytellers <span class="small muted">${room.players.length} in play · Scene deck ${room.sceneDeck.length} · Omen deck ${room.omenDeck.length}</span></summary>
      <div class="disclose-body">
        <div class="pgrid" style="margin-top:8px">
          ${room.players.map((p,i)=>onlinePlayerPanel(p,i===mySeat)).join('')}
        </div>
      </div>
    </details>`;
}
function onlinePlayerPanel(p, isMe){
  // This is the public roster view: only counts and publicly held omens.
  // The seated player's real hand and Hidden Sin live in the private
  // "My Hand" drawer above, populated from their owner-only document.
  const handHTML = `<span class="small muted"><span>${p.handCount} scene card${p.handCount===1?'':'s'} in hand.${isMe?' Use “My Hand” above to read yours.':''}</span></span>`;
  const secretsHTML = !isMe && p.secretsCount ? `<p class="small muted">${p.unrevealedSecretsCount} unrevealed Hidden Sin${p.unrevealedSecretsCount===1?'':'s'}.</p>` : '';
  return `<div class="ppanel">
    <h4>${esc(p.name)}${isMe?' (you)':''}</h4>
    <div class="handrow">${handHTML}</div>
    ${p.omens.length?`<div class="handrow">${p.omens.map(o=>`
      <div class="minicard omen"><div class="mc-t">${o.glyph} ${esc(o.title)}</div></div>`).join('')}</div>`:''}
    ${secretsHTML}
  </div>`;
}
export function openOnlineHand(){
  const hand = $('online-my-hand');
  if(!hand) return;
  hand.open = true;
  hand.classList.remove('hand-focus');
  requestAnimationFrame(()=>{
    hand.classList.add('hand-focus');
    hand.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>hand.classList.remove('hand-focus'),1400);
  });
}
export function onlineStartScene(){
  setDraft({cardIdx:null, archIdx:null, archIdxs:[]});
  renderOnlineScenePick();
  show('scr-scene');
}
export async function onlineTradeOmen(omenIdx){
  try{ await liveTradeOmen(State.onlineRoomCode, omenIdx); } catch(err){ fail(err); }
}
export async function onlineForfeitScene(seat){
  try{ await liveForfeitScene(State.onlineRoomCode, seat); } catch(err){ fail(err); }
}

