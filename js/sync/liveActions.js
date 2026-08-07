/* Every function here wraps one guarded Firestore transaction. Stage 4:
   hand[]/secrets[] live in rooms/{code}/private/{uid}, readable and
   writable only by that uid (see firestore.rules) — so a transaction
   run on behalf of player A can read/write player A's own private doc,
   but can never touch player B's. That constraint is why secret-matching
   is no longer computed inside the scene-resolving transaction (Stage 3
   could do this because everything was public): resolving a scene now
   only records tones/journal/flips, and each client reactively checks
   its OWN cached private secrets against the newest journal entry,
   claiming it via liveClaimSecret if it matches. See the plan doc
   (/home/adamjroder/.claude/plans/flickering-dreaming-puppy.md) for the
   full reasoning. Acts still auto-advance, but via a separately callable,
   idempotent liveAdvanceAfterClose() rather than inline in resolve —
   every client schedules a short delayed call to it once it sees
   closeDone with nothing pending, so whichever client's timer fires
   first wins and everyone else's attempt safely no-ops. */
import { runTransaction } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { roomRef, privateRef, dealAct, dealArchetypesAndCloses, getUid } from './liveRoom.js';
import { db } from './firebase-init.js';
import { SCENES, OMENS, SECRETS } from '../data/index.js';
import { shuffle } from '../engine/utils.js';

function mySeat(room){
  const uid = getUid();
  const idx = room.seats ? room.seats[uid] : undefined;
  return idx===undefined ? -1 : idx;
}

async function readRoom(t, code){
  const snap = await t.get(roomRef(code));
  if(!snap.exists()) throw new Error('This tale no longer exists.');
  return snap.data();
}

export async function liveBeginTale(code){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
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
    t.set(roomRef(code), room);
  });
}

export async function liveSaveArchSetup(code, name, answer){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    if(room.phase !== 'archsetup') throw new Error('Not answering questions right now.');
    const answerer = room.players[room.archIdx % room.players.length];
    // Deliberately not gated to the assigned answerer's uid: Archetypes are
    // never owned by one player even in the tabletop original ("No player
    // is the sole owner or controller of any single Protagonist"), and
    // without this, a disconnected player stuck as "current answerer" would
    // deadlock the whole game — archIdx can only ever be advanced by this
    // function. Any seated player may answer on their behalf; the UI
    // (js/ui/online.js) still shows the input to the assigned answerer by
    // default and only reveals it to others via an explicit "answer for
    // them" action, so this doesn't change normal-flow turn-taking.
    if(mySeat(room) < 0) throw new Error('Not seated at this table.');
    const a = room.archetypes[room.archIdx];
    a.name = (name||'').trim() || a.role;
    a.setupA = (answer||'').trim() || '(left unspoken)';
    a.answeredBy = answerer.name;
    room.victim.facts.push({role:a.role, who:a.name, q:a.setup[room.hook.id], a:a.setupA});
    room.archIdx++;
    if(room.archIdx >= 6) room.phase = 'victim';
    t.set(roomRef(code), room);
  });
}

export async function liveFinishVictim(code, victimName){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    if(room.phase !== 'victim') throw new Error('Not naming the Victim right now.');

    room.victim.name = (victimName||'').trim() || 'The Nameless Dead';
    room.omenDeck = shuffle(OMENS);
    room.omenRow = room.omenDeck.splice(0,6);

    // Never read another player's private doc (the rules wouldn't allow
    // it) — deal blind, writing each uid's fresh secrets with a partial
    // update() rather than a read-then-overwrite.
    const secrets = shuffle(SECRETS);
    const secretsToWrite = {};
    room.players.forEach(p=>{
      secretsToWrite[p.uid] = [{...secrets.pop(), used:false}];
      p.secretsCount = 1;
      p.unrevealedSecretsCount = 1;
    });
    if(room.players.length===1){
      const p = room.players[0];
      secretsToWrite[p.uid].push({...secrets.pop(), used:false});
      p.secretsCount = 2; p.unrevealedSecretsCount = 2;
    }

    const hands = dealAct(room, 1, SCENES);
    room.phase = 'playing';

    t.set(roomRef(code), room);
    room.players.forEach(p => {
      t.update(privateRef(code, p.uid), {hand: hands[p.uid], secrets: secretsToWrite[p.uid]});
    });
  });
}

export async function liveBeginScene(code, cardIdx, archIdx, opening){
  const uid = getUid();
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    if(room.phase !== 'playing' || room.current !== null) throw new Error('A scene is already in progress.');
    if(room.pendingSecret) throw new Error('A Hidden Sin must be revealed first.');
    const pi = mySeat(room);
    const p = room.players[pi];
    if(!p || p.scenesLeft<=0) throw new Error('You have no scene left to start this act.');

    const pref = privateRef(code, uid);
    const psnap = await t.get(pref);
    const priv = psnap.exists() ? psnap.data() : {hand:[], secrets:[]};
    if(cardIdx<0 || cardIdx>=priv.hand.length) throw new Error('That card is no longer in your hand.');
    const card = priv.hand.splice(cardIdx,1)[0];
    p.handCount = priv.hand.length;

    const archIdxs = Array.isArray(archIdx) ? archIdx.slice(0,2).map(Number).filter(Number.isInteger) : [Number(archIdx)];
    if(!archIdxs.length) throw new Error('Choose at least one lead archetype.');
    room.current = {type:'scene', starter:pi, archIdx:archIdxs[0], archIdxs, card, contributions:[], happened:'', opening:(opening||'').trim(), phase:'play'};

    t.set(roomRef(code), room);
    t.set(pref, priv);
  });
}

export async function liveBeginClose(code, archIdx, starterSeat, element, opening, closeTitle, closePrompt){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
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
    t.set(roomRef(code), room);
  });
}

export async function liveContribute(code, kind, idx, how){
  const uid = getUid();
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    const c = room.current;
    if(!c) throw new Error('No scene in progress.');
    if(c.contributions.length >= 2) throw new Error('This scene already holds three cards.');
    const pi = mySeat(room);
    if(pi === c.starter) throw new Error('You already opened this scene.');
    if(c.contributions.filter(x=>x.pi===pi).length>=2) throw new Error('You have already played two cards into this scene.');

    let card, pref, priv;
    if(kind==='scene'){
      pref = privateRef(code, uid);
      const psnap = await t.get(pref);
      priv = psnap.exists() ? psnap.data() : {hand:[], secrets:[]};
      if(idx<0 || idx>=priv.hand.length) throw new Error('That card is no longer in your hand.');
      card = priv.hand.splice(idx,1)[0];
      room.players[pi].handCount = priv.hand.length;
    } else {
      if(idx<0 || idx>=room.omenRow.length) throw new Error('That omen is no longer in the row.');
      card = room.omenRow.splice(idx,1)[0];
      if(room.omenDeck.length) room.omenRow.push(room.omenDeck.shift());
    }
    c.contributions.push({pi, kind, card, how:(how||'').trim()});

    t.set(roomRef(code), room);
    if(pref) t.set(pref, priv);
  });
}

function countTonesAndResolve(room, flips){
  const c = room.current;
  flips.forEach(i=>{ const a = room.archetypes[i]; a.flipped = !a.flipped; });
  const leadIndices = c.archIdxs?.length ? c.archIdxs : [c.archIdx];
  const lead = room.archetypes[leadIndices[0]];
  const tones = [];
  if(c.card.tone) tones.push(c.card.tone);
  c.contributions.forEach(x=>{ if(x.kind==='scene') tones.push(x.card.tone); });
  leadIndices.forEach(i=>{ const a=room.archetypes[i]; tones.push(a.sides[a.flipped?1:0].tone); });
  room.discardTones.push(...tones);
  const usedOmens=c.contributions.filter(x=>x.kind==='omen').map(x=>x.card);
  room.omenDeck=shuffle(room.omenDeck.concat(usedOmens));
  while(room.omenRow.length<6 && room.omenDeck.length) room.omenRow.push(room.omenDeck.shift());

  const flipNames = flips.map(i=>{
    const a = room.archetypes[i];
    return `${a.name||a.role} turned to side ${a.flipped?'II':'I'}`;
  });

  room.journal.push({
    type:c.type, act:room.act,
    playerName:room.players[c.starter].name,
    archName:leadIndices.map(i=>room.archetypes[i].name||room.archetypes[i].role).join(' + '), archRole:leadIndices.map(i=>room.archetypes[i].role).join(' + '),
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
  room.current = null;
  // No secret-matching here — see file header. The client (js/ui/online.js)
  // reactively checks the new journal entry against its own private
  // secrets and, on a match, calls liveClaimSecret. If nothing is claimed,
  // every client's delayed liveAdvanceAfterClose() call handles cascading
  // to the next act once closeDone is true.
}

export async function liveEndSceneAndResolve(code, happenedText, flips){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    const c = room.current;
    if(!c) throw new Error('No scene in progress.');
    const pi = mySeat(room);
    if(pi !== c.starter) throw new Error('Only the one who began this scene may end it.');
    c.happened = (happenedText||'').trim();
    countTonesAndResolve(room, flips||[]);
    t.set(roomRef(code), room);
  });
}

/* Called reactively by a client that believes its own (privately held,
   locally cached) secrets match the tones of the most recent journal
   entry. journalIndex is passed by the caller (computed against its own
   snapshot) and re-verified fresh here — if the group has moved on
   (a new scene started, or someone else already claimed) this simply
   fails with a friendly error and the caller gives up gracefully. */
export async function liveClaimSecret(code, journalIndex){
  const uid = getUid();
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    if(room.pendingSecret) throw new Error('Someone already claimed a Sin from this scene.');
    if(room.current !== null) throw new Error('A new scene has already begun.');
    if(journalIndex !== room.journal.length - 1) throw new Error('That moment has passed.');
    const entry = room.journal[journalIndex];
    if(!entry) throw new Error('Nothing to check yet.');
    const pi = mySeat(room);
    if(pi < 0) throw new Error('Not seated at this table.');

    const pref = privateRef(code, uid);
    const psnap = await t.get(pref);
    const priv = psnap.exists() ? psnap.data() : {hand:[], secrets:[]};
    const counts = {Obsession:0,Guilt:0,Dread:0};
    entry.tones.forEach(tn=>counts[tn]++);
    let matchIdx = -1;
    for(let si=0; si<priv.secrets.length; si++){
      const s = priv.secrets[si];
      if(s.used) continue;
      const need = {Obsession:0,Guilt:0,Dread:0};
      s.combo.forEach(tn=>need[tn]++);
      if(['Obsession','Guilt','Dread'].every(tn=>counts[tn]>=need[tn])){ matchIdx = si; break; }
    }
    if(matchIdx<0) throw new Error('No matching Hidden Sin.');

    room.pendingSecret = {pi, secretIndex:matchIdx, journalIndex};
    t.set(roomRef(code), room);
  });
}

export async function liveConfirmSecret(code, omenIndices, answerText){
  const uid = getUid();
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    const u = room.pendingSecret;
    if(!u) throw new Error('No Hidden Sin is waiting to be revealed.');
    const pi = mySeat(room);
    if(pi !== u.pi) throw new Error('This Sin is not yours to reveal.');

    const pref = privateRef(code, uid);
    const psnap = await t.get(pref);
    const priv = psnap.exists() ? psnap.data() : {hand:[], secrets:[]};
    const secret = priv.secrets[u.secretIndex];
    secret.used = true;
    room.players[pi].unrevealedSecretsCount = priv.secrets.filter(s=>!s.used).length;

    room.journal.push({
      type:'secret', act:room.act, playerName:room.players[pi].name,
      question:secret.q, combo:secret.combo.slice(),
      omens: omenIndices.map(i=>({glyph:room.omenRow[i].glyph, title:room.omenRow[i].title})),
      answer:(answerText||'').trim(), struck:false
    });
    room.pendingSecret = null;

    t.set(roomRef(code), room);
    t.set(pref, priv);
  });
}

/* Idempotent — safe for every client to call speculatively. Advances to
   the next act (or finishes the game) only if the room is genuinely in
   the "just closed, nothing pending" state; otherwise it's a silent
   no-op, which is what lets multiple clients race this call safely. */
export async function liveAdvanceAfterClose(code){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    if(!room.closeDone || room.current !== null || room.pendingSecret) return;
    if(room.act>=3){
      room.phase='finished'; room.status='finished'; room.act=4;
      t.set(roomRef(code), room);
      return;
    }
    const hands = dealAct(room, room.act+1, SCENES); // never reads other players' private docs — see dealAct's comment
    t.set(roomRef(code), room);
    room.players.forEach(p => t.update(privateRef(code, p.uid), {hand: hands[p.uid]}));
  });
}

export async function liveTradeOmen(code, omenIdx){
  const uid = getUid();
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    const pi = mySeat(room);
    const p = room.players[pi];
    if(!room.sceneDeck.length) throw new Error('The scene deck is empty.');
    if(omenIdx<0 || omenIdx>=p.omens.length) throw new Error('You don’t hold that omen.');

    const pref = privateRef(code, uid);
    const psnap = await t.get(pref);
    const priv = psnap.exists() ? psnap.data() : {hand:[], secrets:[]};

    const o = p.omens.splice(omenIdx,1)[0];
    room.omenDeck.unshift(o);
    priv.hand.push(room.sceneDeck.pop());
    p.handCount = priv.hand.length;

    t.set(roomRef(code), room);
    t.set(pref, priv);
  });
}

export async function liveForfeitScene(code, targetSeat){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    const p = room.players[targetSeat];
    if(!p) throw new Error('No such storyteller.');
    if(p.scenesLeft<=0) throw new Error('Nothing to forfeit.');
    if(p.handCount>0 || p.omens.length>0) throw new Error('They still have a card or omen to play.');
    p.scenesLeft--;
    room.journal.push({type:'note', act:room.act, text:`${p.name} had neither scene card nor omen to trade, and lost their scene. The Vale went un-narrated a while.`, struck:false});
    t.set(roomRef(code), room);
  });
}

export async function liveToggleStrike(code, journalIndex){
  await runTransaction(db, async t => {
    const room = await readRoom(t, code);
    if(!room.journal[journalIndex]) throw new Error('No such entry.');
    room.journal[journalIndex].struck = !room.journal[journalIndex].struck;
    t.set(roomRef(code), room);
  });
}

export async function liveSetReady(code, role){
  const allowed=['lead','follow','watch'];
  if(role!==null && !allowed.includes(role)) throw new Error('Unknown readiness role.');
  await runTransaction(db, async t=>{
    const room=await readRoom(t,code), pi=mySeat(room);
    if(pi<0) throw new Error('Not seated at this table.');
    room.players[pi].readyRole=role;
    t.set(roomRef(code),room);
  });
}
export async function liveVoteOmen(code, omenIndex){
  await runTransaction(db, async t=>{
    const room=await readRoom(t,code), uid=getUid(), pi=mySeat(room);
    if(pi<0 || !room.omenRow[omenIndex]) throw new Error('That omen is no longer available.');
    room.omenVotes=room.omenVotes||{}; room.omenVotes[uid]=Number(omenIndex);
    const votes=Object.values(room.omenVotes), unanimous=votes.length===room.players.length && votes.every(v=>v===Number(omenIndex));
    if(unanimous){ const old=room.omenRow[omenIndex]; room.omenDeck=shuffle(room.omenDeck.concat([old])); room.omenRow[omenIndex]=room.omenDeck.shift()||old; room.omenVotes={}; }
    t.set(roomRef(code),room);
  });
}

export async function liveSwapArchetype(code, index, replacement){
  await runTransaction(db, async t=>{
    const room=await readRoom(t,code);
    if(room.phase!=='archsetup' || index!==room.archIdx) throw new Error('That archetype is no longer being established.');
    const used=new Set(room.archetypes.map(a=>a.id)); if(used.has(replacement.id)) throw new Error('That archetype is already in the setup.');
    room.archetypes[index]={...replacement,name:'',setupA:'',answeredBy:'',flipped:false}; t.set(roomRef(code),room);
  });
}

export { mySeat };
