import { esc, slugify } from '../engine/utils.js';
import { State } from '../engine/state.js';
import { archetypeCardForRole, pairedCardStem } from '../data/cardFaces.js';

export const ART_STYLES = [
  {id:'painterly', label:'Painterly Gothic', note:'Cinematic oils, fog, candlelight, and Victorian chiaroscuro.'},
  {id:'tarot', label:'Tarot Gothic', note:'Bold Arcana-like figures, jewel tones, and ceremonial linework.'}
];

const ART_EXTS = ['jpg','jpeg','png','webp'];

export function normalizeArtStyle(style){
  return ART_STYLES.some(s=>s.id===style) ? style : 'painterly';
}

export function currentArtStyle(G=State.G){
  return normalizeArtStyle(G?.artStyle);
}

export function artPath(style, category, key){
  return `art/images/${normalizeArtStyle(style)}/${category}/${key}`;
}

function artImageHTML(path, alt){
  if(/\.(?:jpe?g|png|webp)$/i.test(path)){
    return `<img loading="lazy" src="${path}" data-base="${path}" data-exts="" onerror="gameArtImgError(this)" alt="${esc(alt)}">`;
  }
  return `<img loading="lazy" src="${path}.${ART_EXTS[0]}" data-base="${path}" data-exts="${ART_EXTS.slice(1).join(',')}" onerror="gameArtImgError(this)" alt="${esc(alt)}">`;
}

export function gameArtImgError(img){
  const exts = (img.dataset.exts||'').split(',').filter(Boolean);
  if(exts.length){
    const next = exts.shift();
    img.dataset.exts = exts.join(',');
    img.src = `${img.dataset.base}.${next}`;
    return;
  }
  img.closest('.game-art')?.classList.add('missing');
  img.remove();
}

export function gameArtHTML(category, key, alt, opts={}){
  const style = normalizeArtStyle(opts.style ?? currentArtStyle());
  const classes = ['game-art', opts.className||''].filter(Boolean).join(' ');
  return `<div class="${classes}">
    <div class="game-art-fallback"><span>${esc(opts.fallback||alt)}</span></div>
    ${artImageHTML(artPath(style,category,key),alt)}
  </div>`;
}

export function archetypeArtHTML(a, sideIdx, opts={}){
  const style = normalizeArtStyle(opts.style ?? currentArtStyle());
  const item = archetypeCardForRole(a.role);
  if(item){
    const face = item.faces[sideIdx] || item.faces[0];
    return gameArtHTML('archetypes',`${pairedCardStem(style,item,sideIdx)}.png`,`${item.title}, ${face.label}`,{...opts,style});
  }
  const side = sideIdx===0 ? 'front' : 'turned';
  return gameArtHTML('archetypes',`${slugify(a.role)}--${side}`,`${a.role}, Side ${sideIdx===0?'I':'II'}`,{...opts,style});
}

export function omenArtHTML(o, opts={}){
  return gameArtHTML('omens',slugify(o.title),o.title,{...opts,fallback:opts.fallback||o.glyph});
}

export function hookArtHTML(hook, opts={}){
  return gameArtHTML('hooks',hook.id,hook.title,opts);
}

export function victimArtHTML(hook, opts={}){
  return gameArtHTML('victims',hook.id,`The victim of ${hook.title}`,opts);
}

/* Used during both local and online creation. The currently selected
   Incident supplies a meaningful preview in each style; no option is
   preselected unless the caller explicitly provides one. */
export function artStylePickerHTML(hookId, name, selected=null){
  return `<fieldset class="art-style-picker">
    <legend>Choose this tale’s art style</legend>
    <p>The choice is locked for this game so every card shares one visual language.</p>
    <div class="art-style-options">
      ${ART_STYLES.map(style=>`<label class="art-style-option">
        <input type="radio" name="${esc(name)}" value="${style.id}" ${selected===style.id?'checked':''} required>
        <span class="art-style-choice">
          ${gameArtHTML('hooks',hookId,style.label,{style:style.id,className:'art-style-preview',fallback:style.label})}
          <span class="art-style-copy"><strong>${style.label}</strong><small>${style.note}</small><em>Choose this style</em></span>
        </span>
      </label>`).join('')}
    </div>
    <p class="art-style-error" id="${esc(name)}-error" aria-live="polite"></p>
  </fieldset>`;
}
