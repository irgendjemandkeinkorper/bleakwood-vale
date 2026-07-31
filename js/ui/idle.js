import { $ } from '../engine/utils.js';
import { openOverlay } from './screens.js';

/* A pure distraction, deliberately disconnected from game state — no
   sync, no scoring that matters, nothing here should ever gate or
   affect play. Persisted per-device via localStorage purely so it
   feels like it's "yours" across sessions, not because it matters. */
const STORAGE_KEY = 'bv:idleClicks';

function getCount(){
  try { return Math.max(0, +(localStorage.getItem(STORAGE_KEY)) || 0); }
  catch(e){ return 0; }
}
function setCount(n){
  try { localStorage.setItem(STORAGE_KEY, String(n)); } catch(e){ /* private mode, etc — fine, just don't persist */ }
}

const MILESTONES = [
  [1, 'You count the first crow. It counts you back.'],
  [5, 'Five crows now. They have stopped pretending not to watch you.'],
  [13, 'Thirteen. Someone told you once that this number means something in the Vale. You did not listen.'],
  [25, 'A lantern gutters to life at the treeline. It was not there a moment ago.'],
  [50, 'Something with wings far larger than a crow’s passes overhead. You do not look up.'],
  [100, 'One hundred. The fog has learned your name.'],
  [200, 'Two hundred. You could almost swear the trees have moved closer.'],
  [500, 'Five hundred. Whatever you are counting, it stopped being crows a long time ago.']
];
const UNLOCKS = [
  {at:0,  id:'crow',    glyph:'⁘', label:'A crow, watching from a low branch.'},
  {at:10, id:'lantern', glyph:'◉', label:'A lantern gutters at the edge of the treeline.'},
  {at:25, id:'eyes',    glyph:'◐', label:'Something with eyes, further back, where the dark is thickest.'}
];

function currentMilestoneText(count){
  let text = '';
  for(const [n, msg] of MILESTONES){ if(count>=n) text = msg; }
  return text;
}

export function showIdleClicker(){
  renderIdlePanel();
  openOverlay();
  const firstBtn = document.querySelector('#overlay-content .idle-obj') || document.querySelector('#overlay-content .primary');
  if(firstBtn) firstBtn.focus();
}

function renderIdlePanel(){
  const count = getCount();
  const unlocked = UNLOCKS.filter(u=>count>=u.at);

  const activeEl = document.activeElement;
  let activeId = null;
  let activeIsReturn = false;
  if (activeEl) {
    if (activeEl.classList.contains('primary') && activeEl.closest('#overlay-content')) {
      activeIsReturn = true;
    } else {
      for (const u of UNLOCKS) {
        if (activeEl.classList.contains(`idle-${u.id}`)) {
          activeId = u.id;
          break;
        }
      }
    }
  }

  $('overlay-content').innerHTML = `
    <h2 style="color:var(--gold)">Keep Watch</h2>
    <p class="small muted">Something to do with your hands while the others work up a plotline.</p>
    <div class="idle-scene" id="idle-scene">
      ${unlocked.map(u=>`<button class="idle-obj idle-${u.id}" onclick="idleClick('${u.id}')" aria-label="${u.label}" title="${u.label}">${u.glyph}</button>`).join('')}
    </div>
    <p class="center" style="margin-top:10px" role="status" aria-live="polite" aria-atomic="true"><span class="idle-count" id="idle-count">${count}</span> <span class="small muted">counted</span></p>
    <p class="small" id="idle-milestone" role="status" aria-live="polite" aria-atomic="true" style="min-height:1.4em;color:#cfc2a2;text-align:center">${currentMilestoneText(count)}</p>
    <div class="btnrow" style="justify-content:center"><button class="primary" onclick="closeOverlay()">Back to the Vale</button></div>`;

  if (activeIsReturn) {
    const returnBtn = document.querySelector('#overlay-content .primary');
    if (returnBtn) returnBtn.focus();
  } else if (activeId) {
    const btn = document.querySelector(`#overlay-content .idle-${activeId}`);
    if (btn) btn.focus();
  }
}

export function idleClick(id){
  const before = getCount();
  const after = before+1;
  setCount(after);

  const btn = document.querySelector(`.idle-${id}`);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const justUnlocked = UNLOCKS.some(u=>u.at===after);

  if (justUnlocked) {
    if (prefersReduced) {
      renderIdlePanel();
    } else {
      if (btn && btn.animate) {
        btn.animate([
          {transform:'scale(1) rotate(0deg)'},
          {transform:'scale(1.18) rotate(-5deg)'},
          {transform:'scale(.96) rotate(3deg)'},
          {transform:'scale(1) rotate(0deg)'}
        ], {duration:380, easing:'ease-out'});
      }
      setTimeout(renderIdlePanel, 380);
    }
  } else {
    if (!prefersReduced && btn && btn.animate) {
      btn.animate([
        {transform:'scale(1) rotate(0deg)'},
        {transform:'scale(1.18) rotate(-5deg)'},
        {transform:'scale(.96) rotate(3deg)'},
        {transform:'scale(1) rotate(0deg)'}
      ], {duration:380, easing:'ease-out'});
    }
    const countEl = $('idle-count'); if(countEl) countEl.textContent = after;
    const msgEl = $('idle-milestone'); if(msgEl) msgEl.textContent = currentMilestoneText(after);
  }
}
