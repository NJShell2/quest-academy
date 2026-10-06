/* ============================================================
   QUEST ACADEMY: Social Studies content pack
   High school through college social studies. Tiers 17-32.
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
    { q: "The three branches of the United States government are:",
      c: ["Legislative, executive, and judicial", "Legislative, military, and judicial", "Executive, judicial, and financial", "Legislative, executive, and electoral"], a: 0 },
    { q: "Which branch of government makes federal laws?",
      c: ["The executive branch", "The judicial branch", "The legislative branch", "The military branch"], a: 2 },
    { q: "The first ten amendments to the Constitution are known as:",
      c: ["The Articles of Confederation", "The Bill of Rights", "The Federalist Papers", "The Emancipation Edicts"], a: 1 },
    { q: "Which right is protected by the First Amendment?",
      c: ["The right to bear arms", "Freedom of speech", "The right to a jury trial", "Protection against self-incrimination"], a: 1 },
    { q: "Which branch decides whether a law follows the Constitution?",
      c: ["The legislative branch", "The executive branch", "The judicial branch", "The electoral branch"], a: 2 },
    { q: "The head of the executive branch is:",
      c: ["The Chief Justice", "The Speaker of the House", "The Secretary of State", "The President"], a: 3 },
    { q: "The United States Constitution was written in:",
      c: ["1776", "1787", "1791", "1865"], a: 1 },
    { q: "The Declaration of Independence was adopted in:",
      c: ["1763", "1776", "1787", "1800"], a: 1 },
    { q: "The first President of the United States was:",
      c: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], a: 2 },
    { q: "How many senators does each state get?",
      c: ["One", "Two", "Ten", "A number based on population"], a: 1 },
    { q: "Members of the House of Representatives serve terms of:",
      c: ["Two years", "Four years", "Six years", "Eight years"], a: 0 },
    { q: "The American Civil War was fought from:",
      c: ["1775 to 1783", "1812 to 1815", "1861 to 1865", "1914 to 1918"], a: 2 },
    { q: "Which amendment gave women the right to vote?",
      c: ["The 15th Amendment", "The 17th Amendment", "The 19th Amendment", "The 21st Amendment"], a: 2 },
    { q: "The largest US state by land area is:",
      c: ["Texas", "California", "Alaska", "Montana"], a: 2 }
  ];

  var Q_HS2 = [
    { q: "Marbury v. Madison (1803) established the principle of:",
      c: ["Judicial review", "Federal supremacy", "Executive privilege", "States' rights"], a: 0 },
    { q: "Federalism is the division of power between:",
      c: ["Congress and the President", "National and state governments", "The courts and the military", "Cities and counties"], a: 1 },
    { q: "McCulloch v. Maryland (1819) confirmed:",
      c: ["The right to bear arms", "Congress's implied powers and federal supremacy", "The end of slavery", "Women's right to vote"], a: 1 },
    { q: "The Reconstruction Amendments are the:",
      c: ["1st, 2nd, and 3rd", "9th, 10th, and 11th", "13th, 14th, and 15th", "16th, 17th, and 18th"], a: 2 },
    { q: "The 13th Amendment:",
      c: ["Gave women the vote", "Abolished slavery", "Created the income tax", "Set the voting age at 18"], a: 1 },
    { q: "The 14th Amendment's Equal Protection Clause requires states to:",
      c: ["Hold elections every year", "Treat people equally under the law", "Fund public schools", "Open their borders"], a: 1 },
    { q: "During the Progressive Era, muckrakers were:",
      c: ["Factory owners", "Journalists who exposed corruption", "Railroad barons", "Foreign spies"], a: 1 },
    { q: "President Roosevelt's New Deal was a plan to:",
      c: ["Win World War I", "Fight the Great Depression", "Build the Panama Canal", "End Prohibition"], a: 1 },
    { q: "The US Cold War policy of stopping the spread of communism was called:",
      c: ["Isolationism", "Appeasement", "Containment", "Détente from the start"], a: 2 },
    { q: "Brown v. Board of Education (1954) declared that:",
      c: ["Segregated public schools are unconstitutional", "Poll taxes are legal", "Schools must be funded equally", "Prayer is allowed in schools"], a: 0 },
    { q: "Plessy v. Ferguson (1896) had established the doctrine of:",
      c: ["Judicial review", "Separate but equal", "One person, one vote", "Clear and present danger"], a: 1 },
    { q: "A presidential veto can be overridden by:",
      c: ["A majority of the Supreme Court", "A two-thirds vote of Congress", "An order from the Vice President", "A national referendum"], a: 1 },
    { q: "Miranda v. Arizona (1966) requires police to:",
      c: ["Obtain a warrant for every arrest", "Inform suspects of their rights", "Provide a lawyer within one hour", "Record all interrogations"], a: 1 },
    { q: "The Marshall Plan gave US aid to:",
      c: ["Rebuild Western Europe after World War II", "Colonize the Moon", "Fund the United Nations", "Build the interstate highways"], a: 0 }
  ];

  var Q_COL1 = [
    { q: "John Locke argued that natural rights include:",
      c: ["Life, liberty, and property", "Food, shelter, and clothing", "Land, gold, and titles", "Peace, order, and obedience"], a: 0 },
    { q: "In Leviathan, Thomas Hobbes argued that:",
      c: ["Government should be abolished", "People need a strong ruler to escape violent chaos", "Democracy is the only just system", "Kings rule by divine miracle"], a: 1 },
    { q: "Montesquieu's most influential idea was:",
      c: ["The social contract", "The separation of powers", "The general will", "Natural selection"], a: 1 },
    { q: "Rousseau's concept of the general will refers to:",
      c: ["A king's commands", "The shared interest of citizens as a whole", "A majority vote on every law", "The will of the strongest"], a: 1 },
    { q: "Popular sovereignty means that:",
      c: ["The military holds power", "Political power comes from the people", "Judges rule the nation", "Power is inherited"], a: 1 },
    { q: "In international relations, realism holds that states mainly act to:",
      c: ["Spread their culture", "Gain power and ensure security", "Obey international law", "Promote free trade"], a: 1 },
    { q: "Liberal theory in international relations emphasizes:",
      c: ["Constant warfare", "Cooperation through international institutions", "The rule of the strongest", "Closing all borders"], a: 1 },
    { q: "The permanent members of the UN Security Council are the US, UK, France, Russia, and:",
      c: ["Germany", "Japan", "China", "India"], a: 2 },
    { q: "State sovereignty means:",
      c: ["Supreme authority over a territory", "Control of the seas", "The right to print money", "Freedom from all laws"], a: 0 },
    { q: "The Magna Carta of 1215 is important because it:",
      c: ["Founded Parliament", "Limited the power of the king", "Ended feudalism", "Created the jury system"], a: 1 },
    { q: "Federalist No. 10 argues that a large republic can:",
      c: ["Eliminate all factions", "Control the harmful effects of factions", "Ignore public opinion", "Rule without a constitution"], a: 1 },
    { q: "Federalist No. 51 defends checks and balances with the line:",
      c: ["All men are created equal", "Ambition must be made to counteract ambition", "Government is a necessary evil", "The price of liberty is eternal vigilance"], a: 1 },
    { q: "Social contract theory says that people:",
      c: ["Owe nothing to government", "Trade some freedom for protection by government", "Must obey without question", "Can ignore unjust laws freely"], a: 1 },
    { q: "Limited government means that officials:",
      c: ["Serve short terms only", "Must act within constitutional bounds", "Cannot raise taxes", "Need no elections"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "Historiography is:",
      c: ["The study of ancient artifacts", "The study of how historians interpret the past", "The writing of laws", "The mapping of old trade routes"], a: 1 },
    { q: "A soldier's diary from 1863 is an example of a:",
      c: ["Secondary source", "Tertiary source", "Primary source", "Fictional source"], a: 2 },
    { q: "Under strict scrutiny, the government must show:",
      c: ["A rational basis for the law", "A compelling interest and narrow tailoring", "Approval from Congress", "A national emergency"], a: 1 },
    { q: "The incorporation doctrine:",
      c: ["Creates new states", "Applies most of the Bill of Rights to the states", "Lets states ignore federal law", "Adds amendments automatically"], a: 1 },
    { q: "Stare decisis means that courts should:",
      c: ["Follow earlier decisions as precedent", "Decide cases by popular vote", "Ignore old rulings", "Ask Congress for guidance"], a: 0 },
    { q: "In a parliamentary system like the United Kingdom's:",
      c: ["The chief executive comes from the legislature", "The president is directly elected", "Judges run the government", "States hold most power"], a: 0 },
    { q: "In a unitary system of government:",
      c: ["Power is concentrated in the central government", "States can veto national law", "There is no constitution", "Cities rule themselves fully"], a: 0 },
    { q: "Judicial restraint holds that judges should:",
      c: ["Strike down laws freely", "Defer to elected branches when possible", "Write new legislation", "Avoid all hard cases"], a: 1 },
    { q: "Originalism interprets the Constitution according to:",
      c: ["Modern public opinion", "The meaning understood when it was adopted", "International law", "Whatever seems fair today"], a: 1 },
    { q: "Wickard v. Filburn (1942) showed that the Commerce Clause can reach:",
      c: ["Only trade between nations", "Local activity with national economic effects", "Military decisions", "State court rulings"], a: 1 },
    { q: "Gideon v. Wainwright (1963) guaranteed:",
      c: ["A speedy trial for all", "A lawyer for felony defendants who cannot afford one", "Freedom of the press", "The right to remain silent"], a: 1 },
    { q: "First-past-the-post elections tend to produce:",
      c: ["Two dominant parties", "Dozens of equal parties", "No political parties", "One permanent party"], a: 0 },
    { q: "The Supremacy Clause means that:",
      c: ["States can nullify federal law", "Federal law overrides conflicting state law", "The President is above the law", "Courts outrank Congress"], a: 1 },
    { q: "Procedural due process requires:",
      c: ["Fair procedures before the government takes life, liberty, or property", "Trials within one week", "Free lawyers for everyone", "Juries of twelve in all cases"], a: 0 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Last spring, Congress passed a bill to fund new public libraries. The President vetoed it. The House and Senate voted again, and more than two thirds of each chamber voted yes. The bill became law without the President's signature.",
      qs: [
        { q: "What is this process called?",
          c: ["A pocket veto", "An override of the veto", "A filibuster", "An executive order"], a: 1 },
        { q: "Why is Congress able to make the law anyway?",
          c: ["The President allowed it", "The Constitution provides checks and balances", "The courts ordered it", "The states demanded it"], a: 1 }
      ] },
    { band: 24,
      text: "It has long been observed that power placed in human hands tends toward abuse. The surest guard against this danger is to divide power among separate offices, so that ambition in one is checked by ambition in another. A free republic does not survive by trusting its rulers. It survives by arranging its institutions so that each part watches the rest.",
      qs: [
        { q: "Which idea does this passage defend?",
          c: ["Divine right of kings", "Separation of powers with checks and balances", "Direct democracy", "Rule by experts"], a: 1 },
        { q: "The argument echoes which Federalist essay?",
          c: ["Federalist No. 10", "Federalist No. 51", "Federalist No. 78", "Federalist No. 84"], a: 1 }
      ] },
    { band: 28,
      text: "In October 1962, American spy planes photographed Soviet nuclear missiles in Cuba, ninety miles from Florida. President Kennedy ordered a naval blockade and demanded their removal. For thirteen days the world held its breath. In the end the Soviets withdrew the missiles, and the United States quietly removed its own missiles from Turkey.",
      qs: [
        { q: "Which Cold War crisis does this describe?",
          c: ["The Berlin Airlift", "The Cuban Missile Crisis", "The Korean War", "The Suez Crisis"], a: 1 },
        { q: "Both sides backed down rather than risk nuclear war. This best illustrates:",
          c: ["Appeasement", "Isolationism", "Deterrence", "Imperialism"], a: 2 }
      ] },
    { band: 32,
      text: "Two historians study the same 1929 bank records and newspapers. Dr. Alvarez argues that the stock market crash caused the Great Depression. Dr. Okafor argues that the crash was only the trigger, and that weak banks and collapsing farm prices made a depression nearly inevitable.",
      qs: [
        { q: "Why do the two historians disagree?",
          c: ["They read different documents", "They interpret the same evidence differently", "One of them is lying", "The documents are forged"], a: 1 },
        { q: "Dr. Alvarez's book about the Depression is a:",
          c: ["Primary source", "Secondary source", "Government record", "Artifact"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the steps of how a bill becomes law in order:",
      steps: ["A bill is introduced in Congress", "Committees debate and revise it", "Both chambers vote to pass it", "The President signs it into law"] },
    { band: 24, prompt: "Put these World War II events in order:",
      steps: ["Germany invades Poland in 1939", "Japan attacks Pearl Harbor in 1941", "Allied troops land in Normandy in 1944", "Germany surrenders in 1945"] },
    { band: 28, prompt: "Put these eras of United States history in order:",
      steps: ["The colonial era", "Revolution and the founding", "Civil War and Reconstruction", "The Cold War"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "dustgoblin", name: "Dust Goblin", icon: "👺", hp: 34, power: 5, xp: 30, coins: [12, 22] },
    { id: "scrollserpent", name: "Scroll Serpent", icon: "🐍", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "statuesentinel", name: "Statue Sentinel", icon: "🗿", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "censorwraith", name: "Censor Wraith", icon: "👻", hp: 64, power: 8, xp: 54, coins: [18, 34] },
    { id: "therevisionist", name: "THE REVISIONIST", icon: "👑", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am THE REVISIONIST! History is whatever I decree! Your facts will burn, and my version shall stand forever!",
      outro: "No... the records... they remember the truth... The Archives are yours, scholar!" }
  ];

  var NODES = [
    { id: "soc1", name: "Foyer of the Founders", monster: "dustgoblin" },
    { id: "soc2", name: "Hall of Scrolls", monster: "scrollserpent" },
    { id: "soc3", name: "Gallery of Statues", monster: "statuesentinel" },
    { id: "soc4", name: "The Censored Stacks", monster: "censorwraith" },
    { id: "soc5", name: "The Revisionist's Throne", monster: "therevisionist", boss: true }
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
  window.SubjectPacks.social = {
    id: "social",
    name: "Social Studies",
    icon: "🏛️",
    dungeon: { name: "The Archives of Ages", icon: "📚",
      desc: "A vast library of human history where a tyrant is rewriting the records." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 50000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 130000, order: 60000, default: 30000 }
    }
  };
})();
