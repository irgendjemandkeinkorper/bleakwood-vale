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
/* ---------------- archetype setup ---------------- */
export function renderOnlineArchSetup(room){
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

