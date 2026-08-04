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
      debutante:'The family retained you to examine her nerves in the weeks before her death. What did you conclude she was afraid of — and did you tell anyone?',
      asylum:'The asylum quietly retained you to review the patient’s case, off the books, after you were struck from the registers elsewhere. What did your own examination conclude about the diagnosis that the resident physicians refused to hear?',
      opera:'The company’s manager quietly retained you to examine the soprano’s nerves after the second understudy vanished. What did you conclude was frightening her — and did you believe her?',
      yuletide:'The family invited you to dine that night specifically to quietly assess whether the aunt’s mind was finally failing her. What did you conclude about her sanity in your last moments alone with her — and did you tell anyone before the pudding was served?',
      duel:'You were summoned at first light to examine the body before the family physician arrived. What did you note about the wound that convinced you no dueling pistol made it — and did you write that down?',
      bride:'The groom’s family retained you, quietly, to certify her fit for marriage. What did you actually find when you examined her — and did you tell the groom the truth of it?',
      lighthouse:'You were the one physician willing to make the crossing to examine the keeper twice a year, for his nerves, which the Trinity House men privately called madness. What did you write in your last report about his state of mind that you now wish you had taken more seriously?',
      workhouse:'The parish quietly retained you to certify the child was “simple-minded” before the death, so no one need look twice at what happened after. What did you actually observe in the child that you wrote nothing of — and why?',
      circus:'The circus retained you privately to examine the aerialist for nerves before the season began — a formality, they said. What did you find that convinced you she was more afraid of surviving than of falling?'
    },
    sides:[
      {cond:'If anyone doubted your sanity or your science this scene…', tone:'Obsession'},
      {cond:'If you treated a person as a specimen rather than a soul…', tone:'Dread'}
    ]
  },
  {
    role:'The Laudanum Lyre',
    flavor:'Once the toast of the London reviews; now the Vale’s resident ruin, seeing too much.',
    setup:{
      seance:'The dead spoke through the medium in a voice you recognised. Whose voice was it — and what did it call you?',
      manor:'You summered at the manor once, as the family’s pet genius. What did you witness there that you turned into verse nobody understood?',
      ripper:'You have taken to walking the fog alone at night, daring the killer to find you. What did you see in the mist the night before this body was found?',
      debutante:'You wrote her a poem she never acknowledged receiving. What did it say — and who else has since read it?',
      asylum:'You spent a season as a “guest” of Bleakwood Asylum yourself, in a fit no one would name aloud, and knew the patient from the exercise yard. What did they tell you, in the one lucid hour you shared, that you assumed was only opium-talk until now?',
      opera:'You wrote the season’s most ecstatic review of her voice, and have haunted the stage door ever since hoping she’d notice you. What did she finally say to you, the night before she died, that you have turned into verse no one has read?',
      yuletide:'You were the one outsider invited to the family’s table that Christmas, on the aunt’s own insistence. What did she recite to you, quietly, between courses, that you have since turned into a poem you dare not publish?',
      duel:'You have written of duels you never fought, in verses everyone assumed were only romance. What did you actually see from the tree line above the dueling ground that morning, half-dreaming or not?',
      bride:'You have taken to writing in the old crypt for its solitude, and were down there mere hours before the wedding was to begin. What did you see there that you have already turned into verse nobody has read yet?',
      lighthouse:'You used to row out to sit with the keeper some nights, the only visitor he’d allow, trading opium for solitude. What did he tell you the light had started showing him, in the nights before it stopped needing him at all?',
      workhouse:'You were once a workhouse child yourself, before the reviews found you; you returned this winter to read poetry to the children for a few coins. What did the dead child tell you, in confidence, about the stairs — and why did you not believe them?',
      circus:'You followed the circus from town to town all winter, chasing verses in its sawdust and gaslight. What did you see from the cheap seats, the moment the wire gave, that no one else in that crowd of four hundred noticed?'
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
      debutante:'She came to you, of all people, for advice about her engagement. What did you tell her — and why has it stopped you sleeping since?',
      asylum:'Your late husband committed the patient to Bleakwood Asylum with his own signature, thirty years ago, and never once explained why. What do you know about that decision that you have kept veiled even from yourself?',
      opera:'Your husband died in this very theatre, in the seat he always kept, the season before you married into mourning. What did the soprano tell you she’d seen sitting in his old seat, the week before she died?',
      yuletide:'The aunt was your closest confidante in this family, the only one who never asked you to lift your veil. What did she promise to finally tell you this Christmas, once the rest of the table had gone up to bed?',
      duel:'Your own husband died on that same dueling ground, years before this one. What did you go there to do, alone, before dawn on the morning of this second death?',
      bride:'She came to you for advice on marriage, as a woman who had survived one herself. What did you tell her about what waits on the other side of the aisle — and did you mean to frighten her?',
      lighthouse:'The keeper wrote to you every month for eleven years, letters you never answered and never burned. What did his last letter, arrived the very week he died, ask of you that you still haven’t done?',
      workhouse:'You sit on the parish board that funds the workhouse, and visit twice a year to be seen doing so. What did you notice on your last visit that you chose, at the time, not to ask about?',
      circus:'You attended opening night still in your mourning blacks, drawn by something you couldn’t name. What did the aerialist say to you at the gate beforehand, mistaking your veil for a fellow performer’s?'
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
      debutante:'She came to your door at an unchristian hour asking to be married in secret. Who did she want to marry — and why did you refuse her?',
      asylum:'You once held services in the asylum chapel, before your disgrace, and the patient was always first through the door. What confession did they make to you there that the physicians never got to hear?',
      opera:'The company asked you, in secret and against your better judgment, to bless the stage before opening night. What did you refuse to say aloud during the blessing — and why?',
      yuletide:'The aunt sent for you privately on Christmas Eve, though you no longer hold any collar to hear a confession. What did she confess to you the night before she died — and why have you told no one since?',
      duel:'You were asked, in secret, to bless the ground — or absolve one of the two men — before the shot was fired. Which man asked you, and what did you refuse to tell the other?',
      bride:'She came to your door months ago, in secret, asking to be married to a man who was not her intended groom. Why did you refuse her then — and have you told anyone since?',
      lighthouse:'You were meant to sail out and bless the light each spring, a duty you’d let lapse for two years running. What do you believe kept that lamp burning on its own once its keeper could no longer climb to it?',
      workhouse:'You were called to the workhouse to give the child last rites, though you are no longer licensed to do so. What did the master ask you to leave out of the burial record?',
      circus:'The ringmaster asked you, quietly and off the books, to bless the rigging before opening night — an old superstition he wouldn’t admit to believing. What did you find wrong with the wire when you touched it, and why did you bless it anyway?'
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
      debutante:'You were paid, handsomely and quietly, to retrieve something from the riverbank before the police arrived. What was it?',
      asylum:'The asylum’s own physicians have quietly paid you, more than once, for bodies no family came to claim. Did you already know this patient — from before, or after?',
      opera:'The stagehands paid you, quietly, to procure something from the crypt beneath the theatre for the production’s final act. What was it — and did you notice it had gone missing again, the night she died?',
      yuletide:'The aunt paid you, years ago, to make a certain old grave in the family plot disappear from the parish records entirely. What name was on that stone, and has anyone at this Christmas table asked after it since?',
      duel:'You were paid to be waiting nearby with a cart, in case the duel went as duels sometimes do. What did you see happen on that ground that had nothing to do with the pistol you were paid to expect?',
      bride:'You know that church crypt better than the sexton does, from years of quieter business down there. What did you find in it the week before the wedding that you never reported?',
      lighthouse:'You were hired, quietly, to retrieve something from the rocks below the light the same week the keeper was found. What did you bring back — and why haven’t you told the surgeon what you actually found it beside?',
      workhouse:'The workhouse buries its dead cheaply and without much watching, which has made it useful to you before. What did you notice about this particular grave that made you decide, for once, to leave it undisturbed?',
      circus:'You were paid, well and quietly, to reach the body before the local surgeon arrived. What did you notice about the fall that the official report left out?'
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
      debutante:'The family’s solicitor tried to have your inquiry closed within a day of it opening. What did he offer you to walk away?',
      asylum:'A locked door and an impossible death are precisely the kind of case that should have come to you immediately, and yet the asylum tried very hard to keep the Yard out of it. What did they not want you to find?',
      opera:'You were already looking into the theatre’s run of accidents before this death, at the manager’s quiet request. What did you conclude was causing them — before this death proved you wrong?',
      yuletide:'You were invited to this family’s Christmas table as a guest, not as an investigator — an old friendship, nothing more. What did you notice at dinner, purely out of habit, that you have not yet mentioned to anyone?',
      duel:'Duels are illegal, and you were already watching both families for an unrelated matter. What did you see from your hiding place before dawn that the surviving gentleman has not admitted to?',
      bride:'You were already investigating the groom’s family on another matter entirely before this death. What did you learn about them that makes this marriage look less like misfortune and more like motive?',
      lighthouse:'You were sent to determine how a dead man kept a light burning correctly for three days, and your official report says nothing you actually believe. What did you leave out of it?',
      workhouse:'You were sent to close this out as an ordinary accident, quickly and quietly, and were told as much before you’d even seen the stairs. What did you find there that you have not yet put in your report?',
      circus:'You were sent to look into the circus on an unrelated matter of stolen goods, the same week the wire failed. What did you find in the rigger’s wagon that has nothing to do with theft?'
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
      debutante:'She sat for a reading three days before she died, though her family would have been scandalized to know it. What did the cards — or you — tell her?',
      asylum:'Your mistress once held a sitting for the family of a Bleakwood Asylum patient, years ago, and the voice that came through gave an address inside the walls. Whose voice was it, and did it match this patient’s?',
      opera:'Your mistress was engaged, quietly, to rid the theatre of whatever was souring the production. What came through when she tried — and why has she refused to set foot in it since?',
      yuletide:'Your mistress held a private sitting for the aunt earlier that same week, at the aunt’s own quiet request. What did the aunt ask the spirits, and what answer made her go so pale she nearly cancelled Christmas dinner entirely?',
      duel:'Your mistress held a sitting for the widow the week after the duel, at the family’s quiet request. What came through that neither of you expected — and does it match what the second saw?',
      bride:'She came to your mistress in secret for a reading, three days before her wedding, frightened of something she wouldn’t name. What did the cards — or you — tell her?',
      lighthouse:'Your mistress once claimed she could hear the light’s keeper calling for help from miles inland, weeks before anyone found him. What did you privately do about her claim — and why didn’t you tell anyone until now?',
      workhouse:'You were taken from this very workhouse as a girl to apprentice with the medium, and have not been back since. What did the dead child’s face remind you of, when you finally returned to identify them?',
      circus:'Your mistress held a private sitting for the circus folk the week before opening night, at the aerialist’s own request. What did the aerialist ask to hear from the dead — and did an answer come?'
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
      debutante:'You were once engaged to her yourself, before the family broke it off without explanation. What reason did they never give you?',
      asylum:'It was your own family that had the patient committed thirty years ago, and your own inheritance that quietly depended on their staying committed. What did you do, or fail to do, the one time you visited?',
      opera:'Your family built this opera house, before you were sent away in disgrace. What did you see, returning to it for the first time in years, that convinced you the curse was never mere superstition?',
      yuletide:'The aunt was the only member of this family who wrote to you faithfully during your years away, and the only one who welcomed you back to this table without question. What did her last letter to you say that the rest of the family has never been permitted to read?',
      duel:'You returned to the Vale the very week this duel was arranged, and half the town assumes you had a hand in provoking it. What history do you actually share with the dead man?',
      bride:'Your own inheritance depends on this marriage never taking place, and everyone in the family knows it. Where were you the hour she went missing — and can you actually prove it?',
      lighthouse:'Bleakwood Point light stands on land your family once owned, before your grandfather gambled it away. What do you know about that light’s construction that the Trinity House men were never told?',
      workhouse:'Your family’s charity underwrites this workhouse, mostly so your name can be attached to it without your presence being required. What did you find, the one time you actually visited, that your family has been paying quite well to keep quiet?',
      circus:'You returned to the Vale the same week the circus arrived, and have been seen at the fairground more nights than not since. What did you know the aerialist from, before either of you ever set foot in Bleakwood Vale?'
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
      debutante:'You pulled something out of the Thames the same morning they found her — upriver, hours before the body surfaced. What was it, and who has been looking for it since?',
      asylum:'You’ve traded with an orderly at Bleakwood Asylum for years, buying whatever the patients’ families never come to collect. What did that orderly sell you the week of this death that you have not yet dared resell?',
      opera:'You found something washed up near the theatre’s water-gate the week the chandelier first failed, and sold it to a costumer without asking questions. What was it, and has anyone come looking for it since?',
      yuletide:'You were paid, quietly, to deliver something to the servants’ entrance of this house on Christmas Eve itself, addressed to no one by name. What was it, and who let you in?',
      duel:'You were on the moor near the dueling ground before dawn, same as any other morning, and saw both men arrive. What did you see arrive with them that wasn’t a pistol case?',
      bride:'You scavenge the ground beneath the old church, where the crypt drains toward the river. What did you pull out of that mud the very morning of the wedding — and why haven’t you sold it?',
      lighthouse:'You comb the tideline below the light most mornings, and you were the first person from the Vale to notice something was wrong at the lamp-room. What made you finally row out to check, after days of noticing?',
      workhouse:'You scavenge the banks below the workhouse wall, where things are sometimes thrown out that shouldn’t be. What did you pull from the mud there the same week the child died?',
      circus:'You scavenge the fairground each dawn after the crowds clear, and know the guy-wires and stakes better than any rigger. What did you find in the mud beneath the big top the morning after she fell?'
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
      debutante:'Your father was asked to prepare her for the wake before the inquest was even finished. What did you find on her that made you send for the doctor a second time?',
      asylum:'Your family has been called to Bleakwood Asylum before, for patients who died quietly and were buried quietly. What did you notice about this body, found so far from its cell, that the asylum’s own physician chose not to record?',
      opera:'Your family quietly prepared one of the vanished understudies for burial, though the company insisted publicly that she had simply left the production. What did you find on the body that made you glad the truth never reached the papers?',
      yuletide:'Your father has already been sent for to prepare the aunt for her wake, and you came in his place while he finishes another matter. What did you notice about her, laid out on the table, that doesn’t match a death by ordinary poisoning?',
      duel:'Your father prepared the body within the hour. What did you notice about the wound, dressing it yourself, that no dueling pistol could have made?',
      bride:'Your father was asked to open the crypt for a routine inspection days before the wedding, and you went down in his stead. What did you find down there that you told no one, not even him?',
      lighthouse:'You and your father were rowed out to bring the keeper’s body back, three days gone by the time anyone came. What condition was he in that you have not told a single soul outside your family’s workshop?',
      workhouse:'Your father was paid a pauper’s rate to prepare the child for burial, quickly and without questions. What did you find on the body that didn’t match a fall down any staircase you’ve ever seen?',
      circus:'Your father was sent for the moment the crowd stopped screaming. What did you find on her body, preparing it, that a fall from that height should not have left behind?'
    },
    sides:[
      {cond:'If you spoke of the dead as though they could still hear you…', tone:'Dread'},
      {cond:'If you learned something from a body that the living were trying to hide…', tone:'Guilt'}
    ]
  },
  {
    role:'The Blind Fortune-Teller',
    flavor:'Reads palms and tea-leaves at the market cross for pennies; lost her sight nine years ago, and swears she has seen more clearly since.',
    setup:{
      seance:'The medium invited you to sit outside the circle that night, as a curiosity for the paying guests. What did you sense in the room that had nothing to do with showmanship?',
      manor:'The family has quietly consulted you for years about the house and its curse, though they’d never admit it in daylight. What did you tell the deceased, the last time they came to you, that they refused to believe?',
      ripper:'You read the cards for the second victim, three days before this third death. What did you see in them that you have told no one — not even the Yard?',
      debutante:'She came to you in secret, veiled, the week before her debut. What did you see in her palm that made you refuse to take her coin?',
      asylum:'The patient’s family consulted you once, the year of the committal, and you told them something they paid you handsomely never to repeat. What was it?',
      opera:'The soprano came to you the morning of opening night, though her manager had forbidden it. What did you see in her palm that you chose to soften before you told her?',
      yuletide:'The aunt visited your stall at the market cross the very morning of Christmas Eve, alone, and paid you handsomely to read something other than her own palm. Whose future did she ask you to read instead — and what did you see in it that frightened you?',
      duel:'One of the two gentlemen came to you the week before, asking what the cards said about his chances. What did you tell him — and did you tell him the truth?',
      bride:'The groom came to you in secret, the week before the wedding, wanting to know if he should go through with it. What did you read in his hand that you didn’t have the heart to tell him?',
      lighthouse:'Sailors bring you their fears about that light to read before every voyage past the Point. What did you tell the last boat that rowed out to check on the keeper, before they found him?',
      workhouse:'One of the workhouse children used to sneak out to have their palm read by you, against every rule of the place. What did you tell them, the last time, that you now wish you hadn’t?',
      circus:'The aerialist paid you a visit at the market cross the very morning of opening night, though she’d never sought you out before. What did you tell her that she climbed the ladder anyway?'
    },
    sides:[
      {cond:'If you told a stranger a truth they did not pay to hear…', tone:'Dread'},
      {cond:'If you took money for a comfort you knew to be false…', tone:'Obsession'}
    ]
  },
  {
    role:'The Pawnbroker',
    flavor:'Keeps the shop beneath the three brass balls; knows exactly what every family in the Vale has quietly sold him, and precisely what it means that they did.',
    setup:{
      seance:'The medium pawned something to you the week before the sitting, quietly, out of desperation. What was it — and have you sold it on yet?',
      manor:'The family has pawned pieces of the estate to you for a generation, always quietly, always redeemed just in time. What did the deceased bring you the week they died, and never come back for?',
      ripper:'Someone pawned a bloodied item to you the week of the first killing, and you took it without asking why. What was it, and who still hasn’t come to reclaim it?',
      debutante:'Her family pawned the family jewels to you, quietly, to pay for the debut ball itself. What did you notice was missing from the set when they finally redeemed it?',
      asylum:'The asylum’s own steward has pawned “found” items to you for years — things that belonged to patients who never left. What did he bring you the week of this death?',
      opera:'The soprano pawned a piece of jewellery to you the week the chandelier first failed, swearing you to secrecy. What was it, and why has no one come to redeem it?',
      yuletide:'The aunt pawned a single item to you in the first week of December, insisting it be kept separate from your ordinary stock and never sold without her written word. What was it, and has anyone come asking for it since her death?',
      duel:'One of the two families pawned something valuable to you the week of the duel, quietly, to settle a debt that had nothing to do with honor. What was it, and which family?',
      bride:'She pawned her own engagement ring to you in secret, three weeks before the wedding, and never came back to redeem it. What did she tell you when she brought it in?',
      lighthouse:'The keeper pawned the same small object to you every single month for eleven years, always the same item, always redeemed within the week. What was it — and what did you do when it was never redeemed this last time?',
      workhouse:'The workhouse master has been quietly pawning goods to you for months — goods that, by rights, should have fed and clothed the children instead. What did he bring you the week the child died, and what did you finally refuse to buy?',
      circus:'One of the circus riggers pawned a coil of wire to you the week before opening night, needing coin fast. What was wrong with it that made you keep it separate from your usual stock?'
    },
    sides:[
      {cond:'If you profited from someone else’s desperation…', tone:'Obsession'},
      {cond:'If you kept a secret because it was worth more kept…', tone:'Guilt'}
    ]
  },
  {
    role:'The Cabinet Magician',
    flavor:'Performs impossible things nightly under canvas and gaslight; has started to suspect that one or two of his tricks have stopped being tricks.',
    setup:{
      seance:'You taught the medium two of her best effects, years ago, for a price she never fully paid. Which trick did she use on the dead that night that you never actually taught her?',
      manor:'You performed at the manor for the family once, years past, and were paid handsomely never to return. What did you see in that house that even you couldn’t explain as a trick?',
      ripper:'Your show was in town for all three killings, and the timing has not gone unnoticed. What illusion did you stage the same week as this third death — and did anyone mistake it for real?',
      debutante:'You performed at her debut ball, the very night she was first presented to Society. What vanishing trick did you do for her specifically, and what did she whisper to you afterward?',
      asylum:'Your show performed for the asylum’s patients once, by special charitable arrangement, and you taught one of them a trick involving a lock that opens from the wrong side. Was it this patient — and did they remember it?',
      opera:'You were quietly consulted on the production’s stage effects, including the chandelier everyone now swears is cursed. What did you rig that you never told the stage manager about — and could it have failed on its own?',
      yuletide:'Your show performed a single private engagement for this family’s Christmas gathering, at the aunt’s particular request. What trick did she ask you to perform for her alone, after the other guests had gone to bed?',
      duel:'You taught one of the two gentlemen a trick with a pistol once, as a party amusement, years before this morning. Did he use anything of what you taught him — and for what?',
      bride:'You performed at her betrothal party months ago, and she asked you afterward to teach her a trick of your own — the art of disappearing. What did you teach her, and did she use it?',
      lighthouse:'You once showed the keeper a trick for making a single flame burn three different colours, back when your show passed through on tour. What do you think became of that trick, alone with him for eleven years afterward?',
      workhouse:'You performed a charity show for the workhouse children the week before the death, free of charge, to ease your conscience about something else entirely. Which child watched you most closely — and what did they ask you afterward?',
      circus:'Your own show played this same fairground the season before the circus arrived, and you know exactly how a fall like that could be faked — or caused. What did you notice about this wire that no rigger would think to check?'
    },
    sides:[
      {cond:'If you deceived someone for the pleasure of it…', tone:'Obsession'},
      {cond:'If something you staged came true in a way you could not explain…', tone:'Dread'}
    ]
  },
  {
    role:'The Lady’s Companion',
    flavor:'Paid to be present and not to be noticed; has spent a decade in rooms where the truth was spoken as though she wasn’t in them.',
    setup:{
      seance:'You attended the sitting as chaperone to a lady who insisted on going. What did your mistress do, in the dark, that you have not yet told her family?',
      manor:'You have served as companion to a lady of this house for years, present in every room, accounted for in none. What did the deceased say to you, thinking you weren’t truly listening?',
      ripper:'Your mistress insisted on walking near the scene of this third killing, against every warning, and you went with her. What did she do there that you have not been able to explain to yourself since?',
      debutante:'You were engaged as her companion for the Season, to keep her safely chaperoned. Where, precisely, were you the hour she went missing — and why have you not said so aloud?',
      asylum:'You once served as companion to a lady who was, in the end, committed to Bleakwood Asylum instead of simply dismissed. What do you know about how easily an inconvenient woman can be locked away that you have never told anyone?',
      opera:'You attended as companion to a lady patron who insisted on visiting the soprano backstage before every performance. What did you see pass between them on the night of that final curtain?',
      yuletide:'You were engaged as companion to a lady of this family for the holiday, seated near enough to the aunt at dinner to hear everything she said under her breath. What did she whisper, to no one in particular, in the minutes before she was taken ill?',
      duel:'Your mistress is close to one of the two families, and confided something to you the night before the duel that you have not repeated. What was it?',
      bride:'You have served as her companion since she was a girl, and were meant to walk her down to the vestry that very morning. Where did you lose sight of her — and why did you wait so long to raise the alarm?',
      lighthouse:'Your mistress insisted on watching that light from her window every night for years, counting its turns like a rosary. What did she see change in its pattern — and when did she first tell you the keeper must already be dead?',
      workhouse:'You accompany your mistress on her charitable visits to the workhouse, and are trusted to wait quietly while she inspects it. What did you overhear the master say to a child, the day before the death, that your mistress did not?',
      circus:'Your mistress insisted on a private audience with the aerialist before the show, an unusual request she wouldn’t explain. What passed between them that you overheard from just outside the tent flap?'
    },
    sides:[
      {cond:'If you were treated as furniture rather than a person…', tone:'Guilt'},
      {cond:'If you repeated, to the wrong person, something you overheard…', tone:'Dread'}
    ]
  },
  {
    role:'The Penny Press Reporter',
    flavor:'Chases the grimmest story in the Vale with an appetite she tells herself is only professional; has not yet found the line she won’t cross for a byline.',
    setup:{
      seance:'You attended the sitting under a false name, chasing a story on the medium’s supposed fraud. What did you actually witness that you have not dared put in print?',
      manor:'You have been trying to get inside Bleakwood Manor for a story on the family curse for over a year. What did you finally see, the night you got in, that convinced you the curse was real?',
      ripper:'You have covered all three killings for the penny press, and privately believe you know something the Yard does not. What is it, and why haven’t you printed it yet?',
      debutante:'You’ve been chasing the story of her broken engagements for weeks. What did one of her suitors tell you, off the record, that you promised never to repeat?',
      asylum:'You have been trying to get an exposé on conditions inside Bleakwood Asylum published for a year, and no editor will touch it. What did you already know about this patient’s case before their death made it printable at last?',
      opera:'You have been covering the production’s curse for your paper since the first understudy vanished. What did the soprano tell you, off the record, two nights before she died?',
      yuletide:'You have been quietly courting this family for a Society piece on their Christmas hospitality, and were invited to dine as a guest rather than a journalist. What did the aunt say to you, off the record, that you now very much wish you had written down?',
      duel:'Duels are illegal and therefore excellent copy, and you had a source inside one of the two households. What did your source tell you happened on that ground that the official account leaves out?',
      bride:'You’ve been chasing a story on this marriage for weeks, certain the match was arranged to bury a scandal rather than celebrate a union. What did you learn that the families paid you not to print?',
      lighthouse:'You’ve been trying to get a boatman to row you out to that light for a story on its keeper’s solitude for over a year. What did you finally see out there, once someone agreed to take you?',
      workhouse:'You have been trying for months to get a reporter’s foot inside that workhouse to expose its conditions, and this death has finally given you the excuse. What did the master show you, on your first real visit, to try to buy your silence instead?',
      circus:'You’d been promised an exclusive interview with the aerialist after her six-hundredth performance — the show she never got to finish. What did she tell you beforehand that you haven’t been able to print?'
    },
    sides:[
      {cond:'If you printed something you knew wasn’t fully true…', tone:'Obsession'},
      {cond:'If you profited from someone else’s grief…', tone:'Guilt'}
    ]
  },
  {
    role:'The Climbing Boy',
    flavor:'A chimney sweep’s apprentice, small enough to fit where grown men cannot; has been inside the flues of every great house in the Vale, and seen most of them from the one place nobody thinks to hide anything.',
    setup:{
      seance:'You swept the chimney of the séance house that very morning, and stayed hidden in the flue that night to see what all the fuss was about. What did you see from inside the wall when the candles died?',
      manor:'You have swept every chimney in Bleakwood Manor, including the ones in the sealed east wing, long before it was sealed. What did you see up there once that made you glad it was closed off?',
      ripper:'You sleep rough near the alleys where all three bodies were found, small enough to go unnoticed by everyone, including — you increasingly suspect — the killer. What did you actually see, the night of this third death?',
      debutante:'You swept the chimneys of her family’s townhouse the week of her debut. What did you overhear from inside the flue that no one in that drawing room knew a child could hear?',
      asylum:'You swept the chimneys of Bleakwood Asylum last winter, small enough to pass through flues no door could match. What did you see from inside the walls that would explain how a locked cell let something out?',
      opera:'You clean the flues and the high rigging above the stage, small enough to go where the stagehands cannot. What did you see from above the chandelier the night it refused, for the last time, to stay lit?',
      yuletide:'You swept every chimney in this house the week before Christmas, as you do every year, and were given a plate in the kitchen on the night itself out of the family’s charity. What did you overhear from the scullery while the family dined above you?',
      duel:'You were sleeping rough near the dueling ground, as you often do, and woke before either gentleman arrived. What did you see happen on that ground that neither of them knew a boy was watching?',
      bride:'You have swept the chimneys of the church itself, and know a way down into the old crypt that isn’t on any plan of the building. Who else did you ever show that way down to?',
      lighthouse:'You once climbed the outside of that lighthouse on a dare, all the way to the lamp-room window, and saw something you never told another living soul. What was it — and does it explain what kept that light burning true?',
      workhouse:'You swept the workhouse chimneys the very week of the death, and know that building’s crawlspaces and stairwells better than the master ever will. What did you see from inside the walls that doesn’t match his story about the stairs at all?',
      circus:'You snuck under the canvas the night before opening, small enough to go unnoticed, and watched the riggers test the wire yourself. What did you see them do to it that you have told no one, out of fear of being blamed?'
    },
    sides:[
      {cond:'If you saw something through a wall or a flue you were never meant to see…', tone:'Dread'},
      {cond:'If someone paid for your silence, in coin or in kindness…', tone:'Guilt'}
    ]
  }
];
