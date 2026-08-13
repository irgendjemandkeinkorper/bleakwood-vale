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
/* ---------------- act close intro ---------------- */
export function renderOnlineCloseIntro(room){
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
        <p class="small muted">Tones this act: ${TONES.map(t=>toneCountBadge(t, counts[t])).join(' ')}</p>
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

