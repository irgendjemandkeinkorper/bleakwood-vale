/* Entry point. Wires the handful of functions referenced by inline
   onclick/oninput/onchange attributes in index.html onto window — ES
   modules are not global scope, so this is the one place that bridges
   the two. Everything else stays module-scoped. */
import { show, closeOverlay, initHistoryNav, applyFirstrunVisibility, dismissFirstrunHint } from './ui/screens.js';
import { flipArchCard } from './ui/cards.js';
import { gameArtImgError } from './ui/art.js';
import { showIdleClicker, idleClick } from './ui/idle.js';
import { showGallery, setGalleryStyle, setGalleryCat, openGalleryDetail,
         closeGalleryDetail, galleryImgError, flipGalleryCard } from './ui/gallery.js';
import { renderHooks, chooseHook, renderPlayerInputs, confirmPlayers,
         beginArchSetup, saveArchSetup, finishVictim } from './ui/setup.js';
import { renderHub, tradeOmen, forfeitScene, beginClose, openLocalHand } from './ui/hub.js';
import { startSceneFor, pickSceneCard, pickArch, beginScene, pickContrib,
         pickContribScene, pickContribOmen, confirmContrib, cancelContrib,
         setContribHow, setSceneHappened, dismissScenePrimer } from './ui/scene.js';
import { endScene, applyResolve, toggleSecretOmen, confirmSecret } from './ui/resolve.js';
import { viewChronicle, returnFromChronicle, toggleStrike, showRules,
         initOverlayDismiss } from './ui/renderChronicle.js';
import { copyChronicle, downloadChronicle } from './chronicle/markdown.js';
import { ensureSignedIn } from './sync/auth.js';
import {
  showOnlineEntry, onlineCreateRoom, onlineJoinRoom, leaveOnlineRoom, tryAutoRejoin,
  onlineBeginTale, onlineSaveArchSetup, onlineFinishVictim,
  onlineStartScene, onlineTradeOmen, onlineForfeitScene, onlineBeginClose,
  onlinePickSceneCard, onlinePickArch, onlineBeginScene, routeAndRenderCurrent,
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
  chooseHook, renderPlayerInputs, confirmPlayers, beginArchSetup, saveArchSetup, finishVictim,
  renderHub, tradeOmen, forfeitScene, beginClose, openLocalHand,
  startSceneFor, pickSceneCard, pickArch, beginScene, pickContrib, pickContribScene, pickContribOmen,
  confirmContrib, cancelContrib, setContribHow, setSceneHappened, dismissScenePrimer,
  endScene, applyResolve, toggleSecretOmen, confirmSecret,
  viewChronicle, returnFromChronicle, toggleStrike, showRules, closeOverlay,
  copyChronicle, downloadChronicle,
  showOnlineEntry, onlineCreateRoom, onlineJoinRoom, leaveOnlineRoom,
  onlineBeginTale, onlineSaveArchSetup, onlineFinishVictim,
  onlineStartScene, onlineTradeOmen, onlineForfeitScene, onlineBeginClose,
  onlinePickSceneCard, onlinePickArch, onlineBeginScene, routeAndRenderCurrent,
  onlineStartContrib, onlinePickContribScene, onlinePickContribOmen, onlineCancelContrib,
  onlineSetContribHow, onlineSetSceneHappened, onlineSetSecretAnswer,
  onlineConfirmContrib, onlineEndScene, onlineApplyResolve,
  onlineToggleSecretOmen, onlineConfirmSecret,
  onlineAnswerForAbsent, onlineCopyRoomLink, onlineDismissScenePrimer,
  onlineRefreshArtPicker, openOnlineHand
});

/* ---------------- init ---------------- */
renderHooks();
renderPlayerInputs();
applyFirstrunVisibility();
initOverlayDismiss();
initHistoryNav();
ensureSignedIn()
  .then(() => tryAutoRejoin())
  .catch(err => console.warn('[sync] anonymous sign-in failed', err));
