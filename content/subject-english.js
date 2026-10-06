/* ============================================================
   QUEST ACADEMY - English content pack
   High school through college English. Tiers 17-32.
   Structure copied from subject-science.js (reference implementation).
   ============================================================ */
(function () {
  "use strict";

  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(rng, arr, n, avoid) {
    var pool = arr.filter(function (w) { return w !== avoid; });
    return shuffle(rng, pool).slice(0, n);
  }
  function band(tier, bands) {
    for (var i = 0; i < bands.length; i++) {
      if (tier <= bands[i][0]) return bands[i][1];
    }
    return bands[bands.length - 1][1];
  }

  /* ---------------- question banks ----------------
     Each item: { q, c:[4 choices], a: index of correct }.
     Bands: 17-20 grades 9-10, 21-24 grades 11-12,
            25-28 college years 1-2, 29-32 college years 3-4. */
  var Q_HS1 = [
    { q: "In the sentence 'She runs quickly,' the word 'quickly' is an:",
      c: ["Adjective", "Noun", "Adverb", "Preposition"], a: 2 },
    { q: "Which sentence uses the apostrophe correctly?",
      c: ["The books cover's are blue", "Its a beautiful day", "They're going to the game", "The cat licked it's paws"], a: 2 },
    { q: "A group of words with a subject and a verb that expresses a complete thought is called:",
      c: ["A fragment", "A phrase", "An independent clause", "A run-on"], a: 2 },
    { q: "Which of these is a run-on sentence?",
      c: ["She ran to the store she forgot her wallet.", "She ran to the store, but she forgot her wallet.", "Because she forgot her wallet, she ran to the store.", "She ran to the store; she forgot her wallet."], a: 0 },
    { q: "A comparison that uses 'like' or 'as' is called a:",
      c: ["Metaphor", "Simile", "Personification", "Hyperbole"], a: 1 },
    { q: "The phrase 'He is a shining star' is an example of a:",
      c: ["Simile", "Metaphor", "Irony", "Allusion"], a: 1 },
    { q: "The central message or insight about life in a story is its:",
      c: ["Plot", "Theme", "Setting", "Conflict"], a: 1 },
    { q: "Saying 'What lovely weather!' during a thunderstorm is an example of:",
      c: ["Metaphor", "Foreshadowing", "Verbal irony", "Symbolism"], a: 2 },
    { q: "In Romeo and Juliet, the two feuding families are the:",
      c: ["Montagues and Capulets", "Tybalts and Mercutios", "Veronas and Mantuas", "Essexes and Tudors"], a: 0 },
    { q: "A long speech delivered by a character alone on stage, revealing inner thoughts, is called a:",
      c: ["Aside", "Soliloquy", "Dialogue", "Chorus"], a: 1 },
    { q: "Who narrates To Kill a Mockingbird?",
      c: ["Atticus Finch", "Boo Radley", "Scout Finch", "Jem Finch"], a: 2 },
    { q: "In To Kill a Mockingbird, Tom Robinson is accused of:",
      c: ["Robbing the bank", "Burning down a house", "Stealing from the courthouse", "Assaulting Mayella Ewell"], a: 3 },
    { q: "In The Great Gatsby, Jay Gatsby is in love with:",
      c: ["Daisy Buchanan", "Jordan Baker", "Myrtle Wilson", "Catherine"], a: 0 },
    { q: "The green light at the end of Daisy's dock symbolizes:",
      c: ["Gatsby's wealth", "Gatsby's hopes and dreams", "Envy of the rich", "The dangers of the sea"], a: 1 }
  ];

  var Q_HS2 = [
    { q: "An appeal to the speaker's credibility or character is:",
      c: ["Pathos", "Logos", "Kairos", "Ethos"], a: 3 },
    { q: "A commercial showing sad shelter animals to encourage donations relies mainly on:",
      c: ["Logos", "Pathos", "Ethos", "Stasis"], a: 1 },
    { q: "An argument built on statistics and logical reasoning appeals to:",
      c: ["Pathos", "Ethos", "Logos", "Mythos"], a: 2 },
    { q: "Repeating the beginning of successive clauses, as in 'I have a dream,' is called:",
      c: ["Alliteration", "Anaphora", "Assonance", "Chiasmus"], a: 1 },
    { q: "Asking a question to make a point rather than to get an answer is a:",
      c: ["Paradox", "Rhetorical question", "Oxymoron", "Euphemism"], a: 1 },
    { q: "A writer's acknowledgment of an opposing viewpoint is a:",
      c: ["Refutation", "Claim", "Concession", "Fallacy"], a: 2 },
    { q: "The pattern of stressed and unstressed syllables in a line of poetry is its:",
      c: ["Rhyme", "Stanza", "Meter", "Tone"], a: 2 },
    { q: "A Shakespearean sonnet has how many lines?",
      c: ["10", "12", "14", "16"], a: 2 },
    { q: "Iambic pentameter means each line has:",
      c: ["Five syllables total", "Ten stressed syllables", "Ten syllables in five unstressed-stressed pairs", "Eight syllables in four pairs"], a: 2 },
    { q: "Aristotle's term for the tragic hero's fatal flaw or error is:",
      c: ["Hubris", "Hamartia", "Catharsis", "Peripeteia"], a: 1 },
    { q: "The emotional release an audience feels at the end of a tragedy is:",
      c: ["Hamartia", "Anagnorisis", "Mimesis", "Catharsis"], a: 3 },
    { q: "An object that stands for something beyond itself, like a dove for peace, is a:",
      c: ["Motif", "Allusion", "Symbol", "Archetype"], a: 2 },
    { q: "A brief reference to another famous work, person, or event is an:",
      c: ["Illusion", "Allegory", "Anecdote", "Allusion"], a: 3 },
    { q: "'Deafening silence' is an example of:",
      c: ["A pun", "A euphemism", "An oxymoron", "A malapropism"], a: 2 }
  ];

  var Q_COL1 = [
    { q: "A strong thesis statement should be:",
      c: ["A simple statement of fact", "Arguable and specific", "A question with no answer", "A summary of every paragraph"], a: 1 },
    { q: "Quotations used in an essay should be:",
      c: ["Left to speak for themselves", "Introduced, cited, and explained", "Placed only in the conclusion", "Always longer than four lines"], a: 1 },
    { q: "In MLA format, an in-text citation for a book typically includes:",
      c: ["The year of publication", "The publisher's name", "The book's ISBN", "The author's last name and page number"], a: 3 },
    { q: "Which of these still requires a citation?",
      c: ["Your own opinion", "A paraphrase of a source's idea", "Common knowledge like 'Paris is in France'", "Data you collected yourself"], a: 1 },
    { q: "In Hamlet, the ghost claims Claudius murdered King Hamlet by:",
      c: ["Stabbing him in his sleep", "Pouring poison in his ear", "Poisoning his wine", "Drowning him in the moat"], a: 1 },
    { q: "'To be, or not to be' is Hamlet's meditation on:",
      c: ["Whether to avenge his father", "Existence and death", "Ophelia's madness", "Fortinbras's invasion"], a: 1 },
    { q: "Polonius's advice 'To thine own self be true' is spoken to:",
      c: ["Hamlet", "Laertes", "Ophelia", "Claudius"], a: 1 },
    { q: "The author of 'The Raven' is:",
      c: ["Walt Whitman", "Emily Dickinson", "Edgar Allan Poe", "Nathaniel Hawthorne"], a: 2 },
    { q: "Moby-Dick was written by:",
      c: ["Mark Twain", "Herman Melville", "Henry James", "Jack London"], a: 1 },
    { q: "The author of Pride and Prejudice is:",
      c: ["Charlotte Bronte", "Jane Austen", "Emily Bronte", "George Eliot"], a: 1 },
    { q: "'1984' and 'Animal Farm' were written by:",
      c: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "Kurt Vonnegut"], a: 2 },
    { q: "The transcendentalist who wrote 'Walden' is:",
      c: ["Ralph Waldo Emerson", "Henry David Thoreau", "Walt Whitman", "Emily Dickinson"], a: 1 },
    { q: "'Ode to a Nightingale' was written by:",
      c: ["John Keats", "Percy Bysshe Shelley", "Lord Byron", "William Wordsworth"], a: 0 },
    { q: "A topic sentence states the main idea of a:",
      c: ["Whole essay", "Body paragraph", "Title page", "Works cited list"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "New Criticism analyzes a text by focusing on:",
      c: ["The author's biography", "The words on the page through close reading", "Readers' emotions only", "Historical archives"], a: 1 },
    { q: "Feminist literary criticism often examines:",
      c: ["Only female authors", "Gender, power, and representation in texts", "Sentence grammar", "Printing history"], a: 1 },
    { q: "Postcolonial criticism studies literature in relation to:",
      c: ["Ancient Rome only", "Empire, colonialism, and their aftermath", "Postmodern architecture", "Medieval manuscripts"], a: 1 },
    { q: "A Marxist reading of a novel would focus on:",
      c: ["The author's dreams", "Class, labor, and economic power", "Rhyme schemes", "Descriptions of weather"], a: 1 },
    { q: "Deconstruction, associated with Jacques Derrida, argues that:",
      c: ["Every text has one fixed meaning", "Language is unstable and texts undercut themselves", "Authors control all meaning", "Only plot matters"], a: 1 },
    { q: "The 'intentional fallacy' warns against:",
      c: ["Reading too closely", "Judging a work by the author's stated intention", "Using biographies at all", "Citing outside sources"], a: 1 },
    { q: "In rhetoric, kairos refers to:",
      c: ["The speaker's reputation", "The opportune moment for an argument", "A logical structure", "Emotional manipulation"], a: 1 },
    { q: "A straw man fallacy:",
      c: ["Attacks the person instead of the argument", "Misrepresents the opponent's position to refute it", "Appeals to popularity", "Uses circular reasoning"], a: 1 },
    { q: "Begging the question is a fallacy in which:",
      c: ["The conclusion is assumed in the premises", "Two choices are falsely presented as the only options", "An expert is cited incorrectly", "Statistics are invented"], a: 0 },
    { q: "Debates over the literary canon center on:",
      c: ["How books are printed", "Which works are deemed essential and who decides", "Candle-making techniques", "Library fines"], a: 1 },
    { q: "The phrase 'dead white males' in canon debates refers critically to:",
      c: ["A Gothic horror trope", "The traditional canon's narrow range of authors", "Shakespeare's tragedies", "A translation method"], a: 1 },
    { q: "Intertextuality is the idea that:",
      c: ["Books should always be read aloud", "Texts shape and are shaped by other texts", "Authors never read each other", "Only one text matters at a time"], a: 1 },
    { q: "An unreliable narrator is one who:",
      c: ["Speaks in dialect", "Cannot be trusted to report events accurately", "Is always the villain", "Never appears on stage"], a: 1 },
    { q: "The 'affective fallacy' cautions against:",
      c: ["Feeling anything while reading", "Judging a work by its emotional effect on readers", "Writing about feelings", "Reading sad poems"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Mara stared at the smoking remains of her science fair volcano. 'Well,' she said, brushing ash from her sleeve, 'that went exactly according to plan.' Behind her, the fire extinguisher hissed its last breath, and the judges scribbled furiously on their clipboards.",
      qs: [
        { q: "Mara's line 'that went exactly according to plan' is an example of:",
          c: ["Simile", "Foreshadowing", "Verbal irony", "Hyperbole"], a: 2 },
        { q: "The humor in this passage comes from:",
          c: ["The judges' clipboards", "The contrast between Mara's calm words and the chaos around her", "The color of the smoke", "Mara's sleeve"], a: 1 }
      ] },
    { band: 24,
      text: "From Shakespeare's Sonnet 18: 'Shall I compare thee to a summer's day? Thou art more lovely and more temperate: Rough winds do shake the darling buds of May, And summer's lease hath all too short a date.'",
      qs: [
        { q: "In these lines, the speaker compares the beloved to:",
          c: ["A winter's night", "A rose", "A summer's day", "The moon"], a: 2 },
        { q: "By calling the beloved 'more temperate,' the speaker claims the beloved is:",
          c: ["Hotter than summer", "Colder than winter", "More mild and constant than summer", "Older than time"], a: 2 }
      ] },
    { band: 28,
      text: "From Hamlet's famous speech: 'To be, or not to be: that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles, and by opposing end them.'",
      qs: [
        { q: "'The slings and arrows of outrageous fortune' is a metaphor for:",
          c: ["Literal weapons", "Life's hardships and misfortunes", "Hamlet's enemies at court", "Bad weather in Denmark"], a: 1 },
        { q: "The central question Hamlet weighs here is:",
          c: ["Whether to marry Ophelia", "Whether to flee Denmark", "Whether to trust the ghost", "Whether to go on living or to die"], a: 3 }
      ] },
    { band: 32,
      text: "Every evening, Elena polished the brass key that opened nothing. The house it belonged to had burned down a decade ago, yet the key still hung on a chain around her neck, warm from her skin. When her daughter asked why she kept it, Elena only smiled and kept polishing.",
      qs: [
        { q: "The brass key most likely symbolizes:",
          c: ["Elena's career as a locksmith", "The daughter's inheritance", "Elena's attachment to a lost past", "A mystery to be solved later"], a: 2 },
        { q: "The detail that the key is 'warm from her skin' suggests:",
          c: ["The key is magical", "Elena has a fever", "The memory is kept alive through constant attention", "The house fire never happened"], a: 2 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put Freytag's plot stages in order, from first to last:",
      steps: ["Exposition: characters and setting are introduced", "Rising action: the conflict builds", "Climax: the turning point", "Resolution: loose ends are tied up"] },
    { band: 24, prompt: "Put the essay writing process in order:",
      steps: ["Prewrite and brainstorm ideas", "Draft the essay", "Revise for ideas and structure", "Edit and proofread the final copy"] },
    { band: 28, prompt: "Put the five-act structure of a Shakespearean play in order:",
      steps: ["Act I: exposition and the inciting incident", "Act II: rising action and complications", "Act III: climax and turning point", "Acts IV and V: falling action and resolution"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "splitinfinitive", name: "Split Infinitive", icon: "✂️", hp: 34, power: 5, xp: 30, coins: [12, 22] },
    { id: "danglingparticiple", name: "Dangling Participle", icon: "🪝", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "clichegolem", name: "Cliche Golem", icon: "🧱", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "passivewraith", name: "Passive Wraith", icon: "👻", hp: 64, power: 8, xp: 54, coins: [18, 34] },
    { id: "theplagiarist", name: "THE PLAGIARIST", icon: "🦹", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am THE PLAGIARIST! Every beautiful sentence you love, I stole first! Your original thoughts end here, in my margins!",
      outro: "No... my stolen words... fading into footnotes... Write on, scholar. The Library is yours." }
  ];

  var NODES = [
    { id: "eng1", name: "Foyer of Fragments", monster: "splitinfinitive" },
    { id: "eng2", name: "Hall of Danglers", monster: "danglingparticiple" },
    { id: "eng3", name: "Cliche Catacombs", monster: "clichegolem" },
    { id: "eng4", name: "The Passive Vaults", monster: "passivewraith" },
    { id: "eng5", name: "The Plagiarist's Sanctum", monster: "theplagiarist", boss: true }
  ];

  /* ---------------- generators ---------------- */
  function choiceGen(tier, h) {
    var bank = band(tier, [[20, Q_HS1], [24, Q_HS2], [28, Q_COL1], [32, Q_COL2]]);
    var item = h.pick(bank);
    var opts = h.shuffle(item.c.slice());
    return { kind: "choice", prompt: item.q,
             choices: opts, answer: opts.indexOf(item.c[item.a]) };
  }
  function storyGen(tier, h) {
    var bank = STORIES.filter(function (s) { return tier >= s.band - 3; });
    if (!bank.length) bank = STORIES;
    var p = h.pick(bank);
    var qq = h.pick(p.qs);
    var opts = h.shuffle(qq.c.slice());
    return { kind: "story", passage: p.text, prompt: qq.q,
             choices: opts, answer: opts.indexOf(qq.c[qq.a]) };
  }
  function orderGen(tier, h) {
    var bank = ORDERS.filter(function (s) { return tier >= s.band - 3; });
    if (!bank.length) bank = ORDERS;
    var s = h.pick(bank);
    return { kind: "order", prompt: s.prompt,
             items: h.shuffle(s.steps.slice()), answer: s.steps.slice() };
  }

  window.SubjectPacks = window.SubjectPacks || {};
  window.SubjectPacks.english = {
    id: "english",
    name: "English",
    icon: "📖",
    dungeon: { name: "The Inkbound Library", icon: "📚",
      desc: "A labyrinth of towering shelves where misused words come alive." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 60000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 150000, order: 60000, default: 30000 }
    }
  };
})();
