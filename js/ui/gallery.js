import { $, esc, slugify } from '../engine/utils.js';
import { ARCHETYPES, HOOKS, OMENS } from '../data/index.js';
import { openOverlay } from './screens.js';
import { State } from '../engine/state.js';
import { ART_STYLES, currentArtStyle } from './art.js';

/* The card-art Gallery is available from the title screen and mid-game.
   Its cards come from the static data tables; State.G is consulted only
   to keep an active tale on the art style chosen when it was created.
   Image files remain optional: see art/IMAGE_PROMPTS.md for the exact path
   each tile expects. Missing files reveal a plain text fallback rather
   than a broken image, so neither the Gallery nor play depends on art. */
let gState = { style:'painterly', cat:'archetypes', detail:null };

function archetypeTiles(style){
  return ARCHETYPES.map(a=>{
    const slug = slugify(a.role);
    return {cat:'archetypes', key:slug, title:a.role, sub:'Side I', backSub:'Side II — turned',
      flavor:a.flavor, quote:a.sides[0].cond, backQuote:a.sides[1].cond,
      path:`art/images/${style}/archetypes/${slug}--front`, backPath:`art/images/${style}/archetypes/${slug}--turned`, flippable:true};
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
    (img.closest('.gallery-face') || img.closest('.gtile-media, .gdetail-media'))?.classList.add('g-missing');
    img.remove();
  }
}

function fallbackHTML(t, sub=t.sub){
  return `<div class="gtile-fallback"><span class="gf-title">${esc(t.title)}</span>${sub?`<span class="gf-sub">${esc(sub)}</span>`:''}</div>`;
}
function galleryMediaHTML(t, detail=false){
  const cls = detail ? 'gdetail-media' : 'gtile-media';
  if(!t.flippable) return `<div class="${cls}">${imgWithFallback(t.path,t.title)}${fallbackHTML(t)}</div>`;
  return `<div class="${cls} gallery-flip">
    <div class="gallery-flip-inner">
      <div class="gallery-face gallery-front">${imgWithFallback(t.path,`${t.title}, ${t.sub}`)}${fallbackHTML(t,t.sub)}<span class="gallery-face-label">${esc(t.sub)}</span></div>
      <div class="gallery-face gallery-back">${imgWithFallback(t.backPath,`${t.title}, ${t.backSub}`)}${fallbackHTML(t,t.backSub)}<span class="gallery-face-label">${esc(t.backSub)}</span></div>
    </div>
    <button class="gallery-flip-control" type="button" onclick="event.stopPropagation();flipGalleryCard(this)" onkeydown="event.stopPropagation()" aria-label="View Side II" aria-pressed="false">⟳ <span>Side II</span></button>
  </div>`;
}
function tileHTML(t){
  return `<div class="gtile" role="button" tabindex="0" aria-label="Open ${esc(t.title)} details" onclick="openGalleryDetail('${t.cat}','${t.key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openGalleryDetail('${t.cat}','${t.key}')}">
    ${galleryMediaHTML(t)}
    <div class="gtile-cap">${esc(t.title)}${t.sub?` <span class="muted small">— <span data-gallery-side-label>${esc(t.sub)}</span></span>`:''}</div>
    ${t.flippable?gallerySideQuoteHTML(t):''}
  </div>`;
}

function gallerySideQuoteHTML(t){
  return `<q class="gallery-side-quote" data-gallery-side-quote data-front-quote="${esc(t.quote)}" data-back-quote="${esc(t.backQuote)}">${esc(t.quote)}</q>`;
}

export function flipGalleryCard(btn){
  const card = btn.closest('.gallery-flip');
  if(!card) return;
  const flipped = card.classList.toggle('is-flipped');
  btn.setAttribute('aria-label',flipped?'View Side I':'View Side II');
  btn.setAttribute('aria-pressed',String(flipped));
  btn.innerHTML = `${flipped?'↶':'⟳'} <span>${flipped?'Side I':'Side II'}</span>`;
  const container = card.closest('.gtile, .gdetail');
  const label = container?.querySelector('[data-gallery-side-label]');
  if(label) label.textContent = flipped ? 'Side II — turned' : 'Side I';
  const quote = container?.querySelector('[data-gallery-side-quote]');
  if(quote) quote.textContent = flipped ? quote.dataset.backQuote : quote.dataset.frontQuote;
}

export function showGallery(){
  gState.detail = null;
  if(State.G) gState.style = currentArtStyle(State.G);
  renderGallery();
  openOverlay();
}
function renderGallery(){
  if(gState.detail){ $('overlay-content').innerHTML = detailHTML(); return; }
  const active = CATS.find(c=>c.id===gState.cat);
  const tiles = active.build(gState.style);
  const lockedStyle = State.G ? ART_STYLES.find(s=>s.id===currentArtStyle(State.G)) : null;
  $('overlay-content').innerHTML = `
    <h2 style="color:var(--gold)">The Gallery</h2>
    <p class="small muted">Card art for Bleakwood Vale — something to look through while the others plot. Anything missing just shows a plain card; drop generated images into <code>art/images/</code> (see <code>art/IMAGE_PROMPTS.md</code> for the exact paths) and they'll appear here automatically.</p>
    ${lockedStyle
      ? `<div class="gallery-style-lock"><span class="sc">This tale’s style</span><strong>${esc(lockedStyle.label)}</strong><small>Locked when the table was opened.</small></div>`
      : `<div class="btnrow" style="margin-top:12px">${ART_STYLES.map(style=>`<button class="${gState.style===style.id?'primary':'ghost'}" onclick="setGalleryStyle('${style.id}')">${style.label}</button>`).join('')}</div>`}
    <div class="btnrow" style="margin-top:6px">
      ${CATS.map(c=>`<button class="${c.id===gState.cat?'primary':'ghost'}" onclick="setGalleryCat('${c.id}')">${c.label}</button>`).join('')}
    </div>
    <div class="ggrid gcat-${gState.cat}" style="margin-top:16px">${tiles.map(tileHTML).join('')}</div>
    <div class="btnrow" style="justify-content:center;margin-top:20px"><button class="primary" onclick="closeOverlay()">Back to the Vale</button></div>`;
}
export function setGalleryStyle(style){ if(State.G) return; gState.style = style; renderGallery(); }
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
      ${galleryMediaHTML(t,true)}
      <h3 style="color:var(--gold);margin-top:12px">${esc(t.title)}</h3>
      ${t.sub?`<p class="small muted"><span data-gallery-side-label>${esc(t.sub)}</span></p>`:''}
      ${t.flippable?gallerySideQuoteHTML(t):''}
      ${t.flavor?`<p class="gallery-flavor">${esc(t.flavor)}</p>`:''}
      ${t.flippable?'<p class="small muted" style="margin-top:8px">Use the turn button on the card to compare its two faces.</p>':''}
    </div>
    <div class="btnrow" style="justify-content:center;margin-top:16px"><button class="primary" onclick="closeGalleryDetail()">← Back to the Gallery</button></div>`;
}
