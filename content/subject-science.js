/* ============================================================
   QUEST ACADEMY - Science content pack (REFERENCE IMPLEMENTATION)
   High school through college science. Tiers 17-32.
   Other subject packs copy this file's structure exactly.
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
    { q: "Which organelle is called the powerhouse of the cell?",
      c: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], a: 2 },
    { q: "What is the chemical formula for water?",
      c: ["CO2", "H2O", "O2", "NaCl"], a: 1 },
    { q: "Which planet is known as the Red Planet?",
      c: ["Venus", "Jupiter", "Mars", "Mercury"], a: 2 },
    { q: "What force pulls objects toward the Earth?",
      c: ["Magnetism", "Friction", "Gravity", "Inertia"], a: 2 },
    { q: "What is the chemical symbol for gold?",
      c: ["Go", "Gd", "Au", "Ag"], a: 2 },
    { q: "What gas do plants absorb from the air for photosynthesis?",
      c: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], a: 2 },
    { q: "At sea level, water boils at:",
      c: ["90 C", "100 C", "110 C", "120 C"], a: 1 },
    { q: "Which blood cells carry oxygen through the body?",
      c: ["White blood cells", "Platelets", "Red blood cells", "Plasma cells"], a: 2 },
    { q: "Newton's third law says that for every action there is:",
      c: ["No reaction", "A greater action", "An equal and opposite reaction", "A delayed reaction"], a: 2 },
    { q: "The dense center of an atom is called the:",
      c: ["Electron cloud", "Nucleus", "Orbital", "Neutron shell"], a: 1 },
    { q: "Rock formed from cooled lava is called:",
      c: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"], a: 2 },
    { q: "Earth takes about how long to orbit the Sun?",
      c: ["One day", "One month", "One year", "One decade"], a: 2 },
    { q: "What shape best describes a DNA molecule?",
      c: ["Single strand", "Triple helix", "Double helix", "Flat sheet"], a: 2 },
    { q: "Which of these is a renewable energy source?",
      c: ["Coal", "Natural gas", "Sunlight", "Petroleum"], a: 2 }
  ];

  var Q_HS2 = [
    { q: "Cellular respiration mainly produces which energy molecule?",
      c: ["Glucose", "ATP", "DNA", "Chlorophyll"], a: 1 },
    { q: "A neutral solution has a pH of:",
      c: ["0", "7", "14", "1"], a: 1 },
    { q: "The equation PV = nRT is known as the:",
      c: ["Ideal gas law", "Law of conservation", "Boyle's law alone", "Charles's law alone"], a: 0 },
    { q: "Mitosis produces:",
      c: ["Four different cells", "Two identical diploid cells", "Two identical haploid cells", "One giant cell"], a: 1 },
    { q: "Which subatomic particle carries a negative charge?",
      c: ["Proton", "Neutron", "Electron", "Photon"], a: 2 },
    { q: "The speed of light in a vacuum is about:",
      c: ["3 x 10^6 m/s", "3 x 10^8 m/s", "3 x 10^10 m/s", "3 x 10^4 m/s"], a: 1 },
    { q: "A Punnett square is used to predict:",
      c: ["Mutation rates", "Offspring genotype probabilities", "Fossil ages", "Protein shapes"], a: 1 },
    { q: "Which type of bond involves SHARING electrons?",
      c: ["Ionic", "Covalent", "Metallic", "Hydrogen (as a bond type)"], a: 1 },
    { q: "In a food chain, producers are:",
      c: ["Herbivores", "Carnivores", "Decomposers", "Autotrophs like plants"], a: 3 },
    { q: "Ocean tides are caused mainly by:",
      c: ["The Sun's heat", "The Moon's gravity", "Earth's spin alone", "Underwater volcanoes"], a: 1 },
    { q: "Which organelle builds proteins?",
      c: ["Ribosome", "Lysosome", "Chloroplast", "Golgi body"], a: 0 },
    { q: "The most abundant gas in Earth's atmosphere is:",
      c: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], a: 2 },
    { q: "Acceleration due to gravity near Earth's surface is about:",
      c: ["1.6 m/s^2", "9.8 m/s^2", "24 m/s^2", "3.7 m/s^2"], a: 1 },
    { q: "Isotopes of an element differ in their number of:",
      c: ["Protons", "Electrons", "Neutrons", "Quarks"], a: 2 }
  ];

  var Q_COL1 = [
    { q: "The first law of thermodynamics states that:",
      c: ["Entropy always increases", "Energy is conserved", "Heat flows cold to hot", "Absolute zero is reachable"], a: 1 },
    { q: "DNA polymerase is the enzyme that:",
      c: ["Unzips DNA", "Synthesizes new DNA strands", "Cuts DNA", "Folds proteins"], a: 1 },
    { q: "The strongest of these intermolecular forces is:",
      c: ["London dispersion", "Dipole-dipole", "Hydrogen bonding", "Induced dipole"], a: 2 },
    { q: "The SI unit of electrical resistance is the:",
      c: ["Volt", "Ampere", "Ohm", "Watt"], a: 2 },
    { q: "The Krebs cycle takes place in the:",
      c: ["Cytoplasm", "Mitochondrial matrix", "Nucleus", "Cell membrane"], a: 1 },
    { q: "One mole of any substance contains about:",
      c: ["6.022 x 10^23 particles", "3.00 x 10^8 particles", "1.60 x 10^-19 particles", "9.11 x 10^31 particles"], a: 0 },
    { q: "The central dogma of molecular biology runs:",
      c: ["Protein to RNA to DNA", "DNA to RNA to protein", "RNA to DNA to protein", "DNA to protein to RNA"], a: 1 },
    { q: "Entropy is a measure of a system's:",
      c: ["Energy", "Disorder", "Temperature", "Pressure"], a: 1 },
    { q: "Which electromagnetic wave has the SHORTEST wavelength?",
      c: ["Radio", "Microwave", "X-ray", "Gamma ray"], a: 3 },
    { q: "The myelin sheath around a neuron serves to:",
      c: ["Store energy", "Speed up impulse conduction", "Produce neurotransmitters", "Protect from light"], a: 1 },
    { q: "A half-life is the time needed for:",
      c: ["Half a reaction to start", "Half of a radioactive sample to decay", "A cell to divide twice", "An orbit to complete"], a: 1 },
    { q: "The reaction 2H2 + O2 -> 2H2O is a:",
      c: ["Decomposition reaction", "Single replacement", "Double replacement", "Synthesis reaction"], a: 3 },
    { q: "CRISPR technology is used to:",
      c: ["Sequence fossils", "Edit genes", "Measure pH", "Clone whole organisms only"], a: 1 },
    { q: "An element's chemical behavior is set mainly by its:",
      c: ["Neutrons", "Valence electrons", "Atomic mass", "Isotopes"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "The Heisenberg uncertainty principle says we cannot know both:",
      c: ["Mass and charge", "Position and momentum precisely", "Energy and time at all", "Speed and direction"], a: 1 },
    { q: "Which enzyme unzips the DNA double helix?",
      c: ["DNA polymerase", "Helicase", "Ligase", "Primase"], a: 1 },
    { q: "A negative change in Gibbs free energy means a process is:",
      c: ["Impossible", "Spontaneous", "At equilibrium", "Endothermic only"], a: 1 },
    { q: "The boundary around a black hole is called the:",
      c: ["Singularity shell", "Event horizon", "Photon fence", "Accretion limit"], a: 1 },
    { q: "The Schrodinger equation describes:",
      c: ["Planetary orbits", "How quantum states evolve", "Fluid flow", "Heat conduction"], a: 1 },
    { q: "The endosymbiotic theory proposes that mitochondria were once:",
      c: ["Viruses", "Free-living bacteria", "Chloroplasts", "Nuclei"], a: 1 },
    { q: "In genetics, epistasis is when:",
      c: ["Genes cross over", "One gene masks another's expression", "Chromosomes fail to separate", "Mutations reverse"], a: 1 },
    { q: "A catalyst speeds a reaction by:",
      c: ["Raising activation energy", "Lowering activation energy", "Being consumed", "Cooling the mixture"], a: 1 },
    { q: "The particle that carries the electromagnetic force is the:",
      c: ["Gluon", "Photon", "Neutrino", "Higgs boson"], a: 1 },
    { q: "In oxidative phosphorylation, the final electron acceptor is:",
      c: ["NAD+", "Carbon dioxide", "Oxygen", "Water"], a: 2 },
    { q: "Hardy-Weinberg equilibrium assumes a population is:",
      c: ["Evolving fast", "Not evolving", "Very small", "Highly mutated"], a: 1 },
    { q: "The main component of natural gas is:",
      c: ["Propane", "Butane", "Ethane", "Methane"], a: 3 },
    { q: "E = mc^2 expresses:",
      c: ["Gravity's strength", "Mass-energy equivalence", "Wave speed", "Electric force"], a: 1 },
    { q: "Which brain region is most tied to planning and decisions?",
      c: ["Cerebellum", "Medulla", "Prefrontal cortex", "Corpus callosum alone"], a: 2 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Maya wants to know if fertilizer helps bean plants grow taller. She plants 20 seeds in identical pots with identical soil. Ten pots get fertilizer, ten get only water. Every pot gets the same sunlight. After 30 days she measures each plant.",
      qs: [
        { q: "What is the independent variable in Maya's experiment?",
          c: ["Plant height", "Fertilizer use", "Sunlight", "Pot size"], a: 1 },
        { q: "Why did Maya keep sunlight the same for every pot?",
          c: ["Plants hate sun", "To control a variable", "To save money", "It does not matter"], a: 1 }
      ] },
    { band: 24,
      text: "A lake's algae population exploded after a nearby farm began using phosphate fertilizer. The algae blocked sunlight, underwater plants died, bacteria decomposing them used up the oxygen, and fish suffocated. Biologists called it eutrophication.",
      qs: [
        { q: "What started the chain of events in the lake?",
          c: ["Overfishing", "Phosphate runoff", "A drought", "Cold weather"], a: 1 },
        { q: "Why did the fish die?",
          c: ["The water got too clear", "Oxygen was depleted", "Algae ate them", "The lake froze"], a: 1 }
      ] },
    { band: 28,
      text: "When penicillin was introduced, most bacteria died, but a few with a rare mutation survived and reproduced. Within decades, resistant strains dominated hospitals. Each new antibiotic has repeated the pattern: selection pressure favors whatever survives.",
      qs: [
        { q: "Why did resistant bacteria take over?",
          c: ["They learned medicine", "Natural selection favored survivors", "Doctors spread them on purpose", "Mutations stopped"], a: 1 },
        { q: "What does this story predict about a brand-new antibiotic?",
          c: ["It will work forever", "Resistance will likely evolve", "Bacteria will vanish", "Mutations will stop"], a: 1 }
      ] },
    { band: 32,
      text: "A sealed, insulated box contains a hot brick and a cold brick. The second law of thermodynamics says the total entropy of an isolated system never decreases. Heat flows until both bricks match temperature, and no process inside the box can un-mix them without outside work.",
      qs: [
        { q: "Why can't the box spontaneously return to hot-and-cold bricks?",
          c: ["Heat is conserved", "That would decrease entropy", "Bricks cannot move", "Energy was destroyed"], a: 1 },
        { q: "What could restore the temperature difference?",
          c: ["Waiting longer", "Work from outside the system", "A bigger box", "Nothing at all"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the water cycle in order, from first to last:",
      steps: ["Water evaporates from oceans", "Vapor condenses into clouds", "Rain falls as precipitation", "Water collects in rivers and seas"] },
    { band: 24, prompt: "Put the stages of mitosis in order:",
      steps: ["Prophase: chromosomes condense", "Metaphase: chromosomes line up", "Anaphase: chromatids pull apart", "Telophase: nuclei reform"] },
    { band: 28, prompt: "Put the scientific method in order:",
      steps: ["Ask a question", "Form a hypothesis", "Run a controlled experiment", "Analyze data and conclude"] },
    { band: 32, prompt: "Put these energy conversions in order for a power plant:",
      steps: ["Chemical energy in fuel", "Heat to make steam", "Mechanical energy in a turbine", "Electrical energy in wires"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "flaskling", name: "Flaskling", icon: "🧪", hp: 34, power: 5, xp: 30, coins: [12, 22] },
    { id: "voltvermin", name: "Volt Vermin", icon: "⚡", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "acidooze", name: "Acid Ooze", icon: "🟢", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "gravgolem", name: "Gravity Golem", icon: "🪨", hp: 64, power: 8, xp: 54, coins: [18, 34] },
    { id: "doctorentropy", name: "DOCTOR ENTROPY", icon: "🌀", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am DOCTOR ENTROPY! I bring disorder to every system! Your precious order ends here!",
      outro: "Impossible... my disorder... collapsing into... order... The Depths are yours, scholar!" }
  ];

  var NODES = [
    { id: "sci1", name: "Bubbling Entry", monster: "flaskling" },
    { id: "sci2", name: "Charged Corridor", monster: "voltvermin" },
    { id: "sci3", name: "Corrosive Pools", monster: "acidooze" },
    { id: "sci4", name: "Heavy Chamber", monster: "gravgolem" },
    { id: "sci5", name: "Entropy's Sanctum", monster: "doctorentropy", boss: true }
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
  window.SubjectPacks.science = {
    id: "science",
    name: "Science",
    icon: "🔬",
    dungeon: { name: "The Alchemy Depths", icon: "⚗️",
      desc: "A flooded laboratory where failed experiments roam free." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 45000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 120000, order: 60000, default: 30000 }
    }
  };
})();
