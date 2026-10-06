/* ============================================================
   QUEST ACADEMY: Technology content pack
   High school through college technology. Tiers 17-32.
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
    { q: "Which of these is an example of hardware?",
      c: ["A web browser", "A keyboard", "A spreadsheet app", "An operating system"], a: 1 },
    { q: "Which of these is an example of software?",
      c: ["A monitor", "A printer", "A word processor", "A mouse"], a: 2 },
    { q: "The CPU is best described as the computer's:",
      c: ["Permanent storage", "Brain that runs instructions", "Screen", "Power supply"], a: 1 },
    { q: "RAM is best described as the computer's:",
      c: ["Short-term working memory", "Permanent file storage", "Internet connection", "Graphics card"], a: 0 },
    { q: "Which device keeps your files saved even when the power is off?",
      c: ["RAM", "CPU cache", "Solid state drive", "Graphics card"], a: 2 },
    { q: "What is the main job of a web browser?",
      c: ["To cool the computer", "To display web pages", "To charge the battery", "To block all pop-ups"], a: 1 },
    { q: "In the address https://www.library.org/books, which part is the domain name?",
      c: ["https://", "www.library.org", "/books", "The whole address"], a: 1 },
    { q: "Which search trick finds pages with an exact phrase?",
      c: ["Typing in ALL CAPS", "Putting the phrase in quotes", "Adding extra words", "Typing faster"], a: 1 },
    { q: "Before posting a photo of a classmate online, you should:",
      c: ["Add a funny caption", "Get their permission", "Tag their exact location", "Post it at midnight"], a: 1 },
    { q: "Which password is the strongest?",
      c: ["password123", "Your birthday", "FluffyTheCat", "A long mix of words, numbers, and symbols"], a: 3 },
    { q: "Why is reusing one password on many sites risky?",
      c: ["It is hard to remember", "One breach can expose every account", "Sites charge extra", "Passwords expire faster"], a: 1 },
    { q: "WiFi connects devices using:",
      c: ["Radio waves", "Sound waves", "Light cables", "Magnets"], a: 0 }
  ];

  var Q_HS2 = [
    { q: "In programming, a variable is:",
      c: ["A type of virus", "A named container that stores a value", "A broken program", "A computer part"], a: 1 },
    { q: "In the code for i in range(5): print(i), how many times does print run?",
      c: ["4", "5", "6", "Forever"], a: 1 },
    { q: "In an if/else statement, the else block runs when:",
      c: ["The condition is true", "The condition is false", "The program starts", "An error occurs"], a: 1 },
    { q: "The main benefit of using functions is:",
      c: ["Faster internet", "Code that can be reused", "Bigger screens", "More storage"], a: 1 },
    { q: "A single bit can represent how many different values?",
      c: ["1", "2", "8", "10"], a: 1 },
    { q: "How many bits make up one byte?",
      c: ["2", "4", "8", "16"], a: 2 },
    { q: "What is the binary number 101 in decimal?",
      c: ["3", "5", "6", "101"], a: 1 },
    { q: "An IP address is used to:",
      c: ["Name a website", "Identify a device on a network", "Encrypt a file", "Speed up a CPU"], a: 1 },
    { q: "DNS works most like:",
      c: ["A phone book that turns website names into IP addresses", "A firewall", "A search engine", "An antivirus"], a: 0 },
    { q: "Compared to WiFi, a wired ethernet connection is usually:",
      c: ["Slower and less stable", "Faster and more stable", "Wireless too", "Only for phones"], a: 1 },
    { q: "Which is a classic sign of a phishing email?",
      c: ["A polite greeting", "An urgent demand to click a link and log in", "Correct spelling", "A known sender"], a: 1 },
    { q: "Ransomware is malware that:",
      c: ["Shows ads", "Locks files and demands payment", "Speeds up the PC", "Deletes spam"], a: 1 }
  ];

  var Q_COL1 = [
    { q: "An algorithm is:",
      c: ["A computer virus", "A step-by-step procedure for solving a problem", "A programming language", "A type of hardware"], a: 1 },
    { q: "Which sorting method works by repeatedly swapping neighboring items that are out of order?",
      c: ["Bubble sort", "Binary search", "Hashing", "Encryption"], a: 0 },
    { q: "Why is binary search faster than checking every item in a sorted list?",
      c: ["It skips the list entirely", "It halves the search space with each step", "It uses two CPUs", "It guesses randomly"], a: 1 },
    { q: "In a database table, the columns are also called:",
      c: ["Records", "Fields", "Queries", "Keys"], a: 1 },
    { q: "What does SELECT name FROM students WHERE grade > 90; return?",
      c: ["All columns for every student", "The name column for students with grades above 90", "The number 90", "An empty table"], a: 1 },
    { q: "In SQL, which clause filters which rows a query returns?",
      c: ["SELECT", "FROM", "WHERE", "ORDER"], a: 2 },
    { q: "A primary key in a database table:",
      c: ["Encrypts the table", "Uniquely identifies each row", "Sorts the columns", "Deletes duplicates automatically"], a: 1 },
    { q: "In the client-server model, the client is:",
      c: ["The computer that stores the website", "The program or device that requests data", "The internet cable", "The database"], a: 1 },
    { q: "A web server's main job is to:",
      c: ["Browse the web", "Respond to requests with pages or data", "Print documents", "Charge the battery"], a: 1 },
    { q: "HTTP is best described as:",
      c: ["A programming language", "The rules browsers and servers use to exchange web pages", "A type of computer", "An antivirus program"], a: 1 },
    { q: "Encryption protects data by:",
      c: ["Deleting it after reading", "Scrambling it so only a key holder can read it", "Compressing it smaller", "Copying it to the cloud"], a: 1 },
    { q: "Two-factor authentication is stronger than a password alone because:",
      c: ["Passwords get longer", "An attacker also needs the second factor, like your phone", "It never expires", "It works offline only"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "An array's biggest strength is:",
      c: ["Unlimited resizing", "Fast access to any element by its index", "Automatic sorting", "Built-in encryption"], a: 1 },
    { q: "A linked list stores its elements as:",
      c: ["One solid block of memory", "Nodes connected by links to the next node", "A sorted tree", "Encrypted files"], a: 1 },
    { q: "A hash map (dictionary) is best for:",
      c: ["Storing files on disk", "Looking up a value quickly by its key", "Sorting numbers", "Drawing graphics"], a: 1 },
    { q: "Inserting an item at the front is fastest in a:",
      c: ["Array", "Linked list", "Stack of paper", "Spreadsheet"], a: 1 },
    { q: "In machine learning, training data is:",
      c: ["The final test scores", "The examples a model learns patterns from", "The user manual", "The hardware specs"], a: 1 },
    { q: "A trained machine learning model is:",
      c: ["A faster computer", "Software whose settings were tuned on data to make predictions", "A database backup", "A robot body"], a: 1 },
    { q: "A model that memorizes its training data but fails on new data is:",
      c: ["Underfitting", "Overfitting", "Debugging", "Compiling"], a: 1 },
    { q: "The TCP protocol's main job is to:",
      c: ["Assign IP addresses", "Deliver data reliably and in order", "Encrypt passwords", "Display web pages"], a: 1 },
    { q: "The IP protocol is responsible for:",
      c: ["Reliable delivery", "Addressing packets and routing them to the destination", "Rendering HTML", "Compressing video"], a: 1 },
    { q: "Which list puts the TCP/IP network layers in the correct top-down order?",
      c: ["Link, Internet, Transport, Application", "Application, Transport, Internet, Link", "Transport, Application, Link, Internet", "Internet, Link, Application, Transport"], a: 1 },
    { q: "Bias in an AI system most often comes from:",
      c: ["Faster processors", "Training data that underrepresents some groups", "Too much RAM", "Open source code"], a: 1 },
    { q: "Which practice best protects user privacy?",
      c: ["Collecting every possible data point", "Collecting only the data you need", "Sharing data with advertisers", "Storing passwords in plain text"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Lena wrote a program that should print the numbers 1 through 10, but it only prints 1 through 9. Her code is: for i in range(1, 10): print(i). She stares at the screen, sure the loop looks right.",
      qs: [
        { q: "Why does the program stop at 9?",
          c: ["The computer cannot count to 10", "range(1, 10) stops before reaching 10", "print skips the last number", "The loop runs too fast"], a: 1 },
        { q: "What is the simplest fix?",
          c: ["Add another print line", "Change range(1, 10) to range(1, 11)", "Restart the computer", "Delete the loop"], a: 1 }
      ] },
    { band: 24,
      text: "Priya gets an email that looks like it is from her bank. It says her account will be locked in 24 hours unless she verifies her login. The sender is support@secure-bank-alerts.net, and the button links to bank-verify-login.ru. The message has two typos and addresses her as Dear Customer.",
      qs: [
        { q: "Which detail is the strongest red flag?",
          c: ["The greeting is formal", "The link domain does not match her bank", "The email is long", "It arrived in the morning"], a: 1 },
        { q: "What should Priya do?",
          c: ["Click the link quickly before the deadline", "Reply with her password to confirm", "Delete the email and log in through the bank's real site", "Forward it to her friends"], a: 2 }
      ] },
    { band: 28,
      text: "The school store keeps a SALES table with columns item, price, quantity, and day. On Friday the manager wants the total revenue for each item sold that day. The cashier suggests this query: SELECT item, SUM(price * quantity) FROM SALES WHERE day = 'Friday' GROUP BY item;",
      qs: [
        { q: "What does the WHERE clause do in this query?",
          c: ["Sorts the results", "Keeps only the Friday rows", "Deletes old rows", "Adds a new column"], a: 1 },
        { q: "What does SUM(price * quantity) compute?",
          c: ["The number of items", "The total revenue per item", "The average price", "The busiest day"], a: 1 }
      ] },
    { band: 32,
      text: "A company trains a hiring tool on ten years of its past hiring decisions. In testing, the tool rejects qualified women far more often than qualified men. An audit finds the historical data itself favored men, so the model learned to copy that pattern.",
      qs: [
        { q: "What is the most likely cause of the unfair results?",
          c: ["The model is too slow", "The training data reflected past bias", "Women applied less often", "The code has a typo"], a: 1 },
        { q: "Which step best addresses the problem?",
          c: ["Train on more of the same data", "Rebalance the data and audit the outcomes", "Hide the results", "Delete the model and guess randomly"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the steps of a web request in order, from first to last:",
      steps: ["You click a link in your browser", "DNS turns the site name into an IP address", "Your browser sends a request to the server", "The server sends back the page"] },
    { band: 24, prompt: "Put the software development life cycle in order:",
      steps: ["Plan what the software should do", "Design how it will work", "Write the code", "Test it and fix the bugs"] },
    { band: 28, prompt: "Put the steps of a binary search in order:",
      steps: ["Look at the middle item of the sorted list", "Compare it with the value you want", "Keep the half that could hold the value, drop the other", "Repeat until you find the value or run out of items"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "cachecritter", name: "Cache Critter", icon: "📦", hp: 34, power: 5, xp: 30, coins: [12, 22] },
    { id: "voltvirus", name: "Volt Virus", icon: "🦠", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "spamspecter", name: "Spam Specter", icon: "👻", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "datadaemon", name: "Data Daemon", icon: "😈", hp: 64, power: 8, xp: 54, coins: [18, 34] },
    { id: "theglitchking", name: "THE GLITCH KING", icon: "👑", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am the GLITCH KING! I corrupt every byte in this citadel! Your code ends HERE!",
      outro: "No... my bugs... debugged... The Circuit Citadel compiles again. You win, coder." }
  ];

  var NODES = [
    { id: "tech1", name: "Copper Gate", monster: "cachecritter" },
    { id: "tech2", name: "Server Corridor", monster: "voltvirus" },
    { id: "tech3", name: "Corrupted Stacks", monster: "spamspecter" },
    { id: "tech4", name: "Firewall Chamber", monster: "datadaemon" },
    { id: "tech5", name: "Glitch King's Throne", monster: "theglitchking", boss: true }
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
  window.SubjectPacks.technology = {
    id: "technology",
    name: "Technology",
    icon: "💻",
    dungeon: { name: "The Circuit Citadel", icon: "🏰",
      desc: "A towering server fortress where rogue programs have seized the mainframe." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 50000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 130000, order: 60000, default: 30000 }
    }
  };
})();
