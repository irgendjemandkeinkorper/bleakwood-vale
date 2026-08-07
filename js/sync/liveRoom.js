/* Room lifecycle: create, join, subscribe. Stage 3 scope — privacy is
   still deferred (hands/secrets live in the same public room doc as
   everything else; Stage 4 splits them into a private per-uid
   subcollection). See /home/adamjroder/.claude/plans/flickering-dreaming-puppy.md */
import { doc, setDoc, runTransaction, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db } from './firebase-init.js';
import { ensureSignedIn, getUid } from './auth.js';
import { ARCHETYPES, ACT_CLOSES } from '../data/index.js';
import { shuffle } from '../engine/utils.js';
import { normalizeArtStyle } from '../ui/art.js';

export let roomCode = null;
let unsub = null;

export const roomRef = code => doc(db, 'rooms', code);
export const privateRef = (code, uid) => doc(db, 'rooms', code, 'private', uid);

const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
function genCode(){
  let s=''; for(let i=0;i<5;i++) s += CODE_LETTERS[Math.floor(Math.random()*CODE_LETTERS.length)];
  return s;
}

function emptyPlayer(name, uid){
  // Stage 4: hand[]/secrets[] no longer live here — they're private, in
  // rooms/{code}/private/{uid}. This public record only carries counts
  // (and omens, which were never secret) so other players' UIs can show
  // "has 3 cards, 1 unrevealed secret" without ever reading their data.
  return {name, uid, omens:[], handCount:0, secretsCount:0, unrevealedSecretsCount:0, scenesLeft:0, readyRole:null};
}

export async function createRoom(hook, hostName, artStyle){
  const uid = await ensureSignedIn();
  const code = genCode();
  await setDoc(roomRef(code), {
    status:'lobby', phase:'lobby', hostUid:uid, hook, artStyle:normalizeArtStyle(artStyle),
    players:[emptyPlayer(hostName||'Storyteller I', uid)],
    seats:{[uid]:0},
    act:0, archetypes:[], victim:{name:'', facts:[]},
    sceneDeck:[], discardTones:[], omenDeck:[], omenRow:[],
    actClose:{}, journal:[], current:null, archIdx:0, omenVotes:{},
    firstScenePlayer:null, closeDone:false, pendingSecret:null,
    createdAt: Date.now()
    ,lastActiveAt: Date.now(), expireAt: Date.now()+60*60*1000
  });
  // Pre-create my own private doc. Not strictly required by the rules
  // (I could write it lazily later, since I always have write access to
  // my own doc) — done here so dealing logic can always use a plain
  // update() rather than create-or-update branching.
  await setDoc(privateRef(code, uid), {hand:[], secrets:[]});
  roomCode = code;
  return code;
}

export async function joinRoom(code, name){
  const uid = await ensureSignedIn();
  code = (code||'').trim().toUpperCase();
  if(!code) throw new Error('Enter a room code.');
  const ref = roomRef(code);
  let joined = false;
  await runTransaction(db, async tx => {
    const snap = await tx.get(ref);
    if(!snap.exists()) throw new Error('No tale is being told at that code.');
    const room = snap.data();
    if(room.seats && uid in room.seats) return; // already seated — just reconnecting
    if(room.status !== 'lobby') throw new Error('This tale already has its full cast.');
    if(room.players.length >= 6) throw new Error('The table is full — six storytellers is the most this tale allows.');
    const idx = room.players.length;
    const players = room.players.concat([emptyPlayer(name||`Storyteller ${idx+1}`, uid)]);
    const seats = {...room.seats, [uid]: idx};
    tx.update(ref, {players, seats});
    joined = true;
  });
  if(joined) await setDoc(privateRef(code, uid), {hand:[], secrets:[]});
  roomCode = code;
}

export function subscribeRoom(code, onChange){
  if(unsub) unsub();
  unsub = onSnapshot(roomRef(code), snap => { if(snap.exists()) onChange(snap.data()); });
  return unsub;
}
export async function touchRoom(code){
  if(!code) return;
  await runTransaction(db, async tx=>{
    const snap=await tx.get(roomRef(code));
    if(!snap.exists()) return;
    const now=Date.now(); tx.update(roomRef(code),{lastActiveAt:now,expireAt:now+60*60*1000});
  });
}
export function unsubscribeRoom(){ if(unsub){ unsub(); unsub=null; } }

let unsubPrivate = null;
export function subscribeMyPrivate(code, uid, onChange){
  if(unsubPrivate) unsubPrivate();
  unsubPrivate = onSnapshot(privateRef(code, uid), snap => {
    onChange(snap.exists() ? snap.data() : {hand:[], secrets:[]});
  });
  return unsubPrivate;
}
export function unsubscribeMyPrivate(){ if(unsubPrivate){ unsubPrivate(); unsubPrivate=null; } }

/* Shared by liveFinishVictim (Act I) and the delayed advance-after-close
   cascade (Acts II/III) — mirrors startAct() from js/ui/hub.js, operating
   on a plain room object instead of State.G. Mutates `room`'s public
   fields in place and RETURNS a { uid: hand[] } map for the caller to
   write out with a partial update() per uid — deliberately not a read-
   then-overwrite of each private doc, since Firestore's owner-only read
   rule on rooms/{code}/private/{uid} means a transaction acting as one
   player can never read another player's doc, only write to it. A
   partial update() only ever touches the `hand` field, leaving each
   player's `secrets` untouched without needing to have read it. */
export function dealAct(room, act, SCENES){
  room.act = act;
  room.closeDone = false;
  room.discardTones = [];
  const np = room.players.length;
  room.sceneDeck = shuffle(SCENES[act].filter(s=>!s.hook || s.hook===room.hook.id).map(s=>({...s})));
  const handSize = np===1?5:3;
  const hands = {};
  room.players.forEach(p=>{
    const hand = room.sceneDeck.splice(0, handSize);
    hands[p.uid] = hand;
    p.handCount = hand.length;
    p.scenesLeft = np===1?3 : np===2?2 : 1;
  });
  return hands;
}

export function dealArchetypesAndCloses(room){
  room.archetypes = shuffle(ARCHETYPES).slice(0,6).map(a=>({...a, name:'', setupA:'', answeredBy:'', flipped:false}));
  room.actClose = {1:shuffle(ACT_CLOSES[1])[0], 2:shuffle(ACT_CLOSES[2])[0], 3:shuffle(ACT_CLOSES[3])[0]};
}

export { getUid };
