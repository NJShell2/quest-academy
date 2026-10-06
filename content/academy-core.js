/* ============================================================
   QUEST ACADEMY - core content pack (heroes, beasts, shop, ladder)
   This file is PURE CONTENT. The engine in ../engine/ never
   contains subject matter.

   Quest Academy is the older-student sibling of Reading Quest:
   seven dungeons of knowledge from high school through college.
   Each subject ships as one file registering
     window.SubjectPacks.<id> = { id, name, icon, dungeon, monsters,
       nodes, gens, pacing }
   This core file assembles them into window.ContentPacks.academy.

   Subject pack contract:
     id, name, icon: identity
     dungeon: { name, icon, desc } - the themed dungeon area
     monsters: [{ id, name, icon, hp, power, xp, coins:[lo,hi],
                  boss?, intro?, outro? }] (boss has intro/outro)
     nodes: [{ id, name, monster }] - the dungeon map path
     gens: [function(tier, helpers)] - question generators.
       Each returns a question object:
         { kind, prompt, choices, answer, passage, items, timeMs, tier }
       kind: "choice" | "story" | "order"
       - choice: prompt + choices[4], answer = index of correct
       - story:  passage shown, then prompt + choices, answer index
       - order:  prompt + items (shuffled), answer = correct order array
       Every question is tagged with its ladder tier (engine sets q.tier).
     pacing: { fastMs: {kind:ms}, slowMs: {kind:ms} } - per-kind
       speed calibration for the adaptive engine.

   The ladder: 32 tiers, two per grade. Quest Academy covers tiers
   17-32 (Grade 9 Early through College Year 4 Late). Heroes start at
   tier 17 in every subject and adapt per subject independently.
   ============================================================ */
(function () {
  "use strict";

  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = 0; i < a.length; i++) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(rng, arr, n, avoid) {
    var pool = arr.filter(function (w) { return w !== avoid; });
    return shuffle(rng, pool).slice(0, n);
  }
  /* Pick the content band for a ladder tier. bands = [[maxTier, bank], ...]
     in ascending order. Tiers above the last band reuse the hardest bank. */
  function band(tier, bands) {
    for (var i = 0; i < bands.length; i++) {
      if (tier <= bands[i][0]) return bands[i][1];
    }
    return bands[bands.length - 1][1];
  }

  /* ---------------- the six heroes (continuity with Reading Quest,
     flavor reframed to be subject-neutral) ---------------- */
  var CLASSES = [
    {
      id: "knight", name: "Codebreaker Knight", title: "Knight",
      strategy: "Pattern Breaker",
      desc: "Cracks codes and patterns wherever they hide. Turns hard problems into small steps.",
      icon: "🛡️", color: "#e8b34b",
      hp: 40, power: 6,
      spells: [
        { name: "Rune Slash", icon: "⚔️", mult: 1.0, level: 1, desc: "A quick slash of pure focus." },
        { name: "Shield Bash", icon: "🛡️", mult: 1.4, level: 3, desc: "A heavy bash, perfectly timed." },
        { name: "Breakthrough Wave", icon: "🌊", mult: 1.9, level: 5, desc: "A wave of breakthroughs crashes down." },
        { name: "Codebreaker Fury", icon: "🔥", mult: 2.6, level: 8, desc: "The ultimate: every defense bends to your will." }
      ],
      familiar: { egg: "Rune Egg", baby: "Bookwyrm", adult: "Tome Drake", icons: ["🥚", "🐛", "🐉"] },
      gens: []
    },
    {
      id: "monk", name: "Echo Monk", title: "Monk",
      strategy: "Deep Listener",
      desc: "Hears what others miss. A calm, focused mind cuts through any confusion.",
      icon: "🔔", color: "#7bc4ff",
      hp: 38, power: 6,
      spells: [
        { name: "Echo Palm", icon: "👋", mult: 1.0, level: 1, desc: "A palm strike of perfect focus." },
        { name: "Twin Fist", icon: "✊", mult: 1.4, level: 3, desc: "Two fists, one rhythm." },
        { name: "Spirit Split", icon: "🌀", mult: 1.9, level: 5, desc: "Split any defense apart." },
        { name: "Silent Thunder", icon: "⛈️", mult: 2.6, level: 8, desc: "Heard by no one. Felt by everyone." }
      ],
      familiar: { egg: "Bell Egg", baby: "Chimekit", adult: "Resonance Tiger", icons: ["🥚", "🐱", "🐯"] },
      gens: []
    },
    {
      id: "wizard", name: "Sight Wizard", title: "Wizard",
      strategy: "Quick Thinker",
      desc: "Sees the heart of a problem in a flash. Strikes before doubt can form.",
      icon: "🧙", color: "#9b7bff",
      hp: 32, power: 8,
      spells: [
        { name: "Mind Zap", icon: "⚡", mult: 1.0, level: 1, desc: "Zap the problem the moment you see it." },
        { name: "Flash Bolt", icon: "🌩️", mult: 1.4, level: 3, desc: "A bolt of instant insight." },
        { name: "Mind Library", icon: "📚", mult: 1.9, level: 5, desc: "Everything you ever learned, unleashed." },
        { name: "Omnisight Storm", icon: "🌪️", mult: 2.6, level: 8, desc: "No problem can hide from your sight." }
      ],
      familiar: { egg: "Star Egg", baby: "Blinkbat", adult: "Gaze Griffin", icons: ["🥚", "🦇", "🦅"] },
      gens: []
    },
    {
      id: "archer", name: "Fleetfoot Archer", title: "Archer",
      strategy: "Swift Striker",
      desc: "Fast, precise, relentless. Never wastes a move.",
      icon: "🏹", color: "#6fd66f",
      hp: 34, power: 7,
      spells: [
        { name: "Quick Shot", icon: "➶", mult: 1.0, level: 1, desc: "One fast, true arrow." },
        { name: "Double Volley", icon: "🏹", mult: 1.4, level: 3, desc: "Two arrows, twice as smooth." },
        { name: "Wind Runner", icon: "💨", mult: 1.9, level: 5, desc: "Outrun every obstacle." },
        { name: "Thousand Arrow Rain", icon: "🌧️", mult: 2.6, level: 8, desc: "Precision becomes a storm." }
      ],
      familiar: { egg: "Feather Egg", baby: "Zipwing", adult: "Gale Falcon", icons: ["🥚", "🐤", "🦅"] },
      gens: []
    },
    {
      id: "druid", name: "Word Druid", title: "Druid",
      strategy: "Master of Meanings",
      desc: "Grows understanding like a garden. Every idea has roots worth knowing.",
      icon: "🌿", color: "#4fc3a1",
      hp: 36, power: 7,
      spells: [
        { name: "Thorn Strike", icon: "🌵", mult: 1.0, level: 1, desc: "A sharp strike, precisely aimed." },
        { name: "Vine Grasp", icon: "🌱", mult: 1.4, level: 3, desc: "Vines wrap around the foe." },
        { name: "Ancient Roots", icon: "🌳", mult: 1.9, level: 5, desc: "Old, deep roots hold fast." },
        { name: "Forest Awakens", icon: "🌲", mult: 2.6, level: 8, desc: "A whole forest rises to fight." }
      ],
      familiar: { egg: "Seed Egg", baby: "Sproutling", adult: "Elder Treantling", icons: ["🥚", "🌱", "🌳"] },
      gens: []
    },
    {
      id: "bard", name: "Story Bard", title: "Bard",
      strategy: "Keeper of Stories",
      desc: "Remembers every tale ever told. Connects ideas across time.",
      icon: "🎵", color: "#ff9d5c",
      hp: 34, power: 7,
      spells: [
        { name: "Tale Chord", icon: "🎶", mult: 1.0, level: 1, desc: "One true note from the story." },
        { name: "Chorus Blast", icon: "📯", mult: 1.4, level: 3, desc: "The whole chorus joins in." },
        { name: "Epic Verse", icon: "📜", mult: 1.9, level: 5, desc: "A verse of pure understanding." },
        { name: "Legend Song", icon: "🎺", mult: 2.6, level: 8, desc: "The song every hero remembers." }
      ],
      familiar: { egg: "Melody Egg", baby: "Humbird", adult: "Chorus Phoenix", icons: ["🥚", "🐦", "🔥"] },
      gens: []
    }
  ];

  /* ---------------- challenge classes (Beast Within) ---------------- */
  var BEASTS = [
    { id: "minotaur", baseClass: "knight", name: "Minotaur", icon: "🐂",
      desc: "The Knight's beast within. Smashes through the toughest challenges. Harder battles, DOUBLE experience.",
      hp: 60, power: 10 },
    { id: "medusa", baseClass: "wizard", name: "Medusa", icon: "🐍",
      desc: "The Wizard's beast within. Masters the trickiest problems. Harder battles, DOUBLE experience.",
      hp: 48, power: 12 },
    { id: "tigress", baseClass: "archer", name: "Tigress", icon: "🐅",
      desc: "The Archer's beast within. Strikes at lightning speed under brutal timers. Harder battles, DOUBLE experience.",
      hp: 50, power: 11 },
    { id: "treant", baseClass: "druid", name: "Treant", icon: "🌲",
      desc: "The Druid's beast within. Commands ancient, deep knowledge. Harder battles, DOUBLE experience.",
      hp: 54, power: 11 },
    { id: "unicorn", baseClass: "bard", name: "Unicorn", icon: "🦄",
      desc: "The Bard's beast within. Understands the deepest stories and hidden meanings. Harder battles, DOUBLE experience.",
      hp: 50, power: 11 },
    { id: "jackal", baseClass: "monk", name: "Jackal", icon: "🐕",
      desc: "The Monk's beast within. Senses what no one else can. Harder battles, DOUBLE experience.",
      hp: 56, power: 10 }
  ];

  /* ---------------- shop ---------------- */
  var SHOP = [
    { id: "potion", name: "Healing Potion", icon: "🧪", cost: 40,
      desc: "Restores half your health in battle.", effect: "heal" },
    { id: "crystal", name: "Magic Crystal", icon: "💎", cost: 25,
      desc: "Lets you cast one extra spell in battle.", effect: "crystal" },
    { id: "elixir", name: "Power Elixir", icon: "⚗️", cost: 60,
      desc: "Double spell damage for 3 turns.", effect: "elixir" },
    { id: "whetstone", name: "Whetstone", icon: "🪓", cost: 150,
      desc: "Permanent +2 Power for your current hero.", effect: "power" },
    { id: "charm", name: "Heart Charm", icon: "❤️", cost: 150,
      desc: "Permanent +10 max health for your current hero.", effect: "maxhp" },
    { id: "lucky", name: "Lucky Coin", icon: "🪙", cost: 100,
      desc: "Double coins from your next battle.", effect: "lucky" }
  ];

  /* ---------------- loading tips (rotate on title + transitions) ---------------- */
  var TIPS = [
    "Answer questions to cast spells. A correct answer always hits!",
    "Wrong answers only fizzle your spell. They never hurt you.",
    "Low on Magic? Press MEDITATE and answer to refill your meter.",
    "Every hero trains a separate tier in each subject. Science whiz and History hero can both be you.",
    "Blazing through? The Academy raises your tier to match. Struggling? Enjoy a Secret Side Quest detour.",
    "Bosses guard the 7 Seals of Knowledge. Recover them all to stop THE UNMAKER.",
    "Weaken a wild creature below 30% health, then press RESCUE to befriend it.",
    "Your familiar fights beside you and evolves at level 7.",
    "Gear up in your Backpack. Wands, hats, and robes all boost your stats.",
    "Come back daily to open your gift box. Longer streaks earn bigger rewards!",
    "Beast Within forms unlock at hero level 5: harder battles, DOUBLE experience.",
    "New to a monster? Look for the New! badge on the dungeon map."
  ];

  /* ---------------- gear (backpack slots: wand, hat, garb, boots, ring) ---------------- */
  var GEAR = [
    { id: "scholars-wand", name: "Scholar's Wand", icon: "🪄", slot: "wand",
      power: 3, hp: 0, magic: 20,
      desc: "A gift from Professor Wren. It hums with quiet promise." },
    { id: "scholars-cap", name: "Scholar's Cap", icon: "🎓", slot: "hat",
      power: 0, hp: 8, magic: 10,
      desc: "Awarded for choosing your familiar. Smart and stylish." },
    { id: "scholars-robes", name: "Scholar's Robes", icon: "🥋", slot: "garb",
      power: 1, hp: 14, magic: 0,
      desc: "Awarded for rescuing Glimmerfin. Woven with riverlight." },
    { id: "scholars-boots", name: "Scholar's Boots", icon: "🥾", slot: "boots",
      power: 2, hp: 0, magic: 10,
      desc: "Awarded for choosing your wizard name. Made for long quests." },
    { id: "ember-ring", name: "Ember Ring", icon: "🔥", slot: "ring",
      power: 2, hp: 0, magic: 15,
      desc: "A lucky find from your daily gift. Warm to the touch." }
  ];
  var GEAR_SLOTS = ["wand", "hat", "garb", "boots", "ring"];
  var GEAR_SLOT_NAMES = { wand: "Wand", hat: "Hat", garb: "Garb", boots: "Boots", ring: "Ring" };

  /* ---------------- starter familiars (the 5 choices) ---------------- */
  var STARTER_FAMILIARS = [
    { id: "quill", name: "Quill the Inkfox", icon: "🦊", rarity: "Common",
      stats: { power: 4, hearts: 12, magic: 8, speed: 6 },
      desc: "A clever fox who writes battle plans in the margins." },
    { id: "volt", name: "Volt the Circuit Mouse", icon: "🐭", rarity: "Common",
      stats: { power: 5, hearts: 10, magic: 8, speed: 9 },
      desc: "A zippy mouse who reroutes bad luck into good." },
    { id: "tome", name: "Tome the Bookbat", icon: "🦇", rarity: "Uncommon",
      stats: { power: 6, hearts: 12, magic: 12, speed: 5 },
      desc: "A scholarly bat. Knows every page by heart." },
    { id: "flask", name: "Flask the Bubble Frog", icon: "🐸", rarity: "Uncommon",
      stats: { power: 5, hearts: 16, magic: 10, speed: 4 },
      desc: "A bubbly frog. Its croak steadies any hero." },
    { id: "orbit", name: "Orbit the Starpup", icon: "🐶", rarity: "Rare",
      stats: { power: 8, hearts: 14, magic: 14, speed: 8 },
      desc: "A pup born from a falling star. Rare and radiant." }
  ];
  var RARITY_COLORS = { Common: "#9fb2cc", Uncommon: "#6fd66f", Rare: "#7bc4ff" };

  /* ---------------- scripted opening monsters ---------------- */
  var TUTORIAL_MONSTER = { id: "nullbyte", name: "Nullbyte", icon: "👾",
    hp: 40, power: 2, xp: 20, coins: [6, 10],
    intro: "Bzzzt... null... null..." };
  var RESCUE_MONSTER = { id: "glimmerfin", name: "Glimmerfin", icon: "🐬",
    hp: 60, power: 3, xp: 25, coins: [8, 12], rarity: "Uncommon" };

  /* ---------------- wizard name picker ---------------- */
  var NAME_ADJECTIVES = ["Brave", "Clever", "Swift", "Mystic", "Bold", "Curious",
    "Radiant", "Silent", "Wild", "Noble", "Quirky", "Stellar"];
  var NAME_NOUNS = ["Falcon", "Tome", "Comet", "River", "Fox", "Sage",
    "Spark", "Owl", "Voyager", "Cipher", "Beacon", "Raven"];

  /* ---------------- the villain + guide NPCs ---------------- */
  var VILLAIN = { name: "THE UNMAKER", icon: "🌑", title: "Shatterer of the Seals",
    desc: "It unmakes what the Academy protects: knowledge itself." };
  var NPCS = [
    { id: "wren", name: "Professor Wren", icon: "🦉", role: "Academy Guide",
      tips: [
        "Welcome to the Academy, young scholar! I am Professor Wren.",
        "Answer to cast. Your brain is the wand here.",
        "Low on Magic? Meditate. A calm mind refills fastest."
      ] },
    { id: "registrar", name: "the Registrar", icon: "🧑‍🏫", role: "Hall Registrar",
      tips: [
        "New monsters wear a New! badge. Say hello... carefully.",
        "The Electives Wing opens after two core bosses fall.",
        "Math's Infinite Tower opens last. Pace yourself, scholar."
      ] }
  ];

  /* ---------------- assemble subjects in canonical order ----------------
     Core dungeons first, then the Electives Wing, then Math last
     (Nicholas's order: math comes after everything else). */
  var ORDER = ["science", "social", "english", "health", "business", "technology",
               "psychology", "sociology", "law", "mythology", "writing",
               "musictheory", "arthistory", "spanish", "csprinc", "math"];
  var subjects = [];
  ORDER.forEach(function (id) {
    if (window.SubjectPacks && window.SubjectPacks[id]) subjects.push(window.SubjectPacks[id]);
  });

  window.ContentPacks = window.ContentPacks || {};
  window.ContentPacks.academy = {
    id: "academy",
    name: "Quest Academy",
    tagline: "Answer to cast. Learn to win.",
    classes: CLASSES,
    beasts: BEASTS,
    monsters: [], /* monsters live on subjects */
    worlds: [],   /* dungeons live on subjects */
    subjects: subjects,
    shop: SHOP,
    tips: TIPS,
    gear: GEAR,
    gearSlots: GEAR_SLOTS,
    gearSlotNames: GEAR_SLOT_NAMES,
    starterFamiliars: STARTER_FAMILIARS,
    rarityColors: RARITY_COLORS,
    tutorialMonster: TUTORIAL_MONSTER,
    rescueMonster: RESCUE_MONSTER,
    nameAdjectives: NAME_ADJECTIVES,
    nameNouns: NAME_NOUNS,
    villain: VILLAIN,
    npcs: NPCS,
    /* Zone order for the world map: core dungeons unlock sequentially,
       electives unlock after any 2 core bosses, math unlocks last. */
    coreOrder: ["science", "social", "english", "health", "business", "technology", "math"],
    sealCount: 7,
    helpers: { pick: pick, shuffle: shuffle, sample: sample, band: band },
    /* XP needed (cumulative) to reach each level, index = level */
    xpTable: [0, 0, 30, 80, 150, 240, 350, 480, 630, 810, 1000],
    maxLevel: 10,
    beastUnlockLevel: 5,
    beastXpMult: 2,
    /* ---- the ladder: Quest Academy covers tiers 17-32 ----
       32 tiers, two per grade. Tier 17 = Grade 9 Early,
       tier 32 = College Year 4 Late. Heroes start at tier 17
       in every subject and adapt per subject independently. */
    tiers: 32,
    minTier: 17,
    tierLabel: function (t) {
      var g = Math.ceil(t / 2), sub = (t % 2 === 1) ? "Early" : "Late";
      if (g <= 12) return "Grade " + g + " " + sub;
      return "College Year " + (g - 12) + " " + sub;
    },
    beastStartTier: 19,
    /* ---- adaptive pacing: shared cadence; per-kind speed marks
          come from each subject's own pacing ---- */
    pacing: {
      window: 12,
      evalEvery: 6,
      cooldown: 8,
      whizAcc: 0.92,
      stompAcc: 0.45
    }
  };
})();
