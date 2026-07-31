import { $, esc, ACT_NAMES } from '../engine/utils.js';
import { EPILOGUE_QUESTIONS } from '../data/index.js';
import { State } from '../engine/state.js';
import { faceUp } from '../engine/rules.js';
import { openOverlay } from '../ui/screens.js';

export function buildMarkdown(){
  const G = State.G;
  const L = [];
  L.push('# THE BLEAKWOOD VALE CHRONICLE');

  const hookTitle = (G && G.hook && G.hook.title) ? G.hook.title : 'An Untold Tale';
  L.push(`## ${hookTitle}`);

  const victimName = (G && G.victim && G.victim.name) ? G.victim.name : 'the Deceased';
  L.push(`*Being a true & faithful account of the death of **${victimName}**.*`, '');

  L.push('### Concerning the Victim');
  const facts = (G && G.victim && Array.isArray(G.victim.facts)) ? G.victim.facts : [];
  facts.forEach(f => {
    if (!f) return;
    const who = f.who || 'Unnamed';
    const role = f.role || 'No Role';
    const q = f.q || '';
    const a = f.a || '';
    L.push(`- **${who}** (${role}) — *“${q}”* — ${a}`);
  });

  L.push('', '### Dramatis Personae');
  const archetypes = (G && Array.isArray(G.archetypes)) ? G.archetypes : [];
  archetypes.forEach(a => {
    if (!a) return;
    const name = a.name || a.role || 'Unnamed Archetype';
    const role = a.role || 'No Role';
    const flippedText = a.flipped ? ' *(turned)*' : '';
    let tone = 'Unknown';
    if (a.sides && Array.isArray(a.sides)) {
      const side = a.sides[a.flipped ? 1 : 0] || a.sides[0];
      if (side && side.tone) {
        tone = side.tone;
      }
    }
    L.push(`- **${name}** — ${role}${flippedText} — Tone: ${tone}`);
  });

  [1,2,3].forEach(act=>{
    const journal = (G && Array.isArray(G.journal)) ? G.journal : [];
    const list = journal.filter(e => e && e.act === act && !e.struck);
    if(!list.length) return;

    const actName = ACT_NAMES[act] || `Act ${act}`;
    L.push('', `## ${actName}`);

    list.forEach(e=>{
      if (e.type === 'note') {
        if (e.text && String(e.text).trim()) {
          L.push('', `*${String(e.text).trim()}*`);
        }
        return;
      }
      if (e.type === 'secret') {
        const playerName = e.playerName || 'Anonymous';
        const question = e.question || 'A Secret';
        L.push('', `### ✧ A Hidden Sin Revealed — ${playerName}`);
        L.push(`> **“${question}”**`);
        const omens = Array.isArray(e.omens) ? e.omens : [];
        const omenTitles = omens.map(o => (o && o.title) || 'Unknown Omen').filter(Boolean);
        const omenText = omenTitles.length ? omenTitles.join(', ') : 'no omens';
        L.push(`*Answered through the omens: ${omenText}.*`);
        if (e.answer) L.push('', e.answer);
        return;
      }

      const isClose = e.type === 'close';
      const cardTitle = e.cardTitle || 'An Untitled Card';
      L.push('', `### ${isClose ? 'ACT CLOSE — ' : ''}${cardTitle}`);

      const playerName = e.playerName || 'Someone';
      const archName = e.archName || 'Unnamed';
      const archRole = e.archRole || 'No Role';
      const tonesList = Array.isArray(e.tones) ? e.tones.map(t => t || 'Unknown') : [];
      const tonesText = tonesList.length ? tonesList.join(', ') : 'None';
      L.push(`*Led by ${playerName} as ${archName} (${archRole}). Tones: ${tonesText}.*`);

      if (e.element && String(e.element).trim()) {
        L.push(`*Commanded to include: ${String(e.element).trim()}*`);
      }
      if (e.opening && typeof e.opening === 'string' && e.opening.trim()) {
        L.push('', `> ${e.opening.trim().replace(/\n/g,'\n> ')}`);
      }

      const contributions = Array.isArray(e.contributions) ? e.contributions : [];
      contributions.forEach(x => {
        if (!x) return;
        const cTitle = x.title || 'Untitled';
        const cPlayerName = x.playerName || 'Anonymous';
        const howText = (x.how && typeof x.how === 'string' && x.how.trim()) ? ` — ${x.how.trim()}` : '';
        L.push(`- **${cTitle}** (${cPlayerName})${howText}`);
      });

      if (e.happened && String(e.happened).trim()) {
        L.push('', String(e.happened).trim());
      }

      const flips = Array.isArray(e.flips) ? e.flips.filter(Boolean) : [];
      if (flips.length) {
        L.push('', `*${flips.join('; ')}.*`);
      }
    });
  });

  const actNum = (G && typeof G.act === 'number') ? G.act : 0;
  if (actNum > 3) {
    L.push('', '## Questions for the Survivors');
    const questions = Array.isArray(EPILOGUE_QUESTIONS) ? EPILOGUE_QUESTIONS : [];
    questions.forEach(q => L.push(`- ${q}`));
  }

  L.push('', '---', '*Played in Bleakwood Vale — a gothic re-imagining after the design of Tall Pines by Miles Gaborit.*');
  return L.join('\n');
}

export function copyChronicle(){
  const md = buildMarkdown();
  const done = ()=>{ const b=$('btn-copy'); if(b){ b.textContent='Copied to the Clipboard'; setTimeout(()=>b.textContent='Copy as Markdown',2200); } };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(md).then(done).catch(()=>fallbackCopy(md));
  } else fallbackCopy(md);
}

export function fallbackCopy(md){
  $('overlay-content').innerHTML = `
    <h2 style="color:var(--gold)">Copy the Chronicle</h2>
    <p class="small muted">Select all and copy:</p>
    <textarea style="min-height:340px" id="fallback-md">${esc(md)}</textarea>
    <div class="btnrow"><button onclick="closeOverlay()">Close</button></div>`;
  openOverlay();
  const t=$('fallback-md'); t.focus(); t.select();
}

export function downloadChronicle(){
  const blob = new Blob([buildMarkdown()], {type:'text/markdown'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'bleakwood-vale-chronicle.md';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}
