/* Shared online state/helpers. Hotseat equivalents intentionally remain separate. */
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

/* Small per-device scratch state for in-progress, uncommitted composition
   (which card/archetype picked, contribution draft, flip checkboxes,
   secret-omen picks). None of this is synced — only the final submit
   actions above write to Firestore. Reset whenever the underlying
   room-driven phase changes shape from under it. */
export let draft = {};
let draftContext = null;
export function resetDraft(){ draft = {}; draftContext = null; }
export function setDraft(next){ draft = next; }

/* Room snapshots arrive for every other player's action too. Keep local
   composition state while the player is still working in the same logical
   action, and only clear it when the server moves the room to a new phase,
   scene, or secret. Contribution counts intentionally do not belong in this
   key: another player buying in should not erase a draft that is still valid. */
export function roomDraftContext(room){
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
export function preserveDraftFor(room){
  const nextContext = roomDraftContext(room);
  if(nextContext!==draftContext){ draft = {}; draftContext = nextContext; }
}

export function setMyPrivate(next){ myPrivate = next; }

/* My own hand + Hidden Sin(s) — kept live via a subscription to my own
   private doc, never read from the public room object (Stage 4). */
export let myPrivate = {hand:[], secrets:[]};

/* Guards against re-attempting a claim we already tried for the same
   journal entry (e.g. if it fails, don't retry-spam on every snapshot). */
let lastClaimAttempt = -1;
/* Timer for the delayed advance-after-close cascade; cleared whenever the
   underlying condition stops being true so it never fires stale. */
let advanceTimer = null;
let roomHeartbeat = null;
let renderedScene = {signature:null, contributions:0};

export function clearAdvanceTimer(){ if(advanceTimer){ clearTimeout(advanceTimer); advanceTimer = null; } }
export function clearRoomHeartbeat(){ if(roomHeartbeat){ clearInterval(roomHeartbeat); roomHeartbeat=null; } }

export function renderOnlineScreen(id, renderer){
  const active=document.querySelector('.screen.active');
  const staying=active?.id===id;
  const focused=document.activeElement;
  const focusId=focused?.id;
  const selectionStart=typeof focused?.selectionStart==='number' ? focused.selectionStart : null;
  const selectionEnd=typeof focused?.selectionEnd==='number' ? focused.selectionEnd : null;
  const scrollY=window.scrollY;
  renderer();
  if(!staying){ show(id); return; }
  const next=focusId ? $(focusId) : null;
  if(next){ next.focus(); if(selectionStart!==null) next.setSelectionRange(selectionStart,selectionEnd); }
  requestAnimationFrame(()=>window.scrollTo({top:scrollY,left:0,behavior:'auto'}));
}

export function sceneAnimationSlot(room){
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
export function reactToRoom(room){
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

export function mySeatIndex(room){
  const uid = getUid();
  if(!room || !room.seats) return -1;
  const idx = room.seats[uid];
  return idx===undefined ? -1 : idx;
}
export function fail(err){ alert(err && err.message ? err.message : String(err)); }

/* ---------------- entry: create or join ---------------- */
