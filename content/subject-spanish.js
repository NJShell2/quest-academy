/* ============================================================
   QUEST ACADEMY - Spanish content pack (ELECTIVE)
   High school through college Spanish. Tiers 17-32.
   Mexican Spanish is used where regional variants differ.
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
    { q: "Which Spanish word is a cognate meaning 'animal'?",
      c: ["Animale", "Animal", "Animel", "Animala"], a: 1 },
    { q: "How do you say 'good morning' in Spanish?",
      c: ["Buenas noches", "Buenos días", "Buenas tardes", "Adiós"], a: 1 },
    { q: "How do you say the number 'seven' in Spanish?",
      c: ["Seis", "Ocho", "Siete", "Cinco"], a: 2 },
    { q: "What does 'gracias' mean?",
      c: ["Please", "Hello", "Thank you", "Goodbye"], a: 2 },
    { q: "The Spanish color word 'rojo' means:",
      c: ["Blue", "Green", "Yellow", "Red"], a: 3 },
    { q: "What does 'por favor' mean?",
      c: ["Thank you", "Please", "Excuse me", "You're welcome"], a: 1 },
    { q: "You use 'estoy' (a form of estar) for 'I am' when you mean:",
      c: ["I am happy (a feeling)", "I am a student (identity)", "I am from Mexico (origin)", "I am tall (description)"], a: 0 },
    { q: "The correct present-tense form of 'hablar' for 'tú' is:",
      c: ["hablo", "hablas", "habla", "hablan"], a: 1 },
    { q: "'La casa' means:",
      c: ["The car", "The house", "The cat", "The table"], a: 1 }
  ];

  var Q_HS2 = [
    { q: "The present-tense form of 'beber' for 'ellos' is:",
      c: ["beben", "bebieron", "beba", "bebemos"], a: 0 },
    { q: "The present-tense form of 'vivir' for 'yo' is:",
      c: ["vives", "vivo", "viva", "viví"], a: 1 },
    { q: "'Tengo hambre' means:",
      c: ["I am angry", "I am hungry", "I am thirsty", "I am tired"], a: 1 },
    { q: "The preterite (simple past) form of 'hablar' for 'yo' is:",
      c: ["hablo", "hablé", "hablaba", "hablaré"], a: 1 },
    { q: "The preterite form of 'comer' for 'él' is:",
      c: ["come", "comió", "comía", "coma"], a: 1 },
    { q: "In 'Me gusta el café,' the word 'me' is:",
      c: ["A subject pronoun", "An indirect object pronoun", "A possessive adjective", "A verb ending"], a: 1 },
    { q: "Which sentence uses the imperfect to describe an ongoing past action?",
      c: ["Hablé con María ayer.", "De niño, jugaba en el parque.", "Comí tacos anoche.", "Llegó a las tres."], a: 1 },
    { q: "'Tener que' followed by an infinitive means:",
      c: ["To want to", "To have to (must)", "To be able to", "To like to"], a: 1 },
    { q: "'Está cansada' (she is tired) uses 'estar' because being tired is:",
      c: ["A permanent trait", "A temporary condition", "Her profession", "Her origin"], a: 1 }
  ];

  var Q_COL1 = [
    { q: "Complete the sentence: 'Quiero que tú ___' (I want you to speak).",
      c: ["hablas", "habla", "hables", "hablar"], a: 2 },
    { q: "Which expression typically triggers the subjunctive in the clause that follows it?",
      c: ["Creo que", "Es obvio que", "Quiero que", "Es verdad que"], a: 2 },
    { q: "The formal (usted) command of 'hablar' is:",
      c: ["habla", "hable", "hables", "hablar"], a: 1 },
    { q: "The informal (tú) affirmative command of 'comer' is:",
      c: ["come", "coma", "comes", "comer"], a: 0 },
    { q: "Complete the sentence: 'Este regalo es ___ ti' (This gift is for you).",
      c: ["por", "para", "de", "en"], a: 1 },
    { q: "'Por' (not 'para') is used to express:",
      c: ["Purpose or destination", "Duration of time or exchange", "Permanent identity", "Direct commands"], a: 1 },
    { q: "Which of these is one of the six AP Spanish Language themes?",
      c: ["La ciencia y la tecnología", "La cocina francesa", "El fútbol americano", "La moda italiana"], a: 0 },
    { q: "'Dudo que' (I doubt that) requires the subjunctive because it expresses:",
      c: ["Certainty", "Doubt", "A command", "A fact"], a: 1 },
    { q: "The negative tú command of 'hablar' (don't speak) is:",
      c: ["habla", "no habla", "no hables", "no hablar"], a: 2 }
  ];

  var Q_COL2 = [
    { q: "The imperfect subjunctive form of 'hablar' for 'yo' is:",
      c: ["hable", "hablara", "hablé", "hablaba"], a: 1 },
    { q: "Complete the contrary-to-fact sentence: 'Si tuviera dinero, ___.'",
      c: ["viajo", "viajaría", "viaje", "viajaba"], a: 1 },
    { q: "'Si estudias, aprobarás' is an example of a:",
      c: ["Contrary-to-fact si clause", "Real (probable) si clause", "Si clause needing the subjunctive", "Past perfect si clause"], a: 1 },
    { q: "Miguel de Cervantes wrote:",
      c: ["Cien años de soledad", "Don Quixote", "La casa de Bernarda Alba", "El laberinto de la soledad"], a: 1 },
    { q: "Gabriel García Márquez is the best-known author of:",
      c: ["Magical realism", "The Generation of '98", "Surrealist poetry", "Existentialist theater"], a: 0 },
    { q: "In Don Quixote, Sancho Panza is:",
      c: ["A duke", "Don Quixote's squire", "A windmill keeper", "A priest"], a: 1 },
    { q: "In most of Latin America (including Mexico), the everyday word for 'you all' is:",
      c: ["vosotros", "ustedes", "vos", "tuyos"], a: 1 },
    { q: "A speaker from Spain might say 'vosotros habláis,' but a Mexican speaker would most likely say:",
      c: ["vosotros hablan", "ustedes hablan", "tú hablas", "ellos habláis"], a: 1 },
    { q: "Complete the sentence: 'Espero que ya lo ___' (I hope he has already done it).",
      c: ["haya hecho", "ha hecho", "hiciera", "hace"], a: 0 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Hola. Me llamo Ana. Vivo en México. (I live in Mexico.) Tengo quince años. (I am fifteen years old.) Me gusta el café y me gustan los tacos. Mi hermano se llama Diego. Él tiene diez años. Nosotros hablamos español en casa.",
      qs: [
        { q: "How old is Ana?",
          c: ["Ten", "Twelve", "Fifteen", "Twenty"], a: 2 },
        { q: "What language do Ana and Diego speak at home?",
          c: ["English", "French", "Portuguese", "Spanish"], a: 3 }
      ] },
    { band: 26,
      text: "Ayer Lucía estudió toda la tarde porque tenía un examen de historia. Mientras estudiaba, su mamá preparó la cena. Cuando Lucía terminó, ya eran las nueve. 'Espero que saque una buena nota,' dijo su mamá. Lucía sonrió: había trabajado mucho.",
      qs: [
        { q: "Why did Lucía study all afternoon?",
          c: ["She had a history exam", "She likes studying", "Her mom asked her to cook", "She missed school"], a: 0 },
        { q: "What was Lucía's mom doing while Lucía studied?",
          c: ["She was working", "She was preparing dinner", "She was sleeping", "She was reading"], a: 1 }
      ] },
    { band: 32,
      text: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, vivía un hidalgo que pasaba sus días leyendo libros de caballerías. Tanto leyó que perdió el juicio y decidió salir al mundo como caballero andante, llamándose don Quixote. Su escudero, Sancho Panza, lo siguió más por lealtad que por creer en gigantes.",
      qs: [
        { q: "According to the passage, why did the hidalgo lose his judgment?",
          c: ["He read too many chivalry books", "He was poisoned", "He lost his money", "He fought in a war"], a: 0 },
        { q: "Why did Sancho Panza follow don Quixote?",
          c: ["For money", "Out of loyalty", "He believed in giants", "He was forced"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put these words in order to build a correct Spanish sentence:",
      steps: ["Yo", "hablo", "español", "todos los días"] },
    { band: 26, prompt: "Put these steps in order to form the present subjunctive of a regular verb:",
      steps: ["Take the 'yo' form of the present tense", "Drop the -o ending", "Add the opposite endings (-e, -es, -e...)", "Result: hable, hables, hable, hablemos"] },
    { band: 32, prompt: "Put these words in order to build a correct subjunctive sentence:",
      steps: ["Quiero", "que", "tú", "hables despacio"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "sombrerito", name: "Sombrerito", icon: "🤠", hp: 44, power: 6, xp: 38, coins: [14, 30] },
    { id: "jaguarjoven", name: "Jaguar Joven", icon: "🐆", hp: 56, power: 7, xp: 46, coins: [14, 30] },
    { id: "elolvido", name: "EL OLVIDO", icon: "🌑", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am EL OLVIDO, the Forgetting! Every word you learn, I will steal! Habla... if you still can!",
      outro: "No... my shadows... lifting... ¡Tus palabras son más fuertes! The Plaza is yours, scholar!" }
  ];

  var NODES = [
    { id: "spa1", name: "Mercado Entrance", monster: "sombrerito" },
    { id: "spa2", name: "Jaguar Courtyard", monster: "jaguarjoven" },
    { id: "spa3", name: "Plaza of the Forgetting", monster: "elolvido", boss: true }
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
  window.SubjectPacks.spanish = {
    id: "spanish",
    name: "Spanish",
    icon: "🇲🇽",
    elective: true,
    dungeon: { name: "The Sunlit Plaza", icon: "☀️",
      desc: "A bright Mexican plaza where forgotten words drift like dust in the afternoon light." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 50000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 130000, order: 60000, default: 30000 }
    }
  };
})();
