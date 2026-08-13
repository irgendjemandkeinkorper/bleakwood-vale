import { State } from '../../engine/state.js';
import { renderChronicle } from '../renderChronicle.js';
import { renderOnlineLobby } from './lobby.js';
import { renderOnlineArchSetup } from './setup.js';
import { renderOnlineVictim } from './victim.js';
import { renderOnlineHub } from './hub.js';
import { renderOnlineCloseIntro } from './close.js';
import { renderOnlineScene } from './scene.js';
import { renderOnlineSecret } from './secret.js';
import { renderOnlineScreen, sceneAnimationSlot, preserveDraftFor, reactToRoom, mySeatIndex, resetDraft } from './shared.js';
import { show } from '../screens.js';
export function routeAndRender(room){
  const animateSlot = sceneAnimationSlot(room);
  State.G = room;
  preserveDraftFor(room);
  reactToRoom(room);
  if(room.phase==='lobby'){ renderOnlineScreen('scr-online-lobby',()=>renderOnlineLobby(room)); return; }
  if(room.phase==='finished' || room.act>3){ renderOnlineScreen('scr-chronicle',()=>renderChronicle(false)); return; }
  if(room.phase==='archsetup'){ renderOnlineScreen('scr-archsetup',()=>renderOnlineArchSetup(room)); return; }
  if(room.phase==='victim'){ renderOnlineScreen('scr-victim',()=>renderOnlineVictim(room)); return; }
  if(room.pendingSecret){
    if(mySeatIndex(room)===room.pendingSecret.pi){ renderOnlineScreen('scr-secret',()=>renderOnlineSecret(room)); return; }
    renderOnlineScreen('scr-hub',()=>renderOnlineHub(room)); return;
  }
  if(room.current){ renderOnlineScreen('scr-scene',()=>renderOnlineScene(room,animateSlot)); return; }
  const remaining = room.players.reduce((s,p)=>s+p.scenesLeft,0);
  if(remaining<=0 && !room.closeDone){ renderOnlineScreen('scr-close',()=>renderOnlineCloseIntro(room)); return; }
  renderOnlineScreen('scr-hub',()=>renderOnlineHub(room));
}
export function routeAndRenderCurrent(){
  if(State.G) { resetDraft(); const remaining = State.G.players.reduce((s,p)=>s+p.scenesLeft,0);
    if(remaining<=0 && !State.G.closeDone && !State.G.current){ renderOnlineCloseIntro(State.G); show('scr-close'); }
    else { renderOnlineHub(State.G); show('scr-hub'); } }
}
