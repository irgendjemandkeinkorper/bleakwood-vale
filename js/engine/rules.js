import { TONES } from '../data/index.js';
import { State } from './state.js';

export function actToneCounts(){
  const G = State.G;
  const c = {Obsession:0,Guilt:0,Dread:0};
  if(!G) return c;
  G.discardTones.forEach(t=>c[t]++);
  G.archetypes.forEach(a=>c[faceUp(a).tone]++);
  return c;
}
export const faceUp = a => a.sides[a.flipped?1:0];

export function matchSecret(tones, fromPi){
  const G = State.G;
  const counts = {Obsession:0,Guilt:0,Dread:0};
  tones.forEach(t=>counts[t]++);
  const np = G.players.length;
  for(let k=1;k<=np;k++){
    const pi = (fromPi+k)%np;
    for(const s of G.players[pi].secrets){
      if(s.used) continue;
      const need = {Obsession:0,Guilt:0,Dread:0};
      s.combo.forEach(t=>need[t]++);
      if(TONES.every(t=>counts[t]>=need[t])) return {pi, secret:s};
    }
  }
  return null;
}

export function maxContrib(){ return 2; } // starter's card + 2 others = 3 total

export function eligibleContributors(){
  const G = State.G;
  const c = G.current, np = G.players.length;
  if(np===1) return c.contributions.length<maxContrib() ? [0] : [];
  const out=[];
  for(let i=0;i<np;i++){
    if(i===c.starter || c.contributions.filter(x=>x.pi===i).length>=2) continue;
    if(G.players[i].hand.length>0 || G.omenRow.length>0) out.push(i);
  }
  return out;
}
