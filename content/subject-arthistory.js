/* ============================================================
   QUEST ACADEMY - Art History content pack (ELECTIVE)
   High school through college art history. Tiers 17-32.
   Includes AP Art History depth in the upper bands.
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
     Bands: 17-20 grades 9-10 (elements, prehistoric, Egypt, Greece),
            21-24 grades 11-12 (Renaissance, Baroque, Impressionism),
            25-28 college years 1-2 (modernism through Abstract Expressionism),
            29-32 college years 3-4 (politics, non-Western, contemporary, architecture). */
  var Q_HS1 = [
    { q: "Which element of art is a continuous mark made on a surface?",
      c: ["Value", "Line", "Texture", "Space"], a: 1 },
    { q: "Which of these is NOT one of the elements of art?",
      c: ["Line", "Color", "Theme", "Texture"], a: 2 },
    { q: "Red, orange, and yellow are grouped together as:",
      c: ["Cool colors", "Warm colors", "Neutral colors", "Complementary pairs"], a: 1 },
    { q: "Shape is two-dimensional, while form is:",
      c: ["Also two-dimensional", "Three-dimensional", "Always abstract", "Made only of straight lines"], a: 1 },
    { q: "The Lascaux cave paintings, made around 17,000 years ago, are located in:",
      c: ["Italy", "France", "Egypt", "Greece"], a: 1 },
    { q: "The Lascaux cave paintings are best known for their images of:",
      c: ["Pharaohs", "Animals", "Gods at war", "Abstract grids"], a: 1 },
    { q: "The pyramids of Giza were built as:",
      c: ["Granaries", "Tombs for pharaohs", "Temples to the sun only", "Fortresses"], a: 1 },
    { q: "Egyptian hieroglyphs are:",
      c: ["A picture-based writing system", "Musical notation", "Architectural blueprints", "A number system only"], a: 0 },
    { q: "The Parthenon in Athens was built as a temple honoring:",
      c: ["Zeus", "Athena", "Apollo", "Hades"], a: 1 }
  ];

  var Q_HS2 = [
    { q: "The Mona Lisa was painted by:",
      c: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"], a: 2 },
    { q: "Leonardo da Vinci's Last Supper was painted:",
      c: ["On a wood panel in Florence", "On a monastery dining hall wall in Milan", "On the Sistine Chapel ceiling", "On a portable canvas"], a: 1 },
    { q: "Michelangelo's David is carved from:",
      c: ["Bronze", "Marble", "Wood", "Granite"], a: 1 },
    { q: "The ceiling of the Sistine Chapel was painted by Michelangelo between:",
      c: ["1492 and 1496", "1508 and 1512", "1520 and 1524", "1540 and 1544"], a: 1 },
    { q: "Caravaggio is famous for chiaroscuro, which means:",
      c: ["Painting only in pastels", "Dramatic contrasts of light and dark", "Using gold leaf", "Painting on copper"], a: 1 },
    { q: "Rembrandt's The Night Watch belongs to which movement?",
      c: ["Dutch Baroque", "French Rococo", "Italian Mannerism", "German Expressionism"], a: 0 },
    { q: "Impressionism gets its name from Claude Monet's painting:",
      c: ["Water Lilies", "Impression, Sunrise", "The Starry Night", "Luncheon of the Boating Party"], a: 1 },
    { q: "Plein air painting means:",
      c: ["Painting outdoors", "Painting from memory", "Painting in a studio", "Painting on plaster"], a: 0 },
    { q: "Renoir, an Impressionist, is best known for scenes of:",
      c: ["Battlefields", "Leisure and social life", "Religious martyrdom", "Industrial factories"], a: 1 }
  ];

  var Q_COL1 = [
    { q: "Van Gogh painted The Starry Night in 1889 while:",
      c: ["Traveling in Japan", "Staying in an asylum at Saint-Remy", "Studying in Paris", "Living in London"], a: 1 },
    { q: "Seurat's pointillism builds images from:",
      c: ["Thick palette-knife strokes", "Small dots of pure color", "Torn paper collage", "Gold leaf tiles"], a: 1 },
    { q: "Picasso's Les Demoiselles d'Avignon (1907) is a landmark of:",
      c: ["Fauvism", "Dada", "Early Cubism", "Pop Art"], a: 2 },
    { q: "A defining Cubist technique is showing:",
      c: ["One perfect viewpoint", "Multiple viewpoints at once", "Only landscapes", "No human figures"], a: 1 },
    { q: "Dali's The Persistence of Memory (1931) is famous for its:",
      c: ["Dripped house paint", "Melting clocks", "Soup cans", "Dotted water lilies"], a: 1 },
    { q: "Surrealism drew heavily on the theories of:",
      c: ["Sigmund Freud", "Charles Darwin", "Karl Marx", "Isaac Newton"], a: 0 },
    { q: "Jackson Pollock is best known for:",
      c: ["Color field rectangles", "Drip painting", "Photorealism", "Stained glass"], a: 1 },
    { q: "Mark Rothko's paintings are large fields of:",
      c: ["Dotted color", "Luminous rectangular color", "Black ink brushwork", "Photographic collage"], a: 1 },
    { q: "Abstract Expressionism emerged after World War II with its center in:",
      c: ["Paris", "New York", "Berlin", "Moscow"], a: 1 }
  ];

  var Q_COL2 = [
    { q: "Picasso's Guernica (1937) was painted in response to:",
      c: ["World War I", "The bombing of a Basque town in the Spanish Civil War", "The Great Depression", "The French Revolution"], a: 1 },
    { q: "Guernica is painted almost entirely in:",
      c: ["Bright primary colors", "Black, white, and gray", "Gold and blue", "Pastels"], a: 1 },
    { q: "Hokusai's The Great Wave off Kanagawa is a:",
      c: ["Japanese woodblock print", "Chinese scroll painting", "Korean bronze", "Indian miniature"], a: 0 },
    { q: "The Great Wave belongs to the ukiyo-e tradition, which means:",
      c: ["Pictures of the floating world", "Imperial court portraits", "Zen ink landscapes", "Buddhist temple murals"], a: 0 },
    { q: "Japanese prints strongly influenced which European movement?",
      c: ["The Impressionists", "The Hudson River School", "Socialist Realism", "The Pre-Raphaelites"], a: 0 },
    { q: "African masks and sculpture directly influenced:",
      c: ["The Hudson River School", "Picasso and the birth of Cubism", "Rococo interiors", "Byzantine mosaics"], a: 1 },
    { q: "Warhol's Campbell's Soup Cans (1962) is a landmark of:",
      c: ["Pop Art", "Minimalism", "Abstract Expressionism", "Arte Povera"], a: 0 },
    { q: "The Bauhaus school was founded in 1919 by:",
      c: ["Frank Lloyd Wright", "Walter Gropius", "Le Corbusier", "Mies van der Rohe"], a: 1 },
    { q: "The Bauhaus was shut down in 1933 by:",
      c: ["A fire", "The Nazis", "Bankruptcy", "A student strike"], a: 1 }
  ];

  /* ---------------- story passages ---------------- */
  var STORIES = [
    { band: 20,
      text: "You enter a tomb chamber. On the wall, figures march in a row, each drawn with a frontal eye on a profile face. Above them runs a band of small pictures: birds, snakes, eyes, and reed shapes arranged in neat rows. The guide says the pictures are also writing, and everything in the room was made to serve the dead in the afterlife.",
      qs: [
        { q: "Which civilization made this tomb art?",
          c: ["Ancient Greece", "Ancient Egypt", "Imperial Rome", "The Maya"], a: 1 },
        { q: "The picture-writing on the wall is called:",
          c: ["Cuneiform", "Hieroglyphs", "Kanji", "Runes"], a: 1 }
      ] },
    { band: 26,
      text: "You stand before a large canvas of a riverbank at noon. Nothing is blended: the water is built from separate dabs of blue, green, and white, and the sunlight shimmers because your eye mixes the colors itself. A placard notes the artist carried the canvas outside and finished it in one sitting, racing the changing light.",
      qs: [
        { q: "Which movement does this painting belong to?",
          c: ["Baroque", "Impressionism", "Surrealism", "Minimalism"], a: 1 },
        { q: "The technique of painting finished works outdoors is called:",
          c: ["Fresco", "Plein air", "Grisaille", "Tempera"], a: 1 }
      ] },
    { band: 32,
      text: "The gallery goes quiet at the last canvas. It is huge and almost entirely black, white, and gray. A screaming horse rears under a harsh lightbulb eye; a fallen soldier clutches a broken sword; a bull looms over a wailing mother. A placard explains the artist painted it in weeks after warplanes destroyed a Basque market town in 1937.",
      qs: [
        { q: "This painting is Picasso's:",
          c: ["Guernica", "Les Demoiselles d'Avignon", "The Old Guitarist", "The Weeping Woman"], a: 0 },
        { q: "Why did Picasso restrict the palette to black, white, and gray?",
          c: ["He ran out of color", "To echo newsprint and documentary horror", "The patron demanded it", "It was painted at night"], a: 1 }
      ] }
  ];

  /* ---------------- order sequences ---------------- */
  var ORDERS = [
    { band: 22, prompt: "Put these art periods in chronological order, oldest first:",
      steps: ["Prehistoric cave painting", "Classical Greek temples", "Renaissance masterpieces", "Baroque drama"] },
    { band: 28, prompt: "Put the steps of fresco painting in order:",
      steps: ["Apply the rough plaster coat (arriccio)", "Sketch the design (sinopia)", "Lay a fresh patch of wet fine plaster (intonaco)", "Paint pigments in water onto the wet plaster"] },
    { band: 32, prompt: "Put these modern art movements in order, earliest first:",
      steps: ["Impressionism", "Cubism", "Surrealism", "Abstract Expressionism"] }
  ];

  /* ---------------- monsters, dungeon, boss ---------------- */
  var MONSTERS = [
    { id: "framefiend", name: "Frame Fiend", icon: "🖼️", hp: 42, power: 6, xp: 38, coins: [14, 26] },
    { id: "varnishviper", name: "Varnish Viper", icon: "🐍", hp: 58, power: 8, xp: 48, coins: [16, 30] },
    { id: "theforger", name: "THE FORGER", icon: "🎨", hp: 150, power: 10, xp: 120, coins: [50, 90],
      boss: true,
      intro: "I am THE FORGER! Every masterpiece here is my copy, my lie! Prove you know the real from the fake, or vanish into the varnish!",
      outro: "No... my brush... drops... You see through every forgery. The Grand Gallery is yours, true connoisseur!" }
  ];

  var NODES = [
    { id: "art1", name: "Marble Entrance", monster: "framefiend" },
    { id: "art2", name: "Hall of Masters", monster: "varnishviper" },
    { id: "art3", name: "The Forger's Vault", monster: "theforger", boss: true }
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
  window.SubjectPacks.arthistory = {
    id: "arthistory",
    name: "Art History",
    icon: "🖼️",
    elective: true,
    dungeon: { name: "The Grand Gallery", icon: "🏛️",
      desc: "An endless museum hall where forged masterpieces stalk the frames." },
    monsters: MONSTERS,
    nodes: NODES,
    gens: [choiceGen, choiceGen, storyGen, orderGen],
    pacing: {
      fastMs: { choice: 4000, story: 55000, order: 15000, default: 6000 },
      slowMs: { choice: 20000, story: 140000, order: 60000, default: 30000 }
    }
  };
})();
