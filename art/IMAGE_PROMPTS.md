# Blackwood Vale — Gemini Image Prompt Sheet

Prompts for generating card art with Gemini's image model ("Nano Banana" /
Imagen). Style: **painterly gothic illustration** — moody, desaturated oil
painting, closer to a dark-fantasy tarot deck than a photograph. Written to
match the site's existing palette (`css/style.css`) so the art and the UI
chrome read as one object.

## Master style block

Prepend this to every prompt below (or keep it as a saved "style" in
whatever tool you're using), then append the card-specific description
that follows it. Keeping the prefix identical across every generation is
what makes 59 separate images read as one deck.

> Painterly gothic illustration, moody desaturated oil painting style, thick
> visible brushwork, dramatic chiaroscuro lighting, single dominant light
> source, heavy shadow. Victorian-era (1880s England) setting. Restrained,
> muted palette — near-black backgrounds, warm parchment cream, tarnished
> gold, oxblood red, deep moss and slate greens, pale moonlight grey-green.
> No text, no letters, no words, no borders, no frame — full-bleed image
> only. Atmosphere of fog, candlelight, and dread; unsettling but not
> gory or graphic.

**Aspect ratio:** cards render around 3:4 (portrait) in the site's grid — generate portrait orientation for Archetypes, Hooks, and Victims; omens can be square (1:1), since they render as small icons/vignettes.

**Tone → light accent**, used throughout to tie a card's mood to its game-mechanical Tone:
- **Obsession** → sourceless amber/rust glow (candlelight, gaslight, embers)
- **Guilt** → oxblood-red undertone in the shadows
- **Dread** → cold pale moss-grey-green fog light, as if lit by moonlight through mist

---

## 1. Archetypes (20 images — front + turned per character)

Each Archetype is two-sided: the face-up side at setup, and the "turned"
side once its flip condition triggers mid-game. Generate **two** images per
character so the UI's flip animation has something to reveal — same person,
same setting, but the lighting shifts to the other side's Tone accent, and
the pose/expression shifts from composed to consumed.

### The Disgraced Alienist
*A doctor of the mind, struck from the registers, still practising on the desperate.*
- **Front (Obsession):** A gaunt Victorian alienist in a worn frock coat, seated at a cluttered desk stacked with case-notes and a phrenology skull, leaning intensely toward the viewer as if mid-diagnosis, sourceless amber candlelight from below catching his eyes.
- **Turned (Dread):** The same alienist alone in a dim consulting room at night, staring into a cracked mirror where the reflection doesn't quite match his posture, cold pale-green fog light bleeding in through a rain-streaked window.

### The Opium-Addled Poet
*Once the toast of the London reviews; now the Vale's resident ruin, seeing too much.*
- **Front (Guilt):** A wasted, elegant poet in a threadbare velvet coat, slumped in a fog-choked garret full of scattered manuscript pages, an oxblood-red ember glow from a dying pipe lighting his hollow face.
- **Turned (Dread):** The same poet walking alone on a moonlit moor path at night, looking back over his shoulder at something unseen in the drifting mist, cold grey-green light washing out his features.

### The Veiled Widow
*Married into the Vale; buried her husband within the year; never lifted the veil since.*
- **Front (Guilt):** A tall widow in full mourning dress and black lace veil, standing rigid before a grave marker in a fog-bound cemetery, an oxblood undertone in the folds of her skirts.
- **Turned (Obsession):** The same widow with her veil half-lifted in a candlelit parlour, one hand pressed to a locket, her visible eye lit by an intense amber glow that borders on manic.

### The Defrocked Priest
*Stripped of his collar for a scandal no two people describe the same way. Still keeps the keys to the chapel.*
- **Front (Guilt):** A priest in a plain black coat with no collar, standing in a candlelit, half-ruined chapel nave, oxblood-red light pooling in the shadows behind him.
- **Turned (Dread):** The same priest kneeling alone before a defaced altar at night, a ring of old iron keys in one outstretched hand, cold moonlit fog spilling through a broken stained-glass window.

### The Resurrection Man
*Digs for the anatomists by dark; knows the churchyard better than the sexton; owed money by respectable men.*
- **Front (Obsession):** A wiry grave-robber in muddy work clothes, crouched beside a half-opened grave with a lantern and spade, sourceless amber lantern-glow catching his intent, hungry expression.
- **Turned (Dread):** The same man frozen mid-stride in a churchyard at night, lantern dropped and guttering, staring at something in an open coffin just out of frame, cold pale fog-light washing the scene.

### The Inspector from the Yard
*Sent up from London on the night train; methodical, unwelcome, and not as untouched by the Vale as he pretends.*
- **Front (Obsession):** A stern Scotland Yard inspector in a dark overcoat and bowler hat, examining a piece of evidence by gaslight in a cramped office thick with pipe smoke, warm amber light.
- **Turned (Guilt):** The same inspector alone at night, burning a page from his own notebook over a candle flame, oxblood-red light flickering across a guilty, resolute face.

### The Medium's Apprentice
*Keeps the séance room; knows where the wires are hidden; knows which effects need no wires at all.*
- **Front (Dread):** A pale young apprentice in plain mourning-grey, arranging séance-table props — candles, a spirit trumpet, hidden wires — in a shadowed parlour, cold moonlit-fog light.
- **Turned (Guilt):** The same apprentice sitting at the séance table alone, hands flat on the wood, eyes rolled back mid-trance, an oxblood-red candlelight glow underlighting her face unnaturally.

### The Heir in Exile
*Left the Vale years ago under a cloud; returned the very week of the death, trailing debts and rumours.*
- **Front (Obsession):** A well-dressed but travel-worn young heir standing in the doorway of a grand manor house at dusk, trunk and letters at his feet, staring up at the facade with amber gaslight glow.
- **Turned (Guilt):** The same heir alone in a portrait gallery at night, standing before a family portrait with its face slashed out, oxblood-red candlelight in his hand.

### The Mudlark
*A river-scavenger, half-feral and sharp-eyed, who reads the Thames mud the way scholars read books.*
- **Front (Obsession):** A sharp-eyed young river-scavenger in ragged layered clothes, crouched at the Thames foreshore at low tide, clutching a found object close to her chest, warm amber dawn-light through fog.
- **Turned (Dread):** The same mudlark standing waist-deep in fog at the river's edge at night, looking down at something pale surfacing in the black water, cold moonlit-green light.

### The Undertaker's Daughter
*Raised among the coffins in her father's workshop; more at ease dressing the dead than talking to the living.*
- **Front (Dread):** A composed young woman in a plain dark dress, standing in a candlelit coffin-workshop full of wood shavings and funeral wreaths, cold pale fog-light through a high window.
- **Turned (Guilt):** The same woman alone at a preparation table at night, one hand resting on a shrouded form, oxblood-red candlelight catching an expression of quiet, terrible knowledge.

---

## 2. Hooks (4 images — one per mystery)

Portrait cover art for the scenario-select screen. No named characters —
these are scene-setting, establishing shots.

### The Séance Gone Wrong
> A darkened Victorian parlour mid-séance: an overturned circle of chairs, candles drowned in their own spilled wax, a lace tablecloth disturbed. The medium's empty chair sits closest to the viewer. Sourceless amber candlelight fighting against creeping cold fog at the room's edges.

### The Curse of the Manor
> The exterior of a vast, decaying gothic manor house at dusk, one wing's windows boarded and dark against the rest of the lit facade, fog pooling across an overgrown lawn, a single silhouette visible in a lit ground-floor window looking up at the sealed wing.

### The Ripper in the Fog
> A narrow fog-choked Victorian alley at night, gaslamp casting a weak amber pool of light, a spiral symbol scratched faintly into wet cobblestones in the foreground, the far end of the alley dissolving into impenetrable mist.

### The Débutante in the Thames
> A grand riverside embankment at night, the dark Thames reflecting distant gaslights, a pale ball gown floating half-submerged near the stone steps at the water's edge, fog rolling in off the river, no figure visible — only the gown.

---

## 3. Omens (31 images — small square vignettes)

These render small (icon-scale), so keep each to one clear, uncluttered
object against a dark, softly-vignetted background — a still-life detail,
not a full scene. Square (1:1). Use the master style block, but drop the
"single dominant light source" line in favor of: *tight still-life
composition, object centered, dramatic single-candle lighting, very dark
vignetted background.*

| Glyph | Title | Prompt (object description) |
|---|---|---|
| ☽ | A Tarnished Pocket Watch | A tarnished silver pocket watch lying open on dark velvet, hands stopped, faint condensation on the glass as if just breathed on. |
| ❧ | The Dead Songbird | A small songbird lying still in an ornate gilded cage, feathers slightly ruffled, cage door open. |
| ❈ | A Key Without a Lock | A single old iron key resting alone on a dusty windowsill, oddly warm-toned light on the metal. |
| ❦ | The Black Dog | A large black dog's silhouette standing at a foggy crossroads at night, eyes catching a faint amber glint. |
| ✧ | A Mourning Brooch | An oval mourning brooch woven from dark human hair, set in gold, resting on black lace. |
| ⁂ | The Extinguished Candle | A candle just snuffed out, a thin ribbon of smoke curling sideways against still air. |
| ☾ | A Child's Caul | A thin translucent membrane preserved in an antique glass jar on a shelf of curiosities. |
| ▦ | The Mirror, Draped | An ornate mirror draped in black mourning cloth, the drape slipping to reveal a sliver of dark reflective glass. |
| ☿ | A Vial of Black Bile | A small glass apothecary vial of shimmering black liquid, corked, on a physician's stained cloth. |
| § | The Hangman's Rope | A coil of rope cut into short lengths, tied with ribbon, displayed for sale on a market stall at dusk. |
| ◌ | A Wedding Ring, Swallowed | A gold wedding ring resting in a shallow surgical dish, faint pink water. |
| ✻ | The Moth Swarm | A cluster of pale moths circling a flameless, cold-glowing lamp in darkness. |
| ◈ | A Daguerreotype of the Dead | An antique daguerreotype photograph propped upright, the subject's eyes crudely painted open over closed lids. |
| ♆ | The Cracked Church Bell | A large cracked bronze church bell hanging still, faint frost on the crack line. |
| ✋ | A Left-Handed Glove | A single fine leather glove laid on a table, its partner absent, a scorch mark nearby. |
| ∞ | The Rat King | Several rats' tails knotted inextricably together, glimpsed in shadow at the edge of a cellar doorway. |
| ⚘ | A Sprig of Rue | A wilting sprig of rue herb pinned to dark fabric, edges browning. |
| ❄ | The Frozen Rose | A single red rose encased in delicate frost, blooming against a snow-dusted windowsill in wrong season. |
| ✉ | A Letter Edged in Black | A sealed mourning letter with a black-edged border, wax seal glistening as if still wet. |
| ☍ | The Second Shadow | A single candle casting two distinct shadows on a wall behind an empty chair. |
| ☻ | A Doll with Real Teeth | An old porcelain doll, cracked, its open mouth showing unsettlingly real human teeth. |
| ⋯ | The Salt Line, Broken | A neat line of salt across a wooden doorstep, broken by a single footprint through the middle. |
| ⚓ | A Ship in a Bottle | A miniature ship in a bottle, its sails rigged entirely in mourning black, resting on a captain's desk. |
| ☂ | The Weeping Wall | A damp plaster wall stain that resolves, at a glance, into the vague shape of a weeping face. |
| ⚰ | A Child-Sized Coffin | A small, plain child-sized coffin standing empty and upright in a shadowed workshop corner. |
| ✃ | A Lock of Hair, Cut While Sleeping | A lock of hair tied with thread around a mismatched ring, resting on a nightstand beside an unlit lamp. |
| ✝ | An Upturned Crucifix | A small crucifix nailed upside-down above a doorframe, dust undisturbed around it. |
| ‡ | A Mourning Card, Pre-Printed | A formal mourning card with ornate black border, the date-of-death line conspicuously blank. |
| ⚕ | A Trepanning Kit, One Instrument Short | An open Victorian surgical case lined in velvet, one tool-shaped indentation empty. |
| ↺ | A Music Box, Wound Backward | An ornate music box, lid open, its little dancer figure frozen mid-turn under dim light. |
| ⚜ | The Family Signet, Melted Down | A lump of melted gold on a jeweler's cloth, a fragment of an heraldic crest still legible in the metal. |
| ✙ | A Widow's Veil, Bought Too Soon | A black mourning veil laid across a dressmaker's counter, still folded in its tissue wrapping. |

---

## 4. Victims (4 images — one per hook)

The Victim's *name and specific facts* are invented live at the table each
session, so their face can't be pre-illustrated — instead, generate one
**obscured/veiled** portrait per hook that works as a mystery-cover image
regardless of what players later establish. Portrait orientation.

### Séance Victim
> A young woman's silhouette seated at a séance table, face turned fully away from the viewer, one hand resting palm-up on the table as if just released by others, candlelight guttering around her, cold fog beginning to pool at the floor.

### Manor Victim
> A young heir's figure standing in a grand, shadowed doorway of a sealed east wing, back to the viewer, one hand on the doorframe, warm gaslight from the hall behind them throwing a long shadow into the dark room ahead.

### Ripper Victim
> A young seamstress's figure walking away down a fog-choked alley at night, seen from behind, a basket of mending in one hand, gaslight behind her throwing her silhouette long across wet cobblestones scored with a faint spiral mark.

### Débutante Victim
> A young woman in a pale ball gown, seen from behind, standing at the edge of a dark riverside embankment at night looking out over the black Thames, gaslight behind her, the hem of her gown just touching the water.

---

## Notes on generating

- Do the **master style block** once as a saved system prompt / style if
  your tool supports it, so you're not retyping the palette 59 times.
- Generate front/turned Archetype pairs back-to-back so the model's
  "memory" of the character (via conversation context, if the tool
  supports iterative refinement) keeps the same face across both.
- If an image comes back too gory, graphic, or too literal (e.g. an
  actual corpse), that's a style-block failure, not a prompt failure —
  reinforce "unsettling but not gory or graphic" and re-roll rather than
  editing the specific prompt.
- 59 total images: 20 Archetypes + 4 Hooks + 31 Omens + 4 Victims.
