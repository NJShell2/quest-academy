/* ============================================================
   QUEST ACADEMY - Business content pack
   High school through college business. Tiers 17-32.
   Absorbs the business electives: entrepreneurship, accounting,
   marketing, and personal finance.
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
     Bands: 17-20 grades 9-10 (entrepreneurship, ownership types,
            supply and demand, budgeting),
            21-24 grades 11-12 (accounting equation, debits/credits,
            the 4 Ps, personal finance),
            25-28 college years 1-2 (financial statements, marketing
            strategy, microeconomics, investing),
            29-32 college years 3-4 (advanced accounting, corporate
            finance, business law, global business). */
  var Q_HS1 = [
    { q: "Entrepreneurship means:",
      c: ["Working for the government", "Starting and running a business, taking on its risks", "Buying only stocks", "Managing someone else's store"], a: 1 },
    { q: "In a sole proprietorship, who is personally responsible for the business's debts?",
      c: ["The owner personally", "No one, the business is separate", "Only the employees", "The state government"], a: 0 },
    { q: "A partnership is owned by:",
      c: ["One person", "The government", "Two or more people sharing profits and losses", "Shareholders who never meet"], a: 2 },
    { q: "A corporation is best described as:",
      c: ["A business owned by one family", "A separate legal entity owned by shareholders", "A loan from a bank", "A type of tax form"], a: 1 },
    { q: "An LLC combines limited liability for owners with:",
      c: ["Double taxation", "Unlimited personal liability", "Pass-through taxation", "Government ownership"], a: 2 },
    { q: "The law of demand says that when a price rises, the quantity demanded usually:",
      c: ["Rises", "Falls", "Stays exactly the same", "Doubles"], a: 1 },
    { q: "The equilibrium price is the price where:",
      c: ["Only sellers are happy", "Quantity supplied equals quantity demanded", "The government sets the price", "Demand is zero"], a: 1 },
    { q: "If demand for a product rises while supply stays the same, the price tends to:",
      c: ["Fall", "Stay the same", "Rise", "Become illegal"], a: 2 },
    { q: "Profit equals:",
      c: ["Revenue minus expenses", "Revenue plus expenses", "Expenses minus revenue", "Taxes plus revenue"], a: 0 },
    { q: "A budget is:",
      c: ["A type of bank loan", "A plan for how to spend and save money", "A stock certificate", "A tax penalty"], a: 1 },
    { q: "Which of these is a FIXED expense?",
      c: ["Monthly rent", "Groceries", "Eating out", "Vacation spending"], a: 0 },
    { q: "Which of these is a VARIABLE expense?",
      c: ["Monthly rent", "Car payment", "Groceries", "Insurance premium"], a: 2 },
    { q: "A good first step when building a budget is to:",
      c: ["Track what you earn and spend", "Apply for a credit card", "Invest in stocks", "Stop all spending"], a: 0 },
    { q: "Which ownership type is simplest to start but offers no liability protection?",
      c: ["Corporation", "LLC", "Sole proprietorship", "Nonprofit"], a: 2 }
  ];

  var Q_HS2 = [
    { q: "The accounting equation is:",
      c: ["Assets = Liabilities - Equity", "Assets = Liabilities + Equity", "Liabilities = Assets + Equity", "Equity = Assets - Revenue"], a: 1 },
    { q: "In double-entry accounting, every transaction affects:",
      c: ["Only one account", "At least two accounts", "Only cash", "Only revenue"], a: 1 },
    { q: "An INCREASE in an asset account is recorded as a:",
      c: ["Credit", "Debit", "Discount", "Dividend"], a: 1 },
    { q: "An INCREASE in a liability account is recorded as a:",
      c: ["Debit", "Credit", "Loss", "Write-off"], a: 1 },
    { q: "Which account normally has a DEBIT balance?",
      c: ["Cash", "Accounts payable", "Owner's capital", "Sales revenue"], a: 0 },
    { q: "Revenue accounts normally have a:",
      c: ["Debit balance", "Credit balance", "Zero balance", "Negative balance only"], a: 1 },
    { q: "The 4 Ps of marketing are:",
      c: ["Product, Price, Place, Promotion", "Profit, People, Paper, Planes", "Plan, Price, Profit, Place", "Product, Profit, Promotion, People"], a: 0 },
    { q: "In the 4 Ps, 'place' refers to:",
      c: ["The factory's address", "How and where customers buy the product", "The CEO's office", "A warehouse only"], a: 1 },
    { q: "In the 4 Ps, 'promotion' covers:",
      c: ["Hiring staff", "Advertising and sales offers", "Setting the price", "Choosing store locations"], a: 1 },
    { q: "$1,000 at 5% simple interest per year earns how much in one year?",
      c: ["$5", "$50", "$500", "$1,050 in interest"], a: 1 },
    { q: "A credit score is mainly used to judge:",
      c: ["How much cash you carry", "How likely you are to repay borrowed money", "Your salary", "Your age"], a: 1 },
    { q: "FICO credit scores range roughly from:",
      c: ["0 to 100", "300 to 850", "100 to 500", "1 to 10"], a: 1 },
    { q: "Paying only the minimum on a credit card balance leads to:",
      c: ["Paying much more in interest over time", "A higher credit limit at once", "No interest charges", "A free balance transfer"], a: 0 },
    { q: "The 50/30/20 budgeting rule suggests saving about:",
      c: ["5% of income", "20% of income", "50% of income", "100% of income"], a: 1 }
  ];

  var Q_COL1 = [
    { q: "The balance sheet shows a company's financial position:",
      c: ["Over a whole year", "At a specific point in time", "Only in the future", "Only for taxes"], a: 1 },
    { q: "The income statement reports:",
      c: ["Assets and liabilities", "Revenues and expenses over a period", "Only cash on hand", "Stock prices"], a: 1 },
    { q: "Net income equals:",
      c: ["Revenues minus expenses", "Assets minus liabilities", "Cash minus debt", "Equity plus liabilities"], a: 0 },
    { q: "Gross profit equals:",
      c: ["Net income minus taxes", "Sales revenue minus cost of goods sold", "Assets minus equity", "Revenue plus expenses"], a: 1 },
    { q: "Which financial statement lists assets, liabilities, and equity?",
      c: ["Income statement", "Statement of cash flows", "Balance sheet", "Tax return"], a: 2 },
    { q: "Market segmentation means:",
      c: ["Selling only one product", "Dividing customers into groups with similar needs", "Cutting prices for everyone", "Closing stores"], a: 1 },
    { q: "Opportunity cost is:",
      c: ["The price tag on an item", "The value of the best alternative you give up", "The cost of shipping", "A sunk cost"], a: 1 },
    { q: "Price elasticity of demand measures:",
      c: ["How much quantity demanded responds to a price change", "Total company profit", "The inflation rate", "Supply chain length"], a: 0 },
    { q: "Demand for necessities like insulin is usually:",
      c: ["Elastic", "Inelastic", "Perfectly elastic", "Zero"], a: 1 },
    { q: "If a good has many close substitutes, its demand is likely:",
      c: ["Inelastic", "Elastic", "Unaffected by price", "Illegal to sell"], a: 1 },
    { q: "A share of stock represents:",
      c: ["A loan to the company", "Ownership in the company", "A tax bill", "A coupon"], a: 1 },
    { q: "A bond represents:",
      c: ["Ownership in the company", "A loan to a company or government", "A stock option", "Insurance"], a: 1 },
    { q: "Compared with bonds, stocks generally offer:",
      c: ["Higher potential return with higher risk", "Guaranteed returns", "Lower risk and lower return", "No possible losses"], a: 0 },
    { q: "Diversification in investing means:",
      c: ["Buying only one stock", "Spreading money across different investments to reduce risk", "Selling everything at once", "Borrowing to invest more"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "Depreciation is the process of:",
      c: ["Raising an asset's value", "Allocating an asset's cost over its useful life", "Selling an asset for cash", "Paying off a loan"], a: 1 },
    { q: "Straight-line depreciation on a $10,000 machine with a 5-year life and no salvage value is:",
      c: ["$10,000 per year", "$5,000 per year", "$2,000 per year", "$500 per year"], a: 2 },
    { q: "Accumulated depreciation is a:",
      c: ["Liability account", "Contra-asset account that reduces total assets", "Revenue account", "Cash account"], a: 1 },
    { q: "Depreciation expense affects:",
      c: ["Cash flow directly", "Net income but not cash flow", "Only the balance sheet's cash", "Nothing at all"], a: 1 },
    { q: "Under accrual accounting, revenue is recorded:",
      c: ["When cash is received", "When it is earned", "Only at year end", "When the customer promises to pay someday"], a: 1 },
    { q: "The matching principle says expenses should be recorded:",
      c: ["In the same period as the revenue they helped earn", "Only when paid in cash", "In the next fiscal year", "Before any revenue is recorded"], a: 0 },
    { q: "Net present value (NPV) equals:",
      c: ["Total revenue minus total cost", "Present value of future cash flows minus the initial investment", "Profit divided by assets", "Cash on hand plus inventory"], a: 1 },
    { q: "A positive NPV means the project:",
      c: ["Will lose money", "Is expected to create value and is worth doing", "Has no risk", "Breaks even exactly"], a: 1 },
    { q: "The risk-return tradeoff says:",
      c: ["Higher potential returns usually come with higher risk", "Risk and return are unrelated", "Low risk always means high return", "Returns are guaranteed"], a: 0 },
    { q: "For a contract to be valid, it generally needs:",
      c: ["A handshake only", "Offer, acceptance, and consideration", "A lawyer's signature", "Government approval"], a: 1 },
    { q: "'Consideration' in contract law means:",
      c: ["Thinking carefully", "Something of value exchanged by each party", "A verbal promise only", "A discount"], a: 1 },
    { q: "A tariff is:",
      c: ["A tax on imported goods", "A ban on all trade", "A type of stock", "A shipping discount"], a: 0 },
    { q: "An exchange rate is:",
      c: ["A stock market fee", "The price of one currency in terms of another", "An interest rate", "A trade ban"], a: 1 },
    { q: "Compared with a sole proprietorship, a corporation's key advantage for raising capital is:",
      c: ["It pays no taxes", "It can sell shares of stock to investors", "It needs no records", "It cannot be sued"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "Sofia sells handmade bracelets at a weekend market. At $10 each she sells 40 bracelets, but she runs out by noon. At $15 each she sells 24 and has leftovers. Her materials cost $4 per bracelet. She wants to pick a price that balances demand with her limited supply.",
      qs: [
        { q: "Why did Sofia sell out faster at $10 than at $15?",
          c: ["The law of demand: lower price, higher quantity demanded", "Bracelets are a necessity", "Her costs changed", "Supply increased"], a: 0 },
        { q: "If Sofia raises her price to $15, her profit PER bracelet becomes:",
          c: ["$4", "$10", "$11", "$15"], a: 2 }
      ] },
    { band: 24,
      text: "Marcus tracks one month of spending. Income: $2,400 from his part-time job. Expenses: rent $900, groceries $350, car insurance $120, phone $60, eating out $180, clothes $150, savings $0. He is surprised that his account is nearly empty, because he thought he was being careful.",
      qs: [
        { q: "What is Marcus's total spending for the month?",
          c: ["$1,560", "$1,760", "$2,400", "$2,000"], a: 1 },
        { q: "The biggest leak Marcus could cut first is:",
          c: ["Rent, by moving", "Eating out at $180", "Car insurance", "His phone bill"], a: 1 }
      ] },
    { band: 28,
      text: "Bloom Bakery's year-end numbers: sales revenue $500,000, cost of ingredients and labor $300,000, rent and other operating expenses $120,000. On its balance sheet it lists ovens and equipment worth $200,000, a bank loan of $80,000, and the owners' equity makes up the rest.",
      qs: [
        { q: "Bloom Bakery's net income for the year is:",
          c: ["$500,000", "$200,000", "$80,000", "$120,000"], a: 2 },
        { q: "Using the accounting equation, the owners' equity is:",
          c: ["$280,000", "$120,000", "$200,000", "$80,000"], a: 1 }
      ] },
    { band: 32,
      text: "GreenCart is choosing between two delivery vans. Van A costs $40,000 now and is expected to generate $12,000 per year in extra profit for 5 years. Van B costs $40,000 now and is expected to generate $10,000 per year for 6 years. The finance team discounts future cash flows at 8% and computes each van's net present value before deciding.",
      qs: [
        { q: "Why does the finance team discount future cash flows instead of just adding them up?",
          c: ["To make the numbers smaller", "Because a dollar today is worth more than a dollar later", "Discounts are required by law", "To hide the true profit"], a: 1 },
        { q: "If only one van has a positive NPV, GreenCart should:",
          c: ["Buy the cheaper van", "Buy the van with the positive NPV", "Buy neither van", "Buy both vans"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 20, prompt: "Put the steps to build a budget in order, from first to last:",
      steps: ["Track income and expenses", "Set spending categories and limits", "Compare actual spending to the plan", "Adjust the plan and save the difference"] },
    { band: 24, prompt: "Put the accounting cycle in order, from first to last:",
      steps: ["Record transactions in the journal", "Post journal entries to the ledger", "Prepare a trial balance", "Prepare the financial statements"] },
    { band: 28, prompt: "Put the marketing funnel in order, from first to last:",
      steps: ["Awareness: customers discover the brand", "Interest: customers learn about the product", "Desire: customers want the product", "Action: customers make the purchase"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "couponimp", name: "Coupon Imp", icon: "🧾", hp: 34, power: 5, xp: 30, coins: [12, 22] },
    { id: "debtghoul", name: "Debt Ghoul", icon: "💸", hp: 44, power: 6, xp: 38, coins: [14, 26] },
    { id: "ledgerlurker", name: "Ledger Lurker", icon: "📒", hp: 54, power: 7, xp: 46, coins: [16, 30] },
    { id: "bullbrawler", name: "Bull Market Brawler", icon: "🐂", hp: 64, power: 8, xp: 54, coins: [18, 34] },
    { id: "monopolist", name: "THE MONOPOLIST", icon: "👑", hp: 170, power: 10, xp: 130, coins: [60, 100],
      boss: true,
      intro: "I am THE MONOPOLIST! I own every stall in this market, and I set the prices! Your little ledger cannot stop me!",
      outro: "Defeated... by fair competition... and sound accounting... The Exchange is yours, entrepreneur!" }
  ];

  var NODES = [
    { id: "biz1", name: "Penny Arcade Entry", monster: "couponimp" },
    { id: "biz2", name: "Red Ink Corridor", monster: "debtghoul" },
    { id: "biz3", name: "Balanced Books Hall", monster: "ledgerlurker" },
    { id: "biz4", name: "Trading Floor", monster: "bullbrawler" },
    { id: "biz5", name: "The Monopolist's Vault", monster: "monopolist", boss: true }
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
  window.SubjectPacks.business = {
    id: "business",
    name: "Business",
    icon: "💼",
    dungeon: { name: "The Gilded Exchange", icon: "💰",
      desc: "A golden marketplace where shrewd traders battle over every coin." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 5000, story: 50000, order: 15000, default: 6000 },
      slowMs: { choice: 22000, story: 130000, order: 60000, default: 30000 }
    }
  };
})();
