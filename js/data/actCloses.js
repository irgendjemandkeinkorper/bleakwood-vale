/* Act Close cards. Starter condition decides who begins; the dominant Tone of the act adds an element. */
export const ACT_CLOSES = {
  1:[
    {title:'The Funeral', cond:'Whoever most recently wore black begins this scene.',
     prompt:'The whole town in procession behind the coffin, up the hill in a thin grey rain. The bell tolls the years of the deceased’s short life.',
     elements:{Obsession:'Include a mourner who cannot stop watching one particular other mourner.', Guilt:'Include a wreath, gift, or gesture at the graveside that is unmistakably an apology.', Dread:'Include something that follows the procession, always at the same distance.'}},
    {title:'The Vigil', cond:'Whoever last lit a flame — in real life — begins this scene.',
     prompt:'By unspoken agreement, a candle burns in every window of the Vale tonight. The town keeps watch over itself.',
     elements:{Obsession:'Include one window whose light will not stay lit, and someone who keeps re-lighting it.', Guilt:'Include one house that keeps its windows dark — and the town noticing.', Dread:'Include a light answering from somewhere no house stands.'}},
    {title:'The Search Party', cond:'Whoever chose this Incident begins this scene.',
     prompt:'Lanterns fan out from the square into the tree-line, calling a name into a fog that swallows sound. Someone is still missing — or something is.',
     elements:{Obsession:'Include a searcher who refuses to turn back long after the others have.', Guilt:'Include a searcher who is not looking as hard as they let on.', Dread:'Include a lantern that goes out and will not relight, in a spot with no wind.'}}
  ],
  2:[
    {title:'The Public Meeting', cond:'Whoever spoke loudest this act begins this scene.',
     prompt:'The town gathers in the assembly rooms to demand answers of someone. The room is far too small for the anger in it.',
     elements:{Obsession:'Include an accusation with real evidence behind it.', Guilt:'Include a public apology that nobody asked for, from someone unexpected.', Dread:'Include the meeting being interrupted by something none of them can explain.'}},
    {title:'The Night of Fog', cond:'Whoever most recently kept a secret in a scene begins this one.',
     prompt:'The worst fog in living memory. The Vale becomes a rumour of itself; every gas-lamp an island; every footstep everyone’s.',
     elements:{Obsession:'Include someone using the fog to do what daylight forbids.', Guilt:'Include a voice confessing into the whiteness, unaware of its listeners.', Dread:'Include one place the fog refuses to touch.'}},
    {title:'The Ledger Opened', cond:'Whoever has traded an omen for a scene card this act begins this scene.',
     prompt:'Every debt in Blackwood Vale comes due at once — money, favors, and the kind that can never be repaid in coin.',
     elements:{Obsession:'Include a debt called in publicly and without mercy, in front of witnesses.', Guilt:'Include a debt quietly forgiven, and the guilt of the one who forgives it.', Dread:'Include a debt owed to someone who is, by every account, already dead.'}}
  ],
  3:[
    {title:'The Reckoning', cond:'Whoever began the game’s very first scene begins its last.',
     prompt:'All of it converges — the guilty, the grieving, and the thing beneath it all — in one place, at one appointed hour.',
     elements:{Obsession:'Include the truth of the death, spoken plainly at last — whether or not anyone believes it.', Guilt:'Include a punishment that falls upon the wrong person, and is accepted willingly.', Dread:'Include what remains in Blackwood Vale after this night — and who has seen it.'}},
    {title:'The Departure', cond:'Whoever holds the fewest cards begins this scene.',
     prompt:'Someone is leaving Blackwood Vale forever — by train, by coach, or by hearse. The town assembles to see them off. Or to be certain they go.',
     elements:{Obsession:'Include a final question shouted from the platform — and its answer, or its silence.', Guilt:'Include luggage that contains something belonging to the dead.', Dread:'Include the Vale, watched from the departing window, changing as it recedes.'}},
    {title:'The Last Confession', cond:'Whoever has revealed a Hidden Sin begins this scene — or, if none was revealed, whoever still holds one.',
     prompt:'One final unburdening, before the candles gutter out for good and Blackwood Vale closes its account of this death.',
     elements:{Obsession:'Include the one question that was never actually answered, asked one last time.', Guilt:'Include a forgiveness that is accepted, and doesn’t fix anything.', Dread:'Include a silence that answers more than any words could have.'}}
  ]
};
