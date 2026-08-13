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
/* ---------------- scene: pick ---------------- */
export function renderOnlineScenePick(){
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
export function renderOnlineScene(room,animateSlot=null){
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

