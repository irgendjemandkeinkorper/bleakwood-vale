import { $, esc } from '../engine/utils.js';

const KEY_NAME = 'bleakwood-gemini-api-key';
const MODEL = 'gemini-2.0-flash';

function apiKey(){ return localStorage.getItem(KEY_NAME)||''; }
export function setBleakifyKey(){
  const key = prompt('Paste your Gemini API key. It stays only in this browser.');
  if(key?.trim()) localStorage.setItem(KEY_NAME,key.trim());
}
export async function bleakifyText(text, target='scene'){
  const key = apiKey();
  if(!key) throw new Error('Add a Gemini API key first, then try Bleakify again.');
  const prompt = `Rewrite this ${target} text in a slightly more descriptive Gothic horror tone. Preserve every fact, name, choice, and meaning. Do not add plot events. Return only the rewritten text:\n\n${text}`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(key)}`,{
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})
  });
  if(!res.ok) throw new Error(`Gemini request failed (${res.status}).`);
  const data = await res.json();
  const out = data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
  if(!out) throw new Error('Gemini returned no text.');
  return out;
}
export async function bleakifyField(inputId, button, target){
  const input = $(inputId); if(!input?.value.trim()) return;
  const original = button.textContent; button.disabled=true; button.textContent='Bleakifying…';
  try{ input.value = await bleakifyText(input.value,target); input.dispatchEvent(new Event('input',{bubbles:true})); }
  catch(err){ alert(err.message); }
  finally{ button.disabled=false; button.textContent=original; }
}
export function bleakifyButton(inputId,target='scene'){
  return `<button class="ghost" type="button" onclick="bleakifyField('${inputId}',this,'${target}')">Bleakify <span class="small">(optional)</span></button>`;
}
