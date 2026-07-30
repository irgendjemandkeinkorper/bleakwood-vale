/* The only file that talks to Firestore directly. Stage 2 scope: a
   one-way shadow mirror of the local game state into a hardcoded dev
   room, proving serialization + the published security rules work end
   to end. The app still reads/renders from local State.G — nothing here
   is user-visible yet. Stage 3 replaces this with real onSnapshot reads
   and per-mutation transactions. */
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db } from './firebase-init.js';
import { ensureSignedIn, getUid } from './auth.js';
import { State } from '../engine/state.js';

export const DEV_ROOM_CODE = 'dev-local';

/* Firestore rejects `undefined` field values; a JSON round-trip is the
   simplest safe way to strip them (and any non-plain-data, though the
   game state is already plain objects/arrays/strings/numbers/booleans). */
function serializeG(G){
  return JSON.parse(JSON.stringify(G));
}

let inFlight = false;
let pending = false;

export async function mirrorState(){
  const G = State.G;
  if (!G) return;
  if (inFlight) { pending = true; return; }
  inFlight = true;
  try {
    const uid = await ensureSignedIn();
    await setDoc(doc(db, 'rooms', DEV_ROOM_CODE), {
      snapshot: serializeG(G),
      seats: { [uid]: true },
      updatedAt: Date.now()
    });
  } catch (err) {
    console.warn('[sync] mirrorState failed', err);
  } finally {
    inFlight = false;
    if (pending) { pending = false; mirrorState(); }
  }
}
