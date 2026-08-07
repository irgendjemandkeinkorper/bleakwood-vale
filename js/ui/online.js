import { $, esc, toneBadge, ACT_NAMES, ROMAN, progressDotsHTML, setupProgressHTML, actTrackHTML } from '../engine/utils.js';
import { HOOKS, TONES, ARCHETYPES } from '../data/index.js';
import { State } from '../engine/state.js';
import { show } from './screens.js';
import { archCard, omenCard, sceneCardHTML, journalEntrySummaryHTML, sceneAnatomyDiagramHTML, sceneTrackerHTML } from './cards.js';
import { faceUp, maxContrib, actToneCounts } from '../engine/rules.js';
import { renderChronicle } from './renderChronicle.js';
import { hasSeenIntro, markIntroSeen } from '../engine/firstrun.js';
import { ART_STYLES, artStylePickerHTML, archetypeArtHTML, currentArtStyle, hookArtHTML, victimArtHTML } from './art.js';
import { createRoom, joinRoom, subscribeRoom, unsubscribeRoom, subscribeMyPrivate, unsubscribeMyPrivate, touchRoom } from '../sync/liveRoom.js';
import { getUid, ensureSignedIn } from '../sync/auth.js';
import { bleakifyButton } from './bleakify.js';
import {
  liveBeginTale, liveSaveArchSetup, liveFinishVictim, liveBeginScene, liveBeginClose,
  liveContribute, liveEndSceneAndResolve, liveConfirmSecret, liveClaimSecret,
  liveAdvanceAfterClose, liveTradeOmen, liveForfeitScene
  , liveSetReady, liveSwapArchetype, liveVoteOmen
} from '../sync/liveActions.js';

/* Small per-device scratch state for in-progress, uncommitted composition
   (which card/archetype picked, contribution draft, flip checkboxes,
   secret-omen picks). None of this is synced — only the final submit
   actions above write to Firestore. Reset whenever the underlying
   room-driven phase changes shape from under it. */
let draft = {};
let draftContext = null;
function resetDraft(){ draft = {}; draftContext = null; }

/* Room snapshots arrive for every other player's action too. Keep local
   composition state while the player is still working in the same logical
   action, and only clear it when the server moves the room to a new phase,
   scene, or secret. Contribution counts intentionally do not belong in this
   key: another player buying in should not erase a draft that is still valid. */
function roomDraftContext(room){
  if(!room) return null;
  const journalLength = Array.isArray(room.journal) ? room.journal.length : 0;
  if(room.phase==='archsetup') return `archsetup|${room.archIdx}`;
  if(room.phase==='victim') return `victim|${room.victim?.facts?.length||0}`;
  if(room.phase==='playing' && room.pendingSecret){
    const u = room.pendingSecret;
    return `secret|${room.act}|${journalLength}|${u.pi}|${u.secretIndex}|${u.journalIndex}`;
  }
  if(room.phase==='playing' && room.current){
    const c = room.current;
    return `scene|${room.act}|${journalLength}|${c.type}|${c.starter}|${c.archIdx}|${c.card?.title||''}`;
  }
  return `${room.phase}|${room.act??0}|${journalLength}|${room.closeDone?'closed':'open'}`;
}
function preserveDraftFor(room){
  const nextContext = roomDraftContext(room);
  if(nextContext!==draftContext){ draft = {}; draftContext = nextContext; }
}

/* My own hand + Hidden Sin(s) — kept live via a subscription to my own
   private doc, never read from the public room object (Stage 4). */
let myPrivate = {hand:[], secrets:[]};

/* Guards against re-attempting a claim we already tried for the same
   journal entry (e.g. if it fails, don't retry-spam on every snapshot). */
let lastClaimAttempt = -1;
/* Timer for the delayed advance-after-close cascade; cleared whenever the
   underlying condition stops being true so it never fires stale. */
let advanceTimer = null;
let roomHeartbeat = null;
let renderedScene = {signature:null, contributions:0};

function clearAdvanceTimer(){ if(advanceTimer){ clearTimeout(advanceTimer); advanceTimer = null; } }
function clearRoomHeartbeat(){ if(roomHeartbeat){ clearInterval(roomHeartbeat); roomHeartbeat=null; } }

function sceneAnimationSlot(room){
  const c = room.current;
  if(!c){ renderedScene = {signature:null,contributions:0}; return null; }
  const signature = `${room.act}|${room.journal.length}|${c.type}|${c.starter}|${c.card.title}`;
  let slot = null;
  if(signature!==renderedScene.signature) slot = 0;
  else if(c.contributions.length>renderedScene.contributions) slot = Math.min(c.contributions.length,2);
  renderedScene = {signature,contributions:c.contributions.length};
  return slot;
}

/* Called on every room snapshot. Reactively claims a Hidden Sin if my own
   private secrets match the newest journal entry, and schedules the
   delayed act-advance once an Act Close has resolved with nothing
   pending — see the file header in js/sync/liveActions.js for why this
   can't just happen synchronously inside the resolving transaction. */
function reactToRoom(room){
  if(room.phase!=='playing'){ clearAdvanceTimer(); return; }
  if(room.current===null && !room.pendingSecret && room.journal.length>0){
    const idx = room.journal.length-1;
    if(idx!==lastClaimAttempt){
      lastClaimAttempt = idx;
      const entry = room.journal[idx];
      if(entry && (entry.type==='scene' || entry.type==='close')){
        const counts = {Obsession:0,Guilt:0,Dread:0};
        entry.tones.forEach(t=>counts[t]++);
        const haveMatch = myPrivate.secrets.some(s => !s.used &&
          (()=>{ const need={Obsession:0,Guilt:0,Dread:0}; s.combo.forEach(t=>need[t]++);
                 return ['Obsession','Guilt','Dread'].every(t=>counts[t]>=need[t]); })());
        if(haveMatch) liveClaimSecret(State.onlineRoomCode, idx).catch(()=>{}); // lost the race or stale — fine, silent
      }
    }
  }
  if(room.current===null && !room.pendingSecret && room.closeDone){
    if(!advanceTimer) advanceTimer = setTimeout(()=>{
      advanceTimer = null;
      liveAdvanceAfterClose(State.onlineRoomCode).catch(()=>{});
    }, 1500);
  } else {
    clearAdvanceTimer();
  }
}

function mySeatIndex(room){
  const uid = getUid();
  if(!room || !room.seats) return -1;
  const idx = room.seats[uid];
  return idx===undefined ? -1 : idx;
}
function fail(err){ alert(err && err.message ? err.message : String(err)); }

/* ---------------- entry: create or join ---------------- */
export function showOnlineEntry(){
  unsubscribeRoom();
  unsubscribeMyPrivate();
  clearAdvanceTimer();
  resetDraft();
  State.onlineRoomCode = null;
  State.G = null;
  $('scr-online-entry').innerHTML = `
    ${setupProgressHTML(0,'Choose an Incident or join a table','Open a new premise or enter a room code from your host.')}
    <h2 class="center">Play Online</h2>
    <p class="center muted">Gather your table across separate screens. One person opens the tale; everyone else joins with the code.</p>
    <div class="ornament">❦</div>
    <div class="pgrid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));max-width:900px;margin:0 auto">
      <div class="panel">
        <h3 style="color:var(--gold)">Open a New Tale</h3>
        <label class="fld">Choose the Incident</label>
        <select id="oe-hook" onchange="onlineRefreshArtPicker()">${HOOKS.map((h,i)=>`<option value="${i}">${esc(h.title)}</option>`).join('')}</select>
        <label class="fld">Your name</label>
        <input type="text" id="oe-host-name" placeholder="Storyteller I">
        <div id="oe-art-style-picker">${artStylePickerHTML(HOOKS[0].id,'oe-art-style')}</div>
        <div class="btnrow">
          <button class="primary" onclick="onlineCreateRoom()">Open the Table</button>
        </div>
      </div>
      <div class="panel">
        <h3 style="color:var(--gold)">Join a Tale in Progress</h3>
        <label class="fld">Room code</label>
        <input type="text" id="oe-join-code" placeholder="e.g. K7QRM" style="text-transform:uppercase">
        <label class="fld">Your name</label>
        <input type="text" id="oe-join-name" placeholder="Your name">
        <div class="btnrow">
          <button class="primary" onclick="onlineJoinRoom()">Join the Table</button>
        </div>
      </div>
    </div>
    <div class="btnrow" style="justify-content:center;margin-top:20px">
      <button class="ghost" onclick="show('scr-title')">Back</button>
    </div>`;
  show('scr-online-entry');
}
export function onlineRefreshArtPicker(){
  const selected = document.querySelector('input[name="oe-art-style"]:checked')?.value || null;
  const hook = HOOKS[+$('oe-hook').value];
  $('oe-art-style-picker').innerHTML = artStylePickerHTML(hook.id,'oe-art-style',selected);
}
export async function onlineCreateRoom(){
  try{
    const hook = HOOKS[+$('oe-hook').value];
    const name = ($('oe-host-name').value||'').trim();
    const artChoice = document.querySelector('input[name="oe-art-style"]:checked');
    if(!artChoice){
      const error = $('oe-art-style-error');
      if(error) error.textContent = 'Choose Painterly Gothic or Tarot Gothic before opening the table.';
      document.querySelector('.art-style-picker')?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    const code = await createRoom(hook, name, artChoice.value);
    localStorage.setItem('bleakwood-player-name',name);
    enterRoom(code);
  } catch(err){ fail(err); }
}
export async function onlineJoinRoom(){
  try{
    const code = ($('oe-join-code').value||'').trim().toUpperCase();
    const name = ($('oe-join-name').value||'').trim();
    if(!name) throw new Error('Enter your name before joining the table.');
    await joinRoom(code, name);
    localStorage.setItem('bleakwood-player-name',name);
    enterRoom(code);
  } catch(err){ fail(err); }
}
function enterRoom(code){
  State.onlineRoomCode = code;
  localStorage.setItem('bleakwood-room-code',code);
  try { history.replaceState(null, '', '?room='+code); } catch(e){}
  resetDraft();
  myPrivate = {hand:[], secrets:[]};
  lastClaimAttempt = -1;
  subscribeMyPrivate(code, getUid(), priv => { myPrivate = priv; });
  subscribeRoom(code, routeAndRender);
  clearRoomHeartbeat(); touchRoom(code).catch(()=>{});
  roomHeartbeat=setInterval(()=>touchRoom(code).catch(()=>{}),30000);
}

export function leaveOnlineRoom(){
  unsubscribeRoom();
  unsubscribeMyPrivate();
  clearAdvanceTimer();
  clearRoomHeartbeat();
  resetDraft();
  State.onlineRoomCode = null;
  State.G = null;
  try { history.replaceState(null, '', location.pathname); } catch(e){}
  show('scr-title');
}

/* Auto-rejoin if the URL already carries ?room=CODE (e.g. a reopened tab). */
export async function tryAutoRejoin(){
  const params = new URLSearchParams(location.search);
  const code = params.get('room') || localStorage.getItem('bleakwood-room-code');
  if(!code) return false;
  const rememberedName=localStorage.getItem('bleakwood-player-name')||'';
  if(!rememberedName){
    showOnlineEntry();
    const codeInput=$('oe-join-code');
    if(codeInput){ codeInput.value=code.toUpperCase(); codeInput.focus(); }
    return false;
  }
  try {
    await ensureSignedIn();
    // joinRoom() is a no-op write if we're already seated, which is exactly
    // the reconnect case; it throws if we're a stranger to a live game.
    await joinRoom(code, rememberedName);
    enterRoom(code);
    return true;
  } catch(err){
    console.warn('[online] auto-rejoin failed', err);
    return false;
  }
}

/* ---------------- router ---------------- */
export function routeAndRender(room){
  const animateSlot = sceneAnimationSlot(room);
  State.G = room;
  preserveDraftFor(room);
  reactToRoom(room);
  if(room.phase==='lobby'){ renderOnlineLobby(room); show('scr-online-lobby'); return; }
  if(room.phase==='finished' || room.act>3){ renderChronicle(false); show('scr-chronicle'); return; }
  if(room.phase==='archsetup'){ renderOnlineArchSetup(room); show('scr-archsetup'); return; }
  if(room.phase==='victim'){ renderOnlineVictim(room); show('scr-victim'); return; }
  // phase === 'playing'
  if(room.pendingSecret){
    if(mySeatIndex(room)===room.pendingSecret.pi){ renderOnlineSecret(room); show('scr-secret'); return; }
    renderOnlineHub(room); show('scr-hub'); return; // banner inside renderOnlineHub explains the wait
  }
  if(room.current){ renderOnlineScene(room,animateSlot); show('scr-scene'); return; }
  const remaining = room.players.reduce((s,p)=>s+p.scenesLeft,0);
  if(remaining<=0 && !room.closeDone){ renderOnlineCloseIntro(room); show('scr-close'); return; }
  renderOnlineHub(room); show('scr-hub');
}

/* ---------------- lobby ---------------- */
function renderOnlineLobby(room){
  const uid = getUid();
  const isHost = uid===room.hostUid;
  const seatCount = room.players.length;
  const emptySeats = Math.max(0, 6-seatCount);
  const style = ART_STYLES.find(s=>s.id===currentArtStyle(room));
  $('scr-online-lobby').innerHTML = `
    ${setupProgressHTML(1,'Gather the Storytellers','Share the room code, then let the host begin the tale.')}
    <h2 class="center">The Table Gathers</h2>
    <div class="ornament">❦</div>
    <div class="panel" style="max-width:640px;margin:0 auto">
      <div class="lobby-incident">
        ${hookArtHTML(room.hook,{className:'lobby-incident-art'})}
        <div>
          <p class="small" style="color:var(--gold)">${esc(room.hook.title)}</p>
          <p class="small muted">${esc(room.hook.epigraph)}</p>
          <p class="small"><span class="pill">${esc(style.label)} · locked for this tale</span></p>
        </div>
      </div>
      <p class="center" style="margin:14px 0">
        <span class="sc" style="color:var(--gold);font-size:.85rem;letter-spacing:.15em">ROOM CODE</span><br>
        <span style="font-size:2.2rem;letter-spacing:.3em;color:#eddfba">${esc(State.onlineRoomCode)}</span>
      </p>
      <p class="center"><button class="ghost" id="btn-copy-link" onclick="onlineCopyRoomLink()">Copy invite link</button></p>
      <p class="small muted center">Share the code or link — everyone else joins from “Play Online.”</p>
      <details class="disclose" style="margin-top:14px">
        <summary>Read the Incident aloud</summary>
        <div class="disclose-body"><p class="small" style="color:#e3d7b8">${room.hook.intro}</p></div>
      </details>
      <h3 style="color:var(--gold);margin-top:18px">Seated (${seatCount} of 6)</h3>
      <div class="btnrow">
        ${room.players.map((p,i)=>`<span class="pill">${i===0?'👑 ':''}${esc(p.name)}${p.uid===uid?' (you)':''}</span>`).join('')}
        ${Array.from({length:emptySeats}).map(()=>`<span class="pill" style="opacity:.4">empty seat</span>`).join('')}
      </div>
      <div class="btnrow" style="margin-top:18px;justify-content:center">
        ${isHost
          ? `<button class="primary" onclick="onlineBeginTale()">Begin the Tale</button>`
          : `<span class="pill">Waiting for the host to begin…</span>`}
        <button class="ghost" onclick="leaveOnlineRoom()">Leave</button>
      </div>
    </div>`;
}
export async function onlineCopyRoomLink(){
  const url = location.origin + location.pathname + '?room=' + State.onlineRoomCode;
  const btn = $('btn-copy-link');
  try {
    if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
    else {
      const field=document.createElement('textarea'); field.value=url; field.setAttribute('readonly','');
      field.style.position='fixed'; field.style.opacity='0'; document.body.appendChild(field); field.select();
      if(!document.execCommand('copy')) throw new Error('Clipboard copy was blocked.');
      field.remove();
    }
    if(btn){ const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(()=>{ if(btn.isConnected) btn.textContent = orig; }, 1800); }
  } catch(err) {
    fail(new Error('Could not copy automatically — the link is: ' + url));
  }
}
export async function onlineBeginTale(){
  try{ await liveBeginTale(State.onlineRoomCode); } catch(err){ fail(err); }
}

/* ---------------- archetype setup ---------------- */
function renderOnlineArchSetup(room){
  const i = room.archIdx, a = room.archetypes[i];
  const answerer = room.players[i % room.players.length];
  const isMe = mySeatIndex(room) === (i % room.players.length);
  const showForm = isMe || draft.answeringForAbsent;
  $('scr-archsetup').innerHTML = `
    ${setupProgressHTML(3,'Establish the Archetypes',`Question ${i+1} of six — ${esc(answerer.name)} answers next.`)}
    <p class="center muted sc" style="letter-spacing:.2em">ESTABLISHING THE DEAD</p>
    ${progressDotsHTML(i, 6, `Question ${ROMAN[i+1]} of VI`)}
    <div class="ornament">❦</div>
    <div style="max-width:760px;margin:0 auto">
      <div class="setup-card-layout">
        ${archetypeArtHTML(a,0,{className:'setup-card-art'})}
        <div class="card">
        <div class="c-kicker">Archetype</div>
        <div class="c-title" style="font-size:1.5rem">${a.role}</div>
        <div class="c-prompt">${a.flavor}</div>
        <hr class="rule" style="border-color:rgba(60,45,25,.3)">
        <div style="font-size:1.05rem">“${a.setup[room.hook.id]}”</div>
        <div class="small" style="margin-top:8px;color:var(--blood)">${toneBadge(a.sides[0].tone)} <span style="color:var(--ink-soft)">— ${esc(a.sides[0].cond)} flip this card.</span></div>
        <div class="btnrow"><button class="ghost" onclick="onlineSwapArchSetup()">Show three replacement options</button></div>
        ${draft.archSwapOptions?.length ? `<div class="panel tight"><p class="small muted">Choose a replacement:</p><div class="btnrow">${draft.archSwapOptions.map((x,n)=>`<button class="ghost" onclick="onlineChooseArchSwap(${n})">${esc(x.role)}</button>`).join('')}</div></div>` : ''}
        </div>
      </div>
      <div class="panel">
        ${showForm ? `
          <p class="small muted">${isMe ? 'Answer in character, or plainly. The answer becomes a fact about the Victim and about this archetype.' : `Answering on behalf of ${esc(answerer.name)}, since they’re away.`}</p>
          <label class="fld">Name this archetype</label>
          <input type="text" id="arch-name" placeholder="e.g. Dr. Ambrose Vane">
          <label class="fld">The answer</label>
          <textarea id="arch-answer" placeholder="What is established…"></textarea>
          <div class="btnrow"><button class="primary" onclick="onlineSaveArchSetup()">${i<5?'Next Question':'To the Victim'}</button></div>
        ` : `
          <p class="small muted center">Waiting on ${esc(answerer.name)} to answer…</p>
          <p class="center"><button class="ghost" onclick="onlineAnswerForAbsent()">Answer for them, if they’re away</button></p>
        `}
      </div>
    </div>`;
}
export function onlineAnswerForAbsent(){ draft.answeringForAbsent = true; renderOnlineArchSetup(State.G); }
export async function onlineSaveArchSetup(){
  try{
    const name = $('arch-name').value, answer = $('arch-answer').value;
    await liveSaveArchSetup(State.onlineRoomCode, name, answer);
  } catch(err){ fail(err); }
}
export async function onlineSwapArchSetup(){
  const used=new Set(State.G.archetypes.map(a=>a.role));
  draft.archSwapOptions=ARCHETYPES.filter(a=>!used.has(a.role)).sort(()=>Math.random()-.5).slice(0,3); renderOnlineArchSetup(State.G);
}
export async function onlineChooseArchSwap(index){
  const replacement=(draft.archSwapOptions||[])[index]; if(!replacement) return;
  try{ await liveSwapArchetype(State.onlineRoomCode,State.G.archIdx,replacement); draft.archSwapOptions=[]; }catch(err){fail(err);}
}

/* ---------------- victim ---------------- */
function renderOnlineVictim(room){
  $('scr-victim').innerHTML = `
    ${setupProgressHTML(4,'Name the Victim','Gather the six answers, then give the dead a name.')}
    <h2 class="center">The Victim</h2>
    <p class="center muted" style="max-width:640px;margin:6px auto">${room.hook.victimLine}</p>
    <div class="ornament">❦</div>
    <div class="victim-setup-layout">
      ${victimArtHTML(room.hook,{className:'victim-setup-art'})}
      <div>
        <div class="panel tight">
          ${room.victim.facts.map(f=>`<p class="small" style="margin:6px 0"><span style="color:var(--gold)">${esc(f.role)}:</span> <span>${esc(f.a)}</span></p>`).join('')}
        </div>
        <div class="panel">
          <label class="fld">Together, name the deceased</label>
          <input type="text" id="victim-name" placeholder="This is usually the hardest part.">
          <div class="btnrow"><button class="primary" onclick="onlineFinishVictim()">Deal the Cards</button></div>
        </div>
      </div>
    </div>`;
}
export async function onlineFinishVictim(){
  try{ await liveFinishVictim(State.onlineRoomCode, $('victim-name').value); } catch(err){ fail(err); }
}

/* ---------------- hub ---------------- */
function onlineTurnSeatHTML(room,p,i,mySeat){
  const isMe = i===mySeat;
  const noWayToLead = p.handCount===0 && (p.omens.length===0 || room.sceneDeck.length===0);
  const needsTrade = p.handCount===0 && !noWayToLead;
  const state = p.scenesLeft<=0 ? 'done' : noWayToLead ? 'blocked' : needsTrade ? 'trade' : 'ready';
  const label = state==='done' ? 'Finished this act' : state==='blocked' ? 'No card to lead' : state==='trade' ? 'Trade first' : isMe ? 'You are ready' : 'Ready to lead';
  return `<div class="turn-seat ${state}${isMe?' mine':''}">
    <div class="turn-seat-head"><strong>${esc(p.name)}${isMe?' · you':''}</strong><span>${label}</span></div>
    <p>${p.scenesLeft} scene${p.scenesLeft===1?'':'s'} left to lead · ${p.handCount} scene card${p.handCount===1?'':'s'} · ${p.omens.length} held omen${p.omens.length===1?'':'s'}</p>
    <div class="turn-seat-actions">
      ${state==='ready' && isMe?'<button class="primary" onclick="onlineStartScene()">Begin a scene</button>':''}
      ${state==='blocked' && p.scenesLeft>0?`<button class="blood" onclick="onlineForfeitScene(${i})">${isMe?'Forfeit my scene':`Forfeit for ${esc(p.name)}`}</button>`:''}
      ${isMe?`<button class="ghost" onclick="openOnlineHand()">View my cards (${myPrivate.hand.length+p.omens.length})</button>`:''}
      ${isMe?`<div class="ready-controls"><button class="ghost" onclick="onlineSetReady('lead')">${p.readyRole==='lead'?'✓ ':''}Ready to lead</button><button class="ghost" onclick="onlineSetReady('follow')">${p.readyRole==='follow'?'✓ ':''}Ready to follow</button><button class="ghost" onclick="onlineSetReady('watch')">${p.readyRole==='watch'?'✓ ':''}Ready to watch</button></div>`:''}
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

function renderOnlineHub(room){
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
  draft = {cardIdx:null, archIdx:null, archIdxs:[]};
  renderOnlineScenePick();
  show('scr-scene');
}
export async function onlineTradeOmen(omenIdx){
  try{ await liveTradeOmen(State.onlineRoomCode, omenIdx); } catch(err){ fail(err); }
}
export async function onlineForfeitScene(seat){
  try{ await liveForfeitScene(State.onlineRoomCode, seat); } catch(err){ fail(err); }
}

/* ---------------- act close intro ---------------- */
function renderOnlineCloseIntro(room){
  const close = room.actClose[room.act];
  const counts = actToneCounts();
  const max = Math.max(...TONES.map(t=>counts[t]));
  const tied = TONES.filter(t=>counts[t]===max);
  const chosenTone = tied[0];
  $('scr-close').innerHTML = `
    <h2 class="center" style="color:var(--blood-bright)">${ACT_NAMES[room.act]} draws to a close</h2>
    ${actTrackHTML(room.act)}
    <div class="ornament">✦</div>
    <div style="max-width:720px;margin:0 auto">
      <div class="card">
        <div class="c-kicker">Act Close</div>
        <div class="c-title" style="font-size:1.4rem">${esc(close.title)}</div>
        <div class="c-prompt">${esc(close.prompt)}</div>
      </div>
      <div class="panel spotlight">
        <p class="small" style="color:var(--gold)">${esc(close.cond)}</p>
        <p class="small muted">Tones this act: ${TONES.map(t=>`<span class="tone count ${t}">${counts[t]}</span>`).join(' ')}</p>
        ${tied.length===1
          ? `<p><strong style="color:var(--blood-bright)">Dominant tone: ${toneBadge(tied[0])}</strong> — must <span>${esc(close.elements[tied[0]])}</span></p>`
          : `<label class="fld">The tones are tied — choose the element</label>
             <select id="close-el">${tied.map(t=>`<option value="${t}">${t} — ${esc(close.elements[t])}</option>`).join('')}</select>`}
        <label class="fld">Who begins the close?</label>
        <select id="close-starter">${room.players.map((p,i)=>`<option value="${i}">${esc(p.name)}</option>`).join('')}</select>
        <label class="fld">Which archetype leads it?</label>
        <select id="close-arch">${room.archetypes.map((a,i)=>`<option value="${i}">${esc(a.name||a.role)} — ${esc(a.role)}</option>`).join('')}</select>
        <label class="fld">What the camera sees as the close opens</label>
        <textarea id="close-opening" placeholder="The camera rises above the Vale…"></textarea>
        <div class="btnrow"><button class="primary" onclick="onlineBeginClose()">Play the Act Close</button></div>
      </div>
    </div>`;
  draft.closeTone = chosenTone;
}
export async function onlineBeginClose(){
  try{
    const room = State.G;
    const close = room.actClose[room.act];
    const elHidden = $('close-el');
    const tone = elHidden ? elHidden.value : draft.closeTone;
    await liveBeginClose(State.onlineRoomCode, +$('close-arch').value, +$('close-starter').value,
      close.elements[tone], $('close-opening').value, close.title, close.prompt);
  } catch(err){ fail(err); }
}

/* ---------------- scene: pick ---------------- */
function renderOnlineScenePick(){
  const room = State.G;
  const primerHTML = !hasSeenIntro() ? `
    <div class="panel spotlight">
      <h3 style="color:var(--gold)">Before your first scene</h3>
      ${sceneAnatomyDiagramHTML()}
      <div class="btnrow"><button class="primary" onclick="onlineDismissScenePrimer()">Got it — begin</button></div>
    </div>` : '';
  $('scr-scene').innerHTML = `
    ${primerHTML}
    <h2 class="center">You begin a scene</h2>
    <div class="ornament">❦</div>
    <h3 style="color:var(--gold)">Choose a scene card from your hand</h3>
    <div class="cardgrid">${myPrivate.hand.map((sc,i)=>sceneCardHTML(sc,'onlinePickSceneCard',i)).join('')}</div>
    <h3 style="color:var(--gold)">Choose the lead archetype</h3>
    <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-top:8px">
      ${room.archetypes.map((a,i)=>archCard(a,'onlinePickArch',i)).join('')}
    </div>
    <div class="panel">
      <label class="fld">What the camera sees as the scene opens</label>
      <textarea id="scene-opening" placeholder="The camera drifts through…"></textarea>
      <div class="btnrow">${bleakifyButton('scene-opening','scene')}</div>
      <div class="btnrow">
        <button class="primary" id="btn-begin" disabled onclick="onlineBeginScene()">Begin the Scene</button>
        <button class="ghost" onclick="routeAndRenderCurrent()">Back to the Table</button>
      </div>
    </div>`;
}
export function onlineDismissScenePrimer(){ markIntroSeen(); renderOnlineScenePick(); }
export function onlinePickSceneCard(i){
  draft.cardIdx = i;
  document.querySelectorAll('[id^="scene-pick-"]').forEach(el=>{ el.classList.remove('selected'); el.setAttribute('aria-pressed','false'); });
  $('scene-pick-'+i).classList.add('selected');
  $('scene-pick-'+i).setAttribute('aria-pressed','true');
  onlineCheckBegin();
}
export function onlinePickArch(i){
  draft.archIdxs=draft.archIdxs||[];
  const at=draft.archIdxs.indexOf(i);
  if(at>=0) draft.archIdxs.splice(at,1); else if(draft.archIdxs.length<2) draft.archIdxs.push(i);
  draft.archIdx=draft.archIdxs[0] ?? null;
  document.querySelectorAll('[id^="arch-pick-"]').forEach(el=>{ el.classList.remove('selected'); el.setAttribute('aria-pressed','false'); });
  draft.archIdxs.forEach(n=>{ $('arch-pick-'+n).classList.add('selected'); $('arch-pick-'+n).setAttribute('aria-pressed','true'); });
  onlineCheckBegin();
}
function onlineCheckBegin(){
  $('btn-begin').disabled = !(draft.cardIdx!=null && (draft.archIdxs||[]).length>0);
}
export async function onlineBeginScene(){
  try{ await liveBeginScene(State.onlineRoomCode, draft.cardIdx, draft.archIdxs||[draft.archIdx], $('scene-opening').value); }
  catch(err){ fail(err); }
}
export function routeAndRenderCurrent(){
  // "Back to the Table" before a scene is actually begun — nothing was
  // committed, so just re-render off the last known room state.
  if(State.G) { resetDraft(); const remaining = State.G.players.reduce((s,p)=>s+p.scenesLeft,0);
    if(remaining<=0 && !State.G.closeDone && !State.G.current){ renderOnlineCloseIntro(State.G); show('scr-close'); }
    else { renderOnlineHub(State.G); show('scr-hub'); } }
}

/* ---------------- scene: play ---------------- */
function renderOnlineScene(room,animateSlot=null){
  const c = room.current, p = room.players[c.starter];
  const mySeat = mySeatIndex(room);
  const iAmStarter = mySeat===c.starter;
  const myContributionCount = c.contributions.filter(x=>x.pi===mySeat).length;

  let addingHTML = '';
  if(!iAmStarter && myContributionCount<2 && c.contributions.length < maxContrib()){
    if(!draft.adding){
      addingHTML = `<div class="btnrow"><button class="ghost" onclick="onlineStartContrib()">Play a card into this scene</button></div>`;
    } else if(!draft.adding.pick){
      addingHTML = `
        <p class="small" style="color:var(--gold)">Choose a scene card from your hand, or an omen from the row:</p>
        ${myPrivate.hand.length?`<div class="cardgrid">${myPrivate.hand.map((sc,i)=>sceneCardHTML(sc,'onlinePickContribScene',i)).join('')}</div>`:''}
        ${room.omenRow.length?`<div class="cardgrid compact">${room.omenRow.map((o,i)=>omenCard(o,'onlinePickContribOmen',i)).join('')}</div>`:''}
        <button class="ghost" onclick="onlineCancelContrib()">Never mind</button>`;
    } else {
      const pk = draft.adding.pick;
      const card = pk.kind==='scene' ? myPrivate.hand[pk.idx] : room.omenRow[pk.idx];
      addingHTML = `
        <div style="max-width:280px">${pk.kind==='scene'?sceneCardHTML(card):omenCard(card)}</div>
        <label class="fld">How does it manifest in the scene?</label>
        <textarea id="contrib-how" oninput="onlineSetContribHow(this.value)">${esc(draft.adding.how||'')}</textarea>
        <div class="btnrow">${bleakifyButton('contrib-how','omen')}</div>
        <div class="btnrow">
          <button class="primary" onclick="onlineConfirmContrib()">Play It</button>
          <button class="ghost" onclick="onlineCancelContrib()">Never mind</button>
        </div>`;
    }
  }

  const endSceneHTML = iAmStarter ? (!draft.resolving ? `
    <div class="panel spotlight">
      <label class="fld">The record of what happens</label>
      <p class="small muted" style="margin-bottom:6px">Play the scene aloud. Note what the Chronicle should remember: who appeared, what was said, and what was discovered.</p>
        <textarea id="scene-happened" style="min-height:130px" oninput="onlineSetSceneHappened(this.value)" placeholder="What the Chronicle will remember of this scene…">${esc(draft.happened||'')}</textarea>
        <div class="btnrow">${bleakifyButton('scene-happened','record')}</div>
      <div class="btnrow"><button class="blood" onclick="onlineEndScene()">The scene ends</button></div>
    </div>` : renderOnlineResolveInline(room)) : '';

  $('scr-scene').innerHTML = `
    ${sceneTrackerHTML(room,{viewerSeat:mySeat,phase:draft.resolving?'resolve':'play',happened:draft.happened,animateSlot})}
    ${addingHTML?`<div class="panel scene-action-panel${draft.adding?' spotlight':''}">
      <div class="scene-action-head">
        <div><span class="sc">Add to the scene</span><p>You may buy in once; the scene holds three cards at most.</p></div>
        <span class="pill">${1+c.contributions.length} of 3 filled</span>
      </div>
      ${addingHTML}
    </div>`:''}
    ${endSceneHTML || (iAmStarter?'':'<p class="small muted center">Waiting for '+esc(p.name)+' to end the scene…</p>')}`;
}
function renderOnlineSceneRefresh(){ renderOnlineScene(State.G); }
export function onlineStartContrib(){ draft.adding = {pick:null, how:''}; renderOnlineSceneRefresh(); }
export function onlinePickContribScene(i){ draft.adding.pick={kind:'scene', idx:i}; renderOnlineSceneRefresh(); }
export function onlinePickContribOmen(i){ draft.adding.pick={kind:'omen', idx:i}; renderOnlineSceneRefresh(); }
export function onlineCancelContrib(){ draft.adding = null; renderOnlineSceneRefresh(); }
export function onlineSetContribHow(v){ if(draft.adding) draft.adding.how = v; }
export function onlineSetSceneHappened(v){ draft.happened = v; }
export function onlineSetSecretAnswer(v){ draft.secretAnswer = v; }
export async function onlineConfirmContrib(){
  try{
    const {kind, idx, how} = draft.adding.pick.kind==='scene'
      ? {kind:'scene', idx:draft.adding.pick.idx, how:draft.adding.how}
      : {kind:'omen', idx:draft.adding.pick.idx, how:draft.adding.how};
    await liveContribute(State.onlineRoomCode, kind, idx, how);
    draft.adding = null;
  } catch(err){ fail(err); }
}
export function onlineEndScene(){
  draft.resolving = true;
  renderOnlineSceneRefresh();
}
function renderOnlineResolveInline(room){
  const c = room.current;
  return `
    <div class="panel spotlight">
      <h3 style="color:var(--gold)">Consult each archetype’s face-up condition</h3>
      <p class="small muted">If it was met in this scene, check it to turn the card.</p>
      ${room.archetypes.map((a,i)=>{
        const s = faceUp(a);
        return `<div class="panel tight" style="display:flex;gap:12px;align-items:flex-start">
          <input type="checkbox" id="online-flip-${i}" style="width:auto;margin-top:6px;transform:scale(1.3)">
          <label for="online-flip-${i}" style="cursor:pointer">
            <span class="sc" style="color:#eddfba">${esc(a.name||a.role)}</span>
            ${i===c.archIdx?'<span class="pill" style="border-color:var(--blood-bright);color:#e8c9c9">led this scene</span>':''}
            <br><span class="small" style="color:#b3a687">${esc(s.cond)}</span> ${toneBadge(s.tone)}
          </label>
        </div>`;
      }).join('')}
      <div class="btnrow"><button class="primary" onclick="onlineApplyResolve()">Count the Tones</button></div>
    </div>`;
}
export async function onlineApplyResolve(){
  try{
    const room = State.G;
    const flips = [];
    room.archetypes.forEach((a,i)=>{ if($('online-flip-'+i).checked) flips.push(i); });
    await liveEndSceneAndResolve(State.onlineRoomCode, draft.happened, flips);
    draft.resolving = false; draft.happened = '';
  } catch(err){ fail(err); }
}

/* ---------------- secret reveal ---------------- */
function renderOnlineSecret(room){
  const u = room.pendingSecret;
  const p = room.players[u.pi]; // this screen only ever renders for its own owner (gated in routeAndRender)
  const secret = myPrivate.secrets[u.secretIndex];
  const sel = draft.secretSel || (draft.secretSel = []);
  $('scr-secret').innerHTML = `
    <div class="center" style="margin-top:20px">
      <h2 style="color:#c9b3de;margin-top:6px">A Hidden Sin Comes to Light</h2>
      <p class="muted">${esc(p.name)}’s secret is unlocked.</p>
    </div>
    <div class="ornament" style="color:#8a63a8">✧</div>
    <div style="max-width:720px;margin:0 auto">
      <div class="secretbox" style="padding:16px">
        <div>${secret.combo.map(toneBadge).join(' ')}</div>
        <p style="font-size:1.15rem;color:#e0d4ec;margin-top:8px">“${esc(secret.q)}”</p>
      </div>
      <h3 style="color:#c9b3de;margin-top:16px">Choose three omens <span class="small">(${sel.length} of ${Math.min(3,room.omenRow.length)})</span></h3>
      <div class="cardgrid compact">${room.omenRow.map((o,i)=>omenCard(o,'onlineToggleSecretOmen',i)).join('')}</div>
      <div class="panel spotlight">
        <label class="fld" style="color:#c9b3de">The vignette</label>
        <textarea id="secret-answer" style="min-height:120px" oninput="onlineSetSecretAnswer(this.value)">${esc(draft.secretAnswer||'')}</textarea>
        <div class="btnrow">${bleakifyButton('secret-answer','secret reveal')}</div>
        <div class="btnrow"><button class="primary" ${sel.length!==Math.min(3,room.omenRow.length)?'disabled':''} onclick="onlineConfirmSecret()">So It Is Revealed</button></div>
      </div>
    </div>`;
  document.querySelectorAll('[id^="omen-pick-"]').forEach((el,idx)=>el.classList.toggle('selected', sel.includes(idx)));
}
export function onlineToggleSecretOmen(i){
  const room = State.G, need = Math.min(3, room.omenRow.length);
  const sel = draft.secretSel || (draft.secretSel=[]);
  const at = sel.indexOf(i);
  if(at>=0) sel.splice(at,1); else if(sel.length<need) sel.push(i);
  renderOnlineSecret(room);
}
export async function onlineConfirmSecret(){
  try{ await liveConfirmSecret(State.onlineRoomCode, draft.secretSel||[], draft.secretAnswer||''); draft={}; }
  catch(err){ fail(err); }
}
