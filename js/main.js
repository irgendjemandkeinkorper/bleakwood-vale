/* Entry point. Wires the handful of functions referenced by inline
   onclick/oninput/onchange attributes in index.html onto window — ES
   modules are not global scope, so this is the one place that bridges
   the two. Everything else stays module-scoped. */
import { show, closeOverlay, initHistoryNav, applyFirstrunVisibility, dismissFirstrunHint } from './ui/screens.js';
import { flipArchCard, openCardDetail } from './ui/cards.js';
import { gameArtImgError } from './ui/art.js';
import { showIdleClicker, idleClick } from './ui/idle.js';
import { showGallery, setGalleryStyle, setGalleryCat, openGalleryDetail,
         closeGalleryDetail, galleryImgError, flipGalleryCard } from './ui/gallery.js';
import { renderHooks, chooseHook, renderPlayerInputs, confirmPlayers,
         beginArchSetup, saveArchSetup, finishVictim, swapArchSetup } from './ui/setup.js';
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
  onlineRefreshArtPicker, openOnlineHand
} from './ui/online.js';

Object.assign(window, {
  show, flipArchCard, gameArtImgError, showIdleClicker, idleClick, dismissFirstrunHint,
  showGallery, setGalleryStyle, setGalleryCat, openGalleryDetail, closeGalleryDetail,
  galleryImgError, flipGalleryCard,
  chooseHook, renderPlayerInputs, confirmPlayers, beginArchSetup, saveArchSetup, finishVictim, swapArchSetup, openCardDetail,
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
  onlineRefreshArtPicker, openOnlineHand, onlineSetReady, onlineSwapArchSetup, onlineVoteOmen
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
