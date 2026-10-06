/* ============================================================
   QUEST ACADEMY: Music Theory content pack (ELECTIVE)
   High school through college music theory, AP-level depth.
   Tiers 17-32. Structure copied from subject-science.js.
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
     Bands: 17-20 grades 9-10 (staff, clefs, note values, rhythm),
            21-24 grades 11-12 (AP Music Theory fundamentals),
            25-28 college years 1-2 (progressions, cadences, 7ths, modes),
            29-32 college years 3-4 (voice leading, chromatic harmony, form). */
  var Q_HS1 = [
    { q: "The treble clef is also called the ___ clef.",
      c: ["F clef", "C clef", "G clef", "A clef"], a: 2 },
    { q: "What note sits on the bottom line of the treble clef staff?",
      c: ["F", "G", "E", "A"], a: 2 },
    { q: "The spaces of the treble clef staff spell (bottom to top):",
      c: ["EGBD", "FACE", "ACEG", "GBDF"], a: 1 },
    { q: "The bass clef is also called the ___ clef.",
      c: ["G clef", "F clef", "C clef", "D clef"], a: 1 },
    { q: "The spaces of the bass clef staff spell (bottom to top):",
      c: ["FACE", "EGBD", "ACEG", "GBDF"], a: 2 },
    { q: "In 4/4 time, a whole note gets how many beats?",
      c: ["2", "3", "4", "1"], a: 2 },
    { q: "How many quarter notes equal one whole note?",
      c: ["2", "3", "4", "8"], a: 2 },
    { q: "The top number of a time signature tells you:",
      c: ["Which note gets one beat", "How many beats are in each measure",
          "How fast to play", "How many lines the staff has"], a: 1 },
    { q: "In 4/4 time, a dotted half note gets how many beats?",
      c: ["2", "4", "3", "1.5"], a: 2 }
  ];

  var Q_HS2 = [
    { q: "The pattern of whole and half steps in a major scale is:",
      c: ["W-H-W-W-H-W-W", "W-W-H-W-W-W-H", "H-W-W-H-W-W-W", "W-W-W-H-W-W-H"], a: 1 },
    { q: "In the C major scale, the half steps fall between:",
      c: ["C-D and F-G", "D-E and G-A", "E-F and B-C", "A-B and D-E"], a: 2 },
    { q: "The interval from C up to G is a:",
      c: ["Perfect fourth", "Major third", "Perfect fifth", "Major sixth"], a: 2 },
    { q: "The interval from C up to E is a:",
      c: ["Minor third", "Major third", "Perfect fourth", "Major second"], a: 1 },
    { q: "A major triad is built from:",
      c: ["Root, minor third, perfect fifth", "Root, major third, perfect fifth",
          "Root, major third, augmented fifth", "Root, perfect fourth, major sixth"], a: 1 },
    { q: "A minor triad differs from a major triad by:",
      c: ["Lowering the fifth a half step", "Lowering the third a half step",
          "Raising the third a half step", "Lowering the root a half step"], a: 1 },
    { q: "A diminished triad is made of:",
      c: ["Two major thirds stacked", "Two minor thirds stacked",
          "A major third over a minor third", "Two perfect fourths stacked"], a: 1 },
    { q: "A key signature with one sharp (F sharp) means the MAJOR key is:",
      c: ["C major", "D major", "F major", "G major"], a: 3 },
    { q: "The relative minor of C major is:",
      c: ["G minor", "A minor", "E minor", "D minor"], a: 1 }
  ];

  var Q_COL1 = [
    { q: "A I-IV-V-I progression in C major uses the chords:",
      c: ["C, F, G, C", "C, G, F, C", "C, D, G, C", "C, F, D, C"], a: 0 },
    { q: "A cadence that moves from V to I is called a(n):",
      c: ["Plagal cadence", "Half cadence", "Deceptive cadence", "Authentic cadence"], a: 3 },
    { q: "The 'Amen' cadence, moving from IV to I, is called a(n):",
      c: ["Plagal cadence", "Authentic cadence", "Half cadence", "Deceptive cadence"], a: 0 },
    { q: "A phrase that ends on the V chord, sounding unfinished, is a:",
      c: ["Half cadence", "Authentic cadence", "Plagal cadence", "Deceptive cadence"], a: 0 },
    { q: "When a V chord resolves to vi instead of the expected I, it is a:",
      c: ["Half cadence", "Plagal cadence", "Deceptive cadence", "Authentic cadence"], a: 2 },
    { q: "A dominant seventh chord adds a ___ to a major triad.",
      c: ["Major seventh", "Minor seventh", "Major sixth", "Perfect fourth"], a: 1 },
    { q: "In the key of C major, the V7 chord is spelled:",
      c: ["G, B, D, F", "G, B, D, F sharp", "C, E, G, B flat", "D, F sharp, A, C"], a: 0 },
    { q: "The Dorian mode is a natural minor scale with a:",
      c: ["Lowered seventh", "Raised sixth", "Raised fourth", "Lowered second"], a: 1 },
    { q: "The Mixolydian mode is a major scale with a:",
      c: ["Lowered seventh", "Raised fourth", "Lowered sixth", "Raised second"], a: 0 }
  ];

  var Q_COL2 = [
    { q: "In strict four-part voice leading, which motion is forbidden between any two voices?",
      c: ["Similar motion", "Oblique motion", "Parallel fifths", "Contrary motion"], a: 2 },
    { q: "The leading tone (scale degree 7) should resolve:",
      c: ["Down by step to the subdominant", "Up by step to the tonic",
          "Down a third to the dominant", "It can leap anywhere"], a: 1 },
    { q: "In the key of C major, the secondary dominant V7/V is the chord:",
      c: ["D7", "G7", "A7", "E7"], a: 0 },
    { q: "A secondary dominant is a dominant chord that temporarily ___ a chord other than the tonic.",
      c: ["Replaces", "Tonicizes", "Inverts", "Cancels"], a: 1 },
    { q: "The three main sections of sonata-allegro form, in order, are:",
      c: ["Development, exposition, recapitulation", "Exposition, development, recapitulation",
          "Exposition, recapitulation, coda", "Introduction, fugue, finale"], a: 1 },
    { q: "In a fugue, the opening statement is the subject, and its restatement in the key of the ___ is the answer.",
      c: ["Tonic", "Subdominant", "Dominant", "Relative minor"], a: 2 },
    { q: "The Neapolitan chord is a major triad built on the:",
      c: ["Raised fourth scale degree", "Lowered second scale degree",
          "Lowered sixth scale degree", "Raised seventh scale degree"], a: 1 },
    { q: "A modulation to a new key often passes through a ___ chord, which belongs to both keys.",
      c: ["Pivot", "Cadential", "Diminished", "Suspended"], a: 0 },
    { q: "The seventh of a V7 chord is a tendency tone and must resolve:",
      c: ["Up by step", "Down by step", "Up a third", "It can stay put"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "A young flutist opens a new piece. The key signature shows a single sharp, placed on F. The melody begins on G and the final note of the piece is also G.",
      qs: [
        { q: "What major key is the piece in?",
          c: ["C major", "G major", "D major", "F major"], a: 1 },
        { q: "What is the relative minor of that key?",
          c: ["D minor", "A minor", "E minor", "B minor"], a: 2 }
      ] },
    { band: 24,
      text: "A hymn in C major is coming to a close. The last two chords are G major then C major, both in root position, and the soprano melody lands on C. At the dress rehearsal, the director asks the organist to surprise the audience on the final repeat by landing on A minor instead.",
      qs: [
        { q: "Which cadence closes the hymn as written?",
          c: ["Plagal cadence", "Half cadence", "Deceptive cadence", "Authentic cadence"], a: 3 },
        { q: "Landing on A minor instead of C major would create a:",
          c: ["Plagal cadence", "Half cadence", "Deceptive cadence", "Authentic cadence"], a: 2 }
      ] },
    { band: 28,
      text: "A jazz pianist is comping in the key of C major. The band hits a G7 chord built from G, B, D, and F, and then resolves it to a C major triad. The pianist is careful about how the F in the chord moves into the next chord.",
      qs: [
        { q: "What type of seventh chord is G7 in this key?",
          c: ["Major seventh", "Minor seventh", "Dominant seventh", "Half-diminished seventh"], a: 2 },
        { q: "The F, the seventh of the chord, should resolve:",
          c: ["Up by step to G", "Down by step to E", "Up a third to A", "It can leap anywhere"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put these keys in circle-of-fifths order, starting from C and moving sharpward:",
      steps: ["C major: no sharps or flats", "G major: 1 sharp (F sharp)",
              "D major: 2 sharps (F sharp, C sharp)", "A major: 3 sharps (F sharp, C sharp, G sharp)"] },
    { band: 24, prompt: "Put the first four sharps in the correct order of sharps:",
      steps: ["F sharp comes first", "C sharp comes second", "G sharp comes third", "D sharp comes fourth"] },
    { band: 28, prompt: "Put these chords in the order of a classic I-IV-V-I progression in C major:",
      steps: ["C major, the tonic (I)", "F major, the subdominant (IV)",
              "G major, the dominant (V)", "C major, back home to the tonic (I)"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "flatfiend", name: "Flat Fiend", icon: "🎺", hp: 42, power: 6, xp: 38, coins: [14, 26] },
    { id: "rhythmrattler", name: "Rhythm Rattler", icon: "🥁", hp: 56, power: 7, xp: 46, coins: [18, 30] },
    { id: "cacophony", name: "CACOPHONY", icon: "🔊", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am CACOPHONY! I smash every scale and shatter every chord! Your harmony ends HERE!",
      outro: "No... my noise... resolving... into music... The Harmonic Halls sing again, scholar!" }
  ];

  var NODES = [
    { id: "mus1", name: "Overture Gate", monster: "flatfiend" },
    { id: "mus2", name: "Crescendo Corridor", monster: "rhythmrattler" },
    { id: "mus3", name: "The Silent Stage", monster: "cacophony", boss: true }
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
  window.SubjectPacks.musictheory = {
    id: "musictheory",
    name: "Music Theory",
    icon: "🎵",
    elective: true,
    dungeon: { name: "The Harmonic Halls", icon: "🎼",
      desc: "A grand concert hall where every wrong note takes on a life of its own." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 45000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 120000, order: 60000, default: 30000 }
    }
  };
})();
