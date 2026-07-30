# Blackwood Vale

A gothic re-imagining of the tabletop story game *Tall Pines* (design by Miles
Gaborit) — a one-session, card-driven murder mystery for 1–6 players, told
together in three acts. Runs entirely in the browser.

See `Blackwood-Vale-Design-Bible.docx` for the full design/rules reference and
`Tall_Pines_Rules_r5.md` for the original tabletop rules this is adapted from.

## Status

Currently hotseat-only (one browser tab, shared screen). Remote multiplayer
via Firebase is in progress — see `/home/adamjroder/.claude/plans/flickering-dreaming-puppy.md`
for the architecture and build sequence.

## Running it locally

No build step. Serve the folder over HTTP (ES modules don't load from
`file://`) and open `index.html`:

```
python3 -m http.server 8080
# then visit http://localhost:8080/
```

## Project layout

```
index.html         screen markup, loads js/main.js as an ES module
css/style.css       all styling
js/data/            card content: hooks, archetypes, scenes, omens, secrets, act closes
js/engine/          state shape, pure rules helpers (tone counting, secret matching, etc.)
js/ui/              screen rendering + the mutation functions triggered by inline onclick handlers
js/chronicle/       Markdown export of the finished/in-progress Chronicle
```

`js/main.js` is the only file that reaches into `window` — it's the bridge
between ES module scoping and the inline `onclick="fn(...)"` attributes in
`index.html`. Everything else is normal module imports/exports.

## Firebase setup (for remote multiplayer)

Remote multiplayer syncs game state through Firestore. These steps are
one-time, manual, and can't be done on your behalf — an AI agent can't create
cloud accounts for you.

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add
   project** → give it a name (e.g. `blackwood-vale`) → Analytics is
   optional, fine to skip.
2. Register a **Web app** (the `</>` icon on the project overview page) —
   give it a nickname, skip "also set up Firebase Hosting" (this project
   uses GitHub Pages instead). Copy the `firebaseConfig` object it shows you
   into `js/sync/config.js` (this file doesn't exist yet — it's created in a
   later build stage, but the config itself is safe to commit to the repo:
   it's a client identifier, not a secret. Access control lives entirely in
   `firestore.rules`, not in hiding this key).
3. **Build → Authentication → Sign-in method** → enable **Anonymous**.
4. **Build → Firestore Database → Create database** → choose **production
   mode** (not test mode — we ship our own rules instead of relying on the
   default 30-day-open test mode).
5. Open the **Rules** tab in Firestore, paste in the contents of
   `firestore.rules` from this repo, and **Publish**.
6. Optional but recommended: **Firestore → collection → TTL policies** → add
   a policy on the `expireAt` field for the `rooms` collection, so old/
   abandoned game rooms get cleaned up automatically without any code.
7. **Easy to miss:** under **Authentication → Settings → Authorized
   domains**, add your GitHub Pages domain (e.g. `<your-username>.github.io`).
   Anonymous sign-in works fine on `localhost` during development without
   this, which can mask the fact that it's silently blocked once deployed —
   don't skip this step.

Once `js/sync/config.js` exists with your project's config filled in,
multiplayer sync can be built/tested against it.

## Deploying to GitHub Pages

Once this repo has a GitHub remote, enable Pages in the repo settings
(Settings → Pages → Deploy from a branch → `main` → `/ (root)`). No build
step is required since this is a static site.
