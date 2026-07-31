export const $ = id => document.getElementById(id);
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const nl2br = s => esc(s).replace(/\n/g,'<br>');
export function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
export const toneBadge = t => `<span class="tone ${t}">${t}</span>`;
export const ACT_NAMES = ['','Act the First','Act the Second','Act the Third'];
export const ROMAN = ['','I','II','III','IV','V','VI'];

/* A row of dots marking progress through a fixed sequence (e.g. the six
   archetype setup questions) — done/current/upcoming, plus a text label
   for the current step. */
export function progressDotsHTML(current, total, label){
  const dots = Array.from({length: total}, (_, i) => {
    const cls = i < current ? 'done' : i === current ? 'current' : '';
    return `<span class="pd-dot ${cls}"></span>`;
  }).join('');
  return `<div class="progress-dots">${dots}<span class="pd-label">${esc(label)}</span></div>`;
}

/* Shared onboarding rail for local and online setup. The five broad steps
   keep the next responsibility visible without replacing the more granular
   six-question archetype progress shown during character establishment. */
export function setupProgressHTML(step, label, detail){
  const total = 5;
  const dots = Array.from({length:total}, (_,i)=>{
    const cls = i < step ? 'done' : i === step ? 'current' : '';
    return `<span class="pd-dot ${cls}" aria-hidden="true"></span>`;
  }).join('');
  return `<div class="setup-progress" role="progressbar" aria-label="Table setup progress" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${step+1}">
    <div class="setup-progress-head"><span class="sc">TABLE SETUP</span><span class="setup-progress-count">Step ${step+1} of ${total}</span></div>
    <div class="progress-dots" aria-hidden="true">${dots}</div>
    <div class="setup-progress-copy"><strong>${esc(label)}</strong>${detail?`<span>${esc(detail)}</span>`:''}</div>
  </div>`;
}

/* A three-node track marking which act is done/current/upcoming. */
export function actTrackHTML(act){
  return `<div class="act-track">${[1,2,3].map((n,i)=>
    `${i>0?'<span class="at-line"></span>':''}<span class="at-node ${act>n?'done':act===n?'current':''}">${ROMAN[n]}</span>`
  ).join('')}</div>`;
}
/* Matches the slug algorithm documented in art/IMAGE_PROMPTS.md — keep
   the two in sync if either changes, since that doc is the human-facing
   spec for where generated art files belong on disk. */
export const slugify = s => String(s).toLowerCase()
  .replace(/[’'′`]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
