/* ============================================================
   QUEST ACADEMY - Creative Writing content pack (ELECTIVE)
   High school through college craft. Tiers 17-32.
   Scaled to the wing: 3 nodes (2 monsters + boss).
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
    { q: "In fiction, the conflict is:",
      c: ["The struggle that drives the story", "The place where the story happens", "The lesson at the very end", "The author's life story"], a: 0 },
    { q: "The setting of a story is:",
      c: ["The main character's name", "The time and place of the story", "The price of the book", "The author's hometown"], a: 1 },
    { q: "Which sentence SHOWS the emotion instead of telling it?",
      c: ["She was very nervous.", "Her hands shook as she set the cup down.", "Nervousness filled her completely.", "She felt a lot of nerves."], a: 1 },
    { q: "Which line punctuates dialogue correctly?",
      c: ["\"Let us go\" she said.", "\"Let us go,\" she said.", "\"Let us go\", she said.", "Let us go, she said."], a: 1 },
    { q: "Original: \"He walked quickly to the door.\" Which revision uses the STRONGEST verb?",
      c: ["He hurried to the door.", "He walked very quickly to the door.", "He moved in a fast way to the door.", "He was walking quickly to the door."], a: 0 },
    { q: "The part of a story that introduces the characters and background is called the:",
      c: ["Climax", "Exposition", "Resolution", "Falling action"], a: 1 },
    { q: "The climax of a story is:",
      c: ["The turning point of greatest tension", "The first scene of the story", "The list of characters", "The dedication page"], a: 0 },
    { q: "Most writing teachers call the best all-purpose dialogue tag:",
      c: ["Exclaimed", "Said", "Articulated", "Opined"], a: 1 },
    { q: "A character's motivation is:",
      c: ["What the character wants and why", "The color of the character's hair", "The actor who plays the character", "The chapter where the character dies"], a: 0 }
  ];

  var Q_HS2 = [
    { q: "A narrator who says \"I\" and takes part in the story uses:",
      c: ["First-person point of view", "Second-person point of view", "Third-person omniscient", "No point of view"], a: 0 },
    { q: "An omniscient narrator:",
      c: ["Knows only one character's thoughts", "Knows the thoughts of every character", "Never enters anyone's mind", "Speaks directly to the reader as you"], a: 1 },
    { q: "Second-person narration addresses the reader as:",
      c: ["I", "He or she", "You", "They"], a: 2 },
    { q: "Third-person limited narration:",
      c: ["Jumps between every character's mind freely", "Stays close to one character's experience", "Uses only dialogue, no thoughts", "Has no narrator at all"], a: 1 },
    { q: "Imagery in prose means language that:",
      c: ["Appeals to the five senses", "Uses only metaphors", "Avoids all description", "Rhymes every line"], a: 0 },
    { q: "\"The parking lot was an oven in July\" is a:",
      c: ["Simile", "Metaphor", "Hyperbole", "Pun"], a: 1 },
    { q: "During revision, a writer should first fix:",
      c: ["Comma placement", "Big-picture issues like plot and character", "Font choice", "Page numbers"], a: 1 },
    { q: "\"Kill your darlings\" means:",
      c: ["Delete every adjective", "Cut beloved lines that do not serve the story", "Never write about family", "Write only at night"], a: 1 },
    { q: "Which sentence uses personification?",
      c: ["The wind whispered through the trees.", "The trees were very tall.", "Wind is moving air.", "The forest had many trees."], a: 0 }
  ];

  var Q_COL1 = [
    { q: "A writer's \"voice\" is:",
      c: ["The volume of audiobooks", "Their distinctive style and personality on the page", "The font they prefer", "How fast they type"], a: 1 },
    { q: "In a dialogue scene, subtext is:",
      c: ["The stage directions", "The real meaning beneath what characters say", "The chapter title", "A summary of the plot"], a: 1 },
    { q: "Which passage is a SCENE rather than summary?",
      c: ["\"Over the summer they drifted apart.\"", "\"Pass the salt,\" she said, not looking up. He set it down hard enough to rattle the plates.", "\"They had been friends for years.\"", "\"The trip changed everything.\""], a: 1 },
    { q: "Mystery stories conventionally promise:",
      c: ["A puzzle or crime the reader can help solve", "A love story with a wedding", "A spaceship battle", "No resolution at all"], a: 0 },
    { q: "Science fiction typically:",
      c: ["Explores the human impact of imagined science or technology", "Retells myths with gods", "Avoids all technology", "Ends every story on Earth"], a: 0 },
    { q: "The romance genre requires:",
      c: ["A central love story with an emotionally satisfying ending", "A wedding in chapter one", "No conflict at all", "A historical setting"], a: 0 },
    { q: "Tone differs from mood because tone is:",
      c: ["What the reader feels", "The writer's attitude toward the subject", "The length of the book", "The cover design"], a: 1 },
    { q: "Diction refers to:",
      c: ["Word choice", "Sentence length only", "Chapter titles", "Punctuation rules"], a: 0 },
    { q: "A writer uses summary instead of a full scene when:",
      c: ["Time must pass quickly without dramatizing it", "The story needs more pages", "Dialogue is too hard to write", "Every moment matters equally"], a: 0 }
  ];

  var Q_COL2 = [
    { q: "An unreliable narrator is one who:",
      c: ["Writes very slowly", "Cannot be fully trusted to report events truthfully", "Uses only short sentences", "Never appears in the story"], a: 1 },
    { q: "Which narrator is most likely unreliable?",
      c: ["One whose account keeps contradicting what other characters report", "One who says \"I walked to the store\"", "One who describes the weather", "One who uses past tense"], a: 0 },
    { q: "A theme differs from a moral because a theme:",
      c: ["Preaches one clear lesson", "Explores an idea without prescribing a single lesson", "Appears only in fables", "Is always stated in the last line"], a: 1 },
    { q: "The first rule of workshop critique is:",
      c: ["Attack the writer's talent", "Discuss the story's choices, never the writer", "Only praise, never question", "Rewrite the story yourself"], a: 1 },
    { q: "The most useful workshop feedback:",
      c: ["Describes the reader's experience and asks questions", "Says only that it was good", "Fixes every comma", "Compares the writer to famous authors"], a: 0 },
    { q: "Stream of consciousness narration:",
      c: ["Lists events in strict order", "Presents thoughts as they occur, often unfiltered", "Uses only dialogue", "Summarizes whole years"], a: 1 },
    { q: "A novel told through letters, emails, or documents is:",
      c: ["Epistolary", "Pastoral", "Gothic", "Picaresque"], a: 0 },
    { q: "Metafiction is fiction that:",
      c: ["Hides its own structure", "Draws attention to itself as a constructed story", "Avoids all narrators", "Is secretly nonfiction"], a: 1 },
    { q: "Flash fiction is:",
      c: ["A novel over 500 pages", "A complete story told in very few words", "A story with no ending", "Poetry set to music"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Mara stared at the letter. Her fingers left damp prints on the envelope. \"I am not going,\" she said. Her voice cracked on the last word, and she folded the letter twice before setting it down.",
      qs: [
        { q: "Which detail SHOWS Mara's fear instead of telling it?",
          c: ["Her fingers left damp prints on the envelope", "Mara was afraid", "Fear filled Mara completely", "Mara felt very scared"], a: 0 },
        { q: "What point of view is the passage written in?",
          c: ["First person", "Third-person limited", "Second person", "Third-person omniscient"], a: 1 }
      ] },
    { band: 26,
      text: "\"Nice of you to finally call,\" Dana said, stacking the plates a little too hard. \"I have been busy,\" Mark said. \"Right. Busy.\" She did not look up. The silence filled the kitchen like a third person at the table.",
      qs: [
        { q: "What is the subtext of Dana's dialogue?",
          c: ["She is thrilled he called", "She is hurt and angry that he stayed away", "She wants cooking advice", "She is only talking about the plates"], a: 1 },
        { q: "The line \"The silence filled the kitchen like a third person at the table\" is an example of:",
          c: ["A simile", "A metaphor", "Personification", "Hyperbole"], a: 0 }
      ] },
    { band: 32,
      text: "I am the most honest man in this town; everyone says so, or they would if they were not jealous. The money was already gone when I found the drawer open, which proves I never took it. Ask anyone. Well, do not ask my brother.",
      qs: [
        { q: "What makes this narrator unreliable?",
          c: ["He contradicts himself while insisting he is honest", "He uses the word I", "He mentions his brother", "He writes in short sentences"], a: 0 },
        { q: "The passage explores dishonesty without preaching a lesson. That makes dishonesty a:",
          c: ["Moral", "Theme", "Plot twist", "Climax"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the writing process in order, from first to last:",
      steps: ["Prewrite: brainstorm and plan", "Draft: get the story down", "Revise: rethink scenes and structure", "Edit and publish: polish and share"] },
    { band: 24, prompt: "Put the steps of building a scene in order:",
      steps: ["Give the character a goal", "Put an obstacle in the way", "Escalate the conflict", "End with an outcome or reversal"] },
    { band: 28, prompt: "Put a revision pass in order, from biggest to smallest fixes:",
      steps: ["Fix big-picture story problems", "Strengthen scenes and dialogue", "Tighten sentences and word choice", "Proofread spelling and punctuation"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "inkling", name: "Inkling", icon: "🖋️", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "clichegolem", name: "Cliche Golem", icon: "🗿", hp: 56, power: 7, xp: 46, coins: [18, 30] },
    { id: "writersblock", name: "WRITER'S BLOCK", icon: "🧱", hp: 150, power: 9, xp: 120, coins: [55, 90],
      boss: true,
      intro: "I am WRITER'S BLOCK! Every page you touch stays BLANK! No story has ever been finished in my domain!",
      outro: "No... the words... they are flowing again... The Story Forge is yours, storyteller!" }
  ];

  var NODES = [
    { id: "wri1", name: "Inkwell Entrance", monster: "inkling" },
    { id: "wri2", name: "Cliche Caverns", monster: "clichegolem" },
    { id: "wri3", name: "The Blank Page", monster: "writersblock", boss: true }
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
  window.SubjectPacks.writing = {
    id: "writing",
    name: "Creative Writing",
    icon: "✒️",
    elective: true,
    dungeon: { name: "The Story Forge", icon: "🔥",
      desc: "An ancient forge where unfinished stories are melted down and rewritten." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 55000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 140000, order: 60000, default: 30000 }
    }
  };
})();
