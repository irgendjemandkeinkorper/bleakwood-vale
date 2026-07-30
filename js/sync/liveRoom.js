/* Room lifecycle: create, join, subscribe. Stage 3 scope — privacy is
   still deferred (hands/secrets live in the same public room doc as
   everything else; Stage 4 splits them into a private per-uid
   subcollection). See /home/adamjroder/.claude/plans/flickering-dreaming-puppy.md */
import { doc, setDoc, runTransaction, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db } from './firebase-init.js';
import { ensureSignedIn, getUid } from './auth.js';
import { ARCHETYPES, ACT_CLOSES } from '../data/index.js';
import { shuffle } from '../engine/utils.js';

export let roomCode = null;
let unsub = null;

export const roomRef = code => doc(db, 'rooms', code);

const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
function genCode(){
  let s=''; for(let i=0;i<5;i++) s += CODE_LETTERS[Math.floor(Math.random()*CODE_LETTERS.length)];
  return s;
}

function emptyPlayer(name, uid){
  return {name, uid, hand:[], omens:[], secrets:[], scenesLeft:0};
}

export async function createRoom(hook, hostName){
  const uid = await ensureSignedIn();
  const code = genCode();
  await setDoc(roomRef(code), {
    status:'lobby', phase:'lobby', hostUid:uid, hook,
    players:[emptyPlayer(hostName||'Storyteller I', uid)],
    seats:{[uid]:0},
    act:0, archetypes:[], victim:{name:'', facts:[]},
    sceneDeck:[], discardTones:[], omenDeck:[], omenRow:[],
    actClose:{}, journal:[], current:null, archIdx:0,
    firstScenePlayer:null, closeDone:false, pendingSecret:null,
    createdAt: Date.now()
  });
  roomCode = code;
  return code;
}

export async function joinRoom(code, name){
  const uid = await ensureSignedIn();
  code = (code||'').trim().toUpperCase();
  if(!code) throw new Error('Enter a room code.');
  const ref = roomRef(code);
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
  });
  roomCode = code;
}

export function subscribeRoom(code, onChange){
  if(unsub) unsub();
  unsub = onSnapshot(roomRef(code), snap => { if(snap.exists()) onChange(snap.data()); });
  return unsub;
}
export function unsubscribeRoom(){ if(unsub){ unsub(); unsub=null; } }

/* Shared by liveFinishVictim (Act I) and the auto-advance cascade
   (Acts II/III) — mirrors startAct() from js/ui/hub.js, operating on a
   plain room object instead of State.G. */
export function dealAct(room, act, SCENES){
  room.act = act;
  room.closeDone = false;
  room.discardTones = [];
  const np = room.players.length;
  room.sceneDeck = shuffle(SCENES[act].filter(s=>!s.hook || s.hook===room.hook.id).map(s=>({...s})));
  const handSize = np===1?5:3;
  room.players.forEach(p=>{
    p.hand = room.sceneDeck.splice(0, handSize);
    p.scenesLeft = np===1?3 : np===2?2 : 1;
  });
}

export function dealArchetypesAndCloses(room){
  room.archetypes = shuffle(ARCHETYPES).slice(0,6).map(a=>({...a, name:'', setupA:'', answeredBy:'', flipped:false}));
  room.actClose = {1:shuffle(ACT_CLOSES[1])[0], 2:shuffle(ACT_CLOSES[2])[0], 3:shuffle(ACT_CLOSES[3])[0]};
}

export { getUid };
