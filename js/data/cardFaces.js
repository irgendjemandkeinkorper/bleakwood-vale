/* Art-led card copy for the paired Gallery collection.
   These records describe what is visible on each face; gameplay rules remain
   in archetypes.js and hooks.js. Keep slugs aligned with
   art/images/tarot/bleakwood-vale-card-labels.md. */

const face = (id, label, context, quote) => ({id, label, context, quote});
const card = (slug, title, first, second) => ({slug, title, faces:[first, second]});

export const CARD_ARCHETYPES = [
  card('disgraced-alienist', 'The Disgraced Alienist',
    face('candlelit', 'Candlelit', 'By a patient lamp, the alienist listens as though even the wildest confession might yet be evidence.', 'Tell me what the dark said. I shall not laugh.'),
    face('guttered', 'Guttered', 'Notebook in hand, he follows a patient into the institution’s unlit passage, where observation has curdled into pursuit.', 'I wrote the diagnosis before I opened the door.')),
  card('laudanum-lyre', 'The Laudanum Lyre',
    face('candlelit', 'Candlelit', 'A sleepless poet feeds one page to the candle and lets the next drink ink beside the waiting bottle.', 'The verse was merciful until I revised it.'),
    face('guttered', 'Guttered', 'Bent over a public-house table, he writes past dawn while witnesses gather behind him and the dose turns memory into prophecy.', 'Every line is true; only the order is a lie.')),
  card('veiled-widow', 'The Veiled Widow',
    face('candlelit', 'Candlelit', 'At the bier, the widow receives comfort with perfect stillness while another woman watches what grief will make her reveal.', 'They buried my husband. They did not bury his bargain.'),
    face('guttered', 'Guttered', 'Before a room of mourners, the veil is lifted and sympathy becomes interrogation.', 'Ask why I wear black; fear the day I answer.')),
  card('defrocked-priest', 'The Defrocked Priest',
    face('candlelit', 'Candlelit', 'Denied his pulpit, the priest still shelters a penitent at the threshold and keeps the crowd outside.', 'The church cast me out. Confession did not.'),
    face('guttered', 'Guttered', 'Beneath a ruined chapel, he preaches to those respectable pews would never admit.', 'Below the altar, every sinner knows my name.')),
  card('resurrection-man', 'The Resurrection Man',
    face('candlelit', 'Candlelit', 'At first light he opens a fresh grave with the care of a tradesman and the urgency of a thief.', 'The dead keep no appointments, so I keep them.'),
    face('guttered', 'Guttered', 'Behind a locked door, stolen remains become correspondence, payment, and proof.', 'A corpse tells everything once properly divided.')),
  card('inspector-yard', 'The Inspector from the Yard',
    face('candlelit', 'Candlelit', 'The inspector questions a shaken witness while his superior waits to hear which truth will be useful.', 'Begin again, and leave out what they told you to remember.'),
    face('guttered', 'Guttered', 'Alone with photographs, letters, and a sealed bag, he arranges the case that official hands have already disturbed.', 'The missing evidence has fingerprints of its own.')),
  card('mediums-apprentice', "The Medium's Apprentice",
    face('candlelit', 'Candlelit', 'The apprentice tests the instruments alone, listening for the small mechanical sound beneath the impossible one.', 'The table moved before the spirit arrived.'),
    face('guttered', 'Guttered', 'In a crowded séance, every hand is joined except the one working beneath the cloth.', 'Do not break the circle. Someone outside it is listening.')),
  card('heir-in-exile', 'The Heir in Exile',
    face('candlelit', 'Candlelit', 'Rain-soaked and unannounced, the heir returns with a travel case full of papers and a claim no servant dares inspect.', 'I came home for nothing that can be inherited.'),
    face('guttered', 'Guttered', 'Before the ancestral portrait, one letter burns while the household gathers too late to save it.', 'The seal was genuine. That is why it had to burn.')),
  card('mudlark', 'The Mudlark',
    face('candlelit', 'Candlelit', 'On the river stairs, the mudlark offers up what the Thames refused to keep.', 'The tide pays better when no constable is watching.'),
    face('guttered', 'Guttered', 'A gentleman corners the mudlark on the quay, only to discover the child has brought a witness from the water.', 'I found your name in the mud before I found the body.')),
  card('undertakers-daughter', "The Undertaker's Daughter",
    face('candlelit', 'Candlelit', 'Among lilies and lowered voices, she prepares the dead while the living bargain over appearances.', 'I make them peaceful. Their families make them silent.'),
    face('guttered', 'Guttered', 'When the mourners depart, she finds the small alteration that proves the body arrived already rehearsed.', 'This wound was dressed for company.')),
  card('blind-fortune-teller', 'The Blind Fortune-Teller',
    face('candlelit', 'Candlelit', 'Her fingers rest on the spread while the client waits for her sightlessness to become permission.', 'You came to hear the future, not to recognize the past.'),
    face('guttered', 'Guttered', 'She reaches across the cards toward the lie in a stranger’s hand.', 'Keep the coin. I have already seen what it costs.')),
  card('pawnbroker', 'The Pawnbroker',
    face('candlelit', 'Candlelit', 'Through brass bars, the pawnbroker accepts a token whose owner needs money more than memory.', 'Nothing is worthless if someone fears its return.'),
    face('guttered', 'Guttered', 'After closing, he weighs the object against a ledger entry that should have died with its maker.', 'I lend against secrets at a ruinous rate.')),
  card('cabinet-magician', 'The Cabinet Magician',
    face('candlelit', 'Candlelit', 'Before a candlelit audience, the magician invites a volunteer into a cabinet too small for escape.', 'A locked box is merely a promise made to an audience.'),
    face('guttered', 'Guttered', 'The applause rises as the cabinet opens on a reflection that moved a heartbeat too late.', 'The trick ends when the other man steps out.')),
  card('ladys-companion', "The Lady's Companion",
    face('candlelit', 'Candlelit', 'At the edge of the drawing room, the companion carries a note between people too mannered to speak plainly.', 'I am paid to be present and trained to be unseen.'),
    face('guttered', 'Guttered', 'Waiting outside the dressing room, she hears the arrangement being made in her name.', 'A companion knows which silence belongs to whom.')),
  card('penny-press-reporter', 'The Penny Press Reporter',
    face('candlelit', 'Candlelit', 'Fresh sheets roll from the press as the reporter chooses which scandal will greet the Vale at breakfast.', 'Truth is cheapest before the second edition.'),
    face('guttered', 'Guttered', 'Copy and payment change hands beneath the pressroom lamps while a figure waits at the door.', 'Print the denial large; hide the confession in the margin.')),
  card('climbing-boy', 'The Climbing Boy',
    face('candlelit', 'Candlelit', 'Soot-blackened and breathless, the boy is examined by those who value the chimney more than the child.', 'I heard them through the flue before they heard me fall.'),
    face('guttered', 'Guttered', 'Inside the walls, he pauses above a firelit room and learns why the grate was sealed.', 'Every grand house has a passage built for smoke and secrets.')),
  card('ruined-mechanist', 'The Ruined Mechanist',
    face('candlelit', 'Candlelit', 'In a rented attic, the mechanist coaxes one last movement from a machine made of salvaged hours.', 'It does not keep time. It keeps what time takes.'),
    face('guttered', 'Guttered', 'Behind the workshop’s false wall, the finished device waits beneath a cage of blackened brass.', 'I ruined myself proving the mechanism remembers.')),
  card('ghostlight-actress', 'The Ghostlight Actress',
    face('candlelit', 'Candlelit', 'She rehearses to an empty house under the single lamp actors leave burning for the theatre’s dead.', 'An empty seat is still an audience.'),
    face('guttered', 'Guttered', 'At her mirror, the actress reads a note while another face gathers in the glass behind her.', 'My understudy has been dead for three performances.')),
  card('beast-collector', 'The Beast Collector',
    face('candlelit', 'Candlelit', 'In the wet wood, the collector tends an injured raven with gentler hands than society has ever seen.', 'A wounded thing bites only after kindness fails.'),
    face('guttered', 'Guttered', 'Back in his cabinet, living wings beat among specimens pinned beneath glass.', 'Classification is another word for captivity.')),
  card('fallen-gentleman', 'The Fallen Gentleman',
    face('candlelit', 'Candlelit', 'Outside the decaying estate, the gentleman offers aid with the grave courtesy of a man who has already lost rank.', 'Good breeding survives long after good fortune.'),
    face('guttered', 'Guttered', 'At the card table, he stakes the last family paper while creditors watch the signature dry.', 'A gentleman pays his debts with whatever name remains.'))
];

export const CARD_VICTIMS = [
  card('governess', 'The Governess',
    face('mourning', 'Mourning', 'She gathers the children close in the ruined nursery while the household searches for a gentler account of what happened.', 'I kept their nightmares from them. No one kept mine.'),
    face('die-nacht', 'Die Nacht', 'Alone after midnight, the governess reads the letter hidden among the schoolroom books.', 'The children did not invent the voice behind the wall.')),
  card('parish-doctor', 'The Parish Doctor',
    face('mourning', 'Mourning', 'At a poor child’s bedside, the doctor spends the last of his certainty while the family waits.', 'I treated every house in the parish but my own.'),
    face('die-nacht', 'Die Nacht', 'In the surgery after hours, he measures a dark tincture beside a ledger no patient has seen.', 'The dose was correct. The name on the bottle was not.')),
  card('widow-victim', 'The Widow',
    face('mourning', 'Mourning', 'Beneath the churchyard rain, the widow accepts flowers from neighbors who know only half the marriage.', 'They mourn the man I was expected to remember.'),
    face('die-nacht', 'Die Nacht', 'At home, she turns a sealed letter beneath the lamp and decides whether the dead may accuse her.', 'He wrote my confession before I committed it.')),
  card('factory-girl', 'The Factory Girl',
    face('mourning', 'Mourning', 'At the meal bell, she divides her bread among workers whose names the company records as numbers.', 'We shared everything except the blame.'),
    face('die-nacht', 'Die Nacht', 'Between the silent looms, she hides a folded list where only the next shift will find it.', 'If the wheel stops, read what I left beneath it.')),
  card('antiquarian', 'The Antiquarian',
    face('mourning', 'Mourning', 'Under the shop lamp, he authenticates a family paper while its owners hover over every stroke.', 'Age makes an object valuable and a lie respectable.'),
    face('die-nacht', 'Die Nacht', 'After closing, a secret drawer yields bone, keys, and the relic omitted from the catalogue.', 'The oldest piece in my collection still knows my name.')),
  card('magistrate', 'The Magistrate',
    face('mourning', 'Mourning', 'On the courthouse steps, the magistrate receives the town’s deference while a petitioner kneels in the rain.', 'Mercy is easiest when it leaves no record.'),
    face('die-nacht', 'Die Nacht', 'In chambers, he burns one judgment and keeps the seal that made it lawful.', 'The law remembers only what survives the fire.')),
  card('choir-boy', 'The Choir Boy',
    face('mourning', 'Mourning', 'His clear voice rises through the chapel while the congregation mistakes fear for devotion.', 'I sang the note they told me never to name.'),
    face('die-nacht', 'Die Nacht', 'After evensong, he waits alone with a torn page from the vestry book.', 'Someone answered from beneath the choir.')),
  card('seamstress', 'The Seamstress',
    face('mourning', 'Mourning', 'At the workroom window, she stitches mourning cloth under the eyes of women who measure grief by the yard.', 'I hemmed their secrets into every black dress.'),
    face('die-nacht', 'Die Nacht', 'Long after closing, she sews a message into a gown as a watcher appears at the door.', 'Unpick the left sleeve before they bury me.')),
  card('dock-foreman', 'The Dock Foreman',
    face('mourning', 'Mourning', 'Among rain-dark crates, the foreman settles a quarrel with the rough affection of a man the whole quay trusts.', 'No cargo moves here without a name and a favor.'),
    face('die-nacht', 'Die Nacht', 'After the lamps are lowered, a shipping chit passes from his coat to an unlisted hand.', 'The manifest is honest. The tide is not.')),
  card('schoolmistress', 'The Schoolmistress',
    face('mourning', 'Mourning', 'Before an empty slate, she pins up the lesson that will outlast one absent pupil.', 'A child remembers the truth adults correct.'),
    face('die-nacht', 'Die Nacht', 'At her desk after dusk, she reads a parent’s warning between rows of perfect copybooks.', 'The missing page was written in my hand.')),
  card('soldier-returned', 'The Soldier Returned',
    face('mourning', 'Mourning', 'Back from the war, he lets a quiet household tend wounds no parade acknowledged.', 'They welcomed home the uniform and overlooked the man.'),
    face('die-nacht', 'Die Nacht', 'In the rented room, medals, banknotes, and a stranger’s photograph form a campaign of their own.', 'I returned with another soldier’s promise in my pocket.')),
  card('orphan-beneficiary', 'The Orphan Beneficiary',
    face('mourning', 'Mourning', 'In the solicitor’s library, the orphan receives a legacy before witnesses old enough to remember its price.', 'They called it inheritance so no one would call it payment.'),
    face('die-nacht', 'Die Nacht', 'Alone with the strongbox, the beneficiary finds a miniature portrait beneath the bonds.', 'The will named me. The portrait explains why.')),
  card('housekeeper', 'The Housekeeper',
    face('mourning', 'Mourning', 'She receives the household at the tiled threshold, composed enough to make disaster look properly announced.', 'A well-kept house hides its grief in the servants’ hall.'),
    face('die-nacht', 'Die Nacht', 'After the family retires, her master key opens the cabinet everyone believed decorative.', 'I locked every door except the one they never saw.')),
  card('mediums-daughter', "The Medium's Daughter",
    face('mourning', 'Mourning', 'At the wake, she pours for mourners who came hoping grief might perform one final miracle.', 'My mother spoke for the dead. Tonight they speak of her.'),
    face('die-nacht', 'Die Nacht', 'When the room is empty, she opens the hidden speaking device among the funeral flowers.', 'The voice in the trumpet knew what we never rehearsed.')),
  card('missing-heir', 'The Missing Heir',
    face('mourning', 'Mourning', 'Returned to the estate gates, the heir greets tenants who have spent years learning to mourn an empty title.', 'They kept my place at table and sold everything beneath it.'),
    face('die-nacht', 'Die Nacht', 'In the ancestral room, a letter and a locket prove the disappearance began at home.', 'I was not lost. I was removed.'))
];

const ARCHETYPE_ALIASES = {
  'the-opium-addled-poet':'laudanum-lyre',
  'the-travelling-illusionist':'cabinet-magician',
  'the-inspector-from-the-yard':'inspector-yard'
};

function roleKey(value){
  return String(value||'').toLowerCase().normalize('NFKD')
    .replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

export function archetypeCardForRole(role){
  const key = roleKey(role);
  const slug = ARCHETYPE_ALIASES[key] || key.replace(/^the-/,'');
  return CARD_ARCHETYPES.find(item=>item.slug===slug) || null;
}

export function pairedCardStem(style, item, sideIndex){
  const faceId = item.faces[sideIndex]?.id || item.faces[0].id;
  const suffix = style==='tarot' ? '-tarot-stained-glass-v1' : '-v1';
  return `${item.slug}-${faceId}${suffix}`;
}

