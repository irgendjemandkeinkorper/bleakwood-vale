/* Every function here wraps one guarded Firestore transaction: read the
   room fresh, verify the action is still legal against that fresh read
   (not against possibly-stale local state), mutate a plain object the
   same shape as the old local G, write it back. None of these render
   anything — the onSnapshot subscription in js/ui/online.js is the sole
   place that reacts to the result (for every client, including the
   actor), which is what makes two racing clients resolve safely: the
   loser's transaction function re-runs against the winner's just-written
   data and its own guard rejects it. */
import { runTransaction } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { roomRef, dealAct, dealArchetypesAndCloses, getUid } from './liveRoom.js';
import { db } from './firebase-init.js';
import { SCENES, OMENS, SECRETS } from '../data/index.js';
import { shuffle } from '../engine/utils.js';

function mySeat(room){
  const uid = getUid();
  const idx = room.seats ? room.seats[uid] : undefined;
  return idx===undefined ? -1 : idx;
}

async function tx(code, fn){
  await runTransaction(db, async t => {
    const snap = await t.get(roomRef(code));
    if(!snap.exists()) throw new Error('This tale no longer exists.');
    const room = snap.data();
    fn(room);
    t.set(roomRef(code), room);
  });
}

export async function liveBeginTale(code){
  await tx(code, room => {
    if(room.phase !== 'lobby') throw new Error('The tale has already begun.');
    if(getUid() !== room.hostUid) throw new Error('Only the one who opened this table may begin the tale.');
    dealArchetypesAndCloses(room);
    room.victim = {name:'', facts:[]};
    room.journal = [];
    room.archIdx = 0;
    room.firstScenePlayer = null;
    room.closeDone = false;
    room.pendingSecret = null;
    room.status = 'active';
    room.phase = 'archsetup';
  });
}

export async function liveSaveArchSetup(code, name, answer){
  await tx(code, room => {
    if(room.phase !== 'archsetup') throw new Error('Not answering questions right now.');
    const answerer = room.players[room.archIdx % room.players.length];
    if(mySeat(room) !== room.players.indexOf(answerer)) throw new Error('Not your question to answer.');
    const a = room.archetypes[room.archIdx];
    a.name = (name||'').trim() || a.role;
    a.setupA = (answer||'').trim() || '(left unspoken)';
    a.answeredBy = answerer.name;
    room.victim.facts.push({role:a.role, who:a.name, q:a.setup[room.hook.id], a:a.setupA});
    room.archIdx++;
    if(room.archIdx >= 6) room.phase = 'victim';
  });
}

export async function liveFinishVictim(code, victimName){
  await tx(code, room => {
    if(room.phase !== 'victim') throw new Error('Not naming the Victim right now.');
    room.victim.name = (victimName||'').trim() || 'The Nameless Dead';
    room.omenDeck = shuffle(OMENS);
    room.omenRow = room.omenDeck.splice(0,6);
    const secrets = shuffle(SECRETS);
    room.players.forEach(p=>{ p.secrets=[{...secrets.pop(), used:false}]; });
    if(room.players.length===1) room.players[0].secrets.push({...secrets.pop(), used:false});
    dealAct(room, 1, SCENES);
    room.phase = 'playing';
  });
}

export async function liveBeginScene(code, cardIdx, archIdx, opening){
  await tx(code, room => {
    if(room.phase !== 'playing' || room.current !== null) throw new Error('A scene is already in progress.');
    if(room.pendingSecret) throw new Error('A Hidden Sin must be revealed first.');
    const pi = mySeat(room);
    const p = room.players[pi];
    if(!p || p.scenesLeft<=0) throw new Error('You have no scene left to start this act.');
    if(cardIdx<0 || cardIdx>=p.hand.length) throw new Error('That card is no longer in your hand.');
    const card = p.hand.splice(cardIdx,1)[0];
    room.current = {type:'scene', starter:pi, archIdx, card, contributions:[], happened:'', opening:(opening||'').trim(), phase:'play'};
  });
}

export async function liveBeginClose(code, archIdx, starterSeat, element, opening, closeTitle, closePrompt){
  await tx(code, room => {
    if(room.current !== null) throw new Error('Something is already in progress.');
    if(room.pendingSecret) throw new Error('A Hidden Sin must be revealed first.');
    if(room.closeDone) throw new Error('The Act Close has already played.');
    const remaining = room.players.reduce((s,p)=>s+p.scenesLeft,0);
    if(remaining>0) throw new Error('Scenes remain before the Act may close.');
    room.current = {
      type:'close', starter:starterSeat, archIdx,
      card:{title:closeTitle, prompt:closePrompt, tone:null},
      element, opening:(opening||'').trim(),
      contributions:[], happened:'', phase:'play'
    };
  });
}

export async function liveContribute(code, kind, idx, how){
  await tx(code, room => {
    const c = room.current;
    if(!c) throw new Error('No scene in progress.');
    if(c.contributions.length >= 2) throw new Error('This scene already holds three cards.');
    const pi = mySeat(room);
    if(pi === c.starter) throw new Error('You already opened this scene.');
    if(c.contributions.some(x=>x.pi===pi)) throw new Error('You already played into this scene.');
    let card;
    if(kind==='scene'){
      const hand = room.players[pi].hand;
      if(idx<0 || idx>=hand.length) throw new Error('That card is no longer in your hand.');
      card = hand.splice(idx,1)[0];
    } else {
      if(idx<0 || idx>=room.omenRow.length) throw new Error('That omen is no longer in the row.');
      card = room.omenRow.splice(idx,1)[0];
      if(room.omenDeck.length) room.omenRow.push(room.omenDeck.shift());
    }
    c.contributions.push({pi, kind, card, how:(how||'').trim()});
  });
}

function afterSceneFlow(room){
  if(room.closeDone){
    if(room.act>=3){ room.phase='finished'; room.status='finished'; room.act=4; }
    else dealAct(room, room.act+1, SCENES);
  }
}

function countTonesAndResolve(room, flips){
  const c = room.current;
  flips.forEach(i=>{ const a = room.archetypes[i]; a.flipped = !a.flipped; });
  const lead = room.archetypes[c.archIdx];
  const tones = [];
  if(c.card.tone) tones.push(c.card.tone);
  c.contributions.forEach(x=>{ if(x.kind==='scene') tones.push(x.card.tone); });
  tones.push(lead.sides[lead.flipped?1:0].tone);
  room.discardTones.push(...tones);
  c.contributions.forEach(x=>{ if(x.kind==='omen') room.players[x.pi].omens.push(x.card); });

  const flipNames = flips.map(i=>{
    const a = room.archetypes[i];
    return `${a.name||a.role} turned to side ${a.flipped?'II':'I'}`;
  });

  room.journal.push({
    type:c.type, act:room.act,
    playerName:room.players[c.starter].name,
    archName:lead.name||lead.role, archRole:lead.role,
    cardTitle:c.card.title, cardPrompt:c.card.prompt, element:c.element||null,
    opening:c.opening, happened:c.happened,
    contributions:c.contributions.map(x=>({playerName:room.players[x.pi].name, kind:x.kind,
      title:x.card.title, glyph:x.card.glyph||null, tone:x.card.tone||null, how:x.how})),
    tones:tones.slice(), flips:flipNames, struck:false
  });

  if(c.type==='scene'){
    if(room.firstScenePlayer===null) room.firstScenePlayer = c.starter;
    room.players[c.starter].scenesLeft--;
  }
  if(c.type==='close') room.closeDone = true;

  const unlock = matchSecretServer(room, tones, c.starter);
  room.current = null;
  if(unlock){
    room.pendingSecret = {pi:unlock.pi, secretIndex:unlock.secretIndex};
  } else {
    afterSceneFlow(room);
  }
}

function matchSecretServer(room, tones, fromPi){
  const counts = {Obsession:0,Guilt:0,Dread:0};
  tones.forEach(t=>counts[t]++);
  const np = room.players.length;
  for(let k=1;k<=np;k++){
    const pi = (fromPi+k)%np;
    const secrets = room.players[pi].secrets;
    for(let si=0; si<secrets.length; si++){
      const s = secrets[si];
      if(s.used) continue;
      const need = {Obsession:0,Guilt:0,Dread:0};
      s.combo.forEach(t=>need[t]++);
      if(['Obsession','Guilt','Dread'].every(t=>counts[t]>=need[t])) return {pi, secretIndex:si};
    }
  }
  return null;
}

export async function liveEndSceneAndResolve(code, happenedText, flips){
  await tx(code, room => {
    const c = room.current;
    if(!c) throw new Error('No scene in progress.');
    const pi = mySeat(room);
    if(pi !== c.starter) throw new Error('Only the one who began this scene may end it.');
    c.happened = (happenedText||'').trim();
    countTonesAndResolve(room, flips||[]);
  });
}

export async function liveConfirmSecret(code, omenIndices, answerText){
  await tx(code, room => {
    const u = room.pendingSecret;
    if(!u) throw new Error('No Hidden Sin is waiting to be revealed.');
    const pi = mySeat(room);
    if(pi !== u.pi) throw new Error('This Sin is not yours to reveal.');
    const secret = room.players[pi].secrets[u.secretIndex];
    secret.used = true;
    room.journal.push({
      type:'secret', act:room.act, playerName:room.players[pi].name,
      question:secret.q, combo:secret.combo.slice(),
      omens: omenIndices.map(i=>({glyph:room.omenRow[i].glyph, title:room.omenRow[i].title})),
      answer:(answerText||'').trim(), struck:false
    });
    room.pendingSecret = null;
    afterSceneFlow(room);
  });
}

export async function liveTradeOmen(code, omenIdx){
  await tx(code, room => {
    const pi = mySeat(room);
    const p = room.players[pi];
    if(!room.sceneDeck.length) throw new Error('The scene deck is empty.');
    if(omenIdx<0 || omenIdx>=p.omens.length) throw new Error('You don’t hold that omen.');
    const o = p.omens.splice(omenIdx,1)[0];
    room.omenDeck.unshift(o);
    p.hand.push(room.sceneDeck.pop());
  });
}

export async function liveForfeitScene(code, targetSeat){
  await tx(code, room => {
    const p = room.players[targetSeat];
    if(!p) throw new Error('No such storyteller.');
    if(p.scenesLeft<=0) throw new Error('Nothing to forfeit.');
    if(p.hand.length>0 || p.omens.length>0) throw new Error('They still have a card or omen to play.');
    p.scenesLeft--;
    room.journal.push({type:'note', act:room.act, text:`${p.name} had neither scene card nor omen to trade, and lost their scene. The Vale went un-narrated a while.`, struck:false});
    afterSceneFlow(room);
  });
}

export async function liveToggleStrike(code, journalIndex){
  await tx(code, room => {
    if(!room.journal[journalIndex]) throw new Error('No such entry.');
    room.journal[journalIndex].struck = !room.journal[journalIndex].struck;
  });
}

export { mySeat };
