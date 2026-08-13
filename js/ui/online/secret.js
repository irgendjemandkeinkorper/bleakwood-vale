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
/* ---------------- secret reveal ---------------- */
export function renderOnlineSecret(room){
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
  try{ await liveConfirmSecret(State.onlineRoomCode, draft.secretSel||[], draft.secretAnswer||''); setDraft({}); }
  catch(err){ fail(err); }
}
