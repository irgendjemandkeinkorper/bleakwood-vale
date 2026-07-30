# Blackwood Vale — Gemini Image Prompt Sheet

Prompts for generating card art with Gemini's image model ("Nano Banana" /
Imagen). Two full styles are provided for every card — generate whichever
you prefer, or both, and use the in-app Gallery's style toggle to compare
them side by side once the files are in place.

- **Style A — Painterly Gothic Illustration.** Moody, desaturated oil
  painting, cinematic single-scene composition.
- **Style B — Tarot Gothic.** Flat-color, linework-accented, symmetrical
  Major-Arcana-style iconography.

## File naming & folder convention

The in-app Gallery (`js/ui/gallery.js`) looks for images at a predictable
path built from each card's title/id — **every prompt below states its
exact save path**, so you never need to compute this by hand. The pattern,
for reference:

```
art/images/<style>/<category>/<slug>.<ext>

<style>    painterly | tarot
<category> archetypes | hooks | omens | victims
<slug>     archetypes: "<role-slug>--front" or "<role-slug>--turned"
           hooks & victims: the hook id (seance | manor | ripper | debutante)
           omens: the omen title, slugified
<ext>      jpg — the Gallery also tries .jpeg, .png, .webp automatically,
           so any of those work if jpg isn't what you exported
```

Drop files at those paths (create the folders) and the Gallery picks them
up automatically — no code changes needed. Until a file exists, that slot
shows a plain text placeholder card instead, so the site never breaks.

---

## Style master blocks

Prepend the relevant block to every prompt below (or save it as a reusable
"style" in whatever tool you're using).

### Style A — Painterly Gothic Illustration

> Painterly gothic illustration, moody desaturated oil painting style, thick
> visible brushwork, dramatic chiaroscuro lighting, single dominant light
> source, heavy shadow. Victorian-era (1880s England) setting. Restrained,
> muted palette — near-black backgrounds, warm parchment cream, tarnished
> gold, oxblood red, deep moss and slate greens, pale moonlight grey-green.
> No text, no letters, no words, no borders, no frame — full-bleed image
> only. Atmosphere of fog, candlelight, and dread; unsettling but not gory
> or graphic. A single unified image only — one scene, one figure, not a
> repeating pattern, not a triptych, not tiled, not a grid or filmstrip of
> multiple panels or copies.

**Tone → light accent:** Obsession → sourceless amber/rust glow · Guilt →
oxblood-red undertone in the shadows · Dread → cold pale moss-grey-green
fog light.

### Style B — Tarot Gothic

> Gothic tarot-card illustration, in the tradition of hand-painted Major
> Arcana artwork — bold flat color fields with fine metallic linework
> detail, symmetrical/ceremonial frontal composition (like a tarot court
> card), the central figure or object rendered as a flat stylized icon
> rather than photorealistic, rich jewel-tone palette against a deep black
> or midnight background, small celestial motifs (a crescent moon or a
> star) worked into the composition as symbolism, not decoration. No
> literal card frame, no text, no numerals. Mood: mystical, ominous,
> ritualistic rather than cinematic. A single unified image only — one
> figure or object, not a repeating pattern, not a triptych, not tiled,
> not a grid or filmstrip of multiple panels or copies of the subject.

**Tone → symbolic motif:** Obsession → flame / coins / gilded halo · Guilt
→ red thread / wilting rose / broken chain · Dread → raven / crescent moon
/ fog rendered as flat linework.

**Aspect ratio:** portrait (3:4) for Archetypes, Hooks, and Victims;
square (1:1) for Omens, which render small in the Gallery.

---

## 1. Archetypes (64 images — front + turned, ×2 styles)

Each Archetype is two-sided: the face-up side at setup, and the "turned"
side once its flip condition triggers mid-game. Both styles get a front
and turned image, so the flip animation always has something new to
reveal — same character, but the mood/lighting/symbolism shifts to match
the other side's Tone.

### The Disgraced Alienist
*A doctor of the mind, struck from the registers, still practising on the desperate.*

- **Front (Obsession) — Style A.** A gaunt Victorian alienist in a worn frock coat, seated at a cluttered desk stacked with case-notes and a phrenology skull, leaning intensely toward the viewer as if mid-diagnosis, sourceless amber candlelight from below catching his eyes.
  Save as `art/images/painterly/archetypes/the-disgraced-alienist--front.jpg`
- **Front (Obsession) — Style B.** Frontal-facing tarot portrait, phrenology skull cradled in one hand like a scholar's orb, a ring of small candle-flames arcing above his head like a halo, deep black background, jewel-tone amber and brass linework.
  Save as `art/images/tarot/archetypes/the-disgraced-alienist--front.jpg`
- **Turned (Dread) — Style A.** The same alienist alone in a dim consulting room at night, staring into a cracked mirror where the reflection doesn't quite match his posture, cold pale-green fog light bleeding in through a rain-streaked window.
  Save as `art/images/painterly/archetypes/the-disgraced-alienist--turned.jpg`
- **Turned (Dread) — Style B.** The same figure now hooded in shadow, a cracked hand-mirror held up before his own face reflecting a second, subtly wrong face, a raven perched at his feet, cold jewel-tone teal/black palette with fine silver linework.
  Save as `art/images/tarot/archetypes/the-disgraced-alienist--turned.jpg`

### The Opium-Addled Poet
*Once the toast of the London reviews; now the Vale’s resident ruin, seeing too much.*

- **Front (Guilt) — Style A.** A wasted, elegant poet in a threadbare velvet coat, slumped in a fog-choked garret full of scattered manuscript pages, an oxblood-red ember glow from a dying pipe lighting his hollow face.
  Save as `art/images/painterly/archetypes/the-opium-addled-poet--front.jpg`
- **Front (Guilt) — Style B.** Frontal tarot portrait, quill in one hand and a wilting red rose in the other, a thin ribbon of pipe-smoke coiling into a halo shape behind his head, deep black background, oxblood and tarnished-gold linework.
  Save as `art/images/tarot/archetypes/the-opium-addled-poet--front.jpg`
- **Turned (Dread) — Style A.** The same poet walking alone on a moonlit moor path at night, looking back over his shoulder at something unseen in the drifting mist, cold grey-green light washing out his features.
  Save as `art/images/painterly/archetypes/the-opium-addled-poet--turned.jpg`
- **Turned (Dread) — Style B.** The same poet with eyes closed, a swirl of pale moths rising from an open book at his feet, a crescent moon rendered as flat linework behind his head, cold jewel-tone slate/black palette.
  Save as `art/images/tarot/archetypes/the-opium-addled-poet--turned.jpg`

### The Veiled Widow
*Married into the Vale; buried her husband within the year; never lifted the veil since.*

- **Front (Guilt) — Style A.** A tall widow in full mourning dress and black lace veil, standing rigid before a grave marker in a fog-bound cemetery, an oxblood undertone in the folds of her skirts.
  Save as `art/images/painterly/archetypes/the-veiled-widow--front.jpg`
- **Front (Guilt) — Style B.** Frontal tarot portrait in full mourning dress and veil, one hand resting on a locket shaped like a small sun, an hourglass with red sand at her feet, deep black background, oxblood and gold linework.
  Save as `art/images/tarot/archetypes/the-veiled-widow--front.jpg`
- **Turned (Obsession) — Style A.** The same widow with her veil half-lifted in a candlelit parlour, one hand pressed to a locket, her visible eye lit by an intense amber glow that borders on manic.
  Save as `art/images/painterly/archetypes/the-veiled-widow--turned.jpg`
- **Turned (Obsession) — Style B.** The same widow with veil lifted, a ring of candle-flames haloing her head, a mirror held in one hand catching her own too-bright eyes, warm amber jewel-tone palette.
  Save as `art/images/tarot/archetypes/the-veiled-widow--turned.jpg`

### The Defrocked Priest
*Stripped of his collar for a scandal no two people describe the same way. Still keeps the keys to the chapel.*

- **Front (Guilt) — Style A.** A priest in a plain black coat with no collar, standing in a candlelit, half-ruined chapel nave, oxblood-red light pooling in the shadows behind him.
  Save as `art/images/painterly/archetypes/the-defrocked-priest--front.jpg`
- **Front (Guilt) — Style B.** Frontal tarot portrait, an unlit censer in one hand, a broken rosary coiled at his feet like a red thread, no collar at his throat, deep black background, oxblood and gold linework.
  Save as `art/images/tarot/archetypes/the-defrocked-priest--front.jpg`
- **Turned (Dread) — Style A.** The same priest kneeling alone before a defaced altar at night, a ring of old iron keys in one outstretched hand, cold moonlit fog spilling through a broken stained-glass window.
  Save as `art/images/painterly/archetypes/the-defrocked-priest--turned.jpg`
- **Turned (Dread) — Style B.** The same priest with an iron key held aloft, a raven perched atop a shattered halo-shaped stained-glass window behind his head, cold jewel-tone teal/black palette.
  Save as `art/images/tarot/archetypes/the-defrocked-priest--turned.jpg`

### The Resurrection Man
*Digs for the anatomists by dark; knows the churchyard better than the sexton; owed money by respectable men.*

- **Front (Obsession) — Style A.** A wiry grave-robber in muddy work clothes, crouched beside a half-opened grave with a lantern and spade, sourceless amber lantern-glow catching his intent, hungry expression.
  Save as `art/images/painterly/archetypes/the-resurrection-man--front.jpg`
- **Front (Obsession) — Style B.** Frontal tarot portrait, a lantern held aloft like a torch of judgement, coins spilling from one open palm, deep black background, amber and brass linework.
  Save as `art/images/tarot/archetypes/the-resurrection-man--front.jpg`
- **Turned (Dread) — Style A.** The same man frozen mid-stride in a churchyard at night, lantern dropped and guttering, staring at something in an open coffin just out of frame, cold pale fog-light washing the scene.
  Save as `art/images/painterly/archetypes/the-resurrection-man--turned.jpg`
- **Turned (Dread) — Style B.** The same man with a spade planted at his feet like a scepter, an open grave rendered as a flat black crescent behind him, a raven on his shoulder, cold jewel-tone palette.
  Save as `art/images/tarot/archetypes/the-resurrection-man--turned.jpg`

### The Inspector from the Yard
*Sent up from London on the night train; methodical, unwelcome, and not as untouched by the Vale as he pretends.*

- **Front (Obsession) — Style A.** A stern Scotland Yard inspector in a dark overcoat and bowler hat, examining a piece of evidence by gaslight in a cramped office thick with pipe smoke, warm amber light.
  Save as `art/images/painterly/archetypes/the-inspector-from-the-yard--front.jpg`
- **Front (Obsession) — Style B.** Frontal tarot portrait in overcoat and bowler hat, a magnifying glass held up like a sun-disc, a set of scales balanced at his feet, deep black background, amber and brass linework.
  Save as `art/images/tarot/archetypes/the-inspector-from-the-yard--front.jpg`
- **Turned (Guilt) — Style A.** The same inspector alone at night, burning a page from his own notebook over a candle flame, oxblood-red light flickering across a guilty, resolute face.
  Save as `art/images/painterly/archetypes/the-inspector-from-the-yard--turned.jpg`
- **Turned (Guilt) — Style B.** The same inspector burning a torn page in one hand, the flame's smoke coiling into a chain shape, cold oxblood/black palette.
  Save as `art/images/tarot/archetypes/the-inspector-from-the-yard--turned.jpg`

### The Medium’s Apprentice
*Keeps the séance room; knows where the wires are hidden; knows which effects need no wires at all.*

- **Front (Dread) — Style A.** A pale young apprentice in plain mourning-grey, arranging séance-table props — candles, a spirit trumpet, hidden wires — in a shadowed parlour, cold moonlit-fog light.
  Save as `art/images/painterly/archetypes/the-mediums-apprentice--front.jpg`
- **Front (Dread) — Style B.** Frontal tarot portrait, hands posed in a spirit-summoning gesture, a spirit trumpet and hidden wire coiled at her feet, a crescent moon halo, cold jewel-tone slate/black palette.
  Save as `art/images/tarot/archetypes/the-mediums-apprentice--front.jpg`
- **Turned (Guilt) — Style A.** The same apprentice sitting at the séance table alone, hands flat on the wood, eyes rolled back mid-trance, an oxblood-red candlelight glow underlighting her face unnaturally.
  Save as `art/images/painterly/archetypes/the-mediums-apprentice--turned.jpg`
- **Turned (Guilt) — Style B.** The same apprentice eyes rolled back in trance, a red thread spooling from her open mouth into a spiral at her feet, oxblood and gold linework.
  Save as `art/images/tarot/archetypes/the-mediums-apprentice--turned.jpg`

### The Heir in Exile
*Left the Vale years ago under a cloud; returned the very week of the death, trailing debts and rumours.*

- **Front (Obsession) — Style A.** A well-dressed but travel-worn young heir standing in the doorway of a grand manor house at dusk, trunk and letters at his feet, staring up at the facade with amber gaslight glow.
  Save as `art/images/painterly/archetypes/the-heir-in-exile--front.jpg`
- **Front (Obsession) — Style B.** Frontal tarot portrait, a house key held aloft like a scepter, a stack of unopened letters at his feet, an amber halo of candle-flame, brass linework.
  Save as `art/images/tarot/archetypes/the-heir-in-exile--front.jpg`
- **Turned (Guilt) — Style A.** The same heir alone in a portrait gallery at night, standing before a family portrait with its face slashed out, oxblood-red candlelight in his hand.
  Save as `art/images/painterly/archetypes/the-heir-in-exile--turned.jpg`
- **Turned (Guilt) — Style B.** The same heir standing before a slashed portrait rendered as a flat void behind him, a single coin held in a closed fist, cold oxblood/black palette.
  Save as `art/images/tarot/archetypes/the-heir-in-exile--turned.jpg`

### The Mudlark
*A river-scavenger, half-feral and sharp-eyed, who reads the Thames mud the way scholars read books — and sells what she finds to whoever pays first.*

- **Front (Obsession) — Style A.** A sharp-eyed young river-scavenger in ragged layered clothes, crouched at the Thames foreshore at low tide, clutching a found object close to her chest, warm amber dawn-light through fog.
  Save as `art/images/painterly/archetypes/the-mudlark--front.jpg`
- **Front (Obsession) — Style B.** Frontal tarot portrait, a found object cradled to her chest like a relic, the Thames rendered as a flat wavy line at her feet, amber dawn-toned linework.
  Save as `art/images/tarot/archetypes/the-mudlark--front.jpg`
- **Turned (Dread) — Style A.** The same mudlark standing waist-deep in fog at the river’s edge at night, looking down at something pale surfacing in the black water, cold moonlit-green light.
  Save as `art/images/painterly/archetypes/the-mudlark--turned.jpg`
- **Turned (Dread) — Style B.** The same mudlark waist-deep in stylized black water, a pale hand-shape breaking the surface at her feet, a raven overhead, cold jewel-tone palette.
  Save as `art/images/tarot/archetypes/the-mudlark--turned.jpg`

### The Undertaker’s Daughter
*Raised among the coffins in her father’s workshop; more at ease dressing the dead than talking to the living.*

- **Front (Dread) — Style A.** A composed young woman in a plain dark dress, standing in a candlelit coffin-workshop full of wood shavings and funeral wreaths, cold pale fog-light through a high window.
  Save as `art/images/painterly/archetypes/the-undertakers-daughter--front.jpg`
- **Front (Dread) — Style B.** Frontal tarot portrait, a funeral wreath held like a halo behind her head, wood-shaving curls scattered at her feet, cold jewel-tone slate/black palette.
  Save as `art/images/tarot/archetypes/the-undertakers-daughter--front.jpg`
- **Turned (Guilt) — Style A.** The same woman alone at a preparation table at night, one hand resting on a shrouded form, oxblood-red candlelight catching an expression of quiet, terrible knowledge.
  Save as `art/images/painterly/archetypes/the-undertakers-daughter--turned.jpg`
- **Turned (Guilt) — Style B.** The same woman with one hand resting on a shrouded form rendered as a flat white shape, a red thread stitched through her other palm, oxblood and gold linework.
  Save as `art/images/tarot/archetypes/the-undertakers-daughter--turned.jpg`

### The Blind Fortune-Teller
*Reads palms and tea-leaves at the market cross for pennies; lost her sight nine years ago, and swears she has seen more clearly since.*

- **Front (Dread) — Style A.** A blind fortune-teller in a threadbare shawl, seated at a market stall lined with tea-leaves and a chipped crystal, her clouded eyes turned unerringly toward the viewer as if she can see them anyway, cold pale fog-light at the market's edge.
  Save as `art/images/painterly/archetypes/the-blind-fortune-teller--front.jpg`
- **Front (Dread) — Style B.** Frontal tarot portrait, clouded blind eyes facing forward unerringly, tea-leaves and a cracked crystal ball held before her like an offering, a crescent moon halo, cold jewel-tone slate/black palette.
  Save as `art/images/tarot/archetypes/the-blind-fortune-teller--front.jpg`
- **Turned (Obsession) — Style A.** The same fortune-teller alone by candlelight, counting coins into neat towers on her table, her sightless gaze fixed on nothing, an unsettling private smile, warm amber candle-glow.
  Save as `art/images/painterly/archetypes/the-blind-fortune-teller--turned.jpg`
- **Turned (Obsession) — Style B.** The same seer with coins stacked in neat towers at her feet, a flame-motif halo, warm amber jewel-tone palette, her blind eyes catching the light strangely.
  Save as `art/images/tarot/archetypes/the-blind-fortune-teller--turned.jpg`

### The Pawnbroker
*Keeps the shop beneath the three brass balls; knows exactly what every family in the Vale has quietly sold him, and precisely what it means that they did.*

- **Front (Obsession) — Style A.** A shrewd pawnbroker in a waistcoat and spectacles, standing behind a counter crowded with unclaimed rings, watches, and lockets, sourceless amber gaslight from a hanging lamp.
  Save as `art/images/painterly/archetypes/the-pawnbroker--front.jpg`
- **Front (Obsession) — Style B.** Frontal tarot portrait, a scale of judgement balanced in one hand, unclaimed rings and watches arranged like offerings at his feet, amber and brass linework, deep black background.
  Save as `art/images/tarot/archetypes/the-pawnbroker--front.jpg`
- **Turned (Guilt) — Style A.** The same pawnbroker alone after closing, turning a single item over and over in his hands under a guttering candle, oxblood-red light, his expression unreadable.
  Save as `art/images/painterly/archetypes/the-pawnbroker--turned.jpg`
- **Turned (Guilt) — Style B.** The same pawnbroker with a single locket held to his chest, a red-thread motif winding around his other wrist, oxblood and gold linework, deep black background.
  Save as `art/images/tarot/archetypes/the-pawnbroker--turned.jpg`

### The Travelling Illusionist
*Performs impossible things nightly under canvas and gaslight; has started to suspect that one or two of his tricks have stopped being tricks.*

- **Front (Obsession) — Style A.** A sharp-suited stage illusionist mid-flourish under canvas and gaslight, cards fanned impossibly in one hand, sourceless amber spotlight-glow, a knowing showman's smile.
  Save as `art/images/painterly/archetypes/the-travelling-illusionist--front.jpg`
- **Front (Obsession) — Style B.** Frontal tarot portrait, cards fanned in one hand like a sunburst, a rabbit-and-hat motif at his feet rendered as flat icon, amber and brass linework, deep black background.
  Save as `art/images/tarot/archetypes/the-travelling-illusionist--front.jpg`
- **Turned (Dread) — Style A.** The same illusionist alone backstage at night, staring at a trick prop that has done something it was never built to do, cold pale fog-light, his showman's composure gone.
  Save as `art/images/painterly/archetypes/the-travelling-illusionist--turned.jpg`
- **Turned (Dread) — Style B.** The same illusionist with his own reflection stepping out of a mirror behind him, unwatched, a crescent moon and raven motif, cold jewel-tone slate/black palette.
  Save as `art/images/tarot/archetypes/the-travelling-illusionist--turned.jpg`

### The Lady’s Companion
*Paid to be present and not to be noticed; has spent a decade in rooms where the truth was spoken as though she wasn’t in them.*

- **Front (Guilt) — Style A.** A plainly-dressed lady’s companion standing a precise half-step behind an empty ornate chair in a drawing room, hands folded, eyes lowered, oxblood-red undertone in the shadows.
  Save as `art/images/painterly/archetypes/the-ladys-companion--front.jpg`
- **Front (Guilt) — Style B.** Frontal tarot portrait, standing precisely half a step behind an ornate empty chair rendered as a flat throne shape, oxblood and gold linework, deep black background.
  Save as `art/images/tarot/archetypes/the-ladys-companion--front.jpg`
- **Turned (Dread) — Style A.** The same companion alone at a writing desk late at night, pen paused mid-sentence over a letter she is visibly deciding whether to send, cold pale fog-light through a curtained window.
  Save as `art/images/painterly/archetypes/the-ladys-companion--turned.jpg`
- **Turned (Dread) — Style B.** The same companion with a sealed letter held against her chest, a raven perched on the chair behind her, cold jewel-tone slate/black palette.
  Save as `art/images/tarot/archetypes/the-ladys-companion--turned.jpg`

### The Penny Press Reporter
*Chases the grimmest story in the Vale with an appetite she tells herself is only professional; has not yet found the line she won’t cross for a byline.*

- **Front (Obsession) — Style A.** A sharp-eyed young reporter in a rumpled coat, notebook and pencil in hand, leaning in at the edge of a crime scene’s lamplight, warm amber gaslight, an expression of hungry professional interest.
  Save as `art/images/painterly/archetypes/the-penny-press-reporter--front.jpg`
- **Front (Obsession) — Style B.** Frontal tarot portrait, notebook and pencil held aloft like a scribe’s tools, a printing-press motif at her feet, amber and brass linework, deep black background.
  Save as `art/images/tarot/archetypes/the-penny-press-reporter--front.jpg`
- **Turned (Guilt) — Style A.** The same reporter alone at a print-shop desk at night, staring at a headline she has just written and is now afraid to run, oxblood-red light from a single desk lamp.
  Save as `art/images/painterly/archetypes/the-penny-press-reporter--turned.jpg`
- **Turned (Guilt) — Style B.** The same reporter with a torn newspaper page in one hand, a red-thread motif trailing from the print, oxblood and gold linework, deep black background.
  Save as `art/images/tarot/archetypes/the-penny-press-reporter--turned.jpg`

### The Climbing Boy
*A chimney sweep’s apprentice, small enough to fit where grown men cannot; has been inside the flues of every great house in the Vale, and seen most of them from the one place nobody thinks to hide anything.*

- **Front (Dread) — Style A.** A soot-streaked climbing boy no more than ten, wedged halfway up a narrow brick chimney flue, one eye visible in a shaft of light from below, cold pale fog-grey light.
  Save as `art/images/painterly/archetypes/the-climbing-boy--front.jpg`
- **Front (Dread) — Style B.** Frontal tarot portrait, small figure framed inside a flat chimney-flue shape like a keyhole, a single eye motif, cold jewel-tone slate/black palette.
  Save as `art/images/tarot/archetypes/the-climbing-boy--front.jpg`
- **Turned (Guilt) — Style A.** The same boy sitting on a rooftop at dawn, looking down through a chimney pot at something in the room below that he cannot un-see, oxblood-red dawn light struggling through smoke.
  Save as `art/images/painterly/archetypes/the-climbing-boy--turned.jpg`
- **Turned (Guilt) — Style B.** The same climbing boy seated on a rooftop with a coin held tightly in one sooty fist, oxblood and gold linework, deep black background.
  Save as `art/images/tarot/archetypes/the-climbing-boy--turned.jpg`

---

## 2. Hooks (24 images — one per mystery, ×2 styles)

Portrait cover art for the scenario-select screen. No named characters —
these are scene-setting, establishing shots.

### The Séance Gone Wrong
- **Style A.** A darkened Victorian parlour mid-séance: an overturned circle of chairs, candles drowned in their own spilled wax, a lace tablecloth disturbed. The medium's empty chair sits closest to the viewer. Sourceless amber candlelight fighting against creeping cold fog at the room's edges.
  Save as `art/images/painterly/hooks/seance.jpg`
- **Style B.** A gothic tarot card composition: an overturned circle of chairs arranged like the rays of a sun around an empty central chair, candle-flames haloing the scene from above, deep black background, oxblood/gold linework, no figures.
  Save as `art/images/tarot/hooks/seance.jpg`

### The Curse of the Manor
- **Style A.** The exterior of a vast, decaying gothic manor house at dusk, one wing's windows boarded and dark against the rest of the lit facade, fog pooling across an overgrown lawn, a single silhouette visible in a lit ground-floor window looking up at the sealed wing.
  Save as `art/images/painterly/hooks/manor.jpg`
- **Style B.** A gothic tarot card composition: a symmetrical manor facade with one wing rendered as a flat black void, a single lit window shaped like an eye, ivy linework framing the corners, deep black background, amber/gold linework.
  Save as `art/images/tarot/hooks/manor.jpg`

### The Ripper in the Fog
- **Style A.** A narrow fog-choked Victorian alley at night, gaslamp casting a weak amber pool of light, a spiral symbol scratched faintly into wet cobblestones in the foreground, the far end of the alley dissolving into impenetrable mist.
  Save as `art/images/painterly/hooks/ripper.jpg`
- **Style B.** A gothic tarot card composition: a spiral symbol at the center of a fog-flat alley, a gaslamp haloing it from above like a sun, a raven perched at the edge, deep black background, oxblood/silver linework.
  Save as `art/images/tarot/hooks/ripper.jpg`

### The Débutante in the Thames
- **Style A.** A grand riverside embankment at night, the dark Thames reflecting distant gaslights, a pale ball gown floating half-submerged near the stone steps at the water’s edge, fog rolling in off the river, no figure visible — only the gown.
  Save as `art/images/painterly/hooks/debutante.jpg`
- **Style B.** A gothic tarot card composition: a pale ball gown floating on a flat black river rendered as rippling linework, a crescent moon haloing the scene, deep black background, teal/gold linework.
  Save as `art/images/tarot/hooks/debutante.jpg`

### The Cell That Was Never Opened
- **Style A.** The exterior of a grim stone asylum on a fog-bound moor at dusk, one barred cell window lit from within though the door beside it stands slightly ajar, a frost-covered kitchen garden visible beyond the wall.
  Save as `art/images/painterly/hooks/asylum.jpg`
- **Style B.** A gothic tarot card composition: a barred cell window and an ajar door rendered as flat symmetrical shapes, a frost-covered garden plot beyond, deep black background, silver/slate linework.
  Save as `art/images/tarot/hooks/asylum.jpg`

### The Soprano’s Final Curtain
- **Style A.** The interior of a grand, empty opera house after the curtain has fallen, a single spotlight still burning on an empty stage, a dropped fan or glove visible in the wings.
  Save as `art/images/painterly/hooks/opera.jpg`
- **Style B.** A gothic tarot card composition: an empty stage under a single spotlight rendered as a radiant halo, a dropped glove at its edge, deep black background, gold/oxblood linework.
  Save as `art/images/tarot/hooks/opera.jpg`

### The Christmas Poisoning
- **Style A.** A grand dining table set for twelve, holly and candles down its length, one place setting conspicuously undisturbed, its chair pushed back, firelight and cold blue window-light mixing.
  Save as `art/images/painterly/hooks/yuletide.jpg`
- **Style B.** A gothic tarot card composition: a long table set symmetrically with twelve place-settings, one chair pushed back and empty, holly-motif border, deep black background, oxblood/gold linework.
  Save as `art/images/tarot/hooks/yuletide.jpg`

### The Duel That Wasn’t Fought
- **Style A.** A misty dueling ground at dawn, two long shadows cast toward each other across frosted grass, a single dropped pistol visible in the foreground, cold pale light breaking through fog.
  Save as `art/images/painterly/hooks/duel.jpg`
- **Style B.** A gothic tarot card composition: two long shadows meeting across a flat frosted field, a dropped pistol rendered as a small icon between them, deep black background, silver/oxblood linework.
  Save as `art/images/tarot/hooks/duel.jpg`

### The Bride Who Never Arrived
- **Style A.** The dim stone stairway descending from a church nave into its crypt, a trail of white gown-lace visible on the steps, distant organ-lit doorway glowing warm above.
  Save as `art/images/painterly/hooks/bride.jpg`
- **Style B.** A gothic tarot card composition: a stairway descending into darkness rendered as flat receding steps, a trail of lace draped across them, a warm doorway glow above, deep black background, gold/teal linework.
  Save as `art/images/tarot/hooks/bride.jpg`

### The Keeper’s Drowned Light
- **Style A.** A lone lighthouse on a rocky point at night, its lamp burning an unnatural pale colour against the storm-dark sky, waves crashing at its base, no figure visible in the lamp room.
  Save as `art/images/painterly/hooks/lighthouse.jpg`
- **Style B.** A gothic tarot card composition: a lighthouse tower rendered as a flat vertical beam of light against a dark sea, a crescent moon behind it, deep black background, silver/teal linework.
  Save as `art/images/tarot/hooks/lighthouse.jpg`

### The Workhouse Reckoning
- **Style A.** A bleak workhouse stairwell, worn stone steps descending into shadow, a single small shoe left on one step, cold grey light from a high barred window.
  Save as `art/images/painterly/hooks/workhouse.jpg`
- **Style B.** A gothic tarot card composition: a stairwell rendered as flat descending steps, a single small shoe icon on one step, a barred-window motif above, deep black background, slate/gold linework.
  Save as `art/images/tarot/hooks/workhouse.jpg`

### The Death Beneath the Big Top
- **Style A.** The inside of an empty big-top tent at night, a single aerial wire hanging slack from the rigging high above, sawdust ring below lit by one remaining lamp.
  Save as `art/images/painterly/hooks/circus.jpg`
- **Style B.** A gothic tarot card composition: a slack wire hanging from a flat rigging shape above an empty ring, a single lamp glow, deep black background, gold/oxblood linework.
  Save as `art/images/tarot/hooks/circus.jpg`

---

## 3. Omens (88 images — small square vignettes, ×2 styles)

These render small (icon-scale) in both the Omen Row and the Gallery, so
keep each to one clear, uncluttered subject. Square (1:1).

| Glyph | Title | Style A prompt | Style B prompt | Save as (base name) |
|---|---|---|---|---|
| ☽ | A Tarnished Pocket Watch | A tarnished silver pocket watch lying open on dark velvet, hands stopped, faint condensation on the glass as if just breathed on. | A flat gothic-tarot icon of an open pocket watch with stopped hands, a crescent moon motif tucked in one corner, silver linework on a deep black background. | `a-tarnished-pocket-watch` |
| ❧ | The Dead Songbird | A small songbird lying still in an ornate gilded cage, feathers slightly ruffled, cage door open. | A flat gothic-tarot icon of a songbird inside an open gilded cage, a single falling-feather motif, gold linework on a deep black background. | `the-dead-songbird` |
| ❈ | A Key Without a Lock | A single old iron key resting alone on a dusty windowsill, oddly warm-toned light on the metal. | A flat gothic-tarot icon of a single ornate key, a small star motif in one corner, brass linework on a deep black background. | `a-key-without-a-lock` |
| ❦ | The Black Dog | A large black dog's silhouette standing at a foggy crossroads at night, eyes catching a faint amber glint. | A flat gothic-tarot icon of a dog silhouette standing at a crossroads shape, a crescent moon motif, silver linework on a deep black background. | `the-black-dog` |
| ✧ | A Mourning Brooch | An oval mourning brooch woven from dark human hair, set in gold, resting on black lace. | A flat gothic-tarot icon of an oval brooch with woven-hair detail, a small flame motif, gold linework on a deep black background. | `a-mourning-brooch` |
| ⁂ | The Extinguished Candle | A candle just snuffed out, a thin ribbon of smoke curling sideways against still air. | A flat gothic-tarot icon of a snuffed candle with a curling smoke line, a star motif, silver linework on a deep black background. | `the-extinguished-candle` |
| ☾ | A Child’s Caul | A thin translucent membrane preserved in an antique glass jar on a shelf of curiosities. | A flat gothic-tarot icon of a glass jar holding a pale membrane, a crescent moon motif, teal linework on a deep black background. | `a-childs-caul` |
| ▦ | The Mirror, Draped | An ornate mirror draped in black mourning cloth, the drape slipping to reveal a sliver of dark reflective glass. | A flat gothic-tarot icon of an oval mirror half-draped in cloth, a star motif, silver linework on a deep black background. | `the-mirror-draped` |
| ☿ | A Vial of Black Bile | A small glass apothecary vial of shimmering black liquid, corked, on a physician's stained cloth. | A flat gothic-tarot icon of a corked apothecary vial, a small flame motif, oxblood linework on a deep black background. | `a-vial-of-black-bile` |
| § | The Hangman’s Rope | A coil of rope cut into short lengths, tied with ribbon, displayed for sale on a market stall at dusk. | A flat gothic-tarot icon of coiled rope tied in a loop, a star motif, brass linework on a deep black background. | `the-hangmans-rope` |
| ◌ | A Wedding Ring, Swallowed | A gold wedding ring resting in a shallow surgical dish, faint pink water. | A flat gothic-tarot icon of a ring resting in a shallow dish, a crescent moon motif, gold linework on a deep black background. | `a-wedding-ring-swallowed` |
| ✻ | The Moth Swarm | A cluster of pale moths circling a flameless, cold-glowing lamp in darkness. | A flat gothic-tarot icon of moths circling a flameless lamp shape, a star motif, silver linework on a deep black background. | `the-moth-swarm` |
| ◈ | A Daguerreotype of the Dead | An antique daguerreotype photograph propped upright, the subject's eyes crudely painted open over closed lids. | A flat gothic-tarot icon of an upright oval photograph frame with painted-open eyes, a star motif, oxblood linework on a deep black background. | `a-daguerreotype-of-the-dead` |
| ♆ | The Cracked Church Bell | A large cracked bronze church bell hanging still, faint frost on the crack line. | A flat gothic-tarot icon of a bronze bell with a jagged crack, a crescent moon motif, brass linework on a deep black background. | `the-cracked-church-bell` |
| ✋ | A Left-Handed Glove | A single fine leather glove laid on a table, its partner absent, a scorch mark nearby. | A flat gothic-tarot icon of a single glove with a scorch mark, a star motif, oxblood linework on a deep black background. | `a-left-handed-glove` |
| ∞ | The Rat King | Several rats' tails knotted inextricably together, glimpsed in shadow at the edge of a cellar doorway. | A flat gothic-tarot icon of knotted tails forming an infinity loop, a star motif, silver linework on a deep black background. | `the-rat-king` |
| ⚘ | A Sprig of Rue | A wilting sprig of rue herb pinned to dark fabric, edges browning. | A flat gothic-tarot icon of a wilting herb sprig, a crescent moon motif, teal linework on a deep black background. | `a-sprig-of-rue` |
| ❄ | The Frozen Rose | A single red rose encased in delicate frost, blooming against a snow-dusted windowsill in wrong season. | A flat gothic-tarot icon of a frost-rimed rose, a star motif, silver and teal linework on a deep black background. | `the-frozen-rose` |
| ✉ | A Letter Edged in Black | A sealed mourning letter with a black-edged border, wax seal glistening as if still wet. | A flat gothic-tarot icon of a sealed black-bordered letter, a star motif, gold linework on a deep black background. | `a-letter-edged-in-black` |
| ☍ | The Second Shadow | A single candle casting two distinct shadows on a wall behind an empty chair. | A flat gothic-tarot icon of a single candle casting two shadow shapes, a crescent moon motif, silver linework on a deep black background. | `the-second-shadow` |
| ☻ | A Doll with Real Teeth | An old porcelain doll, cracked, its open mouth showing unsettlingly real human teeth. | A flat gothic-tarot icon of a cracked porcelain doll face with an open mouth, a star motif, oxblood linework on a deep black background. | `a-doll-with-real-teeth` |
| ⋯ | The Salt Line, Broken | A neat line of salt across a wooden doorstep, broken by a single footprint through the middle. | A flat gothic-tarot icon of a broken dotted line across a doorstep shape, a star motif, silver linework on a deep black background. | `the-salt-line-broken` |
| ⚓ | A Ship in a Bottle | A miniature ship in a bottle, its sails rigged entirely in mourning black, resting on a captain’s desk. | A flat gothic-tarot icon of a bottled ship with black sails, a crescent moon motif, gold linework on a deep black background. | `a-ship-in-a-bottle` |
| ☂ | The Weeping Wall | A damp plaster wall stain that resolves, at a glance, into the vague shape of a weeping face. | A flat gothic-tarot icon of a damp-stained wall shaped like a weeping face, a star motif, teal linework on a deep black background. | `the-weeping-wall` |
| ⚰ | A Child-Sized Coffin | A small, plain child-sized coffin standing empty and upright in a shadowed workshop corner. | A flat gothic-tarot icon of a small upright coffin, a crescent moon motif, silver linework on a deep black background. | `a-child-sized-coffin` |
| ✃ | A Lock of Hair, Cut While Sleeping | A lock of hair tied with thread around a mismatched ring, resting on a nightstand beside an unlit lamp. | A flat gothic-tarot icon of a hair-lock tied around a mismatched ring, a star motif, gold linework on a deep black background. | `a-lock-of-hair-cut-while-sleeping` |
| ✝ | An Upturned Crucifix | A small crucifix nailed upside-down above a doorframe, dust undisturbed around it. | A flat gothic-tarot icon of an inverted crucifix above a doorframe shape, a star motif, oxblood linework on a deep black background. | `an-upturned-crucifix` |
| ‡ | A Mourning Card, Pre-Printed | A formal mourning card with ornate black border, the date-of-death line conspicuously blank. | A flat gothic-tarot icon of a black-bordered card with a blank date line, a star motif, gold linework on a deep black background. | `a-mourning-card-pre-printed` |
| ⚕ | A Trepanning Kit, One Instrument Short | An open Victorian surgical case lined in velvet, one tool-shaped indentation empty. | A flat gothic-tarot icon of an open velvet-lined surgical case with one empty slot, a star motif, silver linework on a deep black background. | `a-trepanning-kit-one-instrument-short` |
| ↺ | A Music Box, Wound Backward | An ornate music box, lid open, its little dancer figure frozen mid-turn under dim light. | A flat gothic-tarot icon of an open music box with a frozen dancer figure, a crescent moon motif, gold linework on a deep black background. | `a-music-box-wound-backward` |
| ⚜ | The Family Signet, Melted Down | A lump of melted gold on a jeweler’s cloth, a fragment of an heraldic crest still legible in the metal. | A flat gothic-tarot icon of a melted gold lump with a faint crest fragment, a star motif, brass linework on a deep black background. | `the-family-signet-melted-down` |
| ✙ | A Widow’s Veil, Bought Too Soon | A black mourning veil laid across a dressmaker’s counter, still folded in its tissue wrapping. | A flat gothic-tarot icon of a folded black veil, a crescent moon motif, silver linework on a deep black background. | `a-widows-veil-bought-too-soon` |
| ⚗ | An Alembic, Still Warm | A glass alembic still faintly warm to the touch, resting on a stained workbench, a single drop clinging to its spout. | A flat gothic-tarot icon of a glass alembic with a single droplet at its spout, a star motif, silver linework on a deep black background. | `an-alembic-still-warm` |
| ✎ | A Diary Entry, Torn Free | A loose diary page torn along its binding, handwriting trailing off mid-sentence, ink smudged as if closed too soon. | A flat gothic-tarot icon of a torn diary page with trailing handwriting, a star motif, gold linework on a deep black background. | `a-diary-entry-torn-free` |
| ⌛ | An Hourglass, Running Backward | An ornate hourglass with sand visibly rising against gravity into its upper chamber, brass fittings catching low light. | A flat gothic-tarot icon of an hourglass with sand rising upward, a crescent moon motif, silver linework on a deep black background. | `an-hourglass-running-backward` |
| ⚱ | A Funerary Urn, Too Light | A carved stone funerary urn held aloft in one hand, its lightness suggested by the ease of the grip, dust motes catching candlelight. | A flat gothic-tarot icon of a funerary urn, a star motif, brass linework on a deep black background. | `a-funerary-urn-too-light` |
| ☄ | A Falling Star, Witnessed by Three | A streak of falling light captured mid-fall over a dark treeline, three distant silhouetted figures pointing in three different directions. | A flat gothic-tarot icon of a falling star trailing light, a star motif, silver linework on a deep black background. | `a-falling-star-witnessed-by-three` |
| ✾ | A Black Orchid, Hand-Delivered | A single black orchid resting on a doorstep, thorned stem deliberately left intact, no card in sight. | A flat gothic-tarot icon of a black orchid with visible thorns, a star motif, gold linework on a deep black background. | `a-black-orchid-hand-delivered` |
| ❉ | A Firework That Would Not Finish | A firework frozen mid-burst against a night sky, its light lingering unnaturally long, faint trails still falling. | A flat gothic-tarot icon of a firework burst rendered as flat radiating lines, a star motif, gold linework on a deep black background. | `a-firework-that-would-not-finish` |
| ⚖ | A Set of Scales, One Side Empty | An old brass set of scales, one pan weighted with a small dark object, the other conspicuously empty and still swinging. | A flat gothic-tarot icon of a set of scales with one pan empty, a star motif, brass linework on a deep black background. | `a-set-of-scales-one-side-empty` |
| ☨ | A Grave Marker, Name Filed Off | A weathered gravestone with its inscription filed smooth, only a faint ghost of letter-shapes remaining in the stone. | A flat gothic-tarot icon of a gravestone with a blank smoothed face, a crescent moon motif, silver linework on a deep black background. | `a-grave-marker-name-filed-off` |
| ⛧ | A Circle, Salted and Broken | A ring of salt on a wooden floor, broken at one point by a deliberate sweep, candle stubs at its edge. | A flat gothic-tarot icon of a broken salt circle, a star motif, silver linework on a deep black background. | `a-circle-salted-and-broken` |
| ⚚ | A Physician’s Cane, Silver-Topped | A silver-topped physician’s cane leaning against a chair, its hollow shaft slightly ajar at the head, revealing a dark cavity. | A flat gothic-tarot icon of a silver-topped cane with a hollow revealed at its head, a star motif, silver linework on a deep black background. | `a-physicians-cane-silver-topped` |
| ✵ | A Star Chart, One Star Added by Hand | An antique printed star chart with one additional star added in hand-inked pencil, unlike any printed constellation around it. | A flat gothic-tarot icon of a star chart with one hand-drawn star among printed ones, a star motif, gold linework on a deep black background. | `a-star-chart-one-star-added-by-hand` |

Save Style A as `art/images/painterly/omens/<slug>.jpg` and Style B as
`art/images/tarot/omens/<slug>.jpg`, using the slug from the table above.

---

## 4. Victims (24 images — one per hook, ×2 styles)

The Victim's *name and specific facts* are invented live at the table each
session, so their face can't be pre-illustrated — instead, generate one
**obscured/veiled** image per hook per style that works as a mystery-cover
image regardless of what players later establish. Portrait orientation.

### The Séance Gone Wrong — Victim
- **Style A.** A young woman's silhouette seated at a séance table, face turned fully away from the viewer, one hand resting palm-up on the table as if just released by others, candlelight guttering around her, cold fog beginning to pool at the floor.
  Save as `art/images/painterly/victims/seance.jpg`
- **Style B.** A gothic tarot card figure, back turned, seated with one hand raised palm-out like a blessing, a ring of candle-flame halo, deep black background, oxblood/gold linework, faceless.
  Save as `art/images/tarot/victims/seance.jpg`

### The Curse of the Manor — Victim
- **Style A.** A young heir's figure standing in a grand, shadowed doorway of a sealed east wing, back to the viewer, one hand on the doorframe, warm gaslight from the hall behind them throwing a long shadow into the dark room ahead.
  Save as `art/images/painterly/victims/manor.jpg`
- **Style B.** A gothic tarot card figure, back turned, standing in a doorway shaped like an archway of light, a key held loosely at their side, deep black background, amber/gold linework, faceless.
  Save as `art/images/tarot/victims/manor.jpg`

### The Ripper in the Fog — Victim
- **Style A.** A young seamstress's figure walking away down a fog-choked alley at night, seen from behind, a basket of mending in one hand, gaslight behind her throwing her silhouette long across wet cobblestones scored with a faint spiral mark.
  Save as `art/images/painterly/victims/ripper.jpg`
- **Style B.** A gothic tarot card figure, back turned, walking away down a spiral-marked path, a sewing needle and thread trailing like a comet, deep black background, oxblood/silver linework, faceless.
  Save as `art/images/tarot/victims/ripper.jpg`

### The Débutante in the Thames — Victim
- **Style A.** A young woman in a pale ball gown, seen from behind, standing at the edge of a dark riverside embankment at night looking out over the black Thames, gaslight behind her, the hem of her gown just touching the water.
  Save as `art/images/painterly/victims/debutante.jpg`
- **Style B.** A gothic tarot card figure, back turned, standing at a river's edge in a pale gown, the hem dissolving into flat black water, a crescent moon halo, deep black background, teal/gold linework, faceless.
  Save as `art/images/tarot/victims/debutante.jpg`

### The Cell That Was Never Opened — Victim
- **Style A.** A patient's figure in a plain asylum shift, seen from behind, standing motionless in a frost-covered garden at night, the asylum's barred windows glowing faintly behind them.
  Save as `art/images/painterly/victims/asylum.jpg`
- **Style B.** A gothic tarot card figure, back turned, standing in a frost-covered garden in a plain shift, barred windows glowing behind them like a halo, deep black background, silver/slate linework, faceless.
  Save as `art/images/tarot/victims/asylum.jpg`

### The Soprano’s Final Curtain — Victim
- **Style A.** A soprano’s figure in an elaborate costume, seen from behind, standing centre-stage under a single spotlight, the empty auditorium dark beyond the footlights.
  Save as `art/images/painterly/victims/opera.jpg`
- **Style B.** A gothic tarot card figure, back turned, standing centre-stage under a flat radiant spotlight halo, an empty auditorium rendered as darkness beyond, deep black background, gold/oxblood linework, faceless.
  Save as `art/images/tarot/victims/opera.jpg`

### The Christmas Poisoning — Victim
- **Style A.** A seated figure in formal Christmas dinner attire, seen from behind at the head of a candlelit table, a place setting undisturbed before them, holly and candlelight around.
  Save as `art/images/painterly/victims/yuletide.jpg`
- **Style B.** A gothic tarot card figure, back turned, seated at the head of a flat symmetrical table, a holly-motif halo, deep black background, oxblood/gold linework, faceless.
  Save as `art/images/tarot/victims/yuletide.jpg`

### The Duel That Wasn’t Fought — Victim
- **Style A.** A gentleman’s figure in formal dueling dress, seen from behind, standing alone on a frosted field at dawn, a dropped pistol at his feet, mist rising around him.
  Save as `art/images/painterly/victims/duel.jpg`
- **Style B.** A gothic tarot card figure, back turned, standing on a flat frosted field, a dropped pistol icon at their feet, deep black background, silver/oxblood linework, faceless.
  Save as `art/images/tarot/victims/duel.jpg`

### The Bride Who Never Arrived — Victim
- **Style A.** A bride’s figure in a full wedding gown, seen from behind, descending a dim stone stairway into a crypt, her veil trailing up the steps behind her.
  Save as `art/images/painterly/victims/bride.jpg`
- **Style B.** A gothic tarot card figure, back turned, descending flat stone steps in a wedding gown, veil trailing upward like a comet, deep black background, gold/teal linework, faceless.
  Save as `art/images/tarot/victims/bride.jpg`

### The Keeper’s Drowned Light — Victim
- **Style A.** A lighthouse keeper’s figure in oilskins, seen from behind, standing at the top of a spiral stair looking out into a storm-dark sea through the lamp-room glass.
  Save as `art/images/painterly/victims/lighthouse.jpg`
- **Style B.** A gothic tarot card figure, back turned, standing before a flat radiant lighthouse-lamp halo, a storm-dark sea beyond, deep black background, silver/teal linework, faceless.
  Save as `art/images/tarot/victims/lighthouse.jpg`

### The Workhouse Reckoning — Victim
- **Style A.** A child’s small figure in workhouse grey, seen from behind, standing at the top of a worn stone stairwell, one hand on the railing, cold light from above.
  Save as `art/images/painterly/victims/workhouse.jpg`
- **Style B.** A gothic tarot card figure, back turned, small in scale, standing at the top of flat descending steps, a barred-window halo above, deep black background, slate/gold linework, faceless.
  Save as `art/images/tarot/victims/workhouse.jpg`

### The Death Beneath the Big Top — Victim
- **Style A.** An aerialist’s figure in spangled costume, seen from behind, standing on a high platform looking out across an empty big top, the slack wire visible below.
  Save as `art/images/painterly/victims/circus.jpg`
- **Style B.** A gothic tarot card figure, back turned, standing on a flat high platform, a slack wire rendered as a falling line below them, deep black background, gold/oxblood linework, faceless.
  Save as `art/images/tarot/victims/circus.jpg`

---

## Notes on generating

- Do each **style master block** once as a saved system prompt / style if
  your tool supports it, so you're not retyping the palette every time.
- Generate a character's front/turned pair back-to-back so the model's
  "memory" of the character (via conversation context, if the tool
  supports iterative refinement) keeps the same face across both.
- If an image comes back too gory, graphic, or too literal (e.g. an
  actual corpse), that's a style-block failure, not a prompt failure —
  reinforce the "unsettling but not gory" / "no literal card frame" line
  and re-roll rather than editing the specific prompt.
- 200 total images across both styles (100 per style: 32 Archetype sides + 12 Hooks + 44 Omens + 12 Victims). You don't have to generate all of them at once — the Gallery and the in-game cards work fine with partial art; anything missing just shows the text placeholder.
