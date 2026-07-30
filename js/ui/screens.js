import { $, ACT_NAMES } from '../engine/utils.js';
import { TONES } from '../data/index.js';
import { actToneCounts } from '../engine/rules.js';
import { State } from '../engine/state.js';
import { mirrorState } from '../sync/rooms.js';

export function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo({top:0,behavior:'auto'});
  renderTopbar();
}

export function renderTopbar(){
  const G = State.G;
  const tb = $('topbar');
  if(!G){ tb.style.display='none'; return; }
  tb.style.display='flex';
  $('tb-act').textContent = G.act<=3 ? `${ACT_NAMES[G.act]} — ${G.hook.title}` : 'The Chronicle';
  const counts = actToneCounts();
  $('tb-tones').innerHTML = TONES.map(t=>`<span class="tone count ${t}" title="${t} this act">${counts[t]}</span>`).join('');
  if(!State.onlineRoomCode) mirrorState(); // Stage 2 shadow write, hotseat mode only — real sync (js/sync/liveActions.js) handles online rooms
}
