/* Archetypes: two-sided. Side 0 (face-up at start) carries the setup question.
   Flip when the face-up condition is met at the end of a scene it led. */
export const ARCHETYPES = [
  {
    role:'The Disgraced Alienist',
    flavor:'A doctor of the mind, struck from the registers, still practising on the desperate.',
    setup:{
      seance:'You attended the sitting as its appointed skeptic. What did you see in the instant the candles died that your science cannot account for?',
      manor:'The family retained you, quietly, to treat the deceased. What malady were you actually treating — and what did you write in your notes instead?',
      ripper:'The Yard has quietly asked you to profile the killer’s mind. What single detail about the spiral mark convinced you that you already know him?',
      debutante:'The family retained you to examine her nerves in the weeks before her death. What did you conclude she was afraid of — and did you tell anyone?'
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
      manor:'You summered at the manor once, as the family’s pet genius. What did you witness there that you turned into verse nobody understood?',
      ripper:'You have taken to walking the fog alone at night, daring the killer to find you. What did you see in the mist the night before this body was found?',
      debutante:'You wrote her a poem she never acknowledged receiving. What did it say — and who else has since read it?'
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
      manor:'What promise did the deceased make to you at your husband’s graveside, and why did it frighten you?',
      ripper:'You buried your husband before the killings began, and you have not stopped watching the alley where he died. What did you see there the night of this death?',
      debutante:'She came to you, of all people, for advice about her engagement. What did you tell her — and why has it stopped you sleeping since?'
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
      manor:'You served the family chapel before your disgrace. What confession did the deceased make to you that you may never repeat?',
      ripper:'The killer leaves a spiral at every scene. What does that mark mean in the old liturgy you were never supposed to teach?',
      debutante:'She came to your door at an unchristian hour asking to be married in secret. Who did she want to marry — and why did you refuse her?'
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
      manor:'The family paid you once to open a grave in their private plot. Whose name was on the stone — and why was the coffin light?',
      ripper:'You have seen every body the surgeons have paid you to procure. What is different about the wounds on this one that you have told no one?',
      debutante:'You were paid, handsomely and quietly, to retrieve something from the riverbank before the police arrived. What was it?'
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
      manor:'This is not the first death at the manor you have looked into. What did you put in your last report that your superiors struck out?',
      ripper:'London sent you because the local force couldn’t stop the first two killings. What did you get wrong about this case before this third body proved you wrong?',
      debutante:'The family’s solicitor tried to have your inquiry closed within a day of it opening. What did he offer you to walk away?'
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
      manor:'The deceased wrote to your mistress begging for a reading of the house itself. What did the letters say was moving through the walls?',
      ripper:'Your mistress attempted to contact the first victim’s spirit for a paying client. What came through instead — and why has no one hired her since?',
      debutante:'She sat for a reading three days before she died, though her family would have been scandalized to know it. What did the cards — or you — tell her?'
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
      manor:'The estate should have passed to you. What did you do — or what were you accused of — that saw you struck from the will?',
      ripper:'You returned to the Vale the week the killings began, and half the town has noticed the timing. Where were you the night of this third death, truly?',
      debutante:'You were once engaged to her yourself, before the family broke it off without explanation. What reason did they never give you?'
    },
    sides:[
      {cond:'If your name opened a door, or closed one…', tone:'Obsession'},
      {cond:'If you coveted something that belonged to the dead…', tone:'Guilt'}
    ]
  },
  {
    role:'The Mudlark',
    flavor:'A river-scavenger, half-feral and sharp-eyed, who reads the Thames mud the way scholars read books — and sells what she finds to whoever pays first.',
    setup:{
      seance:'You were combing the riverbank the night of the sitting, same as any other night. What did you pull out of the mud that you have not yet sold — and why not?',
      manor:'You scavenge the grounds below the manor’s sea-wall when the tide allows it. What did the house throw away that you kept for yourself?',
      ripper:'You know every inch of the riverbank and alley-mouths better than any constable. What did you find near this body before the police arrived — and did you sell it to the wrong person?',
      debutante:'You pulled something out of the Thames the same morning they found her — upriver, hours before the body surfaced. What was it, and who has been looking for it since?'
    },
    sides:[
      {cond:'If you traded something you shouldn’t have…', tone:'Obsession'},
      {cond:'If the river gave up more than it should have…', tone:'Dread'}
    ]
  },
  {
    role:'The Undertaker’s Daughter',
    flavor:'Raised among the coffins in her father’s workshop; more at ease dressing the dead than talking to the living.',
    setup:{
      seance:'You prepared the medium’s own mother for burial years ago. What did the mother tell you, on the table, that you never told her daughter?',
      manor:'Your family has buried every generation of this house. What did you notice on the body that the family’s own physician did not — or chose not to?',
      ripper:'You have now prepared all three bodies for burial. What single mark connects them that the newspapers have not printed?',
      debutante:'Your father was asked to prepare her for the wake before the inquest was even finished. What did you find on her that made you send for the doctor a second time?'
    },
    sides:[
      {cond:'If you spoke of the dead as though they could still hear you…', tone:'Dread'},
      {cond:'If you learned something from a body that the living were trying to hide…', tone:'Guilt'}
    ]
  }
];
