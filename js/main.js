/* Entry point. Wires the handful of functions referenced by inline
   onclick/oninput/onchange attributes in index.html onto window — ES
   modules are not global scope, so this is the one place that bridges
   the two. Everything else stays module-scoped. */
import { show } from './ui/screens.js';
import { renderHooks, chooseHook, renderPlayerInputs, confirmPlayers,
         beginArchSetup, saveArchSetup, finishVictim } from './ui/setup.js';
import { renderHub, tradeOmen, forfeitScene, beginClose } from './ui/hub.js';
import { startSceneFor, pickSceneCard, pickArch, beginScene, pickContrib,
         pickContribScene, pickContribOmen, confirmContrib, cancelContrib,
         setContribHow, setSceneHappened } from './ui/scene.js';
import { endScene, applyResolve, toggleSecretOmen, confirmSecret } from './ui/resolve.js';
import { viewChronicle, returnFromChronicle, toggleStrike, showRules,
         closeOverlay, initOverlayDismiss } from './ui/renderChronicle.js';
import { copyChronicle, downloadChronicle } from './chronicle/markdown.js';
import { ensureSignedIn } from './sync/auth.js';

Object.assign(window, {
  show, chooseHook, renderPlayerInputs, confirmPlayers, beginArchSetup, saveArchSetup, finishVictim,
  renderHub, tradeOmen, forfeitScene, beginClose,
  startSceneFor, pickSceneCard, pickArch, beginScene, pickContrib, pickContribScene, pickContribOmen,
  confirmContrib, cancelContrib, setContribHow, setSceneHappened,
  endScene, applyResolve, toggleSecretOmen, confirmSecret,
  viewChronicle, returnFromChronicle, toggleStrike, showRules, closeOverlay,
  copyChronicle, downloadChronicle
});

/* ---------------- init ---------------- */
renderHooks();
renderPlayerInputs();
initOverlayDismiss();
ensureSignedIn().catch(err => console.warn('[sync] anonymous sign-in failed', err));
