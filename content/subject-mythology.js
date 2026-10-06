/* ============================================================
   QUEST ACADEMY - Mythology content pack (ELECTIVE)
   High school through college mythology. Tiers 17-32.
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
    { q: "Which god ruled as king of the Olympian gods?",
      c: ["Poseidon", "Zeus", "Hades", "Apollo"], a: 1 },
    { q: "Which god ruled the sea and carried a trident?",
      c: ["Zeus", "Hephaestus", "Poseidon", "Hermes"], a: 2 },
    { q: "Which god ruled the underworld, the realm of the dead?",
      c: ["Ares", "Apollo", "Hades", "Hephaestus"], a: 2 },
    { q: "Athena was the goddess of:",
      c: ["Love", "Wisdom and war strategy", "The hunt", "Marriage"], a: 1 },
    { q: "Apollo was the god of:",
      c: ["The sun and music", "The sea", "Fire and the forge", "Messages"], a: 0 },
    { q: "Artemis was the goddess of:",
      c: ["Wisdom", "Love", "The hunt", "The harvest"], a: 2 },
    { q: "Ares was the god of:",
      c: ["War", "Wine", "Sleep", "Trade"], a: 0 },
    { q: "Aphrodite was the goddess of:",
      c: ["Marriage", "Wisdom", "Love and beauty", "The moon"], a: 2 },
    { q: "Which god forged weapons and armor for the gods?",
      c: ["Ares", "Hermes", "Apollo", "Hephaestus"], a: 3 },
    { q: "Hermes served the gods as their:",
      c: ["Blacksmith", "Messenger", "Judge", "Gardener"], a: 1 },
    { q: "Demeter was the goddess of:",
      c: ["The harvest and grain", "The sea", "War", "Love"], a: 0 },
    { q: "Hera was the goddess of:",
      c: ["Marriage and family", "The hunt", "Wisdom", "The forge"], a: 0 },
    { q: "The Trojan War began when Paris carried off Helen, the wife of:",
      c: ["Agamemnon", "Menelaus", "Hector", "Odysseus"], a: 1 },
    { q: "The trick of the wooden horse was devised by:",
      c: ["Achilles", "Hector", "Odysseus", "Menelaus"], a: 2 }
  ];

  var Q_HS2 = [
    { q: "Odysseus spent ten years trying to return home to which island?",
      c: ["Crete", "Ithaca", "Delos", "Rhodes"], a: 1 },
    { q: "Penelope delayed her suitors by claiming she was weaving:",
      c: ["A sail for a warship", "A burial shroud for Laertes", "A wedding dress", "A map of Ithaca"], a: 1 },
    { q: "Trapped in the Cyclops's cave, Odysseus told Polyphemus his name was:",
      c: ["Achilles", "Nobody", "Hector", "Zeus"], a: 1 },
    { q: "To survive the Sirens, Odysseus ordered his crew to:",
      c: ["Tie themselves to the mast", "Plug their ears with beeswax", "Wear blindfolds", "Sing louder than the Sirens"], a: 1 },
    { q: "The Nemean lion's hide could not be pierced, so Hercules defeated it by:",
      c: ["Shooting it with arrows", "Strangling it with his bare hands", "Stabbing it with a sword", "Drowning it in a river"], a: 1 },
    { q: "Hercules defeated the many-headed Hydra with the help of Iolaus, who:",
      c: ["Shot flaming arrows", "Cauterized each neck stump with fire", "Held up a bronze shield", "Sang the Hydra to sleep"], a: 1 },
    { q: "Perseus avoided looking directly at Medusa by:",
      c: ["Closing his eyes", "Watching her reflection in his shield", "Fighting only at night", "Wearing a blindfold"], a: 1 },
    { q: "Which god lent Perseus winged sandals for his quest?",
      c: ["Ares", "Apollo", "Hermes", "Hephaestus"], a: 2 },
    { q: "How many labors did Hercules have to perform?",
      c: ["Seven", "Nine", "Ten", "Twelve"], a: 3 },
    { q: "Penelope and Odysseus's son was named:",
      c: ["Telemachus", "Orestes", "Achilles", "Paris"], a: 0 },
    { q: "In Greek myth, what turned men to stone?",
      c: ["Medusa's gaze", "The Hydra's breath", "The Sphinx's riddle", "The Minotaur's roar"], a: 0 },
    { q: "On his way home, Perseus rescued the princess Andromeda from:",
      c: ["A sea monster", "A dragon's cave", "The labyrinth", "A burning tower"], a: 0 }
  ];

  var Q_COL1 = [
    { q: "Odin sacrificed one of his eyes to drink from:",
      c: ["Mimir's well of wisdom", "The fountain of youth", "The spring of Hel", "The well of the Norns"], a: 0 },
    { q: "Thor's mighty hammer was named:",
      c: ["Gungnir", "Mjolnir", "Gram", "Tyrfing"], a: 1 },
    { q: "Loki caused the death of the beloved god Baldr by tricking the blind Hodr into throwing:",
      c: ["An iron spear", "A sprig of mistletoe", "A poisoned arrow", "A stone hammer"], a: 1 },
    { q: "In Norse myth, the final battle that destroys the gods and the world is called:",
      c: ["Valhalla", "Yggdrasil", "Ragnarok", "Niflheim"], a: 2 },
    { q: "The Norse hall where warriors slain in battle feasted was:",
      c: ["Hel", "Niflheim", "Midgard", "Valhalla"], a: 3 },
    { q: "The Egyptian sun god Ra was said to cross the sky in:",
      c: ["A chariot of fire", "A solar boat", "On the back of a falcon", "A cloud barge"], a: 1 },
    { q: "Osiris ruled as god of:",
      c: ["The Nile floods", "The desert", "The dead and the afterlife", "War"], a: 2 },
    { q: "After Set murdered Osiris and scattered his body, Isis:",
      c: ["Fled to Greece", "Turned Set to stone", "Gathered his pieces and restored him", "Crowned herself pharaoh"], a: 2 },
    { q: "The jackal-headed god Anubis presided over:",
      c: ["Harvests", "Sea voyages", "Mummification and the dead", "Battles"], a: 2 },
    { q: "In the weighing of the heart ceremony, the deceased's heart was weighed against:",
      c: ["A gold coin", "A feather of Maat", "A stone", "A loaf of bread"], a: 1 },
    { q: "Odin's two ravens were named:",
      c: ["Huginn and Muninn", "Freki and Geri", "Sleipnir and Fenrir", "Njord and Frey"], a: 0 },
    { q: "The great tree connecting the nine Norse worlds was:",
      c: ["Yggdrasil", "Bifrost", "Mimir", "Gungnir"], a: 0 }
  ];

  var Q_COL2 = [
    { q: "In Joseph Campbell's hero's journey, the stage where the hero leaves the familiar world is:",
      c: ["The return", "The call to adventure", "The ordeal", "The reward"], a: 1 },
    { q: "The final stage of Campbell's monomyth, in which the hero comes back changed, is:",
      c: ["The road of trials", "The meeting with the goddess", "The belly of the whale", "The return with the elixir"], a: 3 },
    { q: "Campbell called the single story pattern behind the world's hero myths the:",
      c: ["Archetype", "Monomyth", "Theogony", "Etiology"], a: 1 },
    { q: "In Campbell's stages, the 'belly of the whale' represents:",
      c: ["The literal end of the story", "A great feast", "The hero's symbolic death and rebirth", "The hero's birth"], a: 2 },
    { q: "The Norse trickster Loki most closely parallels which figure in West African tradition?",
      c: ["Anansi the spider", "Thor", "Odin", "Baldr"], a: 0 },
    { q: "In the myths of many Plains and Southwest peoples, the best-known trickster animal is:",
      c: ["The bison", "The eagle", "The coyote", "The rattlesnake"], a: 2 },
    { q: "Which of these is a trickster figure in Greek myth?",
      c: ["Hermes", "Athena", "Hera", "Demeter"], a: 0 },
    { q: "Scholars often say myths serve a culture as a charter that:",
      c: ["Records exact historical dates", "Explains origins and justifies customs", "Lists children's games", "Replaces written law"], a: 1 },
    { q: "The flood story in Genesis has a famous parallel in:",
      c: ["The Odyssey", "The Epic of Gilgamesh", "The Aeneid", "Beowulf"], a: 1 },
    { q: "The Greek Prometheus, who stole fire for humans, is most like which Polynesian figure?",
      c: ["Maui", "Tangaroa", "Pele", "Rangi"], a: 0 },
    { q: "A myth that explains why something is the way it is, like why spiders spin webs, is called:",
      c: ["A theogony", "A cosmogony", "An eschatology", "An etiological myth"], a: 3 },
    { q: "Myths about the origin of the universe itself are called:",
      c: ["Cosmogony", "Theogony", "Eschatology", "Hagiography"], a: 0 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "After Prometheus stole fire for mankind, Zeus wanted revenge. He ordered Hephaestus to shape the first woman from clay, and every god gave her a gift. They named her Pandora, 'all-gifted.' Zeus gave her a sealed jar and warned her never to open it. But curiosity won. Pandora lifted the lid, and out flew sickness, sorrow, and every evil now loose in the world. She slammed the lid shut just in time to trap one thing inside: hope.",
      qs: [
        { q: "Why did Zeus create Pandora?",
          c: ["To reward mankind", "To punish mankind after the theft of fire", "To marry Prometheus", "To guard the jar forever"], a: 1 },
        { q: "What remained trapped inside the jar?",
          c: ["Fire", "Gold", "Hope", "The gods' gifts"], a: 2 }
      ] },
    { band: 26,
      text: "Thor once went fishing with the giant Hymir, but no ordinary bait would do. Thor tore the head off one of Hymir's oxen and rowed far out to sea. He dropped his line into the deep, and something enormous took the hook: Jormungandr, the Midgard Serpent, the beast destined to slay Thor at Ragnarok. Thor hauled the serpent up and raised his hammer, but Hymir, terrified, cut the line. The serpent sank back into the dark, and the two must meet again at the end of the world.",
      qs: [
        { q: "What did Thor use as bait?",
          c: ["A magic worm", "An ox head", "A golden ring", "A piece of his cloak"], a: 1 },
        { q: "Why did Thor fail to kill the serpent?",
          c: ["His hammer broke", "Hymir cut the fishing line", "The serpent was too heavy to lift", "Odin ordered him to stop"], a: 1 }
      ] },
    { band: 32,
      text: "Two peoples, an ocean apart, told the same story. The Greeks said the Titan Prometheus stole fire from the gods and hid it in a fennel stalk to warm freezing humans. The Maori of New Zealand said the trickster Maui stole fire from his grandmother Mahuika, fingernail by fingernail, until she hurled her last burning nail at him and set the forests alight. Both heroes were punished for their theft, and both peoples lit their hearths with stolen flame.",
      qs: [
        { q: "What do the Prometheus and Maui stories share?",
          c: ["Both heroes steal fire for humans and are punished", "Both heroes become kings", "Both stories come from Greece", "Both heroes steal water"], a: 0 },
        { q: "Why do scholars compare myths from far-apart cultures?",
          c: ["To prove one copied the other", "To find shared human patterns and concerns", "To decide which myth is true", "To translate the languages"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put these events of the Trojan War in order, from first to last:",
      steps: ["Eris hurls the golden apple at the wedding feast", "Paris awards the apple to Aphrodite and takes Helen to Troy", "The Greeks besiege Troy for ten long years", "Soldiers hidden in the wooden horse open the city gates"] },
    { band: 24, prompt: "Put the events of Perseus's quest in order, from first to last:",
      steps: ["King Polydectes demands the head of Medusa", "Perseus receives gifts from Athena, Hermes, and the nymphs", "Perseus beheads Medusa, guided by his shield's reflection", "Perseus rescues Andromeda and petrifies Polydectes"] },
    { band: 28, prompt: "Put the stages of the hero's journey in order, from first to last:",
      steps: ["The call to adventure", "Crossing the threshold into the unknown", "The ordeal: the greatest trial", "The return home with the elixir"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "harpy", name: "Harpy", icon: "🦅", hp: 42, power: 6, xp: 38, coins: [14, 28] },
    { id: "minotaurcalf", name: "Minotaur Calf", icon: "🐂", hp: 56, power: 8, xp: 48, coins: [18, 30] },
    { id: "cronus", name: "CRONUS THE TITAN", icon: "⏳", hp: 175, power: 10, xp: 135, coins: [60, 100],
      boss: true,
      intro: "I am CRONUS, king of the Titans! I devoured my own children to keep my throne! Come then, little scholar, and be swallowed by time itself!",
      outro: "No... my scythe falls... my reign ends... The Pantheon is yours now, keeper of stories." }
  ];

  var NODES = [
    { id: "myth1", name: "Harpy Roost", monster: "harpy" },
    { id: "myth2", name: "Labyrinth Halls", monster: "minotaurcalf" },
    { id: "myth3", name: "Throne of the Titan", monster: "cronus", boss: true }
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
  window.SubjectPacks.mythology = {
    id: "mythology",
    name: "Mythology",
    icon: "🏛️",
    elective: true,
    dungeon: { name: "The Pantheon", icon: "🏛️",
      desc: "Marble halls where the old myths walk again and the gods are watching." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 50000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 130000, order: 60000, default: 30000 }
    }
  };
})();
