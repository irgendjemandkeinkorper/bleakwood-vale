export const $ = id => document.getElementById(id);
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const nl2br = s => esc(s).replace(/\n/g,'<br>');
export function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
export const toneBadge = t => `<span class="tone ${t}">${t}</span>`;
export const ACT_NAMES = ['','Act the First','Act the Second','Act the Third'];
export const ROMAN = ['','I','II','III','IV','V','VI'];
