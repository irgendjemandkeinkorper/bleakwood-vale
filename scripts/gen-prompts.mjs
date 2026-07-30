import { ARCHETYPES } from '../js/data/archetypes.js';
import { HOOKS } from '../js/data/hooks.js';
import { OMENS } from '../js/data/omens.js';

export const slugify = s => String(s).toLowerCase()
  .replace(/[’'′`]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const arch = {
  'The Disgraced Alienist': {
    a: {
      front: 'A gaunt Victorian alienist in a worn frock coat, seated at a cluttered desk stacked with case-notes and a phrenology skull, leaning intensely toward the viewer as if mid-diagnosis, sourceless amber candlelight from below catching his eyes.',
      turned: "The same alienist alone in a dim consulting room at night, staring into a cracked mirror where the reflection doesn't quite match his posture, cold pale-green fog light bleeding in through a rain-streaked window."
    },
    b: {
      front: "Frontal-facing tarot portrait, phrenology skull cradled in one hand like a scholar's orb, a ring of small candle-flames arcing above his head like a halo, deep black background, jewel-tone amber and brass linework.",
      turned: 'The same figure now hooded in shadow, a cracked hand-mirror held up before his own face reflecting a second, subtly wrong face, a raven perched at his feet, cold jewel-tone teal/black palette with fine silver linework.'
    }
  },
  'The Opium-Addled Poet': {
    a: {
      front: 'A wasted, elegant poet in a threadbare velvet coat, slumped in a fog-choked garret full of scattered manuscript pages, an oxblood-red ember glow from a dying pipe lighting his hollow face.',
      turned: 'The same poet walking alone on a moonlit moor path at night, looking back over his shoulder at something unseen in the drifting mist, cold grey-green light washing out his features.'
    },
    b: {
      front: 'Frontal tarot portrait, quill in one hand and a wilting red rose in the other, a thin ribbon of pipe-smoke coiling into a halo shape behind his head, deep black background, oxblood and tarnished-gold linework.',
      turned: 'The same poet with eyes closed, a swirl of pale moths rising from an open book at his feet, a crescent moon rendered as flat linework behind his head, cold jewel-tone slate/black palette.'
    }
  },
  'The Veiled Widow': {
    a: {
      front: 'A tall widow in full mourning dress and black lace veil, standing rigid before a grave marker in a fog-bound cemetery, an oxblood undertone in the folds of her skirts.',
      turned: "The same widow with her veil half-lifted in a candlelit parlour, one hand pressed to a locket, her visible eye lit by an intense amber glow that borders on manic."
    },
    b: {
      front: 'Frontal tarot portrait in full mourning dress and veil, one hand resting on a locket shaped like a small sun, an hourglass with red sand at her feet, deep black background, oxblood and gold linework.',
      turned: 'The same widow with veil lifted, a ring of candle-flames haloing her head, a mirror held in one hand catching her own too-bright eyes, warm amber jewel-tone palette.'
    }
  },
  'The Defrocked Priest': {
    a: {
      front: 'A priest in a plain black coat with no collar, standing in a candlelit, half-ruined chapel nave, oxblood-red light pooling in the shadows behind him.',
      turned: 'The same priest kneeling alone before a defaced altar at night, a ring of old iron keys in one outstretched hand, cold moonlit fog spilling through a broken stained-glass window.'
    },
    b: {
      front: 'Frontal tarot portrait, an unlit censer in one hand, a broken rosary coiled at his feet like a red thread, no collar at his throat, deep black background, oxblood and gold linework.',
      turned: 'The same priest with an iron key held aloft, a raven perched atop a shattered halo-shaped stained-glass window behind his head, cold jewel-tone teal/black palette.'
    }
  },
  'The Resurrection Man': {
    a: {
      front: 'A wiry grave-robber in muddy work clothes, crouched beside a half-opened grave with a lantern and spade, sourceless amber lantern-glow catching his intent, hungry expression.',
      turned: 'The same man frozen mid-stride in a churchyard at night, lantern dropped and guttering, staring at something in an open coffin just out of frame, cold pale fog-light washing the scene.'
    },
    b: {
      front: 'Frontal tarot portrait, a lantern held aloft like a torch of judgement, coins spilling from one open palm, deep black background, amber and brass linework.',
      turned: 'The same man with a spade planted at his feet like a scepter, an open grave rendered as a flat black crescent behind him, a raven on his shoulder, cold jewel-tone palette.'
    }
  },
  'The Inspector from the Yard': {
    a: {
      front: 'A stern Scotland Yard inspector in a dark overcoat and bowler hat, examining a piece of evidence by gaslight in a cramped office thick with pipe smoke, warm amber light.',
      turned: 'The same inspector alone at night, burning a page from his own notebook over a candle flame, oxblood-red light flickering across a guilty, resolute face.'
    },
    b: {
      front: 'Frontal tarot portrait in overcoat and bowler hat, a magnifying glass held up like a sun-disc, a set of scales balanced at his feet, deep black background, amber and brass linework.',
      turned: "The same inspector burning a torn page in one hand, the flame's smoke coiling into a chain shape, cold oxblood/black palette."
    }
  },
  "The Medium’s Apprentice": {
    a: {
      front: 'A pale young apprentice in plain mourning-grey, arranging séance-table props — candles, a spirit trumpet, hidden wires — in a shadowed parlour, cold moonlit-fog light.',
      turned: 'The same apprentice sitting at the séance table alone, hands flat on the wood, eyes rolled back mid-trance, an oxblood-red candlelight glow underlighting her face unnaturally.'
    },
    b: {
      front: 'Frontal tarot portrait, hands posed in a spirit-summoning gesture, a spirit trumpet and hidden wire coiled at her feet, a crescent moon halo, cold jewel-tone slate/black palette.',
      turned: 'The same apprentice eyes rolled back in trance, a red thread spooling from her open mouth into a spiral at her feet, oxblood and gold linework.'
    }
  },
  'The Heir in Exile': {
    a: {
      front: 'A well-dressed but travel-worn young heir standing in the doorway of a grand manor house at dusk, trunk and letters at his feet, staring up at the facade with amber gaslight glow.',
      turned: 'The same heir alone in a portrait gallery at night, standing before a family portrait with its face slashed out, oxblood-red candlelight in his hand.'
    },
    b: {
      front: 'Frontal tarot portrait, a house key held aloft like a scepter, a stack of unopened letters at his feet, an amber halo of candle-flame, brass linework.',
      turned: 'The same heir standing before a slashed portrait rendered as a flat void behind him, a single coin held in a closed fist, cold oxblood/black palette.'
    }
  },
  'The Mudlark': {
    a: {
      front: 'A sharp-eyed young river-scavenger in ragged layered clothes, crouched at the Thames foreshore at low tide, clutching a found object close to her chest, warm amber dawn-light through fog.',
      turned: 'The same mudlark standing waist-deep in fog at the river’s edge at night, looking down at something pale surfacing in the black water, cold moonlit-green light.'
    },
    b: {
      front: 'Frontal tarot portrait, a found object cradled to her chest like a relic, the Thames rendered as a flat wavy line at her feet, amber dawn-toned linework.',
      turned: 'The same mudlark waist-deep in stylized black water, a pale hand-shape breaking the surface at her feet, a raven overhead, cold jewel-tone palette.'
    }
  },
  "The Undertaker’s Daughter": {
    a: {
      front: 'A composed young woman in a plain dark dress, standing in a candlelit coffin-workshop full of wood shavings and funeral wreaths, cold pale fog-light through a high window.',
      turned: 'The same woman alone at a preparation table at night, one hand resting on a shrouded form, oxblood-red candlelight catching an expression of quiet, terrible knowledge.'
    },
    b: {
      front: 'Frontal tarot portrait, a funeral wreath held like a halo behind her head, wood-shaving curls scattered at her feet, cold jewel-tone slate/black palette.',
      turned: 'The same woman with one hand resting on a shrouded form rendered as a flat white shape, a red thread stitched through her other palm, oxblood and gold linework.'
    }
  },
  'The Blind Fortune-Teller': {
    a: {
      front: "A blind fortune-teller in a threadbare shawl, seated at a market stall lined with tea-leaves and a chipped crystal, her clouded eyes turned unerringly toward the viewer as if she can see them anyway, cold pale fog-light at the market's edge.",
      turned: "The same fortune-teller alone by candlelight, counting coins into neat towers on her table, her sightless gaze fixed on nothing, an unsettling private smile, warm amber candle-glow."
    },
    b: {
      front: 'Frontal tarot portrait, clouded blind eyes facing forward unerringly, tea-leaves and a cracked crystal ball held before her like an offering, a crescent moon halo, cold jewel-tone slate/black palette.',
      turned: 'The same seer with coins stacked in neat towers at her feet, a flame-motif halo, warm amber jewel-tone palette, her blind eyes catching the light strangely.'
    }
  },
  'The Pawnbroker': {
    a: {
      front: 'A shrewd pawnbroker in a waistcoat and spectacles, standing behind a counter crowded with unclaimed rings, watches, and lockets, sourceless amber gaslight from a hanging lamp.',
      turned: 'The same pawnbroker alone after closing, turning a single item over and over in his hands under a guttering candle, oxblood-red light, his expression unreadable.'
    },
    b: {
      front: 'Frontal tarot portrait, a scale of judgement balanced in one hand, unclaimed rings and watches arranged like offerings at his feet, amber and brass linework, deep black background.',
      turned: 'The same pawnbroker with a single locket held to his chest, a red-thread motif winding around his other wrist, oxblood and gold linework, deep black background.'
    }
  },
  'The Travelling Illusionist': {
    a: {
      front: "A sharp-suited stage illusionist mid-flourish under canvas and gaslight, cards fanned impossibly in one hand, sourceless amber spotlight-glow, a knowing showman's smile.",
      turned: "The same illusionist alone backstage at night, staring at a trick prop that has done something it was never built to do, cold pale fog-light, his showman's composure gone."
    },
    b: {
      front: 'Frontal tarot portrait, cards fanned in one hand like a sunburst, a rabbit-and-hat motif at his feet rendered as flat icon, amber and brass linework, deep black background.',
      turned: 'The same illusionist with his own reflection stepping out of a mirror behind him, unwatched, a crescent moon and raven motif, cold jewel-tone slate/black palette.'
    }
  },
  'The Lady’s Companion': {
    a: {
      front: 'A plainly-dressed lady’s companion standing a precise half-step behind an empty ornate chair in a drawing room, hands folded, eyes lowered, oxblood-red undertone in the shadows.',
      turned: 'The same companion alone at a writing desk late at night, pen paused mid-sentence over a letter she is visibly deciding whether to send, cold pale fog-light through a curtained window.'
    },
    b: {
      front: 'Frontal tarot portrait, standing precisely half a step behind an ornate empty chair rendered as a flat throne shape, oxblood and gold linework, deep black background.',
      turned: 'The same companion with a sealed letter held against her chest, a raven perched on the chair behind her, cold jewel-tone slate/black palette.'
    }
  },
  'The Penny Press Reporter': {
    a: {
      front: 'A sharp-eyed young reporter in a rumpled coat, notebook and pencil in hand, leaning in at the edge of a crime scene’s lamplight, warm amber gaslight, an expression of hungry professional interest.',
      turned: 'The same reporter alone at a print-shop desk at night, staring at a headline she has just written and is now afraid to run, oxblood-red light from a single desk lamp.'
    },
    b: {
      front: 'Frontal tarot portrait, notebook and pencil held aloft like a scribe’s tools, a printing-press motif at her feet, amber and brass linework, deep black background.',
      turned: 'The same reporter with a torn newspaper page in one hand, a red-thread motif trailing from the print, oxblood and gold linework, deep black background.'
    }
  },
  'The Climbing Boy': {
    a: {
      front: 'A soot-streaked climbing boy no more than ten, wedged halfway up a narrow brick chimney flue, one eye visible in a shaft of light from below, cold pale fog-grey light.',
      turned: 'The same boy sitting on a rooftop at dawn, looking down through a chimney pot at something in the room below that he cannot un-see, oxblood-red dawn light struggling through smoke.'
    },
    b: {
      front: 'Frontal tarot portrait, small figure framed inside a flat chimney-flue shape like a keyhole, a single eye motif, cold jewel-tone slate/black palette.',
      turned: 'The same climbing boy seated on a rooftop with a coin held tightly in one sooty fist, oxblood and gold linework, deep black background.'
    }
  }
};

export const hook = {
  seance: {
    a: "A darkened Victorian parlour mid-séance: an overturned circle of chairs, candles drowned in their own spilled wax, a lace tablecloth disturbed. The medium's empty chair sits closest to the viewer. Sourceless amber candlelight fighting against creeping cold fog at the room's edges.",
    b: 'A gothic tarot card composition: an overturned circle of chairs arranged like the rays of a sun around an empty central chair, candle-flames haloing the scene from above, deep black background, oxblood/gold linework, no figures.'
  },
  manor: {
    a: "The exterior of a vast, decaying gothic manor house at dusk, one wing's windows boarded and dark against the rest of the lit facade, fog pooling across an overgrown lawn, a single silhouette visible in a lit ground-floor window looking up at the sealed wing.",
    b: 'A gothic tarot card composition: a symmetrical manor facade with one wing rendered as a flat black void, a single lit window shaped like an eye, ivy linework framing the corners, deep black background, amber/gold linework.'
  },
  ripper: {
    a: 'A narrow fog-choked Victorian alley at night, gaslamp casting a weak amber pool of light, a spiral symbol scratched faintly into wet cobblestones in the foreground, the far end of the alley dissolving into impenetrable mist.',
    b: 'A gothic tarot card composition: a spiral symbol at the center of a fog-flat alley, a gaslamp haloing it from above like a sun, a raven perched at the edge, deep black background, oxblood/silver linework.'
  },
  debutante: {
    a: 'A grand riverside embankment at night, the dark Thames reflecting distant gaslights, a pale ball gown floating half-submerged near the stone steps at the water’s edge, fog rolling in off the river, no figure visible — only the gown.',
    b: 'A gothic tarot card composition: a pale ball gown floating on a flat black river rendered as rippling linework, a crescent moon haloing the scene, deep black background, teal/gold linework.'
  },
  asylum: {
    a: 'The exterior of a grim stone asylum on a fog-bound moor at dusk, one barred cell window lit from within though the door beside it stands slightly ajar, a frost-covered kitchen garden visible beyond the wall.',
    b: 'A gothic tarot card composition: a barred cell window and an ajar door rendered as flat symmetrical shapes, a frost-covered garden plot beyond, deep black background, silver/slate linework.'
  },
  opera: {
    a: 'The interior of a grand, empty opera house after the curtain has fallen, a single spotlight still burning on an empty stage, a dropped fan or glove visible in the wings.',
    b: 'A gothic tarot card composition: an empty stage under a single spotlight rendered as a radiant halo, a dropped glove at its edge, deep black background, gold/oxblood linework.'
  },
  yuletide: {
    a: 'A grand dining table set for twelve, holly and candles down its length, one place setting conspicuously undisturbed, its chair pushed back, firelight and cold blue window-light mixing.',
    b: 'A gothic tarot card composition: a long table set symmetrically with twelve place-settings, one chair pushed back and empty, holly-motif border, deep black background, oxblood/gold linework.'
  },
  duel: {
    a: 'A misty dueling ground at dawn, two long shadows cast toward each other across frosted grass, a single dropped pistol visible in the foreground, cold pale light breaking through fog.',
    b: 'A gothic tarot card composition: two long shadows meeting across a flat frosted field, a dropped pistol rendered as a small icon between them, deep black background, silver/oxblood linework.'
  },
  bride: {
    a: 'The dim stone stairway descending from a church nave into its crypt, a trail of white gown-lace visible on the steps, distant organ-lit doorway glowing warm above.',
    b: 'A gothic tarot card composition: a stairway descending into darkness rendered as flat receding steps, a trail of lace draped across them, a warm doorway glow above, deep black background, gold/teal linework.'
  },
  lighthouse: {
    a: 'A lone lighthouse on a rocky point at night, its lamp burning an unnatural pale colour against the storm-dark sky, waves crashing at its base, no figure visible in the lamp room.',
    b: 'A gothic tarot card composition: a lighthouse tower rendered as a flat vertical beam of light against a dark sea, a crescent moon behind it, deep black background, silver/teal linework.'
  },
  workhouse: {
    a: 'A bleak workhouse stairwell, worn stone steps descending into shadow, a single small shoe left on one step, cold grey light from a high barred window.',
    b: 'A gothic tarot card composition: a stairwell rendered as flat descending steps, a single small shoe icon on one step, a barred-window motif above, deep black background, slate/gold linework.'
  },
  circus: {
    a: 'The inside of an empty big-top tent at night, a single aerial wire hanging slack from the rigging high above, sawdust ring below lit by one remaining lamp.',
    b: 'A gothic tarot card composition: a slack wire hanging from a flat rigging shape above an empty ring, a single lamp glow, deep black background, gold/oxblood linework.'
  }
};

export const victim = {
  seance: {
    a: "A young woman's silhouette seated at a séance table, face turned fully away from the viewer, one hand resting palm-up on the table as if just released by others, candlelight guttering around her, cold fog beginning to pool at the floor.",
    b: 'A gothic tarot card figure, back turned, seated with one hand raised palm-out like a blessing, a ring of candle-flame halo, deep black background, oxblood/gold linework, faceless.'
  },
  manor: {
    a: "A young heir's figure standing in a grand, shadowed doorway of a sealed east wing, back to the viewer, one hand on the doorframe, warm gaslight from the hall behind them throwing a long shadow into the dark room ahead.",
    b: 'A gothic tarot card figure, back turned, standing in a doorway shaped like an archway of light, a key held loosely at their side, deep black background, amber/gold linework, faceless.'
  },
  ripper: {
    a: "A young seamstress's figure walking away down a fog-choked alley at night, seen from behind, a basket of mending in one hand, gaslight behind her throwing her silhouette long across wet cobblestones scored with a faint spiral mark.",
    b: 'A gothic tarot card figure, back turned, walking away down a spiral-marked path, a sewing needle and thread trailing like a comet, deep black background, oxblood/silver linework, faceless.'
  },
  debutante: {
    a: 'A young woman in a pale ball gown, seen from behind, standing at the edge of a dark riverside embankment at night looking out over the black Thames, gaslight behind her, the hem of her gown just touching the water.',
    b: "A gothic tarot card figure, back turned, standing at a river's edge in a pale gown, the hem dissolving into flat black water, a crescent moon halo, deep black background, teal/gold linework, faceless."
  },
  asylum: {
    a: "A patient's figure in a plain asylum shift, seen from behind, standing motionless in a frost-covered garden at night, the asylum's barred windows glowing faintly behind them.",
    b: 'A gothic tarot card figure, back turned, standing in a frost-covered garden in a plain shift, barred windows glowing behind them like a halo, deep black background, silver/slate linework, faceless.'
  },
  opera: {
    a: 'A soprano’s figure in an elaborate costume, seen from behind, standing centre-stage under a single spotlight, the empty auditorium dark beyond the footlights.',
    b: 'A gothic tarot card figure, back turned, standing centre-stage under a flat radiant spotlight halo, an empty auditorium rendered as darkness beyond, deep black background, gold/oxblood linework, faceless.'
  },
  yuletide: {
    a: 'A seated figure in formal Christmas dinner attire, seen from behind at the head of a candlelit table, a place setting undisturbed before them, holly and candlelight around.',
    b: 'A gothic tarot card figure, back turned, seated at the head of a flat symmetrical table, a holly-motif halo, deep black background, oxblood/gold linework, faceless.'
  },
  duel: {
    a: 'A gentleman’s figure in formal dueling dress, seen from behind, standing alone on a frosted field at dawn, a dropped pistol at his feet, mist rising around him.',
    b: 'A gothic tarot card figure, back turned, standing on a flat frosted field, a dropped pistol icon at their feet, deep black background, silver/oxblood linework, faceless.'
  },
  bride: {
    a: 'A bride’s figure in a full wedding gown, seen from behind, descending a dim stone stairway into a crypt, her veil trailing up the steps behind her.',
    b: 'A gothic tarot card figure, back turned, descending flat stone steps in a wedding gown, veil trailing upward like a comet, deep black background, gold/teal linework, faceless.'
  },
  lighthouse: {
    a: 'A lighthouse keeper’s figure in oilskins, seen from behind, standing at the top of a spiral stair looking out into a storm-dark sea through the lamp-room glass.',
    b: 'A gothic tarot card figure, back turned, standing before a flat radiant lighthouse-lamp halo, a storm-dark sea beyond, deep black background, silver/teal linework, faceless.'
  },
  workhouse: {
    a: 'A child’s small figure in workhouse grey, seen from behind, standing at the top of a worn stone stairwell, one hand on the railing, cold light from above.',
    b: 'A gothic tarot card figure, back turned, small in scale, standing at the top of flat descending steps, a barred-window halo above, deep black background, slate/gold linework, faceless.'
  },
  circus: {
    a: 'An aerialist’s figure in spangled costume, seen from behind, standing on a high platform looking out across an empty big top, the slack wire visible below.',
    b: 'A gothic tarot card figure, back turned, standing on a flat high platform, a slack wire rendered as a falling line below them, deep black background, gold/oxblood linework, faceless.'
  }
};

export const omenB = {
  'A Tarnished Pocket Watch': 'A flat gothic-tarot icon of an open pocket watch with stopped hands, a crescent moon motif tucked in one corner, silver linework on a deep black background.',
  'The Dead Songbird': 'A flat gothic-tarot icon of a songbird inside an open gilded cage, a single falling-feather motif, gold linework on a deep black background.',
  'A Key Without a Lock': 'A flat gothic-tarot icon of a single ornate key, a small star motif in one corner, brass linework on a deep black background.',
  'The Black Dog': 'A flat gothic-tarot icon of a dog silhouette standing at a crossroads shape, a crescent moon motif, silver linework on a deep black background.',
  'A Mourning Brooch': 'A flat gothic-tarot icon of an oval brooch with woven-hair detail, a small flame motif, gold linework on a deep black background.',
  'The Extinguished Candle': 'A flat gothic-tarot icon of a snuffed candle with a curling smoke line, a star motif, silver linework on a deep black background.',
  'A Child’s Caul': 'A flat gothic-tarot icon of a glass jar holding a pale membrane, a crescent moon motif, teal linework on a deep black background.',
  'The Mirror, Draped': 'A flat gothic-tarot icon of an oval mirror half-draped in cloth, a star motif, silver linework on a deep black background.',
  'A Vial of Black Bile': 'A flat gothic-tarot icon of a corked apothecary vial, a small flame motif, oxblood linework on a deep black background.',
  'The Hangman’s Rope': 'A flat gothic-tarot icon of coiled rope tied in a loop, a star motif, brass linework on a deep black background.',
  'A Wedding Ring, Swallowed': 'A flat gothic-tarot icon of a ring resting in a shallow dish, a crescent moon motif, gold linework on a deep black background.',
  'The Moth Swarm': 'A flat gothic-tarot icon of moths circling a flameless lamp shape, a star motif, silver linework on a deep black background.',
  'A Daguerreotype of the Dead': 'A flat gothic-tarot icon of an upright oval photograph frame with painted-open eyes, a star motif, oxblood linework on a deep black background.',
  'The Cracked Church Bell': 'A flat gothic-tarot icon of a bronze bell with a jagged crack, a crescent moon motif, brass linework on a deep black background.',
  'A Left-Handed Glove': 'A flat gothic-tarot icon of a single glove with a scorch mark, a star motif, oxblood linework on a deep black background.',
  'The Rat King': 'A flat gothic-tarot icon of knotted tails forming an infinity loop, a star motif, silver linework on a deep black background.',
  'A Sprig of Rue': 'A flat gothic-tarot icon of a wilting herb sprig, a crescent moon motif, teal linework on a deep black background.',
  'The Frozen Rose': 'A flat gothic-tarot icon of a frost-rimed rose, a star motif, silver and teal linework on a deep black background.',
  'A Letter Edged in Black': 'A flat gothic-tarot icon of a sealed black-bordered letter, a star motif, gold linework on a deep black background.',
  'The Second Shadow': 'A flat gothic-tarot icon of a single candle casting two shadow shapes, a crescent moon motif, silver linework on a deep black background.',
  'A Doll with Real Teeth': 'A flat gothic-tarot icon of a cracked porcelain doll face with an open mouth, a star motif, oxblood linework on a deep black background.',
  'The Salt Line, Broken': 'A flat gothic-tarot icon of a broken dotted line across a doorstep shape, a star motif, silver linework on a deep black background.',
  'A Ship in a Bottle': 'A flat gothic-tarot icon of a bottled ship with black sails, a crescent moon motif, gold linework on a deep black background.',
  'The Weeping Wall': 'A flat gothic-tarot icon of a damp-stained wall shaped like a weeping face, a star motif, teal linework on a deep black background.',
  'A Child-Sized Coffin': 'A flat gothic-tarot icon of a small upright coffin, a crescent moon motif, silver linework on a deep black background.',
  'A Lock of Hair, Cut While Sleeping': 'A flat gothic-tarot icon of a hair-lock tied around a mismatched ring, a star motif, gold linework on a deep black background.',
  'An Upturned Crucifix': 'A flat gothic-tarot icon of an inverted crucifix above a doorframe shape, a star motif, oxblood linework on a deep black background.',
  'A Mourning Card, Pre-Printed': 'A flat gothic-tarot icon of a black-bordered card with a blank date line, a star motif, gold linework on a deep black background.',
  'A Trepanning Kit, One Instrument Short': 'A flat gothic-tarot icon of an open velvet-lined surgical case with one empty slot, a star motif, silver linework on a deep black background.',
  'A Music Box, Wound Backward': 'A flat gothic-tarot icon of an open music box with a frozen dancer figure, a crescent moon motif, gold linework on a deep black background.',
  'The Family Signet, Melted Down': 'A flat gothic-tarot icon of a melted gold lump with a faint crest fragment, a star motif, brass linework on a deep black background.',
  'A Widow’s Veil, Bought Too Soon': 'A flat gothic-tarot icon of a folded black veil, a crescent moon motif, silver linework on a deep black background.',
  'An Alembic, Still Warm': 'A flat gothic-tarot icon of a glass alembic with a single droplet at its spout, a star motif, silver linework on a deep black background.',
  'A Diary Entry, Torn Free': 'A flat gothic-tarot icon of a torn diary page with trailing handwriting, a star motif, gold linework on a deep black background.',
  'An Hourglass, Running Backward': 'A flat gothic-tarot icon of an hourglass with sand rising upward, a crescent moon motif, silver linework on a deep black background.',
  'A Funerary Urn, Too Light': 'A flat gothic-tarot icon of a funerary urn, a star motif, brass linework on a deep black background.',
  'A Falling Star, Witnessed by Three': 'A flat gothic-tarot icon of a falling star trailing light, a star motif, silver linework on a deep black background.',
  'A Black Orchid, Hand-Delivered': 'A flat gothic-tarot icon of a black orchid with visible thorns, a star motif, gold linework on a deep black background.',
  'A Firework That Would Not Finish': 'A flat gothic-tarot icon of a firework burst rendered as flat radiating lines, a star motif, gold linework on a deep black background.',
  'A Set of Scales, One Side Empty': 'A flat gothic-tarot icon of a set of scales with one pan empty, a star motif, brass linework on a deep black background.',
  'A Grave Marker, Name Filed Off': 'A flat gothic-tarot icon of a gravestone with a blank smoothed face, a crescent moon motif, silver linework on a deep black background.',
  'A Circle, Salted and Broken': 'A flat gothic-tarot icon of a broken salt circle, a star motif, silver linework on a deep black background.',
  'A Physician’s Cane, Silver-Topped': 'A flat gothic-tarot icon of a silver-topped cane with a hollow revealed at its head, a star motif, silver linework on a deep black background.',
  'A Star Chart, One Star Added by Hand': 'A flat gothic-tarot icon of a star chart with one hand-drawn star among printed ones, a star motif, gold linework on a deep black background.'
};

export const omenA = {
  'A Tarnished Pocket Watch': 'A tarnished silver pocket watch lying open on dark velvet, hands stopped, faint condensation on the glass as if just breathed on.',
  'The Dead Songbird': 'A small songbird lying still in an ornate gilded cage, feathers slightly ruffled, cage door open.',
  'A Key Without a Lock': 'A single old iron key resting alone on a dusty windowsill, oddly warm-toned light on the metal.',
  'The Black Dog': "A large black dog's silhouette standing at a foggy crossroads at night, eyes catching a faint amber glint.",
  'A Mourning Brooch': 'An oval mourning brooch woven from dark human hair, set in gold, resting on black lace.',
  'The Extinguished Candle': 'A candle just snuffed out, a thin ribbon of smoke curling sideways against still air.',
  'A Child’s Caul': 'A thin translucent membrane preserved in an antique glass jar on a shelf of curiosities.',
  'The Mirror, Draped': 'An ornate mirror draped in black mourning cloth, the drape slipping to reveal a sliver of dark reflective glass.',
  'A Vial of Black Bile': "A small glass apothecary vial of shimmering black liquid, corked, on a physician's stained cloth.",
  'The Hangman’s Rope': 'A coil of rope cut into short lengths, tied with ribbon, displayed for sale on a market stall at dusk.',
  'A Wedding Ring, Swallowed': 'A gold wedding ring resting in a shallow surgical dish, faint pink water.',
  'The Moth Swarm': 'A cluster of pale moths circling a flameless, cold-glowing lamp in darkness.',
  'A Daguerreotype of the Dead': "An antique daguerreotype photograph propped upright, the subject's eyes crudely painted open over closed lids.",
  'The Cracked Church Bell': 'A large cracked bronze church bell hanging still, faint frost on the crack line.',
  'A Left-Handed Glove': 'A single fine leather glove laid on a table, its partner absent, a scorch mark nearby.',
  'The Rat King': "Several rats' tails knotted inextricably together, glimpsed in shadow at the edge of a cellar doorway.",
  'A Sprig of Rue': 'A wilting sprig of rue herb pinned to dark fabric, edges browning.',
  'The Frozen Rose': 'A single red rose encased in delicate frost, blooming against a snow-dusted windowsill in wrong season.',
  'A Letter Edged in Black': 'A sealed mourning letter with a black-edged border, wax seal glistening as if still wet.',
  'The Second Shadow': 'A single candle casting two distinct shadows on a wall behind an empty chair.',
  'A Doll with Real Teeth': 'An old porcelain doll, cracked, its open mouth showing unsettlingly real human teeth.',
  'The Salt Line, Broken': 'A neat line of salt across a wooden doorstep, broken by a single footprint through the middle.',
  'A Ship in a Bottle': 'A miniature ship in a bottle, its sails rigged entirely in mourning black, resting on a captain’s desk.',
  'The Weeping Wall': 'A damp plaster wall stain that resolves, at a glance, into the vague shape of a weeping face.',
  'A Child-Sized Coffin': 'A small, plain child-sized coffin standing empty and upright in a shadowed workshop corner.',
  'A Lock of Hair, Cut While Sleeping': 'A lock of hair tied with thread around a mismatched ring, resting on a nightstand beside an unlit lamp.',
  'An Upturned Crucifix': 'A small crucifix nailed upside-down above a doorframe, dust undisturbed around it.',
  'A Mourning Card, Pre-Printed': 'A formal mourning card with ornate black border, the date-of-death line conspicuously blank.',
  'A Trepanning Kit, One Instrument Short': 'An open Victorian surgical case lined in velvet, one tool-shaped indentation empty.',
  'A Music Box, Wound Backward': 'An ornate music box, lid open, its little dancer figure frozen mid-turn under dim light.',
  'The Family Signet, Melted Down': 'A lump of melted gold on a jeweler’s cloth, a fragment of an heraldic crest still legible in the metal.',
  'A Widow’s Veil, Bought Too Soon': 'A black mourning veil laid across a dressmaker’s counter, still folded in its tissue wrapping.',
  'An Alembic, Still Warm': 'A glass alembic still faintly warm to the touch, resting on a stained workbench, a single drop clinging to its spout.',
  'A Diary Entry, Torn Free': 'A loose diary page torn along its binding, handwriting trailing off mid-sentence, ink smudged as if closed too soon.',
  'An Hourglass, Running Backward': 'An ornate hourglass with sand visibly rising against gravity into its upper chamber, brass fittings catching low light.',
  'A Funerary Urn, Too Light': 'A carved stone funerary urn held aloft in one hand, its lightness suggested by the ease of the grip, dust motes catching candlelight.',
  'A Falling Star, Witnessed by Three': 'A streak of falling light captured mid-fall over a dark treeline, three distant silhouetted figures pointing in three different directions.',
  'A Black Orchid, Hand-Delivered': 'A single black orchid resting on a doorstep, thorned stem deliberately left intact, no card in sight.',
  'A Firework That Would Not Finish': 'A firework frozen mid-burst against a night sky, its light lingering unnaturally long, faint trails still falling.',
  'A Set of Scales, One Side Empty': 'An old brass set of scales, one pan weighted with a small dark object, the other conspicuously empty and still swinging.',
  'A Grave Marker, Name Filed Off': 'A weathered gravestone with its inscription filed smooth, only a faint ghost of letter-shapes remaining in the stone.',
  'A Circle, Salted and Broken': 'A ring of salt on a wooden floor, broken at one point by a deliberate sweep, candle stubs at its edge.',
  'A Physician’s Cane, Silver-Topped': 'A silver-topped physician’s cane leaning against a chair, its hollow shaft slightly ajar at the head, revealing a dark cavity.',
  'A Star Chart, One Star Added by Hand': 'An antique printed star chart with one additional star added in hand-inked pencil, unlike any printed constellation around it.'
};

if (import.meta.url === `file://${process.argv[1]}`) {
let missing = [];
ARCHETYPES.forEach(a => { if (!arch[a.role]) missing.push('archetype:' + a.role); });
HOOKS.forEach(h => { if (!hook[h.id]) missing.push('hook:' + h.id); if (!victim[h.id]) missing.push('victim:' + h.id); });
OMENS.forEach(o => { if (!omenA[o.title]) missing.push('omenA:' + o.title); if (!omenB[o.title]) missing.push('omenB:' + o.title); });
if (missing.length) { console.error('MISSING ENTRIES:\n' + missing.join('\n')); process.exit(1); }

const out = [];
const P = (...s) => out.push(s.join(''));

P('# Blackwood Vale — Gemini Image Prompt Sheet');
P('');
P('Prompts for generating card art with Gemini\'s image model ("Nano Banana" /');
P('Imagen). Two full styles are provided for every card — generate whichever');
P('you prefer, or both, and use the in-app Gallery\'s style toggle to compare');
P('them side by side once the files are in place.');
P('');
P('- **Style A — Painterly Gothic Illustration.** Moody, desaturated oil');
P('  painting, cinematic single-scene composition.');
P('- **Style B — Tarot Gothic.** Flat-color, linework-accented, symmetrical');
P('  Major-Arcana-style iconography.');
P('');
P('## File naming & folder convention');
P('');
P('The in-app Gallery (`js/ui/gallery.js`) looks for images at a predictable');
P('path built from each card\'s title/id — **every prompt below states its');
P('exact save path**, so you never need to compute this by hand. The pattern,');
P('for reference:');
P('');
P('```');
P('art/images/<style>/<category>/<slug>.<ext>');
P('');
P('<style>    painterly | tarot');
P('<category> archetypes | hooks | omens | victims');
P('<slug>     archetypes: "<role-slug>--front" or "<role-slug>--turned"');
P('           hooks & victims: the hook id (seance | manor | ripper | debutante)');
P('           omens: the omen title, slugified');
P('<ext>      jpg — the Gallery also tries .jpeg, .png, .webp automatically,');
P('           so any of those work if jpg isn\'t what you exported');
P('```');
P('');
P('Drop files at those paths (create the folders) and the Gallery picks them');
P('up automatically — no code changes needed. Until a file exists, that slot');
P('shows a plain text placeholder card instead, so the site never breaks.');
P('');
P('---');
P('');
P('## Style master blocks');
P('');
P('Prepend the relevant block to every prompt below (or save it as a reusable');
P('"style" in whatever tool you\'re using).');
P('');
P('### Style A — Painterly Gothic Illustration');
P('');
P('> Painterly gothic illustration, moody desaturated oil painting style, thick');
P('> visible brushwork, dramatic chiaroscuro lighting, single dominant light');
P('> source, heavy shadow. Victorian-era (1880s England) setting. Restrained,');
P('> muted palette — near-black backgrounds, warm parchment cream, tarnished');
P('> gold, oxblood red, deep moss and slate greens, pale moonlight grey-green.');
P('> No text, no letters, no words, no borders, no frame — full-bleed image');
P('> only. Atmosphere of fog, candlelight, and dread; unsettling but not gory');
P('> or graphic. A single unified image only — one scene, one figure, not a');
P('> repeating pattern, not a triptych, not tiled, not a grid or filmstrip of');
P('> multiple panels or copies.');
P('');
P('**Tone → light accent:** Obsession → sourceless amber/rust glow · Guilt →');
P('oxblood-red undertone in the shadows · Dread → cold pale moss-grey-green');
P('fog light.');
P('');
P('### Style B — Tarot Gothic');
P('');
P('> Gothic tarot-card illustration, in the tradition of hand-painted Major');
P('> Arcana artwork — bold flat color fields with fine metallic linework');
P('> detail, symmetrical/ceremonial frontal composition (like a tarot court');
P('> card), the central figure or object rendered as a flat stylized icon');
P('> rather than photorealistic, rich jewel-tone palette against a deep black');
P('> or midnight background, small celestial motifs (a crescent moon or a');
P('> star) worked into the composition as symbolism, not decoration. No');
P('> literal card frame, no text, no numerals. Mood: mystical, ominous,');
P('> ritualistic rather than cinematic. A single unified image only — one');
P('> figure or object, not a repeating pattern, not a triptych, not tiled,');
P('> not a grid or filmstrip of multiple panels or copies of the subject.');
P('');
P('**Tone → symbolic motif:** Obsession → flame / coins / gilded halo · Guilt');
P('→ red thread / wilting rose / broken chain · Dread → raven / crescent moon');
P('/ fog rendered as flat linework.');
P('');
P('**Aspect ratio:** portrait (3:4) for Archetypes, Hooks, and Victims;');
P('square (1:1) for Omens, which render small in the Gallery.');
P('');
P('---');
P('');
P(`## 1. Archetypes (${ARCHETYPES.length * 4} images — front + turned, ×2 styles)`);
P('');
P('Each Archetype is two-sided: the face-up side at setup, and the "turned"');
P('side once its flip condition triggers mid-game. Both styles get a front');
P('and turned image, so the flip animation always has something new to');
P('reveal — same character, but the mood/lighting/symbolism shifts to match');
P('the other side\'s Tone.');
P('');
ARCHETYPES.forEach(a => {
  const slug = slugify(a.role);
  const d = arch[a.role];
  P(`### ${a.role}`);
  P(`*${a.flavor}*`);
  P('');
  P(`- **Front (${a.sides[0].tone}) — Style A.** ${d.a.front}`);
  P(`  Save as \`art/images/painterly/archetypes/${slug}--front.jpg\``);
  P(`- **Front (${a.sides[0].tone}) — Style B.** ${d.b.front}`);
  P(`  Save as \`art/images/tarot/archetypes/${slug}--front.jpg\``);
  P(`- **Turned (${a.sides[1].tone}) — Style A.** ${d.a.turned}`);
  P(`  Save as \`art/images/painterly/archetypes/${slug}--turned.jpg\``);
  P(`- **Turned (${a.sides[1].tone}) — Style B.** ${d.b.turned}`);
  P(`  Save as \`art/images/tarot/archetypes/${slug}--turned.jpg\``);
  P('');
});
P('---');
P('');
P(`## 2. Hooks (${HOOKS.length * 2} images — one per mystery, ×2 styles)`);
P('');
P('Portrait cover art for the scenario-select screen. No named characters —');
P('these are scene-setting, establishing shots.');
P('');
HOOKS.forEach(h => {
  const d = hook[h.id];
  P(`### ${h.title}`);
  P(`- **Style A.** ${d.a}`);
  P(`  Save as \`art/images/painterly/hooks/${h.id}.jpg\``);
  P(`- **Style B.** ${d.b}`);
  P(`  Save as \`art/images/tarot/hooks/${h.id}.jpg\``);
  P('');
});
P('---');
P('');
P(`## 3. Omens (${OMENS.length * 2} images — small square vignettes, ×2 styles)`);
P('');
P('These render small (icon-scale) in both the Omen Row and the Gallery, so');
P('keep each to one clear, uncluttered subject. Square (1:1).');
P('');
P('| Glyph | Title | Style A prompt | Style B prompt | Save as (base name) |');
P('|---|---|---|---|---|');
OMENS.forEach(o => {
  const slug = slugify(o.title);
  P(`| ${o.glyph} | ${o.title} | ${omenA[o.title]} | ${omenB[o.title]} | \`${slug}\` |`);
});
P('');
P('Save Style A as `art/images/painterly/omens/<slug>.jpg` and Style B as');
P('`art/images/tarot/omens/<slug>.jpg`, using the slug from the table above.');
P('');
P('---');
P('');
P(`## 4. Victims (${HOOKS.length * 2} images — one per hook, ×2 styles)`);
P('');
P('The Victim\'s *name and specific facts* are invented live at the table each');
P('session, so their face can\'t be pre-illustrated — instead, generate one');
P('**obscured/veiled** image per hook per style that works as a mystery-cover');
P('image regardless of what players later establish. Portrait orientation.');
P('');
HOOKS.forEach(h => {
  const d = victim[h.id];
  P(`### ${h.title} — Victim`);
  P(`- **Style A.** ${d.a}`);
  P(`  Save as \`art/images/painterly/victims/${h.id}.jpg\``);
  P(`- **Style B.** ${d.b}`);
  P(`  Save as \`art/images/tarot/victims/${h.id}.jpg\``);
  P('');
});
P('---');
P('');
P('## Notes on generating');
P('');
P('- Do each **style master block** once as a saved system prompt / style if');
P('  your tool supports it, so you\'re not retyping the palette every time.');
P('- Generate a character\'s front/turned pair back-to-back so the model\'s');
P('  "memory" of the character (via conversation context, if the tool');
P('  supports iterative refinement) keeps the same face across both.');
P('- If an image comes back too gory, graphic, or too literal (e.g. an');
P('  actual corpse), that\'s a style-block failure, not a prompt failure —');
P('  reinforce the "unsettling but not gory" / "no literal card frame" line');
P('  and re-roll rather than editing the specific prompt.');
P(`- ${ARCHETYPES.length * 4 + HOOKS.length * 2 + OMENS.length * 2 + HOOKS.length * 2} total images across both styles (${ARCHETYPES.length * 2 + HOOKS.length + OMENS.length + HOOKS.length} per style: ${ARCHETYPES.length * 2} Archetype sides + ${HOOKS.length} Hooks + ${OMENS.length} Omens + ${HOOKS.length} Victims). You don't have to generate all of them at once — the Gallery and the in-game cards work fine with partial art; anything missing just shows the text placeholder.`);

console.log(out.join('\n'));
}
