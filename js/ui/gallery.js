import { $, esc, slugify } from '../engine/utils.js';
import { ARCHETYPES, HOOKS, OMENS } from '../data/index.js';
import { openOverlay } from './screens.js';

/* The card-art Gallery — a pure browsing surface, deliberately independent
   of any game in progress (uses the static data tables, not State.G), so
   it's available from the title screen as well as mid-game. Image files
   are entirely optional: see art/IMAGE_PROMPTS.md for the exact path each
   tile below expects. Until a file exists at that path, the tile shows a
   plain text fallback card instead of a broken image — the Gallery (and
   the game) never depends on art actually existing. */
let gState = { style:'painterly', cat:'archetypes', detail:null };

function archetypeTiles(style){
  return ARCHETYPES.flatMap(a=>{
    const slug = slugify(a.role);
    return [
      {cat:'archetypes', key:slug+'--front', title:a.role, sub:'Side I', flavor:a.flavor, path:`art/images/${style}/archetypes/${slug}--front`},
      {cat:'archetypes', key:slug+'--turned', title:a.role, sub:'Side II — turned', flavor:a.flavor, path:`art/images/${style}/archetypes/${slug}--turned`}
    ];
  });
}
function hookTiles(style){
  return HOOKS.map(h=>({cat:'hooks', key:h.id, title:h.title, sub:'The Incident', flavor:h.epigraph, path:`art/images/${style}/hooks/${h.id}`}));
}
function omenTiles(style){
  return OMENS.map(o=>({cat:'omens', key:slugify(o.title), title:o.title, sub:o.glyph, flavor:o.line, path:`art/images/${style}/omens/${slugify(o.title)}`}));
}
function victimTiles(style){
  return HOOKS.map(h=>({cat:'victims', key:h.id, title:h.title, sub:'The Victim', flavor:h.victimLine, path:`art/images/${style}/victims/${h.id}`}));
}
const CATS = [
  {id:'archetypes', label:'Archetypes', build:archetypeTiles},
  {id:'hooks', label:'Hooks', build:hookTiles},
  {id:'omens', label:'Omens', build:omenTiles},
  {id:'victims', label:'Victims', build:victimTiles}
];

/* Try a handful of extensions in turn before giving up and revealing the
   text fallback underneath — the naming doc promises .jpg, but nothing
   stops someone from exporting .png/.webp instead. */
const EXTS = ['jpg','jpeg','png','webp'];
function imgWithFallback(path, alt){
  const rest = EXTS.slice(1).join(',');
  return `<img loading="lazy" src="${path}.${EXTS[0]}" data-base="${path}" data-exts="${rest}" onerror="galleryImgError(this)" alt="${esc(alt)}">`;
}
export function galleryImgError(img){
  const exts = (img.dataset.exts||'').split(',').filter(Boolean);
  if(exts.length){
    const next = exts.shift();
    img.dataset.exts = exts.join(',');
    img.src = img.dataset.base + '.' + next;
  } else {
    img.closest('.gtile-media, .gdetail-media')?.classList.add('g-missing');
    img.remove();
  }
}

function fallbackHTML(t){
  return `<div class="gtile-fallback"><span class="gf-title">${esc(t.title)}</span>${t.sub?`<span class="gf-sub">${esc(t.sub)}</span>`:''}</div>`;
}
function tileHTML(t){
  return `<div class="gtile" onclick="openGalleryDetail('${t.cat}','${t.key}')">
    <div class="gtile-media">${imgWithFallback(t.path, t.title)}${fallbackHTML(t)}</div>
    <div class="gtile-cap">${esc(t.title)}${t.sub?` <span class="muted small">— ${esc(t.sub)}</span>`:''}</div>
  </div>`;
}

export function showGallery(){
  gState.detail = null;
  renderGallery();
  openOverlay();
}
function renderGallery(){
  if(gState.detail){ $('overlay-content').innerHTML = detailHTML(); return; }
  const active = CATS.find(c=>c.id===gState.cat);
  const tiles = active.build(gState.style);
  $('overlay-content').innerHTML = `
    <h2 style="color:var(--gold)">The Gallery</h2>
    <p class="small muted">Card art for Bleakwood Vale — something to look through while the others plot. Anything missing just shows a plain card; drop generated images into <code>art/images/</code> (see <code>art/IMAGE_PROMPTS.md</code> for the exact paths) and they'll appear here automatically.</p>
    <div class="btnrow" style="margin-top:12px">
      <button class="${gState.style==='painterly'?'primary':'ghost'}" onclick="setGalleryStyle('painterly')">Painterly Gothic</button>
      <button class="${gState.style==='tarot'?'primary':'ghost'}" onclick="setGalleryStyle('tarot')">Tarot Gothic</button>
    </div>
    <div class="btnrow" style="margin-top:6px">
      ${CATS.map(c=>`<button class="${c.id===gState.cat?'primary':'ghost'}" onclick="setGalleryCat('${c.id}')">${c.label}</button>`).join('')}
    </div>
    <div class="ggrid gcat-${gState.cat}" style="margin-top:16px">${tiles.map(tileHTML).join('')}</div>
    <div class="btnrow" style="justify-content:center;margin-top:20px"><button class="primary" onclick="closeOverlay()">Back to the Vale</button></div>`;
}
export function setGalleryStyle(style){ gState.style = style; renderGallery(); }
export function setGalleryCat(cat){ gState.cat = cat; renderGallery(); }
export function openGalleryDetail(cat, key){
  const c = CATS.find(x=>x.id===cat);
  const t = c && c.build(gState.style).find(x=>x.key===key);
  if(!t) return;
  gState.detail = t;
  renderGallery();
}
export function closeGalleryDetail(){ gState.detail = null; renderGallery(); }
function detailHTML(){
  const t = gState.detail;
  return `
    <button class="ghost" onclick="closeGalleryDetail()">← Back to the Gallery</button>
    <div class="gdetail">
      <div class="gdetail-media">${imgWithFallback(t.path, t.title)}${fallbackHTML(t)}</div>
      <h3 style="color:var(--gold);margin-top:12px">${esc(t.title)}</h3>
      ${t.sub?`<p class="small muted">${esc(t.sub)}</p>`:''}
      ${t.flavor?`<p style="color:#e3d7b8;font-style:italic;margin-top:8px">${esc(t.flavor)}</p>`:''}
    </div>
    <div class="btnrow" style="justify-content:center;margin-top:16px"><button class="primary" onclick="closeGalleryDetail()">← Back to the Gallery</button></div>`;
}
