/* ============================================================
   QUEST ACADEMY - Psychology content pack (ELECTIVE)
   High school through college psychology, AP-level depth. Tiers 17-32.
   Elective wing: scaled to 3 nodes (2 monsters + boss).
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
     Bands: 17-20 grades 9-10, 21-24 grades 11-12 (AP Psych),
            25-28 college years 1-2, 29-32 college years 3-4. */

  /* 17-20: brain basics, neurons, lobes, memory basics,
     classical vs operant conditioning, Piaget basics */
  var Q_HS1 = [
    { q: "The tiny gap between two neurons is called the:",
      c: ["Axon", "Synapse", "Dendrite", "Nucleus"], a: 1 },
    { q: "Which part of a neuron receives incoming messages from other neurons?",
      c: ["Axon", "Myelin sheath", "Dendrites", "Terminal buttons"], a: 2 },
    { q: "The fatty coating that speeds a signal along an axon is the:",
      c: ["Dendrite", "Myelin sheath", "Synapse", "Vesicle"], a: 1 },
    { q: "The lobe of the brain most tied to processing vision is the:",
      c: ["Frontal lobe", "Temporal lobe", "Occipital lobe", "Parietal lobe"], a: 2 },
    { q: "Which brain structure is most tied to balance and coordinated movement?",
      c: ["Amygdala", "Cerebellum", "Hippocampus", "Hypothalamus"], a: 1 },
    { q: "Pavlov's dogs salivating at the sound of a bell is an example of:",
      c: ["Operant conditioning", "Observational learning", "Classical conditioning", "Habituation"], a: 2 },
    { q: "In operant conditioning, negative reinforcement means:",
      c: ["Adding something pleasant to strengthen a behavior", "Removing something unpleasant to strengthen a behavior", "Taking away a privilege to weaken a behavior", "Ignoring a behavior until it stops"], a: 1 },
    { q: "Which of these is an example of positive punishment?",
      c: ["A gold star for finishing homework", "Losing screen time for yelling", "Extra chores after misbehaving", "A seatbelt chime that stops when you buckle up"], a: 2 },
    { q: "According to Piaget, children who have NOT yet mastered conservation are in the:",
      c: ["Sensorimotor stage", "Preoperational stage", "Concrete operational stage", "Formal operational stage"], a: 1 },
    { q: "Object permanence, knowing a hidden toy still exists, develops in Piaget's:",
      c: ["Preoperational stage", "Concrete operational stage", "Formal operational stage", "Sensorimotor stage"], a: 3 },
    { q: "Miller's 'magical number' for short-term memory capacity is about:",
      c: ["Three items", "Seven items", "Twelve items", "An unlimited number"], a: 1 },
    { q: "The three processes of memory, in order, are:",
      c: ["Storage, encoding, retrieval", "Encoding, retrieval, storage", "Encoding, storage, retrieval", "Retrieval, storage, encoding"], a: 2 }
  ];

  /* 21-24: AP Psych: research methods, sensation and perception,
     sleep, motivation, personality (Freud, Big Five) */
  var Q_HS2 = [
    { q: "A study finds ice cream sales and drowning deaths rise together. The most likely explanation is:",
      c: ["Ice cream causes drowning", "Drowning causes ice cream sales", "A third variable, summer heat, drives both", "The data must be wrong"], a: 2 },
    { q: "Which correlation coefficient shows the STRONGEST relationship?",
      c: ["r = +0.30", "r = -0.85", "r = +0.55", "r = 0.00"], a: 1 },
    { q: "The minimum stimulation needed to detect a sensation half the time is the:",
      c: ["Difference threshold", "Absolute threshold", "Sensory adaptation", "Signal detection"], a: 1 },
    { q: "You stop noticing the smell of your own house after a few minutes. This is called:",
      c: ["Sensory adaptation", "The difference threshold", "Weber's law", "Selective attention"], a: 0 },
    { q: "Most vivid dreaming happens during:",
      c: ["NREM stage 1", "NREM stage 3 deep sleep", "REM sleep", "The moment of waking"], a: 2 },
    { q: "A full sleep cycle, from light sleep through REM, lasts about:",
      c: ["10 minutes", "90 minutes", "4 hours", "8 hours"], a: 1 },
    { q: "At the TOP of Maslow's hierarchy of needs is:",
      c: ["Safety needs", "Belongingness and love", "Physiological needs", "Self-actualization"], a: 3 },
    { q: "According to Freud, the part of personality that follows the pleasure principle is the:",
      c: ["Ego", "Superego", "Id", "Conscious mind"], a: 2 },
    { q: "According to Freud, the ego operates on the:",
      c: ["Pleasure principle", "Morality principle", "Reality principle", "Death instinct"], a: 2 },
    { q: "Which of these is one of the Big Five personality traits?",
      c: ["Intelligence", "Conscientiousness", "Humor", "Honesty"], a: 1 },
    { q: "Gestalt psychologists emphasized that we perceive:",
      c: ["Each sensation completely separately", "Only what we can touch", "The whole as more than the sum of its parts", "Colors before shapes"], a: 2 },
    { q: "Studying hard because you genuinely enjoy learning is an example of:",
      c: ["Extrinsic motivation", "Intrinsic motivation", "Drive reduction", "Homeostasis"], a: 1 }
  ];

  /* 25-28: abnormal psych, social psych, cognitive biases */
  var Q_COL1 = [
    { q: "In Asch's conformity experiments, about what share of participants gave an obviously wrong answer to match the group?",
      c: ["Almost none", "About one-third", "About two-thirds", "Nearly everyone"], a: 1 },
    { q: "In Milgram's obedience study, roughly what percent of participants delivered the maximum shock?",
      c: ["10 percent", "35 percent", "65 percent", "95 percent"], a: 2 },
    { q: "Zimbardo's Stanford Prison Experiment is mainly used to show:",
      c: ["That guards are naturally cruel people", "That obedience requires a lab coat", "That conformity is genetic", "The power of situations and roles over behavior"], a: 3 },
    { q: "Hallucinations and delusions are called the POSITIVE symptoms of schizophrenia because they:",
      c: ["Are helpful to the patient", "Add experiences beyond normal perception", "Only respond to talk therapy", "Appear only in childhood"], a: 1 },
    { q: "A persistent, excessive worry about everyday things best describes:",
      c: ["Panic disorder", "Generalized anxiety disorder", "A specific phobia", "Obsessive-compulsive disorder"], a: 1 },
    { q: "For a diagnosis of major depressive disorder, a depressed mood or loss of interest must last at least:",
      c: ["Two days", "Two weeks", "Two months", "One year"], a: 1 },
    { q: "Someone with schizophrenia insists the TV is sending them secret orders. This is a:",
      c: ["Hallucination", "Delusion", "Negative symptom", "Mood swing"], a: 1 },
    { q: "Confirmation bias means:",
      c: ["Remembering everything perfectly", "Seeking information that supports what you already believe", "Always agreeing with experts", "Changing your mind easily"], a: 1 },
    { q: "The fundamental attribution error is:",
      c: ["Blaming the situation too much", "Blaming a person's character while ignoring their situation", "Attributing success to luck", "Forgetting people's names"], a: 1 },
    { q: "People are less likely to help a stranger when a crowd is watching because of:",
      c: ["Social facilitation", "Group polarization", "The bystander effect", "Social loafing"], a: 2 },
    { q: "When a group's desire for harmony overrides realistic thinking, it is called:",
      c: ["Brainstorming", "Groupthink", "Social loafing", "Minority influence"], a: 1 },
    { q: "Cognitive dissonance theory predicts that after a difficult choice, people will:",
      c: ["Regret both options equally", "Forget the choice entirely", "Rate their chosen option more positively", "Avoid similar choices forever"], a: 2 }
  ];

  /* 29-32: therapy approaches, neurotransmitters, twin studies
     and heritability, research ethics */
  var Q_COL2 = [
    { q: "Cognitive-behavioral therapy (CBT) primarily works by:",
      c: ["Uncovering buried childhood memories", "Prescribing medication", "Changing maladaptive thoughts and the behaviors tied to them", "Interpreting the patient's dreams"], a: 2 },
    { q: "In psychoanalysis, a patient saying whatever comes to mind is called:",
      c: ["Systematic desensitization", "Free association", "Active listening", "Cognitive restructuring"], a: 1 },
    { q: "Rogers' client-centered therapy requires the therapist to show:",
      c: ["Tough love", "Unconditional positive regard", "Expert diagnosis", "Dream interpretation"], a: 1 },
    { q: "Systematic desensitization treats phobias through:",
      c: ["Gradual exposure paired with relaxation", "Facing the worst fear all at once", "Talking only about childhood", "Positive affirmations alone"], a: 0 },
    { q: "Abnormally low levels of serotonin are most linked to:",
      c: ["Schizophrenia", "Depression", "Alzheimer's memory loss", "Muscle tremors"], a: 1 },
    { q: "Parkinson's disease involves a loss of neurons that produce:",
      c: ["Serotonin", "GABA", "Dopamine", "Endorphins"], a: 2 },
    { q: "GABA's main role in the nervous system is to:",
      c: ["Speed up all neural signals", "Inhibit neural firing, producing a calming effect", "Carry pain messages", "Build the myelin sheath"], a: 1 },
    { q: "Twin studies estimate heritability by comparing:",
      c: ["Identical twins with fraternal twins", "Identical twins with their parents", "Fraternal twins with strangers", "Twins with only children"], a: 0 },
    { q: "A heritability estimate of 0.50 for a trait means:",
      c: ["Half of each person's trait is genetic", "About half the variation in the trait comes from genetic differences", "The trait is 50 percent changeable", "Genes matter less than environment"], a: 1 },
    { q: "Before participating in a study, volunteers must give:",
      c: ["Payment", "Informed consent", "A medical diagnosis", "Course credit"], a: 1 },
    { q: "An Institutional Review Board (IRB) exists to:",
      c: ["Fund new studies", "Protect participants from unethical research", "Publish research results", "Recruit volunteers"], a: 1 },
    { q: "Which drug class treats depression by increasing serotonin availability?",
      c: ["Antipsychotics", "Benzodiazepines", "Stimulants", "SSRIs"], a: 3 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Ivan Pavlov was studying digestion in dogs when he noticed something odd: his dogs began salivating when they merely heard the footsteps of the assistant bringing food. Pavlov decided to test it. Before each meal, he rang a bell. At first the bell meant nothing to the dogs. After many pairings of bell plus food, the dogs salivated to the bell alone, with no food in sight.",
      qs: [
        { q: "Before conditioning, the food that naturally caused salivation was the:",
          c: ["Conditioned stimulus", "Neutral stimulus", "Unconditioned stimulus", "Operant stimulus"], a: 2 },
        { q: "After conditioning, the dogs' salivation to the bell alone is the:",
          c: ["Unconditioned response", "Conditioned response", "Operant response", "Neutral response"], a: 1 }
      ] },
    { band: 24,
      text: "Dr. Reyes gathers groups of eight students for what she calls a vision test. Seven of the eight are secretly working for her. She shows everyone three lines and asks which one matches a target line. The correct answer is obvious, but the seven confederates all pick the same wrong line. The real participant, seated near the end, hears seven wrong answers before it is their turn to speak.",
      qs: [
        { q: "The seven students giving scripted answers are called:",
          c: ["The control group", "Confederates", "Placebos", "Observers"], a: 1 },
        { q: "Why did many real participants give the wrong answer too?",
          c: ["They could not see the lines", "They were paid to lie", "Pressure to conform to the group", "They feared electric shocks"], a: 2 }
      ] },
    { band: 28,
      text: "Marcus is convinced his favorite energy drink improves his test scores. He drinks it before every exam and remembers the good grades, but he never counts the exams where he drank it and did poorly, and he skips every article saying the drink does nothing. When a friend shows him a study finding no effect, Marcus says the study must be rigged.",
      qs: [
        { q: "Marcus is mainly showing:",
          c: ["Hindsight bias", "The placebo effect", "Confirmation bias", "Cognitive dissonance"], a: 2 },
        { q: "Which habit would BEST fight Marcus's bias?",
          c: ["Drinking more of the drink", "Seeking out evidence against his belief", "Avoiding all studies", "Trusting his gut"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the stages of memory in order, from first to last:",
      steps: ["Sensory input: attention selects information", "Encoding: information is processed into memory", "Storage: information is maintained over time", "Retrieval: information is recalled when needed"] },
    { band: 24, prompt: "Put the steps of classical conditioning in order:",
      steps: ["Bell rings and food appears together", "The pairings are repeated over many trials", "The bell rings with no food present", "The dog salivates to the bell alone"] },
    { band: 28, prompt: "Put the steps of the research process in order:",
      steps: ["Form a hypothesis", "Design the study and define the variables", "Collect and analyze the data", "Draw conclusions and report the findings"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "neuronimp", name: "Neuron Imp", icon: "🧠", hp: 48, power: 6, xp: 40, coins: [15, 26] },
    { id: "mazerat", name: "Maze Rat", icon: "🐀", hp: 56, power: 7, xp: 46, coins: [18, 30] },
    { id: "ego", name: "EGO", icon: "🎭", hp: 160, power: 10, xp: 125, coins: [55, 95],
      boss: true,
      intro: "I am EGO! I balance every impulse and every ideal, and I answer to no one! Your mind is MY maze, scholar!",
      outro: "No... my defenses... analyzed at last... The Mind Maze is yours, scholar!" }
  ];

  var NODES = [
    { id: "psy1", name: "Synapse Gate", monster: "neuronimp" },
    { id: "psy2", name: "Conditioning Corridors", monster: "mazerat" },
    { id: "psy3", name: "The Ego's Throne", monster: "ego", boss: true }
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
  window.SubjectPacks.psychology = {
    id: "psychology",
    name: "Psychology",
    icon: "🧠",
    elective: true,
    dungeon: { name: "The Mind Maze", icon: "🌀",
      desc: "A twisting labyrinth of thoughts, memories, and biases where nothing is quite what it seems." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 50000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 130000, order: 60000, default: 30000 }
    }
  };
})();
