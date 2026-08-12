# Contributing

Bleakwood Vale is dependency-free, no-build-step by design (see README). A
few conventions aren't obvious from a first read of the code — they're
collected here for new contributors, human or agent.

## The `window` bridge (`js/main.js`)

`index.html` wires its controls through inline `onclick`/`oninput`/`onchange`
attributes (e.g. `onclick="pickSceneCard(2)"`), not addEventListener. Because
ES modules are not global scope, none of those function names are visible to
the browser's inline-handler evaluation unless something puts them there.

`js/main.js` is that one place. It imports every function referenced by an
inline handler anywhere in `index.html` and attaches them with a single
`Object.assign(window, { ... })` call. Every other file stays module-scoped —
no other file should assign to `window`.

**When you add a new UI function that index.html calls inline**, you must:
1. `export` it from whichever `js/ui/*.js` (or `js/chronicle/*.js`) module it belongs in.
2. Import it in `js/main.js`.
3. Add it to the `Object.assign(window, { ... })` block.

Miss step 3 and the browser throws `ReferenceError: fn is not defined` the
moment a player clicks the control — there's no build-time check for this
today (see the CI type-checking issue).

## The `esc()` convention

`js/engine/utils.js` exports `esc()`:

```js
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
```

**Every template literal that interpolates player- or content-authored text
into `innerHTML` must wrap that value in `esc()`.** This includes player
names, free-text narration/buy-in, and any archetype/hook/omen text sourced
from `js/data/*` (content is trusted, but the pattern is applied uniformly
so it's never a judgment call per call site).

```js
// wrong — player.name renders raw
el.innerHTML = `<span>${player.name}</span>`;

// right
el.innerHTML = `<span>${esc(player.name)}</span>`;
```

This convention is applied by hand at ~120 call sites across `js/ui/*` —
there is no framework enforcing it, so a new template literal touching
player text should follow the existing pattern in the surrounding file.

## Art-generation script order

Three scripts must run in this order after adding/editing any hook,
archetype, or omen in `js/data/*`:

1. `scripts/gen-prompts.mjs` — regenerates `art/IMAGE_PROMPTS.md` from
   `js/data/*`. Run this first, always, whenever card data changes — a CI
   check enforces that `IMAGE_PROMPTS.md` doesn't drift from `js/data/*`.
2. `scripts/gen-manifest.mjs` — regenerates `manifest.json`, the file
   `generate.py` actually reads (id/prompt/aspect-ratio/save-path per
   image). Writes scaffolded entity files into the sibling
   `../bleakwood-vault` project (or `$BLEAKWOOD_VAULT`).
3. `generate.py` — reads `manifest.json`, calls the Gemini API per image,
   saves art into `art/images/`.

See README's "Card art" section for full invocation examples and flags.

## Tagging convention

Releases are tagged `vYYYY.MM.DD` (e.g. `v2026.08.12`) on deploy-worthy
commits to `main`. Tag manually after confirming a GitHub Pages deploy looks
correct:

```
git tag -a v2026.08.12 -m "short summary of what shipped"
git push origin v2026.08.12
```

There's no automated tagging step yet — this is an honor-system process
until CI does it.
