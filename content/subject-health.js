/* ============================================================
   QUEST ACADEMY - Health content pack
   High school through college health. Tiers 17-32.
   Structure copied from subject-science.js (reference).
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
     Bands: 17-20 grades 9-10 (nutrition/exercise/sleep basics,
     mental health basics, first aid basics, substance awareness),
     21-24 grades 11-12 (anatomy, CPR/first aid depth, disease
     prevention, stress management), 25-28 college years 1-2
     (public health, epidemiology, nutrition science, health
     psychology), 29-32 college years 3-4 (health policy,
     advanced physiology, research literacy). */
  var Q_HS1 = [
    { q: "Carbohydrates, proteins, and fats are collectively called:",
      c: ["Macronutrients", "Micronutrients", "Enzymes", "Electrolytes"], a: 0 },
    { q: "According to MyPlate, about how much of your plate should be fruits and vegetables?",
      c: ["One quarter", "One half", "Three quarters", "One third"], a: 1 },
    { q: "Health guidelines say adults should get at least how many minutes of moderate aerobic activity per week?",
      c: ["60 minutes", "90 minutes", "150 minutes", "300 minutes"], a: 2 },
    { q: "Teenagers need about how many hours of sleep per night?",
      c: ["4 to 5", "6 to 7", "8 to 10", "12 to 14"], a: 2 },
    { q: "Which habit is part of good sleep hygiene?",
      c: ["Drinking coffee right before bed", "Keeping a regular sleep schedule", "Sleeping with bright lights on", "Intense exercise minutes before bed"], a: 1 },
    { q: "Which of these is a healthy way to cope with stress?",
      c: ["Bottling feelings up", "Talking with a trusted friend", "Skipping meals", "Skipping sleep"], a: 1 },
    { q: "Feeling sad or hopeless nearly every day for two weeks or more can be a sign of:",
      c: ["Depression", "A common cold", "Food poisoning", "Asthma"], a: 0 },
    { q: "For a minor nosebleed, you should:",
      c: ["Tilt the head far back", "Lean forward and pinch the soft part of the nose", "Blow the nose hard", "Lie flat on your back"], a: 1 },
    { q: "The FIRST thing to do when you arrive at an emergency scene is:",
      c: ["Start CPR immediately", "Make sure the scene is safe", "Move the injured person", "Give the person water"], a: 1 },
    { q: "Nicotine is best described as:",
      c: ["A stimulant drug", "A vitamin", "An antibiotic", "A type of sugar"], a: 0 },
    { q: "Which is a serious health risk of binge drinking?",
      c: ["Better memory", "Alcohol poisoning", "Stronger bones", "Improved grades"], a: 1 },
    { q: "Strength training is important because it:",
      c: ["Shrinks your bones", "Builds muscle and strengthens bones", "Replaces all cardio exercise", "Requires no rest days"], a: 1 }
  ];

  var Q_HS2 = [
    { q: "The lungs are part of which body system?",
      c: ["Digestive system", "Respiratory system", "Circulatory system", "Nervous system"], a: 1 },
    { q: "Which organ pumps blood through the body?",
      c: ["Liver", "Heart", "Kidney", "Spleen"], a: 1 },
    { q: "The main control center of the nervous system is the:",
      c: ["Spinal cord", "Brain", "Heart", "Stomach"], a: 1 },
    { q: "In adult CPR, chest compressions should go about how deep?",
      c: ["About 1 inch", "About 2 inches", "About 4 inches", "About 6 inches"], a: 1 },
    { q: "The recommended chest compression rate for CPR is:",
      c: ["30 to 60 per minute", "60 to 80 per minute", "100 to 120 per minute", "150 to 180 per minute"], a: 2 },
    { q: "For a minor burn, the first step is to:",
      c: ["Apply ice directly to the skin", "Cool it with running water", "Cover it with butter", "Pop any blisters"], a: 1 },
    { q: "If someone is choking and cannot cough, speak, or breathe, you should:",
      c: ["Give them water to drink", "Perform abdominal thrusts", "Tell them to lie down", "Wait for it to pass"], a: 1 },
    { q: "Vaccines protect people mainly by:",
      c: ["Killing every germ in the body", "Training the immune system to recognize specific germs", "Curing infections after they start", "Replacing the need for hygiene"], a: 1 },
    { q: "Effective handwashing with soap should last at least:",
      c: ["5 seconds", "10 seconds", "20 seconds", "60 seconds"], a: 2 },
    { q: "Herd immunity means:",
      c: ["Everyone gets sick once", "Enough people are immune that disease struggles to spread", "Immunity comes only from animals", "Vaccines are no longer needed"], a: 1 },
    { q: "Which technique helps activate the body's relaxation response?",
      c: ["Holding your breath as long as possible", "Slow, deep diaphragmatic breathing", "Drinking extra caffeine", "Tensing all muscles all day"], a: 1 },
    { q: "Long-term chronic stress is linked to a higher risk of:",
      c: ["Stronger immunity", "High blood pressure", "Better sleep", "Faster wound healing"], a: 1 }
  ];

  var Q_COL1 = [
    { q: "Public health focuses on:",
      c: ["Treating one patient at a time", "The health of populations and communities", "Hospital profits", "Individual genetics only"], a: 1 },
    { q: "Which of these is a primary prevention measure?",
      c: ["Vaccination before any exposure", "Surgery after a heart attack", "Physical therapy after an injury", "Hospice care at end of life"], a: 0 },
    { q: "In epidemiology, INCIDENCE measures:",
      c: ["All existing cases at one time", "New cases arising over a time period", "Deaths from a disease", "The number of hospital beds"], a: 1 },
    { q: "In epidemiology, PREVALENCE measures:",
      c: ["New cases each year", "All existing cases at a point in time", "Cases seen in one hospital", "The rate of cure"], a: 1 },
    { q: "An outbreak that spreads across countries or continents is called a:",
      c: ["Endemic", "Epidemic", "Pandemic", "Cluster"], a: 2 },
    { q: "Dietary fiber is important because it:",
      c: ["Adds a lot of calories", "Aids digestion and feeds beneficial gut bacteria", "Dissolves in fat for storage", "Contains complete protein"], a: 1 },
    { q: "Which vitamin is made in the skin when it is exposed to sunlight?",
      c: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"], a: 2 },
    { q: "The glycemic index of a food measures:",
      c: ["How fast it raises blood sugar", "How many vitamins it has", "Its protein content", "How long it stays fresh"], a: 0 },
    { q: "The placebo effect shows that:",
      c: ["Expectations can influence health outcomes", "Sugar pills cure every illness", "Doctors cannot be trusted", "Only real drugs ever work"], a: 0 },
    { q: "Health psychology studies:",
      c: ["Only brain surgery", "How behavior and the mind affect physical health", "Hospital architecture", "Insurance billing codes"], a: 1 },
    { q: "A randomized controlled trial is considered strong evidence mainly because:",
      c: ["It is cheap to run", "Random assignment reduces bias between groups", "It relies on opinion surveys", "It tests only one person"], a: 1 },
    { q: "Fluoridated drinking water is an example of:",
      c: ["A community-level prevention measure", "An individual medical treatment", "A surgical intervention", "An antibiotic therapy"], a: 0 }
  ];

  var Q_COL2 = [
    { q: "In the United States, Medicare primarily covers:",
      c: ["All citizens", "People aged 65 and older", "Children only", "Veterans only"], a: 1 },
    { q: "The HIPAA Privacy Rule mainly protects:",
      c: ["Hospital profits", "Patients' health information", "Doctor salaries", "Drug prices"], a: 1 },
    { q: "A copay is:",
      c: ["A fixed amount a patient pays for a covered service", "A bonus paid to doctors", "A tax paid by hospitals", "A type of insurance fraud"], a: 0 },
    { q: "The Frank-Starling law of the heart states that:",
      c: ["Stretch of the heart muscle increases the force of contraction", "Blood pressure always rises with age", "Lung volume determines height", "Bone density sets heart rate"], a: 0 },
    { q: "VO2 max is a measure of:",
      c: ["Maximum heart rate", "Maximum oxygen uptake during exercise", "Total blood volume", "Water content of the lungs"], a: 1 },
    { q: "The HPA axis (hypothalamus, pituitary, adrenal glands) is central to:",
      c: ["The body's stress response", "Digestion of fats", "Bone growth", "Color vision"], a: 0 },
    { q: "During exercise, cardiac output rises mainly because of:",
      c: ["Lower blood pressure", "Increased heart rate and stroke volume", "Slower breathing", "Narrower blood vessels"], a: 1 },
    { q: "\"Correlation does not imply causation\" because:",
      c: ["Correlations are always false", "A third factor may explain both variables", "Statistics are useless", "Studies are never repeated"], a: 1 },
    { q: "A confounding variable is:",
      c: ["The main result of a study", "An outside factor that distorts the apparent link being studied", "A type of graph", "The total sample size"], a: 1 },
    { q: "Coffee drinkers show more heart disease, but they also smoke more. Here, smoking is a:",
      c: ["Dependent variable", "Confounding variable", "Control group", "Placebo"], a: 1 },
    { q: "Health policy emphasizes preventive care because it:",
      c: ["Costs more than treatment", "Can reduce disease and long-term costs", "Eliminates all health risk", "Requires no evidence"], a: 1 },
    { q: "During intense exercise, muscles produce lactate, which the body:",
      c: ["Stores permanently as damage", "Clears and can reuse as fuel", "Uses to cause all next-day soreness", "Pushes into the heart"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Jordan picks up a granola bar at the store and reads the label. Serving size: 1 bar. Calories: 240. Total fat: 12 g. Added sugars: 22 g. Protein: 3 g. The label notes a daily value of 50 g for added sugars.",
      qs: [
        { q: "One bar gives what percent of a day's added sugars?",
          c: ["22 percent", "44 percent", "50 percent", "72 percent"], a: 1 },
        { q: "If Jordan eats two bars, how many grams of added sugar is that?",
          c: ["22 g", "44 g", "50 g", "72 g"], a: 1 }
      ] },
    { band: 24,
      text: "During basketball practice, Maya's teammate lands badly and the ankle swells fast. There is no bleeding, no bone looks out of place, and the teammate can put a little weight on it. Practice is not important enough to risk real damage.",
      qs: [
        { q: "What is the best immediate response?",
          c: ["Keep playing to loosen it up", "Stop activity, rest it, and apply ice", "Wrap it tight and sprint on it", "Give painkillers and keep playing"], a: 1 },
        { q: "Why apply ice to the ankle?",
          c: ["To heal any broken bone", "To reduce swelling and pain", "To numb the skin forever", "To warm up the joint"], a: 1 }
      ] },
    { band: 28,
      text: "An online ad promises a 'detox tea' that melts belly fat in 7 days with no diet or exercise changes. The only evidence offered is one celebrity's before-and-after photos and a testimonial saying it 'worked for me.'",
      qs: [
        { q: "What is the strongest reason to doubt this claim?",
          c: ["It relies on a testimonial instead of controlled evidence", "The tea is too cheap", "Tea cannot be sold online", "Celebrities are always honest"], a: 0 },
        { q: "Which question would best test the claim scientifically?",
          c: ["How much does the tea cost", "Did a randomized trial compare it to a placebo", "What color is the packaging", "Which celebrity endorsed it"], a: 1 }
      ] },
    { band: 32,
      text: "In a town of 10,000 people, 200 residents have diabetes today. Over the next year, 50 new cases of diabetes are diagnosed. A health student is asked to report both the starting prevalence and the year's incidence.",
      qs: [
        { q: "What is the prevalence of diabetes at the start of the year?",
          c: ["200 cases out of 10,000", "50 cases out of 10,000", "250 cases out of 10,000", "50 cases out of 200"], a: 0 },
        { q: "What is the incidence of diabetes over that year?",
          c: ["200 total cases", "50 new cases", "250 total cases", "10,000 people"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put these first-aid response steps in order, from first to last:",
      steps: ["Check that the scene is safe", "Check the person and call for help", "Give care within your training", "Stay with them until help arrives"] },
    { band: 24, prompt: "Put the path of digestion in order, from first to last:",
      steps: ["Mouth: chewing and saliva begin breakdown", "Esophagus: food travels down to the stomach", "Stomach: acid and churning digest food", "Small intestine: nutrients are absorbed into blood"] },
    { band: 32, prompt: "Put the chain of infection in order (simplified to four links):",
      steps: ["Infectious agent: the germ itself", "Reservoir: where the germ lives and grows", "Mode of transmission: how the germ travels", "Susceptible host: a person who can get sick"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "germling", name: "Germling", icon: "🦠", hp: 34, power: 5, xp: 30, coins: [12, 22] },
    { id: "sugarfiend", name: "Sugar Fiend", icon: "🍬", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "smogwraith", name: "Smog Wraith", icon: "🌫️", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "couchgolem", name: "Couch Golem", icon: "🛋️", hp: 64, power: 8, xp: 54, coins: [18, 34] },
    { id: "thesedentary", name: "THE SEDENTARY", icon: "💤", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am THE SEDENTARY! I chain heroes to their couches and feed them excuses! Your heart will slow... your will shall fade!",
      outro: "No... my chains... breaking... Move, scholar, move! The Sanctum is yours!" }
  ];

  var NODES = [
    { id: "vit1", name: "Quarantine Gate", monster: "germling" },
    { id: "vit2", name: "Pantry of Excess", monster: "sugarfiend" },
    { id: "vit3", name: "Hazy Ward", monster: "smogwraith" },
    { id: "vit4", name: "Slothful Atrium", monster: "couchgolem" },
    { id: "vit5", name: "The Sedentary's Throne", monster: "thesedentary", boss: true }
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
  window.SubjectPacks.health = {
    id: "health",
    name: "Health",
    icon: "❤️",
    dungeon: { name: "The Vital Sanctum", icon: "❤️",
      desc: "A radiant infirmary where every neglected habit has taken monstrous form." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 45000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 120000, order: 60000, default: 30000 }
    }
  };
})();
