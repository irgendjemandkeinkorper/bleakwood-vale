import { State } from '../engine/state.js';
import { show } from './screens.js';

export function exportGameState(){
  if(!State.G) return;
  const blob = new Blob([JSON.stringify({version:1, exportedAt:new Date().toISOString(), state:State.G},null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='bleakwood-vale-save.json'; a.click(); URL.revokeObjectURL(a.href);
}
export function importGameState(){ document.getElementById('save-import-input')?.click(); }
export function handleStateImport(event){
  const file=event.target.files?.[0]; if(!file) return;
  const reader=new FileReader(); reader.onload=()=>{
    try{
      const parsed=JSON.parse(reader.result); const g=parsed.state;
      if(!g?.hook || !Array.isArray(g.players) || !Array.isArray(g.archetypes)) throw new Error('That is not a Bleakwood Vale save.');
      State.G=g; State.onlineRoomCode=null;
      if(g.act>3){ window.renderChronicle?.(false); show('scr-chronicle'); }
      else { window.renderHub?.(); show('scr-hub'); }
    }catch(err){ alert(err.message); }
    event.target.value='';
  }; reader.readAsText(file);
}
