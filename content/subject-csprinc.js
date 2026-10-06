/* ============================================================
   QUEST ACADEMY - Computer Science Principles content pack
   High school through college CS principles. Tiers 17-32.
   Elective: scaled to the wing (3 nodes, smaller banks).
   The PRINCIPLES view: big ideas, abstraction, societal impact.
   (Hardware, coding mechanics, and security tooling live in the
   Technology pack, so this pack avoids duplicating those.)
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
    { q: "Computing is best described as:",
      c: ["Building faster computers", "Using algorithms to process information", "Typing quickly", "Repairing hardware"], a: 1 },
    { q: "What is the difference between data and information?",
      c: ["They are the same thing", "Data are raw values; information is data given meaning through context", "Information is always numeric", "Data is always secret"], a: 1 },
    { q: "A single binary digit (a bit) can represent:",
      c: ["Ten values, 0 to 9", "Two values, 0 or 1", "Any letter directly", "Infinite values"], a: 1 },
    { q: "Eight bits grouped together make one:",
      c: ["Byte", "Pixel", "Router", "Virus"], a: 0 },
    { q: "With 8 bits, how many different values can be represented?",
      c: ["8", "16", "64", "256"], a: 3 },
    { q: "The internet is best described as:",
      c: ["One giant company", "A network of networks", "A single supercomputer", "A government program"], a: 1 },
    { q: "A digital footprint is:",
      c: ["The size of your phone", "The trail of data you leave behind online", "A type of computer virus", "Your typing speed"], a: 1 },
    { q: "A computing device is any machine that can:",
      c: ["Run a program and process data", "Connect to a printer", "Play video games", "Charge a phone"], a: 0 },
    { q: "Raw numbers coming from a temperature sensor are an example of:",
      c: ["Information", "Data", "A program", "An algorithm"], a: 1 }
  ];

  var Q_HS2 = [
    { q: "In computing, an abstraction hides:",
      c: ["The program's bugs", "Complex details so only the important parts show", "The user's password", "The computer screen"], a: 1 },
    { q: "How does an algorithm differ from a program?",
      c: ["An algorithm is hardware", "An algorithm is a step-by-step procedure; a program is that procedure written in code", "Programs never use algorithms", "They are identical"], a: 1 },
    { q: "Which of these is an example of metadata?",
      c: ["The plot of a movie", "The date and location saved with a photo", "A song's lyrics", "A book's author interview"], a: 1 },
    { q: "When a message travels the internet, it is first broken into:",
      c: ["Emails", "Packets", "Cookies", "Files"], a: 1 },
    { q: "Fault tolerance on the internet means the network:",
      c: ["Never makes mistakes", "Keeps working even when parts of it fail", "Blocks all hackers", "Runs on one cable"], a: 1 },
    { q: "Redundancy improves fault tolerance because:",
      c: ["It makes packets smaller", "Extra paths and components take over when one fails", "It speeds up typing", "It removes all errors"], a: 1 },
    { q: "Each packet sent over the internet carries:",
      c: ["The whole message", "A piece of the message plus its destination address", "Only the sender's name", "A virus scan"], a: 1 },
    { q: "For AP Computer Science Principles, a computing innovation must include:",
      c: ["A touchscreen", "A computer or program code as an integral part of how it works", "A battery", "A famous inventor"], a: 1 },
    { q: "Which of these shows creativity through computing?",
      c: ["Unplugging a router", "Designing an original app or game", "Buying a new monitor", "Charging a laptop"], a: 1 }
  ];

  var Q_COL1 = [
    { q: "A variable is an example of abstraction because it:",
      c: ["Deletes old data", "Hides the details of how and where data is stored in memory", "Makes programs slower", "Renames files"], a: 1 },
    { q: "Which expression uses Boolean logic correctly?",
      c: ["(x > 5) AND (x < 10)", "(x about 5) MAYBE (x near 10)", "x = 5 OR ELSE", "NOTHING BUT x"], a: 0 },
    { q: "The NOT operator in Boolean logic:",
      c: ["Adds two values", "Reverses true to false and false to true", "Repeats a loop", "Deletes a variable"], a: 1 },
    { q: "A list in programming is best described as:",
      c: ["A single number", "An ordered collection of items, each reached by its position", "A type of virus", "A printed page"], a: 1 },
    { q: "Iterating through a list means:",
      c: ["Sorting it alphabetically", "Visiting each item in the list in order", "Deleting it", "Printing it twice"], a: 1 },
    { q: "Ice cream sales and drowning deaths both rise in summer. This shows that:",
      c: ["Ice cream causes drowning", "Correlation does not prove causation", "Drowning causes ice cream sales", "Data cannot be trusted"], a: 1 },
    { q: "To move from correlation to a claim of causation, a researcher should:",
      c: ["Collect more opinions", "Run a controlled experiment", "Make a bigger chart", "Ask an expert once"], a: 1 },
    { q: "The digital divide is the gap between:",
      c: ["Old and new phones", "People with and without access to computing and the internet", "Gamers and non-gamers", "Mac and PC users"], a: 1 },
    { q: "A conditional (if statement) lets a program:",
      c: ["Run forever", "Make decisions by running different code for different conditions", "Print only numbers", "Delete itself"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "In 2018 Amazon scrapped an experimental hiring tool because it:",
      c: ["Was too slow", "Downgraded resumes containing words like \"women's\" after learning from past male-dominated hiring", "Cost too much", "Only read PDFs"], a: 1 },
    { q: "The Gender Shades study found that some commercial face-analysis systems:",
      c: ["Worked perfectly for everyone", "Were far less accurate on darker-skinned women than on lighter-skinned men", "Could read minds", "Only worked at night"], a: 1 },
    { q: "Which of these counts as personally identifiable information (PII)?",
      c: ["Your favorite color", "Your name, home address, and Social Security number", "The weather today", "A movie quote"], a: 1 },
    { q: "Data mining is the practice of:",
      c: ["Digging for coal", "Analyzing large datasets to find useful patterns", "Deleting old files", "Building data centers"], a: 1 },
    { q: "Even \"anonymous\" data can threaten privacy because data mining can:",
      c: ["Make files smaller", "Combine datasets to re-identify individuals", "Speed up downloads", "Translate languages"], a: 1 },
    { q: "Authentication and authorization differ in that:",
      c: ["They are the same thing", "Authentication verifies WHO you are; authorization decides WHAT you may access", "Authorization comes before authentication", "Only banks use them"], a: 1 },
    { q: "Which of these is an example of authentication?",
      c: ["An admin granting file access", "Entering a password to prove your identity", "A firewall blocking a port", "Backing up data"], a: 1 },
    { q: "Open source software differs from proprietary software in that:",
      c: ["It is always free of bugs", "Its source code is public and may be modified and shared", "It never has a license", "Only companies may use it"], a: 1 },
    { q: "Computing innovations can produce effects that are:",
      c: ["Only beneficial", "Both beneficial and harmful, intended and unintended", "Only financial", "Never surprising"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Lincoln High rolls out a new lunch-payment app. Students scan a QR code to pay, and the app quietly records each student's location every five minutes, all day. The school says the location data is \"anonymous\" and shares it with an advertising company. A student journalist discovers that one \"anonymous\" record visits the same home address and the same classroom every day.",
      qs: [
        { q: "Why is the \"anonymous\" location data still a privacy risk?",
          c: ["It uses too much battery", "Patterns like a home address and classroom can re-identify a student", "Advertisers are always honest", "QR codes are unsafe"], a: 1 },
        { q: "Which data collected by the app counts as PII when combined with the pattern?",
          c: ["The lunch menu", "The student's home address", "The app's icon color", "The price of milk"], a: 1 }
      ] },
    { band: 24,
      text: "A city starts using an automated screener to rank job applications for bus drivers. The screener was trained on ten years of past hiring decisions, a period when almost all drivers hired were men. After one year, qualified women applicants are rejected at three times the rate of equally qualified men, even though gender is not an input to the program.",
      qs: [
        { q: "Why did the screener become biased even though gender was never an input?",
          c: ["It learned the bias hidden in its training data", "It read the applicants' minds", "Buses prefer men", "The program was hacked"], a: 0 },
        { q: "What is the most direct way to reduce this kind of bias?",
          c: ["Hide the program's output", "Audit the results and retrain on fair, representative data", "Hire fewer drivers", "Ban computers"], a: 1 }
      ] },
    { band: 28,
      text: "A ride-share app arrives in the small town of Millfield. Benefits appear fast: late-night workers get home safely and some residents earn extra income driving. But rents near downtown rise as short-term visitors flood in, local taxi companies fold, and the app's surge pricing charges stranded riders triple fares during a winter storm.",
      qs: [
        { q: "Which of these is an UNINTENDED harmful effect of the innovation?",
          c: ["Residents earning driving income", "Surge pricing during a storm stranding vulnerable riders", "Late-night workers getting home", "The app using GPS"], a: 1 },
        { q: "A full evaluation of a computing innovation should consider:",
          c: ["Only the company's profits", "Both benefits and harms, including effects nobody planned for", "Only the newest features", "Only what the ads promise"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 24, prompt: "Put the program development cycle in order, from first to last:",
      steps: ["Investigate the problem and its requirements", "Design a solution", "Build a working prototype", "Test, get feedback, and refine"] },
    { band: 28, prompt: "Put the journey of data across the internet in order:",
      steps: ["The sender's message is broken into packets", "Packets travel independently through routers", "Packets are reassembled in order", "The receiver gets the complete message"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "logicimp", name: "Logic Imp", icon: "🧩", hp: 44, power: 6, xp: 40, coins: [14, 28] },
    { id: "packetpirate", name: "Packet Pirate", icon: "🏴‍☠️", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "theblackbox", name: "THE BLACK BOX", icon: "⬛", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am THE BLACK BOX! My decisions are final and my reasons are mine alone! Explain me if you can, scholar!",
      outro: "Cracked... opened... Every black box falls to a mind that asks how. The Labyrinth is yours!" }
  ];

  var NODES = [
    { id: "csp1", name: "Binary Gate", monster: "logicimp" },
    { id: "csp2", name: "Packet Pass", monster: "packetpirate" },
    { id: "csp3", name: "The Black Box Sanctum", monster: "theblackbox", boss: true }
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
  window.SubjectPacks.csprinc = {
    id: "csprinc",
    name: "CS Principles",
    icon: "🤖",
    elective: true,
    dungeon: { name: "The Logic Labyrinth", icon: "🌀",
      desc: "A shifting maze of riddles, packets, and black boxes." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 55000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 140000, order: 60000, default: 30000 }
    }
  };
})();
