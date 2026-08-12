/* Entry point. Wires the handful of functions referenced by inline
   onclick/oninput/onchange attributes in index.html onto window — ES
   modules are not global scope, so this is the one place that bridges
   the two. Everything else stays module-scoped. */
import { show, closeOverlay, initHistoryNav, applyFirstrunVisibility, dismissFirstrunHint } from './ui/screens.js';
import { flipArchCard, openCardDetail } from './ui/cards.js';
import { gameArtImgError } from './ui/art.js';
import { showIdleClicker, idleClick } from './ui/idle.js';
import { showGallery, setGalleryStyle, setGalleryCat, openGalleryDetail,
         closeGalleryDetail, galleryImgError, flipGalleryCard, navigateGallery } from './ui/gallery.js';
import { renderHooks, chooseHook, renderPlayerInputs, confirmPlayers,
         beginArchSetup, saveArchSetup, finishVictim, swapArchSetup, chooseArchSwap } from './ui/setup.js';
import { renderHub, tradeOmen, forfeitScene, beginClose, openLocalHand, toggleReady } from './ui/hub.js';
import { startSceneFor, pickSceneCard, pickArch, beginScene, pickContrib,
         pickContribScene, pickContribOmen, confirmContrib, cancelContrib,
         setContribHow, setSceneHappened, dismissScenePrimer } from './ui/scene.js';
import { endScene, applyResolve, toggleSecretOmen, confirmSecret } from './ui/resolve.js';
import { viewChronicle, renderChronicle, bleakifyRecord, returnToGame, returnFromChronicle, toggleStrike, showRules,
         initOverlayDismiss } from './ui/renderChronicle.js';
import { copyChronicle, downloadChronicle } from './chronicle/markdown.js';
import { bleakifyField, setBleakifyKey } from './ui/bleakify.js';
import { exportGameState, importGameState, handleStateImport } from './ui/saveState.js';
import { ensureSignedIn } from './sync/auth.js';
import {
  showOnlineEntry, onlineCreateRoom, onlineJoinRoom, leaveOnlineRoom, tryAutoRejoin,
  onlineBeginTale, onlineSaveArchSetup, onlineFinishVictim,
  onlineStartScene, onlineTradeOmen, onlineForfeitScene, onlineBeginClose,
  onlinePickSceneCard, onlinePickArch, onlineBeginScene, routeAndRender, routeAndRenderCurrent,
  onlineStartContrib, onlinePickContribScene, onlinePickContribOmen, onlineCancelContrib,
  onlineSetContribHow, onlineSetSceneHappened, onlineSetSecretAnswer,
  onlineConfirmContrib, onlineEndScene, onlineApplyResolve,
  onlineToggleSecretOmen, onlineConfirmSecret,
  onlineAnswerForAbsent, onlineCopyRoomLink, onlineDismissScenePrimer,
  onlineRefreshArtPicker, openOnlineHand, onlineSetReady, onlineSwapArchSetup, onlineChooseArchSwap, onlineVoteOmen
} from './ui/online.js';

let lastAction = 'startup';

function actionNameFrom(target){
  const handler = target?.closest?.('[onclick]')?.getAttribute('onclick') || '';
  const match = handler.match(/^\s*([A-Za-z_$][\w$]*)/);
  return match ? match[1] : (target?.id || target?.tagName?.toLowerCase() || 'unknown');
}

function runtimeContext(){
  return {
    screen: document.querySelector('.screen.active')?.id || 'unknown',
    action: lastAction
  };
}

function showRuntimeFailure(kind){
  const context = runtimeContext();
  console.error(`[runtime] ${kind}`, context);

  try {
    let notice = document.getElementById('runtime-error');
    if(!notice){
      notice = document.createElement('div');
      notice.id = 'runtime-error';
      notice.setAttribute('role', 'alertdialog');
      notice.setAttribute('aria-live', 'assertive');
      notice.style.cssText = 'position:fixed;inset:20px;z-index:9999;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:14px;padding:28px;background:rgba(18,12,15,.97);border:1px solid #9b4b4b;color:#eadfc7;text-align:center;box-shadow:0 0 40px rgba(0,0,0,.8)';
      const heading = document.createElement('h2');
      heading.textContent = 'The Vale has fallen silent.';
      const message = document.createElement('p');
      message.textContent = 'Something in the machinery of the tale faltered. Your story is not lost; restore the page and take up the thread again.';
      const retry = document.createElement('button');
      retry.className = 'primary';
      retry.textContent = 'Restore the Tale';
      retry.addEventListener('click', () => window.location.reload());
      notice.append(heading, message, retry);
      document.body.appendChild(notice);
    }
  } catch(_) {
    // The console context above is the last-resort signal if the UI is broken too.
  }
}

document.addEventListener('click', event => { lastAction = actionNameFrom(event.target); }, true);
document.addEventListener('input', event => { lastAction = `input:${event.target?.id || 'unknown'}`; }, true);
document.addEventListener('change', event => { lastAction = `change:${event.target?.id || 'unknown'}`; }, true);
window.onerror = () => { showRuntimeFailure('uncaught error'); return true; };
window.addEventListener('unhandledrejection', event => { event.preventDefault(); showRuntimeFailure('unhandled rejection'); });

Object.assign(window, {
  show, flipArchCard, gameArtImgError, showIdleClicker, idleClick, dismissFirstrunHint,
  showGallery, setGalleryStyle, setGalleryCat, openGalleryDetail, closeGalleryDetail,
  galleryImgError, flipGalleryCard, navigateGallery,
  chooseHook, renderPlayerInputs, confirmPlayers, beginArchSetup, saveArchSetup, finishVictim, swapArchSetup, chooseArchSwap, openCardDetail,
  renderHub, tradeOmen, forfeitScene, beginClose, openLocalHand, toggleReady,
  startSceneFor, pickSceneCard, pickArch, beginScene, pickContrib, pickContribScene, pickContribOmen,
  confirmContrib, cancelContrib, setContribHow, setSceneHappened, dismissScenePrimer,
  endScene, applyResolve, toggleSecretOmen, confirmSecret,
  viewChronicle, renderChronicle, bleakifyRecord, returnToGame, returnFromChronicle, toggleStrike, showRules, closeOverlay,
  copyChronicle, downloadChronicle,
  bleakifyField, setBleakifyKey, exportGameState, importGameState,
  showOnlineEntry, onlineCreateRoom, onlineJoinRoom, leaveOnlineRoom,
  onlineBeginTale, onlineSaveArchSetup, onlineFinishVictim,
  onlineStartScene, onlineTradeOmen, onlineForfeitScene, onlineBeginClose,
  onlinePickSceneCard, onlinePickArch, onlineBeginScene, routeAndRender, routeAndRenderCurrent,
  onlineStartContrib, onlinePickContribScene, onlinePickContribOmen, onlineCancelContrib,
  onlineSetContribHow, onlineSetSceneHappened, onlineSetSecretAnswer,
  onlineConfirmContrib, onlineEndScene, onlineApplyResolve,
  onlineToggleSecretOmen, onlineConfirmSecret,
  onlineAnswerForAbsent, onlineCopyRoomLink, onlineDismissScenePrimer,
  onlineRefreshArtPicker, openOnlineHand, onlineSetReady, onlineSwapArchSetup, onlineChooseArchSwap, onlineVoteOmen
});
document.getElementById('save-import-input')?.addEventListener('change', handleStateImport);

/* ---------------- init ---------------- */
renderHooks();
renderPlayerInputs();
applyFirstrunVisibility();
initOverlayDismiss();
initHistoryNav();
ensureSignedIn()
  .then(() => tryAutoRejoin())
  .catch(err => console.warn('[sync] anonymous sign-in failed', err));
