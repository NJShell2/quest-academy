/* Quest Academy engine: full-screen theatrical story intro.
   A real stage play that fills the viewport: red velvet curtains that
   OPEN, a spotlight, a painted Academy-hall backdrop (banners, candles,
   an arc of the 7 glowing Seals of Knowledge), and a wooden stage floor.
   Professor Wren the guide and THE UNMAKER are animated characters who
   move on stage and talk through scripted dialogue beats across three
   scenes:

     1. Evening in the Grand Hall  (set the scene)
     2. The Unmaker Strikes        (villain confrontation, seal shattering)
     3. The Quest                  (the quest call: Recover the Seven Seals)

   The dialogue is a pure state machine (RQStage.createMachine) over
   RQStage.script(), so tests can drive scene triggers, dialogue
   progression, and skip behavior without a DOM. RQStage.play(onDone)
   renders it full-screen. The first viewing has no skip button;
   replays (save flag stageIntroSeen) get a visible Skip button.
   Completing or skipping sets stageIntroSeen, guideMet, and reveals
   the main quest, then flows into the scripted onboarding. */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* A beat is one step of the play:
       nar:      narration line (no speaker) for stage directions
       speaker:  who talks ("Professor Wren" / "THE UNMAKER" / null)
       icon:     speaker emoji
       line:     the spoken line
       stage:    actor placement changes { wren: pos, unmaker: pos }
                pos: "off-l" | "left" | "center" | "right" | "off-r"
       fx:      stage effect for this beat
                "curtains-open" | "darken" | "shatter" | "scatter" | "spot" | "quest"
       sfx:     name of an RQAudio.SFX sound to play
       cta:     button label override
     Actor placement persists across beats until changed. */
  var SCRIPT = [
    { id: "hall", title: "Evening in the Grand Hall", beats: [
      { nar: "The curtains rise on the Grand Hall of the Academy. Banners hang still. Seven Seals of Knowledge glow in an arc above the hall.",
        fx: "curtains-open", stage: { wren: "off-l", unmaker: "off-r" }, cta: "Watch" },
      { speaker: "Professor Wren", icon: "🦉", stage: { wren: "left" },
        line: "Hoo! Welcome to Quest Academy, scholar. I am Professor Wren, guide of these halls." },
      { speaker: "Professor Wren", icon: "🦉", stage: { wren: "center" },
        line: "Look up: the Seven Seals of Knowledge. Each one guards a dungeon of deep learning. They have lit our halls for a thousand years." },
      { speaker: "Professor Wren", icon: "🦉", stage: { wren: "right" },
        line: "Six heroes train in every subject beneath this roof. You are about to join them. But hush... the candles are flickering. Something is wrong." }
    ] },
    { id: "unmaker", title: "The Unmaker Strikes", beats: [
      { nar: "The hall goes dark. A shadow unfolds from the wings.", fx: "darken" },
      { speaker: "THE UNMAKER", icon: "🌑", stage: { unmaker: "right" },
        line: "I am THE UNMAKER! Knowledge is a light I cannot let stand!", sfx: "boss" },
      { speaker: "THE UNMAKER", icon: "🌑", stage: { unmaker: "center" },
        line: "Seven seals. Seven little flames. Watch me unmake them all!" },
      { speaker: "Professor Wren", icon: "🦉", stage: { wren: "left" },
        line: "Stop! Those seals belong to every scholar who ever learned here! You shall not touch them!" },
      { speaker: "THE UNMAKER", icon: "🌑",
        line: "Then watch them SHATTER!", fx: "shatter", sfx: "hit" },
      { nar: "The seals burst apart. Their shards scatter into the seven dungeons below!", fx: "scatter" },
      { speaker: "THE UNMAKER", icon: "🌑", stage: { unmaker: "off-r" },
        line: "Seven dungeons! Seven bosses guard my broken seals now! None shall learn again! Ha ha ha!" }
    ] },
    { id: "quest", title: "The Quest", beats: [
      { speaker: "Professor Wren", icon: "🦉", fx: "spot", stage: { wren: "center" },
        line: "The seals are gone... but all is not lost. A hero has come. YOU." },
      { speaker: "Professor Wren", icon: "🦉",
        line: "Walk the dungeons. Battle the monsters. Answer to cast, and take back what was stolen." },
      { speaker: "Professor Wren", icon: "🦉", fx: "quest",
        line: "Your quest: RECOVER THE SEVEN SEALS. Seven seals. Seven bosses. One scholar." },
      { speaker: "Professor Wren", icon: "🦉",
        line: "Answer to cast. Learn to win! Your training begins now!", cta: "Begin!" }
    ] }
  ];

  function totalBeats() {
    return SCRIPT.reduce(function (n, sc) { return n + sc.beats.length; }, 0);
  }

  /* ---------- the testable state machine ---------- */
  function createMachine() {
    var m = { scene: 0, beat: 0, done: false };
    m.current = function () {
      if (m.done) return null;
      var sc = SCRIPT[m.scene];
      return { scene: m.scene, beat: m.beat,
               sceneDef: sc, beatDef: sc.beats[m.beat],
               sceneCount: SCRIPT.length, beatCount: sc.beats.length };
    };
    /* Advance one beat. Returns { done, scene, beat }. */
    m.next = function () {
      if (m.done) return { done: true, scene: m.scene, beat: m.beat };
      var sc = SCRIPT[m.scene];
      if (m.beat + 1 < sc.beats.length) { m.beat++; }
      else if (m.scene + 1 < SCRIPT.length) { m.scene++; m.beat = 0; }
      else { m.done = true; }
      return { done: m.done, scene: m.scene, beat: m.beat };
    };
    m.skip = function () {
      m.done = true;
      return { done: true, scene: m.scene, beat: m.beat };
    };
    return m;
  }

  /* ---------- full-screen rendering ---------- */
  var POS_CLS = {
    "off-l": "rq-qf-off-l", "left": "rq-qf-left", "center": "rq-qf-center",
    "right": "rq-qf-right", "off-r": "rq-qf-off-r"
  };

  function play(onDone) {
    var S = window.RQSave, A = window.RQAudio;
    var machine = createMachine();
    var pos = { wren: "off-l", unmaker: "off-r" };
    var finished = false;
    /* Tracked timers: finish() clears them all so no effect can fire
       after the stage is struck. */
    var timers = [];
    function later(ms, fn) {
      var id = setTimeout(function () {
        var ix = timers.indexOf(id);
        if (ix !== -1) timers.splice(ix, 1);
        fn();
      }, ms);
      timers.push(id);
      return id;
    }
    function clearTimers() {
      timers.forEach(function (id) { clearTimeout(id); });
      timers = [];
    }

    var root = el("div", "rq-qffull");
    root.setAttribute("id", "rq-qffull");
    root.innerHTML =
      '<div class="rq-qf-hall">' +
        '<div class="rq-qf-sealrow">' +
          '<span class="rq-qf-seal">🔮</span>'.repeat(7) +
        "</div>" +
        '<div class="rq-qf-bannerl">🚩</div><div class="rq-qf-bannerr">🚩</div>' +
        '<div class="rq-qf-columns">🏛️</div>' +
        '<div class="rq-qf-candles">🕯️ 🕯️ 🕯️ 🕯️ 🕯️</div>' +
      "</div>" +
      '<div class="rq-qf-spotlight"></div>' +
      '<div class="rq-qf-floor"></div>' +
      '<div class="rq-qf-flash"></div>' +
      '<div class="rq-qf-actor rq-qf-wren rq-qf-off-l">🦉</div>' +
      '<div class="rq-qf-actor rq-qf-unmaker rq-qf-off-r">🌑</div>' +
      '<div class="rq-qf-fx"></div>' +
      '<div class="rq-qf-titlecard"></div>' +
      '<div class="rq-qf-dialog">' +
        '<div class="rq-qf-speaker"></div>' +
        '<div class="rq-qf-line"></div>' +
        '<button class="rq-qf-next rq-bigbtn">Next ➜</button>' +
      "</div>" +
      '<div class="rq-qf-valance"></div>' +
      '<div class="rq-qf-curtain rq-qf-curtain-l"></div>' +
      '<div class="rq-qf-curtain rq-qf-curtain-r"></div>';
    /* Replays get a visible Skip button; the first viewing plays through. */
    if (S.data.stageIntroSeen) {
      var skip = el("button", "rq-qf-skip rq-ghostbtn", "Skip intro ➜");
      skip.setAttribute("id", "rq-qf-skip");
      skip.addEventListener("click", function () { finish(true); });
      root.appendChild(skip);
    }
    document.body.appendChild(root);

    var wrenEl = root.querySelector(".rq-qf-wren");
    var unmEl = root.querySelector(".rq-qf-unmaker");
    var fxBox = root.querySelector(".rq-qf-fx");
    var titleCard = root.querySelector(".rq-qf-titlecard");
    var speakerEl = root.querySelector(".rq-qf-speaker");
    var lineEl = root.querySelector(".rq-qf-line");
    var nextBtn = root.querySelector(".rq-qf-next");
    var sealRow = root.querySelector(".rq-qf-sealrow");

    function setPos(elm, p) {
      Object.keys(POS_CLS).forEach(function (k) { elm.classList.remove(POS_CLS[k]); });
      elm.classList.add(POS_CLS[p]);
    }

    function applyFx(fx) {
      if (fx === "darken") root.classList.add("rq-qf-dark");
      if (fx === "spot") root.classList.add("rq-qf-spot-wren");
      if (fx === "shatter") {
        /* White flash, then the seven seals burst one by one. */
        root.classList.add("rq-qf-shatterflash");
        later(600, function () { root.classList.remove("rq-qf-shatterflash"); });
        var seals = sealRow.querySelectorAll(".rq-qf-seal");
        for (var i = 0; i < seals.length; i++) {
          (function (s2, ix) {
            later(350 + ix * 220, function () { s2.textContent = "💥"; });
          })(seals[i], i);
        }
      }
      if (fx === "scatter") {
        for (var k = 0; k < 7; k++) {
          var sh = el("div", "rq-qf-shard rq-qf-scatter" + (k + 1), "🔮");
          fxBox.appendChild(sh);
        }
        later(2600, function () {
          /* Remove children one by one (not innerHTML="") so every
             removed node detaches cleanly. */
          while (fxBox.children.length) fxBox.removeChild(fxBox.children[0]);
        });
      }
      if (fx === "quest") {
        var q = el("div", "rq-qf-questbanner",
          "📜 RECOVER THE SEVEN SEALS<br><span>(0 of 7)</span>");
        fxBox.appendChild(q);
        later(3200, function () { if (q.parentNode === fxBox) fxBox.removeChild(q); });
      }
    }

    function showTitleCard(title) {
      titleCard.textContent = title;
      titleCard.classList.add("rq-qf-show");
      later(1500, function () { titleCard.classList.remove("rq-qf-show"); });
    }

    function renderBeat() {
      var cur = machine.current();
      if (!cur) return;
      var b = cur.beatDef;
      if (cur.beat === 0) showTitleCard(cur.sceneDef.title);
      if (b.stage) {
        if (b.stage.wren) { pos.wren = b.stage.wren; setPos(wrenEl, pos.wren); }
        if (b.stage.unmaker) { pos.unmaker = b.stage.unmaker; setPos(unmEl, pos.unmaker); }
      }
      if (b.fx === "curtains-open") {
        /* Let the closed curtains paint first, then sweep them open. */
        later(120, function () { root.classList.add("rq-qf-open"); });
      } else if (b.fx) {
        applyFx(b.fx);
      }
      if (b.sfx && A.SFX[b.sfx]) { try { A.SFX[b.sfx](); } catch (e) {} }
      var text = b.line || b.nar || "";
      if (b.speaker) {
        speakerEl.textContent = (b.icon ? b.icon + " " : "") + b.speaker;
        if (b.speaker === "THE UNMAKER") speakerEl.classList.add("rq-qf-villain");
        else speakerEl.classList.remove("rq-qf-villain");
      } else {
        speakerEl.textContent = "";
        speakerEl.classList.remove("rq-qf-villain");
      }
      lineEl.textContent = text;
      var isLast = (cur.scene === SCRIPT.length - 1) &&
                   (cur.beat === cur.beatCount - 1);
      nextBtn.textContent = b.cta ? (b.cta + " ➜") : (isLast ? "Begin! ➜" : "Next ➜");
      /* Wren and THE UNMAKER talk: ranked TTS voices read each line. */
      if (text) {
        try {
          A.Speech.stop();
          A.Speech.say(text, b.speaker === "THE UNMAKER"
            ? { rate: 0.85, pitch: 0.7 } : { rate: 0.98, pitch: 1.1 });
        } catch (e) {}
      }
    }

    function finish(skipped) {
      if (finished) return;
      finished = true;
      machine.skip();
      try { A.Speech.stop(); } catch (e) {}
      try {
        S.data.stageIntroSeen = true;
        S.data.guideMet = true;
        if (!S.data.quests) S.data.quests = {};
        S.data.quests.main = { id: "seals", title: "Recover the Seven Seals of Knowledge",
                              revealed: true };
        S.write();
      } catch (e) {}
      /* Curtains sweep shut, then the stage is struck. Pending
         effects are cancelled first so nothing fires afterwards. */
      clearTimers();
      root.classList.remove("rq-qf-open");
      setTimeout(function () {
        if (root.parentNode) root.parentNode.removeChild(root);
        if (onDone) onDone();
      }, 700);
    }

    nextBtn.addEventListener("click", function () {
      try { A.ensure(); A.SFX.click(); } catch (e) {}
      var r = machine.next();
      if (r.done) finish(false);
      else renderBeat();
    });

    renderBeat();
  }

  window.RQStage = {
    script: function () { return SCRIPT; },
    totalBeats: totalBeats,
    createMachine: createMachine,
    play: play
  };
})();
