/* ============================================================
   QUEST ACADEMY - Math content pack
   High school through college math. Tiers 17-32.
   Built LAST by design: the capstone subject.
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
     Bands: 17-20 grades 9-10 (algebra, geometry),
            21-24 grades 11-12 (Algebra II, precalculus),
            25-28 college years 1-2 (AP Calculus AB),
            29-32 college years 3-4 (BC series, linear algebra,
            statistics, discrete math). */
  var Q_HS1 = [
    { q: "Solve for x: 2x + 7 = 19",
      c: ["5", "6", "7", "8"], a: 1 },
    { q: "Factor: x^2 + 5x + 6",
      c: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x - 2)(x - 3)", "(x + 5)(x + 1)"], a: 0 },
    { q: "Solve for x: 3(x - 2) = 21",
      c: ["5", "7", "9", "11"], a: 2 },
    { q: "What is the slope of the line through (2, 3) and (6, 11)?",
      c: ["1", "2", "3", "4"], a: 1 },
    { q: "Solve for x: 5x - 11 = 24",
      c: ["5", "6", "7", "8"], a: 2 },
    { q: "A right triangle has legs 6 and 8. The hypotenuse is:",
      c: ["10", "12", "14", "48"], a: 0 },
    { q: "A circle has radius 5. Its area is:",
      c: ["25pi", "10pi", "15pi", "50pi"], a: 0 },
    { q: "What is the volume of a box that is 4 by 3 by 5?",
      c: ["12", "47", "60", "120"], a: 2 },
    { q: "An angle of 35 degrees and its complement add to 90 degrees. The complement is:",
      c: ["45 degrees", "55 degrees", "125 degrees", "145 degrees"], a: 1 },
    { q: "Solve for x: -2x < 10",
      c: ["x < -5", "x > -5", "x < 5", "x > 5"], a: 1 },
    { q: "What is the distance from (0, 0) to (3, 4)?",
      c: ["5", "7", "12", "25"], a: 0 },
    { q: "A circle has radius 7. Its circumference is:",
      c: ["7pi", "14pi", "28pi", "49pi"], a: 1 },
    { q: "What is the volume of a cylinder with radius 2 and height 5?",
      c: ["10pi", "20pi", "40pi", "100pi"], a: 1 }
  ];

  var Q_HS2 = [
    { q: "What is log2(8)?",
      c: ["2", "3", "4", "8"], a: 1 },
    { q: "What is i^2?",
      c: ["1", "-1", "i", "-i"], a: 1 },
    { q: "What is sin(30 degrees)?",
      c: ["1/2", "sqrt(3)/2", "1", "0"], a: 0 },
    { q: "If f(x) = 2x + 1, what is f(5)?",
      c: ["10", "11", "12", "13"], a: 1 },
    { q: "What is log3(81)?",
      c: ["3", "4", "9", "27"], a: 1 },
    { q: "What is i^4?",
      c: ["1", "-1", "i", "4i"], a: 0 },
    { q: "What is cos(0 degrees)?",
      c: ["0", "1", "-1", "1/2"], a: 1 },
    { q: "Solve for x: x^2 = 49",
      c: ["x = 7 only", "x = -7 only", "x = 7 or x = -7", "x = 24.5"], a: 2 },
    { q: "What is the next term in 3, 6, 12, ...?",
      c: ["18", "20", "24", "36"], a: 2 },
    { q: "What is the vertex of y = x^2 - 4x + 3?",
      c: ["(2, -1)", "(-2, 1)", "(4, 3)", "(2, 1)"], a: 0 },
    { q: "What is tan(45 degrees)?",
      c: ["0", "1/2", "1", "sqrt(2)"], a: 2 },
    { q: "If f(x) = 3x and g(x) = x + 1, what is f(g(2))?",
      c: ["7", "8", "9", "10"], a: 2 },
    { q: "Simplify: (2 + i)(2 - i)",
      c: ["3", "4", "5", "4 - i"], a: 2 }
  ];

  var Q_COL1 = [
    { q: "The derivative d/dx of x^3 is:",
      c: ["3x^2", "x^2", "3x", "x^3/3"], a: 0 },
    { q: "The derivative d/dx of 5x^4 is:",
      c: ["20x^3", "5x^3", "20x^4", "x^5"], a: 0 },
    { q: "The indefinite integral of x^2 is:",
      c: ["2x + C", "x^3/3 + C", "x^3 + C", "3x^3 + C"], a: 1 },
    { q: "The limit as x -> 0 of sin(x)/x equals:",
      c: ["0", "1", "Infinity", "Undefined"], a: 1 },
    { q: "The derivative d/dx of sin(x) is:",
      c: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], a: 0 },
    { q: "The limit as x -> 3 of (x^2 - 9)/(x - 3) equals:",
      c: ["0", "3", "6", "9"], a: 2 },
    { q: "The definite integral from 0 to 2 of 3x^2 dx equals:",
      c: ["4", "6", "8", "12"], a: 2 },
    { q: "The derivative d/dx of e^x is:",
      c: ["e^x", "x*e^(x-1)", "e", "1"], a: 0 },
    { q: "The derivative d/dx of (2x + 1)^3 is:",
      c: ["3(2x + 1)^2", "6(2x + 1)^2", "(2x + 1)^2", "6x(2x + 1)^2"], a: 1 },
    { q: "The limit as x -> infinity of 1/x equals:",
      c: ["0", "1", "Infinity", "-1"], a: 0 },
    { q: "The derivative d/dx of ln(x) is:",
      c: ["1/x", "x", "e^x", "ln(x)/x"], a: 0 },
    { q: "The indefinite integral of cos(x) is:",
      c: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "tan(x) + C"], a: 0 },
    { q: "The derivative d/dx of x^2 * sin(x) is:",
      c: ["2x cos(x)", "2x sin(x) + x^2 cos(x)", "x^2 cos(x)", "2x sin(x)"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "The infinite sum 1 + 1/2 + 1/4 + 1/8 + ... equals:",
      c: ["1", "1.5", "2", "Infinity"], a: 2 },
    { q: "The harmonic series 1 + 1/2 + 1/3 + 1/4 + ...:",
      c: ["Converges to 2", "Converges to 1", "Diverges to infinity", "Converges to pi"], a: 2 },
    { q: "The Taylor series for e^x begins:",
      c: ["1 + x + x^2/2 + ...", "x + x^2 + x^3 + ...", "1 + 2x + 3x^2 + ...", "x - x^3/6 + ..."], a: 0 },
    { q: "What is [[1, 2], [3, 4]] times [[5, 6], [7, 8]]?",
      c: ["[[19, 22], [43, 50]]", "[[5, 12], [21, 32]]", "[[23, 34], [31, 46]]", "[[19, 22], [50, 43]]"], a: 0 },
    { q: "The determinant of [[2, 3], [1, 4]] is:",
      c: ["5", "8", "11", "-5"], a: 0 },
    { q: "Multiplying any matrix A by the identity matrix I gives:",
      c: ["A", "I", "The zero matrix", "2A"], a: 0 },
    { q: "In a normal distribution, about what percent of data falls within 2 standard deviations of the mean?",
      c: ["68%", "75%", "95%", "99.7%"], a: 2 },
    { q: "A smaller p-value means:",
      c: ["Stronger evidence against the null hypothesis", "Weaker evidence against the null hypothesis", "The null hypothesis is proven true", "The sample size was too small"], a: 0 },
    { q: "The mean of 2, 4, 6, 8 is:",
      c: ["4", "5", "6", "20"], a: 1 },
    { q: "C(5, 2), the number of ways to choose 2 items from 5, is:",
      c: ["10", "15", "20", "25"], a: 0 },
    { q: "P(4, 2), the number of ordered arrangements of 2 items chosen from 4, is:",
      c: ["6", "8", "12", "16"], a: 2 },
    { q: "The sum from n=1 to infinity of (1/2)^n equals:",
      c: ["0", "1/2", "1", "2"], a: 2 },
    { q: "C(6, 3) equals:",
      c: ["15", "18", "20", "30"], a: 2 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "A cannon fires a ball straight up. Its height in feet after t seconds is h(t) = -16t^2 + 64t. The crew wants to know when the ball reaches its peak and how high it goes.",
      qs: [
        { q: "When does the ball reach its highest point?",
          c: ["1 second", "2 seconds", "4 seconds", "8 seconds"], a: 1 },
        { q: "What is the ball's maximum height?",
          c: ["32 feet", "48 feet", "64 feet", "128 feet"], a: 2 }
      ] },
    { band: 24,
      text: "A farmer has 100 feet of fence to build a rectangular pen against a straight barn wall, so only three sides need fencing. She wants the largest area possible.",
      qs: [
        { q: "What depth (the sides perpendicular to the barn) gives the largest pen?",
          c: ["20 feet", "25 feet", "33 feet", "50 feet"], a: 1 },
        { q: "What is the largest area she can enclose?",
          c: ["1000 sq ft", "1250 sq ft", "2500 sq ft", "5000 sq ft"], a: 1 }
      ] },
    { band: 28,
      text: "In a drug trial, 200 patients took the new drug and 150 recovered; 200 took a placebo and 100 recovered. The researchers computed a p-value of 0.003 for the difference.",
      qs: [
        { q: "What percent of the drug group recovered?",
          c: ["50%", "60%", "75%", "80%"], a: 2 },
        { q: "What does the p-value of 0.003 suggest?",
          c: ["The result is likely due to chance", "Strong evidence the drug works better than placebo", "The trial proved the drug is safe", "The placebo patients recovered more"], a: 1 }
      ] },
    { band: 32,
      text: "A ball is dropped from 10 meters and bounces to half its previous height each time. The scholars of the Infinite Tower want the total distance the ball travels before it stops.",
      qs: [
        { q: "What is the total distance the ball travels?",
          c: ["20 meters", "25 meters", "30 meters", "Infinite"], a: 2 },
        { q: "The bounce heights after the first drop form:",
          c: ["An arithmetic sequence", "A geometric sequence with ratio 1/2", "A geometric sequence with ratio 2", "A harmonic series"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the steps in order to evaluate 2 + 3 x 4^2 - 10 / 2:",
      steps: ["Evaluate the exponent: 4^2 = 16", "Multiply and divide left to right: 3 x 16 = 48, 10 / 2 = 5", "Add and subtract left to right: 2 + 48 - 5", "Final answer: 45"] },
    { band: 24, prompt: "Put the steps in order to solve x^2 + 7x + 10 = 0 by factoring:",
      steps: ["Move all terms to one side so the equation equals zero", "Factor the quadratic: (x + 5)(x + 2)", "Set each factor equal to zero", "Solve to get x = -5 or x = -2"] },
    { band: 28, prompt: "Put the steps in order to integrate 2x(x^2 + 1)^3 dx by u-substitution:",
      steps: ["Let u = x^2 + 1", "Compute du = 2x dx", "Substitute to get the integral of u^3 du", "Integrate and back-substitute: (x^2 + 1)^4 / 4 + C"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "polynomite", name: "Polynomite", icon: "🧮", hp: 34, power: 5, xp: 30, coins: [12, 22] },
    { id: "divideimp", name: "Divide Imp", icon: "➗", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "statwraith", name: "Stat Wraith", icon: "📊", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "infinityelemental", name: "Infinity Elemental", icon: "♾️", hp: 64, power: 8, xp: 54, coins: [18, 34] },
    { id: "dividebyzero", name: "THE DIVIDE-BY-ZERO", icon: "🚫", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am THE DIVIDE-BY-ZERO! Your logic breaks down in my presence! Every equation you cast collapses to... UNDEFINED!",
      outro: "Impossible... undefined... does not compute... The Tower is yours, mathematician!" }
  ];

  var NODES = [
    { id: "math1", name: "Counting Steps", monster: "polynomite" },
    { id: "math2", name: "Fractured Landing", monster: "divideimp" },
    { id: "math3", name: "Probability Parapet", monster: "statwraith" },
    { id: "math4", name: "Infinity Balcony", monster: "infinityelemental" },
    { id: "math5", name: "The Undefined Summit", monster: "dividebyzero", boss: true }
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
  window.SubjectPacks.math = {
    id: "math",
    name: "Math",
    icon: "🔢",
    dungeon: { name: "The Infinite Tower", icon: "🗼",
      desc: "An endless tower of numbers where every floor tests a deeper truth." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 8000, story: 60000, order: 20000, default: 10000 },
      slowMs: { choice: 30000, story: 150000, order: 70000, default: 40000 }
    }
  };
})();
