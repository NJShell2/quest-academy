/* ============================================================
   QUEST ACADEMY - Law content pack (ELECTIVE)
   Street Law / Constitutional Law flavor. Tiers 17-32.
   Scaled to the wing: 3 nodes, 2 monsters + boss, smaller banks.
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
    { q: "The 'rule of law' means that:",
      c: ["Kings and rulers are above the law", "Everyone, including government officials, must follow the law", "Laws apply only to ordinary citizens", "Judges may ignore the Constitution when it suits them"], a: 1 },
    { q: "In a criminal case, who brings the charges against the accused?",
      c: ["The victim's family", "A private lawyer hired by the victim", "The government, through a prosecutor", "The jury"], a: 2 },
    { q: "In a civil lawsuit, the person who files the case is called the:",
      c: ["Defendant", "Prosecutor", "Plaintiff", "Appellant"], a: 2 },
    { q: "To convict someone of a crime, the prosecution must prove guilt:",
      c: ["By a preponderance of the evidence", "Beyond a reasonable doubt", "To a mathematical certainty", "By probable cause alone"], a: 1 },
    { q: "The Bill of Rights is:",
      c: ["The preamble to the Constitution", "The first ten amendments to the Constitution", "A law passed by Congress in 1791", "The Declaration of Independence"], a: 1 },
    { q: "Which of these freedoms is protected by the First Amendment?",
      c: ["Freedom of speech", "The right to bear arms", "The right to a speedy trial", "Freedom from cruel punishment"], a: 0 },
    { q: "The First Amendment's protection of a free press means the government generally cannot:",
      c: ["Censor or punish newspapers for what they publish", "Read newspapers sold in stores", "Criticize news coverage", "Tax newspaper advertising"], a: 0 },
    { q: "The First Amendment's religion clauses mean the government may not:",
      c: ["Protect the right to worship", "Establish an official religion or block the free exercise of faith", "Let churches own property", "Recognize religious holidays"], a: 1 },
    { q: "The main job of a trial court is to:",
      c: ["Review decisions made by lower courts", "Hear witnesses and evidence, then decide the facts", "Write new laws for the legislature", "Choose which cases the Supreme Court hears"], a: 1 },
    { q: "An appellate court mainly:",
      c: ["Hears new witnesses and takes new evidence", "Decides whether the trial court made legal mistakes", "Runs a second full trial with a new jury", "Sentences convicted criminals"], a: 1 }
  ];

  var Q_HS2 = [
    { q: "Marbury v. Madison (1803) is famous because it established:",
      c: ["The right to remain silent", "Judicial review: courts can strike down laws that violate the Constitution", "The end of school segregation", "The right to a court-appointed lawyer"], a: 1 },
    { q: "Before questioning a person in custody, police must give the Miranda warnings, which include:",
      c: ["The right to remain silent and the right to an attorney", "The right to one free phone call", "The right to pick the interrogating officer", "The right to a trial by jury on the spot"], a: 0 },
    { q: "Gideon v. Wainwright (1963) ruled that:",
      c: ["Police need warrants for every search", "Poor defendants charged with felonies must be given a lawyer", "Students keep free speech rights at school", "Confessions obtained by threats are valid"], a: 1 },
    { q: "Brown v. Board of Education (1954) held that:",
      c: ["Schools could stay segregated if facilities were equal", "Racial segregation in public schools is unconstitutional", "Students have no rights at school", "The federal government runs all public schools"], a: 1 },
    { q: "Tinker v. Des Moines (1969) ruled that students:",
      c: ["Lose all constitutional rights at school", "Keep free speech rights unless their speech substantially disrupts school", "May skip any class as a form of protest", "Can be searched without any limits"], a: 1 },
    { q: "'Due process of law' means the government must:",
      c: ["Follow fair procedures before depriving someone of life, liberty, or property", "Get permission from the president for every arrest", "Hold all trials within 24 hours", "Let the victim decide the punishment"], a: 0 },
    { q: "The Fourth Amendment protects people against:",
      c: ["Unreasonable searches and seizures", "Double jeopardy", "Cruel and unusual punishment", "Laws establishing a religion"], a: 0 },
    { q: "'Pleading the Fifth' refers to the right to:",
      c: ["Refuse to answer questions that could incriminate you", "Skip jury duty", "Choose your own judge", "Delay your trial for five years"], a: 0 },
    { q: "The Eighth Amendment bans:",
      c: ["Cruel and unusual punishment", "All searches without warrants", "Double jeopardy", "Self-incrimination"], a: 0 },
    { q: "The Sixth Amendment guarantees a criminal defendant:",
      c: ["A speedy and public trial by an impartial jury", "A trial held in front of the Supreme Court", "Freedom from all searches", "A trial decided by a judge alone"], a: 0 }
  ];

  var Q_COL1 = [
    { q: "Originalism is the view that the Constitution should be interpreted by:",
      c: ["What its words meant when they were adopted", "Whatever the current president prefers", "Polls of modern voters", "The laws of other countries"], a: 0 },
    { q: "The 'living constitution' view holds that the Constitution's meaning:",
      c: ["Never changes under any circumstances", "Evolves as society's values and conditions change", "Was permanently frozen in 1803", "Can only be explained by judges from 1789"], a: 1 },
    { q: "In a negligence case, 'duty' means:",
      c: ["A legal obligation to use reasonable care toward others", "A promise written into a contract", "A tax owed to the state", "Obedience to a judge's order"], a: 0 },
    { q: "A defendant 'breaches' their duty of care when they:",
      c: ["Pay damages voluntarily", "Fail to act as a reasonably careful person would", "Admit guilt in open court", "File an appeal"], a: 1 },
    { q: "The 'causation' element of negligence requires showing that:",
      c: ["The defendant intended to cause harm", "The defendant's carelessness actually led to the injury", "The plaintiff was partly at fault", "Harm was possible in theory"], a: 1 },
    { q: "The 'damages' element of negligence requires that:",
      c: ["The plaintiff suffered real harm or loss", "The defendant apologized", "A crime was also committed", "The case reached the Supreme Court"], a: 0 },
    { q: "Compensatory damages are meant to:",
      c: ["Punish the wrongdoer", "Make the injured person whole by covering their losses", "Pay the lawyers on both sides", "Fine the defendant for the state"], a: 1 },
    { q: "For a contract to form, an 'offer' must be:",
      c: ["A casual suggestion with no commitment", "A clear proposal showing intent to be bound by its terms", "Written and notarized", "Approved by a judge first"], a: 1 },
    { q: "'Acceptance' in contract law means:",
      c: ["Agreeing to the offer's terms, forming a binding deal", "Thinking hard about an offer", "Making a completely different counterproposal", "Signing any piece of paper"], a: 0 },
    { q: "'Consideration' is:",
      c: ["Politeness during negotiations", "Something of value each side gives to make a promise binding", "A judge's approval of the deal", "The fine print in every contract"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "The exclusionary rule says that evidence obtained by violating the Fourth Amendment:",
      c: ["Can always be used at trial", "Generally cannot be used against the defendant at trial", "Must be returned to the police", "Can only be used in civil cases"], a: 1 },
    { q: "Mapp v. Ohio (1961) applied the exclusionary rule to:",
      c: ["Only federal courts", "State courts as well, through the Fourteenth Amendment", "Only traffic stops", "Military tribunals only"], a: 1 },
    { q: "The 'fruit of the poisonous tree' doctrine excludes:",
      c: ["Evidence found during a lawful search", "Evidence discovered as a result of an earlier illegal search", "Testimony from police officers", "Evidence the defendant shared voluntarily"], a: 1 },
    { q: "Under strict scrutiny, a law that classifies people by race is constitutional only if it:",
      c: ["Serves a compelling government interest and is narrowly tailored to it", "Saves the government money", "Is popular with most voters", "Has been on the books for decades"], a: 0 },
    { q: "Laws that classify people by gender are reviewed under:",
      c: ["Rational basis review", "Intermediate scrutiny: they must serve an important interest and be substantially related to it", "Strict scrutiny in every case", "No judicial review at all"], a: 1 },
    { q: "Under rational basis review, a law is upheld if it is:",
      c: ["Perfectly written", "Rationally related to a legitimate government interest", "Supported by a majority of judges personally", "Older than fifty years"], a: 1 },
    { q: "The Tenth Amendment reflects federalism by:",
      c: ["Giving Congress unlimited power", "Reserving powers not granted to the federal government for the states or the people", "Abolishing all state courts", "Letting the president override state laws at will"], a: 1 },
    { q: "The Commerce Clause gives Congress the power to:",
      c: ["Regulate commerce among the states", "Appoint state judges", "Write state constitutions", "Commandeer state legislatures"], a: 0 },
    { q: "Under Brandenburg v. Ohio (1969), speech urging lawbreaking can be punished only if it:",
      c: ["Criticizes the government", "Is directed at inciting imminent lawless action and is likely to produce it", "Offends most listeners", "Is spoken loudly in public"], a: 1 },
    { q: "'Prior restraint' is government censorship of speech:",
      c: ["After it is published", "Before it is published, and courts treat it as presumptively unconstitutional", "Only inside schools", "Only during wartime"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Maya wears a black armband to school to protest a new dress code. She does not chant, block hallways, or disrupt any class. The principal suspends her for three days, saying the armband 'sends the wrong message.' Maya's parents say the suspension violates her rights.",
      qs: [
        { q: "Which Supreme Court case protects Maya's armband protest?",
          c: ["Tinker v. Des Moines", "Brown v. Board of Education", "Miranda v. Arizona", "Marbury v. Madison"], a: 0 },
        { q: "Under Tinker, the school could only ban the armband if it:",
          c: ["Offended the principal", "Caused a substantial disruption of school activities", "Criticized a school policy", "Was worn by more than one student"], a: 1 }
      ] },
    { band: 24,
      text: "Police pull over Devon for a broken taillight. The officer asks to search the trunk. Devon says no. The officer opens the trunk anyway, without a warrant and without seeing anything suspicious, and finds a bag of stolen jewelry.",
      qs: [
        { q: "Which amendment makes this trunk search unreasonable?",
          c: ["Second", "Fourth", "Sixth", "Eighth"], a: 1 },
        { q: "Because Devon refused consent and the officer had no warrant or probable cause, the search was:",
          c: ["Legal, since traffic stops allow full searches", "Legal, because Devon looked nervous", "Unreasonable, and a judge can keep the jewelry out of the trial", "Unreasonable, but the evidence can still be used freely"], a: 2 }
      ] },
    { band: 28,
      text: "Priya offers to sell her used laptop to Sam for $300. Sam says, 'I accept, and I will pay you Friday.' They shake on it. On Thursday, Priya sells the laptop to someone else for $350 and tells Sam the deal is off.",
      qs: [
        { q: "Priya and Sam formed a contract because there was:",
          c: ["A written form", "An offer, acceptance, and consideration", "A lawyer present", "A government license"], a: 1 },
        { q: "If Sam sues over the broken deal, what could a court most likely award him?",
          c: ["The laptop itself, guaranteed", "Money damages for the broken deal", "A criminal sentence for Priya", "Nothing, since all deals must be in writing"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the path of a case through the court system in order, from first to last:",
      steps: ["Trial court hears evidence and decides the case", "Court of appeals reviews for legal errors", "State supreme court reviews the appeal", "U.S. Supreme Court may hear a final appeal"] },
    { band: 24, prompt: "Put the steps of a criminal trial in order, from first to last:",
      steps: ["Jury selection and opening statements", "The prosecution presents its case", "The defense presents its case", "Closing arguments and the jury's verdict"] },
    { band: 28, prompt: "Put the steps from arrest to punishment in order, from first to last:",
      steps: ["Arrest and booking", "Arraignment: charges are read and a plea is entered", "Trial: guilt or innocence is decided", "Sentencing: punishment is set"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "perjuryphantom", name: "Perjury Phantom", icon: "👻", hp: 44, power: 6, xp: 38, coins: [14, 30] },
    { id: "gavelgolem", name: "Gavel Golem", icon: "🔨", hp: 56, power: 8, xp: 48, coins: [14, 30] },
    { id: "theloophole", name: "THE LOOPHOLE", icon: "🕳️", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am THE LOOPHOLE! Every statute has a crack, and I live inside every one! Twist the words, dodge the verdict, and justice will never touch me!",
      outro: "Objection... overruled! My loopholes... are closing shut! The Hall of Justice stands, counselor. Case... dismissed..." }
  ];

  var NODES = [
    { id: "law1", name: "Marble Steps", monster: "perjuryphantom" },
    { id: "law2", name: "Echoing Rotunda", monster: "gavelgolem" },
    { id: "law3", name: "The High Bench", monster: "theloophole", boss: true }
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
  window.SubjectPacks.law = {
    id: "law",
    name: "Law",
    icon: "⚖️",
    elective: true,
    dungeon: { name: "The Hall of Justice", icon: "🏛️",
      desc: "A marble courthouse where twisted precedents stalk the halls." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 55000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 140000, order: 60000, default: 30000 }
    }
  };
})();
