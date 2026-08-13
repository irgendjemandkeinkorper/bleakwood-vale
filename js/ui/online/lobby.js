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
  setMyPrivate({hand:[], secrets:[]});
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
export function renderOnlineLobby(room){
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

import { routeAndRender } from './router.js';
