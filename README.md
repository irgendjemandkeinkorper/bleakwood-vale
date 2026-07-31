# Bleakwood Vale

A gothic re-imagining of the tabletop story game *Tall Pines* (design by Miles
Gaborit) — a one-session, card-driven murder mystery for 1–6 players, told
together in three acts. Runs entirely in the browser.

See `Bleakwood-Vale-Design-Bible.docx` for the full design/rules reference and
`Tall_Pines_Rules_r5.md` for the original tabletop rules this is adapted from.

## Status

Hotseat (one browser tab, shared screen) and real-time remote multiplayer via
Firebase/Firestore (room codes, per-player privacy) both work — "Begin the
Tale" and "Play Online" on the title screen. See
`/home/adamjroder/.claude/plans/flickering-dreaming-puppy.md` for the original
multiplayer architecture/build-sequence notes.

## Running it locally

No build step. Serve the folder over HTTP (ES modules don't load from
`file://`) and open `index.html`:

```
python3 -m http.server 8080
# then visit http://localhost:8080/
```

### Browser smoke test

The dev-only browser smoke test covers solo setup through the first act hub,
Gallery face/quote flipping, the online entry surface, and narrow-screen
overflow. It does not create a Firebase room. Install Playwright and its
Chromium browser in the environment used for checks, then run:

```
python3 -m pip install playwright
playwright install chromium
python3 scripts/smoke.py
```

Production remains a dependency-free static site; these are local verification
tools only.

## Project layout

```
index.html         screen markup, loads js/main.js as an ES module
css/style.css       all styling
js/data/            card content: hooks, archetypes, scenes, omens, secrets, act closes
js/engine/          state shape, pure rules helpers (tone counting, secret matching, etc.)
js/ui/              screen rendering + the mutation functions triggered by inline onclick handlers
js/ui/gallery.js     the in-app card-art Gallery (title screen + topbar)
js/chronicle/       Markdown export of the finished/in-progress Chronicle
art/                image prompts + generated card art (see "Card art" below)
```

`js/main.js` is the only file that reaches into `window` — it's the bridge
between ES module scoping and the inline `onclick="fn(...)"` attributes in
`index.html`. Everything else is normal module imports/exports.

## Firebase setup (for remote multiplayer)

Remote multiplayer syncs game state through Firestore. These steps are
one-time, manual, and can't be done on your behalf — an AI agent can't create
cloud accounts for you.

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add
   project** → give it a name (e.g. `bleakwood-vale`) → Analytics is
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

## Card art

`js/ui/gallery.js` (title screen + topbar "The Gallery") and every in-game
card display show generated art when it exists at
`art/images/<style>/<category>/<slug>.<ext>` (`style` is `painterly` or
`tarot`, `category` is `archetypes`/`hooks`/`omens`/`victims`) and fall back
to a plain text card when it doesn't — art is optional at every layer, never
a hard dependency.

Art is generated with Gemini (`gemini-3.1-flash-image`), using the same
`google-genai` pattern as the sibling `dramgid-lore-gallery` project:

1. `scripts/gen-prompts.mjs` — regenerates `art/IMAGE_PROMPTS.md`, the
   human-readable prompt sheet, straight from `js/data/*` (so it can never
   drift out of sync with the actual card roster). Run after adding/editing
   any hook, archetype, or omen.
2. `scripts/gen-manifest.mjs` — regenerates `manifest.json` (what
   `generate.py` actually reads: id/prompt/aspect-ratio/save-path per image)
   and scaffolds one Markdown entity per card in the sibling
   `../bleakwood-vault` project (create it first, or set `BLEAKWOOD_VAULT` to
   point elsewhere) — mirrors how `dramgid-vault` pairs with
   `dramgid-lore-gallery`. **Only run this when the vault doesn't yet have
   image URLs you want to keep** — it overwrites each entity file, including
   any `image_*` frontmatter `generate.py` already wrote back.
3. `generate.py` — reads `manifest.json`, calls Gemini per image, saves into
   this repo's own `art/images/` (served by this repo's own GitHub Pages —
   no separate gallery repo needed), and writes the resulting URL back into
   the matching vault entity's frontmatter. Needs a `GOOGLE_API_KEY` in a
   local `.env` (gitignored) and the venv in `.venv/` (`python3 -m venv
   .venv && .venv/bin/pip install -r requirements.txt`).
   ```
   .venv/bin/python generate.py                    # everything missing
   .venv/bin/python generate.py --limit 4           # small test batch
   .venv/bin/python generate.py --category omens    # just one category
   .venv/bin/python generate.py --ids the-mudlark    # just one card's id
   ```
   Already-generated files are skipped on reruns, so it's safe to re-run
   after adding new content instead of regenerating everything.

## Deploying to GitHub Pages

Once this repo has a GitHub remote, enable Pages in the repo settings
(Settings → Pages → Deploy from a branch → `main` → `/ (root)`). No build
step is required since this is a static site.
