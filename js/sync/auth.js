import { signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { auth } from './firebase-init.js';

let currentUid = null;
let readyResolve;
let readyReject;
export let authReady;

function resetAuthReady() {
  authReady = new Promise((res, rej) => {
    readyResolve = res;
    readyReject = rej;
  });
  // Prevent unhandled promise rejection if nobody is listening to authReady yet
  authReady.catch(() => {});
}

resetAuthReady();

onAuthStateChanged(auth,
  user => {
    if (user) {
      currentUid = user.uid;
      readyResolve(user.uid);
    }
  },
  error => {
    readyReject(error);
    resetAuthReady();
  }
);

export function getUid(){ return currentUid; }

/* Idempotent: safe to call from many places. Firebase Auth persists the
   session itself across reloads, so this only actually signs in once per
   device — later calls just resolve authReady immediately. */
let signingIn = null;
export function ensureSignedIn(){
  if (currentUid) return Promise.resolve(currentUid);
  if (!signingIn) {
    signingIn = (auth.currentUser ? Promise.resolve() : signInAnonymously(auth))
      .then(() => authReady)
      .catch(err => {
        // Reset cached signingIn and authReady on rejection so a later call can retry
        signingIn = null;
        resetAuthReady();
        throw err;
      });
  }
  return signingIn;
}
