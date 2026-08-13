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
/* ---------------- victim ---------------- */
export function renderOnlineVictim(room){
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

