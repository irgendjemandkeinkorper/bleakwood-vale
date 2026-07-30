/* Archetypes: two-sided. Side 0 (face-up at start) carries the setup question.
   Flip when the face-up condition is met at the end of a scene it led. */
export const ARCHETYPES = [
  {
    role:'The Disgraced Alienist',
    flavor:'A doctor of the mind, struck from the registers, still practising on the desperate.',
    setup:{
      seance:'You attended the sitting as its appointed skeptic. What did you see in the instant the candles died that your science cannot account for?',
      manor:'The family retained you, quietly, to treat the deceased. What malady were you actually treating — and what did you write in your notes instead?'
    },
    sides:[
      {cond:'If anyone doubted your sanity or your science this scene…', tone:'Obsession'},
      {cond:'If you treated a person as a specimen rather than a soul…', tone:'Dread'}
    ]
  },
  {
    role:'The Opium-Addled Poet',
    flavor:'Once the toast of the London reviews; now the Vale’s resident ruin, seeing too much.',
    setup:{
      seance:'The dead spoke through the medium in a voice you recognised. Whose voice was it — and what did it call you?',
      manor:'You summered at the manor once, as the family’s pet genius. What did you witness there that you turned into verse nobody understood?'
    },
    sides:[
      {cond:'If you told a beautiful lie…', tone:'Guilt'},
      {cond:'If you saw something no one else present could see…', tone:'Dread'}
    ]
  },
  {
    role:'The Veiled Widow',
    flavor:'Married into the Vale; buried her husband within the year; never lifted the veil since.',
    setup:{
      seance:'The sitting was held at your request. Who were you trying to reach — and who answered instead?',
      manor:'What promise did the deceased make to you at your husband’s graveside, and why did it frighten you?'
    },
    sides:[
      {cond:'If you wore your grief as armour…', tone:'Guilt'},
      {cond:'If you let someone glimpse what is beneath the veil…', tone:'Obsession'}
    ]
  },
  {
    role:'The Defrocked Priest',
    flavor:'Stripped of his collar for a scandal no two people describe the same way. Still keeps the keys to the chapel.',
    setup:{
      seance:'You came that night to stop the sitting. What holy thing did you bring with you — and why did it fail?',
      manor:'You served the family chapel before your disgrace. What confession did the deceased make to you that you may never repeat?'
    },
    sides:[
      {cond:'If you invoked God without believing it…', tone:'Guilt'},
      {cond:'If you performed a rite you are forbidden to perform…', tone:'Dread'}
    ]
  },
  {
    role:'The Resurrection Man',
    flavor:'Digs for the anatomists by dark; knows the churchyard better than the sexton; owed money by respectable men.',
    setup:{
      seance:'You were paid to procure something for the medium before the sitting. What did you dig up — and what was wrong with it?',
      manor:'The family paid you once to open a grave in their private plot. Whose name was on the stone — and why was the coffin light?'
    },
    sides:[
      {cond:'If you profited from the dead…', tone:'Obsession'},
      {cond:'If the dead seemed to know your name…', tone:'Dread'}
    ]
  },
  {
    role:'The Inspector from the Yard',
    flavor:'Sent up from London on the night train; methodical, unwelcome, and not as untouched by the Vale as he pretends.',
    setup:{
      seance:'You were already watching that house the night of the death — on another matter entirely. What was it?',
      manor:'This is not the first death at the manor you have looked into. What did you put in your last report that your superiors struck out?'
    },
    sides:[
      {cond:'If you bent the law to serve the truth…', tone:'Obsession'},
      {cond:'If you concealed evidence…', tone:'Guilt'}
    ]
  },
  {
    role:'The Medium’s Apprentice',
    flavor:'Keeps the séance room; knows where the wires are hidden; knows which effects need no wires at all.',
    setup:{
      seance:'You prepared the room before the sitting. Which of your preparations was a trick — and which one, God help you, was not?',
      manor:'The deceased wrote to your mistress begging for a reading of the house itself. What did the letters say was moving through the walls?'
    },
    sides:[
      {cond:'If you spoke with a voice not your own…', tone:'Dread'},
      {cond:'If you told someone what they needed to hear…', tone:'Guilt'}
    ]
  },
  {
    role:'The Heir in Exile',
    flavor:'Left the Vale years ago under a cloud; returned the very week of the death, trailing debts and rumours.',
    setup:{
      seance:'You returned to the Vale the day of the death, after years abroad. What drove you away — and what letter called you home?',
      manor:'The estate should have passed to you. What did you do — or what were you accused of — that saw you struck from the will?'
    },
    sides:[
      {cond:'If your name opened a door, or closed one…', tone:'Obsession'},
      {cond:'If you coveted something that belonged to the dead…', tone:'Guilt'}
    ]
  }
];
