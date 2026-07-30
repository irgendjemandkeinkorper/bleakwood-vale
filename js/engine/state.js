/* Shared mutable state, held as properties on one object so every module
   gets a live reference without needing to reassign an imported binding
   (ES module `let`/`const` exports can't be rebound from outside their
   defining module). Stage 1 keeps this purely local/in-memory, matching
   today's behavior; later stages layer Firestore sync on top without
   changing this shape's meaning to the UI code. */
export const State = {
  G: null,          // the whole game-in-progress object
  pendingHook: null, // hook chosen on the Incident screen, before players are set
  secretSel: [],     // omen indices picked while composing a Hidden Sin reveal
  chronReturn: null  // screen id to return to after an interim Chronicle view
};
