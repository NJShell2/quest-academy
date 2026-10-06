/* ============================================================
   QUEST ACADEMY - Sociology content pack (ELECTIVE)
   High school through college sociology. Tiers 17-32.
   Scaled to the wing: 3 nodes (2 monsters + boss), smaller banks.
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
     Bands: 17-20 culture and socialization, 21-24 institutions
     and stratification, 25-28 theory and methods, 29-32 Weber,
     globalization, and advanced topics. */
  var Q_HS1 = [
    { q: "A shared expectation about how members of a group should behave is called a:",
      c: ["Norm", "Value", "Law", "Sanction"], a: 0 },
    { q: "Which of these is a VALUE rather than a behavior?",
      c: ["Waving hello", "Honesty is important", "Wearing a uniform", "Driving on the right"], a: 1 },
    { q: "Everyday customs with little moral weight, like saying 'excuse me' after a sneeze, are:",
      c: ["Folkways", "Mores", "Taboos", "Laws"], a: 0 },
    { q: "Norms with strong moral significance, like prohibitions against theft, are:",
      c: ["Folkways", "Mores", "Fads", "Trends"], a: 1 },
    { q: "The lifelong process of learning the norms and values of your society is:",
      c: ["Stratification", "Socialization", "Deviance", "Globalization"], a: 1 },
    { q: "Which agent of socialization usually teaches a child first?",
      c: ["The family", "The school", "The media", "The government"], a: 0 },
    { q: "The unwritten lessons schools teach, like punctuality and obeying authority, are called the:",
      c: ["Formal syllabus", "Hidden curriculum", "Honor code", "Grading rubric"], a: 1 },
    { q: "During the teen years, which agent of socialization most shapes tastes in music and style?",
      c: ["Family", "Peer groups", "Religion", "Employers"], a: 1 },
    { q: "Rewards or punishments that encourage people to follow norms are called:",
      c: ["Sanctions", "Values", "Roles", "Statuses"], a: 0 }
  ];

  var Q_HS2 = [
    { q: "An established, organized set of norms that structures an area of social life, like the family, is a:",
      c: ["Social institution", "Deviant act", "Folkway", "Subculture"], a: 0 },
    { q: "As a social institution, the family is mainly responsible for:",
      c: ["Raising children and teaching basic norms", "Printing money", "Passing criminal laws", "Running elections"], a: 0 },
    { q: "Which statement best describes deviance?",
      c: ["Any crime", "Behavior that violates a group's norms", "Mental illness", "Being poor"], a: 1 },
    { q: "Whether an act counts as deviant depends on:",
      c: ["The act itself, always", "The social context and who is judging", "Its cost in dollars", "Whether it is caught"], a: 1 },
    { q: "The hierarchical ranking of people into social layers is called:",
      c: ["Social mobility", "Social stratification", "Socialization", "Segregation"], a: 1 },
    { q: "A status you are born into, like inherited royalty, is:",
      c: ["Achieved status", "Ascribed status", "A job title", "A nickname"], a: 1 },
    { q: "A status you earn through effort, like a college degree, is:",
      c: ["Ascribed status", "Achieved status", "A caste rank", "A family name"], a: 1 },
    { q: "Moving up or down the social ladder during a lifetime is called:",
      c: ["Social mobility", "Social control", "Social exchange", "Social drift"], a: 0 },
    { q: "Education as a social institution does all of the following EXCEPT:",
      c: ["Transmitting knowledge and culture", "Sorting people into jobs and roles", "Granting citizenship to immigrants", "Teaching shared norms"], a: 2 }
  ];

  var Q_COL1 = [
    { q: "The perspective that sees society as interconnected parts working together to keep things stable is:",
      c: ["Conflict theory", "Functionalism", "Symbolic interactionism", "Feminist theory"], a: 1 },
    { q: "Durkheim's classic study of suicide showed that suicide rates are linked to:",
      c: ["Weather patterns", "Social integration", "Genetics alone", "Economic cycles only"], a: 1 },
    { q: "The perspective that sees society as groups competing for scarce resources and power is:",
      c: ["Functionalism", "Conflict theory", "Structural functionalism", "Dramaturgy"], a: 1 },
    { q: "Conflict theory's roots are most associated with:",
      c: ["Emile Durkheim", "Karl Marx", "Max Weber", "George Herbert Mead"], a: 1 },
    { q: "The perspective focused on small-scale interactions and the meanings people attach to symbols is:",
      c: ["Functionalism", "Conflict theory", "Symbolic interactionism", "Rational choice"], a: 2 },
    { q: "Symbolic interactionism is most associated with:",
      c: ["Karl Marx", "Emile Durkheim", "George Herbert Mead", "Auguste Comte"], a: 2 },
    { q: "Goffman's idea that social life is like a stage performance, with people managing impressions, is called:",
      c: ["Dramaturgy", "Bureaucracy", "Alienation", "Anomie"], a: 0 },
    { q: "A researcher who lives with a group to observe its daily life is using:",
      c: ["Survey research", "Participant observation", "A lab experiment", "Content analysis"], a: 1 },
    { q: "A sociological experiment's main strength is that it can:",
      c: ["Study huge populations cheaply", "Test cause and effect", "Avoid all ethical issues", "Guarantee honest answers"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "Weber argued that modern life is increasingly shaped by:",
      c: ["Rationalization, the spread of efficiency and calculation", "Tradition alone", "Charismatic authority", "Feudal loyalty"], a: 0 },
    { q: "In The Protestant Ethic and the Spirit of Capitalism, Weber argued that:",
      c: ["Catholic rituals created factories", "Calvinist values like hard work and thrift helped fuel modern capitalism", "Capitalism caused the Reformation", "Marx invented the work ethic"], a: 1 },
    { q: "Ritzer's 'McDonaldization' describes:",
      c: ["Healthier school lunches", "Fast-food principles like efficiency and predictability spreading through society", "The decline of all restaurants", "Government farm subsidies"], a: 1 },
    { q: "The growing interconnectedness of economies, cultures, and communication across borders is:",
      c: ["Urbanization", "Globalization", "Secularization", "Gentrification"], a: 1 },
    { q: "Intersectionality, introduced by Kimberle Crenshaw, is the idea that:",
      c: ["Everyone faces identical barriers", "Overlapping identities like race and gender combine to shape unique experiences of inequality", "Class is the only real divide", "Identities never interact"], a: 1 },
    { q: "Weber's 'iron cage' metaphor describes:",
      c: ["Prison reform", "People trapped by overly rational, bureaucratic systems", "Medieval armor", "Factory safety rules"], a: 1 },
    { q: "Which is the best example of social change driven by technology?",
      c: ["A new fashion trend", "The internet reshaping how people work and socialize", "A single election", "A popular song"], a: 1 },
    { q: "Organized efforts by groups to promote or resist change, like civil rights marches, are:",
      c: ["Fads", "Social movements", "Rumors", "Folkways"], a: 1 },
    { q: "Verstehen, central to Weber's method, means:",
      c: ["Measuring skull sizes", "Empathetically understanding the meaning people give their actions", "Running lab experiments", "Counting survey responses"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Lena, age 12, learned to say 'please' and 'thank you' at her family's dinner table. Her teacher taught her to raise her hand before speaking in class. Her friends taught her the slang everyone uses at lunch. Her favorite videos taught her the dance moves everyone is copying this month.",
      qs: [
        { q: "Which agent of socialization taught Lena to say 'please' and 'thank you'?",
          c: ["Family", "School", "Peer groups", "Mass media"], a: 0 },
        { q: "Which agent of socialization taught Lena the dance moves?",
          c: ["Family", "School", "Peer groups", "Mass media"], a: 3 }
      ] },
    { band: 24,
      text: "Every afternoon, teens ride skateboards across the town plaza. The teens see it as normal fun. Many older residents call it deviant and disruptive. The city council is debating an official rule banning skating in the plaza, and the local paper is covering the argument.",
      qs: [
        { q: "What does the disagreement over skateboarding show about deviance?",
          c: ["Deviance is defined by social context, not the act alone", "Skating is always deviant", "Only teens can be deviant", "Deviance is written in law"], a: 0 },
        { q: "If the city council passes an official ban, which social institution is acting?",
          c: ["The family", "Religion", "The media", "The government"], a: 3 }
      ] },
    { band: 28,
      text: "A sociologist watches a classroom and notes how hand-raising works like a small ritual: the raised hand signals respect, the teacher's nod grants permission, and everyone reads the meaning instantly. Across town, another sociologist maps school funding and finds wealthy districts consistently outspend poor ones, keeping the same families on top.",
      qs: [
        { q: "Studying hand-raising as meaningful face-to-face interaction best fits which perspective?",
          c: ["Functionalism", "Conflict theory", "Symbolic interactionism", "Rational choice"], a: 2 },
        { q: "Studying funding gaps as one class keeping resources from another best fits which perspective?",
          c: ["Functionalism", "Conflict theory", "Symbolic interactionism", "Dramaturgy"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the agents of socialization in the order they typically become important across a life:",
      steps: ["Family in early childhood", "School in childhood", "Peer groups in the teen years", "Mass media grows in influence throughout life"] },
    { band: 28, prompt: "Put the sociological research process in order:",
      steps: ["Choose a research topic", "Review existing studies", "Collect data with a method", "Analyze results and share findings"] },
    { band: 32, prompt: "Put the levels of social structure in order, from smallest to largest:",
      steps: ["The individual", "Small groups and networks", "Social institutions", "Society as a whole"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "normling", name: "Normling", icon: "📏", hp: 42, power: 6, xp: 38, coins: [14, 24] },
    { id: "stereotype", name: "Stereotype", icon: "🎭", hp: 56, power: 7, xp: 46, coins: [18, 30] },
    { id: "theconformist", name: "THE CONFORMIST", icon: "🪞", hp: 120, power: 9, xp: 100, coins: [40, 70],
      boss: true,
      intro: "I am THE CONFORMIST! In these halls, everyone thinks alike! Surrender your questions, student!",
      outro: "No... you dared to ask WHY... The Society Halls are yours. Conformity crumbles!" }
  ];

  var NODES = [
    { id: "soc1", name: "Norms Antechamber", monster: "normling" },
    { id: "soc2", name: "Echoing Gallery", monster: "stereotype" },
    { id: "soc3", name: "The Conformist's Court", monster: "theconformist", boss: true }
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
  window.SubjectPacks.sociology = {
    id: "sociology",
    name: "Sociology",
    icon: "👥",
    elective: true,
    dungeon: { name: "The Society Halls", icon: "🏛️",
      desc: "A marble hall of echoes where every culture's unwritten rules argue with each other." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 50000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 130000, order: 60000, default: 30000 }
    }
  };
})();
